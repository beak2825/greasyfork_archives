// ==UserScript==
// @name         Booru 大图预览插件
// @namespace    https://github.com/mouyase/yande.re_large_picture_script
// @version      0.2.1
// @description  Booru大图预览插件，按下键盘 ↑ ↓ 开启大图模式（上为从头开始，下为从尾开始）， ← → 翻页，可单手操作
// @author       某亚瑟
// @match        https://yande.re/*
// @match        http://konachan.com/*
// @match        http://konachan.net/*
// @match        https://konachan.com/*
// @match        https://konachan.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378519/Booru%20%E5%A4%A7%E5%9B%BE%E9%A2%84%E8%A7%88%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/378519/Booru%20%E5%A4%A7%E5%9B%BE%E9%A2%84%E8%A7%88%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==
(function () {
    'use strict';

    var imgList = new Array();
    window.imgList = imgList;
    var zoom = '<div id="zoom" style="display: none;"></div>';
    jQuery("body").append(zoom);
    var $zoom = jQuery("#zoom");
    $zoom.hide();
    function addZoomPreview() {
        var $allPostLi = jQuery("#post-list-posts > li");
        var id = 0;
        jQuery.each($allPostLi, function (index, item) {
            var $item = jQuery(item);
            var $a = $item.find(".thumb");
            // $a.attr("href", "javascript:void(0)");
            var reg = "(\/files.+?(\.jpg|\.png))";
            var result = jQuery($item).html().match(reg);
            var imgurl = result[0];
            imgList[id] = imgurl;
            // $item.click(function () {
            //     var reg = "(\/files.+?(\.jpg|\.png))";
            //     var result = jQuery(this).html().match(reg);
            //     var imgurl = result[0];
            //     $zoom.show();
            //     $zoom.html('<div id="zoom" style="position: fixed; top:0; left:0; width:auto; height:100%;" onclick="this.hide()"><img style="width:auto; height:100%;" src="https:/' + imgurl + '"></div>');
            // });
            id++;
        });
        window.index = 0;
        window.cacheImage = function () {
            jQuery("body").append('<img src="https:/' + imgList[window.index] + '" style="display: none;" onload="cacheImage()">');
            window.index++;
        }
        jQuery("body").append('<img src="https:/' + imgList[window.index] + '" style="display: none;" onload="cacheImage()">');
    }
    addZoomPreview();
    appendCSS();
    function appendCSS() {
        var cssText = "";

        //底部信息css
        cssText += '.tag-type-circle:after {';
        cssText += '	content: "社团";';
        cssText += '	color: #aa4';
        cssText += '}';

        cssText += '.tag-type-copyright:after {';
        cssText += '	content: "版权";';
        cssText += '	color: #aa4';
        cssText += '}';

        cssText += '.tag-type-artist:after {';
        cssText += '	content: "画师";';
        cssText += '	color: #aa4';
        cssText += '}';

        cssText += '.tag-type-character:after {';
        cssText += '	content: "角色";';
        cssText += '	color: #aa4';
        cssText += '}';

        cssText += '.tag-type-faults:after {';
        cssText += '	content: "错误";';
        cssText += '	color: #aa4';
        cssText += '}';

        cssText += '.tag-type-style:after {';
        cssText += '	content: "类型";';
        cssText += '	color: #aa4';
        cssText += '}';

        cssText += '#highres {';
        cssText += '	color: red;';
        cssText += '	border: 1px dashed white;';
        cssText += '	padding: 4px 0 4px 4px;';
        cssText += '	margin: 4px 0 4px -4px;';
        cssText += '	display: inline-block;';
        cssText += '	width: 220px';
        cssText += '}';

        cssText += '#highres:hover {';
        cssText += '	color: yellow!important;';
        cssText += '	border-color: red';
        cssText += '}';

        cssText += '.sidebar {';
        cssText += '	margin: 0!important;';
        cssText += '	max-width: 230px!important';
        cssText += '}';

        cssText += '.action-post-index .content {';
        cssText += '	width: 80%!important';
        cssText += '}';

        cssText += '#content {';
        cssText += '	width: 100%!important';
        cssText += '}';

        cssText += 'div.content div[align=center] {';
        cssText += '	display: none!important';
        cssText += '}';

        cssText += 'span.directlink-info {';
        cssText += '	display: none!important';
        cssText += '}';

        cssText += 'span.plid {';
        cssText += '	display: none!important';
        cssText += '}';

        cssText += 'span.directlink-res {';
        cssText += '	display: block!important';
        cssText += '}';

        cssText += '.directlink.smallimg {';
        cssText += '	background: black!important';
        cssText += '}';

        cssText += '#post-list-posts li {';
        cssText += '	width: 310px!important;';
        cssText += '	visibility: visible!important;';
        cssText += '	display: inline-block!important';
        cssText += '}';

        cssText += 'div.inner {';
        cssText += '	width: 310px!important;';
        cssText += '	height: 300px!important';
        cssText += '}';

        cssText += 'div.content {';
        cssText += '    float: right;';
        cssText += '}';

        cssText += 'img.preview {';
        cssText += '	width: auto!important;';
        cssText += '	max-width: 300px!important;';
        cssText += '	height: auto!important;';
        cssText += '	max-height: 300px!important;';
        cssText += '	border: none!important';
        cssText += '}';

        cssText += '#lsidebar {';
        cssText += '	display: none!important';
        cssText += '}';

        cssText += 'iframe {';
        cssText += '	display: none!important';
        cssText += '}';
        console.log('CSS创建完成');

        var element = document.createElement('link');
        element.rel = "stylesheet";
        element.type = "text/css";
        element.href = 'data:text/css,' + cssText;

        document.documentElement.appendChild(element);

        var modStyle = document.querySelector('#modCSS');
        if (modStyle === null) {
            modStyle = document.createElement('style');
            modStyle.id = 'modCSS';
            document.body.appendChild(modStyle);
            modStyle.innerHTML = cssText;
        }
        console.log('CSS已添加');
    }
    
    window.addEventListener('keyup', function (e) {
        var imgurl = $zoom.find("img").attr("src");
        var index = 0;
        for (var i = 0; i < imgList.length; i++) {
            if ('https:/' + imgList[i] == imgurl) {
                index = i;
                break;
            }
        }
        switch (e.keyCode) {
            case 37:
                if (index != 0) {
                    imgurl = imgList[index - 1];
                    $zoom.html('<div id="zoom" style="position: fixed; top:0; left:0; width:auto; height:100%;" onclick="this.hide()"><img style="width:auto; height:100%;" src="https:/' + imgurl + '"></div>');
                } else {
                    document.querySelector('a.previous_page').click();
                }
                break;
            case 39:
                if (index != imgList.length - 1) {
                    imgurl = imgList[index + 1];
                    $zoom.html('<div id="zoom" style="position: fixed; top:0; left:0; width:auto; height:100%;" onclick="this.hide()"><img style="width:auto; height:100%;" src="https:/' + imgurl + '"></div>');
                } else {
                    document.querySelector('a.next_page').click();
                }
                break;
            case 38:
                imgurl = imgList[0];
                if ($zoom.css("display") == "none") {
                    $zoom.show();
                } else {
                    $zoom.hide();
                }
                $zoom.html('<div id="zoom" style="position: fixed; top:0; left:0; width:auto; height:100%;" onclick="this.hide()"><img style="width:auto; height:100%;" src="https:/' + imgurl + '"></div>');
                break;
            case 40:
                imgurl = imgList[imgList.length - 1];
                if ($zoom.css("display") == "none") {
                    $zoom.show();
                } else {
                    $zoom.hide();
                }
                $zoom.html('<div id="zoom" style="position: fixed; top:0; left:0; width:auto; height:100%;" onclick="this.hide()"><img style="width:auto; height:100%;" src="https:/' + imgurl + '"></div>');
                break;
        }
    });
})();
