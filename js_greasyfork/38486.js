// ==UserScript==
// @name         TCGPlayer
// @namespace    http://MNSweet.com/
// @version      1.0
// @description  Adds wishlist functionality to TCGPlayer.com. Saves locally to browser's localstorage.
// @author       MNSweet
// @match        https://shop.tcgplayer.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/38486/TCGPlayer.user.js
// @updateURL https://update.greasyfork.org/scripts/38486/TCGPlayer.meta.js
// ==/UserScript==

function addToWishlist(name,url) {
}

(function() {
    'use strict';
    jQuery(document).ready(function($) {
        if (typeof(Storage) !== "undefined") {
            var item = $('.product-details__name').text().trim();
            if(localStorage.getItem("wishlist") === null) {localStorage.setItem("wishlist",'{}');}
            if(item in JSON.parse(localStorage.getItem("wishlist"))) {
                $('.page--product-details .product-details__image ')
                    .append('<a href="#" class="showWishlist btn btn--add-to-cart" title="'+$('.product-details__name').text().trim()+'" rel="'+encodeURIComponent($('#cardImage').attr('src'))+'" ref="'+encodeURIComponent(window.location.href)+'">Open Wishlist</a>');

            }else {
                $('.page--product-details .product-details__image ')
                    .append('<a href="#" class="addToWishlist btn btn--add-to-cart" title="'+$('.product-details__name').text().trim()+'" rel="'+encodeURIComponent($('#cardImage').attr('src'))+'" ref="'+encodeURIComponent(window.location.href)+'">Add to Wishlist</a>');
            }
            $('.dropdown-menu--acount .dropdown-item:nth-child(3)').after('<a class="dropdown-item" id="showWishlist" class="showWishlist" href="#">Wishlist</a>');
        }
        $(document).on("click", ".addToWishlist", function() {
            event.preventDefault();
            var wish = $(this);
            if(wish.text() == 'ADDED') {return;}
            var wishlist = JSON.parse(localStorage.getItem("wishlist"));
            wishlist[wish.attr('title')] = {
                'qty':1,
                'notes':'',
                'url':wish.attr('ref'),
                'img':wish.attr('rel')
            };
            localStorage.setItem("wishlist", JSON.stringify(wishlist));
            wish.css({
                'color':'#fff'
            });
            wish.removeClass('addToWishlist').addClass('showWishlist').text('Open Wishlist');
            showWishlist();
        });
        $(document).on("click", ".showWishlist", showWishlist);
        function showWishlist() {
            event.preventDefault();
            var wishlist = JSON.parse(localStorage.getItem("wishlist"));
            var items = renderWishlist(wishlist);
            $('body').append('<div id="wishlistModal"><h2>Wishlist</h2>'+items+'<a href="#" id="wishlistClose" style="position: fixed;top: 5vh;left: calc( 95vw - 41px );border-right: 41px solid #000;background: #000;color:#fff;width: 25px;text-indent: 9px;border-bottom-left-radius: 20px;height: 25px;">X</a>'+'</div>');
            $('#wishlistModal').css({
                'width': '90vw',
                'height': '90vh',
                'position': 'fixed',
                'text-align':'center',
                'top': '5vh',
                'left': '5vw',
                'border': '1px solid #999999',
                'z-index': '1000',
                'overflow':'auto',
                'background': 'rgba(255,255,255,0.97)'
            });
            $('.wishlistRemove').css({
                'position': 'absolute',
                'top': '4px',
                'right': '4px',
                'background':'#fff',
                'width': '30px',
                'text-indent': '10px',
                'line-height': '31px',
                'border-radius': '20px 0 0 20px',
                'height':'30px',
                'color': '#000)'
            });
            $('.wishlistRemove:after').css({
                'content': '',
                'display': 'table',
                'clear': 'both'
            });
        }
        function renderWishlist(wishlist){
            var items = '';
            for(var item in wishlist) {
                items += '<div class="wishlist-item" style="display:inline-block;text-align:left;width:33.3%;padding:5px;box-sizing:border-box;position:relative;border: 1px solid #ddd;border-style: none solid solid none;">'+
                    '<h6 style="background: #000;padding: 6px;"><a class="wishlist-item-header" style="color:#fff;" href="'+decodeURIComponent(wishlist[item].url)+'">'+item+'</a></h6>'+
                    '<a class="wishlist-item-img-link" style="display:block;width:150px;height:234px;overflow:hidden;float:left;margin-right:10px;" href="'+decodeURIComponent(wishlist[item].url)+'">'+
                    '<img style="display:block;" width="150" src="'+decodeURIComponent(wishlist[item].img)+'"/>'+
                    '</a>'+
                    '<strong>Desired Quantity:</strong> <input rel="'+item+'" class="wishlist-item-qty" type="number" style="width:3em;background:transparent;border:0;" value="'+wishlist[item].qty+'"/><br/>'+
                    '<strong>Notes:</strong><br/><textarea rel="'+item+'" class="wishlist-item-notes" style="resize: none;width: calc(100% - 160px);height: calc(234px - 75px);border:1px solid #f1f1f1;">'+wishlist[item].notes+'</textarea>'+
                    '<a href="#" class="wishlistRemove" title="'+item+'">X</a>'+
                    '</div>';
            }
            return items;
        }
        $(document).on("click", ".wishlistRemove", function() {
            event.preventDefault();
            var wish = $(this);
            var wishlist = JSON.parse(localStorage.getItem("wishlist"));
            delete wishlist[wish.attr('title')];
            var items = renderWishlist(wishlist);
            $('#wishlistModal').html('<h2>Wishlist</h2>'+items+'<a href="#" id="wishlistClose" style="position: fixed;top:5vh;left:calc( 95vw - 41px );border-right: 41px solid #000;background: #000;color:#fff;width: 25px;text-indent: 9px;border-bottom-left-radius: 20px;height: 25px;">X</a>');
            localStorage.setItem("wishlist", JSON.stringify(wishlist));

            $('.wishlistRemove').css({
                'position': 'absolute',
                'top': '4px',
                'right': '4px',
                'background':'#fff',
                'width': '30px',
                'text-indent': '10px',
                'line-height': '31px',
                'border-radius': '20px 0 0 20px',
                'height':'30px',
                'color': '#000'
            });
            $('.wishlistRemove:after').css({
                'content': '',
                'display': 'table',
                'clear': 'both'
            });
            if($('.product-details__name').text().trim() == wish.attr('title') ) {
                $('.showWishlist.btn--add-to-cart').removeClass('showWishlist').addClass('addToWishlist').text('Add to Wishlist');
            }
        });
    });
    $(document).on("change", ".wishlist-item-qty", function() {
        var wish = $(this);
        var wishlist = JSON.parse(localStorage.getItem("wishlist"));
        wishlist[wish.attr('rel')].qty = wish.val();
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
    });
    $(document).on("keyup", ".wishlist-item-notes", function() {
        var wish = $(this);
        var wishlist = JSON.parse(localStorage.getItem("wishlist"));
        wishlist[wish.attr('rel')].notes = wish.val();
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
    });
    $(document).on("click", "#wishlistClose", function() {
        $('#wishlistModal').remove();
    });

})();
