// ==UserScript==
// @name         GW论坛黑色模式
// @namespace    https://github.com/CMSSserver/GW_Black
// @namespace    https://greasyfork.org/zh-CN/scripts/454126-gw%E8%AE%BA%E5%9D%9B%E9%BB%91%E8%89%B2%E6%A8%A1%E5%BC%8F
// @version      v0.1.3-beta
// @description  Giantess Waltz论坛模板模黑色样式の油猴脚本
// @author       CMSSserver
// @match        https://giantesswaltz.org/*
// @icon         https://giantesswaltz.org/favicon.ico
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/454126/GW%E8%AE%BA%E5%9D%9B%E9%BB%91%E8%89%B2%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/454126/GW%E8%AE%BA%E5%9D%9B%E9%BB%91%E8%89%B2%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //将论坛背景图不显示并且设置为自定义
    //这里的网页背景使用的是GW的远程附件（不知道电话设置的链接过期时间是多少/悲）
    //在此感谢Pixiv画师“浜野星夢”！（https://www.pixiv.net/users/16712014）图像ID：82706082（相关授权问题依据作者个人简介表明只要说明来源出处即可！）
    GM_addStyle(`
        .slst {
            width: 100%;
        }
        body {
            background: transparent no-repeat 50% 0 !important;
        }
        html{
            background: url(https://www.gtsproject.org/waltz/attachment/forum/202211/02/131427md6gxzrefqxdabnd.jpg);
            background-repeat:no-repeat;
            margin:0px;
            background-size:100% 100%;
            background-attachment:fixed;
        }
        .ctodayposts{
            background:black;
        }
    `)
    //让主页的消息数背景为黑色

        //！！下面的内容没有注释！！

    GM_addStyle(`
        .cpost{
            background:black;
        }
        .ttp .a a, .ttp .a a:hover, .ttp a:hover{
            background:black ;
        }
        .ttp .num{
            background:black;
        }
        .pg a, .pg strong, .pgb a, .pg label{
            background-color:black;
        }
        .cscrolltop .child{
            background:black;
        }
        .pg strong{
            color:#fff;
        }
        .acpost{
            background:black;
        }
        .tbn li.a{
            border-left:5px solid black;
        }
        .tb .a a, .tb .current a, .tbmu .a{
            background:black;
        }
        .bm_h h2{
            border-left-color:black;
        }
        }
        #threadlist{
            border-top-color:black;
        }
        .c_nv {
            background-color: black;
        }
        .fl .bm_h{
            border-bottom:1px solid black;
        }
        .fl_icn_t{
            background:black;
        }
        .t_l, .t_c, .t_r, .m_l, .m_r, .b_l, .b_c, .b_r{
            background:black;
        }
        #threadlist {
            border-top-color: black;
        }
        `)

        //！！没注释结束！！

    GM_addStyle(`
        .cft{
            border-top-color:black;
        }
        #ft a:hover {
           color: black;
        }
    `)//页脚问题修复

    GM_addStyle(`
        .egg_div {
            background-color: #ffffffcc;
        }
        .vrd_div {
            height: 400px !important;
            background-color: #ffffffcc;
        }
    `)//砸金蛋优化

    GM_addStyle(`
        .c_scbar_type li:hover {
            background: gray;
        }
        .c_scbar_type li {
            background: black;
        }
    `)//不在搜索页面的时候（即为弹窗的时候）让它弹窗的一堆东西弄一下

    GM_addStyle(`
        .p_pop a:hover{
            background: black;
        }
    `)//下拉框鼠标移动到即为黑色

    GM_addStyle(`
        #pt {
            background: url(https://giantesswaltz.org/./template/the_c_style/images/tmbg/white_80.png);
            border-radius: 5px;
        }
    `)//版块页面上方导航添加白底+圆滑角度

    //以下非必须要求：

    GM_addStyle(`
        .pob .cmmnt i {
            color: black;
        }
        .pob .fastre i {
            color: black;
        }
        .pob .report i {
            color: black;
        }
        .pob .editp i {
            color: black;
        }
        .psth, .cm .psth {
            background-image: url(https://www.gtsproject.org/waltz/attachment/forum/202211/02/165648oa01bg21nfg1c7kn.png) !important;
        }
        .icon_ring:hover {
            background: gray !important;
        }

    `)//帖子页面点评+回复+举报黑色+点评和赠礼黑色+移动到点上变灰
    GM_addStyle(`
        #uhd .s_nav li .fa {
            color: black !important;
        }
    `)//用户页面黑色
    GM_addStyle(`
        .cico2 .fa-angle-double-up{
            color:black;
        }
        .cico2 .fa-angle-double-down{
            color:black;
        }
        .fa_fav i {
            color: black;
        }
    `)//论坛版块上升/下降箭头+喜欢变黑

    GM_addStyle(`
        .p_pop {
            border-top-color: black !important;
        }
    `)//没加注释不知道这是干什么的了……

    GM_addStyle(`
        .c_cp_icon em {
        background: black;
    }
    `)//修改新提醒红点

    GM_addStyle(`
        .my_lv .jdt p {
            background: url(https://www.gtsproject.org/waltz/attachment/forum/202211/02/190748k5nn56vnacocgo7v.gif);
        }
    `)//用户等级进度条（在右上角个人头像那里）

    GM_addStyle(`
        .c_cp_icon a:hover i {
            color: black;
        }
    `)//置顶导航栏鼠标移动到上方按钮变黑色

    GM_addStyle(`
        .cmy_main {
            border-top-color:black;
        }
    `)//右上角头像框横条黑色

    GM_addStyle(`
        .c_ttp li i {
            background: black;
        }
    `)//导读选中后下方的橘色横条变成黑色

    /*.my_main .sub .i_ext {
        background-image: url(？？？);
    }
    .my_main .sub .i_moy {
        background-image: url(？？？);
    }修改图片失败（因为不支持http……）*/

    //这里是搜索LOGO+搜索模板重新修改的地方，如果要修改模板Style，以下内容请勿添加！！

    let nv_search = document.querySelector("#nv_search");
    if(nv_search !== null){
        GM_addStyle(`
        #ct {
            background: #ffffffcc;
        }
        #nv_search #ft {
            background: #ffffffcc;
            margin: 0 20px;
        }
        .p_pop a:hover{
            background: black;
        }
        .pbw p {
            background: #ffffffcc;
        }
        .xs3 {
            background: #ffffffcc;
        }
    `)
    }//如果在搜索页面的相关优化
    GM_addStyle(`
        .sign {
            background: url(https://www.gtsproject.org/waltz/attachment/forum/202211/03/163243f770fm4hofwskkhk.gif) no-repeat 0 0;
        }
    `)//个人签名设置



    GM_addStyle(`
        #uhd .s_nav li em {
            background: black;
        }
        #uhd .s_nav li.a, #uhd .s_nav li.a a, #uhd .s_nav li a:hover, #uhd .flw_hd .sub a:hover, #uhd .flw_hd .sub a:hover .t {
            color: #AAAAAA;
        }
        .c_threadlist li:hover .cur {
            background: url(https://www.gtsproject.org/waltz/attachment/forum/202211/04/110659d9vu2vpcrfpdk5ch.png);
        }
        .c_threadlist li .sub a:hover, .c_threadlist li .tit a:hover, .c_threadlist .cli_reply a:hover {
            color: black;
        }
        .c_threadlist li .tit a {
            color: #7e7e7e;
        }
    `)//个人主页的主题……按钮设置+移动到上方横条变黑+移动到点上的时候是灰点+默认的主题下帖子标题默认灰色，移到上方是黑色

    let sc_img2 = document.querySelector("#scform > tbody > tr > td > h1 > a > img");//定义二级搜索页面LOGO
    if(sc_img2 !== null){
        sc_img2.setAttribute("src","/template/the_c_style/images/logo7.png");//修改二级SC_LOGO
    }

    let sc_img = document.querySelector("#ct > div > form > div > h1 > a > img");//定义SC_Logo
    if(sc_img !== null){
        sc_img.setAttribute("src","/template/the_c_style/images/logo7.png");//修改一级SC_LOGO
    }


    //需要添加if
    let dwj_list_tip = document.querySelector("#dwj_list_tip");
    if (dwj_list_tip !== null){
        document.querySelector("#dwj_list_tip").style.background = 'black' ;//夜月杯活动的鼠标移到此处的背景颜色修改
    }

    let cbanner = document.querySelector("#wp > div.boardnav > div.bm.cbm_box > div.cbanner");
    if(cbanner !== null){
        let cbanner_img = document.querySelector("#wp > div.boardnav > div.bm.cbm_box > div.cbanner").style.backgroundImage;
        if(cbanner_img == 'url("./template/the_c_style/images/banner.jpg")'){
            document.querySelector("#wp > div.boardnav > div.bm.cbm_box > div.cbanner").style.backgroundImage = 'url(https://www.gtsproject.org/waltz/attachment/forum/202211/03/105424x7wqwlidly7uwybo.jpg)';
        }//版块简介大头贴
    }



    let person_home_page = document.querySelector("#ct > div > div.bm.bw0 > div > div.bm_c.u_profile > div:nth-child(1) > h2 > img");
    if (person_home_page !== null){
        document.querySelector("#ct > div > div.bm.bw0 > div > div.bm_c.u_profile > div:nth-child(1) > h2 > img").setAttribute("src","./template/the_c_style/images/common/online.png")//重新定义用户主页在线显示
    }

    let phone_version = document.querySelector("#flk > p:nth-child(1) > a:nth-child(7)");
    if(phone_version !== null){
        document.querySelector("#flk > p:nth-child(1) > a:nth-child(7)").textContent = '油猴脚本项目主页';
        document.querySelector("#flk > p:nth-child(1) > a:nth-child(7)").setAttribute("href","https://github.com/CMSSserver/GW_Black");//页脚的手机版变成油猴脚本项目主页
    }

    let fast_1 = document.querySelector("#fastpostmessage");
    if(fast_1 !== null){
        document.querySelector("#fastpostmessage").setAttribute("placeholder","发一条友善的回复")
    }

    let pnpost = document.querySelector("#postbox > div.mtm.mbm.pnpost");
    let pnpost_rule1 = document.createElement('a');
    pnpost_rule1.textContent= '水贴定义';
    pnpost_rule1.className = "y";
    pnpost_rule1.href = "/forum.php?mod=viewthread&tid=9188" ;
    pnpost_rule1.style.paddingRight = "10px" ;
    pnpost.appendChild(pnpost_rule1);
    let pnpost_rule2 = document.createElement('a');
    pnpost_rule2.textContent= '回复可见使用提示';
    pnpost_rule2.className = "y";
    pnpost_rule2.href = "/forum.php?mod=viewthread&tid=8972&extra=page%3D1" ;
    pnpost_rule2.style.paddingRight = "10px" ;
    pnpost.appendChild(pnpost_rule2);
    //发布/回复时水贴公告提示+回复可见使用提示
    
})();

/*
更新日志：
    v0.1.1-beta
        帖子编辑的符号黑色问题
        让点评+赠礼变成黑色的横向图片变黑
        修改新提醒红点颜色
        登录后面后莫名其妙的白框（即为修改了搜索页面背景问题；if像shit一样臃肿（悲））
        右上角头像框内等级条灰度
        论坛版块简介大头贴更换默认
        签名黑色
    v0.1.2-beta
        将个人主页的鼠标选中到主题……的时候设为黑色，移动到上方横条变黑+移动到点上的时候是灰点+默认的主题下帖子标题默认灰色，移到上方是黑色
        右上角头像框横条黑色
        重新定义用户主页在线显示
        页脚文本鼠标移到上方变黑
        同时发布css版本！
    v0.1.3-beta
        页面最下方回复提示：发一条友善的回复
        发布/回复时水贴公告提示+回复可见使用提示
        置顶导航栏鼠标移动到上方按钮变黑色
        
*/