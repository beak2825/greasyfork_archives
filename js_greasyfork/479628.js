// ==UserScript==
// @name         Fanly Weibo Unfollow
// @namespace    https://zhangzifan.com/
// @version      1.0
// @description  微博自动批量取消关注。通过微博主页点击自己的关注数量页面（类似 https://weibo.com/u/page/follow/uid），然后点击“批量管理”后，就会出现“批量取关”按钮，点击就能够开始自动批量取消关注了。
// @author       Fanly
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weibo.com
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @match        https://weibo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479628/Fanly%20Weibo%20Unfollow.user.js
// @updateURL https://update.greasyfork.org/scripts/479628/Fanly%20Weibo%20Unfollow.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(function () {
        setTimeout(function() {
            //批量取关按钮
            var btn = $('.woo-panel-main > .woo-box-flex > .woo-box-flex > button.woo-button-main.woo-button-simple.woo-button-default.woo-button-s.woo-button-round');
            btn.on('click', function(){
                if ($.trim($(this).text()) == '取消批量管理') {
                    var x_unfollow = '<a href="javascript:void(0);" class="x_unfollow" style="padding:5px 10px;">批量取关</a>';
                    $(this).after(x_unfollow);
                }else{
                    $('a.x_unfollow').remove();
                }
            });
            //开始批量取关
            $(document).on('click', 'a.x_unfollow',function(){
                //批量选择
                x_checked();
                //开始取消
                setTimeout(function() {
                    //点击取消关注
                    $('#app > div.woo-box-flex.woo-box-column > div.woo-box-flex > div:nth-child(2) > main > div > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div.woo-box-flex.woo-box-alignCenter.woo-box-justifyBetween > div.woo-box-flex > div.woo-box-flex.woo-box-alignCenter > button').click();
                    setTimeout(function() {
                        //确认取消
                        $('#app > div:nth-child(4) > div.woo-modal-main > div > div.woo-dialog-ctrl > button.woo-button-main.woo-button-flat.woo-button-primary.woo-button-m.woo-button-round.woo-dialog-btn').click();
                        setTimeout(function() {
                            //执行下一轮
                            $('a.x_unfollow').click();
                        }, 2000);
                    }, 1000);
                }, 3000);
            });
            //勾选
            function x_checked(){
                $('.vue-recycle-scroller__item-wrapper input[type="checkbox"]').slice(0, 20).each(function(index) {
                    setTimeout(() => {
                        var event = new MouseEvent('click', {
                            'bubbles': true,
                            'cancelable': true
                        });
                        this.dispatchEvent(event);
                    }, 10 * index);
                });
            }

        }, 1000);

    });
})();