// ==UserScript==
// @name              Popmundo Forum Post Timestamp
// @description       The script run only on forms pages and show timestamps of messages

// @author            Criyessei
// @version           2.0.0
// @license           CC BY-NC-ND

// @match             https://*.popmundo.com/Forum/Popmundo.aspx/Thread/*

// @grant             unsafeWindow
// @grant             GM_setValue
// @grant             GM_getValue
// @require           https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js

// @namespace         https://greasyfork.org/users/805141
// @supportURL        https://buymeacoffee.com/criyessei
// @downloadURL https://update.greasyfork.org/scripts/440189/Popmundo%20Forum%20Post%20Timestamp.user.js
// @updateURL https://update.greasyfork.org/scripts/440189/Popmundo%20Forum%20Post%20Timestamp.meta.js
// ==/UserScript==

/*
Copyright (c) 2025 Criyessei

Permission is granted to use and modify this software for personal or internal purposes only.

Redistribution, publishing, or sharing of this software, whether in original or modified form, to third parties is strictly prohibited.

The right to distribute this software remains exclusively with the copyright holder.

Commercial use is prohibited without explicit written permission.

All rights reserved by the author.

By using this software, you agree to these terms.
*/

/*
This script is completely free to use and will remain so.

If you find it helpful and would like to support its development,

you can make a small donation here: https://buymeacoffee.com/criyessei

Thank you for your support! 💖

                                                         Criyessei
*/

/*globals moment*/

let $ = unsafeWindow.jQuery;

const displayPoses = {
    "left": 0,
    "onTimeText": 1
}

// only changes below is allowed:
const preferences = {
	displayPos: displayPoses.onTimeText, //  displayPoses.left,
	showMessageEditTimeStamp: true,
	showMessageTimeStamp: true,
	forceLanguage: null, //"de",
};

const selectors = {
	messagesSelector: "#ppm-content >div.marginWrapper >div.talkbox:has(>div.talkbox-content):has(>div.talkbox-byline)",
	searchButton: "#ctl00_cphLeftColumn_ctl00_lnkBotSearch"
};
const finders = {
	message: {
		messageEditParagraphFinder: (message)=> message.find(">div.talkbox-content >div >p.em"),
		messageEditTimeTextFinder: (messageEditP)=> messageEditP.contents().last()[0],
		messageTimeParagraphFinder: (message)=> message.find(">div.talkbox-byline >p:first"),
		messageTimeTextFinder: (messageTimeP)=> messageTimeP.contents().last()[0],
	}
};
const parsers = {
	messageDateParser: /(?<day>\d{1,2})\.(?<month>\d{1,2})\.(?<year>\d{4}),\s(?<hour>\d{1,2}):(?<minute>\d{1,2})/
};

const supportedLocales = {
	tr: "tr",
	en: "en",
	pt: "pt",
	"pt-br": "pt",
	es: "es",
	it: "it"
};


(async function() {
    'use strict';

    await sleep(100);


    if (typeof moment === "undefined") {
        console.warn("moment.js not loaded on the page — skipping locale setup.");
        return;
    }


	await checkSupport(); // No, please don't remove. You seem like someone who knows, please find me

    let language = preferences.forceLanguage || detectLanguage();
	//console.log(`page language: ${language}`);

    if (language !== "en") {

		if (typeof unsafeWindow.moment === "undefined") unsafeWindow.moment = moment;

        loadScript(`https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/locale/${language}.min.js`, () => {
			console.log("Loading moment.locale: " + language);
            moment.locale(language);
            main();
        });

    }
	else {
        moment.locale("en");
        main();
    }



})();


function main() {

	let messages = $(selectors.messagesSelector);
	for(let i=0, len=messages.length; i<len; i++){
		let message = messages.eq(i);

		if(preferences.showMessageEditTimeStamp){
			let messageEditP = finders.message.messageEditParagraphFinder(message);
			if(messageEditP.length){
				let timeEl1 = finders.message.messageEditTimeTextFinder(messageEditP);
				let label1 = moment(timeText2Date(timeEl1.textContent)).fromNow();
				messageEditP.append(` <span style="font-family:monospace; font-size:12px; vertical-allign:middle; color:maroon; white-space:nowrap;">(${label1})</span>`);
			}
		}

		if(preferences.showMessageTimeStamp){

			let messageTimeP = finders.message.messageTimeParagraphFinder(message);
			let timeEl2 = finders.message.messageTimeTextFinder(messageTimeP);
			const startMoment = moment(timeText2Date(timeEl2.textContent));

			let label2 = startMoment.fromNow();

			let duration = moment.duration(moment().diff(startMoment));
			let hhmmss = moment.utc(duration.asMilliseconds()).format("HH:mm:ss");


			//DISPLAY
			switch(preferences.displayPos){
				case displayPoses.left:
					{
						let span = $(`<span style=" position: absolute; top: 0; font-size:11px; color:maroon; writing-mode: vertical-rl; /* text-orientation: upright; */ /* z-index: 2; */ " title="${hhmmss}">${label2}</span>`).appendTo(message);
						message.css({'overflow':'unset', 'position':'relative'});
						console.log(message.find('>div:first').height()+" - "+span.height());
						span.css('top', Math.max(3, parseInt((message.find('>div:first').height()-span.height())/2)))
							.css('left', -13-(span.width()-13.6));
					}
					break;
				case displayPoses.onTimeText:
						messageTimeP.append(` <span style="font-family:monospace; font-size:12px; vertical-allign:middle; color:maroon; white-space:nowrap;" title="${hhmmss}">(${label2})</span>`);
					break;
				default:
					break;
			}
		}
	}


	function timeText2Date(timeText){
		let {groups:{day, month, year, hour, minute}} = timeText.trim().match(parsers.messageDateParser);
		return new Date(year, month-1, day, hour, minute);
	}

}

function checkSupport(){
	const test = false;
	const freq = 3*86400*1e3;
	var data = GM_getValue("donationPopupShown", undefined);
	if(data == undefined) data = {counter:0, lastShown:undefined};

	var now = Date.now();
	if (!test && data.lastShown && (now-data.lastShown)<freq) {

		console.log(`Remaining: ${parseInt((freq - (now-data.lastShown))/1e3)}`);
		return Promise.resolve();
	}

	return new Promise((resolve)=>{

		const popupHtml = `
        <div id="donation-popup" style="
            display:none;
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            max-width: 500px;
            background: white;
            border: 2px solid #4CAF50;
            border-radius: 10px;
            box-shadow: 0 0 15px rgba(0,0,0,0.3);
            padding: 20px;
            font-family: Arial, sans-serif;
            z-index: 9999999;
			text-size:13;
            text-align: center;
        ">
            <h2 style="color:#4CAF50; margin-bottom: 10px;">Thank you for using the "Popmundo Forum Post Timestamp"!</h2>
            <p>This script is completely free to use and will remain so.</p>
            <p>If you find it helpful and would like to support its development,</p>
            <p><a href="https://buymeacoffee.com/criyessei" target="_blank" style="color:#4CAF50; font-weight:bold; font-size:15px; text-decoration:none;">💖Make a small donation here ☕</a></p>
            <p style="text-align:right; color:darkBlue;">Kind Regards <b><a href="mailto:criyessei@gmail.com" target="_blank">Criyessei</a></b></p>
			<p style="margin-top:10px;color:gray;">PS: You will not be disturbed by this being shown to you frequently. <br>Next show time: <span id="nextDonateTime"></span>.</p>
            <button id="donation-popup-close" style="
                margin-top: 5px;
                background-color: #4CAF50;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
            ">Sorrrry 🥲</button>
        </div>
        <div id="donation-popup-overlay" style="
            display:none;
            position: fixed;
            top:0; left:0; right:0; bottom:0;
            background: rgba(0,0,0,0.4);
            z-index: 9999998;
        "></div>
    `;

		$("body").append(popupHtml);


		$("#donation-popup-overlay").fadeIn(300);
		$("#donation-popup").fadeIn(500);

		$("#donation-popup-close, #donation-popup-overlay").click(() => {

			var popup = $('#donation-popup');
			popup.children().each(function(){
				$(this).css({"opacity":"0"});
			});
			var okay = $("<span/>").html("Okay, no Problem 🤪").hide();
			okay.css({
				"position": "absolute",
				"left": "50%",
				"top": "50%",
				"transform": "translate(-50%, -50%)",
				"font-size": "50px",
				"font-weight":"bold",
				"color":"red",
			});
			popup.append(okay);
			okay.fadeIn(400, ()=>{
				setTimeout(()=>{
					$("#donation-popup, #donation-popup-overlay").fadeOut(300, () => {
						$("#donation-popup, #donation-popup-overlay").remove();
						resolve();
					});
				}, 1e3);
			});

		});


		const now = Date.now();

		if(!test){
			data.lastShown = now;
			++data.counter;

			GM_setValue("donationPopupShown", data);
		}

		let nextDonateTime = $("#nextDonateTime");
		nextDonateTime.text(new Date(now + freq).toLocaleString());

	});
}

function detectLanguage(){
	const useBrowserLanguage = false;
	const defaultLanguage = "en";

	if(useBrowserLanguage){
		const rawLang = (document.documentElement.lang || navigator.language || defaultLanguage).toLowerCase();
		return supportedLocales[rawLang] || supportedLocales[rawLang.split("-")[0]] || defaultLanguage;
	}


	// detect game language

	let language;
	let searchButton = $(selectors.searchButton);
	if(searchButton != null){
		const text = searchButton.text().trim().toLowerCase();
		switch(text){
			case "ara": language = "tr"; break;
			case "search": language = "en"; break;
			case "procurar": language = "pt"; break;
			case "busca": language = "pt-br"; break;
			case "buscar": language = "es"; break;
			case "cerca": language = "it"; break;
			default: language = defaultLanguage;
		}
		// console.log(`${text} --> ${language}`);
	}

	return language || defaultLanguage;
}

function sleep(ms=1e3){
    return new Promise(res=> setTimeout(()=>res(), ms));
}

function loadScript(src, callback) {
	const s = document.createElement("script");
	s.src = src;
	s.onload = callback;
	document.head.appendChild(s);
}