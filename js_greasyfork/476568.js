// ==UserScript==
// @name           HWM_TransferSearch (fixed)
// @namespace      Рианти
// @version        3.1.0
// @homepage       https://greasyfork.org/en/scripts/374608-hwm-transfersearch
// @author         Alex_2oo8, Рианти, CheckT, emptimd
// @description    Поиск по протоколу передач
// @include        https://www.heroeswm.ru/pl_transfers.php*
// @include        /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/(pl_transfers|sklad_log|clan_log).+/
// @include        https://178.248.235.15/pl_transfers.php*
// @include        https://www.lordswm.com/pl_transfers.php*
// @match          https://my.lordswm.com/pl_transfers.php*
// @license        none
// @downloadURL https://update.greasyfork.org/scripts/476568/HWM_TransferSearch%20%28fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/476568/HWM_TransferSearch%20%28fixed%29.meta.js
// ==/UserScript==


//    https://www.lordswm.com/pl_transfers.php*

(function(){

  var debug = false;

  var url = location.protocol+'//'+location.hostname+'/';
  var id = getId();
  window.protocol_regexp = /Протокол передач <a.* href="pl_info\.php\?id=[0-9]*"><b>.*<\/b><\/a>/;

  init_style();
  var elem = find_root_elem();   //корневой элемент
  create_header(elem);
  create_listeners(elem);
  var iDiv = create_div();

  return; //only functions below

  function request(url_req, callback, type, first_page){
    var objXMLHttpReq = createXMLHttpReq();
    try{
      objXMLHttpReq.open('GET', url_req, true);
      setXMLHttpReqHeaders(objXMLHttpReq);
      objXMLHttpReq.onreadystatechange = function() { callback(objXMLHttpReq, type, first_page); }
      objXMLHttpReq.send(null);
    }catch(e){console.log(e);alert("HWM_TransferSearch: "+e);}
  }

  function search( id, elem, type ) {
    var stop = document.createElement( 'input' );
    stop.type = 'hidden';
    stop.value = '0';
    stop.id = 'stop';
    document.getElementsByTagName('body')[0].appendChild( stop );
    var first_page = Math.max(1, Math.floor(getNumberField('TSearch_inp_page', 1)));
    $('transferSearchDiv').style.display = 'none';
    $('TSearch').style.display = 'none';

    request(url+'pl_transfers.php?page=9999&id=' + id, search_1_last_page, type, first_page);
  }

  function search_1_last_page(objXMLHttpReq, type, first_page){
    if (objXMLHttpReq.readyState == 4 && objXMLHttpReq.status == 200) {
      iDiv.innerHTML = objXMLHttpReq.responseText;
      var element = iDiv.getElementsByClassName('global_container_block_header global_a_hover')[0].nextElementSibling;
      // var td_arr = iDiv.getElementsByClassName('global_container_block_header global_a_hover');
      // for (var i = 0; i < td_arr.length; i++) {
      //   if (window.protocol_regexp.test( td_arr[i].innerHTML ) ) {
      //     var element = td_arr[i].nextElementSibling;
      //     break;
      //   }
      // }
      if(!element)
        return;
      // var lastPg = 1;
      // if ( element.getElementsByTagName('center').length > 1 )
        lastPg = element.getElementsByTagName('center')[0].querySelector('a.active').innerHTML;
      first_page = Math.min(lastPg, first_page);
      search2( id, type, elem, lastPg, first_page);
    }
  }

  function search2( id, type, elem, pgCount, first_page){
    var reg, search_str;
    switch(type){
      case 'Nick':
        search_str = $('TSearchNick').value;
        reg = new RegExp( '[0-9]{2}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}: .*<b>' + rep( search_str ) + '<\/b><\/a>' );
        break;
      case 'Fine':
        search_str = $('HWM_transfer_search_checkbox_label').className.indexOf('checked') != -1;
        reg = new RegExp( '[0-9]{2}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}: <b>Игрок' + ( search_str ? '' : ' оштрафован') );
        break;
      case 'Art':
        search_str = $('TSearchArt').value;
/*!*/	  reg = new RegExp( '[0-9]{2}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}: .* ["\'].*' + rep( search_str ) + '.*["\']' );
        break;
      case 'Any':
        search_str = $('TSearchAll').value;
        reg = new RegExp( '[0-9]{2}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}: .*' + rep( search_str ) + '.*' );
        break;
      case 'Regexp':
        search_str = $('TSearch_inp_regexp').value;
        reg = new RegExp( '[0-9]{2}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:' + search_str.replace(/\\/g, '\\'));
        break;
      case 'ID':
        search_str = $('TSearch_inp_id').value;
        reg = new RegExp( '[0-9]{2}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}: .*id=' + search_str);
        break;
    }
    var nick = elem.previousSibling.getElementsByTagName('a')[0]./*getElementsByTagName('b')[0].*/innerHTML;
    var aaa = elem.getElementsByClassName('global_a_hover')[0];
    while( aaa.lastChild ) {
      aaa.removeChild( aaa.lastChild );
    }
    elem.appendChild( document.createElement( 'br' ) );
    var center = document.createElement( 'center' );
    center.innerHTML = 'Поиск по протоколу передач игрока ';
    var a = document.createElement( 'a' );
    a.href = 'pl_info.php?id=' + id;
    a.style.textDecoration = 'none';
    a.innerHTML = nick;
    center.appendChild( a );
    elem.appendChild( center );
    elem.appendChild( document.createElement( 'br' ) );
    var center = document.createElement( 'center' );
    center.id = 'TSearch';
    center.innerHTML = 'Идёт поиск '
      + type.replace( 'Nick', 'по нику <a href="pl_info.php?nick=' + search_str + '" style="text-decoration: none;"><b>' + search_str + '</b></a>' )
            .replace( 'Fine', 'штрафов' + ( search_str ? ' и блокировок/разблокировок' : '' ) )
            .replace( 'Art', 'по артефакту "' + search_str + '"' )
            .replace( 'Any', 'по подстроке "' + search_str + '"' )
            .replace( 'Regexp', 'по рег. выражению "' + search_str + '"' )
            .replace( 'ID', 'по ID "' + search_str + '"' )
      + '... (<a href="javascript: void(0);" id="cancel" onclick="document.getElementById(\'stop\').value = \'1\';">стоп</a>)'
      + '<br />'
      + 'Просмотрено <text id="viewed">0</text> страничек из ' + (pgCount-first_page+1) + ' (с '+first_page+' по '+pgCount+'): <text id="percent">0</text>%'
      + '<br />'
      + 'Дата последней операции на текущей странице: <text id="curr_date"></text>'
      + '<br />'
      + 'Найдено <text id="matches">0</text> записей:'
      ;
    elem.appendChild( center );
    elem.appendChild( document.createElement( 'br' ) );

    startSearch( first_page, id, reg, pgCount, elem, type, search_str, first_page, null );
  }

  function startSearch( pg, id, reg, lastPg, elem, type, search_str, first_page, curr_page_date ) {
    if ( $('stop').value != '1' && pg <= lastPg ) {
      var args = {pg:pg, id:id, reg:reg, lastPg:lastPg, elem:elem, type:type, search_str:search_str, first_page:first_page};
      request(url+'pl_transfers.php?id=' + id + '&page=' + (pg-1), search_2_pages, args);
    } else {
      var matches = $('matches').innerHTML;
      $('TSearch').innerHTML = 'Поиск '
        + type.replace( 'Nick', 'по нику <a href="pl_info.php?nick=' + search_str + '" style="text-decoration: none;"><b>' + search_str + '</b></a>' )
              .replace( 'Fine', 'штрафов' + ( search_str ? ' и блокировок/разблокировок' : '' ) )
              .replace( 'Art', 'по артефакту "' + search_str + '"' )
              .replace( 'Any', 'по подстроке "' + search_str + '"' )
              .replace( 'Regexp', 'по рег. выражению "' + search_str + '"' )
              .replace( 'ID', 'по ID "' + search_str + '"' )
        + ' закончен!<br>Найдено ' + matches + ' записей на страницах '+first_page+'-'+(pg-1)+':'
        + (curr_page_date ? ('<br/>Дата последней операции на странице '+(pg-1)+': '+curr_page_date) : '')
        ;
    }
  }

  function search_2_pages(objXMLHttpReq, args){
    if (objXMLHttpReq.readyState == 4 && objXMLHttpReq.status == 200) {

      iDiv.innerHTML = objXMLHttpReq.responseText;
      var td_arr = iDiv.getElementsByClassName('global_container_block_header global_a_hover')[0].nextElementSibling;
      var element = td_arr.getElementsByClassName('global_a_hover')[0];
      // var td_arr = iDiv.getElementsByClassName('global_container_block_header global_a_hover');
      // for (var i = 0; i < td_arr.length; i++) {
      //   if (window.protocol_regexp.test( td_arr[i].innerHTML ) ) {
      //     var element = td_arr[i].nextElementSibling.getElementsByClassName('global_a_hover')[0];
      //     break;
      //   }
      // }

      if(!element)
        return;

      var text = element.innerHTML //.substring( element.innerHTML.indexOf('&nbsp;&nbsp;') );
      var transfers = text.split('<br>');
      var first_time = null;
      var time_regexp = /&nbsp;&nbsp;(\d\d-\d\d-\d\d \d\d:\d\d):/;
      for ( var i = 0; i < transfers.length; i++ ) {
        if(!first_time){
          var time_match = time_regexp.exec( transfers[i] );
          if(time_match)
            first_time = time_match[1];
        }
        if ( args.reg.test( transfers[i] ) ) {
          $('matches').innerHTML = ( Number( $('matches').innerHTML ) + 1 );
          args.elem.innerHTML += transfers[i];
          args.elem.appendChild( document.createElement('br') );
        }
      }
      if(first_time)
        $('curr_date').innerHTML = first_time;
      $('viewed').innerHTML = ( Number( $('viewed').innerHTML ) + 1 );
      $('percent').innerHTML = ( Math.round( $('viewed').innerHTML * 100 / (args.lastPg-args.first_page+1) ) );

      startSearch( args.pg+1, args.id, args.reg, args.lastPg, args.elem, args.type, args.search_str, args.first_page, first_time );
    }
  }

  function find_root_elem(){
    return document.getElementsByClassName('global_container_block_header global_a_hover')[0].nextElementSibling;

    // for (var i = 0; i < td_arr.length; i++) {
    //   if (window.protocol_regexp.test( td_arr[i].innerHTML ) || ) {
    //     return td_arr[i].nextElementSibling;
    //   }
    // }
  }

  function create_listeners(elem){
    addClickEvent('HWM_transfer_search_checkbox_label', check_search_box);
    addClickEvent('TSearchByNick', function() { search( id, elem, 'Nick' ); });
    addClickEvent('TSearchByFine', function() { search( id, elem, 'Fine' ); });
    addClickEvent('TSearchByArt', function() { search( id, elem, 'Art' ); });
    addClickEvent('TSearchAny', function() { search( id, elem, 'Any' ); });
    addClickEvent('TSearch_but_regexp', function() { search( id, elem, 'Regexp' ); });
    addClickEvent('TSearch_but_id', function() { search( id, elem, 'ID' ); });
  }

  function rep( str ) {
    str = str.replace( /\\/g, '\\\\' ).replace( /\[/g, '\\[' ).replace( /\]/g, '\\]' ).replace( /\(/g, '\\(' )
        .replace( /\)/g, '\\)' ).replace( /\./g, '\\.' ).replace( /\+/g, '\\+' ).replace( /\*/g, '\\*' )
        .replace( /\?/g, '\\?' ).replace( /\$/g, '\\$' ).replace( /\|/g, '\\|' );
    return str;
  }

  function check_search_box() {
    this.className = (this.className.indexOf('checked') != -1 ? '' : 'checked');
  }

  function create_div(){
    var iDiv = document.createElement('div');
    iDiv.style.display = debug ? 'block' : 'none';
    iDiv.id = 'hwm_trasfer_search';
    document.body.appendChild(iDiv);
    return iDiv;
  }

  function create_header(elem){
    insertAfter(elem.getElementsByTagName('center')[0].firstChild,document.createElement( 'br' ))

    var search_text = 'Поиск';
    var text = document.createElement( 'text' );
    text.id = 'TSearch';
    text.innerHTML = '&nbsp;(<a id="show_transfer_block" href="javascript: void(0);">Поиск по протоколу</a>)';
    elem.getElementsByTagName('center')[0].appendChild( text );
    addClickEvent('show_transfer_block', show_transfer_block);

    var div = document.createElement( 'div' );
    div.id = 'transferSearchDiv';
    div.style.display = 'none';

    div.innerHTML =
      '<table>'+
      '<tr><td>Поиск по нику:</td><td><input type="text" id="TSearchNick" form="form_nick" /></td>'+
        '<td><form action="" style="padding:0;margin:0;border:0;" id="form_nick" onSubmit="return false;">'+
        '<input type="submit" id="TSearchByNick" value="Поиск" />'+
        '</form></td></tr>'+

      '<tr><td>Поиск штрафов:</td><td title="В том числе искать блокировки/разблокировки"><div id="HWM_transfer_search_checkbox_label">Блоки / Разблоки</div></td>'+
        '<td><input type="submit" id="TSearchByFine" value="Поиск" /></td></tr>'+

      '<tr><td>Поиск по артефакту:</td><td><input type="text" id="TSearchArt" form="form_art" /></td>'+
        '<td><form action="" style="padding:0;margin:0;border:0;" id="form_art" onSubmit="return false;">'+
        '<input type="submit" id="TSearchByArt" value="Поиск" />'+
        '</form></td></tr>'+

      '<tr><td>Общий Поиск:</td><td><input type="text" id="TSearchAll" form="form_any" /></td>'+
        '<td><form action="" style="padding:0;margin:0;border:0;" id="form_any" onSubmit="return false;">'+
        '<input type="submit" id="TSearchAny" value="Поиск" />'+
        '</form></td></tr>'+

      '<tr><td>По рег. выражению:</td><td><input type="text" id="TSearch_inp_regexp" form="form_regexp" /></td>'+
        '<td><form action="" style="padding:0;margin:0;border:0;" id="form_regexp" onSubmit="return false;">'+
        '<input type="submit" id="TSearch_but_regexp" value="Поиск" />'+
        '</form></td></tr>'+

      '<tr><td>По ID:</td><td><input type="text" id="TSearch_inp_id" form="form_id" /></td>'+
        '<td><form action="" style="padding:0;margin:0;border:0;" id="form_id" onSubmit="return false;">'+
        '<input type="submit" id="TSearch_but_id" value="Поиск" />'+
        '</form></td></tr>'+

      '<tr><td>со страницы</td><td title="Начать поиск с указанной страницы"><input type="text" id="TSearch_inp_page" value="1"/></td>'+
        '<td>&nbsp;</td></tr>'+
      '</table>';

    elem.getElementsByTagName('center')[0].appendChild( div );
  }

  function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  function show_transfer_block() {
    $('transferSearchDiv').style.display = ( $('transferSearchDiv').style.display == 'none' ? 'block' : 'none' );
  }

  function GM_addStyle(css){
    var head = document.getElementsByTagName('head')[0];
    if (!head)
      return;
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
  }

  function init_style(){
    GM_addStyle( '#HWM_transfer_search_checkbox_label {background-image:url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJIAAAAsCAYAAACOu+GLAAABrElEQVR42u3bsWrCQByA8RhdXBzEJY8gcXZz9Ek6BkIhSxBck1foG3QogpPg5uguklG6iIPU4qCT+ZcLGDiibY03ZPiGD4yaLPcTyV3O+nh/E6JnStNULPXi1X8xlunrUbX7/vrUIakDE5m+HlU7IBGQCEgEJCARkAhIBCQCEpAISAQkAhKQgAQkAhIBiYAEJAISAYmqC0kdmMr09aj6ZZD4VZGJLHZBELtIiF0kxF0bkMg8pOVyKd1uF0hAem7gfd8Xy7KABKTyA+95XoYISEAqDSkIghwRkIBUgLRarf48OQxDDVGz2QQSkPSB7/f7st1u7544Go00RI1GQxaLBZCApA98rVYTx3HkeDxqJ1wuFxmPxxoi9d0kSbj9B9JtSApJu92W/X6fvx9FUf7Ztc1mwzwSkG5DqtfrOZRer5f9zcVxrAFSzedzJiTpPqThcKiB6XQ6BUSTyYSZbfod0m63E9d1C3iuzWYzlkjof/NI5/NZWq1WAdF6vWatjR6bkDydTtkamgJk23a2psaiLZWa2T4cDjIYDGQ6nbL6TzxGQkAidpEQu0iIHuwH8Zq0OtRsnH4AAAAASUVORK5CYII%3D\');background-position:top;display:block;width:120px;height:18px;padding:2px;padding-left:24px;line-height:18px;-moz-user-select:none;cursor:default;}' +
        '#HWM_transfer_search_checkbox_label.checked {background-position:bottom;}' +
        '.HWM_transfer_search_checkbox_checkbox {display:none;}' );
  }

  function addClickEvent(id, func){
    var elem = $(id);
    if(elem && func)
      addEvent(elem, "click", func);
  }

  function addChangeEvent(id, func){
    var elem = $(id);
    if(elem && func)
      addEvent(elem, "change", func);
  }

  function addEvent(elem, evType, fn) {
    if(elem){
      if (elem.addEventListener)
        elem.addEventListener(evType, fn, false);
      else if (elem.attachEvent)
        elem.attachEvent("on" + evType, fn);
      else
        elem["on" + evType] = fn;
    }
  }

  function getId() {
      var id = location.href.match( /\?(?:.*=.*&)*id=([0-9]*)(?:&.*=.*)*/ );
      return id[1];
  }

  function $(id) { return document.getElementById(id); }

  function getI(xpath,elem){return document.evaluate(xpath,(elem?elem:document),null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);}

  function getNumberField(key, def){
    var val = $(key);
    return val ? getNum(val.value) : (def ? def : 0);
  }
  function getNum(src){
    var val=Number(src);
    val = isNaN(val) ? 0 : val;
    return val < 0 ? 0 : val;
  }

  function createXMLHttpReq(){
    var objXMLHttpReq;

    if (window.XMLHttpRequest){
      objXMLHttpReq = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
      // IE
      objXMLHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
    } else {
      alert('Can\'t create XMLHttpRequest!');
    }
    return objXMLHttpReq;
  }

  function setXMLHttpReqHeaders(objXMLHttpReq){
    //objXMLHttpReq.setRequestHeader('Referer', 'http://www.heroeswm.ru/inventory.php');
    objXMLHttpReq.setRequestHeader('Content-type', 'text/html; charset=windows-1251');
    if(objXMLHttpReq.overrideMimeType)
      objXMLHttpReq.overrideMimeType('text/html; charset=windows-1251');
  }
}());
