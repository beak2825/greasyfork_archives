// ==UserScript==
// @name             InjectJS
// @namespace        http://github.com/YTXaos/InjectJS
// @version          1.30
// @description      Inject Javascript into almost any website.
// @description:es   Inyecte Javascript en casi cualquier sitio web
// @description:fr   Injectez Javascript dans presque tous les sites Web
// @description:de   Fügen Sie Javascript in fast jede Website ein
// @description:ja   ほぼすべてのウェブサイトにジャバスクリとを挿入する
// @description:la   Javascript in inject paene omnem website
// @description:ru   Внедрите Javascript практически в любой веб-сайт
// @author           YTXaos
// @match            *://*/*
// @match            file:///*
// @icon             https://raw.githubusercontent.com/YTXaos/InjectJS/main/assets/logo.png
// @grant            GM_addElement
// @grant            GM_getResourceText
// @grant            GM_getResourceURL
// @license          MIT
// @require          https://code.jquery.com/jquery-3.6.0.min.js
// @resource         MainCSS https://raw.githubusercontent.com/YTXaos/InjectJS/main/assets/main.css
// @resource         OptionsHTML https://raw.githubusercontent.com/YTXaos/InjectJS/main/pages/options.html
// @resource         OptionsJS https://raw.githubusercontent.com/YTXaos/InjectJS/main/options.js
// @resource         Fontawesome https://raw.githubusercontent.com/YTXaos/InjectJS/main/assets/fontawesome.css
// @resource         MainIcon https://raw.githubusercontent.com/YTXaos/InjectJS/main/assets/logov2.png
// @downloadURL https://update.greasyfork.org/scripts/455718/InjectJS.user.js
// @updateURL https://update.greasyfork.org/scripts/455718/InjectJS.meta.js
// ==/UserScript==

(function() {
    "use strict";
    const url = location.href,
        origin = location.origin;
    /**
     * @param {string} item Specify what item to look for in the options.
     * @returns {string} True or false if found, false boolean if not.
     */
    function Option(item) {
        if(localStorage.getItem(`inject-js:${item}`)) {
            return localStorage.getItem(`inject-js:${item}`).toString();
        } else {
            return false;
        }
    }
    /**
     * Create a log node.
     * @param {string} type The type of log to create.
     * @param {string} msg The message to output in the logs.
     */
    function createLog(type, msg) {
        const elm = document.querySelector(".js-injector-logs");
        let msg_type;
        type === "warning" && (msg_type = "WARN") || (msg_type = type.toUpperCase());
        elm.innerHTML += `
        <div class="js-log ${type}">
            [InjectJS&nbsp;<span class="time-date"></span>&nbsp;${msg_type}]:&nbsp;
            <span class="js-log-message">
                ${msg}
            </span>
        </div>`;
    }
    const logs = {
        info(msg) { createLog("info", msg); },
        warn(msg) { createLog("warning", msg); },
        error(msg) { createLog("error", msg); }
    }
    /**
     * Check whether the page the user is on is equivalent to param "page".
     * @param {string} page Specify what URL to check for.
     * @param {boolean} exact Whether it should check for the exact URL or relative.
     * @returns {boolean} True or false
     */
    function onURL(page, exact) {
        if(exact) {
            return url === `${origin}${page}`;
        } else {
            return url.includes(page);
        }
    }
    if(Option("disable") == "true") {
        document.addEventListener("keyup", function(e) {
            e.preventDefault();
            if(e.ctrlKey && e.key === ".") {
                localStorage.setItem("inject-js:disable", false);
                location.reload();
            }
        });
        return;
    }
    if(onURL("/inject-js/", true)) {
        location = "https://github.com/YTXaos/InjectJS";
    }
    Option("startup_log") == "true" && (console.info("InjectJS Loaded. Press Ctrl + Q to topen"));
    const popup = document.createElement("div"),
        log = document.createElement("div");
    GM_addElement(document.head, "style", { textContent: GM_getResourceText("MainCSS") });
    log.setAttribute("class", "js-injector-logs");
    log.innerHTML = '<span class="js-logs-close" title="Close" id="js-close">&times;</span>';
    log.style.display = "none";
    popup.setAttribute("class", "js-injector-popup");
    popup.style.display = "none";
    popup.innerHTML = `<label class="js-inject-header">
    <div class="js-logo-needle" style="background-image: url(${GM_getResourceURL("MainIcon")})">.....</div>
    Inject<span class="js-logo">JS</span>
</label>
<textarea placeholder="Your code here" class="js-code-inject" spellcheck="false" data-gramm="false" data-gramm_editor="false" data-enable-grammarly="false" id="js-code-inject"></textarea>
<div class="js-btns-section">
<button class="execute-code" disabled>Execute</button>
<button class="js-options-btn">Options</button>
</div>
<div class="js-btns-column">
<button class="show-js-logs">Logs</button>
</div>`;
    document.body.append(log);
    document.body.prepend(popup);

    function OptionsPage() {
        $("link[rel=stylesheet], style, script").remove();
        document.title = "InjectJS Options";
        document.body.innerHTML = GM_getResourceText("OptionsHTML");
        GM_addElement(document.head, "script", { textContent: GM_getResourceText("OptionsJS") });
    }
    const code = document.querySelector(".js-code-inject"),
        btn = document.querySelector(".execute-code"), option_btn = document.querySelector(".js-options-btn"), log_btn = document.querySelector(".show-js-logs");
    code.addEventListener("input", CheckCode);
    log_btn.addEventListener("click", function() {
        document.querySelector(".js-injector-logs").setAttribute("style", "display: flex !important");
        document.getElementById("js-close").addEventListener("click", function() {
            document.querySelector(".js-injector-logs").setAttribute("style", "");
        });
    });
    if(Option("disable_syntax") != "true") { code.addEventListener("keydown", Syntax); }
    btn.addEventListener("click", InjectCode);
    option_btn.addEventListener("click", () => { location = "/inject-js/options"; });
    /**
     * Syntax properties for autocomplete "(", "{", and strings.
     * @param {event} e Returns an event to handle accordingly.
     */
    function Syntax(e) {
        if(e.key === "{") {
            e.preventDefault();
            const start = code.selectionStart,
              end = code.selectionEnd,
              selection = code.value.substring(start, end),
              replace = `${code.value.substring(0, start)}{\n${selection}\n}${code.value.substring(end)}`;
            code.value = replace;
            code.focus();
            code.selectionEnd = end + 2;
          }
          if(e.key === "(") {
            e.preventDefault();
            const start = code.selectionStart,
              end = code.selectionEnd,
              selection = code.value.substring(start, end),
              replace = `${code.value.substring(0, start)}(${selection})${code.value.substring(end)}`;
            code.value = replace;
            code.focus();
            code.selectionEnd = end + 1;
          }
          if(e.which === 222) {
            e.preventDefault();
            const start = code.selectionStart,
              end = code.selectionEnd,
              selection = code.value.substring(start, end),
              replace = `${code.value.substring(0, start)}${e.key}${selection}${e.key}${code.value.substring(end)}`;
            code.value = replace;
            code.focus();
            code.selectionEnd = end + 1;
          }
    }
    function CheckCode() {
        const code = document.querySelector(".js-code-inject");
        if(code.value.length < 5) {
            btn.setAttribute("disabled", "disabled");
        } else {
            btn.removeAttribute("disabled");
        }
    }

    function InjectCode() {
        try {
            eval(code.value);
        } catch (e) {
            if(Option("alert_errors") == "true") {
                alert(e.message);
            } else {
                logs.error(e);
            }
        }
    }

    function ShowInjector() {
        dragElement(document.querySelector(".js-injector-popup"));
        /**
         * Makes an elemenet draggable around the screen.
         * @param {string} elmnt Select an element from the DOM to become draggable
         */
        function dragElement(elmnt) {
            var pos1 = 0,
                pos2 = 0,
                pos3 = 0,
                pos4 = 0;
            if(document.querySelector(".js-inject-header")) {
                document.querySelector(".js-inject-header").onmousedown = dragMouseDown;
            } else {
                elmnt.onmousedown = dragMouseDown;
            }

            function dragMouseDown(e) {
                e = e || window.event;
                e.preventDefault();
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
            }

            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
                elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
            }

            function closeDragElement() {
                document.onmouseup = null;
                document.onmousemove = null;
            }
        }
        popup.classList.toggle("show");
    }
    if(onURL("/inject-js/options", true)) {
        OptionsPage();
    }
    document.addEventListener("keyup", function(e) {
        e.preventDefault();
        if(e.ctrlKey && e.key === "q") {
            ShowInjector();
        }
    });
})();