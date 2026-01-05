// ==UserScript==
// @name         PTH Change default request vote amount
// @version      0.4
// @description  Set the default request vote amount when clicking the [+] vote
// @author       Chameleon
// @include      http*://redacted.ch/*
// @grant        none
// @namespace https://greasyfork.org/users/87476
// @downloadURL https://update.greasyfork.org/scripts/25743/PTH%20Change%20default%20request%20vote%20amount.user.js
// @updateURL https://update.greasyfork.org/scripts/25743/PTH%20Change%20default%20request%20vote%20amount.meta.js
// ==/UserScript==

var amount = 1024; // In MB

(function() {
  'use strict';

  amount=amount*(1024*1024);
  var as=document.getElementsByTagName('a');
  for(var i=0; i<as.length; i++)
  {
    var a=as[i];
    if(a.href.indexOf('javascript:Vote') == -1)
      continue;
    
    a.href = a.href.replace(/Vote\(0/, 'Vote('+amount);
  }
  
  var span=document.createElement('span');
  span.setAttribute('id', 'current_uploaded');
  document.body.appendChild(span);
  span.style.display='none';
  var upAmount=unPretty(document.getElementById('stats_seeding').getElementsByTagName('span')[0].textContent);
  span.innerHTML = upAmount;
  
  var span=document.createElement('span');
  span.setAttribute('id', 'current_downloaded');
  document.body.appendChild(span);
  span.style.display='none';
  var downAmount=unPretty(document.getElementById('stats_leeching').getElementsByTagName('span')[0].textContent);
  span.innerHTML = downAmount;
  
  var span=document.createElement('span');
  span.setAttribute('id', 'current_rr');
  document.body.appendChild(span);
  span.style.display='none';
  var requiredRatio=document.getElementById('stats_required').getElementsByTagName('span')[0].textContent;
  span.innerHTML = requiredRatio;
})();

function unPretty(size)
{
  var s=parseFloat(size);
  if(size.indexOf('KB') != -1)
    s = s*Math.pow(2, 10);
  else if(size.indexOf('MB') != -1)
    s = s*Math.pow(2, 20);
  else if(size.indexOf('GB') != -1)
    s = s*Math.pow(2, 30);
  else if(size.indexOf('TB') != -1)
    s = s*Math.pow(2, 40);
  else if(size.indexOf('PB') != -1)
    s = s*Math.pow(2, 50);

  return Math.round(s);
}
