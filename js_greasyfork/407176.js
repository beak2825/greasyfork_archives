// ==UserScript==
// @name         cube per second counter
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  cube per second counter for synergism
// @author       Galaus
// @match        https://v1011testing.vercel.app/
// @include      https://v1011testing.vercel.app/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407176/cube%20per%20second%20counter.user.js
// @updateURL https://update.greasyfork.org/scripts/407176/cube%20per%20second%20counter.meta.js
// ==/UserScript==


var previousCubes = 0
var cubesGained = 0
var cubesPerSecond = 0
    setInterval(()=>{
    if(previousCubes < player.wowCubes){
        cubesGained += player.wowCubes - previousCubes
    cubesPerSecond = cubesGained / player.ascensionCounter
     console.log("cubes gained in total " + cubesGained);
     console.log("cubes gained per second " + cubesPerSecond);
    }
    previousCubes = player.wowCubes
    cubesPerSecond = cubesGained / player.ascensionCounter
    },50)



document.getElementById("ascendbtn").addEventListener("click", function(){
    previousCubes = player.wowCubes
    cubesGained = 100/100 * calculateCubeMultiplier() * 250
    cubesPerSecond = 0
});