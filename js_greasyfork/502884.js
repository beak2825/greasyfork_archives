// ==UserScript==
// @name         anime.plus (sort favs by score)
// @description  Sort by score in favorites tab when you click category or svg
// @namespace    pepe
// @version      0.4
// @match        https://anime.plus/*/favorites,*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502884/animeplus%20%28sort%20favs%20by%20score%29.user.js
// @updateURL https://update.greasyfork.org/scripts/502884/animeplus%20%28sort%20favs%20by%20score%29.meta.js
// ==/UserScript==

// run at document-end broke so changed to start
(function() {
    'use strict';
    window.addEventListener('load', function() {

        var test = `this is
        how to break
        into multiline
        in ecma6`;

        var script = document.createElement("script");
        script.innerHTML = `function sortList(ul = '#main > div.section.genres > div > div > table > tbody > tr.entries-wrapper-row > td > div > ul'){

            var new_ul = ul.cloneNode(false);

            var lis = [];
            for(var i = ul.childNodes.length; i--;){
                if(ul.childNodes[i].nodeName === 'LI'){
                    lis.push(ul.childNodes[i]);
                }
            }
            lis.sort(function(a, b){
                try{ return parseInt(b.getElementsByTagName('span')[0].innerHTML.match(/\\d+/) || 0 , 10) -
                    parseInt(a.getElementsByTagName('span')[0].innerHTML.match(/\\d+/) || 0 , 10); }catch(e){}
            });

            for(var i = 0; i < lis.length; i++) {
                new_ul.appendChild(lis[i]);
            }
            try{ul.parentNode.replaceChild(new_ul, ul);}catch(e){ul.parentNode.replaceChild(new_ul, ul);console.log(e)}


        }
        function callerName(element){ return '.'+element.closest('.section').className.split('section ')[1] }

        $('a').on('click', function() { setTimeout(function(){ console.log(callerName(this)); sortList(document.querySelector(callerName(this)+'  div.entries-wrapper > ul'))}.bind(this), 900);});
        $('svg').on('click', function() { setTimeout(function(){ console.log(callerName(this)); sortList(document.querySelector(callerName(this)+'  div.entries-wrapper > ul'))}.bind(this), 900);});
        `;

        document.body.appendChild(script);
    })
})();