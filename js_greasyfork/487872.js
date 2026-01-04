// ==UserScript==
// @name         My Delete search results Media
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Delete search results Pornolab
// @author       You
// @license      MIT
// @match        https://pornolab.net/forum/tracker.php*
// @match        https://pornolab.net/forum/viewforum.php?f=284*
// @match        https://pornolab.net/forum/viewforum.php?f=1671*
// @match        https://pornolab.net/forum/viewforum.php?f=1741*
// @match        https://pornolab.net/forum/viewforum.php?f=1831*
// @match        https://pornolab.net/forum/viewforum.php?f=1836*
// @match        https://pornolab.net/forum/viewforum.php?f=1842*
// @match        https://pornolab.net/forum/viewforum.php?f=1843*
// @match        https://pornolab.net/forum/viewforum.php?f=1846*
// @match        https://pornolab.net/forum/viewforum.php?f=1857*
// @match        https://pornolab.net/forum/viewforum.php?f=1780*
// @match        https://pornolab.net/forum/viewforum.php?f=1678*
// @match        https://pornolab.net/forum/viewforum.php?f=1861*
// @match        https://pornolab.net/forum/viewforum.php?f=1671*
// @match        https://pornolab.net/forum/viewforum.php?f=1862*
// @match        https://pornolab.net/forum/viewforum.php?f=1831*
// @match        https://pornolab.net/forum/viewforum.php?f=1867*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487872/My%20Delete%20search%20results%20Media.user.js
// @updateURL https://update.greasyfork.org/scripts/487872/My%20Delete%20search%20results%20Media.meta.js
// ==/UserScript==

let deleteButton = document.createElement('button')
deleteButton.style = "position:fixed; top:479px; left:1136px; font-size: 14px; background-color: blue; padding: 4px;"
deleteButton.class = "delete-button"
deleteButton.innerHTML = "Delete"
document.body.appendChild(deleteButton)
deleteButton.onclick = deleteResults
//console.log("My Delete search results Pornolab")

function deleteResults(){
    let topics = document.querySelectorAll('.forumline.forum tr[id*="tr"]')
    if(topics.length == 0){
        topics = document.querySelectorAll("tbody>.tCenter")
    }

    //console.log("111"+topics)
    for(let topic of topics){
        //let topicLink = topic.querySelector(".tt-text")
        let topicText
        if(topic.querySelector(".tt-text")){
            topicText = topic.querySelector(".tt-text").innerText
        }
        else{
            topicText = topic.querySelector(".row4.med.tLeft.u").innerText
        }
        //console.log("111"+topicText)
        //удалить
        if(

            //сайты
            topicText.match(/DaughterSwap/)||
            topicText.match(/FakeHub/)||
            topicText.match(/FTVGirls/)||
            topicText.match(/LezCuties/)||
            topicText.match(/MikesApartment/)||
            topicText.match(/RoccoSiffredi/)||
            topicText.match(/SapphicErotica/)||
            topicText.match(/Shoplyfter/)||
            topicText.match(/SlimeWave/)||
            topicText.match(/WoodmanCastingX/)||
            //жанры
            //topicText.match(/Creampie/)||
            //!topicText.match(/anal/i)||
            //topicText.match(/[cen]/)||
            topicText.match(/All Sex/)||
            topicText.match(/BBW/)||
            topicText.match(/compilation/i)||
            topicText.match(/Cuckold/i)||
            topicText.match(/DAP/)||
            topicText.match(/DPP/)||
            topicText.match(/Facial/i)||
            topicText.match(/Fake tits/i)||
            topicText.match(/FFMM/)||
            topicText.match(/granny/)||
            topicText.match(/Hairy/i)||
            topicText.match(/mature/i)||
            topicText.match(/milf/i)||
            topicText.match(/Over 40/i)||
            topicText.match(/Over 50/i)||
            topicText.match(/Photoshoot/)||
            topicText.match(/prolapse/i)||
            topicText.match(/SATRip/)||
            topicText.match(/Strap-On/)||
            topicText.match(/Upskirtjerk/i)||
            //разрешение
            topicText.match(/240p/)||
            topicText.match(/360p/)||
            topicText.match(/480p/)||
            //!topicText.match(/1080p/)&&
            //!topicText.match(/anal/i)||
            !topicText.match(/lesbian/i)&&
            !topicText.match(/lesbo/i)&&
            !topicText.match(/solo/i)&&
            !topicText.match(/masturbation/i)||

            //актрисы
            topicText.match(/Alexis Crystal/)||
            topicText.match(/Anhen/)||
            topicText.match(/avamoonlight100/)||
            topicText.match(/Cassidy Klein/)||
            topicText.match(/Crystal Rush/)||
            topicText.match(/Elin Holm/)||
            topicText.match(/Emma Fantazy/)||
            topicText.match(/Emily Ross/)||
            topicText.match(/Eva Blade/)||
            topicText.match(/Felicia Rain/)||
            topicText.match(/Goldie Glass/)||
            topicText.match(/Jadeelee/)||
            topicText.match(/Kira Axe/)||
            topicText.match(/Lena show/)||
            topicText.match(/Liza Katseye/)||
            topicText.match(/Lira Red/)||
            topicText.match(/Marfa Piroshka/)||
            topicText.match(/Maria Rya/)||
            topicText.match(/May Fiesta/)||
            topicText.match(/Melena Maria/)||
            topicText.match(/MiladyStarlight/)||
            topicText.match(/Molly p/)||
            topicText.match(/Nataly Gold/)||
            topicText.match(/Nika Charming/)||
            topicText.match(/Odell/)||
            topicText.match(/Olga Leona/)||
            topicText.match(/Polina Maxima/)||
            topicText.match(/Ptica/)||
            topicText.match(/Purple Bitch/i)||
            topicText.match(/Quin Tyler/)||
            topicText.match(/Valerie Duval/)||
            topicText.match(/Valentina Ricci/)||
            topicText.match(/~~~~~~~~~~~~~/)
        ){
            topic.remove();
        }
        //выделить
        else if(
            //жанры
            topicText.match(/lesbian/i)||
            topicText.match(/lesbo/i)||
            topicText.match(/anal/i)||
            //topicText.match(/solo/i)||
            topicText.match(/~~~~~~~~~~~~/i)

        ){
            topic.style.backgroundColor = "#ff000030"
            if(topicText.match(/anal/i)||
               topicText.match(/ass lick/i)||
               topicText.match(/asslick/i)||
               topicText.match(/rimming/i)||
               topicText.match(/ass fing/i)
              ){
                topic.style.backgroundColor = "#ff000060"
            }
            //console.log(topicName);
        }
    }
}
