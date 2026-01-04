// ==UserScript==
// @name         [kesai]google搜索选项扩展
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  增加了快捷设置文件类型过滤搜索和网站过滤搜索
// @author       kesai
// @match        https://www.google.com/*
// @match        https://www.google.co.jp/*
// @match        https://www.google.com.hk/*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388203/%5Bkesai%5Dgoogle%E6%90%9C%E7%B4%A2%E9%80%89%E9%A1%B9%E6%89%A9%E5%B1%95.user.js
// @updateURL https://update.greasyfork.org/scripts/388203/%5Bkesai%5Dgoogle%E6%90%9C%E7%B4%A2%E9%80%89%E9%A1%B9%E6%89%A9%E5%B1%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let fileExtArray = ['doc', 'pdf', 'xls', 'ppt', 'rtf', 'kml'];

    function initMenus() {
        initfileType();
        initSiteFilter();
        $("#hdtb-tls").trigger("click");
    }

    function getArrayIndex() {
        var regex = /filetype:[a-zA-Z]{1,4}/i;
        var searchContent = $(".gLFyf.gsfi").val();
        if (regex.test(searchContent)) {
            //获取搜索框内的文件类型
            if (searchContent.match(regex).length > 0) {
                var selExt = searchContent.match(regex)[0].split(":")[1];
                var i = 0;
                for (i = 0; i < fileExtArray.length; i++) {
                    if (fileExtArray[i] === selExt) return i;
                }
            }
        }
        return -1;
    }

    function initfileType() {
        $(".hdtb-mn-cont").append($('<span class="hQKUmb"></span>'));
        var div = $('<div class="hdtb-mn-hd" aria-haspopup="true" role="button" tabindex="0" aria-label="所有网页和文件"><div id="fileTypeTitle_div" class="mn-hd-txt">所有网页和文件</div><span class="mn-dwn-arw"></span></div>');
        $(".hdtb-mn-cont").append(div);
        let ul = $('<ul class="hdtbU hdtb-mn-o" aria-expanded="false" style="display:none;left: 410.977px; top: 25px; min-width: 148px;"></ul>');

        var all_li = $('<li class="hdtbItm " id="li_"><a class="q qs">所有网页和文件</a></li>');
        ul.append(all_li);
        var i = 1;
        var selTabIndex = getArrayIndex() + 1;
        if (selTabIndex <= 0) {
            all_li.addClass("hdtbSel");
            $("#fileTypeTitle_div").text("所有网页和文件");
        } else {
            all_li.removeClass("hdtbSel");
        }

        fileExtArray.forEach(function(fileExt) {
            var id = "li_" + i;
            var li = $('<li class="hdtbItm" id="' + id + '"><a class="q qs">' + fileExt + '</a></li>');
            ul.append(li)
            li.removeClass("hdtbSel");
            if (selTabIndex === i) {
                li.addClass("hdtbSel");
                $("#fileTypeTitle_div").text(fileExt + "文件");
            }
            i++;
        })

        $(".hdtb-mn-cont").append(ul);
        div.bind("click", function() {
            if (ul.css("display") === "block") ul.css("display", "none");
            else
                ul.css("display", "block")
        });

        ul.find("li").bind("click", function() {
            var regex = /filetype:[a-zA-Z]{1,4}/i;
            var str = $(".gLFyf.gsfi").val();
            var filetype = "filetype:" + $(this).text();
            //点击的是所有网页和文件
            if (regex.test(filetype) === false) {
                $(".gLFyf.gsfi").val(str.replace(regex, ""));
            } else {
                if (regex.test(str)) {
                    var regex = /filetype:[a-zA-Z]{1,4}/i;
                    if (regex.test(str)) {
                        $(".gLFyf.gsfi").val(str.replace(regex, filetype));
                    }
                } else {
                    $(".gLFyf.gsfi").val($(".gLFyf.gsfi").val() + " " + filetype);
                }
            }
            ul.css("display", "none");
            $(".Tg7LZd").trigger("click");
        });
    }

    function getSite() {
        var searchContent = $(".gLFyf.gsfi").val();
        if (searchContent.indexOf("site:") > 0) {
            var searchContentArray = searchContent.split(" ");
            for (var i = 0; i < searchContentArray.length; i++) {
                if (searchContentArray[i].indexOf("site:") == 0) {
                    return searchContentArray[i].replace("site:", "");

                }
            }
        }
        return "";
    }

    function initSiteFilter() {
        //获取输入框内容       
        var site = getSite();
        if (site === "") site = "站点内检索";
        $(".hdtb-mn-cont").append($('<span class="hQKUmb"></span>'));
        var div = $('<div class="hdtb-mn-hd" aria-haspopup="true" role="button" tabindex="0" aria-label="' + site + '"><div class="mn-hd-txt">' + site + '</div><span class="mn-dwn-arw"></span></div>');
        $(".hdtb-mn-cont").append(div);

        let ul = $('<ul class="hdtbU hdtb-mn-o" aria-expanded="false" style="display:none;left: 410.977px; top: 25px; min-width: 148px;"><li><input id="input_site" type="txt" autocomplete="off" value="" placeholder="例如:baidu.com,不输入为所有网站"><a id="btn_site_OK">确认</a></li></ul>');
        $(".hdtb-mn-cont").append(ul);

        div.bind("click", function() {
            if (ul.css("display") === "block") ul.css("display", "none");
            else
                ul.css("display", "block")
        });

        $("#input_site").bind("keydown", function(evt) {
            if (evt.keyCode === 13) {
                $("#btn_site_OK").trigger("click");
            }
        })

        $("#btn_site_OK").bind("click", function() {
            var url = $("#input_site").val();
            //没有进行正则表达式的验证            
            var site = getSite();
            if (site != "") {
                if (url.trim() != "") $(".gLFyf.gsfi").val($(".gLFyf.gsfi").val().replace("site:" + site, "site:" + url));
                else
                    $(".gLFyf.gsfi").val($(".gLFyf.gsfi").val().replace("site:" + site, ""));
            } else {
                if (url.trim() != "")
                    $(".gLFyf.gsfi").val($(".gLFyf.gsfi").val() + " " + "site:" + url);
            }
            $(".Tg7LZd").trigger("click");
            ul.css("display", "none");
        });
    }

    $(function() {
        //initMenus();
        setTimeout(function() { initMenus(); }, 2000);

    })



})();