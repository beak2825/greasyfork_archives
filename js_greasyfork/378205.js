// ==UserScript==
// @name           CT_groupwar_filter
// @namespace      CheckT
// @author         CheckT
// @description    Фильтр групповых боёв
// @version        1.2
// @encoding       utf-8
// @homepage       https://greasyfork.org/en/scripts/378205-ct-groupwar-filter
// @include        https://www.heroeswm.ru/group_wars.php*
// @include        https://www.lordswm.com/group_wars.php*
// @include        http://178.248.235.15/group_wars.php*
// @grant          GM_getValue
// @grant          GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/378205/CT_groupwar_filter.user.js
// @updateURL https://update.greasyfork.org/scripts/378205/CT_groupwar_filter.meta.js
// ==/UserScript==

(function(){
  var gm_prefix = 'ctgf_';
  initGm();

  var is_show_hunt = gm_get_bool('is_show_hunt');
  var is_show_clan = gm_get_bool('is_show_clan');
  var is_hide_hunt = gm_get_bool('is_hide_hunt');
  var show_clan = gm_get('show_clan');
  var dom_ff_form = document.querySelector("form[name='ff']");
  if(!dom_ff_form){
    console.log("dom_ff_form not found");
    return;
  }
  var filtered = false;
  var tr_header = dom_ff_form.parentNode.parentNode.parentNode;
  create_header();
  filter_rows();
  return;

  function create_header(){
    var td_players = tr_header.childNodes[6];
    td_players.innerHTML =
      '<span title="Скрыть охоты">-Ох:'
        +'<input type="checkbox"'
        + html_if_checked(is_hide_hunt)
        + html_add_id('is_hide_hunt')
        + '/></span>'
      +' ( <span title="Оставить только охоты (и клан, если выбрано)">+Ох:'
        +'<input type="checkbox"'
        + html_if_checked(is_show_hunt)
        + html_add_id('is_show_hunt')
        + '/></span>'
      //+'<span style="display:none">' //hide clan start
      +' | <span title="Оставить только указанный клан, например, 9761 (и охоты, если выбрано)">+Клан:'
        +'<input type="checkbox"'
        + html_if_checked(is_show_clan)
        + html_add_id('is_show_clan')
        + '/>'
        +'<input style="width:60px"'
        + html_add_id('show_clan')
        + html_add_positive_value(show_clan)
        + '/></span>'
      +' )'
        //+ '/span>' // hide clan end
        ;
    addClickEvent_GM('is_show_hunt', update_filter);
    addClickEvent_GM('is_hide_hunt', update_filter);
    addClickEvent_GM('is_show_clan', update_filter);
    addChangeEvent_GM('show_clan', update_filter);
  }

  function update_filter(){
    is_show_hunt = getBoolField_GM('is_show_hunt');
    is_hide_hunt = getBoolField_GM('is_hide_hunt');
    is_show_clan = getBoolField_GM('is_show_clan');
    var show_clan_val = $$GM('show_clan');
    if(show_clan_val){
      show_clan = show_clan_val.value.trim();
      if(show_clan.indexOf('#')==0)
        show_clan = show_clan.substring(1);
    } else
      show_clan = '';
    gm_set_bool('is_show_hunt', is_show_hunt);
    gm_set_bool('is_hide_hunt', is_hide_hunt);
    gm_set_bool('is_show_clan', is_show_clan);
    gm_set('show_clan', show_clan);
    filter_rows();
  }

  function filter_rows(){
    var tr = tr_header;
    var is_only_clan = is_show_clan && show_clan>0;
    while (tr = tr.nextSibling){
      var curr_style = (is_show_hunt || is_only_clan) ? 'none' : '';
      if(tr.childNodes[3].innerHTML=='Охотник'){
        curr_style = (is_hide_hunt || (is_only_clan && !is_show_hunt)) ? 'none' : '';
      } else if(is_only_clan) {
          if(tr.childNodes[1].innerHTML.indexOf('#'+show_clan)>=0)
            curr_style = '';
      }
      tr.style.display = curr_style;
    }
  }

//---------------------
  function $$GM(id) { return document.getElementById(gm_prefix+id); }

  function addClickEvent_GM(id, func){
    addEvent($$GM(id), "click", func);
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

  function getBoolField_GM(key, def){
    var val = $$GM(key);
    return val ? val.checked : def;
  }

  function gm_get(key){
    return GM_getValue(gm_prefix+key, '');
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

  function html_if_checked(val){
    return val ? ' checked' : '';
  }
  function html_add_id(id){
    return ' id="'+gm_prefix+id+'"';
  }
  function html_add_positive_value(val){
    return ' value="'+(val && val>0 ? val : '')+'"';
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
