// ==UserScript==
// @name     egybest_adblock
// @description     this script will work only after you refresh the page!
// @version  1.1.7
// @include https://egy.best/movie/*
// @include https://egy.best/episode/*
// @namespace https://greasyfork.org/users/178233
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/40311/egybest_adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/40311/egybest_adblock.meta.js
// ==/UserScript==

var watcha = document.getElementById('watch_dl');
var headers = document.getElementsByTagName('strong');
var menu2 = '1';
var popo = '<button onclick="window.location.reload()">refresh</button>';
var popo1 = '<button onclick="myFunction()">reload</button>';

function myFunction() { var firstDiv = document.getElementById('watch_dl'); var secondDiv = document.getElementById('goska'); secondDiv.innerHTML =  firstDiv.innerHTML; 
                      alert();
                      }
for (i=0; i<headers.length; i++)
{
  // Determine menu2 text
  var thismenu2 = headers[i].innerHTML;
  thismenu2 = thismenu2.replace(/\<[^\>]*\>/g, ''); // Remove HTML tags
  thismenu2 = thismenu2.replace(/\[[^\]]*\]/g, ''); // Remove anything within square brackets

  // Create menu2 item
  var thisid = headers[i].id;
  if (thisid == '')
  {
    thisid = 'h2header' + i;
    headers[i].id = thisid;
  }
//  menu2 += '';
}

// Create menu2
if (menu2 != '')
{
  
  menu3obj = document.createElement('div');
  menu3obj.id = 'goska';
  menu3obj.style.backgroundColor = '#fff';
  menu3obj.style.margin = 'auto';
  menu3obj.style.width = '62%';
  menu3obj.style.position = 'relative';
  menu3obj.style.left = '3%';
  menu3obj.innerHTML = watcha.innerHTML;
  body = document.getElementsByTagName('body')[0];
  body.appendChild(menu3obj);
  
  menu4obj = document.createElement('div');
  menu4obj.style.backgroundColor = '#fff';
  menu4obj.style.margin = 'auto';
  menu4obj.style.width = '62%';
  menu4obj.style.position = 'relative';
  menu4obj.style.left = '3%';
  menu4obj.innerHTML = popo + popo1;
  body = document.getElementsByTagName('body')[0];
  body.appendChild(menu4obj);
  
}

