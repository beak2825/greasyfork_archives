// ==UserScript==
// @name       AstroPad
// @version    0.28.11
// @description:en 1
// @grant      unsafeWindow
// @grant      GM_xmlhttpRequest
// @grant      GM.xmlHttpRequest
// @connect    astropad.sunsky.fr
// @match      http://mush.vg/*
// @match      http://mush.vg/#
// @match      http://mush.twinoid.com/*
// @match      http://mush.twinoid.com/#
// @match      http://mush.twinoid.es/*
// @match      http://mush.twinoid.es/#
// @require    https://code.jquery.com/jquery-2.2.1.min.js
// @require    https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @copyright  2012+, Sunsky (inspiration Skildor's scripts), compatibility with Firefox 32+ by badconker, update by LAbare
// @namespace https://greasyfork.org/users/162546
// @description 1
// @downloadURL https://update.greasyfork.org/scripts/36220/AstroPad.user.js
// @updateURL https://update.greasyfork.org/scripts/36220/AstroPad.meta.js
// ==/UserScript==


var console = unsafeWindow.console;
var localStorage = unsafeWindow.localStorage;
var Main = unsafeWindow.Main;

Main.AstroPad = createObjectIn(unsafeWindow.Main, { defineAs: 'AstroPad' });

Main.AstroPad.version = GM.info.script.version || "0.28.5"; //For use by other scripts
Main.AstroPad.urlAstro = "http://astropad.sunsky.fr/api.py";
Main.AstroPad.heronames = ['Jin Su', 'Frieda', 'Kuan Ti', 'Janice', 'Roland', 'Hua', 'Paola', 'Chao', 'Finola', 'Stephen', 'Ian', 'Chun', 'Raluca', 'Gioele', 'Eleesha', 'Terrence', 'Derek', 'Andie'];
Main.AstroPad.heronames[-1] = "?";
Main.AstroPad.items = [];


if (window.location.href.indexOf('mush.twinoid.com') != -1) {
	Main.AstroPad.language = 'en';
	Main.AstroPad.lang = 2;
	Main.AstroPad.urlMush = "mush.twinoid.com";
	Main.AstroPad.roomNames = ['Bridge', 'Alpha Bay', 'Bravo Bay', 'Alpha Bay 2', 'Nexus', 'Medlab', 'Laboratory', 'Refectory', 'Hydroponic Garden', 'Engine Room',
		'Front Alpha Turret', 'Centre Alpha Turret', 'Rear Alpha Turret', 'Front Bravo Turret', 'Centre Bravo Turret', 'Rear Bravo Turret',
		'Patrol Ship Tomorrowland', 'Patrol Ship Olive Grove', 'Patrol Ship Yasmin', 'Patrol Ship Wolf', 'Patrol Ship E-Street', 'Patrol Ship Eponine', 'Patrol Ship Carpe Diem', 'Pasiphae',
		'Front Corridor', 'Central Corridor', 'Rear Corridor', 'Planet', 'Icarus Bay', 'Alpha Dorm', 'Bravo Dorm',
		'Front Storage', 'Centre Alpha Storage', 'Rear Alpha Storage', 'Centre Bravo Storage', 'Rear Bravo Storage', 'Outer Space', 'Limbo'];
	Main.AstroPad.roomOrder = [1, 3, 29, 2, 30, 0, 25, 32, 11, 34, 14, 9, 10, 13, 24, 31, 8, 28, 6, 5, 4, 36, 23, 22, 20, 21, 17, 16, 19, 18, 27, 33, 12, 35, 15, 26, 7];
	Main.AstroPad.physicalDiseases = ["Acid Reflux", "Black Bite", "Cat Allergy", "Cold", "Extreme Tinnitus", "Flu", "Food Poisoning", "Fungic Infection", "Gastroenteritis", "Junkbumpkinitis", "Migraine", "Mush allergy", "Rejuvenation", "Rubella", "Sepsis", "Sinus Storm", "Skin Inflammation", "Slight Nausea", "Smallpox", "Space Rabies", "Syphilis", "Tapeworm", "Vitamin Deficiency"];
	Main.AstroPad.psychologicalDiseases = ["Agoraphobia", "Ailurophobia", "Chronic Vertigo", "Crabism", "Coprolalia", "Chronic Migraine", "Depression", "Paranoia", "Psychotic Episodes", "Spleen", "Vertigo", "Weapon Phobia"];

	Main.AstroPad.txt = {
		desc: "Inventory Manager developed by Sunsky.",
		camera: "Installed camera",
		drone: "Drone",
		intoxRegExp: /Food Poisoning/,
		broken: "Broken",
		frozen: "Frozen",
		unstable: "Unstable",
		hazardous: "Hazardous",
		decaying: "Decomposing",
		charges: "charge(s)",
		effect: "Effect",
		effect2: "the effect",
		curesTip: /Cures?|cures?|curing/,
		curesText: "Cures",
		causesTip: /Causes?|causes?|causing/,
		causesText: "Causes",
		delayRegExp: /within ([0-9]+) to ([0-9]+) cycles/,
		chancesRegExp: /([0-9]+)\s*% chance (:|of)/,
		chef: "Chef",
		botanist: "Botanist",
		satisfaction: "satisfaction",
		thirsty: "thirsty",
		dry: "dry",
		diseased: "diseased",
		cycles: "cycles",

		by: "by",
		the: "the",
		at: "at",
		empty: "Void",
		inventory: "INVENTORY",
		submit: "Synchronize",
		refresh: "Refresh",
		list: "Text Format",
		show: "Show",
		help: "Help",
		newPad: "New",
		exit: "Exit",

		astromodTitle: "Altering AstroPad data",
		itemChoice: "Choose an item:",
		itemCatMisc: "Miscellaneous",
		itemCatTools: "Tools",
		itemCatWeaponry: "Weapons",
		itemCatDocuments: "Documents",
		itemCatFood: "Food",
		itemCatPlants: "Plants",
		itemCatHealth: "Health",
		itemCatExpedition: "Expedition",
		itemCatAlien: "Artefacts",
		defaultItem: "Item",
		addItem: "Add an item",
		sendAstromod: "Share",
		cancelAstromod: "Cancel",
		accessAstromod: "Alter",

		changeProperties: "Change properties",
		propertyTitle: "Item properties:",
		foodEffects: "Food effects:",
		addEffect: "Add an effect:",
		defaultProperties: "Original/default properties",
		applyProperties: "Apply properties",
		propertyAP: "Action points",
		propertyMP: "Movement points",
		propertyHP: "Health points",
		propertyMoral: "Moral",
		propertyChances: "Chances:",
		propertyDelay: "Delay:",
		propertyTo: "to",
		propertyPlant: "Plant:",
		propertyFoodState: "Food state:",
		propertyPhysical: "Physical",
		propertyPsychological: "Psychological",

		titleTxtInventory: "Rooms to share:",
		checkAll: "Check all",
		uncheckAll: "Uncheck All",
		generateTxtInventory: "Generate text inventory",

		updateEffect: "Do you want to update the effects ?\n\n(Cancel = update but without the effects)",
		greetShareMessage: "Here is the text that you should send to your teammates in order to share your AstroPad.",
		greetShareMessage2: "You may set a text for a link by putting it between square brackets right after the link, without spaces. For example, \"http://mush.vg?astroId=XXX&astroKey=YYY[Ship inventory]\" will return <a href='#'>Ship inventory</a>.",
		defaultShareMessage: "Hi! I suggest we use the AstroPad to keep our inventory updated.\nYou may install it from this topic: //%t//\nJoin this game's inventory by following this link: //%u//\nTo see the map, follow this link: //%v//\nThanks!",
		linkPad: "[Pad]",
		linkMap: "[Map]",
		helpTopic: "http://twd.io/e/WhgQ0M/0", //Topic explaining how to install the script
		changeShareMessage: "Change default message",
		helpShareMessage: "You can use the following expressions:<ul><li><b>%t</b> will be replaced by a link to the topic explaining how to install the script;</li><li><b>%u</b> will be replaced by the link to add the AstroPad;</li><li><b>%v</b> will be replaced by the link to the map of the AstroPad.</li></ul><br />A link directly followed by a text between square brackets, without spaces, will be replaced by that text.",
		saveShareMessage: "Save",
		link: "Do you want to bind Astropad #%1 (which key is %2) to this game?",
		unlink: "Do you really want to delete the link between AstroPad #%1 and this game?\nIf you lose the Astropad Key, you cannot get it back.",
		newShip: "It seems you are in a new game. Don't forget to create a new AstroPad!",
		loading: "Loading…",
		credits: "AstroPad v." + Main.AstroPad.version + " — Original sin by Sunsky, passed on by badconker and LAbare.",
		foodNote: "Note: Food effects shared by a specialist are kept in memory for the whole ship. The AstroPad cannot reveal a Mush in any way.",
		allFoodEffectsTitle: "Known food effects",
		allFoodEffectsButton: "Share known food effects",
	};
}
else if (window.location.href.indexOf('mush.twinoid.es') != -1) {
	Main.AstroPad.language = 'es';
	Main.AstroPad.lang = 3;
	Main.AstroPad.urlMush = "mush.twinoid.es";
	Main.AstroPad.roomNames = ['Puente de mando', 'Plataforma Alpha', 'Plataforma Beta', 'Plataforma Alpha 2', 'Nexus', 'Enfermería', 'Laboratorio', 'Comedor', 'Jardín Hidropónico', 'Sala de motores',
		'Cañón Alpha delantero', 'Cañón Alpha central', 'Cañón Alpha trasero', 'Cañón Beta delantero', 'Cañón Beta central', 'Cañón Beta trasero',
		'Patrullero Longane', 'Patrullero Jujube', 'Patrullero Tamarindo', 'Patrullero Sócrates', 'Patrullero Epicuro', 'Patrullero Platón', 'Patrullero Wallis', 'Pasiphae',
		'Pasillo delantero', 'Pasillo central', 'Pasillo trasero', 'Planeta', 'Icarus', 'Dormitorio Alpha', 'Dormitorio Beta',
		'Almacén delantero', 'Almacén Alpha central', 'Almacén Alpha trasero', 'Almacén Beta central', 'Almacén Beta trasero', 'Espacio infinito', 'El limbo'];
	Main.AstroPad.roomOrder = [32, 33, 34, 35, 31, 11, 10, 12, 14, 13, 15, 7, 29, 30, 5, 36, 28, 8, 6, 4, 25, 24, 26, 23, 20, 17, 16, 21, 19, 18, 22, 27, 1, 3, 2, 0, 9];
	Main.AstroPad.physicalDiseases = ["Alergia a los gatos", "Alergia al Mush", "Carencia de vitaminas", "Citroiditis", "Enverdecimiento", "Erupción cutánea", "Gastroenteritis", "Gripe", "Infección aguda", "Infección fúngica", "Intoxicación alimentaria", "Migraña", "Mordida negra", "Náusea Ligera", "Rabia espacial", "Reflujos gástricos", "Resfrío", "Rubéola", "Sífilis", "Solitaria", "Tormenta sinusal", "Virulea", "Zumbido extremo"];
	Main.AstroPad.psychologicalDiseases = ["Acceso psicótico", "Agorafobia", "Ailurofobia", "Bazo", "Coprolalia", "Crabismo", "Crisis de paranoia", "Depresión", "Mareo", "Mareo crónico", "Migraña crónica", "Temor a las armas"];

	Main.AstroPad.txt = {
		desc: "Gestor de inventario desarrollado por Sunsky. Traducción xxbrut0xx y Guilherande.",
		camera: "Cámara instalada",
		drone: "Dron",
		intoxRegExp: /Intoxicación alimentaria/,
		broken: "Roto",
		frozen: "Congelado",
		unstable: "Sospechosa",
		hazardous: "Nociva",
		decaying: "Toxica",
		charges: "carga(s)",
		effect: "Efectos",
		effect2: "los efectos",
		curesTip: /(Curar?|curar?) (la enfermedad)?/,
		curesText: "Cura",
		causesTip: /(Provocar?|provocar?) la enfermedad/,
		causesText: "Provoca",
		delayRegExp: /en un plazo de ([0-9]+) a ([0-9]+) ciclos/,
		chancesRegExp: /([0-9]+)\s*% de probabilidades\s*:/,
		chef: "Chef",
		botanist: "Botanista",
		satisfaction: "saciedad",
		thirsty: "sedienta",
		dry: "seca",
		diseased: "enferma",
		cycles: "ciclos",

		by: "por",
		the: "el",
		at: "a las",
		empty: "Vacío",
		inventory: "INVENTARIO",
		submit: "Sincronizar",
		refresh: "Actualizar",
		list: "Formato Texto",
		show: "Visualizar",
		help: "Ayuda",
		newPad: "Nuevo",
		exit: "Quitar",

		astromodTitle: "Modificación del AstroPad",
		itemChoice: "Elijan un item:",
		itemCatMisc: "Variado",
		itemCatTools: "Herramientas",
		itemCatWeaponry: "Armas",
		itemCatDocuments: "Documentos",
		itemCatFood: "Comida",
		itemCatPlants: "Plantas",
		itemCatHealth: "Salud",
		itemCatExpedition: "Expedición",
		itemCatAlien: "Artefactos",
		defaultItem: "Item",
		addItem: "Añadir un item",
		sendAstromod: "Compartir",
		cancelAstromod: "Cancelar",
		accessAstromod: "Modificar",

		changeProperties: "Modificar los atributos",
		propertyTitle: "Atributos del item:",
		foodEffects: "Efectos nutritivos:",
		addEffect: "Añadir un efecto:",
		defaultProperties: "Atributos originales/por defecto",
		propertyAP: "Puntos de acción",
		propertyMP: "Puntos de movimiento",
		propertyHP: "Puntos de vida",
		propertyMoral: "Ánimo",
		applyProperties: "Asignar los atributos",
		propertyChances: "Probabilidad:",
		propertyDelay: "Plazo:",
		propertyTo: "a",
		propertyPlant: "Planta:",
		propertyFoodState: "Caducidad:",
		propertyPhysical: "Física",
		propertyPsychological: "Psicológica",
		
		titleTxtInventory: "Cuartos para compartir:",
		checkAll: "Seleccionar todo",
		uncheckAll: "Deseleccionar todo",
		generateTxtInventory: "Generar texto de inventario",

		updateEffect: "¿Desea actualizar los efectos? \n\n (Cancelar = actualizadas pero sin los efectos)",
		greetShareMessage: "Aqui está la prueba a ofrecer a vuestros compañeros de equipo para compartir vuestro AstroPad.",
		greetShareMessage2: "You may set a text for a link by putting it between square brackets right after the link, without spaces. For example, \"http://mush.vg?astroId=XXX&astroKey=YYY[Ship inventory]\" will return <a href='#'>Ship inventory</a>.",
		defaultShareMessage: "¡Hola! Le sugiero usar AstroPad para el inventario.\nPara instalar el script, lea este tema : //%t//\nPara añadir este astropad, siga este enlace: //%u//\nPara ver el mapa, siga este enlace : //%v//\n¡Gracias!",
		linkPad: "[AstroPad]",
		linkMap: "[Mapa]",
		helpTopic: "http://twd.io/e/VNgQ0M/0",
		changeShareMessage: "Modificar el mensaje por defecto",
		helpShareMessage: "Puede itilizar las expresiones siguientes:<br /><ul><li><b>%t</b> será reemplazado por el enlace hacia el tópico explicando como instalar el script;</li><li><b>%u</b> será reemplazado por el enlace para añadir el AstroPad;</li><li><b>%v</b> será reemplazado por el enlace hacia la mapa del AstroPad.</li></ul><br />A link directly followed by a text between square brackets, without spaces, will be replaced by that text.",
		saveShareMessage: "Registrar",
		link: "¿Deseas vincular el AstroPad n°%1 (cuya clave es %2) a la partida?",
		unlink: "¿Estás seguro que quieres eliminar el enlace entre el AstroPad n°%1 y la partida ?\nSi pierde la clave relativa a su partida, no será capaz de encontrarla.",
		newShip: "Parece que usted comenzó una nueva partida. ¡Considere la creación de un nuevo AstroPad!",
		loading: "Cargando…",
		credits: "AstroPad v." + Main.AstroPad.version + " — Pecado original por Sunsky, transmitido por badconker y LAbare.",
		foodNote: "Nota: los efectos nutritivos compartidos por un especialista se quedarán en memoria para todo la nave. AstroPad no permite en ningún caso detectar Mush.",
		allFoodEffectsTitle: "Efectos nutritivos conocidos",
		allFoodEffectsButton: "Compartir los efectos nutritivos conocidos",
	};
}
else {
	Main.AstroPad.language = '';
	Main.AstroPad.lang = 1;
	Main.AstroPad.urlMush = "mush.vg";
	Main.AstroPad.roomNames = ['Pont', 'Baie Alpha', 'Baie Beta', 'Baie Alpha 2', 'Nexus', 'Infirmerie', 'Laboratoire', 'Réfectoire', 'Jardin Hydroponique', 'Salle des moteurs',
		'Tourelle Alpha avant', 'Tourelle Alpha centre', 'Tourelle Alpha arrière', 'Tourelle Beta avant', 'Tourelle Beta centre', 'Tourelle Beta arrière',
		'Patrouilleur Longane', 'Patrouilleur Jujube', 'Patrouilleur Tamarin', 'Patrouilleur Socrate', 'Patrouilleur Epicure', 'Patrouilleur Planton', 'Patrouilleur Wallis', 'Pasiphae',
		'Couloir avant', 'Couloir central', 'Couloir arrière', 'Planète', 'Baie Icarus', 'Dortoir Alpha', 'Dortoir Beta',
		'Stockage Avant', 'Stockage Alpha centre', 'Stockage Alpha arrière', 'Stockage Beta centre', 'Stockage Beta arrière', 'Espace infini', 'Les Limbes'];
	Main.AstroPad.roomOrder = [1, 3, 2, 28, 26, 24, 25, 29, 30, 36, 5, 8, 6, 4, 23, 20, 17, 16, 21, 19, 18, 22, 27, 0, 7, 9, 33, 32, 31, 35, 34, 12, 10, 11, 15, 13, 14];
	Main.AstroPad.physicalDiseases = ["Acouphènes Extrême", "Allergie au chat", "Allergie au mush", "Carence en vitamines", "Citrouillite", "Éruption cutanée", "Gastro Entérite", "Grippe", "Infection aïgue", "Infection fongique", "Intoxication alimentaire", "Migraine", "Morsure Noire", "Nausée légère", "Rage spatiale", "Reflux Gastriques", "Rhume", "Rubéole", "Syphilis", "Tempête sinusale", "Variole", "Verdoiement", "Vers Solitaire"];
	Main.AstroPad.psychologicalDiseases = ["Agoraphobie", "Ailurophobie", "Coprolalie", "Crabisme", "Crise Paranoïaque", "Dépression", "Episodes Psychotiques", "Migraine chronique", "Phobie des armes", "Spleen", "Vertige", "Vertige chronique"];

	Main.AstroPad.txt = {
		desc: "Gestionnaire d'inventaire développé par Sunsky.",
		camera: "Caméra installée",
		drone: "Drone",
		intoxRegExp: /Intoxication Alimentaire/,
		broken: "Cassé(e)",
		frozen: "Congelé",
		unstable: "Instable",
		hazardous: "Avariée",
		decaying: "Décomposée",
		charges: "charge(s)",
		effect: "Effets",
		effect2: "les effets",
		curesTip: /(Guérie|guérir) (la maladie)?/,
		curesText: "Guérit",
		causesTip: /(Provoquer?|provoquer?|Donner?|donner?) la maladie/,
		causesText: "Provoque",
		delayRegExp: /dans un délai de ([0-9]+) à ([0-9]+) cycle/,
		chancesRegExp: /([0-9]+)\s*% de chances (:|de)/,
		chef: "Cuistot",
		botanist: "Botaniste",
		satisfaction: "satiété",
		thirsty: "assoiffé",
		dry: "desséché",
		diseased: "malade",
		cycles: "cycles",

		by: "par",
		the: "le",
		at: "à",
		empty: "Vide",
		inventory: "INVENTAIRE",
		submit: "Synchroniser",
		refresh: "Rafraîchir",
		list: "Format texte",
		show: "Visualiser",
		help: "Aide",
		newPad: "Nouveau",
		exit: "Quitter",

		astromodTitle: "Modification de l'AstroPad",
		itemChoice: "Choix d'item :",
		itemCatMisc: "Vrac",
		itemCatTools: "Outils",
		itemCatWeaponry: "Armes",
		itemCatDocuments: "Documents",
		itemCatFood: "Nourriture",
		itemCatPlants: "Plantes",
		itemCatHealth: "Santé",
		itemCatExpedition: "Expédition",
		itemCatAlien: "Artefacts",
		defaultItem: "Item",
		addItem: "Ajouter un item",
		sendAstromod: "Partager",
		cancelAstromod: "Annuler",
		accessAstromod: "Modifier",

		changeProperties: "Modifier les attributs",
		propertyTitle: "Attributs de l'item :",
		foodEffects: "Effets nutritifs :",
		addEffect: "Ajouter un effet :",
		defaultProperties: "Attributs originaux/par défaut",
		applyProperties: "Affecter ces attributs",
		propertyAP: "Points d'action",
		propertyMP: "Points de mouvement",
		propertyHP: "Points de vie",
		propertyMoral: "Moral",
		propertyChances: "Probabilité :",
		propertyDelay: "Délai :",
		propertyTo: "à",
		propertyPlant: "Plante :",
		propertyFoodState: "Péremption :",
		propertyPhysical: "Physiologique",
		propertyPsychological: "Psychologique",
	
		titleTxtInventory: "Salles à partager :",
		checkAll: "Tout cocher",
		uncheckAll: "Tout décocher",
		generateTxtInventory: "Générer l'inventaire texte",

		updateEffect: "Voulez-vous mettre à jour les effets ?\n\n(Annuler = mise à jour quand même mais sans les effets)",
		greetShareMessage: "Voici le texte à fournir à vos coéquipiers pour partager votre AstroPad.",
		greetShareMessage2: "Vous pouvez assigner un texte à un lien en le mettant entre crochets juste ensuite, sans espace. Par exemple, \"http://mush.vg?astroId=XXX&astroKey=YYY[Inventaire du vaisseau]\" donnera <a href='#'>Inventaire du vaisseau</a>.",
		defaultShareMessage: "Bonjour ! Je vous propose d'utiliser l'AstroPad pour l'inventaire.\nPour installer le script, lisez ce topic : //%t//\nPour ajouter cet astropad, suivez ce lien : //%u//\nPour voir la carte, suivez ce lien : //%v//\nMerci !",
		linkPad: "[AstroPad]",
		linkMap: "[Carte]",
		helpTopic: "http://twd.io/e/UxgQ0M/0",
		changeShareMessage: "Modifier le message par défaut",
		helpShareMessage: "Vous pouvez utiliser les expressions suivantes :<br /><ul><li><b>%t</b> sera remplacé par le lien vers le topic expliquant comment installer le script ;</li><li><b>%u</b> sera remplacé par le lien d'ajout de l'AstroPad ;</li><li><b>%v</b> sera remplacé par le lien vers la carte de l'AstroPad.</li></ul><br />Un lien directement suivi d'un texte entre crochets, sans espace, sera remplacé par ce texte.",
		saveShareMessage: "Sauvegarder",
		link: "Voulez-vous lier l'AstroPad n°%1 (dont la clé est %2) à cette partie ?",
		unlink: "Voulez-vous vraiment supprimer le lien entre l'AstroPad n°%1 et cette partie ?\nSi vous perdez la clé relative à votre partie, vous ne serez plus en mesure de la retrouver.",
		newShip: "Il semblerait que vous ayiez commencé une nouvelle partie. Pensez à recréer un AstroPad !",
		loading: "Chargement en cours…",
		credits: "AstroPad v." + Main.AstroPad.version + " — Péché originel par Sunsky, transmis par badconker et LAbare.",
		foodNote: "Note : Les effets nutritifs partagés par un spécialiste restent en mémoire pour tout le vaisseau. L'AstroPad ne permet en aucun cas de détecter un Mush.",
		allFoodEffectsTitle: "Effets nutritifs connus",
		allFoodEffectsButton: "Partager les effets nutritifs connus",
	};
}

Main.AstroPad.allItems = {
	//id: ["category", "French name", "English name", "Spanish name", { default food effects or empty }, "food type ('pill', 'food' or 'fruit') for canRead*() or empty"]
	super_map: ["alien", "Morceau de carte stellaire", "Starmap Fragment", "Trozo de Mapa Estelar", {}, ""], alien_holographic_tv: ["alien", "Télé Holographique alien", "Alien Holographic TV", "Televisión Alien", {}, ""], alien_oil: ["alien", "Lubrifiant Alien", "Jar of Alien Oil", "Lubricante Alien", {}, ""], computer_jelly: ["alien", "Gelée à Circuits Imprimés", "Printed Circuit Jelly", "Pomada Refrescante", {}, ""], insectoid_shell: ["alien", "Cartouche Invertébré", "Invertebrate Shell", "Proyectil Invertebrado", {}, ""], magellan_liquid_map: ["alien", "Carte Liquide de Magellan", "Magellan Liquid Map", "Mapa Líquido de Magallanes", {}, ""], water_stick: ["alien", "Batonnet Aqueux", "Water Stick", "Barrilla acuosa", {}, ""], 

	document: ["documents", "Document", "Document", "Documento", {}, ""], postit: ["documents", "Pense-Bête", "Post-it", "Taco de post-it", {}, ""], postit_bloc: ["documents", "Bloc de Pense-Bête", "Block of Post-it Notes", "Bloc de Notas", {}, ""], blueprint_0: ["documents", "Plan du Casque de Visée", "Blueprint: Sniper Helmet", "Plano: Casco de tiro", {}, ""], blueprint_1: ["documents", "Plan du Drapeau Blanc", "Blueprint: White Flag", "Plano: Bandera blanca", {}, ""], blueprint_2: ["documents", "Plan du Drone de Soutien", "Blueprint: Support Drone", "Plano: Dron de apoyo", {}, ""], blueprint_3: ["documents", "Plan de l'EchoLocateur", "Blueprint: EchoLocator", "Plano: Eco-Localizador", {}, ""], blueprint_4: ["documents", "Plan de l'Extincteur", "Blueprint: Extinguisher", "Plano: Extintor", {}, ""], blueprint_5: ["documents", "Plan de la Grenade", "Blueprint: Grenade", "Plano: Granada", {}, ""], blueprint_6: ["documents", "Plan du Lance-Roquette", "Blueprint: Rocket Launcher", "Plano: Lanza-misiles", {}, ""], blueprint_7: ["documents", "Plan du Lizaro Jungle", "Blueprint: Lizaro Jungle", "Plano: Lizaro Jungle", {}, ""], blueprint_8: ["documents", "Plan du Module Babel", "Blueprint: Babel Module", "Plano: Módulo Babel", {}, ""], blueprint_9: ["documents", "Plan du Sofa Suédois", "Blueprint: Swedish Sofa", "Plano: Sofá sueco", {}, ""], blueprint_10: ["documents", "Plan de la Sulfateuse", "Blueprint: Old Faithful", "Plano: Sulfatosa", {}, ""], blueprint_11: ["documents", "Plan du ThermoSenseur", "Blueprint: Thermosensor", "Plano: TermoSensor", {}, ""], blueprint_12: ["documents", "Plan du Vaguoscope", "Blueprint: Oscilloscope", "Plano: Olascopio", {}, ""], book_0: ["documents", "Apprentron : Astrophysicien", "Mage Book : Astrophysicist", "Librotron : Astrofísico", {}, ""], book_1: ["documents", "Apprentron : Biologiste", "Mage Book : Biologist", "Librotron : Biólogo", {}, ""], book_2: ["documents", "Apprentron : Botaniste", "Mage Book : Botanist", "Librotron : Botánico", {}, ""], book_3: ["documents", "Apprentron : Cuistot", "Mage Book : Chef", "Librotron : Chef", {}, ""], book_4: ["documents", "Apprentron : Diplomatie", "Mage Book : Diplomat", "Librotron : Diplomático", {}, ""], book_5: ["documents", "Apprentron : Expert radio", "Mage Book : Radio Expert", "Librotron : Experto en comunicaciones", {}, ""], book_6: ["documents", "Apprentron : Informaticien", "Mage Book : IT Expert", "Librotron : Informático", {}, ""], book_7: ["documents", "Apprentron : Logistique", "Mage Book : Logistics Expert", "Librotron : Logística", {}, ""], book_8: ["documents", "Apprentron : Médecin", "Mage Book : Medic", "Librotron : Médico", {}, ""], book_9: ["documents", "Apprentron : Pilote", "Mage Book : Pilot", "Librotron : Piloto", {}, ""], book_10: ["documents", "Apprentron : Pompier", "Mage Book : Firefighter", "Librotron : Bombero", {}, ""], book_11: ["documents", "Apprentron : Psy", "Shrink Mage Book", "Librotron : Psicólogo", {}, ""], book_12: ["documents", "Apprentron : Robotiques", "Robotics Expert Mage Book", "Librotron : Ing. Robótico", {}, ""], book_13: ["documents", "Apprentron : Sprinter", "Mage Book : Sprinter", "Librotron : Velocista", {}, ""], book_14: ["documents", "Apprentron : Technicien", "Mage Book : Technician", "Librotron : Técnico", {}, ""], book_15: ["documents", "Apprentron : Tireur", "Mage Book : Shooter", "Librotron : Artillero", {}, ""], book_16: ["documents", "De la Recherche sur le Mush.", "Mush Research Review", "Estudio sobre los Mush.", {}, ""], book_17: ["documents", "Manuel du commandant", "Commander's Manual", "Manual del Comandante", {}, ""], 

	space_suit: ["expedition", "Combinaison", "Spacesuit", "Traje espacial", {}, ""], driller: ["expedition", "Foreuse", "Drill", "Taladro", {}, ""], quad_compass: ["expedition", "Boussole quadrimetric", "Quadrimetric Compass", "Brújula Cuadrimétrica", {}, ""], rope: ["expedition", "Corde", "Rope", "Cuerda", {}, ""], echo_sounder: ["expedition", "EchoLocateur", "EchoLocator", "Eco-Localizador", {}, ""], heat_seeker: ["expedition", "ThermoSenseur", "Thermosensor", "TermoSensor", {}, ""], trad_module: ["expedition", "Module Babel", "Babel Module", "Módulo Babel", {}, ""], white_flag: ["expedition", "Drapeau blanc", "White Flag", "Bandera blanca", {}, ""], 

	ration_5: ["food", "Steack alien", "Alien Steak", "Bistec Alien", { foodEffects: [{ type: 'pa', value: 4 }, { type: 'moral', value: -1 }, { type: 'satisfaction', value: 4 }, { type: 'causes', value: ["", "Reflux Gastriques", "Acid Reflux", "Reflujos gástricos"][Main.AstroPad.lang], chances: 50, delay: '4-8' }, { type: 'causes', value: ["", "Vers Solitaire", "Tapeworm", "Solitaria"][Main.AstroPad.lang], chances: 25, delay: '4-8' }] }, "food"], ration_0: ["food", "Ration standard", "Standard Ration", "Ración Estándar", { foodEffects: [{ type: 'pa', value: 4 }, { type: 'moral', value: -1 }, { type: 'satisfaction', value: 4 }] }, "food"], ration_1: ["food", "Ration cuisinée", "Cooked Ration", "Ración Cocinada", { foodEffects: [{ type: 'pa', value: 4 }, { type: 'satisfaction', value: 4 }] }, "food"], ration_7: ["food", "Café", "Coffee", "Café", { foodEffects: [{ type: 'pa', value: 2 }] }, "food"], ration_2: ["food", "Riz soufflé proactif", "Proactive Puffed Rice", "Cereal Proactivo", { foodEffects: [{ type: 'pa', value: 10 }, { type: 'satisfaction', value: 5 }] }, "all"], ration_3: ["food", "Patate spatiale", "Space Potato", "Patata Espacial", { foodEffects: [{ type: 'pa', value: 8 }, { type: 'satisfaction', value: 8 }] }, "all"], ration_4: ["food", "Barre de Lombrics", "Lombrick Bar", "Barra de Lombrices", { foodEffects: [{ type: 'pa', value: 6 }, { type: 'moral', value: 2 }, { type: 'satisfaction', value: 8 }] }, "all"], ration_8: ["food", "Barre Supravitaminée", "SuperVitamin Bar", "Barra Supervitaminada", { foodEffects: [{ type: 'pa', value: 8 }, { type: 'pm', value: 4 }, { type: 'satisfaction', value: 6 }, { type: 'causes', value: ["", "Nausée légère", "Slight Nausea", "Náusea Ligera"][Main.AstroPad.lang], chances: 55 }] }, "all"], coffee_thermos: ["food", "Thermos de Café", "Thermos of Coffee", "Termo con Café", { charges: 4 }, ""], lunchbox: ["food", "Panier Repas", "Lunchbox", "Canasta de comida", { charges: 3 }, ""], ration_9: ["food", "Déchets Organiques", "Organic Waste", "Desechos orgánicos", { foodEffects: [{ type: 'pa', value: 6 }, { type: 'moral', value: -4 }, { type: 'satisfaction', value: 16 }] }, "food"], 

	bandage: ["health", "Bandage", "Bandage", "Vendaje", {}, ""], medikit: ["health", "Médikit", "Medikit", "Medikit", {}, ""], pill_box: ["health", "Kit de survie", "Survival Kit", "Kit de supervivencia", { charges: 3 }, ""], drug_0: ["health", "Twïnoid", "Twinoid", "Twinoid", {}, "pill"], drug_1: ["health", "Xenox", "Xenox", "Xenox", {}, "pill"], drug_2: ["health", "Rixolam", "Phuxx", "Risolam", {}, "pill"], drug_3: ["health", "Eufurysant", "Eufurylate", "Euforidyl", {}, "pill"], drug_4: ["health", "Soma", "Soma", "Macamaca", {}, "pill"], drug_5: ["health", "Epice", "Spyce", "Nuke", {}, "pill"], drug_6: ["health", "Nuke", "Newke", "Japiyú", {}, "pill"], drug_7: ["health", "Ponay", "Pinq", "Ñapepa", {}, "pill"], drug_8: ["health", "Bacta", "Bacta", "Betapropyl", {}, "pill"], drug_9: ["health", "Betapropyl", "Betapropyl", "Pimp", {}, "pill"], drug_10: ["health", "Pimp", "Pymp", "Ontoy", {}, "pill"], drug_11: ["health", "Rosebud", "Rosebud", "Ming", {}, "pill"], ration_6: ["health", "Anabolisant", "Anabolic", "Anabólicos", { foodEffects: [{ type: 'pm', value: 8 }] }, "food"], 

	spore_extractor: ["misc", "Suceur de Spore", "Spore Sucker", "Extractor de Esporas", {}, ""], anti_mush_serum: ["misc", "Sérum Rétro-Fongique", "Retro-Fungal Serum", "Antídoto Retrofúngico", {}, ""], apron: ["misc", "Tablier intachable", "Stainproof Apron", "Mandil anti-manchas", {}, ""], mush_floppy_disk: ["misc", "Disquette du Génome Mush", "Mush Genome Disk", "Diskette Del Genoma Mush", {}, ""], mush_sample: ["misc", "Souche de test Mush", "Mush Sample", "Muestra De Raíz Mush", {}, ""], myco_alarm: ["misc", "Myco-Alarme", "Myco-Alarm", "MycoAlarma", {}, ""], body_cat: ["misc", "Schrödinger", "Schrödinger", "Schrödinger", {}, ""], help_drone: ["misc", "Drone de Soutien", "Support Drone", "Dron", {}, ""], freezer: ["misc", "Supergélateur", "Superfreezer", "Supergelador", {}, ""], microwave: ["misc", "Micro-onde", "Microwave", "Microondas", { charges: 4 }, ""], sofa: ["misc", "Sofa Suédois", "Swedish Sofa", "Sofá Sueco", {}, ""], plastenite_armor: ["misc", "Armure de plastenite", "Plastenite Armor", "Armadura De Plastenita", {}, ""], soap: ["misc", "Savon", "Soap", "Jabón", {}, ""], super_soap: ["misc", "Super Savon", "Super Soaper", "Jabón mushicida", {}, ""], metal_scraps: ["misc", "Débris métallique", "Scrap Metal", "Pieza metálica", {}, ""], plastic_scraps: ["misc", "Débris plastique", "Plastic Scraps", "Pieza plástica", {}, ""], space_capsule: ["misc", "Capsule Spatiale", "Space Capsule", "Cápsula Espacial", {}, ""], fuel_capsule: ["misc", "Capsule de Fuel", "Fuel Capsule", "Cápsula De Combustible", {}, ""], oxy_capsule: ["misc", "Capsule d'Oxygène", "Oxygen Capsule", "Cápsula De Oxígeno", {}, ""], thick_tube: ["misc", "Tube épais", "Thick Tube", "Tubo grueso", {}, ""], duck_tape: ["misc", "Ruban Adhésif", "Duct Tape", "Cinta adhesiva", {}, ""], mad_kube: ["misc", "MAD Kube", "MAD Kube", "MAD Kube", {}, ""], old_shirt: ["misc", "Vieux T-Shirt", "Old T-Shirt", "Vieja camiseta", {}, ""], printer: ["misc", "Tabulatrice", "Tabulatrix", "Tabuladora", {}, ""], 

	fruit_tree00: ["plants", "Bananier", "Banana Tree", "Árbol plátano", {}, ""], young_fruit_tree00: ["plants", "Jeune Bananier", "Young Banana Tree", "Joven Árbol plátano", {}, ""], fruit_tree01: ["plants", "Lianiste", "Creepist", "Lianesto", {}, ""], young_fruit_tree01: ["plants", "Jeune Lianiste", "Young Creepist", "Joven Lianesto", {}, ""], fruit_tree02: ["plants", "Cactuor", "Cactax", "Cactour", {}, ""], young_fruit_tree02: ["plants", "Jeune Cactuor", "Young Cactax", "Joven Cactour", {}, ""], fruit_tree03: ["plants", "Bifalon", "Bifflon", "Bifalón", {}, ""], young_fruit_tree03: ["plants", "Jeune Bifalon", "Young Bifflon", "Joven Bifalón", {}, ""], fruit_tree04: ["plants", "Poulmino", "Pulminagro", "Pulmino", {}, ""], young_fruit_tree04: ["plants", "Jeune Poulmino", "Young Pulminagro", "Joven Pulmino", {}, ""], fruit_tree05: ["plants", "Precatus", "Precatus", "Precatia", {}, ""], young_fruit_tree05: ["plants", "Jeune Precatus", "Young Precatus", "Joven Precatia", {}, ""], fruit_tree06: ["plants", "Buitalien", "Buttalien", "Buitalien", {}, ""], young_fruit_tree06: ["plants", "Jeune Buitalien", "Young Buttalien", "Joven Buitalien", {}, ""], fruit_tree07: ["plants", "Platacia", "Platacia", "Platacia", {}, ""], young_fruit_tree07: ["plants", "Jeune Platacia", "Young Platacia", "Joven Platacia", {}, ""], fruit_tree08: ["plants", "Tubiliscus", "Tubiliscus", "Tubiliscus", {}, ""], young_fruit_tree08: ["plants", "Jeune Tubiliscus", "Young Tubiliscus", "Joven Tubiliscus", {}, ""], fruit_tree09: ["plants", "Peuplimoune", "Graapshoot", "Poplimuno", {}, ""], young_fruit_tree09: ["plants", "Jeune Peuplimoune", "Young Graapshoot", "Joven Poplimuno", {}, ""], fruit_tree10: ["plants", "Fiboniccus", "Fiboniccus", "Fibonicio", {}, ""], young_fruit_tree10: ["plants", "Jeune Fiboniccus", "Young Fiboniccus", "Joven Fibonicio", {}, ""], fruit_tree11: ["plants", "Mycopia", "Mycopia", "Mycopia", {}, ""], young_fruit_tree11: ["plants", "Jeune Mycopia", "Young Mycopia", "Joven Mycopia", {}, ""], fruit_tree12: ["plants", "Asperginulk", "Asperagunk", "Asperginulk", {}, ""], young_fruit_tree12: ["plants", "Jeune Asperginulk", "Young Asperagunk", "Joven Asperginulk", {}, ""], fruit_tree13: ["plants", "Cucurbitatrouille", "Bumpjunkin", "Cucurbitacia", {}, ""], young_fruit_tree13: ["plants", "Jeune Cucurbitatrouille", "Young Bumpjunkin", "Joven Cucurbitacia", {}, ""], fruit00: ["plants", "Banane", "Banana", "Plátano", { foodEffects: [{ type: 'pa', value: 1 }, { type: 'moral', value: 1 }, { type: 'hp', value: 1 }, { type: 'satisfaction', value: 1 }] }, "fruit"], fruit01: ["plants", "Lianube", "Creepnut", "Lianuba", { foodEffects: [{ type: 'satisfaction', value: 1 }] }, "fruit"], fruit02: ["plants", "Balargine", "Meztine", "Balargina", { foodEffects: [{ type: 'satisfaction', value: 1 }] }, "fruit"], fruit03: ["plants", "Goustiflon", "Guntiflop", "Gustiflón", { foodEffects: [{ type: 'satisfaction', value: 1 }] }, "fruit"], fruit04: ["plants", "Toupimino", "Ploshmina", "Tupimino", { foodEffects: [{ type: 'satisfaction', value: 1 }] }, "fruit"], fruit05: ["plants", "Precati", "Precati", "Precatia", { foodEffects: [{ type: 'satisfaction', value: 1 }] }, "fruit"], fruit06: ["plants", "Bottine", "Bottine", "Botino", { foodEffects: [{ type: 'satisfaction', value: 1 }] }, "fruit"], fruit07: ["plants", "Fragilane", "Fragilane", "Fragilana", { foodEffects: [{ type: 'satisfaction', value: 1 }] }, "fruit"], fruit08: ["plants", "Anémole", "Anemole", "Anémola", { foodEffects: [{ type: 'satisfaction', value: 1 }] }, "fruit"], fruit09: ["plants", "Pénicule", "Peniraft", "Peniclo", { foodEffects: [{ type: 'satisfaction', value: 1 }] }, "fruit"], fruit10: ["plants", "Kubinus", "Kubinus", "Kubinus", { foodEffects: [{ type: 'satisfaction', value: 1 }] }, "fruit"], fruit11: ["plants", "Calebotte", "Caleboot", "Calebota", { foodEffects: [{ type: 'satisfaction', value: 1 }] }, "fruit"], fruit12: ["plants", "Filandru", "Filandra", "Filandru", { foodEffects: [{ type: 'satisfaction', value: 1 }] }, "fruit"], fruit13: ["plants", "Citrouïd", "Jumpkin", "Citroida", { foodEffects: [{ type: 'pa', value: 3 }, { type: 'moral', value: 1 }, { type: 'hp', value: 1 }] }, "fruit"], tree_pot: ["plants", "HydroPot", "HydroPot", "Hydromaceta", {}, ""],

	camera: ["tools", "Caméra", "Camera", "Cámara", {}, ""], camera_installed: ["tools", "Caméra installée", "Installed camera", "Cámara instalada", {}, ""], extinguisher: ["tools", "Extincteur", "Extinguisher", "Extintor", {}, ""], hacker_kit: ["tools", "Bidouilleur", "Hacker Kit", "Kit de Hackeo", {}, ""], aiming_helmet: ["tools", "Casque de Visée", "Sniper's Helmet", "Casco de tiro", {}, ""], ncc_lens: ["tools", "Lentille NCC", "Lenses", "Lentilla NCC", {}, ""], antigrav_scooter: ["tools", "Trottinette Anti-Grav.", "Anti-Grav Scooter", "Patinete Anti-Gravedad", { charges: 8 }, ""], rolling_boulder: ["tools", "Monture Rocheuse", "Rolling Boulder", "Montura Rocosa", {}, ""], wavoscope: ["tools", "Vaguoscope", "Oscilloscope", "Olascopio", {}, ""], wrench: ["tools", "Clé à molette", "Adjustable Wrench", "Llave inglesa", {}, ""], alien_can_opener: ["tools", "Décapsuleur Alien", "Alien Bottle Opener", "Abrebotellas Alien", {}, ""], protection_gloves: ["tools", "Gants de protection", "Protective Gloves", "Guantes de protección", {}, ""], 

	blaster: ["weaponry", "Blaster", "Blaster", "Blaster", { charges: 3 }, ""], grenade: ["weaponry", "Grenade", "Grenade", "Granada", {}, ""], knife: ["weaponry", "Couteau", "Knife", "Cuchillo", {}, ""], machine_gun: ["weaponry", "Sulfateuse", "Old Faithful", "Sulfatosa", { charges: 12 }, ""], missile_launcher: ["weaponry", "Lance-Roquette", "Rocket Launcher", "Lanza-misiles", { charges: 1 }, ""], natamy_riffle: ["weaponry", "Natamy", "Natamy Rifle", "Fusil Natamy", { charges: 3 }, ""], sniper_riffle: ["weaponry", "Lizaro Jungle", "Lizaro Jungle", "Lizaro Jungle", { charges: 1 }, ""],
};


Main.AstroPad.getStorage = function(variable) {
	return localStorage['ASTROPAD_' + Main.AstroPad.language + variable];
};


Main.AstroPad.setStorage = function(variable, value) {
	localStorage['ASTROPAD_' + Main.AstroPad.language + variable] = value;
};


Main.AstroPad.capitalize = function(str) {
	if (str == undefined) {
		return "";
	}
	return str.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

Main.AstroPad.getRoomId = function() {
	return Main.AstroPad.roomNames.indexOf($("#input").attr('d_name'));
};

Main.AstroPad.getHname = function() {
	var $it0 = Main.heroes.iterator();
	while ($it0.hasNext()) {
		var st1 = $it0.next();
		if (st1.me) {
			return st1.surname;
		}
	}
	return $('.who').html().trim(); //In case the loop somehow didn't work
};

Main.AstroPad.getMushStatus = function() {
	var $it0 = Main.heroes.iterator();
	while ($it0.hasNext()) {
		var st1 = $it0.next();
		if (st1.skills == null) {
			continue;
		}
		if (!st1.me) {
			continue;
		}
		var $it1 = st1.statuses.iterator();
		while ($it1.hasNext()) {
			if ($it1.next().img == "mush") {
				return true;
			}
		}
	}
	return false;
};

Main.AstroPad.canReadPills = function() { //Can read pills effects
	var $it0 = Main.heroes.iterator();
	while ($it0.hasNext()) {
		var st1 = $it0.next();
		if (st1.skills == null) {
			continue;
		}
		if (!st1.me) {
			continue;
		}
		var $it1 = st1.skills.iterator();
		while ($it1.hasNext()) {
			if (["biologist", "first_aid", "medic", "skilful"].indexOf($it1.next().img) != -1) {
				return true;
			}
		}
	}
	return false;
};

Main.AstroPad.canReadFood = function() { //Can read fruits and food effects
	var $it0 = Main.heroes.iterator();
	while ($it0.hasNext()) {
		var st1 = $it0.next();
		if (st1.skills == null) {
			continue;
		}
		if (!st1.me) {
			continue;
		}
		var $it1 = st1.skills.iterator();
		while ($it1.hasNext()) {
			if ($it1.next().img == "cook") {
				return true;
			}
		}
	}
	return false;
};

Main.AstroPad.canReadFruit = function() { //Can read fruits effects
	var $it0 = Main.heroes.iterator();
	while ($it0.hasNext()) {
		var st1 = $it0.next();
		if (st1.skills == null) {
			continue;
		}
		if (!st1.me) {
			continue;
		}
		var $it1 = st1.skills.iterator();
		while ($it1.hasNext()) {
			if (["botanic", "skilful"].indexOf($it1.next().img) != -1) {
				return true;
			}
		}
	}
	return false;
};

Main.AstroPad.isFrugivore = function() { //Is a frugivore (adds +2 to food effects)
	var $it0 = Main.heroes.iterator();
	while ($it0.hasNext()) {
		var st1 = $it0.next();
		if (st1.skills == null) {
			continue;
		}
		if (!st1.me) {
			continue;
		}
		var $it1 = st1.skills.iterator();
		while ($it1.hasNext()) {
			if ($it1.next().img == "frugivore") {
				return true;
			}
		}
	}
	return false;
};

Main.AstroPad.getData = function() {
	var hero = Main.AstroPad.heronames.indexOf(Main.AstroPad.getHname());
	var gid = Main.AstroPad.getStorage('gid');
	var gkey = Main.AstroPad.getStorage('gkey');
	return 'hid=' + hero + '&gid=' + gid + '&gkey=' + gkey + '&tid=0&chk=0';
};

Main.AstroPad.selectTab = function(el) {
	if ($(el).attr('data-tab') != undefined) { //Original game tab
		$("#astrotab").removeClass("tabon").addClass("taboff");
		$("#astrotab_content").hide();
		Main.AstroPad.fill("");
		return Main.selChat($(el).attr('data-tab'));
	}

	//Script tab
	$("#cdTabsChat li").removeClass("tabon").addClass("taboff");
	$("#chatBlock > *").hide();

	$(el).removeClass("taboff").addClass("tabon"); //Tab
	var scriptTab = $($(el).attr('data-script-tab'));
	if (scriptTab.length) {
		$(scriptTab).show(); //Content
	}
	var scriptFunc = $(el).attr('data-script-function');
	if (scriptFunc) {
		scriptFunc = scriptFunc.split('.');
		var func = unsafeWindow;
		for (var i = 0; i < scriptFunc.length; i++) {
			func = func[scriptFunc[i]];
		}
		func();
	}
};

Main.AstroPad.buildAstrotab = function() {
	if ($("#astrotab").length > 0) {
		return;
	}
	//Astrotab
	var content = $("<div>").addClass("cdAstroTab").attr("id", "astrotab_content").appendTo($("#chatBlock"));

	var tabschat = $("#cdTabsChat");
	var tab = $("<li>").addClass("tab taboff").css('margin-right', '3px').appendTo(tabschat);
	tab.attr({ id: "astrotab", 'data-script-tab': '#astrotab_content', 'data-script-function': 'Main.AstroPad.getInventory' });
	$("<img>").attr("src", "/img/icons/ui/pa_comp.png").appendTo(tab);
	Main.AstroPad.fill("");
	content.hide();
	content.parent().css('height', '500px');
	tab.on("mouseover", function() {
		Main.showTip($(this)[0], "<div class='tiptop'><div class='tipbottom'><div class='tipbg'><div class='tipcontent'> <h1>AstroPad</h1> <p>" + Main.AstroPad.txt.desc + "</p> </div></div></div></div>");
	});
	tab.on("mouseout", function() { Main.hideTip(); });
	$("#cdTabsChat li").on("click", function() { Main.AstroPad.selectTab(this); });
};

Main.AstroPad.createButton = function(text) {
	return $('<div>').addClass('but').html("<div class='butright'><div class='butbg'>" + text + "</div></div>");
}

Main.AstroPad.propertiesToText = function(idetail) {
	var attrs = [];
	var iname = '';
	
	if (idetail.charges != null) {
		attrs.push(idetail.charges + ' ' + Main.AstroPad.txt.charges);
	}
	
	if (idetail.broken) {
		iname += ' ' + Main.AstroPad.txt.broken;
	}
	
	if (idetail.foodState != null) {
		switch (idetail.foodState) {
			case 'unstable':
				iname += ' ' + Main.AstroPad.txt.unstable;
				break;
			case 'hazardous':
				iname += ' ' + Main.AstroPad.txt.hazardous;
				break;
			case 'decaying':
				iname += ' ' + Main.AstroPad.txt.decaying;
				break;
		}
	}
	
	if (idetail.frozen) {
		iname += ' ' + Main.AstroPad.txt.frozen;
	}
	
	if (idetail.plantThirst != null) {
		switch (idetail.plantThirst) {
			case 'thirsty':
				iname += ' ' + Main.AstroPad.txt.thirsty;
				break;
			case 'dry':
				iname += ' ' + Main.AstroPad.txt.dry;
				break;
		}
	}
	
	if (idetail.plantIll) {
		iname += ' ' + Main.AstroPad.txt.diseased;
	}
	
	var props = idetail.foodEffects;
	if (props.length > 0) {
		for (var j = 0; j < props.length; j++) {
			var attr = '';
			var prop = props[j];

			function sign(n) { //1 → '+1'
				if (n > 0) {
					n = "+" + n;
				}
				return n;
			};
			
			if (prop.chances != undefined && prop.chances && prop.chances != 100) {
				attr += prop.chances + "% : ";
			}

			switch (prop.type) {
				case 'pa':
					attr += sign(prop.value) + ":pa:";
					break;
				case 'pm':
					attr += sign(prop.value) + ":pm:";
					break;
				case 'hp':
					attr += sign(prop.value) + ":hp:";
					break;
				case 'moral':
					attr += sign(prop.value) + ":moral:";
					break;
				case 'satisfaction':
					attr += sign(prop.value) + ":pa_cook:";
					break;
				case 'cures':
					attr += Main.AstroPad.txt.curesText + " " + prop.value;
					break;
				case 'causes':
					attr += Main.AstroPad.txt.causesText + " " + prop.value;
					break;
			}

			if (prop.delay != undefined && prop.delay) {
				attr += ' (' + prop.delay + ' ' + Main.AstroPad.txt.cycles + ')';
			}
			attrs.push(attr);
		}
	}

	return [iname, attrs.join(', ')];
};

Main.AstroPad.sendData = function(sendCallback) {
	var data = Main.AstroPad.getData() + '&data=';
	var url = Main.AstroPad.urlAstro + "/addItems";
	var conso = '';
	if (Main.AstroPad.items.length) {
		for (var i = 0; i < Main.AstroPad.items.length; i++) {
			var item = Main.AstroPad.items[i];
			var iname = item.name;
			var idetail = item.properties;
			var text = Main.AstroPad.propertiesToText(idetail);
			if (item.pushToConso && text[1]) {
				conso += item.id + '|' + text[1] + '§';
			}
			data += encodeURIComponent(item.roomId + '|' + iname + text[0] + '|' + item.id + '|' + item.amount + '|' + text[1] + '|' + item.day + '§');
		}
		data = data.slice(0, -1); //Remove the trailing §
	}
	else {
		data += Main.AstroPad.getRoomId() + "||empty|0||";
	}

	data += "&conso=" + encodeURIComponent(conso);
	console.log(url + '?' + data);

	GM.xmlHttpRequest({
		method: 'POST', url: url, data: data, headers: { 'Content-type': 'application/x-www-form-urlencoded' },
		onload: function(responseDetails) {
			//console.log(responseDetails.responseText);
			Main.AstroPad.getInventory();
			if (typeof sendCallback == 'function') {
				sendCallback();
			}
		}
	});
};

Main.AstroPad.addItem = function(sendCallback) {
	var elements = [];
	elements.push($('<h3>').css('text-align', 'center').text(Main.AstroPad.txt.itemChoice));

	var list = $('<div>').css({ width: '100%', backgroundColor: '#3D5F8D', color: 'white', borderTop: '2px solid navy', borderBottom: '2px solid navy' }); //Categories
	var cats = {
		misc: ['talkie', Main.AstroPad.txt.itemCatMisc],
		tools: ['pa_eng', Main.AstroPad.txt.itemCatTools],
		weaponry: ['pa_shoot', Main.AstroPad.txt.itemCatWeaponry],
		documents: ['book', Main.AstroPad.txt.itemCatDocuments],
		food: ['pa_cook', Main.AstroPad.txt.itemCatFood],
		plants: ['pa_garden', Main.AstroPad.txt.itemCatPlants],
		health: ['drugs', Main.AstroPad.txt.itemCatHealth],
		expedition: ['planet', Main.AstroPad.txt.itemCatExpedition],
		alien: ['artefact', Main.AstroPad.txt.itemCatAlien]
	};

	var div = $('<div>').addClass('what_happened').attr('id', 'astromod-add-item'); //Items (a table for each category)
	for (cat in cats) {
		//Icon
		var img = cats[cat][0];
		$('<div>').attr('data-astromod-cat', cat).css({
			display: 'inline-block',
			borderRight: '2px solid navy',
			padding: '5px',
			cursor: 'pointer',
			backgroundColor: (cat == 'misc' ? '#7D7FAD' : 'transparent') //Misc selected by default
		}).hover(function() { //In
			$(this).css('background-color', '#7D7FAD');
		}, function() { //Out
			if (!$(this).hasClass('astromod-cat-selected')) {
				$(this).css('background-color', 'transparent');
			}
		}).html("<img src='http://" + Main.AstroPad.urlMush + "/img/icons/ui/" + img + ".png' />").appendTo(list).on('click', function() {
			var c = $(this).attr('data-astromod-cat');
			$('#astromod-cat-name').text(cats[c][1]);
			$("#astromod-add-item table").hide();
			$('#astromod-table-' + c).show();
			$('[data-astromod-cat]').css('background-color', 'transparent').removeClass('astromod-cat-selected');
			$(this).css('background-color', '#7D7FAD').addClass('astromod-cat-selected');
		}).addClass(cat == 'misc' ? 'astromod-cat-selected' : '');

		//Items
		var table = $('<table>').addClass('table').attr('id', 'astromod-table-' + cat).appendTo(div);
		if (cat != 'misc') {
			table.hide();
		}
		var tr = $('<tr>').appendTo(table);
		var p = 0; //Odd or even
		for (item in Main.AstroPad.allItems) { //Scan all items
			if (Main.AstroPad.allItems[item][0] != cat) { //And only choose those of this category
				continue;
			}
			if (p % 2 == 0) { //New line
				tr = $('<tr>').appendTo(table);
			}

			var code = item.replace('camera_installed', 'camera').replace('young_fruit_tree', 'fruit_tree');
			if (/blueprint/.test(code)) {
				code = 'blueprint';
			}
			else if (/book/.test(code)) {
				code = 'book';
			}

			//Image
			var td = $('<td>').css({
				height: '35px',
				width: '35px',
				padding: 0,
				border: '2px solid #1D3F6D'
			}).hover(function() { //In
				$(this).css('border', '2px solid #4D3F6D');
				$(this).next().css('background-color', '#4D3F6D');
			}, function() { //Out
				$(this).css('border', '2px solid #1D3F6D');
				$(this).next().css('background-color', 'transparent');
			}).appendTo(tr);
			$('<img>').css({ height: '35px', width: '35px', cursor: 'pointer' }).attr({
				src: "http://" + Main.AstroPad.urlMush + "/img/icons/items/" + code + ".jpg",
				'data-astromod-itemcode': item
			}).on('click', function() {
				//Add item and go back to AstroMod
				var code = $(this).attr('data-astromod-itemcode');
				var name = Main.AstroPad.allItems[code][Main.AstroPad.lang];

				//Determine whether food effects can be shared via conso
				var pushToConso = false;
				var type = Main.AstroPad.allItems[code][5];
				if (Main.AstroPad.canReadPills() && type == 'pill') {
					pushToConso = true;
				}
				else if (Main.AstroPad.canReadFood() && (type == 'food' || type == 'fruit')) {
					pushToConso = true;
				}
				else if (Main.AstroPad.canReadFruit() && type == 'fruit') {
					pushToConso = true;
				}
				else if (type == 'all') {
					pushToConso = true;
				}

				//Get default properties
				var originalProperties = { charges: null, broken: false, foodState: null, frozen: false, plantThirst: null, plantIll: false, foodEffects: [] };
				var defaultProperties = Main.AstroPad.allItems[code][4];
				for (key in defaultProperties) {
					originalProperties[key] = defaultProperties[key];
				}

				//Get generic code for images
				code = code.replace('camera_installed', 'camera').replace('young_fruit_tree', 'fruit_tree');
				if (/blueprint/.test(code)) {
					code = 'blueprint';
				}
				else if (/book/.test(code)) {
					code = 'book';
				}
				if (!name) {
					name = Main.AstroPad.txt.defaultItem;
				}

				Main.AstroPad.items.push({
					roomId: Main.AstroPad.getRoomId(),
					name: name,
					id: code,
					amount: 1,
					properties: { charges: null, broken: false, foodState: null, frozen: false, plantThirst: null, plantIll: false, foodEffects: [] },
					originalProperties: originalProperties,
					day: 0,
					pushToConso: pushToConso
				});
				Main.AstroPad.buildAstromod(sendCallback);
			}).appendTo(td);

			//Name
			$('<td>').css('padding', '0').text(Main.AstroPad.capitalize(Main.AstroPad.allItems[item][Main.AstroPad.lang])).appendTo(tr);
			p += 1;
		}
	}
	$('<span>').attr('id', 'astromod-cat-name').css('margin-left', '20px').text(Main.AstroPad.txt.itemCatMisc).appendTo(list); //Category name
	elements.push(list, div);

	elements.push(Main.AstroPad.createButton(Main.AstroPad.txt.cancelAstromod).on('click', function() {
		Main.AstroPad.buildAstromod(sendCallback);
	}));

	Main.AstroPad.fill(elements);
};

Main.AstroPad.changeItemProperties = function(id, sendCallback) {
	var item = Main.AstroPad.items[id];
	var attrs = item.properties;
	var form = $('<form>').css('color', 'black !important').attr('data-astromod-item', id);
	$('<img>').css({ width: '20px', height: '20px', marginLeft: '5px' }).attr('src', '/img/icons/items/' + item.id + '.jpg').appendTo(
		$('<h3>').text(Main.AstroPad.txt.propertyTitle + "  " + item.name).css({ textAlign: 'center', margin: '10px 0' }).appendTo(form)
	);

	// PLANT PROPERTIES //
	var plantField = $('<fieldset>').appendTo(form);
	//Thirsty
	switch (attrs.plantThirst) {
		case 'thirsty':
			var defaultThirst = [false, 'selected', false];
			break;
		case 'dry':
			var defaultThirst = [false, false, 'selected'];
			break;
		default:
			var defaultThirst = ['selected', false, false];
			break;
	}
	$('<label>').text(Main.AstroPad.txt.propertyPlant + " ").attr('for', 'astromod-plant-thirst').appendTo(plantField);
	var plantSelect = $('<select>').attr('name', 'astromod-plant-thirst').css('color', 'black').appendTo(plantField);
	$('<option>').text("—").attr({ selected: defaultThirst[0], value: null }).appendTo(plantSelect);
	$('<option>').text(Main.AstroPad.txt.thirsty).attr({ selected: defaultThirst[1], value: 'thirsty' }).appendTo(plantSelect);
	$('<option>').text(Main.AstroPad.txt.dry).attr({ selected: defaultThirst[2], value: 'dry' }).appendTo(plantSelect);
	//Ill
	$('<input>').attr({ type: 'checkbox', checked: attrs.plantIll, name: 'astromod-plant-ill' }).css('margin-left', '20px').appendTo(plantField);
	$('<label>').text(Main.AstroPad.txt.diseased).attr('for', 'astromod-plant-ill').appendTo(plantField);

	var electricField = $('<fieldset>').appendTo(form);
	//Charges
	$('<input>').attr({ type: 'checkbox', checked: (attrs.charges != null), name: 'astromod-hascharges' }).css('color', 'black').appendTo(electricField);
	$('<label>').text(Main.AstroPad.capitalize(Main.AstroPad.txt.charges) + " : ").attr('for', 'astromod-charges').appendTo(electricField);
	$('<input>').attr({ type: 'number', min: 0, max: 20, value: attrs.charges, name: 'astromod-charges' }).css({ color: 'black', width: '4em' }).appendTo(electricField);
	//Broken
	$('<input>').attr({ type: 'checkbox', checked: attrs.broken, name: 'astromod-broken' }).css('margin-left', '20px').appendTo(electricField);
	$('<label>').text(Main.AstroPad.txt.broken).attr('for', 'astromod-broken').appendTo(electricField);

	// FOOD PROPERTIES //
	var foodField = $('<fieldset>').appendTo(form);
	//Food state
	switch (attrs.foodState) {
		case 'unstable':
			var rottenState = [false, 'selected', false, false];
			break;
		case 'hazardous':
			var rottenState = [false, false, 'selected', false];
			break;
		case 'decaying':
			var rottenState = [false, false, false, 'selected'];
			break;
		default:
			var rottenState = ['selected', false, false, false];
			break;
	}
	$('<label>').text(Main.AstroPad.txt.propertyFoodState + " ").attr('for', 'astromod-food-state').appendTo(foodField);
	var foodSelect = $('<select>').attr('name', 'astromod-food-state').css('color', 'black').appendTo(foodField);
	$('<option>').text("—").attr({ selected: rottenState[0], value: null }).appendTo(foodSelect);
	$('<option>').text(Main.AstroPad.txt.unstable).attr({ selected: rottenState[1], value: 'unstable' }).appendTo(foodSelect);
	$('<option>').text(Main.AstroPad.txt.hazardous).attr({ selected: rottenState[2], value: 'hazardous' }).appendTo(foodSelect);
	$('<option>').text(Main.AstroPad.txt.decaying).attr({ selected: rottenState[3], value: 'decaying' }).appendTo(foodSelect);
	//Frozen
	$('<input>').attr({ type: 'checkbox', checked: attrs.frozen, name: 'astromod-food-frozen' }).css('margin-left', '20px').appendTo(foodField);
	$('<label>').text(Main.AstroPad.txt.frozen).attr('for', 'astromod-food-frozen').appendTo(foodField);

	// FOOD EFFECTS //
	var effectsField = $('<fieldset>').attr('id', 'astromod-effects').appendTo(form);
	$('<h3>').text(Main.AstroPad.txt.foodEffects).appendTo(effectsField);
	var effectsTable = $('<table>').addClass('table').appendTo($('<div>').addClass('what_happened').appendTo(effectsField));

	function generateDiseasesSelect(currentDisease) {
		var diseaseInList = false;
		var select = $('<select>').attr('name', 'astromod-effect-value-' + i).css('color', 'black');
		var phyGroup = $('<optgroup>').attr('label', Main.AstroPad.txt.propertyPhysical).appendTo(select);
		for (var j = 0; j < Main.AstroPad.physicalDiseases.length; j++) {
			var disease = Main.AstroPad.physicalDiseases[j];
			if (disease == currentDisease) {
				$('<option>').text(disease).attr({ value: disease, selected: true }).appendTo(phyGroup);
				diseaseInList = true;
			}
			else {
				$('<option>').text(disease).attr({ value: disease }).appendTo(phyGroup);
			}
		}
		var psyGroup = $('<optgroup>').attr('label', Main.AstroPad.txt.propertyPsychological).appendTo(select);
		for (var j = 0; j < Main.AstroPad.psychologicalDiseases.length; j++) {
			var disease = Main.AstroPad.psychologicalDiseases[j];
			if (disease == currentDisease) {
				$('<option>').text(disease).attr({ value: disease, selected: true }).appendTo(psyGroup);
				diseaseInList = true;
			}
			else {
				$('<option>').text(disease).attr({ value: disease }).appendTo(psyGroup);
			}
		}
		if (currentDisease && !diseaseInList) { //If unknown disease, add it
			$('<option>').text(currentDisease).attr({ value: currentDisease, selected: true }).insertBefore(phyGroup);
		}
		return select;
	}

	function generateEffectLine(effect) {
		var tr = $('<tr>').attr({ class: 'astromod-effect', 'data-astromod-effect': effect.type, 'data-astromod-effect-number': i }).appendTo(effectsTable);

		switch (effect.type) {
			case 'pa':
				var td = $('<td>');
				$('<input>').attr({ type: 'number', min: -20, max: 20, value: effect.value, name: 'astromod-effect-value-' + i }).css({ color: 'black', width: '4em' }).appendTo(td);
				$('<img>').attr('src', '/img/icons/ui/pa_slot1.png').appendTo(td);
				td.appendTo(tr);
				break;
			case 'pm':
				var td = $('<td>');
				$('<input>').attr({ type: 'number', min: -20, max: 20, value: effect.value, name: 'astromod-effect-value-' + i }).css({ color: 'black', width: '4em' }).appendTo(td);
				$('<img>').attr('src', '/img/icons/ui/pa_slot2.png').appendTo(td);
				td.appendTo(tr);
				break;
			case 'hp':
				var td = $('<td>');
				$('<input>').attr({ type: 'number', min: -20, max: 20, value: effect.value, name: 'astromod-effect-value-' + i }).css({ color: 'black', width: '4em' }).appendTo(td);
				$('<img>').attr('src', '/img/icons/ui/lp.png').appendTo(td);
				td.appendTo(tr);
				break;
			case 'moral':
				var td = $('<td>');
				$('<input>').attr({ type: 'number', min: -20, max: 20, value: effect.value, name: 'astromod-effect-value-' + i }).css({ color: 'black', width: '4em' }).appendTo(td);
				$('<img>').attr('src', '/img/icons/ui/moral.png').appendTo(td);
				td.appendTo(tr);
				break;
			case 'satisfaction':
				var td = $('<td>');
				$('<input>').attr({ type: 'number', min: -20, max: 20, value: effect.value, name: 'astromod-effect-value-' + i }).css({ color: 'black', width: '4em' }).appendTo(td);
				$('<img>').attr('src', '/img/icons/ui/pa_cook.png').appendTo(td);
				td.appendTo(tr);
				break;
			case 'cures':
				$('<td>').text(Main.AstroPad.txt.curesText).append(" :<br><br>",
					generateDiseasesSelect(effect.value)
				).appendTo(tr);
				break;
			case 'causes':
				$('<td>').text(Main.AstroPad.txt.causesText).append(" :<br><br>",
					generateDiseasesSelect(effect.value)
				).appendTo(tr);
				break;
		}

		//Chances
		if (effect.chances) {
			var chances = effect.chances;
		}
		else {
			var chances = 100;
		}
		var tdChances = $('<td>').appendTo(tr);
		$('<label>').text(Main.AstroPad.txt.propertyChances).attr('for', 'astromod-effect-chances-' + i).appendTo(tdChances);
		tdChances.append('<br><br>');
		$('<input>').attr({ type: 'number', min: 0, max: 100, value: chances, name: 'astromod-effect-chances-' + i }).css({ color: 'black', width: '4em' }).appendTo(tdChances);
		$('<span>').text(' %').appendTo(tdChances);

		//Delay
		if (effect.delay) {
			var delay = effect.delay.split('-');
		}
		else {
			var delay = [0, 0];
		}
		var tdDelay = $('<td>').appendTo(tr);
		$('<label>').text(Main.AstroPad.txt.propertyDelay).attr('for', 'astromod-effect-delayBegin-' + i).appendTo(tdDelay);
		tdDelay.append('<br><br>');
		$('<input>').attr({ type: 'number', min: 0, max: 20, value: parseInt(delay[0]), name: 'astromod-effect-delayBegin-' + i }).css({ color: 'black', width: '4em' }).appendTo(tdDelay);
		$('<label>').text(" " + Main.AstroPad.txt.propertyTo + " ").attr('for', 'astromod-effect-delayEnd-' + i).appendTo(tdDelay);
		$('<input>').attr({ type: 'number', min: 0, max: 20, value: parseInt(delay[1]), name: 'astromod-effect-delayEnd-' + i }).css({ color: 'black', width: '4em' }).appendTo(tdDelay);
		tdDelay.append(" " + Main.AstroPad.txt.cycles);

		//Remove
		$('<img>').attr('src', '/img/icons/ui/close.png').css('cursor', 'pointer').on('click', function() { $(this).closest('tr').remove(); }).appendTo($('<td>').appendTo(tr));
	}

	//Add effect
	Main.AstroPad.createButton(Main.AstroPad.txt.addEffect).css({ display: 'inline-block', verticalAlign: 'middle', margin: 0 }).appendTo(effectsField).on('click', function() {
		generateEffectLine({ type: $('[name="astromod-add-effect"]').val(), value: 0, chances: null, delay: null });
	});
	var addEffect = $('<select>').attr('name', 'astromod-add-effect').css({ color: 'black', verticalAlign: 'middle', marginLeft: '5px' }).appendTo(effectsField);
	$('<option>').text(Main.AstroPad.txt.propertyAP).attr({ value: 'pa' }).appendTo(addEffect);
	$('<option>').text(Main.AstroPad.txt.propertyMP).attr({ value: 'pm' }).appendTo(addEffect);
	$('<option>').text(Main.AstroPad.txt.propertyHP).attr({ value: 'hp' }).appendTo(addEffect);
	$('<option>').text(Main.AstroPad.txt.propertyMoral).attr({ value: 'moral' }).appendTo(addEffect);
	$('<option>').text(Main.AstroPad.capitalize(Main.AstroPad.txt.satisfaction)).attr({ value: 'satisfaction' }).appendTo(addEffect);
	$('<option>').text(Main.AstroPad.txt.curesText).attr({ value: 'cures' }).appendTo(addEffect);
	$('<option>').text(Main.AstroPad.txt.causesText).attr({ value: 'causes' }).appendTo(addEffect);

	for (var i = 0; i < attrs.foodEffects.length; i++) {
		generateEffectLine(attrs.foodEffects[i]);
	}

	//Retrieve properties
	Main.AstroPad.createButton(Main.AstroPad.txt.applyProperties).appendTo(form).on('click', function() {
		var index = parseInt($(this).closest('form').attr('data-astromod-item'));
		if ($('[name="astromod-hascharges"]').is(':checked')) {
			Main.AstroPad.items[index].properties.charges = $('[name="astromod-charges"]').val();
		}
		else {
			Main.AstroPad.items[index].properties.charges = null;
		}
		Main.AstroPad.items[index].properties.broken = $('[name="astromod-broken"]').is(':checked');
		Main.AstroPad.items[index].properties.frozen = $('[name="astromod-food-frozen"]').is(':checked');
		Main.AstroPad.items[index].properties.plantIll = $('[name="astromod-plant-ill"]').is(':checked');
		Main.AstroPad.items[index].properties.plantThirst = $('[name="astromod-plant-thirst"]').val();
		Main.AstroPad.items[index].properties.foodState = $('[name="astromod-food-state"]').val();
		Main.AstroPad.items[index].properties.foodEffects = [];
		function pushEffect(el, type, valueIsNumber) {
			var i = el.attr('data-astromod-effect-number');
			var value = el.find('[name*="astromod-effect-value"]').val();
			if (valueIsNumber) {
				value = parseInt(value);
			}
			var chances = parseInt(el.find('[name*="astromod-effect-chances"]').val());
			var delay = [parseInt(el.find('[name*="astromod-effect-delayBegin"]').val()), parseInt(el.find('[name*="astromod-effect-delayEnd"]').val())];
			if (chances == 100 || chances == 0) {
				chances = null;
			}
			if (delay[0] == 0 && delay[1] == 0) {
				delay = null;
			}
			else if (delay[1] <= delay[0]) {
				delay = delay[0] + '-' + (delay[0] + 1);
			}
			else {
				delay = delay[0] + '-' + delay[1];
			}
			Main.AstroPad.items[index].properties.foodEffects.push({ type: type, value: value, chances: chances, delay: delay });
		}
		//Put all food effects in the right order so nobody knows they've been modified
		$('[data-astromod-effect="pa"]').each(function() { pushEffect($(this), 'pa', true); });
		$('[data-astromod-effect="pm"]').each(function() { pushEffect($(this), 'pm', true); });
		$('[data-astromod-effect="moral"]').each(function() { pushEffect($(this), 'moral', true); });
		$('[data-astromod-effect="hp"]').each(function() { pushEffect($(this), 'hp', true); });
		$('[data-astromod-effect="satisfaction"]').each(function() { pushEffect($(this), 'satisfaction', true); });
		$('[data-astromod-effect="cures"]').each(function() { pushEffect($(this), 'cures', false); });
		$('[data-astromod-effect="causes"]').each(function() { pushEffect($(this), 'causes', false); });
		Main.AstroPad.buildAstromod(sendCallback);
	});

	//Set default/original properties
	Main.AstroPad.createButton(Main.AstroPad.txt.defaultProperties).appendTo(form).on('click', function() {
		var index = parseInt($(this).closest('form').attr('data-astromod-item'));
		Main.AstroPad.items[index].properties = Main.AstroPad.items[index].originalProperties;
		Main.AstroPad.changeItemProperties(index, sendCallback);
	});

	//Cancel
	Main.AstroPad.createButton(Main.AstroPad.txt.cancelAstromod).appendTo(form).on('click', function() {
		Main.AstroPad.buildAstromod(sendCallback);
	});

	Main.AstroPad.fill(form);
};

Main.AstroPad.buildAstromod = function(sendCallback) {
	var elements = [];
	elements.push($('<h3>').text(Main.AstroPad.txt.astromodTitle).css('text-align', 'center'));

	var div = $('<div>').addClass('what_happened');
	var table = $('<table>').addClass('table').attr('id', 'astromod-table').appendTo(div);
	if (Main.AstroPad.items.length) {
		//All items in Main.AstroPad.items
		for (var i = 0; i < Main.AstroPad.items.length; i++) {
			var item = Main.AstroPad.items[i];
			var attrs = '';
			var name = Main.AstroPad.capitalize(item.name);
			if (item.properties) {
				var properties = Main.AstroPad.propertiesToText(item.properties);
				name += properties[0];
				attrs = properties[1];

				function toImg(text, exp, img, alt) {
					return text.replace(exp, "<img src='/img/icons/ui/" + img + ".png' alt='" + alt + "' title='" + alt + "' />");
				}

				name = toImg(name, Main.AstroPad.txt.thirsty, "plant_thirsty", Main.AstroPad.txt.thirsty);
				name = toImg(name, Main.AstroPad.txt.dry, "plant_dry", Main.AstroPad.txt.dry);
				name = toImg(name, Main.AstroPad.txt.diseased, "plant_diseased", Main.AstroPad.txt.diseased);
				name = toImg(name, Main.AstroPad.txt.broken, "broken", Main.AstroPad.txt.broken);
				name = toImg(name, Main.AstroPad.txt.frozen, "food_frozen", Main.AstroPad.txt.frozen);
				if (attrs) {
					attrs = toImg(attrs, /:pa:/g, 'pa_slot1', 'pa');
					attrs = toImg(attrs, /:moral:/g, 'moral', 'moral');
					attrs = toImg(attrs, /:pm:/g, 'pa_slot2', 'pm');
					attrs = toImg(attrs, /:hp:/g, 'lp', 'hp');
					attrs = toImg(attrs, Main.AstroPad.txt.satisfaction, 'pa_cook', Main.AstroPad.txt.satisfaction);
					attrs = toImg(attrs, /:pa_cook:/g, 'pa_cook', Main.AstroPad.txt.satisfaction);
					attrs = toImg(attrs, ' ' + Main.AstroPad.txt.charges, 'charge', Main.AstroPad.txt.charges);
					attrs = toImg(attrs, new RegExp(Main.AstroPad.txt.curesText, "g"), "pa_heal", 'heal');
				}
			}
			var tr = $('<tr>').attr('data-astromod-id', i).appendTo(table);

			//Image
			$('<img>').css({ width: '35px', height: '35px' }).attr({
				src: "http://" + Main.AstroPad.urlMush + "/img/icons/items/" + item.id + ".jpg"
			}).appendTo(
				$('<td>').css({
					width: '35px', height: '35px', padding: 0
				}).appendTo(tr)
			);

			//Name
			$('<b>').html(name).appendTo($('<td>').css({ textAlign: 'left', padding: '0 2px' }).appendTo(tr));

			//Properties
			$('<a>').text(Main.AstroPad.txt.changeProperties).css({
				display: 'block', cursor: 'pointer', textDecoration: 'underline'
			}).on('click', function() {
				var id = parseInt($(this).closest('tr').attr('data-astromod-id'));
				Main.AstroPad.changeItemProperties(id, sendCallback);
			}).appendTo(
				$('<span>').html(attrs).appendTo(
					$('<td>').css({ textAlign: 'center', padding: '2px' }).appendTo(tr)
				)
			);

			//Amount
			$('<input>').attr({ type: 'number', value: item.amount, min: 1, max: 127 }).css({ color: 'black', width: '3em' }).on('change', function() {
				Main.AstroPad.items[parseInt($(this).closest('tr').attr('data-astromod-id'))].amount = $(this).val();
			}).appendTo(
				$('<td>').appendTo(tr)
			);

			//Delete
			$('<img>').attr('src', '/img/icons/ui/close.png').css('cursor', 'pointer').on('click', function() {
				Main.AstroPad.items.splice(parseInt($(this).closest('tr').attr('data-astromod-id')), 1);
				Main.AstroPad.buildAstromod(sendCallback);
			}).appendTo(
				$('<td>').appendTo(tr)
			);
		}
	}
	
	elements.push(div);

	elements.push(Main.AstroPad.createButton(Main.AstroPad.txt.addItem).css('margin-bottom', '10px').on('click', function() {
		Main.AstroPad.addItem(sendCallback);
	}));

	elements.push(Main.AstroPad.createButton(Main.AstroPad.txt.sendAstromod).css('margin-bottom', '10px').on('click', function() {
		Main.AstroPad.sendData(sendCallback);
	}));

	elements.push(Main.AstroPad.createButton(Main.AstroPad.txt.cancelAstromod).on('click', function() {
		Main.AstroPad.getInventory();
	}));
	
	Main.AstroPad.fill(elements);
};

Main.AstroPad.updateInventory = function(tamper, sendCallback) {
	var rid = Main.AstroPad.getRoomId();
	Main.AstroPad.items = [];

	var readPillsEffect = Main.AstroPad.canReadPills();
	var readFoodEffect = Main.AstroPad.canReadFood();
	var readFruitEffect = Main.AstroPad.canReadFruit();
	var isFrugivore = Main.AstroPad.isFrugivore();
	var confirmed = 0; //1: confirmed; 0: didn't ask yet; -1: refused
	var $it1 = Main.items.iterator();
	var inb_cam = 0;
	var inb_drone = 0;
	while ($it1.hasNext()) {
		$it = $it1.next();
		if ($it.iid == "CAMERA" && !$('[serial="' + $it.serial + '"]').length) { //If it's not an item
			inb_cam++;
		}
		if ($it.iid == "HELP_DRONE") {
			inb_drone++;
		}
	}
	if (inb_drone > 0) {
		Main.AstroPad.items.push({
			roomId: rid,
			name: Main.AstroPad.txt.drone,
			id: 'help_drone',
			amount: inb_drone,
			properties: { charges: null, broken: false, foodState: null, frozen: false, plantThirst: null, plantIll: false, foodEffects: [] },
			day: 0
		});
	}
	if (inb_cam > 0) {
		Main.AstroPad.items.push({
			roomId: rid,
			name: Main.AstroPad.txt.camera,
			id: 'camera',
			amount: inb_cam,
			properties: { charges: null, broken: false, foodState: null, frozen: false, plantThirst: null, plantIll: false, foodEffects: [] },
			day: 0
		});
	}
	var $it2 = Main.npc.iterator();
	if ($it2.hasNext() && !$('#myInventory [data-id="BODY_CAT"]').length) {
		Main.AstroPad.items.push({
			roomId: rid,
			name: "Schrödinger",
			id: 'body_cat',
			amount: 1,
			properties: { charges: null, broken: false, foodState: null, frozen: false, plantThirst: null, plantIll: false, foodEffects: [] },
			day: 0
		});
	}

	var childs = $("#room").children(':not(.cdEmptySlot)');
	if (childs.size() > 0) {
		childs.each(function() {
			var li = $(this);
			var dataId = li.attr('data-id');
			var dataTip = li.attr('data-tip');
			var dataName = li.attr('data-name');
			var iimg = li.find("td").css('background-image').replace('url(', '').replace(/[)"]/g, '');
			var iid = iimg.replace('.jpg', '').replace(/\\/g, '/').replace(/.*\//, '');
			var iname = 'item';
			var idetail = { charges: null, broken: false, foodState: null, frozen: false, plantThirst: null, plantIll: false, foodEffects: [] };
			var desc = li.attr("data-desc");
			var pushToConso = false;
			
			if (['tracker', 'super_talky', 'talky_walky'].indexOf(iid) != -1) {
				return true; //jQuery .each: non-false return = continue
			}

			var shareEffect = false;
			if (desc.indexOf(Main.AstroPad.txt.effect) != -1 || desc.indexOf(Main.AstroPad.txt.effect2) != -1 ) { //If the item has food effects
				function canShare() {
					if (confirmed == 0) {
						if (confirm(Main.AstroPad.txt.updateEffect)) {
							confirmed = 1;
						}
						else {
							confirmed = -1;
						}
					}
					if (confirmed == 1) {
						shareEffect = true;
					} //if -1: already false
					pushToConso = true;
				}
				
				if (desc.indexOf(Main.AstroPad.txt.chef) != -1 && readFoodEffect) {
					canShare();
				}
				else if (desc.indexOf(Main.AstroPad.txt.chef) == -1 && desc.indexOf(Main.AstroPad.txt.botanist) == -1 && readPillsEffect) {
					canShare();
				}
				else if (desc.indexOf(Main.AstroPad.txt.botanist) != -1 && readFruitEffect) {
					canShare();
				}
			}
			if (shareEffect) {
				var lines = desc.split('</p>');
				for (var i = 0; i < lines.length; i++) {
					var line = lines[i].replace(/\\r\\n/g, '').trim();
					//Don't update Food poisoning, else it messes with different
					if (Main.AstroPad.txt.intoxRegExp.test(line)) {
						continue;
					}
					var chances = null;
					var delay = null;
					if (Main.AstroPad.txt.chancesRegExp.test(line)) { //Chances of the effect (if any)
						chances = Main.AstroPad.txt.chancesRegExp.exec(line)[1];
						line = line.replace(Main.AstroPad.txt.chancesRegExp, '').trim();
					}
					if (Main.AstroPad.txt.delayRegExp.test(line)) { //Delay of the effect (if any)
						var delayArray = Main.AstroPad.txt.delayRegExp.exec(line);
						delay = delayArray[1] + '-' + delayArray[2];
						line = line.replace(Main.AstroPad.txt.delayRegExp, '').trim();
					}
						
					if (/lp\.png/.exec(line)) {
						idetail.foodEffects.push({
							type: 'hp', chances: chances, delay: delay,
							value: parseInt(/(\+|-)[0-9]+/.exec(line)[0])
						});
					}
					else if (/moral\.png/.exec(line)) {
						idetail.foodEffects.push({
							type: 'moral', chances: chances, delay: delay,
							value: parseInt(/(\+|-)[0-9]+/.exec(line)[0])
						});
					}
					else if (/pa_slot1\.png/.exec(line)) {
						var effectAP = parseInt(/(\+|-)[0-9]+/.exec(line)[0]);
						if (isFrugivore && Main.AstroPad.allItems[iid][5] == 'fruit') {
							if (iid == 'fruit00') {
								effectAP -= 1;
							}
							else {
								effectAP -= 2;
							}
						}
						idetail.foodEffects.push({
							type: 'pa', chances: chances, delay: delay,
							value: effectAP
						});
					}
					else if (/pa_slot2\.png/.exec(line)) {
						idetail.foodEffects.push({
							type: 'pm', chances: chances, delay: delay,
							value: parseInt(/(\+|-)[0-9]+/.exec(line)[0])
						});
					}
					else if (new RegExp(Main.AstroPad.txt.satisfaction).exec(line)) {
						idetail.foodEffects.push({
							type: 'satisfaction', chances: chances, delay: delay,
							value: parseInt(/(\+|-)[0-9]+/.exec(line)[0])
						});
					}
					else if (Main.AstroPad.txt.curesTip.test(line)) {
						idetail.foodEffects.push({
							type: 'cures', chances: chances, delay: delay,
							value: line.replace(/<\\?p>/g, '').replace(Main.AstroPad.txt.curesTip, '').trim()
						});
					}
					else if (Main.AstroPad.txt.causesTip.test(line)) {
						idetail.foodEffects.push({
							type: 'causes', chances: chances, delay: delay,
							value: line.replace(/<\\?p>/g, '').replace(Main.AstroPad.txt.causesTip, '').trim()
						});
					}
				}
			}

			if (dataName.indexOf('hidden.png') == -1) {
				var qte = li.children('.qty:first');
				
				iname = Main.AstroPad.capitalize(decodeURIComponent(/namey[0-9]+:(.+)g$/.exec(dataTip)[1])).replace(/\s+/g, ' '); //To get the magebook skill

				var n = parseInt(qte.text().trim());
				if (n) {
					var inb = n;
				}
				else {
					var inb = 1;
				}

				if (dataName.indexOf('food_frozen') != -1) {
					idetail.frozen = true;
				}
				if (readFoodEffect) {
					if (dataName.indexOf('food_unstable') != -1) {
						idetail.foodState = 'unstable';
					}
					if (dataName.indexOf('food_hazardous') != -1) {
						idetail.foodState = 'hazardous';
					}
					if (desc.indexOf('food_decaying') != -1) {
						idetail.foodState = 'decaying';
					}
				}

				if (dataName.indexOf('broken.png') != -1) {
					idetail.broken = true;
				}
				var icharge = />x([0-9]+)/.exec(dataName);
				if (icharge) {
					idetail.charges = parseInt(icharge[1]);
				}

				if (dataName.indexOf("thirsty") != -1) {
					idetail.plantThirst = 'thirsty';
				}
				else if (dataName.indexOf("dry") != -1) {
					idetail.plantThirst = 'dry';
				}
				if (dataName.indexOf("diseased") != -1) {
					idetail.plantIll = true;
				}

				Main.AstroPad.items.push({ roomId: rid, name: iname, id: iid, amount: inb, properties: idetail, originalProperties: idetail, day: 0, pushToConso: pushToConso });
			}
		});
	}

	if (tamper) {
		Main.AstroPad.buildAstromod(sendCallback);
	}
	else {
		Main.AstroPad.sendData(sendCallback);
	}
};
exportFunction(Main.AstroPad.updateInventory, unsafeWindow.Main.AstroPad, { defineAs: 'updateInventory' });

Main.AstroPad.reset = function() {
	if (confirm(Main.AstroPad.txt.unlink.replace('%1', Main.AstroPad.getStorage('gid')))) {
		localStorage.removeItem('ASTROPAD_' + Main.AstroPad.language + 'gid');
		localStorage.removeItem('ASTROPAD_' + Main.AstroPad.language + 'gkey');
		localStorage.removeItem('ASTROPAD_' + Main.AstroPad.language + 'rkey');
		Main.AstroPad.fill("");
	}
};

Main.AstroPad.configuration = function() {
	var credits = $('<p>').text(Main.AstroPad.txt.credits).css({ marginBottom: '10px', fontStyle: 'italics', fontSize: '0.9em', textAlign: 'center' });

	var gid = Main.AstroPad.getStorage('gid');
	var gkey = Main.AstroPad.getStorage('gkey');
	var rkey = Main.AstroPad.getStorage('rkey');
	if (!rkey) {
		rkey = gkey;
	}
	var message = Main.AstroPad.getStorage('shareMessage');
	if (!message) {
		message = Main.AstroPad.txt.defaultShareMessage;
	}

	var padCode = "http://" + document.domain + "?astroId=" + gid + "&astroKey=" + gkey;
	var urlMap = "http://astropad.sunsky.fr/?gid=" + gid + "&rkey=" + rkey + "&language=" + Main.AstroPad.language;
	var instructionsDiv = $('<div>');
	$('<div>').addClass('cdMushLog cdChatLine').html(
	  "<div class='bubble bubble2 tid_editorContent tid_parsed'>"
	+ "    <img src='/img/design/pixel.gif' class='char' style='background: url(http://imgup.motion-twin.com/twinoid/0/1/d9869944_14716.jpg) !important; height: 42px;'>"
	+ "    <div class='talks'>"
	+ "        <div class='triangleright'></div>"
	+ "        <span class='buddy'>Sunsky :</span>"
	+ "        <p>" + Main.AstroPad.txt.greetShareMessage + "</p>"
	+ "        <div class='clear'></div>"
	+ "    </div>"
	+ "</div>").appendTo(instructionsDiv);
	$('<div>').addClass('cdMushLog cdChatLine').html(
	  "<div class='bubble tid_editorContent tid_parsed'>"
	+ "    <img src='/img/design/pixel.gif' class='char derek'>"
	+ "    <div class='talks'>"
	+ "        <div class='triangleleft'></div>"
	+ "        <span class='buddy'>LAbare :</span>"
	+ "        <p>" + Main.AstroPad.txt.greetShareMessage2 + "</p>"
	+ "        <div class='clear'></div>"
	+ "    </div>"
	+ "</div>").appendTo(instructionsDiv);

	//Message to share the AstroPad
	var textarea = $('<textarea>').css({
		color: 'black', width: '100%', height: '250px', fontSize: '0.9em'
	}).val(message.replace('%t', Main.AstroPad.txt.helpTopic).replace('%u', padCode).replace('%v', urlMap));

	var button = Main.AstroPad.createButton(Main.AstroPad.txt.changeShareMessage).css('margin-top', '20px').on('click', function() {
		//Change message
		var newtext = $('<textarea>').attr('id', 'astro-config-message').css({ color: 'black', width: '100%', height: '150px' }).val(message);
		var save = Main.AstroPad.createButton(Main.AstroPad.txt.saveShareMessage).css('margin-top', '20px').on('click', function() {
			var text = $('#astro-config-message').val();
			if (text) {
				Main.AstroPad.setStorage('shareMessage', text);
			}
			Main.AstroPad.configuration();
		});
		Main.AstroPad.fill([$('<p>').html(Main.AstroPad.txt.helpShareMessage).css('padding', '3px'), newtext, save]);
	});

	Main.AstroPad.fill([credits, instructionsDiv, textarea, button]);
};

Main.AstroPad.viewInventory = function() {
	var gid = Main.AstroPad.getStorage('gid');
	var gkey = Main.AstroPad.getStorage('gkey');
	var rkey = Main.AstroPad.getStorage('rkey');
	if (!rkey) {
		rkey = gkey;
	}

	window.open("http://astropad.sunsky.fr/?gid=" + gid + "&rkey=" + rkey + "&language=" + Main.AstroPad.language, '_blank');
};

Main.AstroPad.new = function() {
	var url = Main.AstroPad.urlAstro + "/newInv";
	var data = "api=1";
	console.log(url + '?' + data);
	GM.xmlHttpRequest({
		method: 'GET',
		url: url + "?" + data,
		onload: function(responseDetails) {
			var res = responseDetails.responseText.replace(/\n/g, '').replace(/\r/g, '').split('|');
			if (res.length != 2) {
				return;
			}
			var gid = res[0];
			var gkey = res[1];
			if (confirm(Main.AstroPad.txt.link.replace('%1', gid).replace('%2', gkey))) {
				Main.AstroPad.setStorage('gid', gid);
				Main.AstroPad.setStorage('gkey', gkey);
				Main.AstroPad.getInventory();
			}
		}
	});
};

Main.AstroPad.analyseFoodEffect = function(line) {
	var delay = new RegExp('\\(([0-9]+-[0-9]+) ' + Main.AstroPad.txt.cycles.replace(/\(|\)/g, '\\$&') + '\\)').exec(line);
	if (delay) {
		line = line.replace(delay[0], ''); //Isolate value
		delay = delay[1];
	}
	else {
		delay = null;
	}

	var chances = /([0-9]+)% :/.exec(line);
	if (chances) {
		line = line.replace(chances[0], '');
		chances = parseInt(chances[1]);
	}
	else {
		chances = 100;
	}

	var type;
	var value;
	if (line.search(':pa:') != -1) {
		type = 'pa';
		value = parseInt(/-?[0-9]+/.exec(line)[0]);
	}
	else if (line.search(':pm:') != -1) {
		type = 'pm';
		value = parseInt(/-?[0-9]+/.exec(line)[0]);
	}
	else if (line.search(':hp:') != -1) {
		type = 'hp';
		value = parseInt(/-?[0-9]+/.exec(line)[0]);
	}
	else if (line.search(':moral:') != -1) {
		type = 'moral';
		value = parseInt(/-?[0-9]+/.exec(line)[0]);
	}
	else if (line.search(':pa_cook:') != -1) {
		type = 'satisfaction';
		value = parseInt(/-?[0-9]+/.exec(line)[0]);
	}
	else if (line.search(Main.AstroPad.txt.curesText) != -1) {
		type = 'cures';
		value = line.replace(Main.AstroPad.txt.curesText, '').trim();
	}
	else if (line.search(Main.AstroPad.txt.causesText) != -1) {
		type = 'causes';
		value = line.replace(Main.AstroPad.txt.causesText, '').trim();
	}
	else { //Invalid effect
		return false;
	}

	return { type: type, value: value, chances: chances, delay: delay };
}

Main.AstroPad.getLocalData = function() {
	/*
	Returns an object, each key being a room number and each value an array of items, each item being an object with the following structure:
		{
			roomId: int,
			name: string,
			id: string,
			amount: int,
			properties: {
				charges: int or false,
				broken: bool,
				foodState: string or false,
				frozen: bool,
				plantThirst: string or false,
				plantIll: bool,
				foodEffects: array
			},
			lastUpdate: string,
			updater: int
		}
	If the room is empty, the array will contain only one item object, with the 'id' key having the value 'empty'. This allows access to information about the last update.
	Known food effects are stored under the key 'allFoodEffects' as an array of items, each being an object with the following structure:
		{
			id: string,
			name: string,
			foodEffects: array
		}
	A foodEffects array contains one object for each food effect, with the following structure:
		{
			type: string, //'pa', 'pm', 'hp', 'moral', 'satisfaction', 'cures', 'causes'
			value: string if type in ['cures', 'causes'], else int,
			chances: int,
			delay: string ('A-B') or null
		}
	*/
	if (!Main.AstroPad.getStorage('localData')) {
		return false;
	}
	var data = { allFoodEffects: [] };
	var rooms = Main.AstroPad.getStorage('localData').split('#');
	Main.AstroPad.setStorage('rkey', rooms[0].replace("\n", ''));
	for (var i = 1; i < rooms.length; i++) { //rooms[0] being rkey
		var items = rooms[i].split('\n');
		var id = parseInt(items[0]);
		if (id == 37) { //General food effects
			for (var j = 1; j < items.length; j++) {
				if (!items[j]) {
					continue;
				}
				var effects = [];
				var parts = items[j].split('|');
				//Analysing raw properties
				var rawProps = parts[4].split(', ');
				for (var k = 0; k < rawProps.length; k++) {
					var effect = Main.AstroPad.analyseFoodEffect(rawProps[k]);
					if (effect) {
						effects.push(effect);
					}
				}
				data.allFoodEffects.push({ id: parts[1], name: Main.AstroPad.allItems[parts[1]][Main.AstroPad.lang], foodEffects: effects });
			}
		}
		data[id] = [];
		for (var j = 1; j < items.length; j++) {
			if (!items[j]) {
				continue;
			}
			var parts = items[j].split('|');
			if (parts[1] == 'empty') {
				parts[0] = Main.AstroPad.txt.empty;
			}
			if (parts[4]) { //conso properties
				parts[3] = parts[4];
			}
			var properties = {
				charges: null,
				broken: false,
				foodState: null,
				frozen: false,
				plantThirst: null,
				plantIll: false,
				foodEffects: []
			};

			//Analysing raw properties
			var rawProps = parts[3].split(', ');
			for (var k = 0; k < rawProps.length; k++) {
				var line = rawProps[k];
				//Charges
				if (line.indexOf(Main.AstroPad.txt.charges) != -1) {
					properties.charges = parseInt(/[0-9]+/.exec(line)[0]);
				}
				//Broken
				else if (line.search(Main.AstroPad.txt.broken) != -1) {
					properties.broken = true;
				}
				//Food state
				else if (line.search(Main.AstroPad.txt.unstable) != -1) {
					properties.foodState = 'unstable';
				}
				else if (line.search(Main.AstroPad.txt.hazardous) != -1) {
					properties.foodState = 'hazardous';
				}
				else if (line.search(Main.AstroPad.txt.decaying) != -1) {
					properties.foodState = 'decaying';
				}
				//Frozen
				else if (line.search(Main.AstroPad.txt.frozen) != -1) {
					properties.frozen = true;
				}
				//Plant thirst
				else if (line.search(Main.AstroPad.txt.thirsty) != -1) {
					properties.plantThirst = 'thirsty';
				}
				else if (line.search(Main.AstroPad.txt.dry) != -1) {
					properties.plantThirst = 'dry';
				}
				//Plant disease
				else if (line.search(Main.AstroPad.txt.diseased) != -1) {
					properties.plantIll = true;
				}
				//Food effects
				else {
					var effect = Main.AstroPad.analyseFoodEffect(line);
					if (effect) {
						properties.foodEffects.push(effect);
					}
					else {
						continue;
					}
				}
			}

			data[id].push({
				roomId: id,
				name: Main.AstroPad.capitalize(parts[0]),
				id: parts[1],
				amount: parseInt(parts[2]),
				properties: properties,
				lastUpdate: parts[6],
				updater: parseInt(parts[7])
			});
		}
	}
	console.log('data:');
	console.log(data);
	return data;
};
exportFunction(Main.AstroPad.getLocalData, unsafeWindow.Main.AstroPad, { defineAs: 'getLocalData' });

Main.AstroPad.getInventory = function(callback) {
	if (!Main.AstroPad.getStorage('gid') || !Main.AstroPad.getStorage('gkey')) {
		return;
	}
	var url = Main.AstroPad.urlAstro + "/getItems";
	var text = "";
	var data = Main.AstroPad.getData();
	
	Main.AstroPad.fill($('<div>').css('text-align', 'center').html("<img src='/img/icons/ui/loading1.gif' /> " + Main.AstroPad.txt.loading));

	console.log(url + '?' + data);
	GM.xmlHttpRequest({
		method: 'GET',
		url: url + "?" + data,
		onload: function(responseDetails, callback) {
			var res = responseDetails.responseText.replace(/�/g, 'è').replace(/</g, "&lt;").replace(/>/g, "&gt;");
			Main.AstroPad.setStorage('localData', res);
			//console.log(res);
			var elements = [];
			var rooms = res.split('#');
			var roomsDict = {};
			var infos = rooms[0].split('|');

			Main.AstroPad.setStorage('rkey', infos[0].replace("\n", ''));
			for (var j = 1; j < rooms.length; j++) {
				var its = rooms[j].split('\n');
				var roomId = parseInt(its[0]);
				roomsDict[roomId] = its;
			}
			for (var j = 0; j < Main.AstroPad.roomOrder.length; j++) {
				var roomId = Main.AstroPad.roomOrder[j];
				if (!(roomId in roomsDict)) {
					continue;
				}
				var its = roomsDict[roomId];

				var roomTitle = $('<div>').addClass('astro_rid_' + roomId).attr('id', 'astro_rid_' + roomId);
				$('<b>').text(Main.AstroPad.roomNames[roomId]).appendTo(roomTitle);
				elements.push(roomTitle);

				if (its.length > 2) {
					var div = $('<div>').addClass('what_happened');
					var table = $('<table>').addClass('table').appendTo(div);
					
					for (var i = 1; i < its.length - 1; i++) {
						var tr = $('<tr>').appendTo(table);
						var tdImg = $('<td>').css({ width: '35px', height: '35px', padding: 0 }).appendTo(tr);
						var tdText = $('<td>').css({ textAlign: 'left', padding: 0, paddingLeft: '2px' }).appendTo(tr);
						var tdFooter = $('<td>').css({ fontSize: '10px', textAlign: 'right', verticalAlign: 'bottom', width: '75px' }).appendTo(tr);

						var parts = its[i].split('|');
						var iname = parts[0];
						var iid = parts[1];
						var date = parts[6];
						var heroid = parts[7];

						var footer = Main.AstroPad.txt.by + " " + Main.AstroPad.heronames[heroid] + "<br>" + Main.AstroPad.txt.the + " " + date.substring(6, 8) + " " + Main.AstroPad.txt.at + " " + date.substring(8, 10) + ":" + date.substring(10, 12);

						if (iid == "empty") {
							tdImg.text(Main.AstroPad.txt.empty);
							tdFooter.html(footer);
							continue;
						}

						if (parts[4]) { //Attributes sent from the conso var
							var idetail = parts[4];
						}
						else {
							var idetail = parts[3];
						}

						//Name and attributes
						function toImg(text, exp, img, alt) {
							return text.replace(exp, "<img src='/img/icons/ui/" + img + ".png' alt='" + alt + "' title='" + alt + "' />");
						}

						iname = Main.AstroPad.capitalize(iname);
						iname = toImg(iname, Main.AstroPad.capitalize(Main.AstroPad.txt.thirsty), "plant_thirsty", Main.AstroPad.txt.thirsty);
						iname = toImg(iname, Main.AstroPad.capitalize(Main.AstroPad.txt.dry), "plant_dry", Main.AstroPad.txt.dry);
						iname = toImg(iname, Main.AstroPad.capitalize(Main.AstroPad.txt.diseased), "plant_diseased", Main.AstroPad.txt.diseased);
						iname = toImg(iname, Main.AstroPad.capitalize(Main.AstroPad.txt.broken), "broken", Main.AstroPad.txt.broken);
						iname = toImg(iname, Main.AstroPad.txt.frozen, "food_frozen", Main.AstroPad.txt.frozen);
						if (idetail) {
							idetail = toImg(idetail, /:pa:/g, 'pa_slot1', 'pa');
							idetail = toImg(idetail, /:moral:/g, 'moral', 'moral');
							idetail = toImg(idetail, /:pm:/g, 'pa_slot2', 'pm');
							idetail = toImg(idetail, /:hp:/g, 'lp', 'hp');
							idetail = toImg(idetail, Main.AstroPad.txt.satisfaction, 'pa_cook', Main.AstroPad.txt.satisfaction);
							idetail = toImg(idetail, /:pa_cook:/g, 'pa_cook', Main.AstroPad.txt.satisfaction);
							idetail = toImg(idetail, ' ' + Main.AstroPad.txt.charges, 'charge', Main.AstroPad.txt.charges);
							idetail = toImg(idetail, new RegExp(Main.AstroPad.txt.curesText, "g"), "pa_heal", 'heal');
							idetail = " : <i>" + idetail + "</i>";
						}

						//Quantity
						var inb = parts[2];
						if (inb != "1") {
							inb = " (x" + inb + ")";
						}
						else {
							inb = "";
						}

						//Build row
						$('<img>').attr('src', "http://" + Main.AstroPad.urlMush + "/img/icons/items/" + iid + ".jpg").css({ width: '35px', height: '35px' }).appendTo(tdImg);
						$('<b>').html(iname + inb).appendTo(tdText);
						tdText.append(idetail);
						tdFooter.html(footer);
					}
					elements.push(div);
				}
			}
			
			//Food effects table
			var allFoodEffectsBlock = $('<div>').addClass('what_happened');
			var allFoodEffectsTable = $('<table>').addClass('table').appendTo(allFoodEffectsBlock);
			if (37 in roomsDict) {
				var its = roomsDict[37];
				for (var i = 1; i < its.length - 1; i++) {
					var parts = its[i].split('|');
					var idetail = parts[4];
					var tr = $('<tr>').appendTo(allFoodEffectsTable);
					var tdImg = $('<td>').css({ width: '35px', height: '35px', padding: 0 }).appendTo(tr);
					var tdText = $('<td>').css({ textAlign: 'left', padding: 0, paddingLeft: '2px' }).appendTo(tr);

					//Name and attributes
					function toImg(text, exp, img, alt) {
						return text.replace(exp, "<img src='/img/icons/ui/" + img + ".png' alt='" + alt + "' title='" + alt + "' />");
					}
					idetail = toImg(idetail, /:pa:/g, 'pa_slot1', 'pa');
					idetail = toImg(idetail, /:moral:/g, 'moral', 'moral');
					idetail = toImg(idetail, /:pm:/g, 'pa_slot2', 'pm');
					idetail = toImg(idetail, /:hp:/g, 'lp', 'hp');
					idetail = toImg(idetail, Main.AstroPad.txt.satisfaction, 'pa_cook', Main.AstroPad.txt.satisfaction);
					idetail = toImg(idetail, /:pa_cook:/g, 'pa_cook', Main.AstroPad.txt.satisfaction);
					idetail = toImg(idetail, ' ' + Main.AstroPad.txt.charges, 'charge', Main.AstroPad.txt.charges);
					idetail = toImg(idetail, new RegExp(Main.AstroPad.txt.curesText, "g"), "pa_heal", 'heal');

					$('<img>').attr('src', "http://" + Main.AstroPad.urlMush + "/img/icons/items/" + parts[1] + ".jpg").css({ width: '35px', height: '35px' }).appendTo(tdImg);
					$('<b>').html(Main.AstroPad.allItems[parts[1]][Main.AstroPad.lang]).appendTo(tdText);
					tdText.append(" : <i>" + idetail + "</i>");
				}
			}

			elements.push(
				$('<p>').html('<b>' + Main.AstroPad.txt.allFoodEffectsTitle + '</b>').css('margin-top', '15px')
			);
			//Note on Mushes and food effects
			elements.push(
				$('<p>').text(Main.AstroPad.txt.foodNote).css({ color: 'white', backgroundColor: '#802', padding: '2px' })
			);
			//Add general food effects table
			elements.push(allFoodEffectsBlock);

			Main.AstroPad.fill(elements, "#astro_rid_" + Main.AstroPad.getRoomId());
			if (typeof callback == 'function') {
				callback();
			}
		}
	});
};
exportFunction(Main.AstroPad.getInventory, unsafeWindow.Main.AstroPad, { defineAs: 'getInventory' });

Main.AstroPad.getInventoryTxt = function() {
	if (!Main.AstroPad.getStorage('gid') || !Main.AstroPad.getStorage('gkey')) {
		return;
	}
	var data = Main.AstroPad.getLocalData();
	if (!data) {
		console.log("No data found.");
		return;
	}
	var elements = [];

	//First select which rooms to share
	elements.push($('<h3>').css('text-align', 'center').text(Main.AstroPad.txt.titleTxtInventory));

	var buttons = $('<div>').css('text-align', 'center');
	Main.AstroPad.createButton(Main.AstroPad.txt.checkAll).css({ display: 'inline-block', width: '45%' }).on('click', function() {
		$('.astromod-txtinv-room input').each(function() { $(this)[0].checked = true; });
	}).appendTo(buttons);
	Main.AstroPad.createButton(Main.AstroPad.txt.uncheckAll).css({ display: 'inline-block', width: '45%', marginLeft: '5px' }).on('click', function() {
		$('.astromod-txtinv-room input').each(function() { $(this)[0].checked = false; });
	}).appendTo(buttons);
	//Share general food effects
	Main.AstroPad.createButton(Main.AstroPad.txt.allFoodEffectsButton).on('click', function() {
		var txt = "**" + Main.AstroPad.txt.allFoodEffectsTitle + "**\n";
		for (var i = 0; i < data.allFoodEffects.length; i++) {
			var idetail = Main.AstroPad.propertiesToText({
				charges: null, broken: null, foodState: null, frozen: null, plantThirst: null, plantIll: null,
				foodEffects: data.allFoodEffects[i].foodEffects
			});
			idetail = idetail[1];
			idetail = idetail.replace(Main.AstroPad.txt.satisfaction, ":pa_cook:");
			idetail = idetail.replace(new RegExp(Main.AstroPad.txt.curesText, "g"), ":pa_heal:");
			txt += "- " + data.allFoodEffects[i].name + " : //" + idetail + "****//\n";
		}
		Main.AstroPad.fill($('<textarea>').css({ fontSize: '8pt', color: 'black', width: '100%', height: '100%' }).val(txt));
	}).appendTo(buttons);
	elements.push(buttons);

	var div = $('<div>').addClass('what_happened');
	var table = $('<table>').addClass('table').appendTo(div);

	for (var i = 0; i < Main.AstroPad.roomOrder.length; i++) {
		//Alphabetical order
		var id = Main.AstroPad.roomOrder[i];
		if (!data.hasOwnProperty(id)) {
			continue;
		}

		var room = data[id];
		var txt = "-**" + Main.AstroPad.roomNames[id] + "**";
		for (var j = 0; j < room.length; j++) {
			//Empty rooms have a special 'empty' item
			var item = room[j];
			if (j == 0) {
				txt += " //[" + Main.AstroPad.heronames[item.updater] + ", " + item.lastUpdate.substring(6, 8) + "/" + item.lastUpdate.substring(4, 6) + " " + item.lastUpdate.substring(8, 10) + ":" + item.lastUpdate.substring(10, 12) + "]// : ";
				if (item.id != 'empty') {
					txt += "\n";
				}
			}

			//Quantity
			var inb = item.amount;
			if (inb > 1) {
				inb = " (x" + inb + ")";
			}
			else {
				inb = "";
			}
			txt += item.name + inb;

			//Properties
			var idetail = Main.AstroPad.propertiesToText(item.properties)[1];
			if (idetail) {
				idetail = idetail.replace(Main.AstroPad.txt.satisfaction, ":pa_cook:");
				idetail = idetail.replace(new RegExp(Main.AstroPad.txt.curesText, "g"), ":pa_heal:");
				txt += " //" + idetail + "****//";
			}

			txt += ", ";
		}
		txt = txt.slice(0, -2) + ".";

		var tr = $('<tr>').addClass('astromod-txtinv-room').appendTo(table);
		$('<input>').attr('type', 'checkbox').appendTo($('<td>').css('width', '25px').appendTo(tr));
		$('<td>').addClass('astromod-txtinv-text').text(txt).appendTo(tr);
	}
	elements.push(div);
			
	elements.push(Main.AstroPad.createButton(Main.AstroPad.txt.generateTxtInventory).on('click', function() {
		var texts = ["**//" + Main.AstroPad.txt.inventory + "//**"];
		$('.astromod-txtinv-room').each(function() {
			//Retrieve all checked rooms
			if ($(this).find('input').is(':checked')) {
				texts.push($(this).find('.astromod-txtinv-text').text());
			}
		});
		Main.AstroPad.fill($('<textarea>').css({ fontSize: '8pt', color: 'black', width: '100%', height: '100%' }).val(texts.join("\n")));
	}));
	Main.AstroPad.fill(elements);
};

Main.AstroPad.fill = function(elements, gotoelemid) {
	var gid = Main.AstroPad.getStorage('gid');

	var mainDiv = $('<div>').css("color", "rgb(9, 10, 97)").appendTo($("#astrotab_content").empty());
	function addButton(src, text, hasText, func, parent) {
		$('<img>').attr({ src: src, title: text }).appendTo(
			$('<a>').addClass('butmini').attr('href', '#').append((hasText ? text : '')).on('click', func).appendTo(parent)
		);
	}

	//Header
	if (gid) {
		$('<div>').addClass('objtitle').html("<img src='/img/icons/ui/pa_comp.png'> AstroPad (n°" + gid + ") <img src='/img/icons/ui/pa_comp.png'>").appendTo(mainDiv);
		var menu = $('<div>').addClass('replybuttons').appendTo(mainDiv);
		addButton('/img/icons/ui/projects_done.png', Main.AstroPad.txt.submit, true, function() { Main.AstroPad.updateInventory(false); }, menu);
		addButton('/img/icons/ui/pa_comp.png', Main.AstroPad.txt.accessAstromod, true, function() { Main.AstroPad.updateInventory(true); }, menu);
		addButton('http://twinoid.com/img/icons/refresh.png', Main.AstroPad.txt.refresh, false, function() { Main.AstroPad.getInventory(); }, menu);
		addButton('/img/icons/ui/notes.gif', Main.AstroPad.txt.list, false, Main.AstroPad.getInventoryTxt, menu);
		addButton('http://www.hordes.fr/gfx/forum/smiley/h_exploration.gif', Main.AstroPad.txt.show, false, Main.AstroPad.viewInventory, menu);
		addButton('/img/icons/ui/guide.png', Main.AstroPad.txt.help, true, Main.AstroPad.configuration, menu);
		addButton('/img/icons/ui/goldplus.png', Main.AstroPad.txt.newPad, true, Main.AstroPad.new, menu);
		addButton('/img/icons/ui/close.png', Main.AstroPad.txt.exit, false, Main.AstroPad.reset, menu);
	}
	else {
		$('<div>').addClass('objtitle').html("<img src='/img/icons/ui/pa_comp.png'> AstroPad <img src='/img/icons/ui/pa_comp.png'>").appendTo(mainDiv);
		addButton('/img/icons/ui/goldplus.png', Main.AstroPad.txt.newPad, true, Main.AstroPad.new, $('<div>').addClass('replybuttons').appendTo(mainDiv));
	}

	var contentDiv = $('<div>').attr('id', 'astro_scrollpanel').addClass('astro_scrollpanel').css({ overflow: 'auto', height: '400px' }).appendTo(mainDiv);
	//Add elements
	if (elements.length > 1) { //Array of elements
		for (var i = 0; i < elements.length; i++) {
			if (elements[i] && elements[i].appendTo != undefined) {
				elements[i].appendTo(contentDiv);
			}
		}
	}
	else { //One or zero elements
		if (elements) {
			elements.appendTo(contentDiv);
		}
	}
	
	$('#astrotab_content').find('.replybuttons a').each(function(){
		$(this).on('click', function(e) {
			e.preventDefault();
		});
	});

	//Scroll to an element
	if (gotoelemid) {
		var scroll = $("#astro_scrollpanel");
		var room = $(gotoelemid);
		room.show();
		if (room.offset()) {
			scroll.scrollTop(scroll.scrollTop() + room.offset().top - scroll.offset().top);
		}
	}
};

Main.AstroPad.urlToLink = function() {
	var pad = /(?:<[a-oq-z<>]+>)?(https?:\/\/mush\.(?:vg|twinoid\.(?:com|es))\/?\?astroId=(?:[0-9]+)&(?:amp;)?astroKey=[0-9a-f]+)(?:<[a-oq-z<>\/]+>)?(?:\[[^\]]+\])?/;
	var map = /(?:<[a-oq-z<>]+>)?(https?:\/\/astropad\.sunsky\.fr\/\?gid=(?:[0-9]+)&(?:amp;)?rkey=(?:[0-9a-f]+)&(?:amp;)?language=(?:en|es)?)(?:<[a-oq-z<>\/]+>)?(?:\[[^\]]+\])?/;
	var padTextRegexp = /(<[a-oq-z<>]+>)?https?:\/\/mush\.(?:vg|twinoid\.(?:com|es))\?astroId=[0-9]+&(?:amp;)?astroKey=[0-9a-f]+(<[a-oq-z<>\/]+>)?(?:\[([^\]]+)\])?/;
	var mapTextRegexp = /(<[a-oq-z<>]+>)?https?:\/\/astropad\.sunsky\.fr\/\?gid=[0-9]+&(?:amp;)?rkey=[0-9a-f]+&(?:amp;)?language=(?:en|es)?(<[a-oq-z<>\/]+>)?(?:\[([^\]]+)\])?/;
	$('.bubble:not(.AstroPad-url)').each(function() {
		var bubble = $(this);
		var padText = Main.AstroPad.txt.linkPad;
		var mapText = Main.AstroPad.txt.linkMap;
		if (pad.test(bubble.text())) {
			var padTest = bubble.html().match(padTextRegexp);
			var before = "";
			var after = "";
			if (padTest && padTest.length >= 3) {
				if (padTest[3]) {
					padText = padTest[3];
				}
				if (padTest[1] && padTest[2]) { //HTML tags
					before = padTest[1];
					after = padTest[2];
				}
			}
			bubble.html(bubble.html().replace(pad, before + "<a href='$1' onclick='Main.AstroPad.joinPad(this); return false;'>" + padText + "</a>" + after));
			bubble.css('padding-bottom', '24px');
		}
		if (map.test(bubble.text())) {
			var mapTest = bubble.html().match(mapTextRegexp);
			var before = "";
			var after = "";
			if (mapTest && mapTest.length >= 3) {
				if (mapTest[3]) {
					mapText = mapTest[3];
				}
				if (mapTest[1] && mapTest[2]) { //HTML tags
					before = mapTest[1];
					after = mapTest[2];
				}
			}
			bubble.html(bubble.html().replace(map, before + "<a href='$1' target='_blank'>" + mapText + "</a>" + after));
			bubble.css('padding-bottom', '24px');
		}
		bubble.addClass('AstroPad-url');
	});
};

Main.AstroPad.setChatBlock = function() {
	//Trigger urlToLink in messages loaded by scrolling
	$('#chatBlock').on('scroll', function() { //Does not overwrite the 'onscroll' attr.
		if (unsafeWindow.Main.lmwProcessing) {
			var chatloading = window.setInterval(function() {
				if (!unsafeWindow.Main.lmwProcessing) { //Detect end of loading
					clearInterval(chatloading);
					Main.AstroPad.urlToLink();
				}
			}, 100);
			return true;
		}
	});
};

Main.AstroPad.joinPad = function(el) {
	var link = $(el).attr('href');
	var gid = /astroId=([0-9]+)/.exec(link);
	var gkey = /astroKey=([0-9a-f]+)/.exec(link);

	if (gid && gkey) {
		gid = gid[1];
		gkey = gkey[1];
		if (confirm(Main.AstroPad.txt.link.replace('%1', gid).replace('%2', gkey))) {
			Main.AstroPad.setStorage('gid', gid);
			Main.AstroPad.setStorage('gkey', gkey);
		}
	}
	return false;
};
exportFunction(Main.AstroPad.joinPad, unsafeWindow.Main.AstroPad, { defineAs: 'joinPad' });

Main.AstroPad.startScript = function() {
	//Detect AstroPad (old way)
	var gid = /astroId=([0123456789]+)/g.exec(window.location.href);
	var gkey = /astroKey=([0123456789abcdef]+)/g.exec(window.location.href);

	if (gid && gkey) {
		gid = gid[1];
		gkey = gkey[1];
		if (confirm(Main.AstroPad.txt.link.replace('%1', gid).replace('%2', gkey))) {
			localStorage['ASTROPAD_' + Main.AstroPad.language + 'gid'] = gid;
			localStorage['ASTROPAD_' + Main.AstroPad.language + 'gkey'] = gkey;
		}
	}

	//Remind players in new ships to get rid of their old AstroPad
	var curCycle = parseInt(Main.curCycle());
	if (Main.AstroPad.getStorage('gid')  && Main.AstroPad.getStorage('gkey')) { //Don't remind them if they haven't got one…
		if (Main.AstroPad.getStorage('curCycle') && parseInt(Main.AstroPad.getStorage('curCycle')) > curCycle) {
			$('<p>').css({ backgroundColor: '#800', padding: '2px', textAlign: 'center' }).text(Main.AstroPad.txt.newShip).appendTo($('#cdContent'));
		}
	}
	Main.AstroPad.setStorage('curCycle', curCycle);

	if($("#input").length == 0) {
		return;
	}
	console.log('Start AstroPad');

	Main.AstroPad.buildAstrotab();
	Main.AstroPad.urlToLink();
	Main.AstroPad.setChatBlock();
	setInterval(function() {
		if (!$('#astrotab').length) { //If the page has been updated
			Main.AstroPad.buildAstrotab();
			Main.AstroPad.urlToLink();
			Main.AstroPad.setChatBlock();
		}
	}, 1000);
};

Main.AstroPad.startScript();