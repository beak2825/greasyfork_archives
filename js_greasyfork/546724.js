// ==UserScript==
// @name         Neopets - Karla's Lever of Doom Autoplayer
// @namespace    karla@neopointskarla
// @license      GPL3
// @version      0.0.1
// @description  Automatically pulls lever of doom until avatar is granted
// @author       Karla
// @match        *://*.neopets.com/space/strangelever.phtml*
// @match        *://*.neopets.com/space/leverofdoom.phtml*
// @icon         https://github.com/karlaneo/neopets-scripts/blob/main/favicon-32x32.png?raw=true
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/546724/Neopets%20-%20Karla%27s%20Lever%20of%20Doom%20Autoplayer.user.js
// @updateURL https://update.greasyfork.org/scripts/546724/Neopets%20-%20Karla%27s%20Lever%20of%20Doom%20Autoplayer.meta.js
// ==/UserScript==

let outerTimeout;
let autoplay = GM_getValue('autoplay_lod') || false;
const random_in_range = (start, end) => {
    return Math.floor(Math.random() * (end - start + 1) + start);
};

async function mainLoop() {
    if (random_in_range(1, 200) === 1) {
        if (await checkAvatar()) {
            clearTimeout(outerTimeout);
            return;
        }
    }
    if (document.querySelector('[src="//images.neopets.com/neoboards/avatars/leverofdoom.gif"]')) {
        clearTimeout(outerTimeout);
        return;
    } else if (document.querySelector('[value="Pull the Lever Anyway"]')) {
        const npOnHand = Number(document.querySelector('#npanchor').textContent.replace(/,/g, ''));
        if (npOnHand < 100) {
            clearTimeout(outerTimeout);
            alert("No Neopoints");
        } else {
            document.querySelector('[value="Pull the Lever Anyway"]').click();
        }
    } else if (document.querySelector('[href="strangelever.phtml"]')) {
        document.querySelector('[href="strangelever.phtml"]').click();
    }
}

async function checkAvatar() {
    const yourAvatars = await fetch("https://www.neopets.com/settings/neoboards/", {
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,zh-TW;q=0.6,es;q=0.5",
            "cache-control": "no-cache",
        },
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    }).then((res) => res.text());
    const parser = new DOMParser();
    const doc = parser.parseFromString(yourAvatars, "text/html");
    const avatars = Array.from(doc.querySelectorAll(".settings-avatars div")).map((el) => el.textContent);
    return avatars.indexOf('Lever of Doom') > -1;
}

(function() {
    'use strict';

    // Your code here...
    const anchor = document.querySelector('[action="leverofdoom.phtml"], [href="strangelever.phtml"]');
    const settingHTML = `
<div style="text-align: center">
  <div><b>-- Karla's Lever of Doom Autoplayer --</b></div>
  ${autoplay ? '<button style="margin-top: 10px">Stop</button>': `<button style="margin-top: 10px">Start</button>`}
</div>
`
    const div = document.createElement('div');
    div.innerHTML = settingHTML;

    div.querySelector('button').addEventListener('click', async function(event) {
        autoplay = !autoplay;
        GM_setValue('autoplay_lod', autoplay);
        event.target.value = autoplay ? 'Stop' : 'Start';
        if (autoplay) {
            if (await checkAvatar()) {
                div.querySelector('button').innerHTML = 'Avatar claimed';
                div.querySelector('button').disabled = true;
                autoplay = false;
                GM_setValue('autoplay_lod', autoplay);
                return;
            }

            setTimeout(function() { window.location.reload() }, 1000);
        } else {
            clearTimeout(timeout);
        }
    });


    if (document.querySelector('h1')?.innerHTML?.includes('Internal Server Error')) {
        setTimeout(function() { window.location.reload() }, 1000);
    }
    let timeout;

    anchor.parentNode.insertBefore(div, anchor.nextSibling);

    if (autoplay) {
        timeout = setTimeout(mainLoop, random_in_range(500, 1000));
        outerTimeout = setTimeout(function() { window.location.reload() }, 5000);
    }
})();