// ==UserScript==
// @name           CT_friends
// @namespace      CheckT
// @author         CheckT & Zeleax
// @description    Комментарии на странице друзей + описание друзей на домашней странице
// @version        1.5
// @encoding       utf-8
// @homepage       https://greasyfork.org/en/scripts/376319-ct-friends
// @include      /https:\/\/(www.heroeswm.ru|www.lordswm.com|my.lordswm.com)\/(friends.php|home.php.*)/
// @grant          GM_getValue
// @grant          GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437046/CT_friends.user.js
// @updateURL https://update.greasyfork.org/scripts/437046/CT_friends.meta.js
// ==/UserScript==

(function(){
  var gm_prefix = 'ctfr_';
  initGm();

    var pl_id_regexp=/pl_info\.php\?id=(\d+)/;

    if(/friends.php/.test(location.href)){
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
            
            for(var i=1; i<=idx; i++){
                var inp = $$GM(i);
                var tr = inp.parentNode.parentNode;
                var pl_id = pl_id_regexp.exec(tr.innerHTML)[1];
                inp.value = gm_get(pl_id);
                inp.setAttribute('data-plid',pl_id);
                addEvent(inp, "change", change_info);
            }
        }
    }
    else if (/home.php/.test(location.href)){
        var el=getE( '//tr/td/a[1][contains(@href,"friends.php")]' ); // "Друзья в игре"
        if(el){
            var td_friends=el.parentNode.parentNode.nextSibling.firstChild; // td со списком друзей
            var friendsList = getL('./a', td_friends);
            var afriends=[], _clan, _player, _descr;
            i=0;

            while(i < friendsList.snapshotLength){
                el=friendsList.snapshotItem(i); // клан или игрок

                if(/clan_info/.test(el.href)) // клан
                {
                    _clan = el;
                    i++;
                }
                else _clan=null;

                _player=friendsList.snapshotItem(i); // игрок
                i++;

                pl_id = pl_id_regexp.exec(_player.href)[1];
                _descr=gm_get(pl_id);
                afriends.push([_clan, _player, _descr]);
            }

            afriends.sort(sortFunction3dcolumn);

            // создаем и наполняем таблицу
            var body = document.body,
                tbl  = document.createElement('table'),
                td;
            // tbl.style.width  = '100px';
            // tbl.style.border = '1px solid black';

            for(i=0; el=afriends[i]; i++){
                tr=tbl.insertRow();

                td=tr.insertCell(); // клан
                if(el[0]!=null) td.appendChild(el[0]);

                td=tr.insertCell(); // игрок
                td.appendChild(el[1]);

                td=tr.insertCell(); // передачи игрока
                var newText = document.createTextNode(">>");
                var linkProtokol = document.createElement('a');
                pl_id = pl_id_regexp.exec(el[1].href)[1]; // id игрока

                linkProtokol.setAttribute('href', location.href.substring(0, location.href.search('home'))+'pl_transfers.php?id='+pl_id);
                linkProtokol.setAttribute('target','_blank');
                linkProtokol.appendChild(newText);
                td.appendChild(linkProtokol);

                td=tr.insertCell(); // описание
                td.innerText=el[2];
            }

            removeAllChildNodes(td_friends);
            td_friends.appendChild(tbl);
        }
    }

  return;

    function sortFunction3dcolumn(a, b) {
        if (a[2] === b[2]) {
            return 0;
        }
        else {
            return (a[2] < b[2]) ? 1 : -1;
        }
    }

    function removeAllChildNodes(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

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


// доступ по xpath
function getE(xpath,el,docObj){return (docObj?docObj:document).evaluate(xpath,(el?el:(docObj?docObj.body:document.body)),null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;}
function getL(xpath,el,docObj){return (docObj?docObj:document).evaluate(xpath,(el?el:(docObj?docObj.body:document.body)),null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);}

})();
