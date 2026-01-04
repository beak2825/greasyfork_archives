// ==UserScript==
// @name         Kahoot colors
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Color your kahoots with rainbows and colors!
// @author       codingMASTER398 (Some bits by FlawCra)
// @run-at       document-start
// @match        https://play.kahoot.it/v2*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424124/Kahoot%20colors.user.js
// @updateURL https://update.greasyfork.org/scripts/424124/Kahoot%20colors.meta.js
// ==/UserScript==

//HOW TO CHANGE COLORS

//A few lines below this, it says "SETTINGS OVER HERE"
//In there, you can change these properties.
//The "MODE" is if you want it to be a still color or a rainbow.
//The "RAINBOWCUSTOMCOLORS" can be changed to something like '#ff2400,#2b1de8' to make a rainbow with those 2 colors (If in rainbow mode"
//If you do not want a custom rainbow color and just want a rainbow, leave it at 'none'
//The "COLOR" is what color you want it to be (If in color mode)



window.antibotAdditionalScripts = window.antibotAdditionalScripts || [];
window.antibotAdditionalScripts.push(()=>{
    console.log("[COLORS] activating")

    //SETTINGS OVER HERE
    var mode = 'rainbow' //Color or rainbow
    var customrainbowcolors = 'none' //Custom rainbow colors if its on rainbow mode
    var color = '#ff2400' //Color if in color mode
    //END O' SETTINGS


    if(customrainbowcolors == 'none'){
        customrainbowcolors = `124deg, #ff2400, #e81d1d, #e8b71d, #e3e81d, #1de840, #1ddde8, #2b1de8, #dd00f3, #dd00f3`
    }
    if(mode == 'color'){
        customrainbowcolors = color+","+color
    }


    var rainbowcss = `background: linear-gradient(`+customrainbowcolors+`);
                    background-color: linear-gradient(`+customrainbowcolors+`);
                    background-size: 1800% 1800%;

                    -webkit-animation: rainbow 18s ease infinite;
                    -z-animation: rainbow 18s ease infinite;
                    -o-animation: rainbow 18s ease infinite;
                      animation: rainbow 18s ease infinite;}

                    @-webkit-keyframes rainbow {
                        0%{background-position:0% 82%}
                        50%{background-position:100% 19%}
                        100%{background-position:0% 82%}
                    }
                    @-moz-keyframes rainbow {
                        0%{background-position:0% 82%}
                        50%{background-position:100% 19%}
                        100%{background-position:0% 82%}
                    }
                    @-o-keyframes rainbow {
                        0%{background-position:0% 82%}
                        50%{background-position:100% 19%}
                        100%{background-position:0% 82%}
                    }
                    @keyframes rainbow {
                        0%{background-position:0% 82%}
                        50%{background-position:100% 19%}
                        100%{background-position:0% 82%}`


        var rainbow = document.createElement("style");

        rainbow.innerText = `
.background__Background-sc-15eg2v3-0 {`+rainbowcss+`};
.gYmPjY {`+rainbowcss+`};
.gfWMuE{`+rainbowcss+`}`
        document.body.appendChild(rainbow);
        console.log("[COLORS] "+rainbow)
})