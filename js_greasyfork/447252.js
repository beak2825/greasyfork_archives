// ==UserScript==
// @name        凯通 swagger-ui url搜索
// @namespace   Violentmonkey Scripts
// @include     http://*/swagger-ui.html*
// @grant       none
// @version     1.0
// @author      Taishang
// @license     null
// @description 2022/6/28 17:37:06
// @require       https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/447252/%E5%87%AF%E9%80%9A%20swagger-ui%20url%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/447252/%E5%87%AF%E9%80%9A%20swagger-ui%20url%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var apiDocs = {};

    // 添加节点
    var addNode = function () {
        var button = document.createElement("div");
        button.innerHTML = '<div id="taishang" style="padding-left:15%;"><span>接口路径：</span><input type="text" id="taishangInput" style="width:40%; height:30px;"><button id="taishangSearch">搜索</button></div>'
        $('.topbar').after(button)

        var searchButton = document.getElementById("taishangSearch");
        searchButton.addEventListener('click', function () {
            // 搜索输入内容
            search(document.getElementById("taishangInput").value)
        });

        // 设置css
        $("#taishang").css({"background": "#89bf04"})


    }

    // 获取 ApiDocs
    var getApiDocs = function () {
        var apiDocsText = document.getElementsByClassName('url')[0].innerHTML;
        var start = apiDocsText.search("http");
        var stop = apiDocsText.search("api-docs") + 8;
        var apiDocsUrl = apiDocsText.substring(start, stop);

        $.ajax({
            url: apiDocsUrl,
            context: document.body,
            success: function (data) {
                console.log("获取 ApiDocs 成功！")
                apiDocs = data;

            },
            error: function () {
                console.error("获取 ApiDocs 失败！")
            }
        });
    }

    // 搜索
    var search = function (path) {
        var domId = '';
        for (var api in apiDocs.paths) {
            if (api == path) {
                domId = getDomId(api);
                break;
            }
        }

        if(domId === 'operations-tag-'){
            for (api in apiDocs.paths) {
                if (api.search(path)) {
                    domId = getDomId(api);
                    break;
                }
            }
        }

        domId = domId.replace(" ", "_");

        console.log("节点ID：" + domId)

        // 滚动到指定位置
        scrollIntoView(domId);

        // 展开controller
        document.getElementById(domId).click();
    }

    // 获取Dom节点ID
    var getDomId = function (api) {
        var domId = 'operations-tag-';
        var post = apiDocs.paths[api].post;
        var get = apiDocs.paths[api].get;

        if (post) {
            console.log(post.tags[0])
            domId = domId + post.tags[0];
        } else {
            console.log(get.tags[0])
            domId = domId + get.tags[0];
        }

        return domId;
    }

    // 滚动到指定位置
    var scrollIntoView = function (domId) {
        var element = document.getElementById(domId);
        if(element){
            element.scrollIntoView();
            element.scrollIntoView(false);
            element.scrollIntoView({block: "center"});
            element.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
        }else {
            alert("无法找到对应接口！")
        }
    }

    window.setTimeout(function () {
        // 添加节点
        addNode();

        // 获取 ApiDocs
        getApiDocs();

    }, 2000)

})();

