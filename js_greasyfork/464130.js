// ==UserScript==
// @name         湖南开放大学事业单位工作人员培训网
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  湖南开放大学事业单位工作人员培训网刷课脚本
// @author       soledad
// @match        https://www.hnsydwpx.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464130/%E6%B9%96%E5%8D%97%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E4%BA%8B%E4%B8%9A%E5%8D%95%E4%BD%8D%E5%B7%A5%E4%BD%9C%E4%BA%BA%E5%91%98%E5%9F%B9%E8%AE%AD%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/464130/%E6%B9%96%E5%8D%97%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E4%BA%8B%E4%B8%9A%E5%8D%95%E4%BD%8D%E5%B7%A5%E4%BD%9C%E4%BA%BA%E5%91%98%E5%9F%B9%E8%AE%AD%E7%BD%91.meta.js
// ==/UserScript==

(function() {
    jQuery === $
    let hre = location.href;
    if (hre.includes("https://www.hnsydwpx.cn/getcourseDetails.html")){
        setInterval(checkComplete,6000);
    }
    //章节列表页
    if(hre.includes("https://www.hnsydwpx.cn/center.html")){
        console.log('课程列表');
        setTimeout(()=>{
            console.log($("[data-text='我的课程']")[0]);
            $("[data-text='我的课程']")[0].click();
            $("#iframe2").load(function(){
                setTimeout(()=>{
                    var obj=$("#iframe2").contents().children().find("div[class='layui-tab-item layui-show']");
                    obj=obj.find("button")[1];
                    console.log(obj);
                    $(obj).trigger("click");
                    },3000);
            });
        },3000);
    }

    if(hre.includes("https://www.hnsydwpx.cn/play.html")){
        console.log('课程目录');
        setTimeout(()=>{
            var obj=$("#courseCatalogue").find("a")[0].outerHTML;
            obj=obj.substring(obj.indexOf("'")+1,obj.lastIndexOf("'"));
            console.log(obj);
            console.log("开始学习");
            goPlay(obj);
        },3000);
    }
    //小结列表页
    function checkComplete(){
        setTimeout(()=>{
            if($('.item-list-progress:not(:contains("100%"))').length == 0){
                console.log('已学完');
                $('button:contains("我的课程")').trigger("click");
            }else{
                console.log('未学完，检测中!');
            }
        },3000);
    }

})();



