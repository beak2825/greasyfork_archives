// ==UserScript==
// @name							Wykop XS - Multikonta (beta)
// @name:pl							Wykop XS - Multikonta (beta)
// @name:en							Wykop XS - Multikonta (beta)

// @version							3.1.5

// @description 					Wykop XS - Multikonta - Możliwość korzystania z nieograniczonej liczby multikont. Dodajesz tyle kont ile chcesz i jednym kliknięciem przełączasz się pomiędzy nimi.
// @description:en 					Wykop XS - Multikonta - Możliwość korzystania z nieograniczonej liczby multikont. Dodajesz tyle kont ile chcesz i jednym kliknięciem przełączasz się pomiędzy nimi.


// Chcesz wesprzeć projekt Wykop X? Postaw kawkę:
// @contributionURL					https://buycoffee.to/wykopx

// @author							Wykop X <wykopx@gmail.com>









// @match							https://wykop.pl/*
// @supportURL						http://wykop.pl/tag/wykopx
// @namespace						Violentmonkey Scripts
// @compatible						chrome, firefox, opera, safari, edge
// @license							No License
// @icon							https://www.google.com/s2/favicons?sz=64&domain=wykop.pl


// @require 						https://unpkg.com/localforage@1.10.0/dist/localforage.min.js
// @require							https://cdn.jsdelivr.net/npm/dayjs@1.11.10/dayjs.min.js
// @require							https://cdn.jsdelivr.net/npm/dayjs@1.11.10/locale/pl.js
// @require							https://cdn.jsdelivr.net/npm/dayjs@1.11.10/plugin/relativeTime.js






// @downloadURL https://update.greasyfork.org/scripts/518690/Wykop%20XS%20-%20Multikonta%20%28beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/518690/Wykop%20XS%20-%20Multikonta%20%28beta%29.meta.js
// ==/UserScript==


'use strict';

const currentVersion = "3.1.5";
let dev = false;

const promoString = " - Wykop XS / #wykopx";


const root = document.documentElement;
const head = document.head;
const body = document.body;
const bodySection = body.querySelector("section");

dayjs.locale("pl");
dayjs.extend(window.dayjs_plugin_relativeTime); 		//dayjs.extend(relativeTime); // https://day.js.org/docs/en/plugin/relative-time // https://www.jsdelivr.com/package/npm/dayjs?tab=files&path=plugin

const wykopxSettings = getComputedStyle(head); // getComputedStyle(document.documentElement) -- nie działa, nie wczytuje właściwości z :root
const settings = {};

const styleElement = document.createElement('style');
styleElement.id = "wykopxs_mikroczat";
let CSS = "";

function setSettingsValueFromCSSProperty(settingName, defaultValueForWykopXS = true, propertyValueInsteadOfBoolean = false)
{
	if (propertyValueInsteadOfBoolean) settings[settingName] = wykopxSettings.getPropertyValue(`--${settingName}`) ? wykopxSettings.getPropertyValue(`--${settingName}`).trim() : defaultValueForWykopXS;
	else settings[settingName] = wykopxSettings.getPropertyValue(`--${settingName}`) ? wykopxSettings.getPropertyValue(`--${settingName}`).trim() === '1' : defaultValueForWykopXS;
}

//setSettingsValueFromCSSProperty("WykopXSEnabled");
//if (settings.WykopXSEnabled == false) return;


/* WYKOP XS HEADER */






/*  --- ZMIANA USTAWIEŃ ---
jeśli chcesz zmienić domyślne ustawienia nie zmieniaj ich w tym kodzie.
Zmień je w przeglądarce w następujący sposób:

1. Wejdź na Wykop
2. Otwórz panel narzędzi deweloperskich klawiszem *F12* lub skrótem klawiaturowym *CTRL* + *SHIFT* + *C*
3. Przejdź na zakładkę "Aplikacja"
4. w panelu po lewej w sekcji "Pamięć" wybierz "Pamięć lokalna" i znajdź na liście https://wykop.pl
5. w głównym okienku pojawi się lista kilku wartości. Znajdź opcję "wykopx/settings/settings"
6. zmień wybraną opcję na true (aby ją włączyć) lub false (aby wyłączyć)


Domyślne wartości wyglądają przykładowo tak:

{"entryVotersListExpandIfLessThan": 5, "votersFollow":true, "votersBlacklist":true, "votersBanned":true, "votersSuspended":true, "votersRemoved":true, "votersGenderF":false, "votersGenderM":false, "votersColorGreen":true, "votersColorOrange":false,"votersColorBurgundy":true}

*/



// DEFAULT SETTINGS - nie zmieniaj wartości settings w kodzie.
// Zmień je w sposób opisany powyżej

setSettingsValueFromCSSProperty("entryVotersListEnable");				// włącza pokazywanie listy plusujących z Wykop X Style
setSettingsValueFromCSSProperty("entryVotersListExpandIfLessThan", 50, true);
setSettingsValueFromCSSProperty("hideAds");								// blokuje wszystkie reklamy na wykopie


// entryVotersListExpandIfLessThan - domyślnie Wykop pokazywał 5 osób, które zaplusowały. 
// Możesz zmienić tę wartość na np. 10 albo 25. Jeśli wpis ma mniej plusów niż ta liczba, zostaną od razu wyświetleni wszyscy plusujący bez przycisku "+15 INNYCH"

settings.showAnimatedAvatars = true;					// pokazuje animowane avatary

if (settings.entryVotersListEnable)
{
	// entryVotersListExpandIfLessThan - domyślnie Wykop pokazywał 5 osób, które zaplusowały.
	// Możesz zmienić tę wartość na np. 10 albo 25. Jeśli wpis ma mniej plusów niż ta liczba, zostaną od razu wyświetleni wszyscy plusujący bez przycisku "+15 INNYCH"
	if (!settings.entryVotersListExpandIfLessThan) settings.entryVotersListExpandIfLessThan = 20;
	settings.votersFollow = true;							// pokazuje 🔔 przed użytkownikami, których obserwujesz
	settings.votersBlacklist = true;						// pokazuje ⛔ przed użytkownikami, których blokujesz
	settings.votersBanned = true;							// pokazuje użytkowników z aktywnym banem w kolorze i z ikonką 🍌
	settings.votersSuspended = true;						// pokazuje ✖ przed kontami, które są w trakcie usuwania
	settings.votersRemoved = true;							// pokazuje ✖ przed kontami, które są usunięte
	settings.votersGenderF = false;							// pokazuje różową kropkę przed kobietami
	settings.votersGenderM = false;							// pokazuje niebieską kropkę przed mężczyznami
	settings.votersColorGreen = true;						// pokazuje zielonki w kolorze
	settings.votersColorOrange = false;						// pokazuje pomarańczowych użytkowników w kolorze
	settings.votersColorBurgundy = true;					// pokazuje użytkowników bordo w kolorze
	settings.votersFollowFirst = true;						// pokazuje użytkowników, których obserwujesz pierwszych na liście
	settings.votersBlackFirst = false;						// pokazuje plusy od moderacji pierwsze na liście (konta typu @wykop, @m__b, @a__s itd.)
	settings.votersBurgundyFirst = false;					// pokazuje użytkowników bordo pierwszych na liście
	settings.votersOrangeFirst = false;						// pokazuje zielonki pierwszych na liście
	settings.votersGreenFirst = false;						// pokazuje pomarańczki pierwszych na liście
	settings.votersBlacklistLast = false;					// pokazuje użytkowników, których zablokowałeś na końcu listy
	settings.votersRemovedLast = false;						// pokazuje usunięte konta na końcu listy
	settings.votersBannedLast = false;						// pokazuje zbanowanych na końcu listy
	settings.votersSuspendedLast = false;					// pokazuje konta w trakcie usuwania na końcu listy
}

settings.hideShareButton = true;						// ukrywa przycisk "Udostępnij"
settings.showFavouriteButton = true;					// pokazuje przycisk "Dodaj do ulubionych" (samą gwiazdkę)
settings.showFavouriteButtonLabel = true;				// pokazuje oprócz gwiazdki także tekst "Ulubione"
// settings.addCommentPlusWhenVotingOnEntry = false;		// gdy plusujesz wpis, dodaje komentarz "+1"
// settings.addCommentPlusWhenVotingOnComment = false;		// gdy plusujesz komentarz, dodaje komentarz "+1"



settings.mikroczatShowLeftMenuButton = false;
settings.mikroczatShowLeftMenuLink = true;
settings.mikroczatShowTopNavButton = true;
settings.mikroczatOpenMikroczatOnMiddleClick = false;
settings.mikroczatOpenMikroczatOnCTRLLeftClick = true;
settings.mikroczatOpenMikroczatOnCTRLMiddleClick = true;

(async function ()
{
	// LOCALSTORAGE
	const localStorageSettings = localforage.createInstance({
		driver: localforage.LOCALSTORAGE,
		name: "wykopx",
		storeName: "settings",
	});

	await localStorageSettings.getItem('settings').then(async (localSettings) =>
	{
		if (localSettings)
		{
			mergeSettings(localSettings, settings);
		}
		else
		{
			localStorageSettings.setItem('settings', settings);
		}
		await localStorageSettings.setItem('settings', settings);
	}).catch((err) =>
	{
		console.error('Error', err);
	});
	function mergeSettings(localSettings, defaultSettings)
	{
		for (let key in defaultSettings)
		{
			if (key in localSettings)
			{
				settings[key] = localSettings[key];
			}

			else if (!(key in localSettings))
			{
				settings[key] = defaultSettings[key];
			}

		}
	}














	function createNewNavBarButton(options)
	{
		let nav_ul;

		if (options.position == "left") nav_ul = document.querySelector("body header div.left nav.main ul");
		else if (options.position == "center") nav_ul = document.querySelector("body header div.right nav aside"); // doodle
		else nav_ul = document.querySelector("body header div.right nav ul"); // brak na wersji mobilnej

		if (nav_ul) 
		{
			let nav_ul_li;  // ! = nav_ul.querySelector(`li.wykopx_${ options.class } _li`);

			if (!nav_ul_li)
			{
				nav_ul_li = document.createElement("li");

				if (options.data) nav_ul_li.setAttribute(options.data, null);
				if (options.hideWithoutXStyle == true) nav_ul_li.classList.add("wykopxs");
				addWykopXSClassesToElement(nav_ul_li, options.class, "li") // class="wykopx_aaaaaa_li"

				let nav_ul_li_a = document.createElement("a");

				nav_ul_li.dataset["v-6c2d0fdd"] = "";
				nav_ul_li_a.dataset["v-6c2d0fdd"] = "";

				if (options.url) nav_ul_li_a.setAttribute("href", options.url);
				if (options.href) nav_ul_li_a.setAttribute("href", options.href);
				if (options.target) nav_ul_li_a.setAttribute("target", options.target);
				if (options.title) nav_ul_li_a.setAttribute("title", options.title);
				if (options.data) nav_ul_li_a.setAttribute(options.data, null);

				nav_ul_li_a.classList.add("hybrid");
				if (options.class) addWykopXSClassesToElement(nav_ul_li_a, options.class);

				let nav_ul_li_a_span = document.createElement("span");
				nav_ul_li_a_span.innerHTML = options.text;

				nav_ul_li_a.appendChild(nav_ul_li_a_span);
				nav_ul_li.appendChild(nav_ul_li_a);

				if (options.insertAfter != null)
				{
					let section = nav_ul.querySelector(options.insertAfter);
					section.insertAdjacentElement('afterend', nav_ul_li);
				}
				else
				{
					nav_ul.appendChild(nav_ul_li);
				}
			}
		}
	}


	function createLeftMenuButtons(asideLeftPanel = null)
	{
		if (dev) console.log("createLeftMenuButtons(), asideLeftPanel: ", asideLeftPanel);

		if (!asideLeftPanel)
		{
			asideLeftPanel = document.querySelector("body > section > div.main-content > aside.left-panel");
		}

		if (!asideLeftPanel) return;

		let aside_section_div_ul_li = document.createElement('li');

		aside_section_div_ul_li.classList.add('mikroczat');
		aside_section_div_ul_li.title = mikroczatButtonOpenTitle;
		aside_section_div_ul_li.innerHTML = `
				<div class="popper-button">
					<span>
						<span class="button">
							<a href="https://wykop.pl/czat" target="_mikroczat" class="wykopx_open_mikroczat hybrid">
								<span>${mikroczatButtonOpenLabel}</span>
							</a>
						</span>
					</span>
			</div>`;

		if (settings.mikroczatShowLeftMenuButton)
		{
			const aside_section_buttons_div_ul = asideLeftPanel.querySelector("section.buttons > div.content > ul");
			if (aside_section_buttons_div_ul && !aside_section_buttons_div_ul.querySelector("li.mikroczat"))
			{
				let clone = aside_section_div_ul_li.cloneNode(true);
				aside_section_buttons_div_ul.appendChild(clone);
			}
		}

		if (settings.mikroczatShowLeftMenuLink)
		{
			const aside_section_links_div_ul = asideLeftPanel.querySelector("section.links > div.content > ul");
			if (aside_section_links_div_ul && !aside_section_links_div_ul.querySelector("li.mikroczat"))
			{

				let clone = aside_section_div_ul_li.cloneNode(true);
				aside_section_links_div_ul.appendChild(clone);

			}
		}
	}




	function addWykopXSClassesToElement(element, inputClassOrArray, suffix = null)
	{
		if (inputClassOrArray)
		{
			if (typeof inputClassOrArray === 'string')
			{
				element.classList.add(`wykopx_${inputClassOrArray}${suffix != null ? "_" + suffix : ""}`);
			}
			else if (Array.isArray(inputClassOrArray) && inputClassOrArray.every(item => typeof item === 'string'))
			{
				inputClassOrArray.map(item =>
				{
					element.classList.add(`wykopx_${item}${suffix != null ? "_" + suffix : ""}`);
				});
			}
		}
	}





	// XS MIKROCZAT  -- START
	let wykopDomain = "https://wykop.pl";
	let wxDomain = "https://wykopx.pl";
	const mikroczatDomain = "https://mikroczat.pl";
	const mikroczatPath = "/"; /* /czat */
	const mikroczatMainChannelPath = "czat";
	const mikroczatDefaultChannel = "mikroblog+";
	// let mikroczatChannel = "/";
	let mikroczatWindow = null;
	const mikroczatButtonOpenTitle = `Wykopowy Mikroczat

Otwieranie czatu w 𝗡𝗢𝗪𝗘𝗝 𝗞𝗔𝗥𝗖𝗜𝗘:
			- 𝗟𝗣𝗠 - klik lewym przyciskiem myszy

Otwieranie czatu w 𝗡𝗢𝗪𝗬𝗠 𝗢𝗞𝗡𝗜𝗘:
			- ŚPM - klik środkowym przyciskiem myszy
				- klawisz ⌘ 𝗖𝗧𝗥𝗟 + klik
					- klawisz ⇧ 𝗦𝗛𝗜𝗙𝗧 + klik
						- klawisz ⎇ 𝗔𝗟𝗧 + klik

			EXTRA:
			- będąc na stronie #tagu otworzysz kanał tematyczny czatu
				- będąc na stronie wpisu otworzysz widok dyskusji
					- będąc na profilu użytkownika lub rozmowie otworzysz kanał prywatnej rozmowy
    
`;




	const mikroczatButtonOpenLabel = "Czat";




	// OTWIERANIE MIKROCZATU Z PRZYCISKÓW CZAT
	if (settings.mikroczatShowLeftMenuButton || settings.mikroczatShowLeftMenuLink || settings.mikroczatShowTopNavButton)
	{

		document.addEventListener("mousedown", (e) =>
		{
			if (e.target.matches("a.wykopx_open_mikroczat") || e.target.matches("a.wykopx_open_mikroczat > span"))
			{
				e.preventDefault();
				e.stopImmediatePropagation();
				e.stopPropagation();

				wykopx_open_mikroczat_event(e);
			}
		});
		document.addEventListener("click", (e) =>
		{
			if (e.target.matches("a.wykopx_open_mikroczat") || e.target.matches("a.wykopx_open_mikroczat > span"))
			{
				e.preventDefault();
			}
		});
		document.addEventListener("auxclick", (e) =>
		{
			if (e.target.matches("a.wykopx_open_mikroczat") || e.target.matches("a.wykopx_open_mikroczat > span"))
			{
				e.preventDefault();
			}
		});


		document.addEventListener("mouseout", (e) =>
		{
			if (e.target.matches("a.wykopx_open_mikroczat") && e.target.href != "https://wykop.pl/czat")
			{
				e.target.href = "https://wykop.pl/czat";
			}
		});
		document.addEventListener("contextmenu", (e) =>
		{
			if (e.target.matches("a.wykopx_open_mikroczat"))
			{
				e.target.href = "https://mikroczat.pl";
			}
			if (e.target.matches("a.wykopx_open_mikroczat > span"))
			{
				e.target.closest("a").href = "https://mikroczat.pl";
			}
		});
	}

	function wykopx_open_mikroczat_event(e)
	{
		if (e.target.matches("a.wykopx_open_mikroczat") || e.target.matches("a.wykopx_open_mikroczat > span"))
		{
			if (e.button === 2) return; // RIGHT MOUSE CLICK OFF

			let windowOptions = "";

			if (e.shiftKey || e.ctrlKey || e.metaKey || e.altKey || e.button === 1) // ŚPM
			{
				windowOptions = "popup";
			}

			openMikroczat(new URL(document.URL).pathname, windowOptions);
		}
	}



	function openMikroczat(hrefURL, windowOptions, target = "mikroczat")
	{
		let urlPathnameArray = hrefURL;
		let mikroczatURL = `${mikroczatDomain}`;

		if (hrefURL.startsWith("https://mikroczat.pl"))
		{
			mikroczatURL = hrefURL;
		}
		else
		{
			if (hrefURL.startsWith("https://wykop.pl"))
			{
				urlPathnameArray = hrefURL.replace("https://wykop.pl", "");
			}

			urlPathnameArray = urlPathnameArray.split("/");

			let channel = ""

			if (Array.isArray(urlPathnameArray))
			{
				// #nazwatagu
				if (urlPathnameArray[1] == "tag")
				{
					channel = `${mikroczatMainChannelPath}/${urlPathnameArray[2]}`;
				}
				else if (urlPathnameArray[1] == "mikroblog")
				{
					if (urlPathnameArray[2] == "najnowsze")	 // /mikroblog/najnowsze
					{
						channel = `${mikroczatMainChannelPath}/mikroblog+`;
					}
					// TODO pathnameArray[2] == "aktywne"
					// TODO pathnameArray[2] == "gorace"
					else
					{
						channel = `${mikroczatMainChannelPath}/${mikroczatDefaultChannel}`; // TODO
					}
				}
				// /obserwowane
				else if (urlPathnameArray[1] == "obserwowane")  	
				{
					channel = `${mikroczatMainChannelPath}/observed`;					// Mikroczat "observed" 🤍
					// TODO pathnameArray[2] == "profile"
					// TODO pathnameArray[2] == "tagi"
				}
				// uzytkownik - profil lub rozmowa z użytkownikiem
				else if (urlPathnameArray[1] == "ludzie" || urlPathnameArray[1] == "wiadomosci")
				{
					channel = "pm/@" + urlPathnameArray[2];
				}
				else if (urlPathnameArray[1] == "wpis")
				{
					channel = `${mikroczatMainChannelPath}/${mikroczatDefaultChannel}/#${urlPathnameArray[2]}`; // id wpisu - discussion view
				}
				else if (urlPathnameArray[1] == "") // ze strony głównej
				{
					channel = `${mikroczatMainChannelPath}/observed/#wybierz`;
				}
				else // z innych stron
				{
					channel = `${mikroczatMainChannelPath}/observed/#wybierz`;
				}
			}
			mikroczatURL += `${mikroczatPath}${channel}`;
		}


		clearKeysDatasetFromBody();

		mikroczatWindow = window.open(mikroczatURL, target, windowOptions);
	}




	function clearKeysDatasetFromBody()
	{
		if (bodySection.dataset.key_shift) delete bodySection.dataset.key_shift;
		if (bodySection.dataset.key_ctrl) delete bodySection.dataset.key_ctrl;
		if (bodySection.dataset.key_alt) delete bodySection.dataset.key_alt;
	}





	const keys = {};


	// KEYDOWN CTRL SHIFT ALT
	if (settings.mikroczatOpenMikroczatOnCTRLLeftClick || settings.mikroczatOpenMikroczatOnCTRLMiddleClick)
	{
		document.addEventListener("keydown", (e) =>
		{
			if (e.target.tagName.toLowerCase() === 'textarea' || e.target.tagName.toLowerCase() === 'input') return;
			if (!keys["CTRL"] && e.key == "Control")
			{
				keys["CTRL"] = true;
				bodySection.dataset.key_ctrl = "true";
			}
			// if (!keys["SHIFT"] && e.key == "Shift")
			// {
			// 	keys["SHIFT"] = true;
			// 	bodySection.dataset.key_shift = "true";
			// }
			// if (!keys["ALT"] && (e.key == "Alt" || e.key == "AltGraph"))
			// {
			// 	keys["ALT"] = true;
			// 	bodySection.dataset.key_alt = "true";
			// }
		});

		document.addEventListener("keyup", (e) =>
		{
			if (e.target.tagName.toLowerCase() === 'textarea' || e.target.tagName.toLowerCase() === 'input') return;

			// if (keys["SHIFT"] && e.key == "Shift")
			// {
			// 	keys["SHIFT"] = false;
			// 	delete bodySection.dataset.key_shift;
			// }
			if (keys["CTRL"] && e.key == "Control")
			{
				keys["CTRL"] = false;
				delete bodySection.dataset.key_ctrl;
			}
			// if (keys["ALT"] && (e.key == "Alt" || e.key == "AltGraph"))
			// {
			// 	keys["ALT"] = false;
			// 	delete bodySection.dataset.key_alt;
			// }
		});
	}




	const performanceObserver = new PerformanceObserver((PerformanceObserverEntryList, PerformanceObserver) =>
	{
		if (settings.mikroczatOpenMikroczatOnCTRLLeftClick || settings.mikroczatOpenMikroczatOnCTRLMiddleClick)
		{
			clearKeysDatasetFromBody();
		}

		if (dev) console.log("PerformanceObserverEntryList", PerformanceObserverEntryList);
		if (dev) console.log("PerformanceObserverEntryList.getEntries", PerformanceObserverEntryList.getEntries()[0].name);
		/*
		{
			duration: 0
			entryType: "soft-navigation",
			name: "https://wykop.pl/wpis/76597433/ponad-700-wykopow-glowna-i-poprawnosc-polityczna-m#268853079",
			navigationId: "229d696d-dc59-4874-a63b-fd753787d4fd",
			source: Window {0: Window, 1: global, 2: global, 3: global, 4: global, 5: global, 6: global, 7: global, 8: global, 9: global, 10: global, 11: global, 12: global, 13: Window, 14: global, window: Window, self: Window, document: document, name: '', location: Location, …}
			startTime: 82282.70000000298
		}
		*/
	});
	performanceObserver.observe({ type: "soft-navigation", buffered: true });






	document.addEventListener("mouseover", (e) =>
	{
		if (!e.target.matches(`a[href^="https://mikroczat.pl"]`)) return;

		e.target.title = `Otwórz wykopowy Mikroczat`;

		e.target.addEventListener("click", mikroczatHrefClickEventListenerPreventDefault);
		e.target.addEventListener("auxclick", mikroczatHrefClickEventListenerPreventDefault);
		e.target.addEventListener("mousedown", mikroczatHrefMouseDownEventListenerWithShift);
	});

	document.addEventListener("mouseout", (e) =>
	{
		if (!e.target.matches(`a[href^="https://mikroczat.pl"]`)) return;
		removeEventListenersFromMikroczatHref(e.target);
	});

	function mikroczatHrefClickEventListenerPreventDefault(e)
	{
		e.preventDefault();
	}

	function removeEventListeners(etarget)
	{
		etarget.removeEventListener("click", hrefClickEventListenerPreventDefault, true);
		etarget.removeEventListener("mousedown", hrefMouseDownEventListenerWithShift, true);
	}
	function removeEventListenersFromMikroczatHref(etarget)
	{
		etarget.removeEventListener("click", mikroczatHrefClickEventListenerPreventDefault, true);
		etarget.removeEventListener("auxclick", mikroczatHrefClickEventListenerPreventDefault, true);
		etarget.removeEventListener("mousedown", mikroczatHrefMouseDownEventListenerWithShift, true);
	}



	// MOUSE OVER LINKS
	if (settings.mikroczatOpenMikroczatOnCTRLLeftClick || settings.mikroczatOpenMikroczatOnCTRLMiddleClick || settings.mikroczatOpenMikroczatOnMiddleClick)
	{
		document.addEventListener("mouseover", (e) =>
		{
			if (!e.target.matches(`a[href^="/tag/"]`)
				&& !e.target.matches(`a[href^="/ludzie/"]`)
				// && !e.target.matches(`a.username[href^="/ludzie/"] > span`)
				//&& !e.target.matches(`a[href^="/ludzie/"]:not(:has(> span))`)
				&& !e.target.matches(`a[href^="/wpis/"] > time`)) return;

			// ⇧ 𝗦𝗛𝗜𝗙𝗧
			// ⌘ 𝗖𝗧𝗥𝗟
			// ⎇ 𝗔𝗟𝗧 
			// #heheszki



			if (e.target.matches(`a[href^="/tag/"]`))
			{
				e.target.addEventListener("click", hrefClickEventListenerPreventDefault);
				e.target.addEventListener("auxclick", hrefClickEventListenerPreventDefault);
				e.target.addEventListener("mousedown", hrefMouseDownEventListenerWithShift);
				// e.target.addEventListener("mouseup", hrefMouseUpEventListenerWithShift, true);

				e.target.title = `Klikając w tag wciśnij klawisz 𝗖𝗧𝗥𝗟,
lub kliknij w tag śordkowym przyciskiem myszy,
żeby otworzyć na 🗯 𝗠𝗶𝗸𝗿𝗼𝗰𝘇𝗮𝗰𝗶𝗲 kanał tematyczny 

Kanał tematyczny #${e.target.innerText}:

⌘ 𝗖𝗧𝗥𝗟 + kliknięcie LPM - w nowej karcie
⌘ 𝗖𝗧𝗥𝗟 + kliknięcie ŚPM - w nowym oknie
`;
			}

			// @NadiaFrance
			else if (e.target.matches(`a[href^="/ludzie/"]`))
			{
				e.target.addEventListener("click", hrefClickEventListenerPreventDefault);
				e.target.addEventListener("auxclick", hrefClickEventListenerPreventDefault);
				e.target.addEventListener("mousedown", hrefMouseDownEventListenerWithShift);
				// e.target.addEventListener("mouseup", hrefMouseUpEventListenerWithShift, true);

				e.target.title = `Wciśnij klawisz 𝗖𝗧𝗥𝗟 klikając w login użytkownika,
aby otworzyć rozmowę prywatną (PM) na 🗯 Mikroczacie

Rozmowa prywatna:
⌘ 𝗖𝗧𝗥𝗟 + kliknięcie LPM - w nowej karcie
⌘ 𝗖𝗧𝗥𝗟 + kliknięcie ŚPM - w nowym oknie
`;
			}
			// PERMALINK DO WPISU
			else if (e.target.matches(`a[href^="/wpis/"] > time`))
			{
				e.target.addEventListener("click", hrefClickEventListenerPreventDefault);
				e.target.addEventListener("auxclick", hrefClickEventListenerPreventDefault);
				e.target.addEventListener("mousedown", hrefMouseDownEventListenerWithShift);

				// e.target.addEventListener("mouseup", hrefMouseUpEventListenerWithShift, true);

				const dateObj = dayjs(e.target.dateTime);
				const dateFull = dateObj.format('D MMMM YYYY');
				const timeFull = dateObj.format('HH:mm:ss');
				const dateDayOfWeek = dateObj.format('dddd');
				const daysAgo = dateObj.fromNow();

				e.target.title = `Dodany: 
⌚ ${daysAgo}, ${timeFull}
📅 ${dateDayOfWeek}, ${dateFull} r.

Klikając w datę wpisu/komentarza wciśnij klawisz 𝗖𝗧𝗥𝗟
lub kliknij datę środkowym przyciskiem myszy, 
żeby otworzyć całą dyskusję ze wszystkimi komentarzami na 🗯 𝗠𝗶𝗸𝗿𝗼𝗰𝘇𝗮𝗰𝗶𝗲 

Widok dyskusji:

⌘ 𝗖𝗧𝗥𝗟 + kliknięcie LPM - w nowej karcie
⌘ 𝗖𝗧𝗥𝗟 + kliknięcie ŚPM - w nowym oknie
`;
			}

		});


		// MOUSE OUT
		document.addEventListener("mouseout", (e) =>
		{
			if (e.target.matches(`a[href^="/tag/"]`) || e.target.matches(`a[href^="/ludzie/"]`) || e.target.matches(`a[href^="/wpis/"] > time`))
			{
				removeEventListeners(e.target);
			}
		});
	}





	// CLICK EVENT
	function hrefClickEventListenerPreventDefault(e)
	{
		// ŚPM
		if (settings.mikroczatOpenMikroczatOnMiddleClick)
		{
			if (e.button === 1 && !e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey) 
			{
				e.preventDefault();
			}
		}

		// ŚPM + CTRL
		if (settings.mikroczatOpenMikroczatOnCTRLMiddleClick)
		{
			if (e.button === 1 && !e.shiftKey && !e.altKey && (e.ctrlKey || e.metaKey))
			{
				e.preventDefault();
			}
		}
		// LPM + CTRL
		if (settings.mikroczatOpenMikroczatOnCTRLLeftClick)
		{
			if (e.button === 0 && !e.shiftKey && !e.altKey && (e.ctrlKey || e.metaKey))
			{
				e.preventDefault();
			}
		}
	}


	function mikroczatHrefMouseDownEventListenerWithShift(e)
	{
		// new window
		if (e.button === 1 // ŚPM
			|| (e.button === 0 && !e.shiftKey && !e.altKey && (e.ctrlKey || e.metaKey)) // LPM + CTRL
		) 
		{
			e.preventDefault();
			e.stopImmediatePropagation();
			e.stopPropagation();
			let ahrefElement = e.target;
			if (e.target.tagName != "A") ahrefElement = e.target.closest("a"); // <a><span>
			openMikroczat(ahrefElement.href, "popup"); // new window popup
		}

		// LPM
		else if (e.button === 0)
		{
			e.preventDefault();
			e.stopImmediatePropagation();
			e.stopPropagation();
			let ahrefElement = e.target;
			openMikroczat(ahrefElement.href, null, "_blank"); // new tab
		}
	}



	// MOUSE DOWN
	function hrefMouseDownEventListenerWithShift(e)
	{
		// ŚPM
		if (settings.mikroczatOpenMikroczatOnMiddleClick)
		{
			if (e.button === 1 && !e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey) 
			{
				e.preventDefault();
				e.stopImmediatePropagation();
				e.stopPropagation();

				let ahrefElement = e.target;
				if (e.target.tagName != "A") ahrefElement = e.target.closest("a"); // <a><time>

				openMikroczat(ahrefElement.href, null, "_blank"); // new tab
			}
		}

		// ŚPM + CTRL
		if (settings.mikroczatOpenMikroczatOnCTRLMiddleClick)
		{
			if (e.button === 1 && !e.shiftKey && !e.altKey && (e.ctrlKey || e.metaKey))
			{
				e.preventDefault();
				e.stopImmediatePropagation();
				e.stopPropagation();

				let ahrefElement = e.target;
				if (e.target.tagName != "A") ahrefElement = e.target.closest("a"); // <a><time>

				openMikroczat(ahrefElement.href, "popup"); // new window popup
			}
		}
		// LPM + CTRL
		if (settings.mikroczatOpenMikroczatOnCTRLLeftClick)
		{
			if (e.button === 0 && !e.shiftKey && !e.altKey && (e.ctrlKey || e.metaKey))
			{
				e.preventDefault();
				e.stopImmediatePropagation();
				e.stopPropagation();

				let ahrefElement = e.target;
				if (e.target.tagName != "A") ahrefElement = e.target.closest("a"); // <a><time>

				openMikroczat(ahrefElement.href, null, "_blank"); // new tab
			}
		}

	}

















	// WIADOMOŚCI OD MIKROCZAT.PL
	window.addEventListener('message', function (event)
	{
		if (event.origin !== mikroczatDomain) return;
		if (dev) console.log('Wiadomość z mikroczat.pl', event.data);

		//if (event.data == "MikroCzatOpened") mikroczatWindow.postMessage({ type: "token", token: window.localStorage.getItem("token") }, mikroczatDomain);

		if (event.data == "MikroCzatOpened")
		{
			mikroczatWindow.postMessage({ type: "TokensObject", userKeep: window.localStorage.getItem("userKeep") }, mikroczatDomain);
			// mikroczatWindow.postMessage({ type: "TokensObject", token: window.localStorage.getItem("token"), userKeep: window.localStorage.getItem("userKeep") }, mikroczatDomain);
		}

		if (event.data == "MikroCzatLoggedIn")
		{
			if (dev) console.log("event.data", event.data)
			bodySection.dataset.mikroczatLogged = true;
		}

		if (event.data == "MikroCzatClosed")
		{
			bodySection.dataset.mikroczatLogged = false;
			mikroczatWindow = null;
		}
	}, false);



	// CSS - MultiAccounts
	{

		CSS += `select 
				{
					border: 1px solid var(--silverChalice);
					border-radius: 5px;
					height: 20%;
					align-self: center;
					background-color: transparent;
					color: var(--blackish);
					font-size: 0.9em;
					width: 31px;

					option, optgroup
					{
						color: var(--blackish);
						background-color: var(--whitish);
						font-size: 0.9em;
					}
				}
				select:focus
				{
					width: fit-content;
					position: relative;
				}`;
	}



	// CSS
	{
		CSS += `
		/* LEFT MENU MIKROCZAT BUTTON - START */

		body aside.left-panel > section.links > div.content > ul > li
		{
			position: relative;
			transition: none;
		}

		body aside.left-panel:not(.mini):has(section.buttons > div.content > ul > li.mikroczat) > section.links > div.content > ul > li.mikroczat
		{
			display: none;
		}
		body aside.left-panel > section.links > div.content > ul > li a.hybrid[class] 								/* [data-v-5687662b] */
		{
			padding: 0 6px;
			display: block;
			-webkit-box-sizing: border-box;
			box-sizing: border-box;
			font-weight: 400;
			text-decoration: none;
			font-size: 16px;
			line-height: 36px;
			height: 36px;

			cursor: pointer;
			transition: none;
		}
		body aside.left-panel > section.links > div.content > ul > li a.hybrid[class]:before						/* [data-v-5687662b] */
		{
			content: '';
			display: block;
			position: absolute;
			-webkit-mask-repeat: no-repeat;
			mask-repeat: no-repeat;
			-webkit-mask-position: center;
			mask-position: center;
			-webkit-mask-size: cover;
			mask-size: cover;
			background: var(--gullGray);
			top: 50%;
			left: 24px;
			z-index: 1;
			transition: none;
		}
		
		body aside.left-panel > section.links > div.content > ul > li.mikroczat a.hybrid[class]:before
		{
			-webkit-mask-image: url(https://i.imgur.com/82a9CyK.png);
			mask-image: url(https://i.imgur.com/82a9CyK.png);
			-webkit-mask-size: 22px 22px;
			mask-size: 22px 22px;
			width: 22px;
			height: 22px;
			margin-top: 0px;

			transition: none;
		}
		body aside.left-panel > section.links > div.content > ul > li.mikroczat a.hybrid[class]:before
		{
			top: 7px;
			left: 13px;
		}

		body aside.left-panel > section.links > div.content > ul > li a > span
		{
			display: block;
			padding: 0 16px 0 38px;
			border-radius: 6px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			position: relative;

			/* em */
			font-style: normal;
			color: var(--steelBluish);
			transition: none;
			position: relative;
		}

		body aside.left-panel > section.links > div.content > ul > li:hover a > span
		{
			background: var(--squeeze);
			cursor: pointer;
		}
	
		body aside.left-panel.mini > section.links > div.content > ul > li.mikroczat a > span
		{
			font-size: 0;
		}
		`;


		//if (settings.mikroczatShowLeftMenuButton)
		{
			CSS += `
			/* 4 BUTTONS */
			body aside.left-panel:not(.mini) > section.buttons > div.content > ul:has(li.mikroczat)
			{
				display: flex;
				flex-wrap: wrap;
				justify-content: space-around;
				column-gap: 0px;
			}
			body aside.left-panel:not(.mini) > section.buttons > div.content > ul > li
			{
				flex-basis: 47%;
				box-sizing: border-box;
				padding: 0px;
				margin-top: 7px;
			}

			body aside.left-panel > section > div.content > ul > li
			{
				position: relative;
				cursor: pointer;
			}

			body aside.left-panel.mini > section > div.content > ul > li:hover,
			body aside.left-panel:not(.mini) > section.buttons > div.content > ul > li:hover a::before
			{
				background: var(--squeeze);
			}

			aside.left-panel>section.buttons>.content ul li a 									/* [data-v-5687662b] */
			{
				display: block;
				position: relative;
				color: var(--steelBluish);
				font-size: 0;
			}

			aside.left-panel>section.buttons>.content ul li.active a, 							/* [data-v-5687662b] */
			aside.left-panel>section.buttons>.content ul li:hover a 							/* [data-v-5687662b] */
			{
				color: var(--tuna);
				font-weight: 600;
			}

			aside.left-panel>section.buttons>.content ul li a:before 							/* [data-v-5687662b] */
			{
				content: '';
				display: block;
				width: 100%;
				height: 36px;
				border: 1px solid var(--porcelain);
				border-radius: 6px;
				box-sizing: border-box;
				transition: background .2s ease, border .2s ease;
			}
			[data-night-mode] aside.left-panel>section.buttons>.content ul li a:before 			/* [data-v-5687662b] */
			{
				border-color: #303032;
			}

			aside.left-panel:not(.mini)>section.buttons>.content ul li:hover a:before,
			[data-night-mode] aside.left-panel:not(.mini)>section.buttons>.content ul li:hover a:before
			{
				border-color: var(--tuna);
			}

			aside.left-panel:not(.mini)>section.buttons>.content ul li a:after 							/* [data-v-5687662b] */
			{
				content: '';
				display: block;
				position: absolute;
				-webkit-mask-repeat: no-repeat;
				mask-repeat: no-repeat;
				-webkit-mask-position: center;
				mask-position: center;
				background: var(--gullGray);
				height: 34px;
				width: 100%;
				top: 0;
				left: 0;
				-webkit-transition: background .2s ease;
				transition: background .2s ease;
			}

			aside.left-panel:not(.mini)>section.buttons>.content ul li.mikroczat a:after 					/* [data-v-5687662b] */
			{
				-webkit-mask-image: url(https://i.imgur.com/82a9CyK.png);
				mask-image: url(https://i.imgur.com/82a9CyK.png);
				-webkit-mask-size: 22px 22px;
				mask-size: 22px 22px;
			}
	
			aside.left-panel:not(.mini)>section.buttons>.content ul li a>span 								/*[data-v-5687662b] */
			{
				position: relative;
				display: inline-block;
				font-size: 11px;
				left: 50%;
				-webkit-transform: translateX(-50%);
				transform: translateX(-50%);
				white-space: nowrap;
				margin-top: 2px;
				line-height: 16px;
				height: 16px;
			}`;
			/* LEFT MENU MIKROCZAT BUTTON - END */
		}




		/* MIKROCZAT TAG LINKS */
		CSS += `
			section:is(.entry-content, .link-block) a[href^="/tag/"]
			{
				padding-right: 2px !important;
				margin-right: 1px;
				transition: none!important;
			}

			section:is(.entry-content, .link-block) a[href^="https://mikroczat.pl/"]
			{
				padding-right: 2px!important;
				padding-left: 2px!important;
			}




			section.sidebar a[href^="/tag/"],
			section:is(.entry-content, .link-block) a[href^="/tag/"],
			section.entry div.right a[href^="/wpis/"],
			section.entry-content a[href^="/ludzie/"],
			section.entry div.right a.username[href^="/ludzie/"],
			section.link-block a.username[href^="/ludzie/"],
			section.entry-content .wrapper a[href^="https://mikroczat.pl/"]
			{
				border: 1px solid transparent!important;
				position: relative!important;
				cursor: pointer!important;
				transition: none!important;
			}




			body > section[data-key_ctrl="true"] 	section.sidebar a[href^="/tag/"],
			body > section[data-key_ctrl="true"] 	section:is(.entry-content, .link-block) a[href^="/tag/"],
			body > section[data-key_ctrl="true"] 	section:is(.entry-content, .link-block) a[href^="/tag/"] *,
			body > section[data-key_ctrl="true"] 	section.entry div.right a[href^="/wpis/"] *,
			body > section[data-key_ctrl="true"] 	section.entry-content a[href^="https://mikroczat.pl/"],
			body > section[data-key_ctrl="true"] 	section.entry-content a[href^="https://mikroczat.pl/"] *
			{
				color: var(--tagChannelColor)!important;
			}
			body > section[data-key_ctrl="true"] 	section.sidebar a[href^="/tag/"],
			body > section[data-key_ctrl="true"] 	section:is(.entry-content, .link-block) a[href^="/tag/"],
			body > section[data-key_ctrl="true"] 	section.entry div.right a[href^="/wpis/"],
			body > section[data-key_ctrl="true"] 	section.entry-content a[href^="https://mikroczat.pl/"]
			{
				border-color: var(--tagChannelColor)!important;
				background-color: color-mix(in srgb, var(--whitish) 90%, var(--tagChannelColor))!important;
				border-radius: var(--smallBorderRadius)!important;
			}
			body > section[data-key_ctrl="true"] 	section.sidebar a[href^="/tag/"]:hover,
			body > section[data-key_ctrl="true"] 	section:is(.entry-content, .link-block) a[href^="/tag/"]:hover,
			body > section[data-key_ctrl="true"] 	section.entry div.right a[href^="/wpis/"]:hover,
			body > section[data-key_ctrl="true"] 	section.entry-content a[href^="https://mikroczat.pl/"]:hover
			{
				background-color: color-mix(in srgb, var(--whitish) 60%, var(--tagChannelColor))!important;
			}
			body > section[data-key_ctrl="true"] 	section.sidebar a[href^="/tag/"],
			body > section[data-key_ctrl="true"] 	section:is(.entry-content, .link-block) a[href^="/tag/"],
			body > section[data-key_ctrl="true"] 	section.entry-content a[href^="/ludzie/"],
			body > section[data-key_ctrl="true"] 	section.link-block a.username[href^="/ludzie/"]
			{
				padding-left: 3px !important;
				margin-left: -12px !important;
			}
			body > section[data-key_ctrl="true"] 	section.sidebar a[href^="/tag/"]:hover,
			body > section[data-key_ctrl="true"] 	section:is(.entry-content, .link-block) a[href^="/tag/"]:hover,
			body > section[data-key_ctrl="true"] 	section.entry div.right a[href^="/wpis/"]:hover,
			body > section[data-key_ctrl="true"] 	section:is(.entry-content, .link-block) a[href^="/ludzie/"]:hover
			{
				text-decoration: none!important;
			}
			body > section[data-key_ctrl="true"] 	section.sidebar a[href^="/tag/"]::before,
			body > section[data-key_ctrl="true"] 	section:is(.entry-content, .link-block) a[href^="/tag/"]::before
			{
				content: "#";
			}




			body > section[data-key_ctrl="true"] 	section.entry-content a[href^="/ludzie/"],
			body > section[data-key_ctrl="true"] 	section.entry div.right a.username[href^="/ludzie/"],
			body > section[data-key_ctrl="true"] 	section.link-block a.username[href^="/ludzie/"],
			body > section[data-key_ctrl="true"] 	section.entry-content a[href^="https://mikroczat.pl/pm/"],
			body > section[data-key_ctrl="true"] 	section.entry-content a[href^="https://mikroczat.pl/room/"]
			{
				color: var(--pmChannelColor)!important;
				border-color: var(--pmChannelColor)!important;
				background-color: color-mix(in srgb, var(--whitish) 90%, var(--pmChannelColor))!important;
				padding: 0px 3px;
				margin-left: 3px;
			}
			body > section[data-key_ctrl="true"] 	section.entry-content a[href^="/ludzie/"]:hover,
			body > section[data-key_ctrl="true"] 	section.entry div.right a.username[href^="/ludzie/"]:hover,
			body > section[data-key_ctrl="true"] 	section.link-block a.username[href^="/ludzie/"]:hover,
			body > section[data-key_ctrl="true"] 	section.entry-content a[href^="https://mikroczat.pl/pm/"]:hover,
			body > section[data-key_ctrl="true"] 	section.entry-content a[href^="https://mikroczat.pl/room/"]:hover
			{
				background-color: color-mix(in srgb, var(--whitish) 60%, var(--pmChannelColor))!important;
			}
			body > section[data-key_ctrl="true"] 	section.entry-content a[href^="/ludzie/"]::before,
			body > section[data-key_ctrl="true"] 	section.entry div.right a.username[href^="/ludzie/"]::before,
			body > section[data-key_ctrl="true"] 	section.link-block a.username[href^="/ludzie/"]::before
			{
				content: "";
			}

		`;







		CSS += `
			/* TOP NAV CZAT BUTTON */
			body > section.open-left-panel > header.header > div.left > nav.main > ul > li.wykopx_open_mikroczat_li
			{
				display: none;
			}
			/*body > section[data-mikroczat-logged="true"] li.wykopx_open_mikroczat_li span:after
			{
				content: "•";
				color: white;
				position: absolute;
				top: 4px;
				right: 5px;
			}*/
			body > section[data-mikroczat-logged="false"] li.wykopx_open_mikroczat_li span:after
			{
				content: "•";
				color: rgb(255, 255, 255, 0.3);
				position: absolute;
				top: 4px;
				right: 5px;
			}`;
	}







	function throttle(func, delay)
	{
		let promise = Promise.resolve();
		return function (...args)
		{
			promise = promise.then(() =>
			{
				return new Promise((resolve) =>
				{
					setTimeout(() =>
					{
						func(...args);
						resolve();
					}, delay);
				});
			});
		};
	}

	const throttledAddVotersList = throttle(addVotersList, 200);

	let observer = new MutationObserver((mutations) => 
	{
		console.log(`--- ${mutations.length} mutations`, mutations);

		mutations.forEach((mutation) =>
		{
			if (dev || true)
			{
				console.log("---------- new mutation -----");
				console.log(mutation);

				if (mutation.type)
				{
					console.log(`⭐ mutation.type: `, mutation.type)
				}
				if (mutation.attributeName)
				{
					console.log(`⭐ mutation.attributeName: ${mutation.attributeName}`, mutation.attributeName)
				}
				if (mutation.addedNodes.length > 0 && mutation.addedNodes[0] && mutation.addedNodes[0] instanceof Element)
				{
					console.log(`⭐ mutation.addedNodes.length: ${mutation.addedNodes.length}`, mutation.addedNodes[0])
				}

				if (mutation.target)
				{
					console.log(`⭐ mutation.target: ${mutation.target.tagName}`, mutation.target)

					if (mutation.target.tagName === "SECTION")
					{

					}
				}
			}

			// ADDED NODES
			if (mutation.addedNodes.length > 0 && mutation.addedNodes[0] && mutation.addedNodes[0].nodeType === Node.ELEMENT_NODE) // && mutation.addedNodes[0] instanceof Element)
			{

				if (mutation.addedNodes[0].matches("section.entry[id]") && mutation.addedNodes[0].__vue__?.item?.resource != "link_comment")
				{
					const sectionEntry = mutation.addedNodes[0];
					if (dev) console.log("mutation 1", sectionEntry);

					processSectionEntry(sectionEntry)

					const sectionCommentsArray = sectionEntry.querySelectorAll("section.entry[id]");
					if (dev) console.log("mutation 1 forEach: sectionEntryArray", sectionCommentsArray);

					sectionCommentsArray.forEach((sectionComment) =>
					{
						if (sectionComment.__vue__?.item?.resource != "link_comment")
						{
							processSectionEntry(sectionComment)
						}
					});

				}
				else if (mutation.addedNodes[0].matches("div.content:has(>section.entry[id])"))
				{
					const sectionEntriesArray = mutation.addedNodes[0].querySelectorAll("section.entry[id]");
					if (dev) console.log("mutation 2 forEach: sectionEntriesArray", sectionEntriesArray);

					sectionEntriesArray.forEach((sectionEntry) =>
					{
						if (sectionEntry.__vue__?.item?.resource != "link_comment")
						{
							processSectionEntry(sectionEntry)
						}
					})
				}
				else if (mutation.target.tagName === "SECTION" && mutation.target.matches("section.entry.detailed[id]"))
				{
					const sectionEntry = mutation.target;

					if (dev) console.log("mutation 3", sectionEntry)
					if (dev) console.log("mutation 3: mutation.target", mutation.target);

					if (sectionEntry.__vue__?.item?.resource != "link_comment")
					{
						processSectionEntry(sectionEntry)
					}

					const sectionCommentsArray = sectionEntry.querySelectorAll("section.entry[id]");
					if (dev) console.log("mutation 3 forEach: sectionEntryArray", sectionCommentsArray);

					sectionCommentsArray.forEach((sectionComment) =>
					{
						if (sectionComment.__vue__?.item?.resource != "link_comment")
						{
							processSectionEntry(sectionComment)
						}
					});
				}
				else if (settings.showAnimatedAvatars && mutation.addedNodes[0].matches("aside.profile-top"))
				{
					animatedAvatar(mutation.addedNodes[0]);
				}
				// LEFT SIDE CATEGORY MENU OPENED
				else if ((settings.mikroczatShowLeftMenuButton || settings.mikroczatShowLeftMenuLink) && mutation.addedNodes[0]?.matches("section.links"))
				{
					createLeftMenuButtons();
				}
			}
			else if (mutation.removedNodes.length > 0 && mutation.removedNodes[0] && mutation.removedNodes[0].nodeType === Node.ELEMENT_NODE)
			{
				// LEFT SIDE CATEGORY MENU CLOSED
				if ((settings.mikroczatShowLeftMenuButton || settings.mikroczatShowLeftMenuLink) && mutation.removedNodes[0]?.nodeType === Node.ELEMENT_NODE && mutation.removedNodes[0]?.matches("section.links"))
				{
					createLeftMenuButtons();
				}
			}

		});
	});



	if (settings.mikroczatShowLeftMenuButton || settings.mikroczatShowLeftMenuLink)
	{
		createLeftMenuButtons();
	}
	if (settings.mikroczatShowTopNavButton)
	{
		createNewNavBarButton({
			position: "left",
			// text: "Mikro<strong>czat</strong>",
			text: mikroczatButtonOpenLabel,
			title: mikroczatButtonOpenTitle,
			class: "open_mikroczat", 		// wykopx_open_mikroczat_li
			hideWithoutXStyle: false,
			//url: mikroczatDomain,
			url: "https://wykop.pl/czat",
			target: "_mikroczat",
			number: null,
		});
	}

















	// CONTENT LOADED
	let mainSection;


	document.addEventListener('readystatechange', (event) => 
	{
		if (dev) console.log('readyState:' + document.readyState);
		mainSection = document.querySelector('body > section');

		if (mainSection)
		{
			const sectionEntryArray = mainSection.querySelectorAll("section.entry[id]");

			// if (dev) console.log("sectionEntryArray", sectionEntryArray);
			sectionEntryArray.forEach((sectionEntry) =>
			{
				if (sectionEntry.__vue__?.item?.resource != "link_comment")
				{
					processSectionEntry(sectionEntry)
				}
			})
			const config = {
				childList: true,
				subtree: true,
			};

			observer.observe(mainSection, config);

			if (settings.showAnimatedAvatars)
			{
				const asideProfileTop = mainSection.querySelector("aside.profile-top");
				if (asideProfileTop) animatedAvatar(asideProfileTop);
			}
		}

	});



	function processSectionEntry(sectionEntry)
	{
		if (dev) console.log("processSectionEntry()", sectionEntry)

		if (!sectionEntry) return;

		if (settings.showAnimatedAvatars) animatedAvatar(sectionEntry);

		if (settings.showFavouriteButton) addFavouriteButton(sectionEntry);

		if (settings.entryVotersListEnable && sectionEntry?.__vue__?.item) 
		{
			if (dev) console.log("sectionEntry?.__vue__.item.id", sectionEntry?.__vue__.item.id);
			if (dev) console.log("sectionEntry.dataset?.votersLoaded", sectionEntry.dataset?.votersLoaded);

			if (sectionEntry.dataset?.votersLoaded == sectionEntry?.__vue__.item.id) return;
			if (sectionEntry?.__vue__.item.votes.up == 0)
			{
				removeVotersListWhenNoVoters(sectionEntry);
				return;
			}

			if (settings.entryVotersListExpandIfLessThan > 5 && sectionEntry?.__vue__.item.votes.up <= settings.entryVotersListExpandIfLessThan && sectionEntry?.__vue__.item.votes.up > 5) 
			{
				if (dev) console.log(`processSectionEntry() wybrano 💛throttledAddVotersList  ${sectionEntry.__vue__.item.id} | plusow: ${sectionEntry.__vue__.item.votes.up}`,)
				throttledAddVotersList(sectionEntry);
			}
			else
			{
				if (dev) console.log(`processSectionEntry() wybrano 🤎addVotersList  ${sectionEntry.__vue__.item.id} | plusow: ${sectionEntry.__vue__.item.votes.up}`,)
				addVotersList(sectionEntry)
			}
		}
	}


	function animatedAvatar(sectionEntry)
	{
		const image = sectionEntry.querySelector('a.avatar figure img'); // Replace with your actual selector
		if (image)
		{
			const currentSrc = image.getAttribute('src');
			if (currentSrc.endsWith('.gif'))
			{
				const modifiedSrc = currentSrc.replace(/,.*?\./, '.');
				image.setAttribute('src', modifiedSrc);
			}
		}
	}

	function removeVotersListWhenNoVoters(sectionEntry)
	{
		if (sectionEntry)
		{
			delete sectionEntry.dataset?.votersLoaded;
			sectionEntry.querySelector("section.entry-voters")?.remove();
		}

	}

	async function addVotersList(sectionEntry)
	{
		if (!sectionEntry || !sectionEntry.__vue__) return;
		if (sectionEntry.dataset?.votersLoaded == sectionEntry?.__vue__.item.id) return;

		if (sectionEntry?.__vue__ && sectionEntry?.__vue__.item.votes.up > 0)
		{
			if (sectionEntry?.__vue__ && settings.entryVotersListExpandIfLessThan > 5 && sectionEntry?.__vue__.item.votes.up <= settings.entryVotersListExpandIfLessThan && sectionEntry?.__vue__.item.votes.up > 5)
			{
				let entryId, commentId;
				if (sectionEntry?.__vue__?.item.resource == "entry") 
				{
					entryId = sectionEntry?.__vue__?.item.id;
				}
				else if (sectionEntry?.__vue__?.item.resource == "entry_comment") 
				{
					entryId = sectionEntry?.__vue__?.item.parent.id;
					commentId = sectionEntry?.__vue__?.item.id;
				}
				let voters = await fetchAllVotersFromAPI(entryId, commentId);

				appendVotersToEntry(sectionEntry, voters);

			}
			else
			{
				appendVotersToEntry(sectionEntry, sectionEntry?.__vue__?.item?.votes?.users);
			}
		}
	}

	function addFavouriteButton(sectionEntry)
	{
		if (sectionEntry && sectionEntry?.__vue__)
		{
			const sectionActionsUL = sectionEntry.querySelector("section.actions:not(:has(li.favourite)) > ul");
			if (!sectionActionsUL) return;

			let entryId, commentId;

			let isFavourite = sectionEntry?.__vue__?.item.favourite;

			if (sectionEntry?.__vue__?.item.resource == "entry") 
			{
				entryId = sectionEntry?.__vue__?.item.id;
			}
			else if (sectionEntry?.__vue__?.item.resource == "entry_comment") 
			{
				entryId = sectionEntry?.__vue__?.item.parent.id;
				commentId = sectionEntry?.__vue__?.item.id;
			}


			const favButtonLI = document.createElement("li");
			favButtonLI.classList.add("favourite", "icon", "icon-favourite");


			if (isFavourite) { favButtonLI.classList.add("active"); }
			const favButtonSpan = document.createElement("span");
			favButtonSpan.classList.add("favouriteButton");

			// VUE SENSITIVE
			/*
				data-v-90179052
			*/
			favButtonLI.setAttribute('data-v-90179052', '');
			favButtonSpan.setAttribute('data-v-90179052', '');

			favButtonSpan.dataset.isFavourite = isFavourite;
			favButtonSpan.dataset.entryId = entryId;
			if (commentId) favButtonSpan.dataset.commentId = commentId;
			if (settings.showFavouriteButtonLabel) favButtonSpan.innerText = `Ulubione`;
			favButtonLI.appendChild(favButtonSpan);

			const sharingElement = sectionActionsUL.querySelector(".sharing");
			if (sharingElement) sharingElement.insertAdjacentElement("afterend", favButtonLI);

		}

	}




	function appendVotersToEntry(sectionEntry, voters)
	{
		if (!sectionEntry) return;
		const divEditWrapperElement = sectionEntry.querySelector('article > div.edit-wrapper');
		if (!divEditWrapperElement) return;

		sectionEntry.dataset.votersLoaded = sectionEntry?.__vue__?.item.id;

		const fiveVoters = voters;

		if (!fiveVoters || fiveVoters.length < 1) return false;

		let sectionEntryVotersHTML = `<ul>`;

		fiveVoters.forEach(voter =>
		{
			sectionEntryVotersHTML += getListItemForUser(voter);
		});

		// <li class="more">
		if (sectionEntry?.__vue__?.item?.votes.up > settings.entryVotersListExpandIfLessThan && voters.length <= settings.entryVotersListExpandIfLessThan)
		{
			sectionEntryVotersHTML += `
				<li data-no-bubble="" class="more">
					<span data-votes-up="${sectionEntry?.__vue__?.item?.votes.up}"`;

			if (sectionEntry?.__vue__?.item.resource == "entry") 
			{
				sectionEntryVotersHTML += `data-entry-id="${sectionEntry?.__vue__?.item.id}"`;
			}
			else if (sectionEntry?.__vue__?.item.resource == "entry_comment") 
			{
				sectionEntryVotersHTML += `data-entry-id="${sectionEntry?.__vue__?.item.parent.id}"`;
				sectionEntryVotersHTML += `data-comment-id="${sectionEntry?.__vue__?.item.id}"`;
			}

			sectionEntryVotersHTML += `>+${sectionEntry?.__vue__?.item?.votes.up - 5} innych</span></li>`;
		}
		sectionEntryVotersHTML += `</ul>`;

		const sectionEntryVoters = document.createElement("section");
		sectionEntryVoters.classList.add("entry-voters");
		sectionEntryVoters.innerHTML = sectionEntryVotersHTML;

		const sectionEntryVotersElement = divEditWrapperElement.querySelector('section.entry-voters');

		if (sectionEntryVotersElement)
		{
			let parentElement = sectionEntryVotersElement.parentNode;
			parentElement.replaceChild(sectionEntryVoters, sectionEntryVotersElement);
		}
		else
		{
			const editWrapper = sectionEntry.querySelector(".edit-wrapper");
			if (editWrapper) editWrapper.appendChild(sectionEntryVoters);
		}
	}

	function getListItemForUser(voter)
	{
		let userHTML = `<li>
				<a href="/ludzie/${voter.username}" class="username`;

		userHTML += ` ${voter.color}-profile`; 		// orange-profile green-profile burgundy-profile
		userHTML += ` ${voter.status}`;				// active banned suspended removed
		userHTML += ` follow-${voter.follow}`;		// follow-true  follow-false
		userHTML += ` verified-${voter.verified}`;	// verified-false
		userHTML += ` blacklist-${voter.blacklist}`;// blacklist-true blacklist-false
		userHTML += ` online-${voter.online}`;		// online-true online-false

		userHTML += ` ${voter.gender}-gender`;		// m-gender, f-gender, null-gender
		if (voter.gender == "m") userHTML += ` male`;
		else if (voter.gender == "f") userHTML += ` female`;
		userHTML += `">`;


		if (settings?.votersFollow && voter.follow) userHTML += `<i class="follow-true" title="Obserwujesz tego użytkownika"></i>`;
		if (settings?.votersVerified && voter.verified) userHTML += `<i class="verified-true" title="Ten użytkownik jest zweryfikowany"></i>`;
		if (settings?.votersBlacklist && voter.blacklist) userHTML += `<i class="blacklist-true" title="Ten użytkownik jest na Twojej czarnej liście"></i>`;
		if (settings?.votersOffline && !voter.online) userHTML += `<i class="online-false" title="Ten uzytkownik jest teraz offline"></i>`;
		if (settings?.votersOnline && voter.online) userHTML += `<i class="online-true" title="Ten uzytkownik jest teraz online"></i>`;
		if (settings?.votersBanned && voter.status == "banned") userHTML += `<i class="banned" title="Użytkownik dostał bana. Z dodatkiem Wykop XS - Ban Info możesz szybko sprawdzić przyczynę i długość trwania bana."></i>`;
		if (settings?.votersSuspended && voter.status == "suspended") userHTML += `<i class="suspended" title="To konto jest w trakcie usuwania."></i>`;
		if (settings?.votersRemoved && voter.status == "removed") userHTML += `<i class="removed" title="Konto usunięte"></i>`;
		if (settings?.votersGenderM && voter.gender == "m") userHTML += `<i class="${voter.gender}-gender" title="Wpis od niebieskiego"></i>`;
		if (settings?.votersGenderF && voter.gender == "f") userHTML += `<i class="${voter.gender}-gender" title="Plus od różowej"></i>`;

		userHTML += `<span>${voter.username}</span>
				</a>
			</li>`;

		return userHTML;
	}


	/*
	<section data-v-6e6ed6ee="" data-v-2aacfeb5="" class="entry-voters">
		<ul data-v-6e6ed6ee="">
			<li data-v-6e6ed6ee="" class="">
				<a data-v-ed9f6c56="" data-v-6e6ed6ee="" href="/ludzie/NaczelnyAgnostyk" class="username orange-profile active">
					<span data-v-ed9f6c56="">
						NaczelnyAgnostyk<!---->
					</span>
				</a>
			</li>
			<li data-v-6e6ed6ee="" data-no-bubble="" class="more">
				<span data-v-6e6ed6ee="">+5 innych</span>
			</li>
		</ul>
	</section>
	*/

	function fetchAllVotersFromAPI(entryId, commentId)
	{
		if (dev) console.log(`fetchAllVotersFromAPI: ${entryId}, ${commentId}`)
		let apiURL = `https://wykop.pl/api/v3/entries/${entryId}/votes?page=1`
		if (commentId) apiURL = `https://wykop.pl/api/v3/entries/${entryId}/comments/${commentId}/votes`;

		return new Promise(async (resolve, reject) =>
		{
			await fetch(apiURL, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + window.localStorage.getItem("token"),
				},
			})
				.then((response) =>
				{
					if (!response.ok)
					{
						if (dev) console.log("HTTP error! status: ${response.status}");
						// throw new Error(`HTTP error! status: ${response.status}`);
					}
					return response.json();
				})
				.then(async (responseJSON) =>
				{
					resolve(responseJSON.data);

				}).catch((error) =>
				{
					if (error instanceof TypeError)
					{
						console.error('Network error:', error); // AWARIA SERWERA WYPOKU
					} else
					{
						console.error('Other error:', error);
					}
					reject(error);
				});
		});
	}

	function postFavouriteToAPI(favourite, resource, id)
	{
		let apiURL = `https://wykop.pl/api/v3/favourites`;
		const method = favourite ? "POST" : "DELETE";
		const body = {
			data: {
				type: resource,
				source_id: id
			}
		}

		return new Promise(async (resolve, reject) =>
		{
			await fetch(apiURL, {
				method: method,
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + window.localStorage.getItem("token"),
				},
				body: JSON.stringify(body)
			})
				.then((response) =>
				{
					if (!response.ok)
					{
						if (dev) console.log("HTTP error! status: ${response.status}");
						// throw new Error(`HTTP error! status: ${response.status}`);
					}
					return response.json();
				})
				.then(async (responseJSON) =>
				{
					resolve(responseJSON.data);

				}).catch((error) =>
				{
					if (error instanceof TypeError)
					{
						console.error('Network error:', error); // AWARIA SERWERA WYPOKU
					} else
					{
						console.error('Other error:', error);
					}
					reject(error);
				});
		});
	}

	// settings.addCommentPlusWhenVotingOnEntry, settings.addCommentPlusWhenVotingOnComment
	function postCommentPlus1ToAPI(sectionEntry)
	{
		if (!sectionEntry || !sectionEntry.__vue__) return;

		const resource = sectionEntry.__vue__.item.resource;
		let entryId;
		let authorUsername = sectionEntry.__vue__.item.author.username;
		if (resource === "entry")
			entryId = sectionEntry.__vue__.item.id;

		else if (resource === "entry_comment")
			entryId = sectionEntry.__vue__.item.parent.id;

		// TODO ZNALEZISKA
		let apiURL = `https://wykop.pl/api/v3/entries/${entryId}/comments`;
		const method = "POST";
		const body = {
			data: {
				"content": `@${authorUsername} [+](https://greasyfork.org/en/scripts/489949)1`,
				"adult": false
			}
		}
		/*
		"data": 
			{
				"content": "**foobar** __foobar__ [lorem](https://www.wykop.pl) impsum!!! #nsfw #wykop",
				"embed": "1fde707843ss3fbe9cb4eed0asdfsdfc64ab9a4df6084199b39d2",
				"photo": "e07843ss3fbe9cb4saeed0asdfsdfc64b9a4df6084199b39d2",
				"adult": false
				}
			}
		*/

		return new Promise(async (resolve, reject) =>
		{
			await fetch(apiURL, {
				method: method,
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + window.localStorage.getItem("token"),
				},
				body: JSON.stringify(body)
			})
				.then((response) =>
				{
					if (!response.ok)
					{
						if (dev) console.log("HTTP error! status: ${response.status}");
						// throw new Error(`HTTP error! status: ${response.status}`);
					}
					return response.json();
				})
				.then(async (responseJSON) =>
				{
					resolve(responseJSON.data);

				}).catch((error) =>
				{
					if (error instanceof TypeError)
					{
						console.error('Network error:', error); // AWARIA SERWERA WYPOKU
					} else
					{
						console.error('Other error:', error);
					}
					reject(error);
				});
		});
	}

	// li.more click
	document.addEventListener("click", async function (e)
	{
		if (e.target.closest("div.buttons button.plus"))
		{
			const sectionEntry = e.target.closest("section.entry[id]");
			if (sectionEntry.__vue__?.item?.voted == 1)
			{
				// if (settings.addCommentPlusWhenVotingOnEntry && sectionEntry && sectionEntry.__vue__?.item?.resource == "entry") 
				// {
				// 	postCommentPlus1ToAPI(sectionEntry);
				// }
				// else if (settings.addCommentPlusWhenVotingOnComment && sectionEntry && sectionEntry.__vue__?.item?.resource == "entry_comment")
				// {
				// 	postCommentPlus1ToAPI(sectionEntry);
				// }
			}
		}

		if (e.target.matches("li.more span"))
		{
			e.preventDefault();

			let sectionEntry = e.target.closest("section.entry");
			const entryId = e.target.dataset.entryId;
			const commentId = e.target.dataset.commentId;
			if (dev) console.log(`Wykop XS pobiera listę ${e.target.dataset.votesUp} plusujących`);

			e.target.closest("section.entry-voters").innerHTML = `<span>(Wykop X: wczytywanie ${e.target.dataset.votesUp} plusujących...)</span>`;

			let voters = await fetchAllVotersFromAPI(entryId, commentId);

			appendVotersToEntry(sectionEntry, voters);
			return;
		}

		if (e.target.matches("span.favouriteButton"))
		{
			e.preventDefault();
			if (e.target.dataset.isFavourite == "true")
			{
				if (e.target.dataset.commentId) postFavouriteToAPI(false, "entry_comment", e.target.dataset.commentId);
				else postFavouriteToAPI(false, "entry", e.target.dataset.entryId);
				e.target.parentElement.classList.remove("active");
				e.target.dataset.isFavourite = "false";

			}
			else if (e.target.dataset.isFavourite == "false")
			{
				if (e.target.dataset.commentId) postFavouriteToAPI(true, "entry_comment", e.target.dataset.commentId);
				else postFavouriteToAPI(true, "entry", e.target.dataset.entryId);
				e.target.parentElement.classList.add("active");
				e.target.dataset.isFavourite = "true";
			}
			return;
		}
	}, false);

















	/* CSS WYKOP XS MIKROCZAT */
	if (settings?.hideShareButton) CSS += `section.actions ul li.sharing 									{ display: none!important; }`;


	/* Wykop X Style 3 */
	CSS += `
		:root
		{
			--kolorBananowy1: rgba(255, 185, 0, 1);
			--tagChannelColor: rgba(0, 183, 255, 1);
			--pmChannelColor: rgba(255, 89, 23, 1);
			--smallBorderRadius: 4px;
		}
		div[data-modal="entryVoters"] section.entry-voters::after {content: none!important;} /* Wykop X Style PROMO */
	`;

	/* LISTA PLUSUJĄCYCH CSS, PRZYCISK DODAJ DO ULUBIONYCH*/
	if (settings?.entryVotersListEnable)
	{
		CSS += `
		/* Chrome 109, Firefox 115 */
			@supports not (display: block flex)
			{
				section.entry-voters ul
				{
					display: flex;
				}
			}

			section.entry-voters ul
			{
				display: block flex;
				row-gap: 0px;
				flex-wrap: wrap;
				align-items: baseline;
				padding: 0 0 0 0;
				margin: 0;
				margin-top: 8px;
				list-style-type: none;
				position: relative;
			}

			section.entry-voters ul,
			section.entry-voters > span
			{
				font-size: var(--entryVotersTextFontSize, 12px);
				color: var(--gullGray);
			}

			section.entry-voters ul::before
			{
				content: "Plusujący: ";
				margin-right: 0.2em;
			}

			section.entry-voters ul li.more
			{
				cursor: pointer;
				font-weight: 700;
				text-transform: uppercase;
			}

			section.entry-voters ul li::after
			{
				content: " • ";
				margin: 0px 0.2em 0px 0em;
			}

			section.entry-voters ul li.more::after,
			section.entry-voters ul li:only-child::after
			{ content: none; }

			section.entry-voters ul li a.username span
			{
				font-weight: normal;
			}

			section.entry-voters ul li a.username i 				{ display: none; font-size: 0.8em; font-style: normal; bottom: 0px; position: relative; }
			section.entry-voters ul li a.username i:has(+span) 		{ margin-right: 1px; }
			section.entry-voters ul li a.username i.follow-true,
			section.entry-voters ul li a.username i.blacklist-true,
			section.entry-voters ul li a.username i.banned ,
			section.entry-voters ul li a.username i.suspended,
			section.entry-voters ul li a.username i.removed,
			section.entry-voters ul li a.username i.f-gender,
			section.entry-voters ul li a.username i.m-gender
			{ display: inline flex;} 
			
			
			section.entry-voters ul li a.username i.follow-true::before 										{ content: '🔔'; }
			section.entry-voters ul li a.username i.blacklist-true::before 										{ content: '⛔'; }
			section.entry-voters ul li a.username i.banned::before 												{ content: '🍌'; }
			section.entry-voters ul li a.username i.suspended::before 											{ content: '✖'; }
			section.entry-voters ul li a.username i.removed::before 											{ content: '❌'; }
			section.entry-voters ul li a.username i.f-gender::before 											{ content: '🟣'; font-size: 0.7em; bottom: 3px; }
			
			section.entry-voters ul li:has(a.username) 															{ order: 6; }
			section.entry-voters ul li.more 																	{ order: 100; }
			`;

		if (settings?.votersFollowFirst) CSS += `section.entry-voters ul li:has(a.username.follow-true) 		{ order: 1; }`;
		if (settings?.votersBlackFirst) CSS += `section.entry-voters ul li:has(a.username.burgundy-profile) 	{ order: 3; }`;
		if (settings?.votersOrangeFirst) CSS += `section.entry-voters ul li:has(a.username.orange-profile) 		{ order: 4; }`;
		if (settings?.votersGreenFirst) CSS += `section.entry-voters ul li:has(a.username.green-profile) 		{ order: 5; }`;

		if (settings?.votersBlacklistLast) CSS += `section.entry-voters ul li:has(a.username.blacklist-true) 	{ order: 7; }`;
		if (settings?.votersBannedLast) CSS += `section.entry-voters ul li:has(a.username.banned) 				{ order: 8; }`;
		if (settings?.votersSuspendedLast) CSS += `section.entry-voters ul li:has(a.username.banned) 			{ order: 9; }`;
		if (settings?.votersRemovedLast) CSS += `section.entry-voters ul li:has(a.username.removed) 			{ order: 10; }`;

		if (!settings?.votersColorOrange) CSS += `section.entry-voters ul li a.username.orange-profile 			{ color: var(--gullGray); }`;
		if (!settings?.votersColorGreen) CSS += `section.entry-voters ul li a.username.green-profile 			{ color: var(--gullGray); }`;
		if (!settings?.votersColorBurgundy) CSS += `section.entry-voters ul li a.username.burgundy-profile 		{ color: var(--gullGray); }`;

		CSS += `
			section.entry-voters ul li a.username.banned:not(.removed) span  				{ color: var(--kolorBananowy1); };
			section.entry-voters ul li a.username.suspended:not(.removed) span 				{ color: var(--heather); }
			section.entry-voters ul li a.username.removed span 								{ color: var(--heather); }
			[data-night-mode] section.entry-voters ul li a.username.removed span 			{ background-color: rgba(255, 255, 255, 0.1); padding-left: 5px; padding-right: 5px; }
		`;
	}

	/* ULUBIONE */
	CSS += `
		section.actions > ul > li.favourite 
		{
			cursor: pointer;
			user-select: none;
			color: var(--gullGray);
			font-size: 14px;
			padding-left: 26px;
			transition: color .2s ease, opacity .2s ease;
		}

		.actions li.favourite span::before
		{
			content: '';
			width: 18px;
			height: 18px;
			display: block;
			position: absolute;
			left: 0;
			background: var(--gullGray);
			transition: background .2s ease;

			-webkit-mask-size: 18px 18px;
			mask-size: 18px 18px;
			-webkit-mask: url(/static/img/svg/favourite.svg) no-repeat center;
			mask-image: url(/static/img/svg/favourite.svg);
		}
		
		.actions li.favourite.active span::before 
		{
			background: var(--orange);
			-webkit-mask: url(/static/img/svg/favourite-filled.svg) no-repeat center;
			mask-image: url(/static/img/svg/favourite-filled.svg);
		}
	`;



	/* HIDE ADS ALWAYS */
	if (settings.hideAds) { CSS += `.pub-slot-wrapper { display: none!important; }`; }

	/* HIDE WYKOP XS PROMO FROM STYLUS */
	CSS += `.wykopxs, body div.main-content[class] section > section.sidebar::after  { display: none!important; }`;

	styleElement.textContent = CSS;
	document.head.appendChild(styleElement);
})();





















async function appendMultiAccounts()
{
	// MULTIKONTA START
	// let removeTrackers = ["BT_AA_DETECTION", "JTIyV3lrb3BYRW50cmllc0RyYWZ0cyUyMg==", "Y2F0ZWdvcmllcw==", "__amuidpb", "adagio", "btUserCountry", "btUserCountryExpiry", "btUserIsFromRestrictedCountry", "cto_bidid", "cto_bundle", "cto_dna_bundle", "justId", "justId_cst", "justId_exp", "justId_last", "spol_fp"]
	// removeTrackers.forEach((tracker) => window.localStorage.setItem(tracker, "wykopx"));

	const loggedUser = {};
	const topHeaderProfileButton = document.querySelector("body header > div.right > nav > ul > li.account a.avatar");
	if (!topHeaderProfileButton)
	{
		window.localStorage.removeItem(`username`);
	}
	else
	{
		loggedUser.username = topHeaderProfileButton.getAttribute("href").split('/')[2];

		if (loggedUser.username)
		{
			if (loggedUser.username == "%20")
			{
				if (window.location.href.startsWith("https://wykop.pl/connect/"))
				{

				}
				else
				{
					if (window.localStorage.getItem("token") == "null") window.localStorage.removeItem("token")
					if (window.localStorage.getItem("userKeep") == "null")
					{
						window.localStorage.removeItem("userKeep")
						window.reload();
					}

				}
			}
			else 
			{
				const urlParams = new URLSearchParams(window.location.search);
				if (dev) console.log("urlParams: ", urlParams);

				// OPERACJA "NOWE MULTI KONTO" - DETECT ?rtoken= FROM LOGING TO NEW_ACCOUNT
				if (urlParams.size > 0 && urlParams.has('token') && urlParams.has('rtoken'))
				{
					// WAIT
					await new Promise(resolve => setTimeout(resolve, 500));

					const token = urlParams.get('token');
					const rtoken = urlParams.get('rtoken');
					const username = urlParams.get('username');
					if (username) window.localStorage.setItem("username", username);

					window.localStorage.setItem("token", token);
					window.localStorage.setItem("userKeep", rtoken);

					urlParams.delete('token');
					urlParams.delete('rtoken');
					urlParams.delete('username');
					urlParams.delete('XD');

					// WAIT
					await new Promise(resolve => setTimeout(resolve, 100));

					window.location.search = urlParams.toString();

					newMultiUser(username, token, rtoken);
				}


				let multiUsersArray = getMultiUsersArray();
				if (dev) console.log("multiUsersArray", multiUsersArray);


				// TWORZENIE LISTY <SELECT>
				const searchLi = document.querySelector("body header.header > div.right > nav");
				const select = document.createElement("select");
				select.id = "wykopxs-multikonta-select";

				// <option> PUSTE </option>
				const optionEmpty = document.createElement("option");
				optionEmpty.textContent = "";
				optionEmpty.value = "---";
				select.appendChild(optionEmpty);



				if (multiUsersArray.length > 0)
				{
					// LISTA UŻYTKOWNIKÓW - PRZEŁĄCZ
					const userGroup = document.createElement("optgroup");
					userGroup.label = "Przeloguj:";

					// LISTA UŻYTKOWNIKÓW - USUŃ Z MULTILISTY
					const userGroupRemove = document.createElement("optgroup");
					userGroupRemove.label = "Usuwanie z listy:";

					for (username of multiUsersArray)
					{
						const optionUser = document.createElement("option");
						optionUser.value = `account-${username}`;
						optionUser.textContent = `Przełącz na @${username}`;
						userGroup.appendChild(optionUser);

						const optionUserRemove = document.createElement("option");
						optionUserRemove.value = `remove-account-${username}`;
						optionUserRemove.textContent = `Usuń konto @${username} z listy`;
						userGroupRemove.appendChild(optionUserRemove);
					}
					select.appendChild(userGroup);
					select.appendChild(userGroupRemove);

				}

				// <optgroup>USTAWIENIA</optgroup>
				const settingsGroup = document.createElement("optgroup");
				settingsGroup.label = "Ustawienia";

				if (!multiUsersArray.includes(loggedUser.username))
				{
					// ZAPISZ TO KONTO JAKO MULTIKONTO
					const optionAddNew = document.createElement("option");
					optionAddNew.textContent = `+ Zapisz multikonto @${loggedUser.username}`
					optionAddNew.value = "save_this_account_as_multi";
					settingsGroup.appendChild(optionAddNew);
				}


				// RESTARTOWANIE WYKOPU
				const optionRestart = document.createElement("option");
				optionRestart.textContent = `Restartuj wykop`;
				optionRestart.value = "restart";
				settingsGroup.appendChild(optionRestart);

				// DODAWANIE NOWEGO MULTIKONTA
				const optionAddNew = document.createElement("option");
				optionAddNew.textContent = `Dodaj inne multikonto`;
				optionAddNew.value = "add_another_account";
				settingsGroup.appendChild(optionAddNew);

				select.appendChild(settingsGroup);

				searchLi.parentNode.insertBefore(select, searchLi.nextSibling);






				// SELECT OPTION EVENT LISTENER
				select.addEventListener("change", function (event)
				{
					const selectedOption = event.target.value;

					if (selectedOption === "save_this_account_as_multi")
					{
						window.location.href = "https://wykopx.pl/(－‸ლ)";
					}

					else if (selectedOption.startsWith("remove-account-"))
					{
						const username = selectedOption.replace("remove-account-", "");
						if (username)
						{
							removeMultiUserFromLocalStorage(username)
						}
					}
					// PRZEŁĄCZANIE POMIĘDZY MULTIKONTAMI
					else if (selectedOption.startsWith("account-"))
					{
						const username = selectedOption.replace("account-", "");
						if (username)
						{
							window.localStorage.setItem("username", username)
							const multiRtoken = window.localStorage.getItem(`userKeep-${username}`);
							if (multiRtoken && multiRtoken !== "null") window.localStorage.setItem("userKeep", multiRtoken);
							const multiToken = window.localStorage.getItem(`token-${username}`)
							if (multiToken && multiToken !== "null") window.localStorage.setItem("token", multiToken);
							window.location.reload();
						}
					}
					else if (selectedOption === "restart" || selectedOption === "add_another_account")
					{
						window.localStorage.removeItem("token")
						window.localStorage.removeItem("userKeep");
						window.localStorage.removeItem("username");
						window.location.href = `https://wykopx.pl/(－‸ლ)/?&ch=${window.location.href}`;
					}
				});



				// ["WykopX", "NadiaFrance", "MondryPajonk"]
				function getMultiUsersArray()
				{
					const multiUsersString = window.localStorage.getItem("multiUsers");
					if (multiUsersString) return multiUsersString.split(",");
					return [];
				}
				function setMultiUsersFromArray(usersArray)
				{
					window.localStorage.setItem("multiUsers", usersArray.join(","));
				}
				function removeMultiUserFromLocalStorage(username_to_remove)
				{
					let array = getMultiUsersArray();
					array = array.filter(value => value !== username_to_remove);
					setMultiUsersFromArray(array);

					window.localStorage.removeItem(`userKeep-${username_to_remove}`);
					window.localStorage.removeItem(`token-${username_to_remove}`);
					window.localStorage.removeItem(`username-${username_to_remove}`);

					const currentUser = window.localStorage.getItem("username");

					if (currentUser === username_to_remove)
					{
						if (array.length > 0)
						{
							window.localStorage.setItem(`username`, array[0]);
							window.localStorage.setItem(`token`, array[0]);
							window.localStorage.setItem(`userKeep`, array[0]);
						}
					}

					const selectElement = document.getElementById("wykopxs-multikonta-select")
					selectElement.querySelector(`option[value="remove-account-${username_to_remove}"]`)?.remove();
					selectElement.querySelector(`option[value="account-${username_to_remove}"]`)?.remove();

				}


				function newMultiUser(username, token, rtoken)
				{
					if (dev) console.log("newMultiUser", username, rtoken);
					const array = getMultiUsersArray();
					if (dev) console.log("newMultiUser, array: ", array);
					const uniqueUsers = new Set(array);
					uniqueUsers.add(username);  // Set automatically ignores duplicates
					setMultiUsersFromArray(Array.from(uniqueUsers));
					// window.localStorage.setItem(`username`, username);
					window.localStorage.setItem(`token-${username}`, token);
					window.localStorage.setItem(`userKeep-${username}`, rtoken);
					window.localStorage.setItem(`username-${username}`, username);
				}

			}
		}
	}
	// MULTIKONTA END



}



window.addEventListener('pageshow', async () =>
{
	// WAIT
	await new Promise(resolve => setTimeout(resolve, 500));
	await appendMultiAccounts();
});



// window.addEventListener('load', elo);
// window.addEventListener('popstate', openGitHubSidebar);
// window.addEventListener('hashchange', openGitHubSidebar);
// window.addEventListener('pagehide', openGitHubSidebar);
// window.addEventListener('beforeunload', openGitHubSidebar);
// window.addEventListener('unload', openGitHubSidebar);
if (window.navigation)
{
	window.navigation.addEventListener('navigate', function ()
	{

	});
}