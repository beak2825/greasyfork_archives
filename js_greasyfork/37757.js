// ==UserScript==
// @name         Penny-Arcade Forums Tab-Index Fix
// @namespace    https://greasyfork.org/en/users/162009-delmain
// @author       delmain
// @version      0.3.0
// @description  Temp fix for tabbing issue on the forums
// @match        https://forums.penny-arcade.com/discussion/*
// @match        https://forums.penny-arcade.com/messages/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37757/Penny-Arcade%20Forums%20Tab-Index%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/37757/Penny-Arcade%20Forums%20Tab-Index%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function() {
        $('.TextBoxWrapper').on('keydown', 'textarea', moveToSubmitHandler);
    });

    $(document).on('EditCommentFormLoaded', function(event, element) {
        $(element).find('.TextBoxWrapper').on('keydown', 'textarea', moveToSubmitHandler);
    });

    function moveToSubmitHandler(e)
    {
        var target = e.target;
        var keyCode = e.keyCode || e.which;

        if (keyCode == 9) {
            e.preventDefault();
            var tg = $(target).closest('form');
            var bu = tg.find('#Form_PostComment,#Form_SendMessage,#Form_SaveComment');
            bu.focus();
        }
    }
})();