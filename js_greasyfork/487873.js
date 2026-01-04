// ==UserScript==
// @name         My Delete search results Pornolab Hentai
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  My Delete search results
// @author       You
// @include      *//pornolab.net/forum/tracker.php*
// @include      *//pornolab.net/forum/viewforum.php?f=1752*
// @include      https://pornolab.net/forum/viewforum.php?f=1740*
// @include      https://pornolab.net/forum/viewforum.php?f=1834*
// @include      https://pornolab.net/forum/viewforum.php?f=1711*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487873/My%20Delete%20search%20results%20Pornolab%20Hentai.user.js
// @updateURL https://update.greasyfork.org/scripts/487873/My%20Delete%20search%20results%20Pornolab%20Hentai.meta.js
// ==/UserScript==

let topics = document.querySelectorAll(".forumline.forum tr[id]")
if(topics.length == 0){
    topics = document.querySelectorAll("tbody>.tCenter")
}
//console.log(topics)
for(let topic of topics){
    //let topicLink = topic.querySelector(".tt-text")
    let topicText
    if(topic.querySelector(".tt-text")){
        topicText = topic.querySelector(".tt-text").innerText
    }
    else{
        topicText = topic.querySelector(".row4.med.tLeft.u").innerText
    }
    //console.log(topicText)
    //удалить
    if(

        //сайты
        //жанры
        //topicText.match(/Creampie/)||
        //!topicText.match(/anal/i)||
        topicText.match(/\[cen\]/)||
        //разрешение
        topicText.match(/DVD-5/)||
        topicText.match(/DVD5/)||
        //!topicText.match(/1080p/)&&
        //!topicText.match(/anal/i)||
        topicText.match(/~~~~~~~~~~~~~/)
      ){
        topic.remove();
    }
    //выделить
    else if(
        //жанры
        topicText.match(/lesbian/i)||
        topicText.match(/lesbo/i)||
        topicText.match(/solo/i)||
        topicText.match(/~~~~~~~~~~~~/i)

    ){
        topic.style.backgroundColor = "#ff000030"
        if(topicText.match(/anal/i)){
            topic.style.backgroundColor = "#ff000060"
        }
        //console.log(topicName);
    }
}