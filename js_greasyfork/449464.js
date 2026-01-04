// ==UserScript==
// @name         Enchanced SM Documentation
// @namespace    https://github.com/GalaxyVOID/sm-docs
// @version      0.1
// @description  Enchances the documentation
// @author       GalaxyVOID
// @match        https://scrapmechanic.com/api/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scrapmechanic.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449464/Enchanced%20SM%20Documentation.user.js
// @updateURL https://update.greasyfork.org/scripts/449464/Enchanced%20SM%20Documentation.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const link = "https://raw.githubusercontent.com/GalaxyVOID/sm-docs/5c0b0b45cccfbe8e60393e59a9d37b4961db0115/prism%20"

    function selectTheme() {
        var css;
        var js;
        var theme = prompt("Please type the name of the theme (okaida, tomorrow):", "tomorrow");
        if (theme == "okaida") {
            css = link + "okaida.css";
            js = link + "okaida.js";
            localStorage.setItem("GalaxyVOIDSMTheme", theme);
        } else if (theme == "tomorrow") {
            css = link + "tomorrow.css";
            js = link + "tomorrow.js";
            localStorage.setItem("GalaxyVOIDSMTheme", theme);
        }
        location.reload();
    }

    if (localStorage.getItem("GalaxyVOIDSMTheme") == null) {
        selectTheme();
    } else {
        var theme = localStorage.getItem("GalaxyVOIDSMTheme");
        var css = link + theme + ".css";
        var js = link + theme + ".js";
    }

    function addDevStuff() {
        var div = document.createElement("div");


        // html <p>Enchanced SM Docs Made By GalaxyVOID#1815</p>
        var credits = document.createElement('p');
        credits.innerHTML = 'Enchanced SM Docs Made By GalaxyVOID#1815';
        div.appendChild(credits);

        // add a button to change the theme
        var themeButton = document.createElement('button');
        themeButton.innerHTML = 'Change Theme';
        themeButton.onclick = selectTheme;
        themeButton.style = "background-color: #f5f5f5; border: 1px solid #d9d9d9; border-radius: 3px; box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05); color: #333; cursor: pointer; font-size: 14px; font-weight: bold; line-height: 1.42857143; margin-bottom: 10px; padding: 6px 12px; text-align: center; text-decoration: none; vertical-align: middle; white-space: nowrap;";
        div.appendChild(themeButton);
        document.querySelector('#menu').insertBefore(div, document.querySelector('#menu').firstChild);
    }
    addDevStuff();

    function setDarkScheme() {
        console.log('\x1b[33m[?]\x1b[0m Setting Dark Scheme...');
        // change the <html> color scheme to dark
        document.querySelector('html').style.colorScheme = 'Dark';
        console.log('\x1b[32m[✔]\x1b[0m Done Setting The Dark Scheme!');
    }

    // Load the syntax stuff
    function startprism() {
        console.log('\x1b[33m[?]\x1b[0m Starting Prism...');
        fetch(js).then(response => response.text()).then(text => {
            eval(text)
        }).catch(err => {
            console.log("\x1b[31m[✘]\x1b[0m Error: " + err)
        });
        fetch(css).then(response => response.text()).then(text => {
            document.querySelector('head').insertAdjacentHTML('beforeend', '<style>' + text + '</style>')
        }).catch(err => {
            console.log("\x1b[31m[✘]\x1b[0m Error: " + err)
        });
        console.log('\x1b[32m[✔]\x1b[0m Done Starting Prism!');
    }

    function replaceClasses() {
        console.log('\x1b[33m[?]\x1b[0m Replacing Classes...');
        // replace all objects with the class of code to 'language-lua code'
        document.querySelectorAll('.code').forEach(function (element) {
            element.className = 'language-lua code';
            // make the inner text go into a <code> tag
            element.innerHTML = '<code>' + element.innerText + '</code>';
            element.style.borderRadius = '10px';
        });
        console.log('\x1b[32m[✔]\x1b[0m Finished Replacing Classes!');
    }

    function fix() {
        console.log('\x1b[33m[?]\x1b[0m Fixing Stuff...');
        document.querySelectorAll('*').forEach(function (element) {
            if (element.className == 'note') {
                element.style.backgroundColor = 'transparent';
                element.style.borderRadius = '10px';
                element.style.border = '5px solid #0080ff';

                var h4 = element.querySelectorAll('h4');
                var p = element.querySelectorAll('p');

                var div = document.createElement('div');
                div.style.margin = '10px';

                // add the h4s and ps to the div
                h4.forEach(function (h4) {
                    div.appendChild(h4);
                });
                p.forEach(function (p) {
                    div.appendChild(p);
                });

                element.appendChild(div);


            } else if (element.className == 'warning') {
                element.style.backgroundColor = 'transparent';
                element.style.borderRadius = '10px';
                element.style.border = '5px solid #ffcc00';

                var h4 = element.querySelectorAll('h4');
                var p = element.querySelectorAll('p');

                var div = document.createElement('div');
                div.style.margin = '10px';

                // add the h4s and ps to the div
                h4.forEach(function (h4) {
                    div.appendChild(h4);
                });
                p.forEach(function (p) {
                    div.appendChild(p);
                });

                element.appendChild(div);
            } else if (element.className == 'deprecated') {
                element.style.backgroundColor = 'transparent';
                element.style.borderRadius = '10px';
                element.style.border = '5px solid #ff5000';

                var h4 = element.querySelectorAll('h4');
                var p = element.querySelectorAll('p');

                var div = document.createElement('div');
                div.style.margin = '10px';

                // add the h4s and ps to the div
                h4.forEach(function (h4) {
                    div.appendChild(h4);
                });
                p.forEach(function (p) {
                    div.appendChild(p);
                });

                element.appendChild(div);
            } else if (element.tagName == 'TABLE' || element.tagName == 'TH' || element.tagName == 'TD') {
                element.style.borderColor = 'white';
            }
        });
        console.log('\x1b[32m[✔]\x1b[0m Finished Fixing Stuff!');
    }


    console.log('\x1b[33m[?]\x1b[0m Starting Enchanced SM Documentation...');
    setDarkScheme();
    startprism();
    replaceClasses();
    fix()
    console.log('\x1b[32m[✔]\x1b[0m Enchanced SM Documentation Has Finished Loading!');
})();