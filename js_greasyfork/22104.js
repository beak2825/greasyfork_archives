// ==UserScript==
// @name         Steam DLC wishlister
// @description  Add all DLCs on wishlist by one click. Also you can remove game from wishlist directly from game store page.
// @author       Bladito
// @version      0.4.3
// @homepageURL  https://greasyfork.org/en/users/55159-bladito
// @match        https://store.steampowered.com/app/*
// @namespace    Bladito/steam-dlc-wishlister
// @require      http://code.jquery.com/jquery-latest.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/22104/Steam%20DLC%20wishlister.user.js
// @updateURL https://update.greasyfork.org/scripts/22104/Steam%20DLC%20wishlister.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    addDlcButton();

    if ($('#add_to_wishlist_area').length === 0 && $('.game_area_already_owned').length === 0) { // game is wishlisted and not owned
        addButton_removeFromWishlist();
    }
    $('#add_to_wishlist_area').click(addButton_removeFromWishlist);

    //-------------------------------------------------------------------------------------------------

    // Used timeout because sometimes userdata is not cached and steam loads it after I add buttons
    // (http://store.steampowered.com/dynamicstore/userdata/?id=12345&v=12345)
    function addDlcButton() {
        setTimeout(function() {
            if ($('.game_area_dlc_row').length === $('.game_area_dlc_row.ds_wishlist').length) {
                addButton_removeAllDlcsFromWishlist();
            } else {
                addButton_addAllDlcsToWishlist();
            }
        }, 1000);
    }

    function addButton_removeFromWishlist() {
        var unwishlisterButton = $('<a class="btnv6_blue_hoverfade btn_medium queue_btn_inactive"><span>Remove from wishlist</span></a>');
        unwishlisterButton.click(removeFromWishlist);
        $('.queue_actions_ctn').prepend(unwishlisterButton);
    }

    function addButton_addAllDlcsToWishlist() {
        var wishlisterButton = $('<a class="bladito-steam-wishlist btnv6_blue_blue_innerfade btn_medium"><span>Add all DLC to Wishlist</span></a>');
        wishlisterButton.click(addAllDlcsToWishlist);
        $('#dlc_purchase_action').prepend(wishlisterButton);
    }

    function addButton_removeAllDlcsFromWishlist() {
        var unwishlisterButton = $('<a class="bladito-steam-unwishlist btnv6_blue_blue_innerfade btn_medium"><span>Remove all DLC from Wishlist</span></a>');
        unwishlisterButton.click(removeAllDlcsFromWishlist);
        $('#dlc_purchase_action').prepend(unwishlisterButton);
    }

    function addAllDlcsToWishlist() {
        $('.game_area_dlc_row').not('.ds_wishlist').each(function() {
            var $this = $(this);
            unsafeWindow.AddToWishlist($this.data('ds-appid'));
            $this.addClass('ds_wishlist').addClass('ds_flagged');
            $this.append('<div class="ds_flag ds_wishlist_flag">ON WISHLIST&nbsp;&nbsp;</div>');
        }).promise().done(function(){
            $('.bladito-steam-wishlist').remove();
            addButton_removeAllDlcsFromWishlist();
        });
    }

    function removeAllDlcsFromWishlist() {
        $('.game_area_dlc_row.ds_wishlist').each(function() {
            var $this = $(this);
            unsafeWindow.GDynamicStore.ModifyWishlist($this, $this.data('ds-appid'), true, function() {
                $this.removeClass('ds_wishlist').removeClass('ds_flagged');
                $('.ds_flag.ds_wishlist_flag', $this).remove();
            }, function(){
                console.log('Error occured while trying to unwishlist DLC');
            });
        }).promise().done(function(){
            $('.bladito-steam-unwishlist').remove();
            addButton_addAllDlcsToWishlist();
        });
    }

    function removeFromWishlist() {
        var data = {
            sessionid: $('form input[name="sessionid"]').val(),
            action: 'remove',
            appid: window.location.href.match(/https?:\/\/store\.steampowered\.com\/app\/([^\/]+)/)[1]
        };
        $.post("https://store.steampowered.com/api/removefromwishlist", data, function() {
            window.location.reload();
        });
    }

})(jQuery);
