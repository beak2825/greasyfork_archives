// ==UserScript==
// @name         Redirect Medium URLs
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Add a button at the beginning of the body on medium.com to redirect to a modified URL
// @author       Dev Goyal
// @match        *://*/*
// @grant        none

// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/492567/Redirect%20Medium%20URLs.user.js
// @updateURL https://update.greasyfork.org/scripts/492567/Redirect%20Medium%20URLs.meta.js
// ==/UserScript==

(function() {
    'use strict';

        // Add CSS styles
    var cssLink = document.createElement("link");
    cssLink.href = "https://unpkg.com/@highlightjs/cdn-assets@11.8.0/styles/atom-one-dark.min.css";
    cssLink.rel = "stylesheet";
    cssLink.type = "text/css";
    
    // Add LazyLoad script
    var lazyLoadScript = document.createElement("script");
    lazyLoadScript.src = "https://cdn.jsdelivr.net/npm/vanilla-lazyload@17.8.4/dist/lazyload.min.js";
    
    // Add Lightense script
    var lightenseScript = document.createElement("script");
    lightenseScript.src = "https://cdn.jsdelivr.net/npm/lightense-images@1.0.17/dist/lightense.min.js";
    
    
    // Add Tailwind CSS script
    var tailwindCssScript = document.createElement("script");
    tailwindCssScript.src = "https://cdn.tailwindcss.com";
    
    // Add Tailwind CSS plugins script
    var tailwindPluginsScript = document.createElement("script");
    tailwindPluginsScript.src = "https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio";
    
    // Add Medium Glyph stylesheet
    var mediumGlyphLink = document.createElement("link");
    mediumGlyphLink.href = "https://glyph.medium.com/css/unbound.css";
    mediumGlyphLink.rel = "stylesheet";
    
    
    // Function to check if the page is on Medium
    function isMedium() {
        var metaTags = document.querySelectorAll('meta[name="twitter:app:name:iphone"]');
        return metaTags.length > 0 && metaTags[0].getAttribute('content') === 'Medium';
    }
    

      // Function to fetch and scrape data from the provided URL
    async function scrapeDataFromUrl(url, selector = ".w-full .text-xl w-full .text-gray-800 .leading-normal") {
        try {
           // const response = await fetch(`https://scrap.torrentdev.workers.dev/?url=${encodeURIComponent(url)}&selector=${encodeURIComponent(selector)}`);
            //const data = await response.json();
            //return data.result[1];

            const response = await fetch("https://quizhive.cybranceehost.com/medium.php?url=" + encodeURIComponent(url));
            const data = await response.text();
            return data;
        } catch (error) {
            console.error('Error scraping data:', error);
            return '';
        }
    }

    function removeIframesWithUrl(htmlString, urlToRemove) {
        // Create a new temporary div element
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlString;

        // Get all iframe elements
        var iframes = tempDiv.querySelectorAll('iframe');
        
        // Iterate through each iframe and remove if the src matches the specified URL
        iframes.forEach(function(iframe) {
            if (iframe.src && iframe.src.includes(urlToRemove)) {
                iframe.parentNode.removeChild(iframe);
            }
        });

        return tempDiv.innerHTML;
    }
    
    // Check if the current page is Medium
    async function replaceData(url){
        if(!document.querySelector('.meteredContent').innerHTML.includes("Member-only story")){
            return;
        }
        document.querySelector('.meteredContent').innerHTML = `<center><img src="https://blog.motionisland.com/wp-content/uploads/2022/03/Loading_1.gif" width="30%"></center>`;
        var data = await scrapeDataFromUrl(url);
       // var html = data.innerHTML.replace("&lt; Go to the original","");
        var html = data.replace("&lt; Go to the original","");
        html = html.replaceAll("data-src","src");
        html = removeIframesWithUrl(html);
        html = `<div class="container w-full md:max-w-3xl mx-auto pt-20 break-words text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-800" bis_skin_checked="1">
        <div class="w-full px-4 md:px-6 text-xl text-gray-800 dark:text-gray-100 leading-normal" style="font-family:Georgia,serif;" bis_skin_checked="1">
        ${html} </div></div>`;
        
        document.querySelector('.meteredContent').innerHTML = html;
    }
    
    if (isMedium()) {
        document.head.appendChild(tailwindCssScript);
        document.head.appendChild(cssLink);
        document.head.appendChild(lazyLoadScript);
        document.head.appendChild(lightenseScript);
        document.head.appendChild(tailwindPluginsScript);
        document.head.appendChild(mediumGlyphLink);
        // Create a button element
        var redirectButton = document.createElement('button');
        redirectButton.textContent = 'Read on Medium-Free';
        redirectButton.style.position = 'fixed';
        redirectButton.style.top = '20px';
        redirectButton.style.left = '20px';
        redirectButton.style.zIndex = '9999';
        redirectButton.style.padding = '10px';
        redirectButton.style.backgroundColor = '#007bff';
        redirectButton.style.color = '#fff';
        redirectButton.style.border = 'none';
        redirectButton.style.borderRadius = '5px';
        redirectButton.style.cursor = 'pointer';

        // Get the current URL
        var currentUrl = window.location.href;

        // Modify the URL
        var redirectUrl = currentUrl;
        //var redirectUrl = "https://medium-free.vercel.app/read?url=" + encodeURIComponent(currentUrl);
        replaceData(redirectUrl);

        // Add click event listener to redirect the page
        redirectButton.addEventListener('click', function() {
            window.location.href = redirectUrl;
        });

        // Add the button to the body
       // document.body.appendChild(redirectButton);
    }
})();
