// ==UserScript==
// @name            how2j代码框放大
// @namespace       [url]1170915345@qq.com[/url]
// @author          wyx
// @description     how2j网站的代码框太小，增加一个放大按钮
// @match           *://how2j.cn/k/*
// @require         http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @version         2.01
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/36579/how2j%E4%BB%A3%E7%A0%81%E6%A1%86%E6%94%BE%E5%A4%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/36579/how2j%E4%BB%A3%E7%A0%81%E6%A1%86%E6%94%BE%E5%A4%A7.meta.js
// ==/UserScript==
(function () {
        'use strict';

        var plus_html = '<div style="position:fixed;bottom:20px;right:40px;z-index: 10;">' +
            '<a id="plus" href="###">' +
            '<span style="font-size:90px;font-family:fantasy" title="适应大小" class="glyphicon glyphicon-plus"></span>' +
            '</a>' +
            '</div>';

        var table=$("body");
        table.css("z-index","0");
        table.prepend(plus_html);

		var flag=false;

        $(function () {
            $("#plus").click(function () {
                if(flag===false) {
                    $(".stepbody.panel-body1").css(
                        "cssText", "width: 130%;" +
                        "margin-left: -200px;"
                    );
                    $(".panel-info").css(
                        "cssText", "margin-left: -200px"
                    );
                    $(".syntaxhighlighter").css(
                        "cssText", "overflow: visible !important;" +
                        "margin-left: -70px !important"
                    );
                    flag=true;
                }else{
                    $(".stepbody.panel-body1").css(
                        "cssText", ""
                    );
                    $(".panel-info").css(
                        "cssText", ""
                    );
                    $(".syntaxhighlighter").css(
                        "cssText", "overflow: auto !important"
                    );
                    flag=false;
				}
            });
        });
    })();