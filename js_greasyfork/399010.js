// ==UserScript==
// @name         SRSign-根据数据标注搜索结果并标标记排名-GzNotes.com
// @namespace    https://www.gznotes.com/manual/helpDoc/SRSign.php
// @version      0.1
// @description  根据所设域名或词条标注搜索引擎的结果和排名，支持多域名/词组 (Search Results Sign)
// @license      GPL-3.0-only
// @create       2020-03-29
// @author       Daniel Ting
// @supportURL   https://www.gznotes.com/manual/helpDoc/SRSign.php
// @match        *://www.baidu.com/s?*
// @match        *://www.google.com/search?*
// @match        *://www.so.com/s?*
// @match        *://www.sogou.com/web?*
// @match        *://cn.bing.com/search?*
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/399010/SRSign-%E6%A0%B9%E6%8D%AE%E6%95%B0%E6%8D%AE%E6%A0%87%E6%B3%A8%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%B9%B6%E6%A0%87%E6%A0%87%E8%AE%B0%E6%8E%92%E5%90%8D-GzNotescom.user.js
// @updateURL https://update.greasyfork.org/scripts/399010/SRSign-%E6%A0%B9%E6%8D%AE%E6%95%B0%E6%8D%AE%E6%A0%87%E6%B3%A8%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%B9%B6%E6%A0%87%E6%A0%87%E8%AE%B0%E6%8E%92%E5%90%8D-GzNotescom.meta.js
// ==/UserScript==

(function () {
    'use strict';
    GM.registerMenuCommand('SRSign-设置', () => {
        document.querySelector('#SRSign').style.display = 'block';
    });
    let panel = `
<div id="SRSign" style="overflow:hidden;position:fixed;top:20%;right:5px;width:150px;height:200px;background:#ccc;display:none;box-shadow:0 0 5px 2px #000;">
  <textarea id="SRSignDomains" style="width:100%;height:165px;resize:none" placeholder="域名或者词条&#13;&#10;每行一个，如：gznotes.com&#13;&#10;阁主手札"></textarea>
  <a href="javascript:;" id="SRSignSave" style="display:block;width:100%;height:30px;line-height:30px;text-align:center;background:#00c8ff;color:#fff;text-decoration:none">保存</a>
</div>`;
    let body = document.body;
    body.innerHTML += panel;
    body.addEventListener('click', e => {
        if (e.target.id === 'SRSignSave') {
            let domains = document.querySelector('#SRSignDomains').value.trim();
            domains.split("\n").map(o => o.trim()).filter(o => o).join('\n');
            GM.setValue('SRSignDomains', domains ? domains : '');
            window.location.reload();
            document.querySelector('#SRSign').style.display = "none";
        }
    }, false);
    // observeDOM is originally from https://stackoverflow.com/questions/3219758/detect-changes-in-the-dom
    // I just modified some details
    const observeDOM = (function () {
        let MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

        return function (obj, callback) {
            if (!obj || !(obj.nodeType === 1)) return; // validation

            if (MutationObserver) {
                // define a new observer
                let obs = new MutationObserver(function (mutations, observer) {
                    callback(mutations);
                });
                // have the observer observe foo for changes in children
                obs.observe(obj, {childList: true, subtree: true});
            } else if (window.addEventListener) {
                obj.addEventListener('DOMNodeInserted', callback, false);
                obj.addEventListener('DOMNodeRemoved', callback, false);
            }
        }
    })();

    function doSign(domains) {
        domains = domains ? domains.split('\n') : ['gznotes.com'];
        document.querySelectorAll(containerSelector).forEach((o, ind) => {
            if (!o.classList.contains('GzNotes.com')) {
                if (domains.some(i => ~o.innerText.indexOf(i))) {
                    o.style.position = "relative";
                    o.style.border = "2px solid #f00";
                    o.style.boxShadow = "0 0 5px 2px #000";
                    // add the sort number index +1
                    o.innerHTML += `<b style="background:#f00;color:#fff;width:20px;height:20px;border-radius:50%;font-size:14px;position:absolute;top:-10px;left:-10px;text-align:center;line-height:20px;z-index:999">${ind + 1}</b>`
                }
                o.classList.add('GzNotes.com');
            }
        });
    }

    let containerSelector = {
        'www.baidu.com': '#content_left>div',
        'www.google.com': '#search .g',
        'www.so.com': '.result .res-list',
        'www.sogou.com': '.results>div',
        'cn.bing.com': '#b_results>li',
    }[window.location.host];

    GM.getValue('SRSignDomains').then(data => {
        document.querySelector('#SRSignDomains').value = data;

        observeDOM(document, m => {
            doSign(data);
        });

        doSign(data);
    });

})();