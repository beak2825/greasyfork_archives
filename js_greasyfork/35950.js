// ==UserScript==
// @name               Sticky itens hider (medium.com, hackernoon)
// @description        Hides medium.com and hackernoon.com footer, header, sidebar and letterbox
// @version            2.2
// @include            https://medium.com/*
// @include            https://hackernoon.com*
// @namespace https://greasyfork.org/users/153157
// @downloadURL https://update.greasyfork.org/scripts/35950/Sticky%20itens%20hider%20%28mediumcom%2C%20hackernoon%29.user.js
// @updateURL https://update.greasyfork.org/scripts/35950/Sticky%20itens%20hider%20%28mediumcom%2C%20hackernoon%29.meta.js
// ==/UserScript==

const hackernoonFixedItens = '.Header__Layout-le0go0-0';
const mediumFixedItens = '.branch-journeys-top'

const fixedItens = document.querySelectorAll(`${hackernoonFixedItens},${mediumFixedItens}`);
const hackernoonNewsletterBox = [].filter.call( document.querySelectorAll('figure'), elem => elem.querySelector('.iframeContainer'));

const itensToHide = hackernoonNewsletterBox.concat([...fixedItens]);
itensToHide.forEach(itemToHide => itemToHide.style.display = 'none');