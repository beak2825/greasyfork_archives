// ==UserScript==
// @name        BlueCat Address Manager Page Size 256
// @namespace   *
// @description Add option for Page Size of 256 in BlueCat Address Manager
// @include     */app*
// @version     3
// @grant       none
// @author      Marius Galm
// @copyright   2018, Marius Galm
// @license		MIT
// @icon        https://www.bluecatnetworks.com/wp-content/uploads/2018/03/cropped-bluecat-favicon-32x32.png
// @downloadURL https://update.greasyfork.org/scripts/38772/BlueCat%20Address%20Manager%20Page%20Size%20256.user.js
// @updateURL https://update.greasyfork.org/scripts/38772/BlueCat%20Address%20Manager%20Page%20Size%20256.meta.js
// ==/UserScript==

if (document.readyState === "interactive" ) {
    // where will we add
    var sels = document.getElementsByTagName("select");
    var selects = [];
    var leng = sels.length;
    for ( var i = 0 ; i < sels.length ; i++ ) {
        // only into PageSize objects
        if (sels[i].hasAttribute("onchange")) {
            if (sels[i].getAttribute("onchange").includes("performChangePageSize")) {
                selects.push(sels[i]);
            }
        }
    }
    // what is pushed in
    var string = "256,512,1024";
    var array = string.split(",");
    // do push
    for ( var j = 0 ; j < selects.length ; j++ ) {
        if(selects[j]){
            for ( var k = 0 ; k < array.length ; k++ ) {
                var val = array[k];
                var option = document.createElement("option");
                option.text = val;
                option.value = val;
                selects[j].appendChild(option);
            }
        }
    }
}