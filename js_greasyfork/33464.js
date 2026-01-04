// ==UserScript==
// @name        Gelbooru Augmentation
// @namespace   eksxx
// @description Post viewer, subscriptions service, private pools panel
// @include     https://gelbooru.com/*
// @version     1.0.14
// @grant       GM.xmlHttpRequest
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.deleteValue
// @grant       GM.listValues 
// @grant       GM.openInTab
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/33464/Gelbooru%20Augmentation.user.js
// @updateURL https://update.greasyfork.org/scripts/33464/Gelbooru%20Augmentation.meta.js
// ==/UserScript==



var POOLS = new function () {
	var Content = {
		order: [],      //[id,id,id...]
		pools: {}      //{id:pool,id:pool...}
	};
	this.Content = Content;

	this.read = async function () { var item = await GM.getValue('PrivatePools', false); if (item) { this.Content = item; }; }
	this.store = async function () { await GM.setValue('PrivatePools', this.Content) }

	this.newPool = async function (id, args, noStore) {
		if (!id) { return false; }
		if (!noStore) { await this.read(); }
		if (!this.Content.order.includes(id)) { this.Content.order.push(id); }
		this.Content.pools[id] = {
			name: args.name || 'Pool ' + id,
			id: id,
			position: args.position || 0,
			tags: args.tags || []
		}
		if (!noStore) { await this.store(); }
		return true;
	}
	this.removePool = async function (id) {
		await this.read();

		if (this.Content.order.includes(id)) {
			this.Content.order.splice(this.Content.order.indexOf(id), 1)
			delete this.Content.pools[id];
			await this.store();
			return true;
		} else {
			return false;
		}
	}
	this.getIds = function () {
		//return this.Content.order;
		return Object.keys(this.Content.pools);
	}
	this.getNames = function (noSorting) {
		//return Content.order;
		var result = [];
		for (id of this.Content.order) {
			result.push(this.Content.pools[id].name);
		}
		if (!noSorting) { result.sort(); }
		return result;
	}
	this.getById = function (id) {
		if (this.Content.pools[id]) { return this.Content.pools[id]; }
		else { return null }
	}
	this.getByName = function (name) {
		for (id of this.Content.order) {
			if (this.Content.pools[id].name.toLowerCase() === name.toLowerCase()) {
				return this.Content.pools[id]
			}
		}
		return null;
	}

	this.setPool = function (id, args) {
		return false;
	}
};

var SUBS = new function () {
	var Content = {
		order: [],      //[tag,tag,tag...]
		subs: {}       //{tag:sub,tag:sub}
	};
	this.Content = Content;

	this.read = async function () { var item = await GM.getValue('Subscriptions', false); if (item) { this.Content = item; }; }
	this.store = async function () { await GM.setValue('Subscriptions', this.Content) }

	this.newSub = async function (tag, args, noStore) {
		if (!tag) { return false; }
		if (!noStore) { await this.read(); }
		if (!this.Content.order.includes(tag)) { this.Content.order.push(tag); }
		this.Content.subs[tag] = {
			tag: tag,
			lastPost: args.lastPost || 0,
			comment: args.comment || '...',
			subTags: args.subTags || []
		};
		if (!noStore) { await this.store(); }
		return true;
	}
	this.removeSub = async function (tag) {
		await this.read();

		if (this.Content.order.includes(tag)) {
			this.Content.order.splice(this.Content.order.indexOf(tag), 1)
			delete this.Content.subs[tag];
			await this.store();
			return true;
		} else {
			return false;
		}
	}
	this.setSub = async function (tag, args) {
		await this.read();
		if (!this.Content.order.includes(tag)) { return false; }
		for (key of Object.keys(args)) {
			this.Content.subs[tag][key] = args[key];
		}
		await this.store();
		return true;
	}
	this.getByTag = function (tag) {
		if (this.Content.subs[tag]) {
			var dummy = {
				tag: 'PLACEHOLDER',
				lastPost: 0,
				comment: '...',
				subTags: []
			};
			for (var propName of Object.keys(this.Content.subs[tag])) {
				dummy[propName] = this.Content.subs[tag][propName];
			}
			return dummy;
		}
		else { return null }
	}
	this.getTags = function () {
		//return this.Content.order;
		return Object.keys(this.Content.subs).sort();
	}
};

function GM_addStyle(cssString) {				// GM3
	var style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = cssString;
	document.querySelector('head').appendChild(style);
};

function wcmatch(str, rule) {				//wildcard handler
	return new RegExp("^" + rule.split("*").join(".*") + "$").test(str);
}

function Construct(options) {
	var rootElement;
	var parsedHTML;
	var CSSdone = false;
	var templateCSS = {};
	var empty = true;
	var visible = false;

	function render() {
		if (!CSSdone && options.element.CSS) { GM_addStyle(options.element.CSS); CSSdone = true; }

		parsedHTML = (new DOMParser()).parseFromString(options.element.HTML, "text/html");


		if (options.element.objectProperties) {
			for (var el of Object.keys(options.element.objectProperties)) {
				for (var eventType of Object.keys(options.element.objectProperties[el])) {
					var actEl = parsedHTML.querySelector('#' + el);
					if (actEl) {
						attributeValue = options.element.objectProperties[el][eventType];
						actEl[eventType] = attributeValue;
					} else {
						console.log("CONSTRUCTOR ERROR: " + options.name + ", No such element: " + el + ", eventType: " + eventType);
					}
				}
			}
		}

		rootElement = parsedHTML.firstChild.lastChild.firstChild;


		if (options.element.globals) {
			for (var elName of options.element.globals) {
				var el = rootElement.querySelector('#' + elName);
				if (el) {
					options.element[options.element.globals[elName]] = el;
				} else {
					console.log("CONSTRUCTOR ERROR: " + options.name + ", No such element: " + elName + ", Global: " + options.element.globals[elName]);
				}
			}
		}
		empty = false;
	}
	async function drawTemplates() {
		if (!options.element.templates) { return false; }
		for (var template of Object.keys(options.element.templates)) {

			var tempData;
			if (options.element.templates[template].dataProvider.constructor.name === 'AsyncFunction') {
				tempData = await options.element.templates[template].dataProvider();
			} else {
				tempData = options.element.templates[template].dataProvider();
			}

			if (!templateCSS[template] && options.element.templates[template].CSS) {
				GM_addStyle(options.element.templates[template].CSS);
				templateCSS[template] = true;
			}

			var Parser = new DOMParser();

			var target = this.getElement(options.element.templates[template].targetName);
			if (!target || target === null) {
				console.log("TEMPLATE CONSTRUCTOR ERROR: " + template +
					", No such target: " + options.element.templates[template].targetName);
				console.log(rootElement)
			}

			while (target.firstChild) { target.removeChild(target.firstChild) }

			//target.innerHTML = "";

			//TEMPLATES
			for (var valueDict of tempData) {
				var templateDOM =
					(Parser)
						.parseFromString(options.element.templates[template].HTML, "text/html")
						.firstChild.lastChild.firstChild;

				for (var element of Object.keys(options.element.templates[template].dataElements)) {
					for (var value of Object.keys(options.element.templates[template].dataElements[element])) {
						for (var property of options.element.templates[template].dataElements[element][value]) {
							var actEl = templateDOM.querySelector('.' + element);
							if (actEl) {
								actEl[property] = actEl[property] + valueDict[value];
							} else {
								console.log("TEMPLATE CONSTRUCTOR ERROR: " + template + ", No such element: " + element + ", value: " + value);
							}
						}
					}
				}

				//TEMPLATES ATTRIBUTES
				if (options.element.templates[template].objectProperties) {
					for (var el of Object.keys(options.element.templates[template].objectProperties)) {
						for (var eventType of Object.keys(options.element.templates[template].objectProperties[el])) {
							var actEl = templateDOM.querySelector('.' + el);
							if (actEl) {
								var attributeValue = options.element.templates[template].objectProperties[el][eventType];
								actEl[eventType] = attributeValue;
							} else {
								console.log("TEMPLATE CONSTRUCTOR ERROR: " + template + ", No such element: " + el + ", eventType: " + eventType);
							}
						}
					}
				}
				if (options.element.templates[template].altPlaceFunction) {
					options.element.templates[template].altPlaceFunction(templateDOM, target)
				} else { target.appendChild(templateDOM); }
			}
		}
	}
	//#### PUBLIC METHODS
	function erase() {
		if (rootElement) {
			rootElement.parentNode.removeChild(rootElement);
			rootElement = null;
		};
	}
	function eraseTemplates(name) {
		if (options.element.templates[name]) {
			var target = rootElement.getElement(options.element.templates[name].targetName);
			if (target) {
				while (target.firstChild) {
					target.removeChild(target.firstChild);
				}
			}
		};
	}
	function clear() {
		if (rootElement) {
			while (rootElement.firstChild) {
				rootElement.removeChild(rootElement.firstChild);
			}
			empty = true;
		};
	}
	function getRoot() {
		if (!rootElement || empty) render();
		return rootElement;
	}
	function getElement(id) {
		if (!rootElement) render();
		target = rootElement.querySelector("#" + id);
		if (!target || target === null) { if (rootElement.id === id) return rootElement; }
		return target;
	}
	function getClass(className) {
		if (!rootElement) render();
		return rootElement.querySelectorAll('.' + className);
	}
	function getTag(tagName) {
		if (!rootElement) render();
		return rootElement.querySelectorAll(tagName);
	}
	function toClass(className, action) {
		for (var element of getClass(className)) {
			action(element);
		}
	}
	function toTag(tagName, action) {
		for (var element of getTag(tagName)) {
			action(element);
		}
	}
	//#### ==============

	this.erase = erase;
	this.clear = clear;
	this.getRoot = getRoot;
	this.render = render;

	this.drawTemplates = drawTemplates;

	this.getElement = getElement;
	this.getClass = getClass;
	this.getTag = getTag;

	this.toClass = toClass;
	this.toTag = toTag;

	this.visible = visible;
};

var MainPanel = new function () {
	this.init = async function () {

		//block translation mode - i need this N hotkey for my own needs >_>

		window.USER_ID = '';		//gelbooru profile ID as 'XXXXX', used for navigation to Favorites page
		window.refreshingSubs = false;
		window.testmode = false;
		window.currentURL = "";

		window.errors = 0;
		window.tasks = 0;

		if (document.cookie.includes("user_id")) {
			USER_ID = document.cookie.split("user_id=")[1].split(";")[0];
		}

		if (pool_tag === "" && USER_ID !== "") {
			pool_tag = USER_ID + "_pool";
		}


		window.fitswitch = false;
		window.fadetrigger = true;
		window.kbShortcutFired = false;


		//paginator placement fix
		var paginatordiv = document.getElementById('paginator');
		var contentdiv = document.getElementsByClassName('content')[0];
		if (paginatordiv && contentdiv) { contentdiv.appendChild(paginatordiv); delete contentdiv; delete paginatordiv; }



		//close tab confirmation
		//document.body.addEventListener('beforeunload', confirmClose, false);

		document.body.appendChild(this.control.getRoot());
		await this.control.drawTemplates();
		if (USER_ID !== "") {
			document.querySelector("#userInfoText").textContent = "Authorized user ";// + USER_ID;
		} else {
			document.querySelector("#userInfoText").textContent = "Guest User, private pools unavailable";
			GM_addStyle(`            
              #mainPanelDiv:hover{
                  max-height: 40px;
                  transition: all 0.2s 0s;
                  opacity: 1;
              }

              div#mainPanelDiv.mainPanelDivLock{
                  max-height: 40px;
                  opacity: 1;
              }

              div#mainPanelDiv{
                  max-height: 25px;
              }

          `);


			document.querySelector("#mainPanelDiv").removeChild(document.querySelector("#poolButtonsDiv"));

		}
		//document.body.addEventListener("onkeydown",keyboardShortcutHandler,false)

		MainPanel.lockState = this.control.getRoot().querySelector('#lockState');
		MainPanel.lockSign = this.control.getRoot().querySelector('#lockSign');
	}

	this.HTML = `
        <div id="mainPanelDiv">
            <div id="mainPanelDivHead">
                <div>
                    <span id="gHead">Gelbooru</span>
                    <a title="T" id="theatrePanelButton" href="javascript:void(0)">T</a>
                    <a title="Show more options" id="moreButton" href="javascript:void(0)">Options</a>
                    <a title="Show information" id="helpButton" href="javascript:void(0)">Info</a>

                    <label class="switch">
                        <input id="lockState" type="checkbox">
                        <span id="lockSign">🔓︎︎︎</span>
                    </label>
                </div>
                <div id="userInfoText"></div>
            </div>


            <div id="tabSwitcherDiv">
                <div id="poolsTabHeadDiv" class="tabHead selectedTabHead">
                    Pools
                </div>

                <div id="listsTabHeadDiv" class="tabHead">
                    Lists
                </div>

                <div id="subsTabHeadDiv" class="tabHead">
                    Subscriptions
                </div>
            
            </div>

            <div id="tabsContainer">
                <div id="poolsTabDiv" class="tabPanel selectedTabPanel">
                    <div id="tagSearchDiv">
                        <div class="input-group">
                            <span class="input-group-btn">
                                <button id="searchButton" class="btn btn-default" type="button">Search</button>
                            </span>
                            <input id="searchField" class="form-control" type="text">
                        </div>
                        <label>
                            <input class="searchModeRB" id="radioAND" name="searchModeRB" value="AND" type="radio"> AND Mode
                        </label>
                        <label>
                            <input class="searchModeRB" id="radioOR" name="searchModeRB" value="OR" type="radio"> OR Mode
                        </label>
                        <div id="searchinfo">Search in all pools if no selected</div>                
                    </div>
                    
                    <div id="poolButtonsDiv"></div>
                </div>

                <div id="listsTabDiv" class="tabPanel">
                    TEST LIST
                </div>

                <div id="subsTabDiv" class="tabPanel">
                </div>
            </div>


        </div>

    `
	this.CSS = `
        .collapseElement{
            visibility: collapse;
        }            


        #tabSwitcherDiv{
            -moz-user-select: none;
            display: flex;
            border-bottom: solid 1px black;
            margin: 0 -5px 2px -5px;
            padding: 0 5px;
            height: 22px;
        }

        #tabsContainer {
            display: -moz-stack;
        }


        .tabHead {
            border: solid 1px black;
            background: #959595;
            padding: 0px 5px;
            font-size: 11px;
            margin: 2px -1px -1px 0;
            border-radius: 2px 2px 0 0;
            user-select: none;
            cursor: pointer;
        }

        .selectedTabHead {
            background: white;
            border-bottom: none;
            margin: 0px -1px -1px 0;
            padding: 2px 6px;
        }

        .tabPanel {
            display: none;
        }

        .selectedTabPanel {
            display: initial;
        }




        /* The switch - the box around the slider */
        .switch {
        position: absolute;
        display: inline-block;
        width: 12px;
        height: 12px;
        right: 5px;
        top: 3px;
        }
      
        /* Hide default HTML checkbox */
        .switch input {display:none;}
        
        #lockSign {
        color: #cbcbcb;
        font-family: Segoe UI Symbol;
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        transition: .2s;
        }

        input:checked + #lockSign {
        color: #2196F3;
        }

        #gHead{
            font-weight: bold;
            font-size: 18px;
            position: absolute;
            color: #0072ff4d;
            right: 7px;
            top: 15px;
            cursor: default;
            -moz-user-select: none;
            z-index: -1;
        }


        #mainPanelDiv {
            padding: 5px 5px 10px 5px;
            min-width: 276px;
            max-height:             40px;
            overflow:               hidden;
            position:               fixed;
            top:                    0;
            right:                  0;
            margin:                 1ex;
            background:             #FFFFFF;
            width:                  auto;
            z-index:                9800;
            opacity:                0.2;
            border: 				1px outset black;
            border-left: 			thick solid #0088E0;

            transition: all 0.2s 0.5s;

            font-family: verdana, sans-serif;
            font-size: 12px;
            line-height: 1.42857143;
            color: #333333;
            box-sizing: border-box;

        }


        #mainPanelDiv label {
            margin: 0;
        }

        #mainPanelDiv button, html input[type="button"], input[type="reset"], input[type="submit"] {
            -moz-appearance: button;
            font-family: verdana, sans-serif;
            font-size: 10px;
            box-sizing: border-box;
            line-height: inherit;
            cursor: pointer;
        }



        #searchField {
            padding: 0;                
            height: unset;                
            width: unset;                
            display: inline;                
            font-size: 12px;                
            line-height: 1.42857143;                
            color: #555555;                
            background-color: #ffffff;                
            background-image: none;                
            border: 1px solid #cccccc;                
            border-radius: 0px;                
            box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);                
            transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;                
            box-sizing: border-box;                
            margin: 0;                
            font-family: verdana,sans-serif;
        }


        #userInfoText{
            font-size: 10px;
        }

        #searchinfo{
            font-size: 10px;
        }

        #mainPanelDiv:hover{
            max-height: 98vh;
            transition: all 0.2s 0s;
            opacity: 1;
        }

        div#mainPanelDiv.mainPanelDivLock {
            max-height: 98vh;
            opacity: 1;
        }

        

        #mainPanelDivHead {
            display: block;
            justify-content: space-between;
            white-space:            nowrap;
            height: 30px;
            margin: 0 0 5px 0;
        }		
        
        #mainPanelDiv ul {
            margin:                 0ex;
        }
        #poolsTabDiv a {
            color: blue;
        }

        #mainPanelDivHead a {
            color: black;
            margin: 0 5px 0 0;
        }	
        
        #poolButtonsDiv {
            font-size: 10px;
            width: 98%;
            overflow-x: hidden;
            overflow-y: scroll;
            position: absolute;
            bottom: 0;
            top: 100px;
            display: contents;
        }
        

        #poolButtonsDiv div {
        margin: 0;
        padding: 0;
        }
        
        .backdiv {
            position:               fixed;
            top:                    0;
            right:                  0;
            background:             #202020;
            width:                  100%;
            height:					100%;
            z-index:                9000;
        }	
        `
	this.objectProperties = {
		radioAND: {
			checked: true
		},
		mainPanelDiv: {
			onclick: function (e) {
				fadetrigger = !fadetrigger;
			},
			ondragover: function (ev) {
				//this.style.opacity = 1;
				//this.style.height = "auto";
				//kbShortcutFired = false;
				ev.preventDefault();
			},
			ondrop: function (ev) {
				ev.preventDefault();
				/*
					var data = ev.dataTransfer.getData("text");
					alert(ev);
					alert(data);
					*/
			},
			onmouseover: function () {
				//this.style.opacity = 1;
				//this.style.height = "auto";
				//reinit();
				kbShortcutFired = false;
			},
			onmouseout: function () {
				if (!kbShortcutFired && fadetrigger) {
					//this.style.opacity = 0.1;
					//this.style.height = "40px";
				}
				kbShortcutFired = false;
			}

		},
		tabSwitcherDiv: {
			onclick: function (e) {
				MainPanel.tabHandler(e);
			}
		},
		lockState: {
			onchange: function (e) {
				MainPanel.toggleLock();
			}
		},
		moreButton: {
			onclick: function () {
				MainPanel.toggle_settings();
			}
		},
		helpButton: {
			onclick: function () {
				MainPanel.printlist();
			}
		},
		theatrePanelButton: {
			onclick: function (ev) {
				ev.preventDefault();
				ev.stopPropagation();
				TheatreOverlay.toggle_theatre();
			}
		},
		searchField: {
			ondragover: function (ev) {
				ev.preventDefault();
			},
			ondrop: function (ev) {
				ev.preventDefault();
				var data = ev.dataTransfer.getData("text");

				if (data.indexOf("&tags=") !== -1) {
					if (this.value && this.value.slice(-1) !== " ") {
						this.value += " ";
					}
					this.value += data.split("&tags=")[1];//.replace(/+/g," ");
				}
			}
		},
		searchButton: {
			onclick: function (e) {
				var tags_request = MainPanel.control.getElement('searchField').value;
				var pools = [];
				var boxes = MainPanel.control.getClass("poolCheckBox");
				for (var box of boxes) {
					if (box.checked) {
						pools.push(box.value);
					}
				}
				if (pools.length > 0 || tags_request.length > 0) {
					if (pools.length == 0 && tags_request.length > 0) {
						for (var box of boxes) { pools.push(box.value); }
					}
					this.disabled = true;
					MainPanel.control.getElement('searchField').disabled = true;
					MainPanel.cross_search(pools, tags_request,
						document.querySelector('input[name=searchModeRB]:checked').value);
					//WIP init();
				}
			}
		}


	}
	this.templates = {
		poolButtons: {
			HTML: `
              <div class="butdivcontainer">
                  <div class="butdivbutton">
                      <input value="" id="cb" class="poolCheckBox" type="checkbox">
                      <input value="" id="pbtn" class="PoolButton" type="button">
                  </div>
                  <div class="butdivlable">
                      <p class="poolMarkP" id="mark">◼</p>
                      <a  title="Go to "
                          href="http://gelbooru.com/index.php?page=pool&amp;s=show&amp;id="
                          class="gotoPoolButton">▶</a>
                  </div>
              </div>
          `,
			CSS: `
              #poolButtonsDiv p {
                  display: inline-block;
              }
              #poolButtonsDiv input {
                  padding: 2px;
                  display: inline-block;
              }
              #poolButtonsDiv br {
                  display: inline-block;
              }

              .butdivcontainer	 {
                  width:                  auto;
                  height: 25px;
                  display: block;
              }


              .butdivbutton	 {
                  float: left;
                  height: 25px;
              }

              .butdivlable	 {
                  float: right;
                  height: 25px;
              }

          `,
			targetName: "poolButtonsDiv",
			dataElements: {

				poolCheckBox: { id: ['value', 'id'] },
				PoolButton: { id: ['id'], name: ['value'] },
				poolMarkP: { id: ['id'] },
				gotoPoolButton: { id: ['href'], name: ['title'] }

			},
			dataProvider: function () {
				var data = [];
				for (var name of POOLS.getNames()) {
					var bname = name.split('_').pop();
					var id = POOLS.getByName(name).id;
					data.push({ id: id, name: bname });
				}
				return data;
			},
			objectProperties: {
				PoolButton: {
					onclick: function (e) {
						MainPanel.poolButtonFunction(this.getAttribute('id').replace('pbtn', ''));
					}
				}
			}
		}
	}

	this.control = new Construct({
		name: "Main Panel",
		element: this
	})

	this.poolButtonFunction = async function (num) {

		var POOL_NUMBER = num;

		if ((window.location.href.split('=').indexOf('post&s') == -1 || window.location.href.split('=').indexOf('view&id') == -1) && currentURL === "") {
			location = 'index.php?page=pool&s=show&id=' + POOL_NUMBER
		}
		else {

			if (currentURL === "") { start_p = window.location.href; }
			else { start_p = currentURL; }

			for (var part of start_p.split('&')) {
				if (part.split('=')[0] == 'id') {
					post_n = part.split('=')[1]
				}
			}

			document.getElementById("mark" + POOL_NUMBER).textContent = "▼";
			p_cookies = document.cookie;
			dest = 'index.php?page=pool&s=import&id=' + POOL_NUMBER;
			tasks += 1;

			await GM.xmlHttpRequest({
				method: 'POST',
				url: 'index.php?page=pool&s=import&id=' + POOL_NUMBER,
				data: 'cookies=' + p_cookies + '&commit=Import&id=' + POOL_NUMBER + '&posts%5B' + post_n + '%5D=0',
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				onload: function (response) {
					document.getElementById("mark" + POOL_NUMBER).textContent = "✓";
					tasks -= 1;
					if (tasks == 0) {
						//windowLable.textContent = "";
					}
				}
			});
		}
	}

	this.toggleLock = function (lock) {
		//MainPanel.control.getRoot().classList.toggle("mainPanelDivLock");
		//document.querySelector('#lockState').checked = true
		var locked;
		if (lock === true || lock === false) {
			locked = lock;
			MainPanel.lockState.checked = lock;
		} else {
			locked = MainPanel.lockState.checked;
		}

		if (locked) {
			MainPanel.lockSign.textContent = "🔒\uFE0E";
			MainPanel.control.getRoot().classList.add("mainPanelDivLock")
		}
		else {
			MainPanel.lockSign.textContent = "🔓\uFE0E"
			MainPanel.control.getRoot().classList.remove("mainPanelDivLock")
		}

	}

	this.toggle_subs = function (mode, obj) {
		sframe = SubscriptionsPanel.control.getRoot();
		if (sframe.style.display === "inline-block" || mode === "hide") {
			sframe.style.display = "none";
		}
		else if (sframe.style.display === "" || sframe.style.display === "none" || mode === "show") {
			sframe.style.display = "inline-block";
		}

		var height = window.innerHeight;
		var width = window.innerWidth;
		sframe.style.left = ((width - sframe.clientWidth) / 2) + "px";
		sframe.style.top = ((height - sframe.clientHeight) / 2) + "px";
	}


	this.autoLockTabs = ["subsTabDiv"];

	this.tabHandler = function (e) {
		if (!e.target.classList.contains('tabHead') || e.target.classList.contains('selectedTabHead')) { return false; }
		var targetName = e.target.id;
		var targetPanelName = targetName.replace('Head', '');
		document.querySelectorAll(".tabPanel").forEach(
			function (el) {
				if (el.id !== targetPanelName) { el.classList.remove('selectedTabPanel') }
				else (el.classList.add('selectedTabPanel'))
			}
		)

		document.querySelectorAll(".tabHead").forEach(
			function (el) {
				if (el.id !== targetName) { el.classList.remove('selectedTabHead') }
				else (el.classList.add('selectedTabHead'))
			}
		)

		if (MainPanel.autoLockTabs.includes(targetPanelName)) { MainPanel.toggleLock(true) };

	}

	this.cross_search = async function (poolIds, tagsRequest, mode) {

		var tags = tagsRequest.split(" ");
		var searchPoolsPosts = {};

		console.log("==Rearching for tags: " + tagsRequest);
		for (var poolId of poolIds) {
			console.log("Requesting pool " + poolId);
			let posts = await (async function () {
				return new Promise((resolve, reject) => {
					GM.xmlHttpRequest({
						url: "https://gelbooru.com/index.php?page=pool&s=show&id=" + poolId,
						method: "GET",
						onload: function (response) {
							var parser = new DOMParser();
							var doc = parser.parseFromString(response.responseText, "text/html");
							var rposts = {};
							console.log("====" + doc.querySelectorAll(".preview").length + " POSTS");

							doc.querySelectorAll(".preview").forEach(el => {
								rposts[el.parentElement.href.split("&id=").pop().split("&")[0]] = el.title.split(" ");
								//console.log(el.parentElement.href.split("&id=").pop().split("&")[0], el.title.split(" "));

							});
							//console.log(rposts);

							resolve(rposts);
						},
						onerror: function (err) {
							console.log(err)
							resolve({});
						}
					});
				})
			})();

			searchPoolsPosts[poolId] = posts;
		}

		//console.log(searchPoolsPosts);

		var searchPosts = {};
		for (var poolId of Object.keys(searchPoolsPosts)) {
			console.log(poolId);

			var pool = searchPoolsPosts[poolId]
			for (var postId of Object.keys(pool)) {

				//if (mode === "OR") {
				if (!searchPosts[postId]) {
					searchPosts[postId] = pool[postId];
				}
				//} else {
				//}
				//WIP no AND mode
			}
		}
		console.log("SEARCHING IN " + Object.keys(searchPosts).length + " POSTS");


		var result = [];

		var match = true;
		var tagFound = false;

		for (var postId of Object.keys(searchPosts)) {
			for (var tag of tags) {
				match = true;
				tagFound = false
				for (var postTag of searchPosts[postId]) {
					if (wcmatch(postTag, tag)) {
						tagFound = true;
						break;
					}
				}
				if (!tagFound) {
					match = false;
					break;
				}
			}
			if (match) { result.push({ id: postId, tags: searchPosts[postId] }) }
		}

		console.log("FOUND: " + result.length);



		MainPanel.control.getElement('searchButton').disabled = false;
		MainPanel.control.getElement('searchField').disabled = false;

	}
};

var ImageOverlay = new function () {
	this.init = function () {
		window.currentURL = "";
		window.currentPOST = 0
		window.pagePostsList = { id: {}, num: {} };
		window.notesContainer = [];

		this.processPosts();

		this.stopMouseActions = false;
		document.body.addEventListener('mousedown', ImageOverlay.stopAction, false);

		//adding onclick to post image
		if (mainpic = document.getElementById("image")) {
			mainpic.onclick = this.fit;
			mainpic.style.cursor = "zoom-in";
		}

	}
	this.HTML = `
      <div id="postViewDiv">
          <div class="navButDiv" id="navRightDiv"></div>
          <div class="navButDiv" id="navLeftDiv"></div>
          <div id="navTopDiv"></div>
          <div class="navButDiv" id="navCloseDiv"></div>

          <div id="imgContDiv">
              <div id="imgHolderDiv">
                  <img id="postViewImg"/>
                  <div class="overlayIcon" id="navCloseIconDiv">×</div>
                  <div class="overlayIcon" id="navNewTabIconDiv">New Tab</div>
                  <div class="navButDivCln" id="navRightInnerDiv">
                      <div class="overlayIcon" id="navRightIconDiv">></div>
                  </div>
                  <div class="navButDivCln" id="navLeftInnerDiv">
                      <div class="overlayIcon" id="navLeftIconDiv"><</div>
                  </div>
              </div>
          </div>
			<div id="tagsPanel">
				<div id="tagsDivLabel" class="DivLabel">TAGS</div>
				<div id="tagsContainer">
					<div class="sidebar3" id="viewTagsDiv"></div>
				</div>
			</div>

		  
			<div id="commentsPanel">
				<div id="commentsDivLabel" class="DivLabel">COMMENTS</div>
				<div id="commentsContainer">
					<div id="viewCommentsDiv"></div>
				</div>
			</div>
		<div class="overlayIcon" id="infoDiv">Loading...</div>
      </div>
    `
	this.CSS = `

          .zeroWidth {
              width:0 !important;
          }
          #postViewDiv {
              text-align: center;
              position:               fixed;
              top:                    0;
              right:                  0;
              width:                  100%;
              height:					100%;
              background: rgba(0, 0, 0, 0.75);
          }


          #navTopDiv{
              position: absolute;
              height: 15%;
              width: 50%;
              top: 0;
              left: 0;
              display: inline-block;
              background: rgba(200, 200, 200, 0.3);
              opacity: 0;
          }

          .navHeaderDiv{
              color: #F0F0F0;
              font-size: 2em;
              font-family: Tahoma;
              text-shadow:
                  -2px -1px 0 #006FFA,  
                  2px -1px 0 #006FFA,
                  -2px 1px 0 #006FFA,
                  2px 1px 0 #006FFA;
              position: absolute;
              height: 5%;
              width: 100%;
              top: 0;
              left: 0;
              display: inline-block;
              background: rgba(200, 200, 200, 0);
              opacity: 0;
          }

          .navButDiv{
              position: absolute;
              height: 100%;
              top: 0;
              display: inline-block;
              background: rgba(200, 200, 200, 0);
          }

          .navButDivCln{
              position: absolute;
              height: 100%;
              top: 0;
              display: inline-block;
              background: rgba(200, 200, 200, 0);
          }

          #navCloseDiv{
              right: 0;
              top:0;
              width: 50%;
              height: 30%;
          }

          #navNewTabIconDiv{
              width: 87px;
              top: -36px;
              position: absolute;
              display: inline-grid;
              left: -36px;
              font-weight: 400;
          }

          #navCloseIconDiv{
              left: 100%;
              top: -36px;
              width: 30px;
          }

          #navLeftIconDiv{
              left: -36px;
              top: 50%;
              width: 30px;
          }

          #navRightIconDiv{
              left: 100%;
              top: 50%;
              width: 30px;
          }

          #infoDiv{
              transform: translateX(-50%);
              font-weight: 400;
              left: 50%;
              padding: 0 10px 0 10px;
              font-size: 10px;
              height: auto;
              bottom: 5px;
          }

          #infoDiv:hover{
              opacity: 1;
          }

          .overlayIcon{ 
              cursor: pointer;            
              height: 30px;                
              opacity: 0.2;                
              background: #292929;                
              border-radius: 360px;                
              border: 2px solid #FFF;                
              position: absolute;                
              font-size: 16px;                
              text-align: center;                
              font-weight: 600;                
              margin: 3px;
              color: #FFFFFF;
          }

          #navRightDiv{
              left: 50%;
              width: 50%;
          }

          #navLeftDiv{
              left: 0;
              width: 50%;
          }

          #navRightInnerDiv{
              left: unset;
              right: 0;
              width: 30%;
              max-width: 220px;
          }
          #navLeftInnerDiv{
              left: 0;
              width: 30%;
              max-width: 220px;
          }

          #imgContDiv {
              position: relative;
              top: 50%;
              transform: translateY(-50%);
              max-height: 100%;  
              max-width: 100%; 
              position: relative;
              display: inline-block;

          }

          #imgHolderDiv {
              max-height: 100%;  
              max-width: 100%; 
          }

          #imgHolderDiv video {
              max-height: 88vh;  
              max-width: 90vh; 
          }


          #postViewImg {
              top: 0;
              left: 0;
              bottom: 0;
              right: 0;
              
              max-height: 88vh;  
              max-width: 90vw; 
              width: auto;
              height: auto;
          }


          #viewTagsDiv {
              position: relative;
              background: whitesmoke;
          }	

          
          #tagsPanel{
              z-index: 9000;
              position: fixed;
              text-align: left;
              top: 20%;
              max-height: 60%;
              border-radius: 0 15px 15px 0px;
              background: whitesmoke;
              display: flex;
              transition: left 0.2s;
              transition-delay: 0.5s;
              left: -290px;
              width: 300px;
          }

          #tagsPanel:hover{
              transition-delay: 0s;
              left: 0px;
          }

          #tagsContainer{
              position: relative;
              text-align: left;
              overflow-y: scroll;
              max-height: 100%;
              margin: 10px 20px 10px 10px;
              display: inline-block;
              width: 100%;
		  }
		  
          #commentsContainer{
			position: relative;
			text-align: left;
			overflow-y: scroll;
			overflow-x: visible;
			max-height: 100%;
			display: inline-block;
			width: 100%;
		}


		.DivLabel{
			color: black;
			text-align: center;
			font-size: 10px;
			font-weight: bold;
			position: absolute;
			top: 0;
		}

		#tagsDivLabel{
			writing-mode: vertical-rl;
			text-orientation: upright;
			right: 0;
			width: 5px;
			margin-right: -2px;
			height: 100%;
		}
		#commentsDivLabel{
			left: 10px;
			height: 0px;
			margin-top: -2px;
		}


		#commentsPanel {
			z-index: 9000;
			position: fixed;
			text-align: left;
			bottom: 0px;
			height: 10px;
			max-height: 40%;
			max-width: 50%;
			min-width: 150px;
			border-radius: 15px 15px 0px 0px;
			background: whitesmoke;
			display: flex;
			transition: height 0.2s, width 0.2s;
			transition-delay: 0.5s;
			left: 15px;
			width: 150px;
		}

		#commentsContainer{
			top:15px;
		}

		#commentsPanel:hover{
			transition-delay: 0s;
			height: unset;
			width: unset;
		}

		#viewCommentsDiv{
			top: 0px;
			left: 0px;
			position: relative;
			display: grid;
			padding-left: 10px;
			padding-right: 10px;
		}




          
    `
	this.objectProperties = {
		navRightDiv: {
			onclick: function (event) {
				event.stopPropagation();
				ImageOverlay.viewImage(event, "next");
			},
			onmouseover: function () { ImageOverlay.control.getElement('navRightIconDiv').style.opacity = "1" },
			onmouseout: function () { ImageOverlay.control.getElement('navRightIconDiv').style.opacity = "0.2" }
		},
		navLeftDiv: {
			onclick: function (event) {
				event.stopPropagation();
				ImageOverlay.viewImage(event, "prev");
			},
			onmouseover: function () { ImageOverlay.control.getElement('navLeftIconDiv').style.opacity = "1" },
			onmouseout: function () { ImageOverlay.control.getElement('navLeftIconDiv').style.opacity = "0.2" }
		},
		navTopDiv: {
			onclick: function (event) {
				event.stopPropagation()
				GM.openInTab(currentURL);
			},
			onmouseover: function () { ImageOverlay.control.getElement('navNewTabIconDiv').style.opacity = "1" },
			onmouseout: function () { ImageOverlay.control.getElement('navNewTabIconDiv').style.opacity = "0.2" }
		},
		navCloseDiv: {
			onclick: function (event) {
				event.stopPropagation(); ImageOverlay.viewImage(event, "close")
			},
			onmouseover: function () { ImageOverlay.control.getElement('navCloseIconDiv').style.opacity = "1" },
			onmouseout: function () { ImageOverlay.control.getElement('navCloseIconDiv').style.opacity = "0.2" }
		},
		navCloseIconDiv: {
			onclick: function (event) {
				event.stopPropagation(); ImageOverlay.viewImage(event, "close")
			},
			onmouseover: function () { this.style.opacity = "1" },
			onmouseout: function () { this.style.opacity = "0.2" }
		},
		navRightInnerDiv: {
			onclick: function (event) {
				event.stopPropagation();
				ImageOverlay.viewImage(event, "next");
			},
			onmouseover: function () { ImageOverlay.control.getElement('navRightIconDiv').style.opacity = "1" },
			onmouseout: function () { ImageOverlay.control.getElement('navRightIconDiv').style.opacity = "0.2" }
		},
		navLeftInnerDiv: {
			onclick: function (event) {
				event.stopPropagation();
				ImageOverlay.viewImage(event, "prev");
			},
			onmouseover: function () { ImageOverlay.control.getElement('navLeftIconDiv').style.opacity = "1" },
			onmouseout: function () { ImageOverlay.control.getElement('navLeftIconDiv').style.opacity = "0.2" }
		},
		navNewTabIconDiv: {
			onclick: function (event) {
				event.stopPropagation()
				GM.openInTab(currentURL);
			},
			onmouseover: function () { this.style.opacity = "1" },
			onmouseout: function () { this.style.opacity = "0.2" }
		}



		//FUNCTION LIST END
	}
	this.control = new Construct({
		name: "Image Overlay",
		element: this
	})


	this.stopAction = function (e) {
		if (ImageOverlay.stopMouseActions && e.target.tagName !== "IMG") {
			e.preventDefault();
		}
	};

	this.processPosts = function () {
		if (window.location.href.indexOf('s=list') === -1 && window.location.href.indexOf('page=pool&s=show') === -1) { return false }

		var pagePosts = document.querySelectorAll('article.thumbnail-preview img');
		var curN = 0
		for (var ppost of pagePosts) {
			var pID;
			if (ppost.getAttribute('alt').indexOf('Image') === 0) { pID = ppost.getAttribute('alt').slice(7); }
			else { pID = ppost.parentNode.id.slice(1); }

			pagePostsList.id[pID] = curN;
			pagePostsList.num[curN] = pID;
			curN++;
			ppost.style.cursor = "zoom-in";
			ppost.onclick = function (event) { ImageOverlay.viewImage(event, this) };
		}

		console.log(`Page processed, posts found: ` + curN);
	}

	this.viewImage = function (event, action) {
		var clickObj = event.target;
		notesContainer = [];
		event.preventDefault();

		switch (action) {
			case 'next':
				currentPOST++;
				if (!pagePostsList.num[currentPOST]) { currentPOST--; return; }
				ImageOverlay.control.erase();
				action = pagePostsList.num[currentPOST];
				clickObj = document.getElementById('p' + action);
				if (clickObj.tagName === "A") { clickObj = clickObj.firstElementChild }
				else { clickObj = clickObj.firstElementChild.firstElementChild }
				break;
			case 'prev':
				currentPOST--;
				if (!pagePostsList.num[currentPOST]) { currentPOST++; return; }
				ImageOverlay.control.erase();
				action = pagePostsList.num[currentPOST];
				clickObj = document.getElementById('p' + action);
				if (clickObj.tagName === "A") { clickObj = clickObj.firstElementChild }
				else { clickObj = clickObj.firstElementChild.firstElementChild }
				break;
			case 'close':
				ImageOverlay.stopMouseActions = false;
				document.body.style['overflow-y'] = 'auto';
				//document.body.style['max-width'] = null;
				var cont = document.querySelector(".contain-push");
				if (cont && cont !== null) {
					cont.style['max-width'] = null;
				}
				ImageOverlay.control.erase();
				currentURL = "";
				return;
			default:
				ImageOverlay.stopMouseActions = true;

				//document.body.style['max-width'] = document.body.clientWidth+'px';
				var cont = document.querySelector(".contain-push");
				if (cont && cont !== null) {
					cont.style['max-width'] = cont.clientWidth + 'px';
				}

				document.body.style['overflow-y'] = 'hidden';
				action = action.parentNode.href.split('view&id=')[1].split('&')[0];
				break;
		}

		document.body.appendChild(ImageOverlay.control.getRoot());
		currentPOST = pagePostsList.id[action];
		currentURL = "https://gelbooru.com/index.php?page=post&s=view&id=" + action;

		ImageOverlay.getPost(currentURL, clickObj.src);

	}
	this.getPost = async function (r_url, thumb_src) {
		await GM.xmlHttpRequest({
			method: "GET",
			url: "https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1&id=" + r_url.split('=').pop(),
			onload: function (response) {

				var postInfo;
				if (response.responseText && response.responseText.indexOf('success="false"') === -1) {
					postInfo = JSON.parse(response.responseText).post['0'];
					if (currentURL !== r_url) { return; }
				}

				if (postInfo) {
					var postInfo = JSON.parse(response.responseText).post['0'];
					if (currentURL !== r_url) { return; }

					var postViewImg = ImageOverlay.control.getRoot().querySelector("#postViewImg");

					var postExt = postInfo.file_url.split('.').pop();

					if (postExt === 'webm' || postExt === 'mp4') {

						videoImg = document.createElement("video");
						//videoImg.setAttribute("height", postInfo.height);
						videoImg.setAttribute("autoplay", true);
						videoImg.setAttribute("controls", true);
						videoImg.setAttribute("loop", true);
						videoImg.setAttribute("src", postInfo.file_url);

						var container = ImageOverlay.control.getElement('imgHolderDiv');
						container.removeChild(container.firstElementChild);
						container.appendChild(videoImg);

						var navLeft = container.querySelector('#navLeftInnerDiv');
						var navRight = container.querySelector('#navRightInnerDiv');


						container.querySelector('#navRightIconDiv').onmouseover = navRight.onmouseover;
						container.querySelector('#navRightIconDiv').onmouseout = navRight.onmouseout;
						container.querySelector('#navLeftIconDiv').onmouseover = navRight.onmouseover;
						container.querySelector('#navLeftIconDiv').onmouseout = navRight.onmouseout;


						navLeft.onmouseover = null;
						navLeft.onmouseout = null;
						navRight.onmouseover = null;
						navRight.onmouseout = null;

						navLeft.onclick = null;
						navRight.onclick = null;

						navLeft.classList.toggle("zeroWidth");
						navRight.classList.toggle("zeroWidth");


						//temp tags
						var postTags = postInfo.tags.split(" ");
						for (var postTag of pastTags) {
							ImageOverlay.control.getRoot().querySelector("#viewTagsDiv").innerHTML +=
								`<li class="tag-type-general">` +
								`<a href="index.php?page=post&amp;s=list&amp;tags=${postTag}">${postTag.replace(/_/g, " ")}</a>` +
								`</li>`;
						}
					}
					else if (postInfo.sample == 1) {
						//https://img2.gelbooru.com//samples/66/b9/sample_66b9abd58a5c133f7ed77322b287b425.jpg
						//https://img2.gelbooru.com/images/66/b9/66b9abd58a5c133f7ed77322b287b425.jpg
						let link = postInfo.sample_url;

						postViewImg.setAttribute("src", link);

						ImageOverlay.control.getElement('infoDiv').textContent =
							"Sample: " + postInfo.sample_width + "x" + postInfo.sample_height;


						ImageOverlay.control.getElement('infoDiv').appendChild(document.createElement('br'));
						var replace = document.createElement('textNode');

						replace.textContent = "Replace to " + postInfo.width + "x" + postInfo.height;
						replace.style.cursor = "pointer";
						ImageOverlay.control.getElement('infoDiv').appendChild(replace);

						ImageOverlay.control.getElement('infoDiv').onclick = function () {
							postViewImg.setAttribute("src", postInfo.file_url);
							this.innerHTML = "Loading...";
							postViewImg.onload = function () {
								ImageOverlay.control.getElement('infoDiv').innerHTML
									= "Original:" + postInfo.width + "x" + postInfo.height;
							}
						}


					} else {
						postViewImg.setAttribute("src", postInfo.file_url);
						ImageOverlay.control.getElement('infoDiv').textContent =
							"Original:" + postInfo.width + "x" + postInfo.height;
					}
				} else {
					if (currentURL !== r_url) { return; }
					var postViewImg = ImageOverlay.control.getRoot().querySelector("#postViewImg");
					var target_src = thumb_src.replace('thumbnails', '/images').replace('thumbnail_', '');
					postViewImg.setAttribute("src", target_src);
					postViewImg.onerror = function (event) {
						var img = event.target;
						var exts = ['jpg', 'png', 'jpeg', 'bmp', 'gif']
						var currentExt = img.src.split('.')[img.src.split('.').length - 1]
						img.src = img.src.replace(currentExt, exts[exts.indexOf(currentExt) + 1]);
					}

					ImageOverlay.control.getElement('infoDiv').textContent =
						"Gelbooru API not available";

				}

			}
		});

		await GM.xmlHttpRequest({
			url: r_url,
			method: "GET",
			onload: function (response) {
				var parser = new DOMParser();
				var doc = parser.parseFromString(response.responseText, "text/html");

				var tagsHTML = doc.querySelector("ul#tag-list").innerHTML.split('<h3>Statistics</h3>')[0];
				ImageOverlay.control.getRoot().querySelector("#viewTagsDiv").innerHTML = tagsHTML;

				let comCount = doc.querySelectorAll(".commentBox").length;
				ImageOverlay.control.getRoot().querySelector("#commentsDivLabel").textContent += ": " + comCount;
				var commentsHTML = "";
				doc.querySelectorAll(".commentBox").forEach(el => {
					commentsHTML += el.outerHTML;
				})
				ImageOverlay.control.getRoot().querySelector("#viewCommentsDiv").innerHTML = commentsHTML;

				/*
				var postNotesContainer = doc.querySelector('#notes');
				if (postNotesContainer.childElementCount > 0) {       //notes handling

					//data-width="181" data-height="1128" data-x="1013" data-y="20" data-id="180512" data-body="Th
					for (note of postNotesContainer.children) {
						notesContainer.push({
							text: note.getAttribute('data-body'),
							posX: note.getAttribute('data-x'),
							posY: note.getAttribute('data-y'),
							width: note.getAttribute('data-width'),
							height: note.getAttribute('data-height')
						});
					}
					ImageOverlay.showNotes();
				}
				*/

			}
		});

	}

	this.showNotes = function (mode) {
		if (notesContainer.length > 0) {
			for (note of notesContainer) {
				console.log(note.text)
			}
		}
	}


	this.fit = function () {

		var image = document.getElementById("image");
		if (!image) { return false; }

		if (!fitswitch) {
			window.orw = image.style.width;
			window.orh = image.style.height;
			window.opos = image.style.position;

			var winH = window.innerHeight;
			var winW = window.innerWidth;

			image.style.cursor = "zoom-out";

			if ((image.width / image.height) <= (winW / winH)) {
				image.style.width = "unset";
				image.style.height = winH + "px";
			} else {
				image.style.height = "unset";
				image.style.width = winW + "px";
			}

			//image.style.margin.right="unset";

			image.style.position = "fixed";
			image.style.zIndex = "9001";

			image.style.left = ((winW - image.width) / 2) + "px";
			image.style.top = ((winH - image.height) / 2) + "px";
			document.body.style['overflow-y'] = 'hidden';

			window.backdiv = document.createElement('div');
			backdiv.setAttribute("class", "backdiv");
			backdiv.onclick = MainPanel.fit;
			document.body.appendChild(backdiv);


			fitswitch = !fitswitch;
		}
		else {
			image.style.width = orw;
			image.style.height = orh;

			image.style.cursor = "zoom-in";
			image.style.position = opos;
			document.body.style['overflow-y'] = 'scroll';

			backdiv.parentNode.removeChild(backdiv);
			fitswitch = !fitswitch;
			//image.style.margin.right="5em";
		}
	}
};
//        font-family: Segoe UI Symbol;
var SubscriptionsPanel = new function () {
	this.init = async function () {
		window.subsDeleteMode = false;
		window.refreshingSubs = false;

		this.checkDelay = false;

		console.log(performance.now(), "check subs...");
		var currentPageTag = await this.check_subs();
		console.log(performance.now(), "...done");

		//document.body.addEventListener('click', function (e) {
		//    if (e.button == 0) MainPanel.toggle_subs("hide");
		//}
		//);

		console.log(performance.now(), "drawing...");
		document.body.querySelector("#subsTabDiv").appendChild(this.control.getRoot());
		document.querySelector('#currentPageTag').textContent = currentPageTag;
		await this.control.drawTemplates();
		console.log(performance.now(), "building tags list...");
		await this.buildList();
		console.log(performance.now(), "...done");

		/*
		this.control.toTag("a",
			function (el) { el.addEventListener("click", function (event) { event.stopPropagation(); }) });
		this.control.toTag("button",
			function (el) { el.addEventListener("click", function (event) { event.stopPropagation(); }) });
		this.control.toTag("input",
			function (el) { el.addEventListener("click", function (event) { event.stopPropagation(); }) });
		this.control.toTag("div",
			function (el) { el.addEventListener("click", function (event) { event.stopPropagation(); }) });
		this.control.getRoot().addEventListener("click", function (event) { event.stopPropagation(); })
		*/
	}
	this.HTML = `

          <div id="SubsWindow">
            <div id="sframeTopDiv">
                <div id="currentPageTag">no tags available</div>
                <button title="Subscribe" class="SubsWindowButtons" id="subsAddButton">
                    Subscribe
                </button>

                <br>
                <input id="tagSearchBox" value="" type="text">

                <button title="Refresh All" class="SubsWindowButtons" id="subsRefreshAllButton">
                    Refresh All
                </button>

                <button id="subsDeleteModeButton" class="SubsWindowButtons" title="Delete Mode" href="javascript:void(0)">⌦</button>
            </div>
            <div id="subsframe">
                <table id="newSubsTable"></table>
                <table id="substable">
                    <tbody>

                    </tbody>
                </table>
            </div>
          </div>


      `
	this.CSS = `


        #currentPageTag {
            width: calc( 100% - 72px );
            height: 18px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: inline-block;
            margin: 0 0 0 0;
            line-height: 1.2;
            vertical-align: -moz-middle-with-baseline;
            font-size: 80%;
            color: grey;
        }
        .newSubPost{
            border: 3px solid #2aff00 !important;
        }

        #SubsWindow hr {
            margin: 0;
            width: 150px;
        }

        #tagSearchBox{
            font-size: 9px;
            width: 157px;
        } 

        #SubsWindow		 {
            overflow-y: hidden;
            overflow-x: hide;
        }

        #sframeTopDiv {
            width: 260px;
            height: 50px;
        }
                

        #subsframe {
            height: calc(98vh - 124px);
            overflow-y: scroll;
        }

        .SubsWindowButtons		 {
            color: #FFFFFF;
            background: #bad0e4;
            display: inline-block;
            vertical-align: middle;
            margin-left: 3px;
            border-radius: 2px;
            padding: 0px 2px 2px 2px;
            background-color: #0088E0;
            font-family: Helvetica,arial,sans-serif;
            line-height: normal;
            cursor: pointer;
            border: none;
        }

        .SubsWindowButtons:hover, .SubsWindowButtons:focus {
            color: #FFFFFF;
        }

        #subsDeleteModeButton {
            font-size: 10px;
            margin-right: 8px;
        }

        .showHidden {
            visibility: inherit !important;
        }
        .CounterRed {
            background-color: #c60000 !important;
        }
        .CounterGrey {
            background-color: #a0a0a0 !important;
        }



      `
	this.objectProperties = {
		subsRefreshAllButton: {
			onclick: function (e) {

				refreshingSubs = true;
				var newSubsTable = document.getElementById('newSubsTable');
				var substable = document.getElementById('substable');
				newSubsTable.innerHTML = "";
				var row = newSubsTable.insertRow(0);
				var counterCell = row.insertCell(0);

				var sublinks = [];
				for (var name of Object.keys(SubscriptionsPanel.subsRows)) {
					if (SubscriptionsPanel.subsRows[name].visible === true) {
						sublinks.push(name);
					}
				}

				var totalSubs = sublinks.length;
				counterCell.innerHTML = "0/" + totalSubs;



				if (sublinks.length === 0) { return; }
				(async function (e) {

					var checked = 0;
					var maxCheck = sublinks.length;

					async function checkNextSub(num) {
						SubscriptionsPanel.refresh_sub(sublinks[num]).then(

							function () {
								checked++;
								counterCell.innerHTML = checked + "/" + totalSubs;
								if (checked < maxCheck) {
									checkNextSub(checked)
								} else {
									refreshingSubs = false;
								}

							}

						)
					}
					checkNextSub(checked);
				})();
			}
		},
		subsAddButton: {
			onclick: function (e) {
				(async function (e) {
					if (window.location.href.indexOf('s=list') !== -1) {
						var pageTag = decodeURIComponent(window.location.href.split('tags=')[1].split('&')[0].replace(/\+/g, ' '));
						var currentPageSub = SUBS.getByTag(pageTag);
						var currentPageTags = (currentPageSub === null ? "" : currentPageSub.subTags.join(" "));

						var tags = prompt("Set tags, space separated", currentPageTags).trim();
						if (tags === "") { tags = [] } else { tags = tags.split(' '); }
						await SUBS.newSub(
							pageTag,
							{
								lastPost: document.getElementsByClassName('thumb')[0].getAttribute('id').split('s')[1],
								subTags: tags
							}
						);
						SubscriptionsPanel.control.drawTemplates();
						SubscriptionsPanel.buildList();
					}
				})();
			}
		},
		subsDeleteModeButton: {
			onclick: function (e) {
				subsDeleteMode = !subsDeleteMode;
				if (subsDeleteMode) {
					this.classList.add('CounterRed');
					SubscriptionsPanel.control.toClass('subsRefreshButton',
						function (el) { el.style.display = "none"; });
					SubscriptionsPanel.control.toClass('subsDeleteButton',
						function (el) { el.style.display = "table-cell"; })
				} else {
					this.classList.remove('CounterRed');
					SubscriptionsPanel.control.toClass('subsRefreshButton',
						function (el) { el.style.display = "table-cell"; });
					SubscriptionsPanel.control.toClass('subsDeleteButton',
						function (el) { el.style.display = "none"; })
				}
			}
		},
		tagSearchBox: {
			onkeydown: function (e) {
				if (e.keyCode == 13) {
					//WIP
					SubscriptionsPanel.filterList(e.target.value);
				}
				//else if (e.keyCode == 27) {}
			}
		}
	}
	this.templates = {
		subscriptionLine: {
			targetName: "substable",
			HTML: `

                    <table id="substable">
                        <tbody id="subsTableBody">
                            <tr id="subsRow-" class="subsRowClass">
                                <td id="refbutcell - " class="subsRefreshCell">
                                    <div>
                                    <button title="Refresh" id="subref - " class="subsRefreshButton">↻</button>
                                    <button title="Delete" id="subdel - " class="subsDeleteButton">X</button>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <div class="subsLine">
                                            <a class="subsLink" href="http://gelbooru.com/index.php?page=post&amp;s=list&amp;tags="></a>
                                            <li class="subsPostNumber" id="subnum - ">0</li>
                                        </div>
                                        <div class="subsTagsDiv">
                                            <p class="subsTags" id="subtags - "></p>
                                            <input data-lpignore="true" id="tagsbox - " class="subsTagsEditBox" value="" type="search">
                                        </div>
                                        <hr>
                                        <div class="subsCommentDiv">
                                            <p class="subsComment" id="subcomm - "></p>
                                            <input data-lpignore="true" id="commbox - " class="subsCommentEditBox" value="" type="search">
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

              `,
			CSS: `
                    .subsLine		 {
                        margin-top: 1px;
                        margin-bottom: 2px;
                        display:    flex;
                    }
        
                    .subsPostNumber, .subsLine p		 {
                        margin-bottom: 0px;
                        display:    flex;
                    }
        
                    .subline a		 {
                        height: 1em;
                    }
        
                    .subsPostNumber		 {
                        cursor:default;
                        visibility: hidden;
                        color: #FFFFFF;
                        background: #bad0e4;
                        border-radius: 2px;
                        padding: 1px 1px 1px 1px;
                        background-color: #0088E0;
                        font-family: Helvetica,arial,sans-serif;
                        font-size: 12px;
                        font-weight: 300;
                        letter-spacing: 1px;
                        line-height: normal;
                    }
        
                    .subsRefreshButton 		 {
                        color: #FFFFFF;
                        background: #bad0e4;
                        display: table-cell;
                        width: 18px;
                        height: 18px;
                        vertical-align: baseline;
                        margin-left: 3px;
                        margin-right: 3px;
                        border-radius: 2px;
                        padding: 0px 2px 2px 2px;
                        background-color: #0088E0;
                        font-family: Helvetica,arial,sans-serif;
                        font-size: 12px;
                        font-weight: 400;
                        letter-spacing: 1px;
                        line-height: normal;
                        cursor: pointer;
                        border: none;
                    }
        
                    .subsDeleteButton 		 {
                        color: #FFFFFF;
                        background: #bad0e4;
                        display: none;
                        width: 18px;
                        height: 18px;
                        vertical-align: baseline;
                        margin-left: 3px;
                        margin-right: 3px;
                        border-radius: 2px;
                        padding: 0px 2px 2px 2px;
                        background-color: #c60000;
                        font-family: Helvetica,arial,sans-serif;
                        font-size: 12px;
                        font-weight: 400;
                        letter-spacing: 1px;
                        line-height: normal;
                        overflow:hidden;
                        cursor: pointer;
                        border: none;
                    }
        
        
                    .subsRefreshButton:hover {
                    cursor:pointer;
                    }
        
        
                    .subsComment, .subsTags{
                        margin-bottom: 0;
                        margin-top: 0;
                        font-size: 9px;
                        color: #999999;
                        font-family: verdana;
                        max-width: 150px;
                    }   
                    
                    .subsComment, .subsTags{
                        color: #999999;
                    }   
                    .subsTags{
                        color: #415671;
                    }   
                    
                    .subsCommentEditBox, .subsTagsEditBox{
                        font-size: 9px;
                        display: none;
                    }
                
                    .subsRowClass {
                        border-top: solid #708aaa 1px;
                    }
                
                `,
			altPlaceFunction: function (el, target) {

				var targetRow = target.insertRow();
				var targetCell0 = targetRow.insertCell();
				var targetCell1 = targetRow.insertCell();

				var targetId = el.rows[0].id

				targetRow.id = targetId;
				targetRow.className = "subsRowClass";
				SubscriptionsPanel.subsRows[targetId.slice(8)] = { el: targetRow, visible: true, subTags: [] };

				targetCell0.appendChild(el.rows[0].cells[0].firstElementChild);
				targetCell1.appendChild(el.rows[0].cells[1].firstElementChild);

				//console.log(el.rows[0]);
				//console.log(tergetRow);

			},
			dataElements: {
				subsRowClass: { name: ['id'] },
				subsRefreshCell: { name: ['id'] },
				subsRefreshButton: { name: ['id'] },
				subsDeleteButton: { name: ['id'] },
				subsLink: { name: ['id', 'href', 'textContent'] },
				subsPostNumber: { name: ['id'] },
				subsComment: { name: ['id'], comment: ['textContent'] },
				subsCommentEditBox: { name: ['id'], comment: ['value'] },
				subsTags: { name: ['id'], tags: ['textContent'] },
				subsTagsEditBox: { name: ['id'], tags: ['value'] }
			},
			dataProvider: async function () {
				var data = [];
				for (var name of SUBS.getTags()) {
					var comm = SUBS.getByTag(name).comment;
					var subTags = SUBS.getByTag(name).subTags.join(' ');
					if (subTags === '') { subTags = '%noTags' }
					data.push({ name: name, comment: comm, tags: subTags });
				}
				return data;
			},
			objectProperties: {
				subsRefreshButton: {
					onclick: function (e) {
						var mytag = this.getAttribute('id').split(" - ")[1];
						SubscriptionsPanel.refresh_sub(mytag);
					}
				},
				subsDeleteButton: {
					onclick: function (e) {
						var target = this;
						(async function (e) {
							var mytag = target.getAttribute('id').split(" - ")[1];
							await SUBS.removeSub(mytag);
							await SubscriptionsPanel.control.drawTemplates();
							SubscriptionsPanel.buildList();
							SubscriptionsPanel.control.toClass('subsRefreshButton',
								function (el) { el.style.display = "none"; });
							SubscriptionsPanel.control.toClass('subsDeleteButton',
								function (el) { el.style.display = "table-cell"; })
						})()
					}
				},
				subsComment: {
					onclick: function (e) {
						var editboxEl = this.parentNode.lastElementChild;
						editboxEl.value = this.textContent;
						this.style.display = "none";
						editboxEl.style.display = "block";
					}
				},
				subsCommentEditBox: {
					onkeydown: function (e) {
						var target = this;
						if (e.keyCode == 13) {
							(async function (e) {
								var myID = target.getAttribute('id');
								var myName = myID.slice(10)
								var commEl = document.getElementById('subcomm - ' + myName);
								var ncomm = target.value;
								if (ncomm == "") { ncomm = "..." }
								commEl.innerText = ncomm;
								await SUBS.setSub(myName, { comment: ncomm });
								target.style.display = "none";
								commEl.style.display = "block";
							})();

						} else if (e.keyCode == 27) {

							var myName = target.getAttribute('id').slice(10)
							var commEl = document.getElementById('subcomm - ' + myName);

							target.style.display = "none";
							commEl.style.display = "block";
						}
					}
				},
				subsTags: {
					onclick: function (e) {
						var editboxEl = this.parentNode.lastElementChild;
						editboxEl.value = this.textContent;
						this.style.display = "none";
						editboxEl.style.display = "block";
					}
				},
				subsTagsEditBox: {
					onkeydown: function (e) {
						var target = this;
						if (e.keyCode == 13) {
							(async function (e) {
								var myID = target.getAttribute('id');
								var myName = myID.slice(10)
								var commEl = document.getElementById('subtags - ' + myName);
								var ntag = target.value.trim();
								var ntagArr;
								if (ntag === "" || ntag === "%noTags") { ntagArr = []; ntag = "%noTags" } else { ntagArr = ntag.split(' ') }
								commEl.innerText = ntag;
								await SUBS.setSub(myName, { subTags: ntagArr });
								target.style.display = "none";
								commEl.style.display = "block";
								SubscriptionsPanel.buildList();
							})();

						} else if (e.keyCode == 27) {

							var myName = target.getAttribute('id').slice(10)
							var commEl = document.getElementById('subtags - ' + myName);

							target.style.display = "none";
							commEl.style.display = "block";
						}
					}
				}
			}
		}
	}

	this.control = new Construct({
		name: "Subscriptions Panel",
		element: this
	});

	this.subsRows = {}; //name:{el:rowElement, visible:bool, subTags:[]}
	this.subTags = { '%noTags': [] }; //tag:[name,name]

	this.buildList = async function () {
		for (var name of Object.keys(SubscriptionsPanel.subsRows)) {
			var tags = SUBS.getByTag(name).subTags;
			SubscriptionsPanel.subsRows[name].subTags = tags;
			for (var tag of tags) {
				if (SubscriptionsPanel.subTags[tag]) {
					SubscriptionsPanel.subTags[tag].push(name);
				} else {
					SubscriptionsPanel.subTags[tag] = [name];
				}
			}
			if (tags.length === 0) {
				SubscriptionsPanel.subTags['%noTags'].push(name);
				SubscriptionsPanel.subsRows[name].subTags = ['%noTags']
			}
		}
		//console.log(SubscriptionsPanel.subTags);
		//console.log(SubscriptionsPanel.subsRows);
	};
	this.filterList = async function (unformatTags) {
		console.log(performance.now(), "filtering by: " + unformatTags);

		var tagList = unformatTags.trim().split(' ');

		console.log(tagList.length);
		if (tagList.length === 1 && tagList[0] === "") {         //show all
			for (var name of Object.keys(SubscriptionsPanel.subsRows)) {
				if (!SubscriptionsPanel.subsRows[name].visible) {
					SubscriptionsPanel.subsRows[name].el.classList.remove('collapseElement');
					SubscriptionsPanel.subsRows[name].visible = true;
				}
			}
			return true;
		}

		for (var name of Object.keys(SubscriptionsPanel.subsRows)) {
			var targetVisibility = true;
			for (var reqTag of tagList) {
				if (!SubscriptionsPanel.subsRows[name].subTags.includes(reqTag)) {
					targetVisibility = false;
					break;
				}
			}

			if (SubscriptionsPanel.subsRows[name].visible !== targetVisibility) {
				SubscriptionsPanel.subsRows[name].el.classList.toggle('collapseElement');
				SubscriptionsPanel.subsRows[name].visible = targetVisibility;
			}
		}

		console.log(performance.now(), "...done");
	};


	this.refresh_sub = async function (tag) {
		return new Promise((resolve, reject) => {
			var toTop = refreshingSubs;
			GM.xmlHttpRequest({
				method: "GET",
				url: "https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1&tags=" + encodeURIComponent(tag).replace(/%20/g, "+"),
				onload: function (response) {
					resolve(
						(async function (response) {
							var newposts = 0;
							if (response.responseText) {
								var items = JSON.parse(response.responseText);
								var lastPost = SUBS.getByTag(tag).lastPost;
								for (var post of items) {
									if (post.id != lastPost) {
										newposts++;
									}
									else { break; }
								}
							}

							var num = document.getElementById('subnum - ' + tag);
							var newSubsTable = document.getElementById('newSubsTable');

							if (newposts > 0) {
								num.classList.add('showHidden');
								if (newposts >= 99) {
									num.innerHTML = '99+';
								} else {
									num.innerHTML = newposts;
								}
								//newSub row
								var myRow = document.getElementById("subsRow-" + tag);
								var row = newSubsTable.insertRow();
								var cell = row.insertCell();

								var nameP = document.createElement('p');
								nameP.setAttribute('class', "subsLine");
								cell.append(nameP);

								var namelink = document.createElement('a');
								namelink.setAttribute('href', "http://gelbooru.com/index.php?page=post&s=list&tags=" + encodeURIComponent(tag).replace(/%20/g, "+"));
								namelink.textContent = tag;
								nameP.append(namelink);
								nameP.innerHTML += '<li class="subsPostNumber showHidden">' + newposts + '</li>';

								var comm = SUBS.getByTag(tag).comment;
								var commP = document.createElement('p');
								commP.setAttribute('class', "subsComment");
								commP.style.display = "block";
								cell.append(commP);
								commP.innerText = comm;
								commP.onclick = function (e) {
									var editboxEl = this.parentNode.lastChild;
									editboxEl.value = this.innerText;
									this.style.display = "none";
									editboxEl.style.display = "block";
								};

								var tempEditCommBox = document.createElement('input');
								tempEditCommBox.type = "text";
								tempEditCommBox.setAttribute("id", "comtbox - " + tag);
								tempEditCommBox.setAttribute("class", "subsCommentEditBox");
								tempEditCommBox.defaultValue = comm;
								tempEditCommBox.style.fontSize = "9px";
								tempEditCommBox.style.display = "none";
								tempEditCommBox.onkeydown = function (e) {
									(async function (e) {
										if (e.keyCode == 13) {
											var myName = this.getAttribute('id').slice(10)
											var commEl = this.parentNode.childNodes[1];
											var ncomm = this.value;
											if (ncomm == "") { ncomm = "..." }
											commEl.innerText = ncomm;
											await SUBS.setSub(myName, { comment: ncomm });
											this.style.display = "none";
											commEl.style.display = "block";
										} else if (e.keyCode == 27) {
											var myName = this.getAttribute('id').slice(10)
											var commEl = this.parentNode.childNodes[1];

											this.style.display = "none";
											commEl.style.display = "block";
										}
									})();
								}
								cell.append(tempEditCommBox);

							}
							else if (newposts === 0) {
								num.classList.add('showHidden');
								num.classList.add('CounterGrey');
								num.innerHTML = newposts;
							}
							else {
								num.classList.add('showHidden');
								num.innerHTML = "?";
							}

							return true;
						})(response)
					)
				},
				onerror: function (error) {
					reject(
						(async function (error) {
							console.log("ERROR: " + tag, error)

							var num = document.getElementById('subnum - ' + tag);
							var newSubsTable = document.getElementById('newSubsTable');

							num.classList.add('showHidden');
							num.classList.add('CounterRed');
							num.innerHTML = '!E';

							//newSub row
							var myRow = document.getElementById("subsRow-" + tag);
							var row = newSubsTable.insertRow();
							var cell = row.insertCell();

							var nameP = document.createElement('p');
							nameP.setAttribute('class', "subsLine");
							cell.append(nameP);

							var namelink = document.createElement('a');
							namelink.setAttribute('href', "http://gelbooru.com/index.php?page=post&s=list&tags=" + encodeURIComponent(tag).replace(/%20/g, "+"));
							namelink.textContent = tag;
							nameP.append(namelink);
							nameP.innerHTML += '<li class="subsPostNumber showHidden">' + newposts + '</li>';

							var comm = SUBS.getByTag(tag).comment;
							var commP = document.createElement('p');
							commP.setAttribute('class', "subsComment");
							commP.style.display = "block";
							cell.append(commP);
							commP.innerText = comm;
							commP.onclick = function (e) {
								var editboxEl = this.parentNode.lastChild;
								editboxEl.value = this.innerText;
								this.style.display = "none";
								editboxEl.style.display = "block";
							};

							var tempEditCommBox = document.createElement('input');
							tempEditCommBox.type = "text";
							tempEditCommBox.setAttribute("id", "comtbox - " + tag);
							tempEditCommBox.setAttribute("class", "subsCommentEditBox");
							tempEditCommBox.defaultValue = comm;
							tempEditCommBox.style.fontSize = "9px";
							tempEditCommBox.style.display = "none";
							tempEditCommBox.onkeydown = function (e) {
								(async function (e) {
									if (e.keyCode == 13) {
										var myName = this.getAttribute('id').slice(10)
										var commEl = this.parentNode.childNodes[1];
										var ncomm = this.value;
										if (ncomm == "") { ncomm = "..." }
										commEl.innerText = ncomm;
										await SUBS.setSub(myName, { comment: ncomm });
										this.style.display = "none";
										commEl.style.display = "block";
									} else if (e.keyCode == 27) {
										var myName = this.getAttribute('id').slice(10)
										var commEl = this.parentNode.childNodes[1];

										this.style.display = "none";
										commEl.style.display = "block";
									}
								})();
							}
							cell.append(tempEditCommBox);


							return false;
						})(error)
					)
				}
			});
		});


	};
	this.check_subs = async function () {
		var result = 'no tags abailable';

		if (window.location.href.indexOf('s=list') !== -1 && window.location.href.indexOf('tags=') !== -1) {
			var current_list = decodeURIComponent(window.location.href.split('tags=')[1].split('&')[0].replace(/\+/g, ' '));
			result = current_list;

			if (SUBS.getTags().indexOf(current_list) !== -1) {
				result = '(Subscribed) ' + current_list;
				var lastSeenId = SUBS.getByTag(current_list).lastPost;

				if ((!window.location.href.includes('&pid=') || window.location.href.includes('&pid=0')) && (document.querySelector('.thumbnail-preview').id !== ("s" + lastSeenId))) {
					//document.addEventListener('readystatechange', Loader.stateHandler, false);

					if (document.hidden) {
						SubscriptionsPanel.checkDelay = true;
						document.addEventListener('focus', SubscriptionsPanel.check_subs, false);
						return result;
					}

					if (SubscriptionsPanel.checkDelay === true) {
						SubscriptionsPanel.checkDelay = false;
						document.removeEventListener('focus', SubscriptionsPanel.check_subs, false);
					}

					for (postDiv of document.querySelectorAll('.thumbnail-preview')) {
						if (postDiv.firstElementChild.id === ("s" + lastSeenId)) { break; }
						postDiv.classList.toggle('newSubPost');
					}
					await SUBS.setSub(current_list, { lastPost: document.querySelector('.thumb').id.slice(1) });
				}
			}
		}

		return result;
	};
};

var TheatreOverlay = new function () {
	this.init = function () {

	}
	this.HTML = `
        <div id="theatreOverlayDiv">
            <div id="theatreRibbonDiv">
                <div class="RibbonEndDiv"></div>
                <div class="RibbonEndDiv"></div>
            </div>
            <div class="RibbonSideDiv" id="RibbonScrollLeft"></div>
            <div class="RibbonSideDiv" id="RibbonScrollRight"></div>
        </div>
    `
	this.CSS = `
  
            #theatreRibbonDiv {
                position: fixed;
                top: 0;
                right: 0;
                width: 100vh;
                height: 100vw;
                background: rgba(0, 0, 0, 0.75);
                overflow-x: hidden;
                display: inline-block;
                transform-origin: right top;
                transform: rotate(-90deg) translateY(-100vw);
                text-align: center;

                scroll-snap-points-y: repeat(100vh);
                scroll-snap-type: mandatory;
                scroll-snap-destination: 100vh 0%;
            }

            .RibbonContainerDiv {
                transform: rotate(90deg);
                transform-origin: center;
                width: 100vh;
                height: 100vh;         
            }
  

             
             .RibbonContainerDiv img {
                position: relative;
                top: 50%;
                transform: translateY(-50%);
                max-width: 95% !important;
                max-height: 95% !important;
             }

            .RibbonEndDiv {
                height: calc(50vw - 50vh);
                width: 100%;
            }

            .RibbonSideDiv {
                height: 100vh;
                width: calc(50vw - 50vh);
                cursor: pointer;
                position: absolute;
                top: 0;
            }
            #RibbonScrollLeft {
                left:0;
            }
            #RibbonScrollRight {
                right:0;
            }

    `
	this.objectProperties = {
		RibbonScrollLeft: {
			onclick: function (event) {
				TheatreOverlay.ribbon.scrollBy({
					top: TheatreOverlay.ribbon.clientWidth * -1,
					left: 0,
					behavior: 'smooth'
				});
			}
		},
		RibbonScrollright: {
			onclick: function (event) {
				TheatreOverlay.ribbon.scrollBy({
					top: TheatreOverlay.ribbon.clientWidth,
					left: 0,
					behavior: 'smooth'
				});
			}
		}

		//FUNCTION LIST END
	}
	this.control = new Construct({
		name: "Theatre Overlay",
		element: this
	})

	this.toggle_theatre = function (mode, obj) {
		//document.body.appendChild(this.control.getRoot());
		//ImageOverlay.control.erase();
		if (this.control.visible || mode === "hide") {
			this.control.erase();
			ImageOverlay.stopMouseActions = false;
			document.body.style['overflow-y'] = 'auto';
			this.control.visible = false;
		} else if (!this.control.visible || mode === "show") {
			document.body.appendChild(this.control.getRoot());
			document.body.style['overflow-y'] = 'hidden';
			ImageOverlay.stopMouseActions = true;
			this.control.visible = true;
			this.ribbon = this.control.getRoot().querySelector("#theatreRibbonDiv")
		}
	}
};

var PoolPageHandler = new function () {
	this.active = false;
	this.preInit = async function () {
		if (window.location.search.indexOf('?page=pool&s=show') !== 0) { return true; }

		//document.body.innerHTML = "";

		PoolPageHandler.active = true;
		return new Promise((resolve) => {
			GM.xmlHttpRequest({
				url: location.href,
				method: "GET",
				onload: function (response) {
					var parser = new DOMParser();
					PoolPageHandler.document = parser.parseFromString(response.responseText, "text/html");

					var style = PoolPageHandler.document.createElement('style');
					style.type = 'text/css';
					style.innerHTML = `                        
                        .preview{
                            display:none;
                        }
                        .forceLoad{
                            display:initial !important;
                        }`;

					PoolPageHandler.document.querySelector('head').appendChild(style);

					PoolPageHandler.document.querySelectorAll(".preview").forEach(function (el) {
						let link = el.src;
						el.removeAttribute("src")
						el.dataset.source = link;
					})

					resolve(true);
				}
			});
		})


	}


	this.init = function () {
		if (!PoolPageHandler.active) { return true; }
		console.log("Replacing pool view page");
		console.log(document.readyState);

		var header = PoolPageHandler.document.querySelector("#content>h3");

		if (header) {
			let id = header.textContent.split(": ").pop();
			let pool = POOLS.getById(id);
			if (pool) {
				header.textContent = pool.name + " (Augmented view)";
			} else {
				header.textContent += " (Augmented view)";
			}

		}


		if (document.documentElement) { document.removeChild(document.documentElement); }
		document.appendChild(document.createElement("html"));
		document.firstElementChild.appendChild(document.createElement("body"));
		document.firstElementChild.innerHTML = PoolPageHandler.document.childNodes[1].innerHTML;

		var loader = function (e) {
			if (e && e.type === "error") {
				//console.log(e);
				console.log("ERROR; RELOADING IMAGE", e.target);
				e.target.src = "";
				e.target.src = e.target.dataset.source;
				return;
			} else if (e && e.type === "load") {
				e.target.onload = null;
				return;
			}
		}

		var loadFunction = function (e, forceNum) {
			if (e && e.type === "error") {
				console.log("ERROR; RELOADING IMAGE", e.target);
				e.target.src = "";
				e.target.src = e.target.dataset.source;
				return;
			}

			var prevs = document.querySelectorAll(".preview")
			var elNum = e ? parseInt(e.target.dataset.num) : 0;

			var num = forceNum ? forceNum : elNum;
			var counter = 0;
			var maxLoading = 18
			while (counter < maxLoading) {

				if (!prevs[num + counter]) return;
				let next = prevs[num + counter];

				if (counter === maxLoading - 1) {
					next.onload = loadFunction;
					next.onerror = loadFunction;
					next.dataset.num = (num + counter + 1).toString();
				} else {
					next.onload = loader;
					next.onerror = loader;
				}

				next.classList.toggle("forceLoad");
				next.src = next.dataset.source;
				counter++;
			}
		};

		loadFunction(null, 0);


	}

	this.document = null;




};




var Loader = new function () {
	var forcedLoading = false;
	var asyncCheckList = {
		readPools: async function () { await POOLS.read() },
		readSubs: async function () { await SUBS.read() },
		getTag: async function () { window.pool_tag = ''; pool_tag = await GM.getValue('user_tag', ''); },
		checkPool: async function () { await PoolPageHandler.preInit(); }
	};

	var checkListLength;
	var readyList = [];

	this.init = function (force) {
		if (force && force === true) {
			forcedLoading = true;
		}

		checkListLength = Object.keys(asyncCheckList).length;

		var pointHandler = function (pointName, pointIndex) {
			var startTime = performance.now();
			console.log(`Task ${pointIndex}: ${pointName}`)

			let index = pointIndex;
			let name = pointName
			asyncCheckList[pointName]().then(function () { Loader.checkPoint(name, index, startTime); })
		};

		console.log("Loader begin", performance.now());

		Object.keys(asyncCheckList).forEach(pointHandler)
	}

	this.checkPoint = function (name, index, startTime) {
		readyList.push(name);
		console.log(`${index}: ${name} done in ${performance.now() - startTime} ms; ${readyList.length}/${checkListLength}`)
		if (readyList.length === checkListLength) {
			if (document.readyState === "interactive" || document.readyState === "complete" || forcedLoading === true) {
				Loader.initMain();
			} else {
				console.log(performance.now(), "Loader Done, await document loading");
				document.addEventListener('readystatechange', Loader.stateHandler, false);
			}
		}
	}

	this.stateHandler = function (e) {
		if (document.readyState === "interactive" || document.readyState === "complete") {
			document.removeEventListener('readystatechange', Loader.stateHandler, false);
			Loader.initMain();
		}
	}

	this.initMain = async function () {
		PoolPageHandler.init();
		//await POOLS.read();
		//console.log(performance.now(), "Main begin");
		await MainPanel.init();
		//console.log(performance.now(), "ImageOverlay begin");
		ImageOverlay.init();
		//console.log(performance.now(), "Subscriptions begin");
		await SubscriptionsPanel.init();
		//console.log(SUBS)
		//console.log(performance.now(), "==========Loading finish");
	}
};





Loader.init();

/*
		window.eval(`
			if (Gelbooru&&Gelbooru.Note){
			Gelbooru.Note.TranslationMode.toggle = function(a){return;};
			Gelbooru.Note.TranslationMode.start = function(a){return;};
			Gelbooru.Note.TranslationMode.stop = function(a){return;};
			}
		`);
		*/




