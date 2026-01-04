// ==UserScript==
// @name         Battlefy seeding csv input script
// @namespace    tampermonkey.net
// @version      0.1
// @description  When run creates an input for csv and a button that when clicked seeds the participants
// @author       newclarityex
// @match        https://battlefy.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428489/Battlefy%20seeding%20csv%20input%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/428489/Battlefy%20seeding%20csv%20input%20script.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 var loop = setInterval(() => {
    if(document.getElementsByClassName('seeding-buttons').length == 1){
        var table = document.getElementsByTagName("table")[0]
 
        var inputs = table.getElementsByTagName("input");
 
        var reference = document.getElementById("seed-by-number-list")
 
        var textarea = document.createElement("textarea")
 
        textarea.placeholder = "Insert csv player data"
 
        reference.parentElement.insertBefore(textarea,reference)
 
        var button = document.createElement("button")
 
        button.textContent = "seed"
        // button.style = getComputedStyle(document.getElementsByClassName('btn-shuffle')[0])
        button.classList.add('btn')
        button.classList.add('btn-primary')
 
        function parsecsv(inputcsv) {
            var names = [...table.getElementsByClassName("seed-name")]
            names = names.map(elem => elem.textContent.trim())
 
            console.log("called function");
            var rows = inputcsv.split('\n')
            var data = rows.map(elem => elem.split(',')
                            .map(elem => elem.trim()))
            data = data.map(elem => [elem[0],elem[1]])
 
            var unseeded = []
 
            for(var i = 0 ; i < names.length ; i++){
                inputs[i].focus()
                var seed = data.find(elem => elem[1] === names[i])
                if(seed){
                    inputs[i].value = seed[0].replace('.','')
                } else {
                    unseeded.push(names[i]);
                    inputs[i].value = ''
                }
            }
 
            console.log(`${names.length - unseeded.length}/${names.length} people seeded`);
            if(unseeded.length !== 0){
                console.log("unseeded people:")
                console.log(unseeded);
            }
        }
 
 
        button.onclick = () => { parsecsv(textarea.value) }
 
        reference.parentElement.insertBefore(button,reference)
 
        clearInterval(loop)
    }
}, 1000)
 
 
})();