// ==UserScript==
// @name           Eolymp+
// @name:mk        Eolymp+
// @namespace      -
// @version        5
// @description    Enhances Eolymp, a Ukrainian website for coding
// @description:mk Ја збогатува Eolymp, украинска веб-страна за кодирање
// @author         Plantt
// @match          *://www.eolymp.com/*
// @match          *://eolymp.com/*
// @icon           https://www.google.com/s2/favicons?sz=64&domain=eolymp.com
// @grant          none
// @license        CC-BY-ND
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/450911/Eolymp%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/450911/Eolymp%2B.meta.js
// ==/UserScript==

addEventListener("load", () => {
    console.log("%c[Eolymp+] %cLoading %cEolymp+", "color:darkgray;font-style:italic", "", "color:#2b9ca0;text-decoration:underline");
    window.updatePage = updatePage;
    function updatePage() {
		if (!document.getElementById("pref-css")) {
			var customCSS = document.createElement("style");
			customCSS.id = "pref-css";
			document.head.appendChild(customCSS);
		}
		document.getElementById("pref-css").innerHTML = `
		#result_box span:after {content: " "; user-select: text}
		.mdl-button--raised.mdl-button--colored {background: hsl(${(localStorage.getItem("pref-hue") || 182) - 8}deg 100% 29%)}
		.mdl-button--raised.mdl-button--colored:hover {background: hsl(${(localStorage.getItem("pref-hue") || 182) - 8}deg 100% 19%)}
		a {color: hsl(${localStorage.getItem("pref-hue") || 182}deg 58% 40%)}
		.mdl-button--primary.mdl-button--primary {color: hsl(${localStorage.getItem("pref-hue") || 182}deg 100% 29%)}
		input[type=checkbox] {filter: hue-rotate(${(localStorage.getItem("pref-hue") || 182) - 212}deg)}
		${localStorage.getItem("pref-css")}`;
        if (localStorage.getItem("pref-hide_fund_banner") == "true") {
            (document.querySelector("body > main > div.eo-container > div.eo-top-banner")?.style || {}).display = "none";
        }
        else {
            (document.querySelector("body > main > div.eo-container > div.eo-top-banner")?.style || {}).display = "";
        }
        document.querySelector("body > main > div.ribbon").style.background =
        (document.querySelector("body > main > div.eo-container > div.eo-top-banner")?.style || {}).background = `hsl(${localStorage.getItem("pref-hue") || 182}deg 58% 40%)`;
        document.querySelector("body > header").style.background = `hsl(${localStorage.getItem("pref-hue") || 182}deg 58% 35%)`;
        document.querySelectorAll(".eo-header__link_darker").forEach(elm => void(elm.style.color = `hsl(${localStorage.getItem("pref-hue") || 182}deg 58% 21%)`));
        document.querySelector("body > header > nav:nth-child(4) > a:nth-child(7) > svg")?.setAttribute("fill", `hsl(${localStorage.getItem("pref-hue") || 182}deg 58% 21%)`);
        console.log("%c[Eolymp+] %cUpdated page", "color:darkgray;font-style:italic", "");
		document.querySelector("body > footer > div.eo-footer__copy").innerHTML = `&copy; Eolymp ${new Date().getFullYear()} (Eolymp+ by EntityPlantt)`;
    }
    updatePage();
    if (/^https?:\/\/www\.eolymp\.com\/..\/settings\/preferences/.test(document.URL)) {
        var custPref = document.createElement("fieldset");
        custPref.innerHTML = `
        <hr>
        <h2>Eolymp+</h2>
        <div class=form-group>
        <label class=control-label for=preferences_theme>Theme</label>
        <select id=preferences_theme class=form-control>
        <option value=182${localStorage.getItem("pref-hue") == 182 ? " selected" : ""}>Default</option>
        <option value=2${localStorage.getItem("pref-hue") == 2 ? " selected" : ""}>Red</option>
        <option value=122${localStorage.getItem("pref-hue") == 122 ? " selected" : ""}>Green</option>
        <option value=242${localStorage.getItem("pref-hue") == 242 ? " selected" : ""}>Blue</option>
        <option value=62${localStorage.getItem("pref-hue") == 62 ? " selected" : ""}>Yellow</option>
        <option value=302${localStorage.getItem("pref-hue") == 302 ? " selected" : ""}>Purple</option>
        </select>
        </div>
        <div class=form-group><div class=checkbox>
        <label for=preferences_hidefundbanner>
        <input type=checkbox id=preferences_hidefundbanner${localStorage.getItem("pref-hide_fund_banner") == "true" ? " checked" : ""}>
        Hide funding banner
        </label>
        </div></div>
		<div class=form-group>
		<label class=control-label for=preferences_css>Custom CSS</label>
		<textarea id=preferences_css class=form-control></textarea>
		</div>`;
		custPref.querySelector("#preferences_css").value = localStorage.getItem("pref-css");
		custPref.querySelector("#preferences_css").onkeyup = ev => {
			localStorage.setItem("pref-css", ev.target.value);
			updatePage();
		};
        custPref.querySelector("#preferences_theme").onchange = ev => {
            localStorage.setItem("pref-hue", ev.target.value);
            updatePage();
        };
        custPref.querySelector("#preferences_hidefundbanner").onchange = ev => {
            localStorage.setItem("pref-hide_fund_banner", ev.target.checked);
            updatePage();
        };
        document.getElementById("preferences").append(custPref);
    }
});