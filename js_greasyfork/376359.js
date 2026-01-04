// ==UserScript==
// @name        HWM_InfiniteScrollForProtocolPages
// @namespace   Рианти, omne, CheckT
// @description Бесконечная прокрутка страниц протоколов (добавление содержимого следующей страницы при прокрутке вниз)
// @version     1.3
// @homepage    https://greasyfork.org/en/scripts/374875-hwm-infinitescrollforprotocolpages
// @include     https://www.heroeswm.ru/pl_transfers.php*
// @include     https://www.heroeswm.ru/pl_warlog.php*
// @include     https://www.heroeswm.ru/pl_cardlog.php*
// @include     https://www.heroeswm.ru/sklad_log.php*
// @include     https://www.heroeswm.ru/clan_log.php*
// @include     https://www.lordswm.com/pl_transfers.php*
// @include     https://www.lordswm.com/pl_warlog.php*
// @include     https://www.lordswm.com/pl_cardlog.php*
// @include     https://www.lordswm.com/sklad_log.php*
// @include     https://www.lordswm.com/clan_log.php*
// @include     http://178.248.235.15/pl_transfers.php*
// @include     http://178.248.235.15/pl_warlog.php*
// @include     http://178.248.235.15/pl_cardlog.php*
// @include     http://178.248.235.15/sklad_log.php*
// @include     http://178.248.235.15/clan_log.php*
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/376359/HWM_InfiniteScrollForProtocolPages.user.js
// @updateURL https://update.greasyfork.org/scripts/376359/HWM_InfiniteScrollForProtocolPages.meta.js
// ==/UserScript==

try{
(function(){
  var url_curr = location.protocol+'//'+location.hostname+'/';

  createGM_xmlhttpRequest();

  var _timeoutOnAdding = 0; //ms
  var _pixelsFromBottomBeforeAdding = 400;

  if(document.body.innerHTML.indexOf('&page=') === -1 && document.body.innerHTML.indexOf('&amp;page=') === -1)
    return; //нет страниц

  var _isWarLog = document.location.href.indexOf('pl_warlog.php') > -1;
  var _isCardLog = document.location.href.indexOf('pl_cardlog.php') > -1;
  var _pageURLpattern = document.location.href.match(/(.+)(&page=\d+)*/)[0] + '&page=';

  var _addingInProgress = false;
  var _curPage = 0;

  if(document.location.href.indexOf('&page=') > -1)
    _curPage = parseInt(document.location.href.match(/&page=(\d+)/)[1]);

  window.addEventListener("scroll", checkIfNearBottom);

  checkIfNearBottom();

  function checkIfNearBottom(){
    if(_addingInProgress)
      return;
    var curWindowTop = window.pageYOffset;

    var contentTotalHeight = document.documentElement.clientHeight;
    var availToWebPageScreenHeight = window.innerHeight
    if(contentTotalHeight - _pixelsFromBottomBeforeAdding < curWindowTop + availToWebPageScreenHeight){
      _addingInProgress = true;
      getContentFromPageId(++_curPage, addNewContent);
    }
  }

  function getContentFromPageId(id, callbackFunc){
  if(document.body.innerHTML.indexOf('&page='+id) === -1 && document.body.innerHTML.indexOf('&amp;page='+id) === -1)
      return;   //таких страниц нет

    requestPage (_pageURLpattern + id, function (dom){
      var t = dom.querySelector('body').innerHTML;
      t = t.substring(t.indexOf('<!-- big table -->') + 19, t.lastIndexOf('<script>'));
      t = t.substring(t.indexOf('</center><br>') + 13, t.lastIndexOf('</td></tr></tbody></table>'));
      t = t.replace('</a></center><br>', '</a></center>');
      if(_isWarLog)
        t = alterContentForWarlogPage(t);
      if(_isCardLog)
        t = alterContentForCardlogPage(t);
      callbackFunc(t);
    });
  }

  function alterContentForCardlogPage(content){
    return '<table width="100%"><tr><td> </td></tr></table>' + content;
  }

  function alterContentForWarlogPage(content){
    return content.replace(
      /<a href="warlog\.php\?warid=(\d+)([^"]*)">([^<]+)<\/a>/g,
      '<a href="warlog.php?warid=$1$2">$3</a>' +
      '<span>&nbsp;[' +
      '<a href="'+url_curr+'war.php?lt=-1&amp;warid=$1$2" target="_blank">#</a>&nbsp;' +
      '<a href="'+url_curr+'battlechat.php?warid=$1$2" target="_blank">chat</a>&nbsp;' +
      '<a href="'+url_curr+'war.php?warid=$1$2" target="_blank">$</a>&nbsp;' +
      '<a href="'+url_curr+'battle.php?lastturn=-3&amp;warid=$1$2" target="_blank">E</a>' +
      ']</span>');
  }

  function addNewContent(contentHTML){
    var parent = document.querySelector('table[cellpadding="0"][border="0"][cellspacing="0"][width="95%"] > tbody > tr > td');
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
    //console.log('[HWM_InfiniteScrollForProtocolPages] loading: ', url);
    try{
        GM_xmlhttpRequest({
            overrideMimeType: 'text/plain; charset=windows-1251',
            synchronous: false,
            url: url,
            method: "GET",
            headers:  {'Content-type': 'text/html; charset=windows-1251'},
            onload: function(response){
                onloadHandler(new DOMParser().parseFromString(response.responseText, 'text/html').documentElement);
            },
            onerror: function(){ setTimeout( function() { requestPage (url, onloadHandler) }, 500 ) },
            ontimeout: function(){ requestPage (url, onloadHandler) },
            timeout: 5000
        });
    } catch (e) {
        console.log(e);
        alert(e);
    }
  }

  function createGM_xmlhttpRequest(){
    if (typeof GM_xmlhttpRequest != 'function'){
      this.GM_xmlhttpRequest=function (details){
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function(){
          var responseState ={
              responseXML:(xmlhttp.readyState === 4 ? xmlhttp.responseXML : ''),
              responseText:(xmlhttp.readyState === 4 ? xmlhttp.responseText : ''),
              readyState:xmlhttp.readyState,
              responseHeaders:(xmlhttp.readyState === 4 ? xmlhttp.getAllResponseHeaders() : ''),
              status:(xmlhttp.readyState === 4 ? xmlhttp.status : 0),
              statusText:(xmlhttp.readyState === 4 ? xmlhttp.statusText : '')
          }
          if (details.onreadystatechange){
              details.onreadystatechange(responseState);
          }
          if (xmlhttp.readyState === 4){
              if (details.onload && xmlhttp.status>=200 && xmlhttp.status<300){
                  details.onload(responseState);
              }
              if (details.onerror && (xmlhttp.status<200 || xmlhttp.status>=300)){
                  details.onerror(responseState);
              }
          }
        }
        try{
          //cannot do cross domain
          xmlhttp.open(details.method, details.url);
        }catch(e){
          if( details["onerror"] ){
            //simulate a real error
            details["onerror"]({responseXML:'',responseText:'',readyState:4,responseHeaders:'',status:403,statusText:'Forbidden'});
          }
          return;
        }
        if (details.headers || details.overrideMimeType){
          if (details.headers){
            for (var prop in details.headers){
                xmlhttp.setRequestHeader(prop, details.headers[prop]);
            }
          }
          if (details.overrideMimeType && xmlhttp.overrideMimeType){
            xmlhttp.overrideMimeType(details.overrideMimeType);
          }
        } else {
          xmlhttp.setRequestHeader('Content-type', 'text/html; charset=windows-1251');
          if(xmlhttp.overrideMimeType)
            xmlhttp.overrideMimeType('text/html; charset=windows-1251');
        }

        xmlhttp.send((typeof(details.data)!='undefined')?details.data:null);
      }
    }
  }
})();
}catch(e){console.log(e);alert(e);}