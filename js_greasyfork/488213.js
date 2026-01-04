// ==UserScript==
// @name         GC - Missing Gourmet Gallery
// @namespace    https://greasyfork.org/en/users/1202961-twiggies
// @version      1.0
// @description  For churejinha. Displays missing gourmet from the gallery.
// @author       Twiggies
// @match        https://www.grundos.cafe/gallery/edit/items/?gallery_id=2859
// @match        https://www.grundos.cafe/gallery/edit/items/?gallery_id=393
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488213/GC%20-%20Missing%20Gourmet%20Gallery.user.js
// @updateURL https://update.greasyfork.org/scripts/488213/GC%20-%20Missing%20Gourmet%20Gallery.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const gourmetUrl = `https://raw.githubusercontent.com/rowanberryyyy/gc-gourmets-helper/main/gourmets.json`

    const textToHTML = (text) => new DOMParser().parseFromString(text, "text/html");

    const getGalleryItems = (node = document) =>
      Array.from(node.querySelectorAll('div.gallery_item div:nth-child(2) > strong:nth-child(1)')).map(e => e.textContent.trim().replace(" (","").toUpperCase())

    const filterObtainedItems = (listOfItems, itemsObtained) => {
        let filteredList = listOfItems.filter(([name,_]) => !itemsObtained.includes(name.toUpperCase()));
        return filteredList;
    }

    // callback to sort items by rarity
    const byRarity = ([_,rarity1],[__,rarity2]) => rarity1 - rarity2

    const html = (gourmet) => `<div class="items-to-obtain" style="padding-left: 2em;">
<h3 style="text-align: center">Your gallery has ${gourmet.length} gourmet left to obtain.</h3>
<ul style="columns: 2">
${
    gourmet.sort(byRarity).map(([name, rarity]) => `<li><span style="user-select:all">${name}</span> (<b>r${rarity})</b>
  <a href="/market/wizard/?query=${name}" target="_itemSearch"><img width="20px" src="https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/misc/wiz.png">
<a href="/island/tradingpost/browse/?query=${name}" target="_itemSearch"><img width="20px" src="https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/misc/tp.png"></a>
    <a href="/search/items/?item_name=${name}" target="_itemSearch"><img width="15px" src="https://grundoscafe.b-cdn.net/alerts/basic/mpic.png"></a></a>
    </li>`).join("")
    }
</ul>
</div>`;

    async function main() {
        const listofGourmet = await fetch(gourmetUrl).then(res => res.json())
        const galleryItems = await fetch("https://www.grundos.cafe/gallery/view/?username=Churejinha&gallery_id=393")
        .then((res) => res.text())
        .then(textToHTML)
        .then(getGalleryItems);
        console.log(listofGourmet);
        console.log(galleryItems);
        const toGet = filterObtainedItems(listofGourmet, galleryItems)
        document.querySelector("#page_content").insertAdjacentHTML("beforeend", html(toGet))
    }

    main().then()
})();