// ==UserScript==
// @name           吾爱增强美化
// @version        2021.9.26
// @author         MarsTLBAD
// @description    精简美化
// @match          *://www.52pojie.cn/*
// @icon           https://www.52pojie.cn/favicon.ico
// @grant          GM_registerMenuCommand
// @grant          GM_unregisterMenuCommand
// @grant          GM_openInTab
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_notification
// @license        GPL-3.0 License
// @run-at         document-start
// @namespace      https://greasyfork.org/scripts/412681
// @downloadURL https://update.greasyfork.org/scripts/430865/%E5%90%BE%E7%88%B1%E5%A2%9E%E5%BC%BA%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/430865/%E5%90%BE%E7%88%B1%E5%A2%9E%E5%BC%BA%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var menu_ALL = [
    ['menu_rule', '隐藏版规', '隐藏版规', false]
    ], menu_ID = [];
    for (let i=0;i<menu_ALL.length;i++){ // 如果读取到的值为 null 就写入默认值
        if (GM_getValue(menu_ALL[i][0]) == null){GM_setValue(menu_ALL[i][0], menu_ALL[i][3])};
    }
    registerMenuCommand();
    addStyle();

    // 注册脚本菜单
    function registerMenuCommand() {
        if (menu_ID.length > menu_ALL.length){ // 如果菜单ID数组多于菜单数组，说明不是首次添加菜单，需要卸载所有脚本菜单
            for (let i=0;i<menu_ID.length;i++){
                GM_unregisterMenuCommand(menu_ID[i]);
            }
        }
        for (let i=0;i<menu_ALL.length;i++){ // 循环注册脚本菜单
            menu_ALL[i][3] = GM_getValue(menu_ALL[i][0]);
             menu_ID[i] = GM_registerMenuCommand(`${menu_ALL[i][3]?'✅':'❌'} ${menu_ALL[i][1]}`, function(){menu_switch(`${menu_ALL[i][3]}`,`${menu_ALL[i][0]}`,`${menu_ALL[i][2]}`)});
        }
        menu_ID[menu_ID.length] = GM_registerMenuCommand('💬 反馈 & 建议', function () {window.GM_openInTab('https://github.com/XIU2/UserScript#xiu2userscript', {active: true,insert: true,setParent: true});window.GM_openInTab('https://greasyfork.org/zh-CN/scripts/412681/feedback', {active: true,insert: true,setParent: true});});
    }

    // 菜单开关
    function menu_switch(menu_status, Name, Tips) {
        if (menu_status == 'true'){
            GM_setValue(`${Name}`, false);
            GM_notification({text: `已关闭 [${Tips}] 功能\n（刷新网页后生效）`, timeout: 3500});
        }else{
            GM_setValue(`${Name}`, true);
            GM_notification({text: `已开启 [${Tips}] 功能\n（刷新网页后生效）`, timeout: 3500});
        }
        registerMenuCommand(); // 重新注册脚本菜单
    };

    // 返回菜单值
    function menu_value(menuName) {
        for (let menu of menu_ALL) {
            if (menu[0] == menuName) {
                return menu[3]
            }
        }
    }

    let url = window.location.href;

    // 高级搜索按发布时间排序
    if (url.indexOf('/www.52pojie.cn/search') != -1) {
        document.getElementById('orderby1').options[1].selected = true;
    }

    // 去除置顶
    //if (urlMatch('forum-41-') || urlMatch('forum-50-') || urlMatch('forum-8-') || urlMatch('forum-10-') || urlMatch('forum-10-')) {
        document.querySelector("#threadlisttableid").children[0].remove();
        let aList = document.querySelectorAll("#threadlisttableid tr > td.icn > a");
        for (let i = aList.length - 1; i > -1; i--) {
            let a = aList[i];
            if (a.getAttribute('title').indexOf('全局置顶主题') != -1) {
                a.closest('tbody').remove();
            }
        }
    //}

    function addStyle() {
        let style,
        style_1 = `.bml {display:none !important;}`,
        style_2 = `
        #postlist .zoom, #postlist .plc .tattl img {
            max-height: 600px !important;
            width: auto !important;
            box-shadow: 0px 0px 3px #444444;// 设置文章图片阴影，避免某些白底图片无法看清边界
        }
        
        a[href="connect.php?mod=config"], #toptb, #navmenu, #nv_ph, #nv, #pt .y, #chart, #ft, #custominfo_pmenu, #loadad2, #aswift_0, .aimg_tip, .wp a_f hm, .bm.lk, .bm.bmw.fl, .dnch_eo_pt, .dnch_eo_pr, .dnch_eo_mu, .dnch_eo_f, ul.xl.xl2.o.cl, dl.pil.cl, td.plc.plm, .dnch_eo_pb, .dnch_eo_pt, .pls .avatar img, .pls .side-star, .pls .side-group, .res-footer-note, .scbar_hot_td, .md_ctrl, .pls.favatar .xg1 {
            display:none !important;
        }

        @media (min-width:1366px) {
            #postlist .favatar.pls .avatar img {
                margin:0 0 2px;
            }
            .wp {
                width: 92%;
            }
            .pls .avatar img {
                width:100px;
                height:100px;
                //background:none;
                padding:0;
                border:4px solid #ffffff
            }
            .avtm img {
                width:60px;
            }
        }
        .pls .avatar {
            text-align:center;
        }
        .t_fsz {
            min-height:15px;
        }
        .pls .pi {
            text-align:center;
            padding:10px 0 0 0;
            border:none;
            overflow:visible;
        }
        .xw1 {
            font-size:15px;
        }
        textarea#fastpostmessage {
            background:none !important;
        }
        .pcb img {
            max-width:60%;
            margin:4px;
        }
        .rate {
            margin:0;
        }
        .ratl td {
            padding:0px;
        }
        .xw1 {
            font-size:12px;
            font-weight:500;
        }
        .xi2,.xi2 a,.xi3 a {
            color:red;
        }
        .toptitle_7ree td {
            border-top: 1px solid #CDCDCD;
        }
        .mtw {
            margin-top:0px !important;
        }

        #p_btn {
            padding:0px;
            margin:0 0 0 1px;
            display:flex;
            justify-content:space-evenly;
        }
        #scbar {
            border-top:0;
            border-bottom:0;
            background:0;
        }

        /* 链接点击后颜色变浅（灰白色）*/
        .tl th a:visited, .tl td.fn a:visited {
            color: #aaa;
        }`;

        //style_Add = document.createElement('style');
        style = style_2
        if (menu_value('menu_rule')) style += style_1;
        /*
        style_Add.innerHTML = style;
        if (document.head) {
            document.head.appendChild(style_Add);
        } else {
            let timer = setInterval(function(){
                if (document.head) {
                    document.head.appendChild(style_Add);
                    clearInterval(timer);
                }
            }, 1);
        }
        */
        document.lastChild.appendChild(document.createElement("style")).textContent = style;
    }
})();