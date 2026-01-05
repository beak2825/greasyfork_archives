// ==UserScript==
// @name        	DC Export Stocks
// @namespace   	DreadCast
// @include     	http://www.dreadcast.net/Main
// @author 			Ianouf
// @date 			10/01/2016
// @version 		0.7
// @description 	Export des stocks au format TSV ou CSV
// @grant       	none
// @compat 			Firefox, Chrome
// @downloadURL https://update.greasyfork.org/scripts/16177/DC%20Export%20Stocks.user.js
// @updateURL https://update.greasyfork.org/scripts/16177/DC%20Export%20Stocks.meta.js
// ==/UserScript==

var exportStockType = 1;

Engine.prototype.openDataBoxSave = Engine.prototype.openDataBox;
Engine.prototype.openDataBox = function(call, controller, toEval, idController){
	$.ajaxSetup({async: false});
	var res = this.openDataBoxSave(call, controller, toEval, idController);
	loadExportStocks(call);
	$.ajaxSetup({async: true});
	return res;
};

Engine.prototype.regenerateDataBoxSave = Engine.prototype.regenerateDataBox;
Engine.prototype.regenerateDataBox = function(a, b) {
	$.ajaxSetup({async: false});
	var res = this.regenerateDataBoxSave(a, b);
	loadExportStocks(a);
	$.ajaxSetup({async: true});
	return res;
};

function loadExportStocks(a){
	if(isExportStockCallable(a)){
		$('#modif_stocks_form').append('<input type="checkbox" id="exportStockToCSV"><div id="exportStock"></div>');
		$('#exportStock').css({
			position: 'absolute',
			right: '18px',
			top: '21px',
			width: '37px',
			height: '36px',
			background: 'url(../../../images/fr/design/boutons/boutons.png) -228px -382px no-repeat'
		}).hover(function(){
			$(this).css({'background-position': '-263px -382px'});
		}, function(){
			$(this).css({'background-position': '-228px -382px'});
		}).click(function(){
			exportStocks();
		});
		$('#exportStockToCSV').css({
			position: 'absolute',
			right: '54px',
			top: '21px',
			width: '37px',
			height: '36px'
		});
	}
}

function exportStocks(){
	var separateur = "\t";
	if($('#exportStockToCSV').is(':checked')){
		separateur = ";";
	}
	var exportContent = 'nom'+separateur+'image'+separateur+'quantiteDispo';
	if(exportStockType == 1){
		exportContent += separateur+'prixProd';
	}
	exportContent += separateur+'quantiteVente'+separateur+'prixVente'+"\n";
	if(exportStockType == 3){
		exportContent = 'adresse'+separateur+
						'type'+separateur+
						'qualite'+separateur+
						'id'+separateur+
						'hv'+separateur+
						'coord_x'+separateur+
						'coord_y'+separateur+
						'largeur'+separateur+
						'hauteur'+separateur+
						'surface'+separateur+
						'propriete'+separateur+
						'zones'+separateur+
						'digicode'+separateur+
						'camera'+separateur+
						'renforcement'+separateur+
						'meuble'+separateur+
						'prixVente'+"\n";
	}
	if(exportStockType == 4){
		exportContent = 'type'+separateur+exportContent;
	}
	$('#liste_stocks .sp').find('div.stock').each(function(){
		var ligne = '';
		if(exportStockType != 3){
			ligne = $(this).find('.nom_item .couleur4').html();
			ligne+=separateur;
			ligne += $(this).find('.case_item.linkBox').find('img').eq(0).attr('src').replace('http://www.dreadcast.net/images/objets/', '');
			ligne+=separateur;
			ligne += $(this).find('.quantite_vente.type2').eq(0).html().trim();
			ligne+=separateur;
			if(exportStockType == 1 || exportStockType == 4){
				ligne += $(this).find('.prix.type2').eq(0).html().replace(' ', '').replace('Cr', '').trim();
				ligne+=separateur;
				ligne += $(this).find('.quantite2.type2').eq(0).find('input').eq(0).val().trim();
				ligne+=separateur;
				ligne += $(this).find('.prix2.type2').eq(0).find('input').eq(0).val().trim();
				if(exportStockType == 4){
					var type = $(this).find('.nom_item').text().split('"');
					type = type[0].trim().split(' pour ');
					type = type[1];
					ligne = type+separateur+ligne;
				}
			}else{
				ligne += $(this).find('.quantite2.type2').eq(0).html().trim();
				ligne+=separateur;
				ligne += $(this).find('.prix.type2').eq(0).find('input').eq(0).val().trim();
			}
		}else{
			var digicode = ($(this).find('.icon_digicode').eq(0).hasClass('actif'))?'Oui':'Non';
			var camera = ($(this).find('.icon_camera').eq(0).hasClass('actif'))?'Oui':'Non';
			var renforcement = ($(this).find('.icon_renforcement').eq(0).hasClass('actif'))?'Oui':'Non';
			var coord_x = parseInt($(this).find('.logement_minimap .me').eq(0).css('left').replace('px', '')/70*100);
			var coord_y = parseInt($(this).find('.logement_minimap .me').eq(0).css('top').replace('px', '')/70*100);
			var hv = (13<coord_x && coord_x<67 && 0<coord_y && coord_y<34)?'Oui':'Non';
			var infos = $(this).find('.icone_batiment').eq(0).attr('onclick').replace('engine.displayLightMap(', '').split('[');
			var zones = infos[1].split(']');
			zones = zones[0];
			infos = infos[0].split(',');
			var id = infos[0];
			var largeur = parseInt(infos[3]);
			var hauteur = parseInt(infos[4]);
			var type =  $(this).find('.infos_batiment .nom').eq(0).html();
			var propriete = $(this).find('.infos_batiment').eq(0).html();
			propriete = propriete.split('<br>');
			propriete = propriete[0].split('</span>');
			propriete = propriete[1];
			if(!propriete){
				propriete = 1;
			}else{
				propriete = propriete.replace(' - Zone ', '').replace(' - Zones ', '');
			}
			var adresse =  $(this).find('.infos_batiment .info2').eq(0).html();
			var qualite = $(this).find('.qualite.type2').eq(0).html();
			var surface = $(this).find('.surface.type2').eq(0).html();
			var meuble = $(this).find('.estmeuble.type2').eq(0).html();
			var prix = $(this).find('.prix.type2 input').eq(0).val();
			ligne = adresse+separateur+
					type+separateur+
					qualite+separateur+
					id+separateur+
					hv+separateur+
					coord_x+separateur+
					coord_y+separateur+
					largeur+separateur+
					hauteur+separateur+
					surface+separateur+
					propriete+separateur+
					zones+separateur+
					digicode+separateur+
					camera+separateur+
					renforcement+separateur+
					meuble+separateur+
					prix;
		}
		exportContent += ligne+"\n";
	});
	var exportTextArea = $('#exportTextArea');
	if(!exportTextArea.length){
		$('#modif_stocks_form').append('<textarea id="exportTextArea"></textarea>');
		exportTextArea = $('#exportTextArea').css({
			position: 'absolute',
			left: '18px',
			top: '21px',
			width: '408px',
			height: '36px'
		});
	}
	exportTextArea.val(exportContent).focus().select();
}

function isExportStockCallable(z){
	eval(function(b,a,c,k,e,d){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--){d[e(c)]=k[c]||e(c)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){b=b.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return b}('1 y=$(\'#n .p\').m(0).u();1 a=z==\'7/6/l\';1 b=y==\'s 2 3 5é4\';1 c=y==\'t 2 3 5é4\';1 d=y==\'q 2 9\';1 e=y==\'v 2 3 5é4\';1 f=y==\'o 2 3 5é4\';1 g=y==\'8 2 w C\';1 h=y==\'E 2 9\';1 i=z==\'7/6\';1 j=z.D(0,x)==\'7/6/A=l&\';1 k=y==\'B 2 r\';',41,41,'|var|Rue|du|tique|Dean|Stocks|Company||Amstrade||||||||||||Display|eq|lieu_actuel|54|titre2|70|Hoblet|66|56|html|50|Hector|31|||default|158|Calver|substr|72'.split('|'),0,{}))
	if(c || d || f || g || h) exportStockType = 2;
	if((i || j) && k) exportStockType = 3;
	if(a && e) exportStockType = 4;
	return ((a &&  (b || c || d || e || f || g || h)) || ((i || j) && k));
}

console.log('export stocks');