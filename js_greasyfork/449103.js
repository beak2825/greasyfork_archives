// ==UserScript==
// @name         Hide Ads
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Hide banner ads
// @author       Jack
// @match        https://sketchful.io/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449103/Hide%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/449103/Hide%20Ads.meta.js
// ==/UserScript==

(function init() {
    setInterval(adsBad, 1000);
})();

function adsBad() {
 const newStyle = 'display: none; visibility: hidden';
 const ad1 = document.querySelector("#moneyTopGame");
 const ad2 = document.querySelector("#moneySide");
 const ad3 = document.querySelector("#moneySideGame");
 const ads = [ad1, ad2, ad3];
//  const bg = 'background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAADcCAMAAABpjAddAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAEtQTFRFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA5mA6dAAAABl0Uk5TACgnCoqeFE8ylTt2d4uBWUUxY2w3gJQebaRMqy0AAATRSURBVHic7d3rdqIwFIZhEWJEUagd0Pu/0smBo5XaTuvI3r7Pj1m1EvgynDZ0rWS1AgAAAAAAAAAAAAAAAAAAWJhkvV7f+z79yQbS9Z0tPJC4ziWZ8T5bxH+fXP9yY52vbuPeFh5FYOe2xnwhc/4x8xdy7Pb7/S4umz9lh0jsXO5XdzdzcSvz4V4O69Zr47LZU3aIwM4l5mhMeef8nMlcfCPzUy5ZEju3dcdQMfNduq6qcLf6XubNemd3oV2feXJJTqq3zY9zf4m8zvmVFuGkPvmf/K+KfsfH+6E5pX3myn+8ymyvGqan9rr9/sf02oPIL1s3/uf6P+wSiZ37JHM5bLDLHNIcPs+c1n276mbmIDfN4/eIxM6NMxfdpguf2ba3wyFzPDry84fMk4ajoJPMxSRzdhwOxoeR2LnE+i0d3DWwnG5607T3w0uXeRuOjuPwCHU7s1ubKWxlL7n5Y/1/R+GvsP2y9mTy0h59XfKjhzG9nes2ebVp/9GE42VzipnD1bEYbeh25tz1NVTnqT2PC5F22bLxa03zWzfS3yexczOZ/b/Dedef+uOWcweRO/iy8i2NK7/O3C+bm+0/Z1bduZnM7tSMx0KbOVwgy0nLuctsEwsYV7/cyHyI/W6v5Y8msXMzmafFubuH+ZN6N2l5O3OoVprG3TSz9Ebm9vNzd8iiOzeT+Wguk4MontWT0DOZV9tLKDX84bLQHbLozn3I7Gq22cvsJHSboxoaXnwF435Kt2XuPtTL2yECOtdl9a8sm9RHONhQiNTtO9DzPhYiVSjdqw+Z/Ws433Bnct/QnDbDl9bdBMvfz6y6c13mjWlcAW33vj73z6S+djPv1tb9s9M5n9YibY6rhm6RurRl5it21w+3yN558g6R1Ln+bD75K2MQVueeRJvpw+zqKnT3/u1k6lHD4QHWHXCb3NTXD7PP2CGSOte/rdnkw9bsavQmIGQOf1SLobv6pMs8bTj8fBqtZPS6p81s/s8Okde5PvMqDfe246Fb3Tne6w427f/K6UP3798qV7/nQ8NDbFhdYspDvEUml+MSdojUziXJefL5nCQz7y3P67fM1RrdHxsmDV2r5OEvqr5PdefCUXAsrp6mtJDYOZc5y4YzXBeJnYuX5PP9BSWS2LmyKMrq/mIyqe4cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABYEHETCqomcEJB1SROKKiawAkFVZM4oaBq8iYUVE3ihIKqSZxQUDWJEwqqJnNCQdUkTiiomsQJBVWTOKGgahInFFRN4oSCqkmcUFA1iRMKqiZxQkHVJE4oqJrECQVVEz+hoGq6JxRUTeKEgqpJnFBQNYkTCqrGhIIAAAAAAAAAAAAAAAAAAAAAAAAAADwUo+QvCaPkLwuj5C8Mo+QvC6PkL8xrjJIvpmp5iVHyJVUtrzBKvqiq5RVGyRdVtbzAKPnSqhb1o+RLq1qUj5Ivr2pRPkq+vKpF+Sj58qoW5aPky6ta1I+SL61qUT9KvrSqRf0o+dKqFvWj5EurWtSPki+talE/Sr7oqkXjKPnqq5ZIzij56quWSM4o+eqrlkjOKPnqq5ZIzij56qsW0TRWLS9CTtXyIuRULS9CTtXyIuRULQAAAAAAAAAAAAAAAAAAAAAA/La/gJLVcXmhVhsAAAAASUVORK5CYII=);'
 function hideAds(ad){
     ad.setAttribute('style', newStyle)
 }
 ads.forEach(hideAds)
//  const back = document.querySelector("html");
//  back.setAttribute('style', bg)
};