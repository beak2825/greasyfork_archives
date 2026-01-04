// //// // ==UserScript==
// @name         beta-updateEditorProgress
// @namespace    http://tampermonkey.net/
// @version      2019.05.17
// @description  for each discord editor in your region's channel, this script will open the associated editor's profile, capture relevant information, and download that information into
// @description  comma separated value (CSV) file.  The contents of the file can then be programmaticaly added to a google sheet (using a separate script)
// @description  With the script installed, open any WME editor profile page to execute the script.
// @author       ramblinwreck_81
// @match        https://www.waze.com/user/editor*
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370686/beta-updateEditorProgress.user.js
// @updateURL https://update.greasyfork.org/scripts/370686/beta-updateEditorProgress.meta.js
// ==/UserScript==


// TO DO:
// add code that removes editors based on inactivity
// fix bot code to avoid editor name errors



(function() {
  'use strict';
  var discordEditors = [];
  var tableUnlockedEditors = [];
  var tableLockedEditors = [];
  var CLIENT_ID = '533057355164-2m80uia4u5pedq0dteiia47k3ff6als8.apps.googleusercontent.com'
  var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
  var SCOPES = "https://www.googleapis.com/auth/spreadsheets";
  var spreadsheetId = '15TYXaO7iYRNNDUkkavG-2X75yP6iPobPV-VNBGhVjIU';
  var ssRange = 'discordEditors!A:D';
  var authorizeButton;
  var signoutButton;
  var blnReadyToBuildTable = false;
  var blnWrite = false;
  var blnLockChange = false;
  var blnHomeRegionChange = false;
  var blnNotHomeRegion = false;
  var regionSpecificEditors = true;
  var blnIsAM = false;
  var editors = [];

  function bootstrap(tries) {
    if (W && W.Map &&
      W.Model &&
      $) {
      init();
    } else if (tries < 100) {
      setTimeout(function() {
        tries += 1;
        bootstrap(tries);
      }, 200);
    }
  } // end of bootstrap

  function init()
  {
    console.log("initializing editor progress script");
    createUploadElements();
    function createUploadElements()
    {
      var y = document.createElement("div");
      y.setAttribute("id", "csv-info");
      document.getElementsByClassName("user-headline")[0].appendChild(y);
      var z = document.createElement("button");
      z.setAttribute("type", "button");
      z.setAttribute("value", "Run");
      z.setAttribute("id", "run-editor-update");
      var aa = document.createTextNode("Editor Update");
      z.appendChild(aa);
      document.getElementById("csv-info").appendChild(z);
      document.getElementById("run-editor-update").style.height = "20px";
      document.getElementById("run-editor-update").style.width = "100px";
      var node = document.createElement('div');
      node.innerHTML = '<input type="checkbox" id="select-region" name="check"><label for="region-specific">My Region Only</label>';
      document.getElementById('csv-info').appendChild(node);
      $('#select-region').attr('autofocus', 'true')
      //    $('#select-region').attr('label','Only SER Editors?');
      $('#select-region').attr('checked', 'true');
      $('#csv-info').append('<button id="authorize_button" style="display: none;">Authorize</button><button id="signout_button" style="display: none;">Sign Out</button>');
      authorizeButton = document.getElementById('authorize_button');
      signoutButton = document.getElementById('signout_button');
    } // end of createUploadElements
    document.getElementById("select-region").addEventListener("click", setEditorFilter, false);
    document.getElementById("run-editor-update").addEventListener("click", handleClientLoad, false);
//    checkPointStatus();
    function checkPointStatus()
      {
          var pageNew = window.open("http://status.waze.com");
          checkForOpen();
          function checkForOpen()
          {
              var timer;
              if(pageNew.document.getElementsByClassName('tg-i6eq').length>0){
                  console.log('success');
                  clearTimeout(timer);
              } else {
                  console.log('waiting');
                  timer = setTimeout(checkForOpen,250);
              }
          }
      }

  } // end of init
  function handleClientLoad() {
    gapi.load('client:auth2', initClient);
  }

  function initClient() {
    gapi.client.init({
      //apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    }).then(function() {
      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

      // Handle the initial sign-in state.
      updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      authorizeButton.onclick = handleAuthClick;
      signoutButton.onclick = handleSignoutClick;
    });
  }

  function updateSigninStatus(isSignedIn)
  {
    if (isSignedIn) {
      authorizeButton.style.display = 'none';
      signoutButton.style.display = 'block';
      if (blnWrite === false) {
        executionSequence();
      } else {
        if(blnHomeRegionChange) {
            handleNonRegionEditors();
            blnHomeRegionChange = false;
        }
        if(blnLockChange) {
            addLockedEditors();
            blnLockChange = false;
        }
        if(blnIsAM) {
            console.log('handling AMs');
            handleAMEditors();
            blnIsAM = false;
        }
      }
    } else {
      authorizeButton.style.display = 'block';
      signoutButton.style.display = 'none';
    }
  } // end of update signin status

  function handleAuthClick(event)
  {
    gapi.auth2.getAuthInstance().signIn();
  }

  /**
   *  Sign out the user upon button click.
   */
  function handleSignoutClick(event)
  {
    gapi.auth2.getAuthInstance().signOut();
  }

  $('body').append('<script async defer src="https://apis.google.com/js/api.js" onload="this.onload=function(){};handleClientLoad()" onreadystatechange="if (this.readyState === complete) this.onload()"></script>');

  function setEditorFilter()
  {
    if ($('#select-region').prop('checked')) {
      regionSpecificEditors = true;
    } else {
      regionSpecificEditors = false;
      alert('If the table is already displayed below, refresh the page, deselect the checkbox and run the editor update again.');
    }
  };

  function executionSequence()
  {
    let lockedArray = localStorage.getItem('lockedEditors') ? JSON.parse(localStorage.getItem('lockedEditors')) : [];
    var validatedProfileCount = 0;
    var profilePageErrors = 0;

    var rangeLength = 0;
    var inactiveEditors = 0;
    var L1Editors = 0;
    var L2Editors = 0;
    var L3Editors = 0;
    var L4Editors = 0;
    var L5Editors = 0;
    var L6Editors = 0;
    var L7Editors = 0;
    var totalEditors = 0;
    var L1Edits = 0;
    var L2Edits = 0;
    var L3Edits = 0;
    var L4Edits = 0;
    var L5Edits = 0;
    var L6Edits = 0;
    var L7Edits = 0;
    var sumRegionEdits = 0;
    var alreadyWarned = false;
    var totalNotInRegion = 0;
    var duplicatesRemoved = 0;
    var skipCount = 0;
    connectGoogleAPI();

    function connectGoogleAPI()
    {
      var params = {
        // The ID of the spreadsheet to retrieve data from.
        spreadsheetId: spreadsheetId, //TODO: Update placeholder value.

        // The A1 notation of the values to retrieve.
        ranges: ssRange,

        // How values should be represented in the output.
        // The default render option is ValueRenderOption.FORMATTED_VALUE.
        valueRenderOption: 'UNFORMATTED_VALUE', // TODO: Update placeholder value.

        // How dates, times, and durations should be represented in the output.
        // This is ignored if value_render_option is
        // FORMATTED_VALUE.
        // The default dateTime render option is [DateTimeRenderOption.SERIAL_NUMBER].
        dateTimeRenderOption: 'FORMATTED_STRING', // TODO: Update placeholder value.
      }; // end of params variable

      var request = gapi.client.sheets.spreadsheets.values.batchGet(params);
      request.then(function(response) {
      var apiEditors = response.result.valueRanges[0].values
      rangeLength = response.result.valueRanges[0].values.length;
      var filteredArr = apiEditors.filter(notSERFilter);

      function notSERFilter(element, index, array)
      {
        return array[index][2] !== true;
      }
 console.log('At line 237, filtered array is ' + filteredArr + ' and filtered array length is ' + filteredArr.length);
      totalNotInRegion = rangeLength - filteredArr.length;
      apiEditors.forEach(function(element, index, array)
      {
          var string = array[index][0].toString().toLowerCase().trim();
          array[index][0] = string;
          discordEditors.push(array[index]);
          if (apiEditors[index][1] === true) {}
          if (apiEditors[index][1] === true) {
              discordEditors[index][1] = true;
          } else {
              discordEditors[index][1] = '';
          }
          if (regionSpecificEditors === false) {
              if (apiEditors[index][2] === true) {
                  discordEditors[index][2] = true;
              } else {
                  discordEditors[index][2] = '';
              }
          } else {
  //            discordEditors[index][2] = '';
          }

          if(apiEditors[index][3] === true) {
              discordEditors[index][3] = true;
          } else {
              discordEditors[index][3] = '';
          }

      }); // end of .forEach
      var stringArr = [];
      var testArr = [];

      var a = discordEditors.reduce(function(accum, value, idx, array) // get rid of duplicate editor names
      {
        var string = array[idx][0].toString().trim().toLowerCase();
        if (stringArr.indexOf(string) < 0) {
          stringArr.push(string);
          testArr.push(value);
          accum = testArr;
          return accum;
        }
      }, []);
      duplicatesRemoved = discordEditors.length - testArr.length;
//      console.log('duplicate editors removed: ' + duplicatesRemoved);
      discordEditors = testArr;
      }, function(reason) {
        console.error('error: ' + reason.result.error.message);
      });
    } // end of function connectGoogleAPI
    var timeoutCounter = 0;
    checkDiscordEditorArr();

    function checkDiscordEditorArr() {
//      var waitTime = 400;

      var g_Wait;
      if (((discordEditors.length + duplicatesRemoved) === rangeLength) && rangeLength > 300) {
        clearTimeout(g_Wait);
        connectWazeAPI();
      } else {
        timeoutCounter += 1;
        g_Wait = setTimeout(function ()
        {
          checkDiscordEditorArr();
        }, 400);
      }
    } // end of checkdiscordeditorarr function
    timeoutCounter = 0;
    checkWazeAPIReturns();

    function checkWazeAPIReturns() {
      var wait;
//      var waitTime = 1000;
      if ((profilePageErrors + validatedProfileCount + inactiveEditors + skipCount === discordEditors.length) && discordEditors.length > 0) {
        clearTimeout(wait);
        blnReadyToBuildTable = true;
        buildWebDisplay();
      } else {
console.log('profilepageerrors: ' + profilePageErrors + ' and validatedprofileCount: ' + validatedProfileCount + ' and inactiveEditors: ' + inactiveEditors + ' and totalNotInRegion: ' + totalNotInRegion + ' and skipCount: ' + skipCount + ' and discordEditors.length: ' + discordEditors.length);
        wait = setTimeout(function() {
          timeoutCounter += 1;
          checkWazeAPIReturns();
        }, 1000);
      }
    } // end of checkWazeAPIReturns function

    function connectWazeAPI() {
      function Editor(name, rank, firstEditDate, totalEdits, editHistory, milestone, rate, lastEditDate, milliFirstEditDate, sevenDayEdits, rankLocked, blnNotHomeRegion, blnIsAM, sevenDayRate, thirtyDayRate,sixtyDayRate, ninetyDayRate)
      {
        this.name = name;
        this.rank = rank;
        this.firstEditDate = firstEditDate;
        this.totalEdits = totalEdits;
        this.editHistory = editHistory; // note that edit history is reverse chronological.  so edit history at index 0 is actually 91 days ago.  at index 91 is today.
        this.sevenDayEdits = sevenDayEdits;
        this.milestone = milestone;
        this.rate = rate;
        this.lastEditDate = lastEditDate;
        this.milliFirstEditDate = milliFirstEditDate;
        this.rankLocked = rankLocked;
        this.notHomeRegion = blnNotHomeRegion;
        this.AM = blnIsAM;
        this.rate7 = sevenDayRate;
        this.rate30 = thirtyDayRate;
        this.rate60 = sixtyDayRate;
        this.rate90 = ninetyDayRate;
      }

      function pullEditorInfo(element, index, array)
      {
        if((array[index][2] !== true) || (regionSpecificEditors === false)) {  // if filter on region editors is false OR an editor NOT is marked as out of this region...
            var wazeURL = 'https://www.waze.com/user/editor/';
            $.ajax({
                url: wazeURL + array[index][0],
                success: function(data, status, xhr)
                {
                  var $result = $.parseHTML(xhr.responseText, true)[9].text;
                  var cdata = JSON.parse($result.split(";")[1].replace("gon.data=", ""));
                  var userdata = "\nUsername: " + cdata.username + "\nRank: " + parseInt(cdata.rank + 1) + "\nEdits: " + cdata.edits + "\nFirst Edit Date: " + cdata.firstEditDate;
                  if (cdata.firstEditDate === undefined) {
                      profilePageErrors += 1;
                      console.log(`${cdata.username} has no valid date.`);
                      return;
                  }
                  editors[validatedProfileCount] = new Editor(cdata.username, parseInt(cdata.rank + 1), cdata.firstEditDate, cdata.edits, cdata.editingActivity);
                  var active = -1;
                  editors[validatedProfileCount].lastEditDate = findLastEditDate(editors[validatedProfileCount]);
                  editors[validatedProfileCount].milliFirstEditDate = cdata.firstEditDate;
                  if (array[index][1] === true) {
                      editors[validatedProfileCount].rankLocked = true;
                  } else {
                      editors[validatedProfileCount].rankLocked = false;
                  }
                  if (array[index][2] === true) {
                      editors[validatedProfileCount].notHomeRegion = true;
                  } else {
                      editors[validatedProfileCount].notHomeRegion = false;
                  }
                  if(array[index][3] === true) {
                      editors[validatedProfileCount].AM = true;
                  } else {
                      editors[validatedProfileCount].AM = false;
                  }

                  function findLastEditDate(curEditor)
                  {
                      var arr = curEditor.editHistory;
                      var foundFirst = false;
                      var lastDay;
                      arr = arr.reverse();
                      arr.forEach(function(element, index, array) {
                          if ((array[index] > 0) && (foundFirst === false)) {
                              foundFirst = true;
                              active = index;
                          }
                      });
                      var today = new Date();
                      var lastDayMS = 0;
                      if (active > -1) {
                          lastDayMS = active * 24 * 60 * 60 * 1000;
                      } else {
                          lastDayMS = 92 * 24 * 60 * 60 * 1000;
                          inactiveEditors += 1;
                      }
                      var lastDate = new Date(today - lastDayMS);
                      return lastDate.toLocaleDateString();

                  } // end of findLastEditDate
                  if (active > -1) {
                      validatedProfileCount += 1;
                      switch (parseInt(cdata.rank + 1)) {
                          case 1:
                              L1Editors += 1;
                              L1Edits += cdata.editingActivity.reduce(reducer, 0);
                              break;
                          case 2:
                              L2Editors += 1;
                              L2Edits += cdata.editingActivity.reduce(reducer, 0);
                              break;
                          case 3:
                              L3Editors += 1;
                              L3Edits += cdata.editingActivity.reduce(reducer, 0);
                              break;
                          case 4:
                              L4Editors += 1;
                              L4Edits += cdata.editingActivity.reduce(reducer, 0);
                              break;
                          case 5:
                              L5Editors += 1;
                              L5Edits += cdata.editingActivity.reduce(reducer, 0);
                              break;
                          case 6:
                              L6Editors += 1;
                              L6Edits += cdata.editingActivity.reduce(reducer,0);
                              break;
                          case 7:
                              L7Editors += 1;
                              L7Edits += cdata.editingActivity.reduce(reducer,);
                              break;
                          default:
                              console.log('no rank found for editor ' + cdata.username);
                      } // end of switch

                      function reducer(accumulator, value) {
                          return accumulator + value;
                      }
                      totalEditors = L1Editors + L2Editors + L3Editors + L4Editors + L5Editors + L6Editors;
                      sumRegionEdits = L1Edits + L2Edits + L3Edits + L4Edits + L5Edits + L6Edits + L7Edits;
                  } // end of if(active > -1)
              }, // end of success
              error: function(XMLHttpRequest, textStatus, errorThrown) {
                  profilePageErrors += 1;
              }
            }); // end of ajax
        } else {
            skipCount += 1;
        } // end if (array[index][2] !==2)

      } // end of pullEditorInfo

      discordEditors.forEach(pullEditorInfo);
    } // end of connectWazeAPI

    function buildWebDisplay()
    {
      var editorHTML = '';
    //**********regionEditorsHTML is the table header info*********

//<input class = ' + AMStatus + ' type = "checkbox" />

      var regionEditorsHTML = '<div class = "table-area1"><button  type = "button" id = "save-locked">Save Locked Editors</button>' +
        '<button type ="button" id = "save-nonRegion">Save Non-region Editors</button>' +
        '<button type = "button" id = "save-AM">Save AM Editors</button>' +
        '<input id = "seven-day" name = "edit-rates" class = "rate-7" value = "seven" type = "radio" /><label for = "seven-day">Last 7 Days Edits</label>' +
        '<input id = "thirty-day" name = "edit-rates" class = "rate-30" value = "thirty" type = "radio" /><label for = "thirty-day">Last 30 Days Edits</label>' +
        '<input id = "sixty-day" name = "edit-rates" class = "rate-60" value = "sixty" type = "radio" /><label for = "sixty-day">Last 60 Days Edits</label>' +
        '<input id = "ninety-day" name = "edit-rates" class = "rate-90" value = "ninety" type = "radio" /><label for = "ninety-day">Last 90 Days Edits</label>' +
        '<div id = "total-editors"></div><div id = regions-edits></div>' +
        '<pre tr:nth-child(even) {background: #CCC} tr:nth-child(odd) {background: #FFF}</pre> <table id= "region-table">' +
        '<thead id = "the-head"><tr><th id= "name" class = "hdr col1 columz"><button type="button" id="sort-name" ' +
        '>Name</button></th><th id="level" class = "col2 columz"><button type = "button" id = "sort-level">Level</button></th><th id= "locked" class = ' +
        '"col3 columz"><button type = "button" id = "sort-locked">Locked</button></th><th id="began" class = "col4 columz">' +
        '<button type = "button" id= "sort-began">Started</button>' +
        '</th><th id="total-edits" class = "col5 columz"><button type = "button" id= "sort-edits">Total Edits</button>' +
        '</th><th id="milestone" class = "col6 columz"><button type = "button" id = "sort-milestone">Milestone</button></th>' +
        '<th id = "last-edit" class = "col6A columz"><button type = "button" id = "sort-last-edit-date">Last Edit</button></th>' +
        '<th id="rate" class = "col7 columz"><button type = "button" id = "sort-rate">Edit Rate</button></th>' +
        '<th id = "outside-SER" class = "col7A columz"><button type = "button" id = "sort-outsideSER">Non-SER</button></th>' +
        '<th id = AM-stat" class = "col7B columz"><button type = "button" id = "sort-AMs">Is AM</button></th>' +
        '<th id = "milliDate" class = "col8 columz">msDate</tr></thead><tbody id = "theTable-body">';



//************regionEditorsHTML is the table header info

      editors.forEach(addStatsToTable);

      function addStatsToTable(element, index, array)
      {
        function convertSecondsToDate(sec)
        {
          var a = new Date(sec).toLocaleDateString();
          if (array[index].firstEditDate !== NaN) {
            array[index].firstEditDate = a;
            return a;
          } else {
            console.log(`array[index] first edit date is not a number. array[index].name`);

          }
        } // end of convertSecondsToDate
        var startDate = convertSecondsToDate(editors[index].firstEditDate);
        var rate = editRate(editors[index]);

        function editRate(rateEditor)
        {
            if (rateEditor.rank !== NaN || rateEditor.editHistory.length !== 0) {
                var period = [7, 30, 60, 90];
                period.forEach(function (element, index, array) {
                  function sumEdits(accumulator, currentValue)
                  {
                    return accumulator + currentValue;
                  }
                  var editHistoryArray = rateEditor.editHistory;
                  var a = editHistoryArray.slice(editHistoryArray.length - element);
                  var b = a.reduce(sumEdits);
                  if (element === 7) {
                      rateEditor.rate = b;
                  }
                  switch (element) {
                    case 7:
                      rateEditor.rate7 = rateEditor.rate
                      break;
                    case 30:
                          rateEditor.rate30 = b;
                          break;
                    case 60:
                        rateEditor.rate60 = b;
                        break;
                    case 90:
                        rateEditor.rate90 = b;
                        break;
                    default:
                        console.log('rate period does not make sense');
                  } // end of switch
              });
            } else {
              console.log(rateEditor.name + ' does not have a valid rank or has no valid edit history.');
            }
        } // end of editRate function
        var mileStr = milestone(editors[index]);

        function milestone(curEditor)
        {
          switch (curEditor.rank) {
            case 1:
              if (curEditor.totalEdits > 1000 && curEditor.rate7 > 0) {
                return curEditor.milestone = 'true, total edits';
              } else if ((curEditor.totalEdits + curEditor.rate7) > 2000) {
                return curEditor.milestone = 'true, edit rate';
              } else if (curEditor.rate7 > 1000) {
                return curEditor.milestone = 'true, edit rate';
              } else if (curEditor.totalEdits > 400 && curEditor.rate7 > 0) {
                return curEditor.milestone = 'initial review';
              } else {
                return curEditor.milestone = 'false';
              }
              break;
            case 2:
              if (curEditor.totalEdits > 20000) {
                return curEditor.milestone = 'true, edits';
              } else if ((curEditor.totalEdits + curEditor.rate30) > 25000) {
                return curEditor.milestone = 'true, edit rate'
              } else {
                return curEditor.milestone = 'false';
              }

              break;
            default:
              return curEditor.milestone = 'false';

          } // end of switch

        } // end of milestone function

        var regionStatus = '';
        if (editors[index].notHomeRegion === true) {
          regionStatus = 'not-home';
        } else {
          regionStatus = 'home';
        }
        var lockStatus = '';
        if (editors[index].rankLocked === true) {
          lockStatus = 'locked';
        } else {
          lockStatus = 'not-locked';
        }
        var AMStatus = '';
        if(editors[index].AM === true) {
            AMStatus = "is-AM";
        } else {
            AMStatus = "Not-AM";
        }
        function numberWithCommas(n) {
              var parts=n.toString().split(".");
              return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
        }
        editors[index].commaTotalEdits = numberWithCommas(editors[index].totalEdits);
        editors[index].commaRateSeven = numberWithCommas(editors[index].rate7);
        editors[index].commaRateThirty = numberWithCommas(editors[index].rate30);
        editors[index].commaRateSixty = numberWithCommas(editors[index].rate60);
        editors[index].commaRateNinety = numberWithCommas(editors[index].rate90);
        editorHTML += '<tr class = "table-rows"><td headers= "name" class = "col1 all-cells"><a class= tbl-link href=https://www.waze.com/user/editor/' +
          editors[index].name + '>' + editors[index].name + "</a>" + '</td><td headers = "level" class = "col2">' + editors[index].rank +
          '</td><td headers = "locked" class = "col3" ><input class = ' + lockStatus + ' type = "checkbox" /><td headers="began" class = "col4">' + startDate + '</td><td headers="total-edits" ' +
          'class = "col5">' + editors[index].commaTotalEdits +
          '</td>' + '<td headers="milestone" class = "col6">' + mileStr + '</td><td headers = "last-edit" class = "col6A">' + editors[index].lastEditDate + '</td><td headers="rate" class = "col7 num">' + 0 + '</td>' +
          '<td headers = "outside-SER" class = "col7A"><input class = ' + regionStatus + ' type = "checkbox" />' +
          '<td headers = "AM" class = "col7B"><input class = ' + AMStatus + ' type = "checkbox" />' +
          '<td headers="msDate" class = "col8">' + editors[index].milliFirstEditDate + '</td></tr>';
      } // end of addStatsToTable

      var closingHTML = '</tbody></table></div>';
      $(".recent-edits-content").remove()
      $('#recent-edits').append(regionEditorsHTML + editorHTML + closingHTML);
      //     $('#header').after(regionEditorsHTML + editorHTML + closingHTML);
      $('.tbl-link').attr('target', '_blank');
      $('.table-area1').css({
//         "display": "inline-block",
//         "max-height": "500px",
//         "overflow": "auto"
      });
      $('#region-table').css({
        "table-layout": "fixed",
  		  //     	"text-align":"left"
        "max-width":"1100px",
        "width":"880px",
        "white-space": "nowrap"
      });
        $('#the-head').css({
            "max-height": "75px",
            "display": "block",
            "margin-bottom": "3px",
            //  		  "overflow": "hidden"
            "border":"2px solid red"
        });
        $('#theTable-body').css({
            "max-height": "500px",
            "margin-bottom": "5px",
            "overflow-y": "auto",
            // 		  "overflow-x": "hidden",
            "display": "block",
            "border": "2px solid black"
        });

      $('.col1').css({
        "width": "120px",
        "min-width":"120px",
        "max-width":"120px",
        "text-align":"left"
      });
      $('#sort-name').css({
          "width": "119px"
      });
      $('.all-cells').css({
        "white-space": "nowrap",
        "overflow": "hidden",
        "text-overflow": "ellipsis"
      });

      $('.col2').css({
        "width": "50px",
        "max-width":"50px",
        "min-width":"50px",
        "text-align":"center"
      });
      $('#sort-level').css({
          "width": "49px"
      });
      $('.col3').css({
        "width":"50px",
        "max-width":"50px",
        "min-width":"50px",
        "text-align":"center"
      });
      $('#sort-locked').css({
          "width": "49px"
      });
      $('.col4').css({
        "width":"100px",
        "max-width":"100px",
        "min-width":"100px",
        "text-align": "center"
      });
      $('#sort-began').css({
          "width": "99px"
      });
      $('.col5').css({
        "width":"100px",
        "max-width":"100px",
        "min-width":"100px",
        "text-align":"center"
      });
      $('#sort-edits').css({
          "width": "99px"
      });
      $('.col6').css({
        "width":"120px",
        "min-width":"120px",
        "max-width":"120px",
        "text-align": "left"
      });
      $('#sort-milestone').css({
          "width": "119px"
      });
      $('.col6A').css({
        "width": "120px",
        "text-align":"right",
        "min-width":"120px",
        "max-width":"120px"
      });
      $('#sort-last-edit-date').css({
          "width": "119px"
      });
      $('.col7').css({
        "width": "100px",
        "text-align":"right",
        "min-width":"100px",
        "max-width":"100px"
      });
      $('#sort-rate').css({
          "width": "99px"
      });
      $('.col7A').css({
        "width": "60px",
        "text-align":"right",
        "min-width":"60px",
        "max-width":"60px"
      });
      $('#sort-outsideSER').css({
          "width": "59px"
      });
      $('.col7B').css({
        "width": "42px",
        "text-align":"right",
        "min-width":"42px",
        "max-width":"42px"
      });
      $('#sort-AMs').css({
          "width": "41px"
      });
      $('.col8').css({
        "width": "0px",
        "display": "none"
      });
      $('.table-rows').css({
        "border": "solid thin"
      });
 //     $('#sort-rate').css('fontSize', '8px');
      $('.columz').attr('title', 'Click to sort.  After the sort is complete, a second click will sort in reverse order.');
      var tbl = document.getElementById("region-table");
      if (tbl != null) {
        for (var i = 1; i < tbl.rows.length; i++) {
          tbl.rows[i].style.cursor = "pointer";
          tbl.rows[i].onmousemove = function() {
            this.style.backgroundColor = "#FFFF00";
            this.style.color = "black";
          };
          tbl.rows[i].onmouseout = function() {
            this.style.backgroundColor = "";
            this.style.color = "";
            $("tr:even").css("background-color", "#CCC");
            $("tr:odd").css("background-color", "#fff");
          };
        }
      } // end of if(tbl !=null)
      $("tr:even").css("background-color", "#CCC");
      $('#total-editors').html(`Total Editors: ${totalEditors} (L1: ${L1Editors}, L2: ${L2Editors}, L3: ${L3Editors}, L4: ${L4Editors}, L5: ${L5Editors}, L6: ${L6Editors})`);
      $('#regions-edits').html(`Total Edits last 90 days... (L1: ${L1Edits.toLocaleString()}, L2: ${L2Edits.toLocaleString()}, L3: ${L3Edits.toLocaleString()}, L4: ${L4Edits.toLocaleString()}, L5: ${L5Edits.toLocaleString()}, L6: ${L6Edits.toLocaleString()}, L7: ${L7Edits.toLocaleString()}, Total Edits: ${sumRegionEdits})`);
      $('.locked').prop('checked', true);
      $('.not-locked').prop('checked', false);
      $('.not-home').prop('checked', true);
      $('.home').prop('checked', false);
      $('.is-AM').prop('checked',true);
      $('.Not-AM').prop('checked',false);
      $('.rate-30').prop('checked',true);
      rateChange();
      $(document).on('change','.rate-7', rateChange);
      $(document).on('change','.rate-30',rateChange);
      $(document).on('change','.rate-60',rateChange);
      $(document).on('change','.rate-90',rateChange);

      function rateChange()
      {
          var whoIndex = 0;
          var names = [];
          var testName ='';
          var rows = document.getElementsByTagName('tr');
          var rowEditorName =[];
          for(i=0; i<rows.length; i ++ ) {
              console.log("i: ", i);
              rowEditorName.push(rows[i].children[0].textContent.toLowerCase().trim()); //add each row editor's name to an array
              console.log(rows[i].children[0].textContent);
          }
          editors.forEach(function (element, index, array)
          {
           testName = (editors[index].name).toLowerCase().trim(); // prep each editors object name for creating an array of editor names
           names.push(testName);
          });
          rowEditorName.forEach(function(element,index,array)
          {
              whoIndex = names.indexOf(rowEditorName[index])  // find index in editors object corresponding to editor name from row
              if(whoIndex < 0 && rowEditorName[index] !== 'name') {
                  alert('Editor: ' + rowEditorName[index] + 'not found in editor object.');
              }
              if(index === 0) {
                  console.log("rowEditorName[0]: ", rowEditorName[index]);
              }
              if(index > 0) {
                  if ($('.rate-7').prop('checked')) {
                      console.log('rate 7');
                      rows[index].children[7].textContent = editors[whoIndex].commaRateSeven;
                  }
                  if ($('.rate-30').prop('checked')) {
                      console.log('rate 30')
                      rows[index].children[7].textContent = editors[whoIndex].commaRateThirty;
                  }
                  if ($('.rate-60').prop('checked')) {
                      console.log('rate 60');
                      rows[index].children[7].textContent = editors[whoIndex].commaRateSixty;
                  }
                  if ($('.rate-90').prop('checked')) {
                      console.log('rate 90');
                      rows[index].children[7].textContent = editors[whoIndex].commaRateNinety;
                  }
              }
          });
      }  // end of rateChange function
      $(document).on('change', '.locked', function()
      {
        if ($(this).prop('checked')) {
          blnLockChange = true;
        } else {
          blnLockChange = true;
        }
        beCareful();
      }); // end of (document).on('change','.locked')
      $(document).on('change', '.not-locked', function()
      {
        if ($(this).prop('checked')) {
          blnLockChange = true;
        } else {
          blnLockChange = true;
        }
        beCareful();
      }); // end of document on change not-locked
      $(document).on('change', '.not-home', function()
      {
        if ($(this).prop('checked')) {
          blnHomeRegionChange = true;
        } else {
          blnHomeRegionChange = true;
        }
        beCareful();
      });
      $(document).on('change', '.home', function() {
        if ($(this).prop('checked')) {
          blnHomeRegionChange = true;
        } else {
          blnHomeRegionChange = true;
        }
        beCareful();
      });
      $(document).on('change','.Not-AM', function()
      {
          console.log('not-Am changed');
        if($(this).prop('checked')) {
            blnIsAM = true;
        } else {
            blnIsAM = true;
        }
        beCareful();
      });
      $(document).on('change', '.is-AM', function()
      {
          console.log('is-am changed');
        if($(this).prop('checked')) {
            blnIsAM = true;
        } else {
            blnIsAM = true;
        }
        beCareful();
      });

      function beCareful() {
        if (alreadyWarned === false) {
          alert('Changes will not be saved unless you click on the appropriate save button before refreshing or leaving this page!');
          alreadyWarned = true;
        }
      }
      var nameAscending = false;
      var levelAscending = false;
      var startAscending = false;
      var totalAscending = false;
      var milestoneAscending = true;
      var rateAscending = false;
      var lockedAscending = false;
      var insideOutsideAsc = false;
      var lastEditAsc = false;
      var AMAscending = false;
      document.getElementById("name").addEventListener("click", function()
      {
        if (nameAscending) {
          nameAscending = false;
        } else {
          nameAscending = true;
        }
        sort(nameAscending, 'col1', 'region-table');
      }, false);
      document.getElementById("level").addEventListener("click", function()
      {
        if (levelAscending) {
          levelAscending = false;
        } else {
          levelAscending = true;
        }
        sort(levelAscending, 'col2', 'region-table');
      }, false);
      document.getElementById("began").addEventListener("click", function()
      {
        if (startAscending) {
          startAscending = false;
        } else {
          startAscending = true;
        }
        sort(startAscending, 'col8', 'region-table');
      }, false);
      document.getElementById("sort-locked").addEventListener("click", function()
      {
        if (lockedAscending) {
          lockedAscending = false;
        } else {
          lockedAscending = true;
        }
        sort(lockedAscending, 'col3', 'region-table');
      }, false);
      document.getElementById("total-edits").addEventListener("click", function()
      {
        if (totalAscending) {
          totalAscending = false;
        } else {
          totalAscending = true;
        }
        sort(totalAscending, 'col5', 'region-table');
      }, false);
      document.getElementById("milestone").addEventListener("click", function()
      {
        if (milestoneAscending) {
          milestoneAscending = false;
        } else {
          milestoneAscending = true;
        }
        sort(milestoneAscending, 'col6', 'region-table');
      }, false);
      document.getElementById("rate").addEventListener("click", function()
      {
        if (rateAscending) {
          rateAscending = false;
        } else {
          rateAscending = true;
        }
        sort(rateAscending, 'col7', 'region-table');
      }, false);
      //last-edit outside-SER
      document.getElementById('last-edit').addEventListener('click', function()
      {
        if (lastEditAsc) {
          lastEditAsc = false;
        } else {
          lastEditAsc = true;
        }
        sort(lastEditAsc, 'col6A', 'region-table');
      }, false);
      document.getElementById('outside-SER').addEventListener('click', function()
      {
        if (insideOutsideAsc) {
          insideOutsideAsc = false;
        } else {
          insideOutsideAsc = true;
        }
        sort(insideOutsideAsc, 'col7A', 'region-table');
      }, false);
      document.getElementById('sort-AMs').addEventListener('click', function ()
      {
          if(AMAscending) {
              AMAscending = false;
          } else {
              AMAscending = true;
          }
          sort(AMAscending, 'col7B', 'region-table');
      }, false);
      function sort(ascending, columnClassName, tableId)
      {
        var tbody = document.getElementById(tableId).getElementsByTagName(
          "tbody")[0];
        var rows = tbody.getElementsByTagName("tr");

        var unsorted = true;

        while (unsorted) {
          unsorted = false;
          for (var r = 0; r < rows.length - 1; r++) {
            var row = rows[r];
            var nextRow = rows[r + 1];
            if (columnClassName !== 'col3') {
              var value = row.getElementsByClassName(columnClassName)[0].innerHTML;
              var nextValue = nextRow.getElementsByClassName(columnClassName)[0].innerHTML;

              value = value.replace(/,/g, ''); // in case a comma is used in float number
              nextValue = nextValue.replace(/,/g, '');

              if (!isNaN(value)) {
                value = parseFloat(value);
                nextValue = parseFloat(nextValue);
              }
            } else { // element is a checkbox
              var chk = row.getElementsByClassName(columnClassName)[0];
              var nextChk = nextRow.getElementsByClassName(columnClassName)[0];
              if (chk.querySelector("input[type=checkbox]") !== null) { // checkbox case
                value = chk.querySelector('input[type=checkbox]').checked;
                nextValue = nextChk.querySelector("input[type=checkbox]").checked;
              }
            } // end of if(columnClassName !== 'col3')
            if (ascending ? value > nextValue : value < nextValue) {
              tbody.insertBefore(nextRow, row);
              unsorted = true;
            }
          } // end of for
        } // end of while
        $("tr:even").css("background-color", "#CCC");
        $("tr:odd").css("background-color", "#fff");
      } //end of sort function

      function storageSave()
      {
        lockedArray = [];
        localStorage.setItem('lockedEditors', JSON.stringify(lockedArray));
        var a = $('.col3 input:checked').map(function() {
          return $(this).closest('tr').find('td:eq(0)').text();
        }).get();
        if (a.length > 0) {
          a.forEach(function(element, index, array) {
            lockedArray.push(array[index]);
          });
        }
        localStorage.setItem('lockedEditors', JSON.stringify(lockedArray));
      } // end of storageSave

    } // end of buildWebDisplay

  } // end of executionSequence
  listenMore();

  function listenMore()
  {
    console.log('listenMore');
    if (blnReadyToBuildTable) {
      console.log('save button loaded');
      blnWrite = true;
      document.getElementById("save-locked").addEventListener("click", handleClientLoad);
      document.getElementById("save-nonRegion").addEventListener("click", handleClientLoad);
      document.getElementById("save-AM").addEventListener("click", handleClientLoad);
    } else {
      setTimeout(function() {
        listenMore();
      }, 10000);
    }
  } // end of listenMore

  function addLockedEditors()
  {
    if (document.getElementById('save-locked') !== null) {
      idLockedEditors();
    } else {
      setTimeout(function() {
        addLockedEditors();
      }, 500);
    }

    function idLockedEditors()
    {
      var pleaseConfirm = false;
      tableUnlockedEditors = [];
      tableLockedEditors = [];
      $.each($("input[class = 'not-locked']:checked"), function() {
        tableLockedEditors.push($(this).closest('tr').find('td:eq(0)').text());
      });
      $.each($("input[class = 'not-locked']:not(:checked"), function() {
        tableUnlockedEditors.push($(this).closest('tr').find('td:eq(0)').text());
      });
      $.each($("input[class = 'locked']:not(:checked)"), function() {
        tableUnlockedEditors.push($(this).closest('tr').find('td:eq(0)').text());
      });
      $.each($("input[class = 'locked']:checked"), function() {
        tableLockedEditors.push($(this).closest('tr').find('td:eq(0)').text());
      });
      var introText = '';
      var moreText = '';
      if (tableLockedEditors.length > 0 && tableUnlockedEditors.length === 0) {
        introText = 'You are about to change the lock status of editors.  With your changes, the following editors will be locked: ' + tableLockedEditors.join(", ") + ".  ";
      }
      if (tableUnlockedEditors.length > 0 && tableLockedEditors.length > 0) {
        introText = 'You are about to change the lock status of editors.  With your changes, the following editors will be locked: ' + tableLockedEditors.join(", ") + ".  ";
        moreText = '';
      } else if (tableUnlockedEditors.length > 0 && tableLockedEditors.length === 0) {
        introText = 'You are about to change the lock status of editors. ';
      }
      var finishText = 'Please do not make these changes unless you are absolutely certain of these editors lock status. Click cancel to remove these changes.  ';
      pleaseConfirm = window.confirm(introText + moreText + finishText);
      var blnMatch = false;
      if (pleaseConfirm) {
        if (tableLockedEditors.length > 0) {
          tableLockedEditors.forEach(function(element, index, array) {
            var test = element.trim();
            test = test.toLowerCase();
            var idx = discordEditors.findIndex(function(element1, index1, array1) {
              if (element1.length > 0) {
                return element1[0] === test;
              } else {
                console.log('When adding lock for ' + test + ', this editor does not have the correct sub-array elements');
              }
            });
            if (idx < 0) {
              console.log('no match for ' + test + 'while adding lock status.');
            } else {
              var testArr = [test, true, discordEditors[idx][2], discordEditors[idx][3]];
              console.log('At tableLocked Editors.length >0, removing ' + discordEditors[idx] + ' and adding ' + testArr);
              discordEditors.splice(idx, 1, testArr);
            }
          }); // end of tableLockedEditors forEach function
        } // end of tableLockedEditors > 0 if statement
        blnMatch = false;
        if (tableUnlockedEditors.length > 0) {

          tableUnlockedEditors.forEach(function(element, index, array) {
            var test = element.trim();
            test = test.toLowerCase();
            var idx = discordEditors.findIndex(function(element1, index1, array1) {
              if (element1.length > 0) {
                return element1[0] === test;
              } else {
                console.log('while removing lock status for ' + test + ', found this editor does not have the correct sub-array elements');
              }
            });
            if (idx < 0) {
              console.log('no match for ' + test + ' while removing lock status.');
            } else {
              var testArr = [test,'', discordEditors[idx][2], discordEditors[idx][3]];
              console.log('At tableUnlocked Editors.length >0, removing ' + discordEditors[idx] + ' and adding ' + testArr);
              discordEditors.splice(idx, 1, testArr);
            }
          }); // end of tableUnlockedEditors forEach function
        } // end of tableUnlockedEditors > 0 if statement
        tableLockedEditors = [];
        tableUnlockedEditors = [];

      } else {
        $('.locked').prop('checked', true);
        $('.not-locked').prop('checked', false);
        tableLockedEditors = [];
        tableUnlockedEditors = [];
      }
    } // end of idLockedEditors
    var valueRangeBody = {
      values: discordEditors
    };
    var params = {
      spreadsheetId: spreadsheetId, //TODO: Update placeholder value.
      range: ssRange,
      valueInputOption: 'RAW'
    };
    var request = gapi.client.sheets.spreadsheets.values.update(params, valueRangeBody);
    console.log('here');
    request.then(function(response) {
      // TODO: Change code below to process the `response` object:
      console.log('response is ' + response.result);
    }, function(reason) {
      console.error('google sheets error: ' + reason.result.error.message);
    });
  } // end of addLockedEditors
  function handleNonRegionEditors() {
debugger;
    if (document.getElementById('save-nonRegion') !== null) {
      idNonRegionEditors();
    } else {
      setTimeout(function() {
        handleNonRegionEditors();
      }, 500);
    }

    function idNonRegionEditors()
    {
      var moveIn = [];
      var moveOut = [];
      var pleaseConfirm = false;
      moveOut = [];
      moveIn = [];
      $.each($("input[class = 'not-home']:not(:checked)"), function() {
        // these are editors moving back into SER as primary region
        moveIn.push($(this).closest('tr').find('td:eq(0)').text());
      });
      $.each($("input[class = 'not-home']:checked"), function() {
        // these are editors moving out of the SER as primary region
        moveOut.push($(this).closest('tr').find('td:eq(0)').text());
      });
      $.each($("input[class = 'home']:checked"), function() {
        // these are editors moving out of the SER as their primary region
        moveOut.push($(this).closest('tr').find('td:eq(0)').text());
      });
      $.each($("input[class = 'home']:not(:checked)"), function() {
        moveIn.push($(this).closest('tr').find('td:eq(0)').text()); // these are editors already in or moving back into the SER as their primary region
      });
      var introText = '';
      var moreText = '';
      if (moveOut.length > 0 && moveIn.length === 0) {
        introText = 'You are about to change the status of editors that edit primarily in the SER.  ';
        moreText = '';
      }
      if (moveIn.length > 0 && moveOut.length > 0) {
        introText = 'You are about to change the status of editors, indicating additional editors that do not edit primarily in the SER. ';
        moreText = 'Additional changes will add editors to the list of those that primarily edit in the SER.  '

      } else if (moveIn.length > 0 && moveOut.length === 0) {
        introText = 'You are about to change the status of editors, indicating additional editors that do not edit primarily in the SER. ';
        moreText = '';
      }
      var finishText = 'Please do not make these changes unless you are absolutely certain of these editors status.  Click cancel to remove these changes.  '
      pleaseConfirm = window.confirm(introText + moreText + finishText);
      var blnMatch = false;
      if (pleaseConfirm) {

        if (moveOut.length > 0) {
          //
          moveOut.forEach(function(element, index, array)
          {
            var test = element.trim();
            test = test.toLowerCase();
            blnMatch = false;
            var idx = discordEditors.findIndex(function(element1, index1, array1) {
              if (element1.length > 0) {
                return element1[0] === test;
              } else {
                console.log('While setting this editor(' + test + ') as a non-region editor, found this editor does not have the correct sub-array elements');
              }
            });
            if (idx < 0) {
              console.log('no match for ' + test + 'while moving this editor outside the region.');
            } else {
              var testArr = [test, discordEditors[idx][1], true, discordEditors[idx][3]];
              console.log('At moveOut.length >0, removing ' + discordEditors[idx] + ' and adding ' + testArr);
              discordEditors.splice(idx, 1, testArr);
            }
          }); // end of notHomeRegion forEach function
        } // end of moveOut.length > 0 if statement
        blnMatch = false;
        if (moveIn.length > 0) {

          moveIn.forEach(function(element, index, array)
     // this code runs each time save button depressed even when there is no change in home-region status.
          {
            var test = element.trim();
            test = test.toLowerCase();
            blnMatch = false;
            var idx = discordEditors.findIndex(function(element1, index1, array1) {
              if (element1.length > 0) {
                return element1[0] === test;
              } else {
                console.log('While setting this editor(' + test + ') as a native to this region, this editor does not have the correct sub-array elements');
              }
            });
            if (idx < 0) {
              console.log('no match for ' + test);
            } else {
              var testArr = [test, discordEditors[idx][1], '', discordEditors[idx][3]];
              console.log('At moveIn.length >0, removing ' + discordEditors[idx] + ' and adding ' + testArr);
              discordEditors.splice(idx, 1, testArr);
            }
          }); // end of  forEach function
        } // end of moveIn.length > 0 if statement
        moveOut = [];
        moveIn = [];
      } else {
        $('.not-home').prop('checked', true);
        $('.home').prop('checked', false);
//        homeRegion = [];
//        notHomeRegion = [];
      } //end // of if(pleaseConfirm)
    } // end of idNonRegionEditors
    var valueRangeBody = {
      values: discordEditors
    };
    var params =
    {
      spreadsheetId: spreadsheetId, //TODO: Update placeholder value.
      range: ssRange,
      valueInputOption: 'RAW'
    };
    var request = gapi.client.sheets.spreadsheets.values.update(params, valueRangeBody);
    console.log('here');
    request.then(function(response)
    {
      // TODO: Change code below to process the `response` object:
      console.log('response is ' + response.result);
    }, function(reason) {
      console.error('google sheets error: ' + reason.result.error.message);
    });
  } // end of handleNonRegionEditors

  function handleAMEditors() {
    if (document.getElementById('save-AM') !== null) {
      idAMEditors();
    } else {
      setTimeout(function() {
        handleAMEditors();
      }, 500);
    }

    function idAMEditors()
    {
      var isAM = [];
      var notAM = [];
      var pleaseConfirm = false;

      $.each($("input[class = 'Not-AM']:not(:checked)"), function() {
        // these editors are not AMs
        notAM.push($(this).closest('tr').find('td:eq(0)').text());

      });
      $.each($("input[class = 'Not-AM']:checked"), function() {
        // these editors are now SER AMs
        isAM.push($(this).closest('tr').find('td:eq(0)').text());
console.log(isAM);
      });
      $.each($("input[class = 'is-AM']:checked"), function() {
        // these are editors that are already SER AMs
        isAM.push($(this).closest('tr').find('td:eq(0)').text());
      });
      $.each($("input[class = 'is-AM']:not(:checked)"), function() {
        notAM.push($(this).closest('tr').find('td:eq(0)').text()); // these are current AMs that are no longer an AM
      });
   console.log('notAM: ' + notAM + '. and isAM: ' + isAM);
      var introText = '';
      var moreText = '';
      if (notAM.length > 0 && isAM.length === 0) {
        introText = 'You are about to change the status of editors assigned as Area Managers (AM) in the SER.  ';
        moreText = '';
      }
//       if (isAM.length > 0 && notAM.length > 0) {
//         introText = 'You are about to change the status of editors, indicating additional editors that do not edit primarily in the SER. ';
//         moreText = 'Additional changes will add editors to the list of those that primarily edit in the SER.  '

//       } else if (isAM.length > 0 && notAM.length === 0) {
//         introText = 'You are about to change the status of editors, indicating additional editors that do not edit primarily in the SER. ';
//         moreText = '';
//       }
      var finishText = 'Please do not make these changes unless you are absolutely certain of these editors status.  Click cancel to remove these changes.  '
      pleaseConfirm = window.confirm(introText + moreText + finishText);
      var blnMatch = false;
      if (pleaseConfirm) {

        if (notAM.length > 0) {
          //
          notAM.forEach(function(element, index, array)
          {
            var test = element.trim();
            test = test.toLowerCase();
            blnMatch = false;
            var idx = discordEditors.findIndex(function(element1, index1, array1) {
              if (element1.length > 0) {
                return element1[0] === test;
              } else {
                console.log('While setting this editor(' + test + ') as a non-region editor, found this editor does not have the correct sub-array elements');
              }
            });
            if (idx < 0) {
              console.log('no match for ' + test + 'while removing SER AM status.');
            } else {
              var testArr = [test, discordEditors[idx][1], discordEditors[idx][2], ''];
              console.log('At notAM.length >0, editor: ' + discordEditors[idx] + ' changed to not an AM');
              discordEditors.splice(idx, 1, testArr);
            }
          }); // end of notAM forEach function
        } // end of notAM.length > 0 if statement
        blnMatch = false;
        if (isAM.length > 0) {
          isAM.forEach(function(element, index, array)
          {
            var test = element.trim();
            test = test.toLowerCase();
            blnMatch = false;
            var idx = discordEditors.findIndex(function(element1, index1, array1) {
              if (element1.length > 0) {
                return element1[0] === test;
              } else {
                console.log('While setting this editor(' + test + ') as an SER AM, this editor does not have the correct sub-array elements');
              }
            });
            if (idx < 0) {
              console.log('no match for ' + test);
            } else {
              var testArr = [test, discordEditors[idx][1], discordEditors[idx][2], true];
              console.log('At isAM.length >0, editor: ' + discordEditors[idx] + ' added as SER AM');
              discordEditors.splice(idx, 1, testArr);
            }
          }); // end of  forEach function
        } // end of isAM.length > 0 if statement
console.log('notAM: ' + notAM);

console.log('is-AM: ' + isAM);
 console.log(discordEditors);
        notAM = [];
        isAM = [];
      } else {
//        $('.is-AM').prop('checked', true);
//        $('.Not-AM').prop('checked', false);
//        homeRegion = [];
//        notHomeRegion = [];
      } // end // of if(pleaseConfirm)
    } // end of idAMEditors


    var valueRangeBody = {
      values: discordEditors
    };
    var params =
    {
      spreadsheetId: spreadsheetId, //TODO: Update placeholder value.
      range: ssRange,
      valueInputOption: 'RAW'
    };
    var request = gapi.client.sheets.spreadsheets.values.update(params, valueRangeBody);
    console.log('here');
    request.then(function(response)
    {
      // TODO: Change code below to process the `response` object:
      console.log('response is ' + response.result);
    }, function(reason) {
      console.error('google sheets error: ' + reason.result.error.message);
    });
  } // end of handleAMEditors

  bootstrap();

})();