// ==UserScript==
// @name         TPS Campus Extension
// @namespace    http://tampermonkey.net/
// @version      2024-11-29
// @description  TPS Markdown Renderer!
// @author       Ivan He
// @match        https://campus.at-tps.org/user/*/?profiletab=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=at-tps.org
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/markdown-it/13.0.2/markdown-it.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/highlight.min.js
// @copyright 2024, Ivan He (https://greasyfork.org/en/users/1404078-ivan-he)
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519438/TPS%20Campus%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/519438/TPS%20Campus%20Extension.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let msgl = -1;
    let msgll = -1;
    // Register the language for highlight.js
    //hljs.registerLanguage('javascript', window.hljs_languages.javascript);
    GM_addStyle("pre code.hljs{display:block;overflow-x:auto;padding:1em}code.hljs{padding:3px 5px}.hljs{background:#f3f3f3;color:#444}.hljs-comment{color:#697070}.hljs-punctuation,.hljs-tag{color:#444a}.hljs-tag .hljs-attr,.hljs-tag .hljs-name{color:#444}.hljs-attribute,.hljs-doctag,.hljs-keyword,.hljs-meta .hljs-keyword,.hljs-name,.hljs-selector-tag{font-weight:700}.hljs-deletion,.hljs-number,.hljs-quote,.hljs-selector-class,.hljs-selector-id,.hljs-string,.hljs-template-tag,.hljs-type{color:#800}.hljs-section,.hljs-title{color:#800;font-weight:700}.hljs-link,.hljs-operator,.hljs-regexp,.hljs-selector-attr,.hljs-selector-pseudo,.hljs-symbol,.hljs-template-variable,.hljs-variable{color:#ab5656}.hljs-literal{color:#695}.hljs-addition,.hljs-built_in,.hljs-bullet,.hljs-code{color:#397300}.hljs-meta{color:#1f7199}.hljs-meta .hljs-string{color:#38a}.hljs-emphasis{font-style:italic}.hljs-strong{font-weight:700}")
    var checker = setInterval(function() {
        var messages = document.getElementsByClassName("um-activity-bodyinner-txt");
        var comments = document.getElementsByClassName("um-activity-comment-text");
        if (messages[0] != undefined) {
            if (messages.length != msgl || comments.length != msgll) {
                var md = window.markdownit();
                md.set({
                    highlight: function (str, lang) {
                        if (lang && hljs.getLanguage(lang)) {
                            try {
                                return '<pre class="hljs"><code>' +
                                    hljs.highlight(lang, str, true).value +
                                    '</code></pre>';
                            } catch (__) {}
                        }

                        return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
                    }
                });
                for (let i = 0; i < messages.length; i++) {

                    const markdownText = messages[i].textContent.replace("						", "").replace("(See more)","");
                    console.log(markdownText)
                    if (!markdownText.includes("<|rendered|>")){

                        let endes = messages[i].innerHTML.split('<span class="post-meta">')[1];
                        if (endes){

                            const renderedMarkdown = md.render(markdownText).replaceAll("\n","<br>")+endes+"<p style='display:none'><|rendered|></p>";
                            messages[i].innerHTML = renderedMarkdown;
                        }else{
                            const renderedMarkdown = md.render(markdownText).replaceAll("\n","<br>")+"<p style='display:none'><|rendered|></p>";
                            messages[i].innerHTML = renderedMarkdown;
                        }

                        
                    }
                }
                for (let i = 0; i < comments.length; i++) {
                    const markdownText = comments[i].textContent.replace("						", "").replace("				","");
                    if (!markdownText.includes("<|rendered|>")){
                       

                        const renderedMarkdown = md.render(markdownText);
                        comments[i].innerHTML = renderedMarkdown+"<p style='display:none'><|rendered|></p>";
                    }
                }
                msgl = messages.length;
                msgll = comments.length;
            }

        }
    }, 1000);
})();
