// ==UserScript==
// @name         Ayashii Breaker
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  Adds a button to instantly add line breaks to your post!
// @author       Anonymous-san
// @match        https://ayashii.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ayashii.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461325/Ayashii%20Breaker.user.js
// @updateURL https://update.greasyfork.org/scripts/461325/Ayashii%20Breaker.meta.js
// ==/UserScript==

/*
                                       あやしいブレイク工業


                  _
                 ◎＼
                /X/X∥
               /X/X/∥
              /X/X/ ∥
             /X/X/  ∥
            /X/X/   ∥
           /X/X/    ∥
          /X/X/     ∥
         /X/X/      ∥                     [LONGPOST]
      __/X/X/       ∥                [LONGPOST][LONGPOST]
     / /X/X/ ￣|    ∥           [LONGPOST][LONGPOST][LONGPOST]
 ___/_/X/X/´ｰ`|    ∥        [LONGPOST][LONGPOST][LONGPOST][LONGPOST][LONGPOST]
|__σ＼/X/|____|    ●   [LONGPOST][LONGPOST][LONGPOST][LONGPOST][LONGPOST][LONGPOST]
 (◎◎◎◎)=))=)
  ~~~~~~~~￣ ￣



                Break alright Break alright Now we're ready for your BBS
               Dismantle away Dismantle away The just one rule we'll obey
          Conclusion of the duration is comin'up, Concrete is losin' its unity
           There are the delayers of buildin' our peaceful days Break'em out!
                    AYASHII Break KOGYO Smashin' steel ball Da Da Da!
     AYASHII Break KOGYO Chemical anchor bolt driven to beat&wave the hardest rock!!
            Any texts! Any lines! And any comments can't stop us in any way!
                      Going ahead! Going ahead! AYASHII Break KOGYO

             Break alright Break alright Terrible defective formatting mess
                Longposts, teh raegs and copy pasted texts over internets
Have you ever seen mighty skills to treat pile heads, rough clenched fists to support you
           By the justice, like a hammer, Yumbo swung to raise!! Break'em out!
                  AYASHII Break KOGYO Shinin' diamonded cutter Da Da Da
        AYASHII Break KOGYO Compressor roaring loud between the earth & the sky!!
            Any texts! Any lines! And any comments can't stop us in any way!
                     Going ahead! Going ahead! AYASHII Break KOGYO
*/

(function() {
    'use strict';

    function breaker() {
        const MAX_LENGTH = 72;
        let lines = document.getElementById('contents1').value.split('\n');
        let newlines = [];
        for (let i in lines) {
            if (lines[i].charAt(0) == ">") {
                newlines.push(lines[i]);
                continue;
            }
            let idx = 0;
            let words = lines[i].split(' ').filter(w => w.trim() != "");
            let newline = "";
        for (let word of words) {
            if (idx+word.length > MAX_LENGTH) {
               newline += '\n';
               idx = 0;
        }
        newline += word + ' ';
        idx += word.length + 1;
	}

            newlines.push(newline.trim());
        }
        document.getElementById('contents1').value = newlines.join('\n');
    }

function addButton() {
    var element = document.querySelector('[title="Alt(+Shift)+K"]');
    var newElement = ' <input type="button" id="breakbutt" value="Make line breaks"> '
    element.insertAdjacentHTML('afterend', newElement);
    document.getElementById("breakbutt").addEventListener("click", breaker, false);
}


    addButton();
})();