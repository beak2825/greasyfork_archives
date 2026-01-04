// ==UserScript==
// @name         tarkov help unlocker (НЕ РАБОТАЕТ, ЧИТАЙ ОПИСАНИЕ)
// @namespace    https://greasyfork.org/ru/scripts/521315-tarkov-help-unlocker
// @version      1.1.2
// @description  Разблокировывает карты tarkov.help, закрытые за премиумом
// @author       GlassySundew
// @match        https://tarkov.help/ru/map/*
// @match        https://api.tarkov.help/*
// @license      GNU GPLv3
// @run-at  	 document-start
// @grant        GM.xmlHttpRequest
// @connect      tarkov.help
// @downloadURL https://update.greasyfork.org/scripts/521315/tarkov%20help%20unlocker%20%28%D0%9D%D0%95%20%D0%A0%D0%90%D0%91%D0%9E%D0%A2%D0%90%D0%95%D0%A2%2C%20%D0%A7%D0%98%D0%A2%D0%90%D0%99%20%D0%9E%D0%9F%D0%98%D0%A1%D0%90%D0%9D%D0%98%D0%95%29.user.js
// @updateURL https://update.greasyfork.org/scripts/521315/tarkov%20help%20unlocker%20%28%D0%9D%D0%95%20%D0%A0%D0%90%D0%91%D0%9E%D0%A2%D0%90%D0%95%D0%A2%2C%20%D0%A7%D0%98%D0%A2%D0%90%D0%99%20%D0%9E%D0%9F%D0%98%D0%A1%D0%90%D0%9D%D0%98%D0%95%29.meta.js
// ==/UserScript==

(function () {
	"use strict";

	let streetsData,
		shorelineData,
		labsData,
		interchangeData,
		reserveData,
		lighthouseData,
		mapLinkContainer;

	const interceptionRequired = {
		ulici: true,
		bereg: true,
		laboratoriya: true,
		razvyazka: true,
		rezerv: true,
		mayak: true,
	};

	const mapAlias = {
		ulici: "streets",
		bereg: "shoreline",
		zavod: "factory",
		laboratoriya: "labs",
		les: "woods",
		razvyazka: "interchange",
		rezerv: "reserve",
		tamozhnya: "customs",
		mayak: "lighthouse",
	};

	const mapAliasInv = {
		ulici: "streets",
		bereg: "shoreline",
		zavod: "factory",
		laboratoriya: "labs",
		les: "woods",
		razvyazka: "interchange",
		rezerv: "reserve",
		tamozhnya: "customs",
		mayak: "lighthouse",
	};

	function setupData(data) {
		streetsData = {
			info: data.fakeStreetsInfo,
			markers: data.fakeStreetsMarkers,
			containers: data.fakeStreetsContainers,
			spawns: data.fakeStreetsSpawns,
		};

		shorelineData = {
			info: data.fakeShorelineInfo,
			markers: data.fakeShorelineMarkers,
			containers: data.fakeShorelineContainers,
			spawns: data.fakeShorelineSpawns,
		};

		labsData = {
			info: data.fakeLabsInfo,
			markers: data.fakeLabsMarkers,
			containers: data.fakeLabsContainers,
			spawns: data.fakeLabsSpawns,
		};

		interchangeData = {
			info: data.fakeInterchangeInfo,
			markers: data.fakeInterchangeMarkers,
			containers: data.fakeInterchangeContainers,
			spawns: data.fakeInterchangeSpawns,
		};

		reserveData = {
			info: data.fakeReserveInfo,
			markers: data.fakeReserveMarkers,
			containers: data.fakeReserveContainers,
			spawns: data.fakeReserveSpawns,
		};

		lighthouseData = {
			info: data.fakeLighthouseInfo,
			markers: data.fakeLighthouseMarkers,
			containers: data.fakeLighthouseContainers,
			spawns: data.fakeLighthouseSpawns,
		};

		mapLinkContainer = {
			11: streetsData,
			ulici: streetsData,
			4: shorelineData,
			bereg: shorelineData,
			5: labsData,
			laboratoriya: labsData,
			8: interchangeData,
			razvyazka: interchangeData,
			9: reserveData,
			rezerv: reserveData,
			6: lighthouseData,
			mayak: lighthouseData,
		};
	}

	const observer = new MutationObserver((mutations) => {
		for (const m of mutations) {
			for (const node of m.addedNodes) {
				if (
					node.tagName === "SCRIPT" &&
					node.src.includes("/static/js/main.")
				) {
					console.log("Tampermonkey: Detected script", node.src);

					node.parentNode.removeChild(node);

					GM.xmlHttpRequest({
						method: "GET",
						url: node.src,
						onload: function (res) {
							if (res.status === 200) {
								let text = res.responseText;

								text = text.replace(
									/throw\s+new\s+Error/g,
									"console.log"
								);

								text = text.replace(
									/throw\s+new\s+TypeError/g,
									"console.log"
								);

								const newScript =
									document.createElement("script");
								newScript.textContent = text;
								document.head.appendChild(newScript);

								console.log(
									"Tampermonkey: Patched main.js inserted"
								);
							}
						},
					});
				}
			}
		}
	});

	observer.observe(document.documentElement, {
		childList: true,
		subtree: true,
	});

	const dataPromise = fetch("https://glassysundew.github.io/mock.json")
		.then((response) => response.json())
		.then((data) => setupData(data));

	const originalCall = Function.prototype.call;
	const originalCallToString = originalCall.toString();

	Function.prototype.call = function _(...args) {
		let result;

		if (
			args[0] &&
			args[1] &&
			(args[0] == args[0].window || args[1] == args[1].window)
		) {
			return originalCall.apply(this, args);
		}

		try {
			if (this.name == 300) {
				result = originalCall.apply(this, args);

				if (args[1].exports) {
					const originalExports = args[1].exports;

					args[1].exports = new Proxy(originalExports, {
						get(target, prop) {
							if (prop === "d4") {
								const originalD4 = target[prop];

								return function (...innerArgs) {
									var selector = originalD4.apply(
										this,
										innerArgs
									);

									if (Array.isArray(selector)) {
										for (const value of selector) {
											if (value["seo_link"]) {
												value.premium = false;
											}
										}
									}

									return selector;
								};
							}

							return target[prop];
						},
					});

					console.log("Proxy для exports установлен.");
				}
			} else {
				result = originalCall.apply(this, args);
			}
		} catch (error) {
			console.error("Ошибка при перехвате вызова:", error);
		}

		return result;
	};

	Object.defineProperty(Function.prototype.call, "toString", {
		value: function () {
			return originalCallToString;
		},
		writable: false,
		configurable: false,
	});

	console.log("Function.prototype.call успешно переопределён.");

	//*======================

	function isIFrameInstance() {
		return window.self !== window.top;
	}

	function createPromise() {
		let resolve, reject;

		const promise = new Promise((res, rej) => {
			resolve = res;
			reject = rej;
		});

		promise.resolve = resolve;
		promise.reject = reject;

		return promise;
	}

	let isTrueMapResolved = false;
	let trueMapName = null;
	let trueMapNamePromise = createPromise();
	trueMapNamePromise.then((val) => {
		isTrueMapResolved = true;
		console.log("found true map name: " + val);
	});
	let decoyMapName = "ground-zero";
	const mapNameRegex = /(?<=map\/)[^\/]+/g;

	window.addEventListener("message", (event) => {
		if (event.data.trueMapName != null) {
			console.log(
				"got message, setting trueMapName, was: " + trueMapNamePromise,
				" becomes: " + event.data.trueMapName
			);

			trueMapName = event.data.trueMapName;
			trueMapNamePromise.resolve(trueMapName);

			return;
		}
	});

	Object.defineProperty(HTMLImageElement.prototype, "src", {
		set(value) {
			console.log("[Image Intercept] Original src:", value);

			if (trueMapName != null) {
				// Проверяем и модифицируем src
				if (
					interceptionRequired[trueMapName] &&
					value.includes(".webp")
				) {
					trueMapNamePromise.then((mapName) => {
						let replacer = mapName;
						if (mapName != null) {
							var alias = mapAlias[mapName];
							replacer = alias == null ? mapName : alias;
						}

						const newSrc = value.replace(decoyMapName, replacer);
						console.log("[Image Intercept] Modified src:", newSrc);

						this.setAttribute("src", newSrc);
					});
					return;
				}
			}

			this.setAttribute("src", value);
		},
	});

	function tryExtractTrueMapName(url) {
		if (isTrueMapResolved) return;
		var match = url.match(mapNameRegex);
		if (!match) return;
		trueMapName = match[0];
		trueMapNamePromise.resolve(trueMapName);
		console.log("true map name resolved: " + match[0]);
	}

	if (!isIFrameInstance()) tryExtractTrueMapName(window.location.href);

	const originalCreateElement = Document.prototype.createElement;

	Document.prototype.createElement = function qwe(tagName, options) {
		const el = originalCreateElement.call(this, tagName, options);

		if (tagName.toLowerCase() === "iframe") {
			console.log("[Iframe lookat] doc-request:", tagName, options);
			const originalSetAttribute = el.setAttribute;

			function sendUrlToIFrame() {
				setTimeout(() => {
					const iframe = document.querySelector("iframe");

					iframe.addEventListener("load", () => {
						iframe.contentWindow.postMessage(
							{trueMapName: trueMapName},
							"*"
						);
					});
				}, 0);
			}

			el.removeAttribute("sandbox");
			el.setAttribute = function (name, value) {
				let match = value.match(mapNameRegex);
				if (
					match &&
					interceptionRequired[match[0]] &&
					name.toLowerCase() === "src"
				) {
					console.log("[Iframe Intercept] doc-request:", value);
					const newSrc =
						"https://api.tarkov.help/api/ru/map/ground-zero/amogus";

					originalSetAttribute.call(this, "src", newSrc);
					sendUrlToIFrame();
					return;
				}
				sendUrlToIFrame();

				return originalSetAttribute.call(this, name, value);
			};
		}

		return el;
	};

	//*======================

	const originalOpen = XMLHttpRequest.prototype.open;
	const originalSend = XMLHttpRequest.prototype.send;
	const originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
	let didAskForIFrameThroughXHR = false;

	XMLHttpRequest.prototype.open = function (method, url) {
		console.log("[XHR Intercept] open:", method, url);

		this._headers = [];

		trueMapNamePromise.then((trueMapName) => {
			if (!isTrueMapResolved && !isIFrameInstance())
				tryExtractTrueMapName(url);

			if (trueMapName != null && url.includes("/map")) {
				if (isIFrameInstance() || didAskForIFrameThroughXHR) {
					url = url.replace(decoyMapName, trueMapName);
				} else {
					url = url.replace(mapNameRegex, decoyMapName);
					didAskForIFrameThroughXHR = true;
				}
			}

			if (url.includes("/map")) {
				let match = url.match(mapNameRegex);
				if (match && interceptionRequired[match[0]]) {
					this._intercepted = true;
				}
			}
			if (url.includes("/subscriptions")) {
				this._intercepted = true;
				this._prebakedData = JSON.stringify(fakeSub);
			}
			if (url.includes("/session")) {
				this._intercepted = true;
				this._prebakedData = JSON.stringify({
					data: {
						session: "123123123123",
						expires: "1237998129378178923798",
					},
				});
			}

			console.log(
				"overriden url: " +
					url +
					" isIntercepted: " +
					this._intercepted +
					" isTrueKeyFetched: " +
					isTrueMapResolved
			);

			this._customData = {
				url: url,
			};
			originalOpen.apply(this, [method, url]);

			this._headers.forEach(({name, value}) => {
				originalSetRequestHeader.call(this, name, value);
			});
		});
	};

	XMLHttpRequest.prototype.send = function (body) {
		const sendArgs = arguments;

		trueMapNamePromise.then((trueMapName) => {
			try {
				if (this._intercepted) {
					var url = this._customData.url.replace(
						decoyMapName,
						trueMapName
					);
					console.log(
						"[XHR Intercept] send body:",
						body,
						"url: " + url
					);
					dataPromise.then((data) => {
						respondWithData(this, url, body, sendArgs);
					});
					return;
				} else {
					console.log("ignoring request: " + this._customData.url);
					return originalSend.apply(this, arguments);
				}
			} catch (error) {
				console.error("Ошибка при перехвате вызова:", error);
			}
		});
	};

	XMLHttpRequest.prototype.setRequestHeader = function (name, value) {
		if (!this._headers) {
			return originalSetRequestHeader.call(this, name, value);
		}

		this._headers.push({name, value});
	};

	function respondWithData(xhr, url, body, sendArgs) {
		let responseText = null;
		if ("_prebakedData" in xhr) {
			responseText = xhr._prebakedData;
		} else {
			responseText = JSON.stringify(getFakeMapResponse(url, body));
		}

		if (responseText == "null") {
			console.log(
				"не получилось найти данные для перехваченного запроса: " + url
			);
			return originalSend.apply(xhr, sendArgs);
		}

		const fakeStatus = 200;
		const fakeStatusText = "OK";
		const fakeResponseURL = xhr._url;

		xhr._fakeStatus = fakeStatus;
		xhr._fakeStatusText = fakeStatusText;
		xhr._fakeResponseText = responseText;
		xhr._fakeResponseURL = fakeResponseURL;
		xhr._fakeReadyState = 4;

		Object.defineProperty(xhr, "status", {
			get: () => xhr._fakeStatus,
		});
		Object.defineProperty(xhr, "statusText", {
			get: () => xhr._fakeStatusText,
		});
		Object.defineProperty(xhr, "responseText", {
			get: () => xhr._fakeResponseText,
		});
		Object.defineProperty(xhr, "response", {
			get: () => xhr._fakeResponseText,
		});
		Object.defineProperty(xhr, "readyState", {
			get: () => xhr._fakeReadyState,
		});
		Object.defineProperty(xhr, "responseURL", {
			get: () => xhr._fakeResponseURL,
		});

		Object.defineProperty(xhr, "getAllResponseHeaders", {
			value: function () {
				return "Content-Type: application/json\r\n";
			},
			configurable: true,
			writable: true,
		});
		delete xhr.getResponseHeader;
		Object.defineProperty(xhr, "getResponseHeader", {
			configurable: true,
			writable: true,
			value: function (name) {
				if (name.toLowerCase() === "content-type") {
					return "application/json";
				}
				return null;
			},
		});

		setTimeout(() => {
			if (typeof xhr.onreadystatechange === "function") {
				xhr.onreadystatechange();
			}
			xhr.dispatchEvent(new Event("readystatechange"));

			if (typeof xhr.onload === "function") {
				xhr.onload();
			}
			xhr.dispatchEvent(new Event("load"));

			if (typeof xhr.onloadend === "function") {
				xhr.onloadend();
			}
			xhr.dispatchEvent(new Event("loadend"));
		}, 0);
	}

	function getFakeMapResponse(url, body) {
		console.log("fake map data requested: " + url, body);

		const mapNameMatch = url.match(mapNameRegex);
		var mapName = mapNameMatch ? mapNameMatch[0] : null;

		let mapPart = url.split("/map/")[1];
		const typeMatch = mapPart.match(/\/([^\/\?]+)(?:[\/\?]|$)/);
		var type = typeMatch ? typeMatch[1] : null;

		var mapData = mapLinkContainer[mapName];
		if (mapData == null) return null;
		var mapTypeData = mapData[type];
		if (mapTypeData == null) mapTypeData = mapData.info;

		console.log("сырые данные по урл: " + url, mapTypeData);

		const response = JSON.parse(JSON.stringify(mapTypeData));

		if (body !== null) {
			let parsedBody;
			try {
				parsedBody = JSON.parse(body);
			} catch (e) {
				console.error("Ошибка при разборе JSON:", e);
			}

			if (
				parsedBody !== null &&
				parsedBody.limit !== undefined &&
				parsedBody.offset !== undefined
			) {
				response.data = response.data.slice(
					parsedBody.offset,
					parsedBody.offset + parsedBody.limit
				);
			}
		}

		return response;
	}
})();
