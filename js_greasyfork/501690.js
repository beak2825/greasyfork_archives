// ==UserScript==
// @name        ComMonKI
// @include     http://www.kraland.org/*
// @include     http://test.kraland.org/*
// @grant unsafeWindow
// @author Famine(794)
// @version 1.11
// @description Un script pour les orgas
// @namespace https://greasyfork.org/users/1320445
// @downloadURL https://update.greasyfork.org/scripts/501690/ComMonKI.user.js
// @updateURL https://update.greasyfork.org/scripts/501690/ComMonKI.meta.js
// ==/UserScript==

// COMmercial MONkey KI javaScript // HUHU

// OPTIONS A MODIFIER SI BESOIN
var valeurDefautImpot = 10; // valeur par defaut si impot non trouvé

var marchandageActive = true; // true/false affiche ou non le marchandage
var margeActive = true;  // true/false affiche ou non la colonne marge
var gainReventeActive = true;  // true/false affiche ou non la colonne marge
var typeMarchandage = 'AchatVente'; // valeur possible : Achat, Vente ou AchatVente
var valeurDefautMarchandage = 10; // valeur par défaut du marchandage

var fraude = false; // fraude fiscale activée ou non.

// NE PAS MODIFIER SI VOUS NE SAVEZ PAS CE QUE VOUS FAITES
// Liste des objets
var dataObjets = '[{"composants":[{"nomObjet":"Verre","nombre":1},{"nomObjet":"Plastique","nombre":2},{"nomObjet":"Carte Electronique","nombre":1}],"nom":"Ordinateur","categorie":"ÉLECTRONIQUE","batiment":"Électronique","uniteTravail":2,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"nom":"Ossements","categorie":"DIVERS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":1},{"nomObjet":"Corde","nombre":1}],"nom":"Machine à Pomper","categorie":"OUTILS","batiment":"Quincaillerie","uniteTravail":1,"produitPar":2,"charge":1,"niveau":3,"capacite":0},{"nom":"N?ud rose","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Plastique","nombre":1}],"nom":"Cube Capsien","categorie":"DIVERS","batiment":"Quincaillerie","uniteTravail":1,"produitPar":3,"charge":1,"niveau":1,"capacite":0},{"nom":"Cour","categorie":"ÉQUIPEMENT MAISONS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Grenade en plastique","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Crâne de Démon","categorie":"DIVERS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Bois","nombre":1},{"nomObjet":"Acier","nombre":1}],"nom":"Bouclier","categorie":"ARMURES","batiment":"Armurerie","uniteTravail":1,"produitPar":1,"charge":1,"niveau":2,"capacite":0},{"nom":"Objet Inconnu","categorie":"DIVERS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Céréale","nombre":1}],"nom":"Zubrowkra","categorie":"BOISSONS","batiment":"Restaurant","uniteTravail":1,"produitPar":3,"charge":1,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Plastique","nombre":1}],"nom":"Écran Magique Dukisse","categorie":"DIVERS","batiment":"Quincaillerie","uniteTravail":1,"produitPar":3,"charge":1,"niveau":1,"capacite":0},{"nom":"wPhone 4000","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Bonnet de Noël","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Stage - Combat Contact","categorie":"STAGES","batiment":"École Supérieure","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":1},{"nomObjet":"Cuir","nombre":2}],"nom":"Tambour","categorie":"MUSIQUE","batiment":"Quincaillerie","uniteTravail":2,"produitPar":1,"charge":1,"niveau":2,"capacite":0},{"nom":"Marionnette de chat pour ventriloque","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Légume","categorie":"NOURRITURE","batiment":"Ferme","uniteTravail":1,"produitPar":10,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Pétrole","nombre":1}],"nom":"Énergie (Pétrole)","categorie":"ÉNERGIE","batiment":"Centrale Thermique","uniteTravail":1,"produitPar":2,"charge":1,"niveau":3,"capacite":0},{"nom":"Bouton Airpé","categorie":"RELIQUES","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":8},{"nomObjet":"Moteur","nombre":2},{"nomObjet":"Lance-Roquettes","nombre":1}],"nom":"Composant d\u0027Avion Militaire","categorie":"COMPOSANTS","batiment":"Base Militaire","uniteTravail":8,"produitPar":1,"charge":10,"niveau":4,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":1},{"nomObjet":"Corde","nombre":1}],"nom":"Ukulele","categorie":"MUSIQUE","batiment":"Quincaillerie","uniteTravail":2,"produitPar":1,"charge":1,"niveau":2,"capacite":0},{"composants":[{"nomObjet":"Pierre","nombre":2}],"nom":"Verre","categorie":"PRODUITS INTERMÉDIAIRES","batiment":"Briqueterie","uniteTravail":1,"produitPar":2,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":1}],"nom":"Vieille Clef","categorie":"CLEFS","uniteTravail":1,"produitPar":5,"charge":1,"niveau":1,"capacite":0},{"nom":"Bon d\u0027Etat - Paradigme Vert","categorie":"BONS D\u0027ÉTAT / LOTERIE","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Artefact Pouvoir +1","categorie":"ARTEFACTS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Artefact Discrétion +1","categorie":"ARTEFACTS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":2},{"nomObjet":"Plastique","nombre":1},{"nomObjet":"Carte Electronique","nombre":1}],"nom":"Moteur","categorie":"PRODUITS INTERMÉDIAIRES","batiment":"Garage","uniteTravail":3,"produitPar":1,"charge":1,"niveau":2,"capacite":0},{"composants":[{"nomObjet":"Plastique","nombre":1},{"nomObjet":"Carte Electronique","nombre":1}],"nom":"Téléphone Portable","categorie":"ÉLECTRONIQUE","batiment":"Électronique","uniteTravail":1,"produitPar":1,"charge":1,"niveau":2,"capacite":0},{"nom":"Bouby","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":4},{"nomObjet":"Pneu","nombre":4},{"nomObjet":"Moteur","nombre":1},{"nomObjet":"Lance-Roquettes","nombre":1}],"nom":"Composant de Véhicule Militaire","categorie":"COMPOSANTS","batiment":"Base Militaire","uniteTravail":6,"produitPar":1,"charge":10,"niveau":3,"capacite":0},{"nom":"Stage - Informatique","categorie":"STAGES","batiment":"École Supérieure","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Pioche miniature de mineur kralandais","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Bateau dans une bouteille","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Pétrole","nombre":2}],"nom":"Caoutchouc","categorie":"PRODUITS INTERMÉDIAIRES","batiment":"Raffinerie","uniteTravail":1,"produitPar":2,"charge":1,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Cuir","nombre":4},{"nomObjet":"Textile","nombre":2}],"nom":"Mobilier","categorie":"ÉQUIPEMENT MAISONS","batiment":"Tailleur","uniteTravail":3,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"nom":"Yahourt Appleburry","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Plastique","nombre":1}],"nom":"Paire de Boules Quiès","categorie":"DIVERS","batiment":"Quincaillerie","uniteTravail":1,"produitPar":3,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Acier","nombre":2}],"nom":"Épée Courte","categorie":"ARMES DE CONTACT","batiment":"Armurerie","uniteTravail":2,"produitPar":1,"charge":1,"niveau":2,"capacite":0},{"nom":"Mouton","categorie":"ANIMAUX D\u0027ÉLEVAGE","batiment":"Enclos","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Vraie Résine de Démon Brun","categorie":"POTIONS MAGIQUES","batiment":"Alchimie","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Fruit","nombre":5},{"nomObjet":"Céréale","nombre":5}],"nom":"Petit Déjeuner","categorie":"REPAS","batiment":"Restaurant","uniteTravail":1,"produitPar":10,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":1}],"nom":"Cadenas","categorie":"ÉQUIPEMENT MAISONS","batiment":"Quincaillerie","uniteTravail":1,"produitPar":1,"charge":1,"niveau":2,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":2},{"nomObjet":"Pneu","nombre":2}],"nom":"Vélo","categorie":"VÉHICULES","batiment":"Garage","uniteTravail":3,"produitPar":1,"charge":0,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Planche","nombre":10},{"nomObjet":"Moteur","nombre":3}],"nom":"Cargo","categorie":"BATEAUX","batiment":"Port","uniteTravail":5,"produitPar":1,"charge":60,"niveau":4,"capacite":0},{"nom":"Artefact Combat Contact +1","categorie":"ARTEFACTS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":3},{"nomObjet":"Pneu","nombre":4},{"nomObjet":"Moteur","nombre":2}],"nom":"Voiture de Sport","categorie":"VÉHICULES","batiment":"Garage","uniteTravail":6,"produitPar":1,"charge":0,"niveau":3,"capacite":0},{"nom":"Ration de Survie","categorie":"NOURRITURE","uniteTravail":1,"produitPar":2,"charge":1,"niveau":1,"capacite":0},{"nom":"Uranium","categorie":"MATIÈRES PREMIÈRES","batiment":"Mine de Fer","uniteTravail":1,"produitPar":1,"charge":1,"niveau":4,"capacite":0},{"composants":[{"nomObjet":"Acier","nombre":2}],"nom":"Coffre-Fort","categorie":"ÉQUIPEMENT MAISONS","batiment":"Quincaillerie","uniteTravail":2,"produitPar":1,"charge":5,"niveau":4,"capacite":0},{"composants":[{"nomObjet":"Papier","nombre":1}],"nom":"Manuel de bricolage","categorie":"LIVRES","batiment":"Bibliothèque","uniteTravail":1,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Uranium","nombre":1}],"nom":"Énergie (Uranium)","categorie":"ÉNERGIE","batiment":"Centrale Thermique","uniteTravail":1,"produitPar":3,"charge":1,"niveau":4,"capacite":0},{"nom":"Briquet bleu","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Artefact Pouvoirs +1","categorie":"ARTEFACTS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Papier","nombre":1}],"nom":"Billet de Musée","categorie":"BONS D\u0027ÉTAT / LOTERIE","batiment":"Musée","uniteTravail":1,"produitPar":10,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Carte Electronique","nombre":1}],"nom":"Implant - Médecine","categorie":"IMPLANTS","batiment":"Clinique","uniteTravail":1,"produitPar":2,"charge":1,"niveau":4,"capacite":0},{"nom":"Ballot de Thé","categorie":"DIVERS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Briquet noir","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Cuir","nombre":1}],"nom":"Fronde","categorie":"ARMES DE TIR","batiment":"Armurerie","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Artefact Survie +1","categorie":"ARTEFACTS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Stage - Démolition","categorie":"STAGES","batiment":"École Supérieure","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Bon d\u0027Etat - Confédération Libre","categorie":"BONS D\u0027ÉTAT / LOTERIE","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Carte Electronique","nombre":1}],"nom":"Implant - Séduction","categorie":"IMPLANTS","batiment":"Clinique","uniteTravail":1,"produitPar":2,"charge":1,"niveau":4,"capacite":0},{"nom":"Siège Sacré de Naar","categorie":"RELIQUES","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Bon d\u0027Etat - Théocratie Seelienne","categorie":"BONS D\u0027ÉTAT / LOTERIE","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":1},{"nomObjet":"Corde","nombre":1}],"nom":"Stéthoscope","categorie":"OUTILS","batiment":"Quincaillerie","uniteTravail":2,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Textile","nombre":2}],"nom":"Punching-Ball","categorie":"DIVERS","batiment":"Tailleur","uniteTravail":2,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Bois","nombre":1}],"nom":"Bâton","categorie":"ARMES DE CONTACT","batiment":"Armurerie","uniteTravail":2,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Verre","nombre":1},{"nomObjet":"Plastique","nombre":2},{"nomObjet":"Carte Electronique","nombre":1}],"nom":"Télévision","categorie":"ÉQUIPEMENT MAISONS","batiment":"Électronique","uniteTravail":2,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Plastique","nombre":1}],"nom":"Norgakra en Plastique","categorie":"DIVERS","batiment":"Quincaillerie","uniteTravail":1,"produitPar":3,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Céréale","nombre":1}],"nom":"Bière","categorie":"BOISSONS","batiment":"Restaurant","uniteTravail":1,"produitPar":10,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Plastique","nombre":1}],"nom":"Badge Libère ta Liberté","categorie":"DIVERS","batiment":"Quincaillerie","uniteTravail":1,"produitPar":5,"charge":1,"niveau":1,"capacite":0},{"nom":"Logique Brute","categorie":"MATIÈRES PREMIÈRES","batiment":"Puits de Logique Brute","uniteTravail":3,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":8},{"nomObjet":"Moteur","nombre":1},{"nomObjet":"Lance-Roquettes","nombre":1}],"nom":"Composant de Navire de Guerre","categorie":"COMPOSANTS","batiment":"Base Militaire","uniteTravail":6,"produitPar":2,"charge":10,"niveau":3,"capacite":0},{"nom":"Soin","categorie":"SERVICES","batiment":"Clinique","uniteTravail":1,"produitPar":2,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Bois","nombre":6},{"nomObjet":"Acier","nombre":6}],"nom":"Hallebarde","categorie":"ARMES DE CONTACT","batiment":"Armurerie","uniteTravail":6,"produitPar":1,"charge":1,"niveau":4,"capacite":0},{"composants":[{"nomObjet":"Acier","nombre":2}],"nom":"Porte Blindée","categorie":"ÉQUIPEMENT MAISONS","batiment":"Quincaillerie","uniteTravail":2,"produitPar":1,"charge":1,"niveau":4,"capacite":0},{"composants":[{"nomObjet":"Céréale","nombre":2},{"nomObjet":"Viande","nombre":3}],"nom":"Hamburger","categorie":"REPAS","batiment":"Restaurant","uniteTravail":1,"produitPar":10,"charge":1,"niveau":2,"capacite":0},{"nom":"Insigne Militaire Confédéré","categorie":"DIVERS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Artefact Force +1","categorie":"ARTEFACTS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Carte de membre redstarlinien","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":1}],"nom":"Acier","categorie":"PRODUITS INTERMÉDIAIRES","batiment":"Forge","uniteTravail":2,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Laine","nombre":2}],"nom":"Manteau en Poils de Yak","categorie":"VÊTEMENTS ET ACCESSOIRES","batiment":"Tailleur","uniteTravail":2,"produitPar":1,"charge":1,"niveau":2,"capacite":0},{"nom":"Artefact Confort +1","categorie":"ARTEFACTS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Légume","nombre":8},{"nomObjet":"Viande","nombre":4}],"nom":"Repas avec Viande","categorie":"REPAS","batiment":"Restaurant","uniteTravail":1,"produitPar":10,"charge":1,"niveau":3,"capacite":0},{"nom":"Stage - Commerce","categorie":"STAGES","batiment":"École Supérieure","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Téteux Parasite","categorie":"ANIMAUX D\u0027ÉLEVAGE","batiment":"Enclos","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Acier","nombre":1}],"nom":"Parapluie Blindé","categorie":"DIVERS","batiment":"Armurerie","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Courtisane","categorie":"SERVICES","batiment":"Restaurant","uniteTravail":2,"produitPar":2,"charge":1,"niveau":4,"capacite":0},{"nom":"Insigne Militaire Palladionaute","categorie":"DIVERS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Briquet mauve","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Fruit","nombre":1}],"nom":"Jus de Fruit","categorie":"BOISSONS","batiment":"Restaurant","uniteTravail":1,"produitPar":10,"charge":1,"niveau":1,"capacite":0},{"nom":"Cheval Dressé","categorie":"VÉHICULES","uniteTravail":2,"produitPar":1,"charge":10,"niveau":1,"capacite":0},{"nom":"Pomme Transgénique","categorie":"NOURRITURE","batiment":"Ferme","uniteTravail":1,"produitPar":10,"charge":1,"niveau":1,"capacite":0},{"nom":"Gousse d\u0027Ail","categorie":"NOURRITURE","batiment":"Ferme","uniteTravail":1,"produitPar":10,"charge":1,"niveau":1,"capacite":0},{"nom":"Clef de Bunker","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"String de chasteté","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":10},{"nomObjet":"Moteur","nombre":8}],"nom":"Jet Privé","categorie":"AVIONS","batiment":"Aéroport","uniteTravail":10,"produitPar":1,"charge":5,"niveau":4,"capacite":0},{"composants":[{"nomObjet":"Textile","nombre":2}],"nom":"Panoplie de Discrétion","categorie":"VÊTEMENTS ET ACCESSOIRES","batiment":"Tailleur","uniteTravail":2,"produitPar":1,"charge":1,"niveau":4,"capacite":0},{"nom":"Sbleune rouge","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Bois","nombre":3},{"nomObjet":"Acier","nombre":3}],"nom":"Hache","categorie":"ARMES DE CONTACT","batiment":"Armurerie","uniteTravail":3,"produitPar":1,"charge":2,"niveau":2,"capacite":0},{"nom":"Casque de Clone Warrior 4000","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Épée Longue","nombre":1},{"nomObjet":"Anneau en Or","nombre":1}],"nom":"Épée Magique","categorie":"ARMES DE CONTACT","uniteTravail":7,"produitPar":1,"charge":2,"niveau":1,"capacite":0},{"nom":"Artefact Gestion +1","categorie":"ARTEFACTS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Pétrole","nombre":2}],"nom":"Savonnette","categorie":"DIVERS","batiment":"Raffinerie","uniteTravail":1,"produitPar":5,"charge":1,"niveau":2,"capacite":0},{"nom":"Énergie (Homme)","categorie":"ÉNERGIE","batiment":"Centrale Thermique","uniteTravail":2,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Gros bouton rose","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Essence","nombre":10}],"nom":"Voyage en Bateau","categorie":"SERVICES","batiment":"Port","uniteTravail":1,"produitPar":2,"charge":1,"niveau":2,"capacite":0},{"composants":[{"nomObjet":"Cuir","nombre":2},{"nomObjet":"Métal","nombre":1}],"nom":"Chaussures de Combat","categorie":"VÊTEMENTS ET ACCESSOIRES","batiment":"Tailleur","uniteTravail":3,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"nom":"?uf Mutant","categorie":"NOURRITURE","uniteTravail":1,"produitPar":4,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Laine","nombre":1}],"nom":"Karash en Peluche","categorie":"DIVERS","batiment":"Quincaillerie","uniteTravail":1,"produitPar":2,"charge":1,"niveau":2,"capacite":0},{"composants":[{"nomObjet":"Céréale","nombre":1}],"nom":"Alcool de Cactus","categorie":"BOISSONS","batiment":"Restaurant","uniteTravail":1,"produitPar":3,"charge":1,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Céréale","nombre":1}],"nom":"Thé","categorie":"BOISSONS","batiment":"Restaurant","uniteTravail":1,"produitPar":10,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Uranium","nombre":6},{"nomObjet":"Moteur","nombre":1},{"nomObjet":"Missile","nombre":1}],"nom":"Missile Nucléaire","categorie":"ARMEMENTS DIVERS","batiment":"Base Militaire","uniteTravail":4,"produitPar":1,"charge":25,"niveau":4,"capacite":0},{"nom":"Plante carnivore en plastique","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Peluche troll","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Canard en Plastique de Chambou","categorie":"RELIQUES","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Verre","nombre":1},{"nomObjet":"Plastique","nombre":1}],"nom":"Jumelles","categorie":"OUTILS","batiment":"Quincaillerie","uniteTravail":1,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Céréale","nombre":1}],"nom":"Whisky","categorie":"BOISSONS","batiment":"Restaurant","uniteTravail":1,"produitPar":3,"charge":1,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Plante Médicinale","nombre":4}],"nom":"Acide","categorie":"MÉDICAMENTS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Carte Electronique","nombre":1}],"nom":"Implant - Survie","categorie":"IMPLANTS","batiment":"Clinique","uniteTravail":1,"produitPar":2,"charge":1,"niveau":4,"capacite":0},{"composants":[{"nomObjet":"Légume","nombre":8},{"nomObjet":"Viande","nombre":4}],"nom":"Pizza","categorie":"REPAS","batiment":"Restaurant","uniteTravail":1,"produitPar":10,"charge":1,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Plante Magique","nombre":4}],"nom":"Poudre d\u0027Escampette","categorie":"POTIONS MAGIQUES","batiment":"Alchimie","uniteTravail":2,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"nom":"Fenouil","categorie":"NOURRITURE","batiment":"Ferme","uniteTravail":1,"produitPar":10,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Plante Magique","nombre":2}],"nom":"Élixir de Vision","categorie":"POTIONS MAGIQUES","batiment":"Alchimie","uniteTravail":2,"produitPar":1,"charge":1,"niveau":2,"capacite":0},{"nom":"Bon d\u0027Etat - Royaume de Ruthvénie","categorie":"BONS D\u0027ÉTAT / LOTERIE","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Plante Magique","categorie":"PLANTES","batiment":"Ferme","uniteTravail":1,"produitPar":1,"charge":1,"niveau":4,"capacite":0},{"nom":"Myosotis","categorie":"PLANTES","batiment":"Ferme","uniteTravail":1,"produitPar":2,"charge":1,"niveau":2,"capacite":0},{"composants":[{"nomObjet":"Fruit","nombre":1}],"nom":"Pourprovilloise","categorie":"BOISSONS","batiment":"Restaurant","uniteTravail":1,"produitPar":3,"charge":1,"niveau":3,"capacite":0},{"nom":"Jasmin","categorie":"PLANTES","batiment":"Ferme","uniteTravail":1,"produitPar":2,"charge":1,"niveau":2,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":1},{"nomObjet":"Plastique","nombre":1}],"nom":"Carte Electronique","categorie":"PRODUITS INTERMÉDIAIRES","batiment":"Électronique","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Bruyère","categorie":"PLANTES","batiment":"Ferme","uniteTravail":1,"produitPar":2,"charge":1,"niveau":2,"capacite":0},{"nom":"L\u0027Art de Gouverner Elmer Caps","categorie":"RELIQUES","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Acier","nombre":2}],"nom":"Casque","categorie":"ARMURES","batiment":"Armurerie","uniteTravail":2,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"nom":"Stage - Falsification","categorie":"STAGES","batiment":"École Supérieure","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Champignonz","categorie":"NOURRITURE","batiment":"Ferme","uniteTravail":1,"produitPar":4,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Plastique","nombre":1}],"nom":"Mini-Lexpagette Articulée","categorie":"DIVERS","batiment":"Quincaillerie","uniteTravail":1,"produitPar":3,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Or","nombre":10},{"nomObjet":"Métal","nombre":3}],"nom":"Collier en Or","categorie":"BIJOUX","batiment":"Bijouterie","uniteTravail":4,"produitPar":1,"charge":1,"niveau":4,"capacite":0},{"nom":"Artefact Moral +1","categorie":"ARTEFACTS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Clone d´Ernst Blofeld II","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Acier","nombre":1}],"nom":"Pioche","categorie":"OUTILS","batiment":"Quincaillerie","uniteTravail":2,"produitPar":1,"charge":1,"niveau":2,"capacite":0},{"nom":"Slip neuf sous blister 1er Elu","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Bon d\u0027Etat - Kraland","categorie":"BONS D\u0027ÉTAT / LOTERIE","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Cuir","categorie":"MATIÈRES PREMIÈRES","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":1},{"nomObjet":"Anneau en Or","nombre":1}],"nom":"Baguette Magique","categorie":"OBJETS MAGIQUES","batiment":"Alchimie","uniteTravail":3,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"nom":"Masque éco-terroriste (no 2)","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Vache","categorie":"ANIMAUX D\u0027ÉLEVAGE","batiment":"Enclos","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Philosophie Syncrétique de Franck Mysti","categorie":"RELIQUES","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Artefact Utilisable","categorie":"ARTEFACTS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Ocarina","categorie":"MUSIQUE","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Papier","nombre":1}],"nom":"Faux Papiers","categorie":"LIVRES","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Boule à facettes","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Artefact Falsification +1","categorie":"ARTEFACTS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Verre","nombre":1},{"nomObjet":"Plastique","nombre":2},{"nomObjet":"Carte Electronique","nombre":1}],"nom":"Caméra","categorie":"ÉQUIPEMENT MAISONS","batiment":"Électronique","uniteTravail":2,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":2},{"nomObjet":"Collier en Or","nombre":1}],"nom":"Collier de Protection","categorie":"OBJETS MAGIQUES","batiment":"Alchimie","uniteTravail":6,"produitPar":1,"charge":1,"niveau":4,"capacite":0},{"nom":"Pièce Porte-Bonheur","categorie":"RELIQUES","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Artefact Max Confort +1","categorie":"ARTEFACTS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Carte Electronique","nombre":1}],"nom":"Implant - Discrétion","categorie":"IMPLANTS","batiment":"Clinique","uniteTravail":1,"produitPar":2,"charge":1,"niveau":4,"capacite":0},{"nom":"Jambe de bois de Woodenleg","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":1},{"nomObjet":"Textile","nombre":2}],"nom":"Filet de pêche","categorie":"VÊTEMENTS ET ACCESSOIRES","batiment":"Tailleur","uniteTravail":1,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"nom":"Tambouille","categorie":"REPAS","batiment":"Prison","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Plante Médicinale","nombre":4}],"nom":"Médicament Anti-Elmérisme","categorie":"MÉDICAMENTS","batiment":"Clinique","uniteTravail":2,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"nom":"Briquet gris","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Carte Electronique","nombre":1}],"nom":"Implant - Démolition","categorie":"IMPLANTS","batiment":"Clinique","uniteTravail":1,"produitPar":2,"charge":1,"niveau":4,"capacite":0},{"nom":"Flocon de neige en cristal","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Verre","nombre":2},{"nomObjet":"Anneau en Or","nombre":2}],"nom":"Globe de Cristal","categorie":"OBJETS MAGIQUES","batiment":"Alchimie","uniteTravail":5,"produitPar":1,"charge":1,"niveau":4,"capacite":0},{"nom":"Masque éco-terroriste (no 1)","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Carte Electronique","nombre":1}],"nom":"Implant - Éloquence","categorie":"IMPLANTS","batiment":"Clinique","uniteTravail":1,"produitPar":2,"charge":1,"niveau":4,"capacite":0},{"nom":"Insigne Militaire Paradigmien","categorie":"DIVERS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Carte membre de l´Empire Rose Rechargé","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Pierre","nombre":2}],"nom":"Brique","categorie":"PRODUITS INTERMÉDIAIRES","batiment":"Briqueterie","uniteTravail":1,"produitPar":2,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":2},{"nomObjet":"Plastique","nombre":1}],"nom":"Extincteur","categorie":"ÉQUIPEMENT MAISONS","batiment":"Quincaillerie","uniteTravail":2,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"nom":"Discussion Philosophique","categorie":"SERVICES","batiment":"Bibliothèque","uniteTravail":1,"produitPar":2,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Fruit","nombre":5}],"nom":"Glace","categorie":"REPAS","batiment":"Restaurant","uniteTravail":1,"produitPar":10,"charge":1,"niveau":2,"capacite":0},{"composants":[{"nomObjet":"Fruit","nombre":5}],"nom":"Loukoum","categorie":"NOURRITURE","batiment":"Restaurant","uniteTravail":1,"produitPar":10,"charge":1,"niveau":1,"capacite":0},{"nom":"Rose","categorie":"PLANTES","batiment":"Ferme","uniteTravail":1,"produitPar":2,"charge":1,"niveau":2,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":1},{"nomObjet":"Poudre Noire","nombre":1}],"nom":"Roquette","categorie":"MUNITIONS \u0026 EXPLOSIFS","batiment":"Base Militaire","uniteTravail":1,"produitPar":5,"charge":1,"niveau":3,"capacite":0},{"nom":"Artefact Baratin +1","categorie":"ARTEFACTS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Bois","nombre":1},{"nomObjet":"Métal","nombre":1}],"nom":"Flèche","categorie":"MUNITIONS \u0026 EXPLOSIFS","batiment":"Armurerie","uniteTravail":1,"produitPar":10,"charge":1,"niveau":2,"capacite":0},{"nom":"Artefact Nourriture +1","categorie":"ARTEFACTS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Papier","nombre":1}],"nom":"Recueil des Slogans du Palladium","categorie":"LIVRES","batiment":"Bibliothèque","uniteTravail":1,"produitPar":4,"charge":1,"niveau":2,"capacite":0},{"nom":"Stage - Éloquence","categorie":"STAGES","batiment":"École Supérieure","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Papier","nombre":1}],"nom":"Portrait de la Grande Déesse","categorie":"LIVRES","batiment":"Bibliothèque","uniteTravail":1,"produitPar":2,"charge":1,"niveau":2,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":4},{"nomObjet":"Verre","nombre":6},{"nomObjet":"Carte Electronique","nombre":6}],"nom":"Défense Laser","categorie":"ÉQUIPEMENT MAISONS","batiment":"Électronique","uniteTravail":4,"produitPar":1,"charge":1,"niveau":4,"capacite":0},{"nom":"Insigne Militaire Seelien","categorie":"DIVERS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Père Vert, Grinch","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Légume","nombre":1}],"nom":"Tequila","categorie":"BOISSONS","batiment":"Restaurant","uniteTravail":1,"produitPar":3,"charge":1,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Céréale","nombre":1}],"nom":"Pikron","categorie":"BOISSONS","batiment":"Restaurant","uniteTravail":1,"produitPar":5,"charge":1,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Planche","nombre":2}],"nom":"Kayak","categorie":"BATEAUX","batiment":"Port","uniteTravail":1,"produitPar":1,"charge":0,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":2},{"nomObjet":"Plastique","nombre":1}],"nom":"Réservoir Supplémentaire","categorie":"ÉQUIPEMENTS DE VÉHICULES","batiment":"Garage","uniteTravail":2,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Verre","nombre":1}],"nom":"Boule à Neige de Tokyo-3","categorie":"DIVERS","batiment":"Quincaillerie","uniteTravail":1,"produitPar":3,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Bois","nombre":3},{"nomObjet":"Acier","nombre":8}],"nom":"Mitraillette","categorie":"ARMES DE TIR","batiment":"Armurerie","uniteTravail":8,"produitPar":1,"charge":1,"niveau":4,"capacite":0},{"composants":[{"nomObjet":"Verre","nombre":1},{"nomObjet":"Plastique","nombre":2},{"nomObjet":"Carte Electronique","nombre":1}],"nom":"Localisateur","categorie":"ÉLECTRONIQUE","batiment":"Électronique","uniteTravail":2,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Papier","nombre":1}],"nom":"Colis","categorie":"COURRIER","batiment":"Bibliothèque","uniteTravail":1,"produitPar":2,"charge":1,"niveau":3,"capacite":0},{"nom":"Cactus en pot","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Palladollar en Chocolat","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Plastique","nombre":1}],"nom":"Fausse Main","categorie":"VÊTEMENTS ET ACCESSOIRES","batiment":"Chapiteau","uniteTravail":2,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Stage - Observation","categorie":"STAGES","batiment":"École Supérieure","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Plastique","nombre":1}],"nom":"Boîte Kra20Kra","categorie":"DIVERS","batiment":"Quincaillerie","uniteTravail":1,"produitPar":3,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Carte Electronique","nombre":1}],"nom":"Implant - Combat Mains Nues","categorie":"IMPLANTS","batiment":"Clinique","uniteTravail":1,"produitPar":2,"charge":1,"niveau":4,"capacite":0},{"nom":"Stage - Combat Mains Nues","categorie":"STAGES","batiment":"École Supérieure","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Bois","nombre":2}],"nom":"Planche","categorie":"PRODUITS INTERMÉDIAIRES","batiment":"Scierie","uniteTravail":1,"produitPar":2,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Pétrole","nombre":1}],"nom":"Essence","categorie":"ÉNERGIE","batiment":"Raffinerie","uniteTravail":1,"produitPar":250,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Fruit","nombre":1}],"nom":"Vin Pourpre","categorie":"BOISSONS","batiment":"Restaurant","uniteTravail":1,"produitPar":3,"charge":1,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Laine","nombre":1}],"nom":"Textile","categorie":"PRODUITS INTERMÉDIAIRES","batiment":"Tailleur","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Carte Electronique","nombre":1}],"nom":"Implant - Commerce","categorie":"IMPLANTS","batiment":"Clinique","uniteTravail":1,"produitPar":2,"charge":1,"niveau":4,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":1},{"nomObjet":"Corde","nombre":1}],"nom":"Guitare","categorie":"MUSIQUE","batiment":"Quincaillerie","uniteTravail":2,"produitPar":1,"charge":1,"niveau":2,"capacite":0},{"composants":[{"nomObjet":"Papier","nombre":1}],"nom":"Journal","categorie":"LIVRES","batiment":"Bibliothèque","uniteTravail":1,"produitPar":8,"charge":1,"niveau":1,"capacite":0},{"nom":"Chenille en Chiffon","categorie":"DIVERS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":2},{"nomObjet":"Cuir","nombre":2}],"nom":"Valise","categorie":"VÊTEMENTS ET ACCESSOIRES","batiment":"Tailleur","uniteTravail":2,"produitPar":1,"charge":1,"niveau":4,"capacite":0},{"composants":[{"nomObjet":"Carte Electronique","nombre":1}],"nom":"Implant - Organisation","categorie":"IMPLANTS","batiment":"Clinique","uniteTravail":1,"produitPar":2,"charge":1,"niveau":4,"capacite":0},{"nom":"Sbleune jaune","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Petite Culotte Sacrée","categorie":"RELIQUES","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Bois","nombre":5},{"nomObjet":"Acier","nombre":4}],"nom":"Fusil","categorie":"ARMES DE TIR","batiment":"Armurerie","uniteTravail":6,"produitPar":1,"charge":1,"niveau":4,"capacite":0},{"nom":"Pinceau de peinture Rose","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Fourchette du Goûteur Royal","categorie":"RELIQUES","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Artefact de Téléportation","categorie":"ARTEFACTS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":4},{"nomObjet":"Pneu","nombre":4},{"nomObjet":"Moteur","nombre":1}],"nom":"Voiture","categorie":"VÉHICULES","batiment":"Garage","uniteTravail":4,"produitPar":1,"charge":5,"niveau":2,"capacite":0},{"nom":"Trésor","categorie":"MATIÈRES PREMIÈRES","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Papier","nombre":1}],"nom":"Jeu de Cartes","categorie":"LIVRES","batiment":"Bibliothèque","uniteTravail":1,"produitPar":3,"charge":1,"niveau":2,"capacite":0},{"nom":"Artefact Intelligence +1","categorie":"ARTEFACTS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Plante Médicinale","nombre":4}],"nom":"Médicament Anti-Paralysie","categorie":"MÉDICAMENTS","batiment":"Clinique","uniteTravail":2,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Plante Magique","nombre":2}],"nom":"Potion Neutralisante","categorie":"POTIONS MAGIQUES","batiment":"Alchimie","uniteTravail":2,"produitPar":1,"charge":1,"niveau":2,"capacite":0},{"nom":"Briquet brun","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":2},{"nomObjet":"Anneau en Or","nombre":2}],"nom":"Bracelet de Force","categorie":"OBJETS MAGIQUES","batiment":"Alchimie","uniteTravail":6,"produitPar":1,"charge":1,"niveau":4,"capacite":0},{"composants":[{"nomObjet":"Fruit","nombre":1}],"nom":"Liqueur de Banane","categorie":"BOISSONS","batiment":"Restaurant","uniteTravail":1,"produitPar":3,"charge":1,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Plante Médicinale","nombre":5}],"nom":"Gaz Lacrymogène","categorie":"MÉDICAMENTS","batiment":"Clinique","uniteTravail":3,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"nom":"Nuisette de Disco","categorie":"RELIQUES","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Artefact Charme +1","categorie":"ARTEFACTS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Couronne de Ruthvénie","categorie":"RELIQUES","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Plastique","nombre":1}],"nom":"Banane Sauteuse","categorie":"DIVERS","batiment":"Quincaillerie","uniteTravail":1,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"nom":"Ecrou de la machine Krapulax","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Cuir","nombre":2},{"nomObjet":"Papier","nombre":1}],"nom":"Manuel des Mystères","categorie":"LIVRES","batiment":"Bibliothèque","uniteTravail":3,"produitPar":1,"charge":1,"niveau":4,"capacite":0},{"nom":"Artefact Observation +1","categorie":"ARTEFACTS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Fleur Éternelle","categorie":"RELIQUES","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Vieille Godasse","categorie":"DIVERS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Papier","nombre":1}],"nom":"Codex Evgueni","categorie":"LIVRES","batiment":"Bibliothèque","uniteTravail":1,"produitPar":4,"charge":1,"niveau":2,"capacite":0},{"nom":"Petit Papa Noël du Désert","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Kit-à-ondes","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Textile","nombre":1}],"nom":"Uniforme Warrior 3000","categorie":"VÊTEMENTS ET ACCESSOIRES","batiment":"Tailleur","uniteTravail":1,"produitPar":1,"charge":1,"niveau":2,"capacite":0},{"nom":"Stage - Discrétion","categorie":"STAGES","batiment":"École Supérieure","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Textile","nombre":10},{"nomObjet":"Moteur","nombre":1}],"nom":"Montgolfière","categorie":"AVIONS","batiment":"Aéroport","uniteTravail":4,"produitPar":1,"charge":0,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Fleur","nombre":2}],"nom":"Shampoing Goréal","categorie":"VÊTEMENTS ET ACCESSOIRES","batiment":"Bijouterie","uniteTravail":1,"produitPar":1,"charge":1,"niveau":2,"capacite":0},{"composants":[{"nomObjet":"Laine","nombre":1}],"nom":"Ours en Peluche","categorie":"DIVERS","batiment":"Quincaillerie","uniteTravail":1,"produitPar":3,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Papier","nombre":1}],"nom":"Lettre d\u0027Auguste à Auguste","categorie":"COURRIER","uniteTravail":1,"produitPar":4,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":1}],"nom":"Harmonica","categorie":"MUSIQUE","batiment":"Quincaillerie","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Armure d\u0027Or","categorie":"RELIQUES","uniteTravail":1,"produitPar":1,"charge":2,"niveau":1,"capacite":0},{"nom":"Coffre","categorie":"ARTEFACTS","uniteTravail":1,"produitPar":1,"charge":3,"niveau":1,"capacite":0},{"nom":"Poisson Exceptionnel","categorie":"NOURRITURE","uniteTravail":1,"produitPar":2,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Fleur","nombre":5}],"nom":"Peinture Viridienne","categorie":"VÊTEMENTS ET ACCESSOIRES","batiment":"Bijouterie","uniteTravail":2,"produitPar":1,"charge":1,"niveau":2,"capacite":0},{"nom":"Manuscrit Original de Banshee!!!","categorie":"RELIQUES","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":1},{"nomObjet":"Poudre Noire","nombre":1}],"nom":"Balle","categorie":"MUNITIONS \u0026 EXPLOSIFS","batiment":"Armurerie","uniteTravail":1,"produitPar":10,"charge":1,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Plante Médicinale","nombre":4}],"nom":"Poison Lent","categorie":"MÉDICAMENTS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Stage - Séduction","categorie":"STAGES","batiment":"École Supérieure","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Plante Médicinale","categorie":"PLANTES","batiment":"Ferme","uniteTravail":1,"produitPar":2,"charge":1,"niveau":3,"capacite":0},{"nom":"Marqueur poisse","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Plante Médicinale","nombre":4}],"nom":"Médicament Anti-Dépression","categorie":"MÉDICAMENTS","batiment":"Clinique","uniteTravail":2,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"nom":"Ovule Sacré","categorie":"RELIQUES","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Anneaux de Couleur","categorie":"DIVERS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Artefact Max Nourriture +1","categorie":"ARTEFACTS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Oiseau Rare","categorie":"NOURRITURE","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Légume","nombre":1}],"nom":"Alcool de Patates","categorie":"BOISSONS","batiment":"Restaurant","uniteTravail":1,"produitPar":3,"charge":1,"niveau":3,"capacite":0},{"nom":"Artefact Combat Mains Nues +1","categorie":"ARTEFACTS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Plastique","nombre":1}],"nom":"Tchou Râleur","categorie":"DIVERS","batiment":"Quincaillerie","uniteTravail":1,"produitPar":3,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Plante Médicinale","nombre":4}],"nom":"Poison","categorie":"MÉDICAMENTS","batiment":"Clinique","uniteTravail":1,"produitPar":1,"charge":1,"niveau":2,"capacite":0},{"nom":"Clef du Coffre","categorie":"ARTEFACTS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Textile","nombre":1}],"nom":"Vêtement Chic","categorie":"VÊTEMENTS ET ACCESSOIRES","batiment":"Tailleur","uniteTravail":2,"produitPar":1,"charge":1,"niveau":2,"capacite":0},{"composants":[{"nomObjet":"Céréale","nombre":1}],"nom":"Liqueur Moldave","categorie":"BOISSONS","batiment":"Restaurant","uniteTravail":1,"produitPar":3,"charge":1,"niveau":3,"capacite":0},{"nom":"Or","categorie":"MATIÈRES PREMIÈRES","batiment":"Mine d\u0027Or","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Plante Médicinale","nombre":4}],"nom":"Médicament Anti-Drogue","categorie":"MÉDICAMENTS","batiment":"Clinique","uniteTravail":2,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Papier","nombre":1}],"nom":"Livre Saint","categorie":"LIVRES","batiment":"Bibliothèque","uniteTravail":1,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"nom":"Bâton de Vérité","categorie":"RELIQUES","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"La Perfection à l´État rose","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Papier","nombre":1}],"nom":"Livre","categorie":"LIVRES","batiment":"Bibliothèque","uniteTravail":1,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"nom":"Langue de Bolo Polo","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Bûcher portatif","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Plante Médicinale","nombre":4}],"nom":"Médicament Anti-Stress","categorie":"MÉDICAMENTS","batiment":"Clinique","uniteTravail":2,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Pierre","nombre":2}],"nom":"Sculpture","categorie":"DIVERS","uniteTravail":4,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Artefact Démolition +1","categorie":"ARTEFACTS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Céréale","nombre":1}],"nom":"Thé du Grand Jardin","categorie":"BOISSONS","batiment":"Restaurant","uniteTravail":1,"produitPar":10,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Papier","nombre":1}],"nom":"Enveloppe","categorie":"COURRIER","batiment":"Bibliothèque","uniteTravail":1,"produitPar":4,"charge":1,"niveau":2,"capacite":0},{"composants":[{"nomObjet":"Céréale","nombre":1}],"nom":"Shlibuvsky","categorie":"BOISSONS","batiment":"Restaurant","uniteTravail":1,"produitPar":3,"charge":1,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Acier","nombre":5}],"nom":"Armature Antisismique","categorie":"ÉQUIPEMENT MAISONS","batiment":"Quincaillerie","uniteTravail":5,"produitPar":1,"charge":1,"niveau":4,"capacite":0},{"nom":"Jonquille","categorie":"PLANTES","batiment":"Ferme","uniteTravail":1,"produitPar":2,"charge":1,"niveau":2,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":9},{"nomObjet":"Pneu","nombre":6},{"nomObjet":"Moteur","nombre":2}],"nom":"Camion","categorie":"VÉHICULES","batiment":"Garage","uniteTravail":9,"produitPar":1,"charge":20,"niveau":4,"capacite":0},{"composants":[{"nomObjet":"Fleur","nombre":1}],"nom":"Huile de Massage","categorie":"VÊTEMENTS ET ACCESSOIRES","batiment":"Bijouterie","uniteTravail":1,"produitPar":3,"charge":1,"niveau":2,"capacite":0},{"nom":"Boule de Noël de l´Empire Rose","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":8},{"nomObjet":"Poudre Noire","nombre":3}],"nom":"Lance-Roquettes","categorie":"ARMES DE TIR","batiment":"Base Militaire","uniteTravail":8,"produitPar":1,"charge":1,"niveau":4,"capacite":0},{"nom":"Bouteille de Gontrand de la Mortandière","categorie":"RELIQUES","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Papier","nombre":1}],"nom":"Collection de Cartes Bishônens","categorie":"LIVRES","batiment":"Bibliothèque","uniteTravail":1,"produitPar":3,"charge":1,"niveau":2,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":1}],"nom":"Rasoir","categorie":"ARMES DE CONTACT","batiment":"Quincaillerie","uniteTravail":1,"produitPar":1,"charge":1,"niveau":2,"capacite":0},{"composants":[{"nomObjet":"Plante Médicinale","nombre":4}],"nom":"Virus","categorie":"MÉDICAMENTS","batiment":"Clinique","uniteTravail":2,"produitPar":1,"charge":1,"niveau":2,"capacite":0},{"nom":"Poisson","categorie":"NOURRITURE","uniteTravail":1,"produitPar":10,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Bois","nombre":2},{"nomObjet":"Cuir","nombre":1}],"nom":"Arc","categorie":"ARMES DE TIR","batiment":"Armurerie","uniteTravail":3,"produitPar":1,"charge":1,"niveau":2,"capacite":0},{"nom":"Poupée gonflable Mère Noël","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":1},{"nomObjet":"Poudre Noire","nombre":1}],"nom":"Bombe","categorie":"MUNITIONS \u0026 EXPLOSIFS","batiment":"Armurerie","uniteTravail":1,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"nom":"Carotte des glaces","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Planche","nombre":1}],"nom":"Radeau","categorie":"BATEAUX","uniteTravail":2,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Planche","nombre":10},{"nomObjet":"Textile","nombre":6}],"nom":"Caravelle","categorie":"BATEAUX","batiment":"Port","uniteTravail":5,"produitPar":1,"charge":10,"niveau":4,"capacite":0},{"composants":[{"nomObjet":"Bois","nombre":4},{"nomObjet":"Cuir","nombre":1}],"nom":"Arc Long","categorie":"ARMES DE TIR","batiment":"Armurerie","uniteTravail":4,"produitPar":1,"charge":1,"niveau":2,"capacite":0},{"nom":"Bois","categorie":"MATIÈRES PREMIÈRES","batiment":"Production de Bois","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Fleur des Glaces","categorie":"PLANTES","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Action Palladium Corporation","categorie":"BONS D\u0027ÉTAT / LOTERIE","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Pierre","nombre":2},{"nomObjet":"Anneau en Or","nombre":2}],"nom":"Arcane de la Connaissance","categorie":"OBJETS MAGIQUES","batiment":"Alchimie","uniteTravail":6,"produitPar":1,"charge":1,"niveau":4,"capacite":0},{"composants":[{"nomObjet":"Légume","nombre":8},{"nomObjet":"Viande","nombre":4}],"nom":"Plat de Spaghettis","categorie":"REPAS","batiment":"Restaurant","uniteTravail":1,"produitPar":10,"charge":1,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Pierre","nombre":1}],"nom":"Caillou","categorie":"PRODUITS INTERMÉDIAIRES","batiment":"Prison","uniteTravail":1,"produitPar":10,"charge":1,"niveau":1,"capacite":0},{"nom":"Collier à clochette","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Artefact Soins +1","categorie":"ARTEFACTS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Cuir","nombre":2},{"nomObjet":"Métal","nombre":1}],"nom":"Patins à Glace","categorie":"VÊTEMENTS ET ACCESSOIRES","batiment":"Tailleur","uniteTravail":3,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Cuir","nombre":2}],"nom":"Fouet","categorie":"ARMES DE TIR","batiment":"Armurerie","uniteTravail":2,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Cadeau de Noël","categorie":"DIVERS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Billet de Loterie","categorie":"BONS D\u0027ÉTAT / LOTERIE","batiment":"Restaurant","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Unaussprechlichen Strukturen von Shinsei","categorie":"RELIQUES","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Épuration","categorie":"SERVICES","batiment":"Station d\u0027Épuration","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Carte Electronique","nombre":1}],"nom":"Implant - Observation","categorie":"IMPLANTS","batiment":"Clinique","uniteTravail":1,"produitPar":2,"charge":1,"niveau":4,"capacite":0},{"composants":[{"nomObjet":"Céréale","nombre":1}],"nom":"Café","categorie":"BOISSONS","batiment":"Restaurant","uniteTravail":1,"produitPar":10,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Plante Médicinale","nombre":2}],"nom":"Cigare","categorie":"DIVERS","batiment":"Alchimie","uniteTravail":1,"produitPar":4,"charge":1,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Plante Magique","nombre":1},{"nomObjet":"Papier","nombre":1}],"nom":"Parchemin","categorie":"OBJETS MAGIQUES","uniteTravail":2,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Prostitué","categorie":"SERVICES","batiment":"Restaurant","uniteTravail":1,"produitPar":2,"charge":1,"niveau":4,"capacite":0},{"composants":[{"nomObjet":"Plante Médicinale","nombre":4}],"nom":"Médicament Anti-Mystiphrénie","categorie":"MÉDICAMENTS","batiment":"Clinique","uniteTravail":2,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":9},{"nomObjet":"Pneu","nombre":6},{"nomObjet":"Moteur","nombre":2}],"nom":"Bus","categorie":"VÉHICULES","batiment":"Garage","uniteTravail":9,"produitPar":1,"charge":5,"niveau":4,"capacite":0},{"composants":[{"nomObjet":"Or","nombre":5},{"nomObjet":"Métal","nombre":1}],"nom":"Anneau en Or","categorie":"BIJOUX","batiment":"Bijouterie","uniteTravail":3,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Papier","nombre":1}],"nom":"Petit Livre Rouge de Red*Star","categorie":"LIVRES","batiment":"Bibliothèque","uniteTravail":1,"produitPar":4,"charge":1,"niveau":2,"capacite":0},{"composants":[{"nomObjet":"Papier","nombre":1}],"nom":"Livre de Comptes","categorie":"LIVRES","batiment":"Bibliothèque","uniteTravail":1,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"nom":"Tarte à la Crème Enchantée","categorie":"NOURRITURE","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Artefact Médecine +1","categorie":"ARTEFACTS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Fruit","nombre":2}],"nom":"Bonbon","categorie":"NOURRITURE","batiment":"Restaurant","uniteTravail":1,"produitPar":10,"charge":1,"niveau":1,"capacite":0},{"nom":"Artefact Consommable","categorie":"ARTEFACTS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Laine","categorie":"MATIÈRES PREMIÈRES","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Viande","categorie":"NOURRITURE","uniteTravail":1,"produitPar":5,"charge":1,"niveau":1,"capacite":0},{"nom":"Nounours Blofeld II","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Artefact Informatique +1","categorie":"ARTEFACTS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Carte Electronique","nombre":1}],"nom":"Implant - Falsification","categorie":"IMPLANTS","batiment":"Clinique","uniteTravail":1,"produitPar":2,"charge":1,"niveau":4,"capacite":0},{"nom":"Stage - Foi","categorie":"STAGES","batiment":"École Supérieure","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Planche","nombre":1}],"nom":"Porte Barricadée","categorie":"ÉQUIPEMENT MAISONS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Bois","nombre":2}],"nom":"Énergie (Bois)","categorie":"ÉNERGIE","batiment":"Centrale Thermique","uniteTravail":1,"produitPar":3,"charge":1,"niveau":2,"capacite":0},{"composants":[{"nomObjet":"Papier","nombre":1}],"nom":"Manuel de Baratin","categorie":"LIVRES","batiment":"Bibliothèque","uniteTravail":1,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":1},{"nomObjet":"Verre","nombre":1}],"nom":"Montre","categorie":"ÉLECTRONIQUE","batiment":"Électronique","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Papier","nombre":1}],"nom":"Plan de Cambrousse","categorie":"LIVRES","batiment":"Bibliothèque","uniteTravail":1,"produitPar":4,"charge":1,"niveau":2,"capacite":0},{"nom":"Casque de Saint-Evgueni","categorie":"RELIQUES","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Stage - Vol","categorie":"STAGES","batiment":"École Supérieure","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Plante Magique","nombre":2}],"nom":"Philtre d\u0027Amour","categorie":"POTIONS MAGIQUES","batiment":"Alchimie","uniteTravail":2,"produitPar":1,"charge":1,"niveau":2,"capacite":0},{"composants":[{"nomObjet":"Plastique","nombre":1}],"nom":"Casque de Chantier","categorie":"OUTILS","batiment":"Quincaillerie","uniteTravail":1,"produitPar":1,"charge":1,"niveau":2,"capacite":0},{"composants":[{"nomObjet":"Plante Médicinale","nombre":4}],"nom":"Drogue","categorie":"MÉDICAMENTS","batiment":"","uniteTravail":2,"produitPar":4,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Pétrole","nombre":1},{"nomObjet":"Verre","nombre":1}],"nom":"Trousse de Maquillage","categorie":"VÊTEMENTS ET ACCESSOIRES","batiment":"Tailleur","uniteTravail":2,"produitPar":1,"charge":1,"niveau":2,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":1},{"nomObjet":"Verre","nombre":2}],"nom":"Matériel de Faussaire","categorie":"OUTILS","batiment":"Quincaillerie","uniteTravail":2,"produitPar":1,"charge":1,"niveau":4,"capacite":0},{"composants":[{"nomObjet":"Plante Médicinale","nombre":4}],"nom":"Vaccin","categorie":"MÉDICAMENTS","batiment":"Clinique","uniteTravail":1,"produitPar":2,"charge":1,"niveau":2,"capacite":0},{"composants":[{"nomObjet":"Plastique","nombre":1}],"nom":"Canard en Plastique","categorie":"DIVERS","batiment":"Quincaillerie","uniteTravail":1,"produitPar":3,"charge":1,"niveau":1,"capacite":0},{"nom":"Artefact Autres Effets +1","categorie":"ARTEFACTS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":1}],"nom":"Clef Vierge","categorie":"OUTILS","batiment":"Quincaillerie","uniteTravail":1,"produitPar":5,"charge":1,"niveau":1,"capacite":0},{"nom":"Canard de Bouletie","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Cheval","categorie":"ANIMAUX D\u0027ÉLEVAGE","batiment":"Enclos","uniteTravail":1,"produitPar":1,"charge":10,"niveau":1,"capacite":0},{"nom":"Traité de Propriété du Niarkalistan","categorie":"RELIQUES","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Bois","nombre":2},{"nomObjet":"Acier","nombre":2}],"nom":"Revolver","categorie":"ARMES DE TIR","batiment":"Armurerie","uniteTravail":4,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Légume","nombre":10}],"nom":"Soupe Populaire","categorie":"REPAS","batiment":"Temple Nabla","uniteTravail":1,"produitPar":15,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Pierre","nombre":1},{"nomObjet":"Anneau en Or","nombre":1}],"nom":"Repoussoir à Monstres","categorie":"OBJETS MAGIQUES","batiment":"Alchimie","uniteTravail":3,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"nom":"Dark bougie naariste","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Fausse Moustache","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Essence","nombre":10}],"nom":"Voyage en Train","categorie":"SERVICES","batiment":"Gare","uniteTravail":1,"produitPar":2,"charge":1,"niveau":1,"capacite":0},{"nom":"Artefact Foi +1","categorie":"ARTEFACTS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Céréale","categorie":"NOURRITURE","batiment":"Ferme","uniteTravail":1,"produitPar":10,"charge":1,"niveau":2,"capacite":0},{"composants":[{"nomObjet":"Bois","nombre":1},{"nomObjet":"Pierre","nombre":1}],"nom":"Poudre Noire","categorie":"PRODUITS INTERMÉDIAIRES","batiment":"Armurerie","uniteTravail":2,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"nom":"Prostituée","categorie":"SERVICES","batiment":"Restaurant","uniteTravail":1,"produitPar":2,"charge":1,"niveau":4,"capacite":0},{"composants":[{"nomObjet":"Verre","nombre":1},{"nomObjet":"Carte Electronique","nombre":1}],"nom":"Lunette de Visée","categorie":"ÉLECTRONIQUE","batiment":"Électronique","uniteTravail":2,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":1},{"nomObjet":"Corde","nombre":1}],"nom":"Canne à Pêche","categorie":"OUTILS","batiment":"Quincaillerie","uniteTravail":1,"produitPar":1,"charge":1,"niveau":4,"capacite":0},{"composants":[{"nomObjet":"Papier","nombre":1}],"nom":"Lettre","categorie":"COURRIER","batiment":"Bibliothèque","uniteTravail":1,"produitPar":4,"charge":1,"niveau":2,"capacite":0},{"composants":[{"nomObjet":"Carte Electronique","nombre":1}],"nom":"Implant - Pouvoir","categorie":"IMPLANTS","batiment":"Clinique","uniteTravail":1,"produitPar":2,"charge":1,"niveau":4,"capacite":0},{"composants":[{"nomObjet":"Carte Electronique","nombre":1}],"nom":"Implant - Informatique","categorie":"IMPLANTS","batiment":"Clinique","uniteTravail":1,"produitPar":2,"charge":1,"niveau":4,"capacite":0},{"composants":[{"nomObjet":"Céréale","nombre":10}],"nom":"Speculoos","categorie":"NOURRITURE","batiment":"Restaurant","uniteTravail":1,"produitPar":20,"charge":1,"niveau":1,"capacite":0},{"nom":"Gadget","categorie":"OUTILS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Action","categorie":"BONS D\u0027ÉTAT / LOTERIE","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":1}],"nom":"Truelle","categorie":"OUTILS","batiment":"Quincaillerie","uniteTravail":1,"produitPar":1,"charge":1,"niveau":2,"capacite":0},{"nom":"Artefact Organisation +1","categorie":"ARTEFACTS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Confort","categorie":"SERVICES","batiment":"Restaurant","uniteTravail":1,"produitPar":4,"charge":1,"niveau":3,"capacite":0},{"nom":"?illet","categorie":"PLANTES","batiment":"Ferme","uniteTravail":1,"produitPar":2,"charge":1,"niveau":2,"capacite":0},{"composants":[{"nomObjet":"Plastique","nombre":1},{"nomObjet":"Carte Electronique","nombre":1}],"nom":"Trousse Médicale","categorie":"ÉLECTRONIQUE","batiment":"Électronique","uniteTravail":1,"produitPar":1,"charge":1,"niveau":2,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":1}],"nom":"Clef","categorie":"CLEFS","uniteTravail":1,"produitPar":5,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Textile","nombre":1}],"nom":"Tableau","categorie":"DIVERS","uniteTravail":4,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Plante Médicinale","nombre":4}],"nom":"Poudre de Silence","categorie":"MÉDICAMENTS","batiment":"Clinique","uniteTravail":2,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Papier","nombre":1}],"nom":"Prospectus Électoral","categorie":"LIVRES","batiment":"Bibliothèque","uniteTravail":1,"produitPar":10,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Textile","nombre":1}],"nom":"Écharpe du Tovaritch Football Club","categorie":"VÊTEMENTS ET ACCESSOIRES","batiment":"Tailleur","uniteTravail":1,"produitPar":2,"charge":1,"niveau":2,"capacite":0},{"nom":"Méta-Concepts de Bolo Polo","categorie":"RELIQUES","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Arcanes Stratégiques de Franck le Mégalo","categorie":"RELIQUES","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Plante Médicinale","nombre":4}],"nom":"Médicament Anti-Putréfaction","categorie":"MÉDICAMENTS","batiment":"Clinique","uniteTravail":2,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"nom":"Artefact Séduction +1","categorie":"ARTEFACTS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Stage - Combat Distance","categorie":"STAGES","batiment":"École Supérieure","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Pierre","nombre":1}],"nom":"Pierre de Fronde","categorie":"MUNITIONS \u0026 EXPLOSIFS","batiment":"Armurerie","uniteTravail":1,"produitPar":10,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Carte Electronique","nombre":1}],"nom":"Implant - Combat Contact","categorie":"IMPLANTS","batiment":"Clinique","uniteTravail":1,"produitPar":2,"charge":1,"niveau":4,"capacite":0},{"composants":[{"nomObjet":"Légume","nombre":4},{"nomObjet":"Fruit","nombre":4},{"nomObjet":"Poisson","nombre":4},{"nomObjet":"Viande","nombre":4}],"nom":"Repas de Luxe","categorie":"REPAS","batiment":"Restaurant","uniteTravail":2,"produitPar":10,"charge":1,"niveau":4,"capacite":0},{"composants":[{"nomObjet":"Cuir","nombre":3},{"nomObjet":"Acier","nombre":5}],"nom":"Lance-Flammes","categorie":"ARMES DE TIR","batiment":"Armurerie","uniteTravail":5,"produitPar":1,"charge":1,"niveau":4,"capacite":0},{"composants":[{"nomObjet":"Plante Médicinale","nombre":4}],"nom":"Médicament Anti-Allergie Magique","categorie":"MÉDICAMENTS","batiment":"Clinique","uniteTravail":2,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Textile","nombre":1}],"nom":"Cape","categorie":"VÊTEMENTS ET ACCESSOIRES","batiment":"Tailleur","uniteTravail":2,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Cyber-télécommande","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Plastique","nombre":1}],"nom":"Nain de Jardin","categorie":"ÉQUIPEMENT MAISONS","batiment":"Quincaillerie","uniteTravail":1,"produitPar":1,"charge":1,"niveau":2,"capacite":0},{"composants":[{"nomObjet":"Papier","nombre":1}],"nom":"Livre de Cuisine","categorie":"LIVRES","batiment":"Bibliothèque","uniteTravail":1,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Acier","nombre":1}],"nom":"Grille","categorie":"ÉQUIPEMENT MAISONS","batiment":"Quincaillerie","uniteTravail":1,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Papier","nombre":1}],"nom":"Carte","categorie":"COURRIER","batiment":"Bibliothèque","uniteTravail":1,"produitPar":4,"charge":1,"niveau":2,"capacite":0},{"composants":[{"nomObjet":"Plante Médicinale","nombre":4}],"nom":"Médicament Anti-Bolopolisme","categorie":"MÉDICAMENTS","batiment":"Clinique","uniteTravail":2,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"nom":"Artefact Max Autres Effets +1","categorie":"ARTEFACTS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Stage - Baratin","categorie":"STAGES","batiment":"École Supérieure","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Plante Médicinale","nombre":4}],"nom":"Médicament Anti-Cécité","categorie":"MÉDICAMENTS","batiment":"Clinique","uniteTravail":2,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Plante Médicinale","nombre":1},{"nomObjet":"Plante Magique","nombre":1}],"nom":"Potion de Soins","categorie":"POTIONS MAGIQUES","batiment":"Alchimie","uniteTravail":1,"produitPar":1,"charge":1,"niveau":2,"capacite":0},{"nom":"Artefact Max Soins +1","categorie":"ARTEFACTS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Masque de la Darkette","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":2},{"nomObjet":"Plastique","nombre":3},{"nomObjet":"Carte Electronique","nombre":3}],"nom":"Alarme Électronique","categorie":"ÉQUIPEMENT MAISONS","batiment":"Électronique","uniteTravail":2,"produitPar":1,"charge":1,"niveau":4,"capacite":0},{"composants":[{"nomObjet":"Légume","nombre":10}],"nom":"Salade","categorie":"REPAS","batiment":"Restaurant","uniteTravail":1,"produitPar":10,"charge":1,"niveau":1,"capacite":0},{"nom":"Fleur","categorie":"PLANTES","batiment":"Ferme","uniteTravail":1,"produitPar":2,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":2},{"nomObjet":"Anneau en Or","nombre":2}],"nom":"Diadème Psychique","categorie":"OBJETS MAGIQUES","batiment":"Alchimie","uniteTravail":6,"produitPar":1,"charge":1,"niveau":4,"capacite":0},{"nom":"Code honneur elmérien","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Acier","nombre":1}],"nom":"Système Antivol","categorie":"ÉQUIPEMENTS DE VÉHICULES","batiment":"Quincaillerie","uniteTravail":1,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Fruit","nombre":1}],"nom":"Gnôle","categorie":"BOISSONS","batiment":"Restaurant","uniteTravail":1,"produitPar":3,"charge":1,"niveau":3,"capacite":0},{"nom":"Gravures Érotiques d\u0027Hélène Nipournicontre","categorie":"RELIQUES","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Légume","nombre":8},{"nomObjet":"Viande","nombre":4}],"nom":"Soupe de Homard et Tortue","categorie":"REPAS","batiment":"Restaurant","uniteTravail":1,"produitPar":10,"charge":1,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Acier","nombre":1}],"nom":"Couteau","categorie":"ARMES DE CONTACT","batiment":"Armurerie","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Artefact Commerce +1","categorie":"ARTEFACTS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":2}],"nom":"Outils de Voleur","categorie":"OUTILS","batiment":"Quincaillerie","uniteTravail":2,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"nom":"Action Emperor Ernst Blofeld 2 pour enfants","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Cuir","nombre":2},{"nomObjet":"Métal","nombre":1}],"nom":"Santiags à Roulettes","categorie":"VÊTEMENTS ET ACCESSOIRES","batiment":"Tailleur","uniteTravail":3,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Laine","nombre":1},{"nomObjet":"Textile","nombre":1}],"nom":"Polochon","categorie":"ARMES DE CONTACT","batiment":"Tailleur","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Planche","nombre":8},{"nomObjet":"Textile","nombre":4}],"nom":"Voilier","categorie":"BATEAUX","batiment":"Port","uniteTravail":4,"produitPar":1,"charge":5,"niveau":3,"capacite":0},{"nom":"Briquet vert","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Plastique","nombre":1}],"nom":"Objet Souvenir","categorie":"DIVERS","batiment":"Statue - Kraland","uniteTravail":1,"produitPar":3,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Papier","nombre":1}],"nom":"Réglementation","categorie":"LIVRES","uniteTravail":2,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"?il Arraché","categorie":"DIVERS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":2},{"nomObjet":"Plastique","nombre":1}],"nom":"Catalyseur","categorie":"ÉQUIPEMENTS DE VÉHICULES","batiment":"Garage","uniteTravail":1,"produitPar":2,"charge":1,"niveau":4,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":6},{"nomObjet":"Moteur","nombre":4}],"nom":"Hélicoptère","categorie":"AVIONS","batiment":"Aéroport","uniteTravail":8,"produitPar":1,"charge":5,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Acier","nombre":1}],"nom":"Machette","categorie":"ARMES DE CONTACT","batiment":"Armurerie","uniteTravail":2,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":1},{"nomObjet":"Textile","nombre":2}],"nom":"Sac à Dos","categorie":"VÊTEMENTS ET ACCESSOIRES","batiment":"Tailleur","uniteTravail":1,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Planche","nombre":1},{"nomObjet":"Moteur","nombre":1}],"nom":"Vedette","categorie":"BATEAUX","batiment":"Port","uniteTravail":1,"produitPar":1,"charge":0,"niveau":2,"capacite":0},{"nom":"Infirmerie","categorie":"ÉQUIPEMENT MAISONS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Bon d\u0027Etat - Khanat Elmérien","categorie":"BONS D\u0027ÉTAT / LOTERIE","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Plastique","nombre":1}],"nom":"Objet","categorie":"DIVERS","batiment":"Quincaillerie","uniteTravail":1,"produitPar":3,"charge":1,"niveau":1,"capacite":0},{"nom":"Pierre","categorie":"MATIÈRES PREMIÈRES","batiment":"Mine de Pierre","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Briquet rouge","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Plante Médicinale","nombre":4}],"nom":"Médicament Anti-Iglootisme","categorie":"MÉDICAMENTS","batiment":"Clinique","uniteTravail":2,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"nom":"Champignon","categorie":"NOURRITURE","batiment":"Ferme","uniteTravail":1,"produitPar":10,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Carte Electronique","nombre":1}],"nom":"Implant - Foi","categorie":"IMPLANTS","batiment":"Clinique","uniteTravail":1,"produitPar":2,"charge":1,"niveau":4,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":1}],"nom":"Petite Voiture","categorie":"DIVERS","batiment":"Quincaillerie","uniteTravail":1,"produitPar":3,"charge":1,"niveau":1,"capacite":0},{"nom":"Sbleune vert","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Fruit","nombre":1}],"nom":"Rhum","categorie":"BOISSONS","batiment":"Restaurant","uniteTravail":1,"produitPar":3,"charge":1,"niveau":3,"capacite":0},{"nom":"Insigne Militaire Elmérien","categorie":"DIVERS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":2},{"nomObjet":"Pneu","nombre":2},{"nomObjet":"Moteur","nombre":2}],"nom":"Moto de Course","categorie":"VÉHICULES","batiment":"Garage","uniteTravail":4,"produitPar":1,"charge":0,"niveau":3,"capacite":0},{"nom":"Métal","categorie":"MATIÈRES PREMIÈRES","batiment":"Mine de Fer","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Fruit","nombre":10}],"nom":"Tarte à la Crème","categorie":"NOURRITURE","batiment":"Restaurant","uniteTravail":1,"produitPar":10,"charge":1,"niveau":1,"capacite":0},{"nom":"Stage - Organisation","categorie":"STAGES","batiment":"École Supérieure","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Verre","nombre":1},{"nomObjet":"Carte Electronique","nombre":1}],"nom":"Agenda Électronique","categorie":"ÉLECTRONIQUE","batiment":"Électronique","uniteTravail":1,"produitPar":1,"charge":1,"niveau":2,"capacite":0},{"composants":[{"nomObjet":"Fleur","nombre":4}],"nom":"Parfum","categorie":"VÊTEMENTS ET ACCESSOIRES","batiment":"Bijouterie","uniteTravail":1,"produitPar":2,"charge":1,"niveau":2,"capacite":0},{"nom":"Artefact Vol +1","categorie":"ARTEFACTS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Bon d\u0027Etat - Empire Brun","categorie":"BONS D\u0027ÉTAT / LOTERIE","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Saint Kraal","categorie":"RELIQUES","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":1},{"nomObjet":"Corde","nombre":1}],"nom":"Équipement de Survie","categorie":"OUTILS","batiment":"Quincaillerie","uniteTravail":2,"produitPar":1,"charge":1,"niveau":4,"capacite":0},{"nom":"Insigne Militaire du Valégro","categorie":"DIVERS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Cuir","nombre":1},{"nomObjet":"Acier","nombre":1}],"nom":"Plaque de Protection","categorie":"ARMURES","batiment":"Armurerie","uniteTravail":2,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"nom":"Action Emperor Ernst Blofeld 2 pour officiers","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Plastique","nombre":1},{"nomObjet":"Carte Electronique","nombre":1}],"nom":"Mouchard","categorie":"ÉLECTRONIQUE","batiment":"Électronique","uniteTravail":1,"produitPar":1,"charge":0,"niveau":3,"capacite":0},{"nom":"Artefact Max Pouvoirs +1","categorie":"ARTEFACTS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Caoutchouc","nombre":2}],"nom":"Pneu","categorie":"PRODUITS INTERMÉDIAIRES","batiment":"Garage","uniteTravail":1,"produitPar":2,"charge":1,"niveau":2,"capacite":0},{"nom":"Bille de Verre","categorie":"DIVERS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Insigne Militaire Kralandais","categorie":"DIVERS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Casque Ranger Jaune","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Plastique","nombre":1},{"nomObjet":"Carte Electronique","nombre":1}],"nom":"Radio","categorie":"ÉLECTRONIQUE","batiment":"Électronique","uniteTravail":1,"produitPar":1,"charge":1,"niveau":2,"capacite":0},{"composants":[{"nomObjet":"Papier","nombre":1}],"nom":"Plan","categorie":"LIVRES","uniteTravail":2,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Artefact Combat Distance +1","categorie":"ARTEFACTS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Plante Magique","nombre":2}],"nom":"Potion de Lenteur","categorie":"POTIONS MAGIQUES","batiment":"Alchimie","uniteTravail":2,"produitPar":1,"charge":1,"niveau":2,"capacite":0},{"composants":[{"nomObjet":"Plante Médicinale","nombre":2}],"nom":"Baume de Soins","categorie":"MÉDICAMENTS","batiment":"Clinique","uniteTravail":1,"produitPar":4,"charge":1,"niveau":1,"capacite":0},{"nom":"Déchet","categorie":"DIVERS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Acier","nombre":6}],"nom":"Cuirasse","categorie":"ARMURES","batiment":"Armurerie","uniteTravail":6,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":1},{"nomObjet":"Textile","nombre":2}],"nom":"Siège Supplémentaire","categorie":"ÉQUIPEMENTS DE VÉHICULES","batiment":"Tailleur","uniteTravail":1,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Bois","nombre":5},{"nomObjet":"Acier","nombre":4}],"nom":"Fusil de Chasse","categorie":"ARMES DE TIR","batiment":"Armurerie","uniteTravail":6,"produitPar":1,"charge":1,"niveau":4,"capacite":0},{"nom":"Lunettes Ma vie en Rose","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Champignon","nombre":10}],"nom":"Omelette aux Champignons","categorie":"REPAS","batiment":"Restaurant","uniteTravail":1,"produitPar":10,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":1}],"nom":"Pentacle de Naar","categorie":"BIJOUX","batiment":"Bijouterie","uniteTravail":1,"produitPar":2,"charge":1,"niveau":1,"capacite":0},{"nom":"Stage - Pouvoir","categorie":"STAGES","batiment":"École Supérieure","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Artefact Sans Effet","categorie":"ARTEFACTS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Laine","nombre":1}],"nom":"Corde","categorie":"OUTILS","batiment":"Quincaillerie","uniteTravail":1,"produitPar":1,"charge":1,"niveau":2,"capacite":0},{"nom":"Rounne d\u0027Acc","categorie":"RELIQUES","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":6},{"nomObjet":"Pneu","nombre":4},{"nomObjet":"Moteur","nombre":1}],"nom":"Camionnette","categorie":"VÉHICULES","batiment":"Garage","uniteTravail":6,"produitPar":1,"charge":10,"niveau":3,"capacite":0},{"nom":"Bishônen n°1","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Plante Médicinale","nombre":1}],"nom":"Vitamine Jukramine","categorie":"MÉDICAMENTS","batiment":"Clinique","uniteTravail":1,"produitPar":5,"charge":1,"niveau":1,"capacite":0},{"nom":"Bishônen n°2","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Poudre Noire","nombre":1},{"nomObjet":"Carte Electronique","nombre":1}],"nom":"Détonateur","categorie":"ÉLECTRONIQUE","batiment":"Électronique","uniteTravail":1,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"nom":"Lampe à Mysti","categorie":"RELIQUES","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Légume","nombre":8},{"nomObjet":"Poisson","nombre":4}],"nom":"Repas avec Poisson","categorie":"REPAS","batiment":"Restaurant","uniteTravail":1,"produitPar":10,"charge":1,"niveau":2,"capacite":0},{"nom":"Fiole de Vomi Sbleune","categorie":"MÉDICAMENTS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Papier","nombre":1}],"nom":"Photo Érotique","categorie":"DIVERS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Bishônen n°3","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":2},{"nomObjet":"Pneu","nombre":2},{"nomObjet":"Moteur","nombre":1}],"nom":"Moto","categorie":"VÉHICULES","batiment":"Garage","uniteTravail":3,"produitPar":1,"charge":0,"niveau":2,"capacite":0},{"nom":"Bishônen n°4","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Bishônen n°5","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Bishônen n°6","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Bishônen n°7","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Bishônen n°8","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Stage - Médecine","categorie":"STAGES","batiment":"École Supérieure","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Briquet jaune","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Artefact Perception +1","categorie":"ARTEFACTS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Céréale","nombre":1}],"nom":"Vodka","categorie":"BOISSONS","batiment":"Restaurant","uniteTravail":1,"produitPar":3,"charge":1,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Plante Magique","nombre":2}],"nom":"Potion Inconnue","categorie":"POTIONS MAGIQUES","batiment":"","uniteTravail":2,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Bat Boomerang","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Soutien Psychologique","categorie":"SERVICES","batiment":"Clinique","uniteTravail":1,"produitPar":2,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Plastique","nombre":1}],"nom":"Petit Poney","categorie":"DIVERS","batiment":"Quincaillerie","uniteTravail":1,"produitPar":3,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Carte Electronique","nombre":1}],"nom":"Implant - Vol","categorie":"IMPLANTS","batiment":"Clinique","uniteTravail":1,"produitPar":2,"charge":1,"niveau":4,"capacite":0},{"composants":[{"nomObjet":"Or","nombre":5},{"nomObjet":"Pierre","nombre":1},{"nomObjet":"Anneau en Or","nombre":1}],"nom":"Bague","categorie":"BIJOUX","batiment":"Bijouterie","uniteTravail":3,"produitPar":1,"charge":1,"niveau":4,"capacite":0},{"composants":[{"nomObjet":"Carte Electronique","nombre":1}],"nom":"Implant - Baratin","categorie":"IMPLANTS","batiment":"Clinique","uniteTravail":1,"produitPar":2,"charge":1,"niveau":4,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":2},{"nomObjet":"Bague","nombre":1}],"nom":"Anneau de Pouvoir","categorie":"OBJETS MAGIQUES","batiment":"Alchimie","uniteTravail":6,"produitPar":1,"charge":1,"niveau":4,"capacite":0},{"composants":[{"nomObjet":"Papier","nombre":1}],"nom":"Avion en Papier","categorie":"LIVRES","uniteTravail":1,"produitPar":4,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Plastique","nombre":1}],"nom":"Statuette de Shneider Phineras","categorie":"DIVERS","batiment":"Quincaillerie","uniteTravail":1,"produitPar":3,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Laine","nombre":1},{"nomObjet":"Textile","nombre":1}],"nom":"Oreiller","categorie":"VÊTEMENTS ET ACCESSOIRES","batiment":"Tailleur","uniteTravail":2,"produitPar":1,"charge":1,"niveau":2,"capacite":0},{"composants":[{"nomObjet":"Plante Magique","nombre":4}],"nom":"Potion de Rapidité","categorie":"POTIONS MAGIQUES","batiment":"Alchimie","uniteTravail":2,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"nom":"Poungi Articulé","categorie":"CADEAUX DE NOËL","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":1}],"nom":"Trappe","categorie":"OUTILS","batiment":"Quincaillerie","uniteTravail":1,"produitPar":1,"charge":1,"niveau":2,"capacite":0},{"composants":[{"nomObjet":"Plante Médicinale","nombre":4}],"nom":"Médicament Anti-Anorexie","categorie":"MÉDICAMENTS","batiment":"Clinique","uniteTravail":2,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Essence","nombre":100}],"nom":"Voyage en Avion","categorie":"SERVICES","batiment":"Aéroport","uniteTravail":1,"produitPar":2,"charge":1,"niveau":2,"capacite":0},{"nom":"Turban d\u0027Iznogoud","categorie":"RELIQUES","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Insigne Militaire Brun","categorie":"DIVERS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Acier","nombre":6}],"nom":"Épée Longue","categorie":"ARMES DE CONTACT","batiment":"Armurerie","uniteTravail":6,"produitPar":1,"charge":2,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":1}],"nom":"Lime","categorie":"OUTILS","batiment":"Quincaillerie","uniteTravail":1,"produitPar":1,"charge":1,"niveau":2,"capacite":0},{"nom":"Calice Nabla","categorie":"RELIQUES","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Artefact Max Moral +1","categorie":"ARTEFACTS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"nom":"Pétrole","categorie":"MATIÈRES PREMIÈRES","batiment":"Puits de Pétrole","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":1},{"nomObjet":"Textile","nombre":2}],"nom":"Tente","categorie":"VÊTEMENTS ET ACCESSOIRES","batiment":"Tailleur","uniteTravail":1,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"nom":"Insigne Militaire Ruthvène","categorie":"DIVERS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":1},{"nomObjet":"Verre","nombre":1}],"nom":"Lanterne","categorie":"OUTILS","batiment":"Quincaillerie","uniteTravail":1,"produitPar":1,"charge":1,"niveau":2,"capacite":0},{"nom":"Fruit","categorie":"NOURRITURE","batiment":"Ferme","uniteTravail":1,"produitPar":10,"charge":1,"niveau":2,"capacite":0},{"nom":"Statistiques du Pr. Jhiday","categorie":"RELIQUES","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Papier","nombre":1}],"nom":"Code Juridique","categorie":"LIVRES","batiment":"Bibliothèque","uniteTravail":1,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"composants":[{"nomObjet":"Plante Magique","nombre":4}],"nom":"Potion Amnésique","categorie":"POTIONS MAGIQUES","batiment":"Alchimie","uniteTravail":2,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"nom":"Artefact Éloquence +1","categorie":"ARTEFACTS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Verre","nombre":1},{"nomObjet":"Carte Electronique","nombre":1}],"nom":"Déflecteur Anti-Termondique","categorie":"ÉLECTRONIQUE","batiment":"Électronique","uniteTravail":2,"produitPar":1,"charge":1,"niveau":3,"capacite":0},{"nom":"Stage - Survie","categorie":"STAGES","batiment":"École Supérieure","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Pétrole","nombre":2}],"nom":"Plastique","categorie":"PRODUITS INTERMÉDIAIRES","batiment":"Raffinerie","uniteTravail":1,"produitPar":2,"charge":1,"niveau":2,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":2},{"nomObjet":"Poudre Noire","nombre":2},{"nomObjet":"Moteur","nombre":1}],"nom":"Missile","categorie":"ARMEMENTS DIVERS","batiment":"Base Militaire","uniteTravail":4,"produitPar":1,"charge":25,"niveau":4,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":2},{"nomObjet":"Collier en Or","nombre":1}],"nom":"Collier de Charme","categorie":"OBJETS MAGIQUES","batiment":"Alchimie","uniteTravail":6,"produitPar":1,"charge":1,"niveau":4,"capacite":0},{"composants":[{"nomObjet":"Métal","nombre":1}],"nom":"Enclume","categorie":"DIVERS","batiment":"Forge","uniteTravail":1,"produitPar":2,"charge":1,"niveau":2,"capacite":0},{"nom":"Artefact Volonté +1","categorie":"ARTEFACTS","uniteTravail":1,"produitPar":1,"charge":1,"niveau":1,"capacite":0},{"composants":[{"nomObjet":"Carte Electronique","nombre":1}],"nom":"Implant - Combat Distance","categorie":"IMPLANTS","batiment":"Clinique","uniteTravail":1,"produitPar":2,"charge":1,"niveau":4,"capacite":0},{"composants":[{"nomObjet":"Bois","nombre":1}],"nom":"Papier","categorie":"PRODUITS INTERMÉDIAIRES","batiment":"Scierie","uniteTravail":2,"produitPar":1,"charge":1,"niveau":2,"capacite":0},{"composants":[{"nomObjet":"Fruit","nombre":1}],"nom":"Vin","categorie":"BOISSONS","batiment":"Restaurant","uniteTravail":1,"produitPar":5,"charge":1,"niveau":2,"capacite":0},{"composants":[{"nomObjet":"Cuir","nombre":3},{"nomObjet":"Acier","nombre":4}],"nom":"Gilet Pare-Balles","categorie":"ARMURES","batiment":"Armurerie","uniteTravail":4,"produitPar":1,"charge":2,"niveau":4,"capacite":0},{"nom":"Bishônen","categorie":"SERVICES","batiment":"Restaurant","uniteTravail":2,"produitPar":2,"charge":1,"niveau":4,"capacite":0}]';
var dataBatiments = '[{"nom":"Mine d\u0027Or","noms":["Gisement d\u0027Or","Mine d\u0027Or","Centre Minier d\u0027Or","Complexe Minier d\u0027Or"],"commercePrive":false,"produits":["Or"]},{"nom":"Garage","noms":["Station-Service","Garage","Garage Central","Complexe Garagiste"],"commercePrive":true,"produits":["Pneu","Moteur","Voiture","Voiture de Sport","Camionnette","Camion","Bus","Moto","Moto de Course","Vélo","Réservoir Supplémentaire","Catalyseur"]},{"nom":"Production de Bois","noms":["Camp de Bûcherons","Production de Bois","Centre de Production de Bois","Complexe de Production de Bois"],"commercePrive":false,"produits":["Bois"]},{"nom":"École Supérieure","noms":["École","École Supérieure","Université","Campus Universitaire"],"commercePrive":true,"produits":["Stage - Baratin","Stage - Combat Mains Nues","Stage - Combat Contact","Stage - Combat Distance","Stage - Commerce","Stage - Démolition","Stage - Discrétion","Stage - Éloquence","Stage - Falsification","Stage - Foi","Stage - Informatique","Stage - Médecine","Stage - Observation","Stage - Organisation","Stage - Pouvoir","Stage - Séduction","Stage - Survie","Stage - Vol"]},{"nom":"Enclos","noms":["Pré","Enclos","Centre d\u0027Élevage","Complexe d\u0027Élevage"],"commercePrive":false,"produits":["Mouton","Vache","Téteux Parasite","Cheval"]},{"nom":"Bibliothèque","noms":["Librairie","Bibliothèque","Bibliothèque Centrale","Complexe Bibliothécaire"],"commercePrive":true,"produits":["Manuel de Baratin","Livre de Comptes","Code Juridique","Livre Saint","Manuel des Mystères","Petit Livre Rouge de Red*Star","Recueil des Slogans du Palladium","Collection de Cartes Bishônens","Codex Evgueni","Prospectus Électoral","Livre","Jeu de Cartes","Manuel de bricolage","Journal","Livre de Cuisine","Portrait de la Grande Déesse","Plan de Cambrousse","Lettre","Carte","Enveloppe","Colis","Discussion Philosophique"]},{"nom":"Scierie","noms":["Petite Scierie","Scierie","Grande Scierie","Complexe Scierie"],"commercePrive":true,"produits":["Planche","Papier"]},{"nom":"Raffinerie","noms":["Petite Raffinerie","Raffinerie","Grande Raffinerie","Complexe Raffinerie"],"commercePrive":true,"produits":["Plastique","Caoutchouc","Essence","Savonnette"]},{"nom":"École Supérieure","noms":["École","École Supérieure","Université","Campus Universitaire"],"commercePrive":true,"produits":["Stage - Baratin","Stage - Combat Mains Nues","Stage - Combat Contact","Stage - Combat Distance","Stage - Commerce","Stage - Démolition","Stage - Discrétion","Stage - Éloquence","Stage - Falsification","Stage - Foi","Stage - Informatique","Stage - Médecine","Stage - Observation","Stage - Organisation","Stage - Pouvoir","Stage - Séduction","Stage - Survie","Stage - Vol"]},{"nom":"Puits de Pétrole","noms":["Nappe de Pétrole","Puits de Pétrole","Centre Pétrolier","Complexe Pétrolier"],"commercePrive":false,"produits":["Pétrole"]},{"nom":"Puits de Pétrole","noms":["Nappe de Pétrole","Puits de Pétrole","Centre Pétrolier","Complexe Pétrolier"],"commercePrive":false,"produits":["Pétrole"]},{"nom":"Alchimie","noms":["Herboriste","Alchimie","Centre Alchimique","Complexe Alchimique"],"commercePrive":true,"produits":["Vraie Résine de Démon Brun","Potion de Soins","Potion de Rapidité","Potion Neutralisante","Potion Amnésique","Élixir de Vision","Philtre d\u0027Amour","Potion de Lenteur","Poudre d\u0027Escampette","Bracelet de Force","Diadème Psychique","Collier de Charme","Anneau de Pouvoir","Arcane de la Connaissance","Globe de Cristal","Collier de Protection","Repoussoir à Monstres","Baguette Magique","Cigare"]},{"nom":"Centrale Thermique","noms":["Centrale Thermique","Centrale Thermique","Centrale Thermique","Centrale Thermique"],"commercePrive":false,"produits":["Énergie (Homme)","Énergie (Bois)","Énergie (Pétrole)","Énergie (Uranium)"]},{"nom":"Base Militaire","noms":["Base Militaire","Base Militaire","Base Militaire","Base Militaire"],"commercePrive":false,"produits":["Lance-Roquettes","Roquette","Missile","Missile Nucléaire","Composant de Véhicule Militaire","Composant de Navire de Guerre","Composant d\u0027Avion Militaire"]},{"nom":"Bibliothèque","noms":["Librairie","Bibliothèque","Bibliothèque Centrale","Complexe Bibliothécaire"],"commercePrive":true,"produits":["Manuel de Baratin","Livre de Comptes","Code Juridique","Livre Saint","Manuel des Mystères","Petit Livre Rouge de Red*Star","Recueil des Slogans du Palladium","Collection de Cartes Bishônens","Codex Evgueni","Prospectus Électoral","Livre","Jeu de Cartes","Manuel de bricolage","Journal","Livre de Cuisine","Portrait de la Grande Déesse","Plan de Cambrousse","Lettre","Carte","Enveloppe","Colis","Discussion Philosophique"]},{"nom":"Raffinerie","noms":["Petite Raffinerie","Raffinerie","Grande Raffinerie","Complexe Raffinerie"],"commercePrive":true,"produits":["Plastique","Caoutchouc","Essence","Savonnette"]},{"nom":"Enclos","noms":["Pré","Enclos","Centre d\u0027Élevage","Complexe d\u0027Élevage"],"commercePrive":false,"produits":["Mouton","Vache","Téteux Parasite","Cheval"]},{"nom":"École Supérieure","noms":["École","École Supérieure","Université","Campus Universitaire"],"commercePrive":true,"produits":["Stage - Baratin","Stage - Combat Mains Nues","Stage - Combat Contact","Stage - Combat Distance","Stage - Commerce","Stage - Démolition","Stage - Discrétion","Stage - Éloquence","Stage - Falsification","Stage - Foi","Stage - Informatique","Stage - Médecine","Stage - Observation","Stage - Organisation","Stage - Pouvoir","Stage - Séduction","Stage - Survie","Stage - Vol"]},{"nom":"Temple Nabla","noms":["Chapelle Nabla","Temple Nabla","Cathédrale Nabla","Basilique Nabla"],"commercePrive":true,"produits":["Soupe Populaire"]},{"nom":"Aéroport","noms":["Aérodrome","Aéroport","Aéroport Central","Complexe Aéroport"],"commercePrive":false,"produits":["Montgolfière","Hélicoptère","Jet Privé","Voyage en Avion"]},{"nom":"Armurerie","noms":["Petite Armurerie","Armurerie","Armurerie Centrale","Complexe Armurier"],"commercePrive":true,"produits":["Poudre Noire","Bâton","Couteau","Épée Courte","Hache","Épée Longue","Hallebarde","Machette","Fronde","Arc","Arc Long","Revolver","Fusil","Mitraillette","Fusil de Chasse","Lance-Flammes","Fouet","Pierre de Fronde","Flèche","Balle","Bombe","Bouclier","Casque","Gilet Pare-Balles","Cuirasse","Plaque de Protection","Parapluie Blindé"]},{"nom":"Armurerie","noms":["Petite Armurerie","Armurerie","Armurerie Centrale","Complexe Armurier"],"commercePrive":true,"produits":["Poudre Noire","Bâton","Couteau","Épée Courte","Hache","Épée Longue","Hallebarde","Machette","Fronde","Arc","Arc Long","Revolver","Fusil","Mitraillette","Fusil de Chasse","Lance-Flammes","Fouet","Pierre de Fronde","Flèche","Balle","Bombe","Bouclier","Casque","Gilet Pare-Balles","Cuirasse","Plaque de Protection","Parapluie Blindé"]},{"nom":"Armurerie","noms":["Petite Armurerie","Armurerie","Armurerie Centrale","Complexe Armurier"],"commercePrive":true,"produits":["Poudre Noire","Bâton","Couteau","Épée Courte","Hache","Épée Longue","Hallebarde","Machette","Fronde","Arc","Arc Long","Revolver","Fusil","Mitraillette","Fusil de Chasse","Lance-Flammes","Fouet","Pierre de Fronde","Flèche","Balle","Bombe","Bouclier","Casque","Gilet Pare-Balles","Cuirasse","Plaque de Protection","Parapluie Blindé"]},{"nom":"Électronique","noms":["Technicien","Électronique","Centre Électronique","Complexe Cybernétique"],"commercePrive":true,"produits":["Carte Electronique","Détonateur","Ordinateur","Trousse Médicale","Agenda Électronique","Radio","Montre","Téléphone Portable","Localisateur","Mouchard","Lunette de Visée","Déflecteur Anti-Termondique","Alarme Électronique","Défense Laser","Télévision","Caméra"]},{"nom":"Puits de Logique Brute","noms":["Nappe de Logique Brute","Puits de Logique Brute","Centre de Logique Brute","Complexe de Logique Brute"],"commercePrive":false,"produits":["Logique Brute"]},{"nom":"Briqueterie","noms":["Petite Briqueterie","Briqueterie","Grande Briqueterie","Complexe Briqueterie"],"commercePrive":true,"produits":["Brique","Verre"]},{"nom":"Musée","noms":["Petit Musée","Musée","Grand Musée","Musée Impérial"],"commercePrive":true,"produits":["Billet de Musée"]},{"nom":"Gare","noms":["Station","Gare","Centre Ferroviaire","Complexe Ferroviaire"],"commercePrive":false,"produits":["Voyage en Train"]},{"nom":"Station d\u0027Épuration","noms":["Pompe d\u0027Épuration","Station d\u0027Épuration","Centre d\u0027Épuration","Complexe d\u0027Épuration"],"commercePrive":false,"produits":["Épuration"]},{"nom":"Mine de Pierre","noms":["Carrière","Mine de Pierre","Centre Minier de Pierre","Complexe Minier de Pierre"],"commercePrive":false,"produits":["Pierre"]},{"nom":"Tailleur","noms":["Vendeur de Tissu","Tailleur","Grand Tailleur","Haute-Couture"],"commercePrive":true,"produits":["Textile","Mobilier","Santiags à Roulettes","Oreiller","Patins à Glace","Écharpe du Tovaritch Football Club","Manteau en Poils de Yak","Uniforme Warrior 3000","Chaussures de Combat","Panoplie de Discrétion","Trousse de Maquillage","Cape","Vêtement Chic","Sac à Dos","Valise","Tente","Filet de pêche","Polochon","Siège Supplémentaire","Punching-Ball"]},{"nom":"Bibliothèque","noms":["Librairie","Bibliothèque","Bibliothèque Centrale","Complexe Bibliothécaire"],"commercePrive":true,"produits":["Manuel de Baratin","Livre de Comptes","Code Juridique","Livre Saint","Manuel des Mystères","Petit Livre Rouge de Red*Star","Recueil des Slogans du Palladium","Collection de Cartes Bishônens","Codex Evgueni","Prospectus Électoral","Livre","Jeu de Cartes","Manuel de bricolage","Journal","Livre de Cuisine","Portrait de la Grande Déesse","Plan de Cambrousse","Lettre","Carte","Enveloppe","Colis","Discussion Philosophique"]},{"nom":"Port","noms":["Embarcadère","Port","Centre Portuaire","Complexe Portuaire"],"commercePrive":false,"produits":["Kayak","Vedette","Voilier","Caravelle","Cargo","Voyage en Bateau"]},{"nom":"Garage","noms":["Station-Service","Garage","Garage Central","Complexe Garagiste"],"commercePrive":true,"produits":["Pneu","Moteur","Voiture","Voiture de Sport","Camionnette","Camion","Bus","Moto","Moto de Course","Vélo","Réservoir Supplémentaire","Catalyseur"]},{"nom":"Alchimie","noms":["Herboriste","Alchimie","Centre Alchimique","Complexe Alchimique"],"commercePrive":true,"produits":["Vraie Résine de Démon Brun","Potion de Soins","Potion de Rapidité","Potion Neutralisante","Potion Amnésique","Élixir de Vision","Philtre d\u0027Amour","Potion de Lenteur","Poudre d\u0027Escampette","Bracelet de Force","Diadème Psychique","Collier de Charme","Anneau de Pouvoir","Arcane de la Connaissance","Globe de Cristal","Collier de Protection","Repoussoir à Monstres","Baguette Magique","Cigare"]},{"nom":"Clinique","noms":["Infirmerie","Clinique","Hôpital","Complexe Hospitalier"],"commercePrive":true,"produits":["Médicament Anti-Paralysie","Médicament Anti-Mystiphrénie","Médicament Anti-Putréfaction","Médicament Anti-Bolopolisme","Médicament Anti-Elmérisme","Médicament Anti-Cécité","Médicament Anti-Anorexie","Médicament Anti-Dépression","Médicament Anti-Iglootisme","Médicament Anti-Allergie Magique","Médicament Anti-Stress","Médicament Anti-Drogue","Vaccin","Baume de Soins","Poison","Virus","Poudre de Silence","Gaz Lacrymogène","Vitamine Jukramine","Implant - Baratin","Implant - Combat Mains Nues","Implant - Combat Contact","Implant - Combat Distance","Implant - Commerce","Implant - Démolition","Implant - Discrétion","Implant - Éloquence","Implant - Falsification","Implant - Foi","Implant - Informatique","Implant - Médecine","Implant - Observation","Implant - Organisation","Implant - Pouvoir","Implant - Séduction","Implant - Survie","Implant - Vol","Soin","Soutien Psychologique"]},{"nom":"Mine d\u0027Or","noms":["Gisement d\u0027Or","Mine d\u0027Or","Centre Minier d\u0027Or","Complexe Minier d\u0027Or"],"commercePrive":false,"produits":["Or"]},{"nom":"Temple Nabla","noms":["Chapelle Nabla","Temple Nabla","Cathédrale Nabla","Basilique Nabla"],"commercePrive":true,"produits":["Soupe Populaire"]},{"nom":"Station d\u0027Épuration","noms":["Pompe d\u0027Épuration","Station d\u0027Épuration","Centre d\u0027Épuration","Complexe d\u0027Épuration"],"commercePrive":false,"produits":["Épuration"]},{"nom":"Ferme","noms":["Potager","Ferme","Centre Agricole","Complexe Agricole"],"commercePrive":false,"produits":["Fleur","Bruyère","Jasmin","Jonquille","Myosotis","Œillet","Rose","Plante Médicinale","Plante Magique","Légume","Fruit","Céréale","Champignon","Champignonz","Fenouil","Gousse d\u0027Ail","Pomme Transgénique"]},{"nom":"Statue - Kraland","noms":["Buste - Kraland","Statue - Kraland","Mémorial - Kraland","Monument - Kraland"],"commercePrive":false,"produits":["Objet Souvenir"]},{"nom":"Forge","noms":["Petite Forge","Forge","Grande Forge","Complexe Forge"],"commercePrive":true,"produits":["Acier","Enclume"]},{"nom":"Production de Bois","noms":["Camp de Bûcherons","Production de Bois","Centre de Production de Bois","Complexe de Production de Bois"],"commercePrive":false,"produits":["Bois"]},{"nom":"Prison","noms":["Cage","Prison","Prison de Haute Sécurité","Complexe Pénitencier"],"commercePrive":false,"produits":["Caillou","Tambouille"]},{"nom":"Mine de Pierre","noms":["Carrière","Mine de Pierre","Centre Minier de Pierre","Complexe Minier de Pierre"],"commercePrive":false,"produits":["Pierre"]},{"nom":"Prison","noms":["Cage","Prison","Prison de Haute Sécurité","Complexe Pénitencier"],"commercePrive":false,"produits":["Caillou","Tambouille"]},{"nom":"Alchimie","noms":["Herboriste","Alchimie","Centre Alchimique","Complexe Alchimique"],"commercePrive":true,"produits":["Vraie Résine de Démon Brun","Potion de Soins","Potion de Rapidité","Potion Neutralisante","Potion Amnésique","Élixir de Vision","Philtre d\u0027Amour","Potion de Lenteur","Poudre d\u0027Escampette","Bracelet de Force","Diadème Psychique","Collier de Charme","Anneau de Pouvoir","Arcane de la Connaissance","Globe de Cristal","Collier de Protection","Repoussoir à Monstres","Baguette Magique","Cigare"]},{"nom":"Scierie","noms":["Petite Scierie","Scierie","Grande Scierie","Complexe Scierie"],"commercePrive":true,"produits":["Planche","Papier"]},{"nom":"Bijouterie","noms":["Orfèvrerie","Bijouterie","Centre Bijoutier","Complexe Bijoutier"],"commercePrive":true,"produits":["Parfum","Shampoing Goréal","Peinture Viridienne","Huile de Massage","Pentacle de Naar","Anneau en Or","Bague","Collier en Or"]},{"nom":"Clinique","noms":["Infirmerie","Clinique","Hôpital","Complexe Hospitalier"],"commercePrive":true,"produits":["Médicament Anti-Paralysie","Médicament Anti-Mystiphrénie","Médicament Anti-Putréfaction","Médicament Anti-Bolopolisme","Médicament Anti-Elmérisme","Médicament Anti-Cécité","Médicament Anti-Anorexie","Médicament Anti-Dépression","Médicament Anti-Iglootisme","Médicament Anti-Allergie Magique","Médicament Anti-Stress","Médicament Anti-Drogue","Vaccin","Baume de Soins","Poison","Virus","Poudre de Silence","Gaz Lacrymogène","Vitamine Jukramine","Implant - Baratin","Implant - Combat Mains Nues","Implant - Combat Contact","Implant - Combat Distance","Implant - Commerce","Implant - Démolition","Implant - Discrétion","Implant - Éloquence","Implant - Falsification","Implant - Foi","Implant - Informatique","Implant - Médecine","Implant - Observation","Implant - Organisation","Implant - Pouvoir","Implant - Séduction","Implant - Survie","Implant - Vol","Soin","Soutien Psychologique"]},{"nom":"Production de Bois","noms":["Camp de Bûcherons","Production de Bois","Centre de Production de Bois","Complexe de Production de Bois"],"commercePrive":false,"produits":["Bois"]},{"nom":"Briqueterie","noms":["Petite Briqueterie","Briqueterie","Grande Briqueterie","Complexe Briqueterie"],"commercePrive":true,"produits":["Brique","Verre"]},{"nom":"Alchimie","noms":["Herboriste","Alchimie","Centre Alchimique","Complexe Alchimique"],"commercePrive":true,"produits":["Vraie Résine de Démon Brun","Potion de Soins","Potion de Rapidité","Potion Neutralisante","Potion Amnésique","Élixir de Vision","Philtre d\u0027Amour","Potion de Lenteur","Poudre d\u0027Escampette","Bracelet de Force","Diadème Psychique","Collier de Charme","Anneau de Pouvoir","Arcane de la Connaissance","Globe de Cristal","Collier de Protection","Repoussoir à Monstres","Baguette Magique","Cigare"]},{"nom":"Mine de Fer","noms":["Gisement de Fer","Mine de Fer","Centre Minier de Fer","Complexe Minier de Fer"],"commercePrive":false,"produits":["Métal","Uranium"]},{"nom":"Électronique","noms":["Technicien","Électronique","Centre Électronique","Complexe Cybernétique"],"commercePrive":true,"produits":["Carte Electronique","Détonateur","Ordinateur","Trousse Médicale","Agenda Électronique","Radio","Montre","Téléphone Portable","Localisateur","Mouchard","Lunette de Visée","Déflecteur Anti-Termondique","Alarme Électronique","Défense Laser","Télévision","Caméra"]},{"nom":"Musée","noms":["Petit Musée","Musée","Grand Musée","Musée Impérial"],"commercePrive":true,"produits":["Billet de Musée"]},{"nom":"Port","noms":["Embarcadère","Port","Centre Portuaire","Complexe Portuaire"],"commercePrive":false,"produits":["Kayak","Vedette","Voilier","Caravelle","Cargo","Voyage en Bateau"]},{"nom":"Temple Nabla","noms":["Chapelle Nabla","Temple Nabla","Cathédrale Nabla","Basilique Nabla"],"commercePrive":true,"produits":["Soupe Populaire"]},{"nom":"Restaurant","noms":["Bar","Restaurant","Auberge","Hôtel"],"commercePrive":true,"produits":["Tarte à la Crème","Bonbon","Speculoos","Loukoum","Salade","Repas avec Poisson","Repas avec Viande","Repas de Luxe","Petit Déjeuner","Glace","Hamburger","Omelette aux Champignons","Soupe de Homard et Tortue","Plat de Spaghettis","Pizza","Jus de Fruit","Café","Thé","Bière","Vin","Whisky","Pikron","Liqueur de Banane","Alcool de Cactus","Zubrowkra","Vodka","Gnôle","Thé du Grand Jardin","Alcool de Patates","Shlibuvsky","Pourprovilloise","Vin Pourpre","Liqueur Moldave","Tequila","Rhum","Prostituée","Prostitué","Courtisane","Bishônen","Confort","Billet de Loterie"]},{"nom":"Station d\u0027Épuration","noms":["Pompe d\u0027Épuration","Station d\u0027Épuration","Centre d\u0027Épuration","Complexe d\u0027Épuration"],"commercePrive":false,"produits":["Épuration"]},{"nom":"Raffinerie","noms":["Petite Raffinerie","Raffinerie","Grande Raffinerie","Complexe Raffinerie"],"commercePrive":true,"produits":["Plastique","Caoutchouc","Essence","Savonnette"]},{"nom":"Mine d\u0027Or","noms":["Gisement d\u0027Or","Mine d\u0027Or","Centre Minier d\u0027Or","Complexe Minier d\u0027Or"],"commercePrive":false,"produits":["Or"]},{"nom":"Raffinerie","noms":["Petite Raffinerie","Raffinerie","Grande Raffinerie","Complexe Raffinerie"],"commercePrive":true,"produits":["Plastique","Caoutchouc","Essence","Savonnette"]},{"nom":"Restaurant","noms":["Bar","Restaurant","Auberge","Hôtel"],"commercePrive":true,"produits":["Tarte à la Crème","Bonbon","Speculoos","Loukoum","Salade","Repas avec Poisson","Repas avec Viande","Repas de Luxe","Petit Déjeuner","Glace","Hamburger","Omelette aux Champignons","Soupe de Homard et Tortue","Plat de Spaghettis","Pizza","Jus de Fruit","Café","Thé","Bière","Vin","Whisky","Pikron","Liqueur de Banane","Alcool de Cactus","Zubrowkra","Vodka","Gnôle","Thé du Grand Jardin","Alcool de Patates","Shlibuvsky","Pourprovilloise","Vin Pourpre","Liqueur Moldave","Tequila","Rhum","Prostituée","Prostitué","Courtisane","Bishônen","Confort","Billet de Loterie"]},{"nom":"Quincaillerie","noms":["Vendeur de Pacotille","Quincaillerie","Centre Quincailler","Complexe Quincailler"],"commercePrive":true,"produits":["Corde","Matériel de Faussaire","Jumelles","Équipement de Survie","Outils de Voleur","Trappe","Lime","Stéthoscope","Truelle","Casque de Chantier","Canne à Pêche","Pioche","Lanterne","Machine à Pomper","Clef Vierge","Cadenas","Grille","Porte Blindée","Coffre-Fort","Extincteur","Armature Antisismique","Nain de Jardin","Rasoir","Système Antivol","Guitare","Ukulele","Harmonica","Tambour","Boîte Kra20Kra","Mini-Lexpagette Articulée","Boule à Neige de Tokyo-3","Écran Magique Dukisse","Canard en Plastique","Cube Capsien","Badge Libère ta Liberté","Statuette de Shneider Phineras","Norgakra en Plastique","Ours en Peluche","Tchou Râleur","Karash en Peluche","Petite Voiture","Petit Poney","Paire de Boules Quiès","Banane Sauteuse","Objet"]},{"nom":"Puits de Logique Brute","noms":["Nappe de Logique Brute","Puits de Logique Brute","Centre de Logique Brute","Complexe de Logique Brute"],"commercePrive":false,"produits":["Logique Brute"]},{"nom":"Garage","noms":["Station-Service","Garage","Garage Central","Complexe Garagiste"],"commercePrive":true,"produits":["Pneu","Moteur","Voiture","Voiture de Sport","Camionnette","Camion","Bus","Moto","Moto de Course","Vélo","Réservoir Supplémentaire","Catalyseur"]},{"nom":"Électronique","noms":["Technicien","Électronique","Centre Électronique","Complexe Cybernétique"],"commercePrive":true,"produits":["Carte Electronique","Détonateur","Ordinateur","Trousse Médicale","Agenda Électronique","Radio","Montre","Téléphone Portable","Localisateur","Mouchard","Lunette de Visée","Déflecteur Anti-Termondique","Alarme Électronique","Défense Laser","Télévision","Caméra"]},{"nom":"Mine de Pierre","noms":["Carrière","Mine de Pierre","Centre Minier de Pierre","Complexe Minier de Pierre"],"commercePrive":false,"produits":["Pierre"]},{"nom":"Mine de Fer","noms":["Gisement de Fer","Mine de Fer","Centre Minier de Fer","Complexe Minier de Fer"],"commercePrive":false,"produits":["Métal","Uranium"]},{"nom":"Ferme","noms":["Potager","Ferme","Centre Agricole","Complexe Agricole"],"commercePrive":false,"produits":["Fleur","Bruyère","Jasmin","Jonquille","Myosotis","Œillet","Rose","Plante Médicinale","Plante Magique","Légume","Fruit","Céréale","Champignon","Champignonz","Fenouil","Gousse d\u0027Ail","Pomme Transgénique"]},{"nom":"Gare","noms":["Station","Gare","Centre Ferroviaire","Complexe Ferroviaire"],"commercePrive":false,"produits":["Voyage en Train"]},{"nom":"Bibliothèque","noms":["Librairie","Bibliothèque","Bibliothèque Centrale","Complexe Bibliothécaire"],"commercePrive":true,"produits":["Manuel de Baratin","Livre de Comptes","Code Juridique","Livre Saint","Manuel des Mystères","Petit Livre Rouge de Red*Star","Recueil des Slogans du Palladium","Collection de Cartes Bishônens","Codex Evgueni","Prospectus Électoral","Livre","Jeu de Cartes","Manuel de bricolage","Journal","Livre de Cuisine","Portrait de la Grande Déesse","Plan de Cambrousse","Lettre","Carte","Enveloppe","Colis","Discussion Philosophique"]},{"nom":"Clinique","noms":["Infirmerie","Clinique","Hôpital","Complexe Hospitalier"],"commercePrive":true,"produits":["Médicament Anti-Paralysie","Médicament Anti-Mystiphrénie","Médicament Anti-Putréfaction","Médicament Anti-Bolopolisme","Médicament Anti-Elmérisme","Médicament Anti-Cécité","Médicament Anti-Anorexie","Médicament Anti-Dépression","Médicament Anti-Iglootisme","Médicament Anti-Allergie Magique","Médicament Anti-Stress","Médicament Anti-Drogue","Vaccin","Baume de Soins","Poison","Virus","Poudre de Silence","Gaz Lacrymogène","Vitamine Jukramine","Implant - Baratin","Implant - Combat Mains Nues","Implant - Combat Contact","Implant - Combat Distance","Implant - Commerce","Implant - Démolition","Implant - Discrétion","Implant - Éloquence","Implant - Falsification","Implant - Foi","Implant - Informatique","Implant - Médecine","Implant - Observation","Implant - Organisation","Implant - Pouvoir","Implant - Séduction","Implant - Survie","Implant - Vol","Soin","Soutien Psychologique"]},{"nom":"Production de Bois","noms":["Camp de Bûcherons","Production de Bois","Centre de Production de Bois","Complexe de Production de Bois"],"commercePrive":false,"produits":["Bois"]},{"nom":"Port","noms":["Embarcadère","Port","Centre Portuaire","Complexe Portuaire"],"commercePrive":false,"produits":["Kayak","Vedette","Voilier","Caravelle","Cargo","Voyage en Bateau"]},{"nom":"Restaurant","noms":["Bar","Restaurant","Auberge","Hôtel"],"commercePrive":true,"produits":["Tarte à la Crème","Bonbon","Speculoos","Loukoum","Salade","Repas avec Poisson","Repas avec Viande","Repas de Luxe","Petit Déjeuner","Glace","Hamburger","Omelette aux Champignons","Soupe de Homard et Tortue","Plat de Spaghettis","Pizza","Jus de Fruit","Café","Thé","Bière","Vin","Whisky","Pikron","Liqueur de Banane","Alcool de Cactus","Zubrowkra","Vodka","Gnôle","Thé du Grand Jardin","Alcool de Patates","Shlibuvsky","Pourprovilloise","Vin Pourpre","Liqueur Moldave","Tequila","Rhum","Prostituée","Prostitué","Courtisane","Bishônen","Confort","Billet de Loterie"]},{"nom":"Puits de Pétrole","noms":["Nappe de Pétrole","Puits de Pétrole","Centre Pétrolier","Complexe Pétrolier"],"commercePrive":false,"produits":["Pétrole"]},{"nom":"Gare","noms":["Station","Gare","Centre Ferroviaire","Complexe Ferroviaire"],"commercePrive":false,"produits":["Voyage en Train"]},{"nom":"Scierie","noms":["Petite Scierie","Scierie","Grande Scierie","Complexe Scierie"],"commercePrive":true,"produits":["Planche","Papier"]},{"nom":"Enclos","noms":["Pré","Enclos","Centre d\u0027Élevage","Complexe d\u0027Élevage"],"commercePrive":false,"produits":["Mouton","Vache","Téteux Parasite","Cheval"]},{"nom":"Briqueterie","noms":["Petite Briqueterie","Briqueterie","Grande Briqueterie","Complexe Briqueterie"],"commercePrive":true,"produits":["Brique","Verre"]},{"nom":"Temple Nabla","noms":["Chapelle Nabla","Temple Nabla","Cathédrale Nabla","Basilique Nabla"],"commercePrive":true,"produits":["Soupe Populaire"]},{"nom":"Mine de Fer","noms":["Gisement de Fer","Mine de Fer","Centre Minier de Fer","Complexe Minier de Fer"],"commercePrive":false,"produits":["Métal","Uranium"]},{"nom":"Quincaillerie","noms":["Vendeur de Pacotille","Quincaillerie","Centre Quincailler","Complexe Quincailler"],"commercePrive":true,"produits":["Corde","Matériel de Faussaire","Jumelles","Équipement de Survie","Outils de Voleur","Trappe","Lime","Stéthoscope","Truelle","Casque de Chantier","Canne à Pêche","Pioche","Lanterne","Machine à Pomper","Clef Vierge","Cadenas","Grille","Porte Blindée","Coffre-Fort","Extincteur","Armature Antisismique","Nain de Jardin","Rasoir","Système Antivol","Guitare","Ukulele","Harmonica","Tambour","Boîte Kra20Kra","Mini-Lexpagette Articulée","Boule à Neige de Tokyo-3","Écran Magique Dukisse","Canard en Plastique","Cube Capsien","Badge Libère ta Liberté","Statuette de Shneider Phineras","Norgakra en Plastique","Ours en Peluche","Tchou Râleur","Karash en Peluche","Petite Voiture","Petit Poney","Paire de Boules Quiès","Banane Sauteuse","Objet"]},{"nom":"Station d\u0027Épuration","noms":["Pompe d\u0027Épuration","Station d\u0027Épuration","Centre d\u0027Épuration","Complexe d\u0027Épuration"],"commercePrive":false,"produits":["Épuration"]},{"nom":"Aéroport","noms":["Aérodrome","Aéroport","Aéroport Central","Complexe Aéroport"],"commercePrive":false,"produits":["Montgolfière","Hélicoptère","Jet Privé","Voyage en Avion"]},{"nom":"Mine de Fer","noms":["Gisement de Fer","Mine de Fer","Centre Minier de Fer","Complexe Minier de Fer"],"commercePrive":false,"produits":["Métal","Uranium"]},{"nom":"Musée","noms":["Petit Musée","Musée","Grand Musée","Musée Impérial"],"commercePrive":true,"produits":["Billet de Musée"]},{"nom":"École Supérieure","noms":["École","École Supérieure","Université","Campus Universitaire"],"commercePrive":true,"produits":["Stage - Baratin","Stage - Combat Mains Nues","Stage - Combat Contact","Stage - Combat Distance","Stage - Commerce","Stage - Démolition","Stage - Discrétion","Stage - Éloquence","Stage - Falsification","Stage - Foi","Stage - Informatique","Stage - Médecine","Stage - Observation","Stage - Organisation","Stage - Pouvoir","Stage - Séduction","Stage - Survie","Stage - Vol"]},{"nom":"Tailleur","noms":["Vendeur de Tissu","Tailleur","Grand Tailleur","Haute-Couture"],"commercePrive":true,"produits":["Textile","Mobilier","Santiags à Roulettes","Oreiller","Patins à Glace","Écharpe du Tovaritch Football Club","Manteau en Poils de Yak","Uniforme Warrior 3000","Chaussures de Combat","Panoplie de Discrétion","Trousse de Maquillage","Cape","Vêtement Chic","Sac à Dos","Valise","Tente","Filet de pêche","Polochon","Siège Supplémentaire","Punching-Ball"]},{"nom":"Clinique","noms":["Infirmerie","Clinique","Hôpital","Complexe Hospitalier"],"commercePrive":true,"produits":["Médicament Anti-Paralysie","Médicament Anti-Mystiphrénie","Médicament Anti-Putréfaction","Médicament Anti-Bolopolisme","Médicament Anti-Elmérisme","Médicament Anti-Cécité","Médicament Anti-Anorexie","Médicament Anti-Dépression","Médicament Anti-Iglootisme","Médicament Anti-Allergie Magique","Médicament Anti-Stress","Médicament Anti-Drogue","Vaccin","Baume de Soins","Poison","Virus","Poudre de Silence","Gaz Lacrymogène","Vitamine Jukramine","Implant - Baratin","Implant - Combat Mains Nues","Implant - Combat Contact","Implant - Combat Distance","Implant - Commerce","Implant - Démolition","Implant - Discrétion","Implant - Éloquence","Implant - Falsification","Implant - Foi","Implant - Informatique","Implant - Médecine","Implant - Observation","Implant - Organisation","Implant - Pouvoir","Implant - Séduction","Implant - Survie","Implant - Vol","Soin","Soutien Psychologique"]},{"nom":"Bijouterie","noms":["Orfèvrerie","Bijouterie","Centre Bijoutier","Complexe Bijoutier"],"commercePrive":true,"produits":["Parfum","Shampoing Goréal","Peinture Viridienne","Huile de Massage","Pentacle de Naar","Anneau en Or","Bague","Collier en Or"]},{"nom":"Forge","noms":["Petite Forge","Forge","Grande Forge","Complexe Forge"],"commercePrive":true,"produits":["Acier","Enclume"]},{"nom":"Forge","noms":["Petite Forge","Forge","Grande Forge","Complexe Forge"],"commercePrive":true,"produits":["Acier","Enclume"]},{"nom":"Enclos","noms":["Pré","Enclos","Centre d\u0027Élevage","Complexe d\u0027Élevage"],"commercePrive":false,"produits":["Mouton","Vache","Téteux Parasite","Cheval"]},{"nom":"Gare","noms":["Station","Gare","Centre Ferroviaire","Complexe Ferroviaire"],"commercePrive":false,"produits":["Voyage en Train"]},{"nom":"Forge","noms":["Petite Forge","Forge","Grande Forge","Complexe Forge"],"commercePrive":true,"produits":["Acier","Enclume"]},{"nom":"Puits de Pétrole","noms":["Nappe de Pétrole","Puits de Pétrole","Centre Pétrolier","Complexe Pétrolier"],"commercePrive":false,"produits":["Pétrole"]},{"nom":"Ferme","noms":["Potager","Ferme","Centre Agricole","Complexe Agricole"],"commercePrive":false,"produits":["Fleur","Bruyère","Jasmin","Jonquille","Myosotis","Œillet","Rose","Plante Médicinale","Plante Magique","Légume","Fruit","Céréale","Champignon","Champignonz","Fenouil","Gousse d\u0027Ail","Pomme Transgénique"]},{"nom":"Prison","noms":["Cage","Prison","Prison de Haute Sécurité","Complexe Pénitencier"],"commercePrive":false,"produits":["Caillou","Tambouille"]},{"nom":"Tailleur","noms":["Vendeur de Tissu","Tailleur","Grand Tailleur","Haute-Couture"],"commercePrive":true,"produits":["Textile","Mobilier","Santiags à Roulettes","Oreiller","Patins à Glace","Écharpe du Tovaritch Football Club","Manteau en Poils de Yak","Uniforme Warrior 3000","Chaussures de Combat","Panoplie de Discrétion","Trousse de Maquillage","Cape","Vêtement Chic","Sac à Dos","Valise","Tente","Filet de pêche","Polochon","Siège Supplémentaire","Punching-Ball"]},{"nom":"Électronique","noms":["Technicien","Électronique","Centre Électronique","Complexe Cybernétique"],"commercePrive":true,"produits":["Carte Electronique","Détonateur","Ordinateur","Trousse Médicale","Agenda Électronique","Radio","Montre","Téléphone Portable","Localisateur","Mouchard","Lunette de Visée","Déflecteur Anti-Termondique","Alarme Électronique","Défense Laser","Télévision","Caméra"]},{"nom":"Puits de Logique Brute","noms":["Nappe de Logique Brute","Puits de Logique Brute","Centre de Logique Brute","Complexe de Logique Brute"],"commercePrive":false,"produits":["Logique Brute"]},{"nom":"Port","noms":["Embarcadère","Port","Centre Portuaire","Complexe Portuaire"],"commercePrive":false,"produits":["Kayak","Vedette","Voilier","Caravelle","Cargo","Voyage en Bateau"]},{"nom":"Statue - Kraland","noms":["Buste - Kraland","Statue - Kraland","Mémorial - Kraland","Monument - Kraland"],"commercePrive":false,"produits":["Objet Souvenir"]},{"nom":"Quincaillerie","noms":["Vendeur de Pacotille","Quincaillerie","Centre Quincailler","Complexe Quincailler"],"commercePrive":true,"produits":["Corde","Matériel de Faussaire","Jumelles","Équipement de Survie","Outils de Voleur","Trappe","Lime","Stéthoscope","Truelle","Casque de Chantier","Canne à Pêche","Pioche","Lanterne","Machine à Pomper","Clef Vierge","Cadenas","Grille","Porte Blindée","Coffre-Fort","Extincteur","Armature Antisismique","Nain de Jardin","Rasoir","Système Antivol","Guitare","Ukulele","Harmonica","Tambour","Boîte Kra20Kra","Mini-Lexpagette Articulée","Boule à Neige de Tokyo-3","Écran Magique Dukisse","Canard en Plastique","Cube Capsien","Badge Libère ta Liberté","Statuette de Shneider Phineras","Norgakra en Plastique","Ours en Peluche","Tchou Râleur","Karash en Peluche","Petite Voiture","Petit Poney","Paire de Boules Quiès","Banane Sauteuse","Objet"]},{"nom":"Mine de Pierre","noms":["Carrière","Mine de Pierre","Centre Minier de Pierre","Complexe Minier de Pierre"],"commercePrive":false,"produits":["Pierre"]},{"nom":"Puits de Logique Brute","noms":["Nappe de Logique Brute","Puits de Logique Brute","Centre de Logique Brute","Complexe de Logique Brute"],"commercePrive":false,"produits":["Logique Brute"]},{"nom":"Armurerie","noms":["Petite Armurerie","Armurerie","Armurerie Centrale","Complexe Armurier"],"commercePrive":true,"produits":["Poudre Noire","Bâton","Couteau","Épée Courte","Hache","Épée Longue","Hallebarde","Machette","Fronde","Arc","Arc Long","Revolver","Fusil","Mitraillette","Fusil de Chasse","Lance-Flammes","Fouet","Pierre de Fronde","Flèche","Balle","Bombe","Bouclier","Casque","Gilet Pare-Balles","Cuirasse","Plaque de Protection","Parapluie Blindé"]},{"nom":"Bijouterie","noms":["Orfèvrerie","Bijouterie","Centre Bijoutier","Complexe Bijoutier"],"commercePrive":true,"produits":["Parfum","Shampoing Goréal","Peinture Viridienne","Huile de Massage","Pentacle de Naar","Anneau en Or","Bague","Collier en Or"]},{"nom":"Aéroport","noms":["Aérodrome","Aéroport","Aéroport Central","Complexe Aéroport"],"commercePrive":false,"produits":["Montgolfière","Hélicoptère","Jet Privé","Voyage en Avion"]},{"nom":"Bijouterie","noms":["Orfèvrerie","Bijouterie","Centre Bijoutier","Complexe Bijoutier"],"commercePrive":true,"produits":["Parfum","Shampoing Goréal","Peinture Viridienne","Huile de Massage","Pentacle de Naar","Anneau en Or","Bague","Collier en Or"]},{"nom":"Tailleur","noms":["Vendeur de Tissu","Tailleur","Grand Tailleur","Haute-Couture"],"commercePrive":true,"produits":["Textile","Mobilier","Santiags à Roulettes","Oreiller","Patins à Glace","Écharpe du Tovaritch Football Club","Manteau en Poils de Yak","Uniforme Warrior 3000","Chaussures de Combat","Panoplie de Discrétion","Trousse de Maquillage","Cape","Vêtement Chic","Sac à Dos","Valise","Tente","Filet de pêche","Polochon","Siège Supplémentaire","Punching-Ball"]},{"nom":"Ferme","noms":["Potager","Ferme","Centre Agricole","Complexe Agricole"],"commercePrive":false,"produits":["Fleur","Bruyère","Jasmin","Jonquille","Myosotis","Œillet","Rose","Plante Médicinale","Plante Magique","Légume","Fruit","Céréale","Champignon","Champignonz","Fenouil","Gousse d\u0027Ail","Pomme Transgénique"]},{"nom":"Chapiteau","noms":["Chapiteau","Chapiteau","Chapiteau","Chapiteau"],"commercePrive":false,"produits":["Fausse Main"]},{"nom":"Prison","noms":["Cage","Prison","Prison de Haute Sécurité","Complexe Pénitencier"],"commercePrive":false,"produits":["Caillou","Tambouille"]},{"nom":"Scierie","noms":["Petite Scierie","Scierie","Grande Scierie","Complexe Scierie"],"commercePrive":true,"produits":["Planche","Papier"]},{"nom":"Briqueterie","noms":["Petite Briqueterie","Briqueterie","Grande Briqueterie","Complexe Briqueterie"],"commercePrive":true,"produits":["Brique","Verre"]},{"nom":"Mine d\u0027Or","noms":["Gisement d\u0027Or","Mine d\u0027Or","Centre Minier d\u0027Or","Complexe Minier d\u0027Or"],"commercePrive":false,"produits":["Or"]},{"nom":"Aéroport","noms":["Aérodrome","Aéroport","Aéroport Central","Complexe Aéroport"],"commercePrive":false,"produits":["Montgolfière","Hélicoptère","Jet Privé","Voyage en Avion"]},{"nom":"Quincaillerie","noms":["Vendeur de Pacotille","Quincaillerie","Centre Quincailler","Complexe Quincailler"],"commercePrive":true,"produits":["Corde","Matériel de Faussaire","Jumelles","Équipement de Survie","Outils de Voleur","Trappe","Lime","Stéthoscope","Truelle","Casque de Chantier","Canne à Pêche","Pioche","Lanterne","Machine à Pomper","Clef Vierge","Cadenas","Grille","Porte Blindée","Coffre-Fort","Extincteur","Armature Antisismique","Nain de Jardin","Rasoir","Système Antivol","Guitare","Ukulele","Harmonica","Tambour","Boîte Kra20Kra","Mini-Lexpagette Articulée","Boule à Neige de Tokyo-3","Écran Magique Dukisse","Canard en Plastique","Cube Capsien","Badge Libère ta Liberté","Statuette de Shneider Phineras","Norgakra en Plastique","Ours en Peluche","Tchou Râleur","Karash en Peluche","Petite Voiture","Petit Poney","Paire de Boules Quiès","Banane Sauteuse","Objet"]},{"nom":"Restaurant","noms":["Bar","Restaurant","Auberge","Hôtel"],"commercePrive":true,"produits":["Tarte à la Crème","Bonbon","Speculoos","Loukoum","Salade","Repas avec Poisson","Repas avec Viande","Repas de Luxe","Petit Déjeuner","Glace","Hamburger","Omelette aux Champignons","Soupe de Homard et Tortue","Plat de Spaghettis","Pizza","Jus de Fruit","Café","Thé","Bière","Vin","Whisky","Pikron","Liqueur de Banane","Alcool de Cactus","Zubrowkra","Vodka","Gnôle","Thé du Grand Jardin","Alcool de Patates","Shlibuvsky","Pourprovilloise","Vin Pourpre","Liqueur Moldave","Tequila","Rhum","Prostituée","Prostitué","Courtisane","Bishônen","Confort","Billet de Loterie"]},{"nom":"Garage","noms":["Station-Service","Garage","Garage Central","Complexe Garagiste"],"commercePrive":true,"produits":["Pneu","Moteur","Voiture","Voiture de Sport","Camionnette","Camion","Bus","Moto","Moto de Course","Vélo","Réservoir Supplémentaire","Catalyseur"]},{"nom":"Musée","noms":["Petit Musée","Musée","Grand Musée","Musée Impérial"],"commercePrive":true,"produits":["Billet de Musée"]},{"nom":"Statue - Kraland","noms":["Buste - Kraland","Statue - Kraland","Mémorial - Kraland","Monument - Kraland"],"commercePrive":false,"produits":["Objet Souvenir"]},{"nom":"Statue - Kraland","noms":["Buste - Kraland","Statue - Kraland","Mémorial - Kraland","Monument - Kraland"],"commercePrive":false,"produits":["Objet Souvenir"]},{"nom":"Temple Dame de l\u0027Étang","noms":["Chapelle Dame de l\u0027Étang","Temple Dame de l\u0027Étang","Cathédrale Dame de l\u0027Étang","Basilique Dame de l\u0027Étang"],"commercePrive":true,"produits":["Soupe Populaire"]},{"nom":"Temple Saint-Evgueni","noms":["Chapelle Saint-Evgueni","Temple Saint-Evgueni","Cathédrale Saint-Evgueni","Basilique Saint-Evgueni"],"commercePrive":true,"produits":["Soupe Populaire"]},{"nom":"Temple Ovule Sacré","noms":["Chapelle Ovule Sacré","Temple Ovule Sacré","Cathédrale Ovule Sacré","Basilique Ovule Sacré"],"commercePrive":true,"produits":["Soupe Populaire"]},{"nom":"Temple Conscience Universelle","noms":["Chapelle Conscience Universelle","Temple Conscience Universelle","Cathédrale Conscience Universelle","Basilique Conscience Universelle"],"commercePrive":true,"produits":["Soupe Populaire"]},{"nom":"Temple Grande Déesse","noms":["Chapelle Grande Déesse","Temple Grande Déesse","Cathédrale Grande Déesse","Basilique Grande Déesse"],"commercePrive":true,"produits":["Soupe Populaire"]},{"nom":"Temple Corbeille Sacrée","noms":["Chapelle Corbeille Sacrée","Temple Corbeille Sacrée","Cathédrale Corbeille Sacrée","Basilique Corbeille Sacrée"],"commercePrive":true,"produits":["Soupe Populaire"]},{"nom":"Temple de Naar","noms":["Chapelle de Naar","Temple de Naar","Cathédrale de Naar","Basilique de Naar"],"commercePrive":true,"produits":["Soupe Populaire"]}]';
var listObjets = JSON.parse(dataObjets);
var listBatiment = JSON.parse(dataBatiments);
var noImpot = ['BONS D\u0027ÉTAT / LOTERIE'];

var listMarchandage = [{value:'Aucun', label:'Aucun'}, {value:'Achat', label:'Achat'}, {value:'Vente', label:'Vente'}, {value:'AchatVente', label:'Achat & Vente'}];

// Code pour chrome (Eleonore -30207-)
var unsafeWindow;
if(window.navigator.vendor.match(/Google/)) {
	var div = document.createElement("div");
	div.setAttribute("onclick", "return window;");
	unsafeWindow = div.onclick();
} else {
	unsafeWindow = unsafeWindow;
}


/*
 * Directives pour exporter les fonctions qui doivent être accessible dans la page
 */
unsafeWindow.commonki_construction = exportFunction (commonki_construction, unsafeWindow);
unsafeWindow.changeGlobal = exportFunction (changeGlobal, unsafeWindow);
unsafeWindow.changeFraude = exportFunction (changeFraude, unsafeWindow);
unsafeWindow.changeTypeMarchandage = exportFunction (changeTypeMarchandage, unsafeWindow);
unsafeWindow.changement = exportFunction (changement, unsafeWindow);
//*/

//Stock les objets affiché
var registre = [];
/* Objets enregistrés :
  	{
		indice : ii, // Indice de l'obet
		objet : objet, // Objet (voir data)
		idInpAch : idInpAch, // id de l'input achat
		idInpVt : idInpVt, // id de l'input vente
		idInpCP : idInpCP, // id de l'input cout prod
		idInpGV : idInpGV, // id de l'input gain vente
		idInpRV : idInpRV, // id de l'input gain revente
		idInpImp : idInpImp, // id de l'input de l'impot
        idInpMarge: idInpMarge, // id de l'input de la marge
		facteurs : facteurs, // list des id des inputs des composant pour le calcul des prix de l'objet
		listeners : listeners, // list des indices des objets qui doivent être recalculé après modif de l'objet
		hasComposant: hasComposant, // objet qui a des composant
		isService : !isAchVent // objet est un service
	};
 */

var tabIdImpot = [];
/* Objets enregistrés :
	{
		nom : nomImpot, // Nom de l'impot
		idInp : idInp // id de l'input associé
	};
*/

var typeBatiment;

// 
var idInputSalaire = 'id_inp_salaire';
var idInputMarchandage = 'id_inp_marchandage';
// Bases des id utilisées pour les nouveaux input
var idInputImpo = 'id_in_imp_';
var idInputAchat = 'id_in_ach_';
var idInputVente = 'id_in_vt_';
var idInputCoutProd = 'id_in_cp_';
var idInputGainVente = 'id_in_gv_';
var idInputGainRevente = 'id_in_rv_';
var idInputMarge = 'id_in_mg_';
var idCheckFraude = 'id_inp_fraude';

var thCommerce;
var parentCommerce;
var buttonPosition;
var buttonActive;




// Lance le début du script.
init();

/**
 * ALGO:
 * 
 * Quand on arrive sur une page de KI on regarde si on trouve une node TH qui contient le mot clé commerce.
 * Si oui on ajoute un bouton dans le plus haut TR trouvé dans le tableau.
 * Le bouton déclenchera le traitemet qui va lire chaque ligne du tableau pour construire de nouvelle colonne.
 * Une fois la construction des colonnes supplémentaires on fait disparaitre le bouton.
 * 
 * 
 * Ligne de salaire on met un input avec le salaire initialisé 
 * Ligne de catégorie d'objet on met l'input d'impot initialisé (si on le trouve, si on est dans la partie jouer)
 * Ligne d'objet on sauvegarde l'objet on ajoute les cellules, et on calcul en fonction des objets déjà présent.
 * 
 * 
 * Chaque input on met des fonctions onChange, les modifications sur les input achat/vente on regarde dans le registre
 * les objets listeners de l'objet de la ligne pour leur demander de se mettre à jour.
 *  
 * Pour les impots ou le salaire, tous le monde se met à jour (plus simple).
 *  
 */


// Initialisation du script
function init() {
	// On cherche le noeud du tableau à partir duquel on va faire l'extension de
	// tableau
	var nodesTh = document.getElementsByClassName('thb');

	for (var i = 0; i < nodesTh.length; i++) {
		var node = nodesTh[i];

		if (node.firstChild != null) {
			// On prend le noeud dont la node enfant contient le mot clé
			// "COMMERCE"
			if (node.firstChild.nodeValue == "COMMERCE") {
				thCommerce = node;
				parentCommerce = thCommerce.parentNode;
					

					// On vérifie qu'il y a une caisse après le TR commerce
					var caisseNode = parentCommerce.nextSibling;
					// on vérifie la classe du premier fils au cas ou on est sur la vue cybermonde et que la piece est fermée
					if (caisseNode.firstChild.className == "ths") {
						caisseNode = caisseNode.nextSibling;
					}
					while(caisseNode != null && caisseNode.nodeName != 'IMG') {
						caisseNode = caisseNode.firstChild;
					}
					
					if (caisseNode == null || caisseNode.nodeName != 'IMG' || caisseNode.alt != 'Caisse'){
						thCommerce = null;
					}
				
			}
		}
	}
	if (thCommerce != null) {
		// trouver le tr avec le nom du batiment.  Ajoute un bouton dans ce TR pour le déclenchement du script.
		buttonPosition = parentCommerce.parentNode.firstChild.firstChild; // c'est un TR donc on Descend dans son fils pour ajouter un bouton dans un td.

		identifieTypeBatiment(buttonPosition);
		
		buttonActive = addNode(buttonPosition, "input");
		buttonActive.type = 'button';
		buttonActive.value = 'ComMonKI';
		buttonActive.setAttribute('onclick', 'commonki_construction()');
	}
	
}


function identifieTypeBatiment(buttonPosition) {
	// Test sur le type de page pour savoir où on est.
	var nomBat = "";
	if (location.toString().indexOf("main.php") !==-1 ) {
		nomBat = buttonPosition.firstChild.nodeValue;
	} else {
		// on sait que en mode cybermonde le nom du batiment est dans un h4
		nomBat = document.getElementsByTagName("h4")[0].firstChild.nodeValue;
	}
	var idxSep = nomBat.indexOf("«");
	if (idxSep == -1) {
		idxSep = nomBat.indexOf("(");
	}
	if (idxSep == -1) {
		idxSep = nomBat.length;
	}

	nomBat = nomBat.substring(0,idxSep).trim();
	
	for (var bbi = 0; bbi < listBatiment.length; bbi++) {
		curBat = listBatiment[bbi];
		for (var ni = 0; ni < curBat.noms.length; ni++) {
			if (nomBat == curBat.noms[ni]) {
				typeBatiment = curBat;
				break;
			}
		}
	}	
}


//unsafeWindow.commonki_construction = function () {
function commonki_construction() {
	

	// On aggrandi le tableau.
	var search = true;
	var cur = parentCommerce;
	while (search) {
		cur = cur.parentNode;
		if (cur == null || cur.nodeName == 'TABLE') {
			search = false;
		}
	}
	if (cur != null) {
		cur.style='';//width:480px;';
	}
	
	// Ajout d'une ligne de tableau pour le marchandage
	if (marchandageActive) {
		// créer un nouveau tr
		var nodeMarchan = document.createElement('tr');
		// on le met juste après le td caisse
		parentCommerce.parentNode.insertBefore(nodeMarchan, parentCommerce.nextSibling.nextSibling);
		// créer le tdqui va contenir le tout.
		var tdMarch = addNode(nodeMarchan, 'td');
		tdMarch.className = 'tdb';
		tdMarch.setAttribute('colspan','3');
		traitementMarchandage(tdMarch);
	}
	
	// Parcours des éléments du tableau du commerce
	var cursor = parentCommerce.nextSibling; // On est sur les TR
	while (cursor != null) {
		
		var nbChild = cursor.childNodes.length;
		if (nbChild == 0) {
			// au cas ou on tombe sur une node qui n'a pas d'enfant.
			cursor = cursor.nextSibling;
			continue;
		}
		
		var nodeName = cursor.childNodes[0].nodeName;
		var isTd = nodeName == 'TD';
		var isTh = nodeName == 'TH';
		
		if (nbChild == 2 && isTd) {
			// caisse deux child premier fils td
			traitementLigneCaisse(cursor);
		} else if (nbChild == 2 && isTh) {
			// catégorie 2 child premier = th
			traitementLigneCategorie(cursor);
		} else if (nbChild == 3) {
			// objet 3 child
			traitementLigneObjet(cursor);
		}
		// On passe au suivant
		cursor = cursor.nextSibling;
	}

	// On retire le bouton qui n'est plus utile.
	buttonPosition.removeChild(buttonActive);
} 



function traitementLigneCaisse(trCaisse) {
	// Si salaire on récupère le salaire et on met l'input.
	var td = trCaisse.childNodes[1];
	var fils = td.childNodes;
	
	var ii = fils.length - 1;
	if (ii < 0) {
		return;
	}
	
	var nodeSalaire = null;
	var chaineSalaire = '';
	var baseSalaire = 10;
	
	if (fils[ii].nodeName == 'P') {
		// on retire l'impot sur le salaire.
		td.removeChild(fils[ii]);
		// on redécale d'un cran c'est qu'on est dans les cas ou l'info sur l'impot est présente
		ii--;
	} 
	chaineSalaire = fils[ii].nodeValue;
	nodeSalaire = fils[ii];

	// On va récupérer le salaire. 
	// : 3351 ÐE - Salaire : 50 ÐE/UT
	var demDeb = {ch :':', pos : 0};
	var demFin = {ch :'/UT', pos : 0};
	demDeb.pos = chaineSalaire.lastIndexOf(demDeb.ch) + demDeb.ch.length;
	demFin.pos = chaineSalaire.indexOf(demFin.ch) - 2;
	
	baseSalaire = parseInt(chaineSalaire.substring(demDeb.pos, demFin.pos).trim());

	// remplace le texte du salaire par l'input
	nodeSalaire.nodeValue = chaineSalaire.substring(0, demDeb.pos); // debut
	var nn = addInputNode(td, idInputSalaire, baseSalaire);
	nn.setAttribute('onchange', 'changeGlobal()');
	addTextNode(td, ' ' + chaineSalaire.substring(demFin.pos));
	nn = addNode(td, 'P');
	nn = addCheckboxNode(nn, idCheckFraude, 'val', 'Fraude fiscale');
	nn.setAttribute('onchange', 'changeFraude(this.checked)');
	nn.checked = fraude;
}

function traitementMarchandage(parent) {

	var p = addNode(parent, 'P');
	addTextNode(p,'Marchandage ');
	var nn = addInputNode(p, idInputMarchandage, valeurDefautMarchandage);
	nn.setAttribute('onchange', 'changeGlobal()');
	addTextNode(p,'%');
	
	p = addNode(parent, 'P');	
	// On met les radios button de marchandage
	for (var ii = 0; ii < listMarchandage.length; ii++) {
		var mm = listMarchandage[ii];
		nn = addRadioNode(p, 'cmki_radiom_'+mm.value, mm.value, mm.label);
		nn.name='cmki_radio_marchandage';
		nn.setAttribute('onchange', 'changeTypeMarchandage(this)');
		// si le type de marchandage par defaut correspond, on met le radio checked
		if (mm.value == typeMarchandage) {
			nn.checked = true;
		}
	}

}



function traitementLigneCategorie(trCategorie) {
	// valeur par défauts
	var nomImpot = '';
	var valeurImpot = valeurDefautImpot;
	
	// Ajout des entêtes pour les nouvelles colonnes
	var node = addThNode(trCategorie, 'ths');
	addTextNode(node, "Cout");
	addNode(node, 'br');
	addTextNode(node, "prod");
	node = addThNode(trCategorie, 'ths');
	addTextNode(node, "Gain");
	addNode(node, 'br');
	addTextNode(node, "vente");
    if (gainReventeActive) {
        node = addThNode(trCategorie, 'ths');
        addTextNode(node, "Gain");
        addNode(node, 'br');
        addTextNode(node, "revente");
    }
    if (margeActive) {
        node = addThNode(trCategorie, 'ths');
        addTextNode(node, "marge");
    }
    
	var td = trCategorie.childNodes[0];
	var chaineCat = td.firstChild.nodeValue;
	var pos = chaineCat.indexOf('(');
	if (pos == -1) {
		// Cas pas d'info sur l'impot
		nomImpot = chaineCat.trim();
	} else {
		nomImpot = chaineCat.substring(0, pos-1).trim();
		// traitement base de l'impot
		
		var cValImpot = chaineCat.substring(pos);
		
		var demDeb = {ch :' ', pos : 0};
		var demFin = {ch :'%', pos : 0};
		demDeb.pos = cValImpot.lastIndexOf(demDeb.ch) + demDeb.ch.length;
		demFin.pos = cValImpot.indexOf(demFin.ch);
		valeurImpot = parseInt(cValImpot.substring(demDeb.pos, demFin.pos).trim());
	}
	td.firstChild.nodeValue = nomImpot;

	// On va vérifier qu'on mettre des impots sur cette catégorie
	for (var o = 0 ; o < noImpot.length; o++) {
		if (nomImpot == noImpot[o]) {
			// On arrête le traitement on doit pas avoir d'impot sur cette catégorie.
			return;
		}
	}
	
	// On enregistre l'impot dans le tableaux des impots.
	var cc = tabIdImpot.length;
	var idInp = idInputImpo + cc;
	tabIdImpot[cc] = {
		nom : nomImpot,
		idInp : idInp
	};

	
	var p = addNode(td, 'P');
	addTextNode(p,'Impôt vente ');
	var nn = addInputNode(p, idInp, valeurImpot);
	nn.setAttribute('onchange', 'changeGlobal()');
	addTextNode(p,'%');
}


function traitementLigneObjet(trObjet) {
	// si objet on l'enregistre et on créé les id et les cellules 
	var ii = registre.length;
	var idInpCP = idInputCoutProd + ii;
	var idInpVt = idInputVente + ii;
	var idInpGV = idInputGainVente + ii;
    var idInpMarge = null;
	var idInpAch = null;
	var idInpRV = null;
	var idInpImp = null;
	var facteurs = [];
	var listeners = [];
	
	var nomObj = trObjet.firstChild.firstChild.alt; // on sait qu'il y a une image dont l'alt est le nom de l'objet
	var objet = null;
	// On va chercher l'objet dans notre 'bibliothèque des objets'
	for (var o = 0; o < listObjets.length; o++) {
		if (listObjets[o].nom == nomObj) {
			objet = listObjets[o];
			break;
		}
	}
	if (objet == null) {
		return;
	}

	if (objet.composants != null && objet.composants.length > 0) {
		var cpFound = [];
		var produitIci = true;
	
		// Si notre objet a normalement des composants alors on va parcourirs 
		// ces composant pour les trouvers dans les objets déjà enregistré
		// si on les trouves on enregistre l'objet courant en tant que listener
		// et on récupére autant de fois que nécessaire l'id du coup de prod
		// pour les calculs concernant le cout de l'objet courant
		// MAIS on fait tout ça seulement si le commerce en cours de traitement
		// vend bien tous les composants
		for (var oo = 0; oo < objet.composants.length; oo++) {
			var compo =  objet.composants[oo];
			var objFo = null;
			
			for (var rr = 0; rr < registre.length; rr++) {
				var objRe = registre[rr];
				if (objRe.objet.nom == compo.nomObjet) {
					objFo = objRe;
					break;
				}
			}
			if (objFo == null) {
				break;
			} else {
				// Un objet trouve est associé à son composant pour la suite
				cpFound[cpFound.length] = {
						compo : compo,
						objRe : objFo
				};
			}
		}
		produitIci = isProduitIci(objet.nom);
		
		if (produitIci) {
			for (var cp = 0; cp <cpFound.length; cp++) {
				// si l'objet composant n'a pas de composant le prix doit etre  
				// calculé avec le prix d'achat de l'objet composant
				var idPrixCompo = cpFound[cp].objRe.idInpAch;
				if (cpFound[cp].objRe.hasComposant) {
					idPrixCompo = cpFound[cp].objRe.idInpCP;
				}
				for (var nb = 0; nb < cpFound[cp].compo.nombre; nb++) {
					facteurs[facteurs.length] = idPrixCompo;
				}
				cpFound[cp].objRe.listeners[cpFound[cp].objRe.listeners.length]=ii;
			}
		}
	}
	var hasComposant = facteurs.length > 0;
	
	// Récupère le prix vente/achat de l'objet
	var pPrix = trObjet.childNodes[2].firstChild;
	var chainePrix = pPrix.firstChild.nodeValue;
	pPrix.removeChild(pPrix.firstChild);

	// Si mine ou exploitation de bois
	if (chainePrix.indexOf('-') != -1) {
		return;
	}
	
	// on va déterminer s'il s'agit un objet ou d'un service au sens général.
	// Déterminé par la présence d'un prix d'achat.
	var posSep = chainePrix.indexOf('/');
	var isAchVent = posSep != -1;

	
	var prixVente = 0;
	var prixAchat = 0;
	
	// Si c'est un objet achat et vente on va récupérer les deux valeurs
	// sinon seulement la valeur de vente.
	if (isAchVent) {
		prixAchat = parseInt(chainePrix.substring(posSep + 1).trim());
	} else {
		posSep = chainePrix.length;
	}
	prixVente = parseInt(chainePrix.substring(0, posSep).trim());
	
	
	// ajout des inputs pour les prix des objets
	var nn = addInputNode(pPrix, idInpVt, prixVente);
	nn.setAttribute("onchange", "changement(" + ii + ")");
	if (isAchVent) {
		idInpAch = idInputAchat + ii;
		addTextNode(pPrix, '/');
		nn = addInputNode(pPrix, idInpAch, prixAchat);
		nn.setAttribute("onchange", "changement(" + ii + ")");
	}
	
		
	// On ajoute les cellules de tableaux avec les donnés calculée
	var tdCp = addTdNode(trObjet, 'tdb');
	var tdGv = addTdNode(trObjet, 'tdb');
    var tdGr = null;
    var tdMG = null;
    if (gainReventeActive) {
        tdGr = addTdNode(trObjet, 'tdb');
    }
    if (margeActive) {
        tdMG = addTdNode(trObjet, 'tdb');
    }
	// Puis les inputs en fonction du type d'objet
	if (hasComposant || !isAchVent) {
		addInputNode(tdCp, idInpCP, 0, true);
	}
	if (hasComposant || !isAchVent) {
		addInputNode(tdGv, idInpGV, 0, true);
	}
	if (isAchVent && gainReventeActive) {
		idInpRV = idInputGainRevente + ii;
		addInputNode(tdGr, idInpRV, 0, true);
	}
    if ((hasComposant || !isAchVent) && margeActive) {
        idInpMarge = idInputMarge + ii;
        addInputNode(tdMG, idInpMarge, 0, true);
    }

	
	// la case de l'impot c'est forcément le dernier impot enregistré.
	// on va vérifier celà dit que ca correspond et que le tableau des impots
	// n'est pas vide
	if (tabIdImpot.length > 0) {
		var im = tabIdImpot[tabIdImpot.length - 1];
		if (im.nom == objet.categorie) {
			idInpImp = im.idInp;
		}
	}
	
	// sauvegarde de l'objet, son indice, ses inputs
	registre[ii] = {
		indice : ii,
		objet : objet,
		idInpAch : idInpAch,
		idInpVt : idInpVt,
		idInpCP : idInpCP,
		idInpGV : idInpGV,
		idInpRV : idInpRV,
		idInpImp : idInpImp,
        idInpMarge: idInpMarge,
		facteurs : facteurs,
		listeners : listeners, 
		hasComposant: hasComposant,
		isService : !isAchVent
	};
	// On recalcul aussitot.
	recalcul(registre[ii]);
}


/** Fonctions d'écoute et d'action */

/**
 * Fonction déclenchée au changement de valeur de salaire ou d'impots ou de marchandage
 * Déclenche la mise à jour de tous les éléments du registre.
 */
function changeGlobal() {
	for (var i = 0; i < registre.length; i++) {
		changement(i);
	}
}

/**
 * Fonction déclenchée au changement de valeur de la checkbox sur la fraude
 * Déclenche la mise à jour de tous les éléments du registre.
 */
function changeFraude(checked) {
	fraude = checked;
	changeGlobal();
}


/**
 * Fonction déclenchée au clic sur un radio button de marchandage
 * pour changer le type de marchandage et recalculer l'ensemble
 */
function changeTypeMarchandage(radio) {
	typeMarchandage = radio.value;
	changeGlobal();
}


/**
 * Fonction appellée lors d'un changement sur un input pour que les différentes
 * données économiques soient mise à jour.
 * 
 * @param indice
 */
function changement(indice) {
	// Récupération de l'indice de l'objet modifié
	var el = registre[indice];
	// recalcul de ses données
	recalcul(el);
	// si des objets sont listeners, on les mets a jours.
	if (el.listeners == null || el.listeners.length == 0) {
		return;
	}
	for (var i = 0; i < el.listeners.length; i++) {
		recalcul(registre[parseInt(el.listeners[i])]);
	}
}


/**
 * Recalcul des données économiques d'un objet passé en paramètre
 * 
 * @param Objet
 *            objet dont on veut recalculer les données
 */
function recalcul (registree) {
	var iObj = 0;
	// Si ya une case impot on la récupère
	if (registree.idInpImp != null) {
		iObj = getEl(registree.idInpImp).value;
	}
	if (fraude) {
		iObj = iObj/2;
	}

	var marchandage = 0;
	if (marchandageActive) {
		marchandage = getEl(idInputMarchandage).value;
	}
	
	var pVente = getEl(registree.idInpVt).value;
	
	// On ajoute le marchandage
	if (isMarchandageVente()) {
		pVente = calculPourcentage(pVente, marchandage, false);
	}
	
	if (registree.idInpAch != null) {
		var pAchat = getEl(registree.idInpAch).value;
		// On ajoute le marchandage
		if (isMarchandageAchat()) {
			pAchat = calculPourcentage(pAchat, marchandage, true);
		} 
        if (gainReventeActive) {
            var grv = calculGainReVente(pVente, pAchat, iObj);
            getEl(registree.idInpRV).value = cmk_round(grv);
        }
	}
	
    
	if (registree.facteurs != null && registree.facteurs.length > 0 || registree.isService) {
		var salaire = 0;
		var nn = getEl(idInputSalaire);
		if (nn != null) {
			salaire = nn.value;
		}
		var ut = registree.objet.uniteTravail;
		var nbProd = registree.objet.produitPar;
		var tabPrixComposant = [];

		// on parcours les facteurs a additionner pour calculer le prix
		// facteurs = cout prod ou cout achat des composant
		if (registree.facteurs != null) {
			for (var i = 0; i < registree.facteurs.length; i++) {
				var idFact = registree.facteurs[i];
				var valeur = getEl(idFact).value;
				// Si le facteurs contient la base de l'id achat
				// et qu'on est en mode achat on augmente la valeur du marchandage
				if (isMarchandageAchat() && idFact.indexOf(idInputAchat) > -1) {
					valeur = calculPourcentage(valeur, marchandage, true); 
				}
				tabPrixComposant[i] = valeur;
			}
		}

		var cProd = calculCoutProd(salaire, ut, tabPrixComposant);
		// Le marchandage sur le prix de vente est déjà calculé au moment ou on récupère la valeur
		var gv = calculGainVente(pVente, cProd, nbProd, iObj);
		getEl(registree.idInpCP).value = cmk_round(cProd);
		getEl(registree.idInpGV).value = cmk_round(gv);
        
        if (margeActive) {
            // Avec le gain vente et le cout prod, on n'a la marge, avec les impots prit en compte
            var marge = calculMarge(cProd, gv, nbProd);
            getEl(registree.idInpMarge).value = cmk_round(marge)+"%";
        }
	}
}

/**
 * Retourne vrai si l'objet est produit dans le commerce
 * @param nomObjet
 * @returns {Boolean}
 */
function isProduitIci(nomObjet) {
	if (typeBatiment == null) {
		return false;
	}
	for (var ii = 0; ii < typeBatiment.produits.length; ii++) {
		if (typeBatiment.produits[ii] == nomObjet) {
			return true;
		}
	} 
	return false;
}


/**
 * Retourne sur le marchandage est en mode achat
 * @returns {Boolean}
 */
function isMarchandageAchat() {
	return (typeMarchandage == 'Achat' || typeMarchandage == 'AchatVente') && marchandageActive; 
}

/**
 * Retourne sur le marchandage est en mode vente
 * @returns {Boolean}
 */
function isMarchandageVente() {
	return (typeMarchandage == 'Vente' || typeMarchandage == 'AchatVente') && marchandageActive; 
}


/**
 * Fonction de calcul.
 */

/**
 * Calcul du gain lors d'une vente d'un produit fabriqué dans le commerce
 * 
 * @param pVente prix vente
 * @param cProd cout de production
 * @param nbProd nb produit par ut
 * @param iObj impot de l'objet
 * @returns {Number}
 */
function calculGainVente(pVente, cProd, nbProd, iObj) {
	var prix = calculPourcentage(pVente, iObj) - cProd / nbProd;
	return prix;
}

/**
 * Calcul du gain lors de la vente d'un objet revendu après achat
 * 
 * @param pVente
 *            Prix de vente
 * @param pAchat
 *            Prix d'achat
 * @param iObj
 *            Impot sur l'objet
 * @returns {Number}
 */
function calculGainReVente(pVente, pAchat, iObj) {
	var prix = pVente - pAchat;
	prix = calculPourcentage(prix, iObj);
	return prix;
}

/**
 * Calcul du pourcentage en plus ou moins d'une valeur
 * 
 * @param val
 *            valeur
 * @param pourcent
 *            pourcentage
 * @param plus
 *            booleen pour le sens
 * @returns {Number}
 */
function calculPourcentage(val, pourcent, plus) {
    if (pourcent == 0) {
        return val;
    }
    var percentOf = val * parseInt(pourcent);
    percentOf = percentOf / 100;
    percentOf = Math.round(percentOf);
    var result = val - percentOf;
    
	if (plus != null && plus) {
		result = parseInt(val) + parseInt(percentOf);
	}

	return result;
}

/**
 * Calcul la marge
 *
 * @param coutProd
 *            cout de production
 * @param gainVente
 *            gain de vente
 * @returns {Number}
 */
function calculMarge(coutProd, gainVente, nbProd) {
    var result = 0;
    if (coutProd != 0) {
        var coutProdByNb = (coutProd / nbProd);
        result = gainVente / coutProdByNb;
        result = result * 100;
    }
	return result;
}


/**
 * Calcul du cout de production d'objet
 * 
 * @param salaire
 * @param ut
 *            nombre d'unité de travail
 * @param tabPrixComposant
 *            tableau des cout de productions des composant.
 * @returns {Number}
 */
function calculCoutProd(salaire, ut, tabPrixComposant) {

	var result = salaire * ut;

	if (tabPrixComposant != null) {
		for (var i = 0; i < tabPrixComposant.length; i++) {
			result = parseInt(result) + parseInt(tabPrixComposant[i]);
		}
	}

	return result;
}

/**
 * Fonction d'arrondi
 * @param cc nombre a arrondir
 * @returns {Number} nombre arrondi a 1 chiffre après la virgule
 */
function cmk_round(cc) {
	return Math.round(cc*10)/10;
}


/**
 * Fonctions utilitaires Création de node, ajout de node. etc.
 *  *
 */

// raccourci
function getEl(id) {
	return window.document.getElementById(id);
}

/**
 * Fonction de base pour ajouter un noeud d'un type
 * 
 * @param NodeParent
 *            parent
 * @param typeNode
 *            type de noeud
 * @returns noeud créé
 */
function addNode(NodeParent, typeNode) {
	var node = document.createElement(typeNode);
	NodeParent.appendChild(node);
	return node;
}

/**
 * Ajout d'une node input radio avec label associé
 * @param NodeParent parend
 * @param id id du radio
 * @param valeur valeur 
 * @param label label, si vide pas de label
 */
function addRadioNode(NodeParent, id, valeur, label) {
	var node = addNode(NodeParent, "input");
	node.id = id;
	node.value = valeur;
	node.type = 'radio';
	if (label != null && label.length > 0) {
		var nodelabel = addNode(NodeParent, 'label');
		nodelabel.setAttribute('for', id);
		addTextNode(nodelabel, label);
	}
	return node;
}

/**
 * Ajout d'une node input checkbox avec label associé
 * @param NodeParent parend
 * @param id id du radio
 * @param valeur valeur 
 * @param label label, si vide pas de label
 */
function addCheckboxNode(NodeParent, id, valeur, label) {
	var node = addNode(NodeParent, "input");
	node.id = id;
	node.value = valeur;
	node.type = 'checkbox';
	if (label != null && label.length > 0) {
		var nodelabel = addNode(NodeParent, 'label');
		nodelabel.setAttribute('for', id);
		addTextNode(nodelabel, label);
	}
	return node;
}

/**
 * Ajout d'une node input text
 * 
 * @param NodeParent parent
 * @param id du noeud
 * @param valeur valeur
 * @param readO readonly
 */
function addInputNode(NodeParent, id, valeur, readO) {
	var node = addNode(NodeParent, "input");
	node.type = 'text';
	node.id = id;
	node.value = valeur;
	node.style='width: 45px; text-align: right;';
	
	if (readO != null) {
		node.disabled = readO;
	}
	return node;
}

function addThNode(NodeParent, className) {
	var node = addNode(NodeParent, "th");
	node.className = className;
	return node;
}

function addTdNode(NodeParent, className) {
	var node = addNode(NodeParent, "td");
	node.className = className;
	node.style='text-align: center;';
	return node;
}

function addTextNode(NodeParent, text) {
	var node = document.createTextNode(text);
	NodeParent.appendChild(node);
}