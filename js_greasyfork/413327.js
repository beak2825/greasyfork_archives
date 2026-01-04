// ==UserScript==
// @name        Domino Chinese - Flashcard Tone Colors Change
// @namespace   https://eriknewhard.com/
// @description Changes the colors used for tones to match the colors in Anki and MDBG Chinese Dictionary.
// @author      everruler12
// @version     1.1.1
// @match       https://www.dominochinese.com/flashcards
// @grant       none
// @icon        https://www.dominochinese.com/wp-content/uploads/2020/12/cropped-WechatIMG145-192x192.png
// @downloadURL https://update.greasyfork.org/scripts/413327/Domino%20Chinese%20-%20Flashcard%20Tone%20Colors%20Change.user.js
// @updateURL https://update.greasyfork.org/scripts/413327/Domino%20Chinese%20-%20Flashcard%20Tone%20Colors%20Change.meta.js
// ==/UserScript==

// tone1 blue -> green
// tone2: yellow -> red
// tone3: green -> yellow
// tone4: red -> blue

// blue: #4299e1
// yellow: #ecc94b
// green: #48bb78
// red: #f56565

let s = document.createElement('style')
s.innerHTML = `.text-blue-500 {
  color: #48bb78 !important;
}

.text-yellow-500 {
  color: #f56565 !important;
}

.text-green-500 {
  color: #ecc94b !important;
}

.text-red-500 {
  color: #4299e1 !important;
}`

document.head.append(s)

console.log('Domino Chinese - Flashcard Tone Colors changed')