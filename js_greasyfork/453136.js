// ==UserScript==
// @name            AnimeBytes Shortcut to Latest Subforum Post
// @author          sabs (like "sobs"), sabs@sobs.moe
// @namespace       sabs
// @version         12
// @description     Jump directly to the freshest post in a subforum
// @match           https://animebytes.tv/forums.php
// @homepageURL     https://animebytes.tv/forums.php?action=viewthread&threadid=28126
// @grant GM_xmlhttpRequest
// @icon data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABb2lDQ1BpY2MAACiRdZE7SwNBFIW/JEp8YqFFEIsUUSwiiIJop7FIEyTECEZtNutuIiTrspsgwVawsQhYiDa+Cv+BtoKtgiAogoiNf8BXI7LeMUJEdJbZ+3FmzmXmDPgTBb3oNgxC0So5qXgsPJuZCwcfaSaEnyBjmu7aE8lkgn/H2zU+Va8GVK//9/05WhcNVwdfk/CIbjsl4XHhxErJVrwh3KXntUXhPeGoIwcUPld6tsYPinM1flHspFOT4Fc9w7kfnP3Bet4pCvcLR4qFsv59HnWTNsOamZbaLbMHlxRxYoTJUmaJAiUGpFqS2d++wS/fFMvi0eVvU8ERR468eKOilqWrIdUU3ZCvQEXl/jtP1xweqnVvi0Hjvec990JwEz6qnve+73kfBxC4g1Or7l+WnEZfRa/WtcgudKzB8Vldy27ByTqEbm3N0b6kgEy/acLTEbRnoPMSWuZrWX2vc3gD6VV5ogvY3oE+2d+x8AnhZWf8PQBFKQAAAAlwSFlzAAALEgAACxIB0t1+/AAAAbRJREFUOMudU00oRFEUPucOZjGpec+MorCzGIvZWtsgOz8rU8oCmWEjslAiJUkx4ydlyQpblFKWFsqkLCwpI8x7VmJ49zj3+enNNaQ5m9v97rnfOee730XQImvGG5Aw5veVJHNvTj2Bsw2I9wB4hKW4Ydyl0t584d1YRmIWJaWZ4CDwsJghdOYIIExEESKZoJxzyjnrFJksyyNQQDY4uMtJ44BizXhMHbunBGFvASbzcU6fdfOw/0XiEli32Qle2hHAYWj+6wICTn9gelCTnckuuDmWMVwL9HbJ7H5EODHt1UZvql05FKVXOcpjdHtxRUwCo9wBH/Llz4nSei0lmmmvxHwCuvRxWKsBodqBf0TQWt1BxC19FMFMdd9booq/aXBP66JOdSA9g7VQaKz8t+uEMpAPUECw0tdewJJP/b82ILFZhwQSHOQ1KeWMZQy16Yl2MN7DFTp+DOVal92nVM07YMGY/FAivxCRqtxeUJVPC6eUVaGIcJ1oVFWMqM9SNAFeTOXM6lArolgubN3vdl90L2Ch7ywk9JJ6UqAa1uGZAM+50hmhb8m0k1eWEd9kXTqVg98BpA+2IT/y+kMAAAAASUVORK5CYII=
// @downloadURL https://update.greasyfork.org/scripts/453136/AnimeBytes%20Shortcut%20to%20Latest%20Subforum%20Post.user.js
// @updateURL https://update.greasyfork.org/scripts/453136/AnimeBytes%20Shortcut%20to%20Latest%20Subforum%20Post.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var is_coalbytes = document.querySelectorAll('link[href*=coalbytes]').length != 0
    var is_tentacletastic = document.querySelectorAll('link[href*=tentacletastic]').length != 0
    var is_gorgeous = document.querySelectorAll('link[href*=gorgeous]').length != 0

    var hover, not_hover
    if (is_coalbytes) {
        not_hover = "#0090ff"
        hover = "#ed106a"
    } else if (is_tentacletastic) {
        not_hover = "#3c4ab2"
        hover = "#ed106a"
    } else if (is_gorgeous) {
        not_hover = "#f74200"
        hover = "#f74200"
    }

    document.querySelectorAll('strong > a[href*="/forums.php?action=viewthread"][title]').forEach(anchor => {
        let a = document.createElement("a")
        a.text = " ❯"
        a.rel = "external"
        a.style.color = not_hover
        a.style.padding = "0.1rem 0.1rem 0.1rem 0"
        a.style.cursor = "pointer"
        a.addEventListener("mouseenter", () => {
            a.style.color=hover
        }, false)
        a.addEventListener("mouseleave", () => {
            if (a.text == " ❯") {
                a.style.color=not_hover
            }
        }, false)
        a.title = "Go directly to latest post"
        a.addEventListener("click", () => {
            a.style.color = hover
            a.text = "❯";
            window.setInterval( function() {
                if (a.text.length > 3 ) {
                    a.text = "";
                } else {
                    a.text += "❯";
                }
            }, 100);
            GM_xmlhttpRequest({
                method: "GET",
                url: anchor.href,
                onload: (r) => {
                    var container = document.implementation.createHTMLDocument().documentElement;
                    container.innerHTML = r.responseText;
                    let last = container.querySelector("a.last")
                    let next = last ? last.href : anchor.href
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: next,
                        onload: (r2) => {
                            var con2 = document.implementation.createHTMLDocument().documentElement;
                            con2.innerHTML = r2.responseText;
                            var posts = con2.querySelectorAll(".post_id > a:first-child")
                            var last = (posts[posts.length - 1])
                            window.location.href = next + last.hash

                        }
                    })
                }
            })
        }, false)
        anchor.parentNode.parentNode.appendChild(a)
    });
})();
