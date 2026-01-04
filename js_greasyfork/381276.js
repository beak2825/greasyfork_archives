// ==UserScript==
// @name         百度快照快速填充工具
// @namespace    http://help.baidu.com/newadd?prod_id=1&category=1
// @version      0.5 beta
// @description  try to take over the world!
// @author       You
// @match        http://help.baidu.com/newadd?prod_id=1&category=1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381276/%E7%99%BE%E5%BA%A6%E5%BF%AB%E7%85%A7%E5%BF%AB%E9%80%9F%E5%A1%AB%E5%85%85%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/381276/%E7%99%BE%E5%BA%A6%E5%BF%AB%E7%85%A7%E5%BF%AB%E9%80%9F%E5%A1%AB%E5%85%85%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    addButton();
    function addButton() {
        var $button = $(
            '<buttun style="width: 100px;height: 35px;display:block;line-height:35px;text-align:center;background:rgb(0,115,235);color:white;margin-bottom:20px">填充</buttun>');
        $('#mainContent').append($button);
        var $text = $('<textarea id="fill_content" style="width: 100%;height: 400px"></textarea><br/>');
        $('#mainContent').append($text);
        $button.click(f);
    }

    function f() {
        var $pattern = new RegExp("^(http(s)?:\\\/\\\/)?((cache\\.(baidu|baiducontent)\\.com\\\/.*newp=.*)|(www\\.baidu\\.com\\\/link\\?url=))");
        var $links = $('#fill_content').val();
        $links = $links.split('\n');
        $('.btn-add-link').attr('data-number',$links.length);
        for (var i = 1; i < $links.length - 1; i++) {
            $('.btn-add-link').click();
        }
        var $inputs = $('#mainContent .fankui-item .detail .input-box');
        console.log($links.length);
        for (var a=0; a < $links.length; a++) {
            $($inputs[a]).find('.formlink').val($links[a]);
            if (!$pattern.test($links[a]) && a < $links.length - 1) {
                console.log("第"+(a+1)+"条数据异常");
            }
        };

    }

})();