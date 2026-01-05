// ==UserScript==
// @name        HWM_InfiniteScrollForProtocolPages
// @namespace   Рианти
// @description Бесконечная прокрутка страниц протоколов (добавление содержимого следующей страницы при прокрутке вниз)
// @include     /(heroeswm|178\.248\.235\.15|lordswm)[^\/]+\/(pl_warlog|pl_transfers|pl_cardlog|sklad_log|clan_log)/
// @version     1
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/15941/HWM_InfiniteScrollForProtocolPages.user.js
// @updateURL https://update.greasyfork.org/scripts/15941/HWM_InfiniteScrollForProtocolPages.meta.js
// ==/UserScript==

var _timeoutOnAdding = 0; //ms
var _pixelsFromBottomBeforeAdding = 400;

var _isWarLog = document.location.href.includes('pl_warlog.php');
var _isCardLog = document.location.href.includes('pl_cardlog.php');
var _pageURLpattern = document.location.href.match(/[^\&]+/)[0] + '&page=';
var _addingInProgress = false;
var _curPage = 0;

if(document.location.href.includes('&page=')) _curPage = parseInt(document.location.href.match(/&page=(\d+)/)[1]);

window.addEventListener("scroll", checkIfNearBottom);

checkIfNearBottom();

function checkIfNearBottom(){
  if(_addingInProgress) return;
  var curWindowTop = window.pageYOffset;
  var contentTotalHeight = document.documentElement.clientHeight;
  var availToWebPageScreenHeight = window.innerHeight

  if(contentTotalHeight - _pixelsFromBottomBeforeAdding < curWindowTop + availToWebPageScreenHeight){
    _addingInProgress = true;
    getContentFromPageId(++_curPage, addNewContent);
  }
}

function getContentFromPageId(id, callbackFunc){
  requestPage (_pageURLpattern + id, function (dom){
    var t = dom.querySelector('body').innerHTML;
    t = t.substring(t.indexOf('<!-- big table -->') + 19, t.lastIndexOf('<!-- big table -->'));
    t = t.substring(t.indexOf('</center><br>') + 13, t.lastIndexOf('</td></tr></tbody></table>'));
    t = t.replace('</a></center><br>', '</a></center>');

    if(_isWarLog) t = alterContentForWarlogPage(t);
    if(_isCardLog) t = alterContentForCardlogPage(t);
    callbackFunc(t);
  });
}

function alterContentForCardlogPage(content){
  return '<table width="100%"><tr><td> </td></tr></table>' + content;
}

function alterContentForWarlogPage(content){
  return content.replace(/<a href="warlog\.php\?warid=(\d+)">([^<]+)<\/a>/g,
                        '<a href="warlog.php?warid=$1">$2</a><span>&nbsp;[<a href="http://' + document.location.host + '/war.php?lt=-1&amp;warid=$1" target="_blank">#</a>&nbsp;<a href="http://' + document.location.host + '/battlechat.php?warid=$1" target="_blank">chat</a>&nbsp;<a href="http://' + document.location.host + '/war.php?warid=$1" target="_blank">$</a>&nbsp;<a href="http://' + document.location.host + '/battle.php?lastturn=-3&amp;warid=$1" target="_blank">E</a>]</span>');
}

function addNewContent(contentHTML){
  var parent = document.querySelector('table[border="0"][cellpadding="0"][cellspacing="0"][width="95%"] > tbody > tr > td');
  if(!_isCardLog){
    var newChild = document.createElement('span');
    newChild.innerHTML = contentHTML;
    parent.appendChild(newChild);
  } else {
    parent.innerHTML += contentHTML;
  }
  setTimeout(function(){
    _addingInProgress = false;
    checkIfNearBottom();
  }, _timeoutOnAdding);
}

function requestPage (url, onloadHandler){
    console.log('[HWM_InfiniteScrollForProtocolPages] loading: ', url);
    try{
        GM_xmlhttpRequest({
            overrideMimeType: 'text/plain; charset=windows-1251',
            synchronous: false,
            url: url,
            method: "GET",
            onload: function(response){
                onloadHandler(new DOMParser().parseFromString(response.responseText, 'text/html').documentElement);
            },
            onerror: function(){ setTimeout( function() { requestPage (url, onloadHandler) }, 500 ) },
            ontimeout: function(){ requestPage (url, onloadHandler) },
            timeout: 5000
        });
    } catch (e) {
        console.log(e);
    }
}