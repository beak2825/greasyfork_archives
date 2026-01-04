// ==UserScript==
// @name         B.A.M Script
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  And the power they took from the people will return to the people.
// @author       LeRatRatus
// @match        http://www.jeuxvideo.com/forums/*
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369841/BAM%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/369841/BAM%20Script.meta.js
// ==/UserScript==

(function(){'use strict';var stickers=`
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1kkh" id="1kkh" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1kkg" id="1kkg" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1kkj" id="1kkj" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1kkk" id="1kkk" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1kkl" id="1kkl" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1kkm" id="1kkm" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1kkn" id="1kkn" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1kkr" id="1kkr" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1kko" id="1kko" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1kkp" id="1kkp" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1kkq" id="1kkq" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1kks" id="1kks" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1kkt" id="1kkt" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1kku" id="1kku" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1kkv" id="1kkv" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1jnd" id="1jnd" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1jnc" id="1jnc" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1jne" id="1jne" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1jnf" id="1jnf" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1jng" id="1jng" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1jnh" id="1jnh" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1jni" id="1jni" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1jnj" id="1jnj" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1ljl" id="1ljl" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1ljj" id="1ljj" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1ljm" id="1ljm" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1ljn" id="1ljn" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1ljo" id="1ljo" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1ljp" id="1ljp" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1ljr" id="1ljr" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1ljq" id="1ljq" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1lm9" id="1lm9" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1lma" id="1lma" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1lmb" id="1lmb" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1lmc" id="1lmc" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1lmd" id="1lmd" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1lme" id="1lme" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1lmf" id="1lmf" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1lmg" id="1lmg" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1lmi" id="1lmi" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1lml" id="1lml" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1lmh" id="1lmh" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1lmj" id="1lmj" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1lmk" id="1lmk" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1lmm" id="1lmm" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1lmn" id="1lmn" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1lmo" id="1lmo" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1lmp" id="1lmp" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1mqv" id="1mqv" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1mqw" id="1mqw" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1mqx" id="1mqx" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1mqy" id="1mqy" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1mqz" id="1mqz" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1mr0" id="1mr0" width="40px"/>
<img class="secret-sticker" src="http://image.jeuxvideo.com/stickers/p/st/1mr1" id="1lmc" width="40px"/>
`

var stickers2=`
<img class="secret-sticker2" src="http://image.jeuxvideo.com/avatar-md/0/0/70000km-1471100268-45c21657df91f3a18ed7f8e15f93e735.jpg" id="avatar-md\\0\\0\\70000km-1471100268-45c21657df91f3a18ed7f8e15f93e735.jpg" width="40px"/>
<img class="secret-sticker2" src="http://image.jeuxvideo.com/avatar-md/r/i/risitasjoyajuan-1475078931-f5e75f611a08e34bbe0032ed11f305d5.jpg" id="avatar-md\\r\\i\\risitasjoyajuan-1475078931-f5e75f611a08e34bbe0032ed11f305d5.jpg" width="40px"/>
<img class="secret-sticker2" src="http://image.jeuxvideo.com/avatar-md/p/a/patriarcatworld-1498760421-c607b22a1a90e3116e067e851dcbdfaf.jpg" id="avatar-md\\p\\a\\patriarcatworld-1498760421-c607b22a1a90e3116e067e851dcbdfaf.jpg" width="40px"/>
<img class="secret-sticker2" src="http://image.jeuxvideo.com/avatar-md/t/h/thelarry78-1491758120-7c8e73be0bf77d6c07a2062ce40ba03a.jpg" id="avatar-md\\t\\h\\thelarry78-1491758120-7c8e73be0bf77d6c07a2062ce40ba03a.jpg" width="40px"/>
<img class="secret-sticker2" src="http://image.jeuxvideo.com/avatar-sm/t/h/theriwer-1506625022-cedfed6d8e8aaa212569697b0d89d6f9.jpg" id="avatar-sm\\t\\h\\theriwer-1506625022-cedfed6d8e8aaa212569697b0d89d6f9.jpg" width="40px"/>
<img class="secret-sticker2" src="http://image.jeuxvideo.com/avatar-md/r/i/rizitaz-1517488391-f44244d88135414212a14c810c30d6c8.jpg" id="avatar-md\\r\\i\\rizitaz-1517488391-f44244d88135414212a14c810c30d6c8.jpg" width="40px"/>
<img class="secret-sticker2" src="http://image.jeuxvideo.com/avatar-md/0/t/_tontonfamoso-1517700517-70b0147b1f3a53cd2d92d1e430a4089d.jpg" id="avatar-md\\0\\t\\_tontonfamoso-1517700517-70b0147b1f3a53cd2d92d1e430a4089d.jpg" width="40px"/>
<img class="secret-sticker2" src="http://image.jeuxvideo.com/avatar-md/p/e/penguin26-1527795217-a89ac84521ee030c4a2c6155401f495b.jpg" id="avatar-md\\p\\e\\penguin26-1527795217-a89ac84521ee030c4a2c6155401f495b.jpg" width="40px"/>
<img class="secret-sticker2" src="http://image.jeuxvideo.com/avatar-md/r/i/ricardpastis-1498307202-8d3a45956c2544d38da1b6006560a896.jpg" id="avatar-md\\r\\i\\ricardpastis-1498307202-8d3a45956c2544d38da1b6006560a896.jpg" width="40px"/>
<img class="secret-sticker2" src="http://image.jeuxvideo.com/avatar-md/r/i/risitaxe-1495613325-a3649fc808b9075055bb14c6dfd67cff.jpg" id="avatar-md\\r\\i\\risitaxe-1495613325-a3649fc808b9075055bb14c6dfd67cff.jpg" width="40px"/>
<img class="secret-sticker2" src="http://image.jeuxvideo.com/avatar-md/j/e/jesuspatriot15-1518966860-5fe569c373634e8eea8a14124af0e3f3.jpg" id="avatar-md\\j\\e\\jesuspatriot15-1518966860-5fe569c373634e8eea8a14124af0e3f3.jpg" width="40px"/>
<img class="secret-sticker2" src="http://image.jeuxvideo.com/avatar-md/h/e/hemorroideter3-1523124328-c93dd643fdb5578dc1121f8b5ac359bf.jpg" id="avatar-md\\h\\e\\hemorroideter3-1523124328-c93dd643fdb5578dc1121f8b5ac359bf.jpg" width="40px"/>
<img class="secret-sticker2" src="http://image.jeuxvideo.com/avatar-md/g/a/gal[g]erien-1527463865-5a78ef894675a144c3084aa2c8ed82e5.jpg" id="avatar-md\\g\\a\\gal[g]erien-1527463865-5a78ef894675a144c3084aa2c8ed82e5.jpg" width="40px"/>
<img class="secret-sticker2" src="http://image.jeuxvideo.com/avatar-md/l/i/littletroll-1503813758-aa4b9796c973924d6a26bf5f12e9d30c.jpg" id="avatar-md\\l\\i\\littletroll-1503813758-aa4b9796c973924d6a26bf5f12e9d30c.jpg" width="40px"/>
<img class="secret-sticker2" src="http://image.jeuxvideo.com/avatar-md/j/e/jeanedern-1528075066-35bf8776a7cfc5ab50f6e56fea711ce6.jpg" id="avatar-md\\j\\e\\jeanedern-1528075066-35bf8776a7cfc5ab50f6e56fea711ce6.jpg" width="40px"/>
<img class="secret-sticker2" src="http://image.jeuxvideo.com/avatar-md/c/h/chaud-pin-1490804581-a62fee2a6261d37dced0111b7317e3d8.jpg" id="avatar-md\\c\\h\\chaud-pin-1490804581-a62fee2a6261d37dced0111b7317e3d8.jpg" width="40px"/>
<img class="secret-sticker2" src="http://image.jeuxvideo.com/avatar-md/c/h/chavais-1525518552-9e24c180e57e36513285515f80ad6bd8.jpg" id="avatar-md\\c\\h\\chavais-1525518552-9e24c180e57e36513285515f80ad6bd8.jpg" width="40px"/>
<img class="secret-sticker2" src="http://image.jeuxvideo.com/avatar-md/k/h/kheylite-1526090633-a56de6d986af3b895e12454c77ee23ba.jpg" id="avatar-md\\k\\h\\kheylite-1526090633-a56de6d986af3b895e12454c77ee23ba.jpg" width="40px"/>
<img class="secret-sticker2" src="http://image.jeuxvideo.com/avatar-md/i/w/iwillbebackforu-1495219342-918df4e6caedd547e6c9289f3334e0e6.jpg" id="avatar-md\\i\\w\\iwillbebackforu-1495219342-918df4e6caedd547e6c9289f3334e0e6.jpg" width="40px"/>
<img class="secret-sticker2" src="http://image.jeuxvideo.com/avatar-md/p/a/papichancla-1526244520-bb8eff1c53f9afea289109515d55312d.jpg" id="avatar-md\\p\\a\\papichancla-1526244520-bb8eff1c53f9afea289109515d55312d.jpg" width="40px"/>
<img class="secret-sticker2" src="http://image.jeuxvideo.com/avatar-md/k/e/kermisitas-1479556035-f0cdf3ee3c659d44bdf53653fcdaf743.jpg" id="avatar-md\\k\\e\\kermisitas-1479556035-f0cdf3ee3c659d44bdf53653fcdaf743.jpg" width="40px"/>
<img class="secret-sticker2" src="http://image.jeuxvideo.com/avatar-md/r/i/risitasgdlissou-1526165702-f68b75beb9aca15146910ff3bce634bb.jpg" id="avatar-md\\r\\i\\risitasgdlissou-1526165702-f68b75beb9aca15146910ff3bce634bb.jpg" width="40px"/>
<img class="secret-sticker2" src="http://image.jeuxvideo.com/avatar-md/v/e/vendeurdeslip-1514742858-64f9ad86130129402135365e20ddde7f.jpg" id="avatar-md\\v\\e\\vendeurdeslip-1514742858-64f9ad86130129402135365e20ddde7f.jpg" width="40px"/>
<img class="secret-sticker2" src="http://image.jeuxvideo.com/avatar-md/k/h/kheycodeur-1523314986-6fd58dab2027f822bd6fd49aeb710180.jpg" id="avatar-md\\k\\h\\kheycodeur-1523314986-6fd58dab2027f822bd6fd49aeb710180.jpg" width="40px"/>
<img class="secret-sticker2" src="http://image.jeuxvideo.com/avatar-md/s/e/sergent_issou-1499973944-6ce4347c83c77067796043b514c1be52.jpg" id="avatar-md\\s\\e\\sergent_issou-1499973944-6ce4347c83c77067796043b514c1be52.jpg" width="40px"/>
<img class="secret-sticker2" src="http://image.jeuxvideo.com/avatar-md/l/e/le_banador-1527363487-e8ef8ffcab68a609c400cf78f1260380.jpg" id="avatar-md\\l\\e\\le_banador-1527363487-e8ef8ffcab68a609c400cf78f1260380.jpg" width="40px"/>
<img class="secret-sticker2" src="http://image.jeuxvideo.com/avatar-md/a/s/asnigaz-1522532641-669a562c8f534b1bb205c1b6cc83baa2.jpg" id="avatar-md\\a\\s\\asnigaz-1522532641-669a562c8f534b1bb205c1b6cc83baa2.jpg" width="40px"/>
<img class="secret-sticker2" src="http://image.jeuxvideo.com/avatar-md/p/i/pioched-1523898947-2dc6af36394f6d52aab359980b90d03d.jpg" id="avatar-md\\p\\i\\pioched-1523898947-2dc6af36394f6d52aab359980b90d03d.jpg" width="40px"/>
<img class="secret-sticker2" src="http://image.jeuxvideo.com/avatar-md/s/u/suuscejaaj-1522280553-1b8bd2944eae7f034b8a19feab60e17d.jpg" id="avatar-md\\s\\u\\suuscejaaj-1522280553-1b8bd2944eae7f034b8a19feab60e17d.jpg" width="40px"/>
`

var url = document.location.href;
var url2 = "";

for (var o = 0; o <= 35; o++) {
    url2 = url2 + url[o];
}


$.ajax({
  method: "GET",
  url: "https://deepfakes.000webhostapp.com/",
  data: {"liste":"show"},
  success : function(resultat){
    var str = resultat;
    var equipe = str.split(",");

//var equipe = ["FeelsB4dMan","410-Repentis1","TnepreselSEMITE","BgMaisUnPeuCon","HerrSilverstein","corki99","meucron","ChefDuGang3","PoneyFurieux-15","G_CHROMECAST","Ec0cert","Aigrettes","H4rdix","MuzzEvola","AnarchisteTORY","OuiSinge","DumbsHunter5","JesusGuerrero","MacronSionard","lestesteur12","TheGertrudeSA","SweetGupGup","17ansEtEnsuite","RegimeDuCamp913","FessierRouge","DarlingDesuu","Postit50","BadooLePuceau","Cookie90","CimerRisitas58","Dextre43","BrochHermann","grosintestin17","Empeureux","Ash2Guerre","-Winston-","Owen_Kravecki","KageRisitas","RebornAshes4","Tsuna","LixyDeter","Upman05","Ocktenie","kheylogger7","Upman04","pistachiii","Omega710","Elpissoputain","410-Repentis","-Nwego-_","55ComptesBan","Le_Vrai_Risitas","Dextre41","Kirby--54","Incivilisable","AtomicSyrie1","le_toaster_2","Big_Redwan","0DD","nWoMondayNitro","Giroued","born_to_feel","BobBarcelona","LeGang","CimerRisitas47","PinkHair_","Ectobius","kitdetetanus","PortugalCDM18","WCWMondayPATRIE","1m44GoMuayThaiMP","ErdoganTyran","kheymrad_","PtitCieuxAlchi","FuroncleBarthes","benz1222","coogi","Haddock22zblex","-ChrisProlls-","WAKANDA-","Holographique","ConarMcGregor","Le_Phimosophe","sinokdeter","stopauxbans1","Ryders4521","saqalibaa","Rete","G39S-BP6-K1X7","Hommeenpaix","Meucron","Yorarien2","LeCuckFrancais3","Jfshakur","AlchimieRHUM","ZeldAlmaty","GrosPouce25","BibouKaber04","Pantino27","DonKoga","ClaireDearing","comptejvcHIBOU","Bgmaishaineux","LaSereniteGANG","Cheztamere213","CheztamerePAZ","Arakito","Shlomokawaii","JeanConseil123","HommeCultivey","-JVCED-","GoldenBond007","Anus-2-chamelle","EIiopok","Chanklito212","Bougnadir","Lemigrantdu410","Pseudal-19","AntomiouwGramci","SavoyardViril","GrospouceA1","JorunoJobana","comptejvcGANG","pseudocarban","MacronPOULOULOU","Vil-Serpent","Vergognent","PtitCieuxPEM","AlchimieHeda","AlchimieWL","NoleIegend","PeuDeChance","comptejvcLOLI","CheztamereVLAD","AttentionGliss2","Jfshakur","CherryBlast","Horion97","Herve_cuisinier","JambonDeter2","LeNouvelEsclave","lestesteur11","DragonNoir39","-RagnarLodbrock","LeCuckFrancais2","Djiss-Gang","LumiereDivine","RegimeDuCamp154","Nanatchy","[[_]--___","EurasienDeter","Saramas","Koba_LaD","FujisakiChihiro","TnepreselSOLDAT","Pistachiii","Pinpapaaa___","TnepreselCOWBOY","Aetherys","Gnomereveur","sillaz1825","54ComptesBan","SphateCersei6","PakpakChintok","MaximyFirstage4","superibtihal","helprefugees","hokaydo4756","Jean-Valfoutre","FiddleSturmDBZ","JisooBlackpink","Crousti-Fromage","5005MESSAGES","5004MESSAGES","cigarette97","kmtytb","MyBigBurger78","Wke","Bicheandthay","Shisui26","philonchophie2","D4none12","JesusTeSauvera","ducbourgogne","KuKiPete","A___S______H","GrosPouceA22","LoupDesChamps7","AdriJVC","AuraDeFeu","Cheztamere007","LaSereniteDAMSO","Solyne","macbsy","[Je_Suis]","Hallowiine-15","Jean-Yorarien","alizeeTRKL","LeVieuxKhey","[[Mo]roco-Land","PetitVeIo","comptejvcGANG","RegimeDuCamp659","Zebrasson2","Lekheyhideux","LeKheyObese","LeKhey44","LeKhey","[[[Mo]roco-Land","BannaneBleue","ebonytes","WCWMondayNitroX","comptejvcSTEIN","King-jong-Hein4","AlchimieHeda","MurJauned2","Philonchophie","GrosPorcPuant","GayCool","[Mo]roco-Land","Asperge-deter","RegimeDuCamp661","Shisui26","Cavoglave","CabinetNoirFofo","Cuillerebleue","PEMousse","DemicheIis","Troll-McClure10","ZeldAlbanie","Lekhey","HarryPineur","Haddock22chov","TnepreselSOLDAT","LeFilousophe","GayCool6","Ganicusse","Drrrrr88Hermano","A______S___H","Amaterasuuuuu","spacebrother","Arundel"];
var pseudos_post = document.getElementsByClassName("xXx bloc-pseudo-msg text-user");
var pseudos_topic = document.getElementsByClassName("xXx text-user topic-author");

for (var u = 0; u < pseudos_post.length; u++) {
    var pseudo_post = pseudos_post[u].innerHTML;

    for (var i = 0; i < pseudos_post[0].innerHTML.length; i++) { pseudo_post = pseudo_post.replace("\n", ""); pseudo_post = pseudo_post.replace(" ", ""); }

    if (equipe.indexOf(pseudo_post) != -1) {
        pseudos_post[u].parentElement.parentElement.setAttribute("style", "background-color: #E9383F");
        pseudos_post[u].parentElement.parentElement.children[1].children[0].setAttribute("style", "color:white;");
    }

    if (pseudos_post[u].style.color == "red") {
        equipe.push(pseudo_post[u]);
    }
}


if (url2 == "http://www.jeuxvideo.com/forums/0-51") {
    for (var l = 0; l < pseudos_topic.length; l++) {
        var pseudo_topic = pseudos_topic[l].innerHTML;

        for (var i = 0; i < pseudos_topic[0].innerHTML.length; i++) { pseudo_topic = pseudo_topic.replace("\n", ""); pseudo_topic = pseudo_topic.replace(" ", ""); }

        if (equipe.indexOf(pseudo_topic) != -1) {
            pseudos_topic[l].parentElement.setAttribute("style", "background-color: #E9383F");
            pseudos_topic[l].parentElement.children[0].children[1].setAttribute("style", "color:white;");
        }
    }
}

  }
})

var bloc_msg = document.getElementsByClassName("bloc-options-msg");

for (var i = 0; i < bloc_msg.length; i++) {
    var shill_span = document.createElement("span");
    shill_span.setAttribute("class", i);
    var shill_img = document.createElement("img");
    shill_img.setAttribute("onclick", "var pseudo_post = this.parentElement.parentElement.parentElement.children[0].innerHTML; for (var i = 0; i < this.parentElement.parentElement.parentElement.children[0].innerHTML.length; i++) { pseudo_post = pseudo_post.replace('\\n', ''); pseudo_post = pseudo_post.replace(' ', ''); } $.ajax({method: 'GET',url: 'https://deepfakes.000webhostapp.com/',data: {'add':pseudo_post},success : function(resultat){window.location.reload()}})");
    shill_img.setAttribute("class", "shill");
    shill_img.setAttribute("src", "https://fr.seaicons.com/wp-content/uploads/2016/03/Spy-icon.png");
    shill_img.setAttribute("style", "width:20px; height:20px;");
    shill_span.append(shill_img);
    bloc_msg[i].prepend(shill_span);
}

var reference=document.getElementById("bloc-formulaire-forum");var stickersBox=document.createElement("div");stickersBox.style.border="1px solid black";stickersBox.style.width="100%";stickersBox.style.marginTop="10px";stickersBox.style.marginBottom="10px";stickersBox.style.backgroundColor="white";stickersBox.style.padding="8px";reference.insertAdjacentElement("beforebegin",stickersBox);stickersBox.insertAdjacentHTML("afterbegin",stickers);stickersBox.insertAdjacentHTML("afterbegin",stickers2);stickersBox.insertAdjacentHTML("beforebegin",'<p style="font-weight:bold;font-size:14px";>Entrez votre message secret puis cliquez sur un sticker:</¨p> <br> <textarea id="secret-area" style="width:100%;resize:vertical"></textarea> <br> <input style="width:350px;" id="couleur_secret" type="text" placeholder="Couleur du texte (valeur en hexa, exemple : #fff)">');var stickersList=document.getElementsByClassName("secret-sticker");for(let sticker of stickersList){sticker.onclick=function(){var secretValue=document.getElementById("secret-area").value;for(var i=0;i<secretValue.length;i++){secretValue=secretValue.replace(' ','_')}
var code=new Array(secretValue.length);for(var i=0;i<secretValue.length;i++){code[i]=secretValue.charCodeAt(i)}
var secretmessage=btoa(code);var stickerPicked=this.id;var couleur=document.getElementById("couleur_secret").value;if(couleur==""){couleur="#e73b16"}
if(code.length===0||code===undefined){document.getElementById("message_topic").value+=`[[sticker:p/${stickerPicked}]]`}else{document.getElementById("message_topic").value+=`[[sticker:p/${stickerPicked}#${secretmessage}${couleur}]]`}}}
var stickersList2=document.getElementsByClassName("secret-sticker2");for(let sticker2 of stickersList2){sticker2.onclick=function(){var secretValue2=document.getElementById("secret-area").value;for(var i=0;i<secretValue2.length;i++){secretValue2=secretValue2.replace(' ','_')}
var code2=new Array(secretValue2.length);for(var i=0;i<secretValue2.length;i++){code2[i]=secretValue2.charCodeAt(i)}
var secretmessage2=btoa(code2);var stickerPicked2=this.id;var couleur2=document.getElementById("couleur_secret").value;if(couleur2==""){couleur2="#e73b16"}
if(code2.length===0||code2===undefined){document.getElementById("message_topic").value+=`[[sticker:..\\..\\..\\${stickerPicked2}]]`}else{document.getElementById("message_topic").value+=`[[sticker:..\\..\\..\\${stickerPicked2}#${secretmessage2}${couleur2}]]`}}}
var liste=["a2lyaWtydW5n","YnVtYmxlYmVl","bWVuY2hvdi1naXJv","a3ZlbGRzc2FuZw==","b2Rva2k=","Y2VyemF0NDM=","ZXRvcmFrZW4=","W3RoZV1fc29ycm93","cmlyaV8xNQ==","c3BpeGVsXw==","YnJ5a291","NGtpdG8=","bibislayer","anZjX2NlZHJpeA==","c2F1bW9uYXJjZW5jaWVs"];var conteneur=document.getElementsByClassName("img-stickers");var pseudo=document.getElementsByClassName("account-pseudo")[0].innerHTML;for(var i=0;i<conteneur.length;i++){if(conteneur[i].alt.split("#")[1]!=undefined&&liste.indexOf(btoa(pseudo.toLowerCase()))==-1){var texte=conteneur[i].alt.split("#")[1];var coul=conteneur[i].alt.split("#")[2]; var couleur_message=""; for(var u=0;u<(coul.length-2);u++){couleur_message=couleur_message+coul[u];};var message_clair="";for(var u=0;u<texte.length;u++){message_clair=message_clair+texte[u]}
message_clair=atob(message_clair);var result="";for(var a=0;a<message_clair.split(",").length;a++){result=result+String.fromCharCode(message_clair.split(",")[a])}
for(var l=0;l<result.length;l++){result=result.replace("_"," ")}
var p_message_clair=document.createElement("p");p_message_clair.setAttribute("style","font-weight: bold;color:#"+couleur_message);p_message_clair.innerHTML=result;p_message_clair.value=result;conteneur[i].setAttribute("style","display:none;");conteneur[i].after(p_message_clair)}}})()