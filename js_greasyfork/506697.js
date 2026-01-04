// ==UserScript==
// @version     0.01
// @name        Xbox deals
// @namespace   https://www.dealabs.com/
// @description	Xbox deals, detect no french deals
// @author      ced
// @include     https://www.dealabs.com/search?merchant*
// @include     https://www.dealabs.com*
// @grant       none
// @license     MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/506697/Xbox%20deals.user.js
// @updateURL https://update.greasyfork.org/scripts/506697/Xbox%20deals.meta.js
// ==/UserScript==
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function modify_css()   
{     
if ( window.location.href.includes('https://www.dealabs.com'))  
   {    
   if ( document.getElementById("content-list") )
      document.getElementById("content-list").parentElement.style.background="#35373b";

   var divs = document.getElementsByClassName("page-center");
   for (i=0;i<divs.length;i++)  
       {
       divs[i].parentElement.style.background="#35373b";  // #35373b
       } 
   }  
} 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function purgeVPN_XBOX_deals()   
{  
const MyArray = ["turq","Turq","turc","Turc","argentine","Argentine","egypt","Egypt","nigeria","Nigeria","nigéria","Nigéria","nigerien","brezil","Brezil","brézil","Brézil"];
  
if ( window.location.href.includes('https://www.dealabs.com/search?merchant-id=38'))  
   {
   var strongs = document.getElementsByTagName("strong");
   for (i=0;i<strongs.length;i++)  
       {     
       for (j=0;j<MyArray.length;j++) 
           if ( strongs[i].innerHTML.includes(MyArray[j]))  
              {
              strongs[i].style.color="#ff0000";
              strongs[i].parentElement.parentElement.style.backgroundColor="#ffffff";
              strongs[i].parentElement.parentElement.innerHTML="<div><strong>Deal VPN</strong></div>";
              }   
       } 
   
   var sections = document.getElementsByTagName("section");
   for (i=0;i<sections.length;i++)  
       {
       sections[i].parentElement.parentElement.style.backgroundColor="#35373b";  // #35373b
       }     
   }  
} 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
modify_css();
purgeVPN_XBOX_deals(); 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////