// ==UserScript==
// @name                 GreasyFork Helper
// @name:zh-CN           GreasyFork网站助手
// @name:zh-TW           GreasyFork网站助手
// @namespace            https://github.com/kingphoenix2000/tampermonkey_scripts
// @supportURL           https://github.com/kingphoenix2000/tampermonkey_scripts
// @version              0.3.0
// @author               浴火凤凰(QQ:307053741,油猴脚本讨论QQ群:194885662)
// @description          This script will add several shortcut buttons under each script item on the script list page and script author's home page of GreasyFork website. Including features such as direct installation, Temporarily hidden, blacklisting, and more exciting needs you to find out.  And  an input box was added at the top of the script list items,  So you can filter out your own scripts by keywords.Author：浴火凤凰(QQ Number:307053741,QQ Group Number:194885662)
// @description:zh-CN    此脚本会在GreasyFork网站的脚本列表页面和用户脚本列表页面每个脚本的下面添加几个快捷操作的按钮。包括直接安装、临时删除、加入黑名单等等功能。在脚本列表顶部添加了一个根据关键字过滤脚本的功能。作者：浴火凤凰(QQ:307053741,油猴脚本讨论QQ群:194885662)
// @description:zh-TW    此脚本会在GreasyFork网站的脚本列表页面和用户脚本列表页面每个脚本的下面添加几个快捷操作的按钮。包括直接安装、临时删除、加入黑名单等等功能。在脚本列表顶部添加了一个根据关键字过滤脚本的功能。作者：浴火凤凰(QQ:307053741,油猴脚本讨论QQ群:194885662)
// @homepage             https://blog.csdn.net/kingwolf_javascript/
// @match                https://*.greasyfork.org/*
// @grant                GM_xmlhttpRequest
// @connect              greasyfork.org
// @grant                GM_getValue
// @grant                GM_setValue
// @grant                GM_addStyle
// @note                 2019-12-12 为脚本列表的每个脚本增加加入黑名单功能，加入黑名单的脚本会在页面加载完成以后被隐藏掉。可以单击显示全部脚本按钮来显示黑名单的脚本
// @note                 2020-01-08 在用户主页用户名的后面增加当前用户开发的脚本安装总数
// @note                 2020-04-07 修复某些脚本名称带有引号导致解析错误的问题
// @note                 2020-04-10 脚本架构重写。支持中英文界面。
// @note                 2020-04-15 增加 代码、历史版本、反馈、统计数据等快捷入口。增加宽窄屏幕切换功能。
// @note                 2020-04-16 增加 脚本列表综合排序功能，支持三个条件关联排序。
// @note                 2020-04-19 增加 在用户主页自动隐藏最后回复者是脚本作者的讨论，减少讨论内容，减轻脚本作者的心理负担。
// @note                 2020-05-24 增加 按照关键字列表隐藏脚本的功能。
// @note                 2020-06-04 由于GreasyFork网站改版，修改用户首页部分脚本代码，默认自动隐藏作者已经回复的讨论内容。
// @note                 2020-06-30 由于GreasyFork网站改版，修改脚本反馈部分脚本代码。
// @note                 2020-07-04 修复Bug。
// @downloadURL https://update.greasyfork.org/scripts/393396/GreasyFork%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/393396/GreasyFork%20Helper.meta.js
// ==/UserScript==


(function () {
    'use strict';

    function removeADS(arr) {
        arr.forEach(function (v) {
            let elem = document.querySelector(v);
            if (elem) { elem.remove(); }
        });
    }

    function addSingleLink(container, text, href) {
        let span = document.createElement('span');
        let a = document.createElement('a');
        a.href = href;
        a.innerText = text;
        span.appendChild(a);
        container.appendChild(span);
    }

    GM_addStyle('li > article > p.utiltools{visibility:hidden;}li:hover > article > p.utiltools{visibility:visible;}');
    let GUI_strs = {};
    let GUI_sort_Helper = {};
    let is_CN = location.href.includes("zh-");
    if (is_CN) {
        GUI_strs = {
            name: "GreasyFork网站助手",
            filter_input_placeholder: "在此输入过滤关键字...",
            setKeywordsOfBlacklist: "设置屏蔽关键字",
            keywordsDesc: "对于脚本名字和描述中包含下面的关键字的脚本会自动隐藏掉。在此可以设置一些关键字来过滤掉广告和垃圾脚本。支持设置多个关键字，用空格隔开。共有0个关键字。",
            saveBtn: "保存",
            showOnlyBtnValue: "筛选",
            showAllBtnValue: "显示全部",
            showAlldiscussion: "显示全部讨论内容",
            switchBtnValue1: "宽屏",
            switchBtnValue2: "窄屏",
            sortBtnValue: "重新排序",
            install: "安装脚本",
            remove: "删除脚本",
            addtoblacklist: "加入黑名单",
            removefromblacklist: "移除黑名单",
            authorotherscripts: "浴火凤凰的其它脚本",
            code: "代码",
            history: "历史版本",
            feedback: "反馈",
            stats: "统计数据",
            ratingScore: "评分:",
            sortDesc: "以下菜单对已经加载的脚本列表进行重新排序，从左到右排序菜单优先级依次降低。",
            sortErrMsg: "选中的排序菜单的内容不能重复！",
            question: "无评分",
            good: "好评",
            ok: "一般",
            bad: "差评",
        };
        GUI_sort_Helper = {
            daily_installs: "今日安装",
            total_installs: "总安装量",
            ratings: "得分",
            // updated: "最近更新",
        }
    }
    else {
        GUI_strs = {
            name: "GreasyFork Website Assistant",
            filter_input_placeholder: "Please enter filter keywords here...",
            setKeywordsOfBlacklist: "Set Blacklist Keywords",
            keywordsDesc: "Scripts that contain the following keywords in the script name and description will be hidden automatically. Here you can set some keywords to filter out ads and spam scripts. Support setting multiple keywords, separated by spaces.Total: 0 keywords.",
            saveBtn: "Save",
            showOnlyBtnValue: "Filter",
            showAllBtnValue: "Show All",
            showAlldiscussion: "Show all Discussions",
            switchBtnValue1: "Wide Screen",
            switchBtnValue2: "Normal Screen",
            sortBtnValue: "sort current list",
            install: "install",
            remove: "remove",
            addtoblacklist: "add to blacklist",
            removefromblacklist: "remove from blacklist",
            authorotherscripts: "Author's other scripts",
            code: "Code",
            history: "History",
            feedback: "Feedback",
            stats: "Stats",
            ratingScore: "Score:",
            sortDesc: "The following menu reorders the list of scripts that have been loaded, and the priority of the drop-down menus decreases from left to right.",
            sortErrMsg: "The contents of the selected sort menu cannot be repeated!",
            question: "question",
            good: "good",
            ok: "ok",
            bad: "bad",
        };
        GUI_sort_Helper = {
            daily_installs: "daily_installs",
            total_installs: "total_installs",
            ratings: "ratings",
            // updated: "updated",
        }
    }
    let typeToDataSet = {
        daily_installs: "scriptDailyInstalls",
        total_installs: "scriptTotalInstalls",
        ratings: "scriptRatingScore",
        updated: "scriptUpdatedDate",
    };
    let pageSortType = "daily_installs";
    let url = new URL(location.href);
    let searchParams = url.searchParams;
    if (!searchParams.get("sort")) {
        // delete GUI_sort_Helper.daily_installs;
    }
    else {
        pageSortType = searchParams.get("sort");
        // delete GUI_sort_Helper[searchParams.get("sort")];
    }
    function addSortSelection(selector) {
        let div = document.createElement("div");
        div.id = "sort_select_list";
        let h3 = document.createElement("h3");
        h3.innerText = GUI_strs.sortDesc;
        h3.style.cssText = "margin: 10px;color: #A42121;";
        div.appendChild(h3);
        for (let i = 0; i < 3; i++) {
            let select = document.createElement("select");
            select.innerHTML = '';
            select.style.cssText = "width: 120px;height: 23px;margin-left:15px;";
            for (const key in GUI_sort_Helper) {
                if (GUI_sort_Helper.hasOwnProperty(key)) {
                    const value = GUI_sort_Helper[key];
                    select.innerHTML += `<option value="${key}">${value}</option>`;
                }
            }
            div.appendChild(select);
        }
        let sortBtn = document.createElement("input");
        sortBtn.type = "button";
        sortBtn.value = GUI_strs.sortBtnValue;
        sortBtn.style.marginLeft = "15px";
        sortBtn.onclick = function () {
            let selects = document.querySelectorAll("#sort_select_list > select");
            let arr = [];
            for (let i = 0; i < 3; i++) {
                if (arr.includes(selects[i].value)) {
                    alert(GUI_strs.sortErrMsg); return;
                }
                else {
                    arr.push(selects[i].value);
                }
            }
            // console.log(arr);
            let items = document.querySelectorAll(selector + " > li");
            let len = items.length;
            items = [].slice.call(items);
            items.sort(function (a, b) {
                let n1 = +a.dataset[typeToDataSet[arr[0]]];
                let n2 = +b.dataset[typeToDataSet[arr[0]]];
                if (n2 != n1) {
                    return n2 - n1;
                }
                else {
                    let n3 = +a.dataset[typeToDataSet[arr[1]]];
                    let n4 = +b.dataset[typeToDataSet[arr[1]]];
                    if (n4 != n3) {
                        return n4 - n3;
                    }
                    else {
                        let n5 = +a.dataset[typeToDataSet[arr[2]]];
                        let n6 = +b.dataset[typeToDataSet[arr[2]]];
                        return n6 - n5;

                    }
                }
            });
            let p = document.querySelector(selector);
            for (let j = 0; j < len; j++) {
                p.appendChild(items[j]);
            }
        }
        div.appendChild(sortBtn);
        return div;
    }
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
        textarea1.value = arr.join(" ");
        h3.innerText = GUI_strs.keywordsDesc.replace(0, arr.length);

        div.appendChild(textarea1);

        let saveBtn1 = document.createElement("input");
        saveBtn1.type = "button";
        saveBtn1.value = GUI_strs.saveBtn;
        saveBtn1.style.marginLeft = "15px";
        saveBtn1.onclick = function () {
            let val = textarea1.value.split(/\s+/);
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
        input.style.cssText = "margin: 10px;width: 300px;";
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
        let items = document.querySelectorAll(selector + " > li");
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
                items[i].style.display = "list-item";
            }
        }
        let screenSize = true;
        let content = document.querySelector("body > div.width-constraint");
        let switchBtn = document.createElement("input");
        switchBtn.type = "button";
        switchBtn.value = GUI_strs.switchBtnValue1;
        switchBtn.style.marginLeft = "15px";
        switchBtn.onclick = function () {
            if (screenSize) {
                content.style.maxWidth = "95%";
                switchBtn.value = GUI_strs.switchBtnValue2;
                screenSize = false;
            }
            else {
                content.style.maxWidth = "960px";
                switchBtn.value = GUI_strs.switchBtnValue1;
                screenSize = true;
            }
        }
        div.appendChild(showOnlyBtn);
        div.appendChild(showAllBtn);
        div.appendChild(switchBtn);
        div.appendChild(addKeywordsTextArea(selector));
        div.appendChild(addSortSelection(selector));
        document.querySelector(selector).insertBefore(div, document.querySelector(selector).firstChild);
    }


    function hideScriptsInBlacklist(selector) {
        let arr = JSON.parse(GM_getValue("scriptIds_Blacklists", "[]"));
        let node_lis = document.querySelectorAll(selector + " > li");
        let len = node_lis.length;
        for (let i = 0; i < len; i++) {
            let li = node_lis[i];
            if (!li.querySelector("article > h2 > a")) { continue; }
            let scriptId = li.dataset.scriptId;
            if (scriptId && arr.includes(scriptId)) {
                li.style.display = "none";//隐藏掉黑名单里的脚本
            }
        }
    }
    function hideScriptsByKeywords(selector) {
        let arr = JSON.parse(GM_getValue("keywords_Blacklists", "[]"));
        let len2 = arr.length;
        let node_lis = document.querySelectorAll(selector + " > li");
        let len = node_lis.length;
        for (let i = 0; i < len; i++) {
            let li = node_lis[i];
            if (!li.querySelector("article > h2 > a")) { continue; }
            //取出脚本标题和描述
            let text = li.querySelector("article > h2").innerText;
            for (let j = 0; j < len2; j++) {
                if (text.includes(arr[j])) {
                    li.style.display = "none";//隐藏掉黑名单里的脚本
                    break;
                }
            }
        }
    }
    function addLinks(selector) {
        let arr = JSON.parse(GM_getValue("scriptIds_Blacklists", "[]"));
        let node_lis = document.querySelectorAll(selector);
        let len = node_lis.length;
        for (let i = 0; i < len; i++) {
            let li = node_lis[i];
            let p = document.createElement("p");
            p.className = "utiltools";

            if (!li.querySelector("article > h2 > a")) { continue; }
            let dd = li.querySelector("article > dl > dd.script-list-ratings");
            let span = document.createElement('span');
            span.title = GUI_strs.ratingScore;
            span.className = "good-rating-count";
            span.style.cssText = "margin-left:5px;";
            span.innerText = GUI_strs.ratingScore + dd.dataset.ratingScore;
            dd.firstElementChild.appendChild(span);

            let a1 = document.createElement('a');
            let href = li.querySelector("article > h2 > a").href.split('/').slice(-1);
            if (href) { href = href[0]; }
            let href2 = "https://greasyfork.org/scripts/" + href + "/code/" + encodeURIComponent(li.getAttribute("data-script-name")) + ".user.js";
            a1.href = href2;
            a1.innerText = GUI_strs.install;
            p.appendChild(a1);
            p.appendChild(document.createTextNode(" | "));

            let a2 = document.createElement('a');
            a2.href = "javascript:void(0);";
            a2.innerText = GUI_strs.remove;
            a2.onclick = function () { li.remove(); }
            p.appendChild(a2);
            p.appendChild(document.createTextNode(" | "));

            let a3 = document.createElement('a');
            a3.href = "javascript:void(0);";
            a3.innerText = GUI_strs.addtoblacklist;
            let scriptId = li.dataset.scriptId;
            if (scriptId && arr.includes(scriptId)) { a3.innerText = GUI_strs.removefromblacklist; }
            a3.onclick = function () {
                let arr = JSON.parse(GM_getValue("scriptIds_Blacklists", "[]"));
                if (arr.includes(scriptId)) {
                    arr.splice(arr.indexOf(scriptId), 1);
                    GM_setValue("scriptIds_Blacklists", JSON.stringify(arr));
                    this.innerText = GUI_strs.addtoblacklist;
                }
                else {
                    arr.push(scriptId);
                    GM_setValue("scriptIds_Blacklists", JSON.stringify(arr));
                    li.style.display = "none";
                    this.innerText = GUI_strs.removefromblacklist;
                }
            }
            p.appendChild(a3);
            p.appendChild(document.createTextNode(" | "));

            let a4 = document.createElement('a');
            a4.href = li.querySelector("article > h2 > a").href + "/code";
            a4.innerText = GUI_strs.code;
            a4.target = "_blank";
            p.appendChild(a4);
            p.appendChild(document.createTextNode(" | "));

            let a5 = document.createElement('a');
            a5.href = li.querySelector("article > h2 > a").href + "/versions";
            a5.innerText = GUI_strs.history;
            a5.target = "_blank";
            p.appendChild(a5);
            p.appendChild(document.createTextNode(" | "));

            let a6 = document.createElement('a');
            a6.href = li.querySelector("article > h2 > a").href + "/feedback";
            a6.innerText = GUI_strs.feedback;
            a6.target = "_blank";
            p.appendChild(a6);
            p.appendChild(document.createTextNode(" | "));

            let a7 = document.createElement('a');
            a7.href = li.querySelector("article > h2 > a").href + "/stats";
            a7.innerText = GUI_strs.stats;
            a7.target = "_blank";
            p.appendChild(a7);
            p.appendChild(document.createTextNode(" | "));

            let a8 = document.createElement('a');
            a8.href = "https://greasyfork.org/zh-CN/users/289205-%E6%B5%B4%E7%81%AB%E5%87%a8%E5%87%B0";
            a8.innerText = GUI_strs.authorotherscripts;
            a8.target = "_blank";
            p.appendChild(a8);
            p.appendChild(document.createTextNode(" | "));
            li.querySelector("article").appendChild(p);
        }
    }

    function total_installs() {
        let items = document.querySelectorAll("#user-script-list > li");
        let sum = 0;
        for (let i = 0; i < items.length; i++) {
            let n = parseInt(items[i].dataset.scriptTotalInstalls, 10);
            sum += n;
        }
        let text = document.querySelector("body > div.width-constraint > section > h2").innerText;
        document.querySelector("body > div.width-constraint > section > h2").innerText = text + `(${sum})`;
    }
    function hideReplyByAuthor() {
        if (!document.querySelector("#user-discussions-on-scripts-written")) { return; }
        let items = document.querySelectorAll("#user-discussions-on-scripts-written .discussion-list-container");
        let len = items.length;
        for (let i = 0; i < len; i++) {
            if (items[i].querySelector("div.discussion-meta-item div.discussion-meta-item span.badge.badge-author")) { items[i].style.display = "none"; }
        }
        let showAllBtn = document.createElement("input");
        showAllBtn.type = "button";
        showAllBtn.value = GUI_strs.showAlldiscussion;
        showAllBtn.style.marginLeft = "15px";
        showAllBtn.onclick = function () {
            for (let i = 0; i < len; i++) {
                items[i].style.display = "block";
            }
        }
        document.querySelector("#user-discussions-on-scripts-written > header").appendChild(showAllBtn);
    }
    function handle_blacklist() {
        let installArea = document.querySelector("#install-area");
        if (!installArea) { return; }
        let a3 = document.createElement('a');
        a3.href = "javascript:void(0);";
        a3.innerText = GUI_strs.addtoblacklist;
        let scriptId = location.href.match(/\/scripts\/(\d+)-/);
        if (scriptId) { scriptId = scriptId[1]; }
        let arr = JSON.parse(GM_getValue("scriptIds_Blacklists", "[]"));
        if (scriptId && arr.includes(scriptId)) { a3.innerText = GUI_strs.removefromblacklist; }
        a3.onclick = function () {
            let arr = JSON.parse(GM_getValue("scriptIds_Blacklists", "[]"));
            if (arr.includes(scriptId)) {
                arr.splice(arr.indexOf(scriptId), 1);
                GM_setValue("scriptIds_Blacklists", JSON.stringify(arr));
                this.innerText = GUI_strs.addtoblacklist;
            }
            else {
                arr.push(scriptId);
                GM_setValue("scriptIds_Blacklists", JSON.stringify(arr));
                this.innerText = GUI_strs.removefromblacklist;
            }
        }
        installArea.insertBefore(a3, installArea.querySelector("a.install-help-link").nextSibling);
    }
    function addFilterSystem2(selector) {
        let div = document.createElement("div");
        let h2 = document.createElement("h2");
        h2.style.cssText = "margin: 10px;color: #A42121;";
        h2.innerText = GUI_strs.name;
        div.appendChild(h2);
        let input = document.createElement("input");
        input.id = "filter_input";
        input.type = "text";
        input.value = "";
        input.style.cssText = "margin: 10px;width: 300px;";
        input.placeholder = GUI_strs.filter_input_placeholder;
        div.appendChild(input);
        let showOnlyBtn = document.createElement("input");
        let items = document.querySelectorAll(selector + " .discussion-list-container");
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
                items[i].style.display = "block";
            }
        }
        div.appendChild(showOnlyBtn);
        div.appendChild(showAllBtn);

        let arr = ["question", "good", "ok", "bad"];
        for (let i = 0; i < arr.length; i++) {
            let showBtn = document.createElement("input");
            showBtn.type = "button";
            showBtn.value = GUI_strs[arr[i]];
            showBtn.dataset.type = arr[i];
            showBtn.style.marginLeft = "15px";
            showBtn.onclick = function () {
                let type = this.dataset.type;
                if (type == "question") {
                    // 没有评分按钮
                    for (let i = 0; i < len; i++) {
                        let span = items[i].querySelector("a.discussion-title > span.rating-icon");
                        if (span) {
                            items[i].style.display = "none";//隐藏掉不包含关键字的脚本 并且对隐藏掉的包含关键字的脚本不做处理。
                        }
                        else {
                            items[i].style.display = "block";
                        }
                    }
                }
                else {//有评分按钮
                    for (let i = 0; i < len; i++) {
                        let span = items[i].querySelector("a.discussion-title > span.rating-icon");
                        if (span) {
                            if (!span.className.includes(type)) {
                                items[i].style.display = "none";//隐藏掉不包含关键字的脚本 并且对隐藏掉的包含关键字的脚本不做处理。
                            }
                            else {
                                items[i].style.display = "block";
                            }
                        }
                        else {
                            items[i].style.display = "none";//不存在评分按钮，说明是无评分类别 应该隐藏。
                        }
                    }
                }
            }
            div.appendChild(showBtn);
        }

        document.querySelector("#script-content > div.post-discussion").insertBefore(div, document.querySelector("#script-content > div > div.script-discussion-list"));
    }

    function redirection_for_login() {
        let homePage = location.href;
        if (true) {
            let notice = document.querySelector("body > div > p.notice");
            if (notice) {
                let referer = document.referrer;
                let prefix = homePage + "/users/sign_in?return_to=";
                if (referer.includes(prefix)) {
                    let href = "https://greasyfork.org" + referer.replace(prefix, '');
                    if (href != homePage) {
                        location.href = href;
                    }
                }
            }

        }
    }
    function redirection_for_logout() {
        let homePage = location.href;
        if (true) {
            let notice = document.querySelector("body > div > p.notice");
            if (notice) {
                let referer = document.referrer;
                if (!referer.includes("/users/sign_in?return_to=") && referer != homePage) {
                    location.href = referer;
                }
            }

        }
    }

    if (document.querySelector("#browse-script-list")) {
        document.querySelector("#site-nav > nav > li.with-submenu").outerHTML = document.querySelector("#site-nav > nav > li.with-submenu > nav").innerHTML;
        addFilterSystem("#browse-script-list");
        hideScriptsInBlacklist("#browse-script-list");
        hideScriptsByKeywords("#browse-script-list");
        addLinks("#browse-script-list > li");
    }
    if (document.querySelector("#user-script-list")) {
        document.querySelector("#site-nav > nav > li.with-submenu").outerHTML = document.querySelector("#site-nav > nav > li.with-submenu > nav").innerHTML;
        hideReplyByAuthor();
        total_installs();
        addFilterSystem("#user-script-list");
        hideScriptsInBlacklist("#user-script-list");
        hideScriptsByKeywords("#user-script-list");
        addLinks("#user-script-list > li");
    }
    if (/\/scripts\/\d+-/.test(location.href)) {
        handle_blacklist();
    }
    if (location.href.includes("/feedback")) {
        if (document.querySelector(".script-discussion-list")) { addFilterSystem2(".script-discussion-list"); }
    }
    //网址路径部分只有一个/则这个网址很大可能是主页地址，此方法兼容多语种的主页地址
    if (location.pathname.indexOf('/', 3) == -1) {
        redirection_for_login();
        redirection_for_logout();
    }

    // Your code here...
})();