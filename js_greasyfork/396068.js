// ==UserScript==
// @name         Search Changer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Changes search machine
// @author       You
// @match        https://www.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396068/Search%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/396068/Search%20Changer.meta.js
// ==/UserScript==

(function() {
    // Your code here...
    function Engine(name,url,param){
        this.name = name;
        this.url = url;
        this.param = param;
    }
    let Yandex = new Engine('Яндекс','https://yandex.ru/search','text');
    let MailRu = new Engine('MailRu','https://go.mail.ru/search','q');
    let YouTube = new Engine('YouTube','https://www.youtube.com/results','search_query');
    let Bing = new Engine('Bing','https://www.bing.com/search','q');
    let engines = [Yandex,MailRu,YouTube,Bing];
    document.addEventListener('DOMContentLoaded',add_Links());
    function add_Links(){
    let target_div= document.getElementById('resultStats');
    let text_search = document.querySelector('input[name=q]');
        for (let engine of engines){
            let link = document.createElement('a');
            let url = `${engine.url}/?${engine.param}=${text_search.value}`;
            link.innerText=engine.name + ' | ';
            link.setAttribute('href',url);
            link.setAttribute('target','_blank')
            target_div.appendChild(link);
        }
    }

    //function searchChange(){
//
  //  }
})();