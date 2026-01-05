// ==UserScript==
// @name			HF Writers Features
// @namespace		xerotic
// @description		Adds features for HF Writers team.
// @require			http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @include			*hackforums.net*
// @grant 			GM_info
// @grant 			GM_addStyle
// @grant 			GM_setValue
// @grant 			GM_getValue
// @run-at 			document-start
// @version			0.1
// @downloadURL https://update.greasyfork.org/scripts/2950/HF%20Writers%20Features.user.js
// @updateURL https://update.greasyfork.org/scripts/2950/HF%20Writers%20Features.meta.js
// ==/UserScript==

// Separator between groups: <|||>
// Separator between pieces: >|||<
// File (xerotic): https://dl.dropboxusercontent.com/s/teqtv03344ze5sv/format.txt
// File (Sir): https://dl.dropboxusercontent.com/u/46622032/hfuss.txt

String.prototype.contains = function (arg) {
	return (this.indexOf(arg) >= 0) ? true : false;
}

a_array = new Array();
viewed_array = {};
private_count = 0
private_html = '';
private_temp = '';
announce_html = '';

function TimezoneDetect(){
    var dtDate = new Date('1/1/' + (new Date()).getUTCFullYear());
    var intOffset = 10000; //set initial offset high so it is adjusted on the first attempt
    var intMonth;
    var intHoursUtc;
    var intHours;
    var intDaysMultiplyBy;
 
    //go through each month to find the lowest offset to account for DST
    for (intMonth=0;intMonth < 12;intMonth++){
        //go to the next month
        dtDate.setUTCMonth(dtDate.getUTCMonth() + 1);
 
        //To ignore daylight saving time look for the lowest offset.
        //Since, during DST, the clock moves forward, it'll be a bigger number.
        if (intOffset > (dtDate.getTimezoneOffset() * (-1))){
            intOffset = (dtDate.getTimezoneOffset() * (-1));
        }
    }
 
    return intOffset;
}

$.ajax({
	url: "https://dl.dropboxusercontent.com/u/46622032/hfuss.txt",
}).done(function(data) {
	var announcements = data.split('<|||>');
	$.each(announcements, function(index, value) {
		viewed_array[value.split('>|||<')[0]] = GM_getValue('id' + value.split('>|||<')[0], 0);
		if(parseInt(value.split('>|||<')[1]) == 1 && viewed_array[value.split('>|||<')[0]] == 0 && !pageTitle.contains('search.php?action=results&writerid=' + value.split('>|||<')[0])) {
			// if() {
				// GM_setValue('id' + writer_id, 1);
			// }
			private_count = private_count + 1;
		}
		a_array.push(value.split('>|||<'));
	});
	
	if(private_count == 1) {
		private_html = '<div class="pm_alert writers_alert" id="writer_notice"><div><strong>You have one unread Writers message</strong> titled <a href="search.php?action=results&writerid=';
	} else if(private_count > 1) {
		private_html = '<div class="pm_alert writers_alert" id="writer_notice"><div><strong>You have ' + private_count + ' unread Writers messages.</strong> Click <a href="search.php?action=results&writerid=0" style="font-weight: bold;">Here</a> to view them.';
	}
	
	var installed = GM_getValue('script_installed', 0);
	
	$.each(a_array, function(index, value) {
		if(!installed) {
			GM_setValue('id' + value[0], 1);
		}
		if(parseInt(value[1]) == 1 && private_count == 1 && viewed_array[value[0]] == 0 && !pageTitle.contains('search.php?action=results&writerid=' + value[0])) {
			private_temp = value[0] + '" style="font-weight: bold;">' + value[3] + '</a>';
		} else if(parseInt(value[1]) == 2) {
			announce_html = announce_html + '<div class="pm_alert writers_announcement" id="writer_announce"><div style="margin-top:5px;padding-bottom:5px;">' + value[4] + '</div></div>';
		}
	});
	
	if(!installed) {
		GM_setValue('script_installed', 1);
	}

	if(private_html.length > 10) {
		private_html = private_html + private_temp + '</div></div>';
	}
	
});

pageTitle = location.href;

if(location.href.contains("search.php?action=results&writerid=")) {
	writer_id = parseInt(pageTitle.split('writerid=')[1]);
}

/* This is ran after AJAX is ready */
function ajaxFinished() {
	if($("#content").length > 0) {
		if ($("#pm_notice").length > 0){
			var new_div = $('<div>' + private_html + announce_html + '</div>').hide();
			$("#pm_notice").after(new_div);
			new_div.slideDown(200);
		} else {
			var new_div = $('<div>' + private_html + announce_html + '</div>').hide();
			$('#content').prepend(new_div);
			new_div.slideDown(200);
		}
		// 6-23-2014, 1:39 AM
		if(pageTitle.contains("search.php?action=results&writerid=")) {
			if(writer_id == 0) {
				if(a_array.length > 1) {
					$('.thead').attr('colspan', '3').parent().next().remove();
					var $page_area = $('.thead').parent();
					var content_html = '';
					$.each(a_array.reverse(), function(index, value) {
					
						// var the_time = new Date((parseInt(new String(Date.now()).substring(0,10)) + TimezoneDetect() * 10) * 1000);
						var the_time = new Date((parseInt(value[2]) + TimezoneDetect() * 10) * 1000);
						if(the_time.getHours() > 12) {
							var time_hours = the_time.getHours() - 11;
							var am_or_pm = 'PM';
						} else {
							var time_hours = the_time.getHours() + 1;
							var am_or_pm = 'AM';
						}
						if(the_time.getMinutes() < 10) {
							var time_minutes = '0' + the_time.getMinutes();
						} else {
							var time_minutes = the_time.getMinutes();
						}
						var formatted_time = (the_time.getMonth() + 1) + '-' + the_time.getDate() + '-' + the_time.getFullYear();
						
						if(parseInt(value[1]) == 1) {
							if(GM_getValue('id' + viewed_array[value[0]]) == 1) {
								var read_or_not = '<td align="center" class="trow1" width="1%"><img src="http://x.hackforums.net/images/modern_bl/old_pm.gif" alt="Old Message" title="Old Message"></td><td align="center" class="trow1" width="12%"><span class="smalltext">' + formatted_time + '</span></td>';
								var strong = '<a href="search.php?action=results&writerid=' + value[0] + '">' + value[3] + '</a>';
							} else {
								var read_or_not = '<td align="center" class="trow1" width="1%"><img src="http://x.hackforums.net/images/modern_bl/new_pm.gif" alt="New Message" title="New Message"></td><td align="center" class="trow1" width="12%"><span class="smalltext">' + formatted_time + '</span></td>';
								var strong = '<strong><a href="search.php?action=results&writerid=' + value[0] + '">' + value[3] + '</a></strong>';
							}
							content_html = content_html + '<tr>' + read_or_not + '<td class="trow1">' + strong + '</td></tr>';
						} else if(parseInt(value[1]) == 2) {
							var read_or_not = '<td align="center" class="trow1" width="1%"><img src="http://x.hackforums.net/images/modern_bl/old_pm.gif" alt="Announcement" title="Announcement"></td><td align="center" class="trow1" width="12%"><span class="smalltext">' + formatted_time + '</span></td>';
							content_html = content_html + '<tr>' + read_or_not + '<td class="trow1"><a href="search.php?action=results&writerid=' + value[0] + '">' + value[3] + '</a></td></tr>';
						}
					});
					$page_area.after(content_html);
				} else {
					var $page_area = $('.thead').first().parent().next().children().first();
					$page_area.html('No news Writer\'s messages');
				}
				// var $page_area = $('.thead').first().parent().next().children().first();
				// $page_area.html(new String(Date.now()).substring(0,10));
			} else if(writer_id > 0) {
				$.each(a_array, function(index, value) {
					if(writer_id == value[0]) {
						GM_setValue('id' + writer_id, 1);
						$('.thead').parent().next().remove();
						var $page_area = $('.thead').html('<strong>' + value[3] + '</strong>').parent();
						
						var the_time = new Date((parseInt(value[2]) + TimezoneDetect() * 10) * 1000);
						if(the_time.getHours() > 12) {
							var time_hours = the_time.getHours() - 11;
							var am_or_pm = 'PM';
						} else {
							var time_hours = the_time.getHours() + 1;
							var am_or_pm = 'AM';
						}
						if(the_time.getMinutes() < 10) {
							var time_minutes = '0' + the_time.getMinutes();
						} else {
							var time_minutes = the_time.getMinutes();
						}
						var formatted_time = (the_time.getMonth() + 1) + '-' + the_time.getDate() + '-' + the_time.getFullYear();
						
						$page_area.after('<tr><td class="tcat">' + formatted_time + '</td></tr><tr><td class="trow1">' + value[4] + '</td></tr>');
					}
				});
			}
		}
		
	} else {
		$(document).on('DOMContentLoaded', ajaxFinished);
	}
}

function mainContentLoaded() {
	$('#panel').append(' | <a href="search.php?action=results&writerid=0">Writer\'s Messages</a>');
}

GM_addStyle(".writers_alert { border-top:1px solid gold !important; border-bottom:1px solid gold !important; }");
GM_addStyle(".writers_announcement { border-top:1px solid gold !important; border-bottom:1px solid gold !important; min-height:30px !important; }");

$(document).on('DOMContentLoaded', mainContentLoaded);

$(document).bind('ajaxComplete', function(){
	ajaxFinished();
});