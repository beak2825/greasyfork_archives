// SOURCE CODE      https://gitlab.com/f3714/remove_shorts
// ==UserScript==
// @name     	    Remove YouTube Shorts and Recommendation(by NOface312)
// @description	    Working on Desktop & Mobile.
// @version  	    2
// @grant    	    none
// @match    	    https://www.youtube.com/*
// @match    	    https://m.youtube.com/*
// @exclude 	    https://www.youtube.com/shorts/*
// @namespace       Remove YouTube Shorts automatically by pressing a button(by NOface312)
// @license         MIT
// @author          NOface312
// @downloadURL https://update.greasyfork.org/scripts/465613/Remove%20YouTube%20Shorts%20and%20Recommendation%28by%20NOface312%29.user.js
// @updateURL https://update.greasyfork.org/scripts/465613/Remove%20YouTube%20Shorts%20and%20Recommendation%28by%20NOface312%29.meta.js
// ==/UserScript==


// Set your config to change script
var config = {
    short_redirect: true,
    delete_recommendations: true,
    remove_recomendations_on_main_page: false,
    recommendations_list: [
        "Рекомендации", 
        "Recommendations", 
        "Просмотренные видео",
        "Другие видео, которые посмотрели зрители",
        "Новые каналы для вас",
        "Новые видео на канале",
    ],
    mobile_interval: 500, //How often script launch
    pc_interval: 1000 //How often script launch
}


//setInterval is not workin in mobile version((( So I had to write my own implementation
function mySetInterval(func, interval) {
    setTimeout(function() {
        func();
        mySetInterval(func, interval);
    }, interval);
}


function delShortsPC() {

    if (window.location.href.includes('/shorts/') && config.short_redirect) {
        window.location.replace('https://www.youtube.com/');
    }

    if ((window.location.href === "https://www.youtube.com/") && (config.remove_recomendations_on_main_page)) {
        document.querySelectorAll("#contents.style-scope.ytd-rich-grid-renderer").forEach(element => {
            element.remove();
        })
    }

    //Delete Shorts in Youtube Subscribe
    document.querySelectorAll('ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]').forEach(function (element) {
        element.closest('ytd-grid-video-renderer') && element.closest('ytd-grid-video-renderer').remove();
    });
    
    //Delete Short link in channel menu
    document.querySelectorAll('div.tab-title.style-scope.ytd-c4-tabbed-header-renderer').forEach(element => {
        element.innerHTML === "Shorts" && element.closest('tp-yt-paper-tab').remove();
    })
    
    //Delete Short link in channel menu
    document.querySelectorAll('ytd-mini-guide-entry-renderer[aria-label="Shorts"]').forEach(function (element) {
        element.remove();
    }); 

    //Delete Short in search
    document.querySelectorAll('ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]').forEach(function (element) {
        element.closest('ytd-video-renderer') && element.closest('ytd-video-renderer').remove();
    });

    // Remove Youtube Recomendation in search
    if (config.delete_recommendations){
        document.querySelectorAll('span.style-scope.ytd-shelf-renderer').forEach(element => {
            config.recommendations_list.includes(element.innerHTML) && element.closest('ytd-shelf-renderer') && element.closest('ytd-shelf-renderer').remove();
        })
    }
    
    var elementToRemove = []
    // Remove Youtube Recomendation in Main Page
    elementToRemove.push(document.querySelector('ytd-reel-shelf-renderer'));
    elementToRemove.push(document.querySelector('ytd-rich-section-renderer'));
    elementToRemove.push(document.querySelector('ytd-reel-shelf-renderer'));
    elementToRemove.push(document.querySelector('ytd-guide-entry-renderer a[title="Shorts"]:first-child'));

    
    elementToRemove.forEach(function(element) {
        element && element.remove();
    });
}


function delShortsMobile() {
    if (window.location.href.includes('/shorts/') && config.short_redirect) {
        window.location.replace('https://m.youtube.com/');
    }
    
    document.querySelectorAll('ytm-thumbnail-overlay-time-status-renderer[data-style="SHORTS"]').forEach(function (element) {
        element.closest('ytm-item-section-renderer') && element.closest('ytm-item-section-renderer').remove();
    });

    document.querySelectorAll('a.single-column-browse-results-tab.center').forEach(element => {
        element.innerHTML === "Shorts" && element.remove();
    })

    var elementToRemove = []
    elementToRemove.push(document.querySelector('ytm-reel-shelf-renderer'));
    elementToRemove.push(document.querySelector('ytm-rich-section-renderer'));
    elementToRemove.push(document.querySelector('ytm-reel-shelf-renderer'));
    elementToRemove.push(document.querySelector('ytm-guide-entry-renderer a[title="Shorts"]:first-child'));
    elementToRemove.forEach(function(element) {
        if (element) {
            element.remove();
        }
    });

    try {
        document.querySelector('ytm-pivot-bar-item-renderer div.pivot-bar-item-tab.pivot-shorts').parentNode.remove();
    } catch (error) {
        // pass
    }
}


function drawButton() {
    const div = document.createElement('DIV');

    div.id = 'dSDiv';
    div.style.position = 'absolute';
    div.style.zIndex = '99999';

    const button = document.createElement('button');

    button.innerText = 'Remove Shorts';
    button.id = 'dSButton';
    button.style.backgroundColor = 'red';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.marginLeft = "-60px";
    button.style.fontSize = '10px';
    button.style.fontWeight = 'bold';
    button.style.borderRadius = '8px';
    button.style.cursor = 'pointer';
    button.style.boxShadow = '0px 5px 10px rgba(0, 0, 0, 0.2)';
    button.style.transition = 'transform 0.2s ease-in-out';
    button.style.background = localStorage.getItem("dSButtonSettings");

    button.addEventListener('mousedown', function() {
        button.style.transform = 'translateY(2px)';
        button.style.boxShadow = '0px 3px 6px rgba(0, 0, 0, 0.2)';
    });

    button.addEventListener('mouseup', function() {
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = '0px 5px 10px rgba(0, 0, 0, 0.2)';
    });
    
    button.addEventListener('click', function () {
        location.reload();
        if (button.style.background == 'red' || button.style.background == 'red none repeat scroll 0% 0%') {
            button.style.background = 'green';
            localStorage.setItem("dSButtonSettings", "green");
            delShortsInterval = setInterval(delShortsPC, config.pc_interval);
        } else if (button.style.background == 'green' || button.style.background == 'green none repeat scroll 0% 0%') {
            button.style.background = 'red';
            localStorage.setItem("dSButtonSettings", "red");
            clearInterval(delShortsInterval);
        }
    });

    div.appendChild(button);
    document.getElementById('center').appendChild(div);
}


//Main
//PC
if (!window.location.href.includes('m.youtube')) {
    var delShortsInterval;

    if (!localStorage.getItem("dSButtonSettings")) {
        localStorage.setItem("dSButtonSettings", "red");
    }
    
    if (localStorage.getItem("dSButtonSettings") == 'green') {
        delShortsInterval = setInterval(delShortsPC, config.pc_interval);
    }

    if (document.getElementById('center').children.length != 4) {
        drawButton("Desktop");
    }
// Mobile
} else {
    mySetInterval(delShortsMobile, config.mobile_interval);
}