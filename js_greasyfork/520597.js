// ==UserScript==
// @name		 PMO filter and Website-related task reminder / Web backlog
// @namespace	adventuretc
// @version	  22
// @description  PMO filter and Website-related task reminder / Web backlog with alerts and word based url filters. Hides explicit images and blurs certain pages based on keywords and URLs.
// @author	   adventuretc
// @match		http://*/*
// @match		https://*/*
// @exclude 	https://*.captcha.net/*
// @exclude 	https://*.recaptcha.net/*
// @icon		 data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant		GM_addStyle
//// @run-at document-start
// @run-at document-body
//// @run-at document-end
// @license	MIT


// @downloadURL https://update.greasyfork.org/scripts/520597/PMO%20filter%20and%20Website-related%20task%20reminder%20%20Web%20backlog.user.js
// @updateURL https://update.greasyfork.org/scripts/520597/PMO%20filter%20and%20Website-related%20task%20reminder%20%20Web%20backlog.meta.js
// ==/UserScript==

// dokumentáció ehhez a fenti run-at-hez:
// https://www.tampermonkey.net/documentation.php?locale=en
// Van oylan weboldal ahol a @run-at document-start jól működik pl. wikipédia de van ahol elhasal és hibába ütközik és nem fut le a scriptem pl. wmn.hu (nem létezik a body element) amikor megpróbálja elérni a script.

(function() {
	'use strict';
	
	main();
	
	// USER-MODIFYABLE KAPCSOLÓK:
	// Ha ki akarnád kapcsolni a scriptet akkor ne az egészet kapcsold ki hanem csak a szükséges részeit. (pl. ha vagyaim.hu-ra mész akkor a szöveget el akarhatod olvasni de a képeket nem akarod látni továbbra sem, akkor ez jó opció.)
	const hide_images = true;
	const hide_all_text = true;
	
	
	// A teszt oldal ez legyen:
	//	https://wmn.hu/wmn-ugy/foot
	//	https://wmn.hu/wmn-ugy/naked
	// stb.
	
	
	// Concept:
	// Háromféle weboldal létezik számomra.
	// Van olyan weboldal, mint pl wikipédia,reddit,notino,dm,rossmann, gyakorikerdesek.hu,https://gate.shop/,telex.hu,index.hu (ezt sima url.includes() fv-el azonosítsuk, if any of them is included in the DOMAIN part of the current url then it's a match AND IF....), ahová gyakran megyek de ritkán triggerelő tartalom is szembe jön, vannak számomra triggerelő lapok (match these by a list of regex expressions, if any of them matches the url, then it's a match) és képek is vannak rajta és nem lehet letiltani máshogy, csak így, scriptekkel és teljesen el akarom rejteni őket.
		// A wikipédián a képi és a szöveges tartalom is triggerelő tapasztalatom szerint, ha olyan a cikk ami arról szól.
		// gyakorikerdesek-en csak a szöveges tartalom.
		// Ezeken a lapokon figyelmeztessük popuppal és header sávval és rejtsük el a képeket (0px-esre állítsd őket), és a szöveges tartalmat tartsuk meg.
	// Van ami vásároló weboldal: dm.hu, rossmann.hu, instagram.com (ezt sima url.includes() fv-el azonosítsuk, if any of them is included in the DOMAIN string of the current url then its a match) ahová ritkán megyek de gyakran van triggerelő tartalom és az az url alapján sokszor azonosítható de néha nem, és emiatt ezekre külön kell egy figyelmeztetés a weblap tetején, hogy figyeljek oda mert könnyen lehet egy kép itt-ott ami triggerelő.
		// Ezeken a weboldalakon (minden aloldalon és a főoldalon is) figyelmeztessük popuppal és header sávval de ne rejtsük el a képeket, sem a szöveges tartalmat.
	// Van ami egy egyértelműen pornóra használt weboldal, akár a domain-ből akár a / utáni részből ítélve állapítottam meg. Ezekre külön bánásmód kell. (match these by both a list of regex expressions, if any of them matches the url, then it's a match, and a list of domain names, if any of those is included in the DOMAIN part of the current url then it's a match) 
		// Ezeken a weboldalakon figyelmeztessük popuppal és header sávval és rejtsük el a képeket, és a szöveges tartalmat és az egész weboldalra tegyünk egy 100%-os fekete szűrőt és arra még egy képet is ami a viewport 75%-át teszi ki széltében (egy megnyugtató kellemes kép).
		// Ez legyen a kép, és legyen rajta egy felirat is:
		// https://images.unsplash.com/photo-1664009369177-072a596d69c0?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
		// A felirat alatta: "How can I be more productive?"
		
		
	// ● csináld meg, hogy ha megváltozik az URL (azaz SPA-val) akkor újra lefusson az egész userscript.:
	// Kipróbáltam és működik. Ez előtt nem működött amikor pl. eg youtube videóról a youtube kereső oldalára navigáltam. Most igen.
	    let lastUrl = location.href;

	    // Figyeljük a történelmi eseményeket (pl. SPA oldalaknál)
	    const pushState = history.pushState;
	    const replaceState = history.replaceState;

	    function checkUrlChange() {
		if (location.href !== lastUrl) {
		    console.log("URL változott:", location.href);
		    lastUrl = location.href;
		    main();
		}
	    }

	    history.pushState = function(...args) {
		pushState.apply(this, args);
		checkUrlChange();
	    };

	    history.replaceState = function(...args) {
		replaceState.apply(this, args);
		checkUrlChange();
	    };

	    window.addEventListener('popstate', checkUrlChange);

	    // MutationObserver a DOM figyelésére, ha más módszerekkel is változik az URL
	    const observer = new MutationObserver(checkUrlChange);
	    observer.observe(document.body, { childList: true, subtree: true });


		
		async function main()
		{
			// but please don't run in iframes
			// Ellenőrizzük, hogy nem iframe-ben fut-e
			if (window.self !== window.top) {
				return; // Kilépés, ha iframe-ben fut
			}
			
			setTimeout(main_fast, 0 * 1000);
			setTimeout(main_slow, 7 * 1000);
			
		}
		async function main_fast()
		{
			// Ezek a site fajták nem mutually exclusive-ok, egy domain benne lehet több listában is.
			
			// Define URL and domain lists
			const frequentSiteDomainsList = [
				'wikipedia.org', 'wikimedia', 'reddit.com', 'notino.com', 'dm.hu',
				'rossmann.hu',
				'gyakorikerdesek.hu',
				'gate.shop',
				'telex.hu',
				'index.hu'
				// TODO írd meg ezeket.
			];

			const triggeringSubdirectoriesOrPagesPathRegex = [
				/(BDSM|Master|Slave|Dyke|Bondage|Dominant|Dominance|Submissive|submission|Top|Bottom|Versatile|Switch|genital|penis|vagina|breast|naked|nude|lesbian|woman|girl|sexual|sex|szex|intersex|sissy|(\b|_)porn(\b|o|_|ó)|hypno|autogyne|dildo|vibrator|masturbat|anal|sybian|erotic|Autoeroticism|Autocunnilingus|Autofellatio|kink|fantasy|oral|Fellatio|Partialism|worship|erogenous|Human_back|foot[\b|_]|feet[\b|_]|high.?heel(s|ed|)|Navel|Axilla|armpit|Dimple|Sacral_dimple|fetish|fetishism|roleplay|[\b|_]arousal|Human_breasts|buttock|buttocks|Female|bodybuilding|bodybuilder|Facesitting|Paraphilia|[\b|_]hair[\b|_]|shibari|spanking|fashion|beauty|anorexia|pucer|meztelen|beyonce|hetero|homo|meleg|bisex|biszex|transz|szexualitas)/i,
				/anyaszuelt/i, 
				/anyaszült/i, 
				/anyaszult/i, 
				/barefoot/i, 
				/barefeet/i, 
				/Grammy/i, 
				/heels/i, 
				/waxing/i, 
				/shave/i, 
				/shaved/i, 
				/shaving/i, 
				/DqPd6MShV1o/i, /Sissy/i, /chastity/i,
				/magasarku/i, /magas(.|)sark(u|ú|.)/i,
				/pedicure/i,
				/analbot/i,
				/feminize/i,
				/feminization/i,
				/feminine/i,
				/femininity/i,
				/pedikur/i,/pedikűr/i,
				/analbotok/i,
				/shemale/i, /\.com\/sissy/i, 
				/toe(.|)ring(s|)/i,
				/sarkak/i, /sarkakon/i, 
				/borkemenyedes/i,
				/labapolas/i, /lábápolás/i, /sarokápolás/i, /sarokapolas/i,
				/butt(.|)plug/i, /easytoys/i, /erotika/i,
				
				// E vonal fölött a heavy triggerek vannak, allatta a light.
				
				/nails|[\b|_]korom|köröm|smink|make(.|)up/i,
				/essence/i, /essie/i,
				/koermoek/i,
				/manikur/i, /mitesszer/i,
				/kormok/i,
				/körmök/i,
				/körömlakk/i,
				/koromlakk/i,
				/koeroemlakk/i, 
				/nail(.|)polish/i,
				/k%C3%B6r%C3%B6m/i, /k%C3%B6r%C3%B6mlakk/i, 
				/korom/i, 
				/mukorom/i,/műköröm/i,/manikur/i,/manikűr/i,/manicure/i,
				/rimmel/i,
				/lány|lányok|(\b|_)lany|lany(\b|_)|lanyok/i,
				/szepseg/i, 
				/divat/i, 
				/borapolas/i, 
				/hajapolas/i, 
				/ruhak/i, 
				/ruhák/i, 
				/clothes/i, 
				/clothing/i, 
				/MakeupAddiction/i
				// TODO írd meg ezeket.
				
				// Regex-ben a \b karakter egy non-word karaktert jelent de csak a boundary tehát magát a karaktert nem kapja el hanem úgy mint a ^ és $ csak jelzi, hogy jönni fog. Viszont van benne egy nagy hiba: A _ jel is a szavak részének számít a Regex csapat szerint (azon kívül csak az alfanum karakterek tartoznak oda). Szerintem meg nem. Erre van egy workaround szerintem: a \b helyett használj [\b|_] -t. Kipróbáltam és működik.
				// Ezeket mind match-eli:
				// foot
				// _foot
				// M_foot
				// f: 
				// https://www.regular-expressions.info/wordboundaries.html
				// https://www.freecodecamp.org/news/what-does-b-in-regex-mean-word-boundary-and-non-word-boundary-metacharacters/#heading-how-to-use-the-non-word-boundary-b-metacharacter
				
				
				// A ? karakter az utolsó említett karaktert opcionálissá teszi, akkor is matchel ha nincs ott az. Ha előtte egy . wildcard van akkor az karakter bármi lehet pl. - vagy + jel is az URL-ben.
			];

			const shoppingSiteOrHardToFilterByUrlTypeOfSiteDomainList = [
				'dm.hu',
				'rossmann.hu',
				"femcafe.hu",
				"wmn.hu",
				'gate.shop', // this has to be in both lists, sorry.
				'instagram.com'
				// TODO írd meg ezeket.
			];

			const pornDomainsList = [
				'examplepornsite.com',
				"hypnotube.com", "xhamster.com", "redgifs.com", "pornhub.com", "givemeaporn.com","lesbianpornvideos.com","xvideos", "redtube.com", "redtube",
				"vagyaim.hu", // ez szxjáték vásárló oldal
				"erotikashow.hu", // ez szxjáték vásárló oldal
				"szeresdmagad.hu", // ez szxjáték vásárló oldal
				"sextreme",
				 "giphy.com", "hypnotube", "pornhub", "xhamster", "xnxx.com", "xvideos", "smpixie.com", "fetlife.com", "redtube", 
				
				
				"tumblr.com" // 90%-ban valami rossz kerül elém ha ezt látom az url sávban.
				// TODO írd meg ezeket.
			];

			const pornPathRegex = [
				/(BDSM|Master|Slave|Dyke|Bondage|Dominant|Dominance|Submissive|submission|Top|Bottom|Versatile|Switch|genital|penis|vagina|breast|naked|nude|lesbian|woman|girl|sexual|sex|szex|intersex|sissy|(\b|_)porn(\b|o|_|ó)|hypno|autogyne|dildo|vibrator|masturbat|anal|sybian|erotic|Autoeroticism|Autocunnilingus|Autofellatio|kink|fantasy|oral|Fellatio|Partialism|worship|erogenous|Human_back|foot[\b|_]|feet[\b|_]|high.?heel(s|ed|)|Navel|Axilla|armpit|Dimple|Sacral_dimple|fetish|fetishism|roleplay|[\b|_]arousal|Human_breasts|buttock|buttocks|Female|bodybuilding|bodybuilder|Facesitting|Paraphilia|[\b|_]hair[\b|_]|shibari|spanking|fashion|beauty|anorexia|pucer|meztelen|beyonce|hetero|homo|meleg|bisex|biszex|transz|szexualitas)/i,
				/anyaszuelt/i, 
				/anyaszült/i, 
				/anyaszult/i, 
				/barefoot/i, 
				/barefeet/i, 
				/Grammy/i, 
				/heels/i, 
				/waxing/i, 
				/shave/i, 
				/shaved/i, 
				/shaving/i, 
				/DqPd6MShV1o/i, /Sissy/i, /chastity/i,
				/magasarku/i, /magas(.|)sark(u|ú|.)/i,
				/pedicure/i,
				/analbot/i,
				/feminize/i,
				/feminization/i,
				/feminine/i,
				/femininity/i,
				/pedikur/i,/pedikűr/i,
				/analbotok/i,
				/shemale/i, /\.com\/sissy/i, 
				/toe(.|)ring(s|)/i,
				/sarkak/i, /sarkakon/i, 
				/borkemenyedes/i,
				/labapolas/i, /lábápolás/i, /sarokápolás/i, /sarokapolas/i,
				/butt(.|)plug/i, /easytoys/i, /erotika/i,
				
				// A fölöttem lévő rész másolva van fentről.
				
				// Ez az egyedi rész:
				/xxx/i,
				/r\/sissyhypno/i,
				/r\/sissy/i,
				/Sissy/,/SissyChastity/i,
				/SissyInspiration/i,
				/Sissies/i,
				/SmallDickGirls/i
				// TODO írd meg ezeket.
			];

			// Function to detect current site type
			function detectSiteType()
			{
				const currentUrl = window.location.href;
				const currentDomain = window.location.hostname;

				// Check for shopping sites
				if (shoppingSiteOrHardToFilterByUrlTypeOfSiteDomainList.some(site => currentDomain.includes(site)))
				{
					showWarningAlert('Figyelem! Itt könnyen lehet triggerelő képi tartalom. Ezek csak emlékeztetők. A végső akaratot neked kell beletenni.');
					showWarningAlert(`Ezen a weboldalon korábban már megtörtént, hogy egy fő triggerelő tényező volt és 3 nap alatt elvezetett a kiv-hez és utána borzasztóan megbántam, hogy egyáltalán megnyitottam. Tanulj a hibáidból vagy újra megtörténnek. Elrejtettem neked a képeket.`);
					
					
					if (triggeringSubdirectoriesOrPagesPathRegex.some(regex => regex.test(currentUrl)))
					{
						hideImages();
						
						blockViaOverlay("green");
						
						
						
						showWarningAlert('Ez az aloldal tartalmazhat triggerelő szöveges és/vagy képi tartalmat. Ezek csak emlékeztetők. A végső akaratot neked kell beletenni.');
						showWarningAlert(`Ezen a weboldalon korábban már megtörtént, hogy egy fő triggerelő tényező volt és 3 nap alatt elvezetett a kiv-hez és utána borzasztóan megbántam, hogy egyáltalán megnyitottam. Tanulj a hibáidból vagy újra megtörténnek. Elrejtettem neked a képeket.`);
					}
				}
				
				// Mivel ezek a site fajták nem mutually exclusive-ok ezért nem else if hanem mindig csak if kell legyen ezeknél az állításoknál.
				
				// Check for frequent sites
				if (frequentSiteDomainsList.some(site => currentDomain.includes(site)))
				{
					if (triggeringSubdirectoriesOrPagesPathRegex.some(regex => regex.test(currentUrl)))
					{
						hideImages();
						
						blockViaOverlay("green");
						
						
						
						showWarningAlert('Ez az aloldal tartalmazhat triggerelő szöveges és/vagy képi tartalmat. Ezek csak emlékeztetők. A végső akaratot neked kell beletenni.');
						showWarningAlert(`Ezen a weboldalon korábban már megtörtént, hogy egy fő triggerelő tényező volt és 3 nap alatt elvezetett a kiv-hez és utána borzasztóan megbántam, hogy egyáltalán megnyitottam. Tanulj a hibáidból vagy újra megtörténnek. Elrejtettem neked a képeket.`);
					}
				}

				// Check for porn sites
				if (pornDomainsList.some(site => currentDomain.includes(site)) || pornPathRegex.some(regex => regex.test(currentUrl)))
				{
					hideImages();
					
					blockViaOverlay("image");
					
					showWarningAlert('Ez egy pornográf tartalmú weboldal! Ezek csak emlékeztetők. A végső akaratot neked kell beletenni.');
				}
			}
			
			detectSiteType();
			
			
			
			const regexPatterns = [
				
			];
			

			const urlBlacklist = [
			];

			const warningSites = [
			];
			//példák ami problémás: wmn.hu/wmn-szex

			// Check if the current URL matches any regex patterns
			if (regexPatterns.some(pattern => pattern.test(location.href))) 
			{
				hideImages();
				addWarningBanner("Tartsd be a Youtube és generikus THUMBNAIL szabályt (nyomj F5-öt ha elfelejtetted).");
				showWarningAlert(`Ezen a weboldalon korábban már megtörtént, hogy egy fő triggerelő tényező volt és 3 nap alatt elvezetett a kiv-hez és utána borzasztóan megbántam, hogy egyáltalán megnyitottam. Tanulj a hibáidból vagy újra megtörténnek. Elrejtettem neked a képeket.`);
			}

			// Check if the current URL is in the explicit blacklist
			if (urlBlacklist.some(pattern => pattern.test(location.href))) 
			{
				hideImages();
				addWarningBanner("Tartsd be a Youtube és generikus THUMBNAIL szabályt (nyomj F5-öt ha elfelejtetted).");
				showWarningAlert(`Ezen a weboldalon korábban már megtörtént, hogy egy fő triggerelő tényező volt és 3 nap alatt elvezetett a kiv-hez és utána borzasztóan megbántam, hogy egyáltalán megnyitottam. Tanulj a hibáidból vagy újra megtörténnek. Elrejtettem neked a képeket.`);
			}

			// Check if the current URL is in the warning list
			if (warningSites.some(pattern => pattern.test(location.href)))
			{
				addWarningBanner("Tartsd be a Youtube és generikus THUMBNAIL szabályt (nyomj F5-öt ha elfelejtetted).");
				showWarningAlert(`Ezen a weboldalon korábban már megtörtént, hogy egy fő triggerelő tényező volt és 3 nap alatt elvezetett a kiv-hez és utána borzasztóan megbántam, hogy egyáltalán megnyitottam. Tanulj a hibáidból vagy újra megtörténnek. Elrejtettem neked a képeket.`);
			}
			async function hideImages()
			{
				if (hide_images)
				{
					GM_addStyle(`img { 
						width: 0 !important;
						max-width: 0 !important;
						display: none !important;
						filter: contrast(0.00) !important;
						filter: opacity(0) !important;
					 }`);
					 // Sajnos bármit írsz ide azt lent overrideolni kell az image beillesztésénél is.
					
					// Azért van több mint 1 állítás mert bizonyos weboldalakon van egy nagyon specifikus CSS szabály és még important is van rajta és ott felülírja az a szabály az enyémet és látható marad a kép.
					// A blur() és opacity() filtert is ajánlom és a display: none; !important; -ot.
					//Később ha majd támogat a böngésződ ilyet akkor ezt is hozzá lehet adni:
					//https://developer.mozilla.org/en-US/docs/Web/CSS/image-resolution
					//image-resolution: 100dppx;
				}
			}
			async function showWarningAlert(message)
			{
				// force redraw document:
				await new Promise(r => setTimeout(r, 100));

				alert(message);
			}

			async function addWarningBanner(message)
			{
				const banner = document.createElement('div');
				banner.textContent = message;
				banner.style.position = "fixed";
				banner.style.top = "0";
				banner.style.left = "0";
				banner.style.width = "100%";
				banner.style.backgroundColor = "#ff1111"; // Red background
				banner.style.color = "#000"; // Black text
				banner.style.fontSize = "16px";
				banner.style.fontWeight = "bold";
				banner.style.textAlign = "center";
				banner.style.padding = "4px 0";
				banner.style.zIndex = "9999"; // Ensure it stays on top 
				banner.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
				banner.style.animation = "blinker 10s linear infinite";
				

				document.body.prepend(banner);
				GM_addStyle(`
					@keyframes blinker {
						50% { opacity: 0; }
					}

					body { margin-top: 10px; }
				`); // Adjust to prevent content overlap 

				// Ez itt a GreyCamo Wikipedia userstyle tartalma:
				GM_addStyle(`
				.mw-body-content, #mw-page-base
				{
				/* line-height: 1.6; */
				font-size: 1rem !important;
				/* background: -moz-default-background-color !important; */
				background: url("https://static.vecteezy.com/system/resources/previews/000/106/939/non_2x/free-grey-camouflage-vector.jpg") !important;
				color: -moz-default-color !important;
				}`);
				
								
				//ez sem rossz megközelítés:
				// Function to display warnings
				//function showWarning(message, hideImagesFlag) {
					//alert(message);
					//const header = document.createElement('div');
					//header.style.background = 'red';
					//header.style.color = 'white';
					//header.style.padding = '10px';
					//header.style.position = 'fixed';
					//header.style.top = '0';
					//header.style.width = '100%';
					//header.style.zIndex = '9999';
					//header.innerText = message;
					//document.body.prepend(header);

					//if (hideImagesFlag) hideImages();
				//}

				 //Function to hide images
				//function hideImages() {
					//document.querySelectorAll('img').forEach(img => img.style.height = '0px');
				//}
			}
			
			
			const words = [
			// pornó szavak voltak itt.
			];
	
			// hozzáadtam ezt: https://www.youtube.com/watch?v=DqPd6MShV1o&list=WL
				// indoklása: /home/xy/Dokumentumok/szakértelem/pornó és maszturbálás/assets/linkek, triplán gondold át mielőtt megnyitod.d

			const containsWord = words.some(word =>  location.href.includes(word));
			
			if 
			(
				containsWord
			)
			{
				// chatgpt-vel:
				
				
				blockViaOverlay("image")
				
				{
				


				alert(`SZABÁLY
SZABÁLY

Listen to the panic button CBT folder right now or else you will regret it.
		
Also read the #mesterterv fájl --> #pánik gomb PDF section.

I avoid visiting shoe sites.
I know visiting such sites poses a high risk of relapsing.
Amikor 20 napos libidóm van, ránézni egy női cipőre amit akár csak véletlenül ad fel a weboldal alul a related találatok közt, egy papucs vagy magassarkú, számomra borzasztó erős inger és gyakran a fő trigger egy masturbation spree kezdetekor. 
Csak úgy sikerülhet a M-ről való lemondásod ha nem látogatsz meg cipő oldalakat, beleértve a Nike és Puma papucs oldalakat. Ezeknél nagyon szépen kérd meg anyát és delegáld neki a feladatot, tehát hogy 46-ost kérsz és vegye meg.

kelt: 2024-12-05, és előtte legalább 4 alkalommal.

SZABÁLY
SZABÁLY`);

		alert(`2024-12-05

	- Aznap délután körül a Puma papucs linkek lementésekor az ecipo.hu-ra keveredtem és egy hirtelen gondolattól vezérelve a nőiekre kattintottam és aközt elkezdtem böngészi, és rákerestem a méretem stb. és találtam jól kinéző magassarkú papucsokat, és azt lementettem magamnak,, és elkezdtem tovább keresni cipőket és azokat is. Ez egy határozott trigger volt mert erősen feliz gatott hormonálisan.
	{
		/home/xy/Dokumentumok/élet/öltözködés/outfitek (akarom ezeket)/.elsorvasztási trash mappa/.burn your fucking boats, ez az anyag már 2x triggerelt/2024-10-21-i erős want, új korszak, értem magam/leírása.d
				
		● Ezt fixáld: Legyen az ecipo.hu női részére egy ilyen warning, hogy ne menj oda mert 95% az esélye, hogy kiv. lesz a vége, még aznap vagy másnap, a hormonok felmenése miatt.
	}`);
	
				}
			}
			if 
			(
				(location.href.startsWith("https://ecipo.hu/c/noi"))
				|| (location.href.startsWith("https://ecipo.hu/p/flip-flop"))
				|| (location.href.startsWith("https://ecipo.hu/p/papucs-"))
				|| (location.href.startsWith("https://ecipo.hu/c/sportcipok/noi"))
				|| (location.href.startsWith("https://ecipo.hu/c/noi/tusarku-cipok"))
				|| (location.href.startsWith("https://ecipo.hu/c/noi/papucsok-es-vietnami-papucsok"))
				|| (location.href.startsWith("https://ecipo.hu/c/noi/szandalok"))
				|| (location.href.startsWith("https://ecipo.hu/c/noi/espadrilles"))
				|| (location.href.startsWith("https://ecipo.hu/"))
				|| (location.href.startsWith("https://ccc.eu/hu/promo/szezonkozi-leertekeles"))
				|| (location.href.startsWith("https://ccc.eu/hu/noi/"))
				|| (location.href.startsWith("https://ccc.eu/"))
				|| (location.href.startsWith("https://www.deichmann.com/hu-hu/noi"))
				|| (location.href.startsWith("https://www.deichmann.com/hu-hu/noi-cipok/"))
				|| (location.href.startsWith("https://www.deichmann.com/hu-hu/"))
				|| (location.href.includes("noi-cipok"))
				|| (location.href.includes("magassarku"))
				|| (location.href.includes("bokacsizma"))
				|| (location.href.includes("papucs"))
				|| (location.href.includes("flip-flop"))
				|| (location.href.includes("tusarku"))
				|| (location.href.includes("szandal"))
				|| (location.href.startsWith("https://www.aboutyou.hu/c/noi/"))
				|| (location.href.startsWith("https://www.officeshoes.hu/"))
				|| (location.href.startsWith("https://www.hervis.hu/shop/Cip%C5%91k"))
				|| (location.href.startsWith("https://hu.kazar.com/"))
				|| (location.href.startsWith("https://retrojeans.com/hu/noi/cipok"))
				|| (location.href.startsWith("https://retrojeans.com/hu/noi"))
			)
			{
				// chatgpt-vel:
				
				// Create a new div element
				const overlay = document.createElement('div');

				// Set the style properties for the overlay
				overlay.style.position = 'fixed';
				overlay.style.top = 0;
				overlay.style.left = 0;
				overlay.style.width = '100vw';
				overlay.style.height = '100vh';
				overlay.style.backgroundColor = 'rgba(128, 128, 128, 0.99)'; // 50% grey
				overlay.style.zIndex = 9999; // Make sure it's on top of other elements

				// Append the overlay to the body
				//document.body.style.contrast = "10%";
				document.body.appendChild(overlay);
				
				// force redraw document:
				//document.body.style.display = "none";
				//document.body.offsetHeight; // Force a reflow
				//document.body.style.display = ""; // Reset style
				
				// force redraw document:
				await new Promise(r => setTimeout(r, 100));



				alert(`Listen to the panic button CBT folder right now or else you will regret it.
		
Also read the #mesterterv fájl --> #pánik gomb PDF section.

I avoid visiting shoe sites.
I know visiting such sites poses a high risk of relapsing.
Amikor 20 napos libidóm van, ránézni egy női cipőre amit akár csak véletlenül ad fel a weboldal alul a related találatok közt, egy papucs vagy magassarkú, számomra borzasztó erős inger és gyakran a fő trigger egy masturbation spree kezdetekor. 
Csak úgy sikerülhet a M-ről való lemondásod ha nem látogatsz meg cipő oldalakat, beleértve a Nike és Puma papucs oldalakat. Ezeknél nagyon szépen kérd meg anyát és delegáld neki a feladatot, tehát hogy 46-ost kérsz és vegye meg.

kelt: 2024-12-05, és előtte legalább 4 alkalommal.`);

				alert(`2024-12-05

	- Aznap délután körül a Puma papucs linkek lementésekor az ecipo.hu-ra keveredtem és egy hirtelen gondolattól vezérelve a nőiekre kattintottam és aközt elkezdtem böngészi, és rákerestem a méretem stb. és találtam jól kinéző magassarkú papucsokat, és azt lementettem magamnak,, és elkezdtem tovább keresni cipőket és azokat is. Ez egy határozott trigger volt mert erősen feliz gatott hormonálisan.
	{
		/home/xy/Dokumentumok/élet/öltözködés/outfitek (akarom ezeket)/.elsorvasztási trash mappa/.burn your fucking boats, ez az anyag már 2x triggerelt/2024-10-21-i erős want, új korszak, értem magam/leírása.d
				
		● Ezt fixáld: Legyen az ecipo.hu női részére egy ilyen warning, hogy ne menj oda mert 95% az esélye, hogy kiv. lesz a vége, még aznap vagy másnap, a hormonok felmenése miatt.
	}`);
	
			}
			
			// A YT kereső találati listájára legyen egy figyelmezetés mert ott megtörtént már legalább 1x a véletlen kiverés okozó hibája. Mégpedig, hogy megszegted a szabályt:   /home/xy/Dokumentumok/szakértelem/nofap/61, láb meggyógyítása és nofap/mesterterv.d		   - A szabály, hogy soha nem kattinthatsz rá egy képre amin nő van vagy ha érzed, hogy baj lesz belőle. Ha ezt érzed akkor 10-ből 10-szer baj lesz belőle és óriási megbánásod és gyulladási szinted lesz a nap végén. Ezt figyeltem meg.
			if (location.href.startsWith("https://www.youtube.com/results?"))
			{
				alert(`SZABÁLY
SZABÁLY
SZABÁLY
A YOUTUBE THUMBNAIL SZABÁLY
A YOUTUBE THUMBNAIL SZABÁLY
A YOUTUBE THUMBNAIL SZABÁLY

A szabály, hogy soha nem kattinthatsz rá egy képre amin nő van vagy ha érzed, hogy baj lesz belőle. Ha ezt érzed akkor 10-ből 10-szer baj lesz belőle és óriási megbánásod és gyulladási szinted lesz a nap végén. Ezt figyeltem meg.

Esküdj meg rá. Képzeld el a helyes viselkedést.

SZABÁLY
SZABÁLY
SZABÁLY`);
			}
		}
		async function main_slow()
		{
			if (location.href.startsWith("https://discord.com/channels/@me/1193526179009933392")) // Ez a Marshallal folytatott üzenetváltásunk.
			{
				alert(`●●● Marshall99-specifikus üzenet: Futtasd az asztali "Discord (EZT NYISD MEG)" parancsikont és olvasd el doksit amit megnyit. Kurva kibaszott fontos dolog ez. A történelem megismétli önmagát ha nem tanulsz belőle. ●●●`);
			}
			if (location.href.startsWith("https://github.com/notifications"))
			{
			 alert(`2024-10-06
Ultra fontos!!!!!!!!!!!!!!!!
{
	/home/xy/Dokumentumok/hangterápia/log.txt
	
	▶  Írd fel, hogy rosszabb a zúgás ma és miért. (tegnap és tegnapelőtt közepes vagy jobb volt . Ma pedig átlagon aluli és ez a tegnapi egyetemi órák és tegnapi sok safeeyes bütykölgetés miatt van, és amiatt, hogy ma reggel nem tudtam kakilni de bent ültem a wc-n 20-25 percig. Az egyik hibás a kakilásképtelenségemben anya aki bejött rám a lazítási időszakban és elkezdett hozzám beszélni a székről.)
		- az, hogy tegnap egész nap számítógépeztem és a Safeeyest bütyköltem. Nagyon megbántam. Egyértelműen egy dopaminfüggőség-ADHD epizód volt számomra és nem racionális döntés. Nem érte meg. 
		Egyértelműen egy overconfidence epizód volt.
		
		az indította el, mint initial trigger, hogy megnyitottam az adventuretc githubom notification-jeit.
		Ezt nem szabad. Ne tedd később.
}`);
			}


			if (location.href.startsWith("https://libgen.is"))
			{
			 alert(`Az kérem hogy amikor legközelebb használnád ezt a weboldalt akkor vedd meg a Mozilla VPN-t egy hónapra vagy egy évre előre és azzal tölts le dolgokat. Nem akarom hogy lebukjak. Sztem így nem bukhatok le ha VPN-en át megy, úgy titkosítva van amit küldök és olyan mintha a mozilla töltené le a könyvet. Vagy egy másik, ingyenes VPN-t, elég sok van. Pl. a vírusirtókhoz szokott lenni vpn, pl. a GDATA aminnk van, talán ahhoz is van.
https://www.mozilla.org/hu/products/vpn/#pricing
¶
Archive.org-on nagyon sok könyv fent van ingyen és legálisan. (tapasztaltam ma).
És nagyon sok youtube előadás van (angolul) ami feldolgoz és 100%-ban elmesél egy könvyet, abból is nagyon jól lehet tanulni, hasonlóan jól mint a nő előadásaiból.`);
			}


			if (location.href.startsWith("https://www.notino.hu")
			   ||
				location.href.startsWith("https://www.beauty.hu/")
			   ||location.href.startsWith("https://www.douglas.hu/")
			   ||location.href.startsWith("https://the-body-shop.hu/")
			   ||location.href.startsWith("https://www.greenyshop.hu/")
			   ||location.href.startsWith("https://www.dm.hu/")
			   ||location.href.startsWith("https://shop.rossmann.hu/")
			   ||location.href.startsWith("https://rossmann.hu/")

			)
			{
				alert(`2025 nyáron is érvényes: KURVA FONTOS ÜZENET: Notino-n és dm-en és a többi hasonló weboldalon legyen egy popup emlékeztető, hogy 2024-07-09-án amit ott láttam (talpak) az nagyon erősen triggerelt és kiveréshez vezetett ami nagyon negatív hatással volt az életemre, ugyanis megnövelte a fülzúgásomat és pont az alkohol után 30 napon belül volt, tehát kurvára nem lett volna szabad semmit csinálnom aznap. Ráadásul az előző két napon olyan hangos volt éjszaka a fülzúgásom, hogy meg akartam ölni magam. Szóval ezzel a weboldallal kurvára vigyázz mert amit láthatsz rajta akár véletlenül az alsó sávban (körmöápolási képek, sarokápolási képek, buttplugok) akár direkt, amire rákerestél (pl. körömlakk) az könnyen triggerelhet. Emlékezz: a fő konfikltusforrások mindig a szex és a pénz, ez annyira mélyen van kódolva az emberi agyba, hogy mindent felülír ha belengetik neki, teljesen elveszi a józan eszedet. ¶ A legjobb ha nem is nézel ezen a weboldalon semmit; hagyd anyára vagy ne nézd, így jársz a legjobban össszességében!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
Remember: A tesztoszteron-dománs emberek mind olyan lényeg, hogy a fő konflikturforrás a szex és a pénz, és ha mutatnak nekik egy vaginát vagy mellet akkor elvesztik a fejüket. Neked jobban kell vigyáznod mert nálad a talp és lábfej és comb is ugyanígy triggerelő és azt a kozmetikai és drogéria weboldalak nem kezelik tabuként hanem simán odaraják egy bélyegképre.`);
			}

			
			// ez az egész Stickman kör:
			if (location.href.startsWith("https://discord.com/channels/451690962549473281/"))
			{
			 alert(`Stickman kör
pros:
● tanácsot adnak a futócipőmhöz (Anita)
● tanácsot adnak a munkával (Mark, Jani, alex). Kb. ennyi.
cons:
● megbántanak érzelmileg.
● idegesít kléni a beszólogatásaival (uncsik vagytok stb). Élvezi.
● Sady kiröhög vagy gúnyt űz belőlem néha, és kléni és sady is hülyeségeket ír.
● nem tetszik a légkör.
● alex olyanokat ír amit undorítónak tartok és nem akarom a fejemben.
● Sady és Anita is.
▶▶▶ Csak akkor nyisd meg ezt a csoportot ha a PRO-kért mész oda és tudod hogy mást nem fogsz elhozni onnan. Céltudatosan menj oda, soha ne nyisd meg unalomból, arra nem alkalamas számodra.


backlog: ● kérdezni tőlük hogy szeretik-e a programozást.   ● /home/xy/Dokumentumok/Képek/emojik/értelmikörben süsd el ezeket mind.d`);
			}
			
			if (location.href == "https://skribbl.io/"   )
			{
				alert("tippek: ▶ Safeeyes-ból és Eyeleo-ból lépj ki. ▶ Kalarm: OFF, ▶ Screen filter: OFF (de valami azért kell neked mert ha nincs és késő estig játszol az megnehezíti az elalvásodat 20 perccel. Inkább veszíts a játékban mint hogy 20 perccel később aludj el.: press Ctrl-Win-Num_Lock = redshift -O 6500), zene: bekapcsolva, vagy némaság, de dalszövegmentes zene. ▶ Pisilj előtte. ▶ Tegyél a monitor alá magasítást mert kényelmetlenül alacsonyan lesz, 3-5 centi. ▶ Zoomolj rá a játékra. ▶ Melegítsd át az ujjaidat mert gépelésből áll a játék. ▶ Használd a HP billentyűzetet vagy valamit ami nagyon konzisztens módon jár és nem ragad, akár a fehéret vagy egy mechát. ▶ Számold le a szó betűit és csak akkor írd le ha nagyjából helyes, dont give away what you see in the picture. ▶ Ezeket mind figyelni kell: KI RAJZOL, van-e már látható betű a megoldásban (periodikusan nézz oda), a szó egy premade listáról származik és nagyon egyszerű lesz többnyire. ▶ ELŐTTE hallgass erős dopamin dnb zenét de közben ne. ▶ Nyugtasd le magad, mély légzéssel, a nyugalom segít. ▶ Gyakorolni kell, sokat (más emberekkel). ▶ killall compton, mert az Apex-ből tanulva hiszem hogy hozzáad az FPS-hez ha nem fut. ▶ Számíts arra hogy vannak övön alulian könnyű szavak pl. SÁRGA, Fehér, fül, orr, láb, pont, sín. ▶ Vannak lerajzolhatatlan szavak pl bácsi, Morgan Freeman, Elon Musk, Mark zuckerberg, Leonardo Dicaprio, ipar, nyílt, Discord, Steam, álmatlanság, meseország (wonderland angolul) ▶ Fura spelling: Szphinx, pinokkió és nem fogad el más alakot csak azt az egy spelling-et. ▶ Számíts arra hogy vannak hárombetűs szavak és hogy ezekre nagyon gyorsan kell reagálni hogy elvidd. ▶ Jöjj rá hogy mi a játék pontozási módszere amikor te vagy a rajzoló. Úgy kapsz a legtöbb pontot ha minél több ember kitalálja és minél gyorsabban? Mert ha igen akkor olyat válassz amit könnyű jól lerajzolni. ▶ Számíts arra, hogy a többiek sokkal rosszabbul rajzolnak, mint te, főleg kléni, Kung és néha Mark ilyen. Sokkal kétdimenziósabban rajzolnak és ha te úgy értelmezed mintha saját magad rajzát akarnád kitalálni akkor nem fog menni. Megtörtént pl hogy én 3D-snek értelmeztem egy rajzot de valójában 2D-s volt és felülnézetes, és vízesésnek hittem, de valójában egy folyó volt. Vagy pl rajzoltak egy banán alakú rondaságot és a közepére egy fekete pontot, és a megfejtés az volt hogy fül, de én kurvára nem értettem és kurvára máshogy rajzoltam volna. ¶ A fiúk csak feketével rajzolnak és úgy mintha egy tervrajz lenne vagy kapcsolási rajz pl kléni a sínt úgy rajzolta le mint egy fekvő fekete rács. A kardot úgy mint egy szablya vagy muskéta. ▶ Néha hülyeséget rajzol a másik ember és egy másik szóról van szó mint ami a képen látható pl. sün volt a képen de a megfejtés rendőr volt. ▶ Mindig számold le a betűket mielőtt beírod a megoldás, legalábbis ha hosszú, ha 6 vagy több betűről van szó. (Annie is leszámolja őket, megkérdeztem tőle). A bal kezedem számold a betűket, és ha LY vagy TY van benne azt úgy számold hogy összefogod két ujjadat. ▶ A szavak listája: https://skribbliohints.github.io/ ▶ Használj olyan bill-t amin nagyon könnyű gépelni, nem ragad, pl. a HP-t vagy a fehéret. ▶ Melegítsd fel a kezeidet előtte mert nagyon nehéz hideg kézzel gépelni és elvesztem úgy. ▶ Sokszor van hogy 1 betűvel mellé lövök és olyankor bekerül a csetbe a megfejtésem és mindenki látja, ez rossz, mert utána ők több pontot kapnak emiatt. ▶ Synecdoche pl Pikachu-t rajzolják le a megfejtés Pokemon tehát egy tágabb fogalom. /home/xy/Dokumentumok/barát szerzés/értelmikör - how to win skribbl.io.d ▶ A font ne legyen Arial-ra override-olva mert úgy kevésbé különülnek el fent a betűk. ▶ Legyen egy limit a késő esti játékra mert túl későn feküdtem le múltkor. Max 8:00-ig játssz (bekonfiguráltam már a Leechblock-ban) ▶ command: skribbleon, skribbleoff = xinput --set-prop \"Logitech USB Optical Mouse\" \"libinput Accel Speed\" -0.6 ▶ Használd az U C B F hotkey-eket, és a wireless pici egeret középre rakva. ▶ A begépelésnél van jobb oldalt egy karakterszám jelző, azt figyeld hogy egyezik-e a fent megadott szó hosszal." );
			}

		}



		async function blockViaOverlay(type)
		{
		
			if  (hide_all_text)
			{
				// Create the overlay
				const overlay = document.createElement("div");
				overlay.style.position = "fixed";
				overlay.style.top = "0";
				overlay.style.left = "0";
				overlay.style.width = "100vw";
				overlay.style.height = "100vh";
				if (type == "image")
				{
					// if black:
					overlay.style.backgroundColor = "rgba(0, 0, 0, 1)"; // 100% black filter
				}
				else if (type == "green")
				{
					// if green:
					 overlay.style.backgroundColor = 'rgba(0, 100, 0, 0.85)';
					 
					// legyen a szűrő click-through szerintem:
					// https://stackoverflow.com/questions/3680429/click-through-div-to-underlying-elements
					overlay.style.pointerEvents = 'none';
				}
				overlay.style.zIndex = "9999"; // Ensure it stays on top
				overlay.style.display = "flex";
				overlay.style.justifyContent = "center";
				overlay.style.alignItems = "center";
				overlay.style.flexDirection = "column";

				
				
				
				if (type == "image")
				{
					// Create the image
					const image = document.createElement("img");
					image.src = "https://images.unsplash.com/photo-1664009369177-072a596d69c0?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
					//az important címkéket nem veszi be, hihetetlen a JS.
					//https://stackoverflow.com/questions/462537/overriding-important-style
					//To prevent overriding other properties, you man want to use element.style.cssText += ';display:inline !important;'; 
					//image.style.maxHeight = "75vh !important"; // 75% of the viewport width
					//image.style.height = "75vh !important"; // 75% of the viewport width
					//image.style.filter = "none !important";
					//image.style.display = "block !important";
					//image.style.width = "auto !important";
					image.style.cssText +=
					`;
					max-height: 75vh !important;
					height: 75vh !important;
					filter: none !important;
					display: unset !important;
					max-width: unset !important;
					width: unset !important;
					`
					image.style.borderRadius = "10px"; // Optional rounded corners
					

					// Create the text
					const text = document.createElement("div");
					text.innerText = "What actually helped me is that, I think of what to do to be productive. This always works. How can I be more productive?";
					text.style.color = "white";
					text.style.fontSize = "24px";
					text.style.marginTop = "20px";
					text.style.fontFamily = "Arial, sans-serif";
					text.style.textAlign = "center";
					
					// Append elements to the overlay
					overlay.appendChild(image);
					overlay.appendChild(text);
				}
				
				
				//document.body.style.contrast = "10%"; -> ettől baromire laggos lett és nem hatott a képekre egyáltalán.

				// Append the overlay to the body
				document.body.appendChild(overlay);
				
				// force redraw document:
				//document.body.style.display = "none";
				//document.body.offsetHeight; // Force a reflow
				//document.body.style.display = ""; // Reset style
				
				// force redraw document:
				await new Promise(r => setTimeout(r, 100));
			}
		}
	}
)
();
