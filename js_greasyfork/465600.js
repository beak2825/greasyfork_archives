// ==UserScript==
// @name         Bilibili（B站）刮刮乐直播间盈亏计数菌小帮手
// @namespace    https://ezstudio.top/
// @version      1.1
// @description  方便计算Bilibili（B站）刮刮乐直播间盈亏！
// @author       EZStudio
// @match        https://live.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @homepage     https://greasyfork.org/zh-CN/scripts/465600
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465600/Bilibili%EF%BC%88B%E7%AB%99%EF%BC%89%E5%88%AE%E5%88%AE%E4%B9%90%E7%9B%B4%E6%92%AD%E9%97%B4%E7%9B%88%E4%BA%8F%E8%AE%A1%E6%95%B0%E8%8F%8C%E5%B0%8F%E5%B8%AE%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/465600/Bilibili%EF%BC%88B%E7%AB%99%EF%BC%89%E5%88%AE%E5%88%AE%E4%B9%90%E7%9B%B4%E6%92%AD%E9%97%B4%E7%9B%88%E4%BA%8F%E8%AE%A1%E6%95%B0%E8%8F%8C%E5%B0%8F%E5%B8%AE%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Global Variants...
    let cost_value = 0;
    let comments_textarea = null;

    function get_comment() {
        if (comments_textarea.value === '') {
            return;
        }
        cost_value = parseInt(comments_textarea.value);
        if (cost_value !== cost_value) {
            cost_value = 0;
        }
    }

    function set_comment() {
        comments_textarea.value = cost_value.toString();
        comments_textarea.dispatchEvent(new Event("input"));
    }

    function set_cost(v) {
        return () => {
            get_comment();
            cost_value += v;
            set_comment();
        };
    }

    function gua_gua_le() {
        // Init values
        let root = null;
        try {
            root = document.getElementsByClassName('player')[0].firstChild.firstChild.firstChild.contentDocument;
        } catch (e) {
            root = document;
        }
        comments_textarea = root.getElementsByClassName('chat-input border-box')[1];
        let right_action = root.getElementsByClassName('right-action p-absolute live-skin-coloration-area')[0];
        if (typeof(comments_textarea) === 'undefined' || typeof(right_action) === 'undefined') {
            return;
        }

        // Clear interval
        clearInterval(gua_gua);

        // Set button css style
        right_action.firstChild.style.cssText = 'min-width: 69px; height: 16px; margin: 1px;';
        let attributes = right_action.firstChild.attributes;

        // Duplicate buttons
        const buttons_text = ['+5', '+10', '+20', '读取', '-5', '-10', '-20'];
        const buttons_func = [set_cost(5), set_cost(10), set_cost(20), set_comment, set_cost(-5), set_cost(-10), set_cost(-20)];
        for (let i = 0; i < buttons_text.length; i++) {
            if (right_action.childElementCount >= 8) {
                break;
            }
            let button_root = root.createElement('button');
            for (let j = 0; j < attributes.length; j++) {
                var name = attributes[j].name;
                var value = attributes[j].value;
                button_root.setAttribute(name, value);
            }
            button_root.textContent = buttons_text[i];
            button_root.onclick = buttons_func[i];
            right_action.appendChild(button_root);
        }
    }

    const gua_gua = setInterval(gua_gua_le, 100);
})();