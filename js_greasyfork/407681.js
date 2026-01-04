// ==UserScript==
// @name         button for me tetr.JS short
// @namespace    http://tampermonkey.net/
// @version      1.31
// @author       ore100
// @description  20-07-25
// @include      */tetr.js*
// @match        http://farter*/t*
// @match        https://doktorocelot.com/tetr.js/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407681/button%20for%20me%20tetrJS%20short.user.js
// @updateURL https://update.greasyfork.org/scripts/407681/button%20for%20me%20tetrJS%20short.meta.js
// ==/UserScript==


(function() {
    window.addEventListener('load', function(){
time.style.position = "absolute";time.style.left="1.4in";time.style.bottom="3in";time.style.transform="scale(2,2)";a.style.bottom="-70px";b.style.bottom="-1in";c.style.bottom="-0.8in";
key = `
⤓"119"49"76"22
↷"209"223"68"22
↶"141"302"68"22
→"-181"-20"68"22
←"-65"-19"76"22
↓"108"-89"80"1
⇄"0"69"80"1
⟳"0"242"80"1
`
lines = key.split("\n")
ids = ["", "touchDrop", "touchRotRight", "touchRotLeft", "touchRight", "touchLeft", "touchDown", "touchHold", "touchRot180"]

for (var i = 0; i < lines.length; i++) {
    if(lines[i]){
        pos = lines[i].split("\"")
        x = document.getElementById(ids[i]).style
        x.marginLeft= pos[1] + "px";
        x.marginTop= pos[2] +"px";
        x.maxWidth= pos[3] + "px";
        x.paddingBottom= pos[4] + "px";
        x.backgroundColor="#87cefa";
        x.opacity="0.3";
        x.border="3px solid #fff";
        console.log(x)
}
}
});
})();
//width360 on pc chrome dev tool