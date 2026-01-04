// ==UserScript==
// @name         google_doc_sheet_finder
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  谷歌文档Excel页签搜索框
// @author       dong.luo@happyelements.com
// @include      /^http[s]*:\/\/docs\.google\.com\/spreadsheets\/.*$/
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439152/google_doc_sheet_finder.user.js
// @updateURL https://update.greasyfork.org/scripts/439152/google_doc_sheet_finder.meta.js
// ==/UserScript==


(function() {
    'use strict';

    //==========================================
    // var $ = window.jQuery;
    var $ = window.jQuery.noConflict(true);

    // 注入Finder代码
    injectFinder();

    // 定时器：根据Sheet列表菜单的显示状态，来同步显示Finder的显示状态
    var finderShowCheckTimer;

    // 搜索框获得焦点时 Sheet 列表菜单也显示着
    $("#ld-google-doc-finder-text").focus(function() {
        var sheetMenuDiv = $(".ld-google-doc-finder-sheet-list-div");
        if (!sheetMenuDiv || sheetMenuDiv.size() != 1) {
            return;
        }
        sheetMenuDiv.css({"display":""});
    });

    // 搜索框失败焦点时 Sheet 列表菜单隐藏
    $("#ld-google-doc-finder-text").blur(function() {
        var sheetMenuDiv = $(".ld-google-doc-finder-sheet-list-div");
        if (!sheetMenuDiv || sheetMenuDiv.size() != 1) {
            return;
        }
        sheetMenuDiv.css({"display":"none"});
    });

    // 搜索Sheet
    $("#ld-google-doc-finder-text").bind("input propertychange",function(event){
        var sheetMenuDiv = $(".ld-google-doc-finder-sheet-list-div");
        if (!sheetMenuDiv || sheetMenuDiv.size() != 1) {
            return;
        }

        var widthPx = $("#ld-google-doc-finder").css("width");
        sheetMenuDiv.css({"width": widthPx});

        var searchVal = $(this).val();
        //console.log("search: "+searchVal)
        if (!searchVal) {
            //全部展现
            $('.goog-menuitem', sheetMenuDiv).show();
        }else {
            $('.goog-menuitem', sheetMenuDiv).each(function(i){
                var searchData = $(".goog-menuitem-content", $(this)).html();
                if (searchData.indexOf('</div>') >= 0) {
                    searchData = searchData.replace(/<div.+?<\/div>/g, '');
                }
                //console.info(searchData);
                var matched = searchData && searchData.toLowerCase().indexOf(searchVal.toLowerCase()) >= 0;
                if(matched) {
                    $(this).show();
                }else {
                    $(this).hide();
                }
            });
        }
    });

    // 三道杠点击事件：显示Sheets列表菜单时，显示Finder
    $(".docs-sheet-all").click(function(){
        setTimeout(function(){
            // 页签列表菜单div
            var sheetMenuDiv = $(".docs-menu-attached-button-above");
            if(sheetMenuDiv && sheetMenuDiv.size() == 1) {
                if (sheetMenuDiv.attr("ld-add-class-flag") != "1") {
                    sheetMenuDiv.attr("ld-add-class-flag", "1");
                    sheetMenuDiv.addClass("ld-google-doc-finder-sheet-list-div");
                }

                // 开启定时器
                clearInterval(finderShowCheckTimer);
                finderShowCheckTimer = setInterval(finderShowCheck, 100);
            }
        }, 50);
    });

    // 检查Finder显示状态：根据Sheet列表显示状态来同步更新Finder的显示状态
    function finderShowCheck() {
        var sheetMenuDiv = $(".ld-google-doc-finder-sheet-list-div");
        if (!sheetMenuDiv || sheetMenuDiv.size() != 1) {
            return;
        }

        var sheetMenuIsHidden = sheetMenuDiv.css("display") == "none";
        var finderIsHidden = $("#ld-google-doc-finder").css("display") == "none";

        if (sheetMenuIsHidden && !finderIsHidden) {
            $("#ld-google-doc-finder").css({"display":"none"});
            // 停止定时器
            clearInterval(finderShowCheckTimer);
        }else if(!sheetMenuIsHidden && finderIsHidden) {
            finderShow();
        }
    }

    // 显示Finder
    function finderShow() {
        var sheetMenuDiv = $(".ld-google-doc-finder-sheet-list-div");
        if (!sheetMenuDiv || sheetMenuDiv.size() != 1) {
            return;
        }

        // 检查显示状态
        var isHidden = $("#ld-google-doc-finder").css("display") == "none";
        if (!isHidden) {
            // 已经在显示状态了，不再处理
            return;
        }

        // 得到显示属性
        var widthPx = sheetMenuDiv.css("width");
        var leftPx = sheetMenuDiv.css("left");
        var topPx = (parseInt(sheetMenuDiv.css("top")) - 29) + "px";

        // 显示Finder
        $("#ld-google-doc-finder").css({"display":"", "top":topPx, "left":leftPx, "width":widthPx});
        $("#ld-google-doc-finder-text").val("");
    }

    function injectFinder() {
        $("body").append(genFinderHtmlCode());
    }

    function genFinderHtmlCode() {
        var htmlCode = '' +
                '<div id="ld-google-doc-finder" style="position:fixed; z-index:9999; left:500px; top:10px; display:none;">' +
                '  <div style="padding:0 30px 0 20px;"><input id="ld-google-doc-finder-text" type="text" style="width: 100%; height:25px; padding:0 5px;" placeholder="输入页签名进行搜索" autocomplete="off"></div>' +
                '</div>';
        return htmlCode;
    }

})();

