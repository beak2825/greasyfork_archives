// ==UserScript==
// @name         FA script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      /https:\/\/.*\.triburile\.ro\/game\.php\?(?:t=\d+\&|)?village=\d*\&screen=am_farm.*/
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/406117/FA%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/406117/FA%20script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // number each village just because
    let barbs = document.querySelector("#plunder_list > tbody").children
    let pagesList = document.querySelector("#plunder_list_nav > table > tbody > tr > td").children
    console.log(pagesList)
    let nr;
    for(let i = 2; i < barbs.length; i++) {
        nr = document.createTextNode(i-1)
        barbs[i].children[1].appendChild(nr)
    }

    // create clock timer
    let timeSinceLast = document.createElement('h1')
    timeSinceLast.innerHTML = "";
    timeSinceLast.style = "top:0;right:0;position:absolute;z-index:99999;padding:10px;block:inline;color:yellow;";
    document.body.appendChild(timeSinceLast)

    if(localStorage.getItem('timestampFA') == null) localStorage.setItem('timestampFA', -1)
    if(localStorage.getItem('refreshFA') == null) localStorage.setItem('refreshFA', -1)
    if(localStorage.getItem('oneFATab') == null) localStorage.setItem('oneFATab', 0)
    if(localStorage.getItem('cPageIndex' + window.location.search.match(/village=(\d+)/)[1]) == null) localStorage.setItem('cPageIndex' + window.location.search.match(/village=(\d+)/)[1], 0)

    if( parseInt(localStorage.getItem('oneFATab')) < 0) {
        localStorage.setItem('oneFATab', 0)
    }


    localStorage.setItem('oneFATab', parseInt(localStorage.getItem('oneFATab')) + 1)

    window.addEventListener("beforeunload", function(e){
        alert('closing tab')
        localStorage.setItem('oneFATab', parseInt(localStorage.getItem('oneFATab')) - 1)

        return null;
    });


    console.log(localStorage.getItem('oneFATab'))


    //if(localStorage.getItem('oneFATab') > 1){
    //    alert('one FA Tab already open!')
    //    window.close()
    //}


    // every second, check if we can start the attacks
    let pollingInterval = setInterval(() => {

        var msec = Date.now() - parseInt(localStorage.getItem('timestampFA'));

        var hh = Math.floor(msec / 1000 / 60 / 60);
        msec -= hh * 1000 * 60 * 60;

        var mm = Math.floor(msec / 1000 / 60);
        msec -= mm * 1000 * 60;

        var ss = Math.floor(msec / 1000);
        msec -= ss * 1000;

        mm = (mm<10) ? ('0' + mm) : mm;
        ss = (ss<10) ? ('0' + ss) : ss;


        timeSinceLast.innerText = 'Since last attack: ' + mm + ':' + ss
        //console.log('checking if we can send another batch of LCs')

        if(Date.now() - parseInt(localStorage.getItem('timestampFA')) >= 30*60*1000){
            if(JSON.parse(localStorage.getItem('refreshFA')) == true) {
                localStorage.setItem('refreshFA', false)
                window.location.reload()
            }
            else {
                sendAttacks()
                clearInterval(pollingInterval)
            }
        }
        else {
            //console.log((Date.now() - parseInt(localStorage.getItem('timestampFA')))/1000/60)
            localStorage.setItem('refreshFA', true)
        }
    }, 1000)

    function sendAttacks() {
        let barbs = document.querySelector("#plunder_list > tbody").children
        let i = 2;
        let attInt = setInterval(() => {
            if( (i >= 2 && i < barbs.length) && ( barbs[i].children[1].firstChild.src.match(/green/) || (barbs[i].children[1].firstChild.src.match(/blue/) && barbs[i].children[6].innerText == '0') ) ) {
                console.log(barbs[i])
                barbs[i].children[8].firstElementChild.click()
            }
            else if( (i >= 2 && i < barbs.length) && (barbs[i].children[1].firstChild.src.match(/red/))) {
                barbs[i].children[9].firstElementChild.click()
            }
            i++;

            // daca nu mai avem caluti, start stop procedure
            if(parseInt(document.querySelector("#light").innerHTML) <= 0) {
                clearInterval(attInt)
                localStorage.setItem('timestampFA', Date.now())

                // daca nu mai am trupe dar sunt tot pe prima pagina, da refresh
                if(parseInt(localStorage.getItem('cPageIndex' + window.location.search.match(/village=(\d+)/)[1])) == 0){
                    //localStorage.setItem('cPageIndex' + window.location.search.match(/village=(\d+)/)[1], 0)
                    window.location.reload()
                }

                // daca nu mai am trupe dar sunt pe alta pagina, dute la linkul de la prima pagina
                else {
                    localStorage.setItem('cPageIndex' + window.location.search.match(/village=(\d+)/)[1], 0)
                    window.location.href = pagesList[0].href
                }
            }

            else {
                if( i >= barbs.length) {
                    // daca e ultima pagina din FA, opreste intervalul si dute la prima pagina
                    if(parseInt(localStorage.getItem('cPageIndex' + window.location.search.match(/village=(\d+)/)[1])) == pagesList.length - 1) {
                        clearInterval(attInt)
                        localStorage.setItem('timestampFA', Date.now())

                        if(parseInt(localStorage.getItem('cPageIndex' + window.location.search.match(/village=(\d+)/)[1])) == 0) {
                            window.location.reload()
                        }
                        else {
                            localStorage.setItem('cPageIndex' + window.location.search.match(/village=(\d+)/)[1], 0)
                            window.location.href = pagesList[0].href
                        }
                    }
                    // daca nu este ultima pagina, dute la urmatoarea pagina
                    else {
                        localStorage.setItem('cPageIndex' + window.location.search.match(/village=(\d+)/)[1], parseInt(localStorage.getItem('cPageIndex' + window.location.search.match(/village=(\d+)/)[1])) + 1)
                        window.location.href = pagesList[parseInt(localStorage.getItem('cPageIndex' + window.location.search.match(/village=(\d+)/)[1]))].href
                    }
                }
            }
        }, 800);
    }

})();