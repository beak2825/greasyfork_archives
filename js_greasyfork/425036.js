// ==UserScript==
// @name         Animixplay.to ((Round)) Light
// @namespace    https://tampermonkey.net/
// @version      2.6
// @description  A rounded animixplay.to theme
// @author       DoggoOfSpeed
// @match        https://animixplay.to/*
// @icon         https://animixplay.to/icon.png
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/425036/Animixplayto%20%28%28Round%29%29%20Light.user.js
// @updateURL https://update.greasyfork.org/scripts/425036/Animixplayto%20%28%28Round%29%29%20Light.meta.js
// ==/UserScript==

const style = document.createElement('style');

$('#disqus_thread').addClass('invert');

style.innerHTML = `
:root {
    --bg-primary: #FFFFFF;
    --bg-secondary: #E3E5E8;
    --select-color: #444;
    --gradient1: #3494E6;
    --gradient2: #EC6EAD;
    --text-colour: black;
    --inverted-text-colour: white;
    --border-radius: 10px;
    --user-anime-width: 350px;
}

* {
    transition: all .35s !important;
}

body {
    background-color: var(--bg-primary) !important;
}

.rightcard, .rightcardCenter, #opensidebarbtn, .searchresult > li, #announcement, #readmorebtn, .playerpage, .subpart, #disquscomment, .footer, .leftbottom, #playerleftsidebar, .nav-tabs > li, #lastwatch, .items li, #fullresultbtn, .quickresult {
    background-color: var(--bg-secondary) !important;
}

body, .middle, .infotext, .topmenubtn, #announcement, #readmorebtn, #featuredtext, a, .nav-tabs li a, .form-control::placeholder, #eptitleplace, .altsourcenotif, #usernametop, .playerpage, .info, #malEpisodes, #malTotal, #genres, #status, .epsavailable, .usernameplace, #watchingstatus, #untrackbtn, #infocard, .airtime, .scheduletitle, #scheduletimezone, #lastwatch, #addTitle, #animepagetitle, #panelplace, .subtitleright, #addInfo, .label-default, #q, #azsearch, .halfright, .halfleft2 {
    color: var(--text-colour) !important;
}

.webtitle, .customicon {
    filter: drop-shadow(1px 1px 2px black);
}

#infocard, #readmorebtn, .rightcard:last-child, .quickresult {
    border-radius: 0 0 var(--border-radius) var(--border-radius);
}

.eptitle, .playersidebar > div:first-of-type, .rightcard:first-child, .leftbottom, #announcement, #fullresultbtn {
    border-radius: var(--border-radius) var(--border-radius) 0 0;
}

.playbutton, .playerpage, .imgusr, .plyr__menu__container, #showcommentbtn, #q, .resultimg, .searchresult li, #loadmorelist, #featuredcard, #featuredimg, #schedulenotice, #lastwatch, #progressnumber, #tracknumber, #manualtrackbtn, #playerbottomicon, #seasonalgobtn, #maincoverimage, #notifiaction, .logininput, .loginbtn, #gconnectbtnimg, #alphabetical > button, #azsearch, #backtotopbtn, .resultimg02, .inwardshadow, #featuredbgcont, #premiumnotice, .nav-tabs li a, #openschedulebtn, #disquscomment, .rightcard:only-child, .changepassbtn, #alretinfo, .changeuserbtn, #reportform, .items li, .resultimg2, #q:focus {
    border-radius: var(--border-radius);
}

#followbtn, #trackbtn, #animebtn2, #fullresultbtn > a, select {
    border-radius: calc(var(--border-radius) /2);
}

.rating, .timetext {
    border-radius: var(--border-radius) 0 var(--border-radius) 0;
}

#opensidebarbtn, .nav-tabs > li:first-child{
    border-radius: var(--border-radius) 0 0 var(--border-radius);
}

#lastwatchclosebtn, .nav-tabs > li:last-child {
    border-radius: 0 var(--border-radius) var(--border-radius) 0;
}

.plyr__menu__container .plyr__control {
    color: white !important;
}

#disquscomment, #maincoverimage {
    margin: 25px auto 25px auto;
}

.plyr__menu__container {
    background: rgb(20,20,20);
}

#menuclose, #reportclose {
    margin: 5px 5px 0 -25px;
    background: none;
}

.infotext {
    bottom: 0
}

#updatebtn {
    color: rgb(150, 189, 217);
}

#updatebtn:hover {
    color: rgb(127, 195, 255);
}

#playercountdown, #menumobilebtn, #menumobilebtn2, #showsearchbtn, #recomendedclosebtn, .glyphicon, #ongoingplace > a, p.name, .allitem > a, #animepagecountdown, #seasontitle, .scheduletitle > span, .questionFAQ {
    background: linear-gradient(to bottom right, var(--gradient1), var(--gradient2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

span.typeTag {
    color: gray !important;
}

#iconmenu .glyphicon:hover {
    opacity: .8;
}

.playbutton, #seasonalgobtn, #alphabetical > button, .plyr__control--overlaid {
    background: linear-gradient(to bottom right, var(--gradient1), var(--gradient2));
    color: var(--inverted-text-colour);
}

.btn-primary:hover, .plyr__control--overlaid:hover {
    opacity: .8;
    color: var(--inverted-text-colour);
}

.tooltiptext {
    -webkit-text-fill-color: initial;
}

.genresgrid .form-check-label:hover {
    background: none;
}

#alphabetical {
    display: flex;
    justify-content: center;
}

#alphabetical > button {
    width: 4ch
}

.playbutton, .inwardshadow, #seasonalgobtn {
    box-shadow: 0px 0px 15px hsl(0, 0%, 5%) inset;
}

.btn-primary, #seasonalgobtn {
    border: 1px solid transparent;
}

#lastwatch {
    z-index: 10;
}

.nav-tabs {
    display: flex;
    align-items: flex-end
}

#featuredcard {
    background: initial;
}

.nav-tabs {
    border-bottom: initial;
}

.nav-tabs li a {
    background: none;
}

.nav-tabs li a:hover, #openschedulebtn, #showcommentbtn, #manualtrackbtn, #animebtn2, .nav-tabs .active a, #followbtn, #trackbtn, #animebtn2, .nav-tabs .active a, #tracknumber, #progressnumber, #playerbottomicon, .changepassbtn, .changeuserbtn, .loginbtn, #fullresultbtn a {
    background: var(--select-color) !important;
    color: var(--inverted-text-colour) !important;
}

#openschedulebtn > i, .rating > i {
    background: var(--inverted-text-colour);
    -webkit-background-clip: text;
}

.rating > i {
    background: white;
    -webkit-background-clip: text;
}

.leftbottom {
    opacity: 1;
}

.mobilemenureplace {
   margin: 0
}

#lastwatch {
    padding: 10px 10px 10px 20px;
}

#songContent {
    background: transparent;
}

#songContent, #playertopmenu {
    background: linear-gradient(to bottom, var(--bg-primary) 50%, transparent);
}

.invert {
    filter: invert(1);
}

#reportclose {
    -webkit-text-fill-color: initial;
}

.resultcontainer {
    box-shadow: none;
}

#fullresultbtn {
    border-top: 1px solid #5b5b5b;
}

#allbtn {
    min-width: 8ch;
}

#userlistcontainer {
    grid-template-columns: repeat(auto-fill,minmax(var(--user-anime-width),1fr));
}

@media screen and (max-width: 1000px) {
    body, html, #playertopmenu {
        background-color: var(--bg-primary);
    }

    .middle {
        padding: 10px;
    }

    #lowerplayerpage {
        padding: 20px;
    }

    .subpart {
        background: rgb(32, 32, 32);
    }

    #showcommentbtn {
        width: max(30%, 200px);
    }

    .playerpage {
        min-height: 0px !important;
    }

    #disquscomment {
        background: transparent !important;
    }

    .rightside {
        background-color: var(--bg-secondary) !important;
        filter: drop-shadow(-1px 1px 2px black);
    }
}
`;

document.head.appendChild(style);