// ==UserScript==
// @name         PUBG 在家领取每日礼包
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  PUBG 绝地求生 网吧活动202007 在家领取每日礼包
// @author       moonrailgun
// @match        *://cafe.playbattlegrounds.com/act/a20200519pubg/nonNetbarIndex*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406916/PUBG%20%E5%9C%A8%E5%AE%B6%E9%A2%86%E5%8F%96%E6%AF%8F%E6%97%A5%E7%A4%BC%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/406916/PUBG%20%E5%9C%A8%E5%AE%B6%E9%A2%86%E5%8F%96%E6%AF%8F%E6%97%A5%E7%A4%BC%E5%8C%85.meta.js
// ==/UserScript==

var $ = window.jQuery;
$(function() {
    'use strict';
    var ticket = new URLSearchParams(window.location.search).get(ticket)

    function getGift(giftId) {
        console.log(giftId)
        if (typeof giftId == 'undefined' || giftId == null) {
            return false;
        }


        $.ajax({
            url: '/act/a20200519pubg/getGift',
            type: 'POST',
            dataType: 'json',
            data: { giftId: giftId },
            success: function (data) {
                if (typeof data != 'undefined' && data.r == 0) {
                    // $(that).removeClass('on').text('已领取')
                    var msg = data.msg || data.error_msg
                    let htmls = ''
                    // showTips(msg);
                    htmls += '<div class="dia-con">'
                        + '<div class="dhcgtips">'
                        + '<div class="dh_big_t1" >兑换成功</div>'
                        + '<div class="dh_big_t2" >已成功兑换<span>' + msg + '</span></div>'
                        + '</div>       '
                        + '</div>'
                        + '<a class="dia-close" href="javascript:showDialog.hide()" id="tips_close"  title="关闭">×</a>'

                    // $('#dhcg').html(htmls)
                    // $('#dhcg').show();
                    if(typeof msg != 'undefined' && msg != '') {
                        alert('已成功兑换 ' + msg)
                    } else {
                        alert('兑换成功')
                    }

                    if (typeof data.qualification != 'undefined') {
                        $('[data-gift-id=' + giftId + ']+.duihuan_tips span').text(data.qualification)

                        if (parseInt(data.qualification, 10) == 0) {
                            // $(btn).removeClass('d').addClass('d').text('兑换完毕');
                        }
                    }
                } else {
                    alert(data.msg || '请稍后再试');
                }

                // if(data.r == -1003) {
                //     setTimeout(function(){
                //         window.location.href = '/static/html/act/index1.html'
                //     }, 3000)
                // }
            },
            error: function () {
                var msg = '抱歉，当前网络繁忙，请稍后再试试，或联系客服人员';
                alert(msg);
            }
        })
    }

    function main() {
        fetch(`index`).then(function(response) {
            return response.text();
        }).then(function(html) {
            var params = html.match(/getGift\((\d*?)\)/);
            var giftId = params[1];

            var div = document.createElement("div");
            div.innerHTML = '领取每日礼盒'
            div.addEventListener('click', () => {
                getGift(giftId)
            })
            div.style = 'display: block;width: 211px;height: 60px;background: url("//image-1251917893.cos.ap-guangzhou.myqcloud.com/privilege/a20200518cafe/ossweb-img/btn_lq.png") no-repeat;text-align: center;line-height: 60px;font-size: 22px;color: rgb(51, 51, 51);font-weight: bold;font-style: italic;position: absolute;right: 0;cursor: pointer;'

            var target = document.querySelector(".bg2")
            target.parentElement.insertBefore(div, target)
        })
    }

    main()
});
