// ==UserScript==
// @name        graduated version of ᏞϴᎡᎠ亗ᴢᴏᴅɪᴀᴄ CLIENT 3.0
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  ITS A BLOXD IO CLIENT
// @author       Der_Ickinger
// @match        https://bloxd.io/
// @icon         data:image/png;base64,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
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480418/graduated%20version%20of%20%E1%8F%9E%CF%B4%E1%8E%A1%E1%8E%A0%E4%BA%97%E1%B4%A2%E1%B4%8F%E1%B4%85%C9%AA%E1%B4%80%E1%B4%84%20CLIENT%2030.user.js
// @updateURL https://update.greasyfork.org/scripts/480418/graduated%20version%20of%20%E1%8F%9E%CF%B4%E1%8E%A1%E1%8E%A0%E4%BA%97%E1%B4%A2%E1%B4%8F%E1%B4%85%C9%AA%E1%B4%80%E1%B4%84%20CLIENT%2030.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Create the CPS counter elements
    var leftCpsCounter = document.createElement('div');
    leftCpsCounter.style.position = 'fixed';
    leftCpsCounter.style.bottom = '10px';
    leftCpsCounter.style.right = '10px';
    leftCpsCounter.style.padding = '5px';
    leftCpsCounter.style.background = 'transperent';
    leftCpsCounter.style.color = '#fff';
    leftCpsCounter.style.fontFamily = 'Arial, sans-serif';
    leftCpsCounter.style.fontSize = '12px';
    leftCpsCounter.style.zIndex = '9999';

    var rightCpsCounter = document.createElement('div');
    rightCpsCounter.style.position = 'fixed';
    rightCpsCounter.style.bottom = '30px';
    rightCpsCounter.style.right = '10px';
    rightCpsCounter.style.padding = '5px';
    rightCpsCounter.style.background = 'transperent';
    rightCpsCounter.style.color = '#fff';
    rightCpsCounter.style.fontFamily = 'Arial, sans-serif';
    rightCpsCounter.style.fontSize = '12px';
    rightCpsCounter.style.zIndex = '9999';

    // Append the CPS counters to the body
    document.body.appendChild(leftCpsCounter);
    document.body.appendChild(rightCpsCounter);

    // Variables to track click counts
    var leftClicks = 0;
    var rightClicks = 0;

    // Function to update the CPS counters
    function updateCPS() {
        leftCpsCounter.textContent = 'Left CPS: ' + leftClicks;
        rightCpsCounter.textContent = 'Right CPS: ' + rightClicks;
        leftClicks = 0;
        rightClicks = 0;
    }

    // Event listener for left click
    document.addEventListener('mousedown', function(event) {
        if (event.button === 0) {
            leftClicks++;
        } else if (event.button === 2) {
            rightClicks++;
        }
    });

    // Start updating the CPS counters every second
    setInterval(updateCPS, 1000);
})();


(function() {
    'use strict';

    setInterval(function() {
        const hotbarslots = document.querySelectorAll(".item");
        const selectedslot = document.querySelectorAll(".SelectedItem");
        if (hotbarslots) {
            hotbarslots.forEach(function(hotbar) {
                hotbar.style.borderColor = "#000000";
                hotbar.style.borderRadius = "5px";
                hotbar.style.backgroundColor = "transparent";
                hotbar.style.outline = "transparent"
            });
        }
        if (selectedslot) {
            selectedslot.forEach(function(slot) {
                slot.style.backgroundColor = "transparent";
                slot.style.borderColor = "#659400";
                slot.style.outline = "transparent";
            });
        }
    }, 1);
})();
    setInterval(function() {
    const crosshair = document.querySelector(".CrossHair");
    if (crosshair) {
        crosshair.textContent = "✕";
        crosshair.style.width = "20px";
        crosshair.style.height = "20px";
    }
}, 1000);
(function() {
    'use strict';

    // Erstellen Sie das Anzeigeelement für 'S'
    var displayElementS1 = createDisplayElement('S', 10, 10);

    // Erstellen Sie das Anzeigeelement für 'U'
    var displayElementU = createDisplayElement('U', 60, 10);

    // Erstellen Sie das Anzeigeelement für ein weiteres 'S' unterhalb von 'U'
    var displayElementS2 = createDisplayElement('S', 110, 10);

    // Überwachen Sie Tastenanschläge
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Funktion zum Generieren von Regenbogenfarben
    function generateRainbowColor() {
        var frequency = 0.1;
        var red = Math.sin(frequency * Date.now() + 0) * 127 + 128;
        var green = Math.sin(frequency * Date.now() + 2) * 127 + 128;
        var blue = Math.sin(frequency * Date.now() + 4) * 127 + 128;
        return `rgb(${Math.round(red)}, ${Math.round(green)}, ${Math.round(blue)})`;
    }

    // Hilfsfunktion zur Erstellung von Anzeigeelementen
    function createDisplayElement(letter, top, right) {
        var displayElement = document.createElement('div');
        displayElement.style.position = 'fixed';
        displayElement.style.top = top + 'px';
        displayElement.style.right = right + 'px';
        displayElement.style.padding = '10px';
        displayElement.style.borderRadius = '5px';
        displayElement.style.color = 'white';
        displayElement.style.background = 'rgba(128, 128, 128, 0.5)'; // Transparent grau
        displayElement.style.zIndex = '9999';
        displayElement.innerHTML = letter;
        document.body.appendChild(displayElement);
        return displayElement;
    }

    // Behandeln Sie das Keydown-Ereignis
    function handleKeyDown(e) {
        if (e.key.toLowerCase() === 's') {
            // Ändern Sie die Hintergrundfarbe von beiden 'S'-Elementen in Regenbogenfarben
            displayElementS1.style.background = generateRainbowColor();
            displayElementS2.style.background = generateRainbowColor();
        } else if (e.key.toLowerCase() === 'u') {
            // Ändern Sie die Hintergrundfarbe von 'U' in Regenbogenfarben
            displayElementU.style.background = generateRainbowColor();
        }
    }

    // Behandeln Sie das Keyup-Ereignis
    function handleKeyUp(e) {
        if (e.key.toLowerCase() === 's') {
            // Setzen Sie die Hintergrundfarbe von beiden 'S'-Elementen auf transparent grau zurück
            displayElementS1.style.background = 'rgba(128, 128, 128, 0.5)';
            displayElementS2.style.background = 'rgba(128, 128, 128, 0.5)';
        } else if (e.key.toLowerCase() === 'u') {
            // Setzen Sie die Hintergrundfarbe von 'U' auf transparent grau zurück
            displayElementU.style.background = 'rgba(128, 128, 128, 0.5)';
        }
    }
})();
(function() {
    'use strict';

    // Erstellen Sie das Anzeigeelement für 'S'
    var displayElementS = createDisplayElement('S', 10, 10);

    // Erstellen Sie das Anzeigeelement für 'U'
    var displayElementU = createDisplayElement('U', 60, 10);

    // Überwachen Sie Tastenanschläge
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Funktion zum Generieren von Regenbogenfarben
    function generateRainbowColor() {
        var frequency = 0.1;
        var red = Math.sin(frequency * Date.now() + 0) * 127 + 128;
        var green = Math.sin(frequency * Date.now() + 2) * 127 + 128;
        var blue = Math.sin(frequency * Date.now() + 4) * 127 + 128;
        return `rgb(${Math.round(red)}, ${Math.round(green)}, ${Math.round(blue)})`;
    }

    // Hilfsfunktion zur Erstellung von Anzeigeelementen
    function createDisplayElement(letter, top, right) {
        var displayElement = document.createElement('div');
        displayElement.style.position = 'fixed';
        displayElement.style.top = top + 'px';
        displayElement.style.right = right + 'px';
        displayElement.style.padding = '10px';
        displayElement.style.borderRadius = '5px';
        displayElement.style.color = 'white';
        displayElement.style.background = 'rgba(128, 128, 128, 0.5)'; // Transparent grau
        displayElement.style.zIndex = '9999';
        displayElement.innerHTML = letter;
        document.body.appendChild(displayElement);
        return displayElement;
    }

    // Behandeln Sie das Keydown-Ereignis
    function handleKeyDown(e) {
        if (e.key.toLowerCase() === 's') {
            // Ändern Sie die Hintergrundfarbe von 'S' in Regenbogenfarben
            displayElementS.style.background = generateRainbowColor();
        } else if (e.key.toLowerCase() === 'u') {
            // Ändern Sie die Hintergrundfarbe von 'U' in Regenbogenfarben
            displayElementU.style.background = generateRainbowColor();
        }
    }

    // Behandeln Sie das Keyup-Ereignis
    function handleKeyUp(e) {
        if (e.key.toLowerCase() === 's') {
            // Setzen Sie die Hintergrundfarbe von 'S' auf transparent grau zurück
            displayElementS.style.background = 'rgba(128, 128, 128, 0.5)';
        } else if (e.key.toLowerCase() === 'u') {
            // Setzen Sie die Hintergrundfarbe von 'U' auf transparent grau zurück
            displayElementU.style.background = 'rgba(128, 128, 128, 0.5)';
        }
    }
})();

(function() {
    'use strict';

    // Erstellen Sie das Anzeigeelement für 'S'
    var displayElement = document.createElement('div');
    displayElement.style.position = 'fixed';
    displayElement.style.top = '10px';
    displayElement.style.right = '10px';
    displayElement.style.padding = '10px';
    displayElement.style.borderRadius = '5px';
    displayElement.style.color = 'white';
    displayElement.style.background = 'rgba(128, 128, 128, 0.5)'; // Transparent grau
    displayElement.style.zIndex = '9999';
    displayElement.innerHTML = 'S';
    document.body.appendChild(displayElement);

    // Überwachen Sie Tastenanschläge
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Fügen Sie benutzerdefinierte Styles hinzu
    GM_addStyle(`
        body {
            margin-right: 30px; /* Platz für das Anzeigeelement */
        }
    `);

    // Funktion zum Generieren von Regenbogenfarben
    function generateRainbowColor() {
        var frequency = 0.1;
        var red = Math.sin(frequency * Date.now() + 0) * 127 + 128;
        var green = Math.sin(frequency * Date.now() + 2) * 127 + 128;
        var blue = Math.sin(frequency * Date.now() + 4) * 127 + 128;
        return `rgb(${Math.round(red)}, ${Math.round(green)}, ${Math.round(blue)})`;
    }

    // Behandeln Sie das Keydown-Ereignis
    function handleKeyDown(e) {
        if (e.key.toLowerCase() === 's') {
            // Ändern Sie die Hintergrundfarbe in Regenbogenfarben
            displayElement.style.background = generateRainbowColor();
        }
    }

    // Behandeln Sie das Keyup-Ereignis
    function handleKeyUp(e) {
        if (e.key.toLowerCase() === 's') {
            // Setzen Sie die Hintergrundfarbe auf transparent grau zurück
            displayElement.style.background = 'rgba(128, 128, 128, 0.5)';
        }
    }
})();

