// ==UserScript==
// @name         抖音工具测试
// @namespace    http://tampermonkey.net/
// @version      5.5.1
// @description  登录灿耀易客，执行商务端业务
// @author       xgm
// @match      https://www.douyin.com/user/*
// @match      https://www.xiaohongshu.com/user/profile/*
// @match      https://space.bilibili.com/*
// @match      https://www.ixigua.com/home/*
// @match      https://www.kuaishou.com/profile/*
// @match      https://weibo.com/*
// @match      https://m.weibo.cn/*
// @match      https://author.baidu.com/*
// @match      https://baijiahao.baidu.com/u*
// @match      https://v.qq.com/biu/creator/home*
// @match      https://static-play.kg.qq.com/node/personal*
// @match      https://v.douyu.com/author/*
// @match      https://www.huya.com/video/u/*
// @match      https://y.qq.com/*
// @match      https://music.163.com/user*
// @match      https://mobile.yangkeduo.com/fyxmkief.html*
// @match      https://mobile.yangkeduo.com/svideo_personal.html*
// @match      https://www.toutiao.com/c/user/*
// @match      https://mlive5.inke.cn/app/user*
// @match      https://share.tangdou.com/space/index.php*
// @match      https://www.yy.com/u*
// @match      https://show.gotokeep.com/users/*
// @match      https://www.zhihu.com/people*
// @match      https://www.zhihu.com/org*
// @match      https://fanxing.kugou.com/cterm/ssr/profile/pc/views/ssrindex.html?*
// @match      https://xh.newrank.cn/
// @match      https://m.dewu.com/h5-sociality/community/user-home-page/hybird/h5other/shareMiddle*

// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      https://unpkg.com/axios/dist/axios.min.js
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_cookie
// @connect      *
// @license      End-User License Agreement
/* globals jQuery, $, waitForKeyElements */
// @downloadURL https://update.greasyfork.org/scripts/440762/%E6%8A%96%E9%9F%B3%E5%B7%A5%E5%85%B7%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/440762/%E6%8A%96%E9%9F%B3%E5%B7%A5%E5%85%B7%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==



(function() {
    'use strict';

    // @match      https://www.tiktok.com/@*
// @match      https://www.youtube.com/@*
// @match      https://twitter.com/*
// @match      https://www.pinterest.com/*

    // 自定义css
    let div_css = `
    *{
        margin: 0;
        padding: 0;
    }
    .loginBox{
        min-width: 330px;
        padding: 30px 30px;
        background: #fff;
        border-radius: 10px;
        position: fixed;
        top: 50%;
        left: 5%;
        transform: translateY(-50%);
        box-shadow: 0 0 10px rgba(0,0,0,0.2);
        z-index: 9990;
        font-size: initial;
    }
    .login-title{
        text-align: center;
        font-size: 22px;
        font-weight: bold;
        letter-spacing: 3px;
    }
    .login-tel{
        margin: 20px 0 10px;
    }
    .login-tel,.login-pwd{
        display: flex;
        align-items: center;
    }
    .login-tel span,.login-pwd span{
        width: 70px;
        font-size: 16px;
        text-align: right;
    }
    .login-tel input,.login-pwd input{
        width: 200px;
        height: 30px;
        padding: 0 10px;
        font-size: 14px;
        border-radius: 6px;
        border: 1px solid #aaa;
    }
    .login-btn{
        margin-top: 20px;
        text-align: center;
    }
    .login-btn button{
        width: 150px;
        height: 35px;
        background-color: #0096DB;
        color: #fff;
        border: 0;
        border-radius: 6px;
        cursor: pointer;
    }
    .mask,.infoContact,.record,.dataTool,.transfer,.renew,.bindStatus,.bindContact,.cateTool{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
        display: none;
        z-index: 999999;
    }
    .mask-form{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateY(-50%);
        margin-left: -200px;
        width: 400px;
        max-height: 500px;
        overflow-y: auto;
        background-color: #fff;
        border-radius: 10px;
        padding: 20px;
    }
    .form-title{
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 20px;
        text-align: center;
    }
    .form-enter>div{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        margin-bottom: 10px;
        position: relative;
    }
    .added{
        width: 310px;
        margin-bottom: 10px;
    }
    .added>div{
        display: inline-block;
        vertical-align: top;
    }
    .added-title{
        width: 80px;
        font-size: 16px;
    }
    .added-list{
        width: 200px;
    }
    .added-list p{
        font-size: 16px;
        word-break: break-all;
        letter-spacing: 2px;
    }
    .form-list{
        padding-right: 35px;
        margin-bottom: 10px;
        position: relative;
    }
    .form-add,.form-delete{
        position: absolute;
        right: 0px;
        top: 0;
        cursor: pointer;
    }
    .form-enter div span{
        display: inline-block;
        width: 50px;
        font-size: 16px;
        color: #333;
        text-align: right;
    }
    .form-enter div input{
        width: 200px;
        height: 30px;
        padding: 0 10px;
        font-size: 14px;
        border-radius: 6px;
        border: 1px solid #aaa;
    }
    .form-bind{
        display: flex;
        align-items: center;
        font-size: 14px;
        padding-left: 45px;
    }
    .form-bind input{
        width: 15px;
        height: 15px;
        margin-left: 5px;
    }
    .form-bind span{
        margin-left: 10px;
    }
    .form-btn,.bindContact-btn,.cateBtn{
        margin-top: 20px;
        text-align: center;
    }
    .cateBtn{
        display: inline-block;
        text-align: left;
        margin: 10px 10px 0 0;
    }
    .form-btn button,.bindContact-btn button,.cateBtn button{
        width: 150px;
        height: 35px;
        background-color: #0096DB;
        color: #fff;
        border: 0;
        border-radius: 3px;
        cursor: pointer;
        font-size: 16px;
        letter-spacing: 3px;
    }
    .cateBtn button{
        width: auto;
        height: auto;
        padding: 5px;
    }
    .close,.record-close,.data-close,.renew-close,.transfer-close,.bindStatus-close,.cate-close{
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
    }
    svg{
        width: 32px;
        height: 32px;
    }
    .msg{
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 15px;
        background-color: #fff;
        border-radius: 10px;
        z-index: 9999;
        box-shadow: 0 0 10px rgba(0,0,0,0.2);
        display: none;
    }
    .info-box,.record-box,.data-box,.transfer-box,.renew-box,.bindStatus-box{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateY(-50%);
        margin-left: -250px;
        width: 500px;
        max-height: 500px;
        overflow-y: auto;
        background-color: #fff;
        border-radius: 10px;
        padding: 20px;
    }
    .info-title{
        font-size: 20px;
    }
    .info-integral{
        margin-top: 20px;
    }
    .integral-title{
        font-size: 20px;
    }
    .integral-content{
        border: 1px solid #ccc;
        margin-top: 15px;
        font-size: 14px;
    }
    .integral-list{
        display: flex;
        align-items: center;
        border-bottom: 1px solid #ccc;
        min-height: 40px;
    }
    .integral-list:last-child{
        border-bottom: 0;
    }
    .integral-way{
        width: 78px;
        text-align: center;
    }
    .integral-table{
        width: 420px;
    }
    .integral-table>div{
        display: flex;
        align-items: center;
    }
    .integral-table>div>div{
        width: 20%;
        text-align: center;
        border-left: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        height: 40px;
        line-height: 40px;
    }
    .integral-list .integral-table>div:last-child>div{
        border-bottom: 0;
    }
    .integral-table>div>div:first-child{
        width: 60%;
    }
    .info-total{
        margin-top: 20px;
        text-align: right;
        padding-right: 20px;
    }
    .info-btn{
        margin-top: 15px;
        text-align: right;
    }
    .info-btn button{
        width: 120px;
        height: 35px;
        background-color: transparent;
        border: 1px solid #ccc;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.3s;
    }
    .info-btn button:hover{
        background-color: #0096DB;
        border-color: transparent;
        color: #fff;
    }
    .cy-tool{
        text-align: center;
        margin-top: 20px;
        font-size: 12px;
        color: #ccc;
    }
    .operate{
        width: 400px;
        max-height: 700px;
        overflow-y: auto;
        padding: 15px 20px;
        background: #fff;
        border-radius: 10px;
        position: fixed;
        right: 15%;
        top: 50%;
        transform: translateY(-50%);
        box-shadow: 0 0 10px rgba(0,0,0,0.2);
        z-index: 99999;
        color: #333;
        display: none;
        box-sizing: initial;
    }
    .operate-toggle,.login-toggle{
        position: absolute;
        right: 15px;
        top: 2px;
        cursor: pointer;
    }
    .operate-toggle svg,.login-toggle svg{
        width: 40px;
        height: 40px;
    }
    .operate-name{
        width: 230px;
        font-size: 16px;
        margin-bottom: 15px;
    }
    .operate-quit{
        position: absolute;
        right: 60px;
        top: 8px;
    }
    .operate-quit a{
        display: block;
        padding: 5px 10px;
        border-radius: 6px;
        background-color: #1890ff;
        color: #fff;
        font-size: 14px;
        text-decoration: none;
    }
    .info-name{
        font-size: 20px;
        font-weight: bold;
        position: relative;
    }
    .info-name span{
        font-size: 16px;
        font-weight: normal;
        cursor: pointer;
    }
    .info-data{
        margin-top: 15px;
    }
    .info-data>div{
        word-break: break-all;
        font-size: 16px;
        margin-bottom: 5px;
        min-height: 32px;
        line-height: 32px;
    }
    .info-data>div span{
        display: inline-block;
        vertical-align: top;
    }
    .operate-ewm{
        display: flex;
        justify-content: space-around;
        margin: 20px 0;
    }
    .operate-ewm img{
        width: 100px;
    }
    .operate-ewm p{
        font-size: 16px;
        margin-top: 8px;
    }
    .ewm-img{
        text-align: center;
    }
    .ewm-bind{
        width: 220px;
        text-align: center;
    }
    .ewm-bind p{
        font-size: 14px;
    }
    .operate-btn{
        margin-top: 20px;
    }
    .operate-btn button,.bindBtn,.prohibitBtn,#synchronize,#btnWork{
        padding: 7px 20px;
        background-color: #1890ff;
        font-size: 14px;
        border-radius: 3px;
        color: #fff;
        cursor: pointer;
        border: 0;
        margin-right: 20px;
        margin-bottom: 10px;
    }
    .bindBtn,.prohibitBtn,#synchronize{
        
    }
    .prohibitBtn{
        display: inline-block;
        margin-bottom: 0;
    }
    .operate-btn button:nth-child(3n){
        margin-right: 0;
    }
    .logo{
        width: 80px;
        position: absolute;
        top: 10px;
        left: 10px;
    }
    .logo img{
        width: 100%;
    }
    .record-box{
        width: 700px;
        margin-left: -350px;
    }
    .record-title,.data-title,.transfer-title{
        font-size: 20px;
        font-weight: bold;
        text-align: center;
    }
    .record-info{
        margin-top: 20px;
    }
    .record-table{
        width: 100%;
        border: 1px solid #ccc;
        border-collapse: inherit;
        border-spacing: 0;
    }
    .record-table td{
        vertical-align: middle;
    }
    .record-tab{
        font-size: 16px;
        font-weight: bold;
        text-align: center;
    }
    .record-tab>tr>td{
        height: 40px;
        border-left: 1px solid #ccc;
    }
    .record-content>tr>td{
        border-right: 0;
        padding: 10px;
        min-height: 30px;
        border: 1px solid #ccc;
        border-bottom: 0;
        border-right: 0;
        text-align: center;
        font-size: 14px;
    }
    .record-content>tr>td:first-child{
        border-left: 0;
    }
    .record-content>tr>td span{
        display: block;
        /* text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden; */
        word-break: break-all;
    }
    .record-content>tr>td.record-time,.record-tab>tr>td.tab-time{
        width: 25%;
        border-left: 0;
    }
    .record-detail,.tab-content{
        width: 50%;
    }
    .record-name,.tab-name{
        width: 25%;
    }
    #cate-select,#cateSelect{
        display: block;
    }
    .data-box{
        width: 60%;
        height: 80%;
        max-height: inherit;
        margin-left: -30%;
        overflow-y: hidden;
    }
    .data-content{
        height: 85%;
        overflow-y: auto;
        margin-top: 20px;
    }
    .data-select{
        display: flex;
        margin-bottom: 20px;
    }
    .select-title{
        width: 12%;
        font-size: 16px;
        padding-top: 8px;
    }
    .select-content{
        width: 88%;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-left: 10px;
    }
    .select-list{
        margin-right: 10px;
    }
    .select-list select{
        width: 150px;
        height: 35px;
        padding: 6px;
        font-size: 14px;
        border: 1px solid #ced4da;
    }
    .data-btn{
        margin-top: 20px;
        text-align: center;
    }
    .data-btn button{
        padding: 7px 50px;
        background-color: #1890ff;
        font-size: 14px;
        border-radius: 3px;
        color: #fff;
        cursor: pointer;
        border: 0;
    }
    .talent button,.expand button,.bindStatus-list button{
        padding: 7px 15px;
        background-color: #1890ff;
        font-size: 14px;
        border-radius: 3px;
        color: #fff;
        cursor: pointer;
        border: 0;
        margin-left: 10px;
    }
    .record-navBar{
        display: flex;
        align-items: center;
        border-bottom: 1px solid #f0f0f0;
    }
    .record-navBar div{
        padding-bottom: 12px;
        font-size: 16px;
        cursor: pointer;
        color: rgba(0,0,0,.85);
        margin-right: 30px;
        border-bottom: 2px solid transparent;
    }
    .record-navBar div.active{
        color: #1890ff;
        text-shadow: 0 0 .5px currentColor;
        border-bottom: 2px solid #1890ff;
    }
    .record-cutover{
        margin-top: 20px;
    }
    .cutover-list{
        display: none;
    }
    .cutover-list.active{
        display: block;
    }
    .record-content>tr>td p{
        word-break: break-all;
        margin-bottom: 15px;
    }
    .record-content>tr>td p:last-child{
        margin-bottom: 0;
    }
    .loading{
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background-color: rgba(0,0,0,0.5);
        z-index: 9999999;
        display: none;
    }
    .loading svg{
        width: 300px;
        height: 300px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -150px;
        margin-top: -150px;
    }
    .loading svg text{
        font-size: 2px;
    }
    .transfer-num{
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 20px 0;
        font-size: 14px;
        color: rgba(0,0,0,.85);
    }
    .transfer-num input{
        width: 230px;
        height: 30px;
        background-color: #fff;
        background-image: none;
        border: 1px solid #d9d9d9;
        border-radius: 2px;
        box-sizing: border-box;
        color: rgba(0,0,0,.85);
        display: inline-block;
        font-size: 14px;
        font-variant: tabular-nums;
        line-height: 1.5715;
        list-style: none;
        padding: 4px 11px;
        outline: none;
    }
    .transfer-btn{
        margin-top: 30px;
        text-align: center;
    }
    .transfer-btn button{
        width: 150px;
        height: 35px;
        background-color: #0096DB;
        color: #fff;
        border: 0;
        border-radius: 6px;
        cursor: pointer;
    }
    .renew-title{
        text-align: center;
        margin-top: 20px;
        padding: 0 40px;
    }
    .renew-link{
        text-align: center;
        margin-top: 15px;
    }
    .renew-link a{
        display: inline-block;
        padding: 8px 20px 10px;
        background-color: #0096DB;
        color: #fff;
        border: 0;
        border-radius: 6px;
        cursor: pointer;
        text-decoration: none;
    }
    .transfer-confirm{
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translateY(-50%);
        margin-left: -250px;
        width: 500px;
        max-height: 500px;
        overflow-y: auto;
        background-color: #fff;
        border-radius: 10px;
        padding: 30px 20px;
        display: none;
    }
    .confirm-title{
        font-size: 20px;
        text-align: center;
        margin-bottom: 30px;
    }
    .confirm-btn{
        text-align: center;
    }
    .confirm-btn button{
        padding: 7px 15px;
        background-color: #1890ff;
        font-size: 14px;
        border-radius: 3px;
        color: #fff;
        cursor: pointer;
        border: 0;
        margin-left: 10px;
    }
    .confirm-btn button:last-child{
        background: #d6dae3;
        color: #000;
    }
    .bindStatus-box{
        padding: 20px 40px;
    }
    .bindStatus-list{
        margin-top: 20px;
    }
    .status{
        display: none;
    }
    .data-amount{
        background: #fafafa;
        padding: 10px 15px;
    }
    .data-menu{
        margin-top: 15px;
    }
    .data-tab{
        display: flex;
        flex-wrap: wrap;
        align-items: center;
    }
    .data-tab div{
        width: 53px;
        height: 50px;
        padding: 10px;
        border-top: 2px solid transparent;
        margin-bottom: 15px;
        line-height: initial;
        box-sizing: border-box;
        font-size: 0;
        cursor: pointer;
        border-bottom: 2px solid #1890ff;
    }
    .data-tab div img{
        width: 28px;
    }
    .data-tab div.active{
        position: relative;
        border: 2px solid #1890ff;
        border-bottom: 0;
    }
    .data-tabContent{
        background: #fafafa;
        padding: 10px 15px;
        min-height: 100px;
        display: none;
    }
    #refresh_om{
        padding: 5px 10px;
        background-color: #1890ff;
        font-size: 12px;
        border-radius: 3px;
        color: #fff;
        cursor: pointer;
        border: 0;
        margin: 0 20px;
    }
    #copy{
        word-break : break-all;
        margin-left: 0;
    }
    .info-name p{
        font-size: 16px;
        font-weight: normal;
        margin-top: 10px;
    }
    .info-name>div{
        font-size: 16px;
        font-weight: normal;
        margin-top: 10px;
    }
    .windowH{
        max-height: 400px;
        overflow-y: auto;
    }
    /*定义滚动条高宽及背景
     高宽分别对应横竖滚动条的尺寸*/
    .windowH::-webkit-scrollbar
    {
        width:10px;
        height:10px;
        background-color:#F5F5F5;
    }
    /*定义滚动条轨道
     内阴影+圆角*/
    .windowH::-webkit-scrollbar-track
    {
        -webkit-box-shadow:inset 0 0 6px rgba(0,0,0,0.3);
        // border-radius:10px;
        background-color:#F5F5F5;
    }
    /*定义滑块
     内阴影+圆角*/
    .windowH::-webkit-scrollbar-thumb
    {
        border-radius:10px;
        -webkit-box-shadow:inset 0 0 6px rgba(0,0,0,.3);
        background-color:#555;
    }
    .cate-list{
        width: 100%;
        display: flex;
    }
    .cate-title{
        width: 15%;
        text-align: right;
    }
    .cate-content{
        width: 80%;
        border: 1px solid #aaa;
        background-color: #fff;
        overflow-y: auto;
        border-radius: 6px;
        padding: 10px 15px;
    }
    .cateBox{
        margin-bottom: 8px;
    }
    .cateBox>p{
        font-size: 14px;
    }
    .cateData{
        display: flex;
        flex-wrap: wrap;
    }
    .cateData>div{
        padding: 4px 8px;
        margin: 4px;
        border: 1px solid #bbb;
        cursor: pointer;
        font-size: 14px;
        border-radius: 5px;
    }
    .cateData>div.active{
        border: 1px solid #2b74fb;
        color: rgb(57, 153, 251);
    }
    .bindForm{
        width: 60%;
        height: 80%;
        max-height: inherit;
        margin-left: -30%;
        overflow-y: hidden;
    }
    .bindForm .form-enter{
        overflow-y: auto;
        height: 85%;
    }
    .bindForm .form-enter>div{
        width: 95%;
        margin: 0 auto 0 0;
    }
    .bindForm .added{
        width: 100%;
        display: none;
    }
    .bindForm .added-title{
        width: 15%;
        text-align: right;
    }
    .bindForm .added-list{
        width: auto;
    }
    .bindForm .form-list{
        width: 100%;
    }
    .bindForm .form-enter div span{
        width: 15%;
    }
    .bindForm .form-enter div input{
        width: 80%;
    }
    .bindContact-btn{
        position: absolute;
        width: 100%;
        left: 0;
        margin: 20px 0;
        bottom: 0;
    }
    .info-name div.nickName{
        display: inline-block;
        font-size: 20px;
        font-weight: bold;
        margin-top: 0;
    }
    #coolCopy{
        cursor: pointer;
    }
    #btnLink{
        width: auto;
        height: auto;
        padding: 5px 10px;
        border: 0;
        border-radius: 3px;
        color: #fff;
        font-size: 16px;
        letter-spacing: 1px;
        cursor: pointer;
        animation: mymove 2s infinite;
        position: relative;
        background-color: #fe2c55;
    }
    #btnGroup>div{
        display: inline-block;
        vertical-align: middle;
        margin-right: 15px;
    }
    #btnWork{
        margin-bottom: 0;
    }



    @keyframes mymove{
        0 {
            transform: scale(0.8)
        }
        50% {
            transform: scale(1.1)
        }
        100% {
            transform: scale(1)
        }
    }
    `

    // 引用自定义css
    GM_addStyle(div_css);

    // 创建元素添加到页面上
    let div = `<div class="loginBox">
        <div class="logo">
            <img src="https://www.cyek.com/img/logo-scroll.svg" alt="">
        </div>
        <div class="login-toggle" data-bind="1"><svg t="1646796325695" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3481" width="48" height="48"><path d="M866.461538 787.692308a78.769231 78.769231 0 0 1-78.76923 78.76923H236.307692a78.769231 78.769231 0 0 1-78.76923-78.76923V236.307692a78.769231 78.769231 0 0 1 78.76923-78.76923h551.384616a78.769231 78.769231 0 0 1 78.76923 78.76923v551.384616z m-31.507692-358.439385H189.006769L189.046154 787.692308a47.261538 47.261538 0 0 0 42.417231 47.02523L236.307692 834.953846h551.384616a47.261538 47.261538 0 0 0 47.02523-42.417231L834.953846 787.692308v-358.439385zM787.692308 189.046154H236.307692a47.261538 47.261538 0 0 0-47.02523 42.417231L189.046154 236.307692l-0.039385 161.437539H834.953846V236.307692a47.261538 47.261538 0 0 0-42.417231-47.02523L787.692308 189.046154z m-111.616 53.681231l2.48123 1.96923 80.738462 78.769231a15.753846 15.753846 0 0 1-19.495385 24.576l-2.48123-1.969231-69.474462-67.780923-65.772308 67.465846a15.753846 15.753846 0 0 1-19.810461 2.284308l-2.481231-1.969231a15.753846 15.753846 0 0 1-2.284308-19.810461l1.969231-2.481231 76.8-78.769231a15.753846 15.753846 0 0 1 19.810462-2.284307z" fill="#2c2c2c" p-id="3482"></path></svg></div>
        <div class="cylogin-box">
            <div class="login-title">登录</div>
            <div class="login-tel">
                <span>手机号：</span>
                <input type="tel" placeholder="请输入你的手机号" name="phone" id="cyphoneNum" autocomplete="off" tabindex="1" />
            </div>
            <div class="login-pwd">
                <span>密码：</span>
                <input type="password" placeholder="请输入密码" name="pwd" id="cypwd" autocomplete="off" tabindex="2" />
            </div>
            <div class="login-btn">
                <button>登录</button>
            </div>
        </div>
        <div class="cy-tool">灿耀易客浏览器工具</div>
    </div>
    <div class="mask">
        <div class="mask-form">
            <div class="form-title">补充联系方式</div>
            <div class="form-enter">
                <div>
                    <div class="added">
                        <div class="added-title">已有手机：</div>
                        <div class="added-list added-phone"></div>
                    </div>
                    <div class="form-list">
                        <span>手机：</span>
                        <input class="tel" type="tel" placeholder="请输入手机号" name="tel" autocomplete="off">
                        <div class="form-add">
                            <svg t="1645166902470" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1893" width="32" height="32"><path d="M512 936.915619c-234.672764 0-424.915619-190.243879-424.915619-424.915619S277.327236 87.083357 512 87.083357c234.676857 0 424.916643 190.243879 424.916643 424.915619S746.676857 936.915619 512 936.915619zM724.45781 469.50414 554.491767 469.50414 554.491767 299.546284l-84.983533 0 0 169.957857L299.54219 469.50414l0 84.99172 169.966043 0 0 169.966043 84.983533 0L554.491767 554.49586l169.966043 0L724.45781 469.50414z" p-id="1894"></path></svg>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="added">
                        <div class="added-title">已有微信：</div>
                        <div class="added-list added-wechat"></div>
                    </div>
                    <div class="form-list">
                        <span>微信：</span>
                        <input class="wechat" type="text" placeholder="请输入微信号" name="wechat" autocomplete="off">
                        <div class="form-add">
                            <svg t="1645166902470" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1893" width="32" height="32"><path d="M512 936.915619c-234.672764 0-424.915619-190.243879-424.915619-424.915619S277.327236 87.083357 512 87.083357c234.676857 0 424.916643 190.243879 424.916643 424.915619S746.676857 936.915619 512 936.915619zM724.45781 469.50414 554.491767 469.50414 554.491767 299.546284l-84.983533 0 0 169.957857L299.54219 469.50414l0 84.99172 169.966043 0 0 169.966043 84.983533 0L554.491767 554.49586l169.966043 0L724.45781 469.50414z" p-id="1894"></path></svg>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="added">
                        <div class="added-title">已有QQ：</div>
                        <div class="added-list added-qq"></div>
                    </div>
                    <div class="form-list">
                        <span>QQ：</span>
                        <input class="qq" type="tel" placeholder="请输入QQ号" name="qq" autocomplete="off">
                        <div class="form-add">
                            <svg t="1645166902470" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1893" width="32" height="32"><path d="M512 936.915619c-234.672764 0-424.915619-190.243879-424.915619-424.915619S277.327236 87.083357 512 87.083357c234.676857 0 424.916643 190.243879 424.916643 424.915619S746.676857 936.915619 512 936.915619zM724.45781 469.50414 554.491767 469.50414 554.491767 299.546284l-84.983533 0 0 169.957857L299.54219 469.50414l0 84.99172 169.966043 0 0 169.966043 84.983533 0L554.491767 554.49586l169.966043 0L724.45781 469.50414z" p-id="1894"></path></svg>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-btn">
                <button>提交</button>
            </div>
            <div class="close"><svg t="1645093506233" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2049" width="32" height="32"><path d="M512 128C300.8 128 128 300.8 128 512s172.8 384 384 384 384-172.8 384-384S723.2 128 512 128zM512 832c-179.2 0-320-140.8-320-320s140.8-320 320-320 320 140.8 320 320S691.2 832 512 832z" p-id="2050"></path><path d="M672 352c-12.8-12.8-32-12.8-44.8 0L512 467.2 396.8 352C384 339.2 364.8 339.2 352 352S339.2 384 352 396.8L467.2 512 352 627.2c-12.8 12.8-12.8 32 0 44.8s32 12.8 44.8 0L512 556.8l115.2 115.2c12.8 12.8 32 12.8 44.8 0s12.8-32 0-44.8L556.8 512l115.2-115.2C684.8 384 684.8 364.8 672 352z" p-id="2051"></path></svg></div>
        </div>
    </div>
    <div class="bindContact">
        <div class="mask-form bindForm">
            <div class="form-title">绑定达人信息</div>
            <div class="form-enter">
                <div>
                    <div class="added">
                        <div class="added-title">已有手机：</div>
                        <div class="added-list added-phone"></div>
                    </div>
                    <div class="form-list">
                        <span>手机：</span>
                        <input class="tel starTel" type="tel" placeholder="请输入手机号" name="tel" autocomplete="off">
                        <div class="form-add">
                            <svg t="1645166902470" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1893" width="32" height="32"><path d="M512 936.915619c-234.672764 0-424.915619-190.243879-424.915619-424.915619S277.327236 87.083357 512 87.083357c234.676857 0 424.916643 190.243879 424.916643 424.915619S746.676857 936.915619 512 936.915619zM724.45781 469.50414 554.491767 469.50414 554.491767 299.546284l-84.983533 0 0 169.957857L299.54219 469.50414l0 84.99172 169.966043 0 0 169.966043 84.983533 0L554.491767 554.49586l169.966043 0L724.45781 469.50414z" p-id="1894"></path></svg>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="added">
                        <div class="added-title">已有微信：</div>
                        <div class="added-list added-wechat"></div>
                    </div>
                    <div class="form-list">
                        <span>微信：</span>
                        <input class="wechat starWechat" type="text" placeholder="请输入微信号" name="wechat" autocomplete="off">
                        <div class="form-add">
                            <svg t="1645166902470" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1893" width="32" height="32"><path d="M512 936.915619c-234.672764 0-424.915619-190.243879-424.915619-424.915619S277.327236 87.083357 512 87.083357c234.676857 0 424.916643 190.243879 424.916643 424.915619S746.676857 936.915619 512 936.915619zM724.45781 469.50414 554.491767 469.50414 554.491767 299.546284l-84.983533 0 0 169.957857L299.54219 469.50414l0 84.99172 169.966043 0 0 169.966043 84.983533 0L554.491767 554.49586l169.966043 0L724.45781 469.50414z" p-id="1894"></path></svg>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="cate-list">
                        <div class="cate-title">分类选择：</div>
                        <div class="cate-content"></div>
                    </div>
                </div>
            </div>
            <div class="bindContact-btn">
                <button>提交</button>
            </div>
            <div class="close"><svg t="1645093506233" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2049" width="32" height="32"><path d="M512 128C300.8 128 128 300.8 128 512s172.8 384 384 384 384-172.8 384-384S723.2 128 512 128zM512 832c-179.2 0-320-140.8-320-320s140.8-320 320-320 320 140.8 320 320S691.2 832 512 832z" p-id="2050"></path><path d="M672 352c-12.8-12.8-32-12.8-44.8 0L512 467.2 396.8 352C384 339.2 364.8 339.2 352 352S339.2 384 352 396.8L467.2 512 352 627.2c-12.8 12.8-12.8 32 0 44.8s32 12.8 44.8 0L512 556.8l115.2 115.2c12.8 12.8 32 12.8 44.8 0s12.8-32 0-44.8L556.8 512l115.2-115.2C684.8 384 684.8 364.8 672 352z" p-id="2051"></path></svg></div>
        </div>
    </div>
    <div class="infoContact">
        <div class="info-box">
            <div class="info-integral">
                <div class="integral-title">联系方式及积分情况</div>
                <div class="integral-content">
                    <div class="integral-list">
                        <div class="integral-way">手机</div>
                        <div class="integral-table" id="integral-phone"></div>
                    </div>
                    <div class="integral-list">
                        <div class="integral-way">微信</div>
                        <div class="integral-table" id="integral-wechat"></div>
                    </div>
                    <div class="integral-list">
                        <div class="integral-way">QQ</div>
                        <div class="integral-table" id="integral-qq"></div>
                    </div>
                </div>
            </div>
            <div class="info-total">本次操作总积分：<span>10</span></div>
            <div class="info-btn">
                <button>我知道了</button>
            </div>
        </div>
    </div>
    <div class="operate">
        <div class="operate-quit">
            <a href="javascript:;">退出登录</a>
        </div>
        <div class="operate-toggle" data-bind="1"><svg t="1646796325695" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3481" width="48" height="48"><path d="M866.461538 787.692308a78.769231 78.769231 0 0 1-78.76923 78.76923H236.307692a78.769231 78.769231 0 0 1-78.76923-78.76923V236.307692a78.769231 78.769231 0 0 1 78.76923-78.76923h551.384616a78.769231 78.769231 0 0 1 78.76923 78.76923v551.384616z m-31.507692-358.439385H189.006769L189.046154 787.692308a47.261538 47.261538 0 0 0 42.417231 47.02523L236.307692 834.953846h551.384616a47.261538 47.261538 0 0 0 47.02523-42.417231L834.953846 787.692308v-358.439385zM787.692308 189.046154H236.307692a47.261538 47.261538 0 0 0-47.02523 42.417231L189.046154 236.307692l-0.039385 161.437539H834.953846V236.307692a47.261538 47.261538 0 0 0-42.417231-47.02523L787.692308 189.046154z m-111.616 53.681231l2.48123 1.96923 80.738462 78.769231a15.753846 15.753846 0 0 1-19.495385 24.576l-2.48123-1.969231-69.474462-67.780923-65.772308 67.465846a15.753846 15.753846 0 0 1-19.810461 2.284308l-2.481231-1.969231a15.753846 15.753846 0 0 1-2.284308-19.810461l1.969231-2.481231 76.8-78.769231a15.753846 15.753846 0 0 1 19.810462-2.284307z" fill="#2c2c2c" p-id="3482"></path></svg></div>
        <div class="operate-box">
            <div class="operate-name"></div>
            <div class="operate-info">
                <div class="info-name">
                    <div id="coolCopy" class="nickName"></div>
                    <div id="starNum"></div>
                    <div id="btnGroup">
                        <div id="copyLink"></div>
                    </div>
                </div>
                
                <div class="info-data">
                    <div class="data-menu">
                        <div class="data-tab"></div>
                        <div class="data-tabContent"></div>
                    </div>
                </div>
            </div>
            <div class="operate-ewm">
                <div class="ewm-img"></div>
                <div class="ewm-bind"></div>
            </div>
            <div class="operate-btn status">
                <button id="operate-data">联系方式</button>
                <button id="operate-base">基础数据</button>
                <button class="operate-record">达人日志</button>
                <button class="operate-bind" style="display: none;">绑定业务</button>
            </div>
        </div>
        <div class="cy-tool">灿耀易客浏览器工具</div>
    </div>
    <div class="record">
        <div class="record-box">
            <div class="record-title">达人日志</div>
            <div class="record-info">
                <div class="record-navBar">
                    <div class="active">绑定记录</div>
                    <div>联系方式</div>
                    <div>基础信息</div>
                </div>
                <div class="record-cutover">
                    <div class="cutover-list active" data-log="bind">
                        <table class="record-table" cellspacing="0" cellpadding="0">
                            <thead class="record-tab">
                                <td class="tab-time">操作时间</td>
                                <td class="tab-content">操作内容</td>
                                <td class="tab-name">操作人</td>
                            </thead>
                            <tbody class="record-content" id="cutover-bind"></tbody>
                        </table>
                    </div>
                    <div class="cutover-list" data-log="contact">
                        <table class="record-table" cellspacing="0" cellpadding="0">
                            <thead class="record-tab">
                                <td class="tab-time">操作时间</td>
                                <td class="tab-content">操作内容</td>
                                <td class="tab-name">操作人</td>
                            </thead>
                            <tbody class="record-content" id="cutover-contact"></tbody>
                        </table>
                    </div>
                    <div class="cutover-list" data-log="basic">
                        <table class="record-table" cellspacing="0" cellpadding="0">
                            <thead class="record-tab">
                                <td class="tab-time">操作时间</td>
                                <td class="tab-content">操作内容</td>
                                <td class="tab-name">操作人</td>
                            </thead>
                            <tbody class="record-content" id="cutover-basic"></tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="record-close"><svg t="1645093506233" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2049" width="32" height="32"><path d="M512 128C300.8 128 128 300.8 128 512s172.8 384 384 384 384-172.8 384-384S723.2 128 512 128zM512 832c-179.2 0-320-140.8-320-320s140.8-320 320-320 320 140.8 320 320S691.2 832 512 832z" p-id="2050"></path><path d="M672 352c-12.8-12.8-32-12.8-44.8 0L512 467.2 396.8 352C384 339.2 364.8 339.2 352 352S339.2 384 352 396.8L467.2 512 352 627.2c-12.8 12.8-12.8 32 0 44.8s32 12.8 44.8 0L512 556.8l115.2 115.2c12.8 12.8 32 12.8 44.8 0s12.8-32 0-44.8L556.8 512l115.2-115.2C684.8 384 684.8 364.8 672 352z" p-id="2051"></path></svg></div>
        </div>
    </div>
    <div class="dataTool">
        <div class="data-box">
            <div class="data-title">达人资料更新</div>
            <div class="data-content">
                <div class="data-select" id="area">
                    <div class="select-title">地区选择</div>
                    <div class="select-content" id="data-toggle="distpicker"">
                        <div class="select-list"><select id="province"></select></div>
                        <div class="select-list"><select id="city"></select></div>
                        <div class="select-list"><select id="district"></select></div>
                    </div>
                </div>
                <div class="data-select" id="gender">
                    <div class="select-title">性别选择</div>
                    <div class="select-content">
                        <div class="select-list"><select id="sex"><option selected="selected" value="未知" data-code="0">未知</option><option value="男" data-code="1">男</option><option value="女" data-code="2">女</option><option value="无性" data-code="3">无性</option></select></div>
                    </div>
                </div>
                <div class="data-select data-cate" id="cate0">
                    <div class="select-title">分类选择</div>
                    <div class="select-content" id="cate-select"></div>
                </div>
            </div>
            <div class="data-btn">
                <button>提交</button>
            </div>
            <div class="data-close"><svg t="1645093506233" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2049" width="32" height="32"><path d="M512 128C300.8 128 128 300.8 128 512s172.8 384 384 384 384-172.8 384-384S723.2 128 512 128zM512 832c-179.2 0-320-140.8-320-320s140.8-320 320-320 320 140.8 320 320S691.2 832 512 832z" p-id="2050"></path><path d="M672 352c-12.8-12.8-32-12.8-44.8 0L512 467.2 396.8 352C384 339.2 364.8 339.2 352 352S339.2 384 352 396.8L467.2 512 352 627.2c-12.8 12.8-12.8 32 0 44.8s32 12.8 44.8 0L512 556.8l115.2 115.2c12.8 12.8 32 12.8 44.8 0s12.8-32 0-44.8L556.8 512l115.2-115.2C684.8 384 684.8 364.8 672 352z" p-id="2051"></path></svg></div>
        </div>
    </div>
    <div class="cateTool">
        <div class="data-box">
            <div class="data-title">达人资料更新</div>
            <div class="data-content">
                <div class="data-select data-cate" id="cate0">
                    <div class="select-title">分类选择</div>
                    <div class="select-content" id="cateSelect"></div>
                </div>
            </div>
            <div class="data-btn">
                <button>提交</button>
            </div>
            <div class="cate-close"><svg t="1645093506233" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2049" width="32" height="32"><path d="M512 128C300.8 128 128 300.8 128 512s172.8 384 384 384 384-172.8 384-384S723.2 128 512 128zM512 832c-179.2 0-320-140.8-320-320s140.8-320 320-320 320 140.8 320 320S691.2 832 512 832z" p-id="2050"></path><path d="M672 352c-12.8-12.8-32-12.8-44.8 0L512 467.2 396.8 352C384 339.2 364.8 339.2 352 352S339.2 384 352 396.8L467.2 512 352 627.2c-12.8 12.8-12.8 32 0 44.8s32 12.8 44.8 0L512 556.8l115.2 115.2c12.8 12.8 32 12.8 44.8 0s12.8-32 0-44.8L556.8 512l115.2-115.2C684.8 384 684.8 364.8 672 352z" p-id="2051"></path></svg></div>
        </div>
    </div>
    <div class="loading">
        <svg
        version="1.1"
        id="dc-spinner"
        xmlns="http://www.w3.org/2000/svg"
        x="0px" y="0px"
        width:"38"
        height:"38"
        viewBox="0 0 38 38"
        preserveAspectRatio="xMinYMin meet"
        >
        <text x="7" y="21" font-family="Monaco" font-size="2px" style="letter-spacing:0.6" fill="#fff">数据加载中，请勿关闭
        <animate
            attributeName="opacity"
            values="0;1;0" dur="1.8s"
            repeatCount="indefinite"/>
        </text>
        <path fill="#373a42" d="M20,35c-8.271,0-15-6.729-15-15S11.729,5,20,5s15,6.729,15,15S28.271,35,20,35z M20,5.203
        C11.841,5.203,5.203,11.841,5.203,20c0,8.159,6.638,14.797,14.797,14.797S34.797,28.159,34.797,20
        C34.797,11.841,28.159,5.203,20,5.203z">
        </path>
        <path fill="#373a42" d="M20,33.125c-7.237,0-13.125-5.888-13.125-13.125S12.763,6.875,20,6.875S33.125,12.763,33.125,20
        S27.237,33.125,20,33.125z M20,7.078C12.875,7.078,7.078,12.875,7.078,20c0,7.125,5.797,12.922,12.922,12.922
        S32.922,27.125,32.922,20C32.922,12.875,27.125,7.078,20,7.078z">
        </path>
        <path fill="#2AA198" stroke="#2AA198" stroke-width="0.6027" stroke-miterlimit="10" d="M5.203,20
                c0-8.159,6.638-14.797,14.797-14.797V5C11.729,5,5,11.729,5,20s6.729,15,15,15v-0.203C11.841,34.797,5.203,28.159,5.203,20z">
        <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 20 20"
            to="360 20 20"
            calcMode="spline"
            keySplines="0.4, 0, 0.2, 1"
            keyTimes="0;1"
            dur="2s" repeatCount="indefinite" />
        </path>
        <path fill="#859900" stroke="#859900" stroke-width="0.2027" stroke-miterlimit="10" d="M7.078,20
        c0-7.125,5.797-12.922,12.922-12.922V6.875C12.763,6.875,6.875,12.763,6.875,20S12.763,33.125,20,33.125v-0.203
        C12.875,32.922,7.078,27.125,7.078,20z">
        <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 20 20"
            to="360 20 20"
            dur="1.8s"
            repeatCount="indefinite" />
        </path>
        </svg>
    </div>
    <div class="transfer">
        <div class="transfer-box">
            <div class="transfer-title">分配转让达人</div>
            <div class="transfer-num">
                工号：<input type="text" id="work_name" placeholder="请输入员工工号" autocomplete="off">
            </div>
            <div class="transfer-btn">
                <button>分配转让</button>
            </div>
            <div class="transfer-close"><svg t="1645093506233" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2049" width="32" height="32"><path d="M512 128C300.8 128 128 300.8 128 512s172.8 384 384 384 384-172.8 384-384S723.2 128 512 128zM512 832c-179.2 0-320-140.8-320-320s140.8-320 320-320 320 140.8 320 320S691.2 832 512 832z" p-id="2050"></path><path d="M672 352c-12.8-12.8-32-12.8-44.8 0L512 467.2 396.8 352C384 339.2 364.8 339.2 352 352S339.2 384 352 396.8L467.2 512 352 627.2c-12.8 12.8-12.8 32 0 44.8s32 12.8 44.8 0L512 556.8l115.2 115.2c12.8 12.8 32 12.8 44.8 0s12.8-32 0-44.8L556.8 512l115.2-115.2C684.8 384 684.8 364.8 672 352z" p-id="2051"></path></svg></div>
        </div>
        <div class="transfer-confirm">
            <div class="confirm-title">是否转让给工号：666</div>
            <div class="confirm-btn">
                <button class="confirm-success">确认</button>
                <button class="confirm-cancel">取消</button>
            </div>
        </div>
    </div>
    <div class="renew">
        <div class="renew-box">
            <div class="renew-title">浏览器工具脚本有重大更新，请点击下方按钮前往插件安装页面更新</div>
            <div class="renew-link"><a href="https://greasyfork.org/zh-CN/scripts/440705-%E7%81%BF%E8%80%80%E6%98%93%E5%AE%A2%E6%B5%8F%E8%A7%88%E5%99%A8%E5%8A%A9%E6%89%8B" target="_blank">浏览器工具插件更新页面</a></div>
        </div>
    </div>
    <div class="bindStatus">
        <div class="bindStatus-box">
            <div class="data-title">绑定业务</div>
            <div class="bindStatus-list">
                内容开放平台绑定状态：<span>已被你绑定</span>
            </div>
            <div class="bindStatus-list">
                合同业务绑定状态：<span>可绑定</span>
                <button>立即绑定</button>
            </div>
            <div class="bindStatus-list">
                绑定状态：<span>已被人绑定</span>
            </div>
            <div class="bindStatus-close"><svg t="1645093506233" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2049" width="32" height="32"><path d="M512 128C300.8 128 128 300.8 128 512s172.8 384 384 384 384-172.8 384-384S723.2 128 512 128zM512 832c-179.2 0-320-140.8-320-320s140.8-320 320-320 320 140.8 320 320S691.2 832 512 832z" p-id="2050"></path><path d="M672 352c-12.8-12.8-32-12.8-44.8 0L512 467.2 396.8 352C384 339.2 364.8 339.2 352 352S339.2 384 352 396.8L467.2 512 352 627.2c-12.8 12.8-12.8 32 0 44.8s32 12.8 44.8 0L512 556.8l115.2 115.2c12.8 12.8 32 12.8 44.8 0s12.8-32 0-44.8L556.8 512l115.2-115.2C684.8 384 684.8 364.8 672 352z" p-id="2051"></path></svg></div>
        </div>
    </div>
    <div id="infoData"></div>
    <div class="msg">返回显示数据</div>`;
    $("body").append(div);

// <div class="cateBtn" data-num="242"><button>设置标签</button></div>
//                 <div class="cateBtn" data-num="241"><button>设置分类</button></div>

    /*!
 * Distpicker v1.0.4
 * https://github.com/fengyuanchen/distpicker
 *
 * Copyright (c) 2014-2016 Fengyuan Chen
 * Released under the MIT license
 *
 * Date: 2016-06-01T15:05:52.606Z
 */

  var ChineseDistricts = {
    "86": {
      "110000": "北京市",
      "120000": "天津市",
      "130000": "河北省",
      "140000": "山西省",
      "150000": "内蒙古自治区",
      "210000": "辽宁省",
      "220000": "吉林省",
      "230000": "黑龙江省",
      "310000": "上海市",
      "320000": "江苏省",
      "330000": "浙江省",
      "340000": "安徽省",
      "350000": "福建省",
      "360000": "江西省",
      "370000": "山东省",
      "410000": "河南省",
      "420000": "湖北省",
      "430000": "湖南省",
      "440000": "广东省",
      "450000": "广西壮族自治区",
      "460000": "海南省",
      "500000": "重庆市",
      "510000": "四川省",
      "520000": "贵州省",
      "530000": "云南省",
      "540000": "西藏自治区",
      "610000": "陕西省",
      "620000": "甘肃省",
      "630000": "青海省",
      "640000": "宁夏回族自治区",
      "650000": "新疆维吾尔自治区",
      "710000": "台湾省",
      "810000": "香港特别行政区",
      "820000": "澳门特别行政区"
    },
    "110000": {
      "110100": "市辖区"
    },
    "110100": {
      "110101": "东城区",
      "110102": "西城区",
      "110105": "朝阳区",
      "110106": "丰台区",
      "110107": "石景山区",
      "110108": "海淀区",
      "110109": "门头沟区",
      "110111": "房山区",
      "110112": "通州区",
      "110113": "顺义区",
      "110114": "昌平区",
      "110115": "大兴区",
      "110116": "怀柔区",
      "110117": "平谷区",
      "110118": "密云区",
      "110119": "延庆区"
    },
    "120000": {
      "120100": "市辖区"
    },
    "120100": {
      "120101": "和平区",
      "120102": "河东区",
      "120103": "河西区",
      "120104": "南开区",
      "120105": "河北区",
      "120106": "红桥区",
      "120110": "东丽区",
      "120111": "西青区",
      "120112": "津南区",
      "120113": "北辰区",
      "120114": "武清区",
      "120115": "宝坻区",
      "120116": "滨海新区",
      "120117": "宁河区",
      "120118": "静海区",
      "120119": "蓟州区"
    },
    "130000": {
      "130100": "石家庄市",
      "130200": "唐山市",
      "130300": "秦皇岛市",
      "130400": "邯郸市",
      "130500": "邢台市",
      "130600": "保定市",
      "130700": "张家口市",
      "130800": "承德市",
      "130900": "沧州市",
      "131000": "廊坊市",
      "131100": "衡水市",
      "139000": "省直辖县级行政区划"
    },
    "130100": {
      "130101": "市辖区",
      "130102": "长安区",
      "130104": "桥西区",
      "130105": "新华区",
      "130107": "井陉矿区",
      "130108": "裕华区",
      "130109": "藁城区",
      "130110": "鹿泉区",
      "130111": "栾城区",
      "130121": "井陉县",
      "130123": "正定县",
      "130125": "行唐县",
      "130126": "灵寿县",
      "130127": "高邑县",
      "130128": "深泽县",
      "130129": "赞皇县",
      "130130": "无极县",
      "130131": "平山县",
      "130132": "元氏县",
      "130133": "赵县",
      "130183": "晋州市",
      "130184": "新乐市"
    },
    "130200": {
      "130201": "市辖区",
      "130202": "路南区",
      "130203": "路北区",
      "130204": "古冶区",
      "130205": "开平区",
      "130207": "丰南区",
      "130208": "丰润区",
      "130209": "曹妃甸区",
      "130223": "滦县",
      "130224": "滦南县",
      "130225": "乐亭县",
      "130227": "迁西县",
      "130229": "玉田县",
      "130281": "遵化市",
      "130283": "迁安市"
    },
    "130300": {
      "130301": "市辖区",
      "130302": "海港区",
      "130303": "山海关区",
      "130304": "北戴河区",
      "130306": "抚宁区",
      "130321": "青龙满族自治县",
      "130322": "昌黎县",
      "130324": "卢龙县"
    },
    "130400": {
      "130401": "市辖区",
      "130402": "邯山区",
      "130403": "丛台区",
      "130404": "复兴区",
      "130406": "峰峰矿区",
      "130421": "邯郸县",
      "130423": "临漳县",
      "130424": "成安县",
      "130425": "大名县",
      "130426": "涉县",
      "130427": "磁县",
      "130428": "肥乡县",
      "130429": "永年县",
      "130430": "邱县",
      "130431": "鸡泽县",
      "130432": "广平县",
      "130433": "馆陶县",
      "130434": "魏县",
      "130435": "曲周县",
      "130481": "武安市"
    },
    "130500": {
      "130501": "市辖区",
      "130502": "桥东区",
      "130503": "桥西区",
      "130521": "邢台县",
      "130522": "临城县",
      "130523": "内丘县",
      "130524": "柏乡县",
      "130525": "隆尧县",
      "130526": "任县",
      "130527": "南和县",
      "130528": "宁晋县",
      "130529": "巨鹿县",
      "130530": "新河县",
      "130531": "广宗县",
      "130532": "平乡县",
      "130533": "威县",
      "130534": "清河县",
      "130535": "临西县",
      "130581": "南宫市",
      "130582": "沙河市"
    },
    "130600": {
      "130601": "市辖区",
      "130602": "竞秀区",
      "130606": "莲池区",
      "130607": "满城区",
      "130608": "清苑区",
      "130609": "徐水区",
      "130623": "涞水县",
      "130624": "阜平县",
      "130626": "定兴县",
      "130627": "唐县",
      "130628": "高阳县",
      "130629": "容城县",
      "130630": "涞源县",
      "130631": "望都县",
      "130632": "安新县",
      "130633": "易县",
      "130634": "曲阳县",
      "130635": "蠡县",
      "130636": "顺平县",
      "130637": "博野县",
      "130638": "雄县",
      "130681": "涿州市",
      "130683": "安国市",
      "130684": "高碑店市"
    },
    "130700": {
      "130701": "市辖区",
      "130702": "桥东区",
      "130703": "桥西区",
      "130705": "宣化区",
      "130706": "下花园区",
      "130708": "万全区",
      "130709": "崇礼区",
      "130722": "张北县",
      "130723": "康保县",
      "130724": "沽源县",
      "130725": "尚义县",
      "130726": "蔚县",
      "130727": "阳原县",
      "130728": "怀安县",
      "130730": "怀来县",
      "130731": "涿鹿县",
      "130732": "赤城县"
    },
    "130800": {
      "130801": "市辖区",
      "130802": "双桥区",
      "130803": "双滦区",
      "130804": "鹰手营子矿区",
      "130821": "承德县",
      "130822": "兴隆县",
      "130823": "平泉县",
      "130824": "滦平县",
      "130825": "隆化县",
      "130826": "丰宁满族自治县",
      "130827": "宽城满族自治县",
      "130828": "围场满族蒙古族自治县"
    },
    "130900": {
      "130901": "市辖区",
      "130902": "新华区",
      "130903": "运河区",
      "130921": "沧县",
      "130922": "青县",
      "130923": "东光县",
      "130924": "海兴县",
      "130925": "盐山县",
      "130926": "肃宁县",
      "130927": "南皮县",
      "130928": "吴桥县",
      "130929": "献县",
      "130930": "孟村回族自治县",
      "130981": "泊头市",
      "130982": "任丘市",
      "130983": "黄骅市",
      "130984": "河间市"
    },
    "131000": {
      "131001": "市辖区",
      "131002": "安次区",
      "131003": "广阳区",
      "131022": "固安县",
      "131023": "永清县",
      "131024": "香河县",
      "131025": "大城县",
      "131026": "文安县",
      "131028": "大厂回族自治县",
      "131081": "霸州市",
      "131082": "三河市"
    },
    "131100": {
      "131101": "市辖区",
      "131102": "桃城区",
      "131103": "冀州区",
      "131121": "枣强县",
      "131122": "武邑县",
      "131123": "武强县",
      "131124": "饶阳县",
      "131125": "安平县",
      "131126": "故城县",
      "131127": "景县",
      "131128": "阜城县",
      "131182": "深州市"
    },
    "139000": {
      "139001": "定州市",
      "139002": "辛集市"
    },
    "140000": {
      "140100": "太原市",
      "140200": "大同市",
      "140300": "阳泉市",
      "140400": "长治市",
      "140500": "晋城市",
      "140600": "朔州市",
      "140700": "晋中市",
      "140800": "运城市",
      "140900": "忻州市",
      "141000": "临汾市",
      "141100": "吕梁市"
    },
    "140100": {
      "140101": "市辖区",
      "140105": "小店区",
      "140106": "迎泽区",
      "140107": "杏花岭区",
      "140108": "尖草坪区",
      "140109": "万柏林区",
      "140110": "晋源区",
      "140121": "清徐县",
      "140122": "阳曲县",
      "140123": "娄烦县",
      "140181": "古交市"
    },
    "140200": {
      "140201": "市辖区",
      "140202": "城区",
      "140203": "矿区",
      "140211": "南郊区",
      "140212": "新荣区",
      "140221": "阳高县",
      "140222": "天镇县",
      "140223": "广灵县",
      "140224": "灵丘县",
      "140225": "浑源县",
      "140226": "左云县",
      "140227": "大同县"
    },
    "140300": {
      "140301": "市辖区",
      "140302": "城区",
      "140303": "矿区",
      "140311": "郊区",
      "140321": "平定县",
      "140322": "盂县"
    },
    "140400": {
      "140401": "市辖区",
      "140402": "城区",
      "140411": "郊区",
      "140421": "长治县",
      "140423": "襄垣县",
      "140424": "屯留县",
      "140425": "平顺县",
      "140426": "黎城县",
      "140427": "壶关县",
      "140428": "长子县",
      "140429": "武乡县",
      "140430": "沁县",
      "140431": "沁源县",
      "140481": "潞城市"
    },
    "140500": {
      "140501": "市辖区",
      "140502": "城区",
      "140521": "沁水县",
      "140522": "阳城县",
      "140524": "陵川县",
      "140525": "泽州县",
      "140581": "高平市"
    },
    "140600": {
      "140601": "市辖区",
      "140602": "朔城区",
      "140603": "平鲁区",
      "140621": "山阴县",
      "140622": "应县",
      "140623": "右玉县",
      "140624": "怀仁县"
    },
    "140700": {
      "140701": "市辖区",
      "140702": "榆次区",
      "140721": "榆社县",
      "140722": "左权县",
      "140723": "和顺县",
      "140724": "昔阳县",
      "140725": "寿阳县",
      "140726": "太谷县",
      "140727": "祁县",
      "140728": "平遥县",
      "140729": "灵石县",
      "140781": "介休市"
    },
    "140800": {
      "140801": "市辖区",
      "140802": "盐湖区",
      "140821": "临猗县",
      "140822": "万荣县",
      "140823": "闻喜县",
      "140824": "稷山县",
      "140825": "新绛县",
      "140826": "绛县",
      "140827": "垣曲县",
      "140828": "夏县",
      "140829": "平陆县",
      "140830": "芮城县",
      "140881": "永济市",
      "140882": "河津市"
    },
    "140900": {
      "140901": "市辖区",
      "140902": "忻府区",
      "140921": "定襄县",
      "140922": "五台县",
      "140923": "代县",
      "140924": "繁峙县",
      "140925": "宁武县",
      "140926": "静乐县",
      "140927": "神池县",
      "140928": "五寨县",
      "140929": "岢岚县",
      "140930": "河曲县",
      "140931": "保德县",
      "140932": "偏关县",
      "140981": "原平市"
    },
    "141000": {
      "141001": "市辖区",
      "141002": "尧都区",
      "141021": "曲沃县",
      "141022": "翼城县",
      "141023": "襄汾县",
      "141024": "洪洞县",
      "141025": "古县",
      "141026": "安泽县",
      "141027": "浮山县",
      "141028": "吉县",
      "141029": "乡宁县",
      "141030": "大宁县",
      "141031": "隰县",
      "141032": "永和县",
      "141033": "蒲县",
      "141034": "汾西县",
      "141081": "侯马市",
      "141082": "霍州市"
    },
    "141100": {
      "141101": "市辖区",
      "141102": "离石区",
      "141121": "文水县",
      "141122": "交城县",
      "141123": "兴县",
      "141124": "临县",
      "141125": "柳林县",
      "141126": "石楼县",
      "141127": "岚县",
      "141128": "方山县",
      "141129": "中阳县",
      "141130": "交口县",
      "141181": "孝义市",
      "141182": "汾阳市"
    },
    "150000": {
      "150100": "呼和浩特市",
      "150200": "包头市",
      "150300": "乌海市",
      "150400": "赤峰市",
      "150500": "通辽市",
      "150600": "鄂尔多斯市",
      "150700": "呼伦贝尔市",
      "150800": "巴彦淖尔市",
      "150900": "乌兰察布市",
      "152200": "兴安盟",
      "152500": "锡林郭勒盟",
      "152900": "阿拉善盟"
    },
    "150100": {
      "150101": "市辖区",
      "150102": "新城区",
      "150103": "回民区",
      "150104": "玉泉区",
      "150105": "赛罕区",
      "150121": "土默特左旗",
      "150122": "托克托县",
      "150123": "和林格尔县",
      "150124": "清水河县",
      "150125": "武川县"
    },
    "150200": {
      "150201": "市辖区",
      "150202": "东河区",
      "150203": "昆都仑区",
      "150204": "青山区",
      "150205": "石拐区",
      "150206": "白云鄂博矿区",
      "150207": "九原区",
      "150221": "土默特右旗",
      "150222": "固阳县",
      "150223": "达尔罕茂明安联合旗"
    },
    "150300": {
      "150301": "市辖区",
      "150302": "海勃湾区",
      "150303": "海南区",
      "150304": "乌达区"
    },
    "150400": {
      "150401": "市辖区",
      "150402": "红山区",
      "150403": "元宝山区",
      "150404": "松山区",
      "150421": "阿鲁科尔沁旗",
      "150422": "巴林左旗",
      "150423": "巴林右旗",
      "150424": "林西县",
      "150425": "克什克腾旗",
      "150426": "翁牛特旗",
      "150428": "喀喇沁旗",
      "150429": "宁城县",
      "150430": "敖汉旗"
    },
    "150500": {
      "150501": "市辖区",
      "150502": "科尔沁区",
      "150521": "科尔沁左翼中旗",
      "150522": "科尔沁左翼后旗",
      "150523": "开鲁县",
      "150524": "库伦旗",
      "150525": "奈曼旗",
      "150526": "扎鲁特旗",
      "150581": "霍林郭勒市"
    },
    "150600": {
      "150601": "市辖区",
      "150602": "东胜区",
      "150603": "康巴什区",
      "150621": "达拉特旗",
      "150622": "准格尔旗",
      "150623": "鄂托克前旗",
      "150624": "鄂托克旗",
      "150625": "杭锦旗",
      "150626": "乌审旗",
      "150627": "伊金霍洛旗"
    },
    "150700": {
      "150701": "市辖区",
      "150702": "海拉尔区",
      "150703": "扎赉诺尔区",
      "150721": "阿荣旗",
      "150722": "莫力达瓦达斡尔族自治旗",
      "150723": "鄂伦春自治旗",
      "150724": "鄂温克族自治旗",
      "150725": "陈巴尔虎旗",
      "150726": "新巴尔虎左旗",
      "150727": "新巴尔虎右旗",
      "150781": "满洲里市",
      "150782": "牙克石市",
      "150783": "扎兰屯市",
      "150784": "额尔古纳市",
      "150785": "根河市"
    },
    "150800": {
      "150801": "市辖区",
      "150802": "临河区",
      "150821": "五原县",
      "150822": "磴口县",
      "150823": "乌拉特前旗",
      "150824": "乌拉特中旗",
      "150825": "乌拉特后旗",
      "150826": "杭锦后旗"
    },
    "150900": {
      "150901": "市辖区",
      "150902": "集宁区",
      "150921": "卓资县",
      "150922": "化德县",
      "150923": "商都县",
      "150924": "兴和县",
      "150925": "凉城县",
      "150926": "察哈尔右翼前旗",
      "150927": "察哈尔右翼中旗",
      "150928": "察哈尔右翼后旗",
      "150929": "四子王旗",
      "150981": "丰镇市"
    },
    "152200": {
      "152201": "乌兰浩特市",
      "152202": "阿尔山市",
      "152221": "科尔沁右翼前旗",
      "152222": "科尔沁右翼中旗",
      "152223": "扎赉特旗",
      "152224": "突泉县"
    },
    "152500": {
      "152501": "二连浩特市",
      "152502": "锡林浩特市",
      "152522": "阿巴嘎旗",
      "152523": "苏尼特左旗",
      "152524": "苏尼特右旗",
      "152525": "东乌珠穆沁旗",
      "152526": "西乌珠穆沁旗",
      "152527": "太仆寺旗",
      "152528": "镶黄旗",
      "152529": "正镶白旗",
      "152530": "正蓝旗",
      "152531": "多伦县"
    },
    "152900": {
      "152921": "阿拉善左旗",
      "152922": "阿拉善右旗",
      "152923": "额济纳旗"
    },
    "210000": {
      "210100": "沈阳市",
      "210200": "大连市",
      "210300": "鞍山市",
      "210400": "抚顺市",
      "210500": "本溪市",
      "210600": "丹东市",
      "210700": "锦州市",
      "210800": "营口市",
      "210900": "阜新市",
      "211000": "辽阳市",
      "211100": "盘锦市",
      "211200": "铁岭市",
      "211300": "朝阳市",
      "211400": "葫芦岛市"
    },
    "210100": {
      "210101": "市辖区",
      "210102": "和平区",
      "210103": "沈河区",
      "210104": "大东区",
      "210105": "皇姑区",
      "210106": "铁西区",
      "210111": "苏家屯区",
      "210112": "浑南区",
      "210113": "沈北新区",
      "210114": "于洪区",
      "210115": "辽中区",
      "210123": "康平县",
      "210124": "法库县",
      "210181": "新民市"
    },
    "210200": {
      "210201": "市辖区",
      "210202": "中山区",
      "210203": "西岗区",
      "210204": "沙河口区",
      "210211": "甘井子区",
      "210212": "旅顺口区",
      "210213": "金州区",
      "210214": "普兰店区",
      "210224": "长海县",
      "210281": "瓦房店市",
      "210283": "庄河市"
    },
    "210300": {
      "210301": "市辖区",
      "210302": "铁东区",
      "210303": "铁西区",
      "210304": "立山区",
      "210311": "千山区",
      "210321": "台安县",
      "210323": "岫岩满族自治县",
      "210381": "海城市"
    },
    "210400": {
      "210401": "市辖区",
      "210402": "新抚区",
      "210403": "东洲区",
      "210404": "望花区",
      "210411": "顺城区",
      "210421": "抚顺县",
      "210422": "新宾满族自治县",
      "210423": "清原满族自治县"
    },
    "210500": {
      "210501": "市辖区",
      "210502": "平山区",
      "210503": "溪湖区",
      "210504": "明山区",
      "210505": "南芬区",
      "210521": "本溪满族自治县",
      "210522": "桓仁满族自治县"
    },
    "210600": {
      "210601": "市辖区",
      "210602": "元宝区",
      "210603": "振兴区",
      "210604": "振安区",
      "210624": "宽甸满族自治县",
      "210681": "东港市",
      "210682": "凤城市"
    },
    "210700": {
      "210701": "市辖区",
      "210702": "古塔区",
      "210703": "凌河区",
      "210711": "太和区",
      "210726": "黑山县",
      "210727": "义县",
      "210781": "凌海市",
      "210782": "北镇市"
    },
    "210800": {
      "210801": "市辖区",
      "210802": "站前区",
      "210803": "西市区",
      "210804": "鲅鱼圈区",
      "210811": "老边区",
      "210881": "盖州市",
      "210882": "大石桥市"
    },
    "210900": {
      "210901": "市辖区",
      "210902": "海州区",
      "210903": "新邱区",
      "210904": "太平区",
      "210905": "清河门区",
      "210911": "细河区",
      "210921": "阜新蒙古族自治县",
      "210922": "彰武县"
    },
    "211000": {
      "211001": "市辖区",
      "211002": "白塔区",
      "211003": "文圣区",
      "211004": "宏伟区",
      "211005": "弓长岭区",
      "211011": "太子河区",
      "211021": "辽阳县",
      "211081": "灯塔市"
    },
    "211100": {
      "211101": "市辖区",
      "211102": "双台子区",
      "211103": "兴隆台区",
      "211104": "大洼区",
      "211122": "盘山县"
    },
    "211200": {
      "211201": "市辖区",
      "211202": "银州区",
      "211204": "清河区",
      "211221": "铁岭县",
      "211223": "西丰县",
      "211224": "昌图县",
      "211281": "调兵山市",
      "211282": "开原市"
    },
    "211300": {
      "211301": "市辖区",
      "211302": "双塔区",
      "211303": "龙城区",
      "211321": "朝阳县",
      "211322": "建平县",
      "211324": "喀喇沁左翼蒙古族自治县",
      "211381": "北票市",
      "211382": "凌源市"
    },
    "211400": {
      "211401": "市辖区",
      "211402": "连山区",
      "211403": "龙港区",
      "211404": "南票区",
      "211421": "绥中县",
      "211422": "建昌县",
      "211481": "兴城市"
    },
    "220000": {
      "220100": "长春市",
      "220200": "吉林市",
      "220300": "四平市",
      "220400": "辽源市",
      "220500": "通化市",
      "220600": "白山市",
      "220700": "松原市",
      "220800": "白城市",
      "222400": "延边朝鲜族自治州"
    },
    "220100": {
      "220101": "市辖区",
      "220102": "南关区",
      "220103": "宽城区",
      "220104": "朝阳区",
      "220105": "二道区",
      "220106": "绿园区",
      "220112": "双阳区",
      "220113": "九台区",
      "220122": "农安县",
      "220182": "榆树市",
      "220183": "德惠市"
    },
    "220200": {
      "220201": "市辖区",
      "220202": "昌邑区",
      "220203": "龙潭区",
      "220204": "船营区",
      "220211": "丰满区",
      "220221": "永吉县",
      "220281": "蛟河市",
      "220282": "桦甸市",
      "220283": "舒兰市",
      "220284": "磐石市"
    },
    "220300": {
      "220301": "市辖区",
      "220302": "铁西区",
      "220303": "铁东区",
      "220322": "梨树县",
      "220323": "伊通满族自治县",
      "220381": "公主岭市",
      "220382": "双辽市"
    },
    "220400": {
      "220401": "市辖区",
      "220402": "龙山区",
      "220403": "西安区",
      "220421": "东丰县",
      "220422": "东辽县"
    },
    "220500": {
      "220501": "市辖区",
      "220502": "东昌区",
      "220503": "二道江区",
      "220521": "通化县",
      "220523": "辉南县",
      "220524": "柳河县",
      "220581": "梅河口市",
      "220582": "集安市"
    },
    "220600": {
      "220601": "市辖区",
      "220602": "浑江区",
      "220605": "江源区",
      "220621": "抚松县",
      "220622": "靖宇县",
      "220623": "长白朝鲜族自治县",
      "220681": "临江市"
    },
    "220700": {
      "220701": "市辖区",
      "220702": "宁江区",
      "220721": "前郭尔罗斯蒙古族自治县",
      "220722": "长岭县",
      "220723": "乾安县",
      "220781": "扶余市"
    },
    "220800": {
      "220801": "市辖区",
      "220802": "洮北区",
      "220821": "镇赉县",
      "220822": "通榆县",
      "220881": "洮南市",
      "220882": "大安市"
    },
    "222400": {
      "222401": "延吉市",
      "222402": "图们市",
      "222403": "敦化市",
      "222404": "珲春市",
      "222405": "龙井市",
      "222406": "和龙市",
      "222424": "汪清县",
      "222426": "安图县"
    },
    "230000": {
      "230100": "哈尔滨市",
      "230200": "齐齐哈尔市",
      "230300": "鸡西市",
      "230400": "鹤岗市",
      "230500": "双鸭山市",
      "230600": "大庆市",
      "230700": "伊春市",
      "230800": "佳木斯市",
      "230900": "七台河市",
      "231000": "牡丹江市",
      "231100": "黑河市",
      "231200": "绥化市",
      "232700": "大兴安岭地区"
    },
    "230100": {
      "230101": "市辖区",
      "230102": "道里区",
      "230103": "南岗区",
      "230104": "道外区",
      "230108": "平房区",
      "230109": "松北区",
      "230110": "香坊区",
      "230111": "呼兰区",
      "230112": "阿城区",
      "230113": "双城区",
      "230123": "依兰县",
      "230124": "方正县",
      "230125": "宾县",
      "230126": "巴彦县",
      "230127": "木兰县",
      "230128": "通河县",
      "230129": "延寿县",
      "230183": "尚志市",
      "230184": "五常市"
    },
    "230200": {
      "230201": "市辖区",
      "230202": "龙沙区",
      "230203": "建华区",
      "230204": "铁锋区",
      "230205": "昂昂溪区",
      "230206": "富拉尔基区",
      "230207": "碾子山区",
      "230208": "梅里斯达斡尔族区",
      "230221": "龙江县",
      "230223": "依安县",
      "230224": "泰来县",
      "230225": "甘南县",
      "230227": "富裕县",
      "230229": "克山县",
      "230230": "克东县",
      "230231": "拜泉县",
      "230281": "讷河市"
    },
    "230300": {
      "230301": "市辖区",
      "230302": "鸡冠区",
      "230303": "恒山区",
      "230304": "滴道区",
      "230305": "梨树区",
      "230306": "城子河区",
      "230307": "麻山区",
      "230321": "鸡东县",
      "230381": "虎林市",
      "230382": "密山市"
    },
    "230400": {
      "230401": "市辖区",
      "230402": "向阳区",
      "230403": "工农区",
      "230404": "南山区",
      "230405": "兴安区",
      "230406": "东山区",
      "230407": "兴山区",
      "230421": "萝北县",
      "230422": "绥滨县"
    },
    "230500": {
      "230501": "市辖区",
      "230502": "尖山区",
      "230503": "岭东区",
      "230505": "四方台区",
      "230506": "宝山区",
      "230521": "集贤县",
      "230522": "友谊县",
      "230523": "宝清县",
      "230524": "饶河县"
    },
    "230600": {
      "230601": "市辖区",
      "230602": "萨尔图区",
      "230603": "龙凤区",
      "230604": "让胡路区",
      "230605": "红岗区",
      "230606": "大同区",
      "230621": "肇州县",
      "230622": "肇源县",
      "230623": "林甸县",
      "230624": "杜尔伯特蒙古族自治县"
    },
    "230700": {
      "230701": "市辖区",
      "230702": "伊春区",
      "230703": "南岔区",
      "230704": "友好区",
      "230705": "西林区",
      "230706": "翠峦区",
      "230707": "新青区",
      "230708": "美溪区",
      "230709": "金山屯区",
      "230710": "五营区",
      "230711": "乌马河区",
      "230712": "汤旺河区",
      "230713": "带岭区",
      "230714": "乌伊岭区",
      "230715": "红星区",
      "230716": "上甘岭区",
      "230722": "嘉荫县",
      "230781": "铁力市"
    },
    "230800": {
      "230801": "市辖区",
      "230803": "向阳区",
      "230804": "前进区",
      "230805": "东风区",
      "230811": "郊区",
      "230822": "桦南县",
      "230826": "桦川县",
      "230828": "汤原县",
      "230881": "同江市",
      "230882": "富锦市",
      "230883": "抚远市"
    },
    "230900": {
      "230901": "市辖区",
      "230902": "新兴区",
      "230903": "桃山区",
      "230904": "茄子河区",
      "230921": "勃利县"
    },
    "231000": {
      "231001": "市辖区",
      "231002": "东安区",
      "231003": "阳明区",
      "231004": "爱民区",
      "231005": "西安区",
      "231025": "林口县",
      "231081": "绥芬河市",
      "231083": "海林市",
      "231084": "宁安市",
      "231085": "穆棱市",
      "231086": "东宁市"
    },
    "231100": {
      "231101": "市辖区",
      "231102": "爱辉区",
      "231121": "嫩江县",
      "231123": "逊克县",
      "231124": "孙吴县",
      "231181": "北安市",
      "231182": "五大连池市"
    },
    "231200": {
      "231201": "市辖区",
      "231202": "北林区",
      "231221": "望奎县",
      "231222": "兰西县",
      "231223": "青冈县",
      "231224": "庆安县",
      "231225": "明水县",
      "231226": "绥棱县",
      "231281": "安达市",
      "231282": "肇东市",
      "231283": "海伦市"
    },
    "232700": {
      "232721": "呼玛县",
      "232722": "塔河县",
      "232723": "漠河县"
    },
    "310000": {
      "310100": "市辖区"
    },
    "310100": {
      "310101": "黄浦区",
      "310104": "徐汇区",
      "310105": "长宁区",
      "310106": "静安区",
      "310107": "普陀区",
      "310109": "虹口区",
      "310110": "杨浦区",
      "310112": "闵行区",
      "310113": "宝山区",
      "310114": "嘉定区",
      "310115": "浦东新区",
      "310116": "金山区",
      "310117": "松江区",
      "310118": "青浦区",
      "310120": "奉贤区",
      "310151": "崇明区"
    },
    "320000": {
      "320100": "南京市",
      "320200": "无锡市",
      "320300": "徐州市",
      "320400": "常州市",
      "320500": "苏州市",
      "320600": "南通市",
      "320700": "连云港市",
      "320800": "淮安市",
      "320900": "盐城市",
      "321000": "扬州市",
      "321100": "镇江市",
      "321200": "泰州市",
      "321300": "宿迁市"
    },
    "320100": {
      "320101": "市辖区",
      "320102": "玄武区",
      "320104": "秦淮区",
      "320105": "建邺区",
      "320106": "鼓楼区",
      "320111": "浦口区",
      "320113": "栖霞区",
      "320114": "雨花台区",
      "320115": "江宁区",
      "320116": "六合区",
      "320117": "溧水区",
      "320118": "高淳区"
    },
    "320200": {
      "320201": "市辖区",
      "320205": "锡山区",
      "320206": "惠山区",
      "320211": "滨湖区",
      "320213": "梁溪区",
      "320214": "新吴区",
      "320281": "江阴市",
      "320282": "宜兴市"
    },
    "320300": {
      "320301": "市辖区",
      "320302": "鼓楼区",
      "320303": "云龙区",
      "320305": "贾汪区",
      "320311": "泉山区",
      "320312": "铜山区",
      "320321": "丰县",
      "320322": "沛县",
      "320324": "睢宁县",
      "320381": "新沂市",
      "320382": "邳州市"
    },
    "320400": {
      "320401": "市辖区",
      "320402": "天宁区",
      "320404": "钟楼区",
      "320411": "新北区",
      "320412": "武进区",
      "320413": "金坛区",
      "320481": "溧阳市"
    },
    "320500": {
      "320501": "市辖区",
      "320505": "虎丘区",
      "320506": "吴中区",
      "320507": "相城区",
      "320508": "姑苏区",
      "320509": "吴江区",
      "320581": "常熟市",
      "320582": "张家港市",
      "320583": "昆山市",
      "320585": "太仓市"
    },
    "320600": {
      "320601": "市辖区",
      "320602": "崇川区",
      "320611": "港闸区",
      "320612": "通州区",
      "320621": "海安县",
      "320623": "如东县",
      "320681": "启东市",
      "320682": "如皋市",
      "320684": "海门市"
    },
    "320700": {
      "320701": "市辖区",
      "320703": "连云区",
      "320706": "海州区",
      "320707": "赣榆区",
      "320722": "东海县",
      "320723": "灌云县",
      "320724": "灌南县"
    },
    "320800": {
      "320801": "市辖区",
      "320803": "淮安区",
      "320804": "淮阴区",
      "320812": "清江浦区",
      "320813": "洪泽区",
      "320826": "涟水县",
      "320830": "盱眙县",
      "320831": "金湖县"
    },
    "320900": {
      "320901": "市辖区",
      "320902": "亭湖区",
      "320903": "盐都区",
      "320904": "大丰区",
      "320921": "响水县",
      "320922": "滨海县",
      "320923": "阜宁县",
      "320924": "射阳县",
      "320925": "建湖县",
      "320981": "东台市"
    },
    "321000": {
      "321001": "市辖区",
      "321002": "广陵区",
      "321003": "邗江区",
      "321012": "江都区",
      "321023": "宝应县",
      "321081": "仪征市",
      "321084": "高邮市"
    },
    "321100": {
      "321101": "市辖区",
      "321102": "京口区",
      "321111": "润州区",
      "321112": "丹徒区",
      "321181": "丹阳市",
      "321182": "扬中市",
      "321183": "句容市"
    },
    "321200": {
      "321201": "市辖区",
      "321202": "海陵区",
      "321203": "高港区",
      "321204": "姜堰区",
      "321281": "兴化市",
      "321282": "靖江市",
      "321283": "泰兴市"
    },
    "321300": {
      "321301": "市辖区",
      "321302": "宿城区",
      "321311": "宿豫区",
      "321322": "沭阳县",
      "321323": "泗阳县",
      "321324": "泗洪县"
    },
    "330000": {
      "330100": "杭州市",
      "330200": "宁波市",
      "330300": "温州市",
      "330400": "嘉兴市",
      "330500": "湖州市",
      "330600": "绍兴市",
      "330700": "金华市",
      "330800": "衢州市",
      "330900": "舟山市",
      "331000": "台州市",
      "331100": "丽水市"
    },
    "330100": {
      "330101": "市辖区",
      "330102": "上城区",
      "330103": "下城区",
      "330104": "江干区",
      "330105": "拱墅区",
      "330106": "西湖区",
      "330108": "滨江区",
      "330109": "萧山区",
      "330110": "余杭区",
      "330111": "富阳区",
      "330122": "桐庐县",
      "330127": "淳安县",
      "330182": "建德市",
      "330185": "临安市"
    },
    "330200": {
      "330201": "市辖区",
      "330203": "海曙区",
      "330204": "江东区",
      "330205": "江北区",
      "330206": "北仑区",
      "330211": "镇海区",
      "330212": "鄞州区",
      "330225": "象山县",
      "330226": "宁海县",
      "330281": "余姚市",
      "330282": "慈溪市",
      "330283": "奉化市"
    },
    "330300": {
      "330301": "市辖区",
      "330302": "鹿城区",
      "330303": "龙湾区",
      "330304": "瓯海区",
      "330305": "洞头区",
      "330324": "永嘉县",
      "330326": "平阳县",
      "330327": "苍南县",
      "330328": "文成县",
      "330329": "泰顺县",
      "330381": "瑞安市",
      "330382": "乐清市"
    },
    "330400": {
      "330401": "市辖区",
      "330402": "南湖区",
      "330411": "秀洲区",
      "330421": "嘉善县",
      "330424": "海盐县",
      "330481": "海宁市",
      "330482": "平湖市",
      "330483": "桐乡市"
    },
    "330500": {
      "330501": "市辖区",
      "330502": "吴兴区",
      "330503": "南浔区",
      "330521": "德清县",
      "330522": "长兴县",
      "330523": "安吉县"
    },
    "330600": {
      "330601": "市辖区",
      "330602": "越城区",
      "330603": "柯桥区",
      "330604": "上虞区",
      "330624": "新昌县",
      "330681": "诸暨市",
      "330683": "嵊州市"
    },
    "330700": {
      "330701": "市辖区",
      "330702": "婺城区",
      "330703": "金东区",
      "330723": "武义县",
      "330726": "浦江县",
      "330727": "磐安县",
      "330781": "兰溪市",
      "330782": "义乌市",
      "330783": "东阳市",
      "330784": "永康市"
    },
    "330800": {
      "330801": "市辖区",
      "330802": "柯城区",
      "330803": "衢江区",
      "330822": "常山县",
      "330824": "开化县",
      "330825": "龙游县",
      "330881": "江山市"
    },
    "330900": {
      "330901": "市辖区",
      "330902": "定海区",
      "330903": "普陀区",
      "330921": "岱山县",
      "330922": "嵊泗县"
    },
    "331000": {
      "331001": "市辖区",
      "331002": "椒江区",
      "331003": "黄岩区",
      "331004": "路桥区",
      "331021": "玉环县",
      "331022": "三门县",
      "331023": "天台县",
      "331024": "仙居县",
      "331081": "温岭市",
      "331082": "临海市"
    },
    "331100": {
      "331101": "市辖区",
      "331102": "莲都区",
      "331121": "青田县",
      "331122": "缙云县",
      "331123": "遂昌县",
      "331124": "松阳县",
      "331125": "云和县",
      "331126": "庆元县",
      "331127": "景宁畲族自治县",
      "331181": "龙泉市"
    },
    "340000": {
      "340100": "合肥市",
      "340200": "芜湖市",
      "340300": "蚌埠市",
      "340400": "淮南市",
      "340500": "马鞍山市",
      "340600": "淮北市",
      "340700": "铜陵市",
      "340800": "安庆市",
      "341000": "黄山市",
      "341100": "滁州市",
      "341200": "阜阳市",
      "341300": "宿州市",
      "341500": "六安市",
      "341600": "亳州市",
      "341700": "池州市",
      "341800": "宣城市"
    },
    "340100": {
      "340101": "市辖区",
      "340102": "瑶海区",
      "340103": "庐阳区",
      "340104": "蜀山区",
      "340111": "包河区",
      "340121": "长丰县",
      "340122": "肥东县",
      "340123": "肥西县",
      "340124": "庐江县",
      "340181": "巢湖市"
    },
    "340200": {
      "340201": "市辖区",
      "340202": "镜湖区",
      "340203": "弋江区",
      "340207": "鸠江区",
      "340208": "三山区",
      "340221": "芜湖县",
      "340222": "繁昌县",
      "340223": "南陵县",
      "340225": "无为县"
    },
    "340300": {
      "340301": "市辖区",
      "340302": "龙子湖区",
      "340303": "蚌山区",
      "340304": "禹会区",
      "340311": "淮上区",
      "340321": "怀远县",
      "340322": "五河县",
      "340323": "固镇县"
    },
    "340400": {
      "340401": "市辖区",
      "340402": "大通区",
      "340403": "田家庵区",
      "340404": "谢家集区",
      "340405": "八公山区",
      "340406": "潘集区",
      "340421": "凤台县",
      "340422": "寿县"
    },
    "340500": {
      "340501": "市辖区",
      "340503": "花山区",
      "340504": "雨山区",
      "340506": "博望区",
      "340521": "当涂县",
      "340522": "含山县",
      "340523": "和县"
    },
    "340600": {
      "340601": "市辖区",
      "340602": "杜集区",
      "340603": "相山区",
      "340604": "烈山区",
      "340621": "濉溪县"
    },
    "340700": {
      "340701": "市辖区",
      "340705": "铜官区",
      "340706": "义安区",
      "340711": "郊区",
      "340722": "枞阳县"
    },
    "340800": {
      "340801": "市辖区",
      "340802": "迎江区",
      "340803": "大观区",
      "340811": "宜秀区",
      "340822": "怀宁县",
      "340824": "潜山县",
      "340825": "太湖县",
      "340826": "宿松县",
      "340827": "望江县",
      "340828": "岳西县",
      "340881": "桐城市"
    },
    "341000": {
      "341001": "市辖区",
      "341002": "屯溪区",
      "341003": "黄山区",
      "341004": "徽州区",
      "341021": "歙县",
      "341022": "休宁县",
      "341023": "黟县",
      "341024": "祁门县"
    },
    "341100": {
      "341101": "市辖区",
      "341102": "琅琊区",
      "341103": "南谯区",
      "341122": "来安县",
      "341124": "全椒县",
      "341125": "定远县",
      "341126": "凤阳县",
      "341181": "天长市",
      "341182": "明光市"
    },
    "341200": {
      "341201": "市辖区",
      "341202": "颍州区",
      "341203": "颍东区",
      "341204": "颍泉区",
      "341221": "临泉县",
      "341222": "太和县",
      "341225": "阜南县",
      "341226": "颍上县",
      "341282": "界首市"
    },
    "341300": {
      "341301": "市辖区",
      "341302": "埇桥区",
      "341321": "砀山县",
      "341322": "萧县",
      "341323": "灵璧县",
      "341324": "泗县"
    },
    "341500": {
      "341501": "市辖区",
      "341502": "金安区",
      "341503": "裕安区",
      "341504": "叶集区",
      "341522": "霍邱县",
      "341523": "舒城县",
      "341524": "金寨县",
      "341525": "霍山县"
    },
    "341600": {
      "341601": "市辖区",
      "341602": "谯城区",
      "341621": "涡阳县",
      "341622": "蒙城县",
      "341623": "利辛县"
    },
    "341700": {
      "341701": "市辖区",
      "341702": "贵池区",
      "341721": "东至县",
      "341722": "石台县",
      "341723": "青阳县"
    },
    "341800": {
      "341801": "市辖区",
      "341802": "宣州区",
      "341821": "郎溪县",
      "341822": "广德县",
      "341823": "泾县",
      "341824": "绩溪县",
      "341825": "旌德县",
      "341881": "宁国市"
    },
    "350000": {
      "350100": "福州市",
      "350200": "厦门市",
      "350300": "莆田市",
      "350400": "三明市",
      "350500": "泉州市",
      "350600": "漳州市",
      "350700": "南平市",
      "350800": "龙岩市",
      "350900": "宁德市"
    },
    "350100": {
      "350101": "市辖区",
      "350102": "鼓楼区",
      "350103": "台江区",
      "350104": "仓山区",
      "350105": "马尾区",
      "350111": "晋安区",
      "350121": "闽侯县",
      "350122": "连江县",
      "350123": "罗源县",
      "350124": "闽清县",
      "350125": "永泰县",
      "350128": "平潭县",
      "350181": "福清市",
      "350182": "长乐市"
    },
    "350200": {
      "350201": "市辖区",
      "350203": "思明区",
      "350205": "海沧区",
      "350206": "湖里区",
      "350211": "集美区",
      "350212": "同安区",
      "350213": "翔安区"
    },
    "350300": {
      "350301": "市辖区",
      "350302": "城厢区",
      "350303": "涵江区",
      "350304": "荔城区",
      "350305": "秀屿区",
      "350322": "仙游县"
    },
    "350400": {
      "350401": "市辖区",
      "350402": "梅列区",
      "350403": "三元区",
      "350421": "明溪县",
      "350423": "清流县",
      "350424": "宁化县",
      "350425": "大田县",
      "350426": "尤溪县",
      "350427": "沙县",
      "350428": "将乐县",
      "350429": "泰宁县",
      "350430": "建宁县",
      "350481": "永安市"
    },
    "350500": {
      "350501": "市辖区",
      "350502": "鲤城区",
      "350503": "丰泽区",
      "350504": "洛江区",
      "350505": "泉港区",
      "350521": "惠安县",
      "350524": "安溪县",
      "350525": "永春县",
      "350526": "德化县",
      "350527": "金门县",
      "350581": "石狮市",
      "350582": "晋江市",
      "350583": "南安市"
    },
    "350600": {
      "350601": "市辖区",
      "350602": "芗城区",
      "350603": "龙文区",
      "350622": "云霄县",
      "350623": "漳浦县",
      "350624": "诏安县",
      "350625": "长泰县",
      "350626": "东山县",
      "350627": "南靖县",
      "350628": "平和县",
      "350629": "华安县",
      "350681": "龙海市"
    },
    "350700": {
      "350701": "市辖区",
      "350702": "延平区",
      "350703": "建阳区",
      "350721": "顺昌县",
      "350722": "浦城县",
      "350723": "光泽县",
      "350724": "松溪县",
      "350725": "政和县",
      "350781": "邵武市",
      "350782": "武夷山市",
      "350783": "建瓯市"
    },
    "350800": {
      "350801": "市辖区",
      "350802": "新罗区",
      "350803": "永定区",
      "350821": "长汀县",
      "350823": "上杭县",
      "350824": "武平县",
      "350825": "连城县",
      "350881": "漳平市"
    },
    "350900": {
      "350901": "市辖区",
      "350902": "蕉城区",
      "350921": "霞浦县",
      "350922": "古田县",
      "350923": "屏南县",
      "350924": "寿宁县",
      "350925": "周宁县",
      "350926": "柘荣县",
      "350981": "福安市",
      "350982": "福鼎市"
    },
    "360000": {
      "360100": "南昌市",
      "360200": "景德镇市",
      "360300": "萍乡市",
      "360400": "九江市",
      "360500": "新余市",
      "360600": "鹰潭市",
      "360700": "赣州市",
      "360800": "吉安市",
      "360900": "宜春市",
      "361000": "抚州市",
      "361100": "上饶市"
    },
    "360100": {
      "360101": "市辖区",
      "360102": "东湖区",
      "360103": "西湖区",
      "360104": "青云谱区",
      "360105": "湾里区",
      "360111": "青山湖区",
      "360112": "新建区",
      "360121": "南昌县",
      "360123": "安义县",
      "360124": "进贤县"
    },
    "360200": {
      "360201": "市辖区",
      "360202": "昌江区",
      "360203": "珠山区",
      "360222": "浮梁县",
      "360281": "乐平市"
    },
    "360300": {
      "360301": "市辖区",
      "360302": "安源区",
      "360313": "湘东区",
      "360321": "莲花县",
      "360322": "上栗县",
      "360323": "芦溪县"
    },
    "360400": {
      "360401": "市辖区",
      "360402": "濂溪区",
      "360403": "浔阳区",
      "360421": "九江县",
      "360423": "武宁县",
      "360424": "修水县",
      "360425": "永修县",
      "360426": "德安县",
      "360428": "都昌县",
      "360429": "湖口县",
      "360430": "彭泽县",
      "360481": "瑞昌市",
      "360482": "共青城市",
      "360483": "庐山市"
    },
    "360500": {
      "360501": "市辖区",
      "360502": "渝水区",
      "360521": "分宜县"
    },
    "360600": {
      "360601": "市辖区",
      "360602": "月湖区",
      "360622": "余江县",
      "360681": "贵溪市"
    },
    "360700": {
      "360701": "市辖区",
      "360702": "章贡区",
      "360703": "南康区",
      "360721": "赣县",
      "360722": "信丰县",
      "360723": "大余县",
      "360724": "上犹县",
      "360725": "崇义县",
      "360726": "安远县",
      "360727": "龙南县",
      "360728": "定南县",
      "360729": "全南县",
      "360730": "宁都县",
      "360731": "于都县",
      "360732": "兴国县",
      "360733": "会昌县",
      "360734": "寻乌县",
      "360735": "石城县",
      "360781": "瑞金市"
    },
    "360800": {
      "360801": "市辖区",
      "360802": "吉州区",
      "360803": "青原区",
      "360821": "吉安县",
      "360822": "吉水县",
      "360823": "峡江县",
      "360824": "新干县",
      "360825": "永丰县",
      "360826": "泰和县",
      "360827": "遂川县",
      "360828": "万安县",
      "360829": "安福县",
      "360830": "永新县",
      "360881": "井冈山市"
    },
    "360900": {
      "360901": "市辖区",
      "360902": "袁州区",
      "360921": "奉新县",
      "360922": "万载县",
      "360923": "上高县",
      "360924": "宜丰县",
      "360925": "靖安县",
      "360926": "铜鼓县",
      "360981": "丰城市",
      "360982": "樟树市",
      "360983": "高安市"
    },
    "361000": {
      "361001": "市辖区",
      "361002": "临川区",
      "361021": "南城县",
      "361022": "黎川县",
      "361023": "南丰县",
      "361024": "崇仁县",
      "361025": "乐安县",
      "361026": "宜黄县",
      "361027": "金溪县",
      "361028": "资溪县",
      "361029": "东乡县",
      "361030": "广昌县"
    },
    "361100": {
      "361101": "市辖区",
      "361102": "信州区",
      "361103": "广丰区",
      "361121": "上饶县",
      "361123": "玉山县",
      "361124": "铅山县",
      "361125": "横峰县",
      "361126": "弋阳县",
      "361127": "余干县",
      "361128": "鄱阳县",
      "361129": "万年县",
      "361130": "婺源县",
      "361181": "德兴市"
    },
    "370000": {
      "370100": "济南市",
      "370200": "青岛市",
      "370300": "淄博市",
      "370400": "枣庄市",
      "370500": "东营市",
      "370600": "烟台市",
      "370700": "潍坊市",
      "370800": "济宁市",
      "370900": "泰安市",
      "371000": "威海市",
      "371100": "日照市",
      "371200": "莱芜市",
      "371300": "临沂市",
      "371400": "德州市",
      "371500": "聊城市",
      "371600": "滨州市",
      "371700": "菏泽市"
    },
    "370100": {
      "370101": "市辖区",
      "370102": "历下区",
      "370103": "市中区",
      "370104": "槐荫区",
      "370105": "天桥区",
      "370112": "历城区",
      "370113": "长清区",
      "370124": "平阴县",
      "370125": "济阳县",
      "370126": "商河县",
      "370181": "章丘市"
    },
    "370200": {
      "370201": "市辖区",
      "370202": "市南区",
      "370203": "市北区",
      "370211": "黄岛区",
      "370212": "崂山区",
      "370213": "李沧区",
      "370214": "城阳区",
      "370281": "胶州市",
      "370282": "即墨市",
      "370283": "平度市",
      "370285": "莱西市"
    },
    "370300": {
      "370301": "市辖区",
      "370302": "淄川区",
      "370303": "张店区",
      "370304": "博山区",
      "370305": "临淄区",
      "370306": "周村区",
      "370321": "桓台县",
      "370322": "高青县",
      "370323": "沂源县"
    },
    "370400": {
      "370401": "市辖区",
      "370402": "市中区",
      "370403": "薛城区",
      "370404": "峄城区",
      "370405": "台儿庄区",
      "370406": "山亭区",
      "370481": "滕州市"
    },
    "370500": {
      "370501": "市辖区",
      "370502": "东营区",
      "370503": "河口区",
      "370505": "垦利区",
      "370522": "利津县",
      "370523": "广饶县"
    },
    "370600": {
      "370601": "市辖区",
      "370602": "芝罘区",
      "370611": "福山区",
      "370612": "牟平区",
      "370613": "莱山区",
      "370634": "长岛县",
      "370681": "龙口市",
      "370682": "莱阳市",
      "370683": "莱州市",
      "370684": "蓬莱市",
      "370685": "招远市",
      "370686": "栖霞市",
      "370687": "海阳市"
    },
    "370700": {
      "370701": "市辖区",
      "370702": "潍城区",
      "370703": "寒亭区",
      "370704": "坊子区",
      "370705": "奎文区",
      "370724": "临朐县",
      "370725": "昌乐县",
      "370781": "青州市",
      "370782": "诸城市",
      "370783": "寿光市",
      "370784": "安丘市",
      "370785": "高密市",
      "370786": "昌邑市"
    },
    "370800": {
      "370801": "市辖区",
      "370811": "任城区",
      "370812": "兖州区",
      "370826": "微山县",
      "370827": "鱼台县",
      "370828": "金乡县",
      "370829": "嘉祥县",
      "370830": "汶上县",
      "370831": "泗水县",
      "370832": "梁山县",
      "370881": "曲阜市",
      "370883": "邹城市"
    },
    "370900": {
      "370901": "市辖区",
      "370902": "泰山区",
      "370911": "岱岳区",
      "370921": "宁阳县",
      "370923": "东平县",
      "370982": "新泰市",
      "370983": "肥城市"
    },
    "371000": {
      "371001": "市辖区",
      "371002": "环翠区",
      "371003": "文登区",
      "371082": "荣成市",
      "371083": "乳山市"
    },
    "371100": {
      "371101": "市辖区",
      "371102": "东港区",
      "371103": "岚山区",
      "371121": "五莲县",
      "371122": "莒县"
    },
    "371200": {
      "371201": "市辖区",
      "371202": "莱城区",
      "371203": "钢城区"
    },
    "371300": {
      "371301": "市辖区",
      "371302": "兰山区",
      "371311": "罗庄区",
      "371312": "河东区",
      "371321": "沂南县",
      "371322": "郯城县",
      "371323": "沂水县",
      "371324": "兰陵县",
      "371325": "费县",
      "371326": "平邑县",
      "371327": "莒南县",
      "371328": "蒙阴县",
      "371329": "临沭县"
    },
    "371400": {
      "371401": "市辖区",
      "371402": "德城区",
      "371403": "陵城区",
      "371422": "宁津县",
      "371423": "庆云县",
      "371424": "临邑县",
      "371425": "齐河县",
      "371426": "平原县",
      "371427": "夏津县",
      "371428": "武城县",
      "371481": "乐陵市",
      "371482": "禹城市"
    },
    "371500": {
      "371501": "市辖区",
      "371502": "东昌府区",
      "371521": "阳谷县",
      "371522": "莘县",
      "371523": "茌平县",
      "371524": "东阿县",
      "371525": "冠县",
      "371526": "高唐县",
      "371581": "临清市"
    },
    "371600": {
      "371601": "市辖区",
      "371602": "滨城区",
      "371603": "沾化区",
      "371621": "惠民县",
      "371622": "阳信县",
      "371623": "无棣县",
      "371625": "博兴县",
      "371626": "邹平县"
    },
    "371700": {
      "371701": "市辖区",
      "371702": "牡丹区",
      "371703": "定陶区",
      "371721": "曹县",
      "371722": "单县",
      "371723": "成武县",
      "371724": "巨野县",
      "371725": "郓城县",
      "371726": "鄄城县",
      "371728": "东明县"
    },
    "410000": {
      "410100": "郑州市",
      "410200": "开封市",
      "410300": "洛阳市",
      "410400": "平顶山市",
      "410500": "安阳市",
      "410600": "鹤壁市",
      "410700": "新乡市",
      "410800": "焦作市",
      "410900": "濮阳市",
      "411000": "许昌市",
      "411100": "漯河市",
      "411200": "三门峡市",
      "411300": "南阳市",
      "411400": "商丘市",
      "411500": "信阳市",
      "411600": "周口市",
      "411700": "驻马店市",
      "419000": "省直辖县级行政区划"
    },
    "410100": {
      "410101": "市辖区",
      "410102": "中原区",
      "410103": "二七区",
      "410104": "管城回族区",
      "410105": "金水区",
      "410106": "上街区",
      "410108": "惠济区",
      "410122": "中牟县",
      "410181": "巩义市",
      "410182": "荥阳市",
      "410183": "新密市",
      "410184": "新郑市",
      "410185": "登封市"
    },
    "410200": {
      "410201": "市辖区",
      "410202": "龙亭区",
      "410203": "顺河回族区",
      "410204": "鼓楼区",
      "410205": "禹王台区",
      "410211": "金明区",
      "410212": "祥符区",
      "410221": "杞县",
      "410222": "通许县",
      "410223": "尉氏县",
      "410225": "兰考县"
    },
    "410300": {
      "410301": "市辖区",
      "410302": "老城区",
      "410303": "西工区",
      "410304": "瀍河回族区",
      "410305": "涧西区",
      "410306": "吉利区",
      "410311": "洛龙区",
      "410322": "孟津县",
      "410323": "新安县",
      "410324": "栾川县",
      "410325": "嵩县",
      "410326": "汝阳县",
      "410327": "宜阳县",
      "410328": "洛宁县",
      "410329": "伊川县",
      "410381": "偃师市"
    },
    "410400": {
      "410401": "市辖区",
      "410402": "新华区",
      "410403": "卫东区",
      "410404": "石龙区",
      "410411": "湛河区",
      "410421": "宝丰县",
      "410422": "叶县",
      "410423": "鲁山县",
      "410425": "郏县",
      "410481": "舞钢市",
      "410482": "汝州市"
    },
    "410500": {
      "410501": "市辖区",
      "410502": "文峰区",
      "410503": "北关区",
      "410505": "殷都区",
      "410506": "龙安区",
      "410522": "安阳县",
      "410523": "汤阴县",
      "410526": "滑县",
      "410527": "内黄县",
      "410581": "林州市"
    },
    "410600": {
      "410601": "市辖区",
      "410602": "鹤山区",
      "410603": "山城区",
      "410611": "淇滨区",
      "410621": "浚县",
      "410622": "淇县"
    },
    "410700": {
      "410701": "市辖区",
      "410702": "红旗区",
      "410703": "卫滨区",
      "410704": "凤泉区",
      "410711": "牧野区",
      "410721": "新乡县",
      "410724": "获嘉县",
      "410725": "原阳县",
      "410726": "延津县",
      "410727": "封丘县",
      "410728": "长垣县",
      "410781": "卫辉市",
      "410782": "辉县市"
    },
    "410800": {
      "410801": "市辖区",
      "410802": "解放区",
      "410803": "中站区",
      "410804": "马村区",
      "410811": "山阳区",
      "410821": "修武县",
      "410822": "博爱县",
      "410823": "武陟县",
      "410825": "温县",
      "410882": "沁阳市",
      "410883": "孟州市"
    },
    "410900": {
      "410901": "市辖区",
      "410902": "华龙区",
      "410922": "清丰县",
      "410923": "南乐县",
      "410926": "范县",
      "410927": "台前县",
      "410928": "濮阳县"
    },
    "411000": {
      "411001": "市辖区",
      "411002": "魏都区",
      "411023": "许昌县",
      "411024": "鄢陵县",
      "411025": "襄城县",
      "411081": "禹州市",
      "411082": "长葛市"
    },
    "411100": {
      "411101": "市辖区",
      "411102": "源汇区",
      "411103": "郾城区",
      "411104": "召陵区",
      "411121": "舞阳县",
      "411122": "临颍县"
    },
    "411200": {
      "411201": "市辖区",
      "411202": "湖滨区",
      "411203": "陕州区",
      "411221": "渑池县",
      "411224": "卢氏县",
      "411281": "义马市",
      "411282": "灵宝市"
    },
    "411300": {
      "411301": "市辖区",
      "411302": "宛城区",
      "411303": "卧龙区",
      "411321": "南召县",
      "411322": "方城县",
      "411323": "西峡县",
      "411324": "镇平县",
      "411325": "内乡县",
      "411326": "淅川县",
      "411327": "社旗县",
      "411328": "唐河县",
      "411329": "新野县",
      "411330": "桐柏县",
      "411381": "邓州市"
    },
    "411400": {
      "411401": "市辖区",
      "411402": "梁园区",
      "411403": "睢阳区",
      "411421": "民权县",
      "411422": "睢县",
      "411423": "宁陵县",
      "411424": "柘城县",
      "411425": "虞城县",
      "411426": "夏邑县",
      "411481": "永城市"
    },
    "411500": {
      "411501": "市辖区",
      "411502": "浉河区",
      "411503": "平桥区",
      "411521": "罗山县",
      "411522": "光山县",
      "411523": "新县",
      "411524": "商城县",
      "411525": "固始县",
      "411526": "潢川县",
      "411527": "淮滨县",
      "411528": "息县"
    },
    "411600": {
      "411601": "市辖区",
      "411602": "川汇区",
      "411621": "扶沟县",
      "411622": "西华县",
      "411623": "商水县",
      "411624": "沈丘县",
      "411625": "郸城县",
      "411626": "淮阳县",
      "411627": "太康县",
      "411628": "鹿邑县",
      "411681": "项城市"
    },
    "411700": {
      "411701": "市辖区",
      "411702": "驿城区",
      "411721": "西平县",
      "411722": "上蔡县",
      "411723": "平舆县",
      "411724": "正阳县",
      "411725": "确山县",
      "411726": "泌阳县",
      "411727": "汝南县",
      "411728": "遂平县",
      "411729": "新蔡县"
    },
    "419000": {
      "419001": "济源市"
    },
    "420000": {
      "420100": "武汉市",
      "420200": "黄石市",
      "420300": "十堰市",
      "420500": "宜昌市",
      "420600": "襄阳市",
      "420700": "鄂州市",
      "420800": "荆门市",
      "420900": "孝感市",
      "421000": "荆州市",
      "421100": "黄冈市",
      "421200": "咸宁市",
      "421300": "随州市",
      "422800": "恩施土家族苗族自治州",
      "429000": "省直辖县级行政区划"
    },
    "420100": {
      "420101": "市辖区",
      "420102": "江岸区",
      "420103": "江汉区",
      "420104": "硚口区",
      "420105": "汉阳区",
      "420106": "武昌区",
      "420107": "青山区",
      "420111": "洪山区",
      "420112": "东西湖区",
      "420113": "汉南区",
      "420114": "蔡甸区",
      "420115": "江夏区",
      "420116": "黄陂区",
      "420117": "新洲区"
    },
    "420200": {
      "420201": "市辖区",
      "420202": "黄石港区",
      "420203": "西塞山区",
      "420204": "下陆区",
      "420205": "铁山区",
      "420222": "阳新县",
      "420281": "大冶市"
    },
    "420300": {
      "420301": "市辖区",
      "420302": "茅箭区",
      "420303": "张湾区",
      "420304": "郧阳区",
      "420322": "郧西县",
      "420323": "竹山县",
      "420324": "竹溪县",
      "420325": "房县",
      "420381": "丹江口市"
    },
    "420500": {
      "420501": "市辖区",
      "420502": "西陵区",
      "420503": "伍家岗区",
      "420504": "点军区",
      "420505": "猇亭区",
      "420506": "夷陵区",
      "420525": "远安县",
      "420526": "兴山县",
      "420527": "秭归县",
      "420528": "长阳土家族自治县",
      "420529": "五峰土家族自治县",
      "420581": "宜都市",
      "420582": "当阳市",
      "420583": "枝江市"
    },
    "420600": {
      "420601": "市辖区",
      "420602": "襄城区",
      "420606": "樊城区",
      "420607": "襄州区",
      "420624": "南漳县",
      "420625": "谷城县",
      "420626": "保康县",
      "420682": "老河口市",
      "420683": "枣阳市",
      "420684": "宜城市"
    },
    "420700": {
      "420701": "市辖区",
      "420702": "梁子湖区",
      "420703": "华容区",
      "420704": "鄂城区"
    },
    "420800": {
      "420801": "市辖区",
      "420802": "东宝区",
      "420804": "掇刀区",
      "420821": "京山县",
      "420822": "沙洋县",
      "420881": "钟祥市"
    },
    "420900": {
      "420901": "市辖区",
      "420902": "孝南区",
      "420921": "孝昌县",
      "420922": "大悟县",
      "420923": "云梦县",
      "420981": "应城市",
      "420982": "安陆市",
      "420984": "汉川市"
    },
    "421000": {
      "421001": "市辖区",
      "421002": "沙市区",
      "421003": "荆州区",
      "421022": "公安县",
      "421023": "监利县",
      "421024": "江陵县",
      "421081": "石首市",
      "421083": "洪湖市",
      "421087": "松滋市"
    },
    "421100": {
      "421101": "市辖区",
      "421102": "黄州区",
      "421121": "团风县",
      "421122": "红安县",
      "421123": "罗田县",
      "421124": "英山县",
      "421125": "浠水县",
      "421126": "蕲春县",
      "421127": "黄梅县",
      "421181": "麻城市",
      "421182": "武穴市"
    },
    "421200": {
      "421201": "市辖区",
      "421202": "咸安区",
      "421221": "嘉鱼县",
      "421222": "通城县",
      "421223": "崇阳县",
      "421224": "通山县",
      "421281": "赤壁市"
    },
    "421300": {
      "421301": "市辖区",
      "421303": "曾都区",
      "421321": "随县",
      "421381": "广水市"
    },
    "422800": {
      "422801": "恩施市",
      "422802": "利川市",
      "422822": "建始县",
      "422823": "巴东县",
      "422825": "宣恩县",
      "422826": "咸丰县",
      "422827": "来凤县",
      "422828": "鹤峰县"
    },
    "429000": {
      "429004": "仙桃市",
      "429005": "潜江市",
      "429006": "天门市",
      "429021": "神农架林区"
    },
    "430000": {
      "430100": "长沙市",
      "430200": "株洲市",
      "430300": "湘潭市",
      "430400": "衡阳市",
      "430500": "邵阳市",
      "430600": "岳阳市",
      "430700": "常德市",
      "430800": "张家界市",
      "430900": "益阳市",
      "431000": "郴州市",
      "431100": "永州市",
      "431200": "怀化市",
      "431300": "娄底市",
      "433100": "湘西土家族苗族自治州"
    },
    "430100": {
      "430101": "市辖区",
      "430102": "芙蓉区",
      "430103": "天心区",
      "430104": "岳麓区",
      "430105": "开福区",
      "430111": "雨花区",
      "430112": "望城区",
      "430121": "长沙县",
      "430124": "宁乡县",
      "430181": "浏阳市"
    },
    "430200": {
      "430201": "市辖区",
      "430202": "荷塘区",
      "430203": "芦淞区",
      "430204": "石峰区",
      "430211": "天元区",
      "430221": "株洲县",
      "430223": "攸县",
      "430224": "茶陵县",
      "430225": "炎陵县",
      "430281": "醴陵市"
    },
    "430300": {
      "430301": "市辖区",
      "430302": "雨湖区",
      "430304": "岳塘区",
      "430321": "湘潭县",
      "430381": "湘乡市",
      "430382": "韶山市"
    },
    "430400": {
      "430401": "市辖区",
      "430405": "珠晖区",
      "430406": "雁峰区",
      "430407": "石鼓区",
      "430408": "蒸湘区",
      "430412": "南岳区",
      "430421": "衡阳县",
      "430422": "衡南县",
      "430423": "衡山县",
      "430424": "衡东县",
      "430426": "祁东县",
      "430481": "耒阳市",
      "430482": "常宁市"
    },
    "430500": {
      "430501": "市辖区",
      "430502": "双清区",
      "430503": "大祥区",
      "430511": "北塔区",
      "430521": "邵东县",
      "430522": "新邵县",
      "430523": "邵阳县",
      "430524": "隆回县",
      "430525": "洞口县",
      "430527": "绥宁县",
      "430528": "新宁县",
      "430529": "城步苗族自治县",
      "430581": "武冈市"
    },
    "430600": {
      "430601": "市辖区",
      "430602": "岳阳楼区",
      "430603": "云溪区",
      "430611": "君山区",
      "430621": "岳阳县",
      "430623": "华容县",
      "430624": "湘阴县",
      "430626": "平江县",
      "430681": "汨罗市",
      "430682": "临湘市"
    },
    "430700": {
      "430701": "市辖区",
      "430702": "武陵区",
      "430703": "鼎城区",
      "430721": "安乡县",
      "430722": "汉寿县",
      "430723": "澧县",
      "430724": "临澧县",
      "430725": "桃源县",
      "430726": "石门县",
      "430781": "津市市"
    },
    "430800": {
      "430801": "市辖区",
      "430802": "永定区",
      "430811": "武陵源区",
      "430821": "慈利县",
      "430822": "桑植县"
    },
    "430900": {
      "430901": "市辖区",
      "430902": "资阳区",
      "430903": "赫山区",
      "430921": "南县",
      "430922": "桃江县",
      "430923": "安化县",
      "430981": "沅江市"
    },
    "431000": {
      "431001": "市辖区",
      "431002": "北湖区",
      "431003": "苏仙区",
      "431021": "桂阳县",
      "431022": "宜章县",
      "431023": "永兴县",
      "431024": "嘉禾县",
      "431025": "临武县",
      "431026": "汝城县",
      "431027": "桂东县",
      "431028": "安仁县",
      "431081": "资兴市"
    },
    "431100": {
      "431101": "市辖区",
      "431102": "零陵区",
      "431103": "冷水滩区",
      "431121": "祁阳县",
      "431122": "东安县",
      "431123": "双牌县",
      "431124": "道县",
      "431125": "江永县",
      "431126": "宁远县",
      "431127": "蓝山县",
      "431128": "新田县",
      "431129": "江华瑶族自治县"
    },
    "431200": {
      "431201": "市辖区",
      "431202": "鹤城区",
      "431221": "中方县",
      "431222": "沅陵县",
      "431223": "辰溪县",
      "431224": "溆浦县",
      "431225": "会同县",
      "431226": "麻阳苗族自治县",
      "431227": "新晃侗族自治县",
      "431228": "芷江侗族自治县",
      "431229": "靖州苗族侗族自治县",
      "431230": "通道侗族自治县",
      "431281": "洪江市"
    },
    "431300": {
      "431301": "市辖区",
      "431302": "娄星区",
      "431321": "双峰县",
      "431322": "新化县",
      "431381": "冷水江市",
      "431382": "涟源市"
    },
    "433100": {
      "433101": "吉首市",
      "433122": "泸溪县",
      "433123": "凤凰县",
      "433124": "花垣县",
      "433125": "保靖县",
      "433126": "古丈县",
      "433127": "永顺县",
      "433130": "龙山县"
    },
    "440000": {
      "440100": "广州市",
      "440200": "韶关市",
      "440300": "深圳市",
      "440400": "珠海市",
      "440500": "汕头市",
      "440600": "佛山市",
      "440700": "江门市",
      "440800": "湛江市",
      "440900": "茂名市",
      "441200": "肇庆市",
      "441300": "惠州市",
      "441400": "梅州市",
      "441500": "汕尾市",
      "441600": "河源市",
      "441700": "阳江市",
      "441800": "清远市",
      "441900": "东莞市",
      "442000": "中山市",
      "445100": "潮州市",
      "445200": "揭阳市",
      "445300": "云浮市"
    },
    "440100": {
      "440101": "市辖区",
      "440103": "荔湾区",
      "440104": "越秀区",
      "440105": "海珠区",
      "440106": "天河区",
      "440111": "白云区",
      "440112": "黄埔区",
      "440113": "番禺区",
      "440114": "花都区",
      "440115": "南沙区",
      "440117": "从化区",
      "440118": "增城区"
    },
    "440200": {
      "440201": "市辖区",
      "440203": "武江区",
      "440204": "浈江区",
      "440205": "曲江区",
      "440222": "始兴县",
      "440224": "仁化县",
      "440229": "翁源县",
      "440232": "乳源瑶族自治县",
      "440233": "新丰县",
      "440281": "乐昌市",
      "440282": "南雄市"
    },
    "440300": {
      "440301": "市辖区",
      "440303": "罗湖区",
      "440304": "福田区",
      "440305": "南山区",
      "440306": "宝安区",
      "440307": "龙岗区",
      "440308": "盐田区"
    },
    "440400": {
      "440401": "市辖区",
      "440402": "香洲区",
      "440403": "斗门区",
      "440404": "金湾区"
    },
    "440500": {
      "440501": "市辖区",
      "440507": "龙湖区",
      "440511": "金平区",
      "440512": "濠江区",
      "440513": "潮阳区",
      "440514": "潮南区",
      "440515": "澄海区",
      "440523": "南澳县"
    },
    "440600": {
      "440601": "市辖区",
      "440604": "禅城区",
      "440605": "南海区",
      "440606": "顺德区",
      "440607": "三水区",
      "440608": "高明区"
    },
    "440700": {
      "440701": "市辖区",
      "440703": "蓬江区",
      "440704": "江海区",
      "440705": "新会区",
      "440781": "台山市",
      "440783": "开平市",
      "440784": "鹤山市",
      "440785": "恩平市"
    },
    "440800": {
      "440801": "市辖区",
      "440802": "赤坎区",
      "440803": "霞山区",
      "440804": "坡头区",
      "440811": "麻章区",
      "440823": "遂溪县",
      "440825": "徐闻县",
      "440881": "廉江市",
      "440882": "雷州市",
      "440883": "吴川市"
    },
    "440900": {
      "440901": "市辖区",
      "440902": "茂南区",
      "440904": "电白区",
      "440981": "高州市",
      "440982": "化州市",
      "440983": "信宜市"
    },
    "441200": {
      "441201": "市辖区",
      "441202": "端州区",
      "441203": "鼎湖区",
      "441204": "高要区",
      "441223": "广宁县",
      "441224": "怀集县",
      "441225": "封开县",
      "441226": "德庆县",
      "441284": "四会市"
    },
    "441300": {
      "441301": "市辖区",
      "441302": "惠城区",
      "441303": "惠阳区",
      "441322": "博罗县",
      "441323": "惠东县",
      "441324": "龙门县"
    },
    "441400": {
      "441401": "市辖区",
      "441402": "梅江区",
      "441403": "梅县区",
      "441422": "大埔县",
      "441423": "丰顺县",
      "441424": "五华县",
      "441426": "平远县",
      "441427": "蕉岭县",
      "441481": "兴宁市"
    },
    "441500": {
      "441501": "市辖区",
      "441502": "城区",
      "441521": "海丰县",
      "441523": "陆河县",
      "441581": "陆丰市"
    },
    "441600": {
      "441601": "市辖区",
      "441602": "源城区",
      "441621": "紫金县",
      "441622": "龙川县",
      "441623": "连平县",
      "441624": "和平县",
      "441625": "东源县"
    },
    "441700": {
      "441701": "市辖区",
      "441702": "江城区",
      "441704": "阳东区",
      "441721": "阳西县",
      "441781": "阳春市"
    },
    "441800": {
      "441801": "市辖区",
      "441802": "清城区",
      "441803": "清新区",
      "441821": "佛冈县",
      "441823": "阳山县",
      "441825": "连山壮族瑶族自治县",
      "441826": "连南瑶族自治县",
      "441881": "英德市",
      "441882": "连州市"
    },
    "445100": {
      "445101": "市辖区",
      "445102": "湘桥区",
      "445103": "潮安区",
      "445122": "饶平县"
    },
    "445200": {
      "445201": "市辖区",
      "445202": "榕城区",
      "445203": "揭东区",
      "445222": "揭西县",
      "445224": "惠来县",
      "445281": "普宁市"
    },
    "445300": {
      "445301": "市辖区",
      "445302": "云城区",
      "445303": "云安区",
      "445321": "新兴县",
      "445322": "郁南县",
      "445381": "罗定市"
    },
    "450000": {
      "450100": "南宁市",
      "450200": "柳州市",
      "450300": "桂林市",
      "450400": "梧州市",
      "450500": "北海市",
      "450600": "防城港市",
      "450700": "钦州市",
      "450800": "贵港市",
      "450900": "玉林市",
      "451000": "百色市",
      "451100": "贺州市",
      "451200": "河池市",
      "451300": "来宾市",
      "451400": "崇左市"
    },
    "450100": {
      "450101": "市辖区",
      "450102": "兴宁区",
      "450103": "青秀区",
      "450105": "江南区",
      "450107": "西乡塘区",
      "450108": "良庆区",
      "450109": "邕宁区",
      "450110": "武鸣区",
      "450123": "隆安县",
      "450124": "马山县",
      "450125": "上林县",
      "450126": "宾阳县",
      "450127": "横县"
    },
    "450200": {
      "450201": "市辖区",
      "450202": "城中区",
      "450203": "鱼峰区",
      "450204": "柳南区",
      "450205": "柳北区",
      "450206": "柳江区",
      "450222": "柳城县",
      "450223": "鹿寨县",
      "450224": "融安县",
      "450225": "融水苗族自治县",
      "450226": "三江侗族自治县"
    },
    "450300": {
      "450301": "市辖区",
      "450302": "秀峰区",
      "450303": "叠彩区",
      "450304": "象山区",
      "450305": "七星区",
      "450311": "雁山区",
      "450312": "临桂区",
      "450321": "阳朔县",
      "450323": "灵川县",
      "450324": "全州县",
      "450325": "兴安县",
      "450326": "永福县",
      "450327": "灌阳县",
      "450328": "龙胜各族自治县",
      "450329": "资源县",
      "450330": "平乐县",
      "450331": "荔浦县",
      "450332": "恭城瑶族自治县"
    },
    "450400": {
      "450401": "市辖区",
      "450403": "万秀区",
      "450405": "长洲区",
      "450406": "龙圩区",
      "450421": "苍梧县",
      "450422": "藤县",
      "450423": "蒙山县",
      "450481": "岑溪市"
    },
    "450500": {
      "450501": "市辖区",
      "450502": "海城区",
      "450503": "银海区",
      "450512": "铁山港区",
      "450521": "合浦县"
    },
    "450600": {
      "450601": "市辖区",
      "450602": "港口区",
      "450603": "防城区",
      "450621": "上思县",
      "450681": "东兴市"
    },
    "450700": {
      "450701": "市辖区",
      "450702": "钦南区",
      "450703": "钦北区",
      "450721": "灵山县",
      "450722": "浦北县"
    },
    "450800": {
      "450801": "市辖区",
      "450802": "港北区",
      "450803": "港南区",
      "450804": "覃塘区",
      "450821": "平南县",
      "450881": "桂平市"
    },
    "450900": {
      "450901": "市辖区",
      "450902": "玉州区",
      "450903": "福绵区",
      "450921": "容县",
      "450922": "陆川县",
      "450923": "博白县",
      "450924": "兴业县",
      "450981": "北流市"
    },
    "451000": {
      "451001": "市辖区",
      "451002": "右江区",
      "451021": "田阳县",
      "451022": "田东县",
      "451023": "平果县",
      "451024": "德保县",
      "451026": "那坡县",
      "451027": "凌云县",
      "451028": "乐业县",
      "451029": "田林县",
      "451030": "西林县",
      "451031": "隆林各族自治县",
      "451081": "靖西市"
    },
    "451100": {
      "451101": "市辖区",
      "451102": "八步区",
      "451103": "平桂区",
      "451121": "昭平县",
      "451122": "钟山县",
      "451123": "富川瑶族自治县"
    },
    "451200": {
      "451201": "市辖区",
      "451202": "金城江区",
      "451221": "南丹县",
      "451222": "天峨县",
      "451223": "凤山县",
      "451224": "东兰县",
      "451225": "罗城仫佬族自治县",
      "451226": "环江毛南族自治县",
      "451227": "巴马瑶族自治县",
      "451228": "都安瑶族自治县",
      "451229": "大化瑶族自治县",
      "451281": "宜州市"
    },
    "451300": {
      "451301": "市辖区",
      "451302": "兴宾区",
      "451321": "忻城县",
      "451322": "象州县",
      "451323": "武宣县",
      "451324": "金秀瑶族自治县",
      "451381": "合山市"
    },
    "451400": {
      "451401": "市辖区",
      "451402": "江州区",
      "451421": "扶绥县",
      "451422": "宁明县",
      "451423": "龙州县",
      "451424": "大新县",
      "451425": "天等县",
      "451481": "凭祥市"
    },
    "460000": {
      "460100": "海口市",
      "460200": "三亚市",
      "460300": "三沙市",
      "460400": "儋州市",
      "469000": "省直辖县级行政区划"
    },
    "460100": {
      "460101": "市辖区",
      "460105": "秀英区",
      "460106": "龙华区",
      "460107": "琼山区",
      "460108": "美兰区"
    },
    "460200": {
      "460201": "市辖区",
      "460202": "海棠区",
      "460203": "吉阳区",
      "460204": "天涯区",
      "460205": "崖州区"
    },
    "469000": {
      "469001": "五指山市",
      "469002": "琼海市",
      "469005": "文昌市",
      "469006": "万宁市",
      "469007": "东方市",
      "469021": "定安县",
      "469022": "屯昌县",
      "469023": "澄迈县",
      "469024": "临高县",
      "469025": "白沙黎族自治县",
      "469026": "昌江黎族自治县",
      "469027": "乐东黎族自治县",
      "469028": "陵水黎族自治县",
      "469029": "保亭黎族苗族自治县",
      "469030": "琼中黎族苗族自治县"
    },
    "500000": {
      "500100": "市辖区",
      "500200": "县"
    },
    "500100": {
      "500101": "万州区",
      "500102": "涪陵区",
      "500103": "渝中区",
      "500104": "大渡口区",
      "500105": "江北区",
      "500106": "沙坪坝区",
      "500107": "九龙坡区",
      "500108": "南岸区",
      "500109": "北碚区",
      "500110": "綦江区",
      "500111": "大足区",
      "500112": "渝北区",
      "500113": "巴南区",
      "500114": "黔江区",
      "500115": "长寿区",
      "500116": "江津区",
      "500117": "合川区",
      "500118": "永川区",
      "500119": "南川区",
      "500120": "璧山区",
      "500151": "铜梁区",
      "500152": "潼南区",
      "500153": "荣昌区",
      "500154": "开州区"
    },
    "500200": {
      "500228": "梁平县",
      "500229": "城口县",
      "500230": "丰都县",
      "500231": "垫江县",
      "500232": "武隆县",
      "500233": "忠县",
      "500235": "云阳县",
      "500236": "奉节县",
      "500237": "巫山县",
      "500238": "巫溪县",
      "500240": "石柱土家族自治县",
      "500241": "秀山土家族苗族自治县",
      "500242": "酉阳土家族苗族自治县",
      "500243": "彭水苗族土家族自治县"
    },
    "510000": {
      "510100": "成都市",
      "510300": "自贡市",
      "510400": "攀枝花市",
      "510500": "泸州市",
      "510600": "德阳市",
      "510700": "绵阳市",
      "510800": "广元市",
      "510900": "遂宁市",
      "511000": "内江市",
      "511100": "乐山市",
      "511300": "南充市",
      "511400": "眉山市",
      "511500": "宜宾市",
      "511600": "广安市",
      "511700": "达州市",
      "511800": "雅安市",
      "511900": "巴中市",
      "512000": "资阳市",
      "513200": "阿坝藏族羌族自治州",
      "513300": "甘孜藏族自治州",
      "513400": "凉山彝族自治州市"
    },
    "510100": {
      "510101": "市辖区",
      "510104": "锦江区",
      "510105": "青羊区",
      "510106": "金牛区",
      "510107": "武侯区",
      "510108": "成华区",
      "510112": "龙泉驿区",
      "510113": "青白江区",
      "510114": "新都区",
      "510115": "温江区",
      "510116": "双流区",
      "510121": "金堂县",
      "510124": "郫县",
      "510129": "大邑县",
      "510131": "蒲江县",
      "510132": "新津县",
      "510181": "都江堰市",
      "510182": "彭州市",
      "510183": "邛崃市",
      "510184": "崇州市",
      "510185": "简阳市"
    },
    "510300": {
      "510301": "市辖区",
      "510302": "自流井区",
      "510303": "贡井区",
      "510304": "大安区",
      "510311": "沿滩区",
      "510321": "荣县",
      "510322": "富顺县"
    },
    "510400": {
      "510401": "市辖区",
      "510402": "东区",
      "510403": "西区",
      "510411": "仁和区",
      "510421": "米易县",
      "510422": "盐边县"
    },
    "510500": {
      "510501": "市辖区",
      "510502": "江阳区",
      "510503": "纳溪区",
      "510504": "龙马潭区",
      "510521": "泸县",
      "510522": "合江县",
      "510524": "叙永县",
      "510525": "古蔺县"
    },
    "510600": {
      "510601": "市辖区",
      "510603": "旌阳区",
      "510623": "中江县",
      "510626": "罗江县",
      "510681": "广汉市",
      "510682": "什邡市",
      "510683": "绵竹市"
    },
    "510700": {
      "510701": "市辖区",
      "510703": "涪城区",
      "510704": "游仙区",
      "510705": "安州区",
      "510722": "三台县",
      "510723": "盐亭县",
      "510725": "梓潼县",
      "510726": "北川羌族自治县",
      "510727": "平武县",
      "510781": "江油市"
    },
    "510800": {
      "510801": "市辖区",
      "510802": "利州区",
      "510811": "昭化区",
      "510812": "朝天区",
      "510821": "旺苍县",
      "510822": "青川县",
      "510823": "剑阁县",
      "510824": "苍溪县"
    },
    "510900": {
      "510901": "市辖区",
      "510903": "船山区",
      "510904": "安居区",
      "510921": "蓬溪县",
      "510922": "射洪县",
      "510923": "大英县"
    },
    "511000": {
      "511001": "市辖区",
      "511002": "市中区",
      "511011": "东兴区",
      "511024": "威远县",
      "511025": "资中县",
      "511028": "隆昌县"
    },
    "511100": {
      "511101": "市辖区",
      "511102": "市中区",
      "511111": "沙湾区",
      "511112": "五通桥区",
      "511113": "金口河区",
      "511123": "犍为县",
      "511124": "井研县",
      "511126": "夹江县",
      "511129": "沐川县",
      "511132": "峨边彝族自治县",
      "511133": "马边彝族自治县",
      "511181": "峨眉山市"
    },
    "511300": {
      "511301": "市辖区",
      "511302": "顺庆区",
      "511303": "高坪区",
      "511304": "嘉陵区",
      "511321": "南部县",
      "511322": "营山县",
      "511323": "蓬安县",
      "511324": "仪陇县",
      "511325": "西充县",
      "511381": "阆中市"
    },
    "511400": {
      "511401": "市辖区",
      "511402": "东坡区",
      "511403": "彭山区",
      "511421": "仁寿县",
      "511423": "洪雅县",
      "511424": "丹棱县",
      "511425": "青神县"
    },
    "511500": {
      "511501": "市辖区",
      "511502": "翠屏区",
      "511503": "南溪区",
      "511521": "宜宾县",
      "511523": "江安县",
      "511524": "长宁县",
      "511525": "高县",
      "511526": "珙县",
      "511527": "筠连县",
      "511528": "兴文县",
      "511529": "屏山县"
    },
    "511600": {
      "511601": "市辖区",
      "511602": "广安区",
      "511603": "前锋区",
      "511621": "岳池县",
      "511622": "武胜县",
      "511623": "邻水县",
      "511681": "华蓥市"
    },
    "511700": {
      "511701": "市辖区",
      "511702": "通川区",
      "511703": "达川区",
      "511722": "宣汉县",
      "511723": "开江县",
      "511724": "大竹县",
      "511725": "渠县",
      "511781": "万源市"
    },
    "511800": {
      "511801": "市辖区",
      "511802": "雨城区",
      "511803": "名山区",
      "511822": "荥经县",
      "511823": "汉源县",
      "511824": "石棉县",
      "511825": "天全县",
      "511826": "芦山县",
      "511827": "宝兴县"
    },
    "511900": {
      "511901": "市辖区",
      "511902": "巴州区",
      "511903": "恩阳区",
      "511921": "通江县",
      "511922": "南江县",
      "511923": "平昌县"
    },
    "512000": {
      "512001": "市辖区",
      "512002": "雁江区",
      "512021": "安岳县",
      "512022": "乐至县"
    },
    "513200": {
      "513201": "马尔康市",
      "513221": "汶川县",
      "513222": "理县",
      "513223": "茂县",
      "513224": "松潘县",
      "513225": "九寨沟县",
      "513226": "金川县",
      "513227": "小金县",
      "513228": "黑水县",
      "513230": "壤塘县",
      "513231": "阿坝县",
      "513232": "若尔盖县",
      "513233": "红原县"
    },
    "513300": {
      "513301": "康定市",
      "513322": "泸定县",
      "513323": "丹巴县",
      "513324": "九龙县",
      "513325": "雅江县",
      "513326": "道孚县",
      "513327": "炉霍县",
      "513328": "甘孜县",
      "513329": "新龙县",
      "513330": "德格县",
      "513331": "白玉县",
      "513332": "石渠县",
      "513333": "色达县",
      "513334": "理塘县",
      "513335": "巴塘县",
      "513336": "乡城县",
      "513337": "稻城县",
      "513338": "得荣县"
    },
    "513400": {
      "513401": "西昌市",
      "513422": "木里藏族自治县",
      "513423": "盐源县",
      "513424": "德昌县",
      "513425": "会理县",
      "513426": "会东县",
      "513427": "宁南县",
      "513428": "普格县",
      "513429": "布拖县",
      "513430": "金阳县",
      "513431": "昭觉县",
      "513432": "喜德县",
      "513433": "冕宁县",
      "513434": "越西县",
      "513435": "甘洛县",
      "513436": "美姑县",
      "513437": "雷波县"
    },
    "520000": {
      "520100": "贵阳市",
      "520200": "六盘水市",
      "520300": "遵义市",
      "520400": "安顺市",
      "520500": "毕节市",
      "520600": "铜仁市",
      "522300": "黔西南布依族苗族自治州",
      "522600": "黔东南苗族侗族自治州",
      "522700": "黔南布依族苗族自治州"
    },
    "520100": {
      "520101": "市辖区",
      "520102": "南明区",
      "520103": "云岩区",
      "520111": "花溪区",
      "520112": "乌当区",
      "520113": "白云区",
      "520115": "观山湖区",
      "520121": "开阳县",
      "520122": "息烽县",
      "520123": "修文县",
      "520181": "清镇市"
    },
    "520200": {
      "520201": "钟山区",
      "520203": "六枝特区",
      "520221": "水城县",
      "520222": "盘县"
    },
    "520300": {
      "520301": "市辖区",
      "520302": "红花岗区",
      "520303": "汇川区",
      "520304": "播州区",
      "520322": "桐梓县",
      "520323": "绥阳县",
      "520324": "正安县",
      "520325": "道真仡佬族苗族自治县",
      "520326": "务川仡佬族苗族自治县",
      "520327": "凤冈县",
      "520328": "湄潭县",
      "520329": "余庆县",
      "520330": "习水县",
      "520381": "赤水市",
      "520382": "仁怀市"
    },
    "520400": {
      "520401": "市辖区",
      "520402": "西秀区",
      "520403": "平坝区",
      "520422": "普定县",
      "520423": "镇宁布依族苗族自治县",
      "520424": "关岭布依族苗族自治县",
      "520425": "紫云苗族布依族自治县"
    },
    "520500": {
      "520501": "市辖区",
      "520502": "七星关区",
      "520521": "大方县",
      "520522": "黔西县",
      "520523": "金沙县",
      "520524": "织金县",
      "520525": "纳雍县",
      "520526": "威宁彝族回族苗族自治县",
      "520527": "赫章县"
    },
    "520600": {
      "520601": "市辖区",
      "520602": "碧江区",
      "520603": "万山区",
      "520621": "江口县",
      "520622": "玉屏侗族自治县",
      "520623": "石阡县",
      "520624": "思南县",
      "520625": "印江土家族苗族自治县",
      "520626": "德江县",
      "520627": "沿河土家族自治县",
      "520628": "松桃苗族自治县"
    },
    "522300": {
      "522301": "兴义市",
      "522322": "兴仁县",
      "522323": "普安县",
      "522324": "晴隆县",
      "522325": "贞丰县",
      "522326": "望谟县",
      "522327": "册亨县",
      "522328": "安龙县"
    },
    "522600": {
      "522601": "凯里市",
      "522622": "黄平县",
      "522623": "施秉县",
      "522624": "三穗县",
      "522625": "镇远县",
      "522626": "岑巩县",
      "522627": "天柱县",
      "522628": "锦屏县",
      "522629": "剑河县",
      "522630": "台江县",
      "522631": "黎平县",
      "522632": "榕江县",
      "522633": "从江县",
      "522634": "雷山县",
      "522635": "麻江县",
      "522636": "丹寨县"
    },
    "522700": {
      "522701": "都匀市",
      "522702": "福泉市",
      "522722": "荔波县",
      "522723": "贵定县",
      "522725": "瓮安县",
      "522726": "独山县",
      "522727": "平塘县",
      "522728": "罗甸县",
      "522729": "长顺县",
      "522730": "龙里县",
      "522731": "惠水县",
      "522732": "三都水族自治县"
    },
    "530000": {
      "530100": "昆明市",
      "530300": "曲靖市",
      "530400": "玉溪市",
      "530500": "保山市",
      "530600": "昭通市",
      "530700": "丽江市",
      "530800": "普洱市",
      "530900": "临沧市",
      "532300": "楚雄彝族自治州",
      "532500": "红河哈尼族彝族自治州",
      "532600": "文山壮族苗族自治州",
      "532800": "西双版纳傣族自治州",
      "532900": "大理白族自治州",
      "533100": "德宏傣族景颇族自治州",
      "533300": "怒江傈僳族自治州",
      "533400": "迪庆藏族自治州"
    },
    "530100": {
      "530101": "市辖区",
      "530102": "五华区",
      "530103": "盘龙区",
      "530111": "官渡区",
      "530112": "西山区",
      "530113": "东川区",
      "530114": "呈贡区",
      "530122": "晋宁县",
      "530124": "富民县",
      "530125": "宜良县",
      "530126": "石林彝族自治县",
      "530127": "嵩明县",
      "530128": "禄劝彝族苗族自治县",
      "530129": "寻甸回族彝族自治县",
      "530181": "安宁市"
    },
    "530300": {
      "530301": "市辖区",
      "530302": "麒麟区",
      "530303": "沾益区",
      "530321": "马龙县",
      "530322": "陆良县",
      "530323": "师宗县",
      "530324": "罗平县",
      "530325": "富源县",
      "530326": "会泽县",
      "530381": "宣威市"
    },
    "530400": {
      "530401": "市辖区",
      "530402": "红塔区",
      "530403": "江川区",
      "530422": "澄江县",
      "530423": "通海县",
      "530424": "华宁县",
      "530425": "易门县",
      "530426": "峨山彝族自治县",
      "530427": "新平彝族傣族自治县",
      "530428": "元江哈尼族彝族傣族自治县"
    },
    "530500": {
      "530501": "市辖区",
      "530502": "隆阳区",
      "530521": "施甸县",
      "530523": "龙陵县",
      "530524": "昌宁县",
      "530581": "腾冲市"
    },
    "530600": {
      "530601": "市辖区",
      "530602": "昭阳区",
      "530621": "鲁甸县",
      "530622": "巧家县",
      "530623": "盐津县",
      "530624": "大关县",
      "530625": "永善县",
      "530626": "绥江县",
      "530627": "镇雄县",
      "530628": "彝良县",
      "530629": "威信县",
      "530630": "水富县"
    },
    "530700": {
      "530701": "市辖区",
      "530702": "古城区",
      "530721": "玉龙纳西族自治县",
      "530722": "永胜县",
      "530723": "华坪县",
      "530724": "宁蒗彝族自治县"
    },
    "530800": {
      "530801": "市辖区",
      "530802": "思茅区",
      "530821": "宁洱哈尼族彝族自治县",
      "530822": "墨江哈尼族自治县",
      "530823": "景东彝族自治县",
      "530824": "景谷傣族彝族自治县",
      "530825": "镇沅彝族哈尼族拉祜族自治县",
      "530826": "江城哈尼族彝族自治县",
      "530827": "孟连傣族拉祜族佤族自治县",
      "530828": "澜沧拉祜族自治县",
      "530829": "西盟佤族自治县"
    },
    "530900": {
      "530901": "市辖区",
      "530902": "临翔区",
      "530921": "凤庆县",
      "530922": "云县",
      "530923": "永德县",
      "530924": "镇康县",
      "530925": "双江拉祜族佤族布朗族傣族自治县",
      "530926": "耿马傣族佤族自治县",
      "530927": "沧源佤族自治县"
    },
    "532300": {
      "532301": "楚雄市",
      "532322": "双柏县",
      "532323": "牟定县",
      "532324": "南华县",
      "532325": "姚安县",
      "532326": "大姚县",
      "532327": "永仁县",
      "532328": "元谋县",
      "532329": "武定县",
      "532331": "禄丰县"
    },
    "532500": {
      "532501": "个旧市",
      "532502": "开远市",
      "532503": "蒙自市",
      "532504": "弥勒市",
      "532523": "屏边苗族自治县",
      "532524": "建水县",
      "532525": "石屏县",
      "532527": "泸西县",
      "532528": "元阳县",
      "532529": "红河县",
      "532530": "金平苗族瑶族傣族自治县",
      "532531": "绿春县",
      "532532": "河口瑶族自治县"
    },
    "532600": {
      "532601": "文山市",
      "532622": "砚山县",
      "532623": "西畴县",
      "532624": "麻栗坡县",
      "532625": "马关县",
      "532626": "丘北县",
      "532627": "广南县",
      "532628": "富宁县"
    },
    "532800": {
      "532801": "景洪市",
      "532822": "勐海县",
      "532823": "勐腊县"
    },
    "532900": {
      "532901": "大理市",
      "532922": "漾濞彝族自治县",
      "532923": "祥云县",
      "532924": "宾川县",
      "532925": "弥渡县",
      "532926": "南涧彝族自治县",
      "532927": "巍山彝族回族自治县",
      "532928": "永平县",
      "532929": "云龙县",
      "532930": "洱源县",
      "532931": "剑川县",
      "532932": "鹤庆县"
    },
    "533100": {
      "533102": "瑞丽市",
      "533103": "芒市",
      "533122": "梁河县",
      "533123": "盈江县",
      "533124": "陇川县"
    },
    "533300": {
      "533301": "泸水市",
      "533323": "福贡县",
      "533324": "贡山独龙族怒族自治县",
      "533325": "兰坪白族普米族自治县"
    },
    "533400": {
      "533401": "香格里拉市",
      "533422": "德钦县",
      "533423": "维西傈僳族自治县"
    },
    "540000": {
      "540100": "拉萨市",
      "540200": "日喀则市",
      "540300": "昌都市",
      "540400": "林芝市",
      "540500": "山南市",
      "542400": "那曲地区",
      "542500": "阿里地区"
    },
    "540100": {
      "540101": "市辖区",
      "540102": "城关区",
      "540103": "堆龙德庆区",
      "540121": "林周县",
      "540122": "当雄县",
      "540123": "尼木县",
      "540124": "曲水县",
      "540126": "达孜县",
      "540127": "墨竹工卡县"
    },
    "540200": {
      "540202": "桑珠孜区",
      "540221": "南木林县",
      "540222": "江孜县",
      "540223": "定日县",
      "540224": "萨迦县",
      "540225": "拉孜县",
      "540226": "昂仁县",
      "540227": "谢通门县",
      "540228": "白朗县",
      "540229": "仁布县",
      "540230": "康马县",
      "540231": "定结县",
      "540232": "仲巴县",
      "540233": "亚东县",
      "540234": "吉隆县",
      "540235": "聂拉木县",
      "540236": "萨嘎县",
      "540237": "岗巴县"
    },
    "540300": {
      "540302": "卡若区",
      "540321": "江达县",
      "540322": "贡觉县",
      "540323": "类乌齐县",
      "540324": "丁青县",
      "540325": "察雅县",
      "540326": "八宿县",
      "540327": "左贡县",
      "540328": "芒康县",
      "540329": "洛隆县",
      "540330": "边坝县"
    },
    "540400": {
      "540402": "巴宜区",
      "540421": "工布江达县",
      "540422": "米林县",
      "540423": "墨脱县",
      "540424": "波密县",
      "540425": "察隅县",
      "540426": "朗县"
    },
    "540500": {
      "540501": "市辖区",
      "540502": "乃东区",
      "540521": "扎囊县",
      "540522": "贡嘎县",
      "540523": "桑日县",
      "540524": "琼结县",
      "540525": "曲松县",
      "540526": "措美县",
      "540527": "洛扎县",
      "540528": "加查县",
      "540529": "隆子县",
      "540530": "错那县",
      "540531": "浪卡子县"
    },
    "542400": {
      "542421": "那曲县",
      "542422": "嘉黎县",
      "542423": "比如县",
      "542424": "聂荣县",
      "542425": "安多县",
      "542426": "申扎县",
      "542427": "索县",
      "542428": "班戈县",
      "542429": "巴青县",
      "542430": "尼玛县",
      "542431": "双湖县"
    },
    "542500": {
      "542521": "普兰县",
      "542522": "札达县",
      "542523": "噶尔县",
      "542524": "日土县",
      "542525": "革吉县",
      "542526": "改则县",
      "542527": "措勤县"
    },
    "610000": {
      "610100": "西安市",
      "610200": "铜川市",
      "610300": "宝鸡市",
      "610400": "咸阳市",
      "610500": "渭南市",
      "610600": "延安市",
      "610700": "汉中市",
      "610800": "榆林市",
      "610900": "安康市",
      "611000": "商洛市"
    },
    "610100": {
      "610101": "市辖区",
      "610102": "新城区",
      "610103": "碑林区",
      "610104": "莲湖区",
      "610111": "灞桥区",
      "610112": "未央区",
      "610113": "雁塔区",
      "610114": "阎良区",
      "610115": "临潼区",
      "610116": "长安区",
      "610117": "高陵区",
      "610122": "蓝田县",
      "610124": "周至县",
      "610125": "户县"
    },
    "610200": {
      "610201": "市辖区",
      "610202": "王益区",
      "610203": "印台区",
      "610204": "耀州区",
      "610222": "宜君县"
    },
    "610300": {
      "610301": "市辖区",
      "610302": "渭滨区",
      "610303": "金台区",
      "610304": "陈仓区",
      "610322": "凤翔县",
      "610323": "岐山县",
      "610324": "扶风县",
      "610326": "眉县",
      "610327": "陇县",
      "610328": "千阳县",
      "610329": "麟游县",
      "610330": "凤县",
      "610331": "太白县"
    },
    "610400": {
      "610401": "市辖区",
      "610402": "秦都区",
      "610403": "杨陵区",
      "610404": "渭城区",
      "610422": "三原县",
      "610423": "泾阳县",
      "610424": "乾县",
      "610425": "礼泉县",
      "610426": "永寿县",
      "610427": "彬县",
      "610428": "长武县",
      "610429": "旬邑县",
      "610430": "淳化县",
      "610431": "武功县",
      "610481": "兴平市"
    },
    "610500": {
      "610501": "市辖区",
      "610502": "临渭区",
      "610503": "华州区",
      "610522": "潼关县",
      "610523": "大荔县",
      "610524": "合阳县",
      "610525": "澄城县",
      "610526": "蒲城县",
      "610527": "白水县",
      "610528": "富平县",
      "610581": "韩城市",
      "610582": "华阴市"
    },
    "610600": {
      "610601": "市辖区",
      "610602": "宝塔区",
      "610603": "安塞区",
      "610621": "延长县",
      "610622": "延川县",
      "610623": "子长县",
      "610625": "志丹县",
      "610626": "吴起县",
      "610627": "甘泉县",
      "610628": "富县",
      "610629": "洛川县",
      "610630": "宜川县",
      "610631": "黄龙县",
      "610632": "黄陵县"
    },
    "610700": {
      "610701": "市辖区",
      "610702": "汉台区",
      "610721": "南郑县",
      "610722": "城固县",
      "610723": "洋县",
      "610724": "西乡县",
      "610725": "勉县",
      "610726": "宁强县",
      "610727": "略阳县",
      "610728": "镇巴县",
      "610729": "留坝县",
      "610730": "佛坪县"
    },
    "610800": {
      "610801": "市辖区",
      "610802": "榆阳区",
      "610803": "横山区",
      "610821": "神木县",
      "610822": "府谷县",
      "610824": "靖边县",
      "610825": "定边县",
      "610826": "绥德县",
      "610827": "米脂县",
      "610828": "佳县",
      "610829": "吴堡县",
      "610830": "清涧县",
      "610831": "子洲县"
    },
    "610900": {
      "610901": "市辖区",
      "610902": "汉滨区",
      "610921": "汉阴县",
      "610922": "石泉县",
      "610923": "宁陕县",
      "610924": "紫阳县",
      "610925": "岚皋县",
      "610926": "平利县",
      "610927": "镇坪县",
      "610928": "旬阳县",
      "610929": "白河县"
    },
    "611000": {
      "611001": "市辖区",
      "611002": "商州区",
      "611021": "洛南县",
      "611022": "丹凤县",
      "611023": "商南县",
      "611024": "山阳县",
      "611025": "镇安县",
      "611026": "柞水县"
    },
    "620000": {
      "620100": "兰州市",
      "620200": "嘉峪关市",
      "620300": "金昌市",
      "620400": "白银市",
      "620500": "天水市",
      "620600": "武威市",
      "620700": "张掖市",
      "620800": "平凉市",
      "620900": "酒泉市",
      "621000": "庆阳市",
      "621100": "定西市",
      "621200": "陇南市",
      "622900": "临夏回族自治州",
      "623000": "甘南藏族自治州"
    },
    "620100": {
      "620101": "市辖区",
      "620102": "城关区",
      "620103": "七里河区",
      "620104": "西固区",
      "620105": "安宁区",
      "620111": "红古区",
      "620121": "永登县",
      "620122": "皋兰县",
      "620123": "榆中县"
    },
    "620200": {
      "620201": "市辖区"
    },
    "620300": {
      "620301": "市辖区",
      "620302": "金川区",
      "620321": "永昌县"
    },
    "620400": {
      "620401": "市辖区",
      "620402": "白银区",
      "620403": "平川区",
      "620421": "靖远县",
      "620422": "会宁县",
      "620423": "景泰县"
    },
    "620500": {
      "620501": "市辖区",
      "620502": "秦州区",
      "620503": "麦积区",
      "620521": "清水县",
      "620522": "秦安县",
      "620523": "甘谷县",
      "620524": "武山县",
      "620525": "张家川回族自治县"
    },
    "620600": {
      "620601": "市辖区",
      "620602": "凉州区",
      "620621": "民勤县",
      "620622": "古浪县",
      "620623": "天祝藏族自治县"
    },
    "620700": {
      "620701": "市辖区",
      "620702": "甘州区",
      "620721": "肃南裕固族自治县",
      "620722": "民乐县",
      "620723": "临泽县",
      "620724": "高台县",
      "620725": "山丹县"
    },
    "620800": {
      "620801": "市辖区",
      "620802": "崆峒区",
      "620821": "泾川县",
      "620822": "灵台县",
      "620823": "崇信县",
      "620824": "华亭县",
      "620825": "庄浪县",
      "620826": "静宁县"
    },
    "620900": {
      "620901": "市辖区",
      "620902": "肃州区",
      "620921": "金塔县",
      "620922": "瓜州县",
      "620923": "肃北蒙古族自治县",
      "620924": "阿克塞哈萨克族自治县",
      "620981": "玉门市",
      "620982": "敦煌市"
    },
    "621000": {
      "621001": "市辖区",
      "621002": "西峰区",
      "621021": "庆城县",
      "621022": "环县",
      "621023": "华池县",
      "621024": "合水县",
      "621025": "正宁县",
      "621026": "宁县",
      "621027": "镇原县"
    },
    "621100": {
      "621101": "市辖区",
      "621102": "安定区",
      "621121": "通渭县",
      "621122": "陇西县",
      "621123": "渭源县",
      "621124": "临洮县",
      "621125": "漳县",
      "621126": "岷县"
    },
    "621200": {
      "621201": "市辖区",
      "621202": "武都区",
      "621221": "成县",
      "621222": "文县",
      "621223": "宕昌县",
      "621224": "康县",
      "621225": "西和县",
      "621226": "礼县",
      "621227": "徽县",
      "621228": "两当县"
    },
    "622900": {
      "622901": "临夏市",
      "622921": "临夏县",
      "622922": "康乐县",
      "622923": "永靖县",
      "622924": "广河县",
      "622925": "和政县",
      "622926": "东乡族自治县",
      "622927": "积石山保安族东乡族撒拉族自治县"
    },
    "623000": {
      "623001": "合作市",
      "623021": "临潭县",
      "623022": "卓尼县",
      "623023": "舟曲县",
      "623024": "迭部县",
      "623025": "玛曲县",
      "623026": "碌曲县",
      "623027": "夏河县"
    },
    "630000": {
      "630100": "西宁市",
      "630200": "海东市",
      "632200": "海北藏族自治州",
      "632300": "黄南藏族自治州",
      "632500": "海南藏族自治州",
      "632600": "果洛藏族自治州",
      "632700": "玉树藏族自治州",
      "632800": "海西蒙古族藏族自治州"
    },
    "630100": {
      "630101": "市辖区",
      "630102": "城东区",
      "630103": "城中区",
      "630104": "城西区",
      "630105": "城北区",
      "630121": "大通回族土族自治县",
      "630122": "湟中县",
      "630123": "湟源县"
    },
    "630200": {
      "630202": "乐都区",
      "630203": "平安区",
      "630222": "民和回族土族自治县",
      "630223": "互助土族自治县",
      "630224": "化隆回族自治县",
      "630225": "循化撒拉族自治县"
    },
    "632200": {
      "632221": "门源回族自治县",
      "632222": "祁连县",
      "632223": "海晏县",
      "632224": "刚察县"
    },
    "632300": {
      "632321": "同仁县",
      "632322": "尖扎县",
      "632323": "泽库县",
      "632324": "河南蒙古族自治县"
    },
    "632500": {
      "632521": "共和县",
      "632522": "同德县",
      "632523": "贵德县",
      "632524": "兴海县",
      "632525": "贵南县"
    },
    "632600": {
      "632621": "玛沁县",
      "632622": "班玛县",
      "632623": "甘德县",
      "632624": "达日县",
      "632625": "久治县",
      "632626": "玛多县"
    },
    "632700": {
      "632701": "玉树市",
      "632722": "杂多县",
      "632723": "称多县",
      "632724": "治多县",
      "632725": "囊谦县",
      "632726": "曲麻莱县"
    },
    "632800": {
      "632801": "格尔木市",
      "632802": "德令哈市",
      "632821": "乌兰县",
      "632822": "都兰县",
      "632823": "天峻县"
    },
    "640000": {
      "640100": "银川市",
      "640200": "石嘴山市",
      "640300": "吴忠市",
      "640400": "固原市",
      "640500": "中卫市"
    },
    "640100": {
      "640101": "市辖区",
      "640104": "兴庆区",
      "640105": "西夏区",
      "640106": "金凤区",
      "640121": "永宁县",
      "640122": "贺兰县",
      "640181": "灵武市"
    },
    "640200": {
      "640201": "市辖区",
      "640202": "大武口区",
      "640205": "惠农区",
      "640221": "平罗县"
    },
    "640300": {
      "640301": "市辖区",
      "640302": "利通区",
      "640303": "红寺堡区",
      "640323": "盐池县",
      "640324": "同心县",
      "640381": "青铜峡市"
    },
    "640400": {
      "640401": "市辖区",
      "640402": "原州区",
      "640422": "西吉县",
      "640423": "隆德县",
      "640424": "泾源县",
      "640425": "彭阳县"
    },
    "640500": {
      "640501": "市辖区",
      "640502": "沙坡头区",
      "640521": "中宁县",
      "640522": "海原县"
    },
    "650000": {
      "650100": "乌鲁木齐市",
      "650200": "克拉玛依市",
      "650400": "吐鲁番市",
      "650500": "哈密市",
      "652300": "昌吉回族自治州",
      "652700": "博尔塔拉蒙古自治州",
      "652800": "巴音郭楞蒙古自治州",
      "652900": "阿克苏地区",
      "653000": "克孜勒苏柯尔克孜自治州",
      "653100": "喀什地区",
      "653200": "和田地区",
      "654000": "伊犁哈萨克自治州",
      "654200": "塔城地区",
      "654300": "阿勒泰地区",
      "659000": "自治区直辖县级行政区划"
    },
    "650100": {
      "650101": "市辖区",
      "650102": "天山区",
      "650103": "沙依巴克区",
      "650104": "新市区",
      "650105": "水磨沟区",
      "650106": "头屯河区",
      "650107": "达坂城区",
      "650109": "米东区",
      "650121": "乌鲁木齐县"
    },
    "650200": {
      "650201": "市辖区",
      "650202": "独山子区",
      "650203": "克拉玛依区",
      "650204": "白碱滩区",
      "650205": "乌尔禾区"
    },
    "650400": {
      "650402": "高昌区",
      "650421": "鄯善县",
      "650422": "托克逊县"
    },
    "650500": {
      "650502": "伊州区",
      "650521": "巴里坤哈萨克自治县",
      "650522": "伊吾县"
    },
    "652300": {
      "652301": "昌吉市",
      "652302": "阜康市",
      "652323": "呼图壁县",
      "652324": "玛纳斯县",
      "652325": "奇台县",
      "652327": "吉木萨尔县",
      "652328": "木垒哈萨克自治县"
    },
    "652700": {
      "652701": "博乐市",
      "652702": "阿拉山口市",
      "652722": "精河县",
      "652723": "温泉县"
    },
    "652800": {
      "652801": "库尔勒市",
      "652822": "轮台县",
      "652823": "尉犁县",
      "652824": "若羌县",
      "652825": "且末县",
      "652826": "焉耆回族自治县",
      "652827": "和静县",
      "652828": "和硕县",
      "652829": "博湖县"
    },
    "652900": {
      "652901": "阿克苏市",
      "652922": "温宿县",
      "652923": "库车县",
      "652924": "沙雅县",
      "652925": "新和县",
      "652926": "拜城县",
      "652927": "乌什县",
      "652928": "阿瓦提县",
      "652929": "柯坪县"
    },
    "653000": {
      "653001": "阿图什市",
      "653022": "阿克陶县",
      "653023": "阿合奇县",
      "653024": "乌恰县"
    },
    "653100": {
      "653101": "喀什市",
      "653121": "疏附县",
      "653122": "疏勒县",
      "653123": "英吉沙县",
      "653124": "泽普县",
      "653125": "莎车县",
      "653126": "叶城县",
      "653127": "麦盖提县",
      "653128": "岳普湖县",
      "653129": "伽师县",
      "653130": "巴楚县",
      "653131": "塔什库尔干塔吉克自治县"
    },
    "653200": {
      "653201": "和田市",
      "653221": "和田县",
      "653222": "墨玉县",
      "653223": "皮山县",
      "653224": "洛浦县",
      "653225": "策勒县",
      "653226": "于田县",
      "653227": "民丰县"
    },
    "654000": {
      "654002": "伊宁市",
      "654003": "奎屯市",
      "654004": "霍尔果斯市",
      "654021": "伊宁县",
      "654022": "察布查尔锡伯自治县",
      "654023": "霍城县",
      "654024": "巩留县",
      "654025": "新源县",
      "654026": "昭苏县",
      "654027": "特克斯县",
      "654028": "尼勒克县"
    },
    "654200": {
      "654201": "塔城市",
      "654202": "乌苏市",
      "654221": "额敏县",
      "654223": "沙湾县",
      "654224": "托里县",
      "654225": "裕民县",
      "654226": "和布克赛尔蒙古自治县"
    },
    "654300": {
      "654301": "阿勒泰市",
      "654321": "布尔津县",
      "654322": "富蕴县",
      "654323": "福海县",
      "654324": "哈巴河县",
      "654325": "青河县",
      "654326": "吉木乃县"
    },
    "659000": {
      "659001": "石河子市",
      "659002": "阿拉尔市",
      "659003": "图木舒克市",
      "659004": "五家渠市",
      "659006": "铁门关市"
    },
    "710000": {
      "710100": "台北市",
      "710200": "高雄市",
      "710300": "台南市",
      "710400": "台中市",
      "710600": "南投县",
      "710700": "基隆市",
      "710800": "新竹市",
      "710900": "嘉义市",
      "711100": "新北市",
      "711200": "宜兰市",
      "711300": "新竹县",
      "711400": "桃园市",
      "711500": "苗栗县",
      "711700": "彰化县",
      "711900": "嘉义县",
      "712100": "云林县",
      "712400": "屏东县",
      "712500": "台东县",
      "712600": "花莲县",
      "712700": "澎湖县"
    },
    "710100": {
      "710101": "中正区",
      "710102": "大同区",
      "710103": "中山区",
      "710104": "松山区",
      "710105": "大安区",
      "710106": "万华区",
      "710107": "信义区",
      "710108": "士林区",
      "710109": "北投区",
      "710110": "内湖区",
      "710111": "南港区",
      "710112": "文山区"
    },
    "710200": {
      "710201": "新兴区",
      "710202": "前金区",
      "710203": "苓雅区",
      "710204": "盐埕区",
      "710205": "鼓山区",
      "710206": "旗津区",
      "710207": "前镇区",
      "710208": "三民区",
      "710209": "左营区",
      "710210": "楠梓区",
      "710211": "小港区",
      "710242": "仁武区",
      "710243": "大社区",
      "710244": "冈山区",
      "710245": "路竹区",
      "710246": "阿莲区",
      "710247": "田寮区",
      "710248": "燕巢区",
      "710249": "桥头区",
      "710250": "梓官区",
      "710251": "弥陀区",
      "710252": "永安区",
      "710253": "湖内区",
      "710254": "凤山区",
      "710255": "大寮区",
      "710256": "林园区",
      "710257": "鸟松区",
      "710258": "大树区",
      "710259": "旗山区",
      "710260": "美浓区",
      "710261": "六龟区",
      "710262": "内门区",
      "710263": "杉林区",
      "710264": "甲仙区",
      "710265": "桃源区",
      "710266": "那玛夏区",
      "710267": "茂林区",
      "710268": "茄萣区"
    },
    "710300": {
      "710301": "中西区",
      "710302": "东区",
      "710303": "南区",
      "710304": "北区",
      "710305": "安平区",
      "710306": "安南区",
      "710339": "永康区",
      "710340": "归仁区",
      "710341": "新化区",
      "710342": "左镇区",
      "710343": "玉井区",
      "710344": "楠西区",
      "710345": "南化区",
      "710346": "仁德区",
      "710347": "关庙区",
      "710348": "龙崎区",
      "710349": "官田区",
      "710350": "麻豆区",
      "710351": "佳里区",
      "710352": "西港区",
      "710353": "七股区",
      "710354": "将军区",
      "710355": "学甲区",
      "710356": "北门区",
      "710357": "新营区",
      "710358": "后壁区",
      "710359": "白河区",
      "710360": "东山区",
      "710361": "六甲区",
      "710362": "下营区",
      "710363": "柳营区",
      "710364": "盐水区",
      "710365": "善化区",
      "710366": "大内区",
      "710367": "山上区",
      "710368": "新市区",
      "710369": "安定区"
    },
    "710400": {
      "710401": "中区",
      "710402": "东区",
      "710403": "南区",
      "710404": "西区",
      "710405": "北区",
      "710406": "北屯区",
      "710407": "西屯区",
      "710408": "南屯区",
      "710431": "太平区",
      "710432": "大里区",
      "710433": "雾峰区",
      "710434": "乌日区",
      "710435": "丰原区",
      "710436": "后里区",
      "710437": "石冈区",
      "710438": "东势区",
      "710439": "和平区",
      "710440": "新社区",
      "710441": "潭子区",
      "710442": "大雅区",
      "710443": "神冈区",
      "710444": "大肚区",
      "710445": "沙鹿区",
      "710446": "龙井区",
      "710447": "梧栖区",
      "710448": "清水区",
      "710449": "大甲区",
      "710450": "外埔区",
      "710451": "大安区"
    },
    "710600": {
      "710614": "南投市",
      "710615": "中寮乡",
      "710616": "草屯镇",
      "710617": "国姓乡",
      "710618": "埔里镇",
      "710619": "仁爱乡",
      "710620": "名间乡",
      "710621": "集集镇",
      "710622": "水里乡",
      "710623": "鱼池乡",
      "710624": "信义乡",
      "710625": "竹山镇",
      "710626": "鹿谷乡"
    },
    "710700": {
      "710701": "仁爱区",
      "710702": "信义区",
      "710703": "中正区",
      "710704": "中山区",
      "710705": "安乐区",
      "710706": "暖暖区",
      "710707": "七堵区"
    },
    "710800": {
      "710801": "东区",
      "710802": "北区",
      "710803": "香山区"
    },
    "710900": {
      "710901": "东区",
      "710902": "西区"
    },
    "711100": {
      "711130": "万里区",
      "711131": "金山区",
      "711132": "板桥区",
      "711133": "汐止区",
      "711134": "深坑区",
      "711135": "石碇区",
      "711136": "瑞芳区",
      "711137": "平溪区",
      "711138": "双溪区",
      "711139": "贡寮区",
      "711140": "新店区",
      "711141": "坪林区",
      "711142": "乌来区",
      "711143": "永和区",
      "711144": "中和区",
      "711145": "土城区",
      "711146": "三峡区",
      "711147": "树林区",
      "711148": "莺歌区",
      "711149": "三重区",
      "711150": "新庄区",
      "711151": "泰山区",
      "711152": "林口区",
      "711153": "芦洲区",
      "711154": "五股区",
      "711155": "八里区",
      "711156": "淡水区",
      "711157": "三芝区",
      "711158": "石门区"
    },
    "711200": {
      "711214": "宜兰市",
      "711215": "头城镇",
      "711216": "礁溪乡",
      "711217": "壮围乡",
      "711218": "员山乡",
      "711219": "罗东镇",
      "711220": "三星乡",
      "711221": "大同乡",
      "711222": "五结乡",
      "711223": "冬山乡",
      "711224": "苏澳镇",
      "711225": "南澳乡"
    },
    "711300": {
      "711314": "竹北市",
      "711315": "湖口乡",
      "711316": "新丰乡",
      "711317": "新埔镇",
      "711318": "关西镇",
      "711319": "芎林乡",
      "711320": "宝山乡",
      "711321": "竹东镇",
      "711322": "五峰乡",
      "711323": "横山乡",
      "711324": "尖石乡",
      "711325": "北埔乡",
      "711326": "峨眉乡"
    },
    "711400": {
      "711414": "中坜区",
      "711415": "平镇区",
      "711416": "龙潭区",
      "711417": "杨梅区",
      "711418": "新屋区",
      "711419": "观音区",
      "711420": "桃园区",
      "711421": "龟山区",
      "711422": "八德区",
      "711423": "大溪区",
      "711424": "复兴区",
      "711425": "大园区",
      "711426": "芦竹区"
    },
    "711500": {
      "711519": "竹南镇",
      "711520": "头份市",
      "711521": "三湾乡",
      "711522": "南庄乡",
      "711523": "狮潭乡",
      "711524": "后龙镇",
      "711525": "通霄镇",
      "711526": "苑里镇",
      "711527": "苗栗市",
      "711528": "造桥乡",
      "711529": "头屋乡",
      "711530": "公馆乡",
      "711531": "大湖乡",
      "711532": "泰安乡",
      "711533": "铜锣乡",
      "711534": "三义乡",
      "711535": "西湖乡",
      "711536": "卓兰镇"
    },
    "711700": {
      "711727": "彰化市",
      "711728": "芬园乡",
      "711729": "花坛乡",
      "711730": "秀水乡",
      "711731": "鹿港镇",
      "711732": "福兴乡",
      "711733": "线西乡",
      "711734": "和美镇",
      "711735": "伸港乡",
      "711736": "员林市",
      "711737": "社头乡",
      "711738": "永靖乡",
      "711739": "埔心乡",
      "711740": "溪湖镇",
      "711741": "大村乡",
      "711742": "埔盐乡",
      "711743": "田中镇",
      "711744": "北斗镇",
      "711745": "田尾乡",
      "711746": "埤头乡",
      "711747": "溪州乡",
      "711748": "竹塘乡",
      "711749": "二林镇",
      "711750": "大城乡",
      "711751": "芳苑乡",
      "711752": "二水乡"
    },
    "711900": {
      "711919": "番路乡",
      "711920": "梅山乡",
      "711921": "竹崎乡",
      "711922": "阿里山乡",
      "711923": "中埔乡",
      "711924": "大埔乡",
      "711925": "水上乡",
      "711926": "鹿草乡",
      "711927": "太保市",
      "711928": "朴子市",
      "711929": "东石乡",
      "711930": "六脚乡",
      "711931": "新港乡",
      "711932": "民雄乡",
      "711933": "大林镇",
      "711934": "溪口乡",
      "711935": "义竹乡",
      "711936": "布袋镇"
    },
    "712100": {
      "712121": "斗南镇",
      "712122": "大埤乡",
      "712123": "虎尾镇",
      "712124": "土库镇",
      "712125": "褒忠乡",
      "712126": "东势乡",
      "712127": "台西乡",
      "712128": "仑背乡",
      "712129": "麦寮乡",
      "712130": "斗六市",
      "712131": "林内乡",
      "712132": "古坑乡",
      "712133": "莿桐乡",
      "712134": "西螺镇",
      "712135": "二仑乡",
      "712136": "北港镇",
      "712137": "水林乡",
      "712138": "口湖乡",
      "712139": "四湖乡",
      "712140": "元长乡"
    },
    "712400": {
      "712434": "屏东市",
      "712435": "三地门乡",
      "712436": "雾台乡",
      "712437": "玛家乡",
      "712438": "九如乡",
      "712439": "里港乡",
      "712440": "高树乡",
      "712441": "盐埔乡",
      "712442": "长治乡",
      "712443": "麟洛乡",
      "712444": "竹田乡",
      "712445": "内埔乡",
      "712446": "万丹乡",
      "712447": "潮州镇",
      "712448": "泰武乡",
      "712449": "来义乡",
      "712450": "万峦乡",
      "712451": "崁顶乡",
      "712452": "新埤乡",
      "712453": "南州乡",
      "712454": "林边乡",
      "712455": "东港镇",
      "712456": "琉球乡",
      "712457": "佳冬乡",
      "712458": "新园乡",
      "712459": "枋寮乡",
      "712460": "枋山乡",
      "712461": "春日乡",
      "712462": "狮子乡",
      "712463": "车城乡",
      "712464": "牡丹乡",
      "712465": "恒春镇",
      "712466": "满州乡"
    },
    "712500": {
      "712517": "台东市",
      "712518": "绿岛乡",
      "712519": "兰屿乡",
      "712520": "延平乡",
      "712521": "卑南乡",
      "712522": "鹿野乡",
      "712523": "关山镇",
      "712524": "海端乡",
      "712525": "池上乡",
      "712526": "东河乡",
      "712527": "成功镇",
      "712528": "长滨乡",
      "712529": "金峰乡",
      "712530": "大武乡",
      "712531": "达仁乡",
      "712532": "太麻里乡"
    },
    "712600": {
      "712615": "花莲市",
      "712616": "新城乡",
      "712618": "秀林乡",
      "712619": "吉安乡",
      "712620": "寿丰乡",
      "712621": "凤林镇",
      "712622": "光复乡",
      "712623": "丰滨乡",
      "712624": "瑞穗乡",
      "712625": "万荣乡",
      "712626": "玉里镇",
      "712627": "卓溪乡",
      "712628": "富里乡"
    },
    "712700": {
      "712707": "马公市",
      "712708": "西屿乡",
      "712709": "望安乡",
      "712710": "七美乡",
      "712711": "白沙乡",
      "712712": "湖西乡"
    },
    "810000": {
      "810100": "香港特别行政区"
    },
    "810100": {
      "810101": "中西区",
      "810102": "东区",
      "810103": "九龙城区",
      "810104": "观塘区",
      "810105": "南区",
      "810106": "深水埗区",
      "810107": "湾仔区",
      "810108": "黄大仙区",
      "810109": "油尖旺区",
      "810110": "离岛区",
      "810111": "葵青区",
      "810112": "北区",
      "810113": "西贡区",
      "810114": "沙田区",
      "810115": "屯门区",
      "810116": "大埔区",
      "810117": "荃湾区",
      "810118": "元朗区"
    },
    "820000": {
      "820100": "澳门特别行政区"
    },
    "820100": {
      "820101": "澳门半岛",
      "820102": "凼仔",
      "820103": "路凼城",
      "820104": "路环"
    }
  };


    /*!
 * Distpicker v1.0.4
 * https://github.com/fengyuanchen/distpicker
 *
 * Copyright (c) 2014-2016 Fengyuan Chen
 * Released under the MIT license
 *
 * Date: 2016-06-01T15:05:52.606Z
 */
!function(t){"function"==typeof define&&define.amd?define(["jquery","ChineseDistricts"],t):"object"==typeof exports?t(require("jquery"),require("ChineseDistricts")):t(jQuery,ChineseDistricts)}(function(t,i){"use strict";function e(i,s){this.$element=t(i),this.options=t.extend({},e.DEFAULTS,t.isPlainObject(s)&&s),this.placeholders=t.extend({},e.DEFAULTS),this.active=!1,this.init()}if("undefined"==typeof i)throw new Error('The file "distpicker.data.js" must be included first!');var s="distpicker",n="change."+s,c="province",o="city",r="district";e.prototype={constructor:e,init:function(){var i=this.options,e=this.$element.find("select"),s=e.length,n={};e.each(function(){t.extend(n,t(this).data())}),t.each([c,o,r],t.proxy(function(t,c){n[c]?(i[c]=n[c],this["$"+c]=e.filter("[data-"+c+"]")):this["$"+c]=s>t?e.eq(t):null},this)),this.bind(),this.reset(),this.active=!0},bind:function(){this.$province&&this.$province.on(n,this._changeProvince=t.proxy(function(){this.output(o),this.output(r)},this)),this.$city&&this.$city.on(n,this._changeCity=t.proxy(function(){this.output(r)},this))},unbind:function(){this.$province&&this.$province.off(n,this._changeProvince),this.$city&&this.$city.off(n,this._changeCity)},output:function(e){var s,n,h,d=this.options,u=this.placeholders,a=this["$"+e],f={},p=[];a&&a.length&&(h=d[e],s=e===c?86:e===o?this.$province&&this.$province.find(":selected").data("code"):e===r?this.$city&&this.$city.find(":selected").data("code"):s,f=t.isNumeric(s)?i[s]:null,t.isPlainObject(f)&&t.each(f,function(t,i){var e=i===h;e&&(n=!0),p.push({code:t,address:i,selected:e})}),n||(p.length&&(d.autoSelect||d.autoselect)&&(p[0].selected=!0),!this.active&&h&&(u[e]=h)),d.placeholder&&p.unshift({code:"",address:u[e],selected:!1}),a.html(this.getList(p)))},getList:function(i){var e=[];return t.each(i,function(t,i){e.push('<option value="'+(i.address&&i.code?i.address:"")+'" data-code="'+(i.code||"")+'"'+(i.selected?" selected":"")+">"+(i.address||"")+"</option>")}),e.join("")},reset:function(t){t?this.$province&&this.$province.find(":first").prop("selected",!0).trigger(n):(this.output(c),this.output(o),this.output(r))},destroy:function(){this.unbind(),this.$element.removeData(s)}},e.DEFAULTS={autoSelect:!0,placeholder:!0,province:"—— 省 ——",city:"—— 市 ——",district:"—— 区 ——"},e.setDefaults=function(i){t.extend(e.DEFAULTS,i)},e.other=t.fn.distpicker,t.fn.distpicker=function(i){var n=[].slice.call(arguments,1);return this.each(function(){var c,o,r=t(this),h=r.data(s);if(!h){if(/destroy/.test(i))return;c=t.extend({},r.data(),t.isPlainObject(i)&&i),r.data(s,h=new e(this,c))}"string"==typeof i&&t.isFunction(o=h[i])&&o.apply(h,n)})},t.fn.distpicker.Constructor=e,t.fn.distpicker.setDefaults=e.setDefaults,t.fn.distpicker.noConflict=function(){return t.fn.distpicker=e.other,this},t(function(){t('[data-toggle="distpicker"]').distpicker()})});


    /*!
 * Distpicker v1.0.4
 * https://github.com/fengyuanchen/distpicker
 *
 * Copyright (c) 2014-2016 Fengyuan Chen
 * Released under the MIT license
 *
 * Date: 2016-06-01T15:05:52.606Z
 */

    // apiHost
    var apiHost = "https://api.test.cyek.com/";

    // 版本号
    var version = "5.5.0";
    $(".cy-tool").text("灿耀易客浏览器工具"+version);

    // 手机号验证
    function checkphone(){
        var phone = $("#cyphoneNum").val().trim();
        // console.log(phone)
        var phoneReg = /^[1][0-9]{10}$/;
        if(phone){
            return true;
        }else{
            alert("请输入正确的手机号")
            return false;
        }
        return phone;
    }
    // 密码不能为空
    function checkpwd(){
        var pwd = $("#cypwd").val();
        if(pwd !== ""){
            return true;
        }else{
            alert("密码不能为空")
            return false;
        }
    }


    // msg 显示  3s后消失
    function msgHide(){
        var msgTime = 3;
        var msgTimer = setInterval(function(){
            msgTime--;
            if(msgTime === 0){
                clearInterval(msgTimer);
                $(".msg").stop().fadeOut(400);
            }
        },1000)
    }

    // msg 显示  3s后消失
    function msgText(text){
        $(".msg").text(text);
        $(".msg").fadeIn();
        var msgTime = 3;
        var msgTimer = setInterval(function(){
            msgTime--;
            if(msgTime === 0){
                clearInterval(msgTimer);
                $(".msg").stop().fadeOut(400);
            }
        },1000)
    }



    function req(url,data,sucFun,specialFun){


        GM_xmlhttpRequest({
            method: "POST",
            url: url,
            headers: { "Content-Type": "application/json" },
            data: data,
            onload: function(res) {
                // console.log(res)
                if (res.status == 200) {
                    var text = res.responseText;
                    var json = JSON.parse(text);
                    console.log(json);
                    if(json.code == 1000){
                        sucFun(json)
                    }else if(json.code == 1002){
                        alert(json.message);
                        localStorage.removeItem("token");
                        localStorage.removeItem("storagePhone");
                        localStorage.removeItem("storagePwd");
                        localStorage.removeItem("dep_name");
                        localStorage.removeItem("staffName");
                        $(".operate").hide();
                        $(".loginBox").show();
                        $(".loading").hide();
                    }else{
                        alert(json.message);
                        if (typeof(specialFun) == "function") {
                            specialFun()
                        }
                        $(".loading").hide();
                    }
                }
            }
        });



        // $.ajax({
        //     type: "post",
        //     url: url,
        //     data: data,
        //     success: function (res) {
        //         if(res.code == 1000){
        //             sucFun(res)
        //         }else if(res.code == 1002){
        //             alert(res.message);
        //             localStorage.removeItem("token");
        //             localStorage.removeItem("storagePhone");
        //             localStorage.removeItem("storagePwd");
        //             localStorage.removeItem("dep_name");
        //             localStorage.removeItem("staffName");
        //             $(".operate").hide();
        //             $(".loginBox").show();
        //         }else{
        //             alert(res.message);
        //             if (typeof(specialFun) == "function") {
        //                 specialFun()
        //             }
        //             $(".loading").hide();
        //         }
        //     },
        //     error: function(fail){
        //         console.log(fail.statusText)
        //     }
        // });
    }

    function sleep(ms) {
        return new Promise(resolve =>setTimeout(resolve, ms))
    }

    // 获取cookie中的ctoken
    // function getCookie(name){
    //     //可以搜索RegExp和match进行学习
    //     var arr,reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    //     if (arr = document.cookie.match(reg)) {
    //     console.log(arr)
    //         console.log(document.cookie.match(reg))
    //         return unescape(arr[2]);
    //     } else {
    //         return null;
    //     }
    // }

    function getCookie(cname)
    {
        var name = cname + "=";
        var ca = document.cookie.split(';').reverse();
        for(var i=0; i<ca.length; i++)
        {
            var c = ca[i].trim();
            if (c.indexOf(name)==0) return c.substring(name.length,c.length);
        }
        return "";
    }


    function updateCookie(name,value){
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var currentValue = getCookie(name);
        if(currentValue != null){
            document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
        }
    }



    // 删除url中某个参数
    function urlDelP(url,name){
        var urlArr = url.split('?');
        if(urlArr.length>1 && urlArr[1].indexOf(name)>-1){
            var query = urlArr[1];
            var obj = {}
            var arr = query.split("&");
            for (var i = 0; i < arr.length; i++) {
                arr[i] = arr[i].split("=");
                obj[arr[i][0]] = arr[i][1];
            };
            delete obj[name];
            var urlte = urlArr[0] +'?'+ JSON.stringify(obj).replace(/[\"\{\}]/g,"").replace(/\:/g,"=").replace(/\,/g,"&");
            return urlte;
        }else{
            return url;
        };
    }


//     function getCookie(cookieName) {
//         const strCookie = document.cookie
//         console.log(strCookie)
//         const cookieList = strCookie.split(';').reverse()

//         for(let i = 0; i < cookieList.length; i++) {
//             const arr = cookieList[i].split('=')
//             console.log(cookieList[i])
//             if (cookieName === arr[0].trim()) {
//                 return arr[1]
//             }
//         }

//         return ''
//     }


    // let douyinCookie = document.cookie
    // console.log(douyinCookie)


setTimeout(function(){
    // 获取json数据
    $(function(){

        // 版本号验证
        function ver(){

            req(apiHost+"/spider/browser/version",null,function(res){
                if(res.result.v != version && res.result.u == true){
                    $(".renew").show();
                }
            })

        }

        // 版本号是否更新
        ver();

        // 判断屏幕可视高度
        let windowH = unsafeWindow.innerHeight;
        console.log(windowH)
        if(windowH < 870){
            $(".operate").addClass("windowH")
        }

        // 查找抖音数据id
        function searchData(object, data) {
            for (var key in object) {
                if (object[key] == object[data]){
                    // console.log(key)
                     return key
                };
                for(var i in object[key]){
                    // console.log(i);
                    if(i == data){
                        return key;
                    }
                }
            }
        }


        // 粉丝数
        let follower_count;
        // 粉丝数
        let fans_count;
        // id
        let sec_uid;
        // 抖音author_id
        let author_id;
        // 昵称
        let nick;
        // 小红书号
        let account;
        // 分类
        let cate;
        // 位置
        let location;
        // 头像
        let avatar;
        // 简介
        let desc;
        // 获赞数
        let like_count;
        // 作品数
        let video_count;
        // 关注数
        let following;
        // 平台id
        let platform_id;
        // 性别
        let sex = 0;
        // 自定义字段
        let diy = {};
        // 抖音账号类别
        let account_tag = "";


        // 获取session存储信息
        var token = localStorage.getItem("token");
        var storagePhone = localStorage.getItem("storagePhone");
        var storagePwd = localStorage.getItem("storagePwd");
        var dep_name = localStorage.getItem("dep_name");
        var staffName = localStorage.getItem("name");

        let rex = window.location.href;

        // 简介信息渲染
        $(".operate-name").text("欢迎你，"+dep_name+"-"+staffName);


        if(rex.match(/https:\/\/www.douyin.com\/user\/*/) != null){
            // 获取抖音json数据
            let text = $("#RENDER_DATA").text();
            let decode = JSON.parse(decodeURIComponent(text));
            console.log(decode);
            console.log(searchData(decode,"uid"));
            // var user = decode[searchData(decode,"uid")].user.user;
            // console.log(user);

            let user;

            let userDy = {
                device_platform: "webapp",
                aid: 6383,
                channel: "channel_pc_web",
                publish_video_strategy_type: 2,
                source: "channel_pc_web",
                sec_user_id: unsafeWindow.location.pathname.split("/")[2],
                personal_center_strategy: 1,
                pc_client_type: 1,
                version_code: 170400,
                version_name: "17.4.0",
                cookie_enabled: true,
                screen_width: 2560,
                screen_height: 1440,
                browser_language: "zh-CN",
                browser_platform: "Win32",
                browser_name: "Chrome",
                browser_version: "114.0.0.0",
                browser_online: true,
                engine_name: "Blink",
                engine_version: "114.0.0.0",
                os_name: "Windows",
                os_version: 10,
                cpu_core_num: 16,
                device_memory: 8,
                platform: "PC",
                downlink: 10,
                effective_type: "4g",
                round_trip_time: 100,
                webid: decode.app.odin.user_unique_id,
                // msToken: dyCookie,
            }

            $.ajax({
                type: "get",
                url: "https://www.douyin.com/aweme/v1/web/user/profile/other/",
                data: userDy,
                crossDomain:true,
                xhrFields: {
                    withCredentials: true // 这里设置了withCredentials
                },
                async: false,
                success: function (res) {
                    user = res.user
                },
                error: function(fail){

                }
            });

            console.log(user)

            // 判断抖音达人账号类别
            if(user.is_ban == true){
                account_tag = "封禁号"
            }else if(user.is_ban == undefined){
                account_tag = "注销号"
            }else if(user.enterprise_verify_reason != ""){
                account_tag = "蓝v"
            }else if(user.custom_verify != ""){
                account_tag = "黄v"
            }
            console.log(user.isBan)

            // 粉丝数
            follower_count = user.follower_count;
            // 粉丝数
            fans_count = user.mplatform_followers_count;
            // 抖音sec_uid
            sec_uid = user.sec_uid;
            // 抖音author_id
            author_id = user.uid;
            // 昵称
            nick = user.nickname;
            // account号
            account = user.unique_id;
            // 头像
            avatar = user.avatar_300x300.url_list[0];
            // 简介
            desc = user.signature;
            // 获赞数
            like_count = user.total_favorited;
            // 作品数
            video_count = user.aweme_count;
            // 平台id
            platform_id = 1;
            // 分类
            cate = "";
            // 位置
            location = user.ip_location ? user.ip_location.split("：")[1] : ""
            // 自定义字段
            diy = {
                "short_id": user.short_id,
                "location": location
            };

            let fans = fans_count > 10000 ? (fans_count/10000).toFixed(2)+"万" : fans_count
            let followers = follower_count > 10000 ? (follower_count/10000).toFixed(2)+"万" : follower_count
            // 简介信息渲染
            $(".follower_count").append(`抖音粉丝数：${followers}`);
            $(".fans_count").append(`多平台粉丝数：${fans}`);
            $(".video_count").append(`作品数：${video_count}`);

            let _wr = function (type) {
                // 记录原生事件
                var orig = history[type];
                return function () {
                    // 触发原生事件
                    var rv = orig.apply(this, arguments);
                    // 自定义事件
                    var e = new Event(type);
                    e.arguments = arguments;
                    // 触发自定义事件
                    window.dispatchEvent(e);
                    return rv;
                }
            }


            let windowPath = unsafeWindow.location.pathname
            history.pushState = _wr("pushState")
            window.addEventListener("pushState",(e)=>{
                console.log("pushState",e)
                let windowUrl_1 = window.location.href
                if(window.location.pathname != windowPath){
                    if(windowUrl_1.match(/https:\/\/www.douyin.com\/user\/*/) != null){
                        window.location.reload()
                    }else{
                        $(".loginBox").css("visibility","hidden")
                        $(".operate").css("visibility","hidden")
                    }
                }else{
                    window.location.reload()
                }
            })
            history.popstate = _wr("popstate")
            window.addEventListener("popstate",(e)=>{
                console.log("popstate",e)
                let windowUrl_1 = window.location.href
                if(window.location.pathname != windowPath){
                    if(windowUrl_1.match(/https:\/\/www.douyin.com\/user\/*/) != null){
                        window.location.reload()
                    }else{
                        $(".loginBox").css("visibility","hidden")
                        $(".operate").css("visibility","hidden")
                    }
                }else{
                    window.location.reload()
                }
            })


            // 同步作品
            let synchronizeVideo = `<button id="synchronize">同步作品</button>`;
            $(".ewm-bind").append(synchronizeVideo)


            let dyCookie = getCookie("msToken")
            console.log(dyCookie)

            if(rex.includes("from=keyword")){
                setTimeout(function(){
                    window.close()
                },3000)
            }

            // 定义数组来接收数据
            let videoData = []
            let dy_max_cursor = 0

            let getUid = {
                "app_type": "tools_" + platform_id,
                "app_id": "1",
                "sign": "1",
                "access_token": token,
                "platform_id": platform_id, //达人归属平台
            }

            // 同步作品
            $(".ewm-bind").on("click","#synchronize",function(){
                $('.loading svg text').text('视频抓取中，请勿关闭')
                $(".loading").show()
                getSecUid()
            })


            function getSecUid(){
                req(apiHost+"/spider/browser/getSearchStar",JSON.stringify(getUid),function(res){
                    // console.log(res)
                    if(res.result.sec_uid){
                        getWorkData(res.result.last_search_time,res.result.sec_uid,res.result.cool_id)
                    }else{
                        alert("暂无达人链接，抓取已完成")
                        $(".loading").hide()
                    }
                })
            }


            function getWorkData(workTime,url,cool_id){
                let dataVideo = {
                    device_platform: "webapp",
                    aid: 6383,
                    channel: "channel_pc_web",
                    sec_user_id: url,
                    max_cursor: dy_max_cursor,
                    locate_query: false,
                    show_live_replay_strategy: 1,
                    count: 18,
                    publish_video_strategy_type: 2,
                    pc_client_type: 1,
                    version_code: 170400,
                    version_name: "17.4.0",
                    cookie_enabled: true,
                    screen_width: 2560,
                    screen_height: 1440,
                    browser_language: "zh-CN",
                    browser_platform: "Win32",
                    browser_name: "Chrome",
                    browser_version: "114.0.0.0",
                    browser_online: true,
                    engine_name: "Blink",
                    engine_version: "114.0.0.0",
                    os_name: "Windows",
                    os_version: 10,
                    cpu_core_num: 16,
                    device_memory: 8,
                    platform: "PC",
                    downlink: 6.95,
                    effective_type: "4g",
                    round_trip_time: 100,
                    webid: decode.app.odin.user_unique_id,
                    // msToken: dyCookie,
                }

                $.ajax({
                    type: "get",
                    // url: "https://www.douyin.com/aweme/v1/web/aweme/post/?device_platform=webapp&aid=6383&channel=channel_pc_web&sec_user_id="+ user.secUid +"&max_cursor="+ max_cursor +"&locate_query=false&show_live_replay_strategy=1&count=18&publish_video_strategy_type=2&pc_client_type=1&version_code=170400&version_name=17.4.0&cookie_enabled=false&screen_width=2560&screen_height=1440&browser_language=zh-CN&browser_platform=Win32&browser_name=Chrome&browser_version=114.0.0.0&browser_online=true&engine_name=Blink&engine_version=114.0.0.0&os_name=Windows&os_version=10&cpu_core_num=16&device_memory=8&platform=PC&downlink=10&effective_type=4g&round_trip_time=50&webid=7091485348957816359",
                    url: "https://www.douyin.com/aweme/v1/web/aweme/post/",
                    data: dataVideo,
                    headers: {
                        Accept: "application/json, text/plain, */*"
                    },
                    // dataType: "json",
                    beforeSend: function(res,settings){
                        // console.log(settings)
                        Object.freeze(settings);
                    },
                    success: function (res) {
                        // console.log(res);
                        for(let key in res.aweme_list){
                            // 如果是视频  aweme_type = 0  获取视频数据
                            if(res.aweme_list[key].aweme_type == 0){
                                // 数据填充进数组
                                // 获取到目标时间之后的视频
                                if(res.aweme_list[key].create_time*1000 >= workTime){
                                    videoData.push(res.aweme_list[key])
                                }

                            }
                            // else{
                            //     console.log(res.aweme_list[key])
                            //     console.log(res.aweme_list[key].aweme_type)
                            //     console.log(res.aweme_list[key].images)
                            // }
                        }

                        // 如果还有下一页 且 max_cursor参数大于目标时间  继续调用接口
                        if(res.has_more == 1 && res.max_cursor >= workTime){
                            // 改变max_cursor参数来接着调用下一页数据
                            dy_max_cursor = res.max_cursor
                            setTimeout(function(){
                                getWorkData(workTime,url,cool_id)
                            },2000)
                        }else{
                            console.log(videoData)

                            let linkItem = videoData.slice(0,10)


                            let saveUid = {
                                "app_type": "tools_" + platform_id,
                                "app_id": "1",
                                "sign": "1",
                                "access_token": token,
                                "platform_id": platform_id,
                                "cool_id": cool_id,
                                "result": JSON.stringify(linkItem)
                            }


                            req(apiHost+"/spider/browser/saveSearchStarResult",JSON.stringify(saveUid),function(res){
                                // console.log(res)
                                videoData = []

                                // 隔三秒再次调用接口拿到下一个 keyword
                                setTimeout(function(){
                                    getSecUid()
                                },3000)
                            })
                        }
                    }
                });
            }




        }else if(rex.match(/https:\/\/www.xiaohongshu.com\/user\/profile\/*/) != null){
            $(".operate").css("box-sizing","initial")
            // 获取小红书数据
            let user = unsafeWindow.__INITIAL_STATE__.user.userPageData._rawValue

            // console.log(user)
            // id
            let xhs_secUid = window.location.pathname.split("/")
            sec_uid = xhs_secUid[xhs_secUid.length - 1];

            let userData = {
                target_user_id: sec_uid
            }

            // unsafeWindow.sign()["X-t"]

            if(typeof(user) != "undefined" && user !== null && Object.keys(user).length != 0){
                console.log(11)
                user.basic_info = user.basicInfo
                redInfo(user)
            }else{
                console.log(22)
                setTimeout(function(){
                    $.ajax({
                        type: "get",
                        url: "https://edith.xiaohongshu.com/api/sns/web/v1/user/otherinfo",
                        headers: {
                            Accept: "application/json, text/plain, */*",
                            "x-s": unsafeWindow.sign("/api/sns/web/v1/user/otherinfo?target_user_id="+sec_uid)["X-s"],
                            "x-t": unsafeWindow.sign("/api/sns/web/v1/user/otherinfo?target_user_id="+sec_uid)["X-t"]
                        },
                        dataType: "json",
                        crossDomain:true,
                        xhrFields: {
                            withCredentials: true // 这里设置了withCredentials
                        },
                        data: userData,
                        async: false,
                        success: function (res) {
                            console.log(res);
                            user = res.data
                            redInfo(user)
                        }
                    });
                },1000)
            }


            // console.log(user)



            function redInfo(user){
                // 粉丝数
                follower_count = "";
                // 粉丝数
                let fansCount = user.interactions[1].count.replace("+","")
                // console.log(fansCount)
                if(fansCount.indexOf("k") != -1){
                    fans_count = fansCount.replace("k","")*1000
                }else if(fansCount.indexOf("w") != -1){
                    fans_count = fansCount.replace("w","")*10000
                }else{
                    fans_count = fansCount
                }
                // 抖音author_id
                author_id = xhs_secUid[xhs_secUid.length - 1];
                // 昵称
                nick = user.basic_info.nickname;
                // account号
                account = user.basic_info.red_id;
                // 分类
                cate = "";
                // 位置
                location = user.basic_info.ip_location;
                // 头像
                avatar = user.basic_info.imageb;
                // 简介
                desc = user.basic_info.desc;
                // 获赞数
                let likeCount = user.interactions[2].count.replace("+","")
                if(likeCount.indexOf("k") != -1){
                    like_count = likeCount.replace("k","")*1000
                }else if(likeCount.indexOf("w") != -1){
                    like_count = likeCount.replace("w","")*10000
                }else{
                    like_count = likeCount
                }
                // 作品数
                video_count = "";
                // 平台id
                platform_id = 4;
                // 性别
                sex = user.basic_info.gender == 0 ? 1 : 2;
                // 自定义字段
                diy = {
                    "location": location
                };

                // 简介信息渲染
                $(".follower_count").append(`粉丝数：${user.interactions[1].count}`);
                $(".fans_count").append(`关注数：${user.interactions[0].count}`);
                $(".video_count").append(`位置：${location}`);

                 if(localStorage.getItem("token")!=null){
                    resourceInfo();
                }else{
                    syncInfo()
                }
            }


            let _wr = function (type) {
                // 记录原生事件
                var orig = history[type];
                return function () {
                    // 触发原生事件
                    var rv = orig.apply(this, arguments);
                    // 自定义事件
                    var e = new Event(type);
                    e.arguments = arguments;
                    // 触发自定义事件
                    window.dispatchEvent(e);
                    return rv;
                }
            }


            let windowPath = unsafeWindow.location.pathname
            history.pushState = _wr("pushState")
            window.addEventListener("pushState",(e)=>{
                console.log("pushState",e)
                let windowUrl_1 = window.location.href
                if(window.location.pathname != windowPath){
                    if(windowUrl_1.match(/https:\/\/www.xiaohongshu.com\/user\/profile\/*/) != null){
                        window.location.reload()
                    }else{
                        $(".loginBox").css("visibility","hidden")
                        $(".operate").css("visibility","hidden")
                    }
                }else{
                    window.location.reload()
                }
            })
            history.popstate = _wr("popstate")
            window.addEventListener("popstate",(e)=>{
                console.log("popstate",e)
                let windowUrl_1 = window.location.href
                if(window.location.pathname != windowPath){
                    if(windowUrl_1.match(/https:\/\/www.xiaohongshu.com\/user\/profile\/*/) != null){
                        window.location.reload()
                    }else{
                        $(".loginBox").css("visibility","hidden")
                        $(".operate").css("visibility","hidden")
                    }
                }else{
                    window.location.reload()
                }
            })

        }else if(rex.match(/https:\/\/space.bilibili.com\/*/) != null){
            // 获取B站数据
            let mid = window.location.pathname.split("/")[1];

            // 粉丝数
            follower_count = "";
            // 粉丝数
            fans_count;
            // id
            sec_uid;
            // 抖音author_id
            author_id;
            // 昵称
            nick;
            // account号
            account;
            // 分类
            cate = "";
            // 位置
            location = "";
            // 头像
            avatar;
            // 简介
            desc;
            // 获赞数
            like_count = "";
            // 作品数
            video_count = "";
            // 关注数
            following;
            // 平台id
            platform_id = 2;

            // 达人信息
            let userData = {
                mid: mid,
                token: "",
                platform: "web",
            }
            $.ajax({
                type: "get",
                url: "https://api.bilibili.com/x/space/acc/info",
                data: userData,
                crossDomain:true,
                xhrFields: {
                    withCredentials: true // 这里设置了withCredentials
                },
                async: false,
                success: function (res) {
                    console.log(res);
                    if(res.code == 0){
                        nick = res.data.name
                        avatar = res.data.face
                        desc = res.data.sign
                    }else{
                        nick = $("#h-name").text()
                        avatar = $(".bili-avatar-img").eq(1).attr("src")
                        desc = $(".h-basic-spacing h4").text().trim()
                    }
                },
                error: function(fail){
                    nick = $("#h-name").text()
                    avatar = $(".bili-avatar-img").eq(1).attr("src")
                    desc = $(".h-basic-spacing h4").text().trim()
                    console.log(nick)
                }
            });
            // 达人粉丝数以及其他数量
            let userAmount = {
                vmid: mid,
                jsonp: "jsonp"
            }
            $.ajax({
                type: "get",
                url: "https://api.bilibili.com/x/relation/stat",
                data: userAmount,
                dataType: "json",
                async: false,
                success: function (res) {
                    console.log(res);
                    fans_count = res.data.follower
                    following = res.data.following
                    sec_uid = res.data.mid
                    author_id = res.data.mid
                    account = res.data.mid
                }
            });

            let fans = fans_count > 10000 ? (fans_count/10000).toFixed(2)+"万" : fans_count
            // 简介信息渲染
            $(".follower_count").append(`UID：${account}`);
            $(".fans_count").append(`粉丝数：${fans}`);
            $(".video_count").append(`关注数：${following}`);
        }else if(rex.match(/https:\/\/www.ixigua.com\/home\/*/) != null){
            // 获取西瓜视频数据
            let xiguaData = unsafeWindow._SSR_HYDRATED_DATA.AuthorDetailInfo;
            console.log(xiguaData)
            // 粉丝数
            follower_count = "";
            // 粉丝数
            let fansCount = xiguaData.fansNum;
            if(fansCount.indexOf("千") != -1){
                fans_count = fansCount.replace("千","")*1000
            }else if(fansCount.indexOf("万") != -1){
                fans_count = fansCount.replace("万","")*10000
            }else{
                fans_count = fansCount
            }
            // id
            sec_uid = xiguaData.user_id;
            // 抖音author_id
            author_id = xiguaData.user_id;
            // 昵称
            nick = xiguaData.name;
            // account号
            account = xiguaData.user_id;
            // 分类
            cate = "";
            // 位置
            location = xiguaData.address ? xiguaData.address : "";
            // 头像
            avatar = xiguaData.avatar;
            // 简介
            desc = xiguaData.introduce;
            // 获赞数
            like_count = xiguaData.diggNum;
            // 作品数
            video_count = "";
            // 关注数
            following = xiguaData.followNum;
            // 平台id
            platform_id = 7;
            // 自定义字段
            diy = {
                "location": location
            };

            let fans = fans_count > 10000 ? (fans_count/10000).toFixed(2)+"万" : fans_count
            // 简介信息渲染
            $(".follower_count").append(`关注数：${following}`);
            $(".fans_count").append(`粉丝数：${fans}`);
            $(".video_count").append(`位置：${location}`);
        }else if(rex.match(/https:\/\/www.kuaishou.com\/profile\/*/) != null){
            // 获取快手数据
            let userData = {
                "operationName":"visionProfile",
                "query":"query visionProfile($userId: String) {\n  visionProfile(userId: $userId) {\n    result\n    hostName\n    userProfile {\n      ownerCount {\n        fan\n        photo\n        follow\n        photo_public\n        __typename\n      }\n      profile {\n        gender\n        user_name\n        user_id\n        headurl\n        user_text\n        user_profile_bg_url\n        __typename\n      }\n      isFollowing\n      __typename\n    }\n    __typename\n  }\n}\n",
                "variables":{"userId": window.location.pathname.split("/")[2]}
            }

            // 设置倒计时器抓取页面数据
//             setTimeout(function(){
//                 // 粉丝数
//                 let fans_count_str = unsafeWindow.document.querySelector(".user-detail-item") ? unsafeWindow.document.querySelectorAll(".user-detail-item")[1].children[0].innerText : "";
//                 // console.log(fans_count_str)
//                 let fans_count_num = fans_count_str.indexOf("万") == -1 ? fans_count_str : fans_count_str.split("万")[0]*10000
//                 // console.log(fans_count_num)
//                 fans_count = unsafeWindow.document.querySelector(".user-detail-item") ? fans_count_num : ""
//                 // 作品数
//                 video_count = unsafeWindow.document.querySelector(".user-detail-item") ? unsafeWindow.document.querySelectorAll(".user-detail-item")[0].children[0].innerText : ""
//                 // 关注数
//                 following = unsafeWindow.document.querySelector(".user-detail-item") ? unsafeWindow.document.querySelectorAll(".user-detail-item")[2].children[0].innerText : ""

//                 // 简介信息渲染
//                 $(".follower_count").append(`关注数：${following == "" ? "请在快手平台登录账号,已登录请刷新页面" : following}`);
//                 $(".fans_count").append(`粉丝数：${fans_count == "" ? "请在快手平台登录账号,已登录请刷新页面" : fans_count_str}`);
//                 $(".video_count").append(`作品数：${video_count == "" ? "请在快手平台登录账号,已登录请刷新页面" : video_count}`);
//                 // 判断手机密码是否存储 存储就登录
//                 if(localStorage.getItem("token")!=null){
//                     resourceInfo();
//                 }else{
//                     syncInfo()
//                 }
//             },1200)

            $.ajax({
                type: "post",
                url: "https://www.kuaishou.com/graphql",
                data: JSON.stringify(userData),
                contentType:'application/json',
                dataType: "json",
                success: function (res) {
                    console.log(res);
                    let resData = res.data.visionProfile.userProfile
                    if(resData){
                        // 粉丝数
                        let fans_count_str = resData.ownerCount ? resData.ownerCount.fan : ""
                        // console.log(fans_count_str)
                        let fans_count_num = fans_count_str.indexOf("万") == -1 ? fans_count_str : fans_count_str.split("万")[0]*10000
                        // console.log(fans_count_num)
                        fans_count = resData.ownerCount ? fans_count_num : ""
                        // 作品数
                        video_count = resData.ownerCount ? resData.ownerCount.photo_public : ""
                        // 关注数
                        following = resData.ownerCount ? resData.ownerCount.follow : ""


                        // 昵称
                        nick = resData.profile.user_name
                        // id
                        sec_uid = resData.profile.user_id;
                        // 抖音author_id
                        author_id = resData.profile.user_id;
                        // account号
                        account = resData.profile.user_id;
                        // 头像
                        avatar = resData.profile.headurl;
                        // 简介
                        desc = resData.profile.user_text;
                        // 性别
                        sex = resData.profile.gender == "F" ? 2 : 1

                        if(following == ""){
                            $(".data-amount").css("color","red");
                        }

                        // 简介信息渲染
                        $(".follower_count").append(`关注数：${following == "" ? "请在快手平台登录账号,已登录请刷新页面" : following}`);
                        $(".fans_count").append(`粉丝数：${fans_count == "" ? "请在快手平台登录账号,已登录请刷新页面" : fans_count_str}`);
                        $(".video_count").append(`作品数：${video_count == "" ? "请在快手平台登录账号,已登录请刷新页面" : video_count}`);
                        // 判断手机密码是否存储 存储就登录
                        if(localStorage.getItem("token")!=null){
                            resourceInfo();
                        }else{
                            syncInfo()
                        }
                    }else{
                        // 简介信息渲染
                        $(".follower_count").append(`无法获取数据，快手号被封`);
                        $(".fans_count").append(`无法获取数据，快手号被封`);
                        $(".video_count").append(`无法获取数据，快手号被封`);
                    }
                },
                error: function(fail){
                    console.log(fail.statusText)
                }
            });

            // 分类
            cate = "";
            // 位置
            location = "";
            // 获赞数
            like_count = "";
            // 平台id
            platform_id = 3;


            // 同步作品
            let synchronizeVideo = `<button id="synchronize">同步作品</button>`;
            $(".ewm-bind").append(synchronizeVideo)



            // 定义参数max_cursor
            let pcursor = "";

            // 调用接口获取视频数据
            function getKsVideoInfo(){
                let token = localStorage.getItem("token");
                // loading 加载
                $('.loading svg text').text('视频抓取中，请勿关闭')
                $(".loading").show()

                // 接口传递参数
                let dataVideo = {
                    "operationName":"visionProfilePhotoList",
                    "query":"fragment photoContent on PhotoEntity {\n  id\n  duration\n  caption\n  originCaption\n  likeCount\n  viewCount\n  realLikeCount\n  coverUrl\n  photoUrl\n  photoH265Url\n  manifest\n  manifestH265\n  videoResource\n  coverUrls {\n    url\n    __typename\n  }\n  timestamp\n  expTag\n  animatedCoverUrl\n  distance\n  videoRatio\n  liked\n  stereoType\n  profileUserTopPhoto\n  musicBlocked\n  __typename\n}\n\nfragment feedContent on Feed {\n  type\n  author {\n    id\n    name\n    headerUrl\n    following\n    headerUrls {\n      url\n      __typename\n    }\n    __typename\n  }\n  photo {\n    ...photoContent\n    __typename\n  }\n  canAddComment\n  llsid\n  status\n  currentPcursor\n  tags {\n    type\n    name\n    __typename\n  }\n  __typename\n}\n\nquery visionProfilePhotoList($pcursor: String, $userId: String, $page: String, $webPageArea: String) {\n  visionProfilePhotoList(pcursor: $pcursor, userId: $userId, page: $page, webPageArea: $webPageArea) {\n    result\n    llsid\n    webPageArea\n    feeds {\n      ...feedContent\n      __typename\n    }\n    hostName\n    pcursor\n    __typename\n  }\n}\n",
                    "variables":{"page": "profile",pcursor: pcursor,"userId": window.location.pathname.split("/")[2]}
                }
                async function asyncFun(){
                    await sleep(3000)
                    $.ajax({
                        type: "post",
                        url: "https://www.kuaishou.com/graphql",
                        data: JSON.stringify(dataVideo),
                        contentType:'application/json',
                        dataType: "json",
                        success: function (res) {
                            // console.log(res);
                            let dataInfo = res.data.visionProfilePhotoList.feeds
                            for(let key in dataInfo){
                                // 定义对象存储单个视频信息数据
                                let starData = {};
                                // console.log(res.aweme_list[key])

                                // 如果是视频  aweme_type = 0  获取视频数据
                                if(dataInfo[key].type == 1){

                                    let link = dataInfo[key].photo.photoUrl
                                    let videoUrl = link.split("/")
                                    // 替换主域名
                                    videoUrl[2] = "alimov2.a.kwimgs.com"
                                    // 转成字符串
                                    let linkUrl = videoUrl.join("/")

                                    // 视频标题介绍
                                    starData[0] = dataInfo[key].photo.caption
                                    // 视频缩略图
                                    starData[1] = dataInfo[key].photo.coverUrl
                                    // 视频
                                    // urlDelP() 删除指定url中指定参数
                                    starData[2] = urlDelP(linkUrl,"pkey")
                                    // 视频收藏数
                                    starData[3] = 0
                                    // 视频点赞数
                                    starData[4] = dataInfo[key].photo.realLikeCount
                                    // 视频评论数
                                    starData[5] = 0
                                    // 视频分享数
                                    starData[6] = 0
                                    // 视频时长
                                    starData[7] = dataInfo[key].photo.duration
                                    // 视频发布时间
                                    starData[8] = dataInfo[key].photo.timestamp

                                    // 数据填充进数组
                                    videoData.push(starData)
                                }
                            }


                            // 如果还有下一页接着调用接口
                            if(res.data.visionProfilePhotoList.pcursor != "no_more" && res.data.visionProfilePhotoList.pcursor != null){
                                // 改变max_cursor参数来接着调用下一页数据
                                pcursor = res.data.visionProfilePhotoList.pcursor
                                getKsVideoInfo()
                            }else if(res.data.visionProfilePhotoList.pcursor == null){
                                console.log("触发风控")
                                $('.loading svg text').text('触发风控，F5或等待')
                                asyncFun()
                            }else{
                                console.log(videoData)

                                // 提交数据
                                $.ajax({
                                    type: "post",
                                    url: apiHost+"/spider/browser/videos",
                                    data: {
                                        "app_type": "tools_" + platform_id,
                                        "app_id": "1",
                                        "sign": "1",
                                        "access_token": token,
                                        "platform_id": platform_id, //达人归属平台
                                        "cool_id": localStorage.getItem("cool_id"),
                                        "v_lists": JSON.stringify(videoData), //达人数据
                                    },
                                    async: false,
                                    success: function (res) {
                                        console.log(res);
                                        // loading 结束
                                        $(".loading").hide()
                                        if(res.code === 1000){
                                            msgText("同步成功")

                                            // 初始化数据
                                            videoData = [];
                                            pcursor = "";
                                        }else if(res.code === 1002){
                                            alert("同步失败，请重新登录")
                                            localStorage.removeItem("token");
                                            localStorage.removeItem("storagePhone");
                                            localStorage.removeItem("storagePwd");
                                            localStorage.removeItem("dep_name");
                                            localStorage.removeItem("staffName");
                                            $(".operate").hide();
                                            $(".loginBox").show();

                                            // 初始化数据
                                            videoData = [];
                                            pcursor = "";
                                        }else{
                                            msgText("同步失败")

                                            // 初始化数据
                                            videoData = [];
                                            pcursor = "";
                                        }
                                    },
                                    error: function(fail){
                                        // loading 结束
                                        $(".loading").hide()
                                        console.log(fail.statusText)
                                        msgText("同步失败，请联系技术部")

                                        // 初始化数据
                                        videoData = [];
                                        pcursor = "";
                                    }
                                });
                            }
                        }
                    });
                }
                asyncFun()
            }


            // 定义数组来接收数据
            let videoData = [];

            // 同步数据
            $(".ewm-bind").on("click","#synchronize",function(){
                getKsVideoInfo();
            })


        }
//         else if(rex.match(/https:\/\/live.kuaishou.com\/profile\/*/) != null){

//             // 设置倒计时器抓取页面数据
// //             setTimeout(function(){
// //                 // 粉丝数
// //                 let fans_count_str = unsafeWindow.document.querySelector(".user-data-item") ? unsafeWindow.document.querySelectorAll(".user-data-item")[0].children[0].innerText : "";
// //                 // console.log(fans_count_str)
// //                 let fans_count_num = fans_count_str.indexOf("w") == -1 ? fans_count_str : fans_count_str.split("w")[0]*10000
// //                 // console.log(fans_count_num)
// //                 fans_count = unsafeWindow.document.querySelector(".user-data-item") ? fans_count_num : ""
// //                 // 作品数
// //                 video_count = unsafeWindow.document.querySelector(".user-data-item") ? unsafeWindow.document.querySelectorAll(".user-data-item")[2].children[0].innerText : ""
// //                 // 关注数
// //                 following = unsafeWindow.document.querySelector(".user-data-item") ? unsafeWindow.document.querySelectorAll(".user-data-item")[1].children[0].innerText : ""

// //                 let location_str = unsafeWindow.document.querySelectorAll(".user-info-data")[0].children[2].innerText
// //                 location = location_str ? location_str : ""
// //                 // 自定义字段
// //                 diy = {
// //                     "location": location
// //                 };

// //                 // 简介信息渲染
// //                 $(".follower_count").append(`关注数：${following == "" ? "请在快手平台登录账号,已登录请刷新页面" : following}`);
// //                 $(".fans_count").append(`粉丝数：${fans_count == "" ? "请在快手平台登录账号,已登录请刷新页面" : fans_count_str}`);
// //                 $(".video_count").append(`作品数：${video_count == "" ? "请在快手平台登录账号,已登录请刷新页面" : video_count}`);
// //                 // 判断手机密码是否存储 存储就登录
// //                 if(localStorage.getItem("token")!=null){
// //                     resourceInfo();
// //                 }else{
// //                     syncInfo()
// //                 }
// //             },1200)

//             // 获取快手直播数据
//             let userData = {
//                 "operationName": "sensitiveUserInfoQuery",
//                 "query": "query sensitiveUserInfoQuery($principalId: String) {\n  sensitiveUserInfo(principalId: $principalId) {\n    kwaiId\n    originUserId\n    constellation\n    cityName\n    counts {\n      fan\n      follow\n      photo\n      liked\n      open\n      playback\n      private\n      __typename\n    }\n    __typename\n  }\n}\n",
//                 "variables": {"principalId": window.location.pathname.split("/")[2]}
//             }

//             $.ajax({
//                 type: "post",
//                 url: "https://live.kuaishou.com/live_graphql",
//                 data: JSON.stringify(userData),
//                 contentType:'application/json',
//                 dataType: "json",
//                 async: true,
//                 success: function (res) {
//                     console.log(res);
//                     let resData = res.data.sensitiveUserInfo
//                     // 粉丝数
//                     let fans_count_str = resData ? resData.counts.fan : ""
//                     // console.log(fans_count_str)
//                     let fans_count_num = fans_count_str.indexOf("w") == -1 ? fans_count_str : fans_count_str.split("w")[0]*10000
//                     // console.log(fans_count_num)
//                     fans_count = resData ? fans_count_num : ""
//                     // 作品数
//                     video_count = resData ? resData.counts.open : ""
//                     // 关注数
//                     following = resData ? resData.counts.follow : ""


//                     // id
//                     sec_uid = resData ? resData.kwaiId : window.location.pathname.split("/")[2];
//                     // 抖音author_id
//                     author_id = resData ? resData.kwaiId : window.location.pathname.split("/")[2];
//                     // account号
//                     account = resData ? resData.kwaiId : window.location.pathname.split("/")[2];
//                     // 位置
//                     location = resData ? resData.cityName : "";

//                     // 简介信息渲染
//                     $(".follower_count").append(`关注数：${following == "" ? "请在快手平台登录账号,已登录请刷新页面" : following}`);
//                     $(".fans_count").append(`粉丝数：${fans_count == "" ? "请在快手平台登录账号,已登录请刷新页面" : fans_count_str}`);
//                     $(".video_count").append(`作品数：${video_count == "" ? "请在快手平台登录账号,已登录请刷新页面" : video_count}`);
//                     // 判断手机密码是否存储 存储就登录
//                     if(localStorage.getItem("token")!=null){
//                         resourceInfo();
//                     }else{
//                         syncInfo()
//                     }
//                 },
//                 error: function(fail){
//                     console.log(fail.statusText)
//                 }
//             });

//             // 分类
//             cate = "";
//             // 平台id
//             platform_id = 3;
//             // 昵称
//             nick = $(".user-info-name").text();
//             // 头像
//             avatar = $(".avatar img").attr("src");
//             // 简介
//             desc = $(".user-info-text").text();
//             // 获赞数
//             like_count = "";
//         }
        // }else if(rex.match(/https:\/\/weibo.com\/n\/*/) != null || rex.match(/https:\/\/weibo.com\/u\/*/) != null){
        else if(rex.match(/https:\/\/weibo.com\/*/) != null || rex.match(/https:\/\/m.weibo.cn\/*/) != null){

            // 粉丝数
            follower_count = "";
            // 粉丝数
            fans_count;
            // id
            sec_uid;
            // 抖音author_id
            author_id;
            // 昵称
            nick;
            // account号
            account;
            // 分类
            cate = "";
            // 位置
            location = "";
            // 头像
            avatar;
            // 简介
            desc;
            // 获赞数
            like_count = "";
            // 作品数
            video_count = "";
            // 关注数
            following;
            // 平台id
            platform_id = 15;

            // console.log(rex)


            function setData(){

                 // 获取微博数据
                let wbName = window.location.pathname.split("/")[2] ? window.location.pathname.split("/")[2] : window.location.pathname.split("/")[1];
                console.log(decodeURIComponent(wbName))



                // 微博页面uid为数字且链接不是u页面  强制跳转到u页面
                if(!isNaN(parseFloat(decodeURIComponent(wbName))) && rex.match(/https:\/\/weibo.com\/u\//) == null){
                    window.location.href = "https://weibo.com/u/"+decodeURIComponent(wbName)
                }

                // 达人信息
                let userData;
                if(rex.match(/https:\/\/weibo.com\/n\/*/) != null){
                    userData = {
                        screen_name: decodeURIComponent(wbName)
                    }
                }else if(rex.match(/https:\/\/weibo.com\/u\/*/) != null || rex.match(/https:\/\/m.weibo.cn\/*/) != null){
                    userData = {
                        uid: decodeURIComponent(wbName)
                    }
                }else{
                    userData = {
                        custom: decodeURIComponent(wbName)
                    }
                }

                $.ajax({
                    type: "get",
                    url: "https://weibo.com/ajax/profile/info",
                    data: userData,
                    dataType: "json",
                    async: false,
                    success: function (res) {
                        console.log(res);
                        if(res.ok == 1){
                            fans_count = res.data.user.followers_count
                            sec_uid = res.data.user.id
                            author_id = res.data.user.id
                            account = res.data.user.weihao
                            nick = res.data.user.screen_name
                            location = res.data.user.location ? res.data.user.location : ""
                            avatar = res.data.user.avatar_hd
                            desc = res.data.user.description
                            video_count = res.data.user.statuses_count
                            following = res.data.user.friends_count
                            location = res.data.user.location
                            // 性别
                            sex = res.data.user.gender == "m" ? 1 : 2

                        }else{
                            $(".loginBox").css("z-index",-1)
                            $(".operate").css("z-index",-1)
                        }
                    },
                    error: function(){
                        $(".loginBox").css("z-index",-1)
                        $(".operate").css("z-index",-1)
                    }
                });

                // 自定义字段
                diy = {
                    "location": location
                };

                let fans = fans_count > 10000 ? (fans_count/10000).toFixed(2)+"万" : fans_count

                // 简介信息渲染
                $(".follower_count").append(`作品数：${video_count}`);
                $(".fans_count").append(`粉丝数：${fans}`);
                $(".video_count").append(`关注数：${following}`);
            }

            setData()

            var _wr = function (type) {
                // 记录原生事件
                var orig = history[type];
                return function () {
                    // 触发原生事件
                    var rv = orig.apply(this, arguments);
                    // 自定义事件
                    var e = new Event(type);
                    e.arguments = arguments;
                    // 触发自定义事件
                    window.dispatchEvent(e);
                    return rv;
                }
            }


            let windowPath = unsafeWindow.location.pathname
            history.pushState = _wr("pushState")
            window.addEventListener("pushState",(e)=>{
                // console.log("pushState",e)
                let windowUrl_1 = window.location.href
                if(window.location.pathname != windowPath){
                    if(windowUrl_1.match(/https:\/\/weibo.com\/u\/*/) != null || windowUrl_1.match(/https:\/\/weibo.com\/n\/*/) != null){
                        window.location.reload()
                    }else{
                        $(".loginBox").css("z-index",-1)
                        $(".operate").css("z-index",-1)
                    }
                }else{
                    return false
                }
            })
            history.popstate = _wr("popstate")
            window.addEventListener("popstate",(e)=>{
                // console.log("popstate",e)
                let windowUrl_1 = window.location.href
                if(window.location.pathname != windowPath){
                    if(windowUrl_1.match(/https:\/\/weibo.com\/u\/*/) != null || windowUrl_1.match(/https:\/\/weibo.com\/n\/*/) != null){
                        window.location.reload()
                    }else{
                        $(".loginBox").css("z-index",-1)
                        $(".operate").css("z-index",-1)
                    }
                }else{
                    return false
                }
            })

            // history.hashChange = _wr("hashChange")
            // window.addEventListener("hashChange",(e)=>{
            //     console.log("r",e)
            // })
            // history.replaceState = _wr("replaceState")
            // window.addEventListener("replaceState",(e)=>{
            //     console.log("T",e)
            // })

        }else if(rex.match(/https:\/\/author.baidu.com\/*/) != null){
            console.log(unsafeWindow.runtime.user)
            // 获取百家号数据
            let bjhData = unsafeWindow.runtime.user
            window.location.href = "https://baijiahao.baidu.com/u?app_id="+bjhData.bjh_id
        }else if(rex.match(/https:\/\/baijiahao.baidu.com\/u*/) != null){
            $("body").css("font-size","initial")
            console.log(unsafeWindow.runtime.user)
            // 获取百家号数据
            let bjhData = unsafeWindow.runtime.user
            // 粉丝数
            follower_count = "";
            // 粉丝数
            fans_count = bjhData.fans_num;
            // id
            sec_uid = bjhData.bjh_id;
            // 抖音author_id
            author_id = bjhData.bjh_id;
            // 昵称
            nick = bjhData.nickname;
            // account号
            account = bjhData.uk;
            // 分类
            cate = "";
            // 位置
            location = bjhData.ip ? bjhData.ip.poi : "";
            // 头像
            avatar = bjhData.avatar;
            // 简介
            desc = bjhData.sign;
            // 获赞数
            like_count = bjhData.likes_num;
            // 作品数
            video_count = bjhData.contentNum.unit == "万" ? bjhData.contentNum.count*10000 : bjhData.contentNum.count;
            // 关注数
            following = bjhData.follow_num;
            // 平台id
            platform_id = 12;
            // 认证简介
            let auth_describe = bjhData.auth_describe
            // 自定义字段
            diy = {
                "location": location,
                "auth_describe": auth_describe
            };

            let fans = fans_count > 10000 ? (fans_count/10000).toFixed(2)+"万" : fans_count
            // 简介信息渲染
            $(".follower_count").append(`关注数：${following}`);
            $(".fans_count").append(`粉丝数：${fans}`);
            $(".video_count").append(`位置：${location}`);
        }else if(rex.match(/https:\/\/v.qq.com\/biu\/creator\/home*/) != null){
            $(".operate").css("box-sizing","initial")
            // 获取腾讯视频数据
            console.log(unsafeWindow.location.search.split("?vcuid=")[1])
            let txName = unsafeWindow.location.search.split("?vcuid=")[1]
            $.ajax({
                type: "get",
                url: "https://pbaccess.video.qq.com/trpc.creator_center.header_page.personal_page/GetUserMeta?vcuid="+txName,
                // data: JSON.stringify(userData),
                contentType:'application/json',
                dataType: "json",
                async: false,
                success: function (res) {
                    console.log(res.data.data);
                    let txData = res.data.data;
                    // 粉丝数
                    follower_count = "";
                    // 粉丝数
                    let txFans = txData.subscribe_count.split("订阅")[0];
                    fans_count = txFans.indexOf("万") == -1 ? txFans : txFans.split("万")[0]*10000;
                    // id
                    sec_uid = txName;
                    // 抖音author_id
                    author_id = txName;
                    // 昵称
                    nick = txData.creator_nick;
                    // account号
                    account = txName;
                    // 位置
                    location = txData.reg_location ? txData.reg_location : "";
                    // 头像
                    avatar = txData.creator_head;
                    // 简介
                    desc = txData.creator_desc;
                    // 获赞数
                    let like = txData.like_count.split("获赞")[0];
                    like_count = like.indexOf("万") == -1 ? like : like.split("万")[0]*10000;
                    // 作品数
                    video_count = txData.tabs[1].tab_item_count;
                    // 平台id
                    platform_id = 22;
                    // 自定义字段
                    diy = {
                        "location": location,
                        "star_desc": txData.star_desc,
                        "creator_auth_language": txData.creator_auth_language
                    };

                },
                error: function(fail){
                    console.log(fail.statusText)
                }
            });
            // 简介信息渲染
            $(".follower_count").append(`作品数：${video_count}`);
            $(".fans_count").append(`粉丝数：${ fans_count > 10000 ? (fans_count/10000).toFixed(2)+"万" : fans_count}`);
            $(".video_count").append(`位置：${location}`);
        }
//         else if(rex.match(/http:\/\/www.kuwo.cn\/singer_detail\/*/) != null){
//             // 酷我音乐
//             let qqData = unsafeWindow.__NUXT__.data[0].singerInfo;
//             console.log(qqData)
//             // 粉丝数
//             fans_count = qqData.artistFans;
//             // id
//             sec_uid = qqData.id;
//             // 抖音author_id
//             author_id = qqData.id;
//             // 昵称
//             nick = qqData.name;
//             // account号
//             account = qqData.id;
//             // 分类
//             cate = "";
//             // 头像
//             avatar = qqData.pic300;
//             // 简介
//             desc = qqData.info;
//             // 获赞数
//             like_count = qqData.likes_num;
//             // 作品数
//             video_count = qqData.musicNum;
//             // 关注数
//             following = "";
//             // 平台id
//             platform_id = 26;

//             let fans = fans_count > 10000 ? (fans_count/10000).toFixed(2)+"万" : fans_count
//             // 简介信息渲染
//             $(".follower_count").append(`专辑数：${qqData.albumNum}`);
//             $(".fans_count").append(`粉丝数：${fans}`);
//             $(".video_count").append(`作品数：${video_count}`);
//         }
        else if(rex.match(/https:\/\/static-play.kg.qq.com\/node\/personal*/) != null){
            // 全民K歌
            let kkData = unsafeWindow.__DATA__.data;
            console.log(kkData)
            // 粉丝数
            fans_count = kkData.follower;
            // id
            sec_uid = kkData.uid;
            // 抖音author_id
            author_id = kkData.kge_uid;
            // 昵称
            nick = kkData.kgnick;
            // account号
            account = kkData.kid;
            // 头像
            avatar = kkData.head_img_url;
            // 简介
            // desc = kkData.group_name;
            // 作品数
            video_count = kkData.ugc_total_count;
            // 关注数
            following = kkData.following;
            // 性别
            sex = kkData.gender;
            // 自定义字段
            diy = {
                "age": kkData.age
            };
            // 平台id
            platform_id = 27;

            let fans = fans_count > 10000 ? (fans_count/10000).toFixed(2)+"万" : fans_count
            // 简介信息渲染
            $(".follower_count").append(`关注数：${following}`);
            $(".fans_count").append(`粉丝数：${fans}`);
            $(".video_count").append(`作品数：${video_count}`);
        }else if(rex.match(/https:\/\/v.douyu.com\/author\/*/)){
            // 斗鱼
            const dyData = unsafeWindow.$DATA;
            console.log(dyData)
            // 粉丝数
            fans_count = dyData.subscribeNum;
            // id
            sec_uid = dyData.uid;
            // 抖音author_id
            author_id = dyData.upId;
            // 昵称
            nick = dyData.name;
            // account号
            account = dyData.upNum;
            // 头像
            avatar = dyData.avatar;
            // 简介
            desc = dyData.ownerAuthContents;
            // 获赞数
            like_count = dyData.upSum;
            // 作品数
            video_count = dyData.videoNum;
            // 关注数
            following = dyData.upFollowNum;
            // 性别
            sex = dyData.sex;
            // 自定义字段
            diy = {
                "age": dyData.age,
                "room_id": dyData.roomId,
                "od": dyData.od
            };
            // 平台id
            platform_id = 16;

            let fans = fans_count > 10000 ? (fans_count/10000).toFixed(2)+"万" : fans_count
            // 简介信息渲染
            $(".follower_count").append(`关注数：${following}`);
            $(".fans_count").append(`粉丝数：${fans}`);
            $(".video_count").append(`作品数：${video_count}`);
        }else if(rex.match(/https:\/\/www.huya.com\/video\/u\/*/)){
            // 虎牙
            let user_id = unsafeWindow.user_id;
            let playCount = "";
            let huyaUserData = {
                r: decodeURI("user/liveinfo"),
                uid: user_id
            }
            console.log(11111)

            $.ajax({
                type: "get",
                url: "https://v.huya.com/index.php",
                data: huyaUserData,
                crossDomain:true,
                xhrFields: {
                    withCredentials: true // 这里设置了withCredentials
                },
                async: false,
                success: function(res){
                    console.log(2222)
                    console.log(res);
                    // id
                    sec_uid = res.uid;
                    // 抖音author_id
                    author_id = res.uid;
                    // 昵称
                    nick = res.user_nickname;
                    // account号
                    account = res.uid;
                    // 头像
                    avatar = res.user_avatar;
                    // 作品数
                    video_count = res.user_video_sum.replace(/,/g,"");
                    // 播放量
                    playCount = res.user_play_sum

                    // 自定义字段
                    diy = {
                        "room_id": res.room_id
                    };
                },
                error: function(fail){
                    console.log(3333)
                    console.log(JSON.parse(fail.responseText))
                    let res = JSON.parse(fail.responseText)

                    // id
                    sec_uid = res.uid;
                    // 抖音author_id
                    author_id = res.uid;
                    // 昵称
                    nick = res.user_nickname;
                    // account号
                    account = res.uid;
                    // 头像
                    avatar = res.user_avatar;
                    // 作品数
                    video_count = res.user_video_sum.replace(/,/g,"");
                    // 播放量
                    playCount = res.user_play_sum

                    // 自定义字段
                    diy = {
                        "room_id": res.room_id,
                        "user_yyId": res.user_yyId
                    };
                }
            });

            // 粉丝数
            // let fan = $(".detail-info").children().eq(0).text().split("订阅：")[1]
            let fan = $(".detail-info").children().eq(0).text().split("订阅：")[1];
            fans_count = fan.indexOf("万") == -1 ? fan : fan.split("万")[0]*10000;
            // 简介
            desc = $(".detail-desc").text();
            // 平台id
            platform_id = 11;

            let fans = fans_count > 10000 ? (fans_count/10000).toFixed(2)+"万" : fans_count
            // 简介信息渲染
            $(".follower_count").append(`播放量：${playCount}`);
            $(".fans_count").append(`订阅数：${fans}`);
            $(".video_count").append(`作品数：${video_count}`);
        }else if(rex.match(/https:\/\/y.qq.com\/*/) != null){
            // QQ音乐
            if(window.location.href.match(/https:\/\/y.qq.com\/n\/ryqq\/profile*/) != null){
                // 时间戳
                let timeData = new Date().getTime();
                // userid
                let userid = unsafeWindow.location.search.split("uin=")[1]
                let userData = {
                    _: timeData,
                    cv: 4747474,
                    ct: 20,
                    format: "json",
                    inCharset: "utf-8",
                    outCharset: "utf-8",
                    notice: 0,
                    platform: "yqq.json",
                    needNewCode: 1,
                    g_tk_new_20200303: 1442976825,
                    g_tk: 1442976825,
                    cid: 205360838,
                    userid: userid,
                    reqfrom: 1,
                    reqtype: 0,
                }
                $.ajax({
                    type: "get",
                    url: "https://c.y.qq.com/rsc/fcgi-bin/fcg_get_profile_homepage.fcg",
                    data: userData,
                    crossDomain:true,
                    xhrFields: {
                        withCredentials: true // 这里设置了withCredentials
                    },
                    async: false,
                    success: function (res) {
                        console.log(res);
                        let qqData = res.data.creator
                        if(qqData){
                            // 粉丝数
                            fans_count = qqData.nums.fansnum;
                            // id
                            sec_uid = qqData.encrypt_uin;
                            // 抖音author_id
                            author_id = qqData.encrypt_uin;
                            // 昵称
                            nick = qqData.nick;
                            // account号
                            account = qqData.encrypt_uin;
                            // 头像
                            avatar = qqData.headpic
                            // 关注数
                            following = qqData.nums.follownum;
                            // 平台id
                            platform_id = 23;
                            // 自定义字段
                            diy = {
                                "singerid": qqData.singerinfo.singerid,
                            };

                            let fans = fans_count > 10000 ? (fans_count/10000).toFixed(2)+"万" : fans_count
                            // 简介信息渲染
                            $(".follower_count").append(`粉丝数：${fans}`);
                            $(".fans_count").append(`关注数：${following}`);
                        }else{
                            // 昵称
                            nick = "";
                            // id
                            sec_uid = userid;
                            // 抖音author_id
                            author_id = userid;
                            // account号
                            account = userid;
                            // 平台id
                            platform_id = 23;
                            // 简介信息渲染
                            $(".follower_count").append(`请在QQ音乐平台登录账号`).css("color","red");
                            $(".fans_count").append(`请在QQ音乐平台登录账号`).css("color","red");
                        }
                    },
                    error: function(fail){
                        console.log(fail.statusText)
                    }
                });
            }else{
                $(".loginBox").css("visibility","hidden")
                $(".operate").css("visibility","hidden")
            }

            let _wr = function (type) {
                // 记录原生事件
                var orig = history[type];
                return function () {
                    // 触发原生事件
                    var rv = orig.apply(this, arguments);
                    // 自定义事件
                    var e = new Event(type);
                    e.arguments = arguments;
                    // 触发自定义事件
                    window.dispatchEvent(e);
                    return rv;
                }
            }


            let windowPath = unsafeWindow.location.pathname
            history.pushState = _wr("pushState")
            window.addEventListener("pushState",(e)=>{
                console.log("pushState",e)
                let windowUrl_1 = window.location.href
                if(window.location.pathname != windowPath){
                    if(windowUrl_1.match(/https:\/\/y.qq.com\/n\/ryqq\/profile*/) != null || windowUrl_1.match(/https:\/\/y.qq.com\/n\/ryqq\/singer\/*/) != null){
                        window.location.reload()
                    }else{
                        $(".loginBox").css("visibility","hidden")
                        $(".operate").css("visibility","hidden")
                    }
                }else{
                    window.location.reload()
                }
            })
            history.popstate = _wr("popstate")
            window.addEventListener("popstate",(e)=>{
                console.log("popstate",e)
                let windowUrl_1 = window.location.href
                if(window.location.pathname != windowPath){
                    if(windowUrl_1.match(/https:\/\/y.qq.com\/n\/ryqq\/profile*/) != null || windowUrl_1.match(/https:\/\/y.qq.com\/n\/ryqq\/singer\/*/) != null){
                        window.location.reload()
                    }else{
                        $(".loginBox").css("visibility","hidden")
                        $(".operate").css("visibility","hidden")
                    }
                }else{
                    window.location.reload()
                }
            })
        }else if(rex.match(/https:\/\/music.163.com\/user*/) != null){
            // 网易云
            let userid = window.location.href.split("id=")[1]
            // 粉丝数
            fans_count = $("#fan_count").text();
            // id
            sec_uid = userid;
            // 抖音author_id
            author_id = userid;
            // 昵称
            nick = $(".m-proifo .name .tit").text();
            // account号
            account = userid;
            // 头像
            avatar = $("#ava img").attr("src");
            // 简介
            desc = $(".f-brk").text().split("个人介绍：")[1];
            // 关注数
            following = $("#follow_count").text();
            // 平台id
            platform_id = 24;
            //性别
            // sex = document.querySelector(".icn").className == "icn u-icn u-icn-01" ? 1 : 2;
            if(document.querySelector(".icn").className == "icn u-icn u-icn-01"){
                sex = 1;
            }else if(document.querySelector(".icn").className == "icn u-icn u-icn-02"){
                sex = 2;
            }else{
                sex = 3;
            }
            // 自定义字段
            diy = {
                "auth_desc": document.querySelector(".djp").innerText
            };

            let fans = fans_count > 10000 ? (fans_count/10000).toFixed(2)+"万" : fans_count
            // 简介信息渲染
            $(".fans_count").append(`粉丝数：${fans}`);
            $(".video_count").append(`关注数：${following}`);
        }else if(rex.match(/https:\/\/mobile.yangkeduo.com\/fyxmkief.html*/) != null){
            // 多多视频
            let store = unsafeWindow.rawData.store.authorInfo ? unsafeWindow.rawData.store.authorInfo.uid : unsafeWindow.rawData.store.uid;
            window.location.href = "https://mobile.yangkeduo.com/svideo_personal.html?target_uid=" + store;
        }else if(rex.match(/https:\/\/mobile.yangkeduo.com\/svideo_personal.html*/)){
            // 多多视频
            let info = unsafeWindow.rawData.store
            console.log(info)
            // 粉丝数
            follower_count = "";
            // 粉丝数
            fans_count = info.headTabs[0].number;
            // id
            sec_uid = info.uid;
            // 抖音author_id
            author_id = info.uin;
            // 昵称
            nick = info.nickname;
            // account号
            account = info.uid;
            // 分类
            cate = "";
            // 位置
            location = "";
            // 头像
            avatar = info.avatar;
            // 简介
            desc = info.desc;
            // 获赞数
            like_count = "";
            // 作品数
            video_count = "";
            // 关注数
            following = "";
            // 性别
            sex = info.tags[0] == "男" ? 1 : 2;
            // 平台id
            platform_id = 20;

            let fans = fans_count > 10000 ? (fans_count/10000).toFixed(2)+"万" : fans_count
            // 简介信息渲染
            $(".fans_count").append(`粉丝数：${fans}`);
        }else if(rex.match(/https:\/\/www.toutiao.com\/c\/user\/*/)){
            // 今日头条
            let info = JSON.parse(decodeURIComponent(document.getElementById("RENDER_DATA").innerText)).data.profileUserInfo
            console.log(info)

            let userData = {
                token: info.userId
            }

            $.ajax({
                type: "post",
                url: "https://www.toutiao.com/api/pc/user/fans_stat",
                data: userData,
                async: false,
                success: function (res) {
                    console.log(res);
                    // 粉丝数
                    fans_count = res.data.fans.indexOf("万") == -1 ? res.data.fans : res.data.fans.split("万")[0]*10000;;
                    // 获赞数
                    like_count = res.data.digg_count.indexOf("万") == -1 ? res.data.digg_count : res.data.digg_count.split("万")[0]*10000;;
                    // 关注数
                    following = res.data.following.indexOf("万") == -1 ? res.data.following : res.data.following.split("万")[0]*10000;;
                }
            });


            // id
            sec_uid = info.userId;
            // 抖音author_id
            author_id = info.mediaId;
            // 昵称
            nick = info.name;
            // account号
            account = info.userId;
            // 分类
            cate = "";
            // 位置
            location = info.ipLocation;
            // 头像
            avatar = info.avatarUrl;
            // 简介
            desc = info.description;
            // 作品数
            video_count = "";
            // 平台id
            platform_id = 14;
            // 自定义字段
            diy = {
                "location": location
            };
        }else if(rex.match(/https:\/\/mlive5.inke.cn\/app\/user*/)){
            let userData = {
                uid: unsafeWindow.location.search.split("=")[1],
                lat: "",
                lng: "",
                _t: new Date().getTime()
            }


            $.ajax({
                type: "get",
                url: "https://baseapi.busi.inke.cn/user/userDetailInfo",
                dataType: "json",
                data: userData,
                async: false,
                success: function (res) {
                    console.log(res);
                    // 粉丝数
                    fans_count = res.data.numrelations.num_followers;
                    // id
                    sec_uid = userData.uid;
                    // 抖音author_id
                    author_id = res.data.liveid;
                    // 昵称
                    nick = res.data.nick;
                    // account号
                    account = res.data.uid;
                    // 分类
                    cate = "";
                    // 位置
                    location = res.data.ip_location;
                    // 头像
                    avatar = res.data.portrait;
                    // 简介
                    desc = res.data.description;
                    // 性别
                    if(res.data.sex == 0){
                        sex = 2
                    }else if(res.data.sex == 1){
                        sex = 1
                    }else{
                        sex = 3
                    }
                    // 自定义字段
                    diy = {
                        "location": location,
                        "short_id": res.data.short_id
                    };
                    // 平台id
                    platform_id = 29;
                }
            });
        }else if(rex.match(/https:\/\/share.tangdou.com\/space\/index.php*/)){
            if(unsafeWindow.location.search.indexOf("share_uid") != -1){
                unsafeWindow.location.href = "https://share.tangdou.com/space/index.php?uid=" + unsafeWindow.dataInfo.uid
            }

            $.ajax({
                type: "get",
                url: "https://api-h5.tangdou.com/mtangdou/space/head?uid=" + unsafeWindow.dataInfo.uid,
                dataType: "json",
                async: false,
                success: function (res) {
                    console.log(res);
                    // 粉丝数
                    let fans = document.querySelector(".rig p").innerText.split("粉丝")[0]
                    fans_count = fans.indexOf("万") == -1 ? fans : fans.split("万")[0]*10000;
                    // 作品数
                    video_count = res.data.video_num;
                    // id
                    sec_uid = unsafeWindow.dataInfo.uid;
                    // 抖音author_id
                    author_id = unsafeWindow.dataInfo.uid;
                    // 昵称
                    nick = res.data.keyword;
                    // account号
                    account = unsafeWindow.dataInfo.uid;
                    // 分类
                    cate = "";
                    // 位置
                    location = "";
                    // 头像
                    avatar = "https://aimg.tangdou.com"+res.data.pic;
                    // 简介
                    desc = document.querySelector(".centont p").innerText;
                    // 性别
                    sex = 0
                    // 平台id
                    platform_id = 30;
                }
            });

        }else if(rex.match(/https:\/\/www.yy.com\/u*/)){
            let info = unsafeWindow.pageProps.userBaseInfo

             // 粉丝数
            fans_count = info.topData.attentionCountInfo.fansCount;
            // id
            sec_uid = info.yyNum;
            // 抖音author_id
            author_id = info.uid;
            // 昵称
            nick = info.topData.baseUserInfo.nick;
            // account号
            account = info.yyNum;
            // 分类
            cate = "";
            // 位置
            location = "";
            // 头像
            avatar = info.topData.baseUserInfo.logo;
            // 简介
            desc = info.topData.baseUserInfo.sign;
            // 获赞数
            like_count = "";
            // 作品数
            video_count = "";
            // 关注数
            following = "";
            // 性别
            // sex = info.tags[0] == "男" ? 1 : 2;
            // 平台id
            platform_id = 31;
            // 自定义字段
            diy = {
                "roomId": info.topData.baseUserInfo.roomId
            };
        }else if(rex.match(/https:\/\/show.gotokeep.com\/users\/*/)){
            let uid = unsafeWindow.location.pathname.split("/")[2]


            $.ajax({
                type: "get",
                url: "https://api.gotokeep.com/account/v3/userinfo/" + uid,
                dataType: "json",
                async: false,
                success: function (res) {
                    console.log(res);

                    // 粉丝数
                    fans_count = res.data.followed;
                    // id
                    sec_uid = res.data._id;
                    // 抖音author_id
                    author_id = res.data._id;
                    // 昵称
                    nick = res.data.username;
                    // account号
                    account = res.data._id;
                    // 分类
                    cate = "";
                    // 位置
                    location = res.data;
                    if(res.data.city == res.data.province){
                        location = res.data.country + res.data.city + res.data.district
                    }else{
                        location = res.data.country + res.data.province + res.data.city + res.data.district
                    }
                    // 头像
                    avatar = res.data.avatar;
                    // 简介
                    desc = res.data.bio;
                    // 获赞数
                    like_count = "";
                    // 作品数
                    video_count = res.data.totalEntries;
                    // 关注数
                    following = res.data.follow;
                    // 性别
                    if(res.data.gender == "F"){
                        sex = 2
                    }else if(res.data.gender == "M"){
                        sex = 1
                    }else{
                        sex = 3
                    }
                    // 平台id
                    platform_id = 32;
                    // 自定义字段
                    diy = {
                        "birthday": res.data.birthday,
                        "country": res.data.country,
                        "province": res.data.province,
                        "city": res.data.city,
                        "district": res.data.district,
                        "location": location,
                        "weight": res.data.weight,
                    };
                }
            });
        }else if(rex.match(/https:\/\/www.zhihu.com\/people*/) || rex.match(/https:\/\/www.zhihu.com\/org*/)){
            // 知乎

            let uid = unsafeWindow.location.pathname.split("/")[2]
            let userData = JSON.parse($("#js-initialData").text()).initialState.entities.users[uid]
            console.log(userData)

            // 粉丝数
            fans_count = userData.followerCount
            // id
            sec_uid = userData.id
            // author_id
            author_id = userData.uid
            // 昵称
            nick = userData.name
            // account号
            account = userData.id
            // 分类
            cate = "";
            // 位置
            location = userData.locations[0] ? userData.locations[0].name : ""
            // 头像
            avatar = userData.avatarUrlTemplate
            // 简介
            desc = userData.description
            // 获赞数
            like_count = userData.voteupCount;
            // 作品数
            video_count = userData.zvideoCount;
            // 性别
            sex = userData.gender == 0 ? 2 : 1;
            // 平台id
            platform_id = 33;
            // 自定义字段
            diy = {
                "business": userData.business.name,
                "headline": userData.headline,
                "ipInfo": userData.ipInfo,
                "urlToken": userData.urlToken
            };
        }else if(rex.match(/https:\/\/www.tiktok.com\/@*/)){
            // let uid = unsafeWindow.location.pathname.split("@")[1]
            let uid = unsafeWindow.SIGI_STATE.UserPage.uniqueId
            console.log(uid)
            // let userData = JSON.parse($("#js-initialData").text()).initialState.entities.users[uid]
            // console.log(userData)

            let userCount = unsafeWindow.SIGI_STATE.UserModule.stats[uid]
            console.log(userCount)
            let userData = unsafeWindow.SIGI_STATE.UserModule.users[uid]
            console.log(userData)

            // 粉丝数
            fans_count = userCount.followerCount
            // id
            sec_uid = userData.secUid
            // author_id
            author_id = userData.id
            // 昵称
            nick = userData.nickname
            // account号
            account = userData.uniqueId
            // 分类
            cate = "";
            // 位置
            location = ""
            // 头像
            avatar = userData.avatarLarger
            // 简介
            desc = userData.signature
            // 获赞数
            like_count = userCount.heartCount;
            // 作品数
            video_count = userCount.videoCount;
            // 性别
            sex = 0;
            // 平台id
            platform_id = 34;
            // 自定义字段
            diy = {
                "shortId": userData.shortId,
                "roomId": userData.roomId,
                "region": userData.region,
            };
        }else if(rex.match(/https:\/\/www.youtube.com\/@*/)){
            // let uid = unsafeWindow.SIGI_STATE.UserPage.uniqueId
            // console.log(uid)

            // let userCount = unsafeWindow.SIGI_STATE.UserModule.stats[uid]
            // console.log(userCount)
            let userData = unsafeWindow.ytInitialData.header.c4TabbedHeaderRenderer
            console.log(userData)

            // 粉丝数
            let fansCount = userData.subscriberCountText.simpleText
            if(fansCount.indexOf("千") != -1){
                fans_count = fansCount.split("千")[0]*1000
            }else if(fansCount.indexOf("万") != -1){
                fans_count = fansCount.split("万")[0]*10000
            }else{
                fans_count = fansCount
            }
            // id
            sec_uid = userData.channelId
            // author_id
            author_id = userData.channelId
            // 昵称
            nick = userData.title
            // account号
            account = userData.channelHandleText.runs[0].text
            // 分类
            cate = "";
            // 位置
            location = ""
            // 头像
            avatar = userData.avatar.thumbnails[2].url
            // 简介
            desc = userData.tagline.channelTaglineRenderer.content
            // 获赞数
            // like_count = userData.heartCount;
            // 作品数
            let videoCount = userData.videosCountText.runs[0].text
            if(videoCount.indexOf("千") != -1){
                video_count = videoCount.split("千")[0]*1000
            }else if(videoCount.indexOf("万") != -1){
                video_count = videoCount.split("万")[0]*10000
            }else{
                video_count = videoCount
            }
            // 性别
            sex = 0;
            // 平台id
            platform_id = 35;
            // 自定义字段
            diy = {
                "browseId": userData.navigationEndpoint.browseEndpoint.browseId,
            };
        }else if(rex.match(/https:\/\/twitter.com\/*/)){
            //  twitter

            // let uid = unsafeWindow.SIGI_STATE.UserPage.uniqueId
            // console.log(uid)

            // let userCount = unsafeWindow.SIGI_STATE.UserModule.stats[uid]
            // console.log(userCount)
            let userData = JSON.parse(document.querySelector("script[data-testid='UserProfileSchema-test']").innerHTML)
            console.log(userData)

            // 粉丝数
            fans_count = userData.author.interactionStatistic[0].userInteractionCount
            // id
            sec_uid = userData.author.additionalName
            // author_id
            author_id = userData.author.additionalName
            // 昵称
            nick = userData.author.givenName
            // account号
            account = userData.author.additionalName
            // 分类
            cate = "";
            // 位置
            location = ""
            // 头像
            avatar = userData.author.image.contentUrl
            // 简介
            desc = userData.author.description
            // 获赞数
            // like_count = userData.heartCount;
            // 作品数
            video_count = userData.author.interactionStatistic[2].userInteractionCount
            // 性别
            sex = 0;
            // 位置
            location = userData.author.homeLocation.name
            // 平台id
            platform_id = 35;
            // 自定义字段
            diy = {

            };
        }else if(rex.match(/https:\/\/www.pinterest.com\/*/)){
            //  pinterest

            // let uid = unsafeWindow.SIGI_STATE.UserPage.uniqueId
            // console.log(uid)

            // let userCount = unsafeWindow.SIGI_STATE.UserModule.stats[uid]
            // console.log(userCount)

            let userData;

            let pinterestSection = {
                source_url: unsafeWindow.location.pathname,
                data: JSON.stringify({
                    "options":{
                        "username": unsafeWindow.location.pathname.split("/")[1],
                        "field_set_key": "profile"
                    },
                    "context": "{}"
                }),
                _: new Date().getTime()
            }

            $.ajax({
                type: "get",
                url: "https://www.pinterest.com/resource/UserResource/get/",
                data: pinterestSection,
                dataType: "json",
                async: false,
                success: function (res) {
                    console.log(res)
                    userData = res.resource_response.data
                }
            })


            console.log(userData)

            // 粉丝数
            fans_count = userData.follower_count
            // id
            sec_uid = userData.username
            // author_id
            author_id = userData.username
            // 昵称
            nick = userData.full_name
            // account号
            account = userData.username
            // 分类
            cate = "";
            // 位置
            location = ""
            // 头像
            avatar = userData.image_xlarge_url
            // 简介
            desc = userData.about
            // 获赞数
            // like_count = userData.heartCount;
            // 作品数
            video_count = userData.video_pin_count
            // 性别
            sex = 0;
            // 平台id
            platform_id = 35;
            // 自定义字段
            diy = {

            };
        }else if(rex.match(/https:\/\/fanxing.kugou.com\/cterm\/ssr\/profile\/pc\/views\/ssrindex.html?/)){
            //  酷狗直播

            // let uid = unsafeWindow.SIGI_STATE.UserPage.uniqueId
            // console.log(uid)

            // let userCount = unsafeWindow.SIGI_STATE.UserModule.stats[uid]
            // console.log(userCount)

            let userData = unsafeWindow.ownerUserInfo;

//             let kgSection = {
//                 userId: unsafeWindow.location.search.split("&userId=")[1],
//                 appid: 1010,
//                 channel:1,
//                 std_plat:7,
//                 platform:7,
//                 times: new Date().getTime(),
//                 version:1,
//                 sign: md5("386487573",16)
//             }
//             console.log(kgSection)

//             $.ajax({
//                 type: "get",
//                 url: "https://fx.service.kugou.com/mfx-user/cdn/user/getUserInfo",
//                 data: kgSection,
//                 dataType: "json",
//                 async: false,
//                 success: function (res) {
//                     console.log(res)
//                     // userData = res.resource_response.data
//                 }
//             })

            $.ajax({
                type: "get",
                url: "https://fx2.service.kugou.com/show/focus/json/v2/focus/web/fansCount",
                data: {
                    kugouId: userData.kugouId
                },
                dataType: "json",
                async: false,
                success: function (res) {
                    console.log(res)
                    // 粉丝数
                    fans_count = res.data.fansCount
                }
            })


            console.log(userData)


            // id
            sec_uid = userData.userId
            // author_id
            author_id = userData.userId
            // 昵称
            nick = userData.nickName
            // account号
            account = userData.kugouId
            // 分类
            cate = "";
            // 位置
            location = $(".binfo_tr:nth-child(1) .binfo_td1:nth-child(2)>span").text()
            // 头像
            avatar = userData.userLogo
            // 简介
            desc = ""
            // 获赞数
            // like_count = userData.heartCount;
            // 作品数
            video_count = 0
            // 性别
            sex = $(".binfo_tr:nth-child(1) .binfo_td1:nth-child(1)>span").text() == "男" ? 1 : 2
            // 平台id
            platform_id = 36;
            // 自定义字段
            diy = {
                location: location,
                roomId: userData.roomId
            };
        }else if(rex.match(/https:\/\/xh.newrank.cn/) != null){
            // 新红

            console.log(document.cookie)

            console.log(unsafeWindow.joker_config.url)


             // GM_xmlhttpRequest({
             //     method: "POST",
             //     url: "https://spider.oa.cyek.com/bus/setXhCookies",
             //     // crossDomain:true,
             //     xhrFields: {
             //         withCredentials: true // 这里设置了withCredentials
             //     },
             //     data: JSON.stringify({
             //        cookies: document.cookie
             //     }),
             //     onload: function(res) {
             //         // console.log(res)
             //         if (res.status == 200) {
             //             var text = res.responseText;
             //             var json = JSON.parse(text);
             //             console.log(json);
             //             if(json.code == 1000){
             //                 console.log(json)
             //             }else if(json.code == 1002){
             //                 alert(json.message);
             //             }else{
             //                 alert(json.message);
             //                 $(".loading").hide();
             //             }
             //         }
             //     }
             // });

            // $.ajax({
            //     type: "post",
            //     url: "https://spider.oa.cyek.com/bus/setXhCookies",
            //     // crossDomain:true,
            //     // xhrFields: {
            //     //     withCredentials: true // 这里设置了withCredentials
            //     // },
            //     data: {
            //         cookies: document.cookie
            //     },
            //     success: function (res) {
            //         console.log(res)
            //     }
            // })
        }else if(rex.match(/https:\/\/m.dewu.com\/h5-sociality\/community\/user-home-page\/hybird\/h5other\/shareMiddle*/) != null){
            // 得物
            let dewuData = JSON.parse($("#__NEXT_DATA__").text())
            console.log(dewuData)

            // id
            sec_uid = dewuData.props.pageProps.userId
            // author_id
            author_id = dewuData.props.pageProps.getData.data.userInfo.userId
            // 昵称
            nick = dewuData.props.pageProps.getData.data.userInfo.userName
            // account号
            account = dewuData.props.pageProps.userId
            // 分类
            cate = "";
            // 位置
            location = ""
            // 头像
            avatar = dewuData.props.pageProps.getData.data.userInfo.icon
            // 简介
            desc = dewuData.props.pageProps.getData.data.userInfo.idiograph
            // 获赞数
            // like_count = userData.heartCount;
            // 作品数
            video_count = dewuData.props.pageProps.getData.data.trendsTotalInfo.videoTotal
            // 性别
            sex = dewuData.props.pageProps.getData.data.userInfo.sex
            // 平台id
            platform_id = 37;
            // 自定义字段
            // diy = {
            //     location: location,
            //     roomId: dewuData.roomId
            // };

        }


        // 弹窗手机微信QQ添加
        $(".form-add").click(function(){
            var createEle = $(this).parent();
            $(this).parent().parent().append(createEle.clone());
            $(this).parent().parent().children(":last-child").children("span").text("");
            $(this).parent().parent().children(":last-child").children("input").val("");
            $(this).parent().parent().children(":last-child").children(".form-add").remove();
            var deleteEle = '<div class="form-delete"><svg t="1645496440023" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1896" width="32" height="32"><path d="M512 70.89056c-245.574045 0-444.650079 199.077058-444.650079 444.651103 0 245.573021 199.077058 444.650079 444.650079 444.650079s444.650079-199.077058 444.650079-444.650079c0-245.575068-199.077058-444.651103-444.650079-444.651103z m228.41934 465.322911H296.317753v-50.517557h444.101587v50.517557z" p-id="1897" fill="#000000"></path></svg></div>';
            $(this).parent().parent().children(":last-child").append(deleteEle);
        })
        // 弹窗手机微信QQ删除
        $(".form-enter>div").on("click",".form-delete",function(){
            $(this).parent().remove();
        })

        // 遍历提交数据信息
        function info(className){
            var a = [];
            $(className).each(function(i,v){
                var cl = v.value;
                //if(cl !== ""){
                    a.push(cl);
                //}
            })
            // console.log(a);
            return a;
        }

        // 切换tab
        function tabs(el,cont){
            $(el).click(function(){
                $(this).addClass("active").siblings().removeClass("active");
                $(cont).children().eq($(this).index()).addClass("active").siblings().removeClass("active");
            })
        }

        // 查找地区值
        function search(object, num) {
            for (var key in object) {
                if (object[key] == object[num]) return object[key];
                for(var i in object[key]){
                    // console.log("地区",object[key][i]);
                    var select = "";
                    if(i == num){
                        console.log(object[key][num])
                        select = object[key][num];
                        return select;
                    }
                }
            }
        }

        // 查找分类值
        function searchCate(object, num) {
            for (var key in object) {
                if (object[key] == object[num]) return object[key];
                for(var i in object[key]){
                    //console.log(object[key][i]);
                    var select = [];
                    if(object[key][i] == object[key][num]){
                        select = [object[0][key],object[key][num]];
                        return select;
                    }
                }
            }
        }



        // 达人分类数据
        function cateData(el){
            $(".loading").show();
            $('.loading svg text').text('数据抓取中，请勿关闭')
            var token = localStorage.getItem("token");
            let cateParam = {
                "app_type": "tools_"+platform_id,
                "app_id": 1,
                "sign": 1,
                "access_token": token,
            }

            req(apiHost+"/spider/browser/cates",JSON.stringify(cateParam),function(res){
                // 绑定达人信息分类数据
                $(el).html("");
                let cateTitle = ""
                let cateData = "";
                let cateContent = "";

                // 循环遍历分类数据渲染
                res.result.forEach(function(self,index){
                    cateTitle = `<p>${self.name}：</p>`
                    self.children.forEach(function(self,index){
                        cateData += `<div data-flag="0" data-num="${self.id}">${self.name}</div>`
                    })
                    cateContent += `<div class="cateBox">${cateTitle}<div class="cateData">${cateData}</div></div>`
                    cateData = "";
                })

                // 达人信息分类数据
                $(el).append(cateContent)

                // 分类点击选中
                $(".cateData>div").click(function(){
                    if($(this).attr("data-flag") == 0){
                        $(this).addClass("active")
                        $(this).attr("data-flag","1")
                    }else{
                        $(this).removeClass("active")
                        $(this).attr("data-flag","0")
                    }
                })


                // 基础数据达人分类标记
                var cate_id = localStorage.getItem("cate_id");
                var cateArr = cate_id.split(",");
                cateArr.forEach(function(index,self){
                    $("#cate-select .cateData>div").each(function(){
                        if($(this).attr("data-num") == index){
                            $(this).addClass("active")
                            $(this).attr("data-flag","1")
                        }
                    })
                })

                $(".loading").hide();
            })

        }



        // 更新数据 补充联系方式
        $("#operate-data").click(function(){
            $(".mask").show();
        })

        // 绑定达人 补充联系方式
        $(".operate-ewm").on("click",".bindBtn",function(){
            cateData(".cate-content")
            $(".bindContact").show();
        })

        // 更新基础数据
        $("#operate-base").click(function(){
            cateData("#cate-select")
            $(".dataTool").show();
        })

        // 设置分类
        $(".cateBtn button").click(function(){
            cateData("#cateSelect")
            $(".cateTool").show();
        })



        //  md5 方法
        function md5(string) {
            function md5_RotateLeft(lValue, iShiftBits) {
              return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
            }

            function md5_AddUnsigned(lX, lY) {
              var lX4, lY4, lX8, lY8, lResult;
              lX8 = (lX & 0x80000000);
              lY8 = (lY & 0x80000000);
              lX4 = (lX & 0x40000000);
              lY4 = (lY & 0x40000000);
              lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
              if (lX4 & lY4) {
                  return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
              }
              if (lX4 | lY4) {
                  if (lResult & 0x40000000) {
                      return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                  } else {
                      return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                  }
              } else {
                  return (lResult ^ lX8 ^ lY8);
              }
            }

            function md5_F(x, y, z) {
              return (x & y) | ((~x) & z);
            }

            function md5_G(x, y, z) {
              return (x & z) | (y & (~z));
            }

            function md5_H(x, y, z) {
              return (x ^ y ^ z);
            }

            function md5_I(x, y, z) {
              return (y ^ (x | (~z)));
            }

            function md5_FF(a, b, c, d, x, s, ac) {
              a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_F(b, c, d), x), ac));
              return md5_AddUnsigned(md5_RotateLeft(a, s), b);
            };

            function md5_GG(a, b, c, d, x, s, ac) {
              a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_G(b, c, d), x), ac));
              return md5_AddUnsigned(md5_RotateLeft(a, s), b);
            };

            function md5_HH(a, b, c, d, x, s, ac) {
              a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_H(b, c, d), x), ac));
              return md5_AddUnsigned(md5_RotateLeft(a, s), b);
            };

            function md5_II(a, b, c, d, x, s, ac) {
              a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_I(b, c, d), x), ac));
              return md5_AddUnsigned(md5_RotateLeft(a, s), b);
            };

            function md5_ConvertToWordArray(string) {
              var lWordCount;
              var lMessageLength = string.length;
              var lNumberOfWords_temp1 = lMessageLength + 8;
              var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
              var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
              var lWordArray = Array(lNumberOfWords - 1);
              var lBytePosition = 0;
              var lByteCount = 0;
              while (lByteCount < lMessageLength) {
                  lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                  lBytePosition = (lByteCount % 4) * 8;
                  lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
                  lByteCount++;
              }
              lWordCount = (lByteCount - (lByteCount % 4)) / 4;
              lBytePosition = (lByteCount % 4) * 8;
              lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
              lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
              lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
              return lWordArray;
            };

            function md5_WordToHex(lValue) {
              var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
              for (lCount = 0; lCount <= 3; lCount++) {
                  lByte = (lValue >>> (lCount * 8)) & 255;
                  WordToHexValue_temp = "0" + lByte.toString(16);
                  WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
              }
              return WordToHexValue;
            };

            function md5_Utf8Encode(string) {
              string = string.replace(/\r\n/g, "\n");
              var utftext = "";
              for (var n = 0; n < string.length; n++) {
                  var c = string.charCodeAt(n);
                  if (c < 128) {
                      utftext += String.fromCharCode(c);
                  } else if ((c > 127) && (c < 2048)) {
                      utftext += String.fromCharCode((c >> 6) | 192);
                      utftext += String.fromCharCode((c & 63) | 128);
                  } else {
                      utftext += String.fromCharCode((c >> 12) | 224);
                      utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                      utftext += String.fromCharCode((c & 63) | 128);
                  }
              }
              return utftext;
            };
            var x = Array();
            var k, AA, BB, CC, DD, a, b, c, d;
            var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
            var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
            var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
            var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
            string = md5_Utf8Encode(string);
            x = md5_ConvertToWordArray(string);
            a = 0x67452301;
            b = 0xEFCDAB89;
            c = 0x98BADCFE;
            d = 0x10325476;
            for (k = 0; k < x.length; k += 16) {
              AA = a;
              BB = b;
              CC = c;
              DD = d;
              a = md5_FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
              d = md5_FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
              c = md5_FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
              b = md5_FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
              a = md5_FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
              d = md5_FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
              c = md5_FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
              b = md5_FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
              a = md5_FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
              d = md5_FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
              c = md5_FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
              b = md5_FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
              a = md5_FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
              d = md5_FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
              c = md5_FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
              b = md5_FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
              a = md5_GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
              d = md5_GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
              c = md5_GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
              b = md5_GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
              a = md5_GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
              d = md5_GG(d, a, b, c, x[k + 10], S22, 0x2441453);
              c = md5_GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
              b = md5_GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
              a = md5_GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
              d = md5_GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
              c = md5_GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
              b = md5_GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
              a = md5_GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
              d = md5_GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
              c = md5_GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
              b = md5_GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
              a = md5_HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
              d = md5_HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
              c = md5_HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
              b = md5_HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
              a = md5_HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
              d = md5_HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
              c = md5_HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
              b = md5_HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
              a = md5_HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
              d = md5_HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
              c = md5_HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
              b = md5_HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
              a = md5_HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
              d = md5_HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
              c = md5_HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
              b = md5_HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
              a = md5_II(a, b, c, d, x[k + 0], S41, 0xF4292244);
              d = md5_II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
              c = md5_II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
              b = md5_II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
              a = md5_II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
              d = md5_II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
              c = md5_II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
              b = md5_II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
              a = md5_II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
              d = md5_II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
              c = md5_II(c, d, a, b, x[k + 6], S43, 0xA3014314);
              b = md5_II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
              a = md5_II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
              d = md5_II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
              c = md5_II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
              b = md5_II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
              a = md5_AddUnsigned(a, AA);
              b = md5_AddUnsigned(b, BB);
              c = md5_AddUnsigned(c, CC);
              d = md5_AddUnsigned(d, DD);
            }
            return (md5_WordToHex(a) + md5_WordToHex(b) + md5_WordToHex(c) + md5_WordToHex(d)).toLowerCase();
        }


        // syncInfo 接口调用刷新mcn数据
        function syncInfo(){
            var dataBind = {
                "app_type": "tools_"+platform_id,
                "app_id": 1,
                "sign": 1,
                "sec_uid": sec_uid,
                "platform_id": platform_id,
                "link": window.location.href,
                "author_id": author_id,
                "nick": nick,
                "account": account,
                "avatar": avatar,
                "desc": desc,
                "like_count": like_count,
                "fans_count": fans_count,
                "video_count": video_count,
                "cate_str": cate,
                "sex": sex,
                "diy": diy,
                "v": version
            }

            req(apiHost+"/spider/browser/syncInfo",JSON.stringify(dataBind),function(res){
                return false
            })


            // $.ajax({
            //     type: "post",
            //     url: apiHost+"/spider/browser/syncInfo",
            //     data: dataBind,
            //     dataType: "json",
            //     success: function (res) {
            //         console.log(res);
            //         if(res.code != 1000){
            //             alert(res.message)
            //         }
            //     }
            // })
        }



        function copyInfo(el1,el2,info){
            $(el1).on("click",el2,function(){
                var Url2= info;
                var oInput = document.createElement('input');
                oInput.value = Url2;
                document.body.appendChild(oInput);
                oInput.select(); // 选择对象
                document.execCommand("Copy"); // 执行浏览器复制命令
                oInput.className = 'oInput';
                oInput.remove();
                $(".msg").text("复制成功!");
                $(".msg").fadeIn();
                msgHide();
            })
        }


        // resourceInfo 接口调用
        function resourceInfo(){
            var token = localStorage.getItem("token");
            // 检测达人是否可以绑定
            var dataBind = {
                "app_type": "tools_"+platform_id,
                "app_id": 1,
                "sign": 1,
                "access_token": token,
                "sec_uid": sec_uid,
                "platform_id": platform_id,
                "link": window.location.href,
                "author_id": author_id,
                "nick": nick,
                "account": account,
                "avatar": avatar,
                "desc": desc,
                "like_count": like_count,
                "fans_count": fans_count,
                "video_count": video_count,
                "cate_str": cate,
                "sex": sex,
                "diy": diy,
                "v": version,
                "account_tag": account_tag
            }
            // console.log(dataBind);

            $(".loginBox").hide();
            $(".operate").show();

            // 粉丝数少于49500  不显示操作
            // if(fans_count < fansNum){
            //     $(".operate-btn").hide();
            //     $(".talent").hide();
            //     $(".expandTime").hide();
            //     $(".expand").text("该达人粉丝数少于五万不达标！");
            // }

            req(apiHost+"/spider/browser/resourceInfo",JSON.stringify(dataBind),function(response){
                // 设置cool_id,resource_id
                localStorage.setItem("cool_id",response.result.info.cool_id);
                localStorage.setItem("resource_id",response.result.info.resource_id);


                var isBind = response.result.info.is_bind;
                if(response.result.info.qrcode != ""){
                    let ewm = `<img src="${response.result.info.qrcode}" /><p>APP扫码发送私信</p>`
                    $(".ewm-img").append(ewm)
                }

                // 绑定达人按钮
                if(response.result.info.coolstar_state == 0){
                    let bindBtn = `<button class="bindBtn">绑定达人</button>`;
                    $(".ewm-bind").append(bindBtn)
                }else{
                    let bindBtn = `<a href="https://oa.test.cyek.com/home/work/teamStar/sw" class="prohibitBtn" target="_blank">查看详情</a>`;
                    $(".ewm-bind").append(bindBtn)
                    let msg = `<p>${response.result.info.coolstar_state_str}</p>`
                    $(".ewm-bind").append(msg)
                }


                $(".nickName").text(nick == undefined ? "" : nick);
                $(".expand span").text(response.result.info.mcn_bind_state_str);
                $(".expandTime span").text(response.result.info.mcn_bind_refresh_time_str);
                // $(".talent span").text(response.result.info.with_desc);

                // 达人编号
                if(response.result.info.cool_id != ""){
                    let starNum = "<p>达人编号：<span id='copy'>" + response.result.info.cool_id + "</span></p>";
                    $("#starNum").append(starNum);
                }

                // 页面显示author_id
                // let authorNum = "<div><span id='coolCopy'>MID：</span><span id='copy'>" + author_id + "</span></div>";
                // console.log(author_id)
                // $(".info-name").append(authorNum);

                // 点击复制cool_id
                copyInfo(".info-name","#coolCopy",response.result.info.cool_id)

                // 增加复制长链接按钮
                let btnLink = `<button id="btnLink">复制长链接</button>`
                $("#copyLink").append(btnLink)
                copyInfo(".info-name","#btnLink",response.result.info.home_url)



                // 达人未被绑定显示绑定按钮
                // if(isBind == 1){
                //     var bindBtn = "<button id='bindNow'>立即绑定</button>";
                //     $(".talent").append(bindBtn);
                // }

                // 检测达人是否被自己绑定
                // if(response.result.info.is_my_star == 0){
                //     // 没绑定 达人日志按钮隐藏
                //     if(response.result.info.move_type <= 0){
                //         $(".operate-record").hide();
                //     }
                // }

                // else if(response.result.info.is_my_star == 1){
                //     // 检测是否可以解绑
                //     var unbind = `<button data-type='3' id='unbind'>解绑</button>`;
                //     $(".talent").append(unbind);
                // }

                // 检测是否可以分配转让
                // if(response.result.info.move_type == 1){
                //     var assign = `<button data-type='1' class='assign'>分配</button>`;
                //     $(".talent").append(assign);
                // }else if(response.result.info.move_type == 2){
                //     var transfer = `<button data-type='2' class='assign'>转让</button>`;
                //     $(".talent").append(transfer);
                // }


//                 // 已有手机
//                 $(".added-phone").html("")
//                 if(response.result.info.phone.length == 0){
//                     $(".added-phone").parent().hide();
//                 }else{
//                     response.result.info.phone.forEach(function(self, index, arr){
//                         var contact = "<p>"+ self.value +"</p>";
//                         $(".added-phone").append(contact);
//                     })
//                 }
//                 // 已有微信
//                 $(".added-wechat").html("")
//                 if(response.result.info.wechat.length == 0){
//                     $(".added-wechat").parent().hide();
//                 }else{
//                     response.result.info.wechat.forEach(function(self, index, arr){
//                         var contact = "<p>"+ self.value +"</p>";
//                         $(".added-wechat").append(contact);
//                     })
//                 }
//                 // 已有QQ
//                 $(".added-qq").html("")
//                 if(response.result.info.qq.length == 0){
//                     $(".added-qq").parent().hide();
//                 }else{
//                     response.result.info.qq.forEach(function(self, index, arr){
//                         var contact = "<p>"+ self.value +"</p>";
//                         $(".added-qq").append(contact);
//                     })
//                 }

//                 // 地区选择
//                 var province_id = response.result.info.province_id;
//                 var city_id = response.result.info.city_id
//                 var district_id = response.result.info.district_id
//                 console.log("province_id",province_id);
//                 if(province_id == 0){
//                     // 地区选择
//                     $("#area").distpicker({
//                         autoSelect: false
//                     });
//                 }else{
//                     // 地区选择
//                     $("#area").distpicker({
//                         province: search(ChineseDistricts,province_id),
//                         city: search(ChineseDistricts,city_id),
//                         district: search(ChineseDistricts,district_id)
//                     });
//                     if(city_id == 0){
//                         $("#city option:first-child").attr("selected","selected");
//                     }
//                     if(district_id == 0){
//                         $("#district option:first-child").attr("selected","selected");
//                     }
//                 }


                // 分类id显示 选中状态
                // 设置存储分类id
                localStorage.setItem("cate_id",response.result.info.cate_id);
                var cate_id = response.result.info.cate_id;
                // var cateArr = cate_id.split(",");
                // cateArr.forEach(function(index,self){
                //     $("#cate-select .cateData>div").each(function(){
                //         if($(this).attr("data-num") == index){
                //             $(this).addClass("active")
                //             $(this).attr("data-flag","1")
                //         }
                //     })
                // })





                // 判断标记是否为什么类型的达人
                // $(".cateBtn").each(function(index,self){
                //     // console.log(self)
                //     // 遍历返回文案对象
                //     for(let i in response.result.info.temp_cate){
                //         // console.log(response.result.info.temp_cate[i])
                //         // 判断返回分类id是否跟达人id一致
                //         if(cate_id.indexOf($(this).attr("data-num")) != -1){
                //             // 渲染返回文案内容
                //             if(i == $(this).attr("data-num")){
                //                 $(this).children("button").text(response.result.info.temp_cate[i])
                //             }
                //             // 按钮置灰
                //             $(this).children("button").css({
                //                 "pointer-events": "none",
                //                 "backgroundColor": "#ccc"
                //             })
                //         }
                //     }
                // })



                // 性别选择
                // var sex_id = response.result.info.sex;
                // var sex = $("#sex").children();
                // for(var j=0;j<4;j++){
                //     if(sex[j].getAttribute("data-code") == sex_id){
                //         sex[j].setAttribute("selected","selected");
                //     }
                // }

                // 根据返回 info.panel_hide 判断是否隐藏操作
                if(response.result.info.panel_hide == 0){
                    $(".status").show();
                }else{
                    $(".status").hide();
                }


                // 内容开放平台以及点淘业务内容
                $(".data-tabContent").html("")
                let tabData = "";
                let tabList = "";
                let contentData= "";
                let listData= "";
                if(response.result.lists.length > 0){
                    response.result.lists.forEach(function(self,index){
                        if(self.sel == 1){
                            tabData += "<div class='tab-title active' data-id='"+ self.id +"' title='" + self.name + "'><img src='" + self.icon + "'/></div>"
                            self.table.forEach(function(s,i){
                                if(s.oper){
                                    listData += "<div>"+s.name+":<span>"+s.value+"</span><button id='"+ s.oper +"'></button></div>"
                                }else{
                                    listData += "<div>"+s.name+":<span>"+s.value+"</span></div>"
                                }
                            })
                            contentData = "<div>"+listData+"</div>"
                        }else{
                            tabData += "<div class='tab-title' data-id='"+ self.id +"' title='" + self.name + "'><img src='" + self.icon + "'/></div>"
                        }
                        listData = ""
                    })
                    $(".data-tabContent").show()
                }else{
                    $(".data-menu").hide()
                }

                // 业务切换
                $(".data-tab").on("click",".tab-title",function(){
                    let _this = $(this)

                    let tabTitle = {
                        "app_type": "tools_"+platform_id,
                        "app_id": 1,
                        "sign": 1,
                        "access_token": token,
                        "platform_id": platform_id,
                        "cool_id": response.result.info.cool_id,
                        "pid": $(this).attr("data-id"),
                    }

                    $.ajax({
                        type: "post",
                        url: apiHost+"/spider/browser/project/info",
                        data: tabTitle,
                        dataType: "json",
                        success: function (res) {
                            if(res.code == 1000){
                                $(".data-tabContent").html("")
                                _this.addClass("active").siblings().removeClass("active");
                                res.result.table.forEach(function(s,i){
                                    if(s.oper){
                                        listData += "<div>"+s.name+":<span>"+s.value+"</span><button id='"+ s.oper +"'></button></div>"
                                    }else{
                                        listData += "<div>"+s.name+":<span>"+s.value+"</span></div>"
                                    }
                                })
                                contentData = "<div>"+listData+"</div>"
                                listData = "";
                                $(".data-tabContent").append(contentData)
                                // console.log(contentData)
                            }else if(res.code == 1002){
                                alert(res.message);
                                localStorage.removeItem("token");
                                localStorage.removeItem("storagePhone");
                                localStorage.removeItem("storagePwd");
                                localStorage.removeItem("dep_name");
                                localStorage.removeItem("staffName");
                                window.location.reload();
                            }else{
                                // 显示提示信息
                                alert(res.message)
                            }
                        }
                    });
                });
                $(".data-tab").append(tabData)
                $(".data-tabContent").append(contentData)
                $("#refresh_om").text("点击刷新")
                // 点击刷新拓展状态
                refresh_om()
            })

//             $.ajax({
//                 type: "post",
//                 url: apiHost+"/spider/browser/resourceInfo",
//                 data: dataBind,
//                 dataType: "json",
//                 success: function (response) {
//                     console.log(response);
//                     if(response.code == 1000){

//                         // 设置cool_id,resource_id
//                         localStorage.setItem("cool_id",response.result.info.cool_id);
//                         localStorage.setItem("resource_id",response.result.info.resource_id);


//                         var isBind = response.result.info.is_bind;
//                         if(response.result.info.qrcode != ""){
//                             let ewm = `<img src="${response.result.info.qrcode}" /><p>APP扫码发送私信</p>`
//                             $(".ewm-img").append(ewm)
//                         }

//                         // 绑定达人按钮
//                         if(response.result.info.coolstar_state == 0){
//                             let bindBtn = `<button class="bindBtn">绑定达人</button>`;
//                             $(".ewm-bind").append(bindBtn)
//                         }else{
//                             let bindBtn = `<a href="https://oa.test.cyek.com/home/work/teamStar/sw" class="prohibitBtn" target="_blank">查看详情</a>`;
//                             $(".ewm-bind").append(bindBtn)
//                             let msg = `<p>${response.result.info.coolstar_state_str}</p>`
//                             $(".ewm-bind").append(msg)
//                         }


//                         $(".nickName").text(response.result.info.nick_prefix+ (nick == undefined ? "" : nick));
//                         $(".expand span").text(response.result.info.mcn_bind_state_str);
//                         $(".expandTime span").text(response.result.info.mcn_bind_refresh_time_str);
//                         // $(".talent span").text(response.result.info.with_desc);

//                         // 达人编号
//                         if(response.result.info.resource_id != 0){
//                             let starNum = "<p>达人编号：<span id='copy'>" + response.result.info.resource_id + "</span></p>";
//                             $(".info-name").append(starNum);
//                         }

//                         // 页面显示author_id
//                         // let authorNum = "<div><span id='coolCopy'>MID：</span><span id='copy'>" + author_id + "</span></div>";
//                         // console.log(author_id)
//                         // $(".info-name").append(authorNum);

//                         // 点击复制cool_id
//                         copyInfo(".info-name","#coolCopy",response.result.info.cool_id)

//                         // 增加复制长链接按钮
//                         let btnLink = `<button id="btnLink">复制长链接</button>`
//                         $(".info-name").append(btnLink)
//                         copyInfo(".info-name","#btnLink",response.result.info.home_url)



//                         // 达人未被绑定显示绑定按钮
//                         // if(isBind == 1){
//                         //     var bindBtn = "<button id='bindNow'>立即绑定</button>";
//                         //     $(".talent").append(bindBtn);
//                         // }

//                         // 检测达人是否被自己绑定
//                         if(response.result.info.is_my_star == 0){
//                             // 没绑定 达人日志按钮隐藏
//                             if(response.result.info.move_type <= 0){
//                                 $(".operate-record").hide();
//                             }
//                         }

//                         // else if(response.result.info.is_my_star == 1){
//                         //     // 检测是否可以解绑
//                         //     var unbind = `<button data-type='3' id='unbind'>解绑</button>`;
//                         //     $(".talent").append(unbind);
//                         // }

//                         // 检测是否可以分配转让
//                         // if(response.result.info.move_type == 1){
//                         //     var assign = `<button data-type='1' class='assign'>分配</button>`;
//                         //     $(".talent").append(assign);
//                         // }else if(response.result.info.move_type == 2){
//                         //     var transfer = `<button data-type='2' class='assign'>转让</button>`;
//                         //     $(".talent").append(transfer);
//                         // }


//                         // 已有手机
//                         $(".added-phone").html("")
//                         if(response.result.info.phone.length == 0){
//                             $(".added-phone").parent().hide();
//                         }else{
//                             response.result.info.phone.forEach(function(self, index, arr){
//                                 var contact = "<p>"+ self.value +"</p>";
//                                 $(".added-phone").append(contact);
//                             })
//                         }
//                         // 已有微信
//                         $(".added-wechat").html("")
//                         if(response.result.info.wechat.length == 0){
//                             $(".added-wechat").parent().hide();
//                         }else{
//                             response.result.info.wechat.forEach(function(self, index, arr){
//                                 var contact = "<p>"+ self.value +"</p>";
//                                 $(".added-wechat").append(contact);
//                             })
//                         }
//                         // 已有QQ
//                         $(".added-qq").html("")
//                         if(response.result.info.qq.length == 0){
//                             $(".added-qq").parent().hide();
//                         }else{
//                             response.result.info.qq.forEach(function(self, index, arr){
//                                 var contact = "<p>"+ self.value +"</p>";
//                                 $(".added-qq").append(contact);
//                             })
//                         }

//                         // 地区选择
//                         var province_id = response.result.info.province_id;
//                         var city_id = response.result.info.city_id
//                         var district_id = response.result.info.district_id
//                         console.log("province_id",province_id);
//                         if(province_id == 0){
//                             // 地区选择
//                             $("#area").distpicker({
//                                 autoSelect: false
//                             });
//                         }else{
//                             // 地区选择
//                             $("#area").distpicker({
//                                 province: search(ChineseDistricts,province_id),
//                                 city: search(ChineseDistricts,city_id),
//                                 district: search(ChineseDistricts,district_id)
//                             });
//                             if(city_id == 0){
//                                 $("#city option:first-child").attr("selected","selected");
//                             }
//                             if(district_id == 0){
//                                 $("#district option:first-child").attr("selected","selected");
//                             }
//                         }


//                         // 分类id显示 选中状态
//                         // 设置存储分类id
//                         localStorage.setItem("cate_id",response.result.info.cate_id);
//                         var cate_id = response.result.info.cate_id;
//                         // var cateArr = cate_id.split(",");
//                         // cateArr.forEach(function(index,self){
//                         //     $("#cate-select .cateData>div").each(function(){
//                         //         if($(this).attr("data-num") == index){
//                         //             $(this).addClass("active")
//                         //             $(this).attr("data-flag","1")
//                         //         }
//                         //     })
//                         // })





//                         // 判断标记是否为什么类型的达人
//                         $(".cateBtn").each(function(index,self){
//                             // console.log(self)
//                             // 遍历返回文案对象
//                             for(let i in response.result.info.temp_cate){
//                                 // console.log(response.result.info.temp_cate[i])
//                                 // 判断返回分类id是否跟达人id一致
//                                 if(cate_id.indexOf($(this).attr("data-num")) != -1){
//                                     // 渲染返回文案内容
//                                     if(i == $(this).attr("data-num")){
//                                         $(this).children("button").text(response.result.info.temp_cate[i])
//                                     }
//                                     // 按钮置灰
//                                     $(this).children("button").css({
//                                         "pointer-events": "none",
//                                         "backgroundColor": "#ccc"
//                                     })
//                                 }
//                             }
//                         })



//                         // 性别选择
//                         var sex_id = response.result.info.sex;
//                         var sex = $("#sex").children();
//                         for(var j=0;j<4;j++){
//                             if(sex[j].getAttribute("data-code") == sex_id){
//                                 sex[j].setAttribute("selected","selected");
//                             }
//                         }

//                         // 根据返回 info.panel_hide 判断是否隐藏操作
//                         if(response.result.info.panel_hide == 0){
//                             $(".status").show();
//                         }else{
//                             $(".status").hide();
//                         }


//                         // 内容开放平台以及点淘业务内容
//                         $(".data-tabContent").html("")
//                         let tabData = "";
//                         let tabList = "";
//                         let contentData= "";
//                         let listData= "";
//                         if(response.result.lists.length > 0){
//                             response.result.lists.forEach(function(self,index){
//                                 if(self.sel == 1){
//                                     tabData += "<div class='tab-title active' data-id='"+ self.id +"' title='" + self.name + "'><img src='" + self.icon + "'/></div>"
//                                     self.table.forEach(function(s,i){
//                                         if(s.oper){
//                                             listData += "<div>"+s.name+":<span>"+s.value+"</span><button id='"+ s.oper +"'></button></div>"
//                                         }else{
//                                             listData += "<div>"+s.name+":<span>"+s.value+"</span></div>"
//                                         }
//                                     })
//                                     contentData = "<div>"+listData+"</div>"
//                                 }else{
//                                     tabData += "<div class='tab-title' data-id='"+ self.id +"' title='" + self.name + "'><img src='" + self.icon + "'/></div>"
//                                 }
//                                 listData = ""
//                             })
//                             $(".data-tabContent").show()
//                         }else{
//                             $(".data-menu").hide()
//                         }

//                         // 业务切换
//                         $(".data-tab").on("click",".tab-title",function(){
//                             let _this = $(this)

//                             let tabTitle = {
//                                 "app_type": "tools_"+platform_id,
//                                 "app_id": 1,
//                                 "sign": 1,
//                                 "access_token": token,
//                                 "platform_id": platform_id,
//                                 "cool_id": response.result.info.cool_id,
//                                 "pid": $(this).attr("data-id"),
//                             }

//                             $.ajax({
//                                 type: "post",
//                                 url: apiHost+"/spider/browser/project/info",
//                                 data: tabTitle,
//                                 dataType: "json",
//                                 success: function (res) {
//                                     if(res.code == 1000){
//                                         $(".data-tabContent").html("")
//                                         _this.addClass("active").siblings().removeClass("active");
//                                         res.result.table.forEach(function(s,i){
//                                             if(s.oper){
//                                                 listData += "<div>"+s.name+":<span>"+s.value+"</span><button id='"+ s.oper +"'></button></div>"
//                                             }else{
//                                                 listData += "<div>"+s.name+":<span>"+s.value+"</span></div>"
//                                             }
//                                         })
//                                         contentData = "<div>"+listData+"</div>"
//                                         listData = "";
//                                         $(".data-tabContent").append(contentData)
//                                         // console.log(contentData)
//                                     }else if(res.code == 1002){
//                                         alert(res.message);
//                                         localStorage.removeItem("token");
//                                         localStorage.removeItem("storagePhone");
//                                         localStorage.removeItem("storagePwd");
//                                         localStorage.removeItem("dep_name");
//                                         localStorage.removeItem("staffName");
//                                         window.location.reload();
//                                     }else{
//                                         // 显示提示信息
//                                         alert(res.message)
//                                     }
//                                 }
//                             });
//                         });
//                         $(".data-tab").append(tabData)
//                         $(".data-tabContent").append(contentData)
//                         $("#refresh_om").text("点击刷新")
//                         // 点击刷新拓展状态
//                         refresh_om()
//                     }else if(response.code == 1002){
//                         localStorage.removeItem("token");
//                         localStorage.removeItem("storagePhone");
//                         localStorage.removeItem("storagePwd");
//                         localStorage.removeItem("dep_name");
//                         localStorage.removeItem("staffName");
//                         $(".operate").hide();
//                         $(".loginBox").show();
//                     }else{
//                         alert(response.message);
//                     }
//                 }
//             })
        }

        


        // function stopKey(){
        //     $("#cyphoneNum").stopPropagation()
        //     $("#cypwd").stopPropagation()
        // }
        // $("#cyphoneNum").keydown(function(e){
        //     console.log(e)
        //     e.stopPropagation()
        // })

        // 点击登录验证显示弹窗
        function loginInfo(){
            if(checkphone()&&checkpwd()){
                let phone = $("#cyphoneNum").val()
                let pwd = md5($("#cypwd").val())
                // 登录传递的参数
                var data = {
                    "app_type": "tools_"+platform_id,
                    "app_id": 1,
                    "phone": phone,
                    "pwd": pwd,
                    "v": version
                }
                // console.log(data);
                // 登录传参
                req(apiHost+"/spider/browser/login",JSON.stringify(data),function(response){
                    // 获取部门和名字 存储
                    $(".operate-name").text("欢迎你，"+response.result.dep_name+"-"+response.result.name);
                    localStorage.setItem("dep_name",response.result.dep_name);
                    localStorage.setItem("name",response.result.name);

                    // 获取token 存储
                    localStorage.setItem("token",response.result.access_token);
                    var token = localStorage.getItem("token");

                    // 获取账号密码 存储session
                    // localStorage.setItem("storagePhone",$("#cyphoneNum").val());
                    // localStorage.setItem("storagePwd",md5($("#cypwd").val()));
                    // var storagePhone = localStorage.getItem("storagePhone");
                    // var storagePwd = localStorage.getItem("storagePwd");

                    resourceInfo();
                })

            }
        }


        $(".login-btn button").click(function(){
            if(rex.match(/https:\/\/xh.newrank.cn/) == null){
                loginInfo()
            }
        })
        $(".loginBox").keydown(function(){
            if(event.keyCode==13 && rex.match(/https:\/\/xh.newrank.cn/) == null){
                loginInfo()
            }
        })



        // 判断手机密码是否存储 存储就登录
        if(localStorage.getItem("token")!=null){
            if(rex.match(/https:\/\/www.kuaishou.com\/profile\/*/) == null && rex.match(/https:\/\/live.kuaishou.com\/profile\/*/) == null && rex.match(/https:\/\/www.xiaohongshu.com\/user\/profile\/*/) == null){
                if(rex.match(/https:\/\/weibo.com\/*/) != null){
                    if(rex.match(/https:\/\/weibo.com\/u\/*/) == null){
                        return false
                    }
                }
                resourceInfo();
            }
        }else{
            if(rex.match(/https:\/\/www.kuaishou.com\/profile\/*/) == null && rex.match(/https:\/\/live.kuaishou.com\/profile\/*/) == null && rex.match(/https:\/\/www.xiaohongshu.com\/user\/profile\/*/) == null){
                if(rex.match(/https:\/\/weibo.com\/*/) != null){
                    if(rex.match(/https:\/\/weibo.com\/u\/*/) == null){
                        return false
                    }
                }
                syncInfo()
            }
        }


        // 联系方式点击更新
        $(".form-btn button").click(function(){
            var token = localStorage.getItem("token");
            // 定义提交数据
            var tel = info(".tel").filter(i=>i && i.trim());
            var wechat = info(".wechat").filter(i=>i && i.trim());
            var qq = info(".qq").filter(i=>i && i.trim());

            // 提交的数据
            var dataInfo = {
                "app_type": "tools_"+platform_id,
                "access_token": token,
                "link": window.location.href,
                "sec_uid": sec_uid,
                "author_id": author_id,
                "platform_id": platform_id,
                "phone": tel,
                "wechat": wechat,
                "qq": qq
            }
            //console.log(dataInfo);

            req(apiHost+"/spider/browser/update/contact",JSON.stringify(dataInfo),function(response){
                // 提交完成关闭弹窗
                // 清空弹窗数据并隐藏
                $(".form-list input").val("");
                $(".form-list:first-child").nextAll().remove();
                $(".mask").hide();

                response.result.contact_result.phone.forEach(function(self, index, arr){
                    //console.log(self);
                    var status = self.status == 1 ? "有效" : "无效";
                    var phoneDiv = "<div><div>"+ self.value +"</div><div>"+ status +"</div><div>"+ self.integral +"</div></div>";
                    //console.log(phoneDiv);
                    $("#integral-phone").append(phoneDiv);
                })
                response.result.contact_result.wechat.forEach(function(self, index, arr){
                    //console.log(self);
                    var status = self.status == 1 ? "有效" : "无效";
                    var phoneDiv = "<div><div>"+ self.value +"</div><div>"+ status +"</div><div>"+ self.integral +"</div></div>";
                    //console.log(phoneDiv);
                    $("#integral-wechat").append(phoneDiv);
                })
                response.result.contact_result.qq.forEach(function(self, index, arr){
                    //console.log(self);
                    var status = self.status == 1 ? "有效" : "无效";
                    var phoneDiv = "<div><div>"+ self.value +"</div><div>"+ status +"</div><div>"+ self.integral +"</div></div>";
                    //console.log(phoneDiv);
                    $("#integral-qq").append(phoneDiv);
                })
                $(".info-total span").text(response.result.integral);

                $(".infoContact").show();
            })
//             $.ajax({
//                 type: "post",
//                 url: apiHost+"/spider/browser/update/contact",
//                 cache:false,
//                 data: dataInfo,
//                 dataType: "json",
//                 success: function (response) {
//                     console.log(response);
//                     if(response.code == 1000){
//                         // 提交完成关闭弹窗
//                         // 清空弹窗数据并隐藏
//                         $(".form-list input").val("");
//                         $(".form-list:first-child").nextAll().remove();
//                         $(".mask").hide();

//                         response.result.contact_result.phone.forEach(function(self, index, arr){
//                             //console.log(self);
//                             var status = self.status == 1 ? "有效" : "无效";
//                             var phoneDiv = "<div><div>"+ self.value +"</div><div>"+ status +"</div><div>"+ self.integral +"</div></div>";
//                             //console.log(phoneDiv);
//                             $("#integral-phone").append(phoneDiv);
//                         })
//                         response.result.contact_result.wechat.forEach(function(self, index, arr){
//                             //console.log(self);
//                             var status = self.status == 1 ? "有效" : "无效";
//                             var phoneDiv = "<div><div>"+ self.value +"</div><div>"+ status +"</div><div>"+ self.integral +"</div></div>";
//                             //console.log(phoneDiv);
//                             $("#integral-wechat").append(phoneDiv);
//                         })
//                         response.result.contact_result.qq.forEach(function(self, index, arr){
//                             //console.log(self);
//                             var status = self.status == 1 ? "有效" : "无效";
//                             var phoneDiv = "<div><div>"+ self.value +"</div><div>"+ status +"</div><div>"+ self.integral +"</div></div>";
//                             //console.log(phoneDiv);
//                             $("#integral-qq").append(phoneDiv);
//                         })
//                         $(".info-total span").text(response.result.integral);

//                         $(".infoContact").show();
//                     }else if(response.code == 1002){
//                         alert(response.message);
//                          localStorage.removeItem("token");
//                          localStorage.removeItem("storagePhone");
//                          localStorage.removeItem("storagePwd");
//                          localStorage.removeItem("dep_name");
//                          localStorage.removeItem("staffName");
//                         window.location.reload();
//                     }else{
//                         alert(response.message);
//                     }
//                 }
//             });

        })
        // 达人日志tab切换
        tabs(".record-navBar div",".record-cutover");



        // 提交绑定达人信息
        $(".bindContact-btn button").click(function(){
            var token = localStorage.getItem("token");
            // 定义提交数据
            var tel = info(".starTel").filter(i=>i && i.trim());
            var wechat = info(".starWechat").filter(i=>i && i.trim());

            let cate = []
            $(".cateData>div.active").each(function(index,self){
                // console.log($(this).attr("data-num"))
                cate.push($(this).attr("data-num"))
            })
            // console.log(cate)


            // 提交的数据
            var dataInfo = {
                "app_type": "tools_"+platform_id,
                "access_token": token,
                // "link": window.location.href,
                "app_id": "1",
                "sign": "1",
                // "sec_uid": sec_uid,
                // "author_id": author_id,
                "phones": tel,
                "wechats": wechat,
                "resources": [
                    {
                        "cate_ids": cate,
                        "cool_id": localStorage.getItem("cool_id"),
                        "platform_id": platform_id
                    }
                ]
            }

            if(tel.length == 0 && wechat.length == 0 || cate.length == 0){
                alert("手机微信或者分类至少都要有一个")
            }else{
                req(apiHost+"/spider/browser/mySubmit",JSON.stringify(dataInfo),function(res){
                    alert("绑定成功")
                    window.location.reload();
                })
            }


        })




        // 节流
        function throttle(func, wait=500, options) {
            //container.onmousemove = throttle(getUserAction, 1000);
            var timeout, context, args
            var previous = 0
            if (!options) options = {leading:true,trailing:false}

            var later = function() {
                previous = options.leading === false ? 0 : new Date().getTime()
                timeout = null
                func.apply(context, args)
                if (!timeout) context = args = null
            }

            var throttled = function() {
                var now = new Date().getTime()
                if (!previous && options.leading === false) previous = now
                var remaining = wait - (now - previous)
                context = this
                args = arguments
                if (remaining <= 0 || remaining > wait) {
                    if (timeout) {
                        clearTimeout(timeout)
                        timeout = null
                    }
                    previous = now
                    func.apply(context, args)
                    if (!timeout) context = args = null
                } else if (!timeout && options.trailing !== false) {
                    timeout = setTimeout(later, remaining)
                }
            }
            return throttled
        }

        // 防抖
        function debounce(func, wait=500, immediate=false) {
            var timeout
            return function() {
                var context = this
                var args = arguments

                if (timeout) clearTimeout(timeout)
                if (immediate) {
                    // 如果已经执行过，不再执行
                    var callNow = !timeout
                    timeout = setTimeout(function() {
                        timeout = null
                    }, wait)
                    if (callNow) func.apply(context, args)
                } else {
                    timeout = setTimeout(function() {
                        func.apply(context, args)
                    }, wait)
                }
            }
        }

        // 达人日志
        $(".operate-record").click(throttle(function(){
            var token = localStorage.getItem("token");
            // console.log(token);
            var dataRecord = {
                "app_type": "tools_"+platform_id,
                "access_token": token,
                "sec_uid": sec_uid,
                "author_id": author_id,
                "platform_id": platform_id,
                "link": window.location.href,
            }
            // console.log(dataRecord);
            $(".loading").show();
            $('.loading svg text').text('数据抓取中，请勿关闭')
            req(apiHost+"/spider/browser/starLog",JSON.stringify(dataRecord),function(response){
                var recordBind = "";
                var recordContact = "";
                var recordBasic = "";
                var log = response.result.data;
                // 绑定记录
                if(log.bind != undefined){
                    log.bind.forEach(function(self, index, arr){
                        recordBind += "<tr><td class='record-time'><span>"+ self.add_time_str +"</span></td>"+
                            "<td class='record-detail'><span>"+ self.operate_content +"</span></td>"+
                            "<td class='record-name'><span>"+ self.operate_name +"</span></td></tr>";
                    })
                }else{
                    recordBind = "<tr><td colspan='3'>无</td></tr>";
                }
                $("#cutover-bind").append(recordBind);

                // 联系方式
                if(log.contact != undefined){
                    log.contact.forEach(function(self, index, arr){
                        var details = "";
                        self.operate_detail.forEach(function(self, index, arr){
                            details += "<p>"+ self +"</p>"
                        })
                        recordContact += "<tr><td class='record-time'><span>"+ self.add_time_str +"</span></td>"+
                            "<td class='record-detail'>"+ details +"</td>"+
                            "<td class='record-name'><span>"+ self.operate_name +"</span></td></tr>";
                    })
                }else{
                    recordContact = "<tr><td colspan='3'>无</td></tr>";
                }
                $("#cutover-contact").append(recordContact);

                // 基础信息
                if(log.basic != undefined){
                    log.basic.forEach(function(self, index, arr){
                        var details = "";
                        self.operate_detail.forEach(function(self, index, arr){
                            details += "<p>"+ self +"</p>"
                        })
                        recordBasic += "<tr><td class='record-time'><span>"+ self.add_time_str +"</span></td>"+
                            "<td class='record-detail'>"+ details +"</td>"+
                            "<td class='record-name'><span>"+ self.operate_name +"</span></td></tr>";
                    })
                }else{
                    recordBasic = "<tr><td colspan='3'>无</td></tr>";
                }
                $("#cutover-basic").append(recordBasic);
                $(".loading").hide();
                $(".record").show();
            })
        },1500))


        // 获取省市区分类id值
        function btnId(el,elArr){
            var val = el.val();
            var elId = "";
            for(var j=0;j<elArr.length;j++){
                if(elArr[j].getAttribute("value") == val){
                    elId = elArr[j].getAttribute("data-code");
                }
            }
            return elId;
        }

        // 联动提交
        $(".data-btn button").click(function(){
            var token = localStorage.getItem("token");
            // 省市区id
            var province_id = btnId($("#province"),$("#province option"));
            console.log(province_id);
            var city_id = btnId($("#city"),$("#city option"));
            var district_id = btnId($("#district"),$("#district option"));
            // 分类id
            var cateArr = []
            $(".cateData>div.active").each(function(index,self){
                // console.log($(this).attr("data-num"))
                cateArr.push($(this).attr("data-num"))
            })
            // console.log(cateArr);
            // 性别id
            var sex = btnId($("#sex"),$("#sex option"));

            var dataSelect = {
                "app_type": "tools_"+platform_id,
                "access_token": token,
                "link": window.location.href,
                "sec_uid": sec_uid,
                "author_id": author_id,
                "platform_id": platform_id,
                "province_id": province_id == "" ? 0 : parseInt(province_id),
                "city_id": city_id == "" ? 0 : parseInt(city_id),
                "district_id": district_id == "" ? 0 : parseInt(district_id),
                "cate_id": cateArr.join(","),
                "sex": parseInt(sex)
            }
            console.log(dataSelect);

            req(apiHost+"/spider/browser/update/info",JSON.stringify(dataSelect),function(response){
                $(".dataTool").hide();
                $(".msg").text("提交成功!");
                $(".msg").fadeIn();
                msgHide();
            })
        })

        // 绑定达人
        $(".talent").on("click","#bindNow",function(){
            var token = localStorage.getItem("token");
            var dataSelect = {
                "app_type": "tools_"+platform_id,
                "access_token": token,
                "link": window.location.href,
                "sec_uid": sec_uid,
                "author_id": author_id,
                "platform_id": platform_id,
            }
            //console.log(dataSelect);
            req(apiHost+"/spider/browser/doBind",JSON.stringify(dataSelect),function(response){
                alert("绑定成功");
                // 隐藏绑定按钮
                window.location.reload();
            })
        })


        // 信息框拖拽
        function dragInfo(yTop,yBot){
            var _move=false;//移动标记
            var _x,_y;//鼠标离控件左上角的相对位置
            $(".operate").click(function(){
                //alert("click");//点击（松开后触发）
            }).mousedown(function(e){
                //console.log(e);
                _move=true;
                _x=e.pageX-parseInt($(".operate").css("left"));
                _y=e.pageY-parseInt($(".operate").css("top"));
                // $(".operate").fadeTo(20, 0.5);//点击后开始拖动并透明显示
            });
            $(document).mousemove(function(e){
                if(_move){
                    var x=e.pageX-_x;//移动时根据鼠标位置计算控件左上角的绝对位置
                    var y=e.pageY-_y;
                    //console.log("y",y);
                    if(x < 0){
                        x = 0;
                    }else if(x > $(document).width() - $('.operate').outerWidth(true)){ // 判断是否超出浏览器宽度
                        x = $(document).width() - $('.operate').outerWidth(true)
                    }
                    if (y < yTop) {
                        y = yTop;
                    } else if (y > $(window).height() - $('.operate').outerHeight(true) + yBot) { // 判断是否超出浏览器高度
                        y = $(window).height() - $('.operate').outerHeight(true) + yBot;
                    }
                    $(".operate").css({top:y,left:x});//控件新位置
                }
            }).mouseup(function(){
                _move=false;

                // 记录每次拖拽后位置存储
                localStorage.setItem("elLeft",$(".operate").css("left"));
                localStorage.setItem("elTop",$(".operate").css("top"));
                // $(".operate").fadeTo("fast", 1);//松开鼠标后停止移动并恢复成不透明
            });
        }

        // 获取信息框拖拽后位置
        var elLeft = localStorage.getItem("elLeft");
        var elTop = localStorage.getItem("elTop");
        $(".operate").css({
            "left": elLeft,
            "top": elTop
        })


        // 登录框拖拽
        function dragInfo1(yTop,yBot){
            var _move1=false;//移动标记
            var _x1,_y1;//鼠标离控件左上角的相对位置
            $(".loginBox").click(function(){
                //alert("click");//点击（松开后触发）
            }).mousedown(function(e){
                //console.log(e);
                _move1=true;
                _x1=e.pageX-parseInt($(".loginBox").css("left"));
                _y1=e.pageY-parseInt($(".loginBox").css("top"));
                // $(".operate").fadeTo(20, 0.5);//点击后开始拖动并透明显示
            });
            $(document).mousemove(function(e){
                if(_move1){
                    var x=e.pageX-_x1;//移动时根据鼠标位置计算控件左上角的绝对位置
                    var y=e.pageY-_y1;
                    // console.log("y",y);
                    if(x < 0){
                        x = 0;
                    }else if(x > $(document).width() - $('.loginBox').outerWidth(true)){ // 判断是否超出浏览器宽度
                        x = $(document).width() - $('.loginBox').outerWidth(true)
                    }
                    if (y < yTop) {
                        y = yTop;
                    } else if (y > $(window).height() - $('.loginBox').outerHeight(true) + yBot) { // 判断是否超出浏览器高度
                        y = $(window).height() - $('.loginBox').outerHeight(true) + yBot;
                    }
                    $(".loginBox").css({top:y,left:x});//控件新位置
                }
            }).mouseup(function(){
                _move1=false;

                // 记录每次拖拽后位置存储
                localStorage.setItem("elLeftLogin",$(".loginBox").css("left"));
                localStorage.setItem("elTopLogin",$(".loginBox").css("top"));
                // $(".operate").fadeTo("fast", 1);//松开鼠标后停止移动并恢复成不透明
            });
        }

        // 获取登录框拖拽后位置
        var elLeftLogin = localStorage.getItem("elLeftLogin");
        var elTopLogin = localStorage.getItem("elTopLogin");
        $(".loginBox").css({
            "left": elLeftLogin,
            "top": elTopLogin
        })

        // 点击收起展开
        // el 元素 elBox 展开收起元素  toggleName localStorage存储名称 drag 调用函数 yTop,yBot,yTop1,yBot1 展开收起时各自对于顶部以及底部的限制范围
        function toggleShow(el,elBox,toggleName,drag,yTop,yBot,yTop1,yBot1,flag){
            el.click(function(){
                if($(this).attr("data-bind") == 1){
                    el.html(`<svg t="1646796481460" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3799" width="48" height="48"><path d="M122.368 165.888h778.24c-9.216 0-16.384-7.168-16.384-16.384v713.728c0-9.216 7.168-16.384 16.384-16.384h-778.24c9.216 0 16.384 7.168 16.384 16.384V150.016c0 8.192-6.656 15.872-16.384 15.872z m-32.768 684.544c0 26.112 20.992 47.104 47.104 47.104h750.08c26.112 0 47.104-20.992 47.104-47.104V162.304c0-26.112-20.992-47.104-47.104-47.104H136.704c-26.112 0-47.104 20.992-47.104 47.104v688.128z" p-id="3800" fill="#2c2c2c"></path><path d="M138.752 158.208V435.2h745.472V158.208H138.752z m609.792 206.336l-102.912-109.056 25.088-26.624 77.824 82.432 77.824-82.432 25.088 26.624-102.912 109.056z" p-id="3801" fill="#2c2c2c"></path></svg>`);
                    elBox.slideUp();
                    localStorage.setItem(toggleName,false);
                    $(this).attr("data-bind",2);
                    if(flag){
                        elBox.next().css({
                            "marginTop":"0",
                            "textAlign": "left"
                        });
                    }
                    drag(yTop,yBot);
                }else{
                    el.html(`<svg t="1646796325695" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3481" width="48" height="48"><path d="M866.461538 787.692308a78.769231 78.769231 0 0 1-78.76923 78.76923H236.307692a78.769231 78.769231 0 0 1-78.76923-78.76923V236.307692a78.769231 78.769231 0 0 1 78.76923-78.76923h551.384616a78.769231 78.769231 0 0 1 78.76923 78.76923v551.384616z m-31.507692-358.439385H189.006769L189.046154 787.692308a47.261538 47.261538 0 0 0 42.417231 47.02523L236.307692 834.953846h551.384616a47.261538 47.261538 0 0 0 47.02523-42.417231L834.953846 787.692308v-358.439385zM787.692308 189.046154H236.307692a47.261538 47.261538 0 0 0-47.02523 42.417231L189.046154 236.307692l-0.039385 161.437539H834.953846V236.307692a47.261538 47.261538 0 0 0-42.417231-47.02523L787.692308 189.046154z m-111.616 53.681231l2.48123 1.96923 80.738462 78.769231a15.753846 15.753846 0 0 1-19.495385 24.576l-2.48123-1.969231-69.474462-67.780923-65.772308 67.465846a15.753846 15.753846 0 0 1-19.810461 2.284308l-2.481231-1.969231a15.753846 15.753846 0 0 1-2.284308-19.810461l1.969231-2.481231 76.8-78.769231a15.753846 15.753846 0 0 1 19.810462-2.284307z" fill="#2c2c2c" p-id="3482"></path></svg>`);
                    elBox.slideDown();
                    localStorage.setItem(toggleName,true);
                    $(this).attr("data-bind",1);
                    elBox.next().css({
                        "marginTop":"20px",
                        "textAlign": "center"
                    });
                    drag(yTop1,yBot1);
                }
            })
            var toggle = localStorage.getItem(toggleName);
            // console.log(toggle);
            if(toggle == "true" || toggle == undefined){
                el.html(`<svg t="1646796325695" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3481" width="48" height="48"><path d="M866.461538 787.692308a78.769231 78.769231 0 0 1-78.76923 78.76923H236.307692a78.769231 78.769231 0 0 1-78.76923-78.76923V236.307692a78.769231 78.769231 0 0 1 78.76923-78.76923h551.384616a78.769231 78.769231 0 0 1 78.76923 78.76923v551.384616z m-31.507692-358.439385H189.006769L189.046154 787.692308a47.261538 47.261538 0 0 0 42.417231 47.02523L236.307692 834.953846h551.384616a47.261538 47.261538 0 0 0 47.02523-42.417231L834.953846 787.692308v-358.439385zM787.692308 189.046154H236.307692a47.261538 47.261538 0 0 0-47.02523 42.417231L189.046154 236.307692l-0.039385 161.437539H834.953846V236.307692a47.261538 47.261538 0 0 0-42.417231-47.02523L787.692308 189.046154z m-111.616 53.681231l2.48123 1.96923 80.738462 78.769231a15.753846 15.753846 0 0 1-19.495385 24.576l-2.48123-1.969231-69.474462-67.780923-65.772308 67.465846a15.753846 15.753846 0 0 1-19.810461 2.284308l-2.481231-1.969231a15.753846 15.753846 0 0 1-2.284308-19.810461l1.969231-2.481231 76.8-78.769231a15.753846 15.753846 0 0 1 19.810462-2.284307z" fill="#2c2c2c" p-id="3482"></path></svg>`);
                elBox.show();
                el.attr("data-bind",1);
                elBox.next().css({
                    "marginTop":"20px",
                    "textAlign": "center"
                });
                drag(yTop1,yBot1);
            }else{
                el.html(`<svg t="1646796481460" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3799" width="48" height="48"><path d="M122.368 165.888h778.24c-9.216 0-16.384-7.168-16.384-16.384v713.728c0-9.216 7.168-16.384 16.384-16.384h-778.24c9.216 0 16.384 7.168 16.384 16.384V150.016c0 8.192-6.656 15.872-16.384 15.872z m-32.768 684.544c0 26.112 20.992 47.104 47.104 47.104h750.08c26.112 0 47.104-20.992 47.104-47.104V162.304c0-26.112-20.992-47.104-47.104-47.104H136.704c-26.112 0-47.104 20.992-47.104 47.104v688.128z" p-id="3800" fill="#2c2c2c"></path><path d="M138.752 158.208V435.2h745.472V158.208H138.752z m609.792 206.336l-102.912-109.056 25.088-26.624 77.824 82.432 77.824-82.432 25.088 26.624-102.912 109.056z" p-id="3801" fill="#2c2c2c"></path></svg>`);
                elBox.hide();
                el.attr("data-bind",2);
                if(flag){
                    elBox.next().css({
                        "marginTop":"0",
                        "textAlign": "left"
                    });
                }
                drag(yTop,yBot);
            }
        }

        // 信息框收起展开
        toggleShow($(".operate-toggle"),$(".operate-box"),"toggle1",dragInfo,100,0,300,329,true);

        // 登录框收起展开
        toggleShow($(".login-toggle"),$(".cylogin-box"),"toggle2",dragInfo1,120,40,200,140);

        // 关闭更新提示
        $(".renew-close").click(function(){
             localStorage.removeItem("token");
             localStorage.removeItem("storagePhone");
             localStorage.removeItem("storagePwd");
             localStorage.removeItem("dep_name");
             localStorage.removeItem("staffName");
             window.location.reload();
        })


        // 分配转让
        $(".talent").on("click",".assign",function(){
            $(".transfer-title").text($(this).text()+ "达人");
            $(".transfer-btn button").text($(this).text());
            $(".confirm-success").attr("data-type",$(this).attr("data-type"));
            $(".transfer").show();
        })

        // 分配转让提交
        $(".transfer-btn button").click(function(){
            if($("#work_name").val() != ""){
                $(".transfer-box").hide();
                $(".transfer-confirm").show();
            }else{
                alert("请填写员工工号");
            }
            $(".confirm-title").text("是否"+$(".transfer-btn button").text()+"给工号:"+$("#work_name").val());
        })
        // 取消提交
        $(".confirm-cancel").click(function(){
            $(".transfer-box").show();
            $(".transfer-confirm").hide();
        })
        $(".confirm-success").click(function(){
            var token = localStorage.getItem("token");
            var type = $(this).attr("data-type");
            var txt = $(".transfer-btn button").text();
            var dataTransfer = {
                "app_type": "tools_"+platform_id,
                "access_token": token,
                "link": window.location.href,
                "sec_uid": sec_uid,
                "author_id": author_id,
                "platform_id": platform_id,
                "work_num": $("#work_name").val(),
                "move_type": type
            }
            req(apiHost+"/spider/browser/moveto",JSON.stringify(dataTransfer),function(response){
                alert(txt + "成功");
                window.location.reload();
            },function(){
                $(".transfer-box").show();
                $(".transfer-confirm").hide();
            })
        })

        // 解绑达人
        $(".talent").on("click","#unbind",function(){
            var token = localStorage.getItem("token");
            var dataTransfer = {
                "app_type": "tools_"+platform_id,
                "access_token": token,
                "link": window.location.href,
                "sec_uid": sec_uid,
                "author_id": author_id,
                "platform_id": platform_id,
                "move_type": $(this).attr("data-type")
            }
            req(apiHost+"/spider/browser/moveto",JSON.stringify(dataTransfer),function(response){
                alert("解绑成功");
                window.location.reload();
            })
        })


        // 点击刷新
        function refresh_om(){
            $("#refresh_om").on("click",throttle(function(){
                var token = localStorage.getItem("token");
                var dataRefresh = {
                    "app_type": "tools_"+platform_id,
                    "access_token": token,
                    "link": window.location.href,
                    "sec_uid": sec_uid,
                    "author_id": author_id,
                    "platform_id": platform_id,
                    "type": 1
                }
                req(apiHost+"/spider/browser/refresh",JSON.stringify(dataRefresh),function(response){
                    alert(response.result.refresh_message);
                    window.location.reload();
                })
            },1500))
        }


        // 绑定业务
        $(".operate-bind").click(function(){
            $(".bindStatus").show();
        })



        // 退出登录
        $(".operate-quit a").click(function(){
            localStorage.removeItem("token");
            localStorage.removeItem("storagePhone");
            localStorage.removeItem("storagePwd");
            localStorage.removeItem("dep_name");
            localStorage.removeItem("staffName");
            window.location.reload();
        })



        // 关闭分配转让弹窗
        $(".transfer-close").click(function(){
            $("#work_name").val("");
            $(".transfer").hide();
        })


        // 关闭弹窗
        $(".close").click(function(){
            // 清空弹窗数据并隐藏
            $(".form-list input").val("");
            $(".form-list:first-child").nextAll().remove();
            $(".mask").hide();
            $(".bindContact").hide();
            //location.reload();

            // 清空分类选择
            $(".cateData>div.active").attr("data-flag","0")
            $(".cateData>div.active").removeClass("active")
            $(".form-list:nth-child(2)").nextAll().remove();
        })

        // 关闭积分情况弹窗
        $(".info-btn button").click(function(){
            $(".integral-table").children().remove();
            $(".infoContact").hide();
            window.location.reload();
        })

        // 关闭绑定记录弹窗
        $(".record-close").click(function(){
            $(".record-content").children().remove();
            $(".record").hide();
            // location.reload();
        })

        // 关闭达人资料更新弹窗
        $(".data-close").click(function(){
            $(".dataTool").hide();
        })

        $(".cate-close").click(function(){
            $(".cateTool").hide();
        })

        // 关闭绑定业务
        $(".bindStatus-close").click(function(){
            $(".bindStatus").hide();
        })


        // 达人编号点击复制文本内容
        $(".info-name").on("click","#copy",function(){
            console.log(this.innerText)
            var Url2= this.innerText;
            var oInput = document.createElement('input');
            oInput.value = Url2;
            document.body.appendChild(oInput);
            oInput.select(); // 选择对象
            document.execCommand("Copy"); // 执行浏览器复制命令
            oInput.className = 'oInput';
            oInput.remove();
            $(".msg").text("复制成功!");
            $(".msg").fadeIn();
            msgHide();
        })

    })
},1000)

})();