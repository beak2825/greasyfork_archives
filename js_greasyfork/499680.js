// ==UserScript==
// @name         batch magnet selection
// @name:zh      磁力链接批量选择
// @namespace    http://tampermonkey.net/
// @version      v0.1.1
// @description  batch select magnet in a webpage (dmhy, nyaa), and then copy to clipboard (ctrl+c), new page(ctrl+b) for download
// @description:zh  批量选择bt站上当前页面上(动漫花园, nyaa)的批量链接， 并自动复制到剪贴板(ctrl+c)、新打开页面(ctrl+b) 用于下载
// @author       devseed
// @match        *://*.dmhy.org/*
// @match        *://*.nyaa.si/*
// @icon         https://www.dmhy.org/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499680/batch%20magnet%20selection.user.js
// @updateURL https://update.greasyfork.org/scripts/499680/batch%20magnet%20selection.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function add_checkbox() {
        var doms = document.querySelectorAll('a[href^=magnet]');
        for (let i=0; i< doms.length; i++) {
           let dom = doms[i];
           let html = `<input type="checkbox" checked="true" href="${dom.href}"/>`;
           dom.insertAdjacentHTML("afterend", html);
        }
    };

    function add_button() {
        document.body.insertAdjacentHTML("afterbegin", `<input type="button" value="SendClipboard" onclick="send_magnets_clipboard()" style="position fixed; margin:0px 10px 0px 0px">`);
        document.body.insertAdjacentHTML("afterbegin", `<input type="button" value="SendNewpage" onclick="send_magnets_newpage()" style="position fixed; margin:0px 10px 0px 0px">`);
        document.body.insertAdjacentHTML("afterbegin", `<input type="button" value="SelectAll" onclick="check_magnets_all(true)" style="position fixed; margin:0px 10px 0px 0px">`);
        document.body.insertAdjacentHTML("afterbegin", `<input type="button" value="SelectNone" onclick="check_magnets_all(false)" style="position fixed; margin:0px 10px 0px 0px">`);
    };

    function get_magnets(only_checked=true) {
        var magnets = [];
        var doms = document.querySelectorAll('input[href^=magnet]');
        for (let i=0; i< doms.length; i++) {
            let dom = doms[i];
            if (dom.checked || !only_checked) {
              magnets.push(dom.getAttribute("href"));
            }
        }
        return magnets;
    }

    async function send_magnets_clipboard() {
        var magnets = get_magnets();
        if(!magnets || magnets.length == 0) {
            alert("no selected magnent!");
            return;
        }
        const text = magnets.join("\n");
        try {
            await navigator.clipboard.writeText(text);
        } catch (error) {
            console.error(error.message);
        }
    }

    async function send_magnets_newpage() {
        var magnets = get_magnets();
        if(!magnets || magnets.length == 0) {
            alert("no selected magnent!");
            return;
        }

        const html = magnets.join("<br>")
        const blob = new Blob([html], { type: "text/html" });
        const bloburl = URL.createObjectURL(blob);
        window.open(bloburl, "_blank");
    }

    async function check_magnets_all(checked) {
        var doms = document.querySelectorAll('input[href^=magnet]');
        for (let i=0; i< doms.length; i++) {
            let dom = doms[i];
            dom.checked = checked;
        }
    }

    document.onkeydown = async (e) => {
        if (e.ctrlKey && e.key=='c') {
            send_magnets_clipboard();
        }
        else if (e.ctrlKey && e.key=='b') {
            send_magnets_newpage();
        }
    }

    window.onload = async (e) => {
       add_checkbox();
       add_button();
    };
    window.send_magnets_clipboard = send_magnets_clipboard;
    window.send_magnets_newpage = send_magnets_newpage;
    window.check_magnets_all = check_magnets_all;

})();