// ==UserScript==
// @name         Restore Button Sanity
// @namespace    https://greasyfork.org/users/30701-justins83-waze
// @version      0.1.03
// @description  Restore undo & redo buttons to icons, fix the damn reload button to the correct icon
// @author       JustinS83
// @include      https://www.waze.com/editor*
// @include      https://www.waze.com/*/editor*
// @include      https://beta.waze.com*
// @exclude      https://www.waze.com/user/editor*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34910/Restore%20Button%20Sanity.user.js
// @updateURL https://update.greasyfork.org/scripts/34910/Restore%20Button%20Sanity.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function bootstrap(tries) {
        tries = tries || 1;

        if (window.W &&
            window.W.map &&
            window.W.model &&
            window.W.loginManager.user &&
            $) {
            init();
        } else if (tries < 1000) {
            setTimeout(function () {bootstrap(tries++);}, 200);
        }
    }

    bootstrap();

    function init()
    {
        $('.waze-icon-reload').removeClass('reload');
        $('.waze-icon-reload span').addClass('fa fa-refresh fa-lg');
        $('.waze-icon-reload span')[0].innerHTML = "";

        $('.waze-icon-undo').removeClass('undo');
        $('.waze-icon-undo span').addClass('fa fa-undo fa-lg');
        $('.waze-icon-undo span')[0].innerHTML = "";

        $('.waze-icon-redo').removeClass('redo');
        $('.waze-icon-redo span').addClass('fa fa-repeat fa-lg');
        $('.waze-icon-redo span')[0].innerHTML = "";

        let extprovobserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                //console.log(mutation);
                if ($(mutation.target).hasClass('waze-icon-reload')){
                    $('.waze-icon-reload').removeClass('reload');
                    $('.waze-icon-reload span').addClass('fa fa-refresh fa-lg');
                    $('.waze-icon-reload span')[0].innerHTML = "";
                }
                else if($(mutation.target).hasClass('waze-icon-undo')){
                    $('.waze-icon-undo').removeClass('undo');
                    $('.waze-icon-undo span').addClass('fa fa-undo fa-lg');
                    $('.waze-icon-undo span')[0].innerHTML = "";
                }
                else if($(mutation.target).hasClass('waze-icon-redo')){
                    $('.waze-icon-redo').removeClass('redo');
                    $('.waze-icon-redo span').addClass('fa fa-repeat fa-lg');
                    $('.waze-icon-redo span')[0].innerHTML = "";
                }
            });
        });

        extprovobserver.observe(document.getElementById('edit-buttons'), { childList: true, subtree: true });
    }
})();