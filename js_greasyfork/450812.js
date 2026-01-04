// ==UserScript==
// @name         武汉理工继续教育学院作业练习辅助
// @namespace    http://tampermonkey.net/
// @version      4.0.3
// @description  用于武汉理工大学继续教育学院的作业练习辅助
// @author       coder

// @match        http*://wljy.whut.edu.cn/*
// @match        http*://wljy.whut.edu.cn/web/exercise.htm*
// @match        http*://wljy.whut.edu.cn/web/showexercise.htm*
// @match        http*://wljy.whut.edu.cn/web/ucenterdetail.htm*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @grant        GM_notification
// @grant        GM_xmlhttpRequest


// @downloadURL https://update.greasyfork.org/scripts/450812/%E6%AD%A6%E6%B1%89%E7%90%86%E5%B7%A5%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E9%99%A2%E4%BD%9C%E4%B8%9A%E7%BB%83%E4%B9%A0%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/450812/%E6%AD%A6%E6%B1%89%E7%90%86%E5%B7%A5%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E9%99%A2%E4%BD%9C%E4%B8%9A%E7%BB%83%E4%B9%A0%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==
// @require      file:///G:\work\project_2021\继续教育\油猴脚本\goeduscript\src\武汉理工.js
// @require      file:///D:\work\project_2021\继续教育\油猴脚本\武汉理工大学继续教育学院\goeduscript\src\武汉理工.js

(function () {
    'use strict';

main();
function main(){
//============================================================
// var baseUrl = "http://gssweb.tpddns.cn:8888/" ;
var baseUrl = "https://i9y97ghk3.neiwangyun.net/" ;
// var baseUrl = "http://gssedu.vaiwan.com/" ;

console.log("=====hello world====");
console.log("jquery version : ", 　$.fn.jquery);
$('#gerenzhongxin, .padd-body, #doLogin').prepend('<div id="yh_div_new"></div>');
$('#gerenzhongxin, .padd-body, #doLogin').prepend('<div id="yh_div_new2"></div>');

let zuoyeOpbtn = `
<div id='zuoyeOp'>
<input type="button" id="yh_btn2" class="enable"   value="读取练习答案" ><br/>
<input type="button" id="yh_btn1" class="enable"   value="显示页面答案" ><br/>
<input type="button" id="yh_btn3" class="enable"   value="选中页面答案" ><br/>
<div id="errText"></div>
<div id="tipText">
<p>
<h5>一、做作业页面：</h5>
注意：每个作业至少必须练习一次<br/>
1. 请先点击显示页面答案，<br/>2. 观察所有题目是否都有答案，<br/>3. 再点击选中页面答案<br/>【如果选中了左边的题目编号会变蓝，<br/>如果没有选中，则需要手动选中】，
<br/>如果没有答案，<br/>请先到练习记录中点击获取答案
</p>
<p>
<h5>二、练习页面：</h5>
1. 必须先点击获取答案，<br/>按钮才会有答案，<br/>否则在作业页面是没有答案的
</p>
</div>

</div>
`;

let timeOpBtn = '' ;

// let timeOpBtn = `
// <div id='timeOp' >
// <input type="button" id="yh_btn5" class="enable"   value="发课程评论" ><br/>
// <input type="button" id="yh_btn6" class="enable"   value="刷课程时间" ><br/>
// <input type="text" id="input_userid" class="enable"   placeholder="请输入学号" ><br/>
// <div id="errText2"></div>

// </div>
// `;
$('#yh_div_new').append(zuoyeOpbtn);
$('#yh_div_new2').append(timeOpBtn);
$('#yh_div_new').append(loading());



// $("#yh_btn0").hide()
// loadGlobalCss(createCss())

// exercise.htm         作业页面
// showexercise.htm     练习记录页面
// ucenterdetail.htm    课程页面
const pathname = window.location.pathname;
console.log("pathname:",  pathname);
if("/web/ucenterdetail.htm" == pathname){ // 课程页面
    // 课程页面
    $("#yh_btn1").hide();
    $("#yh_btn2").hide();
    $("#yh_btn3").hide();
    $("#yh_btn4").hide();
    $("#errText").hide();
    $("#tipText").hide();
    shouYouHui();
    onShowckTime();
} else if("/web/exercise.htm" == pathname ){
    // 作业页面
    $("#yh_btn2").hide();
    $("#yh_btn5").hide();
    $("#yh_btn6").hide();
    $("#input_userid").hide();
    $("#errText2").hide();
    console.log("exercise ....");
    checkTiKu();
    shouYouHui(pathname);
    onShowck();
}else if("/web/showexercise.htm" == pathname){
    // 练习记录页面
    $("#yh_btn1").hide();
    $("#yh_btn3").hide();
    $("#yh_btn5").hide();
    $("#yh_btn6").hide();
    $("#input_userid").hide();
    $("#errText2").hide();
    shouYouHui(pathname);
    checkTiKu();
    onShowck();
}else if("/web/beforePractice.htm" == pathname ){
    // 作业页面
    $("#yh_btn2").hide();
    $("#yh_btn5").hide();
    $("#yh_btn6").hide();
    $("#input_userid").hide();
    $("#errText2").hide();
    console.log("exercise ....");
    checkTiKu();
    // shouYouHui(pathname);
    onShowck();
}else if( "/web/showBeforePractice.htm" == pathname){ //
    // 练习记录页面
    $("#yh_btn1").hide();
    $("#yh_btn3").hide();
    $("#yh_btn5").hide();
    $("#yh_btn6").hide();
    $("#input_userid").hide();
    $("#errText2").hide();
    // shouYouHui(pathname);
    checkTiKu();
    setTimeout(() => {
        onShowck2();
    }, 20*1000);
}else{
    // 默认全部隐藏
    $("#yh_btn1").hide();
    $("#yh_btn2").hide();
    $("#yh_btn3").hide();
    $("#yh_btn4").hide();
    $("#errText").hide();
    $("#yh_btn5").hide();
    $("#yh_btn6").hide();
    $("#input_userid").hide();
    $("#errText2").hide();
    $("#tipText").hide();
}

$("#curriculum").click(function(){
    let requestData = {};
    requestData.userid = userId;
    $.ajax({
        type:"GET",
        url:baseUrl+"api/isShowBatchBtn",
        data:requestData,
        success:function (data) {
            if(data.code==200){
                quick()
            }else{
            }
        },
    });

})

function quick(){
    if("/web/admissionprocess.htm"== pathname ){
        console.log("userId", userId)
        setCookie('time_userid_input_end', userId)
        let isChosen = false ;
        let showBtn = setInterval(function(){
            isChosen = $("#curriculum").is(".chosen")
            console.log("isChosen", isChosen);
            if(isChosen){
                clearInterval(showBtn);
                setTimeout(() => {
                    let requestData = {};
                    requestData.userid = userId;
                    $.get(baseUrl+"api/validAcct", requestData, function(data){
                        if(data.code!=200){
                        }else{
                            addBtn();
                        }
                    })
                }, 2000);
            }
        },1000)
    }
}

function addBtn(){
    let trArr = $("#myCourse #maintable tbody tr");
    console.log("addBtn");
    let html = "<span class='quicklyOpen btn btn-primary ' style='  color:#c46648;' >批量做题</span>";
    let hishtml = "<span class='quicklyOpenHis btn btn-primary' style='margin:4px 4px 4px 6px; color:#c46648;' >批量记录</span>";
    $.each(trArr, function(i, o){
        // let isAppend = $(o).find("td:last").children(".quicklyOpen");
        // if(isAppend.length==0){
        // }
        $(o).find("td:last").append(html)
        $(o).find("td:last").append(hishtml)
    })


    $("#myCourse").delegate(".quicklyOpen","click", function(){
        layer.msg("正在打开中，请不要重复点击, 预计15秒内打开该课程所有的作业",{icon: 16, time: 5000})
        let exercise = $(this).parent().children("button:eq(0)").attr("onclick");
        let courNo = exercise.replace("exercise","").replaceAll("'","").replace("(","").replace(")","");
        console.log("courNo", courNo)
        let requestData = {};
        requestData.userid = userId;
        requestData.courNo = courNo;
        $.ajax({
            type:"GET",
            url:baseUrl+"api/getOpenUrl",
            data:requestData,
            success:function (data) {
                if(data.code==200){
                    $.each(data.data,function(i,o){
                        console.log("url", o);
                        window.open(o, "_blank");
                    })
                }else{
                    layer.msg(data.msg)
                }
            },
        });
    })


    $("#myCourse").delegate(".quicklyOpenHis","click", function(){
        layer.msg("正在打开中，请不要重复点击, 预计10秒内打开该课程所有的作业练习记录",{icon: 16, time: 5000})
        let exercise = $(this).parent().children("button:eq(0)").attr("onclick");
        let courNo = exercise.replace("exercise","").replaceAll("'","").replace("(","").replace(")","");
        console.log("courNo", courNo)
        let requestData = {};
        requestData.userid = userId;
        requestData.courNo = courNo;
        $.ajax({
            type:"GET",
            url:baseUrl+"api/getHisOpenUrl",
            data:requestData,
            success:function (data) {
                if(data.code==200){
                    $.each(data.data,function(i,o){
                        console.log("url", o);
                        window.open(o, "_blank");
                    })
                }else{
                    layer.msg(data.msg)
                }
            },
        });
    })


}



function loading(){
 return `
 <!-- loading -->
 <div class="modal fade" id="loading" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop='static'>
   <div class="modal-dialog" role="document">
     <div class="modal-content">
       <div class="modal-header">
         <h4 class="modal-title" id="myModalLabel">提示</h4>
       </div>
       <div class="modal-body">
         请稍候。。。<span id="result"></span>
       </div>
     </div>
   </div>
 </div>
 ` ;
}


// 发布课程评论
$("#yh_btn5").click(function() {
    let userid = $("#input_userid").val();
    console.log("userid", userid);
    if(isEmpty(userid)){
        alert("请输入学号");
        return false;
    }
    setCookie('time_userid_input_end', userid)

    $('#loading').modal('hide');
    alert("本次操作将会给该课程的所有课的评论一遍,预计30秒左右，请耐心等待");
    let titleArr = $(".container .tabs-container .tab-content .col-md-2 button");

    let contentList = [];
    contentList.push("正在学习中，老师 讲解非常到位，非常细心，受益匪浅");
    contentList.push("谢谢老师，老师辛苦了");
    contentList.push("老师辛苦了，讲的真好");
    contentList.push("谢谢老师的讲解，老师辛苦了！");
    contentList.push("老师讲的很仔细，很负责，谢谢老师");
    contentList.push("辛苦了");
    contentList.push("老师讲的很仔细，很负责，谢谢老师");
    contentList.push("讲的很仔细，谢谢老师");
    contentList.push("感谢老师的细心讲解！");
    contentList.push("老师讲的精彩，已于消化理解");
    contentList.push("讲解的详细易懂");
    $.each(titleArr,function(t, ts){
        //显示
        $('#loading').modal('show');
        // readyLearnCourse(9583,1963,75,'Unit One')
        let onclickText = $(ts).attr("onclick") ;

        let ids = onclickText.replace("readyLearnCourse","").replace("(","").replace(")","") ;
        let muluId = ids.split(",")[0]; // 目录ID
        let kechengId = ids.split(",")[1]; // 课程ID
        var i= Math.floor((Math.random()*contentList.length));

        var requestData="pkVal={0}&courNo={1}&content={2}&cookie={3}";
        requestData = requestData.format(muluId, kechengId, contentList[i], document.cookie);
        console.log(requestData);
        let span = '<span style="color:red; margin-left:10px;">{0}</span>' ;
        $.ajax({
            headers: {
                cookies: document.cookie
            },
            type:"GET",
            url:baseUrl+"api/pinglun",
            data:requestData,
            success:function (data) {
                if(data.code==200){
                    setCookie('time_userid_input_end', userid)
                    messageDialogShow("提交评论成功", data.msg)
                }else{
                    delCookie('time_userid_input_end')
                    messageDialogShow("提交评论失败",  span.format(data.msg))
                }
            },
        });
        sleep(200);
    })
    $("#yh_btn5").attr("value","本次操作完成!");
    $("#yh_btn5").attr("class","red");
    $('#loading').modal('hide');
})


// 刷课程时间
$("#yh_btn6").click(function() {
    let userid = $("#input_userid").val();
    console.log("userid", userid);
    if(isEmpty(userid)){
        alert("请输入学号");
        return false;
    }
    setCookie('time_userid_input_end', userid)
    alert("提交后请耐心等待，可以打开课程列表页刷新查看学习时长的变化");
    var requestData="courlibNo={0}&cookies={1}";
    requestData = requestData.format(queryString("id"), document.cookie);
    $.ajax({
        headers: {
            cookies: document.cookie
        },
        type:"GET",
        url:baseUrl+"api/intime",
        data:requestData,
        success:function (data) {
            if(data.code==200){
                setCookie('time_userid_input_end', userid)
                messageDialogShow("提交课程时间成功", data.msg);
            }else{
                delCookie('time_userid_input_end')
                messageDialogShow("提交课程时间失败",  data.msg);
            }
        },
    });
})



// 显示页面答案
$("#yh_btn1").click(function() {
    let tip = "该操作有可能会卡住页面，预计一分钟左右，请耐心等待...";
    alert(tip);
    let shijuandiv = $("#shijuandiv>.pad_top");
    $.each(shijuandiv,function(i, o){
        let requestData = {};
        let timu = getTimu($(o));
        console.log("timu: ", timu);
        let xuanxiangText = getXuanXiang(o);
        requestData.userid = queryString('stuId');
        requestData.instNo = queryString('instNo');
        requestData.timu = timu;
        requestData.xuanxiang = xuanxiangText;
        let uri = "api/getDaan" ;
        if( "/web/showBeforePractice.htm" == pathname || "/web/beforePractice.htm" == pathname){
            requestData.type = 1 ;
            uri = "api/getnolimitDa" ;
        }
        let span = '<span style="color:red; margin-left:10px;">答案 {0}</span>' ;
        // $.ajaxSettings.async = false;//设置为同步
        let respSucc = true ;
        $.get(baseUrl+uri, requestData, function(data){
            if(data.code==200){
                if(isEmpty(data.data)){
                    span = '<span style="color:red; font-size:20px; margin-left:10px;">提示： {0}</span>' ;
                    $(o).find("div:eq(0)").append(span.format('没有答案，可能是答案库中没有收集到，继续练习可能会获取到'));
                }else{
                    span = '<span style="color:#bd10e0; margin-left:10px; font-size:20px">答案: {0}</span>' ;
                    $(o).find("div:eq(0)").append(span.format(data.data));
                }
            }else{
                respSucc = false ;
                span = '<span style="color:red; font-size:20px; margin-left:10px;">提示： {0}</span>' ;
                $(o).find("div:eq(0)").append(span.format(data.msg));
            }
        })
        console.log("respSucc :", respSucc);
        // $.ajaxSettings.async = true;//变回异步
        if(!respSucc){
            return false;
        }
    })
    layer.msg("显示完成");
})


// 选中页面答案
$("#yh_btn3").click(function() {
    let tip = "该操作有可能会卡住页面，预计一分钟左右，请耐心等待...";
    alert(tip);
    let shijuandiv = $("#shijuandiv>.pad_top");
    let clickCount = 0 ;
    let randomClickCount = 0 ;
    $.each(shijuandiv,function(i, o){
        let requestData = {};
        let timu = getTimu($(o));
        let xuanxiangText = getXuanXiang(o);
        requestData.userid = queryString('stuId');
        requestData.instNo = queryString('instNo');
        requestData.timu = timu;
        requestData.xuanxiang = xuanxiangText;
        let span = '<span style="color:red; font-size:20px; margin-left:10px;">提示： {0}</span>' ;
        // $.ajaxSettings.async = false;
        let respSucc = true ;
        $.get(baseUrl+"api/getDaan", requestData, function(data){
            if(data.code==200){
                let val = data.data;
                // 找到答案，选中 模拟点击
                let xuanxiang = $(o).find("div:eq(1)>label>input");
                let rd = Math.floor(random(0,3));
                $.each(xuanxiang,function(ii, x){
                    if(!isEmpty(val)){
                        let _daanArr = val.split(";")
                        if(isEmpty(_daanArr)){
                            span = '<span style="color:red; font-size:20px; margin-left:10px;">提示： {0}</span>' ;
                            $(o).find("div:eq(0)").append(span.format('没有答案 【默认选中 D】 ，可能是答案库中没有收集到，继续练习可能会获取到'));
                            // // 默认选中 D
                            // $(x).click();
                            // return false ;
                        }else{
                            if(_daanArr.indexOf($(x).val())!=-1){
                                // console.log(i, "答案", _daanArr);
                                // console.log("模拟点击", $(x).val());
                                let span = '<span style="color:#bd10e0; margin-left:10px; font-size:20px">答案: {0}</span>' ;
                                $(o).find("div:eq(0)").append(span.format(data.data));
                                // $(x).click();
                                $(x).trigger("click");

                                clickCount = clickCount+1  ;
                                console.log("clickCount ", clickCount);
                            }
                        }
                    }else{
                        console.log("rd", rd);
                        console.log("ii", ii);
                        if(rd == ii){
                            randomClickCount = randomClickCount + 1;
                            console.log("选中：：：：：",ii);
                            span = '<span style="color:#0b32a0; font-size:20px; margin-left:10px;">提示： {0}</span>' ;
                            $(o).find("div:eq(0)").append(span.format('没有答案，【默认随机选中】可能是答案库中没有收集到，继续练习可能会获取到'));
                            $(x).click();
                            return false ;
                        }
                    }
                })
            }else{
                respSucc = false ;
                span = '<span style="color:red; font-size:20px; margin-left:10px;">提示： {0}</span>' ;
                $(o).find("div:eq(0)").append(span.format(data.msg));
            }
        });
        // sleep(1000)
        // $.ajaxSettings.async = true;
        if(!respSucc){
            return false;
        }
        console.log("-----------------------------------开始下一题");
        // return false
    })
    // let msg = '提交完成，请点击左侧【提交练习】按钮,<br/>本次完成数量【{0}】题,其中随机选中【{1}】题'.format(clickCount, randomClickCount);
    // layer.alert(msg, {
    //     skin: 'layui-layer-lan'
    //     ,closeBtn: 0
    //     ,anim: 4 //动画类型
    // })
})


function sleep(delay) {
    for(var t = Date.now(); Date.now() - t <= delay;);
}

// 读取单个题目的内容
function getTimu(o){
    let timu = ""

    let timuDiv =  $(o).find("div:eq(0)");
    let hasSpan = $(timuDiv).has("p>span");
    if(hasSpan.length==0){
        timu = $(timuDiv).html();
        timu = timu.substring(timu.indexOf("、")+1)
        // console.log("timu:", timu);
        return timu ;
    }

    // 题目包含在span 中
    let spanArr = $(o).find("div:eq(0)>p span");
    $.each(spanArr,function(s, so){
        // console.log($(so).html());
        let img = $(so).find("img");
        if(img.length>0){
            let src = $(img).attr("src").trim();
            // console.log("bbb:", timu.search(src));
            if(timu.search(src) == -1 ){
                timu += src;
            }
        }else {
            timu += $(so).text().trim();
        }
    })
    console.log("timu:", timu);
    return timu;
}

// 读取单个题目的选项
function getXuanXiang(o){
    let xx = "";
    let spanArr = $(o).find(".radio>label");
    $.each(spanArr,function(s, so){
        let li = $(s).children("input").val();
        let img = $(so).find("img");
        if(img.length>0){
            xx += $(so).text() + $(img).attr("src").trim();
            // console.log("选项 ", xx);
        }else {
            xx += $(so).text().trim();
        }
    })
    return xx;
}


// function getDomText(o, resText){
//     let children = $(o).children();
//     $.each(pArr,function(n, no){
//         let nextChildren = $(no).children();
//         if(nextChildren.length > 0){
//             return getDomText(no)
//         }else {
//             resText =
//             return resText ;
//         }
//     }
// }


// 获取单个题目答案
function getDaAn(o){
    // 包含 textarea 元素的 说明是主观题
    let textarea = $(o).find(">textarea");
    if(textarea.length > 0){
        let zgtDa = '' ;
        let pArr = $(o).find("div:eq(1)>p");
        $.each(pArr,function(p, po){
            let spanText = $(po).children("span").text().trim();
            let img = $(po).find("img");
            if(img.length>0){

                // zgtDa += $(po).text() + $(img).attr("src").trim();
                // console.log("选项 ", xx);
            }else {
                zgtDa += spanText;
            }
        })
        // console.log("主观题", zgtDa);
        return zgtDa ;
    }

    let da = $(o).find(">p").text().trim();
    if($.trim(da) === ""){
        // 这里需要读取选中的答案
        da = "";
        let xuanxiang = $(o).find("div:eq(1)>label>input");
        $.each(xuanxiang,function(ii, x){
            let checked = $(x).attr("checked"); // 取值 disabled checked
            if(checked == "checked"){
                da += $(x).val() + ";" ;
            }
        })
        // da.endWith(";")
    }else{
        let xuanxiang = $(o).find("div:eq(1)>label>input");
        da = da.split(":")[1].replace("【","").replace("】","");
        if(xuanxiang.length==2){
            da = da == "A"?"正确":da == "B"?"错误":"";
        }
    }
    console.log("答案", da);
    return da
}

// 获取练习答案
$("#yh_btn2").click(function() {
    getLXDA()
})


function getLXDA(){
    let saveDaAnDTO = {} ;
    let tiMuDaAnDTOList = [] ;
    saveDaAnDTO.userid = queryString('stuId');
    saveDaAnDTO.instNo = queryString('instNo');
    saveDaAnDTO.tiMuDaAnDTOList = tiMuDaAnDTOList ;

    if( "/web/showBeforePractice.htm" == pathname || "/web/beforePractice.htm" == pathname){
        saveDaAnDTO.type = 1 ;
    }

    let shijuandiv = $("#shijuandiv>.pad_top");
    $.each(shijuandiv,function(i, o){
        let tiMuDaAnDTO = {};
        let xuanxiangText = getXuanXiang(o);
        let timu = getTimu(o);
        let da = getDaAn(o);
        tiMuDaAnDTO.timu = timu ;
        tiMuDaAnDTO.xuanxiang = xuanxiangText ;
        tiMuDaAnDTO.danan = da ;
        if(!isEmpty(da)){
            tiMuDaAnDTOList.push(tiMuDaAnDTO);
        }
        //  test return
        // return false
    })


    $.ajax({
        type:"POST",
        url:baseUrl+"api/saveDaAn",
        contentType: "application/json",
        dataType:"json",
        data:JSON.stringify(saveDaAnDTO),
        success:function (data) {
            if(data.code != 200){
                alert(data.msg )
            }
            console.log(data.msg);
        }
    });
    // $(this).val($(this).val()+"(完成)");
    $("#yh_btn2").val($("#yh_btn2").val()+"-完成");
}


function isEmpty(val){
    if(val==undefined || val == null || val == ""){
        return true ;
    }
    return false ;
}


Array.prototype.remove = function (val) {
    let index = this.indexOf(val);
     if (index > -1) {
          this.splice(index, 1);
        }
 };


 function setCookie(name,value){
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
 }
 function delCookie(name){
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null)
    document.cookie= name + "="+cval+";expires="+exp.toGMTString();
 }
 function getCookie(name){
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg)){
        return unescape(arr[2]);
    }else{
        return null;
    }
}

function checkTiKu(){
    console.log("checkTiKu....");
    let requestData = {}
    requestData.userid = queryString('stuId');
    requestData.instNo = queryString('instNo');
    if( "/web/showBeforePractice.htm" == pathname || "/web/beforePractice.htm" == pathname){
        requestData.type = 1 ;
    }

    $.get(baseUrl+"api/checkTiKu", requestData, function(data){
        if(data.code==200){
            let div = "<div class='tiku'>"+data.data+" ! ! !</div>";
            $("#exam_bg").prepend(div);
        }else{
            let div = "<div class='notiku'>"+data.msg+" ! ! !</div>";
            $("#exam_bg").prepend(div);
        }
    })
}


function shouYouHui(){
    console.log("shouYouHui....");
    let requestData = {}
    requestData.cookie=document.cookie
    $.ajax({
        headers: {
            cookies: document.cookie
        },
        type:"GET",
        url:baseUrl+"api/getYouHui",
        data:requestData,
        success:function (data) {
            if(data.code==200){
                if(pathname == '/web/exercise.htm' || pathname == '/web/showexercise.htm'){
                    let div = "<div class='youhui'>"+data.msg+" ! ! !</div>";
                    $("#exam_bg").prepend(div);
                }else{
                    // messageDialogShow("当前优惠提示", data.msg)
                    let div = "<div class='youhui'>"+data.msg+" ! ! !</div>";
                    $("#errText2").prepend(data.msg);
                }
            }else{
                // messageDialogShow("当前优惠提示",  span.format(data.msg))
            }
        },
    });
}


function onShowck(){
    let requestData = "userid="+queryString("stuId")
    var jingyongid = setInterval(function(){
        $.get(baseUrl+"api/validAcct", requestData, function(data){
            clearInterval(jingyongid);
            if(data.code!=200){
                $("#yh_div_new > input").attr("class","huihui");
                $("#yh_div_new > input").attr("disabled","disabled");
                $("#errText").empty();
                $("#errText").append(data.msg);
            }else{
                console.log("移除禁用的按钮====");
                $(".enable").removeAttr("disabled");
                if("/web/showexercise.htm"== pathname ){
                    setTimeout(() => {
                        getLXDA()
                    }, 1000);
                }
            }
        })
    }, 1000);
}


function onShowck2(){
    let requestData = "userid="+queryString("stuId")
    var jingyongid = setInterval(function(){
        $.get(baseUrl+"api/validAcct", requestData, function(data){
            clearInterval(jingyongid);
            if(data.code!=200){
                $("#yh_div_new > input").attr("class","huihui");
                $("#yh_div_new > input").attr("disabled","disabled");
                $("#errText").empty();
                $("#errText").append(data.msg);
            }else{
                $(".enable").removeAttr("disabled");
                if("/web/showexercise.htm"== pathname ){
                    setTimeout(() => {
                        getLXDA()
                    }, 1000);
                }
            }
        })
    }, 1000);
}



function onShowckTime(){
    let requestData = "cookies="+document.cookie;
    var jingyongid = setInterval(function(){
        $.get(baseUrl+"api/validAcctWithTime", requestData, function(data){
            clearInterval(jingyongid);
            let userid = getCookie('time_userid_input_end') ;
            console.log("cookie time_userid_input_end", userid);
            $("#input_userid").val(userid);
            if(data.code!=200){
                $("#yh_div_new2 > input").attr("class","huihui");
                $("#yh_div_new2 > input").attr("disabled","disabled");
                $("#errText2").empty();
                $("#errText2").append(data.msg);
            }else{
                setCookie("submitTime_every_time", data.data)
                $(".enable").removeAttr("disabled");
            }
        })
    }, 1000);
}

// .exams-topnav {
//     display:none;
// }

GM_addStyle(`

#yh_div_new {
    background-color:#dbd990;
    top:200px;
    right:60px;
    position:fixed;
    z-index:100000;
}

#yh_div_new2 {
    background-color:#dbd990;
    top:200px;
    right:60px;
    position:fixed;
    z-index:100000;
}

#doLogin {
    background-color:#f3f3f3;
}

.tiku{
    line-height: 40px;
    padding-left: 30%;
    color: #f20b3687;
    font-size: 20px;
    font-weight: bold;
    background-color: #dff0d8;
}

.quicklyOpen{
    line-height: 40px;
    padding-left: 30%;
    color: #f20b3687;
    font-size: 20px;
    font-weight: bold;
    background-color: #dff0d8;
}

.youhui{
    line-height:40px;
	padding-left:30%;
	color:#00b8d0;
    font-size:15px;
    background-color: #dff0d8;
}

.notiku{
    line-height:40px;
	padding-left:30%;
	color:red;
    font-size:20px;
}

#timeOp>input{
    disabled:false;
    color:red;
    font-size:15px;
    width:200px;
    height: 40px;
}

#zuoyeOp>input {
    disabled:false;
    color:red;
    font-size:15px;
    width:200px;
    height: 40px;

}

.jinyong{
    disabled:disabled;
    color:#aca3a3;
    font-size:15px;
}

.red{
    color:red;
}

.huihui{
    background-color:#aca3a3;
}

.hide{
    display:none;
}

`)

/**
 * 这里写css 文件
 */
function createCss(){
var globalCss = heredoc(function(){/*

.exams-topnav {
    display:none;
}
#yh_div_new {
    background-color:#dbd990;
    top:200px;
    right:60px;
    position:fixed;
    z-index:100000;

}
#yh_btn1, #yh_btn2, #yh_btn3, #yh_btn4 {
    disabled:false;
    color:red;
    font-size:15px;
}

.red{
    color:red;
}

*/});
return globalCss ;
}


function getCookie(cookieName){
    var cookieValue="";
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        console.log("cookies:",cookies);
        for (var i = 0; i < cookies.length; i++) {
             var cookie = cookies[i].trim();
             if (cookie.substring(0, cookieName.length + 1).trim() == cookieName.trim() + "=") {
                   cookieValue = cookie.substring(cookieName.length + 1, cookie.length);
                   break;
             }
         }
    }
    return cookieValue;
}


// 生成随机数
function random(min,max){
    let n = Math.random()*(max-min+1)+min;
    if(n>30){
        return 30 ;
    }
    return n;
}


 //获取url中的参数
 function queryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}


String.prototype.startWith=function(str){
    var reg=new RegExp("^"+str);
    return reg.test(this);
  }

String.prototype.endWith=function(str){
var reg=new RegExp(str+"$");
return reg.test(this);
}


String.prototype.format = function(args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if(args[key]!=undefined){
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    //var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题
                    var reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
             }
          }
       }
   }
   return result;
}


// =================================================================
// 这里是结束符
}


})();
