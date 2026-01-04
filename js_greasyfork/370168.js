// ==UserScript==
// @name         Rutor Preview Ajax
// @namespace    https://github.com/AlekPet/
// @version      1.4.7.1
// @description  Предпросмотр раздач на сайте
// @author       AlekPet
// @license      MIT; https://opensource.org/licenses/MIT
// @match        http*://tor-ru.net/*
// @match        http*://zerkalo-rutor.org/*
// @match        http*://rutor.info/*
// @match        http*://rutor.is/*
// @match        http*://free-rutor.org/*
// @match        http*://freedom-tor.org/*
// @match        http*://top-tor.org/*
// @match        http*://rutor.is/*
// @match        http*://live-rutor.org/*
// @match        http*://xrutor.org/*
// @match        http*://rutor.info/*
// @match        http*://new-rutor.org/*
// @match        http*://6tor.org/*
// @icon         https://raw.githubusercontent.com/AlekPet/Rutor-Preview-Ajax/master/assets/images/icon.png
// @connect *
// @run-at document-end
// @noframes
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_addStyle
// @grant GM_addValueChangeListener
// @grant GM.xmlHttpRequest
// @grant GM_getResourceText
// @require https://code.jquery.com/jquery-3.1.0.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js
// @downloadURL https://update.greasyfork.org/scripts/370168/Rutor%20Preview%20Ajax.user.js
// @updateURL https://update.greasyfork.org/scripts/370168/Rutor%20Preview%20Ajax.meta.js
// ==/UserScript==

GM_addStyle(`
.mDiv{width: 250px;border: 3px double #FFA302;/* right: 9px; */text-align: center;    color: white;max-height: 90vh;overflow-y: auto;}
.mDiv_title{background-image: url(/s/i/poisk_bg.gif);background-size: 40% 100%;padding: 5px;border-bottom: 2px solid #ffea00; cursor: pointer;}
.mDiv_inner{width: 95%;overflow-y: auto;max-height: 300px;}
.mDiv_FavInner{overflow-y: auto;max-height: 300px; color: silver; width: 80%;margin: 0 auto;padding: 10px;}

.mDiv_title.no_vis{filter: grayscale(1) brightness(1.5) !important;}
.mDiv_title.opens{display:none;filter: hue-rotate(-40deg);}
.mDiv_title.fav{filter:  hue-rotate(200deg);}
.mDiv_title.stream{filter:  hue-rotate(120deg);}

.com_Style{background: linear-gradient(#b7b7b7,#545454);color: white;text-align: center;padding: 4px;cursor: pointer;user-select: none; width: 300px;margin: 0 auto;border-radius: 8px;transition: all 0.5s ease;margin-bottom: 10px;}
.com_Style:hover {background: linear-gradient(#676666,#9e9e9e);width: 350px;transition: all 0.5s ease-out;font-size: 1.2em;}

#my_content{border: 1px solid silver;}
.my_tr{display:none;}

.footSpoiler{text-align: center; padding: 10px;}

.box_comments{background: #d0caca;width: 90%;margin: 0 auto;padding: 10px;border-radius:8px;}

div#index tr.my_tr:hover { background-color: white;}
div#my_content tr:hover { background-color: white;}

.buttonsStyle {border: 1px solid;width: 80%;margin: 3px auto;background: linear-gradient(#72ff72,#1d8e08);padding: 5px;cursor: pointer;}
.buttonsStyle:hover{background: linear-gradient(#2fc12f,#246318);}
.mDiv_FavControl{background: linear-gradient(#5a0067,#815f87);}
.mDiv_FavControl:hover{background: linear-gradient(#be0a2f,#bc8ec5);}
.mDiv_FavControlCheck{background: linear-gradient(#336700,#6e875f);}
.mDiv_FavControlCheck:hover{background: linear-gradient(#07a116,#347036);}
.butSpoiler{cursor:pointer; width: 16px;}
.mDivFavControl_box{
    display: flex;
    margin: 0 20px;
    font-size: 0.8rem;
}

div.seeEl {width: 80%;margin: 5px auto;background: linear-gradient(#e2a9d1,#ffc200);cursor: pointer;overflow: hidden;line-height: 1;font-size: 0.8em;    box-sizing: content-box;color: black; font-weight: bold;font-family: monospace;}
div.seeEl:hover{background: linear-gradient(#ff9b58,#f5ff0082); color: #8e0000;}
div.seeEl div img:not(.butSpoiler) {box-shadow: 2px 2px 5px black;}
.minipanel{display: table-cell;vertical-align: middle;padding: 5px;border-left: 1px dotted white;background: linear-gradient(#df99e8,#ff6400);}
.minipanel:hover {background: linear-gradient(#d377de,#ff7000);}
.minipanel:hover img{transition:1s all;transform: rotateX(360deg) !important;}
.minipanel img{transition:1s all;}

.loading_tor_box{padding: 5px;}
.loading_tor {width: 100%;background: #e0dcdc;border-radius: 8px;}
.loading_tor_text{height: inherit;width: 0%;background: linear-gradient(#1dff60, #00b327);border-radius: 8px;color: #676767;font-size: 1em;padding: 2px;}

.checkbox_Load:not(checked) {opacity: 0;}
.checkbox_Load + label {cursor: pointer;position: absolute;left: 35%;}
.checkbox_Load:checked + label:before {background: #53d64c;}
.checkbox_Load:checked + label:after {left: 5px;content: 'ON';color: green;}
.checkbox_Load:not(checked) + label:before {content: '';position: absolute;top: 2px;left: -28px;width: 60px;height: 20px;background: #ff6060;box-shadow: inset 0 2px 3px rgba(0,0,0,.2);}
.checkbox_Load:not(checked) + label:after {content: 'OFF';position: absolute;top: 4px;left: -25px;width: 25px;height: 15px;background: #FFF;box-shadow: 0 2px 5px rgba(0,0,0,.3);transition: all .2s;}
div.imgages_Load {display: table; border-collapse: collapse; color: #b40000;font-family: monospace;font-weight: bold;}
.preLoadImagesCell{display: table-cell;height: 40px;vertical-align: middle;background: #fbf7f7;text-align: center;width: 40%;}
.preLoadImagesRow{display:table-row;}
.preLoadImagesRow #timoutTimeImages {width:50%;text-align: right;color: #00447f;font-family: monospace;font-weight: bold;}
.splitter{border-top: 1px solid silver;}

tr.gai td a[href='javascript:void(0);'], tr.tum td a[href='javascript:void(0);']{margin-right: 5px;}
tr.gai td a[href='javascript:void(0);'] img, tr.tum td a[href='javascript:void(0);'] img, .box_buttons_inner a[href='javascript:void(0);'] img{transition:1s transform;}
tr.gai td a[href='javascript:void(0);'] img:hover, tr.tum td a[href='javascript:void(0);'] img:hover, .box_buttons_inner a[href='javascript:void(0);'] img:hover{transform: scale(1.3);filter: hue-rotate(270deg);}
.FavBlockEl{margin: 0 5px 10px 0;background: #fbf7f7;box-shadow: 2px 2px 5px silver;}
.FavBlockEl a {text-decoration: none;font-size: 0.8em;font-weight: bold;}
.FavBlockEl a:hover {color: #73046a !important;}
.FavBlockEl > div:nth-child(2) div {margin: 5px 0 5px 0;}
.FavBlockEl > div:nth-child(3) {display: table-cell;vertical-align: middle;padding: 5px;border-left: 1px dotted;background: linear-gradient(to bottom, #fbf7f7, #ffc7c7);font-weight: bold;color: orange;user-select: none;cursor: pointer;}
.FavBlockEl > div:nth-child(3):hover{background: linear-gradient(#ffd4d4 50%, #f59999);}
.poleLinks{display:block;transition: 1s transform;}
.poleLinks:hover{transform: scale(1.4);}
.mDiv_Popup {background: #fbf7f7;width: 300px;border: 1px solid silver;box-shadow: 4px 4px 8px #00000073;border-radius: 6px;margin: 10% auto;text-align: center; display:none;}
.mDiv_Popup > .mDiv_Popup_title {padding: 5px;font-size: 1.2em;font-family: cursive;border-radius: 6px 6px 0 0;background-image: url(/s/i/poisk_bg.gif);background-size: 40% 100%;color:white;}
.mDiv_Popup > .mDiv_Popup_message_box {font-size: 1em;text-align: center;line-height: 1.5;color: darkslategrey;border-radius: 0 0 6px 6px;border-top: 1px solid #1d1d1d;}
.mDiv_Popup_message_box > .mDiv_Popup_message {padding: 10px;max-height: 500px;min-height: 90px;overflow-y: auto;}
.mDiv_Popup_smoke {position: fixed;background: #000000a6;left: 0;top: 0;width: 100%;height: 100%;display: none;z-index:3;}
.box_buttons_inner {display: inline-block;margin-left: 20px;}
.mDiv_Popup_title_x {float: right; cursor: pointer;}
.mDiv_Popup_title_x:after {content: 'X';}
.mDiv_Popup_title_x:hover {color: yellow;}
tr.backgr td > div {display: inline;}
.blend_class{background-blend-mode: luminosity;background-color: #ffd74540;}
/*---*/
.pop_panel{
margin-right: 5px;
    position: relative;
}
.pop_elements {
    position: absolute;
    background: white;
    padding: 6px;
    text-align: center;
    border: 1px solid silver;
    top: -20px;
    right: 50%;
    width: max-content;
    height: -webkit-fill-available;
    border-radius: 6px;
    box-shadow: 0px 2px 4px 0px silver;
    display: none;
}
.pop_panel:hover > .pop_elements{
    display: block;
}

.pop_elements a {
    position: relative;
    margin: 0px 10px;
}
.pop_elements a span {
    position: absolute;
    font-size: 5px;
    top: 13px;
    left: 50%;
    transform: translate(-50%, 0px);
    color: silver;
}
/*.pop_elements a[data-servname]:after {
    content: attr(data-servname);
    font-size: 8px;
    text-decoration: none;
}*/

.service_splitter{
    border-right: 2px dotted silver;
    padding-right: 5px;
}

#torrentPlayer {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 1px solid silver;
    user-select: none;
    font-family: monospace;
    background: #ffffffcf;
    color: white;
    display: flex
;
    flex-direction: column;
    min-width: 640px;
}

.torrentPlayer_video {
  position: relative;
  width: 100%;
  height: 100%;
  background: #000000d1;
}

.torrentPlayer_video iframe{
   position: absolute;
   width: 100%;
   height: 100%;
   top: 0;
   left: 0;
}

.torrentPlayer_list {
    color: #810c0c;
    padding: 2px;
    line-height: 2;
    font-weight: bold;
}

.torrentPlayer_title {
    background: black;
    font-weight: bold;
    text-align: center;
    padding: 10px;
}

.torrentPlayer_info {}

.torrentPlayer_close {
    cursor: pointer;
    position: absolute;
    right: -12px;
    top: -15px;
    background: #c0c0c0e0;
    border-radius: 100%;
    padding: 10px;
    z-index: 1;
}
.torrentPlayer_close:hover {
    background: #939393de;
}

.torrentPlayer_playlist {
    max-height: 200px;
    overflow-y: scroll;
    list-style: none;
    display: flex;
    flex-direction: column;
    margin: 2px;
    padding: 4px;
}

.torrentPlayer_playlist li {
cursor: pointer;
    border: 1px solid #ffa302;
    background: linear-gradient(45deg, #fed304, transparent);
    border-radius: 4px;
    padding: 0 6px;
    margin: 2px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    word-break: break-all;
}

.torrentPlayer_playlist li.playing{
}

.torrentPlayer_playlist_item_title{
    text-align: left;
    border-right: 2px dotted orange;
    width: 90%;
    position: relative;
}

.playlist_item_progress{
    position: absolute;
    left: -5px;
    top: 1px;
    background: linear-gradient(45deg,transparent,#fe4904c9);
    height: 100%;
    border-radius: 4px;
}

.torrentPlayer_playlist_item_title_item_size {
    padding: 0 3px;
    width: 10%;
    text-align: center;
}
.activExists:first-child:before {
    content: attr(data-exists);
    background: green;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: -10px;
    writing-mode: vertical-lr;
    text-orientation: upright;
    color: wheat;
    padding: 2px;
    font-size: 0.7rem;
}
.activExistsRed:first-child:before{
    background: red;
}
.mDiv::-webkit-scrollbar {
    width: 7px;
}
.mDiv::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
}
.mDiv::-webkit-scrollbar-track{
    background: #caffd1;
}
.mDiv::-webkit-scrollbar-thumb {
    background: darkseagreen;
    box-shadow: inset 0 0 0px 2px rgb(38 175 13 / 44%);
}
`);

/* sorted plugin jquery

tr.backgr td:not(:first-child):not(:last-child) {background: url(/agrrr/img/sort-bg.gif) 100% -70px no-repeat;font-size: 12px;text-align: left;cursor: pointer;padding-right: 19px;}
tr.backgr td.headerSortUp{background-position-y: -20px;}
tr.backgr td.headerSortDown{background-position-y: -120px;}

tr.backgr td > div.headerSortUp{background-position-y: -135px;}
tr.backgr td > div.headerSortDown{background-position-y: -36px;}
tr.backgr td > div {background: url(/agrrr/img/sort-bg.gif) 100% -86px no-repeat;font-size: 12px;text-align: left;cursor: pointer;padding-right: 20px;display: inline;height: 20px;position: relative;top: 1px;}
*/

(function() {
    'use strict';
    const $ = window.jQuery,
          image_arrow = "https://raw.githubusercontent.com/AlekPet/Rutor-Preview-Ajax/master/assets/images/arrow_icon.gif",
          no_image = "https://raw.githubusercontent.com/AlekPet/Rutor-Preview-Ajax/master/assets/images/no_image.png",
          favIcon = "https://raw.githubusercontent.com/AlekPet/Rutor-Preview-Ajax/master/assets/images/yellow_heart.png",//"https://aminoapps.com/static/bower/emojify.js/images/emoji/yellow_heart.png",
          searchIcon = "https://raw.githubusercontent.com/AlekPet/Rutor-Preview-Ajax/master/assets/images/search_icon.png",
          torrServIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACplBMVEVVVVVURkdYT1B1WD9KPT1SR0hORUYtISIsJCYrISIzIiIsIyVcOhotICJ8eXdeVlZWTE1QRkdLQUNQRkeZajbTeBlbU1RSSElGPT1DOjppTC93Uy5RSEhaU1VUTExLQkJANjdMQkJPQk5IPD4/NjU/NTVPQ05DOTs9MjM9MDE/NjVAODY3Ky03Kyw2Kis1KSo0KCkxJihDOzlDOjkxJyguJCQ3LC0fDg0wJSZANjY/NTYnHR4yJihANzlBODgiGR89LCNwSB9ZSDtLQ0I5Li8vJCUqHR7gfQBXNxstIiY2Kyw2LC0vIyUsICAfCQ1NRkRYVU9ZWlBMRkVWUEyAgXeXlo2fpJaeqJiolHC8hjliV0hjYVmRkIebnJKem5Shp5y3rIjhmTS7oXGXn5FjX1lZXE+apJGNi4RuaWVoYmKTh23kmS7WnEmrrZ+orJ6Zno9YWE6EjXuosp+rrqKMjoaFdmXmoDf3kw7TolnIp22uspyor5+EjntOSESapZGqsqGusqagm4a/fCf8kwf+kgHwlRnEq3qttaaprqCYn49OSURaVFChq5ers6KvsaeimoOqgEv0lhj4jwbJomGwuaqvuKipraCgppZaWVBaVVCrsqKusKanq5/Hj0L+lATGfiOGdmB8e3Kgp5irsKKgqJZbXFJQSkabp5KrtaKsrqXIrnf5lg3/kgDhhQ21jFCQj4SXnI6rsaFSTkeJlYCotKCtrJvNoFrnkyT4jgTJjD6EfHB1c22SlYmnrJ6Fh3xjZVqcqpOnq56xrZPimDPQlEKAdm2YmZGEgnt2dmybn5FhXFhxcmman5HKoFvUmkaurpmQj4l4c255d2+MlYNxcWiBa028ikGgnYagqpmgopaZmo+KjIBoaGBeW1dramNqZmFfWVb///9Brb7hAAAAT3RSTlMAAAAAAAAAAAAAAAAAAAI0h8PewkMID3bc/f3heA8Pk/mTAnb5+QI03If9/cPD3t7Dh/39hzTcAnb5+Q+T+fkPe+L8/dx2Dww9ht7ehzQC034NnwAAAAFiS0dE4V8Iz6YAAAAHdElNRQfnARcNDQ5t9QcVAAABG0lEQVQY0wEQAe/+AAABAg4PEBESEhMQFBUDAQAABAUWFxgZT1BRUhobHB0FBAAGHh8gU1RVVldYWVogIR4GACIjJFtcXV5fYGFiY2QlIyYAJyhlZmdoaWprbG1ub3AoJwApKnFyc3R1dnd4eXp7fCspACx9fn+AgYKDhIWGh4iJii0ALouMjY6PkJGSk5SVlpeYLgAvmYyam5ydnp+goaKjpKUvADCmp6ipqqusra6vsLFvsjAAMTKztLW2t7i5uru8vb4zNAA1Nr/AwcLDxMXGx8jJyjY1ADc4OcvMzc7P0NHS09Q6ODcABzs8PdXW19jZ2tvcPjw7BwAICT9AQULd3t/gQ0RFRgkIAAoLDEdISTBKSzBMTU4NCwoBwWbifpX7rQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMy0wMS0yM1QxMzoxMjo1MyswMDowMINE+WMAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjMtMDEtMjNUMTM6MTI6NTMrMDA6MDDyGUHfAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDIzLTAxLTIzVDEzOjEzOjE0KzAwOjAwCyM7SgAAAABJRU5ErkJggg==",
          torrServToAdd = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABDlBMVEVKr1BKrzBLr09Lrk9Mo0ZLrlF0w19Mrk5Lrk5PqkZMr1BLrlBMr05Mrk9avjNKrk5Lr1BCtGJHpUFLr045vlVNrE1Lrk9Krk9Lrk9Lrk9Lrk9Lrk9Mrk9Mr05Mr09Lrk9Lrk9Lrk9Lrk9Lrk9Mrk9Lrk9Lrk9Lrk9Lr09JrU5Lrk9Lr09Lrk9Lrk9Lrk9Lrk9Lrk9Lrk9Mrk9Lrk9LrlBLsE5Lrk9Mrk9Kr05Lrk9MrlBLrk5Mr09Lrk9IrU1Krk9TsVaJyoxTslZKrU5gt2Pq9utguGRIrUxft2Lt9+7u9+5guGNSsVZet2JdtmFxv3Tv+O/v+PBywHWKyo3q9urt9+39/v1xv3Vft2P///+b6o0DAAAAPXRSTlMAAAAAAAAAAAAAAAAAAAAAAAAAAAAABkei3fncSgcajujrjRcarf6pFwaMB+nqSaH420lIBweoFxaLB0gHlFkjPAAAAAFiS0dEWZqy9BgAAAAJcEhZcwAAAOwAAADsAXkocb0AAAAHdElNRQfnARcNDQ5t9QcVAAAA0UlEQVQY02NgYGQSE5eQlJKSlpCRZWZhZWBjl5NXsAUDRSVlDk4GLhVVEMfODkioqWtwM2jKA1n2Do6OTvZAES1tBnEdoICzi6urmzOQoavHIAHiu3t4enm7g0T0GSRtbX18/fwDAoP8fH1sbaUZpGztgkNCA8LCAkJdg91tDTAFIFrCAwPDwVoMoYZGeHpGQA01UoRa6wK21pjBREsN6DAfR0cfsMNMGXiU1dXgTjcz52Xg47ew1IV4TlfLXECQgVWI2UpPX9rAwFDf2kZYRBQA9Mo2aHeqks0AAAAldEVYdGRhdGU6Y3JlYXRlADIwMjMtMDEtMjNUMTM6MTI6MjgrMDA6MDCLhqSAAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIzLTAxLTIzVDEzOjEyOjI4KzAwOjAw+tscPAAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyMy0wMS0yM1QxMzoxMzoxNCswMDowMAsjO0oAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC",
          aceStreamIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACZFBMVEX//wD/+CL/////dFgAAAD/yf//6AP//wP/fVn/5a3//xFds8v//zOm//9izl8y03NXpbxmxeAA7/9CsZQA/xA+7JGD+v88/44w0XJft9Bu1PEAAAABAQDuVUH4WUT5WUTyVj0KAAAAAAEKBQD4fQD6egfxWzj9W0X+W0X+W0X/W0H6WkncVFsBAQEEAgDhcQD9fwD9gAD+Xz3+W0X+W0X+W0PRVXWdVM+eVNGdUsoSCQD9gAD+gAD6YzP+W0b/W0X/W0ONUNmcVNSdVdSdVdSdVdScVNOYUs36fgD+gAD+gAD7YzP9WkX5WUS6PA2OTMCcVNOdVdScVNOcVNOdVdScVNP4gQL+gAD+gAD9gACKRridUtLoAMCAOaecVNOdVdP1wiP3tBz+fwD+gADjcgADAgA6fohGjJ1Hi50BfU2fS9GcVNP8xiT1wyTYeQbxhwcCBARIip1JjJ9IjJ5WgKX8xiX8xiT7xiT6xiQHBgFBfJBIi55JjJ9Ii55Ih5yUGKf8xiT9xyX9xyX8xiXyvCEhk08hoE9DjJRIi55Ji55JjJ/6xCT9xyT9xyX8xiTTuisipVsnplonp1smplonmlxEfJVJi55JjJ9HiZzqviX/xiP/xiAABjAmplomplpHiZxJjJ9Ji55DgpQ0plUjpVoaolwlpVonp1snp1snp1smpVlIi55Ji59Iip0BAgMdj08mplonp1onp1onp1omplompFkmplkwmG5Ii55Ii55Ii50KLxglolgmpVklolgSVS1GdpxIip5Ii55HiJsBAgIBAwE/e45FhpgAAQFJjJ8np1v///+JAouZAAAAyXRSTlMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQggIAsBAQEWGw5SmpFnPQsBAQZTTmy/skEUQYEjAWyDHsDXXRWe8fnNghkq1nIiQRcDCHrde6f0oRit9WIGNAEEctobGXKHBwEHaUQDFZZxHQYJAUDwnC/QZGJAAQmq/JUmAsHy9LQMBhMldcv5MM3njRQ/gLKbDAi88TITXCoBi3wq6LoNGUYwQuPo5DSO5kMBBV/E4tqPMlITZsJNAR0wGwIHRGMfAQEFCwGmiBL/AAAAAWJLR0QCZgt8ZAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAAd0SU1FB+cBFw0NDfT8Vq8AAAEbSURBVBjTARAB7/4AGxsbHBsAAQIDHR4fICEiGwAbGyMEACQlJicoKSorLAQtABsuBC8wMTIzNDU2Nzg5BQIAGxs6Ozw9Pj9AQUJDREVGRwAbBkhJSktMTU5PUFFSU1RVAAdWV1hZBAgJGwRaW1xdXl8AYGFiY2QEZRsbBGZnaGlqawBsbW5vCiMbG3ALcXJyc3RbAHV2d3gMeRsEDXp7yXx9fn8AgIGCg4QOD4WGh4iJinEQGwCLjI2Oj5CRkpOUlZaXmBEbAJmamxKcncrKnhOfoKGiBBsAo6Slpp2nqKmqFKusrRGuGwCvsLGys7S1tre4uboEGxsbAAS7vL2+vxXAwcLDFhvEGxsAxRsXGBcEG8bHGRobyBsbG5hpVpaCHPp+AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIzLTAxLTIzVDEzOjEyOjI4KzAwOjAwi4akgAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMy0wMS0yM1QxMzoxMjoyOCswMDowMPrbHDwAAAAodEVYdGRhdGU6dGltZXN0YW1wADIwMjMtMDEtMjNUMTM6MTM6MTMrMDA6MDDOhAXEAAAAAElFTkSuQmCC",


          images_ = [image_arrow,no_image,favIcon,searchIcon,torrServIcon],

          hostname = location.origin,

          debug = 0,
          torr_serv_port = 8090,
          acestream_port = 6878

    var ObjSave = null,
        TimeOutImages = 5;

    GM_addValueChangeListener('ObjSave', function() {
        let ls_value = GM_getValue('ObjSave');

        ObjSave = (ls_value)?JSON.parse(ls_value):{};
        updateFav();
        updateForm();
    });

    function checkLocaltorage(){
        if(ObjSave){
            if (!ObjSave.hasOwnProperty('favorites')){
                ObjSave.favorites = [];
            }

            if (!ObjSave.hasOwnProperty('options')){
                ObjSave.options = {};
            }

            if(debug) console.log("Объект: ",ObjSave);
        }
    }

    function loadStorage(){
        let ObjSave_tmp = GM_getValue('ObjSave');

        ObjSave = (ObjSave_tmp) ? JSON.parse(GM_getValue('ObjSave')) : {
            options: {}
        };

        checkLocaltorage();
    }

    function saveToStorage(){
        try{
            var save_data = JSON.stringify(ObjSave);

            if(save_data.length>0 && save_data !== null && save_data !=="" && save_data !== undefined){
                GM_setValue('ObjSave', save_data);
                if(debug) console.log("Сохраненно: ",ObjSave);
            }
        }catch(e){
            console.log(e);
        }
    }

    function LoadingImages(param){
        try{
            //Images
            let callback = param.func,
                content = param.content,
                button = param.button,
                elem = param.elem,
                IMGElements = $(content).find('#details tr:eq(0) img:not([src^="http://rublacklist.net"])'),
                lenIMG = IMGElements.length,


                progressBar = $(elem).nextAll(":eq(0)"),
                progressBarText = progressBar.find(".loading_tor_text"),
                procentuno = 100/lenIMG;

            if(lenIMG > 0){
                if(debug){
                    console.log(`Изображений найдено: ${lenIMG}\n------------------------------`);
                    console.log("Тайм-аут равен: ", TimeOutImages, "Если 0 тайм-аут выкл.");
                }

                let imgLoaded = 0,
                    procentLoaded = 0;

                progressBar.show();

                $(IMGElements).each(function(){
                    let image = this,
                        timer = null;

                    $(image).one("load", function(){
                        if (timer) {
                            clearTimeout(timer);
                            timer = null;
                        }

                        imgLoaded++;

                        if(debug) console.log("Изображений загруженно: ",imgLoaded);

                        procentLoaded += procentuno;
                        progressBarText.css("width", procentLoaded+"%");
                        progressBarText.text("Загружено "+procentLoaded.toFixed(1)+"%");

                        if(imgLoaded === lenIMG){
                            progressBarText.text("100.0%");
                            progressBarText.css("width", "100%");
                            callback(param);
                            progressBar.fadeOut('slow');
                        }
                    })
                        .one('error', function() {
                        let src = $(this).attr("src");

                        $(this).attr({
                            "title": "Изображение не найдено:\n"+src,
                            "src": no_image,
                            "error_image": 1
                        }).css({"cursor":"pointer"});
                        $(this).click(function(){window.open(src);});
                    })
                        .attr("src",image.src);

                    if(TimeOutImages !== 0){
                        timer = setTimeout(function(theImg) {
                            return function() {
                                if(debug) console.log(`Таймер истек: ${theImg.src}\n------------------------------`);

                                theImg.onload = theImg.onabort = theImg.onerror = function() {};

                                if (timer) {
                                    clearTimeout(timer);
                                    timer = null;
                                }

                                let src = $(theImg).attr("src");

                                $(theImg).attr({
                                    "title": "Изображение не найдено:\n"+src,
                                    "src": no_image,
                                    "error_image": 1
                                }).css({"cursor":"pointer"}).click(function(){window.open(src);});

                                if(imgLoaded === lenIMG){
                                    progressBarText.text("100.0%");
                                    progressBarText.css("width", "100%");
                                    callback(param);
                                    progressBar.fadeOut('slow');
                                }
                            };
                        }(image), TimeOutImages*1000);
                    }
                });
            }
        } catch(e){
            console.log(e);
        }
    }

    // Правим полученный контент
    function modifyData(param){
        var data = param.data,
            button = param.button,
            elem = param.elem,

            content = $(data).find("#content")[0] || undefined;

        if (!content){
            let nextEl = $(elem).next().next().children(0);

            $(nextEl).html("<div style='text-align: center;font: italic 12pt monospace;color:red;'>Страница пока не доступна!</div>");
            return false;
        }

        content.removeChild(content.children[0]);
        content.removeChild(content.children[0]);
        content.removeChild(content.lastElementChild);
        content.removeChild(content.lastElementChild);

        $(content).find("tr").not(".c_h").hover(function(){$(this).css("background-color","transparent");},function(){$(this).css("background-color","transparent");});

        let tableCount = $(content).find("table tr[class^='c_h']").length;

        // Список файлов измененная загрузка
        let descrN = $(content).find(".header span").attr("onclick").toString().match(/descriptions\/(\d+)\.files/i)[1];
        $(content).find(".header span").removeAttr("onclick");
        $(content).find(".header span").attr("filelist_already_loaded", 0);

        $(content).find(".header span").click(function(){
            if($(this).attr("filelist_already_loaded") == 0){
                $(this).attr("filelist_already_loaded",1);
                $(content).find('#filelist').load('/descriptions/'+descrN+'.files');
            }
            $(content).find('#displayfiles').fadeToggle('slow', 'linear');
        });
        //

        $(content).find("#cem").before('<div class="box_comments"><div  title="Показать комментарии" class="com_Style">Комментарии'+(tableCount>0?' ('+tableCount+')':'')+'</div><div style="display:none;" id="hiden_cc"></div></div>');

        $(content).find(".com_Style").click(function(){$(this).next().fadeToggle( 'slow', 'linear');});

        $(content).find("#hiden_cc").append($(content).find("#cem"));

        let tableCom = $(content).find("table tr[class^='c_h']").parent().parent();

        $(content).find("#hiden_cc").append(tableCom.prev(),tableCom.prev().prev(),tableCom);

        let cloneButton = (button.clone(true)).attr("title","Скрыть раздачу"),

            spoiler = $("<div class='footSpoiler'></div>").html(cloneButton);

        $(content).append(spoiler);

        content.id = "my_content";


        let nextEl = $(elem).next().next().children(0);

        $(nextEl).html(content);

        if(debug) console.log("Предзагрузка включена...",$(".checkbox_Load")[0].checked);

        if($(".checkbox_Load")[0].checked){
            LoadingImages({content:content, button:button, elem:elem, func: ShowIHide});
        } else {
            ShowIHide({button:button, elem:elem});
        }
    }

    function MiniPanel(param){
        let button = param.button,
            elem = param.elem;

        // Add see
        $(".mDiv_title.opens").show();
        let a_elems = $(elem).children()[2].children[4].href.indexOf('magnet') == -1 ? $(elem).children()[2].children[4]: $(elem).children()[2].children[5],
            textPop = a_elems.innerText,//.children(1).children()[5].innerText,

            imgSmall = $(elem).nextAll(".my_tr:eq(0)").find('table#details tr:eq(0) img:not([error_image])').filter(function(i,val){
                if(val.width > 150 && !/banner|kinopoisk|imdb/i.test(this.src)){
                    return this;
                }
            });

        if(imgSmall.length>0){
            let elOut = imgSmall[0];
            for(let i of imgSmall){
                if(i.height > elOut.height) {
                    elOut = i;
                }
            }
            imgSmall = elOut.src;
        } else {
            imgSmall = no_image ;
        }

        if(debug) console.log("Мини изображение: ",imgSmall);

        let imgEl = $('<img>').attr({
            src: imgSmall,
            width: "50px"
        }),

            imgBox = $('<div style="display: table-cell;vertical-align: middle;padding:5px;border-right: 1px dotted white;"></div>').append(imgEl),
            textBox = $('<div style="display: table-cell;vertical-align: middle;font-size: unset;padding:2px;word-break: break-all;"></div>').text(textPop),
            hide = button.clone(true),
            hideE = $._data(hide[0], "events"),
            addonBox = $('<div class="minipanel"></div>').attr('title',hide.attr('title')).each(function () {
                for (var type in hideE){
                    for (var handler in hideE[type]){
                        if(handler === 'delegateCount') continue;
                        $.event.add(this, type, hideE[type][handler], hideE[type].data);
                    }
                }
            }).append(hide.off()),

            elSee = $('<div class="seeEl"></div>').attr('title',textPop).append(imgBox, textBox,addonBox);

        $(imgBox).add(textBox).click(function(){
            let offset = $(elem).offset().top;
            $('html, body').animate({scrollTop:offset}, 500, 'swing');
        });

        $(elem).data(elSee);

        $(".mDiv_inner").append(elSee).animate({scrollTop:$("div.mDiv_inner").offset().top}, 500, 'swing');
    }

    // Функция появления и прочее
    function ShowIHide(param){
        let elem = param.elem,
            button = param.button,
            event_el = param.event_el || null;

        $(elem).nextAll(".my_tr:eq(0)").animate(
            {
                width: [ "toggle", "swing" ],
                height: [ "toggle", "swing" ],
                opacity: "toggle"
            }, 1500, "linear", function(){
                if($(this).css("display") === "none"){
                    button.css("transform", "scaleY(1)").attr("title","Показать раздачу");

                    // Remove see
                    $(".mDiv_inner")[0].removeChild($(elem).data()[0]);
                    if($(".my_tr:visible").length<1){
                        $(".mDiv_title.opens").hide();
                    }

                } else {
                    button.css("transform", "scaleY(-1)").attr("title","Скрыть раздачу");

                    // Mini Panel
                    MiniPanel(param);
                }

                const lenSee = $(".seeEl").length
                if(lenSee>0){
                    $("#hideAll").fadeIn('fast')
                } else {
                    $("#hideAll").fadeOut('fast')
                }

                $(".mDiv_title.opens").text(`Открытые (${lenSee})`);

                // Back offset on page
                //if(event_el !== "minipanel") $('html, body').animate({scrollTop:$(elem).offset().top}, 500, 'swing');
                $('html, body').animate({scrollTop:$(elem).offset().top}, 500, 'swing');
            });
    }

    // Ajax запрос
    function ajaxJQ(param){
        if(debug) console.log("Ajax proceed...");

        let button = param.button,
            link = param.link,
            elem = param.elem;

        return new Promise(function(resolve, reject){
            $.ajax({
                url: link,
                success:  function(data){
                    if(debug) console.log("Ajax запрос завершен!");

                    //let ObjData = {data:data,button:button,elem:elem};
                    //modifyData(ObjData);
                    resolve({data:data,button:button,elem:elem})
                },
                error: function(e)
                {
                    let nextEl = $(elem).next().next().children(0);
                    $(nextEl).css({"text-align":"center","color":"red"}).text(e.statusText.toUpperCase()+": Нет ответа от сервера")
                    ShowIHide({button:button, elem:elem});
                    reject(null)
                }
            });
        })

    }

    function MakeFav(param){
        let elem = param.el || null,
            link = param.link,
            linkText = param.linkText,
            id = param.id,
            Down = param.Down,
            Mdown = param.Mdown,
            date_time = param.date_time,
            category = param.category,
            index = param.index,
            isExists = param.object?.isExists == undefined ? '' : param.object?.isExists?'OK':'NO',

            searchText = searchEditReq(linkText),

            FavElTitleA = $('<a style="color: #005fb4;"></a>').attr({href:hostname+"/torrent/"+id, target:"_blank",title:linkText}).text(linkText),
            FavElTitle = $(`<div ${isExists?'class="activExists '+(isExists=='NO'? 'activExistsRed':'')+'" data-exists="'+isExists+'"':''} style="display: table-cell;vertical-align: middle;padding:5px; width: 80%;position:relative;"></div>`).append(FavElTitleA,'<div class="class_category" style="position: absolute;top: -5px;left: 3px;color: #800047;font-size: 8px;font-weight: bold;background: #ffbbbb;padding: 0 5px;">'+category+'</div>'),
            FavAddBlock = $('<div style="display: table-cell;vertical-align: middle;padding:5px; width: 10%; border-left: 1px dotted orange;">'+
                            '<div class="poleLinks"><a href="'+Down+'" target="_blank" title="Download"><img src="/s/i/d.gif" alt="Download"></a></div>'+
                            '<div class="poleLinks"><a href="'+Mdown+'" target="_blank" title="Magnet Link"><img src="/s/i/m.png" alt="Magnet Link"></a></div>'+
                            '<div class="poleLinks"><a href="'+hostname+"/search/"+encodeURIComponent(searchText)+'" target="_blank" title="Искать: '+linkText+'"><img src="'+searchIcon+'" alt="Искать:'+linkText+'" width="13"></a></div>'+
                            '</div>'),
            FavElBlockX = $('<div title="Удалить!"></div>').text("X").click(function(e){
                let event_el = e.currentTarget,
                    el_block = event_el.parentElement;

                if(debug) console.log($(".mDiv_FavInner .FavBlockEl").index(el_block));
                removeFav({el:el_block, id:id, linkText:linkText, index:$(".mDiv_FavInner .FavBlockEl").index(el_block)});
            }),
            FavBlockEl = $('<div class="FavBlockEl"></div>').append(FavElTitle,FavAddBlock,FavElBlockX);
        FavBlockEl.on('mouseenter mouseleave', function(ev){
            $(this).first().toggleClass("blend_class")
        });

        $(".mDiv_FavInner").append(FavBlockEl);

        if($(".mDiv_FavInner").children().length === 0) {
            $(".mDiv_FavInner").empty();
            $(".mDiv_FavControl").fadeOut('slow');
        } else {
            $(".mDiv_FavControl").fadeIn('slow');
        }

        $(".mDiv_title.fav").text('Избранное '+($(".mDiv_FavInner").children().length == 0 ?'':'('+$(".mDiv_FavInner").children().length+')'));
    }

    async function addFav(param){
        let elem = param.el || null,
            link = param.link,
            linkText = param.linkText,
            Down = param.Down,
            Mdown = param.Mdown,
            date_time = param.date_time,

            id = link,

            category = await getCategoryTorrent(param)

        try{
            // Get id
            id = id.match(/.*torrent\/(\d+)\//i)[1];
            param.id = id;
            if(!id) id = link;

            if(debug) console.log("Ид равен: ", id);

            // Save local storage
            if (!ObjSave.hasOwnProperty('favorites')){
                ObjSave.favorites = [];
            }

            if(!checkPovtor({id:id,linkText:linkText})){
                if(debug) console.log("Нет в базе избранного, сохраняю!");

                fly.call(elem, ".mDiv_FavInner", 3, 3000)

                ObjSave.favorites.push({
                    el: null,
                    link: encodeURI(link),
                    linkText: escape(linkText),
                    id: id,
                    Down: encodeURI(Down),
                    Mdown: encodeURI(Mdown),
                    date_time: date_time,
                    category: category
                });

                saveToStorage();
                //MakeFav(param); -> GM_addValueChangeListener update auto

                showMessage('Избранное',`<p>Успешно добавлен в избранное!</p><p><b>${linkText}<b></p>`)
            }
        } catch (e){
            console.log(e);
        }
    }

    function revomeFavAll(){
        if(confirm(`Вы действительно хотите очистить список избранного?`)){
            if (ObjSave.hasOwnProperty('favorites') && Object.keys(ObjSave.favorites).length){
                ObjSave.favorites = [];
                $(".mDiv_FavInner").empty().text('Пусто...');;
                saveToStorage();
                if(debug) console.log("Все элементы удалены из избранного!");
                $(".mDiv_title.fav").text('Избранное '+($(".mDiv_FavInner").children().length == 0 ?'':'('+$(".mDiv_FavInner").children().length+')'));
                $(".mDiv_FavControl").fadeOut('slow')
            }
        }
    }

    function removeFav(param){
        let el = param.el,
            id = param.id,
            linkText = param.linkText,
            index = param.index;

        if(confirm(`Вы действительно хотите удалить?\n"${linkText}"?`)){
            if (ObjSave.hasOwnProperty('favorites') && index !== "" && index !== null && index !== undefined){
                $(el).animate({"height":"0px","opacity": "0"},'slow', function(){
                    ObjSave.favorites.splice(index, 1);
                    $(this).remove();
                    saveToStorage();
                    if(debug) console.log("Элемент удален из избранного!");
                    $(".mDiv_title.fav").text('Избранное '+($(".mDiv_FavInner").children().length == 0 ?'':'('+$(".mDiv_FavInner").children().length+')'));

                    if(!Object.keys(ObjSave.favorites).length) {
                        $(".mDiv_FavInner").text('Пусто...');
                        $(".mDiv_FavControl").fadeOut('slow')
                    } else {
                        $(".mDiv_FavControl").fadeIn('slow')
                    }
                });
            }
        }
    }

    function checkPovtor(params){
        let povtor = false,
            linkText = params.linkText,
            id = params.id

        if (ObjSave.hasOwnProperty('favorites')){
            if(ObjSave.favorites.length > 0){
                for(var i=0; i<ObjSave.favorites.length;i++){
                    let current = ObjSave.favorites[i]
                    if(current.id === id){
                        if(debug) console.log("Уже есть в базе избранного!");
                        showMessage('Внимание',`<p>Уже есть в базе избранного!</p><p><b>${linkText}<b></p>`)
                        povtor = true;
                    }
                }
            }
        }

        return povtor;
    }

    function updateForm(){
        if (ObjSave.hasOwnProperty('options')){
            let chechVal = null,
                timoutTimeImages = 5;
            if (ObjSave.options.hasOwnProperty('preload')) chechVal = ObjSave.options.preload;

            $("#checkbox_imgages_Load")[0].checked = chechVal;

            timoutTimeImages = (ObjSave.options.hasOwnProperty('TimeOutLoadImages') && typeof(ObjSave.options.TimeOutLoadImages) == "number")?ObjSave.options.TimeOutLoadImages:5;
            $("#timoutTimeImages").val(timoutTimeImages);
        }
    }

    function updateFav(){
        if(!ObjSave.options?.settings_visible?.fav) return

        if (ObjSave.hasOwnProperty('favorites')){
            if(ObjSave.favorites.length > 0){
                $(".mDiv_FavInner").empty();
                for(let pFav = 0; pFav<ObjSave.favorites.length; pFav++){
                    let ObjFavCur = ObjSave.favorites[pFav];

                    MakeFav({
                        el: null,
                        link: decodeURI(ObjFavCur.link),
                        linkText: unescape(ObjFavCur.linkText),
                        Down: decodeURI(ObjFavCur.Down),
                        id: ObjFavCur.id,
                        Mdown: decodeURI(ObjFavCur.Mdown),
                        date_time: ObjFavCur.date_time,
                        category: ObjFavCur.category,
                        index: pFav,
                        object: ObjFavCur
                    });
                }
            }
        }
    }

    function showMessage(title = "Сообщение", message, anim_time_sec = 1000, time_delay_sec = 3000, autohide=true){
        $(".mDiv_Popup_message_box > .mDiv_Popup_message").html(message);
        $(".mDiv_Popup > .mDiv_Popup_title span").text(title);

        $(".mDiv_Popup_smoke").fadeIn(anim_time_sec, function(){
            $(".mDiv_Popup").fadeIn(anim_time_sec,function(){
                if(autohide){
                    let anim = function (){$(this).fadeOut(anim_time_sec, function(){$(".mDiv_Popup_smoke").fadeOut(anim_time_sec);});}.bind(this);
                    setTimeout(anim, time_delay_sec)
                }
            });
        });
    }

    function searchinHost(search){
        return location.href.includes(search);
    }

    function makePanel(){
        if(!document.getElementById("sidebar")) return;

        if (!ObjSave.options.hasOwnProperty('settings_visible')){
            ObjSave.options.settings_visible = {
                sett:true,
                fav:true,
                opens:true,
                stream:true
            }
        } else if(typeof ObjSave.options.settings_visible == 'boolean'){
            ObjSave.options.settings_visible = {
                sett:true,
                fav:true,
                opens:true,
                stream:true
            }
        }
        if(debug)console.log('Menu show-hide: ',ObjSave.options.settings_visible)

        let hostisT = searchinHost("/torrent/"),
            settings_visible = ObjSave.options.settings_visible,
            div = $('<div class="mDiv">'+
                    (!hostisT?
                     '<div class="mDiv_title'+(settings_visible.sett?'':' no_vis')+' sett">Настройки</div>'+
                     '<div class="mDiv_settings_body mDiv_plugins" style="'+(settings_visible.sett?'display: block':'display: none')+'">'+
                     '<div id="preLoadImages" class="imgages_Load">'+
                     '<div class="preLoadImagesRow">'+
                     '<div class="preLoadImagesCell">Предзагрузка: </div>'+
                     '<div class="preLoadImagesCell" style="position:relative;"><input type="checkbox" class="checkbox_Load" id="checkbox_imgages_Load"><label for="checkbox_imgages_Load"></label></div>'+
                     '</div>'+
                     '<div class="preLoadImagesRow">'+
                     '<div class="preLoadImagesCell">Тайм-аут загр.</div>'+
                     '<div class="preLoadImagesCell"><input type="number" id="timoutTimeImages" title="Тайм-аут загрузки изображений.\nЕсли 0, то тайм-аут устанавл. настройкой браузера!" min="0" step="0.1"> сек.</div>'+
                     '</div>'+
                     '</div>'+
                     '<div class="mDiv_title'+(settings_visible.stream?'':' no_vis')+' stream">Torrent Stream</div>'+
                     '<div class="mDiv_settings_body imgages_Load" style="'+(settings_visible.stream?'display: block':'display: none')+'">'+
                     '<div class="preLoadImagesRow">'+
                     '<div class="preLoadImagesCell">TorrServer Ip:Port</div>'+
                     '<div class="preLoadImagesCell"><input style="width: 150px;text-align:center;transform: scale(0.9);" id="torr_server_address" data-service="TorrServer" title="TorrServer адресс и порт" value="localhost:8090"></div>'+
                     '</div>'+
                     '<div class="preLoadImagesRow">'+
                     '<div class="preLoadImagesCell">AceStream Ip:Port</div>'+
                     '<div class="preLoadImagesCell"><input style="width: 150px;text-align:center;transform: scale(0.9);" id="acestream_server_address" data-service="AceStream" title="AceStream адресс и порт" value="localhost:6878"></div>'+
                     '</div>'+
                     '<div style="display:block;padding:2px;color:darkslateblue;font-size: 0.8rem;">Альфа версия: Нужен запущенный TorrServer или AceStream(лучше TorrServer😀). <span style="display:none;">и запущенный <a href="https://github.com/AlekPet/Rutor-Preview-Ajax/tree/master/servers/nodejs">сервер</a></span></div>'+
                     '</div>'+
                     '<div class="mDiv_title'+(settings_visible.opens?'':' no_vis')+' opens">Открытые</div>'+
                     '<div class="mDiv_settings_body" style="'+(settings_visible.opens?'display: block':'display: none')+'">'+
                     '<div id="hideAll" class="buttonsStyle">Свернуть все</div>'+
                     '<div class="mDiv_inner"></div>'+
                     '</div>'+
                     '<div class="mDiv_title'+(settings_visible.fav?'':' no_vis')+' fav">Избранное</div>'+
                     '<div class="mDiv_settings_body" style="'+(settings_visible.fav?'display: block':'display: none')+'">'+
                     '<div class="mDivFavControl_box">'+
                     '<div class="mDiv_FavControl buttonsStyle" title="Очистить список избранного!">Очистить избранное</div>'+
                     '<div class="mDiv_FavControlCheck buttonsStyle" title="Проверить торренты">Проверить торренты</div>'+
                     '</div>'+
                     '<div class="mDiv_FavInner"></div>'+
                     '</div>'+
                     '</div>': /* One torrent */
                     '<div class="mDiv_title'+(settings_visible.sett?'':' no_vis')+' sett">Настройки</div>'+
                     '<div class="mDiv_settings_body mDiv_plugins" style="'+(settings_visible.sett?'display: block':'display: none')+'">'+
                     '<div id="preLoadImages" class="imgages_Load">'+
                     '</div>'+
                     '<div class="mDiv_title'+(settings_visible.stream?'':' no_vis')+' stream">Torrent Stream</div>'+
                     '<div class="mDiv_settings_body imgages_Load" style="'+(settings_visible.stream?'display: block':'display: none')+'">'+
                     '<div class="preLoadImagesRow" style="color:#b40000;">'+
                     '<div class="preLoadImagesCell">TorrServer Ip:Port</div>'+
                     '<div class="preLoadImagesCell"><input style="width: 150px;text-align:center;transform: scale(0.9);" id="torr_server_address" data-service="TorrServer" title="TorrServer адресс и порт" value="localhost:8090"></div>'+
                     '</div>'+
                     '<div class="preLoadImagesRow">'+
                     '<div class="preLoadImagesCell">AceStream Ip:Port</div>'+
                     '<div class="preLoadImagesCell"><input style="width: 150px;text-align:center;transform: scale(0.9);" id="acestream_server_address" data-service="AceStream" title="AceStream адресс и порт" value="localhost:6878"></div>'+
                     '</div>'+
                     '<div style="display:block;padding:2px;color:darkslateblue;font-size: 0.8rem;">Альфа версия: Нужен запущенный TorrServer или AceStream(лучше TorrServer😀). <span style="display:none;">и запущенный <a href="https://github.com/AlekPet/Rutor-Preview-Ajax/tree/master/servers/nodejs">сервер</a></span></div>'+

                     '</div>'+
                     '<div class="mDiv_title'+(settings_visible.opens?'':' no_vis')+' opens">Открытые</div>'+
                     '<div class="mDiv_settings_body" style="'+(settings_visible.opens?'display: block':'display: none')+'">'+
                     '<div id="hideAll" class="buttonsStyle">Свернуть все</div>'+
                     '<div class="mDiv_inner"></div>'+
                     '</div>'+
                     '<div class="mDiv_title'+(settings_visible.fav?'':' no_vis')+' fav">Избранное</div>'+
                     '<div class="mDiv_settings_body" style="'+(settings_visible.fav?'display: block':'display: none')+'">'+
                     '<div class="mDiv_FavControl buttonsStyle" title="Очистить список избранного!">Очистить избранное</div>'+
                     '<div class="mDivFavControl_box">'+
                     '<div class="mDiv_FavControl buttonsStyle" title="Очистить список избранного!">Очистить избранное</div>'+
                     '<div class="mDiv_FavControlCheck buttonsStyle" title="Проверить торренты">Проверить торренты</div>'+
                     '</div>'+
                     '<div class="mDiv_FavInner"></div>'+
                     '</div>'+
                     '</div>'+
                     '</div>'+
                     '</div>')+
                    '</div>'),

            chechVal = "";
        if (ObjSave.hasOwnProperty('options') && ObjSave.options.hasOwnProperty('preload')){
            chechVal = ObjSave.options.preload;
        }

        $(div).find("#checkbox_imgages_Load").change(function(){
            if(debug) console.log("Предзагрузка: ",$(this)[0].checked);

            if (ObjSave.hasOwnProperty('options')){
                if (!ObjSave.options.hasOwnProperty('preload')) ObjSave.options.preload = "";
                ObjSave.options.preload = $(this)[0].checked;
                saveToStorage();
            }
        }).attr("checked",chechVal);

        $(div).find("#timoutTimeImages").change(function(){
            let valueTO = $(this).val();

            if(debug) console.log("Тайм-аут установлен в: ", valueTO+" сек.");

            if(valueTO === "" || /^\s?$/.test(valueTO)) $(this).val(5);

            if (ObjSave.hasOwnProperty('options')){
                if (!ObjSave.options.hasOwnProperty('TimeOutLoadImages')) ObjSave.options.TimeOutLoadImages = 5;
                TimeOutImages = ObjSave.options.TimeOutLoadImages = parseFloat($(this).val());
                saveToStorage();
            }
        }).val((ObjSave.options.TimeOutLoadImages)?ObjSave.options.TimeOutLoadImages:5);

        // TorrServ & AceStream

        $(div).find("#torr_server_address, #acestream_server_address").on('change',function(){
            let valueInput = $(this).val(),
                service = this.dataset.service,
                options_service_name = service === 'TorrServer' ? ['torr_server_address', torr_serv_port] : ['acestream_server_address', acestream_port],
                checkAddr = valueInput.match(/(localhost|\b\d{1,3}\b\.\b\d{1,3}\b\.\b\d{1,3}\b\.\b\d{1,3}\b)\:\b(\d+)\b/g),
                prevVal = $(this).data('preVal')

            if(!checkAddr) {
                alert(`Адресс ${service}\'а указан неверно!`)
                $(this).val(prevVal ? prevVal : 'localhost:'+options_service_name[1])
                return;
            }

            $(this).data('preVal', valueInput)

            if (ObjSave.hasOwnProperty('options')){
                ObjSave.options[options_service_name[0]] = checkAddr && checkAddr.length==1 ? checkAddr[0] : 'localhost:'+options_service_name[1];
            }
            saveToStorage();

        }).val(function(index, value){
            const options_service_name = this.dataset.service === 'TorrServer' ? ['torr_server_address', torr_serv_port] : ['acestream_server_address', acestream_port]
            return ObjSave.options[options_service_name[0]] ? ObjSave.options[options_service_name[0]] : 'localhost:'+options_service_name[1]
        })

        $("#sidebar").append(div);

        $("#sidebar .mDiv").click(function(event){
            const target = event.target
            if(target.classList.contains('mDiv_title') /*&& !target.classList.contains('sett')*/){
                const nameSp = target.classList[target.classList.length-1],
                      settings_body = $(target.nextElementSibling),
                      $traget = $(target)

                if (settings_body.css('display') == 'none'){
                    if(nameSp === 'fav' && $('.mDiv_FavInner').children().length === 0) updateFav()
                    settings_body.slideDown('slow')
                    ObjSave.options.settings_visible[nameSp] = true
                    $traget.removeClass('no_vis')

                } else {
                    settings_body.slideUp('slow')
                    ObjSave.options.settings_visible[nameSp] = false
                    $traget.removeClass(nameSp)
                    $traget.addClass('no_vis')
                    $traget.addClass(nameSp)
                }
                saveToStorage();
            }

        })

        if(ObjSave.hasOwnProperty('favorites') && Object.keys(ObjSave.favorites).length > 0) {
            $(".mDiv_FavInner").fadeIn('slow');
            $(".mDiv_FavControl").fadeIn('slow');
        } else{
            $(".mDiv_FavInner").text('Пусто...').fadeIn('slow');
            $(".mDiv_FavControl").fadeOut('slow');
        }

        let maxTop = $(".sideblock:nth-child(1)").offset().top+parseFloat($(".sideblock:nth-child(1)").css("height"))+parseFloat($(".sideblock:nth-child(2)").css("height"));
        $(window).scroll(function() {
            if($(window).scrollTop() >= maxTop){
                $(".sideblock:eq(1)").css({"position":"fixed", "top":"0px","width":"250px"});
                $(".mDiv").css({"position":"fixed", "top":"70px"});
            } else {
                $(".mDiv").add($(".sideblock:eq(1)")).removeAttr("style");
            }
        });

        $("#hideAll").click(function(){
            if($(".my_tr:visible").length){
                $(".my_tr").fadeOut("slow", function(){
                    $("img.butSpoiler").css("transform", "scaleY(1)").attr("title","Показать раздачу");

                    // Remove see
                    $("#hideAll").fadeOut("fast", function(){
                        $(".mDiv_title.opens").hide();
                        $(".mDiv_inner").empty();
                    });

                });
            }
        }).hide();

        $(".mDiv_FavControl").click(revomeFavAll);
        $(".mDiv_FavControlCheck").click(torrentsFavoritesExists);

        appendSmokeAndPopUp()
    }

    function appendSmokeAndPopUp(){
        $("body").append($('<div class="mDiv_Popup_smoke">'+
                           '<div class="mDiv_Popup">'+
                           '<div class="mDiv_Popup_title"><span></span><div class="mDiv_Popup_title_x"></div></div>'+
                           '<div class="mDiv_Popup_message_box">'+
                           '<div class="mDiv_Popup_message"></div>'+
                           '</div>'+
                           '</div>'));
        $('.mDiv_Popup_title_x').click(function(){
            $(".mDiv_Popup").fadeOut(1000, function(){$(".mDiv_Popup_smoke").fadeOut(1000);});
        });
    }

    function searchEditReq(title){
        let seatchText = title.match(/(.*)(?:\(|\[)/i)[1];

        if(seatchText === null || seatchText === undefined || !seatchText.length) seatchText = title;

        if(seatchText.indexOf("/") !=-1 || seatchText.indexOf("\\")!=-1){
            seatchText = seatchText.replace(/\s?\/\s?|\s?\\\s?/g," ")
        }
        return seatchText;
    }

    function fly(target, size, duration){
        target = $(target)

        if($('.mDiv_settings_body').css('display') == 'none') target = $('.mDiv_title')

        let posLeft = target.offset().left-$(this).offset().left,
            posTop = target.offset().top-($(this).offset().top+target.height()/2)

        $(this).
        clone()
            .css({
            "position":"absolute",
            "z-index":"9999999999",
            "filter": "hue-rotate(270deg)",
            "text-indent": "0px"
        })
            .appendTo(this)
            .animate(
            {
                left:"+="+posLeft,
                top:"+="+posTop,
                textIndent: size
            },
            {
                step: function( now, fx ) {
                    $(this).css("transform","scale("+now+")")
                },
                duration: duration,
                complete: function(){
                    $(this).remove()
                }
            }
        )
    }

    function convertSizes(bytes, poslezap = 2){
        if (bytes === 0) return '0 Bytes';

        const k = 1024,
              dm = poslezap < 0 ? 0 : poslezap,
              sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
              i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(poslezap)) + ' ' + sizes[i];
    }

    // -- TorrServer
    function checkRunningService(params){}

    function requestTorrentService(params){

        const method = params.method ? params.method : 'GET',
              data = method == 'POST' && params.data ? params.data : ''

        return new Promise((resolve, reject)=>{

            GM.xmlHttpRequest({
                method: method,
                url: params.url,
                data: data,
                responseType: 'json',
                headers : { 'Content-type' : 'application/json' },
                onload: function(res) {
                    if(res.status == 200 && res.statusText == 'OK'){
                        resolve({status:'OK', data: res.response})
                    } else if(res.status == 403) {
                        resolve({status: 'error_403'})
                    } else {
                        reject(`[Status ${res.status}] Запрос вернул ошибку...`)
                    }
                },
                onerror: function(e){
                    reject('[Request] Запрос вернул ошибку...')
                }
            })
        })
    }

    async function torrServAction(down, torr_server_address, save=true){
        try{
            const issave = save ? '&save' : '',
                  {status, data} = await requestTorrentService({url: `http://${torr_server_address}/stream/fname?link=${down}${issave}&stat`})

            if(status == 'OK'){
                return data
            } else if(status == 'error_403') {
                showMessage('ОШИБКА',`<p style='color:red; font-weight: bold;'>Запрошенный URL не может быть получен, проверьте работает ли TorServer!</p>`)
                return null
            }
        }
        catch(ev) {
            showMessage('ОШИБКА',`<p style='color:red; font-weight: bold;'>TorrServ не работает (адрес <span style='color: blue;'>${torr_server_address}</span>) или ошибка в коде!</p><p>Текст ошибки: '${ev}'</p>`)
        }
    }

    function returnIframe(v,addr,v_name,vhash,vindex=1,){
        v.empty()
        //const isvideo = /\.(?:mp4|mkv|avi|m3u8)$/g.test(v_name) ? {style: 'position: absolute; width: 100%;height: 100%;top: 0;left: 0;border:none;'} : {style: 'width:100%;border:none;overflow:hidden;'},
        const addr_path = encodeURIComponent(`http://${addr}/stream/fname?link=${vhash}`),
              serverHTTP = 'http://localhost:8000/frame' // 'http://alekpet.pythonanywhere.com/getvideo' // http://localhost:8000/frame
        return `<iframe src="${serverHTTP}?path_vid=${addr_path}&name_vid=${encodeURIComponent(v_name)}&index_vid=${vindex}" frameborder="0" scrolling="no"  />` //style="${isvideo.style}"
    }


    async function torrServer(params){

        const {down, magn, linkText, action='add'} = params,
              torr_server_address = $("#torr_server_address").val()

        if(!torr_server_address){
            alert(`Адрес TorrServer\'а '${torr_server_address}' указан неверно!`)
            return
        }

        try{
            if(action == 'add'){
                if(confirm(`Добавить "${linkText}" для проигрывания в torrServ?`)){
                    const data = await torrServAction(magn, torr_server_address)
                    if(data){
                        showMessage('УСПЕШНО',`<p style='color:green;'><b>Торрент был сохранен в TorServer!</b></p>
                                        <p><b>Название:</b> ${data.title || data.name}</p>
                                        <p><b>Размер:</b> ${convertSizes(data.torrent_size)}</p>`)
                    }
                }
            } else if(action == 'play'){
                const data = await torrServAction(magn, torr_server_address, false)
                if(data){
                    if(confirm('Запустить проигрыватель?')){

                        let videos = data.file_stats.filter((elem, idx)=> /.(avi|mp4|mkv|mp3|ogg|wav)$/g.test(elem.path)),
                            //audios = data.file_stats.filter((elem, idx)=> /.(mp3|ogg|wav)$/g.test(elem.path)),
                            boxPlayer = $('#torrentPlayer'),
                            close_vid,inner_vid,inner_list,vid_info,vid_title = null

                        const videoPlayer = $("<video>").attr({autoplay: true, preload: true, src:"", muted:true, controls: ""}).css({width: "100%"})
                        const videoPlayerEl = videoPlayer.get(0)

                        if(boxPlayer.length) boxPlayer.remove()

                        boxPlayer = $("<div></div>").attr('id','torrentPlayer')

                        close_vid = $("<div class='torrentPlayer_close'>").attr('title','Закрыть').text('X').click(function(){
                            boxPlayer.hide(()=>{
                                videoPlayerEl && videoPlayerEl.pause()
                                boxPlayer.remove()
                            })
                        })
                        vid_title = $("<div class='torrentPlayer_title'>")
                        vid_info = $("<div class='torrentPlayer_info'>").text('Загрузка...')
                        inner_vid = $("<div class='torrentPlayer_video'>")
                        inner_list = $("<div class='torrentPlayer_list'>")

                        vid_title.append(vid_info,close_vid)

                        boxPlayer.append(vid_title,inner_vid,inner_list)
                        $('body').append(boxPlayer)

                        if(videos.length){
                            let currentItem = 0
                            videoPlayerEl.src = `http://${torr_server_address}/stream/fname?link=${data.hash}&index=${videos[currentItem].id}&play`;

                            //let frame = returnIframe(inner_vid, torr_server_address, videos[0].path, data.hash)
                            //inner_vid.append(frame)

                            inner_vid.append(videoPlayer)

                            let ulpl = $("<ul class='torrentPlayer_playlist'></ul>")
                            vid_info.text(videos[currentItem].path)


                            let currentPlayingProgress = null
                            videoPlayerEl.addEventListener("canplaythrough", (event) => {
                                videoPlayerEl.play();
                                ulpl.find("li.playing .playlist_item_progress").css("width", "0%")
                                ulpl.find("li.playing").removeClass("playing")
                                ulpl.find("li")[currentItem].classList.add("playing")
                                currentPlayingProgress = ulpl.find("li.playing .playlist_item_progress")
                            });

                            videoPlayerEl.addEventListener("timeupdate", (event) => {
                             const target = event.target;
                                if(target.tagName === "VIDEO" && currentPlayingProgress){
                                    const step = target.duration / 100;
                                    const currentTimeProc = target.currentTime / step + "%";
                                    currentPlayingProgress.css("width", currentTimeProc)
                                }
                            });

                            videoPlayerEl.addEventListener("ended", (event) => {
                                currentItem+=1;

                                if(currentItem > videos.length-1){
                                    currentItem = 0;
                                }

                                videoPlayerEl.src = `http://${torr_server_address}/stream/fname?link=${data.hash}&index=${videos[currentItem].id}&play`
                                vid_info.text(videos[currentItem].path)
                                videoPlayerEl.play()
                            });

                            for(let [k,v] of videos.entries()){
                                let li = $("<li></li>").click(function(ev){
                                    //let frame = returnIframe(inner_vid, torr_server_address, v.path, data.hash, v.id)
                                    //inner_vid.html(frame)
                                    currentItem=v.id - 1;
                                    videoPlayerEl.src = `http://${torr_server_address}/stream/fname?link=${data.hash}&index=${v.id}&play`
                                    videoPlayerEl.play()
                                    vid_info.text(v.path)

                                }),
                                    title_item_list = `${k+1}. ${v.path}`,
                                    name_vid = $("<span class='torrentPlayer_playlist_item_title'>")
                                .text(title_item_list)
                                .append($("<span class='playlist_item_progress'>")
                                .css({width: "0%"})),

                                    size_vid = $("<span class='torrentPlayer_playlist_item_size'>").text(convertSizes(v.length))

                                if(k === 0){
                                    li.addClass("playing")
                                    currentPlayingProgress = li.find(".playlist_item_progress")
                                }
                                li.append(name_vid,size_vid)
                                ulpl.append(li)
                            }

                            inner_list.append(ulpl)
                        }
                    }
                }
            }
        } catch(ev) {
            showMessage('ОШИБКА',`<p style='color:red; font-weight: bold;'>Текст ошибки: '${ev}'</p>`)
        }
    }
    // -- TorrServer

    // -- AceStream
    async function AceStreamAction(down, acestream_server_address, save=true){
        try{
            const issave = save ? '&save' : '',
                  {status, data} = await requestTorrentService({url: `http://${acestream_server_address}/server/api?method=get_api_access_token`})

            if(status == 'OK'){
                return data.result
            } else if(status == 'error_403') {
                showMessage('ОШИБКА',`<p style='color:red; font-weight: bold;'>Запрошенный URL не может быть получен, проверьте работает ли AceStream!</p>`)
                return null
            }
        }
        catch(ev) {
            showMessage('ОШИБКА',`<p style='color:red; font-weight: bold;'>AceStream не работает (адрес <span style='color: blue;'>${acestream_server_address}</span>) или ошибка в коде!</p><p>Текст ошибки: '${ev}'</p>`)
        }
    }

    async function aceStreamServer(params){
        const {down, magn, linkText, action='play'} = params,
              acestream_server_address = $("#acestream_server_address").val()

        if(!acestream_server_address){
            alert(`Адрес AceStream\'а '${acestream_server_address}' указан неверно!`)
            return
        }

        // http://127.0.0.1:6878/ace/getstream?url=http://d.rutor.info/download/894977
        // http://127.0.0.1:6878/ace/manifest.m3u8?url=http://d.rutor.info/download/894977&format=json
        // http://localhost:6878/server/api?method=get_api_access_token
        const {token} = await AceStreamAction(magn, acestream_server_address, false)

        if(token){
            if(confirm('Запустить проигрыватель?')){

                let videos = encodeURIComponent(`http://${acestream_server_address}/ace/getstream?url=${down}`),
                    boxPlayer = $('#torrentPlayer'),
                    close_vid,inner_vid,inner_list,vid_info,vid_title = null

                if(boxPlayer.length) boxPlayer.remove()

                boxPlayer = $("<div></div>").attr('id','torrentPlayer')

                close_vid = $("<div class='torrentPlayer_close'>").text('X').click(function(){
                    boxPlayer.hide(()=>{
                        boxPlayer.remove()
                    })
                })
                vid_title = $("<div class='torrentPlayer_title'>")
                vid_info = $("<div class='torrentPlayer_info'>").text('Загрузка...')
                inner_vid = $("<div class='torrentPlayer_video'>")
                inner_list = $("<div class='torrentPlayer_list'>")

                vid_title.append(vid_info,close_vid)

                boxPlayer.append(vid_title,inner_vid,inner_list)
                $('body').append(boxPlayer)

                if(videos.length){
                    inner_vid.empty()
                    let frame = `<iframe src="http://localhost:8000/frame?path_vid=${videos}&name_vid=${encodeURIComponent(linkText)}&index_vid=${1}" frameborder="0" scrolling="no" style="width: 100%;height: 100%;" />`
                    inner_vid.append(frame)

                    let ulpl = $("<ul class='torrentPlayer_playlist'></ul>")
                    vid_info.text(linkText)

                    /*for(let v of videos){
                        let li = $("<li></li>").click(function(){
                            inner_vid.empty()
                            let frame = `<iframe src="http://localhost:8000/frame?path_vid=${v}&name_vid=${encodeURIComponent(v)}&index_vid=${v}" frameborder="0" scrolling="no"/>`
                            inner_vid.html(frame)
                            vid_info.text(v)
                        }),
                            name_vid = $("<span class='torrentPlayer_playlist_item_title'>").text(v),
                            size_vid = $("<span class='torrentPlayer_playlist_item_size'>").text(convertSizes(v.length))

                        li.append(name_vid,size_vid)
                        ulpl.append(li)
                    }

                    inner_list.append(ulpl)*/
                }
            }
        }

    }
    // -- AceStream

    function addPoleInfo(){
        if(!searchinHost("/torrent/")){

            // Ищим классы для получения данных
            $(".backgr, .gai, .tum").each(function(i, val){
                // Если класс заголовка добавляем свой заголовок для кнопки
                if(this.className == "backgr") {
                    $('<td width="1px"></td>').prependTo(this);
                } else {
                    // Если нет получаем информацию
                    let elem = this,
                        m_elem = elem.children[1],
                        link, linkText, magn, down, count_magnet = 1,

                        img = $('<img/>').attr({title:"Показать раздачу",class:"butSpoiler", src:image_arrow, alt:""}),
                        newI = $('<td/>').css("text-align","center").append(img);

                    if(m_elem.children[count_magnet] && m_elem.children[count_magnet].href.indexOf('magnet') == -1){
                        down = m_elem.children[1].href
                        link = m_elem.children[count_magnet] ? m_elem.children[count_magnet].href : null
                        linkText = m_elem.children[count_magnet] ? m_elem.children[count_magnet].textContent : null
                    } else {
                        down = m_elem.children[count_magnet-1].href
                        magn = m_elem.children[count_magnet] ? m_elem.children[count_magnet].href : null
                        link = m_elem.children[count_magnet+1] ? m_elem.children[count_magnet+1].href : null
                        linkText = m_elem.children[count_magnet+1] ? m_elem.children[count_magnet+1].textContent : null
                    }

                    let favorite = $("<a/>")
                    .attr({href:'javascript:void(0);', title:`Добавить в избранное:\nИмя: ${linkText}\nСсылка торрента: ${link}\nDownload: ${down}\nMagnet: ${(magn ? magn : 'Нет')}`, class:'downgif'})
                    .append($("<img/>").attr({src:favIcon, width:'13',alt:''}))
                    .click(function(ev){
                        ev.stopPropagation()
                        addFav({
                            el:this,
                            link:link,
                            linkText:linkText,
                            Down:down,
                            Mdown:magn,
                            date_time: new Date().getTime()
                        });
                    }),
                        search = $("<a/>")
                    .attr({href:'javascript:void(0);', title:`Искать: ${linkText}`, class:'downgif'})
                    .append($("<img/>").attr({src: searchIcon, width:'13', alt:''}))
                    .click(function(ev){
                        ev.stopPropagation()
                        let searchText = searchEditReq(linkText);
                        window.location.href = hostname+"/search/"+encodeURIComponent(searchText);
                    }),

                        AceStreamServPlay = $("<a/>")
                    .attr({href:'javascript:void(0);', title:`Проиграть в AceStream: ${linkText}`, class:'downgif service_splitter', 'data-servname':'AceStream'})
                    .append($('<span/>').text('AceStream'))
                    .append($("<img/>").attr({src: aceStreamIcon, width:'13', alt:''}))
                    .click(function(ev){
                        ev.stopPropagation()
                        aceStreamServer({down, linkText, magn, action: 'play'})
                    }) ,

                        torrServPlay = $("<a/>")
                    .attr({href:'javascript:void(0);', title:`Проиграть в torrserv: ${linkText}`, class:'downgif','data-servname':'TorrServ Play'})
                    .append($('<span>').text('TorrServ Play'))
                    .append($("<img/>").attr({src: torrServIcon, width:'13', alt:''}))
                    .click(function(ev){
                        ev.stopPropagation()
                        torrServer({down, linkText, magn, action: 'play'})
                    }),

                        torrServ = $("<a/>")
                    .attr({href:'javascript:void(0);', title:`Добавить в torrserv: ${linkText}`, class:'downgif','data-servname':'TorrServ Add'})
                    .append($('<span/>').text('TorrServ Add'))
                    .append($("<img/>").attr({src: torrServToAdd, width:'13', alt:''}))
                    .click(function(ev){
                        ev.stopPropagation()
                        torrServer({down, magn, linkText})
                    }),

                        pop_items = $("<div class='pop_elements'></div>"),
                        bufDiv = $("<a class='pop_panel'  onclick='event.stopPropagation();'><img src='https://www.pvsm.ru/images/2019/10/14/v-zakladki-PDF-i-ePUB-versiya-rukovodstva-po-React-3.png' width='15' alt=''/></a>").append(pop_items)
                    pop_items.append(AceStreamServPlay,torrServPlay,torrServ)


                    // Image event
                    $(img).add(elem).click(async function(e) {
                        e.stopPropagation()

                        //if(e.target.tagName == 'A') return true

                        if(!$(elem).next().is(".tr_loading")){
                            $(elem).after('<tr class="tr_loading" style="text-align:center; display:none;"><td colspan="6">'+
                                          '<div class="loading_tor_box">'+
                                          '<div class="loading_tor"><div class="loading_tor_text"></div></div>'+
                                          '</div>'+
                                          '</td></tr>');
                            $(elem).next('.tr_loading').after('<tr class="my_tr"><td colspan="6"></td></tr>');

                            ajaxJQ({button : img , link: link, elem : elem}).then((data)=> modifyData(data));
                        } else {
                            ShowIHide({elem:elem, button: img, event_el: e.currentTarget.className});
                        }
                    });


                    $(m_elem).on('click contextmenu',function(ev){
                        const cur_ = ev.target
                        if(cur_ && /download|magnet|torrent/.test(cur_.parentElement.href) || cur_.tagName == 'A'){
                            ev.stopPropagation()
                        }
                    });

                    favorite.insertBefore(m_elem.children[0])
                    search.insertBefore(m_elem.children[0])
                    bufDiv.insertBefore(m_elem.children[0])
                    newI.prependTo(this);
                }
            });
        } else {
            const poleDown = $("#download a"),
                  link = location.href,
                  linkText = $("#all > h1").text(),
                  down = poleDown.eq(1).attr('href'),
                  magn = poleDown.eq(0).attr('href'),

                  box_buttons = $("<div class='box_buttons_inner'></div>").insertAfter(poleDown.eq(1)),

                  favorite = $("<a href='javascript:void(0);' title='Добавить в избранное'><img src='"+favIcon+"' width='15'></a>").click(function(){
                      addFav({
                          el:this,
                          link:link,
                          linkText:linkText,
                          Down:down,
                          Mdown:magn,
                          date_time: new Date().getTime()
                      });
                  }),
                  search = $("<a href='javascript:void(0);' style='margin-left:10px;' title='Искать: "+linkText+"'><img src='"+searchIcon+"' width='15'></a>").click(function(){
                      let searchText = searchEditReq(linkText);
                      window.location.href = hostname + "/search/"+encodeURIComponent(searchText);
                  }),

                  AceStreamServPlay = $("<a/>")
            .css('margin-left','10px')
            .attr({href:'javascript:void(0);', title:`Проиграть в AceStream: ${linkText}`})
            .append($("<img/>").attr({src: aceStreamIcon, width:'15', alt:''}))
            .click(function(ev){
                ev.stopPropagation()
                aceStreamServer({down, linkText, magn, action: 'play'})
            }) ,
                  torrServPlay = $("<a/>")
            .css('margin-left','10px')
            .attr({href:'javascript:void(0);', title:`Проиграть в torrserv: ${linkText}`})
            .append($("<img/>").attr({src: torrServIcon, width:'15', alt:''}))
            .click(function(ev){
                ev.stopPropagation()
                torrServer({down, linkText, magn, action: 'play'})
            }),

                  torrServ = $("<a/>")
            .css('margin-left','10px')
            .attr({href:'javascript:void(0);', title:`Добавить в torrserv: ${linkText}`})
            .append($("<img/>").attr({src: torrServToAdd, width:'15', alt:''}))
            .click(function(ev){
                ev.stopPropagation()
                torrServer({down, magn, linkText})
            })

            favorite.appendTo(box_buttons)
            search.appendTo(box_buttons)
            torrServPlay.appendTo(box_buttons)
            torrServ.appendTo(box_buttons)
            AceStreamServPlay.appendTo(box_buttons)
        }
    }

    async function getCategoryTorrent(currentObj){
        let category_ ="Нет категории"
        await new Promise(function(res,rej){
            $.ajax({
                url: currentObj.link,
                success:  function(data){
                    try{
                        category_ = data.match(/Категория.*\>(.*)\<\/a/i)[1]
                    }
                    catch(e){
                        if(debug)console.warn(`Категория не найдена у: ${unescape(currentObj.linkText)}... (Раздача не существует)`)
                    }
                    res(category_)
                },
                error: function(e){
                    rej("Нет категории")
                }

            }).then(function(res){

            })
        })
        if(debug) console.log(`Категория у '${unescape(currentObj.linkText)}' следующая '${category_!="Нет категории"?category_:'%cНет категории'}'`, "color:red")
        return category_
    }

    function torrentsFavoritesExists(){
        if(!confirm('Проверить торренты в избранном?')) return
        // Check torrent exists?
        let promises = []
        for(let obj in ObjSave.favorites){
            let currentObj = ObjSave.favorites[obj],

                p = new Promise((res,rej)=>{
                    let v = currentObj.link.split('/')
                    $.ajax({
                        url: `/torrent/${v[v.length-1]}`,
                        success:  (data) => {
                            let result = data.includes('Раздача не существует!')?false:true
                            return res({result, v:unescape(currentObj.linkText).trim()})
                        },
                        error: (e) => res({result: false, v})
                    })
                }).then((result_)=>{
                    let {result, v} = result_
                    currentObj.isExists = (typeof result === 'string' ? JSON.parse(result): result)
                    return !result ? `Ссылка на торрент больше не существует: ${v}`: null
                })
            promises.push(p)
        }

        Promise.all(promises).then(values => {
            let filter_vals = values.filter(v => v)
            if(filter_vals.length){
                alert(filter_vals.join('\n'))
                console.log(`%c${filter_vals.join('\n')}`, 'color: orange;background:darkred;');
                updateFav()
            }
        });

    }

    async function remakeFav(){
        if (ObjSave.hasOwnProperty('favorites')){
            // Favorites object
            let isEdit = !1;

            if(Object.prototype.toString.call(ObjSave.favorites) == "[object Object]"){
                if(Object.keys(ObjSave.favorites).length > 0){
                    for(let pFav in ObjSave.favorites){
                        // no date
                        if(!ObjSave.favorites[pFav].hasOwnProperty("date_time")){
                            ObjSave.favorites[pFav].date_time = new Date().getTime()
                            if(debug) console.log("Нет Даты!: ", ObjSave.favorites[pFav])
                        }

                        // http
                        if(pFav.includes("http://")){
                            if(debug) console.log("Ид содержит http!: ", ObjSave.favorites[pFav])

                            let pFavencodeURI = encodeURI(pFav),
                                newId = unescape(pFav).match(/.*torrent\/(\d+)\//i)[1];

                            ObjSave.favorites[newId] = ObjSave.favorites[pFavencodeURI];
                            ObjSave.favorites[newId].id = newId;
                            delete ObjSave.favorites[pFavencodeURI]
                        }

                    }

                }
                // Favorites convert to array
                ObjSave.favorites = Object.keys(ObjSave.favorites).map((k,i) => ({...ObjSave.favorites[k]}))
                isEdit = !0;

                if(debug) console.log("Исправленме Ид и добавление Даты: ",ObjSave,"Были ли правки:",isEdit)
                saveToStorage();

            } else{
                if(!debug) console.log('Объект фаворит это массив...')
                for(let obj=0;obj<ObjSave.favorites.length;obj++){
                    let currentObj = ObjSave.favorites[obj]

                    // no date
                    if(!currentObj.hasOwnProperty("date_time")){
                        currentObj.date_time = new Date().getTime()
                        if(debug) console.log("Нет Даты!: ", currentObj.date_time)
                    }

                    // http
                    if(currentObj.hasOwnProperty("link") && currentObj.hasOwnProperty("Down")){
                        let torrentId = currentObj.link
                        if(currentObj.link.includes("http://")){
                            if(debug) console.log("Link содержит http!: ", currentObj.link)
                            try{
                                torrentId = currentObj.link.match(/(\d+)\/?/i)[1];
                            } catch(e){
                                torrentId = currentObj.link//.match(/(\d+)/i)[1]
                                console.log('Remake Favorite no find ID', currentObj.link)
                            }
                            currentObj.link = `${hostname}/torrent/${torrentId}`
                        }

                        if(currentObj.Down.includes("http://")){
                            if(debug) console.log("Down содержит http!: ", currentObj.Down)
                            currentObj.Down = `http://d.${location.hostname}/download/${torrentId}`
                        }

                        if(debug) console.log('New link and download:', currentObj)
                    }

                    //---------- Category
                    if(!currentObj.hasOwnProperty('category')){
                        isEdit = !0;
                        let category_ = await getCategoryTorrent(currentObj)
                        currentObj.category = category_
                    }
                    //----------

                }
            }
            if(debug) console.log('После remakeFav:', ObjSave.favorites)
            if(isEdit){
                saveToStorage();
                console.log('Save remake...')
            }
        }
    }

    // Сортировка и корекция развернутых раздач
    function correctSortRazdch(sortWhat, type, field, butIndx){
        let dataClicked = sortWhat.sorti[butIndx].press,
            __this = this,
            press = this

        sortWhat = Object.assign({}, sortWhat);

        if(type == 0){
            sortWhat.razd.sort(function(a,b) {
                var an = a[field],
                    bn = b[field]
                return an - bn;
            });
        } else if(type == 1){
            sortWhat.razd.sort(function(a,b) {
                var x = a[field].toLowerCase();
                var y = b[field].toLowerCase();

                if(x < y) return -1;
                if(x > y) return 1;
                return 0
            });
        }

        if(dataClicked) sortWhat.razd.reverse()

        for(var i=0; i<sortWhat.razd.length;i++){
            let elDetach = $(sortWhat.razd[i].es),
                childs = null

            if(elDetach.next().next().is(".my_tr")) childs = [elDetach.next(),elDetach.next().next()]

            elDetach.detach().appendTo(sortWhat.category)

            if(childs != null){
                $(childs[1]).detach().insertAfter(elDetach)
                $(childs[0]).detach().insertAfter(elDetach)
            }
        }

        if(butIndx == 3 || butIndx == 4){
            const _this = $(sortWhat.sorti[butIndx].el_img)
            press = _this
            //_this.hasClass("headerSortDown") ? _this.removeClass("headerSortDown").addClass("headerSortUp"):_this.removeClass("headerSortUp").addClass("headerSortDown")
        } /*else{
            $(__this).hasClass("headerSortDown") ? $(__this).removeClass("headerSortDown").addClass("headerSortUp"):$(__this).removeClass("headerSortUp").addClass("headerSortDown")
        }*/

        sortWhat.sorti.map(function(currarr, indarr){
            if(indarr !== butIndx){
                currarr.press = false
                //$(currarr.el_img).removeClass("headerSortUp headerSortDown")

                if($(currarr.el_img).is("img")) $(currarr.el_img).css("transform", "scaleY(1)");
                else $(currarr.el_img).find("img").css("transform", "scaleY(1)")
            }
        })

        if($(press).is("img")){
            $(press).css("transform", "scaleY("+(dataClicked?"1":"-1")+")")
        } else {
            $(press).find("img[width^=15]").css("transform", "scaleY("+(dataClicked?"1":"-1")+")")
        }

        sortWhat.sorti[butIndx].press = !sortWhat.sorti[butIndx].press

        if(debug) console.log("Button: ",butIndx,"Value buttons: ",sortWhat.sorti[0].press,sortWhat.sorti[1].press,sortWhat.sorti[2].press,sortWhat.sorti[3].press,sortWhat.sorti[4].press)
    }

    // Эвенты для заголовков
    function setEventHeaderTitle(massiv){
        let titleSort = [],
            titles = $(this).find(".backgr > td").each(function(idxel, el){

                if(idxel == 0) return true
                if(idxel == 4 && el.textContent == "Пиры"){
                    let img = $("<img>").attr({"src":"https://raw.githubusercontent.com/AlekPet/Rutor-Preview-Ajax/master/assets/images/arrow_icon.gif","width":"15"}).css({"position": "relative","top":"3px","cursor": "pointer"}).attr({"title":"Сортировать по Раздающим","id":"_Up"}),
                        img_clone = img.clone(false).attr({"title":"Сортировать по Качающим","id":"_Down"})
                    $(el).css({"width": "90px"}).append($("<div>").text(" Р",).css({"cursor": "pointer"}).attr({"title":"Сортировать по Раздающим","id":"_Up"}),
                                                        el,img,
                                                        $("<div>").text("К").css({"cursor": "pointer"}).attr({"title":"Сортировать по Качающим","id":"_Down"}),
                                                        el,img_clone
                                                       )
                    titleSort.push({
                        el_img: $(el).find("div").eq(0),el_img:img,
                        index: idxel,
                        press: false},
                                   {
                        el_img: $(el).find("div").eq(1),el_img:img_clone,
                        index: idxel+1,press: false
                    })
                } else {
                    let img = $("<img>").attr({"src":"https://raw.githubusercontent.com/AlekPet/Rutor-Preview-Ajax/master/assets/images/arrow_icon.gif","width":"15"}).css({"position": "relative","top": ($(el).children().first().is("img")?"-10px":"3px")})
                    $(el).css({"width": "80px", "cursor": "pointer"}).attr("title","Сортировать по \""+($(el).children().first().is("img")?"Добавлено":$(el).text())+"\"").append(img)
                    titleSort.push({
                        el_img: el,el_img:el,
                        index: idxel,
                        press: false})
                }
            })
        massiv.sorti = titleSort
        // By date
        titles.eq(1).click(function(){
            correctSortRazdch.call(this,massiv,0, "date",0)
        })
        // By name
        titles.eq(2).click(function(){
            correctSortRazdch.call(this,massiv,1, "name",1)
        })
        // By size
        titles.eq(3).click(function(){
            correctSortRazdch.call(this,massiv,0, "size",2)
        })
        // By Up/Down
        titles.eq(4).find("div, img").each(function(img_indx, el){ // titles.eq(4).find("img")
            $(this).click(function(){
                if(el.id == "_Up"){
                    correctSortRazdch.call(el, massiv, 0, "up",3)
                } else {
                    correctSortRazdch.call(el, massiv, 0, "down",4)
                }
            })
        })
    }

    function sorting(){
        if(!searchinHost("/torrent/")){
            // Ищим классы для получения данных
            let massivT = [],
                month = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"],
                razmeronosti = ["kB","MB","GB"]

            $("#index > table").each(function(idx, eltable){

                let objCat = {category:this, name:$(this).prev().text(), razd:[]}

                $(this).find(".gai, .tum").each(function(){

                    let colR, colU, size
                    if(this.children.length == 5){
                        colR = this.children[4].children[0].textContent
                        colU = this.children[4].children[2].textContent
                        size = this.children[3].textContent
                    } else{
                        colR = this.children[5].children[0].textContent
                        colU = this.children[5].children[2].textContent
                        size = this.children[4].textContent
                    }

                    // Date
                    let dateT = this.children[1].textContent
                    dateT = dateT.split(/\s+/)

                    $.each(month, function(idx,val){
                        if(dateT[1] == val.substr(0,3)) dateT[1] = idx
                    })

                    dateT = new Date(parseInt("20"+dateT[2]), dateT[1], dateT[0], 0,0,0)

                    // Sizes
                    let complSize
                    $.each(razmeronosti, function(idx,val){
                        if(size.includes(val)){
                            complSize = size.substr(0, size.indexOf(razmeronosti[idx]))*1
                            if(idx == 0){
                                complSize = complSize *1
                            } else if(idx == 1){
                                complSize = complSize * 1000
                            } else if(idx == 2){
                                complSize = complSize *1000000
                            }
                        } else {
                            complSize = parseFloat(size)
                        }
                    })

                    let nameSorti = this.children[2].children[5].textContent
                    if(!nameSorti || nameSorti.length == 0) nameSorti = this.children[2].children[0].getAttribute('title');

                    objCat.razd.push({es:this, date:dateT, name:nameSorti, size:complSize, up:colR, down:colU})
                })
                massivT.push(objCat)
                setEventHeaderTitle.call(this, massivT[idx])

            })
            if(debug)console.log("Sorting obj:",massivT)
        }
    }

    function AdBlock(){
        if($(".sideblock2").length){
            $(".sideblock2").remove();
        }

        $(['https://code.jquery.com/jquery-3.1.0.min.js','https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js']).each(function(){
            let jquery = document.createElement('script')
            jquery.type = "text/javascript"
            jquery.src = this
            document.head.appendChild(jquery)
        })

    }

    function init(){
        //setTimeout(function(){
        //AdBlock();
        loadStorage();
        makePanel();
        addPoleInfo();
        remakeFav();
        updateFav();
        sorting();

        //if(searchinHost("/top/")) sorting(); // using jquery.tablesorter on site, run only TOP category
        //}, 500);
    }

    // To fix the script on the website:
    // Replace the function 'sotrdgts' (jquery.tablesorter) on the site,
    // because there is an error on the site and the userscript does not work correctly!
    /*document.addEventListener('readystatechange', function(){
        if(document.readyState == 'interactive'){
            $(`<script>function sotrdgts() {
if($(".sorted tbody td").length) {
$(".sorted tbody td").each(function() {
$(this).html("<s>" + appndvl($(this).html()) + "</s>" + $(this).html());
});
$(".sorted tbody td[colspan=2]").each(function() {
$(this).replaceWith('<td>' + $(this).html() + '</td><td></td>');
});
$(".sorted").each(function() {
$(this).tablesorter({
widgets: ['zebra'],
headers: {
0: { sorter: 'digit' } ,
3: { sorter: 'digit' } ,
4: { sorter: 'digit' }
}
});
});
} else {
setTimeout(function() {sotrdgts();}, 200);
}
}</script>`).appendTo(document.body);

        } else if(document.readyState == 'complete'){
            init();
        }
    });*/

    /*window.onload = function(){

        let scripts = [
            'https://vjs.zencdn.net/7.20.3/video.min.js',
            'https://cdn.jsdelivr.net/npm/@videojs/http-streaming@2.15.0/dist/videojs-http-streaming.min.js'
        ],
            body = document.querySelector('body')

        for(let s of scripts){
            let script = document.createElement('script')
            script.type = 'text/javascript'
            script.charset = 'utf-8'
            script.src = s
            body.appendChild(script)
        }
    }*/

    init()

})();
