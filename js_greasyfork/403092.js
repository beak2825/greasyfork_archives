// ==UserScript==
// @name         starling_dmp_i18n
// @namespace    starling_dmp_i18n
// @version      0.7
// @description  try to take over the world!
// @author       lejunjie
// @match        https://ads.tiktok.com/insight*
// @match        https://ads.tiktok.com/i18n_dmp/adver/*
// @match        https://ads.tiktok.com/quicksurvey/*
// @match        http://localhost:8889/i18n_dmp/adver/*
// @match        http://localhost:9417/insight*
// @match        http://localhost:9417/quicksurvey/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/403092/starling_dmp_i18n.user.js
// @updateURL https://update.greasyfork.org/scripts/403092/starling_dmp_i18n.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const langMatch = document.cookie.match(/lang_type=([a-zA-Z]*);/);
    const href = window.location.href;

    const isDmp = href.includes('/i18n_dmp/adver');
    const isInsight = href.includes('/insight');
    const isSurvey = href.includes('/quicksurvey');

    const namespace = isDmp ? [476, 266] : isInsight ? [3461, 813] : isSurvey ? [3443, 809] : [0, 0];
    if (!namespace[0] || !namespace[1]) {
        return;
    }

    function clearSelection() {
        if (window.getSelection) {
            if (window.getSelection().empty) {
                window.getSelection().empty();
            } else if (window.getSelection().removeAllRanges) {
                window.getSelection().removeAllRanges();
            }
        } else if (document.selection) {
            document.selection.empty();
        }
    }
    document.body.addEventListener('click', function(e) {
        if (e.target.id === 'starling_close') {
            const el = document.querySelector('#starling_ljj');
            if (el) {
                el.remove();
            }
        }
    }, false);

    function popup(title, text) {
        const el = document.querySelector('starling_ljj');
        if (!el) {
            const html = `

    <div id="starling_content" style="top: 0; position: absolute; width: 480px; height: 300px; background-color: #fff; left: 50%; top: 50%; transform: translate(-50%, -50%);overflow: scroll;padding: 24px;">
        <h3 id="starling_content_title" style="display: flex;justify-content: space-between;">
            <span>${title}</span>
            <span id="starling_close">X</span>
        </h3>
        <div id="starling_content_text">${text}</div>
    </div>
`;
            const div = document.createElement('div');
            div.style = "position:fixed; width: 100%; height: 100%; background-color: rgba(red, green, blue, .1); z-index: 9999;background: rgba(0,0,0,.2);top: 0;";
            div.id = "starling_ljj";
            div.innerHTML = html;
            document.body.appendChild(div);
        }
    }

    GM_xmlhttpRequest({
        method: "GET",
        url: `https://starling.bytedance.net/text/getTextListWithKeyOrSource?namespaceId=${namespace[0]}&locale=${langMatch && langMatch[1] || 'en'}&offset=0&limit=2000&projectId=${namespace[1]}`,
        onload: function(response) {
            //这里写处理函数

            if (response && response.readyState === 4 && response.responseText) {
                const data = JSON.parse(response.responseText || '{}');
                let sources = (data.data && data.data.textList || []).map(item => ({
                    key: item.targetText && item.targetText.key,
                    content: item.targetText && item.targetText.content
                })).filter(item => item.key && item.content);
                function selectCallback(innerText, startOffset, endOffset) {
                    const text = innerText.slice(startOffset, endOffset);
                    const result = sources.filter(item => (item.content || '').includes(text));

                    if (result.length && text) {
                        clearSelection();
                        setTimeout(() => {
                            popup('source text: ' + text + '\n\n', result.map(item => item.key + '：' + item.content).join('<br>'));
                        }, 200)
                    }
                }

                var handler;

                if (typeof window.getSelection != "undefined") {
                    // Non-IE
                    handler = function() {
                        var sel = window.getSelection();
                        if (sel.rangeCount > 0) {
                            var range = sel.getRangeAt(0);
                            if (range.toString()) {
                                var selParentEl = range.commonAncestorContainer;
                                var selText = selParentEl.innerText;
                                if (selParentEl.nodeType == 3) {
                                    selText = selParentEl.textContent;
                                    if (selParentEl.parentNode.id === 'starling_content_text' || (selParentEl.parentNode.parentNode && selParentEl.parentNode.parentNode.id === 'starling_content_title')) {
                                        return;
                                    }
                                }
                                if (selParentEl.id === 'starling_content') {
                                    return;
                                }
                                selectCallback(selText, range.startOffset, range.endOffset);
                            }
                        }
                    };
                } else if (typeof document.selection != "undefined") {
                    // IE
                    handler = function() {
                        var sel = document.selection;
                        if (sel.type == "Text") {
                            var textRange = sel.createRange();
                            if (textRange.text != "") {
                                selectCallback(textRange.text, 0, textRange.text.length);
                            }
                        }
                    };
                }
                document.addEventListener('mouseup', handler, false);
            }
        }
    });
})();