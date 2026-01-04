// ==UserScript==
// @name        noah Autoplay sound videos
// @author       Tehapollo
// @version      1.0
// @include      /^https://(www\.mturkcontent|.*\.s3\.amazonaws)\.com/
// @include      *mturkcontent.com*
// @include      *s3.amazonaws.com*
// @require      https://code.jquery.com/jquery-latest.min.js
// @namespace    http://tampermonkey.net/
// @description  Auto Play
// @downloadURL https://update.greasyfork.org/scripts/441054/noah%20Autoplay%20sound%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/441054/noah%20Autoplay%20sound%20videos.meta.js
// ==/UserScript==
(function check() {
if ($("p:contains('Audio 1')").length ) {
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
if ( $(`audio`).length ){
$('audio')[0].play();
setTimeout(function(){
$('audio')[1].play();
},3200);
}
else if ( $(`video`).length ){
$('video')[0].play();
setTimeout(function(){
$('video')[1].play();
},3200);
}
}
});
window.focus();
document.querySelector("FORM > *").shadowRoot.querySelector("DIV.annotation-area.target > *").addEventListener('click', function(){
if ( $(`audio`).length ){
$('audio')[0].play();
setTimeout(function(){
$('audio')[1].play();
},3200);
}
else if ( $(`video`).length ){
$('video')[0].play();
setTimeout(function(){
$('video')[1].play();
},3200);
}
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



