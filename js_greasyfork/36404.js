// ==UserScript==
// @name         Wanikani Forums: Rainbow Flairs
// @namespace    Wanikani Forums: Rainbow Flairs
// @version      1.6.1
// @description  Adds a button to toggle user's level flairs to rainbows.
// @author       Kumirei
// @include      https://community.wanikani.com*
// @require      https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36404/Wanikani%20Forums%3A%20Rainbow%20Flairs.user.js
// @updateURL https://update.greasyfork.org/scripts/36404/Wanikani%20Forums%3A%20Rainbow%20Flairs.meta.js
// ==/UserScript==
/*jshint esversion: 8 */

const textColor ="rgb(135, 83, 161)";
const gradientColors = "#f9c4fb , #dab3fc, #bdd6ff, #c3fdd2, #fcfec2, #f8d4a6, #f8b9b9";
var userList = "";
var userName = "";
var userID = "";
var subscription = "";
var subColor = "";
var subBackground = "#fff";
(function() {
		'use strict';

		// get list of users to flair
		userList = localStorage.getItem('RainbowFlairsUserList');
		if (userList === null || userList === "") {
				userList = [];
		}
		else {
				userList = $.parseJSON(userList);
		}
		console.log("Rainbow Flairs flaired users: "+userList);

		// Triggers
		// when you load the window
		window.addEventListener('load', initRainbows);

		// when navigating
		(function(history){
				var pushState = history.pushState;
				history.pushState = function(state) {
						initRainbows();
						return pushState.apply(history, arguments);
				};
		})(window.history);

		// back and forward buttons
		window.addEventListener('popstate', initRainbows);
})();

function initRainbows() {
		waitForKeyElements('.posts-wrapper', function(){
				$('.posts-wrapper').on('click', '.trigger-user-card', addButton);
				$(userList).each(function(e, i) {
						if (i % 2 == 0) {
								rainbowify(this);
						}
				});
		});
}

function addButton() {
		waitForKeyElements('.usercard-controls', function(){
				userName = $('#user-card h1 a').text().trim();
				userID = $('.trigger-user-card[href="/u/'+userName+'"]').closest('article').attr('data-user-id');
				$('.usercard-controls').append("<li><button onclick=\"toggleRainbow('"+userName+"', "+userID+")\" class='btn rainbowButton' title='Toggle flair for this user'>Toggle Rainbow!</button></li>");
				//rainbowify flair in usercard
				if (userList.includes(userName)) {
						rainbowify(userID);
				}
		});
}

toggleRainbow = function(userName, userID) {
		if (userList.includes(userID)) {
				userList.splice(userList.indexOf(userName), 2);
				unrainbowify(userID);
		}
		else {
				userList.push(userName, userID);
				rainbowify(userID);
		}
		localStorage.setItem("RainbowFlairsUserList",JSON.stringify(userList));
};

function rainbowify(userID) {
		if ($('head style[user-id="'+userID+'"]').length == 0) {
				$('head').append(
						'<style user-id="'+userID+'">'+
						'	[data-user-id="'+userID+'"] .avatar-flair {'+
						'		color: '+textColor+' !important;'+
						'		background: linear-gradient(-45deg, '+gradientColors+') !important;'+
						'	}'+
						'</style>'
				);
				$('#user-card .avatar-flair').css({'color': textColor, 'background': 'linear-gradient(-45deg, '+gradientColors+')'});
		}
}

function unrainbowify(userID) {
		$('head style[user-id="'+userID+'"]').remove();
		//unrainbowify usercard
		subscription = $('#user-card .avatar-flair').attr('class');
		if (subscription.includes('admins')) {
				subBackground = "#dd0093";
		}
		else if (subscription.includes('60')) {
				subBackground = "#fbc042";
		}
		else if (subscription.includes('lifetime')) {
				subBackground = "#d580ff";
		}
		else if (subscription.includes('paid')) {
				subBackground = "#89d5ff";
		}
		else {
				subColor = "#000";
				subBackground = "#f1f3f5";
		}
		$('#user-card .avatar-flair').css({'color': subColor, 'background': subBackground});
}
