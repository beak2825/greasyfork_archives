// ==UserScript==
// @name Romeo Additions
// @name:de Romeo Additions
// @namespace https://greasyfork.org/en/users/723211-ray/
// @version 9.5.1
// @description Enhances GR, especially for non-PLUS users
// @description:de Verbessert GR, insbesondere für nicht-PLUS-Benutzer
// @author -Ray-, Djamana
// @match *://*.romeo.com/*
// @license MIT
// @grant none
// @iconURL https://www.romeo.com/assets/favicons/711cd1957a9d865b45974099a6fc413e3bd323fa5fc48d9a964854ad55754ca1/favicon.ico
// @supportURL https://greasyfork.org/en/scripts/419514
// @downloadURL https://update.greasyfork.org/scripts/419514/Romeo%20Additions.user.js
// @updateURL https://update.greasyfork.org/scripts/419514/Romeo%20Additions.meta.js
// ==/UserScript==

const CM2FT = 0.03280839895;
const KG2LBS = 2.20462262185;
const M2MI = 0.0006213712;

function decodeUrl(url)
{
	const [path, paramsText] = url.split("?");
	const params = new URLSearchParams(paramsText);
	return [path, params];
}

function encodeUrl(path, params)
{
	return `${path}?${new URLSearchParams(params)}`;
}

function escapeHtml(unsafe)
{
	return unsafe
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

function formatTime(str)
{
	const date = new Date(Date.parse(str));
	const lang = getLang();
	return `${date.toLocaleDateString(lang)} ${date.toLocaleTimeString(lang)}`;
}

function formatYearMonth(year, month)
{
	const date = new Date(year, month - 1);
	const lang = getLang();
	return date.toLocaleString(lang, { month: "numeric", year: "numeric" });
}

function getLang()
{
	return document.documentElement.getAttribute("lang") || "en";
}

function round(value, maxDigits = 0)
{
	const f = Math.pow(10, maxDigits);
	return Math.round(value * f) / f;
}

(function (css)
{
	css.add = function (css)
	{
		let style = document.createElement('style');
		if (style.styleSheet)
			style.styleSheet.cssText = css;
		else
			style.appendChild(document.createTextNode(css));
		return document.head.appendChild(style);
	};

	css.getStyleImageUrl = function (style)
	{
		return style.match(/"(.+)"/)[1];
	};

	css.setProp = function (name, value)
	{
		document.documentElement.style.setProperty(name, value);
	};
}(window.css ??= {}));

(function (dom)
{
	const hooks = {};

	function tagCall(el, callback)
	{
		if (!el.getAttribute("data-ra-hook"))
		{
			el.setAttribute("data-ra-hook", true);
			callback(el);
		}
	}

	dom.add = function (parent, html, prepend)
	{
		if (prepend)
		{
			parent.insertAdjacentHTML("afterbegin", html);
			return parent.firstChild;
		}
		else
		{
			parent.insertAdjacentHTML("beforeend", html);
			return parent.lastChild;
		}
	};

	dom.on = function (selector, callback)
	{
		// Trigger for existing elements.
		for (const el of document.querySelectorAll(selector))
			callback(el);

		// Add to observer list.
		hooks[selector] = callback;
	};

	const observer = new MutationObserver((mutations, observer) =>
	{
		for (const mutation of mutations)
		{
			for (const el of mutation.addedNodes)
			{
				if (el.nodeType === Node.ELEMENT_NODE)
				{
					for (const [selector, callback] of Object.entries(hooks))
					{
						if (el.matches(selector))
						{
							// Trigger for element.
							tagCall(el, callback);
						}
						else
						{
							// Trigger for children of attached elements.
							for (const elChild of el.querySelectorAll(selector))
								tagCall(elChild, callback);
						}
					}
				}
			}
		}
	});
	observer.observe(document.body, { subtree: true, childList: true });
}(window.dom ??= {}));

(function (utm)
{
	const K0 = 0.9996;

	const E = 0.00669438;
	const E2 = E * E;
	const E3 = E2 * E;
	const E_P2 = E / (1.0 - E);

	const SQRT_E = Math.sqrt(1 - E);
	const _E = (1 - SQRT_E) / (1 + SQRT_E);
	const _E2 = _E * _E;
	const _E3 = _E2 * _E;
	const _E4 = _E3 * _E;
	const _E5 = _E4 * _E;

	const M1 = (1 - E / 4 - 3 * E2 / 64 - 5 * E3 / 256);
	const M2 = (3 * E / 8 + 3 * E2 / 32 + 45 * E3 / 1024);
	const M3 = (15 * E2 / 256 + 45 * E3 / 1024);
	const M4 = (35 * E3 / 3072);

	const P2 = (3. / 2 * _E - 27. / 32 * _E3 + 269. / 512 * _E5);
	const P3 = (21. / 16 * _E2 - 55. / 32 * _E4);
	const P4 = (151. / 96 * _E3 - 417. / 128 * _E5);
	const P5 = (1097. / 512 * _E4);

	const R = 6378137;

	const ZONE_LETTERS = "CDEFGHJKLMNPQRSTUVWXX";

	function deg2rad(deg)
	{
		return deg * 0.017453292519943295;
	}

	function rad2deg(rad)
	{
		return rad * 57.29577951308232;
	}

	function modAngle(value)
	{
		return (value + Math.PI) % (2 * Math.PI) - Math.PI;
	}

	function latitudeToZoneLetter(latitude)
	{
		if (-80 <= latitude && latitude <= 84)
			return ZONE_LETTERS[Math.trunc(latitude + 80) >> 3];
	}

	function latlonToZoneNumber(latitude, longitude)
	{
		if ((56 <= latitude && latitude < 64) && (3 <= longitude && longitude < 12))
			return 32;

		if ((72 <= latitude && latitude <= 84) && longitude >= 0)
		{
			if (longitude < 9)
				return 31;
			else if (longitude < 21)
				return 33;
			else if (longitude < 33)
				return 35;
			else if (longitude < 42)
				return 37;
		}

		return Math.trunc((longitude + 180) / 6) + 1;
	}

	function zoneNumberToCentralLongitude(zoneNumber)
	{
		return (zoneNumber - 1) * 6 - 180 + 3;
	}

	utm.fromLatlon = function (latitude, longitude, forcedZoneNumber)
	{
		if (latitude < -80 || latitude > 84)
			throw RangeError("latitude must be between 80 deg S and 84 deg N.");
		if (longitude < -180 || longitude > 180)
			throw RangeError("longitude must be between 180 deg W and 180 deg E.");

		const latRad = deg2rad(latitude);
		const latSin = Math.sin(latRad);
		const latCos = Math.cos(latRad);

		const latTan = latSin / latCos;
		const latTan2 = latTan * latTan;
		const latTan4 = latTan2 * latTan2;

		const zoneNumber = forcedZoneNumber ?? latlonToZoneNumber(latitude, longitude);
		const zoneLetter = latitudeToZoneLetter(latitude);

		const lonRad = deg2rad(longitude);
		const centralLon = zoneNumberToCentralLongitude(zoneNumber);
		const centralLonRad = deg2rad(centralLon);

		const n = R / Math.sqrt(1 - E * Math.pow(latSin, 2));
		const c = E_P2 * Math.pow(latCos, 2);

		const a = latCos * modAngle(lonRad - centralLonRad);
		const a2 = a * a;
		const a3 = a2 * a;
		const a4 = a3 * a;
		const a5 = a4 * a;
		const a6 = a5 * a;

		const m = R * (M1 * latRad -
			M2 * Math.sin(2 * latRad) +
			M3 * Math.sin(4 * latRad) -
			M4 * Math.sin(6 * latRad));

		const easting = K0 * n * (a +
			a3 / 6 * (1 - latTan2 + c) +
			a5 / 120 * (5 - 18 * latTan2 + latTan4 + 72 * c - 58 * E_P2)) + 500000;

		const northing = K0 * (m + n * latTan * (a2 / 2 +
			a4 / 24 * (5 - latTan2 + 9 * c + 4 * Math.pow(c, 2)) +
			a6 / 720 * (61 - 58 * latTan2 + latTan4 + 600 * c - 330 * E_P2)))
			+ (latitude < 0 ? 10000000 : 0);

		return [easting, northing, zoneNumber, zoneLetter];
	};

	utm.toLatlon = function (easting, northing, zoneNumber, zoneLetter)
	{
		zoneLetter = zoneLetter.toUpperCase();
		const northern = zoneLetter >= 'N';

		const x = easting - 500000;
		const y = northern ? northing : northing - 10000000;

		const m = y / K0;
		const mu = m / (R * M1);

		const pRad = (mu +
			P2 * Math.sin(2 * mu) +
			P3 * Math.sin(4 * mu) +
			P4 * Math.sin(6 * mu) +
			P5 * Math.sin(8 * mu));

		const pSin = Math.sin(pRad);
		const pSin2 = pSin * pSin;

		const pCos = Math.cos(pRad);

		const pTan = pSin / pCos;
		const pTan2 = pTan * pTan;
		const pTan4 = pTan2 * pTan2;

		const epSin = 1 - E * pSin2;
		const epSinSqrt = Math.sqrt(1 - E * pSin2);

		const n = R / epSinSqrt;
		const r = (1 - E) / epSin;

		const c = E_P2 * Math.pow(pCos, 2);
		const c2 = c * c;

		const d = x / (n * K0);
		const d2 = d * d;
		const d3 = d2 * d;
		const d4 = d3 * d;
		const d5 = d4 * d;
		const d6 = d5 * d;

		let latitude = (pRad - (pTan / r) *
			(d2 / 2 - d4 / 24 * (5 + 3 * pTan2 + 10 * c - 4 * c2 - 9 * E_P2)) +
			d6 / 720 * (61 + 90 * pTan2 + 298 * c + 45 * pTan4 - 252 * E_P2 - 3 * c2));

		let longitude = (d -
			d3 / 6 * (1 + 2 * pTan2 + c) +
			d5 / 120 * (5 - 2 * c + 28 * pTan2 - 3 * c2 + 8 * E_P2 + 24 * pTan4)) / pCos;
		longitude = modAngle(longitude + deg2rad(zoneNumberToCentralLongitude(zoneNumber)));

		return [rad2deg(latitude), rad2deg(longitude)];
	};
}(window.utm ??= {}));

(function (net)
{
	const hooks = {};
	const xhrOpened = {};
	const realFetch = window.fetch;
	const realOpen = window.XMLHttpRequest.prototype.open;
	const realSend = window.XMLHttpRequest.prototype.send;

	function isJson(value)
	{
		try
		{
			JSON.parse(value);
			return true;
		}
		catch
		{
			return false;
		}
	}

	function matchRoute(path, route)
	{
		const pathParts = path.split("/");
		const routeParts = route.split("/");
		if (pathParts.length !== routeParts.length)
			return;
		const args = [];
		for (let i = 0; i < pathParts.length; ++i)
		{
			if (routeParts[i] === "*")
				args.push(pathParts[i]);
			else if (pathParts[i] !== routeParts[i])
				return;
		}
		return args;
	}

	function callHooks(type, e)
	{
		// Only handle success for now.
		if (e.status && !(e.status >= 200 && e.status < 300))
			return false;

		// Forward to hooking route.
		const matches = e.url.match("/api/[^?]*");
		if (!matches)
			return false;

		let result = false;
		for (const [route, callback] of (hooks[[type, e.method]] ?? []))
		{
			e.args = matchRoute(matches[0], route);
			if (e.args !== undefined)
			{
				romeo.log(`hooked ${type} ${e.method} ${route}`);
				callback(e);
				result ||= true;
			}
		}
		return result;
	}

	net.on = function (type, url, callback)
	{
		const [method, route] = url.split(" ");
		(hooks[[type, method]] ??= []).push([route, callback]);
	};

	net.realXhr = function ()
	{
		const xhr = new XMLHttpRequest();
		xhr.open = realOpen;
		xhr.send = realSend;
		return xhr;
	};

	window.fetch = async function (request, init)
	{
		async function getJsonBody(r)
		{
			// Use conversion to arrayBuffer to check if body exists as Firefox does not have a "body" property.
			const buffer = await r.clone().arrayBuffer();
			if (buffer.byteLength)
			{
				try
				{
					return JSON.parse(new TextDecoder().decode(buffer));
				}
				catch
				{
					return null; // not JSON, currently not interested
				}
			}
		}

		// Only support fetch(Request) overload for now.
		if (!(request instanceof Request))
			return await realFetch(request, init);

		// Manipulate request.
		const eReq =
		{
			body: await getJsonBody(request),
			cancel: false,
			method: request.method,
			url: request.url,
		};
		if (eReq.body === null) // not JSON
			return realFetch(request, init);
		if (callHooks("fetch:send", eReq) && eReq.cancel)
			return;

		// Send request and receive response.
		const response = await realFetch(eReq.url, {
			body: JSON.stringify(eReq.body),
			cache: request.cache,
			credentials: request.credentials,
			headers: request.headers,
			integrity: request.integrity,
			keepalive: request.keepalive,
			method: eReq.method,
			mode: request.mode,
			redirect: request.redirect,
			referrer: request.referrer,
			referrerPolicy: request.referrerPolicy,
		});

		// Manipulate response.
		const eRes =
		{
			body: await getJsonBody(response),
			cancel: false,
			method: request.method,
			status: response.status,
			url: request.url,
		};
		if (eRes.body === null) // not JSON
			return response;
		if (callHooks("fetch:recv", eRes) && eRes.cancel)
		{
			eRes.body = null;
			eRes.status = 404;
		}
		return new Response(JSON.stringify(eRes.body), { headers: response.headers, status: eRes.status });
	};

	window.XMLHttpRequest.prototype.open = function (method, url, async, user, password)
	{
		const e = { method: method, url: url };
		xhrOpened[this] = e;

		if (callHooks("xhr:open", e))
		{
			method = e.method;
			url = e.url;
		}
		if (!e.cancel)
			realOpen.apply(this, arguments);

		// Hook load.
		this.addEventListener("load", () =>
		{
			const json = isJson(this.response);
			e.body = json ? JSON.parse(this.response) : this.response;
			e.status = this.status;

			if (callHooks("xhr:load", e))
			{
				Object.defineProperty(this, "responseText", { writable: true });
				this.responseText = json ? JSON.stringify(e.body) : e.body;
			}
			if (e.cancel)
			{
				this.response = null;
				this.responseText = null;
				this.status = 404;
			}
		});
	};

	window.XMLHttpRequest.prototype.send = function (body)
	{
		const e = xhrOpened[this];
		delete xhrOpened[this];
		const json = isJson(body);
		if (body)
			e.body = json ? JSON.parse(body) : body;

		if (callHooks("xhr:send", e) && e.body)
			body = json ? JSON.stringify(e.body) : body;
		if (!e.cancel)
			realSend.apply(this, arguments);
	};
}(window.net ??= {}));

(function (str)
{
	str.strings =
	{
		aboutMe:
		{
			de: "Über mich",
			en: "About Me",
		},
		age:
		{
			de: "Alter",
			en: "Age",
		},
		ageRange:
		{
			de: "Altersspanne",
			en: "Age range",
		},
		ageRangeValue:
		{
			de: "Zwischen $from und $to",
			en: "Between $from and $to",
		},
		analPosition:
		{
			en: "Position",
		},
		analPosition_TOP_ONLY:
		{
			de: "Nur Aktiv",
			en: "Top only",
		},
		analPosition_MORE_TOP:
		{
			de: "Eher Aktiv",
			en: "More top",
		},
		analPosition_VERSATILE:
		{
			de: "Flexibel",
			en: "Versatile",
		},
		analPosition_MORE_BOTTOM:
		{
			de: "Eher Passiv",
			en: "More bottom",
		},
		analPosition_BOTTOM_ONLY:
		{
			de: "Nur Passiv",
			en: "Bottom only",
		},
		analPosition_NO:
		{
			de: "Kein Anal",
			en: "No anal",
		},
		beard:
		{
			de: "Bart",
			en: "Beard",
		},
		beard_DESIGNER_STUBBLE:
		{
			de: "3-Tage-Bart",
			en: "Designer stubble",
		},
		beard_FULL_BEARD:
		{
			de: "Vollbart",
			en: "Full beard",
		},
		beard_GOATEE:
		{
			en: "Goatee",
		},
		beard_MOUSTACHE:
		{
			de: "Schnauzer",
			en: "Moustache",
		},
		beard_NO_BEARD:
		{
			de: "Kein Bart",
			en: "No beard",
		},
		bedAndBreakfast:
		{
			en: "Bed & Breakfast",
		},
		blockUser:
		{
			de: "Benutzer blockieren",
			en: "Block user",
		},
		bmi:
		{
			en: "BMI",
		},
		bmiMildThin:
		{
			de: "Leichtes Untergewicht",
			en: "Mildly Thin",
		},
		bmiModerateThin:
		{
			de: "Mäßiges Untergewicht",
			en: "Moderately Thin",
		},
		bmiNormal:
		{
			de: "Normal",
			en: "Normal",
		},
		bmiObese1:
		{
			de: "Adipositas I",
			en: "Obese Class I",
		},
		bmiObese2:
		{
			de: "Adipositas II",
			en: "Obese Class II",
		},
		bmiObese3:
		{
			de: "Adipositas III",
			en: "Obese Class III",
		},
		bmiPreObese:
		{
			de: "Präadipositas",
			en: "Pre-Obese",
		},
		bmiSevereThin:
		{
			de: "Starkes Untergewicht",
			en: "Severely Thin",
		},
		bodyType:
		{
			de: "Statur",
			en: "Body Type",
		},
		bodyType_ATHLETIC:
		{
			de: "Athletisch",
			en: "Athletic",
		},
		bodyType_AVERAGE:
		{
			de: "Normal",
			en: "Average",
		},
		bodyType_BELLY:
		{
			de: "Bauch",
			en: "Belly",
		},
		bodyType_MUSCULAR:
		{
			de: "Muskulös",
			en: "Muscular",
		},
		bodyType_SLIM:
		{
			de: "Schlank",
			en: "Slim",
		},
		bodyType_STOCKY:
		{
			de: "Stämmig",
			en: "Stocky",
		},
		bodyHair:
		{
			de: "Körperbehaarung",
			en: "Body Hair",
		},
		bodyHair_AVERAGE:
		{
			de: "Mittel behaart",
			en: "Hairy",
		},
		bodyHair_LITTLE:
		{
			de: "Wenig behaart",
			en: "Not very hairy",
		},
		bodyHair_SHAVED:
		{
			de: "Rasiert",
			en: "Shaved",
		},
		bodyHair_SMOOTH:
		{
			de: "Unbehaart",
			en: "Smooth",
		},
		bodyHair_VERY_HAIRY:
		{
			de: "Stark behaart",
			en: "Very hairy",
		},
		chooseLocation:
		{
			de: "Wähle deinen Standort",
			en: "Choose your location",
		},
		clearList:
		{
			de: "Möchtest du wirklich alle Einträge in der Liste entfernen?",
			en: "Do you really want to remove all elements from the list?",
		},
		concision:
		{
			de: "Beschneidung",
			en: "Concision",
		},
		concision_CUT:
		{
			de: "Beschnitten",
			en: "Cut",
		},
		concision_UNCUT:
		{
			de: "Unbeschnitten",
			en: "Uncut",
		},
		customRadius:
		{
			de: "Benutzerdefinierter Radius",
			en: "Custom Radius",
		},
		deleteUnread:
		{
			de: "Ungelesene löschen",
			en: "Delete unread"
		},
		dick:
		{
			de: "Schwanz",
			en: "Dick",
		},
		dick_S:
		{
			en: "S",
		},
		dick_M:
		{
			en: "M",
		},
		dick_L:
		{
			en: "L",
		},
		dick_XL:
		{
			en: "XL",
		},
		dick_XXL:
		{
			en: "XXL",
		},
		dirty:
		{
			en: "Dirty",
		},
		dirty_NO:
		{
			de: "Kein Dirty",
			en: "No dirty",
		},
		dirty_WS_ONLY:
		{
			de: "Ja, aber nur NS",
			en: "WS only",
		},
		dirty_YES:
		{
			en: "Dirty",
		},
		discover:
		{
			de: "Entdecken-Seite",
			en: "Discover page",
		},
		discoverBanners:
		{
			de: "Blogeinträge",
			en: "Blog posts",
		},
		discoverBannersDesc:
		{
			de: "Zeigt Banner oben auf der Entdecken-Seite.",
			en: "Displays banners at the top of the Discover page.",
		},
		discoverFilter:
		{
			de: "Radarfilter anwenden",
			en: "Apply radar filter",
		},
		discoverFilterDesc:
		{
			de: "Wendet Radarfilter auf der Entdecken-Seite an.",
			en: "Applies radar filter on the Discover page.",
		},
		discoverGroups:
		{
			de: "Beliebte Gruppen",
			en: "Popular Groups",
		},
		discoverGroupsDesc:
		{
			de: "Zeigt Gruppen auf der Entdecken-Seite.",
			en: "Displays groups on the Discover page.",
		},
		distance:
		{
			de: "Entfernung",
			en: "Distance",
		},
		filter:
		{
			en: "Filter",
		},
		enhancedFilter:
		{
			de: "Erweiterter Filter",
			en: "Extended filter",
		},
		enhancedFilterDesc:
		{
			de: "Erlaubt Radar-Ergebnisse nach allen Details zu filtern.",
			en: "Allows to filter radar results by additional details.",
		},
		enhancedImages:
		{
			de: "Hochauflösende Bilder",
			en: "High-resolution images",
		},
		enhancedImagesDesc:
		{
			de: "Zeigt Kachelbilder in maximaler Auflösung.",
			en: "Shows tile images in maximum resolution.",
		},
		enhancedTiles:
		{
			de: "Große Kacheln erzwingen",
			en: "Force big grid",
		},
		enhancedTilesDesc:
		{
			de: "Zeigt alle Benutzer in großen Kacheln.",
			en: "Shows all users in big tiles.",
		},
		ethnicity:
		{
			de: "Typ",
			en: "Ethnicity",
		},
		ethnicity_ARAB:
		{
			de: "Araber",
			en: "Arab",
		},
		ethnicity_ASIAN:
		{
			de: "Asiate",
			en: "Asian",
		},
		ethnicity_BLACK:
		{
			de: "Schwarz",
			en: "Black",
		},
		ethnicity_CAUCASIAN:
		{
			de: "Europäer",
			en: "Caucasian",
		},
		ethnicity_INDIAN:
		{
			de: "Inder",
			en: "Indian",
		},
		ethnicity_LATIN:
		{
			de: "Latino",
			en: "Latin",
		},
		ethnicity_MEDITERRANEAN:
		{
			de: "Südländer",
			en: "Mediterranean",
		},
		ethnicity_MIXED:
		{
			en: "Mixed",
		},
		eyeColor:
		{
			de: "Augenfarbe",
			en: "Eye Colour",
		},
		eyeColor_BLUE:
		{
			de: "Blau",
			en: "Blue",
		},
		eyeColor_BROWN:
		{
			de: "Braun",
			en: "Brown",
		},
		eyeColor_GREEN:
		{
			de: "Grün",
			en: "Green",
		},
		eyeColor_GREY:
		{
			de: "Grau",
			en: "Grey",
		},
		eyeColor_OTHER:
		{
			de: "Sonstige",
			en: "Other",
		},
		fetish:
		{
			de: "Fetisch",
			en: "Fetish",
		},
		fetish_BOOTS:
		{
			en: "Boots",
		},
		fetish_CROSSDRESSING:
		{
			de: "Cross-Dressing",
			en: "Cross-dressing",
		},
		fetish_DRAG:
		{
			de: "Dessous",
			en: "Lingerie",
		},
		fetish_FORMAL:
		{
			de: "Anzug",
			en: "Formal dress",
		},
		fetish_JEANS:
		{
			en: "Jeans",
		},
		fetish_LEATHER:
		{
			de: "Leder",
			en: "Leather",
		},
		fetish_LYCRA:
		{
			en: "Lycra",
		},
		fetish_RUBBER:
		{
			en: "Rubber",
		},
		fetish_SKATER:
		{
			en: "Skater",
		},
		fetish_SKINS:
		{
			en: "Skins & Punks",
		},
		fetish_SNEAKERS:
		{
			en: "Sneakers & Socks",
		},
		fetish_SPORTS:
		{
			de: "Sportsgear",
			en: "Sports gear",
		},
		fetish_TECHNO:
		{
			en: "Raver",
		},
		fetish_UNDERWEAR:
		{
			de: "Unterwäsche",
			en: "Underwear",
		},
		fetish_UNIFORM:
		{
			en: "Uniform",
		},
		fetish_WORKER:
		{
			de: "Handwerker",
			en: "Worker",
		},
		filters:
		{
			en: "Filters",
			de: "Filter",
		},
		fisting:
		{
			de: "Fisten",
			en: "Fisting",
		},
		fisting_ACTIVE:
		{
			de: "FF Aktiv",
			en: "FF Active",
		},
		fisting_ACTIVE_PASSIVE:
		{
			de: "FF Flexibel",
			en: "FF Versatile",
		},
		fisting_NO:
		{
			de: "Kein FF",
			en: "No FF",
		},
		fisting_PASSIVE:
		{
			de: "FF Passiv",
			en: "FF Passive",
		},
		fullHeadlines:
		{
			de: "Vollständige Überschriften",
			en: "Full headlines",
		},
		fullHeadlinesDesc:
		{
			de: "Zeigt lange Profilüberschriften vollständig.",
			en: "Shows long profile headlines completely.",
		},
		fullMessages:
		{
			de: "Vollständige Nachrichten",
			en: "Full messages",
		},
		fullMessagesDesc:
		{
			de: "Zeigt Nachrichten ungekürzt in der Nachrichtenliste.",
			en: "Shows messages without truncation in the message list.",
		},
		gender:
		{
			de: "Geschlecht",
			en: "Gender",
		},
		gender_MAN:
		{
			de: "Mann",
			en: "Man",
		},
		gender_TRANS_MAN:
		{
			de: "Transmann",
			en: "Trans man",
		},
		gender_TRANS_WOMAN:
		{
			de: "Transfrau",
			en: "Trans woman",
		},
		gender_NON_BINARY:
		{
			de: "Nicht binär",
			en: "Non-binary",
		},
		gender_OTHER:
		{
			de: "Anderes",
			en: "Other",
		},
		genderOrientation:
		{
			de: "Ich bin",
			en: "I am",
		},
		general:
		{
			de: "Allgemein",
			en: "General",
		},
		hairColor:
		{
			de: "Haarfarbe",
			en: "Hair Colour",
		},
		hairColor_BLACK:
		{
			de: "Schwarz",
			en: "Black",
		},
		hairColor_BLOND:
		{
			en: "Blond",
		},
		hairColor_BROWN:
		{
			de: "Braune Haare",
			en: "Brown",
		},
		hairColor_GREY:
		{
			de: "Grau",
			en: "Grey",
		},
		hairColor_LIGHT_BROWN:
		{
			de: "Dunkelblond",
			en: "Light brown",
		},
		hairColor_OTHER:
		{
			de: "Sonstige",
			en: "Other",
		},
		hairColor_RED:
		{
			de: "Rot",
			en: "Red",
		},
		hairLength:
		{
			de: "Haarlänge",
			en: "Hair Length",
		},
		hairLength_AVERAGE:
		{
			de: "Normal",
			en: "Average",
		},
		hairLength_LONG:
		{
			de: "Lang",
			en: "Long",
		},
		hairLength_PUNK:
		{
			en: "Punk",
		},
		hairLength_SHAVED:
		{
			de: "Rasiert",
			en: "Shaved",
		},
		hairLength_SHORT:
		{
			de: "Kurz",
			en: "Short",
		},
		height:
		{
			de: "Größe",
			en: "Height",
		},
		hiddenUsers:
		{
			de: "Ausgeblendete Benutzer",
			en: "Hidden users",
		},
		hideActivities:
		{
			de: "In Aktivitäten ausblenden",
			en: "Hide in activities",
		},
		hideContacts:
		{
			de: "In Kontakten ausblenden",
			en: "Hide in contacts",
		},
		hideFriends:
		{
			de: "In Freunden ausblenden",
			en: "Hide in friends",
		},
		hideLikes:
		{
			de: "In Likes ausblenden",
			en: "Hide in likes",
		},
		hideMessages:
		{
			de: "In Nachrichten ausblenden",
			en: "Hide in messages",
		},
		hideUser:
		{
			de: "Benutzer ausblenden",
			en: "Hide user",
		},
		hideVisits:
		{
			de: "In Besuchern ausblenden",
			en: "Hide in visitors",
		},
		interests:
		{
			de: "Interessen",
			en: "Interests",
		},
		interests_ART:
		{
			de: "Kunst",
			en: "Art",
		},
		interests_BOARDGAME:
		{
			de: "Brettspiele",
			en: "Board games",
		},
		interests_CAR:
		{
			de: "Autos",
			en: "Cars",
		},
		interests_COLLECT:
		{
			de: "Sammeln",
			en: "Collecting",
		},
		interests_COMPUTER:
		{
			de: "Computer",
			en: "Computers",
		},
		interests_COOK:
		{
			de: "Kochen",
			en: "Cooking",
		},
		interests_DANCE:
		{
			en: "Dance",
		},
		interests_FILM:
		{
			en: "Film & Video",
		},
		interests_FOTO:
		{
			de: "Fotografie",
			en: "Photography",
		},
		interests_GAME:
		{
			de: "Computerspiele",
			en: "Gaming",
		},
		interests_LITERATURE:
		{
			de: "Literatur",
			en: "Literature",
		},
		interests_MODELING:
		{
			de: "Modellbau",
			en: "Model building",
		},
		interests_MOTORBIKE:
		{
			de: "Motorrad",
			en: "Motorbikes",
		},
		interests_MUSIC:
		{
			de: "Musik",
			en: "Music",
		},
		interests_NATURE:
		{
			de: "Natur",
			en: "Nature",
		},
		interests_POLITICS:
		{
			de: "Politik",
			en: "Politics",
		},
		interests_TV:
		{
			en: "TV",
		},
		languages:
		{
			de: "Sprachen",
			en: "Languages",
		},
		languages_af:
		{
			de: "Afrikaans",
			en: "Afrikaans",
		},
		languages_ar:
		{
			de: "Arabisch",
			en: "Arabic",
		},
		languages_arm:
		{
			de: "Armenisch",
			en: "Armenian",
		},
		languages_az:
		{
			de: "Aserbaidschanisch",
			en: "Azerbaijani",
		},
		languages_be:
		{
			de: "Belarussisch",
			en: "Belarusian",
		},
		languages_bg:
		{
			de: "Bulgarisch",
			en: "Bulgarian",
		},
		languages_bn:
		{
			de: "Bengali",
			en: "Bengali",
		},
		languages_bs:
		{
			de: "Bosnisch",
			en: "Bosnian",
		},
		languages_bur:
		{
			de: "Burmesisch",
			en: "Burmese",
		},
		languages_ca:
		{
			de: "Katalanisch",
			en: "Catalan",
		},
		languages_ceb:
		{
			de: "Cebuano",
			en: "Cebuano",
		},
		languages_cs:
		{
			de: "Tschechisch",
			en: "Czech",
		},
		languages_da:
		{
			de: "Dänisch",
			en: "Danish",
		},
		languages_de:
		{
			de: "Deutsch",
			en: "German",
		},
		languages_el:
		{
			de: "Griechisch",
			en: "Greek",
		},
		languages_en:
		{
			de: "Englisch",
			en: "English",
		},
		languages_eo:
		{
			de: "Esperanto",
			en: "Esperanto",
		},
		languages_es:
		{
			de: "Spanisch",
			en: "Spanish",
		},
		languages_et:
		{
			de: "Estnisch",
			en: "Estonian",
		},
		languages_eu:
		{
			de: "Baskisch",
			en: "Basque",
		},
		languages_fa:
		{
			de: "Persisch",
			en: "Persian",
		},
		languages_fi:
		{
			de: "Finnisch",
			en: "Finnish",
		},
		languages_fr:
		{
			de: "Französisch",
			en: "French",
		},
		languages_frc:
		{
			de: "Kanadisches Französisch",
			en: "Canadian French",
		},
		languages_gd:
		{
			de: "Schottisch-Gälisch",
			en: "Scottish Gaelic",
		},
		languages_gl:
		{
			de: "Galician",
			en: "Galician",
		},
		languages_gsw:
		{
			de: "Schwyzerdütsch",
			en: "Swiss-German",
		},
		languages_hi:
		{
			de: "Hindi",
			en: "Hindi",
		},
		languages_hr:
		{
			de: "Kroatisch",
			en: "Croatian",
		},
		languages_hu:
		{
			de: "Ungarisch",
			en: "Hungarian",
		},
		languages_id:
		{
			de: "Indonesisch",
			en: "Indonesian",
		},
		languages_is:
		{
			de: "Isländisch",
			en: "Icelandic",
		},
		languages_it:
		{
			de: "Italienisch",
			en: "Italian",
		},
		languages_iw:
		{
			de: "Hebräisch",
			en: "Hebrew",
		},
		languages_ja:
		{
			de: "Japanisch",
			en: "Japanese",
		},
		languages_ka:
		{
			de: "Georgisch",
			en: "Georgian",
		},
		languages_kl:
		{
			de: "Grönländisch",
			en: "Greenlandic (Kalaallisut)",
		},
		languages_km:
		{
			de: "Kambodschanisch",
			en: "Cambodian",
		},
		languages_kn:
		{
			de: "Kannada",
			en: "Kannada",
		},
		languages_ko:
		{
			de: "Koreanisch",
			en: "Korean",
		},
		languages_ku:
		{
			de: "Kurdisch",
			en: "Kurdish",
		},
		languages_la:
		{
			de: "Latein",
			en: "Latin",
		},
		languages_lb:
		{
			de: "Luxemburgisch",
			en: "Luxembourgish",
		},
		languages_lo:
		{
			de: "Laotisch",
			en: "Lao",
		},
		languages_lt:
		{
			de: "Litauisch",
			en: "Lithuanian",
		},
		languages_lv:
		{
			de: "Lettisch",
			en: "Latvian",
		},
		languages_mk:
		{
			de: "Mazedonisch",
			en: "Macedonian",
		},
		languages_ml:
		{
			de: "Malayalam",
			en: "Malayalam",
		},
		languages_mr:
		{
			de: "Marathi",
			en: "Marathi",
		},
		languages_ms:
		{
			de: "Malaiisch",
			en: "Malay",
		},
		languages_mt:
		{
			de: "Maltesisch",
			en: "Maltese",
		},
		languages_nl:
		{
			de: "Niederländisch",
			en: "Dutch",
		},
		languages_no:
		{
			de: "Norwegisch",
			en: "Norwegian",
		},
		languages_oc:
		{
			de: "Okzitanisch",
			en: "Occitan",
		},
		languages_pl:
		{
			de: "Polnisch",
			en: "Polish",
		},
		languages_ps:
		{
			de: "Paschtunisch",
			en: "Pashto",
		},
		languages_pt:
		{
			de: "Portugiesisch",
			en: "Portuguese",
		},
		languages_ro:
		{
			de: "Rumänisch",
			en: "Romanian",
		},
		languages_roh:
		{
			de: "Rätoromanisch",
			en: "Romansch",
		},
		languages_ru:
		{
			de: "Russisch",
			en: "Russian",
		},
		languages_sgn:
		{
			de: "Gebärdensprache",
			en: "Sign language",
		},
		languages_sh:
		{
			de: "Serbo-Croatian",
			en: "Serbo-Croatian",
		},
		languages_sk:
		{
			de: "Slowakisch",
			en: "Slovak",
		},
		languages_sl:
		{
			de: "Slowenisch",
			en: "Slovenian",
		},
		languages_sq:
		{
			de: "Albanisch",
			en: "Albanian",
		},
		languages_sr:
		{
			de: "Serbisch",
			en: "Serbian",
		},
		languages_sv:
		{
			de: "Schwedisch",
			en: "Swedish",
		},
		languages_ta:
		{
			de: "Tamil",
			en: "Tamil",
		},
		languages_te:
		{
			de: "Telugu",
			en: "Telugu",
		},
		languages_th:
		{
			de: "Thailändisch",
			en: "Thai",
		},
		languages_tl:
		{
			de: "Tagalog",
			en: "Tagalog",
		},
		languages_tr:
		{
			de: "Türkisch",
			en: "Turkish",
		},
		languages_uk:
		{
			de: "Ukrainisch",
			en: "Ukrainian",
		},
		languages_us:
		{
			de: "US-Englisch",
			en: "US English",
		},
		languages_vi:
		{
			de: "Vietnamesisch",
			en: "Vietnamese",
		},
		languages_wel:
		{
			de: "Walisisch",
			en: "Welsh",
		},
		languages_wen:
		{
			de: "Sorbisch",
			en: "Sorbian",
		},
		languages_zgh:
		{
			de: "Tamazight",
			en: "Tamazight",
		},
		languages_zh:
		{
			de: "Chinesisch",
			en: "Chinese",
		},
		lastLogin:
		{
			de: "Letzter Login",
			en: "Last Login",
		},
		location:
		{
			de: "Ort",
			en: "Location",
		},
		latLong:
		{
			de: "Breitengrad, Längengrad",
			en: "Latitude, Longitude",
		},
		location:
		{
			de: "Profilstandort",
			en: "Profile location",
		},
		locationFuzz:
		{
			de: "Ungenauer GPS-Standort",
			en: "Fuzzy GPS location",
		},
		locationFuzzDesc:
		{
			de: "Verschleiert GPS-bestimmte Standorte zum Schutz der Privatsphäre.",
			en: "Blurs GPS detected locations to protect privacy.",
		},
		lookingFor:
		{
			de: "Ich suche",
			en: "Looking For",
		},
		lookingForOther:
		{
			de: "Sucht nach",
			en: "They're Looking For",
		},
		maxAge:
		{
			de: "Maximales Alter",
			en: "Maximal age",
		},
		messages:
		{
			de: "Nachrichten",
			en: "Messages",
		},
		metadata:
		{
			de: "Metadaten",
			en: "Metadata",
		},
		minAge:
		{
			de: "Minimales Alter",
			en: "Minimal age",
		},
		myAge:
		{
			de: "Mein Alter",
			en: "My Age",
		},
		myGender:
		{
			de: "Mein Geschlecht",
			en: "My gender",
		},
		myOrientation:
		{
			de: "Meine Orientierung",
			en: "My orientation",
		},
		new:
		{
			de: "Neu",
			en: "New",
		},
		noEntry:
		{
			de: "Keine Angabe",
			en: "No entry",
		},
		onlineStatus:
		{
			en: "Status",
		},
		onlineStatus_DATE:
		{
			en: "Date",
		},
		onlineStatus_OFFLINE:
		{
			en: "Offline",
		},
		onlineStatus_ONLINE:
		{
			en: "Online",
		},
		onlineStatus_SEX:
		{
			en: "Now",
		},
		travelersOnly:
		{
			de: "Nur Reisende",
			en: "Travelers only",
		},
		openTo:
		{
			de: "Offen für",
			en: "Open to",
		},
		openTo_FRIENDSHIP:
		{
			de: "Freunde",
			en: "Friends",
		},
		openTo_RELATIONSHIP:
		{
			de: "Beziehung",
			en: "Relationship",
		},
		openTo_SEXDATES:
		{
			en: "Sex",
		},
		orientation:
		{
			de: "Orientierung",
			en: "Orientation",
		},
		orientation_BISEXUAL:
		{
			de: "Bisexuell",
			en: "Bisexual",
		},
		orientation_GAY:
		{
			en: "Gay",
		},
		orientation_QUEER:
		{
			en: "Queer",
		},
		orientation_OTHER:
		{
			de: "Andere",
			en: "Other",
		},
		orientation_STRAIGHT:
		{
			de: "Hetero",
			en: "Straight",
		},
		other:
		{
			de: "Sonstige",
			en: "Other",
		},
		piercings:
		{
			en: "Piercings",
		},
		piercings_A_FEW:
		{
			de: "Wenige",
			en: "A few",
		},
		piercings_A_LOT:
		{
			de: "Viele",
			en: "A lot",
		},
		piercings_NO:
		{
			de: "Keine Piercings",
			en: "No piercings",
		},
		profileId:
		{
			de: "Profil-ID",
			en: "Profile ID",
		},
		relationship:
		{
			de: "Beziehung",
			en: "Relationship",
		},
		relationship_MARRIED:
		{
			de: "Verheiratet",
			en: "Married",
		},
		relationship_OPEN:
		{
			de: "Offene Partnerschaft",
			en: "Open",
		},
		relationship_PARTNER:
		{
			de: "Verpartnert",
			en: "Partner",
		},
		relationship_SINGLE:
		{
			en: "Single",
		},
		saferSex:
		{
			de: "Safer Sex",
			en: "Safer sex",
		},
		saferSex_ALWAYS:
		{
			en: "Safe",
		},
		saferSex_CONDOM:
		{
			de: "Kondom",
			en: "Condom",
		},
		saferSex_NEEDS_DISCUSSION:
		{
			de: "Nach Absprache",
			en: "Let's talk",
		},
		saferSex_PREP:
		{
			en: "PrEP",
		},
		saferSex_PREP_AND_CONDOM:
		{
			de: "PrEP und Kondom",
			en: "PrEP and condom",
		},
		saferSex_TASP:
		{
			en: "TasP",
		},
		searchFilter:
		{
			de: "Suche filtern",
			en: "Filter Search",
		},
		searchFilterDesc:
		{
			de: "Wendet Radarfilter auf die Suchergebnisse an.",
			en: "Applies radar filter on the search results.",
		},
		sendEnter:
		{
			de: "Enter sendet Nachricht",
			en: "Enter sends message",
		},
		sendEnterDesc:
		{
			de: "Wenn deaktiviert erzeugt Enter einen Absatz und Strg+Enter sendet die Nachricht.",
			en: "If disabled, Enter creates a new line instead and Ctrl+Enter sends the message.",
		},
		sexual:
		{
			de: "Sexuelles",
			en: "Sexual",
		},
		sm:
		{
			de: "SM",
			en: "S&M",
		},
		sm_NO:
		{
			de: "Kein SM",
			en: "No SM",
		},
		sm_SOFT:
		{
			en: "Soft SM",
		},
		sm_YES:
		{
			en: "SM",
		},
		smoker:
		{
			de: "Raucher",
			en: "Smoker",
		},
		smoker_NO:
		{
			de: "Nein",
			en: "No",
		},
		smoker_SOCIALLY:
		{
			de: "Selten",
			en: "Socially",
		},
		smoker_YES:
		{
			de: "Ja",
			en: "Yes",
		},
		socialSmoker:
		{
			de: "Raucht selten",
			en: "Social Smoker",
		},
		speakingMyLanguage:
		{
			de: "Spricht meine Sprache",
			en: "Speaking my language",
		},
		systemMessages:
		{
			de: "Systemnachrichten",
			en: "System messages",
		},
		systemMessagesDesc:
		{
			de: "Erlaubt Popups wie Standort- oder Fehlermeldungen.",
			en: "Allows popups like GPS or error messages.",
		},
		tattoos:
		{
			en: "Tattoos",
		},
		tattoos_A_FEW:
		{
			de: "Wenige",
			en: "A few",
		},
		tattoos_A_LOT:
		{
			de: "Viele",
			en: "A lot",
		},
		tattoos_NO:
		{
			de: "Keine Tattoos",
			en: "No tattoos",
		},
		tiles:
		{
			de: "Benutzerkacheln",
			en: "User tiles",
		},
		tileCount:
		{
			de: "Kachelspalten (0 für Standard)",
			en: "Tile columns (0 for default)",
		},
		typingNotifications:
		{
			de: "Tippbenachrichtigungen",
			en: "Typing notifications",
		},
		typingNotificationsDesc:
		{
			de: "Ob Empfänger die Eingabe einer Nachricht sehen können.",
			en: "Whether receivers can see that a message is being written.",
		},
		unlockPausedProfile:
		{
			de: "Pausiertes Profil entsperren",
			en: "Unlock paused profile",
		},
		unlockPausedProfileDesc:
		{
			de: "Erlaubt Verwendung der Plattform während das Profil pausiert ist.",
			en: "Allows using the platform while the profile is paused.",
		},
		viewFullImage:
		{
			de: "Bild anzeigen",
			en: "Preview image",
		},
		viewProfile:
		{
			de: "Profilvorschau anzeigen",
			en: "Preview profile",
		},
		weight:
		{
			de: "Gewicht",
			en: "Weight",
		},
	};

	str.get = function (key)
	{
		const translations = str.strings[key];
		return translations
			? translations[getLang()] || translations.en || "%" + key + "%"
			: "%" + key + "%";
	};

	str.getEnum = function (name, key)
	{
		return str.get(`${name}_${key}`);
	};
}(window.str ??= {}));

(function (list)
{
	list.create = function (parent, { onGet, onName = null, onAdd = null, onRemove = null, onImport = null, onExport = null } = {})
	{
		const container = dom.add(parent, `<div class="ra_list"></div>`);

		function createButton(icon, text)
		{
			return `
				<a href="#" class="icon-labeled plain-text-link">
					<span class="icon icon-base ${icon}"></span>
					<span class="icon-labeled__label">${text}</span>
				</a>`;
		}

		// Add elements.
		const toolbar = dom.add(container, `<div></div>`);
		const ul = dom.add(container, `<ul></ul>`);

		// Create toolbar.
		const searchBox = dom.add(toolbar, `<input class="input" type="text" placeholder="Search"></input>`);
		searchBox.addEventListener("input", e => updateList());

		function updateList()
		{
			const filter = searchBox.value.toUpperCase();
			ul.replaceChildren();

			const elements = onGet();
			for (const element of elements)
			{
				// Check if filtered away.
				const name = onName ? onName(element) : element;
				if (!name.toUpperCase().includes(filter))
					continue;

				// Create list entry.
				const li = dom.add(ul, `<li></li>`);
				if (onRemove)
				{
					const deleteButton = dom.add(li, createButton("icon-cross-negative", name));
					deleteButton.addEventListener("click", e =>
					{
						e.preventDefault();
						onRemove(element);
						li.remove();
					});
				}
				else
				{
					dom.add(li, `<div>${name}</div>`);
				}
			}
		}

		if (onAdd)
		{
			const addButton = dom.add(toolbar, createButton("icon-add-attachment", "Add"));
			addButton.addEventListener("click", e =>
			{
				e.preventDefault();
				onAdd(searchBox.value);
				updateList();
			});
		}

		if (onRemove)
		{
			const clearButton = dom.add(toolbar, createButton("icon-trashcan", "Clear"));
			clearButton.addEventListener("click", e =>
			{
				e.preventDefault();
				if (confirm(str.get("clearList")))
				{
					const elements = onGet();
					for (const element of elements)
						onRemove(element);
					updateList();
				}
			});
		}

		if (onImport)
		{
			const importButton = dom.add(toolbar, createButton("icon-up-arrow", "Import"));
			importButton.addEventListener("click", e =>
			{
				e.preventDefault();
				// TODO: Handle import
				updateList();
			});
		}

		if (onExport)
		{
			const exportButton = dom.add(toolbar, createButton("icon-down-arrow", "Export"));
			exportButton.addEventListener("click", e =>
			{
				e.preventDefault();
				// TODO: Handle export
				updateList();
			});
		}

		// Create list.
		updateList();
	};

	css.add(`
	.ra_list
	{
		display: flex;
		flex-direction: column;
		height: 250px;
	}

	.ra_list > div > a
	{
		margin: 0 8px;

		display: inline-flex;
	}

	.ra_list > ul
	{
		flex: 1;
		padding: 2px;
		overflow-y: auto;

		display: flex;
		flex-wrap: wrap;
		align-content: flex-start;
	}

	.ra_list > ul > li
	{
		flex: 50%;
		flex-grow: 0;
		padding: 2px;
	}
	`);
}(window.list ??= {}));

(function (cfg)
{
	const namespace = "RA_SETTINGS:";
	cfg.radarFilter = {};
	let tileStyle = null;

	function load(name, fallback)
	{
		const value = localStorage.getItem(namespace + name);
		return value === "false" ? false : value ? value : fallback;
	}
	function save(name, value)
	{
		localStorage.setItem(namespace + name, value);
	}

	function getRadarFilter()
	{
		return JSON.parse(load("radarFilter", `{}`));
	}

	cfg.measurementSystem = "METRIC";
	cfg.tileDetails = new Set(JSON.parse(load("tileDetails",
		`[ "age", "height", "bodyHair", "bodyType", "relationship", "analPosition" ]`)));

	cfg.getDiscoverBanners = function ()
	{
		return load("discoverBanners", true);
	};
	cfg.getDiscoverFilter = function ()
	{
		return load("discoverFilter", false);
	};
	cfg.getDiscoverGroups = function ()
	{
		return load("discoverGroups", true);
	};
	cfg.getEnhancedFilter = function ()
	{
		return load("enhancedFilter", true);
	};
	cfg.getEnhancedImages = function ()
	{
		return load("enhancedImages", true);
	};
	cfg.getEnhancedTiles = function ()
	{
		return load("enhancedTiles", true);
	};
	cfg.getFullHeadlines = function ()
	{
		return load("fullHeadlines", true);
	};
	cfg.getFullMessages = function ()
	{
		return load("fullMessages", true);
	};
	cfg.getHiddenMaxAge = function ()
	{
		return load("hiddenMaxAge", 99);
	};
	cfg.getHiddenMinAge = function ()
	{
		return load("hiddenMinAge", 18);
	};
	cfg.getHiddenUsers = function ()
	{
		return new Set(JSON.parse(load("hiddenUsers", `[]`)));
	};
	cfg.getHideActivities = function ()
	{
		return load("hideActivities", true);
	};
	cfg.getHideContacts = function ()
	{
		return load("hideContacts", false);
	};
	cfg.getHideFriends = function ()
	{
		return load("hideFriends", true);
	};
	cfg.getHideLikes = function ()
	{
		return load("hideLikes", true);
	};
	cfg.getHideMessages = function ()
	{
		return load("hideMessages", false);
	};
	cfg.getHideVisits = function ()
	{
		return load("hideVisits", true);
	};
	cfg.getLocationFuzz = function ()
	{
		return load("locationFuzz", false);
	};
	cfg.getSavedRadarFilter = function (id)
	{
		return cfg.getSavedRadarFilters()[id] ?? getRadarFilter();
	};
	cfg.getSavedRadarFilters = function ()
	{
		return JSON.parse(load("savedRadarFilters", "{}"));
	};
	cfg.getSearchFilter = function ()
	{
		return load("searchFilter", false);
	};
	cfg.getSendEnter = function ()
	{
		return load("sendEnter", true);
	};
	cfg.getSystemMessages = function ()
	{
		return load("systemMessages", true);
	};
	cfg.getTileCount = function ()
	{
		return parseInt(load("tileCount", 0));
	};
	cfg.getTypingNotifications = function ()
	{
		return load("typingNotifications", true);
	};
	cfg.getUnlockPausedProfile = function ()
	{
		return load("unlockPausedProfile", false);
	};
	cfg.setDiscoverBanners = function (value)
	{
		save("discoverBanners", value);
	};
	cfg.setDiscoverFilter = function (value)
	{
		save("discoverFilter", value);
	};
	cfg.setDiscoverGroups = function (value)
	{
		save("discoverGroups", value);
	};
	cfg.setEnhancedFilter = function (value)
	{
		save("enhancedFilter", value);
	};
	cfg.setEnhancedImages = function (value)
	{
		save("enhancedImages", value);
	};
	cfg.setEnhancedTiles = function (value)
	{
		save("enhancedTiles", value);
	};
	cfg.setFullHeadlines = function (value)
	{
		css.setProp("--tile-headline-white-space", value ? "unset" : "nowrap");
		save("fullHeadlines", value);
	};
	cfg.setFullMessages = function (value)
	{
		css.setProp("--message-line-clamp", value ? "unset" : "2");
		save("fullMessages", value);
	};
	cfg.setHiddenMaxAge = function (value)
	{
		save("hiddenMaxAge", value);
	};
	cfg.setHiddenMinAge = function (value)
	{
		save("hiddenMinAge", value);
	};
	cfg.setHideActivities = function (value)
	{
		save("hideActivities", value);
	};
	cfg.setHideContacts = function (value)
	{
		save("hideContacts", value);
	};
	cfg.setHideFriends = function (value)
	{
		save("hideFriends", value);
	};
	cfg.setHideLikes = function (value)
	{
		save("hideLikes", value);
	};
	cfg.setHideMessages = function (value)
	{
		save("hideMessages", value);
	};
	cfg.setHideVisits = function (value)
	{
		save("hideVisits", value);
	};
	cfg.setLocationFuzz = function (value)
	{
		save("locationFuzz", value);
	};
	cfg.setRadarFilter = function ()
	{
		save("radarFilter", JSON.stringify(cfg.radarFilter));
	};
	cfg.setSavedRadarFilter = function (id, value = null)
	{
		const filters = JSON.parse(load("savedRadarFilters", "{}"));
		if (value)
			filters[id] = value;
		else
			delete filters[id];
		save("savedRadarFilters", JSON.stringify(filters));
	};
	cfg.setSearchFilter = function (value)
	{
		save("searchFilter", value);
	};
	cfg.setSendEnter = function (value)
	{
		save("sendEnter", value);
	};
	cfg.setSystemMessages = function (value)
	{
		css.setProp("--system-message-visibility", value ? "visible" : "collapse");
		save("systemMessages", value);
	};
	cfg.setTileCount = function (value)
	{
		if (value)
		{
			css.setProp("--tile-count", value);
			if (!tileStyle)
			{
				tileStyle = css.add(`
				:root
				{
					--tile-count: 0;
					--tile-size: calc(100% / max(1, var(--tile-count)) - 1px);
				}
				/* discover */
				section.js-main-stage > main main > section > ul
				{
					grid-template-columns: repeat(var(--tile-count), 1fr) !important;
				}
				/* group profiles */
				.grouped-tiles-small .tile
				{
					width: var(--tile-size) !important;
				}
				/* radar desktop */
				.search-results__item
				{
					padding-bottom: var(--tile-size) !important;
					width: var(--tile-size) !important;
				}
				/* radar mobile - starts at 768px where .search-results__item turns inline, requiring to adjust .tile */
				@media not screen and (min-width: 768px)
				{
					.tile:not(.js-strip .tile):not(.tile--small)
					{
						width: var(--tile-size) !important;
					}
				}
				/* visitors */
				#cruise main > ul
				{
					grid-template-columns: repeat(var(--tile-count), 1fr);
				}
				`);
			}
		}
		else
		{
			tileStyle?.remove();
			tileStyle = null;
		}
		save("tileCount", value);
	};
	cfg.setTileDetail = function (key, visible)
	{
		if (visible)
			cfg.tileDetails.add(key);
		else
			cfg.tileDetails.delete(key);
		save("tileDetails", JSON.stringify(Array.from(cfg.tileDetails)));
	};
	cfg.setTypingNotifications = function (value)
	{
		save("typingNotifications", value);
	};
	cfg.setUnlockPausedProfile = function (value)
	{
		save("unlockPausedProfile", value);
	};
	cfg.setUserHidden = function (username, hide)
	{
		let hiddenUsers = cfg.getHiddenUsers();
		if (hide)
			hiddenUsers.add(username);
		else
			hiddenUsers.delete(username);
		save("hiddenUsers", JSON.stringify(Array.from(hiddenUsers)));
	};

	cfg.setFullHeadlines(cfg.getFullHeadlines());
	cfg.setFullMessages(cfg.getFullMessages());
	cfg.setSystemMessages(cfg.getSystemMessages());
	cfg.setTileCount(cfg.getTileCount());
}(window.cfg ??= {}));

(function (romeo)
{
	const apiKey = atob("QVM4YnpHSExBOFk5QlhGNzNpRE51UUJIZUVPMFVLamY=");
	let sessionId;

	romeo.debug = function ()
	{
		return GM_info.script.version === "0.0.0";
	};

	romeo.getImageUrl = function (url, size)
	{
		const base = url.substring(0, url.indexOf("/img/usr/"));
		const file = url.substring(url.lastIndexOf("/") + 1);
		return size
			? `${base}/img/usr/squarish/${size}x${size}/${file}`
			: `${base}/img/usr/${file}`;
	};

	romeo.getUsernameFromHref = function (href)
	{
		let start = href.indexOf("profile/");
		if (start === -1)
			start = href.indexOf("hunq/");
		return href.substring(start).split("/")[1];
	};

	romeo.iterItems = async function* (url, body)
	{
		let cursor;
		do
		{
			const response = JSON.parse(await romeo.sendXhr(url, cursor ? { cursor: cursor } : body));
			cursor = response.cursors?.after;
			for (item of response.items)
				yield item;
		} while (cursor);
	};

	romeo.jsonToParams = function (json)
	{
		const params = [];

		function add(parentName, json)
		{
			if (Array.isArray(json))
			{
				const name = parentName + "[]";
				for (const item of json)
					params.push([name, item]);
			}
			else if (typeof (json) === "object")
			{
				for (const name in json)
					add(parentName + "[" + name + "]", json[name]);
			}
			else
			{
				params.push([parentName, json]);
			}
		}

		for (const name in json)
			add(name, json[name]);

		return params;
	};

	romeo.log = function ()
	{
		if (romeo.debug())
			console.log(...arguments);
	};

	romeo.paramsToJson = function (params)
	{
		const json = {};

		for (const [param, value] of params)
		{
			const array = param.endsWith("[]");
			const names = param.split(/[\[\]]+/);
			let end = names.length;
			if (end > 1)
				--end;

			let parent = json;
			for (let i = 0; i < end; ++i)
			{
				const name = names[i];
				if (i !== end - 1)
					parent = parent[name] ??= {};
				else if (array)
					(parent[name] ||= []).push(value);
				else
					parent[name] = value;
			}
		}

		return json;
	};

	romeo.sendFetch = function (url, body)
	{
		let [method, route] = url.split(" ");
		const options =
		{
			method: method,
			cache: "no-cache",
			credentials: "same-origin",
			headers:
			{
				"x-api-key": apiKey,
				"x-session-id": sessionId,
			},
		};
		if (body)
		{
			if (method === "GET")
			{
				route = encodeUrl(route, romeo.jsonToParams(body));
			}
			else
			{
				options.headers["content-type"] = "application/json";
				options.body = JSON.stringify(body);
			}
		}
		return fetch(route, options);
	};

	romeo.sendXhr = function (url, body)
	{
		let [method, route] = url.split(" ");
		return new Promise((resolve, reject) =>
		{
			const xhr = net.realXhr();
			if (method === "GET" && body)
				route = encodeUrl(route, romeo.jsonToParams(body));
			xhr.open(method, route);

			xhr.onload = () =>
			{
				if (xhr.status >= 200 && xhr.status < 300)
					resolve(xhr.response);
				else
					reject({ status: xhr.status, statusText: xhr.statusText });
			};
			xhr.onerror = () => reject({ status: xhr.status, statusText: xhr.statusText });

			xhr.setRequestHeader("x-api-key", apiKey);
			xhr.setRequestHeader("x-session-id", sessionId);

			if (method !== "GET" && body)
			{
				xhr.setRequestHeader("Content-Type", "application/json");
				xhr.send(JSON.stringify(body));
			}
			else
			{
				xhr.send();
			}
		});
	};

	css.add(`
	:root
	{
		--message-line-clamp: 2;
		--system-message-visibility: visible;
		--tile-headline-white-space: nowrap;
	}

	/* hide system popup messages if enabled */
	.feedback
	{
		visibility: var(--system-message-visibility);
	}

	/* hide PLUS message at bottom of visitor grid */
	main#visitors > section
	{
		display: none;
	}
	`);

	net.on("xhr:load", "GET /api/v4/session", e =>
	{
		// Determine session ID.
		sessionId = e.body.session_id;

		// Apply settings.
		const settings = e.body.bb_settings;
		if (settings)
		{
			// Determine measurement locale.
			measurementSystem = settings.interface?.measurement_system ?? measurementSystem;

			// Determine radar filter, remove deleted ones.
			const radarFilterId = settings.bluebird?.search_filter?.id;
			cfg.radarFilter = cfg.getSavedRadarFilter(radarFilterId);
			for (const savedFilterId of Object.keys(cfg.getSavedRadarFilters()))
				if (savedFilterId && !e.body.data.search_filters.find(x => x.id === savedFilterId))
					cfg.setSavedRadarFilter(savedFilterId);
		}

		// Determine initial Discover filter.
		const filter = e.body.bb_settings?.bluebird?.search_filter
			?? e.body.data?.search_filters;
		if (filter)
		{
			cfg.radarFilter["filter[personal][age][max]"] = filter.personal.age.max;
			cfg.radarFilter["filter[personal][age][min]"] = filter.personal.age.min;
			cfg.radarFilter["filter[personal][height][max]"] = filter.personal.height.max;
			cfg.radarFilter["filter[personal][height][min]"] = filter.personal.height.min;
			cfg.radarFilter["filter[personal][weight][max]"] = filter.personal.weight.max;
			cfg.radarFilter["filter[personal][weight][min]"] = filter.personal.weight.min;
		}

		// Enable client-side PLUS capabilities.
		const caps = e.body.data?.capabilities;
		if (caps)
		{
			caps.can_save_unlimited_searches = true; // enables filter bookmarks
			caps.can_set_plus_radar_style = true; // enables Grid Stats selection
		}

		// Retrieve current user location.
		if (e.body.data?.profile_location)
		{
			romeo.userLat = e.body.data.profile_location.lat;
			romeo.userLon = e.body.data.profile_location.long;
		}
	});
}(window.romeo ??= {}));

(function (menu)
{
	const menuHandlers = {};
	let menuBg, menuUl, menuX, menuY;

	menu.on = function (selector, handler)
	{
		(menuHandlers[selector] ??= []).push(handler);
	};

	menu.item = function (icon, text, onclick)
	{
		return { icon, text, onclick };
	};

	function show(items)
	{
		if (!items)
			return;

		menuBg.style.display = "block";
		menuUl.replaceChildren();
		for (const item of items)
		{
			const li = dom.add(menuUl, `
			<li class="ra_context_li">
				<span class="icon icon-${item.icon}"></span>
				${str.get(item.text)}
			</li>`);
			li.addEventListener("click", e =>
			{
				hide();
				item.onclick();
			});
		}

		menuUl.style.display = "block";
		const maxX = window.innerWidth - menuUl.offsetWidth;
		const maxY = window.innerHeight - menuUl.offsetHeight;
		menuUl.style.left = Math.min(menuX, maxX) + "px";
		menuUl.style.top = Math.min(menuY, maxY) + "px";
	};

	function hide()
	{
		menuBg.style.display = "none";
		menuUl.style.display = "none";
	}

	css.add(`
#ra_context_bg
{
	background: transparent;
	display: none;
	height: 100%;
	position: fixed;
	width: 100%;
	z-index: 100000;
}

#ra_context_ul
{
	background: #232323;
	border-radius: 1.125rem;
	box-shadow: rgba(0, 0, 0, 0.32) 0px 0px 2px, rgba(0, 0, 0, 0.24) 0px 0px 1px, rgba(0, 0, 0, 0.16) 0px 0px 5px;
	display: none;
	font-family: Inter, Helvetica, Arial, "Open Sans", sans-serif;
	font-size: 94%;
	overflow: hidden;
	position: absolute;
	z-index: 100001;
}

.ra_context_li
{
	border-color: transparent;
	border-left: 2px solid transparent;
	border-style: solid;
	border-width: 1px 1px 1px 2px;
	color: #FFF;
	cursor: default;
	padding: 9px 18px 10px 10px;
	transition: background-color 200ms cubic-bezier(0, 0, 0.2, 1);
	white-space: nowrap;
}

.ra_context_li:not(:first-child) {
	border-top: 1px solid rgba(255, 255, 255, 0.16);
}

.ra_context_li .icon
{
	margin: 4px;
}

.ra_context_li:hover
{
	background: #2E2E2E;
}

@media screen and (max-width: 767px)
{
	#ra_context_bg
	{
		background: rgba(0, 0, 0, 0.6);
	}
	#ra_context_ul
	{
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
		bottom: 0;
		left: unset !important;
		position: fixed;
		top: unset !important;
		width: 100%;
	}
	.ra_context_li
	{
		padding: 6px;
	}
	.ra_context_li .icon
	{
		font-size: 1.2rem;
		margin: 8px;
	}
}
`);

	// Create context menu canceler.
	menuBg = dom.add(document.body, "<div id='ra_context_bg'></ul>");
	menuBg.addEventListener("click", e => hide());

	// Create context menu.
	menuUl = dom.add(document.body, "<ul id='ra_context_ul'></ul>");

	// Attach to events.
	addEventListener("contextmenu", e =>
	{
		menuX = e.clientX;
		menuY = e.clientY;

		// Go through hierarchy of clicked elements.
		for (const el of document.elementsFromPoint(menuX, menuY))
		{
			// Stop when hitting a layer.
			if (el.classList.contains("layer")
				|| el.classList.contains("layout")
				|| el.classList.contains("ReactModal__Overlay"))
				break;
			// Invoke first context handler for this element.
			for (const [key, handlers] of Object.entries(menuHandlers))
			{
				if (el.matches(key))
				{
					romeo.log(`opening menu '${key}'`);

					const items = [];
					for (const handler of handlers)
						items.push(...handler(el));
					show(items);

					e.preventDefault();
					return;
				}
			}
		}
	});
}(window.menu ??= {}));

// ---- Previews ----

let previewLayer;

function createPreview(title)
{
	const container = document.querySelector("#spotlight-container");
	previewLayer = dom.add(container, `
		<div class="layer layer--spotlight" style="top:0;z-index:10000;">
			<div id="ra_preview_inner">
				<div class="js-header layout-item">
					<div class="layer-header layer-header--primary">
						<a class="back-button l-tappable js-back marionette" href="#">
							<span class="js-back-icon icon icon-cross icon-regular"></span>
						</a>
						<div class="layer-header__title js-title typo-section-navigation" style="text-align:center">
							<h2>${title}</h2>
						</div>
					</div>
				</div>
			</div>
		</div>`);

	previewLayer.addEventListener("click", e =>
	{
		if (e.target === previewLayer)
			previewLayer.remove();
	});
	previewLayer.querySelector(".js-back").addEventListener("click", e => previewLayer.remove());

	return previewLayer.querySelector("#ra_preview_inner");
}

function initPreviews()
{
	window.addEventListener("popstate", e =>
	{
		// Restore navigating back to preview.
		switch (e.state?.ra_preview)
		{
			case "image":
				showImagePreview(e.state.src, false);
				break;
			case "profile":
				showProfilePreview(e.state.username, false);
				break;
		}
	});
	window.navigation?.addEventListener("navigate", e =>
	{
		// Hide preview on any other navigation.
		previewLayer?.remove();
	});
}

function showImagePreview(src, pushHistory = true)
{
	if (pushHistory)
		history.pushState({ ra_preview: "image", src: src }, "");

	const monthYear = getPicMonthYear(src);

	const content = dom.add(createPreview(str.get("viewFullImage")), `<div id="ra_image_content"></div>`);
	dom.add(content, `<img id="ra_profile_pic" src="${src}"></img><br />${monthYear}`);
}

function showProfilePreview(username, pushHistory = true)
{
	function isEntry(value)
	{
		return value && value !== "NO_ENTRY";
	}

	function addSection(el, key)
	{
		return dom.add(el, `
			<details class="ra_profile_details" open>
				<summary class="ra_profile_summary">${str.get(key)}</summary>
			</details>`);
	}

	function add(section, key, value)
	{
		if (value)
		{
			dom.add(section, `
				<div class="ra_profile_keyvalue">
					<div>${str.get(key)}</div>
					<div>${value}</div>
				</div>`);
		}
	}
	function addAgeRange(section, range)
	{
		if (range)
			add(section, "ageRange", getProfileAgeRange(range));
	}
	function addArrayEnum(section, key, array)
	{
		if (!array)
			return;
		let values = [];
		for (let i = 0; i < array.length; i++)
			if (isEntry(array[i]))
				values.push(str.getEnum(key, array[i]));
		if (values.length)
			add(section, key, values.join(", "));
	}
	function addDistance(section, distance, sensor)
	{
		let text = measurementSystem === "METRIC"
			? `${distance / 1000} km`
			: `${round(distance * M2MI, 1)}mi`;
		if (sensor)
			text += " (GPS)";
		add(section, "distance", text);
	}
	function addEnum(section, key, value)
	{
		if (isEntry(value))
			add(section, key, str.getEnum(key, value));
	}
	function addGender(section, genderOrientation)
	{
		let values = [];
		if (isEntry(genderOrientation?.orientation))
			values.push(str.getEnum("orientation", genderOrientation.orientation));
		if (isEntry(genderOrientation?.gender))
			values.push(str.getEnum("gender", genderOrientation.gender));
		if (values.length)
			add(section, "genderOrientation", values.join(" / "));
	}

	const profile = profileCache[username];
	if (!profile)
		return;
	const personal = profile.personal;
	const sexual = profile.sexual;

	if (pushHistory)
		history.pushState({ ra_preview: "profile", username: username }, "");

	const content = dom.add(createPreview(username), `<div id="ra_profile_content"></div>`);
	const left = dom.add(content, `<div id="ra_profile_left"></div>`);
	const right = dom.add(content, `<div id="ra_profile_right"></div>`);

	dom.add(left, `<div>${escapeHtml(profile.headline ?? "")}</div>`);

	const img = dom.add(left, `<img id="ra_profile_pic"></img>`);
	if (profile.pic)
	{
		img.src = `/img/usr/${profile.pic}.jpg`;
		dom.add(left, "<br />" + getPicMonthYear(profile.pic));
	}
	else
	{
		img.src = "/assets/f8a7712027544ed03920.svg";
	}

	const section = addSection(right, "metadata");
	addEnum(section, "onlineStatus", profile.online_status);
	if (profile.last_login)
		add(section, "lastLogin", formatTime(profile.last_login));
	if (profile.location)
	{
		add(section, "location", `${profile.location.name}, ${profile.location.country}`);
		addDistance(section, profile.location.distance, profile.location.sensor);
	}
	add(section, "profileId", profile.id);

	if (personal)
	{
		const section = addSection(right, "lookingFor");
		addArrayEnum(section, "openTo", personal.looking_for);
		addAgeRange(section, personal.target_age);
		addArrayEnum(section, "gender", personal.gender_orientation?.looking_for_gender);
		addArrayEnum(section, "orientation", personal.gender_orientation?.looking_for_orientation);
		if (!section.querySelectorAll(".ra_profile_keyvalue").length)
			section.remove();
	}

	if (personal)
	{
		const section = addSection(right, "general");
		add(section, "age", personal.age);
		add(section, "height", getProfileHeight(personal.height));
		add(section, "weight", getProfileWeight(personal.weight));
		add(section, "bmi", getProfileBmi(personal.height, personal.weight, true));
		add(section, "bodyType", getProfileEnum("bodyType", personal.body_type));
		add(section, "ethnicity", getProfileEnum("ethnicity", personal.ethnicity));
		addEnum(section, "hairLength", personal.hair_length);
		addEnum(section, "hairColor", personal.hair_color);
		addEnum(section, "beard", personal.beard);
		addEnum(section, "eyeColor", personal.eye_color);
		add(section, "bodyHair", getProfileEnum("bodyHair", personal.body_hair));
		addGender(section, personal?.gender_orientation);
		addEnum(section, "smoker", personal.smoker);
		addEnum(section, "tattoos", personal.tattoo);
		addEnum(section, "piercings", personal.piercing);
		addArrayEnum(section, "languages", personal.spoken_languages);
		add(section, "relationship", getProfileEnum("relationship", personal.relationship));
	}

	if (sexual)
	{
		const section = addSection(right, "sexual");
		add(section, "analPosition", getProfileEnum("analPosition", sexual.anal_position));
		add(section, "dick", getProfileDick(sexual.dick_size, sexual.concision));
		addArrayEnum(section, "fetish", sexual.fetish);
		add(section, "dirty", getProfileEnum("dirty", sexual.dirty_sex));
		addEnum(section, "fisting", sexual.fisting);
		addEnum(section, "sm", sexual.sm);
		add(section, "saferSex", getProfileEnum("saferSex", sexual.safer_sex));
		if (!section.querySelectorAll(".ra_profile_keyvalue").length)
			section.remove();
	}

	if (profile.personal?.profile_text)
	{
		const section = addSection(right, "aboutMe");
		dom.add(section, `<div id="ra_profile_text">${profile.personal.profile_text}</div>`);
	}
}

css.add(`
#ra_preview_inner
{
	background-color: black;
	display: grid;
	grid-template-rows: min-content auto;
	height: 100%;
}

#ra_image_content
{
	overflow-y: scroll;
	padding: 16px;
}

#ra_profile_content
{
	display: grid;
	font-family: Inter, Helvetica, Arial, "Open Sans", sans-serif;
	grid-template-columns: auto 352px;
	overflow-y: scroll;
	word-break: break-word;
}

#ra_profile_left
{
	background: #121212;
	overflow-y: scroll;
	padding: 16px;
}

#ra_profile_right
{
	overflow-y: scroll;
	padding: 16px;
}

.ra_profile_details:not(:first-child)
{
	border-top: 1px solid rgb(46, 46, 46);
	margin-top: 1rem;
}

.ra_profile_summary
{
	padding: 1rem 0;
}

.ra_profile_keyvalue
{
	display: grid;
	gap: 16px;
	grid-template-columns: minmax(0, 0.8fr) minmax(0, 1fr);
}

.ra_profile_keyvalue > :first-child
{
	color: rgba(255, 255, 255, 0.6);
	text-align: right;
}

#ra_profile_text
{
	white-space: pre-line;
}

@media screen and (max-width: 767px)
{
	#ra_profile_content
	{
		grid-template-columns: initial;
		grid-template-rows: auto auto;
	}
	#ra_profile_left
	{
		overflow-y: initial;
	}
	#ra_profile_right
	{
		overflow-y: initial;
	}
	#ra_profile_pic
	{
		width: 100%;
	}
}
`);

// ---- Profiles ----

const profileCache = {};

function cacheProfile(profile)
{
	const cached = profileCache[profile.name];
	return profileCache[profile.name] =
	{
		headline: profile.headline ?? cached?.headline,
		id: profile.id,
		last_login: profile.last_login ?? cached?.last_login,
		location: profile.location ?? cached?.location,
		name: profile.name,
		online_status: profile.online_status ?? cached?.online_status,
		personal: profile.profile?.personal ?? profile.personal ?? cached?.personal,
		pic: profile.preview_pic?.url_token ?? cached?.pic,
		sexual: profile.profile?.sexual ?? profile.sexual ?? cached?.sexual,
	};
}
function filterProfile(profile, hiddenMaxAge, hiddenMinAge, hiddenNames)
{
	// Return whether to display the profile.
	return (!profile.personal || profile.personal.age >= hiddenMinAge && profile.personal.age <= hiddenMaxAge)
		&& !hiddenNames.has(profile.name);
}
function filterItemsAndCacheProfiles(items, profileSelector, filter)
{
	let newItems = [];
	const hiddenMaxAge = cfg.getHiddenMaxAge();
	const hiddenMinAge = cfg.getHiddenMinAge();
	const hiddenNames = cfg.getHiddenUsers();

	for (const item of items ?? [])
	{
		const profile = cacheProfile(profileSelector(item));
		if (!filter || filterProfile(profile, hiddenMaxAge, hiddenMinAge, hiddenNames))
			newItems.push(item);
	}
	return newItems;
}

function getProfileAgeRange(range, short)
{
	if (range)
	{
		const min = range.min ?? "18";
		const max = range.max ?? "99";
		return short
			? `${min}-${max}`
			: str.get("ageRangeValue").replace("$from", min).replace("$to", max);
	}
}
function getProfileBmi(height, weight, withName)
{
	if (height && weight)
	{
		const bmi = weight / Math.pow(height / 100, 2);
		let result = `${round(bmi, 1).toFixed(1)}`;

		if (withName)
		{
			for (const [max, key] of Object.entries({
				16: "bmiSevereThin",
				17: "bmiModerateThin",
				18.5: "bmiMildThin",
				25: "bmiNormal",
				30: "bmiPreObese",
				35: "bmiObese1",
				40: "bmiObese2",
				99: "bmiObese3",
			}))
			{
				if (bmi < max)
					return result + ` / ${str.get(key)}`;
			}
		}
		return result;
	}
}
function getProfileDick(size, concision)
{
	let values = [];
	if (size && size !== "NO_ENTRY")
		values.push(str.getEnum("dick", size));
	if (concision && concision !== "NO_ENTRY")
		values.push(str.getEnum("concision", concision));
	if (values.length)
		return values.join(" - ");
}
function getProfileEnum(key, value)
{
	if (value && value !== "NO_ENTRY")
		return str.getEnum(key, value);
}
function getProfileHeight(height)
{
	if (height)
	{
		return measurementSystem === "METRIC"
			? `${height}cm`
			: `${round(height * CM2FT, 2)} ft`;
	}
}
function getProfileWeight(weight)
{
	if (weight)
	{
		return measurementSystem === "METRIC"
			? `${weight}kg`
			: `${round(weight * KG2LBS)}lbs`;
	}
}

function xhrHandleProfiles(e)
{
	e.body.items = filterItemsAndCacheProfiles(e.body.items, x => x, true);
	e.body.items_limited = e.body.items_total; // Remove PLUS ad tile.

	// Show every user as a large tile.
	if (cfg.getEnhancedTiles())
		for (const item of e.body.items ?? [])
			if (item.display)
				item.display.large_tile = true;
}
function xhrHandleVisits(e)
{
	e.body.items = filterItemsAndCacheProfiles(e.body.items, x => x, cfg.getHideVisits());
	e.body.items_limited = e.body.items_total; // Restore PLUS-visible visitors.
}

net.on("xhr:load", "GET /api/v4/contacts", e =>
{
	if (e.body.cursors)
		e.body.items = filterItemsAndCacheProfiles(e.body.items, x => x.profile, cfg.getHideContacts());
});

net.on("xhr:load", "GET /api/v4/messages/conversations", e =>
{
	e.body.items = filterItemsAndCacheProfiles(e.body.items, x => x.chat_partner, cfg.getHideMessages());
});

net.on("xhr:load", "GET /api/+/notifications/activity-stream", e =>
{
	e.body = filterItemsAndCacheProfiles(e.body, x => x.partner, cfg.getHideActivities());
});

net.on("fetch:recv", "GET /api/v4/account", e => e.body.is_activated ||= cfg.getUnlockPausedProfile());

net.on("fetch:recv", "GET /api/v4/profiles", e => xhrHandleProfiles(e));
net.on("fetch:recv", "GET /api/v4/profiles/popular", e => xhrHandleProfiles(e));
net.on("xhr:load", "GET /api/v4/groups/*/profiles", e => xhrHandleProfiles(e));
net.on("xhr:load", "GET /api/v4/hunqz/profiles", e => xhrHandleProfiles(e));
net.on("xhr:load", "GET /api/v4/profiles", e => xhrHandleProfiles(e));
net.on("xhr:load", "GET /api/v4/profiles/list", e => xhrHandleProfiles(e));
net.on("xhr:load", "GET /api/v4/profiles/popular", e => xhrHandleProfiles(e));

net.on("fetch:recv", "GET /api/v4/visitors", e => xhrHandleVisits(e));
net.on("fetch:recv", "GET /api/v4/visits", e => xhrHandleVisits(e));
net.on("fetch:recv", "GET /api/v4/reactions/cruise/likes", e =>
{
	e.body.items = filterItemsAndCacheProfiles(e.body.items, x => x.profile, cfg.getHideLikes());
});

net.on("xhr:load", "GET /api/v4/messages/*", e => cacheProfile(e.body));
net.on("xhr:load", "GET /api/v4/profiles/*", e => cacheProfile(e.body));
net.on("xhr:load", "GET /api/v4/profiles/*/full", e => cacheProfile(e.body));
net.on("fetch:recv", "GET /api/v4/profiles/*/linked", e =>
{
	e.body.items = filterItemsAndCacheProfiles(e.body.items, x => x, cfg.getHideFriends());
});
net.on("fetch:load", "GET /api/v4/reactions/pictures/basic", e =>
{
	e.body.items = filterItemsAndCacheProfiles(e.body.items, x => x.user_id, cfg.getHideLikes());
});

// ---- Filter ----

function addRadarFilter(filter, key, value)
{
	if (!isMultiRadarFilter(key))
		filter[key] = value;
	else if (key in filter)
		filter[key].push(value);
	else
		filter[key] = [value];
}

function hasRadarFilter(filter, key, value)
{
	return key in filter
		&& (value === undefined || (isMultiRadarFilter(key)
			? filter[key].includes(value)
			: filter[key] === value));
}

function isMultiRadarFilter(key)
{
	return key.endsWith("[]");
}

function removeRadarFilter(filter, key, value)
{
	if (!hasRadarFilter(filter, key, value))
		return;
	if (isMultiRadarFilter(key))
	{
		filter[key] = filter[key].filter(x => x !== value);
		if (!filter[key].length)
			delete filter[key];
	}
	else
	{
		delete filter[key];
	}
}

function refreshFilter()
{
	// Save filter.
	cfg.setRadarFilter();
	// Reset filter title, enable filter reset button.
	document.querySelector(`.js-filter-header p[class^="ResponsiveBodyText-sc-"]`).innerHTML = str.get("filters");
	document.querySelector(".js-clear-all").classList.remove("is-disabled");
	// Update results.
	document.querySelector(`section.js-main-stage div.js-navigation a[aria-current="page"]`).click();
}

function packRadarFilter(params)
{
	let filter = {};
	for (const [key, value] of params)
		addRadarFilter(filter, key, value);
	return filter;
}

function unpackRadarFilter(filter)
{
	let params = [];
	for (const key in filter)
	{
		if (isMultiRadarFilter(key))
		{
			for (const value of filter[key])
				params.push([key, value]);
		}
		else
		{
			params.push([key, filter[key]]);
		}
	}
	return params;
}

function replaceFilterContainer(el)
{
	if (!cfg.getEnhancedFilter())
		return;

	// Remove plus color from bookmark action.
	const save = el.querySelector(".js-filter-actions .js-save");
	save?.classList.remove("is-plus");

	// Remove all filters on reset.
	const clearAll = el.querySelector(".js-filter-actions .js-clear-all");
	if (Object.keys(cfg.radarFilter).length)
		clearAll.classList.remove("is-disabled");
	clearAll.addEventListener("click", e =>
	{
		cfg.radarFilter = {};
		cfg.setRadarFilter();
		// Filter panel is recreated by default handler, recreate selections.
		setTimeout(() => replaceFilterContainer(el));
	});

	// Clear any remaining extended filters.
	filter = el.querySelector(".filter");
	for (const tags of filter.querySelectorAll(".filter__params-tags.js-tags-list"))
		tags.remove();

	// Remove PLUS-Filter ad if no original filters are selected.
	if (filter.querySelector(".js-quick-filter .js-add-params-button.plain-text-link"))
		filter.querySelector(".js-quick-filter .filter__group-more-options").remove();

	// Add custom filters.

	function addSection(text)
	{
		return dom.add(filter, `
			<div class="filter__params-tags js-tags-list">
				<h3 class="typo mb-">${str.get(text)}</h3>
			</div>`);
	}

	function addSectionList(text)
	{
		const section = addSection(text);
		return dom.add(section, `<ul class="js-list tags-list"></ul>`);
	}

	function addSectionListMulti(text, prefix, filterKey, filterValues, hasNoEntry = true)
	{
		const section = addSectionList(text);
		for (const filterValue of filterValues)
			addListTagFilter(section, `${prefix}_${filterValue}`, filterKey, filterValue);
		if (hasNoEntry)
			addListTagFilter(section, "noEntry", filterKey, "NO_ENTRY");
		return section;
	};

	function addListTag(ul, text, selected, change)
	{
		const li = dom.add(ul, `
			<li class="tags-list__item">
				<a class="js-tag ui-tag ui-tag--removable txt-truncate">
					<span class="ui-tag__label">${str.get(text)}</span>
				</a>
			</li>`);
		const a = li.querySelector("a");
		if (selected)
			a.classList.add("ui-tag--selected");
		li.addEventListener("click", e =>
		{
			e.preventDefault();
			if (a.classList.contains("ui-tag--selected"))
			{
				change(false);
				a.classList.remove("ui-tag--selected");
			}
			else
			{
				change(true);
				a.classList.add("ui-tag--selected");
			}
		});
	}

	function addListTagFilter(ul, text, filterKey, filterValue)
	{
		let selected = hasRadarFilter(cfg.radarFilter, filterKey, filterValue);
		return addListTag(ul, text, selected, checked =>
		{
			if (checked)
				addRadarFilter(cfg.radarFilter, filterKey, filterValue);
			else
				removeRadarFilter(cfg.radarFilter, filterKey, filterValue);
			refreshFilter();
		});
	}

	function addInput(ul)
	{
		return dom.add(ul, `
			<div class="filter__group">
				<div class="js-fulltext-input filter__group--fulltext">
					<div class="Container--uQSLs layout layout--v-center">
						<div class="layout-item layout-item--consume">
							<input class="js-input Input--EicBC input" autocorrect="off" autocapitalize="off" spellcheck="false">
						</div>
					</div>
				</div>
			</div>`).querySelector("input");
	}

	addSectionListMulti("lookingForOther", "openTo", "filter[personal][looking_for][]",
		["SEXDATES", "FRIENDSHIP", "RELATIONSHIP"]);

	addSectionListMulti("bodyType", "bodyType", "filter[personal][body_type][]",
		["SLIM", "AVERAGE", "ATHLETIC", "MUSCULAR", "BELLY", "STOCKY"]);
	addSectionListMulti("ethnicity", "ethnicity", "filter[personal][ethnicity][]",
		["CAUCASIAN", "ASIAN", "LATIN", "MEDITERRANEAN", "BLACK", "MIXED", "ARAB", "INDIAN"]);
	addSectionListMulti("hairLength", "hairLength", "filter[personal][hair_length][]",
		["SHAVED", "SHORT", "AVERAGE", "LONG", "PUNK"]);
	addSectionListMulti("hairColor", "hairColor", "filter[personal][hair_color][]",
		["BLOND", "LIGHT_BROWN", "BROWN", "BLACK", "GREY", "OTHER", "RED"]);
	addSectionListMulti("beard", "beard", "filter[personal][beard][]",
		["DESIGNER_STUBBLE", "MOUSTACHE", "GOATEE", "FULL_BEARD", "NO_BEARD"]);
	addSectionListMulti("eyeColor", "eyeColor", "filter[personal][eye_color][]",
		["BLUE", "BROWN", "GREY", "GREEN", "OTHER"]);
	addSectionListMulti("bodyHair", "bodyHair", "filter[personal][body_hair][]",
		["SMOOTH", "SHAVED", "LITTLE", "AVERAGE", "VERY_HAIRY"]);
	addSectionListMulti("gender", "gender", "filter[personal][gender_orientation][gender][]",
		["MAN", "TRANS_MAN", "TRANS_WOMAN", "NON_BINARY", "OTHER"]);
	addSectionListMulti("orientation", "orientation", "filter[personal][gender_orientation][orientation][]",
		["GAY", "BISEXUAL", "QUEER", "STRAIGHT", "OTHER"]);
	addSectionListMulti("smoker", "smoker", "filter[personal][smoker][]",
		["NO", "SOCIALLY", "YES"]);
	addSectionListMulti("tattoos", "tattoos", "filter[personal][tattoo][]",
		["A_FEW", "A_LOT", "NO"]);
	addSectionListMulti("piercings", "piercings", "filter[personal][piercing][]",
		["A_FEW", "A_LOT", "NO"]);
	addSectionListMulti("relationship", "relationship", "filter[personal][relationship][]",
		["SINGLE", "PARTNER", "OPEN", "MARRIED"]);

	addSectionListMulti("analPosition", "analPosition", "filter[sexual][anal_position][]",
		["TOP_ONLY", "MORE_TOP", "VERSATILE", "MORE_BOTTOM", "BOTTOM_ONLY", "NO"]);
	addSectionListMulti("dick", "dick", "filter[sexual][dick_size][]",
		["S", "M", "L", "XL", "XXL"]);
	addSectionListMulti("concision", "concision", "filter[sexual][concision][]",
		["CUT", "UNCUT"]);
	addSectionListMulti("fetish", "fetish", "filter[sexual][fetish][]",
		["LEATHER", "SPORTS", "SKATER", "RUBBER", "UNDERWEAR", "SKINS", "BOOTS", "LYCRA", "UNIFORM", "FORMAL",
			"TECHNO", "SNEAKERS", "JEANS", "DRAG", "WORKER", "CROSSDRESSING"]);
	addSectionListMulti("dirty", "dirty", "filter[sexual][dirty_sex][]",
		["YES", "NO", "WS_ONLY"]);
	addSectionListMulti("fisting", "fisting", "filter[sexual][fisting][]",
		["ACTIVE", "ACTIVE_PASSIVE", "PASSIVE", "NO"]);
	addSectionListMulti("sm", "sm", "filter[sexual][sm][]",
		["YES", "SOFT", "NO"]);
	addSectionListMulti("saferSex", "saferSex", "filter[sexual][safer_sex][]",
		["ALWAYS", "NEEDS_DISCUSSION", "CONDOM", "PREP", "PREP_AND_CONDOM", "TASP"]);

	addSectionListMulti("interests", "interests", "filter[hobby][interests][]",
		["ART", "BOARDGAME", "CAR", "COLLECT", "COMPUTER", "COOK", "DANCE", "FILM", "FOTO", "GAME", "LITERATURE",
			"MODELING", "MOTORBIKE", "MUSIC", "NATURE", "POLITICS", "TV"], false);

	const section = addSectionList("other");

	const coordInput = addInput(section);
	coordInput.type = "text";
	coordInput.placeholder = str.get("latLong");
	if ("filter[location][lat]" in cfg.radarFilter && "filter[location][long]" in cfg.radarFilter)
		coordInput.value = `${cfg.radarFilter["filter[location][lat]"]}, ${cfg.radarFilter["filter[location][long]"]}`;
	coordInput.addEventListener("change", e =>
	{
		removeRadarFilter(cfg.radarFilter, "filter[location][lat]");
		removeRadarFilter(cfg.radarFilter, "filter[location][long]");
		const sep = e.target.value.indexOf(", ");
		if (sep !== -1)
		{
			const lat = parseFloat(e.target.value);
			const long = parseFloat(e.target.value.substring(sep + 2));
			if (!isNaN(lat) && !isNaN(long))
			{
				addRadarFilter(cfg.radarFilter, "filter[location][lat]", lat.toString());
				addRadarFilter(cfg.radarFilter, "filter[location][long]", long.toString());
			}
		}
		refreshFilter();
	});

	const radiusInput = addInput(section);
	radiusInput.type = "text";
	radiusInput.placeholder = str.get("customRadius");
	if ("filter[location][radius]" in cfg.radarFilter)
	{
		const radius = cfg.radarFilter["filter[location][radius]"];
		radiusInput.value = measurementSystem === "METRIC"
			? radius / 1000
			: round(radius * M2MI, 1);
	}
	radiusInput.addEventListener("change", e =>
	{
		removeRadarFilter(cfg.radarFilter, "filter[location][radius]");
		if (parseInt(e.target.value))
		{
			const radius = measurementSystem === "METRIC"
				? e.target.value * 1000
				: e.target.value / M2MI;
			addRadarFilter(cfg.radarFilter, "filter[location][radius]", radius);
		}
		refreshFilter();
	});

	addListTagFilter(section, "bedAndBreakfast", "filter[bed_and_breakfast_filter]", "ONLY");
	addListTagFilter(section, "travelersOnly", "filter[travellers_filter]", "TRAVELLERS_ONLY");
	addListTagFilter(section, "speakingMyLanguage", "filter[personal][speaks_my_languages]", "true");
}

function xhrApplyFilter(url, discover)
{
	let [path, params] = decodeUrl(url);
	if (params.get("cursor"))
		return url;
	params.set("length", 1000);

	let filter = packRadarFilter(params);

	if (discover)
	{
		// Discover
		if (!cfg.getDiscoverFilter())
			return url;
	}
	else if ("filter[username]" in filter)
	{
		// Search (plain text only, #-prefixed text generates fulltext search).
		if (!cfg.getSearchFilter())
			return url;
	}
	else
	{
		// Radar

		// Store Radar-only configurable parameters for Discover page.
		function saveFilter(key)
		{
			if (filter[key])
				cfg.radarFilter[key] = filter[key];
		}
		saveFilter("filter[personal][age][max]");
		saveFilter("filter[personal][age][min]");
		saveFilter("filter[personal][height][max]");
		saveFilter("filter[personal][height][min]");
		saveFilter("filter[personal][weight][max]");
		saveFilter("filter[personal][weight][min]");

		if (!cfg.getEnhancedFilter())
			return url;
	}

	// Combine with custom parameters.
	filter = { ...filter, ...cfg.radarFilter };
	params = unpackRadarFilter(filter);
	return encodeUrl(path, params);
}

css.add(`
/* enhanced radar filter */
.js-quick-filter
{
	overflow-y: scroll;
}

/* restore bookmark icon color */
.ui-navbar__button--bookmarks .icon.icon-bookmark-outlined
{
	color: #00bdff !important;
}

/* fix height of filter on mobile */
.sidebar .filter-container
{
	height: unset !important;
}
`);

dom.on(`.js-quick-filter`, el =>
{
	replaceFilterContainer(el.parentNode);
});

net.on("fetch:send", "GET /api/v4/profiles", e => e.url = xhrApplyFilter(e.url, true));
net.on("xhr:open", "GET /api/v4/groups/*/profiles", e => e.url = xhrApplyFilter(e.url));
net.on("xhr:open", "GET /api/v4/hunqz/profiles", e => e.url = xhrApplyFilter(e.url));
net.on("xhr:open", "GET /api/v4/profiles", e => e.url = xhrApplyFilter(e.url));
net.on("xhr:open", "GET /api/v4/profiles/popular", e => e.url = xhrApplyFilter(e.url));

net.on("xhr:send", "PUT /api/v4/settings/interface/bluebird", e =>
{
	// Changed filter.
	const id = e.body.search_filter.id;
	if (id)
		cfg.radarFilter = cfg.getSavedRadarFilter(id);

	const quickFilter = document.querySelector(".js-quick-filter")?.parentNode;
	if (quickFilter)
		replaceFilterContainer(quickFilter);
});
net.on("xhr:load", "DELETE /api/v4/search/filters/*", e =>
{
	// Deleted filter.
	const id = e.args[0];
	cfg.setSavedRadarFilter(id);
});
net.on("xhr:load", "POST /api/v4/search/filters", e =>
{
	// Created filter.
	const id = e.body.id;
	cfg.setSavedRadarFilter(id, cfg.radarFilter);
});

// ---- Tiles ----

const selTileDiscover = `section.js-content main > section > ul > li > a[href^="/profile/"]`; // li
const selTileGroupProfiles = `div.grouped-tiles-small > div.refreshable > div.tile > div.reactView > a[href^="/profile/"]`; // div.tile
const selTileRadarSmall = `div.js-search-results div.tile > div.reactView > a[href^="/profile/"]`; // div.tile (query first)
const selTileRadarLarge = `div.js-search-results div.tile--plus > div.reactView > a[href^="/profile/"]`; // div.search-results__item
const selTileRadarImage = `div.js-search-results div.tile > div.reactView > div.SMALL`; // div.tile
const selTileVisitors = `main#visitors a[href^="/profile/"]`; // li
const selTileVisited = `main#visited-grid a[href^="/profile/"]`; // li
const selTileLikes = `main#likers-list a[href^="/profile/"]`; // li
const selTileFriends = `section.js-profile-stats li > a[href^="/profile/"]`; // li
const selTileFriendsList = `main#friends-list li > a[href^="/profile/"]`; // li
const selTilePicLikes = `main#liked-by-list a[href^="/profile/"]`; // li
const selTileSearch = `div.js-results a[href^="/profile/"]`; // div.tile
const selTileActivity = `div.js-as-content div.tile a[href^="/profile/"]`; // div.listitem

function createTileMenu(el, username, removeOnHide, removeOnBlock)
{
	return [
		menu.item("search", "viewProfile", () => showProfilePreview(username)),
		menu.item("hide-visit", "hideUser", () =>
		{
			cfg.setUserHidden(username, true);
			if (removeOnHide)
				el.style.display = "none";
		}),
		menu.item("illegal", "blockUser", () =>
		{
			const profileId = profileCache[username].id;
			if (!profileId)
				return false;

			romeo.sendFetch("POST /api/v4/profiles/blocked", { profile_id: profileId, note: "" });
			if (removeOnBlock)
				el.style.display = "none";
		}),
	];
}

css.add(`
/* fix jumping fade in mobile visitors/visits during load */
div.BIG::before, div.SMALL::before
{
	inset: 60% 0px 0px !important;
}

/* tile description truncation */
.tile p[class^="SpecialText-"]
{
	white-space: var(--tile-headline-white-space);
}

/* 2 friend list tile columns */
section.js-profile-stats ul, main#friends-list ul
{
	grid-template-columns: 1fr 1fr;
}

.ra_tile_headline
{
	color: rgb(255, 255, 255);
	font-family: Inter, Helvetica, Arial, "Open Sans", sans-serif;
	font-size: 0.8125rem;
	font-weight: 400;
	line-height: 1.23077;
	overflow: hidden;
	text-overflow: ellipsis;
	text-shadow: rgba(0, 0, 0, 0.32) 0px 1px 1px, rgba(0, 0, 0, 0.42) 1px 1px 1px;
	white-space: var(--tile-headline-white-space);
}

.ra_tile_tag_row
{
	display: flex;
	flex-wrap: wrap;
	gap: 0.25rem;
	margin-top: 0.25rem;
}

.ra_tile_tag
{
	background-color: rgb(46, 46, 46);
	border-radius: 2px;
	box-shadow: rgba(0, 0, 0, 0.32) 0px 0px 1px, rgba(0, 0, 0, 0.24) 0px 0px 1px, rgba(0, 0, 0, 0.16) 0px 0px 3px;
	color: rgba(255, 255, 255, 0.87);
	font-family: Inter, Helvetica, Arial, "Open Sans", sans-serif;
	font-size: 0.8125rem;
	font-weight: 400;
	line-height: 1.23077;
	padding: 0px 2px;
}

.ra_tile_tag_new
{
	color: rgb(0, 209, 0);
}
`);

dom.on([selTileDiscover, selTileGroupProfiles, selTileRadarSmall, selTileVisitors, selTileVisited, selTileFriends,
	selTileFriendsList, selTilePicLikes, selTileSearch].join(","), a =>
{
	// Find profile cached for this tile.
	const username = romeo.getUsernameFromHref(a.href);
	const profile = profileCache[username];
	if (!profile)
		return;

	// Add custom tags and headline.
	let tagRow;
	let tagClasses;
	let tagNewClasses;
	function addTag(text, isNew)
	{
		if (text)
			dom.add(tagRow, `<span class="${isNew ? tagNewClasses : tagClasses}">${text}</span>`);
	}

	const inner = a.firstChild;
	if (inner.classList.contains("BIG"))
	{
		// Find existing tag elements and classes.
		const lastTag = a.querySelector(`div:last-child > span[class^="SpecialText-"]:last-child`);
		if (!lastTag)
			return;
		tagRow = lastTag.parentNode;
		tagClasses = lastTag.classList;
		tagNewClasses = tagRow.firstChild.classList;
		// Clear existing tags.
		tagRow.replaceChildren();
	}
	else
	{
		const container = inner.lastChild;
		// Create headline.
		if (profile.headline)
			dom.add(container, `<p class="ra_tile_headline">${profile.headline}</p>`);
		// Create tag row.
		tagRow = dom.add(container, `<div class="ra_tile_tag_row">`);
		tagClasses = "ra_tile_tag";
		tagNewClasses = tagClasses + " ra_tile_tag_new";
	}

	// Add tags.
	if (tagNewClasses.value !== tagClasses.value)
		addTag(str.get("new"), true);
	const personal = profile.personal;
	if (personal)
	{
		if (cfg.tileDetails.has("age")) addTag(personal.age);
		if (cfg.tileDetails.has("bodyHair")) addTag(getProfileEnum("bodyHair", personal.body_hair));
		if (cfg.tileDetails.has("height")) addTag(getProfileHeight(personal.height));
		if (cfg.tileDetails.has("weight")) addTag(getProfileWeight(personal.weight));
		if (cfg.tileDetails.has("bmi")) addTag(getProfileBmi(personal.height, personal.weight));
		if (cfg.tileDetails.has("ageRange")) addTag(getProfileAgeRange(personal.target_age, true));
		if (cfg.tileDetails.has("bodyType")) addTag(getProfileEnum("bodyType", personal.body_type));
		if (cfg.tileDetails.has("ethnicity")) addTag(getProfileEnum("ethnicity", personal.ethnicity));
		if (cfg.tileDetails.has("relationship")) addTag(getProfileEnum("relationship", personal.relationship));
		if (cfg.tileDetails.has("smoker"))
		{
			if (personal.smoker === "YES")
				addTag(str.get("smoker"));
			else if (personal.smoker === "SOCIALLY")
				addTag(str.get("socialSmoker"));
		}
		if (cfg.tileDetails.has("openTo") && personal.looking_for && personal.looking_for[0] !== "NO_ENTRY")
		{
			let text = "";
			for (let openTo of personal.looking_for)
				text += str.getEnum("openTo", openTo)[0];
			addTag(text);
		}
	}
	const sexual = profile.sexual;
	if (sexual)
	{
		if (cfg.tileDetails.has("analPosition")) addTag(getProfileEnum("analPosition", sexual.anal_position));
		if (cfg.tileDetails.has("dick")) addTag(getProfileDick(sexual.dick_size, sexual.concision));
		if (cfg.tileDetails.has("saferSex")) addTag(getProfileEnum("saferSex", sexual.safer_sex));
		if (cfg.tileDetails.has("dirty")) addTag(getProfileEnum("dirty", sexual.dirty_sex));
		if (cfg.tileDetails.has("sm")) addTag(getProfileEnum("sm", sexual.sm));
		if (cfg.tileDetails.has("fisting")) addTag(getProfileEnum("fisting", sexual.fisting));
	}
});

dom.on(`img[src^="/img/usr/squarish/"][src$=".jpg"]`, el =>
{
	if (cfg.getEnhancedImages())
	{
		const url = romeo.getImageUrl(el.src, 848);
		el.src = url;
	}
});

dom.on(`*[style^='background-image: url("/img/usr/squarish/'][style$='.jpg");']`, el =>
{
	if (cfg.getEnhancedImages())
	{
		const url = romeo.getImageUrl(css.getStyleImageUrl(el.style.backgroundImage), 848);
		el.style.backgroundImage = `url("${url}")`;;
	}
});

menu.on(selTileDiscover, a =>
{
	const el = a.closest("li");
	const username = romeo.getUsernameFromHref(a.href);
	return createTileMenu(el, username, true, true);
});

menu.on(selTileRadarLarge, a =>
{
	const el = a.closest("div.tile--plus").parentNode;
	const username = romeo.getUsernameFromHref(a.href);
	return createTileMenu(el, username, true, true);
});

menu.on([selTileGroupProfiles, selTileRadarSmall].join(","), a =>
{
	const el = a.closest("div.tile");
	const username = romeo.getUsernameFromHref(a.href);
	return createTileMenu(el, username, true, true);
});

menu.on(selTileRadarImage, el =>
{
	const imageUrl = romeo.getImageUrl(css.getStyleImageUrl(el.style.backgroundImage));
	return [
		menu.item("search", "viewFullImage", () => showImagePreview(imageUrl)),
	];
});

menu.on([selTileVisitors, selTileVisited].join(","), a =>
{
	const el = a.closest("li");
	const username = romeo.getUsernameFromHref(a.href);
	return createTileMenu(el, username, cfg.getHideVisits(), true);
});

menu.on([selTileFriends, selTileFriendsList].join(","), a =>
{
	const el = a.closest("li");
	const username = romeo.getUsernameFromHref(a.href);
	return createTileMenu(el, username, cfg.getHideFriends(), false);
});

menu.on([selTileLikes, selTilePicLikes].join(","), a =>
{
	const el = a.closest("li");
	const username = romeo.getUsernameFromHref(a.href);
	return createTileMenu(el, username, cfg.getHideLikes(), true);
});

menu.on(selTileSearch, a =>
{
	const el = a.closest("div.tile");
	const username = romeo.getUsernameFromHref(a.href);
	return createTileMenu(el, username, true, true);
});

menu.on(selTileActivity, a =>
{
	const el = a.closest("div.listitem");
	const username = romeo.getUsernameFromHref(a.href);
	return createTileMenu(el, username, cfg.getHideActivities(), true);
});

// ---- Messaging ----

css.add(`
/* message list truncation */
#messenger div[class^="TruncateBlock__Content-sc-"]
{
	-webkit-line-clamp: var(--message-line-clamp);
}
`);

dom.on(`.js-send-region.layout-item > div`, el =>
{
	el.addEventListener("keydown", e =>
	{
		// Prevent site event handler from sending message or typing notifications.
		const enter = e.key === "Enter";
		const send = enter && (cfg.getSendEnter() || e.ctrlKey);
		const allow = send || cfg.getTypingNotifications() && !enter;
		if (!allow)
			e.stopPropagation();
	}, true);
});

menu.on(".js-chat .reactView", el =>
{
	// messages > message
	const a = el.querySelector(`a[href^="/profile/"]`);
	const username = romeo.getUsernameFromHref(a.href);
	return [
		...createTileMenu(el, username, cfg.getHideMessages(), false),
		menu.item("trashcan", "deleteUnread", async () =>
		{
			const partnerId = profileCache[username].id;

			// Retrieve and delete all unread messages.
			const deletes = [];
			let firstRead;
			for await (const item of romeo.iterItems("GET /api/v4/messages", { filter: { partner_id: partnerId } }))
			{
				if (item.folder === "RECEIVED" && item.unread)
				{
					deletes.push(romeo.sendXhr("DELETE /api/v4/messages/" + item.id));
				}
				else
				{
					firstRead = item;
					break;
				}
			}
			await Promise.allSettled(deletes);

			// Show last read message or remove chat if none.
			if (firstRead)
			{
				const textEl = el.querySelector(`p[class^="BaseText-sc-"]`);
				textEl.style.color = "rgba(255, 255, 255, 0.6)";
				textEl.innerHTML = firstRead.text;
				const newEl = el.querySelector(`a > div p[class^="SpecialText-sc-"]`);
				newEl?.parentNode.remove();
			}
			else
			{
				el.remove();
			}
		})
	];
});

menu.on(".js-chat .reactView img", el =>
{
	// messages > message > sent image
	return [
		menu.item("search", "viewFullImage", () => showImagePreview(romeo.getImageUrl(el.src))),
	];
});

menu.on(".js-contacts .reactView", el =>
{
	// contacts > contact
	const a = el.querySelector(`a[href^="/profile/"]`);
	const username = romeo.getUsernameFromHref(a.href);
	return createTileMenu(el, username, cfg.getHideContacts(), false);
});

// ---- Albums ----

let changeProfilePic = false;
const picMonthIdStart = [
	0x00000000, 0x00000000, 0x000076F1, 0x0000C0C2, 0x000113AC, 0x000193C7, 0x00022ADB, 0x0002E59B, 0x0003C274, 0x0004BDDA, 0x0005CB8F, 0x0006F792, // 2003
	0x00083008, 0x0009E166, 0x000BC399, 0x000DC70D, 0x000FCAD1, 0x001219F5, 0x0014E794, 0x00180A61, 0x001B7A83, 0x001EEAAA, 0x0022A968, 0x0026AAF2, // 2004
	0x002B6A0F, 0x00313036, 0x00367804, 0x003C4AE9, 0x00421A3C, 0x0048A2B6, 0x004F0BA9, 0x00563A9C, 0x005D4FF9, 0x00642120, 0x006BC702, 0x0072DF38, // 2005
	0x007A2553, 0x008262A7, 0x0089C5C3, 0x0091FEFF, 0x009AE5E4, 0x00A3F682, 0x00AD0F09, 0x00B727F9, 0x00C1E7A3, 0x00CB8A2A, 0x00D5B9FE, 0x00DF62F9, // 2006
	0x00E9061D, 0x00F428F1, 0x00FE1C56, 0x0108F832, 0x01141330, 0x011FFB48, 0x012B9597, 0x0137A3D7, 0x01436C46, 0x014EBA63, 0x015AE49B, 0x01665B6D, // 2007
	0x01721DF4, 0x017ECDD9, 0x018A872F, 0x0197CF93, 0x01A3FCA7, 0x01B1BB65, 0x01BF4E25, 0x01CE3307, 0x01DD339E, 0x01EB4EB3, 0x01FA24CC, 0x02086E83, // 2008
	0x0216E01E, 0x0226DE08, 0x0234EDA5, 0x02552D86, 0x02677F82, 0x027AA2A8, 0x028D8BA1, 0x02A14649, 0x02B605B4, 0x02C9ADB5, 0x02DD8AD9, 0x02F0DFE7, // 2009
	0x0304F671, 0x031B4142, 0x032E6143, 0x0342C960, 0x0356CD19, 0x036CB4D8, 0x0381A103, 0x03986CC1, 0x03B0829F, 0x03C679E3, 0x03DD820B, 0x03F4381E, // 2010
	0x040AF127, 0x0423F461, 0x0439C102, 0x045248D4, 0x046B187C, 0x048570E5, 0x04A09A51, 0x04BCC8A2, 0x04D9B4FA, 0x04F52906, 0x051201A6, 0x052DF05D, // 2011
	0x054A17B7, 0x0568A266, 0x0584C8A7, 0x05A2542C, 0x05C0B41B, 0x05DF82B9, 0x05FE3605, 0x061E5F48, 0x063F4240, 0x065E2C95, 0x067E22B7, 0x069DBC58, // 2012
	0x06C04502, 0x06E62970, 0x0707D372, 0x072DFF1A, 0x0751CA91, 0x077860FB, 0x079C0F3E, 0x07C1E771, 0x07E86366, 0x080DA8CE, 0x0831EE79, 0x08558FC5, // 2013
	0x087B94B3, 0x08A21C54, 0x08C4F55C, 0x08EAC6FE, 0x09119CAA, 0x09397AED, 0x0960B60A, 0x098A9925, 0x09B76F87, 0x09E01456, 0x0A0906C0, 0x0A305FC4, // 2014
	0x0A810424, 0x0ADAF553, 0x0B2947CE, 0x0B7D01E6, 0x0BCF1E76, 0x0C24958C, 0x0C755B5B, 0x0CCD15D3, 0x0D23C304, 0x0D7376DC, 0x0DC56AFA, 0x0E140D38, // 2015
	0x0E6631A2, 0x0EBDF2C6, 0x0F0CE2EC, 0x0F607BF5, 0x0FB37151, 0x100AE86A, 0x105E79ED, 0x10B8BBBF, 0x1115CAA8, 0x116AE5AC, 0x11BEB400, 0x1211F832, // 2016
	0x1267B822, 0x12C42272, 0x1315847B, 0x136E4BE0, 0x13C5FDBD, 0x141F2328, 0x147B20C9, 0x14DDE3B3, 0x1541CB7A, 0x159E4A36, 0x1601FFF2, 0x16657140, // 2017
	0x16CB8A49, 0x1734ECE1, 0x1792BE94, 0x17FA7AFA, 0x185EC78C, 0x18C964A2, 0x193230D2, 0x19A225BD, 0x1A12BD1E, 0x1A79217A, 0x1AE1E760, 0x1B4790FD, // 2018
	0x1BB4F607, 0x1C23CE64, 0x1C84B186, 0x1CF2F646, 0x1D61D7F8, 0x1DDB56D8, 0x1E59A281, 0x1EDF03D3, 0x1F66D25F, 0x1FE26F82, 0x205EC456, 0x20D2BDED, // 2019
	0x21484431, 0x21C24BA6, 0x2230C76F, 0x22A6C5D6, 0x23131B17, 0x23844C83, 0x23F45E75, 0x246D38C1, 0x24EB9338, 0x255DC81A, 0x25D30C39, 0x2643606D, // 2020
	0x26B9CB56, 0x2730F2C2, 0x279824A7, 0x28072E59, 0x2870B46C, 0x28E20CEE, 0x294EA8DA, 0x29BDF4F9, 0x2A2F2276, 0x2A9872C3, 0x2B026A37, 0x2B6628B7, // 2021
	0x2BCD3A33, 0x2C3819A3, 0x2C95D422, 0x2CF66474, 0x2D57AFA7, 0x2DC0DF59, 0x2E28345D, 0x2E94DF63, 0x2F014662, 0x2F63074E, 0x2FC3E3BE, 0x301FADA4, // 2022
	0x307F54F1, 0x30E474F9, 0x313BDC54, 0x3199D68A, 0x31F91CCB, 0x32595812, 0x32B90F74, 0x3320EB2E, 0x3386B446, 0x33E585DA, 0x34462941, 0x34A0E6FC, // 2023
	0x34FFEDCC, 0x35602515, 0x35B6684B, 0x36101E12, 0x3669EF96, 0x36CA6FDD, 0x37297144, 0x378E7A59, 0x37F5221B, 0x3851C0A0, 0x38AE410D, 0x390700F4, // 2024
	0x3960AD24, 0x39B9D4B0, 0x3A02517E, 0x3A596510, 0x3AB187CE, 0x3B0D2A81, 0x3B69F99C, 0x3BCAE4BE, 0x3C2B4F3C, 0x3C889F7A, 0x3CE92D2C, 0x3D467D6A, // 2025
	0x3DA6E9EF, 0x3E075673, 0x3E5E6E25, 0x3EBEB97C, 0x3F1C09BA, 0x3F7C763E, 0x3FD9C67C, 0x403A3301, 0x409A9F85, 0x40F7EFC3, 0x41587D75, 0x41B5CDB3, // 2026
];

function getPicMonthYear(url)
{
	const token = url.substr(url.lastIndexOf("/") + 1, 8);
	const id = parseInt(token, 16);

	let i;
	for (i = picMonthIdStart.length - 1; id < picMonthIdStart[i]; --i);
	const year = 2003 + Math.trunc(i / 12);
	const month = 1 + i % 12;
	const future = i === picMonthIdStart.length;

	return (future ? ">" : "") + formatYearMonth(year, month);
}

css.add(`
.ra_albumview_like
{
	font-family: Inter, Helvetica, Arial, "Open Sans", sans-serif;
}
`);

dom.on(`[role='dialog'] > div > main > ul > li button[class^="TertiaryButton__Element-sc-"]`, el =>
{
	const img = el.closest("li").querySelector("img");
	const monthYear = getPicMonthYear(img.src);
	dom.add(el.parentNode, `<p class="ra_albumview_like">${monthYear}</p>`, true);
});

dom.on(`div.ReactModal__Content main div > img[src^="/img/usr/original/"]`, img =>
{
	const p = img.closest("main").querySelector(`p[class^="BaseText-sc-"]`);
	const monthYear = getPicMonthYear(img.src);
	p.innerHTML = monthYear + "<br />" + p.innerHTML;
});

dom.on(`li#picture_menu_set-as-main-profile-picture`, el =>
{
	const button = el.querySelector("button");

	// Only allow profile pic being changed when manually clicking this button.
	button.parentNode.addEventListener("click", e => changeProfilePic = true, true);
});

net.on("xhr:send", "PUT /api/v4/profiles/me", e =>
{
	// Prevent automatic profile picture change when rearranging pictures.
	if (changeProfilePic)
		changeProfilePic = false;
	else if (e.body.preview_pic_id)
		e.cancel = true;
});

// ---- Discover ----

net.on("fetch:recv", "GET /api/content/bluebird/startpages", e =>
{
	if (!cfg.getDiscoverBanners())
		for (const item of e.body)
			if (item.blogposts)
				item.blogposts = [];
});

net.on("fetch:recv", "GET /api/v4/groups", e =>
{
	if (!cfg.getDiscoverGroups() && e.url.includes("seed=popular-"))
	{
		e.body.cursors = {};
		e.body.items = [];
		e.body.items_total = 0;
	}
});

// ---- Location ----

css.add(`
div.js-side-content div.js-restriction[class*="Info--"]
{
	display: none;
}

div.js-side-content div.layer-actionbar > button.js-apply.is-disabled
{
	filter: initial;
	opacity: initial;
	pointer-events: initial;
}
`);

dom.on(`div.js-side-content button[class^="SecondaryButton__Element-sc-"]`, button =>
{
	button.innerHTML = str.get("chooseLocation");
});

net.on("xhr:send", "PUT /api/v4/locations/profile", e =>
{
	function fuzz()
	{
		const MIN = 123; const MAX = 321;
		const rnd = Math.random() * (MAX - MIN) + MIN;
		return Math.random() > 0.5 ? -rnd : rnd;
	}

	if (e.body.sensor && cfg.getLocationFuzz())
	{
		const [east, north, zn, zl] = utm.fromLatlon(e.body.lat, e.body.long);
		[e.body.lat, e.body.long] = utm.toLatlon(east + fuzz(), north + fuzz(), zn, zl);
	};
});

// ---- Settings ----

function openSettingsPane()
{
	// Open pane.
	const layerContent = document.querySelector("#offcanvas-nav > .js-layer-content");
	layerContent.classList.add("is-open");

	// Create UI.
	const pane = layerContent.querySelector(".js-side-content");
	pane.replaceChildren();
	const p = dom.add(pane, `
		<div class="layout layout--vertical layout--consume">
			<div class="layout-item layout-item--consume layout layout--vertical">

				<div class="js-header layout-item l-hidden-md-lg">
					<div class="layer-header layer-header--primary">
						<a class="back-button l-hidden-md-lg l-tappable js-back marionette" href="/me">
							<span class="js-back-icon icon icon-back icon-large"></span>
						</a>
						<div class="layer-header__title">
							<h2>${GM_info.script.name}</h2>
						</div>
					</div>
				</div>
				<div class="layout-item settings__navigation p l-hidden-sm">
					<div class="js-title typo-section-navigation">${GM_info.script.name}</div>
				</div>

				<div class="layout-item layout-item--consume">
					<div class="js-content js-scrollable fit scrollable">
						<div id="ra_settings_p" class="p"></div>
					</div>
				</div>
			</div>
		</div>`).querySelector("#ra_settings_p");

	function addSection(title)
	{
		return dom.add(p, `
			<div class="settings__key">
				<div>
					<span>${str.get(title)}</span>
				</div>
				<div class="separator separator--alt separator--narrow [ mb ] "></div>
			</div>`);
	}
	function addCheckbox(section, text, desc)
	{
		const input = dom.add(section, `
			<div class="layout layout--v-center">
				<div class="layout-item [ 6/12--sm ]">
					<span>${str.get(text)}</span>
				</div>
				<div class="layout-item [ 6/12--sm ]">
					<div class="js-toggle-show-headlines pull-right">
						<div>
							<span class="ui-toggle ui-toggle--default ui-toggle--right">
								<input class="ui-toggle__input" type="checkbox" id="ra_${text}">
								<label class="ui-toggle__label" for="ra_${text}" style="touch-action: pan-y; user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></label>
							</span>
						</div>
					</div>
				</div>
			</div>`).querySelector("input");
		if (desc)
		{
			dom.add(section, `
				<div>
					<div class="settings__description">${str.get(desc)}</div>
				</div>`);
		}
		return input;
	}
	function addNumber(section, text, min, max)
	{
		return dom.add(section, `
			<div class="layout layout--v-center">
				<div class="layout-item [ 6/12--sm ] mv-">
					<span>${str.get(text)}</span>
				</div>
				<div class="layout-item [ 6/12--sm ] mv-">
					<input class="input input--block" type="number" min="${min}" max="${max}"/>
				</div>
			</div>`).querySelector("input");
	}
	function addTagList(section)
	{
		return dom.add(section, `
			<div class="mv js-grid-stats-selector">
				<div>
					<ul class="js-list tags-list tags-list--centered"/>
				</div>
			</div>`).querySelector("ul");
	}
	function addTag(ul, tag, text, selected, change)
	{
		const li = dom.add(ul, `
			<li class="tags-list__item">
				<a class="js-tag ui-tag ui-tag--removable" href="#">
					<span class="ui-tag__label">${text}</span>
				</a>
			</li>`);
		const a = li.querySelector("a");
		if (selected)
			a.classList.add("ui-tag--selected");
		li.addEventListener("click", e =>
		{
			e.preventDefault();
			if (a.classList.contains("ui-tag--selected"))
			{
				change({ tag: tag, checked: false });
				a.classList.remove("ui-tag--selected");
			}
			else
			{
				change({ tag: tag, checked: true });
				a.classList.add("ui-tag--selected");
			}
		});
	}

	// Add debug section.
	if (romeo.debug())
	{
		const debugSection = addSection("debug");

		const btUnblockAll = dom.add(debugSection, `<button type="button">Unblock all</button>`);
		btUnblockAll.addEventListener("click", async e =>
		{
			const ids = [];
			for await (const item of romeo.iterItems("GET /api/v4/profiles/blocked", { length: 100 }))
				ids.push(item.id);
			for (const id of ids)
				await romeo.sendXhr("DELETE /api/v4/contacts/" + id);
		});
	}

	// Add general section.
	const generalSection = addSection("general");

	const locationFuzz = addCheckbox(generalSection, "locationFuzz", "locationFuzzDesc");
	locationFuzz.checked = cfg.getLocationFuzz();
	locationFuzz.addEventListener("change", e => cfg.setLocationFuzz(e.target.checked));

	const systemMessages = addCheckbox(generalSection, "systemMessages", "systemMessagesDesc");
	systemMessages.checked = cfg.getSystemMessages();
	systemMessages.addEventListener("change", e => cfg.setSystemMessages(e.target.checked));

	const unlockPausedProfile = addCheckbox(generalSection, "unlockPausedProfile", "unlockPausedProfileDesc");
	unlockPausedProfile.checked = cfg.getUnlockPausedProfile();
	unlockPausedProfile.addEventListener("change", e => cfg.setUnlockPausedProfile(e.target.checked));

	// Add discover section.
	const discoverSection = addSection("discover");

	const discoverBanners = addCheckbox(discoverSection, "discoverBanners", "discoverBannersDesc");
	discoverBanners.checked = cfg.getDiscoverBanners();
	discoverBanners.addEventListener("change", e => cfg.setDiscoverBanners(e.target.checked));

	const discoverFilter = addCheckbox(discoverSection, "discoverFilter", "discoverFilterDesc");
	discoverFilter.checked = cfg.getDiscoverFilter();
	discoverFilter.addEventListener("change", e => cfg.setDiscoverFilter(e.target.checked));

	const discoverGroups = addCheckbox(discoverSection, "discoverGroups", "discoverGroupsDesc");
	discoverGroups.checked = cfg.getDiscoverGroups();
	discoverGroups.addEventListener("change", e => cfg.setDiscoverGroups(e.target.checked));

	// Add filter section.
	const filterSection = addSection("filter");

	const enhancedFilter = addCheckbox(filterSection, "enhancedFilter", "enhancedFilterDesc");
	enhancedFilter.checked = cfg.getEnhancedFilter();
	enhancedFilter.addEventListener("change", e => cfg.setEnhancedFilter(e.target.checked));

	const searchFilter = addCheckbox(filterSection, "searchFilter", "searchFilterDesc");
	searchFilter.checked = cfg.getSearchFilter();
	searchFilter.addEventListener("change", e => cfg.setSearchFilter(e.target.checked));

	// Add tiles section.
	const tilesSection = addSection("tiles");

	const enhancedTiles = addCheckbox(tilesSection, "enhancedTiles", "enhancedTilesDesc");
	enhancedTiles.checked = cfg.getEnhancedTiles();
	enhancedTiles.addEventListener("change", e => cfg.setEnhancedTiles(e.target.checked));

	const enhancedImages = addCheckbox(tilesSection, "enhancedImages", "enhancedImagesDesc");
	enhancedImages.checked = cfg.getEnhancedImages();
	enhancedImages.addEventListener("change", e => cfg.setEnhancedImages(e.target.checked));

	const fullHeadlines = addCheckbox(tilesSection, "fullHeadlines", "fullHeadlinesDesc");
	fullHeadlines.checked = cfg.getFullHeadlines();
	fullHeadlines.addEventListener("change", e => cfg.setFullHeadlines(e.target.checked));

	const tileCount = addNumber(tilesSection, "tileCount", 0, 10);
	tileCount.value = cfg.getTileCount();
	tileCount.addEventListener("change", e => cfg.setTileCount(parseInt(e.target.value)));

	const tileDetailsList = addTagList(tilesSection, "tileDetailsList");
	for (const tileDetail of ["age", "height", "weight", "bmi", "smoker", "ageRange",
		"bodyHair", "bodyType", "ethnicity", "relationship", "analPosition",
		"dick", "saferSex", "dirty", "sm", "fisting", "openTo"])
	{
		addTag(tileDetailsList, tileDetail, str.get(tileDetail), cfg.tileDetails.has(tileDetail), e => cfg.setTileDetail(e.tag, e.checked));
	}

	// Add messages section.
	const messagesSection = addSection("messages");

	const fullMessages = addCheckbox(messagesSection, "fullMessages", "fullMessagesDesc");
	fullMessages.checked = cfg.getFullMessages();
	fullMessages.addEventListener("change", e => cfg.setFullMessages(e.target.checked));

	const typingNotifications = addCheckbox(messagesSection, "typingNotifications", "typingNotificationsDesc");
	typingNotifications.checked = cfg.getTypingNotifications();
	typingNotifications.addEventListener("change", e => cfg.setTypingNotifications(e.target.checked));

	const sendEnter = addCheckbox(messagesSection, "sendEnter", "sendEnterDesc");
	sendEnter.checked = cfg.getSendEnter();
	sendEnter.addEventListener("change", e => cfg.setSendEnter(e.target.checked));

	// Add hidden users section.
	const hiddenUsersSection = addSection("hiddenUsers");

	const hideMessages = addCheckbox(hiddenUsersSection, "hideMessages");
	hideMessages.checked = cfg.getHideMessages();
	hideMessages.addEventListener("change", e => cfg.setHideMessages(e.target.checked));

	const hideContacts = addCheckbox(hiddenUsersSection, "hideContacts");
	hideContacts.checked = cfg.getHideContacts();
	hideContacts.addEventListener("change", e => cfg.setHideContacts(e.target.checked));

	const hideVisits = addCheckbox(hiddenUsersSection, "hideVisits");
	hideVisits.checked = cfg.getHideVisits();
	hideVisits.addEventListener("change", e => cfg.setHideVisits(e.target.checked));

	const hideLikes = addCheckbox(hiddenUsersSection, "hideLikes");
	hideLikes.checked = cfg.getHideLikes();
	hideLikes.addEventListener("change", e => cfg.setHideLikes(e.target.checked));

	const hideFriends = addCheckbox(hiddenUsersSection, "hideFriends");
	hideFriends.checked = cfg.getHideFriends();
	hideFriends.addEventListener("change", e => cfg.setHideFriends(e.target.checked));

	const hideActivities = addCheckbox(hiddenUsersSection, "hideActivities");
	hideActivities.checked = cfg.getHideActivities();
	hideActivities.addEventListener("change", e => cfg.setHideActivities(e.target.checked));

	const inMinAge = addNumber(hiddenUsersSection, "minAge", 18, 99);
	const inMaxAge = addNumber(hiddenUsersSection, "maxAge", 18, 99);
	let minAge = cfg.getHiddenMinAge();
	let maxAge = cfg.getHiddenMaxAge();
	inMinAge.value = minAge;
	inMaxAge.value = maxAge;
	inMinAge.addEventListener("change", e =>
	{
		minAge = parseInt(e.target.value);
		cfg.setHiddenMinAge(minAge);
		if (minAge > maxAge)
		{
			maxAge = minAge;
			cfg.setHiddenMaxAge(maxAge);
			inMaxAge.val(maxAge);
		}
	});
	inMaxAge.addEventListener("change", e =>
	{
		maxAge = parseInt(e.target.value);
		cfg.setHiddenMaxAge(maxAge);
		if (maxAge < minAge)
		{
			minAge = maxAge;
			cfg.setHiddenMinAge(minAge);
			inMinAge.val(minAge);
		}
	});

	list.create(hiddenUsersSection, {
		onGet: () => Array.from(cfg.getHiddenUsers()).sort(Intl.Collator().compare),
		onAdd: e => cfg.setUserHidden(e, true),
		onRemove: e => cfg.setUserHidden(e, false)
	});
}

dom.on(`li.js-settings > div.accordion > ul.js-list`, el =>
{
	// Add extension menu item.
	const linkClass = el.querySelector("a").className;
	const link = dom.add(el, `
		<li>
			<div>
				<a class="${linkClass}" href="/me/romeoadditions">${GM_info.script.name}</a>
			</div>
		</li>`);
	link.addEventListener("click", e =>
	{
		if (link.classList.contains("is-selected"))
		{
			link.classList.remove("is-selected");
		}
		else
		{
			link.classList.add("is-selected");
			setTimeout(() => openSettingsPane()); // delayed execution to force open panel
		}
	});
	// Deselect menu item if others are clicked.
	for (const linkOther of el.querySelectorAll("li"))
		if (linkOther !== link)
			linkOther.addEventListener("click", e => link.classList.remove("is-selected"));
});

dom.on(`#offcanvas-nav > .js-layer-content > main > div.layout > div.reactView--autoHeight > p[class^="MiniText-sc-"]`, el =>
{
	el.innerHTML += `<a class="marionette" style="display:block" href="${GM_info.script.downloadURL}" target="blank">${GM_info.script.name} ${GM_info.script.version}</a>`;
});

// ---- Init ----

initPreviews();
for (const ext of (window.romeoExts ??= []))
	ext();
