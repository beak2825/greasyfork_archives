// ==UserScript==
// @name         dA_fav_search
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Search within favourites
// @author       Dediggefedde
// @match        https://www.deviantart.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deviantart.com
// @grant        GM.xmlHttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/454429/dA_fav_search.user.js
// @updateURL https://update.greasyfork.org/scripts/454429/dA_fav_search.meta.js
// ==/UserScript==


(function() {
	'use strict';

	let style = null; //CSS style injection HTMLElement
	let db = []; //db entries for just this folder
	let tdb = []; //temporary database during fetching
	let dbMarks = {}; // db for marks: tag=>[list of devID]
	let fetchedDevs = 0; //during fetching counter
	let username; //your username here!
	let folderid; //this folder id (-1=all)
	let token; //security
	let devCont = null; //container for deviations
	let resultcont = null; //container for results
	let pagination = null; //original pagination, hide when searching
	let filteredRes = []; //search result;
	let setdiag = null; //settings dialog
	let resultContent = ""; //html code to display results
	let totalDbEntries = 0; //amount of entries in internal db.
	let activeMark = ""; //target mark in add/remove mark mode
	let curReqCnt = 0; //counter for request delay inverval
	let dbgFlg=false;

	let svgRefresh = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150"  style="width:20px;height:20px">
<path d="M 50 30 a 50 50 0 1 0 50 0" stroke="#000000" fill="transparent"  stroke-width="15"/>
<polyline points="15,23 56,23 55,63" fill="transparent" stroke="#000000" stroke-width="15"/>
</svg>`;

	let disTyp = { table: 0, flow: 1 };
	let showOffset=0;
	let offsetStep=100;
	let settings = {
			display: disTyp.table,
			flowHeight: "200", //px, height of pictures in flow-mode
			tableHeight: "200", //px, height of row in table-mode
			progressive: false, //bool, scan only for new items
			scanDelay: 0, //s, waiting time between requests
			scanInterval: 1, //#, number of consecutive requests before waiting
	};

	function addStyle() { //CSS, one style tag
			if (document.getElementById("dA_fav_search_style") != null) return;
			style = document.createElement("style");
			style.id = "dA_fav_search_style";
			style.innerHTML = `
	#dA_fav_search{position:relative;}
	#dA_fav_search>*{margin:0 10px}
	#dA_fav_search_status{cursor:default;}
	#dA_fav_search_text{border-radius: 5px;padding: 5px;width:20vw;}
	#dA_fav_search button{font-size: 20pt;padding: 0;line-height: 0.8em;vertical-align: middle;cursor: pointer;background: white;border-radius: 5px;box-shadow: -1px -1px 3px #777 inset;}
	#dA_fav_search_results img{max-height:100%;max-width:100%;display:inline-block;}
	#dA_fav_search_results .dA_search_fav_journal{display:inline-block;width:200px;height:100%;}
	#dA_fav_search_results>*{background-color:#ccc3;}
	#dA_fav_search_results .dA_search_fav_res_row.marked {box-shadow: 0 0 5px 5px red;}

	#dA_fav_search_results.dA_search_fav_tableView div.dA_search_fav_res_row:first-child{height:1em;font-weight:bold;}
	#dA_fav_search_results.dA_search_fav_tableView .dA_search_fav_res_row{
		display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; margin: 5px; overflow: hidden; grid-gap: 10px;grid-auto-rows: /*1*//*1*/;
	}

	#dA_fav_search_results.dA_search_fav_flowView {display:flex;flex-wrap: wrap;}
	#dA_fav_search_results.dA_search_fav_flowView .dA_search_fav_res_row{display:inline-block;height:/*2*//*2*/;max-width:50vw;position:relative;vertical-align:middle;min-width:100px;margin:5px;flex:1 max-content;text-align:center;}
	#dA_fav_search_results.dA_search_fav_flowView .dA_search_fav_res_row>span{position: absolute;left: 5px;display: none;width: 95%;word-break: break-word;text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;color: white;}
	#dA_fav_search_results.dA_search_fav_flowView .dA_search_fav_res_row:hover>span{display:inline;}
	#dA_fav_search_results.dA_search_fav_flowView .dA_search_fav_res_row:hover img{filter: brightness(30%)}
	#dA_fav_search_results.dA_search_fav_flowView .dA_search_fav_res_row>span:nth-of-type(1){top:5px;}
	#dA_fav_search_results.dA_search_fav_flowView .dA_search_fav_res_row>span:nth-of-type(2){top:50%;}
	#dA_fav_search_results.dA_search_fav_flowView .dA_search_fav_res_row>span:nth-of-type(3){bottom:5px;}

	#dA_fav_search_settings{position: absolute;width: 200px;display: flex;flex-direction: column;z-index: 99;background-color: var(--g-bg-tertiary);right: 0;top: 120%;padding:5px;border-radius:5px;gap:10px;user-select:none;box-shadow: 2px 2px 2px black;}
	#dA_fav_search_settings label {margin: 10px 0px 0px 0px;}
	#dA_fav_search_format>div{display:inline-block;padding:2px;border:1px solid black;background-color:#aaa7;border-radius:5px;cursor:pointer;margin:5px;}
	#dA_fav_search_format>div:hover{filter:brightness(120%);}
	#dA_fav_search_format>div.active{background-color:#faa7;}
	#dA_fav_search_settings button{font-size:16pt;margin: 5px 10%;padding: 5px;}
	#dA_fav_search_markBar button[data-role="close"]{filter:sepia(100%) saturate(600%) brightness(70%) hue-rotate(300deg)}
	#dA_fav_search_markBar button[data-role="add"]{filter: sepia(100%) saturate(500%) hue-rotate(50deg);}
	#dA_fav_search_deleteButtons button {font-size: 10pt;margin: auto;}
	#dA_fav_search_settings input[type="text"] {width: 20px;margin: 2px 7px;border-radius: 5px;text-align:center;}
	#dA_fav_search_markBar {display:flex;flex-flow: row-reverse wrap;margin: -10px 0 10px;}
	#dA_fav_search_markBar button {padding: 3px;margin: 2px;cursor: pointer;border-radius:2px;}
	#dA_fav_search_markBar button.active {filter: sepia(100%) saturate(500%) hue-rotate(300deg);}
	#dA_fav_search_marks {font-family: Courier New;padding: 4px!important;font-size: calc(20pt - 8px) !important;margin: 0!important;}
			#dA_fav_search_more {display: block;width: 100%;height: 40px;line-height: 40px;text-align: center;cursor: pointer;margin: 20px;}
			#dA_fav_search_more:hover{filter:brightness(120%);}
`;
			// #dA_fav_search_settings button[data-role="marks"]{background-color:#fcc;}
			document.head.appendChild(style);

			applyStyle();
	}
	//requests favourites using new nAPI and GET requests.
	//one request with per call, calls itself with changed offset when response "hasmore" is true
	function reqEntries(offset,type) { //type "collection"=favourites, "gallery"=gallery
			 return new Promise(function(resolve, reject) {
					GM.xmlHttpRequest({
							method: "GET",
							url: `https://www.deviantart.com/_puppy/dashared/gallection/contents?username=${username}&type=${type}&folderid=${folderid}&include_session=false&offset=${offset}&limit=60&mature_content=true&${folderid==-1||folderid=="all"?"all_folder=true&":""}csrf_token=${token}`,
							onerror: function(response) {
									reject("dA_fav_search request failed:", response);
							},
							onload: function(response) {
									let resp;
									try{
										resp = JSON.parse(response.responseText); //see script bottom for structure
										if(dbgFlg)console.log(response, "csrf",token)
										}catch(ex){
											reject("dA_fav_search API Call failed. Please contact the developer!", response.responseText);
											return;
										}

									fetchedDevs += resp.results.length; //progress indicator
									document.getElementById("dA_fav_search_status").innerHTML = `${fetchedDevs}/...`;

									let disdb = resp.results.map((el) => { //extract information from response
											let thumb = "";
											let token = "";
											let types = [];
											try {
													//extract thumbnail in preview quality
													types = el.media.types.filter(tp => tp.c != null && tp.t == "preview");
													if (el.media.token != null) { //extract security token if present
															token = "?token=" + el.media.token[0];
													}
													if (el.media.baseUri == null) {
															thumb = ""; //journal
													} else if (types.length == 0) { //preview image, like for videos or flash files
															thumb = el.media.baseUri + token;
													} else { //normal case, see script bottom for composition
															thumb = el.media.baseUri + types.slice(-1)[0].c.replace("<prettyName>", el.media.prettyName) + token;
													}
											} catch (ex) {
													console.error("dA_fav_search thumb error:", ex, el, types);
											}											
											return { folderid: folderid, deviationId: el.deviationId, title: el.title, publishedTime: el.publishedTime, thumbUrl: thumb, author: el.author, url: el.url };
									});
									tdb = [].concat(tdb, disdb); //add result to demporary database

									//stop when known deviations are detected:
									if (settings.progressive) {
											let oldIDs = db.map(el => el.deviationId); //list of old devids
											let newEls = tdb.filter(el => !oldIDs.includes(el.deviationId)); //list of devids not yet in old list
											if (newEls.length != tdb.length) { // some ids known
													//break progressive
													tdb = [].concat(newEls, db) //return old list +new elements
													fetchedDevs += newEls.length - resp.results.length;
													resolve(resp);
													return;
											} //otherwise: all new, continue scanning
									}

									//recursive call
									if (resp.hasMore) {
											let waits = 500;
											if (++curReqCnt >= settings.scanInterval) {
													waits = settings.scanDelay * 1e3;
													curReqCnt = 0;
											}
											setTimeout(() => {
													resolve(reqEntries(resp.nextOffset,type));
											}, waits);
									} else {
											resolve(resp);
									}
							}
					});
			});
	}

	function replaceTmpl(text, mark, val) {
			let rex = new RegExp("\\/\\*" + mark + "\\*\\/.*?\\/\\*" + mark + "\\*\\/", "ig");
			return text.replace(rex, `/*${mark}*/${val}/*${mark}*/`);
	}

	function applyStyle() {
			style.innerHTML = replaceTmpl(style.innerHTML, "1", settings.tableHeight + "px"); //table height
			style.innerHTML = replaceTmpl(style.innerHTML, "2", settings.flowHeight + "px"); //table height
	}

	//updates entries for this folder in database.
	function updateDB() {
			GM.getValue("db", "").then(val => {
					let rdb;
					if (val == "") {
							rdb = db;
					} else {
							rdb = JSON.parse(val).filter(el => el.folderid != folderid);
							rdb = [].concat(rdb, db);
					}
					totalDbEntries = rdb.length;
					GM.setValue("db", JSON.stringify(rdb));
			})
	}

	function evRefresh(ev) {
			tdb = [];
			fetchedDevs = 0;
			let type = /deviantart\.com\/.*?\/(favourites|gallery)\/?([^\/\?]*)/i.exec(location.href)[1];
			if(type=="favourites")type="collection";
			reqEntries(0,type).then((ret) => {
					db = tdb;
					updateDB();
					console.error(ret);
					document.getElementById("dA_fav_search_status").innerHTML = `${db.length}/${db.length}`;
					alert(`Fetching favourites for this folder is done.\n${fetchedDevs} new entries acquired!`);
			}).catch((err) => {
					alert("An error occured while fetching! More details can be found in the console (F12)\n" + err);
					console.error("dA_fav_search: Gallery fetching error:", err);
			}).finally(() => {
					//done
			});
	}

	function displayResults() {
			let cont = "";

			resultContent = filteredRes.slice(0,showOffset+offsetStep).map(el => {
					let date = (new Date(el.publishedTime)).toLocaleString()
					if (el.thumbUrl == "") { //journal
							return `<div class='dA_search_fav_res_row'><a href="${el.url}"><span class='dA_search_fav_journal'>${el.title}</span></a><span></span><span>${el.author.username}</span><span>${date}</span></div>`;
					} else {
							return `<div class='dA_search_fav_res_row' data-id=${el.deviationId}>
							<a href="${el.url}" target="_blank" rel="noopener noreferrer">
								<img src="${el.thumbUrl}" title="Preview"/>
							</a>
							<span>${el.title}</span>
							<span><a href="https://www.deviantart.com/${el.author.username}" target="_blank" rel="noopener noreferrer">${el.author.username}</a></span>
							<span>${date}</span>
						</div>`;
					}
			}).join("");

			document.getElementById("dA_fav_search_status").innerHTML = `${filteredRes.length}/${db.length}`;
			switch (settings.display) {
					case disTyp.table:
							cont = "<div class='dA_search_fav_res_row'><span>Image</span><span>Title</span><span>Author</span><span>Time</span></div>" + resultContent;
							resultcont.classList.remove("dA_search_fav_flowView");
							resultcont.classList.add("dA_search_fav_tableView");
							break;
					case disTyp.flow:
							cont = resultContent;
							resultcont.classList.remove("dA_search_fav_tableView");
							resultcont.classList.add("dA_search_fav_flowView");
							break;
			}

			resultcont.innerHTML = cont+"<div id='dA_fav_search_more'>Load next "+offsetStep+"</div>";
			resultcont.parentNode.parentNode.style.display="";
			if (activeMark != "") markMarked();
			document.getElementById("dA_fav_search_more").addEventListener("click",(ev)=>{
					showOffset+=offsetStep;
					displayResults();
			},false);
	}

	function evSearch(ev) {
			let val = ev.target.value;

			showOffset=0;
			if (val == "") { //no search, normal layout
					devCont.style.display = "";
					pagination.style.display = "";
					resultcont.style.display = "none";
					document.getElementById("dA_fav_search_status").innerHTML = `${db.length}/${db.length}`;
			} else { //search, activate custom layout
					devCont.style.display = "none";
					pagination.style.display = "none";
					resultcont.style.display = "";

					//actual filter here!!!
					let tosort=[];
					let filts = val.split(",").map(req => {
							let cont = req.trim();
							if (cont.substr(0, 5) == "date:") {
									return { type: "date", text: cont.substr(5) };
							} else if (cont.substr(0, 7) == "author:") {
									return { type: "author", text: cont.substr(7) };
							} else if (cont.substr(0, 6) == "title:") {
									return { type: "title", text: cont.substr(6) };
							} else if (cont.substr(0, 1) == "#") {
									return { type: "mark", text: cont.substr(1) };
							} else if (cont.substr(0,5)=="sort:"){
									if(cont.substr(5,1)=="!")
											tosort.push({asc:-1,type:cont.substr(6)});
									else{
											tosort.push({asc:1,type:cont.substr(5)});
									}
									return{type:"", text: ""}
							} else {
									return { type: "misc", text: cont };
							}
					});

					filteredRes = db.filter(el => {
							let date = new Date(el.publishedTime);
							for (let i = 0; i < filts.length; ++i) {
									let fi = filts[i];
									// let fcnt = filts.reduce((cnt, fi) => {
									switch (fi.type) {
											case "misc":
													if (!(el.title.search(new RegExp(fi.text, "i")) != -1 ||
																el.author.username.search(new RegExp(fi.text, "i")) != -1)){
															return false;}
													break;
											case "title":
													if (!(el.title.search(new RegExp(fi.text, "i")) != -1)){
															return false;}
													break;
											case "author":
													if (!(el.author.username.search(new RegExp(fi.text, "i")) != -1)){
															return false;}
													break;
											case "mark":
													if (dbMarks[fi.text] == null || !dbMarks[fi.text].includes(el.deviationId.toString())){
															return false;}
													break;
											case "date":
													if (fi.text.substr(0, 1) == "<") {
															if (!(date <= new Date(fi.text.substr(1)))){
																	return false;}
													} else if (fi.text.substr(0, 1) == ">") {
															if (!(date >= new Date(fi.text.substr(1)))){
																	return false;}
													} else {
															if (!(date.toLocaleString().indexOf(fi.text) != -1)){
																	return false;}
													}
													break;
									}
							}
							return true;
					});
					document.getElementById("dA_fav_search_status").innerHTML = `${filteredRes.length}/${db.length}`;

					for(let i=0;i<tosort.length;++i){
							if(tosort[i].type=="author"){
									filteredRes.sort((x,y)=>{
											return tosort[i].asc*(x.author.username.toLowerCase()<y.author.username.toLowerCase()?-1:x.author.username.toLowerCase()>y.author.username.toLowerCase()?1:0);
									});
							}else if(tosort[i].type=="title"){
									filteredRes.sort((x,y)=>{
											return tosort[i].asc*(x.title.toLowerCase()<y.title.toLowerCase()?-1:x.title.toLowerCase()>y.title.toLowerCase()?1:0);
									});
							}else if(tosort[i].type=="date"){
									filteredRes.sort((x,y)=>{
											return tosort[i].asc*(x.publishedTime>y.publishedTime?-1:x.publishedTime<y.publishedTime?1:0);
									});
							}
					}

					displayResults();
			}

	}

	function evSettings() {
			if (setdiag != null && setdiag.style.display != "none") {
					setdiag.style.display = "none";
			} else {
					showSettings();
			}
	}

	function evdSettingChange(ev) {
			//event delegation
			if (ev.target.id == "dA_fav_search_flowHeight") {
					settings.flowHeight = ev.target.value;
					applyStyle();
					displayResults();
			} else if (ev.target.id == "dA_fav_search_tableHeight") {
					settings.tableHeight = ev.target.value;
					applyStyle();
					displayResults();
			}
			GM.setValue("settings", JSON.stringify(settings));
	}

	function showMarks() {
			let bar = document.getElementById("dA_fav_search_markBar");
			let els = bar.querySelectorAll("button[data-role='mark']");
			els.forEach(e => e.remove());

			const fragment = new DocumentFragment();
			let mrk = document.createElement("button");
			mrk.dataset.role = "mark";
			Object.keys(dbMarks).forEach(el => {
					mrk = mrk.cloneNode();
					mrk.innerHTML = "#" + el;
					mrk.dataset.mark = el;
					mrk.className = "";
					mrk.title="Click to set active.\nClick on deviations to add/remove the mark.\nClick the mark again to rename it.\nRename to an empty name to delete the mark."
					if (activeMark != "" && mrk.dataset.mark == activeMark) {
							mrk.className = "active";
					}
					fragment.append(mrk);
			});
			bar.append(fragment);

			if(document.getElementById("dA_fav_search_results").style.display=="none"){
					document.getElementById("dA_fav_search_text").value=".";
					evSearch({target:{value:"."}});
			}
	}

	function evMarkInputKeyUp(ev) {
			let val = ev.target.value;
			if (ev.keyCode === 13) { //enter
					let ref = ev.target.dataset.ref;
					if (ref != null && val == "") { //remove
							delete dbMarks[ref];
							activeMark = "";
							ev.target.remove();
							showMarks();
							GM.setValue("dbMarks", JSON.stringify(dbMarks));
							return;
					} else if (ref != null && val != "") { //change name
							if (ref == val || dbMarks[val] != null) { //no change or exists already
									ev.target.remove();
									showMarks();
									return;
							}
							activeMark = val;
							let arr = dbMarks[ref];
							delete dbMarks[ref];
							dbMarks[val] = arr;
							ev.target.remove();
							showMarks();
							GM.setValue("dbMarks", JSON.stringify(dbMarks));
					} else if (val != "" && dbMarks[val] == null) { //add
							dbMarks[val] = [];
							GM.setValue("dbMarks", JSON.stringify(dbMarks));
							ev.target.remove();
							activeMark = val;
							showMarks();
					}
			} else if (ev.keyCode == 27) { //escape
					ev.target.remove();
					showMarks();
			}
	}

	function evdMarkerbarClick(ev) {
			//event delegation
			let bar = document.getElementById("dA_fav_search_markBar");
			if (ev.target.tagName != "INPUT") {
					bar.querySelectorAll("input[type='text']").forEach(el => el.remove());
			}

			let el, siz;
			switch (ev.target.dataset.role) {
					case "add":
							el = document.createElement("input");
							el.type = "text";
							bar.append(el);
							el.addEventListener("keyup", evMarkInputKeyUp, false);
							el.focus();
							activeMark = "";
							break;
					case "mark":
							if (activeMark == ev.target.dataset.mark) {
									el = document.createElement("input");
									siz = ev.target.getBoundingClientRect();
									el.type = "text";
									el.title="New mark name. Confirm with Enter key. Cancel with ESC key.";
									el.value = ev.target.dataset.mark;
									el.style.height = siz.height;
									el.style.width = siz.width;
									ev.target.after(el);
									el.dataset.ref = ev.target.dataset.mark;
									el.addEventListener("keyup", evMarkInputKeyUp, false);
									el.focus();
									break;
							} else {
									activeMark = ev.target.dataset.mark;
									el = document.querySelector("button.active[data-role='mark']");
									if (el != null) el.classList.remove("active");
									ev.target.classList.add("active");
									markMarked();
							}
							break;
					case "close":
							activeMark = "";
							bar.style.display = "none";
							markMarked();
							break;
					case null:
					default:
							return;
			}
			ev.stopPropagation();
			ev.preventDefault();
	}

	function injectMarkBar() {
			let bar = document.getElementById("dA_fav_search_markBar");
			if (bar == null) {
					let el = document.createElement("div");
					el.id = "dA_fav_search_markBar";
					el.innerHTML = "<button data-role='close' title='close bar'>X</button><button data-role='add' title='add new mark'>+</button>"
					el.addEventListener("click", evdMarkerbarClick, true);
					resultcont.parentNode.prepend(el);
			} else {
					bar.style.display = "";
			}
			showMarks();
	}

	function evdSettingClick(ev) {
			//event delegation
			let el;
			switch (ev.target.dataset.role) {
					case "format":
							settings.display = parseInt(ev.target.dataset.type);
							el = document.querySelector("#dA_fav_search_format div.active");
							if (el != null) el.classList.remove("active");
							document.querySelector("#dA_fav_search_format div[data-type='" + settings.display + "']").classList.add("active");
							break;
					case "close":
							setdiag.style.display = "none";
							break;
					case "delFolder":
							if (!confirm(`This action will remove all ${db.length} entries for this folder from the script database.\nContinue?`)) return;
							db = [];
							GM.getValue("db", "").then(val => {
									let rdb;
									if (val == "") {
											rdb = [];
									} else {
											rdb = JSON.parse(val).filter(el => el.folderid != folderid);
									}
									GM.setValue("db", JSON.stringify(rdb));
									displayResults();
							})
							break;
					case "delAll":
							if (!confirm(`This action will remove all ${totalDbEntries} entries from the script database.\nAny folder you want to search in will need to be indexed again.\nContinue?`)) return;
							db = [];
							GM.setValue("db", JSON.stringify(db));
							break;
					case "delMarks":
							if (!confirm("This action will remove all stored marks.\nWarning: Deleting can not be reversed. You will need to input all marks again.\nContinue?")) return;
							dbMarks = {};
							GM.setValue("dbMarks", JSON.stringify(dbMarks));
							break;
					case "progressive":
							settings.progressive = document.getElementById("dA_fav_search_progressive").checked;
							GM.setValue("settings", JSON.stringify(settings));
							return;
					case "scanDelay":
					case "scanInterval":
							el = document.querySelector("#dA_fav_search_settings input[data-role='scanInterval']");
							settings.scanInterval = parseInt(el.value) || 0;
							if (settings.scanInterval < 1) settings.scanInterval = 1;
							el.value = settings.scanInterval;
							el = document.querySelector("#dA_fav_search_settings input[data-role='scanDelay']");
							settings.scanDelay = parseInt(el.value) || 0;
							if (settings.scanInterval < 0) settings.scanInterval = 0;
							el.value = settings.scanDelay

							calcEstimate();
							GM.setValue("settings", JSON.stringify(settings));
							return;
					case null:
					default:
							return;
			}
			ev.stopPropagation();
			ev.preventDefault();
			displayResults();
			GM.setValue("settings", JSON.stringify(settings));
	}

	function calcEstimate() {
			let max = document.getElementById("dA_fav_search").parentNode.querySelector("[role='button'] span").innerText;
			let est = max / 60 * 1; //60 entries per page, 1s per page request
			est += Math.floor(Math.floor(max / 60) / settings.scanInterval) * settings.scanDelay; //each [scanInterval] pages add [scandelay] seconds
			est /= 60.0; //minutes
			est = Math.round(est * 10) / 10; //1 decimal digit formating
			let el = document.getElementById("dA_fav_search_estimate");
			el.innerHTML = `~ ${est} Minutes`;
			el.title = `Estimated time to fetch ${max} deviations`;
	}

	function showSettings() {
			if (setdiag == null || document.getElementById("dA_fav_search_settings") == null) {
					setdiag = document.createElement("div");
					setdiag.innerHTML = `
					<label for='dA_fav_search_format'>Display Format</label>
					<div id='dA_fav_search_format'>
						<div data-role="format" data-type='${disTyp.table}'>Table</div>
						<div data-role="format" data-type='${disTyp.flow}'>Flow</div>
					</div>
					<label for='dA_fav_search_flowHeight'>Flow Item Height</label>
					<input type="range" min="100" max="500" value="${settings.flowHeight}" step=50 id="dA_fav_search_flowHeight">
					<label for='dA_fav_search_tableHeight'>Table Row Height</label>
					<input type="range" min="50" max="450" value="${settings.tableHeight}" step=50  id="dA_fav_search_tableHeight">
					<label>Delete Database</label>
					<div id="dA_fav_search_deleteButtons">
						<button data-role="delFolder">Folder</button>
						<button data-role="delAll">All Folders</button>
						<button data-role="delMarks">Marks</button>
					</div>
					<div>
						<input data-role='progressive' id='dA_fav_search_progressive' type="checkbox" ${settings.progressive?"checked='checked'":""}/>
						<label for="dA_fav_search_progressive">Scan Only Newest</label>
					</div>
					<label>Scan Delay <span id='dA_fav_search_estimate'></span></label>
					<div>
						<input data-role='scanDelay' type="text" value='${settings.scanDelay}'/>s per
						<input data-role='scanInterval' type="text" value='${settings.scanInterval}'/>page
					</div>
					<button data-role="close">Close</button>
				`;
					//<button data-role="marks">Manage Marks</button>
					setdiag.id = "dA_fav_search_settings";
					document.getElementById("dA_fav_search").append(setdiag);

					document.getElementById("dA_fav_search_settings").addEventListener("click", evdSettingClick, true);
					document.getElementById("dA_fav_search_settings").addEventListener("change", evdSettingChange, true);
			} else {
					setdiag.style.display = "";
			}

			let el = document.querySelector("#dA_fav_search_format div.active");
			if (el != null) el.classList.remove("active");
			document.querySelector("#dA_fav_search_format div[data-type='" + settings.display + "']").classList.add("active");
			document.getElementById("dA_fav_search_flowHeight").value = settings.flowHeight;
			document.getElementById("dA_fav_search_tableHeight").value = settings.tableHeight;

			calcEstimate();

			if (resultcont.style.display == "none") {
					evSearch({ target: { value: "." } });
			}
	}


	function addGUI() {
			let el = document.createElement("div");
			el.innerHTML = `<input type='text' placeholder='Search' id='dA_fav_search_text' title='Press Enter key to search.\nSeparate conditions with "," ("cat, brown").\nRegular expressions supported ("^dra.*t$").\nUsing no specifier searches in all fields (author,title,date).\nSpecifiers are "author:", "title:", "date:", "sort:" ("author:dediggefedde, title:dA")\n"date:" supports before < and after > and partial dates ("date:<2021-05").\nSearch for "marked" deviations with leading # ("#dragons").\nUse the "sort:" specifier and the field to sort the results ("sort:author").\nReverse the sorting with  aleading "!" ("sort:!date").\nYou can sort multiple fields at once ("sort:author, sort:date").'/>
				<span id='dA_fav_search_status'>0/0</span>
				<button id='dA_fav_search_refresh' title='Build Index'>${svgRefresh}</button>
				<button id='dA_fav_search_marks' title='Marks tagging'>#M</button>
				<button id='dA_fav_search_setdiag' title='Settings'>...</button>
				`;
			el.id = "dA_fav_search";
			document.querySelector("#sub-folder-gallery [role=button]").parentNode.parentNode.parentNode.append(el);

			document.getElementById("dA_fav_search_refresh").addEventListener("click", evRefresh, false);
			document.getElementById("dA_fav_search_text").addEventListener("change", evSearch, false);
			document.getElementById("dA_fav_search_setdiag").addEventListener("click", evSettings, false);
			document.getElementById("dA_fav_search_marks").addEventListener("click",(ev)=>{
					let bar= document.getElementById("dA_fav_search_markBar");
					if(bar==null||bar.style.display=="none"){
							injectMarkBar();
					}else{
							activeMark = "";
							bar.style.display = "none";
							markMarked();
					}
					ev.stopPropagation();
					ev.preventDefault();
			},false);

			devCont = document.querySelector("[data-testid='content_row']").parentNode.parentNode;
			resultcont = document.createElement("div");
			resultcont.id = "dA_fav_search_results";
			resultcont.style.display = "none";
			devCont.after(resultcont);
			resultcont.addEventListener("click", evdResultClick, true);
	}

	function fetchGlobals() {
			username = /deviantart\.com\/(.*?)\/(?:favourites|gallery)/i.exec(location.href)[1];
			token = document.querySelector("input[name=validate_token]").value;
			folderid = /deviantart\.com\/.*?\/(?:favourites|gallery)\/?([^\/\?]*)/i.exec(location.href)[1];

			if (folderid == "all") folderid = "-1";
			if (folderid == "") folderid = /deviantart\.com\/.*?\/(?:favourites|gallery)\/?([^\/]*)/i.exec(document.querySelector("div.ds-card-selected").parentNode.href)[1];

			pagination = document.querySelector("#sub-folder-gallery>div>div:last-of-type");
			if (pagination==null || (pagination.innerText.indexOf("Prev") == -1 && pagination.innerText.indexOf("Next") == -1)) pagination = { style: { display: "" } };
	}

	function markMarked() {
			if (activeMark == "") {
					document.querySelectorAll(".dA_search_fav_res_row.marked").forEach(el => {
							el.classList.remove("marked");
					});
			} else {
					document.querySelectorAll(".dA_search_fav_res_row").forEach(el => {
							if (dbMarks[activeMark].includes(el.dataset.id)) {
									el.classList.add("marked");
							} else {
									el.classList.remove("marked");
							}
					});
			}
	}

	function evdResultClick(ev) {
			if (activeMark == "") return;
			let el = ev.target.closest(".dA_search_fav_res_row");
			if (el == null) return;
			ev.preventDefault();
			ev.stopPropagation();
			let id = el.dataset.id;
			if (dbMarks[activeMark].indexOf(id) == -1) {
					dbMarks[activeMark].push(id);
					el.classList.add("marked");
			} else {
					dbMarks[activeMark] = dbMarks[activeMark].filter(el => el != id);
					el.classList.remove("marked");
			}
			GM.setValue("dbMarks", JSON.stringify(dbMarks));
	}

	function init() {

			if (location.href.search(/www.deviantart.com\/[^\/]+\/(?:favourites|gallery)($|\/)/i) == -1) {if(dbgFlg)console.log(1);return};
			if (document.getElementById("dA_fav_search") != null) {if(dbgFlg)console.log(2);return;}
			if (document.querySelector("#sub-folder-gallery [role=button]") == null){if(dbgFlg)console.log(3); return;}
			if (document.querySelector("[data-testid='content_row']") == null){if(dbgFlg)console.log(4); return;}

			addStyle();
			addGUI();
			fetchGlobals();

			GM.getValue("db", "").then((val) => {
					if (val == "") return;
					db = JSON.parse(val);
					totalDbEntries = db.length;
					db = db.filter(el => el.folderid == folderid);
					document.getElementById("dA_fav_search_status").innerHTML = `${db.length}/${db.length}`;
			});
			GM.getValue("settings", "").then(val => {
					if (val == "") return;
					let stoSet = JSON.parse(val);
					Object.entries(stoSet).forEach(([key, val]) => { //only load present settings, keep default for new ones.
							if (key in settings) settings[key] = val;
					})
					applyStyle();
			})
			GM.getValue("dbMarks", "").then(val => {
					if (val == "") return;
					dbMarks = JSON.parse(val);
			})

	}

	setInterval(init, 1000);
})();

/*
GET
https://www.deviantart.com/_napi/shared_api/gallection/contents?
username=Dediggefedde&
type=collection&
folderid=-1&
offset=48&
limit=60&
mature_content=true&
all_folder=true&
csrf_token=cDRbk8Kai
https://www.deviantart.com/_napi/shared_api/gallection/contents?username=Dediggefedde&type=collection&folderid=-1&offset=48&limit=60&mature_content=true&all_folder=true&csrf_token=cDRbk8KaiVaute

return
"hasMore": true,
"nextOffset": 60,
"results": []


deviationId": 935383722,
"type": "image",
"typeId": 1,
"printId": null,
"url": "https://www.deviantart.com/natoli/art/Trust-935383722",
"title": "Trust",
"isJournal": false,
"isVideo": false,
"isPurchasable": false,
"isFavouritable": true,
"publishedTime": "2022-11-02T15:13:33-0700",
"isTextEditable": false,
"isBackgroundEditable": false,
"legacyTextEditUrl": null,
"isShareable": true,
"isCommentable": true,
"isFavourited": true,
"isDeleted": false,
"isMature": false,
"isDownloadable": true,
"isAntisocial": false,
"isBlocked": false,
"isPublished": true,
"isDailyDeviation": false,
"hasPrivateComments": false,
"hasNft": false,
"isDreamsofart": false,
"isAiUseDisallowed": false,
"blockReasons": [ ],
"author": {

"userId": 949579,
"useridUuid": "9ea3ebd1-5904-4ade-8023-77ee378b7049",
"username": "Natoli",
"usericon": "https://a.deviantart.net/avatars-big/n/a/natoli.gif?1",
"type": "regular",
"isWatching": true,
"isSubscribed": false,
"isNewDeviant": false

},
"stats": {

"comments": 1,
"favourites": 32,
"views": 502,
"downloads": 3

},
media": {

"baseUri": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/d5ccb67d-1d14-454f-ab94-7307c8a4a2a0/dcjujzo-60862fe9-6fda-4933-9a3f-b0456f0a909d.jpg",
"prettyName": "dragon_roasted_coffee__speedpaint_by_goldendruid_dcjujzo",
"token": [
"eyJ0eXAiOiJKV1QJWLwSdzp27Fb4",
"eyJ0eXAiOiJKV1QiLCDOoM9aSa1Qqq3HyXKw"
],
"types": [
{
"t": "150",
"r": 0,
"c": "/v1/fit/w_150,h_150,q_70,strp/<prettyName>-150.jpg",
"h": 150,
"w": 123,
"ss": [
		{
				"x": 2,
				"c": "/v1/fit/w_300,h_300,q_70,strp/<prettyName>-150-2x.jpg"
		}
]
},
{


wanted:
baseUri/tapes[i].c?token=token

*/