// ==UserScript==
// @name              ChatGPT Realtime Model Switcher: 4o-mini, o4-mini, o3 and more!
// @name:zh-CN        ChatGPT 模型切换助手: 4o-mini、o4-mini、o3 等更多...
// @name:zh-TW        ChatGPT 模型切換助手: 4o-mini、o4-mini、o3 等更多...
// @namespace         http://tampermonkey.net/
// @version           0.54.1
// @description       Allowing you to switch models during a single conversation, and highlight responses by color based on the model generating them
// @description:zh-CN 让您在对话中随意切换语言模型，并用不同颜色标示生成回应的语言模型
// @description:zh-TW 讓您在對話中隨意切換語言模型，並用不同顏色標示生成回答的語言模型
// @match             *://chatgpt.com/*
// @author            d0gkiller87
// @license           MIT
// @grant             unsafeWindow
// @grant             GM.getValue
// @grant             GM.setValue
// @grant             GM.deleteValue
// @grant             GM_registerMenuCommand
// @grant             GM.registerMenuCommand
// @grant             GM.unregisterMenuCommand
// @run-at            document-idle
// @icon              https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @downloadURL https://update.greasyfork.org/scripts/514276/ChatGPT%20Realtime%20Model%20Switcher%3A%204o-mini%2C%20o4-mini%2C%20o3%20and%20more%21.user.js
// @updateURL https://update.greasyfork.org/scripts/514276/ChatGPT%20Realtime%20Model%20Switcher%3A%204o-mini%2C%20o4-mini%2C%20o3%20and%20more%21.meta.js
// ==/UserScript==

(async function() {
  'use strict';

  function injectStyle( style, isDisabled = false ) {
    const styleNode = document.createElement( 'style' );
    styleNode.type = 'text/css';
    styleNode.textContent = style;
    document.head.appendChild( styleNode );
    styleNode.disabled = isDisabled;
    return styleNode;
  }

  const PlanType = Object.freeze({
    free: 0,
    plus: 1,
    pro : 2
  });

  class ModelSwitcher {
    getPlanType() {
      for ( const scriptNode of document.querySelectorAll( 'script' ) ) {
        let match;
        while ( ( match = /\\"planType\\"\s*,\s*\\"(\w+?)\\"/.exec( scriptNode.innerHTML ) ) !== null ) {
          return match[1];
        }
      }
      return 'free'
    }

    async init() {
      this.model = await GM.getValue( 'model', 'auto' );
      this.buttons = {};
      this.offsetX = 0;
      this.offsetY = 0;
      this.isDragging = false;
      this.shouldCancelClick = false;
      this.modelSelector = null;
      this.isMenuVisible = await GM.getValue( 'isMenuVisible', true );
      this.isMenuVisibleCommandId = null;
      this.modelHighlightStyleNode = null;
      this.isModelHighlightEnabled = await GM.getValue( 'isModelHighlightEnabled', true );
      this.isModelHighlightEnabledCommandId = null;
      this.isMenuVertical = await GM.getValue( 'isMenuVertical', true );
      this.isMenuVerticalCommandId = null;
      this.conversationUrlRegex = new RegExp( /https:\/\/chatgpt\.com\/backend-api\/.*conversation/ );

      const planType = PlanType[ this.getPlanType() ];

      const models = [
        // [ PlanType.pro, "o1", "o1" ], // retired
        [ PlanType.pro, "o1-pro", "o1-pro" ],
        // [ PlanType.free, "o3-mini", "o3-mini" ], // retired
        [ PlanType.plus, "o3", "o3" ],
        [ PlanType.free, "o4-mini", "o4-mini" ],
        [ PlanType.plus, "o4-mini-high", "o4-mini-high" ],
        [ PlanType.free, "gpt-3.5", "gpt-3-5" ],
        [ PlanType.free, "4o-mini", "gpt-4o-mini" ],
        [ PlanType.free, "4.1-mini", "gpt-4-1-mini" ],
        // [ PlanType.free, "gpt-4", "gpt-4" ], // same as 4o
        [ PlanType.free, "gpt-4o", "gpt-4o" ],
        [ PlanType.plus, "gpt-4.1", "gpt-4-1" ],
        // [ PlanType.plus, "4o-jawbone", "4o-jawbone" ], // retired (https://x.com/testingcatalog/status/1915483050953125965)
        [ PlanType.plus, "gpt-4.5", "gpt-4-5" ],
        [ PlanType.free, "default", "auto" ],
      ];

      this.availableModels = {};
      for ( const [ minimumPlan, modelName, modelValue ] of models ) {
        if ( planType >= minimumPlan ) {
          this.availableModels[modelName] = modelValue;
        }
      }
    }

    hookFetch() {
      const originalFetch = unsafeWindow.fetch;
      unsafeWindow.fetch = async ( resource, config = {} ) => {
        if (
          typeof resource === 'string' &&
          resource.match( this.conversationUrlRegex ) &&
          config.method === 'POST' &&
          config.headers &&
          config.headers['Content-Type'] === 'application/json' &&
          config.body &&
          this.model !== 'auto'
        ) {
          const body = JSON.parse( config.body );
          body.model = this.model;
          config.body = JSON.stringify( body );
        }
        return originalFetch( resource, config );
      };
    }

    injectToggleButtonStyle() {
      let style = `
        :root {
          color-scheme: light dark;
        }
        #model-selector {
          position: absolute;
          display: flex;
          flex-direction: column;
          gap: 6px;
          cursor: grab;
        }
        #model-selector.horizontal {
          flex-direction: row;
        }
        #model-selector.hidden {
          display: none;
        }
        #model-selector button {
          background: none;
          border: 1px solid light-dark(#151515, white);
          color: light-dark(#151515, white);
          padding: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          user-select: none;
        }
        #model-selector button.selected {
          color: light-dark(white, white);
        }
        :root {
          --o1-pro-color: 139, 232, 27;
          --o3-color: 139, 232, 27;
          --gpt-3-5-color: 0, 106, 129;
          --gpt-4-1-color: 13, 121, 255;
          --gpt-4-5-color: 126, 3, 165;
          --gpt-4o-color: 18, 45, 134;
          --o4-mini-high-color: 176, 53, 0;
          --o4-mini-color: 203, 91, 0;
          --gpt-4o-jawbone-color: 201, 42, 42;
          --gpt-4o-mini-color: 67, 162, 90;
          --gpt-4-1-mini-color: 117, 166, 12;
          --auto-color: 131, 131, 139;

          --unknown-model-btn-color: 67, 162, 90;
          --unknown-model-box-shadow-color: 48, 255, 19;
        }
      `;

      for ( const model of Object.values( this.availableModels ) ) {
        style += `
          #model-selector button.btn-${ model } {
            background-color: rgb(var(--${ model }-color, var(--unknown-model-btn-color)));
          }
        `;
      }

      injectStyle( style );
    }

    refreshButtons() {
      for ( const [ model, button ] of Object.entries( this.buttons ) ) {
        const isSelected = model === `btn-${ this.model }`;
        button.classList.toggle( model, isSelected );
        button.classList.toggle( 'selected', isSelected );
      }
    }

    async reloadMenuVisibleToggle() {
      this.isMenuVisibleCommandId = await GM.registerMenuCommand(
        `${ this.isMenuVisible ? '☑︎' : '☐' } Show model selector`,
        async () => {
          this.isMenuVisible = !this.isMenuVisible;
          await GM.setValue( 'isMenuVisible', this.isMenuVisible );
          this.modelSelector.classList.toggle( 'hidden', !this.isMenuVisible );
          this.reloadMenuVisibleToggle();
        },
        this.isMenuVisibleCommandId ? { id: this.isMenuVisibleCommandId } : {}
      );
    }

    async reloadMenuVerticalToggle() {
      this.isMenuVerticalCommandId = await GM.registerMenuCommand(
        `┖ Style: ${ this.isMenuVertical ? 'vertical ↕' : 'horizontal ↔' }`,
        async () => {
          this.isMenuVertical = !this.isMenuVertical;
          await GM.setValue( 'isMenuVertical', this.isMenuVertical );

          const originalRight = parseInt( this.modelSelector.style.left ) + this.modelSelector.offsetWidth;
          const originalBottom = parseInt( this.modelSelector.style.top ) + this.modelSelector.offsetHeight;

          this.modelSelector.style.visibility = 'hidden';
          this.modelSelector.style.left = '0px';
          this.modelSelector.style.top = '0px';

          this.modelSelector.classList.toggle( 'horizontal', !this.isMenuVertical );

          this.modelSelector.style.left = `${ originalRight - this.modelSelector.offsetWidth }px`;
          this.modelSelector.style.top = `${ originalBottom - this.modelSelector.offsetHeight }px`;
          this.modelSelector.style.visibility = 'visible';

          await GM.setValue( 'relativeMenuPosition', this.getCurrentRelativeMenuPosition() );
          this.reloadMenuVerticalToggle();
        },
        this.isMenuVerticalCommandId ? { id: this.isMenuVerticalCommandId } : {}
      );
    }

    injectMessageModelHighlightStyle() {
      let style = `
        div[data-message-model-slug] {
          padding: 0px 5px;
          box-shadow: 0 0 3px 3px rgba(var(--unknown-model-box-shadow-color), 0.65);
        }
      `;
      for ( const model of Object.values( this.availableModels ) ) {
        style += `
        div[data-message-model-slug="${ model }"] {
          box-shadow: 0 0 3px 3px rgba(var(--${ model }-color, var(--unknown-model-box-shadow-color)), 0.8);
        }
        `;
      }
      this.modelHighlightStyleNode = injectStyle( style, !this.isModelHighlightEnabled );
    }

    async reloadMessageModelHighlightToggle() {
      this.isModelHighlightEnabledCommandId = await GM.registerMenuCommand(
        `${ this.isModelHighlightEnabled ? '☑︎' : '☐' } Show model identifer`,
        async () => {
          this.isModelHighlightEnabled = !this.isModelHighlightEnabled;
          await GM.setValue( 'isModelHighlightEnabled', this.isModelHighlightEnabled );
          this.modelHighlightStyleNode.disabled = !this.isModelHighlightEnabled;
          this.reloadMessageModelHighlightToggle();
        },
        this.isModelHighlightEnabledCommandId ? { id: this.isModelHighlightEnabledCommandId } : {}
      );
    }

    createModelSelectorMenu() {
      this.modelSelector = document.createElement( 'div' );
      this.modelSelector.id = 'model-selector';

      for ( const [ modelName, modelValue ] of Object.entries( this.availableModels ) ) {
        const button = document.createElement( 'button' );
        button.textContent = modelName;
        button.title = modelValue;
        button.addEventListener(
          'click',
          async event => {
            if ( this.shouldCancelClick ) {
              event.preventDefault();
              event.stopImmediatePropagation();
              return;
            }
            this.model = modelValue;
            await GM.setValue( 'model', modelValue );
            this.refreshButtons();
          }
        );
        this.modelSelector.appendChild( button );
        this.buttons[`btn-${ modelValue }`] = button;
      }
      this.modelSelector.classList.toggle( 'hidden', !this.isMenuVisible );
      this.modelSelector.classList.toggle( 'horizontal', !this.isMenuVertical );
      return this.modelSelector;
    }

    injectMenu() {
      document.body.appendChild( this.modelSelector );
    }

    monitorBodyChanges() {
      const observer = new MutationObserver( mutationsList => {
        for ( const mutation of mutationsList ) {
          if ( document.body.querySelector( '#model-selector' ) ) continue;
          this.injectMenu();
          break;
        }
      });
      observer.observe( document.body, { childList: true } );
    }

    getDefaultRelativeMenuPosition() {
      return {
        offsetRight: 33,
        offsetBottom: 36
      };
    }

    relativeToAbsolutePosition( relativeMenuPosition ) {
      return {
        left: `${ window.innerWidth - this.modelSelector.offsetWidth - relativeMenuPosition.offsetRight }px`,
        top: `${ window.innerHeight - this.modelSelector.offsetHeight - relativeMenuPosition.offsetBottom }px`
      }
    }

    getCurrentRelativeMenuPosition() {
      return {
        offsetRight: window.innerWidth - parseInt( this.modelSelector.style.left ) - this.modelSelector.offsetWidth,
        offsetBottom: window.innerHeight - parseInt( this.modelSelector.style.top ) - this.modelSelector.offsetHeight
      }
    }

    async restoreMenuPosition() {
      const menuPosition = await GM.getValue( 'menuPosition', null ); // <= v0.53.1 migration
      if ( menuPosition ) {
        this.modelSelector.style.left = menuPosition.left;
        this.modelSelector.style.top = menuPosition.top;
        await GM.setValue(
          'relativeMenuPosition', {
            offsetRight: window.innerWidth - parseInt( menuPosition.left ) - this.modelSelector.offsetWidth,
            offsetBottom: window.innerHeight - parseInt( menuPosition.top ) - this.modelSelector.offsetHeight
          }
        );
        await GM.deleteValue( 'menuPosition' );
      } else {
        const relativeMenuPosition = await GM.getValue( 'relativeMenuPosition', this.getDefaultRelativeMenuPosition() );
        const absoluteMenuPosition = this.relativeToAbsolutePosition( relativeMenuPosition );
        this.modelSelector.style.left = absoluteMenuPosition.left;
        this.modelSelector.style.top = absoluteMenuPosition.top;
      }
    }

    monitorWindowResize() {
      window.addEventListener(
        'resize', async event => {
          const relativeMenuPosition = await GM.getValue( 'relativeMenuPosition', this.getDefaultRelativeMenuPosition() );
          const absoluteMenuPosition = this.relativeToAbsolutePosition( relativeMenuPosition );
          this.modelSelector.style.left = absoluteMenuPosition.left;
          this.modelSelector.style.top = absoluteMenuPosition.top;
        }
      );
    }

    async registerResetMenuPositionCommand() {
      await GM.registerMenuCommand(
        '⟲ Reset menu position',
        async () => {
          const defaultRelativeMenuPosition = this.getDefaultRelativeMenuPosition();
          const defaultAbsoluteMenuPosition = this.relativeToAbsolutePosition( defaultRelativeMenuPosition );
          this.modelSelector.style.left = defaultAbsoluteMenuPosition.left;
          this.modelSelector.style.top = defaultAbsoluteMenuPosition.top;
          await GM.setValue( 'relativeMenuPosition', defaultRelativeMenuPosition );
        }
      );
    }

    getPoint( event ) {
      return event.touches ? event.touches[0] : event;
    }

    mouseDownHandler( event ) {
      const point = this.getPoint( event );
      this.offsetX = point.clientX - this.modelSelector.offsetLeft;
      this.offsetY = point.clientY - this.modelSelector.offsetTop;
      this.isDragging = true;
      this.shouldCancelClick = false;
      this.modelSelector.style.cursor = 'grabbing';
    }

    mouseMoveHandler( event ) {
      if ( !this.isDragging ) return;

      const point = this.getPoint( event );
      const oldLeft = this.modelSelector.style.left;
      const oldTop = this.modelSelector.style.top;
      this.modelSelector.style.left = ( point.clientX - this.offsetX ) + 'px';
      this.modelSelector.style.top = ( point.clientY - this.offsetY ) + 'px';
      if ( !this.shouldCancelClick && ( this.modelSelector.style.left != oldLeft || this.modelSelector.style.top != oldTop ) ) {
        this.shouldCancelClick = true;
      }

      // Prevent scrolling on touch
      if ( event.cancelable ) event.preventDefault();
    }

    async mouseUpHandler( event ) {
      this.isDragging = false;
      this.modelSelector.style.cursor = 'grab';
      document.body.style.userSelect = '';
      await GM.setValue( 'relativeMenuPosition', this.getCurrentRelativeMenuPosition() );
    }

    registerGrabbing() {
      // Mouse
      this.modelSelector.addEventListener( 'mousedown', this.mouseDownHandler.bind( this ) );
      document.addEventListener( 'mousemove', this.mouseMoveHandler.bind( this ) );
      document.addEventListener( 'mouseup', this.mouseUpHandler.bind( this ) );

      // Touch
      this.modelSelector.addEventListener( 'touchstart', this.mouseDownHandler.bind( this ), { passive: false } );
      document.addEventListener( 'touchmove', this.mouseMoveHandler.bind( this ), { passive: false } );
      document.addEventListener( 'touchend', this.mouseUpHandler.bind( this ) );
    }
  }

  const switcher = new ModelSwitcher();
  await switcher.init();

  switcher.hookFetch();

  switcher.injectToggleButtonStyle();
  switcher.injectMessageModelHighlightStyle();

  switcher.createModelSelectorMenu();
  await switcher.registerResetMenuPositionCommand();
  await switcher.reloadMenuVisibleToggle();
  await switcher.reloadMenuVerticalToggle();
  await switcher.reloadMessageModelHighlightToggle();

  switcher.refreshButtons();
  switcher.monitorBodyChanges();
  switcher.injectMenu();

  await switcher.restoreMenuPosition();
  switcher.monitorWindowResize();
  switcher.registerGrabbing();
})();
