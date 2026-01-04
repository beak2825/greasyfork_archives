// ==UserScript==
// @name         一窗通监控
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  状态监控!
// @author       You
// @match        http://218.57.139.23:10010/psout/jsp/gcloud/iaicweb/homepage/apply_manage.jsp

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469830/%E4%B8%80%E7%AA%97%E9%80%9A%E7%9B%91%E6%8E%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/469830/%E4%B8%80%E7%AA%97%E9%80%9A%E7%9B%91%E6%8E%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function(){
        //mainContent   height  window.frames['mainContent'].document.getElementById('height')
        ImportCss();
        ImportYctDiv();

        var zdNum;
        var setTimeoutId;
        var workNum;
        var isSuccess = false;
        // var setTime = "60000";
        var setTime = "5000";
        var zd_button = window.frames["mainContent"].document.getElementsByClassName("sxxx color2")[0];

        function ImportCss(){
            var myCss = document.createElement("style");
            myCss.type = "text/css";
            myCss.innerHTML = ".myDiv1{opacity:0.9 ;display: none;position: fixed;right: 5px;bottom: 50px;z-index: 2247483648;padding: 23px 5px;width: 50px;height: 20px;line-height: 20px;text-align: center;border: 1px solid;border-color: #888;border-radius: 50%;background: #efefef;cursor: pointer;font: 12px/1.5}";
            $("head")[0].appendChild(myCss);
            console.log("插入css");
        }

        function ImportYctDiv(){


            var startYctDiv = document.createElement("div");
            startYctDiv.id = "startYctDiv";
            startYctDiv.className = "myDiv1";
            startYctDiv.style.display = "block";
            //             startYctDiv.textContent = "▶";
            startYctDiv.textContent = "开始监控";

            //             startYctDiv.style.display = "block";
            var stopYctDiv = document.createElement("div");
            stopYctDiv.id = "stopYctDiv";
            stopYctDiv.className = "myDiv1";
            //             stopYctDiv.textContent = "■";
            stopYctDiv.textContent = "停止监控";

            $("body")[0].appendChild(startYctDiv);
            $("body")[0].appendChild(stopYctDiv);

            // ChangeTransparency("startYctDiv");
            // ChangeTransparency("stopYctDiv");

            //绑定点击事件

            startYctDiv.onclick = function(){

                workNum = window.frames["mainContent"].document.getElementById("workNum").textContent;//材料指导数量
                if(zdNum==undefined||zdNum==null){

                    zdNum = workNum;//初始化
                    console.log("zdNum:",zdNum);
                }
                zd_button.click();
                workNum = window.frames["mainContent"].document.getElementById("workNum").textContent;//材料指导数量
                if(zdNum!=workNum){//数量变化，即审核完成，更新zdNum,弹窗提示，刷新网页，结束脚本
                    zdNum = workNum;
                    showMsg();
                    isSuccess = true;
                    alert("审核结束，请查看审核结果");
                    //stopMsg();
                    //location.reload();
                    // return;
                }else{
                    isZdChange();
                    document.getElementById("startYctDiv").style.display = "none";
                    document.getElementById("stopYctDiv").style.display = "block";
                }

            }

            stopYctDiv.onclick = function(){

                clearTimeout(setTimeoutId);
                document.getElementById("startYctDiv").style.display = "block";
                document.getElementById("stopYctDiv").style.display = "none";

            }
            var i = 0;
            function isZdChange(){//材料指导是否变化
                //点击刷新后，判断数量是否变化

                zd_button.click();
                setTimeoutId = setTimeout(function(){
                    workNum = window.frames["mainContent"].document.getElementById("workNum").textContent;
                    console.log("workNum:",workNum,"zdnum:",zdNum,"运行次数：",i);
                    i++;
                    if(zdNum!=workNum){//数量变化，即审核完成，更新zdNum,弹窗提示，刷新网页，结束脚本
                        zdNum = workNum;
                        clearTimeout(setTimeoutId);
                        document.getElementById("startYctDiv").style.display = "block";
                        document.getElementById("stopYctDiv").style.display = "none";
                        showMsg();
                        isSuccess = true;
                        alert("审核结束，请查看审核结果");
                        //stopMsg();
                        // location.reload();
                        // return;

                    }else{
                        isZdChange();
                    }

                },setTime);
            }


        }



    //******************闪烁标题*************************************
    window.onfocus = function(){//当页面获得焦点
        if(isSuccess==true){
            // alert("审核结束，请查看审核结果");
            stopMsg();
            location.reload();
            isSuccess = false;
        }
    }
    let message = {
        timeout: null,
        oldTitle: document.title,
        time: 0,
        showMessage(msg){
            message.timeout = setInterval(function(){
                message.time ++;
                let title = '';
                if(message.time % 2 === 0){
                    title = '【新消息】';
                }else{
                    title = '【 ' + msg + ' 】';
                }
                document.title = title;
            },600);

        },
        stopMessage(){
            document.title = message.oldTitle;
            clearTimeout(message.timeout);
        }
    };

    function showMsg(){
        message.showMessage('审核结束，请查看审核结果');
    }

    function stopMsg(){
        message.stopMessage('审核结束，请查看审核结果');
    }



 }



    //*****************************************************

    /*         var num;
        var region = "371300";
        var applyUserId = "17853461263";
        function loadYbjCount(){
            //查询不同业务状态的数据数量  提交申请
            var cmd = new G3.Command("com.inspur.gcloud.iaicweb.remain.cmd.QydjApplyStatusQueryCommand");
            cmd.setParameter("bizState","30");
            cmd.setParameter("applyUserId",applyUserId);
            cmd.setParameter("region",region);
            cmd.execute("queryCountByblzState",false);
            cmd.afterExecute = function(){
                var counts = cmd.getData();
                var endNum = counts[0].C;
                $("#endNum").html(endNum);
                num = endNum;
                console.log("endNum:",endNum);
            }
        }

        //loadYtjCount();
        loadYbjCount(); */


    // Your code here...
})();