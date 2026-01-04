// ==UserScript==
// @name         Instagram Like Bot With 15 Second Time Delay
// @namespace    https://jackhammer-games.herokuapp.com
// @version      1.0.0
// @description  Likes The Posts Automatically From Hashtags With A 15 Second Time Delay..
// @author       Jackhammer Games
// @match        https://www.instagram.com/
// @downloadURL https://update.greasyfork.org/scripts/429863/Instagram%20Like%20Bot%20With%2015%20Second%20Time%20Delay.user.js
// @updateURL https://update.greasyfork.org/scripts/429863/Instagram%20Like%20Bot%20With%2015%20Second%20Time%20Delay.meta.js
// ==/UserScript==

var timeBetweenLikes = 15*1000;

setInterval(function(){
    var likeBtn = document.getElementsByClassName("wpO6b  ");
    var nextBtn = document.querySelector(".coreSpriteRightPaginationArrow");
    if (likeBtn[1]){
        likeBtn[1].click();
    }
    nextBtn.click();
},timeBetweenLikes);