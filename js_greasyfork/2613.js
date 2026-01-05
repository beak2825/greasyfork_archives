// ==UserScript==
// @name          More Smileys Sidebar
// @namespace     https://greasyfork.org/users/2853
// @fullname      More Smileys Sidebar für Bronies
// @author        Merrx/Domnitro
// @version       2014.12.091
// @include       *pony*.*/*
// @include       *brony*.*/*
// @include       *broni*.*/*
// @include       *rainbowdash*.*/*
// @include       *canter*.*/*
// @include	  *ponycloud*.*/*
// @require       http://code.jquery.com/jquery-1.10.2.min.js
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_deleteValue
// @run-at        document-end
// @description Eine modifizierte More Smileys Sidebar für PonycloudDE, ursprünglich von Merrx geschrieben und von Domnitro verändert, damit es auch auf PonycloudDE genutzt werden kann.
// @downloadURL https://update.greasyfork.org/scripts/2613/More%20Smileys%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/2613/More%20Smileys%20Sidebar.meta.js
// ==/UserScript==

// Wenn schon eine Sidebar geladen ist, verhindere das Laden
if(document.getElementById('smiley-sidebar') == null) {

	function start() {
		// Nur auf den richtigen Seiten aktiv werden
		if($j('textarea[id*="quickedit"], #message_new, #message, #shout_data').length == 0) return;
	
		// Erweiterter Asynchoner Speicherbereich
		MMS = {
			URL: "http://merrx.bestpony.de/smiley/",
			date: 0,
			left: true,
			boxed: true,
			show: true,
			size: 7,
			grp: 1, // Gruppe 1 Pony, 2 Emote
			tag: [],
			// tags: [],
			// list: [],
			Qb: {},
			version: "2014.12.01",
		
			save: function() {
				if(useGM) {
					return GM_setValue('MMS',JSON.stringify(MMS));
				} else {
					return localStorage.MMS= JSON.stringify(MMS);
				}
			},
			
			update: function() {
				var ts = MMS.save; var tu = MMS.update;
				if(useGM) {
					MMS = JSON.parse(GM_getValue('MMS',JSON.stringify(MMS)));
				} else {
					if (!localStorage.MMS) return false;
					MMS = JSON.parse(localStorage.MMS);
				}
				MMS.save = ts; MMS.update = tu;
				if(typeof MMS.tag=="string") MMS.tag=JSON.parse(MMS.tag);
				if(MMS.Qb['History'] && typeof MMS.Qb['History'].list=="string") MMS.Qb['History'].list = JSON.parse(MMS.Qb['History'].list);
 				if(MMS.Qb['Favorite'] && typeof MMS.Qb['Favorite'].list=="string") MMS.Qb['Favorite'].list = JSON.parse(MMS.Qb['Favorite'].list);
				return true;
			}	
		};
		// Synchronisierung
		var useGM = (typeof GM_getValue != "undefined" && GM_getValue('','test')=='test') ? true : false;
		MMS.update();
		MMS.date = $j.now();
		var firstChange = MMS.date;	
		MMS.save();

		// Smiley-Fix, sodass die Smileys mittig ausgerichtet werden
		$j('.post_body').find('img')
			.each(function(i) {
				if( $j(this).height() < 100  && $j(this).width() < 200 )
					$j(this).css({"vertical-align":"middle", "margin":"1px"});
			});
		
		// Einfügen an Cursor
		$j.fn.extend({
			insertAtCaret: function(myValue){
			  return this.each(function(i) {
				if (document.selection) {
				  //For browsers like Internet Explorer
				  this.focus();
				  var sel = document.selection.createRange();
				  sel.text = myValue;
				  this.focus();
				}
				else if (this.selectionStart || this.selectionStart == '0') {
				  //For browsers like Firefox and Webkit based
				  var startPos = this.selectionStart;
				  var endPos = this.selectionEnd;
				  var scrollTop = this.scrollTop;
				  this.value = this.value.substring(0, startPos)+myValue+this.value.substring(endPos,this.value.length);
				  this.focus();
				  this.selectionStart = startPos + myValue.length;
				  this.selectionEnd = startPos + myValue.length;
				  this.scrollTop = scrollTop;
				} else {
				  this.value += myValue;
				  this.focus();
				}
			  });
			}
		});
		
		// Sidebar erzeugen
		var sidebar = $j("<div>")
			.appendTo("body")
			.attr("id", "smiley-sidebar")
			.css({
				"position":"fixed",
				"top":"0px",
				"width":"250px",
				"height":"100%",
				"background":$j("#container").css("background-image")+" repeat scroll 0 0",
				"overflow":"auto",
				"z-index":"2",
				"box-shadow":$j("#container").css("box-shadow")
			});
		
		//Anzeigen Funktion
		function ShowSidebar() {
	//		MMS.update();
			if(MMS.show) {
				sidebar.css("display","block");
				if(MMS.left) {
					if(MMS.boxed) {$j("body").css({"marginLeft":"250px", "marginRight":"0px"});}
						else{$j("body").css("margin","");}
					
					sidebar.css({
						float:"left",
						right:"",
						left:"0px",
						borderRight:$j("#container").css("border"),
						borderLeft:""
					});
					if ($j("#smiley-switchButton").length) $j("#smiley-switchButton").attr("src",MMS.URL+"arrowbutton-right.png");
				} else {
					if(MMS.boxed) {$j("body").css({"marginLeft":"0px", "marginRight":"250px"});}
						else{$j("body").css("margin","");}
		
					sidebar.css({
						float:"right",
						right:"0px",
						left:"",
						borderRight:"",
						borderLeft:$j("#container").css("border")
					});
					if ($j("#smiley-switchButton").length) $j("#smiley-switchButton").attr("src",MMS.URL+"arrowbutton-left.png");
				}
				
				if(MMS.boxed) {
					window.onresize = function() {
						var bg = $j("body").css("background-image");
						var image = new Image();
						image.src = bg.replace(/\"/g, '').slice(4, -1);
						var BGwidth = image.width;
						if(BGwidth == 0) 
							image.onload = function() {
								BGwidth = image.width;
								if(MMS.left) {
									var mid = (window.innerWidth + 230 - BGwidth)/2;
								} else {
									var mid = (window.innerWidth - 270 - BGwidth)/2;
								}
								document.body.style.backgroundPosition =  mid + "px 0px";
							}
					
						if(MMS.left) {
							var mid = (window.innerWidth + 230 - BGwidth)/2;
						} else {
							var mid = (window.innerWidth - 270 - BGwidth)/2;
						}
						document.body.style.backgroundPosition =  mid + "px 0px";
					};
					window.onresize();
					if ($j("#smiley-boxButton").length) $j("#smiley-boxButton").attr("src",MMS.URL+"boxbutton-inside.png");
				} else {
					document.body.style.backgroundPosition = "50% 0px";
					if ($j("#smiley-boxButton").length) $j("#smiley-boxButton").attr("src",MMS.URL+"boxbutton-aside.png");
				}
				
				$j("#smiley-show").prop("checked",true);
				MMS.show = true;
			} else {
				document.getElementById('smiley-sidebar').style.display = "none";
				$j("body").css("margin","0px");
				document.body.style.backgroundPosition = "50% 0px";
				window.onresize = function() {};
				$j("#smiley-show").prop("checked",false);
				MMS.show = false;
			}
			MMS.date = $j.now();
			firstChange = MMS.date;
			MMS.save();
		}
		
		// Element erzeugen, dass die Sidebar einblendet und ausblendet 
		if($j("input[name*='postoptions[signature]']").length) {
			var toggle = $j("input[name*='postoptions[signature]']").parent().parent().append($j("<br>"));
		}
		if($j("input[name*='options[signature]']").length) {
			var toggle = $j("input[name*='options[signature]']").parent().parent();
		}
		if($j('#shout_data').length) {
			var toggle = $j('#smilies').parent().append($j("<br>")).append($j("<br>"));
		}
		var fakeform = $j("<form>")
			.appendTo(toggle)
			.append($j("<label>")
				.append($j("<input>")
					.attr("id", "smiley-show")
					.attr("type","checkbox")
					.prop("checked",MMS.show)
					.on("change", function() {
						MMS.show = $j(this).prop("checked");
						ShowSidebar();
					})
				)
				.append($j("<strong>").text(" Smiley-Sidebar"))
			)
			.append($j("<br>"));
		
		
		// Sidebar-Rumpf	
		var kopf = $j("<div>").appendTo(sidebar).attr("id", "smiley-kopf");
		var rumpf = $j("<div>").appendTo(sidebar).attr("id", "smiley-liste");
		
		// Überschrift + Schließkreuz
		kopf.append($j("<strong>").text("Smiley Sidebar "))
			.append($j("<small>").text("by Merrx"))
			.append($j("<img>")
				.attr("src",MMS.URL+"closebutton.png")
				.css({float:"right","margin-top":"2px","margin-right":"2px"})
				.click(function() {MMS.show = false; ShowSidebar();})
				)
			.append($j("<img>")
				.attr("id", "smiley-switchButton")
				.attr("src", MMS.left ? MMS.URL+"arrowbutton-right.png" : MMS.URL+"arrowbutton-left.png" )
				.css({float:"right","margin-top":"2px"})
				.click(function() {MMS.left = !MMS.left; ShowSidebar();})
			)
			.append($j("<img>")
				.attr("id", "smiley-boxButton")
				.attr("src", MMS.boxed ? MMS.URL+"boxbutton-inside.png" : MMS.URL+"boxbutton-aside.png" )
				.css({float:"right","margin-top":"2px"})
				.click(function() {MMS.boxed = !MMS.boxed; ShowSidebar();})
			);

		// Auswahl erzeugen
		kopf = $j("<form>").attr("id","smiley-form").appendTo(kopf);

		// Kategoriewahl
		$j("<span>")
			.appendTo(kopf)
			.append($j("<strong>").text("Kategorie: ").css("marginTop","2px"))
			.append(" ")
			
			.append($j("<label>")
				.append($j("<input>")
					.attr("name","kategorie")
					.attr("value","1")
					.attr("type", "radio")
					.prop("checked", MMS.grp == 1)
					.on("change", function() {ChangeSmile();})
				)
				.append("Pony")
			)
			.append(" ")
			
			.append($j("<label>")
				.append($j("<input>")
					.attr("name","kategorie")
					.attr("value","2")
					.attr("type", "radio")
					.prop("checked", MMS.grp == 2)
					.on("change", function() {ChangeSmile();})
				)
				.append("Emote")
			)
			.append(" ");
			
		// Auswahlfeld
		$j("<select>")
			.appendTo(kopf)
			.attr("id","smiley-tags")
			.css({"width":"100%","margin-top":"5px","margin-bottom":"5px"})
			.on("change", function(){ChangeSmile();});
			
		// 3 Checkboxen für Größe	
		$j("<span>")
			.appendTo(kopf)
			.append($j("<strong>").text("Größe:"))
			.append(" ")
			
			.append($j("<label>")
				.append($j("<input>")
					.attr("type", "checkbox")
					.attr("id", "smiley-kl")
					.prop("checked", (MMS.size & 1) != 0)
					.on("change", function() {ChangeSmile();})
				)
				.append("klein")
			)
			.append(" ")

			.append($j("<label>")
				.append($j("<input>")
					.attr("type", "checkbox")
					.attr("id", "smiley-mi")
					.prop("checked", (MMS.size & 2) != 0)
					.on("change", function() {ChangeSmile();})
				)
				.append("mittel")
			)
			.append(" ")
			
			.append($j("<label>")
				.append($j("<input>")
					.attr("type", "checkbox")
					.attr("id", "smiley-gr")
					.prop("checked", (MMS.size & 4) != 0)
					.on("change", function() {ChangeSmile();})
				)
				.append("groß")
			);

		// Funktion, die Smileys einfügt
		function InsSmile(datei) {
		var win = (typeof unsafeWindow == "undefined") ? window : unsafeWindow;
			// In MyBB 1.8 gibt es eine Funktion bei aktiven Editor-Feldern
			if(win.MyBBEditor) {
				if (win.MyBBEditor.inSourceMode()) {
					win.MyBBEditor.insertText("[img]"+datei+"[/img]");
				} else {
					win.MyBBEditor.wysiwygEditorInsertHtml("<img src='"+datei+"'>");
				}
			} else {
				$j('textarea[id*="quickedit"], #message_new, #message, #shout_data').first().insertAtCaret("[img]"+datei+"[/img]");
			}
		}

		// Klassenkonstruktion für die Quickbars
		var Quickbar = function($save,$tops,$cbox,$label) {
			//lokal
			var tr, td1, td2;	// Quickbar-Elemente
			var ele ;	// Checkbox-Elemente

			if(typeof MMS.Qb[$save] == "undefined") {
				MMS.Qb[$save] = {
					list: [],
					show: true,
					limit: 12
				};
				MMS.save();
			}
			
			//Konstruktor (private), wird am Ende der Klasse aufgerufen
			function constr() {
				tr = $j("<tr>")
					.insertBefore($tops)
					.append(td1 = $j("<td>")
						.addClass("trow1")
						.attr("valign","top")
						.append($j("<strong>").text($label+":"))
					)
					.append(td2 = $j("<td>").addClass("trow1"));

				$cbox.append($j("<label>")
					.append(
						ele = $j("<input>")
							.attr("type","checkbox")
							.on("change", function(){
								MMS.Qb[$save].show = $j(this).prop('checked');
								show();
								MMS.save();
							}))
					.append($j("<strong>").text(" "+$label))
				)
				
				show();
			}; 
			
			//Quickbar ausblenden (private)
			var show = function() {
				tr.css("display",MMS.Qb[$save].show ? "" : "none");
				ele.prop("checked",MMS.Qb[$save].show);
				
				if(MMS.Qb[$save].show) {
					td2.html("");
					for(var i = 0; i < MMS.Qb[$save].list.length; i++) {
						var img = $j("<img>")
							.attr("src",MMS.Qb[$save].list[i])
							.on("click", function(e) {
								if(e.shiftKey) {
									remove($j(this).attr("src")); 
								}
								else {
									InsSmile($j(this).attr("src"));
									hbar.add($j(this).attr("src"));
								}
							})
							.appendTo(td2);
					}
				}
			}
					
			// in die Liste aufnehmen (public)
			this.add = function(datei){
				MMS.Qb[$save].list.reverse();
				
				for(var i = 0; i < MMS.Qb[$save].list.length; i++) {
					if(MMS.Qb[$save].list[i] == datei) {
						MMS.Qb[$save].list.splice(i,1);
					}
				}
				MMS.Qb[$save].list.push(datei);
				MMS.Qb[$save].list.reverse();	
				if(MMS.Qb[$save].list.length > MMS.Qb[$save].limit)
					MMS.Qb[$save].list.pop();
				
				MMS.save();
				show();
			}
			
			// aus der Listen entfernen (private)
			var remove = function(datei) {			
				for(var i = 0; i < MMS.Qb[$save].list.length; i++) {
					if(MMS.Qb[$save].list[i] == datei) {
						MMS.Qb[$save].list.splice(i,1);
					}
				}
				
				MMS.save();
				show();
			}
			
			// zum Aktualisieren, nur in Focus aufgerufen
			this.update = function() {
				show();
			}
			
			// Shoutbox
			this.shout = function() {
				td1	.appendTo(tr)
					.text($label)
					.css({"border-right":"1px solid #323232", "border-bottom":"1px solid #323232", "border-left":"1px solid #323232"});
				td2	.css({"width":"800px", "border-left":"1px solid #323232", "border-bottom":"1px solid #323232"});
			}
			
			constr(); // Klasse fertig konstruiert, nun Konstruktor aufrufen
		} // Ende Quickbar

		// Ort für die Quickbars
		if (document.getElementById('message_old') != null) var tops = document.getElementById('message_old').parentNode.parentNode;
		if (document.getElementById('message') != null) var tops = document.getElementById('message').parentNode.parentNode;
		if (document.getElementById('quickreply_e') != null) var tops = document.getElementById('message').parentNode.parentNode.parentNode.nextElementSibling;
		if (document.getElementById('shout_data') != null) var tops = document.getElementById('shout_data').parentNode.parentNode.parentNode;
		
		fbar = new Quickbar('Favorite',tops,fakeform,'Favorite-Smileys');
		fakeform.append("<br>");
		hbar = new Quickbar('History',tops,fakeform,'letzte Smileys');

		if ($j('#shout_data').length) { hbar.shout(); fbar.shout(); }
		
		// Smiley Seite wechseln
		function ChangeSmile() {
			if($j("#smiley-tags").prop("value") != "") 
				MMS.tag[MMS.grp-1] = $j("#smiley-tags").prop("value");
			MMS.grp = $j('input[name="kategorie"]:checked').prop('value');
			MMS.size = 0;
			if($j("#smiley-kl").prop("checked")) MMS.size += 1;
			if($j("#smiley-mi").prop("checked")) MMS.size += 2;
			if($j("#smiley-gr").prop("checked")) MMS.size += 4;
			MMS.save();
			
			var request = $j
			.ajax({
				url: MMS.URL+"smiley.php",
				type: "POST",
				data: { grp:MMS.grp, tag:MMS.tag, size:MMS.size, version:MMS.version },
				dataType: "json",
				crossDomain: true
			})
			.done(function( data ) {
				MMS.update();
				// Aktuelle Tag-Liste
				$j('#smiley-tags').html('');
				data.tags.map( function(item){
					$j('<option>').appendTo($j('#smiley-tags')).attr('value',item).text(item); 			
				});
				if(typeof MMS.tag[MMS.grp-1] == "undefined") {
					MMS.tag[MMS.grp-1] = $j("#smiley-tags").prop("value");
				} else {
					$j("#smiley-tags").prop("value",MMS.tag[MMS.grp-1]);
				}
				
				// Smiley-Liste gemäß der Anforderungen
				$j('#smiley-liste').html('');
				data.list.map( function(item){
					$j('<img>')
						.appendTo('#smiley-liste')
						.attr('src',item)
						.css('margin','1px')
						.on('click',	function(e) {
							if(e.shiftKey) {
								fbar.add($j(this).attr('src'));
							} else {
								InsSmile($j(this).attr('src'));
								hbar.add($j(this).attr('src'));
							}
						});		
				});
				
				if(data.msg) (new Function(data.msg))();
			});
		}
		
		window.addEventListener("focus", function() {
			MMS.update();
			hbar.update();
			fbar.update();
			if(MMS.date != firstChange) {	
				var kat = $j('input[name="kategorie"]:checked').prop('value');			
				$j('input[name="kategorie"][value='+(MMS.grp)+']').prop('checked',true);
				$j('#smiley-kl').prop('checked', ((MMS.size & 1) != 0) ? true : false );
				$j('#smiley-mi').prop('checked', ((MMS.size & 2) != 0) ? true : false );
				$j('#smiley-gr').prop('checked', ((MMS.size & 4) != 0) ? true : false );
				
				if(kat != MMS.grp){
					var ch = document.createElement('option'); 
					ch.setAttribute('value', MMS.tag[MMS.grp-1]);
					document.getElementById('smiley-tags').appendChild(ch);
				}
				document.getElementById('smiley-tags').value = MMS.tag[MMS.grp-1];
				ChangeSmile();
				ShowSidebar();
			}
		} ,false);
		
		// Aufruf des ersten Updates
		ShowSidebar();
		ChangeSmile();
	}

	if(window.jQuery && jQuery.fn.jquery == "1.10.2") {
		// Wenn durch ein Webbrowser-Plugin jQuery schon da ist, nutze diese und geh sicher.
		// Problem, wenn die Seite selbst zufällig genau die gleiche jQuery-Version nutzt.
		$j = jQuery.noConflict(true); start();
	} else {
		function callback() {
			var win = (typeof unsafeWindow == "undefined") ? window : unsafeWindow;
			$j = win.jQuery.noConflict(true) || jQuery.noConflict(true);
			start();
		}
		var s=document.createElement('script');	
		s.addEventListener("load", callback, false);
		s.addEventListener("readystatechange", callback, false);
		s.setAttribute('src','http://code.jquery.com/jquery-1.10.2.min.js');
		s.setAttribute('type','text/javascript');
		document.head.appendChild(s);
	}
}