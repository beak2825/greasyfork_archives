// ==UserScript==
// @name         微博评论展开人数统计
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Only for LX!
// @author       Chinshry
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @include      /https?:\/\/weibo\.com/\d+/.+/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403337/%E5%BE%AE%E5%8D%9A%E8%AF%84%E8%AE%BA%E5%B1%95%E5%BC%80%E4%BA%BA%E6%95%B0%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/403337/%E5%BE%AE%E5%8D%9A%E8%AF%84%E8%AE%BA%E5%B1%95%E5%BC%80%E4%BA%BA%E6%95%B0%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function() {
    const div_button_span = $('<span>评论名单</span>');
    div_button_span[0].id = 'text_div'
    div_button_span[0].style = 'font-size: 12px;line-height: 20px;color: #0080c6;';
    const div_button = $('<div/>');
    div_button[0].style = 'cursor: pointer;text-align: center;padding: 0px;';
    const div_side_bar = $('<div/>');
    div_side_bar[0].style = 'width: 56px;height: 20px;overflow: hidden;position: fixed;right: 0px;bottom: 10%;padding: 4px 4px;background-color: rgb(255, 255, 255);z-index: 10001;border-radius: 8px 0px 0px 8px;box-shadow: rgba(0, 85, 255, 0.0980392) 0px 0px 20px 0px;border: 1px solid rgb(233, 234, 236);';
    div_button.append(div_button_span);
    div_side_bar.append(div_button);
    $('.gn_position div.gn_nav').first().after(div_side_bar);

    // 绘制设置界面
    const div_position = $('<div/>');
    //div_position[0].id = 'data_div'
    div_position[0].style = 'display: none;position: fixed;height: 300px;width: 300px;bottom: 5%;z-index: 9999;';
    const div_style = $('<div/>');
    div_style[0].style = 'display: block;overflow: hidden;height: inherit;width: 300px;border-radius: 8px;box-shadow: rgba(106, 115, 133, 0.219608) 0px 6px 12px 0px;border: 1px solid #1e90ff ;background-color: rgb(255, 255, 255);overflow: scroll;';
    div_position.append(div_style);

    const div_data = $('<div/>');
    div_data[0].id = 'data_div'
    div_data[0].style = 'padding: 20px; box-sizing: border-box;';
    div_style.append(div_data);

    document.body.appendChild(div_position[0]);


    // 设置事件 点击展开或关闭侧边栏
    div_button.click(() => {
        if ($("#text_div").text() == "评论名单") {
            var data_list = getList()
            console.log("==============")
            var str = '共'+data_list.length+'人<br>==================<br>'
            for(var i=0;i<data_list.length;i++){
                str += data_list[i]
                str+=`<br>`
            }
            console.log(str)
            $("#data_div").html(str);

            div_position.css('right', div_side_bar[0].clientWidth + 'px');
            div_position.show();
            div_button_span.text('隐藏窗口');
            div_button_span.css('color', '#ff8e29');

        } else {
            div_position.hide();
            div_button_span.text('评论名单');
            div_button_span.css('color', '#0080c6');
        }
    });

    function getList() {
        var a = document.evaluate("//div[@class='list_con']/div[@class='WB_text']/a[1]", document, null, XPathResult.ANY_TYPE, null);
        var xnodes = [];
        var xres;
        while (xres = a.iterateNext()) {
            xnodes.push(xres.innerText);
        }
        console.log(xnodes)
        var out = unique(xnodes)
        return out

    }

    function unique(arr) {
        if (!Array.isArray(arr)) {
            console.log('type error!')
            return
        }
        var array = [];
        for (var i = 0; i < arr.length; i++) {
            if (array .indexOf(arr[i]) === -1) {
                array .push(arr[i])
            }
        }
        return array;
    }

    'use strict';
    function q(a,b) {return (b||document).querySelector(a)}
    function qa(a,b) {return (b||document).querySelectorAll(a)}
    const list = [];
    let running;
    function notInList(node) {
        return list.indexOf(node) == -1;
    }
    function clickInView(node) {
        if (
            node &&
            node.offsetTop >= document.documentElement.scrollTop &&
            node.offsetTop < document.documentElement.scrollTop + window.innerHeight + 200
           ) {
            //console.log('click',list.length)
            node.click();
            return true;
        }
    }
    function runList() {
        running = true;
        const clicked = clickInView(list.shift())
        if(list.length==0) {
            //console.log('stop',list.length)
            running = false;
            return;
        }
        if(!clicked || !q('.list_con .W_loading:not([style])')) {
            //console.log('skip',list.length)
            runList();
        }
        else setTimeout(runList,localStorage.autodelay||1000);
    }
    function append(selector) {
        list.push(...Array.from(qa(selector)).filter(notInList));
        if(!running) {
            //console.log('start',list.length)
            runList();
        }
    }
    function run() {
        if(q('.WB_tab')) {
            window.removeEventListener('scroll',run);
            return;
        }
        append('.WB_text a[action-data*="more_comment"]');
        append('.list_box .WB_cardmore .more_txt');
    }
    window.addEventListener('scroll',run);
})();