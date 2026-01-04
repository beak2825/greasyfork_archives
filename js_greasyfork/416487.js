// ==UserScript==
// @name         maths
// @namespace    http://tampermonkey.net/
// @version      0.09
// @description  try to take over the world!
// @author       botclimber
// @match        https://www.flashscore.pt/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416487/maths.user.js
// @updateURL https://update.greasyfork.org/scripts/416487/maths.meta.js
// ==/UserScript==

/*

OBS:
- AROUND 70% OF THE TIME NR OF GOALS IS < 3.5 (TEST: MULT OF <3.5 = ODD( >= 2.00))

*/

(function() {
    'use strict';

    setInterval(function(){ exe(); }, 3000);
    function exe(){
        var data = document.getElementsByClassName("event__scores fontBold"), x = 0, y = 0, ctr = 0,
            math = [0,0,0,0,0,0,0], bothscore = 0, bothnoscore = 0;

        for(var i = 0; i < data.length; i++){
            var scores = data[i].getElementsByTagName("span"),
                res;

            if( data[i].textContent.localeCompare("-") ){
                var left = parseInt(scores[0].textContent), right = parseInt(scores[1].textContent);

                console.log(left+'-'+right)
                res = (left * 1) + (right * 1);

                // nr goals per game
                if(res > 3 ) y++;
                else x++;

                // both score or dont
                if(left > 0 && right > 0) bothscore++;
                else bothnoscore++;

                // more usual results
                for(var j = 0; j < math.length; j++){
                    if(j == res){
                        math[j]++;
                    }
                }

                ctr++;
            }

        }

        console.log(" < 3.5 : "+(x/ctr).toFixed(2)+" | > 3.5 : "+(y/ctr).toFixed(2)+" | Nr Results: "+ctr);

        var major = 0;
        for(var t = 0; t < math.length; t++){
            major = major + (math[t]/ctr);

            console.log(t+" goals: "+math[t]+" | "+(math[t]/ctr).toFixed(2)+"% | major: "+major.toFixed(2)+" | Nr Results: "+ctr);
        }
        console.log("Both Score: "+(bothscore/ctr).toFixed(2)+"% | Both no Score: "+(bothnoscore/ctr).toFixed(2)+"%");
    }
})();