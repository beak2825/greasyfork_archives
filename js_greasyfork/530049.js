// ==UserScript==
// @name         LokisMod - Beta - MiniMap - Macro - Bots Coming Soon....
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  LokisMod Helps you to enjoy agario and take controll of your server be the king of the leaderboard and dominate everyone Updates coming soon
// @author       Lokisdreams
// @match        https://agar.io/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/530049/LokisMod%20-%20Beta%20-%20MiniMap%20-%20Macro%20-%20Bots%20Coming%20Soon.user.js
// @updateURL https://update.greasyfork.org/scripts/530049/LokisMod%20-%20Beta%20-%20MiniMap%20-%20Macro%20-%20Bots%20Coming%20Soon.meta.js
// ==/UserScript==
//
// DO NOT TRY TO CHANGE ANYTHING CODE WILL MOSTLY BREAK
// LICENSED BY ECHOSERVICE.CC COMPANY OF LOKISDREAMS
// STEALING OR CHANGING CODE ISNT ALLOWED SO PLEASE RESPECT THAT AND HAVE FUN!
// LAST UPDATE 3/17/2025 4:51 AM
//
//                 # LOKI ON TOP #
//         # LOKI ON TOP # # LOKI ON TOP #
//      # LOKI ON TOP #      # LOKI ON TOP #
//      # LOKI ON TOP #  0   # LOKI ON TOP #
//      # LOKI ON TOP #      # LOKI ON TOP #
//        # LOKI ON TOP # # LOKI ON TOP #
//                # LOKI ON TOP #
//

(function() {
    "use strict";

    // Canvas Modding to change leaderboard text to red
    function canvasModding() {
        var proxiedFillText = CanvasRenderingContext2D.prototype.fillText;
        CanvasRenderingContext2D.prototype.fillText = function() {
            this.fillStyle = "red"; // Set text color to red

            if (arguments[0] == "Leaderboard") {
                arguments[0] = "👻 LokisMod"; // Change Leaderboard title
            }
            return proxiedFillText.apply(this, arguments);
        };

        var proxiedStrokeText = CanvasRenderingContext2D.prototype.strokeText;
        CanvasRenderingContext2D.prototype.strokeText = function() {
            this.strokeStyle = "red"; // Make text outline red
            return proxiedStrokeText.apply(this, arguments);
        };
    }

    // Start Canvas Modding after the game has loaded
    setTimeout(function() {
        canvasModding(); // Apply Leaderboard Modifications
    }, 3000); // Wait for 3 seconds for the game to load
})();

// Funktion, um den Titel zu ändern
   function changeTitleText() {
     const titleElement = document.getElementById("title");
      if (titleElement) {
       titleElement.textContent = "LokisMod"; // Titel zu "👻LokisMod👻" ändern
        titleElement.style.color = "red"; // Titelfarbe auf Rot setzen
    }
}

// Warten, bis die Seite geladen ist, und den Titel nach einer kurzen Verzögerung ändern
window.addEventListener("load", function() {
    setTimeout(changeTitleText, 1000); // 1 Sekunde warten, bis die Elemente geladen sind
});

    let lastTime = 0;
    let fps = 0;
    let frameCount = 0;
    let fpsDisplay;
    let pingDisplay;
    let ping = 0;

    // Funktion, um die FPS- und Ping-Anzeige zu erstellen
    function createDisplay() {
        // FPS-Anzeige erstellen
        fpsDisplay = document.createElement("div");
        fpsDisplay.style.position = "absolute";
        fpsDisplay.style.top = "10px";
        fpsDisplay.style.left = "10px";
        fpsDisplay.style.fontSize = "20px";
        fpsDisplay.style.color = "white";
        fpsDisplay.style.fontFamily = "Arial, sans-serif";
        fpsDisplay.style.zIndex = "9999";
        fpsDisplay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        fpsDisplay.style.padding = "5px 10px";
        fpsDisplay.style.borderRadius = "5px";
        document.body.appendChild(fpsDisplay);

        // Ping-Anzeige erstellen
        pingDisplay = document.createElement("div");
        pingDisplay.style.position = "absolute";
        pingDisplay.style.top = "40px";
        pingDisplay.style.left = "10px";
        pingDisplay.style.fontSize = "20px";
        pingDisplay.style.color = "white";
        pingDisplay.style.fontFamily = "Arial, sans-serif";
        pingDisplay.style.zIndex = "9999";
        pingDisplay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        pingDisplay.style.padding = "5px 10px";
        pingDisplay.style.borderRadius = "5px";
        document.body.appendChild(pingDisplay);
    }

    // Funktion zur Berechnung der FPS
    function calculateFPS() {
        frameCount++;
        const currentTime = performance.now();
        const deltaTime = currentTime - lastTime;

        if (deltaTime >= 1000) {
            fps = frameCount;
            frameCount = 0;
            lastTime = currentTime;
        }

        // Zeige die FPS im Element an
        if (fpsDisplay) {
            fpsDisplay.textContent = "FPS: " + fps;
        }

        // Rufe die Funktion erneut auf
        requestAnimationFrame(calculateFPS);
    }

    // Funktion zur Messung des Pings
    function measurePing() {
        const startTime = Date.now();
        const ws = new WebSocket('wss://agar.io'); // Standard WebSocket-URL für Agar.io (ändern, falls benötigt)

        ws.onopen = () => {
            const latency = Date.now() - startTime;
            ping = latency;
            ws.close();
        };

        ws.onerror = () => {
            ping = "N/A"; // Falls ein Fehler beim Ping auftritt
        };

        // Zeige den Ping im Element an
        if (pingDisplay) {
            pingDisplay.textContent = "Ping: " + ping + " ms";
        }

        // Wiederhole den Ping-Test alle 5 Sekunden
        setTimeout(measurePing, 5000);
    }

    // Starte das Skript
    window.addEventListener("load", function() {
        setTimeout(() => {
            createDisplay();
            calculateFPS();
            measurePing();
        }, 1000); // 1 Sekunde warten, bis die Seite vollständig geladen ist
    });

var Feed = false;
var Speed = 50;

// Functions
function split() {
    $("body").trigger($.Event("keydown", { keyCode: 32 }));
    $("body").trigger($.Event("keyup", { keyCode: 32 }));
}

function mass() {
    if (Feed) {
        window.onkeydown({ keyCode: 87 });
        window.onkeyup({ keyCode: 87 });
        setTimeout(mass, Speed);
    }
}

function keydown(event) {
    switch (event.keyCode) {
        // Feed Macro - Q Key
        case 81:                                        // Q
            Feed = true;
            setTimeout(mass, Speed);
            break;

        // Center Mouse - S Key
        case 83:                                       // S
            var X = window.innerWidth / 2;
            var Y = window.innerHeight / 2;
            $("canvas").trigger($.Event("mousemove", { clientX: X, clientY: Y }));
            break;

        // Tricksplit - Shift + 4
        case 16:                // Shift
            if (event.keyCode == 16 && event.shiftKey) {
                split();
                setTimeout(split, Speed);
                setTimeout(split, Speed * 2);
                setTimeout(split, Speed * 3);
            }
            break;

        // Doublesplit - A Key
        case 65:         // A
            split();
            setTimeout(split, Speed);
            setTimeout(split, Speed * 2);
            break;

        // Triplesplit - D Key
        case 68:         // D
            split();
            setTimeout(split, Speed);
            break;
    }
}

// When Player Lets Go Of Q, It Stops Feeding
function keyup(event) {
    if (event.keyCode == 81) {
        Feed = false;
    }
}

// Mouse Clicks
(function() {
    "use strict";

    // Stelle sicher, dass jQuery verfügbar ist
    if (typeof jQuery === "undefined") {
        var script = document.createElement("script");
        script.src = "https://code.jquery.com/jquery-3.6.0.min.js";
        script.onload = initMouseControls;
        document.head.appendChild(script);
    } else {
        initMouseControls();
    }

    function initMouseControls() {
        console.log("✅ Mouse Controls Loaded!");

        // Warte, bis das Spiel wirklich geladen ist
        let checkCanvas = setInterval(() => {
            let canvas = document.querySelector("canvas");
            if (canvas) {
                clearInterval(checkCanvas);
                setupMouseBindings(canvas);
            }
        }, 500);
    }

    function setupMouseBindings(canvas) {
        console.log("✅ Canvas gefunden! Maussteuerung wird aktiviert...");

        document.addEventListener("mousedown", function(event) {
            switch (event.which) {
                case 1: // Linksklick -> Split
                    split();
                    break;
                case 2: // Mittelklick -> Mehrfach-Split
                    split();
                    setTimeout(split, Speed);
                    setTimeout(split, Speed * 2);
                    setTimeout(split, Speed * 3);
                    break;
                case 3: // Rechtsklick -> Macro Feed aktivieren
                    Feed = true;
                    setTimeout(mass, Speed);
                    break;
            }
        });

        document.addEventListener("mouseup", function(event) {
            if (event.which == 3) { // Rechtsklick loslassen -> Macro Feed deaktivieren
                Feed = false;
            }
        });

        document.addEventListener("contextmenu", function(event) {
            event.preventDefault(); // Blockiert das Kontextmenü
        });
    }
})();

// Add event listeners for keydown and keyup
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

	$(document).ready(function() {
		$(document).on('keydown', function(e) {
			var key = e.which || e.keyCode;
			if(key == 77) { // key M
				core.playersMinimap(1)
				core.setMinimap(1)
			}
		});
	});

"use strict";

const qs = sel => document.querySelector(sel);
const observe = (target, options, callback) => {
	(new MutationObserver(callback)).observe(target, options);
};

let css = "";

// ** Block Advertisements
const scripts = document.getElementsByTagName("script");
const adRegex = /adinplay|amazon-adsystem|doubleclick\.net/;
for (const script of scripts) {
	if (adRegex.test(script.src)) {
		script.parentNode.removeChild(script);
		console.log("removed script", script.src);
	}
}

addEventListener("DOMContentLoaded", () => {
	const mainPanel = qs("#mainPanel");
	const playContainer = qs(".play-container");
	const playElm = qs("#mainui-play");
	const settingsBtn = qs("#settingsButton");
	let settingsElm = null;

	// ** Darken Stuff
	css += `
		#mainui-ads, #mainui-features, #mainui-modes, #mainui-offers,
			#mainui-party, #mainui-play, #mainui-promo, #mainui-user,
			#mainui-settings > .dialog, .tosBox, .agario-party-dialog
		{
			background: #000 !important;
			color: #ddd !important;
			outline: 1.5px solid #ddd;
			border-radius: 0;
		}
		.options, #region, #nick, .potion-slot-container,
			.potion-slot-container > .cover-up, .token > .party-token,
			.party-icon-back,
			#mode_ffa:not(.active):not(:hover),
			#mode_battleroyale:not(.active):not(:hover),
			#mode_teams:not(.active):not(:hover),
			#mode_experimental:not(.active):not(:hover)
		{
			background-color: #000 !important;
			color: #ddd !important;
		}
		#nick::selection, .party-token::selection {
			paddding: 2px;
			background-color: rgba(0, 255, 0, 0.5);
		}
		#mainui-grid > div {
			overflow: visible;
		}
		.label, .progress-bar-text {
			color: #fff !important;
			font-weight: 400;
		}
		@import url('https://fonts.googleapis.com/css?family=Ubuntu');
		body {
			font-family: 'Ubuntu', sans-serif !important;
		}
		#title {
			margin-top: 0 !important;
		}
		#playnick {
			margin-bottom: 40px !important;
		}
		#instructions {
			position: static !important;
			border-top: 1px solid grey;
			border-bottom: 1px solid grey;
			padding: 5px 10px;
		}
		#mainui-play {
			height: auto !important;
		}
		.play-blocker {
			display: none;
		}
		#stats span {
			color: rgba(255, 255, 255, 0.8) !important;
		}
		header {
			top: auto;
			bottom: 0;
		}
	`;
	const lb = qs("#statsTimeLeaderboardContainer");
	lb.lastElementChild.innerText = "Leaderboard";

	// ** Hide Static Ads
	css += `
		#adsTop, #adsBottom, #adsRight, #adsLeft,
			#mainui-ads, #mainui-promo, #socialButtons, .adsbygoogle,
			#agar-io_300x250, #agar-io_970x90
		{
			display: none !important;
		}
	`;

	// ** Canvas Height Correction
	// Really weird that the miniclip dev put the style on the html:
	document.body.parentElement.style = "--bottom-banner-height:0px;";

	// ** Move Settings Back To Center Column
	addEventListener("load", () => {
		settingsBtn.click();
		settingsBtn.parentElement.removeChild(settingsBtn);
		observe(mainPanel, {childList: true}, (mutationList, me) => {
			settingsElm = qs("#mainui-settings");
			if (!settingsElm) return;
			me.disconnect();

			for (const elm of [qs(".actions"), qs("#region"),
				qs("#quality"), qs(".options"), qs("#instructions"),
				qs(".versions")])
			{
				mainPanel.appendChild(elm);
			}
			settingsElm.parentElement.removeChild(settingsElm);
		});
	});
	css += `
		#mainui-settings > .dialog {
			position: static;
			left: 0;
			top: 0;
			transform: translate(0, 0);
			width: 295px;
		}
		.options {
			padding: 0 !important;
		}
		.options label {
			width: auto !important;
		}
		.actions > button {
			width: 130px !important;
		}
		.actions {
			margin-bottom: 15px;
		}
	`;

	// ** Append CSS To DOM
	const style = document.createElement("style");
	style.id = "agarExtras";
	style.innerHTML = css;
	document.head.appendChild(style);
});

let isChecking = false;

(function() {
    const blockedHosts = ["ads", "doubleclick", "googlesyndication", "adservice"];

    // Blockiere fetch-Requests
    const originalFetch = window.fetch;
    window.fetch = function(url, ...args) {
        if (blockedHosts.some(host => url.includes(host))) {
            console.log("[AdBlock] Blocked:", url);
            return Promise.reject("Blocked Ad Request");
        }
        return originalFetch(url, ...args);
    };
})();

function removeAds() {
        let adIframes = document.querySelectorAll('iframe');
        adIframes.forEach(function(iframe) {
            let src = iframe.src.toLowerCase();
            if (src.includes('ads') || src.includes('adserver') || src.includes('doubleclick') || src.includes('googlesyndication')) {
                iframe.remove();
            }
        });

        let adElements = document.querySelectorAll('[id*="adBanner"], [id*="adContainer"], [id*="ad-container"], [class*="adBox"], ' +
            '[class*="ad-container"], [id*="google_ads"], [class*="google_ads"], ' +
            '[id*="agar-io_300x250"], [class*="agar-io_300x250"], ' +
            '[id*="agar-io_160x600"], [class*="agar-io_160x600"], ' +
            '[id*="google_ads_iframe"], [class*="google_ads_iframe"], ' +
            '[id*="agar-io_160x600_2"], [class*="agar-io_160x600_2"], ' +
            '[id*="agar-io_970x90"], [class*="agar-io_970x90"], ' +
            '#preroll, .preroll, #adsBottom, .adsBottom, [id^="google_ads"], ' +
            '[id*="divFullscreenLoading"], [class*="divFullscreenLoading"]');
        adElements.forEach(function(ad) {
            ad.remove();
        });
    }

    function adjustBannerHeight() {
        document.documentElement.style.setProperty('--bottom-banner-height', '0px');
    }

    function clearUnused() {
        let oldAds = document.querySelectorAll('.old-ad');
        oldAds.forEach(ad => {
            ad.remove();
            ad = null;
        });
    }

    function update() {
        clearUnused();
        requestAnimationFrame(update);
    }

    function checkAds() {
        if (!isChecking) {
            isChecking = true;
            removeAds();
            adjustBannerHeight();
            isChecking = false;
        }
    }

window.onload = function() {
        // Sichert, dass das Canvas-Element existiert
        var canvas = document.getElementById("canvas");
        if (canvas) {
            var ctx = canvas.getContext("2d");
        }

        // Ersetzt die Titel- und Header-Elemente
        $("h2").replaceWith('<h2>LokisMod Agar.io</h2>');
        $("title").replaceWith('<title>LokisMod Agar.io</title>');
        $("h1").replaceWith('<h1>LokisMod Agar.io</h1>');
    };

    window.onload = function() {
        // Creating a toggle button for the menu
        const toggleButton = document.createElement('button');
        toggleButton.innerText = 'Toggle Menu';
        toggleButton.style.position = 'fixed';
        toggleButton.style.top = '80px'; // Adjusted to be slightly lower
        toggleButton.style.left = '10px'; // Slightly off from the left edge
        toggleButton.style.zIndex = '9999';
        toggleButton.style.padding = '15px 25px';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.backgroundColor = '#b22222'; // Dark red
        toggleButton.style.border = 'none';
        toggleButton.style.borderRadius = '10px';
        toggleButton.style.color = 'white';
        toggleButton.style.fontSize = '18px';
        toggleButton.style.fontWeight = 'bold';
        toggleButton.style.boxShadow = '0 0 15px rgba(178, 34, 34, 0.7)';
        toggleButton.style.transition = '0.3s ease-out';

        // Animation effect on hover
        toggleButton.onmouseover = function() {
            toggleButton.style.transform = 'scale(1.1)';
            toggleButton.style.boxShadow = '0 0 25px rgba(178, 34, 34, 1)';
        };

        toggleButton.onmouseout = function() {
            toggleButton.style.transform = 'scale(1)';
            toggleButton.style.boxShadow = '0 0 15px rgba(178, 34, 34, 0.7)';
        };

        // Appending the button to the body
        document.body.appendChild(toggleButton);

        // Creating the menu container
        const menu = document.createElement('div');
        menu.id = 'lokisModMenu';
        menu.style.position = 'fixed';
        menu.style.top = '100px'; // Below the toggle button
        menu.style.left = '10px';
        menu.style.width = '250px';
        menu.style.height = '300px';
        menu.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        menu.style.color = 'white';
        menu.style.padding = '10px';
        menu.style.borderRadius = '10px';
        menu.style.boxShadow = '0 0 15px rgba(255, 0, 0, 0.7)';
        menu.style.zIndex = '10000';  // Make sure it shows on top of other elements
        menu.style.display = 'none';  // Initially hidden
        menu.style.transition = '0.3s ease';

        // Adding a glowing border effect on hover
        menu.onmouseover = function() {
            menu.style.boxShadow = '0 0 25px rgba(255, 0, 0, 1)';
        };

        menu.onmouseleave = function() {
            menu.style.boxShadow = '0 0 15px rgba(255, 0, 0, 0.7)';
        };

        // Adding some content to the menu
        const title = document.createElement('h2');
        title.innerText = 'LokisMod Features';
        title.style.textAlign = 'center';
        title.style.marginBottom = '15px';
        title.style.fontFamily = 'Arial, sans-serif';
        title.style.color = '#ff4d4d';
        title.style.textShadow = '0 0 10px rgba(255, 0, 0, 0.7)';
        menu.appendChild(title);

        const featureList = document.createElement('div');
        featureList.innerHTML = `
            <ul>
                <li>Press: A = Double Split </li>
                <li>Press: S = Center Mouse </li>
                <li>Press: M = Minimap </li>
                <li>Press: Q = Macro Feed </li>
                <li>Press: Shift = Tricksplit </li>
                <li>Press: D = Tripple Split </li>
                <li>Click Mouse = Split </li>
                <li>Added FPS Booster </li>
                <li>More Coming Soon </li>
            </ul>
        `;
        featureList.style.listStyle = 'none';
        featureList.style.fontFamily = 'Arial, sans-serif';
        featureList.style.fontSize = '16px';
        featureList.style.color = '#fff';
        menu.appendChild(featureList);

        // Appending the menu to the body
        document.body.appendChild(menu);

        // Toggle the visibility of the menu when the button is clicked
        toggleButton.onclick = function() {
            if (menu.style.display === 'none') {
                menu.style.display = 'block'; // Show the menu
            } else {
                menu.style.display = 'none'; // Hide the menu
            }
        };

        // Making the menu draggable
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        menu.onmousedown = function(e) {
            isDragging = true;
            offsetX = e.clientX - menu.offsetLeft;
            offsetY = e.clientY - menu.offsetTop;
            document.onmousemove = function(e) {
                if (isDragging) {
                    menu.style.left = e.clientX - offsetX + 'px';
                    menu.style.top = e.clientY - offsetY + 'px';
                }
            };
        };

        document.onmouseup = function() {
            isDragging = false;
            document.onmousemove = null;
        };
    };