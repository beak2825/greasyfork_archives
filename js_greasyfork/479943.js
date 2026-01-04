// ==UserScript==
// @name         Ink version selector
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Add a version selector in the top bar of ink
// @author       nicospz
// @match        *.systems/*ink*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479943/Ink%20version%20selector.user.js
// @updateURL https://update.greasyfork.org/scripts/479943/Ink%20version%20selector.meta.js
// ==/UserScript==

window.onload = function() {
    var url = "https://tech.octopus.energy/ink-frontend/version.json";
    url += "?nocache=" + new Date().getTime(); // Append a timestamp to the URL

    fetch(url)
        .then(response => response.json())
        .then(data => {
            var select = document.createElement("select");
            select.style.marginLeft = '16px';

            var placeholder = document.createElement("option");
            placeholder.text = "Ink version selector";
            placeholder.value = "";
            select.appendChild(placeholder);

            var latest = document.createElement("option");
            latest.value = data.version;
            latest.text = "latest - " + data.version;
            select.appendChild(latest);

            data.recentVersions.reverse().forEach(function(version) {
                if (version.number === data.version && version.branch === "main") {
                    return;
                }
                var option = document.createElement("option");
                option.value = version.number;
                option.text = version.branch == "main" ? version.branch + " - " + version.number : version.branch;
                select.appendChild(option);
            });

            select.addEventListener('change', function() {
                var url = new URL(window.location.href);
                if (this.value == data.version) {
                    url.searchParams.delete('version');
                } else {
                    url.searchParams.set('version', this.value);
                }
                window.location.href = url.href;
            });

            var container = document.querySelector(".kraken-search__form-container");
            if (container) {
                container.appendChild(select);
            }
        })
        .catch(error => console.error('Ink version selector error:', error));
}