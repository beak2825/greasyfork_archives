// ==UserScript==
// @name          hwm_roul
// @namespace     hwm_roul
// @version       1.6
// @description   HWM mod - Detal statistic of hwm roul
// @homepage      http://www.hwm.i-virgo.com
// @include       https://www.heroeswm.ru/roulette.php*
// @include       https://www.lordswm.com/roulette.php*
// @include       http://178.248.235.15/roulette.php*
// @downloadURL https://update.greasyfork.org/scripts/376086/hwm_roul.user.js
// @updateURL https://update.greasyfork.org/scripts/376086/hwm_roul.meta.js
// ==/UserScript==

// (c) 2008-2010, Tampliers (http://www.hwm.i-virgo.com)
// fix by CheckT (2018)
// https -> http requests prohibited, поэтому только с адреса http://178.248.235.15/
// см. http://hwm.i-virgo.com/ruletka/script-stat-for-hwm
// старую статистику можно смотреть только с http://178.248.235.15/, новую - с любого адреса

try{
(function() {

  var g_ver = "1.6";
  var gm_prefix = 'hwm_roul_';
  var allow_old_stat = (location.hostname == '178.248.235.15');

  initGm()

  var g_rform = getI("//form[@name='rform']").snapshotItem(0);

  Init();

  return; //ниже только функции

  function Init(){
    var links = document.querySelectorAll('a[href*="inforoul.php"]');
    var link = null;
    //ищем последнюю ссылку на игроков
    for(var i=0; i<links.length; i++){
      if(links[i].text == 'Прошлая игра')
        link = links[i];
    }
    if(!link){
      console.log('рулетка не найдена');
      return;
    }
    var span = document.createElement( 'span' );
    span.id = 'roul_span';
    span.style.textDecoration = "underline";
    span.style.cursor = "pointer";
    span.style.color = "red";
    link.parentNode.insertBefore( span, link.parentNode.childNodes[8] ) ;
    addClickEvent(span, SwitchRoul);
    var txt = document.createElement( 'TextNode' );
    txt.textContent = " | ";
    link.parentNode.insertBefore( txt, span ) ;
    if(gm_get_bool("show"))
      ShowRoul();
    else
      ButtonShow();
    if(allow_old_stat){
      var span_check = document.createElement( 'span' );
      link.parentNode.insertBefore( span_check, txt) ;
      span_check.title = "Показывать старую статистику, работает только с адреса http://178.248.235.15/roulette.php";
      span_check.innerHTML = 'Старая стат:<input type="checkbox" id="'+gm_prefix+'show_old_stat"'
        +(gm_get_bool('show_old_stat')?' checked="true"':'')
        +' title="Показывать старую статистику, работает только с адреса http://178.248.235.15/roulette.php"/>';
      addClickEvent($$GM('show_old_stat'), SwitchShowOldStat);

      var txt2 = document.createElement( 'TextNode' );
      txt2.textContent = " | ";
      link.parentNode.insertBefore( txt2, span_check ) ;
    }
  }

  function SwitchShowOldStat(){
    gm_set_bool('show_old_stat', $$GM('show_old_stat').checked);
    if(gm_get_bool("show")){
      HideRoul();
      ShowRoul();
    }
  }
  function SwitchRoul(){
    if(gm_get_bool("show"))
      HideRoul();
    else
      ShowRoul();
  }

  function ButtonShow(){
    var span = $$("roul_span");
    span.innerHTML = "Показать статистику рулетки";
    gm_set_bool("show", false);
  }

  function ButtonHide(){
    var span = $$("roul_span");
    span.innerHTML="Скрыть статистику рулетки";
    gm_set_bool("show", true);
  }

  function HideRoul(){
    ButtonShow();
    var el = $$("detal_hwm_roul");
    if(el)
      el.parentNode.removeChild(el);

    el = $$("table_show");
    if(el)
      el.parentNode.removeChild(el);
  }

  function ShowRoul_Full(){
    gm_set("mode",1);
    HideRoul();
    ShowRoul();
  }

  function ShowRoul_Detla(){
    gm_set("mode",3);
    HideRoul();
    ShowRoul();
  }

  function ShowRoul_DazCol(){
    gm_set("mode",2);
    HideRoul();
    ShowRoul();
  }

  function GetTableShow(){
    var mode = gm_get_num("mode", 3);

    var tr = document.createElement('tr');
    var td = document.createElement('td');
    var txt1 = document.createElement( 'a' );
    txt1.innerHTML = "&nbsp;\u007C&nbsp;";
    var txt2 = document.createElement( 'a' );
    txt2.innerHTML = "&nbsp;\u007C&nbsp;";
    var a1 = document.createElement('a');
    var a2 = document.createElement('a');
    var a3 = document.createElement('a');

    tr.id = "table_show";
    tr.style.textAlign = "center";
    td.colSpan = "3";

    a1.innerHTML = "Общая статистика";

    a1.style.textDecoration = "underline";
    a1.style.cursor = "pointer";
    addClickEvent(a1, ShowRoul_Full);

    a2.innerHTML = "Dozen & Column";
    a2.style.textDecoration = "underline";
    a2.style.cursor = "pointer";
    addClickEvent(a2, ShowRoul_DazCol);

    a3.innerHTML = "Детальная статистика";

    a3.style.textDecoration = "underline";
    a3.style.cursor = "pointer";
    addClickEvent(a3, ShowRoul_Detla);

    if(mode == 1)
      a1.style.fontWeight = "bold";
    else if(mode == 2)
      a2.style.fontWeight = "bold"
    else
      a3.style.fontWeight = "bold"

    td.appendChild(a1);
    td.appendChild(txt1);
    td.appendChild(a2);
    td.appendChild(txt2);
    td.appendChild(a3);
    tr.appendChild(td);
    return tr;
  }

  function ShowRoul() {
    var mode = gm_get_num("mode", 3);
    ButtonHide();

    var div = document.createElement( 'div' );
    div.style.textAlign="center";

    var tr = document.createElement('tr');
    tr.id = "detal_hwm_roul";
    var td = document.createElement('td');
    td.colSpan = 3;
    var d_copy  = document.createElement( 'div' );
    d_copy.style.textAlign="center";
    d_copy.innerHTML = 'Copyright by <img border="0" alt="†Тамплиеры†" src="http://www.hwm.i-virgo.com/my_images/l_1945.gif"> <a id = "copyright_roul" href="http://www.hwm.i-virgo.com" target="_blank">#1945 †Тамплиеры†</a> (ver: '+g_ver+' fix by CheckT)<br><br>';

    var ifame = document.createElement( 'iframe' );
    if(allow_old_stat && gm_get_bool('show_old_stat'))
      LoadOldStat(ifame, mode);
    else
      LoadNewStat(ifame, mode);
    div.appendChild(ifame);
    td.appendChild(div);
    td.appendChild(d_copy);
    tr.appendChild(td);

    var bet_inp = document.querySelector('input[name="cur_pl_bet"]');
    var tbody = bet_inp.parentElement.parentElement.parentElement;
    tbody.insertBefore( tr , tbody.firstChild ) ;
    if(allow_old_stat && gm_get_bool('show_old_stat'))
      tbody.insertBefore( GetTableShow() , tr ) ;
  }

  function LoadNewStat(ifame, mode){
    ifame.width = "770px";
    ifame.height = "1150px";
    ifame.src = "https://abouthwm.ru/roulette/all.php?num=30";
  }

  function LoadOldStat(ifame, mode){
    ifame.width = "728px";
    var show;
    if(mode == 1) {
      ifame.height = "450px";
      show = "full";
    } else if(mode == 2) {
      ifame.height = "570px";
      show="dazcol";
    } else {
      ifame.height = "410px";
      show="detal";
    }

    ifame.scrolling = "no";
    ifame.frameBorder = 0;

    var url = "&version="+g_ver+"&scr=hwm";
    url += "&color_bg="+String("ddd9cd");
    url += "&color_table="+String("F5F3EA");
    url += "&color_button="+String("E3BFBF");
    url += "&color_th="+String("E3BFBF");
    url += "&color_text_th="+String("592C08");
    url += "&color_text="+String("592C08");

    ifame.src = "http://www.hwm.i-virgo.com/php_scripts/roul/hwm_roul.php?show="+show+"&url=http://www.heroeswm.ru/roulette.php&dom="+ClearUrl(document.domain)+url;
  }

  function ClearUrl(url){
    if(url.indexOf("http://") === 0 )
      url = url.substring(7, url.length);
    if(url.indexOf("https://") === 0 )
      url = url.substring(8, url.length);
    if(url.indexOf("www.") === 0 )
      url = url.substring(4, url.length);
    return url;
  }

  function getI(xpath,elem){return document.evaluate(xpath,(elem?elem:document),null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);}
  function $$(id) { return document.getElementById(id); }
  function $$GM(id) { return $$(gm_prefix+id); }

  function initGm(){
    if (!this.GM_getValue || (this.GM_getValue.toString && this.GM_getValue.toString().indexOf("not supported")>-1)) {
      this.GM_getValue=function (key,def) {
        return localStorage[key] || def;
      };
      this.GM_setValue=function (key,value) {
        return localStorage[key]=value;
      };
      this.GM_deleteValue=function (key) {
        return delete localStorage[key];
      };
    }
    if (!this.GM_listValues || (this.GM_listValues.toString && this.GM_listValues.toString().indexOf("not supported")>-1)) {
      this.GM_listValues=function () {
        var keys=[];
        for (var key in localStorage){
          keys.push(key);
        }
        return keys;
      };
    }
  }

  // 1 -> true; otherwise false
  function GM_load_bool_from_num(key, def){
    var val = Number(GM_getValue(key, def));
    return isNaN(val) ? false : val==1;
  }

  function GM_load_num(key, def){
    var val = Number(GM_getValue(key, def));
    return isNaN(val) ? def : val;
  }

  function GM_load_bool(key, def){
    var val = GM_getValue(key, def);
    return val && (val===true || val == 'true');
  }

  // true -> 1; otherwise 0
  function GM_save_num_from_bool(key, val){
    GM_setValue(key, val ? 1 : 0);
  }

  function gm_get(key, def){
    return GM_getValue(gm_prefix+key, def);
  }

  function gm_set(key, val){
    return GM_setValue(gm_prefix+key, val);
  }

  function gm_get_num(key, val){
    return GM_load_num(gm_prefix+key, val);
  }

  function gm_set_bool(key, val){
    return GM_save_num_from_bool(gm_prefix+key, val);
  }

  function gm_get_bool(key, def){
    return GM_load_bool_from_num(gm_prefix+key , def?1:0);
  }

  function addClickEvent(elem, func){
    addEvent(elem, "click", func);
  }
  function addEvent(elem, evType, fn) {
    if(elem && fn){
      if (elem.addEventListener)
        elem.addEventListener(evType, fn, false);
      else if (elem.attachEvent)
        elem.attachEvent("on" + evType, fn);
      else
        elem["on" + evType] = fn;
    }
  }
})();
}catch(e){console.log(e);alert(e);}