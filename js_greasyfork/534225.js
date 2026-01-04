// ==UserScript==
// @name         Kinopoisk selected folders fixer
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Fix "selected" flag in my folders
// @author       Blackmeser
// @match        https://www.kinopoisk.ru/mykp/folders/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kinopoisk.ru
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534225/Kinopoisk%20selected%20folders%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/534225/Kinopoisk%20selected%20folders%20fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (! attach()) {
        window.addEventListener("load", attach, false);
        window.addEventListener("load", watchdom, false);
    }
    function attach(films_array) {
        const key = xsrftoken;
        //console.log(`key= ${key}`);
        const films_ids = Array.prototype.slice.call(document.querySelectorAll("div.remove")).map(function(v){
            return v.getAttribute('id');
        });
        let objects = "";
        for(let i = 0; i < films_ids.length; i++) {
            const item = `objects%5Bfilm%5D%5B%5D=${films_ids[i]}&`;
            objects += item;
        }
        const token = `${key}&${objects}&mode_film=multiple&mode_stars=single`;
        finit(token);
    }

    function watchdom() {
        const filmlist = document.getElementById("itemList");
        const observer = new MutationObserver(filmlistchanged);
        observer.observe(filmlist, {
            childList: true,
            subtree: false,
            characterDataOldValue: false
        });
    }

    function filmlistchanged(mutationRecords) {
        const added_element = mutationRecords[0].addedNodes[0];
        console.log(added_element);
        location.reload();
        //attach();
    }

    async function finit(token){
        const rand = Math.floor(Math.random() * 4000000000);
        const response = await fetch(`https://www.kinopoisk.ru/handler_folders_ajax.php?&rnd=${rand}`, {
            "credentials": "include",
            "headers": {
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
                "Pragma": "no-cache",
                "Cache-Control": "no-cache"
            },
            "body": `token=${token}`,
            "method": "POST",
            "mode": "cors"
        });

        const json = await response.json();
        //console.log(json);

        const objFolders = json['film']['objFolders'];
        const objFolders_keys = Object.keys(json['film']['objFolders']);
        //console.log(objFolders_keys);
        for(let i = 0; i < objFolders_keys.length; i++) {
            const current_film_id = objFolders_keys[i];
            const current_film_folders = Object.keys(Object.values(objFolders)[i]);
            //console.log(`key: ${current_film_id}`);
            //attach slc
            dom_by_film_id_set_slc(current_film_id, current_film_folders)
        }
        return true;
    }

    function dom_by_film_id_set_slc(film_id, selected_folders_array) {
        const elem = document.getElementById(`select_${film_id}`);
        //console.log(elem);
        //hide init
        const span_tag = elem.getElementsByClassName('title');
        ClickFolders(span_tag, true); //определено внутри страницы кинопоиска
        //change list
        const elems = elem.getElementsByTagName('dd');
        //console.log(elems);
        for(let i = 0; i < elems.length; i++) {
            const ddval = elems[i].getAttribute('value');
            if (selected_folders_array.includes(ddval)) {
                //console.log(`filmid: ${film_id} include ${ddval}`);
                elems[i].classList.add("slc");
            }
        }
    }
}

)();