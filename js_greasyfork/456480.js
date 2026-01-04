// ==UserScript==
// @name        Hello Bug
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     3.0
// @author      L.W.Kevin0wvf
// @description 让你的网页充满更多恶搞！（蛤蛤(?)）
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456480/Hello%20Bug.user.js
// @updateURL https://update.greasyfork.org/scripts/456480/Hello%20Bug.meta.js
// ==/UserScript==
(async function(){
    console.log("Hello Bug");
    var q = new String("Hello Bug!");
    alert(q);
    async function runBug()
    {
      var i = 0;
      try
      {
        do{
          i > q.length - 1 ? i = 0 : null;
          alert(q[i]+" - bug");
          i++;
        }while(true);
      }
      catch(e)
      {
        console.error(e+e.stack)
        console.error("Hello Bug!");
      }
      return true;
    }
    alert("Trick or treat!");
    runBug();
})();