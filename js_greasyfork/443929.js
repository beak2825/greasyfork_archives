// ==UserScript==
// @name         U2聊天框添加BBCODE按钮
// @namespace    https://github.com/AisukaYuki/U2-CHATBOX-BBCODE
// @version      0.0.3.6
// @description  聊天框添加BBCODE快捷插入按钮
// @author       アイスカユキ
// @match        *://u2.dmhy.org/*
// @exclude      *://u2.dmhy.org/forums.php*
// @exclude      *://u2.dmhy.org/addoffer.php*
// @exclude      *://u2.dmhy.org/upload.php*
// @exclude      *://u2.dmhy.org/contactstaff.php*
// @exclude      *://u2.dmhy.org/edit.php*
// @exclude      *://u2.dmhy.org/comment.php*
// @exclude      *://u2.dmhy.org/sendmessage.php*
// @icon         https://u2.dmhy.org/favicon.ico
// @supportURL   https://github.com/AisukaYuki/U2-CHATBOX-BBCODE
// @homepageURL  https://github.com/AisukaYuki/U2-CHATBOX-BBCODE
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/443929/U2%E8%81%8A%E5%A4%A9%E6%A1%86%E6%B7%BB%E5%8A%A0BBCODE%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/443929/U2%E8%81%8A%E5%A4%A9%E6%A1%86%E6%B7%BB%E5%8A%A0BBCODE%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

//初版测试没有实时预览，后续再完善

(function() {
    'use strict';
    var bb_tag = $('[name="shbox"] > div');
    var btn_pre = '<a><addr title="例子：';
    var btn_min = '"><input class="bbcode" id="';
    var btn_aft = '" type="button" value="';
    var btn_fin = '"></a>';

    var btn_list = '<span style="font-weight: bold;position: relative;font-size: 14px;">聊天常用：</span>';
    btn_list += btn_pre + '[b]这是粗体。[/b]' + btn_min + 'b' + btn_aft + '粗体' + btn_fin;
    btn_list += btn_pre + '[i]这是斜体。[/i]' + btn_min + 'i' + btn_aft + '斜体' + btn_fin;
    btn_list += btn_pre + '[u]这是下划线。[/u]' + btn_min + 'u' + btn_aft + '下划' + btn_fin;
    btn_list += btn_pre + '[s]这是删除线。[/s]' + btn_min + 's' + btn_aft + '删除' + btn_fin;
    btn_list += '<a><addr title="选择后点击插入"> <b style="cursor: default;">颜色:</b><input value="#ff0000" class="color_s" id="color_s" type="color"></a>';
    btn_list += btn_pre + '[color=red/#RGB]这是红色[/color]' + btn_min + 'color' + btn_aft + '插入' + btn_fin;
    btn_list += '<a><addr title="选择后点击插入"> <b style="cursor: default;">大小:</b><select id="text_s"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option></select></a>';
    btn_list += btn_pre + '[size=4]这是4号字的文字。[/size]' + btn_min + 'size' + btn_aft + '插入' + btn_fin;
    btn_list += btn_pre + '[url=链接]文本[/url]' + btn_min + 'url' + btn_aft + '链接"><div class="_box" id="url_box"><div>地址：<input id="url_addr" type="text"></div><div>描述：<input id="url_dis" type="text"></div><input id="url_send" type="button" value="插入"></div></a>';
    btn_list += btn_pre + '[img]图片链接[/img]' + btn_min + 'img' + btn_aft + '图片' + btn_fin;
    btn_list += btn_pre + '[code]这是代码文本。[/code]' + btn_min + 'code' + btn_aft + '代码' + btn_fin;
    btn_list += btn_pre + "[spoiler='剧透是不可能的！']真的！[/spoiler]" + btn_min + 'spoiler' + btn_aft + '剧透"><div class="_box" id="sp_box"><div>标题：<input id="sp_text" type="text"></div><div>内容：<input id="sp_dis" type="text"></div><input id="sp_send" type="button" value="插入"></div></a>';
    btn_list += '<a href="tags.php"><addr title="更多BBCODE"' + btn_min + '' + btn_aft + '更多' + btn_fin;

    bb_tag.prepend(btn_list + '<br>');

    var text;
    function box_focus(){
        //面向百度编程（wwww

        var text_pos = text.indexOf("/");
        var move_pos = text_pos - 1;
        (function($) {
            $.fn.extend({
                insertAtCaret: function(myValue) {
                    var $t = $(this)[0];
                    if (document.selection) {
                        this.focus();
                        sel = document.selection.createRange();
                        sel.text = myValue;
                        this.focus();
                    } else
                    if ($t.selectionStart || $t.selectionStart == '0') {
                        var startPos = $t.selectionStart;
                        var endPos = $t.selectionEnd;
                        var scrollTop = $t.scrollTop;
                        $t.value = $t.value.substring(0, startPos) + myValue + $t.value.substring(endPos, $t.value.length);
                        this.focus();
                        $t.selectionStart = startPos + myValue.length;
                        $t.selectionEnd = startPos + move_pos;
                        $t.scrollTop = scrollTop;
                    } else {
                        this.value += myValue;
                        this.focus();
                    }
                }
            })
        })(jQuery);

        //面向百度编程（wwww
    };

    var color_val = '#ff0000';
    $("#color_s").change(function(){
        color_val= $("#color_s").val();
    });

    var text_val = '1';
    $("#text_s").change(function(){
        text_val= $("#text_s").val();
    });

    function url_on(){
        $("#url_box").css("display","inline-block");
    };

    $("#url_send").click(function(){

        text = '[url='+ $("#url_addr").val() + ']' + $("#url_dis").val() + '[/url]';
        box_focus();
        $("#shbox_text").insertAtCaret(text);
        $("#url_dis").val("");
        $("#url_addr").val("");
        $("#url_box").css("display","none");
    });

    function sp_on(){
        $("#sp_box").css("display","inline-block");
    };

    $("#sp_send").click(function(){

        text = '[spoiler='+ $("#sp_text").val() + ']' + $("#sp_dis").val() + '[/spoiler]';
        box_focus();
        $("#shbox_text").insertAtCaret(text);
        $("#sp_dis").val("");
        $("#sp_text").val("");
        $("#sp_box").css("display","none");
    });
    $(".bbcode").click(function() {
        var btn_click = $(this).attr("id");
        switch (btn_click) {
            case ('b'):
                text = '[b][/b]';
                break;
            case ('i'):
                text = '[i][/i]';
                break;
            case ('u'):
                text = '[u][/u]';
                break;
            case ('s'):
                text = '[s][/s]';
                break;
            case ('color'):
                text = '[color=' + color_val + '][/color]';
                break;
            case ('size'):
                text = '[size=' + text_val + '][/size]';
                break;
            case ('url'):
                url_on();
                return;
            case ('img'):
                text = '[img][/img]';
                break;
            case ('code'):
                text = '[code][/code]';
                break;
            case ('spoiler'):
                sp_on();
                return;
            default:
                break;
        }
        box_focus();
        $("#shbox_text").insertAtCaret(text);
    })

    $(".bbcode").css({
        "display": "inline-block",
        "position": "relative",
        "margin-top": "2px",
        "margin-right": "1px",
        "padding": "1px"
    });
    $(".color_s").css({
        "display": "inline-block",
        "position": "relative",
        "margin-right": "1px",
        "height": "22px",
        "width": "30px",
        "padding": "1px"
    });
    $(".eg").css({
        "display": "inline-block",
        "position": "relative",
        "bottom": "-15px",
        "left": "100px"
    });
    $("._box").css({
        "display": "none",
        "position": "absolute",
        "margin-left": "-108px",
        "margin-top": "25px",
        "padding": "2px",
        "border": "2px",
        "border-radius": "4px",
        "border-style": "solid",
        "border-color": "#5b6f83",
        "background-color": "#6e89a0"
    });
})();
