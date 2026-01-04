// ==UserScript==
// @name         Wanikani Vocab Mnemonic
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  fetch wanikani vocab mnemonics!
// @author       You
// @match        https://jpdb.io/edit_shown_meanings*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/453842/Wanikani%20Vocab%20Mnemonic.user.js
// @updateURL https://update.greasyfork.org/scripts/453842/Wanikani%20Vocab%20Mnemonic.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let vocab = document.querySelector('.vocabulary').cloneNode(true)
    let rts = vocab.querySelectorAll('rt')
    rts.forEach(function(rt) { rt.remove() })

    console.log("Searching wanikani vocab mnemonic for: ", vocab.innerText)

    let url = "https://api.wanikani.com/v2/subjects?types=vocabulary&slugs="+vocab.innerText
    console.log(url)
    GM_xmlhttpRequest ( {
        method:     'GET',
        url:        encodeURI(url),
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer d655c5f5-4d31-4938-b086-427d62dbd479"
        },
        onload: function (data) {
            let respData = JSON.parse(data.response);
            console.log(respData)
            let textarea = document.querySelector('textarea')

            if (respData.data.length == 0) {
                textarea.value = "vocabulary not found"
                return
            }

            let meaning = respData.data[0].data.meaning_mnemonic
            meaning = meaning.replace(/<radical>|<\/radical>/g, "**").replace(/<reading>|<\/reading>/g, "**").replace(/<ja>|<\/ja>/g, "**").replace(/<kanji>|<\/kanji>/g, "***").replace(/<meaning>|<\/meaning>/g, "***").replace(/<vocabulary>|<\/vocabulary>/g, "***")

            let reading = respData.data[0].data.reading_mnemonic
            reading = reading.replace(/<radical>|<\/radical>/g, "**").replace(/<reading>|<\/reading>/g, "**").replace(/<ja>|<\/ja>/g, "**").replace(/<kanji>|<\/kanji>/g, "***").replace(/<meaning>|<\/meaning>/g, "***").replace(/<vocabulary>|<\/vocabulary>/g, "***")

            textarea.value = `# Meaning
${meaning}

# Reading
${reading}`
        },
        onerror:     function (resp) {
            // DO ALL RESPONSE PROCESSING HERE...
            console.log (
                "GM_xmlhttpRequest() response is:\n",
                resp.responseText.substring (0, 80) + '...'
            );
        }
    });
})();