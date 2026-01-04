// ==UserScript==
// @name         Fanly ChatGPT
// @description  OpenAI ChatGPT自动点击"Continue generating"按钮，实现自动继续生成，并且添加“100字总结”按钮，对生成的内容实现快速总结，帮助编辑人员提高效率。
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       Fanly
// @match        https://chat.openai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472327/Fanly%20ChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/472327/Fanly%20ChatGPT.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('ChatGPT Auto Summarize and Continue')

    var auto_summarize_and_continue = function(){
        var buttons = document.querySelectorAll('button.btn-neutral');
        for (var i=buttons.length-1; i>=0; i--){
            if (buttons[i].innerText =='Continue generating') { // If it is the Continue generating button
                setTimeout((function(i){
                    return function(){
                        buttons[i].click();
                    }
                })(i),1000);
                break;
            }
            else if (buttons[i].innerText =='Regenerate') { // If it is the Regenerate button

                // Check if the 100字总结 button already exists
                var summaryButtonExists = false;
                for (var j=0; j<buttons.length; j++){
                    if (buttons[j].innerText =='100字总结') {
                        summaryButtonExists = true;
                        break;
                    }
                }

                // If it does not exist, create and add it
                if (!summaryButtonExists) {
                    var button = document.createElement("button");
                    button.className = "btn relative btn-neutral sumup";
                    button.innerText='100字总结';

                    button.onclick = function() {
                        var textarea = document.getElementById('prompt-textarea');

                        // Simulate user input instead of directly changing the value
                        var inputEvent = new InputEvent('input', {
                            bubbles: true,
                            cancelable: true,
                        });
                        textarea.value = '100字总结';
                        textarea.dispatchEvent(inputEvent);
                        textarea.focus(); // Focus the cursor in the textarea
                        var event = new KeyboardEvent('keydown',{'key':'Enter'});
                        textarea.dispatchEvent(event);
                    };

                    buttons[i].after(button);
                }
                break;
            }
        }
    }

    // Call the function every second
    setInterval(auto_summarize_and_continue,1000);
})();
