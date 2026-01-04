// ==UserScript==
// @name         LTDX_网上学院学习助手2.0
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  点击某一专栏开始执行，完成后自动学习专栏下一个未学习视频。
// @author       xixi
// @include      *://*.campus.chinaunicom.cn*
// @require      http://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/445868/LTDX_%E7%BD%91%E4%B8%8A%E5%AD%A6%E9%99%A2%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B20.user.js
// @updateURL https://update.greasyfork.org/scripts/445868/LTDX_%E7%BD%91%E4%B8%8A%E5%AD%A6%E9%99%A2%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B20.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let url1 ='web/ind_ThemeCourses?id'
    let url2='web/course_courseDetails/'
    let schedule =GM_setValue('schedule',0);
    console.log('flag='+GM_getValue('schedule'));
    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
    function flag () {
        let flag=GM_getValue('schedule');
        if ( flag==1) {location.reload();}
    }

    if (document.URL.indexOf(url1)!==-1) {
        console.log("dir-begin");
        sleep(5000).then(() => { dirMain();})
        setInterval(flag,10000);

    }else if(document.URL.indexOf(url2)!==-1){
        $(document).ready(function(){
        console.log("study-begin")
        sleep(5000).then(() => { studyMain();})
        })
    }else{
        console.log("非相关页面")
    }

    function dirMain() {
        let classify = document.getElementsByClassName("item-cont")[0];
        let items=document.getElementsByClassName("classification-item")[1];
        console.log(items)
        //如需单独刷专栏下的某一模块，请将0改为对应模块的序号，“全部”对应数字0，向右递增。
        let part=items.getElementsByTagName("li")[0];
        console.log(part)
        if (typeof(part) != "undefined"){
            part.click();
        }
        sleep(3000).then(() => {
            let div = document.getElementsByClassName("coursesState")[0];
            //将2改为6可刷未完成课程
            let unlearned = div.getElementsByTagName("span")[2].getElementsByTagName("span")[0];
            unlearned.click();
            sleep(2000).then(() => {
            let firstcour = document.getElementsByClassName("item-title")[0];
            if (typeof(firstcour) == "undefined")
            {
                console.log("未学习列表已无课程");
            }
            else
            {
                firstcour.click();
                            }
        })
       })

    }

    function studyMain(){
        // 每隔一段检查一次进度
        setInterval(refresh,10000 + Math.floor(Math.random()*1000));
    }

    function refresh(){
        let start = document.getElementsByTagName('video')[0];
        // 视频静音
        start.muted=true
        start.play();
        let tag=$("div[class='planList plan-list learn-sec']:last")

        let timebtn = tag[0].getElementsByTagName('div')[3];
        let time=timebtn.innerText;
        if (time !== "100%")
            {
                console.log("进度已到:"+time);
                time=timebtn.innerText;
            }
            else
            {
                let schedule =GM_setValue('schedule',1);
                window.close();
            }
    }

})();
