// ==UserScript==
// @name         Scratch extensions
// @namespace    http://dumo.se
// @version      2024-04-28
// @description  Funny scratch thingys
// @author       You
// @match        https://scratch.mit.edu/*
// @icon         https://scratch.mit.edu/favicon.ico
// @license      BSD-3-Clause
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/493655/Scratch%20extensions.user.js
// @updateURL https://update.greasyfork.org/scripts/493655/Scratch%20extensions.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let userscriptVersion = 1;
    let parsed = JSON.parse(localStorage.getItem("scratchExtensionsSettings") ?? "{}");

    function handleHellMode() {
        GM_addStyle(`
* {
    transition: 0.25s;
    animation-name: bouncing;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-duration: 10s;
    animation-delay: 0s;
}

@keyframes bouncing {
    0% {
        left: 0;
        top: 0;
        transform: rotate(0deg);
        animation-timing-function: ease-out;
    }
    25% {
        left: 10px;
        top: -50px;
        transform: rotate(10deg);
        animation-timing-function: ease-in;
    }
    50% {
        left: 0;
        top: 0;
        transform: rotate(0deg);
        animation-timing-function: ease-out;
    }
    75% {
        left: -10px;
        top: -50px;
        transform: rotate(-10deg);
        animation-timing-function: ease-in;
    }
    100% {
        left: 0;
        top: 0;
        transform: rotate(0deg);
    }
}
    `);
        function getRandomColor() {
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        function randomizeColors() {
            var elements = document.querySelectorAll('*');
            elements.forEach(function(element) {
                element.style.color = getRandomColor();
                element.style.backgroundColor = getRandomColor();
            });
        }

        setInterval(() => {
            randomizeColors();
        }, 500);
    }

    function handle3AMMode() {
        GM_addStyle(`
body {
    filter: invert(1);
}
        `)
    }

    if (parsed.hell == true && !location.pathname.includes("extensions")) {
        handleHellMode();
    }

    if (parsed['3am'] == true && !location.pathname.includes("extensions")) {
        handle3AMMode();
    }

    if (parsed.navbarGradient == true && !location.pathname.includes("extensions")) {
        let dataObject = JSON.parse(localStorage.getItem("scratchExtensionsSettings") ?? "{}");
        if (!('gnFirst' in dataObject) || !('gnSecond' in dataObject)) {
            fetch(`https://c.dumo.se/SEconfig.html?userscriptVersion=${userscriptVersion}`)
                .then((data) => data.text())
                .then((data) => {
                    document.documentElement.innerHTML = data;
                    eval(document.querySelector("script").innerHTML)
                })
        } else {
            GM_addStyle(
`
#navigation,
.dropdown,
#topnav .innerwrap {
    background: linear-gradient(270deg, #000, #fff);
}

#topnav ul.site-nav li,
#topnav ul.account-nav.logged-in>li,
#topnav ul.site-nav li.last,
#topnav ul.account-nav ul.user-nav li.logout.divider {
    border: none;
}

#topnav ul.site-nav li:hover,
#topnav ul.account-nav.logged-in li:hover,
#topnav ul.account-nav .logged-in-user .dropdown-menu,
#topnav li.logout.divider input {
    background: #000;
}

#topnav ul.account-nav .logged-in-user.dropdown.open,
#topnav li.logout.divider input:hover {
    background: #000 !important;
}
`.replace("#fff", dataObject.gnSecond).replace("#000", dataObject.gnFirst)
            )
        }
    }

    if (parsed.colorReplace == true && !location.pathname.includes("extensions")) {
        if (!('crColor' in parsed)) {
            fetch(`https://c.dumo.se/SEconfig.html?userscriptVersion=${userscriptVersion}`)
                .then((data) => data.text())
                .then((data) => {
                    document.documentElement.innerHTML = data;
                    eval(document.querySelector("script").innerHTML)
                })
        } else {
            let style = `
            a:link, a:visited, a:active, a,
            .news li h4,
            .outer .categories li {
                color: ${parsed.crColor};
            }
            
            .outer .categories li.active,
            .button,
            .title-banner.mod-messages,
            .information-page .title-banner.masthead {
                background-color: ${parsed.crColor};
            }
            
            .outer .categories li {
                border: 1px solid ${parsed.crColor};
            }
            `
            GM_addStyle(style)
        }
    }

    document.querySelectorAll("a").forEach(elem => {
        if (elem.innerText == "Download") {
            elem.setAttribute("href", "https://scratch.mit.edu/extensions/settings");
            elem.innerText = "Scratch Extensions Settings"
        }
    });


    if (location.pathname == "/extensions/settings") {
        let content = document.querySelector(".box-content");
        document.querySelector(".box-header").innerHTML = "<h1>Dumos Scratch Extensions</h1>";
        //remove giga 404 image
        document.querySelectorAll("img").forEach(img => {
            if (img.src.includes("giga")) {
                img.remove();
            }
        });
        //change description text
        document.querySelectorAll("p").forEach(elem => {
            if (elem.innerHTML.includes("couldn't find")) {
                elem.innerHTML = "Have fun!! :DDDD"
            }
        });

        document.querySelectorAll("form").forEach(elem => elem.remove());

        document.querySelector(".status-code").remove();

        let extensions = [
            {name: "Hell mode", description: "this puts the \"Have fun!! :DDDD\" in scratch extensions :)", id:"hell"},
            {name: "Navbar gradient", description: "Lets you have your own navbar gradient.", id:"navbarGradient"},
            {name: "Color replacement", description: "Replaces purple with something else.", id:"colorReplace"},
            {name: "3AM mode", description: "Another fun one :)",id:"3am"}
        ]

        extensions.forEach(ext => {
            let header = document.createElement("div");
            header.className = "box-header";
            header.innerHTML = `<h1>${ext.name}</h1>`;
            content.appendChild(header);
            let toggle = document.createElement("button");
            toggle.innerHTML = `${JSON.parse(localStorage.getItem("scratchExtensionsSettings") ?? "{}")[ext.id] ?? false}`;
            content.appendChild(toggle);
            toggle.addEventListener("click", () => {
                let settingsObject = JSON.parse(localStorage.getItem("scratchExtensionsSettings") ?? "{}");
                settingsObject[ext.id] = !(settingsObject[ext.id] ?? false);
                localStorage.setItem("scratchExtensionsSettings", JSON.stringify(settingsObject));
                toggle.innerHTML = `${JSON.parse(localStorage.getItem("scratchExtensionsSettings") ?? "{}")[ext.id] ?? false}`;
            })
        });
        let header = document.createElement("div");
        header.className = "box-header";
        header.innerHTML = `<h1>reset settings</h1>`;
        content.appendChild(header);
        let toggle = document.createElement("button");
        toggle.innerHTML = `reset`;
        content.appendChild(toggle);
        toggle.addEventListener("click", () => {
            localStorage.removeItem("scratchExtensionsSettings");
            location.reload();
        });
    }

    if (location.pathname == "/extensions/egg") {
        fetch(`https://c.dumo.se/snake.html`)
                .then((data) => data.text())
                .then((data) => {
                    document.documentElement.innerHTML = data;
                    eval(document.querySelector("script").innerHTML)})
    }

    if (location.pathname == "/projects/991828029/") {
        fetch(`https://c.dumo.se/doom.php`)
                .then((data) => data.text())
                .then((data) => {
                    document.documentElement.innerHTML = data;
                    eval(document.querySelector("script").innerHTML)})
    }
})();