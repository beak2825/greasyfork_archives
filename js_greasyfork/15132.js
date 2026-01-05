// ==UserScript==
// @name         Disable 'disable right click'
// @namespace    https://github.com/mosaicer
// @author       mosaicer
// @description  Disables the ugly feature that disables right click
// @version      2.0.3
// @include      *
// @run-at       document-idle
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/15132/Disable%20%27disable%20right%20click%27.user.js
// @updateURL https://update.greasyfork.org/scripts/15132/Disable%20%27disable%20right%20click%27.meta.js
// ==/UserScript==
(() => {
  'use strict';

  const EVENT_NAMES = [
    'oncontextmenu', 'oncopy', 'onpaste', 'onmousedown', 'onselectstart'
  ];

  const updateStyles =
    function overwriteStylesToEnableSelectElements() {
      GM_addStyle(`* {
        -ms-user-select: auto !important;
        -moz-user-select: auto !important;
        -khtml-user-select: auto !important;
        -webkit-user-select: auto !important;
        user-select: auto !important;
      }`);
    };

  const defineJQueryFunctions =
    function defineJQueryManipulatingEventsFunctionsIfJQueryAvailable() {
      try {
        $.fn.getEvents = function (eventName) {
          const events = $._data($(this)[0], 'events') || $(this).data('events');
          if (events && events[eventName]) {
            return events[eventName];
          } else {
            return [];
          }
        };

        $.fn.setEvents = function (eventName, events) {
          events.forEach(e => $(this).setEvent(eventName, e));
        };

        $.fn.setEvent = function (eventName, e) {
          if ($.isFunction($.fn.on)) {
            $(this).on(eventName, e.selector, e.data, e.handler);
          } else {
            $(this).bind(eventName, e.handler);
          }
        };

        $.fn.removeEvents = function (eventName) {
          if ($.isFunction($.fn.off)) {
            $(this).off(eventName);
          } else {
            $(this).unbind(eventName);
          }
        };

        $.fn.enableRightClick = function (eventName) {
          const events = $(this).getEvents(eventName).map(
            e => ({
              selector: e.selector,
              data: e.data,
              handler: makeHandlerReturnTrue(e.handler)
            })
          );

          $(this).removeEvents(eventName);
          $(this).setEvents(eventName, events);
        };
      } catch (e) {
        if (e instanceof ReferenceError && e.message === '$ is not defined') {
          console.info('JQuery is not available.');
        } else {
          console.error(
            `Disable 'disable right click': Unexpected exception: ${e}.`
          );
        }
      }
    };

  const replaceFalseWithTrue =
    function replaceFalseTheFunctionReturnsWithTrue(funcText) {
      const returnValue = funcText.match(
        /return[\s\(]*([^\s;\}\)]+)[\s\)]*;?\s*\}?$/
      );
      if (returnValue && eval(returnValue[1]) === false) {
        return funcText.replace(
          new RegExp(
            `(return[\\s\\(]*)${returnValue[1]}([\\s\\)]*;?\\s*\\}?)$`
          ),
          '$1 true$2'
        );
      } else {
        return funcText;
      }
    };

  const makeHandlerReturnTrue =
    function makeTheHandlerReturnTrueInsteadOfFalseIfExists(handler) {
      if (typeof handler === 'undefined' || handler === null) {
        return null;
      }

      const handlerText = handler.toString();

      let output;
      // ex: function () {return false;}
      if (handlerText.startsWith('function')) {
        output = replaceFalseWithTrue(handlerText)
          .replace(/^function\s*(\(.*?\))/, '$1 =>');
      }
      // ex: () => {return false;}
      else if (/^\(?.+?\)?\s*=>\s*\{/.test(handlerText)) {
        output = replaceFalseWithTrue(handlerText);
      }
      // ex: () => false
      else {
        output = handlerText.replace(/^(\(?.+?\)?\s*=>\s*)false$/, '$1true');
      }

      return eval(output);
    };

  const tryToEnableRightClickWithJQuery =
    function tryToEnableRightClickToTheSpecificElementByUsingJQuery(
      element, eventName
    ) {
      try {
        $(element).enableRightClick(eventName.replace('on', ''));
      } catch (e) {
        if (
          !(e instanceof ReferenceError) || e.message !== '$ is not defined'
        ) {
          console.error(
            `Disable 'disable right click': Unexpected exception: ${e}.`
          );
        }
      }
    };

  // main

  defineJQueryFunctions();

  document.querySelectorAll('*').forEach(node =>
    EVENT_NAMES.forEach(name => {
      const attr = node.getAttribute(name);

      if (attr) {
        // ex: return false;
        node.setAttribute(name, replaceFalseWithTrue(attr));
      }

      tryToEnableRightClickWithJQuery(node, name);
    })
  );

  [window, document].forEach(et =>
    EVENT_NAMES.forEach(name => {
      et[name] = makeHandlerReturnTrue(et[name]);

      tryToEnableRightClickWithJQuery(et, name);
    })
  );

  updateStyles();
})();