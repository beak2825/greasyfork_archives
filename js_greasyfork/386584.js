// ==UserScript==
// @name        Superhero alias
// @author      paladurg@
// @namespace   http://tampermonkey.net/
// @version     0.1
// @description Displays a random superhero name next to the user's given name
// @include     https://phonetool.amazon.com/users/*
// @grant       GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/386584/Superhero%20alias.user.js
// @updateURL https://update.greasyfork.org/scripts/386584/Superhero%20alias.meta.js
// ==/UserScript==

try {
    GM.xmlHttpRequest({
        url: 'https://akabab.github.io/superhero-api/api/all.json',
        method: "GET",
        headers: {"Accept": "application/json"},
        onload: function(response) {
            var responseList = eval("(" + response.responseText + ")");
            var randNum = Math.ceil(Math.random() * Math.floor(563));
            var item = responseList[randNum];
            var container = document.querySelector(".PersonalInfoName");
            var nameForGSearch = item.name.split(" ").join("+");
            var googleSearchLink = `https://www.google.com/search?q=${nameForGSearch}+superhero`;
            var imgLink =
            `<span style='margin-left: 23px;
            color:#88292F; font-size:23px'>${item.name}</style>
            <a href=${googleSearchLink} target="_blank"> <img style="border-radius: 50%; width:50px; height:50px;" src=${item.images.md}> </a>`;
            container.innerHTML += imgLink;
        }
    });
}
catch (e) {
    console.log(`'${GM.info.script.name}' Update the script! Contact paladurg@`, e);
}