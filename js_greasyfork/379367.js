// ==UserScript==
// @name         AirlineRuleExport
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  机票航司客规静态页面生成
// @author       Ivanzhang
// @require https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @match        http://conf.ctripcorp.com/pages/viewpage.action?pageId=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/379367/AirlineRuleExport.user.js
// @updateURL https://update.greasyfork.org/scripts/379367/AirlineRuleExport.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document.body).append("<div id='toolbarRule'><div class='toolbarButton' id='toolbarPreview'>预览</div><div class='toolbarButton' id='toolbarSave'>保存</div><div class='toolbarButton' id='toolbarPublish'>发布</div></div>");

    $('#toolbarRule').css({"position":"absolute", "bottom": "100px", "right": "50px", "border-radius": "10px", "background-color": "#fff", "box-shadow": "0 3px 6px rgba(0,0,0,.2)", "overflow": "hidden"});

    $('.toolbarButton').css({"display": "flex", "justify-content": "center", "align-items": "center", "width": "50px", "height": "50px", "cursor": "pointer"});

    var title = document.getElementById('title-text').children[0].innerHTML;
    var content = document.getElementById('main-content').innerHTML;

    var compile = function (functionObject) {
        return functionObject.toString().match(/\/\*([\s\S]*?)\*\//)[1];
    };

    var template = compile(function () {/*
<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta charset="utf-8">
    <meta name="viewport"
        content="initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=N, minimal-ui">
    <meta content="telephone=no" name="format-detection">
    <title></title>
    <style type="text/css">
        body {
            height: 100%;
            padding: 0;
            margin: 0;
            background-color: #FFFFFF;
            -webkit-backface-visibility: hidden;
            font-family: -apple-system, Helvetica, Arial, Tahoma, "PingFang SC", "Hiragino Sans GB", "Lantinghei SC", "Microsoft YaHei", sans-serif;
        }

        p,
        li {
            margin: 15px 0;
        }

        ol {}

        a {
            color: #333;
            position: relative;
            z-index: 2;
        }

        em {
            font-style: normal;
            font-weight: normal;
        }

        .mask {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
        }

        .container {
            position: relative;
            font-size: 14px;
            line-height: 1.5;
            padding: 15px;
            color: #333;
            margin: 0 auto;
            max-width: 750px;
        }

        .header {
            font-size: 20px;
            text-align: center;
        }

        h4 {
            padding-top: 15px;
            font-size: 16px;
            text-align: center;
        }
    </style>
</head>

<body>
    <article class="mask"></article>
    <div class="container">


    </div>
</body>

</html>
 */
    });

    var templace_replace_title = template.replace(/\<title>[\s\S]*?\<\/title>/, '<title>' + title + '</title>');
    var templace_replace_content = templace_replace_title.replace(/\<div class="container">[\s\S]*?\<\/div>/, '<div class="container">' + content + '</div>');
    console.log(templace_replace_content)


    function fake_click(obj) {
        var ev = document.createEvent("MouseEvents");
        ev.initMouseEvent(
            "click", true, false, window, 0, 0, 0, 0, 0
            , false, false, false, false, 0, null
        );
        obj.dispatchEvent(ev);
    }

    function export_raw(name, data) {
        var urlObject = window.URL || window.webkitURL || window;

        var export_blob = new Blob([data]);

        var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
        save_link.href = urlObject.createObjectURL(export_blob);
        save_link.download = name;
        fake_click(save_link);
    }


    function preview() {
        var open = window.open("about:blank", "_blank");
        open.document.write(templace_replace_content);
    }

    function save() {
        export_raw('rule.html', templace_replace_content);
    }

    $('#toolbarPreview').click(function(){
        preview()
    })

    $('#toolbarSave').click(function(){
        save()
    })

    $('#toolbarPublish').click(function(){
         window.open("http://eros.ares.ctripcorp.com/#/files/pages.ctrip.com/flight/h5/hybrid/booking/content", "_blank");
    })

})();