// ==UserScript== 
// @name            添加按钮
// @namespace       http://tampermonkey.net/
// @author          icewen
// @description     添加指定按钮
// @match           *://baidu.com/*
// @include         https://www.baidu.com/*
// @require         http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @version         0.0.3
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/431224/%E6%B7%BB%E5%8A%A0%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/431224/%E6%B7%BB%E5%8A%A0%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==
( function () {
    'use strict' ;
    console.log('脚本运行~')

    //与元数据块中的@grant值相对应，功能是生成一个style样式
    // GM_addStyle( '#down_video_btn{color:#fa7d3c;}' );

    //视频下载按钮的html代码
    var btn_html = '<button id="test" style="{ marginLeft: 10px;color: blue; }">测试</button>';

    //将以上拼接的html代码插入到网页里的ul标签中
    var parent = $('#s-top-left');
    if (parent) {
        parent.append(btn_html);
    }

    var someTool = {
        
    };

    $( function () {
        console.log('运行结束？')
        //执行下载按钮的单击事件并调用下载函数
        $( "#test" ).click( function () {
            alert('插入成功')
        });
    });

})();