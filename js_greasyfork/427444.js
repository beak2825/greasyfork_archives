// ==UserScript==
// @name         福建干部网络学院
// @namespace    http://tampermonkey.net/
// @version      1.3.1.0426a
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGlkPSJzdmcxMCIgaGVpZ2h0PSIzMCIgd2lkdGg9IjMwIiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0Ij48ZGVmcyBpZD0iZGVmczQiPjxzdHlsZSBpZD0ic3R5bGUyIi8+PC9kZWZzPjxwYXRoIGlkPSJwYXRoNiIgZmlsbD0iIzlkMmIyYiIgZD0iTTM0LjEzMyA1MTJhNDc3Ljg2NyA0NzcuNzk4IDAgMSAwIDk1NS43MzQgMCA0NzcuODY3IDQ3Ny43OTggMCAxIDAtOTU1LjczNCAweiIgc3Ryb2tlLXdpZHRoPSIuOTM0Ii8+PHBhdGggaWQ9InBhdGg4IiBmaWxsPSIjZmZmIiBkPSJNMjY4LjMxNiA1MTAuMjVsMTIxLjQwMiAxMjAuNzgtNDguMzg1IDQ4LjEzNi0xMjIuMjgxLTExOS45MDQtNDguMzg1LTQ4LjEzNyAxNjkuNzg3LTE2OC45MTYgNDkuMjY0IDQ4LjEzNnptNDg4LjI0OCAwTDYzNS4xNjIgNjMxLjAzbDQ4LjM4NCA0OC4xMzYgMTIxLjQwMi0xMjAuNzggNDguMzg1LTQ4LjEzNi0xNjguOTA3LTE2OC45MTctNDkuMjY0IDQ5LjAxMnpNNTE2LjM5OSAzNzguMDkyaDY4LjYxOEw1MTQuNjQgNjgyLjY2N2gtNjguNjE4eiIgc3Ryb2tlLXdpZHRoPSIxLjA0NSIvPjwvc3ZnPg==
// @description  一个用于 福建干部网络学院 的脚本。
// @author       酱油詩
// @license      MIT
// @match        *://*.fsa.gov.cn/*
// @require      https://cdn.staticfile.org/jquery/3.4.0/jquery.min.js
// @require      https://cdn.staticfile.org/jquery-cookie/1.4.1/jquery.cookie.min.js
// @require      https://cdn.staticfile.org/html2canvas/1.4.1/html2canvas.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427444/%E7%A6%8F%E5%BB%BA%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/427444/%E7%A6%8F%E5%BB%BA%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2.meta.js
// ==/UserScript==

/* globals jQuery, $, html2canvas, waitForKeyElements */

var loop;
var url = window.location.href;
console.log(url);

//if (! ($.cookie("gwx_mode"))) {
//    $.cookie("gwx_mode", "暂停学习")
//}

$().ready(function() {
    gwx_bar();
    gwx_main();
    //loop = setInterval(gwx_main, 1000);
});

function gwx_bar(){
    var gwx_css=$("<style>");
    gwx_css.append('.gwx_bar{position: fixed;z-index: 9;bottom: 0.2rem;left: 0.2rem;padding: 0.1rem;background: white;border-radius: 0.05rem;display: inline-block;}')
    gwx_css.append('.gwx_title{padding: 0.04rem;line-height: 0.12rem;font-size: 0.12rem;font-weight: 500;color: #000;border-radius: 0.1rem;display: inline-block;}')
    gwx_css.append('.gwx_item{padding: 0.04rem;line-height: 0.12rem;font-size: 0.12rem;font-weight: 500;color: #999;border-radius: 0.1rem;display: inline-block;}')
    gwx_css.append('.gwx_item:hover{color: #000;}')
    gwx_css.append('.gwx_item:active,.gwx_item.active{background-color: #ab0000;color: #fff;}')
    $("head").append(gwx_css);
    $("body").prepend($("<div>").addClass("gwx_bar"));
    $(".gwx_bar").append($("<div>").addClass("gwx_title").text("当前状态："));
    $(".gwx_bar").append($("<div>").addClass("gwx_item").attr("id","gwx_ztxx").text("暂停学习").click(gwx_ztxx_set));
    $(".gwx_bar").append($("<div>").addClass("gwx_item").attr("id","gwx_bxxx").text("必修学习").click(gwx_bxxx_set));
    $(".gwx_bar").append($("<div>").addClass("gwx_item").attr("id","gwx_xxxx").text("选修学习").click(gwx_xxxx_set));
    $(".gwx_bar").append($("<div>").addClass("gwx_item").attr("id","gwx_bcxx").text("班次学习").click(gwx_bcxx_set));
    var gwx_mode=$.cookie("gwx_mode");
    console.log(gwx_mode);
    if (gwx_mode=="bxxx"){
        $("#gwx_bxxx").addClass("active");
    }else if (gwx_mode=="xxxx"){
        $("#gwx_xxxx").addClass("active");
    }else if (gwx_mode=="bcxx"){
        $("#gwx_bcxx").addClass("active");
    }else{
        $("#gwx_ztxx").addClass("active");
    }
}

function gwx_main() {
    //页面判断
    if (url.indexOf("www.fsa.gov.cn/home") != -1) {
        //学习主页页面
        if($.cookie("gwx_mode") == "bcxx"){
            window.location.href = "/class?tab=first&tab2=0"
        }
    }else if (url.indexOf("www.fsa.gov.cn/course?id=0") != -1) {
        //必修页面
    }else if (url.indexOf("www.fsa.gov.cn/course?id=1") != -1) {
        //选修页面
    }else if (url.indexOf("www.fsa.gov.cn/class?tab=first&tab2=0") != -1) {
        //班次选课页面
        console.log("班次选课");
        if($.cookie("gwx_mode")=="bcxx"){
            if($.cookie("gwx_bcxx")==""){
                alert("请手动点击一次要学习的班次");
            }else{
                //跳转班级主页
                window.location.href = "/page1?shiftId=" + $.cookie("gwx_bcxx");
            }
        }
    }else if (url.indexOf("www.fsa.gov.cn/page1?shiftId=") != -1) {
        //班级主页页面
        console.log("班级主页");
        if($.cookie("gwx_mode") == "bcxx"){
            if($.cookie("gwx_bcxx") == ""){
                $.cookie("gwx_bcxx",window.location.href.match(/shiftId=\d+/)[0].match(/\d+/), {path:"/"});
                console.log($.cookie("gwx_bcxx"));
                window.location.href = "/page1?shiftId=" + $.cookie("gwx_bcxx");
            }else{
                /*跳转无法实现单页面操作，作废
                //跳转班级必修
                window.location.href = "/page2?shiftId=" + $.cookie("gwx_bcxx");
                */
                //使用xhr实现单页面
                xhr_bcxx(1);
                function xhr_bcxx(current){
                    var xhr = new XMLHttpRequest();
                    let url = "/api/study/compulsory/compulsoryCourses/findByShiftCourses";
                    xhr.open("POST", url, true);
                    xhr.setRequestHeader("Content-Type", "application/json");
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === 4 && xhr.status === 200) {
                            var json = JSON.parse(xhr.responseText);
                            console.log(json);
                            for(let i = 0;i < json.records.length;i++){
                                if(json.records[i].learnedProgress!="100%"){
                                    if(json.records[i].resource_type == "1"){
                                        window.location.href = "/video?id=" + json.records[i].courseware_id + "&mainplatformcoursewareId=" + json.records[i].mainplatformcoursewareId + "&platformcoursewaretypeId=" + json.records[i].platformcoursewaretypeId + "&shiftId=" + json.records[i].shift_id;
                                    }else if(json.records[i].resource_type == "2"){
                                        window.location.href = "/study-artical?id=" + json.records[i].courseware_id + "&mainplatformcoursewareId=" + json.records[i].mainplatformcoursewareId + "&platformcoursewaretypeId=" + json.records[i].platformcoursewaretypeId + "&shiftId=" + json.records[i].shift_id;
                                    }
                                    break;
                                }
                                if(i == json.records.length - 1 && json.current < json.pages){
                                    //console.log(json.records);
                                    xhr_bcxx(current+1);
                                }
                            }
                        }
                    };
                    var data = JSON.stringify({
                        "shiftId": $.cookie("gwx_bcxx"),
                        "studentId": $.cookie("studentId"),
                        "type": 0,
                        "size": 10,
                        "current": current
                    });
                    xhr.setRequestHeader("Authorization", $.cookie("wlxytk"));
                    xhr.setRequestHeader("refreshAuthorization", $.cookie("rt"));
                    xhr.send(data);
                }
            }
        }
    }/*else if (url.indexOf("www.fsa.gov.cn/page2?shiftId=") != -1) {
        //班级必修页面
        console.log("班级必修");
        if($.cookie("gwx_mode") == "bcxx"){
            if($.cookie("gwx_bcxx") == ""){
                gwx_ztxx_set();
                console.log("班次异常，已暂停");
            }else{
                // 创建一个MutationObserver对象来监听目标元素的样式变动
                var observer = new MutationObserver(function(mutationsList) {
                    for (var mutation of mutationsList) {
                        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                            // 当目标元素的class属性发生变动时执行相应的操作
                            if(mutation.target.style.display=="none"){
                                console.log(mutation);
                                for(let i = 1;i < $("table tr").length;i++){
                                    if($("table tr").eq(i).find("span").eq(1).text().trim()!="100.00%"){
                                        $("table tr").eq(i).find("span").eq(0).trigger("click");
                                        break;
                                    }
                                    //翻页
                                    if(i == $("table tr").length - 1){
                                        if(!$(".btn-next").disabled){
                                            $(".btn-next").click();
                                        }else{
                                            gwx_ztxx_set();
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
                // 监听目标元素的class属性变动
                observer.observe($(".el-loading-mask")[0], {
                    attributes: true
                });
            }
        }
    }*/else if(url.indexOf("/video?") != -1){
        //视频页面
        //
        gwx_video_main();
        function gwx_video_main(){
            if(document.querySelector(".kc-list")){
                var kcList=document.querySelectorAll(".kc-list .kc-info");
                for(let i=0;i<kcList.length;i++){
                    if(kcList[i].innerText.indexOf("进度：100") == -1){
                        console.log(kcList[i]);
                        if(kcList[i].childNodes[1].style.color=="rgb(0, 0, 0)"){
                            console.log(kcList[i]);
                            kcList[i].click();
                        }else{
                            if(document.querySelector("video")){
                                if($("video")[0].paused == true){
                                    $("video")[0].muted = true;
                                    $("video")[0].play();
                                }
                            }
                        }
                        setTimeout(gwx_video_main,5000);
                        return;
                    }
                }
                window.location.href = "/home";
            }
            setTimeout(gwx_video_main,5000);
        }
    }else if(url.indexOf("/study-artical?") != -1){
        //文章页面
        gwx_artical_main();
        function gwx_artical_main(){
            if(document.querySelector(".star-p")&&document.querySelector(".time")){
                var t1=document.querySelector(".star-p").innerText.match(/\d+/)[0];
                var t2=document.querySelector(".time").innerText.match(/\d+/g);
                if(t2[0]*3600+t2[1]*60+t2[2]*1>=t1*60){
                    var myevent = new MouseEvent('dblclick', {
                        'view': window,
                        'bubbles': true,
                        'cancelable': false
                    });
                    document.querySelector(".pages button").dispatchEvent(myevent);
                    //跳转班级主页
                    setTimeout(function(){window.location.href = "/page1?shiftId=" + $.cookie("gwx_bcxx");},3000)
                }
            }
            setTimeout(gwx_artical_main,10000);
        }
    }
    else{
        //其它页面
    }
}
/*var xhr = new XMLHttpRequest();
var url = "/api/study/compulsory/compulsoryCourses/findByShiftCourses";
xhr.open("POST", url, true);
xhr.setRequestHeader("Content-Type", "application/json");
xhr.onreadystatechange = function() {
	if (xhr.readyState === 4 && xhr.status === 200) {
		var json = JSON.parse(xhr.responseText);
		console.log(json);
	}
};
var data = JSON.stringify({
	"shiftId": "1752241804002607105",
	"studentId": "384195",
	"type": 0,
	"size": 10,
	"current": 1
});
xhr.setRequestHeader("Authorization", $.cookie("wlxytk"));
xhr.send(data);
$.post("/api/study/compulsory/compulsoryCourses/findByShiftCourses", {
		"shiftId": "1752241804002607105",
		"studentId": "384195",
		"type": 0,
		"size": 10,
		"current": 1
	},
	function(data, status) {
		alert("数据: \n" + data + "\n状态: " + status);
	}
);*/

function gwx_ztxx_set(){
    $(".gwx_bar .active").removeClass("active");
    $("#gwx_ztxx").addClass("active");
    $.cookie("gwx_mode", "ztxx", {path:"/"});
    $.cookie("gwx_bcxx","", {path:"/"});
}

function gwx_bxxx_set(){
    $(".gwx_bar .active").removeClass("active");
    $("#gwx_bxxx").addClass("active");
    $.cookie("gwx_mode", "bxxx", {path:"/"});
    console.log($.cookie("gwx_mode"));
    window.location.href = "https://www.fsa.gov.cn/course?id=0";
}

function gwx_xxxx_set(){
    $(".gwx_bar .active").removeClass("active");
    $("#gwx_xxxx").addClass("active");
    $.cookie("gwx_mode", "xxxx", {path:"/"});
    console.log($.cookie("gwx_mode"));
    window.location.href = "https://www.fsa.gov.cn/course?id=1";
}

function gwx_bcxx_set(){
    $(".gwx_bar .active").removeClass("active");
    $("#gwx_bcxx").addClass("active");
    $.cookie("gwx_mode", "bcxx", {path:"/"});
    $.cookie("gwx_bcxx","", {path:"/"});
    window.location.href = "https://www.fsa.gov.cn/class?tab=first&tab2=0";
}



function gwx_main2() {
    //页面判断
    if (url.indexOf("#/home?index=2") != -1) {
        //学习平台首页
        navplus();
        aspx_default_2018();
    } else if (url.indexOf("zxStudy_2018/class.aspx") != -1) {
        //班次首页
        navplus();
        aspx_class();
    } else if (url.indexOf("zxStudy_2018/class_course.aspx") != -1) {
        //班次课程页面
        navplus();
        aspx_class_course();
    } else if (url.indexOf("zxStudy_2018/study_General.aspx") != -1) {
        //播放页面
        navplus();
        aspx_study_General();
    } else if (url.indexOf("zxStudy_2018/read.aspx") != -1) {
        //阅读页面
        navplus();
        aspx_read();
    } else if (url.indexOf("showservice.aspx") != -1) {
        //温馨提示页面
        $(".note2:contains('此次打开的课件：') a").click();
    } else if (url.indexOf("/zxStudy_2018/prt_zsdy_ztb.aspx") != -1) {
        //班次结业证书页面
        navplus();
        //aspx_prt_zsdy_ztb();
        if ($("#navplus_title").text().indexOf("可自助打印") == -1) {
            $("#navplus .np_zs").click();
            $("#navplus .np_zs").show();
            $("#navplus .np_zs").click(function(){html2canvas($("div:contains('福建干部网络学院结证字')")[0]).then(function(canvas) {
                var data = canvas.toDataURL("image/png");
                var triggerDownload = $("<a>").attr("href", data).attr("download", $("b").eq(1).text()+$("div:contains('福建干部网络学院结证字')").eq(2).text().match(/[a-z]+[0-9]+/)+".png").appendTo("body");
                triggerDownload[0].click();
                triggerDownload.remove();});});
            $("#navplus .np_zs").click();
        }
    } else if (url.indexOf("zxStudy_2018/study_pass.aspx") != -1 || url.indexOf("zxHome/index.html") != -1) {
        //登录页面
        navplus();
        if ($("#navplus_title").text().indexOf("自动验码中") == -1) {
            $("#navplus .np_ym").click();
            $(".ulogin1_main,#nologin_main").click(function() {
                $("#txt_ulogin1_code,#wlxy_code").val($("#checkCode").text());
            })
        }
    }
}

function navplus_fun(e) {
    var item = e.currentTarget.className;
    switch (item) {
        case "np_bx":
            $("#navplus_title").text("必修学习中");
            $.cookie("np_mode", item);
            break;
        case "np_xx":
            $("#navplus_title").text("选修学习中");
            $.cookie("np_mode", item);
            break;
        case "np_bc":
            $("#navplus_title").text("班次学习中");
            $.cookie("np_mode", item);
            break;
        case "np_bx_bk":
            $("#navplus_title").text("必修学习中");
            $.cookie("np_mode", "np_bx");
            window.location.href = "https://www.fsa.gov.cn/zxStudy_2018/default_2018.aspx";
            break;
        case "np_xx_bk":
            $("#navplus_title").text("选修学习中");
            $.cookie("np_mode", "np_xx");
            window.location.href = "https://www.fsa.gov.cn/zxStudy_2018/default_2018.aspx";
            break;
        case "np_bc_bk":
            $("#navplus_title").text("班次学习中");
            $.cookie("np_mode", "np_bc");
            window.location.href = "https://www.fsa.gov.cn/zxStudy_2018/default_2018.aspx";
            break;
        case "np_ym":
            $("#navplus_title").text("自动验码中");
            //$.cookie("np_mode",item);
            break;
        case "np_zs":
            $("#navplus_title").text("可自助打印");
            //$.cookie("np_mode",item);
            break;
        case "np_zy":
            $("#navplus_title").text("自由活动中");
            $.cookie("np_mode", item);
            $.removeCookie("np_ztid");
            break;
        default:
            //
    }
    np_main();
}

function aspx_default_2018() {
    var np_mode = $.cookie("np_mode");
    var div_index_dt, i;
    switch (np_mode) {
        case "np_bx":
            $("#navplus_title").text("必修学习中");
            $("#navplus_item li").hide();
            $("#navplus_item .np_zy").show();
            if ($(".ndbxk.cur").length) {
                if ($("#bxkc .index_dt").length) {
                    div_index_dt = $(".index_dt");
                    for (i = 1; i < div_index_dt.length - 1; i++) {
                        if (np_find_percent(div_index_dt.eq(i).html()) < 100.00) {
                            window.location.href = div_index_dt.eq(i).find(".bt a").attr("href");
                            return;
                        }
                    }
                    if ($(".fenye:contains('下一页')").length) {
                        $(".fenye:contains('下一页')").click()
                    } else {
                        $.cookie("np_mode", "np_zy");
                        return;
                    }
                }
            } else {
                $(".ndbxk").click();
            }
            break;
        case "np_xx":
            $("#navplus_title").text("选修学习中");
            $("#navplus_item li").hide();
            $("#navplus_item .np_zy").show();
            if ($(".xxk.cur").length) {
                if ($("#wdsc .index_dt").length) {
                    div_index_dt = $(".index_dt");
                    for (i = 1; i < div_index_dt.length - 1; i++) {
                        if (np_find_percent(div_index_dt.eq(i).html()) < 100) {
                            window.location.href = div_index_dt.eq(i).find(".bt a").attr("href");
                            return;
                        }
                    }
                    if ($(".fenye:contains('下一页')").length) {
                        $(".fenye:contains('下一页')").click()
                    } else {
                        $.cookie("np_mode", "np_zy");
                        return;
                    }
                }
            } else {
                $(".xxk").click();
            }
            break;
        case "np_bc":
            $("#navplus_title").text("班次学习中");
            $("#navplus_item li").hide();
            $("#navplus_item .np_zy").show();
            if ($(".xxbc.cur").length) {
                if ($("#mypxb .index_dt").length) {
                    $("#mypxb .index_dt a").attr("target","_self")
                    $.cookie("np_mode", "np_bc_");
                    alert("请手动点击一次要学习的班次");
                }
            } else {
                $(".xxbc").click();
            }
            break;
        case "np_bc_bx":
            $("#navplus_title").text("班次学习中");
            $("#navplus_item li").hide();
            $("#navplus_item .np_zy").show();
            clearInterval(loop);
            window.location.href = "https://www.fsa.gov.cn/zxStudy_2018/class_course.aspx?pxb=" + $.cookie("np_ztid") + "&fl=0&pxjhlm=15";
            break;
        case "np_bc_xx":
            $("#navplus_title").text("班次学习中");
            $("#navplus_item li").hide();
            $("#navplus_item .np_zy").show();
            clearInterval(loop);
            window.location.href = "https://www.fsa.gov.cn/zxStudy_2018/class_course.aspx?pxb=" + $.cookie("np_ztid") + "&fl=0&pxjhlm=16";
            break;
        case "np_ym":
            $("#navplus_title").text("自动验码中");
            //$.cookie("np_mode",item);
            break;
        case "np_zs":
            $("#navplus_title").text("可自助打印");
            //$.cookie("np_mode",item);
            break;
        case "np_zy":
            $("#navplus_title").text("自由活动中");
            $("#navplus_item li").hide();
            $("#navplus .np_bx,.np_xx,.np_bc").show();
            break;
        default:
            console.log("Error")
    }
}

function aspx_study_General() {
    var np_mode = $.cookie("np_mode");
    var video_time, video_duration, video_percent, ctime, i;
    video_time = Number(np_second($("#showProgress").text().slice(0, 8)));
    video_duration = Number(np_second($("#showProgress").text().slice(-8)));
    video_percent = Number($("#dqjd").val());
    ctime = Number(window.ctime);
    if ($("#myplayer")[0].paused) {
        //视频未在播放
        switch (np_mode) {
            case "np_bx":
                $("#navplus_title").text("必修学习中");
                $("#navplus_item li").hide();
                $("#navplus_item .np_zy").show();
                if ($("#kcml li:contains('(正在播放)'):contains('[必修课]'):not(:contains('[进度：100.00%]'))").length) {
                    if (!$("#myplayer")[0].muted) {
                        $("#myplayer")[0].muted = true
                    }
                    if (video_duration <= 0) {
                        return;
                    }
                    $("#myplayer")[0].play();
                } else if ($("#kcml li:contains('[必修课]'):not(:contains('[进度：100.00%]'))").length) {
                    $("#kcml li:contains('[必修课]'):not(:contains('[进度：100.00%]')) a").eq(0).click();
                } else {
                    window.location.href = "https://www.fsa.gov.cn/zxStudy_2018/default_2018.aspx";
                }
                break;
            case "np_xx":
                $("#navplus_title").text("选修学习中");
                $("#navplus_item li").hide();
                $("#navplus_item .np_zy").show();
                if ($("#kcml li:contains('(正在播放)'):not(:contains('[进度：100.00%]'))").length) {
                    if (!$("#myplayer")[0].muted) {
                        $("#myplayer")[0].muted = true
                    }
                    if (video_duration <= 0) {
                        return;
                    }
                    $("#myplayer")[0].play();
                } else if ($("#kcml li:not(:contains('[进度：100.00%]'))").length) {
                    $("#kcml li:not(:contains('[进度：100.00%]')) a").eq(0).click();
                } else {
                    window.location.href = "https://www.fsa.gov.cn/zxStudy_2018/default_2018.aspx";
                }
                break;
            case "np_bc_bx":
            case "np_bc_xx":
                $("#navplus_title").text("班次学习中");
                $("#navplus_item li").hide();
                $("#navplus_item .np_zy").show();
                if ($("#kcml li:contains('(正在播放)'):not(:contains('[进度：100.00%]'))").length) {
                    if (!$("#myplayer")[0].muted) {
                        $("#myplayer")[0].muted = true
                    }
                    if (video_duration <= 0) {
                        return;
                    }
                    $("#myplayer")[0].play();
                } else if ($("#kcml li:not(:contains('[进度：100.00%]'))").length) {
                    $("#kcml li:not(:contains('[进度：100.00%]')) a").eq(0).click();
                } else {
                    window.location.href = "https://www.fsa.gov.cn/zxStudy_2018/default_2018.aspx";
                }
                break;
            case "np_zy":
                $("#navplus_title").text("自由活动中");
                $("#navplus_item li").hide();
                $("#navplus .np_bx_bk,.np_xx_bk,.np_bc_bk").show();
                break;
            default:
                console.log("Error")
        }
    } else {
        //视屏正在播放
        if (np_mode == "np_zy") {
            $("#myplayer")[0].pause();
            aspx_study_General();
        }
        if (video_duration <= 0 || ctime <= 0) {
            return;
        }
        if (video_percent == 100) {
            window.saveProgress(1, "windowclose");
            window.location.href = "https://www.fsa.gov.cn/zxStudy_2018/default_2018.aspx";
        }
        if (ctime % 60 == 0) {
            window.saveProgress(0, "", 0);
            console.log("视频已播放" + (video_time/video_duration * 100).toFixed(2) + "% 已保存" + ctime + "秒");
        }
    }
}

function aspx_class() {
    var np_mode = $.cookie("np_mode");
    var np_ztid = $.cookie("np_ztid");
    if (np_mode == "np_bc_") {
        $("#navplus_title").text("班次学习中");
        $("#navplus_item li").hide();
        $("#navplus_item .np_zy").show();
        np_ztid = location.href.match(/ztid=\d+/)[0].slice(5);
        $.cookie("np_ztid", np_ztid);
        $.cookie("np_mode", "np_bc_bx");
    }else if(np_mode == "np_bc_bx"){
        window.location.href = "https://www.fsa.gov.cn/zxStudy_2018/default_2018.aspx";
    }else if(np_mode == "np_zy"){
        $("#navplus_title").text("自由活动中");
        $("#navplus_item li").hide();
        $("#navplus .np_bx_bk,.np_xx_bk,.np_bc_bk").show();
    }
}

function aspx_class_course() {
    var np_mode = $.cookie("np_mode");
    var np_ztid = $.cookie("np_ztid");
    if (np_mode == "np_zy") {
        $("#navplus_title").text("自由活动中");
        $("#navplus_item li").hide();
        $("#navplus .np_bx_bk,.np_xx_bk,.np_bc_bk").show();
    }else{
        $("#navplus_title").text("班次学习中");
        $("#navplus_item li").hide();
        $("#navplus_item .np_zy").show();
        if (url.indexOf("pxjhlm=15") != -1) {
            //必修
            if ($(".list2 .index_dt").length) {
                for (let i = 0; i < $(".index_dt").length - 1; i++) {
                    if (np_find_percent($(".index_dt").eq(i).html()) < 100.00) {
                        window.location.href = $(".index_dt").eq(i).find(".bt11 a").attr("href");
                        return;
                    }
                }
                if ($("#DataTables_Table_0_next").length) {
                    $("#DataTables_Table_0_next").click()
                } else {
                    $.cookie("np_mode", "np_bc_xx");
                    console.log($.cookie("np_mode"))
                    window.location.href = "https://www.fsa.gov.cn/zxStudy_2018/default_2018.aspx";
                    return;
                }
            }
        } else if (url.indexOf("pxjhlm=16") != -1) {
            //选修
            if ($(".list2 .index_dt").length) {
                for (let i = 0; i < $(".index_dt").length - 1; i++) {
                    if (np_find_percent($(".index_dt").eq(i).html()) < 100.00) {
                        window.location.href = $(".index_dt").eq(i).find(".bt11 a").attr("href");
                        return;
                    }
                }
                if ($("#DataTables_Table_0_next").length) {
                    $("#DataTables_Table_0_next").click()
                } else {
                    $.cookie("np_mode", "np_zy");
                    $.cookie("np_ztid", "");
                    window.location.href = "https://www.fsa.gov.cn/zxStudy_2018/default_2018.aspx";
                    return;
                }
            }
        }
    }
}

function aspx_read() {
    var np_mode = $.cookie("np_mode");
    var timer = Number(window.timer);
    var time_need;
    if(!time_need){
        time_need = Number($("script").text().match(/var kcsc = "\d+";/)[0].match(/\d+/)[0]);
        time_need = time_need * 60;
    }
    if (np_mode == "np_zy") {
        $("#navplus_title").text("自由活动中");
        $("#navplus_item li").hide();
        $("#navplus .np_bx_bk,.np_xx_bk,.np_bc_bk").show();
    }else{
        $("#navplus_title").text("班次学习中");
        $("#navplus_item li").hide();
        $("#navplus_item .np_zy").show();
        if(window.timeListen){
            if (timer > time_need + 5) {
                //window.saveProgress(1, "windowclose");
                //window.saveProgress(0, "", 0);
                $("#timerClose").click();
                $("#timerClose").click();
                window.location.href = "https://www.fsa.gov.cn/zxStudy_2018/default_2018.aspx";
            } else {
                scrollBy(0, 100);
                window.pageTo('next');
            }
            if (timer % 60 == 0) {
                window.saveProgress(0, "", 0);
                console.log("文章已学习" + (timer/time_need * 100).toFixed(2) + "% 已保存" + timer + "秒");
            }
        }else{
            window.setTimeout("$(window).triggerHandler('focus');", 100);
        }
    }
}

function aspx_prt_zsdy_ztb() {

}

//创建按钮
function navplus(){
    if($("#navplus").length){
        return;
    }
    //添加CSS
    $("head").append(`<style type='text/css'>
    #navplus {
        background: #ffffff;
        font-family: '微软雅黑';
        position: fixed;
        z-index: 10086;
        top: 20px;
        left: 20px;
        border-radius: 5px;
        list-style: outside none none;
    }
    #navplus>li {
        background: #ffffff;
        margin: 3px;
        font-size: 15px;
        font-weight: bold;
        float: left;
    }
    #navplus li span {
        color: #fff;
        background: #9d2b2b;
        border: 1px solid #9d2b2b;
        border-radius: 5px;
        width: 102px;
        padding: 10px 15px 10px 15px;
        text-align: center;
        display: block !important;
    }
    #navplus li a {
        height: 40px;
        line-height: 40px;
    }
    #navplus li img {
        height: 16px;
        width: 16px;
        margin: 12px 10px auto 0px;
        float: left;
    }
    #navplus li ul {
        width: 120px;
        padding-left: 10px;
        float: left;
        display: block;
        overflow: visible;
        list-style: outside none none;
    }
    #navplus li ul .cur {
        background: #ddd;
        border-radius: 5px;
        border: 1px solid #ddd;
        cursor: pointer;
        font-size: 16px;
        color: rgb(204, 1, 4);
    }
    #navplus li ul li {
        background: rgb(240, 240, 240);
        color: rgb(6, 52, 83);
        border: 1px solid rgb(240, 240, 240);
        border-radius: 5px;
        margin: 3px auto auto 12px;
        font-size: 14px;
        height: 40px;
        line-height: 40px;
        float: left;
        width: 100px;
        font-weight: bold;
        padding-left: 10px;
        cursor: pointer;
        position: relative;
        overflow: visible;
    }
    #navplus li ul li:hover {
        background: #ddd;
        border-radius: 5px;
        color: rgb(204, 1, 4);
        border: 1px solid #ddd;
        font-weight: normal;
        cursor: pointer;
        font-size: 16px;
    }
    #navplus li ul li .b-line {
        display: block;
        border: 1px dashed #aa2d2d;
        border-radius: 0 5px;
        border-style: none none dashed dashed;
        position: absolute;
        width: 18px;
        height: 45px;
        top: -25px;
        left: -23px;
    }
    </style>`);
    //添加HTML
    $("body").append(`
    <ul id="navplus">
        <li id="navplus_logo">
            <span style="padding: 0px;width: auto;"><svg xmlns="http://www.w3.org/2000/svg" id="svg10" height="40" width="40" viewBox="0 0 1024 1024"><defs id="defs4"><style id="style2"/></defs><path id="path6" fill="#9d2b2b" d="M34.13299999999998 512a477.867 477.798 0 1 0 955.734 0 477.867 477.798 0 1 0-955.734 0z" stroke-width=".934"/><path id="path8" fill="#fff" d="M268.316 510.25l121.402 120.78-48.385 48.136-122.281-119.904-48.385-48.137 169.787-168.916 49.264 48.136zm488.248 0L635.162 631.03l48.384 48.136 121.402-120.78 48.385-48.136-168.907-168.917-49.264 49.012zM516.399 378.092h68.618L514.64 682.667h-68.618z" stroke-width="1.045"/></svg></span>
        </li>
        <li id="navplus_item">
            <span id="navplus_title">Hello World</span>
            <ul>
                <li class="np_bx" style="display: none;"><div class="b-line"></div><img src="https://www.fsa.gov.cn/zxStudy_2018/img/2016/icons/ndbx.png" alt="">必修学习</li>
                <li class="np_xx" style="display: none;"><div class="b-line"></div><img src="https://www.fsa.gov.cn/zxStudy_2018/img/2016/icons/xxk.png" alt="">选修学习</li>
                <li class="np_bc" style="display: none;"><div class="b-line"></div><img src="https://www.fsa.gov.cn/zxStudy_2018/img/2016/icons/xxbc.png" alt="">班次学习</li>
                <li class="np_bx_bk" style="display: none;"><div class="b-line"></div><img src="https://www.fsa.gov.cn/zxStudy_2018/img/2016/icons/ndbx.png" alt="">必修学习</li>
                <li class="np_xx_bk" style="display: none;"><div class="b-line"></div><img src="https://www.fsa.gov.cn/zxStudy_2018/img/2016/icons/xxk.png" alt="">选修学习</li>
                <li class="np_bc_bk" style="display: none;"><div class="b-line"></div><img src="https://www.fsa.gov.cn/zxStudy_2018/img/2016/icons/xxbc.png" alt="">班次学习</li>
                <li class="np_zy" style="display: none;"><div class="b-line"></div><img src="https://www.fsa.gov.cn/zxStudy_2018/img/2016/icons/xxjl.png" alt="">自由活动</li>
                <li class="np_ym" style="display: none;"><div class="b-line"></div><img src="https://www.fsa.gov.cn/zxStudy_2018/img/2016/icons/xgmm.png" alt="">自动验码</li>
                <li class="np_zs" style="display: none;"><div class="b-line"></div><img src="https://www.fsa.gov.cn/zxStudy_2018/img/2016/icons/tjkc.png" alt="">证书打印</li>
            </ul>
        </li>
    </ul>`);
    $("#navplus_item li").click(navplus_fun);
    //设置页面显示效果
    $("#navplus_item").hide();
    $("#navplus_logo").click(function(){
        $("#navplus_logo").hide();
        $("#navplus_item").show();
        //console.log(location);
    });
    $("#navplus").mouseleave(function(){
        $("#navplus_item").hide();
        $("#navplus_logo").show();
    });
}

    //------查找百分比------
    function np_find_percent(text) {
        text = text.replace(/[进度：\[\]]+/g, "");
        text = text.match(/>\d+.\d\d%</)[0];
        text = text.replace(/[>%<]+/g, "");
        return text;
    }

    //------时间化秒------
    function np_second(time) {
        var h = time.split(':')[0];
        var m = time.split(':')[1];
        var s = time.split(':')[2];
        return Number(h) * 3600 + Number(m) * 60 + Number(s);
    }
