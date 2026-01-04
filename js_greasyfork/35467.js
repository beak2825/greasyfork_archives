// ==UserScript==
// @name         HNQ
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Things
// @match       *://*.stackexchange.com/questions/*
// @match       *://*.stackoverflow.com/questions/*
// @match       *://*.superuser.com/questions/*
// @match       *://*.serverfault.com/questions/*
// @match       *://*.stackapps.com/questions/*
// @match       *://*.mathoverflow.net/questions/*
// @match       *://*.askubuntu.com/questions/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35467/HNQ.user.js
// @updateURL https://update.greasyfork.org/scripts/35467/HNQ.meta.js
// ==/UserScript==
(function () {
	'use strict';

	var template = `<tr>
										<td>
											<p class="label-key">hnq</p>
										</td>
										<td style="padding-left: 10px">
											<p class="label-key">
												<b id="hnq-result"><b>
											</p>
										</td>
									</tr>`;

	$('#qinfo').append(template);

	// (MIN(aCount, 10) * qScore) / 5 + aScore
	// ---------------------------------------
	//          MAX(qAge + 1, 6) ^ 1.4
	// https://meta.stackexchange.com/questions/60756/how-do-the-arbitrary-hotness-points-work-on-the-new-stack-exchange-home-page

	var aCount = 0;
	var qScore = $('.question .vote-count-post').text();
	var aScore = 0;

	$('.answer .vote-count-post').each(function() {
		aCount++;
		aScore += parseInt($(this).text());
	});
	var qTS = $('.question .post-signature.owner .user-action-time span')[0].title;
	var qDate = new Date(qTS).getTime()/1000;
	var nDate = new Date().getTime()/1000;

	var qAge = ((nDate - qDate) / 3600).toFixed(2);

	var min = Math.min(aCount, 10);
	var max = Math.max((qAge + 1), 6);

	var numerator = ((min * qScore) / 5) + aScore;
	var denominator = Math.pow(max, 1.4);

	var hnq = numerator/denominator;

	var text = 'no';
	if (hnq > 1) {
		text = 'should be'
	} else if (hnq > .5) {
		text = 'likely';
	} else if (hnq > 0) {
		if (qAge < 6) {
			text = 'maybe';
		} else if (qAge > 25) {
			text = 'no';
		} else if (qAge > 6) {
			text = 'unlikely';
		}
	}

	addText(text, hnq);
	checkHNQ();

	function checkHNQ() {
		$.ajax({
			type: 'get',
			url: 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20json%20where%20url%3D"https%3A%2F%2Fstackexchange.com%2Fhot-questions-for-mobile"&format=json',
			success: function(data, textStatus) {
				var results = data.query.results.json.json;
				$.each(results, function(i, o) {
					if (document.URL.indexOf(o.site + '/questions/' + o.question_id) > -1) {
						console.log(o);
						console.log('tap');
						addText('yes', parseFloat(o.display_score), true);
					}
				});
			},
			complete: function(xhr, textStatus) {
				console.log(textStatus);
	      if (textStatus == 'nocontent') alert('nocontent');
	    } 
		});
	}

	function addText(text, hnq, confirmed = false) {
		console.log(confirmed);
		text = text + ' | ' + hnq.toFixed(3);
		if (confirmed) {
			text += ' ahp';
		} else {
			text += ' chp';
		}
		$('#hnq-result').text(text);
	}
}());