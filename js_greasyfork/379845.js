// ==UserScript==
// @name         WebToons Shortcuts
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  Use left/right arrows to change page, and ctrl + left/right arrow to change chapter or use a Page Select input to change page.
// @author       Eduardo Calixto
// @match        https://www.webtoons.com/en/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/379845/WebToons%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/379845/WebToons%20Shortcuts.meta.js
// ==/UserScript==

// VARIABLES

// Internal variables (DO NOT TOUCH)
var count = 1;
var imagesList = document.getElementsByClassName("_images");

// PUBLIC variables (BE WELCOME TO CHANGE)
// Padding between pages (css padding values)
const paddingPhotos = '8px 0';
// Days that imgCount is saved in browser;
const daysCookies = 2;
// Flag that sets if should use url or cookies to control which page you are (false recommended);
const shouldUpdateUrl = false;
// IF FALSE --> [Season X1 Ep. X2] | Title Name (DEFAULT VALUE)
// IF TRUE -->  Title Name - [Season X1 Ep. X2]
const customTabTitle = false;

// SMOOTH SCROLL
document.getElementsByTagName('html')[0].style['scroll-behavior'] = 'smooth';

setCustomTabTitle();

getCountOnInit();
createSelectInput();
setDefaultLayoutForImages();

// FIRST SCROLL
scrollToImage(count);
addEventListenerToWindowResize();

document.addEventListener('keydown', (e) => {
    // PREV CHAPTER
    if (e.keyCode == 37 && e.ctrlKey) {document.getElementsByClassName('pg_prev _prevEpisode NPI=a:prev,g:en_en')[0].click();}
    // NEXT CHAPTER
    else if (e.keyCode == 39 && e.ctrlKey) {document.getElementsByClassName('pg_next _nextEpisode NPI=a:next,g:en_en')[0].click();}
    // PREV PAGE
    else if (e.which == 37 && count > 1) {
        e.preventDefault();
        count -= 1;
        scrollToImage(count);
        updateUrlCount();
        setCountCookie();
        setCountInput();
        return false;
    }
    // NEXT PAGE
    else if (e.which == 39 && count < imagesList.length) {
        e.preventDefault();
        count += 1;
        scrollToImage(count);
        updateUrlCount();
        setCountCookie();
        setCountInput();
        return false;
    }
});

function getCountCookie(){
    const searchUrl = 'page_url=';
    const searchCount = 'page_count=';
    const listCookies = document.cookie.split(';');
    for (let i = 0; i < listCookies.length; i++) {
        let cookie = listCookies[i].trim();
        if(cookie.startsWith(searchUrl) && cookie.substring(searchUrl.length,) != window.location.href){
            return 1;
        }
        else if(cookie.startsWith(searchCount)){
            return Number(cookie.substring(searchCount.length,));
        }
    }
    return 1;
}

function getCountOnInit(){
    if(shouldUpdateUrl){
        count = window.location.href.indexOf('#img_') != -1 ? parseInt(window.location.href.substring(window.location.href.indexOf('#img_') + 5,)) : 1;
        if(window.location.href.indexOf('#img_') == -1){window.location.href = window.location.href + '#img_' + count.toString();}
        setCountCookie();
    }
    else{
        count = getCountCookie();
        // Removes imgCount from hash
        if(window.location.href.indexOf('#img_') != -1){
            history.pushState('', document.title, window.location.pathname + window.location.search);
        }
    }
}

function setCustomTabTitle(){
    if(customTabTitle){
        // IF FALSE --> [Season X1 Ep. X2] | Title Name
        // IF TRUE -->  Title Name - [Season X1 Ep. X2]
        document.title = document.title.replace(/^([^\|]{0,})\|\s{0,1}([\W\w]{0,})$/, '$2 - $1').trim();
    }
}

function createSelectInput(){
    let countSelectHtml = '<div><select id="count_select" style="position: fixed;top: 10%;right: 2%;min-width: fit-content;width: 5vw;z-index: 99999">';
    for (let i = 1; i <= imagesList.length; i++) {countSelectHtml += '<option value="' + i + '">Page ' + i +'</option>';}
    countSelectHtml += '</select></div>';
    document.body.innerHTML += countSelectHtml;
    setCountInput();
    addEventListenerToSelectInput();
}

function addEventListenerToSelectInput(){
    document.getElementById('count_select').addEventListener("change", function() {
        count = Number(document.getElementById('count_select').value);
        scrollToImage(count);
        updateUrlCount();
    });
}

function setDefaultLayoutForImages(){
    for(var i=0; i<imagesList.length; i++)
    {
        imagesList[i].style.height = (document.body.clientHeight)+'px';
        imagesList[i].style.margin = paddingPhotos;
    }
}

function addEventListenerToWindowResize(){
    window.addEventListener("resize", function(){
        for(var i=0; i<imagesList.length; i++)
        {
            imagesList[i].style.height = (document.body.clientHeight)+'px';
        }
        scrollToImage(count);
    });
}

function setCountCookie(){
    var date = new Date();
    date = new Date(date.setTime(date.getTime() + (daysCookies*24*60*60*1000))).toUTCString();
    document.cookie = 'page_url=' + window.location.href.toString() + ';expires='+ date + ';path=/';
    document.cookie = 'page_count=' + count.toString() + ';expires='+ date + ';path=/';
}

function updateUrlCount(){
    if(shouldUpdateUrl){
        window.location.href = window.location.href.substring(0,window.location.href.indexOf('#img_') + 5) + count;
    }
}

function setCountInput(){
    document.getElementById('count_select').value = count;
}

function scrollToImage(count){
    imagesList[count - 1].scrollIntoView();
}