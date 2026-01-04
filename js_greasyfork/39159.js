// ==UserScript==
// @name         Dumpert Fix
// @namespace    kolabear
// @version      0.1.2
// @description  Verwijder irritante reaguursels, omschrijvingen en videos met negatieve kudos en highlight top videos.
// @author       Kolabear
// @include      *://www.dumpert.nl/*
// @include      *://www.dumpert.nl/mediabase/*/*/*
// @exclude      *://www.dumpert.nl/themas/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39159/Dumpert%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/39159/Dumpert%20Fix.meta.js
// ==/UserScript==
/* jshint esversion: 6 */


// Verwijder reaguursels
let hideComments = true;

// Verwijder omschrijvingen
const hideDescription = true;

// Verwijder videos met kudos lager dan
const hideNegative = true;
const hideMinKudos = 0;

// Highlight videos met kudos hoger dan
const highlightTop = true;
const highlightMinKudos = 2500;


(function() {
    let comments;

    if ($('#comments').length > 0) {
        comments = document.getElementById('comments').src;
    }

    function toggleComments() {
        if (!comments && $('#comments').length > 0) {
            comments = document.getElementById('comments').src;
        }

        if ($('#comments').length > 0) {
            document.getElementById('comments').contentWindow.location.replace(hideComments ? "" : comments);
            hideComments = !hideComments;
        }
    }

    let thumbs = $("a.dumpthumb");

    for (let i=0; i < thumbs.length; i++) {
        let thumb = thumbs[i];
        let kudos = thumb.children[2].children[2].innerText.split(":")[2];
        if (hideNegative && kudos <= hideMinKudos) {
            thumb.remove();
        }
        if (highlightTop && kudos >= highlightMinKudos) {
            thumb.style.outline = "rgba(0,200,0,0.8) dashed 3px";
        }
    }

    if (hideComments) {
        let btn = $('<button/>', {
            text: 'Toggle Comments',
            click: toggleComments
        });
        btn.css({
            width: "274px",
            height: "25px",
            backgroundColor: "darkgrey",
            color: "rgb(0,0,0)",
            border: "none",
            fontSize: "16px",
            fontFamily: "Arial",
            fontWeight: "bold"
        });
        $("#commentscontainer").prepend(btn);
        toggleComments();
	}

    if (hideDescription) {
		$("p.description").remove();
		$(".dump-desc p:last").remove();

		let timer = setInterval(()=>{
			let desc = $("p.description");
			if (desc.is(":visible")) {
				desc.remove();
				clearInterval(timer);
			}
		},50);
	}
})();