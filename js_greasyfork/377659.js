// ==UserScript==
// @name         hwm_leader_sets
// @namespace    Striker
// @author       Striker
// @version      0.3.1
// @description  Наборы армии для ГЛ
// @include      https://www.heroeswm.ru/leader_*army.php*
// @include      https://www.lordswm.com/leader_*army.php*
// @include      https://my.lordswm.com/leader_*army.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/377659/hwm_leader_sets.user.js
// @updateURL https://update.greasyfork.org/scripts/377659/hwm_leader_sets.meta.js
// ==/UserScript==
(function() {
   if(typeof unsafeWindow != "object" || typeof unsafeWindow.max_leader != "number" || typeof GM_getValue != "function") {
      alert("hwm_leader_sets unsupported browser");
      return;
   }
   var pl_id = document.cookie.match(/pl_id=(\d+)/)[1];
   var lang = location.hostname.match("lords") ? true : false;
   var div = addElement("center", document.querySelector("#hwm_no_zoom"));
   var addButton = addElement("input", div, { type: "button", value: lang ? "Add" : "Добавить" });
   var cancelButton = addElement("input", div, { type: "button", value: lang ? "Cancel" : "Отмена" });
   var saveButton = addElement("input", div, { type: "button", value: lang ? "Save" : "Сохранить" });
   addButton.addEventListener("click", addArmyRow, false);
   cancelButton.addEventListener("click", loadSavedSets, false);
   saveButton.addEventListener("click", saveArmy, false);
   addElement("br", div);
   var mainTable = addElement("table", div, { style: "border: hidden; border-collapse: collapse; vertical-align: bottom;" });
   var tempArmySets;
   loadSavedSets();

   function loadSavedSets() {
      var savedString = GM_getValue(pl_id, "skeleton:6~goblin:10~imp:4;goblinus:37~peasant:35~gremlin:5~troglodyte:25;defender:20~pixel:150~crossman:67");
      tempArmySets = [];
      while(mainTable.firstChild) mainTable.removeChild(mainTable.firstChild);
      if(savedString === '') return;
      savedString = savedString.replace(/(\w+):/g, function(m, g1) {
         for(var i = 1; i < obj.length; i++)
            if(obj[i]['monster_id'] === g1) return i + ':';
         return m;
      });
      DrawArmyRow(savedString);
   }

   function DrawArmyRow(setString) {
      setString.split(';').forEach(function(cSet) {
         tempArmySets.push(cSet);
         var totalCost = 0;
         var r_tr = addElement("tr", mainTable);
         var td = addElement("td", r_tr, { style: "border: 2px dotted black; cursor: pointer;" });
         cSet.replace(/(\w+):(\d+)/g, function(m, g1, g2) {
            var linkNotId = isNaN(g1);
            var link = parseInt(g1);
            var count = parseInt(g2);
            var problem = '';
            var rarity = 1;
            var portrait = 'army_html/q_sign'
            if(!isNaN(g1)) {
               rarity = obj[link]['rarity'];
               portrait = 'portraits/' + obj[link]['lname'] + 'p33';
               totalCost += count * obj[link]['cost'];
               if(count * obj[link]['cost'] > max_leader_by_stack) problem = 'red';
               if(obj[link]['count'] < count) problem = 'cornflowerblue';
            }
            td.innerHTML += '<div class="cre_creature"><div class="cre_mon_parent">' + '<img src="https://dcdn.heroeswm.ru/i/army_html/fon_lvl' + rarity + '.png" width="60" height="50" class="cre_mon_image2">' +
               '<img src="https://dcdn.heroeswm.ru/i/' + portrait + '.png" width="60" height="50" class="cre_mon_image1">' +
               '<img src="https://dcdn.heroeswm.ru/i/army_html/frame_lvl' + rarity + '.png" width="60" height="50" class="cre_mon_image2" border="0"></div>' +
               (problem ? '<div class="cre_amount" style="top: 0px;left: 1px;text-align: left;font-size: 40px;line-height: 50px;color: ' + problem + ';">!</div>' : '') +
               '<div class="cre_amount">' + count + '</div></div>';
         });
         td.addEventListener("click", function() { setArmy(this.parentNode.rowIndex); }, false);
         var td_button = addElement("td", r_tr, { style: "border: 2px dotted black;" });
         var button = addElement("input", td_button, { type: "button", value: "X" });
         if(totalCost > max_leader) button.style.color = 'red';
         button.addEventListener("click", function() { delArmyRow(this.parentNode.parentNode); }, false);
      });
   }

   function delArmyRow(row) {
      tempArmySets.splice(row.rowIndex, 1);
      mainTable.removeChild(row);
   }

   function addArmyRow() {
      var currSet = [];
      for(var i = 1; i < obj_army.length; i++) {
         if(obj_army[i]['link'] && obj_army[i]['count']) currSet.push(obj_army[i]['link'] + ':' + obj_army[i]['count']);
      }
      if(currSet.length) DrawArmyRow(currSet.join('~'));
   }

   function setArmy(rowId) {
      for(var i = 7; i; i--) {
         obj_army[i]['link'] = 0;
         obj_army[i]['count'] = 0;
      }
      tempArmySets[rowId].replace(/(\w+):(\d+)/g, function(m, g1, g2) {
         if(!isNaN(g1)) {
            i += 1;
            var link = parseInt(g1);
            var count = parseInt(g2);
            obj_army[i]['link'] = link;
            obj_army[i]['count'] = obj[link]['count'] < count ? obj[link]['count'] : (count * obj[link]['cost'] > max_leader_by_stack ? parseInt(max_leader_by_stack / obj[link]['cost']) : count);
         }
      });
      show_details(obj_army[i]['link']);
      while(last_leader < 0) { //фикс превышения суммарного лидерства
         show_details(obj_army[i]['link']);
         i -= 1;
      }
   }

   function saveArmy() {
      GM_setValue(pl_id, tempArmySets.join(';').replace(/(\w+):/g, function(m, g1) {
         return isNaN(g1) ? m : obj[g1]['monster_id'] + ':';
      }));
   }

   function addElement(type, parent, data) {
      var el = document.createElement(type);
      if(parent) {
         parent.appendChild(el);
      }
      if(data) {
         for(var key in data) {
            el.setAttribute(key, data[key]);
         }
      }
      return el;
   }
})();