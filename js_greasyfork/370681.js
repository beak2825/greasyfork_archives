// ==UserScript==
// @name         rarbg - improved
// @namespace    sansoo
// @version      1.2
// @description  rarbg search input focus and improved category links
// @author       sansoo
// @match        http://*rarbg.to/*
// @match        https://*rarbg.to/*
// @match        http://*rarbg.com/*
// @match        https://*rarbg.com/*
// @match        http://*rarbgaccessed.org/*
// @match        https://*rarbgaccessed.org/*
// @match        http://*rarbgmirror.com/*
// @match        https://*rarbgmirror.com/*
// @match        http://*rarbgmirror.org/*
// @match        https://*rarbgmirror.org/*
// @match        http://*rarbgproxy.org/*
// @match        https://*rarbgproxy.org/*
// @match        http://*rarbgprx.org/*
// @match        https://*rarbgprx.org/*
// @match        http://*rarbgmirror.xyz/*
// @match        https://*rarbgmirror.xyz/*
// @match        http://*rarbgto.org/*
// @match        https://*rarbgto.org/*
// @match        http://*rarbgtorrents.org/*
// @match        https://*rarbgtorrents.org/*
// @match        http://*rarbg.is/*
// @match        https://*rarbg.is/*
// @match        http://*rarbgproxied.org/*
// @match        https://*rarbgproxied.org/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/370681/rarbg%20-%20improved.user.js
// @updateURL https://update.greasyfork.org/scripts/370681/rarbg%20-%20improved.meta.js
// ==/UserScript==
//debugger;

// use high quality screenshots in description page
var allimages = document.getElementsByTagName('img');
for (var j = 0; j < allimages.length; j++) {
    var currentimgsrc = allimages[j].src;

    // imagecurl.com
    if (currentimgsrc.indexOf('https://imagecurl.com/images/') != -1) {
        if (currentimgsrc.indexOf('_thumb.jpg') != -1) {
            var newimgsrc = currentimgsrc.replace('_thumb.jpg', '.jpg');
            allimages[j].setAttribute('src',newimgsrc);
        }
    }

    // imagesnake.com
    else if (currentimgsrc.indexOf('https://www.imagesnake.com/tn/t') != -1) {
        newimgsrc = currentimgsrc.replace('https://www.imagesnake.com/tn/t', 'https://www.imagesnake.com/tn/i');
        allimages[j].setAttribute('src',newimgsrc);
    }

    // imgprime.com
    else if (currentimgsrc.indexOf('https://imgprime.com/uploads/small/') != -1) {
        newimgsrc = currentimgsrc.replace('https://imgprime.com/uploads/small/', 'https://imgprime.com/uploads/big/');
        allimages[j].setAttribute('src',newimgsrc);
    }

    // imgcarry.com
    else if (currentimgsrc.indexOf('https://www.imgcarry.com/tn/t') != -1) {
        newimgsrc = currentimgsrc.replace('https://www.imgcarry.com/tn/t', 'https://www.imgcarry.com/tn/i');
        allimages[j].setAttribute('src',newimgsrc);
    }

    // pornbus.org
    else if (currentimgsrc.indexOf('https://www.pornbus.org/tn/t') != -1) {
        newimgsrc = currentimgsrc.replace('https://www.pornbus.org/tn/t', 'https://www.pornbus.org/tn/i');
        allimages[j].setAttribute('src',newimgsrc);
    }

    // imagefruit.com
    else if (currentimgsrc.indexOf('https://www.imagefruit.com/tn/t') != -1) {
        newimgsrc = currentimgsrc.replace('https://www.imagefruit.com/tn/t', 'https://www.imagefruit.com/tn/i');
        allimages[j].setAttribute('src',newimgsrc);
    }

    // imgkings.com
    else if (currentimgsrc.indexOf('https://imgkings.com/uploads/small/') != -1) {
        newimgsrc = currentimgsrc.replace('https://imgkings.com/uploads/small/', 'https://imgkings.com/uploads/big/');
        allimages[j].setAttribute('src',newimgsrc);
    }

    // imgshots.com
    else if (currentimgsrc.indexOf('https://www.imgshots.com/tn/t') != -1) {
        newimgsrc = currentimgsrc.replace('https://www.imgshots.com/tn/t', 'https://www.imgshots.com/tn/i');
        allimages[j].setAttribute('src',newimgsrc);
    }

    // 22pixx.xyz
    else if (currentimgsrc.indexOf('https://22pixx.xyz/os/') != -1) {
        newimgsrc = currentimgsrc.replace('https://22pixx.xyz/os/', 'https://22pixx.xyz/o/');
        allimages[j].setAttribute('src',newimgsrc);
    }



/* template
    //
    //
    //
    else if (currentimgsrc.indexOf('') != -1) {
        newimgsrc = currentimgsrc.replace('', '');
        allimages[j].setAttribute('src',newimgsrc);
    }
*/

    // imgking.co - effort required
    // https://imgking.co/upload/small/2015/09/03/55e885d5742b6.jpeg
    // https://imgking.co/upload/old/55/55e885d5742b6.jpeg
    //else if (currentimgsrc.indexOf('') != -1) {
    //    newimgsrc = currentimgsrc.replace('', '');
    //    allimages[j].setAttribute('src',newimgsrc);
    //}

    // freebunker.com - not working
    // https://www.freebunker.com/tn/t60952/1.jpg  small
    // https://www.freebunker.com/show/60952/1.jpg large
    //else if (currentimgsrc.indexOf('https://www.freebunker.com/tn/t') != -1) {
    //    newimgsrc = currentimgsrc.replace('https://www.freebunker.com/tn/t', 'https://www.freebunker.com/show/');
    //    allimages[j].setAttribute('src',newimgsrc);
    //}
}

// use high quality posters in the mouseover popup on the search results page
var mouseoverlinks = document.getElementsByTagName('a');
for (var k = 0; k < mouseoverlinks.length; k++) {
    if (mouseoverlinks[k].hasAttribute('onmouseover')) {
        console.log(mouseoverlinks[k].getAttribute('onmouseover'));
        var tempo = mouseoverlinks[k].getAttribute('onmouseover');
        var temp_index = tempo.indexOf('/static/over/');
        if (temp_index != -1) {
            var temp_char = tempo[temp_index + 13];
            var temp_poster = '/posters2/' + temp_char + '/';
            var tempo2 = tempo.replace('/static/over/', temp_poster);
            mouseoverlinks[k].setAttribute('onmouseover', tempo2);
            window.yoffset = -250;
        }
        else {
            window.yoffset = 10;
        }
    }
}

(function() {
    'use strict';

    var elem = document.getElementById("searchinput");
    if(typeof elem !== 'undefined' && elem !== null) {
        var query = document.querySelector("#searchinput");
        if (query) {
            query.setAttribute("tabindex", "-1");
        }

        document.getElementById("searchinput").removeAttribute("onclick");
        document.getElementById("searchinput").removeAttribute("onfocus");
        document.getElementById("searchinput").removeAttribute("onblur");
        document.getElementById('searchinput').focus();
        var searchval = document.getElementById('searchinput').getAttribute("value");
        if (searchval != "") {
            document.getElementById('searchinput').setAttribute("value", searchval + " ");
        }
        else {
            document.getElementById('searchinput').setAttribute("value", " ");
        }
    }

    var linklist = document.getElementsByClassName("tdlinkfull2");
    for (var i = 0; i < linklist.length; i++) {
        var tmphref = linklist[i].href;
        if (i == 0) {
            linklist[i].href = tmphref + "?order=seeders&by=DESC";
        }
        else if (i == 1 || i == 2 || i == 3) {
            linklist[i].href = tmphref + "&search=1080&order=seeders&by=DESC";
        }
        else {
            linklist[i].href = tmphref + "&order=seeders&by=DESC";
        }
    }

})();
