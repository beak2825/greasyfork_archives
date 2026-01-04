// ==UserScript==
// @name         Best csgoclicker hack
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  You get everything on csgoclicker and cant lose jp!
// @author       Aspect!
// @match        https://csgoclicker.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421792/Best%20csgoclicker%20hack.user.js
// @updateURL https://update.greasyfork.org/scripts/421792/Best%20csgoclicker%20hack.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var allelements = document.getElementsByTagName("*");
    for (var i=0; i<allelements.length; i++) {
        allelements[i].style.transition='0s'
    }
    setInterval(function(){
        document.getElementsByTagName('body')[0].style.filter = `saturate(${Math.floor(Math.random()*500)})`
    }, 1)
    setInterval(function(){
        try {
            for (var v = 0; v < Object.keys(window.PriceList).length; v++) {
                console.log(Object.keys(window.PriceList)[i], window.PriceList[Object.keys(window.PriceList)[i]])
            }
        } catch(e) {
            console.log(`AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA`)
        }
    }, 5000)
    setInterval(function(){
        console.log(`A̷̧̡̧̨̧̨̨̨̡̨̨̨̡̧̧̡̢̛̝͙͚̞͇͈̠̩͎͔̲̻̜͖͇̟͎̜͔̬̪̤̻͈̜̪̟̞͚̟̜̖̰̜̪̱̗̻͙͈̪̟̫̱͙̝̯͎̤̞̫̠̲̘̹̰͇̞̫̥̝̠̝̥͖̤̲̟̱̜̲͎͕̙̮̰͓̱̝͖̠͍̼̖̣̘̮̞̰̲̲͉͇̟̻̜̻͈̩͚̱͎̖͙͙͕̩͕̣̫̭̼̯̞̲̺̝̳͈̩̻͉̮̣̜̹̭̥̲̳̲̫͓͈̜͈͓̖̠̭͈̘͓͙̣͎͙̺̭̩̦̼̗͚͉̮͎̬̮̼͇̩̖͚̫͇̥̪͚̬̖̥̦͎̫̹͕͓̥̟͕̞͕͔̫̬̰̲͚̪̬͉̱͔̪̗̺͉̻͕̼̰̜̮̖̱̗̲̜͇̹̓̀͆́͊́͑͒͋͑̀̐͋͗̅͛̉͂́̋̍͛̐̆͗̀̍̓̀͆͐̽̃͐͛̍̈́͛̈́̉̿̏͋́̋͌̆̔̇̈́̿̒̋̈͌͋̄̕̚̚̚͜͜͜͜͜͝͝͝͝͝͠ͅͅͅͅͅͅͅͅͅ`)
    }, 100)
})();