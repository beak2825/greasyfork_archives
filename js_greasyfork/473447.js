// ==UserScript==
// @name         Poe Latex Renderer 
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       You
// @description  Render Latex in poe.com
// @match        https://poe.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=poe.com
// @grant        none
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/473447/Poe%20Latex%20Renderer.user.js
// @updateURL https://update.greasyfork.org/scripts/473447/Poe%20Latex%20Renderer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const renderLatex = function () {
        MathJax.typeset();
    }

    function endOfChat() {
        const isEndOfChat = function () {
            if (document.querySelector("[class*='ChatMessageFeedbackButtons_feedbackButtonsContainer']") != void 0) return true;
            return false;
        }

        return new Promise((resolve, reject) => {
            const resolver = () => {
                if (isEndOfChat()) {
                    return resolve();
                }
                window.setTimeout(resolver, 500);
            }
            setTimeout(resolver, 1000);
        })
    }



    function createBtnAndInit() {
        const btnsCSS = `
        display: flex;
        align-items: center;
        justify-content: center;
        height: 50px;
        cursor: pointer;
    `
        renderLatex();
        //    document.querySelector(".ChatMessageInputContainer_inputContainer__SQvPA").style.right = '55px';
        const _sc_renderBtnContainer = document.createElement("div");
        const container = document.querySelector(".ChatMessageInputContainer_inputContainer__SQvPA");
        if (container.childElementCount >=4){
            return; 
        }

        _sc_renderBtnContainer.classList.add("Button_buttonBase__0QP_m", "Button_flat__1hj0f");
        _sc_renderBtnContainer.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16"> <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/> </svg>';
        _sc_renderBtnContainer.addEventListener('click', () => { renderLatex(); });

        const _sc_writeBtnContainer = document.createElement("div");
        _sc_writeBtnContainer.classList.add("Button_buttonBase__0QP_m", "Button_flat__1hj0f");
        _sc_writeBtnContainer.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send-plus" viewBox="0 0 16 16"> <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855a.75.75 0 0 0-.124 1.329l4.995 3.178 1.531 2.406a.5.5 0 0 0 .844-.536L6.637 10.07l7.494-7.494-1.895 4.738a.5.5 0 1 0 .928.372l2.8-7Zm-2.54 1.183L5.93 9.363 1.591 6.602l11.833-4.733Z"/> <path d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-3.5-2a.5.5 0 0 0-.5.5v1h-1a.5.5 0 0 0 0 1h1v1a.5.5 0 0 0 1 0v-1h1a.5.5 0 0 0 0-1h-1v-1a.5.5 0 0 0-.5-.5Z"/> </svg>'
        _sc_writeBtnContainer.addEventListener('click', async () => {
            const txtArea = document.querySelector(".GrowingTextArea_textArea__eadlu");
            txtArea.value = `Please write your equations in LaTex, surround all latex blocks by '$$', and also surround all inline latex by '$'. \n\n ${txtArea.value}`;
            document.querySelector(".ChatMessageSendButton_sendButton__OMyK1").click();
            await endOfChat();
            renderLatex();
        })


        
        const lastChild = container.lastChild;
        container.insertBefore(_sc_renderBtnContainer, lastChild);
        container.insertBefore(_sc_writeBtnContainer, lastChild);
    }

    window.MathJax = {
        tex: {
            inlineMath: [['$', '$'], ['\\(', '\\)']],
            displayMath: [['$$', '$$', ['\\[', '\\]']]]
        },
        svg: {
            fontCache: 'global'
        },
        startup: {
            typeset: false
        },
        options: {
            skipHtmlTags: [ //  HTML tags that won't be searched for math
                'script', 'noscript', 'style', 'textarea', 'annotation', 'annotation-xml'],
            includeHtmlTags: { //  HTML tags that can appear within math
                br: '\n',
                wbr: '',
                '#comment': ''
            },
            ignoreHtmlClass: 'tex2jax_ignore',
            //  class that marks tags not to search
            processHtmlClass: 'tex2jax_process',
            //  class that marks tags that should be searched
            compileError: function (doc, math, err) {
                doc.compileError(math, err)
            },
            typesetError: function (doc, math, err) {
                doc.typesetError(math, err)
            },
        }
    };

    (function () {
        var script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js';
        script.async = true;
        document.head.appendChild(script);
    })();

    (() => {
        const _sc_style = document.createElement("style");
        //.MathJax { font-size: 1.3em !important; }
        _sc_style.innerHTML = `
            svg {
                height: initial;
            }

            section[class*='PageWithSidebarLayout_mainSection'] {
                width: initial;
                max-width: initial;
            }
        `
        document.head.appendChild(_sc_style);
    })();

    setInterval(() => {
        createBtnAndInit();
    }, 2000);


    // Your code here...
})();