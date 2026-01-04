// ==UserScript==
// @name         Wokecat Amongus Buttons
// @namespace    http://wokecat.com
// @version      1.0
// @description  Sus
// @author       Kevin + Lamp + Sammich
// @match        https://wokecat.com/main
// @icon         https://www.google.com/s2/favicons?domain=wokecat.com
// @grant        none
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/427885/Wokecat%20Amongus%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/427885/Wokecat%20Amongus%20Buttons.meta.js
// ==/UserScript==

$( document ).ready(function() {


 commsOcto.socket.on('userList', function(){

     setTimeout(() => {

menuOcto.manState({activePanel: menuView.userlist.panel.viewComponent.container});
const userListElement = document.getElementById("listedUsers").children;
for (let i = 0; i < userListElement.length; i++) {
	populateUserElement(userListElement[i]);
};

channelOcto.activeChannel.channelComms.socket.on("joined", function (channelName, data) {
	populateUserElement(document.getElementById(data.id));
});

function populateUserElement (userElement) {
	const userName = userElement.querySelector(".nickText").innerText;
	if (userName.includes("Bulb")) {
		const joinButton = document.createElement("BUTTON");
		joinButton.innerText = "Join";
		joinButton.addEventListener("click", function () {
			channelOcto.activeChannel.channelComms.handleInput('!join');
		});
		const startButton = document.createElement("BUTTON");
		startButton.innerText = "Start";
		startButton.addEventListener("click", function () {
			channelOcto.activeChannel.channelComms.handleInput('!start');
		});
		const wordsButton = document.createElement("BUTTON");
		wordsButton.innerText = "Kill Words";
		wordsButton.addEventListener("click", function () {
			channelOcto.activeChannel.channelComms.handleInput('/pm Bulb|!words');
		});
		const commandsButton = document.createElement("BUTTON");
		commandsButton.innerText = "Commands";
		commandsButton.addEventListener("click", function () {
			channelOcto.activeChannel.channelComms.handleInput('/pm Bulb|!commands');
		});
		userElement.children[0].append(joinButton);
		userElement.children[0].append(startButton);
		userElement.children[0].append(wordsButton);
		userElement.children[0].append(commandsButton);
	};
	const checkButton = document.createElement("BUTTON");
	checkButton.innerText = "Check On";
	checkButton.addEventListener("click", function () {
		channelOcto.activeChannel.channelComms.handleInput('/pm Bulb|!check ' + userName);
	});
	const voteButton = document.createElement("BUTTON");
	voteButton.innerText = "Vote For";
	voteButton.addEventListener("click", function () {
		channelOcto.activeChannel.channelComms.handleInput('!vote ' + userName);
	});
	const targetButton = document.createElement("BUTTON");
	targetButton.innerText = "Target";
	targetButton.addEventListener("click", function () {
		channelOcto.activeChannel.channelComms.handleInput('/pm Bulb|!target ' + userName);
	});
	userElement.children[0].append(checkButton);
	userElement.children[0].append(voteButton);
	userElement.children[0].append(targetButton);
};

         }, 0);
 });

});