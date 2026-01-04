// ==UserScript==
// @name         warframe market arcane aide traduction FR
// @version      1.0
// @description  Facilite vos ventes d'arcanes de en/fr [ne fonction pas dans les recherche(pour rechercher quand meme faite "CTRL" + "F" dans le script pour taper votre recherche), fonction uniquement dans le marcher et les profiles]
// @support     ( support me online in game on " /profile pierre314r ")
// @author       DEV314R
// @namespace https://greasyfork.org/users/467251
// @include        *warframe.market*
// @downloadURL https://update.greasyfork.org/scripts/399542/warframe%20market%20arcane%20aide%20traduction%20FR.user.js
// @updateURL https://update.greasyfork.org/scripts/399542/warframe%20market%20arcane%20aide%20traduction%20FR.meta.js
// ==/UserScript==
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);}
addGlobalStyle("::after{display:flex;color:#1a73e8;font-size:100%}"+
/* warframe */
'[href="/fr/items/arcane_aegis"] :after{content:"Arcane Égide"}'+
'[href="/fr/items/arcane_barrier"] :after{content:"Arcane Barrière"}'+
'[href="/fr/items/arcane_grace"] :after{content:"Arcane Grâce"}'+
'[href="/fr/items/arcane_pulse"] :after{content:"Arcane Pulsation"}'+
'[href="/fr/items/arcane_victory"] :after{content:"Arcane Victoire"}'+
'[href="/fr/items/arcane_agility"] :after{content:"Arcane Agilité"}'+
'[href="/fr/items/arcane_arachne"] :after{content:"Arcane Arachne"}'+
'[href="/fr/items/arcane_avenger"] :after{content:"Arcane Vengeance"}'+
'[href="/fr/items/arcane_awakening"] :after{content:"Arcane Éveil"}'+
'[href="/fr/items/arcane_consequence"] :after{content:"Arcane conséquence"}'+
'[href="/fr/items/arcane_eruption"] :after{content:"Arcane Éruption"}'+
'[href="/fr/items/arcane_healing"] :after{content:"Arcane Guérison"}'+
'[href="/fr/items/arcane_momentum"] :after{content:"Arcane Élan"}'+
'[href="/fr/items/arcane_phantasm"] :after{content:"Arcane Fantasme"}'+
'[href="/fr/items/arcane_strike"] :after{content:"Arcane Attaque"}'+
'[href="/fr/items/arcane_tempo"] :after{content:"Arcane Tempo"}'+
'[href="/fr/items/arcane_trickery"] :after{content:"Arcane Tromperie"}'+
'[href="/fr/items/arcane_ultimatum"] :after{content:"Arcane Ultimatum"}'+
'[href="/fr/items/arcane_warmth"] :after{content:"Arcane Chaleur"}'+
'[href="/fr/items/arcane_blade_charger"] :after{content:"Arcane Chargeur de lame"}'+
'[href="/fr/items/arcane_bodyguard"] :after{content:"Arcane Garde du corps"}'+
'[href="/fr/items/arcane_deflection"] :after{content:"Arcane Déviation"}'+
'[href="/fr/items/arcane_energize"] :after{content:"Arcane Énergétique"}'+
'[href="/fr/items/arcane_ice"] :after{content:"Arcane Glace"}'+
'[href="/fr/items/arcane_nullifier"] :after{content:"Arcane Zéro"}'+
'[href="/fr/items/arcane_pistoleer"] :after{content:"Arcane Pistolier"}'+
'[href="/fr/items/arcane_precision"] :after{content:"Arcane Précision"}'+
'[href="/fr/items/arcane_primary_charger"] :after{content:"Arcane Chargeur principal"}'+
'[href="/fr/items/arcane_rage"] :after{content:"Arcane Rage"}'+
'[href="/fr/items/arcane_resistance"] :after{content:"Arcane Résistance"}'+
'[href="/fr/items/arcane_tanker"] :after{content:"Arcane Tankiste"}'+
'[href="/fr/items/arcane_guardian"] :after{content:"Arcane Gardien"}'+
'[href="/fr/items/arcane_fury"] :after{content:"Arcane Furie"}'+
/* opérateur */
'[href="/fr/items/magus_acceleration"] :after{content:"Magus accélérant"}'+
'[href="/fr/items/magus_replenish"] :after{content:"Magus Alimentation"}'+
'[href="/fr/items/magus_anomaly"] :after{content:"Magus Anomalie"}'+
'[href="/fr/items/magus_cadence"] :after{content:"Magus Cadence"}'+
'[href="/fr/items/magus_lockdown"] :after{content:"Magus Confinement"}'+
'[href="/fr/items/magus_husk"] :after{content:"Magus Coquille"}'+
'[href="/fr/items/magus_destruct"] :after{content:"Magus Destruction"}'+
'[href="/fr/items/magus_melt"] :after{content:"Magus fusion"}'+
'[href="/fr/items/magus_revert"] :after{content:"Magus inverse"}'+
'[href="/fr/items/magus_glitch"] :after{content:"Magus irrégularité"}'+
'[href="/fr/items/magus_elevate"] :after{content:"Magus magnification"}'+
'[href="/fr/items/magus_cloud"] :after{content:"Magus nuage"}'+
'[href="/fr/items/magus_firewall"] :after{content:"Magus pare-feu"}'+
'[href="/fr/items/magus_drive"] :after{content:"Magus pilote"}'+
'[href="/fr/items/magus_repair"] :after{content:"Magus Réparation"}'+
'[href="/fr/items/magus_overload"] :after{content:"Magus surcharge"}'+
'[href="/fr/items/magus_nourish"] :after{content:"Magus sustentation"}'+
'[href="/fr/items/magus_vigor"] :after{content:"Magus vigueur"}'+
/* amplificateurs */
'[href="/fr/items/virtuos_strike"] :after{content:"Virtuos Attaque"}'+
'[href="/fr/items/virtuos_forge"] :after{content:"Virtuos Forge"}'+
'[href="/fr/items/virtuos_surge"] :after{content:"Virtuos Surtension"}'+
'[href="/fr/items/virtuos_tempo"] :after{content:"Virtuos Tempo"}'+
'[href="/fr/items/virtuos_trojan"] :after{content:"Virtuos Virus"}'+
'[href="/fr/items/virtuos_null"] :after{content:"Virtuos Zero"}'+
'[href="/fr/items/virtuos_spike"] :after{content:"Virtuos épines"}'+
'[href="/fr/items/virtuos_ghost"] :after{content:"Virtuos Fantôme"}'+
'[href="/fr/items/virtuos_fury"] :after{content:"Virtuos Furie"}'+
'[href="/fr/items/virtuos_shadow"] :after{content:"Virtuos Ombre"}'+
/* kitguns */
'[href="/fr/items/pax_bolt"] :after{content:"pax borne"}'+
'[href="/fr/items/pax_charge"] :after{content:"pax charge"}'+
'[href="/fr/items/pax_seeker"] :after{content:"pax chercheur"}'+
'[href="/fr/items/pax_soar"] :after{content:"pax envol"}'+
/* zaws */
'[href="/fr/items/exodia_brave"] :after{content:"Exodia Brave"}'+
'[href="/fr/items/exodia_force"] :after{content:"Exodia force"}'+
'[href="/fr/items/exodia_hunt"] :after{content:"Exodia chasse"}'+
'[href="/fr/items/exodia_might"] :after{content:"Exodia puissance"}'+
'[href="/fr/items/exodia_valor"] :after{content:"Exodia bravoure"}'+
'[href="/fr/items/exodia_triumph"] :after{content:"Exodia triomphe"}'+
'[href="/fr/items/exodia_contagion"] :after{content:"Exodia contagion"}'+
'[href="/fr/items/exodia_epidemic"] :after{content:"Exodia épidémie"}');