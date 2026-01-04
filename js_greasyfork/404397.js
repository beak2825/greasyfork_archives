// ==UserScript==
// @name         动漫花园屏蔽评论
// @namespace    https://greasyfork.org/zh-CN/users/171607
// @version      0.2
// @description  实现可分别按用户名、关键字、正则表达式对评论进行屏蔽; 鼠标移至网页右下角弹出悬浮按钮
// @author       菜姬
// @match        *://dmhy.org/*
// @match        *://www.dmhy.org/*
// @match        *://share.dmhy.org/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/404397/%E5%8A%A8%E6%BC%AB%E8%8A%B1%E5%9B%AD%E5%B1%8F%E8%94%BD%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/404397/%E5%8A%A8%E6%BC%AB%E8%8A%B1%E5%9B%AD%E5%B1%8F%E8%94%BD%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const OLD_URL = location.href;
    const CHECKBOX_VALUE = {
        START: ['startCheckbox', '启用屏蔽功能', '总开关'],
        VIDEO_USERNAME: ['videoUsernameCheckbox', '按用户名', '屏蔽指定用户发布的视频'],
        VIDEO_KEYWORD: ['videoKeywordCheckbox', '按关键字', '屏蔽标题中包含指定关键字的视频'],
        VIDEO_REG: ['videoRegCheckbox', '按正则', '屏蔽标题匹配指定正则表达式的视频'],
        COMMENT_USERNAME: ['commentUsernameCheckbox', '按用户名', '屏蔽指定用户发布的评论'],
        COMMENT_KEYWORD: ['commentKeywordCheckbox', '按关键字', '屏蔽内容中包含指定关键字的评论'],
        COMMENT_REG: ['commentRegCheckbox', '按正则', '屏蔽内容匹配指定正则表达式的评论'],
        CONVERT_EMOJI: ['convertEmojiCheckbox', '表情转成文字', '判定时将表情包转换成对应的标识文字,例:[doge]']
    };
    const INPUT_VALUE = {
        USERNAME: ['usernameInput', '输入:', '多个时以半角逗号分隔'],
        VIDEO_KEYWORD: ['videoKeywordInput', '输入:', '多个时以半角逗号分隔'],
        COMMENT_KEYWORD: ['commentKeywordInput', '输入:', '多个时以半角逗号分隔'],
        VIDEO_REG: ['videoRegInput', '输入:', ' / 建议写成 \\/ '],
        VIDEO_MODIFIER: ['videoModifierInput', '修饰符:', '如:gim'],
        COMMENT_REG: ['commentRegInput', '输入:', ' / 建议写成 \\/ '],
        COMMENT_MODIFIER: ['commentModifierInput', '修饰符:', '如:gim']
    };
    const TEXTAREA_VALUE = {
        USERNAME: ['usernameTextarea', ''],
        VIDEO_KEYWORD: ['videoKeywordTextarea', ''],
        COMMENT_KEYWORD: ['commentKeywordTextarea', ''],
        VIDEO_REG: ['videoRegTextarea', ''],
        COMMENT_REG: ['commentRegTextarea', '']
    };
    const BUTTON_VALUE = {
        ADD: ['input_btn', '添加', '添加内容到列表中'],
        DELETE: ['input_btn', '删除', '从列表中删除符合的项目'],
        CLEAR: ['input_btn', '清空', '添空列表'],
        COPY: ['input_btn', '复制', '复制列表'],
        CANCEL: ['user_block_button cancel_button', '取消', '关闭设置窗口'],
        SAVE: ['user_block_button save_button', '保存并关闭', '保存设置并关闭设置窗口'],
        ONLY_SAVE: ['user_block_button save_button', '仅保存', '仅保存设置']
    };
    const STYLE_VALUE = `
    .expand_box {
        bottom: 0px;
        height: 6vh;
        position: fixed;
        right: -6vw;
        transition: 0.5s;
        width: 12vw;
        z-index: 99999;
    }
    .show_expand_box {
        right: 0;
        width: 6vw;
    }
    #expandSpan {
        background-color: #00A1D6;
        border-radius: 19px;
        border: 1px solid #00A1D6;
        bottom: 1vh;
        color: #FFF;
        cursor: pointer;
        display: block;
        font-size: 13px;
        height: 38px;
        line-height: 38px;
        position: absolute;
        right: 1vw;
        text-align: center;
        width: 38px;
        z-index: 99999;
    }
    #wrapDiv {
        background-color: #222222;
        border-radius: 3px;
        border: 1px solid #282A36;
        bottom: 6vh;
        box-shadow: 0 0 5px #282A36;
        color: #D3D3D3;
        font-size: 13px;
        margin: 0px;
        padding: 0px;
        position: fixed;
        text-align: left;
        transition: 0.8s;
        width: 452px;
        z-index: 99999;
    }
    .show_wrap {
        display: block;
        right: 0;
    }
    .hide_wrap {
        right: -460px;
    }
    #mainTag {
        border-radius: 3px;
        border: 3px groove #00A1D6;
        height: auto;
        margin: 8px;
        min-width: 300px;
        padding: 4px 9px 6px 9px;
        width: auto;
    }
    .ul_tag {
        list-style: none;
        padding-left: 0;
    }
    .checkbox_li {
        display: inline-block;
    }
    .move_right {
        margin-left: 15px;
    }
    .checkbox_label {
        cursor: pointer;
        vertical-align: middle;
    }
    .checkbox_input {
        clip: rect(0, 0, 0, 0);
        position: absolute;
    }
    .checkbox_input + label::before {
        background-color: silver;
        border-radius: 0.1em;
        color: #FFF;
        content: "\\a0";
        display: inline-block;
        height: 1em;
        line-height: 85%;
        margin-right: 0.5em;
        text-align: center;
        vertical-align: 0.2em;
        width: 1em;
    }
    .checkbox_input:checked + label::before {
        background-color: #00A1D6;
        content: "\\2713";
    }
    .separator_text {
        color: #FFB86C;
        margin-bottom: 2px;
        margin-top: 2px;
    }
    .separator_symbol {
        background-color: #303030;
        height: 2px;
        margin-bottom: 5px;
        margin-top: 5px;
        min-width: 400px;
    }
    .input_div {
        margin-top: 5px;
    }
    .user_block_input {
        background-color: #C0C0C0;
        border: 1px solid #C0C0C0;
        color: #000;
        font-size: 13px;
        height: 15px;
        margin-left: 5px;
        margin-right: 5px;
        padding-left: 4px;
    }
    .input_btn {
        background-color: #3da9cc;
        border-radius: 3px;
        border: 1px solid #73C9E5;
        box-shadow: 0 0 4px #73C9E5;
        color: #FFF;
        cursor: pointer;
        display: inline-block;
        height: 15px;
        line-height: 15px;
        margin-left: 5px;
        text-align: center;
        vertical-align: bottom;
        white-space: nowrap;
        width: 30px;
    }
    .textarea_div {
        margin-top: 5px;
    }
    .textarea_list_div {
        border: 1px dotted #00A1D6;
        margin-top: 3px;
        max-height: 60px;
        min-height: 3px;
        overflow: auto;
    }
    .textarea_list_div::-webkit-scrollbar {
        background-color: #555;
        border-radius: 5px;
        width: 10px;
    }
    .textarea_list_div::-webkit-scrollbar-thumb {
        background-color: #333;
        border-radius: 5px;
    }
    .textarea_copied {
        color: #000;
    }
    .keyword_input {
        width: 150px;
    }
    .reg_input {
        width: 100px;
    }
    .modifier_input {
        width: 50px;
    }
    .child_span {
        background-color: #3D3D3D;
        border-radius: 5px;
        border: 1px solid #3D3D3D;
        display: inline-block;
        margin: 3px;
        padding: 2px;
    }
    .child_text {
        border-right: 1px solid #A9181C;
        margin-right: 4px;
        padding-right: 4px;
    }
    .child_del {
        color: #A9181C;
        cursor: pointer;
    }
    .user_block_button {
        background-color: #FB7299;
        border-radius: 4px;
        border: 1px solid #FB7299;
        color: #FFF;
        cursor: pointer;
        margin-top: 5px;
        padding: 2px 4px;
        position: relative;
    }
    .save_button {
        float: right;
        margin-right: 5px;
    }
    .cancel_button {
        float: left;
        margin-left: 5px;
    }
    .block_none {
        display: none !important;
    }
    .block_hidden {
        visibility: hidden;
    }
    `;
    var dmhy_ban_config = {
        usernameArray: [],
        commentArray: [],
        commentRegArray: []
    };
    var reg_config = {
        regArray: [],
        commentRegArray: []
    };

    function string_2_Array(text_string) {
        let temp_array = text_string.split(',');
        let return_array = [];
        for (let i = 0, l = temp_array.length; i < l; i++) {
            for (let j = i + 1; j < l; j++) {
                if (temp_array[i] === temp_array[j]) {
                    ++i;
                    j = i
                }
            }
            return_array.push(temp_array[i])
        }
        return return_array
    }
    function array_2_String(text_array) {
        return text_array.join(',')
    }
    function convert_Array(string_array) {
        let re_arr = [];
        for (let i = 0; i < string_array.length; i++) {
            if (string_array[i]) {
                try {
                    let new_reg = new RegExp(string_array[i].replace(/^\/|\/[a-z]*$/gi, ''), string_array[i].replace(/^\/.*\/[^a-z]*/i, ''));
                    re_arr.push(new_reg)
                } catch (e) {
                    console.log('The transformation contains invalid regular expressions.');
                    console.log(e)
                }
            }
        }
        return re_arr
    }
    function extract_Array(list_id) {
        let re_arr = [];
        let list_dom = document.getElementById(list_id);
        let list_arr = list_dom.getElementsByClassName('DmhyTextSpan');
        for (let i = list_arr.length - 1; i >= 0; i--) {
            if (list_arr[i].title) {
                re_arr.push(list_arr[i].title)
            } else {
                re_arr.push(list_arr[i].innerText)
            }
        }
        return re_arr
    }
    function del_Child(input_tag, list_id) {
        let text_value = input_tag.value;
        if (text_value) {
            let del_status = false;
            let text_arr = string_2_Array(text_value);
            let save_arr = extract_Array(list_id);
            text_arr.forEach(function (item) {
                if (save_arr.includes(item)) {
                    let total_child = document.getElementById(list_id).getElementsByClassName('child_span');
                    try {
                        document.getElementById(list_id).removeChild(total_child[total_child.length - 1 - save_arr.indexOf(item)]);
                        del_status = true
                    } catch (e) {
                        del_status = false;
                        console.log('Error deleting element.');
                        console.log(e)
                    }
                }
            });
            if (del_status) {
                input_tag.value = ''
            }
        }
    }
    function add_Child(input_tag, list_id) {
        let text_value = input_tag.value;
        if (text_value) {
            let text_arr = string_2_Array(text_value);
            let save_arr = extract_Array(list_id);
            text_arr.forEach(function (item) {
                if (!save_arr.includes(item)) {
                    document.getElementById(list_id).insertAdjacentElement('afterbegin', create_Child(item))
                }
            })
        }
        input_tag.value = ''
    }
    function del_Reg_Child(reg_input, modifier_input, list_id) {
        let reg_value = reg_input.value;
        let modifier_value = modifier_input.value;
        if (reg_value) {
            let del_status = false;
            try {
                let reg_str = new RegExp(reg_value, modifier_value);
                let save_arr = extract_Array(list_id);
                if (save_arr.includes(reg_str.toString())) {
                    let total_child = document.getElementById(list_id).getElementsByClassName('child_span');
                    document.getElementById(list_id).removeChild(total_child[total_child.length - 1 - save_arr.indexOf(reg_str.toString())]);
                    del_status = true
                }
            } catch (e) {
                del_status = false;
                console.log('Invalid regular expression or error deleting element.');
                console.log(e)
            }
            if (del_status) {
                reg_input.value = '';
                modifier_input.value = ''
            }
        }
    }
    function add_Reg_Child(reg_input, modifier_input, list_id) {
        let reg_value = reg_input.value;
        let modifier_value = modifier_input.value;
        if (reg_value) {
            try {
                let reg_str = new RegExp(reg_value, modifier_value);
                let save_arr = extract_Array(list_id);
                if (!save_arr.includes(reg_str.toString())) {
                    document.getElementById(list_id).insertAdjacentElement('afterbegin', create_Child(reg_str.toString()))
                }
                reg_input.value = '';
                modifier_input.value = ''
            } catch (e) {
                console.log('Invalid regular expression.');
                console.log(e)
            }
        }
    }
    function expand_Wrap(id_value) {
        if (document.getElementById(id_value)) {
            if (document.getElementById(id_value).className == 'show_wrap') {
                document.getElementById(id_value).className = 'hide_wrap'
            } else {
                document.getElementById(id_value).className = 'show_wrap'
            }
        } else {
            create_Settings()
        }
    }
    function insert_Separator(ul_node, text_value = '') {
        let temp_li = document.createElement('li');
        let temp_div = document.createElement('div');
        if (text_value) {
            temp_div.className = 'separator_text';
            temp_div.innerText = text_value
        } else {
            temp_div.className = 'separator_symbol'
        }
        temp_li.appendChild(temp_div);
        ul_node.appendChild(temp_li)
    }
    function insert_Checkbox(ul_node, li_array, check_enable_value, margin_status = true) {
        let temp_li = document.createElement('li');
        temp_li.className = 'checkbox_li';
        if (margin_status) {
            temp_li.classList.add('move_right')
        }
        let temp_input = document.createElement('input');
        temp_input.type = 'checkbox';
        temp_input.className = 'checkbox_input';
        temp_input.id = li_array[0];
        if (check_enable_value) {
            temp_input.checked = true
        } else {
            temp_input.checked = false
        }
        let temp_label = document.createElement('label');
        temp_label.className = 'checkbox_label';
        temp_label.setAttribute('for', li_array[0]);
        temp_label.innerText = li_array[1];
        temp_label.title = li_array[2];
        temp_li.appendChild(temp_input);
        temp_li.appendChild(temp_label);
        ul_node.appendChild(temp_li)
    }
    function insert_Input(ul_node, li_array, list_id) {
        let temp_li = document.createElement('li');
        let temp_div = document.createElement('div');
        temp_div.className = 'input_div';
        temp_div.innerText = li_array[1];
        let temp_input = document.createElement('input');
        temp_input.id = li_array[0];
        temp_input.placeholder = li_array[2];
        temp_input.type = 'text';
        temp_input.className = 'user_block_input keyword_input';
        temp_input.addEventListener('keyup', function (e) {
            if (e.keyCode === 13) {
                add_Child(temp_input, list_id)
            }
        });
        let add_btn = create_Span_Btn(BUTTON_VALUE.ADD, function () {
            add_Child(temp_input, list_id)
        });
        let delete_btn = create_Span_Btn(BUTTON_VALUE.DELETE, function () {
            del_Child(temp_input, list_id)
        });
        let clear_btn = create_Span_Btn(BUTTON_VALUE.CLEAR, function () {
            document.getElementById(list_id).innerHTML = ''
        });
        let copy_btn = create_Span_Btn(BUTTON_VALUE.COPY, function () {
            GM_setClipboard(array_2_String(extract_Array(list_id)));
            copy_btn.classList.add('textarea_copied');
            copy_btn.title = '复制完成'
        });
        temp_div.appendChild(temp_input);
        temp_div.appendChild(add_btn);
        temp_div.appendChild(delete_btn);
        temp_div.appendChild(clear_btn);
        temp_div.appendChild(copy_btn);
        temp_li.appendChild(temp_div);
        ul_node.appendChild(temp_li)
    }
    function insert_Reg_Input(ul_node, reg_array, modifier_array, list_id) {
        let temp_li = document.createElement('li');
        let temp_div = document.createElement('div');
        temp_div.className = 'input_div';
        let reg_span = document.createElement('span');
        reg_span.innerText = reg_array[1];
        let reg_input = document.createElement('input');
        reg_input.id = reg_array[0];
        reg_input.placeholder = reg_array[2];
        reg_input.type = 'text';
        reg_input.className = 'user_block_input reg_input';
        let modifier_span = document.createElement('span');
        modifier_span.innerText = modifier_array[1];
        let modifier_input = document.createElement('input');
        modifier_input.id = modifier_array[0];
        modifier_input.placeholder = modifier_array[2];
        modifier_input.type = 'text';
        modifier_input.className = 'user_block_input modifier_input';
        let add_btn = create_Span_Btn(BUTTON_VALUE.ADD, function () {
            add_Reg_Child(reg_input, modifier_input, list_id)
        });
        let delete_btn = create_Span_Btn(BUTTON_VALUE.DELETE, function () {
            del_Reg_Child(reg_input, modifier_input, list_id)
        });
        let clear_btn = create_Span_Btn(BUTTON_VALUE.CLEAR, function () {
            document.getElementById(list_id).innerHTML = ''
        });
        let copy_btn = create_Span_Btn(BUTTON_VALUE.COPY, function () {
            GM_setClipboard(array_2_String(extract_Array(list_id)));
            copy_btn.classList.add('textarea_copied');
            copy_btn.title = '复制完成'
        });
        modifier_span.appendChild(modifier_input);
        reg_span.appendChild(reg_input);
        temp_div.appendChild(reg_span);
        temp_div.appendChild(modifier_span);
        temp_div.appendChild(add_btn);
        temp_div.appendChild(delete_btn);
        temp_div.appendChild(clear_btn);
        temp_div.appendChild(copy_btn);
        temp_li.appendChild(temp_div);
        ul_node.appendChild(temp_li)
    }
    function insert_Textarea(ul_node, li_array, save_array) {
        let temp_li = document.createElement('li');
        let temp_div = document.createElement('div');
        temp_div.className = 'textarea_div';
        let list_div = document.createElement('div');
        list_div.className = 'DmhyListDiv';
        list_div.id = li_array[0];
        list_div.className = 'textarea_list_div';
        for (let item of save_array) {
            if (item) {
                list_div.insertAdjacentElement('afterbegin', create_Child(item))
            }
        }
        temp_div.appendChild(list_div);
        temp_li.appendChild(temp_div);
        ul_node.appendChild(temp_li)
    }
    function create_Span_Btn(value_array, callback) {
        let temp_span = document.createElement('span');
        temp_span.className = value_array[0];
        temp_span.innerText = value_array[1];
        temp_span.title = value_array[2];
        temp_span.addEventListener('click', function (e) {
            callback(e)
        }, false);
        return temp_span
    }
    function create_Child(text_value) {
        let temp_span = document.createElement('span');
        temp_span.className = 'child_span';
        let text_span = document.createElement('span');
        text_span.className = 'DmhyTextSpan child_text';
        text_span.innerText = (text_value.length > 9 ? text_value.slice(0, 3) + '...' + text_value.slice(-3) : text_value);
        if (text_value.length > 9) {
            text_span.title = text_value
        }
        let del_span = document.createElement('span');
        del_span.innerText = 'X';
        del_span.title = '移除';
        del_span.className = 'child_del';
        del_span.addEventListener('click', function () {
            temp_span.parentNode.removeChild(temp_span)
        });
        temp_span.appendChild(text_span);
        temp_span.appendChild(del_span);
        return temp_span
    }

    function dmhy_ban_init() {
        let style_dom = document.createElement('style');
        style_dom.type = 'text/css';
        style_dom.innerHTML = STYLE_VALUE;
        let expand_box = document.createElement('div');
        expand_box.className = 'expand_box';
        expand_box.onmouseenter = function () {
            this.classList.add('show_expand_box')
        };
        expand_box.onmouseleave = function () {
            this.classList.remove('show_expand_box')
        };
        let expand_span = document.createElement('span');
        expand_span.id = 'expandSpan';
        expand_span.title = '打开/关闭屏蔽设置';
        expand_span.innerText = '屏蔽';
        expand_span.addEventListener('click', function () {
            expand_Wrap('wrapDiv')
        }, false);
        expand_box.appendChild(expand_span);
        document.body.appendChild(expand_box);
        document.body.appendChild(style_dom)
        let comment_block = document.querySelector('#recent-commnet');
        if (comment_block)
        {
            comment_block.addEventListener("DOMNodeInserted", function (event) {
                hide_Event();
                document.querySelectorAll('span.username').forEach((item) => {
                    item.onclick = (e) => {
                        if (!document.getElementById('wrapDiv')) create_Settings();
                        let input = document.createElement('input');
                        input.value = e.target.textContent;
                        add_Child(input, TEXTAREA_VALUE.USERNAME[0]);
                        alert(`用户 ${e.target.textContent} 被添加入屏蔽列表（尚未保存）`);
                    };
                });
            }, false);
        }
    }
    function create_Settings() {
        let wrap_div = document.createElement('div');
        wrap_div.id = 'wrapDiv';
        wrap_div.className = 'show_wrap';
        let main_tag = document.createElement('fieldset');
        main_tag.id = 'mainTag';
        wrap_div.appendChild(main_tag);
        let ul_tag = document.createElement('ul');
        ul_tag.className = 'ul_tag';
        main_tag.appendChild(ul_tag);
        insert_Separator(ul_tag);
        insert_Separator(ul_tag, '用户名:');
        insert_Input(ul_tag, INPUT_VALUE.USERNAME, TEXTAREA_VALUE.USERNAME[0]);
        insert_Textarea(ul_tag, TEXTAREA_VALUE.USERNAME, dmhy_ban_config.usernameArray);
        insert_Separator(ul_tag);
        insert_Separator(ul_tag, '评论关键字:');
        insert_Input(ul_tag, INPUT_VALUE.COMMENT_KEYWORD, TEXTAREA_VALUE.COMMENT_KEYWORD[0]);
        insert_Textarea(ul_tag, TEXTAREA_VALUE.COMMENT_KEYWORD, dmhy_ban_config.commentArray);
        insert_Separator(ul_tag);
        insert_Separator(ul_tag, '评论正则表达式:');
        insert_Reg_Input(ul_tag, INPUT_VALUE.COMMENT_REG, INPUT_VALUE.COMMENT_MODIFIER, TEXTAREA_VALUE.COMMENT_REG[0]);
        insert_Textarea(ul_tag, TEXTAREA_VALUE.COMMENT_REG, dmhy_ban_config.commentRegArray);
        insert_Separator(ul_tag);
        let save_button = create_Span_Btn(BUTTON_VALUE.SAVE, function () {
            save_Config()
        });
        let only_save_button = create_Span_Btn(BUTTON_VALUE.ONLY_SAVE, function () {
            save_Config(false)
        });
        let cancel_button = create_Span_Btn(BUTTON_VALUE.CANCEL, function (e) {
            expand_Wrap('wrapDiv');
            e.stopPropagation()
        });
        ul_tag.appendChild(save_button);
        ul_tag.appendChild(only_save_button);
        ul_tag.appendChild(cancel_button);
        document.body.appendChild(wrap_div)
    }
    function save_Config(close_status = true) {
        dmhy_ban_config.usernameArray = extract_Array(TEXTAREA_VALUE.USERNAME[0]);
        dmhy_ban_config.commentArray = extract_Array(TEXTAREA_VALUE.COMMENT_KEYWORD[0]);
        dmhy_ban_config.commentRegArray = extract_Array(TEXTAREA_VALUE.COMMENT_REG[0]);
        reg_config.commentRegArray = convert_Array(dmhy_ban_config.commentRegArray);
        GM_setValue('dmhy_ban_config', dmhy_ban_config);
        hide_Event();
        if (close_status) {
            expand_Wrap('wrapDiv')
        }
    }
    function check(tr) {
        let user = tr.querySelector('span.username').textContent;
        let title = tr.querySelector('.title > strong').textContent;
        let comment = tr.querySelector('.comment_con > span').textContent;
        if (dmhy_ban_config.usernameArray.includes(user)) return true;
        for (const bannedWord of dmhy_ban_config.commentArray) {
            if (title.includes(bannedWord)) return true;
            if (comment.includes(bannedWord)) return true;
        }
        for (let j of reg_config.commentRegArray) {
            if (j.test(comment) || j.test(title)) {
                return true
            }
        }
    }
    function hide_Event() {
        for (let i of document.querySelectorAll('#comment_recent tr')) {
            if (check(i)) i.hidden = true;
            else i.hidden = false;
        }
    }
    Promise.all([GM_getValue('dmhy_ban_config')]).then(function (data) {
        if (data[0] !== undefined) {
            dmhy_ban_config = data[0]
        }
        if (dmhy_ban_config.commentArray === undefined) {
            dmhy_ban_config.commentArray = []
        }
        if (dmhy_ban_config.commentRegArray === undefined) {
            dmhy_ban_config.commentRegArray = []
        }
        if (dmhy_ban_config.commentRegArray.length > 0) {
            reg_config.commentRegArray = convert_Array(dmhy_ban_config.commentRegArray)
        }
        //console.log(dmhy_ban_config);
        dmhy_ban_init();
        hide_Event();
        try {
            GM_registerMenuCommand('动漫花园屏蔽设置', function () {
                expand_Wrap('wrapDiv')
            })
        } catch (e) {
            console.log(e)
        }
    }).
        catch(function (except) {
            console.log(except)
        })
})();