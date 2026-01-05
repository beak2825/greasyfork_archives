// ==UserScript==
// @name        Autoload entire log and chat
// @namespace   http://userscripts.org
// @include     http*://*.conquerclub.com*/game.php*
// @version     1
// @description Private script to be used by me, uploaded to greasy fork for backup purposes only.
// @downloadURL https://update.greasyfork.org/scripts/2667/Autoload%20entire%20log%20and%20chat.user.js
// @updateURL https://update.greasyfork.org/scripts/2667/Autoload%20entire%20log%20and%20chat.meta.js
// ==/UserScript==
function sendRequest2(command) {
	if (updating) return false;
	if (command == 'Post Message' && message.value == "") return false;

	// pre-validate set of cards
	if (command == 'Play Set' || command == 'Play Group') {  // 'Play Group' is deprecated
		var playedCards = [];
		var cardData;
		for (var i=0, max=actionForm.elements["cards[]"].length; i<max; i++) {
			if (actionForm.elements["cards[]"][i].checked) {
				cardData = actionForm.elements["cards[]"][i].value.split("_");
				playedCards.push(cardData);
			}
		}
		if (playedCards.length < 3) {
			alert("Illegal set: you have selected less than 3 spoils!");
			return false;
		} else if (playedCards.length > 3) {
			alert("Illegal set: you have selected more than 3 spoils!");
			return false;
		} else {
			var types = [0,0,0];
			for (var i=0, max=playedCards.length; i<max; i++) {
				types[playedCards[i][1]]++;
			}
			if (!((types[0]==1 && types[1]==1 && types[2]==1) || types[0]==3 || types[1]==3 || types[2]==3)) {
				alert("Illegal set: you have selected an invalid combination of 3 spoils!");
				return false;
			}
		}
	}

	if (gameAction) {
		gameAction.style.display = "none";
		loading.style.display = "block";
	}

	if (command == 'Post Message' || command == null || command == 'full_log' || command == 'full_chat') {
		// save selections
		if (quantity) tempQuantity = selectedQuantityIndex;
		if (from) tempFrom = selectedFrom;
		if (to) tempTo = selectedTo;
		if (actionForm && actionForm.elements["cards[]"]) {
			for (var i=0, max=actionForm.elements["cards[]"].length; i<max; i++) {
				if (actionForm.elements["cards[]"][i].checked) tempCards[actionForm.elements["cards[]"][i].value] = true;
			}
		}
	}

	if (autoRefreshId) { window.clearTimeout(autoRefreshId); }
	updating = true;
	submit2.disabled = true;
	var params = "game=" + game.value + "&ajax=1&log_number=" + logNumber + "&chat_number=" + chatNumber;

	if (command == 'Begin Turn' || command == 'Later' || command == 'End Deployment' || command == 'End Assaults' || command == 'End Reinforcement') {
		params += "&submit=" + command;
	}
	else if (command == 'Deploy') {
		params += "&submit=" + command + "&quantity=" + selectedQuantity + "&to_country=" + selectedTo;
		if (state == 'deploy') tempFrom = selectedTo;
	}
	else if (command == 'Advance') {
		params += "&submit=" + command + "&quantity=" + selectedQuantity;
		tempFrom = (selectedQuantity > 0) ? selectedTo : selectedFrom;
	}
	else if (command == 'Assault' || command == 'Auto-Assault') {
		params += "&submit=" + command + "&from_country=" + selectedFrom + "&to_country=" + selectedTo;
		tempFrom = selectedFrom;
		tempTo = selectedTo;
	}
	else if (command == 'Reinforce') {
		params += "&submit=" + command + "&quantity=" + selectedQuantity + "&from_country=" + selectedFrom + "&to_country=" + selectedTo;
	}
	else if (command == 'Play Set' || command == 'Play Group') {  // 'Play Group' is deprecated
		params += "&submit=" + command;
		for (var i=0, max=actionForm.elements["cards[]"].length; i<max; i++) {
			if (actionForm.elements["cards[]"][i].checked) params += "&cards[]=" + actionForm.elements["cards[]"][i].value;
		}
	}
	else if (command == 'full_log') {
		params += "&full_log=Y";
		params += "&full_chat=Y";
	}
	else if (command == 'full_chat') {
		params += "&full_chat=Y";
	}
	else if (command == 'Post Message') {
		params += "&message=" + encodeURIComponent(message.value);
		message.value = "";
		if (team) {
			if (team.checked) params += "&team=1";
			team.checked = team.defaultChecked;
		}
	}

	lastSend = new Date();
	var url = "game.php?"+lastSend.getTime();
	request.open('POST', url, true);
	request.onreadystatechange = handleResponse;
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.setRequestHeader("Content-length", params.length);
	request.setRequestHeader("Connection", "close");
	request.send(params);

	//timeoutId = window.setTimeout(timeout,10000);
	return false;
}

sendRequest2('full_log');