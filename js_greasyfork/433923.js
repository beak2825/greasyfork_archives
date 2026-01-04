// ==UserScript==
// @name         自动做作业
// @namespace    Kason
// @version      1.3
// @description  一切皆有可能!
// @author       Kason
// @include      *://sdjj.ct-edu.com.cn/learning/student/studentIndex.action*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_log
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus
// @downloadURL https://update.greasyfork.org/scripts/433923/%E8%87%AA%E5%8A%A8%E5%81%9A%E4%BD%9C%E4%B8%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/433923/%E8%87%AA%E5%8A%A8%E5%81%9A%E4%BD%9C%E4%B8%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    unsafeWindow.addEventListener('blur', function (event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
    },false);

    setInterval(function() {
        if(window.location.hash.indexOf('homework') > 0)
        {
            var controllerScope = unsafeWindow.$('#page_learn_homework_do').scope();
            console.log(controllerScope?.courseLearnHomeworkDoConfig?.homeworkObj?.title);
            var danxuanList=controllerScope?.courseLearnHomeworkDoConfig?.questionObj?.danxuanList;

            if(danxuanList){
                danxuanList.forEach((item, index)=>{
                    $(".question-area:eq(0)").find(".topic-area").eq(index).find("input").each((index1, item1)=>{
                        var value1=$(item1).attr("value");
                        if(value1==item.sanswer&&!$(item1).is(':checked')) $(item1)[0].click();

                    });
                });
            }

            var duoxuanList=controllerScope?.courseLearnHomeworkDoConfig?.questionObj?.duoxuanList;

            if(duoxuanList){
                duoxuanList.forEach((item, index)=>{
                    $(".question-area:eq(1)").find(".topic-area").eq(index).find("input").each((index1, item1)=>{
                        var value1=$(item1).attr("value");
                        var arrsanswer = item.sanswer.split('|');
                        if($.inArray(value1, arrsanswer)>-1&&!$(item1).is(':checked')) $(item1)[0].click();
                    });
                });
            }

            var panduanList=controllerScope?.courseLearnHomeworkDoConfig?.questionObj?.panduanList;

            if(panduanList){
                panduanList.forEach((item, index)=>{
                    $(".question-area").eq($(".question-area").length-1).find(".topic-area").eq(index).find("input").each((index1, item1)=>{
                        var value1=$(item1).attr("value");
                        if(value1==item.sanswer&&!$(item1).is(':checked')) $(item1)[0].click();
                    });
                });
            }
        }
        else if(window.location.hash.indexOf('video') > 0)
        {
            //setInterval(function() {
            //var controllerScope = unsafeWindow.$('#coursewareDetail').scope();
            //console.log(controllerScope);
            //}, 5 * 1000);
        }
    }, 5 * 1000);
})();