// ==UserScript==
// @name         OneStepSCUPJ
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  一键评教
// @author       Justin Song
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @match        http://zhjw.scu.edu.cn/student/teachingEvaluation/*
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/403785/OneStepSCUPJ.user.js
// @updateURL https://update.greasyfork.org/scripts/403785/OneStepSCUPJ.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var pjtextList = [
        "老师讲课重点突出，授课条理清晰，认真负责，严谨，耐心，内容丰富，涉及内容十分广泛。课堂气氛很好，总是能够把授课内容和社会实际结合起来，授课内容通俗易懂。对于同学提出的建议能够认真的采纳。",
        "老师讲课十分投入，内容纲举目分，条理性很强，而且特别善于举例，让同学们理论联系实际，学习起来十分轻松，而且印象深刻，收到良好的效果。老师为人和蔼，课堂能与同学们互动，营造温馨的课堂气氛。",
        "老师上课时备课充分，语言流畅，思路清晰，课堂上有许多生动的案例分析，课堂互动时间也很多。",
        "对学生辅导十分耐心，真正做到传道授业解惑",
        "老师在课堂上不但讲课本上的知识，还给我们补充了许多课外知识，包括物理学发展过程中一些新奇的想法和前沿的科技技术，使枯燥的物理学力学变得很生动有趣，课堂气氛很是活跃。老师对他所讲的每一个知识点都十分谨慎，使每一个细节都不出差错。对作业的批改也十分认真.",
        "上课很负责，思路清晰，并且关心我们的学习和心理.",
        "教学生动有趣,治学严谨,有学者风范.",
        "举例生动,上课风趣有不失严谨,常能启发学生."
    ]
    var pendingList = [];

    function mainPJ(){
        var info = document.createElement('div');
        var text = document.createElement('p')
        text.textContent = "等待10s后开始评教"
        info.appendChild(text);
        info.className = "pjtips";
        info.style.cssText = "position: fixed;top: 20px;right: 30px;height: 50px;width: 200px;text-align: center;z-index: 10000;background-color: white;border-radius: 10px;display: flex;justify-content: center;align-items: center;box-shadow: 0px 0px 12px 2px rgba(0,0,0,.1);transition:opacity 0.3s ease;opacity:0;"
        document.body.appendChild(info);
        setTimeout(()=>{
            $(info).css('opacity',1);
        },0)
        setTimeout(()=>{
            $(info).fadeOut(function(){
                document.body.removeChild(info);
                const nodeList = document.querySelectorAll("input.ace")
                nodeList.forEach((el,idx)=>{
                    if(idx%5===0){
                        el.click();
                    }
                })
                const textArea = document.querySelector('.form-control')
                textArea.value = pjtextList[Math.floor(Math.random()*pjtextList.length)];
                document.querySelector('#buttonSubmit').click();
            });
        },10000)
    }

    function initInIndex(){
        pendingList = [...document.querySelectorAll('#jxpgtbody button')].filter((el)=>el.innerText!=="查看");
        if(pendingList.length===0){
            return;
        }
        localStorage.setItem('pendingList',JSON.stringify(pendingList));
        if(pendingList.length>0){
            const curProc = pendingList.shift();
            curProc.click();
        }else {
            delete localStorage.pendingList;
            alert("Done");
            return;
        }
    }

    window.onload = function(){
        if(location.href==="http://zhjw.scu.edu.cn/student/teachingEvaluation/evaluation/index"){
            //index页
            this.console.log('回到首页');
            initInIndex();
        }else if(location.href==="http://zhjw.scu.edu.cn/student/teachingEvaluation/teachingEvaluation/evaluationPage"){
            let plist = localStorage.getItem('pendingList');
            if(plist){
                mainPJ();
            }else {
                alert("需要先回到首页进行初始化")
                location.href = "http://zhjw.scu.edu.cn/student/teachingEvaluation/evaluation/index";
            }
        }
    }
})();