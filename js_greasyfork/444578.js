// ==UserScript==
// @license      MIT
// @name         SCBOY养乌龟插件
// @namespace    http://tampermonkey.net/
// @version      1.3
// @icon         https://www.scboy.cc/view/img/logo.png
// @description  在论坛分区页右侧添加养乌龟区域，可交互调戏乌龟，点击乌龟周围可投食
// @author       Xyfan
// @match        *://www.scboy.cc/?forum-2.*
// @match        *://www.scboy.cc/?forum-1.*
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444578/SCBOY%E5%85%BB%E4%B9%8C%E9%BE%9F%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/444578/SCBOY%E5%85%BB%E4%B9%8C%E9%BE%9F%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('body').append(`
    <iframe scrolling="no" frameborder="0" src="https://cdn.abowman.com/widgets/turtles/?up_waterColor=44aaf8&up_percentWater=0&up_groundColor=99a6bf&up_numTurtles=2&up_turtle1LegColor=839915&up_turtle1HeadColor=828250&up_turtle1ShellColor=fffb00&up_turtle2LegColor=828250&up_turtle2HeadColor=828250&up_turtle2ShellColor=ffdc00&up_turtle3LegColor=828250&up_turtle3HeadColor=828250&up_turtle3ShellColor=ffe229&up_turtle4LegColor=828250&up_turtle4HeadColor=828250&up_turtle4ShellColor=66663f&up_turtle5LegColor=828250&up_turtle5HeadColor=828250&up_turtle5ShellColor=66663f&up_turtle6LegColor=828250&up_turtle6HeadColor=828250&up_turtle6ShellColor=66663f&up_turtle7LegColor=828250&up_turtle7HeadColor=828250&up_turtle7ShellColor=66663f&up_turtle8LegColor=828250&up_turtle8HeadColor=828250&up_turtle8ShellColor=66663f&up_turtle9LegColor=828250&up_turtle9HeadColor=828250&up_turtle9ShellColor=66663f&up_turtle10LegColor=828250&up_turtle10HeadColor=828250&up_turtle10ShellColor=66663f" style="width:330px;height:350px;position:relative;left:1125px;bottom:2300px;"></iframe>
`)
})();