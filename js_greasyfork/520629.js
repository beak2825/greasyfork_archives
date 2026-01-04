// ==UserScript==
// @name         WoD 拉取装备要求
// @namespace    https://www.wannaexpresso.com/
// @description  Display minimum equipment requirements!
// @author       DotIN13
// @modifier     Christophero
// @version      2023.04.23.1
// @include      http*://*.world-of-dungeons.org/wod/spiel/hero/items.php*
// @include      https://*.wannaexpresso.com/wod/spiel/hero/items.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520629/WoD%20%E6%8B%89%E5%8F%96%E8%A3%85%E5%A4%87%E8%A6%81%E6%B1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/520629/WoD%20%E6%8B%89%E5%8F%96%E8%A3%85%E5%A4%87%E8%A6%81%E6%B1%82.meta.js
// ==/UserScript==

// todo:
// add error notification

(function () {
  "use strict";

  if (!$('h1:contains("装备着的物品")').length) return;
  var reqList = [];
  var hasTooltip = [];
  var xhr = [];
  var progress = 1;
  var equipSel;

  // Sort Equipment Requirements //////////////////////////////////////////////

  function sortReq() {
    var sortList = [
      { item: [], req: "力量至少为0" },
      { item: [], req: "体质至少为0" },
      { item: [], req: "智力至少为0" },
      { item: [], req: "灵巧至少为0" },
      { item: [], req: "魅力至少为0" },
      { item: [], req: "敏捷至少为0" },
      { item: [], req: "感知至少为0" },
      { item: [], req: "意志至少为0" },
    ];
    for (var i = 0; i < equipSel.length; i++) {
      if (reqList[i] != "") {
        for (var j = 0; j < reqList[i].length; j++) {
          var isMatch = false;
          for (var k = 0; k < sortList.length; k++) {
            if (
              reqList[i][j].replace(/\d*/g, "") ==
              sortList[k].req.replace(/\d*/g, "")
            ) {
              //console.log(reqList[i][j] + "match" + sortList[k].req);
              var requestVal = parseInt(
                reqList[i][j]
                  .replace(/(<([^>]+)>)/gi, "")
                  .match(/[^0-9]*(\d*)/)[1]
              );
              var sortVal = parseInt(
                sortList[k].req
                  .replace(/(<([^>]+)>)/gi, "")
                  .match(/[^0-9]*(\d*)/)[1]
              );
              if (requestVal > sortVal) {
                sortList[k].req = reqList[i][j];
                sortList[k].item = [
                  equipSel[i].options[equipSel[i].selectedIndex].innerText,
                ];
              } else if (requestVal == sortVal) {
                sortList[k].item.push(
                  equipSel[i].options[equipSel[i].selectedIndex].innerText
                );
              }
              isMatch = true;
            }
          }
          if (!isMatch)
            sortList.push({
              item: [equipSel[i].options[equipSel[i].selectedIndex].innerText],
              req: reqList[i][j],
            });
        }
      }
    }
    //console.log("done");
    var outputHTML = "<tr class = 'header'><th>装备</th><th>要求</th></tr>";
    for (var m = 0; m < sortList.length; m++) {
      if (m % 2) {
        outputHTML +=
          "<tr class = 'row1'><td>" +
          sortList[m].item.join("<br>") +
          "</td><td>" +
          sortList[m].req +
          "</td></tr>\n";
      } else {
        outputHTML +=
          "<tr class = 'row0'><td>" +
          sortList[m].item.join("<br>") +
          "</td><td>" +
          sortList[m].req +
          "</td></tr>\n";
      }
    }
    outputTable.innerHTML = outputHTML;
  }

  // XMLrequest /////////////////////////////////////////////////////////////

  window.XMLrequest = function (URL, i, length) {
    xhr[i] = new XMLHttpRequest();
    xhr[i].onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        outputDiv.innerHTML = "正在加载第" + progress + "件物品";
        var reqTitle = $(
          "#details>table>tbody>tr>td:contains('装备要求')",
          this.responseXML
        )[0];
        if (reqTitle != undefined) {
          var req = reqTitle.parentElement.lastElementChild.innerHTML.trim();
          //console.log(req);
          if (!hasTooltip[i]) {
            wodToolTip(equipSel[i].parentElement, req);
            hasTooltip[i] = true;
          } else {
            wodToolTipContent[equipSel[i].parentElement.id] = req;
          }
          reqList[i] = req.replace("<i>无任何需求</i>", "").split("<br>");
        } else {
          reqList[i] = [""];
        }
        progress++;
        if (progress == length + 1) {
          outputDiv.innerHTML = "加载完成";
          progress = 1;
          //console.log(reqList);
          sortReq();
        }
      }
    };
    xhr[i].open("GET", URL);
    xhr[i].responseType = "document";
    xhr[i].send();
  };

  // Add WoD Tip to Equipments //////////////////////////////////////////////

  window.equipmentTip = function () {
    equipSel = document.querySelectorAll("form table select");
    if (equipSel[0] != undefined) {
      var id, req, i;
      for (i = 0; i < equipSel.length; i++) {
        id =
          equipSel[i].options[equipSel[i].selectedIndex].value == "0"
            ? -equipSel[i].firstElementChild.value
            : equipSel[i].options[equipSel[i].selectedIndex].value;
        var URL = "/wod/spiel/hero/item.php?item_instance_id=" + id;
        equipSel[i].setAttribute(
          "onchange",
          "document.getElementById('outputDiv').innerHTML = '正在加载第1件物品'; var id = this.value == '0' ? -this.firstElementChild.value : this.value; XMLrequest('/wod/spiel/hero/item.php?item_instance_id=' + id, " +
            i +
            ", 1);"
        );
        XMLrequest(URL, i, equipSel.length);
      }
    } else {
      alert("请先清包！");
    }
  };

  // Frontend ////////////////////////////////////////////////////////////

  //let calcButton = document.createElement("input");
  //calcButton.id = "reqCalcButton";
  //calcButton.type = "button";
  //calcButton.setAttribute("class","button clickable");
  //calcButton.value = "计算最低装备要求";

  let tipButton = document.createElement("input");
  tipButton.id = "reqTipButton";
  tipButton.type = "button";
  tipButton.setAttribute("class", "button clickable");
  tipButton.value = "拉取装备要求";
  tipButton.setAttribute("onclick", "equipmentTip();");

  let outputDiv = document.createElement("div");
  outputDiv.id = "outputDiv";

  let outputTable = document.createElement("table");
  outputTable.id = "outputTable";
  outputTable.setAttribute("class", "content_table");

  var equipTable = document.querySelector("form table");
  //equipTable.parentNode.insertBefore(calcButton, equipTable.nextElementSibling);
  equipTable.parentNode.insertBefore(
    outputTable,
    equipTable.nextElementSibling
  );
  equipTable.parentNode.insertBefore(outputDiv, equipTable.nextElementSibling);
  equipTable.parentNode.insertBefore(tipButton, equipTable.nextElementSibling);
  var pageBody = document.querySelector("#gadgettable-center-gadgets");
})();
