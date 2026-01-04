// ==UserScript==
// @name          hwm_change_fraction
// @namespace     ужеЛежу
// @author        ужеЛежу
// @description   Change fraction/talent/build from any page in one click
// @version       4.0.10
// @encoding      utf-8
// @homepage      https://greasyfork.org/en/scripts/374617-hwm-change-fraction
// @include       https://www.heroeswm.ru/*
// @include       https://www.lordswm.com/*
// @include       http://178.248.235.15/*
// @exclude       /^https{0,1}:\/\/(www\.(heroeswm\.ru|lordswm\.com)|178\.248\.235\.15)\/(login|war|cgame|frames|chat|chatonline|ch_box|chat_line|ticker|chatpost)\.php*/
// @exclude       https://www.heroeswm.ru/radio_files/*
// @exclude       https://www.heroeswm.ru/ticker.html*
// @exclude       https://www.lordswm.com/radio_files/*
// @exclude       https://www.lordswm.com/ticker.html*
// @exclude       http://178.248.235.15/radio_files/*
// @exclude       http://178.248.235.15/ticker.html*
// @exclude       */rightcol.php*
// @exclude       */ch_box.php*
// @exclude       */chat*
// @exclude       */ticker.html*
// @exclude       */frames*
// @exclude       */brd.php*
// @grant         GM_deleteValue
// @grant         GM_getValue
// @grant         GM_listValues
// @grant         GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/374617/hwm_change_fraction.user.js
// @updateURL https://update.greasyfork.org/scripts/374617/hwm_change_fraction.meta.js
// ==/UserScript==

// CheckT:
// исправление @exclude; небольшой рефакторинг; var charArrowDown; проверка наличия SpanFractions
// замена localStorage на GM_getValue/GM_setValue
// previous name: [hwm]_change_fraction

(function(){
  var host = location.host;
  var url_host = location.protocol+'//'+host;

  var gm_prefix = "ctf#";   //префикс всех хранимых данных

  if(isLoggedOff())
    return;

  var currentPlayerId = getPlayerId();

  var loadingGif = " <img width=15 src='https://dcdn2.heroeswm.ru/i/loading.gif'>";
  var crossSpan = "<span style='cursor:pointer;background:#d33;color:white;padding:0 4 2 4;border-radius:3px;box-shadow:2px 2px 3px black;'><b>x</b></span>";
  var stateListOpen = 0;
  var divListFractions = false;
  var divListTalents = false;
  var currentFractionId = 0;
  var meFractionId = 0;

  // vars for change fraction/build
  var classId = 0;
  var talentUrl = false;
  var armyParams = false;
  var artsId = -1;

  var TYPE_FRACTION = 0;
  var TYPE_TALENT = 1;
  var TYPE_BUILD = 2;

  if(convertOptions())
    return;

  var useType = gm_get['useType'];
  if (!useType){
    useType = TYPE_FRACTION;
    gm_set['useType']=TYPE_FRACTION;
  }
  var colorBase = "#FFD871";
  var backgroundBase = "#6B6C6A";
  var buildArmy = -1;
  var buildTalent = -1;
  var buildArts = -1;
  var savedBuildId = -1;

  var fractions = createFractions();
  var mobNames = createMobNames();

  var talents = [];
  var arts = ['<i>Снять всё</i>'];
  var builds = [];

  if(findSpanFractionsPlace()){
    loadTalents();
    initListFractions();
    initListTalents();
  }

  return; // only functions below

  function $(id) {
    return document.getElementById(id);
  }

  function $$(val, begin, end) {
    var id = val.indexOf(begin);
    var temp = val.substr(id + begin.length);
    return temp.substr(0, temp.indexOf(end));
  }

  function xy(obj) {
      var x = 0;
      var y = 0;
      while (obj) {
          x += obj.offsetLeft;
          y += obj.offsetTop;
          obj = obj.offsetParent;
      }
      return {x: x, y: y};
  }

  function createXMLHttpReq(){
    var objXMLHttpReq;

    if (window.XMLHttpRequest){
      objXMLHttpReq = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
      // IE
      objXMLHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
    } else {
      alert('Can\'t create XMLHttpRequest!');
    }
    return objXMLHttpReq;
  }

  function send(method, url, params, afterSend) {
    var xmlHttp = createXMLHttpReq();
    xmlHttp.open(method, url, true);
    if (method == "POST")
      xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttp.overrideMimeType('text/plain; charset=windows-1251');
    xmlHttp.onreadystatechange = function(){afterSend(xmlHttp);};
    xmlHttp.send(params);
  }

  function afterSend(xmlHttp) {
    if (xmlHttp.readyState == 4) {
      if (xmlHttp.status == 200) {
        if (classId > -1) {
          send("POST", url_host + "/castle.php", "classid=" + classId, afterSend);
          classId = -1;
        } else if (talentUrl) {
          send("GET", talentUrl, null, afterSend);
          talentUrl = false;
        } else if (armyParams) {
          send("POST", url_host + "/army_apply.php", armyParams, afterSend);
          armyParams = false;
        } else if (artsId > -1) {
          var artsUri;
          if (artsId == 0)
            artsUri = "all_off=100";
          else
            artsUri = "all_on=" + artsId;
          send("GET", url_host + "/inventory.php?" + artsUri, null, afterSend);
          artsId = -1;
        } else {
          location.href = url_host + "/home.php";
        }
      }
    }
  }

  function editSpan(id) {
      return "<span id=editBuild_" + id + " style='cursor:pointer;border:1px solid #888;border-radius:3px;box-shadow:2px 2px 3px black;padding:0 2 1 2;'><img style='vertical-align:middle;' width=12 src='https://dcdn.heroeswm.ru/i/2repair_ico.gif'></span>";
  }

 function findSpanFractionsPlace() {
    var charArrowDown=String.fromCharCode(9660); //""
    var divs = document.getElementsByTagName("div");
    var m_tr;
    var m_td = false;
    for (var id_div in divs) {
      if (divs[id_div].id == "breadcrumbs" && divs[id_div].innerHTML.indexOf(charArrowDown) > -1) {
        m_tr = divs[id_div].parentNode.parentNode;
        m_td = m_tr.insertCell(-1);
        m_td.innerHTML = " | <span id=spanFractions></span>";
      }
    }

    if (!m_td) {
        var tables = document.getElementsByTagName("table");
        for (var id_table in tables) {
            var table = tables[id_table];
            if (table.innerHTML && table.innerHTML.indexOf('height="6px"') > -1) {
                table.innerHTML = "<tr><td><span id=spanFractions></span></td></tr>";
                break;
            }
        }
    }
    var spanFractions = $('spanFractions');

    if (!spanFractions || spanFractions == null) {
        var centers = document.getElementsByTagName("center");
        for (var id_center in centers) {
            var center = centers[id_center].innerHTML;
            if (center && center.indexOf("center>") == -1 && center.indexOf("<a ") > -1) {
                centers[id_center].innerHTML = center + " | <span id=spanFractions></span>";
                break;
            }
        }
    }

    spanFractions = $('spanFractions');
    if (!spanFractions || spanFractions == null)
      return false;

    spanFractions.innerHTML = "<a class=pi href='castle.php'>Фракции <font style='font-size:8px;'>"+charArrowDown+"</font></a>";
    spanFractions.addEventListener(
        "mouseenter",
        function () {
            if (stateListOpen == 0) {
                divListFractions.style.visibility = "visible";
                stateListOpen = 1;
            }
        }
    );
    spanFractions.addEventListener(
        "mouseleave",
        function () {
            stateListOpen = 2;
            setTimeout(hiddenListFractions, 100);
        }
    );
    return true;
  }

  function initListFractions() {
      divListFractions = document.createElement('div');
      document.body.appendChild(divListFractions);
      divListFractions.style.left = xy(spanFractions).x + "px";
      divListFractions.style.top = (xy(spanFractions).y + spanFractions.parentNode.clientHeight - 1) + "px";
      divListFractions.style.position = "absolute";
      divListFractions.style.background = backgroundBase;
      divListFractions.style.visibility = "hidden";
      divListFractions.style.border = "1px solid #5D413A";
      divListFractions.style.zIndex = 20;

      var innerInfo = "<table>";
      for (var fraction_id in fractions) {
          var fractionId = (fraction_id % 10) * 100 + Math.floor(fraction_id / 10);
  //        alert(fractionId + ":" + currentFractionId);
          var addStyle = fractionId == currentFractionId ? "border:1px dashed #ddd9cd;font-weight:bold" : "";
          innerInfo += "<tr style='color:" + colorBase + ";cursor:pointer'" +
              " id=frac_" + fraction_id + ">" +
              "<td style='background-color:#F5F3EA'><img src='https://dcdn.heroeswm.ru/i/f/r" + fractionId + ".png'></td>" +
              "<td id=td_frac_" + fraction_id + " style='color:" + colorBase + ";" + addStyle + "'>" + fractions[fraction_id] + "</td></tr>";
      }
      // use talents/builds
      innerInfo += "<tr><td colspan=2><table class=wb width=100%>" +
          "<tr><td class=wblight rowspan=3 width=50% align=center>Использовать:</td>" +
          "<td class=" + (useType == 0 ? "wblight" : "wbwhite") + "><input name=radio type=radio id=radio_0 " + (useType == 0 ? "checked=checked" : "") + "><label for=radio_0>Фракции</label></td></tr>" +
          "<tr><td class=" + (useType == 1 ? "wblight" : "wbwhite") + "><input name=radio type=radio id=radio_1 " + (useType == 1 ? "checked=checked" : "") + "><label for=radio_1>Навыки</label></td></tr>" +
          "<tr><td class=" + (useType == 2 ? "wblight" : "wbwhite") + "><input name=radio type=radio id=radio_2 " + (useType == 2 ? "checked=checked" : "") + "><label for=radio_2>Билды</label></td></tr>" +
          "<tr><td class=wbwhite colspan=2 align=center><input id=buildManager type=submit value='Билд-менеджер' " + (useType != 2 ? "disabled" : "") + "></td></tr>" +
          "</table></td></tr>";
      innerInfo += "</table>";
      divListFractions.innerHTML = innerInfo;
      for (var radioId = 0; radioId < 3; radioId++) {
          $('radio_' + radioId).onclick = function () {
              useType = this.id.split('_')[1];
              gm_set('useType', useType);
              $('buildManager').disabled = useType != TYPE_BUILD;
              $('radio_' + useType).parentNode.className = "wblight";
              $('radio_' + (useType+1)%3).parentNode.className = "wbwhite";
              $('radio_' + (useType+2)%3).parentNode.className = "wbwhite";
              loadTalents();
              initListTalents();
          };
      }
      $('buildManager').onclick = function () {
          buildArmy = -1;
          buildTalent = -1;
          buildArts = -1;
          var divPopup = document.createElement('div');
          divPopup.style.width = "100%";
          divPopup.style.minHeight = "100%";
          divPopup.style.position = "fixed";
          divPopup.style.top = "0px";
          divPopup.style.backgroundColor = "rgba(0,0,0,0.5)";
          divPopup.style.zIndex = 22;
          divPopup.addEventListener(
              "mouseup",
              function(e) {
                  var target = e.target || e.srcElement;
                  if (target == divPopup) {
                      document.body.removeChild(divPopup);
                      hiddenListFractions();
                  }
              }
          );
          document.body.appendChild(divPopup);

          var divBuildManager = document.createElement('div');
          divBuildManager.align = "center";
          divBuildManager.style.top = "0px";
          divBuildManager.style.margin = "50px auto 0px auto";
          divBuildManager.style.backgroundColor = backgroundBase;
          divBuildManager.style.width = "620px";
          divBuildManager.style.boxShadow = "10px 10px 10px #000";
          divBuildManager.style.zIndex = 23;
          divPopup.appendChild(divBuildManager);
          if (currentFractionId > 0)
              generateBuildContent(divBuildManager, divPopup, currentFractionId);
          else {
              var alertMessage = 'Невозможно определить текущую фракцию! Попробуйте создать навык, чтобы он отображался в "Быстрых ссылках"';
              var pattern = /\/i\/f\/r(\d+)\.png/;
              if (location.href == url_host + "/home.php") {
                  var match = document.body.innerHTML.match(pattern);
                  if (match) {
                      currentFractionId = match[1];
                      generateBuildContent(divBuildManager, divPopup, currentFractionId);
                  } else
                      alert(alertMessage);
              } else {
                  send("GET", url_host + "/home.php", null,
                      function() {
                          if (xmlHttp.readyState == 4) {
                              if (xmlHttp.status == 200) {
                                  var match = xmlHttp.responseText.match(pattern);
                                  if (match) {
                                      currentFractionId = match[1];
                                      generateBuildContent(divBuildManager, divPopup, currentFractionId);
                                  } else
                                      alert(alertMessage);
                              }
                          }
                      }
                  );
              }
          }

      };

      for (fraction_id in fractions) {
          $('frac_' + fraction_id).onclick = function () {
              var val = this.id.split("_")[1];
              var fraction = Math.floor(val / 10);
              classId = val % 10;
              $('td_frac_' + val).innerHTML += loadingGif;
              send("POST", url_host + "/castle.php", "fract=" + fraction, afterSend);
          };
      }

      divListFractions.addEventListener(
          "mouseenter",
          function () {
              stateListOpen = 1;
          }
      );

      divListFractions.addEventListener(
          "mouseleave",
          function (e) {
              stateListOpen = 2;
              if (!e) e = event;
              var x = e.clientX;
              var y = e.clientY;
              if (x < xy(divListFractions).x ||
                  x >= xy(divListFractions).x + divListFractions.clientWidth ||
                  y < xy(divListFractions).y ||
                  y >= xy(divListFractions).y + divListFractions.clientHeight)
                  setTimeout(hiddenListFractions, 100);
          }
      );
  }

  function initFractionsListeners() {
      for (var fractionId in fractions) {
          $('frac_' + fractionId).addEventListener(
              "mouseenter",
              function () {
                  var val = this.id.split("_")[1];
                  var fractionId = (val % 10) * 100 + Math.floor(val / 10);
                  var t, innerInfo;
                  meFractionId = fractionId;
                  if (useType == TYPE_TALENT) {
                      if (talents[fractionId]) {
                          innerInfo = "<table width=100%>";
                          for (var talentId in talents[fractionId]) {
                              t = talent(fractionId, talentId);
                              if (t != -1) {
                                  innerInfo += "<tr><td style='cursor:pointer;color:" + colorBase + "' " +
                                      "id=talent_" + talentId + " title='" + t[0] + "'>  " + t[1] + "</td></tr>";
                              }
                          }
                          divListTalents.innerHTML = innerInfo + "</table>";
                          divListTalents.style.visibility = "visible";
                          divListTalents.style.top = xy(this).y;
                          divListTalents.style.left = xy(this).x - divListTalents.clientWidth - 1;
                          // listeners
                          for (talentId in talents[fractionId]) {
                              if (!talents[fractionId][talentId])
                                  continue;
                              $('talent_' + talentId).addEventListener(
                                  "mouseenter",
                                  function () {
                                      this.style.background = "#757575";
                                      this.style.color = "white";
                                  }
                              );
                              $('talent_' + talentId).addEventListener(
                                  "mouseleave",
                                  function () {
                                      this.style.background = backgroundBase;
                                      this.style.color = colorBase;
                                  }
                              );
                              $('talent_' + talentId).onclick = function () {
                                  talentUrl = this.title;
                                  var val = this.title.match(/prace=(\d+)&/)[1];
                                  var fraction = val % 100;
                                  classId = Math.floor(val / 100);
                                  this.innerHTML += loadingGif;
                                  send("POST", url_host + "/castle.php", "fract=" + fraction, afterSend);
                              };
                          }
                      } else {
                          divListTalents.style.visibility = "hidden";
                      }
                  } else if (useType == TYPE_BUILD) {
                      val = this.id.split("_")[1];
                      fractionId = (val % 10) * 100 + Math.floor(val / 10);
                      if (builds[fractionId]) {
                          innerInfo = "<table width=100%>";
                          for (var buildId in builds[fractionId]) {
                              var b = builds[fractionId][buildId].split('|');
                              var buildName = b[0];
                              t = talent(fractionId, b[2]);
                              var a = b[3] == -1 ? "<без артов>" : arts[b[3]];
                              t = t == -1 ? "<без навыка>" : t[1];
                              b = b[1] == -1 ? "<без армии>" : b[1];
                              var title = b + " | " + t + " | " + a;
                              innerInfo += "<tr><td style='cursor:pointer;color:" + colorBase + "' " +
                                  "id=talent_" + buildId + " title='" + title + "'> " + buildName + "</td></tr>";
                          }
                          divListTalents.innerHTML = innerInfo + "</table>";
                          divListTalents.style.visibility = "visible";
                          divListTalents.style.top = xy(this).y;
                          divListTalents.style.left = xy(this).x - divListTalents.clientWidth - 1;
                          // listeners
                          for (buildId in builds[fractionId]) {
                              $('talent_' + buildId).addEventListener(
                                  "mouseenter",
                                  function () {
                                      this.style.background = "#757575";
                                      this.style.color = "white";
                                  }
                              );
                              $('talent_' + buildId).addEventListener(
                                  "mouseleave",
                                  function () {
                                      this.style.background = backgroundBase;
                                      this.style.color = colorBase;
                                  }
                              );
                              $('talent_' + buildId).onclick = function () {
                                  var buildId = this.id.split("_")[1];
                                  var b = builds[meFractionId][buildId].split('|');
                                  talentUrl = talent(meFractionId, b[2])[0];
                                  var fraction = meFractionId % 100;
                                  classId = Math.floor(meFractionId / 100);
                                  var a = b[1].split('+');
                                  armyParams = "";
                                  for (var i in a)
                                      armyParams += "&countv" + (i*1 + 1) + "=" + a[i];
                                  armyParams = armyParams.substr(1);
                                  artsId = b[3];
                                  this.innerHTML += loadingGif;
                                  send("POST", url_host + "/castle.php", "fract=" + fraction, afterSend);
                              };
                          }
                      } else {
                          divListTalents.style.visibility = "hidden";
                      }

                  }
                  this.style.background = "#757575";
                  $('td_' + this.id).style.color = "white";
              }
          );
          $('frac_' + fractionId).addEventListener(
              "mouseleave",
              function () {
                  this.style.background = backgroundBase;
                  $('td_' + this.id).style.color = colorBase;
              }
          );
      }
  }

  function initListTalents() {
      if (useType == TYPE_TALENT || useType == TYPE_BUILD) {
          if (!divListTalents) {
              divListTalents = document.createElement('div');
              document.body.appendChild(divListTalents);
              divListTalents.style.position = "absolute";
              divListTalents.style.background = backgroundBase;
              divListTalents.style.zIndex = 21;
              divListTalents.style.border = "1px solid #5D413A";
              divListTalents.style.visibility = "hidden";
              divListTalents.style.width = "150";
              divListTalents.addEventListener(
                  "mouseenter",
                  function () {
                      stateListOpen = 3;
                  }
              );
              divListTalents.addEventListener(
                  "mouseleave",
                  function (e) {
                      stateListOpen = 2;
                      if (!e) e = event;
                      var x = e.clientX;
                      var y = e.clientY;
                      if (x >= xy(divListFractions).x + divListFractions.clientWidth ||
                          y >= xy(divListFractions).y + divListFractions.clientHeight ||
                          x < xy(divListFractions).x)
                          hiddenListFractions();
                  }
              );
          }
          if (!currentPlayerId) {
              divListFractions.style.color = "red";
              divListFractions.style.background = "white";
              divListFractions.innerHTML = "Невозможно определить ID персонажа!<br>Перейдите на другую страницу!";
          } else {
              initFractionsListeners();
          }
      } else {
          talents = [];
          if (divListTalents)
              divListTalents.style.visibility = "hidden";
          initFractionsListeners();
      }
  }

  function loadTalents() {
      var skillwheels = document.getElementsByTagName("a");
      var prace = 0;
      var load = false;
      for (var id_a in skillwheels) {
          var href = skillwheels[id_a].href;
          if (href && href.indexOf("skillwheel.php?setuserperk=") > -1) {
              prace = href.split("prace=")[1];
              prace = prace.substr(0, prace.indexOf('&'));
              var buildid = href.split("buildid=")[1];
              if (!talents[prace]) {
                  talents[prace] = [];
                  load = true;
              }
              if (load)
                  talents[prace][buildid] = href + "|" + skillwheels[id_a].innerHTML;
          }
      }
      currentFractionId = prace;
      if (prace > 0)
          gm_set(currentPlayerId + '#race#' + prace, talents[prace]);
      var keys = GM_listValues();
      for (var localKey in keys) {
          if (localKey.indexOf('cf#' + currentPlayerId + '#race#') == 0)
              talents[localKey.split("#")[3]] = GM_getValue(localKey).split(",");
      }
      loadArts();
      loadBuilds();
  }

  function loadArts() {
    for (var i = 0; i < 11; i++) {
      var art = gm_get(currentPlayerId + '#arts#' + i);
      if (art)
        arts[i] = art;
    }
  }

  function loadBuilds() {
    var keys = GM_listValues();
    for (var localKey in keys) {
        if (localKey.indexOf('cf#' + currentPlayerId + '#build#') == 0)
            builds[localKey.split("#")[3]] = GM_getValue(localKey).split(",");
    }
  }

  function saveBuild() {
      if (!builds[currentFractionId])
          builds[currentFractionId] = [];
      var buildId = savedBuildId > -1 ? savedBuildId : builds[currentFractionId].length;
      savedBuildId = -1;
      builds[currentFractionId][buildId] =
          $('buildName').value + '|' + buildArmy + '|' + buildTalent + '|' + buildArts;
      gm_set(currentPlayerId + '#build#' + currentFractionId, builds[currentFractionId]);
      fillBuilds(currentFractionId);
  }

  function deleteBuild(buildId) {
      builds[currentFractionId].splice(buildId, 1);
      if (builds[currentFractionId].length > 0)
          gm_set(currentPlayerId + '#build#' + currentFractionId, builds[currentFractionId]);
      else
          gm_del(currentPlayerId + '#build#' + currentFractionId);
      fillBuilds(currentFractionId);
  }

  function hiddenListFractions() {
      if (stateListOpen == 2) {
          divListFractions.style.visibility = "hidden";
          if (divListTalents)
              divListTalents.style.visibility = "hidden";
          stateListOpen = 0;
      }
  }

  function generateBuildContent(div, divPopup, fractionId) {
      var contentAll = "<table class=wb width=670 cellpadding=0 cellspacing=0 style='height:100%;background:#FFF'>" +
          "<tr class=wblight><td align=center style='padding:4;' colspan=2>" +
          "<table width=100%><tr align=center>" +
          "<td><b>Текущая фракция:</b> <img width=15 height=15 border=0 align=absmiddle src='https://dcdn.heroeswm.ru/i/r" + fractionId + ".gif'></td>" +
          "<td width=25 id=crossClose>" + crossSpan + "</td>" +
          "</tr></table></td></tr>";

      // all builds
      contentAll += "<tr><td style='padding:4;' rowspan=2 width=250 valign=top>" +
          "<table class=wb style='height:100%' width=100% cellpadding=0 cellspacing=0 id=listBuilds>" +
          "<tr><td class=wblight style='padding:4;height:5;' colspan=4><b>Сохранённые билды:</b></td></tr>" +
          "<tr><td class=wbwhite style='padding:4;' valign=top>" +
          "<span style='color:red'><b>Нет билдов!</b></span>" +
          "</td></tr>" +
          "</table>" +
          "</td>";


      // army
      contentAll += "" +
          "<td style='padding:4;'><table class=wb width=100% cellpadding=0 cellspacing=0>" +
          "<tr><td class=wblight style='padding:4;' colspan=7><b>Наберите армию:</b></td></tr>" +
          "<tr>";
      var contentValues = "<tr align=center>";
      for (var mobId in mobNames[fractionId]) {
          contentAll += "<td class=wblight><img src='https://dcdn2.heroeswm.ru/i/mon_pic_png/2x" + mobNames[fractionId][mobId] + "ani.png' width=60 height=50 border=0></td>";
          contentValues += "<td class=wbwhite style='padding:4;'><input type=text size=1 maxlength=3 style='border:1px solid #777' id=countArmy_" + mobId  + "></td>";
      }
      contentAll += "</tr>" + contentValues + "</tr>";
      contentAll += "</table></td></tr>";

      // talents & inventory
      contentAll += "<tr>" +
          "<td style='padding:4;'><table class=wb width=100% cellpadding=0 cellspacing=0>" +
          "<tr>" +
          "<td class=wblight style='padding:4;'><b>Выберите навык:</b></td>" +
          "<td class=wblight style='padding:4;'><b>Выберите комплект артов:</b></td>" +
          "</tr>" +
          "<tr><td class=wbwhite style='padding:4;'>";
      if (talents[fractionId]) {
          for (var talentId in talents[fractionId]) {
              if (talents[fractionId][talentId]) {
                  var del = talents[fractionId][talentId].indexOf("|");
                  var skillHref = talents[fractionId][talentId].substr(0, del);
                  var skillName = talents[fractionId][talentId].substr(del + 1);
                  contentAll += "<input type=radio name=radioTalent id=radioTalent_" + talentId + " title='" +
                      skillName + "'><label for=radioTalent_" + talentId + ">" + skillName + "</label><br>";
              }
          }
      } else {
          contentAll += "<span><b style='color:red'>Нет навыков!</b></span>";
      }
      contentAll += "</td>" +
          "<td class=wbwhite style='padding:4;'>" +
          "<span id=setArts><b style='color:red'>Нет комплектов!</b></span>" +
          "<br><input type=submit id=updateArts value='Обновить комплекты'>" +
          "</td></tr>";
      contentAll += "</table></td></tr>";

      contentAll +=
          "<tr align=center>" +
          "<td style='padding:4;'>" +
          "<table class=wb style='height:100%' width=100% cellpadding=0 cellspacing=0 style='background:#FFF'>" +
          "<tr><td class=wblight style='padding:4;height:5;' colspan=4><b>Экспорт/импорт билдов:</b></td></tr>" +
          "<tr align=center><td class=wbwhite><input type=submit id=exportBuilds value='Экспорт в гвд-блокнотъ ->'>" +
          "<br><br><input type=submit id=importBuilds value='<- Импорт из гвд-блокнота'></td></tr>" +
          "</table>" +
          "</td>";
      // build
      contentAll +=
          //"<tr align=center>" +
          "<td style='padding:4;' colspan=1><table class=wb width=100% cellpadding=0 cellspacing=0 style='background:#FFF'>" +
          "<tr class=wblight><td style='padding:4;' colspan=2><span id=buildCap style='color:red'><b>Билд:</b></span></td></tr>" +
          "<tr class=wbwhite><td style='padding:4;' colspan=2 align=center><table width=80%>" +
          "<tr><td style='padding:2;' width=25%>Имя:</td><td><input type=text maxlength=32 size=16 style='border:1px solid #777' id=buildName></td></tr>" +
          "<tr><td style='padding:2;'>Армия:</td><td id=buildArmy><i>без армии</i></td></tr>" +
          "<tr><td style='padding:2;'>Навык:</td><td id=buildTalent><i>без навыка</i></td></tr>" +
          "<tr><td style='padding:2;'>Арты:</td><td id=buildArts><i>без артов</i></td></tr>" +
          "</table></td></tr>" +
          "<tr class=wbwhite align=center>" +
          "<td style='padding:4;'width=50%><input type=submit id=saveBuild disabled value='Сохранить билд'></td>" +
          "<td style='padding:4;'width=50%><input type=submit id=cancelBuild value='Очистить форму'></td>" +
          "</table></td></tr>";
      // end
      contentAll += "</table>";
      div.innerHTML = contentAll;
      fillSetArts();
      fillBuilds(fractionId);

      // listeners
      $('crossClose').onclick = function() {
          document.body.removeChild(divPopup);
          hiddenListFractions();
      };
      var radioTalents = document.getElementsByName('radioTalent');
      for (var i in radioTalents) {
          if (radioTalents[i].id) {
              radioTalents[i].onclick = function() {
                  var talentId = this.id.split('_')[1];
                  $('buildTalent').innerHTML = "<b>" + this.title + "</b>";
                  buildTalent = talentId;
                  checkBuild();
              }
          }
      }
      for (var j = 0; j < 7; i++) {
          $('countArmy_' + j).onkeypress = function(e) {
              if (this.value == '0') this.value = '';
              e = e || event;
              if (e.ctrlKey || e.altKey || e.metaKey) return;
              var chr = getChar(e);
              if (chr == null) return;
              if (chr < '0' || chr > '9') {
                  return false;
              }
          }
          $('countArmy_' + i).onkeyup = function(e) {
              generateBuildArmy();
              $('buildArmy').innerHTML = "<b>" + buildArmy + "</b>";
              checkBuild();
          }
      }
      $('updateArts').onclick = function() {
          $('setArts').innerHTML += loadingGif;
          send("GET", url_host + "/inventory.php", null,
              function() {
                  if (xmlHttp.readyState == 4) {
                      if (xmlHttp.status == 200) {
                          var text = xmlHttp.responseText.split("<b>1.</b>");
                          if (text.length > 1) {
                              arts = ["<i>Снять всё</i>"];
                              var s = text[1].split("?all_on=");
                              for (var i = 1; i < s.length; i++) {
                                  var setId = s[i].split("&")[0];
                                  var setName = s[i].match(/>(.*)<\/a>/)[1];
                                  arts[setId] = setName;
                                  gm_set(currentPlayerId + '#arts#' + setId, setName);
                              }
                              fillSetArts();
                          } else {
                              $('setArts').innerHTML = "<b style='color:red'>Недоступна страница<br> инвентаря, попробуйте<br> позже!</b>";
                          }
                      }
                  }
              }
          );
      };
      $('buildName').onkeyup = function() {
          checkBuild();
      };
      $('saveBuild').onclick = function() {
          saveBuild();
      };
      $('cancelBuild').onclick = function() {
          clearForm();
      };
      $('exportBuilds').onclick = function() {
          exportBuilds();
      };
      $('importBuilds').onclick = function() {
          importBuilds();
      };
  }

  function getChar(event) {
      var which = event.which;    // other
      if (which == null) which = event.keyCode;   // IE
      if (which != 0) {
          if (which < 32) return null;
          return String.fromCharCode(which);
      }
      return null;
  }

  function generateBuildArmy() {
      buildArmy = "";
      for (var i = 0; i < 7; i++) {
          var intValue = parseInt($('countArmy_' + i).value);
          if (!intValue) intValue = 0;
          buildArmy += intValue;
          if (i < 6) buildArmy += '+';
      }
  }

  function fillSetArts() {
      var innerText = "";
      if (arts.length == 0) return;
      for (var i in arts) {
          if (i > 0) innerText += "<br>";
          innerText += "<input type=radio name=radioArts id=radioArts_" + i + ">" +
              "<label for=radioArts_" + i + ">" + (i > 0 ? (i + ". ") : "") +
              arts[i] + "</label>";
      }
      $('setArts').innerHTML = innerText;
      // listeners
      var radioArts = document.getElementsByName('radioArts');
      for (var j in radioArts) {
          if (radioArts[j].id) {
              radioArts[j].onclick = function() {
                  var setId = this.id.split('_')[1];
                  $('buildArts').innerHTML = "<b>" + setId + ". " + arts[setId] + "</b>";
                  buildArts = setId;
                  checkBuild();
              }
          }
      }
  }

  function fillBuilds(fractionId) {
      var innerText = "<tr><td class=wblight style='padding:4;height:5;' colspan=4><b>Сохранённые билды:</b></td></tr>";
      //alert(builds[fractionId] + ": " + builds[fractionId].length);
      if (!builds[fractionId] || builds[fractionId].length == 0) {
          innerText += "<tr><td class=wbwhite style='padding:4;' valign=top>" +
              "<span style='color:red'><b>Нет билдов!</b></span>" +
              "</td></tr>";
      } else {
          for (var buildId in builds[fractionId]) {
              var b = builds[fractionId][buildId].split('|');
              var buildName = b[0];
              var t = talent(fractionId, b[2]);
              var a = b[3] == -1 ? "<без артов>" : arts[b[3]];
              t = t == -1 ? "<без навыка>" : t[1];
              b = b[1] == -1 ? "<без армии>" : b[1];
              var title = b + " | " + t + " | " + a;
              innerText += "<tr class=wbwhite>" +
                  "<td width=10  style='padding:4;height:5;'>" + (buildId*1 + 1) + ".</td>" +
                  "<td title='" + title + "'><b>" + buildName + "</b></td>" +
                  "<td align=center width=25 title='Редактировать билд'>" + editSpan(buildId) + "</td>" +
                  "<td align=center width=25 title='Удалить билд' id=deleteBuild_" + buildId + ">" + crossSpan + "</td>" +
                  "</tr>";
          }
          innerText += "<tr class=wblight><td colspan=4>&nbsp;</td></tr>";
      }
      $('listBuilds').innerHTML = innerText;
      // listeners
      for (var i in builds[fractionId]) {
          $('deleteBuild_' + i).onclick = function() {
              var buildId = this.id.split('_')[1];
              if (confirm("Вы действительно хотите удалить этот билд?"))
                  deleteBuild(buildId);
          };
          $('editBuild_' + i).onclick = function() {
              var buildId = this.id.split('_')[1];
              loadBuild(buildId);
          }
      }
  }

  function checkBuild() {
      if ($('buildName').value != "") {
          $('saveBuild').disabled = false;
          $('buildCap').style.color = "green";
      } else {
          $('saveBuild').disabled = true;
          $('buildCap').style.color = "red";
      }
  }

  function talent(fractionId, talentId) {
      var talent = talents[fractionId][talentId];
      if (talent) {
          var i = talent.indexOf("|");
          return [talent.substr(0, i), talent.substr(i + 1)];
      } else {
          return -1;
      }
  }

  function loadBuild(buildId) {
      savedBuildId = buildId;
      var fractionId = currentFractionId;
      fillBuilds(fractionId);
      var b = builds[fractionId][buildId].split('|');
      var buildName = b[0];
      var t = talent(fractionId, b[2]);
      if (t == -1) {
          buildTalent = -1;
          t = "<i>без навыка</i>";
      } else {
          buildTalent = t[0].split("buildid=")[1];
          $('radioTalent_' + buildTalent).checked = true;
          t = "<b>" + t[1] + "</b>";
      }
      var a;
      if (b[3] == -1) {
          buildArts = -1;
          a = "<i>без артов</i>";
      } else {
          buildArts = b[3];
          $('radioArts_' + buildArts).checked = true;
          a = "<b>" + arts[b[3]] + "</b>";
      }
      if (b[1] == -1) {
          buildArmy = -1;
          b = "<i>без армии</i>";
          for (var i = 0; i < 7; i++)
              $('countArmy_' + i).value = "";
      } else {
          buildArmy = b[1];
          var army = b[1].split('+');
          for (var j in army)
              $('countArmy_' + j).value = army[i];
          b = "<b>" + b[1] + "</b>";
      }
      $('editBuild_' + buildId).style.border = "1px solid #F00";
      $('editBuild_' + buildId).style.background = "#FCC";
      $('buildName').value = buildName;
      $('buildArmy').innerHTML = b;
      $('buildTalent').innerHTML = t;
      $('buildArts').innerHTML = a;
      checkBuild();
  }

  function clearForm() {
      fillBuilds(currentFractionId);
      $('radioArts_' + buildArts).checked = false;
      $('radioTalent_' + buildTalent).checked = false;
      savedBuildId = -1;
      buildArmy = -1;
      buildArts = -1;
      buildTalent = -1;
      for (var i = 0; i < 7; i++)
          $('countArmy_' + i).value = "";
      $('buildName').value = "";
      $('buildArmy').innerHTML = "<i>без армии</i>";
      $('buildTalent').innerHTML = "<i>без навыка</i>";
      $('buildArts').innerHTML = "<i>без артов</i>";
      checkBuild();
  }

  function exportBuilds() {
      send("GET", url_host + "/sms.php?notebook=1", null,
          function() {
              if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                  var maxLength = 2990;
                  var html = document.createElement('html');
                  html.innerHTML = xmlHttp.responseText;
                  var noteText = html.getElementsByTagName('textarea')[0].innerHTML;
                  var exportContent = "\n[exb]";
                  for (var fractionId in builds)
                      exportContent += fractionId + ";" + builds[fractionId] + "^";
                  exportContent += "[/exb]";
                  var endNoteText = noteText.split("[/exb]")[1] || "";
                  noteText = noteText.split("\n[exb]")[0] + endNoteText;
                  var dLength = maxLength - noteText.length - exportContent.length;
                  if (dLength < 0) {
                      alert("Ошибка! Не хватает " + -dLength + " символа(ов) для хранения в блокноте! (макс. = " + maxLength + ")");
                  } else {
                      if (confirm("Вы действительно хотите сохранить билды в гвд-блокнот?\n(данные в блокноте могут измениться)")) {
                          var content = urlEncode(noteText + exportContent);
                          send("POST", url_host + "/sms.php", "action=savenotebook&data=" + content,
                              function() {
                                  if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                                      alert("Билды сохранены в блокнот!");
                                  }
                              }
                          );
                      }
                  }
              }
          }
      );
  }

  function importBuilds() {
      if (confirm("Вы действительно хотите импортировать билды?\n(текущие билды могут измениться/удалиться)")) {
          send("GET", url_host + "/sms.php?notebook=1", null,
              function () {
                  if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                      var html = document.createElement('html');
                      html.innerHTML = xmlHttp.responseText;
                      var noteText = html.getElementsByTagName('textarea')[0].innerHTML;
                      var importContent = $$(noteText, "\n[exb]", "[/exb]");
                      var blds = importContent.split("^");
                      var x = "";
                      for (var i = 0; i < blds.length - 1; i++) {
                          var c = blds[i].split(";");
                          builds[c[0]] = c[1].split(",");
                          gm_set(currentPlayerId + '#build#' + c[0], builds[c[0]]);
                      }
                      alert("Билды импортированы!");
                      fillBuilds(currentFractionId);
                  }
              }
          );
      }
  }

  function urlEncode(s) {
      var r = "";
      for (var i = 0; i < s.length; i++) {
          var c = s.charCodeAt(i);
          if (c > 127) {
              if (c > 1024) {
                  if (c == 1025)
                      c = 1016;
                  else if (c == 1105)
                      c = 1032;
                  r += "%" + (c - 848).toString(16);
              }
          } else {
              if (c == 43)
                  r += "%2b";
              else
                  r += s.charAt(i);
          }
      }
      return r;
  }

  function convertOptions(){
    if(!GM_load_bool_from_num( gm_prefix+"converted")){
      var debug='';
      GM_save_num_from_bool( gm_prefix+"converted", true);
      for (var localKey in localStorage) {
        if (localKey.indexOf('cf#') == 0)
          debug += convert_option(localKey);
      }
      document.body.innerHTML = debug;
      return true;
    } else {
      return false;
    }
  }

  function convert_option(key){
    var val = localStorage[key];
    if(val)
      gm_set(key.substring(3), val);
    localStorage[key] = null;
    delete localStorage[key];
    return '['+key+':'+val+'] -> ['+gm_prefix+key.substring(3)+':'+val+']<br/>';
  }

  function isLoggedOff(){
    return location.pathname == '/';
  }

  function getI(xpath,elem){return document.evaluate(xpath,(elem?elem:document),null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);}

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

  function createMobNames(){
    var mobNames = [];
    mobNames[1] = ['conscript','marksman','swordman'/*squire*/,'impergriffin','inquisitor','paladin','archangel'];
    mobNames[101] = ['brute','crossbowman'/*crossman*/,'vindicator','battlegriffon','zealot','champion','seraph2'];
    mobNames[2] = ['sceletonarcher'/*skeletonarcher*/,'plaguezombie','spectre','vampirelord','archlich','wraith','spectraldragon'];
    mobNames[102] = ['sceletonwar','rotzombie','poltergeist','vampireprince','masterlich','banshee','ghostdragon'];
    mobNames[3] = ['mastergremlin','obsgargoly','steelgolem','archmage','djinn_sultan','rakshasa_raja','titan'];
    mobNames[103] = ['saboteurgremlin', 'elgargoly','magneticgolem','battlemage','djinn_vizier','rakshasa_kshatra', 'stormtitan'];
    mobNames[4] = ['sprite', 'bladedancer'/*wardancer*/,'hunterelf'/*masterhunter*/,'ddeld'/*druideld*/,'silverunicorn','ancienent','emeralddragon'];
    mobNames[104] = ['dryad_'/*dryad*/,'winddancer'/*wdancer*/,'arcaneelf','ddhigh','pristineunicorn','savageent','crystaldragon'];
    mobNames[5] = ['hobgoblin','hobwolfrider'/*wolfraider*/,'orcchief','ogremagi','thunderbird','cyclopking','abehemoth'/*ancientbehemoth*/];
    mobNames[105] = ['goblinarcher','boarrider','orcrubak','ogrebrutal','firebird_'/*firebird*/,'cyclopod_'/*cyclopod*/,'dbehemoth'];
    mobNames[205] = ['goblinmag','boarrider','orcshaman','ogremagi','darkbird','cyclopod_'/*cyclopod*/,'dbehemoth'];
    mobNames[6] = ['assasin'/*assassin*/,'fury','minotaurguard_'/*minotaurguard*/,'grimrider','deephydra','matriarch','blackdragon'];
    mobNames[106] = ['stalker','bloodsister','taskmaster','briskrider','foulhydra','mistress','reddragon'];
    mobNames[7] = ['familiar','fdemon'/*hornedoverseer*/,'cerberus','succubusm'/*succubusmis*/,'stallion','pitlord_'/*pitlord*/,'archdevil'];
    mobNames[107] = ['vermin','jdemon','firehound'/*hotdog*/,'seducer','hellstallion'/*hellkon*/,'pitspawn'/*pity*/,'archdemon'];
    mobNames[8] = ['shieldguard','skirmesher','blackbearrider','berserker','runepatriarch','thunderlord','magmadragon'];
    mobNames[9] = ['trapper','ncentaur','mauler','sdaughter','executioner','foulwyvern','untamedcyc'];
    return mobNames;
  }

  function createFractions(){
    var fractions = [];
    fractions[10] = "Рыцарь";
    fractions[11] = "Рыцарь света";
    fractions[20] = "Некромант";
    fractions[21] = "Некромант - повелитель смерти";
    fractions[30] = "Маг";
    fractions[31] = "Маг-разрушитель";
    fractions[40] = "Эльф";
    fractions[41] = "Эльф-заклинатель";
    fractions[50] = "Варвар";
    fractions[51] = "Варвар крови";
    fractions[52] = "Варвар-шаман";
    fractions[60] = "Темный эльф";
    fractions[61] = "Темный эльф-укротитель";
    fractions[70] = "Демон";
    fractions[71] = "Демон тьмы";
    fractions[80] = "Гном";
    fractions[90] = "Степной варвар";
    return fractions;
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
      }
    }
  }

  // 1 -> true; otherwise false
  function GM_load_bool_from_num(key){
    var val = Number(GM_getValue(key, 0));
    return isNaN(val) ? false : val==1;
  }

  // true -> 1; otherwise 0
  function GM_save_num_from_bool(key, val){
    GM_setValue(key, val ? 1 : 0);
  }

  function gm_get(key){
    return GM_getValue(gm_prefix+key);
  }

  function gm_set(key, val){
    return GM_setValue(gm_prefix+key, val);
  }

  function gm_del(key){
    return GM_deleteValue(gm_prefix+key);
  }

  function gm_list(){
    var keys = GM_listValues();
    var filtered = [];
    for ( var i = 0, len = keys.length; i < len; i++ ) {
      var key = keys[i];
      if(key.indexOf(gm_prefix) == 0)
        filtered.push(key);
    }
    return filtered;
  }

})();
