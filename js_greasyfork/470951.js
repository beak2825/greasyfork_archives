// ==UserScript==
// @name         picture gallery for krisha.kz
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  The desc
// @author       You
// @match https://krisha.kz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=krisha.kz
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470951/picture%20gallery%20for%20krishakz.user.js
// @updateURL https://update.greasyfork.org/scripts/470951/picture%20gallery%20for%20krishakz.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //document.querySelector(".search-section").innerHTML += "<style>.logo-gallery-itemdd:hover {    position: fixed;     bottom: 0;     width: 40vw !important;     height: 40vh  !important;     left: 0;}</style>"
    document.querySelector(".search-section").innerHTML += "<style>.logo-gallery-item:hover { z-index: 9 !important; transform: scale(5);    transform-origin: bottom left;   }</style>"
    document.querySelector(".search-section").innerHTML += "<style>.logo-gallery-item-left:hover { z-index: 9 !important; transform: scale(5);    transform-origin: bottom left;   }</style>"
    document.querySelector(".search-section").innerHTML += "<style>.logo-gallery-item-right:hover { z-index: 9 !important; transform: scale(5);    transform-origin: bottom right;   }</style>"

    async function showPhotosFromItem(item){
        const id = item.dataset.id;
        const pageText = await fetch("https://krisha.kz/a/show/"+id).then(res=>res.text())
        const pictures = [...pageText.split("gallery__small-list")[1].split("</ul>")[0].matchAll(/src="(.*)"/g)].map(x=>x[1])
        console.log(pageText);
        console.log(pictures);

        const pic = item.querySelector("picture")
        const firstPhotoUrl = pic.dataset.fullSrc
        const urlTemplate = firstPhotoUrl.replace(/\/(.|..)-full/, "/__NUM__-full")
        //const logotipiwe = document.querySelector(".search-section").innerHTML += '<div id="logotipiwe" style="position: fixed;display:flex;height: 20vh;width: 100vw;background-color:rgba(0,0,0,0.5);top: 80vh;left:0;z-index:2"></div>'
        const logotipiwe = document.querySelector('footer').innerHTML += '<div id="logotipiwe" style="position: fixed;display:flex;height: 20vh;width: 100vw;background-color:rgba(0,0,0,0.5);top: 80vh;left:0;z-index:9999999"></div>'

        const gallery = document.querySelector('#logotipiwe')

        pictures.forEach((url, i)=>{
            const img = document.createElement("div")
            img.className = "logo-gallery-item"
            img.className += i > 3 ? " logo-gallery-item-right" : " logo-gallery-item-left"
            img.style = "height: 20vh;    display: flex;     width: 260px;     z-index: 99999999;  background-size: contain;     background-position: center;     background-repeat: no-repeat;"
            //const photoUrl = urlTemplate.replace("__NUM__", i+1)
            //url = url.replace("120x90", "750x470")
            url = url.replace("120x90", "full")
            img.style.backgroundImage = "url("+url+")"
            gallery.appendChild(img)
        })
    }

    window.addEventListener('click', async e=>{
        const target = e.target
        if(target.closest('#logotipiwe')){
            document.querySelector('#logotipiwe').remove()
        }
        const closestApartsPicture = target.closest(".a-map-sidebar-item__image")
        if(closestApartsPicture){
            const gallery = document.querySelector('#logotipiwe')
            if(gallery) gallery.remove()
            e.preventDefault();
            const item = target.closest(".a-map-sidebar-item");
            await showPhotosFromItem(item)
            return;
        }
        return
        try{
            const gallery = document.querySelector('#logotipiwe')
            if(gallery) gallery.remove()

            setTimeout(async ()=>{
                const b = document.querySelector(".map-balloon")
                //const apartsId = b.querySelector(".cluster-list").children[0].dataset.id; //IF MANY IN THE BALLOON
                await showPhotosFromItem(b.children[0])
                //const apartsId = b.children[0].dataset.id;
            }, 1000)
        } catch (e){
            console.error(e)
        }
    })
})();