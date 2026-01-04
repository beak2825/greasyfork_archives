
 // ==UserScript==

// @name SJVA IMAGE LOADER
// @namespace    SJVA-TOOL
// @version      1.1
// @description SJVA 이미지 로드

// @include *://192.168.0.56/*
// @downloadURL https://update.greasyfork.org/scripts/418247/SJVA%20IMAGE%20LOADER.user.js
// @updateURL https://update.greasyfork.org/scripts/418247/SJVA%20IMAGE%20LOADER.meta.js
// ==/UserScript==
console.log('start');


var images = document.querySelector('#list_div').getElementsByTagName('img')
var target = document.getElementById('page1');
var update = 0;
var index = 0;
var observer = new MutationObserver(function(mutations) 
    { 
    mutations.forEach(function(mutation) 
    {
        clearInterval(update);
        console.log('page chg');
        index = 0;
        update = setTimeout(updateImage, 1000);
    }); 
}); 
var config = {
    attributes: true, 
    childList: true, 
    characterData: true
}; 

function updateImage() {
    try
    {
        if(index == images.length)
        {
            return;
        }
        console.log(index);
        if(images[index].width == images[index].height)
        {
            console.log('load Image:' + index);
            images[index].src = images[index].src;
            if(images[index].width == images[index].height)
            {
                index -= 1;
            }
        }
        index += 1;

        update = setTimeout(updateImage, 800);
        console.log('end');
    }catch(e) {console.log(e);return;}
}


observer.observe(target, config);