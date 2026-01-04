// ==UserScript==
// @name         Neopets - Karla's TVW Auto Void Essence Collector
// @namespace    karla@neopointskarla
// @license      GPL3
// @version      0.0.4
// @description  Collects all void essence with one click!
// @author       Karla
// @match        *://*.neopets.com/tvw*
// @icon         https://github.com/karlaneo/neopets-scripts/blob/main/favicon-32x32.png?raw=true
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/544977/Neopets%20-%20Karla%27s%20TVW%20Auto%20Void%20Essence%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/544977/Neopets%20-%20Karla%27s%20TVW%20Auto%20Void%20Essence%20Collector.meta.js
// ==/UserScript==

const maps = [
    {
        "url": "https://www.neopets.com/altador/index.phtml",
        "map": "Altador"
    },
    {
        "url": "https://www.neopets.com/medieval/brightvale.phtml",
        "map": "Brightvale"
    },
    {
        "url": "https://www.neopets.com/medieval/index_evil.phtml",
        "map": "Darigan Citadel"
    },
    {
        "url": "https://www.neopets.com/faerieland/faeriecity.phtml",
        "map": "Faerie City"
    },
    {
        "url": "https://www.neopets.com/faerieland/index.phtml",
        "map": "Faerieland"
    },
    {
        "url": "https://www.neopets.com/halloween/index.phtml",
        "map": "Haunted Woods"
    },
    {
        "url": "https://www.neopets.com/worlds/index_kikolake.phtml",
        "map": "Kiko Lake"
    },
    {
        "url": "https://www.neopets.com/pirates/index.phtml",
        "map": "Krawk Island"
    },
    {
        "url": "https://www.neopets.com/moon/index.phtml",
        "map": "Kreludor"
    },
    {
        "url": "https://www.neopets.com/tropical/index.phtml",
        "map": "Lutari Island"
    },
    {
        "url": "https://www.neopets.com/water/index.phtml",
        "map": "Maraqua"
    },
    {
        "url": "https://www.neopets.com/medieval/index_farm.phtml",
        "map": "Meri Acres Farms"
    },
    {
        "url": "https://www.neopets.com/medieval/index.phtml",
        "map": "Meridell"
    },
    {
        "url": "https://www.neopets.com/medieval/index_castle.phtml",
        "map": "Meridell Castle"
    },
    {
        "url": "https://www.neopets.com/magma/caves.phtml",
        "map": "Moltara Caves"
    },
    {
        "url": "https://www.neopets.com/magma/index.phtml",
        "map": "Moltara City"
    },
    {
        "url": "https://www.neopets.com/island/index.phtml",
        "map": "Mystery Island"
    },
    {
        "url": "https://www.neopets.com/objects.phtml",
        "map": "Neopia Central"
    },
    {
        "url": "https://www.neopets.com/market_bazaar.phtml",
        "map": "Neopian Bazaar"
    },
    {
        "url": "https://www.neopets.com/market_map.phtml",
        "map": "Neopian Marketplace"
    },
    {
        "url": "https://www.neopets.com/market_plaza.phtml",
        "map": "Neopian Plaza"
    },
    {
        "url": "https://www.neopets.com/halloween/neovia.phtml",
        "map": "Neovia"
    },
    {
        "url": "https://www.neopets.com/desert/qasala.phtml",
        "map": "Qasala"
    },
    {
        "url": "https://www.neopets.com/worlds/index_roo.phtml",
        "map": "Roo Island"
    },
    {
        "url": "https://www.neopets.com/desert/sakhmet.phtml",
        "map": "Sakhmet"
    },
    {
        "url": "https://www.neopets.com/shenkuu/index.phtml",
        "map": "Shenkuu"
    },
    {
        "url": "https://www.neopets.com/winter/index.phtml",
        "map": "Terror Mountain: Happy Valley"
    },
    {
        "url": "https://www.neopets.com/winter/icecaves.phtml",
        "map": "Terror Mountain: Ice Caves"
    },
    {
        "url": "https://www.neopets.com/winter/terrormountain.phtml",
        "map": "Terror Mountain: Top of the Mountain"
    },
    {
        "url": "https://www.neopets.com/halloween/index_fair.phtml",
        "map": "The Deserted Fairground"
    },
    {
        "url": "https://www.neopets.com/worlds/index_geraptiku.phtml",
        "map": "The Lost City of Geraptiku"
    },
    {
        "url": "https://www.neopets.com/desert/index.phtml",
        "map": "The Lost Desert"
    },
    {
        "url": "https://www.neopets.com/water/index_ruins.phtml",
        "map": "The Ruins of Maraqua"
    },
    {
        "url": "https://www.neopets.com/prehistoric/index.phtml",
        "map": "Tyrannia"
    },
    {
        "url": "https://www.neopets.com/prehistoric/plateau.phtml",
        "map": "Tyrannian Plateau"
    },
    {
        "url": "https://www.neopets.com/space/hangar.phtml",
        "map": "Virtupets Space Station: Hangar"
    },
    {
        "url": "https://www.neopets.com/space/recreation.phtml",
        "map": "Virtupets Space Station: Recreation Deck"
    },
    {
        "url": "https://www.neopets.com/space/index.phtml",
        "map": "Virtupets Space Station: Supply Deck"
    },
    {
        "url": "https://www.neopets.com/pirates/warfwharf.phtml",
        "map": "Warf Wharf"
    }
];

const sleep = (time) =>
  new Promise((resolve) => setTimeout(resolve, time));

const random_in_range = (start, end) => {
  return Math.floor(Math.random() * (end - start + 1) + start);
};


async function autoCollect(mapData) {
    const statusEl = document.querySelector('#k-status');
    let jellyneoLinks = [];
    try {
        statusEl.innerHTML = 'Attempting to load maps from jellyneo...';
        jellyneoLinks = await new Promise(function(resolve, reject) {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://www.jellyneo.net/?go=the_void_within&id=essence_collection#locations",
                onload: function(response) {
                    const div = document.createElement('div');
                    div.innerHTML = response.responseText;
                    resolve([...div.querySelectorAll('.alert-box a[href^="https://www.neopets.com"]')].map(n => n.href));
                },
                onerror: function(err) {
                    reject();
                },
            });
        });
    } catch (e) {
        console.log(e);
        statusEl.innerHTML = 'Load from jellyneo failed, checking all maps...';
    }
    if (jellyneoLinks.length > 0) {
        statusEl.innerHTML = 'Load from jellyneo successful, only checking maps with void essence';
        mapData = mapData.filter(({ url }) => jellyneoLinks.indexOf(url) > -1);
    }
    try {
        for (let i = 0; i < mapData.length; i += 1) {
            const { url, map } = mapData[i];
            statusEl.innerHTML = `Checking ${map}...`;
            const res = await fetch(url, {
                "headers": {
                    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                    "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,zh-TW;q=0.6,es;q=0.5",
                    "cache-control": "no-cache",
                },
                "body": null,
                "method": "GET",
                "mode": "cors",
                "credentials": "include"
            });
            const html = await res.text();
            const ckMatch = html.match(/getCK\(\)\s*{\s*return\s*'([^']+)'/);
            const ck = ckMatch ? ckMatch[1] : null;

            const arrayMatch = html.match(/placeEssenceOnMap\((\[.*?\])\)/s);
            let essenceData = [];

            if (arrayMatch) {
                try {
                    const parsed = JSON.parse(arrayMatch[1]);
                    essenceData = parsed.map(e => ({
                        id: e.id,
                        hash: e.hash,
                        day: e.day
                    }));
                } catch (e) {
                    console.error("Failed to parse essence array:", e);
                }
            }

            if (essenceData.length === 0) {
                statusEl.innerHTML = `${map} no void essence, checking next map`;
            } else {
                if (!ck) {
                    throw new Error('Error! No ck found');
                }
                statusEl.innerHTML = `${map} has ${essenceData.length} void essences, collecting...`;
                await sleep(random_in_range(1000, 2000));
                for (let j = 0; j < essenceData.length; j += 1) {
                    const { hash, id, day } = essenceData[j];
                    if (!hash || !id || !day) {
                        throw new Error('Error! Invalid void essence data');
                    }
                    statusEl.innerHTML = `${map} collecting essence id ${id}...`;
                    const formData = new FormData();
                    formData.append('hash', hash);
                    formData.append('id', id);
                    formData.append('day', day);
                    formData.append('_ref_ck', ck);
                    const collectRes = await fetch("https://www.neopets.com/np-templates/ajax/plots/tvw/void-collection/collect_void.php", {
                        "headers": {
                            "accept": "*/*",
                            "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,zh-TW;q=0.6,es;q=0.5",
                            "cache-control": "no-cache",
                            "x-requested-with": "XMLHttpRequest"
                        },
                        "referrer": url,
                        "body": formData,
                        "method": "POST",
                        "mode": "cors",
                        "credentials": "include"
                    }).then((res) => res.json());
                    if (!collectRes.success) {
                        throw new Error('Error! Collect void essence failed');
                    }
                    statusEl.innerHTML = `${map} essence id ${id} collected successfully`;
                    const counter = vcItem.querySelector('.vc-progress-amt');
                    const [currentCount] = counter.innerHTML.split('/');
                    counter.innerHTML = `${+currentCount + 1}/10`;
                    if (currentCount == 9) {
                        document.querySelector('#k-button').disabled = true;
                        statusEl.innerHTML = 'Auto collector finished successfully!';
                        return;
                    }
                    vcItem.querySelector('.vc-progress-bar').style.width = `calc(${+currentCount + 1} / 10 * 100%)`;
                    await sleep(random_in_range(1000, 2000));
                }
            }


            await sleep(random_in_range(1000, 2000));
        }
    } catch (e) {
        console.log(e);
        statusEl.innerHTML = e.message;
    }
}

let vcItem;
(function() {
    'use strict';

    // Your code here...
    vcItem = document.querySelector('.vc-item.locked')?.previousElementSibling || Array.from(document.querySelectorAll('.vc-item')).pop();
    const panel = document.querySelector('#VoidCollectionModule');
    const button = document.createElement('button');
    const counter = vcItem.querySelector('.vc-progress-amt');
    const [currentCount] = counter.innerHTML.split('/');
    button.id = 'k-button';
    button.className = 'button-default__2020 button-purple__2020 btn-single__2020 plothub-button';
    button.innerHTML = currentCount == 10 ? 'Collect Completed' : 'Auto Collect';
    button.disabled = currentCount == 10;
    panel.appendChild(button);
    console.log(button);
    button.addEventListener('click', function() { autoCollect(maps) });
    const status = document.createElement('div');
    status.id = 'k-status';
    status.style.textAlign = 'center';
    status.style.marginTop = '10px';
    status.style.coloc = '#0E0134';
    status.style.fontWeight = 'bold';
    panel.appendChild(status);
})();
