// ==UserScript==
// @name         rutracker黑名单
// @version      0.2.1
// @author       assassing
// @homepage     https://github.com/hxz393/RutrackerBlacklist
// @description  rutracker blacklist
// @match     https://rutracker.org/forum/tracker.php?*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at document-idle
// @namespace https://github.com/hxz393/RutrackerBlacklist
// @downloadURL https://update.greasyfork.org/scripts/406674/rutracker%E9%BB%91%E5%90%8D%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/406674/rutracker%E9%BB%91%E5%90%8D%E5%8D%95.meta.js
// ==/UserScript==
/* global $ */

(function () {
    'use strict';

    let GUI_strs = {};
    GUI_strs = {
        name: "屏蔽",
        filter_input_placeholder: "请输入过滤关键字",
        setKeywordsOfBlacklist: "设置屏蔽关键字",
        keywordsDesc: "共有0个关键字。",
        saveBtn: "保存",
        showOnlyBtnValue: "筛选",
        showAllBtnValue: "显示全部",
    };


    function addKeywordsTextArea(selector) {
        let div = document.createElement("div");
        div.id = "keywords_blacklist";
        let h3 = document.createElement("h3");
        h3.style.cssText = "margin: 10px;color: #A42121;";
        div.appendChild(h3);

        let textarea1 = document.createElement("textarea");
        textarea1.rows = "20";
        textarea1.cols = "100";
        let arr = JSON.parse(GM_getValue("keywords_Blacklists", "[]"));
        textarea1.value = arr.join("\n");
        h3.innerText = GUI_strs.keywordsDesc.replace(0, arr.length);

        div.appendChild(textarea1);

        let saveBtn1 = document.createElement("input");
        saveBtn1.type = "button";
        saveBtn1.value = GUI_strs.saveBtn;
        saveBtn1.style.marginLeft = "15px";
        saveBtn1.onclick = function () {
            let val = textarea1.value.split(/\n+/);
            if (val[val.length - 1] == '') { val.pop(); }
            val = [...new Set(val)];
            GM_setValue("keywords_Blacklists", JSON.stringify(val));
            div.style.display = "none";
        }
        div.appendChild(saveBtn1);
        div.style.display = "none";
        return div;
    }


    function addFilterSystem(selector) {
        let div = document.createElement("div");
        let h2 = document.createElement("h2");
        h2.style.cssText = "margin: 10px;color: #A42121;";
        h2.innerText = GUI_strs.name;
        div.appendChild(h2);
        let input = document.createElement("input");
        input.id = "filter_input";
        input.type = "text";
        input.value = "";
        input.style.cssText = "margin: 10px;";
        input.placeholder = GUI_strs.filter_input_placeholder;
        div.appendChild(input);

        let setKeywordsBtn = document.createElement("input");
        setKeywordsBtn.type = "button";
        setKeywordsBtn.value = GUI_strs.setKeywordsOfBlacklist;
        setKeywordsBtn.style.marginLeft = "15px";
        setKeywordsBtn.onclick = function () {
            document.querySelector("#keywords_blacklist").style.display = "block";
        }
        div.appendChild(setKeywordsBtn);

        let showOnlyBtn = document.createElement("input");
        let items = document.querySelectorAll(selector + " > table > tbody > tr");
        let len = items.length;
        showOnlyBtn.type = "button";
        showOnlyBtn.value = GUI_strs.showOnlyBtnValue;
        showOnlyBtn.style.marginLeft = "15px";
        showOnlyBtn.onclick = function () {
            let text = input.value.trim().toLowerCase();
            for (let i = 0; i < len; i++) {
                let text1 = items[i].innerText.trim().toLowerCase();
                if (!text1.includes(text)) {
                    items[i].style.display = "none";//隐藏掉不包含关键字的脚本 并且对隐藏掉的包含关键字的脚本不做处理。
                }
            }
        }
        let showAllBtn = document.createElement("input");
        showAllBtn.type = "button";
        showAllBtn.value = GUI_strs.showAllBtnValue;
        showAllBtn.style.marginLeft = "15px";
        showAllBtn.onclick = function () {
            for (let i = 0; i < len; i++) {
                items[i].style.display = "table-row";
            }
        }
        div.appendChild(showOnlyBtn);
        div.appendChild(showAllBtn);
        div.appendChild(addKeywordsTextArea(selector));
        document.querySelector(selector).insertBefore(div, document.querySelector(selector).firstChild);
    }


    function hideScriptsByKeywords(selector) {
        let arr = JSON.parse(GM_getValue("keywords_Blacklists", "[]"));
        let len2 = arr.length;
        let node_lis = document.querySelectorAll(selector + "> table > tbody > tr");
        let len = node_lis.length;
        for (let i = 0; i < len; i++) {
            let tr = node_lis[i];
            if (!tr.querySelector("td > div > a")) { continue; }
            // console.log(tr)
            //取出脚本标题和描述
            let text1 = tr.querySelector("td > .f-name").innerText.trim().toLowerCase();
            // console.log(text1)
            let text2 = tr.querySelector("td > .t-title").innerText.trim().toLowerCase();
            console.log(text2)
            setTimeout(() => {
                if (!text1) {
                    // alert("刷新页面");
                    window.location.reload();
                    // alert("载入失败");
               	    // hideScriptsByKeywords(selector)
                }
                else {
                    for (let j = 0; j < len2; j++) {
                        if (text1.includes(arr[j].trim().toLowerCase())||text2.includes(arr[j].trim().toLowerCase())) {
                            tr.style.display = "none";//隐藏掉黑名单里的脚本
                            break;
                        }
                    }
                }
            }, 2000)
        }
    }


    function triggerSort() {
        var header = $('th[data-column="3"]');
        if(header.length) {
            header.trigger('click');
        } else {
            console.error('没找到表头元素');
        }
    }


    if (document.querySelector("#search-results")) {
        addFilterSystem("#search-results");
        hideScriptsByKeywords("#search-results");
        triggerSort();
    }
    else {
        alert("载入失败");
    }
})();