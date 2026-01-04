// ==UserScript==
// @name         Torn NPC Attack Time Newsfeed
// @namespace    npc.timing
// @version      v1.1.5
// @description  Add NPC attack time to the news ticker using Loot Rangers for Torn
// @author       IceBlueFire [776]
// @license      MIT
// @match        https://www.torn.com/*
// @exclude      https://www.torn.com/newspaper.php
// @exclude      https://www.torn.com/item.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-1.8.2.min.js
// @connect      api.lzpt.io
// @downloadURL https://update.greasyfork.org/scripts/486869/Torn%20NPC%20Attack%20Time%20Newsfeed.user.js
// @updateURL https://update.greasyfork.org/scripts/486869/Torn%20NPC%20Attack%20Time%20Newsfeed.meta.js
// ==/UserScript==

/******************** CONFIG SETTINGS ********************/
const color = "#8abeef"; // Any hex-code for the color to appear in the news feed as
const format = 24; // Time format. 12 = 12:00 AM format; 24 = 23:59 format
const local = false; // Adjust the timer to be local time or not. true = local; false = UTC

/****************** END CONFIG SETTINGS *******************/

const lzpt = getAttackTimes();
const { fetch: originalFetch } = unsafeWindow;
unsafeWindow.fetch = async (...args) => {
    var [resource, config] = args;
    var response = await originalFetch(resource, config);
    if(response.url.indexOf('?sid=newsTicker') === -1) return response;
    const json = () => response.clone().json()
    .then((data) => {
        data = { ...data };
        lzpt.then(function(result) {
            var attackOrder = '';
            var attackString = '';
            var attackLink = '';
            var attackTarget = 0;

            // If there's no clear time set
            if(result.time.clear == 0  && result.time.attack === false) {
                attackString = result.time.reason ? 'NPC attacking will resume after '+result.time.reason : 'No attack currently set.';
            } else {
                // Build the string for the attack order
                $.each(result.order, function(key, value) {
                    if(result.npcs[value].next){
                        // If there's an attack happening right now, cross out NPCs that are in the hospital
                        if(result.time.attack === true) {
                            if(result.npcs[value].hosp_out >= result.time.current) {
                                attackOrder += '<span style="text-decoration: line-through">'+result.npcs[value].name+'</span>, ';
                            } else {
                                attackOrder += result.npcs[value].name+', ';
                            }
                        } else {
                            attackOrder += result.npcs[value].name+', ';
                        }
                    }
                    // Adjust the current target based on if an attack is going and who isn't in the hospital yet
                    if(result.time.attack === true) {
                        if(result.npcs[value].hosp_out <= result.time.current) { // Check if the NPC is currently out of the hospital
                            if(attackTarget == 0) {
                                attackTarget = value;
                            }
                        }
                    }
                });

                // Check if target has been set, otherwise default to first in attack order
                if(attackTarget == 0) {
                    attackTarget = result.order[0];
                }

                // Clean up the attack order string
                attackOrder = attackOrder.slice(0, -2)+'.';

                // Check if an attack is currently happening and adjust the message accordingly
                if(result.time.attack === true) {
                    attackString = 'NPC attack is underway! Get in there and get some loot!';
                    attackLink = 'loader.php?sid=attack&user2ID='+attackTarget;
                } else {
                    attackString = 'NPC attack set for '+utcformat(result.time.clear)+'. Order is: '+attackOrder;
                    attackLink = 'loader.php?sid=attack&user2ID='+attackTarget;
                }
            }

            // Insert the custom news item into the news ticker
            let attackItem = {ID: 0, headline: '<span style="color:'+color+'; font-weight: bold;" id="icey-npctimer">'+attackString+'</span>', countdown: true, endTime: result.time.clear, link: attackLink, isGlobal: true, type: 'generalMessage'};
            data.headlines.unshift(attackItem);
        }, function(err) {
            console.log(err); // Error: "It broke"
        });

        return data
    })

    response.json = json;
    response.text = async () =>JSON.stringify(await json());

    return response;
};

function modifyContent() {
    return new Promise((resolve, reject) => {
        var ticker = document.querySelector('.news-ticker-countdown');
        ticker.style.color = color;
        var wrap = ticker.parentNode.parentNode.parentNode;
        var svg = wrap.children[0];
        svg.setAttribute('fill', color);
        svg.setAttribute('viewBox', "0 0 24 24");
        svg.setAttribute('height', '14');
        svg.setAttribute('width', '14');
        svg.children[0].setAttribute('d', 'M17.457 3L21 3.003l.002 3.523-5.467 5.466 2.828 2.829 1.415-1.414 1.414 1.414-2.474 2.475 2.828 2.829-1.414 1.414-2.829-2.829-2.475 2.475-1.414-1.414 1.414-1.415-2.829-2.828-2.828 2.828 1.415 1.415-1.414 1.414-2.475-2.475-2.829 2.829-1.414-1.414 2.829-2.83-2.475-2.474 1.414-1.414 1.414 1.413 2.827-2.828-5.46-5.46L3 3l3.546.003 5.453 5.454L17.457 3zm-7.58 10.406L7.05 16.234l.708.707 2.827-2.828-.707-.707zm9.124-8.405h-.717l-4.87 4.869.706.707 4.881-4.879v-.697zm-14 0v.7l11.241 11.241.707-.707L5.716 5.002l-.715-.001z');
        // console.log(svg);
        resolve('Content updated');
    });
}

const newstickerObserver = new MutationObserver((mutationsList, observer) => {
    if ($(".news-ticker-slide #icey-npctimer").length == 1) { // If it's showing the slide for NPCs
        // Once changes are observed, disconnect the observer to avoid infinite loop
        newstickerObserver.disconnect();

        // Modify the content of .news-ticker-wrapper
        modifyContent()
            .then(() => {
            // Re-observe the element after modifications and asynchronous operations are complete
            startNewstickerObserver();
        })
            .catch(error => console.error('Error updating content:', error));
    }
});

function startNewstickerObserver() {
    const target = document.querySelector('.news-ticker-slider-wrapper');
    if (target) {
        newstickerObserver.observe(target, {
            childList: true, // Set true if children of the target node are being added or removed.
            attributes: false, // Set true if attributes of the target node are being modified.
            subtree: true, // Set true if changes to descendants of the target node are to be observed.
            characterData: false // Set true if data of the target node itself is being modified.
        });
    }
}

/******************** HELPER FUNCTIONS ********************/

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

// Make sure the news ticker with the injected div is loaded
waitForElm('#icey-npctimer').then((elm) => {
    startNewstickerObserver();
    //console.log('Element is ready');
});

// Format the time in the appropriate fashion
function utcformat(d){
    d= new Date(d * 1000);
    if(local) {
        var tail= ' LT', D= [d.getFullYear(), d.getMonth()+1, d.getDate()],
            T= [d.getHours(), d.getMinutes(), d.getSeconds()];
    } else {
        var tail= ' TCT', D= [d.getUTCFullYear(), d.getUTCMonth()+1, d.getUTCDate()],
            T= [d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds()];
    }
    if(format == 12) {
        /* 12 hour format */
        if(+T[0]> 12){
            T[0]-= 12;
            tail= 'PM '+tail;
        }
        else tail= 'AM '+tail;
    }
    var i= 3;
    while(i){
        --i;
        if(D[i]<10) D[i]= '0'+D[i];
        if(T[i]<10) T[i]= '0'+T[i];
    }
    return T.join(':')+ tail;
}

// Fetch the NPC details from Loot Rangers
async function getAttackTimes() {
    return new Promise(resolve => {
        const request_url = `https://api.lzpt.io/loot`;
        GM_xmlhttpRequest ({
            method:     "GET",
            url:        request_url,
            headers:    {
                "Content-Type": "application/json"
            },
            onload: response => {
                try {
                    const data = JSON.parse(response.responseText);
                    if(!data) {
                        console.log('No response from Loot Rangers');
                    } else {
                        return resolve(data)
                    }
                }
                catch (e) {
                    console.error(e);
                }

            },
            onerror: (e) => {
                console.error(e);
            }
        })
    });
}
