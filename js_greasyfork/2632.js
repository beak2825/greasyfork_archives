// ==UserScript==
// @name        Odkaz na soubor u prehravace na strankach CRo
// @namespace   sleep-walker.cz
// @description u prehravace uniplayer vytvori primy odkaz na prehravanou MP3
// @include     http://www.rozhlas.cz/*
// @include     https://www.rozhlas.cz/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/2632/Odkaz%20na%20soubor%20u%20prehravace%20na%20strankach%20CRo.user.js
// @updateURL https://update.greasyfork.org/scripts/2632/Odkaz%20na%20soubor%20u%20prehravace%20na%20strankach%20CRo.meta.js
// ==/UserScript==

// create URL

data_node = document.evaluate('//div[@data-type="file"]/@data-id', document, null, 9, null).singleNodeValue;
if (data_node) {
    url = 'http://media.rozhlas.cz/_audio/' + data_node.value + '.mp3';
    filename = document.evaluate('//div[@class="audio"]/p[@class="description"]', document, null, 9, null).singleNodeValue.innerHTML.replace(/\(do [0-9. ]+\)/g, "").replace(/ /g, "_").replace(/:/g, "-").replace(/_$/, "");
    audio = document.evaluate('//div[@class="audio"]/strong', document, null, 9, null).singleNodeValue;
    audio.innerHTML = "<a href=\"" + url + "\" download=\"" + filename + ".mp3\" type=\"audio/mpeg\">Audio</a>";
}
