// ==UserScript==
// @name        OAG X
// @namespace   OAG eXtention
// @author      OAG Devs
// @include     http://agar.io/
// @version     1.1
// @grant       none
// @description OAG eXtention
// @downloadURL https://update.greasyfork.org/scripts/17195/OAG%20X.user.js
// @updateURL https://update.greasyfork.org/scripts/17195/OAG%20X.meta.js
// ==/UserScript==
$.getScript( "https://drive.google.com/uc?export=download&id=0Bwj_YCavPEMpVlhYTmVKTjZqZzA" )
.done(function( script, textStatus ) {
    $.getScript( "https://drive.google.com/uc?export=download&id=0Bwj_YCavPEMpOWRUeVFMdTJrbkE" );
})
.fail(function( jqxhr, settings, exception ) {
    console.log("fail to load script");
});

setTimeout(function() {
var _frame = '<iframe style="position: fixed;z-index: 99999; width: 200px; height: 200px;top: 75px; left: 0;opacity: 0.5;" src="//www4.cbox.ws/box/?boxid=4288973&boxtag=kq2tnl&sec=main" marginheight="0" marginwidth="0" frameborder="0" width="100%" height="100%" scrolling="auto" allowtransparency="yes" name="cboxmain" id="bdy"></iframe><iframe style="position: fixed;z-index: 99999; width: 200px; height: 75px;bottom: 0; left: 40%;opacity: 0.5;" id="agarblob" src="//www4.cbox.ws/box/?boxid=4288973&boxtag=kq2tnl&sec=form" marginheight="0" marginwidth="0" frameborder="0" width="200px" height="250px" scrolling="no" allowtransparency="yes" name="cboxform" id="cboxform4-4288973"></iframe>';

document.getElementsByTagName("body")[0].insertAdjacentHTML('beforeend',_frame);
document.getElementById("cbox").style.display="none";

}, 10000)();