// ==UserScript==
// @name         PTH WEB Shops Linker
// @namespace    passtheheadphones
// @description  Inserts shop links buttons on Passtheheadphones.me request pages
// @author       ukover
// @version      0.0001
// @match	     https://passtheheadphones.me/requests.php?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26074/PTH%20WEB%20Shops%20Linker.user.js
// @updateURL https://update.greasyfork.org/scripts/26074/PTH%20WEB%20Shops%20Linker.meta.js
// ==/UserScript==

function createDiscogsLink(link) {
    var a = document.createElement('a');
    a.href = link;
    a.title = 'Search on Discogs';
    a.setAttribute('extLink', true);
    a.target = "_blank";
    var img = document.createElement('img');
    img.style.border = 'none';
    img.style.marginLeft = '3px';
    img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9sECA0hAXdZfkUAAAJoSURBVDhPdZLdS1NxGMcf5qZ75+x9O2dnwzO3uU0Ut7mm00mI2FiMQEywBLvyIqQ7FQS78WZX0W0YeGGBFQhdVFA0usi8sIuCZJEQTiKIXuwfON9+Z3M15/rCw3PzfJ6X3+9L1EJer7fo8wklSZLQ2SnB5+NLNput2Kq2WSGTyQSdTgePxwO/3y8Hg0FZaTIyksbCwiJUKgq1JIeHh/dZAgvZbrfD7XZDydFoFL29PdjcfISjo+9yKtXPaiz7zXyoDitZrVaD53m2uojBwTTm5q6jUjnA5OQVFAp5ORCQcMLU1NHR8Rf+Fxw07SLsjig2Nrawvn4P+fwlJBIJZDIZ2el0ogqbzebiabAWF87rcP8u4VbRgImxBMbGChgYqMLo6uqqnsjqimSxWErN8Pw1Gz7uESr7hMMPhG+fCDfm9eC4AETRC5fLVT2R1ZbIYDA0rd+OJw8IvyuEn58Jx4eEHyy/2yHo9GEIAg+9Xg/2WzXmpEFDmPD+DQHHhFfPurG91Q38Yg12CUaTeOZUYgZBW1ubrGRlNY5z487tduy+qDVR4is7Ze+lAmga4frWtCQIAqxWK0ZHRxEOd0Pq5PH0oQZvXxN2nlN1o1iYOzudscTsmlTcl81m5Ugkwv76IlZXF3F5eg3phBapfjsrFJrB+vSksgEZjcby0FAGU1MFjI9PQFEul2NWluBwOGGzWVtNL1Oj2HdiZuYqyuUv8vLyGvP+IOLxOHOjr/5ljZNxChZFUaXkvr5z5e3tx1hZuYnZ2Wk5nU5XGzDTyMxwzZNV9B8lY7GeJY+HRygUglarBTux9mD1mxv0ByVEOcCBfMQYAAAAAElFTkSuQmCC';
    a.appendChild(img);

    return a;
}

function createTidalLink(link) {
    var a = document.createElement('a');
    a.href = link;
    a.title = 'Search on Tidal';
    a.setAttribute('extLink', true);
    a.target = "_blank";
    var img = document.createElement('img');
    img.style.border = 'none';
    img.style.marginLeft = '3px';
    img.src = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAB3RJTUUH4AgGEiAr6REPwwAAASlJREFUeJytkLGKwkAQhv9NFns7bQ0WKxEi1nkcSwtBsNiARAu380l8ibyBhY2NEDTtgpVB8L9iNXrxwDu4qf6Z/5thZoA/hqiU53kAbrcbACHudZI169H3IIQQla6lru0ZxhittdNBEGw2m1ar5dLVapUkyZ3zfb/RaCyXS5IkJ5NJv9/f7/ckt9utUmo+nztrNptJKSGEaLfb1lpX3e12xhiSl8uFZJqmeZ4763g8NptN+L4PoNfrWWtPp1On0wGwXq+v1+tisQAQhqG1tigKZz0vjqJIKVUdl6apW/jVev6jUo7QWp/P5/F4XFW+0dXXpJQAptMpybIsSY5GIwBSyjr9OiOO46IoSB4Oh+Fw+MPs957BYJBlWbfb/UC/7/qZfuV+S/9zfAHwS4ShYIsIOgAAAABJRU5ErkJggg==';
    a.appendChild(img);

    return a;
}

function createQobuzLink(link) {
    var a = document.createElement('a');
    a.href = link;
    a.title = 'Search on Qobuz';
    a.setAttribute('extLink', true);
    a.target = "_blank";
    var img = document.createElement('img');
    img.style.border = 'none';
    img.style.marginLeft = '3px';
    img.src = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfgCAYSICvpEQ/DAAAA5ElEQVQ4T2NkWPTiPwMFgAlKkw0G3gCMMEizF2eYKQflgMDHrwzWm74wHINy0QGSC1gZJviBNP9gSF/8koERhDd/ZbjDz81w1I+HwQqqCh0gDFDgYsjnZ2C4c/kbwyyoEMOHLwzxl/8wMPCzM4QJQMXQANwAKwEWMH37w28wDQPHPgANYGBhUCNkALkAbgDEJgYGVQFWMA0DEJf9Ybj1AcJHBwgXPPjJsB1IqehyMaRBRBgYBHgYFuoCDXj0laEAhwFo0cjBsC2Wn8ETyoMDPFFJVF6ApI0/DBM3v8VwyZDPTAwMANSZRNWCc7glAAAAAElFTkSuQmCC';
    a.appendChild(img);

    return a;
}

function createDeezerLink(link) {
    var a = document.createElement('a');
    a.href = link;
    a.title = 'Search on Deezer';
    a.setAttribute('extLink', true);
    a.target = "_blank";
    var img = document.createElement('img');
    img.style.border = 'none';
    img.style.marginLeft = '3px';
    img.src = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfgCAYSICvpEQ/DAAAAuklEQVQ4T2MMCAj4z0ABYPr79y8DJZjpz58/DJRgig1gdHBwoCgMGK2srCgzwMTEhGQDKtceBdPtwdYMTL9+/WLAhfem9YIxujgMgNh4DYABfOJgA87khoAxsiIQhgEQe+v+UjBGFwcbAAMgNjKGAXxsFhDxtX49RIDpF8PLWxxgtrjaD4bvaafB7F9ivxgevVsAYQPVdz75CWdjuAAGiGUz/f79G8plYCCHzcjOzk5ZQmJmZqbAAAYGACo3Vc9KyhSpAAAAAElFTkSuQmCC';
    a.appendChild(img);

    return a;
}

function createGooglePlayLink(link) {
    var a = document.createElement('a');
    a.href = link;
    a.title = 'Search on Google Play';
    a.setAttribute('extLink', true);
    a.target = "_blank";
    var img = document.createElement('img');
    img.style.border = 'none';
    img.style.marginLeft = '3px';
    img.src = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAB3RJTUUH4AUBFA0YFyG0gAAAAjlJREFUeJxVkktIlFEYht/v/OfM6D9jXsMU0TCNIjCkEpGMRmHKaGuImxZBCzHIfTu3tQqCFi0kiRYFbSIIJBWClNKKxkuUgTFWJHPRvM6c87b4Ne1Zf/fvAcnB6Yn42P2XayN/7BpJ55x1lqSjC+A+FAARTi2q2+8Td9MPJtanAVGiLB0IEQFAErtoAIAUhphcOjjGzO/GZ5MbH7qisYZwHQBLpyAiEuSIiA4KEKJNbmGpyIhWDYv3Ug9PFzbFo+0VuhSOpBVRECGpAYiAICAhk59LFpDVJ48uv9mYSmx+jvktrQfaItCkg6MopYKRBEIAkLCx80sFU/Plxdq3buvx9viLj3fyn0YhSpTa6RAgACkiCBv75UehsmxsXmn9ttI+8i6de2XmRyNtvabyiMI+BASEFN+z09ki81x3jya0pxgp3ZobSw8P5JIzex1ABGt5jpmIjs+lrwwnfx6rKjmTxFoqVN8Sbes1Vcd2E0iCQXQ2YmIzmYGnC3mTX56kKm6s6esoOH5BlJDBH0gKIOJZl42YjtnszSdfN1fXpdiv7T9f2RsPVfgk6ZwopQEQIhDPulTUdM5kbwwlNsmSrlM11y/5DdUA6KyIwr8rCehZrpSFO9/+6h9KmOb62r7LZWdPAHB5K54S5QUj73xagIzvdY9/H3idKr/VU9FzzvM8WgeB0l7gXCDVjkvbWi7Org6Ga8sfXTOVpSRpnSgB9hT6T766dO7q4aZDPTECbisnIS2eIglwf2jAX1xqMhCCB5VuAAAAAElFTkSuQmCC';
    a.appendChild(img);

    return a;
}

function createiTunesLink(link) {
    var a = document.createElement('a');
    a.href = link;
    a.title = 'Search on iTunes';
    a.setAttribute('extLink', true);
    a.target = "_blank";
    var img = document.createElement('img');
    img.style.border = 'none';
    img.style.marginLeft = '3px';
    img.src = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfgBQEUDRgXIbSAAAAAO0lEQVQ4T2P8DwQMFAAmKE02GOQGbD/8koHx8A8oDzugbSDeufyOwfryHygPOxjusUAMoNiA0bzAwAAAyT8U2IC5hBMAAAAASUVORK5CYII=';
    a.appendChild(img);

    return a;
}

// Add link at the end of the linkbox at top of page
var artistsmain = document.body.getElementsByClassName('artists_main')[0];
var pageheader = document.body.getElementsByClassName('header')[0].getElementsByTagName('h2')[0];
var linkbox = document.getElementsByClassName('linkbox')[0];
if (linkbox && linkbox.tagName == 'DIV') {
    if (window.location.href.indexOf("requests.php?") >= 0) {
        // We are on an request page
        var artistName = artistsmain.getElementsByTagName('a')[0].textContent.replace(/\b\s\b/g, ' ').replace(/^\s+|\s+$/g, '');
        var albumName = pageheader.getElementsByTagName('span')[0].textContent.replace(/\b\s\b/g, ' ').replace(/^\s+|\s+$/g, '');
        linkbox.appendChild(createTidalLink('https://listen.tidal.com/search/' + artistName + ' ' + albumName));
        linkbox.appendChild(createQobuzLink('http://www.qobuz.com/fr-fr/search?q=' + artistName + ' ' + albumName + '&i=boutique'));
        linkbox.appendChild(createDeezerLink('http://www.deezer.com/search/' + artistName + ' ' + albumName));
        linkbox.appendChild(createGooglePlayLink('https://play.google.com/store/search?q=' + artistName + ' ' + albumName + '&c=music'));
        linkbox.appendChild(createiTunesLink('https://www.google.ru/search?client=opera&q=' + artistName + ' ' + albumName + ' site:https://itunes.apple.com/&sourceid=opera&ie=UTF-8&oe=UTF-8'));
        linkbox.appendChild(createDiscogsLink('https://www.discogs.com/search/?type=release&q=' + artistName + ' ' + albumName));
    }
}