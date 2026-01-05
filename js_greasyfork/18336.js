// ==UserScript==
// @name         IndieGala_GetKey&Gift
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  shows how to use babel compiler
// @author       lenceliu
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.6.15/browser-polyfill.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.6.15/browser.min.js
// @match        https://www.indiegala.com/profile*
// @downloadURL https://update.greasyfork.org/scripts/18336/IndieGala_GetKeyGift.user.js
// @updateURL https://update.greasyfork.org/scripts/18336/IndieGala_GetKeyGift.meta.js
// ==/UserScript==
$ = unsafeWindow.jQuery;
var fn = (function getKey() {
  var collapse = [
    'collapseMonthly',
    'collapseSpecial',
    'collapseMonday',
    'collapseFriday',
    'collapseGiveaway'
  ];
  var result = '';
  var allElements = [
  ];
  var GameTitle = '';
  var GameKey = '';
  var count = 0;
  clearbox();
  $('#giftmessage').show();
  //发现个bug加了一个判断条件 2016-3-29
  var keybox = document.getElementById('keybox');
  //  if (keybox === null)
  //  {
  //    $('#library-contain.account-settings').before('<div id="keybox" style="margin-top: 10px; margin-bottom: 10px;"></div>');
  //  }
  for (var i in collapse)
  {
    p1 = document.getElementById(collapse[i]);
    //发现个bug加了一个判断条件 2016-3-28
    if (p1 !== null && p1.getAttribute('aria-expanded') == 'true')
    {
      p2 = p1.getElementsByClassName('panel-heading');
      for (var j = 0; j < p2.length; j++)
      {
        if (p2[j].getElementsByTagName('a') [0].getAttribute('aria-expanded') == 'true')
        {
          var bundleTitle = p2[j].getElementsByTagName('a') [0].textContent;
          var bundleId = p2[j].getElementsByTagName('a') [0].id;
          p3 = p1.getElementsByClassName('panel-collapse collapse in');
          for (var m = 0; m < p3.length; m++)
          {
            if (collapse[i] !== 'collapseGiveaway')
            {
              $('#bundletitlebox').append('<P><Strong>' + 'Indiegala - ' + bundleTitle + '</Strong> </P>');
            }
            if (p3[m].getAttribute('id').includes(bundleId))
            {
              allElements = p3[m].getElementsByClassName('game-key-string');
              for (var n = 0; n < allElements.length; n++)
              {
                GameTitle = allElements[n].getElementsByClassName('span-title') [0].getElementsByTagName('A') [0].textContent; //innerText改为textContent兼容firefox 2016-3-30
                var keysection = allElements[n].getElementsByClassName('span-key steam-btn') [0].getElementsByTagName('A') [0];
                if (keysection !== undefined)
                {
                  if (keysection.href.includes('javascript'))
                  {
                    GameKey = 'The key has not been redeemed.';
                  } 
                  else {
                    GameKey = keysection.href;
                  }
                } 
                else
                {
                  keysection = allElements[n].getElementsByClassName('input-block-level margin text_align_center keys') [0];
                  if (keysection !== undefined)
                  {
                    GameKey = keysection.value;
                  } 
                  else
                  {
                    GameKey = allElements[n].getElementsByClassName('span-key steam-btn') [0].textContent; //innerText改为textContent兼容firefox 2016-3-30
                  }
                }
                if (name_switcher.checked)
                {
                  result = result + GameTitle + ', ' + GameKey + '\n';
                } 
                else
                {
                  result = result + GameKey + '\n';
                }
                count++;
              }
            }
          }
        }
      }
    } 
    else
    {
    }
  }
  giftmessage.value = result;
  $('#statusbox').append('<P><Strong>' + 'Count: ' + count + '</Strong> </P>');
}
);
var fn1 = (function getGift() {
  var collapse = [
    'collapseMonthly',
    'collapseSpecial',
    'collapseMonday',
    'collapseFriday',
    'collapseGiveaway'
  ];
  var result = '';
  var allElements = [
  ];
  var GameTitle = '';
  var Gift = '';
  var count = 0;
  clearbox();
  $('#giftmessage').show();
  //发现个bug加了一个判断条件 2016-3-29
  var keybox = document.getElementById('keybox');
  //  if (keybox === null)
  //  {
  //    $('#library-contain.account-settings').before('<div id="keybox" style="margin-top: 10px; margin-bottom: 10px;"></div>');
  //  }
  for (var i in collapse)
  {
    p1 = document.getElementById(collapse[i]);
    //发现个bug加了一个判断条件 2016-3-28
    if (p1 !== null && p1.getAttribute('aria-expanded') == 'true')
    {
      p2 = p1.getElementsByClassName('panel-heading');
      for (var j = 0; j < p2.length; j++)
      {
        if (p2[j].getElementsByTagName('a') [0].getAttribute('aria-expanded') == 'true')
        {
          var bundleTitle = p2[j].getElementsByTagName('a') [0].textContent; //innerText改为textContent兼容firefox 2016-3-30
          p3 = p1.getElementsByClassName('panel-collapse collapse in');
          for (var m = 0; m < p3.length; m++)
          {
            $('#bundletitlebox').append('<P><Strong>' + 'Indiegala - ' + bundleTitle + '</Strong> </P>');
            allElements = p3[m].getElementsByClassName('gift-links-box');
            for (var n = 0; n < allElements.length; n++)
            {
              //GameTitle=allElements[k].getElementsByClassName("span-title")[0].getElementsByTagName("A")[0].textContent; //innerText改为textContent兼容firefox 2016-3-30
              GameTitle = allElements[n].getElementsByClassName('title_gift_in') [0].getElementsByTagName('A') [0].textContent; //innerText改为textContent兼容firefox 2016-3-30
              Gift = allElements[n].getElementsByClassName('title_gift_in') [0].getElementsByTagName('A') [0].href;
              if (name_switcher.checked)
              {
                result = result + GameTitle + ', ' + Gift + '\n';
              } 
              else
              {
                result = result + Gift + '\n';
              }
              count++;
            }
          }
        }
      }
    } 
    else
    {
    }
  }
  giftmessage.value = result;
  $('#statusbox').append('<P><Strong>' + 'Count: ' + count + '</Strong> </P>');
}
);
var fn2 = (function getLink() {
  var collapse = [
    'collapseMonthly',
    'collapseSpecial',
    'collapseMonday',
    'collapseFriday',
    'collapseGiveaway'
  ];
  var result = '';
  var allElements = [
  ];
  var GameTitle = '';
  var GameLink = '';
  var count = 0;
  clearbox();
  $('#giftmessage').hide();
  //发现个bug加了一个判断条件 2016-3-29
  var keybox = document.getElementById('keybox');
  //  if (keybox === null)
  //  {
  //    $('#library-contain.account-settings').before('<div id="keybox" style="margin-top: 10px; margin-bottom: 10px;"></div>');
  //  }
  for (var i in collapse)
  {
    p1 = document.getElementById(collapse[i]);
    //发现个bug加了一个判断条件 2016-3-28
    if (p1 !== null && p1.getAttribute('aria-expanded') == 'true')
    {
      p2 = p1.getElementsByClassName('panel-heading');
      for (var j = 0; j < p2.length; j++)
      {
        if (p2[j].getElementsByTagName('a') [0].getAttribute('aria-expanded') == 'true')
        {
          var bundleTitle = p2[j].getElementsByTagName('a') [0].textContent; //innerText改为textContent兼容firefox 2016-3-30
          var bundleId = p2[j].getElementsByTagName('a') [0].id;
          p3 = p1.getElementsByClassName('panel-collapse collapse in');
          for (var m = 0; m < p3.length; m++)
          {
            if (collapse[i] !== 'collapseGiveaway')
            {
              $('#bundletitlebox').append('<P><Strong>' + 'Indiegala - ' + bundleTitle + '</Strong> </P>');
            }
            if (p3[m].getAttribute('id').includes(bundleId))
            {
              allElements = p3[m].getElementsByClassName('game-key-string');
              for (var n = 0; n < allElements.length; n++)
              {
                GameTitle = allElements[n].getElementsByClassName('span-title') [0].getElementsByTagName('A') [0].textContent; //innerText改为textContent兼容firefox 2016-3-30
                GameLink = allElements[n].getElementsByClassName('span-title') [0].getElementsByTagName('A') [0].href;
                result = result + '<P>' + (n + 1) + ', ' + '<a target="_blank" class="game-steam-url" href="' + GameLink + '">' + GameTitle + '</a>' + ', ' + GameLink + '</P>';
                count++;
              }
            }
          }
        }
      }
    } 
    else
    {
    }
  }
  $('#statusbox').append(result);
  $('#statusbox').append('</br><P><Strong>' + 'Count: ' + count + '</Strong> </P>');
}
);
var fn3 = (function clearbox()
{
  bundletitlebox.textContent = '';
  giftmessage.value = '';
  statusbox.textContent = '';
  $('#giftmessage').show();
}
);
$('#library-contain.account-settings').before('<div id="buttonbox" style="margin-top: 10px; margin-bottom: 10px;"></div>');
$('#library-contain.account-settings').before('<div id="bundletitlebox" style="margin-top: 10px; margin-bottom: 0px;"></div>');
$('#library-contain.account-settings').before('<div id="keybox" style="margin-top: 10px; margin-bottom: 0px;"></div>');
$('#library-contain.account-settings').before('<div id="statusbox" style="margin-top: 10px; margin-bottom: 0px;"></div>');
$('#buttonbox').append('<button onclick="getKey()" class="order-button-profile">GetKey</button> ');
$('#buttonbox').append('<button onclick="getGift()" class="order-button-profile">GetGift</button>');
$('#buttonbox').append('<button onclick="getLink()" class="order-button-profile">GetLink</button>');
$('#buttonbox').append('<button onclick="clearbox()" class="order-button-profile">Clear</button>');
$('#buttonbox').append('</br><input id="name_switcher" style="margin-top: 10px;" type="checkbox" name="checkbox" checked>Show the Game Title</label>');
$('#keybox').append('<textarea rows="15" cols="80" name="message" id="giftmessage" style="height:280px;width:100%;");></textarea>');
var script = document.createElement('script');
script.setAttribute('type', 'application/javascript');
script.textContent = fn; //innerText改为textContent兼容firefox 2016-3-30 
document.body.appendChild(script);
var script1 = document.createElement('script');
script1.setAttribute('type', 'application/javascript');
script1.textContent = fn1; //innerText改为textContent兼容firefox 2016-3-30
document.body.appendChild(script1);
var script2 = document.createElement('script');
script2.setAttribute('type', 'application/javascript');
script2.textContent = fn2; //innerText改为textContent兼容firefox 2016-3-30
document.body.appendChild(script2);
var script3 = document.createElement('script');
script3.setAttribute('type', 'application/javascript');
script3.textContent = fn3; //innerText改为textContent兼容firefox 2016-3-30
document.body.appendChild(script3);
