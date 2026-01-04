// ==UserScript==
// @name Wyborcza Tweaks
// @description Zastępuje wideo przyciskiem "kliknij aby obejrzeć film", przywraca kolor górnego paska na biały.
// @namespace wyborczapl.usability
// @license MIT
// @copyright claperius https://github.com/claperius
// @version  3
// @include http://wyborcza.pl
// @include https://wyborcza.pl
// @include http://wyborcza.pl/*
// @include https://wyborcza.pl/*
// @include http://*.wyborcza.pl/*
// @include https://*.wyborcza.pl/*
// @include http://wyborcza.biz/*
// @include https://wyborcza.biz/*
// @include http://*.wysokieobcasy.pl/*
// @include http://wysokieobcasy.pl/*
// @include https://*.wysokieobcasy.pl/*
// @include https://wysokieobcasy.pl/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/381055/Wyborcza%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/381055/Wyborcza%20Tweaks.meta.js
// ==/UserScript==



function removeVideos() {
    var placeholder = document.createElement('div');
    placeholder.textContent = "Kliknij aby obejrzeć film";
    placeholder.style.setProperty("padding", "50px");
    placeholder.style.setProperty("margin", "auto");
    placeholder.style.setProperty("width", "100%");
    placeholder.style.setProperty("text-align", "center");
    placeholder.style.setProperty("border", "solid 1px #C0C0C0");
    placeholder.style.setProperty("background", "#F8F8F8");
    placeholder.style.setProperty("cursor", "pointer");

    var docs = document.getElementsByClassName('wyborcza-player');

    function onPlaceholderClick(e) {
        var num = e.currentTarget.getAttribute("number");
        docs[num].style.setProperty('display', 'block');
        e.currentTarget.remove();
    }

    for(var i=0; i< docs.length; i++) {
        var doc = docs[i];
        placeholder.setAttribute("number", i);
        placeholder.addEventListener('click', onPlaceholderClick);
        doc.after(placeholder);
        doc.style.setProperty('display', 'none');
    }
}

function bringColorsBack() {
  var wh = document.getElementById('wH_container');
  var ht = document.getElementById("wyborczaHat");

  ht.style.setProperty("color", "black");
  ht.style.setProperty("background-color", "white");

  wh.style.setProperty("color", "black");
  wh.style.setProperty("background-color", "white");
}

function changeColorsWithTimeout() {
    for (var timeout=1000; timeout <= 3000; timeout += 1000) {
        window.setTimeout(bringColorsBack, timeout);
    }
}

changeColorsWithTimeout();
removeVideos();

