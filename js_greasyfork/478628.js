// ==UserScript==
// @name         Proxy 6 Download Selected
// @namespace    Proxy 6 Download Selected
// @version      0.1
// @description  Proxy 6 Download Selected Proxy
// @author       el9in
// @license      el9in
// @match        https://proxy6.net/user/proxy*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=proxy6.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478628/Proxy%206%20Download%20Selected.user.js
// @updateURL https://update.greasyfork.org/scripts/478628/Proxy%206%20Download%20Selected.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const format = document.querySelector('input[name="format"]').value;
    if(format) {
        const navBar = document.querySelector('.nav.nav-bar.user_proxy_nav');
        if (navBar) {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = '#';
            link.id = 'all-view-toggle';
            link.textContent = 'Скачать выделенные';
            listItem.appendChild(link);
            navBar.appendChild(listItem);
            link.addEventListener('click', function (event) {
                event.preventDefault();
                const elements = document.querySelectorAll('[id^="el-"].active');
                let proxies = "";
                for(let element of elements) {
                    const ip_port = element.querySelector("td:nth-child(3) > ul > li:nth-child(1) > div.right.clickselect > b").innerText;
                    const [ ip, port ] = ip_port.split(":");
                    const login = element.querySelector("td:nth-child(3) > ul > li:nth-child(2) > div.right.clickselect > b").innerText;
                    const password = element.querySelector("td:nth-child(3) > ul > li:nth-child(3) > div.right.clickselect > b").innerText;
                    let _proxy_in_format = format.replace("host", ip).replace("port", port).replace("user", login).replace("pass", password);
                    proxies += `${_proxy_in_format}\n`;
                }
                const blob = new Blob([proxies], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "proxies.txt";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            });
        }
    }
})();