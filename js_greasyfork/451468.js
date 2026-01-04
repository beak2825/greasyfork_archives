// ==UserScript==
// @name         Jabiru helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @include      https://gazellegames.net/forums.php?action=viewthread&threadid=27331*
// @description  Counts cp/ip letters
// @author       KSS
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451468/Jabiru%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/451468/Jabiru%20helper.meta.js
// ==/UserScript==

(function() {
    $("#reply_box").before('<input id="word" type="text" placeholder="word"/>');
    $("#reply_box").before('<input id="guess" type="text" placeholder="guess"/>');
    $("#reply_box").before('<input id="check" type="button" value="Check"/>');
    $("#check").click(function() {
        var word = $("#word")[0].value;
        var guess = $("#guess")[0].value;
        var cp = 0;
        var ip = 0
        for(let i=5; i>=0 ; i--){
            if(word[i]==guess[i]){
                cp+=1;
                word=word.slice(0, i) + word.slice(i+1, word.length);
                guess=guess.slice(0, i) + guess.slice(i+1, guess.length);
            }
        }
        for(let i=0; i<word.length ; i++){
            if(guess.includes(word[i])){
                ip+=1;
                guess=guess.replace(word[i],"");
            }
        }
        alert(word+" ; "+guess+" ; "+cp+" ; "+ip)
              })

})();