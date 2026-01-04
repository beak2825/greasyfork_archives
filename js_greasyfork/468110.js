// ==UserScript==
// @name         页面元素书签
// @namespace    https://sfkgroup.github.io/
// @version      0.1
// @description  允许将页面中的元素作为书签进行标记.
// @author       SFKgroup
// @match        *://*/*
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @icon         https://sfkgroup.github.io/images/favicon.ico
// @license      LGPL
// @downloadURL https://update.greasyfork.org/scripts/468110/%E9%A1%B5%E9%9D%A2%E5%85%83%E7%B4%A0%E4%B9%A6%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/468110/%E9%A1%B5%E9%9D%A2%E5%85%83%E7%B4%A0%E4%B9%A6%E7%AD%BE.meta.js
// ==/UserScript==

(function () {
    var book_list = GM_getValue('book', [])
    var css_list = GM_getValue('css', [])
    var set_list = []

    var colour = GM_getValue('colour', ['#ffcccc', '#ccffcc', '#ccccff', '#ccffff', '#ffccff', '#ffffcc', '#66ccff', '#39c5bb'])
    var bright = ['33', '66', '99', 'cc', 'ff']
    var bright_count = GM_getValue('bright', 0)

    function getPath(e) {
        e = arguments[0];
        window.event ? window.event.cancelBubble = true : e.stopPropagation();
        let domPath = Array();
        if (e.id) {
            domPath.unshift('#' + e.id.toLocaleLowerCase());
        } else {

            while (e.nodeName.toLowerCase() !== "html") {
                if (e.id) {

                    domPath.unshift('#' + e.id.toLocaleLowerCase());
                    break;
                } else if (e.tagName.toLocaleLowerCase() == "body") {

                    domPath.unshift(e.tagName.toLocaleLowerCase());
                } else {

                    for (let i = 0; i < e.parentNode.childElementCount; i++) {
                        if (e.parentNode.children[i] == e) {
                            domPath.unshift(e.tagName.toLocaleLowerCase() + ':nth-child(' + (i + 1) + ')');
                        }
                    }
                }
                e = e.parentNode;
            }

            domPath = domPath.toString().replaceAll(',', '>');
        }

        return domPath
    }


    function listen_dom(event) {
        let target = event.target
        let origin_bg = target.style.background
        //target.style.background = '#ffcccc'
        let css_path = getPath(target)
        let url = window.location.href
        let info = [url, css_path, 0, origin_bg, target.innerText.substring(0, 15)]
        let i = css_list.indexOf(css_path)
        if (i < 0) {
            book_list.push(info)
            css_list.push(css_path)
            target.style.background = colour[0] + bright[bright_count]
            set_list.push(GM_registerMenuCommand(info[4] + ':' + info[0], function () { act(book_list.length - 1) }))
        }
        else {
            book_list[i][2]++
            if (book_list[i][2] >= colour.length) {
                target.style.background = book_list[i][3]
                GM_log('Unselect')
                book_list.splice(i, 1)
                css_list.splice(i, 1)
                GM_unregisterMenuCommand(set_list[i])
            } else {
                target.style.background = colour[book_list[i][2]] + bright[bright_count]
            }
        }
        GM_setValue('css', css_list)
        GM_setValue('book', book_list)
        //GM_log(book_list, css_list)

    }

    function listen_inner() {
        listen_type = 'inner'
        document.addEventListener('click', listen_dom);
    }


    function listen_none() {
        document.removeEventListener('click', listen_dom)
    }


    function clearNode() {
        css_list = []
        book_list = []
        GM_setValue('css', css_list)
        GM_setValue('book', book_list)
        for (let i = 0; i < set_list.length; i++) {
            GM_unregisterMenuCommand(set_list[i])
        }
        GM_log(book_list, css_list)
    }

    function act(num) {
        GM_log(num + 'act')
        let e_0 = document.createElement("a");
        e_0.setAttribute("href", book_list[num][0]);
        e_0.click()
    }

    function change_bright() {
        bright_count++
        if (bright_count >= bright.length) { bright_count = 0 }
        GM_log(bright_count, bright[bright_count])
        GM_unregisterMenuCommand(bright_set)
        bright_set = GM_registerMenuCommand("标记透明度(" + bright[bright_count] + ')', change_bright, "b");
        GM_setValue('bright', bright_count)
    }

    function add_colour() {
        var input_key = prompt("请输入新增颜色的RGB", "#ffffff");
        colour.push(input_key)
        GM_setValue('colour', colour)
    }

    GM_registerMenuCommand("清空书签", clearNode);
    GM_registerMenuCommand("选择标记文字", listen_inner, "i");
    GM_registerMenuCommand("关闭选择", listen_none, "x");
    let bright_set = GM_registerMenuCommand("标记透明度(" + bright[bright_count] + ')', change_bright, "b");
    GM_registerMenuCommand("添加自定义颜色", add_colour, "c");

    for (let k = 0; k < book_list.length; k++) {
        set_list.push(GM_registerMenuCommand(book_list[k][4] + ':' + book_list[k][0], function () { act(k) }))
    }

    //GM_log(set_list,bright_set)

    var self_url = window.location.href
    for (let k = 0; k < book_list.length; k++) {
        if (self_url == book_list[k][0]) {
            document.querySelector(book_list[k][1]).style.background = colour[book_list[k][2]] + bright[bright_count]
            document.querySelector(book_list[k][1]).scrollIntoView()
        }
    }

})();