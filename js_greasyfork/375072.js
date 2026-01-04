// ==UserScript==
// @name			Fetus Deletus
// @version			1.0
// @description		Adds a little bit of Mon- er I mean adds a confirmation whenever smashing that trash can button.
// @match			https://epicmafia.com/*
// @namespace		https://greasyfork.org/users/146029/
// @author			Shwartz99
// @homepage		https://epicmafia.com/user/378333
// @icon			http://i.imgur.com/P2eQO3K.png
// @downloadURL https://update.greasyfork.org/scripts/375072/Fetus%20Deletus.user.js
// @updateURL https://update.greasyfork.org/scripts/375072/Fetus%20Deletus.meta.js
// ==/UserScript==

//just a shoutout to those who helped me

(function() {
    'use strict';
    $("body").on("click", ".icon-trash", function(){
    if(confirm("Are you sure you want to delete this?")){
        return true; //deletus
    }
    else{
        return false; //fetus
    }
  })
})();