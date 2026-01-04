// ==UserScript==
// @name            AnimeBytes Age Rating Buddy
// @author          sabs (like "sobs"), sabs@sobs.moe
// @namespace       sabs
// @version         4
// @description     If there's a MAL link on the anime page, then insert the rating into the title page
// @match           https://animebytes.tv/torrents.php?id=*
// @homepageURL     https://animebytes.tv/forums.php?action=viewthread&threadid=28220
// @grant GM_xmlhttpRequest
// @grant GM_log
// @icon data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABb2lDQ1BpY2MAACiRdZE7SwNBFIW/JEp8YqFFEIsUUSwiiIJop7FIEyTECEZtNutuIiTrspsgwVawsQhYiDa+Cv+BtoKtgiAogoiNf8BXI7LeMUJEdJbZ+3FmzmXmDPgTBb3oNgxC0So5qXgsPJuZCwcfaSaEnyBjmu7aE8lkgn/H2zU+Va8GVK//9/05WhcNVwdfk/CIbjsl4XHhxErJVrwh3KXntUXhPeGoIwcUPld6tsYPinM1flHspFOT4Fc9w7kfnP3Bet4pCvcLR4qFsv59HnWTNsOamZbaLbMHlxRxYoTJUmaJAiUGpFqS2d++wS/fFMvi0eVvU8ERR468eKOilqWrIdUU3ZCvQEXl/jtP1xweqnVvi0Hjvec990JwEz6qnve+73kfBxC4g1Or7l+WnEZfRa/WtcgudKzB8Vldy27ByTqEbm3N0b6kgEy/acLTEbRnoPMSWuZrWX2vc3gD6VV5ogvY3oE+2d+x8AnhZWf8PQBFKQAAAAlwSFlzAAALEgAACxIB0t1+/AAAAbRJREFUOMudU00oRFEUPucOZjGpec+MorCzGIvZWtsgOz8rU8oCmWEjslAiJUkx4ydlyQpblFKWFsqkLCwpI8x7VmJ49zj3+enNNaQ5m9v97rnfOee730XQImvGG5Aw5veVJHNvTj2Bsw2I9wB4hKW4Ydyl0t584d1YRmIWJaWZ4CDwsJghdOYIIExEESKZoJxzyjnrFJksyyNQQDY4uMtJ44BizXhMHbunBGFvASbzcU6fdfOw/0XiEli32Qle2hHAYWj+6wICTn9gelCTnckuuDmWMVwL9HbJ7H5EODHt1UZvql05FKVXOcpjdHtxRUwCo9wBH/Llz4nSei0lmmmvxHwCuvRxWKsBodqBf0TQWt1BxC19FMFMdd9booq/aXBP66JOdSA9g7VQaKz8t+uEMpAPUECw0tdewJJP/b82ILFZhwQSHOQ1KeWMZQy16Yl2MN7DFTp+DOVal92nVM07YMGY/FAivxCRqtxeUJVPC6eUVaGIcJ1oVFWMqM9SNAFeTOXM6lArolgubN3vdl90L2Ch7ywk9JJ6UqAa1uGZAM+50hmhb8m0k1eWEd9kXTqVg98BpA+2IT/y+kMAAAAASUVORK5CYII=
// @downloadURL https://update.greasyfork.org/scripts/453134/AnimeBytes%20Age%20Rating%20Buddy.user.js
// @updateURL https://update.greasyfork.org/scripts/453134/AnimeBytes%20Age%20Rating%20Buddy.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let href = document.querySelector("h3 > a[href*='myanimelist.net/anime/']").href
    GM_xmlhttpRequest({
            method: "GET",
            url: href,
            onerror: (r) => {
                GM_log(r, unsafeWindow.processed)
                alert("Age Rating Buddy: ran into an error while fetching. Open the console with F12 and send sabs the contents, please.")
            },
            onload: (r) => {
                var container = document.implementation.createHTMLDocument().documentElement;
                container.innerHTML = r.responseText;
                let rating = Array.from(container.querySelectorAll('.leftside span')).find(el => el.textContent === 'Rating:').parentNode.innerText;
                document.querySelector("#content .thin h2").insertAdjacentHTML('beforeEnd', "<span style='color: #ed106a'>" + rating + "</span>" )
            }
        })
})();
