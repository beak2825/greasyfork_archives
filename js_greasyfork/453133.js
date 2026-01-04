// ==UserScript==
// @name            AnimeBytes Mega Carousel
// @author          sabs (like "sobs"), sabs@sobs.moe
// @namespace       sabs
// @version         9
// @description     It's not gonna fit!
// @match           https://animebytes.tv
// @homepageURL     https://animebytes.tv/forums.php?action=viewthread&threadid=28220
// @grant GM_xmlhttpRequest
// @grant GM_log
// @icon data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABb2lDQ1BpY2MAACiRdZE7SwNBFIW/JEp8YqFFEIsUUSwiiIJop7FIEyTECEZtNutuIiTrspsgwVawsQhYiDa+Cv+BtoKtgiAogoiNf8BXI7LeMUJEdJbZ+3FmzmXmDPgTBb3oNgxC0So5qXgsPJuZCwcfaSaEnyBjmu7aE8lkgn/H2zU+Va8GVK//9/05WhcNVwdfk/CIbjsl4XHhxErJVrwh3KXntUXhPeGoIwcUPld6tsYPinM1flHspFOT4Fc9w7kfnP3Bet4pCvcLR4qFsv59HnWTNsOamZbaLbMHlxRxYoTJUmaJAiUGpFqS2d++wS/fFMvi0eVvU8ERR468eKOilqWrIdUU3ZCvQEXl/jtP1xweqnVvi0Hjvec990JwEz6qnve+73kfBxC4g1Or7l+WnEZfRa/WtcgudKzB8Vldy27ByTqEbm3N0b6kgEy/acLTEbRnoPMSWuZrWX2vc3gD6VV5ogvY3oE+2d+x8AnhZWf8PQBFKQAAAAlwSFlzAAALEgAACxIB0t1+/AAAAbRJREFUOMudU00oRFEUPucOZjGpec+MorCzGIvZWtsgOz8rU8oCmWEjslAiJUkx4ydlyQpblFKWFsqkLCwpI8x7VmJ49zj3+enNNaQ5m9v97rnfOee730XQImvGG5Aw5veVJHNvTj2Bsw2I9wB4hKW4Ydyl0t584d1YRmIWJaWZ4CDwsJghdOYIIExEESKZoJxzyjnrFJksyyNQQDY4uMtJ44BizXhMHbunBGFvASbzcU6fdfOw/0XiEli32Qle2hHAYWj+6wICTn9gelCTnckuuDmWMVwL9HbJ7H5EODHt1UZvql05FKVXOcpjdHtxRUwCo9wBH/Llz4nSei0lmmmvxHwCuvRxWKsBodqBf0TQWt1BxC19FMFMdd9booq/aXBP66JOdSA9g7VQaKz8t+uEMpAPUECw0tdewJJP/b82ILFZhwQSHOQ1KeWMZQy16Yl2MN7DFTp+DOVal92nVM07YMGY/FAivxCRqtxeUJVPC6eUVaGIcJ1oVFWMqM9SNAFeTOXM6lArolgubN3vdl90L2Ch7ywk9JJ6UqAa1uGZAM+50hmhb8m0k1eWEd9kXTqVg98BpA+2IT/y+kMAAAAASUVORK5CYII=
// @downloadURL https://update.greasyfork.org/scripts/453133/AnimeBytes%20Mega%20Carousel.user.js
// @updateURL https://update.greasyfork.org/scripts/453133/AnimeBytes%20Mega%20Carousel.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let flex = document.createElement("div")
    // Carousel duplicates some, but not all, elements on the end
    let seen = new Set()
    let as = [...document.querySelectorAll("#cover-slider .slider a")].sort((b,a)=>{return a.href.localeCompare(b.href)}).forEach(e=>{
        if (seen.has(e.href)) { return };
        e.querySelector("img").style.width = "80px"
        e.querySelector("img").style.height = "100px"
        e.style.height = "100px"
        e.style.position = "relative"
        e.querySelector("span").style.height = "90px"
        e.querySelector("span").style.width = "70px"
        e.querySelector("span").style.lineHeight = "1.25em"
        e.querySelector("span").style.overflow = "hidden"
        seen.add(e.href)
        flex.append(e)
    })
    var css = 'a:hover .caption { display: inline-block; }';
    var style = document.createElement('style');
    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    document.getElementsByTagName('head')[0].appendChild(style);
    flex.style.display = "flex"
    flex.classList.add("box")
    flex.style.flexWrap = "wrap"
    flex.style.flexDirection = "row"
    flex.style.gap = "5px"
    flex.style.placeContent = "center"
    document.querySelector("#rutCarousel").insertAdjacentElement('beforebegin', flex)
    document.querySelector("#rutCarousel").remove()
})();