// ==UserScript==
// @name         HSLO Endymion
// @description  HSLO Endymion The Ultimate Multiboxing Experience
// @version      10.1
// @author       test114514
// @match        *://agar.io/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/727480
// @downloadURL https://update.greasyfork.org/scripts/427110/HSLO%20Endymion.user.js
// @updateURL https://update.greasyfork.org/scripts/427110/HSLO%20Endymion.meta.js
// ==/UserScript==

if (location.host === 'agar.io' && location.href !== 'https://agar.io/hslo') {
    location.href = 'https://agar.io/hslo';
    return;
}

const HSLO = new class {
    constructor() {
        this.method = 'GET';
        this.URL = 'https://hslo.sigr.io/';
        this.HTML = ``;
        this.date = Date.now();
    }

    load() {
        this.setMessage();
        this.fetch();
    }

    setMessage() {
        document.body.innerHTML = "LOADING...";
    }

    fetch() {
        const request = new XMLHttpRequest();
        request.open(this.method, this.URL + "?date=" + this.date, true);
        request.onload = () => {
            this.HTML = request.responseText;
            this.write();
        };
        request.onerror = () => {
            document.body.innerHTML = "<div style='width: 100%; text-align: center; font-size: 24px; font-family: sans-serif;'>Failed to fetch HSLO files.</div>";
        }
        request.send();
    }

    write() {
        document.open();
        document.write(this.HTML);
        document.close();
    }
}
HSLO.load();