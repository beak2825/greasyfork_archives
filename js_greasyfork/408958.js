// ==UserScript==
// @name         HNUST 新版教务 Material Design 化
// @namespace    https://jakting.com/archives/hnust-mdui.html
// @version      0.2
// @description  辣鸡强智！
// @author       hjthjthjt
// @match        http://kdjw.hnust.edu.cn/*
// @match        http://xxjw.hnust.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408958/HNUST%20%E6%96%B0%E7%89%88%E6%95%99%E5%8A%A1%20Material%20Design%20%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/408958/HNUST%20%E6%96%B0%E7%89%88%E6%95%99%E5%8A%A1%20Material%20Design%20%E5%8C%96.meta.js
// ==/UserScript==

/*
更新日志：
1. 修复侧栏文字错位
2. 适配潇湘学院
*/

(function() {
    'use strict';
    var color = "mdui-color-blue-grey-800";
    var colorNav = "mdui-color-blue-grey";
    var colorBackground = "mdui-color-blue-grey-50";
    //全局
    $("body").append("<script src='https://cdn.bootcdn.net/ajax/libs/mdui/1.0.0/js/mdui.min.js'></script><style>@import url('https://cdn.bootcdn.net/ajax/libs/mdui/1.0.0/css/mdui.min.css');.edu-bg-balck .lsm-expand-btn {background-color: #37474f!important;}.submenu a:hover, .submenu a.active {background: linear-gradient(90deg,#90a0aa 0%,rgba(59,130,255,0) 100%)!important;border-left-color: #3e5967!important;}.submenu a{background-color: #0b1317!important;}{background-color: #0b1317!important;}.open .submenu li div {background-color: #102027!important;}.accordion .link{height: 50px!important;line-height: 20px!important;}.navBar-right>div{background-color:transparent!important;}html{background-color:none!important;}.Nsb_r_list_thb{width:auto!important;}.mdui-tab{margin-bottom:20px!important;}select{z-index:999!important;}.breadcrumbs a,.icon-close01{color:rgba(255,255,255,.5)!important;}.breadcrumbs .current,.current .icon-close01{color:#eceff1!important;}.breadcrumbs a.current{background:none!important;}.edu-badge i {font-size:24px!important;color: #fff!important;}.personal-center{margin: 0!important;}.personal-left-item{margin-left:24px!important;width: 55%!important;}.personal-right-item{width: 41%!important;}.accordion .link{padding: 18px 15px 15px 60px;!important}.edu-logo{margin-top:10px!important;display:block!important;padding:8px 0 8px 15px!important}.edu-logo div{height:60px!important;width:170px!important;background-size:100%!important}.edu-header{height:auto!important}.edu-sideMenu{margin-top:10px!important}</style>");
    $("body").addClass(colorBackground); //我的桌面
    $("select").addClass("mdui-select");
    $("input").addClass("mdui-textfield-input");
    $("button").addClass("mdui-btn").addClass("mdui-btn-raised");
    width = 700;
    /**
    * 侧边栏
    */
    $(".edu-aside").addClass(color).addClass("mdui-shadow-24"); //主背景
    $(".edu-bg-balck .accordion").addClass(color); //列表背景
    $(".edu-bg-balck .accordion>li>.link").addClass(color); //列表文字
    //列表图标
    $(".link .icon-xitongguanli").replaceWith('<i class="mdui-icon material-icons">home</i>'); //我的桌面
    $(".link .icon-chengjiguanli").replaceWith('<i class="mdui-icon material-icons">assignment</i>'); //学籍成绩
    $(".link .icon-biyeguanli").replaceWith('<i class="mdui-icon material-icons">person_pin</i>'); //培养管理
    $(".link .icon-peiyangfangan").replaceWith('<i class="mdui-icon material-icons">create</i>'); //考试报名
    $(".link .icon-zhuanjiazhandian").replaceWith('<i class="mdui-icon material-icons">gavel</i>'); //实践环节
    $(".link .icon-yuanxipinggu").replaceWith('<i class="mdui-icon material-icons">school</i>'); //教学评价
    $(".link .jiaoliushengguanli").replaceWith('<i class="mdui-icon material-icons">record_voice_over</i>'); //交流申请
    /**
    * 网站主体（嵌套）
    */
    $("#Frame0").attr('frameborder',0);
    //顶部条
    $(".edu-navBar").addClass(colorNav).addClass("mdui-shadow-3");
    $(".icon-tab-left").replaceWith('<i class="mdui-icon material-icons" id="scrollLeft">chevron_left</i>'); //不过这两个按钮好像不起作用
    $(".icon-tab-right").replaceWith('<i class="mdui-icon material-icons" id="scrollRight">chevron_right</i>'); //不过这两个按钮好像不起作用
    $(".icon-alarm").replaceWith('<i class="mdui-icon material-icons" onclick="showMenuErji_menu(\'PTWH\',\'/ggly/xxtz_query\',\'消息通知\',3)">notifications</i>'); //消息通知图标
    //卡片
    $(".personal-common").addClass("mdui-card")
    //页面主标题
    var pageTitle = $(".Nsb_layout_r .title").text();
    $(".Nsb_layout_r .title").replaceWith('<div class="mdui-tab" mdui-tab><a class="mdui-ripple mdui-tab-active">'+pageTitle+'</a></div>');
    //表格
    $('.layui-table').addClass('mdui-table').addClass('mdui-table-hoverable').removeClass('layui-table');

})();