// ==UserScript==
// @name         网页翻译-彩云小译（修改版）
// @description  网页翻译,全文翻译,双语对照
// @namespace    Violentmonkey Scripts
// @match        *://*/*
// @version      2.3.7
// @author       guzz,myaijarvis
// @description  2022/2/19 下午2:46:37
// @include      https://*
// @include      http://*
// @exclude      *://*.google*/*
// @exclude      *://*.cn/*
// @exclude      *://*.baidu.com/*
// @exclude      *://*.qq.com/*
// @exclude      *://*.bilibili.com/*
// @exclude      *://*.jianshu.com/*
// @exclude      *://*sspai.com/*
// @exclude      *://*zhihu/*
// @exclude      *://*acfun/*
// @exclude      *://*csdn/*
// @exclude      *://*china/*
// @exclude      https://www.kaggle.com/code/*/edit
// @exclude      https://editor.csdn.net/*
// @require      http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.8.0.js
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @noframes
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443744/%E7%BD%91%E9%A1%B5%E7%BF%BB%E8%AF%91-%E5%BD%A9%E4%BA%91%E5%B0%8F%E8%AF%91%EF%BC%88%E4%BF%AE%E6%94%B9%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/443744/%E7%BD%91%E9%A1%B5%E7%BF%BB%E8%AF%91-%E5%BD%A9%E4%BA%91%E5%B0%8F%E8%AF%91%EF%BC%88%E4%BF%AE%E6%94%B9%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

var removeDom;

(function() {
    'use strict';

    addStyle();
    addBtn();
    let flag=false;
    $('#fanyi').toggle(()=>{
        clearInterval(removeDom); // 取消删除
        translation();
        $('#fanyi').text('正在翻译');
        setTimeout(() => {
            $('#fanyi').text('取消翻译');
            $('#fanyi .cyxy-trs-target').remove();
        }, 3000);
    },()=>{
        $('.cyxy-trs-target').remove();
        $('#fanyi').text('翻译');
        // 删除翻译的文字
        removeDom = setInterval(()=>{
            $('.cyxy-trs-target').remove();
            console.log('delete');
        }, 100);
    });

})();

$.fn.toggle = function( fn, fn2 ) {
    var args = arguments,guid = fn.guid || $.guid++,i=0,
        toggle = function( event ) {
            var lastToggle = ( $._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
            $._data( this, "lastToggle" + fn.guid, lastToggle + 1 );
            event.preventDefault();
            return args[ lastToggle ].apply( this, arguments ) || false;
        };
    toggle.guid = guid;
    while ( i < args.length ) {
        args[ i++ ].guid = guid;
    }
    return this.click( toggle );
};


function addStyle(){
    //debugger;
    let layui_css = `.layui-btn{display: inline-block; vertical-align: middle; height: 38px; line-height: 38px; border: 1px solid transparent; padding: 0 18px; background-color: #009688; color: #fff; white-space: nowrap; text-align: center; font-size: 14px; border-radius: 2px; cursor: pointer; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none;}
                   .layui-btn-sm{height: 30px; line-height: 30px; padding: 0 10px; font-size: 12px;}
                   .layui-btn-normal{background-color: #1E9FFF;}
                   .cyxy-trs-target{border-bottom:1px solid rgb(0,191,255,0.8)}`;
    GM_addStyle(layui_css);
}

//创建按钮
function addBtn() {
    //debugger;
    let element = $(
        `<button style="top:350px;right:0px; position: fixed;z-index:1000;cursor:pointer;width:auto;" class="layui-btn layui-btn-sm layui-btn-normal" id="fanyi">翻译</button>`
  );
    $("body").append(element);
}


document.addEventListener('keydown', keydownEvent);

function keydownEvent(e) {
    if (e.key == ';' && !(e.metaKey || e.ctrlKey) && e.altKey) {
        if (['input', 'text', 'textarea'].includes(e.target.tagName.toLowerCase())) {
            return
        }
        translation();

    }
}

GM_registerMenuCommand("翻译当前网页", translation);


function translation() {


    (function (open, send) {
        var xhrOpenRequestUrl;

        XMLHttpRequest.prototype.open = function (method, url, async, user, password) {

            xhrOpenRequestUrl = new URL(url, document.location.href).href;
            open.apply(this, arguments);
        };

        XMLHttpRequest.prototype.send = function (data) {
            if (xhrOpenRequestUrl.includes('api.interpreter.caiyunai.com/v1/page/auth')) {
                let tempArg = JSON.parse(arguments[0]);
                tempArg.browser_id = new Date().getTime()
                arguments[0] = JSON.stringify(tempArg)
            }
            send.apply(this, arguments);
        }
    })(XMLHttpRequest.prototype.open, XMLHttpRequest.prototype.send)


    var cyfy = document.createElement("script");
    cyfy.type = "text/javascript";
    cyfy.charset = "UTF-8";
    cyfy.src = ("https:" == document.location.protocol ? "https://" : "http://") + "caiyunapp.com/dest/trs.js";
    document.body.appendChild(cyfy);

    // 修改部分
    let flag=true;
    // 判断是否插入成功
    setTimeout(() => {
        if ($('.cyxy-trs-target').length!=0){
            flag=false;
        }
        if(flag){
            console.log('脚本地址：https://greasyfork.org/zh-CN/scripts/443744-%E7%BD%91%E9%A1%B5%E7%BF%BB%E8%AF%91-%E5%BD%A9%E4%BA%91%E5%B0%8F%E8%AF%91-%E4%BF%AE%E6%94%B9%E7%89%88');
            alert('网页存在CSP限制，需安装此拓展 Disable Content-Security-Policy，详情请看脚本介绍，脚本地址已输出在控制台');
        }
    }, 5000)


    var c = '.cyxy-personal{display:none}.cyxy-favorite{display:none}.cyxy-function{display:none} #asdazcasdiovb{position:fixed;bottom:0;right:0;width:auto;font-size:0.8em}';

    var ele1 = document.createElement("style");
    ele1.innerHTML = c;
    document.getElementsByTagName('head')[0].appendChild(ele1)
    var p = document.createElement("div");
    p.innerHTML = '<p>脚本已执行,3秒后自动关闭</p>'
    p.id = 'asdazcasdiovb';
    document.body.appendChild(p);

    setTimeout(() => {
        document.querySelector('#asdazcasdiovb').hidden = true;
    }, 3000)

}