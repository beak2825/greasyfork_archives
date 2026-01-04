// ==UserScript==
// @name            YouTube DeBlock
// @description     Fully Working 2023 UnBlocker for YouTube. Get rid of that pesky blocker, and return my vids!
// @author          YelloNox
// @version         1.1.8
// @created         2023-10-10
// @namespace       https://yello.zip
// @homepage        https://github.com/YelloNox/YouTube-UnBlock
// @match           *://www.youtube.com/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/477098/YouTube%20DeBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/477098/YouTube%20DeBlock.meta.js
// ==/UserScript==

(function () {
    "use strict";

    /* User Customization */
    const disableTheaterToggle = false;
    const disableReloadToggle = false;
    const disableOptionsMenu = false;
    var forceEnableEmbed = false;
    /* Language INFO: https://github.com/YelloNox/YouTube-UnBlock/blob/main/language.md */
    const language = "en";
    /* End User Customization */

    // Any class the blocker uses
    const blockerClass = "ytd-enforcement-message-view-model";
    // Any class on the broken video (e.x. yt-playability-error-supported-renderers)
    var ogVideoClass = "yt-playability-error-supported-renderers";
    if (forceEnableEmbed) {
        // Any class of the official video for force replacing
        ogVideoClass = "html5-video-player";
    }
    // Class of the parent for the custom content locaiton
    const customContentParentID = "end";
    // Original Youtube URL
    const youtubeURL = "youtube.com";
    // Change to theater mode on load
    const changeTheaterOnStart = false;

    // Domains to redirect to.
    var domainList = [
        "youtube.com/embed",
        "yout-ube.com",
        "piped.kavin.rocks",
        "subscriptions.gir.st",
        "nsfwyoutube.com", // Disabled (for now)
    ];
    // Does domain include www. (if not, need to remove later)
    var domainListUrlStat = [
        true, //"youtube.com/embed",
        true, //"yout-ube.com",
        false, //"piped.kavin.rocks",
        false, //"subscriptions.gir.st",
        false, //"nsfwyoutube.com",
    ];

    // --- Do Not Touch --- //
    var newDomain = domainList[0];
    var newDomainListUrlStat = domainListUrlStat[0];
    // Temp Functions //
    const tempReplaceClass = "replaceme";
    let isBlocked = false;
    let isSubChange = false;
    let isChangingFrame = false;
    var updatedURL = window.location.href;
    var previousDropdownValue;
    // --- Do Not Touch --- //

    // -------------- Main Loop Funcitons -------------- //

    // Function that checks if the page is even blocked
    var theaterStartRunOnce = false;
    function checkClass() {
        const blockerElement = document.querySelectorAll("." + blockerClass);
        const videoElement = document.querySelectorAll("." + ogVideoClass);

        if (blockerElement.length > 0) {
            isBlocked = true;
            console.log("blocked [checkClass]: yes");
        }

        if (forceEnableEmbed && videoElement.length > 0) {
            isBlocked = true;
            forceEnableEmbed = false;
            console.log("Forcing Unblock");
        }

        if (isBlocked) {
            console.log("Replacing Original [checkClass]");
            replaceVideo();
            addDomainToURLs();
            isBlocked = false;
        } else {
            // console.log("[checkClass] #2") - Cogs Log
            urlTracker();
            dropdownTracker();
        }

        if (changeTheaterOnStart && !theaterStartRunOnce) {
            changeTheaterMode(true);
            theaterStartRunOnce = true;
        }
    }

    // -------------- Event Listeners -------------- //

    // Checks if the url has changed, if so, reload the iframe (thus reloading the video)
    function urlTracker() {
        var currentURL = window.location.href;
        // console.log("Test URL [urlTracker]"); - Cogs Log
        if (currentURL != updatedURL) {
            console.log("Found New URL");
            updatedURL = window.location.href;
            if (isSubChange) {
                isBlocked = true;
            }
        }
    }

    // Checks if the dropdown has changed
    function dropdownTracker() {
        var dropdown = document.getElementById("dropdown");
        if (dropdown) {
            changeSelection(dropdown);
        }
    }

    function changeSelection(dropdown) {
        try {
            dropdown.addEventListener("change", function () {
                checkDropdownChange(dropdown);
            });
        } catch (error) {
            console.error("Error [changeSelection]: " + error);
        }
    }

    function checkDropdownChange(dropdown) {
        var newValue = dropdown.value;

        // Check if the value has actually changed
        if (newValue !== previousDropdownValue) {
            newDomain = domainList[newValue];
            newDomainListUrlStat = domainListUrlStat[newValue];
            console.log("Selection Changed [newDomain]: " + newDomain);
            console.log(
                "Selection Changed [newDomainListUrlStat]: " +
                    newDomainListUrlStat
            );
            reloadFrame();

            // Update the previousValue variable
            previousDropdownValue = newValue;
        }
    }

    // Reload Frame when "Reload Frame" button is clicked
    function reloadFrame() {
        replaceVideo();
        addDomainToURLs();

        console.log("clicked [reloadFrame]");
    }

    // -------------- Checks -------------- //

    function appendingFrame(isSet) {
        if (isSet == true) {
            isChangingFrame = true;
        } else {
            isChangingFrame = false;
        }
        console.log("ChangingFrames: " + changingFrame);
    }

    // -------------- Actions -------------- //

    // Remove the *blocker* from the page by locating the class name.
    function removeElementsByClassName(removeClass) {
        console.log("Removing [removeElementsByClassName]: " + removeClass);
        const elements = document.querySelectorAll("." + removeClass);
        try {
            elements.forEach((element) => {
                element.remove();
            });
        } catch (error) {
            console.error(
                "Error removing elements [removeElementsByClassName]: " + error
            );
        }
    }

    // Checks string and returns if contains matching text
    function checkText(string, text) {
        console.log("Checking string [checkText]");
        return string.includes(text);
    }

    // Function to replace "youtube.com" with selected domain
    function getNewURL(newDomain) {
        console.log("New URL [newDomain]: " + newDomain);
        const currentURL = window.location.href;
        try {
            if (currentURL.includes(youtubeURL)) {
                var newURL = currentURL.replace(youtubeURL, newDomain);
                if (newDomainListUrlStat == false) {
                    newURL = newURL.replace(/www./g, "");
                }
                return newURL;
            }
        } catch (error) {
            console.error("Error [newURL]: " + error);
        }
    }

    // Adds "youtube.com" to all nameless urls on webpage
    function addDomainToURLs() {
        console.log("Adding [addDomainToURLs]");
        const links = document.querySelectorAll("a");

        try {
            links.forEach((link) => {
                let href = link.getAttribute("href");
                if (
                    href &&
                    !href.startsWith("http") &&
                    !href.startsWith("www")
                ) {
                    href = "https://www." + youtubeURL + href;

                    link.setAttribute("href", href);
                }
            });
        } catch (error) {
            console.error("[addDomainToURLs] #1", error);
        }
    }

    // Is it the first video change, or recurring?
    function replaceVideo() {
        if (!isSubChange) {
            console.log("replacing [replaceVideo]");
            removeElementsByClassName(blockerClass);
            createJFrame(ogVideoClass);
            isSubChange = true;

            return;
        }
        if (isSubChange) {
            console.log("replacing subclick [replaceVideo]");
            removeOgIframe();
            createJFrame(tempReplaceClass);
            console.log("In with the new [replaceVideo]");
        }

        isBlocked = false;
    }

    // Fixes unusable URL(s)
    function fixURL(URL) {
        const playlistCheck = "&list=";
        const watchStamp = "watch?v=";
        const timestamp = "&t=";
        const isURL = checkText(URL, youtubeURL);
        const isPlaylist = checkText(URL, playlistCheck);
        const isTimestamp = checkText(URL, timestamp);

        console.log(
            "isURL:" +
                isURL +
                " isPlaylist:" +
                isPlaylist +
                " isTimestamp:" +
                isTimestamp
        );
        console.log("URL [fixURL]:" + URL);

        if (isURL) {
            URL = URL.replace(watchStamp, "");
            console.log("Is Not Playlist [fixURL]: " + URL);
        }
        if (isURL && isTimestamp) {
            URL = URL.split(timestamp)[0];
            console.log("\nURL Split Timestamp Fix [fixURL]: " + URL);
        }
        if (isPlaylist) {
            URL = URL.split(playlistCheck)[0];
            console.log("\nURL Split Playlist Fix [fixURL]: " + URL);
        }

        return URL;
    }

    // Fixes webpage address
    function fixPage() {
        var tmpURL = window.location.href;
        const playlistCheck = "&list=";
        const isBrokePlaylist = checkText(tmpURL, playlistCheck);

        if (isBrokePlaylist) {
            printAlert(0);
            var regex = /(&list)\D+\d+/g;
            console.log("URL Fix Original: [fixPage]: " + tmpURL);
            tmpURL = tmpURL.replace(regex, "");
            console.log("URL Fix New: [fixPage]: " + tmpURL);
            window.location.href = tmpURL;
        }
    }

    var theaterModeToggle = true;
    function toggleTheater() {
        if (theaterModeToggle) {
            console.log("Changing Mode [toggleTheater]: Off");
            theaterModeToggle = false;
        } else {
            console.log("Changing Mode [toggleTheater]: On");
            theaterModeToggle = true;
        }
        changeTheaterMode(theaterModeToggle);
    }

    // Thanx https://stackoverflow.com/questions/53584026/toggle-the-cinema-mode-on-youtube-with-javascript :>
    function changeTheaterMode(state) {
        try {
            const collection = document.getElementsByTagName("ytd-watch-flexy");
            const ytd_watch_flexy = collection.item(0);
            if (!ytd_watch_flexy) {
                console.error("No ytd-watch-flexy Found[changeTheaterMode]");
                return;
            }

            if (state) {
                ytd_watch_flexy.theater = true;
                console.log("Theater On [changeTheaterMode]");
            } else {
                ytd_watch_flexy.theater = false;
                console.log("Theater Off [changeTheaterMode]");
            }
        } catch (error) {
            console.error("Theater-Mode Error [changeTheaterMode]: " + error);
        }
    }

    // -------------- JFrame Control -------------- //
    // Create video embedding frame
    function createJFrame(classToOverturn) {
        var newURL = getNewURL(newDomain);
        const elements = document.querySelectorAll("." + classToOverturn);
        console.log("newURL Beginning [createJFrame]: " + newURL);

        fixPage();
        newURL = fixURL(newURL);

        try {
            const firstElement = elements[0]; // Get the first element in the array -> trying to prevent duplicate videos
            if (firstElement) {
                const iframe = document.createElement("iframe");
                iframe.width = "100%";
                iframe.height = "100%";
                iframe.src = newURL;
                iframe.allow =
                    "accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
                // autoplay:       ^ (autoplay removed after bug; also never worked anyhow)
                iframe.allowFullscreen = true;
                iframe.zIndex = "9999";

                firstElement.parentNode.replaceChild(iframe, firstElement);
                console.log("Modified URL:", newURL);
            }
        } catch (error) {
            console.error("Error creating iframe [createJFrame]: " + error);
        }
    }

    // Removes the original video frame.
    function removeOgIframe() {
        const iframes = document.querySelectorAll("iframe");

        console.log("removing jFrame [removeOgIframe]");
        try {
            iframes.forEach((iframe) => {
                const paragraph = document.createElement("p");
                paragraph.className = tempReplaceClass;
                iframe.parentNode.insertBefore(paragraph, iframe);
                iframe.remove();
                console.log("Out with the old [removeOgIframe]");
            });
        } catch (error) {
            console.error("Error [removeOgIframe]: " + error);
        }
    }

    // -------------- Experimental Features (unused) -------------- //

    // Save dropdown selection to local storage
    function dropdownStore() {
        try {
            rememberButton.addEventListener("click", function () {
                localStorage.setItem("selectedOption", dropdown.value);
                console.log("Selection Stored");
            });
        } catch (error) {
            console.error("Error [dropdownStore]: " + error);
        }
    }

    // -------------- Language Information -------------- //

    // xtxt is for the type of text needed (i.e. dropdown / theater mode button / ect...) for the main category of text.
    // vers is the item in the container (i.e. dropdown: youtube, yout-ube) for multiple subtexts.
    // top tier explination!
    function getText(xtxt, vers) {
        const translations = {
            en: {
                theaterMode: ["Theater"],
                reloadFrame: ["Reload Frame"],
                dropdown: [
                    "YouTube™ [Embed]",
                    "yout-ube",
                    "kavin.rocks",
                    "gir.st",
                ],
            },

            de: {
                theaterMode: ["Theater"],
                reloadFrame: ["Rahmen neu laden"],
                dropdown: [
                    "YouTube™ [Einbetten]",
                    "yout-ube",
                    "kavin.rocks",
                    "gir.st",
                ],
            },

            es: {
                theaterMode: ["Teatro"],
                reloadFrame: ["Recargar Marco"],
                dropdown: [
                    "YouTube™ [Incrustar]",
                    "yout-ube",
                    "kavin.rocks",
                    "gir.st",
                ],
            },

            fr: {
                theaterMode: ["Théâtre"],
                reloadFrame: ["Recharger le Cadre"],
                dropdown: [
                    "YouTube™ [Intégrer]",
                    "yout-ube",
                    "kavin.rocks",
                    "gir.st",
                ],
            },

            it: {
                theaterMode: ["Teatro"],
                reloadFrame: ["Ricarica Cornice"],
                dropdown: [
                    "YouTube™ [Incorpora]",
                    "yout-ube",
                    "kavin.rocks",
                    "gir.st",
                ],
            },

            jp: {
                theaterMode: ["劇場"],
                reloadFrame: ["フレームを再読み込み"],
                dropdown: [
                    "YouTube™ [埋め込み]",
                    "yout-ube",
                    "kavin.rocks",
                    "gir.st",
                ],
            },

            ko: {
                theaterMode: ["극장"],
                reloadFrame: ["프레임 다시 로드"],
                dropdown: [
                    "YouTube™ [임베드]",
                    "yout-ube",
                    "kavin.rocks",
                    "gir.st",
                ],
            },

            nl: {
                theaterMode: ["Theater"],
                reloadFrame: ["Frame Herladen"],
                dropdown: [
                    "YouTube™ [Insluiten]",
                    "yout-ube",
                    "kavin.rocks",
                    "gir.st",
                ],
            },

            pl: {
                theaterMode: ["Teatr"],
                reloadFrame: ["Przeładuj Ramkę"],
                dropdown: [
                    "YouTube™ [Osadź]",
                    "yout-ube",
                    "kavin.rocks",
                    "gir.st",
                ],
            },

            pt: {
                theaterMode: ["Teatro"],
                reloadFrame: ["Recarregar Quadro"],
                dropdown: [
                    "YouTube™ [Embutir]",
                    "yout-ube",
                    "kavin.rocks",
                    "gir.st",
                ],
            },

            ru: {
                theaterMode: ["Театр"],
                reloadFrame: ["Перезагрузить Рамку"],
                dropdown: [
                    "YouTube™ [Вставить]",
                    "yout-ube",
                    "kavin.rocks",
                    "gir.st",
                ],
            },

            ar: {
                theaterMode: ["مسرح"],
                reloadFrame: ["إعادة تحميل الإطار"],
                dropdown: [
                    "YouTube™ [تضمين]",
                    "yout-ube",
                    "kavin.rocks",
                    "gir.st",
                ],
            },

            zh: {
                theaterMode: ["剧院"],
                reloadFrame: ["重新加载框架"],
                dropdown: [
                    "YouTube™ [嵌入]",
                    "yout-ube",
                    "kavin.rocks",
                    "gir.st",
                ],
            },

            hi: {
                theaterMode: ["रंगमंच"],
                reloadFrame: ["फ्रेम पुनः लोड करें"],
                dropdown: [
                    "YouTube™ [एम्बेड करें]",
                    "yout-ube",
                    "kavin.rocks",
                    "gir.st",
                ],
            },

            sv: {
                theaterMode: ["Teater"],
                reloadFrame: ["Ladda om Ramen"],
                dropdown: [
                    "YouTube™ [Bädda in]",
                    "yout-ube",
                    "kavin.rocks",
                    "gir.st",
                ],
            },

            no: {
                theaterMode: ["Teater"],
                reloadFrame: ["Last Inn Rammen på Nytt"],
                dropdown: [
                    "YouTube™ [Bygg inn]",
                    "yout-ube",
                    "kavin.rocks",
                    "gir.st",
                ],
            },

            da: {
                theaterMode: ["Teater"],
                reloadFrame: ["Genindlæs Rammen"],
                dropdown: [
                    "YouTube™ [Vložit]",
                    "yout-ube",
                    "kavin.rocks",
                    "gir.st",
                ],
            },

            cs: {
                theaterMode: ["Divadlo"],
                reloadFrame: ["Rámeček znovu načíst"],
                dropdown: [
                    "YouTube™ [Vložit]",
                    "yout-ube",
                    "kavin.rocks",
                    "gir.st",
                ],
            },

            hu: {
                theaterMode: ["Színház"],
                reloadFrame: ["Keret Újratöltése"],
                dropdown: [
                    "YouTube™ [Beágyazás]",
                    "yout-ube",
                    "kavin.rocks",
                    "gir.st",
                ],
            },

            tr: {
                theaterMode: ["Tiyatro"],
                reloadFrame: ["Çerçeveyi Yeniden Yükle"],
                dropdown: [
                    "YouTube™ [Gömme]",
                    "yout-ube",
                    "kavin.rocks",
                    "gir.st",
                ],
            },
        };

        const languageTranslations = translations[language];
        return languageTranslations && languageTranslations[xtxt]
            ? languageTranslations[xtxt][vers]
            : undefined;
    }

    // alertT is the alert type (i.e. invalid page...)
    function printAlert(alertT) {
        const translations = {
            en: {
                0: [
                    "Oops! Something went wrong.\n\n- Issue: The playlist feature is currently not working.\n- Action: You will be redirected to a static page shortly.\n\nI am looking for a fix.",
                ],
            },

            de: {
                0: [
                    "Hoppla! Etwas ist schief gelaufen.\n\n- Problem: Die Playlist-Funktion funktioniert derzeit nicht.\n- Aktion: Sie werden in Kürze auf eine Standardseite umgeleitet.\n\nIch suche nach einer Lösung.",
                ],
            },

            es: {
                0: [
                    "¡Vaya! Algo salió mal.\n\n- Problema: La función de lista de reproducción no está funcionando actualmente.\n- Acción: Serás redirigido a una página estándar en breve.\n\nEstoy buscando una solución.",
                ],
            },

            fr: {
                0: [
                    "Oups ! Un problème est survenu.\n\n- Problème : La fonction de playlist ne fonctionne pas actuellement.\n- Action : Vous serez redirigé vers une page standard sous peu.\n\nJe cherche une solution.",
                ],
            },

            it: {
                0: [
                    "Ops! Qualcosa è andato storto.\n\n- Problema: La funzione playlist non sta funzionando al momento.\n- Azione: Sarai reindirizzato a una pagina standard a breve.\n\nSto cercando una soluzione.",
                ],
            },

            jp: {
                0: [
                    "おっと！何かが間違っていました。\n\n- 問題：プレイリスト機能は現在動作していません。\n- 処置：間もなく標準ページにリダイレクトされます。\n\n修正を探しています。",
                ],
            },

            ko: {
                0: [
                    "이런! 문제가 발생했습니다.\n\n- 문제: 플레이리스트 기능이 현재 작동하지 않습니다.\n- 조치: 곧 표준 페이지로 리디렉션됩니다.\n\n해결책을 찾고 있습니다.",
                ],
            },

            nl: {
                0: [
                    "Oeps! Er is iets misgegaan.\n\n- Probleem: De afspeellijstfunctie werkt momenteel niet.\n- Actie: Je wordt binnenkort omgeleid naar een standaardpagina.\n\nIk ben op zoek naar een oplossing.",
                ],
            },

            pl: {
                0: [
                    "Ups! Coś poszło nie tak.\n\n- Problem: Funkcja listy odtwarzania obecnie nie działa.\n- Działanie: Wkrótce zostaniesz przekierowany na standardową stronę.\n\nSzukam rozwiązania.",
                ],
            },

            pt: {
                0: [
                    "Ops! Algo deu errado.\n\n- Problema: A função de playlist atualmente não está funcionando.\n- Ação: Você será redirecionado para uma página padrão em breve.\n\nEstou procurando uma solução.",
                ],
            },

            ru: {
                0: [
                    "Ой! Что-то пошло не так.\n\n- Проблема: В настоящее время функция плейлиста не работает.\n- Действие: Скоро вы будете перенаправлены на стандартную страницу.\n\nЯ ищу решение.",
                ],
            },

            ar: {
                0: [
                    "عفوًا! هناك خطأ ما.\n\n- المشكلة: ميزة قائمة التشغيل لا تعمل حاليًا.\n- الإجراء: ستتم إعادتك إلى صفحة قياسية قريبًا.\n\nأبحث عن حل.",
                ],
            },

            zh: {
                0: [
                    "哎呀！出了点问题。\n\n- 问题：播放列表功能目前无法使用。\n- 操作：您将很快被重定向到标准页面。\n\n我正在寻找解决方案。",
                ],
            },

            hi: {
                0: [
                    "उफ! कुछ गलत हो गया।\n\n- समस्या: प्लेलिस्ट सुविधा वर्तमान में काम नहीं कर रही है।\n- कार्रवाई: आपको जल्द ही एक मानक पृष्ठ पर अनुप्रेषित किया जाएगा।\n\nमैं एक समाधान ढूँढ रहा हूँ।",
                ],
            },

            sv: {
                0: [
                    "Oops! Något gick fel.\n\n- Problem: Spellistefunktionen fungerar inte för närvarande.\n- Åtgärd: Du kommer att omdirigeras till en standard sida inom kort.\n\nJag letar efter en lösning.",
                ],
            },

            no: {
                0: [
                    "Oisann! Noe gikk galt.\n\n- Problem: Spillelistefunksjonen virker ikke for øyeblikket.\n- Handling: Du vil bli omdirigert til en standardside snart.\n\nJeg ser etter en løsning.",
                ],
            },

            da: {
                0: [
                    "Ups! Noget gik galt.\n\n- Problem: Afspilningsliste funktionen virker ikke i øjeblikket.\n- Handling: Du vil snart blive omdirigeret til en standard side.\n\nJeg leder efter en løsning.",
                ],
            },

            cs: {
                0: [
                    "Jejda! Něco se pokazilo.\n\n- Problém: Funkce playlistu momentálně nefunguje.\n- Akce: Brzy budete přesměrováni na standardní stránku.\n\nHledám řešení.",
                ],
            },

            hu: {
                0: [
                    "Hoppá! Valami hiba történt.\n\n- Probléma: A lejátszási lista funkció jelenleg nem működik.\n- Teendő: Hamarosan egy szabványos oldalra lesz átirányítva.\n\nMegoldást keresek.",
                ],
            },

            tr: {
                0: [
                    "Oops! Bir şeyler yanlış gitti.\n\n- Sorun: Oynatma listesi özelliği şu anda çalışmıyor.\n- Eylem: Yakında standart bir say",
                ],
            },
        };

        const languageTranslations = translations[language];
        alert(languageTranslations[alertT]);
    }

    // -------------- Custom HTML Start -------------- //

    // Custom CSS
    var css = `
    .btn-style {
        position: relative;
        display: inline-block;
        padding: 9px;
        height: 40px;
        color: white;
        background-color: transparent;
        box-shadow: none;
        text-shadow: none;
        border: 1px solid white;
        border-radius: 0px;
        z-index: 9999;
        opacity: 100%;
        transition: transform 0.3s ease;
        user-select: none;
    }
    .btn-style:hover {
        opacity: 80%;
    }
    .main-btn {
        margin-right: 16px;
        transition: transform 0.1s ease;
    }
    .main-btn:active {
        border: 1px solid transparent !important;
        transform: scale(0.9);
    }
    .dropdown-content {
        position: relative;
        background-color: black;
    }
    .custom-container {
        border: none;
        display: inline-block;
        margin-right: 16px;
        margin-left: 16px;
        transition: transform 0.3s ease;

    }
    `;

    var ranCustomContentOnce = false;
    function customContent() {
        // Create Container
        var customContainer = document.createElement("div");
        customContainer.classList.add("custom-container");
        /* Not Complete */
        // Create Button Theater Mode
        var theaterButton = document.createElement("button");
        theaterButton.textContent = getText("theaterMode", 0);
        theaterButton.classList.add("btn-style", "main-btn");
        /**/
        // Create Button Reload
        var reloadButton = document.createElement("button");
        reloadButton.textContent = getText("reloadFrame", 0);
        reloadButton.classList.add("btn-style", "main-btn");

        // Create Dropdown Menu
        var dropdownButton = document.createElement("select");
        dropdownButton.id = "dropdown";
        dropdownButton.classList.add("btn-style");
        const options = [
            { value: "0", text: getText("dropdown", 0) },
            { value: "1", text: getText("dropdown", 1) },
            { value: "2", text: getText("dropdown", 2) },
            { value: "3", text: getText("dropdown", 3) },
            //{ value: "4", text: "NSFW YouTube [Broken!]" } Fix later?
        ];
        var htmlContent = options
            .map(
                (option) =>
                    `<option class="dropdown-content" value="${option.value}">${option.text}</option>`
            )
            .join("");
        dropdownButton.innerHTML = htmlContent;

        // -------------- Custom HTML End -------------- //

        // ----- Appending custom content to page ----- //

        // Add items to Container

        if (!disableTheaterToggle) {
            customContainer.appendChild(theaterButton);
        }
        if (!disableReloadToggle) {
            customContainer.appendChild(reloadButton);
        }
        if (!disableOptionsMenu) {
            customContainer.appendChild(dropdownButton);
        }

        // Append CSS to page
        var style = document.createElement("style");
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);

        // Find ID Location
        var exsistingParent = document.getElementById(customContentParentID);
        console.log("Found exsistingParent: " + exsistingParent);

        // Add Container to Page
        if (exsistingParent != null) {
            exsistingParent.insertBefore(
                customContainer,
                exsistingParent.firstChild
            );
            console.log("Added customContainer to page");
        } else {
            console.error("Error [customContent]: No exsistingParent found");
        }

        theaterButton.addEventListener("click", toggleTheaterStingyWorkaround);
        reloadButton.addEventListener("click", reloadFrame);

        ranCustomContentOnce = true;
    }

    try {
        if (!ranCustomContentOnce) {
            customContent();
            console.log("Loaded [customContent]");
        } else {
            console.log(
                "Tried to load, but was allready loaded [customContent]"
            );
        }
    } catch (error) {
        console.error("Error [customContent]: " + error);
    }

    // -------------- Active Listeners -------------- //

    // Run every second to check for updates on page (Will not ping any server till a new page is clicked)
    try {
        window.setInterval(checkClass, 1000);
    } catch (error) {
        console.error("Error Running [window.setInterval]: " + error);
    }
    try {
        document.addEventListener("click", checkClass, 1000);
    } catch (error) {
        console.error("Error Running [document.addEventListener]: " + error);
    }

    // ------------- Passive Listeners ------------- //

    // Fullscreen Toggle
    function toggleTheaterStingyWorkaround() {
        const event = new KeyboardEvent("keydown", {
            key: "t",
            keyCode: 84,
        });
        document.dispatchEvent(event);
        location.reload();
    }
})();
