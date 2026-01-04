// ==UserScript==
// @name         油猴酷@百度,谷歌搜索记录在线保存收藏
// @namespace    www.keywords.cool
// @homepage     https://www.keywords.cool
// @version      1.2025.12.14
// @description  可以自动在线保存百度，谷歌搜索过的关键词，可以浏览，收藏，搜索, 删除关键字。需要配合chrome扩展使用才能体验完整的功能。本脚本对收集的用户信息，只有用户自己可见。采取完全保密的原则，完全尊重用户隐私。请大家放心使用。
// @author       colin
// @match        *://www.baidu.com/*
// @match        *://www.google.com/search?*
// @match        *://www.google.com.hk/search?*
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/405672/%E6%B2%B9%E7%8C%B4%E9%85%B7%40%E7%99%BE%E5%BA%A6%2C%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E8%AE%B0%E5%BD%95%E5%9C%A8%E7%BA%BF%E4%BF%9D%E5%AD%98%E6%94%B6%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/405672/%E6%B2%B9%E7%8C%B4%E9%85%B7%40%E7%99%BE%E5%BA%A6%2C%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E8%AE%B0%E5%BD%95%E5%9C%A8%E7%BA%BF%E4%BF%9D%E5%AD%98%E6%94%B6%E8%97%8F.meta.js
// ==/UserScript==

var jq1124 = jQuery.noConflict(true);

// !!!!!!!!!!! 重要重要重要，注意：这里填写您的api Token注意不要换行，填写完毕后点“文件-》保存”否则不会生效。api Token从官网注册后，登录进个人中心获取，官网是 https://www.keywords.cool
var token = "你的Token填这里";

// 特别重要！！！该脚本可以单独使用，但功能有限制，目前己知百度在某些情况下不能自动向服务器推送数据。要想获得更好体验请同时安装chrome扩展（推荐）。如果你非要单独使用请打开line:107、line:108两行注释。回车或点击“百度一下”会推
// 送数据，但有些情况下不会主动推送数据，比如你选择了百度下拉推荐，或是直接在搜索框搜索没有回车，没有点按钮。所以如果你发现有些词没有保存，请点一下“百度一下”按钮。安装chrome扩展完全不用担心这个问题。因为她是监听百度xhr请求的。

// 这里是接口主地址不能修改
var restUrl = "https://www.keywords.cool/api/v1/";

GM_addStyle(`
    #kwc-panel-g ul li p {margin:0;word-break:break-all;}
    .D6j0vc, .big .D6j0vc {
      max-width: 1539px;
      display: flex;
      width: 1539px;
    }
    #simSearchFrame {
       margin-left:60px;
    }
    .wrapper_new .s_form.s_form_fresh {
       width: 100% !important;
    }
`);
(function($) {
    'use strict';
    // Your code here...
    // 发送 http 请求的基类
    class Base{
        constructor(){
            this.baseRequestUrl = restUrl;
        }
        request(params){
            let url = this.baseRequestUrl + params.url;
            if(!params.type){
                params.type = 'GET';
            }
            GM_xmlhttpRequest({
                method: params.type,
                url: url,
                responseType: 'json',
                data: params.data,
                headers:  {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "token": token
                },
                onload: res => {
                    params.sCallback && params.sCallback(res.response);
                }
            });
        }
    }
    // post get 关键词的类
    class Keywords extends Base {
        constructor(){
            super();
        }
        postWordsToServer(data, callback){
            this.request({
                url:'keywords/save',
                type: 'post',
                data: 'keywords='+data.keywords+'&type='+data.type,
                sCallback: res => {
                    callback && callback(res)
                }
            });
        }
        getUserKeywords(callback){
            this.request({
                url:'keywords/get',
                sCallback: res => {
                    callback && callback(res)
                }
            });
        }
        addToFavorite(id,callback){
            this.request({
                url:'keywords/favorite',
                type: 'post',
                data: 'id='+id,
                sCallback: res => {
                    callback && callback(res)
                }
            });
        }
    }
    // 脚本的主要部分开始
    let domain = document.domain;
    if(domain == 'www.baidu.com'){
        $(".s_form").append(`<div style='display:inline-block;margin: 20px'><span style='color: #1ABC9C;'>油猴酷：</span><span style='color:red' id='kwcc-yh'></span><div>`);

        // 先获取关键字，调用接口发送一次http请求,这个是为了在当用户从地址栏跳到百度搜索结果的时候自动保存一次关键字，
        // 另外副作用是当用户刷新页面的时候也会自动保存
        let keywords = $("#kw").val();
        console.log(keywords);
        if(keywords != "" && !(/^\s$/.test(keywords)) && keywords != undefined && keywords != 'undefined'){
            saveKeywords(keywords, 1);
        }
        setTimeout(getKeywords, 2000);
        $(".bg.s_btn_wr").on('click',function(){
            // 没有装chrome扩展的可以打开下面两个注释
            //             let keywords = $("#kw").val();
            //             saveKeywords(keywords, 1);
            setTimeout(getKeywords, 2000);
        });
    }

    if(domain == 'www.google.com' || domain == 'www.google.com.hk'){
        $("#searchform").append(`<div style='display: block;margin: 20px;margin-left: 1085px;margin-top: 29px;z-index: 9999999;position: fixed;'><span style='color: #1ABC9C;'>油猴酷：</span><span style='color:red' id='kwcc-yh'></span><div>`);
        // let keywords = $(".gLFyf.gsfi").val();
        // let keywords = $("[aria-label=Search]").val();
        let keywords = '';
        if(domain == 'www.google.com.hk') {
            keywords = $("[aria-label=搜索]").val();
        } else if (domain == 'www.google.com') {
            keywords = $("[aria-label=搜索]").val();
        }
        console.log(keywords);
        if(keywords != "" && !(/^\s$/.test(keywords)) && keywords != undefined && keywords != 'undefined' && !(/undefined/.test(keywords))){
            saveKeywords(keywords, 2);
        }
        setTimeout(getKeywords, 1800);
    }

    function saveKeywords(keywords,type){
        let words = new Keywords();
        words.postWordsToServer({keywords,type}, res=>{
            console.log(res);
            if(res && res.err_code > 10000){
                $("#kwcc-yh").css('color', 'red');
                $("#kwcc-yh").html(res.err_msg);
            } else if(res && res.err_code == 10000) {
                $("#kwcc-yh").css('color', 'blue');
                $("#kwcc-yh").html(res.msg);
            } else {
                $("#kwcc-yh").html('服务器没有返回任何信息');
            }
        });
    }
    function getKeywords(){
        let words = new Keywords();
        words.getUserKeywords(res=>{
            console.log(res);
            if(domain=='www.baidu.com'){
                $("#content_right").empty();
                $('#content_right').prepend(`<div id='kwc-panel' style='width:455px;margin-bottom:30px;'><div id='baidu'><h4 style='display:flex;justify-content:space-between;'><span>百度</span><span style='cursor:pointer;' class='closePanel'>X</span></h4></div><div id='google'><h4>谷歌</h4></div><div id='favorite'><h4>收藏</h4></div></div>`);
            } else{
                if($("#rhs").length > 0) {
                    //元素存在时执行的代码
                    $("#rhs").empty();
                    $('#rhs').append(`<div id='kwc-panel-g' style='width:455px;margin-bottom:30px;'><div id='google'><h4 style='display:flex;justify-content:space-between;'><span>谷歌</span><span style='cursor:pointer;' class='closePanel'>X</span></h4></div><div id='baidu'><h4>百度</h4></div><div id='favorite'><h4>收藏</h4></div></div>`);
                } else {
                    $("#rcnt").append(`<div id='rhs'></div>`);
                    $('#rcnt #rhs').append(`<div id='kwc-panel-g' style='width:455px;margin-bottom:30px;'><div id='google'><h4 style='display:flex;justify-content:space-between;'><span>谷歌</span><span style='cursor:pointer;' class='closePanel'>X</span></h4></div><div id='baidu'><h4>百度</h4></div><div id='favorite'><h4>收藏</h4></div></div>`);
                }
            }
            if(res && res.hasOwnProperty('err_code')){

            } else if(res) {
                let baiduArr = res.baidu;
                let googleArr = res.google;
                let favoriteArr = res.favorite;
                let baiduDom = createDomFromArr(baiduArr,'baidu');
                let googleDom = createDomFromArr(googleArr,'google');
                let favoriteDom = createDomFromArr(favoriteArr,'',false);
                $("#baidu").append(baiduDom);
                $("#google").append(googleDom);
                $("#favorite").append(favoriteDom);

            }
        });
    }

    function createDomFromArr(array, typeName, btn='true'){
        let str = '<ul>';
        array.forEach(function(item, index){
            if(btn){
                if(typeName == 'baidu'){
                    if(item.favo == 2){
                        str += `<li style='display:flex;justify-content:space-between;margin:6px;border-bottom:1px solid #e5e5e5;'><p><a href='https://www.baidu.com/s?wd=${item.words}' target='_blank'>${item.words}</a></p><button class='favo8' data-id='${item.id}'>收藏</button></li>`;
                    }else{
                        str += `<li style='display:flex;justify-content:space-between;margin:6px;border-bottom:1px solid #e5e5e5;'><p><a href='https://www.baidu.com/s?wd=${item.words}' target='_blank'>${item.words}</a></p></li>`;
                    }
                }else{
                    if(item.favo == 2){
                        str += `<li style='display:flex;justify-content:space-between;margin:6px;border-bottom:1px solid #e5e5e5;'><p><a href='https://www.google.com/search?q=${item.words}' target='_blank'>${item.words}</a></p><button class='favo8' data-id='${item.id}'>收藏</button></li>`;
                    }else{
                        str += `<li style='display:flex;justify-content:space-between;margin:6px;border-bottom:1px solid #e5e5e5;'><p><a href='https://www.google.com/search?q=${item.words}' target='_blank'>${item.words}</a></p></li>`;
                    }
                }
            } else{
                if(item.type == 'baidu'){
                    str += `<li style='display:flex;justify-content:space-between;margin:6px;border-bottom:1px solid #e5e5e5;'><p><a href='https://www.baidu.com/s?wd=${item.words}' target='_blank'>${item.words}</a></p></li>`;
                } else{
                    str += `<li style='display:flex;justify-content:space-between;margin:6px;border-bottom:1px solid #e5e5e5;'><p><a href='https://www.google.com/search?q=${item.words}' target='_blank'>${item.words}</a></p></li>`;
                }
            }
        });
        str += '</ul>'
        return str;
    }
    // 处理收藏
    function toFavorite(fid){
        let words = new Keywords();
        words.addToFavorite(fid, res=>{
            console.log(res);
            alert(res.err_msg);
        });
    }
    function closePanel(){
        if(domain == 'www.baidu.com'){
            $("#kwc-panel").hide();
        }else {
            $("#kwc-panel-g").hide();
        }
    }

    $(window).on('load', function() {
        // 收藏事件
        $('body').on('click','.favo8',function(){
            const favo_id = $(this).data("id");
            toFavorite(favo_id);
        });
        // 点击X关闭右侧栏
        $('body').on('click','.closePanel',function(){
            closePanel()
        });
    });
    /*     unsafeWindow.toFavorite = function(fid){
        let words = new Keywords();
        words.addToFavorite(fid, res=>{
            console.log(res);
            alert(res.err_msg);
        });
    } */
    /*     unsafeWindow.closePanel = function(){
        if(domain == 'www.baidu.com'){
            $("#kwc-panel").hide();
        }else {
            $("#kwc-panel-g").hide();
        }

    } */


})(jq1124);

