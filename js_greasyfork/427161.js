// ==UserScript==
// @name         78k AnimeDao Feel
// @namespace    http://tampermonkey.net/
// @version      v2.7
// @description  the 78k animedao feel, wont work in home page, only works in an anime watching page. spaghetti code, but works as of may 2021
// @author       78k
// @match        https://animedao.to/*
// @icon         https://www.google.com/s2/favicons?domain=animedao.to
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427161/78k%20AnimeDao%20Feel.user.js
// @updateURL https://update.greasyfork.org/scripts/427161/78k%20AnimeDao%20Feel.meta.js
// ==/UserScript==
window.onload=function a615796(){
//spaghetti code, but works nonetheless yeet.
//this is real-life code made by a real life person.
 document.getElementsByClassName('close')[0].click()
 document.getElementsByClassName('close')[1].click()
 document.getElementsByClassName('close')[2].click()
//click adClose buttons, doesn't remove popup ads, or ads found in the video player.
 var a450597 = document.createElement('span');
 a450597.innerHTML = document.getElementsByClassName('img-responsive')[0].outerHTML;
 document.getElementsByClassName('hidden-xs hidden-sm')[0].prepend(a450597);
 document.getElementsByClassName('img-responsive')[1].remove()
//puts the cover image to where the first ad is usually seen.
//it's placed there coz the ad is gone, and there is stupid free space which i dont like
 document.getElementsByClassName('col-md-8')[1].children[0].remove()
 document.getElementsByClassName('col-md-8')[1].children[1].remove()
//removes ad space. they suck for me. comment out the code if you like them
//to comment code out, put two "/" before it. just like this comment       --->       //hello, im a comment.
 document.body.style.setProperty('font-family', 'system-ui')
//changes font to a font that i like for the whole page.
 var a133344 = document.getElementsByClassName('animedao-color')[0]
 a133344.style.setProperty('background-color', '#0220')
 a133344.style.setProperty('border-radius', '2')
//changes search button color, and makes the border squarey
// document.getElementsByClassName('btn btn-primary')[1].children[0].remove()
//removes "all episodes" text
 document.body.style.background = "#1C1C1E"
//changes outside to #1C1C1E <-- hex colorcode
 document.getElementsByClassName('container content')[0].style.setProperty('background-color', "#0220")
//changes inside background to #0220 or a kind of dark gray
 document.getElementsByTagName('hr')[0].remove()
 document.getElementsByClassName('col-md-8')[1].children[1].remove()
 document.getElementsByClassName('col-md-8')[1].children[0].remove()
 //document.getElementsByClassName('col-md-8')[1].children[2].remove()
//removes stuuuuuuuuuuuuuuuuuuuuuuuupid lines
 document.body.style.setProperty('color', "gray")
//sets font color to gray to make it readable
 document.getElementsByClassName('row footer-info')[0].remove()
//removes footer info lmao i dont like it lol.
 document.getElementsByClassName('nav-tabs')[0].style.setProperty('border-bottom','0')
//removes bottom border for navigation tabs (nav tabs is the one where "Video", "VCDN" and others are placed.
 document.getElementsByTagName('h4')[2].innerText = 'no spoyler, spoyl = ban, flag spoyler as Innapropriate'
//changes the text of the spoilerBan alert
 document.getElementsByClassName('col-md-4')[1].innerHTML = "<div class=\"alert\" style=\"border: 2px solid #fcba03;\"><center><h4>Shift+Z to skip 1 Minute and 30 Seconds (perfect opening skip)<br><br>Shift+X to Go to Next Episode</h4></center></div>"
//some tips lol
 document.getElementsByClassName('navbar-brand')[0].lastChild.textContent = " 78k Animedao Feel"
//some branding, lol
 document.getElementsByClassName('container content')[0].style.setProperty('width','auto')
//better width (looks so much better)
//document.getElementsByClassName('alert')[4].append(document.getElementsByClassName("alert alert-info")[4])
//document.getElementsByClassName('alert alert-info')[4].outerHTML = "<div class=\"alert\"><center><h4>\nJoin <a href=\"https://discord.gg/E3yZqHPnVZ\" target=\"_blank\" title=\"Discord\"><b><i class=\"fab fa-discord\" aria-hidden=\"true\"></i> AnimeDao Discord</b></a></h4></center></div>"
//broken code, dont know what went wrong up here.
}

function a875579(d) {
    if (d.shiftKey && d.key === 'Z') {
       var cT = document.getElementsByTagName('video')[0].currentTime
       document.getElementsByTagName('video')[0].currentTime = cT + 90
    }
}
document.addEventListener('keyup', a875579, false);
function a875578(e) {
    if (e.shiftKey && e.key === 'X') {
        if(document.getElementsByClassName('btn btn-primary').length == 3){
         document.getElementsByClassName('btn btn-primary')[2].click()
        }else{
         document.getElementsByClassName('btn btn-primary')[1].click()
        }
    }
}
document.addEventListener('keyup', a875578, false);