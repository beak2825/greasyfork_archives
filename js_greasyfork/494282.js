// ==UserScript==
// @name         2024年保密培训学习&考试(baomi.org.cn)
// @namespace    保密教育线上培训学分速刷与考试自动答题
// @version      0.5
// @description  保密教育线上培训学分速刷与考试自动答题
// @author       爱吃羊肉串
// @match        *://www.baomi.org.cn/bmExam*
// @match        *://www.baomi.org.cn/bmVideo*
// @match        *://www.baomi.org.cn/bmImage*
// @match        *://www.baomi.org.cn/bmCourseDetail/course*
// @icon         https://file.baomi.org.cn/spc/upload/pagemanagement/2021-10-29/106KXG4GFKMA83255419.png
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/494282/2024%E5%B9%B4%E4%BF%9D%E5%AF%86%E5%9F%B9%E8%AE%AD%E5%AD%A6%E4%B9%A0%E8%80%83%E8%AF%95%28baomiorgcn%29.user.js
// @updateURL https://update.greasyfork.org/scripts/494282/2024%E5%B9%B4%E4%BF%9D%E5%AF%86%E5%9F%B9%E8%AE%AD%E5%AD%A6%E4%B9%A0%E8%80%83%E8%AF%95%28baomiorgcn%29.meta.js
// ==/UserScript==

// 1. 点击进入视频页面请耐心等待，很快会自动跳转到视频结束位置。
// 2. 网站每个小章节都会自动播放下一集，每个小章节结束后访问下个小章节即可。
// 3. 注意是每个小章节，不是每个视频都要重新打开页面。
// 4. 考试页面会弹窗提醒，如果没有发现弹窗，请刷新一下页面。

(function() {

    function handleExamPage() {
        setTimeout(() => {
            let qlist = document.querySelectorAll("#questionListDiv > li > ul > li");
            let alist = document.querySelector("#nav > div > div.pageBox > div.container1_box > div > div").__vue__.$data.examContents;
            let aindex = {"A": 0, "B": 1, "C": 2, "D": 3};

            qlist.forEach((item, i) => {
                let a_index = aindex[alist[i].answer];
                let xlist = item.querySelectorAll("label");
                xlist[a_index].click();
            });
        }, 5000);
    }

    function handleVideoPage() {
        var video = document.getElementsByTagName('video')[0];
        if (video.paused) {
            video.muted = true;
            video.play();
            setTimeout(function() {
                video.currentTime = video.duration;
            }, 2000);
            setTimeout(Openurl,2000);
        }else{
            setTimeout(function() {
                video.currentTime = video.duration;
            }, 2000);
            setTimeout(Openurl,2000);
        }
    }

    function handleImagePage() {
        setTimeout(Openurl, 3000);
    }

    function handleAudioPage() {
       var audio = document.getElementsByTagName('audio')[0];
        audio.currentTime=1500;
    }

    // 判断页面类型并执行相应函数
    function executeBasedOnPageType() {
        switch (true) {
            case document.URL.includes('bmExam') && !document.URL.includes('bmExamResult'):
                if (confirm("是否开启自动答题？")){
                    alert("10秒内自动答题~");
                    handleExamPage();
                } else {
                    alert("保守机密，慎之又慎。加油!");
                }
                break;
            case document.URL.includes('bmVideo'):
                setInterval(handleVideoPage, 5000);
                break;
            case document.URL.includes('bmImage'):
                setInterval(handleImagePage, 3000);
                break;
            case document.URL.includes('course'):
                handleAudioPage();
                setInterval(handleAudioPage, 3000);
                break;
            default:
                break;
        }
    }

    executeBasedOnPageType();
})();