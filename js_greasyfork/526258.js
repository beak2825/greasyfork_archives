// ==UserScript==
// @name         Send Resources
// @namespace    blackcat8438
// @version      10.3
// @description  Attempts to automate all the routine tasks in ikariam, like transporting wine
// @author       blackcat8438
// @exclude      http://board.*.ikariam.gameforge.com*
// @exclude      http://*.ikariam.gameforge.*/board
// @include	     https://s59-en.ikariam.gameforge.com*
// @include	     https://s60-en.ikariam.gameforge.com*
// @include	     https://s61-en.ikariam.gameforge.com*
// @include	     https://s800-en.ikariam.gameforge.com*
// @exclude      *://s*-en.ikariam.gameforge.com/?view=island*
// @exclude      *://s*-*.ikariam.gameforge.com/?view=worldmap_iso*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @require      http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/jquery-ui.min.js
// @grant        unsafeWindow
// @license              GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/526258/Send%20Resources.user.js
// @updateURL https://update.greasyfork.org/scripts/526258/Send%20Resources.meta.js
// ==/UserScript==
var resourcesJson = {};
function main() {
  try {
    var accountName = document.querySelector(
      ".avatarName > a.noViewParameters"
    ).title;
    var timer1, timer2, timer3;
    var townList = document.querySelector(
      "#dropDown_js_citySelectContainer > div.bg > ul"
    ).childNodes;
    var isAutoSendResourceRunning = false;
  } catch (e) {
    document.location.reload(true);
  }
  try {
    $("#txtLogger").prepend(localStorage.loggerInfo);
  } catch (e) {
    localStorage.loggerInfo = "";
  }
  //#region Ultilities

  window.getTownNameFromList = function (townNumber) {
    return townList[townNumber].childNodes[0].innerHTML.trim();
  };

  window.logInfo = function (message) {
    $("#txtLogger").prepend(
      new Date().toLocaleString() + " " + accountName + " " + message + "\n"
    );
    localStorage.loggerInfo = $("#txtLogger")[0].innerHTML;
  };

  window.clearLog = function () {
    $("#txtLogger")[0].innerHTML = "";
    localStorage.loggerInfo = "";
  };

  Array.prototype.hasMin = function (attrib, filter) {
    if (this.length === 1) {
      return this[0];
    }
    if (filter) {
      if (this.filter(filter).length > 0) {
        return this.filter(filter).reduce(function (prev, curr) {
          return prev[attrib] < curr[attrib] ? prev : curr;
        });
      }

      return null;
    } else {
      return this.reduce(function (prev, curr) {
        return prev[attrib] < curr[attrib] ? prev : curr;
      });
    }
  };

  window.sendAllArmy = function () {
    document.querySelectorAll(".setMax").forEach(function (setMaxButton) {
      setMaxButton.click();
    });
  };

  window.getVar = function (varname, vardefault, isGlobal) {
    var ret = isGlobal
      ? localStorage.getItem(varname)
      : localStorage.getItem(accountName + varname);
    if (null === ret && "undefined" !== typeof vardefault) return vardefault;
    return ret;
  };

  window.setVar = function (varname, varvalue, isGlobal) {
    localStorage.setItem(isGlobal ? varname : accountName + varname, varvalue);
  };

  window.openSpyBuilding = function () {
    try {
      document.querySelector("div.building.safehouse > a").click();
    } catch (e) {
      alert("Dont have spy building!");
    }
  };

  window.stringToNumber = function (str) {
    return parseFloat(str.replace(",", "").replace(" ", ""));
  };

  window.goBack = function () {
    document.querySelector("#js_backlinkButton").click();
  };

  window.showHideAuto = function () {
    //let x = $("#customDiv");
    //let empireBoard = $("#empireBoard");
    //localStorage.isSendResourceHidden = localStorage.isSendResourceHidden === "false";
    //x.fadeToggle(0);
    //empireBoard.fadeToggle(0);
    //try {
    //    if (document.querySelector("#tabReports > h3.header").innerText === "Espionage reports") {
    //        $("#container .table01").width(1200);
    //        $("#container .mainContentBox .mainContentScroll").width(1200);
    //    }
    //} catch (e) {
    //    console.log(e);
    //}
  };

  window.formatTimeLengthToStr = function (timeString, precision, spacer) {
    timeString = timeString || 0;
    precision = precision || 2;
    spacer = spacer || " ";
    if (timeString < 0) return "Finished.";
    var factors = [];
    var locStr = [];
    factors.year = 31536000;
    factors.month = 2520000;
    factors.day = 86400;
    factors.hour = 3600;
    factors.minute = 60;
    factors.second = 1;
    locStr.year = "Y";
    locStr.month = "M";
    locStr.day = "D";
    locStr.hour = "h";
    locStr.minute = "m";
    locStr.second = "s";
    timeString = Math.ceil(timeString / 1000);
    var retString = "";
    for (var fact in factors) {
      var timeInSecs = Math.floor(timeString / factors[fact]);
      if (isNaN(timeInSecs)) {
        return retString;
      }
      if (precision > 0 && (timeInSecs > 0 || retString !== "")) {
        timeString = timeString - timeInSecs * factors[fact];
        if (retString !== "") {
          retString += spacer;
        }
        retString += timeInSecs === 0 ? "" : timeInSecs + locStr[fact];
        precision = timeInSecs === 0 ? precision : precision - 1;
      }
    }
    return retString;
  };

  window.formatFullTimeToDateString = function (timeString, precise) {
    precise = precise || true;
    timeString = timeString || 0;
    var sInDay = 86400000;
    var day = "";
    var compDate = new Date(timeString);
    if (precise) {
      switch (
        Math.floor(compDate.getTime() / sInDay) - Math.floor($.now() / sInDay)
      ) {
        case 0:
          day = "today";
          break;
        case 1:
          day = "tomorrow";
          break;
        case -1:
          day = "yesterday";
          break;
        default:
          day = compDate.toString().split(" ").splice(0, 3).join(" "); //Dienstag
      }
    }
    if (day !== "") {
      day += ", ";
    }
    return day + compDate.toLocaleTimeString();
  };

  document.onkeydown = function (e) {
    var type = e.target.nodeName.toLowerCase();
    if (type === "input" || type === "textarea" || type === "select")
      return true;
    switch (e.which) {
      case 32:
        showHideAuto();
        break;
      case 65:
        sendAllArmy();
        break;
      case 83:
        openSpyBuilding();
        break;
      case 16:
        //goBack();
        break;
      case 66:
        createFormAutoBuild();
        break;
    }
  };

  window.getTownName = function () {
    return document.querySelector("#js_cityBread").innerHTML.trim();
  };

  window.compareValues = function (key, order = "asc") {
    return function (a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }

      const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
      const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }

      return order === "desc" ? comparison * -1 : comparison;
    };
  };

  window.formatNumToStr = function (inputNum, outputSign, precision) {
    precision = precision ? "10e" + (precision - 1) : 1;
    var ret, val, sign, i, j;
    var tho = ",";
    var dec = ".";
    if (!isFinite(inputNum)) {
      return "\u221E";
    }
    sign = inputNum > 0 ? 1 : inputNum === 0 ? 0 : -1;
    if (sign) {
      val = (Math.floor(Math.abs(inputNum * precision)) / precision + "").split(
        "."
      );
      ret = val[1] !== undefined ? [dec, val[1]] : [];
      val = val[0].split("");
      i = val.length;
      j = 1;
      while (i--) {
        ret.unshift(val.pop());
        if (i && j % 3 === 0) {
          ret.unshift(tho);
        }
        j++;
      }
      if (outputSign) {
        ret.unshift(sign === 1 ? "+" : "-");
      }
      return ret.join("");
    } else return inputNum;
  };

  window.toggleZoom = function () {
    $("#customDiv")[0].classList.toggle("zoom");
  };
  //#endregion

  //#region Send Resources
  // === Lấy sức chở mỗi tàu từ localStorage (đã calibrate) ===
  function getPerShipCapacity() {
    const saved = parseInt(
      localStorage.getItem("ika_perShipCapacity") || "0",
      10
    );
    if (Number.isFinite(saved) && saved > 0) {
      return saved;
    }
    // fallback mặc định
    return 500;
  }

  function getFreighterCapacity() {
    const saved = parseInt(
      localStorage.getItem("ika_freighterCapacity") || "0",
      10
    );
    if (Number.isFinite(saved) && saved > 0) {
      return saved;
    }
    // fallback mặc định
    return 50000; // theo config hiện tại
  }

  resourcesJson = JSON.parse(getVar("resource", "{}"));
  if (!resourcesJson.queue) {
    resourcesJson.queue = [];
  }
  window.addSendResource = function () {
    let destination = document.querySelector(
      "#transporterSendDestination"
    ).value;
    let origin = document.querySelector("#transporterSendFromTown").value;
    let resource = document.querySelector("#transporterSendResource").value;
    let amount = document.querySelector("#transporterSendAmount").value;

    resourcesJson.queue.push({
      resource: resource,
      amount: amount,
      destination: destination,
      origin: origin,
    });
    setVar("resource", JSON.stringify(resourcesJson));
    createResourceTable();
  };

  window.shiftResourceSettingQueue = function () {
    resourcesJson.queue.shift();
    setVar("resource", JSON.stringify(resourcesJson));
    createResourceTable();
  };

  window.popResourceSettingQueue = function () {
    resourcesJson.queue.pop();
    setVar("resource", JSON.stringify(resourcesJson));
    createResourceTable();
  };

  window.sendResources = function (
    townNumber,
    fromTownNumber,
    resource,
    queueObj
  ) {
    if (resourcesJson.isStart === true) {
      logInfo(
        "Start sent " +
          resource +
          " from " +
          getTownNameFromList(fromTownNumber) +
          " to " +
          getTownNameFromList(townNumber)
      );
      // if sending to the same town, STOP IT. ITS NOT FUNNY.
      if (townNumber === fromTownNumber) {
        return;
      }
      // correct for the fact that the dock GUI does not show the currently selected town
      if (Number(townNumber) > Number(fromTownNumber)) {
        townNumber--;
      }
      gotoTown(fromTownNumber, function () {
        if (
          Number(
            document.querySelector("#js_GlobalMenu_maxActionPoints").innerHTML
          ) > 0
        ) {
          // click dock on the left (gotta have dock there, no shipyardy stuff) or fixed now?
          if (document.querySelector("#position1").className.includes("port")) {
            document.querySelector("#js_CityPosition1Link").click();
          } else if (
            document.querySelector("#position2").className.includes("port")
          ) {
            document.querySelector("#js_CityPosition2Link").click();
          } else if (
            document
              .querySelector("#position1")
              .className.includes("constructionSite")
          ) {
            document.querySelector("#js_CityPosition1Link").click();
          } else if (
            document
              .querySelector("#position2")
              .className.includes("constructionSite")
          ) {
            document.querySelector("#js_CityPosition2Link").click();
          }
          townClick(townNumber, resource, queueObj);
        }
      }); // end gototown callback
    }
  };

  window.townClick = function (townNumber, resource, queueObj) {
    setTimeout(function () {
      if (document.querySelectorAll(".cities.clearfix > li > a").length > 0) {
        document
          .querySelectorAll(".cities.clearfix > li > a")
          [townNumber].click();
        enterValue(resource, queueObj);
      } else {
        townClick(townNumber, resource, queueObj);
      }
    }, 200);
  };

  window.enterValue = function (resource, queueObj) {
    setTimeout(function () {
      let isMerchant = document.querySelector("#textfield_wine") !== null;

      if (isMerchant) {
        let numberOfMerchantShips = Number(
          document.querySelector("#js_GlobalMenu_freeTransporters").innerHTML
        );
        let numberOfFreighters = Number(
          document.querySelector("#js_GlobalMenu_freeFreighters").innerHTML
        );

        if (numberOfMerchantShips > 0 || numberOfFreighters > 0) {
          let resourceID = "#textfield_" + resource;

          let capacityPerShip = numberOfMerchantShips
            ? getPerShipCapacity()
            : getFreighterCapacity();
          const capacity = numberOfMerchantShips
            ? capacityPerShip * numberOfMerchantShips
            : capacityPerShip * numberOfFreighters;

          // check if no merchant is available, use freighters instead
          if (numberOfMerchantShips <= 0) {
            setTimeout(function () {
              const maxFreighterBtn = document.querySelector(
                "#slider_freighters_max"
              );
              if (maxFreighterBtn) {
                maxFreighterBtn.click(); // để Trading Post tự set số Freighter tối đa
              }
            }, 500);
          }

          // điền resource
          document.querySelector(resourceID).value = Math.min(
            capacity,
            queueObj.amount
          );
          let sentAmount = Math.min(capacity, queueObj.amount);

          // click submit
          setTimeout(function () {
            document.querySelector("#submit").click();
          }, 500);

          // sau khi gửi xong
          finishSendResource(function () {
            logInfo(
              "Sent " +
                sentAmount +
                " " +
                resource +
                (isMerchant ? " [Merchant]" : " [Freighter]")
            );
            queueObj.amount -= sentAmount;
            if (queueObj.amount <= 0) {
              resourcesJson.queue.shift();
            }
            setVar("resource", JSON.stringify(resourcesJson));
            document.querySelector("#js_cityLink > a").click();
          });
        }
      } else {
        enterValue(resource, queueObj);
      }
    }, 200);
  };

  // FIX: reset lại cờ sau khi gửi tài nguyên xong
  window.finishSendResource = function (callback) {
    setTimeout(function () {
      if (document.querySelectorAll(".cities.clearfix > li > a").length > 0) {
        try {
          callback();
        } catch (e) {
          console.log("finishSendResource error:", e);
        }
        isAutoSendResourceRunning = false; // <--- thêm dòng này
      } else {
        finishSendResource(callback);
      }
    }, 200);
  };

  window.gotoTown = function (townNumber, callback, isCallback) {
    setTimeout(function () {
      if (getTownName().trim() === getTownNameFromList(townNumber).trim()) {
        callback();
      } else {
        if (!isCallback) {
          var listSpan = document.querySelectorAll(
            "#BuildTab .city_name > span.clickable"
          );
          for (var i = 0; i < listSpan.length; i++) {
            if (
              listSpan[i].innerHTML.trim() ===
              getTownNameFromList(townNumber).trim()
            ) {
              listSpan[i].click();
              break;
            }
          }
        }
        gotoTown(townNumber, callback, true);
      }
    }, 100);
  };

  window.createForm = function () {
    let HTML = '<div><span>From: </span><select id="transporterSendFromTown">';
    let townListObject = [];

    for (let i = 0; i < townList.length; i++) {
      let index = Number(townList[i].childNodes[0].innerHTML.split("-")[0]);
      let townNumber = i;
      townListObject.push({
        index: index,
        townNumber: townNumber,
        townName: townList[i].childNodes[0].innerHTML,
      });
    }
    townListObject.sort(compareValues("index"));
    townListObject.forEach(function (town) {
      HTML +=
        '<option value="' +
        town.townNumber +
        '">' +
        town.townName +
        "</option>";
    });
    HTML += "</select></div></br>";
    HTML +=
      '<div><span>Destination: </span><select id="transporterSendDestination">';
    townListObject.forEach(function (town) {
      HTML +=
        '<option value="' +
        town.townNumber +
        '">' +
        town.townName +
        "</option>";
    });
    HTML += "</select></div></br>";
    HTML += '<div><span>Resource: </span><select id="transporterSendResource">';
    HTML += '<option value="wood">Wood</option>';
    HTML += '<option value="wine">Wine</option>';
    HTML += '<option value="marble">Marble</option>';
    HTML += '<option value="glass">Crystal</option>';
    HTML += '<option value="sulfur">Sulfur</option>';
    HTML += "</select></div></br>";
    HTML +=
      '<div><span>Amount: </span><input id="transporterSendAmount" type="number"></div></br>';
    HTML +=
      '<button style="margin-right: 5px;" class="button" onclick="addSendResource();">Add</button>';
    HTML +=
      '<button style="margin-right: 5px;" class="button" onclick="shiftResourceSettingQueue();">Remove First</button>';
    HTML +=
      '<button style="margin-right: 5px;" class="button" onclick="popResourceSettingQueue();">Remove Last</button>';
    HTML +=
      '<button class="button" onclick="cancelResourcesDialog();">Close</button></br>';
    HTML +=
      '<table id="resourceTable" class="fullTable" border="1" cellpadding="5"><thead><th>Origin</th><th>Destination</th><th>Resource</th><th>Amount</th></thead>';
    HTML += '<tbody id="resourceTableBody"></tbody>';
    HTML += "</table>";

    return HTML;
  };

  window.createResourceTable = function () {
    let HTML = "";
    if (resourcesJson.queue && resourcesJson.queue.length > 0) {
      resourcesJson.queue.forEach(function (item) {
        HTML += "<tr><td>" + getTownNameFromList(item.origin) + "</td>";
        HTML += "<td>" + getTownNameFromList(item.destination) + "</td>";
        HTML += "<td>" + item.resource + "</td>";
        HTML += "<td>" + item.amount + "</td></tr>";
      });
    }
    let resourceTableBody = document.getElementById("resourceTableBody");
    if (resourceTableBody) resourceTableBody.innerHTML = HTML;
  };

  window.cancelResourcesDialog = function () {
    document.querySelector("#ikaMationTransporterDialog").outerHTML = "";
  };

  window.sendResourcesDialog = function () {
    // use ikariams built in fancy dialog box for our dialog for extra fancyness
    ikariam.createPopup(
      "ikaMationTransporterDialog",
      "Mass transport resources",
      createForm(),
      "???",
      "class"
    );
    createResourceTable();
  };

  window.sendResourcesFromForm = function () {
    let destination = document.querySelector(
      "#transporterSendDestination"
    ).value;
    let fromTown = document.querySelector("#transporterSendFromTown").value;
    let resource = document.querySelector("#transporterSendResource").value;
    let amount = document.querySelector("#transporterSendAmount").value;
    saveResourceSetting(destination, fromTown, resource, amount);
    document.querySelector("#ikaMationTransporterDialog").outerHTML = "";
  };

  window.checkAndProcess = function () {
    if (!isAutoSendResourceRunning) {
      if (!resourcesJson.queue || resourcesJson.queue.length <= 0) {
        startPauseProcess();
        document.querySelector("#js_cityLink > a").click();
      } else if (
        (document.querySelector("#js_GlobalMenu_freeTransporters").innerHTML >
          0 ||
          document.querySelector("#js_GlobalMenu_freeFreighters").innerHTML >
            0) &&
        resourcesJson.isStart === true &&
        resourcesJson.queue &&
        resourcesJson.queue.length > 0
      ) {
        let queueObj = resourcesJson.queue[0];
        if (queueObj.amount > 0) {
          isAutoSendResourceRunning = true;
          sendResources(
            queueObj.destination,
            queueObj.origin,
            queueObj.resource,
            queueObj
          );
        }
      }
    }
  };

  window.refreshStatus = function () {
    if (resourcesJson.queue && resourcesJson.queue.length > 0) {
      queueObj = resourcesJson.queue[0];
      $("#transporterInfo")[0].innerHTML =
        queueObj.amount +
        " " +
        queueObj.resource +
        " from " +
        townList[Number(queueObj.origin)].childNodes[0].innerHTML +
        " to " +
        townList[Number(queueObj.destination)].childNodes[0].innerHTML;
    }

    //checkPirate();
  };

  window.checkPirate = function () {
    try {
      var captcha = document.querySelector(
        "#pirateCaptureBox > div > form .captchaImage"
      );
      if (captcha) {
        logInfo("Need Captcha");
        return;
      }
      var listLink = document
        .querySelectorAll("#pirateCaptureBox > div > table")[0]
        .querySelectorAll(".action > a");
      if (listLink[0].classList.contains("capture")) {
        listLink[0].click();
        return;
      }
    } catch (e) {
      console.log(e);
    }
  };

  window.startPauseProcess = function () {
    if (resourcesJson.isStart === true) {
      resourcesJson.isStart = false;
      clearInterval(timer1);
      clearInterval(timer2);
      $("#btnStartScript").text("Start Timer");
    } else {
      resourcesJson.isStart = true;
      $("#btnStartScript").text("Stop Timer");
      timer1 = setInterval(checkAndProcess, 1000);
      timer2 = setInterval(refreshStatus, 1000);
    }
    setVar("resource", JSON.stringify(resourcesJson));
  };

  if (resourcesJson.isStart === true) {
    $("#btnStartScript").text("Stop Timer");
    timer1 = setInterval(checkAndProcess, 1000);
    timer2 = setInterval(refreshStatus, 1000);
  }

  //#endregion Send Resources

  //#region Auto Wine

  var listSender = [],
    listReceiver = [],
    listAccount = [],
    totalWPH = 0,
    multiple = 1;
  listSender = JSON.parse(getVar("listSender", "[]"));
  listReceiver = JSON.parse(getVar("listReceiver", "[]"));
  listAccount = JSON.parse(getVar("listAccount", "[]", true));

  window.createFormWine = function () {
    let HTML =
      '<div><table id="autoWineTable" class="fullTable" border="1" cellpadding="5"><tr><th>Sender</th><th>Town Name</th><th>Wine per hour</th></tr>';
    let townList = document.querySelector(
      "#dropDown_js_citySelectContainer > div.bg > ul"
    ).childNodes;
    let townListObject = [];

    for (let i = 0; i < townList.length; i++) {
      let index = Number(townList[i].childNodes[0].innerHTML.split("-")[0]);
      let townNumber = i;
      townListObject.push({
        index: index,
        townNumber: townNumber,
        townName: townList[i].childNodes[0].innerHTML,
      });
    }
    townListObject.sort(compareValues("index"));
    townListObject.forEach(function (town) {
      HTML +=
        '<tr class="txtWine"><td><input type="checkbox" ' +
        (listSender.includes(town.townNumber.toString()) ? "checked" : "") +
        ' id="cbSender_' +
        town.townNumber +
        '" name="' +
        town.townName +
        '" value="' +
        town.townNumber +
        '"/></td><td>' +
        town.townName +
        "</td>";
      if (
        listReceiver.find((x) => x.townNumber === town.townNumber.toString())
      ) {
        HTML +=
          '<td><input type="text" id="txtWine_' +
          town.townNumber +
          '" value="' +
          listReceiver.find((x) => x.townNumber === town.townNumber.toString())
            .winePerHour +
          '"/></td></tr>';
      } else {
        HTML +=
          '<td><input type="text" id="txtWine_' +
          town.townNumber +
          '" value="0"/></td></tr>';
      }
    });

    HTML += "</table></div></br>";

    HTML +=
      '<button style="margin-right: 20px;" class="button" onclick="saveSettingAutoWine();">Save</button>';
    HTML +=
      '<button style="margin-right: 20px;" class="button" onclick="loadConsumedWine();">Load</button>';
    HTML +=
      '<button class="button" onclick="cancelResourcesDialog();">Cancel</button></br></br>';
    return HTML;
  };

  window.saveSettingAutoWine = function () {
    listSender = [];
    listReceiver = [];
    var listRowTxtWine = document.getElementsByClassName("txtWine");

    //Get List Sender & List Receiver
    for (var i = 0; i < listRowTxtWine.length; i++) {
      var cbSender = listRowTxtWine[i].querySelector("input[type=checkbox]");
      if (cbSender.checked) {
        let townNumber = cbSender.id.replace("cbSender_", "");
        listSender.push(townNumber);
      } else {
        var txtWine = listRowTxtWine[i].querySelector("input[type=text]");
        let townNumber = txtWine.id.replace("txtWine_", "");
        if (Number(txtWine.value) > 0) {
          listReceiver.push({
            townNumber: townNumber,
            winePerHour: txtWine.value,
          });
        }
      }
    }
    //save 2 lists into localStorage
    setVar("listSender", JSON.stringify(listSender));
    setVar("listReceiver", JSON.stringify(listReceiver));
    cancelResourcesDialog();
  };

  window.sendResourcesDialogWine = function () {
    // use ikariams built in fancy dialog box for our dialog for extra fancyness
    ikariam.createPopup(
      "ikaMationTransporterDialog",
      "Mass transport resources",
      createFormWine(),
      "???",
      "class"
    );
  };

  window.gotoTownAutoWine = function (index, callback) {
    gotoTown(listSender[index], function () {
      var totalWineText = $("#js_GlobalMenu_wine")[0].innerText.replace(
        ",",
        ""
      );
      var totalWine;
      if (totalWineText.indexOf("k") > -1) {
        totalWine = Number(totalWineText.replace("k", "")) * 1000;
      } else {
        totalWine = Number(totalWineText);
      }
      if (totalWine >= totalWPH * multiple + 500) {
        callback(listSender[index]);
      } else if (index < listSender.length - 1) {
        gotoTownAutoWine(index + 1, callback);
      } else {
        if (multiple > 1) {
          multiple = multiple - 1;
          gotoTownAutoWine(0, callback);
        } else {
          logInfo("There are no town have enough wine to send!");
        }
      }
    });
  };

  window.openPopupChooseWineSource = function () {
    showHideAuto();
    let townList = document.querySelector(
      "#dropDown_js_citySelectContainer > div.bg > ul"
    ).childNodes;
    let townListObject = [];

    for (let i = 0; i < townList.length; i++) {
      let index = Number(townList[i].childNodes[0].innerHTML.split("-")[0]);
      let townNumber = i;
      townListObject.push({
        index: index,
        townNumber: townNumber,
        townName: townList[i].childNodes[0].innerHTML,
      });
    }
    townListObject.sort(compareValues("index"));

    let HTML = "";
    if (listSender.length === 1) {
      checkAndProcessAutoWine(listSender[0]);
      return;
    }
    listSender.forEach(function (sender) {
      townListObject.forEach(function (town) {
        if (town.townNumber.toString() === sender) {
          HTML +=
            '<button style="margin-right: 20px;" class="button" onclick="checkAndProcessAutoWine(' +
            town.townNumber +
            ');">' +
            town.townName +
            "</button>";
        }
      });
    });

    HTML +=
      '<button class="button" onclick="cancelResourcesDialog();">Cancel</button></br></br>';
    ikariam.createPopup(
      "ikaMationTransporterDialog",
      "Mass transport resources",
      HTML,
      "???",
      "class"
    );
  };

  window.checkAndProcessAutoWine = function (fromTown) {
    showHideAuto();
    //Calculate total wine per hour
    totalWPH = 0;
    for (let i = 0; i < listReceiver.length; i++) {
      totalWPH += Number(listReceiver[i].winePerHour);
    }

    //Calculate total minimum ship needed
    let minShipNeeded = 0;
    for (let i = 0; i < listReceiver.length; i++) {
      if (Number(listReceiver[i].winePerHour) > 500) {
        minShipNeeded += 2;
      } else {
        minShipNeeded += 1;
      }
    }
    let minFreightersNeeded = 0;
    for (let i = 0; i < listReceiver.length; i++) {
      if (Number(listReceiver[i].winePerHour) > 50000) {
        minFreightersNeeded += 2;
      } else {
        minFreightersNeeded += 1;
      }
    }
    var availableShips = document.querySelector(
      "#js_GlobalMenu_freeTransporters"
    ).innerHTML;
    var availableFreighters = document.querySelector(
      "#js_GlobalMenu_freeFreighters"
    ).innerHTML;
    if (
      availableShips < minShipNeeded &&
      availableFreighters < minFreightersNeeded
    ) {
      alert("Not enough ship!");
      return;
    }

    multiple = 1;

    let canIncrease = true;
    while (canIncrease) {
      // Calculate total ships needed after multiple
      let totalShips = 0;
      for (let i = 0; i < listReceiver.length; i++) {
        totalShips += Math.ceil(
          (Number(listReceiver[i].winePerHour) * (multiple + 1)) / cargoSpace
        );
      }
      if (availableShips >= totalShips) {
        multiple += 1;
      } else {
        canIncrease = false;
      }
    }
    gotoTown(fromTown, function () {
      sendWine(fromTown, 0);
    });

    // gotoTownAutoWine(0, function (fromTown) {
    //     logInfo("Sending wine " + multiple + "hours");
    //     sendWine(fromTown, 0);
    // });
  };

  window.sendWine = function (fromTown, receiverIndex) {
    let toTown = listReceiver[receiverIndex].townNumber;
    let WPH = listReceiver[receiverIndex].winePerHour;
    if (toTown === fromTown) {
      throw "ERROR sending to same town? Not on my watch!";
    }
    logInfo(
      "Start sent " +
        Number(WPH) * multiple +
        " wine from " +
        getTownNameFromList(fromTown) +
        " to " +
        getTownNameFromList(toTown)
    );
    if (Number(toTown) > Number(fromTown)) {
      toTown--;
    }

    if (receiverIndex === 0) {
      if (document.querySelector("#position1").className.includes("port")) {
        document.querySelector("#js_CityPosition1Link").click();
      } else if (
        document.querySelector("#position2").className.includes("port")
      ) {
        document.querySelector("#js_CityPosition2Link").click();
      }
    }
    townClickWine(toTown, WPH, function () {
      if (receiverIndex < listReceiver.length - 1) {
        sendWine(fromTown, receiverIndex + 1);
      } else {
        setTimeout(function () {
          document.querySelector("#js_cityLink > a").click();
        }, 2000);
      }
    });
  };

  window.townClickWine = function (toTown, WPH, callback) {
    setTimeout(function () {
      if (document.querySelectorAll(".cities.clearfix > li > a").length > 0) {
        document.querySelectorAll(".cities.clearfix > li > a")[toTown].click();
        enterValueWine(WPH, callback);
      } else {
        townClickWine(toTown, WPH, callback);
      }
    }, 200);
  };

  window.enterValueWine = function (WPH, callback) {
    setTimeout(function () {
      if (document.querySelector("#textfield_wine") !== null) {
        //let quantity = Number(Math.floor(WPH * 24 / 500) * 500);
        let quantity = Number(WPH) * multiple;
        document.querySelector("#textfield_wine").value = quantity;
        setTimeout(function () {
          document.querySelector("#submit").click();
          logInfo("Done.");
          callback();
        }, 200);
      } else {
        enterValueWine(WPH, callback);
      }
    }, 500);
  };

  window.loadConsumedWine = function () {
    let townList = document.querySelector(
      "#dropDown_js_citySelectContainer > div.bg > ul"
    ).childNodes;
    var listRow = document.querySelectorAll("#ResTab > table > tbody > tr");
    for (let i = 0; i < townList.length; i++) {
      listRow.forEach(function (row) {
        if (
          townList[i].childNodes[0].innerHTML.trim() ===
          row.querySelector("td.city_name > .clickable").innerHTML
        ) {
          var wineConsumed =
            Number(row.querySelector("td.resource.wine > span.Red").innerHTML) *
            -1;
          var input = document.querySelector("#txtWine_" + i);
          input.value = wineConsumed;
        }
      });
    }
  };

  //#endregion Auto Wine

  //#region Summary Account

  window.updateListAccount = function () {
    var titleArray = document.title.toLowerCase().split("-");
    var timeArray = titleArray[1].trim().split(" ");
    var totalSeconds = 0;
    for (var i = timeArray.length - 1; i >= 0; i--) {
      if (timeArray[i].includes("s")) {
        totalSeconds += Number(timeArray[i].replace("s", "")) * 1000;
      } else if (timeArray[i].includes("m")) {
        totalSeconds += Number(timeArray[i].replace("m", "")) * 60000;
      } else if (timeArray[i].includes("h")) {
        totalSeconds += Number(timeArray[i].replace("h", "")) * 3600000;
      } else if (timeArray[i].includes("d")) {
        totalSeconds += Number(timeArray[i].replace("d", "")) * 86400000;
      }
    }
    listAccount.sort(compareValues("account"));

    if (listAccount.find((x) => x.account === accountName)) {
      var existAccount = listAccount.find((x) => x.account === accountName);
      existAccount.time = totalSeconds + $.now();
      if (document.querySelector("#t_currentwood")) {
        existAccount.totalWood = document
          .querySelector("#t_currentwood")
          .innerHTML.replace(/,/g, "");
        existAccount.timeWood = $.now() + 0;
        existAccount.woodIncome = document
          .querySelector("#t_woodincome > span.Green")
          .innerHTML.replace("+", "")
          .replace(/,/g, "");
      }
    } else {
      listAccount.push({ account: accountName, time: totalSeconds + $.now() });
    }

    setVar("listAccount", JSON.stringify(listAccount), true);
    refreshSummaryAccount();
  };

  window.refreshSummaryAccount = function () {
    //logInfo("Refresh Account");
    if (document.querySelector("#t_currentwood")) {
      if (listAccount.find((x) => x.account === accountName)) {
        var existAccount = listAccount.find((x) => x.account === accountName);
        existAccount.totalWood = document
          .querySelector("#t_currentwood")
          .innerHTML.replace(/,/g, "");
        existAccount.timeWood = $.now() + 0;
        existAccount.woodIncome = document
          .querySelector("#t_woodincome > span.Green")
          .innerHTML.replace("+", "")
          .replace(/,/g, "");
        setVar("listAccount", JSON.stringify(listAccount), true);
      }
    }

    let html = '<table id="summaryAccountTable" border="1" cellpadding="10px">';

    if (listAccount.length > 0) {
      html +=
        '<tr><th></th><th>Account</th><th>Time Left</th><th>Total Wood</th><th class="woodWeek">Wood Per h</th><th class="woodWeek">1 Week</th></tr>';
      var minObj = listAccount.hasMin("time", function (item) {
        return item.isAutoBuildChecked;
      });
      var min;
      if (minObj) {
        min = minObj.account;
      }

      for (var i = 0; i < listAccount.length; i++) {
        var account = listAccount[i].account;
        var time = listAccount[i].time;
        let woodIncomeBySecond = Number(listAccount[i].woodIncome) / 3600;
        html +=
          '<tr class="' +
          (accountName === account ? "active" : "") +
          (account === min ? " min" : "") +
          '">' +
          '<td><input type="checkbox" ' +
          (listAccount[i].isAutoBuildChecked === true ? "checked" : "") +
          ' id="cb' +
          listAccount[i].account +
          '" onclick="checkBoxAutoBuildChanged(this, \'' +
          listAccount[i].account.trim() +
          "');\"/></td>" +
          '<td><a href="https://lobby.ikariam.gameforge.com/en_GB/accounts?redirectAccount=' +
          account +
          '">' +
          account +
          "</a></td>" +
          '<td style="text-align: right">' +
          formatTimeLengthToStr(time - $.now(), 3, " ") +
          "</td>" +
          '<td style="text-align: right">' +
          formatNumToStr(
            Number(listAccount[i].totalWood) +
              Math.round(
                woodIncomeBySecond *
                  (($.now() - listAccount[i].timeWood) / 1000)
              ),
            false,
            0
          ) +
          "</td>" +
          '<td style="text-align: right" class="woodWeek">' +
          formatNumToStr(listAccount[i].woodIncome) +
          "</td>" +
          '<td style="text-align: right" class="woodWeek">' +
          formatNumToStr(Number(listAccount[i].woodIncome) * 24 * 7) +
          "</td>" +
          "</tr>";
      }
    }

    html += "</table>";
    $("#summaryAccountList")[0].innerHTML = html;

    if (
      localStorage.isAutoBuildStart === "true" ||
      resourcesJson.isStart === true
    ) {
      try {
        if (
          new Date().getUTCMinutes() % 2 === 0 &&
          new Date().getUTCMinutes() !== Number(localStorage.reloadedMinute)
        ) {
          localStorage.reloadedMinute = new Date().getUTCMinutes();
          localStorage.isAutoReload = false;
          document.querySelector("#js_cityLink > a").click();
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  window.checkBoxAutoBuildChanged = function (checkbox, account) {
    listAccount.find((x) => x.account === account).isAutoBuildChecked =
      checkbox.checked ? true : false;
    setVar("listAccount", JSON.stringify(listAccount), true);
  };

  window.clearListAccount = function () {
    listAccount = [];
    setVar("listAccount", JSON.stringify(listAccount), true);
    refreshSummaryAccount();
  };

  updateListAccount();
  timer3 = setInterval(refreshSummaryAccount, 10000);

  //#endregion Summary Account

  //#region Auto Build
  var listAutoBuild = [],
    timerAutoBuild,
    isProcessing;
  listAutoBuild = JSON.parse(getVar("listAutoBuild", "[]", true));

  window.createFormAutoBuild = function () {
    let HTML =
      '<table id="autoBuildTable" class="fullTable" border="1" cellpadding="5"><tr><th>List Building</th>';
    var listSpan = document.querySelectorAll(
      "#BuildTab .city_name > span.clickable"
    );
    for (let i = 0; i < listSpan.length; i++) {
      HTML += "<th>" + listSpan[i].innerHTML.trim() + "</th>";
    }

    HTML += '</tr><tr><td id="tdListBuilding">' + loadIsland() + "</td>";
    for (let i = 0; i < listSpan.length; i++) {
      HTML +=
        '<td class="tdQueue" id="' +
        listSpan[i].innerHTML.trim() +
        '">' +
        loadQueue(listSpan[i].innerHTML.trim()) +
        "</td>";
    }

    HTML += "</tr></table></br>";

    HTML +=
      '<button style="margin-right: 20px;" class="button" onclick="saveAutoBuild();">Save</button>';
    //HTML += '<button style="margin-right: 20px;" class="button" onclick="loadIsland();">Load Island</button>';
    HTML +=
      '<button class="button" onclick="cancelResourcesDialog();">Cancel</button></br></br>';

    ikariam.createPopup(
      "ikaMationTransporterDialog",
      getTownName(),
      HTML,
      "???",
      "class"
    );
    $("#autoBuildTable")[0].classList.toggle("fixTable");
  };

  window.saveAutoBuild = function () {
    setVar("listAutoBuild", JSON.stringify(listAutoBuild), true);

    cancelResourcesDialog();
  };

  window.loadIsland = function () {
    var listBuilding = document.querySelectorAll(
      "div[id^='position'].building:not(.buildingGround)"
    );

    var listBuildingHtml = "";
    var listBuildingArray = [];
    for (var i = 0; i < listBuilding.length; i++) {
      var buildingName = listBuilding[i]
        .querySelector(".hoverable")
        .title.trim()
        .replace("(", "")
        .replace(")", "")
        .replace("Under construction", "0");
      // Check if building is upgrading
      if (listBuilding[i].classList.contains("constructionSite")) {
        let oldLevel = Number(buildingName.split(" ").pop());
        buildingName = buildingName.replace(oldLevel, oldLevel + 1);
      }
      var positionId = listBuilding[i].querySelector(".hoverable").id.trim();
      listBuildingArray.push({
        buildingName: buildingName,
        positionId: positionId,
      });
    }
    listBuildingArray.sort(compareValues("buildingName"));
    for (let i = 0; i < listBuildingArray.length; i++) {
      listBuildingHtml += "<span>" + listBuildingArray[i].buildingName;
      listBuildingHtml +=
        '<button class="button" onclick="addBuildingToQueue(\'' +
        listBuildingArray[i].positionId +
        "', '" +
        listBuildingArray[i].buildingName +
        "');\">+</button></span><br/>";
    }

    return listBuildingHtml;
  };

  window.loadQueue = function (townName) {
    var queueHtml = "-empty-";
    var accountObj = listAutoBuild.find((x) => x.accountName === accountName);
    if (accountObj) {
      var townObj = accountObj.townList.find((x) => x.townName === townName);
      if (townObj && townObj.queue && townObj.queue.length > 0) {
        queueHtml = "";
        let count = 1;
        townObj.queue.forEach(function (item) {
          queueHtml +=
            "<span>" +
            count +
            "." +
            item.buildingName +
            '<button class="button" onclick="removeBuildingFromQueue(\'' +
            item.positionId +
            "', '" +
            item.buildingName +
            "', '" +
            townName +
            "');\">-</button></span><br/>";
          count = count + 1;
        });
      }
    }
    return queueHtml;
  };

  window.addBuildingToQueue = function (positionId, buildingName) {
    var accountObj = listAutoBuild.find((x) => x.accountName === accountName);
    var townName = getTownName();
    // Process building name
    var buildingLevel = buildingName.split(" ").pop();
    if (accountObj) {
      var townObj = accountObj.townList.find((x) => x.townName === townName);
      if (townObj) {
        var existedPositionId = townObj.queue.filter(
          (x) => x.positionId === positionId
        );
        var existedLevel = 1;
        if (existedPositionId.length > 0) {
          existedLevel = existedPositionId.length + 1;
        }
        buildingLevel = Number(buildingLevel) + existedLevel;
        buildingName = buildingName.replace(
          buildingName.split(" ").pop(),
          buildingLevel
        );
        townObj.queue.push({
          positionId: positionId,
          buildingName: buildingName,
        });
      } else {
        buildingLevel = Number(buildingLevel) + 1;
        buildingName = buildingName.replace(
          buildingName.split(" ").pop(),
          buildingLevel
        );
        accountObj.townList.push({
          townName: townName,
          queue: [{ positionId: positionId, buildingName: buildingName }],
        });
      }
    } else {
      buildingLevel = Number(buildingLevel) + 1;
      buildingName = buildingName.replace(
        buildingName.split(" ").pop(),
        buildingLevel
      );
      listAutoBuild.push({
        accountName: accountName,
        townList: [
          {
            townName: townName,
            queue: [{ positionId: positionId, buildingName: buildingName }],
          },
        ],
      });
    }

    document.querySelector("[id='" + townName + "']").innerHTML =
      loadQueue(townName);
  };

  window.removeBuildingFromQueue = function (
    positionId,
    buildingName,
    townName
  ) {
    var accountObj = listAutoBuild.find((x) => x.accountName === accountName);
    if (accountObj) {
      var townObj = accountObj.townList.find((x) => x.townName === townName);
      if (townObj) {
        var queueObj = townObj.queue.find(
          (x) => x.buildingName === buildingName && x.positionId === positionId
        );
        townObj.queue.splice(townObj.queue.indexOf(queueObj), 1);
      }
    }

    document.querySelector("[id='" + townName + "']").innerHTML =
      loadQueue(townName);
  };

  window.startQueue = function (oldTownName, callback) {
    setTimeout(function () {
      if (getTownName() !== oldTownName) {
        if (document.querySelector(".close")) {
          document.querySelector(".close").click();
        }
        if (document.querySelector(".constructionSite")) {
          logInfo("This town is inprogress, Next>>");
          callback();
          return;
        }

        try {
          var townName = getTownName();
          var queue = listAutoBuild
            .find((x) => x.accountName === accountName)
            .townList.find((x) => x.townName === townName).queue;
          var firstQueue = queue[0];
          logInfo("Start upgrade building " + firstQueue.buildingName);
          setTimeout(function () {
            document.querySelector("#" + firstQueue.positionId).click();
          }, 500);

          clickUpgrade(queue, callback);
        } catch (e) {
          callback();
        }
      } else {
        startQueue(oldTownName, callback);
      }
    }, 1000);
  };

  window.clickUpgrade = function (queue, callback) {
    setTimeout(function () {
      if (document.querySelector("#js_buildingUpgradeButton")) {
        document.querySelector("#js_buildingUpgradeButton").click();
        logInfo("Finish upgrade building " + queue[0].buildingName);
        queue.splice(0, 1);
        setVar("listAutoBuild", JSON.stringify(listAutoBuild), true);
        callback();
      } else {
        clickUpgrade(queue, callback);
      }
    }, 100);
  };

  window.checkAndProcessAutoBuild = function (townIndex, forceStart = false) {
    // FIX: chặn AutoBuild nếu đang gửi tài nguyên
    if (isAutoSendResourceRunning) {
      logInfo("AutoBuild tạm dừng do đang gửi tài nguyên");
      return; // skip vòng này, 10s sau sẽ thử lại
    }

    // Make sure in Town screen
    if (document.querySelector("#js_cityBread")) {
      if (localStorage.isAutoReload === "false" || forceStart) {
        var accountObj = listAutoBuild.find(
          (x) => x.accountName === accountName
        );
        var townName = getTownName();
        if (accountObj) {
          isProcessing = true;
          var listTownNeedUpgrade = [];
          accountObj.townList.forEach(function (item) {
            listTownNeedUpgrade.push(item.townName);
          });
          listTownNeedUpgrade.sort();
          if (townIndex < listTownNeedUpgrade.length) {
            //setTimeout(function () {
            document.querySelector("#js_CityPosition0Link").click();
            //}, 500);
            var spanClickable;
            var listSpan = document.querySelectorAll(
              "#BuildTab .city_name > span.clickable"
            );
            for (var i = 0; i < listSpan.length; i++) {
              if (
                listSpan[i].innerHTML.trim() === listTownNeedUpgrade[townIndex]
              ) {
                spanClickable = listSpan[i];
                break;
              }
            }
            if (spanClickable.innerHTML.trim() === townName) {
              townName += "xxx";
            } else {
              logInfo("Going to town " + listTownNeedUpgrade[townIndex]);
              setTimeout(function () {
                spanClickable.click();
              }, 1000);
            }

            startQueue(townName, function () {
              setTimeout(function () {
                if (document.querySelector(".close")) {
                  document.querySelector(".close").click();
                }
                checkAndProcessAutoBuild(townIndex + 1, forceStart);
              }, 1500);
            });
          } else {
            isProcessing = false;
            cleanListAutoBuild();
            localStorage.isAutoReload = true;
            document.querySelector("#js_cityLink > a").click();
          }
        } else {
          listAccount.find(
            (x) => x.account === accountName
          ).isAutoBuildChecked = false;
          setVar("listAccount", JSON.stringify(listAccount), true);
          isProcessing = false;
          cleanListAutoBuild();
          localStorage.isAutoReload = true;
          document.querySelector("#js_cityLink > a").click();
        }
      } else {
        localStorage.isAutoReload = false;
      }
    } else {
      document.querySelector("#js_cityLink > a").click();
    }
  };

  window.cleanListAutoBuild = function () {
    listAutoBuild.forEach(function (item) {
      var newTownList = item.townList.filter(function (town) {
        return town.queue.length > 0;
      });

      item.townList = newTownList;
    });

    var newAccountList = listAutoBuild.filter(function (account) {
      return account.townList.length > 0;
    });
    setVar("listAutoBuild", JSON.stringify(newAccountList), true);
  };

  window.autoCheckFinishedAccount = function () {
    return;
    if (localStorage.isAutoBuildStart === "true") {
      if (!isProcessing) {
        var min = listAccount.hasMin("time", function (item) {
          return item.isAutoBuildChecked;
        });
        if (formatTimeLengthToStr(min.time - $.now(), 3, " ") === "Finished.") {
          var accountFinished = min.account;
          if (accountFinished === accountName) {
            checkAndProcessAutoBuild(0);
          } else {
            logInfo("Going to account " + accountFinished);
            document
              .querySelector(
                "#summaryAccountTable a[href$='" + accountFinished + "']"
              )
              .click();
          }
        }
      }
    } else {
      clearInterval(timerAutoBuild);
    }
  };

  window.startPauseAutoBuild = function () {
    if (localStorage.isAutoBuildStart === "false") {
      localStorage.isAutoBuildStart = true;
      $("#btnStartAutoBuild").text("Stop Timer");
      timerAutoBuild = setInterval(autoCheckFinishedAccount, 10000);
    } else {
      localStorage.isAutoBuildStart = false;
      clearInterval(timerAutoBuild);
      $("#btnStartAutoBuild").text("Start Timer");
    }
  };

  window.startScanBuilding = function (index) {
    if (index < townList.length && index <= 13) {
      gotoTown(index, function () {
        startScanBuilding(index + 1);
      });
    } else {
      document.querySelector("#js_cityLink > a").click();
    }
  };

  if (localStorage.isAutoBuildStart === "true") {
    timerAutoBuild = setInterval(autoCheckFinishedAccount, 10000);
    setTimeout(function () {
      checkAndProcessAutoBuild(0);
    }, 2000);
  }

  //#endregion Auto Build

  // Select the node that will be observed for mutations
  var targetNode = document.querySelector("#container");

  // Options for the observer (which mutations to observe)
  var config = { childList: true };

  // Callback function to execute when mutations are observed
  var callback = function (mutationsList, observer) {
    for (var mutation of mutationsList) {
      if (
        mutation.previousSibling.id === "barbarianVillage_c" &&
        !$("#barbarianVillage ul.resources .needingShip")[0]
      ) {
        let resourceList = $("#barbarianVillage ul.resources li");
        let totalResource = 0;
        let needingShipNode = document.createElement("li");
        needingShipNode.className += "needingShip";
        for (let i = 1; i < resourceList.length; i++) {
          totalResource += Number(resourceList[i].innerHTML.replace(",", ""));
        }
        let shipNeeded = Math.round(totalResource / 520);
        needingShipNode.innerHTML = shipNeeded + " (" + totalResource + ")";
        $("#barbarianVillage ul.resources")[0].appendChild(needingShipNode);
        return;
      } else if (mutation.previousSibling.id === "barbarianFleet_c") {
        let resourceList = $("#barbarianFleet ul.resources li");
        let totalResource = 0;
        let needingShipNode = document.createElement("li");
        needingShipNode.className += "needingShip";
        for (let i = 1; i < resourceList.length; i++) {
          totalResource += Number(resourceList[i].innerHTML.replace(",", ""));
        }
        needingShipNode.innerHTML = Math.round(totalResource / 520) + 1;
        $("#barbarianFleet ul.resources")[0].appendChild(needingShipNode);
        return;
      }
    }
  };

  // Create an observer instance linked to the callback function
  var observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);

  $("#footer")[0].style.zIndex = "2";
}

$("body").append(
  "<div id='customDiv' style='position:fixed; overflow: hidden; z-index:66; bottom:20px; left:0px; min-height:233px; min-width:250px;'></div>"
);

$("#customDiv").append(
  "<div id='summaryAccount' style='display:none; float:left; height:auto; width:auto; padding-left:10px; border: 1px solid #ffffff; background: #f8e7b3 50% 50% repeat-x; position: fixed; left: 55px'></div>"
);
$("#summaryAccount").append("<div id='summaryAccountList'></div>");
$("#summaryAccount").append(
  "<button class='button' onclick='updateListAccount();'>Update Account</button>"
);
$("#summaryAccount").append(
  "<button class='button' onclick='toggleZoom();'>Toggle Zoom</button>"
);
$("#summaryAccount").append(
  "<button class='button' onclick='clearLog();'>Clear Log</button>"
);

$("#customDiv").append(
  "<div id='userscript' style='float:left; height:auto; width:auto; padding-left:10px; border: 1px solid #ffffff; background: #f8e7b3 50% 50% repeat-x;  position: fixed; top: 45px; left:635px'></div>"
);
$("#userscript").append(
  "<h2 style='font-size:14px;font-weight:bold;display:inline'>Auto Wine: </h2>"
);
$("#userscript").append(
  "<button class='button' id='btnStartScriptAutoWine' onclick='openPopupChooseWineSource();'>Start</button>"
);
$("#userscript").append(
  '<button class="button" onclick="sendResourcesDialogWine();">Setting</button><br/>'
);
$("#userscript").append(
  "<h2 style='font-size:14px;font-weight:bold;'>Send Resources</h2>" +
    "<button class='button' id='btnStartScript' onclick='startPauseProcess();'>Start Timer</button> " +
    "<button class='button' onclick='sendResourcesDialog();'>Setting</button><br/>" +
    "<p id='transporterInfo'>Nothing is tranfering</p>"
);
$("#userscript").append(
  "<h2 style='font-size:14px;font-weight:bold;;display:inline'>Auto Build: </h2>"
);
$("#userscript").append(
  '<button class="button" onclick="createFormAutoBuild();">Setting</button>'
);
$("#userscript").append(
  '<button class="button" onclick="checkAndProcessAutoBuild(0, true);">Start</button><br/>'
);
//$("#userscript").append('<button class="button" onclick="cleanListAutoBuild();">Clean Auto Build</button>');
$("#userscript").append(
  '<button class="button" onclick="startPauseAutoBuild();" id="btnStartAutoBuild">Start Timer</button>'
);
$("#userscript").append(
  '<button class="button" onclick="startScanBuilding(0);" id="btnStartScanBuilding">Scan</button>'
);

$("#customDiv").append(
  "<div id='logger' style='float:left; height:auto; width:auto; padding-left:10px; border: 1px solid #ffffff; background: #f8e7b3 50% 50% repeat-x; margin-top: 150px'></div>"
);
$("#logger").append(
  "<textarea rows='4' cols='80' id='txtLogger' style='font-size:9px; display:none'></textarea>"
);

//$("#summaryAccount").append("<button class='button' onclick='clearListAccount();'>Clear Account</button>");

//$("#divWrapperAuto").append('<button class="button" onclick="showHideAuto();">Show/Hide</button>');
$("#btnStartScript").text(
  resourcesJson.isStart === true ? "Stop Timer" : "Start Timer"
);
$("#btnStartAutoBuild").text(
  localStorage.isAutoBuildStart === "true" ? "Stop Timer" : "Start Timer"
);
var script = document.createElement("script");
script.appendChild(document.createTextNode("(" + main + ")();"));
(document.body || document.head || document.documentElement).appendChild(
  script
);

//#region CSS

var style =
  "<style>#divWrapperAuto button {padding: 5px; margin:0 0 5px 0; height: 24px; font-size: 10px !important} " +
  "#divWrapperAuto p {font-size: 10px} " +
  "#autoWineTable th, #autoWineTable td {padding: 7px;} " +
  "#resourceTable th, #resourceTable td {padding: 7px;} " +
  ".fullTable {width:100%; overflow: hidden; display: block;} " +
  ".tableQueue tbody {max-height: 400px; overflow: auto; display: block;} " +
  "#summaryAccountTable td, #summaryAccountTable th {padding: 1.5px;} " +
  "#summaryAccountTable tr:hover {background-color: white}" +
  "#summaryAccountTable td:hover {color: red; background-color: #f0f0f0}" +
  ".active {font-weight: bold} " +
  ".min {border: 1px solid red} " +
  "#customDiv {display:" +
  (localStorage.isSendResourceHidden === "true" ? "none" : "block") +
  "} " +
  "#empireBoard {display:" +
  (localStorage.isSendResourceHidden === "true" ? "none" : "block") +
  "} " +
  "th {font-weight: bold}" +
  "#tdListBuilding tr, #tdQueue tr {border-bottom: 1px solid black} " +
  "#tdListBuilding tr:last-child, #tdQueue tr:last-child {border: 0} " +
  "#tdListBuilding, .tdQueue {vertical-align: top; padding: 1px 1px 0px 1px; text-align: left} " +
  "#ikaMationTransporterDialog .popupContent, #ikaMationTransporterDialog .popupMessage {width:max-content !important;} " +
  "#autoBuildTable button {float: right;} " +
  "#autoBuildTable span {float: left; width: 100%; border-bottom: 1px dotted gray} " +
  "#autoBuildTable th {padding: 2px} " +
  ".zoom {transform: scale(0.7); bottom: -12px !important; left: -188px !important} " +
  "#autoBuildTable {overflow: auto; max-height: 501px} " +
  ".fixTable {max-height: 500px !important;} " +
  '.needingShip {background: url("cdn/all/both/characters/fleet/40x40/ship_transport_r_40x40.png") no-repeat 0px 0px; background-size: 22px 19px;} ' +
  "#logger textarea:hover {z-index: 99999} ";
//".mainContent {zoom:75%}" +
//"#userscript .button {font-size: 10px !important; padding: 1px 5px; vertical-align: top} ";
style += "</style>";

var styleAutoBuild = `
<style>
/* CSS cho bảng autoBuild (popup xây nhà) */
#ikaMationTransporterDialog #autoBuildTable {overflow: auto; max-height: 501px;}
#ikaMationTransporterDialog #autoBuildTable button {float: right;}
#ikaMationTransporterDialog #autoBuildTable span {float: left; width: 100%; border-bottom: 1px dotted gray;}
#ikaMationTransporterDialog #autoBuildTable th {padding: 2px;}
#ikaMationTransporterDialog #tdListBuilding,
#ikaMationTransporterDialog .tdQueue {vertical-align: top; padding: 1px 1px 0px 1px; text-align: left;}

/* popup width fit to content */
#ikaMationTransporterDialog .popupContent,
#ikaMationTransporterDialog .popupMessage {width: max-content !important;}

/* class gây overflow/vỡ bảng vì cả 2 popup đang có bảng dùng class fullTable/fixTable */
#ikaMationTransporterDialog .fullTable {width: 100%; overflow: hidden; display: block;}
#ikaMationTransporterDialog .fixTable {max-height: 500px !important;}

/* thêm CSS ảnh hưởng cho bảng resource popup mass transporter */
#ikaMationTransporterDialog #resourceTable th,
#ikaMationTransporterDialog #resourceTable td {padding: 7px;}
</style>
`;

var styleExtra = `
<style>
 #divWrapperAuto button {padding: 5px; margin:0 0 5px 0; height: 24px; font-size: 10px !important}
 #divWrapperAuto p {font-size: 10px}
 #autoWineTable th, #autoWineTable td {padding: 7px;}
 #resourceTable th, #resourceTable td {padding: 7px;}
 .tableQueue tbody {max-height: 400px; overflow: auto; display: block;}
 #summaryAccountTable td, #summaryAccountTable th {padding: 1.5px;}
 #summaryAccountTable tr:hover {background-color: white}
 #summaryAccountTable td:hover {color: red; background-color: #f0f0f0}
 .active {font-weight: bold}
 .min {border: 1px solid red}
#customDiv {display:${
  localStorage.isSendResourceHidden === "true" ? "none" : "block"
}}
#empireBoard {display:${
  localStorage.isSendResourceHidden === "true" ? "none" : "block"
}}
 th {font-weight: bold}
 #tdListBuilding tr, #tdQueue tr {border-bottom: 1px solid black}
 #tdListBuilding tr:last-child, #tdQueue tr:last-child {border: 0}
 .zoom {transform: scale(0.7); bottom: -12px !important; left: -188px !important}
 .needingShip {background: url("cdn/all/both/characters/fleet/40x40/ship_transport_r_40x40.png") no-repeat 0px 0px; background-size: 22px 19px;}
 #logger textarea:hover {z-index: 99999}
// .mainContent {zoom:75%}
// #userscript .button {font-size: 10px !important; padding: 1px 5px; vertical-align: top}
</style>
`;
$("head").append(style);

//#endregion CSS