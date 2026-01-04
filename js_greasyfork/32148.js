// ==UserScript==
// @name         Czyściciel Mirko
// @version      1.7
// @description  Czyści Mirko z wpisów bez tagów, opcionalnie pozwala także ukrywać wpisy zielonek. 
// @author       Rst
// @match        https://www.wykop.pl/mikroblog/*
// @match        https://www.wykop.pl/wpis/*
// @match        https://www.wykop.pl/link/*
// @match        https://www.wykop.pl/tag/*
// @match        https://www.wykop.pl/ludzie/*
// @match        https://www.wykop.pl/ustawienia/
// @namespace https://greasyfork.org/users/13380
/*jshint multistr: true */
// @downloadURL https://update.greasyfork.org/scripts/32148/Czy%C5%9Bciciel%20Mirko.user.js
// @updateURL https://update.greasyfork.org/scripts/32148/Czy%C5%9Bciciel%20Mirko.meta.js
// ==/UserScript==

$(function(){

    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    var cookie_hide_greeners = 'r_hide_greeners',
        cookie_hide_greeners_in_comments = 'r_hide_greeners_in_comments',
        cookie_hide_without_tag = 'r_hide_without_tag',
        cookie_hide_whole_if_blacklisted = 'r_hide_whole_if_blacklisted';

    var MirkoCleaner = {

        init: function() {
            this.hidePosts();
            this.hideComments();
            this.handleAjax();
            this.addCleanerOptions();
        },
        hidePosts: function() {
            var posts = $('#itemsStream > li'),
                disableGreeners = this.isOptionEnabled(cookie_hide_greeners),
                disableWithoutTag = this.isOptionEnabled(cookie_hide_without_tag),
                url = window.location.href;

            if(url.indexOf('https://www.wykop.pl/mikroblog/') != -1 ) {
                $(posts).each(function(){
                    var isTagged = $(this).find('.text .showTagSummary').length,
                        user = $(this).find('> .wblock .author .showProfileSummary');

                    if(disableWithoutTag && !isTagged) {
                        $(this).css({'display' : 'none'});
                    }

                    if(disableGreeners && $(user).hasClass('color-0')) {
                        $(this).css({'display' : 'none'});
                    }
                });
            }
        },
        hideComments: function(){
            var comments = $('#itemsStream .sub > li, #itemsStream.comments-stream > li'),
                disableGreenersInComments = this.isOptionEnabled(cookie_hide_greeners_in_comments),
                hideCommentIfBlacklisted = this.isOptionEnabled(cookie_hide_whole_if_blacklisted);

            $(comments).each(function() {
                var user = $(this).find('> .wblock .author .showProfileSummary');

                if(disableGreenersInComments && $(user).hasClass('color-0')) {
                    $(this).css({'display' : 'none'});
                }
                if(hideCommentIfBlacklisted && $(this).find('> .wblock').hasClass('hidden-comment')) {
                    $(this).css({'display' : 'none'});
                }
            });
        },
        handleAjax: function(){
            var $this = this;
            var target = document.querySelector('#itemsStream');

            if(target) {
                var observer = new MutationObserver(function(mutations) {
                    $this.hidePosts();
                    $this.hideComments();
                });

                var config = { attributes: false, childList: true, characterData: true, subtree: true };

                observer.observe(target, config);
            }
        },
        addCleanerOptions: function(){
            var checked = {};
            if(this.isOptionEnabled(cookie_hide_greeners)) {
                checked.greeners = 'checked';
            }

            if(this.isOptionEnabled(cookie_hide_greeners_in_comments)) {
                checked.greeners_in_comments = 'checked';
            }

            if(this.isOptionEnabled(cookie_hide_without_tag)) {
                checked.without_tag = 'checked';
            }

            if(this.isOptionEnabled(cookie_hide_whole_if_blacklisted)) {
                checked.whole_if_blacklisted = 'checked';
            }

            $('.settings fieldset:first .space').prepend('<div class="row"><input class="checkbox checkbox--r-cleaner" type="checkbox" name="r_hide_whole_if_blacklisted" id="r_hide_whole_if_blacklisted" ' + checked.whole_if_blacklisted + '><label class="inline" for="r_hide_whole_if_blacklisted">ukrywaj całe komentarze osób, które masz na czarnolisto</label></div>');
            $('.settings fieldset:first .space').prepend('<div class="row"><input class="checkbox checkbox--r-cleaner" type="checkbox" name="r_hide_greeners_in_comments" id="r_hide_greeners_in_comments" ' + checked.greeners_in_comments + '><label class="inline" for="r_hide_greeners_in_comments">ukrywaj komentarze zielonek</label></div>');
            $('.settings fieldset:first .space').prepend('<div class="row"><input class="checkbox checkbox--r-cleaner" type="checkbox" name="r_hide_greeners" id="r_hide_greeners" ' + checked.greeners + '><label class="inline" for="r_hide_greeners">ukrywaj posty zielonek</label></div>');
            $('.settings fieldset:first .space').prepend('<div class="row"><input class="checkbox checkbox--r-cleaner" type="checkbox" name="r_hide_without_tag" id="r_hide_without_tag" ' + checked.without_tag + '><label class="inline" for="r_hide_without_tag">ukrywaj posty bez tagów</label></div>');
            this.handleChangeOptions();
        },
        handleChangeOptions: function(){
            $(document).on('change', '.checkbox--r-cleaner', function(){
                var name = this.id,
                    isChecked = this.checked;

                setCookie(name, isChecked, 365);
            });
        },
        isOptionEnabled: function(name){
            if(getCookie(name) == 'true') {
                return true;
            }
            return false;
        }
    };

    MirkoCleaner.init();

});