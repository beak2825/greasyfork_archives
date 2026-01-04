// ==UserScript==
// @name         Stable Diffusion Style Shuffle Button
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a "Shuffle" anchor to Stable Diffusion Style Cheat Sheet. Users can input a seed to shuffle styles or leave blank to restore the original order. 'Active' class toggles for visual feedback.
// @author       ChatGPT in collaboration with Igor Novikov
// @match        https://supagruen.github.io/StableDiffusion-CheatSheet/*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/482391/Stable%20Diffusion%20Style%20Shuffle%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/482391/Stable%20Diffusion%20Style%20Shuffle%20Button.meta.js
// ==/UserScript==

// Begin Seedrandom library:
/*
Copyright 2019 David Bau.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/
// eslint-disable-next-line
!function(f,a,c){var s,l=256,p="random",d=c.pow(l,6),g=c.pow(2,52),y=2*g,h=l-1;function n(n,t,r){function e(){for(var n=u.g(6),t=d,r=0;n<g;)n=(n+r)*l,t*=l,r=u.g(1);for(;y<=n;)n/=2,t/=2,r>>>=1;return(n+r)/t}var o=[],i=j(function n(t,r){var e,o=[],i=typeof t;if(r&&"object"==i)for(e in t)try{o.push(n(t[e],r-1))}catch(n){}return o.length?o:"string"==i?t:t+"\0"}((t=1==t?{entropy:!0}:t||{}).entropy?[n,S(a)]:null==n?function(){try{var n;return s&&(n=s.randomBytes)?n=n(l):(n=new Uint8Array(l),(f.crypto||f.msCrypto).getRandomValues(n)),S(n)}catch(n){var t=f.navigator,r=t&&t.plugins;return[+new Date,f,r,f.screen,S(a)]}}():n,3),o),u=new m(o);return e.int32=function(){return 0|u.g(4)},e.quick=function(){return u.g(4)/4294967296},e.double=e,j(S(u.S),a),(t.pass||r||function(n,t,r,e){return e&&(e.S&&v(e,u),n.state=function(){return v(u,{})}),r?(c[p]=n,t):n})(e,i,"global"in t?t.global:this==c,t.state)}function m(n){var t,r=n.length,u=this,e=0,o=u.i=u.j=0,i=u.S=[];for(r||(n=[r++]);e<l;)i[e]=e++;for(e=0;e<l;e++)i[e]=i[o=h&o+n[e%r]+(t=i[e])],i[o]=t;(u.g=function(n){for(var t,r=0,e=u.i,o=u.j,i=u.S;n--;)t=i[e=h&e+1],r=r*l+i[h&(i[e]=i[o=h&o+t])+(i[o]=t)];return u.i=e,u.j=o,r})(l)}function v(n,t){return t.i=n.i,t.j=n.j,t.S=n.S.slice(),t}function j(n,t){for(var r,e=n+"",o=0;o<e.length;)t[h&o]=h&(r^=19*t[h&o])+e.charCodeAt(o++);return S(t)}function S(n){return String.fromCharCode.apply(0,n)}if(j(c.random(),a),"object"==typeof module&&module.exports){module.exports=n;try{s=require("crypto")}catch(n){}}else"function"==typeof define&&define.amd?define(function(){return n}):c["seed"+p]=n}("undefined"!=typeof self?self:this,[],Math);
// End Seedrandom library

/*
Copyright (c) 2023 Igor Novikov

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function() {
    'use strict';

    let originalOrder = []; // Array to store the original order
    let shuffleLink; // Reference to the shuffle link anchor element

    function saveOriginalOrder(selector) {
        const parent = document.querySelector(selector);
        if (!parent) {
            console.error('Element not found for saving original order');
            return;
        }

        // Save the original order
        originalOrder = Array.from(parent.children);
    }

    function restoreOriginalOrder(selector) {
        const parent = document.querySelector(selector);
        if (!parent) {
            console.error('Element not found for restoring original order');
            return;
        }

        // Restore the original order
        originalOrder.forEach(child => parent.appendChild(child));
    }

    function getSeed() {
        // Use the current date as the default seed, formatted as ISO date (YYYY-MM-DD)
        const defaultSeed = new Date().toISOString().split('T')[0];
        // Prompt the user to enter a seed, pre-filling it with the defaultSeed
        return prompt('Enter a seed for shuffling (leave empty to restore original order):', defaultSeed);
    }

    function shuffleStyles(selector) {
        restoreOriginalOrder(selector); // Restore the original order before shuffling

        const seed = getSeed();
        const parent = document.querySelector(selector);
        if (!parent) {
            console.error('Element not found for shuffling');
            return;
        }

        if (seed) {
            Math.seedrandom(seed);
            const children = Array.from(parent.children);

            // Shuffle using the seeded random generator
            for (let i = children.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [children[i], children[j]] = [children[j], children[i]];
            }

            // Re-insert shuffled children
            children.forEach(child => parent.appendChild(child));

            shuffleLink.classList.add('active');
        } else {
            shuffleLink.classList.remove('active');
        }
    }

    function createShuffleLink(buttonPlacementSelector, shuffleSelector) {
        const navList = document.querySelector(buttonPlacementSelector);
        if (!navList) {
            console.error('Navigation element not found for placing the button');
            return;
        }

        const li = document.createElement('li');
        shuffleLink = document.createElement('a');
        shuffleLink.innerHTML = '🔀 Shuffle'; // Unicode symbol added before the text
        shuffleLink.href = 'javascript:void(0);'; // Ensuring it doesn't navigate
        shuffleLink.addEventListener('click', function() {
            shuffleStyles(shuffleSelector);
        });

        li.appendChild(shuffleLink);
        navList.insertBefore(li, navList.firstChild); // Prepending the list item
    }

    // Initialization
    window.addEventListener('load', function() {
        saveOriginalOrder('#allthestyles'); // Save the original order on load
        createShuffleLink('nav ul', '#allthestyles'); // Create shuffle link
    });
})();
