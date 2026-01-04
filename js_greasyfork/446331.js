// ==UserScript==
// @name         WHU教务成绩刮刮乐
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  隐藏教务系统成绩，改为紧张刺激的刮刮乐
// @author       lyzlyslyc
// @match        http*://jwgl.whu.edu.cn/xtgl/index_initMenu.html*
// @match        http*://jwgl.whu.edu.cn/cjcx/cjcx_cxDgXscj.html*
// @icon         https://www.whu.edu.cn/favicon.ico
// @resource     switchcss https://cdn.bootcdn.net/ajax/libs/bootstrap-switch/3.3.4/css/bootstrap2/bootstrap-switch.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446331/WHU%E6%95%99%E5%8A%A1%E6%88%90%E7%BB%A9%E5%88%AE%E5%88%AE%E4%B9%90.user.js
// @updateURL https://update.greasyfork.org/scripts/446331/WHU%E6%95%99%E5%8A%A1%E6%88%90%E7%BB%A9%E5%88%AE%E5%88%AE%E4%B9%90.meta.js
// ==/UserScript==
var mouseDown = false;
var observer;
(function() {
    'use strict';

    //====引入bootstrap-switch=====
    //脚本
    let script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.src = "https://cdn.bootcdn.net/ajax/libs/bootstrap-switch/3.3.4/js/bootstrap-switch.min.js";
    document.documentElement.appendChild(script);
    //css
    let switchcss = GM_getResourceText('switchcss');
    GM_addStyle(switchcss);
    GM_addStyle(".bootstrap-switch-wrapper{float:right;margin-right:5px;}");

    //隐藏总GPA
    if(location.href.search("cjcx_cxDgXscj.html")!=-1)hideTotalGpaNode();

    //====初始化====
    window.addEventListener("load",()=>{
        //====主页初始化====
        if(location.href.search("index_initMenu.html")!=-1){
            let div_score = document.querySelector("#area_four");
            if(div_score!=null)$("#area_four").bind("DOMNodeInserted",function(e){
                e.target.querySelectorAll(".fraction.float_r").forEach((item)=>{
                    item.style.background="#555";
                    item.innerText="隐藏";
                });
            });
        }
        //====查询页初始化====
        else if(location.href.search("cjcx_cxDgXscj.html")!=-1){
            // 创建观察者对象，检测成绩列表变化
            observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    //新增列表隐藏信息，修改为刮刮乐
                    mutation.addedNodes.forEach(hideInfo);
                });
            });
            observer.observe(document.querySelector("#tabGrid > tbody"),{childList:true});
            //创建刮刮乐对话框
            createScoreDialog();
        }
        //====添加切换按钮====
        let toggle = document.createElement("input");
        toggle.id = "hide_switch";
        toggle.type = "checkbox";
        toggle.style = "float: right;";
        document.querySelector("#searchForm > div").append(toggle);
        $("#hide_switch").bootstrapSwitch({
            onText:"开刮",
            offText:"不刮",
            state:"true",
            onColor:"success",
            offColor:"default",
            onSwitchChange:(event,state)=>{
                if(state==true){
                    //开始观察
                    try{
                        document.querySelector("#tabGrid > tbody").childNodes.forEach(hideInfo);
                        observer.observe(document.querySelector("#tabGrid > tbody"),{childList:true});
                        document.querySelector("#div-data > div.col-md-2.col-sm-2 > span").hide();
                    }
                    catch(e){
                        console.log(e);
                    }
                }
                else{
                    try{
                        //暂停观察
                        observer.disconnect();
                        document.querySelector("#tabGrid > tbody").childNodes.forEach(showInfo);
                        document.querySelector("#div-data > div.col-md-2.col-sm-2 > span").show();
                    }
                    catch(e){
                        console.log(e);
                    }
                }
            }
        });
    });
})();

/************************函数部分***********************/

//创建刮刮乐模态框
function createScoreDialog(){
    let div = document.createElement("div");
    div.className = "bootbox modal sl_mod my-modal";
    div.tabindex="-1";
    div.role="dialog";
    div.setAttribute("aria-labelledby","myModalLabel");
    div.setAttribute("aria-hidden","true");
    div.name = "scoreViewModal";
    div.id="scoreViewModal";
    div.style="display: hidden;";
    div.innerHTML=`
    <div class="modal-dialog modal-dialog-reset" style="width: 500px; left:30%; top:30%;">
        <div class="modal-content">
            <div class="modal-header ui-draggable-handle" style="cursor: move;">
                <input type="hidden" name="focusInput">
                <button type="button" class="bootbox-close-button btn-sm close bootbox-close" data-dismiss="modal">
                <span aria-hidden="true">×</span>
                <span class="sr-only">Close</span>
                </button>
                <h4 class="modal-title">查看成绩详情</h4>
            </div>
            <div class="modal-body" style="overflow-y: inherit;">
                <div class="bootbox-body" style="height:30px;">
                    <div class="col-md-12 col-sm-12">
				        <h5 class="dark">
					        <i class="glyphicon glyphicon-hand-right"></i>
					        <span class="bigger-120" role="button">课程名称<!-- 课程名称 -->：</span>
					        <span class="red2" role="button" id="score_class_name"></span>
				        </h5>
			        </div>
               </div>
               <div style="position: relative;height: 300px; width: 400px; margin: auto;">
                   <canvas width="400" height="300" style="z-index: 0;position: absolute;left: 0px;" id="scoreLayer"></canvas>
                   <canvas width="400" height="300" style="z-index: 1;position: absolute;left: 0px;" id="maskLayer"></canvas>
               </div>
            </div>
            <div class="modal-footer ui-draggable-handle" style="cursor: move;">
                <button id="scoreDlg_btn_cancel" data-bb-handler="cancel" data-loading-text="关 闭" type="button" class="btn btn-sm btn-default" data-dismiss="modal">关 闭</button>
            </div>
        </div>
    </div>`;


    document.querySelector("body").appendChild(div);

    let cMask = document.getElementById("maskLayer");
    let ctxMask = cMask.getContext("2d");

    //刮刮乐事件
    function eventDown(e) {
        e.preventDefault();
        mouseDown = true;
    }

    function eventUp(e) {
        e.preventDefault();
        mouseDown = false;
    }

    function eventMove(e) {
        e.preventDefault();
        if (mouseDown) {
            // changedTouches 最近一次触发该事件的手指信息
            if (e.changedTouches) {
                e = e.changedTouches[e.changedTouches.length - 1];
            }
            var x = e.offsetX;
            var y = e.offsetY;
            ctxMask.beginPath();
            ctxMask.globalCompositeOperation = "destination-out";
            ctxMask.arc(x, y, 10, 0, Math.PI * 3);
            ctxMask.fill();
        }
    }
    cMask.addEventListener('touchstart', eventDown);
    cMask.addEventListener('touchend', eventUp);
    cMask.addEventListener('touchmove', eventMove);
    cMask.addEventListener('mousedown', eventDown);
    cMask.addEventListener('mouseup', eventUp);
    cMask.addEventListener('mousemove', eventMove);
}

//显示分数对话框
function showScore(courseName,score){
    document.getElementById("score_class_name").innerText=courseName;
    $("#scoreViewModal .modal-dialog").draggable({cancel:"canvas"});

    let cScore = document.getElementById("scoreLayer");
    let cMask = document.getElementById("maskLayer");
    let ctxScore = cScore.getContext("2d");
    let ctxMask = cMask.getContext("2d");

    ctxScore.font = '200px "Segoe UI"';
    ctxScore.textAlign="center";
    ctxScore.textBaseline = "middle";
    ctxScore.clearRect(0,0,ctxScore.canvas.width,ctxScore.canvas.height);
    ctxScore.fillText(score,ctxScore.canvas.width/2,ctxScore.canvas.height/2);

    ctxMask.fillStyle="lightgray";
    ctxMask.globalCompositeOperation = "source-over";
    ctxMask.clearRect(0,0,ctxMask.canvas.width,ctxMask.canvas.height);
    ctxMask.fillRect(0,0,ctxMask.canvas.width,ctxMask.canvas.height);
    $("#scoreViewModal").modal('show');
}

//隐藏总GPA节点
function hideTotalGpaNode(){
    let totalGpaNode = document.querySelector("#div-data > div.col-md-2.col-sm-2 > span");
    if(totalGpaNode==null){
        setTimeout(hideTotalGpaNode,50);
        return;
    }
    if(totalGpaNode.querySelector("a")!=null)return;
    let gpa = totalGpaNode.innerText.match(/(\d*\.)?\d+/);
    if(gpa!=null){
        totalGpaNode.gpa = gpa[0];
    }
    totalGpaNode.hide = hideTotalGpa;
    totalGpaNode.show = showTotalGpa;
    totalGpaNode.hide();
}

//隐藏总GPA
function hideTotalGpa(){
    let a = document.createElement("a");
    a.className="clj ggl";
    a.href="#";
    a.innerText="显示";
    a.addEventListener("click",()=>{
        a.remove();
        this.innerText+=this.gpa;
    })
    this.innerText = this.innerText.replace(this.gpa,"");
    this.appendChild(a);
}

//显示总GPA
function showTotalGpa(){
    let a = this.querySelector("a");
    if(a!=null){
        a.remove();
        this.innerText+=this.gpa;
    }
}

//隐藏列表项信息
function hideInfo(node){
    if(!node.classList.contains("jqgrow"))return;

    let scoreNode = node.querySelector("[aria-describedby=tabGrid_cj]");
    if(!scoreNode.score)scoreNode.score = scoreNode.title;
    scoreNode.title="开奖";
    scoreNode.course = node.querySelector("[aria-describedby=tabGrid_kcmc]").title;
    scoreNode.hide = hideGrade;
    scoreNode.show = showGrade;
    scoreNode.hide();

    let gpaNode = node.querySelector("[aria-describedby=tabGrid_jd]");
    gpaNode.hide = hideNode;
    gpaNode.show = showNode;
    gpaNode.hide();

    let creditNode = node.querySelector("[aria-describedby=tabGrid_xfjd]");
    creditNode.hide = hideNode;
    creditNode.show = showNode;
    creditNode.hide();
}

//显示列表项信息
function showInfo(node){
    if(!node.classList.contains("jqgrow"))return;
    let scoreNode = node.querySelector("[aria-describedby=tabGrid_cj]");
    let gpaNode = node.querySelector("[aria-describedby=tabGrid_jd]");
    let creditNode = node.querySelector("[aria-describedby=tabGrid_xfjd]");
    scoreNode.show();
    gpaNode.show();
    creditNode.show();
}

//隐藏成绩
function hideGrade(){
    let a = document.createElement("a");
    a.className="clj ggl";
    a.href="#";
    a.innerText="开奖";
    a.addEventListener("click",()=>{
        showScore(this.course,this.score);
    })
    this.innerHTML="";
    this.appendChild(a);
}

//显示成绩
function showGrade(){
    this.innerHTML=this.score;
}

//隐藏节点
function hideNode(){
    let title = this.title;
    let a = document.createElement("a");
    a.className="clj ggl";
    a.href="#";
    a.innerText="显示";
    a.addEventListener("click",()=>{
        this.innerHTML=title;
    })
    this.innerHTML="";
    this.appendChild(a);
}

//显示节点
function showNode(){
    this.innerHTML = this.title;
}