// ==UserScript==
// @name        Enhanced GazelleGames pet leveling info
// @namespace   v3rrrr82xk1c96vvo1c6
// @match       https://gazellegames.net/user.php?id=*
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.deleteValue
// @grant       GM.listValues
// @version     1.5.4.18
// @icon        https://gazellegames.net/favicon.ico
// @description Adds pet leveling info and last dropped item, plus a Pet Laziness tracker, to your profile page
// @author      lunboks & modified by InspireToExpire, Enhanced by HerrKommissar
// @run-at      document-start
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/526113/Enhanced%20GazelleGames%20pet%20leveling%20info.user.js
// @updateURL https://update.greasyfork.org/scripts/526113/Enhanced%20GazelleGames%20pet%20leveling%20info.meta.js
// ==/UserScript==

(async function () {
	"use strict";
	const archiveRecTime = "_archiveLowTime"; //Use with pet UID
	const archiveRecChance = "_archiveLowChance";
	const forceStartTimeKey = "forceStartTimes";
	const disable_color_key = "disable_colored_msg";
    const whip_key = "enable_pet_whip";
	const saveIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC/klEQVR42pWSX2hbZRiHny85SZuma5tsWZvEdq0tq2mnVKG7mkyKrSjeiMKEDS8cbAjeiGwwL2SDjaIou5DJYOCNogwd7GIrq1q0+Gdbu7pNzZbUpmyznbT5t8SYnJw05/VrusFuZO6FwzkHznm+5/29rzr0c0qUYVDBwFst0Fhfh+2QPLY0oRQKcDoNXIYLRMhm7nAh5+LPpaJ/+vVNWfXujynZMeDnm4zi2X8S9D8W1B+u/qZL9OXwkJi/wXRiicHuVtx1bj63QkxcWiSbLofUge+X5dHOJqZyTl74O8Zzfa3kq47ayVVbCG5s4cDRL7jetY2R9BQ9/RG+W/8EPrvI+KU0at+3SxLpamY672Ikd5VnegMUbEMDRHchtPsbGT11kfTwMP0/jBEKBBjzD9JZbzETy6DeHl+Uni5fDTCcmWFoswbIXYA2aNcG+4+dJtY7wtCtcSJbIpzzbyXkMtcAe07OyeMDIaayGpA6z/N9AfLirgHEhnXrvEz8epPk3CwtHZ3U1Rt83TxIWAN+ua5b2PtlQnr6gkxXPDwZm2SovZ6iWgPcy9Hb4MHtBKNS5sxsjmjfdtqsAr9Fl1BvfDUvbZvD/PHTBYyFOPZKBXE4uL/k7t1hayWnC3dnL3UDW4lfvYXa9WlMfN1t7PWl9Ai7+T8VjSU4eNvPclwbvPZZXFwdrbwVSBHwtTB2dgLRFkWzSKlkYpVKlKwyFdMkmUwy+sEoyewd9t3wkYsvonZ+ck1kUyvvhLI1Az251QV8oMGbc00UYrdRr574XUxtcLgj91AGu6ONWPEF1MsfX5FCR4gPu/OEg+tJ61136hBFq4iStbXWz0rnWimvsGGDn7+Ws+y47IVZHeJLx2YkGQxzPFKoGYyfm2SlYlEy9cnFIuVVE7OMVTbJpNMcee9wzeDF8x5cCQ14+qOolHtCvN88z/anHqGUzuNwrvWq7o1wNRj9Vq1WafD7mLyywCs32/FcvoYK758UW2taxQo5a+W+qP47SbfhwKs0rLmBfwEejXGgqAgtxQAAAABJRU5ErkJggg==";
	const loadIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC9klEQVR42pWTXUgUURTH/3dnd2c/ZkZdU8y01CTd2NbUbIXQSMiH3nroIZCgHn2pCKES0tAHowx6yAclKQkfDHwNIntJAwNtzVzFz1JWS13d3Tv7Nbsz23WLcCGC/jD3zD137m/OPfccAqbhpa4op9PiWnJvRsDrCWKJKHtLOZgF9DoeippMeTj2KCqMl4618mRoviPpyLEgxhbJ3ioblv0U2cZCNtF+A/TwxTdQIOoZwMA8bOQIPFsRlbya7wwV28yWsKKBY04lEcZGQMJl+3Xs19DsE4iCDxZOgsZCNfE6LPsiEfJyroMezbIIUVVlobHQk2F83zGjydGSBhj0dEOy+mE1ZkBlAF5HsLIbkcmA5z4DWIWwqqUACqJY3+ZxtSId8Nz9CNk2CrNOgsqOZtLrsLQdkkn/NAMcsAoJlZ1Yp4AqQWxs8miuaU8D9Ey0M4AMyWBjvzHCwCJY2pZl0utuo/Y8Qfi8vpP60EwkJBMmXDt1Iw3QPXY3ZQ2cHqouihNHcrHgZYA+dyd1HsoRvKEtvB6fQXdjH8RMK/6mHR/FnXfNOF9TjoOWXMx4f8jk6WQbjVvmhYWoB2v+dWxNFOPDzfFfl79PVJZR3+NCgcuPPDEXZVY7TLRUJhcGK2mBQxEQFSFYjPCsrYC6CzF6eywNUN3lQKErjCJbAUKROBImGd5po0zO9VfQky5RCFJWWqwCxUwDJhfnoH1xYOTW29Tmuge1EF1e2POLEQyoLEdJmCUDpsb8DPCsijpcZiEUTmB1NQifPwizQLDwdRP2ZC1CMRnfpE8oyy9CiCqwZUg4XJQJk4nD7HhYJmd7q6izziq4l+bRXjqAhrLGP2ErCQWEEJZ5A1JNwPIyMvcG9xavwFlSjpn3VCb1vVVhx5kMs3t5Fh2lL9BQ3oh/aQ/QutCEypLjmBkNREjtY2ei+qKN01h7La9sY2s3wHpi/5bkb0vAqh05WSKKS3JAjHpMDu+qqcs6/dAZ462cEf+hWEhTPrZM8T8Bpy04JENi6VkAAAAASUVORK5CYII=";
	const settingsIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADWUlEQVR42n1Ta0yTVxh+zkfvfkBZK1KFUineNiACIzidtyw2OjREjCUuQ+aiQcNmdPgDFq+zqNnivATdYEaCbky81BhlRoguzstGhE2Go3O1sRSQElYsUHvvd/z6GRMviSc5OSdvnvfyvO/zErxyii+4CpUI1xEOiQ/8SOJNNF2GQcoQuxsxG5sKVRdfxJNXA6z4+dGlbUWaAsr/TU2O/qhta7F2UhRoMg80n101celrAeaeGMj3uUb3e4Jes0IsNx4vn5YftXuDz0AKybP30yP327wh32lWoiiSq+IqbqzWtJGcYw6JMhT474tl6alONwclyyCGAfad6cbYyAg4yiE2Xokq4zvgOMDt4ZCkZPDtxQc9brF0KsmosaaliImtyqhHnAK42unHd42tiAQ84CJhIHpBwUgV2FBaCMNMOUa9wN7TNvSGqF6goK9qXjQvJ7vFkKuBqbFTcBYo9FmEV6pO5gNFwMhY7Fw7Hy0dA/jtz78Mtr0FrUS3+czu8PDQkvVrS3JdY0HctjgxaL0LLuCFo36dkEC75odoT8HqZmJBthbJKhZH6xo6RG+Nv0ze2/8PrSx+GxGe35X2QdzsdsLvtMJWs/KlCek3nqMiVoXZ2VOxNE8DkYjvU1M3SIapk+74KAsBnqqlbxTNbT1w3buG3p82vRRAV/YjjdVmYvG7KcjSJUAmBnY1/g2i+eTQbt/DriUflm3PnZcxEe3WIZgP70Tc9Lmw135Mnjt7HZ1Yvq4COVPUuN71CL/UftUhn5x5WQDEGT5blDyntGWLMRciQmC+bcf1+mrEpgtygMfegQ/WVGLl+6nwB6Olt6PvVoNhtKWmlahXVadJObFt65ebBLBEIsKEeIJ7dh8sjmHBlpWmQmaqDM7HUXFFQHltmPYcRIAJ6UliydcSMuaxLi8t1/a6nsDPN2N+lgbTJ7FITAB4TWFoBLjf78W1u/2Q8glS1ONwvuGIg8ayUwQKmrLv8/0PLd+EvcP/MyGu0FBezQil+8L8dCgSWAlCEYqrRyvBSWWnRPL4JJluRtVA3fo/Xlum5JKarryFBRlB3vHO+VpE9ZtXtAGSGII7v176t+/k5zPeuI2pFWcXUPfjeup/oqNK5SwB5Hb/DkZMGPX4FT0HjOYX8U8BAC1WEP5RKIoAAAAASUVORK5CYII=";
	const helpIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADcklEQVR42mWTbWxTZRTH//fe3tt729uu7da9ONoNFmrYS3CbzgQ+OIgN3YsmLm7hm8QIIcEsflL2RROMAY0RP0iyaAzEoH7A7QNS1zESUAIypXNvtmNxnaPTvbTr2t7e9rLee+tDMVP0fHqePP9zzu+c5xwK/7VdA90w2noYB98l2O1mUEBuMyVrCdkPJTWMyOkr/5ZT26fGD0Qo6qWy9hZfzb4nUVppAUtpoB9oyGkFxBMKln+aR/z6ZAA804vZNzP/BGgdNEFVQ8+8drCmed8OlKYlHHDQcDs4eJwiQmsShu5l8FuJDXMTK/h58NoSDGw9gsezjwI0nQt43/AeatnvRuh2BN/01oIThf9V9/qXYdBNbswFVzB29uooZk74KDz1WWejb4//pVfbcOdeGguRDZxqYFFdIeLs7XU0V/MY8NbCyDH4jmT/eEqGu7EK48OTmA2Euygc/Pr8sZMHjsQoDkpOBavriP0RQ5oRUFHrxMJsFCN9LuxxWXFzLoaLUX2b6NMz1y9Q5a+Mrr1wYn+5nHwAwVBARgXiMoWMTmM6FEefNY0v+luIvICewTCcdaVFZ80m4ttzt9Ypd/8PucPH2vjNeBYLSQ3LKRV5DdginVfnolj98Gkip9H7yTSGYkY8/2wl3E5DMcjYxQmFanhnIvfy4QbeP51GLg9wDAWTyGL87ioud1jRQRw+v/Unjo5IaGurQkbKQ2ALqNkhIhwIK9SugeBac3d9eXQlS0p49ClbJKMSS+JqXwXKrDy8H4WxXF2JKhNBJy1Q1AJc5DJ5JbROlfTfPd/a4TkisDQ0VXtYKgw8g/VVGTOTqzCZaPAmAc0tFdDy+sNnMAaG0OoIjsxfoExHxzv3trv9dR4HJIJH0WS6KAqLS0kc9xix22HEuz+mwblsEBlCQBAsFg4L8wlM3bjfVWS2nfw14H1x5yELT9AVDWtZHeUbaXzV90SxpLyUQecdHU4rC4GjISk6xi4vjibPNPiKAexvzZjMZaZQ+3NVNWVElJA13I8kMdThgMPM4r2bCfzC8nDZOcTTedz4fmVJjmfrN99vym4vU+nb8yJtYS+17nX4drsEEAhEfpdgMTLY4jjUOQl2VEZwKhHQpXzvxilP5vFt/Nvspxe7SxzGHrvF0GU2c2YyDlCVLTmW0vyphDK8ObDzsXX+C6LyYkG4TGlfAAAAAElFTkSuQmCC";
	const whipSpriteURL = "https://ptpimg.me/y1xigu.gif";
	const settingsBG = "/static/styles/game_room/images/smokeybackground.jpg";
	const timeZoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
	var avatarImage = ''; //Can't get this until page load since the script is async

	const disable_color_flag = await GM.getValue(disable_color_key);
	if (!disable_color_flag) {
		GM.setValue(disable_color_key, false);
	}
    const enable_whip = await GM.getValue(whip_key);
	if (!enable_whip) {
		GM.setValue(whip_key, false);
	}



    //[TODO] - Maybe?
    //Get stored pet values and records
/*  const petStores = await GM.listValues();

    if (petStores){
    const keyStrings = ['_archiveLowChance', '_record', 'forceStartTimes'];
        petStores.forEach(function(key, idx){
           if (keyStrings.some(v => key.includes(v))){alert("");}
        });
    }
*/

	let l = Math.floor(window.pageXOffset + ((window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) * .4));
	let t = Math.floor(window.pageYOffset + ((window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * .4));
	const settingsStyle = `
	#settings_panel {
	    height: 60vh !important;
	    width: 75vh !important;
	    position: fixed !important;
	    position: fixed;
	    left: 50%;
	    top: 50%;
	    transform: translate(-50%, -50%);
	    z-index:99999;
        display: none;

	}

    #block_layer {
        position: fixed !important;
        height: 100%;
        width: 100%;
        z-index: 99998;
        background-color: rgba(0,0,0,0.5);
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: none;
    }
	`;

	const settingsStyleSheet = document.createElement("style");
	settingsStyleSheet.innerText = settingsStyle;
	//const styleSheet = document.createElement("style");
	//styleSheet.innerText = styles;

    //Modal Layer to block interaction
    const blockLayer = document.createElement("div");
    blockLayer.id="block_layer";



	const settingsPane = document.createElement("div");
	settingsPane.id = "settings_panel";
	settingsPane.style.backgroundImage = "url(" + settingsBG + ")";

	const noColor = document.createElement("input");
	const ncLabel = document.createElement("label");
    //Header & Close Button
    const hdr = document.createElement("h3");
    hdr.innerText="Settings";
    hdr.style.maxwidth='300px';
    const btnClose = document.createElement("button");
	btnClose.title = "Close Window";
    btnClose.value="X";
	btnClose.innerText = "X";
	btnClose.style.width = "16px";
	btnClose.style.height = "16px";
	btnClose.style.cssFloat = "right";
    btnClose.style.right = 20;
	btnClose.addEventListener('click', function () {
       settings_on(false);
	});

    let Setting = document.createElement("div");
    hdr.appendChild(btnClose);
    Setting.appendChild(hdr);
    Setting.appendChild(document.createElement("br"));
    const lblLoad = document.createElement("label"); lblLoad.innerText="Most setting changes won't take affect until the page reload";
    settingsPane.appendChild(Setting);

    //Help Link
    const btnHelp = document.createElement("img");
    const lblHelp = document.createElement("label");
    btnHelp.style.width='16px';btnHelp.style.height='16px';
    btnHelp.src='url('+helpIcon+')';
    lblHelp.innerText="Go to Script Page for updates, help, \& bug reports";
	btnHelp.style.background = "url('" + helpIcon + "')";
    btnHelp.style.cursor = 'pointer';
    lblHelp.style.cursor = 'pointer';
	btnHelp.addEventListener('click', function () {window.open("https://greasyfork.org/en/scripts/526113-enhanced-gazellegames-pet-leveling-info", "_help");});
    lblHelp.addEventListener('click', function () {window.open("https://greasyfork.org/en/scripts/526113-enhanced-gazellegames-pet-leveling-info", "_help");});
    Setting = document.createElement("div");
    Setting.appendChild(btnHelp);
    Setting.appendChild(lblHelp);
    Setting.appendChild(document.createElement("br"));Setting.appendChild(document.createElement("br"));
    Setting.appendChild(lblLoad);
    settingsPane.appendChild(Setting);


    //Settings
    ncLabel.innerText = "Disable Color Coding";
	noColor.type = "checkbox";
	noColor.id = "nocolor";
    noColor.checked = (disable_color_flag);
    noColor.addEventListener('click', function(){toggle_setting(noColor,disable_color_key);});
    ncLabel.addEventListener('click', function(){toggle_setting(noColor,disable_color_key);});
    Setting = document.createElement("div");
	Setting.appendChild(noColor);
	Setting.appendChild(ncLabel);
    settingsPane.appendChild(Setting);

    const whipit = document.createElement("input");
	const whiplbl = document.createElement("label");
    const whipnote = document.createElement("label");
	whiplbl.innerText = "Enable Pet Whip";
	whipit.type = "checkbox";
	whipit.id = "whip";
    whipit.checked = (enable_whip);
    whipit.addEventListener('click', function(){toggle_setting(whipit,whip_key);});
    whiplbl.addEventListener('click', function(){toggle_setting(whipit,whip_key);});
    whipnote.innerText = "*For Catharsis Only!";
    Setting = document.createElement("div");
	Setting.appendChild(whipit);Setting.appendChild(whiplbl);Setting.appendChild(document.createElement("br"));Setting.appendChild(whipnote);
    settingsPane.appendChild(Setting);







	let forcedStarts = await GM.getValue(forceStartTimeKey);
	if (!forcedStarts) {
		forcedStarts = {};
		GM.setValue(forceStartTimeKey, forcedStarts);
	}
	const theirUserID = new URLSearchParams(location.search).get("id");
	const ownUserID = await GM.getValue("you").then((yourID) => {
		if (yourID) {
			return yourID;
		}

		return new Promise((resolve) => {
			window.addEventListener("DOMContentLoaded", () => {
				yourID = new URLSearchParams(
					document.body.querySelector("#nav_userinfo a.username").search
				).get("id");
				GM.setValue("you", yourID);
				resolve(yourID);
			});
		});
	});

	if (theirUserID !== ownUserID) {
		return;
	}

	let apiKey = await GM.getValue("apiKey");

	if (!apiKey) {
		if (
			!(apiKey = prompt(
				"Please enter an API key with the 'Items' and 'User' permission to use this script."
			)?.trim())
		) {
			return;
		}
		GM.setValue("apiKey", apiKey);
	}

	const equipEndpoint =
		"https://gazellegames.net/api.php?request=items&type=users_equipped&include_info=true";
	const options = {
		method: "GET",
		mode: "same-origin",
		credentials: "omit",
		redirect: "error",
		referrerPolicy: "no-referrer",
		headers: {
			"X-API-Key": apiKey,
		},
	};

	const equipment = await (await fetch(equipEndpoint, options)).json();

	if (equipment.status !== "success") {
		if (equipment.error === 'APIKey is not valid.') {
			alert("Invalid API Key.");
			GM.deleteValue("apiKey");
			window.location.reload();
		} else if (equipment.error == "rate limit exceeded") {
			//just fail silently
			return;
		} else {
			alert("User Equipment API Error: " + equipment.error);
		}
		return;
	}

	options.Limit = 50;
	const userlogEndpoint = `https://gazellegames.net/api.php?request=userlog&search=dropped`;
	const userLog = await (await fetch(userlogEndpoint, options)).json();

	if (userLog.status !== "success") {
		if (userLog.error === 'APIKey is not valid.') {
			//SNH - if we got this far the equipment API should have already passed
			alert("Invalid API Key.");
			GM.deleteValue("apiKey");
			window.location.reload();
		} else if (userLog.error == "rate limit exceeded") {
			//just fail silently
			return;
		} else {
			alert("User Log API Error: " + userLog.error);
		}
		return;
	}

	function toInt(value) {
		return typeof value === "number" ? value : parseInt(value, 10);
	}

	const xpreqs = [
		0, 70, 278, 625, 1112, 1737, 2500, 3403, 4445, 5625, 6945, 8403, 10000, 11737
	];

	const levelingPetIDs = new Set([
		"2509", "2510", "2511", "2512", "2513", "2514", "2515", "2521",
		"2522", "2523", "2524", "2525", "2529", "2583", "2927", "2928",
		"2929", "2933", "3215", "3216", "3237", "3322", "3323", "3324",
		"3369", "3370", "3371", "3373", "3441",
		"3169", "3487", "2507", "3213", "3214", "3170", "3530","3559"
	]);
	const lvlbuff = [
		1, 1, 1, 1, 1.333, 1.667, 2, 2.333, 2.67, 3, 3.333, 3.667, 4
	];
	const pet_chance = {
		"2509": { "drop": 60, "special": 300, "cooldown": 24 },//Bronze Dust Dwarf Companion
		"2510": { "drop": 90, "special": 600, "cooldown": 24 },//Iron Dwarf Companion
		"2511": { "drop": 120, "special": 750, "cooldown": 24 },//Gold Dwarf Companion
		"2512": { "drop": 30, "special": 300, "cooldown": 24 },//Sand Dwarf Companion
		"2513": { "drop": 150, "special": 1000, "cooldown": 24 },//Mithril Dust Dwarf Companion
		"2514": { "drop": 200, "special": 0, "cooldown": 24 },//Magic Dust Dwarf Companion
		"2515": { "drop": 200, "special": 0, "cooldown": 24 },//Adamantium Dwarf Companion
		"2521": { "drop": 180, "special": 0, "cooldown": 24 },//Mario Companion
		"2522": { "drop": 180, "special": 0, "cooldown": 24 },//Baby Whale Pet
		"2523": { "drop": 65, "special": 65, "cooldown": 24 },//Dove Pet
		"2524": { "drop": 60, "special": 0, "cooldown": 60 },//Green IRC Slime
		"2525": { "drop": 60, "special": 0, "cooldown": 60 },//Blue IRC Slime
		"3237": { "drop": 60, "special": 0, "cooldown": 60 },//Rainbow IRC Slime
		"2529": { "drop": 180, "special": 0, "cooldown": 24 },//Companion Cube Pet
		"2583": { "drop": 7, "special": 24, "cooldown": 108 },//Ballon de Billie
		"2927": { "drop": 200, "special": 0, "cooldown": 24 },//Amethyst Dust Dwarf Companion
		"2928": { "drop": 120, "special": 750, "cooldown": 24 },//Jade Dust Dwarf Companion
		"2929": { "drop": 65, "special": 300, "cooldown": 24 },//Quartz Dust Dwarf Companion
		"2933": { "drop": 7, "special": 24, "cooldown": 108 },//Ballon de Billie Vert
		"3215": { "drop": 15, "special": 0, "cooldown": 84 },//Farmer Dwarf Companion
		"3216": { "drop": 50, "special": 0, "cooldown": 108 },//Garlic Dwarf Companion
		"3322": { "drop": 30, "special": 120, "cooldown": 24 },//Young Snowman
		"3323": { "drop": 25, "special": 120, "cooldown": 24 },//Frosty Snowman
		"3324": { "drop": 40, "special": 140, "cooldown": 24 },//Happy Snowman
		"3373": { "drop": 60, "special": 500, "cooldown": 23 },//Gold Dragon
		"3369": { "drop": 60, "special": 500, "cooldown": 23 },//Red Dragon
		"3370": { "drop": 60, "special": 500, "cooldown": 23 },//Blue Dragon
		"3371": { "drop": 60, "special": 500, "cooldown": 23 },//Green Dragon
        "3559": { "drop": 60, "special": 450, "cooldown": 23 },//Black Dragon

		"3441": { "drop": 32, "special": 0, "cooldown": 91 },//Pumpkin Dwarf
		"3169": { "drop": 65, "special": 300, "cooldown": 24 },//Baby Alien
		"3487": { "drop": 160, "special": 160, "cooldown": 24 },//Bat Company
		"2507": { "drop": 7, "special": 24, "cooldown": 108 },//Billy's Golden Balloon
		"3213": { "drop": 15, "special": 0, "cooldown": 84 },//Lost Farmer Dwarf Companion
		"3214": { "drop": 50, "special": 0, "cooldown": 108 },//Garlic Dwarf Companion
		"3170": { "drop": 180, "special": 0, "cooldown": 24 },//UFO
		"3530": { "drop": 65, "special": 65, "cooldown": 24 },//Memorial Budgie
	};
	const pets = [];

	for (const equip of equipment.response) {
		const type = equip.item.equipType;

		if (
			type &&
			String(type) === "18" &&
            (String(equip.slotid) === "14" ||String(equip.slotid) === "15") &&
			levelingPetIDs.has(equip.itemid.toString())
		) {

			pets.push({
				name: equip.item.name,
				xp: toInt(equip.experience),
				lv: toInt(equip.level),
				id: String(equip.itemid),
				uid: String(equip.equipid),
				slot: toInt(equip.slotid),
			});
		}
	}

	if (!pets.length) return;

	pets.sort((first, second) => first.slot - second.slot);

	//This is where we process loading pet data from storage, since it has to be done in the main function, so the events
	//can only set flags to run on load
	let doRestore = await GM.getValue("restoreArchive");
	if (doRestore) {
		GM.setValue("restoreArchive", false);
		console.log("%o", pets);
		let restorePetId = await GM.getValue("restorePetId");
		if (restorePetId) {
			GM.deleteValue("restorePetId");
			let storedRecord = await GM.getValue(restorePetId + archiveRecTime);
			if (storedRecord) {
				GM.setValue(restorePetId + "_record", storedRecord);
			}
		}
	}

	const box = document.createElement("div");
	const innerBox = document.createElement("div");
	const list = document.createElement("ul");
    const heading = document.createElement("div");
/*
    const btnColorToggle = document.createElement("button");

	btnColorToggle.title = "Toggle Color Coding"
	btnColorToggle.style.background = "url('/static/styles/game_room/images/icons/views.png')";
	btnColorToggle.style.width = "16px";
	btnColorToggle.style.height = "16px";
	btnColorToggle.style.cssFloat = "right";
	btnColorToggle.addEventListener('click', function () {
		if (!disable_color_flag) {
			GM.setValue(disable_color_key, true);
			disable_color_flag = true;
		} else {
			GM.setValue(disable_color_key, false);
			disable_color_flag = false;
		}
		window.location.reload();
	});
*/
	const btnSettings = document.createElement("button");
	btnSettings.title = "Toggle Settings";
	btnSettings.style.background = "url('" + settingsIcon + "')";
	btnSettings.style.width = "16px";
	btnSettings.style.height = "16px";
	btnSettings.style.cssFloat = "right";
	btnSettings.addEventListener('click', function () {
		settings_on(true);
	});



	box.className = "box_personal_history";
	innerBox.className = "box";
	heading.className = "head colhead_dark";
	list.className = "stats nobullet";
	list.style.lineHeight = "1.5";

	heading.append("Pet Leveling");
//	heading.appendChild(btnColorToggle);
	heading.appendChild(btnSettings);
	innerBox.append(heading, list);
	box.append(innerBox);

	function totalXP(lv) {
		return Math.ceil((lv * lv * 625) / 9);
	}

	function xpToTimeString(xp) {
		const days = Math.floor(xp / 24);
		const hours = xp % 24;
		let timeString = "";

		if (days) {
			const s = days === 1 ? "" : "s";
			timeString = `${days} day${s}`;
		}
		if (hours) {
			if (timeString) {
				timeString += " ";
			}
			const s = hours === 1 ? "" : "s";
			timeString += `${hours} hour${s}`;
		} else if (!timeString) {
			timeString = "0 hours";
		}

		return timeString;
	}

	const listItems = [];

	for (const pet of pets) {

		const liItem = document.createElement("li");
		const liLevelInput = document.createElement("li");
		const liTimeOutput = document.createElement("li");
		const shopLink = document.createElement("a");

		if (listItems.length > 0) {
			const hr = document.createElement("hr");
			listItems.push(hr);
		}

		liItem.style.marginTop = "0.6em";
		liLevelInput.style.paddingLeft = "10px";
		liTimeOutput.style.paddingLeft = "10px";

		shopLink.style.fontWeight = "bold";
		shopLink.href = `/shop.php?ItemID=${pet.id}`;
		shopLink.referrerPolicy = "no-referrer";
		shopLink.title = "Shop for this pet";

		const nextLevel = pet.lv + 1;

		const targetLevelInput = document.createElement("input");
		targetLevelInput.type = "number";
		targetLevelInput.required = true;
		targetLevelInput.inputmode = "numeric";
		targetLevelInput.style.width = "3em";
		targetLevelInput.min = nextLevel;
		targetLevelInput.max = Math.max(999, nextLevel);
		targetLevelInput.value = nextLevel;

		const displayTimeDifference = (toLevel) => {
			const missingXP = totalXP(toLevel) - pet.xp;
			liTimeOutput.textContent = xpToTimeString(missingXP);
		};

		displayTimeDifference(nextLevel);

		targetLevelInput.addEventListener("input", function () {
			if (this.checkValidity()) {
				displayTimeDifference(parseInt(this.value, 10));
			}
		});

		targetLevelInput.addEventListener("change", function () {
			setTimeout(() => {
				if (!this.reportValidity()) {
					liTimeOutput.textContent = "";
				}
			});
		});

		shopLink.append(pet.name);
		liItem.append(shopLink);
		liLevelInput.append(`Level ${pet.lv} → `, targetLevelInput);

		listItems.push(liItem, liLevelInput, liTimeOutput);

		const userLogResponseArray = await userLog.response;

		let lastDroppedItem = "No items found";

		function extractPetDetails(message) {
			const petNameMatch = message.match(/level \d+ (.+?) \(\w+ slot\)/);
			const petSlotMatch = message.match(/\((\w+) slot\)/);
			if (!petNameMatch || !petSlotMatch) return null;

			const itemName = message.match(/dropped(?:\s+a)? (.+)\.$/);
			if (!itemName) return null;

			const petLevelMatch = message.match(/level (\d+)/);
			const petLevel = petLevelMatch ? petLevelMatch[1] : "Unknown";
			const petSlot =
				petSlotMatch[1] === "Left"
					? 14
					: petSlotMatch[1] === "Right"
						? 15
						: "Unknown";

			return {
				itemName: itemName[1],
				petName: petNameMatch[1],
				petLevel,
				petSlot,
			};
		}

		function getTimeAgoString(timeDifferenceMs) {
			const seconds = Math.floor(timeDifferenceMs / 1000);
			const minutes = Math.floor(seconds / 60);
			const hours = Math.floor(minutes / 60);
			const days = Math.floor(hours / 24);

			if (days > 0) {
				return `${days} Day${days > 1 ? "s" : ""} ${hours % 24} Hour${hours % 24 > 1 ? "s" : ""
					} ${minutes % 60} Minute${minutes % 60 > 1 ? "s" : ""} Ago`;
			} else if (hours > 0) {
				return `${hours} Hour${hours > 1 ? "s" : ""} ${minutes % 60} Minute${minutes % 60 > 1 ? "s" : ""
					} Ago`;
			} else if (minutes > 0) {
				return `${minutes} Minute${minutes > 1 ? "s" : ""} ${seconds % 60
					} Second${seconds % 60 > 1 ? "s" : ""} Ago`;
			} else {
				return `${seconds} Second${seconds > 1 ? "s" : ""} Ago`;
			}
		}

		let thisPet = {};
		let decora = false;
		let decorb = false;
		let hasArchive = false;
		let record = "";
		let chance = 0.0;
		if (userLogResponseArray.length > 0) {
			for (const petDropLog of userLogResponseArray) {
				const petDropInfo = extractPetDetails(petDropLog.message);
				if (!petDropInfo) continue;
				const { itemName, petName, petLevel, petSlot } = petDropInfo;

				if (
					itemName &&
					petName &&
					petSlot === pet.slot &&
					petName.toLowerCase().includes(pet.name.toLowerCase())
				) {
					if (petSlot === 14 || petSlot == 15 && pets.length < 2) {
						thisPet = {
							"type": pets[0].id,
							"name": pets[0].name,
							"id": pets[0].uid,
							"lvl": pets[0].lv,
							"xp": pets[0].xp,
							"cooldown": pet_chance[pets[0].id].cooldown,
							"oncooldown": false,
							"forced": false
						};
					} else if (petSlot === 15) {
						thisPet = {
							"type": pets[1].id,
							"name": pets[1].name,
							"id": pets[1].uid,
							"lvl": pets[1].lv,
							"xp": pets[1].xp,
							"cooldown": pet_chance[pets[1].id].cooldown,
							"oncooldown": false,
							"forced": false
						};
					}

					if (forcedStarts[thisPet.id]) {
						thisPet.forcedStart = forcedStarts[thisPet.id];
					}

					//Check if the pet has a forced start time, and if it's more recent than the last drop time
					const dropTime = new Date(petDropLog.time);
					const realDropTime = new Date(dropTime.getTime());

					if (thisPet.forcedStart && (thisPet.forcedStart > dropTime.getTime())) {
						dropTime.setTime(thisPet.forcedStart);
					}

					//If the latest drop is more recent than the forced start time, blow out the forced start
					if (thisPet.forcedStart && (realDropTime.getTime() >= thisPet.forcedStart)) {
						delete forcedStarts[thisPet.id];
						GM.setValue(forceStartTimeKey, forcedStarts);
					}

					//Only apply the timezone offset if the source of the time is from the log - NOT from forced timestamps
					const timeAgoString = getTimeAgoString(
						Date.now() - dropTime.getTime() + (thisPet.forcedStart ? 0 : timeZoneOffset)
					);
					//Get the real droptime if in forced mode
					const realAgoString = getTimeAgoString(
						Date.now() - realDropTime.getTime() + timeZoneOffset);

					var sinceDrop = Math.floor((Date.now() - dropTime.getTime()) / 3600000);//Hours since last drop
					//Only apply the timezone offset if the source of the time is from the log - NOT from forced timestamps

					if (!thisPet.forcedStart) {
						sinceDrop += (timeZoneOffset / 3600000);
					}
					var lvlmod = 1;
					if (thisPet.lvl > 12) {
						lvlmod = 4;
					} else if (thisPet.lvl !== undefined) {
						lvlmod = lvlbuff[thisPet.lvl];
					}

					//Check for archive record, to suppress Restore button
					let archiveChance = await GM.getValue(thisPet.id + archiveRecChance);
					let archiveTime = await GM.getValue(thisPet.id + archiveRecTime);

					if (archiveTime) {
						hasArchive = true;
					}
					thisPet.archive = hasArchive;
					thisPet.archiveTime = archiveTime;

					let storedchancekey = thisPet.id + "_minchance";
					let storedrecordkey = thisPet.id + "_record";

					//----------- Update Historical Data Storage - move values to pet IDs - Remove in future update
					let storedchancekey_name = petSlot + petName + "_minchance";
					let storedrecordkey_name = petSlot + petName + "_record";

					let oldrecord = await GM.getValue(storedrecordkey_name);
					let oldchance = await GM.getValue(storedchancekey_name);

					if (oldrecord) {
						record = await GM.getValue(storedrecordkey);
						if (!record) {
							GM.setValue(storedrecordkey, oldrecord);
							GM.deleteValue(storedrecordkey_name);
						}
					}

					if (oldchance) {
						chance = await GM.getValue(storedchancekey);
						if (!chance) {
							GM.setValue(storedchancekey, chance);
							GM.deleteValue(storedchancekey_name);
						}
					}
					//----------- End Historical Data Update

					thisPet.since = sinceDrop;
					if (sinceDrop < thisPet.cooldown) {
						decorb = true;
						chance = 100;
						record = await GM.getValue(storedrecordkey);
						if (!record) {
							record = "n/a";
						}
						thisPet.recordTime = record;
						thisPet.oncooldown = true;
					} else {
						//Remove the cooldown from the drop time
						sinceDrop -= thisPet.cooldown;
						chance = parseFloat(calc_failchance(thisPet, thisPet.xp, sinceDrop)).toPrecision(5);
						let minchance = await GM.getValue(storedchancekey);
						record = await GM.getValue(storedrecordkey);
						if (!record) {
							GM.setValue(storedchancekey, chance);
							GM.setValue(storedrecordkey, sinceDrop);
							record = sinceDrop;
							decora = true;
							thisPet.recordTime = record;
							thisPet.recordLow = chance;
						} else {
							let diff = record - sinceDrop;
							if (diff <= 0) {
								decora = true;
								if (diff < 0) {
									GM.setValue(storedchancekey, chance);
									GM.setValue(storedrecordkey, sinceDrop);
									thisPet.recordTime = sinceDrop;
									thisPet.recordLow = chance;
								}
							} else {
								thisPet.recordTime = record;
								thisPet.recordLow = minchance;
							}
							if (!thisPet.recordTime) {
								thisPet.recordTime = sinceDrop;
							}
						}
					}
					let showrec = (decora ? "" : (record === "n/a" ? "" : " - Rec: " + record.toString() + "h"));
					thisPet.lastRealDrop = "Last Dropped " + itemName + " " + realAgoString;

					thisPet.info = (gen_petInfo(thisPet, sinceDrop));
					if (!thisPet.forcedStart) {
						lastDroppedItem = `Last dropped a ${itemName} (${timeAgoString}) (${sinceDrop}h: ${chance}%${showrec})\n`;
					} else {
						lastDroppedItem = `Timer Reset forced (${timeAgoString}) (${sinceDrop}h: ${chance}%${showrec})\n`;
					}
					break;
				}
			}
		}

		const buttonBar = document.createElement("div");
		buttonBar.id = thisPet.id + "_buttons";
		const resetButton = document.createElement("button");
		resetButton.style.padding = "2px";
		resetButton.style.height = "16px";
		resetButton.style.width = "16px";
		const saveRecordButton = document.createElement("button");
		saveRecordButton.style.padding = "2px";
		saveRecordButton.style.height = "16px";
		saveRecordButton.style.width = "16px";
		saveRecordButton.style.display = "visible";
		saveRecordButton.title = 'Archive Current Record Time'
		saveRecordButton.style.background = "url('" + saveIcon + "')";
		saveRecordButton.addEventListener('click', function () { store_archive(thisPet); });
		const loadRecordButton = document.createElement("button");
		loadRecordButton.style.padding = "2px";
		loadRecordButton.style.height = "16px";
		loadRecordButton.style.width = "16px";
		loadRecordButton.style.visibility = (thisPet.archive ? "visible" : "hidden");
		loadRecordButton.title = 'Restore Archived Record Low';
		loadRecordButton.style.background = "url('" + loadIcon + "')";
		loadRecordButton.addEventListener('click', function () { restore_archive(thisPet); });

		resetButton.style.background = "url('/static/common/symbols/strength.gif')";
		resetButton.addEventListener('click', function () { reset_pet(thisPet, forcedStarts); });
		resetButton.title = 'Force Pet to Start Counting From Now';

		const lastDroppedItemInfo = document.createElement("li");
		lastDroppedItemInfo.textContent = lastDroppedItem;
		lastDroppedItemInfo.style.paddingBottom = "10px";
		lastDroppedItemInfo.title = (thisPet.info) + "Probability of going this long without a drop.\nRecords are maintained for *individual* pets and not tied to slot.\n*Based on user log entries, and so fail probability cannot account for equip changes, site outages, etc..\nAlways 100% within pet's cooldown window.";
		if (decora && !disable_color_flag) {
			lastDroppedItemInfo.style.color = "red";
			lastDroppedItemInfo.style.bold = true;
		} else if (decorb && !disable_color_flag) {
			lastDroppedItemInfo.style.color = "yellow";
			lastDroppedItemInfo.style.bold = true;
		}

		buttonBar.appendChild(resetButton);
		buttonBar.appendChild(saveRecordButton);
		buttonBar.appendChild(loadRecordButton);
		lastDroppedItemInfo.appendChild(buttonBar);

		listItems.push(lastDroppedItemInfo);
	}

	list.append(...listItems);

	function insert() {
		document.getElementsByName("user_info")[0]?.after(box);
		//Does avatar exist at this point?
		if (document.querySelector('img.avatar.pixelart')) {
			avatarImage = avatarhack();
		}
		if (document.head) {
			document.head.appendChild(settingsStyleSheet);
		}
		if (document.body) {
			document.body.appendChild(blockLayer);
            document.body.appendChild(settingsPane);
		};

		return box.isConnected;
	}
	function avatarhack() {
		var av = document.querySelector('img.avatar.pixelart');
		av.addEventListener('click', function () { whip_gfx(true, true); });
		return av;
	}

	function calc_failchance(pet, currXP, sinceDrop) {
		if (sinceDrop <= 0) {
			return 0;
		}
		let chance = 0;
		let dropat = currXP - sinceDrop;
		let thislvl = Math.max.apply(Math, xpreqs.filter(function (x) { return x <= currXP }));
		let sinceLastLvl = currXP - thislvl;

		if (sinceLastLvl < sinceDrop) {
			let PrevLvlXP = thislvl - 1;
			let remaining = sinceDrop - sinceLastLvl;
			return (Math.pow((1 - (lvlmod / pet_chance[pet.type].drop) + (lvlmod / pet_chance[pet.type].special)), sinceDrop) * 100) + calc_failchance(pet, PrevLvlXP, remaining);

		} else {
			let lvlmod = lvlbuff[xpreqs.indexOf(thislvl)];
			return (Math.pow((1 - (lvlmod / pet_chance[pet.type].drop) + (lvlmod / pet_chance[pet.type].special)), sinceDrop) * 100).toPrecision(10);
		}
		return 0;
	}
	function reset_pet(pet, forcedStarts) {
		if (confirm("Are you sure you wish to force " + pet.name + "(#" + pet.id + ")'s drop time to start counting from right now?" + (pet.forcedStart ? "\nThis will overwrite the previous forced start time." : ""))) {
			let t = Date.now();
			forcedStarts[pet.id] = t;
			console.log("Saving forcedStarts %o", forcedStarts);
			GM.setValue(forceStartTimeKey, forcedStarts);
		}
	}
	function toggle_colored_msg(flag) {
		return !flag;
	}
	function store_archive(pet) {
		if (!pet.recordTime) {
			alert("No current record time to archive for this pet.");
			return;
		}
		if (confirm("Current record time is " + pet.recordTime + " hours. Archive this value to restore later?"
			+ (pet.archive ? "\nThis will overwrite the previously archived value" : ""))) {
			GM.setValue(pet.id + archiveRecTime, pet.recordTime);
			if (pet.recordLow) {
				GM.setValue(pet.id + archiveRecChance, pet.recordLow);
			}
		}
	}
	function restore_archive(pet) {
		if (confirm("Restore previously archived Record Time?" + (pet.archive ? "\nThis will overwrite current record value of" + pet.recordTime : ""))) {
			GM.setValue("restoreArchive", true);
			GM.setValue("restorePetId", pet.id);
			window.location.reload();
		}
	}

	function gen_petInfo(pet, since) {
		let info = "";
		if (pet.recordTime && since >= pet.recordTime) { info += "--== RECORD LOW ==--\n" };
		if (pet.oncooldown) { info += "**ON COOLDOWN FOR " + (pet.cooldown - since) + " MORE HOURS**\n" };
		if (pet.forcedStart) { const fd = new Date(); fd.setTime(pet.forcedStart); info += "** Drop Timer Forced to " + fd.toLocaleDateString() + " " + fd.toLocaleTimeString() + "\n** " + pet.lastRealDrop + "\n"; }
		if (pet.recordTime) { info += "Record Time Between Drops: " + pet.recordTime + " hours\n"; }
		if (pet.archive && pet.archiveTime) { info += "Archived Record Time: " + pet.archiveTime + " hours\n"; }


		return info;
	}

	function whip_gfx(left, right) {
		// Create the GIF overlay
        if (!enable_whip){return;}
		let avpos = get_abspos(avatarImage);
		if (left) {
			const ovl_left = document.createElement("img");
			ovl_left.src = whipSpriteURL;
			ovl_left.style.position = "absolute";
			ovl_left.style.zIndex = "1000";
			ovl_left.style.height = "64px";
			ovl_left.style.width = "64px";
			ovl_left.style.left = avpos.left + 10 + "px";
			ovl_left.style.top = avpos.top + (avatarImage.height * .5 - 32) + "px";
			ovl_left.style.display = "block";
			document.body.appendChild(ovl_left);
			setTimeout(() => {
				ovl_left.style.display = "none";
			}, 500);
		}
		if (right) {
			const ovl_right = document.createElement("img");
			ovl_right.src = whipSpriteURL;
			ovl_right.style.position = "absolute";
			ovl_right.style.zIndex = "1000";
			ovl_right.style.height = "64px";
			ovl_right.style.width = "64px";
			ovl_right.style.left = avpos.left + (avatarImage.width - 74) + "px";
			ovl_right.style.top = avpos.top + (avatarImage.height * .5 - 32) + "px";
			ovl_right.style.display = "block";
			document.body.appendChild(ovl_right);
			setTimeout(() => {
				ovl_right.style.display = "none";
			}, 500);
		}
	}

	function get_abspos(elem) {
		var r = elem.getBoundingClientRect();
		var l = window.pageXOffset || document.documentElement.scrollLeft;
		var t = window.pageYOffset || document.documentElement.scrollTop;
		return { top: r.top + t, left: r.left + l };
	}

    function toggle_setting(element, setting_key){
        alert ("Element: " + element.id);
        alert ("Setting " + setting_key + " to " + element.checked);
        GM.setValue(setting_key, element.checked);
    }

    function settings_on(bool){
         if (!bool){
           blockLayer.style.display = "none";
           settingsPane.style.display = "none";
         } else {
           blockLayer.style.display = "block";
           settingsPane.style.display = "block";
         }
    }

	if (!insert()) {
		window.addEventListener("DOMContentLoaded", insert);
	}
})();
