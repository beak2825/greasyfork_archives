// ==UserScript==
// @name           CT_pers_note
// @namespace      CheckT
// @author         CheckT
// @description    Комментарий на странице информации о персе
// @version        1.1
// @encoding       utf-8
// @homepage       https://greasyfork.org/en/scripts/376330-ct-pers-note
// @include        https://www.heroeswm.ru/pl_info.php*
// @include        https://www.lordswm.com/pl_info.php*
// @include        http://178.248.235.15/pl_info.php*
// @grant          GM_getValue
// @grant          GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/376330/CT_pers_note.user.js
// @updateURL https://update.greasyfork.org/scripts/376330/CT_pers_note.meta.js
// ==/UserScript==

(function(){
  var gm_prefix = 'ctpn_';
  initGm();
  try{
    var pl_id = document.location.href.split('?id=')[1].split('&')[0];
  }catch(e){console.log('CT_pers_note error: '+e);return;}
  if(pl_id){
    var img_clan_war = document.querySelector('img[src*="unk_kukla.png"]');
    if(img_clan_war){
      create_input(img_clan_war);
    } else {
      var table_kukla = document.querySelector('table[background*="i/kukla"]');
      if(table_kukla){
        create_input(table_kukla);
      }
    }
    addEvent($$GM('notes'), "change", change_info);
  }

  return;

  function create_input(elt){
    var root_table = elt.parentNode.parentNode.parentNode.parentNode;
    var tr = root_table.insertRow(1);
    tr.innerHTML = '<td colspan="3"><input type="text" value="'+gm_get(pl_id)+'" id="'+gm_prefix+'notes" style="width:315px"/> (любой комментарий, виден только Вам)</td>';
  }

  function change_info(){
    gm_set(pl_id, $$GM('notes').value);
  }

  function $$GM(id) { return document.getElementById(gm_prefix+id); }

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

  function gm_get(key){
    return GM_getValue(gm_prefix+key, '');
  }

  function gm_set(key, val){
    return GM_setValue(gm_prefix+key, val);
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
