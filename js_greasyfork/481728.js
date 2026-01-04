// ==UserScript==
// @name     Reddit NSFW Blur Remover
// @version  5.1
// @grant    none
// @include https://www.reddit.com/r/*
// @description Remove NSFW blur.
// @namespace https://greasyfork.org/users/803889
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481728/Reddit%20NSFW%20Blur%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/481728/Reddit%20NSFW%20Blur%20Remover.meta.js
// ==/UserScript==
document.addEventListener('readystatechange', e => {
    try {
        if (document.querySelectorAll('shreddit-blurred-container div') != null) {
            Array.from(document.querySelectorAll('shreddit-blurred-container div')).forEach(button=>button.click())
        }
    } catch (error){
        if (error instanceof TypeError) {
            console.log('Inital content unblur not working');
        }
    }
  });

window.addEventListener('scroll', function(event) {
    //un-blur all
    try {
        if (document.querySelectorAll('shreddit-blurred-container div') != null) {
            Array.from(document.querySelectorAll('shreddit-blurred-container div')).forEach(button=>button.click())
        }
    } catch (error){
        if (error instanceof TypeError) {
            console.log('Scroll unblur not working');
        }
    }
})

let debug=false
let interval_documentHidden = setInterval(function () {
        if (!document.hidden) {
            if(document.readyState === 'complete') {
                
                //+18 Banner
                try{
                    //Partial Blur
                    document.querySelector('shreddit-experience-tree').shadowRoot.querySelector('shreddit-async-loader').querySelector('xpromo-nsfw-bypassable-modal-desktop').shadowRoot.querySelector('#secondary-button span [class="flex items-center gap-xs"]').click()
                }catch{if(debug){console.log('Partial Blur Not Found')}}
                try{
                    //Full Blur
                    document.querySelector('shreddit-app').querySelector('div:nth-child(4) confirm-over-18').querySelector('button').click()
                }catch{if(debug){console.log('Full Blur Not Found')}}
                
                

                //Google Banner
                try{
                    //Home Page
                    document.querySelector('iframe').remove()
                }catch{if(debug){console.log('Home Page Not Found')}}
                try{
                    //Comments Page
                    document.querySelector('#credential_picker_container').remove()
                }catch{if(debug){console.log('Comments Page Not Found')}}
                clearInterval(interval_documentHidden)
                console.log('"Reddit NSFW Blur Remover" - script complete')
            }
        }
}, 1000);