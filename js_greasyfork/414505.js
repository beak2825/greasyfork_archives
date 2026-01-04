// ==UserScript==
// @name         Refresh Pepper
// @version      0.1
// @description  Refresh for Pepper
// @author       MaMiX
// @match        https://www.pepper.pl/
// @match        https://www.pepper.pl/nowe
// @match        https://www.pepper.pl/om%C3%B3wione
// @match        https://www.pepper.pl/*?page=*
// @exclude      https://www.pepper.pl/*/*
// @grant        none
// @namespace    https://greasyfork.org/users/697301
// @downloadURL https://update.greasyfork.org/scripts/414505/Refresh%20Pepper.user.js
// @updateURL https://update.greasyfork.org/scripts/414505/Refresh%20Pepper.meta.js
// ==/UserScript==

(function() {
'use strict';
var oImg = document.createElement("img");
oImg.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAhCAMAAABgOjJdAAAAXVBMVEUAAAD/eQD/eQD/eQH/eQD/eQD/eQD/eQD/eQH+eQL+eQL/eQD/eQD/eQH+eQT/eQD+eQL+eQP+eQLxdSD/eQD+eQL7eAr/eQD+eAT6dw3xdBj+eQL/eQH+eQL/eQAhTxoyAAAAHnRSTlMAgEDtoLXRv28eNCDgpRHyeb1wAaZmHWoWEwHWpmWSrpBMAAAA5ElEQVQ4y63T3Y6CMBCG4bKl/Lb8Curu+t7/ZZpIZRqZRA/8jqbJE4YpjPlemrciC7MxdeUsYF1VK4LQ5kjy9ii2FOVYFgD9pAl/vjwO3c0DuSL+5/08CEkFQUhjYToKghECfTpS+7OlM9Io6bMORouHNZYVf60iFqhi6eCqiA5cLC2F2qbAxgpKVZSwi1EVI7x/xsfv4aBTwFVmqWBRRNPv91GD17rUbn2WOQzJTcVv1Ka4h0aOgUcyk2QCK+T3lArpw5ASESnxyzb05exFSKY+/dc1YV725XQULzs3h+yDXf5a7uUaF6szal9UAAAAAElFTkSuQmCC');
oImg.alt="Odświeżanie strony";
oImg.style.position = 'fixed';
oImg.style.top = '60px';
oImg.style.left = '20px';
oImg.onclick=function(){location=location.origin+location.pathname}
document.body.appendChild(oImg);
})();