// ==UserScript==
// @name           CT_leader for old browser
// @namespace      CheckT
// @author         CheckT
// @description    Автовоскрешение в гильдии лидеров с накоплением статиcтики
// @version        1.7
// @encoding       utf-8
// @homepage       https://greasyfork.org/en/scripts/376269-ct-leader
// @include        https://www.heroeswm.ru/leader_*
// @include        https://www.lordswm.com/leader_*
// @include        http://178.248.235.15/leader_*
// @grant          GM_deleteValue
// @grant          GM_getValue
// @grant          GM_listValues
// @grant          GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/377584/CT_leader%20for%20old%20browser.user.js
// @updateURL https://update.greasyfork.org/scripts/377584/CT_leader%20for%20old%20browser.meta.js
// ==/UserScript==

(function(){

/** ==== Style === */
function addStyleSheet(style){
  var getHead = document.getElementsByTagName("HEAD")[0];
  var cssNode = window.document.createElement( 'style' );
  var elementStyle= getHead.appendChild(cssNode);
  elementStyle.innerHTML = style;
  return elementStyle;
}

addStyleSheet("div#next_lg{background:#626763;color:white;display:inline !important;padding:5px 10px;position:relative;top:10;}");
addStyleSheet(".container{font-family: \"Lucida Sans Unicode\", \"Lucida Grande\", Sans-Serif;font-size:14px;border-collapse:collapse;text-align:center;margin:20px 0 -20px;width:100%;}");
addStyleSheet(".container th{font-weight:normal;}");
addStyleSheet(".container th,.container td:first-child{background:#626763;color:white;padding:5px 10px;");
addStyleSheet(".container th,.container td{border-style:solid;border-width:0 1px 1px 0;border-color:white;}");
addStyleSheet(".container td{background:#DDD9CD;padding:3px;}");
addStyleSheet(".container th:first-child,.container td:first-child{text-align:left;}");
addStyleSheet("a[href*=\"leader_army.php\"],a[href*=\"leader_army_exchange.php\"],.btn{background-color:#ddd9cd;background-image:linear-gradient(to top, #626763, #626763);border:2px solid #bfbfbf;-webkit-border-radius:0;-moz-border-radius:0;border-radius:0;-webkit-box-shadow:0 0 1px 0 #000,inset 0 -1px 0 0 #d9d9d9,inset 0 0 0 1px #f2f2f2,0 2px 4px 0 #f2f2f2;-moz-box-shadow:0 0 1px 0 #000,inset 0 -1px 0 0 #d9d9d9,inset 0 0 0 1px #f2f2f2,0 2px 4px 0 #f2f2f2;box-shadow:0 0 1px 0 #000,inset 0 -1px 0 0 #d9d9d9,inset 0 0 0 1px #f2f2f2,0 2px 4px 0 #f2f2f2;color:#fff;cursor:pointer !important;display:inline-block;font-family:Courier New;font-size:13px;height:auto;padding:3px 27px;text-decoration:none;text-shadow:0 1px 0 #000;width:auto;}");
addStyleSheet("a[href*=\"leader_army.php\"]:hover,a[href*=\"leader_army_exchange.php\"]:hover,a[href*=\"leader_army.php\"]:active,a[href*=\"leader_army_exchange.php\"]:active,.btn:hover,.btn:active{background-color:#f2f2f2;border:2px solid #8c8c8c;-webkit-box-shadow:inset 0 1px 0 0 #fff,inset 0 -1px 0 0 #d9d9d9,inset 0 0 0 1px #f2f2f2;-moz-box-shadow:inset 0 1px 0 0 #fff,inset 0 -1px 0 0 #d9d9d9,inset 0 0 0 1px #f2f2f2;box-shadow:inset 0 1px 0 0 #fff,inset 0 -1px 0 0 #d9d9d9,inset 0 0 0 1px #f2f2f2;color:#8c8c8c;}");
addStyleSheet("table.wbwhite tbody tr td table tbody tr td table tbody tr td center b font{background:#DC143C;color:white;display:inline !important;padding:5px 10px;position:relative;top:5;}");
/* Style End */


  initGm();
  var gm_prefix = 'ctldr_';
  var pl_id = getPlayerId();
  var gm_prefix_p = gm_prefix+pl_id+'_';

  var div_lg = document.getElementById('next_lg');
  var div_info = document.createElement('div');
    div_info.setAttribute('class', 'table_gl');
  if(div_lg){
    prepare_info(div_info, true);
    div_lg.parentNode.insertBefore(div_info, div_lg.nextSibling);
  } else {
    var div_global = document.getElementById('Global');
    if(div_global){
      prepare_info(div_info, false);
      div_global.parentNode.previousSibling.appendChild(div_info);
    } else {
      //return; //со страницей что-то не так - не нашли, куда встроиться
    }
  }
  addClickEvent_GM('reset', reset_curr);
  ressurect_main();

  return;

  function prepare_info(div_info, is_regular){
    var ressurect_count_curr = gm_get_num_p('ressurect_count_curr', 0);
    var ressurect_sum_curr = gm_get_num_p('ressurect_sum_curr', 0);
    var ressurect_count = gm_get_num_p('ressurect_count', 0);
    var ressurect_sum = gm_get_num_p('ressurect_sum', 0);
    var ressurect_last = gm_get_num_p('ressurect_last', 0);
    var button = '<button class="btn" type="button" title="Сбросить текущие данные" id="'+gm_prefix+'reset">СБРОСИТЬ</button>';

    if(is_regular){
      div_info.innerHTML =
                            '<table class="container">'+
                        '<thead>'+
                            '<tr>'+
                                '<th></th>'+
                                '<th>восстановлено</th>'+
                                '<th>общая сумма</th>'+
                                '<th>среднее</th>'+
                                '<th>последнее восстановление</th>'+
                            '</tr>'+
                        '</thead>'+
                        '<tbody>'+
                            '<tr>'+
                                '<td>ВСЕГО</td>'+
                                '<td>'+ressurect_count+' раз</td>'+
                                '<td>'+ressurect_sum+'</td>'+
                                '<td>'+(ressurect_count>0?(ressurect_sum/ressurect_count).toFixed(0):'n/a')+'</td>'+
                                '<td>'+ressurect_last+'</td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td>ТЕКУЩЕЕ</td>'+
                                '<td>'+ressurect_count_curr+' раз</td>'+
                                '<td>'+ressurect_sum_curr+'</td>'+
                                '<td>'+(ressurect_count_curr>0?(ressurect_sum_curr/ressurect_count_curr).toFixed(0):'n/a')+'</td>'+
                                '<td>'+button+'</td>'+
                            '</tr>'+
                        '</tbody>'+
                    '</table>';
    }else{
      div_info.innerHTML =
                    '<table class="container">'+
                        '<thead>'+
                            '<tr>'+
                                '<th></th>'+
                                '<th>восстановлено</th>'+
                                '<th>общая сумма</th>'+
                                '<th>среднее</th>'+
                                '<th>последнее восстановление</th>'+
                            '</tr>'+
                        '</thead>'+
                        '<tbody>'+
                            '<tr>'+
                                '<td>ВСЕГО</td>'+
                                '<td>'+ressurect_count+' раз</td>'+
                                '<td>'+ressurect_sum+'</td>'+
                                '<td>'+(ressurect_count>0?(ressurect_sum/ressurect_count).toFixed(0):'n/a')+'</td>'+
                                '<td>'+ressurect_last+'</td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td>ТЕКУЩЕЕ</td>'+
                                '<td>'+ressurect_count_curr+' раз</td>'+
                                '<td>'+ressurect_sum_curr+'</td>'+
                                '<td>'+(ressurect_count_curr>0?(ressurect_sum_curr/ressurect_count_curr).toFixed(0):'n/a')+'</td>'+
                                '<td>'+button+'</td>'+
                            '</tr>'+
                        '</tbody>'+
                    '</table>';
    }
  }

  function reset_curr(){
    if(confirm('Обнулить текущие счётики? Счётчики "всего" не сбрасываются.')){
      gm_set_p('ressurect_count_curr', 0);
      gm_set_p('ressurect_sum_curr', 0);
      prepare_info(div_info, div_lg);
    }
  }

  /*
    <input type=submit style="width:60px;" value="946" onClick="javascript: resurrect_sweet_confirm_all('946');" >
    window.location.href="leader_guild.php?action=res_all&sign=390cd7f233b04517ed3433869bf68e84";
    window.location.href="leader_winter.php?action=res_all&sign=390cd7f233b04517ed3433869bf68e84";
    window.location.href="leader_guild.php?action=res&sign=390cd7f233b04517ed3433869bf68e84&mon_id="+mon;

      если только 1 стек повреждён, нет кнопки "воскресить всех", но ссылка работает
    <input type=submit style="width:60px;" value="30" onClick="javascript: resurrect_sweet_confirm('leprekon', 'Лепреконы', '30');" >
  */

  function ressurect_main(){
    var sum_regexp = /javascript: resurrect_sweet_confirm_all\('(\d+)'\)/;
    var sum_one_regexp = /javascript: resurrect_sweet_confirm\(.+'(\d+)'\)/;

    var cleaned_body = document.body.innerHTML.replace(/,/g,'');

    var sum_check = sum_regexp.exec(cleaned_body);
    if(sum_check){
      ressurect(sum_check[1]);
    } else {
      var sum_one_check = sum_one_regexp.exec(cleaned_body);
      if(sum_one_check){
        ressurect(sum_one_check[1]);
      }
    }
  }

  function ressurect(sum){
    var url_regexp = /"(leader_.+\.php\?action=res_all\&sign=[a-f0-9]+)"/;
    var url_check = url_regexp.exec(document.body.innerHTML);
    if(url_check){
      var ressurect_count = gm_get_num_p('ressurect_count', 0);
      var ressurect_sum = gm_get_num_p('ressurect_sum', 0);
      var ressurect_count_curr = gm_get_num_p('ressurect_count_curr', 0);
      var ressurect_sum_curr = gm_get_num_p('ressurect_sum_curr', 0);
      gm_set_p('ressurect_count', ressurect_count+1);
      gm_set_p('ressurect_sum', ressurect_sum+Number(sum));
      gm_set_p('ressurect_count_curr', ressurect_count_curr+1);
      gm_set_p('ressurect_sum_curr', ressurect_sum_curr+Number(sum));
      gm_set_p('ressurect_last', sum);
      window.location.href = url_check[1];
    }
  }

  function gm_get_num_p(key, def){
    var val = Number(GM_getValue(gm_prefix_p+key, def));
    return isNaN(val) ? def : val;
  }

  function gm_set_p(key, val){
    return GM_setValue(gm_prefix_p+key, val);
  }

  function getPlayerId(){
    var hunter_ref = getI("//a[contains(@href, 'pl_hunter_stat')]");
      //min 2 для home; min 1 для остальных - если включены выпадающие вкладки
      //min 1 для home; min 0 для остальных - если отключены выпадающие вкладки
    if ( !hunter_ref || hunter_ref.snapshotLength == 0 || (hunter_ref.snapshotLength == 1 && location.pathname == '/home.php') ) {
        //отключены вкладки или разлогин
      var ids=/pl_id=(\d+)/.exec(document.cookie);
      return ids ? ids[1] : 'unknown';
    } else {
      return hunter_ref.snapshotItem(0).href.split('?id=')[1];
    }
  }

  function getI(xpath,elem){return document.evaluate(xpath,(elem?elem:document),null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);}

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
  function $$(id) { return document.getElementById(id); }
  function $$GM(id) { return $$(gm_prefix+id); }
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
})();
