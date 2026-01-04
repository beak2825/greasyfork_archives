// ==UserScript==
// @name         Github Ctrl+Enter Commit
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Commits a file on ctrl+enter
// @author       Kai Wildberger
// @include      *://github.com/*/*/edit/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375921/Github%20Ctrl%2BEnter%20Commit.user.js
// @updateURL https://update.greasyfork.org/scripts/375921/Github%20Ctrl%2BEnter%20Commit.meta.js
// ==/UserScript==

// simulate(), extend(), eventMatchers, and defaultOptions are not my code
     // everything else is
     // its from the accepted answer of this question: 
     //      https://stackoverflow.com/questions/6157929/how-to-simulate-a-mouse-click-using-javascript

function simulate(element, eventName)
{
    var options = extend(defaultOptions, arguments[2] || {});
    var oEvent, eventType = null;

    for (var name in eventMatchers)
    {
        if (eventMatchers[name].test(eventName)) { eventType = name; break; }
    }

    if (!eventType)
        throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

    if (document.createEvent)
    {
        oEvent = document.createEvent(eventType);
        if (eventType == 'HTMLEvents')
        {
            oEvent.initEvent(eventName, options.bubbles, options.cancelable);
        }
        else
        {
            oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
            options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
            options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
        }
        element.dispatchEvent(oEvent);
    }
    else
    {
        options.clientX = options.pointerX;
        options.clientY = options.pointerY;
        var evt = document.createEventObject();
        oEvent = extend(evt, options);
        element.fireEvent('on' + eventName, oEvent);
    }
    return element;
}

function extend(destination, source) {
    for (var property in source)
      destination[property] = source[property];
    return destination;
}

var eventMatchers = {
    'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
    'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
}
var defaultOptions = {
    pointerX: 0,
    pointerY: 0,
    button: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    bubbles: true,
    cancelable: true
}
'use strict';



// my code

var codeArea = document.querySelector('.CodeMirror-lines')
var submitButton = document.querySelector('.js-blob-submit')

if(codeArea instanceof Element) {
     codeArea.addEventListener("keydown", e => {  
	     if(e.ctrlKey && e.keyCode == 13) {
		     e.preventDefault()
		     simulate(submitButton, "click")
          }
     })
}