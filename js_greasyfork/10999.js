// ==UserScript==
// @name        stiddari.de (French Version)
// @namespace   http://userscripts.org/users/513921
// @author Spar7acus
// @description Translates page from German to French
// @include     http://ravenc.xardas.lima-city.de*
// @version     2
// @downloadURL https://update.greasyfork.org/scripts/10999/stiddaride%20%28French%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/10999/stiddaride%20%28French%20Version%29.meta.js
// ==/UserScript==
//

(function() {

// Salles
if (location.pathname.search('raeume.htm') != -1) {  
document.body.innerHTML = document.body.innerHTML.replace(/\b(Chefbüro)\b/g, 'Bureau du Chef');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Ausbildungsraum)\b/g, 'Formation');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Waffenkammer)\b/g, 'Fabrique d´armes');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Munitionskammer)\b/g, 'Fabrique de munitions');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Brauerei)\b/g, 'Brasserie');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Kneipe)\b/g, 'Bar');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Schmuggel)\b/g, 'Contrebande');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Waffenlager)\b/g, 'Dépot d´armes');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Munitionsdepot)\b/g, 'Depot de munitions');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Alkohollager)\b/g, 'Depot d´alcool');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Tresorraum)\b/g, 'Coffre fort');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Trainingslager)\b/g, 'Camp d´entrainement');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Objektschutz)\b/g, 'Protection d´objet');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Selbstschussanlagen)\b/g, 'Tir automatique');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Versteckte Minen)\b/g, 'Mines cachées ');

document.body.innerHTML = document.body.innerHTML.replace(/\b(Voraussetzung)\b/g, 'Pré-requis');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Name)\b/g, 'Nom');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Stufe)\b/g, 'Niveau');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Dauer)\b/g, 'Temps');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Punkte)\b/g, 'Points');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Produktion)\b/g, 'Production / heure');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Räume)\b/g, 'Salles');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Berechnen)\b/g, 'calculer');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Ausbildung)\b/g, 'Formation');
}
  
  
// Formation  
if (location.pathname.search('ausbildung.htm') != -1) {   
document.body.innerHTML = document.body.innerHTML.replace(/\b(Ehre)\b/g, 'Honneur');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Chemische Formation)\b/g, 'Formation chimique');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Psychisches Training)\b/g, 'Entrainement psychique');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Guerillaausbildung)\b/g, 'Formation guerilla');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Bombenbau)\b/g, 'Construction de bombes');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Schusstraining)\b/g, 'Entrainement au tir');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Kurzwaffenkampf)\b/g, 'Combat à l´arme blanche');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Nahkampf)\b/g, 'Combat au corps a corps');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Gruppenschutz)\b/g, 'Protection de groupe');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Objektbewachung)\b/g, 'Surveillance d´objet');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Informationsbeschaffung)\b/g, 'Obtention d´information');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Schmuggel)\b/g, 'Contrebande');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Basisverwaltung)\b/g, 'Gestion de la base');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Schutzgeldeintreibung)\b/g, 'Recouvrement d´argent racket');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Auftragsplanung)\b/g, 'Planification de mission');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Routenplanung)\b/g, 'Planification de route');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Rückkehr)\b/g, 'Retour');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Camp gründen)\b/g, 'Occuper bâtiment');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Angreifen)\b/g, 'Attaquer');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Tag)\b/g, 'Jour');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Tage)\b/g, 'Jours');
  
document.body.innerHTML = document.body.innerHTML.replace(/\b(Voraussetzung)\b/g, 'Pré-requis');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Name)\b/g, 'Nom');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Stufe)\b/g, 'Niveau');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Dauer)\b/g, 'Temps');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Punkte)\b/g, 'Points');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Produktion)\b/g, 'Production / heure');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Räume)\b/g, 'Salles');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Berechnen)\b/g, 'calculer');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Ausbildung)\b/g, 'Formation');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Ausbildungsraum)\b/g, 'Salle d´entrainement (Niveau?)');
}
  
  
  
// Camp d´entrainement  
if (location.pathname.search('trainingslager3.htm') != -1) {    
document.body.innerHTML = document.body.innerHTML.replace(/Schläger/g, 'Casseur');
document.body.innerHTML = document.body.innerHTML.replace(/Türsteher/g, 'Videur');
document.body.innerHTML = document.body.innerHTML.replace(/Messerstecher/g, 'Bandit');
document.body.innerHTML = document.body.innerHTML.replace(/Revolverheld/g, 'Héro de la gâchette');
document.body.innerHTML = document.body.innerHTML.replace(/Besetzungstruppe/g, 'Troupe d´occupation');
document.body.innerHTML = document.body.innerHTML.replace(/Spion/g, 'Espion');
document.body.innerHTML = document.body.innerHTML.replace(/Möbelpacker/g, 'Emballeur');
document.body.innerHTML = document.body.innerHTML.replace(/CIA Agent/g, 'Agent CIA');
document.body.innerHTML = document.body.innerHTML.replace(/FBI Agent/g, 'Agent FBI');
document.body.innerHTML = document.body.innerHTML.replace(/Scharfschütze/g, 'Tireur d´élite');
document.body.innerHTML = document.body.innerHTML.replace(/Transporteur/g, 'Transporteur');
document.body.innerHTML = document.body.innerHTML.replace(/Problemlöser/g, 'Débloqueur de situation');
document.body.innerHTML = document.body.innerHTML.replace(/Profikiller/g, 'Tueur professionnel');
document.body.innerHTML = document.body.innerHTML.replace(/Bombenleger/g, 'Déposeur de bombes');
document.body.innerHTML = document.body.innerHTML.replace(/Söldner/g, 'Mercenaire');
document.body.innerHTML = document.body.innerHTML.replace(/Attentäter/g, 'Éclaireur');
document.body.innerHTML = document.body.innerHTML.replace(/Schwarzgeldarbeiter/g, 'Travailleur Clandestin');
document.body.innerHTML = document.body.innerHTML.replace(/Objektwache/g, 'Garde d´objets');
document.body.innerHTML = document.body.innerHTML.replace(/Bodyguard/g, 'Garde du corps');
document.body.innerHTML = document.body.innerHTML.replace(/Gardiene/g, 'Gardien');
document.body.innerHTML = document.body.innerHTML.replace(/Polizist/g, 'Policier');  
document.body.innerHTML = document.body.innerHTML.replace(/\b(Ehre)\b/g, 'Honneur');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Chemische Formation)\b/g, 'Formation chimique');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Psychisches Training)\b/g, 'Entrainement psychique');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Guerillaausbildung)\b/g, 'Formation guerilla');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Bombenbau)\b/g, 'Construction de bombes');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Schusstraining)\b/g, 'Entrainement au tir');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Kurzwaffenkampf)\b/g, 'Combat à l´arme blanche');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Nahkampf)\b/g, 'Combat au corps a corps');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Gruppenschutz)\b/g, 'Protection de groupe');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Objektbewachung)\b/g, 'Surveillance d´objet');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Informationsbeschaffung)\b/g, 'Obtention d´information');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Schmuggel)\b/g, 'Contrebande');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Basisverwaltung)\b/g, 'Gestion de la base');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Schutzgeldeintreibung)\b/g, 'Recouvrement d´argent racket');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Auftragsplanung)\b/g, 'Planification de mission');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Routenplanung)\b/g, 'Planification de route');  
  
document.body.innerHTML = document.body.innerHTML.replace(/\b(Voraussetzung)\b/g, 'Pré-requis');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Name)\b/g, 'Nom');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Stufe)\b/g, 'Niveau');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Dauer)\b/g, 'Temps');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Punkte)\b/g, 'Points');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Produktion)\b/g, 'Production / heure');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Räume)\b/g, 'Salles');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Berechnen)\b/g, 'calculer');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Ausbildung)\b/g, 'Formation');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Ausbildungsraum)\b/g, 'Salle d´entrainement (Niveau?)');   
document.body.innerHTML = document.body.innerHTML.replace(/\b(Angriffs)\b/g, 'Attaque');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Verteidigungs)\b/g, 'Défense');
document.body.innerHTML = document.body.innerHTML.replace(/\b(wert)\b/g, '(bonification)');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Trainingslager)\b/g, 'Camp d´entrainement');  
document.body.innerHTML = document.body.innerHTML.replace(/\b(Angriffsbonus)\b/g, 'Bonus d´attaque');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Verteidigungsbonus)\b/g, 'Bonus de défense');  
document.body.innerHTML = document.body.innerHTML.replace(/\b(Geschwindigkeit)\b/g, 'Vitesse');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Lohn)\b/g, 'Salaire');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Trage)\b/g, 'Capacité'); 
document.body.innerHTML = document.body.innerHTML.replace(/\b(fähigkeit)\b/g, '(de transport)'); 
}
  
// Protection d´objet 
if (location.pathname.search('objektschutz.htm') != -1) {    
document.body.innerHTML = document.body.innerHTML.replace(/Schwarzgeldarbeiter/g, 'Travailleur Clandestin');
document.body.innerHTML = document.body.innerHTML.replace(/Objektwache/g, 'Garde d´objets');
document.body.innerHTML = document.body.innerHTML.replace(/Bodyguard/g, 'Garde du corps');
document.body.innerHTML = document.body.innerHTML.replace(/Gardiene/g, 'Gardien');
document.body.innerHTML = document.body.innerHTML.replace(/Polizist/g, 'Policier');  
document.body.innerHTML = document.body.innerHTML.replace(/\b(Ehre)\b/g, 'Honneur');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Chemische Formation)\b/g, 'Formation chimique');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Psychisches Training)\b/g, 'Entrainement psychique');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Guerillaausbildung)\b/g, 'Formation guerilla');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Bombenbau)\b/g, 'Construction de bombes');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Schusstraining)\b/g, 'Entrainement au tir');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Kurzwaffenkampf)\b/g, 'Combat à l´arme blanche');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Nahkampf)\b/g, 'Combat au corps a corps');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Gruppenschutz)\b/g, 'Protection de groupe');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Objektbewachung)\b/g, 'Surveillance d´objet');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Informationsbeschaffung)\b/g, 'Obtention d´information');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Schmuggel)\b/g, 'Contrebande');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Basisverwaltung)\b/g, 'Gestion de la base');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Schutzgeldeintreibung)\b/g, 'Recouvrement d´argent racket');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Auftragsplanung)\b/g, 'Planification de mission');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Routenplanung)\b/g, 'Planification de route');  
  
document.body.innerHTML = document.body.innerHTML.replace(/\b(Voraussetzung)\b/g, 'Pré-requis');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Name)\b/g, 'Nom');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Stufe)\b/g, 'Niveau');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Dauer)\b/g, 'Temps');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Punkte)\b/g, 'Points');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Produktion)\b/g, 'Production / heure');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Räume)\b/g, 'Salles');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Berechnen)\b/g, 'calculer');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Ausbildung)\b/g, 'Formation');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Ausbildungsraum)\b/g, 'Salle d´entrainement (Niveau?)');   
document.body.innerHTML = document.body.innerHTML.replace(/\b(Angriffs)\b/g, 'Attaque');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Verteidigungs)\b/g, 'Défense');
document.body.innerHTML = document.body.innerHTML.replace(/\b(wert)\b/g, '(bonification)');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Trainingslager)\b/g, 'Camp d´entrainement');  
document.body.innerHTML = document.body.innerHTML.replace(/\b(Angriffsbonus)\b/g, 'Bonus d´attaque');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Verteidigungsbonus)\b/g, 'Bonus de défense');  
document.body.innerHTML = document.body.innerHTML.replace(/\b(Geschwindigkeit)\b/g, 'Vitesse');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Lohn)\b/g, 'Salaire');
document.body.innerHTML = document.body.innerHTML.replace(/\b(Trage)\b/g, 'Capacité'); 
document.body.innerHTML = document.body.innerHTML.replace(/\b(fähigkeit)\b/g, '(de transport)'); 
document.body.innerHTML = document.body.innerHTML.replace(/\b(Objektschutz)\b/g, 'Protection d´objet');
}  
  

})();
