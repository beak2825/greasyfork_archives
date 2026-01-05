// ==UserScript==
// @name         FonctionPersoTW
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       You
// @match        https://fr9.the-west.fr/game.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27216/FonctionPersoTW.user.js
// @updateURL https://update.greasyfork.org/scripts/27216/FonctionPersoTW.meta.js
// ==/UserScript==


(function() {
	'use strict';

	$(document).on('mouseenter', '.window-quest_employer', (function(){
		var url='https://wiki.the-west.fr/wiki/' + $('#open_quest_employerlink_' + $('[class*="questbook_detail_right_"]').attr('class').match(/\d+/)[0]).text().match(/\((.+)\)/)[1].replace(/\s/g, "_");
		$('.reward_text + div:not(:has(#aide_quete))').prepend(
			$('<a>').attr({'id': 'aide_quete', 'href':url, 'target':'_blank'}).css({ "height": "60px", "width": "60px", "background": 'url("https://wiki.the-west.fr/images/b/b7/Logor.png")', 'background-size' : 'contain', "margin-right": "25px", "float": "right", } )
		)
	}))




	// ajoute le bouton d'équipement de l'inventaire dans la fenetre inventaire
	EventHandler.listen("inventory_ready",addEquipSet);

	function addEquipSet(){
		//<div id="CC_pin_items" class="tw2gui_iconbutton" title="Toggle item pinning mode"></div>
		var bouton = document.createElement('div');
		$(bouton).addClass('tw2gui_iconbutton equip_set').html('<span class="tw2gui_button_right_cap"></span><span class="tw2gui_button_left_cap"></span><span class="tw2gui_button_middle_bg"></span><img alt="" class="tw2gui-iconset" style="background-position: -32px -48px;" src="./images/tw2gui/pixel-vfl3z5WfW.gif">');
		$(bouton).click(function(){$('.dnd_dropzone .item_inventory_img').click();});
		$('.inventory .search_container').prepend(bouton);
	}


	// creation de l'outils
	window.AlbanWindow={};

	// initialisation en mettant le bouton d'acces dans le menu
	AlbanWindow.init=function(){
		// insert le bouton dans la barre latérale
		$('#ui_menubar').append(
			$('<div class="ui_menucontainer">')
			.append($('<div id="alban" class="menulink"></div>').css({'background': 'url("https://dl.dropboxusercontent.com/u/103637791/iconebtn.png")'}))
			.append('<div class="menucontainer_bottom"></div>')
			.click(function(){AlbanWindow.open(this);})
		);
	};

	// creation la fentre à ouvrir en cliquant sur le bouton du menu
	// la fenetre contient tous les boutons d'action de l'outils
	AlbanWindow.open=function(nextto){
		// ferme la fenetre si elle est déja ouverte
		var wnd=wman.getById("albanwnd");
		if(wnd){
			wnd.destroy();
			return;}
		// ouvre la fenetre avec le manager de fenetre du jeu wman.open(id,title,windowclass,notanimated,noDrag)
		// hauteur=36*nb elem + 80
		wnd=wman.open("albanwnd","Outil Perso","alban noreload nominimize nocloseall",true,true).setMiniTitle('Outil perso').setSize(230,296).center();

		// positionnement par rapport au bouton (nextto)
		if(undefined!==nextto){
			var p=$(nextto).offset();// position du bouton
			p.left-=wnd.width()+10;
			$(wnd.getMainDiv()).offset(p);
		}

		// creation du main div
		var div=$("<div class='content' />");
		$.each(
			[
				["Equip.Inv.",function(){
					if(!!$(".tw2gui_window[class~=inventory]").length){
						$('.dnd_dropzone .item_inventory_img').click();
					}else{
						alert('Merci de selectionner des items dans la fenetre de l\'inventaire');
					}
				}],
				["Aide Quete",function(){
					if(!!$(".tw2gui_window[class~=window-quest_employer]").length){
						window.open('https://wiki.the-west.fr/index.php?title=Sp%C3%A9cial%3ARecherche&search='+$('div[class*="questbook_detail_right_"]').attr('class').match(/\d+/gi)[0]);
					}else{
						window.open("https://wiki.the-west.fr/wiki/Qu%C3%AAtes");
					}
				}],
				["Duel Quot",function(){
					var x;
					if (confirm("Faire les 3 duels quotidiens?") === true) {
						DuelsWindow.open();
						EquipManager.switchEquip(26016);
						AlbanWindow.actionWhenReady(
							'.dl_fightbutton[style!="display: none;"]:lt(3)',
							function(){
								$('.dl_fightbutton[style!="display: none;"]:lt(3)').click();
							}
						);
					}
				}],
				["Recup Marche",function(){
					MarketWindow.Sell.collectAll('Sell');
					MarketWindow.Sell.collectAll('Offer');
					AlbanWindow.actionWhenReady(
						'.tw2gui_button:contains(Annuler):eq(1)',
						function(){
							$('.tw2gui_button:contains(Annuler)').click();
						}
					);
				}],
				["Envoi Ami", function(){
					HiroFriends.windowManager.open();
					var a=setInterval(
						function(){
							if($('.row > div.cell.cell_2.hf_action > a:first').length){
								$('.row > div.cell.cell_2.hf_action > a:first').click();
							}else{
								clearInterval(a);
							}
						},
						1000);
				}],
				["Job15s Auto", function(){
					var count = parseInt(prompt());
					count = !isNaN(count) ? count : 0
					var b=setInterval(
						function(){
							document.querySelector('.job_durationbar_short').click();
							if(Character.energy == 0 || count == 0){
								clearInterval(b);
							}
							count--
						},
						15000);
				}]
			],
			//fonction executée pour chaque elementdu tableau contenant les boutons passé en argument
			function(i,a){// i: index; a: element
				div.append(
					new west.gui.Button(
						a[0],//text bouton
						function(){// fonction bouton
							a[1]();
							wnd.destroy();// ajoute la fermeture de la fenetre quand on clique sur un bouton
						}
					).setMinWidth(175).getMainDiv()
				);
			}
		);
		wnd.appendToContentPane(div);// ajoute le contenu à la fenetre
	};

	// attend qu'un element soit pret avant de lancer l'action demandée dessus.
	AlbanWindow.actionWhenReady = function (refElemWait, actionToDo, temoin){
		var tem = temoin || 0,// compteur de secours limitant à 100 boucles soit 20s
			attente;
		if ($(refElemWait).length>0 || tem>100){
			clearTimeout(attente);
			actionToDo();
		} else {
			attente = setTimeout(function(){
				tem++;
				AlbanWindow.actionWhenReady(refElemWait, actionToDo, tem);
			}, 200);
		}
	};

	// lance l'initialisation
	AlbanWindow.init();

})();