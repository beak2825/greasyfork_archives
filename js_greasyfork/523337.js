// ==UserScript==
// @name         Unpaywall Button
// @license       MIT
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button to archive the page on Archive.today for specific websites
// @author       Your Name
// @include      *://cnn.com/*
// @include      *://*.cnn.com/*
// @include      *://bbc.com/*
// @include      *://*.bbc.com/*
// @include      *://nytimes.com/*
// @include      *://*.nytimes.com/*
// @include      *://foxnews.com/*
// @include      *://*.foxnews.com/*
// @include      *://huffpost.com/*
// @include      *://*.huffpost.com/*
// @include      *://reuters.com/*
// @include      *://*.reuters.com/*
// @include      *://bloomberg.com/*
// @include      *://*.bloomberg.com/*
// @include      *://theguardian.com/*
// @include      *://*.theguardian.com/*
// @include      *://forbes.com/*
// @include      *://*.forbes.com/*
// @include      *://usatoday.com/*
// @include      *://*.usatoday.com/*
// @include      *://npr.org/*
// @include      *://*.npr.org/*
// @include      *://washingtonpost.com/*
// @include      *://*.washingtonpost.com/*
// @include      *://aljazeera.com/*
// @include      *://*.aljazeera.com/*
// @include      *://abcnews.go.com/*
// @include      *://*.abcnews.go.com/*
// @include      *://cbsnews.com/*
// @include      *://*.cbsnews.com/*
// @include      *://nbcnews.com/*
// @include      *://*.nbcnews.com/*
// @include      *://news.yahoo.com/*
// @include      *://*.news.yahoo.com/*
// @include      *://latimes.com/*
// @include      *://*.latimes.com/*
// @include      *://politico.com/*
// @include      *://*.politico.com/*
// @include      *://wsj.com/*
// @include      *://*.wsj.com/*
// @include      *://thehill.com/*
// @include      *://*.thehill.com/*
// @include      *://vox.com/*
// @include      *://*.vox.com/*
// @include      *://buzzfeednews.com/*
// @include      *://*.buzzfeednews.com/*
// @include      *://time.com/*
// @include      *://*.time.com/*
// @include      *://cnbc.com/*
// @include      *://*.cnbc.com/*
// @include      *://businessinsider.com/*
// @include      *://*.businessinsider.com/*
// @include      *://axios.com/*
// @include      *://*.axios.com/*
// @include      *://slate.com/*
// @include      *://*.slate.com/*
// @include      *://newyorker.com/*
// @include      *://*.newyorker.com/*
// @include      *://vanityfair.com/*
// @include      *://*.vanityfair.com/*
// @include      *://nationalreview.com/*
// @include      *://*.nationalreview.com/*
// @include      *://dailywire.com/*
// @include      *://*.dailywire.com/*
// @include      *://drudgereport.com/*
// @include      *://*.drudgereport.com/*
// @include      *://breitbart.com/*
// @include      *://*.breitbart.com/*
// @include      *://theatlantic.com/*
// @include      *://*.theatlantic.com/*
// @include      *://newyorkpost.com/*
// @include      *://*.newyorkpost.com/*
// @include      *://independent.co.uk/*
// @include      *://*.independent.co.uk/*
// @include      *://telegraph.co.uk/*
// @include      *://*.telegraph.co.uk/*
// @include      *://dailymail.co.uk/*
// @include      *://*.dailymail.co.uk/*
// @include      *://express.co.uk/*
// @include      *://*.express.co.uk/*
// @include      *://mirror.co.uk/*
// @include      *://*.mirror.co.uk/*
// @include      *://thesun.co.uk/*
// @include      *://*.thesun.co.uk/*
// @include      *://metro.co.uk/*
// @include      *://*.metro.co.uk/*
// @include      *://sky.com/*
// @include      *://*.sky.com/*
// @include      *://euronews.com/*
// @include      *://*.euronews.com/*
// @include      *://rt.com/*
// @include      *://*.rt.com/*
// @include      *://france24.com/*
// @include      *://*.france24.com/*
// @include      *://dw.com/*
// @include      *://*.dw.com/*
// @include      *://ctvnews.ca/*
// @include      *://*.ctvnews.ca/*
// @include      *://globalnews.ca/*
// @include      *://*.globalnews.ca/*
// @include      *://cbc.ca/*
// @include      *://*.cbc.ca/*
// @grant        GM.xmlHttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/523337/Unpaywall%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/523337/Unpaywall%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hostnames = [
        'archive.is',
        'archive.ph',
        'archive.today',
        'archive.fp',
        'archive.li',
        'archive.md',
        'archive.vn'
    ];

    function sleep(t) {
        return new Promise(resolve => setTimeout(resolve, t));
    }

    function checkAvailability(hostname) {
        return new Promise(function(resolve, reject) {
            const onResponse = function(response) {
                if ((response.status >= 200 && response.status <= 400) || response.status === 429) {
                    resolve(response);
                } else {
                    reject(new Error('HOST_UNAVAILABLE'));
                }
            };
            GM.xmlHttpRequest({
                url: `https://${hostname}/`,
                method: 'GET',
                headers: {
                    Range: 'bytes=0-63'
                },
                onload: onResponse,
                onerror: onResponse
            });
        });
    }

    async function archivePage(url) {
        let workingHostname = null;
        for (const hostname of hostnames) {
            try {
                await checkAvailability(hostname);
                workingHostname = hostname;
                break;
            } catch (err) {
                if (err && 'message' in err && err.message === 'HOST_UNAVAILABLE') {
                    console.debug(`${hostname} is NOT available`);
                } else {
                    throw err;
                }
            }
        }

        if (workingHostname) {
            document.location.href = `https://${workingHostname}/?run=1&url=${encodeURIComponent(url)}`;
        } else {
            alert('All Archive.today domains seem to be down.');
        }
    }

    function createButton() {
        const button = document.createElement('button');
        button.innerText = 'Unpaywall';
        button.style.position = 'fixed';
        button.style.bottom = '10px';
        button.style.right = '10px';
        button.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.padding = '10px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '10000';
        button.style.opacity = '0.8';

        button.addEventListener('click', () => archivePage(window.location.href));

        document.body.appendChild(button);
    }

    function main() {
        console.log('Unpaywall script running');
        createButton();
    }

    main();
})();
