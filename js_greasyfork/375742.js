// ==UserScript==
// @name         Yet Another Enhanced Steam
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Enhanced Steam!
// @author       mout.me
// @match        https://store.steampowered.com/app/*
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/375742/Yet%20Another%20Enhanced%20Steam.user.js
// @updateURL https://update.greasyfork.org/scripts/375742/Yet%20Another%20Enhanced%20Steam.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var log = `██╗   ██╗███████╗████████╗     █████╗ ███╗   ██╗ ██████╗ ████████╗██╗  ██╗███████╗██████╗
╚██╗ ██╔╝██╔════╝╚══██╔══╝    ██╔══██╗████╗  ██║██╔═══██╗╚══██╔══╝██║  ██║██╔════╝██╔══██╗
 ╚████╔╝ █████╗     ██║       ███████║██╔██╗ ██║██║   ██║   ██║   ███████║█████╗  ██████╔╝
  ╚██╔╝  ██╔══╝     ██║       ██╔══██║██║╚██╗██║██║   ██║   ██║   ██╔══██║██╔══╝  ██╔══██╗
   ██║   ███████╗   ██║       ██║  ██║██║ ╚████║╚██████╔╝   ██║   ██║  ██║███████╗██║  ██║
   ╚═╝   ╚══════╝   ╚═╝       ╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝

███████╗███╗   ██╗██╗  ██╗ █████╗ ███╗   ██╗ ██████╗███████╗██████╗     ███████╗████████╗███████╗ █████╗ ███╗   ███╗
██╔════╝████╗  ██║██║  ██║██╔══██╗████╗  ██║██╔════╝██╔════╝██╔══██╗    ██╔════╝╚══██╔══╝██╔════╝██╔══██╗████╗ ████║
█████╗  ██╔██╗ ██║███████║███████║██╔██╗ ██║██║     █████╗  ██║  ██║    ███████╗   ██║   █████╗  ███████║██╔████╔██║
██╔══╝  ██║╚██╗██║██╔══██║██╔══██║██║╚██╗██║██║     ██╔══╝  ██║  ██║    ╚════██║   ██║   ██╔══╝  ██╔══██║██║╚██╔╝██║
███████╗██║ ╚████║██║  ██║██║  ██║██║ ╚████║╚██████╗███████╗██████╔╝    ███████║   ██║   ███████╗██║  ██║██║ ╚═╝ ██║
╚══════╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝╚══════╝╚═════╝     ╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝

██████╗ ██╗   ██╗    ███╗   ███╗ ██████╗ ██╗   ██╗████████╗███╗   ███╗███████╗
██╔══██╗╚██╗ ██╔╝    ████╗ ████║██╔═══██╗██║   ██║╚══██╔══╝████╗ ████║██╔════╝
██████╔╝ ╚████╔╝     ██╔████╔██║██║   ██║██║   ██║   ██║   ██╔████╔██║█████╗
██╔══██╗  ╚██╔╝      ██║╚██╔╝██║██║   ██║██║   ██║   ██║   ██║╚██╔╝██║██╔══╝
██████╔╝   ██║       ██║ ╚═╝ ██║╚██████╔╝╚██████╔╝   ██║██╗██║ ╚═╝ ██║███████╗
╚═════╝    ╚═╝       ╚═╝     ╚═╝ ╚═════╝  ╚═════╝    ╚═╝╚═╝╚═╝     ╚═╝╚══════╝
                                                                                                                    `

    console.log(log);

    var domTemplate = {
        add_to_wishlist_area: `<div id="add_to_wishlist_area" style="display: none;">
  <a class="btnv6_blue_hoverfade btn_medium" href="javascript:AddToWishlist( 535480, 'add_to_wishlist_area', 'add_to_wishlist_area_success', 'add_to_wishlist_area_fail', '1_5_9__407' );"
    data-tooltip-text="在您愿望单中的物品正式发布或特价销售时获取邮件通知">
    <span>添加至您的愿望单</span>
  </a>
</div>`,
        add_to_wishlist_area_success: `<div id="add_to_wishlist_area_success">
  <a href="" class="btnv6_blue_hoverfade btn_medium queue_btn_active"
    data-tooltip-text="该产品已在您的愿望单中。点击取消收藏。">
    <span><img src="https://store.st.dl.bscstorage.net/public/images/v6/ico/ico_selected.png" border="0">
      已在愿望单中</span>
  </a>
</div>`,
        add_to_wishlist_area_fail: `<div id="add_to_wishlist_area_fail" style="display: none;">
  <b>哎呀，很抱歉！</b>
</div>`,
        remove_btn: ` <div class="queue_control_button queue_btn_remove_from_wishlist">&nbsp;<div class="btnv6_blue_hoverfade  btn_medium queue_btn_inactive" style="" data-tooltip-text="这个按钮是油猴脚本添加的。"><span>从愿望单移除</span></div></div> `
    }

    function getCookie(key) {
        var name = key + "=";
        var cookieArray = document.cookie.split(';');
        for (var i = 0; i < cookieArray.length; i++) {
            var c = cookieArray[i].trim();
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    }

    $(document).ready(function () {
        var removeBtn = $(domTemplate.remove_btn);
        $('.queue_btn_ignore').after(removeBtn);

        // 移除跳转到愿望单的链接
        $('a.queue_btn_active').attr('href', '');

        // 判断如果已经在愿望单则恢复添加愿望单按钮
        if($('a.queue_btn_active').parent().attr('id') !== 'add_to_wishlist_area_success') {
            // 已在愿望单，替换按钮
            console.log('已在愿望单');
            $('a.queue_btn_active').remove();
            $('.queue_actions_ctn').prepend(domTemplate.add_to_wishlist_area, domTemplate.add_to_wishlist_area_success, domTemplate.add_to_wishlist_area_fail);
        } else {
            // 未添加到愿望单
            console.log('未添加到愿望单');
        }

        function handleRemove(event){
            event.preventDefault();
            var data = {
                sessionid: getCookie('sessionid'),
                appid: window.location.pathname.split('/')[2]
            }

            $.post( "//store.steampowered.com/api/removefromwishlist", data, function() {
                // alert( "success" );
                $('#add_to_wishlist_area').css('display', 'inline-block');
                $('#add_to_wishlist_area_success').css('display', 'none');
            })
                .done(function() {
                // alert( "second success" );
            })
                .fail(function() {
                alert( "error" );
            })
                .always(function() {
                // alert( "finished" );
            });
        }

        removeBtn.click(handleRemove);
        $('a.queue_btn_active').click(handleRemove);

    });
})();