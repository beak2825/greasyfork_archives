// ==UserScript==
// @name         万能页内选中搜索【失效联系作者24小时更新】
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  任何页面选中以后都可以快捷搜索，实现不跳出网页浏览进行搜索，目前支持必应搜索。
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @author       蜡小新
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445266/%E4%B8%87%E8%83%BD%E9%A1%B5%E5%86%85%E9%80%89%E4%B8%AD%E6%90%9C%E7%B4%A2%E3%80%90%E5%A4%B1%E6%95%88%E8%81%94%E7%B3%BB%E4%BD%9C%E8%80%8524%E5%B0%8F%E6%97%B6%E6%9B%B4%E6%96%B0%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/445266/%E4%B8%87%E8%83%BD%E9%A1%B5%E5%86%85%E9%80%89%E4%B8%AD%E6%90%9C%E7%B4%A2%E3%80%90%E5%A4%B1%E6%95%88%E8%81%94%E7%B3%BB%E4%BD%9C%E8%80%8524%E5%B0%8F%E6%97%B6%E6%9B%B4%E6%96%B0%E3%80%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var content = "";
    $("body").bind('mouseup', function(e) {
        processSelection(e);
    });

    function processSelection(e) {
        var text = getSelectedText();
        if (!!text && text != "" && text.length != 0) {
            showBubble(e, text);
        } else {
            hideBubble();
        }
    }

    function getSelectedText() {
        var text = "";
        if (window.getSelection) {
            text = window.getSelection()
                .toString();
        } else if (document.selection && document.selection.type != "Control") {
            text = document.selection.createRange()
                .text;
        }
        return text;
    }


    function showBubble(e, text) {
        content = text;
        if($('#any-searcher-bubble').length == 0) {
            $("body").append("<div id='any-searcher-bubble' style='color: white;background-color: rgb(41 115 236);width: 110px;height: 31px;padding: 0 4px 0 11px;position:absolute;font-size: 15px;line-height: 31px;border-radius: 3px;cursor: pointer;font-weight:bold;'>点我页内搜索</div>");
            $("#any-searcher-bubble").click(function(e) {
                if($("#any-searcher-iframe-container").length ==0) {
                     $("body").append("<div id='any-searcher-iframe-container' style='width: 500px;height: 300px;position:absolute;border-radius: 2px;border: 1px solid #d3d3d3;'>"+
                                 "<div style='position:absolute;cursor: pointer;top:-22px;left:0px;font-size: 12px;' id='any-searcher-iframe-x'>X</div>"+
                                 "<div style='position:absolute;cursor: pointer;top:-22px;left:20px;font-size: 12px;width:50px;' id='any-searcher-iframe-reset'>Reset</div>"+
                                 "<div style='position:absolute;cursor: pointer;top: -22px;left: 61px;font-size: 12px;width:50px;' id='any-searcher-iframe-left'>Left</div>"+
                                 "<div style='position:absolute;cursor: pointer;top: -22px;left: 91px;font-size: 12px;width:50px;' id='any-searcher-iframe-right'>Right</div>"+
                                 "<iframe id='any-searcher-iframe' style='width:100%;height:100%' src='https://cn.bing.com/search?q="+content+"'></iframe></div>");
                    $("#any-searcher-iframe-x").click(function(e){
                        $("#any-searcher-iframe-container").hide();
                    });
                    $("#any-searcher-iframe-reset").click(function(e){
                        $('#any-searcher-iframe').attr('src', $('#any-searcher-iframe').attr('src'));
                    });
                    $("#any-searcher-iframe-left").click(function(e){
                        $('#any-searcher-iframe-container').hide();
                        $('#any-searcher-iframe-container').css('left',"10px");
                        $('#any-searcher-iframe-container').show();
                    });

                    $("#any-searcher-iframe-right").click(function(e){
                        $('#any-searcher-iframe-container').hide();
                        $('#any-searcher-iframe-container').css('right',"10px");
                        $('#any-searcher-iframe-container').css('left',"");
                        $('#any-searcher-iframe-container').show();
                    });

                    $('#any-searcher-iframe-container').css('left',"10px");
                }
                $('#any-searcher-iframe-container').css('top', e.pageY - 40 + "px");
                $('#any-searcher-iframe-container').show();
                e.stopPropagation();
            });

        }
        $('#any-searcher-bubble').css('top', e.pageY - 40 + "px");
        $('#any-searcher-bubble').css('left', e.pageX + 20 + "px");
        $('#any-searcher-bubble').show();
    }

    function hideBubble() {
        $('#any-searcher-bubble').hide();
    }

    function makeASelf(){
        var elements = $("a");
        for(var i = 0 ; i < elements.length; i++) {
            $(elements[i]).attr("target","_self")
        }
    }
    window.setInterval(makeASelf, 500);
})();