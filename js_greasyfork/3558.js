// ==UserScript==
// @name          More Smileys Sidebar
// @fullname      More Smileys Sidebar für MlPOCDE
// @description   Eine modifizierte More Smileys Sidebar für MlPOCDE, ursprünglich von Merrx geschrieben und von Domnitro verändert, damit es auch auf MlPOCDE genutzt werden kann.
// @author        Merrx-gemoddet für MlPOCDE von Domnitro
// @version       2013.02.12b
// @include       *mlpoc.de/*
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_deleteValue
// @namespace https://greasyfork.org/users/2853
// @downloadURL https://update.greasyfork.org/scripts/3558/More%20Smileys%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/3558/More%20Smileys%20Sidebar.meta.js
// ==/UserScript==

// Smiley-Fix, sodass die Smileys mittig ausgerichtet werden
var imgs = document.getElementsByTagName("img");
for(var i = 0; i < imgs.length; i++) {
	if(imgs[i].src.indexOf("merrx.bestpony.de/smiley") >= 0)
		imgs[i].setAttribute("style", "vertical-align: middle; margin: 1px;");
}

// Prüfen ob angemeldet
if((document.getElementById('message') != null) || (document.getElementById('message_new') != null) || (document.getElementById('shout_data') != null) || (document.getElementById('smiley-sidebar') != null) ) {

	// Bereitstellen der Lade und Speicherfunkionen, falls sie nicht vorhanden sind
	if (typeof GM_deleteValue == 'undefined') {
	// Natives Chrome und Opera abfangen, da Tampermonkey die Funktionen bereitstellt
		if((navigator.userAgent.search('Chrome') != -1) || (navigator.userAgent.search('Opera') != -1) ) {
			GM_getValue = function(name, defaultValue) {
				var value = window.localStorage.getItem(name);
				if (!value)
					return defaultValue;
				var type = value[0];
				value = value.substring(1);
				switch (type) {
					case 'b':
						return value == 'true';
					case 'n':
						return Number(value);
					default:
						return value;
				}
			}

			GM_setValue = function(name, value) {
				value = (typeof value)[0] + value;
				window.localStorage.setItem(name, value);
			}
		}
	}
	
	// Seite in ein neues div schieben
	var site = document.createElement('div');
	document.body.insertBefore(site,document.body.firstChild);
	document.body.style.margin = "0px";
	while(document.body.children[1]) {
		site.appendChild(document.body.children[1]);
	}
	
	//Styleattribute des Containers der Hauptseite auslesen und in Variablen speichern
	//Diese werden später bei der Generierung der Sidebar verwendet. (by Rapti)
	function getStyle(x, styleProp) {
		if (x.currentStyle) var y = x.currentStyle[styleProp];
		else if (window.getComputedStyle) var y = document.defaultView.getComputedStyle(x, null).getPropertyValue(styleProp);
		return y;
	};
	var container = document.getElementById("container");
	var bgimg = getStyle(container, "background-image");
	var border = getStyle(container, "border");
	var shadow = getStyle(container, "box-shadow");
	if(new String(bgimg) == "undefined" || new String(bgimg) == "") {bgimg = getStyle(container, "backgroundImage");}
	if(new String(border) == "undefined" || new String(border) == "") border = getStyle(container, "border-left-color") + " " + getStyle(container, "border-left-style") + " " + getStyle(container, "border-left-width");
	if(new String(border) == "undefined" || new String(border) == "") border = getStyle(container, "borderLeftColor") + " " + getStyle(container, "borderLeftStyle") + " " + getStyle(container, "borderLeftWidth");
	if(new String(shadow) == "undefined" || new String(shadow) == "") {shadow = getStyle(container, "boxShadow");}
	
	// Sidebar erzeugen
	var sidebar = document.createElement("div");
	document.body.appendChild(sidebar);
	sidebar.id = "smiley-sidebar";
	sidebar.setAttribute("style", "position:fixed; top:0px; width:250px; height:100%; background: " + bgimg + " repeat scroll 0 0; overflow:auto; z-index:2; box-shadow:" + shadow + ";");

	// Element erzeugen, dass die Sidebar einblendet und ausblendet 
	if(document.getElementsByName('postoptions[signature]').length > 0) {
		var toggle = document.getElementsByName('postoptions[signature]')[0].parentNode.parentNode;
		toggle.appendChild(document.createElement("br"));
	}
	if(document.getElementsByName('options[signature]').length > 0) {
		var toggle = document.getElementsByName('options[signature]')[0].parentNode.parentNode;
	}
	if(document.getElementById('shout_data') != null) {
		var toggle = document.getElementById('smilies').parentNode;
		toggle.appendChild(document.createElement("br"));
		toggle.appendChild(document.createElement("br"));
	}
	var fakeform = document.createElement("form");
	toggle.appendChild(fakeform);
	
	// Sidebar einblenden
	var label = document.createElement("label");
	fakeform.appendChild(label);
	var ele = document.createElement("input");
	ele.setAttribute("class", "checkbox");
	ele.setAttribute("type", "checkbox");
	label.appendChild(ele);
	
	//Anzeigen Funktion
	var firstChange = GM_getValue('dateSmiley',0);
	function ShowSidebar(st) {
		if(arguments.length == 0) {
			var status = (GM_getValue("showSidebar",false)) ? false : true ;		
		} else {
			var status = st;
		}
		
		if(status) {
			document.getElementById('smiley-sidebar').style.display = "block";
			if(GM_getValue("leftSidebar",true)) {
				if(GM_getValue("boxSidebar",true)) {site.style.marginLeft = "250px"; site.style.marginRight = "0px";}
					else{site.style.margin = "";}
				
				sidebar.style.float="left"; sidebar.style.right=""; sidebar.style.left="0px";
				sidebar.style.borderRight = border; sidebar.style.borderLeft = "";
				if (switchButton) switchButton.src="http://merrx.bestpony.de/smiley/arrowbutton-right.png";
			} else {
				if(GM_getValue("boxSidebar",true)) {site.style.marginLeft = "0px";  site.style.marginRight = "250px";}
					else{site.style.margin = "";}
				sidebar.style.float="right"; sidebar.style.left=""; sidebar.style.right="0px";
				sidebar.style.borderLeft = border; sidebar.style.borderRight = "";
				if (switchButton) switchButton.src="http://merrx.bestpony.de/smiley/arrowbutton-left.png";
			}
			
			if(GM_getValue("boxSidebar",true)) {
				window.onresize = function() {
					var bg = getStyle(document.body, "background-image");
					if(new String(bg) == "undefined" || new String(bg) == "") {bg = getStyle(document.body, "backgroundImage");}
					var image = new Image();
					image.src = bg.replace(/\"/g, '').slice(4, -1);
					var BGwidth = image.width;
					if(BGwidth == 0) 
						image.onload = function() {
							BGwidth = image.width;
							if(GM_getValue("leftSidebar",true)) {
								var mid = (window.innerWidth + 230 - BGwidth)/2;
							} else {
								var mid = (window.innerWidth - 270 - BGwidth)/2;
							}
							document.body.style.backgroundPosition =  mid + "px 0px";
						}
				
					if(GM_getValue("leftSidebar",true)) {
						var mid = (window.innerWidth + 230 - BGwidth)/2;
					} else {
						var mid = (window.innerWidth - 270 - BGwidth)/2;
					}
					document.body.style.backgroundPosition =  mid + "px 0px";
				};
				window.onresize();
				if (boxButton) boxButton.src = "http://merrx.bestpony.de/smiley/boxbutton-inside.png";
			} else {
				document.body.style.backgroundPosition = "50% 0px";
				if (boxButton) boxButton.src = "http://merrx.bestpony.de/smiley/boxbutton-aside.png";
			}
			
			ele.checked = true;
			GM_setValue("showSidebar",true);	
		} else {
			document.getElementById('smiley-sidebar').style.display = "none";
			site.style.margin = "0px";
			document.body.style.backgroundPosition = "50% 0px";
			window.onresize = function() {};
			ele.checked = false;
			GM_setValue("showSidebar",false);
		}
		var zeit = new Date().getTime();
		GM_setValue('dateSmiley',JSON.stringify(zeit));
		firstChange = GM_getValue('dateSmiley',0);
	} ShowSidebar(GM_getValue("showSidebar",false));
	ele.addEventListener("change", function() {ShowSidebar()}, false);

	var text = document.createElement("strong");
	text.innerHTML = " Smiley-Sidebar";
	label.appendChild(text);
	fakeform.appendChild(document.createElement("br"));
	
	// Sidebar-Rumpf
	var kopf = document.createElement("div");
	sidebar.appendChild(kopf);
	kopf.id = "smiley-kopf";
	var rumpf = document.createElement("div");
	sidebar.appendChild(rumpf);
	rumpf.id = "smiley-liste";
	
	// Überschrift + Schließkreuz
	var text = document.createElement("strong");
	text.innerHTML = "Smiley Sidebar ";
	kopf.appendChild(text);
	var text = document.createElement("small");
	text.innerHTML = "by Merrx";
	kopf.appendChild(text);
	var close = document.createElement("img");
	close.src = "http://merrx.bestpony.de/smiley/closebutton.png";
	close.setAttribute("style", "float:right;margin-top:2px;margin-right:2px;");
	close.addEventListener("click", function() {ShowSidebar(false);}, false);
	kopf.appendChild(close);
	var switchButton = document.createElement("img");
	if(GM_getValue("leftSidebar",true)) {switchButton.src = "http://merrx.bestpony.de/smiley/arrowbutton-right.png";}
		else{switchButton.src = "http://merrx.bestpony.de/smiley/arrowbutton-left.png";}
	switchButton.setAttribute("style", "float:right;margin-top:2px;");
	switchButton.addEventListener("click", function() {GM_setValue("leftSidebar",!GM_getValue("leftSidebar",true)); ShowSidebar(true);}, false);
	kopf.appendChild(switchButton);
	var boxButton = document.createElement("img");
	if(GM_getValue("boxSidebar",true)) {boxButton.src = "http://merrx.bestpony.de/smiley/boxbutton-inside.png";}
		else{boxButton.src = "http://merrx.bestpony.de/smiley/boxbutton-aside.png";}
	boxButton.setAttribute("style", "float:right;margin-top:2px;");
	boxButton.addEventListener("click", function() {GM_setValue("boxSidebar",!GM_getValue("boxSidebar",true)); ShowSidebar(true);}, false);
	kopf.appendChild(boxButton);

	// Auswahl erzeugen
	var sform = document.createElement("form");
	sform.id="smiley-form";
	kopf.appendChild(sform);
	kopf = sform;
	
	// extra Element zum externen speichern
	var saveSmiley = GM_getValue('saveSmiley',"17101Applejack");

	// Kategoriewahl
	var kat = document.createElement("span");	
	kopf.appendChild(kat);
	var text = document.createElement("strong");
	text.innerHTML = "Kategorie:";
	text.style.marginTop = "2px";
	kat.appendChild(text);
	kat.appendChild(document.createTextNode(" "));

	var label = document.createElement("label");
	kat.appendChild(label);
	var elem = document.createElement("input");
	elem.setAttribute("name", "kategorie");
	elem.setAttribute("value", "1");
	elem.setAttribute("type", "radio");
	if(saveSmiley[0] == 1) {elem.setAttribute("checked", true);}
	elem.addEventListener("change", function() {ChangeSmile();}, false);
	label.appendChild(elem);
	label.appendChild(document.createTextNode("Pony"));
	kat.appendChild(document.createTextNode(" "));

	var label = document.createElement("label");
	kat.appendChild(label);
	var elem = document.createElement("input");
	elem.setAttribute("name", "kategorie");
	elem.setAttribute("value", "2");
	elem.setAttribute("type", "radio");
	if(saveSmiley[0] == 2) {elem.setAttribute("checked", true);}
	elem.addEventListener("change", function() {ChangeSmile();}, false);
	label.appendChild(elem);
	label.appendChild(document.createTextNode("Emote"));
	kat.appendChild(document.createTextNode(" "));

	// Auswahlfeld
	var sel = document.createElement('select');
	sel.id="smiley-sel";
	sel.setAttribute("style", "width:100%;margin-top:5px;margin-bottom:5px;");
	sel.addEventListener("change", function(){ChangeSmile();}, false);
	kopf.appendChild(sel);

	// 3 Checkboxen für Größe
	var gros = document.createElement("span");
	kopf.appendChild(gros);
	var text = document.createElement("strong");
	text.innerHTML = "Größe:";
	gros.appendChild(text);
	gros.appendChild(document.createTextNode(" "));

	var label = document.createElement("label");
	gros.appendChild(label);
	var elem = document.createElement("input");
	elem.setAttribute("class", "checkbox");
	elem.setAttribute("id", "smiley-kl");
	elem.setAttribute("type", "checkbox");
	if((saveSmiley[1] & 1) != 0) {elem.setAttribute("checked", true);}
	elem.addEventListener("change", function(){ChangeSmile();}, false);
	label.appendChild(elem);
	label.appendChild(document.createTextNode("klein"));
	gros.appendChild(document.createTextNode(" "));

	var label = document.createElement("label");
	gros.appendChild(label);
	var elem = document.createElement("input");
	elem.setAttribute("class", "checkbox");
	elem.setAttribute("id", "smiley-mi");
	elem.setAttribute("type", "checkbox");
	if((saveSmiley[1] & 2) != 0) {elem.setAttribute("checked", true);}
	elem.addEventListener("change", function(){ChangeSmile();}, false);
	label.appendChild(elem);
	label.appendChild(document.createTextNode("mittel"));
	gros.appendChild(document.createTextNode(" "));

	var label = document.createElement("label");
	gros.appendChild(label);
	var elem = document.createElement("input");
	elem.setAttribute("class", "checkbox");
	elem.setAttribute("id", "smiley-gr");
	elem.setAttribute("type", "checkbox");
	if((saveSmiley[1] & 4) != 0) {elem.setAttribute("checked", true);}
	elem.addEventListener("change", function(){ChangeSmile();}, false);
	label.appendChild(elem);
	label.appendChild(document.createTextNode("groß"));

	// Funktion, die Smileys einfügt
	function InsSmile(datei) {
		// Finden des Textfeldes
		if(document.getElementById('shout_data') != null) {
			var input = document.getElementById('shout_data');
		} else {
			var input = document.getElementsByTagName('textarea')[0];
			if(input.id == "to" ) input = document.getElementsByTagName('textarea')[2];
		}
		var insText = "[img]http://merrx.bestpony.de/smiley/"+datei+"[/img]";
		input.focus();
		if(typeof input.selectionStart != 'undefined')	{
			// Einfügen des Formatierungscodes 
			var start = input.selectionStart;
			var end = input.selectionEnd;
			input.value = input.value.substr(0, start) + insText + input.value.substr(end);
			// Anpassen der Cursorposition 
			var pos = start + insText.length;
			input.selectionStart = pos;
			input.selectionEnd = pos;
		}
	}

	// Klassenkonstruktion für die Quickbars
	var Quickbar = function($GMsave,$tops,$cbox,$label) {
		//lokal
		var tr, td1, td2, txt1;	// Quickbar-Elemente
		var label, ele, txt2;	// Checkbox-Elemente
		var list, showBar;		// 
	
		// aus der Listen entfernen (private)
		var remove = function(datei) {
			list = JSON.parse(GM_getValue('save'+$GMsave, '[]'));
			for(var i = 0; i < list.length; i++) {
				if(list[i] == datei) {
					list.splice(i,1);
				}
			}
			GM_setValue('save'+$GMsave, JSON.stringify(list));
			show(showBar);
		}
		
		//Quickbar ausblenden (private)
		var show = function(st) {
			tr.style.display = st ? "" : "none";
			ele.checked = st;
			showBar = st;
			GM_setValue('show'+$GMsave, showBar);
			
			list = JSON.parse(GM_getValue('save'+$GMsave, '[]'));
			td2.innerHTML = "";
			for(var i = 0; i < list.length; i++) {
				var img = document.createElement('img');
				img.setAttribute('src', 'http://merrx.bestpony.de/smiley/'+list[i]);
				img.addEventListener('click', function(e) {  if(e.shiftKey) remove(this.src.substr(32)); else InsSmile(this.src.substr(32));},false );
				td2.appendChild(img);
			}
		}
		
		//Konstruktor (private)
		function constr() {
			list = JSON.parse(GM_getValue('save'+$GMsave, '[]'));
			showBar = GM_getValue('show'+$GMsave, false);
			
			tr = document.createElement("tr"); /*tr.id=$qid;*/ $tops.parentNode.insertBefore(tr, $tops);
			td1 = document.createElement("td"); td1.setAttribute('class', 'trow1'); td1.setAttribute('valign', 'top'); tr.appendChild(td1);
			td2 = document.createElement("td"); td2.setAttribute('class', 'trow1'); tr.appendChild(td2);
			txt1 = document.createElement("strong"); txt1.innerHTML = $label+":"; td1.appendChild(txt1);
			
			label = document.createElement("label"); $cbox.appendChild(label); $cbox.appendChild(document.createElement("br"));
			ele = document.createElement("input"); ele.setAttribute("class", "checkbox"); ele.setAttribute("type", "checkbox"); label.appendChild(ele);
			ele.addEventListener("change", function() {show(!showBar); }, false);
			txt2 = document.createElement("strong"); txt2.innerHTML = " "+$label; label.appendChild(txt2);
			
			show(showBar);
		}; constr();
		
		// in die Liste aufnehmen (public)
		this.add = function(datei){
			list = JSON.parse(GM_getValue('save'+$GMsave, '[]'));
			list.reverse();
			
			var vorhanden = false;
			for(var i = 0; i < list.length; i++) {
				if(list[i] == datei) {
					return true;
				}
			}
			list.push(datei); list.reverse();	
			if(list.length > 12) list.pop();
			GM_setValue('save'+$GMsave, JSON.stringify(list));
			show(showBar);
		}
		
		// zum Aktualisieren
		this.update = function() {
			showBar = GM_getValue('show'+$GMsave, false);
			show(showBar);
		}
		
		// Shoutbox
		this.shout = function() {
			tr.appendChild(td1);
			td1.setAttribute("style", "border-right: 1px solid #323232; border-bottom: 1px solid #323232; border-left: 1px solid #323232;");
			td2.setAttribute("style", "width: 800px; border-left: 1px solid #323232; border-bottom: 1px solid #323232;");
			txt1.innerHTML = $label;
		}
	}

	// Ort für die Quickbars
	if (document.getElementById('message_old') != null) var tops = document.getElementById('message_old').parentNode.parentNode;
	if (document.getElementById('message') != null) var tops = document.getElementById('message').parentNode.parentNode;
	if (document.getElementById('quickreply_e') != null) var tops = document.getElementById('message').parentNode.parentNode.parentNode.nextElementSibling;
	if (document.getElementById('shout_data') != null) var tops = document.getElementById('shout_data').parentNode.parentNode.parentNode;
	
	fbar = new Quickbar('Favorite',tops,fakeform,'Favorite-Smileys');
	hbar = new Quickbar('History',tops,fakeform,'letzte Smileys');

	if (document.getElementById('shout_data') != null) { hbar.shout(); fbar.shout(); }
	
	// Smiley Seite wechseln
	function ChangeSmile() {		
		var rumpf = document.getElementById('smiley-liste');
		rumpf.innerHTML = "";

		var dir = document.getElementById('smiley-sel').value;
		if (dir == "") dir = GM_getValue('saveSmiley',"17101Applejack").substr(2);
	
		var kat = document.getElementsByName('kategorie')[0].checked ? 1 : 2;
		if(GM_getValue('saveSmiley',"17101Applejack")[0] != kat) {dir = "";}

		var gr = 0;
		if(document.getElementById('smiley-kl').checked) gr += 1;
		if(document.getElementById('smiley-mi').checked) gr += 2;
		if(document.getElementById('smiley-gr').checked) gr += 4;
			
		var srumpf = document.createElement('script');
		srumpf.type = 'text/javascript';
		srumpf.id = 'smiley-skript';
		srumpf.src = 'http://merrx.bestpony.de/smiley/smiley2.php?k='+kat+'&d='+dir+'&g='+gr;
		srumpf.addEventListener('load', function() {
			dir = document.getElementById('smiley-sel').value;
			GM_setValue('saveSmiley',"" + kat + gr + dir);
			var zeit = new Date().getTime();
			GM_setValue('dateSmiley',JSON.stringify(zeit));
			firstChange = GM_getValue('dateSmiley',0);
			// Hinzufügen der EventListener an die Smileys
			var imgs = document.getElementById('smiley-liste').getElementsByTagName("img");
			for(var i = 0; i < imgs.length; i++) {
				imgs[i].addEventListener('click', function(e) { if(e.shiftKey) fbar.add(this.src.substr(32)); else { InsSmile(this.src.substr(32)); hbar.add(this.src.substr(32)); }},false );	
			}
		},false);
		rumpf.appendChild(srumpf);		

	} ChangeSmile();	
	
	window.addEventListener("focus", function() {
		var lastChange = GM_getValue('dateSmiley',0);
		hbar.update();
		fbar.update();
		if(lastChange != firstChange) {
			saveSmiley = GM_getValue('saveSmiley',"17101Applejack");
			var kat = document.getElementsByName('kategorie')[0].checked ? 1 : 2;
			var newkat = saveSmiley[0];
			
			if(newkat == 1) {document.getElementsByName('kategorie')[0].checked = true;}
			else {document.getElementsByName('kategorie')[1].checked = true;}
			document.getElementById('smiley-kl').checked = ((saveSmiley[1] & 1) != 0) ? true : false;
			document.getElementById('smiley-mi').checked = ((saveSmiley[1] & 2) != 0) ? true : false;
			document.getElementById('smiley-gr').checked = ((saveSmiley[1] & 4) != 0) ? true : false;
			var dir	= saveSmiley.substr(2);
			if(kat != newkat){
				var ch = document.createElement('option'); 
				ch.setAttribute('value', dir);
				document.getElementById('smiley-sel').appendChild(ch);
			}
			document.getElementById('smiley-sel').value = dir;			
			ChangeSmile();
			
			document.getElementById('smiley-skript').addEventListener('load', function() {
				GM_setValue('dateSmiley',lastChange);
				firstChange = GM_getValue('dateSmiley',0);
			},false);
			GM_setValue('dateSmiley',lastChange);
			firstChange = GM_getValue('dateSmiley',0);
			ShowSidebar(GM_getValue("showSidebar",false));
		}
	},false);
}