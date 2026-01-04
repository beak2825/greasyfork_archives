// ==UserScript==
// @name         GoGoAnime Download Link Extractor
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Gives all download links to all episodes, sorted by host
// @author       Clouraxe
// @include      *gogoanime.ai/*
// @icon         https://www.google.com/s2/favicons?domain=gogoanime.ai
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/426661/GoGoAnime%20Download%20Link%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/426661/GoGoAnime%20Download%20Link%20Extractor.meta.js
// ==/UserScript==

var button;

(function() {
    'use strict';

    //Create a godforbidden button
    button = document.createElement('button');
    button.style.height = '27px';
    button.style.width = '175px';
    button.innerHTML = 'Get All Download Links';
    button.onclick = btnPressed;


    document.getElementsByClassName('favorites_book')[0].getElementsByTagName('ul')[0].prepend(button);
})();


function btnPressed() {
    button.disabled = true;
    button.innerHTML = 'Fetching...';
    var downloadLink = document.querySelector('.dowloads').firstChild.href;
    let count = 0;
    var links = {};
    //Get all pages
    let episodeContainers = document.querySelector('#episode_related').children;
    let sortedEpContainers = Array.prototype.slice.call(episodeContainers, 0);
    sortedEpContainers.reverse();
    //console.log('first element is: ' + derp[0].firstChild.href + '\nlast element: ' + derp[derp.length - 1].firstChild.href);
    for (let epCont of sortedEpContainers) {
        let epLink = epCont.firstChild.href;

        let control = GM_xmlhttpRequest({
            method: "GET",
            url: epLink,
            onload: function(response) {
                //parse
                let parser = new DOMParser();
                let epPage = parser.parseFromString(response.responseText, 'text/html');

                let downloadsLink = epPage.querySelector('.dowloads').firstChild.href;

                let control2 = GM_xmlhttpRequest({
                    method: "GET",
                    url: downloadsLink,
                    onload: function(response2) {
                        count++;
                        let epIndex = sortedEpContainers.indexOf(epCont);
                        parser = new DOMParser();
                        let dlPage = parser.parseFromString(response2.responseText, 'text/html');

                        let downloadContainers = dlPage.getElementsByClassName('dowload');

                        for (let container of downloadContainers) {
                            let host = container.firstChild.text.replaceAll('Download', '').trim();
                            if (links[host] === undefined) {links[host] = Array.apply(null, Array(episodeContainers.length)).map(function () {}) ;} //undefined array

                            links[host].splice(epIndex, 1, container.firstChild.href);
                        }



                        if (episodeContainers.length == count) {
                           
                            let parentt = document.getElementsByClassName('list_dowload')[0];
                            let textt = parentt.getElementsByTagName('div')[0].getElementsByTagName('span')[0];
                            let tx = document.createElement("div"); //area for the links
                            let list = document.createElement('ul');


                            textt.innerHTML = "All Download Links: ";
                            tx.style.width = "100%";
                            tx.style.height = "100%";
                            tx.style.overflow = 'scroll';
                            tx.style.height = '400px';

                            parentt.appendChild(tx);
                            tx.appendChild(list);

                            for (let host in links) {
                                let hostItem = document.createElement('li');
                                let linkList = document.createElement('ol');

                                hostItem.innerHTML =
                                    '<center><p style="color:cyan;font-size:25px"><b>\n\n-------------------' + host + '----------------------\n</b></p></center>';

                                list.appendChild(hostItem);
                                hostItem.appendChild(linkList);

                                for (let link of links[host]) {
                                    let linkItem = document.createElement('li');
                                    linkItem.innerHTML = '<p>' + link + '</p>';

                                    linkList.appendChild(linkItem);
                                }
                            }

                            button.innerHTML = 'Done!!';

                        }
                    }
                });
            }
        });

    }


}