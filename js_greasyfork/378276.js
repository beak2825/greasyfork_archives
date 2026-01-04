// ==UserScript==
// @name        InfoPerk
// @namespace   perk
// @autor       Sweag
// @description Perk table -> homepage
// @include     https://www.heroeswm.ru/home.php*
// @include     https://www.lordswm.com/home.php*
// @include     http://178.248.235.15/home.php*
// @homepage    https://greasyfork.org/en/scripts/378276-infoperk
// @version     1.7.2
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/378276/InfoPerk.user.js
// @updateURL https://update.greasyfork.org/scripts/378276/InfoPerk.meta.js
// ==/UserScript==

// fix by CheckT: include, мелкие правки, рефакторинг, настройки
// old homepage https://greasyfork.org/ru/scripts/25129-infoperk

(function(){

  var url_cur = location.href;
  var url = location.protocol+'//'+location.hostname+'/';

  var gm_prefix = 'hwmip_';
  initGm();

  var isLords = (location.hostname == 'www.lordswm.com');
  var td_place_right;
  var td_place_center;
  var _perk_;
  var _kukla_;

  if(!init())
    return;

  get_table();

  return; //only functions below

  function init(){
    var td_place_right = find_place_right();
    var td_place_center = find_place_center();
    if(!td_place_right || !td_place_center){
      console.log('InfoPerk: place for kukla and perks not found');
      return false;
    }

    td_place_center.innerHTML +=
        '<br/><br/>&nbsp;» <span title="Настройки отображения перков и куклы" style="cursor:pointer;text-decoration: underline;" id="'+gm_prefix+'set">Позиция куклы</span><br/>'
      + '<div '+html_add_id('div_center')+'></div>';
    td_place_right.innerHTML +=
       '<div '+html_add_id('div_right')+'></div>';
    addClickEvent_GM('set', setting_show);
    addEvent(getClickDiv(), "click", get_table);
    show_hide_arts();
    return true;
  }

  function show_hide_arts(){
    var hide_arts = gm_get_bool('hide_arts');
    var img = document.querySelector('img[src*="attr_fortune.png"]');
    if(!img)
      return;
    var table_stats = img.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode; //table of stats
    var arts_strip = table_stats.nextSibling;
    arts_strip.style.display = hide_arts ? 'none' : '';

  }

  function find_place_center(){
    var mana = (isLords?'Mana:':'Мана:');
    var b = document.getElementsByTagName('B');
    for(var i=0; i<b.length; i++){
      if(b[i].innerHTML == mana)
        return b[i].parentNode;
    }
    return null;
  }

  function find_place_right(){
    var last_battle = (isLords?'Last combat':'Последний бой');
    var b = document.getElementsByTagName('B');
    for(var i=0; i<b.length; i++){
      if(b[i].innerHTML == last_battle)
        return b[i].parentNode.parentNode;
    }
    return null;
  }

  function show_tables(){
    $$GM('div_center').innerHTML='';
    $$GM('div_right').innerHTML='';
    show_table('kukla', '1', _kukla_);
    show_table('perks', '2', _perk_);
    remove_loupe();
    if(document.getElementById('click_div_arts_hard')) //link to "HWM arts hard" script
      document.getElementById('click_div_arts_hard').click();
  }

  function remove_loupe(){
    var x = document.querySelector("img[src*='zoom.gif']");
    if (x != null) {
      var loupe = x.parentNode;
      loupe.parentNode.removeChild(loupe);
    }
  }

  function show_table(name, def, table){
    switch(gm_get(name, def)){
      case '1':
        $$GM('div_center').innerHTML += table;
        return;
      case '2':
        $$GM('div_right').innerHTML += table;
        return;
      default:
    }
  }

  function get_table() {
    var href = url+'pl_info.php?id='+getPlayerId();
    var xhr = new XMLHttpRequest();
    xhr.open("GET", href, true);
    xhr.overrideMimeType('text/html; charset=windows-1251');
    xhr.send();
    xhr.onreadystatechange = function() { process_xhr(xhr); }
  }

  function process_xhr(xhr){
    if (xhr.readyState != 4)
      return;

    if (xhr.status == 200) {
      _perk_ = "<";
      _kukla_ = "<";
      var text = xhr.responseText.split('table');
        for(var i=1; i<text.length; i++){
          if(text[i].indexOf('showperkinfo.php') > -1){
            _perk_ += "table" + text[i-1] + "table" + text[i];
          }
          if(text[i].indexOf('kukla') > -1){
            _kukla_ += "table" + text[i-1] + "table" + text[i];
          }
        }
        _perk_ += "table>";
        _kukla_ += "table></table>";
        show_tables();
      }
  }

  //------------
  function setting_show(){
    var bg = $$GM('overlay');
    var bgc = $$GM('center');
    var bg_height = ScrollHeight();
    var width = 300;

    if ( !bg ){
      bg = document.createElement('div');
      document.body.appendChild( bg );

      bgc = document.createElement('div');
      document.body.appendChild( bgc );

      bg.id = gm_prefix+'overlay';
      bg.style.position = 'absolute';
      bg.style.left = '0px';
      bg.style.width = '100%';
      bg.style.background = "#000000";
      bg.style.opacity = "0.5";
      bg.style.zIndex = "7";

      bgc.id = gm_prefix+'center';
      bgc.style.position = 'absolute';
      bgc.style.width = width+'px';
      bgc.style.background = "#F6F3EA";
      bgc.style.zIndex = "8";
    }
    bgc.style.left = ( ( ClientWidth() - width ) / 2 ) + 'px';

    addEvent(bg, "click", setting_hide);

    var show_kukla = gm_get('kukla', '1');
    var show_perks = gm_get('perks', '2');

      //Настройки
      bgc.innerHTML =
        '<div style="border:1px solid #abc;padding:5px;margin:2px;">'
        + '<div style="float:right;border:1px solid #abc;width:15px;height:15px;text-align:center;cursor:pointer;" id="'+gm_prefix+'s_close" title="Close">x</div>'
        + '<table width=100% height=100%>'
        + '<tr><td>'
        +    'Скрывать полоску над армией: '+html_add_checkbox('hide_arts', gm_get_bool('hide_arts'))
        + '</td></tr>'
        + '<tr><td align="center">Кукла персонажа</td></tr>'
        + '<tr><td align="center">'
        +   'Слева:'+html_add_radio('kukla', '1', show_kukla)
        +   ' Справа:'+html_add_radio('kukla', '2', show_kukla)
        +   ' Скрыта:'+html_add_radio('kukla', '0', show_kukla)
        + '</td></tr>'
        + '<tr><td align="center">Перки персонажа</td></tr>'
        + '<tr><td align="center">'
        +   'Слева:'+html_add_radio('perks', '1', show_perks)
        +   ' Справа:'+html_add_radio('perks', '2', show_perks)
        +   ' Скрыты:'+html_add_radio('perks', '0', show_perks)
        + '</td></tr>'
        + '<tr><td style="text-align:center">'
        + '<input type="button" id="'+gm_prefix+'s_close2" value="Close" title="Закрыть окно"/>'
        + '</td></tr></table></div>';


    addClickEvent_GM("s_close", setting_hide);
    addClickEvent_GM("s_close2", setting_hide);

    addClickEvent_GM("kukla0", set_type);
    addClickEvent_GM("kukla1", set_type);
    addClickEvent_GM("kukla2", set_type);
    addClickEvent_GM("perks0", set_type);
    addClickEvent_GM("perks1", set_type);
    addClickEvent_GM("perks2", set_type);
    addClickEvent_GM("hide_arts", set_hide_arts);

    bg.style.top = '0px';
    bg.style.height = bg_height + 'px';
    bgc.style.top = ( window.pageYOffset + 150 ) + 'px';
    bg.style.display = '';
    bgc.style.display = '';
  }

  function setting_hide(){
    var bg = $$GM('overlay');
    var bgc = $$GM('center');
    bg.parentNode.removeChild(bg);
    bgc.parentNode.removeChild(bgc);
  }

  function set_hide_arts(){
    var hide_arts = getBoolField_GM("hide_arts");
    gm_set_bool("hide_arts", hide_arts);
    show_hide_arts();
  }

  function set_type(e) {
    if (e.target.checked) {
      var checked_radio_id = e.target.getAttribute('id');
      var checked_radio_name = e.target.getAttribute('name');
      //<input type="radio" id="hwmip_kukla1" name="hwmip_kukla" value="1" checked="on">
      if(checked_radio_id && checked_radio_name){
        var value = checked_radio_id.substring(checked_radio_name.length);
        GM_setValue(checked_radio_name, value);
        show_tables();
      }
    }
  }

  function getBoolField_GM(key, def){
    var val = $$GM(key);
    return val ? val.checked : def;
  }

  function html_add_checkbox(id, value, title){
    return '<input type="checkbox"'+html_add_id(id)
      +html_if_checked(value)
      +(title ? '" title="'+title+'"' : '')
      +'/>';
  }
  function html_add_id(id){
    return ' id="'+gm_prefix+id+'"';
  }
  function html_if_checked(val){
    return val ? ' checked' : '';
  }
  function html_add_radio(name, value, currvalue){
    return '<input type="radio"'+html_add_id(name+value)
      +' name="'+gm_prefix+html_null_to_empty(name)+'"'
      +' value="'+html_null_to_empty(value)+'"'
      +(currvalue==value?' checked="on"':'')+'/>';
  }

  function html_null_to_empty(val){
    return (val || val===false) ? val : '';
  }

  function getClickDiv(){
    var click_div = document.querySelector("#click_div_infoperk");
    if(!click_div) {
      click_div = document.createElement('div');
      click_div.id = "click_div_infoperk";
      click_div.style.display = "none";
      document.querySelector("body").appendChild(click_div);
    }
    return click_div;
  }

  function getPlayerId(){
    var hunter_ref = getI("//a[contains(@href, 'pl_hunter_stat')]");
      //min 2 для home; min 1 для остальных - если включены выпадающие вкладки
      //min 1 для home; min 0 для остальных - если отключены выпадающие вкладки
    if ( !hunter_ref || hunter_ref.snapshotLength == 0 || (hunter_ref.snapshotLength == 1 && location.pathname == '/home.php') ) {
        //отключены вкладки или разлогин
    } else {
      return hunter_ref.snapshotItem(0).href.split('?id=')[1];
    }
  }

  function addClickEvent_GM(id, func){
    addEvent($$GM(id), "click", func);
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

  function getI(xpath,elem){return document.evaluate(xpath,(elem?elem:document),null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);}
  function $$(id) { return document.getElementById(id); }
  function $$GM(id) { return $$(gm_prefix+id); }
  function gm_get(key, def){
    return GM_getValue(gm_prefix+key, def);
  }

  function gm_set(key, val){
    return GM_setValue(gm_prefix+key, val);
  }

  // 1 -> true; otherwise false
  function GM_load_bool_from_num(key, def){
    var val = Number(GM_getValue(key, def));
    return isNaN(val) ? false : val==1;
  }

  function GM_load_bool(key, def){
    var val = GM_getValue(key, def);
    return val && (val===true || val == 'true');
  }

  // true -> 1; otherwise 0
  function GM_save_num_from_bool(key, val){
    GM_setValue(key, val ? 1 : 0);
  }

  function gm_set_bool(key, val){
    return GM_save_num_from_bool(gm_prefix+key, val);
  }

  function gm_get_bool(key, def){
    return GM_load_bool_from_num(gm_prefix+key , def?1:0);
  }

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

  function ClientWidth(){
    return document.compatMode=='CSS1Compat' && document.documentElement?document.documentElement.clientWidth:document.body.clientWidth;
  }

  function ScrollHeight(){
    return Math.max(document.documentElement.scrollHeight,document.body.scrollHeight);
  }

})();