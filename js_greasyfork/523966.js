// ==UserScript==
// @name         SankakuComplex - Click on the image to download
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Open the image in its best version
// @author       mtpontes
// @match       *://chan.sankakucomplex.com/posts/*
// @match       *://chan.sankakucomplex.com/*/posts/*
// @match       *://idol.sankakucomplex.com/posts/*
// @match       *://idol.sankakucomplex.com/*/posts/*
// @match       *://legacy.sankakucomplex.com/posts/*
// @match       *://legacy.sankakucomplex.com/*/posts/*
// @grant        none
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABbmlDQ1BpY2MAACiRdZHPKwRhGMc/dolYbeIgOewBOeyWKDlqFZflsFZZXGZmZ3fVzphmZpNclYuDchAXvw7+A67KlVKKlOTgL/DrIo3n3VUr8U7vPJ++7/t9et/vC6FUybC8+gGwbN9NTyRjs9m5WOMTETpoox00w3Mmp8cz/Dveb6hT9Tqhev2/78/RkjM9A+qahIcNx/WFR4VTy76jeEO4wyhqOeF94bgrBxS+ULpe5UfFhSq/KnYz6TEIqZ6xwg/Wf7BRdC3hfuEeq1Q2vs+jbhIx7ZlpqV0yu/FIM0GSGDplFinhk5BqS2Z/+wYqvimWxGPI32EFVxwFiuKNi1qWrqbUvOimfCVWVO6/8/TyQ4PV7pEkNDwEwUsvNG7B52YQfBwEwechhO/hzK75lySnkTfRN2tazx5E1+DkvKbp23C6Dp13juZqFSksM5TPw/MxtGah/Qqa56tZfa9zdAuZVXmiS9jZhT7ZH134ArhcZ+m/WStSAAAACXBIWXMAAAsSAAALEgHS3X78AAAAeElEQVQ4y2NgoCX4Xyb7H4TxqWHCo7keG5toA4CgAQebsAHYbMTlCiYibMfrCiZibcIlx0SE3/GGBRM+Gxi7HjeCMD41TESGPE5XMOGzHRsbnxcIxbsDDAMts4cbjmR7A4kpvQHkMiZCKY1QSmXBZTKedNBA1RwLAFCeNCTVhz2FAAAAAElFTkSuQmCC
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523966/SankakuComplex%20-%20Click%20on%20the%20image%20to%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/523966/SankakuComplex%20-%20Click%20on%20the%20image%20to%20download.meta.js
// ==/UserScript==

function imageComponent(principalImage, originalImage, fileName) {
    principalImage.addEventListener('click', async (event) => {
        const image = await fetch(originalImage.href)
        const imageBlog = await image.blob()
        const imageURL = URL.createObjectURL(imageBlog)

        const link = document.createElement('a')
        link.href = imageURL
        link.download = fileName

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    })
}

(function() {
    'use strict';

    const principalImage = document.getElementById('image')
    const originalImage = document.getElementById('highres');
    const filehref = originalImage.href
    const [fileName, fileExtension] = filehref
        .slice(filehref.lastIndexOf('/') + 1)
        .split('?')[0]
        .split('.');
    console.log(`~~ Valores resgatados: ${fileName}, ${fileExtension}`)

    const allowedExtensions = ['jpg', 'jpeg', 'png']
    if (allowedExtensions.includes(fileExtension.toLowerCase())) {
        imageComponent(principalImage, originalImage, fileName)
    }
})();