// ==UserScript==
// @name         Streak Society Icon
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Allows you to turn on the streak society icon for duolingo web.
// @author       You
// @match        https://*.duolingo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=duolingo.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463564/Streak%20Society%20Icon.user.js
// @updateURL https://update.greasyfork.org/scripts/463564/Streak%20Society%20Icon.meta.js
// ==/UserScript==
var link = document.querySelector("link[rel~='icon']");
if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
}
link.href = 'https://i.ibb.co/1r9bdr4/icon.png';

window.addEventListener('load', function() {
    myfunction()
}, false);

function myfunction(){
    var parent=document.getElementsByClassName('_1ZKwW')[0];

    var node_1 = document.createElement('DIV');
    node_1.setAttribute('class', '');
    node_1.setAttribute('style', 'cursor: pointer;');
    node_1.setAttribute('onclick', 'streaksocietyclick()');
    parent.appendChild(node_1);

    var node_2 = document.createElement('DIV');
    node_2.setAttribute('class', 'XIQ0S');
    node_2.setAttribute('data-test', 'more-nav');
    node_2.setAttribute('style', 'cursor: pointer;');
    node_1.appendChild(node_2);

    var node_3 = document.createElement('SPAN');
    node_3.setAttribute('class', '_3RWRj _28G4W _2cOhp _2uqS-');
    node_3.setAttribute('style', 'cursor: pointer;');
    node_2.appendChild(node_3);

    var node_4 = document.createElement('SPAN');
    node_4.setAttribute('class', '_28G4W _2cOhp _2uqS- _3WAls yyVj5 _16eTo');
    node_4.setAttribute('style', 'cursor: pointer;');
    node_3.appendChild(node_4);

    var node_5 = document.createElement('DIV');
    node_5.setAttribute('class', '_2NhcO');
    node_4.appendChild(node_5);

    var node_6 = document.createElement('IMG');
    node_6.setAttribute('class', '_10ZJK');
    node_6.setAttribute('id','streaksocietyicon')

    streaksocietyicon=window.localStorage.getItem('streaksocietyicon');
    streaksocietyicon = (streaksocietyicon === 'true');
    if(null === streaksocietyicon)
    {
        streaksocietyicon = false
    }
    if (!streaksocietyicon){
        node_6.setAttribute('src', 'https://i.ibb.co/VmzZ12R/icon2.png');
    }
    else if (streaksocietyicon){
        node_6.setAttribute('src', 'https://i.ibb.co/bWQR4Xb/icon1.png');
    }

    node_5.appendChild(node_6);

    var node_7 = document.createElement('SPAN');
    node_7.setAttribute('class', '_1lJDk');
    node_4.appendChild(node_7);

    var node_8 = document.createTextNode((new String("Streak Society")));
    node_7.appendChild(node_8);

    var script = document.createElement("script");
    script.innerHTML = `function getstreaksociety(){var e=window.localStorage.getItem("streaksocietyicon");return"true"===e}function streaksocietyclick(){var e=getstreaksociety();if(e)e&&(window.localStorage.setItem("streaksocietyicon","false"),(t=document.querySelector("link[rel~='icon']"))||((t=document.createElement("link")).rel="icon",document.head.appendChild(t)),t.href="https://d35aaqx5ub95lt.cloudfront.net/favicon.ico",(streaksocietyicon=document.getElementById("streaksocietyicon")).src="https://i.ibb.co/VmzZ12R/icon2.png");else{window.localStorage.setItem("streaksocietyicon","true");var t=document.querySelector("link[rel~='icon']");t||((t=document.createElement("link")).rel="icon",document.head.appendChild(t)),t.href="https://i.ibb.co/1r9bdr4/icon.png",(streaksocietyicon=document.getElementById("streaksocietyicon")).src="https://i.ibb.co/bWQR4Xb/icon1.png"}}`;
    document.head.appendChild(script);
}