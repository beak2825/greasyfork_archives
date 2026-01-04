// ==UserScript==
// @name         Pixelmon Wiki Picture
// @namespace    Pixelmon Wiki
// @version      0.2
// @description  Shows pictures of pokemon in the pixelmon wiki!
// @author       AxizY
// @match        https://pixelmonmod.com/wiki/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410766/Pixelmon%20Wiki%20Picture.user.js
// @updateURL https://update.greasyfork.org/scripts/410766/Pixelmon%20Wiki%20Picture.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var loaded= true;
    window.onload = function() {
        if(!loaded) return;
        loaded = false;
                setTimeout( function(){ picture(); }, 1000);
    }
    function picture() {
        var checkPoke = new XMLHttpRequest();
        checkPoke.onreadystatechange = function() {
            if (checkPoke.readyState == 4 && checkPoke.status == 200) {
                if (checkPoke.responseText.search(document.getElementsByClassName('banner-text')[0].innerText) != -1) {
                    const newDiv = document.createElement("IMG");
                    newDiv.setAttribute("src", "https://img.pokemondb.net/artwork/large/"+document.getElementsByClassName('banner-text')[0].innerText.toLowerCase()+".jpg")
                    newDiv.setAttribute("style", "width: 25%; height: 25%");
                    newDiv.setAttribute("class", "pokeImage")
                    document.getElementsByClassName("wikitable")[0].parentNode.insertBefore(newDiv, document.getElementsByClassName("wikitable")[0]);
                }
            }
        }
        checkPoke.open("GET", 'https://gist.githubusercontent.com/AxizY/02717a64ce70ca4439ded82c5cd1d1cc/raw/d54ae9cd0cdac68ed6b2c828e997fbeb9dfa80e0/Pokemon', true);
        checkPoke.send(null);
        var i = 0
        var z = 0
        try {
            for (z = 0; z < document.getElementsByClassName('wikitable sortable jquery-tablesorter').length; z++) {
                for (i = 0; i < document.getElementsByClassName('wikitable sortable jquery-tablesorter')[z].childNodes[2].children.length; i++) {
                    const newDiv = document.createElement("IMG");
                    newDiv.setAttribute("src", "https://raw.githubusercontent.com/msikma/pokesprite/master/pokemon-gen8/regular/"+document.getElementsByClassName('wikitable sortable jquery-tablesorter')[z].childNodes[2].children[i].children[0].innerText.toLowerCase()+".png")
                    newDiv.setAttribute("style", "width: 75%; height: 175%");
                    document.getElementsByClassName('wikitable sortable jquery-tablesorter')[z].childNodes[2].children[i].children[0].children[0].parentNode.insertBefore(newDiv, document.getElementsByClassName('wikitable sortable jquery-tablesorter')[z].childNodes[2].children[i].children[0].children[0]);
                }
            }
        } catch (error) {
            return
        }
    }
})();