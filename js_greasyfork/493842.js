// ==UserScript==
// @name         Trackers Labels
// @namespace    http://tampermonkey.net/
// @version      2025.05.16
// @description  Toolkit for trackers
// @match        *://trackers.pilotsystems.net/*
// @author       Marshkalk
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493842/Trackers%20Labels.user.js
// @updateURL https://update.greasyfork.org/scripts/493842/Trackers%20Labels.meta.js
// ==/UserScript==

// note for emoji : https://www.w3schools.com/charsets/ref_emoji_animals.asp

// Table de mapping des anciens textes vers les nouveaux textes
const textMapping = {
    "David" : {"name":"&#128110; david.sapiro", "type":"PilotSystem"},
    "Gael" : {"name":"gael.le-mignot", "type":"PilotSystem"},
    "Yoan" : {"name":"yoan.le-clanche", "type":"PilotSystem"},
    "Alexandre" : {"name":"&#129338; alexandre.baudet", "type":"Projet"},
    "Alexandre.b" : {"name":"&#129338; alexandre.baudet", "type":"Projet"},
    "Clement" : {"name":"&#128001; clement.mulot", "type":"Projet"},
    "Eric" : {"name":"eric.bourgeois", "type":"Projet"},
    "Hortense" : {"name":"hortense.baillet", "type":"Projet"},
    "Jerome" : {"name":"&#129422; jerome.coget", "type":"Projet"},
    "Lea" : {"name":"&#129446; lea.crepas", "type":"Projet"},
    "Melissande" : {"name":"&#129418; melissande.chene", "type":"Projet"},
    "Gregoire" : {"name":"gregoire.gaffie", "type":"Team"},
    "A.aittaleb" : {"name":"abderrahman.aittaleb", "type":"Webpick"},
    "A.amrani" : {"name":"amine.amrani", "type":"Webpick"},
    "A.elmarhraoui" : {"name":"ayoub.elmarhraoui", "type":"Webpick"},
    "A.khouziri" : {"name":"amine.khouziri", "type":"Webpick"},
    "Abouzaid" : {"name":"abdessamad.abouzaid", "type":"Webpick"},
    "Akchouch" : {"name":"youssef.akchouch", "type":"Webpick"},
    "Banaoui" : {"name":"zakaria.banaoui", "type":"Webpick"},
    "Bougarne" : {"name":"mohamed.bougarne", "type":"Webpick"},
    "Brahim.i" : {"name":"brahim.ibrahimi", "type":"Webpick"},
    "Dadda" : {"name":"abderrazzak.dadda", "type":"Webpick"},
    "Ext" : {"name":"externes", "type":"Webpick"},
    "Farah" : {"name":"raja.farah", "type":"Webpick"},
    "Gounane" : {"name":"abderrahim.gounane", "type":"Webpick"},
    "H.radouan" : {"name":"hamza.radouan", "type":"Webpick"},
    "Hajar" : {"name":"hajar.boussouf", "type":"Webpick"},
    "Ibtissam.b" : {"name":"ibtissam.benhaida", "type":"Webpick"},
    "Ikiker" : {"name":"farid.ikiker", "type":"Webpick"},
    "Ilham" : {"name":"ilham.siddik", "type":"Webpick"},
    "Karima" : {"name":"karima.el-ouakhoumi", "type":"Webpick"},
    "Laarifi" : {"name":"badr.laarifi", "type":"Webpick"},
    "M.aitahmed" : {"name":"mouad.ait-ahmed", "type":"Webpick"},
    "M.bourhaim" : {"name":"mohamed.bourhaim", "type":"Webpick"},
    "Mannasaf" : {"name":"sara.mannasaf", "type":"Webpick"},
    "Nadir" : {"name":"nadir.layoune", "type":"Webpick"},
    "Outmani" : {"name":"abdel-hamid.outmani", "type":"Webpick"},
    "Sarhir" : {"name":"ismail.sarhir", "type":"Webpick"},
    "Smaili" : {"name":"adil.smaili", "type":"Webpick"},
    "Tachafine" : {"name":"tachafine.ait-touda", "type":"Webpick"},
    "Taougar" : {"name":"hamza.taougar", "type":"Webpick"},
    "Y.bentaoui" : {"name":"yassine.bentaoui", "type":"Webpick"},
    "Younes.b" : {"name":"younes.bouhou", "type":"Webpick"},
    "Yousfi" : {"name":"mohamed.yousfi", "type":"Webpick"},
    "Z.aboudia" : {"name":"zakaria.aboudia", "type":"Webpick"},
    "Zitane" : {"name":"smail.zitane", "type":"Webpick"},
    "Zougari" : {"name":"mehdi.zougari-iben-el-khyat", "type":"Webpick"},
    "abdellatif.el-marhraoui" : {"name":"abdellatif.el-marhraoui", "type":"Webpick"},
    "abire.sogoyou" : {"name":"abire.sogoyou", "type":"Webpick"},
    "adel.attia" : {"name":"adel.attia", "type":"Team"},
    "agnes.becuwe" : {"name":"agnes.becuwe", "type":"Team"},
    "alexandre.botella" : {"name":"alexandre.botella", "type":"Team"},
    "alexandre.cortes" : {"name":"alexandre.cortes", "type":"Team"},
    "amandine.liard" : {"name":"amandine.liard", "type":"Team"},
    "anais.moine" : {"name":"anais.moine", "type":"Team"},
    "anas.ghamri" : {"name":"anas.ghamri", "type":"Team"},
    "aurelie.charrier" : {"name":"aurelie.charrier", "type":"Team"},
    "aurelie.lecloirec" : {"name":"aurelie.lecloirec", "type":"Team"},
    "caroline.canzi" : {"name":"caroline.canzi", "type":"Team"},
    "catherine.nowak" : {"name":"catherine.nowak", "type":"Team"},
    "cecilia.hopital" : {"name":"cecilia.hopital", "type":"Team"},
    "cecilia.ouibrahim" : {"name":"cecilia.ouibrahim", "type":"Team"},
    "celine.gerbier" : {"name":"celine.gerbier", "type":"Team"},
    "charles.lalaquit" : {"name":"charles.lalaquit", "type":"Team"},
    "charles.martinaud" : {"name":"charles.martinaud", "type":"Team"},
    "cyrille.grobost" : {"name":"cyrille.grobost", "type":"Team"},
    "deborah.sanchez" : {"name":"deborah.sanchez", "type":"Team"},
    "dina.zeroug" : {"name":"dina.zeroug", "type":"Team"},
    "emma.daveau" : {"name":"emma.daveau", "type":"Team"},
    "fabien.murschel" : {"name":"fabien.murschel", "type":"Team"},
    "fatou.diallo" : {"name":"fatou.diallo", "type":"Team"},
    "Frederic" : {"name":"frederic.bertrand", "type":"Team"},
    "frederic.espinasse" : {"name":"frederic.espinasse", "type":"Team"},
    "gary.assouline" : {"name":"gary.assouline", "type":"Team"},
    "ghislain.dehautdesigy" : {"name":"ghislain.dehautdesigy", "type":"Team"},
    "guillaume.bonvoisin" : {"name":"guillaume.bonvoisin", "type":"Team"},
    "guillaume.serries" : {"name":"guillaume.serries", "type":"Team"},
    "hamid.outabounte" : {"name":"hamid.outabounte", "type":"Team"},
    "hassen.ferroukhi" : {"name":"hassen.ferroukhi", "type":"Team"},
    "helene.htanguy" : {"name":"helene.htanguy", "type":"Team"},
    "hugo.langlais" : {"name":"hugo.langlais", "type":"Team"},
    "igor.matijasevic" : {"name":"igor.matijasevic", "type":"Team"},
    "ines.bechichi" : {"name":"ines.bechichi", "type":"Team"},
    "jeremy.parola" : {"name":"jeremy.parola", "type":"Team"},
    "jerome.duca" : {"name":"jerome.duca", "type":"Team"},
    "jordane.guignon" : {"name":"jordane.guignon", "type":"Team"},
    "julie.bisschop" : {"name":"julie.bisschop", "type":"Team"},
    "julie.girod" : {"name":"julie.girod", "type":"Team"},
    "laura.chaumont" : {"name":"laura.chaumont", "type":"Team"},
    "Louis" : {"name":"louis.ngo", "type":"Team"},
    "ludivine.legoff" : {"name":"ludivine.legoff", "type":"Team"},
    "magali.bertin" : {"name":"magali.bertin", "type":"Team"},
    "manon.mondesir" : {"name":"manon.mondesir", "type":"Team"},
    "marie-aquiline.meeus" : {"name":"marie-aquiline.meeus", "type":"Team"},
    "marion.clement" : {"name":"marion.clement", "type":"Team"},
    "marion.collombat" : {"name":"marion.collombat", "type":"Team"},
    "mathilde.dousset" : {"name":"mathilde.dousset", "type":"Team"},
    "matthieu.bobee" : {"name":"matthieu.bobee", "type":"Team"},
    "maxence.billet" : {"name":"maxence.billet", "type":"Team"},
    "maxime.vatinelle" : {"name":"maxime.vatinelle", "type":"Team"},
    "meava.guimbingot" : {"name":"meava.guimbingot", "type":"Team"},
    "melanie.claussmann" : {"name":"melanie.claussmann", "type":"Team"},
    "mohamed.belmaaza" : {"name":"mohamed.belmaaza", "type":"Team"},
    "myriam.haroun" : {"name":"myriam.haroun", "type":"Team"},
    "natacha.rivalan" : {"name":"natacha.rivalan", "type":"Team"},
    "nicolas.luciu" : {"name":"nicolas.luciu", "type":"Team"},
    "nicolas.pataud" : {"name":"nicolas.pataud", "type":"Team"},
    "olivier.bonnet" : {"name":"olivier.bonnet", "type":"Team"},
    "raphael.mutinelli" : {"name":"raphael.mutinelli", "type":"Team"},
    "raphaelle.bozec" : {"name":"raphaelle.bozec", "type":"Team"},
    "reina.fontenoy" : {"name":"reina.fontenoy", "type":"Team"},
    "ricardo.trindade" : {"name":"ricardo.trindade", "type":"Team"},
    "richard.guigou" : {"name":"richard.guigou", "type":"Team"},
    "rita.santourian" : {"name":"rita.santourian", "type":"Team"},
    "sabrina.doorgachurn" : {"name":"sabrina.doorgachurn", "type":"Team"},
    "salim.bouhazam" : {"name":"salim.bouhazam", "type":"Team"},
    "salim.kara-slimane" : {"name":"salim.kara-slimane", "type":"Team"},
    "samuel.jouy" : {"name":"samuel.jouy", "type":"Team"},
    "sebastien.ouaknine" : {"name":"sebastien.ouaknine", "type":"Team"},
    "silvia.bisio" : {"name":"silvia.bisio", "type":"Team"},
    "suruthi.srikumar" : {"name":"suruthi.srikumar", "type":"Team"},
    "thibault.fuchez" : {"name":"thibault.fuchez", "type":"Team"},
    "thibaut.austruy" : {"name":"thibaut.austruy", "type":"Team"},
    "thomas.attagnant" : {"name":"thomas.attagnant", "type":"Team"},
    "thomas.costes" : {"name":"thomas.costes", "type":"Team"},
    "thomas.pisselet" : {"name":"thomas.pisselet", "type":"Team"},
    "unai.iturribarria" : {"name":"unai.iturribarria", "type":"Team"},
    "valentin.gregoire" : {"name":"valentin.gregoire", "type":"Team"},
    "xavier.langlois" : {"name":"xavier.langlois", "type":"Team"},
    "ysabelle.de-la-laurencie" : {"name":"ysabelle.de-la-laurencie", "type":"Team"},
    "zineb.belabbes" : {"name":"zineb.belabbes", "type":"Team"},
    "Antoine" : {"name":"antoine.bridenne", "type":"Team"},
    "aurelia.becler" : {"name":"aurelia.becler", "type":"Team"},
    "Axelle" : {"name":"axelle.alvo", "type":"Team"},
    "Cedric c" : {"name":"cedric.chichilianne", "type":"Team"},
    "Cedric r" : {"name":"cedric.roustan", "type":"Team"},
    "claire.debruille" : {"name":"claire.debruille", "type":"Team"},
    "florian.heliot" : {"name":"florian.heliot", "type":"Team"},
    "Franck" : {"name":"franck.lamy", "type":"Team"},
    "gabriela.echeverria" : {"name":"gabriela.echeverria", "type":"Team"},
    "guillaume.dumesnil-d-engente" : {"name":"guillaume.dumesnil-d-engente", "type":"Team"},
    "laura.sastre" : {"name":"laura.sastre", "type":"Team"},
    "laure.renouard" : {"name":"laure.renouard", "type":"Team"},
    "laure.y-n" : {"name":"laure.y-n", "type":"Team"},
    "Lina" : {"name":"lina.tang", "type":"Team"},
    "Louis.p" : {"name":"louis.paillat", "type":"Team"},
    "marie.ciolfi" : {"name":"marie.ciolfi", "type":"Team"},
    "mathilde.campos" : {"name":"mathilde.campos", "type":"Team"},
    "meriem.y-n" : {"name":"meriem.y-n", "type":"Team"},
    "nadege.lapko" : {"name":"nadege.lapko", "type":"Team"},
    "Nadir.f" : {"name":"nadir.faqou", "type":"Team"},
    "Omar" : {"name":"omar.ismaili", "type":"Team"},
    "renaud.labracherie" : {"name":"renaud.labracherie", "type":"Team"},
    "vincent.lheur" : {"name":"vincent.lheur", "type":"Team"},
    "vincent.y-n" : {"name":"vincent.y-n", "type":"Team"},
    "Abdellatif" : {"name": "abdellatif.el-marhraoui", "type":"Webpick"},
    "Idhamou" : {"name": "khalid.id-hamou", "type":"Webpick"},
    "covadonga.garcia-fernandez" : {"name": "covadonga.garcia-fernandez", "type":"Team"},
    "H.elkharoua" : {"name":"hassan.elkharoua", "type":"Webpick"},
    "M.alaoui" : {"name":"mohamed.alaoui", "type":"Webpick"},
    "Gestion" : {"name":"&#128193; Gestion", "type":"Status"},
    "Open" : {"name":"&#128194; Open", "type":"Status"},
    "Inbox" : {"name":"&#128236; Inbox", "type":"Status"},
    "To dispatch" : {"name":"&#128204; To dispatch", "type":"Status"},
    "To preprod" : {"name":"&#128077; To preprod", "type":"Status"},
    "Review preprod" : {"name":"&#128284; Review preprod", "type":"Status"},
    "A recetter" : {"name":"&#128373; A recetter", "type":"Status"},
    "To prod" : {"name":"&#128077; To prod", "type":"Status"},
    "Review prod" : {"name":"&#128284; Review prod", "type":"Status"},
    "A valider" : {"name":"&#128373; A valider", "type":"Status"},
    "Complete" : {"name":"&#127881; Complete", "type":"Status"},
    "Completed" : {"name":"&#127881; Completed", "type":"Status"},
    "Put on hold" : {"name":"&#128129; Put on hold", "type":"Status"},
    "Reject" : {"name":"&#128549; Reject", "type":"Status"},
    "Check consent" : {"name":"Check consent", "type":"Status"},
    "Hamid" : {"name":"hamid.outabounte", "type":"Webpick"},
    "Charles" : {"name":"charles.deffontaine", "type":"Team"},
    "Cyril.b" : {"name":"cyril.bouskila", "type":"Team"},
    "G.danin" : {"name":"gaelle.danin", "type":"Team"},
    "Put on hold": {"name":"&#128588; Put on hold", "type":"Status"},
    "En attente de retour partenaire" :{"name":"&#128587; En attente de retour partenaire", "type":"Status"},
    "En attente retour partenaire" :{"name":"&#128587; En attente retour partenaire", "type":"Status"},
    "Pole auto" :{"name":"Pole auto", "type":"Team"},
    "Pole deco" :{"name":"Pole deco", "type":"Team"},
    "Pole elastique" :{"name":"Pole elastique", "type":"Team"},
    "Pole femme" :{"name":"Pole femme", "type":"Team"},
    "Pole gaming" :{"name":"Pole gaming", "type":"Team"},
    "Pole infotainment" :{"name":"Pole infotainment", "type":"Team"},
    "Pole paywall" :{"name":"Pole paywall", "type":"Team"},
    "Pole sante" :{"name":"Pole sante", "type":"Team"},
    "Pole seo" :{"name":"Pole seo", "type":"Team"},
    "Pole sport" :{"name":"Pole sport", "type":"Team"},
    "Vérif seo" :{"name":"Vérif seo", "type":"Status"},
    "B.achraf" :{"name":"achraf.bouchta", "type":"Webpick"},
    "Id.hamou" :{"name":"khalid.id-hamou", "type":"Webpick"},
    "Hassan": {"name":"hassan.elkharoua", "type":"Webpick"},
    "I.lamdibih" : {"name":"ilhame.lamdibih", "type":"Webpick"},
    "C to c" : {"name":"C to C", "type":"Team"},
    "Eq. acquisition" : {"name":"Eq. acquisition", "type":"Team"},
    "Eq. traffic" : {"name":"Eq. traffic", "type":"Team"},
};

// Ordre spécifique des éléments de la liste
const order = [
    "Gestion",
    "Open",
    "Inbox",
    "To dispatch",
    "To preprod",
    "Review preprod",
    "A recetter",
    "To prod",
    "Review prod",
    "A valider",
    "Complete",
    "Put on hold",
    "Reject",
    "Check consent"
];

const types = [
    "Status",
    "Projet",
    "PilotSystem",
    "Webpick",
    "Team",
    "IDK",
]

// Votre collection d'objets avec les environnements prod et preprod
const urls = [
    { prod: "https://www.grazia.fr/", prodBO: "https://www.grazia.fr/wp-admin", preprod: "https://grazia-v2.pp.webpick.info/", preprodBO: "https://grazia-v2.pp.webpick.info/wp-admin", name: "Grazia" },
    { prod: "https://www.bibamagazine.fr/", prodBO: "https://www.bibamagazine.fr/wp-admin", preprod: "https://biba.pp.webpick.info/", preprodBO: "https://biba.pp.webpick.info/wp-admin", name: "Bibamagazine" },
    { prod: "https://www.mariefrance.fr/", prodBO: "https://www.mariefrance.fr/wp-admin", preprod: "https://mariefrance.pp.webpick.info/", preprodBO: "https://mariefrance.pp.webpick.info/wp-admin", name: "Marie France" },
    { prod: "https://www.be.com/", prodBO: "https://www.be.com/wp-admin", preprod: "https://be.pp.webpick.info/", preprodBO: "https://be.pp.webpick.info/wp-admin", name: "Be" },
    { prod: "https://www.modesettravaux.fr/", prodBO: "https://www.modesettravaux.fr/wp-admin", preprod: "https://modesettravaux.pp.webpick.info/", preprodBO: "https://modesettravaux.pp.webpick.info/wp-admin", name: "Modes et travaux" },
    { prod: "https://www.peaches.fr/", prodBO: "https://www.peaches.fr/wp-admin", preprod: "https://peaches.pp.webpick.info/", preprodBO: "https://peaches.pp.webpick.info/wp-admin", name: "Peaches" },
    { prod: "https://www.closermag.fr/", prodBO: "https://www.closermag.fr/wp-admin", preprod: "https://closermag.pp.webpick.info/", preprodBO: "https://closermag.pp.webpick.info/wp-admin", name: "Closermag" },
    { prod: "https://www.melty.fr/", prodBO: "https://www.melty.fr/wp-admin", preprod: "https://meltyfr.pp.webpick.info/", preprodBO: "https://meltyfr.pp.webpick.info/wp-admin", name: "Melty" },
    { prod: "https://popcorn.melty.fr/", prodBO: "https://popcorn.melty.fr/wp-admin", preprod: "https://popcorn.pp.webpick.info/", preprodBO: "https://popcorn.pp.webpick.info/wp-admin", name: "Popcorn" },
    { prod: "https://www.nextplz.fr/", prodBO: "https://www.nextplz.fr/wp-admin", preprod: "https://nextplz.pp.webpick.info/", preprodBO: "https://nextplz.pp.webpick.info/wp-admin", name: "Nextplz" },
    { prod: "https://astro.nextplz.fr/", prodBO: "https://astro.nextplz.fr/wp-admin", preprod: "https://astro.pp.webpick.info/", preprodBO: "https://astro.pp.webpick.info/wp-admin", name: "Astro" },
    { prod: "https://www.viepratique.fr/", prodBO: "https://www.viepratique.fr/wp-admin", preprod: "http://feminin.pp.webpick.info/", preprodBO: "http://feminin.pp.webpick.info/wp-admin", name: "Vie Pratique" },
    { prod: "https://gourmand.viepratique.fr/", prodBO: "https://gourmand.viepratique.fr/wp-admin", preprod: "https://gourmand.pp.webpick.info/", preprodBO: "https://gourmand.pp.webpick.info/wp-admin", name: "Gourmand" },
    { prod: "https://www.lechasseurfrancais.com/", prodBO: "https://www.lechasseurfrancais.com/wp-admin", preprod: "https://lcf.pp.webpick.info/", preprodBO: "https://lcf.pp.webpick.info/wp-admin", name: "Le chasseur français" },
    { prod: "https://www.science-et-vie.com/", prodBO: "https://www.science-et-vie.com/wp-admin", preprod: "http://scienceetvie.pp.webpick.info/", preprodBO: "http://scienceetvie.pp.webpick.info/wp-admin", name: "Science et vie" },
    { prod: "https://www.autojournal.fr/", prodBO: "https://www.autojournal.fr/wp-admin", preprod: "https://autojournal.pp.webpick.info/", preprodBO: "https://autojournal.pp.webpick.info/wp-admin", name: "Autojournal" },
    { prod: "https://www.autoplus.fr/", prodBO: "https://www.autoplus.fr/wp-admin", preprod: "https://autoplus.pp.webpick.info/", preprodBO: "https://autoplus.pp.webpick.info/wp-admin", name: "Autoplus" },
    { prod: "https://f1i.autojournal.fr/", prodBO: "https://f1i.autojournal.fr/wp-admin", preprod: "https://f1i.pp.webpick.info/", preprodBO: "https://f1i.pp.webpick.info/wp-admin", name: "F1i" },
    { prod: "https://www.sportauto.fr/", prodBO: "https://www.sportauto.fr/wp-admin", preprod: "https://sportauto.pp.webpick.info/", preprodBO: "https://sportauto.pp.webpick.info/wp-admin", name: "Sportauto" },
    { prod: "https://monjardinmamaison.maison-travaux.fr/", prodBO: "https://monjardinmamaison.maison-travaux.fr/wp-admin", preprod: "http://jardin.renovation.pp.webpick.info/", preprodBO: "http://jardin.renovation.pp.webpick.info/wp-admin", name: "Mon jardin ma maison" },
    { prod: "https://www.maison-travaux.fr/", prodBO: "https://www.maison-travaux.fr/wp-admin", preprod: "https://maison-travaux.pp.webpick.info/", preprodBO: "https://maison-travaux.pp.webpick.info/wp-admin", name: "Maison travaux" },
    { prod: "https://www.lejournaldelamaison.fr/", prodBO: "https://www.lejournaldelamaison.fr/wp-admin", preprod: "http://deco.pp.webpick.info/", preprodBO: "http://deco.pp.webpick.info/wp-admin", name: "Le journal de la maison" },
    { prod: "https://www.damideco.com/", prodBO: "https://www.damideco.com/wp-admin", preprod: "https://damideco.pp.webpick.info/", preprodBO: "https://damideco.pp.webpick.info/wp-admin", name: "Dami deco" },
    { prod: "https://www.diapasonmag.fr/", prodBO: "https://www.diapasonmag.fr/wp-admin", preprod: "https://diapason.pp.webpick.info/", preprodBO: "https://diapason.pp.webpick.info/wp-admin", name: "Diapason mag" },
    { prod: "https://www.entrenous.fr/", prodBO: "https://www.entrenous.fr/wp-admin", preprod: "https://entrenous.pp.webpick.info/", preprodBO: "https://entrenous.pp.webpick.info/wp-admin", name: "Entre nous" },
    { prod: "https://www.pleinevie.fr/", prodBO: "https://www.pleinevie.fr/wp-admin", preprod: "https://pleinevie.pp.webpick.info", preprodBO: "https://pleinevie.pp.webpick.infowp-admin", name: "Pleine Vie" },
    { prod: "https://www.reponsesphoto.fr/", prodBO: "https://www.reponsesphoto.fr/wp-admin", preprod: "https://reponses-photo.pp.webpick.info/", preprodBO: "https://reponses-photo.pp.webpick.info/wp-admin", name: "Reponses photo" },
    { prod: "https://www.jeuxvideo-live.com/", prodBO: "https://www.jeuxvideo-live.com/wp-admin", preprod: "http://jvl.pp.webpick.info/", preprodBO: "http://jvl.pp.webpick.info/wp-admin", name: "Jeux vidéo live" },
    { prod: "https://www.eclypsia.com/", prodBO: "https://www.eclypsia.com/wp-admin", preprod: "http://eclypsia.pp.webpick.info/", preprodBO: "http://eclypsia.pp.webpick.info/wp-admin", name: "Eclypsia" },
    { prod: "https://www.1001cocktails.com/", prodBO: "https://www.1001cocktails.com/wp-admin", preprod: "https://1001cocktails.pp.webpick.info/", preprodBO: "https://1001cocktails.pp.webpick.info/wp-admin", name: "1001 cocktails" },
    { prod: "https://www.psychologies.com/", prodBO: "https://www.psychologies.com/wp-admin", preprod: "http://psycho.pp.webpick.info/", preprodBO: "http://psycho.pp.webpick.info/wp-admin", name: "Psychologies" },
    { prod: "https://www.topsante.com/", prodBO: "https://www.topsante.com/wp-admin", preprod: "https://topsante.pp.webpick.info/", preprodBO: "https://topsante.pp.webpick.info/wp-admin", name: "Top Santé" },
    { prod: "https://www.telestar.fr/", prodBO: "https://www.telestar.fr/wp-admin", preprod: "https://telestar-v2.pp.webpick.info", preprodBO: "https://telestar-v2.pp.webpick.infowp-admin", name: "Téléstar" },
    { prod: "https://www.sports.fr/", prodBO: "https://www.sports.fr/wp-admin", preprod: "https://sportspp.sport365.fr/", preprodBO: "https://sportspp.sport365.fr/wp-admin", name: "Sports" },
    { prod: "https://football.fr/", prodBO: "https://football.fr/wp-admin", preprod: "https://footballpp.sport365.fr/", preprodBO: "https://footballpp.sport365.fr/wp-admin", name: "Football" },
    { prod: "https://www.football365.fr/", prodBO: "https://www.football365.fr/wp-admin", preprod: "https://foot365pp.sport365.fr/", preprodBO: "https://foot365pp.sport365.fr/wp-admin", name: "Football 365" },
    { prod: "https://tendances.mariefrance.fr/", prodBO: "https://tendances.mariefrance.fr/wp-admin", preprod: "https://tendancesmf.pp.webpick.info/", preprodBO: "https://tendancesmf.pp.webpick.info/wp-admin", name: "Tendances Marie France" },
    { prod: "http://dzfoot.com/", prodBO: "http://dzfoot.com/wp-admin", preprod: "https://dzfoot.pp.webpick.info/", preprodBO: "https://dzfoot.pp.webpick.info/wp-admin", name: "Dz Foot" },
    { prod: "https://www.aufeminin.com", prodBO: "", preprod: "https://www.aufeminin.com.s.unfy.cloud", preprodBO: "", name: "AuFeminin" }
];

const styleUpdate = `
.form_followup #form #change_status_dropdown .nav-group-even a.btn {
  background-color: #4f9ea7;
}
#issue_title,
.prefix {
  display: block;
}
.prefix {
  font-size: 16px;
  line-height: 16px;
}
#issue_title {
  font-size: 28px;
  line-height: 40px;
}
.edithover {
  font-size: 0px;
  line-height: 0px;
}
.edithover #issue_tags {
  font-size: var(--bs-body-font-size);
  line-height: var(--bs-body-line-height);
}

.edithover .prefix {
  display: block;
  width: 100%;
}

.edithover #issue_title {
  display: inline;
}

.edithover #issue_title_buttons {
  display: inline;
  padding: 10px;
  font-size: var(--bs-body-font-size);
  line-height: var(--bs-body-line-height);
}

.edithover .selection, .edithover [id^="issue-scrum"], .edithover #issue_resources, .edithover #issue_aliases_buttons, .edithover #issue_prefix_buttons, .public_timing.edithover, .private_timing.edithover {
  font-size: var(--bs-body-font-size);
  line-height: var(--bs-body-line-height);
}

/*:root {
  --portlet-bg-color:#f3f9fc;
}*/
`

const coffeeHtml = '<a href="https://www.buymeacoffee.com/marshkalk" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important; margin: 10px auto" ></a>'

const statusElements = document.querySelectorAll(".istatus a");
if (statusElements.length > 0) {
    var currentStatus = statusElements[0].textContent.trim();
    // console.log(currentStatus);
} else {
    // console.log("Aucun élément trouvé pour '.istatus a'");
}

// Fonction pour normaliser les espaces dans une chaîne de caractères
function normalizeSpace(text) {
    return text.replace(/\s+/g, ' ').trim();
}

// Fonction pour vérifier la présence d'une valeur spécifique dans les éléments avec la classe 'issue'
function checkTextMapping(value) {
    var foundNames = false; // Booléen pour stocker si la valeur est trouvée

    if (value) {
        var issues = document.querySelectorAll('.ibody'); // Sélectionner tous les éléments avec la classe 'issue'
        var followups = document.querySelectorAll('.tbody'); // Sélectionner tous les éléments avec la classe 'issue'


        // Parcourir chaque élément 'issue'
        issues.forEach(issue => {
            const text = issue.textContent; // Obtenir le texte de l'élément et le convertir en minuscules
            // Vérifier si le texte de l'élément contient la valeur donnée
            if (text.includes(value)) { // Convertir aussi la valeur en minuscules pour la comparaison
                foundNames = true; // Marquer comme trouvé si la condition est vraie
            }
        });

        // Parcourir chaque élément 'followup'
        followups.forEach(followup => {
            const text = followup.textContent; // Obtenir le texte de l'élément et le convertir en minuscules
            // Vérifier si le texte de l'élément contient la valeur donnée
            if (text.includes(value)) { // Convertir aussi la valeur en minuscules pour la comparaison
                foundNames = true; // Marquer comme trouvé si la condition est vraie
            }
        });
    }

    return foundNames; // Retourner true si trouvé, sinon false
}

// Fonction pour mettre à jour les textes des éléments de la liste
function updateDropdownTexts(selector) {
    // Obtenir les status déjà utilisés
    var status = getAllStatus();
    //console.log(currentStatus);

    // Sélectionner tous les éléments de la liste dans la div spécifiée
    const elements = document.querySelectorAll(selector + ' li a');

    // Parcourir chaque élément et mettre à jour le texte si présent dans la table de mapping
    elements.forEach(element => {
        const currentText = normalizeSpace(element.textContent.trim());
        //console.log(currentText);
        if (textMapping[currentText] && textMapping[currentText]["name"]) {
            element.innerHTML = textMapping[currentText]["name"];

            var cTM = checkTextMapping(textMapping[currentText]["name"])
            //console.log(currentText + " : " + textMapping[currentText]["name"] + " : " + cTM + " / " + status.includes(currentText) + " / " + currentText.toLowerCase() + " : " + currentStatus);
        } else {
            //console.log(element.textContent);
        }

        if (cTM) {
            element.style.background = 'pink';
        }

        if (status.includes(currentText)) {
            element.style.background = '#ec5353';
        }

        if (currentText.toLowerCase() == currentStatus) {
            element.style.background = "linear-gradient(-45deg, #b81414, #ec5353, #b81414, #ec5353, #b81414, #ec5353, #b81414, #ec5353, #b81414, #ec5353, #b81414, #ec5353, #b81414, #ec5353, #b81414)"
        }
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function updateCurrentStatus(selector) {
    const elements = document.querySelectorAll(selector);

    // Parcourir chaque élément et mettre à jour le texte si présent dans la table de mapping
    elements.forEach(element => {
        const currentText = normalizeSpace(element.textContent.trim());
        const currentTextWithFirstLetterCapitilized = capitalizeFirstLetter(currentText);
        // console.log(textMapping[currentTextWithFirstLetterCapitilized]);
        if (textMapping[currentText] && textMapping[currentText]["name"]) {
            element.innerHTML = textMapping[currentText]["name"];
        } else if (textMapping[currentTextWithFirstLetterCapitilized] && textMapping[currentTextWithFirstLetterCapitilized]["name"]) {
            element.innerHTML = textMapping[currentTextWithFirstLetterCapitilized]["name"]
        }
    });
}



// Fonction pour trier les éléments d'une liste
function sortListItems(selector) {
    // Fonction pour nettoyer le texte en supprimant les entités HTML et les espaces inutiles
    function cleanText(text) {
        // Créer un élément DOM temporaire pour décoder les entités HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = text;

        // Décoder les entités HTML en texte brut
        const decodedText = tempDiv.textContent || tempDiv.innerText || "";

        // Supprimer les caractères spéciaux (ex : émojis ou entités non désirées)
        return decodedText.replace(/[^\w\s.-]/g, '').trim();
    }

    // Sélectionner toutes les listes dans la div spécifiée par le sélecteur
    const lists = document.querySelectorAll(selector + ' ul, ' + selector + ' ol');

    // Itérer sur chaque liste trouvée
    lists.forEach(list => {
        // Récupérer tous les éléments 'li' de la liste courante
        let items = Array.from(list.querySelectorAll('li'));

        // Vérifier si un élément contient une balise <a> avec un texte contenu dans order
        const hasOrderedText = items.some(item => {
            const anchor = item.querySelector('a');
            return anchor ? order.includes(cleanText(anchor.textContent)) : false;
        });

        // Choisir le mode de tri selon la présence d'un texte ordonné
        if (hasOrderedText) {
            // Trier selon l'ordre spécifique
            items.sort((a, b) => {
                let textA = cleanText(a.querySelector('a') ? a.querySelector('a').textContent : a.textContent);
                let textB = cleanText(b.querySelector('a') ? b.querySelector('a').textContent : b.textContent);
                let indexA = order.indexOf(textA);
                let indexB = order.indexOf(textB);
                // Gérer les cas où le texte n'est pas trouvé dans 'order'
                indexA = indexA === -1 ? Infinity : indexA;
                indexB = indexB === -1 ? Infinity : indexB;
                return indexA - indexB;
            });
        } else {
            // Trier alphabétiquement pour les listes sans éléments spécifiés dans 'order'
            items.sort((a, b) => {
                let textA = cleanText(a.querySelector('a') ? a.querySelector('a').textContent : a.textContent);
                let textB = cleanText(b.querySelector('a') ? b.querySelector('a').textContent : b.textContent);
                return textA.localeCompare(textB);
            });
        }

        // Vider la liste initiale
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }

        // Ajouter les éléments triés de nouveau à la liste
        items.forEach(item => {
            list.appendChild(item);
        });
    });
}

function updateList(selector) {
  // Récupération de l'élément contenant les listes initiales
  const dropdown = document.querySelectorAll(selector);
  if (!dropdown) {
    console.error(`Aucun élément trouvé avec l'ID "${selector}"`);
    return;
  }

  // Récupération des listes initiales
  const elem = dropdown[0];
  const initialLists = elem.querySelectorAll("ul");

  // Création d'un objet pour regrouper les listes par type
  const listsByType = {};
  const newContent = document.createDocumentFragment(); // Fragment temporaire pour éviter les reflows

  // Création des nouvelles listes basées sur les types
  types.forEach(type => {
    // Créer l'élément <span> pour le titre
    const title = document.createElement("span");
    title.id = "list-title"; // ID générique pour tous les titres
    title.setAttribute("data-type-id", type); // Attribut supplémentaire pour identifier le type
    title.textContent = type;

    // Créer une nouvelle liste <ul>
    const ul = document.createElement("ul");
    ul.id = type; // ID spécifique à chaque type
    ul.classList.add("nav-group-even", "nav", "nav-pills");

    // Ajouter les éléments au fragment temporaire
    newContent.appendChild(title);
    newContent.appendChild(ul);

    // Stocker la liste dans un objet pour un accès rapide
    listsByType[type] = ul;
  });

  // Parcourir les listes initiales et redistribuer les <li>
  initialLists.forEach(list => {
    const items = list.querySelectorAll("li");

    items.forEach(li => {
      let currentText = li.textContent.trim();
      currentText = currentText.replace(/\s+/g, " ");

      //console.log(currentText);
      // Vérifier le mapping
      if (textMapping[currentText] && textMapping[currentText]["type"]) {
        const targetType = textMapping[currentText]["type"];
        //console.log(currentText + " : " + textMapping[currentText]["type"]);
        listsByType[targetType]?.appendChild(li);
      } else {
        // Ajouter à la liste "Others" si non mappé
        listsByType["IDK"]?.appendChild(li);
      }
    });
  });

  // Remplacer le contenu de `elem` avec les nouvelles listes
  elem.innerHTML = ""; // Nettoyer le contenu existant
  elem.appendChild(newContent); // Ajouter les nouvelles listes
}

function getAllStatus() {
    // Crée un ensemble pour stocker les textes uniques
    var textSet = new Set();

    // Sélectionne tous les éléments qui correspondent au sélecteur spécifié
    var current_state_elements = document.querySelectorAll('.current_state');
    var istatus_elements = document.querySelectorAll('.istatus .btn-inverse');

    var elements = [...current_state_elements, ...istatus_elements];
    // console.log(elements);

    // Liste des éléments à ignorer
    const ignoreList = new Set([]) //Set(order);

    // Parcourt chaque élément, vérifie si le texte doit être ignoré, et ajoute les textes non ignorés à l'ensemble
    elements.forEach(function(element) {
        var text = element.textContent.trim();
        if (!ignoreList.has(text)) { // Vérifie si le texte n'est pas dans la liste d'ignorance
            textSet.add(text);
        }
    });

    // Convertit l'ensemble en tableau
    var textArray = Array.from(textSet);

    // Affiche le tableau dans la console pour vérification
    return textArray;
}

function listUpdate(list) {
    updateList(list)
    updateDropdownTexts(list);
    sortListItems(list);
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function addURLElems(elem) {
    const elements = document.querySelectorAll(elem);
    // console.log(elem);
    // console.log(elements);

    elements.forEach(element => {
        const links = element.querySelectorAll('a');
        const currentUrl = window.location.host + window.location.pathname;

        links.forEach(link => {
            let elementText = link.textContent || link.innerText;
            const regexPattern = new RegExp(`${escapeRegExp(currentUrl)}[#0-9i]*\/${escapeRegExp(elementText)}`);
            console.log(`${link.href} => ${regexPattern} => ${regexPattern.test(link.href)}`);

            if (!link.href.includes('mailto:')) {
                if (regexPattern.test(link.href)) {
                    link.removeAttribute("href");
                } else {
                    if (link.textContent.trim() !== '') {
                        addTargetBlank(link);
                        addCopyText(link);
                    }
                }
            }
        });
    });
}

function addTargetBlank(elem) {
    // Crée un nouvel élément image
    var image = document.createElement('img');
    // Ajoute l'URL de l'image
    image.src = 'https://cdn-icons-png.flaticon.com/512/74/74910.png';
    // Ajoute du style l'image
    image.style.margin = "0 0 5px 5px";
    image.style.height = "10px";
    // Crée un nouvel élément <a> pour dupliquer
    var newLink = document.createElement('a');
    // Copie le lien du lien existant
    newLink.href = elem.href;
    // Récupère le lien pour l'afficher entièrement
    if(elem.textContent.includes(newLink.host)) {
        elem.textContent = newLink;
    }
    // Ajoute l'image à l'élément <a> dupliqué
    newLink.appendChild(image);
    // Définit l'attribut target à "_blank" pour ouvrir le lien dans un nouvel onglet
    newLink.setAttribute('target', '_blank');
    // Insère le nouvel élément <a> avant l'élément existant
    elem.insertAdjacentElement('afterend', newLink);
}

function addCopyText(elem) {
    // Crée un nouvel élément image
    var image = document.createElement('img');
    // Ajoute l'URL de l'image
    image.src = 'https://cdn-icons-png.flaticon.com/128/54/54702.png';
    // Ajoute du style l'image
    image.style.margin = "0 0 5px 5px";
    image.style.height = "10px";
    image.style.cursor = 'pointer';
    image.onclick = function() { textCopy(elem.href); };
    // Insère le nouvel élément <a> avant l'élément existant
    elem.insertAdjacentElement('afterend', image);
}

function kobMigEnGlassOl(id, html) {
    // Trouver l'élément par son ID
    var parentElement = document.getElementById(id);

    // Créer un élément temporaire pour contenir le HTML
    var tempElement = document.createElement('div');
    tempElement.innerHTML = html;

    // Vérifier si l'élément parent existe
    if (parentElement) {
        // Si l'élément parent a déjà des enfants, insérer le nouveau HTML avant le premier enfant
        if (parentElement.firstChild) {
            parentElement.insertBefore(tempElement.firstChild, parentElement.firstChild);
        } else {
            // Si l'élément parent n'a pas d'enfants, ajouter le nouveau HTML normalement
            parentElement.appendChild(tempElement.firstChild);
        }
    } else {
        // console.error('Aucun élément trouvé avec l\'ID : ' + id);
    }
}

function domainMatchesAnyUrl(domain) {
    // Vérifie si le domaine correspond à l'un des domaines dans les objets de 'urls'
    return urls.find(urlObject => {
        const prodDomain = new URL(urlObject.prod).hostname;
        const preprodDomain = new URL(urlObject.preprod).hostname;
        return domain === prodDomain || domain === preprodDomain;
    });
}

// Utiliser un Map pour stocker les objets uniques avec le domaine comme clé
var uniqueUrlObjects = new Set();

function checkLinks() {
    // Sélectionne tous les éléments avec les classes 'class1' ou 'class2' et leurs liens
    const links = document.querySelectorAll('.ibody a, .tbody a');
    links.forEach(link => {
        const domain = new URL(link.href).hostname;
        const matchingUrlObject = domainMatchesAnyUrl(domain);
        if (matchingUrlObject) {
            uniqueUrlObjects.add(matchingUrlObject); // Ajoute l'objet si un domaine correspond
            //console.log(`L'objet contenant ${domain} a été ajouté.`);
        } else {
            //console.log(`Aucun objet correspondant pour ${domain}.`);
        }
    });
}

function displayUrlObjects(id) {
    if (uniqueUrlObjects.size > 0) {
        const parentElement = document.getElementById(id);
        if (!parentElement) {
            // console.log(`No parent element found with ID '${id}'.`);
            return;
        }

        const container = document.createElement('div');
        container.id = "portlet_status";
        container.style.margin = "10px auto";

        const navList = document.createElement('div');
        navList.id = "navlist";

        const header = document.createElement('h4');
        header.textContent = "Websites Information";
        navList.appendChild(header);

        uniqueUrlObjects.forEach(obj => {
            const p = document.createElement('p');
            p.textContent = `Name: ${obj.name}`;

            const prodLink = document.createElement('a');
            prodLink.href = obj.prod;
            prodLink.target = "_blank";
            prodLink.textContent = "Prod URL";

            const prodBOLink = document.createElement('a');
            prodBOLink.href = obj.prodBO;
            prodBOLink.target = "_blank";
            prodBOLink.textContent = "Prod BO";

            const preprodLink = document.createElement('a');
            preprodLink.href = obj.preprod;
            preprodLink.target = "_blank";
            preprodLink.textContent = "Pre-Prod URL";

            const preprodBOLink = document.createElement('a');
            preprodBOLink.href = obj.preprodBO;
            preprodBOLink.target = "_blank";
            preprodBOLink.textContent = "Pre-Prod BO";

            p.appendChild(document.createElement('br'));
            p.appendChild(prodLink);
            p.appendChild(document.createTextNode(' | '));
            p.appendChild(prodBOLink);
            p.appendChild(document.createElement('br'));
            p.appendChild(preprodLink);
            p.appendChild(document.createTextNode(' | '));
            p.appendChild(preprodBOLink);

            navList.appendChild(p);
        });

        container.appendChild(navList);
        parentElement.after(container);
        // console.log(`Template inserted at the start of the element with ID '${id}'.`);
    };
}

function removeElementById(elementId) {
    // Trouver l'élément par son ID
    const element = document.getElementById(elementId);

    // Vérifier si l'élément existe
    if (element) {
        // Supprimer l'élément du DOM
        element.remove();
        // console.log(`L'élément avec l'ID '${elementId}' a été supprimé.`);
    } else {
        // console.log(`Aucun élément trouvé avec l'ID '${elementId}'.`);
    }
}

function moveTableElem(array, element, type) {
    // Trouver l'index de l'élément dans le tableau
    const index = array.indexOf(element);

    // Vérifier si l'élément est trouvé
    if (index !== -1) {
        // Retirer l'élément du tableau
        array.splice(index, 1);

        // Insérer l'élément au début du tableau
        switch (type) {
            case 'first': array.unshift(element);
                break;
            case 'last': array.push(element);
                break;
            default:
                console.log('please use first or last for moveTableElem()');
        };
    }
}

function checkPresence(selector) {
    // Récupérer l'élément par son sélecteur
    const targetElement = document.querySelectorAll(selector);
    if (!targetElement) {
        // console.log("Élément cible non trouvé.");
        return;
    }

    // Obtenir le texte des éléments cibles
    targetElement.forEach(elem => {
        const targetText = elem.textContent;

        // Vérifier chaque valeur de l'objet dans le texte de l'élément cible
        for (const [key, value] of Object.entries(textMapping)) {
            if (targetText.includes(value.name)) {
                //console.log(`La valeur "${value}" associée à "${key}" est présente dans "${selector}".`);
                moveTableElem(window.tracker_users, value.name, "last");
            } else {
                //console.log(`La valeur "${value}" associée à "${key}" n'est pas présente dans "${selector}".`);
            }
        }
    })
}

function textCopy(text) {
    // Créer un élément temporaire pour contenir le texte
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    document.body.appendChild(tempInput);

    // Sélectionner et copier le texte
    tempInput.select();
    document.execCommand('copy');

    // Retirer l'élément temporaire
    document.body.removeChild(tempInput);

    // Afficher une alerte pour confirmer la copie
    // alert('Texte copié !');
}

function waitAndExecute(delay, callback) {
    setTimeout(callback, delay);
}

function addStyles(css) {
  // Créer une nouvelle balise <style>
  const style = document.createElement('style');
  style.type = 'text/css';

  // Ajouter le CSS à la balise <style>
  style.innerHTML = css;

  // Ajouter la balise <style> au <head> du document
  document.head.appendChild(style);
}

// La couleur de fond que vous souhaitez modifier (par exemple "rgb(255, 0, 0)" pour le rouge)
const originalColor = "rgb(0, 136, 255)";

// La nouvelle couleur de fond que vous souhaitez appliquer (par exemple "rgb(0, 255, 0)" pour le vert)
const newColor = "rgb(160, 200, 250)";

// Fonction pour convertir une couleur hexadécimale en couleur RGB
function hexToRgb(hex) {
  // Retirer le # s'il y en a un
  hex = hex.replace(/^#/, '');
  // Convertir en valeurs RGB
  let bigint = parseInt(hex, 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;
  return `rgb(${r}, ${g}, ${b})`;
}

// Vérifier si la couleur originale est en hexadécimal et convertir en RGB
let originalColorRgb = originalColor.startsWith('#') ? hexToRgb(originalColor) : originalColor;

// Sélectionner tous les éléments de la page
const allElements = document.querySelectorAll('*');

// Parcourir tous les éléments et modifier la couleur de fond si elle correspond à celle recherchée
allElements.forEach(element => {
  const style = window.getComputedStyle(element);
  if (style.backgroundColor === originalColorRgb) {
    element.style.backgroundColor = newColor;
  }
});

function main() {
    // Ajoute un élément séparateur à la table tracker_users
    if (window.tracker_users) {
        window.tracker_users.push("__________________");
    };

    // ajoute du style
    addStyles(styleUpdate);


    // Supprime la liste de statuts de la sidebar
    removeElementById("portlet_status")

    // cherche et stocke les domaines des URLs utilisées dans le ticket
    checkLinks();

    // ajoute dans la sidebar des éléments d'information sur les domaines utilisés dans le ticket
    displayUrlObjects("portlet_scrum");

    // améliore les listes de statuts
    listUpdate("#change_status_dropdown");
    //listUpdate("#navlist");

    // update des libélés de statut
    updateCurrentStatus(".current_state");
    updateCurrentStatus(".change_status_status");
    updateCurrentStatus(".istatus .btn-inverse");

    // Ajoute un icône avec un lien target:_blank à tous les liens de certains éléments de la page
    for (const elem of [".tbody", ".ibody", ".threadfiles", '.chakra-table']) {
            addURLElems(elem);
    }

    // ajoute un bouton pour offrir un café, ou une bière
    //kobMigEnGlassOl("portlet", coffeeHtml);

    // Met à jour la table tracker_users en fonction des éléments appelés dans le ticket
    for (const elem of [".tbody", ".ibody", ".current_state", '.istatus']) {
        checkPresence(elem);
    }
}

main();