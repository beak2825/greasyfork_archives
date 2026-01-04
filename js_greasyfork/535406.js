// ==UserScript==
// @name         Precision Blurple
// @namespace    http://tampermonkey.net/
// @version      1.03
// @description  Add functionality to place via command text.
// @author       Esja & Pum
// @match        https://canvas.projectblurple.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=projectblurple.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535406/Precision%20Blurple.user.js
// @updateURL https://update.greasyfork.org/scripts/535406/Precision%20Blurple.meta.js
// ==/UserScript==

(function() {
    // Set up beep
    const audio = new Audio("https://cdn.discordapp.com/soundboard-sounds/1188117451548930128");
    function beep() {
        try {
            audio.play();
        }
        catch(ex) {
            /*beep without using an audio file*/
            var context = new AudioContext();
            var oscillator = context.createOscillator();
            oscillator.type = "sine";
            oscillator.frequency.value = 800;
            oscillator.connect(context.destination);
            oscillator.start();
            // Beep for 500 milliseconds
            setTimeout(function () {
                oscillator.stop();
            }, 100);
        }
    }
    // Color information
    const colors = [
    {
        "id": 0,
        "code": "ptnr",
        "desc": "Partner Blue"
    },
    {
        "id": 1,
        "code": "blank",
        "desc": "Blank tile"
    },
    {
        "id": 2,
        "code": "ntbl",
        "desc": "Nitro Blue"
    },
    {
        "id": 3,
        "code": "grpl",
        "desc": "Greyple"
    },
    {
        "id": 5,
        "code": "ldbp",
        "desc": "Legacy Dark Blurple"
    },
    {
        "id": 6,
        "code": "bstp",
        "desc": "Boost Pink"
    },
    {
        "id": 7,
        "code": "devl",
        "desc": "Developer Blue"
    },
    {
        "id": 8,
        "code": "dgry",
        "desc": "Dark Mode Grey"
    },
    {
        "id": 9,
        "code": "whte",
        "desc": "Full White"
    },
    {
        "id": 10,
        "code": "ntgr",
        "desc": "Nitro Grey"
    },
    {
        "id": 11,
        "code": "brll",
        "desc": "Brilliance Red"
    },
    {
        "id": 12,
        "code": "blnc",
        "desc": "Balance Cyan"
    },
    {
        "id": 13,
        "code": "hpsq",
        "desc": "Hypesquad Yellow"
    },
    {
        "id": 14,
        "code": "lbpl",
        "desc": "Legacy Blurple"
    },
    {
        "id": 15,
        "code": "bhnt",
        "desc": "Bug Hunter Green"
    },
    {
        "id": 16,
        "code": "brvy",
        "desc": "Bravery Purple"
    },
    {
        "id": 17,
        "code": "nqbl",
        "desc": "Not Quite Black"
    },
    {
        "id": 18,
        "code": "blpl",
        "desc": "Blurple"
    },
    {
        "id": 19,
        "code": "dbpl",
        "desc": "Dark Blurple"
    },
    {
        "id": 20,
        "code": "fchs",
        "desc": "Discord Fuchsia"
    },
    {
        "id": 21,
        "code": "dred",
        "desc": "Discord Red"
    },
    {
        "id": 22,
        "code": "yllw",
        "desc": "Discord Yellow"
    },
    {
        "id": 23,
        "code": "gren",
        "desc": "Discord Green"
    },
    {
        "id": 24,
        "code": "mrvl",
        "desc": "Marvel Red"
    },
    {
        "id": 25,
        "code": "ttsu",
        "desc": "Tatsu Emerald"
    },
    {
        "id": 30,
        "code": "wocb",
        "desc": "WoC Blue"
    },
    {
        "id": 31,
        "code": "sptf",
        "desc": "Spotify Green"
    },
    {
        "id": 38,
        "code": "nnja",
        "desc": "Scrolls of Forbidden Spinjitzu"
    },
    {
        "id": 44,
        "code": "fwss",
        "desc": "FishWiki Sunset"
    },
    {
        "id": 127,
        "code": "blkp",
        "desc": "Blackhole Plasma"
    },
    {
        "id": 40,
        "code": "ltus",
        "desc": "White Lotus"
    },
    {
        "id": 129,
        "code": "terr",
        "desc": "Terraria Green"
    },
    {
        "id": 130,
        "code": "dngo",
        "desc": "Dango Purple"
    },
    {
        "id": 128,
        "code": "draw",
        "desc": "Pencil"
    },
    {
        "id": 131,
        "code": "dkcr",
        "desc": "Dark Crimson"
    },
    {
        "id": 132,
        "code": "xgrn",
        "desc": "Extreme Green"
    }
]

    // Create button
    let btn = document.createElement("button");
    btn.innerHTML = "Precision Placer";
    btn.onclick = () => {
        // Cooldown logic
        const lastPlaced = sessionStorage.getItem('precision_blurple_last_placed');
        const now = Date.now();
        if (lastPlaced && now - parseInt(lastPlaced) < 15000) {
            const secondsLeft = Math.ceil((15000 - (now - parseInt(lastPlaced))) / 1000);
            alert(`Please wait ${secondsLeft} more second${secondsLeft !== 1 ? 's' : ''} before placing again.`);
            return;
        }
        let cmd = prompt("Enter the blurple command you wish to place:");

        const [_, xPart, yPart, colorPart] = cmd.split(':');
        const x = parseInt(xPart.split(' ')[0].trim())-1;
        const y = parseInt(yPart.split(' ')[0].trim())-1;
        const colorcode = colorPart.split(' ')[0].trim();

        // Find the color code that belongs to this color code
        let colorId = colors.find(x => x.code == colorcode).id;

        let requestBody = {x:x, y:y, colorId:colorId};
        console.log(requestBody);

        // Send the request to the server
        fetch("https://canvas.projectblurple.com/api/v1/canvas/2025/pixel", {
          method: "POST",
          body: JSON.stringify(requestBody),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then(() => {
            sessionStorage.setItem('precision_blurple_last_placed', Date.now().toString());
            btn.disabled = true;
            let cooldown = 15;
            btn.innerText = `Precision Placer (wait ${cooldown}s)`;
            const interval = setInterval(() => {
              cooldown--;
              if (cooldown > 0) {
                btn.innerText = `Precision Placer (wait ${cooldown}s)`;
              } else {
                btn.innerText = 'Precision Placer';
                btn.disabled = false;
                clearInterval(interval);
                beep();
              }
            }, 1000);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
    };
    console.log(btn);

    window.addEventListener('load', function() {
        // find the location for the button and insert it
        const t = Array.from(document.querySelectorAll('div')).find(el => el.textContent.trim() === 'No color selected');
        t.before(btn);
        // On load, check if cooldown is active, if it is, disable the button and show the cooldown
        const lastPlaced = sessionStorage.getItem('precision_blurple_last_placed');
        if (lastPlaced) {
            const now = Date.now();
            const diff = now - parseInt(lastPlaced);
            if (diff < 15000) {
                btn.disabled = true;
                let cooldown = Math.ceil((15000 - diff) / 1000);
                btn.innerText = `Precision Placer (wait ${cooldown}s)`;
                const interval = setInterval(() => {
                    cooldown--;
                    if (cooldown > 0) {
                        btn.innerText = `Precision Placer (wait ${cooldown}s)`;
                    } else {
                        btn.innerText = 'Precision Placer';
                        btn.disabled = false;
                        clearInterval(interval);
                    }
                }, 1000);
            }
        }
    }, false);

})();