// ==UserScript==
// @name         Chaturbate search 6 tokens
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Search chaturbate
// @author       You
// @match        https://chaturbate.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaturbate.com
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475037/Chaturbate%20search%206%20tokens.user.js
// @updateURL https://update.greasyfork.org/scripts/475037/Chaturbate%20search%206%20tokens.meta.js
// ==/UserScript==

GM_addStyle ( `
    .subject {
        height: auto !important;
    }
` );

(function() {
    'use strict';
    if(window.location.href.includes('followed-cams'))
    {
        return;
    }
    var cards = [...document.querySelectorAll(".roomCard")];
    if(cards.length > 0)
    {
        var parent = cards[0].parentElement;
        cards.forEach(card => {
            card.remove();
        });
        document.querySelector("#roomlist_pagination").style.display = 'none';
        searchCams(parent, '6-tokens-per-minute-private-cams/female/');
    }
})();

function searchCams(parent, categorie)
{
    var urlCateg = "https://chaturbate.com/" + categorie;
    var xhr1 = new XMLHttpRequest();
    xhr1.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var domEl1 = new DOMParser().parseFromString(this.responseText, "text/html");
            var separator = domEl1.querySelector(".endless_separator");
            var lastPage = 1;
            if(separator !== null)
            {
                lastPage = Number(domEl1.querySelector(".endless_separator").nextElementSibling.firstChild.innerText);
            }
            else
            {
                lastPage = Number(domEl1.querySelector(".paging").lastElementChild.previousElementSibling.firstChild.innerText);
            }
            for(let i = 1; i <= lastPage; i++)
            {
                setTimeout(() => {
                    var url = urlCateg + "/?page=" + i.toString();
                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function() {
                        if (this.readyState == 4 && this.status == 200) {
                            var domEl = new DOMParser().parseFromString(this.responseText, "text/html");
                            var cards = [...domEl.querySelectorAll(".roomCard")];

                            console.log(categorie, i);

                            cards.forEach(card => {
                                var toAdd = false;
                                var title = card.querySelector(".title").firstElementChild.textContent.trim();
                                if(localStorage.getItem(title) === null)
                                {
                                    card.addEventListener("click", function(){
                                        localStorage.setItem(title, "true");
                                    });
                                    card.addEventListener("auxclick", function(){
                                        localStorage.setItem(title, "true");
                                    });
                                    parent.appendChild(card);
                                }
                            });
                        }
                    }
                    xhr.open("GET", url, true);
                    xhr.send();
                }, "1000");
            }
        }
    }
    xhr1.open("GET", urlCateg, true);
    xhr1.send();
}