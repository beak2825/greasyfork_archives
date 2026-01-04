/// ==UserScript==
// @name         Roll20改進介面
// @namespace    http://www.isaka.idv.tw/
// @version      0.2
// @description  使roll20在拉動輸入框時可以調整上方對話框高度，並且增加多個常用輸入快捷按鈕供DM使用
// @author       Isaka(jason21716@巴哈姆特)
// @match        https://app.roll20.net/editor
// @match        https://app.roll20.net/editor#*
// @match        https://app.roll20.net/editor?*
// @match        https://app.roll20.net/editor/
// @match        https://app.roll20.net/editor/#*
// @match        https://app.roll20.net/editor/?*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/381957/Roll20%E6%94%B9%E9%80%B2%E4%BB%8B%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/381957/Roll20%E6%94%B9%E9%80%B2%E4%BB%8B%E9%9D%A2.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var interval = setInterval(function(){
        var textchat_input_height = $('#textchat-input').height();
        var rightsidebar_height = $('#rightsidebar').height();
        var toolbar_height = $('#rightsidebar > ul').height();
        $('#textchat').height(rightsidebar_height - textchat_input_height - toolbar_height - 20);
        //do whatever here..
    }, 1000);

    $('#textchat-input').append('<div class="clear"></div>');
    $('#textchat-input').append('<a herf="#" style="margin-right:5px;" class="btn isaka_action_btn" id="isaka_btn_desc" data-type="desc" data-input="/desc">desc</a>');
    $('#textchat-input').append('<a herf="#" style="margin-right:5px;" class="btn isaka_action_btn" id="isaka_btn_em" data-type="em" data-input="/em">em</a>');
    $('#textchat-input').append('<a herf="#" style="margin-right:5px;" class="btn isaka_action_btn" id="isaka_btn_as" data-type="as" data-input="/as">as</a>');
    $('#textchat-input').append('<a herf="#" style="margin-right:5px;" class="btn isaka_action_btn" id="isaka_btn_emas" data-type="emas" data-input="/emas">emas</a>');
    $('#textchat-input').append('<a herf="#" style="margin-right:5px;" class="btn isaka_action_btn" id="isaka_btn_roll" data-type="roll" data-input="/r 1d20">roll</a>');
    $('#textchat-input').append('<a herf="#" style="margin-right:5px;" class="btn isaka_action_btn" id="isaka_btn_wis" data-type="w" data-input="/w gm">wis gm</a>');
    $('#textchat-input').append('<a herf="#" style="margin-right:5px;" class="btn isaka_action_btn" id="isaka_btn_wis_token" data-type="w" data-input="/w &#34;@{target|token_name}&#34;">wis token</a>');
    $('#textchat-input').append('<div style="margin-bottom:9px;" class="clear"></div>');
    $('#textchat-input').append('<div style="float: left;"><label>Custom as:</label><input type="text" name="isaka_custom_as" id="isaka_input_custom_as" style="width: 140px;display: inline-block;margin-right: 15px;" /></div>');

    $('.isaka_action_btn').click(function(event){
        event.stopImmediatePropagation();
        var orginal_text = $('#textchat-input > textarea').val();
        if($(this).data('type') === "as" || $(this).data('type') === "emas"){
            var new_text = $(this).data('input') + ' "' + $('#isaka_input_custom_as').val() + '" ' + orginal_text;
        }else{
            var new_text = $(this).data('input') + " " + orginal_text;
        }
        $('#textchat-input > textarea').val(new_text);
    });

    $('#textchat-input > textarea').keydown(function(event){
        if( event.ctrlKey && event.which == 68 ){
            event.preventDefault();
            $('#isaka_btn_desc').click();
            console.log('Triggered ctrl + D');
            return false;
        }
    });
})();