// ==UserScript==
// @name         AcFun - 视频播放速度3x和1.35x
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  新增视频和番剧的播放速度，修改li_arr数组的内容可以实现自定义播放速度
// @author       dareomaewa
// @match        https://www.acfun.cn/bangumi/*
// @match        https://www.acfun.cn/v/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542845/AcFun%20-%20%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A63x%E5%92%8C135x.user.js
// @updateURL https://update.greasyfork.org/scripts/542845/AcFun%20-%20%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A63x%E5%92%8C135x.meta.js
// ==/UserScript==

(function() {

    function getSpeedPanelUl(speed_panel_ul) {
        if(speed_panel_ul != null) {
            var li_arr = [
                3, 1.35,
            ];
            li_arr.forEach(function(item) {
                var li_ele = document.createElement("li");
                li_ele.innerHTML = '<li data-val="' + item + '" class="">' + item + 'x</li>';
                var li_node = li_ele.childNodes[0];
                speed_panel_ul.appendChild(li_node);
            })
            return speed_panel_ul;
        }else {
            setTimeout(function(){
                speed_panel_ul = document.querySelector('.speed-panel ul');
                getSpeedPanelUl(speed_panel_ul);
            }, 300);
        }
    }

    var speed_panel_ul = document.querySelector('.speed-panel ul');
    speed_panel_ul = getSpeedPanelUl(speed_panel_ul);

    function getPartWarp(part_warp) {
        if(part_warp != null) {
            part_warp.style.maxHeight = '1000px';
            var right_list = document.querySelector('.right-list');
            right_list.style.maxHeight = '1000px';
            return part_warp;
        }else {
            setTimeout(function(){
                part_warp = document.querySelector('.part-wrap');
                getPartWarp(part_warp);
            }, 300);
        }
    }

    var part_warp = document.querySelector('.part-wrap');
    part_warp = getPartWarp(part_warp);


})();