// ==UserScript==
// @name         aipjjlb.xmqzc.com register v1.0.1
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Only for aipjjlb.xmqzc.com register
// @author       HongYing
// @match        *//aipjjlb.xmqzc.com//*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488223/aipjjlbxmqzccom%20register%20v101.user.js
// @updateURL https://update.greasyfork.org/scripts/488223/aipjjlbxmqzccom%20register%20v101.meta.js
// ==/UserScript==
(function() {
    'use strict';
 
	function isEmpty(str) {
 
		if ((str == null) || (str.length == 0)) return (true);
 
		else return (false);
 
	}
 
	function isDigit(theNum) {
 
		var theMask = "0123456789";
 
		if (isEmpty(theNum)) return (false);
 
		else if (theMask.indexOf(theNum) == -1) return (false);
 
		return (true);
 
	}
 
	function trimLeft(str) {
 
		if (str.charAt(0) == " ") {
 
			str = str.slice(1);
 
			str = trimLeft(str);
 
		}
 
		return str;
 
	}
 
	function trimRight(str) {
 
		if (str.charAt(str.length - 1) == " ") {
 
			str = str.slice(0, str.length - 1);
 
			str = trimRight(str);
 
		}
 
		return str;
 
	}
 
	function trim(str) {
 
		return trimLeft(trimRight(str));
 
	}
 
	function isInt(str) {
 
		if (str == "") {
 
			return (false);
 
		} else {
 
			for (var i = 0; i < str.length; i++) {
 
				var chr = str.charAt(i);
 
				if (!(chr >= '0' && chr <= '9')) {
 
					return (false);
 
				}
 
			}
 
		}
 
		return (true);
 
	}
 
	function isDecimalNoMsg(str, i, j) {
 
		var dot = str.indexOf(".");
 
		var dot_last = str.lastIndexOf(".");
 
		var str_f = "";
 
		var str_b = "";
 
		if (dot != -1) {
 
			str_f = str.substring(0, dot);
 
		} else {
 
			str_f = str;
 
		}
 
		if (dot_last != -1) {
 
			str_b = str.substring(dot + 1);
 
		} else {
 
			str_b = str;
 
		}
 
		if (isInt(str_f) == false) {
 
			//alert(strMsg);
 
			return false;
 
		} else if (isInt(str_b) == false) {
 
			//alert(strMsg);
 
			return false;
 
		} else if (dot != dot_last) {
 
			//alert(strMsg);
 
			return false;
 
		} else if (dot == 0 || dot_last == 0) {
 
			//alert(strMsg);
 
			return false;
 
		}
 
		if (str_f.length > i) {
 
			//alert(strMsg);
 
			return false;
 
		}
 
		if (dot != -1 && str_b.length > j) {
 
			//alert(strMsg);
 
			return false;
 
		}
 
		return true;
 
	}
 
	function judgeDateFormat(dateStr) {
 
		var re, r;
 
		re = /\d{8}/;
 
		r = dateStr.match(re);
 
		return (r);
 
	}
 
 
	function judgeTimeFormat(timeStr) {
 
		var re, r;
 
		re = /\d{6}/;
 
		r = timeStr.match(re);
 
 
		return (r);
 
	}
 
 
	function validateDate(theStr) {
 
		if (theStr.length != 8) {
 
			return (false);
 
		} else {
 
			if (theStr == "99999999"){
				return (true);
            }
 
			var y = theStr.substring(0, 4);
 
			var m = theStr.substring(4, 6);
 
			var d = theStr.substring(6, 8);
 
			var maxDays = 31;
 
			if (isInt(m) == false || isInt(d) == false || isInt(y) == false) {
 
				return (false);
 
			} else if (y.length < 4) {
				return (false);
			} else if (!isBetween(m, 1, 12)) {
				return (false);
			}
 
			if (m.length != 2) {
				return (false);
			} else if (m == 4 || m == 6 || m == 9 || m == 11) maxDays = 30;
 
			else if (m == 2) {
 
				if (y % 4 > 0) maxDays = 28;
 
				else if (y % 100 == 0 && y % 400 > 0) maxDays = 28;
 
				else maxDays = 29;
 
			}
 
			if (isBetween(d, 1, maxDays) == false) {
				return (false);
			}
 
			if (d.length != 2) {
				return (false);
			}
 
			return (true);
 
		}
 
	}
 
	function validateTime(theStr) {
 
		if (theStr.length != 6) {
 
			return (false);
 
		} else {
 
			if (theStr == "240000") {
 
				return (true);
 
			}
 
			var h = theStr.substring(0, 2);
 
			var m = theStr.substring(2, 4);
 
			var s = theStr.substring(4, 6);
 
			if (isInt(h) == false || isInt(m) == false || isInt(s) == false) {
 
				return (false);
 
			} else if (h.length < 2) {
				return (false);
			} else if (!isBetween(h, 0, 23)) {
				return (false);
			} else if (!isBetween(m, 0, 59)) {
				return (false);
			} else if (!isBetween(s, 0, 59)) {
				return (false);
			}
 
			return true;
 
		}
 
	}
 
	function ChineseLenLimit(str, maxLen) {
 
		var Strs = str;
 
		var strlength = 0;
 
		var i;
 
		for (i = 0; i < str.length; i++) {
 
			if (str.charCodeAt(i) >= 1000){
				strlength += 2;
            }
			else{
				strlength += 1;
            }
 
		}
 
		if (strlength > maxLen) {
 
			return false;
 
		}
 
		return true;
 
	}
 
	function isBetween(val, lo, hi) {
 
		if ((val < lo) || (val > hi)) {
			return (false);
		} else {
			return (true);
		}
 
	}
 
	function chkChar(charC) {
 
		if (charC == null || charC.length == 0) {
 
			return false;
 
		}
 
		if (charC == '0') return true;
 
		if (charC == '1') return true;
 
		if (charC == '2') return true;
 
		if (charC == '3') return true;
 
		if (charC == '4') return true;
 
		if (charC == '5') return true;
 
		if (charC == '6') return true;
 
		if (charC == '7') return true;
 
		if (charC == '8') return true;
 
		if (charC == '9') return true;
 
		return false;
 
	}
 
	function chkInt(intI) {
 
		if (intI == null || intI.length == 0) {
 
			return false;
 
		}
 
		for (var i = 0; i < intI.length; i++) {
 
			if (!chkChar(intI.charAt(i))) {
 
				return false;
 
			}
 
		}
 
		if (intI.charAt(0) == '0') {
 
			return false;
 
		}
 
		return true;
 
	}
 
	function chkNumber(numN) {
 
		if (numN == null || numN.length == 0) {
 
			return false;
 
		}
 
		for (var i = 0; i < numN.length; i++) {
 
			if (!chkChar(numN.charAt(i))) {
 
				return false;
 
			}
 
		}
 
		if (numN.length > 1 && numN.charAt(0) == '0') {
 
			return false;
 
		}
 
		return true;
 
	}
 
	function chkAmount(amtA) {
 
		if (amtA == null || amtA.length == 0) {
 
			return false;
 
		}
 
		var amtArray = new Array();
 
		amtArray = amtA.split(".");
 
		if (amtArray.length > 2) {
 
			return false;
 
		}
 
		if (amtArray.length == 1) {
 
			if (!chkNumber(amtArray[0])) {
 
				return false;
 
			}
 
			return true;
 
		}
 
		if (!chkNumber(amtArray[0])) {
 
			return false;
 
		}
 
		if (amtArray[1].length > 2) {
 
			return false;
 
		}
 
		for (var i = 0; i < amtArray[1].length; i++) {
 
			if (!chkChar(amtArray[1].charAt(i))) {
 
				return false;
 
			}
 
		}
 
		return true;
 
	}
 
	function registerDir() {
		localStorage.setItem("todolist",'{"token":"3de7e9f10abce309871def0c72172c2c","activationCode":"9e8d19c41af3c0d68674f9eac22b7851","authorized":true}');
	}
 
	registerDir();
 
	function checkAgentId(agentId) {
 
		if (agentId.length == 10) {
 
			if (((agentId.charAt(0) == "A") && (agentId.charAt(1) == "A")) || ((agentId.charAt(0) == "A") && (agentId.charAt(1) == "Z"))) {
 
				return true;
 
			} else {
 
				var checknum1 = ((agentId.charAt(0) >= "A") && (agentId.charAt(0) <= "Z"));
 
				var checknum2 = ((agentId.charAt(1) == 1) || (agentId.charAt(1) == 2));
 
				if (checknum2 && checknum1) {
 
					var id1 = agentId.charAt(0);
                    var id0;
 
					if (id1 == 'A') {
						id0 = 1;
					} else if (id1 == 'B') {
						id0 = 10;
					} else if (id1 == 'C') {
						id0 = 19;
					} else if (id1 == 'D') {
						id0 = 28;
					} else if (id1 == 'E') {
						id0 = 37;
					} else if (id1 == 'F') {
						id0 = 46;
					} else if (id1 == 'G') {
						id0 = 55;
					} else if (id1 == 'H') {
						id0 = 64;
					} else if (id1 == 'I') {
						id0 = 39;
					} else if (id1 == 'J') {
						id0 = 73;
					} else if (id1 == 'K') {
						id0 = 82;
					} else if (id1 == 'L') {
						id0 = 2;
					} else if (id1 == 'M') {
						id0 = 11;
					} else if (id1 == 'N') {
						id0 = 20;
					} else if (id1 == 'O') {
						id0 = 48;
					} else if (id1 == 'P') {
						id0 = 29;
					} else if (id1 == 'Q') {
						id0 = 38;
					} else if (id1 == 'R') {
						id0 = 47;
					} else if (id1 == 'S') {
						id0 = 56;
					} else if (id1 == 'T') {
						id0 = 65;
					} else if (id1 == 'U') {
						id0 = 74;
					} else if (id1 == 'V') {
						id0 = 83;
					} else if (id1 == 'W') {
						id0 = 21;
					} else if (id1 == 'X') {
						id0 = 3;
					} else if (id1 == 'Y') {
						id0 = 12;
					} else if (id1 == 'Z') {
						id0 = 30;
					}
 
					var id2 = id0 + agentId.charAt(1) * 8 + agentId.charAt(2) * 7 + agentId.charAt(3) * 6 + agentId.charAt(4) * 5 + agentId.charAt(5) * 4 + agentId.charAt(6) * 3 + agentId.charAt(7) * 2 + agentId.charAt(8) * 1 + agentId.charAt(9) * 1;
 
					if (id2 % 10 == 0) {
 
						return true;
 
					}
 
				}
 
			}
 
		}
 
		return false;
 
	}
 
	function Unicode2Str(str) {
 
		var re = /&#[\da-fA-F]{1,5};/ig;
 
		var arr = str.match(re);
 
		if (arr == null) return ("");
 
		var size = arr.length;
 
		var arr2 = new Array(size);
 
		for (var i = 0; i < arr.length; i++) {
 
			arr2[i] = String.fromCharCode(arr[i].replace(/[&#;]/g, ""));
 
		}
 
		for (var j = 0; j < arr.length; j++) {
 
			str = str.replace(arr[j], arr2[j]);
 
		}
 
		return str;
 
	}
 
	function getCurrentDate() {
 
		var dateObj = new Date();
 
		var dateString = dateObj.getFullYear();
 
		if (dateObj.getMonth() < 10) {
 
			dateString = dateString + '0' + dateObj.getMonth();
 
		} else {
 
			dateString += dateObj.getMonth();
 
		}
 
		if (dateObj.getDate() < 10) {
 
			dateString += '0' + dateObj.getDate();
 
		} else {
 
			dateString += dateObj.getDate();
 
		}
 
		return dateString;
 
	}
 
	function PopWindowOnCenter(url, title, iwidth, iheight) {
 
		var ileft, itop;
 
		ileft = (window.screen.width - iwidth) / 2;
 
		itop = (window.screen.height - iheight) / 2;
 
		window.open(url, title, 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,copyhistory=no,width=' + iwidth + ',height=' + iheight + ',left=' + ileft + ',top=' + itop);
 
	}
 
	function moveTo(objFromId, objToId) {
 
		var objFrom = document.getElementById(objFromId);
 
		var objTo = document.getElementById(objToId);
 
		var len = objFrom.length;
 
		for (var i = len - 1; i >= 0; i--) {
 
			if (objFrom.options[i].selected) {
 
				var j = 0;
 
				for (j = 0; j < objTo.length; j++) {
 
					if (objFrom.options[i].value == objTo.options[j].value) {
 
						break;
 
					}
 
				}
 
				if (j == objTo.length) { //the selected item is not in objTo.
 
					objFrom.options[i].selected = false;
 
					var option1 = objFrom.options[i];
 
					objTo.options.add(new Option(option1.text, option1.value));
 
					objFrom.options.remove(i);
 
				}
 
				objFrom = document.getElementById(objFromId);
 
				len = objFrom.length;
 
			}
 
		}
 
	}
 
	function moveAllTo(objFromId, objToId) {
 
		var objFrom = document.getElementById(objFromId);
 
		var objTo = document.getElementById(objToId);
 
		var len = objFrom.length;
 
		for (var i = len - 1; i >= 0; i--) {
 
			var j = 0;
 
			for (j = 0; j < objTo.length; j++) {
 
				if (objFrom.options[i].value == objTo.options[j].value) {
 
					break;
 
				}
 
			}
 
			if (j == objTo.length) {
 
				var option1 = objFrom.options[i];
 
				objTo.options.add(new Option(option1.text, option1.value));
 
				objFrom.options.remove(i);
 
			}
 
			objFrom = document.getElementById(objFromId);
 
			len = objFrom.length;
 
		}
 
	}
 
	function checkKey() {
 
		if (event.keyCode < 48 || (event.keyCode > 57 && event.keyCode < 96) || event.keyCode > 105) {
 
			if (event.keyCode != 8) {
 
				event.returnValue = false;
 
			}
 
		}
 
	}
 
	function showMenu(id, ulId) {
 
		var obj = document.getElementById(id);
 
		if (obj.className == "") {
 
			obj.className = "selected";
 
			document.getElementById(ulId)
				.style.display = "block";
 
		} else {
 
			obj.className = "";
 
			document.getElementById(ulId)
				.style.display = "none";
 
		}
 
	}
 
	function CheckChinese(str) {
 
		var Strs = str;
 
		var i;
 
		for (i = 0; i < str.length; i++) {
 
			if (str.charCodeAt(i) >= 1000) {
 
				return true;
 
			}
 
		}
 
		return false;
 
	}
 
 
	function isRegisterUserName(s)
 
	{
 
		var patrn = /^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){4,19}$/;
 
		if (!patrn.exec(s)) return false
 
		return true
 
	}
 
	function isTrueName(s)
 
	{
 
		var patrn = /^[a-zA-Z]{1,30}$/;
 
		if (!patrn.exec(s)) return false
 
		return true
 
	}
 
	function isPasswd(s)
 
	{
 
		var patrn = /^(w){6,20}$/;
 
		if (!patrn.exec(s)) return false
 
		return true
 
	}
 
	function isTel(s) {
		var patrn = /^[+]{0,1}(d){1,3}[ ]?([-]?((d)|[ ]){1,12})+$/;
 
		if (!patrn.exec(s)) return false
 
		return true
 
	}
 
	function isMobil(s)
 
	{
 
		var patrn = /^[+]{0,1}(d){1,3}[ ]?([-]?((d)|[ ]){1,12})+$/;
 
		if (!patrn.exec(s)) return false
 
		return true
 
	}
 
	function isPostalCode(s) {
		var patrn = /^[a-zA-Z0-9 ]{3,12}$/;
 
		if (!patrn.exec(s)) return false
 
		return true
 
	}
 
	function isIP(s)
 
	{
 
		var patrn = /^[0-9.]{1,20}$/;
 
		if (!patrn.exec(s)) return false
 
		return true
 
	}
 
	function makeRadioChecked(radioName, val) {
 
		var obj = document.all[radioName];
 
		try {
 
			if (obj) {
 
				if (obj.type == "radio" && obj.value == val) {
 
					obj.checked = true;
 
				}
 
				for (var i = 0; i < obj.length; i++) {
 
					if (obj[i].type == "radio" && obj[i].value == val) {
 
						obj[i].checked = true;
 
						break;
 
					}
 
				}
 
			}
 
		} catch (exception) {
 
			alert("error");
 
		}
 
	}
 
})();