// ==UserScript==
// @name         Torn Loadout Spy
// @namespace    microbes.torn.loadout
// @version      2.4
// @description  Awesome Loadout Cache Script
// @author       Microbes
// @match        https://www.torn.com/loader.php?sid=attack&user2ID=*
// @match        https://www.torn.com/preferences.php
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @run-at       document-end
// @license		 MIT
// @require		 https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/486077/Torn%20Loadout%20Spy.user.js
// @updateURL https://update.greasyfork.org/scripts/486077/Torn%20Loadout%20Spy.meta.js
// ==/UserScript==

/* ************************************************************************************************************************* */
/* ONLY WORKS ON TamperMonkey and TornPDA     																				 */
/* Chrome/Opera GX/Edge etc: https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo			 */
/* Firefox: https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/													 */
/* ************************************************************************************************************************** */

// START XHook - v1.4.9 - https://github.com/jpillora/xhook
// Jaime Pillora <dev@jpillora.com> - MIT Copyright 2018
(function(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H=[].indexOf||function(a){for(var b=0,c=this.length;b<c;b++)if(b in this&&this[b]===a)return b;return-1};q=null,q="undefined"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope?self:"undefined"!=typeof global?global:a,x=q.document,d="before",c="after",o="readyState",n="addEventListener",m="removeEventListener",h="dispatchEvent",u="XMLHttpRequest",g="fetch",i="FormData",p=["load","loadend","loadstart"],e=["progress","abort","error","timeout"],E="undefined"!=typeof navigator&&navigator.useragent?navigator.userAgent:"",A=parseInt((/msie (\d+)/.exec(E.toLowerCase())||[])[1]),isNaN(A)&&(A=parseInt((/trident\/.*; rv:(\d+)/.exec(E.toLowerCase())||[])[1])),(G=Array.prototype).indexOf||(G.indexOf=function(a){var b,c,d,e;for(b=d=0,e=this.length;d<e;b=++d)if(c=this[b],c===a)return b;return-1}),D=function(a,b){return Array.prototype.slice.call(a,b)},w=function(a){return"returnValue"===a||"totalSize"===a||"position"===a},z=function(a,b){var c;for(c in a)if(a[c],!w(c))try{b[c]=a[c]}catch(a){}return b},B=function(a){return void 0===a?null:a},C=function(a,b,c){var d,e,f,g;for(e=function(a){return function(d){var e,f,g;e={};for(f in d)w(f)||(g=d[f],e[f]=g===b?c:g);return c[h](a,e)}},f=0,g=a.length;f<g;f++)d=a[f],c._has(d)&&(b["on"+d]=e(d))},y=function(a){var b;if(x&&null!=x.createEventObject)return b=x.createEventObject(),b.type=a,b;try{return new Event(a)}catch(b){return{type:a}}},f=function(a){var c,d,e;return d={},e=function(a){return d[a]||[]},c={},c[n]=function(a,c,f){d[a]=e(a),d[a].indexOf(c)>=0||(f=f===b?d[a].length:f,d[a].splice(f,0,c))},c[m]=function(a,c){var f;if(a===b)return void(d={});c===b&&(d[a]=[]),f=e(a).indexOf(c),f!==-1&&e(a).splice(f,1)},c[h]=function(){var b,d,f,g,h,i,j,k;for(b=D(arguments),d=b.shift(),a||(b[0]=z(b[0],y(d))),g=c["on"+d],g&&g.apply(c,b),k=e(d).concat(e("*")),f=i=0,j=k.length;i<j;f=++i)h=k[f],h.apply(c,b)},c._has=function(a){return!(!d[a]&&!c["on"+a])},a&&(c.listeners=function(a){return D(e(a))},c.on=c[n],c.off=c[m],c.fire=c[h],c.once=function(a,b){var d;return d=function(){return c.off(a,d),b.apply(null,arguments)},c.on(a,d)},c.destroy=function(){return d={}}),c},F=f(!0),F.EventEmitter=f,F[d]=function(a,b){if(a.length<1||a.length>2)throw"invalid hook";return F[n](d,a,b)},F[c]=function(a,b){if(a.length<2||a.length>3)throw"invalid hook";return F[n](c,a,b)},F.enable=function(){q[u]=t,"function"==typeof r&&(q[g]=r),k&&(q[i]=s)},F.disable=function(){q[u]=F[u],q[g]=F[g],k&&(q[i]=k)},v=F.headers=function(a,b){var c,d,e,f,g,h,i,j,k;switch(null==b&&(b={}),typeof a){case"object":d=[];for(e in a)g=a[e],f=e.toLowerCase(),d.push(f+":\t"+g);return d.join("\n")+"\n";case"string":for(d=a.split("\n"),i=0,j=d.length;i<j;i++)c=d[i],/([^:]+):\s*(.+)/.test(c)&&(f=null!=(k=RegExp.$1)?k.toLowerCase():void 0,h=RegExp.$2,null==b[f]&&(b[f]=h));return b}},k=q[i],s=function(a){var b;this.fd=a?new k(a):new k,this.form=a,b=[],Object.defineProperty(this,"entries",{get:function(){var c;return c=a?D(a.querySelectorAll("input,select")).filter(function(a){var b;return"checkbox"!==(b=a.type)&&"radio"!==b||a.checked}).map(function(a){return[a.name,"file"===a.type?a.files:a.value]}):[],c.concat(b)}}),this.append=function(a){return function(){var c;return c=D(arguments),b.push(c),a.fd.append.apply(a.fd,c)}}(this)},k&&(F[i]=k,q[i]=s),l=q[u],F[u]=l,t=q[u]=function(){var a,b,g,i,j,k,l,m,q,r,t,w,x,y,D,E,G,I,J,K,L;a=-1,I=new F[u],t={},y=null,l=void 0,D=void 0,w=void 0,r=function(){var b,c,d,e;if(w.status=y||I.status,y===a&&A<10||(w.statusText=I.statusText),y!==a){e=v(I.getAllResponseHeaders());for(b in e)d=e[b],w.headers[b]||(c=b.toLowerCase(),w.headers[c]=d)}},q=function(){if(I.responseType&&"text"!==I.responseType)"document"===I.responseType?(w.xml=I.responseXML,w.data=I.responseXML):w.data=I.response;else{w.text=I.responseText,w.data=I.responseText;try{w.xml=I.responseXML}catch(a){}}"responseURL"in I&&(w.finalUrl=I.responseURL)},G=function(){k.status=w.status,k.statusText=w.statusText},E=function(){"text"in w&&(k.responseText=w.text),"xml"in w&&(k.responseXML=w.xml),"data"in w&&(k.response=w.data),"finalUrl"in w&&(k.responseURL=w.finalUrl)},i=function(a){for(;a>b&&b<4;)k[o]=++b,1===b&&k[h]("loadstart",{}),2===b&&G(),4===b&&(G(),E()),k[h]("readystatechange",{}),4===b&&(t.async===!1?g():setTimeout(g,0))},g=function(){l||k[h]("load",{}),k[h]("loadend",{}),l&&(k[o]=0)},b=0,x=function(a){var b,d;if(4!==a)return void i(a);b=F.listeners(c),(d=function(){var a;return b.length?(a=b.shift(),2===a.length?(a(t,w),d()):3===a.length&&t.async?a(t,w,d):d()):i(4)})()},k=t.xhr=f(),I.onreadystatechange=function(a){try{2===I[o]&&r()}catch(a){}4===I[o]&&(D=!1,r(),q()),x(I[o])},m=function(){l=!0},k[n]("error",m),k[n]("timeout",m),k[n]("abort",m),k[n]("progress",function(){b<3?x(3):k[h]("readystatechange",{})}),("withCredentials"in I||F.addWithCredentials)&&(k.withCredentials=!1),k.status=0,L=e.concat(p);for(J=0,K=L.length;J<K;J++)j=L[J],k["on"+j]=null;return k.open=function(a,c,d,e,f){b=0,l=!1,D=!1,t.headers={},t.headerNames={},t.status=0,w={},w.headers={},t.method=a,t.url=c,t.async=d!==!1,t.user=e,t.pass=f,x(1)},k.send=function(a){var b,c,f,g,h,i,j,l;for(l=["type","timeout","withCredentials"],i=0,j=l.length;i<j;i++)c=l[i],f="type"===c?"responseType":c,f in k&&(t[c]=k[f]);t.body=a,h=function(){var a,b,d,g,h,i;for(C(e,I,k),k.upload&&C(e.concat(p),I.upload,k.upload),D=!0,I.open(t.method,t.url,t.async,t.user,t.pass),h=["type","timeout","withCredentials"],d=0,g=h.length;d<g;d++)c=h[d],f="type"===c?"responseType":c,c in t&&(I[f]=t[c]);i=t.headers;for(a in i)b=i[a],a&&I.setRequestHeader(a,b);t.body instanceof s&&(t.body=t.body.fd),I.send(t.body)},b=F.listeners(d),(g=function(){var a,c;return b.length?(a=function(a){if("object"==typeof a&&("number"==typeof a.status||"number"==typeof w.status))return z(a,w),H.call(a,"data")<0&&(a.data=a.response||a.text),void x(4);g()},a.head=function(a){return z(a,w),x(2)},a.progress=function(a){return z(a,w),x(3)},c=b.shift(),1===c.length?a(c(t)):2===c.length&&t.async?c(t,a):a()):h()})()},k.abort=function(){y=a,D?I.abort():k[h]("abort",{})},k.setRequestHeader=function(a,b){var c,d;c=null!=a?a.toLowerCase():void 0,d=t.headerNames[c]=t.headerNames[c]||a,t.headers[d]&&(b=t.headers[d]+", "+b),t.headers[d]=b},k.getResponseHeader=function(a){var b;return b=null!=a?a.toLowerCase():void 0,B(w.headers[b])},k.getAllResponseHeaders=function(){return B(v(w.headers))},I.overrideMimeType&&(k.overrideMimeType=function(){return I.overrideMimeType.apply(I,arguments)}),I.upload&&(k.upload=t.upload=f()),k.UNSENT=0,k.OPENED=1,k.HEADERS_RECEIVED=2,k.LOADING=3,k.DONE=4,k.response="",k.responseText="",k.responseXML=null,k.readyState=0,k.statusText="",k},"function"==typeof q[g]&&(j=q[g],F[g]=j,r=q[g]=function(a,b){var e,f,g;return null==b&&(b={headers:{}}),b.url=a,g=null,f=F.listeners(d),e=F.listeners(c),new Promise(function(a,c){var d,h,i,k,l;h=function(){return b.body instanceof s&&(b.body=b.body.fd),b.headers&&(b.headers=new Headers(b.headers)),g||(g=new Request(b.url,b)),z(b,g)},i=function(b){var c;return e.length?(c=e.shift(),2===c.length?(c(h(),b),i(b)):3===c.length?c(h(),b,i):i(b)):a(b)},d=function(b){var c;if(void 0!==b)return c=new Response(b.body||b.text,b),a(c),void i(c);k()},k=function(){var a;return f.length?(a=f.shift(),1===a.length?d(a(b)):2===a.length?a(h(),d):void 0):void l()},l=function(){return j(h()).then(function(a){return i(a)}).catch(function(a){return i(a),c(a)})},k()})}),t.UNSENT=0,t.OPENED=1,t.HEADERS_RECEIVED=2,t.LOADING=3,t.DONE=4,"function"==typeof define&&define.amd?define("xhook",[],function(){return F}):"object"==typeof module&&module.exports?module.exports={xhook:F}:q&&(q.xhook=F)}).call(this,window);
// END XHOOK

var first_loadout_sent = false;
var attack_logs_sent = false;

var attackCount = 0;
var attackCrit = 0;
var recordedAttacks = [];
var weaponHits = {
	"primary": 0,
	"secondary": 0,
	"melee": 0,
	"temp": 0
}

var fightId;
var uid = window.location.href.split("=").slice(-1)[0];
let serverAddress = "https://tornloadout.xyz/"; // "http://localhost/tornloadout/"
let apiKey = localStorage.getItem(`tornloadout_apikey`) || '';

var req = GM.xmlHttpRequest ? GM.xmlHttpRequest : GM_xmlhttpRequest;

// On new attack log,
window.addEventListener("new-attack-log", function(event) {
    var response = event.detail;
    response.API = apiKey;

    // If fight haven't start, we don't send loadout.
	if (response["DB"]["attackStatus"] == "notStarted")
	{
		return;
	}

	// Update current fight ID
	fightId = response["DB"]["fightID"];

	// If status is end, we send attack logs
	if (response["DB"].hasOwnProperty('winner'))
	{
		$("#loadout-stats").hide();
		send_attack_logs();
		return;
	}

	/* Send Loadout */
	/* If this is the first fetch, we send the loadout information */
	if (!first_loadout_sent)
	{
        console.log("[Loadout] Sending enemy loadout.")
		send_loadout(response);
	}

	// Now, as long as the fight is still in progress, for each response, we note down their attack logs.
	add_attack_logs(response);
});

// Send Loadout
function send_loadout(loadout)
{
    console.log(loadout);

	// URL to send the POST request
	const url = serverAddress + '/send_loadout.php';

	// Send the POST request using the fetch API
	req({
        method: "POST",
        url: url,
        headers: {
            "Content-Type": "application/json",
        },
        data: JSON.stringify(loadout),
        onload: function(response) {
            try {
                var data = JSON.parse(response.responseText);
				console.log("Loadout sent!");
            } catch (error) {
                console.error(error);
            }
        },
        onerror: function(error) {
            console.error("Error:", error);
        }
    });

	// Set to sent before
	first_loadout_sent = true;
}

// Add Attack Logs
function add_attack_logs(response)
{
	let currentFightHistory = response["DB"]["currentFightHistory"];

	let weaponIds = {
		"primary": response["DB"]["defenderItems"][1] ? response["DB"]["defenderItems"][1]["item"][0]["armoryID"] : null,
		"secondary": response["DB"]["defenderItems"][2] ? response["DB"]["defenderItems"][2]["item"][0]["armoryID"] : null,
		"melee": response["DB"]["defenderItems"][3] ? response["DB"]["defenderItems"][3]["item"][0]["armoryID"] : null,
		"temp": response["DB"]["defenderItems"][5] ? response["DB"]["defenderItems"][5]["item"][0]["armoryID"] : null
	}

	for (var attackLog of currentFightHistory)
	{
		// color-2 is when defender attacks
		if (attackLog["color"] == "color-2")
		{
			// Check if we recorded this attack before
			if (recordedAttacks.includes(attackLog["ID"]))
			{
				continue;
			}

			// Add attack as recorded, so to not record duplicate logs.
			recordedAttacks.push(attackLog["ID"]);

			// Increase attack counter by one.
			if (["hit", "critical hit"].includes(attackLog["result"]))
			{
				attackCount++;

				// Increase critical hits counter.
				if (attackLog["result"] == "critical hit")
				{
					attackCrit++;
				}
			}

			// As long as the defender uses this item, we add to their respective weapon type, even if it's a miss.
			// Increase weapon hit counter
			for (let weapon in weaponIds) {
				if (attackLog["attackerItemID"] == weaponIds[weapon]) {
					weaponHits[weapon]++;
					console.log(`The attackerItemID belongs to ${weapon}`);
					break;
				}
			}

			console.log(weaponHits);
		}
	}
}

// Send Attack Logs
function send_attack_logs()
{
	if (attack_logs_sent) return;

    console.log("[Loadout] Sending attack logs.");

	// Declare message for content script
	var data = {
		"uid": uid,
		"fightId": fightId,
		"attackCount": attackCount,
		"attackCrit": attackCrit,
		"weaponHits": {
			"primaryHits": weaponHits["primary"],
			"secondaryHits": weaponHits["secondary"],
			"meleeHits": weaponHits["melee"],
			"tempThrown": weaponHits["temp"]
		},
		"DB": [],
		"API": apiKey
	}

	console.log(data);

	// URL to send the POST request
	const url = serverAddress + '/send_attack.php';

	// Send the POST request using GM_xmlhttpRequest
	req({
		method: "POST",
		url: url,
		headers: {
			"Content-Type": "application/json",
		},
		data: JSON.stringify(data),
		onload: function(response) {
			console.log("Attack log sent.");
			console.log(response);
		},
		onerror: function(error) {
			console.error("Error: ", error);
		}
	});

	attack_logs_sent = true;
}

// Get Loadout
function fetch_loadout(loadingEffect = true)
{
	// Confirm defender box exist
	if (loadingEffect)
	{
		// Add loading effect
		$(`#defender #weapon_main figure`).html(`<center><div class="loader"></div></center>`);
		$(`#defender #weapon_second figure`).html(`<center><div class="loader"></div></center>`);
		$(`#defender #weapon_melee figure`).html(`<center><div class="loader"></div></center>`);
		$(`#defender #weapon_temp figure`).html(`<center><div class="loader"></div></center>`);
	}

    get_loadout(on_loadout_received);
}

function get_loadout(signal) {
    // URL to send the GET request
    const url = `${serverAddress}/get_loadout.php?uid=${uid}&api=${apiKey}`;

    // Send the GET request using GM_xmlhttpRequest
    req({
        method: "GET",
        url: url,
        onload: function(response) {
            var responseData = null;
            try {
                responseData = JSON.parse(response.responseText);
            } catch (error) {
                console.error("JSON parse error:", error);
            }

            if (responseData) {
                signal(responseData);
            }
        },
        onerror: function(error) {
            console.error("Error:", error);
        }
    });
}

function on_loadout_received(response)
{
	console.log("recevied loadout");
    // If API error, don't load data.
	if (response["error"])
	{
		setNoData("main", response["error"]);
		setNoData("second", response["error"]);
		setNoData("melee", response["error"]);
		setNoData("temp", response["error"]);
		return;
	}

	// Add weapon prediction
	addPrediction("main", response["primary"]);
	addPrediction("second", response["secondary"]);
	addPrediction("melee", response["melee"]);
	addTemp(response["temp_id"]);

	// Create armour prediction html
	var predictedArmourHTML = "";
	predictedArmourHTML += getArmourHTML(response["helmet"]);
	predictedArmourHTML += getArmourHTML(response["vest"]);
	predictedArmourHTML += getArmourHTML(response["pants"]);
	predictedArmourHTML += getArmourHTML(response["gloves"]);
	predictedArmourHTML += getArmourHTML(response["boots"]);

	// Add stat boost prediction
	$("#defender").children().eq(1).append(`<div id="loadout-stats">
                                                <a id="close-loadout-stats" style="position: absolute;right:0;">[X]</a>
												<p><b>Predicted Armours</b></p>
												${predictedArmourHTML != "" ? predictedArmourHTML : "<p>Not Wearing Armour</p>"}

												<br/>

												<p><b>Predicted Boosters</b></p>
												<p>Str: ${response["strength"]}% Spd: ${response["speed"]}% Def: ${response["defense"]}% Dex: ${response["dexterity"]}% Dmg: ${response["damage"]}%</p>

												<br/>

												<p><b>Predicted Attacks</b></p>
												<table>
													<tr>
														<td>Critical Hit Rate:</td>
														<td>${response["critrate"] != null ? response["critrate"] + "%" : "Unknown" }</td>
													</tr>

													<tr>
														<td>Primary Hit Rate:</td>
														<td>${response["primary_hitrate"] != null ? response["primary_hitrate"] * 100 + "%" : "Unknown" }</td>
													</tr>

													<tr>
														<td>Secondary Hit Rate:&nbsp;&nbsp;</td>
														<td>${response["secondary_hitrate"] != null ? response["secondary_hitrate"] * 100 + "%" : "Unknown" }</td>
													</tr>

													<tr>
														<td>Melee Hit Rate:</td>
														<td>${response["melee_hitrate"] != null ? response["melee_hitrate"] * 100 + "%" : "Unknown" }</td>
													</tr>

													<tr>
														<td>Temp Thrown:</td>
														<td>${response["temp_thrown"] != null ? response["temp_thrown"] : "Unknown" }</td>
													</tr>
												</table>
											</div>
	`);

    // Add close button
    $("#close-loadout-stats").click(() => {
        $("#loadout-stats").remove();
    });

    // Add close when tap on it
    $("#loadout-stats").click(() => {
        $("#loadout-stats").remove();
    });
}

function setNoData(slot, error = "No Data")
{
	$(`#defender #weapon_${slot} figure`).html(`<p class="loader-text">${error}</p>`);
}

function addPrediction(weaponSlot, details) {
	if (details == null)
	{
		setNoData(weaponSlot);
		return;
	}

	// Declare selector
	selector = `#defender #weapon_${weaponSlot} figure`;

	// Add image
	$(selector).html(`<img src="https://www.torn.com/images/items/${details["weapon_id"]}/large.png" />`);

	// Add bonuses
	if (details["bonus2"] != "")
		$(selector).prepend(`<p class="loader-text">${addBonusText(details["bonus2"], details["bonus2_value"])}</p>`)

	if (details["bonus1"] != "")
		$(selector).prepend(`<p class="loader-text">${addBonusText(details["bonus1"], details["bonus1_value"])}</p>`)

	// Add Damage and Accuracy
	addDamageAccuracy(weaponSlot, details);
}

function addTemp(temp_id)
{
	if (temp_id == null)
	{
		setNoData("temp");
		return;
	}

	// Add image
	$("#defender #weapon_temp figure").html(`<img src="https://www.torn.com/images/items/${temp_id}/large.png" />`);
}

function addBonusText(bonus, value)
{
	const delimiter = bonus === "Disarm" ? " Turn" : "%";
	return `${value}${delimiter} ${bonus}`;
}

function addDamageAccuracy(weaponSlot, details)
{
	// Define the mapping between weapon slots and selectors
	const slotToSelector = {
		"main": "#defender_Primary",
		"second": "#defender_Secondary",
		"melee": "#defender_Melee"
	};

	// Use the array to get the selector based on the weapon slot
	const selector = slotToSelector[weaponSlot];

	$(selector).html(`${details["damage"]} <i class="iconDamage___QqVQm icon___wP1tC hideText___CVBj_" id="player-damage_microbes">Damage</i> `);
	//$(selector).append(selector.replace("#defender_", ""));
	$(selector).append(`${details["accuracy"]} <i class="iconHits___Df9Af icon___wP1tC hideText___CVBj_" id="player-hits_microbes">Accuracy</i>`);
}

function getArmourHTML(armour)
{
	if (armour != null)
	{
		var html = `<p>${armour["details"]["name"]}`
		if (armour["bonus1"])
		{
			html += ` - ${Math.max(armour["bonus1_value"] - 1, 0)}% ${armour["bonus1"]}`;
		}

		return html + "</p>";
	}

	return "";
}

/* SEND ASSIST REQUEST */
function addAssistButton()
{
	$("#react-root div div").first().find("div div").first().after(`<a id="loadout-assist-btn" class="torn-btn btn-big">Request Assist</a>`);
	$("#react-root div div").first().find("div div").first().after(`<p id="loadout-assist-text"></p>`);

	$("#loadout-assist-btn").on( "click", function() {
		$("#loadout-assist-btn").hide();
		$("#loadout-assist-text").text("Sending request ...");

        send_assist_req({
				"uid": uid,
				"assistCount": 2,
				"target_username": $(".user-name").last().text(),
				"DB": [],
                "API": apiKey
		});
	});
}

function send_assist_req(data, sendResponse)
{
    // URL to send the POST request
    const url = serverAddress + '/send_assist_req.php';

    // Send the POST request using GM_xmlhttpRequest
    req({
        method: "POST",
        url: url,
        headers: {
            "Content-Type": "application/json",
        },
        data: JSON.stringify(data),
        onload: function(response) {
            var responseData = null;
            try {
                responseData = JSON.parse(response.responseText);
            } catch (error) {
                sendResponse({ "error": "JSON parse error" });
                console.error("JSON parse error:", error);
            }

            if (responseData != null) on_assist_req_sent(responseData);
        },
        onerror: function(error) {
            sendResponse({ "error": error });
            console.error("Error:", error);
        }
    });
}

function on_assist_req_sent(data)
{
	if (data["error"])
	{
		$("#loadout-assist-text").text(data["error"]);
	}
	else
	{
		$("#loadout-assist-text").text("Request sent!");
	}
}

/* Get Loadout Button */
function addGetLoadoutButton() {
    $("#log-header").last().before(`<a id="loadout-getl-loadout-btn" class="torn-btn btn-big">Get Loadout</a>`);

    $("#loadout-getl-loadout-btn").click(() => {
        get_loadout(alertLoadout);
    });
}

function alertLoadout(response) {
	if (response.error) {
		alert(response.error);
		return;
	}

	let message = "";

	message += get_weapon_message("Primary", response.primary);
	message += get_weapon_message("Secondary", response.secondary);
	message += get_weapon_message("Melee", response.melee);

	message += "\n";

	message += get_armour_message("helmet", response.helmet);
	message += get_armour_message("vest", response.vest);
	message += get_armour_message("pants", response.pants);
	message += get_armour_message("gloves", response.gloves);
	message += get_armour_message("boots", response.boots);

	message += "\n";

	// Critical hit rate
	if (response.critrate != null) {
		message += "\nCritical Hit Rate: " + response.critrate + "%";
	}

	if (response.primary_hitrate != null) {
		message += "\nPrimary Hit Rate: " + response.primary_hitrate * 100 + "%";
	}

	if (response.secondary_hitrate != null) {
		message += "\nSecondary Hit Rate: " + response.secondary_hitrate * 100 + "%";
	}

	if (response.melee_hitrate != null) {
		message += "\nMelee Hit Rate: " + response.melee_hitrate * 100 + "%";
	}

	alert(message);
}

function get_weapon_message(weaponSlot, details) {
	console.log(details);

	if (details == null) {
		return "";
	}

	let message = ""

	message += `\n${details.details.name}`;

	// Add bonuses if exist
	if (details.bonus2 != "") {
		message += addBonusText2(details.bonus2, details.bonus2_value);
	}

	if (details.bonus1 != "") {
		message += addBonusText2(details.bonus1, details.bonus1_value);
	}

	return message;
}

function addBonusText2(bonus, value) {
	const delimiter = bonus === "Disarm" ? " Turn" : "%";
	return ` - ${value}${delimiter} ${bonus}`;
}

function get_armour_message(slot, armour) {
	if (armour != null) {
		var html = "\n" + armour.details.name;

		if (armour["bonus1"]) {
			html += ` - ${Math.max(armour.bonus1_value - 1, 0)}% ${armour.bonus1}`;
		}

		return html;
	}

	return "\nNo " + slot + " equipped.";
}

/* Settings */
function createSettings() {
    $(".preferences-container").after(`
        <div id="loadout-settings">
            <h1>Torn Loadout Spy Settings</h1>

            <div class="content">
                <p>API Key (Public Only): <input id="tornloadout_api" type="text" maxlength="16" required="" autocomplete="off" value="${apiKey}" style="color: rgb(0, 0, 0); border-width: 1px; border-style: solid; border-color: rgb(204, 204, 204); border-image: initial; width: 20em;"></p>
                <br />
                <p style="color: red;">To continue using this tool, please allow us to send your API key to ourself.<br/>Click on 'Always Allow' when Greasemonkey/Tampermonkey pop-ups.</p>
                <img src="https://cdn.discordapp.com/attachments/389085689284919300/1201920457884835880/image.png" />
                <br />

                <a id="tornloadout_update_btn" class="torn-btn btn-big update">Update</a>
                <span class="updateText">Updated successfully!</span>

                <br /><br />
            </div>
        </div>
    `);

    $("#loadout-settings .updateText").hide();
    $("#tornloadout_update_btn").click(() => {
        $("#loadout-settings .updateText").hide();

        // If user wants to remove by filling empty
        if ($("#tornloadout_api").val() == "")
        {
            localStorage.removeItem('tornloadout_apikey');
            apiKey = "";
            $("#loadout-settings .updateText").text("API removed.");
            $("#loadout-settings .updateText").fadeIn();
            return;
        }

        $("#loadout-settings .updateText").text("Validating ...");
        $("#loadout-settings .updateText").fadeIn(200);

        // Test a GET Loadout
        req({
            method: "GET",
            url: `${serverAddress}/validate.php?api=${$("#tornloadout_api").val()}`,
            onload: function(response) {
                var responseData = null;
                try {
                    responseData = JSON.parse(response.responseText);
                } catch (error) {
                    console.error("JSON parse error:", error);
                }

                if (responseData) {
                    if (responseData["error"])
                    {
                        $("#loadout-settings .updateText").text(responseData.error);
                        $("#loadout-settings .updateText").hide().fadeIn();
                        $("#tornloadout_api").val(apiKey);
                    }
                    else
                    {
                        localStorage.setItem(`tornloadout_apikey`, $("#tornloadout_api").val());
                        apiKey = $("#tornloadout_api").val();
                        $("#loadout-settings .updateText").text("Updated successfully!");
                        $("#loadout-settings .updateText").hide().fadeIn();
                    }
                };
            },
            onerror: function(error) {
                console.error("Error:", error);
            }
        });
    });
}

// Main execution
if (GetPageName() != "preferences.php") {
    if (apiKey == "" || apiKey == null || apiKey == undefined) {
        $("#react-root div div").first().find("div div").first().after(`<p style="color: red;">Loadout: <a href="https://www.torn.com/preferences.php">API not set</a>.</p>`);
        return;
    }

    waitForElementToExist("#defender #weapon_main figure").then(() => {
        fetch_loadout();
    });

    waitForElementToExist("#react-root div div").then(() => {
        addAssistButton();
    });

    waitForElementToExist("#attacker").then(() => {
        addGetLoadoutButton();
    });
}
else {
    waitForElementToExist(".preferences-container").then(() => {
        createSettings();
    });
}

// Intercept response data
xhook.after(async function (request, response) {
    if (request.url.includes("loader.php?sid=attackData"))
    {
        var clone = response.clone();
        var responseData = await clone.json() //(await clone.json()).DB;

        window.dispatchEvent(new CustomEvent("new-attack-log", {"detail": responseData}));
    }
});

/* HELPERS */
function waitForElementToExist(selector) {
	return new Promise(resolve => {
		if (document.querySelector(selector)) {
			return resolve(document.querySelector(selector));
		}

		const observer = new MutationObserver(() => {
			if (document.querySelector(selector)) {
				resolve(document.querySelector(selector));
				observer.disconnect();
			}
		});

		observer.observe(document.body, {
			subtree: true,
			childList: true,
		});
	});
}

function GetPageName() {
    var path = window.location.pathname;
    var page = path.split("/").pop();

    return page;
}

/* Stylesheet */
GM_addStyle(`
    .loader-text {
        font-size: 0.9em;
        color: red;
    }

    .loader {
        border: 8px solid #f3f3f3;
        border-top: 8px solid #3498db;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    #loadout-stats {
        position: absolute;
        z-index: 10;
        font-family: monospace;
        background-color: rgba(255, 255, 255, 0.3);
        padding-right: 20px;
		left: 0;
    }

	@media only screen and (max-width: 800px) {
		#loadout-stats {
			left: auto;
			right: 2px;
		}
	}

    #loadout-stats table td {
        color: #333;
    }

    #close-loadout-stats:hover {
        cursor: pointer;
        color: blue;
    }

    #loadout-settings {
        margin-top: 20px;
        background-color: darkgrey;
        color: white;
    }

    #loadout-settings h1 {
        background-color: grey;
        padding: 0 2px;
    }

    #loadout-settings .content {
        padding: 0 2px;
    }

    #loadout-settings img {
        width: 90%;
        height: auto;
    }

    #loadout-assist-btn {
        margin-right: 3px;
    }
`);