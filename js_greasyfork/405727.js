// ==UserScript==
// @name         Beautiful OpenJudge
// @namespace    http://tampermonkey.net/
// @version      0.1.13
// @description  使用 BootStrap 库美化 OpenJudge
// @author       Guyutongxue
// @match        http://*.openjudge.cn/*
// @match        http://*.test.openjudge.org/*
// @exclude      http://*.openjudge.cn/admin/*
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery.form/4.3.0/jquery.form.min.js
// @downloadURL https://update.greasyfork.org/scripts/405727/Beautiful%20OpenJudge.user.js
// @updateURL https://update.greasyfork.org/scripts/405727/Beautiful%20OpenJudge.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Load BootStrap 4
    document.head.innerHTML += `<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/4.5.0/css/bootstrap.min.css">
<script src="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/4.5.0/js/bootstrap.min.js"></script>
<style>
/* Fix styles*/
/* Titles*/
h4{font-size:inherit;}
h2,h3{font-size:18px;}
h1,h2,h3{font-weight:bold;}
h1{font-size:2em}
/*Headers*/
#headerTop{background:initial;}
#headerTop a{color:initial;}
#userToolbar, #headerTop .logo {font-size: inherit;}
#headerTop #userToolbar .current a.link{background:initial;}
.practice-search button{background:#545b62;font-size:12px;width:25px;padding:0px;}
#groupBigLogo,#groupBigLogo img{max-width: 100%;height: auto;}
#pageTitle{padding-bottom:0px;border-bottom:0px;margin-bottom:0px;}
.wrapper{width:initial;margin:0 10%;}
.appli-group{height:auto;}
/*Contest title*/
.recently-update, .over-time{position:relative;}
.label h3, .current-contest h3{border-bottom:0;}
.group-setting{font-size:smaller;}
/*Tables*/
table{line-height:initial;font-size:smaller;}
.my-solutions td.result{line-height:2.5em;}
#problemsList table tr{font-size:inherit;line-height:inherit}
.my-solutions{font-size:smaller;}
.my-solutions .time{width:auto;}
.practice-info table tr td{padding:.5em;}
table th{font-weight:bold;}
table thead tr{background:initial;}
/*Personal Page*/
.recently-submit table td{padding:.3rem;}
.recently-submit .contest{width:auto;}
.all-group li{float:left; overflow: initial;}
.my-group-logo{margin-right:15px;}
/*Problem*/
.problem-content pre {margin-bottom:0;}
.problem-content dd {margin-bottom:0;}
</style>`;
    // Dealing with main header
    $("#headerTop").addClass('bg-light');
    $("#userToolbar").css('margin-bottom','0');
    $("#userToolbar").addClass('btn-group btn-group-sm');
    $("#userToolbar li").addClass('btn btn-sm btn-light');
    $(".account-list li").attr('class', 'btn btn-sm btn-link');
    $(".search-form").addClass('inline-form');
    $(".search-form input").addClass('form-control').attr('value','').attr('placeholder','题目ID, 标题, 描述');
    $("button").addClass('btn btn-secondary');
    $(".search-form button").html("&#10140;"); // right arrow

    // Dealing with main container
    $("#pagebody,#sitePagebody,#footer .wrapper").attr('class','container');
    $("#pagebody .wrapper,#sitePagebody .wrapper").attr('class','row mt-3');
    $(".col-2").removeClass('col-2').addClass('col-md-2');
    $(".col-3").removeClass('col-3').addClass('col-md-3');
    $(".col-4").removeClass('col-4').addClass('col-md-4');
    $(".col-8").removeClass('col-8').addClass('col-md-8');
    $(".col-9").removeClass('col-9').addClass('col-md-9');
    $(".col-10").removeClass('col-10').addClass('col-md-10');
    $(".problem-page").removeClass('problem-page');
    $(".problem-statistics").removeClass('problem-statistics');
    $(".problem-status").removeClass('problem-status');
    $(".problem-my-statistics").removeClass('problem-my-statistics');

    // Dealing with problem header
    $("#header").addClass("mb-4");

    // Group index page
    $(".contest-info").removeClass('contest-info').addClass('d-flex justify-content-lg-between flex-lg-row flex-column').css('border-bottom','1px dotted #666666');
    $(".recently-update").remove();
    $(".practice-info h3,.coming-contest h3,.past-contest h3").css('border-bottom','1px dotted #666666');
    // console.log($(".group-setting").children().text().replace(/\s+/g, ""));
    // If I'm in this group, then change it's style
    if($(".group-setting").children().text().replace(/\s+/g, "")!=""){
        $(".group-setting").html(`
<ul class="btn-group  btn-group-sm">
    ${$(".group-setting").text().includes("管理后台") ? '<a href="/admin/" class="btn btn-sm btn-outline-secondary">管理后台</a>' : ''}
    <a href="/mine/" class="btn btn-sm btn-outline-secondary">修改设定</a>
    <a href="javascript:void(0);" onclick="if (confirm('你确定要退出小组吗？')) api.leaveGroup(9,null,local.redirect);" class="btn btn-sm btn-danger">退出小组</a>
</ul>`).addClass('mt-3 mb-0');
    }

    // 夹带私货
    $("img[alt='软件设计实践']").attr("src", "https://s1.ax1x.com/2023/03/02/ppk9fGn.png");

    // Site index page fixing
    $(".row").children('p').addClass('col-md-12 alert alert-info');
    $(".row").children('p').each(function(){if($(this).text().replace(/\s+/g, "")=="")$(this).hide();}); // remove extra spaces
    $(".user-group,.my-group-contest").addClass("row");
    $(".recently-submit,.my-contest-list").addClass('col-md-10');

    // Alerts
    $(".notification").attr('class','alert alert-warning');
    $(".contest-description").attr('class','alert alert-info');
    $(".notice").attr('class','alert alert-danger');

    // Change top menu
    var tabs = $("#topMenu ul")
    tabs.addClass('nav nav-tabs');
    tabs.children('li').addClass('nav-item');
    $('.nav a').addClass('nav-link');
    $(".current-show").children().addClass('nav-link active');
    tabs.children('li').removeClass('current-show');
    $("#topMenu").addClass('col-md-12 mb-3 mt-2').removeAttr('id');

    // Change bottom menu
    tabs = $(".bottomMenu");
    tabs.addClass('pagination');
    tabs.children('li').addClass('page-item');
    $('.pagination a').addClass('page-link');
    $(".current-show").addClass('active');
    tabs.children('li').removeClass('current-show');

    // Change tables' style
    $("table").addClass('table table-sm table-hover table-responsive');
    $("#main,#contestStatistics,#problemStatus").children("table").wrapAll("<div class='row justify-content-center'><div class='col-auto'></div></div>");
    $(".practice-info table,#problemsList table,.recently-submit table").removeClass('table-responsive');
    $("thead tr td").replaceWith(function () {
        return $("<th />").append($(this).contents());
    });
    $("table thead").addClass('thead-light text-center');
    $(".practice-info table thead").removeClass('text-center');
    $("table td.accepted,table td.submissions,table td.code-length").css('min-width','5em');
    $("table td.title").css('min-width','15em');


    // Remove too long text
    $("td.class-name,td.className").each(function() {
        if ($(this).text().length > 10 && $(this).width() < 150) {
            $(this).attr('title',$(this).text());
            $(this).html($(this).text().replace(/\s+/g, "").substr(0, 10) + "...")
        }
    })

    // Change searching form
    $(".status-search form").addClass('form-inline justify-content-center');
    $(".status-query-params").addClass('row');
    $(".status-query-params input,.status-query-params select").addClass('form-control form-control-sm');
    $(".status-query-params button").addClass('btn-sm');

    // Change page bar
    var pageBar = $(".page-bar");
    if(pageBar.length > 0){
        pageBar.removeClass('page-bar');
        pageBar = pageBar.children('.pages').attr('class','pagination pagination-sm justify-content-center');
        pageBar.children().each(function(){
            if($(this).hasClass('current')){
                $(this).attr('class','page-link');
                $(this).wrapAll('<span class="page-item active"></span>');
            } else if ($(this).is('a')){
                $(this).attr('class','page-link');
                $(this).wrapAll('<span class="page-item"></span>');
            } else {
                $(this).attr('class','page-link');
                $(this).wrapAll('<span class="page-item disabled"></span>');
            }
        });
        // If it's a contest page, add pagigation in the top
        if($(".timeBar").length > 0) {
            $(".timeBar").after(pageBar.clone());
        }
    }

    var abbr = {
        "Accepted": "AC",
        "Wrong Answer": "WA",
        "Time Limit Exceeded": "TLE",
        "Memory Limit Exceeded": "MLE",
        "Output Limit Exceeded": "OLE",
        "Runtime Error": "RE",
        "Compile Error": "CE",
        "Presentation Error": "PE",
        "Waiting": "W.",
        "Problem Disabled": "PD",
        "Running And Judging": "R&J.",
        "System Error": "SE",
        "Validator Error": "VE"
    };

    var color = {
        "Accepted": "#52C41A",
        "Wrong Answer": "#E74C3C",
        "Presentation Error": "#00A497",
        "Time Limit Exceeded": "#052242",
        "Memory Limit Exceeded": "#052242",
        "Output Limit Exceeded": "#E74C3C",
        "Runtime Error": "#9D3DCF",
        "Compile Error": "#FADB14",
        "Waiting": "#14558F",
        "Problem Disabled": "#AAAAAA",
        "Running And Judging": "#14558F",
        "System Error":"#CC317C",
        "Validator Error": "#CC317C"
    }

    // Change solution's style
    if(/^\/[^\/]+\/solution\/\d+\/?$/.test(window.location.pathname)) {

        var result = $('.compile-status a').text();
        $('.compile-status a').remove();

        var memory = $('.compile-info dl dd:eq(3)').text();
        var time = $('.compile-info dl dd:eq(4)').text();

        var detail = result == "Compile Error" || result == "Waiting" ? "" : time +"/" + memory;

        var newStatus = "\
<div class='beautiful-status' title='" + result + "'>\
" + abbr[result] + "\
<div style='font-size:11px;'>" + detail + "</div>\
</div>";

        $('.compile-status').append(newStatus);

        $('.beautiful-status').css({
            "background-color": color[result],
            "height": "100px",
            "width": "100px",
            "margin-top": "20px",
            "display": "flex",
            "align-items": "center",
            "justify-content": "center",
            "flex-direction": "column",
            "color": "white",
            "font-size": "24px",
            "font-family": "-apple-system, BlinkMacSystemFont, 'San Francisco', 'Helvetica Neue', 'Noto Sans CJK SC', 'Noto Sans CJK', 'Source Han Sans', 'PingFang SC', 'Microsoft YaHei', sans-serif"
        });
    }

    // Change code's font
    if(/^\/[^\/]+\/[^\/]+\/submit\/?$/.test(window.location.pathname)) {
        $("textarea#source").css({
            "font-family": "Monaco, Menlo, 'Ubuntu Mono', Consolas, source-code-pro, monospace",
            "width": "100%"
        })
        // $("#submit").removeClass('col-md-9');
        $("#submit dt:eq(1)").text("语言");
        $("#submit form textarea").addClass('form-control');
        $("#main").width("100%");
        $(".submit-button").removeClass('btn-secondary').addClass('btn-primary');
    }
    $("pre,span.sh_string").css({
        "font-family": "Monaco, Menlo, 'Ubuntu Mono', Consolas, source-code-pro, monospace"
    })

    // Change question('clarify')'s style
    if(/^\/[^\/]+\/clarify(\/[^\/]*\/?)?$/.test(window.location.pathname) || /^\/mine\/?$/.test(window.location.pathname)) {
        $("#main form").addClass('form');
        $("#main form textarea,#main form :text").addClass("form-control").width("90%");
        $("#main form :text").height("auto");
    }

    // Change ranking style
    if(/^\/[^\/]+\/ranking\/?$/.test(window.location.pathname)) {
        let allData = $("td.alpha");
        for(let i = 0; i < allData.length; i++) {
            let text = allData.eq(i).html();
            if(text.indexOf("<a") != -1) continue;
            if(text.indexOf(":") != -1 ) { // If passed
                let res = '&#8730;';
                if(text.indexOf('<br>') != -1) {
                    res = "&#8730;" + text.split('<br>')[1];
                }
                allData.eq(i).html(res);
                allData.eq(i).css({
                    "background-color": "#dff0d890",
                    "color": "#3c763d"
                });
            } else if(text.indexOf('(-') != -1) { // Or not passed, but tried
                let res = text.split('<br>')[1];
                allData.eq(i).html(res);
                allData.eq(i).css({
                    "background-color": "#f2dede90",
                    "color": "#a94442"
                });
            }
        }

        $(document).ready(function(){
            // If too wide, add scrolling event
            if($('table')[0].scrollWidth > $('table').width()) {
                $('table').attr('id','scroll-horizontally');
                {
                    function scrollHorizontally(e) {
                        e = window.event || e;
                        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
                        document.getElementById('scroll-horizontally').scrollLeft -= (delta * 60);
                        e.preventDefault();
                    }
                    $('#scroll-horizontally').on('mousewheel',scrollHorizontally);
                }
            }
        });

    }

    // Change other status's style
    var otherResult = $('.result-wrong,.result-ce,.result-right,.result-pending');
    otherResult.css({
        "padding": "3px 6px",
        "color": "white",
        "border-radius": "2px",
        "font-style": "normal"
    });
    for(let i = 0; i < otherResult.length; i++) {
        let res = otherResult.eq(i).text();
        otherResult.eq(i).text(abbr[res]);
        otherResult.eq(i).attr('title',res);
        otherResult.eq(i).css({
            "background-color": color[res],
        });
    }
    $('.result').css('width','auto');


    // Change finish ratio's style
    function getColorByRatio(ratio){
        var one = (255+255) / 100;
        var r = 0;
        var g = 0;
        var b = 0;
        if (ratio < 50) {
            r = one * ratio;
            g = 255;
        }
        if (ratio >= 50) {
            g = 255 - ((ratio - 50 ) * one) ;
            r = 255;
        }
        r = parseInt(r);
        g = parseInt(g);
        b = parseInt(b);
        return "rgba(" + r + "," + g + "," + b + ",0.5)";
    }
    var ratios = $('.ratio');
    for(let i = 0; i < ratios.length; i++) {
        let value = parseInt(ratios.eq(i).text().replace('%',''));
        if (!isNaN(value)) {
            ratios.eq(i).css({'background-color':getColorByRatio(100 - value),'min-width':'4em'});
        }
    }

    // Change time bar
    if($('.timeBar').length > 0) {
        let startTime = new Date($(".start-time-dd").text());
        let endTime = new Date($(".end-time-dd").text());
        let currentState = $(".current-time").text();
        function formatDateTime(date) {
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            var d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            var h = date.getHours();
            h=h < 10 ? ('0' + h) : h;
            var minute = date.getMinutes();
            minute = minute < 10 ? ('0' + minute) : minute;
            var second=date.getSeconds();
            second=second < 10 ? ('0' + second) : second;
            return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
        };
        let newTime = `
<div class="row">
    <div class="col-md-3 text-left"><small>开始时间</small><br><b>${formatDateTime(startTime)}</b></div>
    <div class="col-md-6 text-center"><b>${currentState}</b><p><small id="currentTime"></small></p></div>
    <div class="col-md-3 text-right"><small>结束时间</small><br><b>${formatDateTime(endTime)}</b></div>
</div>`;
        $('.timeBar').append(newTime).addClass('mt-4 mb-4');
        $('.current-contest-info,.past-contest-info').remove();
        $('.timeBar').append('<p style="display:none;" id="timeclock"></p>');
        if(new Date() < endTime && new Date() > startTime){
            let total = endTime - startTime;
            let progress = `
<div class="progress">
<div class="progress-bar progress-bar-striped progress-bar-animated" id="timeProgressBar"
role="progressbar" style="width: 0%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
</div>
</div>`;
            $('.timeBar').append(progress);
            function updateValue(){
                var currentTime = new Date();
                var percent = (currentTime - startTime) * 100 / total;
                $("#timeProgressBar").attr({'style':'width:' + percent + '%','aria-valuenow':percent + ''});
                $("#currentTime").text(formatDateTime(currentTime));
            }
            updateValue();
            setInterval(updateValue,1000);
        }
    }

    // Change those old icon to unicode character
    var solvedIcon = $('.solved');
    for(let i = 0; i < solvedIcon.length; i++) {
        let html = solvedIcon.eq(i).html();
        if(html.indexOf('accepted') != -1) {
            solvedIcon.eq(i).html("<span style='color:green;font-weight:bold;'>&#8730;</span>");
        }
        else if(html.indexOf('wrong') != -1) {
            solvedIcon.eq(i).html("<span style='color:red;;font-weight:bold;'>&#215;</span>");
        }
    }

    // Change login page
    var loginForm = $("#main form[action='/api/auth/login/']");
    if(loginForm.length>0) {
        loginForm.parent().removeClass('col-md-8').addClass('col-md-12');
        loginForm.html(`
<style>
.form-signin {
width: 100%;
max-width: 330px;
padding: 15px;
margin: auto;
}
.form-signin .checkbox {
font-weight: 400;
}
.form-signin .form-control {
position: relative;
box-sizing: border-box;
height: auto;
padding: 10px;
font-size: 16px;
}
.form-signin .form-control:focus {
z-ind ex: 2;
}
.form-signin input[type="text"] {
margin-bottom: -1px;
border-bottom-right-radius: 0;
border-bottom-left-radius: 0;
}
.form-signin input[type="password"] {
margin-bottom: 10px;
border-top-left-radius: 0;
border-top-right-radius: 0;
}
</style>
<form action="/api/auth/login/" method="post" onsubmit="$(this).ajaxSubmit({dataType:'json',success:local.redirect,'target':'#result'}).find(':submit').each(function(){this.disabled=true;});return false;" class="form-signin">\
<input type="hidden" name="redirectUrl" value="">
<div class="login-message"></div>
<label for="email" class="sr-only">邮箱地址</label>
<input id="email" type="text" name="email" size="20" onfocus="this.select();" class="form-control" placeholder="邮箱地址">
<label for="password" class="sr-only">密码</label>
<input id="password" type="password" name="password" size="20" class="form-control" placeholder="密码">
<button type="submit" class="btn btn-block btn-primary mt-3">登入</button>
<div class="d-flex justify-content-between mt-3">
<p><a href="/register/">点此注册</a></p>
<p><a href="http://openjudge.cn/auth/forget/">忘记密码?</a></p>
</div>
</form>`);
    }

    // Change register style
    if(/^\/register\/?$/.test(window.location.pathname)) {
        var originalStyle = $('#pagebody .row,#sitePagebody .row').children('style').text();
        $('#pagebody .row,#sitePagebody .row').children('style').text(originalStyle.replace(/\.btn\s*\{[^}]*\}/,''));
        $('#pagebody .row,#sitePagebody .row').addClass('justify-content-center');
        $('#main').removeClass('col-md-10').addClass('col-md-4');
        $('#main form dd,form dt').remove();
        $('#main form').prepend(`
<div class="mb-3">
<label for="regEmail">Email地址</label>
<input id="regEmail" type="text" name="user_email" class="form-control">
</div>
<div class="mb-3">
<label for="regName">用户名</label>
<input id="regName" type="text" name="user_name" class="form-control">
</div>
<div class="mb-3">
<label for="regPasswd">密码</label>
<input id="regPasswd" type="password" name="user_passwd" class="form-control">
</div>
<div class="mb-3">
<label for="regPasswd2">确认密码</label>
<input id="regPasswd2" type="password" name="user_passwd2" class="form-control">
</div>`);
        $('#main form').append(`
<p id="wait" class="hide">正在加载验证码......</p>
<p id="notice" class="hide">请先拖动验证码到相应位置</p>
<button type="submit" class="mt-3 btn btn-block btn-primary btn-lg">注册</button>`);
    };
})();