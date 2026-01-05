// ==UserScript==
// @name        ayuwage - MainPage
// @namespace   *
// @description www.ayuwage.com - Main - getAlllink and open one
// @include     *members.ayuwage.com/start.php*
// @include https://members.ayuwage.com/refresher.php?next=*
// @version     0.22
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13214/ayuwage%20-%20MainPage.user.js
// @updateURL https://update.greasyfork.org/scripts/13214/ayuwage%20-%20MainPage.meta.js
// ==/UserScript==
//var stopIt = 0;
function doText() {
  //if (stopIt!=0) break;
  var message = '';
  var inputs = document.getElementsByTagName('input');
  var j = 0;
  for (var i = 0; i < inputs.length; i++)
  {
    if (inputs[i].getAttribute('type') == 'button')
    {
      message += inputs[i].value + ', ';
      if (j > 1 && inputs[i].value != 'The Best Online Dating Tips!' && inputs[i] != 'Report Site') {
        //alert(inputs[i].value);
        //stopIt=1;
        myInterval = setInterval(doText, 50000);
        inputs[i].click();
       
        break;
      }
      j++;
    }
  }

}
function F5(){location.reload();}

function changePage() {
  //if (stopIt!=0) break;
  var inputs = document.getElementsByTagName('input');
  
  for (var i = 0; i < inputs.length; i++)
  {
    if (inputs[i].getAttribute('type') == 'button')
    {
      if (j > 1 && inputs[i].value != 'The Best Online Dating Tips!' && inputs[i] != 'Report Site')  break;

    }
  }
  if (i==inputs.length){
      if (window.location.href.indexOf('#start-regular')!=-1) window.location.href = 'https://members.ayuwage.com/start.php#start-view';
      else window.location.href = 'https://members.ayuwage.com/start.php#start-regular';
      
  }
}

var myInterval = setInterval(doText, 2000);
var myInterval2 = setInterval(F5, 60000);
var myInterval2 = setInterval(changePage, 120000);
