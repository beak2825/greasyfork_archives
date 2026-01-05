// ==UserScript==
// @name         imgur animated upvote/downvote fireworks
// @namespace    http://porath.org/
// @version      0.25
// @description  adds an animation to upvote/downvote
// @author       porath
// @match        http://imgur.com/*
// @match        https://imgur.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10789/imgur%20animated%20upvotedownvote%20fireworks.user.js
// @updateURL https://update.greasyfork.org/scripts/10789/imgur%20animated%20upvotedownvote%20fireworks.meta.js
// ==/UserScript==

$('#mainUpArrow').append('<div id="upvote_firework" style="display: none; position: absolute"><img src="//i.imgur.com/YEzlDPG.png" /></div>');
$('#mainDownArrow').append('<div id="downvote_firework" style="display: none; position: absolute"><img src="//i.imgur.com/5WTwxi9.png" /></div>');

$('#mainUpArrow').on('click', function () {
    if ($('#mainUpArrow').hasClass('pushed')) {
        return;
    }

    $('#upvote_firework').css("top", -39);
    $('#upvote_firework').css("left", -80);

    $('#upvote_firework').show();

    window.setTimeout(function() { // wait, then hide the animation
        $('#upvote_firework').hide();
    }, 1000);
});

$('#mainDownArrow').on('click', function () {
    if ($('#mainDownArrow').hasClass('pushed')) {
        return;
    }

    $('#downvote_firework').css("top", -39);
    $('#downvote_firework').css("left", -39);

    $('#downvote_firework').show();

    window.setTimeout(function() { // wait, then hide the animation
        $('#downvote_firework').hide();
    }, 1000);
});

function animateCommentUpvote (a) {
    if (a.parent().find('.comment_upvote').length == 0) {
        a.closest('.up').append('<div class="comment_upvote" style="display: none; position: absolute; width: 80px; height: 45px;"><img style="width: 80px !important; height: 45px !important;" src="//i.imgur.com/YEzlDPG.png" /></div>');
    }

    a.parent().find('.comment_upvote').css("top", -10);
    a.parent().find('.comment_upvote').css("left", -15);

    a.parent().find('.comment_upvote').show();

    window.setTimeout(function() { // wait, then hide the animation
        $('.comment_upvote').hide();
    }, 1000);
};

function animateCommentDownvote (a) {
    if (a.parent().find('.comment_downvote').length == 0) {
        a.closest('.up').append('<div class="comment_downvote" style="display: none; position: absolute; width: 80px; height: 45px;"><img style="width: 80px !important; height: 45px !important;" src="//i.imgur.com/5WTwxi9.png" /></div>');
    }

    a.parent().find('.comment_downvote').css("top", -10);
    a.parent().find('.comment_downvote').css("left", -15);

    a.parent().find('.comment_downvote').show();

    window.setTimeout(function() { // wait, then hide the animation
        $('.comment_downvote').hide();
    }, 1000);
};

$('#comments-container').on('click', '.icon-upvote', function () {
    if ($(this).parent().hasClass('pushed')) {
        return;
    }

    animateCommentUpvote($(this));
});

$('#comments-container').on('click', '.up.arrow', function () {
    if ($(this).hasClass('pushed')) {
        return;
    }

    animateCommentUpvote($(this).find('.icon-upvote'));
});

$('#comments-container').on('click', '.icon-downvote', function () {
    if ($(this).parent().hasClass('pushed')) {
        return;
    }

    animateCommentDownvote($(this));
});

$('#comments-container').on('click', '.down.arrow', function () {
    if ($(this).parent().hasClass('pushed')) {
        return;
    }

    animateCommentDownvote($(this).find('.icon-downvote'));
});