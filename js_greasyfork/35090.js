// ==UserScript==
// @name         The Last Jedi Spoiler Blocker
// @namespace    SawanRC
// @version      0.5
// @description  Notifies the user if any keywords related to Star Wars are detected on the page.
// @author       SawanRC
// @include      *
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_getValue
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/35090/The%20Last%20Jedi%20Spoiler%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/35090/The%20Last%20Jedi%20Spoiler%20Blocker.meta.js
// ==/UserScript==

(function() {
    //Adds a .contains() function for strings.
    String.prototype.contains = function(n){var t=this.toLowerCase().indexOf(n.toLowerCase());return-1===t?!1:!0;};
    var awaitingUser = false;
    var timer;
    var originalTitle;
    var blockedKeywords = ["star wars", "kylo", "rey ", "luke", "skywalker", "the force", "anakin", "darth", "vader", "jedi", "sith", "leak",
		"jyn ", "erso ", "knights", "death star", "leia", "han solo", "star ", "starwar", "dark side", "yoda", "obi-", "obi ", "wan ", "episode 8",
		"ep. 8", "ep 8", "ep8", "r2-d2", "r2d2", "r2 d2", "3po"];

    var observer = new MutationObserver(function() {
        clearTimeout(timer);
        timer = setTimeout(scanPage, 1000);
	});


    function scanPage() {
        timer = null;
        if (awaitingUser) return;
        if (sessionStorage.getItem("SPOILER-" + window.location.hostname)) {
            console.log("Spoilers unchecked for session.");
            observer.disconnect();
            return;
		}
        if (GM_getValue("SPOILER-" + window.location.hostname)) {
            console.log("Spoilers unchecked for domain.");
            observer.disconnect();
            return;
		}

        $.each(blockedKeywords, function(index, item) {
            if (awaitingUser) return false;

            var html = $('head').text() + $('body').text();

            if (html.contains(item)) {
                awaitingUser = true;
                console.log("Found: " + item);
			}
		});

        if (awaitingUser) {
            hideContent();
		}
	}

    function showContent() {
        hider.hide();
        $("head > title").text(originalTitle);
	}

    function hideContent() {
        $("body").append(hider);

        originalTitle = $("head > title").text();

        $("head > title").text("Spoilers blocked.");

        $("#spoilerBlock-Once").on('click', function() {
            showContent();
		});

        $("#spoilerBlock-Session").on('click', function() {
            sessionStorage.setItem("SPOILER-" + window.location.hostname, true);
            showContent();
		});

        $("#spoilerBlock-Domain").on('click', function() {
            GM_setValue("SPOILER-" + window.location.hostname, true);
            showContent();
		});
	}

    var hider = $("<div>", {id: "spoilerBlockBox", "style": "" });
    var hiderStyle = $(`<style>
	#spoilerBlockBox {
		position: fixed !important;
		text-align: center !important;
		left: 0px !important;
		top: 0px !important;
		width: 100% !important;
		height: 100% !important;
		z-index: 2147483647 !important;
		padding-top: 70px !important;
		background: #111 !important;
		color: #fff !important;
		font-family: Arial !important;
	}
	#spoilerBlockBox h1 {
		color: #fff !important;
		font-size: 30px !important;
		display: inline-block !important;
	}

	#spoilerBlockBox button {
		color: #000 !important;
		background-color: #fff !important;
		padding: 5px !important;
	}</style>`);

    $("head").append(hiderStyle);

    hider.html(`
	<h1>Careful!</h1>
	<p>This page may contain spoilers for Star Wars: The Last Jedi. Are you sure you would like to continue?</p>
	<button id="spoilerBlock-Once">Continue once</button>
	<button id="spoilerBlock-Session">Ignore spoilers for this session</button>
	<button id="spoilerBlock-Domain">Ignore spoilers for this domain</button>
	`);
    scanPage();

    observer.observe(document, {
        childList: true,
        characterData: true,
        subtree: true
	});
})();