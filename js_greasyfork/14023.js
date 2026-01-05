// ==UserScript==
// @name         PR search tool
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  try to take over the world!
// @author       You
// @include      https://prsearch.juniper.net/InfoCenter/index?page=prsearch*
// @require      https://openuserjs.org/src/libs/vlan1/Sheetjs.js
// @require      https://openuserjs.org/src/libs/vlan1/excelplus.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/14023/PR%20search%20tool.user.js
// @updateURL https://update.greasyfork.org/scripts/14023/PR%20search%20tool.meta.js
// ==/UserScript==
/* jshint -W097 */
// Your code here...
function trim(str) {
	str = str.replace(/^(\s|\u00A0)+/, '');
	for (var t = str.length - 1; t >= 0; t--) {
		if (/\S/.test(str.charAt(t))) {
			str = str.substring(0, t + 1);
			break;
		}
	}
	return str;
};

function isBaseReleaseSelected() {
	if ($("#baseRelease option:selected").val() == '') {
		return false;
	} else return true;
}

function Savetocsv() {
	if ($("#platform option:selected").val() == "") {
		alert ('Please select the Platform and Base Relase !');
		return false;
	}
	if ($("#baseRelease option:selected").val() == '') {
		alert('Please select a Base Release version');
		return false;
	}
	var fl = $('textarea')[0].value.split(/[,\n]+/);
	//fl = input1.value.split(/[,\n]+/);
	if (fl[0] == "")  {alert("Please input at least 1 feature!"); return;}    
	var _flen = fl.length;
	for (x=0; x<fl.length; x++) fl[x] = trim(fl[x]);
	var files = new ExcelPlus();
	files.createFile(fl);   
	(function LLoop(t) {
		// codes here
		var qt = fl[t];
		var filename = qt + ".csv";
		bun = document.getElementById('FPT');
		bun.value = "Now processing " + qt.toUpperCase() + "  .............";
		bun.style.cssText = "box-shadow: rgb(230, 122, 115) 0px 39px 0px -24px inset; border-radius: 4px; border: 1px solid rgb(255, 255, 255); display: inline-block; cursor: pointer; color: rgb(255, 255, 255); font-family: Arial; font-size: 15px; padding: 6px 15px; text-decoration: none; text-shadow: rgb(178, 62, 53) 0px 1px 0px; background-color: rgb(228, 104, 93);";
		var pstack = [];
		var tempp = 1;
		var paget;

		function parsecontent(pstack, t, paget, _flen) {
			//files.createFile(qt);
			//files.createSheet(qt, select);
			files.selectSheet(qt);
			files.write({
				//"sheet": qt,
				"content": [
					["Number", "Severity", "Title", "Last Modified"]
				]
			})
			for (z = 0, offsets = 2; z < pstack.length; z++) {
				tem1 = pstack[z].contentList;
				for (y = 0; y < tem1.length; y++) {
					temm2 = [];
					temm2[0] = tem1[y].kbdocid;
					temm2[1] = tem1[y].generic1;
					temm2[2] = tem1[y].title.replace(/[<b></b>]/g, "");//.replace(/"/g, '""');
					temm2[3] = tem1[y].docDateTime;
					files.write({cell:"A"+(offsets + y),content:temm2[0]})
						.write({cell:"B"+(offsets + y),content:temm2[1]})
						.write({cell:"C"+(offsets + y),content:temm2[2]})
						.write({cell:"D"+(offsets + y),content:temm2[3]});
				}
				offsets += tem1.length;
			}
			t++;
			if (t < _flen) {
				LLoop(t);
			} else {
				files.saveAs("demo.xlsx");
				bun.style.cssText = "box-shadow: rgb(62, 115, 39) 0px 10px 14px -7px; border-radius: 4px; border: 1px solid rgb(75, 143, 41); display: inline-block; cursor: pointer; color: rgb(255, 255, 255); font-family: Arial; font-size: 13px; font-weight: bold; padding: 6px 12px; text-decoration: none; text-shadow: rgb(91, 138, 60) 0px 1px 0px; background: linear-gradient(rgb(119, 181, 90) 5%, rgb(114, 179, 82) 100%) rgb(119, 181, 90);"
				document.getElementById('FPT').value = "RUN";
			}
		}

		function con_____stack() {
			var platform = $("#platform option:selected").val();
			var fields = {};
			addDateNav(gp, fields, 'onSubmit');
			var ___stack = {};
			// read keyword
			// read keyword
			//var qt = trim(fl[t]);
			___stack.qt = qt;
			// read base version
			if (isBaseReleaseSelected()) ___stack.bv = getBaseReleaseText();
			else {
				alert('Please select Base Version');
			}
			// read upgrade version
			if (isUpgdReleaseSelected()) ___stack.uv = getUpdgReleaseText();
			// read os
			// No OS //___stack.os = platform;
			// read seriesId
			___stack.sid = platform;
			// read date
			___stack.dt = selectedDate;
			// read mode
			___stack.mode = getSelectedMode()
			// set offset
			if (fields.offset) ___stack.start = fields.offset;
			else ___stack.start = 0;
			// read srtBy
			___stack.srtBy = getSrtBy();
			// selected resolved in 
			if ($("#osVersionNav").length > 0) {

				if (undefined == selectedOS) ___stack.rs = '';
				else ___stack.rs = selectedOS;
			}
			// read navStateList
			if (fields.navStateList) {
				var ns = fields.navStateList;
				var _nsl = [];
				var k = 0;
				for (i = 0; i < ns.length; i++) {

					var nsml = ns[i].modList;

					for (j = 0; j < nsml.length; j++) {

						var _g = '';
						if ('familynavigator' == ns[i].enName) {
							_g = '_001';
						}
						if ('junosversionnav' == ns[i].enName) {
							_g = '_002';
						}
						if ('junoseversionnav' == ns[i].enName) {
							_g = '_003';
						}
						if ('featuregroupnav' == ns[i].enName) {
							_g = '_004';
						}
						if ('generic1nav' == ns[i].enName) {
							_g = '_005';
						}
						if ('docdatetimenavigator' == ns[i].enName) {
							_g = '_006';
						}
						if ('generic2nav' == ns[i].enName) {
							_g = '_007';
						}
						_nsl.push(_g + '!' + ns[i].enAttrib + '!' + nsml[j].emValue + '!' + ns[i].include);
						k++;
					}
				}
				var __nsl = _nsl.join('|');
				if (__nsl && __nsl != '') {

					___stack.nsl = __nsl;
				}
			}
			return ___stack;
		}

		function monit() {
			if (tempp == paget) {
				clearInterval(idd);
				parsecontent(pstack, t, paget, _flen);
			}
		}

		function _postJsonDataSearchSvc(__stack, frmMthd) {

			//var  = data;
			//if (!__stack.os) $("#platform").val('junos');
			//else $("#platform").val(__stack.os);
			// Base version is required for FAST Service
			if ($.isEmptyObject(__stack) || !__stack.bv) return false;

			$.jsonp({
				url: qrurl,
				data: {
					sJson: JSON.stringify(__stack)
				},
				dataType: "jsonp",
				callbackParameter: "callback",
				timeout: 50000,
				success: function(p, status) {
					pstack.push(p);
					tempp++;
				},
				error: function(xOptions, textStatus) {
					// alert(errorThrown);
					//$.AjaxLoader.RemoveImageObject();
					if (textStatus == 'timeout') {
						window.location.replace(errorURL);
					}
				}
			})
		}
		setTimeout((function() {
			var ___stack, data;
			___stack = con_____stack();
			data = ___stack;
			//step 3
			$.jsonp({
				url: qrurl,
				data: {
					sJson: JSON.stringify(data)
				},
				dataType: "jsonp",
				callbackParameter: "callback",
				timeout: 100000,
				success: function(p, status) {
					//$.AjaxLoader.RemoveImageObject();
					//gp.navStateList = p.navStateList;
					p.viewName = "gnatssppublished";
					if (p.numResults > 0) {
						paget = parseInt(p.numResults / 50 + 1);
						if (paget > 1) {
							pstack.push(p);
							for (var z = 2; z < paget + 1; z++) {
								___stack.start = ((z - 1) * 50).toString();
								_postJsonDataSearchSvc(___stack);
							}
							idd = setInterval(monit, 1000);
						} else {
							//clearInterval(idd);
							pstack.push(p);
							parsecontent(pstack, t, paget, _flen);
						}
					} else {
						paget = 0;
					}
				},
				error: function(xOptions, textStatus) {
					//alert(errorThrown);                    
					alert("No result found for " + qt);
					files.deleteSheet(qt);
					t++;
					if (t < _flen) {
						LLoop(t);
					} else {
						files.saveAs("demo.xlsx");
						bun.style.cssText = "box-shadow: rgb(62, 115, 39) 0px 10px 14px -7px; border-radius: 4px; border: 1px solid rgb(75, 143, 41); display: inline-block; cursor: pointer; color: rgb(255, 255, 255); font-family: Arial; font-size: 13px; font-weight: bold; padding: 6px 12px; text-decoration: none; text-shadow: rgb(91, 138, 60) 0px 1px 0px; background: linear-gradient(rgb(119, 181, 90) 5%, rgb(114, 179, 82) 100%) rgb(119, 181, 90);"
						document.getElementById('FPT').value = "RUN";
					}
					if (textStatus == 'timeout') {
						window.location.replace(errorURL);
					}
				}
			})
			//return paget;
		})(), 2000)
	})(0);
}


$(window).load(function() {
	var input1 = document.createElement('textarea');
	input1.name = 'post';
	input1.maxLength = '5000';
	input1.cols = '70';
	input1.rows = '4';
	input1.style.fontFamily = 'Verdana'
	input1.placeholder = 'Please input Comma-separated feature list (e.g. "ospf, bgp, vpn")';
	var bun_RtA = document.createElement("input");
	bun_RtA.type = "button";
	bun_RtA.value = "RUN";
	bun_RtA.name = 'Test';
	bun_RtA.id = "FPT"
	bun_RtA.style.cssText = "box-shadow: rgb(62, 115, 39) 0px 10px 14px -7px; border-radius: 4px; border: 1px solid rgb(75, 143, 41); display: inline-block; cursor: pointer; color: rgb(255, 255, 255); font-family: Arial; font-size: 13px; font-weight: bold; padding: 6px 12px; text-decoration: none; text-shadow: rgb(91, 138, 60) 0px 1px 0px; background: linear-gradient(rgb(119, 181, 90) 5%, rgb(114, 179, 82) 100%) rgb(119, 181, 90);"
	bun_RtA.onclick = Savetocsv;
	$('.gradientContainer')[0].appendChild(bun_RtA);
	document.getElementsByName('prsearch')[0].appendChild(input1);
});
