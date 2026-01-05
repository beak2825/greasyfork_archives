// ==UserScript==
// @name        literotica
// @namespace   http://domain.com/directory
// @description literotica swf
// @include     *.literotica.com*
// @version     1
// @locale      en-UK
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10739/literotica.user.js
// @updateURL https://update.greasyfork.org/scripts/10739/literotica.meta.js
// ==/UserScript==

var temp=document.getElementsByTagName("img");
if (temp.length>0)
{
  temp[0].width=0;    
}

temp=document.getElementsByClassName("b-story-header");
if (temp.length>0)
{
   var t=temp[0].getElementsByTagName("h1");
  
   if (t.length>0)
     {
       t[0].style.fontSize="10px";
     }
}

temp=document.getElementsByClassName("b-story-user-y");
if (temp.length>0)
{
   var t=temp[0].getElementsByTagName("a");
  
   if (t.length>0)
     {
       t[0].style.fontSize="10px";
     }
}

temp=document.getElementById("logo-footer");
if (temp)
  {
    temp.style.visibility = "hidden";
  }

temp=document.getElementById("logo");
if (temp)
  {
    temp.style.visibility = "hidden";
  }

temp=document.getElementById("content");
if (temp)
  {
  temp=temp.getElementsByTagName("h2");
    
    if (temp.length>0)
      {
        
        for (i = 0; i < temp.length; i++) 
        {
           temp[i].style.fontSize="10px";
       }
        
         
      }
  }


temp=document.getElementsByClassName("contactheader");
if (temp.length>0)
{
  temp[0].style.visibility = "hidden"; 
}


temp=document.getElementsByClassName("b-story-user-y");
if (temp.length>1)
{
   var t=temp[1].getElementsByTagName("a");
  
   if (t.length>0)
     {
       t[0].style.fontSize="10px";
     }
}

temp=document.getElementsByClassName("t-storypage");
if (temp.length>0)
{
     temp[0].style.backgroundImage='none';
  
}

document.body.style.backgroundImage='none';
