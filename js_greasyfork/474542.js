// ==UserScript==
// @name         LZTProfileHideButton
// @namespace    MeloniuM/LZT
// @version      1.2
// @description  Add hide button to profile page
// @author       MeloniuM/LZT
// @license      MIT
// @match        http*://zelenka.guru/*
// @match        http*://lolz.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474542/LZTProfileHideButton.user.js
// @updateURL https://update.greasyfork.org/scripts/474542/LZTProfileHideButton.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!$('.member_view').length) return;//включаем только в темах и в профиле

    $("<style>").prop("type", "text/css").html(".item .hiddenReplyIcon {background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' stroke='rgb(148, 148, 148)' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round' class='css-i6dzq1'%3E%3Cpath d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24'%3E%3C/path%3E%3Cline x1='1' y1='1' x2='23' y2='23'%3E%3C/line%3E%3C/svg%3E\");}").appendTo("head");
    $("<style>").prop("type", "text/css").html(".item:hover .hiddenReplyIcon {background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' stroke='rgb(0, 186, 120)' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round' class='css-i6dzq1'%3E%3Cpath d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24'%3E%3C/path%3E%3Cline x1='1' y1='1' x2='23' y2='23'%3E%3C/line%3E%3C/svg%3E\");}").appendTo("head");

    XenForo.ProfileHiddenReply = function($button) {
        var $commentArea;
        var insertUsername = function insertUsername(username, $username, $commentArea) {
            var ed = XenForo.getEditorInForm($commentArea);
            if (!ed) {
                return;
            }
            $username.find("span:first").prepend("@");
            var html = $username.wrapInner('<span class="username" spellcheck="false"></span>').html();

            if (ed.$oel) {
                Lolzteam.EditorHelpers.focus(ed);
                Lolzteam.EditorHelpers.insertFix(ed);
                ed.xfHide.insert({
                    tag: 'users',
                    option: username,
                    content: html + ",&nbsp" + FroalaEditor.MARKERS
                })
                ed.selection.restore()
            } else {
                ed.val(ed.val() + '[USERS=' + username + ']' + "@" + username + ", "+ '[/USERS]');
            }
        };
        $button.on("click", function(e) {
            e.preventDefault();
            var $commentButton = $button.closest(".messageSimple").find(".LztCommentPoster");
            var $username = $button.closest(".comment, .messageSimple").find(".username").first().clone();
            $commentArea = $($commentButton.data("commentarea"));
            if ($commentArea.find(".redactor_box").length) {
                insertUsername($button.data("username"), $username, $commentArea);
            } else {
                $commentButton.trigger("click");
                var timer = setInterval(function() {
                    if ($commentArea.find(".simpleRedactor").length) {
                        insertUsername($button.data("username"), $username, $commentArea);
                        clearInterval(timer);
                    }
                }, 200);
            }
        });
    };

    XenForo.register('._profileHiddenReplyButton', 'XenForo.ProfileHiddenReply')

    const $templateMessageButton = $('<a style="margin-left: 8px;" class="_profileHiddenReplyButton item control PostCommentButton" data-commentarea="#commentSubmit-{id}"><span class="icon hiddenReplyIcon"></span></a>');

    function addButton(controls){
        const post = controls.closest('.comment, .messageSimple');
            const id = post[0].id.split('-')[-1];
            const button = $templateMessageButton.clone();
            button.attr('data-commentarea', '#commentSubmit-' + id);
            button.attr('href', 'profile-posts/' + id + '/comment');
            controls.append(button);
            const profileHiddenReply = new XenForo.ProfileHiddenReply(button);

            if (button.data('XenForo.ProfileHiddenReply') == undefined) button.data('XenForo.ProfileHiddenReply', profileHiddenReply);

            button.data('username', post.find(".username.poster").text());
    }

    $(document).ready(function(){
        $('.messageSimple .publicControls:not(.publicControls ._profileHiddenReplyButton').each(function(index){
            addButton($(this));
        });
    });

    $('.messageSimpleList').on('DOMNodeInserted', function(event) {//при добавлении комментария
        if (!$(event.target).is('.comment, .messageSimple')) return;

        $(event.target).find('.messageSimple .publicControls:not(.publicControls ._profileHiddenReplyButton)').each(function(index){
            addButton($(this));
        });
    });
})();