// ==UserScript==
// @name            AnimeBytes Yen Log Summarizer
// @author          sabs (like "sobs"), sabs@sobs.moe
// @namespace       sabs
// @version         8
// @description     Counting to a million before you can say "gotcha!"
// @match           https://animebytes.tv/user/yenlog*
// @match           https://animebytes.tv/konbini
// @homepageURL     https://animebytes.tv/forums.php?action=viewthread&threadid=28138
// @grant GM_xmlhttpRequest
// @grant GM_log
// @icon data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABb2lDQ1BpY2MAACiRdZE7SwNBFIW/JEp8YqFFEIsUUSwiiIJop7FIEyTECEZtNutuIiTrspsgwVawsQhYiDa+Cv+BtoKtgiAogoiNf8BXI7LeMUJEdJbZ+3FmzmXmDPgTBb3oNgxC0So5qXgsPJuZCwcfaSaEnyBjmu7aE8lkgn/H2zU+Va8GVK//9/05WhcNVwdfk/CIbjsl4XHhxErJVrwh3KXntUXhPeGoIwcUPld6tsYPinM1flHspFOT4Fc9w7kfnP3Bet4pCvcLR4qFsv59HnWTNsOamZbaLbMHlxRxYoTJUmaJAiUGpFqS2d++wS/fFMvi0eVvU8ERR468eKOilqWrIdUU3ZCvQEXl/jtP1xweqnVvi0Hjvec990JwEz6qnve+73kfBxC4g1Or7l+WnEZfRa/WtcgudKzB8Vldy27ByTqEbm3N0b6kgEy/acLTEbRnoPMSWuZrWX2vc3gD6VV5ogvY3oE+2d+x8AnhZWf8PQBFKQAAAAlwSFlzAAALEgAACxIB0t1+/AAAAbRJREFUOMudU00oRFEUPucOZjGpec+MorCzGIvZWtsgOz8rU8oCmWEjslAiJUkx4ydlyQpblFKWFsqkLCwpI8x7VmJ49zj3+enNNaQ5m9v97rnfOee730XQImvGG5Aw5veVJHNvTj2Bsw2I9wB4hKW4Ydyl0t584d1YRmIWJaWZ4CDwsJghdOYIIExEESKZoJxzyjnrFJksyyNQQDY4uMtJ44BizXhMHbunBGFvASbzcU6fdfOw/0XiEli32Qle2hHAYWj+6wICTn9gelCTnckuuDmWMVwL9HbJ7H5EODHt1UZvql05FKVXOcpjdHtxRUwCo9wBH/Llz4nSei0lmmmvxHwCuvRxWKsBodqBf0TQWt1BxC19FMFMdd9booq/aXBP66JOdSA9g7VQaKz8t+uEMpAPUECw0tdewJJP/b82ILFZhwQSHOQ1KeWMZQy16Yl2MN7DFTp+DOVal92nVM07YMGY/FAivxCRqtxeUJVPC6eUVaGIcJ1oVFWMqM9SNAFeTOXM6lArolgubN3vdl90L2Ch7ywk9JJ6UqAa1uGZAM+50hmhb8m0k1eWEd9kXTqVg98BpA+2IT/y+kMAAAAASUVORK5CYII=
// @downloadURL https://update.greasyfork.org/scripts/453135/AnimeBytes%20Yen%20Log%20Summarizer.user.js
// @updateURL https://update.greasyfork.org/scripts/453135/AnimeBytes%20Yen%20Log%20Summarizer.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function getUsername() {
        return document.querySelector(".username").text
    }

    function scanForGainLossNet(queryable) {
        queryable.querySelectorAll(".r99").forEach((each) => {
            unsafeWindow.gain += parseInt(each.innerHTML.replaceAll(",", "").replaceAll("¥", ""))
            unsafeWindow.processed++
        })
        queryable.querySelectorAll(".r00").forEach((each) => {
            unsafeWindow.loss += parseInt(each.innerHTML.replaceAll(",", "").replaceAll("¥-", ""))
            unsafeWindow.processed++
        })
    }

    function scanNextPage(next) {
        setTimeout(function() {GM_xmlhttpRequest({
            method: "GET",
            url: next.href,
            onerror: (r) => {
                GM_log(r, unsafeWindow.processed)
                alert("AB Yen Log Summarizer: ran into an error while counting. Maybe too many pages? Open the console with F12 and send sabs the contents, please.")
            },
            onload: (r) => {
                GM_log(r)
                var container = document.implementation.createHTMLDocument().documentElement;
                container.innerHTML = r.responseText;
                scanForGainLossNet(container)
                next = [...container.querySelectorAll(".next-prev")].filter(a => a.textContent.includes("Next"))
                if (next.length) {
                    scanNextPage(next[0])
                } else {
                    drawResults()
                }
            }
        })}, 1100) // just over a second in between
    }

    function startScan() {
        unsafeWindow.gain = 0
        unsafeWindow.loss = 0
        unsafeWindow.processed = 0
        document.querySelectorAll("#computed_results").forEach((e) => {e.remove()})
        scanForGainLossNet(document)
        var next = [...document.querySelectorAll(".next-prev")].filter(a => a.textContent.includes("Next"))
        if (next.length) {
            scanNextPage(next[0])
        } else {
            drawResults()
        }
    }

    function drawResults() {
        window.clearInterval(unsafeWindow.interval)
        var div = document.createElement("span")
        div.id = "computed_results"
        div.style.marginLeft = "1.33em"
        var net_class = unsafeWindow.gain - unsafeWindow.loss > 0 ? "r99" : "r00"
        div.innerHTML = "<b>Total Yen Stats:</b> ¥" + unsafeWindow.gain.toLocaleString('en-US') + " gain - ¥" + unsafeWindow.loss.toLocaleString('en-US') + " loss = <span class='" + net_class + "'>¥" + (unsafeWindow.gain - unsafeWindow.loss).toLocaleString('en-US') + " net</span>"
        unsafeWindow.a.parentNode.append(div)
        unsafeWindow.a.text = "Calculate Yen Stats (starting from this page)"
    }

    if (window.location.pathname === "/konbini") {
        document.querySelector(".box.pad center").innerHTML += "</br>If you would like to check your spending history, see your <a href='/user/yenlog/" + getUsername() + "'>Yen Log</a>."
    } else {
        if (document.querySelectorAll(".box.pad.center").length !== 0){
            return
        }
        let a = document.createElement("a")
        a.addEventListener("click", () => {
            unsafeWindow.n_dots = 1
            unsafeWindow.interval = window.setInterval( function() {
                unsafeWindow.n_dots++
                a.text = "Calculating, " + unsafeWindow.processed + " done so far " + "|/-\\"[unsafeWindow.n_dots % "|/-\\".length]
            }, 100);
            startScan()
        })
        a.className = "btn-sub"
        a.text = "Calculate Yen Stats (starting from this page)"
        unsafeWindow.a = a
        document.querySelectorAll("input[value='Filter']")[0].parentNode.append(a)
    }
})();
