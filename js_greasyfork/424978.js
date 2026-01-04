// ==UserScript==
// @name         去你的网课（意思是没有妈）
// @namespace    FuckMyOnlineClass
// @version      0.1
// @description  傻逼网课
// @author       涛之雨
// @match        https://oc.cumtusp.com:9999/index.php/student/video/index.html?*
// @match        https://oc.cumtusp.com:9999/index.php/student/schedule/index.html
// @require      https://greasyfork.org/scripts/407985-ajax-hook/code/Ajax-hook.js?version=832614
// @require      https://cdn.staticfile.org/jquery/3.5.0/jquery.min.js
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/424978/%E5%8E%BB%E4%BD%A0%E7%9A%84%E7%BD%91%E8%AF%BE%EF%BC%88%E6%84%8F%E6%80%9D%E6%98%AF%E6%B2%A1%E6%9C%89%E5%A6%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/424978/%E5%8E%BB%E4%BD%A0%E7%9A%84%E7%BD%91%E8%AF%BE%EF%BC%88%E6%84%8F%E6%80%9D%E6%98%AF%E6%B2%A1%E6%9C%89%E5%A6%88%EF%BC%89.meta.js
// ==/UserScript==
(function() {
    'use strict';
    if(location.href==="https://oc.cumtusp.com:9999/index.php/student/schedule/index.html"){

        let aaa=setInterval(()=>{
            document.querySelectorAll("#app .layui-card").forEach(a=>{
                a.querySelectorAll(".layui-icon.layui-icon-praise").length===2&&(a.style.display="none",clearInterval(aaa))
            })
        },10)
        }else{
            $(document).ready(()=>{
unsafeWindow.alert_=alert;
unsafeWindow.alert=(a)=>{console.log(a)};
                window.isdebugger = false;
                let PalyID = 3,
                    doc = document,
                    runNumber = 0,
                    mainData = {};
                axios.post('schedule/schedule/my_with_study').then((a) => {
                    if (a.data.code === 1) {
                        mainData = a.data.data;
                        startShua();

                    }
                })

                function startShua() {
                    var d = mainData;
                    mainData.forEach((a,b)=>{
                        if(a.schedule_id===Number(location.href.match(/schedule_id=(\d+)/)[1]))PalyID=b
                    })
                    axios.post('subject/subject/videoid', {
                        'video_id': d[PalyID].video_id
                    }).then((a) => {
                        if (a.data.code == 1) {
                            console.log(a.schedule_content);
                            let aaa=setInterval(()=>{if(document.querySelector("video").ended){
                                clearInterval(aaa)
                                location.href=location.href.replace(/schedule_id=\d+/,"schedule_id="+String(Number(location.href.match(/schedule_id=(\d+)/)[1])+1))
                            }},1000);
                            a.data.data.forEach(b => {
                                runNumber++;
                                startDati(b.video_second, Number(b.subject_key))
                            })
                        }
                    })
                        .catch(function(error) {
                        console.log(error);
                    });
                }

                /**
 * time 监视时间
 * i 选项（从1开始）
 */
                function startDati(time, i) {
                    //     if (id !== undefined) {
                    //     	console.log(time, i);
                    //         setTimeout(() => {startDati(time, i)}, 1000)
                    //     } else {
                    let id = setInterval(() => {
                        window.isdebugger && console.log("监视",doc.querySelector("video").currentTime);
                        // doc.querySelector("video").currentTime = time - 14;
                        if (doc.querySelector("video").currentTime > time) {
                            try{
                                // id = undefined;
                                // setTimeout(()=>{
                                doc.querySelector(`#form1>div:nth-child(${i})>div`).click();
                                doc.querySelector("#form1>div:nth-last-child(1)>button").click()
                                doc.querySelector(".layui-layer-btn0").click()
                                if (runNumber === 1) {
                                    // startShua()
                                } else runNumber--;
                                clearInterval(id);
                            }catch(e){
                                window.isdebugger && console.log(e);}
                            // },11000)
                        }
                    }, 1000)
                    // }
                    }})
        }
    // Your code here...
})();