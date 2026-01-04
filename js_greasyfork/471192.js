// ==UserScript==
// @name         腾讯Tapd复制标题
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  腾讯Tapd复制标题，支持ID-标题 + ID（去掉ID）+标题
// @author       You
// @match        https://www.tapd.cn/*/prong/stories/view/*
// @match        https://www.tapd.cn/*/bugtrace/bugs/view*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tapd.cn
// @require      https://cdn.jsdelivr.net/npm/clipboard@2.0.11/dist/clipboard.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471192/%E8%85%BE%E8%AE%AFTapd%E5%A4%8D%E5%88%B6%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/471192/%E8%85%BE%E8%AE%AFTapd%E5%A4%8D%E5%88%B6%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let current_url = window.location.href
    if (current_url.includes("bugs")) {
        // 缺陷
        // 标题容器
        let bug_title_box = document.getElementById("bug_title_view")
        // ID
        let bug_title_id = bug_title_box.querySelector(".bug-title-id").textContent
        // 名称
        let bug_title_name = bug_title_box.querySelector(".editable-value").textContent
        // 菜单容器
        let menu_box = bug_title_box.querySelector(".dropdown-menu ul")

        console.log(bug_title_id)
        console.log(bug_title_name)


        // 新增菜单
        let menu_item = createMenu("复制 ID(去掉ID)-标题", getContentNotID(bug_title_id, bug_title_name, "-"));
        menu_box.appendChild(menu_item)

        let menu_item2 = createMenu("复制 ID-标题", getContent(bug_title_id, bug_title_name, "-"));
        menu_box.appendChild(menu_item2)

    } else if (current_url.includes("stories")) {
        // 用户故事
        // 标题容器
        let story_title_box = document.getElementById("story_name_view")

        // ID dom
        let story_title_id_element = story_title_box.querySelector(".story-title-id")
        if (story_title_id_element == null || story_title_id_element == undefined) {
            story_title_id_element = story_title_box.firstElementChild
        }
        // ID
        let story_title_id = story_title_id_element.textContent

        // 名称 dom
        let story_title_name_element = story_title_box.querySelector(".editable-value")
        if (story_title_name_element == null || story_title_name_element == undefined) {
            story_title_name_element = story_title_box.querySelector(".story-name")
        }
        // 名称
        let story_title_name = story_title_name_element.textContent

        // 菜单容器
        let menu_box = story_title_box.querySelector(".dropdown-menu ul")

        console.log('story_title_id = ', story_title_id)
        console.log('story_title_name = ', story_title_name)

        // 新增菜单
        let menu_item = createMenu("复制 ID(去掉ID)-标题", getContentNotID(story_title_id, story_title_name, "-"));
        menu_box.appendChild(menu_item)

        let menu_item2 = createMenu("复制 ID-标题", getContent(story_title_id, story_title_name, "-"));
        menu_box.appendChild(menu_item2)
    }


    function createMenu(name, copyContent) {
        let menu_box = document.createElement("li");
        let menu = document.createElement("a");
        menu.text = name;
        menu.id = "custom_copy_menu_id_tile"
        menu.setAttribute("data-clipboard-text", copyContent)

        let clipboard = new ClipboardJS('#custom_copy_menu_id_tile');

        clipboard.on('success', function (e) {
            console.log(e);
            console.info('Action:', e.action);
            console.info('Text:', e.text);
            console.info('Trigger:', e.trigger);
        });

        clipboard.on('error', function (e) {
            console.log(e);
            console.error('Action:', e.action);
            console.error('Trigger:', e.trigger);
        });

        menu_box.appendChild(menu);
        return menu_box;
    }

    function filterTitleId(titleId, includeId) {
        let new_titleId = titleId.trim().replace(/\t/g, "").replace(/【|】/g, "");
        if (includeId) {
            return new_titleId;
        } else {
            return new_titleId.replace("ID", "");
        }
    }

    function getContent(titleId, title, splitor) {
        return filterTitleId(titleId, true).concat(splitor, title.trim())
    }

    function getContentNotID(titleId, title, splitor) {
        return filterTitleId(titleId, false).concat(splitor, title.trim())
    }

})();

