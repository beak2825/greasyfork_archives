// ==UserScript==
// @name         快速查包
// @namespace    fsh
// @version      1.5
// @description  快速跳转至指定包或指定分支
// @author       05128
// @match        *://ci.meitu.city/*
// @match        *://ios.meitu-int.com/ipa/*
// @match        *://jira.meitu.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443616/%E5%BF%AB%E9%80%9F%E6%9F%A5%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/443616/%E5%BF%AB%E9%80%9F%E6%9F%A5%E5%8C%85.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 设置刷新时间
    const refreshTime = 1000;
    // 添加CSS
    $('head').append($(`
  <style>
  .search{
    position: relative;
    width: 220px;
  }
  .search input{
    height: 42px;
    width: 220px;
    border-radius: 42px;
    border: 2px solid #324B4E;
    background: #F9F0DA;
    transition: .3s linear;
    float: left;
    text-indent: 10px;
  }

  .search input:focus::placeholder{
    opacity: 0;
  }
  .search button{
    height: 42px;
    border-radius: 42px;
    border-right: 1px solid #324B4E;
    border-left: 0px;
    background: #F9F0DA;
    right: 0;
    position: absolute;
  }

  .btn_find_build{
    width: 42px;
    text-align: center;
  }

  .search_span{
    /*border: 1px dashed #000;*/
    cursor: pointer;
    height: 16px;
    margin: 0px 10px;
    padding: 3px;
    border-radius: 25px;
  }

  img{
    height:16px;
  }

  </style>`));
    // 当是ci域名时，才触发后续的操作，如果不是则不触发
    if (location.href.indexOf('ci.meitu.city') > 0) {
        clearInterval(refreshTime);
        setInterval(function () {
            let input_find_build = document.getElementById('input_find_build');
            // 如果不存在则添加
            if (!input_find_build) {
                addFindButtonCicity();
                $('#btn_find_build').unbind("click").click(function () {
                    let input_build_content = document.getElementById("input_find_build").value.trim()
                    if(input_build_content===""){
                        return false;
                    }
                    let targetUrl = ""
                    // 如果输入的是纯数字，视为build id
                    if(/^\d+$/.test(input_build_content)){
                        let baseUrl = 'https://ci.meitu.city/build/Meitu/number/'
                        targetUrl = baseUrl + input_build_content
                    }else{// 否则按输入的是分支处理
                        let baseUrl = 'https://ci.meitu.city/build/Meitu/branch/'
                        input_build_content = input_build_content.replaceAll("/","%2F")
                        targetUrl = baseUrl + input_build_content
                    }
                    // 跳转到指定页面
                    window.location.href=targetUrl
                });
            }
        }, refreshTime);
    }

    // 进入CI页面时添加输入框和跳转按钮
    function addFindButtonCicity() {
        let span = $('<span class="search"></span>')
        let input_find_build = $('<input type="text" class="text" id="input_find_build" placeholder="  输入Build id或分支名">');
        let btn_find_build = $('<button type="submit" class="btn_find_build" id="btn_find_build">🔍</button>');
        //let btn_find_build = $('<input type="button" class="aui-button btn_find_build" value="✔" id="btn_find_build">');
        span.append(input_find_build);
        span.append(btn_find_build);
        $(".project-label__name").after(span);
    }

    // 当是granary域名时，才触发后续的操作，如果不是则不触发
    if (location.href.indexOf('ios.meitu-int.com') > 0) {
        clearInterval(refreshTime);
        setInterval(function () {
            let input_find_build = document.getElementById('input_find_build');
            // 如果不存在则添加
            if (!input_find_build) {
                addFindButtonGranary();
            }
            $('#btn_find_build').unbind("click").click(function () {
                let input_build_content = document.getElementById("input_find_build").value.trim()
                if(input_build_content===""){
                        return false;
                }
                let targetUrl = ""
                // 如果输入的是纯数字，视为build id
                if(/^\d+$/.test(input_build_content)){
                    let baseUrl = 'http://ios.meitu-int.com/ipa/mtxx/build/'
                    targetUrl = baseUrl + input_build_content
                }else{// 否则按分支处理
                    let baseUrl = 'http://ios.meitu-int.com/ipa/mtxx/'
                    input_build_content = input_build_content.replaceAll("/","%2F")
                    targetUrl = baseUrl + input_build_content
                }
                // 跳转到指定页面
                window.location.href=targetUrl
            });
        }, refreshTime);
    }

    // 进入granary页面时添加输入框和跳转按钮
    function addFindButtonGranary() {
        let span = $('<span class="search"></span>')
        let input_find_build = $('<input type="text" class="text" id="input_find_build" placeholder=" 输入Build id或分支名">');
        let btn_find_build = $('<button type="submit" class="btn_find_build" id="btn_find_build">🔍</button>');
        //let btn_find_build = $('<input type="button" class="aui-button btn_find_build" value="✔" id="btn_find_build">');

        span.append(input_find_build);
        span.append(btn_find_build);
        //$("#home-tab").after(span);
        $("#myTab").append(span);

    }

    // 当是jira域名时，才触发后续的操作，如果不是则不触发
    if (location.href.indexOf('jira.meitu.com') > 0) {
        clearInterval(refreshTime);
        setInterval(function () {
            let search_span = document.getElementById('search_span_create');
            // 存储bug平台
            // 如果不存在则添加
            if (!search_span) {
                addButtonJira();
                GM_setValue('platform',document.getElementById('customfield_10301-val').textContent.trim())
            }
            // 跳转到创建分支
            $('#search_span_create').unbind("click").click(function () {
                let create_build_content = document.getElementById("customfield_10303-val").textContent.trim()
                // 写一个正则表达式
                let reg = /#?[0-9]{5}/
                let build_id_array = create_build_content.match(reg)
                let build_id = ''
                if (build_id_array == null || build_id_array.length==0 ){
                    console.log("未识别到build号")
                }else{
                    build_id = build_id_array[0]
                    // TODO: 待修改reg正则匹配，直接识别出数字部分，去掉下方的再次识别操作
                    let reg_num = /[0-9]{5}/
                    build_id = build_id.match(reg_num)[0]

                }
                // 根据bug平台，使用不同的baseurl
                let baseUrl = '';
                if(GM_getValue('platform')==='iOS'){
                    baseUrl = 'http://ios.meitu-int.com/ipa/mtxx/build/'
                }else if(GM_getValue('platform')==='Android'){
                    baseUrl = 'https://ci.meitu.city/build/Meitu/number/'
                }
                let targetUrl = baseUrl + build_id
                console.log(targetUrl)
                // 跳转到指定页面
                window.open(targetUrl)
            });
            // 跳转到解决分支
            $('#search_span_solved').unbind("click").click(function () {
                let create_build_content = document.getElementById("customfield_10304-val").textContent.trim()
                let reg = /#?[0-9]{5}/
                let build_id_array = create_build_content.match(reg)
                let build_id = ''
                if (build_id_array == null || build_id_array.length==0 ){
                    console.log("未识别到build号")
                }else{
                    build_id = build_id_array[0]
                    // TODO: 待修改reg正则匹配，直接识别出数字部分，去掉下方的再次识别操作
                    let reg_num = /[0-9]{5}/
                    build_id = build_id.match(reg_num)[0]
                    console.log(build_id)
                }
                // 根据bug平台，使用不同的baseurl
                let baseUrl = '';
                if(GM_getValue('platform')==='iOS'){
                    baseUrl = 'http://ios.meitu-int.com/ipa/mtxx/build/'
                }else if(GM_getValue('platform')==='Android'){
                    baseUrl = 'https://ci.meitu.city/build/Meitu/number/'
                }
                let targetUrl = baseUrl + build_id
                // 跳转到指定页面
                window.open(targetUrl)
            });
        }, refreshTime);
    }

    //在jira页面添加跳转按钮
    function addButtonJira(){
        // 创建分支按钮添加
        let span_create = $('<span class="search_span" id="search_span_create" style=""></span>')
        // 添加图片
        let search_image = "data:image/png;base64,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"
        let img = document.createElement('img');
        img.src = search_image;
        span_create.append(img);
        $("#customfield_10303-val").after(span_create);
        // 解决分支按钮添加
        let span_solved = $('<span class="search_span" id="search_span_solved"></span>')
        let img2 = document.createElement('img');
        img2.src = search_image;
        span_solved.append(img2);
        $("#customfield_10304-val").after(span_solved);
    }

    // Your code here...
})();