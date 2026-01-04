// ==UserScript==
// @name         选课捡漏脚本
// @namespace    jwgl_whu
// @version      2.0
// @license      AGPL-3.0
// @description  给走投无路无课可上的孩子一个最后的机会
// @author       lyzlyslyc
// @match        https://jwgl.whu.edu.cn/xsxk/zzxkyzb_cxZzxkYzbIndex.html?*
// @match        https://jwgl.whu.edu.cn/xsxk/zzxklbb_cxZzxkLbbIndex.html?*
// @resource     jquicss https://cdn.bootcdn.net/ajax/libs/jqueryui/1.12.0-rc.2/jquery-ui.min.css
// @icon         https://www.google.com/s2/favicons?domain=whu.edu.cn
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/440140/%E9%80%89%E8%AF%BE%E6%8D%A1%E6%BC%8F%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/440140/%E9%80%89%E8%AF%BE%E6%8D%A1%E6%BC%8F%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

//修改下列参数后需要刷新页面才能生效！

//设置查询频率，单位毫秒，如果要长时间开启捡漏，建议将频率调高（例如30000毫秒，即30秒）
var interval = 30000;
//设置选课时间间隔（当同时存在多个课程有空位时，隔一定时间选课），单位毫秒
var choose_interval = 1000;
//设置重试次数，当连续请求失败超过该次数，将停止查询
var err_retry = 4;


var btn;
var thread;
var unavailableTime = [];
var gnmkdm = "";
var su = "";
var observeThread;
var observer;
var DEBUG = false;
var stopped = true;
var courseList;
(function() {
    //获取页面信息
    gnmkdm = location.href.match(/gnmkdm=([A-Za-z0-9]+)/);
    su = location.href.match(/su=(\d+)/);
    if(gnmkdm!=null)gnmkdm=gnmkdm[1];
    if(su!=null)su=su[1];
    loadSetting();

    //css
    let jquicss = GM_getResourceText('jquicss');
    GM_addStyle(jquicss);
    GM_addStyle(`div#courseListDiv span[title] {
                     border: 1px solid #ff8040;
                     padding: 0 18px 0 3px;
                     background: #fff;
                     text-decoration: none;
                     color: #ff8040;
                     word-break: keep-all;
                     word-wrap: break-word;
                     white-space: pre-line;
                     line-height: 19px;
                     height: 19px;
                     display: inline-block;
                     position: relative;
                     margin-left: 2px;
                }
                .modal-minimized{
                     position: fixed;
                     top: 40%;
                     left: 0px;
                     border-bottom-right-radius: 5px;
                     border-top-right-radius: 5px;
                     padding: 10px;
                     background: #2587de;
                     width: 40px;
                     height: fit-content;
                     float: inherit;
                     cursor: pointer;
                     z-index: 999;
                }
                .course-setting-group{
                     width: 65%;
                     left: 20px;
                }
                .course-setting-group .input-group-addon{
                     width: 66px;
                }
                .close-icon {
                     background: #e49203 url(https://jwgl.whu.edu.cn/js/plugins/searchbox/images/close-icons.gif);
                     height: 13px;
                     width: 13px;
                     position: absolute;
                     right: 2px;
                     _right: 2px;
                     cursor: pointer;
                     bottom: 2px;
    }`);

    observer = new MutationObserver((mutations)=>{
        mutations.forEach((mutation)=>{
            if(mutation.type=="childList"){
                mutation.addedNodes.forEach((item)=>{
                    let table = item.querySelector("table");
                    if(table==null)return;
                    let thead = table.querySelector("thead tr");
                    let header = document.createElement("th");
                    header.innerText = "捡漏";
                    thead.appendChild(header);
                    table.querySelectorAll(".body_tr").forEach((row,index)=>{
                        addCheckbox(row,index);
                    })
                })
            }
        })
    });

    //添加准备抢课列表
    let courseListDiv = document.createElement("div");
    courseListDiv.id="courseListDiv";
    courseListDiv.style="padding-top: 5px;";
    courseListDiv.innerHTML="<span>抢课列表：</span>";
    try{
        document.querySelector("#innerContainer > div.col-md-12.col-sm-12.border-b > div").appendChild(courseListDiv);
    }
    catch(e){
        console.log("div not found");
    }

    //添加抢课按钮
    btn = document.createElement("button");
    btn.className = "btn btn-default btn-sm";
    btn.innerHTML="开始抢课";
    btn.status = 0;
    btn.addEventListener("click",btnClick);
    document.querySelector("#searchBox > div > div.row.search-filter > div > div > div > div > span").appendChild(btn);
    getUnavailableTime(true);
    addObservers();
    //创建日志对话框
    createCourseDialog();
})();

function addObservers(){
    let right_div = document.querySelector(".right_div");
    let box = document.querySelector("#displayBox");
    if(!right_div||!box)
    {
        setTimeout(addObservers,1000);
        return;
    }
    // 监视课程重载
    let contentObserver = new MutationObserver((mutations)=>{
        mutations.forEach((mutation)=>{
            if(mutation.addedNodes.length!=0){
                console.log("course list reloaded");
                document.querySelectorAll("#courseListDiv>span[title]").forEach((item)=>{item.remove();});
                observeTable();
            }
        });
    })
    // 监视tab重载
    let displayBoxObserver = new MutationObserver((mutations)=>{
        mutations.forEach((mutation)=>{
            mutation.addedNodes.forEach((n)=>{
                if(n==document.querySelector("#contentBox")){
                    console.log("contentBox reloaded");
                    let contentBox = document.querySelector("#contentBox");
                    contentObserver.observe(contentBox,{"childList":true});
                }
            })
        });
    })

    displayBoxObserver.observe(box,{"childList":true});
    observeTable();

    //当选课发生变化，可用时间需要刷新
    let selectedObserver = new MutationObserver((mutations)=>{
        mutations.forEach((mutation)=>{
            getUnavailableTime(false);
            let courseList = document.querySelectorAll(".body_tr");
            for(let i=0;i<courseList.length;i++){
                let time = courseList[i].querySelector(".sksj");
                if(time){
                    let check = courseList[i].querySelector(".select_course input");
                    if(check){
                        setBtnEnability(check,timeAvailable(time.innerText));
                    }
                }
            }
        });
    })
    selectedObserver.observe(document.querySelector(".right_div"),{"childList":true});
}


//抢课按钮事件
function btnClick(){
    if(btn.status===0){
        //获取选课列表
        courseList = getCheckedCourseList();
        //return;
        if(courseList.length==0){
            alert("未选择课程");
            return;
        }
        btn.innerHTML="停止抢课";
        btn.status=1;
        stopped = false;
        document.querySelector("#modal_minimized h4").innerHTML="选课中";
        document.querySelector("#modal_stop_btn").innerHTML="停 止";
        showDialog(true,true);
        let isListView = true;
        if(isListView){
            //开始查询余量
            print(`开始查询课程余量，频率为${(interval/1000.0).toFixed(2)}秒一次。`)
            if(!stopped){
                //第一次立刻查询
                thread = setTimeout(()=>{
                    queryThread(err_retry);
                },0);
            }
        }
    }
    else{
        stopQuery();
    }
}

//获取课程时间
function getCourseTime(timeStr){
    let timeList = [];
    let times = timeStr.match(/星期.第\d+-\d+节/g);
    if(times==null)return timeList;
    for(let i=0;i<times.length;i++){
        let time = 0;
        switch(times[i].match(/星期./)[0]){
            case "星期一":
                time+=100;
                break;
            case "星期二":
                time+=200;
                break;
            case "星期三":
                time+=300;
                break;
            case "星期四":
                time+=400;
                break;
            case "星期五":
                time+=500;
                break;
            case "星期六":
                time+=600;
                break;
            case "星期日":
                time+=700;
                break;
        }
        let span = times[i].match(/\d+-\d+/)[0].split("-");
        for(let i=parseInt(span[0]);i<=parseInt(span[1]);i++)timeList.push(time+i);
    }
    return timeList;
}

//获取课程冲突时间
function getUnavailableTime(ajax){
    if(ajax){
        $.ajax({
            url:`https://jwgl.whu.edu.cn/xsxk/zzxklbb_cxZzxkLbbChoosedDisplay.html?gnmkdm=${gnmkdm}&su=${su}`,
            type:"POST",
            data:{
                "jg_id":jQuery("#jg_id_1").val(),"zyh_id":jQuery("#zyh_id").val(),"xz":$("#xz").val(),"ccdm":$("#ccdm").val(),
                "njdm_id":jQuery("#njdm_id").val(),"zyfx_id":$("#zyfx_id").val(),"bh_id":$("#bh_id").val(),
                "xkxnm":jQuery("#xkxnm").val(),"xkxqm":jQuery("#xkxqm").val(),"xkly":jQuery("#xkly").val()
            },
            success:(res)=>{
                try{
                    unavailableTime=[];
                    res.forEach((item)=>{
                        addUnavailableTime(item.sksj);
                    })
                }
                catch(e){
                    console.log(e)
                }
            }
        })
    }
    else{
        unavailableTime=[];
        let timeList = document.querySelectorAll(".right_div .time");
        for(let i=0;i<timeList.length;i++)addUnavailableTime(timeList[i].innerText);
        if(DEBUG)console.log(unavailableTime);
    }
}

//添加课程冲突时间
function addUnavailableTime(timeStr){
    let timeList = getCourseTime(timeStr);
    for(let j=0;j<timeList.length;j++){
        if(!unavailableTime.contains(timeList[j]))unavailableTime.push(timeList[j]);
    }
    if(DEBUG)console.log(unavailableTime);
}

//课程是否有时间冲突
function timeAvailable(timeStr){
    let timeList = getCourseTime(timeStr);
    for(let i=0;i<timeList.length;i++)if(unavailableTime.contains(timeList[i]))return false;
    return true;
}

//获取已选择名单
function getCheckedCourseList(){
    let list = [];
    let nodes = document.querySelectorAll("#courseListDiv>span[title]");
    for(let i=0;i<nodes.length;i++){
        list.push({id:nodes[i].title, selected:"false", name: nodes[i].ctitle, course_id:nodes[i].name, class_str:nodes[i].classStr});
    }
    return list;
}

// 按照时间冲突更新勾选框启用状态
function updateTimeAvailability(course_row, repeat=false, retry=100){
    let time = course_row.querySelector(".sksj");
    if(time.innerText){
        let check = course_row.querySelector(".select_course input");
        if(check){
            console.log("Check time");
            setBtnEnability(check,timeAvailable(time.innerText));
        }
    }
    else if(repeat && retry > 0){
        setTimeout(()=>{
            updateTimeAvailability(course_row,true,retry-1);
        },100);
    }
}

//监听表格，添加勾选框
function observeTable(){
    //let tbody = document.querySelector("tbody");
    let tbody = document.querySelector(".tjxk_list");
    if(tbody==null){
        observeThread = setTimeout(observeTable,1000);
        return;
    }
    else clearTimeout(observeThread);
    console.log("begin observe table.");
    // 打开课程列表时，检查时间冲突
    tbody.querySelectorAll(".kc_head").forEach((panel)=>{
        panel.addEventListener("click",()=>{
            let courseList = panel.parentElement.querySelectorAll(".body_tr");
            for(let i=0;i<courseList.length;i++){
                updateTimeAvailability(courseList[i],true);
            }
        })
    })

    // 直接检查第一个课程的时间冲突
    let courseList = tbody.querySelector(".panel-info").querySelectorAll(".body_tr");
    for(let i=0;i<courseList.length;i++){
        updateTimeAvailability(courseList[i],true);
    }

    // 监听之前先添加所有按钮
    tbody.querySelectorAll("table").forEach((table)=>{
        let thead = table.querySelector("thead tr");
        let header = document.createElement("th");
        header.innerText = "捡漏";
        thead.appendChild(header);
        table.querySelectorAll(".body_tr").forEach((row,index)=>{
            addCheckbox(row,index);
        })
    })
    observer.observe(tbody,{"childList":true});
}

//添加勾选框
function addCheckbox(row,index){
    if(row.querySelector(".select_course")!=null)return;
    let td = document.createElement("td");
    let checkbox = document.createElement("input");
    let id = row.querySelector(".jxb_id").innerText;
    let enabled = true;
    checkbox.type = "checkbox";
    td.className = "select_course";
    td.appendChild(checkbox);
    row.appendChild(td);
    checkbox.addEventListener("click",()=>{
        if(checkbox.checked)addToListDiv(row,index);
        else removeFromListDiv(id);
    })
    setBtnEnability(checkbox,enabled);
    if(document.querySelector(`#courseListDiv span[title='${id}']`)){
        if(!enabled){
            removeFromListDiv(id);
        }
        else checkbox.checked = true;
    }
}

function addToListDiv(row,index){
    let class_str = row.querySelector(".jxbmc").innerText;
    let id = row.querySelector(".jxb_id").innerText;
    let kch_id = row.querySelector(".kch_id").innerText;
    let course_title = document.querySelector(`#kcmc_${kch_id} a`).innerText;
    if(document.querySelector(`#courseListDiv > span[title='${id}']`)!=null)return;

    let s = document.createElement("span");
    s.title = id;
    s.innerText = course_title + `${index+1}`;
    s.name = kch_id;
    s.ctitle = course_title;
    s.classStr = class_str;
    let close = document.createElement("span");
    close.className="close-icon";
    close.addEventListener("click",()=>{removeFromListDiv(s.title);});
    s.appendChild(close);
    document.querySelector("#courseListDiv").appendChild(s);
}

function removeFromListDiv(cId){
    let s = document.querySelector(`#courseListDiv > span[title='${cId}']`);
    if(s!=null){
        s.remove();
        document.querySelectorAll(`[id='tr_${cId}']`).forEach((item)=>{
            let check = item.querySelector(".select_course input");
            if(check)check.checked = false;
        })
    }
}

//创建模态框
function createCourseDialog(){
    //初始化对话框
    let div = document.createElement("div");
    div.className = "bootbox modal sl_mod my-modal";
    div.tabindex="-1";
    div.role="dialog";
    div.name = "courseModal";
    div.id="courseModal";
    div.style="display: hidden;";
    div.innerHTML=`
    <div class="modal-dialog" style="width: 60%;height: 60%">
        <div class="modal-content" style="height: 100%;min-height: 300px;min-width:400px;">
            <div class="modal-header" style="cursor: move;height:50 px;">
                <input type="hidden" name="focusInput">
                <button type="button" class="bootbox-close-button btn-sm close bootbox-close" data-dismiss="modal">
                <span aria-hidden="true">一</span>
                <span class="sr-only">Close</span>
                </button>
                <h4 class="modal-title">选课详情</h4>
            </div>
            <div class="modal-body" style="position: absolute;top:50px;bottom:50px;width:100%;">
                <ul class="nav nav-tabs">
                    <li class="active"><a href="#" data-target="#course_table_tab" data-toggle="tab" id="course_log_btn">选课表格</a></li>
                    <li><a href="#" data-toggle="tab" data-target="#course_log_tab" id="course_table_btn">选课日志</a></li>
                    <li><a href="#" data-toggle="tab" data-target="#course_setting_tab" id="course_setting_btn">设置</a></li>
                </ul>
                <div class="tab-content" style="font-family: ui-serif;font-size: large;word-break: break-all;overflow-y: scroll;position: absolute;top: 57px;bottom: 0px;left: 15px;right: 15px;">
                    <div class="tab-pane active" id="course_table_tab">
                        <table border="1" style="width:100%" id="course_table">
                            <tbody>
                            <tr>
                                <th>课程名</th>
                                <th>容量</th>
                                <th>已选</th>
                                <th>余量</th>
                            </tr>
                            </tbody>
                            <tbody id="course_content"></tbody>
                        </table>
                    </div>
                    <div class="tab-pane" id="course_log_tab">
                        <div style="word-break: break-word;" id="course_log"></div>
                    </div>
                    <div class="tab-pane" id="course_setting_tab">
                        <div id="course_setting" style="width: 400px;left: 30px;">
                            <br>
                            <div class="input-group course-setting-group">
                                <span class="input-group-addon" data-toggle="popover" title="刷新课程余量时间间隔，建议不少于15000">查询频率</span>
                                <input class="form-control" type="number" id="course_interval" value="${interval}">
                                <span class="input-group-addon">毫秒</span>
                            </div>
                            <br>
                            <div class="input-group course-setting-group">
                                <span class="input-group-addon" data-toggle="popover" title="同时多个课程可选时，各选课请求间的间隔，默认为1000">选课间隔</span>
                                <input class="form-control" type="number" id="course_select_interval" value="${choose_interval}">
                                <span class="input-group-addon">毫秒</span>
                            </div>
                            <br>
                            <div class="input-group course-setting-group">
                                <span class="input-group-addon" data-toggle="popover" title="连续失败超过该次数时自动停止，默认为4">重试次数</span>
                                <input class="form-control" type="number" id="course_retry" value="${err_retry}">
                                <span class="input-group-addon">次</span>
                            </div>
                            <br>
                            <div class="input-group course-setting-group">
                                <button data-loading-text="应 用" type="button" class="btn btn-sm btn-primary" id="apply_setting">应 用</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer" style="position: absolute;height:50px;bottom:0px;width:100%;">
                <button type="button" class="btn btn-sm btn-primary" id="modal_stop_btn">开 始</button>
                <button data-bb-handler="cancel" data-loading-text="关 闭" type="button" class="btn btn-sm btn-default" data-dismiss="modal">关 闭</button>
            </div>
        </div>
    </div>`;

    document.querySelector("body").appendChild(div);
    $("#courseModal .modal-content").draggable({handle:".modal-header"}).resizable({handles:"e,s,se"});
    $("#course_log_btn").click(function (e) {
        e.preventDefault();
        document.querySelector("#course_log_tab").style.display="";
        $(this).tab('show');
    });
    $("#course_table_btn").click(function (e) {
        e.preventDefault();
        document.querySelector("#course_table_tab").style.display="";
        $(this).tab('show');
    });
    $("#course_setting_btn").click(function (e) {
        e.preventDefault();
        document.querySelector("#course_setting_tab").style.display="";
        $(this).tab('show');
    });
    $('#courseModal').on('hidden.bs.modal', function () {
        document.querySelector("#modal_minimized").style.display="";
    })

    let stop_btn = document.querySelector("#modal_stop_btn");
    document.querySelector("#modal_stop_btn").addEventListener("click",()=>{
        //
        if(stop_btn.innerText=="开 始"){
            if(btn.status===1){stop_btn.innerText=="停 止";return;}
            btnClick();
        }
        else{
            stopQuery();
        }
    })

    document.querySelector("#apply_setting").addEventListener("click",()=>{
        saveSetting($("#course_interval").val(), $("#course_select_interval").val(),$("#course_retry").val());
        alert("应用成功！");
    })


    //创建最小化窗口
    let modal_minimized = document.createElement("div");
    modal_minimized.className="modal-minimized";
    modal_minimized.innerHTML='<h4 class="modal-title" style="color: #fff;">未选课</h4>';
    modal_minimized.id="modal_minimized";
    modal_minimized.addEventListener("click",()=>{
        showDialog(false,false);
    })
    document.body.appendChild(modal_minimized);

    print("注意：\n选课成功后，列表和选课信息并不会更新，但是刷新页面后可以看到效果\n长时间开启脚本请将频率调低\n脚本仅供学习参考用，出问题后果自负！","important",true);
}

//显示模态框
function showDialog(clear_table,clear_log){
    if(clear_table){
        document.querySelector("#course_content").innerHTML="";
        for(let i=0;i<courseList.length;i++){
            addCourseRow(courseList[i].name.replace(/"/g,""), courseList[i].id, "待查询", "待查询");
        }
    }
    if(clear_log)clearLog();
    document.querySelector("#course_table_tab").style.display="";
    document.querySelector("#course_log_tab").style.display="";
    document.querySelector("#modal_minimized").style.display="none";
    $("#courseModal").modal('show');
}

//打印日志
function print(msg,type,no_time){
    let date = new Date();
    let p = document.createElement("p");
    p.innerText=date.toShortDateString()+" "+date.toShortTimeString()+"：";
    if(no_time)p.innerText="";
    switch(type){
        case 'error':
            p.style="color:red;background:pink;";
            break;
        case 'success':
            p.style="color: green;font-weight: bold;background: greenyellow;";
            break;
        case 'warning':
            p.style="background: goldenrod;color: yellow;";
            break;
        case 'important':
            p.style="font-size: large;font-weight: bold;color: red;";
            break;
        default:
            break;
    }
    p.innerText+=msg;
    document.querySelector("#course_log").appendChild(p);
}

//清除日志
function clearLog(){
    document.querySelector("#course_log").querySelectorAll(":not(p[style])").forEach((item)=>{item.remove();})
}

//课程信息表格添加课程
function addCourseRow(course_name, course_id, course_size, selected_num){
    let tr = document.createElement("tr");
    if(course_size=="待查询")tr.innerHTML=`<td>${course_name}</td><td>${course_size}</td><td>${selected_num}</td><td>${course_size}</td>`;
    else tr.innerHTML=`<td>${course_name}</td><td>${course_size}</td><td>${selected_num}</td><td>${course_size-selected_num}</td>`;
    tr.id = "c"+course_id;
    document.querySelector("#course_content").appendChild(tr);
}

//更新单个课程余量信息
function updateCourseInfo(course_name, course_id, course_size, selected_num){
    let tr = document.querySelector(`#c${course_id}`);
    if(!tr)addCourseRow(course_name, course_id, course_size, selected_num)
    else{
        tr.innerHTML=`<td>${course_name}</td><td>${course_size}</td><td>${selected_num}</td><td>${course_size-selected_num}</td>`;
    }
}

//课程余量查询线程
function queryThread(retry=err_retry){
    //设置参数
    let qStart = 1, qEnd = 30;
    var requestMap = {};
    var retry_remain = retry;


    $.extend(requestMap,{
        "rwlx":$("#rwlx").val(),"xkly":$("#xkly").val(),"bklx_id":$("#bklx_id").val(),"xz":$("#xz").val(),
        "xqh_id":$("#xqh_id").val(),"jg_id":$("#jg_id_1").val(),"zyh_id":$("#zyh_id").val(),"zyfx_id":$("#zyfx_id").val(),
        "njdm_id":$("#njdm_id").val(),"bh_id":$("#bh_id").val(),"xbm":$("#xbm").val(),"xslbdm":$("#xslbdm").val(),"mzm":$("#mzm").val(),
        "ccdm":$("#ccdm").val(),"xsbj":$("#xsbj").val(),"sfkknj":$("#sfkknj").val(),"gnjkxdnj":$("#gnjkxdnj").val(),"sfkkzy":$("#sfkkzy").val(),
        "sfznkx":$("#sfznkx").val(),"zdkxms":$("#zdkxms").val(),"sfkxq":$("#sfkxq").val(),"sfkcfx":$("#sfkcfx").val(),
        "kkbk":$("#kkbk").val(),"kkbkdj":$("#kkbkdj").val(),"bklbkcj":$("#bklbkcj").val(),"xkxnm":$("#xkxnm").val(),"xkxqm":$("#xkxqm").val(),"bjgkczxbbjwcx":$("#bjgkczxbbjwcx").val(),
        "rlkz":$("#rlkz").val(),"cdrlkz":$("#cdrlkz").val(),"rlzlkz":$("#rlzlkz").val(),"kklxdm":$("#kklxdm").val(),"xkkz_id":$("#xkkz_id").val(),"sfkgbcx":$("#sfkgbcx").val(),
        "sfrxtgkcxd":$("#sfrxtgkcxd").val(),"tykczgxdcs":$("#tykczgxdcs").val(),"kklxdm":$("#kklxdm").val(),"xkzgbj":$("#xkzgbj").val()
    });
    if($("#jxbzbkg").val()=="1"){
        $.extend(requestMap,{"jxbzb":$("#jxbzb").val()});
    }
    if($("#jxbzhkg").val()=="1"){
        $.extend(requestMap,{"zh":$("#zh").val()});
    }

    let filter_list = [];
    //获取需选择的课程列表
    for(let i=0;i<courseList.length;i++)
    {
        if(courseList[i].selected=="false")filter_list.push(courseList[i].class_str);
    }
    //若列表为空，则已经查询完成
    if(filter_list.length==0){
        stopQuery();
        let str = "选课完成！已选择课程：\n";
        for(let i=0;i<courseList.length;i++)
        {
            if(courseList[i].selected=="true")str+=courseList[i].name.replace(/"/g,"")+"\n";
        }
        print(str);
        return;
    }
    for(let i=0;i<filter_list.length;i++)
    {
        requestMap[`filter_list[${i}]`]=filter_list[i];
    }
    //开始查询
    $.ajax({
        //url:`https://jwgl.whu.edu.cn/xsxk/zzxkyzb_cxZzxkYzbPartDisplay.html?gnmkdm=${gnmkdm}&su=${su}`,
        url:`https://jwgl.whu.edu.cn/xsxk/zzxklbb_cxZzxkLbbPartDisplay.html?gnmkdm=${gnmkdm}&su=${su}`,
        type:"POST",
        data:requestMap,
        success:(res)=>{
            try{
                //let courses = res.tmpList;
                let courses = res.items;
                let courses_available = [];
                //更新课程容量信息
                for(let i=0;i<courses.length;i++){
                    //let course_size = parseInt(courses[i].blzyl);
                    //let selected_num = parseInt(courses[i].blyxrs);
                    let course_size = parseInt(courses[i].jxbrl);
                    let selected_num = parseInt(courses[i].yxzrs);
                    let course_id = courses[i].jxb_id;
                    updateCourseInfo(courses[i].kcmc,course_id,course_size,selected_num);
                    if(course_size>selected_num)
                        courses_available.push(courses[i]);
                }
                print("更新课程余量信息");
                //若有空位
                courses_available.forEach((item,index)=>{
                    if(DEBUG)console.log(index);
                    setTimeout(()=>{chooseCourse(item)},index*choose_interval);
                })
                if(!stopped){
                    thread = setTimeout(()=>{
                        queryThread(err_retry);
                    },interval);
                }
            }
            catch(e){
                if(retry_remain<=0){
                    print(`结果解析出错\n${e.stack}返回内容${res}，剩余重试次数为0，停止查询！`,"error");
                    stopQuery();
                    print("查询因出错过多而停止！","error");
                    return;
                }
                print(`结果解析出错\n${e.stack}\n返回内容：\n${res}\n正在重试，剩余重试次数${retry_remain-1}`,"error");
                if(!stopped){
                    thread = setTimeout(()=>{
                        queryThread(retry_remain-1);
                    },interval);
                }
            }
        },
       error:(jqXHR, textStatus, errorThrown)=>{
           if(retry_remain<=0){
               print(`请求出错(${errorThrown})，剩余重试次数为0，停止查询！`,"error");
               stopQuery();
               print("查询因请求出错过多而停止！","error");
               return;
           }
           print(`请求出错(${errorThrown})，正在重试，剩余重试次数${retry_remain-1}`,"error");
           if(!stopped){
               thread = setTimeout(()=>{
                   queryThread(retry_remain-1);
               },interval);
           }
       }
    })
}

//选择课程
function chooseCourse(courseItem,retry=false,retry_remain=err_retry){
    if(!retry)print(`${courseItem.kcmc}有空位，正在选择...`);
    var do_jxb_id = "";
    ajaxGetCourseDetail(courseItem).then((res)=>{
        for(let i = 0; i < res.length; ++i){
            if(res[i].jxb_id == courseItem.jxb_id){
                console.log(`找到课头${i}`,res[i]);
                do_jxb_id = res[i].do_jxb_id;
                let kch_id = courseItem.kch_id;
                return ajaxSelectCourseStep1(do_jxb_id, kch_id);
            }
        }
    }).then((res)=>{
        if(res.flag=="1" || res.flag == "2"){// 请求1成功
            return ajaxSelectCourseStep2(do_jxb_id, courseItem);
        }
        // 异常处理
        else if(data.flag=="-2"){  //请刷新网页重试！
            return $.Deferred().reject({
                msg: "网页繁忙！",
                code: 1,
                step: 1
            });
        }else if(data.flag=="-1"){ //警告：你正在非法访问！
            return $.Deferred().reject({
                msg: "出现非法访问！",
                code: -1,
                step: 1
            });
        }else{ //出现未知异常，请与管理员联系
            return $.Deferred().reject({
                msg: "出现未知异常！",
                code: -2,
                step: 1
            });
        }
    }).then((res)=>{
        let flag = parseInt(res.flag);
        if(flag >= 1 && flag <= 5){ // 无视冲突，继续选课
            return ajaxSelectCourseStep3(do_jxb_id, courseItem.kch_id);
        }
        else {
            //出现未知异常，请与管理员联系
            return $.Deferred().reject({
                msg: "出现未知异常！",
                code: -2,
                step: 2
            });
        }
        return;
    }).then((res)=>{
        //选课成功
        if(res.flag=="1"){
            //选课成功
            print(`${courseItem.kcmc}选择成功，请刷新页面查看结果`,'success');
            let tr = document.querySelector(`#c${courseItem.jxb_id}`);
            if(tr)tr.style.background="greenyellow";

            let course_remain = 0;
            for(let i=0;i<courseList.length;i++){
                if(courseList[i].id==courseItem.jxb_id)courseList[i].selected="true";
                //相同课程名也停止选择
                else if(courseList[i].course_id==courseItem.kch){
                    let tr1 = document.querySelector(`#c${courseList[i].id}`);
                    if(tr1)tr1.style.background="yellow";
                    courseList[i].selected="true";
                }
                if(courseList[i].selected == "false")
                    ++course_remain;
            }
            // 检测是否选课完成
            if(course_remain == 0){
                stopQuery();
                let str = "选课完成！已选择课程：\n";
                for(let i=0;i<courseList.length;i++)
                {
                    if(courseList[i].selected=="true")str+=courseList[i].name.replace(/"/g,"")+"\n";
                }
                print(str);
            }
        }
        //容量不足
        else if(res.flag=="-1"){
            //出现未知异常，请与管理员联系
            return $.Deferred().reject({
                msg: "容量已满，等待下一次空闲",
                code: 2,
                step: 3
            });
        }
        //其他错误
        else{
            let tr = document.querySelector(`#c${courseItem.jxb_id}`);
            if(tr)tr.style.background="pink";
            for(let i=0;i<courseList.length;i++){
                if(courseList[i].id==courseItem.jxb_id)courseList[i].selected="error";
            }
            removeFromListDiv(courseItem.jxb_id);
            return $.Deferred().reject({
                msg: `不符合要求，已移除该课程。具体原因：${res.msg}`,
                code: 3,
                step: 3
            });
        }
    }).fail(function (err) {
        /*
         * 错误代码
         * -1 非法访问
         * -2 未知错误
         * 0 成功
         * 1 网页繁忙
         * 2 容量已满
         * 3 不符合要求
         */
        if(err.step){
            let msg = `${courseItem.kcmc}-选课请求${err.step}/3：${err.msg}`;
            if(err.code < 0){
                let msg = `${courseItem.kcmc}-选课请求${err.step}出错：${err.msg}`;
                print(msg,"error");
                stopQuery();
                print("选课因出现错误而停止！","error");
                return;
            }
            print(msg,"warning");
            if(err.code > 1){ // 不重试，直接返回
                return;
            }
        }
        // 代码错误和其他异常
        if(retry<=0){
            print(`选课时出现错误：${e}，剩余重试次数为0，停止查询！`,"error");
            stopQuery();
            print("选课因出错过多而停止！","error");
            return;
        }
        print(`选课时出现错误：${e}，正在重试，剩余重试次数${retry-1}`,'error');
        if(!stopped)setTimeout(()=>{chooseCourse(courseItem,true,retry-1);},choose_interval);
    });
}

function stopQuery(){
    print("停止选课");
    clearTimeout(thread);
    stopped = true;
    btn.innerHTML="开始抢课";
    btn.status=0;
    document.querySelector("#modal_minimized h4").innerHTML="未选课";
    document.querySelector("#modal_stop_btn").innerText="开 始";
}

function loadSetting(){
    if(!GM_getValue("course_interval",null))saveSetting(interval, choose_interval);
    else{
        interval = GM_getValue("course_interval", interval);
        choose_interval = GM_getValue("choose_interval", interval);
        err_retry = GM_getValue("choose_retry", err_retry);
    }
}

function saveSetting(new_interval,new_choose_interval,new_retry){
    interval = new_interval;
    choose_interval = new_choose_interval;
    err_retry = new_retry;
    GM_setValue("course_interval", interval);
    GM_setValue("choose_interval", choose_interval);
    GM_setValue("choose_retry", err_retry);
}

function ajaxGetCourseDetail(courseItem){
    var requestMap = $("#searchBox").searchBox("getConditions");
    $.extend(requestMap,{
        "rwlx":$("#rwlx").val(),"xkly":$("#xkly").val(),"bklx_id":$("#bklx_id").val(),"sfkkjyxdxnxq":$("#sfkkjyxdxnxq").val(),"kzkcgs":$("#kzkcgs").val(),
        "xqh_id":$("#xqh_id").val(),"jg_id":$("#jg_id_1").val(),"zyh_id":$("#zyh_id").val(),"zyfx_id":$("#zyfx_id").val(),"txbsfrl":$("#txbsfrl").val(),
        "njdm_id":$("#njdm_id").val(),"bh_id":$("#bh_id").val(),"xbm":$("#xbm").val(),"xslbdm":$("#xslbdm").val(),"mzm":$("#mzm").val(),"xz":$("#xz").val(),
        "ccdm":$("#ccdm").val(),"xsbj":$("#xsbj").val(),"sfkknj":$("#sfkknj").val(),"gnjkxdnj":$("#gnjkxdnj").val(),"sfkkzy":$("#sfkkzy").val(),"kzybkxy":$("#kzybkxy").val(),
        "sfznkx":$("#sfznkx").val(),"zdkxms":$("#zdkxms").val(),"sfkxq":$("#sfkxq").val(),"sfkcfx":$("#sfkcfx").val(),"bbhzxjxb":$("#bbhzxjxb").val(),
        "kkbk":$("#kkbk").val(),"kkbkdj":$("#kkbkdj").val(),"bklbkcj":$("#bklbkcj").val(),"xkxnm":$("#xkxnm").val(),"xkxqm":$("#xkxqm").val(),"xkxskcgskg":$("#xkxskcgskg").val(),
        "rlkz":$("#rlkz").val(),"cdrlkz":$("#cdrlkz").val(),
        "rlzlkz":$("#rlzlkz").val(),"kklxdm":$("#kklxdm").val(),"kch_id":courseItem.kch_id,"jxbzcxskg":$("#jxbzcxskg").val(),
        "xklc":$("#xklc").val(),"xkkz_id":$("#xkkz_id").val(),"cxbj":courseItem.cxbj,"fxbj":courseItem.fxbj
    });

    return $.ajax({
        url:`https://jwgl.whu.edu.cn/xsxk/zzxkyzbjk_cxJxbWithKchZzxkYzb.html?gnmkdm=${gnmkdm}`,
        type:"POST",
        data:requestMap,
    });
}

function ajaxSelectCourseStep1(do_jxb_id, kch_id){
    let requestMap = {
        jxb_ids:do_jxb_id,xkxnm:$("#xkxnm").val(),xkxqm:$("#xkxqm").val(),"bj":"2",
        kch_id:kch_id,"njdm_id":$("#njdm_id").val(),"zyh_id":$("#zyh_id").val(),"kklxdm":$("#kklxdm").val()
    };

    return $.ajax({
        url:`https://jwgl.whu.edu.cn/xsxk/zzxkyzb_cxXkTitleMsg.html?gnmkdm=${gnmkdm}`,
        type:"POST",
        data:requestMap,
    });
}

function ajaxSelectCourseStep2(do_jxb_id, kch_id){
    let requestMap = {
        jxb_ids:do_jxb_id,xkxnm:$("#xkxnm").val(),xkxqm:$("#xkxqm").val(),kch_id:kch_id,"sfyxsksjct":$("#sfyxsksjct").val()
    };

    return $.ajax({
        url:`https://jwgl.whu.edu.cn/xsxk/zzxkyzb_cxCtKcZyZzxkYzb.html?gnmkdm=${gnmkdm}`,
        type:"POST",
        data:requestMap,
    });
}

function ajaxSelectCourseStep3(do_jxb_id, kch_id){
    var kcmc = $("#kcmc_"+kch_id).text();
	var rlkz = $("#rlkz").val();
	var cdrlkz = $("#cdrlkz").val();
	var rlzlkz = $("#rlzlkz").val();
	var sxrlkzlx = $("#sxrlkzlx").val();
	var rwlx = $("#rwlx").val();
	var xxkbj = $("#xxkbj_"+kch_id).val();
	var sxbj = "0";
	if(rlkz=="1" || cdrlkz=="1" || rlzlkz=="1"){
		sxbj = "1";
	}else{
		sxbj = "0";
	}

    let requestMap = {
		jxb_ids:do_jxb_id,kch_id:kch_id,kcmc:kcmc,rwlx:rwlx,rlkz:rlkz,cdrlkz:cdrlkz,rlzlkz:rlzlkz,sxbj:sxbj,xxkbj:xxkbj,qz:0,
		cxbj:$("#cxbj_"+kch_id).val(),xkkz_id:$("#xkkz_id").val(),njdm_id:$("#njdm_id").val(),zyh_id:$("#zyh_id").val(),
		kklxdm:$("#kklxdm").val(),xklc:$("#xklc").val(),xkxnm:$("#xkxnm").val(),xkxqm:$("#xkxqm").val(),"jcxx_id":[].join(',')
	};

    return $.ajax({
        url:`https://jwgl.whu.edu.cn/xsxk/zzxkyzbjk_xkBcZyZzxkYzb.html?gnmkdm=${gnmkdm}`,
        type:"POST",
        data:requestMap,
    });
}

function setBtnEnability(btn,enabled){
    btn.title = enabled ? "":"时间冲突";
    btn.disabled = !enabled;
}