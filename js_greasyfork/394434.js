// ==UserScript==
// @name         No magic
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Disable magic on CF
// @author       ouuan
// @match        *://codeforces.com/*
// @match        *://codeforc.es/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394434/No%20magic.user.js
// @updateURL https://update.greasyfork.org/scripts/394434/No%20magic.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var handlesElements = document.getElementsByClassName('rated-user');

    var handles = '';
    var handleElements = [];

    for (var i = 0; i < handlesElements.length; ++i) {
        var handleElement = handlesElements[i];
        var handle = handleElement.innerText;
        if (i > 0) handles += ';';
        handles += handle;
        handleElements.push(handleElement);
    }

    var xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            var response = xmlHttp.response.result;
            for (var i = 0; i < response.length; ++i) {
                var user = response[i];
                var color = 'rated-user user-';
                var lgm = false;
                if (!user.hasOwnProperty('rank')) color += 'black';
                else if (user.rank == 'newbie') color += 'gray';
                else if (user.rank == 'pupil') color += 'green';
                else if (user.rank == 'specialist') color += 'cyan';
                else if (user.rank == 'expert') color += 'blue';
                else if (user.rank == 'candidate master') color += 'violet';
                else if (user.rank == 'master' || user.rank == 'international master') color += 'orange';
                else color += 'red';
                if (user.rank == 'legendary grandmaster') lgm = true;
                var u = handleElements[i];
                u.className = color;
                if (lgm) u.innerHTML = '<span class="legendary-user-first-letter">' + user.handle[0] + '</span>' + user.handle.substring(1);
                else u.innerHTML = user.handle;
            }
        } else {
            console.log(xmlHttp.response);
        }
    }

    xmlHttp.responseType = 'json';
    xmlHttp.open('GET', 'https://codeforces.com/api/user.info?handles=' + handles, true);
    xmlHttp.send(null);
})();