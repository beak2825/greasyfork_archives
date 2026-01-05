// ==UserScript==
// @name           SetsMaster
// @author         Demin
// @namespace      Tamozhnya1
// @description    Наборы армии, навыков и оружия - 3 в 1 (by Tamozhnya1 & Demin)
// @homepage       https://greasyfork.org/users/1602-demin
// @icon           http://i.imgur.com/LZJFLgt.png
// @version        3.7
// @encoding 	   utf-8
// @include        http://www.heroeswm.ru/*
// @include        http://qrator.heroeswm.ru/*
// @include        http://178.248.235.15/*
// @include        http://www.lordswm.com/*
// @exclude        */rightcol.php*
// @exclude        */ch_box.php*
// @exclude        */chat*
// @exclude        */ticker.html*
// @exclude        */frames*
// @exclude        */brd.php*
// @grant          GM_deleteValue
// @grant          GM_getValue
// @grant          GM_listValues
// @grant          GM_setValue
// @grant          GM_addStyle
// @grant          GM_log
// @grant          GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/1220/SetsMaster.user.js
// @updateURL https://update.greasyfork.org/scripts/1220/SetsMaster.meta.js
// ==/UserScript==

// (c) 2012-2015, demin  ( http://www.heroeswm.ru/pl_info.php?id=15091 )
// (c) 2012,2015, Tamozhnya1

(function() {

var version = '3.7';


var hide_perks = true;
//var hide_perks = false;

var refreshing_pages = false;
//var refreshing_pages = true;


if (typeof GM_deleteValue != 'function') {
	this.GM_getValue=function (key,def) {return localStorage[key] || def;};
	this.GM_setValue=function (key,value) {return localStorage[key]=value;};
	this.GM_deleteValue=function (key) {return delete localStorage[key];};

	this.GM_addStyle=function (key) {
		var style = document.createElement('style');
		style.textContent = key;
		document.querySelector("head").appendChild(style);
	}
}
if (typeof GM_listValues != 'function') {
	this.GM_listValues=function () {
		var values = [];
		for (var i=0; i<localStorage.length; i++) {
			values.push(localStorage.key(i));
		}
		return values;
	}
}


var script_num = 124512;
var script_name = "SetsMaster: Наборы армии, навыков и оружия - 3 в 1 (by Tamozhnya1 & Demin)";
update_n(version,script_num,script_name);

var url_cur = location.href;
var url = 'http://'+location.hostname+'/';


var GlobalCultureName = url.match('lordswm') ? "en-US" : "ru-RU",
    Strings = {
        "ru-RU" : {
            Army : "Армия",
            Save : "Сохранить",
            Add : "Добавить",
            SetName : "Наименование набора",
            Delete : "Удалить",
            Talents : "Навыки",
            SavePerkSetAlert : 'Сначала выберите навыки и нажмите "Принять"',
            Weapon : "Оружие",
            RemoveAll : "Снять все",
        },
        "en-US" : {
            Army : "Army",
            Save : "Save",
            Add : "Add",
            SetName : "Set name",
            Delete : "Delete",
            Talents : "Talents",
            SavePerkSetAlert : 'Please select skills and click on "Accept"',
            Weapon : "Weapon",
            RemoveAll : "Un-equip all",
        }
    },
    LocalizedString = Strings[GlobalCultureName];

var flash_heart = document.querySelector("object > param[value*='heart.swf']");
if ( flash_heart ) flash_heart = flash_heart.parentNode.querySelector("param[name='FlashVars']");
if ( flash_heart ) {
	flash_heart = flash_heart.value.split('|');
	if ( flash_heart[3] ) { var nick = flash_heart[3] + "_"; }
}

if ( !(document.querySelector("body") && nick) ) { return; }

var frak, frak_class, temp_nick = nick;
nick = encodeURIComponent(nick);

if ( location.pathname=='/home.php' ) {
	frak = /\/i\/(r\d+)\.gif/.exec( document.querySelector("body").innerHTML );
	if ( frak ) {
		frak = frak[1] + "_";
		GM_setValue( nick+"frak", frak );
	}
}
else if ( location.pathname=='/pl_info.php' ) {
	var temp_regexp = new RegExp(temp_nick.slice(0, -1)+'.\{30,150\}\\/i\\/(r\\d+)\\.gif');
	frak = temp_regexp.exec( document.querySelector("body").innerHTML );
	if ( frak ) {
		frak = frak[1] + "_";
		GM_setValue( nick+"frak", frak );
	}
}
else if ( location.pathname=='/castle.php' ) {
	function frak_and_class(frak, temp_fract) {
		for (var i=0, temp_fract_len=temp_fract.length, temp_fr; i<temp_fract_len; i++) {
			temp_fr = temp_fract[i].value;
			if ( !temp_fr ) { frak = false; break; }

			frak += 1;
			if ( temp_fr != frak ) {
				break;
			} else if ( i+1 == temp_fract_len ) {
				frak += 1;
			}
		}
		return frak;
	}

	frak = frak_and_class(-1, document.querySelectorAll("select[name='fract'] > option"));
	frak_class = frak_and_class(-2, document.querySelectorAll("select[name='classid'] > option"));

	if ( frak!==false && frak_class!==false && frak>=0 ) {
		if ( frak_class < 0 ) frak_class = 0;
		frak = "r" + ( frak_class * 100 + frak ) + "_";
		GM_setValue( nick+"frak", frak );
	} else {
		frak = false;
	}
}

if ( !frak ) frak = GM_getValue( nick+"frak" );
if ( !frak ) { return; }

var menuId = "menuSets";
/************************************************************************************************************/
armySet = {
    oid : 2,
    id : "armySet",
    name : "<a href='army.php' style='color: #f5c137; text-decoration: none;'>" + LocalizedString.Army + "</a>",
    currentSetName : nick + frak + "currentArmySet",
    currentSetNumber : undefined,
    sets : new Array(),
    setObjects : new Array(),
    menuItems : {},
    currentMenuItem : undefined,
    menu : undefined,
    savedSetIdsConst : nick + frak + "savedArmySetIds",
    savedSetConst : nick + frak + "savedArmySet",
    refreshingPages : "home.php;army.php;pl_info.php",
    army_now : new Array(),

    getSets : function () {
        for (var i = 0; i < this.setObjects.length; i++) {
            var setObject = this.setObjects[i];
            if (setObject) {
                var setName = setObject.name;
                var army = setObject.army;

                var setTitle = "";
                for (var j = 0; j < army.length; j++) {
                    setTitle += (army[j] == "" ? "0" : army[j]) + "+";
                }
                setTitle = setTitle.substring(0, setTitle.length - 1);

                var data = "";
                for (var j = 0; j < army.length; j++) {
                    data = "countv" + (j + 1) + "=" + (army[j] == "" ? "0" : army[j]) + (data == "" ? "" : "&") + data;
                }
                this.sets[i] = {
                    number : parseInt(setObject.oid),
                    name : setName,
                    title : setTitle,
                    method : "POST",
                    url : "army_apply.php",
                    data : data,
                    contentType : "application/x-www-form-urlencoded"
                };
            }
        }
    },
    init : function () {
        this.currentSetNumber = GM_getValue(this.currentSetName, -1);
        var savedSetIdsStr = GM_getValue(this.savedSetIdsConst);
        var setIds = new Array();
        if (savedSetIdsStr) {
            setIds = savedSetIdsStr.split("|");
        }
        for (var i = 0; i < setIds.length; i++) {
            if (setIds[i] == "") {
                continue;
            }
            var setStr = GM_getValue(this.savedSetConst + setIds[i]);
            if (!setStr) {
                continue;
            }
            var setData = setStr.split("|");
            this.setObjects[i] = {
                oid : setIds[i],
                name : setData[7],
                fraction : setData[8],
                army : new Array()
            };
            for (var j = 0; j < 7; j++) {
                this.setObjects[i].army[j] = setData[j];
            }
        }
        if (/army.php$/.test(location.href)) {
            this.drawSetsTable();
        }
    },
    drawSetsTable : function () {
        var div = addElement("center", document.querySelector("body"));
        addElement("br", div);
        var htmlTable = addElement("table", div, {
                bgcolor : "#959595",
                bordercolor : "#f5c137",
                border : "1px"
            });
        this.drawTableHeader(htmlTable);
        for (var i = 0; i < this.setObjects.length; i++) {
            if (this.setObjects[i]) {
                this.drawSetsRow(htmlTable, this.setObjects[i]);
            }
        }
        var saveButton = addElement("input", div, { type : "button", value : LocalizedString.Save });
        saveButton.addEventListener("click", this.saveSets, false);
        var addButton = addElement("input", div, { type : "button", value : LocalizedString.Add });
        addButton.addEventListener("click", this.addSet, false);
    },
    drawTableHeader : function (htmlTable) {
        var flash = document.querySelector("object > param[value*='recruitarmy.swf']");
        flash = flash.parentNode.querySelector("param[name='FlashVars']");
        var flashVars = flash.value.substr(8);
        var sets = flashVars.split(";M");

        var tr = addElement("tr", htmlTable);
        var th = addElement("td", tr);

        th.style.fontWeight = "bold";
        th.innerHTML = LocalizedString.SetName;
        for (var i = 0; i < sets.length; i++) {
            var set = sets[i].split("|");
            th = addElement("td", tr);
            th.style.fontWeight = "bold";
            this.army_now.push(Number(sets[i].split(":")[1].substr(57,3)));
            if (url.match('lordswm')) {
                th.innerHTML = set[2].split("#")[1];
            } else {
                th.innerHTML = set[2].split("#")[0];
            }
        }
	while ( this.army_now.length != 7 ) { this.army_now.push(""); }
    },
    drawSetsRow : function (htmlTable, setObject) {
        var tr = addElement("tr", htmlTable, {
                oid : setObject.oid
            });
        var td = addElement("td", tr);
        var input = addElement("input", td, {
                value : setObject.name,
                size : 22
            });
        for (var i = 0; i < setObject.army.length; i++) {
            td = addElement("td", tr);
            input = addElement("input", td, { value : setObject.army[i], size : 5 });
        }
        td = addElement("td", tr);
        var delButton = addElement("input", td, { type : "button", value : "x", title : LocalizedString.Delete });
        delButton.addEventListener("click", this.deleteSet, false);
    },
    saveSets : function () {
        var table = this.previousSibling;
        var setIdsStr = "";
        for (var i = 1; i < table.rows.length; i++) {
            var setStr = "";
            var row = table.rows[i];
            var oid = row.getAttribute("oid");
            setIdsStr = setIdsStr + "|" + oid;
            for (var j = 1; j <= 7; j++) {
                setStr = setStr + "|" + row.cells[j].firstChild.value;
            }
            setStr = setStr + "|" + row.cells[0].firstChild.value;
            setStr = setStr + "|" + "";
            GM_setValue(armySet.savedSetConst + oid, setStr.substr(1));
        }
        if (setIdsStr && setIdsStr != "") {
            GM_setValue(armySet.savedSetIdsConst, setIdsStr.substr(1));

            // udalit' udalennye komplekty
            if (typeof GM_listValues == 'function') {
                var clear_d = GM_listValues();
                var clear_d_len = clear_d.length;
                var num_id_regexp = new RegExp(armySet.savedSetConst + '(\\d+)');
                var num_id;
                for (var i = clear_d_len; i--; ) {
                    num_id = num_id_regexp.exec(clear_d[i]);
                    if (num_id && !setIdsStr.match(num_id[1])) {
                        GM_deleteValue(clear_d[i]);
                    }
                }
            }
        } else {
            GM_deleteValue(armySet.savedSetIdsConst);
            GM_deleteValue(armySet.currentSetName);

            // udalit' udalennye komplekty
            if (typeof GM_listValues == 'function') {
                var clear_d = GM_listValues();
                var clear_d_len = clear_d.length;
                var num_id_regexp = new RegExp(armySet.savedSetConst + '(\\d+)');
                var num_id;
                for (var i = clear_d_len; i--; ) {
                    num_id = num_id_regexp.exec(clear_d[i]);
                    if (num_id) {
                        GM_deleteValue(clear_d[i]);
                    }
                }
            }
        }
    },
    addSet : function () {
        var table = this.previousSibling.previousSibling;

        var setTitle = "";
        for (var j = 0, j_len = armySet.army_now.length; j < j_len; j++) {
            setTitle += (armySet.army_now[j] == "" ? "0" : armySet.army_now[j]) + "+";
        }
        setTitle = setTitle.slice(0, -1);

        armySet.drawSetsRow(table, {
            oid : (new Date()).getTime(),
            name : setTitle,
        //  army : ["", "", "", "", "", "", ""]
            army : armySet.army_now
        });
    },
    deleteSet : function () {
        var table = this.parentNode.parentNode.parentNode;
        var row = this.parentNode.parentNode;
        table.removeChild(row);
    },
}
/***********************************************************************************************************/
skillSet = {
    oid : 1,
    id : "skillSet",
    name : "<a href='skillwheel.php' style='color: #f5c137; text-decoration: none;'>" + LocalizedString.Talents + "</a>",
    currentSetName : nick + frak + "currentSkillSet",
    currentSetNumber : undefined,
    sets : new Array(),
    setObjects : new Array(),
    menuItems : {},
    currentMenuItem : undefined,
    menu : undefined,
    refreshingPages : "skillwheel.php;pl_info.php",

    getSets : function () {
        var setRefs = document.querySelectorAll("a[href^='skillwheel.php?setuserperk']");
        for(var i = 0; i < setRefs.length; i++) {
            this.sets[i] = { number : i, name : setRefs[i].innerHTML, title : '', method : "GET", url : setRefs[i].href }
            setRefs[i].addEventListener("click", markCurrentEventHandler, false);
            setRefs[i].setAttribute("number", i);
            setRefs[i].setAttribute("oid", this.oid);
        }
    },
    init : function () {
        this.currentSetNumber = GM_getValue(this.currentSetName, -1);
    }
}
/************************************************************************************************************/
weaponSet = {
    oid : 0,
    id : "weaponSet",
    name : "<a href='inventory.php' style='color: #f5c137; text-decoration: none;'>" + LocalizedString.Weapon + "</a>",
    currentSetName : nick + "currentWeaponSet",
    currentSetNumber : undefined,
    sets : new Array(),
    menuItems : {},
    currentMenuItem : undefined,
    menu : undefined,
    refreshingPages : "home.php;inventory.php;pl_info.php",

    getSets : function () {
        this.sets[0] = { number : 0, name : LocalizedString.RemoveAll, method : "GET", url : "inventory.php?all_off=100" }
        for (var i = 1; i <= 5; i++) {
            var setName = GM_getValue(nick + "weaponSet" + i);
            if (setName) {
                this.sets[i] = { number : i, name : setName, method : "GET", url : "inventory.php?all_on=" + i, headers : null }
            }
        }
    },
    init : function () {
        this.currentSetNumber = GM_getValue(this.currentSetName, -1);
        if (/inventory.php$/.test(location.href)) {
            var a = document.querySelector("a[href^='inventory.php?all_off=']");
            if ( a ) {
            a.addEventListener("click", markCurrentEventHandler, false);
            a.setAttribute("number", 0);
            a.setAttribute("oid", this.oid);

            var all_on = document.querySelectorAll("a[href^='inventory.php?all_on=']");
            var FilledSets = new Array();
            for (var i = 0; i < all_on.length; i++) {
                a = all_on[i];
                a.addEventListener("click", markCurrentEventHandler, false);
                var setNumber = parseInt(a.href.substr(a.href.indexOf("all_on=") + 7, 1));
                a.setAttribute("number", setNumber);
                a.setAttribute("oid", this.oid);
                GM_setValue(nick + "weaponSet" + setNumber, a.innerHTML);
                FilledSets[setNumber] = setNumber;
            }
            for (var i = 1; i <= 5; i++) {
                if (!FilledSets[i]) {
                    GM_deleteValue(nick + "weaponSet" + i);
                }
            }
            }
        }
    }
}

/************************************************************************************************************/
var setObjects = new Array();
setObjects[weaponSet.oid] = weaponSet;
setObjects[armySet.oid] = armySet;
setObjects[skillSet.oid] = skillSet;
var timer;

main();

function main() {
    var menuId = "menuSetsTable";
    var logobEngChild = document.querySelector("img[width='101'][height='26']");
    if (!logobEngChild) {
        return;
    }
    var styleObject = { borderColor : "#f5c137", background : "#6b6b69", color : "#f5c137" }
    if (document.querySelector("img[src*='i/top_ny']")) {
        styleObject.background = "#003399";
	}
    var offSet = -55;
    for (var i = 0; i < setObjects.length; i++) {
        if (!setObjects[i]) {
            continue;
        }
        var currentSetObject = setObjects[i];
        if (currentSetObject.init) {
            currentSetObject.init();
        }
        currentSetObject.getSets();

        if (i > 0) {
            offSet += $(menuId + (i - 1) + "Header").clientWidth;
        }
        var menuHeaderStyleObject = {
            position : "absolute",
            margin : "2px 0px 0px " + offSet + "px",
            background : styleObject.background,
            color : styleObject.color,
            border : "1px solid " + styleObject.borderColor,
            "font-weight" : "bold",
            padding : "2px 6px 4px 5px",
            "z-index" : (url_cur.match('photo_pl_photos') ? "0" : "2")
        }
        var menuHeader = addElement("div", logobEngChild.parentNode, { id : menuId + i + "Header", headerId : menuId + i + "Header", menuId : menuId + i }, menuHeaderStyleObject);
        var aLevel1 = addElement("b", menuHeader, {}, "color: #f5c137;");
        //  aLevel1.style.cursor = "pointer";
        aLevel1.innerHTML = currentSetObject.name;
        currentSetObject.menu = aLevel1;

        var menuContent = addElement("div", menuHeader, { id : menuId + i, headerId : menuId + i + "Header", menuId : menuId + i }, "position: relative; padding: 6px 3px 2px 3px; white-space: nowrap;");
        menuHeader.addEventListener("mouseover", showMenu, false);
        menuHeader.addEventListener("mouseout", hideMenu, false);
        menuContent.addEventListener("mouseover", showMenuCont, false);
        menuContent.addEventListener("mouseout", hideMenu, false);

        for (var j = 0; j < currentSetObject.sets.length; j++) {
            var currentSet = currentSetObject.sets[j];
            if (!currentSet) {
                continue;
            }
            var liLevel2 = addElement(url_cur.match('photo_pl_photos') ? "div" : "li", menuContent, { type: "disc", title:  currentSetObject.title || "" });
            var aLevel2 = addElement("b", liLevel2, currentSet, "color: #f5c137;");
            aLevel2.style.cursor = "pointer";
            aLevel2.innerHTML = currentSet.name;
            aLevel2.addEventListener("click", applySet, false);

            aLevel2.setAttribute("oid", currentSetObject.oid);
            if (currentSet.number == currentSetObject.currentSetNumber) {
                markCurrent(aLevel2);
            }
            currentSetObject.menuItems[j] = aLevel2;
        }
        $(menuId + i).style.width = ($(menuId + i).clientWidth + 20) + "px";
        $(menuId + i).style.display = "none";
    }

	if ( hide_perks ) {
		hide_perks = document.querySelectorAll("a[href='skillwheel.php'] > font");
		var temp_i;
		for ( var i in hide_perks ) {
			temp_i = hide_perks[i];
			if ( temp_i && temp_i.innerHTML && ( temp_i.innerHTML.indexOf("▼")!=-1 || temp_i.innerHTML.indexOf("&#9660;")!=-1 ) ) {
				while ( temp_i.tagName != 'TD' ) { temp_i = temp_i.parentNode; }
				temp_i.style.display = 'none';

				// восстанавливаем отступ
				var temp_td = document.createElement('td');
				temp_td.height = "6px";
				temp_i.parentNode.appendChild(temp_td);

				break;
			}
		}
	}
}
function showMenu() {
    var menu = $(this.getAttribute("menuId"));
    timer = setTimeout(function () {
            if (menu) {
                menu.style.display = "block";
            }
        }, 100);
}
function showMenuCont() {
    var menu = $(this.getAttribute("menuId"));
    if (menu) {
        menu.style.display = "block";
    }
}
function hideMenu() {
    if (timer) {
        clearTimeout(timer);
    }
    var menu = $(this.getAttribute("menuId"));
    if (menu) {
        menu.style.display = "none";
    }
}
function markCurrentEventHandler(e) {
    var obj = setObjects[this.getAttribute("oid")];
    var menuItemToMark = obj.menuItems[this.getAttribute("number")];
    markCurrent(menuItemToMark);
}
function markCurrent(el) {
    var obj = setObjects[el.getAttribute("oid")];
    GM_setValue(obj.currentSetName, el.getAttribute("number"));
    el.style.color = '#0f0';
    if (obj.currentMenuItem && obj.currentMenuItem != el) {
        obj.currentMenuItem.style.color = "#f5c137";
    }
    obj.currentMenuItem = el;
}
function applySet() {
    markCurrent(this);
    var obj = setObjects[parseInt(this.getAttribute("oid"))];
    var _this = this;
    var title = this.innerHTML;
    this.innerHTML += " " + getLoadGif();
    var objXMLHttpReqSM = new XMLHttpRequest();
    objXMLHttpReqSM.open(this.getAttribute("method"), this.getAttribute("url"), true);
    objXMLHttpReqSM.onreadystatechange = function () {
        if (objXMLHttpReqSM.readyState == 2) {
            objXMLHttpReqSM.abort();
            _this.innerHTML = title;
            if(refreshing_pages && obj.refreshingPages) {
                var pages = obj.refreshingPages.split(';');
                for(var i = 0; i < pages.length; i++) {
                    if(location.href.indexOf(pages[i]) > -1) {
                        window.location.href = window.location.href;
                    }
                }
            }
        }
    };
    
    var contentType = this.getAttribute("contentType");
    if (contentType) {
        objXMLHttpReqSM.setRequestHeader('Content-type', contentType);
    }
    objXMLHttpReqSM.send(this.getAttribute("data"));

    return false;
}
function addElement(type, parent, data, style) {
    var el = document.createElement(type);
    if (parent) {
        parent.appendChild(el);
    }
    if (data) {
        for (var key in data) {
            el.setAttribute(key, data[key]);
        }
    }
    if (style && el.id) {
        var styleStr = "";
        if (typeof(style) == "string") {
            styleStr = style;
        } else {
            for (var key in style) {
                styleStr += key + ": " + style[key] + "; ";
            }
        }
        GM_addStyle("#" + el.id + "{" + styleStr + "}");
    }
    return el;
}
function getLoadGif() {
    return '<img border="0" align="absmiddle" height="11" src="data:image/gif;base64,' +
    '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' +
    'fySDhGYQdDWGQyUhADs=">';
}

function $(id) { return document.querySelector("#"+id); }

function addEvent(elem, evType, fn) {
	if (elem.addEventListener) {
		elem.addEventListener(evType, fn, false);
	}
	else if (elem.attachEvent) {
		elem.attachEvent("on" + evType, fn);
	}
	else {
		elem["on" + evType] = fn;
	}
}

function update_n(a,b,c,d,e){if(e){e++}else{e=1;d=(Number(GM_getValue(b+'_update_script_last2','0'))||0)}if(e>3){return}var f=new Date().getTime();var g=document.querySelector('#update_demin_script2');if(g){if((d+86400000<f)||(d>f)){g=g.innerHTML;if(/100000=1.1/.exec(g)){var h=new RegExp(b+'=(\\d+\\.\\d+)=(\\d+)').exec(g);var i=/url7=([^%]+)/.exec(g);if(a&&h&&i){if(Number(h[1])>Number(a))setTimeout(function(){if(confirm('\u0414\u043E\u0441\u0442\u0443\u043F\u043D\u043E \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u0441\u043A\u0440\u0438\u043F\u0442\u0430: "'+c+'".\n\u0423\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u043D\u0443\u044E \u0432\u0435\u0440\u0441\u0438\u044E \u0441\u0435\u0439\u0447\u0430\u0441?\n\nThere is an update available for the script: "'+c+'".\nWould you like install the script now?')){if(typeof GM_openInTab=='function'){GM_openInTab(i[1].replace(/\s/g,'')+h[2])}else{window.open(i[1].replace(/\s/g,'')+h[2],'_blank')}}},500)}GM_setValue(b+'_update_script_last2',''+f)}else{setTimeout(function(){update_n(a,b,c,d,e)},1000)}}}else{var j=document.querySelector('body');if(j){var k=GM_getValue(b+'_update_script_array2');if(e==1&&((d+86400000<f)||(d>f)||!k)){if(k){GM_deleteValue(b+'_update_script_array2')}setTimeout(function(){update_n(a,b,c,d,e)},1000);return}var l=document.createElement('div');l.id='update_demin_script2';l.setAttribute('style','position: absolute; width: 0px; height: 0px; top: 0px; left: 0px; display: none;');l.innerHTML='';j.appendChild(l);if((d+86400000<f)||(d>f)||!k){var m=new XMLHttpRequest();m.open('GET','photo_pl_photos.php?aid=1777'+'&rand='+(Math.random()*100),true);m.onreadystatechange=function(){update(m,a,b,c,d,e)};m.send(null)}else{document.querySelector('#update_demin_script2').innerHTML=k;setTimeout(function(){update_n(a,b,c,d,e)},10)}}}}function update(a,b,c,d,e,f){if(a.readyState==4&&a.status==200){a=a.responseText;var g=/(\d+=\d+\.\d+(=\d+)*)/g;var h='';var i=/(url7=[^%]+\%)/.exec(a);if(i){h+=i[1]}while((i=g.exec(a))!=null){if(h.indexOf(i[1])==-1){h+=' '+i[1]}};GM_setValue(c+'_update_script_array2',''+h);var j=document.querySelector('#update_demin_script2');if(j){j.innerHTML=h;setTimeout(function(){update_n(b,c,d,e,f)},10)}}}

})();
