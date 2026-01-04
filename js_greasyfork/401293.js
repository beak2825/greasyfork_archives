// ==UserScript==
// @icon            https://www.google.com/s2/favicons?domain=gaoxiaobang.com/
// @name            高校邦一键看完当前视频
// @namespace       https://github.com/GitACzero/Greasy-Fork/tree/master/%E9%AB%98%E6%A0%A1%E9%82%A6
// @author          Zero
// @description     练习脚本，一键修改进度到100%
// @match            *://u.class.gaoxiaobang.com/*
// @require         http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @version         2.2
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/401293/%E9%AB%98%E6%A0%A1%E9%82%A6%E4%B8%80%E9%94%AE%E7%9C%8B%E5%AE%8C%E5%BD%93%E5%89%8D%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/401293/%E9%AB%98%E6%A0%A1%E9%82%A6%E4%B8%80%E9%94%AE%E7%9C%8B%E5%AE%8C%E5%BD%93%E5%89%8D%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==
/*global $: true, jQuery: false */ //定义全局变量
(function () {
    'use strict';
    init();

    setTimeout(function() {
        autoClick();
    }, 6000);

})();

function init() {
    //与元数据块中的@grant值相对应，功能是生成一个style样式
    GM_addStyle('#skip_video{color:#fa7d3c;border-bottom: 4px solid #ff1f40;};');

    //视频t跳过按钮的html代码
    var skip_btn_html = document.createElement("a");
    skip_btn_html += '<a href="javascript:void(0);" class="btn" id="skip_video" onclick="alert("点我");>';
    skip_btn_html += '一键跳过';
    skip_btn_html += '</a>';

    //将以上拼接的html代码插入到网页里的a标签中
    var ul_tag = $("div.gxb-nav-content");
    if (ul_tag) {
        ul_tag.append(skip_btn_html);
    }
/*
     $("#skip_video").click(function () {
          f_exec();
     });
*/
 
}

function autoClick(){
    var A = document.getElementById("skip_video");
    A.onclick = function () {
          f_exec();
     }
     A.onclick();
}

var interval=setInterval(autoClick,10000);

function f_exec() {
    var video = document.querySelector('video'); //如果没有获取到video，则提示
    if (video == null) {
        alert("未能成功获取到video，请等待视频开始播放后修改");
    } //成功获取video，开始工作
    else {
        var obj = video;
        var href = window.location.href;
        var index = href.indexOf("chapterId=");
        var index2 = href.indexOf('&', index);
        var arg1 = href.substring(index + 10, index2 > 0 ? index2 : href.length);
        var arg2 = href.substring(href.indexOf("class/") + 6, href.indexOf("/unit"));
        var time = new Date().getTime();
        var duration = parseInt(obj.duration); //
        var infoUrl = "https://u.class.gaoxiaobang.com/class/" + arg2 + "/chapter/" + arg1 + "/api?" + time;
        $.post(infoUrl, function (result) {
            var maxViewTime = result.userRecord.maxViewTime;
            if (!maxViewTime) {
                maxViewTime = 0;
            }
            var url = "https://u.class.gaoxiaobang.com/log/video/" + arg1 + "/" + arg2 + "/api?" + time;
            var data = '[{"state":"listening","level":2,"ch":' + duration + ',"mh":' + maxViewTime + ',"ct":' + time + '}]';
            $.post(url, {
                rl: href,
                data: data
            }, function (result) {
                //alert("恭喜，修改成功!");
                $('.gxb-next-blue').click();
                document.getElementsByClassName("gxb-next-blue").click();
            });
        });
    }
}