// ==UserScript==
// @name     Hide troublesome sites
// @name-en     Hide troublesome sites
// @description a simple cross-browser anti-procrastination tool
// @version  6
// @grant    none
// @include     *amazon.com/*
// @include     *engadget.com/*
// @include     *ebay.com/*
// @include     *facebook.com/*
// @include     *feedly.com/*
// @include     *humblebundle.com/*
// @include     *kickstarter.com/*
// @include     *mindseyesociety.org/*
// @include     *meetup.com/*
// @include     *oglaf.com/*
// @include     *penny-arcade.com/*
// @include     *patreon.com/*
// @include     *puri.sm/*
// @include     *robertsspaceindustries.com/*
// @include     *reddit.com/*
// @include     *smbc-comics.com/*
// @include     *somethingpositive.net/*
// @include     *steampowered.com/*
// @include     *twitter.com/*
// @include     *twitch.tv/*
// @include     *youtube.com/*


// @run-at document-end


// @namespace https://greasyfork.org/users/26567
// @downloadURL https://update.greasyfork.org/scripts/370378/Hide%20troublesome%20sites.user.js
// @updateURL https://update.greasyfork.org/scripts/370378/Hide%20troublesome%20sites.meta.js
// ==/UserScript==


function swapOverlay(){
    if(document.body.children[0].hidden){
        document.body.children[0].hidden=0;
    }else{
       document.body.children[0].hidden=1;
    }
}

function confirmSlacking(){
    var confirmation = window.prompt("Despite well reasoned aversion to this site, are you sure you want to slack off","No, I'll be good!");
    if(confirmation=="despite well reasoned aversion to this site, I am sure I want to slack off"){
        var min = window.prompt("How long must you give into distraction","16");
        if(min<=60){
          swapOverlay();
          var slackTime= new Date();
          slackTime.setTime(slackTime.getTime() + (min*60*1000));
          localStorage.setItem('slackEnd', slackTime.getTime());
        }else{
          window.alert('Too bad, slack less!');
        }
    };
}
function stopSlacking(){
    var hhElChild = document.createElement('button');
    hhElChild.onclick=confirmSlacking;
    hhElChild.innerHTML='Sure you want to be here?';
    hhElChild.setAttribute('style','z-index:900;background:#ccc;top:0;left:0;width:100%;height:100%;position:fixed');
    swapOverlay();
    document.body.prepend(hhElChild);
}
function bootMe(){
    var now=new Date();
    var slack = localStorage.getItem('slackEnd');
    if(!slack&&window==window.top){ stopSlacking()};
    if(slack&&slack<=now.getTime()){
        localStorage.clear('slackEnd');
        stopSlacking();
    }
}

document.body.addEventListener("load",bootMe());
