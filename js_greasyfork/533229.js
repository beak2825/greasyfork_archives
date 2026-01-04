// ==UserScript==
// @name         Dcinside old favicon
// @namespace    http://tampermonkey.net/
// @version      2025-04-18
// @description  old favicon
// @author       kindongshin
// @match        *://*.dcinside.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsSAAALEgHS3X78AAABqElEQVQ4jZWTv2pUURDGfzPn3Gtc3BgEW2FZhDWVkMbGZxB7n8AXyDP4ApZW6SzEwsoyjU1EEUM0LIKYSpAoS5K795wZi7Mbd282qB8MMzBnvvl7BODl7rEzg1sxnaIFKVqFLh7c3xBZDDYz3BxzPycSFVSkaNULJNHNcRzLRkoZy0Y2w8wAUFWCKhoUVUVVkBmhIMRsVoLbxHTaktrEvbs32BxeB2B//JM3734QYiBWkRgjqqAhoKrEnBJtm2nOGs5OG6bTxOZwgEjp2d15vfuNuo7UVyqquiKEQF2DALLz6si37vQZDfpLvS0SrMLh1xPeH56gzWnDaNAvfS1Il6wrt2/1yNmIbZuXHs8zdkm61Xz6MilbyB2Cv+HJ0z3Wemusr/e52qu5uNh/gFjEPWNZiP8bvP14C4CD8YS9/QmqUi2zrxhi1ycijIbXMINYVRUfP/+6dF1vP3xf6TsYlyHKs+dHnlMipXKJUKbt7uVQVIstQgiBEJQYIyFGQghEJSBBEZSgkXmyedAizj+VKIoiLkhK2XdezMr0P9/4MggCUubx6OFNfgPmn7765GE2UgAAAABJRU5ErkJggg==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533229/Dcinside%20old%20favicon.user.js
// @updateURL https://update.greasyfork.org/scripts/533229/Dcinside%20old%20favicon.meta.js
// ==/UserScript==

var create_fav_link = document.createElement('link');
create_fav_link.setAttribute('rel', 'shortcut icon');
create_fav_link.setAttribute('href', "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsSAAALEgHS3X78AAABqElEQVQ4jZWTv2pUURDGfzPn3Gtc3BgEW2FZhDWVkMbGZxB7n8AXyDP4ApZW6SzEwsoyjU1EEUM0LIKYSpAoS5K795wZi7Mbd282qB8MMzBnvvl7BODl7rEzg1sxnaIFKVqFLh7c3xBZDDYz3BxzPycSFVSkaNULJNHNcRzLRkoZy0Y2w8wAUFWCKhoUVUVVkBmhIMRsVoLbxHTaktrEvbs32BxeB2B//JM3734QYiBWkRgjqqAhoKrEnBJtm2nOGs5OG6bTxOZwgEjp2d15vfuNuo7UVyqquiKEQF2DALLz6si37vQZDfpLvS0SrMLh1xPeH56gzWnDaNAvfS1Il6wrt2/1yNmIbZuXHs8zdkm61Xz6MilbyB2Cv+HJ0z3Wemusr/e52qu5uNh/gFjEPWNZiP8bvP14C4CD8YS9/QmqUi2zrxhi1ycijIbXMINYVRUfP/+6dF1vP3xf6TsYlyHKs+dHnlMipXKJUKbt7uVQVIstQgiBEJQYIyFGQghEJSBBEZSgkXmyedAizj+VKIoiLkhK2XdezMr0P9/4MggCUubx6OFNfgPmn7765GE2UgAAAABJRU5ErkJggg==");

var head = document.getElementsByTagName('head')[0];
head.appendChild(create_fav_link);