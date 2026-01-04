// ==UserScript==
// @name           CT_battle_alarm
// @namespace      CheckT
// @author         CheckT
// @description    Оповещение о начале боя или карточной игры (на открытой странице)
// @version        1.0
// @encoding       utf-8
// @homepage       https://greasyfork.org/en/scripts/377115-ct-battle-alarm
// @include        https://www.heroeswm.ru/*
// @include        https://www.lordswm.com/*
// @include        http://178.248.235.15/*
// @exclude        */rightcol.php*
// @exclude        */ch_box.php*
// @exclude        */chat*
// @exclude        */ticker.html*
// @exclude        */frames*
// @exclude        */brd.php*
// @grant          GM_getValue
// @grant          GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/377115/CT_battle_alarm.user.js
// @updateURL https://update.greasyfork.org/scripts/377115/CT_battle_alarm.meta.js
// ==/UserScript==

(function(){
  var gm_prefix = 'ctba_';
  initGm();

  if ( location.pathname=='/war.php' ) {
    onWarDetected();
    return;
  }
  if ( location.pathname=='/cgame.php' ) {
    onGameDetected();
    return;
  }

  var radio_ref = getI("//a[contains(@href, 'radio.heroeswm.ru')]");
  if ( !radio_ref || radio_ref.snapshotLength == 0)
    return;

  var radio_td = radio_ref.snapshotItem(0).parentNode;
  var tr = radio_td.parentNode;
  var alarm_td = document.createElement('td');
  alarm_td.title = 'Оповестить о начале боя или игры';
  alarm_td.innerHTML = '<input id="'+gm_prefix+'alarm" type="checkbox"'+(gm_get_bool('alarm')?' checked':'')+'/>';
  tr.insertBefore(alarm_td, radio_td.nextSibling);
  addChangeEvent_GM('alarm', switchAlarm);

  return;

  function switchAlarm(){
    gm_set_bool('alarm', getBoolField_GM('alarm', false));
  }
  function onWarDetected(){
    if(gm_get_bool('alarm')){
      if ( /warlog\|0/.exec(document.querySelector("html").innerHTML) ) {
        //flash & html:
            // warlog|0| -> бой происходит сейчас
            // warlog|1| -> запись боя
        gm_set_bool('alarm', false);
        make_alarm();
      }
    }
  }

  function onGameDetected(){
    if(gm_get_bool('alarm')){
      gm_set_bool('alarm', false);
      make_alarm();
    }
  }

  function make_alarm(){
    new Audio("https://www.soundjay.com/button/beep-02.mp3").play()
  }

  //------------------
  function getI(xpath,elem){return document.evaluate(xpath,(elem?elem:document),null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);}
  function $$GM(id) { return document.getElementById(gm_prefix+id); }

  function getBoolField_GM(key, def){
    var val = $$GM(key);
    return val ? val.checked : def;
  }
  function gm_set_bool(key, val){
    return GM_save_num_from_bool(gm_prefix+key, val);
  }

  function gm_get_bool(key, def){
    return GM_load_bool_from_num(gm_prefix+key , def?1:0);
  }

  // 1 -> true; otherwise false
  function GM_load_bool_from_num(key, def){
    var val = Number(GM_getValue(key, def));
    return isNaN(val) ? false : val==1;
  }

  // true -> 1; otherwise 0
  function GM_save_num_from_bool(key, val){
    GM_setValue(key, val ? 1 : 0);
  }

  function addChangeEvent_GM(id, func){
    addEvent($$GM(id), "change", func);
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
          //в K-Meleon возвращаются все опции всех скриптов
          keys.push(key);
        }
        return keys;
      }
    }
  }
})();
