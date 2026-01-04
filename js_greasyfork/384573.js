// ==UserScript==
// @name         Notion Navigation Fixer
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Allow browser nav options like back forward pgup pgdown
// @author       Andreas Huttenrauch
// @match        *://www.notion.so/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/384573/Notion%20Navigation%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/384573/Notion%20Navigation%20Fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function uniqid() {
        return (new Date().getTime()).toString(16) + Math.random().toString(16).substring(2, 15);
    }

    function windowId() {
        var id = window.name;
        if ( id == "" ) {
            id = uniqid();
            window.name = id;
        }
        return id;
    }

    function getStack() {
        var stack = JSON.parse(GM_getValue("notion_stack_"+windowId(), "{}"));
        if ( typeof stack != "object" ) stack = {};
        if ( ! ("index" in stack) ) stack.index = 0;
        if ( ! ("data" in stack) ) stack.data = [];
        return stack;
    }

    function setStack(stack) {
        GM_setValue("notion_stack_"+windowId(), JSON.stringify(stack));
    }

    function pushLoc() {
        var loc = window.location.href;
        var stack = getStack();
        if ( stack.index < stack.data.length ) return; // don't push if we navigated back in history
        stack.data.push(loc);
        stack.data = stack.data.slice(-20);
        stack.index = stack.data.length;
        setStack(stack);
    }

    function goBack() {
        var stack = getStack();
        if ( stack.index < 1 ) return;
        stack.index--;
        var loc = stack.data[stack.index];
        setStack(stack);
        window.location.href = loc;
    }

    function goForward() {
        var stack = getStack();
        if ( stack.index >= stack.data.length ) return;
        stack.index++;
        var loc = stack.data[stack.index];
        setStack(stack);
        window.location.href = loc;
    }

/*
    window.addEventListener('popstate', function(e) {
        if ( trapInit && trapCaught ) {
            e.preventDefault();
            e.stopImmediatePropagation();
        }
        trapCaught = true;
    });
*/

    document.addEventListener('mousedown', function(e) {
        if ( (e.buttons & 8) == 8 ) {
            e.stopImmediatePropagation();
            e.preventDefault();
            goBack();
        }
        if ( (e.buttons & 16) == 16 ) {
            e.stopImmediatePropagation();
            e.preventDefault();
            goForward();
        }
    });

    document.addEventListener('keydown', function(e) {
        //console.log(e);
        /*
    if ( e.target.contentEditable ) {
        console.log("not moving because you are editing something important");
        return;
    }
    */
        if ( e.keyCode == 37 && e.altKey ) {
            goBack();
        }
        if ( e.keyCode == 39 && e.altKey ) {
            goForward();
        }
        var mainDiv = document.querySelector(".notion-frame .notion-scroller");
        if ( mainDiv == "undefined" ) return;
        var scrollAmt = parseInt(window.innerHeight*0.8);
        if ( e.keyCode == 34 && e.shiftKey == false && e.ctrlKey == false ) {
            e.stopImmediatePropagation();
            e.preventDefault();
            mainDiv.scrollBy(0, scrollAmt);
        }
        if ( e.keyCode == 33 && e.shiftKey == false && e.ctrlKey == false ) {
            e.stopImmediatePropagation();
            e.preventDefault();
            mainDiv.scrollBy(0, -scrollAmt);
        }
    });


    pushLoc();

})();


