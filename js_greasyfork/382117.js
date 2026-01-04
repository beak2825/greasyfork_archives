// ==UserScript==
// @namespace     https://greasyfork.org/users/294014-useyourname
// @name          MangaDex mark as read
// @description   Slide the button down to mark everything below as read
// @copyright     2019, UseYourName
// @license       Beerware
// @version       4
// @match         https://mangadex.org/title/*
// @match         https://mangadex.org/manga*
// @require       https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @downloadURL https://update.greasyfork.org/scripts/382117/MangaDex%20mark%20as%20read.user.js
// @updateURL https://update.greasyfork.org/scripts/382117/MangaDex%20mark%20as%20read.meta.js
// ==/UserScript==

// If previous pages should be marked read
const MARK_PAGES = true;
// Number of simultaneous requests for marking read
const MARK_CONCURRENT = 20;


$(document).ready(function() {
	// Timeout 1ms so it's run after site stuff
	setTimeout(function() {
		// Unbind default click handlers for marking (un)read
		$(".chapter_mark_read_button, .chapter_mark_unread_button").unbind("click");

		// One handler for both to make it easy to process repeated toggles
		$(".chapter_mark_read_button, .chapter_mark_unread_button").click(function(event){
			queueChapter($(this).attr('data-id'), ($(this).hasClass("chapter_mark_read_button") ? "read" : "unread"));
			event.preventDefault();
		});
	}, 1);
});

// Make mark read/unread draggable and disable by default
$(".chapter_mark_read_button, .chapter_mark_unread_button").draggable({
	helper: function(event) {
		// Make a thing to drag
		var targetDiv = $('<div id="div_draggable"><span class="fas fa-eye-slash fa-fw " aria-hidden="true"></span></div>');
		targetDiv
			.css({
				'top': $(this).offset().top,
				'left': $(this).offset().left,
				'width': $(this).width(),
				'height': $(this).height(),
				'position': 'absolute'
			});

		// div used to limit movement, height multiplier is pretty much randomly picked
		var containmentDiv = $('<div id="div_containment"></div>');
		containmentDiv
			.css({
				'display': "hidden",
				'top': $(this).offset().top,
				'left': $(this).offset().left,
				'width': $(this).width(),
				'height': $(this).height() * 2.5,
				'position': 'absolute'
			});
		$("body").append(containmentDiv);

		// div used to check if dragged all the way down, should be possible to calculate 'top' based on previous multiplier but eh
		var droppableDiv = $('<div id="div_droppable"></div>');
		droppableDiv
			.css({
				'display': "hidden",
				'top': $(this).offset().top + ($(this).height() * 1.9),
				'left': $(this).offset().left,
				'width': $(this).width(),
				'height': $(this).height(),
				'position': 'absolute'
			});
		droppableDiv.droppable({
			// visual cue for when fully dragged
			over: function(event, ui) {
				ui.helper.children(".fas").switchClass("fa-eye-slash", "fa-eye");
			},
			out: function(event, ui) {
				ui.helper.children(".fas").switchClass("fa-eye", "fa-eye-slash");
			},
			drop: function(event, ui) {
				// trigger all the buttons below this, and this one
				ui.draggable.trigger("click");
				ui.draggable.closest("div[class='row no-gutters']").nextAll("div[class='row no-gutters']").find(".chapter_mark_read_button").trigger("click");
				if(MARK_PAGES) {
					markPagesRead(ui.draggable.attr('data-id'));
				}
			}
		});
		$("body").append(droppableDiv);
		return targetDiv;
	},
	axis: 'y',
	containment: "#div_containment",
	appendTo: "body",
	revert: true,
	disabled: true,
	start: function(event, ui) {
		$(this).hide();
	},
	stop: function(event, ui) {
		$("#div_droppable").remove();
		$("#div_containment").remove();
		$(this).show();
	}
});

// Enable for the mark read buttons
$(".chapter_mark_read_button").draggable({disabled:false});


// Store the id of the chapter which triggered updates to stop repeated marking of all pages
var chapterDragged = 0;

function markPagesRead(chapter_id) {
	if(chapterDragged) return;
	chapterDragged = chapter_id;
	var titleID, pageCurrent, pageTotal;
	titleID = Number($("link[rel='canonical']").attr("href").split("/")[4]);
    pageCurrent = Number(location.pathname.split("/")[5]);
	pageTotal = Number(($(".page-link").last().attr('href') || "").split("/")[5]);
	if(!pageCurrent) pageCurrent = 1;
	if(!pageTotal) pageTotal = 1;

	if(pageCurrent < pageTotal) {
	   // CSS for rotating eye while processing
		var myStylesheet = document.createElement('style');
		myStylesheet.type = "text/css";
		if(CSS && CSS.supports && CSS.supports('animation: name')) {
			myStylesheet.innerHTML =
				"@keyframes eyerotate { to { transform: rotate(360deg); } }\n" +
				"\n" +
				".eyerotate {\n" +
				"	animation: eyerotate 1s linear infinite;\n" +
				"}";
		} else {
			myStylesheet.innerHTML =
				"@keyframes eyerotate { to { transform: rotate(360deg); } }\n" +
				"@-webkit-keyframes eyerotate { to { -webkit-transform: rotate(360deg); } }\n" +
				"\n" +
				".eyerotate {\n" +
				"	animation: eyerotate 1s linear infinite;\n" +
				"	-webkit-animation: eyerotate 1s linear infinite;\n" +
				"}";
		}
		document.head.appendChild(myStylesheet);

		for (let i = 1; i + pageCurrent <= pageTotal; i++) {
			$.get(`/title/${titleID}/_/chapters/${pageCurrent+i}/`, function(data) {
				// Ugly, ugly processing to skip loading img/script elements
				var start = data.indexOf('<div class="chapter-container ">');
				var end = data.indexOf("<p class='mt-3 text-center'>");
				if(start != -1 && end != -1) {
					$(data.slice(start, end)).find('.chapter_mark_read_button').each(function(index) {
						queueChapter($(this).attr('data-id'));
					});
				}
			}, "html" );
		}
	}
}

var queueChapter = (function () {
	var chapterQueue = [];
	var chapterMarking = 0;
	var chapterSpinning = false;

	// Spin eye to indicate requests in progress
	function spinChapter(toggle=true) {
		// If chapterDragged isn't set then queued requests are from this page, no need for a visual inidicator
		if(!chapterDragged) return;
		if(toggle) {
			$("#marker_"+chapterDragged).children(".fas").addClass("eyerotate");
		} else if (CSS && CSS.supports && CSS.supports('animation: name')) {
			$("#marker_"+chapterDragged).children(".fas").on('animationiteration', function () {
				$(this).off('animationiteration').removeClass('eyerotate');
			});
		} else {
			$("#marker_"+chapterDragged).children(".fas").on('animationiteration webkitAnimationIteration', function () {
				$(this).off('animationiteration webkitAnimationIteration').removeClass('eyerotate');
			});
		}
	}

	// Should perhaps requeue on failure, but then I'd need to store retrys and limit them
	function updateChapter(chapter_id, mark) {
		$.ajax({
			...(!!mark && {success: function () {
					if(mark == "unread") {
						$("#marker_"+chapter_id)
							.removeClass("chapter_mark_unread_button")
							.addClass("grey chapter_mark_read_button")
							.prop("title", "Mark read")
							.draggable({disabled:false})
							.children(".fas").switchClass("fa-eye", "fa-eye-slash");
					} else {
						$("#marker_"+chapter_id)
							.removeClass("grey chapter_mark_read_button")
							.addClass("chapter_mark_unread_button")
							.prop("title", "Mark unread")
							.draggable({disabled:true})
							.children(".fas").switchClass("fa-eye-slash", "fa-eye");
					}
				}
			}),
			url: "/ajax/actions.ajax.php",
			data: {
				function: (mark === "unread" ? "chapter_mark_unread" : "chapter_mark_read"),
				id: chapter_id
			},
			complete: function() {
				if(chapterQueue.length) {
					updateChapter(...chapterQueue.shift());
				} else {
					chapterMarking--;
					if(!chapterMarking && chapterSpinning) {
						chapterSpinning = false;
						spinChapter(false);
					}
				}
			},
			cache: false,
			contentType: false
		});
	}

	return function (chapter_id, mark) {
		if(chapterMarking < MARK_CONCURRENT) {
			chapterMarking++;
			updateChapter(chapter_id, mark);
		} else {
			chapterQueue.push([chapter_id, mark]);
			if(!chapterSpinning) {
				chapterSpinning = true;
				spinChapter(true);
			}
		}
	}
})();
