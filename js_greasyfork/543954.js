// ==UserScript==
// @name         百科助手（Tampermonkey版）
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  百科小助手 - 词条信息查询
// @author       诸葛
// @license      Proprietary
// @match        https://baike.baidu.com/view/*
// @match        https://baike.baidu.com/subview/*
// @match        https://baike.baidu.com/item/*
// @match        https://baike.baidu.com/link*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-2.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/543954/%E7%99%BE%E7%A7%91%E5%8A%A9%E6%89%8B%EF%BC%88Tampermonkey%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/543954/%E7%99%BE%E7%A7%91%E5%8A%A9%E6%89%8B%EF%BC%88Tampermonkey%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_URL = 'https://aibaike.dozview.com/api/assistant.php';

    GM_addStyle(`
        .baike-assistant_lemma-info { border:1px solid #ccc; background:#fff; margin:10px 0; padding:10px; font-size:13px; border-radius:8px; box-shadow:0 2px 6px rgba(0,0,0,0.1); font-family:Arial, sans-serif; }
        .baike-assistant_lemma-info dt { background:#4285f4; color:#fff; padding:8px; cursor:pointer; font-weight:bold; border-radius:5px; font-size:14px; }
        .baike-assistant_lemma-info table { width:100%; border-collapse:collapse; margin-top:8px; table-layout:fixed; }
        .baike-assistant_lemma-info td { border:1px solid #e0e0e0; padding:6px 8px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width: 250px; }
        .baike-assistant_lemma-info td:hover { overflow:visible; white-space:normal; background:#f9f9f9; position:relative; z-index:2; }
        .baike-assistant-toast { position:fixed; top:20px; right:20px; background:#333; color:#fff; padding:6px 12px; border-radius:4px; opacity:0; transition:opacity 0.3s; z-index:9999; font-size:12px; }
        .baike-assistant-toast.show { opacity:1; }
    `);

    function toast(msg) {
        let toastElem = document.createElement('div');
        toastElem.className = 'baike-assistant-toast';
        toastElem.innerText = msg;
        document.body.appendChild(toastElem);
        setTimeout(()=>toastElem.classList.add('show'),10);
        setTimeout(()=>{
            toastElem.classList.remove('show');
            setTimeout(()=>toastElem.remove(),300);
        },1500);
    }

    function getLemmaInfo(urls, callback) {
        GM_xmlhttpRequest({
            method: "GET",
            url: `${API_URL}?qt=lemmaInfoByUrl&urls=${encodeURIComponent([].concat(urls).join('|'))}`,
            onload: function(resp) {
                try {
                    let response = JSON.parse(resp.responseText);
                    if (response && response.errmsg === 'ok') {
                        callback && callback(response.data);
                    }
                } catch(e) {
                    console.error("解析失败", e);
                }
            }
        });
    }

    function showLemmaInfo(lemmaInfo) {
        let panel = $('<dl class="baike-assistant_lemma-info">');
        panel.append(`
            <dt title="双击可隐藏" id="baikeAssistantTitle">百科助手V2.4</dt>
            <dd>
                <table id="baikeAssistant_lemmaInfoTable">
                    <tr><td>V5词条ID</td><td>${lemmaInfo.lemma_id}</td></tr>
                    <tr><td>V3词条ID</td><td>${lemmaInfo.old_lemma_id}</td></tr>
                    <tr><td>V3义项ID</td><td>${lemmaInfo.old_sublemma_id}</td></tr>
                    <tr><td>词条名</td><td>${lemmaInfo.lemma_title}</td></tr>
                    <tr><td>义项名</td><td>${lemmaInfo.lemma_desc}</td></tr>
                    <tr><td>创建者ID</td><td>${lemmaInfo.uid}</td></tr>
                    <tr><td>创建时间</td><td>${new Date(lemmaInfo.create_time*1000).toLocaleDateString()}</td></tr>
                </table>
            </dd>
        `);

        if ($('#side').length > 0) {
            $('#side').prepend(panel);
        } else if ($('.side-content').length > 0) {
            $('.side-content:first').prepend(panel);
        }

        panel.on('dblclick','dt',function(){ panel.remove(); });
        $('#baikeAssistantTitle').on('click',function(){ window.open('https://greasyfork.org/zh-CN/scripts/543954','_blank'); });

        $('#baikeAssistant_lemmaInfoTable').on('click','td:last-child',function(){
            let cell = $(this);
            let range = document.createRange();
            range.selectNodeContents(cell[0]);
            let sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            document.execCommand('copy');
            sel.removeAllRanges();
            toast(`已复制 ${cell.prev().text()} 的值`);
        });
    }

    let currentUrl = location.href;
    getLemmaInfo(currentUrl,function(data){
        let info = data[currentUrl];
        if(info) showLemmaInfo(info);
    });
})();
