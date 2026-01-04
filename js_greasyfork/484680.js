// ==UserScript==
// @name         Merriam-Webster to Daniel Jones Phonetic Converter
// @namespace
// @version      0.1.2
// @description  Convert Merriam-Webster phonetic symbols to Daniel Jones phonetic symbols.
// @author       WANG Lei
// @match        https://www.merriam-webster.com/dictionary/*
// @icon         https://www.merriam-webster.com/favicon.svg
// @run-at       document-end
// @grant        none
// @license      GNU GPLv3
// @namespace https://www.merriam-webster.com/dictionary/*
// @downloadURL https://update.greasyfork.org/scripts/484680/Merriam-Webster%20to%20Daniel%20Jones%20Phonetic%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/484680/Merriam-Webster%20to%20Daniel%20Jones%20Phonetic%20Converter.meta.js
// ==/UserScript==

(function () {
    "use strict"

    const show_webster = true

    function convertPhoneticSymbol(mw) {
        let nwt = mw.trim()
        let text = nwt

        const replacements = [
            ["ər", "ɚ"], // further, merger, bird
            ["ȯi", "ɔɪ"], // coin, destroy
            ["i", "ɪ"], // tip, banish, active
            ["e", "ɛ"], // bet, bed, peck
            ["ō", "oʊ"], // bone, know, beau
            ["ȯ", "ɔː"], // saw, all, gnaw, caught
            ["u̇", "ʊ"], // pull, wood, book
            ["ü", "uː"], // rule, youth, union, few
            ["a", "æ"], // mat, map, mad, gag, snap, patch
            ["au̇", "aʊ"], // now, loud, out
            ["æʊ", "aʊ"],
            ["ī", "aɪ"], // site, side, buy, tripe
            ["ā", "eɪ"], // day, fade, date, aorta, drape, cape
            ["ä", "ɑː"], // bother, cot
            ["sh", "ʃ"], // shy, mission, machine, special
            ["zh", "ʒ"], // vision, azure
            ["j", "dʒ"], // job, gem, edge, join, judge
            ["ch", "tʃ"], // chin, nature
            ["th", "θ"], // thin, ether
            ["t͟h", "ð"], // then, either, this
            ["y", "j"], // yard, young, cue, curable, few, fury, union
            ["ᵊl", "l̩"], // bottle
            ["ᵊm", "m̩"], // open
            ["ᵊn", "n̩"], // cotton
            ["ᵊŋ", "ŋ̍"] // and
        ]


        replacements.forEach(([from, to]) => {
            text = text.replaceAll(from, to)
        });

        let syllables = text.split("-")
        let newSyllables = syllables.map(syllable => {
            if (isStress(syllable[0])) {
                // beat, nosebleed, evenly, easy
                // humdrum, abut
                return syllable.replaceAll("ē", "iː").replaceAll("ə", "ʌ")
            } else {
                return syllable.replaceAll("ē", "i") // easy, mealy
            }
        })

        text = newSyllables.join("-")

        if (show_webster) {
            return nwt + " | " + text + "\u00A0"
        }
        return text + "\u00A0"
    }


    function isStress(c) {
        return ['ˈ', 'ˌ'].includes(c);
    }

    $(document).ready(function () {
        let pron1 = Array.from(document.getElementsByClassName("play-pron-v2"))
        pron1.map((e) => {
            e.firstChild.data = convertPhoneticSymbol(e.firstChild.data)
        })

        let pron2 = Array.from(document.getElementsByClassName("mw"))
        pron2.map((e) => {
            e.textContent = convertPhoneticSymbol(e.textContent)
        })
    })
})()