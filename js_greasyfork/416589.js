// ==UserScript==
// @name         zt-za Download all auto
// @namespace    https://greasyfork.org/fr/users/11667-hoax017
// @version      1.2.0
// @description  zt-za Doanload All + zt-protect get link auto
// @author       Hoax017
// @match        https://zt-protect.net/article/*
// @match        https://zt-protect.com/linkpage/*
// @match        https://zt-protect.com/support/*
// @match        https://zt-protect.com/voirlien/*
// @match        https://zt-protect.com/telecharger/*
// @match        https://onaregarde-pourvous.com/index.php?do=link&link=*
// @match        https://zt-protect.cam/*/?link=*
// @match        https://zt-protect.com/proteger/*
// @match        https://zt-protect.com/pagelien/*
// @match        https://www.zt-za.com/*/*
// @match        https://www.zt-za.net/*/*
// @match        https://www.zone-telechargement.cam/*/*
// @screen       http://prntscr.com/vo0rjt
// @screen       http://prntscr.com/vo0ruy
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416589/zt-za%20Download%20all%20auto.user.js
// @updateURL https://update.greasyfork.org/scripts/416589/zt-za%20Download%20all%20auto.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (location.hostname.includes("onaregarde-pourvous.com")) {
        setTimeout(function (){
            if (document.querySelector(".btn.btn-primary")) document.querySelector(".btn.btn-primary").click();
        }, 1000)
    } else if (location.hostname.includes("zt-protect.cam") || location.hostname.includes("zt-protect.com") || location.hostname.includes("zt-protect.net")) { // descript links
        if (
            location.pathname.indexOf("/telecharger") === 0 ||
            location.pathname.indexOf("/linkpage") === 0 ||
            location.pathname.indexOf("/pagelien") === 0 ||
            (location.hostname.includes("zt-protect.cam") && document.querySelector('#single a'))
        ) {
            console.log(document.querySelector('#single a'), document.querySelector('#single a').href)
            let currentLink = document.querySelector('#single a')
            currentLink.href = currentLink.href.replace(/(\?|&)aff_id=\d+/,'').replace(/(\?|&)af=\d+/,'');
            currentLink.innerText = currentLink.href;
            if (document.querySelector('#single a')) {
                window.opener.parent.postMessage({ link : document.querySelector('#single a').href.replace(/(\?|&)aff_id=\d+/,'').replace(/(\?|&)af=\d+/,'')},"*");
                window.close();
            };
        } else if (
            location.pathname.indexOf("/support") === 0 ||
            location.pathname.indexOf("/voirlien") === 0 ||
            location.pathname.indexOf("/proteger") === 0 ||
            location.pathname.indexOf("/article") === 0 ||
            (location.hostname.includes("zt-protect.cam") && document.querySelector(".btn.btn-primary"))
        ) {
            setTimeout(function (){
                if (document.querySelector(".btn.btn-primary")) document.querySelector(".btn.btn-primary").click();
            }, 1000)
        }
    } else if (location.hostname.includes("zt-za.com") || location.hostname.includes("zt-za.net") || location.hostname.includes("zone-telechargement.cam")) { // get all links
        var lines = Array.from(document.querySelectorAll('div.postinfo b'));
        var formatedData = [];
        var currentHost = null;
        let finalHostDlLinks = []
        window.addEventListener("message", function (message) {
            if(!message.origin.includes('zt-protect')) return ;
            finalHostDlLinks.push(message.data.link)
        });
        const onClickActivator = function (e) {
            e.preventDefault();
            let host = this.getAttribute('data-host');
            let hostData = formatedData.find(function (e) {return e.host === host});
            if (!hostData) return;
            finalHostDlLinks = [];
            let closedWindow = 0;
            for (const dlLink of hostData.links) {
                let win = open(dlLink);
                console.log(dlLink, host)
                let interval = setInterval(function () {
                    if (win.closed) {
                        closedWindow++;
                        if (closedWindow === hostData.links.length && finalHostDlLinks.length) {
                            console.info(finalHostDlLinks.join("\n"))
                            alert(finalHostDlLinks.join("\n"));
                        }
                        clearInterval(interval);
                    }
                }, 500)
                }
        };

        for(const line of lines) {
            if(!line.innerText.includes('Episode') && !line.innerText.includes('Partie') && !line.innerText.includes('Télécharger')) {
                currentHost = line.innerText.trim();
                if (formatedData.some(function (e) {return e.host === currentHost})) {
                    currentHost += Math.floor(Math.random() * Math.floor(100));
                }
                let activator = document.createElement('a');
                activator.setAttribute('href', '#');
                activator.setAttribute('data-host', currentHost);
                activator.setAttribute('style', 'margin-left:20px');
                activator.innerText = "All"
                activator.addEventListener('click', onClickActivator)
                line.querySelector('div').append(activator);
            } else if (currentHost) {
                let linkBalises = line.querySelectorAll('a');
                if (!linkBalises || !linkBalises.length) continue;
                for(let linkBalise of linkBalises) {
                    let hostData = formatedData.find(function (e) {return e.host === currentHost});
                    if (hostData) {
                        hostData.links.push(linkBalise.href)
                    } else {
                        formatedData.push({
                            host: currentHost,
                            links: [linkBalise.href]
                        })
                    }
                }
            }
        }
    } else {
        alert('URL non configurer')
    }
})();
