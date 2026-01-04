// ==UserScript==
// @name         Freeanywhere helper
// @namespace    http://tampermonkey.net/
// @version      0.22
// @description  Auto finish tasks.
// @author       gortik
// @license      MIT
// @match        https://freeanywhere.net/*
// @connect      store.steampowered.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freeanywhere.net
// @grant 		 GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/512899/Freeanywhere%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/512899/Freeanywhere%20helper.meta.js
// ==/UserScript==

var	sessionID = '93b2539483e78547511f5c59',
	//https://freeanywhere.net/#/giveaway/182
	giveaway_id = document.location.href.match( /giveaway\/(\d+)/ )[1],
	// if false atleast one challenge failed and will not try to request key
	all_verified = true,
	token = window.localStorage.getItem( 'token' ),
	headers = {
		'accept': "application/json, text/plain, */*",
		'accept-language': "en",
		'authorization': `Token ${token}`
	};


function sleep( ms ) {
        return new Promise(resolve => {
		console.log('Sleep: ' + ms/1000 + 's.');
		setTimeout(resolve, ms)
	});
}

function get_TM(url, callback) {
	GM.xmlHttpRequest({
		method: 'GET',
		url: url,
		headers: {'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
		onload: response => callback( response.response, response)
	});
}

function getAsync( url, headers ) {
	return new Promise((resolve, reject) => {
		GM.xmlHttpRequest({
			method: 'GET',
			responseType: 'json',
			url: url,
			onload: function(response) {
				resolve(/*response.responseText*/ response);
			},
			headers: headers,
			onerror: function(error) {
				reject(error);
			}
		});
	});
}

function postAsync( url, data, headers ) {
	return new Promise((resolve, reject) => {
		GM.xmlHttpRequest({
			method: 'POST',
			url: url,
			headers: {'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
			responseType: 'json',
			data: (data) ? new URLSearchParams( data ).toString(): null,
			onload: function(response) {
				resolve(/*response.responseText*/ response);
			},
			onerror: function(error) {
				reject(error);
			}
		});
	});
}

//gets important steam variables
async function getSessionID( doc ) {
	let res = await getAsync( 'https://store.steampowered.com/account' );
	doc = res.responseText;

	if ( doc.indexOf('//steamcommunity.com/login/' ) != -1) {
		alert( 'NOT Logged on Steam' );
		throw 'NOT Logged on Steam';
	}
	else
		console.log( 'Logged on Steam.' );

	sessionID = doc.match( /g_sessionID = \"(\w+)\";/ )[1];
	console.log( sessionID );
}

//appid can be just appid or store link with appid
async function addToWishlist( appid ) {
	//https://store.steampowered.com/app/3279160/...
	appid = isNaN(appid) ? appid.match(/app\/(\d+)\/?/)[1] : appid;

	let	url = 'https://store.steampowered.com/api/addtowishlist';
	let	res = await postAsync( url, { sessionid: sessionID, appid: appid} );
	let	json = res.response;

	console.log( `${appid}: ${json.success} (${json.wishlistCount})`);
}

// info about all tasks
async function getJSON( id ) {
	let url = `https://freeanywhere.net/api/v1/giveaway/${id}/`;
	let	res = await getAsync( url, headers );
	let json = res.response;
	// if steam tasks are not actually checked by site (no need to connect to steam)
	//for ( let challenge of json.challenges ) { challenge.challenge_provider = 'website' }
	return json;
}

async function verifyChallenge( challenge_id ) {
	let url = `https://freeanywhere.net/api/v1/giveaway/${giveaway_id}/challenge-status/${challenge_id}/`;
	let res = await getAsync( url, headers );
	let json = res.response;

	if ( json.status == false )
		all_verified = false;
	console.log( `Challenge ${json.id} success: ${json.status}`)
}

async function getKey( id ) {
	// continue if no task has failed
	if ( !all_verified )
		return;

	let	url =  `https://freeanywhere.net/api/v1/giveaway/${id}/reward/`
	let res = await getAsync( url, headers );
	let json = res.response;

	console.log( json );
	console.log( `Key: ${json.reward}` );
	return json.completed;
}

// returns true if json contains steam quests
function hasSteamQuest( json ) {
	return json.challenges.some( e => e.challenge_provider == 'steam' );
}


async function verify() {
	let	json_all = await getJSON( giveaway_id );

	if ( hasSteamQuest( json_all ) ) {
        	await getSessionID();
	}

	let	challenges = json_all.challenges.filter( e => /*e.challenge_provider == 'website' &&*/ e.is_success == false );
	for ( let challenge of challenges ) {
		console.log( 'Challenge: ' + challenge.id );
		if ( challenge.challenge_provider == 'steam' ) {
			await addToWishlist( challenge.link );
		}
		let json = await verifyChallenge( challenge.id );

		await sleep( 3000 );
	}
}


(function() {
    'use strict';

    // Your code here...
})();

async function start2() {
	//await getSessionID();
	await verify();
	await getKey( giveaway_id );
}

start = start2

