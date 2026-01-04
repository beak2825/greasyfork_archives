// ==UserScript==
// @name         自动保存翻译记录
// @namespace    ccjr
// @version      0.1
// @description  我在尝试观看纯英字幕来提高我的英文，步骤是:单词->翻译->逐条记入笔记。那我为什么不让我的观赏体验再优化一下呢?现在的步骤:单词->翻译->在结束时一次全部记入笔记
// @author       ccjr
// @match        https://fanyi.baidu.com/
// @grant        GM_addStyle
// @require      https://cdn.staticfile.org/jquery/2.0.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/401780/%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98%E7%BF%BB%E8%AF%91%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/401780/%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98%E7%BF%BB%E8%AF%91%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle('.record-box {background: #409EFF;color: #FFFFFF; z-index: 100; display: inline-block; line-height:36px!important; width:200px!important; height:100%!important ; position: fixed; top:0px!important; overflow-y: auto; right: 0}.s-item-list {font-size: 18px; cursor: text;}.s-item {padding: 0px 10px 0px 20px; overflow-x: auto; white-space: nowrap}');
    //翻译记录
    var translateRecord = [];
    //计时器
    var clock;
    //统计计时器生效的次数
    var times;
    const data = {
        //计时器时间(毫秒级)
        intervalTime: 1000,
        //计时器最大生效次数
        maxTimes: 5,
        //翻译输入框元素id
        baiduSrcId: '#baidu_translate_input',
        //翻译结果框元素类名
        baiduDstClass: '.target-output',
    }
    $(document).ready(function() {
        var recordBox = "<div class='record-box'><div></div><hr><div id='record-list' class='s-item-list'></div></div>"
        $("body").append(recordBox);
        var srcElement = $(data.baiduSrcId)
        //监听输入框的值改变
        srcElement.bind('input propertychange', () => {
            //每次改变清除上次改变的计时器
            clearInterval(clock);
            //每次输入框的改变都重置次数
            times = 0;
            //开启计时器
            clock = setInterval(() => {
                times++
                if (times >= data.maxTimes) {
                    clearInterval(clock);
                    //输入框内容以及翻译结果
                    var recordWord = srcElement.val() + ":" + $(data.baiduDstClass).text();
                    console.log(recordWord)
                    translateRecord.push(recordWord)
                    $('#record-list').html($('#record-list').html() + "<div class='s-item'>" + recordWord + "</div><hr style='margin-top: 0px;height:1px'>")
                }
            }, data.intervalTime)
        })
    })
})();