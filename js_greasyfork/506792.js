// ==UserScript==
// @name         manganato remove unwanted comic
// @namespace    http://tampermonkey.net/
// @version      2024-08-25
// @description  using indexeddb to store manganato's comic ID so next time you visit hiddden for you 
// @license      GPL-3.0-or-later
// @author       You
// @match        https://manganato.com/genre*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506792/manganato%20remove%20unwanted%20comic.user.js
// @updateURL https://update.greasyfork.org/scripts/506792/manganato%20remove%20unwanted%20comic.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    var PAGE_LIMIT = 3;
    let currentPage = 0;
    //let href_js;
    const base64ImageSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIhSURBVDjLlZPrThNRFIWJicmJz6BWiYbIkYDEG0JbBiitDQgm0PuFXqSAtKXtpE2hNuoPTXwSnwtExd6w0pl2OtPlrphKLSXhx07OZM769qy19wwAGLhM1ddC184+d18QMzoq3lfsD3LZ7Y3XbE5DL6Atzuyilc5Ciyd7IHVfgNcDYTQ2tvDr5crn6uLSvX+Av2Lk36FFpSVENDe3OxDZu8apO5rROJDLo30+Nlvj5RnTlVNAKs1aCVFr7b4BPn6Cls21AWgEQlz2+Dl1h7IdA+i97A/geP65WhbmrnZZ0GIJpr6OqZqYAd5/gJpKox4Mg7pD2YoC2b0/54rJQuJZdm6Izcgma4TW1WZ0h+y8BfbyJMwBmSxkjw+VObNanp5h/adwGhaTXF4NWbLj9gEONyCmUZmd10pGgf1/vwcgOT3tUQE0DdicwIod2EmSbwsKE1P8QoDkcHPJ5YESjgBJkYQpIEZ2KEB51Y6y3ojvY+P8XEDN7uKS0w0ltA7QGCWHCxSWWpwyaCeLy0BkA7UXyyg8fIzDoWHeBaDN4tQdSvAVdU1Aok+nsNTipIEVnkywo/FHatVkBoIhnFisOBoZxcGtQd4B0GYJNZsDSiAEadUBCkstPtN3Avs2Msa+Dt9XfxoFSNYF/Bh9gP0bOqHLAm2WUF1YQskwrVFYPWkf3h1iXwbvqGfFPSGW9Eah8HSS9fuZDnS32f71m8KFY7xs/QZyu6TH2+2+FAAAAABJRU5ErkJggg==';
    let db;
    function openDatabase() {
        return new Promise (function(resolve) {
          let request = indexedDB.open("manganato", 2);

            request.onerror = function(event) {
                console.log("Database error: " + event.target.errorCode);
            };

            request.onsuccess = function(event) {
                db = event.target.result;
                resolve(db);
            };

            request.onupgradeneeded = function(event) {
                db = event.target.result;
                resolve(db);

                if (!db.objectStoreNames.contains('hidden')) {
                    db.createObjectStore('hidden');
                }
            };
        })

}
    await openDatabase();
    function storeStringIfNotExist(db, str) {

console.log(db);
  let transaction = db.transaction(['hidden'], 'readwrite');
  let objectStore = transaction.objectStore('hidden');
  let getRequest = objectStore.get(str);

  getRequest.onsuccess = function(event) {
    if (event.target.result === undefined) {
      let addRequest = objectStore.add(str, str);

      addRequest.onsuccess = function(event) {
        console.log("String added to the database:", str);

      };

      addRequest.onerror = function(event) {
        console.log("Error adding string:", str, event.target.errorCode);
      };
    } else {
      console.log("String already exists in the database:", str);
    }
  };

  getRequest.onerror = function(event) {
    console.log("Error checking string:", str, event.target.errorCode);
  };
}
    // Select all elements with the class 'content-genres-item'
const genresItems = document.querySelectorAll('.content-genres-item');
 function StringInDatabase(db, childElements,remove_element,item) {
     let transaction = db.transaction(['hidden'], 'readwrite');
     const dataId = childElements.getAttribute('data-id');
     let objectStore = transaction.objectStore('hidden');

     let getRequest = objectStore.get(dataId);
getRequest.onsuccess= function(event) {
    if (event.target.result === undefined) {console.log("0not in db:");const img = document.createElement('img');
    img.src = base64ImageSrc;
    img.style.position = 'absolute';
    img.style.top = '0';
    img.style.right = '0';
    img.style.cursor = 'pointer';

    // Make sure the container is relatively positioned to allow absolute positioning of the image
    item.style.position = 'relative';

    // Append the image to the 'content-genres-item' element
    item.appendChild(img);

    // Add click event listeners to each child element

    //console.log(childElements)
        img.addEventListener('click', function() {

            storeStringIfNotExist(db,dataId);
            item.remove();

        });return}
     //remove_element.append(item);
         item.remove();
     }

     getRequest.onerror= function(event){
     const img = document.createElement('img');
    img.src = base64ImageSrc;
    img.style.position = 'absolute';
    img.style.top = '0';
    img.style.right = '0';
    img.style.cursor = 'pointer';

    // Make sure the container is relatively positioned to allow absolute positioning of the image
    item.style.position = 'relative';

    // Append the image to the 'content-genres-item' element
    item.appendChild(img);

    // Add click event listeners to each child element

    //console.log(childElements)
        img.addEventListener('click', function() {

            storeStringIfNotExist(db,dataId);
        });
     };



 }
let remove_element=[];
genresItems.forEach(item => {
    // Create an image element
    const childElements = item.children[0];

    StringInDatabase(db, childElements,remove_element,item)


});
    //remove_element




})();