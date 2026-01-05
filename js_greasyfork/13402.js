//
// ==UserScript==
// @name           hwm_new_lot_top_href
// @author         Pahan https://greasyfork.org/uk/users/18377-pahan
// @namespace      hwm_pahan
// @description    Ссылка на создание нового лота в верхюю часть страницы рынка
// @homepage       https://greasyfork.org/en/users/18377-pahan
// @icon           http://dcdn.heroeswm.ru/avatars/30/nc-5/30547.gif
// @version        1.01
// @encoding 	   utf-8
// @include        http://*heroeswm.ru/auction.php*
// @include        http://*lordswm.com/auction.php*
// @include        http://178.248.235.15/auction.php*
// @grant          GM_deleteValue
// @grant          GM_getValue
// @grant          GM_listValues
// @grant          GM_setValue
// @grant          GM_addStyle
// @grant          GM_log
// @grant          GM_openInTab
// @grant          GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/13402/hwm_new_lot_top_href.user.js
// @updateURL https://update.greasyfork.org/scripts/13402/hwm_new_lot_top_href.meta.js
// ==/UserScript==

function BeBeTDGet(AHTML)
{
  var els = document.getElementsByTagName('td');
  for( var i = 0; i < els.length; i++ )
    if (els[i].innerHTML == AHTML)
      return els[i];
}

function GetActiveLotCount()
{
  var re = /Ваши товары\s+\((\d+)\)/gim;
  var res;
  var LLinks = document.querySelectorAll('a[href*="auction.php?cat=my"]');
  var LLink;
  if (LLinks)
  {                
    for(i = 0; i < LLinks.length; i++)
    {                   
      LLink = LLinks[i];

      if ((res = re.exec(LLink.innerHTML)) != null)
        return parseInt(res[1]);
    }
  }
  return 0;
}

function AddNewLotURL()
{                 
  var LTD = BeBeTDGet('\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438');
  var LCount = GetActiveLotCount();
  LTD.innerHTML =
    '<b><center>' +
    '  <a href="auction_new_lot.php" title="Вами выставлено ' + LCount + ' лотов">' +
    '    Выставить лот (' + LCount + ')' +
    '  </a>' +
    '</center></b>';
}

AddNewLotURL();