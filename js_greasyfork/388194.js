// ==UserScript==
// @name         [kesai]开源中国动弹预览
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  开源中国动弹弹出浮动窗口预览
// @author       kesai
// @match        https://www.oschina.net/*
// @match        https://www.oschina.net/tweets*
// @match        https://my.oschina.net/*
// @grant        none
// @require      https://cdn.bootcss.com/layer/2.3/layer.js
// @downloadURL https://update.greasyfork.org/scripts/388194/%5Bkesai%5D%E5%BC%80%E6%BA%90%E4%B8%AD%E5%9B%BD%E5%8A%A8%E5%BC%B9%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/388194/%5Bkesai%5D%E5%BC%80%E6%BA%90%E4%B8%AD%E5%9B%BD%E5%8A%A8%E5%BC%B9%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // Your code here...
    if (/tweet\/\d+(#comments)?$/.test(window.location.href)) {
        $('.small-header-box').remove();
        $(".five").css("display", "none")
        $(".tweet-detail-wrap").removeClass("computer")
        var parentElement = $("#footer").parent();
        $("#footer").remove();
        $("#copyright").remove();
        document.addEventListener("keydown", function (e) {
            if (e.keyCode === 27) {
                var params = { method: "closeLayer", params: null }
                window.parent.postMessage(params, '*');
            }
        }, false);
        return;
    }

    function addCSS(url) {
        var link = window.document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = url;
        document.getElementsByTagName("HEAD")[0].appendChild(link);
    }

    function addClickEvents() {
        $("a[class='commened'],[class='reply'],[class='view'],[class='wrapper multing-wrapper']").unbind();
        $("a[class='commened'],[class='reply'],[class='view'],[class='wrapper multing-wrapper']").click(function (e) {
            var url = e.target.href;
            popWin(url);
            return false;
        });

        $("div[class='wrapper multing-wrapper']").unbind();
        $("div[class='wrapper multing-wrapper']").click(function (e) {
            var url = e.target.href;
            popWin(url);
            return false;
        });

        $("div[class='multimgs'").unbind();

        $(".multimgs").find("img").unbind();
        $(".multimgs").find("img").click(function (e) {
            var url = e.target.parentElement.href;
            popWin(url);
            return false;
        });
    }

    addCSS('https://cdn.bootcss.com/layer/2.3/skin/layer.css');
    addClickEvents();

    document.addEventListener("keydown", function (e) {
        if (e.keyCode === 27) {
            closeLayer();
        }
    }, false);

    window.addEventListener('message', function (e) {
        eval(e.data.method + "()");
    });

    function closeLayer() {
        layer.closeAll();
    }

    $("body").bind("DOMNodeInserted", changes);



    function changes() {
        addClickEvents();
    }
    $.ajax({
        beforeSend: function () {
            console.log('请求前');
        },
        complete: function () {
            console.log('请求完成');
        }
    });

    function popWin(url) {
        if (url.lastIndexOf("#comments") > 0) url = url.split("#comments")[0];

        //iframe窗
        var width = window.screen.width * 0.8 + "px";
        var height = window.screen.height * 0.8 + "px";
        layer.open({
            type: 2,
            closeBtn: 1,
            title: false,
            shade: [0.9, '#000000'],
            shadeClose: true,
            offset: 'auto',
            maxmin: false,
            //开启最大化最小化按钮
            area: [width, height],
            content: url,
            success: function (layero, index) { }
        });
    }


})();