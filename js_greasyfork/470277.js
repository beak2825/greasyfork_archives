// ==UserScript==
// @name         MAL extra stats
// @namespace    http://tampermonkey.net/
// @version      0.7.0
// @description  Adds favorite/dropped % and unweighted score to myanimelist stats page
// @author       pepe
// @match        https://myanimelist.net/*/stats*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=myanimelist.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470277/MAL%20extra%20stats.user.js
// @updateURL https://update.greasyfork.org/scripts/470277/MAL%20extra%20stats.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //https://stackoverflow.com/questions/32229667/have-max-2-decimal-places
    function roundDrop(num) {
        return Math.round(num / 0.005) * 0.005;
    }
    function roundFav(num) {
        return Math.round(num / 0.0001) * 0.0001;
    }

    // drop %
    let watching = document.querySelectorAll('[valign="top"]:nth-child(2) .spaceit_pad')[0].textContent.split(" ")[1].replace(/,/g,"");
    let completed = document.querySelectorAll('[valign="top"]:nth-child(2) .spaceit_pad')[1].textContent.split(" ")[1].replace(/,/g,"");
    let dropped = document.querySelectorAll('[valign="top"]:nth-child(2) .spaceit_pad')[3].textContent.split(" ")[1].replace(/,/g,"");
    let total_viewers = parseInt(watching) + parseInt(completed) + parseInt(dropped);
    let dropPercent = +parseFloat(roundDrop((dropped/total_viewers).toFixed(3))*100).toFixed(2); console.log(`${dropped}/${total_viewers}=${(dropped/total_viewers).toFixed(3)}`)
    document.querySelectorAll('[valign="top"]:nth-child(2) .spaceit_pad')[3].innerHTML += " ("+dropPercent+"%)"

    // fav %
    let favEL = document.querySelectorAll('[valign="top"]:nth-child(1) .spaceit_pad');
    let totalEL = document.querySelectorAll('[valign="top"]:nth-child(2) .spaceit_pad')[5];
    let regex = /,| |\n/g;
    let fav = favEL[favEL.length-1].textContent.split(":")[1].replaceAll(regex,""); console.log(fav)
    let favPercent = +parseFloat(roundFav((fav/(total_viewers-parseInt(dropped))).toFixed(3))*100).toFixed(2);

    // add favs to stats
    let newFavEL = `<div class="spaceit_pad"><span class="dark_text" style="color:inherit!important;">Favorites:</span> ${fav} (${favPercent}%)</div>`
    let favDOM = new DOMParser().parseFromString(newFavEL, "text/xml");
    totalEL.parentNode.insertBefore(favDOM.documentElement, totalEL.nextSibling);

    // chart score
    var scores = [];
    var score_bars = document.getElementsByClassName("updatesBar");
    let chart_score = 0;
    let chart_votes = 0;
    for(let i = 0; i < score_bars.length; i++){
        var votes_by_score = score_bars[i].nextElementSibling.getElementsByTagName("small")[0].innerHTML;
        votes_by_score = votes_by_score.substring(votes_by_score.lastIndexOf("(")+1,votes_by_score.lastIndexOf(" "));
        for(let j = 0; j < votes_by_score; j++){
            let score = parseInt(score_bars[i].parentElement.parentElement.previousElementSibling.textContent)
            if(score<10 && score>1) scores.push(score);
        }
        let bar_score = document.querySelectorAll('td.score-label')[i].textContent
        chart_score += Number(bar_score) * Number(votes_by_score)
        chart_votes += Number(votes_by_score)
    }
    chart_score = (chart_score/chart_votes).toFixed(2);

    // inverse calculation of Weighted MAL Score
    function UnweightedScore(){
        try{
            let score_count = document.querySelector('[itemprop=ratingCount]').textContent;
            let mal_rating = Number(document.querySelector('[itemprop=ratingValue]').textContent);
            score_count = Number(score_count.replace(/,/g, ''))
            let UnweightedWithoutBots = ((mal_rating/(score_count/(100+score_count)))-((100/(score_count+100))/(score_count/(100+score_count)))*6.37)

            return ` | est ${UnweightedWithoutBots.toFixed(2)} | mal ${mal_rating}`
        }catch(e){
            return ` (data unreliable)`
        }
    }

    function ChartWithoutFanboys(dataSet){
        const nines = dataSet.filter(n => n == 9)
        nines.forEach(n => dataSet.push(10)) // same amount of 10s as 9s

        const sum = dataSet.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        const average = (sum / dataSet.length).toFixed(2);

        return average
    }

    document.querySelector("table.score-stats").previousElementSibling.outerHTML= '<br><div class="spaceit_pad"><h2>Score Stats</h2> <div class="tooltip" style="margin-bottom:5px;">chart '+chart_score+
        UnweightedScore() +`<span class="tooltiptext">Estimate is unweighted mal score</span></div>`

    document.head.insertAdjacentHTML("beforeend", `<style>

.tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted rgba(155,155,155,0.4);
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;

  /* Position the tooltip */
  position: absolute;
  z-index: 1;
}

.tooltip .tooltiptext {
  width: 320px;
  bottom: 100%;
  left: 50%;
  margin-left: -60px; /* Use half of the width (120/2 = 60), to center the tooltip */
}

.tooltip:hover .tooltiptext {visibility: visible;}

</style>`)

})();