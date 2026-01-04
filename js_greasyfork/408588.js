// ==UserScript==
// @name         Alltube
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       You
// @match        *://alltube.tv/*
// @match        *://alltube.pl/*
// @exclude      *://alltube.pl/link/*
// @exclude      *://alltube.tv/link/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/408588/Alltube.user.js
// @updateURL https://update.greasyfork.org/scripts/408588/Alltube.meta.js
// ==/UserScript==


(function() {
    'use strict';
    GM_addStyle(`
     #cookies {
          display: none !important;
    }
    .container  {
          display: none !important;
    }
    #rodo-popup  {
          display: none !important;
    }
    .modal-backdrop  {
          display: none !important;
    }
    `);

    [].forEach.call(document.querySelectorAll('a'), function (el) {
        if(el.href && el.href.includes('alltube.com.pl')){
            el.parentNode.parentNode.parentNode.remove(el.parentNode.parentNode);
        }
    });

    function frontPage() {
        GM_addStyle(`
        body {
         text-align: center;
        }
        .grfavLink {
         color: white;
         font-size: xx-large !important;
         margin-bottom: .5em;
         display: block;
        }
        .grfavLink:hover {
         color: grey;
        }
        `);

        document.getElementById('input-search').focus();
        document.getElementById('input-search').select();

        [].forEach.call(JSON.parse(GM_getValue("links") || '[]') || [], function (link) {
            const a = document.createElement("a");
            a.className = "grfavLink";
            a.href = link.url;
            a.innerHTML = link.name;
            document.body.insertBefore(a, document.querySelector('body > .container-fluid'));
        });

    };

    function szukajPage() {
        GM_addStyle(`
        body > .container-fluid  {
         visibility: hidden !important;
        }
        .navbar-fixed-bottom  {
         display: none !important;
        }
        .grmain {
         padding: 2%;
         display: flex;
         flex-direction: row;
        }
        .headline {
         color: white;
         font-size: xx-large;
         margin-bottom: .5em;
         text-align: center;
        }
        .grchild {
         width: 100%;
        }
        .grlink {
         color: white;
         font-size: x-large;
         display: flex;
         flex-direction: row;
         justify-content: center;
         align-items: center;
        }
        h3 {
         margin: 0.5em;
        }
        .grimg {
         width: 20%;
         display: none;
        }
         a:hover {
         color: grey;
        }
        `);

        const mainDiv = document.createElement("div");
        mainDiv.className = 'grmain';

        [].forEach.call(document.querySelectorAll('.headline'), function (el) {
            const newDiv = document.createElement("div");
            newDiv.className = 'grchild';
            newDiv.appendChild(el.cloneNode(true));
            [].forEach.call(el.parentNode.querySelectorAll('.item-block'), function (item) {
                const linkDiv = document.createElement("a");
                linkDiv.className = 'grlink';
                const img = item.querySelector('img').cloneNode(true);
                img.className = 'grimg';
                linkDiv.appendChild(img);
                const h3 = item.querySelector('h3').cloneNode(true);
                linkDiv.onmouseover = function() {
                    img.style.display = "block";
                };
                linkDiv.onmouseout = function() {
                    img.style.display = "none";
                };
                linkDiv.appendChild(h3);
                linkDiv.href = item.querySelector('a').href;
                newDiv.appendChild(linkDiv);
            });
            mainDiv.appendChild(newDiv);
        });

        document.body.insertBefore(mainDiv, document.querySelector('body > .container-fluid'));

    };

    function serialPage() {
        GM_addStyle(`
        body > .container-fluid  {
         display: none !important;
        }
        .navbar-fixed-bottom  {
         display: none !important;
        }
        li.episode  {
         display: list-item !important;
        }
        .grmain {
         padding: 2%;
         display: flex;
         flex-direction: row;
         justify-content: space-evenly;
         flex-wrap: wrap;
        }
        .grchild {
         min-width: 25%;
         font-size: x-large;
        }
        .grtitle {
         width: 100%;
         font-size: x-large;
        }
        .headline {
         color: white;
         font-size: xx-large !important;
         margin-bottom: .5em;
         text-align: center;
        }
        .episode-list {
         display: flex;
         flex-direction: column;
         align-items: center;
        }
        svg {
         width: 2%;
        }
        `);

        const empty = '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="star" class="svg-inline--fa fa-star fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M528.1 171.5L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6zM388.6 312.3l23.7 138.4L288 385.4l-124.3 65.3 23.7-138.4-100.6-98 139-20.2 62.2-126 62.2 126 139 20.2-100.6 98z"></path></svg>';
        const filled = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="star" class="svg-inline--fa fa-star fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path></svg>';

        [].forEach.call(document.querySelectorAll('.more-less'), function (el) {
            el.style.display = 'none';
        });
        let favorite = (GM_getValue('links') || []).includes(window.location.href);
        const topDiv = document.createElement("div");
        const title = document.createElement("div");
        title.className = 'grtitle'
        const h3 = document.querySelector('.col-sm-9 > .headline').cloneNode(true);
        const star = document.createElement("span");
        star.style.cursor = "pointer";
        star.onclick = function() {
            favorite = !favorite;
            star.innerHTML = favorite ? filled : empty;
            const obj = {
                name: h3.textContent,
                url: window.location.href
            };
            var arr = JSON.parse(GM_getValue("links") || '[]') || [];
            if(favorite) {
                arr.push(obj);
            }else {
                arr = arr.filter(x => x.url !== window.location.href);
            }
            GM_setValue('links', JSON.stringify(arr));
        };
        star.innerHTML = favorite ? filled : empty;
        h3.appendChild(star);
        title.appendChild(h3);
        topDiv.appendChild(title);
        const mainDiv = document.createElement("div");
        mainDiv.className = 'grmain';
        [].forEach.call(document.querySelectorAll('.col-sm-4 > .headline'), function (el) {
            const newDiv = el.parentNode.cloneNode(true);
            newDiv.className = 'grchild';
            mainDiv.appendChild(newDiv);
        });
        topDiv.appendChild(mainDiv);
        document.body.insertBefore(topDiv, document.querySelector('body > .container-fluid'));
    };

    function linksPage() {
        GM_addStyle(`
        body > .container-fluid  {
         visibility: hidden !important;
        }
        .grmain {
         display: flex;
         flex-direction: row;
        }
        table {
width: 49% !important;
         margin: 2%;
        }
        .griframe {
         margin: 2%;
         width: 49%;
         height: 500px;
        }
        `);

        const mainDiv = document.createElement("div");
        mainDiv.className = 'grmain';
        mainDiv.appendChild(document.querySelector('table'));
        const iframe = document.createElement("iframe");
        iframe.name = 'griframe';
        iframe.className = 'griframe';
        iframe.frameborder="0";
        iframe.allowfullscreen="true";

        mainDiv.appendChild(iframe);
        document.body.insertBefore(mainDiv, document.querySelector('body > .container-fluid'));

        [].forEach.call(document.querySelectorAll('a.watch'), function (el) {
            // el.target = 'griframe';
        });
    };

    const path = window.location.pathname;
    switch(path){
        case "/": frontPage(); break;
        case "/szukaj": szukajPage(); break;
    }
    if(path.startsWith("/serial")){
        serialPage();
    }

    if(path.startsWith("/film") || (path.includes("odcinek") && path.includes("sezon"))){
        linksPage();
    }

})();