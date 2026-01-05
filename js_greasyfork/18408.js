// ==UserScript==
// @name			Andrew's Facebook Cleaner
// @include			https://www.facebook.com/*/allactivity*
// @require			http://code.jquery.com/jquery-1.7.1.min.js
// @grant			none
// @version			1.4.1
// @description		Purge and/or Hide all your activity on Facebook to date.
// @namespace https://greasyfork.org/users/36399
// @downloadURL https://update.greasyfork.org/scripts/18408/Andrew%27s%20Facebook%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/18408/Andrew%27s%20Facebook%20Cleaner.meta.js
// ==/UserScript==

/*
 * For jQuery Conflicts.
 */
this.$ = this.jQuery = jQuery.noConflict(true);

// Variables
var currentmode = 'unlike';
var fbname = document.title;
var inited = false;
var firstrun = false;
var retry = 0;
var retries = 10;
var activityheight = 0;
var mindays = 0;
var now = Math.round((new Date()).getTime() / 1000);

// Inject buttons into page
$(document).ready(function() {
    $('#pagelet_main_column_personal div [class="_2o3t fixed_elem"] div[class="clearfix uiHeaderTop"]').append('<h3>Andrew\'s Facebook Cleaner</h3><input type="button" id="andrewfbdelete" value="Purge">&nbsp;<input type="button" id="andrewfbhide" value="Hide"> &nbsp; Limit to activity older than <input id="andrewfbmin" type="number" min="0" step="1" value="7" style="width: 30px"> days (0 = all)<br />Note: if purging <em>and</em> hiding, purge before hiding.<style>.fbprocessed_generic { background-color: #9AFF9A; }</style>');
    $('#andrewfbdelete').click(triggerpurge);
    $('#andrewfbhide').click(triggerhide);
});
jQuery.fn.simulateClick = function() {
    return this.each(function() {
        if('createEvent' in document) {
            var doc = this.ownerDocument,
                evt = doc.createEvent('MouseEvents');
            evt.initMouseEvent('click', true, true, doc.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
            this.dispatchEvent(evt);
        } else {
            this.click();
        }
    });
};
function triggerpurge() {
	if (confirm('Are you absolutely sure you wish to continue? All likes, posts, photos, videos, mentions, tags - EVER - will be removed if you continue. All your friendships/relationships will remain intact. A popup message will appear when done. Please avoid touching this page once it has started working.')) {
		inited = false;
		firstrun = false;
		retry = 0;
		mindays = 60 * 60 * 24 * parseInt($('#andrewfbmin').val());
		$('.fbprocessed_generic').removeClass('fbprocessed_generic');
		andrewhandler('purge');
	}
}
function triggerhide() {
	if (confirm('Are you absolutely sure you wish to continue? Everything (posts and activities) - EVER - will be hidden if you continue. A popup messsage will appear when done. Please avoid touching this page once it has started working.')) {
		inited = false;
		firstrun = false;
		retry = 0;
		mindays = 60 * 60 * 24 * parseInt($('#andrewfbmin').val());
		$('.fbprocessed_generic').removeClass('fbprocessed_generic');
		andrewhandler('hide');
	}
}

// Behold: the master function.
function andrewhandler(mode) {
    if (!inited) {
		activityheight = 0;
        console.log('> Activate all years and months...');
		// Tickle all the years and months to make sure all activity data are loaded
        $("div#rightColContent ul.fbTimelineLogScrubber li a").each(function() {
           $(this).simulateClick('click');
        });
        inited = true;
        var checkFinish = setInterval(function() {
			// Kind of primitive, but check the height of the activity log box every 5 seconds. If it remains the same after 5 seconds, we assume all data has finished loading.
			if ($("#fbTimelineLogBody").height() != activityheight) {
				activityheight = $("#fbTimelineLogBody").height();
			} else {
				console.log('> Finished loading all data! Proceeding to '+mode+' activities...');
				clearInterval(checkFinish);
				andrewhandler(mode);
			}
		}, 5000);
    } else {
        if (!firstrun) {
            scrollTo(0, 0);
            firstrun = true;
        }
		if (retry < retries) {
			if (!$("#fbTimelineLogBody div._5shk:not(.fbprocessed_"+mode+")").length) {
				if ($("#fbTimelineLogBody a.uiMorePagerPrimary").length) {
					$("#fbTimelineLogBody a.uiMorePagerPrimary").each(function() {
					   $(this).simulateClick('click');
					});
					retry = 0;
					console.log($("#fbTimelineLogBody a.uiMorePagerPrimary").length+" More Activity Links Exist");
					setTimeout(function() { andrewhandler(mode); }, 500);
					return;
				}
				setTimeout(function() { andrewhandler(mode); }, 500);
				retry++;
				console.log('Seems to be done. '+retry+'/'+retries);
			} else {
				retry = 0;
				delpost = false;
				if (mindays == 0) delpost = true;
				else {
					posttime = $("#fbTimelineLogBody div._5shk:not(.fbprocessed_"+mode+"):first a._39g5").text();
					posttime = Date.parse(posttime.replace(/[ap]m$/i, '')); // Date() does not like am/pm; don't worry about hours/minutes, just that the event took place on the day
					then = Math.round(new Date(posttime).getTime() / 1000);
					if ((now - then) > mindays) {
						delpost = true;
					} else {
						// activity is still a padawan, so let's let it live... until next time, *mwahaha*
						$("#fbTimelineLogBody div._5shk:not(.fbprocessed_"+mode+"):first").addClass('fbprocessed_generic fbprocessed_'+mode);
						andrewhandler(mode);
					}
				}
				if (delpost) {
					if (mode == 'hide') hideiconclick();
					else if (mode == 'purge') {
						contents = $("#fbTimelineLogBody div._5shk:not(.fbprocessed_"+mode+"):first").text();
						if (contents.indexOf(fbname+' likes an article.') != -1 || contents.indexOf(fbname+' took a photo ') != -1 || contents.indexOf(fbname+' was with ') != -1 || contents.indexOf(fbname+' was at ') != -1 || contents.indexOf(fbname+' was in ') != -1 || contents.indexOf(fbname+' took a video ') != -1 || contents.indexOf(fbname+' shared ') != -1 || contents.indexOf(fbname+' updated his status') != -1 || contents.indexOf(fbname+' updated her status') != -1 || contents.indexOf(fbname+' updated their status') != -1 || contents.indexOf(fbname+' commented on ') != -1 || contents.indexOf(fbname+' wrote on ') != -1 || contents.indexOf(' to your Timeline.') != -1 || contents.indexOf(' to '+fbname+'\'s Timeline.') != -1 || contents.indexOf(' to '+fbname+'\'s timeline.') != -1 || contents.indexOf(fbname+' added a new photo') != -1 || contents.indexOf(fbname+' was untagged in ') != -1 || contents.indexOf(fbname+' posted in ') != -1 || contents.indexOf(fbname+' posted something via ') != -1 || contents.indexOf(fbname+' replied to ') != -1 ) {
							currentmode = 'delete';
							purgeiconclick();
						} else if (contents.indexOf(fbname+' likes ') != -1 || contents.indexOf(fbname+' reacted to ') != -1) {
							currentmode = 'unlike';
							purgeiconclick();
						} else if (contents.indexOf(fbname+' voted on ') != -1) {
							currentmode = 'unvote';
							purgeiconclick();
						} else if (contents.indexOf(fbname+' was mentioned in a ') != -1) {
							currentmode = 'mention';
							purgeiconclick();
						} else if (contents.indexOf(fbname+' was tagged ') != -1) {
							currentmode = 'tag';
							purgeiconclick();
						} else {
							//console.log('> Not a relevant activity, skipping.');
							$("#fbTimelineLogBody div._5shk:not(.fbprocessed_"+mode+"):first").addClass('fbprocessed_generic fbprocessed_'+mode);
							andrewhandler(mode);
						}
					}
				}
			}
		} else {
			alert('Done! Please rinse and repeat (click the '+mode+' button again) just to make sure.');
		}
    }
}

/***************************************************
*
*            HIDE - SUPPORTING FUNCTIONS
*
***************************************************/

function hideiconclick() {
    $("#fbTimelineLogBody div._5shk:not(.fbprocessed_hide):first div.uiPopover i").click();
    console.log($("#fbTimelineLogBody div._5shk:not(.fbprocessed_hide):first").text());
    setTimeout(hideclickhandler, 500);
}
function hideclickhandler() {
    if ($("div.uiLayer:visible li._54ni._54nd").length && $("div.uiLayer:visible li._54ni._54nd").text() != 'Hidden from timeline' && !$("div.uiLayer:visible span._54nh:contains('Unmark as Spam')").length) {
        $("div.uiLayer:visible span._54nh:contains('Hidden from timeline')")[0].click();
        console.log('> Hid post from timeline.');
        $("#fbTimelineLogBody div._5shk:not(.fbprocessed_hide):first").addClass('fbprocessed_generic fbprocessed_hide');
        andrewhandler('hide');
    } else if ($("div.uiLayer:visible li._54ni._54nd").length && $("div.uiLayer:visible li._54ni._54nd").text() == 'Hidden from timeline' && $("div.uiLayer:visible span._54nh:contains('Unmark as Spam')").length) {
        $("div.uiLayer:visible span._54nh:contains('Unmark as Spam')")[0].click();
        $("#fbTimelineLogBody div._5shk:not(.fbprocessed_hide):first").addClass('fbprocessed_generic fbprocessed_hide');
        console.log('> Unmarking as spam.');
        setTimeout(hidecloseoverlay, 2000);
    } else if ($("div.uiLayer:visible li._54ni._54nd").length && $("div.uiLayer:visible li._54ni._54nd").text() != 'Hidden from timeline' && $("div.uiLayer:visible span._54nh:contains('Unmark as Spam')").length) {
        $("div.uiLayer:visible span._54nh:contains('Hidden from timeline')")[0].click();
        console.log('> Hid post from timeline, and unmarking it as spam.');
        hideiconclick();
    } else {
        $("#fbTimelineLogBody div._5shk:not(.fbprocessed_hide):first").addClass('fbprocessed_generic fbprocessed_hide');
        console.log('> Post not hidable or already processed. Continuing.');
        andrewhandler('hide');
    }
}
function hidecloseoverlay() {
    $("div.uiLayer:visible a.layerCancel")[0].click();
    setTimeout(hidehandler, 1000);
}

/***************************************************
*
*          PURGE - SUPPORTING FUNCTIONS
*
***************************************************/

function purgeiconclick() {
    console.log(contents);
    $("#fbTimelineLogBody div._5shk:not(.fbprocessed_purge):first div.uiPopover i").click();
    setTimeout(purgeselect, 500);
}
function purgeselect() {
    if (currentmode == 'delete') word = 'Delete';
    else if (currentmode == 'unvote') word = 'Unvote';
    else if (currentmode == 'unlike') word = 'Unlike';
    else word = 'Report/Remove Tag';
	$("#fbTimelineLogBody div._5shk:not(.fbprocessed_purge):first").addClass('fbprocessed_generic fbprocessed_purge');
    if ($("div.uiLayer:visible span._54nh:contains('"+word+"')").length) {
        $("div.uiLayer:visible span._54nh:contains('"+word+"')").click();
        if (currentmode == 'delete') setTimeout(purgeconfirm, 500);
        else if (currentmode == 'unlike') purgeproceed();
        else if (currentmode == 'unvote') purgeproceed();
        else setTimeout(confirmremovetag, 500);
    } else {
        console.log('> No available options found, skipping.');
        andrewhandler('purge');
    }
}
/* Handle Deletion */
function purgeconfirm() {
    $("div.uiLayer:visible button.layerConfirm").click();
    setTimeout(purgeproceed, 5000);
}
/* Handle Activity Progression */
function purgeproceed() {
    if ($("div.uiLayer:visible a.layerCancel").length) $("div.uiLayer:visible a.layerCancel")[0].click();
    console.log('> Proceeding to next...');
    andrewhandler('purge');
}
/* Handle Tag Removal */
function confirmremovetag() {
    if ($("div.uiLayer:visible:contains('I'm in this photo and I don't like it')").length) $("div.uiLayer:visible input[name='answer']:eq(1)").click();
    else $("div.uiLayer:visible input[name='answer']:eq(0)").click();
    $("div.uiLayer:visible button.layerConfirm").click();
    if (currentmode == 'tag') setTimeout(removetagreason, 2000);
    else if (currentmode == 'mention') setTimeout(removementionreason, 2000);
}
function removetagreason() {
    $("div.uiLayer:visible input[name='answer']:eq(4)").click();
    $("div.uiLayer:visible button.layerConfirm").click();
    setTimeout(confirmremovetagreason, 2000);
}
function removementionreason() {
    if ($("div.uiLayer:visible:contains('Why don't you like this photo?')").length) {
        $("div.uiLayer:visible input[name='answer']:eq(4)").click();
        $("div.uiLayer:visible button.layerConfirm").click();
        setTimeout(confirmremovetagreason, 2000);
    } else {
        confirmremovetagreason();
    }
}
function setotherreason() {
    $("div.uiLayer:visible div.uiLayer:visible input[name='answer']:eq(5)").click();
    $("div.uiLayer:visible button.layerConfirm").click();
    setTimeout(confirmremovetagreason, 2000);
}
function confirmremovetagreason() {
    if ($("div.uiLayer:visible a._16gh:contains('Remove Tag')").length) {
        $("div.uiLayer:visible a._16gh:contains('Remove Tag')")[0].click();
        setTimeout(confirmtagdel, 2000);
    } else {
        $("div.uiLayer:visible a.layerCancel")[0].click();
        console.log('> No available options found, skipping.');
        purgeproceed();
    }
}
function confirmtagdel() {
    $("div.uiLayer:visible button._4jy1").click();
    setTimeout(closeoverlay, 5000);
}
function closeoverlay() {
    $("div.uiLayer:visible a.layerButton")[0].click();
    setTimeout(cancelrating, 2500);
    setTimeout(purgeproceed, 5000);
}
function cancelrating() {
    $("div.uiLayer:visible a.layerCancel")[0].click();
}
