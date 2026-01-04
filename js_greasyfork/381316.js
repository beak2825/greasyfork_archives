// ==UserScript==
// @name         Vimeo video buttons above description
// @namespace    1N07
// @version      0.1
// @description  Adds the video buttons from the video overlay to above the description
// @author       1N07
// @include      /^https?:\/\/vimeo.com\/\d+$/
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381316/Vimeo%20video%20buttons%20above%20description.user.js
// @updateURL https://update.greasyfork.org/scripts/381316/Vimeo%20video%20buttons%20above%20description.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $("head").append(`<style>

.customButton svg {
width: 1.2rem;
}

.customButton {
min-width: 50px;
}

#watchLaterButton svg circle {
stroke: black;
}

	</style>`);

    var likesvg = `<svg class="like-icon" viewBox="0 0 110 81" preserveAspectRatio="xMidYMid" tabindex="-1"><path class="fill" d="M82.496 1c-14.698 0-25.969 11.785-27.496 13.457-1.526-1.672-12.798-13.457-27.494-13.457-16.299 0-27.506 15.037-27.506 27.885 0 12.795 12.562 22.558 22.245 27.592 9.186 4.771 30.601 18.349 32.755 24.523 2.154-6.174 23.57-19.752 32.755-24.523 9.684-5.034 22.245-14.797 22.245-27.592 0-12.848-11.206-27.885-27.504-27.885z"></path></svg>`;
    var watchlatersvg = `<svg viewBox="0 0 20 20" preserveAspectRatio="xMidYMid" tabindex="-1"><polyline class="fill hour-hand" points="9.64,4.68 10.56,4.68 11.28,11.21 8.93,11.21 9.64,4.68"></polyline><polyline class="fill minute-hand" points="14.19,13.65 13.7,14.14 8.58,10.4 10.44,8.5 14.19,13.65"></polyline><circle cx="10" cy="10" r="8" fill="none" stroke-width="2"></circle></svg>`;
    var collectionssvg = `<svg class="collections-icon" viewBox="0 0 24 24" tabindex="-1"><path class="fill" d="M24 12c0-.3-.1-.6-.4-.8l-2.7-2.3 2.4-1c.4-.1.7-.5.7-.9 0-.3-.1-.6-.4-.8l-7-6c-.1-.1-.4-.2-.6-.2-.1 0-.3 0-.4.1l-15 6c-.3.1-.6.5-.6.9 0 .3.1.6.4.8l2.7 2.3-2.4 1c-.4.1-.7.5-.7.9 0 .3.1.6.4.8l2.7 2.3-2.4 1c-.4.1-.7.5-.7.9 0 .3.1.6.4.8l7 6c.1.1.4.2.6.2.1 0 .3 0 .4-.1l15-6c.4-.1.6-.5.6-.9 0-.3-.1-.6-.4-.8l-2.7-2.3 2.4-1c.4-.1.7-.5.7-.9zm-8.2-9.8l5.3 4.5-12.9 5.1-5.3-4.5 12.9-5.1zm5.3 14.5L8.2 21.8l-5.3-4.5 1.9-.8 2.6 2.2c.1.2.4.3.6.3.1 0 .3 0 .4-.1l10.5-4.2 2.2 2zm-12.9.1l-5.3-4.5 1.9-.8 2.6 2.2c.1.2.4.3.6.3.1 0 .3 0 .4-.1l10.5-4.2 2.3 1.9-13 5.2z"></path></svg>`;

	$(function(){
        let likeButt = $(".haddrp:first").clone();
        likeButt.removeAttr("data-fatal-attraction");
        let watchlaterButt = likeButt.clone();
        let collectionButt = likeButt.clone();

        watchlaterButt.prop("id", "watchLaterButton");
        watchlaterButt.addClass("customButton");
        watchlaterButt.find("span:first").html(watchlatersvg);

        collectionButt.prop("id", "collectionButton");
        collectionButt.addClass("customButton");
        collectionButt.find("span:first").html(collectionssvg);

        likeButt.prop("id", "customLikeButton");
        likeButt.addClass("customButton");
        likeButt.find("span:first").html(likesvg);

		$(".haddrp:first").before(likeButt);
        $(".haddrp:first").before(watchlaterButt);
        $(".haddrp:first").before(collectionButt);


        $("#customLikeButton").click(function(e){
            e.preventDefault();
            $("button.like-button:first").click();
            setTimeout(CheckButtons, 200);
        });
        $("#watchLaterButton").click(function(e){
            e.preventDefault();
            $("button.watch-later-button:first").click();
            setTimeout(CheckButtons, 200);
        });
        $("#collectionButton").click(function(e){
            e.preventDefault();
            $("button.collections-button:first").click();
        });



        setTimeout(CheckButtons, 100);
	});

    function CheckButtons() {
        if($("button.like-button").length > 0 && $("button.watch-later-button").length > 0) {
            if($("button.like-button").hasClass("on")) {
                $("#customLikeButton").css("fill", "rgb(0, 173, 239)");
                $("#customLikeButton").prop("title", "Unlike");
            }
            else {
                $("#customLikeButton").css("fill", "black");
                $("#customLikeButton").prop("title", "Like");
            }

            if($("button.watch-later-button").hasClass("on")) {
                $("#watchLaterButton").css("fill", "rgb(0, 173, 239)");
                $("#watchLaterButton svg circle").css("stroke", "rgb(0, 173, 239)");
                $("#watchLaterButton").prop("title", "Remove from Watch Later");
            }
            else {
                $("#watchLaterButton").css("fill", "black");
                $("#watchLaterButton svg circle").css("stroke", "black");
                $("#watchLaterButton").prop("title", "Add to Watch Later");
            }

            $(".vp-sidedock button").off();
            $(".vp-sidedock button").click(function(e){
                setTimeout(CheckButtons, 200);
            });
        }
        else
            setTimeout(CheckButtons, 100);
    }

})();