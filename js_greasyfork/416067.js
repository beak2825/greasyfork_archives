// ==UserScript==
// @name WSM Skip Core Values Modal
// @namespace WSM Scripts
// @description Skip Core Values Modal in WSM
// @icon https://wsm.sun-asterisk.vn/assets/wsm_logo_name-91525b18c1f7674362de380d12dc3fcb38026181774573818e847fce57cec573.png
// @run-at document-start
// @match *://wsm.sun-asterisk.vn/*
// @grant none
// @version 1.0.3
// @downloadURL https://update.greasyfork.org/scripts/416067/WSM%20Skip%20Core%20Values%20Modal.user.js
// @updateURL https://update.greasyfork.org/scripts/416067/WSM%20Skip%20Core%20Values%20Modal.meta.js
// ==/UserScript==

document.addEventListener('DOMContentLoaded', function (event) {
    var targetNode = document.documentElement || document.body;
    var config = { attributes: true, childList: true, subtree: true };
    var callback = function (mutations) {
        var count = 0;
        for (var i = 0; i < mutations.length; i++) {
            var mutation = mutations[i];
            if (!count) {
                count++;
                $('#remind-change-profile-modal').modal('hide');
            }
        }
    };
    var observer = new MutationObserver(callback);
    (targetNode instanceof Element || targetNode instanceof HTMLDocument) && observer.observe(targetNode, config);
    setTimeout(function () {
        if ($('.container.container-f2a').is(':hidden')) {
            $('.wsm-btn.btn-login').trigger('click');
            $('#user_remember_me').trigger('click');

            console.log('timeout2000');
            setTimeout(function () {
                if ($('#user_email').val() && $('#user_password').val()) {
                    console.log($('#user_email').val());
                    $('#wsm-login-button').trigger('click');
                    setTimeout(function () {
                        $('#close-core-values-modal').removeClass('hidden').trigger('click');
                    }, 500);
                }
            }, 5000);
        }

        $('#user_otp_attempt').on('keyup', function (event) {
            var otp = $(event.target).val();
            if (otp && otp.length === 6) {
                $('#btn-login-f2a').trigger('click');
            }
        });
    }, 2000);
});
