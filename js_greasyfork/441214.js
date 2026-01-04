// ==UserScript==
// @name         Tactical Map Load
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Load Hyperiums Tactical Map Extension
// @author       You
// @match        *://*.hyperiums.com/servlet/Maps?maptype=tactical*
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441214/Tactical%20Map%20Load.user.js
// @updateURL https://update.greasyfork.org/scripts/441214/Tactical%20Map%20Load.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const setBtn = async function () {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.text = "async function updateDisplay(url) {" +
        "return await fetch(url).then(function(response) {" +
        "return response.text();" +
            "}).then(function(html) {" +
            "var parser = new DOMParser();" +
            "var doc = parser.parseFromString(html, 'text/html');" +
            "var returnArray = new Array();" +
            "var tbls = doc.querySelector('#tacForm > table > tbody > tr:nth-child(2) > td:nth-child(3) > div').getElementsByClassName('nopadding');" +
            "for (var i = 0; i < tbls.length; i++) {" +
	           "var tempArray = new Array();" +
	           "var planetName = tbls[i].querySelector('tbody > tr > td:nth-child(2) > table:nth-child(1) > tbody > tr:nth-child(1) > td:nth-child(1)');" +
	           "if (planetName == null) { tempArray['PlanetNm'] = ''; }else { tempArray['PlanetNm'] = planetName.innerText; };" +
	           "var mFlags = tbls[i].querySelectorAll('tbody > tr > td:nth-child(2) > table:nth-child(1) > tbody > tr:nth-child(1) > td:nth-child(2) > table > tbody > tr > td');" +
	           "for (var j = 0; j < mFlags.length; j++) {" +
	           	"var r1 = mFlags[j].innerText;" +
	           	"switch ( j ) { " +
	           	    "case 0: " +
	           	    "if (r1 == '') { tempArray['FlagBattle'] = 'Defending'; }else { tempArray['FlagBattle'] = r1; };" +
	           	    "break;" +
	           	    "case 1: " +
	           	    "if (r1 == '') { tempArray['FlagBlockade'] = 'No Blockade'; }else { tempArray['FlagBlockade'] = r1; };" +
	           	    "break;" +
	           	    "case 2: " +
	           	    "if (r1 == '') { tempArray['FlagStasis'] = 'No Stasis'; }else { tempArray['FlagStasis'] = r1; };" +
	           	    "break;" +
	           	"};" +
	           "};" +
	           "var ergytbls = tbls[i].querySelector('tbody > tr > td:nth-child(2) > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2)').innerText;" +
	           "if (ergytbls == '') { tempArray['Energy'] = '??/??'; }else { tempArray['Energy'] = ergytbls.replace(/(\\r\\n|\\n|\\r|\\t)/gm, '').split(':')[1]; };" +
	           "var fltbls = tbls[i].querySelectorAll('tbody > tr > td:nth-child(2) > table.bars');" +
	           "for (var j = 0; j < fltbls.length; j++) {" +
	           	"var tempText = fltbls[j].innerText.replace(/(\\r\\n|\\n|\\r)/gm, '').replace(/(\\t)/gm, ' ');" +
	           	"var bartbls = fltbls[j].querySelectorAll('tbody > tr > td > table.bar');" +
	           	"for (var k = 0; k < bartbls.length; k++) {" +
	           	   "tempText = tempText.replace(bartbls[k].innerText, '');" +
	            "};" +
	           	"var r1 = tempText.split(':');" +
	           	"console.log(tempText);" +
	           	//"var r1 = fltbls[j].innerText.replace(fltbls[j].querySelector('tbody > tr > td:last-child').innerText, '').replace(/(\\r\\n|\\n|\\r)/gm, '').replace(/(\\t)/gm, ' ').split(':');" +
	           	"tempArray[r1[0]] = r1[1].trim();" +
	           "};" +
	           "console.log(tempArray);" +
	           "returnArray[i] =  tempArray;" +
            "};" +
            "return returnArray;" +
            "}).catch(function(err){" +
        "console.warn('Something went wrong.', err);" +
            "});" +
    "};";

    document.getElementsByTagName('head')[0].appendChild(script);

    var myTableDiv = document.getElementsByTagName("body");
    var table = document.createElement('TABLE');
    var tableBody = document.createElement('TBODY');

    tableBody.id = 'Load_Table_Body';
    table.border = '1';
    table.id = 'Load_Table';
    table.style.cssText = "margin-bottom: 50px;";
    table.appendChild(tableBody);

    var heading = new Array();
    heading[0] = "PlanetNm";
    heading[1] = "FlagBattle";
    heading[2] = "FlagBlockade";
    heading[3] = "FlagStasis";
    heading[4] = "Energy";
    heading[5] = "Space AvgP";
    heading[6] = "Ground AvgP";
    heading[7] = "Enemy space AvgP";
    heading[8] = "Enemy ground AvgP";
    heading[9] = "c/p";

    var tr = document.createElement('TR');
    tableBody.appendChild(tr);
    for (i = 0; i < heading.length; i++) {
        var th = document.createElement('TH');
        th.width = '75';
        th.appendChild(document.createTextNode(heading[i]));
        tr.appendChild(th);
    }

    var eleb = document.createElement("br");
    table.appendChild(eleb);

    myTableDiv[0].appendChild(table);

    var loadingTableEle = document.createElement('span');
    loadingTableEle.id = "tmpLoadingStatus";
    loadingTableEle.classList.add("tmpLoadingStatus");

    var textinputx = document.createElement('input');
    textinputx.id = "x-cord";
    textinputx.value = "";
    textinputx.type = "text";
    textinputx.style.cssText = "width: 50px;";
    textinputx.classList.add("thin");

    var textinputy = document.createElement('input');
    textinputy.id = "y-cord";
    textinputy.value = "";
    textinputy.type = "text";
    textinputy.style.cssText = "width: 50px;";
    textinputy.classList.add("thin");

    var distvalues = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    var textinputdist = document.createElement('select');
    textinputdist.id = "xy-dist";
    textinputdist.name = "Dist";
    textinputdist.size = "1";
    textinputdist.classList.add("thin");

    for (const val of distvalues) {
        var distoption = document.createElement("option");
        distoption.value = val;
        distoption.text = val;
        textinputdist.appendChild(distoption);
      };

    var btnxy = document.createElement('input');
    btnxy.value = 'Load Fleet Status';
    btnxy.id = 'btnUpdateXY';
    btnxy.type = 'button';
    btnxy.classList.add("button");

    btnxy.addEventListener('click', async function (e) {
		  e.preventDefault()

		  var anchors = document.getElementsByTagName("a");
          var distcord = document.getElementById("xy-dist").value;

          var xcord = document.getElementById("x-cord").value;
          var xarray = [];
          for(var xi = parseInt(xcord) - parseInt(distcord); xi <= parseInt(xcord) + parseInt(distcord); xi++) {xarray.push(xi);};

          var ycord = document.getElementById("y-cord").value;
          var yarray = [];
          for(var yi = parseInt(ycord) - parseInt(distcord); yi <= parseInt(ycord) + parseInt(distcord); yi++) {yarray.push(yi);};

          var tmpTimerArray = new Array(),
              tmpStartTime = Date.now(),
              tmpCounter = 0,
              tmpMaxCounter = yarray.length * xarray.length;

          var updatingStatusBar = document.querySelector("#tacForm > table > tbody > tr:nth-child(1) > td > div > div:nth-child(7) > span");
          updatingStatusBar.innerText = 'Loading... ' + tmpCounter + '0/' + tmpMaxCounter;

		  for (var i = 0; i < anchors.length; i++) {
			  if(anchors[i].href.includes('Maps?tm=')) {
			  	  var tmpxycord = anchors[i].innerText;
			      if( xarray.includes(parseInt(tmpxycord.substring(tmpxycord.lastIndexOf("(") + 1, tmpxycord.lastIndexOf(",")))) && yarray.includes(parseInt(tmpxycord.substring(tmpxycord.lastIndexOf(",") + 1, tmpxycord.lastIndexOf(")")))) ) {
                      var tmpRunTime = Date.now();
                      var tmpRunCount3 = (tmpCounter > 2) ? tmpTimerArray[tmpCounter - 3] : tmpRunTime;
                      var tmpRunCount30 = (tmpCounter > 29) ? tmpTimerArray[tmpCounter - 30] : tmpRunTime;

                      tmpTimerArray[tmpCounter] = tmpRunTime;
                      updatingStatusBar.innerText = 'Loading... ' + tmpCounter + '/' + tmpMaxCounter;

                      if((tmpRunTime - tmpRunCount3) > 0 && (tmpRunTime - tmpRunCount3) < 1000) {
                          updatingStatusBar.innerText = 'Loading... ' + tmpCounter + '/' + tmpMaxCounter + ' Wait(' + (1000 - (tmpRunTime - tmpRunCount3)) + ')';
                          await new Promise(resolve => setTimeout(resolve, 1000 - (tmpRunTime - tmpRunCount3)));
                      }else if ((tmpRunTime - tmpRunCount30) > 0 && (tmpRunTime - tmpRunCount30) < 60000) {
                          updatingStatusBar.innerText = 'Loading... ' + tmpCounter + '/' + tmpMaxCounter + ' Wait(' + (60000 - (tmpRunTime - tmpRunCount30)) + ')';
                          await new Promise(resolve => setTimeout(resolve, 60000 - (tmpRunTime - tmpRunCount30)));
                      };

                      var url = anchors[i].href;
                      updateDisplay(url).then(response => {
			            var myTableBody = document.getElementById("Load_Table_Body");
			            for (var i = 0; i < response.length; i++) {

			              var tr = document.createElement('TR');
			              myTableBody.appendChild(tr);

			              var curRow = document.getElementById("Load_Table_Body").querySelectorAll("tr").length;

						  for (var j = 0; j < 10; j++) {
							var td = document.createElement('TD');

							var colNm = myTableBody.querySelector("tr:nth-child(1) > th:nth-child(" + (j + 1) +")").innerText;

							if(colNm in response[i]) {
                                var colVal = response[i][colNm];
                                if((colNm == 'Space AvgP') || (colNm == 'Ground AvgP') || (colNm == 'Enemy space AvgP') || (colNm == 'Enemy ground AvgP')) {
                                    td.appendChild(document.createTextNode(colVal));
                                } else{
                                    td.appendChild(document.createTextNode(colVal));
                                }
							} else if (colNm == 'c/p') {
								var tempEle = document.getElementById("Load_Table_Body").querySelectorAll("tr:nth-child(" + curRow + ") > td");
								var tempEleStr = tempEle[0].innerText + " / F: " + tempEle[5].innerText + "/" + tempEle[5].innerText + " / E: " + tempEle[7].innerText + "/" + tempEle[8].innerText + " / " + tempEle[4] .innerText+ " / *" + tempEle[3].innerText + "* [" + tempEle[1].innerText.substring(0, 3).toUpperCase() + "]"
								td.appendChild(document.createTextNode(tempEleStr));
							}else{
								td.appendChild(document.createTextNode('0'));
							};
							tr.appendChild(td);
						  };

			            };
		              });
                      tmpCounter++
			      };
			  };
		  };
          updatingStatusBar.innerText = 'Complete... ' + tmpMaxCounter + '/' + tmpMaxCounter;
	  }, false);

    var btnall = document.createElement('input');
    btnall.value = 'Load Fleet Status with Enemy';
    btnall.id = 'btnUpdateAll';
    btnall.type = 'button';
    btnall.classList.add("button");

    btnall.addEventListener('click', async function (e) {
		  e.preventDefault()

		  var anchors = document.getElementsByTagName("a");

          var tmpTimerArray = new Array(),
              tmpStartTime = Date.now(),
              tmpCounter = 0,
              tmpMaxCounter = document.querySelectorAll("div.avgpLeft").length;

          var updatingStatusBar = document.querySelector("#tacForm > table > tbody > tr:nth-child(1) > td > div > div:nth-child(7) > span");
          updatingStatusBar.innerText = 'Loading... ' + tmpCounter + '0/' + tmpMaxCounter;

		  for (var i = 0; i < anchors.length; i++) {
			  if(anchors[i].href.includes('Maps?tm=')) {
			  	  var anchordivparent = anchors[i].closest('div.tacMap');
			      if( $(anchordivparent).find('div.avgpLeft').length ) {
                      var tmpRunTime = Date.now();
                      var tmpRunCount3 = (tmpCounter > 2) ? tmpTimerArray[tmpCounter - 3] : tmpRunTime;
                      var tmpRunCount30 = (tmpCounter > 29) ? tmpTimerArray[tmpCounter - 30] : tmpRunTime;

                      tmpTimerArray[tmpCounter] = tmpRunTime;
                      updatingStatusBar.innerText = 'Loading... ' + tmpCounter + '/' + tmpMaxCounter;

                      if((tmpRunTime - tmpRunCount3) > 0 && (tmpRunTime - tmpRunCount3) < 1000) {
                          updatingStatusBar.innerText = 'Loading... ' + tmpCounter + '/' + tmpMaxCounter + ' Wait(' + (1000 - (tmpRunTime - tmpRunCount3)) + ')';
                          await new Promise(resolve => setTimeout(resolve, 1000 - (tmpRunTime - tmpRunCount3)));
                      }else if ((tmpRunTime - tmpRunCount30) > 0 && (tmpRunTime - tmpRunCount30) < 60000) {
                          updatingStatusBar.innerText = 'Loading... ' + tmpCounter + '/' + tmpMaxCounter + ' Wait(' + (60000 - (tmpRunTime - tmpRunCount30)) + ')';
                          await new Promise(resolve => setTimeout(resolve, 60000 - (tmpRunTime - tmpRunCount30)));
                      };

                      var url = anchors[i].href;
                      updateDisplay(url).then(response => {
			            var myTableBody = document.getElementById("Load_Table_Body");
			            for (var i = 0; i < response.length; i++) {

			              var tr = document.createElement('TR');
			              myTableBody.appendChild(tr);

			              var curRow = document.getElementById("Load_Table_Body").querySelectorAll("tr").length;

						  for (var j = 0; j < 10; j++) {
							var td = document.createElement('TD');

							var colNm = myTableBody.querySelector("tr:nth-child(1) > th:nth-child(" + (j + 1) +")").innerText;

							if(colNm in response[i]) {
                                var colVal = response[i][colNm];
                                if((colNm == 'Space AvgP') || (colNm == 'Ground AvgP') || (colNm == 'Enemy space AvgP') || (colNm == 'Enemy ground AvgP')) {
                                    td.appendChild(document.createTextNode(colVal));
                                } else{
                                    td.appendChild(document.createTextNode(colVal));
                                }
							} else if (colNm == 'c/p') {
								var tempEle = document.getElementById("Load_Table_Body").querySelectorAll("tr:nth-child(" + curRow + ") > td");
								var tempEleStr = tempEle[0].innerText + " / F: " + tempEle[5].innerText + "/" + tempEle[5].innerText + " / E: " + tempEle[7].innerText + "/" + tempEle[8].innerText + " / " + tempEle[4] .innerText+ " / *" + tempEle[3].innerText + "* [" + tempEle[1].innerText.substring(0, 3).toUpperCase() + "]"
								td.appendChild(document.createTextNode(tempEleStr));
							}else{
								td.appendChild(document.createTextNode('0'));
							};
							tr.appendChild(td);
						  };

			            };
		              });
                      tmpCounter++
			      };
			  };
		  };
          updatingStatusBar.innerText = 'Complete... ' + tmpMaxCounter + '/' + tmpMaxCounter;
	  }, false);

    var divxy = document.createElement('div');
    divxy.style = "margin-left: 50px; float: left;";
    divxy.append('X:', textinputx);
    divxy.append(' Y:', textinputy);
    divxy.append(' Dist:', textinputdist);
    divxy.append('   ', btnxy);
    divxy.append('   ', btnall);
    divxy.append('   ', loadingTableEle);

    document.querySelector("#tacForm > table > tbody > tr:nth-child(1) > td > div").append(divxy);

    var btn = document.createElement('input');
    btn.value = 'Export to Excel';
    btn.id = 'btnUpdate';
    btn.type = 'button';
    btn.classList.add("button");

    btn.addEventListener('click', function (e) {
        e.preventDefault();

        var data_type = 'data:application/vnd.ms-excel';
        var table_div = document.getElementById('Load_Table');
        var table_html = table_div.outerHTML.replace(/ /g, '%20');

        var a = document.createElement('a');
        a.href = data_type + ', ' + table_html;
        a.download = 'exported_table_' + Math.floor(Math.random() * 9999999 + 1000000) + '.xls';
        a.click();
    }, false);

    //var divbtn1 = document.createElement('div');
    //divbtn1.style = "margin-left: 50px; float: left;";
    //divbtn1.append(btn);

    var btn3 = document.createElement('input');
    btn3.value = 'Copy to Post';
    btn3.id = 'btnPost';
    btn3.type = 'button';
    btn3.classList.add("button");

    btn3.addEventListener('click', async function (e) {
        e.preventDefault();

        var table_div = document.getElementById('Load_Table');
        var l = table_div.rows.length;

		var table_def = '### DEF ###\n--\n';
		var table_att = '### ATT ###\n--\n';
		var table_noenemy = '### SAFE ###\n--\n';

		for (var i = 1; i < l; i++) {
		    var tr = table_div.rows[i];
            var cll = tr.cells[9];

		    if ( tr.cells[1].innerHTML == 'Attacking' ){
		    	table_att += cll.innerHTML + '\n';
		    }else if ( (tr.cells[7].innerHTML == '0' && tr.cells[8].innerHTML == '0') && tr.cells[1].innerHTML == 'Defending' ) {
		    	table_noenemy += cll.innerHTML + '\n';
		    }else {
		    	table_def += cll.innerHTML + '\n';
		    }
		}

        var table_html = table_att + '\n' + table_def + '\n' + table_noenemy;

        var forumId = document.getElementById("forum-select").value;
        console.log(forumId);
		var newPostWin = window.open(window.location.origin + '/servlet/Forums?action=faddmsg&forumid='+forumId+'&threadid=0', '_blank');

        newPostWin.addEventListener('load', function() {
        	newPostWin.document.querySelector("#msgAreaId").innerHTML = table_html;
        }, true);
    }, false);

    var forumelements = document.querySelector("#forumSubmenu > ul").getElementsByTagName("a");
    var tempForumArray = new Array();

    for (var fi = 1; fi < forumelements.length; fi++) {
        if (forumelements[fi].text != null) {
            var params = new URL(forumelements[fi].href).searchParams;
            if ((params.get('forumid') != null) && (forumelements[fi].text != 'HD forum')) {
                tempForumArray[forumelements[fi].text] = params.get('forumid');
            };
        };
    };

    var textinputforum = document.createElement('select');
    textinputforum.id = "forum-select";
    textinputforum.name = "forum-select";
    textinputforum.size = "1";
    textinputforum.classList.add("thin");

    for (const val1 in tempForumArray) {
        console.log(val1, tempForumArray[val1]);
        var forumoption = document.createElement("option");
        forumoption.value = tempForumArray[val1];
        forumoption.text = val1;
        textinputforum.appendChild(forumoption);
    };

    var divbtn2 = document.createElement('div');
    divbtn2.style = "margin-left: 50px; float: left; width: 600px;";
    divbtn2.append(textinputforum, ' ', btn3, ' ', btn);

    //document.getElementById("Load_Table").prepend(divbtn1);
    document.getElementById("Load_Table").prepend(divbtn2);

    var anchors = document.getElementsByTagName("a");

    for (var i = 0; i < anchors.length; i++) {
        if(anchors[i].href.includes('Maps?tm=')) {
          var btn2 = document.createElement('input');
          var url = anchors[i].href;

          btn2.type = 'button';
          btn2.value = anchors[i].innerText;
          btn2.id = url;
          btn2.type = 'button';
          btn2.classList.add("button");

          btn2.addEventListener('click', async function (e) {
              e.preventDefault()
              var tempURL = this.id;

              updateDisplay(tempURL).then(response => {
                var myTableBody = document.getElementById("Load_Table_Body");
                for (var i = 0; i < response.length; i++) {
                  var tr = document.createElement('TR');
                  myTableBody.appendChild(tr);

                  var curRow = document.getElementById("Load_Table_Body").querySelectorAll("tr").length;
                  for (var j = 0; j < 10; j++) {
                  	var td = document.createElement('TD');
                  	var colNm = myTableBody.querySelector("tr:nth-child(1) > th:nth-child(" + (j + 1) +")").innerText;
                    if(colNm in response[i]) {
                        var colVal = response[i][colNm];
                        if((colNm == 'Space AvgP') || (colNm == 'Ground AvgP') || (colNm == 'Enemy space AvgP') || (colNm == 'Enemy ground AvgP')) {
                            td.appendChild(document.createTextNode(colVal));
                        } else{
                            td.appendChild(document.createTextNode(colVal));
                        }
                    }else if (colNm == 'c/p') {
                    	var tempEle = document.getElementById("Load_Table_Body").querySelectorAll("tr:nth-child(" + curRow + ") > td");
                    	var tempEleStr = tempEle[0].innerText + " / F: " + tempEle[5].innerText + "/" + tempEle[5].innerText + " / E: " + tempEle[7].innerText + "/" + tempEle[8].innerText + " / " + tempEle[4] .innerText+ " / *" + tempEle[3].innerText + "* [" + tempEle[1].innerText.substring(0, 3).toUpperCase() + "]"
						td.appendChild(document.createTextNode(tempEleStr));
                    }else{
                    	td.appendChild(document.createTextNode('0'));
                    };
                    tr.appendChild(td);
                  };

                };
              });
          }, false);

          anchors[i].parentNode.appendChild(btn2);

          console.log("Appended Map Btn:" + anchors[i].href);
        };
    };
  };

  setBtn();
})();