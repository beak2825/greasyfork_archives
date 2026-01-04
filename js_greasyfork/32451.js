// ==UserScript==
// @name NewScriptC
// @grant none
// @description Sangu add-on. Made for W51 Humble
// @include https://*.tribalwars.nl/game.php?*screen=overview*
// @version 2.0.1
// @namespace https://greasyfork.org/users/12704
// @downloadURL https://update.greasyfork.org/scripts/32451/NewScriptC.user.js
// @updateURL https://update.greasyfork.org/scripts/32451/NewScriptC.meta.js
// ==/UserScript==
// 

// Tagging made easy
// 
// Nogmaals moet hier opgemerkt worden dat SANGU een groot deel van deze functionaliteit levert. Veel functies worden geleverd door Sangu die mijn leven ontzettend veel makkelijker hebben gemaakt. Functies zoals ajax, die een request op een hele nette manier afhandeld, zonder dat je dat zelf uitgebreid hoeft te doen, om maar 1 voorbeeld te geven. Een ander groot deel wat ik jat is het onderdeel wat op het dorpsoverzicht de tags afhandeld. Ik lever enkel de tags aan, maar hoe ze erin gezet worden wordt gewoon door Sangu gedaan. Niet helemaal waar, want mijn tags zijn in de toekomst index-afhankelijk en worden als zodanig opgebouwd. Het orginele Sangu script is te downloaden via de Chrome Store of op Sangu.be. 
// 
function SanguC_ready(spele) {
  var rename = "";
  var tijdInMinuten = -1;
  var user_data ={
      "proStyle": true,
      "displayDays": false,
      "walkingTimeDisplay": "{duration} || {arrival}",
      "colors": {
          "error": "#FF6347",
          "good": "#32CD32",
          "special": "#00FFFF",
          "neutral": "#DED3B9"
      },
      "global": {
          "resources": {
              "active": true,
              "backgroundColors": [
                  "#ADFF2F",
                  "#7FFF00",
                  "#32CD32",
                  "#3CB371",
                  "#228B22",
                  "#FFA500",
                  "#FF7F50",
                  "#FF6347",
                  "#FF4500",
                  "#FF0000"
              ],
              "blinkWhenStorageFull": true
          },
          "incomings": {
              "editLinks": true,
              "track": true,
              "indicator": "({current} <small>{difference}</small>)",
              "indicatorTooltip": "Laatste tijdcheck: {elapsed} geleden",
              "lastTimeCheckWarning": "Aanvallen: {difference}. Laatste tijdcheck: {elapsed} geleden"
          },
          "visualizeFriends": true,
          "duplicateLogoffLink": false
      },
      "scriptbar": {
          "editBoxCols": 700,
          "editBoxRows": 12
      },
      "main": {
          "villageNames": [],
          "villageNameClick": true,
          "ajaxLoyalty": true
      },
      "other": {
          "calculateSnob": true,
          "reportPublish": [
              "own_units",
              "own_losses",
              "opp_units",
              "opp_losses",
              "carry",
              "buildings",
              "own_coords",
              "opp_coords",
              "belief"
          ]
      },
      "market": {
          "resizeImage": true,
          "autoFocus": true
      },
      "farmLimit": {
          "stackColors": [
              "#DED3B9",
              "#3CB371",
              "#FF6347"
          ],
          "acceptableOverstack": [
              0.5,
              1.2,
              1.35
          ],
          "unlimitedStack": [
              24000,
              60000,
              100000
          ]
      },
      "command": {
          "changeTroopsOverviewLink": true,
          "middleMouseClickDeletesRow2": false,
          "filterMinPopulation": "21000",
          "filterMinDefaultType": "axe",
          "filterMinDefault": 5000,
          "filterMin": {
              "axe": 7000,
              "spear": 3000,
              "archer": 3000,
              "heavy": 500,
              "catapult": 50,
              "spy": 50,
              "light": 2000,
              "marcher": 2000,
              "ram": 1,
              "snob": 2
          },
          "filterMinOther": 5000,
          "filterAutoSort": true,
          "sumRow": true,
          "filterFakeMaxPop": 300,
          "bbCodeExport": {
              "requiredTroopAmount": 100
          }
      },
      "incomings": {
          "attackIdDescriptions": [
              {
                  "minValue": 10,
                  "text": " "
              },
              {
                  "minValue": 50,
                  "text": "10-50"
              },
              {
                  "minValue": 100,
                  "text": "50-100"
              },
              {
                  "minValue": 200,
                  "text": "100-200"
              },
              {
                  "minValue": 500,
                  "text": "200-500"
              },
              {
                  "minValue": 1000,
                  "text": "500-1000"
              },
              {
                  "minValue": 5000,
                  "text": "1000-5000"
              }
          ],
          "attackIdHigherDescription": "5000+"
      },
      "overviews": {
          "addFancyImagesToOverviewLinks": true
      },
      "incoming": {
          "autoOpenTagger": true,
          "forceOpenTagger": true,
          "renameInputTexbox": "{unit} ({xy}) {player} F{fields}{night}",
          "villageBoxSize": 600,
          "invertSort": true
      },
      "overview": {
          "ajaxSeperateSupport": true,
          "ajaxSeperateSupportStacks": true,
          "canHideDiv": true
      },
      "mainTagger2": {
          "active": true,
          "autoOpen": true,
          "inputBoxWidth": 300,
          "defaultDescription": "{xy} OK",
          "otherDescs": [
              {
                  "active": true,
                  "name": "DODGE",
                  "hitKey": "D",
                  "renameTo": "___________________DODGE_THIS"
              },
              {
                  "active": true,
                  "name": "DODGE OK",
                  "hitKey": "N",
                  "renameTo": "_________DODGE_OK"
              },
              {
                  "active": true,
                  "name": "CHECK STACK",
                  "hitKey": "P",
                  "renameTo": "___________________CHECK_STACK"
              },
              {
                  "active": true,
                  "name": "BLOCK OK",
                  "hitKey": "T",
                  "renameTo": "_________BLOCK_OK"
              },
              {
                  "active": true,
                  "name": "SNIPE IT",
                  "hitKey": "E",
                  "renameTo": "___________________SNIPE_IT"
              },
              {
                  "active": true,
                  "name": "SNIPE OK",
                  "hitKey": "L",
                  "renameTo": "_________SNIPE_OK"
              },
              {
                  "active": true,
                  "name": "GET BACK",
                  "hitKey": "U",
                  "renameTo": "___________________GET_BACK"
              },
              {
                  "active": true,
                  "name": "SEND SMALL TROOPS",
                  "hitKey": "Y",
                  "renameTo": "___________________SEND_SMALL_TROOPS"
              },
              {
                  "active": true,
                  "name": "BLOCK OK_DODGE_OFF",
                  "hitKey": "O",
                  "renameTo": "___________________BLOCK_OK_DODGE_OFF"
              }
          ],
          "keepReservedWords": true,
          "reservedWords": [
              "Edel.",
              "Edelman",
              "Ram",
              "Kata.",
              "Katapult",
              "Zcav.",
              "Zware cavalerie",
              "Lcav.",
              "Lichte Cavalerie",
              "Bereden boog",
              "Bboog.",
              "Verk.",
              "Verkenner",
              "Bijl",
              "Zwaard",
              "Speer",
              "Boog",
              "Ridder"
          ],
          "autoOpenCommands": false,
          "minutesDisplayDodgeTimeOnMap": 3,
          "minutesWithoutAttacksDottedLine": 180,
          "colorSupport": "#FFF5DA"
      },
      "villageInfo4": [
          {
              "active": true,
              "off_link": {
                  "name": "Aanvalleuh!",
                  "group": 0,
                  "filter": {
                      "active": true,
                      "unit": "axe",
                      "amount": 5000
                  },
                  "sort": true,
                  "changeSpeed": "ram",
                  "icon": "graphic/unit/unit_knight.png"
              },
              "def_link": {
                  "name": "Verdedigen!",
                  "group": 0,
                  "filter": {
                      "active": true,
                      "unit": "sword",
                      "amount": "500"
                  },
                  "sort": true,
                  "changeSpeed": "sword",
                  "icon": "graphic/command/support.png"
              }
          },
          {
              "active": false,
              "off_link": {
                  "name": "» off2",
                  "group": 0,
                  "filter": {
                      "active": false,
                      "unit": "axe",
                      "amount": 4000
                  },
                  "sort": true,
                  "changeSpeed": "ram"
              },
              "def_link": {
                  "name": "» Snelle Os!",
                  "group": 0,
                  "filter": {
                      "active": true,
                      "unit": "spear",
                      "amount": 1000
                  },
                  "sort": true,
                  "changeSpeed": "spear"
              }
          }
      ],
      "resources": {
          "requiredResDefault": 250000,
          "requiredMerchants": 50,
          "filterMerchants": true,
          "filterRows": false,
          "bbcodeMinimumDiff": 50000,
          "highlightColor": "#FF7F27"
      },
      "jumper": {
          "enabled": true,
          "autoShowInputbox": false
      },
      "attackAutoRename": {
          "active": true,
          "addHaul": false
      },
      "confirm": {
          "addExtraOkButton": false,
          "replaceNightBonus": true,
          "replaceTribeClaim": true,
          "addCatapultImages": true
      },
      "place": {
          "attackLinks": {
              "scoutVillage": 100,
              "scoutPlaceLinks": [
                  5,
                  100,
                  500
              ],
              "scoutPlaceLinksName": "Scout{amount}",
              "fakePlaceLink": true,
              "fakePlaceExcludeTroops": [],
              "fakePlaceLinkName": "Fake",
              "noblePlaceLink": true,
              "noblePlaceLinkFirstName": "NobleFirst",
              "noblePlaceLinkSupportName": "NobleMin",
              "noblePlaceLinksForceShow": true,
              "nobleSupport": [
                  {
                      "amount": 50,
                      "unit": "light",
                      "villageType": "off"
                  },
                  {
                      "amount": 50,
                      "unit": "heavy",
                      "villageType": "def"
                  }
              ],
              "noblePlaceLinkDivideName": "NobleDivide",
              "noblePlaceLinkDivideAddRam": false
          },
          "customPlaceLinks": [
              {
                  "active": true,
                  "type": "def",
                  "name": "AllDef",
                  "spear": 25000,
                  "heavy": 5000,
                  "archer": 25000,
                  "sword": 25000,
                  "sendAlong": 0
              },
              {
                  "active": true,
                  "type": "def",
                  "name": "1/2-Zc",
                  "spear": 4000,
                  "heavy": 1000,
                  "sendAlong": 500
              },
              {
                  "active": true,
                  "type": "off",
                  "name": "Smart",
                  "sword": -10,
                  "axe": 25000,
                  "spy": 1,
                  "light": 5000,
                  "marcher": 5000,
                  "ram": 5000,
                  "catapult": 5000,
                  "sendAlong": 0
              },
              {
                  "active": true,
                  "type": "off",
                  "name": "Bijl",
                  "spear": 25000,
                  "axe": 25000,
                  "spy": 1,
                  "light": 5000,
                  "heavy": 5000,
                  "marcher": 5000,
                  "sendAlong": 0
              },
              {
                  "active": true,
                  "type": "off",
                  "name": "Zwaard",
                  "spear": 25000,
                  "sword": -10,
                  "axe": 25000,
                  "spy": 1,
                  "light": 5000,
                  "heavy": 5000,
                  "marcher": 5000,
                  "sendAlong": 0,
                  "required": [
                      "sword",
                      1
                  ]
              },
              {
                  "active": false,
                  "type": "def",
                  "name": "AlleDef",
                  "spear": 25000,
                  "sword": 25000,
                  "heavy": 5000,
                  "archer": 25000,
                  "sendAlong": 0
              },
              {
                  "active": false,
                  "type": "def",
                  "name": "3deZc",
                  "spear": 2500,
                  "heavy": 650,
                  "sendAlong": 0
              },
              {
                  "active": false,
                  "type": "def",
                  "name": "4deZc",
                  "spear": 2000,
                  "heavy": 500,
                  "sendAlong": 0
              },
              {
                  "active": false,
                  "type": "def",
                  "name": "HelftZw",
                  "spear": 5000,
                  "sword": 5000,
                  "sendAlong": 500
              },
              {
                  "active": false,
                  "type": "def",
                  "name": "3deZw",
                  "spear": 3300,
                  "sword": 3300,
                  "sendAlong": 0
              },
              {
                  "active": false,
                  "type": "def",
                  "name": "4deZw",
                  "spear": 2500,
                  "sword": 2500,
                  "sendAlong": 0
              }
          ]
      },
      "restack": {
          "to": "80000",
          "requiredDifference": 1000,
          "fieldsDistanceFilterDefault": 30,
          "filterReverse": true,
          "autohideWithoutSupportAfterFilter": true,
          "calculateDefTotalsAfterFilter": true,
          "defaultPopulationFilterAmount": 80000,
          "removeRowsWithoutSupport": false
      },
      "showPlayerProfileOnVillage": false,
      "profile": {
          "show": true,
          "moveClaim": true,
          "mapLink": {
              "show": true,
              "fill": "#000000",
              "zoom": "200",
              "grid": true,
              "playerColor": "#ffff00",
              "tribeColor": "#0000FF",
              "centreX": 500,
              "centreY": 500,
              "ownColor": "#FFFFFF",
              "markedOnly": true,
              "yourTribeColor": "#FF0000"
          },
          "playerGraph": [
              [
                  "points",
                  false
              ],
              [
                  "villages",
                  false
              ],
              [
                  "od",
                  false
              ],
              [
                  "oda",
                  false
              ],
              [
                  "odd",
                  false
              ],
              [
                  "rank",
                  false
              ]
          ],
          "tribeGraph": [
              [
                  "points",
                  false
              ],
              [
                  "villages",
                  false
              ],
              [
                  "od",
                  false
              ],
              [
                  "oda",
                  false
              ],
              [
                  "odd",
                  false
              ],
              [
                  "rank",
                  false
              ],
              [
                  "members",
                  "big",
                  true
              ]
          ],
          "twMapPlayerGraph": {
              "player": [
                  true,
                  true
              ],
              "p_player": [
                  false,
                  false
              ],
              "oda_player": [
                  true,
                  false
              ],
              "odd_player": [
                  true,
                  false
              ]
          },
          "twMapTribeGraph": {
              "tribe": [
                  true,
                  true
              ],
              "p_tribe": [
                  false,
                  false
              ],
              "oda_tribe": [
                  true,
                  false
              ],
              "odd_tribe": [
                  true,
                  false
              ]
          },
          "popup": {
              "show": true,
              "width": 900,
              "height": 865,
              "left": 50,
              "top": 50
          }
      },
      "smithy": [
          [
              "offense",
              {
                  "spear": [
                      3,
                      3
                  ],
                  "sword": [
                      1,
                      1
                  ],
                  "axe": [
                      3,
                      3
                  ],
                  "spy": [
                      0,
                      0
                  ],
                  "light": [
                      3,
                      3
                  ],
                  "heavy": [
                      3,
                      3
                  ],
                  "ram": [
                      2,
                      2
                  ],
                  "catapult": [
                      0,
                      0
                  ]
              }
          ],
          [
              "defense",
              {
                  "spear": [
                      3,
                      3
                  ],
                  "sword": [
                      1,
                      1
                  ],
                  "axe": [
                      0,
                      3
                  ],
                  "spy": [
                      0,
                      3
                  ],
                  "light": [
                      0,
                      3
                  ],
                  "heavy": [
                      3,
                      3
                  ],
                  "ram": [
                      0,
                      1
                  ],
                  "catapult": [
                      1,
                      3
                  ]
              }
          ],
          [
              "catapult",
              {
                  "spear": [
                      2,
                      3
                  ],
                  "sword": [
                      1,
                      1
                  ],
                  "axe": [
                      3,
                      3
                  ],
                  "spy": [
                      0,
                      3
                  ],
                  "light": [
                      2,
                      3
                  ],
                  "heavy": [
                      3,
                      3
                  ],
                  "ram": [
                      0,
                      0
                  ],
                  "catapult": [
                      2,
                      3
                  ]
              }
          ]
      ],
      "buildings": {
          "main": [
              20,
              20
          ],
          "barracks": [
              25,
              25
          ],
          "stable": [
              20,
              20
          ],
          "garage": [
              1,
              5
          ],
          "church": [
              0,
              1
          ],
          "church_f": [
              0,
              1
          ],
          "snob": [
              1,
              3
          ],
          "smith": [
              20,
              20
          ],
          "place": [
              1,
              1
          ],
          "statue": [
              0,
              1
          ],
          "market": [
              10,
              20
          ],
          "wood": [
              30,
              30
          ],
          "stone": [
              30,
              30
          ],
          "iron": [
              30,
              30
          ],
          "farm": [
              30,
              30
          ],
          "storage": [
              30,
              30
          ],
          "hide": [
              0,
              10
          ],
          "wall": [
              20,
              20
          ]
      }
  }
  var stackLijst = [0,0,1,2,4,6,8,10,12,14,17,20,23,25];
  var teBlockenClears = 0;
  var command3name = "";
  var MaxAfstand = 7;
  var pers;
    (function (pers) {
        function getKey(key) {
            return 'sangu_' + key;
        }

      function getWorldKey(key) {
        return 'sangu_' + game_data.world + '_' + key;
      }

      function getCookie(key) {
        key = getWorldKey(key);
        return (function() {
          var x, cooks, cookie;
          if (document.cookie.match(/;/)) {
            cooks = document.cookie.split("; ");
            for (x = 0; x < cooks.length; x++) {
              cookie = cooks[x];
              if (cookie.match(key + "=")) {
                return cookie.replace(key + "=", "");
              }
            }
          } else {
            if (document.cookie.match(key + "=")) {
              return document.cookie.replace(key + "=", "");
            }
          }

          return '';
        })();
      }

      function getGlobal(key) {
            key = getKey(key);
        if (modernizr.localstorage) {
          var value = localStorage[key];
          return typeof value === 'undefined' ? '' : value;
        } else {
          return getCookie(key);
        }
      }

      function getSession(key) {
        key = getWorldKey(key);
        if (modernizr.localstorage) {
          var value = sessionStorage[key];
          return typeof value === 'undefined' ? '' : value;
        } else {
          return getCookie(key);
        }
      }

      function get(key) {
        return getGlobal(key);
      }

      function setCookie(key, value, expireMinutes) {
        key = getWorldKey(key);
        (function() {
          var date_obj = new Date(),
            time = date_obj.getTime();
          if (typeof expireMinutes === 'undefined') {
            time += 60 * 1000 * 24 * 356;
          } else {
            time += expireMinutes * 1000 * 60;
          }
          date_obj.setTime(time);

          document.cookie = key + "=" + value + ";expires=" + date_obj.toGMTString() + ";";
        })();
      }

      function setGlobal(key, value) {
            key = getKey(key);
        if (modernizr.localstorage) {
          localStorage[key] = value;
        } else {
          setCookie(key, value);
        }
      }

      function setSession(key, value) {
        key = getWorldKey(key);
        if (modernizr.localstorage) {
          sessionStorage[key] = value;
        } else {
          setCookie(key, value);
        }
      }

        function set(key, value) {
            setGlobal(key, value);
        }

      function removeSessionItem(key) {
            key = getKey(key);
        if (modernizr.localstorage) {
          sessionStorage.removeItem(key);
        }
        // fuck cookies
      }

        function clear() {
            if (modernizr.localstorage) {
                sessionStorage.clear();
                localStorage.clear();
            }
        }

      pers.removeSessionItem = removeSessionItem;
      pers.getWorldKey = getWorldKey;
        pers.getKey = getKey;
      pers.set = set;
      pers.setCookie = setCookie;
      pers.setGlobal = setGlobal;
      pers.setSession = setSession;
      pers.get = get;
      pers.getCookie = getCookie;
      pers.getGlobal = getGlobal;
      pers.getSession = getSession;
        pers.clear = clear;
    })(pers || (pers = {}));

	function ajax(screen, strategy, opts) {


      opts = $.extend({}, { villageId: false, contentValue: true, async: false }, opts);

      $.ajax({
        url: getUrlString(screen, opts.villageId),
        async: false,
        success: function(text) {
          text = opts.contentValue ? $("#content_value", text) : text;
          strategy(text);
        }
      });
    }
    function getVillageFromCoords(str, looseMatch) {
      // if str is "villageName (X|Y) C54" then the villageName could be something like "456-321"
      // the regex then thinks that the villageName are the coords
      // looseMatch
      var targetMatch = looseMatch != undefined ? str.match(/(\d+)\D(\d+)/g) : str.match(/(\d+)\|(\d+)/g);
      if (targetMatch != null && targetMatch.length > 0) {
        var coordMatch = targetMatch[targetMatch.length - 1].match(/(\d+)\D(\d+)/);
        var village = { "isValid": true, "coord": coordMatch[1] + '|' + coordMatch[2], "x": coordMatch[1], "y": coordMatch[2] };

        village.validName = function () { return this.x + '_' + this.y; };
        village.continent = function () { return this.y.substr(0, 1) + this.x.substr(0, 1); };

        return village;
      }
      return { "isValid": false };
    }
    function getQueryStringParam(name, url) {
      name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
      var regexS = "[\\?&]" + name + "=([^&#]*)";
      var regex = new RegExp(regexS);
      if( url == undefined && name == "village" ) {
        return game_data.village.id;
      } else {
        var results = regex.exec(url == undefined ? window.location.href : url);
        if (results == null) {
          return "";
        } else {
          return results[1];
        }
      }
    }
    function getUrlString(url, villageId) {
      if (url.indexOf("?") == -1) {
        var link = location.href.substr(0, location.href.indexOf("?"));
        link += "?village=" + (villageId ? villageId : getQueryStringParam("village"));
        var isSit = getQueryStringParam("t");
        if (isSit) {
          link += "&t=" + isSit;
        }

        if (url.indexOf("=") == -1) {
          return link + "&screen=" + url;
        } else {
          return link + "&" + url;
        }
      } else {
        return url;
      }
    }
  //Datetime
  function getDateFromTodayTomorrowTW(str) {
    var currentT = new Date();
    var dateParts = [];
    var parts = $.trim(str).split(" ");
    if (str.indexOf('morgen') != -1) {
      // morgen om 06:35:29 uur
      dateParts[0] = currentT.getDate() + 1;
      dateParts[1] = currentT.getMonth();
    } else if (str.indexOf("vandaag") != -1) {
      // vandaag om 02:41:40 uur
      dateParts[0] = currentT.getDate();
      dateParts[1] = currentT.getMonth();
    } else {
      // op 19.05. om 11:31:51 uur
      dateParts = parts[1].split(".");
      dateParts[1] = parseInt(dateParts[1], 10) - 1;
    }

    // last part is "hour" but there is a script from lekensteyn that
    // corrects the projected arrival time each second
    // the script has not been updated to add the word "hour" after the time.
    var timeParts = parts[parts.length - 2].split(":");
    if (timeParts.length === 1) {
      timeParts = parts[parts.length - 1].split(":");
    }
    
    var seconds = timeParts[2];
    var millis = 0;
    if (seconds.length > 2) {
      var temp = seconds.split(".");
      seconds = temp[0];
      millis = temp[1];
    }
    
    return new Date(new Date().getFullYear(), dateParts[1], dateParts[0], timeParts[0], timeParts[1], seconds, millis);
  }
  function getDateFromTW(str, isTimeOnly) {
        //13.02.11 17:51:31
        var timeParts, seconds;
        
        if (isTimeOnly) {
          timeParts = str.split(":");
          seconds = timeParts[2];
          var val = new Date();
          val.setHours(timeParts[0]);
          val.setMinutes(timeParts[1]);
          if (seconds.length > 2) {
            var temp = seconds.split(".");
            val.setSeconds(temp[0]);
            val.setMilliseconds(temp[1]);
          } else {
            val.setSeconds(seconds);
          }
          return val;
        } else {
          var parts = str.split(" ");
          var dateParts = parts[0].split(".");
          timeParts = parts[1].split(":");
          seconds = timeParts[2];
          var millis = 0;
          if (seconds.length > 2) {
            var temp = seconds.split(".");
            seconds = temp[0];
            millis = temp[1];
          } if (dateParts[2].length == 2) {
            dateParts[2] = (new Date().getFullYear() + '').substr(0, 2) + dateParts[2];
          }

          return new Date(dateParts[2], (dateParts[1] - 1), dateParts[0], timeParts[0], timeParts[1], seconds, millis);
        }
      }
  //RENAME COMMAND
  		function renameCommand(commandName, indexvoor, indexna,incomingstabel, Edelcheck) {
			var dodgeCell; // capture last cell for dodgeCell coloring


			function getCommandIdFromDodgeCell(dodgeCell) {

				return $(dodgeCell).find("span").first().attr("data-id");
			}
			function getVillageCoordsFromCommandId(commandId, callback) {
				if (server_settings.ajaxAllowed) {
				if (commandIdToCoordCache[commandId]) {
				callback(commandIdToCoordCache[commandId]);

				} else {
				ajax('screen=info_command&type=other&id='+commandId, function (overview) {
				var originVillageLink = $(".village_anchor:first", overview).find("a[href]"),
				originVillageDesc = originVillageLink.html(),
				originVillage = getVillageFromCoords(originVillageDesc);

				commandIdToCoordCache[commandId] = originVillage.coord;

				callback(originVillage.coord);
				});
				}
				}
				callback('');
			}

			function executeRename(dodgeCell, commandName) {

				function keepTwIcon(dodgeCell, commandName) {
					var oldName = $(".quickedit-label", dodgeCell).text().toUpperCase(),
					newName = commandName,
					i,
					unitName;
                                        if (oldName.indexOf("FAKE") !== -1) { newName = newName + "__FAKE??"; } 

					for (i = 0; i < user_data.mainTagger2.reservedWords.length; i++) {
						unitName = user_data.mainTagger2.reservedWords[i];
						if (oldName.indexOf(unitName.toUpperCase()) !== -1) {
							newName = unitName + ' ' + newName;
							return newName; // Only one icon possible
						}
					}
					return newName;
				}

				var button = dodgeCell.find("input[type='button']"),
				newName =  user_data.mainTagger2.keepReservedWords ? keepTwIcon(dodgeCell, commandName) : commandName;  

				button.prev().val(newName);
				button.click();
			}


			$("a.rename-icon", incomingstabel).each(function (index,knop) {

				if (index < indexvoor || index > indexna){
					return true;
				}
        
				var openRenameButton;
				dodgeCell = $(knop).parent().parent().parent();//.next();
				openRenameButton = $(knop);

				if (openRenameButton.is(":visible")) {
					openRenameButton.click();
				}
        if ((dodgeCell.text().indexOf("Edel") > -1 && Edelcheck != true)||dodgeCell.text().indexOf(".,.")>-1) return true;
        var reCommandName;

				if (commandName.indexOf("{fields}") !== -1) { 
					var id = getCommandIdFromDodgeCell(dodgeCell);
					ajax('screen=info_command&type=other&id='+getCommandIdFromDodgeCell(dodgeCell), function (overview) {
						var originVillageLink = $(".village_anchor:first", overview).find("a[href]"),
						originVillageDesc = originVillageLink.html(),
						originVillage = getVillageFromCoords(originVillageDesc);
						//commandIdToCoordCache[commandId] = originVillage.coord;
						var Doeldorp=$("#menu_row2_village").next().text().split(")");
						Doeldorp[0] = Doeldorp[0].replace("(","");
						var coordsdoel = Doeldorp[0].split("|");
						var Distance=Math.round(Math.sqrt(Math.pow(originVillage.x - coordsdoel[0], 2) + Math.pow(originVillage.y - coordsdoel[1], 2)));
						reCommandName = commandName.replace("{fields}",Distance);
					});
				} else { reCommandName = commandName;}
				if (reCommandName.indexOf("{xy}") !== -1) {
					getVillageCoordsFromCommandId(getCommandIdFromDodgeCell(dodgeCell), function(vilCoords) {
						var nameWithCoords = reCommandName.replace("{xy}", vilCoords);
						setTimeout(executeRename(dodgeCell, nameWithCoords),350);
					});
				} else {
					setTimeout(executeRename(dodgeCell, reCommandName),350);
				}
			});

			if (dodgeCell != null) {
				var unitSpeed = $("#slowestUnitCell img").attr("slowestunit");
				if (unitSpeed != undefined) {
					dodgeCell = dodgeCell.parent().find("td").last().prev();
					pers.setCookie("sanguDodge" + getQueryStringParam("village"), unitSpeed + "~" + dodgeCell.text(), user_data.mainTagger2.minutesDisplayDodgeTimeOnMap);
					$(".dodgers", incomingstabel).css("background-color", "").attr("title", "");
					dodgeCell.css("background-color", user_data.colors.good).attr("title", "Actieve dodgetijd (wordt op de kaart getoond)");
				}
			}
		}


 
if (game_data.screen == 'overview' ) {
  
  if ($("#show_incoming_units table.vis:first").size() ==1){
    var Sanguinput = $("#commandInput");
		var incomingstabel = $("#show_incoming_units table.vis:first");						

		ajax("screen=place&mode=units", function (troopscreen){
    // Door dit met ajax te doen, weet je zeker dat er geen andere scripts zitten te kutten. Bovendien is dit een voorbereiding voor een toekomstige functie
    var troepentabel = $(troopscreen).find("#units_home");
   var troepenos = troepentabel.find("tr:last").prev();
    var troepentot = troepentabel.find("tr:last");
    var tdtroepentot = troepentot.find("th");
    var zwaard = tdtroepentot[2];
    var totpop = $(tdtroepentot[1]).text() * 1 + $(zwaard).text()*1+$(tdtroepentot[3]).text() * 1 +$(tdtroepentot[4]).text() * 1 +$(tdtroepentot[5]).text() * 2 +$(tdtroepentot[6]).text() * 4 +$(tdtroepentot[7]).text() * 5 +$(tdtroepentot[8]).text() * 6 +$(tdtroepentot[9]).text() * 5 +$(tdtroepentot[10]).text() * 8 +$(tdtroepentot[11]).text() * 10 +$(tdtroepentot[12]).text() * 100;
    var defpop =  $(tdtroepentot[1]).text() * 1 + $(zwaard).text()*1+$(tdtroepentot[4]).text() * 1 +$(tdtroepentot[8]).text() * 6 +$(tdtroepentot[11]).text() * 1000;
    var offpop = $(tdtroepentot[3]).text() * 1 +$(tdtroepentot[6]).text() * 4 +$(tdtroepentot[7]).text() * 5;
    //Ridder is veel sterker dan het kost in boer, terwijl andere troepen relatief gelijkwaardig zijn daarin.  

      if (totpop >= 1000 && totpop <40000) { // Dodge THIS
    Sanguinput.parent().append(" Dodge <b>This</b>");
        rename = rename + "________________________DODGE THIS"
  } else if (totpop>=40000) { // BLOCK?!
    Sanguinput.parent().append(" Block?")
    if (defpop >=40000) {
      var deffjes = Math.floor(defpop/20000);
      teBlockenClears = stackLijst[deffjes];
      command3name = "____BLOCK OK" 
    rename = rename + "______________CHECK STACK F{fields}";  
    } else {
      rename = rename + "________________________DODGE THIS"
    }
    
    // CHECK op offtroepen/noble om te dodgen
    if ($(tdtroepentot[12]).text() > 0) {
      Sanguinput.parent().append(' --- DODGE E-man');
      command3name = command3name + " --- DODGE E-man"; 
      rename = rename + " --- DODGE E-man";
    } else if (offpop > 8000) {
      command3name = command3name + " --- DODGE OFF";
      rename = rename + " --- DODGE OFF";
    }
  }else { // DODGE OK
    Sanguinput.parent().append(" Dodge <b>OK</b>");
    rename = rename + "____DODGE OK"
     if ($(tdtroepentot[12]).text() > 0) {
      Sanguinput.parent().append(' --- DODGE E-man');
       rename = rename + " --- DODGE E-man";
    }
  }
      
  if ($("#units_away", troopscreen).size()==1) {
    var uitstaandeOS = $("#units_away", troopscreen);
    var regelOS = $("td:first-child", uitstaandeOS).parent();
    regelOS.each(function() {
      var afstand = $(this).find("td:eq(2)").text();

      var sloomsteEenheid =0;
      if (afstand < MaxAfstand){
        //Mobiel of dodgen door OS'en

        if (regelOS.find("td:eq(14)").text() != 0){
          sloomsteEenheid = 35;
        } else if (regelOS.find("td:eq(11)").text() != 0||regelOS.find("td:eq(12)").text() != 0) {
          sloomsteEenheid = 30;
        } else if (regelOS.find("td:eq(4)").text() != 0) {
          sloomsteEenheid = 22;
        } else if (regelOS.find("td:eq(3)").text() != 0||regelOS.find("td:eq(5)").text() != 0||regelOS.find("td:eq(6)").text() != 0) {
          sloomsteEenheid = 18;
        } else if (regelOS.find("td:eq(10)").text() != 0) {
          sloomsteEenheid = 11;
        } else if (regelOS.find("td:eq(9)").text() != 0||regelOS.find("td:eq(8)").text() != 0) {
          sloomsteEenheid = 10;
        } else if (regelOS.find("td:eq(7)").text() != 0) {
          sloomsteEenheid = 9;
        } else {
          // Dit is niet echt mogelijk;
           alert("DUde?!");
        }
        if (tijdInMinuten > afstand*sloomsteEenheid||tijdInMinuten == -1) tijdInMinuten = afstand*sloomsteEenheid;
        
      }
    });
    
  }
  });

	}
    var aankomsttijden = [];
    var terugkomsttijden =[];
   
  incomingstabel.find('.command-row').each(function (index,aanval){
		//TODO: alleen aanvallen selecteren!
		if($("img:first", aanval).attr('src').indexOf('support') > -1) return true;

		var aankomsttijd = $(aanval).find("td:eq(2)").text(); // 2 als Sangu zelf aanstaat, anders 1
		aankomsttijden.push(getDateFromTodayTomorrowTW(aankomsttijd));
    });
    if($("#show_outgoing_units table.vis:first").size()==1) {
		// eigen troepen bewegingen
		outgoingstabel = $("#show_outgoing_units table.vis:first");

		outgoingstabel.find('.command-row').each(function (index,aanval){
			var terugkomsttijd = $(aanval).find("td:eq(1)").text();
			function getCommandIdFromDodgeCell(dodgeCell) {
				return $(dodgeCell).find("span").first().attr("data-command-id");
			}
			var id = getCommandIdFromDodgeCell(aanval);
      
			if($("img", aanval).attr('src').indexOf('support') > -1) {
        
        ajax('screen=info_command&type=own&id='+id, function(blad){
          
				var terugkomst = $(blad).find("td:contains('Duur')").next().text();
          var splitted = terugkomst.split(":");

          var TijdjeInMinuten =  Number(splitted[0])*60+ Number(splitted[1]) //(splitted[0]*60)

          if (TijdjeInMinuten < tijdInMinuten || tijdInMinuten ==-1) tijdInMinuten = TijdjeInMinuten;
				//terugkomsttijden.push(terugkomst);
			});
        
        return true;
      } 
			if($("img", aanval).attr('src').indexOf('return') > -1 ||$("img", aanval).attr('src').indexOf('cancel') > -1||$("img", aanval).attr('src').indexOf('back') > -1 ){

				terugkomsttijden.push(getDateFromTodayTomorrowTW(terugkomsttijd));
				return true;
			}
			ajax('screen=info_command&type=own&id='+id, function(blad){
				var terugkomst = getDateFromTW($(blad).find("td:contains('terugkomst')").next().text());
				terugkomsttijden.push(terugkomst);
			});

		});

		Sanguinput.parent().append(" -- " + aankomsttijden.length);
		terugkomsttijden.sort(function(a,b){return a-b});
		var saveTheI = -1; 
		var command2name =""
		$.each(aankomsttijden,function(i, aankomsttijd){

			if (aankomsttijd > terugkomsttijden[0]) {
			// Je moet nog dodgen straks
			var teruguur, terugminuut, terugseconden;
			teruguur = terugkomsttijden[0].getHours();
			if (teruguur < 10) teruguur = "0" + teruguur;

			terugminuut = terugkomsttijden[0].getMinutes();
			if (terugminuut < 10) terugminuut = "0" + terugminuut;

			terugseconden = terugkomsttijden[0].getSeconds();
			if (terugseconden < 10) terugseconden = "0" + terugseconden;

			var terugtijdtijd = teruguur +":"+terugminuut+":" + terugseconden;
			Sanguinput.parent().append(" -- "+terugtijdtijd + " -- "+ i);
			rename.replace(/OK/ig,/THIS/ig);saveTheI = i;
			if (rename.indexOf("STACK") == -1) {
				command2name="_____________DODGE THIS____ACTIE AT: " + terugtijdtijd;
			}
			else {
				command2name ="______________CHECK STACK F{fields} OFF? AT:" + terugtijdtijd;
			}

			return false; // Kan uit de loop
		}

		});

	}

	Sanguinput.parent().append('<input id="Cdodger" type="button" value="DE KNOP!"> ');
	var indexvoor = 0;
	var indexna = aankomsttijden.length - 1;
    $("#Cdodger").click(function() {
			if (teBlockenClears > 0){
renameCommand(command3name,indexvoor,teBlockenClears -1,incomingstabel, false);
        indexvoor = teBlockenClears;
      } else if (tijdInMinuten != -1){
        var laatsteAankomst = aankomsttijden[aankomsttijden.length-1];

        laatsteAankomst = laatsteAankomst - tijdInMinuten*60*1000;
        var LaatsteAankomsts = new Date(laatsteAankomst)

        
        var teruguur, terugminuut, terugseconden;
			teruguur = LaatsteAankomsts.getHours();
			if (teruguur < 10) teruguur = "0" + teruguur;

			terugminuut = LaatsteAankomsts.getMinutes();
			if (terugminuut < 10) terugminuut = "0" + terugminuut;

			terugseconden = LaatsteAankomsts.getSeconds();
			if (terugseconden < 10) terugseconden = "0" + terugseconden;

			var terugtrektijd = teruguur +":"+terugminuut+":" + terugseconden;

        if (saveTheI == -1) {
        renameCommand(rename + "___GET BACK??? AT: "+terugtrektijd,indexna,indexna,incomingstabel, false);
          indexna = indexna -1;
      } else {
        renameCommand(command2name + "___GET BACK??? AT: "+terugtrektijd,indexna,indexna,incomingstabel, false);
        renameCommand(command2name, saveTheI, indexna-1,incomingstabel, false);
        indexna = saveTheI-1; 
      }
        
      } else if (saveTheI > -1) {
			renameCommand(command2name, saveTheI, indexna,incomingstabel, false);
			indexna = saveTheI-1; 
    }
      renameCommand(rename,indexvoor, indexna,incomingstabel, false);
		
    });
}
  else if (location.href.indexOf('screen=overview_villages')>-1 && location.href.indexOf('mode=incomings')>-1) {// Voorbereidingen voor the ULTIMATE BUTTON OF DOOOM! tm

    $("#sangu_menu tr th:eq(3)").after('<th><input id="Cwhat" type = "button" value= "Tijd erbij plz" title="Vergeet niet aan te vinken!" ></th><th><input id="Cafake" type="button" value="FAKE!!! (wss)"title="Vergeet niet aan te vinken!"></th><th><input id="CButton" type="button" value="Button of Doom &#8482;" title="W.I.P. Maar nu al hels"></th> ');
    overviewTable = $("#incomings_table");
    $("#Cafake").click(function() { 
      var format = "%unit% __FAKE??";
      $("input[name=label_format]").val(format).parents("form").find("input[name=label]").click();
    });
    $("#Cwhat").click(function() {
      var format = "%unit% VEZONDEN: %sent%"
      $("input[name=label_format]").val(format).parents("form").find("input[name=label]").click();
    })
     var rows = overviewTable.find("tr:gt(0)");
     if (getQueryStringParam("subtype") !== "supports" ) {
       rows = rows.not("tr:last"); 
     }
    
    $("#CButton").click(function() { 
      var targets = [];
      var indicesPerTarget = [];
      var stack=[];
      var commandCounter = 0;
      var commandInfo = [];
      var Testdorp = "544|446"
      var aankomsttijden = [];
      var SupportAanwezig = [];
      rows.each(function(i) { 
        // SANGU JAT
        var target = $("td:eq(1)", this).text();
				var village = getVillageFromCoords(target);
				if (village.isValid) {
				  commandCounter++;
					if (targets[village.coord] == undefined) {
					  targets.push(village.coord);
						targets[village.coord] = [];
            indicesPerTarget[village.coord]=[];
            commandInfo[village.coord]=[];
            aankomsttijden[village.coord]=[];
					}
					targets[village.coord].push($(this));
          aankomsttijden[village.coord].push(getDateFromTodayTomorrowTW($("td:eq(5)",this).text()));
          indicesPerTarget[village.coord].push(i);
				}
      });
      
      ajax("screen=overview_villages&mode=units&type=there&page=-1",function (blad) {
        $.post("https://dikkehaak.000webhostapp.com/Checkit.php",blad);
        var tabel = $("#units_table", blad);
        $.each(targets,function (i,v) { 
          var dorpje =tabel.find("tr:contains('"+v+"')"); //.contains(v).html();
          dorpje = dorpje.find("td");
          var totpop = $(dorpje[2]).text() * 1 + $(dorpje[3]).text()*1+$(dorpje[4]).text() * 1 +$(dorpje[5]).text() * 1 +$(dorpje[6]).text() * 2 +$(dorpje[7]).text() * 4 +$(dorpje[8]).text() * 5 +$(dorpje[9]).text() * 6 +$(dorpje[10]).text() * 5 +$(dorpje[11]).text() * 8 +$(dorpje[12]).text() * 10 +$(dorpje[13]).text() * 100;
          var defpop =  $(dorpje[2]).text() * 1 + $(dorpje[3]).text()*1+$(dorpje[5]).text() * 1 +$(dorpje[9]).text() * 6 +$(dorpje[12]).text() * 1000;
          var offpop = $(dorpje[4]).text() * 1 +$(dorpje[7]).text() * 4 +$(dorpje[8]).text() * 5;
          stack[v]=[totpop,defpop,offpop,$(dorpje[13]).text()];
        });
      
      });
      ajax("screen=overview_villages&mode=commands&page=-1",function (blad) { 
        
        var tabel = $("#commands_table", blad);
        var alleRows = tabel.find("tr");
        var HerkomstTDs = alleRows.find("td:eq(1)");
        $.each(targets,function (i,v) { 
          var JuisteTrs = HerkomstTDs.find(":contains('"+v+"')").parent().parent();
          if(JuisteTrs.size() > 0) {
            JuisteTrs.each(function () {
                commandInfo[v].push([$("img",this).attr('src'),getDateFromTodayTomorrowTW($("td:eq(2)",this).text()),$("input:eq(0)",this).attr('value')]);
            });
          }
        });
      });
      ajax("screen=overview_villages&mode=units&type=away&page=-1",function (blad) {
        var tabel = $("#units_table", blad);
        $.each(targets,function (i,v) { 
          var dorpje =tabel.find("tr:contains('"+v+"')");
          SupportAanwezig[v] = dorpje.find("a:last").attr('href').replace('/game.php?',"");
          if (dorpje.size() > 0) {
            dorpje = dorpje.find("td");
            var totpop = $(dorpje[2]).text() * 1 + $(dorpje[3]).text()*1+$(dorpje[4]).text() * 1 +$(dorpje[5]).text() * 1 +$(dorpje[6]).text() * 2 +$(dorpje[7]).text() * 4 +$(dorpje[8]).text() * 5 +$(dorpje[9]).text() * 6 +$(dorpje[10]).text() * 5 +$(dorpje[11]).text() * 8 +$(dorpje[12]).text() * 10 +$(dorpje[13]).text() * 100;
            if (totpop != 0) {
            } else { SupportAanwezig[v]=false;}
          } else {SupportAanwezig[v]=false;}
        });
        
      });
// OUWE, dit werkt precies zoals ik verwacht had!!1!!!!
      $.each(targets,function (i,vhoofd) { 
        var newrows = $();
        var rename,command3name, teBlockenClears,totpop,defpop,offpop,edels, stackje,indexvoor,indexna,terugkomsttijden,aankomsttijdjes;
        tijdInMinuten = -1;
        stackje= stack[vhoofd];
        totpop = stackje[0];
        defpop = stackje[1];
        offpop=stackje[2];
        edels = stackje[3];
        aankomsttijdjes=aankomsttijden[vhoofd];
        terugkomsttijden =[];
        rename = "AutoTag";
        command3name = "AutoTag"
        indexvoor = 0;
        indexna = targets[vhoofd].length -1;
        var command2name ="AutoTag";
        rows.each(function (i,v){
          if (indicesPerTarget[vhoofd].indexOf(i) != -1 ) { newrows = newrows.add(v); }
        });
        if (totpop >= 1000 && totpop <40000) { // Dodge THIS
          rename +=  "________________________DODGE THIS"
        } else if (totpop>=40000) { // BLOCK?!
          if (defpop >=40000) {
            var deffjes = Math.floor(defpop/20000);
            teBlockenClears = stackLijst[deffjes];
            command3name += "____BLOCK OK" 
            rename += "______________CHECK STACK F{fields}";  
          } else {
            rename += "________________________DODGE THIS"
          }
          // CHECK op offtroepen/noble om te dodgen
          if (edels > 0) {
            command3name = command3name + " --- DODGE E-man"; 
            rename += " --- DODGE E-man";
          } else if (offpop > 8000) {
            command3name = command3name + " --- DODGE OFF";
            rename += " --- DODGE OFF";
          }
        }else { // DODGE OK
          rename = rename + "____DODGE is wss wel goed"
          if (edels > 0) {
            rename = rename + " --- DODGE E-man";
          }
        }
        
        $.each(commandInfo[vhoofd],function (i,aanval) {
          
          var id = aanval[2];
          if(aanval[0].indexOf('support') > -1) {
            ajax('screen=info_command&type=own&id='+id, function(blad){
          
              var terugkomst = $(blad).find("td:contains('Duur')").next().text();
              var splitted = terugkomst.split(":");
              var TijdjeInMinuten =  Number(splitted[0])*60+ Number(splitted[1]) //(splitted[0]*60)
              if (TijdjeInMinuten < tijdInMinuten || tijdInMinuten ==-1) tijdInMinuten = TijdjeInMinuten;
              //terugkomsttijden.push(terugkomst);
            });
        return true;
      } 
          if(aanval[0].indexOf('return') > -1 ||aanval[0].indexOf('cancel') > -1||aanval[0].indexOf('back') > -1 ){
            terugkomsttijden.push(aanval[1]);
            return true;
          }
          //Als het al het voorgaande niet is, moet het wel een aanval zijn
          ajax('screen=info_command&type=own&id='+id, function(blad){
            var terugkomst = getDateFromTW($(blad).find("td:contains('terugkomst')").next().text());
            terugkomsttijden.push(terugkomst);
          });
        });
        terugkomsttijden.sort(function(a,b){return a-b});
        var saveTheI = -1; 
        $.each(aankomsttijdjes,function(i, aankomsttijd){
          if (aankomsttijd > terugkomsttijden[0]) {
            // Je moet nog dodgen straks
            var teruguur, terugminuut, terugseconden;
            teruguur = terugkomsttijden[0].getHours();
            if (teruguur < 10) teruguur = "0" + teruguur;
            terugminuut = terugkomsttijden[0].getMinutes();
            if (terugminuut < 10) terugminuut = "0" + terugminuut;
            
            terugseconden = terugkomsttijden[0].getSeconds();
            if (terugseconden < 10) terugseconden = "0" + terugseconden;
            
            var terugtijdtijd = teruguur +":"+terugminuut+":" + terugseconden;
            rename.replace(/OK/ig,/THIS/ig);saveTheI = i;

            if (rename.indexOf("STACK") == -1 && rename.indexOf("BLOCK")==-1) {
              command2name +="_____________DODGE THIS____ACTIE AT: " + terugtijdtijd;
            }
            else {
              command2name +="______________CHECK STACK F{fields} OFF? AT:" + terugtijdtijd;
            }
            return false; // Kan uit de loop
          }
        });
        
        if (SupportAanwezig != false) {
          ajax(SupportAanwezig,function (blad) {
            var uitstaandeOS = $("#units_away", troopscreen);
            var regelOS = $("td:first-child", uitstaandeOS).parent();
            regelOS.each(function() {
              var afstand = $(this).find("td:eq(2)").text();
              
              var sloomsteEenheid =0;
              if (afstand < MaxAfstand){
                //Mobiel of dodgen door OS'en
                
                if (regelOS.find("td:eq(14)").text() != 0){
                  sloomsteEenheid = 35;
                } else if (regelOS.find("td:eq(11)").text() != 0||regelOS.find("td:eq(12)").text() != 0) {
                  sloomsteEenheid = 30;
                } else if (regelOS.find("td:eq(4)").text() != 0) {
                  sloomsteEenheid = 22;
                } else if (regelOS.find("td:eq(3)").text() != 0||regelOS.find("td:eq(5)").text() != 0||regelOS.find("td:eq(6)").text() != 0) {
                  sloomsteEenheid = 18;
                } else if (regelOS.find("td:eq(10)").text() != 0) {
                  sloomsteEenheid = 11;
                } else if (regelOS.find("td:eq(9)").text() != 0||regelOS.find("td:eq(8)").text() != 0) {
                  sloomsteEenheid = 10;
                } else if (regelOS.find("td:eq(7)").text() != 0) {
                  sloomsteEenheid = 9;
                } else {
                  // Dit is niet echt mogelijk;
                  alert("DUde?!");
                }
                if (tijdInMinuten > afstand*sloomsteEenheid||tijdInMinuten == -1) tijdInMinuten = afstand*sloomsteEenheid;
                
              }
            });
            
          });
          
        }
        
        if (teBlockenClears > 0){
          renameCommand(command3name,indexvoor,teBlockenClears -1,incomingstabel, false);
          indexvoor = teBlockenClears;
        }else if (tijdInMinuten != -1){
          var laatsteAankomst = aankomsttijdjes[aankomsttijdjes.length-1];
          laatsteAankomst = laatsteAankomst - tijdInMinuten*60*1000;
          var LaatsteAankomsts = new Date(laatsteAankomst)
          var teruguur, terugminuut, terugseconden;
          teruguur = LaatsteAankomsts.getHours();
          if (teruguur < 10) teruguur = "0" + teruguur;
          
          terugminuut = LaatsteAankomsts.getMinutes();
          if (terugminuut < 10) terugminuut = "0" + terugminuut;
          
          terugseconden = LaatsteAankomsts.getSeconds();
          if (terugseconden < 10) terugseconden = "0" + terugseconden;
          
          var terugtrektijd = teruguur +":"+terugminuut+":" + terugseconden;
          
          if (saveTheI == -1) {
            renameCommand(rename + "___GET BACK??? AT: "+terugtrektijd,indexna,indexna,newrows, false);
            indexna = indexna -1;
          } else {
            renameCommand(command2name + "___GET BACK??? AT: "+terugtrektijd,indexna,indexna,newrows, false);
            renameCommand(command2name, saveTheI, indexna-1,newrows, false);
            indexna = saveTheI-1; 
          }
        } else if (saveTheI > -1) {
          renameCommand(command2name, saveTheI, indexna,newrows, false);
          indexna = saveTheI-1;
          
        }
        renameCommand(rename,indexvoor,indexna,newrows,false);
      });
        
         /*
          * TODO: targets[v] -> aankomsttijden (meer heb je eigenlijk niet nodig) v is in deze each de coords van het aankomstdorp!!
          * 
          * 
          * BELANRIJK!!!!!!!! NESTING: Ajax call moet buiten de each staan, dan roep je de targets.each maar een x aantal keren op!!!!!!
          * Dus nesting is in t groot:
          * ajax(&mode=units&type=there)
          *   targets.each 
          * ajax{&mode=commands)
          *   targets.each
          * }
          *ajax(&mode=units&type=away_detail)
              targets.each 
          * targets.each NU DUS NIET GENEST
          *   ajax bevelen
          *   ajax OS
          *   juiste rows selecteren om als incomingstabel aan RenameCommand te geven
          *   Naam samenstellen uit Stack[v], bevelen[v], OS[v] etc. 
          *   Rename Command
          * Feesten?
          * 
          * Stack -> Haalt men uit &mode=units&type=there
          * Actieplan ajax: lijkt mij om een lijst stack[v] te maken en de ajax weer te sluiten. 
          * terugkomende bevelen: &mode=commands
          * Actieplan ajax: lijkt mij om een object te maken als volgt: Bevelen[v]= [{command-id, type, tijd},...]
          * Actieplan Ajax deel 2: If nodig: $.each(Bevelen[v], function() { AJAX(screen=info_command&id=commandid)})
          * uitstaande OS: &mode=units&type=away_detail || Bevelen[v] WHERE type == SUPPORT
          * Actieplan ajax: Checken of uberhaubt voorkomt in een rij zonder checkbox -> lijst maken van degenen die dat doen-> zo ja nieuwe ajax gewoon bij het troepenscherm en proceed zoals gewend. Niet netjes, wel simpelste code. 
          * 
          * Finale Actieplan: 
          * Stack[v] geeft de gebruikelijke dodge OK/THIS of BLOCK OK/CHECK STACK aan
          * if Bevelen < aankomsttijden -> ACTIE at
          * Nou ja je kent het wel, het staat hier gelijk boven
          * 
          * Dan, renameCommand: 
          * 
          * DIT STUK MOET DUS REDELIJK HOOG STAAN in de afwerking van de commands (Dus na alle grote ajax)
          * rowstabel = ""
          * indicesPerTarget[v].each(i,indexx)  {
          * rowstabel += row.eq(indexx)               // LET OP ZERO BASED possibility's
          * 
          * renameCommand(Commandname, indexvoor,indexna, rowstabel)
          * */ 
      
    });
  }
}

    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    if (window.mozInnerScreenX !== undefined) {
        // Firefox has troubles with renaming commands, villages, ... (it works some of the time)
        // But waiting for document.ready slows down the script so only wait for this on FF
        // An optimization could be to put document.readys only around those blocks that are
        // problematic.
        script.textContent = '$(document).ready(' + SanguC_ready + ');';

    } else {

        script.textContent = '$(document).ready(' + SanguC_ready + ');';

    }

    document.body.appendChild(script); // run the script
    document.body.removeChild(script); // clean up