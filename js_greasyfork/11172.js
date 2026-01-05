// ==UserScript==
// @name        MTurk 13D Data Extraction
// @description Make it easier to copy/paste data for 13D Data Extraction HITs
// @namespace   http://idlewords.net
// @include     https://www.mturkcontent.com/dynamic/hit*
// @include     https://www.sec.gov/Archives/*
// @version     0.10
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @grant		GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/11172/MTurk%2013D%20Data%20Extraction.user.js
// @updateURL https://update.greasyfork.org/scripts/11172/MTurk%2013D%20Data%20Extraction.meta.js
// ==/UserScript==

var datetime = 1; // CHANGE THIS TO 0 (zero) FOR DD/MM/YYYY FORMAT

if ($("#PageTitle:contains('Filing Detail')").length) {
	var accept_date = $("div.formContent").eq(0).children("div.formGrouping").eq(0).children("div.info").eq(1);
	var split_date = accept_date.text().split(" ");
	var acc_date = split_date[0].split("-");
	if (acc_date[0].length == 1) {
		acc_date[0] = '0' + acc_date[0];
	}
	if (datetime == 1) {
		new_date = acc_date[1] + '/' + acc_date[2] + '/' + acc_date[0];
	} else {
		new_date = acc_date[2] + '/' + acc_date[1] + '/' + acc_date[0];
	}
	accept_date.text('');
	accept_date.wrapInner("<input type='text' style='width: 400px; border: none; font-size: 16px;' id='datetime'></input>");
	$("#datetime").val(new_date + ' ' + split_date[1]).mouseover(function() {
		//$(this).select();
		GM_setClipboard(new_date + ' ' + split_date[1]);
		$(this).css('color', 'green').css('font-weight', 'bold').val($(this).val() + ' - COPIED');
	});
	console.log(link.length);
} else if ($("li:contains('You will be provided')").length) {
	$("#acceptance_date").blur(function() {
		if ($(this).val() !== '' && $("#acceptance_time").val() === '') {
			var date_time = $(this).val().split(" ");
			$("#acceptance_time").val(date_time[1]);
			$("#acceptance_time").attr('readonly', 'readonly');
			$("#acceptance_date").val(date_time[0]);
			$("#acceptance_date").attr('readonly', 'readonly');
		}
	});
	$("a[href~='sec.gov']").attr('target', 'stock');
	var link = $("a:contains('Archives')").attr('href');
	window.parent.postMessage("secpage!!!!!" + link, "https://www.mturk.com");
} else if ($(":contains('Class of Securities)')").length) {
	cusipHead = $("font, b, p, td, div").filter(":contains('(CUSIP') :contains('Number)')").first();

	var cusipNumParent = null;
	function getCusipPrev() {
		var prevTDs = 0;
		if (cusipHead.prev().length) {
			if (cusipHead.prev("td").length) {
				prevTDs = cusipHead.prevAll("td").length;
				cusipNumParent = cusipHead.parent().prev();
			} else {
				cusipNumParent = cusipHead.prev();
			}
		} else if (cusipHead.parent().prev().length) {
			if (cusipHead.parent().prev("td").length) {
				prevTDs = cusipHead.parent().prevAll("td").length;
				cusipNumParent = cusipHead.parent().parent().prev();
			} else {
				cusipNumParent = cusipHead.parent().prev();
			}
		} else if (cusipHead.parent().parent().prev().length) {
			if (cusipHead.parent().parent().prev("td").length) {
				prevTDs = cusipHead.parent().parent().prevAll("td").length;
				cusipNumParent = cusipHead.parent().parent().parent().prev();
			} else {
				cusipNumParent = cusipHead.parent().prev();
			}
		}
		return prevTDs;
	}

	prevTDs = getCusipPrev();
	if (cusipNumParent.prop("tagName") == "HR" || cusipNumParent.find("hr").length) {
		cusipHead = cusipNumParent;
		cusipNumParent = null;
		prevTDs = getCusipPrev();
	}

	if (cusipNumParent !== null) {
		var cusipNum = null;
		if (cusipNumParent.children().eq(prevTDs).children().first().children().first().length) {
			cusipNum = cusipNumParent.children().eq(prevTDs).children().first().children().first();
		}
		if (cusipNumParent.children().eq(prevTDs).children().first().length) {
			// number is buried 2 deep
			cusipNum = cusipNumParent.children().eq(prevTDs).children().first();
		} else if (cusipNumParent.children().eq(prevTDs).length) {
			// number should only be 1 deep
			cusipNum = cusipNumParent.children().eq(prevTDs);
		} else {
			// number is text within parent
			cusipNum = cusipNumParent;
		}

		if (cusipNum !== null) {
			cusipNum.attr('id', 'cusipNumField');
			cusipText = cusipNum.text();
			cusipNum.text('');
			cusipNum.append("<input type='text' style='width: 400px; border: none; font-size: 16px;' id='cusipNum' />")
			$("#cusipNum").val(cusipText).mouseover(function() {
				if ($(this).val().substr(-6) === 'COPIED') {
					$(this).val($(this).val().replace(' - COPIED', ''));
				}
				GM_setClipboard($(this).val());
				$(this).css('color', 'green').css('font-weight', 'bold').val($(this).val() + ' - COPIED');
			});
		}
	}
}