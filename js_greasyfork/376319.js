// ==UserScript==
// @name           CT_friends
// @namespace      CheckT
// @author         CheckT
// @description    Комментарии на странице друзей
// @version        1.0
// @encoding       utf-8
// @homepage       https://greasyfork.org/en/scripts/376319-ct-friends
// @include        https://www.heroeswm.ru/friends.php
// @include        https://www.lordswm.com/friends.php
// @include        http://178.248.235.15/friends.php
// @grant          GM_getValue
// @grant          GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/376319/CT_friends.user.js
// @updateURL https://update.greasyfork.org/scripts/376319/CT_friends.meta.js
// ==/UserScript==

(function(){
  var gm_prefix = 'ctfr_';
  initGm();

  var tableToFix = document.querySelector('table[class="wb"]');
  if(tableToFix){
    var tmp = tableToFix.innerHTML;
    tmp = tmp.replace(/colspan="3"/g,'colspan="4"');
    var td_regexp = /<\/td><\/tr>/g;
    var idx = -3; //3 rows header
    while(true){
      var td_arr = td_regexp.exec(tmp);
      if(!td_arr)
        break;
      idx++;
      if(idx < 1) //skip header
        continue;
      var pos = td_regexp.lastIndex-5;
      var add = '<td><input type="text" value="" id="'
        + gm_prefix + idx + '" style="width:400px"/></td>';
      tmp = tmp.slice(0, pos) + add + tmp.slice(td_regexp.lastIndex);
      td_regexp.lastIndex += add.length;
    }
    tableToFix.innerHTML = tmp;
    var pl_id_regexp=/pl_info\.php\?id=(\d+)\"/;
    for(var i=1; i<=idx; i++){
      var inp = $$GM(i);
      var tr = inp.parentNode.parentNode;
      var pl_id = pl_id_regexp.exec(tr.innerHTML)[1];
      inp.value = gm_get(pl_id);
      inp.setAttribute('data-plid',pl_id);
      addEvent(inp, "change", change_info);
    }
  }

  return;
  
  function change_info(event){
    var inp = event.target || event.srcElement;
    gm_set(inp.getAttribute('data-plid'), inp.value.trim()); 
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
