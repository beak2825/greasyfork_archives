// ==UserScript==
// @name         CSS Debugger Tool
// @description  Tool for debugging elements on the page
// @version      1.0
// @author       Davi Freitas 最強さん
// @match        *://*/*
// @namespace    https://greasyfork.org/users/917780
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445532/CSS%20Debugger%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/445532/CSS%20Debugger%20Tool.meta.js
// ==/UserScript==

const CSSDebuggerTool = new class {
    constructor() {
        this.method = 'GET';
        this.URL = 'https://css-debugger-tool.vercel.app/';
        this.script = ``;
    }

    load() {
        this.fetch();
    }

    fetch() {
        const request = new XMLHttpRequest();
        request.open(this.method, this.URL, true);
        request.onload = () => {
            this.script = request.responseText;
            this.injector();
        };
        request.send();
    }

    injector() {
        const script = document.createElement('script')
        const code = document.createTextNode(this.script)
        script.appendChild(code)
        document.body.appendChild(script)
    }
}

CSSDebuggerTool.load();