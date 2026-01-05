// ==UserScript==
// @author        Xiphias[187717]
// @name          Torn City - One click Company training by Xiphias[187717]
// @description   This script adds a one click training function to company training.
// @include       http://www.torn.com/companies.php*
// @include       http://torn.com/companies.php*
// @include       https://www.torn.com/companies.php*
// @include       https://torn.com/companies.php*
// @version       1.0.4
// @namespace https://greasyfork.org/users/3898
// @downloadURL https://update.greasyfork.org/scripts/4372/Torn%20City%20-%20One%20click%20Company%20training%20by%20Xiphias%5B187717%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/4372/Torn%20City%20-%20One%20click%20Company%20training%20by%20Xiphias%5B187717%5D.meta.js
// ==/UserScript==

var emplUrl = 'step=trainemp&ID=';
window.timesTrained = 0;
$('body').ajaxComplete(function (e, xhr, settings) {
	var url = settings.url;
	if (url.indexOf(emplUrl) >= 0) {
		var employeeID = getIDFromUrl(url);
		addTrainXTimesButton(employeeID);
	}
});

/**
 * @param url {String} Employee train href
 */
function getIDFromUrl(url) {
	var idRegex = /ID=(\d+)/;
	var match = idRegex.exec(url);
	if (match) {
		return match[1];
	} else {
		return '0';
	}
}

function addTrainXTimesButton(employeeID) {
	var newElements = '<span style="position: relative; left: 2px; border-right: 2px solid #444; margin-right: -2px;"></span><a id="trainXtimesBtn' + employeeID + '" href="#nogo" style="position: relative; left: 10px;"><b>Train&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;times.</b></a><input style="position: relative; padding-left: 3px; left: -50px; background-color: #ebebeb; height: 18px; width: 18px;" placeholder="20" id="trainXtimesInput' + employeeID + '" ></span>';
	$('.train-info.confirm.p10').find('[href*="trainemp2&ID=' + employeeID + '"]').parent().append(newElements);
	$('#trainXtimesBtn' + employeeID).on('click', function () {
		window.timesTrained = 0;
		var times = getTimesToTrain(employeeID);
		repeatTrains(employeeID, times);
	});
}

function sendTrainRequest(employeeID) {
	$.get('companies.php?rfcv=' + getCookie('rfc_v'), {
		step : 'trainemp2',
		ID : employeeID
	}, function( result ) {
		var $employees = $('#employees');
        console.log(result);
		var data = JSON.parse(result);
		if (data.success) {
			window.timesTrained += 1;
			var times = "times";
			if (window.timesTrained == 1) {
				times = "time";
			}
			var $employees = $('#employees');
			var usernameID = $employees.find('.user.name > [title*="' + employeeID + '"]').attr('title');
			var username = usernameID.replace(/\s*\[\d+\]/, '');
			$employees.find('#emp_message').attr('class', data['class']).html("You have successfully trained " + username + " " + timesTrained + " " + times + ".").show();
		} else {
            $employees.find('#emp_message').attr('class', data['class']).html("You failed to train your employee.").show();
        }

	});
}

function repeatTrains(employeeID, times) {
	var i = 0,
	howManyTimes = times;

	if (times == 0)
		return;

	function f() {
		sendTrainRequest(employeeID);
		i++;
		if (i < howManyTimes) {
			setTimeout(f, 500);
		}
	}
	f();
}

function getTimesToTrain(employeeID) {
	var timesString = $('#trainXtimesInput' + employeeID).val();
	try {
		if (timesString.length == 0 || timesString == "undefined") {
			return 20;
		}

		times = parseInt(timesString);
		if (times > 20) {
			return 20;
		} else if (times < 0) {
			return 0;
		} else if (times >= 0 && times <= 20) {
			return times;
		} else {
			return 0;
		}
	} catch (e) {
		console.log(e);
		return 0;
	}
}
