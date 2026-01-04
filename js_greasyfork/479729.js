// ==UserScript==
// @name         Fanly Weibo UnFans
// @namespace    https://zhangzifan.com/
// @version      1.0
// @description  微博自动取消互相关注。通过微博主页点击我的粉丝页面（类似 https://weibo.com/u/page/follow/uid?relate=fans），然后点击页面右下角的“取消互相关注”按钮，然后页面就会自动开始加载列表和自动取消互相关注的粉丝。
// @author       Fanly
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weibo.com
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @match        https://weibo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479729/Fanly%20Weibo%20UnFans.user.js
// @updateURL https://update.greasyfork.org/scripts/479729/Fanly%20Weibo%20UnFans.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(function () {
        setTimeout(function() {

            $('body').before('<a href="javascript:void(0);" class="x_follow" style="position: fixed;right: 1%;bottom: 10%;">取消互相关注</a>');
                $(document).on('click', 'a.x_follow',function(){
                    xw_checked();
                    setTimeout(() => {
                        // 首先滑动到页面底部
                        $('html, body').animate({
                            scrollTop: $(document).height()
                        }, 'slow', function() {
                            // 动画完成后等待两秒
                            setTimeout(function() {
                                // 计算向上滚动的目标位置
                                var scrollUpTo = $(window).scrollTop() - ($(document).height() / 3); // 假设一行高20像素，向上滚动3行
                                // 向上滚动到计算出的位置
                                $('html, body').animate({
                                    scrollTop: scrollUpTo
                                }, 'slow');
                            }, 3000); // 2000毫秒（2秒）的等待时间
                        });
                        $('a.x_follow').click();
                    }, 6000);
                });
                //互相关注
                function xw_checked(){
                    var n = 1;
                    $('div[page="myFans"] button').each(function(index) {
                        var $parentItem = $(this).closest('.wbpro-scroller-item');
                        var $spanWithUsercard = $parentItem.find('span[usercard]');
                        var $name = $spanWithUsercard.text();
                        var $text = $.trim($(this).text());
                        console.log($text + '：'+$name);
                        if ($text == '互相关注') {
                            setTimeout(() => {
                                var event = new MouseEvent('click', {
                                    'bubbles': true,
                                    'cancelable': true
                                });
                                this.dispatchEvent(event);
                                //
                                setTimeout(() => {
                                    $('#app > div:nth-child(4) > div.woo-modal-main > div > div.woo-dialog-ctrl > button.woo-button-main.woo-button-flat.woo-button-primary.woo-button-m.woo-button-round.woo-dialog-btn').click();
                                    console.log('取关成功：'+$name);
                                }, 500);
                            }, 1000 * n);
                            n++;
                        }
                        //console.log('粉丝：'+$name);
                   });
                    return true;
                }

        }, 1000);
    });
})();