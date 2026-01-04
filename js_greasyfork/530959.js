// ==UserScript==
// @name         Discord Visual Refresh Fixes
// @namespace    http://tampermonkey.net/
// @license      CC0-1.0
// @version      0.2.0
// @description  1) Removes the useless title bar.  2) Centers the chatbox with the userbox.  3) Moves Inbox to its old location.
// @author       20kdc, kimbjo
// @match        https://discordapp.com/*
// @match        https://discord.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530959/Discord%20Visual%20Refresh%20Fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/530959/Discord%20Visual%20Refresh%20Fixes.meta.js
// ==/UserScript==

/*
Written by 20kdc
To the extent possible under law, the author(s) have dedicated all copyright and related and neighboring rights to this software to the public domain worldwide. This software is distributed without any warranty.
You should have received a copy of the CC0 Public Domain Dedication along with this software. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
*/

// Since iterating through the entire DOM would be performance suicide,
//  let's try to detect classes in ANY OTHER WAY.
var dragonequus;
dragonequus = {
    version: 6.0,
    getAllClassesLen: 0,
    getAllClassesCache: [],
    getAllClasses: function () {
        var sheets = document.styleSheets;
        if (sheets.length == dragonequus.getAllClassesLen) {
            return dragonequus.getAllClassesCache;
        }
        var workspace = [];
        var seen = {};
        for (var k = 0; k < sheets.length; k++) {
            var sheet = sheets[k];
            for (var k2 = 0; k2 < sheet.cssRules.length; k2++) {
                var rule = sheet.cssRules[k2];
                if (rule.type == CSSRule.STYLE_RULE) {
                    // .A:I .B:I, .A .B
                    var majors = rule.selectorText.split(",");
                    for (var k3 = 0; k3 < majors.length; k3++) {
                        var minors = majors[k3].split(" ");
                        for (var k4 = 0; k4 < minors.length; k4++) {
                            // Minor starts off as say .A:B
                            var minor = minors[k4];
                            // Must be class
                            if (!minor.startsWith("."))
                                continue;
                            // Cut off any : and remove .
                            var selectorBreak = minor.indexOf(":");
                            if (selectorBreak != -1) {
                                minor = minor.substring(1, selectorBreak);
                            } else {
                                minor = minor.substring(1);
                            }
                            if (seen[minor])
                                continue;
                            seen[minor] = true;
                            workspace.push(minor);
                        }
                    }
                }
            }
        }
        dragonequus.getAllClassesLen = sheets.length;
        dragonequus.getAllClassesCache = workspace;
        return workspace;
    },
    isValidDC: function (obfuscated, real) {
        if (!(obfuscated.startsWith(real + "-") || obfuscated.startsWith(real + "_")))
            return false;
        if (obfuscated.length != real.length + 7)
            return false;
        return true;
    },
    findAllByDiscordClass: function (name) {
        var q = [];
        var q2 = document.querySelectorAll("." + name);
        for (var k2 = 0; k2 < q2.length; k2++)
            q.push(q2[k2]);
        var classes = dragonequus.getAllClasses();
        for (var k in classes) {
            var n = classes[k];
            if (dragonequus.isValidDC(n, name)) {
                q2 = document.querySelectorAll("." + n);
                for (var k2 = 0; k2 < q2.length; k2++)
                    q.push(q2[k2]);
            }
        }
        return q;
    },
    findByDiscordClass: function (name) {
        var all = dragonequus.findAllByDiscordClass(name);
        if (all.length > 0)
            return all[0];
        return null;
    },
    toDiscordClasses: function (name) {
        var classes = dragonequus.getAllClasses();
        var all = [];
        for (var k in classes) {
            var n = classes[k];
            if (dragonequus.isValidDC(n, name))
                all.push(n);
        }
        all.push(name);
        return all;
    },
    toDiscordClass: function (name) {
        return dragonequus.toDiscordClasses(name)[0];
    },
    hasDiscordLoaded: function () {
        return dragonequus.findByDiscordClass("sidebarList") != null;
    },
    onDiscordLoadedCollection: [],
    onDiscordLoaded: function (fn) {
        if (dragonequus.onDiscordLoadedCollection) {
            dragonequus.onDiscordLoadedCollection.push(fn);
        } else {
            fn();
        }
    },
    _discordLoadDetector: setInterval(function () {
        if (dragonequus.hasDiscordLoaded()) {
            clearInterval(dragonequus._discordLoadDetector);
            var dlc = dragonequus.onDiscordLoadedCollection;
            dragonequus.onDiscordLoadedCollection = null;
            for (var i = 0; i < dlc.length; i++) {
                dlc[i]();
            }
        }
    }, 100),
    injectCSSRulesNow: function (rules) {
        var styleElm = document.createElement('style');
        // console.log("dragonequus CSS:", rules);
        document.body.appendChild(styleElm);
        for (var i = 0; i < rules.length; i++)
            styleElm.sheet.insertRule(rules[i], 0);
    },
    injectCSSRules: function (getRules) {
        dragonequus.onDiscordLoaded(function () {
            dragonequus.injectCSSRulesNow(getRules());
        });
    },
    injectCSSForClassScript: function (clazz, css) {
        dragonequus.injectCSSRules(function () {
            var classes = dragonequus.toDiscordClasses(clazz);
            var total = [];
            for (var i = 0; i < classes.length; i++) {
                // This is stupid.
                // This is really, really stupid.
                total.push(".visual-refresh ." + classes[i] + " { " + css + " }");
                total.push("." + classes[i] + " { " + css + " }");
            }
            return total;
        });
    },
};

// --- Detect chatbox bottom margin ---
function adjustChatInputMargin() {
    const rootElement = document.documentElement;
    const densityClass = Array.from(rootElement.classList)
        .find(cls => cls.startsWith('density-'));

    let marginBottom;

    switch (densityClass) {
        case 'density-compact':
            marginBottom = '6.5px';
            break;
        case 'density-default':
            marginBottom = '10.5px';
            break;
        case 'density-cozy':
            marginBottom = '12.5px';
            break;
        default:
            marginBottom = '10.5px';
    }

    dragonequus.injectCSSForClassScript("container", "--custom-chat-input-margin-bottom: " + marginBottom + " !important;");
}

dragonequus.injectCSSForClassScript("bar", "height: 0 !important; min-height: 0 !important; opacity: 0 !important;");
dragonequus.injectCSSForClassScript("base", "grid-template-rows: [top] 0fr [titleBarEnd] 0fr [noticeEnd] 1fr [end];");
dragonequus.injectCSSForClassScript("guilds", "margin-top: 5px;");
dragonequus.injectCSSForClassScript("sidebarListRounded", "border-top-left-radius: 0px !important;");
adjustChatInputMargin();

// Observe for class changes if the density might change dynamically
const observer = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
        if (mutation.type === 'attributes' &&
            mutation.attributeName === 'class') {
            adjustChatInputMargin();
        }
    }
});

observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
});

// --- Add Duplicate Recents Inbox Button ---
// This code creates a duplicate button for the Recents Inbox and mounts it in the toolbar.
// When clicked, it simulates a click on the hidden Recents button (the one with a class containing 'recentsIcon').

(function () {
    // Helper to inject CSS styles.
    function insertCss(css) {
        var style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    // Inject styles for our custom Recents button.
    insertCss(`
        #recents-copy-btn {
            position: relative;
            height: 24px;
            width: auto;
            flex: 0 0 auto;
            margin: 0 8px;
            cursor: pointer;
            color: var(--interactive-normal);
        }
    `);

    // Create the custom Recents button.
    function createRecentsButton() {
        var btn = document.createElement('div');
        btn.id = 'recents-copy-btn';
        btn.tabIndex = 0;
        btn.setAttribute('role', 'button');
        btn.setAttribute('aria-label', 'Recents Inbox');
        btn.title = 'Recents Inbox';

        // Using an SVG icon. You can adjust the paths to match the original Recents icon as needed.
        btn.innerHTML = `<svg aria-hidden="false" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" fill-rule="evenodd" d="M5 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3H5ZM4 5.5C4 4.67 4.67 4 5.5 4h13c.83 0 1.5.67 1.5 1.5v6c0 .83-.67 1.5-1.5 1.5h-2.65c-.5 0-.85.5-.85 1a3 3 0 1 1-6 0c0-.5-.35-1-.85-1H5.5A1.5 1.5 0 0 1 4 11.5v-6Z" clip-rule="evenodd" class=""></path>
        </svg>`;

        btn.onclick = function () {
            // Find the hidden original Recents button and trigger its click
            var origParent = document.querySelector('[class^="recentsIcon"]');
            if (origParent) {
                var actualButton = origParent.querySelector('div[role="button"][aria-label="Inbox"]');
                if (actualButton) {
                    actualButton.click();
                }
            }
        };
        return btn;
    }

    // Mount the custom button into the toolbar.
    function mountRecentsButton() {
        var toolbar = document.querySelector('[class^="toolbar"]');
        if (toolbar && !document.getElementById('recents-copy-btn')) {
            var btn = createRecentsButton();
            toolbar.appendChild(btn);
        }
    }

    // Use a MutationObserver to ensure the button stays in the toolbar even if Discord re-renders the DOM.
    var observer = new MutationObserver(function () {
        mountRecentsButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    mountRecentsButton();
})();
