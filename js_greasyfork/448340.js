// ==UserScript==
// @name         学习公社小助手
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  顺序播放未完成列表，自动点击弹出按钮
// @author       SeanWong
// @match        *study.enaea.edu.cn/*
// @grant GM_setValue
// @grant GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448340/%E5%AD%A6%E4%B9%A0%E5%85%AC%E7%A4%BE%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/448340/%E5%AD%A6%E4%B9%A0%E5%85%AC%E7%A4%BE%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    let nIntervId;
    var href = location.href;
    GM_setValue("complete",0);

    function checkComplete(){
      if(GM_getValue("complete")){
          location.reload();
      }
    }

    //课程列表页
    if (href.includes("https://study.enaea.edu.cn/circleIndexRedirect.do?action=toNewMyClass&type=course&circleId")) {
        window.onload = function(){
            document.getElementsByClassName("customcur-tab")[1].click();
            setTimeout(function(){
                var list= document.getElementsByClassName('progressvalue');
                if (list.length){
                    for (var i=0;i<list.length;i++){
                        if(list[i].innerText!=='100%'){
                            GM_setValue("complete",0);
                            list[i].parentElement.parentElement.nextElementSibling.children[0].click();
                            break;
                        }
                        else if (i==list.length-1){
                            window.close()
                        }
                    };
                }
                nIntervId = setInterval(checkComplete, 30000);
            },1000);
        }
    }
    //课程视频页
    if (href.includes("https://study.enaea.edu.cn/viewerforccvideo.do?courseId")) {
        window.onload = function(){
            setTimeout(function(){
                document.getElementsByClassName('xgplayer-start')[0].click();
            },5000);
            setTimeout(function(){
                document.getElementsByClassName('xgplayer-icon-muted')[0].click();
            },1000);
            setInterval(function(){
                var studyProgress = document.getElementsByClassName('cvtb-MCK-CsCt-studyProgress');
                for(var i=0; i<studyProgress.length;i++){
                    if(studyProgress[i].innerText !== '100%'){
                        break;
                    }
                    else if (i== studyProgress.length-1){
                        GM_setValue("complete",1);
                        window.close();
                    }
                }
                if(document.querySelector("#rest_tip button")) {
                    document.querySelector("#rest_tip button").click();
                }
            },10000);
        }
    }
  })();