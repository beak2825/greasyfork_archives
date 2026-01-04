// ==UserScript==
// @name           Referrals comments for NeoBux.
// @description    Add comment to each referral to help in your referral management.
// @include        https://www.neobux.com/c/rl/*
// @license        GNU General Public License v3.0
// @version        1.1.130150.3
// @grant          GM_deleteValue
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_log
// @grant          GM_xmlhttpRequest
// @noframes
// @namespace https://greasyfork.org/users/152867
// @downloadURL https://update.greasyfork.org/scripts/33240/Referrals%20comments%20for%20NeoBux.user.js
// @updateURL https://update.greasyfork.org/scripts/33240/Referrals%20comments%20for%20NeoBux.meta.js
// ==/UserScript==
try {

	if (!window.showModalDialog) {
		window.showModalDialog = function(arg1, arg2, arg3) {
			var w;
			var h;
			var resizable = "no";
			var scroll = "no";
			var status = "no";

			// get the modal specs
			if (arg3) {
				var mdattrs = arg3.split(";");
				for (i = 0; i < mdattrs.length; i++) {
					var mdattr = mdattrs[i].split(":");

					var n = mdattr[0];
					var v = mdattr[1];
					if (n) {
						n = n.trim().toLowerCase();
					}
					if (v) {
						v = v.trim().toLowerCase();
					}

					if (n == "dialogheight") {
						h = v.replace("px", "");
					} else if (n == "dialogwidth") {
						w = v.replace("px", "");
					} else if (n == "resizable") {
						resizable = v;
					} else if (n == "scroll") {
						scroll = v;
					} else if (n == "status") {
						status = v;
					}
				}
			}

			var left = window.screenX + (window.outerWidth / 2) - (w / 2);
			var top = window.screenY + (window.outerHeight / 2) - (h / 2);
			var targetWin = window.open(arg1, arg1, 'dependent=1, toolbar=no, location=no, directories=no, status=' + status + ', menubar=no, scrollbars=' + scroll + ', resizable=' + resizable + ', copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
			targetWin.moveTo(20000,20000);
			targetWin.focus();
			console.log(targetWin);
			return targetWin;
		};
	}
	// window.onload = function () {
	var
	defineComment = [
		"",
		"Define a comment for ",
		"Defina uma comentário para "
	],
		GM,
		iconGrey = "data: image/png;base64,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",
		iconRed = "data: image/png;base64,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",
		root = "greasemonkey.scriptvals.http://userscripts.org/users/173064/Referrals comments for NeoBux.",
		version = "1.1.130119.1240";
	//alert("test");
	GM = {
		deleteValue: (function() {
			if (typeof GM_deleteValue === "function" &&
				(typeof GM_deleteValue.toString !== "function" ||
				 GM_deleteValue.toString().indexOf("is not supported") === -1)) {
				return function(name) {
					return GM_deleteValue(name);
				};
			} else if (typeof localStorage === "object" &&
					   typeof localStorage.removeItem === "function") {
				return function(name) {
					name = root + name;
					return localStorage.removeItem(name);
				};
			}
		})(),
		getValue: (function() {
			var testString;
			if (typeof GM_getValue === "function" &&
				(typeof GM_getValue.toString !== "function" ||
				 GM_getValue.toString().indexOf("is not supported") === -1)) {
				testString = "test" + (new Date()).getTime();
				if (GM_getValue(testString, testString) === testString) {
					return function(name, defaultValue) {
						return GM_getValue(name, defaultValue);
					};
				} else {
					return function(name, defaultValue) {
						var value;
						value = GM_getValue(name, defaultValue);
						if (value === undefined) {
							return defaultValue;
						} else {
							return value;
						}
					};
				}
			} else if (typeof localStorage === "object" &&
					   typeof localStorage.getItem === "function") {
				return function(name, defaultValue) {
					var value;
					name = root + name;
					value = localStorage.getItem(name);
					if (value === null) {
						return defaultValue;
					} else {
						return value;
					}
				};
			} else {
				return function(name, defaultValue) {
					return defaultValue;
				};
			}
		})(),
		setValue: (function() {
			if (typeof GM_setValue === "function" &&
				(typeof GM_setValue.toString !== "function" ||
				 GM_setValue.toString().indexOf("is not supported") === -1)) {
				return function(name, value) {
					return GM_setValue(name, value);
				};
			} else if (typeof localStorage === "object" &&
					   typeof localStorage.setItem === "function") {
				return function(name, value) {
					name = root + name;
					return localStorage.setItem(name, value);
				};
			} else {
				return function(name, value) {};
			}
		})(),
		log: (function() {
			if (typeof GM_log === "function" &&
				(typeof GM_log.toString !== "function" ||
				 GM_log.toString().indexOf("is not supported") === -1)) {
				return function(message) {
					return GM_log(message);
				};
			} else if (typeof console === "object" &&
					   typeof console.log === "function") {
				return function(message) {
					return console.log(message);
				};
			} else {
				return function(message) {};
			}
		})()
	};

	function selectNode(documento, xpathExpression) {
		return documento.evaluate(xpathExpression, documento, null,
								  XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	}

	function selectNodes(documento, xpathExpression) {
		var
		i,
			nodes,
			snapshot;
		snapshot = documento.evaluate(xpathExpression, documento, null,
									  XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		nodes = new Array(snapshot.snapshotLength);
		for (i = 0; i < snapshot.snapshotLength; i += 1) {
			nodes[i] = snapshot.snapshotItem(i);
		}
		return nodes;
	}

	function createStyle(icon) {
		return "white-space: nowrap; text-align: left; " +
			"letter-spacing: 0px; word-spacing: 0px; cursor: pointer; " +
			"background: url('" + icon + "') no-repeat right;";
	}

	function createToolTipScript(userName, comment) {
		return "new mk_tt('info_" + userName + "', 'right', unescape('" +
			escape(comment) + "'));";
	}

	function hideToolTip() {
		var tip;
		tip = document.getElementById("tiptip_holder");
		if (tip) {
			tip.style.display = "none";
		}
	}

	function createEventListener(userName) {
		return function() {
			var
			cell,
				comment,
				icon,
				newScript,
				oldScript;
			setTimeout(hideToolTip, 1000);
			comment = window.prompt(defineComment[0] + userName + ":",
									GM.getValue(userName, ""));
			if (comment !== null) {
				cell = window.top.document.getElementById("info_" + userName);
				newScript = window.top.document.createElement("script");
				if (cell.parentNode.getElementsByTagName("script").length > 0) {
					oldScript = cell.parentNode.getElementsByTagName("script")[0];
					cell.parentNode.removeChild(oldScript);
					if (oldScript.textContent.indexOf("mk_tt") > -1) {
						newScript.textContent =
							"jQuery(window.top.document.getElementById('info_" +
							userName + "')).unbind('hover');";
					}
				}
				if (comment !== "") {
					icon = iconRed;
					GM.setValue(userName, comment);
					newScript.textContent += createToolTipScript(
						userName, comment);
				} else {
					icon = iconGrey;
					GM.deleteValue(userName);
				}
				cell.setAttribute("style", createStyle(icon));
				if (newScript.textContent) {
					cell.parentNode.appendChild(newScript);
				}
			}
		};
	}

	function insertScriptVersion() {
		var
		cell,
			span;
		cell = selectNode(document, "//body/div[1]/div[1]/table[1]/tbody/tr[2]/td[2]");
		span = document.createElement("span");
		span.setAttribute("style", "font-size: 9px !important;");
		span.innerHTML =
			"<a class='cinza' style='font-size: 9px;' " +
			"href='http://userscripts.org/scripts/show/81157'>" +
			"<span style='color: #000000'>Referrals comments for NeoBux</span> " + version +
			"</a>    ";
	}

	function ubarPos() {
		var script;
		script = document.createElement("script");
		script.textContent = "try { ubar_pos(0); } catch(e) { }";
		selectNode(document, "//body").appendChild(script);
	}

	function passRows(mainTable, page) {
		var par = window.opener.document;
		parrows = selectNode(par, "//td[@class='bgt']/ancestor::tbody[1]");
		//alert(mainTable.rows.length);
		for (var i = 0; i < mainTable.rows.length; i++) {
			//alert("i="+i+"; num="+mainTable.rows[i].cells[0].textContent);
			if (i === 0) {
				mainTable.removeChild(mainTable.rows[i]);
			} else {
				if (mainTable.rows[i].cells[1] !== undefined) {
					replaceIdIcon(mainTable.rows[i].cells[1], page - 1);
				}

				parrows.appendChild(mainTable.rows[i].cloneNode(true));
			}
		}
		return parrows.rows;
	}

	function sortTableRows(mainTable,compareFunction) {
		rows = Array.prototype.splice.call(mainTable.rows, 0);
		rows.sort(compareFunction);

		while (mainTable.hasChildNodes()) {
			mainTable.removeChild(mainTable.firstChild);
		}
		for (i = 0; i < rows.length; i += 1) {
			table.appendChild(rows[i]);
		}
	}
	var numRefPage;
	var media;

	function main() {
		var		cells,
			comment,
			i,
			icon,
			language,
			languageIndex,
			mainTable,
			menuContainer,
			menuContainerWidth,
			n,
			newWidth,
			nodesSnapshot,
			row,
			rows,
			script,
			sortArrowTable,
			sortArrowDisplayStyles,
			table,
			userName,
			userNameCell,
			userNameColumn;
		sortArrowDisplayStyles = new Array(7);
		setTimeout(function() {
			if (window.location.href.indexOf("www.neobux.com/c/rl") != -1)
				window.location.reload();
		}, 300000);
		for (i = 0; i < 7; i += 1) {
			sortArrowTable = document.getElementById("sort_" + (i + 1));
			if (sortArrowTable) {
				sortArrowDisplayStyles[i] = sortArrowTable.style.display;
				sortArrowTable.style.display = "";
			}
		}
		insertScriptVersion();
		languageIndex = document.body.innerHTML.indexOf("c0 f-") + 5;
		if (languageIndex > 4) {
			language = document.body.innerHTML.substring(languageIndex,
														 languageIndex + 2).toUpperCase();
		} else {
			language = "US";
		}
		if (language === "PT") {
			defineComment[0] = defineComment[2];
		} else {
			defineComment[0] = defineComment[1];
		}
		if (document.location.toString().indexOf("ss3=1") > -1) {
			userNameColumn = 1;
		} else {
			userNameColumn = 2;
		}
		mainTable = selectNode(document, "//td[@class='bgt']/ancestor::tbody[1]");
		if (mainTable === null) {
			return;
		}
		var suppddd;
		var k = 0;
		var parrows;
		suppddd = selectNodes(document, "//span[@class='f_b']");
		var numRef = suppddd[0].textContent;
		var index = window.location.toString().indexOf('sp=');
		var page;
		if (index == -1)
			page = 1;
		else {
			var urlpage = window.location.toString().substr(index);
			var ampIndex = urlpage.indexOf("&");
			if (ampIndex == -1) {
				page = parseInt(urlpage.substr(3));
			} else {
				page = parseInt(urlpage.substr(3, ampIndex - 3));
			}
		}
		console.log("page=" + page + "numRef=" + numRef);
		mainTable.removeChild(mainTable.rows[mainTable.rows.length - 1]);
		mainTable.removeChild(mainTable.rows[mainTable.rows.length - 2]);
		rows = mainTable.rows;
		if (document.getElementById("rlpp"))
			numRefPage = document.getElementById("rlpp").value;
		else
			numRefPage = 30;

		callCheckMedia();
		//media = 54942/59537;

		/*if (parseInt(numRef)-page*numRefPage>0){
        /*if(page>1){
        rows = passRows(mainTable,page);
        }
        newModal(page+1);
        }*/
		if (page == 1) {
			/*for(i = page;parseInt(numRef)-i*numRefPage>0;i++){
            newModal(i+1);
            }*/
			var i = 1;
			var res;
			var aperto = false;
			var nInterval = 0;
			var myInterval = setInterval((function() {
				if (!aperto) {
					res = newModal(i + 1);
					aperto = true;
				} else {
					console.log(res);
					if (res.closed) {
						i++;
						aperto = false;
						if (parseInt(numRef) - i * numRefPage <= 0) {
							clearInterval(myInterval);
							var arrayScad=main2(mainTable, numRef, userNameColumn, sortArrowDisplayStyles);
							console.log(arrayScad);

							arrayScad.sort(function(a, b){
								var a1= a.scad, b1= b.scad;

								if(a1== b1){
									a1=a.pos;
									b1=b.pos;
									if(a1== b1){
										return 0;
									}
									return a1> b1? 1: -1;
								}
								return a1> b1? 1: -1;
							});
							var arrTR = $(mainTable).find('> tr');
							var mapped =  $.map(arrTR,function(el, i) {
								return { index: i, value: el };
							});
							mapped.sort(function(a, b){
								var a1= a.index, b1= b.index;
								if(a1==0) return -1;
								if(b1==0) return 1;
								if(a1==1) return -1;
								if(b1==1) return 1;
								for(var i = 0;i<arrayScad.length;i++)
								{
									if(arrayScad[i].pos==a1)return -1;
									if(arrayScad[i].pos==b1)return 1;
								}
								return 0;
							});
							//console.log(mapped);
							var result = mapped.map(function(el,i){
								try{
									arrTR[el.index].cells[0].innerText=((i%2)==0&&i!=0?i/2:"");
								}catch(e){}
								return arrTR[el.index];
							});
							//console.log(result);
							//console.log(arrayScad);
							$(result).appendTo($(mainTable));
						}
					}
				}
				nInterval++;
				console.log(nInterval);
			}), 1000);

		} else {
			rows = passRows(mainTable, page);
			window.close();
		}
	}

	function main2(mainTable, numRef, userNameColumn, sortArrowDisplayStyles) {
		rows = mainTable.rows;
		n = rows.length;
        //alert(selectNode(document, "//*[@id=\"t_saldo\"]"));
		var nextthursday = nextThursday();
		var lastthursday = new Date(nextthursday.getFullYear(), nextthursday.getMonth(), nextthursday.getDate() - 7);
		var numricicli = 0;
		var refscadnow = 0;
		var refscad7 = 0;
		var refscad14 = 0;
		var refscad21 = 0;
		var refscad28 = 0;
		var refscad35 = 0;
		var refscad42 = 0;
		var refscad49 = 0;
		var refscad56 = 0;
		var refscad63 = 0;
		var totalGuadagno = 0;
		var elemPareggio = 0;
		var guadagnoRiciclo = 0;
		var elemGuadagno = 0;
        var clickGuadagnatiRiciclo;
		var today;
		var clicktoday = 0;
		var arrayScad= new Array();
        var daRiciclare= "";
        var arrNextRicicled = new Array();
        var oldArrNextRicicled = GM.getValue("arrNextRicicled");

		//parseInt(numRef)-page*100;
		if (true) {
			console.log("numero refferal = " + numRef);
			var date = new Date();
			var truncdate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
			var daydiff2 = Math.round((nextthursday.getTime() - truncdate.getTime()) / 86400000);
			console.log("giorni mancanti = " + daydiff2);
			var arrDayScad = new Map();
			for (i = 0; i < n; i += 1) {
				if (i === 0) {
					var td = document.createElement("td");
					var text = document.createTextNode("Click ideali");
					td.appendChild(text);
					td.className = "bgt";
					rows[i].appendChild(td);
					td = document.createElement("td");
					text = document.createTextNode("Avg click week");
					td.appendChild(text);
					td.className = "bgt";
					rows[i].appendChild(td);
					td = document.createElement("td");
					text = document.createTextNode("par riciclo");
					td.appendChild(text);
					td.className = "bgt";
					rows[i].appendChild(td);
				} else if (rows[i].getAttribute("class") !== null) {
					var daterow = convertiData(rows[i].cells[3].textContent);
					//console.log("daterow[" + i + "]=" + daterow);
					var date_diff = Math.round(Math.abs(nextthursday.getTime() - daterow.getTime()) / 86400000);
					//console.log("date_diff[" + i + "]=" + date_diff);
					var datescad = convertiData(rows[i].cells[4].textContent);
					//console.log("convertiData[" + i + "](" + rows[i].cells[4].textContent + ")");
					//console.log("datescad[" + i + "]=" + datescad);
					var dataInizio = convertiData(rows[i].cells[3].textContent);
					//console.log("dataInizio[" + i + "]=" + dataInizio);
					if (rows[i].cells[5].textContent.search("Today") != -1)
						clicktoday++;
					date = new Date();
					var whenRef = Math.abs(date.getTime() - convertiData2(rows[i].cells[3].textContent).getTime()) / 86400000;
					//console.log("whenRef[" + i + "]=" + whenRef);
					var whenRef2 = Math.abs(date.getTime() - convertiData2(rows[i].cells[3].textContent).getTime()) / 86400000 + 1.5;
					//console.log("whenRef2[" + i + "]=" + whenRef2);
					truncdate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
					var daydiff = Math.round((datescad.getTime() - truncdate.getTime()) / 86400000);
					var daydiffexact = Math.abs(convertiData2(rows[i].cells[4].textContent).getTime() - date.getTime()) / 86400000;
					//console.log("daydiff[" + i + "]=" + daydiff);
					var daydiffInizio = Math.round((truncdate.getTime() - dataInizio.getTime()) / 86400000);
					//console.log("daydiffInizio[" + i + "]=" + daydiffInizio);
					var date_diff2 = Math.round((nextthursday.getTime() - datescad.getTime()) / 86400000);
					//console.log("date_diff2[" + i + "]=" + date_diff2);
					if (date_diff2 < 4 && date_diff2 >= -3) {
						refscadnow++;
					}
					if (date_diff2 + 3 < 0 && date_diff2 + 3 >= -7) {
						refscad7++;
					}
					if (date_diff2 + 10 < 0 && date_diff2 + 10 >= -7) {
						refscad14++;
					}
					if (date_diff2 + 17 < 0 && date_diff2 + 17 >= -7) {
						refscad21++;
					}
					if (date_diff2 + 24 < 0 && date_diff2 + 24 >= -7) {
						refscad28++;
					}
					if (date_diff2 + 31 < 0 && date_diff2 + 31 >= -7) {
						refscad35++;
					}
					if (date_diff2 + 38 < 0 && date_diff2 + 38 >= -7) {
						refscad42++;
					}
					if (date_diff2 + 45 < 0 && date_diff2 + 45 >= -7) {
						refscad49++;
					}
					if (date_diff2 + 52 < 0 && date_diff2 + 52 >= -7) {
						refscad56++;
					}
					if (date_diff2 + 59 < 0 && date_diff2 + 59 >= -7) {
						refscad63++;
					}

					rows[i].cells[3].innerHTML = rows[i].cells[3].textContent + " [" + whenRef.toFixed(2) + "]";
					rows[i].cells[4].innerHTML = rows[i].cells[4].textContent + " [" + daydiffexact.toFixed(2) + "]";
					if (rows[i].cells[4].getAttribute("style") !== null)
						rows[i].cells[4].removeAttribute("style");
					td = document.createElement("td");
					td.style.borderTop = "1px solid #aaa";
					td.style.borderRight = "1px solid #aaa";
					var newYearDate = new Date(2019, 0, 1);
					var diffDateNewYear = Math.abs(newYearDate.getTime() - date.getTime()) / 86400000;
					var coeff = (365 - diffDateNewYear) / 365;
					//console.log("coeff=" + coeff);
					var idealNumClick = (whenRef * media * (1.50 + coeff)).toFixed(2);
					var ggPareggio = 9/((media * (1.50 + coeff))-media);
					text = document.createTextNode(idealNumClick);
					td.appendChild(text);
					rows[i].appendChild(td);

					userNameCell = rows[i].cells[userNameColumn];
					userName = userNameCell.textContent.replace(
						/^\s*(\S*(\s+\S+)*)\s*$/, "$1");
					numClick = parseInt(rows[i].cells[6].textContent.replace(/(^\s*)|(\s*$)/g, ""));
					if(daydiffInizio<5 || (daydiffInizio<10 && numClick !=0)) rows[i].style.display='none';
					var pareggioRiciclo = 7 * media / (numClick - media * whenRef);


					var mediaclick = numClick / whenRef;
					var mediaclickdayafter = numClick / whenRef2;
					var clickIdeal = whenRef * media;
					rows[i].cells[7].innerHTML = mediaclick.toPrecision(5);
					rows[i].removeAttribute("onmouseover");
					rows[i].removeAttribute("onmouseout");

					td = document.createElement("td");
					td.style.borderTop = "1px solid #aaa";
					var avgclickobject;
					var len = lastthursday.toLocaleDateString().length;
					if (daydiff2 == 7) {
						if (GM.getValue(userName + "_thursday") === undefined || GM.getValue(userName + "_thursday").substr(0, len) != date.toLocaleDateString()) {
							GM.setValue(userName + "_thursday", date.toLocaleDateString() + ": " + numClick);
						}
					}
					//console.log(GM.getValue(userName+"_thursday").substr(len+2));
					if (GM.getValue(userName + "_thursday") === undefined)
						avgclickobject = 0;
					else {
						avgclickobject = (numClick - parseInt(GM.getValue(userName + "_thursday").substr(len + 2))) / (8 - daydiff2);
						// console.log("avgclickobject[" + i + "]=(" + numClick + "-" + parseInt(GM.getValue(userName + "_thursday").substr(len + 2)) + ")/(8-" + daydiff2 + ")")
					}

					text = document.createTextNode(avgclickobject.toPrecision(5));
					td.appendChild(text);
					rows[i].appendChild(td);
					var td2 = document.createElement("td");
					td2.style.borderTop = "1px solid #aaa";
					if (pareggioRiciclo <= 0)
						pareggioRiciclo = "mai";
					else
						pareggioRiciclo = pareggioRiciclo.toPrecision(5);
					var clickGuadagnati = numClick - clickIdeal - 7;
					var pareggio = 10;
					var timeToRicicle = "";
					var timeToRicicle2 = "";
					/*if (GM.getValue(userName+"_pareggio")!==undefined && clickGuadagnati>pareggio-1.75){*/
					timeToRicicle = "|";
					//var r=(clickGuadagnati-(pareggio-1.75))/media/30;
					//var r = (Math.sqrt(16 * Math.pow(media, 2) * Math.pow(diffDateNewYear, 2) + (32 * whenRef - 43800) * Math.pow(media, 2) * diffDateNewYear + (16 * Math.pow(whenRef, 2) - 43800 * whenRef + 29975625) * Math.pow(media, 2) + (58400 * numClick + 116800) * media) + 4 * media * diffDateNewYear + (-4 * whenRef - 5475) * media) / (8 * media * 30);
					var r =(Math.sqrt(4 * Math.pow(media, 2) * Math.pow(diffDateNewYear, 2) + (8 * whenRef - 7300) * Math.pow(media, 2) * diffDateNewYear + (4 * Math.pow(whenRef, 2) - 7300 * whenRef + 3330625) * Math.pow(media, 2)	+ (5840 * numClick + 11680) * media) + 2 * media * diffDateNewYear + (-2 * whenRef - 1825) * media)/(4 * media * 30);

                    var obj ={"pos":i,"scad":r};
					arrayScad.push(obj);
					obj ={"pos":i+1,"scad":r};
					arrayScad.push(obj);
					var r2 = r * 30;
					var rappriciclo ="";
                    /*if(numClick==0 && whenRef>6)
                    {
                       eval(mainTable.rows[i].cells[1].children[0].onclick);
                       var redFlag = selectNode(document, "//div[@id='chtdiv']");
                       alert(redFlag);
                       //$(redFlag).trigger("click");
                    }*/
                    mainTable.rows[i].cells[1].children[0].onclick();
                    var flag="";

                    if(selectNode(document, "//*[@id='chtdiv']/img[@src='/imagens/flag6.gif']"))
                    {
                        //alert(rows[i].cells[5].textContent);
                        if((rows[i].cells[5].textContent.search("No clicks yet") != -1 && whenRef>13) || Math.abs(truncdate.getTime() - convertiData2(rows[i].cells[5].textContent).getTime())/ 86400000>=13) arrNextRicicled.push({name:rows[i].cells[2].textContent,earn:(clickGuadagnati+7)*0.01});

                        for(var k=0;k<oldArrNextRicicled.length;k++)
                        {

                            if(oldArrNextRicicled[k].name==rows[i].cells[2].textContent)
                            {
                                oldArrNextRicicled.splice(k, 1);
                                break;
                            }
                        }


                        if(numClick==0)
                        {
                            if(whenRef>=6.5 && whenRef<7.5 && selectNode(document, "//*[@id='chtdiv']/img[@src='/imagens/flag2.gif']")) flag = "flag2.gif";
                            else if(whenRef>=7.5 && selectNode(document, "//*[@id='chtdiv']/img[@src='/imagens/flag1.gif']")) flag = "flag1.gif";
                        }
                        else
                        {
                            var diffDateClick = Math.abs(truncdate.getTime() - convertiData2(rows[i].cells[5].textContent).getTime()) / 86400000;
                            if(whenRef<14){
                                if(diffDateClick<7 && selectNode(document, "//*[@id='chtdiv']/img[@src='/imagens/flag0.gif']")) flag = "flag0.gif";
                                if(diffDateClick==7 && selectNode(document, "//*[@id='chtdiv']/img[@src='/imagens/flag2.gif']")) flag = "flag2.gif";
                                if(diffDateClick>7 && selectNode(document, "//*[@id='chtdiv']/img[@src='/imagens/flag1.gif']")) flag = "flag1.gif";
                            }
                            else if(whenRef<15 && diffDateClick>0 && diffDateClick<7 && r<0 && !selectNode(document, "//*[@id='chtdiv']/img[@src='/imagens/flag0.gif']")) flag = "flag7.gif";
                            else if(r>0)
                            {
                                if(diffDateClick<7 && selectNode(document, "//*[@id='chtdiv']/img[@src='/imagens/flag0.gif']")) flag = "flag0.gif";
                                if(diffDateClick==7 && selectNode(document, "//*[@id='chtdiv']/img[@src='/imagens/flag2.gif']")) flag = "flag2.gif";
                                if(diffDateClick>7 && selectNode(document, "//*[@id='chtdiv']/img[@src='/imagens/flag1.gif']")) flag = "flag1.gif";
                            }
                            else
                            {
                                //alert(userName+ " " + (diffDateClick<7) + " " + (whenRef-7>=diffDateClick) + " " + (selectNode(document, "//*[@id='chtdiv']/img[@src='/imagens/flag7.gif']")))
                                if(diffDateClick<7 && ((whenRef-7>=diffDateClick && selectNode(document, "//*[@id='chtdiv']/img[@src='/imagens/flag7.gif']"))|| (whenRef-14>=diffDateClick && !selectNode(document, "//*[@id='chtdiv']/img[@src='/imagens/flag7.gif']"))))
                                {
                                    $(mainTable.rows[i].cells[8].children[0].children[0].rows[0].cells[1].children[0]).trigger("click");
                                    if(daRiciclare == "") daRiciclare = i/2;
                                    else daRiciclare += ","+(i/2);
                                    if(!clickGuadagnatiRiciclo) clickGuadagnatiRiciclo = clickGuadagnati;
                                    else clickGuadagnatiRiciclo += clickGuadagnati;
                                }
                                if(diffDateClick==7 && selectNode(document, "//*[@id='chtdiv']/img[@src='/imagens/flag2.gif']")) flag = "flag2.gif";
                                if(diffDateClick>7 && selectNode(document, "//*[@id='chtdiv']/img[@src='/imagens/flag1.gif']")) flag = "flag1.gif";
                            }
                        }
                    }
                    if(flag != ""){
                        //alert(selectNode(document, "//*[@id='chtdiv']/img[@src='/imagens/"+flag+"']"));
                        selectNode(document, "//*[@id='chtdiv']/img[@src='/imagens/"+flag+"']").onclick();
                    }


					if (r > 0) {
						var dayrec = new Date((new Date()).getTime()+ r2*86400000);
						var stringdayrec = dayrec.toLocaleString(); //("0" + dayrec.getDate()).slice(-2) + "-" + ("0"+(dayrec.getMonth()+1)).slice(-2) + "-" +
    //dayrec.getFullYear() + " " + ("0" + dayrec.getHours()).slice(-2) + ":" + ("0" + dayrec.getMinutes()).slice(-2) + ":" + ("0" + dayrec.getSeconds()).slice(-2);

						//alert(dayrec);
						if(daydiffInizio>10)
						{
							if(!arrDayScad.get(dayrec.getDate()+"/"+(dayrec.getMonth()+1)+"/"+dayrec.getFullYear())) arrDayScad.set(dayrec.getDate()+"/"+(dayrec.getMonth()+1)+"/"+dayrec.getFullYear(),1);
							else arrDayScad.set(dayrec.getDate()+"/"+(dayrec.getMonth()+1)+"/"+dayrec.getFullYear(),arrDayScad.get(dayrec.getDate()+"/"+(dayrec.getMonth()+1)+"/"+dayrec.getFullYear())+1);
						}
						arrDayScad = new Map([...arrDayScad.entries()].sort(function(a,b) {
							var splitA = a[0].split("/");
							var splitB = b[0].split("/");
							if (Number(splitA[2])>Number(splitB[2])) return 1;
                            if (Number(splitA[2])<Number(splitB[2])) return -1;
                            if (Number(splitA[1])>Number(splitB[1])) return 1;
                            if (Number(splitA[1])<Number(splitB[1])) return -1;
                            if (Number(splitA[0])>Number(splitB[0])) return 1;
                            if (Number(splitA[0])<Number(splitB[0])) return -1;
							return 0;
						}));
						for (var [key, value] of arrDayScad.entries()) {
							console.log(key + " = " + value);
						}						rappriciclo =r2/((diffDateNewYear*media-whenRef*media-5475/4*media+Math.sqrt(Math.pow(diffDateNewYear,2)*Math.pow(media,2)-2*diffDateNewYear*whenRef*Math.pow(media,2)+Math.pow(whenRef,2)*Math.pow(media,2)-5475/2*diffDateNewYear*Math.pow(media,2)+5475/2*whenRef*Math.pow(media,2)+29975625/16*Math.pow(media,2)+3650*r2*media))/(2*media));
						var month = parseInt(r);
						if (month !== 0)
							timeToRicicle = timeToRicicle + month + "M";
						r = (r - month) * 30;
						var day = parseInt(r);
						if (day !== 0)
							timeToRicicle = timeToRicicle + day + "d";
						r = (r - day) * 24;
						var hour = parseInt(r);
						if (hour !== 0)
							timeToRicicle = timeToRicicle + hour + "h";
						r = (r - hour) * 60;
						var minute = parseInt(r);
						if (minute !== 0)
							timeToRicicle = timeToRicicle + minute + "m";
						r = (r - minute) * 60;
						var second = parseInt(r);
						if (second !== 0)
							timeToRicicle = timeToRicicle + second + "s";
						var dataScass = new Date();
						dataScass.setMonth(dataScass.getMonth() + month);
						dataScass.setDate(dataScass.getDate() + day);
						dataScass.setHours(dataScass.getHours() + hour);
						dataScass.setMinutes(dataScass.getMinutes() + minute);
						dataScass.setSeconds(dataScass.getSeconds() + second);
						timeToRicicle = timeToRicicle + "| " + stringdayrec;//+ rappriciclo.toPrecision(7);
						timeToRicicle2 = dataScass.getDate() + "/" + (dataScass.getMonth() + 1) + "/" + dataScass.getFullYear() + " " + dataScass.getHours() + ":" + (dataScass.getMinutes() < 10 ? "0" + dataScass.getMinutes() : dataScass.getMinutes());
					}
                    else
                    {



                        /*if (numClick!=0 && whenRef>=14) {
                            alert(mainTable.rows[i].cells[1].children[0].src);
                            $(mainTable.rows[i].cells[8].children[0].children[0].rows[0].cells[1].children[0]).trigger("click");
                        }*/

                    }
					//}
					var text2 = document.createTextNode(pareggioRiciclo + "|" + clickGuadagnati.toPrecision(5) + timeToRicicle);

					totalGuadagno += clickGuadagnati;
					if (clickGuadagnati >= pareggio || (month > 0 || day >= 15)) {
						elemGuadagno++;
						if (GM.getValue(userName + "_pareggio") === undefined)
							GM.setValue(userName + "_pareggio", "OK");
					} else {
						if (GM.getValue(userName + "_pareggio") !== undefined) {
							//if (clickGuadagnati <= pareggio - 1.75)
							//console.log("da riciclare  riga " + rows[i].cells[0].textContent);
							//else
							//console.log("possibilita di riciclo in riga " + rows[i].cells[0].textContent + " con guadagno uguale a " + clickGuadagnati + " alle " + timeToRicicle2);
						} else if (daydiffInizio > 14) {
							var minutediffInizio = Math.round((date.getTime() - convertiData2(rows[i].cells[3].textContent).getTime()) / 60000);
							//numIdealClick=((24*60*((minutediffInizio*(479/450)*1.1)/(24*60)+14)/minutediffInizio)/(24*60*7*1.1+minutediffInizio))*minutediffInizio
							numIdealClick = (minutediffInizio * media * 1.24 + 14 * 24 * 60) / (24 * 60 * 7 * 1.24 + minutediffInizio);
							numIdealClickdayafter = ((minutediffInizio + 2160) * media * 1.24 + 14 * 24 * 60) / (24 * 60 * 7 * 1.24 + minutediffInizio + 2160);
							//console.log(rows[i].cells[0].textContent+ ' - '+numIdealClick)
							//if(-(numIdealClick-mediaclick)*minutediffInizio>0 && -(numIdealClick-mediaclick)*minutediffInizio<1440) console.log("possibilita di riciclo in riga "+rows[i].cells[0].textContent+ ' - ' + ((numIdealClick-mediaclick)*minutediffInizio))
							//console.log((numIdealClickdayafter-mediaclickdayafter)*minutediffInizio/(24*60));
							//if (numIdealClickdayafter - mediaclickdayafter > 0)
							//console.log("possibilita di riciclo in riga " + rows[i].cells[0].textContent + ' - ' + ((numIdealClick - mediaclick) * minutediffInizio));
							//else if (numIdealClick > mediaclick)
							//console.log("da riciclare  riga " + rows[i].cells[0].textContent + ' - ' + ((numIdealClick - mediaclick) * minutediffInizio));
							//console.log(rows[i].cells[0].textContent+' - '+numIdealClick+ ' - '+hourdiffInizio);
						}
					}
					td2.appendChild(text2);
					rows[i].appendChild(td2);
					if (!isNaN(mediaclick)) {
						if (mediaclick >= 4) {
							for (var j = 0; j < rows[i].cells.length - 1; j++) {
								rows[i].cells[j].style.backgroundColor = "rgb(0,255,0)";
							}
						} else if (mediaclick <= media) {
							for (var j = 0; j < rows[i].cells.length - 1; j++) {
								rows[i].cells[j].style.backgroundColor = "rgb(255,0,0)";
							}
						} else {
							var diffmedia = mediaclick - media;
							var range = 4 - media;
							var rapp = diffmedia / range * 255;
							if (rapp > (255 - rapp)) {
								rapp = Math.round(255 - (255 - rapp) / 4);
							} else if (rapp * 2 > (255 - rapp * 2)) {
								rapp = Math.round(223 - (255 - rapp * 2) / 4);
							} else if (rapp * 4 > (255 - rapp * 4)) {
								rapp = Math.round(191 - (255 - rapp * 4) / 4);
							} else if (rapp * 8 > (255 - rapp * 8)) {
								rapp = Math.round(159 - (255 - rapp * 8) / 4);
							} else if (rapp * 16 > (255 - rapp * 16)) {
								rapp = Math.round(127 - (255 - rapp * 16) / 4);
							} else if (rapp * 32 > (255 - rapp * 32)) {
								rapp = Math.round(95 - (255 - rapp * 32) / 4);
							} else {
								rapp = Math.round(rapp * 16);
							}

							var blue = (255 - rapp) > rapp ? rapp : (255 - rapp);
							for (var j = 0; j < rows[i].cells.length - 1; j++) {
								rows[i].cells[j].style.backgroundColor = "rgb(" + (255 - rapp) + "," + rapp + "," + blue * 2 + ")";
							}
						}
					}
					if (r2 >= 15) {
						rows[i].cells[rows[i].cells.length - 1].style.backgroundColor = "rgb(0,255,0)";
					} else if (r2 <= 0) {
						rows[i].cells[rows[i].cells.length - 1].style.backgroundColor = "rgb(255,0,0)";
					} else if (r2 > 15 * 2 / 3) {
						var rapp = (r2 - 15 *2 / 3) / (15 / 3) * 255;
						console.log("rapporto[" + i + "]= " + rapp)
						if (rapp > (255 - rapp)) {
							rapp = Math.round(255 - (255 - rapp) / 2);
							console.log("rapp[" + i + "]= " + (255-rapp) + " 255 4up")
						} else if (rapp * 2 > (255 - rapp * 2)) {
							rapp = Math.round(191 - (255 - rapp * 2) / 2);
							console.log("rapp[" + i + "]= " + (255-rapp) + " 255 3up")
						} else if (rapp * 4 > (255 - rapp * 4)) {
							rapp = Math.round(127 - (255 - rapp * 4) / 2);
							console.log("rapp[" + i + "]= " + (255-rapp) + " 255 2up")
						} else {
							rapp = Math.round(rapp * 2);
							console.log("rapp[" + i + "]= " + (255-rapp) + " 255 1up")
						}
						var blue = (255 - rapp) > rapp ? rapp : (255 - rapp);

						//var blue = 0
						rows[i].cells[rows[i].cells.length - 1].style.backgroundColor = "rgb(" + (255 - rapp) + "," + 255 + "," + blue * 2 + ")";
						console.log("color="+rows[i].cells[rows[i].cells.length - 1].style.backgroundColor);
					} else {
						var rapp = r2 / (15 *2 / 3) * 255;
						console.log("rapporto[" + i + "]= " + rapp)
						if (rapp > 255 / 2) {
							rapp = Math.round(255 - (255 - rapp) / 8 * 3);
							console.log("rapp[" + i + "]= 255 " + rapp + " 1down")
						} else if (rapp > 255 / 4) {
							rapp = Math.round(207 - (255 - rapp * 2) / 8 * 3);
							console.log("rapp[" + i + "]= 255 " + rapp + " 2down")
						} else if (rapp > 255 / 8) {
							rapp = Math.round(159 - (255 - rapp * 4) / 8 * 3);
							console.log("rapp[" + i + "]= 255 " + rapp + " 3down")
						} else if (rapp > 255 / 16) {
							rapp = Math.round(111 - (255 - rapp * 8) / 8 * 3);
							console.log("rapp[" + i + "]= 255 " + rapp + " 4down");
						} else if (rapp > 255 / 32) {
							rapp = Math.round(63 - (255 - rapp * 16) / 4);
							console.log("rapp[" + i + "]= 255 " + rapp + " 5down");
						} else {
							rapp = Math.round(32 / 4 * rapp);
							console.log("rapp[" + i + "]= 255 " + rapp + " 6down");
						}
						var blue = 0
						rows[i].cells[rows[i].cells.length - 1].style.backgroundColor = "rgb(" + 255 + "," + rapp + "," + blue * 2 + ")";
					}
					if (GM.getValue(userName + "_pareggio") !== undefined) {
						elemPareggio++;
						//rows[i].cells[1].style.backgroundColor = "rgb(255,255,0)";
					}

					if(whenRef+r2>ggPareggio)
					{
						rows[i].cells[1].style.backgroundColor = "rgb(255,255,0)";
						td2.style.fontWeight = 'bold';
						guadagnoRiciclo++;
					}

					var rowstable = rows[i].cells[8].firstChild.firstChild.rows;
					var img = rowstable[0].cells[0].children[2];
					try {
						if (img.src.search("0") != -1) {
							if (numClick >= idealNumClick - 1) {
								if (daydiff2 > 1 || (daydiff2 == 1 && ((avgclickobject === 0 || avgclickobject > 2 / 7)))) {
									rowstable[0].cells[0].children[0].style.display = "";
									rowstable[0].cells[0].children[1].style.display = "none";
									img.src = img.src.replace("0", "1");
								} else
									numricicli++;
							} else
								numricicli++;
						} else {
							if (numClick < idealNumClick - 1 || (daydiff2 == 1 && avgclickobject !== 0 && avgclickobject <= 2 / 7)) {
								rowstable[0].cells[0].children[0].style.display = "none";
								rowstable[0].cells[0].children[1].style.display = "";
								img.src = img.src.replace("1", "0");
								numricicli++;
							}
						}
					} catch (e) {}
					userNameCell = rows[i].cells[userNameColumn];
					userName = userNameCell.textContent.replace(
						/^\s*(\S*(\s+\S+)*)\s*$/, "$1");
					len = date.toLocaleDateString().length;
					if (GM.getValue(userName) === undefined) {
						GM.setValue(userName, date.toLocaleDateString() + ": " + numClick + "; ");
					} else if (GM.getValue(userName).substr(0, len) != date.toLocaleDateString()) {
						GM.setValue(userName, date.toLocaleDateString() + ": " + numClick + "; " + GM.getValue(userName));
					}

					comment = GM.getValue(userName);
					if (comment !== undefined) {
						icon = iconRed;
					} else {
						icon = iconGrey;
					}
					table = document.createElement("table");
					table.setAttribute("width", "100%");
					table.setAttribute("cellspacing", "0");
					table.setAttribute("cellpadding", "0");
					row = document.createElement("tr");
					cells = [
						document.createElement("td"),
						document.createElement("td")
					];
					cells[0].setAttribute("class", "f_r");
					cells[0].setAttribute("style",
										  "text-align: left;");
					cells[0].innerHTML = userName + " ";
					cells[1].setAttribute("id", "info_" + userName);
					cells[1].setAttribute("class", "f_r");
					cells[1].setAttribute("style", createStyle(icon));
					cells[1].addEventListener("click", createEventListener(userName), false);
					cells[1].innerHTML = userName + " ";
					row.appendChild(cells[1]);
					if (comment !== undefined) {
						script = document.createElement("script");
						script.textContent =
							createToolTipScript(userName, comment);
						row.appendChild(script);
					}
					table.appendChild(row);
					userNameCell.textContent = "";
					userNameCell.appendChild(table);
				} else {
					rows[i].cells[0].colSpan += 2;
				}
			}
			console.log("click odierni = " + clicktoday);
			/*console.log("ref in scadenza = " + refscadnow);
            console.log("ref in scadenza prossima settimana = " + refscad7);
            console.log("ref in scadenza tra 2 settimane = " + refscad14);
            console.log("ref in scadenza tra 3 settimane = " + refscad21);
            console.log("ref in scadenza tra 4 settimane = " + refscad28);
            console.log("ref in scadenza tra 5 settimane = " + refscad35);
            console.log("ref in scadenza tra 6 settimane = " + refscad42);
            console.log("ref in scadenza tra 7 settimane = " + refscad49);
            console.log("ref in scadenza tra 8 settimane = " + refscad56);
            console.log("ref in scadenza tra 9 settimane = " + refscad63);*/
			console.log("numero ricicli = " + numricicli);
			console.log("TotaleGuadagno = " + totalGuadagno);
			console.log("ref in guadagno = " + elemGuadagno);
			console.log("ref in pareggio = " + elemPareggio);
			console.log("guadagno con riciclo = " + guadagnoRiciclo);



            if (daRiciclare!= "")
            {
                selectNode(document,"//*[@id='suss']").value = 1;
                selectNode(document,"//*[@id='suss']").onchange();
               // alert(selectNode(document,"//*[@id='mdp_x']"));
                var point=false;
                if(selectNode(document,"//*[@id='mdp_x']/option[text()='Points']"))
                {
                    selectNode(document,"//*[@id='mdp_x']").value = selectNode(document,"//*[@id='mdp_x']/option[text()='Points']").value;
                    selectNode(document,"//*[@id='mdp_x']").onchange();
                    point= true;
                }

                var earn = Number(point?((clickGuadagnatiRiciclo+$("[name='sus']:checked").size()*7)*0.01).toPrecision(5):(clickGuadagnatiRiciclo*0.01).toPrecision(5))

                if(confirm("si sta riciclando i ref "+daRiciclare+(point?" usando point":"")+" con un guadagno di "+earn+". sei sicuro di farlo?"))
                {
                    if (GM.getValue("guadagno") === undefined) {
						GM.setValue("guadagno", earn);
					} else {
						GM.setValue("guadagno", Number(Number(GM.getValue("guadagno"))+earn));
					}
                      //alert(selectNode(document,"//*[@id='job']"));
                     $(selectNode(document,"//*[@id='job']")).trigger('click');
                    return;
                }
            }

              GM.setValue("arrNextRicicled",arrNextRicicled);
            var autoRiciclo ="";
            var autoGuadagno;
           for(k=0;k<oldArrNextRicicled.length;k++)
           {
               if(autoRiciclo == "") autoRiciclo = oldArrNextRicicled[k].name;
               else autoRiciclo += ","+oldArrNextRicicled[k].name;
               if(!autoGuadagno) autoGuadagno = oldArrNextRicicled[k].earn;
               else autoGuadagno += oldArrNextRicicled[k].earn;
               if (GM.getValue("guadagno") === undefined) {
						GM.setValue("guadagno", oldArrNextRicicled[k].earn);
					} else {
						GM.setValue("guadagno", Number(Number(GM.getValue("guadagno"))+oldArrNextRicicled[k].earn));
				}
           }
           if(autoRiciclo!="") alert("i seguenti ref "+autoRiciclo+"si sono riciclati automaticamente con un guadagno di "+autoGuadagno);

            selectNode(document,"//*[@id='chtdiv0']/table/tbody/tr/td[2]/a").onclick();
			for (i = 0; i < rows[0].childNodes.length; i += 1) {
				rows[0].childNodes[i].style.width = (parseInt(
					window.getComputedStyle(rows[0].childNodes[i],
											null).width, 10) + 2) + "px";
			}
			mainTable.parentElement.style.width = (parseInt(
				window.getComputedStyle(mainTable.parentElement,
										null).width, 10) + 2 * rows[0].childNodes.length) + "px";
			var ix;
			if (window.top.document.getElementById("cboxOverlay"))
				ix = 2;
			else
				ix = 2;
			newWidth = parseInt(window.top.getComputedStyle(
				selectNode(window.top.document, "//body/div[" + ix + "]/div[1]/table")).width, 10);
			/*nodesSnapshot = selectNodes(window.top.document, "//body/div[contains(@style,'margin')][not(@id='tiptip_holder')]");
			nodesSnapshot[nodesSnapshot.length - 1].setAttribute("align", "center");
			for (i = 0; i < nodesSnapshot.length; i += 1) {
				nodesSnapshot[i].style.width = "100%";
				if (i === nodesSnapshot.length - 1) {
					nodesSnapshot[i].children[2].style.width = newWidth + "px";
				} else {
					nodesSnapshot[i].children[0].style.width = newWidth + "px";
				}
			}
			menuContainer = selectNode(window.top.document, "//body/div[" + ix + "]/div[1]/table/tbody/tr/td[1]");
			menuContainerWidth = parseInt(window.getComputedStyle(menuContainer).width, 10);
			if (menuContainerWidth < parseFloat(menuContainer.width)) {
				newWidth += parseFloat(menuContainer.width) - menuContainerWidth + 2;
				for (i = 0; i < nodesSnapshot.length; i += 1) {
					if (i === nodesSnapshot.length - 1) {
						nodesSnapshot[i].children[2].style.width = newWidth + "px";
					} else {
						nodesSnapshot[i].children[0].style.width = newWidth + "px";
					}
				}
			}*/
			for (i = 0; i < 7; i += 1) {
				sortArrowTable = document.getElementById("sort_" + (i + 1));
				if (sortArrowTable) {
					sortArrowTable.style.display = sortArrowDisplayStyles[i];
				}
			}
			ubarPos();
		}
		return arrayScad;
	}

    function fg(u, o, O) {
    if (xuw != true)
        return '';
    var pos = jQuery('#fgidf_' + o).offset();
    d00('chtdiv0').innerHTML = cht_f;
    jQuery('#chtdiv0').css({ "left": (pos.left + 22) + "px", "top": pos.top - 2 + "px" });
    var x = '';
    for (a = 0; a < t_flag; a++)
        if (a != O)
            x += '<img src="' + imgsvr + '/imagens/flag' + a + '.gif" width="16" height="16" border=0 onclick="fg1(\'' + u + '\',' + o + ',' + a + ',' + O + ')" style="cursor:pointer;padding-right:2px;">';
    jQuery('#chtdiv0').show();
    d00('chtdiv').innerHTML = x;
    d00('fgidf_' + o).innerHTML = '<img src="' + imgsvr + '/imagens/flag' + O + '.gif" width=16" height="16" border=0 onclick="fg(\'' + u + '\',' + o + ',' + O + ')" style="cursor:pointer;">';
}

	function replaceIdIcon(cell, page) {
		var splitId = cell.id.substring(6);
		var st = cell.children[0].outerHTML.indexOf("onclick");
		var fi = cell.children[0].outerHTML.indexOf("style");
		cell.setAttribute('id', cell.id.replace(splitId, page * numRefPage + parseInt(splitId)));
		var splitFunction = cell.children[0].outerHTML.substr(st + 9, fi - st - 11).split(",");
		splitFunction[2] = (page * numRefPage + parseInt(splitFunction[2])).toString();
		var func = "";
		var i = 0;
		while (i < splitFunction.length) {
			if (i == 0)
				func = func + splitFunction[i];
			else
				func = func + "," + splitFunction[i];
			i++;
		}
		func = func.trim();
		cell.children[0].setAttribute('onclick', func);
	}

	function pausecomp(ms) {
		ms += new Date().getTime();
		while (new Date() < ms) {}
	}

	var supp = 0;

	function newIframe(i) {
		var el = document.createElement("iframe");
		el.setAttribute('id', 'ifrm' + i);
		var supper = window.location.toString().indexOf('sp=');
		if (supper == -1)
			el.setAttribute('src', window.location + '&sp=' + i);
		else
			el.setAttribute('src', window.location.toString().substr(0, supper + 3) + i + window.location.toString().substr(supper + 4));
		document.body.appendChild(el);
	}

	function newModal(i) {
		var supper = window.location.toString().indexOf('sp=');
		if (supper == -1)
			url = window.location + '&sp=' + i;
		else {
			var urlpage = window.location.toString().substr(supper);
			var ampIndex = urlpage.indexOf("&");
			if (ampIndex == -1)
				url = window.location.toString().substr(0, supper + 3) + i;
			else
				url = window.location.toString().substr(0, supper + 3) + i + window.location.toString().substr(supper + ampIndex);
		}
		var res = window.showModalDialog(url, '', 'modal=yes');
		console.log(res);
		return res;
		//while (!res.closed/* && mw.modalResult == null*/) {

		//}
	}

	function loadiframe() {
		supp++;
	}

	function nextThursday() {
		var date = new Date();
		var truncdate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
		var day = truncdate.getDay();
		if (day >= 4) {
			truncdate.setDate(truncdate.getDate() + 14 - day - 3)
		} else {
			truncdate.setDate(truncdate.getDate() + 7 - day - 3)
		}
		return truncdate;
	}

	function convertiData(data) {
		var dataConvertita;
		if (data.search("Today") != -1) {
			dataConvertita = new Date();
			if (data.substr(9, 2) < 12)
				dataConvertita = new Date(dataConvertita.getFullYear(), dataConvertita.getMonth(), dataConvertita.getDate());
			else
				dataConvertita = new Date(dataConvertita.getFullYear(), dataConvertita.getMonth(), dataConvertita.getDate() + 1);
		} else if (data.search("Yesterday") != -1) {
			dataConvertita = new Date();
			dataConvertita = new Date(dataConvertita.getFullYear(), dataConvertita.getMonth(), dataConvertita.getDate() - 1);
			if (data.substr(13, 2) < 12)
				dataConvertita = new Date(dataConvertita.getFullYear(), dataConvertita.getMonth(), dataConvertita.getDate());
			else
				dataConvertita = new Date(dataConvertita.getFullYear(), dataConvertita.getMonth(), dataConvertita.getDate() + 1);
		} else {
			var anno = data.substr(0, 4);
			var mese = data.substr(5, 2);
			var giorno = data.substr(8, 2);
			dataConvertita = new Date(anno, mese - 1, giorno);
			if (data.substr(14, 2) < 12)
				dataConvertita = new Date(dataConvertita.getFullYear(), dataConvertita.getMonth(), dataConvertita.getDate());
			else
				dataConvertita = new Date(dataConvertita.getFullYear(), dataConvertita.getMonth(), dataConvertita.getDate() + 1);
		}
		return dataConvertita;
	}

	function convertiData2(data) {
		var dataConvertita;
		if (data.search("Today") != -1) {
			dataConvertita = new Date();
			dataConvertita = new Date(dataConvertita.getFullYear(), dataConvertita.getMonth(), dataConvertita.getDate(), data.substr(9, 2), data.substr(12, 2), 0, 0);
		} else if (data.search("Yesterday") != -1) {
			dataConvertita = new Date();
			dataConvertita = new Date(dataConvertita.getFullYear(), dataConvertita.getMonth(), dataConvertita.getDate() - 1, data.substr(13, 2), data.substr(16, 2), 0, 0);
		} else {
			var anno = data.substr(0, 4);
			var mese = data.substr(5, 2);
			var giorno = data.substr(8, 2);
			dataConvertita = new Date(anno, mese - 1, giorno);
			dataConvertita = new Date(dataConvertita.getFullYear(), dataConvertita.getMonth(), dataConvertita.getDate(), data.substr(14, 2), data.substr(17, 2), 0, 0);
		}
		return dataConvertita;
	}

	function callCheckMedia()
	{
		var resp=false;
		var result;
		GM_xmlhttpRequest({
			method: "POST",
			url: "https://script.google.com/macros/s/AKfycbzqpT7sLnIMVjlMokHd78l9z720m7e37CrhXRbgx33axGS71UeU/exec",
			onload: function(response) {
				resp=true;
				var res;

				try{
					res = JSON.parse(response.response);
				}catch(e){}

				if (!res || res.result != "success") alert(response.response);

                media = res.Media;
			},
			onerror: function(response) {
				resp=true;
				alert(response.response);
				media = 100;
			}
		});
		/*while (!resp){
			alert("OK");
		}*/

	}

	main();
	// };
} catch (e) {
	alert("Error in Referrals comments for NeoBux:\n" + e.toString() + "\n" + e.stack);
}