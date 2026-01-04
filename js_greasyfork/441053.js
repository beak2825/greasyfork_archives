// ==UserScript==
// @name        noah Autoplay
// @author       Tehapollo
// @version      1.0
// @include      /^https://(www\.mturkcontent|.*\.s3\.amazonaws)\.com/
// @include      *mturkcontent.com*
// @include      *s3.amazonaws.com*
// @require      https://code.jquery.com/jquery-latest.min.js
// @namespace    http://tampermonkey.net/
// @description  Auto Play
// @downloadURL https://update.greasyfork.org/scripts/441053/noah%20Autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/441053/noah%20Autoplay.meta.js
// ==/UserScript==
(function check() {
if ($("p:contains('Video 1')").length && !$("b:contains('Audio:')").length) {
if ( !$(`[id="crowd-elements-loading-dimmer"]`).length ){
if ($("b:contains('Text:')").length){
document.querySelector("FORM > *").shadowRoot.querySelector("DIV.annotation-area.target > *").style.backgroundColor = 'pink';
}


document.addEventListener("keydown", function(e){
if (e.keyCode == 49 ||e.keyCode == 97){
setTimeout(function(){
document.querySelector("FORM > *").shadowRoot.querySelector(`[type="submit"]`).click();
},200);}

else if (e.keyCode == 50 ||e.keyCode == 98){
setTimeout(function(){
document.querySelector("FORM > *").shadowRoot.querySelector(`[type="submit"]`).click();
},200);}

else if (e.keyCode == 51 ||e.keyCode == 99){
$('video')[0].play();
$('video')[1].play();
}
});
window.focus();
document.querySelector("FORM > *").shadowRoot.querySelector("DIV.annotation-area.target > *").addEventListener('click', function(){
$('video')[0].play();
$('video')[1].play();
	});
}
else if ( $(`[id="crowd-elements-loading-dimmer"]`).length ){
setTimeout(function(){
check();

    return;

},50);
}
}
})();



