// ==UserScript==
// @name         gaoqing 关联豆瓣
// @namespace    http://tampermonkey.net/
// @version      2.11
// @description  - 在http://gaoqing.la 网站的电影中的片名一栏添加超链接跳转到豆瓣对于评分页面。
// @author       backrock12
// @match        https://www.douban.com/search*
// @match        http://gaoqing.la/*
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/382988/gaoqing%20%E5%85%B3%E8%81%94%E8%B1%86%E7%93%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/382988/gaoqing%20%E5%85%B3%E8%81%94%E8%B1%86%E7%93%A3.meta.js
// ==/UserScript==

 
(function ( ) {
    'use strict';

    console.log('gaoqing');
    //var $ = unsafeWindow.jQuery;

    $(function () {
        //  try {
        if (/www\.douban\.com/.test(location.href)) {
            if (location.hash && location.hash.length > 0) {
                if (location.hash.slice(1) == "autoselect") {
                    $(".result-list .result .title h3").each(function () {
                        if (
                            $(this)
                                .find("span")
                                .eq(0)
                                .text() == "[电影]"
                        ) {
                            if (
                                $(this)
                                    .find("a")
                                    .eq(0)
                                    .attr("href") != null
                            ) {
                                $(location).prop(
                                    "href",
                                    $(this)
                                        .find("a")
                                        .eq(0)
                                        .attr("href")
                                );
                                return false;
                            }
                        }
                    });
                }
            }
        } else {
            _subGaoqingReplace();
        }
        //           } catch (err) {
        //             console.log("gaoqing replace Error:" + err.message);
        //           }




        function _subGaoqingReplace() {

            var isfind = false;

            $("span").not("script").not("a").each(
                function () {
                    if (isfind) return;
                    var valuetext = $(this).text();
                    if (!valuetext || valuetext.length < 1) return;
                    var n1 = valuetext.indexOf("片　　名");
                    if (n1 && n1 > 0) {
                        var name = null;
                        if (this.nodeName == "P") {
                            var n2 = valuetext.indexOf("年　　代");
                            name = valuetext.substr(n1 + 4, n2 - n1 - 4 - 1);
                        } else {
                            name = valuetext.substr(n1 + 4);
                        }
                        name = $.trim(name).replace("\n", "");
                        if (name != null) {
                            console.log("gaoqingreplace:" + name);
                            console.log(this);

                            var h = $(this)
                                .html()
                                .replace(
                                    name,
                                    "<a href='https://www.douban.com/search?cat=1002&q=" +
                                    name +
                                    "#autoselect' target='_blank' style='font-weight:bold;'><font color='#0000FF'>" +
                                    name +
                                    "</font></a>"
                                );

                            $(this).before(h);
                            $(this).remove();
                            isfind = true;
                            return false;
                        }
                    }
                });

            $("p").not("script").not("a").each(
                function () {
                    if (isfind) return;
                    var valuetext = $(this).text();
                    if (!valuetext || valuetext.length < 1) return;
                    var n1 = valuetext.indexOf("片　　名");
                    if (n1 && n1 > 0) {
                        var name = null;
                        if (this.nodeName == "P") {
                            var n2 = valuetext.indexOf("年　　代");
                            name = valuetext.substr(n1 + 4, n2 - n1 - 4 - 1);
                        } else {
                            name = valuetext.substr(n1 + 4);
                        }
                        name = $.trim(name).replace("\n", "");
                        if (name != null) {
                            console.log("gaoqingreplace:" + name);
                            console.log(this);

                            var h = $(this)
                                .html()
                                .replace(
                                    name,
                                    "<a href='https://www.douban.com/search?cat=1002&q=" +
                                    name +
                                    "#autoselect' target='_blank' style='font-weight:bold;'><font color='#0000FF'>" +
                                    name +
                                    "</font></a>"
                                );

                            $(this).before(h);
                            $(this).remove();
                            isfind = true;
                            return false;
                        }
                    }
                });
        };

    });

})( );