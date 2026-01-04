// ==UserScript==
// @name         自动关闭233动漫网的广告。
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  主要是想去掉看动漫的时候的广告，自用，方便多设备同步。
// @author       weiv
// @match        https://www.dm233.cc/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/435752/%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD233%E5%8A%A8%E6%BC%AB%E7%BD%91%E7%9A%84%E5%B9%BF%E5%91%8A%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/435752/%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD233%E5%8A%A8%E6%BC%AB%E7%BD%91%E7%9A%84%E5%B9%BF%E5%91%8A%E3%80%82.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function () {
        remove_ad();

        sleep_f(3);
        remove_ad();

        const jump_time_map = init_jump_time_list();

        console.log("打印一下返回的map集合：", jump_time_map);

        // weiv 获取当前播放视频的名称。
        const player_name = document.querySelector(".playtitle").childNodes[1].innerText.replaceAll(" ", '');
        console.log("播放视频的名称：",player_name);

        // 获取本地存储的对应视频跳过开头时间。
        const jump_time = jump_time_map.get(player_name);

        const dom_video = document.querySelector("video");
        console.log(dom_video);
        //         dom_video.play();
        // weiv 使用 currentTime 可以设置播放的时间点。
        //         dom_video.currentTime = jump_time;
    }

    // weiv 这个方法是手动移除广告的实现。
    function remove_ad () {
        $("#HMRichBox").remove();
        $("#fix_bottom_dom").remove();

        // weiv 关闭左右边的广告。
        $("#coupletright").remove();
        $("#coupletleft").remove();

//         remove_ad_by_pad_v2021_12_30();
        remove_ad_by_pad_v2021_12_31();
    }

    // weiv 手动实现睡眠。
    function sleep_f (sec) {
        var init_sec = 1;
        var my_sleep = setInterval(() => {
            console.log(init_sec);
            init_sec ++;
            if (init_sec === sec) {
                clearInterval(my_sleep);
            }
        }, 1000);
    }

    // weiv 设置跳过播放片头。 min 是跳过的时间。
    function jump_page_head (min) {
        const video_obj = document.querySelector("video");
        video_obj.autoPlay = true;
        video_obj.currentTime = min;
    }

    function init_jump_time_list () {
        // 判断是否存储了对象，如果没有，就初始化一下。

        /*         const get_map = get("jump_time_map");

        if (get_map != null && get_map != undefined && get_map != {}) {
            return get_map;
        } */

        // weiv 定义一个对象，里面存储视频名称和对应的跳过时间。
        let jump_time_map = new Map();
        jump_time_map.set("完美世界", 124);
        jump_time_map.set("仙王的日常生活第二季", 124);
        jump_time_map.set("斗破苍穹三年之约", 140);

        //         set("jump_time_map", jump_time_map.toString());

        console.log(jump_time_map);
        console.log(jump_time_map.toString());
        return jump_time_map;
    }

    // weiv 2021-12-30 手机上和pad 上使用会弹出广告，并且这个广告的标签还是不固定的，所以需要动态获取这些标签，并删除。
    function remove_ad_by_pad_v2021_12_30 () {
        var map = {};
        var maps = new Map();
        //采用递归调用的方法，比较方便和简单。
        function fds(node) {

            if (node.nodeType === 1) {
                //这里我们用nodeName属性，直接获取节点的节点名称
                var tagName = node.nodeName;
                //判断对象中存在不存在同类的节点，若存在则添加，不存在则添加并赋值为1
                map[tagName] = map[tagName] ? map[tagName] + 1 : 1;

                // 将数组转存为map 对象。map 对象才能转换成 array 排序。
                maps.set(tagName, map[tagName]);
            }
            //获取该元素节点的所有子节点
            var children = node.childNodes;
            for (var i = 0; i < children.length; i++) {
                //递归调用
                fds(children[i])
            }
        }
        fds(document);
        console.log(map)
        // console.log(maps)

        var arrayObj=Array.from(maps);
        arrayObj.sort(function(a,b){return b[1] - a[1]});

        // 常用标签
        var tags = ['DIV', 'A', 'LI', 'SCRIPT', 'SPAN', 'P', 'INPUT', 'UL', 'META', 'IMG', 'LABEL', 'BUTTON', 'LINK', 'STRONG', 'FORM', 'SECTION', 'NAV', 'EM', 'TEXTAREA', 'HTML', 'HEAD', 'TITLE', 'STYLE', 'BODY', 'HEADER', 'IFRAME', 'FONT', 'I'];

        // 判断排序后的前6个，如果不是常用标签的，那么就是广告，获取标签，然后去掉。
        var adTags;
        for (var i = 0; i < 6; i++) {
            console.log(arrayObj[i][0]);
            if (tags.indexOf(arrayObj[i][0]) < 0) {
                adTags = arrayObj[i][0];
                break;
            }
        }

        // 判断出来的广告标签是
        console.log("获取到的广告标签： ", adTags);

        $(adTags).remove();
    }

    // weiv 2021-12-31 上面的代码过于复杂，后面想了一下，有更加简便的方法实现，原理是： 这个标签每次都是在站长统计后面出现的，所以获取到该对象的next 对象，就找到要移除的标签了。不过为啥有些网站没有站长统计。
    function remove_ad_by_pad_v2021_12_31 () {
        // 不知道为啥， 我的电脑上没有站长统计的按钮。
        // var adTags = $('a[title="站长统计"]').next()[0].localName;
        var adTags = $(".advp").nextAll()[5].localName;
        console.log("获取到的广告标签： ", adTags);
        $(adTags).remove();

        sleep_f(3);
        // 将关闭的按钮样式调整为最底层。虽然上面将标签都移除掉了，但是js 会再创建两个，所以有样式的是 下标 1.
        var exitClassName = $(adTags)[1].className;
        document.querySelector("." + exitClassName).style.zIndex = -99999
    }

})();