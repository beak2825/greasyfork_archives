// ==UserScript==
// @name        AO3: Add gifs to comments
// @description Add a gif to a comment on AO3
// @namespace
// @author	starrybouquet
// @version	0.2
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js
// @include     http://*archiveofourown.org/*
// @include     https://*archiveofourown.org/*
// @namespace https://greasyfork.org/users/695969
// @downloadURL https://update.greasyfork.org/scripts/414223/AO3%3A%20Add%20gifs%20to%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/414223/AO3%3A%20Add%20gifs%20to%20comments.meta.js
// ==/UserScript==


$(document).ready(function () {

    var DEBUG = false;

    var current_version = '0.2';

    // regex for url checking
    var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression);

    // create entry form
    var gif_div = '<div class="gifentry"><br/><br/><form><label for="gifaddress">GIF link:</label><input type="text" name="gifaddress" class="gifaddress"></form><button class="addGIF">Add this GIF</button></div>';
    var main = $('#main');

    // if it's the first time after an update
    // addNotice();

    // add a gif entry to every comment form
    $(".new_comment").each(function ( index ) {
        $(this).find(".submit.actions").before(gif_div);
    });

    main.on("click", ".addGIF", function (e) {
        e.preventDefault();
        var url = $(this).parent().find('input.gifaddress').val();

        var comment_textbox = $(this).parentsUntil('div.comment').find("textarea.comment_form");
        var current_comment = comment_textbox.val();
        var comment_edited = current_comment + '<img src="' + url + '"/>';

        if (url.match(regex)){
            comment_textbox.val(comment_edited);
        }
    });

    $("#comments_placeholder").on("click",".comment_form", function (e) {
        console.log('New comment form clicked');
        var comment_heading = $(this).parents("form.new_comment").find(".submit.actions");
                                                   // find("h4");
        if (comment_heading.parent().find(".gifentry").length === 0) {
            // console.log('adding entry box');
            comment_heading.before(gif_div);
        } else {
            // console.log('entry box already exists');
        }
    });

});