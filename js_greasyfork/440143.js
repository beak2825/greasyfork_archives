// ==UserScript==
// @name         Fair Fight Stat Estimator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  dhfj
// @author       You
// @match        https://www.torn.com/loader.php?sid=attackLog&*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440143/Fair%20Fight%20Stat%20Estimator.user.js
// @updateURL https://update.greasyfork.org/scripts/440143/Fair%20Fight%20Stat%20Estimator.meta.js
// ==/UserScript==

var api = "";
var name = "";

//remove the // from the 6 lines below vvv

//var l = `https://api.torn.com/user/?selections=attacks&key=${api}`;
//const res = await fetch(l);
//const dat = await res.json();


//var stats = `https://api.torn.com/user/?selections=battlestats&key=${api}`;
//const rs = await fetch(stats);
//const datstats = await rs.json();



var url = window.location.href;
var x = url.indexOf('ID=');
var fightId = url.substring(x+3,url.length);



(function() {
    'use strict';

    var fight = 0;
    var found = 0;

    for(var m in dat.attacks){
        if(dat.attacks[m].code==fightId){
            var fairfight = dat.attacks[m].modifiers.fair_fight;
            fight = m;
            console.log(dat.attacks[fight].attacker_name);
            found = 1;
        }
    }

    var mydef = datstats.defense;
    var mydex = datstats.dexterity;
    var mystr = datstats.strength;
    var myspd = datstats.speed;
    var myscore = Math.sqrt(mydef) + Math.sqrt(mydex)+ Math.sqrt(myspd)+ Math.sqrt(mystr);
    const x = document.querySelectorAll("skip-to-content.left");
    const y = document.getElementById("skip-to-content");
    if(found == 1){
        if(dat.attacks[fight].attacker_name == name || dat.attacks[fight].defender_name == name)
        {

            if(fairfight < 3 && fairfight >0.25)
            {
                var statsfinalmin;
                var statsfinalmax;
                if(dat.attacks[fight].defender_name == name)
                {

                var attackerscore = (myscore*(8/3))/(fairfight-1);
                var attackerstatsmin = (attackerscore*attackerscore)/4;
                var attackerstatsmax = (attackerscore*attackerscore)/2.75;
                //var attackerstatsmax =attackerstatsmin*1.25;
                statsfinalmin = attackerstatsmin.toFixed().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                statsfinalmax = attackerstatsmax.toFixed().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                }
                else
                {
                    var defenderscore = ((fairfight-1)*myscore)/(8/3);
                    var defenderstatsmin = (defenderscore*defenderscore)/4;
                    //var defenderstatsmax = defenderstatsmin*1.25;
                    var defenderstatsmax = (defenderscore*defenderscore)/2.75;
                    statsfinalmin = defenderstatsmin.toFixed().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                    statsfinalmax = defenderstatsmax.toFixed().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                }
                y.innerHTML = ("Attack log : Stats approximation = " + statsfinalmin +' - ' + statsfinalmax);
            }
            else if(fairfight == 3)
            {
                y.innerHTML = ("Attack log : Could not approximate stats (FF = 3x)");
            }
            else
            {
                y.innerHTML = ("Attack log : Could not estimate stats");
            }
        }
        else
        {
            y.innerHTML = ("Attack log : Could not estimate stats");
        }
    }
    else
    {
     y.innerHTML = ("Attack log : Could not estimate stats");
    }

})();