// ==UserScript==
// @name         Nyaa Anime Covers
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  Display anime covers in nyaa
// @author       Hydreath
// @match        https://nyaa.si/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438702/Nyaa%20Anime%20Covers.user.js
// @updateURL https://update.greasyfork.org/scripts/438702/Nyaa%20Anime%20Covers.meta.js
// ==/UserScript==

const GROUP_PREFIX = /^(\[[a-zA-Z0-9\s-_]+\]\s?)?/g;
const SUFFIX = /\s((-\s[0-9]+)|[\[\/]).*$/g;
const API = 'https://kitsu.io/api/edge';
const IMAGE_HEIGHT = 398;

(function () {
    'use strict';
    const nameSet = new Set();
    const list = document.querySelector('tbody').children;
    for (let item of list) {
        console.log(item.children[0].children[0]);
        if (item.children[0].children[0].title.match(/^Anime.*/)) {
            const nameCollumn = item.children[1];
            const name = nameCollumn.children[nameCollumn.children.length - 1].title;
            const formatedName = name.replace(GROUP_PREFIX, '').replace(SUFFIX, '');

            const imageLink = document.createElement('a');
            imageLink.textContent = '<IMAGE>';
            imageLink.dataset.name = formatedName;
            item.children[1].append(imageLink);
            const hoverImage = document.createElement('img');
            hoverImage.style.position = 'absolute';
            hoverImage.style.zIndex = 10;
            imageLink.append(hoverImage);
            imageLink.addEventListener('mouseenter', (e) => {
                if ((e.screenY + IMAGE_HEIGHT) > window.innerHeight) {
                    hoverImage.style.top = `${imageLink.getBoundingClientRect().top + document.documentElement.scrollTop - IMAGE_HEIGHT + 10}px`;
                }

                hoverImage.hidden = false;
            });
            imageLink.addEventListener('mouseleave', () => {
                hoverImage.hidden = true;
            });

            imageLink.addEventListener('mouseenter', () => {
                if (hoverImage.src.length === 0) {
                    imageLink.style.cursor = 'wait';
                    fetch(`${API}/anime?filter[text]=${encodeURI(formatedName)}&page[limit]=1&page[offset]=0`,
                        {
                            headers: {
                                'Accept': 'application/vnd.api+json',
                                'Content-Type': 'application/vnd.api+json'
                            }
                        }
                    ).then(res => {
                        return res.json();
                    }).then(res => {
                        imageLink.style.cursor = 'pointer';
                        if (res.data.length > 0) {
                            hoverImage.src = res.data[0].attributes.posterImage.small;
                        }
                    });
                }
            });
        }
    }
})();