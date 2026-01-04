// ==UserScript==
// @name         Tea pie door
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Некоторые посты не те, чем кажутся, %username%!
// @author       Rawlique
// @match        *://orbitar.space/*
// @icon         https://orbitar.space/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453871/Tea%20pie%20door.user.js
// @updateURL https://update.greasyfork.org/scripts/453871/Tea%20pie%20door.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const pidorPattern = /(т)(.*?)(ы)(.*?)(п)(.*?)(и)(.*?)(д)(.*?)(о)(.*?)(р)/gm;
    const postUrlPattern = /.+orbitar\.space\/p\d+/i;
    const subs = {
        'т': '<img src="https://pepyaka.su/fonts/katjka/D182.gif" alt="т">',
        'ы': '<img src="https://pepyaka.su/fonts/katjka/D18B.gif" alt="ы">',
        'п': '<img src="https://pepyaka.su/fonts/katjka/D0BF.gif" alt="п">',
        'и': '<img src="https://pepyaka.su/fonts/katjka/D0B8.gif" alt="и">',
        'д': '<img src="https://pepyaka.su/fonts/katjka/D0B4.gif" alt="д">',
        'о': '<img src="https://pepyaka.su/fonts/katjka/D0BE.gif" alt="о">',
        'р': '<img src="https://pepyaka.su/fonts/katjka/D180.gif" alt="р">',
    };

    function getPostContent() {
        return new Promise((resolve, reject) => {
            const maxTries = 10;
            const delay = 100;
            let numTries = 0;
            let interval = setInterval(() => {
                numTries += 1;
                let posts = document.querySelectorAll('[class^="PostComponent_content__"]');
                if (posts.length > 1) {
                    clearInterval(interval);
                    return reject('Eto glagne!');
                }

                let postContent = posts[0]?.innerHTML;
                if (postContent || (numTries > maxTries)) {
                    clearInterval(interval);
                    if (postContent) {
                        resolve(postContent);
                    } else {
                        reject('No post content');
                    }
                }
            }, delay);
        });
    }

    async function postPopidorilo() {
        try {
            const content = await getPostContent();
            const newContent = content.replace(pidorPattern, function(match, t, t_y, y, y_p, p, p_i, i, i_d, d, d_o, o, o_r, r, offset, string, groups) {
                return [
                    subs[t.toLowerCase()],
                    t_y,
                    subs[y.toLowerCase()],
                    y_p,
                    subs[p.toLowerCase()],
                    p_i,
                    subs[i.toLowerCase()],
                    i_d,
                    subs[d.toLowerCase()],
                    d_o,
                    subs[o.toLowerCase()],
                    o_r,
                    subs[r.toLowerCase()]
                ].join('');
            });
            document.querySelectorAll('[class^="PostComponent_content__"]')[0].innerHTML = newContent;
        } catch(e) {
            console.error('[TeaPieDoor user JS]', e);
        }
    }

    let previousUrl = '';
    const observer = new MutationObserver(function(mutations) {
        if (location.href !== previousUrl) {
            previousUrl = location.href;
            if (location.href.match(postUrlPattern)) {
                // post
                postPopidorilo();
            } else {
                // not post
            }
        }
    });
    const config = {subtree: true, childList: true};
    observer.observe(document, config);
})();