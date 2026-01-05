// ==UserScript==
// @name        RotateItems
// @namespace   RotateItems
// @description Pour ne plus avoir un perso tordu par ses fringues
// @match       http://www.dreadcast.net/Main 
// @version     1.02
// @grant       none
// @require     http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/28902/RotateItems.user.js
// @updateURL https://update.greasyfork.org/scripts/28902/RotateItems.meta.js
// ==/UserScript==

jQuery.noConflict();

$(document).ready(function () {
  $(document).ajaxComplete(function() {

    var modelsToRotate = [
      '[alt="modele_2"].objet_type_Buste', // Kevlar
      '[alt="modele_3"].objet_type_Tete', // Casque de pilote
      '[alt="modele_5"].objet_type_Secondaire', // Ceinture (bleue)
      '[alt="modele_13"].objet_type_Tete', // Casque anti-émeute
      '[alt="modele_18"].objet_type_Buste',
      '[alt="modele_23"].objet_type_Buste', // Cuirasse
      '[alt="modele_24"].objet_type_Secondaire', // Epaulettes
      '[alt="modele_29"].objet_type_Secondaire', // Ceinture titane
      '[alt="modele_31"].objet_type_Tete', // Haut de forme
      '[alt="modele_34"].objet_type_Buste', // Débardeur bleu (femme)
      '[alt="modele_36"].objet_type_Buste', // Débardeur blanc (femme)
      '[alt="modele_37"].objet_type_Buste', // Débardeur vert (femme)
      '[alt="modele_38"].objet_type_Tete', // Lunettes rétro
      '[alt="modele_42"].objet_type_Buste', // Blouson bleu
      '[alt="modele_43"].objet_type_Buste', // Blouson vert
      '[alt="modele_48"].objet_type_Buste', // Costume classique
      '[alt="modele_56"]',
      '[alt="modele_60"]',
      '[alt="modele_62"].objet_type_Buste', // Tailleur
      '[alt="modele_64"].objet_type_Secondaire', // Epaulettes cristal
      '[alt="modele_65].objet_type_Buste', // Cuirasse cristal
      '[alt="modele_66"].objet_type_Buste', // Veste de cérémonie
      '[alt="modele_79"].objet_type_Secondaire', // Lunettes cyber
      '[alt="modele_83"].objet_type_Secondaire', // Lunettes cyber V2
      '[alt="modele_85"].objet_type_Buste', // Armure dermique
      '[alt="modele_93"].objet_type_Secondaire', // Ceinture noire
      '[alt="modele_95"].objet_type_Buste', // Débardeur noir
      '[alt="modele_78"].objet_type_Buste', // Robe sexy
      '[alt="modele_109"].objet_type_Secondaire', // Holster
      '[alt="modele_110"].objet_type_Pied', // Chaussures bowling
      '[alt="modele_111"]',
      '[alt="modele_117"].objet_type_Tete', // Bandana noir
      '[alt="modele_118"].objet_type_Tete', // Bandana rouge
      '[alt="modele_119"].objet_type_Tete', // Bandana vert
      '[alt="modele_120"].objet_type_Tete', // Bandana bleu
      '[alt="modele_121"].objet_type_Tete', // Bandana jaune
      '[alt="modele_124"].objet_type_Buste', // Veste décontractée
      '[alt="modele_132"].objet_type_Buste', // Gros cuir
      '[alt="modele_141"].objet_type_Buste', // Robe noire
      '[alt="modele_143"].objet_type_Jambes', // Baskets Globe
      '[alt="modele_144"].objet_type_Jambes', // Baskets Reezo
      '[alt="modele_145"].objet_type_Jambes', // Baskets Poumo
      '[alt="modele_146"].objet_type_Jambes', // Baskets Arika
      '[alt="modele_152"].objet_type_Buste', // Cosmo étanche
      '[alt="modele_153"].objet_type_Buste', // Cosmo velours
      '[alt="modele_154"].objet_type_Buste', // Cosmopolitain
      '[alt="modele_162"]',
      '[alt="modele_164"].objet_type_Jambes', // Jambières Orc
      '[alt="modele_166"].objet_type_Jambes', // Jambières techno
      '[alt="modele_174"].objet_type_Jambes', // Jupe Muxo
      '[alt="modele_175"]',
      '[alt="modele_176"].objet_type_Jambes', // Jupe Muxo Pourpre
      '[alt="modele_177"]',
      '[alt="modele_179"].objet_type_Jambes', // Pantalon de chasseur
      '[alt="modele_181"].objet_type_Jambes', // Pantalon Cyber
      '[alt="modele_183"].objet_type_Jambes', //Pantalon Keynes Mills
      '[alt="modele_183"].objet_type_Jambes', // Short Hansen
      '[alt="modele_192"]',
      '[alt="modele_202"].objet_type_Jambes', // Pantalon Cosmopolitain
      '[alt="modele_205"].objet_type_Buste', // Costume Buss
      '[alt="modele_206"].objet_type_Buste', //T-shirt Dreadball femme
      '[alt="modele_206"].objet_type_Buste', // T-Shirt Dreadball (bleu)
      '[alt="modele_208"]',
      '[alt="modele_210"].objet_type_Buste', // Manteau Anapurnol
      '[alt="modele_215"].objet_type_Jambes', // Jambières Dreadball
      '[alt="modele_222"]',
      '[alt="modele_225"].objet_type_Buste', // Chemisier
      '[alt="modele_226"].objet_type_Buste', // Chemisier R
    ];

    var elemsToRotate = $(modelsToRotate.join(', '));
    elemsToRotate.css('transform', 'rotateY(180deg)');
  });

  console.log('RotateItems on');
});