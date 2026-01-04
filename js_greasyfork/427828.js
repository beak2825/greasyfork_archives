// ==UserScript==
// @name         JSON paste on textarea
// @version      0.6
// @description  Paste JSON on textarea
// @match        https://*/*
// @grant        none
// @namespace https://greasyfork.org/users/371179
// @downloadURL https://update.greasyfork.org/scripts/427828/JSON%20paste%20on%20textarea.user.js
// @updateURL https://update.greasyfork.org/scripts/427828/JSON%20paste%20on%20textarea.meta.js
// ==/UserScript==
(function() {
    'use strict';

    /*

    -- Example --
    https://jsonformatter.curiousconcept.com/
    "{\"a\":1,\"b\":2,\"c\":3,\"d\":\"A\",\"e\":\"B\",\"f\":\"C\"}"

    */

    function getClipText(evt) {

        var text;
        var clp = (evt.originalEvent || evt).clipboardData;
        if (clp === undefined || clp === null) {
            text = window.clipboardData.getData("text") || null;
        } else {
            text = clp.getData('text/plain') || null;
        }
        return text;

    }

    //  =========================================================================================
    // https://stackoverflow.com/questions/7464282/javascript-scroll-to-selection-after-using-textarea-setselectionrange-in-chrome

    function setSelectionRange(textarea, selectionStart, selectionEnd) {
        // First scroll selection region to view
        const fullText = textarea.value;
        textarea.value = fullText.substring(0, selectionEnd);
        // For some unknown reason, you must store the scollHeight to a variable
        // before setting the textarea value. Otherwise it won't work for long strings
        const scrollHeight = textarea.scrollHeight
        textarea.value = fullText;
        let scrollTop = scrollHeight;
        const textareaHeight = textarea.clientHeight;
        if (scrollTop > textareaHeight) {
            // scroll selection to center of textarea
            scrollTop -= textareaHeight / 2;
        } else {
            scrollTop = 0;
        }
        textarea.scrollTop = scrollTop;

        // Continue to set selection range
        textarea.setSelectionRange(selectionStart, selectionEnd);
    }
    //  =========================================================================================


    if (document.queryCommandSupported("insertText")) {

        var object = {

            callback: function(str) {

                var targetElm = this.targetElm;
                var clipText = this.clipText;

                var newClipText = typeof str == 'string' ? str : clipText;
                if (newClipText != "") {


                    var oldText = targetElm.value
                    document.execCommand("insertText", false, newClipText);

                    if ('selectionStart' in targetElm) {
                        var afterChange = () => {
                            var newText = targetElm.value;
                            if (oldText == newText) return window.requestAnimationFrame(afterChange);
                            setSelectionRange(targetElm, targetElm.selectionStart, targetElm.selectionEnd);
                        };

                        window.requestAnimationFrame(afterChange);

                    }
                }

            }
        };

        var JF_safeObjects=[];

        var makeJFunction = (() => {
            var a = document.createElement('iframe');
            a.style.position = 'absolute';
            a.style.left = '-99px';
            a.style.top = '-99px';
            a.src = "about:blank"; //userscript can access "about:blank"
            a.width = "1";
            a.height = "1";
            document.documentElement.appendChild(a)
            // it is assumed that the "contentWindow" is immediately available after appendChild
            var JFunction;
            try {
                JFunction = (a.contentWindow || window).Function;
            } catch (e) {
                JFunction = window.Function
            }

            document.documentElement.removeChild(a)

            var res2 = null;
            try {
                var res = new JFunction('return Object.keys(window);')(); // avoid no access to JFunction
                res2 = [...res]; // transfer the js array object to the current framework
            } catch (e) {}

            if (res2 && 'forEach' in res2) {
                JF_safeObjects=res2;
            }else{
                JFunction = window.Function;
                JF_safeObjects=[];
            }

            return JFunction
        });


        var JFunction = null;
        document.addEventListener('paste', function(evt) {

            var clipText = getClipText(evt)
            if (clipText === null || typeof clipText != 'string') return;

            var targetElm = evt.target;

            if (!targetElm) return;

            switch (targetElm.tagName) {
                case 'TEXTAREA':
                    break;
                default:
                    return;
            }

            var testingStr=clipText.replace(/[0-9]+/g,'0')
            testingStr=testingStr.replace(/[a-zA-Z\u4E00-\u9FFF]+/g,'z')
            if (/[\[\{][\s\S]*[\]\}]/.test(testingStr)&&/[\'\"\`][\s\S]*[\'\"\`]/.test(testingStr)){}else{ return;}

            var testP = testingStr.replace(/[0z\/\%\-\+\_\.\;\$\#]+/g, '').trim();
            var testR = /^[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]+$/
            if (!testP) {
                return;
            }
            if (!testR.test(testP)) return;

            object.targetElm = targetElm;
            object.clipText = clipText;

            // JS-safe Function
            JFunction = JFunction || makeJFunction();

            //window.JF = JFunction



            var res = null;
            try {
                res = new JFunction(...JF_safeObjects,'return (' + clipText + ');')(); //backbracket to avoid return newline -> undefined
            } catch (e) {}

            //console.log(res)

            if (typeof res == 'string') {
                console.log('userscript - there is a text convertion to your pasted content');
                evt.preventDefault();
                object.callback(res);
            }


        });
    }

    // Your code here...
})();