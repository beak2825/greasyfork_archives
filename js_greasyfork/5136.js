// ==UserScript==
// @name			WME UR responses types
// @namespace		@UR2T_Myriades
// @description		Add a dropdown list to the UR conversation panel
// @include			https://www.waze.com/*editor/*
// @icon			data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAtCAYAAAApzaJuAAAABGdBTUEAALGPC/xhBQAAAAZiS0dE AP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB98BCgk4GHZD0qwAAAAdaVRY dENvbW1lbnQAAAAAAENyZWF0ZWQgd2l0aCBHSU1QZC5lBwAAC9RJREFUWMOtmXtwU9edx7/n3Ht1 fSXLlrEtY9W2FOMHOGAbG2PslmBCqBuSttlNs2NItkMytJkwm2x2mvxRdjZO0mlp0hm3ISGFLGQ7 DekwMEnKdtY7CaHIhpbwMATiB8TG+CFbtiVLtmVJvo9z7v6RwJL4gZ3xb+bMnDm636OPfr9zfud3 rggW2WpqakRd1xVCSAqA9IyMDNemTZuKnE5nBuec+v3+8MmTJ6+Pjo4GTNMMAgiYphmWJCnu9XoN ACCLCVReXi5ZLBY7IcS1Y8eOezdv3rzN5XKVUUql259jjBm9vb1tH3zwwf8cO3bs74yxXtM0BzVN i7S0tOhkMT0Ui8WSc3Nz83bv3l3v8Xi+F9MM8tnQKK4HxzE+pQEAkhMsWJaajFWZqbBaRLO1tfXM rl279o2NjbWpqtprtVrHFwuKVlZWJhYUFBS89tprBx2OlOK/9/hxotOHKYPNKEgQBWzKz0K1JxOD gwPXd+7c+YtAIHCRc94rLAZRXl6eJTU11blv377fpaWlVb93pRvN3YMwuDmrxuAmOoPjGIurqMzL WVJWVpbd2Nh4xWKxTCwKVHFxsb2+vv7hVatWPe29Poi/9fjnrfVHYhAoxZqCu1ymaQYuXbrUTRcD SlVVW3l5+U/G4ipOdg0sWH+yy4exuIotW7Z83zRN56JAbdu2zWO324tbfAEYnC9Yb3ATLb4Ali5d 6ikpKXEvClR1dXUpANIVHP/KeKHTgUKnY87+TesMjgEAueeeewoWBcrhcKQDwHhc/cp4XWk+6krz 5+zftLH4FykjLS0tRVwMKNM0GQB8fbMd/rQTMOfu3zSB3MpOxqJAxWKxfgBItSVgQtVujV8bGbtj /6YtscoAgGAw6P86FAFAysvLBV3XLTabTQagEEISCCEJnHMLpVSglFL+hTFKqfbWW28N7tmzh+Wn Jws3QhPf6IcVpDvAOecnTpz49HYoUlNTI6iqKgFQFEVJ5JwnVVVVZdfV1W3OyclZY7fbl8mynEYp tXDONVVVg5FI5Hpra+uV4eHh1opsZ0nT9UGos2Tx2SxBFLAm24nh4eFL7e3t3TehSHl5uajreoKm aYmSJDlqa2sLt2/f/qTL5bqPUirGtSh6RtsRnPRD1acgSwmWtMRMlyd1uWv9+vXrJycnmSIK5gMr 3OT9z7oXBPVgkQcJosAbGxvfppSOiDeBRFFUBEFItlqt6a+++upjFRUVTxFKEi72NqPp2p9xbegS uDk9B1FCUZBRinXuLUKxWIU12U6MT2k40embF9B3C7JRlpWOjo6OowcOHDgZiUTC5Pb6x2q1Zu7f v/8Fj8ezpS/UiT+c/jV6R6/NcwcC30rMxzObf430lAy0D4fw3pVuxHVjxudTrQl4sMiNQmcKfD7f h48//vjzwWCwPz8/P0KKi4ttNpvNQSnNPHTo0Msej+f+T65/hLdP7YbBtIWlBmYCmgU/q/0t7s5b jWNt3TjXN3Lr8+VOBzKTbLhrSRKWpSaBcz7V0dHx1lNPPbU3Ho8P5+bmTh49epSJiYmJNsZYakND w489Hs/9Z7o+xH82vQzTNBe8g7hpwtBVBKIDYLwE7UNhAIBdlvDQylwsz0gBAcx4PO7z+XwfHT58 +J3GxsZr8Xh8oqWlRW1paWEAIJqmmVRbW3t3RUXFT3uDn+Ng86/Av8H5BQAmBwpdJdhQvAXtw2Fk OxJR4HSg1JUGkcA4+8knBw4dOvSny5cv92qaFmWMxe12u/YlzC0viLIsO5544okdhBL5YNMvoeuz h6zU/W1sXPEPKMwshSwpCEYGcannNBqvvIuxaBAwgS1rtoFSipWZqViZmQrOOUZGRkb37t37y+PH j58cHx/vt9lsEy0tLQam5fUvocrKyu7Kzs7ecL77r+gJzLyoRUHCk/e+iMplm74y7kzKQm1xHb5T +ABeP/5ztPVdwO8/egF5zmJYJTvGY2FU5t6H1Z7vOEKh0CilNJ6UlKSfO3eOzwYEAPThhx++j1Iq /LXtfZimOWOrW/f0NKDbzSbb8a/ffQVpSUuhIY72kbO4MPAxOsMtuDj0MZxOp/Doo49+WxRFGYBU U1MzZxlO3W736pg6iY6BizMCJYhWbCx66I7rSbHY8EDpY9P0HQMXEVMn4Xa7VzPGbLIsW3w+35wV L3U4HJ4bgQ4wxmByc1rLSc2HJFjmtdBXuMqn6RljuBHogMPh8EiSlMAYs6Snp89ZMlFFURyBCf+s oVuSmDHv3ScK0oxzBCb8UBTFwTm3ABDtdvucUCKlVFL1OPgseSl/afG8oXqDn884j6rHQSmVOOdU FEWqadqca0pkjOmypEjm1yo0SbDg5w+9jqKsNfOG+vDTIzBnuFbJkgLGmA4AlNI7ZmUajUZDGclZ 01yuGSpabpyCifll9j+fexuf9Z2dMXwZyVmIRqMhQRCYYRjcYrHMOSkdHR3tyXWugEinr4e/XPgj dv3pn9HmuzAn0JEz+/Du6T0zAolUQq5zBUKh0A3OuQbAiEQicx4Z9Nq1a5/KkoISdzVMjmmty9+G w6f3gpscBtPxq/f+Bc//sQ6/OfYzMM7AOMPF7tMzak0OlLirIEsKrl69ehlAnBCiBwKBOaHI1q1b H3vnnXcOtPafl18++uSsD7pS3NCZhsDE/99+M5K/BUIohsb6Z9W98Mg+3J1VoW7fvn1Hd3f3ZQAD sixP3HztM6OnfD6fv7W11VviWYdi97pZU8NAqAcj44NfGRsa88Ef7ptVU+xehxJPFdra2rx9fX1+ QRCisixrXq937vABCDc0NBxRVTWys7YeiXLSrF+ykJYoJ2FnbT1UVY00NDQcARDWdT3q8/n0uc49 ABBycnKUUChkWq3W+LqK6spCVwk51f6/YMz4QvoNmkWQ8e8/egNuZ6F5+PDhfcePH/8EwDCldPzy 5csqgDk9JaSnpwuiKJLz58+Hli1bJq8tqS5a6V6LC11NmNJiC78t21LxH//0exRll6Opqen9V155 5T1CyMDU1FRodHQ0HgqFjDvNIbhcLiiKwhljZlNTU192djZdW1K9omblD8hoZAR9I53zylUEBOuL 7seuH72OrNRcfuLEiaMvvvjiu6Zp9lssloCmaZNtbW3anUIHAEJhYaEJgBuGwQRBMLxe742pqamh 1cVlyzeWPKhULd8MQgiGwv1QtalpoZKoBd8rr8PTD/4CW9ZshaGy0MGDB9984403/ptS6mOMBURR jMiyrPb09MyrpCU3L6EAEhhjdsMw0gRByFiyZEnOM8888/3KysqNiYmJyV3+Njz/dh30L06LW/aT 2l34YeWPEYlEJs6ePXtyz549fwmHw72MsWFRFIOCIEQATHm9XjYfLwGAAAA9PT2mx+Ph0WjUkGVZ 03Vd1TRtsrm5ufPIkSPnli5dKqwtrcqTJQUXr//tlnhtQQ1+WrsLXV1d7Vu3bn3V6/U2x2KxG4Zh +CVJCsZisYgsy+pCgG5B3QTz+/08NzfXiEajGiFENU1zyjRNtbm52bdhw4a8qlUbnZ8PfIaB0R6k 2p14+dEDMDQ+9txzz/02HA5/zjn36bo+rGla2Gq1xs6cOaN9GbIFXY3obWEEAEQiEaYoimoYRoRSOso5H+KcD9TX1x+IRqPj//bQbqQmOvHcP/4GdsXB9+/f/199fX1dpmn6GWNBXdcjiqKotx0lZKHv6wUA5JFHHqGapklZWVkWWZYthBBZFEULY0wkhIiCIEjhcJhGo9HxjRs2ld9b+kPicRbA6/Uef/PNNz/+8p+DCKVUp5SCcy6kpaUJmZmZYlZWFk1OTiaBQGD+4aupqRGHh4dlm81mkyTJTilNNk0zSRTFZEppkiiKdkKIDYD16tWrqsfjUYoK7/b09/f3PPvss0c555OEEI0QQgHIoigqlFIrY0xhjMmMMVEQBJSWlppdXV3zCqUgiqKUlJRklSTJQQhJEUUxRRCEFM55CgAH5zwZQBJjLItz7jx16lRk9erVGS+99NLpYDAIADIhBJRSkVJqI4Qkcs5tnHOFUmqRZVkQBIGrqsqcTif3+/13hPo/njSSFg6nnB8AAAAASUVORK5CYII=
// @grant			GM_xmlhttpRequest
// @version			1.2
// @copyright		2014, Myriades
// @downloadURL https://update.greasyfork.org/scripts/5136/WME%20UR%20responses%20types.user.js
// @updateURL https://update.greasyfork.org/scripts/5136/WME%20UR%20responses%20types.meta.js
// ==/UserScript==

/***	Remerciements : DummyD2, seb-d59, Yopinet et tous les testeurs :)	***/

/**************************/
/***	UR2T object		***/
/**************************/
console.info('WME_UR2T_' + GM_info.script.version + ' : ' + 'Init start');
var UR2T = {};
if(localStorage.UR2T){
	UR2T = JSON.parse(localStorage.UR2T);
	//	Ajout/modification des objets V1.1 -> V1.2
	if(typeof(UR2T.GUI) == 'undefined')UR2T.GUI = {'defaultLeft': 350, 'defaultTop': null, 'left': 350, 'top': null};
	if(isNaN(UR2T.GUI.defaultLeft))UR2T.GUI.defaultLeft = 350;
	if(isNaN(UR2T.GUI.defaultTop))UR2T.GUI.defaultTop = null;
	if(isNaN(UR2T.GUI.left))UR2T.GUI.left = 350;
	if(isNaN(UR2T.GUI.top))UR2T.GUI.top = null;
	//	Ajout/modification des objets V0.6 -> V1.1
	UR2T.scriptVer = GM_info.script.version;
	UR2T.answers.UR['outils'].objects[1] = {'question': 'Insérer ma signature', 'answer': 'UR2T_insertSign'};
	UR2T.answers.UR['outils'].objects[3] = {'question': 'Nouvelle réponse', 'answer': 'UR2T_AddResponses'};
	UR2T.answers.UR['outils'].objects[5] = {'question': 'Import / export', 'answer': 'UR2T_importExport'};
	UR2T.answers.UR['outils'].objects[6] = {'question': 'À propos', 'answer': 'UR2T_apropos'};
	var URs = UR2T.answers.UR;
	for(var URType in URs){
		for(var URId in URs[URType].objects){
			if(typeof(URs[URType].objects[URId].isPerso) == 'undefined')URs[URType].objects[URId].isPerso = false;
		}
	}
}
else{
	UR2T.debug_level = 3;
	UR2T.UR_Selected = false;
	UR2T.oldVer = '';
	UR2T.userSign = '';
	UR2T.scriptVer = GM_info.script.version;
	UR2T.GUI = {'defaultLeft': 350, 'defaultTop': null, 'left': 350, 'top': null};
	UR2T.answers = {};
	UR2T.answers.UR = {};
	//	Outils
	UR2T.answers.UR['outils'] = {'name': 'Outils', 'objects': {}};
	UR2T.answers.UR['outils'].objects[0] = {'question': 'Effacer la zone de texte', 'answer': '', 'isPerso': false};
	UR2T.answers.UR['outils'].objects[1] = {'question': 'Insérer ma signature', 'answer': 'UR2T_insertSign', 'isPerso': false};
	UR2T.answers.UR['outils'].objects[2] = {'question': 'Éditer les réponses', 'answer': 'UR2T_EditResponses', 'isPerso': false};
	UR2T.answers.UR['outils'].objects[3] = {'question': 'Nouvelle réponse', 'answer': 'UR2T_AddResponses', 'isPerso': false};
	UR2T.answers.UR['outils'].objects[4] = {'question': 'Éditer ma signature', 'answer': 'UR2T_EditSigns', 'isPerso': false};
	UR2T.answers.UR['outils'].objects[5] = {'question': 'Import / export', 'answer': 'UR2T_importExport', 'isPerso': false};
	UR2T.answers.UR['outils'].objects[6] = {'question': 'À propos', 'answer': 'UR2T_apropos', 'isPerso': false};
	//	Divers
	UR2T.answers.UR['divers'] = {'name': 'Divers', 'objects': {}};
	UR2T.answers.UR['divers'].objects[0] = {'question': 'Décrochage GPS (général)', 'answer': 'Bonjour,\nil semble que vous ayez eu un problème de décrochage GPS. Vous pouvez améliorer les performances GPS de votre mobile en vous rendant sur "Paramètres", "Localisation" et en désactivant "Service de localisation" et "Localisation et recherche". Je clôture donc cette demande. Merci pour votre contribution à l\'amélioration de Waze.', 'isPerso': false};
	UR2T.answers.UR['divers'].objects[1] = {'question': 'Mise à jour sur mobile', 'answer': 'Bonjour,\nla carte sur votre mobile ne doit plus être à jour.\nJe vous suggère de forcer la mise à jour sur Waze dans "Paramètres->Avancés->Transferts réseau->Rafraichir la carte de ma zone".\nMerci pour votre contribution à l\'amélioration de Waze.', 'isPerso': false};
	UR2T.answers.UR['divers'].objects[2] = {'question': 'Mise à jour POI', 'answer': 'Bonjour,\nnous vous invitons à mettre à jour votre application Waze en version 3.9.\nEn effet cette version vous permet de signaler un POI, et l\'agrémenter d\'information que vous seul êtes le mieux à même de connaitre.\nCeci enclenchera sa création, et son existence au sein de la carte. D\'avance merci.', 'isPerso': false};
	UR2T.answers.UR['divers'].objects[3] = {'question': 'Relance (aprés 3 ou 4 jours)', 'answer': 'Bonjour,\ntoujours pas d\'informations supplémentaires?\nPour info, après 7 jours sans réponses, les demandes sont considérées comme sans objet et clôturées.\nCordialement.', 'isPerso': false};
	UR2T.answers.UR['divers'].objects[4] = {'question': 'UR Résolu', 'answer': 'Bonjour,\nle problème est corrigé et la modification sera effective sur votre mobile d\'ici quelques jours.\nVous pourrez si nécessaire forcer la mise à jour sur Waze dans "Paramètres->Avancés->Transfert réseau->Rafraichir la carte de ma zone".\nMerci pour votre contribution à l\'amélioration de Waze.', 'special' : 'ur_solved', 'isPerso': false};
	UR2T.answers.UR['divers'].objects[5] = {'question': 'UR sans réponse après une relance', 'answer': 'Bonjour,\nNous n\'avons plus de vos nouvelles pour cette demande de mise à jour depuis plus de 7 jours. Nous considérons donc ce problème comme abandonné.\nCette demande de mise à jour est close, merci d\'en faire une nouvelle si nécessaire.\nA bientôt sur Waze', 'special' : 'ur_unsolved', 'isPerso': false};
	//	Guidage incorrecte
	UR2T.answers.UR[6] = {'name': 'Guidage incorrecte', 'objects': {}};
	UR2T.answers.UR[6].objects[0] = {'question': 'Guidage incorrect', 'answer': 'Vous nous avez fait part d\'un guidage incorrect lors de votre navigation. Pourriez-vous nous décrire les raisons qui vous ont conduit à effectuer ce signalement? Au mieux, un point de départ et une destination afin d\'essayer de reproduire les instructions d\'itinéraire? Merci d\'avance.', 'isPerso': false};
	//	Adresse incorrecte
	UR2T.answers.UR[7] = {'name': 'Adresse incorrecte', 'objects': {}};
	UR2T.answers.UR[7].objects[0] = {'question': 'Adresse incorrecte', 'answer': 'Vous avez signalé une adresse incorrecte. Nous allons analyser si des données doivent être mises à jour. Cependant, à l\'emplacement de votre signalement, merci de nous indiquer quelle devrait être l\'adresse correcte à rectifier ? Dans l\'attente d\'un retour de votre part, merci d\'avance pour votre participation.', 'isPerso': false};
	//	Rond-point manquant
	UR2T.answers.UR[9] = {'name': 'Rond-point manquant', 'objects': {}};
	UR2T.answers.UR[9].objects[0] = {'question': 'Rond-point manquant', 'answer': 'Vous avez signalé un rond-point manquant. Sauriez-vous nous indiquer si son emplacement correspond à la position de votre signalement? De plus, dans l\'idéal, le nombre et le nom des voies impliquées seraient fort appréciables afin que nous puissions créer ce carrefour giratoire au plus près de la réalité. Merci d\'avance pour votre participation.', 'isPerso': false};
	//	General error
	UR2T.answers.UR[10] = {'name': 'Erreur générale', 'objects': {}};
	UR2T.answers.UR[10].objects[0] = {'question': 'Erreur générale: pas systématique', 'answer': 'Bonjour,\nvous avez signalé une "erreur générale" sur votre parcours.\nLa carte ne faisant apparaître aucun problème dans ce secteur, pouvez-vous être plus précis?\nMerci pour votre contribution à l\'amélioration de Waze.', 'isPerso': false};
	UR2T.answers.UR[10].objects[1] = {'question': 'Ponts non affichés sur la carte', 'answer': 'Bonjour,\nen fonction de votre vitesse les éléments inutiles sont automatiquement masqués, donc ceci est une situation normale.\nMerci pour votre contribution à l\'amélioration de Waze.', 'isPerso': false};
	UR2T.answers.UR[10].objects[2] = {'question': 'Trajet inhabituel - carte OK', 'answer': 'Bonjour,\naprès vérification de la carte sur votre trajet, aucune erreur ne peut expliquer l\'itinéraire "inhabituel" proposé.\nNous allons donc clôturer ce post.\nLes explications possibles (suppositions) sont :\n- ralentissement important, travaux, accident;\n- mauvaise saisie de destination sur le mobile;\n- mauvais paramétrage de navigation (autoroute / péage / +rapide / +court);\n- nous vous suggérons également de forcer la mise à jour sur Waze dans "Paramètres" / "Avancés" / "Transfert réseau" puis "Rafraichir la carte de ma zone".\nN\'hésitez pas à signaler toute anomalie / modification / travaux.\nMerci pour votre contribution à l\'amélioration de Waze.', 'isPerso': false};
	UR2T.answers.UR[10].objects[3] = {'question': 'Zone radar non signalée', 'answer': 'Bonjour,\nafin de respecter les nouvelles règlementations en matière de dispositifs "anti-radar", Waze signale désormais la zone de contrôle radar en tant que "zone de contrôle".\nJe clôture donc ce signalement.\nMerci pour votre contribution à l\'amélioration de Waze.', 'isPerso': false};
	//	Turn not allowed
	UR2T.answers.UR[11] = {'name': 'Interdiction de tourner', 'objects': {}};
	UR2T.answers.UR[11].objects[0] = {'question': 'Interdiction / Autorisation de tourner', 'answer': 'Bonjour,\nmerci pour votre signalement.\nPouvez-vous préciser :\n- s\'il s\'agit d\'une interdiction de tourner à établir ou à supprimer sur Waze;\n- quelle est l\'intersection concernée (nom des voies);\n- quel est le sens de l\'interdiction à traiter (exemple : interdit de tourner voie A vers voie B en tournant à gauche).\nMerci pour votre contribution à l\'amélioration de Waze.', 'isPerso': false};
	UR2T.answers.UR[11].objects[1] = {'question': 'Travaux', 'answer': 'Bonjour,\nsi les travaux ne sont pas de nature à interdire complètement la circulation (dans un sens ou dans l\'autre) pour une période donnée, il suffit de les signaler simplement en circulant.\nPar contre, dans le cas contraire, merci de bien vouloir indiquer le tronçon concerné, l\'interdiction exacte (par exemple interdit de rue A vers rue B en tournant à gauche) et si possible la période.\nMerci pour votre contribution à l\'amélioration de Waze.', 'isPerso': false};
	//	Incorrect junction
	UR2T.answers.UR[12] = {'name': 'Jonction incorrecte', 'objects': {}};
	UR2T.answers.UR[12].objects[0] = {'question': 'Jonction Incorrecte', 'answer': 'Bonjour,\nvous avez signalé une jonction incorrecte sur votre parcours, pouvez-vous être plus précis afin que nous puissions traiter ce désagrément. Merci pour votre contribution à l\'amélioration de Waze.', 'isPerso': false};
	//	Missing bridge overpass
	UR2T.answers.UR[13] = {'name': 'Viaduc ou pont manquant', 'objects': {}};
	UR2T.answers.UR[13].objects[0] = {'question': 'Viaduc ou pont manquant', 'answer': 'Bonjour,\nvous signalez "viaduc ou pont manquant".\nPouvez-vous nous donner des précisions concernant votre signalement? (lieu ou autre cause ou erreur).\nVous pouvez également créer une route en temps réel sur votre application Waze en sélectionnant "Signaler / Erreur carte" puis l\'onglet "Créer une route".\nMerci pour votre contribution à l\'amélioration de Waze.', 'isPerso': false};
	//	Wrong driving direction
	UR2T.answers.UR[14] = {'name': 'Mauvais sens de circulation', 'objects': {}};
	UR2T.answers.UR[14].objects[0] = {'question': 'Travaux', 'answer': 'Bonjour,\nsi les travaux ne sont pas de nature à interdire complètement la circulation (dans un sens ou dans l\'autre) pour une période donnée, il suffit de les signaler simplement en circulant.\nPar contre, dans le cas contraire, merci de bien vouloir indiquer le tronçon concerné, l\'interdiction exacte (par exemple interdit de rue A vers rue B en tournant à gauche) et si possible la période.\nMerci pour votre contribution à l\'amélioration de Waze.', 'isPerso': false};
	UR2T.answers.UR[14].objects[1] = {'question': 'Mauvais sens de circulation', 'answer': 'Bonjour,\nsuite à votre signalement, pouvez-vous préciser quel tronçon de voie est à corriger.\nSi vous le pouvez, préciser également le sens de circulation et les limites.\nPar exemple : la voie A est en sens unique nord-sud entre la voie B et la voie C.\nMerci pour votre contribution à l\'amélioration de Waze.'};
	//	Missing exit
	UR2T.answers.UR[15] = {'name': 'Sortie manquante', 'objects': {}};
	UR2T.answers.UR[15].objects[0] = {'question': 'Nom de rue introuvable', 'answer': 'Bonjour,\nmerci pour votre signalement. Toutefois, pouvez-vous me dire où se trouve la rue concernée ?', 'isPerso': false};
	UR2T.answers.UR[15].objects[1] = {'question': 'Sortie manquante', 'answer': 'Bonjour,\nmerci de votre signalement. Vous nous indiquez qu\'une sortie est manquante. Pouvez-vous nous donner son emplacement s\'il vous plaît ? Vous pouvez également créer une route en temps réel sur votre application Waze en sélectionnant "Signaler / Erreur carte" puis l\'onglet "Créer une route".Merci pour votre contribution à l\'amélioration de Waze.', 'isPerso': false};
	//	Missing road
	UR2T.answers.UR[16] = {'name': 'Route manquante', 'objects': {}};
	UR2T.answers.UR[16].objects[0] = {'question': 'Nom de rue introuvable', 'answer': 'Bonjour,\nvous avez signalé un mauvais nom de rue. Notre base de données n’étant pas suffisamment à jour pour traiter cet incident, pourriez-vous nous communiquer le nom correct afin que nous puissions la mettre à jour?\nMerci pour votre contribution à l\'amélioration de Waze."', 'isPerso': false};
	UR2T.answers.UR[16].objects[1] = {'question': 'Route manquante', 'answer': 'Bonjour,\nmerci de votre signalement.\nVous nous indiquez qu\'une route est manquante. Pouvez-vous nous donner son nom et son emplacement s\'il vous plaît?\n(Par exemple entre la rue A et la rue B.)\nVous pouvez également créer une route en temps réel sur votre application Waze en sélectionnant "Signaler / Erreur carte" puis l\'onglet "Créer une route".\nMerci pour votre contribution à l\'amélioration de Waze.', 'isPerso': false};
	UR2T.answers.UR[16].objects[2] = {'question': 'Route manquante mais présente.', 'answer': 'Bonjour,\nvous nous signalez une route manquante sur la carte Waze. Or la route désignée à l\'emplacement est pourtant présente sur la carte.\nJe vous suggère de forcer la mise à jour sur Waze dans "Paramètres->Avancés->Transfert réseau" puis "Rafraichir la carte de ma zone".\nMerci pour votre contribution à l\'amélioration de Waze.', 'isPerso': false};
	//	POI Manquant
	UR2T.answers.UR[18] = {'name': 'POI manquant', 'objects': {}};
	UR2T.answers.UR[18].objects[0] = {'question': 'POI manquant', 'answer': 'Nous vous invitons à mettre à jour votre application Waze en version 3.9. En effet cette version vous permet de signaler un POI, et l\'agrémenter d\'informations que vous seul êtes le mieux à même de connaître. Ceci enclenchera sa création, et son existence au sein de la carte dès la validation par nos équipes. Merci d\'avance pour votre participation.', 'isPerso': false};
}
UR2T.oldVer = GM_info.script.version;
//	Mise à jour du LS
UpdateLS();

/**********************************************/
/***	bootstrap, will call UR2T_init()	***/
/**********************************************/
function UR2T_bootstrap(){
	UR2T_addLog(1, 'info', 'bootstrap starts');
	if (typeof(unsafeWindow) === "undefined"){
		unsafeWindow = ( function () {
			var dummyElem = document.createElement('p');
			dummyElem.setAttribute('onclick', 'return window;');
			return dummyElem.onclick();
		}) ();
	}
	/* begin running the code! */
	setTimeout(UR2T_init, 1000);
}

/* helper functions */
function UpdateLS(){
	localStorage.UR2T = JSON.stringify(UR2T);
}

function getId(node){
	if(node != '')return document.getElementById(node);
	return false;
}

function DOMDataFilter(obj){
	return JSON.parse(JSON.stringify(obj));
}

function getSelectedValue(node){
	var t = getId(node);
	return t.options[t.selectedIndex].value;
}

function getSelectedText(node){
	var t = getId(node);
	return t.options[t.selectedIndex].text;
}

function UR2T_addLog(UR2T_Level, UR2T_type, UR2T_text){
	if(UR2T_Level <= UR2T.debug_level){
		var HLaL_text = 'WME_UR2T_' + GM_info.script.version + ' : ' + UR2T_text;
		switch(UR2T_type){
			case 'info':
				console.info(HLaL_text);
				break;
			case 'error':
				console.error(HLaL_text);
				break;
			default:
				console.log(HLaL_text);
				break;
		}
		if(typeof(arguments[3]) !== 'undefined'){
			// console.debug(HLaL_text);
			console.debug(arguments[3]);
		}
	}
}

function UR2T_init(){
	// Waze object needed
	//		New WME compatibility
	if(typeof(unsafeWindow.require) === "undefined"){
		UCME_addLog('require NOK');
		window.setTimeout(UCME_init, 500);
		return;
	}
	require = unsafeWindow.require;
	//	Waze
	if(typeof(unsafeWindow.Waze) == 'undefined'){
		UR2T_addLog(1, 'error', 'unsafeWindow.Waze NOK', unsafeWindow.Waze);
		window.setTimeout(UR2T_init, 500);
		return;
	}
	UR2T_Waze = unsafeWindow.Waze;
	//	Waze.map
	if(typeof(UR2T_Waze.map) == 'undefined'){
		UR2T_addLog(1, 'error', 'UR2T_Waze.map NOK', UR2T_Waze.map);
		window.setTimeout(UR2T_init, 500);
		return;
	}
	UR2T_Waze_map = UR2T_Waze.map;
	//	Waze.map.updateRequestLayer
	if(typeof(UR2T_Waze_map.updateRequestLayer) == 'undefined'){
		UR2T_addLog(1, 'error', 'UR2T_Waze_map.updateRequestLayer NOK', UR2T_Waze_map.updateRequestLayer);
		window.setTimeout(UR2T_init, 500);
		return;
	}
	UR2T_updateRequestLayer = UR2T_Waze_map.updateRequestLayer;
	//	Waze.model
	if(typeof(UR2T_Waze.model) == 'undefined'){
		UR2T_addLog(1, 'error', 'UR2T_Waze.model NOK', UR2T_Waze.model);
		window.setTimeout(UR2T_init, 500);
		return;
	}
	UR2T_Waze_model = UR2T_Waze.model;
	//	Waze.model.updateRequestSessions
	if(typeof(UR2T_Waze_model.updateRequestSessions) == 'undefined'){
		UR2T_addLog(1, 'error', 'UR2T_Waze_model.mapUpdateRequests NOK', UR2T_Waze_model.updateRequestSessions);
		window.setTimeout(UR2T_init, 500);
		return;
	}
	UR2T_model_updateRequestSessions = UR2T_Waze_model.updateRequestSessions;
	//	Waze.model.mapUpdateRequests
	if(typeof(UR2T_Waze_model.mapUpdateRequests) == 'undefined'){
		UR2T_addLog(1, 'error', 'UR2T_Waze_model.mapUpdateRequests NOK', UR2T_Waze_model.mapUpdateRequests);
		window.setTimeout(UR2T_init, 500);
		return;
	}
	UR2T_model_mapUpdateRequests = UR2T_Waze_model.mapUpdateRequests;
	//	Waze.loginManager
	if(typeof(UR2T_Waze.loginManager) == 'undefined'){
		UR2T_addLog(1, 'error', 'UR2T_Waze.loginManager NOK', UR2T_Waze.loginManager);
		window.setTimeout(UR2T_init, 500);
		return;
	}
	UR2T_Waze_loginManager = UR2T_Waze.loginManager;
	//	Waze.loginManager.user
	if(typeof(UR2T_Waze_loginManager.user) == 'undefined'){
		UR2T_addLog(1, 'error', 'UR2T_Waze_loginManager.user NOK', UR2T_Waze_loginManager.user);
		window.setTimeout(UR2T_init, 500);
		return;
	}
	UR2T_Waze_user = UR2T_Waze_loginManager.user;
	UR2T_addLog(1, 'info', 'GVars done');
	lastURfid = null;
	UR2T.UR_Selected = null;
	//	Test
	// var test = UR2T_Waze_loginManager.getLoggedInUser();
	// console.dir(test);
	//	HTML
	_UR2T_Html = new UR2T_Html();
	_UR2T_Html.UR2T_Html();
	UR2T_addLog(1, 'info', 'Html renderer done');
	//	UR parser
	_UR2T_URparser = new UR2T_URparser();
	_UR2T_URparser.init();
	UR2T_addLog(1, 'info', 'UR parser in progress');
	//	Bibliothèque d'images
	_imgs = new UR2T_imgs();
	//	Periodic updates
	window.setInterval(_UR2T_Html.checkVisibility, 250);	//	pas d'event de sélection sur les UR :/
	UR2T_addLog(1, 'info', 'Periodic uptdates done');
	//	Events
	UR2T_addLog(1, 'info', 'Events done');
	// UR2T_RR_HTML();
	//	Données externes
	UR2T_GetUserResponses();
	//	Init finished
	UR2T_addLog(1, 'info', 'Init done');
}

function UR2T_imgs(){
	this.arrowShowWhite = '<svg height="10" width="20" style="stroke:white;stroke-width:2"><line x1="1" y1="3" x2="9" y2="3"/><line x1="1" y1="3" x2="5" y2="10"/><line x1="9" y1="3" x2="5" y2="10"/>Sorry, your browser does not support inline SVG.</svg>';
	this.arrowHideWhite = '<svg height="10" width="20" style="stroke:white;stroke-width:2"><line x1="1" y1="10" x2="9" y2="10"/><line x1="1" y1="10" x2="5" y2="3"/><line x1="9" y1="10" x2="5" y2="3"/>Sorry, your browser does not support inline SVG.</svg>';
}

function UR2T_URparser(){
	var _htmlURs = null;

	this.init = function(){
		var layerActive = UR2T_updateRequestLayer.getVisibility();
		if(!layerActive)UR2T_updateRequestLayer.setVisibility(true);
		_htmlURs = getId(UR2T_updateRequestLayer.id);
	}

	this.getSelURId = function(){
		var _htmlURList = _htmlURs.getElementsByTagName('div');
		for(var htmlURId in _htmlURList){
			var theEl = _htmlURList[htmlURId];
			if(typeof(theEl) != 'object')continue;
			var patt = new RegExp(/selected/);
			if(patt.test(theEl.className))return theEl.getAttribute('data-id');
		}
		return false;
	}
}

function UR2T_Html(){
	var _moveEl = false;
	var _UR2T_overlay = null;
	var _URId = null;
	var _URType = null;
	var _lastURId = null;
	var _panelsExpanded = false;
	var WME_map = getId('map');
	var WME_panel_container = getId('panel-container');
	var _lastURId = '';
	var _UR2T_editor = new UR2T_editor();
	var _showHidePanel = new showHidePanel();
	var _UR2T_editorId = null;

	this.UR2T_Html = function(){
		// UR2T_addLog(1, 'info', 'UR2T_Html called');
		//	create the ur2t overlay
		// var baseHtml = getId('map');
		var UR2T_overlay = document.createElement('div');
		UR2T_overlay.id = 'UR2T-overlay';
		UR2T_overlay.style.borderRadius = '5px';
		UR2T_overlay.style.zIndex = 998;
		UR2T_overlay.style.backgroundColor = 'white';
		UR2T_overlay.style.textAlign = 'center';
		UR2T_overlay.style.border = 'solid 1px';
		UR2T_overlay.style.padding = '10px';
		UR2T_overlay.style.display = 'none';
		UR2T_overlay.style.position = 'absolute';
		UR2T_overlay.style.height = '90px';
		UR2T_overlay.style.minWidth = '270px';
		UR2T_overlay.style.maxWidth = '400px';
		var defaultTop = parseInt(getId('toolbar').clientHeight + 10);
		UR2T.GUI.defaultTop = defaultTop;
		UpdateLS();
		if(UR2T.GUI.top != null)defaultTop = UR2T.GUI.top;
		else UR2T.GUI.top = defaultTop;
		UR2T_overlay.style.top = defaultTop + 'px';
		var defaultLeft = UR2T.GUI.defaultLeft;
		if(UR2T.GUI.left != null)defaultLeft = UR2T.GUI.left;
		UR2T_overlay.style.left = defaultLeft + 'px';
		/***	le titre du plugins		***/
		UR2T_container = document.createElement('div');
		UR2T_content = document.createElement('h3');
		UR2T_content.id = 'UR2T-overlay-titre';
		UR2T_content.innerHTML = GM_info.script.name;
		UR2T_container.appendChild(UR2T_content);
		//	le contenue des réponses
		UR2T_container2 = document.createElement('div');
		UR2T_container2.id = "UR2T-overlay-responses";
		UR2T_container2.style.marginTop = '10px';
		UR2T_container.appendChild(UR2T_container2);
		//	on insère la zone de réponse
		UR2T_overlay.appendChild(UR2T_container);
		//	On insère le tout
		WME_map.appendChild(UR2T_overlay);
		_UR2T_overlay = getId('UR2T-overlay');
		// UR2T_addLog(1, 'info', 'UR2T_Html init finished', _UR2T_overlay);
		//	events
		var _moveDiv = new moveDiv();
		getId('UR2T-overlay-titre').onmousedown = _moveDiv.set;
		getId('UR2T-overlay-titre').onmouseup = _moveDiv.reset;
		getId('UR2T-overlay-titre').ondblclick = _moveDiv.resetPos;
		WME_map.onmousemove = _moveDiv.moveEl;
	};

	this.checkVisibility = function(){
		if(WME_panel_container.innerHTML == ''){
			getId('UR2T-overlay-responses').innerHTML = '';
			_lastURId = '';
			resetPlug('none');
			_panelsExpanded = false;
			return;
		}
		_URId = _UR2T_URparser.getSelURId();
		// console.info(_URId);
		if(_URId === false)return;
		_URType = UR2T_model_mapUpdateRequests.get(_URId).attributes.type;
		//	Fast UR change
		if(_URId != _lastURId){
			// console.info('IS fast UR change : ' + _URId + ' ' + _lastURId);
			_lastURId = _URId;
			getId('UR2T-overlay-responses').innerHTML = '';
			_panelsExpanded = false;
		}
		else{
			if(getId('UR2T-showHidePanels') != null)return;
			_panelsExpanded = false;
		}
		//	Update _lastURId
		_lastURId = _URId;
		//	post traitements
		expandPanels();
		fixTextArea();
		_showHidePanel.init();
		populateURResponses();
		resetPlug('block');
	};

	function moveDiv(){
		var _mapBox, _ur2tBox;
		var _offsets = {};
		var _moveEl = false;
		var _top, _left;

		this.init = function(){
		}

		this.set = function(e1){
			getId('UR2T-overlay-titre').style.cursor = 'move';
			_mapBox = WME_map.getBoundingClientRect();
			_ur2tBox = _UR2T_overlay.getBoundingClientRect();
			//Memorisation des offsets curseur / _UR2T_overlay
			_offsets.X = e1.clientX - _ur2tBox.left;
			_offsets.Y = e1.clientY - _ur2tBox.top;
			_offsets.nX = _ur2tBox.right - e1.clientX;
			_offsets.nY = _ur2tBox.bottom - e1.clientY;
			_moveEl = true;
		}

		this.reset = function(){
			getId('UR2T-overlay-titre').style.cursor = 'default';
			_offsets.X = null;
			_offsets.nX = null;
			_offsets.Y = null;
			_offsets.nY = null;
			UR2T.GUI.left = _left;
			UR2T.GUI.top = _top;
			UpdateLS();
			_moveEl = false;
		}
		
		this.resetPos = function(){
			UR2T.GUI.left = UR2T.GUI.defaultLeft;
			UR2T.GUI.top = UR2T.GUI.defaultTop;
			UpdateLS();
			_UR2T_overlay.style.left = UR2T.GUI.left + 'px';
			_UR2T_overlay.style.top = UR2T.GUI.top + 'px';
		}

		this.moveEl = function(e2){
			if(_moveEl){
				_left = e2.clientX - _offsets.X - _mapBox.left;
				_top = e2.clientY - _offsets.Y - _mapBox.top;
				if(_left <= 0)_left = 0;
				else if((e2.clientX + _offsets.nX) >= _mapBox.right)_left = _mapBox.width - _ur2tBox.width;
				if(_top <= 0)_top = 0;
				else if((e2.clientY + _offsets.nY) >= _mapBox.bottom)_top = _mapBox.height - _ur2tBox.height;
				// console.info(_left + ' ' + _top);
				_UR2T_overlay.style.left = parseInt(_left) + 'px';
				_UR2T_overlay.style.top = parseInt(_top) + 'px';
			}
		}
	}

	function resetPlug(displayType){
		_UR2T_overlay.style.display = displayType;
		if(_UR2T_editorId != null)_UR2T_editor.hide();
	}

	function expandPanels(){
		if(_panelsExpanded)return;
		var bodyDivs = WME_panel_container.getElementsByClassName('body')[0].getElementsByTagName('div');
		for(var el in bodyDivs){
			var theEl = bodyDivs[el];
			if(typeof(theEl.className) != 'string')continue;
			var patt = new RegExp('collapsed');
			if(patt.test(theEl.className))theEl.className = theEl.className.replace(/ ?collapsed ?/, '');
			patt = new RegExp(/actions section/);
			if(patt.test(theEl.className))theEl.className = theEl.className + ' collapsed';
		}
		_panelsExpanded = true;
	}

	function hideUselessSections(){
		var _section = WME_panel_container.getElementsByClassName('body')[0].getElementsByClassName('more-info section')[0];
		var noInfo = _section.getElementsByClassName('not-available')[0];
		if(noInfo.style.display == 'none')return;
		_section.style.display = 'none';
		
	}
	
	function fixTextArea(){
		// console.info('fixTextArea called');
		var _body = WME_panel_container.getElementsByClassName('body')[0];
		var _section = _body.getElementsByClassName('conversation section')[0];
		var _textarea = _section.getElementsByClassName('form-control new-comment-text')[0];
		if(typeof(_textarea) == 'undefined'){
			window.setTimeout(fixTextArea, 250);
			return;
		}
		_textarea.style.height = '110px';
		hideUselessSections();
	}

	function showHidePanel(){
		var _body = null;
		var _texte = null;
		var _newContainer = null;

		this.init = function(){
			_body = WME_panel_container.getElementsByClassName('body')[0];
			var reported = WME_panel_container.getElementsByClassName('reported')[0];
			_texte = reported.innerHTML;
			reported.innerHTML = '';
			var container = document.createElement('span');
			container.id = 'UR2T-showHidePanels';
			container.style.cursor = 'pointer';
			container.innerHTML = _imgs.arrowHideWhite + _texte;
			reported.appendChild(container);
			_newContainer = getId('UR2T-showHidePanels');
			_newContainer.onclick = checkState;
		}

		function show(){
			_newContainer.innerHTML = _imgs.arrowHideWhite + _texte;
			_body.style.display = 'block';
			resetPlug('block');
		}

		function hide(){
			if(_UR2T_editorId != null)_UR2T_editor.hide();
			_newContainer.innerHTML = _imgs.arrowShowWhite + _texte;
			_body.style.display = 'none';
			resetPlug('none');
		}

		function checkState(){
			if(_body.style.display == 'block' || _body.style.display == '')hide();
			else show();
		}
	}

	function populateURResponses(){
		var UR2T_overlay_responses = getId('UR2T-overlay-responses');
		if(UR2T_overlay_responses.innerHTML != "")return;
		var UR2T_content = document.createElement('select');
		UR2T_content.id = 'UR2T_msgs';
		UR2T_overlay_responses.appendChild(UR2T_content);
		//	Populate the select
		var dummy = document.createElement('option');
		dummy.text = 'Choisissez une réponse type';
		UR2T_content.add(dummy);
		//	events
		getId('UR2T_msgs').onchange = AutoComment;
		//	Populate the select
		// console.info(_URType);
		if(_URType != -1){
			if(_URType > 5 && _URType < 8 || _URType > 8 && _URType < 17 || _URType == 18){
				var cat_name = UR2T.answers.UR[_URType].name;
				var dummygroup = document.createElement('optgroup');
				dummygroup.label = UR2T.answers.UR[_URType].name;
				dummygroup.style.backgroundColor = '#FFCC00';
				UR2T_content.add(dummygroup);
				var answers = UR2T.answers.UR[_URType].objects;
				for(var answer in answers){
					if(isNaN(answer))continue;
					var dummy = document.createElement('option');
					dummy.value = _URType + '-' + answer;
					dummy.text = '- ' + UR2T.answers.UR[_URType].objects[answer].question.slice(0, 45);
					UR2T_content.add(dummy);
				}
			}
			else{	//	author alert
				dummygroup = document.createElement('optgroup');
				dummygroup.label = 'Please alert author: Myriades';
				dummygroup.style.backgroundColor = 'red';
				UR2T_content.add(dummygroup);
				dummygroup = document.createElement('optgroup');
				dummygroup.label = 'Unknow request type : ' + _URType;
				dummygroup.style.backgroundColor = 'red';
				UR2T_content.add(dummygroup);
			}
		}
		//	Divers
		dummygroup = document.createElement('optgroup');
		dummygroup.label = UR2T.answers.UR['divers'].name;
		dummygroup.style.backgroundColor = '#44B9EC';
		UR2T_content.add(dummygroup);
		var answers = UR2T.answers.UR['divers'].objects;
		for(var answer in answers){
			if(isNaN(answer))continue;
			dummy = document.createElement('option');
			dummy.value = 'divers-' + answer;
			dummy.text = '- ' + UR2T.answers.UR['divers'].objects[answer].question;
			UR2T_content.add(dummy);
		}
		//	Outils
		dummygroup = document.createElement('optgroup');
		dummygroup.label = UR2T.answers.UR['outils'].name;
		dummygroup.style.backgroundColor = '#33CC33';
		UR2T_content.add(dummygroup);
		var answers = UR2T.answers.UR['outils'].objects;
		for(var answer in answers){
			if(isNaN(answer))continue;
			dummy = document.createElement('option');
			dummy.value = 'outils-' + answer;
			dummy.text = '- ' + UR2T.answers.UR['outils'].objects[answer].question;
			UR2T_content.add(dummy);
		}
	}

	function AutoComment(){
		var myTextArea = document.getElementsByClassName('form-control new-comment-text')[0];
		var UR2T_msgs = getId('UR2T_msgs');
		if(UR2T_msgs.selectedIndex > 0){
			_UR2T_editor.init();
			_UR2T_editor.hide();
			var indexes = getSelectedValue('UR2T_msgs').split('-');
			var le_texte = UR2T.answers.UR[indexes[0]].objects[indexes[1]].answer;
			if(le_texte.indexOf('UR2T_') == 0){
				switch(le_texte){
					case'UR2T_EditResponses':
						_UR2T_editor.editResponses();
						_UR2T_editor.show();
						break;
					case'UR2T_apropos':
						_UR2T_editor.apropos();
						_UR2T_editor.show();
						break;
					case'UR2T_EditSigns':
						_UR2T_editor.editSigns();
						_UR2T_editor.show();
						break;
					case'UR2T_insertSign':
						myTextArea.value = myTextArea.value + '\n\n' + UR2T.userSign;
						break;
					case'UR2T_AddResponses':
						_UR2T_editor.addResponse();
						_UR2T_editor.show();
						break;
					case'UR2T_importExport':
						// importExport = new UR2T_importExport;
						// importExport.IE_init();
						break;
				}
			}
			else{
				if(le_texte.length > 0){
					var le_texte = bonJourSoir(le_texte);
					if(UR2T.userSign.length > 0)le_texte = le_texte + '\n\n' + UR2T.userSign;
				}
				myTextArea.value = le_texte;
			}
			UR2T_msgs.selectedIndex = 0;
			// if(typeof(UR2T.answers.UR[indexes[0]].objects[indexes[1]].special) !== 'undefined'){
				// getId('state--1').checked = false;
				// getId('state-0').checked = true;
			// }
		}

		function bonJourSoir(leTexte){
			var recherche = new RegExp('^(bon(jou|soi)r)', 'i');
			if(leTexte.match(recherche) === null){
				return leTexte;
			}
			//	Vérification de l'heure du jour
			var UR2T_date = new Date();
			var heure = UR2T_date.getHours();
			var UR2T_replace = 'Bonjour';
			if(heure > 17 || heure < 4)UR2T_replace = 'Bonsoir';
			return leTexte.replace(recherche, UR2T_replace);
		}
	}

	function UR2T_editor(){
		var _UR2T_container = null;

		this.init = function(){
			// UR2T_addLog(1, 'info', 'UR2T_editor called');
			if(_UR2T_editorId != null)return;
			/***	le conteneur	***/
			var UR2T_editor = document.createElement('div');
			UR2T_editor.id = 'UR2T-editor';
			UR2T_editor.style.borderRadius = '5px';
			UR2T_editor.style.zIndex = 999;
			UR2T_editor.style.backgroundColor = 'white';
			UR2T_editor.style.textAlign = 'center';
			UR2T_editor.style.padding = '10px';
			UR2T_editor.style.display = 'none';
			UR2T_editor.style.position = 'absolute';
			UR2T_editor.style.height = '350px';
			UR2T_editor.style.width = '500px';
			UR2T_editor.style.top = Number(getId('UR2T-overlay').clientHeight + getId('toolbar').clientHeight + 20) + 'px';
			UR2T_editor.style.left = '350px';
			/***	Les boutons		***/
			var UR2T_container = document.createElement('div');
			UR2T_container.id = 'UR2T-editor-btn';
			UR2T_container.style.position = 'absolute';
			UR2T_container.style.bottom = '10px';
			UR2T_container.style.right = '10px';
			UR2T_editor.appendChild(UR2T_container);
			// Le bouton 1
			var UR2T_btn_1 = document.createElement('button');
			UR2T_btn_1.id = 'UR2T-editor-btn-1';
			UR2T_btn_1.style.visibility = 'hidden';
			UR2T_btn_1.innerHTML = 'Enregistrer';
			UR2T_container.appendChild(UR2T_btn_1);
			// Le bouton 0
			var UR2T_btn_0 = document.createElement('button');
			UR2T_btn_0.id = 'UR2T-editor-btn-0';
			UR2T_btn_0.style.marginLeft = '10px';
			UR2T_btn_0.style.visibility = 'hidden';
			UR2T_btn_0.innerHTML = 'Fermer';
			UR2T_container.appendChild(UR2T_btn_0);
			/***	La zone de log	***/
			UR2T_container = document.createElement('div');
			UR2T_container.id = 'UR2T-editor-log';
			UR2T_container.style.position = 'absolute';
			UR2T_container.style.bottom = '10px';
			UR2T_container.style.left = '10px';
			UR2T_container.style.fontWeight = 'bold';
			UR2T_editor.appendChild(UR2T_container);
			/***	la zone de contenu	***/
			UR2T_container = document.createElement('div');
			UR2T_container.id = 'UR2T-editor-content';
			UR2T_editor.appendChild(UR2T_container);
			/***	On insère le tout	***/
			WME_map.appendChild(UR2T_editor);
			_UR2T_editorId = getId('UR2T-editor');
			_UR2T_container = getId('UR2T-editor-content');
		}

		this.show = function(){
			_UR2T_editorId.style.display = 'block';
		}

		this.hide = function(){
			if(getId('UR2T_titre') != null)getId('UR2T_titre').innerHTML = '';
			_UR2T_editorId.style.display = 'none';
		}

		this.apropos = function(){
			fixBox('210');
			//	Les boutons
			showBtns('Fermer');
			//	le contenant
			_UR2T_container.innerHTML = '';
			/***	Le contenu	***/
			var UR2T_content = document.createElement('h2');
			UR2T_content.id = "UR2T_titre";
			UR2T_content.innerHTML = 'À propos';
			_UR2T_container.appendChild(UR2T_content);
			//	script name
			UR2T_content = document.createElement('h3');
			UR2T_content.style.marginTop = '10px';
			UR2T_content.innerHTML = GM_info.script.name;
			_UR2T_container.appendChild(UR2T_content);
			//	script version
			UR2T_content = document.createElement('div');
			UR2T_content.style.marginTop = '10px';
			UR2T_content.innerHTML = 'Script version : ' + GM_info.script.version;
			_UR2T_container.appendChild(UR2T_content);
			//	Forum
			UR2T_content = document.createElement('div');
			UR2T_content.style.marginTop = '10px';
			UR2T_content.innerHTML = 'Related forum : <a href="https://www.waze.com/forum/viewtopic.php?f=1316&t=110502" target="_blank">français</a>';
			_UR2T_container.appendChild(UR2T_content);

			//	Contact author
			UR2T_content = document.createElement('div');
			UR2T_content.style.marginTop = '10px';
			UR2T_content.innerHTML = 'Contact author : <a href="https://www.waze.com/forum/ucp.php?i=pm&mode=compose&username_list=myriades&subject=' + GM_info.script.name + ' ' + GM_info.script.version + '" target="_blank">Myriades</a>';
			_UR2T_container.appendChild(UR2T_content);
			/***	events	***/
			getId('UR2T-editor-btn-0').onclick = this.hide;
		}

		this.editSigns = function(){
			var _oldSign = UR2T.userSign;
			fixBox('155');
			//	Les boutons
			showBtns('Fermer');
			//	le contenant
			_UR2T_container.innerHTML = '';
			/***	Le contenu	***/
			var UR2T_content = document.createElement('h2');
			UR2T_content.id = "UR2T_titre";
			UR2T_content.innerHTML = 'Éditeur de signature';
			_UR2T_container.appendChild(UR2T_content);
			//	La zone de texte
			UR2T_content = document.createElement('textarea');
			UR2T_content.id = 'UR2T-editor-userSign';
			UR2T_content.setAttribute('placeholder', 'Inscrivez votre signature ici.');
			UR2T_content.style.width = '100%';
			UR2T_content.style.height = '55px';
			UR2T_content.style.marginTop = '10px';
			UR2T_content.value = _oldSign;
			_UR2T_container.appendChild(UR2T_content);
			/***	Events	***/
			getId('UR2T-editor-userSign').oninput = function(){showBtns('Annuler|Enregistrer')};
			getId('UR2T-editor-btn-1').onclick = saveDatas;
			getId('UR2T-editor-btn-0').onclick = this.hide;

		}

		this.addResponse = function(){
			var _ErrMsg = '';
			fixBox('360');
			//	Les boutons
			showBtns('Fermer');
			//	le contenant
			_UR2T_container.innerHTML = '';
			/***	Le titre	***/
			UR2T_container2 = document.createElement('div');
			_UR2T_container.appendChild(UR2T_container2);
			UR2T_content = document.createElement('h2');
			UR2T_content.id = "UR2T_titre";
			UR2T_content.innerHTML = 'Ajouter une réponse automatique';
			UR2T_container2.appendChild(UR2T_content);
			/***	Le dropdown de catégorie	***/
			UR2T_container2 = document.createElement('div');
			UR2T_container2.style.marginTop = '10px';
			_UR2T_container.appendChild(UR2T_container2);
			UR2T_content = document.createElement('label');
			UR2T_content.setAttribute('for', 'UR2T-editor-cat');
			UR2T_content.style.marginRight = '10px';
			UR2T_content.innerHTML = 'Section';
			UR2T_container2.appendChild(UR2T_content);
			var UR2T_select = document.createElement('select');
			UR2T_select.id = 'UR2T-editor-cat';
			UR2T_select.innerHTML = '<option value="">Choisissez une section</option>';
			UR2T_container2.appendChild(UR2T_select);
			//	Populate the dropdown
			var UR2T_options = [];
			for(var URIndex in UR2T.answers.UR){
				UR2T_options.push(UR2T.answers.UR[URIndex].name);
			}
			UR2T_options.sort();
			//	Get the indexes
			var UR2T_options_index = [];
			for(var URDesc in UR2T_options){
				for(var URIndex in UR2T.answers.UR){
					if(UR2T_options[URDesc] == UR2T.answers.UR[URIndex].name){
						UR2T_options_index.push(URIndex);
						break;
					}
				}
			}
			for(var i=0; i<UR2T_options.length; i++){
				if(UR2T_options[i] == 'Outils')continue;
				var UR2T_option = document.createElement('option');
				UR2T_option.value = UR2T_options_index[i];
				UR2T_option.innerHTML = UR2T_options[i];
				UR2T_select.appendChild(UR2T_option);
			}
			/***	L'intitulé	***/
			UR2T_container2 = document.createElement('div');
			UR2T_container2.style.marginTop = '10px';
			_UR2T_container.appendChild(UR2T_container2);
			UR2T_content = document.createElement('label');
			UR2T_content.setAttribute('for', 'UR2T-editor-question');
			UR2T_content.style.marginRight = '10px';
			UR2T_content.innerHTML = 'Intitulé';
			UR2T_container2.appendChild(UR2T_content);
			//	la zone de texte
			var UR2T_input = document.createElement('input');
			UR2T_input.setAttribute('placeholder', '40 caractères maximum...');
			UR2T_input.setAttribute('maxlength', '40');
			UR2T_input.id = 'UR2T-editor-question';
			UR2T_container2.appendChild(UR2T_input);
			//	L'id invisible
			UR2T_input = document.createElement('input');
			UR2T_input.id = 'UR2T-editor-question-id';
			UR2T_input.value = '';
			UR2T_input.style.display = 'none';
			UR2T_container2.appendChild(UR2T_input);
			/***	La zone de réponse	***/
			UR2T_container2 = document.createElement('div');
			UR2T_container2.style.marginTop = '10px';
			_UR2T_container.appendChild(UR2T_container2);
			UR2T_content = document.createElement('label');
			// UR2T_content.setAttribute('for', 'UR2T-editor-response');
			UR2T_content.style.marginRight = '10px';
			UR2T_content.innerHTML = 'Le texte de réponse automatique';
			UR2T_container2.appendChild(UR2T_content);
			/***	Le contenu 4	***/
			UR2T_container2 = document.createElement('div');
			// UR2T_container2.style.marginTop = '10px';
			_UR2T_container.appendChild(UR2T_container2);
			var UR2T_textarea = document.createElement('textarea');
			UR2T_textarea.id = 'UR2T-editor-response';
			UR2T_textarea.setAttribute('placeholder', 'Inscrivez votre réponse ici.');
			UR2T_textarea.style.width = '100%';
			UR2T_textarea.style.height = '150px';
			UR2T_container2.appendChild(UR2T_textarea);
			/***	events	***/
			getId('UR2T-editor-cat').onchange = getURId;
			getId('UR2T-editor-question').oninput = function(){showBtns('Annuler|Enregistrer');};
			getId('UR2T-editor-response').oninput = function(){showBtns('Annuler|Enregistrer');};
			getId('UR2T-editor-btn-1').onclick = saveDatas;
			getId('UR2T-editor-btn-0').onclick = this.hide;

			function getURId(){
				// console.info('UR2T_getURId called');
				var arrLength = 0;
				if(getId('UR2T-editor-cat').selectedIndex == 0){
					arrLength = '';
					showBtns('Fermer');
				}
				else{
					var t = UR2T.answers.UR[getSelectedValue('UR2T-editor-cat')].objects;
					while(t[arrLength] !== undefined){
						arrLength++;
					}
					// console.info(arrLength);
					getId('UR2T-editor-question-id').value = arrLength;
					showBtns('Annuler|Enregistrer');
				}
			}
		}
		
		this.editResponses = function(){
			fixBox('360');
			//	Les boutons
			showBtns('Fermer');
			//	le contenant
			_UR2T_container.innerHTML = '';
			/***	Le contenu	***/
			var UR2T_container2 = document.createElement('div');
			var UR2T_content = document.createElement('h2');
			UR2T_content.id = "UR2T_titre";
			UR2T_content.innerHTML = 'Éditeur de réponses automatiques';
			UR2T_container2.appendChild(UR2T_content);
			_UR2T_container.appendChild(UR2T_container2);
			/***	Le contenu 1	***/
			UR2T_container2 = document.createElement('div');
			UR2T_container2.style.marginTop = '10px';
			_UR2T_container.appendChild(UR2T_container2);
			UR2T_content = document.createElement('label');
			UR2T_content.setAttribute('for', 'UR2T-editor-cat');
			UR2T_content.style.marginRight = '10px';
			UR2T_content.innerHTML = 'Section';
			UR2T_container2.appendChild(UR2T_content);
			var UR2T_select = document.createElement('select');
			UR2T_select.id = 'UR2T-editor-cat';
			UR2T_select.innerHTML = '<option value="">Choisissez une section</option>';
			UR2T_container2.appendChild(UR2T_select);
			//	Populate the dropdown
			var UR2T_options = [];
			for(var URIndex in UR2T.answers.UR){
				UR2T_options.push(UR2T.answers.UR[URIndex].name);
			}
			UR2T_options.sort();
			//	Get the indexes
			var UR2T_options_index = [];
			for(var URDesc in UR2T_options){
				for(var URIndex in UR2T.answers.UR){
					if(UR2T_options[URDesc] == UR2T.answers.UR[URIndex].name){
						UR2T_options_index.push(URIndex);
						break;
					}
				}
			}
			for(var i=0; i<UR2T_options.length; i++){
				if(UR2T_options[i] == 'Outils')continue;
				var UR2T_option = document.createElement('option');
				UR2T_option.value = UR2T_options_index[i];
				UR2T_option.innerHTML = UR2T_options[i];
				UR2T_select.appendChild(UR2T_option);
			}
			/***	Le contenu 2	***/
			UR2T_container2 = document.createElement('div');
			UR2T_container2.style.marginTop = '10px';
			_UR2T_container.appendChild(UR2T_container2);
			UR2T_content = document.createElement('label');
			// UR2T_content.setAttribute('for', 'UR2T-editor-question');
			UR2T_content.style.marginRight = '10px';
			UR2T_content.innerHTML = 'Intitulé';
			UR2T_container2.appendChild(UR2T_content);
			UR2T_select = document.createElement('select');
			UR2T_select.id = 'UR2T-editor-question';
			UR2T_select.innerHTML = '<option>Choisissez une question</option>';
			UR2T_container2.appendChild(UR2T_select);
			/***	Le contenu 3	***/
			UR2T_container2 = document.createElement('div');
			UR2T_container2.style.marginTop = '10px';
			_UR2T_container.appendChild(UR2T_container2);
			UR2T_content = document.createElement('label');
			// UR2T_content.setAttribute('for', 'UR2T-editor-response');
			UR2T_content.style.marginRight = '10px';
			UR2T_content.innerHTML = 'Le texte de réponse automatique';
			UR2T_container2.appendChild(UR2T_content);
			/***	Le contenu 4	***/
			UR2T_container2 = document.createElement('div');
			// UR2T_container2.style.marginTop = '10px';
			_UR2T_container.appendChild(UR2T_container2);
			var UR2T_textarea = document.createElement('textarea');
			UR2T_textarea.id = 'UR2T-editor-response';
			UR2T_textarea.setAttribute('placeholder', 'Inscrivez votre réponse ici.');
			UR2T_textarea.style.width = '100%';
			UR2T_textarea.style.height = '150px';
			UR2T_container2.appendChild(UR2T_textarea);
			/***	On insère le tout	***/
			_UR2T_container.appendChild(UR2T_container2);
			/***	Events	***/
			getId('UR2T-editor-cat').onchange = PopulateQuestions;
			getId('UR2T-editor-question').onchange = PopulateAnswers;
			getId('UR2T-editor-response').oninput = function(){showBtns('Annuler|Enregistrer');};
			getId('UR2T-editor-btn-0').onclick = this.hide;
			getId('UR2T-editor-btn-1').onclick = saveDatas;

			function PopulateAnswers(){
				var theCat = getId('UR2T-editor-cat');
				var theCatValue = theCat.options[theCat.selectedIndex].value;
				if(theCat.selectedIndex > 0){
					var theQuestion = getId('UR2T-editor-question');
					var theQuestionValue = theQuestion.options[theQuestion.selectedIndex].value;
					if(theQuestion.selectedIndex > 0){
						var UR2T_OR = getId('UR2T-editor-response');
						UR2T_OR.value = UR2T.answers.UR[theCatValue].objects[theQuestionValue].answer;
						return;
					}
				}
				getId('UR2T-editor-response').value = "";
			}
		}

		function PopulateQuestions(){
			getId('UR2T-editor-response').value = "";
			var UR2T_cat_dropDown = getId('UR2T-editor-cat');
			var UR2T_question_dropdown = getId('UR2T-editor-question');
			UR2T_question_dropdown.innerHTML = '<option>Choisissez une question</option>';
			if(UR2T_cat_dropDown.selectedIndex > 0){
				var theRef = getSelectedValue('UR2T-editor-cat');
				var URObjects = UR2T.answers.UR[theRef].objects;
				var UR2T_questions = [];
				for(var QId in URObjects){
					UR2T_questions.push(URObjects[QId].question);
				}
				UR2T_questions.sort();
				//	Get the indexes
				var UR2T_questions_index = [];
				for(var URQuestion in UR2T_questions){
					for(var URIndex in URObjects){
						if(UR2T_questions[URQuestion] == URObjects[URIndex].question){
							UR2T_questions_index.push(URIndex);
							break;
						}
					}
				}
				for(var i=0; i<UR2T_questions.length; i++){
					var UR2T_option = document.createElement('option');
					UR2T_option.value = UR2T_questions_index[i];
					UR2T_option.innerHTML = UR2T_questions[i];
					UR2T_question_dropdown.appendChild(UR2T_option);
				}
			}
			else{
				showBtns('Fermer');
				UR2T_question_dropdown.innerHTML = '<option>Choisissez une question</option>';
			}
		}

		function showBtns(btnList){
			var btnsArr = btnList.split('|');
			for(var i=0; i < 2;i++){
				if(i < btnsArr.length){
					getId('UR2T-editor-btn-' + i).style.visibility = 'visible';
					getId('UR2T-editor-btn-' + i).innerHTML = btnsArr[i];
				}
				else
					getId('UR2T-editor-btn-' + i).style.visibility = 'hidden';
			}
		}

		function fixBox(boxHeight){
			updateLogZone('green', '', 0);
			_UR2T_editorId.style.height = boxHeight + 'px';
		}

		function updateLogZone(color, text, timeBefore){
			if(typeof(timeOut) != 'undefined'){
				// console.info(timeOut);
				clearTimeout(timeOut);
			}
			var textZone = getId('UR2T-editor-log');
			if(timeBefore > 0){
				textZone.style.color = color;
				textZone.innerHTML = text;
				timeOut = window.setTimeout(function(){textZone.innerHTML = '';}, timeBefore);
			}
			else textZone.innerHTML = '';
		}

		function saveDatas(){
			switch(getId('UR2T_titre').innerHTML){
				case'Éditeur de signature':
					UR2T.userSign = getId('UR2T-editor-userSign').value;
					break;
				case'Éditeur de réponses automatiques':
					try{
						if(getSelectedValue('UR2T-editor-cat') == 0)throw 'Pas de catégorie sélectionnée';
						if(isNaN(getSelectedValue('UR2T-editor-question')))throw 'Pas de question sélectionnée';
						if(getId('UR2T-editor-response').value == '')throw 'Réponse vide';
					}
					catch(e){
						showBtns('Fermer');
						updateLogZone('red', e, 5000);
						return;
					}
					UR2T.answers.UR[getSelectedValue('UR2T-editor-cat')].objects[getSelectedValue('UR2T-editor-question')].answer = getId('UR2T-editor-response').value;
					break;
				case'Ajouter une réponse automatique':
					try{
						if(getId('UR2T-editor-cat').selectedIndex == 0)throw 'Sélectionnez une section';
						if(getId('UR2T-editor-question').value.length < 4)throw 'Définissez l\'intitulé (4 caractères minimum)';
						if(getId('UR2T-editor-response').value.length < 20)throw 'Remplissez la réponse (20 caractères minimum)';
					}
					catch(e){
						updateLogZone('red', e, 5000);
						return;
					}
					var t = UR2T.answers.UR[getSelectedValue('UR2T-editor-cat')].objects[getId('UR2T-editor-question-id').value] = {};
					t.question = getId('UR2T-editor-question').value;
					t.answer = getId('UR2T-editor-response').value;
					t.isPerso = true;
					// console.dir(UR2T.answers.UR[getSelectedValue('UR2T-editor-cat')].objects);
					break;
/*				case'Import / export':
					if(importExport.imports()){
						UpdateLS();
						UR2T_SaveUserResponses();
					}
					break;*/
			}
			UpdateLS();
			externalSave();

			function externalSave(){
				var UR2T_export = {};
				UR2T_export.script = "UR2T";
				UR2T_export.user = {};
				UR2T_export.user.id = UR2T_Waze_user.id;
				UR2T_export.user.rank = UR2T_Waze_user.rank;
				UR2T_export.user.userName = UR2T_Waze_user.userName;
				UR2T_export.user.userSign = UR2T.userSign;
				UR2T_export.user.scriptVer = UR2T.scriptVer;
				UR2T_export.user.GUI = UR2T.GUI;
				UR2T_export.action = '';
				UR2T_export.datas = {};
				//	Sauvegarde partielle
				switch(getId('UR2T_titre').innerHTML){
					case'Éditeur de signature':
						if(getId('UR2T-editor-userSign').value == "")return;
						UR2T_export.user.userSign = getId('UR2T-editor-userSign').value;
						break;
					case'Éditeur de réponses automatiques':
						UR2T_export.datas[getSelectedValue('UR2T-editor-cat')] = {'name': getSelectedText('UR2T-editor-cat'), 'objects': {}};
						UR2T_export.datas[getSelectedValue('UR2T-editor-cat')].objects[getSelectedValue('UR2T-editor-question')] = {'question': getSelectedText('UR2T-editor-question'), 'answer': getId('UR2T-editor-response').value};
						break;
					case'Ajouter une réponse automatique':
						if(getId('UR2T-editor-cat').selectedIndex == 0)return;
						UR2T_export.datas[getSelectedValue('UR2T-editor-cat')] = {'name': getSelectedText('UR2T-editor-cat'), 'objects': {}};
						UR2T_export.datas[getSelectedValue('UR2T-editor-cat')].objects[getId('UR2T-editor-question-id').value] = {'question': getId('UR2T-editor-question').value, 'answer': getId('UR2T-editor-response').value};
						console.dir(UR2T_export);
						break;
/*					case'Import / export':
						UR2T_export.datas = UR2T.answers.UR;
						break;*/
				}
				transmitDatas();
				
				function transmitDatas(){
					var UR2T_export_JSON = JSON.stringify(UR2T_export);
					var ret = GM_xmlhttpRequest({
						method: "POST",
						// url: "http://wmebookmarks.free.fr/manageDatas.php",
						url: "http://waze.gensig.info/WME/WME%20UR2T/manageDatas.php",
						data: 'JSONdatas=' + UR2T_export_JSON,
						headers: {
										"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
									},
						onload: function(r){showBtns('Fermer');updateLogZone('green', r.responseText, 5000);console.log("WME UR2T: Saving: " + r.responseText);},
						onerror: function(r){console.log("WME UR2T: Error: " + r.responseText);}
					});
				}
			}
		}
	}
}


/*****************************************************/
/***				OLD VER						   ***/
/*****************************************************/

function UR2T_GetUserResponses(){
	var UR2T_import = {};
	UR2T_import.script = "UR2T";
	UR2T_import.user = {};
	UR2T_import.user.id = UR2T_Waze_user.id;
	UR2T_import.user.rank = UR2T_Waze_user.rank;
	UR2T_import.user.userName = UR2T_Waze_user.userName;
	var UR2T_import_JSON = JSON.stringify(UR2T_import);
	var ret = GM_xmlhttpRequest({
		method: "POST",
		// url: "http://wmebookmarks.free.fr/manageDatas.php",
		url: "http://waze.gensig.info/WME/WME%20UR2T/manageDatas.php",
		data: 'JSONdatas=' + UR2T_import_JSON,
		headers: {
						"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
					},
		onload: function(r){UR2T_convertResponses(r.responseText)},
		onerror: function(r){console.log("WME UR2T: Error: " + r.responseText);}
	});
}

function UR2T_convertResponses(jsonText){
	// console.info(jsonText);
	var resultat = JSON.parse(jsonText);
	// console.dir(resultat);
	//	Les UR
	for(var index in resultat.UR){
		var res = resultat.UR[index];
		// console.dir(res);
		UR2T.answers.UR[res[0]].objects[res[1]] = {};
		UR2T.answers.UR[res[0]].objects[res[1]].answer = res[2];
		UR2T.answers.UR[res[0]].objects[res[1]].question = res[3];
	}
	//	La signature
	UR2T.userSign = resultat.userSign[0];
	UpdateLS();
}

function UR2T_importExport(){
	this.IE_init = function(){
						// console.info('IE_init called');
						UR2T_fixBox('360');
						var UR2T_container = getId('UR2T-overlay-content');
						/***	Le titre	***/
						UR2T_container2 = document.createElement('div');
						UR2T_container.appendChild(UR2T_container2);
						UR2T_content = document.createElement('h2');
						UR2T_content.id = "UR2T_titre";
						UR2T_content.innerHTML = 'Import / export';
						UR2T_container2.appendChild(UR2T_content);
						/***	Les cases à cocher et le type	***/
						UR2T_container2 = document.createElement('div');
						UR2T_container2.style.marginTop = '10px';
						UR2T_container.appendChild(UR2T_container2);
						/***	La case à cocher import	et son label	***/
						UR2T_content = document.createElement('input');
						UR2T_content.setAttribute('type', 'radio');
						UR2T_content.setAttribute('name', 'UR2T_IE');
						UR2T_content.setAttribute('checked', '');
						UR2T_content.id = "UR2T_import";
						UR2T_container2.appendChild(UR2T_content);
						UR2T_content = document.createElement('label');
						UR2T_content.setAttribute('for', 'UR2T_import');
						UR2T_content.style.marginLeft = '10px';
						UR2T_content.innerHTML = 'Import';
						UR2T_container2.appendChild(UR2T_content);
						/***	La case à cocher export	et son label	***/
						UR2T_content = document.createElement('input');
						UR2T_content.style.marginLeft = '30px';
						UR2T_content.setAttribute('type', 'radio');
						UR2T_content.setAttribute('name', 'UR2T_IE');
						UR2T_content.id = "UR2T_export";
						UR2T_container2.appendChild(UR2T_content);
						UR2T_content = document.createElement('label');
						UR2T_content.setAttribute('for', 'UR2T_export');
						UR2T_content.style.marginLeft = '10px';
						UR2T_content.innerHTML = 'Export';
						UR2T_container2.appendChild(UR2T_content);
						/***	Le type	***/
						UR2T_content = document.createElement('label');
						UR2T_content.setAttribute('for', 'UR2T_type');
						UR2T_content.style.marginLeft = '50px';
						UR2T_content.innerHTML = 'Format';
						UR2T_container2.appendChild(UR2T_content);
						UR2T_content = document.createElement('select');
						UR2T_content.id = "UR2T_type";
						UR2T_content.style.marginLeft = '10px';
						UR2T_container2.appendChild(UR2T_content);
						/***	Les options		***/
						//	CSV
						UR2T_content2 = document.createElement('option');
						UR2T_content2.value = "CSV";
						UR2T_content2.innerHTML = "CSV";
						UR2T_content.appendChild(UR2T_content2);
						//	JSON
						UR2T_content2 = document.createElement('option');
						UR2T_content2.value = "JSON";
						UR2T_content2.innerHTML = "JSON";
						UR2T_content.appendChild(UR2T_content2);
						//	XML
						UR2T_content2 = document.createElement('option');
						UR2T_content2.value = "XML";
						UR2T_content2.innerHTML = "XML";
						UR2T_content.appendChild(UR2T_content2);
						/***	La zone de texte	***/
						UR2T_container2 = document.createElement('div');
						UR2T_container2.style.marginTop = '10px';
						UR2T_container.appendChild(UR2T_container2);
						UR2T_content = document.createElement('textarea');
						UR2T_content.id = "UR2T_text";
						UR2T_content.style.width = "570px";
						UR2T_content.style.height = "210px";
						UR2T_container2.appendChild(UR2T_content);
						//	Events
						getId('UR2T_import').onclick = imports;
						getId('UR2T_export').onclick = exports;
						getId('UR2T_type').onchange = checkFormat;
						getId('UR2T_text').onfocus = selectAll;
						getId('UR2T_text').onclick = selectAll;
						imports();
						show();
					}

	this.imports = function(){
						var myTextarea = getId('UR2T_text');
						var leTexte = myTextarea.value;
						var myImport = false;
						var identical = false;
						switch(getSelectedValue('UR2T_type')){
							case'JSON':
								updateLogZone('green', '', 0);
								try{
									var UR2T_import = JSON.parse(leTexte);
								}
								catch(e){
									updateLogZone('red', 'Erreur de syntaxe JSON : @char ' + (e.message.match(/column ([0-9]+)/)[1] - 1), 15000);
									return;
								}
								for(var cat in UR2T_import){
									//	Protect object
									if(typeof(UR2T.answers.UR[cat]) == 'undefined')continue;
									//	Update object
									for(var scat in UR2T_import[cat].objects){
										if(typeof(UR2T.answers.UR[cat].objects[scat]) == 'undefined'){
											UR2T.answers.UR[cat].objects[scat] = {};
											UR2T.answers.UR[cat].objects[scat].question = UR2T_import[cat].objects[scat].question;
											UR2T.answers.UR[cat].objects[scat].answer = UR2T_import[cat].objects[scat].answer;
											myImport = true;
										}
										else{
											if(UR2T.answers.UR[cat].objects[scat].question != UR2T_import[cat].objects[scat].question || UR2T.answers.UR[cat].objects[scat].answer != UR2T_import[cat].objects[scat].answer){
												UR2T.answers.UR[cat].objects[scat].question = UR2T_import[cat].objects[scat].question;
												UR2T.answers.UR[cat].objects[scat].answer = UR2T_import[cat].objects[scat].answer;
												myImport = true;
											}
											else identical = true;
										}
									}
								}
								break;
							case'CSV':
								var myCSV = new CSV();
								var CSVarray = leTexte.split('"\n');
								// console.dir(CSVarray);
								/***	Check CSV datas		***/
								if(CSVarray.length < 2){
									updateLogZone('red', 'Erreur de syntaxe CSV : @line 1', 15000);
									return;
								}
								var error = false;
								for(var line in CSVarray){
									var datas = CSVarray[line].split(',');
									if(datas.length != 4){
										error = true;
									}
									if(line == 0 && !error){
										if(myCSV.unescape(datas[0]) != 'URId'){
											error = true;
											if(myCSV.unescape(datas[1]) != 'URSId' && !error){
												error = true;
												if(myCSV.unescape(datas[2]) != 'question' && !error){
													error = true;
													if(myCSV.unescape(datas[3]) != 'réponse' && !error){
														error = true;
													}
												}
											}
										}
									}
									if(error){
										updateLogZone('red', 'Erreur de syntaxe CSV : @line ' + Number(line+1), 15000);
										return;
									}
									console.info(line);
									console.dir(datas);
									var CId = myCSV.unescape(datas[0]);
									//	Protect object
									if(typeof(UR2T.answers.UR[CId]) == 'undefined')continue;
									var sCId = myCSV.unescape(datas[1]);
									var question = myCSV.unescape(datas[2]);
									var answer = myCSV.unescape(datas[3]);
									console.log(CId + ' ' + sCId + '\n' + question + '\n' + answer);
								}
								break;
							case'XML':
								if(window.DOMParser){
									var parser=new DOMParser();
									var xmlDoc=parser.parseFromString(leTexte,"text/xml");
									// console.info(xmlDoc);
									if(typeof(xmlDoc.getElementsByTagName("parsererror")[0]) != 'undefined'){
										var error = xmlDoc.getElementsByTagName("parsererror")[0];
										textError = error.innerHTML;
										// console.info(textError);
										updateLogZone('red', 'Erreur de syntaxe XML : @line ' + textError.match(/ligne ([0-9]+)/)[1], 15000);
										return;
									}
									var base = xmlDoc.getElementsByTagName("UR2T")[0];
									for(var catIndex in base.getElementsByTagName("categorie")){
										var cat = base.getElementsByTagName("categorie")[catIndex];
										if(typeof(cat) != 'object')continue;
										var CId = cat.getElementsByTagName("id")[0].innerHTML;
										// Protect objects
										if(typeof(UR2T.answers.UR[CId]) == 'undefined')continue;
										// console.info('Catégorie : ' + UR2T.answers.UR[CId].name);
										var objects = cat.getElementsByTagName("objects")[0];
										for(var childScat in objects.getElementsByTagName("subCat")){
											var myHtml = new htmlTools();
											var scat = objects.getElementsByTagName("subCat")[childScat];
											if(typeof(scat) != 'object')continue;
											var sCId = scat.getElementsByTagName("id")[0].innerHTML;
											// console.info(CId + " " + sCId);
											var SCQuestion = myHtml.decode(scat.getElementsByTagName("question")[0].innerHTML);
											// console.info(typeof(SCQuestion));
											var SCAnswer = myHtml.decode(scat.getElementsByTagName("answer")[0].innerHTML);
											// console.info(typeof(SCAnswer));
											//	update object
											var UR2T_object = UR2T.answers.UR[CId].objects[sCId];
											// console.dir(UR2T_object);
											if(typeof(UR2T_object) == 'undefined'){
												// console.info('new element');
												UR2T_object = {};
												UR2T_object.question = SCQuestion;
												UR2T_object.answer = SCAnswer;
												// console.dir(UR2T);
												myImport = true;
											}
											else{
												// console.info('updating element');
												if(UR2T_object.question != SCQuestion || UR2T_object.answer != SCAnswer){
													UR2T_object.question = SCQuestion;
													UR2T_object.answer = SCAnswer;
													myImport = true;
													// console.info('elements are different');
												}
												else{
													identical = true;
													// console.info('elements are similar');
												}
											}
										}
									}
								}
								break;
						}
						if(myImport){
							updateLogZone('green', 'Importation réussie', 15000);
							return true;
						}
						else{
							if(identical)updateLogZone('green', 'Données identiques', 15000);
							else updateLogZone('red', 'Données incorrecte', 15000);
							return false;
						}
					}

	function show(){
		getId('UR2T-overlay').style.display = 'block';
	}

	function clearAeraText(){
		updateLogZone('green', '', 0);
		var myTextarea = getId('UR2T_text');
		myTextarea.value = '';
	}

	function selectAll(){
		if(getId('UR2T_export').checked){
			var myTextarea = getId('UR2T_text');
			myTextarea.select();
		}
	}

	function imports(){
		clearAeraText();
		UR2T_showBtn('cancel|import');
	}

	function exports(){
		clearAeraText();
		UR2T_showBtn('cancel');
		checkFormat();
	}

	function checkFormat(){
		if(getId('UR2T_import').checked)return;
		var fill = false;
		switch(getSelectedValue('UR2T_type')){
			case'JSON':
				var UR2T_export = {};
				for(var cat in UR2T.answers.UR){
					if(cat == 'outils')continue;
					UR2T_export[cat] = UR2T.answers.UR[cat];
				}
				UR2T_export = JSON.stringify(UR2T_export);
				fill = true;
				break;
			case'CSV':
				var myCSV = new CSV();
				var UR2T_export = '"URId","URSId","question","réponse"\n';
				for(var cat in UR2T.answers.UR){
					if(cat == 'outils')continue;
					for(var scat in UR2T.answers.UR[cat].objects){
						UR2T_export += cat + ',' + scat + ',"' + myCSV.escape(UR2T.answers.UR[cat].objects[scat].question) + '","' + myCSV.escape(UR2T.answers.UR[cat].objects[scat].answer) + '"\n';
					}
				}
				UR2T_export = UR2T_export.slice(0, UR2T_export.lastIndexOf('\n'));
				fill = true;
				break;
			case'XML':
				var UR2T_export = '<?xml version="1.0" encoding="UTF-8"?>\n<UR2T>\n';
				for(var cat in UR2T.answers.UR){
					if(cat == 'outils')continue;
					UR2T_export += '<categorie>\n<id>' + cat + '</id>\n<name>' + UR2T.answers.UR[cat].name + '</name>\n<objects>\n';
					for(var scat in UR2T.answers.UR[cat].objects){
						UR2T_export += '<subCat>\n';
						UR2T_export += '<id>' + scat + '</id>\n';
						UR2T_export += '<question>' + UR2T.answers.UR[cat].objects[scat].question + '</question>\n';
						UR2T_export += '<answer>' + UR2T.answers.UR[cat].objects[scat].answer + '</answer>\n';
						UR2T_export += '</subCat>\n';
					}
					UR2T_export += '</objects>\n</categorie>\n';
				}
				UR2T_export += '</UR2T>';
				fill = true;
				break;
		}
		if(fill){
			var myTextarea = getId('UR2T_text');
			myTextarea.value = UR2T_export;
			myTextarea.focus();
		}
		selectAll();
	}

	function CSV(){
		this.escape = function(texte){
				// console.info('CSV.escape called : ' + texte);
				// texte = texte.replace(/\n/gm, "0x0D");
				texte = texte.replace(/"/gm, "0x22");
				// texte = texte.replace(/'/gm, "0x27");
				texte = texte.replace(/,/gm, "0x2C");
				// texte = texte.replace(/;/gm, "0x3B");
				return texte;
			};
		this.unescape = function(texte){
				texte = unquote(texte);
				// texte = texte.replace(/0x0D/gm, "\n");
				texte = texte.replace(/0x22/gm, "\"");
				// texte = texte.replace(/0x27/gm, "'");
				texte = texte.replace(/0x2C/gm, ",");
				// texte = texte.replace(/0x3B/gm, ";");
				return texte;
			};
		function unquote(texte){
			texte = texte.replace(/^"|"$/gm,'');
			return texte;
		};
		// console.info('CSV called');
	}

	function htmlTools(){
		this.decode = function(texte){
				texte = texte.replace(/&gt;/gm, ">");
				texte = texte.replace(/&lt;/gm, "<");
				texte = texte.replace(/&amp;/gm, "&");
				texte = texte.replace(/&nbsp;/gm, " ");
				texte = texte.replace(/&quot;/gm, "\"");
				return texte;
			}
		this.encode = function(texte){
				texte = texte.replace(/>/gi, "&gt;");
				texte = texte.replace(/</gi, "&lt;");
				texte = texte.replace(/&amp;/gi, "&");
				texte = texte.replace(/&nbsp;/gi, " ");
				texte = texte.replace(/&quot;/gi, "\"");
				return texte;
			}
	}
}

UR2T_bootstrap();

/*
	Version : 1.2
	- add : hide useless sections (without pertinent information eg : more info not avaible)
	- fix : remis en service du plugin après un deuxième click sur une UR (la même)
	- fix : some minor bugs
	- improvement : plugin moving
	
	Version : 1.1
	- add : ability of moving the plugin
	- add : show/hide UR and UR2T
	- fix : some bugs

	Version : 1.0.1
	- fix : UR detection bug

	Version : 1.0
	- add : panel expand/collapse (1 click instead of 3)
	- fix : fast UR change
	- fix : UR detection (new system)
	- fix : some bugs

	Version : 0.8
	- fix : fast fix for new WME update

	Version : 0.7
	- add : Vous pouvez ajouter vos propres Questions/Réponses

	Version : 0.6
	- add : A propos
	- add : Éditeur de signature

	Version : 0.5
	- Improvement : ability to edit defined answers
	- Improvement : edited answers saved on external server. If you logon at an another comp, everything will be restaured
	- Fix : bug on chrome that shown undefined elements

	Version : 0.4
	- Add : New UR that can be posted from livemap
	- Add : Special UR feature (must be improved)

	Version : 0.3
	- Add : new ur response type : POI request
	- BugFix : UR change without clicking the close button

	Version : 0.2
	- Improvement: "bonjour" auto change according to localtime and hour of the day : bonjour < 18h <= bonsoir <= 3h < bonjour
	- Update : "Zone de danger" deviens "Zone de contrôle"

	Version : 0.1
	- First release
*/