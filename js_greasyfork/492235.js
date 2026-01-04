// ==UserScript==
// @name         geek dark mode
// @name:zh-CN   极客夜间模式
// @description  dark mode
// @description:zh-cn 夜间模式
// @version      1.1
// @author       Anc
// @match        *://*/*
// @exclude 	 *://*localhost*
// @exclude 	 *://*127.0.0.1*
// @run-at	 document.start
// @grant        GM.addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @noframes
// @namespace https://greasyfork.org/users/61607
// @downloadURL https://update.greasyfork.org/scripts/492235/geek%20dark%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/492235/geek%20dark%20mode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Add meta tag
    let meta = document.createElement('meta');
    meta.name = "theme-color";
    meta.content = "#000";
    meta.media = "(prefers-color-scheme: dark)";
    document.head.append(meta);

    function unsetFilter() {
        var elements = document.getElementsByTagName('*');
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.filter = 'unset';
        }
    }

    // Function to create a button
    function createButton() {
        var button = document.createElement('button');
        button.textContent = 'White';

        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.padding = '10px';
        button.style.backgroundColor = '#007bff';
        button.style.color = '#ffffff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '999';

        document.body.appendChild(button);

        button.addEventListener('click', unsetFilter);
    }


    // Function to add the current website's domain to the array and save it
    function addDomainToArray() {
        var domain = window.location.hostname;
        var trackedDomains = GM_getValue('trackedDomains', []);

        // Check if domain already exists in the array
        var index = trackedDomains.indexOf(domain);
        if ( index === -1) {
            trackedDomains.push(domain);
            GM_setValue('trackedDomains', trackedDomains);
            console.log('Domain ' + domain + ' added to tracking list.');
            unsetFilter();
        } else {
            console.log('Domain ' + domain + ' is already in tracking list， remove it.');
            trackedDomains.splice(index, 1);
            GM_setValue('trackedDomains', trackedDomains);
            console.log("trackedDomains", trackedDomains);
            checkDomain();
        }
    }

    // Function to check if the current domain is in the array and alert if so
    function checkDomain() {
        var domain = window.location.hostname;
        var trackedDomains = GM_getValue('trackedDomains', []);
        console.log("trackedDomains", trackedDomains);

        if (trackedDomains.indexOf(domain) === -1){
            console.log('dark domain: ' + domain);

            // Add style
            GM.addStyle(`
                @media (prefers-color-scheme: dark) {
                :root {
                        filter: invert(1) hue-rotate(180deg);
                    }
	            figure,img,video,iframe,div[style*=image]{
                        filter: invert(1) hue-rotate(180deg);
                        opacity:1;
                    }

                figure img {
                        filter: unset;
                    }
                }
            `)

            if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                createButton();
            }

        }
    }

    // Register a menu command to add the current domain to the tracking list
    GM_registerMenuCommand('Add/Reomove', addDomainToArray);

    // Check the domain when the page loads
    checkDomain();
})();