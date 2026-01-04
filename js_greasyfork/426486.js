// ==UserScript==
// @name         dA_Sidebar2
// @namespace    phi.pf-control.de/userscripts/dA_Sidebar2
// @version      1.1
// @description  Track /watch count on all sites. See /watch counts in /watch menu and button
// @author       Dediggefedde
// @include      *
// @grant        GM.xmlHttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.addStyle
// @downloadURL https://update.greasyfork.org/scripts/426486/dA_Sidebar2.user.js
// @updateURL https://update.greasyfork.org/scripts/426486/dA_Sidebar2.meta.js
// ==/UserScript==

//TODO
//GUI settings (CD time), 2 places: dA settings, dialog
//option visible: sidebar, watchcnt, watchbut, actcnt

(function() {
    'use strict';
    // @match        https://www.deviantart.com/notifications/watch*
    let lastReqTime = 0;
    let settings = {
        reqCoolDown: 1 * 60, //min time between requests, seconds, default 1min
        showWatchCnt: true,
        showWatchBtn: true,
        showActivityCnt: true,
        showSidebar: true
    };
    let dAObjects = {
        "all": { url: "", urlCat: "watch", button: "all", sidebar: "🔔 Activity", folder: "root", link: "#all" },
        "deviations": { url: "deviations", urlCat: "watch", button: "^deviations$", sidebar: "🎨 Deviations", folder: "all", link: "/deviations" },
        "journals": { url: "journals", urlCat: "watch", button: "(journals|posts)", sidebar: "🧾 Journals", folder: "all", link: "/journals" },
        "groupDeviations": { url: "groupDeviations", urlCat: "watch", button: "group deviations", sidebar: "🗫 Group", folder: "all", link: "/groupdeviations" },
        "polls": { url: "polls", urlCat: "watch", button: "(polls|posts)", sidebar: "📊 Polls", folder: "all", link: "/polls" },
        "forums": { url: "forums", urlCat: "watch", button: "forums", sidebar: "💬 Forums", folder: "all", link: "/forums" },
        "commissions": { url: "commissions", urlCat: "watch", button: "commissions", sidebar: "🛒 Commissions", folder: "all", link: "/commissions" },
        "status": { url: "status", urlCat: "watch", button: "(status updates|posts)", sidebar: "⏰ Status", folder: "all", link: "/status" },
        "misc": { url: "misc", urlCat: "watch", button: "misc.", sidebar: "🧸 Misc.", folder: "all", link: "/miscellaneous" },
        "feedback": { url: "", urlCat: "feedback", button: "all", sidebar: "📬 Feedback", folder: "root", link: "#feed" },
        "comments": { url: "comments", urlCat: "feedback", button: "comments", sidebar: "📝 Comments", folder: "feedback", link: "/comments" },
        "replies": { url: "replies", urlCat: "feedback", button: "replies", sidebar: "🗐 Replies", folder: "feedback", link: "/replies" },
        "mentions": { url: "mentions", urlCat: "feedback", button: "mentions", sidebar: "📣 Mentions", folder: "feedback", link: "/mentions" },
        "activity": { url: "activity", urlCat: "feedback", button: "activity", sidebar: "🚀 Activity", folder: "feedback", link: "/activity" },
        "correspondence": { url: "correspondence", urlCat: "feedback", button: "correspondence", sidebar: "📚 Correspondence", folder: "feedback", link: "/correspondence" },
    };

    let tmpCounter = {};
    let counter = {}; //website button text : counter
    Object.keys(dAObjects).forEach(function(key, index) { //reset counter
        tmpCounter[key] = 0;
        counter[key] = 0;
    });

    let watchDropDown;
    let footer;
    let settingDiag;

    //deviatnart API request, recursive for offset, type one of types-keys.
    //Promise and updates counter and lastReqTime
    function updateMessages(objKey, offset = 0) {
        let murl = "https://www.deviantart.com/_napi/da-messagecentre/api/" + dAObjects[objKey].urlCat + "?limit=24&messagetype=" + dAObjects[objKey].url + "&offset=" + offset; //
        return new Promise(function(resolve, reject) {
            lastReqTime = (new Date()).getTime() / 1e3;
            GM.setValue("lastReqTime", lastReqTime);
            if (dAObjects[objKey].url == "") {
                return resolve();
            }
            GM.xmlHttpRequest({
                method: "GET",
                url: murl,
                onerror: function(response) {
                    return reject(response);
                },
                onload: function(response) {
                    try {
                        if (response.status == 200) {
                            let l = JSON.parse(response.responseText)
                            let total = 0;

                            if (!l.settings.stacked) {
                                total = parseInt(l.counts.total);
                                tmpCounter[objKey] += total;
                                if (dAObjects[objKey].folder != "root") {
                                    tmpCounter[dAObjects[objKey].folder] += total;
                                }
                                return resolve();
                            } else {
                                l.results.forEach(el => {
                                    if (el.hasOwnProperty("stackCount")) {
                                        total += parseInt(el.stackCount);
                                    } else {
                                        ++total;
                                    }
                                });

                                tmpCounter[objKey] += total;

                                if (dAObjects[objKey].folder != "root") {
                                    tmpCounter[dAObjects[objKey].folder] += total;
                                }

                                if (l.hasMore == true) {
                                    updateMessages(objKey, offset + 24).then(() => { return resolve() });
                                    return;
                                }
                                return resolve();
                            }
                            return;
                        }
                        return reject(response);
                    } catch (ex) {
                        console.log(ex);
                        return reject(response);
                    }
                }
            });
        });
    }
    //helper: get DOM matching selector and textContent
    function getElementsByText(selector, tex) {
        let rex = new RegExp("^" + tex + "$", "i");
        return Array.prototype.slice.call(document.querySelectorAll(selector)).filter(function(el) {
            return rex.test(el.innerHTML);
            //return el.textContent.toLowerCase() ===tex;
        })
    }
    //helper: only overwrites present object members
    function updateObject(oldObj, newObj) {
        Object.keys(oldObj).forEach((key, ind) => { //backward compatibility in case settings change
            if (newObj.hasOwnProperty(key)) {
                oldObj[key] = newObj[key];
            }
        });
        return oldObj;
    }

    //cls: style. string for classname, object for copy computated font properties.
    function createCntEl(id, cnt, cls) {
        let newel = document.createElement("span"); //add span with count
        if (typeof cls == "string") {
            newel.className = cls;
        } else {
            let sty = window.getComputedStyle(cls, null);
            Object.values(sty).filter(re => { return re.includes("font") }).forEach(key => {
                newel.style[key] = sty[key];
            });
            newel.style.color = sty.getPropertyValue("color");
        }
        newel.classList.add("dASidebar2_cnt");
        newel.setAttribute("dASidebar2_span", id);
        newel.setAttribute("cnt", cnt); //dAObjects shares key with counter
        newel.innerHTML = "(" + cnt + ")";
        return newel;
    }

    function updateCntEl(cntEl, cnt) {
        if (parseInt(cntEl.getAttribute("cnt")) != cnt) {
            cntEl.innerHTML = " (" + cnt + ")";
            cntEl.setAttribute("cnt", cnt);
            cntEl.classList.add("dASidebar2_updated");
            updateSidebar();
        }
    }

    function updateSidebar() {
        if (!footer) return;
        footer.classList.add("dASidebar2_alarm");
    }
    //update dA DOM buttons to show the numbers
    //expects counter[] to be filled correctly
    function updateDOM() {
        if (settings.showWatchCnt && /https:\/\/www\.deviantart\.com.*/.test(location.href)) {
            newWatchButton();
        }
        if (settings.showWatchBtn && /https:\/\/www\.deviantart\.com\/notifications\/watch.*/.test(location.href)) {
            newWatchMenu();
        }
        if (settings.showActivityCnt && /https:\/\/www\.deviantart\.com\/notifications\/feedback.*/.test(location.href)) {
            newFeedbackMenu()
        }
        if (settings.showSidebar && !/https:\/\/www\.deviantart\.com.*/.test(location.href) && window.top == window.self) {
            newSideBar();
        }
    }

    function newWatchButton() {
        let tarbut = getElementsByText("header a", "watch");
        if (tarbut.length == 0) return;
        tarbut = tarbut[0];
        if (tarbut.getAttribute("dASidebar2_button")) {
            updateCntEl(tarbut.parentNode.querySelector("span.dASidebar2_cnt"), counter.all);
        } else {
            tarbut.setAttribute("dASidebar2_button", 1);
            tarbut.parentNode.insertBefore(createCntEl("all", counter.all, tarbut), tarbut.nextSibling);
            tarbut.parentNode.style["white-space"] = "nowrap";

            watchDropDown = document.createElement("div");
            watchDropDown.id = "dASidebar2_DDWrap";
            Object.keys(dAObjects).filter(key => { return dAObjects[key].urlCat == "watch" }).forEach(key => {
                let newel = document.createElement("div");
                newel.innerHTML = dAObjects[key].sidebar + " ";
                newel.setAttribute("dASidebar2_div", key);
                newel.appendChild(createCntEl(key, counter[key], ""));
                watchDropDown.appendChild(newel);
            });
            watchDropDown.style.display = "none";
            tarbut.parentNode.insertBefore(watchDropDown, tarbut.nextSibling);
        }
        watchDropDown.addEventListener("mouseenter", evt => {
            watchDropDown.style.display = "block";
        });
        watchDropDown.addEventListener("mouseleave", evt => {
            watchDropDown.style.display = "none";
        });
        watchDropDown.addEventListener("click", evt => { //delegation
            let key = evt.target.getAttribute("dASidebar2_div");
            if (!key || !Object.keys(dAObjects).includes(key)) return;
            window.location.href = "https://www.deviantart.com/notifications/watch" + dAObjects[key].link;
        });
        tarbut.addEventListener("mouseenter", evt => {
            watchDropDown.style.display = "block";
        });
        tarbut.parentNode.addEventListener("mouseleave", evt => {
            watchDropDown.style.display = "none";
        });
    }

    function newWatchMenu() {
        if (getElementsByText("button", "deviations").length == 0) {
            return;
        }
        Object.keys(dAObjects).reverse().filter(key => { return dAObjects[key].urlCat == "watch" }).forEach(key => {
            let tbuts = getElementsByText("button,span", dAObjects[key].button); //terrible deviantart Dom structure
            tbuts.forEach(tarbut => {
                if (tarbut.getAttribute("dASidebar2_button")) return;
                tarbut.setAttribute("dASidebar2_button", 1);
                tarbut.parentNode.insertBefore(createCntEl(key, counter[key], tarbut.className), tarbut.nextSibling);
                tarbut.parentNode.style["white-space"] = "nowrap";
            });
            document.querySelectorAll("[dASidebar2_span='" + key + "']").forEach(newel => {
                updateCntEl(newel, counter[key]);
            });
        });
    }

    function newFeedbackMenu() {
        if (getElementsByText("button", "comments").length == 0) {
            return;
        }
        //console.log(counter);
        Object.keys(dAObjects).reverse().filter(key => { return dAObjects[key].urlCat == "feedback" }).forEach(key => {
            let tbuts = getElementsByText("button,span", dAObjects[key].button); //terrible deviantart Dom structure
            tbuts.forEach(tarbut => {
                if (tarbut.getAttribute("dASidebar2_button")) return;
                tarbut.setAttribute("dASidebar2_button", 1);
                tarbut.parentNode.insertBefore(createCntEl(key, counter[key], tarbut.className), tarbut.nextSibling);
                tarbut.parentNode.style["white-space"] = "nowrap";
            });
            document.querySelectorAll("[dASidebar2_span='" + key + "']").forEach(newel => {
                updateCntEl(newel, counter[key]);
            });
        });
    }

    function newSideBar() {
        let but, subbut, subel;
        if (!footer) {
            footer = document.createElement("div");
            footer.id = "dA_sidebar2_footer";
            Object.keys(dAObjects).filter(key => { return dAObjects[key].folder == "root"; }).forEach(key => {
                but = document.createElement("div");
                but.innerHTML = dAObjects[key].sidebar;
                but.className = "dA_sidebar2_rootmenu";
                but.appendChild(createCntEl(key, counter[key], ""));
                subbut = document.createElement("div");
                subbut.className = "dA_sidebar2_submenu";
                subbut.style.display = "none";
                subbut.setAttribute("folder", key);
                Object.keys(dAObjects).filter(skey => { return dAObjects[skey].folder == key; }).forEach(skey => {
                    subel = document.createElement("a");
                    subel.href = "https://www.deviantart.com/notifications/" + dAObjects[skey].urlCat + dAObjects[skey].link;
                    subel.title = dAObjects[skey].url;
                    subel.innerHTML = dAObjects[skey].sidebar;
                    subel.appendChild(createCntEl(skey, counter[skey], ""));
                    subbut.appendChild(subel);
                });
                but.appendChild(subbut);
                footer.appendChild(but);
                but.addEventListener("mouseenter", evt => {
                    evt.target.querySelector("div.dA_sidebar2_submenu").style.display = "block";
                });
                but.addEventListener("mouseleave", evt => {
                    evt.target.querySelector("div.dA_sidebar2_submenu").style.display = "none";
                });
            });
            but = document.createElement("div");
            but.innerHTML = "🔧";
            but.title = "Settings";
            but.className = "dA_sidebar2_rootmenu";
            but.style = "cursor:pointer";
            but.addEventListener("click", ev => {
                if (settingDiag) {
                    settingDiag.style.display = "";
                }
            });
            footer.appendChild(but);
            document.body.appendChild(footer);

            settingDiag = document.createElement("div");
            settingDiag.innerHTML = `
			<div>Setting</div>
			<label for="dASidebar2_ReqCD">Request Cooldown (minutes)</label>
			<input type="text" id="dASidebar2_ReqCD" value="${settings.reqCoolDown/60}" />
			<label for="dASidebar2_WatchBtn">Show counter next to Watch-button</label>
			<input type="checkbox" id="dASidebar2_WatchBtn" ${settings.showWatchBtn?"checked":""} />
			<label for="dASidebar2_WatchCnt">Show counters in Watch-menu</label>
			<input type="checkbox" id="dASidebar2_WatchCnt" ${settings.showWatchCnt?"checked":""} />
			<label for="dASidebar2_ActCnt">Show counters in Feedback-menu</label>
			<input type="checkbox" id="dASidebar2_ActCnt" ${settings.showActivityCnt?"checked":""} />
			<label for="dASidebar2_ShowSide">Show Sidebar</label>
			<input type="checkbox" id="dASidebar2_ShowSide" ${settings.showSidebar?"checked":""} />
			<button type="button" id="dASidebar2_SaveSet">Save</button>
			`;
            settingDiag.className = "dASidebar2_settings";
            settingDiag.style.display = "none";
            document.body.appendChild(settingDiag);
            document.getElementById("dASidebar2_SaveSet").addEventListener("click", evt => {
                evt.preventDefault();
                evt.stopPropagation();
                settingDiag.style.display = "none";

                settings.reqCoolDown = parseInt(document.getElementById("dASidebar2_ReqCD").value) * 60;
                settings.showWatchBtn = document.getElementById("dASidebar2_WatchBtn").checked;
                settings.showWatchCnt = document.getElementById("dASidebar2_WatchCnt").checked;
                settings.showActivityCnt = document.getElementById("dASidebar2_ActCnt").checked;
                settings.showSidebar = document.getElementById("dASidebar2_ShowSide").checked;
                GM.setValue("settings", JSON.stringify(settings));
            });

        } else {
            Object.keys(counter).forEach(key => {
                footer.querySelectorAll("[dASidebar2_span='" + key + "']").forEach(newel => {
                    updateCntEl(newel, counter[key]);
                });
            });
        }

    }


    //requests API for /watch numbers
    function updateAllNumbers() {
        let reqChain = []; //promise array
        tmpCounter = {};
        Object.keys(dAObjects).forEach(function(key, index) {
            reqChain.push(updateMessages(key)); //new promises for request
            tmpCounter[key] = 0; //reset counter
        });

        Promise.all(reqChain).then(ev => { //execute requests
            GM.setValue("counter", JSON.stringify(tmpCounter)); //save result
            counter = tmpCounter; //overwrite local counter
            updateDOM(); //update display
        }).catch(ex => { console.log(ex); });

    }

    function insertSettingMenu() {
        let setMenuCont = document.getElementById("settings_public").parentNode; //li element
        let newMen = document.createElement("li");
        newMen.innerHTML = "<a>dA_Sidebar2</a>";
        newMen.style = "cursor:pointer";
        newMen.addEventListener("click", evt => {
            evt.stopPropagation();
            evt.preventDefault();
            document.querySelectorAll("ul.menu_holder a.active").forEach(el => { el.classList.remove("active"); });
            evt.target.classList.add("active");
            document.querySelector("div.settings_form").innerHTML = `
					<div class="fooview ch dA_Sidebar2_dAsettings">
						<div class="fooview-inner">
							<h3>dA_Sidebar2 Settings</h3>
							<div class="altaltview altaltview-wider">
								<div class="row">
									<div class="browse-sitback row">
										<input type="text" id="dASidebar2_ReqCD" value="${settings.reqCoolDown/60}" />
										<label for="dASidebar2_ReqCD" class="l">Cooldown</label><br/>
										 <small>Request Cooldown (in minutes)</small>
									</div>
									<div class="browse-sitback row">
										<input type="checkbox" id="dASidebar2_WatchBtn" ${settings.showWatchBtn?"checked":""} />
										<label for="dASidebar2_WatchBtn" class="l">watch button</label><br/>
										<small>Show counter next to Watch-button</small>
									</div>
									<div class="browse-sitback row">
										<input type="checkbox" id="dASidebar2_WatchCnt" ${settings.showWatchCnt?"checked":""} />
										<label for="dASidebar2_WatchCnt" class="l">Watch counters</label><br/>
										<small>Show counters in Watch-menu</small>
									</div>
									<div class="browse-sitback row">
										<input type="checkbox" id="dASidebar2_ActCnt" ${settings.showActivityCnt?"checked":""} />
										<label for="dASidebar2_ActCnt" class="l">Feedback Counters</label><br/>
										<small>Show counters in Feedback-menu</small>
									</div>
									<div class="browse-sitback row">
										<input type="checkbox" id="dASidebar2_ShowSide" ${settings.showSidebar?"checked":""} />
										<label for="dASidebar2_ShowSide" class="l">Sidebar</label><br/>
										<small>Show sidebar on other websites</small>
									</div>
									<div class="browse-sitback row">
										<div class=" buttons ch hh " id="submit">
											<div style="text-align:right" class="rr">
												<a class="smbutton smbutton-green" href="javascript:void(0)">
													<span id="dASidebar2_savesettings">Save</span>
												</a>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>`.replace(/\s\s+/, "");
            document.getElementById("dASidebar2_savesettings").addEventListener("click", evt => {
                evt.preventDefault();
                evt.stopPropagation();

                settings.reqCoolDown = parseInt(document.getElementById("dASidebar2_ReqCD").value) * 60;
                settings.showWatchBtn = document.getElementById("dASidebar2_WatchBtn").checked;
                settings.showWatchCnt = document.getElementById("dASidebar2_WatchCnt").checked;
                settings.showActivityCnt = document.getElementById("dASidebar2_ActCnt").checked;
                settings.showSidebar = document.getElementById("dASidebar2_ShowSide").checked;
                GM.setValue("settings", JSON.stringify(settings));

                alert("dA_Sidebar2 settings saved!");
            })
        });
        setMenuCont.parentNode.insertBefore(newMen, setMenuCont.nextSibling);
    }

    //changing dA DOM using js requires periodic check of DOM
    //watchdog checks once a second
    function watchdog() {
        GM.getValue("lastReqTime", 0).then(t => {
            lastReqTime = t;
            if (t == 0 || (new Date()).getTime() / 1e3 - lastReqTime > settings.reqCoolDown) { //Check request cooldown
                updateAllNumbers();
            } else { //update dom without request (js navigation, update in different tab)
                GM.getValue("counter", "{}").then(cnt => { //use counter from last request
                    let newCnt = JSON.parse(cnt);
                    counter = updateObject(counter, newCnt);
                    updateDOM();
                });
            }
        });
    }

    //script start
    GM.addStyle(`
    #dA_sidebar2_footer{
		position:fixed;
		bottom:0;
		margin:0;
		left:2px;
        height:25px;
		background-color:#ffd;
		border-radius:5px;
		border: 1px solid black;
        z-index:7777777;
		transform:translateY(90%);
		transition: 0.5s ease-in-out;
        color:#002;
		font-family: Verdana, serif;
		font-size:10pt;
		user-select:none;
    }
    #dA_sidebar2_footer *{
        font-style :normal;
        font-variant: normal;
        font-weight:normal;
        line-height:1em;
        letter-spacing:normal;
    }
    #dA_sidebar2_footer:hover{
		transform:translateY(0%);
		transition: 0.2s ease-in-out;
	}
    #dA_sidebar2_footer div.dA_sidebar2_rootmenu {
		padding: 4px;
		margin: 0;
		display:inline-block;
		position:relative;
	}
    #dA_sidebar2_footer div.dA_sidebar2_submenu {
		position: absolute;
		bottom: 22px;
		left: 0;
		background-color: wheat;
		border: 1px solid black;
		box-shadow: 1px 1px 2px black;
		border-radius: 10px;
		white-space: nowrap;
	}
    #dA_sidebar2_footer div.dA_sidebar2_submenu a{
		text-decoration:none;
		color:black;
		display:block;
		padding: 5px;
	}
    #dA_sidebar2_footer div.dA_sidebar2_submenu a:hover{
		color:grey;
	}
    .dASidebar2_updated{
		color:red;
	}
    .dASidebar2_cnt{
		margin-left:5px;
	}
	#dASidebar2_DDWrap{
		top:52px;
		background-color:white;
		position:absolute;
		box-shadow: 1px 1px 5px rgba(0,0,0,0.6);
		border: 1px solid black;
		border-radius: 10px;
		white-space: nowrap;
        color:rgb(6, 7, 13);
	}
    #dASidebar2_DDWrap>div{
		padding:7px;
		display:block;
		cursor:pointer;
    }
    #dASidebar2_DDWrap>div:hover{
		color:#050;
        text-decoration:underline;
    }
	#dASidebar2_DDWrap span{
		color:black
	}
    div.dASidebar2_alarm{
   		animation: blink 1s ease-in-out alternate infinite;
    }
    @keyframes blink {
    	0% {
			box-shadow: 0 0 15px 5px rgba(255,0,0,0);
  		}
   		100% {
    		box-shadow: 0 0 15px 5px rgba(255,0,0,1);
  		}
    }
	div.dASidebar2_settings {
		position: fixed;
		z-index: 777777;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: #fffddd;
		border: 1px solid black;
		border-radius: 5px;
		padding: 5px;
		display: grid;
		grid-template-columns: auto auto;
		grid-gap: 10px;
		justify-items: stretch;
		align-items: center;
        box-shadow: 1px 1px 5px rgba(0,0,0,0.5);
	}
    div.dASidebar2_settings *{
		color:#002;
		font-family: Verdana, serif;
		font-size:10pt;
        font-style :normal;
        font-variant: normal;
        font-weight:normal;
        line-height:1em;
        letter-spacing:normal;
    }
	div.dASidebar2_settings input{
		justify-self:center;
    }
	div.dASidebar2_settings input,div.dASidebar2_settings label, div.dASidebar2_settings button {
		cursor:pointer;
	}
	div.dASidebar2_settings * {
		margin: 0;
		padding: 0;
	}
	#dASidebar2_ReqCD{
		width:40px;
        height:1.5em;
		text-align:center;
		cursor:text;
	}
	div.dASidebar2_settings div{
		grid-column:span 2;
		font-size:14pt;
		text-align: center;
	}
	div.dASidebar2_settings button{
		grid-column:span 2;
        background-color: #adffad;
        border-radius: 10px;
        width: 80%;
        margin: auto;
        padding: 5px;
	}
	div.dASidebar2_settings button:hover{
        background-color: #2edb75;
	}
	div.dA_Sidebar2_dAsettings intput, div.dA_Sidebar2_dAsettings labels{
		cursor:pointer;
	}
	`)
    GM.getValue("settings", "{}").then(set => { //load settings, then do stuff
        let newSet = JSON.parse(set);
        settings = updateObject(settings, newSet); //backward compatibility in case settings change

        if (!settings.showSidebar && !/deviantart.com/.test(location.href)) {
            return;
        }
        if (/deviantart.com\/settings/.test(location.href)) {
            insertSettingMenu();
        }
        setInterval(watchdog, 1000); //start watchdog

        let forceNavi = location.href.match(/https:\/\/www\.deviantart\.com\/notifications\/watch.*#(.*)/i);
        if (forceNavi != null) {
            if (forceNavi[1] == "all") getElementsByText("button", "all")[0].click()
        }
    });

})();