// ==UserScript==
// @name         在线咨询自动打标
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  快速打标
// @author       NBXX
// @license      MIT
// @match        https://integration.chinaunicom.cn:36601/bos/control/?source=oa#/historicalConversation*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/477754/%E5%9C%A8%E7%BA%BF%E5%92%A8%E8%AF%A2%E8%87%AA%E5%8A%A8%E6%89%93%E6%A0%87.user.js
// @updateURL https://update.greasyfork.org/scripts/477754/%E5%9C%A8%E7%BA%BF%E5%92%A8%E8%AF%A2%E8%87%AA%E5%8A%A8%E6%89%93%E6%A0%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getGroupIdFromUrl() {
        const url = window.location.href;
        const match = url.match(/id=(\w+)&/);
        if (match && match[1]) {
            return match[1];
        }
        return null;
    }

    function sendLabelRequest(groupId, labelId) {
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://integration.chinaunicom.cn:36601/ultra-bos-history-group-serving/group/history/label/create",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                groupId: groupId,
                labelId: labelId
            }),
            onload: function(response) {
                console.log(response.responseText);
            }
        });
    }

    function createButton(labelId, text) {
        const groupId = getGroupIdFromUrl();
        if (!groupId) return;

        const button = document.createElement('span');
        button.setAttribute('data-v-caacb5ba', '');
        button.setAttribute('class', 'el-tooltip last_label');
        button.setAttribute('tabindex', '0');
        button.innerText = text;

        button.addEventListener('click', function() {
            sendLabelRequest(groupId, labelId);
        });

        return button;
    }

    const labels = [
        {id: "39380522", text: "移网在途0Y"},
        {id: "39375030", text: "固网在途0Y"},
        {id: "39374846", text: "移网需求类查询"},
        {id: "39425777", text: "数据查询提取"},
        {id: "39425775", text: "移网业务办理不了解"},
        {id: "41585031", text: "固网咨询操作类"}
    ];

    function addButtonToTarget() {
        const target = document.querySelector('#historicalConversation > div.cbg_rightcontent > div > div.cbg_histCleft.p16 > div.cov_label');
        if (target) {
            labels.forEach(label => {
                const button = createButton(label.id, label.text);
                target.parentNode.insertBefore(button, target.nextSibling);
            });
        }
    }

    // Use MutationObserver to detect changes in the DOM
    const observer = new MutationObserver((mutationsList, observer) => {
        for(let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                addButtonToTarget();
            }
        }
    });

    observer.observe(document.body, { attributes: false, childList: true, subtree: true });

})();
