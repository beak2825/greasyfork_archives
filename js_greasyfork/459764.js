// ==UserScript==
// @name         Better Chunkbase
// @version      0.3
// @description  try to take over the world!
// @author       ericsson
// @match        https://www.chunkbase.com/apps/seed-map
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chunkbase.com
// @run-at       document-idle
// @namespace https://greasyfork.org/users/971247
// @downloadURL https://update.greasyfork.org/scripts/459764/Better%20Chunkbase.user.js
// @updateURL https://update.greasyfork.org/scripts/459764/Better%20Chunkbase.meta.js
// ==/UserScript==

//
// CSS
//

var styleElement = document.createElement('style');
styleElement.innerHTML = `
    #content {
        background: unset;
        margin-top: 0;
        margin-bottom: 0;
        -moz-box-shadow: unset;
        -webkit-box-shadow: #111 0 0 0;
        box-shadow: #111 0 0 0;
    }

    body {
        margin: 0;
    }

    .box {
        margin-bottom: 0;
    }
`;
document.head.appendChild(styleElement);

//
// Other
//

document.querySelector("#pageheader").remove();
document.querySelector("#main > article > div.box > header").remove();
document.querySelector("#main > article > aside:nth-child(3)").remove();
document.querySelector("#seed-footer").remove();
document.querySelector("#comments").remove();
document.querySelector("#pagefooter").remove();

//
// Copy buttons
//

const observer = new MutationObserver(function(mutationsList, observer) {
    console.log(mutationsList)
    var b = document.querySelector("div#tippy-1");
    var d = document.querySelector("div.tippy-content")
    const observer2 = new MutationObserver(function(mutationsList, observer) {
        if (typeof(b) != 'undefined' && b != null && !d.textContent.includes('Coords')) {
            console.log("includit realno")
            d.insertAdjacentHTML('beforeend', '<br><button id="kaka" class="gh-button"> TP </button>');
            document.getElementById("kaka").addEventListener(
                "click", copy, false
            );
            d.insertAdjacentHTML('beforeend', ' <button id="kakashrt" class="gh-button"> Coords </button>');
            document.getElementById("kakashrt").addEventListener(
                "click", copyshrt, false
            );
        }
    })
    observer2.observe(b, {characterData: false, childList: false, attributes: true});
});

waitForElm("div#seed-controls").then((elm) => {
    console.log('+ div#seed-controls');
    const x = document.querySelector("div#seed-controls");
    observer.observe(x, {characterData: false, childList: true});
});

function useRegex2(shrt) {
    const d = document.querySelector("div.tippy-content")
    var matches = [];
    let regex = /X: ([+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*))(?:[Ee]([+-]?\d+))? Z: ([+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*))(?:[Ee]([+-]?\d+))?/;
    var re = new RegExp(regex, "g");
    if (!shrt) {
        while(matches = re.exec(d.innerHTML.replace(/\,/g, ''))) {
            return "/execute in minecraft:" + document.getElementById("biome-dimension-select").value.replace("nether", "the_nether").replace("end", "the_end") + " run tp @s " + matches[1] + " 100 " + matches[3];
        }
    } else {
        while(matches = re.exec(d.innerHTML.replace(/\,/g, ''))) {
            return matches[1] + " " + matches[3];
        }
    }
}

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function copy() {
    console.log(navigator.clipboard.writeText(useRegex2(false)));
}
function copyshrt() {
    console.log(navigator.clipboard.writeText(useRegex2(true)));
}

//
// F3 + C
//

function useRegex(input) {
    var matches = [];
    let regex = /minecraft:([A-Za-z_]+) run tp @s ([+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*))(?:[Ee]([+-]?\d+))? ([+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*))(?:[Ee]([+-]?\d+))? ([+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*))(?:[Ee]([+-]?\d+))?/i;
    var re = new RegExp(regex, "g");
    while(matches = re.exec(input)) {
        console.log("Dimension: " + matches[1] + " X: " + Math.round(matches[2]) + " Y: " + Math.round(matches[6]));
        document.getElementById("map-goto-x").value = Math.round(matches[2])
        document.getElementById("map-goto-z").value = Math.round(matches[6])
        document.getElementById("map-goto-go").click();
    }
}

waitForElm("div.fancy-row.slim").then((elm) => {
    const s = document.querySelector("div.fancy-row.slim")
    s.insertAdjacentHTML('afterbegin', '<input type="text" class="mini" id="popa" name="popa" placeholder="F3 + C">');
    document.getElementById("popa").addEventListener("input", function (e) {
        useRegex(this.value)
    });
});