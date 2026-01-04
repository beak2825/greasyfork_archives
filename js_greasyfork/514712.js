// ==UserScript==
// @name        Wider body - circle.so
// @namespace   Violentmonkey Scripts
// @match       https://*.circle.so/*
// @grant       none
// @version     1.0.2
// @author      -
// @description 3.11.2023, 14:03:41
// @license     MIT 
// @downloadURL https://update.greasyfork.org/scripts/514712/Wider%20body%20-%20circleso.user.js
// @updateURL https://update.greasyfork.org/scripts/514712/Wider%20body%20-%20circleso.meta.js
// ==/UserScript==

var observeDOM = (function(){
  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

  return function( obj, callback ){
    if( !obj || obj.nodeType !== 1 ) return;

    if( MutationObserver ){

      var mutationObserver = new MutationObserver(callback);

      mutationObserver.observe( obj, { childList:true, subtree:true });
      return mutationObserver
    }

    else if( window.addEventListener ){
      obj.addEventListener('DOMNodeInserted', callback, false);
      obj.addEventListener('DOMNodeRemoved', callback, false);
    }
  }
})();

function addSlider()
{
    if(document.getElementById('slajder'))
        return;
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.id = 'slajder';
    slider.min = 0;
    slider.max = 100;
    slider.value = 100; // Initial value
    slider.style.width = '200px';
    slider.style.display = 'inline';
    slider.style.marginTop = '6px'; // Adjust margin as needed

    // Add an event listener to update the element width when the slider value changes
    slider.addEventListener('input', function() {
        const targetElement = document.querySelector('.main.h-full.bg-secondary > div > div');
        let newWidth = this.value + '%';
        targetElement.style.width = newWidth;
    });

    // Find the target div and append the slider
    const targetDiv = document.querySelector('#root-header-v2_1 > div');// getElementById('headless-ui-popover-root');
    if (targetDiv) {
        targetDiv.appendChild(slider);
    } else {
        console.error('Target div not found!');
    }

    const darkModeStyles = `
        input[type="range"] {
            background: #555;
            height: 2px;
            border: none;
            outline: none;
            opacity: 0.7;
            transition: opacity 0.2s;
        }
        input[type="range"]:hover {
            opacity: 1;
        }
        input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 12px;
            height: 12px;
            background: #fff;
            border-radius: 50%;
            cursor: pointer;
        }
    `;

    // Add the dark mode styles to the document head
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.appendChild(document.createTextNode(darkModeStyles));
    document.head.appendChild(styleElement);
}

function makeItWider()
{
      let div = document.querySelector('.main.h-full.bg-secondary > div > div');
      if(div && div.style && div.style.width=='100%')
        return;
      if(div)
      {
        div.style.maxWidth='100%';
      }
      setTimeout(function(){
        let div = document.querySelector('.main.h-full.bg-secondary > div > div');
        if(div)
        {
          div.style.maxWidth='100%';
        }
      }, 2000);
}

function imagesNotSoBig()
{

      let divs = document.querySelectorAll('div.group.relative.mx-auto');
      if(divs)
      {
        divs.forEach(node => node.style.width = '50%');
      }
      setTimeout(function(){
        let divs = document.querySelectorAll('div.group.relative.mx-auto');
        if(divs)
        {
          divs.forEach(node => node.style.width = '50%');
        }
      }, 2000);
}

makeItWider();
addSlider();
imagesNotSoBig();
setTimeout(function() {
      observeDOM(document.body, function(m){makeItWider(); addSlider(); imagesNotSoBig(); });
  }, 3500);
