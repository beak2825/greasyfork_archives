// ==UserScript==
// @name         csgoclicker.net custom chat font
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  changes the font you type in chat
// @author       sdoma and aspect but mosly aspect
// @match        https://csgoclicker.net/*
// @icon         https://lh3.googleusercontent.com/ogw/ADea4I6J5Me0wfUtMT4o6e5nHVaKyCFzVxsp1eT2aVxkWw=s83-c-mo
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430550/csgoclickernet%20custom%20chat%20font.user.js
// @updateURL https://update.greasyfork.org/scripts/430550/csgoclickernet%20custom%20chat%20font.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // Comment out the font you don't want and un-comment the one you do want.
     var characterreplacementobject = {}
     var replaced = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
     //var replacers = "ΛＢＣＤΞＦＧＨＩＪＫＬＭＮ♢ＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ"
     var replacers = "ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ"
     //var replacers = "zʎxʍʌnʇsɹbdouɯlʞɾıɥɓɟǝpɔqɐZ⅄XMΛ∩⊥SᴚΌԀONW˥⋊ſIH⅁ℲƎᗡƆᙠ∀".split('').reverse().join('')
     //var replacers = "卂乃匚ᗪ乇千Ꮆ卄丨ﾌҜㄥ爪几ㄖ卩Ɋ尺丂ㄒㄩᐯ山乂ㄚ乙卂乃匚ᗪ乇千Ꮆ卄丨ﾌҜㄥ爪几ㄖ卩Ɋ尺丂ㄒㄩᐯ山乂ㄚ乙"
     //var replacers = "αв¢∂єƒgнιנкℓмησρqяѕтυνωχуzαв¢∂єƒgнιנкℓмησρqяѕтυνωχуz"
     //var replacers = "ΛBᄃDΣFGΉIJKᄂMПӨPQЯƧƬЦVЩXYZΛBᄃDΣFGΉIJKᄂMПӨPQЯƧƬЦVЩXYZ"
     //var replacers = "ᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿˢᵀᵁⱽᵂˣʸᶻᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖqʳˢᵗᵘᵛʷˣʸᶻ"
     //var replacers = "ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ"
     for (var z = 0; replaced.length > z; z++) {
         characterreplacementobject[replaced[z]] = replacers[z] || "🛑"
     }
     var addedchatinputlistener = false
     var attachchatlistener = setInterval(function() {
         var chatinput = document.querySelector("#chatInput")
         if (chatinput.getAttribute('listening') !== null) return clearInterval(attachchatlistener); console.log('Attached listener successfullly.')
         chatinput.addEventListener("input", () => {
             var chatinput = document.querySelector("#chatInput")
             var chatvalarray = document.querySelector("#chatInput").value.split('')
             var inputtospecial = chatvalarray.reduce(function (accumulator, currentValue) {
                 if (Object.keys(characterreplacementobject).find(item => item === currentValue)) {
                     accumulator += characterreplacementobject[currentValue]
                     return accumulator
                 } else {
                     accumulator += currentValue
                     return accumulator
                 }
             }, "")
             document.querySelector("#chatInput").value = inputtospecial
         })
         console.log('Attempted to attach listener.')
         chatinput.setAttribute('listening', true)
     }, 1000)
})();