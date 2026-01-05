// ==UserScript==
// @name        WaniKani Can I has a sect name?
// @author      tomboy
// @namespace   japanese
// @description Always wanted a sect name but Koichi won't give you one? This is the solution :)
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @include     http*://*wanikani.com/chat/*
// @version     1.0
// @grant       GM_registerMenuCommand
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/10847/WaniKani%20Can%20I%20has%20a%20sect%20name.user.js
// @updateURL https://update.greasyfork.org/scripts/10847/WaniKani%20Can%20I%20has%20a%20sect%20name.meta.js
// ==/UserScript==

/*
 * Helper Functions/Variables
 */
$ = unsafeWindow.$;

/*
 * Global Variables/Objects/Classes
 */

var WKUsername = localStorage.getItem("WKSectCheatUsername") || "koichi";
var WKSectame = localStorage.getItem("WKSectCheatSectname") || "awesome";
var WKKlass = localStorage.getItem("WKSectCheatKlass") || "admin"; // admin, lifetime, premium

function GMsetup() {
  if (GM_registerMenuCommand) {
    GM_registerMenuCommand("WaniKani Can I has a sect name?: Manually enter your username", function(){
      var username = prompt("Enter username for WaniKani Can I has a sect name?:");
      if(username){
        localStorage.setItem("WKSectCheatUsername", username);
      }
      location.reload();
    });

    GM_registerMenuCommand("WaniKani Can I has a sect name?: Manually enter your desired sect name", function(){
      var sectname = prompt("Enter your desired sect name for WaniKani Can I has a sect name?:");
      if(sectname){
        localStorage.setItem("WKSectCheatSectname", sectname);
      }
      location.reload();
    });

    GM_registerMenuCommand("WaniKani Can I has a sect name?: Manually enter your desired color", function(){
      var sectcolor = prompt("Enter your desired color (admin, lifetime, premium) for WaniKani Can I has a sect name?:");
      if(sectcolor){
        localStorage.setItem("WKSectCheatKlass", sectcolor);
      }
      location.reload();
    });
  }
}

/*
 * Main
 */
window.addEventListener("load", function (e) {
  GMsetup();
  var base = $(".username:contains('" + WKUsername + "')").parent();
  base.attr('class', "forum-post-author-says " + WKKlass);
  base.find(".group").html("of Sect " + WKSectame);
});
