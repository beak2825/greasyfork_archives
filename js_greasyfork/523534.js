// ==UserScript==
// @name         ChatGPT Model Switcher: Toggle on/off 4o-mini Improved Version
// @namespace    http://tampermonkey.net/
// @version      0.24.1
// @description  Injects a button allowing you to toggle on/off 4o-mini during the chat
// @match        *://chatgpt.com/*
// @author       d0gkiller87, improved UI by Aoshi Xu
// @license      MIT
// @grant        unsafeWindow
// @grant        GM.setValue
// @grant        GM.getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/523534/ChatGPT%20Model%20Switcher%3A%20Toggle%20onoff%204o-mini%20Improved%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/523534/ChatGPT%20Model%20Switcher%3A%20Toggle%20onoff%204o-mini%20Improved%20Version.meta.js
// ==/UserScript==

(async function() {
  'use strict';

  class ModelSwitcher {
    constructor( useMini = true ) {
      this.useMini = useMini;
      this.containerSelector = '#composer-background div:nth-of-type(2) div:first-child';
    }

    hookFetch() {
      const originalFetch = unsafeWindow.fetch;
      unsafeWindow.fetch = async ( resource, config = {} ) => {
        if (
          resource === 'https://chatgpt.com/backend-api/conversation' &&
          config.method === 'POST' &&
          config.headers &&
          config.headers['Content-Type'] === 'application/json' &&
          config.body
        ) {
          if ( this.useMini ) {
            const body = JSON.parse( config.body );
            body.model = 'gpt-4o-mini';
            config.body = JSON.stringify( body );
          }
        }
        return originalFetch( resource, config );
      };
    }

    injectToggleButtonStyle() {
      // Credit: https://webdevworkshop.io/code/css-toggle-button/
      if ( !document.getElementById( 'toggleCss' ) ) {
        const styleNode = document.createElement( 'style' );
        styleNode.id = 'toggleCss';
        styleNode.type = 'text/css';
        styleNode.textContent = `.toggle {
  position: relative;
  display: inline-block;
  width: 2.5rem;
  height: 1.5rem;
  background-color: hsl(0deg 0% 40%);
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.2s ease-in;
}
.toggle::after {
  content: '';
  position: absolute;
  width: 1.4rem;
  left: 0.1rem;
  height: calc(1.5rem - 2px);
  top: 1px;
  background-color: white;
  border-radius: 50%;
  transition: all 0.2s ease-out;
}
.hide-me {
  opacity: 0;
  height: 0;
  width: 0;
}`;
        document.head.appendChild( styleNode );
      }
    }

    getContainer() {
      return document.querySelector( this.containerSelector );
    }

    injectToggleButton( container = null ) {
      console.log( 'inject' );
      if ( !container ) container = this.getContainer();
      if ( !container ) {
        console.error( 'container not found!' );
        return;
      }
      if ( container.querySelector( '#cb-toggle' ) ) {
        console.log( '#cb-toggle already exists' );
        return;
      }
      container.classList.add('items-center');
      
      const button = document.createElement('button');
      button.id = 'cb-toggle';
      button.className = 'flex h-8 min-w-8 items-center justify-center rounded-lg p-1 text-xs font-semibold hover:bg-black/10 focus-visible:outline-black dark:focus-visible:outline-white';
      button.setAttribute('aria-pressed', 'false');
      button.setAttribute('aria-label', 'Toggle GPT-4o Mini');
      button.innerHTML = `<svg width='24' height='24' viewBox='0 0 320 320' xmlns='http://www.w3.org/2000/svg'><path d='m297.06 130.97c7.26-21.79 4.76-45.66-6.85-65.48-17.46-30.4-52.56-46.04-86.84-38.68-15.25-17.18-37.16-26.95-60.13-26.81-35.04-.08-66.13 22.48-76.91 55.82-22.51 4.61-41.94 18.7-53.31 38.67-17.59 30.32-13.58 68.54 9.92 94.54-7.26 21.79-4.76 45.66 6.85 65.48 17.46 30.4 52.56 46.04 86.84 38.68 15.24 17.18 37.16 26.95 60.13 26.8 35.06.09 66.16-22.49 76.94-55.86 22.51-4.61 41.94-18.7 53.31-38.67 17.57-30.32 13.55-68.51-9.94-94.51zm-120.28 168.11c-14.03.02-27.62-4.89-38.39-13.88.49-.26 1.34-.73 1.89-1.07l63.72-36.8c3.26-1.85 5.26-5.32 5.24-9.07v-89.83l26.93 15.55c.29.14.48.42.52.74v74.39c-.04 33.08-26.83 59.9-59.91 59.97zm-128.84-55.03c-7.03-12.14-9.56-26.37-7.15-40.18.47.28 1.3.79 1.89 1.13l63.72 36.8c3.23 1.89 7.23 1.89 10.47 0l77.79-44.92v31.1c.02.32-.13.63-.38.83l-64.41 37.19c-28.69 16.52-65.33 6.7-81.92-21.95zm-16.77-139.09c7-12.16 18.05-21.46 31.21-26.29 0 .55-.03 1.52-.03 2.2v73.61c-.02 3.74 1.98 7.21 5.23 9.06l77.79 44.91-26.93 15.55c-.27.18-.61.21-.91.08l-64.42-37.22c-28.63-16.58-38.45-53.21-21.95-81.89zm221.26 51.49-77.79-44.92 26.93-15.54c.27-.18.61-.21.91-.08l64.42 37.19c28.68 16.57 38.51 53.26 21.94 81.94-7.01 12.14-18.05 21.44-31.2 26.28v-75.81c.03-3.74-1.96-7.2-5.2-9.06zm26.8-40.34c-.47-.29-1.3-.79-1.89-1.13l-63.72-36.8c-3.23-1.89-7.23-1.89-10.47 0l-77.79 44.92v-31.1c-.02-.32.13-.63.38-.83l64.41-37.16c28.69-16.55 65.37-6.7 81.91 22 6.99 12.12 9.52 26.31 7.15 40.1zm-168.51 55.43-26.94-15.55c-.29-.14-.48-.42-.52-.74v-74.39c.02-33.12 26.89-59.96 60.01-59.94 14.01 0 27.57 4.92 38.34 13.88-.49.26-1.33.73-1.89 1.07l-63.72 36.8c-3.26 1.85-5.26 5.31-5.24 9.06l-.04 89.79zm14.63-31.54 34.65-20.01 34.65 20v40.01l-34.65 20-34.65-20z'/></svg>`
      button.style.backgroundColor = this.useMini ? 'hsl(102, 58%, 39%)' : 'transparent';
      button.addEventListener('click', () => {
        this.useMini = !this.useMini;
        console.log( `useMini: ${this.useMini}` );
        GM.setValue('useMini', this.useMini);
        button.setAttribute('aria-pressed', this.useMini);
        button.title = `Using model: ${this.useMini ? 'GPT-4o mini' : 'original'}`;
        button.style.backgroundColor = this.useMini ? 'hsl(102, 58%, 39%)' : 'transparent';
        
      });
      container.appendChild(button);
    }

    monitorChild( nodeSelector, callback ) {
      const node = document.querySelector( nodeSelector );
      if ( !node ) {
        console.log( `${ nodeSelector } not found!` )
        return;
      }
      const observer = new MutationObserver( mutationsList => {
        for ( const mutation of mutationsList ) {
          console.log( nodeSelector );
          callback( observer, mutation );
          break;
        }
      });
      observer.observe( node, { childList: true } );
    }

    __tagAttributeRecursively(selector) {
      // Select the node using the provided selector
      const rootNode = document.querySelector(selector);
      if (!rootNode) {
        console.warn(`No element found for selector: ${selector}`);
        return;
      }

      // Recursive function to add the "xx" attribute to the node and its children
      function addAttribute(node) {
        node.setAttribute("xxx", ""); // Add the attribute to the current node
        Array.from(node.children).forEach(addAttribute); // Recurse for all child nodes
      }

      addAttribute(rootNode);
    }


    monitorNodesAndInject() {
      this.monitorChild( 'body main', () => {
        this.injectToggleButton();

        this.monitorChild( 'main div:first-child div:first-child', ( observer, mutation ) => {
          observer.disconnect();
          this.injectToggleButton();
        });
      });

      this.monitorChild( this.containerSelector, ( observer, mutation ) => {
        observer.disconnect();
        setTimeout( () => this.injectToggleButton(), 500 );
      });
      this.monitorChild( 'main div:first-child div:first-child', ( observer, mutation ) => {
        observer.disconnect();
        this.injectToggleButton();
      });
    }
  }

  const useMini = await GM.getValue( 'useMini', true );
  const switcher = new ModelSwitcher( useMini );
  switcher.hookFetch();
  switcher.injectToggleButtonStyle();
  switcher.monitorNodesAndInject();
})();
