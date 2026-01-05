// ==UserScript==
// @name        Wykop.pl - Wyniki ankiety
// @namespace   Wykop scripts
// @description Umożliwia podgląd wyników ankiety bez oddawania głosu
// @include     http://www.wykop.pl/wpis/*
// @include     http://www.wykop.pl/mikroblog/*
// @include     http://www.wykop.pl/tag/*
// @include     http://www.wykop.pl/ludzie/*
// @version     1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18180/Wykoppl%20-%20Wyniki%20ankiety.user.js
// @updateURL https://update.greasyfork.org/scripts/18180/Wykoppl%20-%20Wyniki%20ankiety.meta.js
// ==/UserScript==

 
(function(){

  function addButtons()
  {
    var polls = document.getElementsByClassName('row box wblock dC survey');
    var pollURL, timeNode, button;
    var fun;

    for(var i=0; i<polls.length; ++i)
    {
      if(polls[i].getAttribute('pollHasButton')=='1')
        continue;
      timeNode = polls[i].parentNode.getElementsByTagName('time');
      if(timeNode.length>0 && timeNode[0].parentNode && timeNode[0].parentNode.parentNode && timeNode[0].parentNode.parentNode.href)
      {
        pollURL = timeNode[0].parentNode.parentNode.href;
        button = document.createElement('a');
        fun = new Function('fetch("'+pollURL+'", {mode: "cors"}) .then(function(response) {  return response.text();      }) .then(function(text) { var k, tmpRes; var vpri = document.getElementById("viewPollResults_' + i + '"); var pn = vpri.parentNode; var lis = pn.getElementsByTagName("li");  var parser=new DOMParser(); var htmlDoc=parser.parseFromString(text, "text/html");  var lis2 = htmlDoc.getElementById("surveyBox").getElementsByTagName("li");  for(k=0; k<((lis2.length>lis.length)?lis.length:lis2.length); ++k)  { tmpRes=document.createElement("span"); tmpRes.innerHTML = lis2[k+lis2.length/2].getElementsByTagName("div")[0].innerHTML;   tmpRes.style.cssFloat = "right";  lis[k].appendChild(tmpRes);  } pn.removeChild(vpri); }) .catch(function(error) {   console.log("fetch() failed", error)  });');
        button.addEventListener('click', fun, false);
        button.id = 'viewPollResults_' + i;
        button.className = 'viewPollResults';
        button.innerHTML = 'Wyniki';
        if((polls[i].getElementsByClassName('viewPollResults')).length==0)
        {
          polls[i].appendChild(button);
          polls[i].setAttribute('pollHasButton', '1');
        }
      }
    }  
  }
  document.addEventListener('DOMContentLoaded', addButtons, false);
  document.addEventListener('DOMNodeInserted', addButtons, false);

  // addButtons(); /* odkomentuj, jeśli chcesz użyć kodu jako skryptozakładkę/bookmarklet */
})();
