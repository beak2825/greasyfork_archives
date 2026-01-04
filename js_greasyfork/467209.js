// ==UserScript==
// @name         manga all img on 1 page
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  This script was written for the user to be able to scroll through the images on the site without switching when you click on them.
// @author       You

// @match        1https://hentaichan.live/manga/*
// @match        https://hentaichan.live/online/*
// @match        http://hentaichan.live/online/*

// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none

// @license MIT

// @name:ru

// @downloadURL https://update.greasyfork.org/scripts/467209/manga%20all%20img%20on%201%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/467209/manga%20all%20img%20on%201%20page.meta.js
// ==/UserScript==



function removeStr(str){
    //https://hentaichan.live/manga/new
    //https://mimg4.imgschan.xyz/manganew_webp/c/1685134466_c90-kuromisa-kaijou-ikezaki-misa-niedenka-sacrifice-prince-inr4inbows/3.webp

    let substringToRemove = "_thumbs";
    let modifiedString = str.replace(substringToRemove, "");
    return modifiedString;
}

(function() {
    //alert('123');
    const divElem = document.getElementById('thumbs');
    const imgElems = divElem.querySelectorAll('img');
    imgElems.forEach(img => {
        img.src = removeStr(img.src);
        //console.log(removeStr(img.src));
        //console.log(img.src);
        // do something with each image element here
    });

    let style = document.createElement('style');
    style.innerHTML =
`

#thumbs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

#thumbs img {
  height: auto;
  width: auto;
  //width: 100%;
  //max-width: 300px; /* optional, set a maximum width for the images */
}

`;
    document.body.prepend(style);
    //alert('123');


    //let div = document.createElement('div');
    //div.className = "image-container";
    //div.innerHTML = "<button>123</button><a>Всем привет!</a> Вы прочитали важное сообщение.";

    //divElem.after(div);


    //divElem.after('<a href="123">123</a>');

    // Your code here...
})();