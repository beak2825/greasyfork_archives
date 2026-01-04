// ==UserScript==
// @name         Anime-Sharing Premium Link Converter
// @version      1.1
// @grant        GM.xmlHttpRequest
// @include      https://www.anime-sharing.com/forum/*
// @description  Convert standard links into premium links using Real-Debrid
// @author       JawGBoi
// @license      MIT
// @namespace https://greasyfork.org/users/1121647
// @downloadURL https://update.greasyfork.org/scripts/470442/Anime-Sharing%20Premium%20Link%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/470442/Anime-Sharing%20Premium%20Link%20Converter.meta.js
// ==/UserScript==

const authorization = '' // <- PUT YOUR BEARER AUTHENTICATION STRING INSIDE THE QUOTES - IMPORTANT!!!

const targetURLs = ['katfile.com/', 'rapidgator.net/file/', 'ddownload.com/'];

function createFastDownloadButton(linkElement, fileURL) {
    let button = document.createElement('button');
    button.innerHTML = 'Get Premium Link';
    button.style.marginLeft = '2px'; // Add space to the left of the button
    button.onclick = () => {
        GM.xmlHttpRequest({
            method: 'POST',
            url: 'https://app.real-debrid.com/rest/1.0/unrestrict/link',
            headers:
            {
                "authorization": `Bearer ${authorization}`
            },
            data: `link=${encodeURIComponent(fileURL)}&password=`,
            onload: (response) => {
                const jsonData = JSON.parse(response.responseText);
                if (jsonData.download !== undefined)
                {
                    linkElement.href = jsonData.download;
                    linkElement.text = jsonData.filename;
                }
                else
                {
                    linkElement.text += ' - failed';
                }
                button.remove();
            }
        });
    };
    linkElement.setAttribute('processed', 'true');
    linkElement.insertAdjacentElement('afterend', button);
}

function observeLinks() {
    let links = document.getElementsByTagName('a');
    for (let i = 0; i < links.length; i++)
    {
        let link = links[i];
        if (link.getAttribute('processed'))
        {
            continue;
        }
        for (let targetURL of targetURLs)
        {
            if (link.href.includes(targetURL))
            {
                createFastDownloadButton(link, link.href);
            }
        }
    }
}

// Observe the document body for changes
const observer = new MutationObserver(observeLinks);
observer.observe(document.body, { childList: true, subtree: true });

// Also observe the links when the page first loads
window.onload = observeLinks;
