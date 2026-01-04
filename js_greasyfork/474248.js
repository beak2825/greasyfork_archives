// ==UserScript==
// @name         Sinject
// @version      1.0
// @namespace https://ironswordx-dev.repl.co
// @license MIT
// @description  Upload code into sites >:)
// @author       ironswordX
// @match        *://*/*
// @icon         data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBVcGxvYWRlZCB0bzogU1ZHIFJlcG8sIHd3dy5zdmdyZXBvLmNvbSwgR2VuZXJhdG9yOiBTVkcgUmVwbyBNaXhlciBUb29scyAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIGZpbGw9IiMwMDAwMDAiIHZlcnNpb249IjEuMSIgaWQ9IkNhcGFfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgDQoJIHdpZHRoPSI4MDBweCIgaGVpZ2h0PSI4MDBweCIgdmlld0JveD0iMCAwIDkyLjE3OSA5Mi4xOCINCgkgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8Zz4NCgk8cGF0aCBkPSJNNzMuNDM3LDM2LjU0di05LjE5MkM3My40MzcsMTIuMjY4LDYxLjE2OSwwLDQ2LjA5LDBTMTguNzQ0LDEyLjI2OCwxOC43NDQsMjcuMzQ4aDExLjM1NQ0KCQljMC04LjgxOCw3LjE3My0xNS45OTIsMTUuOTkxLTE1Ljk5MmM4LjgxNywwLDE1Ljk5MSw3LjE3NCwxNS45OTEsMTUuOTkydjkuMTkySDkuODg0djU1LjY0aDcyLjQxMVYzNi41NEg3My40Mzd6IE01MC42MDksNzEuMTE1DQoJCVY4My4zM2gtOS4wMzdWNzEuMTE1Yy0yLjEwMi0xLjQ0MS0zLjQ4Mi0zLjg1OC0zLjQ4Mi02LjZjMC00LjQxOCwzLjU4Mi04LDgtOHM4LDMuNTgyLDgsOA0KCQlDNTQuMDksNjcuMjU3LDUyLjcxLDY5LjY3NCw1MC42MDksNzEuMTE1eiIvPg0KPC9nPg0KPC9zdmc+
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/474248/Sinject.user.js
// @updateURL https://update.greasyfork.org/scripts/474248/Sinject.meta.js
// ==/UserScript==

'use strict';
const Meta = GM_info.script
const disabled_urls = ['about:blank', 'about:blank#blocked']
const css = "body {\nbackground-color:#A9A9A9\n}\nh1 {\nfont-family: Verdana, Tahoma, sans-serif;\n}"
if (disabled_urls.includes(window.location.href)) return;
function openNewWin() {
    let win = window.open('', '', 'height=400,width=200');
    return win;
}
function createElm(doc, headOrBody = "body", type, args=[]) {
    let el = doc.createElement(type);
    if (args.length > 0) {
        for (let i = 0; i < args.length; i++) {
            let inf = args[i]
            el.setAttribute(inf.key, inf.value)
        }
    }
    if (headOrBody === "head") {
        doc.head.appendChild(el)
    } else if (headOrBody === "body") {
        doc.body.appendChild(el)
    }
    void 0;
}
function setInner(doc, id, type, string) {
    let element = doc.getElementById(id);
    if (type === 'text') {
        element.innerText = string;
    } else if (type === 'html') {
        element.innerHTML = string;
    } else {
        element.innerText = string;
    }
    void 0;
}
function createBreak(docu) {
    createElm(docu, "body", "br")
    createElm(docu, "body", "hr")
    createElm(docu, "body", "br")
}
function erudaLoaderFunc() {
    let script = document.createElement('script');
    script.src="https://cdn.jsdelivr.net/npm/eruda";
    document.body.append(script);
    script.onload = function () {
        eruda.init();
    }
    void 0;
}


let sinjectWinOn = false
document.addEventListener('keyup', function(event) {
    if (sinjectWinOn) return;
    if (event.key.toLowerCase() === 'alt') {
        let sinjectWinOn = true;
        const editor = openNewWin();
        const editDoc = editor.document;

        editDoc.writeln(`<head><title>${Meta.name}</title></head><body><h1>${Meta.name} v${Meta.version}</h1></body>`);
        createElm(editDoc, "head", 'style', [{key: 'id', value: 'cssLoader'}]);
        setInner(editDoc, 'cssLoader', 'text', css)
        createBreak(editDoc)

        createElm(editDoc, "body", 'textarea', [{key:'id',value:'textInput'}, {key: 'style', value:'resize:vertical;min-height:60px'}]);
        createElm(editDoc, "body", 'button', [{key: 'id', value:'submitButton'}, {key: 'style', value: 'data-inline=true'}]);
        createElm(editDoc, "body", 'button', [{key: 'id', value:'erudaBtn'}, {key: 'style', value: 'data-inline=true'}]);

        setInner(editDoc, 'submitButton', 'text', 'Inject!')
        editDoc.getElementById('submitButton').onclick = function() {
            let code = editDoc.getElementById('textInput').value;
            createElm(document, "body", 'script', [{key: 'id', value: 'scriptInjector'}]);
            document.getElementById('scriptInjector').innerText = code;
            sinjectWinOn = false;
            editor.window.close();
        }

        setInner(editDoc, 'erudaBtn', 'text', 'Eruda console');
        editDoc.getElementById('erudaBtn').onclick = function() {
            erudaLoaderFunc();
            sinjectWinOn = false;
            editor.window.close();
        };
    }
}, false)