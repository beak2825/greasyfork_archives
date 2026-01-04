// ==UserScript==
// @name                Keenetic kroleg utils
// @version             0.0.2
// @datecreated         2022-04-19
// @lastupdated         2022-04-20
// @author              "Kroleg"
// @license             MIT
// @include             http://192.168.1.1*
// @description         Реализация кнопки "Перезагрузка" в шапке панели управления раутера
// @namespace https://greasyfork.org/users/386075
// @downloadURL https://update.greasyfork.org/scripts/443642/Keenetic%20kroleg%20utils.user.js
// @updateURL https://update.greasyfork.org/scripts/443642/Keenetic%20kroleg%20utils.meta.js
// ==/UserScript==

 (function() {

  var
   initSuccess;

  function log(s) {
   console.log(s);
  }//func


  function $(selector, el) {
   if(!el) el = document;
   return el.querySelector(selector);
  }//func


  async function rebootSystem() { 
   var
    docloc = document.location.host,
    response;
      
   response = await fetch('http://' + docloc + '/rci/components/list', {
    method: 'delete',
    headers: { 'Content-Type': 'application/json' }
   });
    
   await response.json();

   response = await fetch('http://' + docloc + '/rci/system/reboot', {
    method: 'post',
    body: '{}',
    headers: { 'Content-Type': 'application/json' }
   });
    
   await response.json();
   setTimeout(() => { document.location = 'http://' + docloc + '/login'; }, 4000);
  }//func

  
  document.addEventListener('DOMSubtreeModified', function(event) {
   if(initSuccess) return;

   var
    headerSearch;
   
   headerSearch = $('.d-header__search');
    
   if(headerSearch) {
    initSuccess = true;
    init(headerSearch);
   }
   
  });//DOMSubtreeModified

  
  function init(headerSearch) {
   var
    elDiv = document.createElement('div'),
    parentDiv = headerSearch.parentNode.parentNode;
   
   elDiv.innerHTML = 'Перезагрузить';
   elDiv.addEventListener('click', () => { 
    if(confirm('Перезагрузить интернет-центр?')) rebootSystem();
   }, false);
   elDiv.style.cursor = 'pointer';
   elDiv.style.color = '#fff';
   elDiv.style.textDecoration = 'underline';
 
   elDiv.addEventListener('mouseover', () => { elDiv.style.textDecoration = 'none'; });
   elDiv.addEventListener('mouseout', () => { elDiv.style.textDecoration = 'underline'; });
   parentDiv.insertBefore(elDiv, headerSearch.parentNode.nextSibling);
  }//func

 })();

