// ==UserScript==
// @name         xray for starve.io and devast.io
// @version      2025-22-02
// @description  this wont be an end of world trust me
// @match        https://devast.io/*
// @match        https://starve.io/*
// @require      https://unpkg.com/guify@0.12.0/lib/guify.min.js
// @run-at       document-start
// @license MIT
// @grant        none
// @namespace https://greasyfork.org/users/1349814
// @downloadURL https://update.greasyfork.org/scripts/503311/xray%20for%20starveio%20and%20devastio.user.js
// @updateURL https://update.greasyfork.org/scripts/503311/xray%20for%20starveio%20and%20devastio.meta.js
// ==/UserScript==
let log = console.log;

let Settings = {
    xray: {
        enabled: false,
        key: "KeyJ",
        opacity: 0.40
    }
};
let quer = document.querySelectorAll;
document.querySelectorAll = function (data) {
  if (data === `[class*="guify"]`) {
    return false;
  } else {
    quer.apply(this, arguments);
  }
};
document.addEventListener("keydown", (evt) => {
    if(evt.code === Settings.xray.key) {
        Settings.xray.enabled = !Settings.xray.enabled;
    }
});
let ctx

function xray() {
    if(window.location.href === "https://starve.io/") {
        ctx = document.querySelector("canvas").getContext("2d");
    } else {
        ctx = document.getElementById("can").getContext("2d");
    }
    const DrawImage = ctx.drawImage;

    ctx.drawImage = function() {
        if(Settings.xray.enabled) {
            ctx.globalAlpha = Settings.xray.opacity;
        }
        DrawImage.apply(ctx, arguments);
    };
}

const guisif = {
    initial: () => {
        let GUI = new guify({
            title: "Xray",
            theme: {
                name: "Triade Theme",
                colors: {
                    menuBarBackground: "rgb(35, 35, 35)",
                    menuBarText: "rgb(102, 0, 0)",
                    panelBackground: "rgb(0, 0, 0)",
                    componentBackground: "rgb(22, 22, 22)",
                    componentForeground: "rgb(255, 255, 255)",
                    textPrimary: "rgb(255, 255, 255)",
                    textSecondary: "rgb(85, 210, 50)",
                    textHover: "rgb(0, 0, 0)"
                },
                font: {
                    fontFamily: 'Baloo Paaji',
                    fontSize: '16px',
                    fontWeight: '100'
                },
            },
            align: "left",
            width: 350,
            barMode: "none",
            panelMode: "none",
            opacity: .95,
            root: window.container,
            open: true,
            pollRateMS: 100,
        });

        const Tab = " ";
        GUI.Register([{
                type: "checkbox",
                label: Tab + 'Xray',
                object: Settings.xray,
                property: 'enabled',
                onChange: (val) => {
                    Settings.xray.enabled = val;
                }
            },
            {
                type: "range",
                label: Tab + 'Xray Opacity',
                min: 0,
                max: 1,
                step: 0.1,
                object: Settings.xray,
                property: 'opacity',
                scale: "linear",
            },
            {
                type: "display",
                label: "Xray Key:",
                object: Settings.xray,
                property: "key"
            },
            {
                type: "button",
                label: "Set Xray Key",
                action: () => {
                    guisif.controls.setKeyBind("xray");
                }
            },
        ]);
    },

    controls: null,

    controller: class {
        setKeyBind(property) {
            Settings[property].key = "Press any key";
            let keyPressCount = 0;

            document.addEventListener("keydown", function onKeyDown(event) {
                keyPressCount++;
                if(keyPressCount >= 1) {
                    Settings[property].key = event.code === "Escape" ? "NONE" : event.code;
                    document.removeEventListener("keydown", onKeyDown);
                    guisif.saveSettings();
                }
            });
        }
    },

    saveSettings: () => {
        for(let key in Settings) {
            localStorage.setItem(key + "danb", JSON.stringify(Settings[key]));
        }
    },

    loadSettings: () => {
        for(let key in Settings) {
            let storedSetting = localStorage.getItem(key + "danb");
            if(storedSetting) {
                Settings[key] = JSON.parse(storedSetting);
            }
        }
    },

    loadHack: () => {
        guisif.controls = new guisif.controller();
        guisif.loadSettings();
        guisif.initial();
        guisif.saveSettings();
    }
}

let removeAds = () => {
    let prerollAd = document.getElementById("preroll");
    if(window.location.href !== "https://devast.io/") {
        let trevdaAd = document.getElementById("trevda");
        let style = document.createElement("style");
        style.innerHTML = ".grecaptcha-badge { visibility: hidden; }";
        document.head.appendChild(style);
        if(trevdaAd) trevdaAd.remove();
    }
    if(prerollAd) prerollAd.remove();

    const observer = new MutationObserver(function(mutations) {
        for(const mutation of mutations) {
            for(const node of mutation.addedNodes) {
                if(
                    node.src &&
                    (
                        node.src.includes("server.cmpstar.net") ||
                        node.src.includes("sdk.truepush.com") ||
                        node.src.includes("sdki.truepush.com") ||
                        node.src.includes("adinplay") ||
                        node.src.includes("amazon-adsystem.com") ||
                        node.src.includes("www.google-analytics.com") ||
                        node.src.includes("ib.adnxs.com") ||
                        node.src.includes("targeting.unrulymedia.com") ||
                        node.src.includes("www.google-analytics.com") ||
                        node.src.includes("pagead2.googlesyndication.com") ||
                        node.src.includes("doubleclick.net") ||
                        node.src.includes("script.4dex.io")
                    )
                ) {
                    node.src = "";
                    node.innerHTML = "";
                    node.textContent = "";
                }

                if(node.className === "wg-ad-container") {
                    setTimeout(function() {
                        const ad = document.querySelector(".wg-ad-player");
                        ad.currentTime = 20;
                        const holder = ad.parentElement;
                        holder.style.display = 'none';
                    }, 1);
                }
            }
        }
    });

    observer.observe(document, {
        childList: true,
        attributes: true,
        subtree: true
    });

}

function checker() {

    window.dc = atob("d3p2dg==");
    xray();
    guisif.loadHack();
    log("r");

}

setTimeout(checker, 5000)