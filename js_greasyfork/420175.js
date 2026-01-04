// ==UserScript==
// @name         GRCT kein Holz
// @author       Potusek & Anpu
// @description  Grepolis Report Converter Revolution Tools
// @include      http://*.grepolis.com/game/*
// @include      https://*.grepolis.com/game/*
// @exclude      view-source://*
// @exclude      https://classic.grepolis.com/game/*
// @icon         https://cdn.grcrt.net/img/octopus.png
// @iconURL      https://cdn.grcrt.net/img/octopus.png
// @version      5.1.0
// @grant        none
// @copyright    2011+
// @license      GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @namespace https://greasyfork.org/users/726960
// @downloadURL https://update.greasyfork.org/scripts/420175/GRCT%20kein%20Holz.user.js
// @updateURL https://update.greasyfork.org/scripts/420175/GRCT%20kein%20Holz.meta.js
// ==/UserScript==

function grcrtErrReporter(f) {
  function A() {
    var h = $("<form/>", {action:RepConv.grcrt_domain + "scripts/errorLog.php?_=" + Timestamp.server(), method:"post", target:"GRCRTErrorSender"}).append($("<textarea/>", {name:"_json"}).text(JSON.stringify(c)));
    $("#GRCRTErrorSenderTMP").html("").append(h);
    h.submit();
  }
  var c = {world:Game.world_id, time:(new Date).toISOString(), userId:Game.player_id, version:RepConv.Scripts_version, browser:navigator.userAgent, error:{message:f.message, stack:f.stack}};
  0 == $("#GRCRTErrorSender").length && ($("body").append($("<iframe/>", {id:"GRCRTErrorSender", name:"GRCRTErrorSender", style:"display:none"})), $("body").append($("<div/>", {id:"GRCRTErrorSenderTMP"}).hide()));
  f.silent ? A() : "object" == typeof Layout && "function" == typeof Layout.showConfirmDialog ? (console.log(c), Layout.showConfirmDialog("GRCRTools oops!", '<div><img src="' + RepConv.grcrt_cdn + 'img/octopus.png" style="float:left;padding-right: 10px"/><p style="padding:5px"><b>Found error</b><br/><pre>' + f + "</pre><br/>You want send?</p></div>", function() {
    A();
  })) : setTimeout(function() {
    grcrtErrReporter(f);
  }, 500);
}
function _GRCRTRepConvLangArray() {
  this.cs = {INFO:{0:"Potusek", 1:"grepolis@potusek.eu", }, WEBSITE:"Web", AUTHOR:"tomthas@seznam.cz, Thasoss, Apic", BTNCONV:"Konvertovat", BTNGENER:"Vytvo\u0159it", BTNSRC:"Zdroj", BTNVIEW:"N\u00e1hled", BTNSAVE:"Ulo\u017eit", BTNMARKS:"Ozna\u010dit jako p\u0159e\u010dten\u00e9", BTNMARKA:"Ozna\u010dit v\u0161e jako p\u0159e\u010dten\u00e9", MSGTITLE:"Konvertovat hl\u00e1\u0161en\u00ed", MSGQUEST:"Jak\u00e1 data maj\u00ed b\u00fdt zobrazena?", MSGALL:"V\u0161e", MSGBBCODE:"N\u00e1sleduj\u00edc\u00ed publikaci hl\u00e1\u0161en\u00ed m\u016f\u017eete za pomoci BB k\u00f3d\u016f vkl\u00e1dat do zpr\u00e1v \u010di f\u00f3ra.", 
  MSGRESOURCE:"Ko\u0159ist", MSGUNITS:"Jednotky", MSGBUILD:"Budovy", MSGUSC:"Pou\u017eit\u00e9 st\u0159\u00edbrn\u00e9 mince", MSGRAW:"Suroviny", SUPPORT:"Podpora", SPY:"\u0160pehov\u00e1n\u00ed", CONQUER:"Dobyto", LOSSES:"Ztr\u00e1ty", HIDDEN:"Skryt\u00e9", NOTUNIT:"[i]\u017d\u00e1dn\u00fd[/i]", TOWN:"[i]M\u011bsto:[/i] ", PLAYER:"[i]Hr\u00e1\u010d:[/i] ", ALLY:"[i]Ali:[/i] ", CAST:"seslat:", ONTOWER:"Na m\u011bsto:", MSGHIDAD:"Skr\u00fdt m\u011bsta", MSGFORUM:"Hl\u00e1\u0161en\u00ed bude publikov\u00e1no", 
  BBALLY:"alian\u010dn\u00ed f\u00f3ra / zpr\u00e1vy", BBFORUM:"extern\u00ed f\u00f3rum", ERRGETSRC:"Do\u0161lo k chyb\u011b! Pros\u00edm, ohlaste to na:  potusek@westtax.info", ICOCLOSE:"Zav\u0159\u00edt", ICOHELP:"O konvertoru", MSGPREVIEW:"<b>N\u00e1hled hl\u00e1\u0161en\u00ed</b>", HELPTAB1:"O...", HELPTAB2:"Jak to funguje", HELPTAB3:"Zm\u011bny", HELPTAB4:"Nastaven\u00ed", HLPVERSION:"Verze", HLPFIXED:"Fixed", HLPADDED:"P\u0159id\u00e1no", MSGHUMAN:{OK:"Informace ulo\u017eeny", ERROR:"P\u0159i zapisov\u00e1n\u00ed nastala chyba!", 
  YOUTUBEERROR:"\u0160patn\u011b vlo\u017een\u00ed link nebo nen\u00ed povoleno p\u0159ehr\u00e1n\u00ed mimo Youtube", }, STATSPOINT:"Body", STATSRANK:"Um\u00edst\u011bn\u00ed", LABELS:{attack:{ATTACKER:"\u00dato\u010dn\u00edk", DEFENDER:"Obr\u00e1nce", MSGHIDAT:"\u00fato\u010dn\u00edk", MSGHIDDE:"obr\u00e1nce", MSGATTUNIT:"\u00dato\u010d\u00edc\u00ed vojsko", MSGDEFUNIT:"Br\u00e1n\u00edc\u00ed vojsko", }, support:{ATTACKER:"Podporuj\u00edc\u00ed", DEFENDER:"Podpo\u0159en\u00fd", MSGHIDAT:"podporuj\u00edc\u00ed", 
  MSGHIDDE:"podpo\u0159en\u00fd", MSGATTUNIT:"Podporuj\u00edc\u00ed vojsko", MSGDEFUNIT:"Vojsko obr\u00e1nce", }, espionage:{ATTACKER:"\u0160peh", DEFENDER:"\u0160pehovan\u00fd", MSGHIDAT:"\u0161peh", MSGHIDDE:"\u0161pehovan\u00fd", MSGATTUNIT:"", MSGDEFUNIT:"", }, }, MSGDETAIL:"podrobnosti o p\u0159\u00edkazu", MSGRETURN:"(n\u00e1vrat)", MSGCLAIM:"Rezervace m\u011bsta", MSGCLAIMPPUP:"Vytvo\u0159it rezervaci", MSGGENBBCODE:"Vytvo\u0159it seznam v BB k\u00f3du", MSGDEFSITE:"Pora\u017een\u00fd...", 
  MSGLOSSITE:"Ztr\u00e1ty...", MSGASATT:"...jako \u00fato\u010dn\u00edk", MSGASDEF:"...jako obr\u00e1nce", MSGDIFF1:"neuk\u00e1zat rozd\u00edly", MSGDIFF2:"uk\u00e1zat rozd\u00edly", MSGDIFF3:"uk\u00e1zat jen rozd\u00edly", BBCODELIMIT:"V p\u0159\u00edpad\u011b p\u0159ekro\u010den\u00ed po\u010dtu znak\u016f na jeden p\u0159\u00edsp\u011bvek jsou skupiny odd\u011bleny. Ka\u017ed\u00e1 skupina je odd\u011blena samostatn\u011b.", CHKPOWERNAME:"Zobrazit \u010das zb\u00fdvaj\u00edc\u00ed do mo\u017enosti seslat kouzlo", 
  CHKNIGHTNAME:"Skr\u00fdt m\u011bsta v no\u010dn\u00edm bonusu", CHKFORUMTABS:"Nahrazen\u00ed posuvn\u00edku z\u00e1lo\u017eek na f\u00f3ru za v\u00edcero \u0159ad", BTNRESERVE:"Rezervace", LNKRESERVE:"Rezervace", LBLGETRESER:"Z\u00edsk\u00e1v\u00e1n\u00ed dat ...", BTNCHECK:"Kontrolov\u00e1n\u00ed rezervac\u00ed", CHKCMDIMG:"Vid\u011bt ikony p\u0159\u00edkaz\u016f u c\u00edlov\u00fdch m\u011bst", STATSLINK:"Statistiky zobrazovat z", BTNSUPPLAYERS:"Seznam hr\u00e1\u010d\u016f", CHKUNITSCOST:"Hl\u00e1\u0161en\u00ed ukazuje cenu padl\u00fdch jednotek", 
  CHKOCEANNUMBER:"Zobrazit \u010d\u00edsla mo\u0159\u00ed", MSGRTLBL:"Informace o vzpou\u0159e", MSGRTSHOW:"P\u0159idat informace o vzpou\u0159e", MSGRTONLINE:"Bude\u0161 online b\u011bhem b\u011b\u017e\u00edc\u00ed vzpoury?", MSGRTYES:"Ano", MSGRTNO:"Ne", MSGRTGOD:"B\u016fh", MSGRTCSTIME:"\u010cas kol. lod\u011b", MSGRTONL:"Online?", MSGRTERR:"Jsi ve \u0161patn\u00e9m m\u011bst\u011b!<br/>Pro vytvo\u0159en\u00ed informac\u00ed o vzpou\u0159e p\u0159ejdi na spr\u00e1vn\u00e9 m\u011bsto: ", BBTEXT:"textov\u00e1 verze", 
  BBHTML:"tabulkov\u00e1 verze", MSG413ERR:"<h3>Vytvo\u0159en\u00e9 hl\u00e1\u0161en\u00ed je p\u0159\u00edli\u0161 velk\u00e9.</h3><p>Vyu\u017eij dostupn\u00fdch mo\u017enost\u00ed pro bezprobl\u00e9mov\u00e9 zredukov\u00e1n\u00ed velikosti.</p>", CHKREPORTFORMAT:"Hl\u00e1\u0161en\u00ed v tabulk\u00e1ch", WALLNOTSAVED:"Hradby nejsou ulo\u017eeny", WALLSAVED:"Hradby jsou ulo\u017eeny", POPSELRECRUNIT:"klikni pro zvolen\u00ed v\u00fdchoz\u00ed produkovan\u00e9 jednotky", POPRECRUNITTRADE:"klikni pro dopln\u011bn\u00ed pot\u0159ebn\u00fdch surovin k rekrutaci zvolen\u00e9 jednotky", 
  POPINSERTLASTREPORT:"Vlo\u017eit naposledy konvertov\u00e9 hl\u00e1\u0161en\u00ed", MSGCOPYREPORT:"Hl\u00e1\u0161en\u00ed ulo\u017eeno. Klikni, pros\u00edm na [paste_icon] v okn\u011b f\u00f3ra \u010di zpr\u00e1v pro vlo\u017een\u00ed.", POPDISABLEALARM:"Vypnout alarm", SOUNDSETTINGS:"Nastaven\u00ed zvuku", CHKSOUNDMUTE:"Ztlumit", SOUNDVOLUME:"Hlasitost", SOUNDURL:"URL souboru", CHKSOUNDLOOP:"Opakovan\u011b", POPSOUNDLOOP:"P\u0159ehr\u00e1vat opakovan\u011b", POPSOUNDMUTE:"Ztlumit zvuk", POPSOUNDPLAY:"Spustit se sou\u010dasn\u00fdm nastaven\u00edm", 
  POPSOUNDSTOP:"Zastavit p\u0159ehr\u00e1v\u00e1n\u00ed", POPSOUNDURL:"URL cesta k souboru se zvukem", STATS:{PLAYER:"Stats hr\u00e1\u010de", ALLY:"Stats aliance", TOWN:"Stats m\u011bsta", INACTIVE:"Neaktivn\u00ed", CHKINACTIVE:"Uk\u00e1zat neaktivn\u00ed hr\u00e1\u010de", INACTIVEDESC:"Za tento \u010das nedo\u0161lo k n\u00e1r\u016fstu bitevn\u00edch ani stavebn\u00edch bod\u016f.", }, ABH:{WND:{WINDOWTITLE:"Pomocn\u00edk s rekrutov\u00e1n\u00edm", UNITFRAME:"zvol jednotku", DESCRIPTION1:"V tomto m\u011bst\u011b m\u00e1\u0161 [population] voln\u00e9 populace", 
  DESCRIPTION2:"Dostatek surovin pro stavbu [max_units]", DESCRIPTION3:"[yesno] m\u00e1\u0161 [research] vyzkoum\u00e1n.", DESCRIPTION4:"Do fronty lze za\u0159adit maxim\u00e1ln\u011b [max_queue] jednotek", TARGET:"Zvol c\u00edlov\u00fd po\u010det", PACKAGE:"Mno\u017estv\u00ed surovin na z\u00e1silku (jednotky)", BTNSAVE:"Ulo\u017eit nastaven\u00ed", TOOLTIPOK:"klikni pro zvolen\u00ed v\u00fdchoz\u00ed jednotky, na kterou budou pos\u00edl\u00e1ny suroviny", TOOLTIPNOTOK:"jednotka nebyla vyzkoum\u00e1na", 
  HASRESEARCH:"ANO", NORESEARCH:"NE", SETTINGSAVED:"Nastaven\u00ed pro [city] bylo ulo\u017eeno", }, RESWND:{RESLEFT:"suroviny odesl\u00e1ny", IMGTOOLTIP:"klikni pro napln\u011bn\u00ed surovinami", }, }, NEWVERSION:{AVAILABLE:"K dispozici nov\u00e1 verze", REMINDER:"P\u0159ipomenout pozd\u011bji", REQRELOAD:"Po\u017eadov\u00e1no obnoven\u00ed str\u00e1nky", RELOAD:"Obnovit", INSTALL:"Instalovat", }, LANGS:{LANG:"P\u0159eklad pro jazyk:", SEND:"Poslat ke zve\u0159ejn\u011bn\u00ed", SAVE:"Ulo\u017eit & testovat", 
  RESET:"Vr\u00e1tit k v\u00fdchoz\u00edmu jazyku", REMOVE:"Smazat V\u00e1\u0161 p\u0159eklad?", }, HELPTAB5:"P\u0159eklad", BTNSIMUL:"Simul\u00e1tor", EMOTS:{MESS:"Vlo\u017ete odkazy na emotikony, ka\u017ed\u00fd na novou \u0159\u00e1dku.", LABEL:"Chcete v\u00edce emotikon\u016f?", }, COMMAND:{ALL:"V\u0161e", FORTOWN:"M\u011bsto:", INCOMING:"P\u0159\u00edchoz\u00ed", OUTGOING:"Odchoz\u00ed", RETURNING:"Vracej\u00edc\u00ed se", }, RADAR:{TOWNFINDER:"Hledat m\u011bsta", FIND:"Hledat", MAXCSTIME:"Maxim\u00e1ln\u00ed dojezd kol. lod\u011b", 
  BTNFIND:"Hledat", TOWNNAME:"M\u011bsto", CSTIME:"\u010cas kol. lod\u011b", TOWNOWNER:"Majitel", TOWNRESERVED:"Rezervace", TOWNPOINTS:"Minim\u00e1ln\u00ed po\u010det bod\u016f", BTNSAVEDEFAULT:"Ulo\u017eit hodnoty jako v\u00fdchoz\u00ed", ALL:"Jak\u00e9koliv m\u011bsto", }, LASTUPDATE:"1487459559463", BTNVIEWBB:"BB k\u00f3d", MSGSHOWCOST:"Cena padl\u00fdch jednotek", WALL:{LISTSAVED:"Ulo\u017eeno na hradb\u00e1ch dne", LISTSTATE:"Stav pro hradby z dne", DELETECURRENT:"Smazat sou\u010dasn\u00fd z\u00e1znam", 
  WANTDELETECURRENT:"Chce\u0161 odstranit sou\u010dasn\u00fd z\u00e1znam hradeb?", }, QUESTION:"Dotaz", TSL:{WND:{WINDOWTITLE:"Seznam se\u0159azen\u00fdch m\u011bst", TOOLTIP:"uk\u00e1zat za\u0159azen\u00e9 m\u011bsto", }, }, CHKOLDTRADE:"Pou\u017e\u00edt star\u00e9 rozvr\u017een\u00ed obchodu", AO:{TITLE:"P\u0159ehled akademie", }, BBIMG:"jeden obr\u00e1zek", POPSOUNDEG:"nap\u0159\u00edklad: https://www.youtube.com/watch?v=v2AC41dglnM, https://youtu.be/v2AC41dglnM, http://www.freesfx.co.uk/rx2/mp3s/10/11532_1406234695.mp3", 
  MOBILEVERSION:"Mobiln\u00ed verze", };
  this.da = {AUTHOR:"pcgeni, Bologna, Hypatia, RAC2720, Beentherebefore, Jiluske, life2", BTNCONV:"Konventere", BTNGENER:"Generere", BTNVIEW:"Smugkig", BTNSAVE:"Gem", MSGTITLE:"Konvert\u00e9r report", MSGQUEST:"Hvilke data \u00f8nsker du at offentligg\u00f8re?", MSGBBCODE:"Ved offentligg\u00f8relse af rapporten, kan du s\u00e6tte bruge den i nyheder og forums ved at bruge BBCode.", MSGRESOURCE:"Plyndring", MSGUNITS:"Enheder", MSGBUILD:"Bygninger", MSGUSC:"Brugte s\u00f8lvm\u00f8nter", MSGRAW:"R\u00e5 materialer", 
  SUPPORT:"Hj\u00e6lp", SPY:"Spionere", CONQUER:"Overvundet", LOSSES:"Tab", HIDDEN:"Skjulte", NOTUNIT:"[i]Ingen[/i]", TOWN:"[i]By:[/i] ", PLAYER:"[i]Spiller:[/i] ", ALLY:"[i]Alliance:[/i] ", CAST:"udgiver:", ONTOWER:"P\u00e5 byen:", MSGHIDAD:"Skjul byer", MSGFORUM:"Rapporten vil offentligg\u00f8res", BBALLY:"alliance forums / i beskeden", BBFORUM:"Eksternt forum", ICOCLOSE:"Luk", ICOHELP:"Om konverteren", MSGPREVIEW:"<b>Report overblik</b>", HELPTAB1:"Omkring", HELPTAB2:"Hvordan virker det", HELPTAB3:"\u00c6ndringer", 
  HELPTAB4:"Indstillinger", MSGHUMAN:{OK:"Informationerne er gemt", ERROR:"En fejl opstod under skrivning", }, LABELS:{attack:{ATTACKER:"Angriber", DEFENDER:"Forsvarer", MSGHIDAT:"angriber", MSGHIDDE:"forsvarer", MSGATTUNIT:"Angribende h\u00e6r", MSGDEFUNIT:"Forsvarende h\u00e6r", }, support:{ATTACKER:"Hj\u00e6lper", DEFENDER:"Hjulpet", MSGHIDAT:"hj\u00e6lper", MSGHIDDE:"hjulpet", MSGATTUNIT:"St\u00f8tteh\u00e6r", MSGDEFUNIT:"Forsvarende h\u00e6r", }, espionage:{ATTACKER:"Spionere", DEFENDER:"Spioneret", 
  MSGHIDAT:"spionere", MSGHIDDE:"udspioneret", MSGATTUNIT:"", MSGDEFUNIT:"", }, }, MSGDETAIL:"kommando detaljer", MSGRETURN:"(tilbage)", MSGGENBBCODE:"Generere en liste af BBCode", MSGDEFSITE:"Besejret...", MSGLOSSITE:"Tab...", MSGASATT:"...som angriber", MSGASDEF:"...som forsvarer", MSGDIFF1:"vis ikke forskelle", MSGDIFF2:"vis forskelle", MSGDIFF3:"vis kun forskellene", BBCODELIMIT:"Grundet den begr\u00e6nsede tekstm\u00e6ngde i en boks, og for at undg\u00e5 en lang liste, er datasne inddelt i hver deres boks.", 
  CHKPOWERNAME:"Vis den tilbagev\u00e6rende tid indtil magien kan bruges", CHKFORUMTABS:"Overskriv scrolls fanerne p\u00e5 forummet for multi line", STATSLINK:"Statistikker fra fremviseren", BTNSUPPLAYERS:"Liste over spillere", CHKUNITSCOST:"Rapporten viser tabene af tabte enheder", CHKOCEANNUMBER:"Vis havnumre", MSGRTLBL:"Opr\u00f8r information", MSGRTSHOW:"tilf\u00f8j igangv\u00e6rende opr\u00f8r information", MSGRTONLINE:"Er du online n\u00e5r det r\u00f8de opr\u00f8r er i gang?", MSGRTYES:"Ja", 
  MSGRTNO:"Nej", MSGRTGOD:"Gud", MSGRTCSTIME:"KS tid", MSGRTONL:"til stede?", MSGRTERR:"Du er i den forkerte by!<br/>For at lave den rigtige opr\u00f8rs information, g\u00e5 til byen: ", BBTEXT:"tekst version", BBHTML:"tabel version", MSG413ERR:"<h3>Den generede rapport er for stor.</h3><p>Brug andre muligeheder for at rapportere uden problemer</p>", CHKREPORTFORMAT:"Generer rapport ved brug af tabbeler", WALLNOTSAVED:"Muren er ikke gemt", WALLSAVED:"Muren er gemt", POPSELRECRUNIT:"klik, for at v\u00e6lge standard produktions enhed", 
  POPRECRUNITTRADE:"klik, for at inds\u00e6tte de n\u00f8dvendige ressourcer for den valgte enhed", POPINSERTLASTREPORT:"Inds\u00e6t den senest konventerede rapport", MSGCOPYREPORT:"Rapporten er gemt. V\u00e6r s\u00f8d at klikke [paste_icon] p\u00e5 forummet eller under ny besked for at inds\u00e6tte den", POPDISABLEALARM:"Sl\u00e5 alarm fra", SOUNDSETTINGS:"Lyd indstillinger", CHKSOUNDMUTE:"Lydl\u00f8s", SOUNDVOLUME:"Lydstyke", SOUNDURL:"Lyd fil url", CHKSOUNDLOOP:"spring", POPSOUNDLOOP:"Spring i numrene", 
  POPSOUNDMUTE:"Sl\u00e5 lyden fra", POPSOUNDPLAY:"Spil med nuv\u00e6rende indstillinger", POPSOUNDSTOP:"Stop afspilning", POPSOUNDURL:"Url sti til lydfilen", STATS:{PLAYER:"Spiller statistik", ALLY:"Alliance statistik", TOWN:"By statistik", CHKINACTIVE:"Vis inaktive spillere", INACTIVE:"Inaktive", }, ABH:{WND:{WINDOWTITLE:"GRCRTools H\u00e6r Bygnings Hj\u00e6lper", UNITFRAME:"v\u00e6lg din enhed", DESCRIPTION1:"I denne by, har du [population] fri befolkning", DESCRIPTION2:"Hvilket er nok til at rekruttere [max_units]", 
  DESCRIPTION3:"Du [yesno] har udforsket  [research].", DESCRIPTION4:"Du kan maximalt s\u00e6tte [max_queue] enheder igang   ", TARGET:"v\u00e6lg dit byggem\u00e5l", PACKAGE:"ressourcer per bestilling (enhed)", BTNSAVE:"gem indstillingerne", TOOLTIPOK:"klik, for at v\u00e6lge enhed du vil sende resourser til", TOOLTIPNOTOK:"enheder er ikke udforsket", HASRESEARCH:"G\u00d8R", NORESEARCH:"G\u00d8R IKKE", SETTINGSAVED:"Ops\u00e6tningen for [by] er gemt", }, RESWND:{RESLEFT:"tilg\u00e6ngelige ressourcer", 
  IMGTOOLTIP:"klik, for at inds\u00e6tte ressourcer", }, }, NEWVERSION:{AVAILABLE:"Ny version tilg\u00e6ngelig", INSTALL:"Installer", REMINDER:"P\u00e5mind mig senere", REQRELOAD:"Kr\u00e6ver genindl\u00e6sning af siden", RELOAD:"Genindl\u00e6s", }, LANGS:{LANG:"Overs\u00e6ttelse for sprog:", SEND:"Send til publikatoren", SAVE:"Gem og test", RESET:"Gendan standard sproget", REMOVE:"Slet din overs\u00e6tning", }, HELPTAB5:"Overs\u00e6ttelse", ATTACKER:"Angribere", DEFENDER:"Forsvarer", MSGHIDAT:"angriber", 
  MSGHIDDE:"forsvarer", MSGATTUNIT:"H\u00e6r angreb", MSGDEFUNIT:"H\u00e6r forsvarere", EMOTS:{LABEL:"Vil du have flere smilieys?", MESS:"Inds\u00e6t links til smilieys, hver p\u00e5 en ny linie", }, COMMAND:{ALL:"Alle", INCOMING:"indkommende", OUTGOING:"udg\u00e5ende", RETURNING:"retur", FORTOWN:"by:", }, BTNSIMUL:"Simulatoren", LASTUPDATE:"1488487738325", BTNVIEWBB:"BB-KODE", MSGSHOWCOST:"Omkostninger ved mistede enheder", BBIMG:"enkelt billede", POPSOUNDEG:"eksempel: https://www.youtube.com/watch?v=v2AC41dglnM, https://youtu.be/v2AC41dglnM, http://www.freesfx.co.uk/rx2/mp3s/10/11532_1406234695.mp3", 
  RADAR:{TOWNFINDER:"S\u00f8g byer", FIND:"S\u00f8g", MAXCSTIME:"Maksimal tid", MAXUNITTIME:"Maksimal tid", BTNFIND:"S\u00f8g", TOWNNAME:"By", UNITTIME:"Time", TOWNOWNER:"Ejer", BTNSAVEDEFAULT:"Gem v\u00e6rdier som standard", }, QUESTION:"Sp\u00f8rgsm\u00e5l", };
  this.de = {INFO:{0:"Potusek", 1:"grepolis@potusek.eu", }, WEBSITE:"Strona domowa", AUTHOR:"Kartuga-Chipssi1@gmx.net, Lupo22, Jordan06, Gliese 558, Luccer", BTNCONV:"Konvertieren", BTNGENER:"Generieren", BTNSRC:"Quelle", BTNVIEW:"Vorschau", BTNSAVE:"Speichern", BTNMARKS:"Als gelesen markieren", BTNMARKA:"Markieren Sie alle als gelesen", MSGTITLE:"Konvertiere den Report", MSGQUEST:"Welche Daten willst du ver\u00f6ffentlichen?", MSGALL:"Alle", MSGBBCODE:"Nach der Ver\u00f6ffentlichung des Berichts kannst du die News in internen und externen Foren ver\u00f6ffentlichen.", 
  MSGRESOURCE:"Beute", MSGUNITS:"Einheiten", MSGBUILD:"Geb\u00e4ude", MSGUSC:"Verwendete Silberm\u00fcnzen", MSGRAW:"Rohstoffe", SUPPORT:"Unterst\u00fctzung", SPY:"Spionage", CONQUER:"Erobert", LOSSES:"Verluste", HIDDEN:"Versteckt", NOTUNIT:"[i]Keine[/i]", TOWN:"[i]Stadt:[/i] ", PLAYER:"[i]Spieler:[/i] ", ALLY:"[i]Allianz:[/i] ", CAST:"Besetzung:", ONTOWER:"In der Stadt:", MSGHIDAD:"St\u00e4dte ausblenden", MSGFORUM:"Der Bericht wird ver\u00f6ffentlicht", BBALLY:"Allianz Forum / in Nachrichten", 
  BBFORUM:"Externes Forum", ERRGETSRC:"Ist ein Fehler aufgetreten! Bitte, generiere mir die Quelle und senden Sie als Anhang an die Adresse potusek@westtax.info", ICOCLOSE:"Schlie\u00dfen", ICOHELP:"\u00dcber den Konverter", MSGPREVIEW:"<b>Bericht-Vorschau</b>", HELPTAB1:"\u00dcber", HELPTAB2:"Wie funktioniert es?", HELPTAB3:"\u00c4nderungen", HELPTAB4:"Einstellungen", HLPVERSION:"Version", HLPFIXED:"Fixed", HLPADDED:"Added", MSGHUMAN:{OK:"Die Informationen wurden gespeichert", ERROR:"Fehler beim Schreiben", 
  YOUTUBEERROR:"Fehlerhafter Link oder nicht au\u00dferhalb von Youtube erlaubt abzuspielen", }, STATS:"Player stats", STATSPOINT:"Points", STATSRANK:"Rank", LABELS:{attack:{ATTACKER:"Angreifer", DEFENDER:"Verteidiger", MSGHIDAT:"Angreifer", MSGHIDDE:"Verteidiger", MSGATTUNIT:"Armee angreifer", MSGDEFUNIT:"Armee verteidiger", }, support:{ATTACKER:"Unterst\u00fctzung", DEFENDER:"Unterst\u00fctzte", MSGHIDAT:"tragende", MSGHIDDE:"unterst\u00fctzt", MSGATTUNIT:"Armee Unterst\u00fctzung", MSGDEFUNIT:"Armee Verteidigung", 
  }, espionage:{ATTACKER:"Spion", DEFENDER:"spioniert", MSGHIDAT:"spionieren", MSGHIDDE:"ausspionierte Stadt", MSGATTUNIT:"", MSGDEFUNIT:"", }, }, MSGDETAIL:"Befehl Details", MSGRETURN:"(r\u00fcckkehr)", MSGCLAIM:"Reservierte Stadt", MSGCLAIMPPUP:"Generieren Reservation", MSGDEFSITE:"Besiegt...", MSGLOSSITE:"Verluste...", MSGASATT:"...als Angreifer", MSGASDEF:"...als Verteidiger", MSGDIFF:"zeige unterschiede", MSGDIFF1:"zeige keine Unterschiede", MSGDIFF2:"Zeige Unterschiede", MSGDIFF3:"zeige nur die Unterschiede", 
  BBCODELIMIT:"In Anbetracht der begrenzten Menge des Textes in einem Pfosten, im Falle einer langen Liste, wurden die Daten in Gruppen aufgeteilt. Jede Gruppe wird als separater Eintrag eingef\u00fcgt.", CHKPOWERNAME:"Zeigt die verbleibende Zeit auf die M\u00f6glichkeit der Verwendung des Zaubers", CHKFORUMTABS:"Ersetzt das bl\u00e4ttern Forum Reiter werden in 2 Reihen angezeigt", BTNRESERVE:"Booking", LNKRESERVE:"Reservierungen", LBLGETRESER:"Erste Daten ...", BTNCHECK:"\u00dcberpr\u00fcfen Vorbehalte", 
  CHKCMDIMG:"View the icons for the destination city commands", STATSLINK:"Statistiken anzeigen \u00fcber", BTNSUPPLAYERS:"Liste der Spieler", CHKUNITSCOST:"Im Bericht werden die Kosten f\u00fcr verlorene Einheiten angezeigt", CHKOCEANNUMBER:"Display numbers seas", MSGRTYES:"Ja", MSGRTNO:"Nein", MSGGENBBCODE:"Erstelle die Liste als BBCode", BBTEXT:"Text-Version", BBHTML:"Tabellen-Version", WALLNOTSAVED:"Die Stadtmauer ist nicht gespeichert", WALLSAVED:"Die Stadtmauer ist gespeichert", POPINSERTLASTREPORT:"Einf\u00fcgen vom letzten erstellten Bericht", 
  POPDISABLEALARM:"Alarm ausschalten", SOUNDSETTINGS:"Sound Einstellungen", ABH:{WND:{UNITFRAME:"Einheit w\u00e4hlen", DESCRIPTION1:"Du hast in dieser Stadt [population] freie Bev\u00f6lkerung", BTNSAVE:"Einstellungen speichern", SETTINGSAVED:"Einstellungen f\u00fcr [city] wurden gespeichert", DESCRIPTION2:"Das reicht f\u00fcr den Bau von [max_units]", DESCRIPTION3:"Die Forschung [research] [yesno] erforscht.", HASRESEARCH:"IST", NORESEARCH:"IST NICHT", DESCRIPTION4:"Es k\u00f6nnen [max_queue] Einheiten gebaut werden.", 
  WINDOWTITLE:"Armee aufbauen", TARGET:"w\u00e4hle deine Bauziel", PACKAGE:"Rohstoff-Paket pro Sendung (Einheiten)", TOOLTIPOK:"Klicken, um die standardm\u00e4\u00dfige Einheit auszuw\u00e4hlen, f\u00fcr die du Rohstoffe sendest", TOOLTIPNOTOK:"Einheit nicht erforscht", }, RESWND:{IMGTOOLTIP:"Klicken, um Rohstoffe einzuf\u00fcgen", RESLEFT:"\u00dcbrige Rohstoff zum senden", }, }, NEWVERSION:{REMINDER:"sp\u00e4ter erinnern", AVAILABLE:"Neue Version verf\u00fcgbar", INSTALL:"Installieren", REQRELOAD:"Aktualisierung erforderlich", 
  RELOAD:"Aktualisierung ", }, LANGS:{LANG:"\u00dcbersetzung in Sprache:", REMOVE:"Deine \u00dcbersetzung l\u00f6schen?", RESET:"Auf standardm\u00e4\u00dfige Sprache zur\u00fccksetzen", SAVE:"Speichern & Testen", SEND:"Senden zum Ver\u00f6ffentlichen", }, HELPTAB5:"\u00dcbersetzung", POPSOUNDURL:"Url Pfad zur Musik-Datei", SOUNDVOLUME:"Lautst\u00e4rke", MSGCOPYREPORT:"Der Bericht wurde gespeichert.Click [paste_icon] um den Bericht im Forum oder einer Nachricht einzuf\u00fcgen.", POPSOUNDSTOP:"Wiedergabe stoppen", 
  MSGSHOWCOST:"Kosten f\u00fcr verlorene Einheiten", MSGRTLBL:"Revolte Informationen", MSGRTSHOW:"hinzuf\u00fcgen eingehende Revolte Informationen", MSGRTONLINE:"Werden Sie w\u00e4hrend der roten Revolte online sein?", MSGRTGOD:"Gott", MSGRTCSTIME:"CS Zeit", MSGRTONL:"Online?", MSGRTERR:"Sie befinden sich in der falschen Stadt!<br/>Um Informationen \u00fcber die Revolte zu erstellen, gehe bitte zur Stadt: ", MSG413ERR:"<h3>Der generierte Bericht ist zu gro\u00df.</h3><p>Verwende die verf\u00fcgbaren Optionen zum reduzieren und um ohne Probleme zu ver\u00f6ffentlichen.</p>", 
  CHKREPORTFORMAT:"Erstellen Sie Berichte mit Hilfe von Tabellen", POPSELRECRUNIT:"Klicken, um Standard-Produktionseinheit zu w\u00e4hlen", CHKSOUNDMUTE:"Stumm", SOUNDURL:"Musik-Datei URL", CHKSOUNDLOOP:"Schleife", POPSOUNDLOOP:"Spiele in Schleife ab", POPSOUNDMUTE:"Schalte den Ton stumm", POPSOUNDPLAY:"Spiele mit den aktuellen Einstellungen", EMOTS:{LABEL:"Willst du mehr Emoticons?", MESS:"Link einf\u00fcgen zu Emoticon, jeden in einer neuen Zeile.", }, COMMAND:{ALL:"Alles", INCOMING:"Eingehend", 
  OUTGOING:"Ausgehend", RETURNING:"R\u00fcckkehr", FORTOWN:"Stadt:", }, RADAR:{TOWNFINDER:"Suche St\u00e4dte", FIND:"Suchen", MAXCSTIME:"Maximale Zeit Kolonieschiff", BTNFIND:"Suchen", TOWNNAME:"Stadt", CSTIME:"Zeit Kolonieschiff ", TOWNOWNER:"Besitzer", TOWNRESERVED:"Reservierung", TOWNPOINTS:"Minimale Stadtpunkte", BTNSAVEDEFAULT:"Werte als Standard speichern", ALL:"Jede Stadt", }, TSL:{WND:{TOOLTIP:"zeige Sortiert nach Ort", WINDOWTITLE:"St\u00e4dte Liste sortiert", }, }, QUESTION:"Frage", WALL:{LISTSAVED:"Gespeichert auf der Mauer der Tag", 
  LISTSTATE:"Beschaffenheit der Mauer an dem Tag", DELETECURRENT:"L\u00f6sche den aktuellen Datensatz", WANTDELETECURRENT:"M\u00f6chtest du den aktuellen Speicherstand der Mauer entfernen?", }, CHKWONDERTRADE:"Wenn Resourcen f\u00fcr Weltwunder gesendet werden, sende den maximal m\u00f6glichen Betrag", MOBILEVERSION:"Mobile Version", AO:{TITLE:"Akademie \u00dcberblick", }, CHKOLDTRADE:"Altes Layout verwenden", POPSOUNDEG:"Beispiel: https://www.youtube.com/watch?v=v2AC41dglnM, https://youtu.be/v2AC41dglnM, http://www.freesfx.co.uk/rx2/mp3s/10/11532_1406234695.mp3", 
  POPRECRUNITTRADE:"Klicken, um fehlende Rohstoffe f\u00fcr die Rekrutierung der ausgew\u00e4hlten Einheit auszuf\u00fcllen", BBIMG:"Einzelnes Bild", LASTUPDATE:"1487463932539", };
  this.el = {AUTHOR:"moutza, stathisss21, Akis27274, george696969, StikElLoco, ironvaggosOFFICIAL", BTNCONV:"\u039c\u03b5\u03c4\u03b1\u03c4\u03c1\u03bf\u03c0\u03ae", BTNGENER:"\u0394\u03b7\u03bc\u03b9\u03bf\u03c5\u03c1\u03b3\u03af\u03b1", BTNVIEW:"\u03a0\u03c1\u03bf\u03b5\u03c0\u03b9\u03c3\u03ba\u03cc\u03c0\u03b7\u03c3\u03b7", BTNSAVE:"\u0391\u03c0\u03bf\u03b8\u03ae\u03ba\u03b5\u03c5\u03c3\u03b7", MSGTITLE:"\u039c\u03b5\u03c4\u03b1\u03c4\u03c1\u03bf\u03c0\u03ae \u03b1\u03bd\u03b1\u03c6\u03bf\u03c1\u03ac\u03c2", 
  MSGQUEST:"\u03a0\u03bf\u03b9\u03b1 \u03b1\u03c0\u03cc \u03c4\u03b1 \u03b4\u03b5\u03b4\u03bf\u03bc\u03ad\u03bd\u03b1 \u03b8\u03b5\u03c2 \u03bd\u03b1 \u03b4\u03b7\u03bc\u03bf\u03c3\u03b9\u03b5\u03cd\u03c3\u03b5\u03b9\u03c2;", MSGBBCODE:"\u039c\u03b5\u03c4\u03ac \u03c4\u03b7 \u03b4\u03b7\u03bc\u03bf\u03c3\u03af\u03b5\u03c5\u03c3\u03b7 \u03c4\u03b7\u03c2 \u03b1\u03bd\u03b1\u03c6\u03bf\u03c1\u03ac\u03c2, \u03bc\u03c0\u03bf\u03c1\u03b5\u03af\u03c4\u03b5 \u03bd\u03b1 \u03c4\u03b7 \u03c3\u03c5\u03bd\u03b4\u03c5\u03ac\u03c3\u03b5\u03c4\u03b5 \u03bc\u03b5 \u03bd\u03ad\u03b1 \u03ba\u03b1\u03b9 \u03c6\u03cc\u03c1\u03bf\u03c5\u03bc\u03c2 \u03c7\u03c1\u03b7\u03c3\u03b9\u03bc\u03bf\u03c0\u03bf\u03b9\u03ce\u03bd\u03c4\u03b1\u03c2 \u03c4\u03bf BBCode.", 
  MSGRESOURCE:"\u039b\u03ac\u03c6\u03c5\u03c1\u03b1", MSGUNITS:"\u039c\u03bf\u03bd\u03ac\u03b4\u03b5\u03c2", MSGBUILD:"\u039a\u03c4\u03af\u03c1\u03b9\u03b1", MSGUSC:"\u03a7\u03c1\u03b7\u03c3\u03b9\u03bc\u03bf\u03c0\u03bf\u03b9\u03b7\u03bc\u03ad\u03bd\u03b1 \u03b1\u03c3\u03b7\u03bc\u03ad\u03bd\u03b9\u03b1 \u03bd\u03bf\u03bc\u03af\u03c3\u03bc\u03b1\u03c4\u03b1", MSGRAW:"\u03a5\u03bb\u03b9\u03ba\u03ac \u03ba\u03b1\u03c4\u03b1\u03c3\u03ba\u03b5\u03c5\u03ae\u03c2", SUPPORT:"\u03a5\u03c0\u03bf\u03c3\u03c4\u03ae\u03c1\u03b9\u03be\u03b7", 
  SPY:"\u039a\u03b1\u03c4\u03b1\u03c3\u03ba\u03bf\u03c0\u03af\u03b1", CONQUER:"\u039a\u03b1\u03c4\u03ac\u03ba\u03c4\u03b7\u03c3\u03b7", LOSSES:"\u0391\u03c0\u03ce\u03bb\u03b5\u03b9\u03b5\u03c2", HIDDEN:"\u039a\u03c1\u03c5\u03bc\u03bc\u03ad\u03bd\u03b1", NOTUNIT:"[i]\u039a\u03b1\u03bd\u03ad\u03bd\u03b1\u03c2[/i]", TOWN:"[i]\u03a0\u03cc\u03bb\u03b7:[/i] ", PLAYER:"[i]\u03a0\u03b1\u03af\u03c7\u03c4\u03b7\u03c2:[/i] ", ALLY:"[i]\u03a3\u03c5\u03bc\u03bc\u03b1\u03c7\u03af\u03b1:[/i] ", CAST:"\u03b5\u03be\u03b1\u03c0\u03cc\u03bb\u03c5\u03c3\u03b7:", 
  ONTOWER:"\u039c\u03b5\u03c2 \u03c4\u03b7\u03bd \u03c0\u03cc\u03bb\u03b7:", MSGHIDAD:"\u039a\u03c1\u03cd\u03c8\u03b5 \u03c4\u03b9\u03c2 \u03c0\u03cc\u03bb\u03b5\u03b9\u03c2", MSGFORUM:"\u0397 \u03b1\u03bd\u03b1\u03c6\u03bf\u03c1\u03ac \u03b8\u03b1 \u03b4\u03b7\u03bc\u03bf\u03c3\u03b9\u03b5\u03c5\u03b8\u03b5\u03af", BBALLY:"\u03c3\u03c5\u03bc\u03bc\u03b1\u03c7\u03b9\u03ba\u03cc \u03c6\u03cc\u03c1\u03bf\u03c5\u03bc / \u03c3\u03b5 \u03bc\u03ae\u03bd\u03c5\u03bc\u03b1", BBFORUM:"\u03b5\u03be\u03c9\u03c4\u03b5\u03c1\u03b9\u03ba\u03cc \u03c6\u03cc\u03c1\u03bf\u03c5\u03bc", 
  ICOCLOSE:"\u039a\u03bb\u03b5\u03b9\u03c3\u03c4\u03cc", ICOHELP:"\u03a3\u03c7\u03b5\u03c4\u03b9\u03ba\u03ac \u03bc\u03b5 \u03c4\u03bf\u03bd \u039c\u03b5\u03c4\u03b1\u03c4\u03c1\u03bf\u03c0\u03ad\u03b1", MSGPREVIEW:"<b>\u03a0\u03c1\u03bf\u03b5\u03c0\u03b9\u03c3\u03ba\u03cc\u03c0\u03b7\u03c3\u03b7 \u0391\u03bd\u03b1\u03c6\u03bf\u03c1\u03ac\u03c2</b>", HELPTAB1:"\u03a3\u03c7\u03b5\u03c4\u03b9\u03ba\u03ac \u03bc\u03b5", HELPTAB2:"\u03a0\u03c9\u03c2 \u03bb\u03b5\u03b9\u03c4\u03bf\u03c5\u03c1\u03b3\u03b5\u03af", 
  HELPTAB3:"\u0391\u03bb\u03bb\u03b1\u03b3\u03ad\u03c2", HELPTAB4:"\u03a1\u03c5\u03b8\u03bc\u03af\u03c3\u03b5\u03b9\u03c2", MSGHUMAN:{OK:"\u039f\u03b9 \u03c0\u03bb\u03b7\u03c1\u03bf\u03c6\u03bf\u03c1\u03af\u03b5\u03c2 \u03ad\u03c7\u03bf\u03c5\u03bd \u03b1\u03c0\u03bf\u03b8\u03b7\u03ba\u03b5\u03c5\u03c4\u03b5\u03af", ERROR:"\u0388\u03bd\u03b1 \u03c3\u03c6\u03ac\u03bb\u03bc\u03b1 \u03c0\u03b1\u03c1\u03bf\u03c5\u03c3\u03b9\u03ac\u03c3\u03c4\u03b7\u03ba\u03b5 \u03ba\u03b1\u03b8\u03ce\u03c2 \u03b3\u03c1\u03ac\u03c6\u03b1\u03c4\u03b5", 
  YOUTUBEERROR:"\u039b\u03ac\u03b8\u03bf\u03c2 \u03c3\u03cd\u03bd\u03b4\u03b5\u03c3\u03bc\u03bf\u03c2 \u03ae \u03b4\u03b5\u03bd \u03b5\u03c0\u03b9\u03c4\u03c1\u03ad\u03c0\u03b5\u03c4\u03b5 \u03b7 \u03b1\u03bd\u03b1\u03c0\u03b1\u03c1\u03b1\u03b3\u03c9\u03b3\u03ae \u03b5\u03ba\u03c4\u03cc\u03c2 \u03b1\u03c0\u03cc \u03c4\u03bf YouTube", }, LABELS:{attack:{ATTACKER:"\u0395\u03c0\u03b9\u03c4\u03b9\u03b8\u03ad\u03bc\u03b5\u03bd\u03bf\u03c2", DEFENDER:"\u0391\u03bc\u03c5\u03bd\u03cc\u03bc\u03b5\u03bd\u03bf\u03c2", 
  MSGHIDAT:"\u03b5\u03c0\u03b9\u03c4\u03b9\u03b8\u03ad\u03bc\u03b5\u03bd\u03bf\u03c5", MSGHIDDE:"\u03b1\u03bc\u03c5\u03bd\u03cc\u03bc\u03b5\u03bd\u03bf\u03c5", MSGATTUNIT:"\u03a3\u03c4\u03c1\u03b1\u03c4\u03cc\u03c2 \u03c0\u03bf\u03c5 \u03b5\u03c0\u03b9\u03c4\u03b5\u03af\u03b8\u03b5\u03c4\u03b5", MSGDEFUNIT:"\u03a3\u03c4\u03c1\u03b1\u03c4\u03cc\u03c2 \u03c0\u03bf\u03c5 \u03b1\u03bc\u03cd\u03bd\u03b5\u03c4\u03b5", }, support:{ATTACKER:"\u03a5\u03c0\u03bf\u03c3\u03c4\u03b7\u03c1\u03af\u03b6\u03c9", 
  DEFENDER:"\u03a5\u03c0\u03bf\u03c3\u03c4\u03b7\u03c1\u03af\u03b6\u03bf\u03bc\u03b1\u03b9", MSGHIDAT:"\u03c5\u03c0\u03bf\u03c3\u03c4\u03b7\u03c1\u03af\u03b6\u03c9", MSGHIDDE:"\u03c5\u03c0\u03bf\u03c3\u03c4\u03b7\u03c1\u03af\u03b6\u03bf\u03bc\u03b1\u03b9", MSGATTUNIT:"\u03a3\u03c4\u03c1\u03b1\u03c4\u03cc\u03c2 \u03c0\u03bf\u03c5 \u03c5\u03c0\u03bf\u03c3\u03c4\u03b7\u03c1\u03af\u03b6\u03b5\u03b9", MSGDEFUNIT:"\u03a3\u03c4\u03c1\u03b1\u03c4\u03cc\u03c2 \u03c0\u03bf\u03c5 \u03b1\u03bc\u03cd\u03bd\u03b5\u03c4\u03b5", 
  }, espionage:{ATTACKER:"\u039a\u03b1\u03c4\u03b1\u03c3\u03ba\u03bf\u03c0\u03b5\u03cd\u03b5\u03b9", DEFENDER:"\u039a\u03b1\u03c4\u03b1\u03c3\u03ba\u03bf\u03c0\u03b5\u03cd\u03b5\u03c4\u03b5", MSGHIDAT:"\u03ba\u03b1\u03c4\u03b1\u03c3\u03ba\u03bf\u03c0\u03b5\u03cd\u03b5\u03b9", MSGHIDDE:"\u03ba\u03b1\u03c4\u03b1\u03c3\u03ba\u03bf\u03c0\u03b5\u03cd\u03b5\u03c4\u03b1\u03b9", MSGATTUNIT:"", MSGDEFUNIT:"", }, }, MSGDETAIL:"\u03bb\u03b5\u03c0\u03c4\u03bf\u03bc\u03ad\u03c1\u03b5\u03b9\u03b5\u03c2 \u03b5\u03bd\u03c4\u03bf\u03bb\u03ae\u03c2", 
  MSGRETURN:"(\u03b5\u03c0\u03b9\u03c3\u03c4\u03c1\u03bf\u03c6\u03ae)", MSGGENBBCODE:"\u0394\u03b7\u03bc\u03b9\u03bf\u03c5\u03c1\u03b3\u03af\u03b1 \u03bb\u03af\u03c3\u03c4\u03b1\u03c2 \u03c4\u03c9\u03bd BBCode", MSGDEFSITE:"\u0397\u03c4\u03c4\u03ae\u03b8\u03b7\u03ba\u03b1\u03bd...", MSGLOSSITE:"\u0391\u03c0\u03ce\u03bb\u03b5\u03b9\u03b5\u03c2...", MSGASATT:"...\u03c9\u03c2 \u03b5\u03c0\u03b9\u03c4\u03b9\u03b8\u03ad\u03bc\u03b5\u03bd\u03bf\u03b9", MSGASDEF:"...\u03c9\u03c2 \u03b1\u03bc\u03c5\u03bd\u03cc\u03bc\u03b5\u03bd\u03bf\u03b9", 
  MSGDIFF1:"\u03bc\u03b7\u03bd \u03b4\u03b5\u03af\u03c7\u03bd\u03b5\u03b9\u03c2 \u03c4\u03b9\u03c2 \u03b4\u03b9\u03b1\u03c6\u03bf\u03c1\u03ad\u03c2", MSGDIFF2:"\u03b4\u03b5\u03af\u03be\u03b5 \u03c4\u03b9\u03c2 \u03b4\u03b9\u03b1\u03c6\u03bf\u03c1\u03ad\u03c2", MSGDIFF3:"\u03b4\u03b5\u03af\u03be\u03b5 \u03bc\u03cc\u03bd\u03bf \u03c4\u03b9\u03c2 \u03b4\u03b9\u03b1\u03c6\u03bf\u03c1\u03ad\u03c2", BBCODELIMIT:"\u0395\u03bd\u03cc\u03c8\u03b5\u03b9 \u03c4\u03bf\u03c5 \u03c0\u03b5\u03c1\u03b9\u03bf\u03c1\u03b9\u03c3\u03bc\u03ad\u03bd\u03bf\u03c5 \u03c0\u03bf\u03c3\u03bf\u03cd \u03c4\u03c9\u03bd \u03ba\u03b5\u03b9\u03bc\u03ad\u03bd\u03c9\u03bd \u03c3\u03b5 \u03bc\u03af\u03b1 \u03b8\u03ad\u03c3\u03b7, \u03c3\u03c4\u03b7\u03bd \u03c0\u03b5\u03c1\u03af\u03c0\u03c4\u03c9\u03c3\u03b7 \u03b5\u03bd\u03cc\u03c2 \u03bc\u03b1\u03ba\u03c1\u03bf\u03cd \u03ba\u03b1\u03c4\u03b1\u03bb\u03cc\u03b3\u03bf\u03c5, \u03c4\u03b1 \u03b4\u03b5\u03b4\u03bf\u03bc\u03ad\u03bd\u03b1 \u03c7\u03c9\u03c1\u03af\u03b6\u03bf\u03bd\u03c4\u03b1\u03b9 \u03c3\u03b5 \u03bf\u03bc\u03ac\u03b4\u03b5\u03c2. \u039a\u03ac\u03b8\u03b5 \u03bf\u03bc\u03ac\u03b4\u03b1 \u03b5\u03c0\u03b9\u03ba\u03bf\u03bb\u03bb\u03ac\u03c4\u03b1\u03b9 \u03c9\u03c2 \u03be\u03b5\u03c7\u03c9\u03c1\u03b9\u03c3\u03c4\u03ae \u03b5\u03af\u03c3\u03bf\u03b4\u03bf.", 
  CHKPOWERNAME:"\u0395\u03bc\u03c6\u03ac\u03bd\u03b9\u03c3\u03b7 \u03ce\u03c1\u03b1\u03c2 \u03c0\u03bf\u03c5 \u03b1\u03c0\u03bf\u03bc\u03ad\u03bd\u03b5\u03b9 \u03bc\u03ad\u03c7\u03c1\u03b9 \u03c4\u03b7 \u03b4\u03c5\u03bd\u03b1\u03c4\u03cc\u03c4\u03b7\u03c4\u03b1 \u03c7\u03c1\u03b7\u03c3\u03b9\u03bc\u03bf\u03c0\u03bf\u03af\u03b7\u03c3\u03b7\u03c2 \u03be\u03bf\u03c1\u03ba\u03b9\u03bf\u03cd", CHKFORUMTABS:"\u0391\u03bd\u03c4\u03b9\u03ba\u03b1\u03c4\u03b1\u03c3\u03c4\u03ae\u03c3\u03c4\u03b5 \u03c4\u03b7\u03bd \u03ba\u03cd\u03bb\u03b9\u03c3\u03b7 \u03ba\u03b1\u03c1\u03c4\u03b5\u03bb\u03ce\u03bd \u03c3\u03c4\u03bf \u03c6\u03cc\u03c1\u03bf\u03c5\u03bc \u03b3\u03b9\u03b1 \u03c0\u03bf\u03bb\u03bb\u03b1\u03c0\u03bb\u03ae \u03b3\u03c1\u03b1\u03bc\u03bc\u03ae", 
  STATSLINK:"\u03a3\u03c4\u03b1\u03c4\u03b9\u03c3\u03c4\u03b9\u03ba\u03ac \u03c4\u03b7\u03c2 \u03b1\u03c0\u03b5\u03b9\u03ba\u03cc\u03bd\u03b9\u03c3\u03b7\u03c2", BTNSUPPLAYERS:"\u039b\u03af\u03c3\u03c4\u03b1 \u03c4\u03c9\u03bd \u03c0\u03b1\u03b9\u03c7\u03c4\u03ce\u03bd", CHKUNITSCOST:"\u0397 \u03b1\u03bd\u03b1\u03c6\u03bf\u03c1\u03ac \u03b4\u03b5\u03af\u03c7\u03bd\u03b5\u03b9 \u03c4\u03b7\u03bd \u03b1\u03be\u03af\u03b1 \u03c4\u03c9\u03bd \u03c7\u03b1\u03bc\u03ad\u03bd\u03c9\u03bd \u03bc\u03bf\u03bd\u03ac\u03b4\u03c9\u03bd", 
  CHKOCEANNUMBER:"\u03a0\u03c1\u03bf\u03b2\u03bf\u03bb\u03ae \u03c4\u03c9\u03bd \u03bd\u03bf\u03cd\u03bc\u03b5\u03c1\u03c9\u03bd \u03c4\u03c9\u03bd \u03b8\u03b1\u03bb\u03b1\u03c3\u03c3\u03ce\u03bd", MSGRTLBL:"\u03a0\u03bb\u03b7\u03c1\u03bf\u03c6\u03bf\u03c1\u03af\u03b5\u03c2 \u03b5\u03c0\u03b1\u03bd\u03ac\u03c3\u03c4\u03b1\u03c3\u03b7\u03c2", MSGRTSHOW:"\u03a0\u03c1\u03bf\u03c3\u03b8\u03ae\u03ba\u03b7 \u03c0\u03bb\u03b7\u03c1\u03bf\u03c6\u03bf\u03c1\u03b9\u03ce\u03bd \u03b5\u03c0\u03b1\u03bd\u03ac\u03c3\u03c4\u03b1\u03c3\u03b7\u03c2 \u03b5\u03bd \u03b5\u03be\u03b5\u03bb\u03af\u03be\u03b5\u03b9", 
  MSGRTONLINE:"\u03a3\u03ba\u03bf\u03c0\u03b5\u03cd\u03b5\u03c4\u03b5 \u03bd\u03b1 \u03b5\u03af\u03c3\u03c4\u03b5 \u03c3\u03b5 \u03b1\u03c0\u03b5\u03c5\u03b8\u03b5\u03af\u03b1\u03c2 \u03c3\u03cd\u03bd\u03b4\u03b5\u03c3\u03b7 \u03ba\u03b1\u03c4\u03ac \u03c4\u03b7 \u03b4\u03b9\u03ac\u03c1\u03ba\u03b5\u03b9\u03b1 \u03c4\u03b7\u03c2 \u03ba\u03cc\u03ba\u03ba\u03b9\u03bd\u03b7\u03c2 \u03b5\u03c0\u03b1\u03bd\u03ac\u03c3\u03c4\u03b1\u03c3\u03b7\u03c2;", MSGRTYES:"\u039d\u03b1\u03b9", MSGRTNO:"\u038c\u03c7\u03b9", 
  MSGRTGOD:"\u0398\u03b5\u03cc\u03c2", MSGRTCSTIME:"\u03a7\u03c1\u03cc\u03bd\u03bf\u03c2 \u03b1\u03c0\u03bf\u03b9\u03ba\u03b9\u03b1\u03ba\u03bf\u03cd", MSGRTONL:"\u03b5\u03bd\u03c4\u03cc\u03c2 \u03c3\u03cd\u03bd\u03b4\u03b5\u03c3\u03b7\u03c2;", MSGRTERR:"\u0395\u03af\u03c3\u03c4\u03b5 \u03c3\u03b5 \u03bb\u03ac\u03b8\u03bf\u03c2 \u03c0\u03cc\u03bb\u03b7! <br/> \u0393\u03b9\u03b1 \u03bd\u03b1 \u03b4\u03b7\u03bc\u03b9\u03bf\u03c5\u03c1\u03b3\u03ae\u03c3\u03b5\u03c4\u03b5 \u03c4\u03b9\u03c2 \u03c0\u03bb\u03b7\u03c1\u03bf\u03c6\u03bf\u03c1\u03af\u03b5\u03c2 \u03b5\u03c0\u03b1\u03bd\u03ac\u03c3\u03c4\u03b1\u03c3\u03b7\u03c2, \u03c0\u03b1\u03c1\u03b1\u03ba\u03b1\u03bb\u03bf\u03cd\u03bc\u03b5 \u03c0\u03b7\u03b3\u03b1\u03af\u03bd\u03b5\u03c4\u03b5 \u03c3\u03c4\u03b7\u03bd \u03c0\u03cc\u03bb\u03b7:", 
  BBTEXT:"\u03ad\u03ba\u03b4\u03bf\u03c3\u03b7 \u03ba\u03b5\u03b9\u03bc\u03ad\u03bd\u03bf\u03c5", BBHTML:"\u03ad\u03ba\u03b4\u03bf\u03c3\u03b7 \u03c0\u03af\u03bd\u03b1\u03ba\u03b1", MSG413ERR:"<h3>\u0397 \u03b4\u03b7\u03bc\u03b9\u03bf\u03c5\u03c1\u03b3\u03b7\u03bc\u03ad\u03bd\u03b7 \u03ad\u03ba\u03b8\u03b5\u03c3\u03b7 \u03b5\u03af\u03bd\u03b1\u03b9 \u03c0\u03bf\u03bb\u03cd \u03bc\u03b5\u03b3\u03ac\u03bb\u03b7.</h3><p>\u03a7\u03c1\u03b7\u03c3\u03b9\u03bc\u03bf\u03c0\u03bf\u03b9\u03ae\u03c3\u03c4\u03b5 \u03c4\u03b9\u03c2 \u03b4\u03b9\u03b1\u03b8\u03ad\u03c3\u03b9\u03bc\u03b5\u03c2 \u03b5\u03c0\u03b9\u03bb\u03bf\u03b3\u03ad\u03c2 \u03ba\u03b1\u03b9 \u03bc\u03b5\u03b9\u03ce\u03c3\u03c4\u03b5 \u03b3\u03b9\u03b1 \u03bd\u03b1 \u03b4\u03b7\u03bc\u03bf\u03c3\u03b9\u03b5\u03cd\u03c3\u03b5\u03c4\u03b5 \u03c7\u03c9\u03c1\u03af\u03c2 \u03c0\u03c1\u03bf\u03b2\u03bb\u03ae\u03bc\u03b1\u03c4\u03b1.</p>", 
  CHKREPORTFORMAT:"\u0394\u03b7\u03bc\u03b9\u03bf\u03c5\u03c1\u03b3\u03af\u03b1 \u03b1\u03bd\u03b1\u03c6\u03bf\u03c1\u03ce\u03bd \u03bc\u03b5 \u03c0\u03af\u03bd\u03b1\u03ba\u03b5\u03c2", WALLNOTSAVED:"\u03a4\u03bf \u03c4\u03b5\u03af\u03c7\u03bf\u03c2 \u03b4\u03b5\u03bd \u03ad\u03c7\u03b5\u03b9 \u03b1\u03c0\u03bf\u03b8\u03b7\u03ba\u03b5\u03c5\u03c4\u03b5\u03af", WALLSAVED:"\u03a4\u03bf \u03c4\u03b5\u03af\u03c7\u03bf\u03c2 \u03ad\u03c7\u03b5\u03b9 \u03b1\u03c0\u03bf\u03b8\u03b7\u03ba\u03b5\u03c5\u03c4\u03b5\u03af", 
  POPSELRECRUNIT:"\u03ba\u03bb\u03b9\u03ba, \u03b3\u03b9\u03b1 \u03bd\u03b1 \u03b4\u03b9\u03b1\u03bb\u03ad\u03be\u03b5\u03c4\u03b5 \u03b1\u03c5\u03c4\u03cc\u03bc\u03b1\u03c4\u03b7 \u03bc\u03bf\u03bd\u03ac\u03b4\u03b1 \u03c0\u03b1\u03c1\u03b1\u03b3\u03c9\u03b3\u03ae\u03c2", POPRECRUNITTRADE:"\u03ba\u03bb\u03b9\u03ba, \u03b3\u03b9\u03b1 \u03bd\u03b1 \u03c3\u03c5\u03bc\u03c0\u03bb\u03b7\u03c1\u03ce\u03c3\u03b5\u03c4\u03b5 \u03c4\u03bf\u03c5\u03c2 \u03b1\u03c0\u03b1\u03b9\u03c4\u03bf\u03cd\u03bc\u03b5\u03bd\u03bf\u03c5\u03c2 \u03c0\u03cc\u03c1\u03bf\u03c5\u03c2 \u03b3\u03b9\u03b1 \u03c4\u03b7 \u03c3\u03c4\u03c1\u03b1\u03c4\u03bf\u03bb\u03cc\u03b3\u03b7\u03c3\u03b7 \u03c4\u03b7\u03c2 \u03b5\u03c0\u03b9\u03bb\u03b5\u03b3\u03bc\u03ad\u03bd\u03b7\u03c2 \u03bc\u03bf\u03bd\u03ac\u03b4\u03b1\u03c2", 
  POPINSERTLASTREPORT:"\u0395\u03c0\u03b9\u03ba\u03cc\u03bb\u03bb\u03b7\u03c3\u03b5 \u03c4\u03b7\u03bd \u03c4\u03b5\u03bb\u03b5\u03c5\u03c4\u03b1\u03af\u03b1 \u03bc\u03b5\u03c4\u03b1\u03c4\u03c1\u03bf\u03c0\u03bf\u03b9\u03b7\u03bc\u03ad\u03bd\u03b7 \u03b1\u03bd\u03b1\u03c6\u03bf\u03c1\u03ac", MSGCOPYREPORT:"\u0397 \u03b1\u03bd\u03b1\u03c6\u03bf\u03c1\u03ac \u03ad\u03c7\u03b5\u03b9 \u03b1\u03c0\u03bf\u03b8\u03b7\u03ba\u03b5\u03c5\u03c4\u03b5\u03af. \u03a0\u03b1\u03c1\u03b1\u03ba\u03b1\u03bb\u03ce \u03ba\u03bb\u03b9\u03ba [paste_icon] \u03c3\u03b5 \u03c6\u03cc\u03c1\u03bf\u03c5\u03bc \u03ae \u03c3\u03c4\u03bf \u03c0\u03b1\u03c1\u03ac\u03b8\u03c5\u03c1\u03bf \u03bd\u03ad\u03bf\u03c5 \u03bc\u03b7\u03bd\u03cd\u03bc\u03b1\u03c4\u03bf\u03c2 \u03b3\u03b9\u03b1 \u03b5\u03c0\u03b9\u03ba\u03cc\u03bb\u03bb\u03b7\u03c3\u03b7.", 
  POPDISABLEALARM:"\u0391\u03c0\u03b5\u03bd\u03b5\u03c1\u03b3\u03bf\u03c0\u03bf\u03af\u03b7\u03c3\u03b7 \u03c3\u03c5\u03bd\u03b1\u03b3\u03b5\u03c1\u03bc\u03bf\u03cd", SOUNDSETTINGS:"\u03a1\u03c5\u03b8\u03bc\u03af\u03c3\u03b5\u03b9\u03c2 \u03ae\u03c7\u03bf\u03c5", CHKSOUNDMUTE:"\u03a3\u03af\u03b3\u03b1\u03c3\u03b7", SOUNDVOLUME:"\u0388\u03bd\u03c4\u03b1\u03c3\u03b7", SOUNDURL:"url \u03b1\u03c1\u03c7\u03b5\u03af\u03bf\u03c5 \u03ae\u03c7\u03bf\u03c5", CHKSOUNDLOOP:"\u0395\u03c0\u03b1\u03bd\u03ac\u03bb\u03b7\u03c8\u03b7", 
  POPSOUNDLOOP:"\u03a0\u03b1\u03af\u03be\u03b5 \u03c3\u03c4\u03b7\u03bd \u03b5\u03c0\u03b1\u03bd\u03ac\u03bb\u03b7\u03c8\u03b7", POPSOUNDMUTE:"\u03a3\u03af\u03b3\u03b1\u03c3\u03b5 \u03c4\u03bf\u03bd \u03ae\u03c7\u03bf", POPSOUNDPLAY:"\u03a0\u03b1\u03af\u03be\u03b5 \u03bc\u03b5 \u03c4\u03b9\u03c2 \u03c4\u03c1\u03ad\u03c7\u03bf\u03c5\u03c3\u03b5\u03c2 \u03c1\u03c5\u03b8\u03bc\u03af\u03c3\u03b5\u03b9\u03c2", POPSOUNDSTOP:"\u03a3\u03c4\u03b1\u03bc\u03ac\u03c4\u03b1 \u03bd\u03b1 \u03c0\u03b1\u03af\u03b6\u03b5\u03b9\u03c2", 
  POPSOUNDURL:"\u0394\u03b9\u03b5\u03cd\u03b8\u03c5\u03bd\u03c3\u03b7 \u03b4\u03b9\u03b1\u03b4\u03c1\u03bf\u03bc\u03ae\u03c2 url \u03c0\u03c1\u03bf\u03c2 \u03c4\u03bf \u03b1\u03c1\u03c7\u03b5\u03af\u03bf \u03ae\u03c7\u03bf\u03c5", STATS:{PLAYER:"\u03a3\u03c4\u03b1\u03c4\u03b9\u03c3\u03c4\u03b9\u03ba\u03ac \u03c0\u03b1\u03af\u03c7\u03c4\u03b7", ALLY:"\u03a3\u03c4\u03b1\u03c4\u03b9\u03c3\u03c4\u03b9\u03ba\u03ac \u03c3\u03c5\u03bc\u03bc\u03b1\u03c7\u03af\u03b1\u03c2", TOWN:"\u03a3\u03c4\u03b1\u03c4\u03b9\u03c3\u03c4\u03b9\u03ba\u03ac \u03c0\u03cc\u03bb\u03b7\u03c2", 
  INACTIVE:"\u0391\u03bd\u03b5\u03bd\u03b5\u03c1\u03b3\u03cc\u03c2", CHKINACTIVE:"\u03a0\u03c1\u03bf\u03b2\u03bf\u03bb\u03ae \u03b1\u03bd\u03b5\u03bd\u03b5\u03c1\u03b3\u03ce\u03bd \u03c0\u03b1\u03b9\u03c7\u03c4\u03ce\u03bd", INACTIVEDESC:"\u03a3\u03b5 \u03b1\u03c5\u03c4\u03cc \u03c4\u03bf \u03c7\u03c1\u03cc\u03bd\u03bf \u03b4\u03b5\u03bd \u03c5\u03c0\u03ae\u03c1\u03c7\u03b1\u03bd \u03c0\u03cc\u03bd\u03c4\u03bf\u03b9 \u03bc\u03ac\u03c7\u03b7\u03c2 \u03ba\u03b1\u03b9 \u03b5\u03c0\u03b5\u03ba\u03c4\u03ac\u03c3\u03b5\u03b9\u03c2", 
  }, ABH:{WND:{WINDOWTITLE:"\u03a7\u03c4\u03af\u03c3\u03c4\u03b7\u03c2 \u03c3\u03c4\u03c1\u03b1\u03c4\u03bf\u03cd", UNITFRAME:"\u03b4\u03b9\u03ac\u03bb\u03b5\u03be\u03b5 \u03c4\u03b7 \u03bc\u03bf\u03bd\u03ac\u03b4\u03b1 \u03c3\u03bf\u03c5", DESCRIPTION1:"\u03a3\u03b5 \u03b1\u03c5\u03c4\u03ae\u03bd \u03c4\u03b7\u03bd \u03c0\u03cc\u03bb\u03b7, \u03ad\u03c7\u03b5\u03b9\u03c2 [population] \u03b5\u03bb\u03b5\u03cd\u03b8\u03b5\u03c1\u03bf \u03c0\u03bb\u03b7\u03b8\u03c5\u03c3\u03bc\u03cc", DESCRIPTION2:"\u039f \u03bf\u03c0\u03bf\u03af\u03bf\u03c2 \u03b5\u03af\u03bd\u03b1\u03b9 \u03b1\u03c1\u03ba\u03b5\u03c4\u03cc\u03c2 \u03b3\u03b9\u03b1 \u03bd\u03b1 \u03c6\u03c4\u03ac\u03be\u03b5\u03b9\u03c2 [max_units]", 
  DESCRIPTION3:"[yesno] \u03c4\u03b7\u03bd \u03ad\u03c1\u03b5\u03c5\u03bd\u03b1 [research] \u03b5\u03c1\u03b5\u03c5\u03bd\u03b7\u03bc\u03ad\u03bd\u03b7.", DESCRIPTION4:"\u039c\u03c0\u03bf\u03c1\u03b5\u03af\u03c2 \u03bd\u03b1 \u03b2\u03ac\u03bb\u03b5\u03b9\u03c2 \u03c3\u03b5 \u03bf\u03c5\u03c1\u03ac \u03c4\u03bf \u03bc\u03ad\u03b3\u03b9\u03c3\u03c4\u03bf \u03c4\u03c9\u03bd [max_queue] \u03bc\u03bf\u03bd\u03ac\u03b4\u03c9\u03bd", TARGET:"\u03b5\u03c0\u03b9\u03bb\u03ad\u03be\u03c4\u03b5 \u03c4\u03bf\u03bd \u03ba\u03b1\u03c4\u03b1\u03c3\u03ba\u03b5\u03c5\u03b1\u03c3\u03c4\u03b9\u03ba\u03cc \u03c3\u03b1\u03c2 \u03c3\u03c4\u03cc\u03c7\u03bf", 
  PACKAGE:"\u03c0\u03b1\u03ba\u03ad\u03c4\u03bf \u03c4\u03c9\u03bd \u03c0\u03cc\u03c1\u03c9\u03bd \u03b1\u03bd\u03ac \u03b1\u03c0\u03bf\u03c3\u03c4\u03bf\u03bb\u03ae (\u03bc\u03bf\u03bd\u03ac\u03b4\u03b5\u03c2)", BTNSAVE:"\u03b1\u03c0\u03bf\u03b8\u03ae\u03ba\u03b5\u03c5\u03c3\u03b7 \u03c1\u03c5\u03b8\u03bc\u03af\u03c3\u03b5\u03c9\u03bd", TOOLTIPOK:"\u03ba\u03bb\u03b9\u03ba, \u03b3\u03b9\u03b1 \u03bd\u03b1 \u03b5\u03c0\u03b9\u03bb\u03ad\u03be\u03b5\u03c4\u03b5 \u03c4\u03b7\u03bd \u03c0\u03c1\u03bf\u03b5\u03c0\u03b9\u03bb\u03b5\u03b3\u03bc\u03ad\u03bd\u03b7 \u03bc\u03bf\u03bd\u03ac\u03b4\u03b1 \u03b3\u03b9\u03b1 \u03c4\u03b7\u03bd \u03bf\u03c0\u03bf\u03af\u03b1 \u03b8\u03b1 \u03c3\u03c4\u03b5\u03af\u03bb\u03b5\u03c4\u03b5 \u03c0\u03cc\u03c1\u03bf\u03c5\u03c2", 
  TOOLTIPNOTOK:"\u03b7 \u03bc\u03bf\u03bd\u03ac\u03b4\u03b1 \u03b4\u03b5\u03bd \u03ad\u03c7\u03b5\u03b9 \u03b5\u03c1\u03b5\u03c5\u03bd\u03b7\u03b8\u03b5\u03af", HASRESEARCH:"\u0388\u03c7\u03b5\u03b9\u03c2", NORESEARCH:"\u0394\u0395\u039d \u03ad\u03c7\u03b5\u03b9\u03c2", SETTINGSAVED:"\u039f\u03b9 \u03c1\u03c5\u03b8\u03bc\u03af\u03c3\u03b5\u03b9\u03c2 \u03b3\u03b9\u03b1 \u03c4\u03b7\u03bd [\u03c0\u03cc\u03bb\u03b7] \u03ad\u03c7\u03bf\u03c5\u03bd \u03b1\u03c0\u03bf\u03b8\u03b7\u03ba\u03b5\u03c5\u03c4\u03b5\u03af", 
  }, RESWND:{RESLEFT:"\u03c0\u03cc\u03c1\u03bf\u03b9 \u03c0\u03bf\u03c5 \u03b1\u03c0\u03bf\u03bc\u03ad\u03bd\u03bf\u03c5\u03bd \u03bd\u03b1 \u03c3\u03c4\u03b5\u03af\u03bb\u03b5\u03c4\u03b1\u03b9", IMGTOOLTIP:"\u03ba\u03bb\u03b9\u03ba, \u03b3\u03b9\u03b1 \u03c3\u03c5\u03bc\u03c0\u03bb\u03ae\u03c1\u03c9\u03c3\u03b7 \u03c0\u03cc\u03c1\u03c9\u03bd", }, }, NEWVERSION:{AVAILABLE:"\u039d\u03ad\u03b1 \u03ad\u03ba\u03b4\u03bf\u03c3\u03b7 \u03b4\u03b9\u03b1\u03b8\u03ad\u03c3\u03b9\u03bc\u03b7", INSTALL:"\u0395\u03b3\u03ba\u03b1\u03c4\u03ac\u03c3\u03c4\u03b1\u03c3\u03b7", 
  REMINDER:"\u03a5\u03c0\u03b5\u03bd\u03b8\u03cd\u03bc\u03b9\u03c3\u03b7 \u03b1\u03c1\u03b3\u03cc\u03c4\u03b5\u03c1\u03b1", REQRELOAD:"\u0391\u03c0\u03b1\u03b9\u03c4\u03b5\u03af\u03c4\u03b1\u03b9 \u03b1\u03bd\u03b1\u03bd\u03ad\u03c9\u03c3\u03b7 \u03c4\u03b7\u03c2 \u03c3\u03b5\u03bb\u03af\u03b4\u03b1\u03c2", RELOAD:"\u0391\u03bd\u03b1\u03bd\u03ad\u03c9\u03c3\u03b7", }, LANGS:{LANG:"\u039c\u03b5\u03c4\u03ac\u03c6\u03c1\u03b1\u03c3\u03b7 \u03b3\u03b9\u03b1 \u03b3\u03bb\u03ce\u03c3\u03c3\u03b1:", SEND:"\u03a3\u03c4\u03b5\u03af\u03bb\u03b5 \u03b3\u03b9\u03b1 \u03b4\u03b7\u03bc\u03bf\u03c3\u03af\u03b5\u03c5\u03c3\u03b7", 
  SAVE:"\u0391\u03c0\u03bf\u03b8\u03ae\u03ba\u03b5\u03c5\u03c3\u03b7 & \u03b4\u03bf\u03ba\u03b9\u03bc\u03ae", RESET:"\u0395\u03c0\u03b1\u03bd\u03ac\u03c6\u03bf\u03c1\u03ac \u03c3\u03c4\u03b7\u03bd \u03c0\u03c1\u03bf\u03b5\u03c0\u03b9\u03bb\u03b5\u03b3\u03bc\u03ad\u03bd\u03b7 \u03b3\u03bb\u03ce\u03c3\u03c3\u03b1", REMOVE:"\u0394\u03b9\u03b1\u03b3\u03c1\u03b1\u03c6\u03ae \u03c4\u03b7\u03c2 \u03bc\u03b5\u03c4\u03ac\u03c6\u03c1\u03b1\u03c3\u03ae\u03c2 \u03c3\u03bf\u03c5?", }, HELPTAB5:"\u039c\u03b5\u03c4\u03ac\u03c6\u03c1\u03b1\u03c3\u03b7", 
  COMMAND:{FORTOWN:"\u03c0\u03cc\u03bb\u03b7:", RETURNING:"\u03b5\u03c0\u03b9\u03c3\u03c4\u03c1\u03ad\u03c6\u03bf\u03c5\u03bd", OUTGOING:"\u03b5\u03be\u03b5\u03c1\u03c7\u03cc\u03bc\u03b5\u03bd\u03b1", INCOMING:"\u03b5\u03b9\u03c3\u03b5\u03c1\u03c7\u03cc\u03bc\u03b5\u03bd\u03b1", ALL:"\u038c\u03bb\u03b1", }, EMOTS:{MESS:"\u0395\u03c0\u03b9\u03ba\u03bf\u03bb\u03ae\u03c3\u03c4\u03b5 \u03c3\u03c5\u03bd\u03b4\u03ad\u03c3\u03bc\u03bf\u03c5\u03c2 \u03c4\u03c9\u03bd emoticon, \u03ba\u03ac\u03b8\u03b5 \u03ad\u03bd\u03b1\u03bd \u03c3\u03b5 \u03bc\u03b9\u03b1 \u03bd\u03ad\u03b1 \u03b3\u03c1\u03b1\u03bc\u03bc\u03ae", 
  LABEL:"\u0398\u03ad\u03bb\u03b5\u03c4\u03b5 \u03c0\u03b5\u03c1\u03b9\u03c3\u03c3\u03cc\u03c4\u03b5\u03c1\u03b1 emoticons?", }, BTNSIMUL:"\u03a0\u03c1\u03bf\u03c3\u03bf\u03bc\u03bf\u03b9\u03c9\u03c4\u03ae\u03c2", LASTUPDATE:"1487464394681", MSGSHOWCOST:"\u039a\u03cc\u03c3\u03c4\u03bf\u03c2 \u03c7\u03b1\u03bc\u03ad\u03bd\u03c9\u03bd \u03bc\u03bf\u03bd\u03ac\u03b4\u03c9\u03bd", BBIMG:"\u039c\u03af\u03b1 \u03b5\u03b9\u03ba\u03cc\u03bd\u03b1", POPSOUNDEG:"\u03c0\u03b1\u03c1\u03ac\u03b4\u03b5\u03b9\u03b3\u03bc\u03b1: https://www.youtube.com/watch?v=v2AC41dglnM, https://youtu.be/v2AC41dglnM, http://www.freesfx.co.uk/rx2/mp3s/10/11532_1406234695.mp3", 
  RADAR:{TOWNFINDER:"\u03a8\u03ac\u03be\u03b5 \u03c0\u03cc\u03bb\u03b5\u03b9\u03c2", FIND:"\u03a8\u03ac\u03be\u03b5", MAXCSTIME:"\u039c\u03b5\u03b3\u03af\u03c3\u03c4\u03b7 \u03ce\u03c1\u03b1 \u03b1\u03c0\u03bf\u03b9\u03ba\u03b9\u03b1\u03ba\u03bf\u03cd \u03c0\u03bb\u03bf\u03af\u03bf\u03c5", BTNFIND:"\u03a8\u03ac\u03be\u03b5", TOWNNAME:"\u03a0\u03cc\u03bb\u03b7", TOWNOWNER:"\u0399\u03b4\u03b9\u03bf\u03ba\u03c4\u03ae\u03c4\u03b7\u03c2", TOWNRESERVED:"\u039a\u03c1\u03ac\u03c4\u03b7\u03c3\u03b7", TOWNPOINTS:"\u0395\u03bb\u03ac\u03c7\u03b9\u03c3\u03c4\u03bf\u03b9 \u03c0\u03cc\u03bd\u03c4\u03bf\u03b9 \u03c0\u03cc\u03bb\u03b7\u03c2", 
  ALL:"\u039f\u03c0\u03bf\u03b9\u03b1\u03b4\u03ae\u03c0\u03bf\u03c4\u03b5 \u03c0\u03cc\u03bb\u03b7", }, QUESTION:"\u0395\u03c1\u03ce\u03c4\u03b7\u03c3\u03b7", CHKOLDTRADE:"\u03a7\u03c1\u03b7\u03c3\u03b9\u03bc\u03bf\u03c0\u03bf\u03af\u03b7\u03c3\u03b5 \u03c4\u03b7\u03bd \u03c0\u03b1\u03bb\u03b9\u03ac \u03b5\u03bc\u03c6\u03ac\u03bd\u03b9\u03c3\u03b7 \u03c4\u03bf\u03c5 \u03b5\u03bc\u03c0\u03cc\u03c1\u03bf\u03c5", };
  this.en = {AUTHOR:"Potusek, Anpu, BentleyJ, Lascaux", BTNCONV:"Convert", BTNGENER:"Generate", BTNVIEW:"Preview", BTNSAVE:"Save", BTNVIEWBB:"BBCode", MSGTITLE:"Convert report", MSGQUEST:"Which of the data do you want to publish?", MSGBBCODE:"Following the publication of the report, you can pair it with news and forums using the BBCode.", MSGRESOURCE:"Loot", MSGUNITS:"Units", MSGBUILD:"Buildings", MSGUSC:"Silver coins used", MSGRAW:"Raw materials", MSGSHOWCOST:"Costs of lost units", SUPPORT:"Support", 
  SPY:"Spying", CONQUER:"Conquered", LOSSES:"Losses", HIDDEN:"Hidden", NOTUNIT:"[i]None[/i]", TOWN:"[i]Town:[/i] ", PLAYER:"[i]Player:[/i] ", ALLY:"[i]Ally:[/i] ", CAST:"cast:", ONTOWER:"On the town:", MSGHIDAD:"Hide cities", MSGFORUM:"The report will be published", BBALLY:"alliance forums / in the message", BBFORUM:"external forum", ICOCLOSE:"Close", ICOHELP:"About converter", MSGPREVIEW:"<b>Report preview</b>", HELPTAB1:"About", HELPTAB2:"How does it work", HELPTAB3:"Changes", HELPTAB4:"Settings", 
  HELPTAB6:"Donations", MSGHUMAN:{OK:"The information has been saved", ERROR:"An error occurred while writing", YOUTUBEERROR:"Incorrect link or not allowed to play outside youtube", }, LABELS:{attack:{ATTACKER:"Attacker", DEFENDER:"Defender", MSGHIDAT:"attacker", MSGHIDDE:"defender", MSGATTUNIT:"Army attacking", MSGDEFUNIT:"Army defenders", }, support:{ATTACKER:"Supporting", DEFENDER:"Supported", MSGHIDAT:"supporting", MSGHIDDE:"supported", MSGATTUNIT:"Army supporting", MSGDEFUNIT:"Army defenders", 
  }, espionage:{ATTACKER:"Spy", DEFENDER:"Spied", MSGHIDAT:"spy", MSGHIDDE:"spied", MSGATTUNIT:"", MSGDEFUNIT:"", }, }, MSGDETAIL:"command details", MSGRETURN:"(return)", MSGGENBBCODE:"Generate a list of BBCode", MSGDEFSITE:"Defeated...", MSGLOSSITE:"Losses...", MSGASATT:"...as an attacker", MSGASDEF:"...as a defender", MSGDIFF1:"do not show differences", MSGDIFF2:"show differences", MSGDIFF3:"show only the differences", BBCODELIMIT:"In view of the limited amount of text in one post, in the case of a long list, the data were divided into groups. Each group paste as a separate entry.", 
  CHKPOWERNAME:"Display time remaining to the possibility of using the spell", CHKFORUMTABS:"Replace scrolling tabs on the forum for multi line", STATSLINK:"View statistics from", BTNSUPPLAYERS:"List of players", CHKUNITSCOST:"The report showing the cost of lost units", CHKOCEANNUMBER:"Display ocean numbers", MSGRTLBL:"Revolt information", MSGRTSHOW:"Add ongoing revolt information", MSGRTONLINE:"Are you going to be online during red revolt?", MSGRTYES:"Yes", MSGRTNO:"No", MSGRTGOD:"God", MSGRTCSTIME:"CS time", 
  MSGRTONL:"online?", MSGRTERR:"You are in a wrong city!<br/>To create revolt information, please go to city: ", BBTEXT:"text version", BBHTML:"table version", BBIMG:"single image", MSG413ERR:"<h3>The generated report is too large.</h3><p>Use the available options and reduce to publish without problems.</p>", CHKREPORTFORMAT:"Generate reports using tables", WALLNOTSAVED:"Wall is not saved", WALLSAVED:"Wall is saved", POPSELRECRUNIT:"click, to select default production unit", POPRECRUNITTRADE:"click, to fill in resources needed to recruit selected unit", 
  POPINSERTLASTREPORT:"Paste the last converted report", MSGCOPYREPORT:"The report has been saved. Please click [paste_icon] on forums or new message window to paste it", POPDISABLEALARM:"Disable alarm", SOUNDSETTINGS:"Sound settings", CHKSOUNDMUTE:"Mute", SOUNDVOLUME:"Volume", SOUNDURL:"Sound file url", CHKSOUNDLOOP:"loop", POPSOUNDLOOP:"Play in the loop", POPSOUNDMUTE:"Mute the sound", POPSOUNDPLAY:"Play with current settings", POPSOUNDSTOP:"Stop playng", POPSOUNDURL:"Url path to the file with sound", 
  POPSOUNDEG:"example: https://www.youtube.com/watch?v=v2AC41dglnM, https://youtu.be/v2AC41dglnM, http://www.freesfx.co.uk/rx2/mp3s/10/11532_1406234695.mp3", STATS:{PLAYER:"Player stats", ALLY:"Alliance stats", TOWN:"Town stats", INACTIVE:"Inactive", CHKINACTIVE:"Show inactive players", INACTIVEDESC:"At that time there was no point fighting and expansion", }, ABH:{WND:{WINDOWTITLE:"Army Builder Helper", UNITFRAME:"choose your unit", DESCRIPTION1:"In this city, you have [population] free population", 
  DESCRIPTION2:"Which is enough to build [max_units]", DESCRIPTION3:"You [yesno] have a [research] researched.", DESCRIPTION4:"You can queue up maximum of [max_queue] units", TARGET:"choose your build target", PACKAGE:"resource package per shipment (units)", BTNSAVE:"save settings", TOOLTIPOK:"click, to select default unit for which you'll be sending resources", TOOLTIPNOTOK:"unit has not been researched", HASRESEARCH:"DO", NORESEARCH:"DO NOT", SETTINGSAVED:"Settings for [city] have been saved", 
  }, RESWND:{RESLEFT:"resources left to send", IMGTOOLTIP:"click, to fill in resources", }, }, NEWVERSION:{AVAILABLE:"New version available", INSTALL:"Install", REMINDER:"Remind me later", REQRELOAD:"Refresh required", RELOAD:"Refresh", }, LANGS:{LANG:"Translation for language:", SEND:"Send to publication", SAVE:"Save & test", RESET:"Restore the default language", REMOVE:"Delete your translation?", }, HELPTAB5:"Translation", BTNSIMUL:"Simulator", EMOTS:{LABEL:"Do you want more emoticon?", MESS:"Paste links to emoticon, each on a new line"}, 
  COMMAND:{ALL:"All", INCOMING:"incoming", OUTGOING:"outgoing", RETURNING:"returning", FORTOWN:"town:"}, RADAR:{TOWNFINDER:"Search cities", FIND:"Search", MAXCSTIME:"Maximum time", MAXUNITTIME:"Maximum time", BTNFIND:"Search", TOWNNAME:"Town", CSTIME:"CS time", UNITTIME:"time", TOWNOWNER:"Owner", TOWNRESERVED:"Reservation", TOWNPOINTS:"Minimal town points", BTNSAVEDEFAULT:"Save values as default", ALL:"Any town", SHOWCITIES:"Show cities"}, WALL:{LISTSAVED:"Saved on the wall the day", LISTSTATE:"Condition of the wall on the day", 
  DELETECURRENT:"Delete the current record", WANTDELETECURRENT:"Do you want to delete the current record of the wall?"}, QUESTION:"Question", TSL:{WND:{WINDOWTITLE:"Towns Sorted List", TOOLTIP:"show sorted town"}}, CHKOLDTRADE:"Use old trade layout", AO:{TITLE:"Academy Overview"}, MOBILEVERSION:"Mobile version", CHKWONDERTRADE:"When sending resources for world wonders, send maximum equal amounts", CHKTOWNPOPUP:"Display troop info tooltip when hovering over city name on drop-down city list", POPWONDERSHOT:"Amount of available construction accelerations", 
  CHKTACL:"Enable commands list movement", BTNCOMPARE:"Pact vs Enemy", ALLYCOMPARETITLE:"Comparison of allied forces vs enemy alliances", CHKMCOL:"Color messages according to the pre-set color scheme", CHKBUPO:"Display build points", CHKMOUSEWHEELZOOMBULLEYE:"Use mouse wheel to zoom map", POPINSERTEMOT:"Insert the emoticon", CHKIMGBTN:"Display the octopus on the GRCRTools buttons", POPSITUATIONALCITYREPORT:"Situation report", CHKSCTUNITS:"Units in the city", CHKSCTPREMIUM:"Premium options", CHKSCTSILVER:"Amount of silver in the cave", 
  CHKSCTINCSUPP:"Number of incoming supports", CHKSCTINCSATT:"Number of incoming attacks", OLYMPOWNER:"Owner", OLYMPTROOP:"Troops in the temple", OLYMPACCOM:"Active commands on this Temple", OLYMPDESC:"Temple description"};
  this.es = {INFO:{0:"Potusek", 1:"grepolis@potusek.eu", }, WEBSITE:"Website", AUTHOR:"katralba@gmail.com, JONUSEJ, Shirowashi, fitidel, kaito edogawa", BTNCONV:"Convertir", BTNGENER:"Generar", BTNSRC:"Fuente", BTNVIEW:"Visualizar", BTNSAVE:"Guardar", BTNMARKS:"Marcarlo como le\u00eddo", BTNMARKA:"Marcar todo como le\u00eddo", MSGTITLE:"Convertir reporte", MSGQUEST:"\u00bfQu\u00e9 datos desea publicar?", MSGALL:"Todo", MSGBBCODE:"Una vez publicado el reporte, se puede anexar al foro utilizando c\u00f3digo BB.", 
  MSGRESOURCE:"Saquear", MSGUNITS:"Unidades", MSGBUILD:"Edificios", MSGUSC:"Monedas utilizadas", MSGRAW:"Materias primas", SUPPORT:"Soporte", SPY:"Espionaje", CONQUER:"Conquistado", LOSSES:"P\u00e9rdidas", HIDDEN:"Escondido", NOTUNIT:"[i]Nada[/i]", TOWN:"[i]Ciudad:[/i] ", PLAYER:"[i]Jugador:[/i] ", ALLY:"[i]Alianza:[/i] ", CAST:"echar:", ONTOWER:"En la ciudad:", MSGHIDAD:"Esconder ciudades", MSGFORUM:"El reporte se publicar\u00e1", BBALLY:"foro de la alianza / en el mensaje", BBFORUM:"foro externo", 
  ERRGETSRC:"\u00a1Ha habido un error! Por favor, generar el fuente y enviarlo como anexo a  potusek@westtax.info", ICOCLOSE:"Cerrar", ICOHELP:"Acerca del convertidor", MSGPREVIEW:"<b>Previsualizaci\u00f3n de informe</b>", HELPTAB1:"Acerca de", HELPTAB2:"C\u00f3mo funciona", HELPTAB3:"Cambios", HELPTAB4:"Configuraci\u00f3n", HLPVERSION:"Modificaci\u00f3n", HLPFIXED:"Corregido", HLPADDED:"A\u00f1adido", MSGHUMAN:{OK:"La informaci\u00f3n se ha guardado", ERROR:"Error al escribir", YOUTUBEERROR:"Link incorrecto o no autorizada la reproducci\u00f3n fuera de Youtube", 
  }, STATS:"Estad\u00edsticas del jugador", STATSPOINT:"Puntos", STATSRANK:"Rango", LABELS:{attack:{ATTACKER:"Atacante", DEFENDER:"Defensor", MSGHIDAT:"atacante", MSGHIDDE:"defensor", MSGATTUNIT:"Ej\u00e9rcito atacante", MSGDEFUNIT:"Ej\u00e9rcito defensor", }, support:{ATTACKER:"Apoyador", DEFENDER:"Apoyado", MSGHIDAT:"apoyador", MSGHIDDE:"apoyado", MSGATTUNIT:"Ej\u00e9rcito de apoyo", MSGDEFUNIT:"Ej\u00e9rcito apoyado", }, espionage:{ATTACKER:"Esp\u00eda", DEFENDER:"Espiado", MSGHIDAT:"esp\u00eda", 
  MSGHIDDE:"espiado", MSGATTUNIT:"", MSGDEFUNIT:"", }, }, MSGDETAIL:"Detalles del comando", MSGRETURN:"(volver)", MSGCLAIM:"reservas de ciudades", MSGCLAIMPPUP:"Generar la reserva", MSGGENBBCODE:"Generar una lista de c\u00f3digo BBC", MSGDEFSITE:"Derrotado...", MSGLOSSITE:"P\u00e9rdidas...", MSGASATT:"...como atacante", MSGASDEF:"...como defensor", MSGDIFF1:"no mostrar las diferencias", MSGDIFF2:"mostrar las diferencias", MSGDIFF3:"mostrar s\u00f3lo las diferencias", BBCODELIMIT:"En vista de la cantidad limitada de texto en un mensaje, si hay una lista larga, se dividir\u00e1 en partes. Cada parte cuenta como una entidad separada.", 
  CHKPOWERNAME:"Mostrar el tiempo restante hasta el pr\u00f3ximo hechizo", CHKNIGHTNAME:"Oscurece la ciudad en el bono nocturno", CHKFORUMTABS:"Reemplazar los desplazamientos de las pesta\u00f1as del foro por multi-l\u00ednea", BTNRESERVE:"Anotando", LNKRESERVE:"Reservas", LBLGETRESER:"Obteniendo los datos ...", BTNCHECK:"Verificando las  reservas", CHKCMDIMG:"View the icons for the destination city commands", STATSLINK:"Estad\u00edsticas en pantalla", BTNSUPPLAYERS:"Lista de jugadores", CHKUNITSCOST:"El informe muestra el coste de las unidades perdidas", 
  CHKOCEANNUMBER:"Mostrar n\u00fameros de mares", MSGRTGOD:"Dios", MSGRTYES:"Si", MSGRTONLINE:"\u00bfEstar\u00e1s conectado durante el pu\u00f1o rojo?", MSGRTLBL:"Informaci\u00f3n de la revuelta", MSGRTERR:"\u00a1Est\u00e1s en una ciudad equivocada!<br/>Para crear informaci\u00f3n de la revuelta, por favor ve a la ciudad: ", BBTEXT:"versi\u00f3n texto", BBHTML:"versi\u00f3n tabla", MSG413ERR:"<h3>El informe generado es demasiado largo.</h3><p>Use las opciones disponibles y reduzcalo para publicar sin problemas.</p>", 
  CHKREPORTFORMAT:"Generar informes usando tablas", WALLNOTSAVED:"La muralla no est\u00e1 guardada", WALLSAVED:"Muralla guardada", POPSELRECRUNIT:"click, para seleccionar la unidad de producci\u00f3n por defecto", POPRECRUNITTRADE:"click, para rellenar los recursos necesarios para reclutar la unidad seleccionada", POPINSERTLASTREPORT:"Pegar el \u00faltimo informe convertido", MSGCOPYREPORT:"El informe ha sido guardado. Por favor click [paste_icon] on el foro o la ventana de nuevo mensaje para pegarlo", 
  POPDISABLEALARM:"Desconectar alarma", SOUNDSETTINGS:"Ajustes de sonido", CHKSOUNDMUTE:"Silenciar", SOUNDVOLUME:"Volumen", SOUNDURL:"URL fichero sonido", CHKSOUNDLOOP:"Repetir", POPSOUNDLOOP:"Reproducci\u00f3n continua", POPSOUNDMUTE:"Desactivar sonido", POPSOUNDPLAY:"Reproducir con los ajustes actuales", POPSOUNDSTOP:"Detener reproducci\u00f3n", POPSOUNDURL:"Ruta URL al fichero de sonido", ABH:{WND:{UNITFRAME:"elija su unidad", WINDOWTITLE:"Ayudante del constructor de ejercitos", DESCRIPTION1:"En esta ciudad, tienes [population] poblaci\u00f3n libre", 
  DESCRIPTION2:"Que es suficiente para hacer [max_units]", DESCRIPTION3:"T\u00fa [yesno] tienes [research] investigado.", DESCRIPTION4:"Puedes agregar un m\u00e1ximo de [max_queue] unidades", TARGET:"elige tu edificio objetivo", PACKAGE:"paquete de recursos por env\u00edo (unidades)", BTNSAVE:"guardar ajustes", TOOLTIPOK:"click, para seleccionar la unidad por defecto para la que enviar\u00e1s recursos", TOOLTIPNOTOK:"unidad no investigada", HASRESEARCH:"HAZ", NORESEARCH:"NO HAGAS", SETTINGSAVED:"Los ajustes para [city] guardados", 
  }, RESWND:{RESLEFT:"recursos pendientes de env\u00edo", IMGTOOLTIP:"click, para rellenar recursos", }, }, NEWVERSION:{AVAILABLE:"Disponible nueva versi\u00f3n", INSTALL:"Instalar", REMINDER:"Record\u00e1rmelo m\u00e1s tarde", REQRELOAD:"Se necesita cargar de nuevo el sitio", RELOAD:"Cargar de nuevo", }, LANGS:{LANG:"Traducci\u00f3n para idioma:", SEND:"Enviar a publicar", SAVE:"Guardar y probar", RESET:"Restablecer el idioma por defecto", REMOVE:"\u00bfBorrar tu traducci\u00f3n?", }, HELPTAB5:"Traducci\u00f3n", 
  MSGRTSHOW:"Informaci\u00f3n de la revuelta en curso", MSGRTCSTIME:"Horario CS", MSGRTONL:"\u00bfconectado?", BTNSIMUL:"Simulador", EMOTS:{LABEL:"\u00bfQuieres m\u00e1s emoticonos?", MESS:"Pega enlaces de un emoticono, cada uno en una nueva l\u00ednea", }, COMMAND:{ALL:"Todo", INCOMING:"entrante", OUTGOING:"saliente", RETURNING:"retornando", FORTOWN:"ciudad:", }, LASTUPDATE:"1487465086352", CHKWONDERTRADE:"Al enviar recursos para las maravillas del mundo, enviar cantidades m\u00e1ximas iguales", 
  MOBILEVERSION:"versi\u00f3n movil", AO:{TITLE:"Visi\u00f3n general de la Academia", }, CHKOLDTRADE:"Utilizar el dise\u00f1o del comercio antiguo", TSL:{WND:{TOOLTIP:"ver las ciudades clasificadas", WINDOWTITLE:"Lista de ciudades clasificadas", }, }, QUESTION:"Pregunta", WALL:{WANTDELETECURRENT:"\u00bfQuiere borrar el estado actual de la muralla?", DELETECURRENT:"Borrar el siguiente dato", LISTSTATE:"Condici\u00f3n de la muralla el dia", LISTSAVED:"Muralla salvada el dia", }, RADAR:{ALL:"Cualquier ciudad", 
  BTNSAVEDEFAULT:"Guardar valores como predeterminados", TOWNPOINTS:"Puntos m\u00ednimos de la ciudad", TOWNRESERVED:"Reserva", TOWNOWNER:"Propietario", CSTIME:"Tiempo CS", TOWNNAME:"Ciudad", BTNFIND:"Buscar", MAXCSTIME:"Tiempo m\u00e1ximo del colono", FIND:"Buscar", TOWNFINDER:"Buscar ciudades", }, POPSOUNDEG:"Ejemplo: https://www.youtube.com/watch?v=v2AC41dglnM, https://youtu.be/v2AC41dglnM, http://www.freesfx.co.uk/rx2/mp3s/10/11532_1406234695.mp3", MSGSHOWCOST:"Coste de unidades perdidas", BTNVIEWBB:"C\u00f3digo BB", 
  };
  this.fr = {INFO:{0:"Potusek", 1:"grepolis@potusek.eu", }, WEBSITE:"Site web", AUTHOR:"group.xione@gmail.com, aezeluk, MilleBaffes, Steros, Nico-DiAngelo, Sky-Lop, ThunderLiight, Orience, galoup95, rapha1978", BTNCONV:"Convertir", BTNGENER:"G\u00e9n\u00e9rer", BTNSRC:"Source", BTNVIEW:"Aper\u00e7u", BTNSAVE:"Sauvegarder", BTNMARKS:"Marqu\u00e9 comme lu", BTNMARKA:"Marqu\u00e9 tout comme lu", MSGTITLE:"Convertir le rapport", MSGQUEST:"Que souhaitez vous publier?", MSGALL:"tout", MSGBBCODE:"Apr\u00e8s la publication du rapport, vous pouvez le placer dans les forums en utilisant le BBCode.", 
  MSGRESOURCE:"piller", MSGUNITS:"Unit\u00e9s", MSGBUILD:"Batiments", MSGUSC:"Pi\u00e8ces d'argent utilis\u00e9es", MSGRAW:"Mati\u00e8res premi\u00e8re", SUPPORT:"soutien", SPY:"Espionnage", CONQUER:"Conquis", LOSSES:"pertes", HIDDEN:"cach\u00e9", NOTUNIT:"[i]Rien[/i]", TOWN:"[i]Ville:[/i] ", PLAYER:"[i]Joueur:[/i] ", ALLY:"[i]Alliance:[/i] ", CAST:"cast:", ONTOWER:"Dans la ville:", MSGHIDAD:"Villes masqu\u00e9es", MSGFORUM:"Le rapport sera publi\u00e9", BBALLY:"Forum d'alliance / dans le message", 
  BBFORUM:"Forum externe", ERRGETSRC:"Une erreur s'est produite S'il vous pla\u00eet, g\u00e9n\u00e9rer la source et envoyer une pi\u00e8ce jointe \u00e0 potusek@westtax.info", ICOCLOSE:"Fermer", ICOHELP:"\u00c0 propos du convertisseur", MSGPREVIEW:"<b>Aper\u00e7u rapport</b>", HELPTAB1:"A propos", HELPTAB2:"Comment \u00e7a marche", HELPTAB3:"Changements", HELPTAB4:"Param\u00e8tres", HLPVERSION:"Version", HLPFIXED:"Corriger", HLPADDED:"Ajouter", MSGHUMAN:{OK:"L'information a \u00e9t\u00e9 sauvegard\u00e9e", 
  ERREUR:"Une erreur s'est produite lors de l'\u00e9criture", ERROR:{}, YOUTUBEERROR:"Lien incorrecte ou non autoris\u00e9 \u00e0 jouer en dehors du Youtube", }, STATSPOINT:"Points", STATSRANK:"Rang", LABELS:{attack:{ATTACKER:"Attaquant", DEFENDER:"D\u00e9fenseur", MSGHIDAT:"attaquant", MSGHIDDE:"d\u00e9fenseur", MSGATTUNIT:"Arm\u00e9e attaquante", MSGDEFUNIT:"Arm\u00e9e d\u00e9fensive", }, support:{ATTACKER:"Soutenir", DEFENDER:"Soutenu", MSGHIDAT:"soutenir", MSGHIDDE:"soutenu", MSGATTUNIT:"Arm\u00e9e de support", 
  MSGDEFUNIT:"Arm\u00e9e d\u00e9fensive", }, espionage:{ATTACKER:"Espion", DEFENDER:"Espionn\u00e9", MSGHIDAT:"espion", MSGHIDDE:"espionn\u00e9", MSGATTUNIT:"", MSGDEFUNIT:"", }, }, MSGDETAIL:"les d\u00e9tails des commandes", MSGRETURN:"(retour)", MSGCLAIM:"r\u00e9serve la ville", MSGCLAIMPPUP:"G\u00e9n\u00e9rer r\u00e9servation", MSGGENBBCODE:"G\u00e9n\u00e9rer la liste de BBCode", MSGDEFSITE:"Vaincu...", MSGLOSSITE:"Pertes...", MSGASATT:"... en tant qu'attaquant", MSGASDEF:"... en tant que d\u00e9fenseur", 
  MSGDIFF1:"ne pas afficher les diff\u00e9rences", MSGDIFF2:"afficher les diff\u00e9rences", MSGDIFF3:"afficher seulement les diff\u00e9rences", BBCODELIMIT:"Compte tenu du montant limit\u00e9 de texte dans un poste, dans le cas d'une longue liste, les donn\u00e9es ont \u00e9t\u00e9 divis\u00e9 en groupes; Chaque groupe sera coll\u00e9 comme une entr\u00e9e s\u00e9par\u00e9e", CHKPOWERNAME:"Afficher le temps restant avant la possibilit\u00e9 d'utiliser le sort", CHKNIGHTNAME:"Assombrir la ville en bonus de nuit.", 
  CHKFORUMTABS:"Remplacer les barres de d\u00e9filement sur le forum pour le multi ligne", BTNRESERVE:"R\u00e9servation", LNKRESERVE:"R\u00e9servations", LBLGETRESER:"Obtenir des donn\u00e9es ...", BTNCHECK:"V\u00e9rification des r\u00e9serves", CHKCMDIMG:"Afficher les icones de destinations des d\u00e9placements", STATSLINK:"Source des statistiques :", BTNSUPPLAYERS:"Liste des joueurs", CHKUNITSCOST:"Le rapport montre le co\u00fbt des unit\u00e9s perdues", CHKOCEANNUMBER:"Afficher le num\u00e9ro des mers", 
  MSGRTLBL:"Information de r\u00e9volte", MSGRTSHOW:"Ajouter des informations sur la r\u00e9volte en cours", MSGRTONLINE:"Allez-vous \u00eatre en ligne lors de la r\u00e9volte rouge?", MSGRTYES:"Oui", MSGRTNO:"Non", MSGRTGOD:"Dieu", MSGRTCSTIME:"CS", MSGRTONL:"en ligne ?", MSGRTERR:"Vous \u00eates dans une mauvaise ville <br/> Pour cr\u00e9er des informations de r\u00e9volte, s'il vous pla\u00eet allez \u00e0 la ville en r\u00e9volte :", BBTEXT:"Version texte", BBHTML:"Version tableau", MSG413ERR:"<h3>Le rapport g\u00e9n\u00e9r\u00e9 est trop grand.</h3><p>Utilisez l'option disponible pour r\u00e9duire et publier le rapport sans probl\u00e8mes.</p>", 
  CHKREPORTFORMAT:"G\u00e9n\u00e9rer les rapports \u00e0 l'aide de tableaux", WALLNOTSAVED:"Les remparts ne sont pas enregistr\u00e9s", WALLSAVED:"Les remparts sont enregistr\u00e9s", POPSELRECRUNIT:"cliquez, pour s\u00e9lectionner l'unit\u00e9 de production par d\u00e9faut", POPRECRUNITTRADE:"cliquez, pour remplir les ressources n\u00e9cessaires pour l'unit\u00e9 s\u00e9lectionn\u00e9e", POPINSERTLASTREPORT:"Collez le dernier rapport converti", MSGCOPYREPORT:"Le rapport a \u00e9t\u00e9 enregistr\u00e9. Cliquez sur [paste_icon] pour le coller", 
  POPDISABLEALARM:"d\u00e9sactiver l'alarme", SOUNDSETTINGS:"R\u00e9glages son", CHKSOUNDMUTE:"Muet", SOUNDVOLUME:"Volume", SOUNDURL:"URL du fichier son", CHKSOUNDLOOP:"boucle", POPSOUNDLOOP:"lire en boucle", POPSOUNDMUTE:"Couper le son", POPSOUNDPLAY:"Lire avec les param\u00e8tres actuels", POPSOUNDSTOP:"Arreter la lecture", POPSOUNDURL:"Chemin (lien) vers le fichier audio", STATS:{PLAYER:"Statistiques joueur", ALLY:"Statistiques alliance", TOWN:"Statistiques ville", CHKINACTIVE:"Montrer les joueurs inactifs", 
  INACTIVE:"Inactif", INACTIVEDESC:{}, }, ABH:{WND:{WINDOWTITLE:"Aide construction d'arm\u00e9e", UNITFRAME:"Choisissez le type d'unit\u00e9", DESCRIPTION1:"Dans cette ville, vous avez [population] population libre", DESCRIPTION2:"Qui est suffisant pour construire [max_units]", DESCRIPTION3:"Vous [yesno] [research] recherch\u00e9.", DESCRIPTION4:"File d'attente maximale de [max_queue] unit\u00e9s", TARGET:"Choisissez le nombre d'unit\u00e9s \u00e0 produire", PACKAGE:"Nombre de ressources par envoi (en unit\u00e9s)", 
  BTNSAVE:"Enregistrer les param\u00e8tres", TOOLTIPOK:"Cliquez pour s\u00e9lectionner l'unit\u00e9 par d\u00e9faut pour lequel vous enverrez des ressources", TOOLTIPNOTOK:"Le type d'unit\u00e9 n'a pas \u00e9t\u00e9 recherch\u00e9", HASRESEARCH:"avez", NORESEARCH:"n'avez pas", SETTINGSAVED:"Les r\u00e9glages pour [city] ont \u00e9t\u00e9 enregistr\u00e9s", }, RESWND:{RESLEFT:"Ressources restantes \u00e0 envoy\u00e9es", IMGTOOLTIP:"Cliquez, pour ajouter les ressources", }, }, NEWVERSION:{AVAILABLE:"Nouvelle version disponible", 
  INSTALL:"Installer", REMINDER:"Me rappeler plus tard", REQRELOAD:"N\u00e9cessite le raffra\u00eechissement du site", RELOAD:"Raffra\u00eechir", }, LANGS:{LANG:"Traduction de la langue", SEND:"Envoyer pour publication", SAVE:"Sauver et tester", RESET:"Restaurer le langage par d\u00e9faut", REMOVE:"Supprimer votre traduction?", }, HELPTAB5:"Traduction", BTNSIMUL:"Simulateur", EMOTS:{LABEL:"Do you want more emoticon?", MESS:"collez le lien vers les \u00e9moticons, chaque fois sur une nouvelle ligne", 
  }, COMMAND:{ALL:"tout", INCOMING:"entrant", OUTGOING:"sortant", FORTOWN:"ville:", }, MOBILEVERSION:"Version mobile", AO:{TITLE:"Aper\u00e7u acad\u00e9mie", }, CHKOLDTRADE:"Use old trade layout", TSL:{WND:{TOOLTIP:"Voir les villes tri\u00e9es", WINDOWTITLE:"Liste tri\u00e9es des villes", }, }, WALL:{WANTDELETECURRENT:"Voulez vous effacer les donn\u00e9es actuelles des remparts?", DELETECURRENT:"Effacer les donn\u00e9es actuelles", LISTSAVED:"Sauvegarder sur le mur le jour", }, RADAR:{ALL:"Toutes les villes", 
  BTNSAVEDEFAULT:"Sauvegarder les valeurs par d\u00e9faut", TOWNPOINTS:"Points minimum", TOWNRESERVED:"R\u00e9servation", TOWNOWNER:"Propri\u00e9taire", TOWNNAME:"Ville", BTNFIND:"Recherche", MAXCSTIME:"Temps maximum en BC", FIND:"Recherche", TOWNFINDER:"Rechercher villes", }, BBIMG:"image seule", MSGSHOWCOST:"Co\u00fbt des unit\u00e9s perdues", LASTUPDATE:"1488490547946", POPSOUNDEG:"exemple: https://www.youtube.com/watch?v=v2AC41dglnM, https://youtu.be/v2AC41dglnM, http://www.freesfx.co.uk/rx2/mp3s/10/11532_1406234695.mp3", 
  };
  this.hu = {AUTHOR:"LegatuS, Phrometheus, Skyes, Vesztettem, alugev, Bud.Spencer, DOBss, Nagyh\u00fas", BTNCONV:"\u00c1talak\u00edt\u00e1s", BTNGENER:"Gener\u00e1l\u00e1s", BTNVIEW:"El\u0151ln\u00e9zet", BTNSAVE:"Ment\u00e9s", MSGTITLE:"Jelent\u00e9s \u00e1talak\u00edt\u00e1sa", MSGQUEST:"Melyik adatokat szeretn\u00e9 k\u00f6zz\u00e9tenni?", MSGBBCODE:"A jelent\u00e9s k\u00f6zz\u00e9t\u00e9tele ut\u00e1n BB-k\u00f3d seg\u00edts\u00e9g\u00e9vel beilleszthet\u0151 lesz a f\u00f3rumok \u00e9s \u00fczenetekben.", 
  MSGRESOURCE:"Zs\u00e1km\u00e1ny", MSGUNITS:"Egys\u00e9gek", MSGBUILD:"\u00c9p\u00fcletek", MSGUSC:"Felhaszn\u00e1lt ez\u00fcstp\u00e9nzek", MSGRAW:"Nyersanyagok", SUPPORT:"T\u00e1mogat\u00e1s", SPY:"K\u00e9mked\u00e9s", CONQUER:"Megh\u00f3d\u00edtott", LOSSES:"Vesztes\u00e9gek", HIDDEN:"Nem l\u00e1that\u00f3.", NOTUNIT:"[i]Nincs[/i]", TOWN:"[i]V\u00e1ros:[/i] ", PLAYER:"[i]J\u00e1t\u00e9kos:[/i] ", ALLY:"[i]Sz\u00f6vets\u00e9g:[/i] ", CAST:"elfoglal\u00e1s:", ONTOWER:"V\u00e1roson:", MSGHIDAD:"V\u00e1rosok elrejt\u00e9se", 
  MSGFORUM:"A jelent\u00e9s k\u00f6zz\u00e9t\u00e9telre\u00a0ker\u00fcl", BBALLY:"sz\u00f6vets\u00e9gi f\u00f3rumok / \u00fczenetben", BBFORUM:"k\u00fcls\u0151 f\u00f3rum", ICOCLOSE:"Bez\u00e1r", ICOHELP:"Az \u00e1talak\u00edt\u00f3r\u00f3l", MSGPREVIEW:"<b>Jelent\u00e9s el\u0151n\u00e9zete</b>", HELPTAB1:"A b\u0151v\u00edtm\u00e9nyr\u0151l", HELPTAB2:"Hogyan m\u0171k\u00f6dik", HELPTAB3:"V\u00e1ltoztat\u00e1si napl\u00f3", HELPTAB4:"Be\u00e1ll\u00edt\u00e1sok", MSGHUMAN:{OK:"Az adatok ment\u00e9se megt\u00f6rt\u00e9nt", 
  ERROR:"Hiba t\u00f6rt\u00e9nt", YOUTUBEERROR:"Hib\u00e1s link vagy nem lej\u00e1tszhat\u00f3 youtube-on k\u00edv\u00fcl", }, LABELS:{attack:{ATTACKER:"T\u00e1mad\u00f3", DEFENDER:"V\u00e9d\u0151", MSGHIDAT:"t\u00e1mad\u00f3", MSGHIDDE:"v\u00e9d\u0151", MSGATTUNIT:"T\u00e1mad\u00f3 egys\u00e9gek", MSGDEFUNIT:"V\u00e9d\u0151 egys\u00e9gek", }, support:{ATTACKER:"T\u00e1mogat\u00f3", DEFENDER:"T\u00e1mogatott", MSGHIDAT:"t\u00e1mogat\u00f3", MSGHIDDE:"t\u00e1mogatott", MSGATTUNIT:"T\u00e1mogat\u00f3 egys\u00e9gek", 
  MSGDEFUNIT:"V\u00e9d\u0151 egys\u00e9gek", }, espionage:{ATTACKER:"K\u00e9mked\u0151", DEFENDER:"K\u00e9mkedett", MSGHIDAT:"k\u00e9mded\u0151", MSGHIDDE:"k\u00e9mkedett", MSGATTUNIT:"", MSGDEFUNIT:"", }, }, MSGDETAIL:"parancsok r\u00e9szletei", MSGRETURN:"(visszat\u00e9r\u0151)", MSGGENBBCODE:"BB-k\u00f3d lista gener\u00e1l\u00e1sa", MSGDEFSITE:"Legy\u0151z\u00f6ttek...", MSGLOSSITE:"Vesztes\u00e9gek...", MSGASATT:"...t\u00e1mad\u00f3k\u00e9nt", MSGASDEF:"...v\u00e9d\u0151k\u00e9nt", MSGDIFF1:"k\u00fcl\u00f6nbs\u00e9gek elrejt\u00e9se ", 
  MSGDIFF2:"k\u00fcl\u00f6nbs\u00e9gek mutat\u00e1sa", MSGDIFF3:"csak a k\u00fcl\u00f6nbs\u00e9gek mutat\u00e1sa", BBCODELIMIT:"Mivel a hozz\u00e1sz\u00f3l\u00e1sokban csak limit\u00e1lt sz\u00e1m\u00fa karaktert lehet haszn\u00e1lni, \u00edgy a hosszabb list\u00e1k csoportkra lettek osztva. Minden csoportot k\u00fcl\u00f6n hozz\u00e1sz\u00f3l\u00e1sban c\u00e9lszer\u0171 beilleszteni.", CHKPOWERNAME:"Az isteni er\u0151 \u00fajb\u00f3li haszn\u00e1lat\u00e1hoz h\u00e1tral\u00e9v\u0151 id\u0151 mutat\u00e1sa", 
  CHKFORUMTABS:"A f\u00f3rumon t\u00f6bb sor megjeln\u00edt\u00e9se a v\u00edzszintes g\u00f6rget\u00e9s helyett", STATSLINK:"Statisztik\u00e1k forr\u00e1sa", BTNSUPPLAYERS:"J\u00e1t\u00e9kosok list\u00e1ja", CHKUNITSCOST:"Az elesett egys\u00e9gek \u00e1r\u00e1nak megjelen\u00edt\u00e9se", CHKOCEANNUMBER:"Tenger sz\u00e1m\u00e1nak megjelen\u00edt\u00e9se", MSGRTLBL:"L\u00e1zad\u00e1ssal kapcsolatos inform\u00e1ci\u00f3k", MSGRTSHOW:"L\u00e1zad\u00e1ssal kapcsolatos inform\u00e1ci\u00f3k megjelen\u00edt\u00e9se", 
  MSGRTONLINE:"Akt\u00edv lesz a l\u00e1zad\u00e1s folyam\u00e1n?", MSGRTYES:"Igen", MSGRTNO:"Nem", MSGRTGOD:"Isten", MSGRTCSTIME:"GYH id\u0151", MSGRTONL:"akt\u00edv?", MSGRTERR:"Rossz v\u00e1rosban vagy!<br/>L\u00e1zad\u00e1si inform\u00e1ci\u00f3khoz menj ebbe a v\u00e1rosba ", BBTEXT:"sz\u00f6veges verzi\u00f3", BBHTML:"t\u00e1bl\u00e1zatos verzi\u00f3", MSG413ERR:"<h3>Az \u00e1talak\u00edtott jelent\u00e9s t\u00fal nagy.</h3><p>Haszn\u00e1lja a rendelkez\u00e9sre \u00e1ll\u00f3 opci\u00f3kat, hogy cs\u00f6kkentse a m\u00e9retet.</p>", 
  CHKREPORTFORMAT:"Jelent\u00e9sek \u00e1talak\u00edt\u00e1sa t\u00e1bl\u00e1zatok haszn\u00e1lat\u00e1val", WALLNOTSAVED:"A fal nincs mentve", WALLSAVED:"A fal mentve", POPSELRECRUNIT:"kattints az alap\u00e9rtelmezett termel\u0151egys\u00e9g kiv\u00e1laszt\u00e1s\u00e1hoz", POPRECRUNITTRADE:"kattintson a sz\u00fcks\u00e9ges nyersanyag beilleszt\u00e9s\u00e9hez a kiv\u00e1lasztott egys\u00e9ghez", POPINSERTLASTREPORT:"Az utols\u00f3 \u00e1talak\u00edtott jelent\u00e9s beilleszt\u00e9se", MSGCOPYREPORT:"A jelent\u00e9s el lett mentve. K\u00e9rj\u00fck, a beilleszt\u00e9shez kattintson a [paste_icon] ikonra a f\u00f3rumokon vagy \u00fczenet \u00edr\u00e1s\u00e1n\u00e1l.", 
  POPDISABLEALARM:"T\u00e1mad\u00e1sjelz\u0151 kikapcsol\u00e1sa", SOUNDSETTINGS:"Hang be\u00e1ll\u00edt\u00e1sok", CHKSOUNDMUTE:"N\u00e9m\u00edt\u00e1s", SOUNDVOLUME:"Hanger\u0151", SOUNDURL:"Hangf\u00e1jl url c\u00edme", CHKSOUNDLOOP:"ism\u00e9tl\u00e9s", POPSOUNDLOOP:"Lej\u00e1tsz\u00e1s ism\u00e9tl\u00e9ssel", POPSOUNDMUTE:"Hang n\u00e9m\u00edt\u00e1sa", POPSOUNDPLAY:"Lej\u00e1tsz\u00e1s jelenlegi be\u00e1ll\u00edt\u00e1sokkal", POPSOUNDSTOP:"Lej\u00e1tsz\u00e1s meg\u00e1ll\u00edt\u00e1sa", POPSOUNDURL:"A hangf\u00e1jlhoz vezet\u0151 url c\u00edm", 
  STATS:{PLAYER:"J\u00e1t\u00e9kos statisztik\u00e1ja", ALLY:"Sz\u00f6vets\u00e9g statisztik\u00e1k", TOWN:"V\u00e1ros statisztik\u00e1k", INACTIVEDESC:"Ennyi idelye nem n\u00f6vekedett a j\u00e1t\u00e9kos pontsz\u00e1ma vagy nem szerzett harci pontot", CHKINACTIVE:"Inakt\u00edv j\u00e1t\u00e9kosok mutat\u00e1sa", INACTIVE:"Inakt\u00edv", }, ABH:{WND:{WINDOWTITLE:"Sereg \u00c9p\u00edt\u00e9s Seg\u00edt\u0151", UNITFRAME:"v\u00e1lassza ki az egys\u00e9get", DESCRIPTION1:"Ebben a v\u00e1rosba [population] szabad n\u00e9pess\u00e9ge van", 
  DESCRIPTION2:"Amely el\u00e9g [max_units] egys\u00e9g k\u00e9sz\u00edt\u00e9s\u00e9re", DESCRIPTION3:"M\u00e1r kifejlesztetted a(z) [research] fejleszt\u00e9st: [yesno]", DESCRIPTION4:"A kik\u00e9pz\u00e9si sorrendbe maximum [max_queue] egys\u00e9g f\u00e9l el", TARGET:"v\u00e1lassza ki a k\u00edv\u00e1nt mennyis\u00e9get (egys\u00e9g)", PACKAGE:"nyersanyag/sz\u00e1ll\u00edtm\u00e1ny (egys\u00e9g)", BTNSAVE:"be\u00e1ll\u00edt\u00e1sok ment\u00e9se", TOOLTIPOK:"kattintson az egys\u00e9g kiv\u00e1laszt\u00e1s\u00e1hoz, amelyre majd szeretne nyersanyagokat k\u00fcldeni", 
  TOOLTIPNOTOK:"az egys\u00e9g nincs kifejlesztve", HASRESEARCH:"TEDD", NORESEARCH:"NINCS", SETTINGSAVED:"A be\u00e1ll\u00edt\u00e1sok [city] v\u00e1ros\u00e1ra sikeresen mentve", }, RESWND:{RESLEFT:"sz\u00fcks\u00e9ges nyersanyagok", IMGTOOLTIP:"kattintson a sz\u00fcks\u00e9ges nyersanyag beilleszt\u00e9s\u00e9hez", }, }, NEWVERSION:{AVAILABLE:"\u00daj verzi\u00f3 el\u00e9rhet\u0151", INSTALL:"Telep\u00edt\u00e9s", REMINDER:"Eml\u00e9keztess k\u00e9s\u0151bb", REQRELOAD:"Friss\u00edt\u00e9s sz\u00fcks\u00e9ges", 
  RELOAD:"Friss\u00edt\u00e9s", }, LANGS:{LANG:"Ford\u00edt\u00e1s:", SEND:"Elk\u00fcld\u00e9s k\u00f6zz\u00e9t\u00e9tele", SAVE:"Ment\u00e9s", RESET:"Alap\u00e9rtelmezett nyelv vissza\u00e1ll\u00edt\u00e1sa", REMOVE:"T\u00f6r\u00f6lni szeretn\u00e9 a ford\u00edt\u00e1s?", }, HELPTAB5:"Ford\u00edt\u00e1s", BTNSIMUL:"Szimul\u00e1tor", EMOTS:{LABEL:"Szeretne t\u00f6bb hangulatjelet?", MESS:"Illessze be a linket a hangulatjelhez, mindegyiket k\u00fcl\u00f6n sorra", }, COMMAND:{ALL:"Mind", INCOMING:"bej\u00f6v\u0151", 
  OUTGOING:"kimen\u0151", RETURNING:"visszat\u00e9r\u0151", FORTOWN:"v\u00e1ros:", }, BTNVIEWBB:"BB-k\u00f3d", MSGSHOWCOST:"Az elvesztett egys\u00e9gek \u00e1ra", CHKWONDERTRADE:"A vil\u00e1gcsod\u00e1kra maxim\u00e1lis nyersanyagok k\u00fcldend\u0151k", MOBILEVERSION:"Mobil verzi\u00f3", AO:{TITLE:"Akad\u00e9mia \u00e1ttekint\u0151", }, CHKOLDTRADE:"A r\u00e9gi kereskedelmi elrendez\u00e9s haszn\u00e1lata", TSL:{WND:{WINDOWTITLE:"K\u00f6zeli v\u00e1rosok", TOOLTIP:"k\u00f6zeli v\u00e1rosok mutat\u00e1sa", 
  }, }, QUESTION:"K\u00e9rd\u00e9s", WALL:{WANTDELETECURRENT:"Biztosan t\u00f6r\u00f6lni szeretn\u00e9 a kiv\u00e1lasztott ment\u00e9st?", DELETECURRENT:"A kiv\u00e1lasztott ment\u00e9s t\u00f6rl\u00e9se", LISTSTATE:"V\u00e1rosfal \u00e1llapota ekkor", LISTSAVED:"V\u00e1rosfal ment\u00e9se ekkorr\u00f3l", }, RADAR:{ALL:"B\u00e1rmilyen v\u00e1ros", TOWNPOINTS:"Minim\u00e1lis pontsz\u00e1m", BTNSAVEDEFAULT:"\u00c9rt\u00e9kek ment\u00e9se alap\u00e9rtelmezettk\u00e9nt", TOWNRESERVED:"Fenntart\u00e1s", 
  TOWNOWNER:"Tulajdonos", CSTIME:"GYH id\u0151", TOWNNAME:"V\u00e1ros", BTNFIND:"Keres\u00e9s", MAXCSTIME:"Maxim\u00e1lis gyarmatos\u00edt\u00f3haj\u00f3 id\u0151", FIND:"Keres\u00e9s", TOWNFINDER:"V\u00e1ros keres\u0151", }, POPSOUNDEG:"p\u00e9ld\u00e1ul: https://www.youtube.com/watch?v=v2AC41dglnM, https://youtu.be/v2AC41dglnM, http://www.freesfx.co.uk/rx2/mp3s/10/11532_1406234695.mp3", BBIMG:"egyetlen k\u00e9p", LASTUPDATE:"1487468651957", };
  this.it = {INFO:{0:"Potusek", 1:"grepolis@potusek.eu", }, WEBSITE:"Sito web", AUTHOR:"av250866@gmail.com, G.O.W., Marco305, Xyarghas, TeseoN86, ander26", BTNCONV:"Converti", BTNGENER:"Crea", BTNSRC:"Sorgente", BTNVIEW:"Anterprima", BTNSAVE:"Salva", BTNMARKS:"Segna come letto", BTNMARKA:"Segna tutto come letto", MSGTITLE:"Converti il report", MSGQUEST:"Quali informazioni vuoi pubblicare?", MSGALL:"Tutto", MSGBBCODE:"Una volta pubblicato il report, potrai inserirlo nelle news o nel forums tramite il BBCode.", 
  MSGRESOURCE:"Bottino", MSGUNITS:"Unit\u00e0", MSGBUILD:"Edifici", MSGUSC:"Argento impiegato", MSGRAW:"Materiali", SUPPORT:"Supporti", SPY:"Spiando", CONQUER:"Conquistata", LOSSES:"Persa", HIDDEN:"Nascosto", NOTUNIT:"[i]Nessuna[/i]", TOWN:"[i]Citt\u00e0:[/i] ", PLAYER:"[i]Giocatore:[/i] ", ALLY:"[i]Alleanza:[/i] ", CAST:"lancia:", ONTOWER:"sulla citt\u00e0:", MSGHIDAD:"Nascondi citt\u00e0", MSGFORUM:"Il report sar\u00e0 pubblicato", BBALLY:"Forum alleanza / nel messaggio", BBFORUM:"forum esterno", 
  ERRGETSRC:"Errore! Per favore, creare il sorgente ed inviarlo come allegato a potusek@westtax.info", ICOCLOSE:"Chiudi", ICOHELP:"Riguardo al converter", MSGPREVIEW:"<b>Anteprima report</b>", HELPTAB1:"Riguardo a", HELPTAB2:"Come funziona", HELPTAB3:"Cambiamenti", HELPTAB4:"Opzioni", HLPVERSION:"Versione", HLPFIXED:"Corretto", HLPADDED:"Aggiunto", MSGHUMAN:{OK:"La informazione \u00e8 stata salvata", ERROR:"\u00e8 avvenuto un errore in scrittura", YOUTUBEERROR:"collegamento errato o non ha permesso di giocare fuori youtube", 
  }, STATSPOINT:"Punti", STATSRANK:"classifica", LABELS:{attack:{ATTACKER:"Attaccante", DEFENDER:"Difensore", MSGHIDAT:"attaccante", MSGHIDDE:"difensore", MSGATTUNIT:"Esercito attaccante", MSGDEFUNIT:"Esercito difensore", }, support:{ATTACKER:"In supporto", DEFENDER:"Supportato", MSGHIDAT:"in supporto", MSGHIDDE:"supportato", MSGATTUNIT:"Esercito in supporto", MSGDEFUNIT:"Esercito difensore", }, espionage:{ATTACKER:"Spia", DEFENDER:"Spiato", MSGHIDAT:"spia", MSGHIDDE:"spiato", MSGATTUNIT:"", MSGDEFUNIT:"", 
  }, }, MSGDETAIL:"dettagli ordine", MSGRETURN:"(ritorno)", MSGCLAIM:"citt\u00e0 prenotata", MSGCLAIMPPUP:"Genera prenotazione", MSGGENBBCODE:"Genera una lista in BBCode", MSGDEFSITE:"Sconfitto...", MSGLOSSITE:"Perdite...", MSGASATT:"...come attaccante", MSGASDEF:"...come difensore", MSGDIFF1:"non mostrare le differenze", MSGDIFF2:"mostra le differenze", MSGDIFF3:"mostra solo le differenze", BBCODELIMIT:"A causa della quantit\u00e0 di testo limitata in un singolo post, in caso di liste molto lunghe i dati saranno divisi in gruppi. Copiare ciascun gruppo come post separato.", 
  CHKPOWERNAME:"Mostra il tempo mancante all'utilizzo di un nuovo incantesimo", CHKNIGHTNAME:"Rende buie le citt\u00e0 in bonus notturno", CHKFORUMTABS:"Sostituisce le tabelle a scorrimento nel forum con multilinea", HELPTAB5:"Traduzione", CHKCMDIMG:"Visualizza la icona per la citta di destinazione dei comandi", STATSLINK:"Statistiche da display", BTNSUPPLAYERS:"Lista dei giocatori", CHKUNITSCOST:"Il report mostra il costo delle unit\u00e0 perse", CHKOCEANNUMBER:"Visualizza il numero dei mari", MSGRTLBL:"Informazioni rivolta", 
  MSGRTSHOW:"Aggiungi informazioni rivolta in corso", MSGRTONLINE:"Sarai connesso durante la rivolta rossa?", MSGRTYES:"Si", MSGRTNO:"No", MSGRTGOD:"Dio", MSGRTCSTIME:"Tempo CS", MSGRTONL:"connesso?", MSGRTERR:"Sei nella citt\u00e0 sbagliata!<br/>Per creare un rapporto della rivolta, vai alla citt\u00e0: ", BBTEXT:"versione testo", BBHTML:"versione tabelle", MSG413ERR:"<h3>Il rapporto generato \u00e8 troppo grande.</h3><p>Usa le opzioni disponibili e riducilo per pubblicarlo senza problemi.</p>", 
  CHKREPORTFORMAT:"Genera il rapporto usando le tabelle", WALLNOTSAVED:"Wall non \u00e8 stato salvato", WALLSAVED:"Wall \u00e8 stato salvato", POPSELRECRUNIT:"clicca, per selezionare le unit\u00e0 da produrre di default", POPRECRUNITTRADE:"clicca, per riempire con le risorse necessarie a reclutare le unit\u00e0 selezionate", POPINSERTLASTREPORT:"Incolla l ultimo rapporto creato", MSGCOPYREPORT:"Il rapporto \u00e8 stato salvato. Per favore clicca [paste_icon] nel forum o nel nuovo messaggio per incollarlo", 
  POPDISABLEALARM:"Disabilita allarme", SOUNDSETTINGS:"Opzioni suono", CHKSOUNDMUTE:"Silenzioso", SOUNDVOLUME:"volume", SOUNDURL:"url del file sonoro", CHKSOUNDLOOP:"ripeti", POPSOUNDLOOP:"Suona a ripetizione", POPSOUNDMUTE:"Silenzia il suono", POPSOUNDPLAY:"Suona con le opzioni correnti", POPSOUNDSTOP:"Smetti di suonare", POPSOUNDURL:"Percorso al file sonoro", STATS:{PLAYER:"Statistiche giocatore", ALLY:"Statistiche alleanza", TOWN:"Statistiche citt\u00e0", INACTIVE:"Inattivo", CHKINACTIVE:"Mostra i giocatori inattivi", 
  }, ABH:{WND:{WINDOWTITLE:"Aiuto costruzione esercito", UNITFRAME:"scegli le tue unit\u00e0", DESCRIPTION1:"In questa citt\u00e0, la popolazione libera \u00e8: [population]", DESCRIPTION2:"Che \u00e8 sufficiente per creare [max_units] unit\u00e0", DESCRIPTION3:"Hai [yesno] una [research] ricercata.", DESCRIPTION4:"Puoi mettere in coda fino a [max_queue] unit\u00e0", TARGET:"Scegli le unit\u00e0 da costruire", PACKAGE:"Risorse sufficienti per creare(unit\u00e0)", BTNSAVE:"salva opzioni", TOOLTIPOK:"clicca, per selezionare la unit\u00e0 standard per la quale manderai risorse", 
  TOOLTIPNOTOK:"questa unit\u00e0 non \u00e8 ancora stata ricercata", HASRESEARCH:"", NORESEARCH:"NON", SETTINGSAVED:"Le opzioni per la citt\u00e0 [city] sono state salvate", }, RESWND:{RESLEFT:"risorse rimaste da inviare", IMGTOOLTIP:"clicca, per caricare le risorse", }, }, NEWVERSION:{AVAILABLE:"Nuova versione disponibile", INSTALL:"Installa", REMINDER:"Ricordamelo pi\u00f9 tardi", REQRELOAD:"E' necessario aggiornare la pagina", RELOAD:"Aggiorna", }, LANGS:{LANG:"Traduzione per la lingua: ", SEND:"Invia per la pubblicazione", 
  SAVE:"Salva e prova", RESET:"Ripristina la lingua predefinita", REMOVE:"Cancellare la tua traduzione?", }, BTNSIMUL:"Simulatore", EMOTS:{LABEL:"Vuoi altre faccine?", MESS:"Copia i links alle faccinen, uno solo per riga", }, COMMAND:{ALL:"Tutto", INCOMING:"in arrivo", OUTGOING:"in partenza", RETURNING:"di ritorno", FORTOWN:"citt\u00e0:", }, MSGSHOWCOST:"costo delle unit\u00e0 perse", BBIMG:"immagine singola", RADAR:{FIND:"Cerca", MAXCSTIME:"Tempo massimo coloniale", TOWNFINDER:"Cerca citt\u00e0", 
  BTNFIND:"Cerca", TOWNNAME:"Citt\u00e0", TOWNOWNER:"Proprio", TOWNRESERVED:"Prenotazione", TOWNPOINTS:"Punti minimi Citt\u00e0", BTNSAVEDEFAULT:"Salva come valore di default", ALL:"Tutte le citt\u00e0", }, LASTUPDATE:"1488490709268", };
  this.nl = {INFO:{0:"Potusek", 1:"grepolis@potusek.eu", }, WEBSITE:"Website", AUTHOR:"zippohontas@gmail.com, jestertje, Gotcha8, gwvelden, Frosty Jim", BTNCONV:"Converteer", BTNGENER:"Genereer", BTNSRC:"Bron", BTNVIEW:"Voorbeeld", BTNSAVE:"Opslaan", BTNMARKS:"Gemarkeerd als gelezen", BTNMARKA:"Markeer alle als gelezen", MSGTITLE:"Converteer rappport", MSGQUEST:"Welke data wil je publiceren?", MSGALL:"Alle", MSGBBCODE:"Volgens de publicatie van het rapport, kun je het combineren met nieuws en forums door gebruik te maken van de BBCode.", 
  MSGRESOURCE:"Buit", MSGUNITS:"Eenheden", MSGBUILD:"Gebouwen", MSGUSC:"Gebruikt zilver", MSGRAW:"Grondstoffen", SUPPORT:"Ondersteuning", SPY:"Spionage", CONQUER:"Overwonnen", LOSSES:"Verliezen", HIDDEN:"Verborgen", NOTUNIT:"[i]Geen[/i]", TOWN:"[i]Stad:[/i] ", PLAYER:"[i]Speler:[/i] ", ALLY:"[i]Allie:[/i] ", CAST:"gunst:", ONTOWER:"Op de stad:", MSGHIDAD:"Verberg steden", MSGFORUM:"Het rapport wordt gepubliceerd", BBALLY:"alliantie forums / in het bericht", BBFORUM:"externe forum", ERRGETSRC:"Een fout is opgetreden! AUB, genereer de bron en verstuur als bijlage aan potusek@westtax.info", 
  ICOCLOSE:"Sluiten", ICOHELP:"Over de converteerder", MSGPREVIEW:"<b>Rapport voorbeeld</b>", HELPTAB1:"Over", HELPTAB2:"Hoe werkt het", HELPTAB3:"Veranderingen", HELPTAB4:"Instellingen", HLPVERSION:"Versie", HLPFIXED:"Fixed", HLPADDED:"Toegevoegd", MSGHUMAN:{OK:"De informatie is opgeslagen", ERROR:"Er is een fout opgetreden tijdens het schrijven ", YOUTUBEERROR:"Verkeerde link of niet toegestaan af te spelen buiten YouTube", }, STATS:"Speler statistieken", STATSPOINT:"Punten", STATSRANK:"Rang", 
  LABELS:{attack:{ATTACKER:"Aanvaller", DEFENDER:"Verdediger", MSGHIDAT:"aanvaller", MSGHIDDE:"verdediger", MSGATTUNIT:"Aanvallend Leger", MSGDEFUNIT:"Verdedigend Leger", }, support:{ATTACKER:"Ondersteunen", DEFENDER:"Ondersteunde", MSGHIDAT:"ondersteunen", MSGHIDDE:"ondersteunde", MSGATTUNIT:"Ondersteunend Leger", MSGDEFUNIT:"Verdedigend Leger", }, espionage:{ATTACKER:"Spion", DEFENDER:"Bespioneerde", MSGHIDAT:"spion", MSGHIDDE:"bespioneerde", MSGATTUNIT:"", MSGDEFUNIT:"", }, }, MSGDETAIL:"commando details", 
  MSGRETURN:"(enter)", MSGCLAIM:"city ??claims", MSGCLAIMPPUP:"Genereer claim", MSGGENBBCODE:"Genereer een lijst in BBCode", MSGDEFSITE:"Verslagen...", MSGLOSSITE:"Verliezen...", MSGASATT:"...als aanvaller", MSGASDEF:"...als verdediger", MSGDIFF1:"laat niet de verschillen zien", MSGDIFF2:"laat verschillen zien", MSGDIFF3:"laat enkel de verschillen zien", BBCODELIMIT:"Vanwege gelimiteerde hoeveelheid tekst in een bericht, in het geval van een lange lijst, de data is onderverdeeld in groepen. Elke groep in een apart bericht plakken.", 
  CHKPOWERNAME:"Toon de tijd tot mogelijk gebruik van de gunst", CHKNIGHTNAME:"Verduisterd de stad tijdens nacht bonus", CHKFORUMTABS:"Vervang scrollen van de forum tabs door meerdere regels", BTNRESERVE:"Claim", LNKRESERVE:"Claims", LBLGETRESER:"Data ophalen...", BTNCHECK:"Controle Claims", CHKCMDIMG:"View the icons for the destination city commands", STATSLINK:"Statistieken van deze pagina laden", BTNSUPPLAYERS:"Lijst met spelers", CHKUNITSCOST:"Het rapport de kosten van de verloren eenheden laten tonen", 
  CHKOCEANNUMBER:"Oceaannummers laten zien", MSGRTLBL:"Opstandsinformatie", MSGRTSHOW:"Voeg bezigzijnde opstandsinformatie toe", MSGRTONLINE:"Ben je online tijdens fase rood?", MSGRTYES:"Ja", MSGRTNO:"Nee", MSGRTCSTIME:"Koloschip vaartijd", MSGRTERR:"Je kijkt naar de verkeerde stad!<br/> Ga naar de stad om de opstandsinformatie te maken: ", BBTEXT:"Tekst versie", BBHTML:"Tabel versie", MSG413ERR:"<h3>Het gegenereerde rapport is te groot</h3><p>Gebruik de aanwezige mogelijkheden en verklein het om publiceerproblemen te voorkomen</p>", 
  CHKREPORTFORMAT:"Genereer rapporten door middel van tabellen", WALLNOTSAVED:"De muur is niet opgeslagen", WALLSAVED:"De muur is opgeslagen", POPSELRECRUNIT:"Klik, om de standaard productie-eenheid te selecteren", POPRECRUNITTRADE:"Klik, om de grondstoffen benodig voor de geselecteerde eenheid in te vullen", POPINSERTLASTREPORT:"Plak het laatst geconverteerde rapport", MSGCOPYREPORT:"Het rapport is  opgeslagen. Klik op[paste_icon]op de fora of op een nieuw berichtscherm, om het te posten", POPDISABLEALARM:"Schakel het alarm uit", 
  SOUNDSETTINGS:"Geluid instellingen", CHKSOUNDMUTE:"Geluid uit", POPSOUNDLOOP:"In loop afspelen", POPSOUNDMUTE:"Het geluid uitzetten", POPSOUNDPLAY:"Speel af met deze instellingen", POPSOUNDSTOP:"Stop afspelen", POPSOUNDURL:"Url naar het bestand van het geluid", ABH:{WND:{WINDOWTITLE:"Legeraanbouw helper", UNITFRAME:"Kies je eenheid", DESCRIPTION1:"In deze stad heb je [population] vrije inwoners", DESCRIPTION2:"Wat genoeg is om  [max_units] te bouwen", DESCRIPTION3:"Je hebt [yesno] [research] onderzocht", 
  DESCRIPTION4:"Je kan in de wachtrij[max_queue] eenheden zetten", TARGET:"Kies je bouwdoel", PACKAGE:"Grondstoffen per lading (units)", BTNSAVE:"Slaat instellingen op", TOOLTIPOK:"klik, om de standaard eenheid in te stellen waarvoor je grondstoffen zult zenden", TOOLTIPNOTOK:"Eenheid is nog niet onderzocht", SETTINGSAVED:"Instelling voor [city] zijn opgeslagen", HASRESEARCH:"DOE", NORESEARCH:"DOE NIET", }, RESWND:{RESLEFT:"Grondstoffen nog te sturen", IMGTOOLTIP:"klik, om de grondstoffen in te vullen", 
  }, }, NEWVERSION:{AVAILABLE:"Er is een nieuwe versie beschikbaar", INSTALL:"Installeer ", REMINDER:"Herinner mij later", REQRELOAD:"Het is nodig om de site opnieuw te laden", RELOAD:"Opnieuw laden", }, LANGS:{LANG:"Vertaling voor taal:", SEND:"Verzonden naar publicatie", SAVE:"Opslaan en testen", RESET:"Herstel de standaardtaal", REMOVE:"Verwijder je vertaling?", }, HELPTAB5:"Vertaling", COMMAND:{ALL:"Alle", INCOMING:"inkomend", OUTGOING:"uitgaand", RETURNING:"terugkomend", FORTOWN:"stad:", }, 
  MSGSHOWCOST:"Kosten van verloren eenheden", BBIMG:"enkele afbeelding", LASTUPDATE:"1488490764765", SOUNDVOLUME:"Geluids Volume", SOUNDURL:"Geluidsbestand url", POPSOUNDEG:"voorbeeld: https://www.youtube.com/watch?v=v2AC41dglnM, https://youtu.be/v2AC41dglnM, http://www.freesfx.co.uk/rx2/mp3s/10/11532_1406234695.mp3", EMOTS:{LABEL:"Wil je meer emoticons?", MESS:"Plak links naar emoticons, elk op een nieuwe regel", }, RADAR:{TOWNFINDER:"Zoek steden", FIND:"Zoek", MAXCSTIME:"Maximale tijd kolonisatieschip", 
  BTNFIND:"Zoek", TOWNNAME:"Stad", TOWNOWNER:"Eigenaar", TOWNRESERVED:"Reservering", TOWNPOINTS:"Minimale stadspunten", BTNSAVEDEFAULT:"Sla waarden op als standaard", ALL:"Elke Stad", UNITTIME:"tijd", MAXUNITTIME:"Maximale tijd", }, WALL:{LISTSAVED:"Opgeslagen muur op de dag", LISTSTATE:"Toestand van de muur op de dag", DELETECURRENT:"Verwijder het huidige bestand", WANTDELETECURRENT:"Wil je het huidige muur-bestand verwijderen?", }, QUESTION:"Vraag", TSL:{WND:{WINDOWTITLE:"Gesorteerde stedenlijst", 
  TOOLTIP:"laat gesorteerde stad zien", }, }, CHKOLDTRADE:"Gebruik oude handels layout", AO:{TITLE:"Academie overzicht", }, MOBILEVERSION:"Mobiele versie", CHKWONDERTRADE:"Wanneer men grondstoffen naar wereldwonderen stuurt, stuur maximale gelijke hoeveelheid", CHKMOUSEWHEELZOOMBULLEYE:"Gebruik muiswiel om de map te zoomen"};
  this.pl = {AUTHOR:"Potusek", BTNCONV:"Konwertuj", BTNGENER:"Generuj", BTNSRC:"\u0179r\u00f3d\u0142o", BTNVIEW:"Podgl\u0105d", BTNSAVE:"Zapisz", BTNMARKS:"Oznacz jako przeczytane", BTNMARKA:"Oznacz wszystkie jako przeczytane", MSGTITLE:"Opcje konwersji", MSGQUEST:"Kt\u00f3re z danych chcesz opublikowa\u0107?", MSGALL:"Wszystkie", MSGBBCODE:"Po opublikowaniu raportu, mo\u017cesz powi\u0105za\u0107 go z wiadomo\u015bciami lub forum korzystaj\u0105c z BBCode.", MSGRESOURCE:"\u0141up", MSGUNITS:"Jednostki", 
  MSGBUILD:"Budynki", MSGUSC:"Wykorzystane srebrne monety", MSGRAW:"Surowce", MSGSHOWCOST:"Koszty utraconych jednostek", SUPPORT:"Wspiera", SPY:"Szpieguje", CONQUER:"Podbi\u0142", LOSSES:"Straty", HIDDEN:"Ukryte", NOTUNIT:"[i]Brak[/i]", TOWN:"[i]Miasto:[/i] ", PLAYER:"[i]Gracz:[/i] ", ALLY:"[i]Sojusz:[/i] ", CAST:"rzuci\u0142:", ONTOWER:"Na miasto:", MSGHIDAD:"Ukrywanie miasta", MSGFORUM:"Raport b\u0119dzie publikowany", BBALLY:"forum sojuszu / w wiadomo\u015bci", BBFORUM:"forum zewn\u0119trzne", 
  ERRGETSRC:"Wyst\u0105pi\u0142 b\u0142\u0105d! Prosz\u0119 wygenerowa\u0107 \u017ar\u00f3d\u0142o i wys\u0142a\u0107 jako za\u0142\u0105cznik na adres potusek@westtax.info", ICOCLOSE:"Zamknij", ICOHELP:"O konwerterze", MSGPREVIEW:"<b>Podgl\u0105d raportu</b>", HELPTAB1:"O konwerterze", HELPTAB2:"Jak to dzia\u0142a", HELPTAB3:"Zmiany", HELPTAB4:"Ustawienia", HLPVERSION:"Wersja", HLPFIXED:"Poprawiono", HLPADDED:"Dodano", MSGHUMAN:{OK:"Informacje zosta\u0142y zapisane", ERROR:"Wyst\u0105pi\u0142 b\u0142\u0105d podczas zapisu", 
  YOUTUBEERROR:"Niepoprawny link lub niedozwolone odtwarzanie poza youtube", }, STATSPOINT:"Punkty", STATSRANK:"Ranking", LABELS:{attack:{ATTACKER:"Agresor", DEFENDER:"Obro\u0144ca", MSGHIDAT:"atakuj\u0105cego", MSGHIDDE:"obro\u0144cy", MSGATTUNIT:"Wojska atakuj\u0105cego", MSGDEFUNIT:"Wojska obro\u0144cy", }, support:{ATTACKER:"Wspieraj\u0105cy", DEFENDER:"Wspierany", MSGHIDAT:"wspieraj\u0105cego", MSGHIDDE:"wspieranego", MSGATTUNIT:"Wojska wspieraj\u0105cego", MSGDEFUNIT:"Wojska obro\u0144cy", 
  }, espionage:{ATTACKER:"Szpieguj\u0105cy", DEFENDER:"Szpiegowany", MSGHIDAT:"szpieguj\u0105cego", MSGHIDDE:"szpiegowanego", MSGATTUNIT:"", MSGDEFUNIT:"", }, }, MSGDETAIL:"szczeg\u00f3\u0142y polecenia", MSGRETURN:"(powr\u00f3t)", MSGCLAIM:"rezerwuje miasto", MSGCLAIMPPUP:"Generuj rezerwacj\u0119", MSGGENBBCODE:"Generuj list\u0119 w BBCode", MSGDEFSITE:"Pokonane...", MSGLOSSITE:"Stracone...", MSGASATT:"...w roli atakuj\u0105cego", MSGASDEF:"...w roli obro\u0144cy", MSGDIFF1:"nie pokazuj r\u00f3\u017cnic", 
  MSGDIFF2:"poka\u017c r\u00f3\u017cnice", MSGDIFF3:"poka\u017c tylko r\u00f3\u017cnice", BBCODELIMIT:"W zwi\u0105zku z ograniczeniem ilo\u015bci tekstu w jednym po\u015bcie, w przypadku d\u0142ugiej listy, dane zosta\u0142y podzielone na grupy. Ka\u017cd\u0105 grup\u0119 wklejaj jako osobny wpis.", CHKPOWERNAME:"Wy\u015bwietlaj czas, jaki pozosta\u0142 do mo\u017cliwo\u015bci u\u017cycia czaru", CHKNIGHTNAME:"Zaciemniaj polis w bonusie nocnym", CHKFORUMTABS:"Zamie\u0144 przewijane zak\u0142adki na forum, na wieloliniowe", 
  BTNRESERVE:"Rezerwacja", LNKRESERVE:"Rezerwacje", LBLGETRESER:"Pobieranie danych ...", BTNCHECK:"Sprawdzenie rezerwacji", CHKCMDIMG:"Poka\u017c ikony rozkaz\u00f3w przy docelowym mie\u015bcie", STATSLINK:"Statystyki wy\u015bwietlaj ze strony", BTNSUPPLAYERS:"Lista graczy", CHKUNITSCOST:"Na raporcie pokazuj koszt straconych jednostek", CHKOCEANNUMBER:"Wy\u015bwietlaj numery m\u00f3rz", MSGRTLBL:"Informacja o buncie", MSGRTSHOW:"Do\u0142\u0105cz do raportu informacje o buncie", MSGRTONLINE:"Czy b\u0119dziesz online podczas buntu?", 
  MSGRTYES:"Tak", MSGRTNO:"Nie", MSGRTGOD:"B\u00f3g", MSGRTCSTIME:"CK", MSGRTONL:"online?", MSGRTERR:"Znajdujesz si\u0119 w niew\u0142a\u015bciwym mie\u015bcie!<br/>Aby wygenerowa\u0107 informacje o buncie, przejd\u017a do miasta: ", BBTEXT:"wersja tekstowa", BBHTML:"wersja oparta na tabelach", BBIMG:"jako pojedynczy obraz", MSG413ERR:"<h3>Je\u017celi przez d\u0142u\u017csz\u0105 chwil\u0119 widzisz ten napis, w\u00f3wczas wygenerowany raport jest zbyt obszerny.</h3><p>U\u017cyj dost\u0119pnych opcji redukuj\u0105c ilo\u015b\u0107 publikowanych danych.</p>", 
  CHKREPORTFORMAT:"Generowanie raport\u00f3w w oparciu o tabele", WALLNOTSAVED:"Mur nie zosta\u0142 zapisany", WALLSAVED:"Mur jest zapisany", POPSELRECRUNIT:"kliknij, aby wybra\u0107 domy\u015bln\u0105 jednostk\u0119 do produkcji", POPRECRUNITTRADE:"kliknij, \u017ceby zape\u0142ni\u0107 handlarza surowcami dla wybranej jednostki", POPINSERTLASTREPORT:"Wstaw ostatni wynik konwersji", MSGCOPYREPORT:"Wynik konwersji zosta\u0142 zapisany. Prosz\u0119 klikn\u0105\u0107 [paste_icon] na forum lub w wiadomo\u015bci, aby wstawi\u0107", 
  POPDISABLEALARM:"Wy\u0142\u0105cz alarm", SOUNDSETTINGS:"Ustawienia d\u017awi\u0119ku", CHKSOUNDMUTE:"Wycisz", SOUNDVOLUME:"G\u0142o\u015bno\u015b\u0107", SOUNDURL:"\u015acie\u017cka do pliku", CHKSOUNDLOOP:"odtwarzaj w p\u0119tli", POPSOUNDLOOP:"odtwarzaj w p\u0119tli", POPSOUNDMUTE:"Wycisz d\u017awi\u0119k", POPSOUNDPLAY:"Odtw\u00f3rz z bie\u017c\u0105cymi ustawieniami", POPSOUNDSTOP:"Przerwij odtwarzanie", POPSOUNDURL:"\u015acie\u017cka do pliku z d\u017awi\u0119kiem", POPSOUNDEG:"np: https://www.youtube.com/watch?v=v2AC41dglnM, https://youtu.be/v2AC41dglnM, http://www.freesfx.co.uk/rx2/mp3s/10/11532_1406234695.mp3", 
  STATS:{PLAYER:"Statystyki gracza", ALLY:"Statystyki sojuszu", TOWN:"Statystyki miasta", INACTIVE:"Nieaktywny", CHKINACTIVE:"Poka\u017c nieaktywno\u015b\u0107 graczy", INACTIVEDESC:"W tym czasie nie odnotowano punkt\u00f3w walki jak i rozbudowy", }, ABH:{WND:{WINDOWTITLE:"Pomocnik w budowaniu armii", UNITFRAME:"Wybierz domy\u015bln\u0105 jednostk\u0119", DESCRIPTION1:"W obecnym mie\u015bcie masz [population] wolnych mieszka\u0144c\u00f3w", DESCRIPTION2:"Co wystarczy do zbudowania: [max_units]", 
  DESCRIPTION3:"[yesno] badanie [research]", DESCRIPTION4:"Mo\u017cesz zakolejkowa\u0107 max [max_queue] jednostek", TARGET:"wybierz ile zbudowa\u0107", PACKAGE:"na ile jednostek domy\u015blnie wysy\u0142a\u0107", BTNSAVE:"zapisz ustawienia", TOOLTIPOK:"kliknij, aby wybra\u0107 jednostk\u0119 dla kt\u00f3rej chcesz domy\u015blnie wysy\u0142a\u0107 surowce", TOOLTIPNOTOK:"jednostka nie zosta\u0142a zbadana", HASRESEARCH:"MASZ", NORESEARCH:"NIE MASZ", SETTINGSAVED:"Ustawienia dla miasta [city] zosta\u0142y zapisane", 
  }, RESWND:{RESLEFT:"pozosta\u0142o do wys\u0142ania", IMGTOOLTIP:"kliknij, \u017ceby wype\u0142ni\u0107 pola surowc\u00f3w", }, }, NEWVERSION:{AVAILABLE:"Dost\u0119pna nowa wersja", INSTALL:"Zainstaluj", REMINDER:"Przypomnij p\u00f3\u017aniej", REQRELOAD:"Wymagane od\u015bwie\u017cenie strony", RELOAD:"Od\u015bwie\u017c", }, HELPTAB5:"T\u0142umaczenie", LANGS:{REMOVE:"Skasowa\u0107 Twoje t\u0142umaczenie?", RESET:"Przywr\u00f3\u0107 domy\u015blny j\u0119zyk", SAVE:"Zapisz i testuj", SEND:"Wy\u015blij do publikacji", 
  LANG:"T\u0142umaczenie dla j\u0119zyka:"}, BTNSIMUL:"Symulator", EMOTS:{LABEL:"Chcesz wi\u0119cej emotek?", MESS:"Wklej linki do obrazk\u00f3w, ka\u017cdy w nowej linii"}, COMMAND:{ALL:"Wszystkie", INCOMING:"nadchodz\u0105ce", OUTGOING:"wychodz\u0105ce", RETURNING:"powracaj\u0105ce", FORTOWN:"miasto:"}, RADAR:{TOWNFINDER:"Wyszukiwanie miast", FIND:"Szukane", MAXCSTIME:"Maksymalny czas statku kolonizacyjnego", MAXUNITTIME:"Maksymalny czas", BTNFIND:"Szukaj", TOWNNAME:"Miasto", CSTIME:"Czas", UNITTIME:"Czas", 
  TOWNOWNER:"W\u0142a\u015bciciel", TOWNRESERVED:"Rezerwacja", TOWNPOINTS:"Minimalne punkty miasta", BTNSAVEDEFAULT:"Zapisz warto\u015bci jako domy\u015blne", ALL:"Dowolne miasto", SHOWCITIES:"Poka\u017c miasta"}, WALL:{LISTSAVED:"Zapis muru na dzie\u0144", LISTSTATE:"Stan muru na dzie\u0144", DELETECURRENT:"Usu\u0144 bie\u017c\u0105cy zapis", WANTDELETECURRENT:"Czy chcesz usun\u0105\u0107 bie\u017c\u0105cy zapis muru?"}, QUESTION:"Pytanie", TSL:{WND:{WINDOWTITLE:"Lista posortowanych miast", TOOLTIP:"poka\u017c posortowane miasta"}}, 
  CHKOLDTRADE:"U\u017cywaj starego uk\u0142adu handlu", AO:{TITLE:"Przegl\u0105d Akademii"}, MOBILEVERSION:"Wersja mobilna", CHKWONDERTRADE:"Podczas wysy\u0142ania zasob\u00f3w do cud\u00f3w \u015bwiata, wy\u015blij maksymalne r\u00f3wne ilo\u015bci", CHKTOWNPOPUP:"Wy\u015bwietlaj dymek z informacj\u0105 o wojsku po najechaniu na nazw\u0119 miasta w rozwijanej li\u015bcie miast", POPWONDERSHOT:"Ilo\u015b\u0107 dost\u0119pnych przyspiesze\u0144 budowy", CHKTACL:"W\u0142\u0105cz przesuwanie listy ruchu wojsk", 
  BTNCOMPARE:"Pakt vs Wr\u00f3g", ALLYCOMPARETITLE:"Por\u00f3wnanie sojuszy koalicji z wrogimi sojuszami", CHKMCOL:"Przypisz kolory wiadomo\u015bciom zgodnie z ustalonym schematem kolorowania", CHKBUPO:"Poka\u017c punkty rozbudowy", CHKMOUSEWHEELZOOMBULLEYE:"U\u017cyj k\u00f3\u0142ka myszy do zmiany przybli\u017cenia mapy", POPINSERTEMOT:"Wstaw emotikon\u0119", CHKIMGBTN:"Wy\u015bwietlaj o\u015bmiornic\u0119 na przyciskach GRCRTools"};
  this.pt = {AUTHOR:"100 no\u00e7\u00e3o, Cirrus Minor, AceCombat021, Dark Rebel, Difus, Eduslb98, Gwyneth Llewelyn, AceCombat021, Dark Rebel, Difus, Eduslb98, Gwyneth Llewelyn, zyka", BTNCONV:"Converter", BTNGENER:"Gerar", BTNVIEW:"Visualizar", BTNSAVE:"Salvar", MSGTITLE:"Converter Relat\u00f3rio", MSGQUEST:"Quais dados voc\u00ea deseja publicar ?", MSGBBCODE:"Uma vez o relat\u00f3rio publicado, pode partilh\u00e1-lo em not\u00edcias e f\u00f3runs usando BBCode.", MSGRESOURCE:"Saque", MSGUNITS:"Unidades", 
  MSGBUILD:"Edif\u00edcios", MSGUSC:"Moedas de prata usadas", MSGRAW:"Recursos da Cidade", SUPPORT:"Suporte", SPY:"Espionagem", CONQUER:"Conquistas", LOSSES:"Perdas", HIDDEN:"Omitido", NOTUNIT:"[i]Nenhum[/i]", TOWN:"[i]Cidade:[/i] ", PLAYER:"[i]Jogador:[/i] ", ALLY:"[i]Alian\u00e7a:[/i] ", CAST:"Lan\u00e7ar:", ONTOWER:"Na Cidade:", MSGHIDAD:"Esconder cidades", MSGFORUM:"O relat\u00f3rio ser\u00e1 publicado", BBALLY:"F\u00f3runs da alian\u00e7a / na mensagem", BBFORUM:"F\u00f3rum Externo", ICOCLOSE:"Fechar", 
  ICOHELP:"Sobre o conversor", MSGPREVIEW:"<b>Pr\u00e9 visualiza\u00e7\u00e3o do Relat\u00f3rio</b>", HELPTAB1:"Sobre", HELPTAB2:"Como funciona", HELPTAB3:"Mudan\u00e7as", HELPTAB4:"Configura\u00e7\u00f5es", MSGHUMAN:{OK:"Informa\u00e7\u00e3o salva com sucesso", ERROR:"Ocorreu um erro ao salvar", YOUTUBEERROR:"Link incorreto ou n\u00e3o dispon\u00edvel fora do youtube", }, LABELS:{attack:{ATTACKER:"Atacante", DEFENDER:"Defensor", MSGHIDAT:"Atacante", MSGHIDDE:"defensor", MSGATTUNIT:"Unidades de Ataque", 
  MSGDEFUNIT:"Unidades de Defesa", }, support:{ATTACKER:"Apoiando", DEFENDER:"Apoiado", MSGHIDAT:"Apoiando", MSGHIDDE:"Apoiado", MSGATTUNIT:"Unidades apoiando", MSGDEFUNIT:"Unidades Defendendo", }, espionage:{ATTACKER:"Espi\u00e3o", DEFENDER:"Espiado", MSGHIDAT:"Espi\u00e3o", MSGHIDDE:"Espiado", MSGATTUNIT:"", MSGDEFUNIT:"", }, }, MSGDETAIL:"Detalhes do Comando", MSGRETURN:"(retornar)", MSGGENBBCODE:"Gerar lista de BBcode", MSGDEFSITE:"Derrotado...", MSGLOSSITE:"Perdas...", MSGASATT:"...Como atacante", 
  MSGASDEF:"...Como defensor", MSGDIFF1:"N\u00e3o mostrar diferen\u00e7as", MSGDIFF2:"Mostrar diferen\u00e7as", MSGDIFF3:"Mostrar apenas as diferen\u00e7as", BBCODELIMIT:"Tendo em vista um n\u00famero limitado de caracteres em um post, no caso de uma lista longa, os dados ser\u00e3o divididos em grupos, cada grupo postado separadamente.", CHKPOWERNAME:"Tempo restante para poder usar o encantamento", CHKFORUMTABS:"Substituir guias de rolagem do f\u00f3rum para uma guia paralela", STATSLINK:"Estat\u00edsticas no visor", 
  BTNSUPPLAYERS:"Lista de jogadores", CHKUNITSCOST:"O Relat\u00f3rio mostra o custo das unidades perdidas", CHKOCEANNUMBER:"Exibir n\u00famero do oceano", MSGRTLBL:"Informa\u00e7\u00f5es sobre a revolta", MSGRTSHOW:"Adicionar informa\u00e7\u00e3o de revolta em curso", MSGRTONLINE:"Voc\u00ea estar\u00e1 online durante a m\u00e3o de fogo ?", MSGRTYES:"Sim", MSGRTNO:"N\u00e3o", MSGRTGOD:"Deus", MSGRTCSTIME:"Tempo de NC", MSGRTONL:"Conectado ?", MSGRTERR:"Voc\u00ea est\u00e1 na cidade errada!<br/>Para criar a informa\u00e7\u00e3o de revolta, por favor v\u00e1 para a cidade:", 
  BBTEXT:"Vers\u00e3o em Texto", BBHTML:"Vers\u00e3o em Tabela", MSG413ERR:"<h3>O relat\u00f3rio gerado \u00e9 muito grande.</h3><p>Use as op\u00e7\u00f5es dispon\u00edveis para reduzir e publicar sem problemas.</p>", CHKREPORTFORMAT:"Gerar relat\u00f3rios usando Tabela", WALLNOTSAVED:"Muralha n\u00e3o foi salva", WALLSAVED:"Muralha foi salva", POPSELRECRUNIT:"Clique, para selecionar a unidade de produ\u00e7\u00e3o padr\u00e3o", POPRECRUNITTRADE:"Clique, para preencher os recursos necess\u00e1rios para recrutar a unidade selecionada", 
  POPINSERTLASTREPORT:"Colar o \u00faltimo relat\u00f3rio convertido", MSGCOPYREPORT:"O relat\u00f3rio foi salvo. Por favor, clique em [paste_icon] no f\u00f3rum ou em nova janela de mensagem para col\u00e1-lo", POPDISABLEALARM:"Desativar alarme", SOUNDSETTINGS:"Configura\u00e7\u00f5es de som", CHKSOUNDMUTE:"Mudo", SOUNDVOLUME:"Volume", SOUNDURL:"Link de som", CHKSOUNDLOOP:"ciclo", POPSOUNDLOOP:"percorrer ciclo", POPSOUNDMUTE:"Mutar o som", POPSOUNDPLAY:"Jogar com as configura\u00e7\u00f5es atuais", 
  POPSOUNDSTOP:"Parar execu\u00e7\u00e3o", POPSOUNDURL:"Caminho de url para o arquivo com som", STATS:{PLAYER:"Status do Jogador", ALLY:"Status da Alian\u00e7a", TOWN:"Status da Cidade", INACTIVE:"Inativo", CHKINACTIVE:"Mostrar Jogadores Inativos", INACTIVEDESC:"Neste tempo n\u00e3o houve pontos ganhos atacando ou expandindo.", }, ABH:{WND:{WINDOWTITLE:"Construtor de Ex\u00e9rcitos", UNITFRAME:"Selecione sua unidade", DESCRIPTION1:"Nessa cidade, voc\u00ea tem [population] popula\u00e7\u00e3o livre", 
  DESCRIPTION2:"Qual \u00e9 o suficiente para construir [max_units]", DESCRIPTION3:"Voc\u00ea [yesno] Tem [research] Pesquisado.", DESCRIPTION4:"Voc\u00ea pode enfileirar um m\u00e1ximo de [max_queue] unidades", TARGET:"Selecione sua cidade alvo", PACKAGE:"Pacote de Recursos por vez (units)", BTNSAVE:"Salvar configura\u00e7\u00f5es", TOOLTIPOK:"Clique para selecionar a unidade padr\u00e3o a qual voc\u00ea estar\u00e1 enviando recursos", TOOLTIPNOTOK:"A unidade n\u00e3o foi pesquisada", HASRESEARCH:"Fazer", 
  NORESEARCH:"N\u00e3o fazer", SETTINGSAVED:"Configura\u00e7\u00f5es de [city] Foram salvas", }, RESWND:{RESLEFT:"Recursos excedentes para envio", IMGTOOLTIP:"Clique, para preencher os recursos", }, }, NEWVERSION:{AVAILABLE:"Nova vers\u00e3o dispon\u00edvel", INSTALL:"Instalar", REMINDER:"Lembrar mais tarde", REQRELOAD:"Atualiza\u00e7\u00e3o requerida", RELOAD:"Atualizar", }, LANGS:{LANG:"Traduzido para o idioma:", SEND:"Enviar para publica\u00e7\u00e3o", SAVE:"Salvar e testar", RESET:"Restaurar idioma padr\u00e3o", 
  REMOVE:"Excluir sua tradu\u00e7\u00e3o ?", }, HELPTAB5:"Tradu\u00e7\u00e3o", BTNSIMUL:"Simulador", EMOTS:{LABEL:"Quer mais emoctions ?", MESS:"Cole links para emoction, cada um em uma nova linha", }, COMMAND:{ALL:"Todos", INCOMING:"A chegar", OUTGOING:"A partir", RETURNING:"A regressar", FORTOWN:"cidade:", }, MSGSHOWCOST:"Custo de unidades perdidas", BBIMG:"imagem \u00fanica ", POPSOUNDEG:"exemplo: https://www.youtube.com/watch?v=v2AC41dglnM, https://youtu.be/v2AC41dglnM, http://www.freesfx.co.uk/rx2/mp3s/10/11532_1406234695.mp3", 
  RADAR:{FIND:"Procurar", TOWNFINDER:"Procurar Cidades", MAXCSTIME:"Tempo m\u00e1ximo para NC", TOWNPOINTS:"Pontos m\u00ednimos da cidade", TOWNRESERVED:"Reservas", TOWNOWNER:"Dono", BTNSAVEDEFAULT:"Salvar valores como padr\u00e3o", ALL:"Qualquer cidade", BTNFIND:"Procurar", TOWNNAME:"Cidade", CSTIME:"Tempo CS", }, WALL:{LISTSTATE:"Condi\u00e7\u00e3o da muralha no dia", DELETECURRENT:"Apagar o registo corrente", LISTSAVED:"Muralha salva no dia", WANTDELETECURRENT:"Quer apagar o registo corrente no cronograma?", 
  }, QUESTION:"Quest\u00e3o", CHKWONDERTRADE:"Ao enviar recursos para maravilhas do mundo, enviar quantidades m\u00e1ximas iguais", MOBILEVERSION:"Vers\u00e3o m\u00f3vel", AO:{TITLE:"Vis\u00e3o geral da academia", }, CHKOLDTRADE:"Usar anterior esquema de com\u00e9rcio", TSL:{WND:{TOOLTIP:"mostrar cidade ordenada", WINDOWTITLE:"Lista de cidades ordenada", }, }, LASTUPDATE:"1487531813324", };
  this.ro = {INFO:{0:"Potusek", 1:"grepolis@potusek.eu", }, WEBSITE:"Website", AUTHOR:"Autor, Sir Prize, magicianul2006, EnsyFane, LLTCM", BTNCONV:"Converteste", BTNGENER:"Genereaza", BTNSRC:"Sursa", BTNVIEW:"Previzualizare", BTNSAVE:"Salveaza", BTNMARKS:"Marcheaza ca citit", BTNMARKA:"Marcheaza tot ca citit", MSGTITLE:"Converteste Raportul", MSGQUEST:"Ce informatii din data vrei sa publici?", MSGALL:"Tot", MSGBBCODE:"Urmarind publicarea raportului, puteti sa il asociati cu noutati si forumuri folosind BBCode.", 
  MSGRESOURCE:"Prada", MSGUNITS:"Solda\u021bi", MSGBUILD:"Cladiri", MSGUSC:"Monede de argint utilizate", MSGRAW:"Materii prime", SUPPORT:"Sprijin", SPY:"Spionat", CONQUER:"Cucerit", LOSSES:"Pierderi", HIDDEN:"Ascunde", NOTUNIT:"[i]Nimic[/i]", TOWN:"[i]Ora\u0219:[/i] ", PLAYER:"[i]Juc\u0103tor:[/i] ", ALLY:"[i]Alian\u021b\u0103:[/i] ", CAST:"Folosire:", ONTOWER:"\u00cen ora\u0219:", MSGHIDAD:"Ascunde ora\u0219", MSGFORUM:"Raportul va fi publicat", BBALLY:"forumurile alian\u021bei / \u00een mesaje", 
  BBFORUM:"forum extern", ERRGETSRC:"O eroare a avut loc! Va rugam, trimiteti sursa ca o atasare la potusek@westtax.info", ICOCLOSE:"\u00cenchide", ICOHELP:"Despre convertor", MSGPREVIEW:"<b>Previzualizare raport</b>", HELPTAB1:"Despre", HELPTAB2:"Cum func\u021bioneaz\u0103", HELPTAB3:"Schimb\u0103ri", HELPTAB4:"Set\u0103ri", HLPVERSION:"Versiune", HLPFIXED:"Fixat", HLPADDED:"Adaugat", MSGHUMAN:{OK:"Informatiile au fost salvate", ERROR:"O eroare a avut loc in timpul tiparirii", YOUTUBEERROR:"Link incorect sau nu este posibila redarea inafara youtube", 
  }, STATS:"Statisticile jucatorului", STATSPOINT:"Puncte", STATSRANK:"Rang", LABELS:{attack:{ATTACKER:"Atacator", DEFENDER:"Aparator", MSGHIDAT:"atacator", MSGHIDDE:"aparator", MSGATTUNIT:"Armata atacatoare", MSGDEFUNIT:"Armata defensiva", }, support:{ATTACKER:"Sprijin", DEFENDER:"Sprijinit", MSGHIDAT:"sprijin", MSGHIDDE:"sprijinit", MSGATTUNIT:"Armata sprijin", MSGDEFUNIT:"Armata aparatori", }, espionage:{ATTACKER:"Spion", DEFENDER:"Spionat", MSGHIDAT:"spion", MSGHIDDE:"spionat", MSGATTUNIT:"", 
  MSGDEFUNIT:"", }, }, MSGDETAIL:"deatalii comanda", MSGRETURN:"(inapoi)", MSGCLAIM:"oras \u200b\u200brezervare", MSGCLAIMPPUP:"Genereaza rezervare", MSGGENBBCODE:"Genereaz\u0103 o list\u0103 de BBCode", MSGDEFSITE:"Infrant...", MSGLOSSITE:"Pierderi...", MSGASATT:"...ca atacator", MSGASDEF:"...ca ap\u0103r\u0103tor", MSGDIFF1:"nu arat\u0103 diferen\u021bele", MSGDIFF2:"arat\u0103 diferen\u021bele", MSGDIFF3:"arat\u0103 doar diferen\u021bele", BBCODELIMIT:"Din cauza spa\u021biului limitat pentru text \u00eentr-o postare, \u00een cazul unei liste lungi, informa\u021bia a fost impar\u021bit\u0103 pe grupe. Fiecare grup\u0103 este separat\u0103.", 
  CHKPOWERNAME:"Arat\u0103 timpul r\u0103mas p\u00e2n\u0103 la folosirea vr\u0103jii", CHKNIGHTNAME:"Ascunde orasul in bonusul de noapte", CHKFORUMTABS:"Aranjeaz\u0103 tab-urile de pe forum pe mai multe r\u00e2nduri", BTNRESERVE:"Booking", LNKRESERVE:"Reservations", LBLGETRESER:"No\u0163iuni de baz\u0103 de date ...", BTNCHECK:"Checking reservations", CHKCMDIMG:"View the icons for the destination city commands", STATSLINK:"Statistici de afi\u0219at", BTNSUPPLAYERS:"Lista juc\u0103torilor", CHKUNITSCOST:"Afi\u0219area costurilor unit\u0103\u021bilor pierdute \u00een raport", 
  CHKOCEANNUMBER:"Arat\u0103 num\u0103rul m\u0103rii", MSGRTCSTIME:"Timp Nava Colonizare", MSGRTGOD:"Zeu", MSGRTNO:"Nu", MSGRTYES:"Da", MSGRTONLINE:"Vei fi online in timpul revoltei rosii? ", MSGRTSHOW:"Adauga informatii despre revolta in curs de desfasurare", MSGRTLBL:"Informa\u021bia despre revolt\u0103", MSGRTERR:"E\u0219ti \u00een orasul gre\u0219it!<br/>Pentru a crea informa\u021bia pentru revolt\u0103, mergi te rog la ora\u0219ul: ", BBHTML:"versiunea tabelat\u0103", BBTEXT:"versiunea text", 
  MSG413ERR:"<h3>Raportul generat este prea mare.</h3><p>Folose\u0219te op\u021biunile valabile \u0219i reduse pentru a publica f\u0103r\u0103 probleme.</p>", CHKREPORTFORMAT:"Genereaz\u0103 rapoarte folosind tabele", WALLNOTSAVED:"Zidul nu a fost salvat", WALLSAVED:"Zidul a fost salvat", POPRECRUNITTRADE:"click, ca s\u0103 folose\u0219ti resursele necesare pentru recrutarea unit\u0103\u021bii selectate", ABH:{WND:{WINDOWTITLE:"GRCRTools Ajutor Creator Armata", UNITFRAME:"alege-ti unitatea", DESCRIPTION1:"In acest oras ai [population] populatie libera", 
  DESCRIPTION2:"Care este suficienta pentru a construi [max_units]", DESCRIPTION3:"Tu [yesno] ai cercetat [research].", DESCRIPTION4:"Poti sa adaugi in coada [max_queue] unitati", TARGET:"alege constructia", PACKAGE:"pachet de resurse pe expediere", BTNSAVE:"salveaza setarile", TOOLTIPOK:"click pentru a seta o unitate prestabilita pentru care vei trimite resurse", TOOLTIPNOTOK:"unitatile nu au fost cercetate", HASRESEARCH:"Fa", NORESEARCH:"Nu face", SETTINGSAVED:"Setarile pentru [city] au fost salvate", 
  }, RESWND:{RESLEFT:"resurse ramase pentru trimitere", IMGTOOLTIP:"click pentru a completa cu resurse", }, }, POPSOUNDURL:"Calea url a fi\u0219ierului cu sunet", POPSOUNDSTOP:"Nu asculta", POPSOUNDPLAY:"Ascult\u0103 cu set\u0103rile curente", POPSOUNDMUTE:"\u00cenchide sunetul", POPSOUNDLOOP:"Ascult\u0103 \u00een bucl\u0103", CHKSOUNDLOOP:"bucl\u0103", SOUNDVOLUME:"Volum", SOUNDURL:"Sunetul fi\u0219ierului url", CHKSOUNDMUTE:"Mut", SOUNDSETTINGS:"Set\u0103ri pentru sunet", POPDISABLEALARM:"Dezactiveaz\u0103 alarma", 
  MSGCOPYREPORT:"Raportul a fost salvat. Te rog d\u0103 click [lipire_icon] pe forumuri sau pe noile mesaje din fereastra pentru lipire", POPINSERTLASTREPORT:"Lipe\u0219te ultimul raport convertit", NEWVERSION:{AVAILABLE:"O noua versiune este disponibila", INSTALL:"Instaleaza", REMINDER:"Adu-mi aminte mai tarziu", REQRELOAD:"Reimprospatare nececsara", RELOAD:"Reimprospateaza", }, LANGS:{LANG:"Traducere limba:", SEND:"Trimite catre editori", SAVE:"Salveaza si testeaza", RESET:"Seteaza limba prestabilita", 
  REMOVE:"Sterge traducerea", }, HELPTAB5:"Traducere", EMOTS:{LABEL:"Doresti mai multe emoticonuri?", MESS:"Lipeste link-ul catre emoticon, fiecare pe o noua linie", }, COMMAND:{ALL:"toate", INCOMING:"vine", OUTGOING:"pleaca", RETURNING:"se intoarce", FORTOWN:"oras:", }, CHKWONDERTRADE:"Cand se trimit resurse pentru minunile lumii, se trimit cantitati maxime si egale de resurse", MOBILEVERSION:"Versiunea mobila", AO:{TITLE:"Prezentare general\u0103 a Academiilor", }, CHKOLDTRADE:"Foloseste configuratia veche pentru negot", 
  TSL:{WND:{TOOLTIP:"arata orasele sortate", WINDOWTITLE:"Lista Sortata a Oraselor", }, }, QUESTION:"Intrebare", WALL:{WANTDELETECURRENT:"Doresti sa stergi inregistrarile curente ale zidului?", DELETECURRENT:"Sterge inregistrarile curente", LISTSTATE:"Conditia zidului in ziua", LISTSAVED:"Salvat pe zid in ziu", }, RADAR:{ALL:"Orice oras", BTNSAVEDEFAULT:"Salveaza valorile ca implicite", TOWNPOINTS:"Puncte minime pe oras", TOWNRESERVED:"Rezervare", TOWNOWNER:"Detinator", CSTIME:"Timp Nava de Colonizare", 
  BTNFIND:"Cauta", TOWNNAME:"Oras", MAXCSTIME:"Timp maxim nava de colonizare", FIND:"Cauta", TOWNFINDER:"Cauta orase", }, POPSOUNDEG:"exemplu: https://www.youtube.com/watch?v=v2AC41dglnM, https://youtu.be/v2AC41dglnM, http://www.freesfx.co.uk/rx2/mp3s/10/11532_1406234695.mp3", MSGSHOWCOST:"Costul unitatilor pierdute", LASTUPDATE:"1487507969523", };
  this.ru = {AUTHOR:"Goland70, CTPEC, Aitery, Sporeman4, wenavit, Vlad- K., \u0422\u0435\u0440\u0440\u043e", BTNCONV:"\u041a\u043e\u043d\u0432\u0435\u0440\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c", BTNGENER:"\u0413\u0435\u043d\u0435\u0440\u0438\u0440\u043e\u0432\u0430\u0442\u044c", BTNVIEW:"\u041f\u0440\u0435\u0434\u043e\u0441\u043c\u043e\u0442\u0440", BTNSAVE:"\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c", MSGTITLE:"\u041f\u0440\u0435\u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u044c \u043e\u0442\u0447\u0435\u0442", 
  MSGQUEST:"\u041a\u0430\u043a\u0438\u0435 \u0438\u0437 \u0434\u0430\u043d\u043d\u044b\u0445 \u0432\u044b \u0445\u043e\u0442\u0438\u0442\u0435 \u043e\u043f\u0443\u0431\u043b\u0438\u043a\u043e\u0432\u0430\u0442\u044c?", MSGBBCODE:"\u041f\u043e\u0441\u043b\u0435 \u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u0438 \u0434\u043e\u043a\u043b\u0430\u0434\u0430, \u0432\u044b \u043c\u043e\u0436\u0435\u0442\u0435 \u0441\u0438\u043d\u0445\u0440\u043e\u043d\u0438\u0437\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0435\u0433\u043e \u0441 \u043d\u043e\u0432\u043e\u0441\u0442\u044f\u043c\u0438 \u0438 \u0444\u043e\u0440\u0443\u043c\u0430\u0445, \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u044f BB-\u043a\u043e\u0434\u044b.", 
  MSGRESOURCE:"\u0414\u043e\u0431\u044b\u0447\u0430", MSGUNITS:"\u0411\u043e\u0435\u0432\u044b\u0435 \u0435\u0434\u0438\u043d\u0438\u0446\u044b", MSGBUILD:"\u0417\u0434\u0430\u043d\u0438\u044f", MSGUSC:"\u0418\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d\u043e \u0441\u0435\u0440\u0435\u0431\u0440\u044f\u043d\u044b\u0445 \u043c\u043e\u043d\u0435\u0442", MSGRAW:"\u0421\u044b\u0440\u044c\u0435", SUPPORT:"\u041f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0430", SPY:"\u0428\u043f\u0438\u043e\u043d\u0430\u0436", 
  CONQUER:"\u0417\u0430\u0432\u043e\u0435\u0432\u0430\u043d\u043d\u044b\u0439", LOSSES:"\u041f\u043e\u0442\u0435\u0440\u0438", HIDDEN:"\u0421\u043a\u0440\u044b\u0442\u044b\u0439", NOTUNIT:"[i]\u041d\u0438 \u043e\u0434\u0438\u043d[/i]", TOWN:"[i]\u0413\u043e\u0440\u043e\u0434:[/i] ", PLAYER:"[i]\u0418\u0433\u0440\u043e\u043a:[/i] ", ALLY:"[i]\u0421\u043e\u044e\u0437\u043d\u0438\u043a:[/i] ", CAST:"\u0411\u0440\u043e\u0441\u043e\u043a:", ONTOWER:"\u0412 \u0433\u043e\u0440\u043e\u0434\u0435:", MSGHIDAD:"\u0421\u043a\u0440\u044b\u0442\u044c \u0433\u043e\u0440\u043e\u0434", 
  MSGFORUM:"\u041e\u0442\u0447\u0451\u0442 \u0431\u0443\u0434\u0435\u0442 \u043e\u043f\u0443\u0431\u043b\u0438\u043a\u043e\u0432\u0430\u043d", BBALLY:"\u0424\u043e\u0440\u0443\u043c\u044b \u0430\u043b\u044c\u044f\u043d\u0441\u0430 / \u0432 \u0441\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0438", BBFORUM:"\u0432\u043d\u0435\u0448\u043d\u0438\u0439 \u0444\u043e\u0440\u0443\u043c", ICOCLOSE:"\u0417\u0430\u043a\u0440\u044b\u0442\u044c", ICOHELP:"\u041e \u043f\u0440\u0435\u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u0435", 
  MSGPREVIEW:"<b>\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 \u043e\u0442\u0447\u0451\u0442\u0430</b>", HELPTAB1:"\u041e \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u0438", HELPTAB2:"\u041a\u0430\u043a \u044d\u0442\u043e \u0440\u0430\u0431\u043e\u0442\u0430\u0435\u0442", HELPTAB3:"\u0418\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u044f", HELPTAB4:"\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438", MSGHUMAN:{OK:"\u0418\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f \u0431\u044b\u043b\u0430 \u0441\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u0430", 
  ERROR:"\u041f\u0440\u043e\u0438\u0437\u043e\u0448\u043b\u0430 \u043e\u0448\u0438\u0431\u043a\u0430 \u043f\u0440\u0438 \u0437\u0430\u043f\u0438\u0441\u0438", YOUTUBEERROR:"\u041d\u0435\u0432\u0435\u0440\u043d\u0430\u044f \u0441\u0441\u044b\u043b\u043a\u0430, \u0438\u043b\u0438 \u0432\u0438\u0434\u0435\u043e \u043d\u0435 \u0440\u0430\u0437\u0440\u0435\u0448\u0435\u043d\u043e \u043e\u0442\u043a\u0440\u044b\u0432\u0430\u0442\u044c \u0432\u043d\u0435 \u0441\u0430\u0439\u0442\u0430 YouTube.com", }, LABELS:{attack:{ATTACKER:"\u0410\u0442\u0430\u043a\u0430", 
  DEFENDER:"\u041e\u0431\u043e\u0440\u043e\u043d\u0430", MSGHIDAT:"\u0430\u0442\u0430\u043a\u0430", MSGHIDDE:"\u043e\u0431\u043e\u0440\u043e\u043d\u0430", MSGATTUNIT:"\u0412\u043e\u0439\u0441\u043a\u0430 \u0430\u0442\u0430\u043a\u0430", MSGDEFUNIT:"\u0412\u043e\u0439\u0441\u043a\u0430 \u043e\u0431\u043e\u0440\u043e\u043d\u0430", }, support:{ATTACKER:"\u041f\u043e\u0434\u043a\u0440\u0435\u043f\u043b\u0435\u043d\u0438\u0435", DEFENDER:"\u041f\u043e\u0434\u0434\u0435\u0440\u0436\u0430\u043d\u043d\u044b\u0439", 
  MSGHIDAT:"\u043f\u043e\u0434\u043a\u0440\u0435\u043f\u043b\u0435\u043d\u0438\u0435", MSGHIDDE:"\u043f\u043e\u0434\u0434\u0435\u0440\u0436\u0430\u043d\u043d\u044b\u0439", MSGATTUNIT:"\u0412\u043e\u0439\u0441\u043a\u0430 \u043f\u043e\u0434\u043a\u0435\u043f\u043b\u0435\u043d\u0438\u0435", MSGDEFUNIT:"\u0412\u043e\u0439\u0441\u043a\u0430 \u043e\u0431\u043e\u0440\u043e\u043d\u0430", }, espionage:{ATTACKER:"\u0428\u043f\u0438\u043e\u043d", DEFENDER:"\u0428\u043f\u0438\u043e\u043d\u044f\u0449\u0438\u0439", 
  MSGHIDAT:"\u0448\u043f\u0438\u043e\u043d", MSGHIDDE:"\u0448\u043f\u0438\u043e\u043d\u044f\u0449\u0438\u0439", MSGATTUNIT:"", MSGDEFUNIT:"", }, }, MSGDETAIL:"\u043f\u043e\u0434\u0440\u043e\u0431\u043d\u0435\u0435 \u043e \u043a\u043e\u043c\u0430\u043d\u0434\u0435", MSGRETURN:"(\u041e\u0431\u0440\u0430\u0442\u043d\u043e)", MSGGENBBCODE:"\u041f\u0440\u0435\u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u044c \u0411\u0411-\u043a\u043e\u0434", MSGDEFSITE:"\u041f\u043e\u0432\u0435\u0440\u0436\u0435\u043d\u043e...", 
  MSGLOSSITE:"\u041f\u043e\u0442\u0435\u0440\u0438...", MSGASATT:"...\u0432 \u043d\u0430\u043f\u0430\u0434\u0435\u043d\u0438\u0438", MSGASDEF:"...\u0432 \u043e\u0431\u043e\u0440\u043e\u043d\u0435", MSGDIFF1:"\u043d\u0435 \u043f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0442\u044c \u0440\u0430\u0437\u043b\u0438\u0447\u0438\u044f", MSGDIFF2:"\u043f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0442\u044c \u0440\u0430\u0437\u043b\u0438\u0447\u0438\u044f", MSGDIFF3:"\u043f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0442\u044c \u0442\u043e\u043b\u044c\u043a\u043e \u0440\u0430\u0437\u043b\u0438\u0447\u0438\u044f", 
  BBCODELIMIT:"\u0412\u0432\u0438\u0434\u0443 \u043e\u0433\u0440\u0430\u043d\u0438\u0447\u0435\u043d\u043d\u043e\u0433\u043e \u043e\u0431\u044a\u0435\u043c\u0430 \u0442\u0435\u043a\u0441\u0442\u0430 \u0432 \u043e\u0434\u043d\u043e\u043c \u0441\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0438, \u0432 \u0441\u043b\u0443\u0447\u0430\u0435 \u0434\u043b\u0438\u043d\u043d\u043e\u0433\u043e \u0441\u043f\u0438\u0441\u043a\u0430, \u0434\u0430\u043d\u043d\u044b\u0435 \u0431\u044b\u043b\u0438 \u0440\u0430\u0437\u0434\u0435\u043b\u0435\u043d\u044b \u043d\u0430 \u0433\u0440\u0443\u043f\u043f\u044b. \u041a\u0430\u0436\u0434\u0443\u044e \u0433\u0440\u0443\u043f\u043f\u0443 \u0432\u0441\u0442\u0430\u0432\u044c\u0442\u0435 \u043a\u0430\u043a \u043e\u0442\u0434\u0435\u043b\u044c\u043d\u044b\u0439 \u044d\u043b\u0435\u043c\u0435\u043d\u0442.", 
  CHKPOWERNAME:"\u041f\u043e\u043a\u0430\u0437 \u0432\u0440\u0435\u043c\u0435\u043d\u0438, \u043e\u0441\u0442\u0430\u0432\u0448\u0435\u0435\u0441\u044f \u0434\u043e \u0432\u043e\u0437\u043c\u043e\u0436\u043d\u043e\u0441\u0442\u0438 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d\u0438\u044f \u0437\u0430\u043a\u043b\u0438\u043d\u0430\u043d\u0438\u044f", CHKFORUMTABS:"\u0417\u0430\u043c\u0435\u043d\u0438\u0442\u044c \u043f\u0440\u043e\u043a\u0440\u0443\u0447\u0438\u0432\u0430\u043d\u0438\u0435 \u0442\u0435\u043c \u043d\u0430 \u0444\u043e\u0440\u0443\u043c\u0435 \u043d\u0430 \u043d\u0435\u0441\u043a\u043e\u043b\u044c\u043a\u043e \u0441\u0442\u0440\u043e\u043a", 
  STATSLINK:"\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043a\u0430 \u0441 \u044d\u043a\u0440\u0430\u043d\u0430", BTNSUPPLAYERS:"\u0421\u043f\u0438\u0441\u043e\u043a \u0438\u0433\u0440\u043e\u043a\u043e\u0432", CHKUNITSCOST:"\u041e\u0442\u0447\u0435\u0442, \u043f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u044e\u0449\u0438\u0439 \u0441\u0442\u043e\u0438\u043c\u043e\u0441\u0442\u044c \u043f\u043e\u0442\u0435\u0440\u044f\u043d\u043d\u044b\u0445 \u0435\u0434\u0438\u043d\u0438\u0446", CHKOCEANNUMBER:"\u041f\u043e\u043a\u0430\u0437 \u043d\u043e\u043c\u0435\u0440\u0430 \u043e\u043a\u0435\u0430\u043d\u0430", 
  MSGRTLBL:"\u0418\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f \u043e \u0432\u043e\u0441\u0441\u0442\u0430\u043d\u0438\u0438", MSGRTSHOW:"\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0442\u0435\u043a\u0443\u0449\u0443\u044e \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044e \u0432\u043e\u0441\u0441\u0442\u0430\u043d\u0438\u0435", MSGRTONLINE:"\u0421\u043e\u0431\u0438\u0440\u0430\u0435\u0442\u0435\u0441\u044c \u043b\u0438 \u0432\u044b \u0431\u044b\u0442\u044c \u0432 \u0441\u0435\u0442\u0438 \u0432\u043e \u0432\u0440\u0435\u043c\u044f \u0431\u0443\u043d\u0442\u0430?", 
  MSGRTYES:"\u0414\u0430", MSGRTNO:"\u041d\u0435\u0442", MSGRTGOD:"\u0411\u043e\u0433", MSGRTCSTIME:"\u041a\u041a \u0432\u0440\u0435\u043c\u044f", MSGRTONL:"\u043e\u043d\u043b\u0430\u0439\u043d?", MSGRTERR:"\u0412\u044b \u043d\u0430\u0445\u043e\u0434\u0438\u0442\u0435\u0441\u044c \u043d\u0435 \u0432 \u0442\u043e\u043c \u0433\u043e\u0440\u043e\u0434\u0435!<br/>\u0427\u0442\u043e\u0431\u044b \u0441\u043e\u0437\u0434\u0430\u0442\u044c \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044e \u043e \u0431\u0443\u043d\u0442\u0435, \u043f\u0435\u0440\u0435\u0439\u0434\u0438\u0442\u0435 \u0432 \u0433\u043e\u0440\u043e\u0434: ", 
  BBTEXT:"\u0442\u0435\u043a\u0441\u0442\u043e\u0432\u0430\u044f \u0432\u0435\u0440\u0441\u0438\u044f", BBHTML:"\u0442\u0430\u0431\u043b\u0438\u0447\u043d\u0430\u044f \u0432\u0435\u0440\u0441\u0438\u044f", MSG413ERR:"<h3> \u0421\u043e\u043e\u0437\u0434\u0430\u043d\u043d\u044b\u0439 \u043e\u0442\u0447\u0435\u0442 \u044f\u0432\u043b\u044f\u0435\u0442\u0441\u044f \u0441\u043b\u0438\u0448\u043a\u043e\u043c \u0431\u043e\u043b\u044c\u0448\u0438\u043c. </ h3> <p> \u0418\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0439\u0442\u0435 \u0434\u043e\u0441\u0442\u0443\u043f\u043d\u044b\u0435 \u043e\u043f\u0446\u0438\u0438 \u0438 \u0443\u043c\u0435\u043d\u044c\u0448\u0438\u0442\u0435 \u043e\u0442\u0447\u0451\u0442 \u0434\u043b\u044f \u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u0438 \u0431\u0435\u0437 \u043f\u0440\u043e\u0431\u043b\u0435\u043c. </p>", 
  CHKREPORTFORMAT:"\u0421\u043e\u0437\u0434\u0430\u0432\u0430\u0442\u044c \u043e\u0442\u0447\u0451\u0442\u044b \u0441 \u043f\u043e\u043c\u043e\u0449\u044c\u044e \u0442\u0430\u0431\u043b\u0438\u0446", WALLNOTSAVED:"\u0421\u0442\u0435\u043d\u0430 \u043d\u0435 \u0441\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u0430", WALLSAVED:"\u0421\u0442\u0435\u043d\u0430 \u0441\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u0430", POPSELRECRUNIT:"\u043d\u0430\u0436\u043c\u0438\u0442\u0435, \u0447\u0442\u043e\u0431\u044b \u0432\u044b\u0431\u0440\u0430\u0442\u044c \u043f\u0440\u043e\u0438\u0437\u0432\u043e\u0434\u0441\u0442\u0432\u043e \u043f\u043e \u0443\u043c\u043e\u043b\u0447\u0430\u043d\u0438\u044e", 
  POPRECRUNITTRADE:"\u043d\u0430\u0436\u043c\u0438\u0442\u0435, \u0447\u0442\u043e\u0431\u044b \u0437\u0430\u043f\u043e\u043b\u043d\u0438\u0442\u044c \u0440\u0435\u0441\u0443\u0440\u0441\u0430\u043c\u0438, \u043d\u0435\u043e\u0431\u0445\u043e\u0434\u0438\u043c\u044b\u043c\u0438 \u0434\u043b\u044f \u043d\u0430\u0439\u043c\u0430 \u0432\u044b\u0431\u0440\u0430\u043d\u043d\u043e\u0439 \u0431\u043e\u0435\u0432\u043e\u0439 \u0435\u0434\u0438\u043d\u0438\u0446\u044b", POPINSERTLASTREPORT:"\u0412\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u043f\u043e\u0441\u043b\u0435\u0434\u043d\u0438\u0439 \u043f\u0440\u0435\u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u043d\u043d\u044b\u0439 \u043e\u0442\u0447\u0435\u0442", 
  MSGCOPYREPORT:"\u041e\u0442\u0447\u0451\u0442 \u0441\u043e\u0445\u0440\u0430\u043d\u0435\u043d. \u041f\u043e\u0436\u0430\u043b\u0443\u0439\u0441\u0442\u0430, \u043d\u0430\u0436\u043c\u0438\u0442\u0435 [paste_icon] \u043d\u0430 \u0444\u043e\u0440\u0443\u043c\u0430\u0445 \u0438\u043b\u0438 \u043e\u043a\u043d\u0435 \u043d\u043e\u0432\u043e\u0433\u043e \u0441\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u044f, \u0447\u0442\u043e\u0431\u044b \u0432\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u0435\u0433\u043e", 
  POPDISABLEALARM:"\u041e\u0442\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u0441\u0438\u0433\u043d\u0430\u043b \u0442\u0440\u0435\u0432\u043e\u0433\u0438", SOUNDSETTINGS:"\u0417\u0432\u0443\u043a\u043e\u0432\u044b\u0435 \u043d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438", CHKSOUNDMUTE:"\u0411\u0435\u0437 \u0437\u0432\u0443\u043a\u0430", SOUNDVOLUME:"\u0413\u0440\u043e\u043c\u043a\u043e\u0441\u0442\u044c", SOUNDURL:"\u0417\u0432\u0443\u043a\u043e\u0432\u043e\u0439 \u0444\u0430\u0439\u043b URL", 
  CHKSOUNDLOOP:"\u041f\u043e\u0432\u0442\u043e\u0440", POPSOUNDLOOP:"\u0418\u0433\u0440\u0430\u0442\u044c \u043f\u043e \u043a\u0440\u0443\u0433\u0443", POPSOUNDMUTE:"\u0411\u0435\u0437 \u0437\u0432\u0443\u043a\u0430", POPSOUNDPLAY:"\u0418\u0433\u0440\u0430 \u0441 \u0442\u0435\u043a\u0443\u0449\u0438\u043c\u0438 \u043f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u0430\u043c\u0438 \u043d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438", POPSOUNDSTOP:"\u041e\u0441\u0442\u0430\u043d\u043e\u0432\u0438\u0442\u044c", 
  POPSOUNDURL:"\u0410\u0434\u0440\u0435\u0441 \u043f\u0443\u0442\u044c \u043a \u0444\u0430\u0439\u043b\u0443 \u0441\u043e \u0437\u0432\u0443\u043a\u043e\u043c", STATS:{PLAYER:"\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043a\u0430 \u0438\u0433\u0440\u043e\u043a\u0430", ALLY:"\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043a\u0430 \u0441\u043e\u044e\u0437\u0430", TOWN:"\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043a\u0430 \u0433\u043e\u0440\u043e\u0434\u0430", INACTIVEDESC:"\u0417\u0430 \u044d\u0442\u043e \u0432\u0440\u0435\u043c\u044f \u043d\u0435 \u0431\u044b\u043b\u043e \u043f\u043e\u043b\u0443\u0447\u0435\u043d\u043e \u0431\u043e\u0435\u0432\u044b\u0445 \u043e\u0447\u043a\u043e\u0432  \u0438\u043b\u0438 \u043e\u0447\u043a\u043e\u0432 \u0440\u0430\u0437\u0432\u0438\u0442\u0438\u044f", 
  CHKINACTIVE:"\u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c \u043d\u0435\u0430\u043a\u0442\u0438\u0432\u043d\u044b\u0445 \u0438\u0433\u0440\u043e\u043a\u043e\u0432", INACTIVE:"\u041d\u0435\u0430\u043a\u0442\u0438\u0432\u0435\u043d", }, ABH:{WND:{WINDOWTITLE:"\u041f\u043e\u043c\u043e\u0448\u043d\u0438\u043a \u041d\u0430\u0439\u043c\u0430 \u0410\u0440\u043c\u0438\u0438", UNITFRAME:"\u0412\u044b\u0431\u0440\u0430\u0442\u044c \u0432\u0438\u0434 \u0432\u043e\u0439\u0441\u043a", DESCRIPTION1:"\u0412 \u044d\u0442\u043e\u043c \u0433\u043e\u0440\u043e\u0434\u0435, \u0443 \u0432\u0430\u0441 \u0435\u0441\u0442\u044c [population] \u0441\u0432\u043e\u0431\u043e\u0434\u043d\u043e\u0433\u043e \u043d\u0430\u0441\u0435\u043b\u0435\u043d\u0438\u044f.", 
  DESCRIPTION2:"\u0414\u043e\u0441\u0442\u0430\u0442\u043e\u0447\u043d\u043e, \u0447\u0442\u043e\u0431\u044b \u043f\u043e\u0441\u0442\u0440\u043e\u0438\u0442\u044c [max_units]", DESCRIPTION3:"\u0423 \u0432\u0430\u0441 [yesno] \u0438\u0441\u0441\u043b\u0435\u0434\u043e\u0432\u0430\u043d\u043e [research].", DESCRIPTION4:"\u0412\u044b \u043c\u043e\u0436\u0435\u0442\u0435 \u043f\u043e\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u0432 \u043e\u0447\u0435\u0440\u0435\u0434\u044c [max_queue] \u0435\u0434\u0438\u043d\u0438\u0446(\u0443)", 
  TARGET:"\u0412\u044b\u0431\u0440\u0430\u0442\u044c \u043c\u0430\u043a\u0441\u0438\u043c\u0430\u043b\u044c\u043d\u0443\u044e \u0446\u0435\u043b\u044c \u043d\u0430\u0439\u043c\u0430 (\u043a\u043e\u043b\u0438\u0447\u0435\u0441\u0442\u0432\u043e \u043d\u0435\u0431\u0445\u043e\u0434\u0438\u043c\u044b\u0445 \u0431\u043e\u0435\u0432\u044b\u0445 \u0435\u0434\u0438\u043d\u0438\u0446)", PACKAGE:"\u041e\u0442\u043f\u0440\u0430\u0432\u043a\u0430 \u0440\u0435\u0441\u0443\u0440\u0441\u043e\u0432 \u0434\u043b\u044f \u0441\u043e\u0437\u0434\u0430\u043d\u0438\u044f(\u0435\u0434.)", 
  BTNSAVE:"\u0441\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u043d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438", TOOLTIPOK:"\u043d\u0430\u0436\u043c\u0438\u0442\u0435, \u0447\u0442\u043e\u0431\u044b \u0432\u044b\u0431\u0440\u0430\u0442\u044c \u0432\u0438\u0434 \u0432\u043e\u0439\u0441\u043a \u043f\u043e \u0443\u043c\u043e\u043b\u0447\u0430\u043d\u0438\u044e, \u0434\u043b\u044f \u043a\u043e\u0442\u043e\u0440\u043e\u0433\u043e \u0431\u0443\u0434\u0443\u0442 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d\u044b \u0440\u0435\u0441\u0443\u0440\u0441\u044b", 
  TOOLTIPNOTOK:"\u041d\u0435 \u0438\u0441\u043b\u0435\u0434\u043e\u0432\u0430\u043d", HASRESEARCH:"\u0414\u0430", NORESEARCH:"\u041d\u0435 \u043d\u0430\u0434\u043e", SETTINGSAVED:"\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438 \u0434\u043b\u044f [city] \u0441\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u044b", }, RESWND:{RESLEFT:"\u0440\u0435\u0441\u0443\u0440\u0441\u043e\u0432 \u043e\u0441\u0442\u0430\u043b\u043e\u0441\u044c \u043e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c", IMGTOOLTIP:"\u043d\u0430\u0436\u043c\u0438\u0442\u0435, \u0447\u0442\u043e\u0431\u044b \u0437\u0430\u043f\u043e\u043b\u043d\u0438\u0442\u044c \u0440\u0435\u0441\u0443\u0440\u0441\u0430\u043c\u0438", 
  }, }, NEWVERSION:{AVAILABLE:"\u0414\u043e\u0441\u0442\u0443\u043f\u043d\u0430 \u043d\u043e\u0432\u0430\u044f \u0432\u0435\u0440\u0441\u0438\u044f", INSTALL:"\u0423\u0441\u0442\u0430\u043d\u043e\u0432\u0438\u0442\u044c", REMINDER:"\u041d\u0430\u043f\u043e\u043c\u043d\u0438\u0442\u044c \u043f\u043e\u0437\u0436\u0435", REQRELOAD:"\u0422\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044f \u043e\u0431\u043d\u043e\u0432\u043b\u0435\u043d\u0438\u0435", RELOAD:"\u041e\u0431\u043d\u043e\u0432\u043b\u0435\u043d\u0438\u0435", 
  }, LANGS:{LANG:"\u041f\u0435\u0440\u0435\u0432\u043e\u0434 \u0434\u043b\u044f \u044f\u0437\u044b\u043a\u0430:", SEND:"\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c \u0434\u043b\u044f \u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u0438", SAVE:"\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u0438 \u043f\u0440\u043e\u0432\u0435\u0440\u0438\u0442\u044c", RESET:"\u0412\u0435\u0440\u043d\u0443\u0442\u044c \u044f\u0437\u044b\u043a \u043f\u043e \u0443\u043c\u043e\u043b\u0447\u0430\u043d\u0438\u044e", 
  REMOVE:"\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0441\u0432\u043e\u0439 \u043f\u0435\u0440\u0435\u0432\u043e\u0434?", }, HELPTAB5:"\u041f\u0435\u0440\u0435\u0432\u043e\u0434", BTNSIMUL:"\u0421\u0438\u043c\u0443\u043b\u044f\u0442\u043e\u0440", EMOTS:{LABEL:"\u0412\u044b \u0445\u043e\u0442\u0438\u0442\u0435 \u0431\u043e\u043b\u044c\u0448\u0435 \u0441\u043c\u0430\u0439\u043b\u043e\u0432?", MESS:"\u0412\u0441\u0442\u0430\u0432\u044c\u0442\u0435 \u0441\u0441\u044b\u043b\u043a\u0438 \u043d\u0430 \u0441\u043c\u0430\u0439\u043b\u044b, \u043a\u0430\u0436\u0434\u0443\u044e \u0432 \u043d\u043e\u0432\u043e\u0439 \u0441\u0442\u0440\u043e\u043a\u0435", 
  }, COMMAND:{ALL:"\u0412\u0441\u0435", INCOMING:"\u043d\u0430 \u0432\u0430\u0441", OUTGOING:"\u043e\u0442 \u0432\u0430\u0441", RETURNING:"\u0432\u043e\u0437\u0432\u0440\u0430\u0449\u0430\u044e\u0449\u0438\u0435\u0441\u044f", FORTOWN:"\u0433\u043e\u0440\u043e\u0434:", }, CHKWONDERTRADE:"\u041a\u043e\u0433\u0434\u0430 \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u044f\u044e\u0442\u0441\u044f \u0440\u0435\u0441\u0443\u0440\u0441\u044b \u043d\u0430 \u0427\u0443\u0434\u0435\u0441\u0430 \u0421\u0432\u0435\u0442\u0430, \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u044f\u0442\u044c \u043c\u0430\u043a\u0441\u0438\u043c\u0430\u043b\u044c\u043d\u043e\u0435 \u043a\u043e\u043b\u0438\u0447\u0435\u0441\u0442\u0432\u043e \u0438\u0437 \u0432\u043e\u0437\u043c\u043e\u0436\u043d\u043e\u0433\u043e", 
  MOBILEVERSION:"\u041c\u043e\u0431\u0438\u043b\u044c\u043d\u0430\u044f \u0432\u0435\u0440\u0441\u0438\u044f", AO:{TITLE:"\u041e\u0431\u0437\u043e\u0440 \u0410\u043a\u0430\u0434\u0435\u043c\u0438\u0438", }, CHKOLDTRADE:"\u0418\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u044c \u0441\u0442\u0430\u0440\u044b\u0435 \u043d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438", TSL:{WND:{TOOLTIP:"\u043f\u043e\u043a\u0430\u0437\u0430\u0442\u044c \u043e\u0442\u0441\u043e\u0440\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u044b\u0435 \u0433\u043e\u0440\u043e\u0434", 
  WINDOWTITLE:"\u041e\u0442\u0441\u043e\u0440\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u044b\u0439 \u0441\u043f\u0438\u0441\u043e\u043a \u0433\u043e\u0440\u043e\u0434\u0430", }, }, QUESTION:"\u0412\u043e\u043f\u0440\u043e\u0441", WALL:{WANTDELETECURRENT:"\u0412\u044b \u0445\u043e\u0442\u0438\u0442\u0435 \u0443\u0434\u0430\u043b\u0438\u0442\u044c \u0442\u0435\u043a\u0443\u0449\u0443\u044e \u0437\u0430\u043f\u0438\u0441\u044c \u0441\u043e \u0441\u0442\u0435\u043d\u044b?", DELETECURRENT:"\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0442\u0435\u043a\u0443\u0449\u0443\u044e \u0437\u0430\u043f\u0438\u0441\u044c", 
  LISTSTATE:"\u0421\u043e\u0441\u0442\u043e\u044f\u043d\u0438\u0435 \u0441\u0442\u0435\u043d\u044b \u043d\u0430 \u0434\u0435\u043d\u044c", LISTSAVED:"\u0421\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u043d\u044b\u0439 \u043d\u0430 \u0441\u0442\u0435\u043d\u0435 \u0434\u0435\u043d\u044c", }, RADAR:{ALL:"\u041b\u044e\u0431\u043e\u0439 \u0433\u043e\u0440\u043e\u0434", BTNSAVEDEFAULT:"\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u0437\u043d\u0430\u0447\u0435\u043d\u0438\u044f \u043f\u043e \u0443\u043c\u043e\u043b\u0447\u0430\u043d\u0438\u044e", 
  TOWNPOINTS:"\u041c\u0438\u043d\u0438\u043c\u0430\u043b\u044c\u043d\u044b\u0435 \u0442\u043e\u0447\u043a\u0438 \u0433\u043e\u0440\u043e\u0434", TOWNRESERVED:"\u0420\u0435\u0437\u0435\u0440\u0432\u0430\u0446\u0438\u044f", TOWNOWNER:"\u0412\u043b\u0430\u0434\u0435\u043b\u0435\u0446", CSTIME:"\u0412\u0440\u0435\u043c\u044f \u041a\u041a", TOWNNAME:"\u0413\u043e\u0440\u043e\u0434", BTNFIND:"\u041f\u043e\u0438\u0441\u043a", MAXCSTIME:"\u041c\u0430\u043a\u0441\u0438\u043c\u0430\u043b\u044c\u043d\u043e\u0435 \u0432\u0440\u0435\u043c\u044f \u041a\u041a", 
  FIND:"\u041f\u043e\u0438\u0441\u043a", TOWNFINDER:"\u041f\u043e\u0438\u0441\u043a \u0433\u043e\u0440\u043e\u0434\u043e\u0432", UNITTIME:"\u0412\u0440\u0435\u043c\u044f", }, POPSOUNDEG:"\u043f\u0440\u0438\u043c\u0435\u0440: https://www.youtube.com/watch?v=v2AC41dglnM, https://youtu.be/v2AC41dglnM, http://www.freesfx.co.uk/rx2/mp3s/10/11532_1406234695.mp3", BBIMG:"\u0415\u0434\u0438\u043d\u0441\u0442\u0432\u0435\u043d\u043d\u044b\u0439 \u043e\u0431\u0440\u0430\u0437 (\u043a\u0430\u0440\u0442\u0438\u043d\u043a\u0430)", 
  MSGSHOWCOST:"\u0417\u0430\u0442\u0440\u0430\u0442\u044b \u043d\u0430 \u043f\u043e\u0442\u0435\u0440\u044f\u043d\u043d\u044b\u0445 \u044e\u043d\u0438\u0442\u043e\u0432", BTNVIEWBB:"\u0411\u0411-\u043a\u043e\u0434\u044b", LASTUPDATE:"1488494068604", };
  this.sk = {AUTHOR:" , DragonKnight, jaro868, tekri, Aeris, ado329", BTNCONV:"Previes\u0165", BTNGENER:"Vytvori\u0165", BTNVIEW:"Uk\u00e1\u017eka", BTNSAVE:"Ulo\u017ei\u0165", MSGTITLE:"Previes\u0165 spr\u00e1vu", MSGQUEST:"Ktor\u00e9 z d\u00e1t chcete publikova\u0165?", MSGBBCODE:"Po zverejnen\u00ed spr\u00e1vy, m\u00f4\u017eete sp\u00e1rova\u0165 s novinkami a f\u00f3rom pomocou BBCode.", MSGRESOURCE:"Koris\u0165", MSGUNITS:"Jednotky", MSGBUILD:"Stavby", MSGUSC:"Pou\u017eit\u00fdch strieborn\u00fdch minc\u00ed", 
  MSGRAW:"Suroviny", SUPPORT:"Podpora", SPY:"\u0160pehovanie", CONQUER:"Zv\u00ed\u0165azil", LOSSES:"Straty", HIDDEN:"Skryt\u00e9", NOTUNIT:"[i]\u017eiadny[/i]", TOWN:"[i]Mesto:[/i] ", PLAYER:"[i]Hr\u00e1\u010d:[/i] ", ALLY:"[i]Spojenectvo:[/i] ", CAST:"obsadenie:", ONTOWER:"V meste:", MSGHIDAD:"Skryt\u00e9 mest\u00e1", MSGFORUM:"T\u00e1to spr\u00e1va bude zverejnen\u00e1", BBALLY:"spojeneck\u00e9 f\u00f3rum / v spr\u00e1ve", BBFORUM:"extern\u00e9 f\u00f3rum", ICOCLOSE:"Zavrie\u0165", ICOHELP:"O prevodn\u00edku", 
  MSGPREVIEW:"<b>Zobrazi\u0165 spr\u00e1vu</b>", HELPTAB1:"O ", HELPTAB2:"Ako to funguje", HELPTAB3:"Zmeny", HELPTAB4:"Nastavenia", MSGHUMAN:{OK:"Inform\u00e1cie boli ulo\u017een\u00e9", ERROR:"Vyskytla sa chyba pri p\u00edsan\u00fd", YOUTUBEERROR:"Nespr\u00e1vny link, alebo nieje povolen\u00e9 na prehr\u00e1vanie mimo youtube", }, LABELS:{attack:{ATTACKER:"Uto\u010dn\u00edk", DEFENDER:"Obranca", MSGHIDAT:"Uto\u010dn\u00edk", MSGHIDDE:"Obranca", MSGATTUNIT:"Uto\u010diaca arm\u00e1da", MSGDEFUNIT:"Obranuj\u00faca arm\u00e1da", 
  }, support:{ATTACKER:"Supporting", DEFENDER:"Supported", MSGHIDAT:"supporting", MSGHIDDE:"supported", MSGATTUNIT:"Army supporting", MSGDEFUNIT:"Army defenders", }, espionage:{ATTACKER:"\u0160pi\u00f3n", DEFENDER:"\u0160pehovan\u00fd", MSGHIDAT:"\u0160pi\u00f3n", MSGHIDDE:"\u0161pehovan\u00fd", MSGATTUNIT:"", MSGDEFUNIT:"", }, }, MSGDETAIL:"detaily pr\u00edkazu", MSGRETURN:"(sp\u00e4\u0165)", MSGGENBBCODE:"Vytvori\u0165 zoznam v BBCode", MSGDEFSITE:"Porazen\u00ed...", MSGLOSSITE:"Straty...", MSGASATT:"...ako \u00fato\u010dn\u00edk", 
  MSGASDEF:"...ako obranca", MSGDIFF1:"nezobrazi\u0165 rozdiely", MSGDIFF2:"zobrazi\u0165 rozdiely", MSGDIFF3:"zobrazi\u0165 iba rozdiely", BBCODELIMIT:"Vzh\u013eadom k obmedzen\u00e9mu mno\u017estvu textu v jednej spr\u00e1ve, v pr\u00edpade dlh\u00e9ho zoznamu, boli d\u00e1ta rozdelen\u00e1 do skup\u00edn. Ka\u017ed\u00fa skupinu vlo\u017ei\u0165 ako samostatn\u00fd vstup.", CHKPOWERNAME:"Zobrazenie zost\u00e1vaj\u00faceho \u010dasu na mo\u017enos\u0165 pou\u017eitia k\u00fazla", CHKFORUMTABS:"Vymeni\u0165 rolovanie zar\u00e1\u017eky na f\u00f3re multi line", 
  STATSLINK:"\u0160tatistiky z displeja", BTNSUPPLAYERS:"Zoznam hr\u00e1\u010dov", CHKUNITSCOST:"Spr\u00e1va zobrazuje n\u00e1klady straten\u00fdch jednotiek", CHKOCEANNUMBER:"Zobrazi\u0165 \u010d\u00edslo mora", MSGRTLBL:"Inform\u00e1cie o vzbure", MSGRTSHOW:"Prida\u0165 priebe\u017en\u00e9 inform\u00e1cie o odboji", MSGRTONLINE:"Chyst\u00e1\u0161 sa by\u0165 on-line v priebehu \u010dervenej vzbury?", MSGRTYES:"\u00c1no", MSGRTNO:"Nie", MSGRTGOD:"Boh", MSGRTCSTIME:"\u010cas OL", MSGRTONL:"on-line?", 
  MSGRTERR:"Ste v zlom meste <br/> Ak chcete vytvori\u0165 inform\u00e1cie o vzbure cho\u010fte do mesta !:", BBTEXT:"verzia s textom", BBHTML:"verzia s tabu\u013ekou", MSG413ERR:"<H3> generovan\u00e1 spr\u00e1va je pr\u00edli\u0161 ve\u013ek\u00e1. </h3><p> Pou\u017eite dostupn\u00e9 mo\u017enosti a zredukujte publikovan\u00e9 bez probl\u00e9mov. </p>", CHKREPORTFORMAT:"Vytvori\u0165 report pomocou tabuliek", WALLNOTSAVED:"Hradby nie s\u00fa ulo\u017een\u00e9", WALLSAVED:"Hradby s\u00fa ulo\u017een\u00e9", 
  POPSELRECRUNIT:"click, to select default production unit", POPRECRUNITTRADE:"click, to fill in resources needed to recruit selected unit", POPINSERTLASTREPORT:"Prilepi\u0165 posledne konvertovan\u00e9 hl\u00e1senie", MSGCOPYREPORT:"The report has been saved. Please click [paste_icon] on forums or new message window to paste it", POPDISABLEALARM:"Vypn\u00fa\u0165 alarm", SOUNDSETTINGS:"Nastavenia zvuku", CHKSOUNDMUTE:"Vypn\u00fa\u0165 zvuk", SOUNDVOLUME:"Hlasitos\u0165", SOUNDURL:"URL zvuku", CHKSOUNDLOOP:"slu\u010dka", 
  POPSOUNDLOOP:"Prehra\u0165 v slu\u010dke", POPSOUNDMUTE:"Stlmi\u0165 zvuk", POPSOUNDPLAY:"Hra\u0165 s aktu\u00e1lnym nastaven\u00edm", POPSOUNDSTOP:"Presta\u0165 hra\u0165", POPSOUNDURL:"Url path to the file with sound", STATS:{PLAYER:"\u0160tatistiky hr\u00e1\u010da", ALLY:"\u0160tatistiky spojenectva", TOWN:"\u0160tatistiky mesta", INACTIVE:"Neakt\u00edvny", CHKINACTIVE:"Uk\u00e1za\u0165 neakt\u00edvnych hr\u00e1\u010dov", INACTIVEDESC:"\u010cas, kedy nebol zaznamenan\u00fd \u017eiaden bojov\u00fd bod a bod za stavbu", 
  }, ABH:{WND:{WINDOWTITLE:"Pomocn\u00edk na stavanie arm\u00e1dy", UNITFRAME:"vyber si svoje jednotky", DESCRIPTION1:"Vo\u013en\u00e1 popul\u00e1cia v tomto meste je [population] ", DESCRIPTION2:"\u010co je dos\u0165 na  [max_units]", DESCRIPTION3:"[yesno] vysk\u00faman\u00e9 [research]", DESCRIPTION4:"M\u00f4\u017ee\u0161 vytr\u00e9nova\u0165 maxim\u00e1lne [max_queue] jednotiek", TARGET:"vyber si po\u010det", PACKAGE:"resource package per shipment (units)", BTNSAVE:"ulo\u017ei\u0165 nastavenia", 
  TOOLTIPOK:"click, to select default unit for which you'll be sending resources", TOOLTIPNOTOK:"jednotka e\u0161te nebola vysk\u00faman\u00e1", HASRESEARCH:"M\u00e1\u0161", NORESEARCH:"Nem\u00e1\u0161", SETTINGSAVED:"Nastavenie pre [city] bolo ulo\u017een\u00e9", }, RESWND:{RESLEFT:"resources left to send", IMGTOOLTIP:"kliknite, pre zaplnenie surov\u00edn", }, }, NEWVERSION:{AVAILABLE:"Nov\u00e1 verzia dostupn\u00e1", INSTALL:"In\u0161talova\u0165", REMINDER:"Pripomen\u00fa\u0165 nesk\u00f4r", REQRELOAD:"Obnovenie je nevyhnutn\u00e9", 
  RELOAD:"Obnovi\u0165", }, LANGS:{LANG:"Prelo\u017ei\u0165 do jazyka:", SEND:"Send to publication", SAVE:"Ulo\u017ei\u0165 a vysk\u00fa\u0161a\u0165", RESET:"Nastavi\u0165 p\u00f4vodn\u00fd jazyk", REMOVE:"Vymaza\u0165 tv\u00f4j preklad?", }, HELPTAB5:"Preklad", BTNSIMUL:"Simul\u00e1tor", EMOTS:{LABEL:"Chce\u0161 viac smajl\u00edkov?", MESS:"Prilep linky smajl\u00edkov, ka\u017ed\u00fd do novej karty", }, COMMAND:{ALL:"V\u0161etky", INCOMING:"Prich\u00e1dzaj\u00face", OUTGOING:"Odch\u00e1dzaj\u00face", 
  RETURNING:"Vracaj\u00face sa", FORTOWN:"mesto:", }, BTNVIEWBB:"BBk\u00f3d", MSGSHOWCOST:"N\u00e1klady na straten\u00e9 jednotky", POPSOUNDEG:"pr\u00edklad: https://www.youtube.com/watch?v=v2AC41dglnM, https://youtu.be/v2AC41dglnM, http://www.freesfx.co.uk/rx2/mp3s/10/11532_1406234695.mp3", RADAR:{TOWNFINDER:"N\u00e1js\u0165 mest\u00e1", FIND:"H\u013eada\u0165", MAXCSTIME:"Maxim\u00e1lny \u010das koloniza\u010dnej lode", CSTIME:"\u010cas OL", TOWNNAME:"Mesto", BTNFIND:"H\u013eada\u0165", TOWNRESERVED:"Rezerv\u00e1cia", 
  TOWNOWNER:"Vlastn\u00edk", TOWNPOINTS:"Minim\u00e1lny po\u010det bodov mesta", BTNSAVEDEFAULT:"Ulo\u017ei\u0165 hodnoty ako \u0161tandardn\u00e9", ALL:"Ak\u00e9ko\u013evek mesto", }, WALL:{LISTSAVED:"Hradby boli ulo\u017een\u00e9 d\u0148a", LISTSTATE:"Stav hradieb na de\u0148", DELETECURRENT:"Odstr\u00e1ni\u0165 s\u00fa\u010dasn\u00fd z\u00e1znam", WANTDELETECURRENT:"Ste si ist\u00fd, \u017ee chcete odstr\u00e1ni\u0165 s\u00fa\u010dasn\u00fd z\u00e1znam ?", }, QUESTION:"Ot\u00e1zka", MOBILEVERSION:"Mobiln\u00e1 verzia", 
  AO:{TITLE:"Preh\u013ead akad\u00e9mie", }, LASTUPDATE:"1487502170884", };
  this.sv = {AUTHOR:" , Mr. Ferdinand, llavids, Madame GazCar, Rena Rama GazCar", BTNCONV:"Omvandla", BTNGENER:"Generera", BTNVIEW:"F\u00f6rhandsvisa", BTNSAVE:"Spara", MSGTITLE:"Omvandla rapport", MSGQUEST:"Vilken information vill du publicera?", MSGBBCODE:"Efter att ha publicerat din rapport s\u00e5 kan du dela den i forum mm med hj\u00e4lp utav BBkoden.", MSGRESOURCE:"Byte", MSGUNITS:"Enheter", MSGBUILD:"Byggnader", MSGUSC:"Silvermynt f\u00f6rbrukade", MSGRAW:"Resurser", SUPPORT:"St\u00f6djer", 
  SPY:"Spionerar", CONQUER:"Er\u00f6vrade", LOSSES:"F\u00f6rluster", HIDDEN:"Dolda", NOTUNIT:"[i]Inga[/i]", TOWN:"[i]Stad:[/i] ", PLAYER:"[i]Spelare:[/i] ", ALLY:"[i]Allians:[/i] ", CAST:"kasta:", ONTOWER:"P\u00e5 staden:", MSGHIDAD:"D\u00f6lj st\u00e4der", MSGFORUM:"Rapporten kommer att delas", BBALLY:"alliansforum / meddelande", BBFORUM:"externa forum", ICOCLOSE:"St\u00e4ng", ICOHELP:"Om omvandlaren", MSGPREVIEW:"<b>F\u00f6rhandsvisa Rapport</b>", HELPTAB1:"Om", HELPTAB2:"Hur fungerar det", HELPTAB3:"\u00c4ndringar", 
  HELPTAB4:"Inst\u00e4llningar", MSGHUMAN:{OK:"Informationen har sparats", ERROR:"Ett problem uppstod vid skrivandet", YOUTUBEERROR:"Inkorrekt l\u00e4nk eller ej till\u00e5ten att spela utanf\u00f6r youtube", }, LABELS:{attack:{ATTACKER:"Anfallare", DEFENDER:"F\u00f6rsvarare", MSGHIDAT:"anfallare", MSGHIDDE:"f\u00f6rsvarare", MSGATTUNIT:"Anfallande arm\u00e9", MSGDEFUNIT:"F\u00f6rsvarande arm\u00e9", }, support:{ATTACKER:"St\u00f6der", DEFENDER:"St\u00f6dde", MSGHIDAT:"F\u00f6rst\u00e4rkande stad", 
  MSGHIDDE:"F\u00f6rst\u00e4rkt stad", MSGATTUNIT:"F\u00f6rst\u00e4rkande enheter", MSGDEFUNIT:"F\u00f6rsvarande enheter", }, espionage:{ATTACKER:"Spion", DEFENDER:"Spionerade", MSGHIDAT:"spion", MSGHIDDE:"spionerade", MSGATTUNIT:"", MSGDEFUNIT:"", }, }, MSGDETAIL:"kommando\u00f6versikt", MSGRETURN:"(\u00e5terv\u00e4nd)", MSGGENBBCODE:"Genererar en lista med BBkod", MSGDEFSITE:"Besegrade...", MSGLOSSITE:"F\u00f6rluster...", MSGASATT:"...som anfallare", MSGASDEF:"...som f\u00f6rsvarare", MSGDIFF1:"visa inte skillnader", 
  MSGDIFF2:"visa skillnader", MSGDIFF3:"visa bara skillnaderna", BBCODELIMIT:"Med h\u00e4nsyn till m\u00e4ngden text som f\u00e5r finnas i ett inl\u00e4gg s\u00e5 delas informationen upp i grupper vid l\u00e4ngre listor. Varje grupp klistras in som ett enskilt inl\u00e4gg. ", CHKPOWERNAME:"Visa tiden som \u00e5terst\u00e5r innan du kan anv\u00e4nda kraften", CHKFORUMTABS:"Ers\u00e4tt skrollningslisten i forumet f\u00f6r flera rader", STATSLINK:"Statistik fr\u00e5n", BTNSUPPLAYERS:"Lista p\u00e5 spelare", 
  CHKUNITSCOST:"Rapporten visar kostnaderna f\u00f6r f\u00f6rlorade enheter", CHKOCEANNUMBER:"Visa havets nummer", MSGRTLBL:"Information om revolt", MSGRTSHOW:"L\u00e4gg till information om p\u00e5g\u00e5ende revolt", MSGRTONLINE:"Kommer du vara inloggad under p\u00e5g\u00e5ende revolt?", MSGRTYES:"Ja", MSGRTNO:"Nej", MSGRTGOD:"Gud", MSGRTCSTIME:"KS tid", MSGRTONL:"inloggad?", MSGRTERR:"Du \u00e4r i fel stad!<br/>F\u00f6r att hitta information om revolten, g\u00e5 till stad: ", BBTEXT:"textversion", 
  BBHTML:"tabbelversion", MSG413ERR:"<h3>Den genererade rapporten \u00e4r f\u00f6r stor.</h3><p>Filtrera bort vissa alternativ f\u00f6r att kunna publicera utan problem</p>", CHKREPORTFORMAT:"Generera rapport med hj\u00e4lp av tabeller", WALLNOTSAVED:"Muren \u00e4r inte sparad", WALLSAVED:"Muren \u00e4r sparad", POPSELRECRUNIT:"klicka, f\u00f6r att v\u00e4lja standardenhet f\u00f6r produktion", POPRECRUNITTRADE:"klicka, f\u00f6r att fylla i resurser som kr\u00e4vs f\u00f6r att rekrytera vald enhet", 
  POPINSERTLASTREPORT:"Klistra in senast omvandlad rapport", MSGCOPYREPORT:"Rapporten har sparats. Klicka p\u00e5 [paste_icon] i forum eller ett nytt meddelande f\u00f6r att klistra in", POPDISABLEALARM:"St\u00e4ng av alarm", SOUNDSETTINGS:"Ljudinst\u00e4llningar", CHKSOUNDMUTE:"St\u00e4ng av ljudet", SOUNDVOLUME:"Volym", SOUNDURL:"Ljudfil url", CHKSOUNDLOOP:"repetera", POPSOUNDLOOP:"Spela upp ljudet i en slinga", POPSOUNDMUTE:"St\u00e4ng av ljudet", POPSOUNDPLAY:"Spela med aktuella inst\u00e4llningar", 
  POPSOUNDSTOP:"Sluta spela", POPSOUNDURL:"URL l\u00e4nk till ljudfilen", STATS:{PLAYER:"Spelarstatistik", ALLY:"Alliansstatistik", TOWN:"Stadsstatistik", CHKINACTIVE:"Visa inaktiva spelare", INACTIVE:"Inaktiv", INACTIVEDESC:"Inga po\u00e4ng f\u00f6r strider eller tillv\u00e4xt under den tiden", }, ABH:{WND:{WINDOWTITLE:"Truppbyggarverktyg", UNITFRAME:"v\u00e4lj din enhet", DESCRIPTION1:"I den h\u00e4r staden har du [population] fria inv\u00e5nare", DESCRIPTION2:"Vilket r\u00e4cker f\u00f6r att bygga [max_units]", 
  DESCRIPTION3:"Du [yesno] har en [research] framforskad.", DESCRIPTION4:"Du kan k\u00f6a upp till [max_queue] enheter", TARGET:"v\u00e4lj vad du vill bygga", PACKAGE:"resurser per f\u00f6rs\u00e4ndelse (units)", BTNSAVE:"spara inst\u00e4llningar", TOOLTIPOK:"klicka, f\u00f6r att v\u00e4lja fixerad m\u00e4ngd resurser att skicka", TOOLTIPNOTOK:"enheten har inte forskats fram", HASRESEARCH:"DU B\u00d6R", NORESEARCH:"DU B\u00d6R EJ", SETTINGSAVED:"Inst\u00e4llningarna f\u00f6r [city] har sparats", 
  }, RESWND:{RESLEFT:"resurser kvar att skicka", IMGTOOLTIP:"klicka f\u00f6r att fylla i resurser", }, }, NEWVERSION:{AVAILABLE:"Ny version tillg\u00e4nglig", INSTALL:"Installera", REMINDER:"P\u00e5minn mig senare", REQRELOAD:"Du beh\u00f6ver ladda om sidan", RELOAD:"Ladda om sidan", }, LANGS:{LANG:"\u00d6vers\u00e4ttning till spr\u00e5k:", SEND:"Skicka f\u00f6r publicering", SAVE:"Spara & testa", RESET:"\u00c5terst\u00e4ll ursprungligt spr\u00e5k", REMOVE:"Radera din \u00f6vers\u00e4ttning?", }, 
  HELPTAB5:"\u00d6vers\u00e4ttning", BTNSIMUL:"Simulator", EMOTS:{LABEL:"Vill du ha fler emotikoner?", MESS:"Klistra in l\u00e4nk till emotikon, separera med ny rad", }, COMMAND:{ALL:"Alla", INCOMING:"inkommande", OUTGOING:"utg\u00e5ende", RETURNING:"\u00e5terv\u00e4ndande", FORTOWN:"stad:", }, BTNVIEWBB:"BBkod", MSGSHOWCOST:"Kostnad f\u00f6r f\u00f6rlorade enheter", BBIMG:"enskild bild", POPSOUNDEG:"Exempel: https://www.youtube.com/watch?v=v2AC41dglnM, https://youtu.be/v2AC41dglnM, http://www.freesfx.co.uk/rx2/mp3s/10/11532_1406234695.mp3", 
  RADAR:{TOWNFINDER:"S\u00f6k st\u00e4der", FIND:"S\u00f6k", MAXCSTIME:"Maximal restid f\u00f6r koloniskepp", BTNFIND:"S\u00f6k", TOWNNAME:"Stad", CSTIME:"Ks tid", TOWNOWNER:"\u00c4gare", TOWNRESERVED:"Reservering", TOWNPOINTS:"Minsta stadspo\u00e4ng", BTNSAVEDEFAULT:"Spara v\u00e4rden som default", ALL:"Vilken stad som helst", }, WALL:{LISTSAVED:"Muren sparad p\u00e5 datum", }, QUESTION:"Fr\u00e5ga", TSL:{WND:{WINDOWTITLE:"Lista sorterad p\u00e5 stadsnamn", }, }, CHKOLDTRADE:"Anv\u00e4nds gamla bytesutseende", 
  AO:{TITLE:"Akademi \u00f6versikt", }, MOBILEVERSION:"Mobil version", LASTUPDATE:"1487501824228", };
  this.tr = {AUTHOR:"Lazmanya 61, zabidin, irfanirfan", BTNCONV:"D\u00f6n\u00fc\u015ft\u00fcr", BTNGENER:"Olu\u015ftur", BTNVIEW:"\u00d6nizle", BTNSAVE:"Kaydet", MSGTITLE:"Raporu d\u00f6n\u00fc\u015ft\u00fcr", MSGQUEST:"Hangi i\u00e7erikler g\u00f6sterilebilir?", MSGBBCODE:"Bu raporu yay\u0131nland\u0131ktan sonra BB kodunu kullanarak mesajlara ya da foruma dahil edebilirsin.", MSGRESOURCE:"Ganimet", MSGUNITS:"Birimler", MSGBUILD:"Binalar", MSGUSC:"Kullan\u0131lan g\u00fcm\u00fc\u015f paralar", MSGRAW:"Hammaddeler", 
  SUPPORT:"Yard\u0131m", SPY:"Casusluk", CONQUER:"Fethetmek", LOSSES:"Kay\u0131plar", HIDDEN:"Gizlendi", NOTUNIT:"[i]Hi\u00e7biri[/i]", TOWN:"[i]\u015eehir:[/i] ", PLAYER:"[i]Oyuncu:[/i] ", ALLY:"[i]M\u00fcttefik:[/i] ", CAST:"Yap\u0131m:", ONTOWER:"\u015eehirde:", MSGHIDAD:"\u015fehirleri gizle", MSGFORUM:"Raporu yay\u0131nla", BBALLY:"ittifak forumda ve mesajlarda", BBFORUM:"di\u011fer forumlarda", ICOCLOSE:"Kapat", ICOHELP:"D\u00f6n\u00fc\u015ft\u00fcr\u00fcc\u00fc hakk\u0131nda", MSGPREVIEW:"<b>Raporu \u00f6nizleme</b>", 
  HELPTAB1:"Hakk\u0131nda", HELPTAB2:"Nas\u0131l \u00c7al\u0131\u015f\u0131r", HELPTAB3:"De\u011fi\u015fiklikler", HELPTAB4:"Ayarlar", MSGHUMAN:{OK:"Kaydedildi", ERROR:"Yazarken bir hata olu\u015ftu", YOUTUBEERROR:"Ge\u00e7ersiz ba\u011flant\u0131 adresi veya youtube d\u0131\u015f\u0131nda oynat\u0131lamaz", }, LABELS:{attack:{ATTACKER:"Sald\u0131r\u0131", DEFENDER:"Destek", MSGHIDAT:"sald\u0131rgan", MSGHIDDE:"savunmac\u0131", MSGATTUNIT:"Sald\u0131rgan\u0131n birlikleri", MSGDEFUNIT:"Savunmac\u0131n\u0131n birlikleri", 
  }, support:{ATTACKER:"Destekleyen", DEFENDER:"Desteklenen", MSGHIDAT:"destekleyen", MSGHIDDE:"desteklenen", MSGATTUNIT:"destekleyen birim", MSGDEFUNIT:"Savunma birimleri", }, espionage:{ATTACKER:"Casus", DEFENDER:"Casusluk", MSGHIDAT:"casuslayan", MSGHIDDE:"casuslanan", MSGATTUNIT:"", MSGDEFUNIT:"", }, }, MSGDETAIL:"komut ayr\u0131nt\u0131lar\u0131", MSGRETURN:"(geri d\u00f6n)", MSGGENBBCODE:"BBKodu listesi olu\u015ftur", MSGDEFSITE:"\u00d6ld\u00fcrd\u00fc\u011f\u00fcn....", MSGLOSSITE:"Kay\u0131plar\u0131n...", 
  MSGASATT:"...sald\u0131rgan olarak", MSGASDEF:"...savunmac\u0131 olarak", MSGDIFF1:"farkl\u0131l\u0131klar\u0131 g\u00f6sterme", MSGDIFF2:"farkl\u0131l\u0131klar\u0131 g\u00f6ster", MSGDIFF3:"sadece farkl\u0131l\u0131klar\u0131 g\u00f6ster", BBCODELIMIT:"Metin uzun bir liste ise, veri gruba ayr\u0131l\u0131r. Her grubu ayr\u0131 bir girdi olarak kopyalay\u0131p yap\u0131\u015ft\u0131r\u0131n.", CHKPOWERNAME:"B\u00fcy\u00fcler i\u00e7in gerekli tevecc\u00fchlerin y\u00fcklenme s\u00fcrelerini g\u00f6ster", 
  CHKFORUMTABS:"Forum sekme pencerelerini s\u0131rala", STATSLINK:"\u0130statistikler i\u00e7in", BTNSUPPLAYERS:"Oyuncu listesi", CHKUNITSCOST:"Kaybedilen birimlerin maliyet raporu", CHKOCEANNUMBER:"Deniz numaralar\u0131n\u0131 g\u00f6ster", MSGRTLBL:"Ayaklanma Bilgisi", MSGRTSHOW:"Devem eden Ayaklanma Bilgisi ekle", MSGRTONLINE:"Ayaklanma ba\u015flad\u0131\u011f\u0131nda \u00e7evrimi\u00e7i olacak m\u0131s\u0131n?", MSGRTYES:"Evet", MSGRTNO:"Hay\u0131r", MSGRTGOD:"Tanr\u0131", MSGRTCSTIME:"Koloni zaman\u0131", 
  MSGRTONL:"\u00e7evrimi\u00e7i?", MSGRTERR:"Yanl\u0131\u015f \u015eehirdesin!<br/>Bilgiyi olu\u015fturmak i\u00e7in \u015fu \u015fehire git: ", BBTEXT:"yaz\u0131 \u015fekinde", BBHTML:"tablo \u015feklinde", MSG413ERR:"<h3>Olu\u015fturulan rapor \u00e7ok b\u00fcy\u00fck.</h3><p>Se\u00e7enekler k\u0131sm\u0131ndan ayarlar\u0131 de\u011fi\u015ftirirseniz sorunu \u00e7\u00f6zebilirsiniz.</p>", CHKREPORTFORMAT:"Tablo kullanarak raporlar\u0131 olu\u015ftur", WALLNOTSAVED:"\u015eehir surlar\u0131 kaydedilmedi", 
  WALLSAVED:"\u015eehir surlar\u0131 kaydedildi", POPSELRECRUNIT:"Varsay\u0131lan \u00fcretim birimi se\u00e7mek i\u00e7in t\u0131klay\u0131n", POPRECRUNITTRADE:"se\u00e7ili birimi olu\u015fturmak i\u00e7in hammadde doldurmak i\u00e7in t\u0131kla", POPINSERTLASTREPORT:"D\u00f6n\u00fc\u015ft\u00fcr\u00fclen son raporu yay\u0131nla", MSGCOPYREPORT:"Rapor kaydedildi. Bu raporu yay\u0131nlamak i\u00e7in forum yada yeni mesaj penceresinde bu [paste_icon] logoya t\u0131klay\u0131n.", POPDISABLEALARM:"Alarm\u0131 kapat", 
  SOUNDSETTINGS:"Ses ayar\u0131", CHKSOUNDMUTE:"Sessiz", SOUNDVOLUME:"Ses", SOUNDURL:"Ses dosyas\u0131 adresi", CHKSOUNDLOOP:"Tekrar", POPSOUNDLOOP:"Tekrar oynat", POPSOUNDMUTE:"Sesi k\u0131s", POPSOUNDPLAY:"Oynat", POPSOUNDSTOP:"Durdur", POPSOUNDURL:"y\u00fcklenen ses dosyas\u0131n\u0131n adresi", STATS:{PLAYER:"Oyuncu istatisti\u011fi", ALLY:"\u0130ttifak istatisti\u011fi", TOWN:"\u015eehir istatisti\u011fi", INACTIVEDESC:"bu s\u00fcre i\u00e7inde sava\u015f puan\u0131 yapmad\u0131 ve \u015fehir b\u00fcy\u00fctmedi", 
  CHKINACTIVE:"Pasif Oyuncular", INACTIVE:"Pasif", }, ABH:{WND:{WINDOWTITLE:"Birim Toplama Yard\u0131mc\u0131s\u0131", UNITFRAME:"biriminizi se\u00e7in", DESCRIPTION1:"Bu \u015fehide [population] \u00f6zg\u00fcr n\u00fcfus var", DESCRIPTION2:"in\u015faat yapmak i\u00e7in yeterli olan [max_units]", DESCRIPTION3:"Bu [yesno] ara\u015ft\u0131rmay\u0131 tamamlad\u0131n [research].", DESCRIPTION4:"En fazla [max_queue] kadar birim s\u0131raya koyabilirsin", TARGET:"in\u015faat yapmak istedi\u011fin hedefi se\u00e7", 
  PACKAGE:"Ta\u015f\u0131ma ba\u015f\u0131na hammadde miktar\u0131(units)", BTNSAVE:"ayarlar\u0131 kaydet", TOOLTIPOK:"Hammadde g\u00f6ndercece\u011fin varsay\u0131lan birimi se\u00e7mek i\u00e7in t\u0131kla", TOOLTIPNOTOK:"teknoloji akademide ara\u015ft\u0131r\u0131lmam\u0131\u015f", HASRESEARCH:"YAP", NORESEARCH:"YAPMA", SETTINGSAVED:"[city] i\u00e7in ayarlar kaydedildi", }, RESWND:{RESLEFT:"yollayabilece\u011fin kalan hammadde", IMGTOOLTIP:"hammaddeyi doldurmak i\u00e7in t\u0131kla", }, }, NEWVERSION:{AVAILABLE:"Yeni versiyon mevcut", 
  INSTALL:"Y\u00fckle", REMINDER:"Daha sonra hat\u0131rlat", REQRELOAD:"Sitenin yenilenmesi gerekiyor.", RELOAD:"Yenile", }, LANGS:{LANG:"\u00c7evirilen dil:", SEND:"\u00c7eviriyi G\u00f6nder", SAVE:"Kaydet & Test Et", RESET:"Varsay\u0131lan dile s\u0131f\u0131rla", REMOVE:"\u00c7evirini silmek istedi\u011fine emin misin?", }, HELPTAB5:"\u00c7eviri", BTNSIMUL:"Sim\u00fclat\u00f6r", EMOTS:{LABEL:"Daha fazla ifade ister misin?", MESS:"Her yeni bir ifade i\u00e7in yeni bir sat\u0131ra ba\u011flant\u0131 yap\u0131\u015ft\u0131r\u0131n...", 
  }, COMMAND:{ALL:"Hepsi", INCOMING:"Gelen", OUTGOING:"Giden", RETURNING:"D\u00f6nen", FORTOWN:"\u015fehir:", }, MOBILEVERSION:"Mobil Versiyonu", AO:{TITLE:"Akademi Ara\u015ft\u0131rmalar\u0131", }, TSL:{WND:{TOOLTIP:"\u015eehirleri S\u0131rala", WINDOWTITLE:"\u015eehir Listesi", }, }, CHKOLDTRADE:"Eski ticaret sistemini kullan", QUESTION:"Soru", WALL:{WANTDELETECURRENT:"Surlar\u0131n g\u00fcnl\u00fck kayd\u0131n\u0131 silmek istiyor musunuz?", DELETECURRENT:"Kayd\u0131 sil", LISTSTATE:"Kaydedilen Surlar\u0131n tarihi", 
  LISTSAVED:"Surlar\u0131 g\u00fcnl\u00fck kaydet", }, RADAR:{ALL:"Herhangi bir \u015eehir", BTNSAVEDEFAULT:"Varsay\u0131lan olarak kaydet", TOWNPOINTS:"\u015eehir Puan\u0131", TOWNRESERVED:"Rezervasyon", TOWNOWNER:"Sahip", CSTIME:"Koloni Zaman\u0131", TOWNNAME:"\u015eehir", BTNFIND:"Ara", MAXCSTIME:"Koloni mesafe s\u00fcresi", FIND:"Ara", TOWNFINDER:"\u015eehir Arama", }, POPSOUNDEG:"\u00d6rnek: https://www.youtube.com/watch?v=v2AC41dglnM, https://youtu.be/v2AC41dglnM, http://www.freesfx.co.uk/rx2/mp3s/10/11532_1406234695.mp3", 
  MSGSHOWCOST:"Kaybedilen birimlerin maliyeti", BTNVIEWBB:"BBKodu", LASTUPDATE:"1487501618596", };
}
function _RepConvAdds() {
  function f() {
    if (void 0 == require("game/windows/ids")) {
      setTimeout(function() {
        f();
      }, 100);
    } else {
      var h = require("game/windows/ids");
      $.each(RepConv.wndArray, function(l, m) {
        h[m.toUpperCase()] = m;
      });
      window.define("game/windows/ids", function() {
        return h;
      });
      $.each(RepConv.initArray, function(l, m) {
        try {
          setTimeout(m, 10);
        } catch (C) {
          grcrtErrReporter(C);
        }
      });
    }
  }
  function A() {
    if (0 == $(".btn_gods_spells>.icon.js-caption").length || 0 == $("#grcrt_mnu>div.btn_settings").length) {
      setTimeout(function() {
        A();
      }, 100);
    } else {
      $(".btn_gods_spells").on("click", function() {
        !$(".btn_gods_spells").hasClass("active") && $("#grcrt_mnu>div.btn_settings").hasClass("active") && $("#grcrt_mnu>div.btn_settings").click();
      });
    }
  }
  function c() {
    $("head").append($("<style/>").append(".grcrt {background: url(" + RepConv.grcrt_cdn + "ui/layout_3.3.0.png) -4px -80px no-repeat;}").append("#grcrt_mnu_list ul { height: auto !important;}").append("#grcrt_mnu_list li { width: 125px !important;}"));
    $.each(RepConv.menu, function(h, l) {
      $("#grcrt_mnu_list ul").append($("<li/>").append($("<span/>", {"class":"content_wrapper"}).append($("<span/>", {"class":"button_wrapper"}).append($("<span/>", {"class":"button"}).append($("<span/>", {"class":"icon grcrt" + (l.class ? " " + l.class : "")})).append($("<span/>", {"class":"indicator", style:"display: none;"}))).append($("<span/>", {"class":"name_wrapper", style:"width: 90px; height: 34px;"}).append($("<span/>", {"class":"name"}).html(RepConvTool.GetLabel(l.name)))))).click(function() {
        eval(l.action);
      }).attr("id", l.id));
    });
  }
  this.init = function() {
    if ("undefined" == typeof RepConv.settingsReaded || "undefined" == typeof Layout) {
      RepConv.Debug && console.log("czekam...."), setTimeout(function() {
        RepConvAdds.init();
      }, 100);
    } else {
      RepConv.Debug && console.log("init....");
      var h = (require("map/helpers") || MapTiles).map2Pixel(100, 100);
      $("head").append($("<style/>").append(".RepConvON {border: 1px solid #fff; position: absolute; display: block; z-index: 2; opacity: .1;width: " + h.x + "px; height: " + h.x + "px;}#RepConvSpanPrev .outer_border {border: 2px solid black; font-size: 95%;}").append("#ui_box.grcrt_ui_box .nui_units_box{ top:244px;}#ui_box.grcrt_ui_box .nui_right_box #grcrt_pl{  top:156px;  height: 30px; line-height: 24px; font-weight: 700; color: rgb(255, 204, 102); font-size: 11px; text-align: center;}#ui_box.grcrt_ui_box.city-overview-enabled .nui_units_box{ top:223px !important;}#ui_box.grcrt_ui_box.city-overview-enabled .nui_right_box #grcrt_pl{ top:135px;}").append("div.island_info_wrapper div.center1 {top: 0px;width: 435px;float: left;left: 270px;}div.island_info_towns {margin-top: 25px;}div.island_info_wrapper .island_info_left .game_list {height: 340px !important;}div.island_info_wrapper .island_info_right .game_list {height: 370px;}#farm_town_overview_btn {top: 75px !important}"));
      RepConv.audioSupport = "function" == typeof Audio;
      $("body").append($("<div/>", {id:"RepConvTMP"}).hide());
      try {
        RepConv.Debug && console.log(RepConv.settings), RepConvTool.checkSettings(), RepConv.active.fcmdimg = !1, RepConv.active.power = RepConvTool.getSettings(RepConv.CookiePower), RepConv.active.ftabs = RepConvTool.getSettings(RepConv.CookieForumTabs), RepConv.active.statsGRCL = RepConvTool.getSettings(RepConv.CookieStatsGRCL), RepConv.active.unitsCost = RepConvTool.getSettings(RepConv.CookieUnitsCost), RepConv.active.oceanNumber = RepConvTool.getSettings(RepConv.CookieOceanNumber), RepConv.active.reportFormat = 
        RepConvTool.getSettings(RepConv.CookieReportFormat), RepConvTool.useSettings();
      } catch (m) {
        RepConv.Debug && console.log(m);
      }
      RepConv.Debug && console.log(RepConv.settings);
      RepConv.Debug && console.log("zmiana wygl\u0105du");
      RepConv.Debug && console.log(-1 != location.pathname.indexOf("game"));
      RepConv.Debug && console.log($("#ui_box div.bottom_ornament").length);
      -1 != location.pathname.indexOf("game") && (0 == $("#grcrt_mnu_list").length && ($("#ui_box div.bottom_ornament").before($("<div/>", {id:"grcrt_mnu_list", "class":"container_hidden", style:"position: absolute;right: -10px;bottom: 6px;"}).append($("<div/>", {"class":"top"})).append($("<div/>", {"class":"bottom"})).append($("<div/>", {"class":"middle nui_main_menu", style:"top: 0px; width: 142px;"}).append($("<div/>", {"class":"left"})).append($("<div/>", {"class":"right", style:"z-index:10;"})).append($("<div/>", 
      {"class":"content", style:"display:none; margin-top: 0; margin-bottom: 0;"}).append($("<div/>", {"class":"units_wrapper clearfix"}).append($("<ul/>")))))), $("#ui_box div.bottom_ornament").append($("<div/>", {id:"grcrt_mnu", style:"background: url(" + RepConv.grcrt_cdn + "ui/layout_3.3.0.png) no-repeat; width: 142px; height: 75px;"}).append($("<div/>", {"class":"btn_settings circle_button", style:"top: 34px; right: 55px;"}).append($("<div/>", {"class":"icon js-caption", style:""}).append($("<img/>", 
      {src:RepConv.grcrt_cdn + "img/octopus.png", style:"width: 20px; margin: 5px;"}))).mousePopup(new MousePopup(RepConv.Scripts_nameS + " " + RepConv.Scripts_version + " [" + RepConv.LangEnv + "]")).click(function() {
        $("#grcrt_mnu_list li.main_menu_item").remove();
        $("#grcrt_mnu>div.btn_settings").hasClass("active checked") ? $("#grcrt_mnu_list .content").slideUp(500, function() {
          $("#grcrt_mnu_list").animate({right:-10}, 300);
        }) : ($(".btn_gods_spells").hasClass("active") && $(".btn_gods_spells").click(), $("#grcrt_mnu_list").animate({right:134}, 300, function() {
          $("#grcrt_mnu_list .content").slideDown(500);
        }));
        $("#grcrt_mnu>div.btn_settings").toggleClass("active checked");
      }))), c(), $("#grcrt_mnu_list>.bottom").css({background:$(".gods_spells_menu>.bottom").css("background"), height:$(".gods_spells_menu>.bottom").css("height"), position:$(".gods_spells_menu>.bottom").css("position"), bottom:"-27px"}), A()), $("#ui_box").append($("<img/>", {src:RepConv.grcrt_cdn + "img/octopus.png", id:"grcgrc", style:"position:absolute;bottom:10px;left:10px;z-index:1000"})));
      if (RepConv.audioSupport) {
        RepConv.active.sounds = RepConvTool.getSettings(RepConv.CookieSounds);
        RepConv.audio = {};
        h = $("<audio/>", {preload:"auto"});
        var l = $("<audio/>", {preload:"auto"}).append($("<source/>", {src:RepConv.Const.defMuteM + ".mp3"})).append($("<source/>", {src:RepConv.Const.defMuteM + ".ogg"}));
        "" != RepConv.active.sounds.url ? $(h).append($("<source/>", {src:RepConv.active.sounds.url})) : $(h).append($("<source/>", {src:RepConv.Const.defAlarmM + ".mp3"})).append($("<source/>", {src:RepConv.Const.defAlarmM + ".ogg"}));
        RepConv.audio.alarm = h.get(0);
        RepConv.audio.mute = l.get(0);
      }
      RepConv.Start = {};
      setTimeout(function() {
        RepConvTool.newVersion();
      }, 30000);
      0 == $("#GTBTN").length && "pl" == Game.market_id && ($("#main_menu").width(865), $("#main_menu div.border_right").css({background:'url("' + RepConv.grcrt_cdn + 'images/prawy.png") no-repeat 0 13px', width:"77px"}), $("#main_menu div.help").css("right", "31px"), $("#main_menu div.logout").css("right", "31px"), $("#main_menu div.options_container").append($("<div/>", {id:"GTBTN", "class":"small_option small_option_top_right help", style:"background: url(" + RepConv.grcrt_cdn + "images/gt.png') no-repeat 0 0; right: 3px; top: 45px;"}).mouseenter(function() {
        $(this).css("background-position", "0 -62px");
      }).mouseleave(function() {
        $(this).css("background-position", "0 0");
      }).click(function() {
        $(this).css("background-position", "0 -31px");
        window.open("http://gretimes.community.grepolis.pl/", "_blank");
      }).mousePopup(new MousePopup("GreTime's"))));
      f();
      try {
        $("#dio_available_units_style_addition").text($("#dio_available_units_style_addition").text().replace(" .nui_main_menu", "#ui_box>.nui_main_menu"));
      } catch (m) {
      }
    }
  };
  this.emots = {};
  this.emotsDef = [{img:RepConv.grcrt_cdn + "emots/usmiech.gif", title:":)"}, {img:RepConv.grcrt_cdn + "emots/ostr.gif", title:":>"}, {img:RepConv.grcrt_cdn + "emots/kwadr.gif", title:":]"}, {img:RepConv.grcrt_cdn + "emots/smutny2.gif", title:":("}, {img:RepConv.grcrt_cdn + "emots/yyyy.gif", title:":|"}, {img:RepConv.grcrt_cdn + "emots/uoeee.gif", title:"<uoee>"}, {img:RepConv.grcrt_cdn + "emots/lol.gif", title:"<lol>"}, {img:RepConv.grcrt_cdn + "emots/rotfl.gif", title:"<rotfl>"}, {img:RepConv.grcrt_cdn + 
  "emots/oczko.gif", title:";)"}, {img:RepConv.grcrt_cdn + "emots/jezyk.gif", title:":P"}, {img:RepConv.grcrt_cdn + "emots/jezyk_oko.gif", title:";P"}, {img:RepConv.grcrt_cdn + "emots/stres.gif", title:"<stres>"}, {img:RepConv.grcrt_cdn + "emots/nerwus.gif", title:"<nerwus>"}, {img:RepConv.grcrt_cdn + "emots/zly.gif", title:":["}, {img:RepConv.grcrt_cdn + "emots/w8.gif", title:"<w8>"}, {img:RepConv.grcrt_cdn + "emots/wesoly.gif", title:":))"}, {img:RepConv.grcrt_cdn + "emots/bezradny.gif", title:"<bezradny>"}, 
  {img:RepConv.grcrt_cdn + "emots/krzyk.gif", title:"<krzyk>"}, {img:RepConv.grcrt_cdn + "emots/szok.gif", title:""}, {img:RepConv.grcrt_cdn + "emots/hura.gif", title:""}, {img:RepConv.grcrt_cdn + "emots/boisie.gif", title:""}, {img:RepConv.grcrt_cdn + "emots/prosi.gif", title:""}, {img:RepConv.grcrt_cdn + "emots/nie.gif", title:""}, {img:RepConv.grcrt_cdn + "emots/hejka.gif", title:""}, {img:RepConv.grcrt_cdn + "emots/okok.gif", title:""}, {img:RepConv.grcrt_cdn + "emots/cwaniak.gif", title:""}, 
  {img:RepConv.grcrt_cdn + "emots/haha.gif", title:""}, {img:RepConv.grcrt_cdn + "emots/mysli.gif", title:""}, {img:RepConv.grcrt_cdn + "emots/pocieszacz.gif", title:""}, {img:RepConv.grcrt_cdn + "emots/foch.gif", title:""}, {img:RepConv.grcrt_cdn + "emots/zmeczony.gif", title:""}, {img:RepConv.grcrt_cdn + "emots/beczy.gif", title:""}, {img:RepConv.grcrt_cdn + "emots/wysmiewacz.gif", title:""}, {img:RepConv.grcrt_cdn + "emots/zalamka.gif", title:""}, {img:RepConv.grcrt_cdn + "emots/buziak.gif", title:""}, 
  {img:RepConv.grcrt_cdn + "emots/buzki.gif", title:""}, {img:RepConv.grcrt_cdn + "emots/dobani.gif", title:""}, {img:RepConv.grcrt_cdn + "emots/dokuczacz.gif", title:""}, {img:RepConv.grcrt_cdn + "emots/figielek.gif", title:""}, {img:RepConv.grcrt_cdn + "emots/klotnia.gif", title:""}, {img:RepConv.grcrt_cdn + "emots/paluszkiem.gif", title:""}, {img:RepConv.grcrt_cdn + "emots/wnerw.gif", title:""}, {img:RepConv.grcrt_cdn + "emots/zacieszacz.gif", title:""}, ];
  this.emotsLists = {grcrt:{img:"emots/usmiech.gif", detail:[{img:"emots/usmiech.gif"}, {img:"emots/ostr.gif"}, {img:"emots/kwadr.gif"}, {img:"emots/smutny2.gif"}, {img:"emots/yyyy.gif"}, {img:"emots/uoeee.gif"}, {img:"emots/lol.gif"}, {img:"emots/rotfl.gif"}, {img:"emots/oczko.gif"}, {img:"emots/jezyk.gif"}, {img:"emots/jezyk_oko.gif"}, {img:"emots/stres.gif"}, {img:"emots/nerwus.gif"}, {img:"emots/zly.gif"}, {img:"emots/w8.gif"}, {img:"emots/wesoly.gif"}, {img:"emots/bezradny.gif"}, {img:"emots/krzyk.gif"}, 
  {img:"emots/szok.gif"}, {img:"emots/hura.gif"}, {img:"emots/boisie.gif"}, {img:"emots/prosi.gif"}, {img:"emots/nie.gif"}, {img:"emots/hejka.gif"}, {img:"emots/okok.gif"}, {img:"emots/cwaniak.gif"}, {img:"emots/haha.gif"}, {img:"emots/mysli.gif"}, {img:"emots/pocieszacz.gif"}, {img:"emots/foch.gif"}, {img:"emots/zmeczony.gif"}, {img:"emots/beczy.gif"}, {img:"emots/wysmiewacz.gif"}, {img:"emots/zalamka.gif"}, {img:"emots/buziak.gif"}, {img:"emots/buzki.gif"}, {img:"emots/dobani.gif"}, {img:"emots/dokuczacz.gif"}, 
  {img:"emots/figielek.gif"}, {img:"emots/klotnia.gif"}, {img:"emots/paluszkiem.gif"}, {img:"emots/wnerw.gif"}, {img:"emots/zacieszacz.gif"}, ]}, girls:{img:"emots2/girl_yawn.gif", detail:[{img:"emots2/girl_angel.gif"}, {img:"emots2/girl_angry.gif"}, {img:"emots2/girl_baby.gif"}, {img:"emots2/girl_beat.gif"}, {img:"emots2/girl_beee.gif"}, {img:"emots2/girl_blush2.gif"}, {img:"emots2/girl_cavemanlarge.gif"}, {img:"emots2/girl_comp.gif"}, {img:"emots2/girl_cray2.gif"}, {img:"emots2/girl_crazy.gif"}, 
  {img:"emots2/girl_cry5.gif"}, {img:"emots2/girl_cute.gif"}, {img:"emots2/girl_drink1.gif"}, {img:"emots2/girl_drool.gif"}, {img:"emots2/girl_elbowyes.gif"}, {img:"emots2/girl_feminist.gif"}, {img:"emots2/girl_haha.gif"}, {img:"emots2/girl_hankycray.gif"}, {img:"emots2/girl_hospital.gif"}, {img:"emots2/girl_hysteric.gif"}, {img:"emots2/girl_impossible.gif"}, {img:"emots2/girl_in_love.gif"}, {img:"emots2/girl_kiss2.gif"}, {img:"emots2/girl_kiss3.gif"}, {img:"emots2/girl_kiss5.gif"}, {img:"emots2/girl_lol.gif"}, 
  {img:"emots2/girl_manicur.gif"}, {img:"emots2/girl_party2.gif"}, {img:"emots2/girl_peek-a-boo.gif"}, {img:"emots2/girl_pinkglassesf.gif"}, {img:"emots2/girl_shock3.gif"}, {img:"emots2/girl_sigh.gif"}, {img:"emots2/girl_spruce_up.gif"}, {img:"emots2/girl_tender.gif"}, {img:"emots2/girl_whistling.gif"}, {img:"emots2/girl_wink.gif"}, {img:"emots2/girl_witch.gif"}, {img:"emots2/girl_yawn.gif"}, ]}, anpu:{img:"emots2/amem.gif", detail:[{img:"emots2/acute.gif"}, {img:"emots2/aggressive.gif"}, {img:"emots2/air_kiss.gif"}, 
  {img:"emots2/amem.gif"}, {img:"emots2/angel.gif"}, {img:"emots2/angel.png"}, {img:"emots2/angry.png"}, {img:"emots2/bad.gif"}, {img:"emots2/bb.gif"}, {img:"emots2/beach.gif"}, {img:"emots2/beee.gif"}, {img:"emots2/beer.png"}, {img:"emots2/big_boss.gif"}, {img:"emots2/biggrin.gif"}, {img:"emots2/biggrin.png"}, {img:"emots2/blink.png"}, {img:"emots2/blum3.gif"}, {img:"emots2/blush.gif"}, {img:"emots2/blush.png"}, {img:"emots2/bomb.png"}, {img:"emots2/boredom.gif"}, {img:"emots2/bye2.gif"}, {img:"emots2/bye.gif"}, 
  {img:"emots2/Clap.gif"}, {img:"emots2/clapping.gif"}, {img:"emots2/cool.gif"}, {img:"emots2/cool.png"}, {img:"emots2/coool.gif"}, {img:"emots2/cray2.gif"}, {img:"emots2/cray.gif"}, {img:"emots2/crazy.gif"}, {img:"emots2/cry.png"}, {img:"emots2/cursing.gif"}, {img:"emots2/dance1.gif"}, {img:"emots2/dance2.gif"}, {img:"emots2/dance3.gif"}, {img:"emots2/dash.gif"}, {img:"emots2/devil.png"}, {img:"emots2/diablo.gif"}, {img:"emots2/dirol.gif"}, {img:"emots2/dj.gif"}, {img:"emots2/dontknow.gif"}, {img:"emots2/drinks.gif"}, 
  {img:"emots2/drool.png"}, {img:"emots2/elvis.gif"}, {img:"emots2/emoticon-0115-inlove.gif"}, {img:"emots2/facepalm.gif"}, {img:"emots2/friends.gif"}, {img:"emots2/gamer4.gif"}, {img:"emots2/getlost.png"}, {img:"emots2/giggle.gif"}, {img:"emots2/give_heart2.gif"}, {img:"emots2/give_rose.gif"}, {img:"emots2/good.gif"}, {img:"emots2/Grandpa_Angry.gif"}, {img:"emots2/greeting.gif"}, {img:"emots2/grin.png"}, {img:"emots2/hang2.gif"}, {img:"emots2/happy.png"}, {img:"emots2/help.gif"}, {img:"emots2/hot.gif"}, 
  {img:"emots2/hrhr.gif"}, {img:"emots2/hunter.gif"}, {img:"emots2/ilovethis.gif"}, {img:"emots2/inlove.png"}, {img:"emots2/ireful1.gif"}, {img:"emots2/king.gif"}, {img:"emots2/kissed.png"}, {img:"emots2/kissing.png"}, {img:"emots2/kiss.png"}, {img:"emots2/kolobok_superman.gif"}, {img:"emots2/laugh.gif"}, {img:"emots2/laughing.png"}, {img:"emots2/lazy.gif"}, {img:"emots2/lol27.gif"}, {img:"emots2/lol.gif"}, {img:"emots2/mail1.gif"}, {img:"emots2/mamba.gif"}, {img:"emots2/man_in_love.gif"}, {img:"emots2/moil.gif"}, 
  {img:"emots2/mosking.gif"}, {img:"emots2/music2.gif"}, {img:"emots2/music.png"}, {img:"emots2/nea.gif"}, {img:"emots2/new_russian.gif"}, {img:"emots2/offtopic.gif"}, {img:"emots2/oldman.gif"}, {img:"emots2/on_the_quiet.gif"}, {img:"emots2/paint2.gif"}, {img:"emots2/pardon.gif"}, {img:"emots2/pirate.gif"}, {img:"emots2/pleasantry.gif"}, {img:"emots2/poo.png"}, {img:"emots2/popcorm1.gif"}, {img:"emots2/pouty.png"}, {img:"emots2/prankster2.gif"}, {img:"emots2/preved.gif"}, {img:"emots2/punish.gif"}, 
  {img:"emots2/rofl.gif"}, {img:"emots2/rolleyes.gif"}, {img:"emots2/rolleyes.png"}, {img:"emots2/rose.png"}, {img:"emots2/sad.png"}, {img:"emots2/sarcastic.gif"}, {img:"emots2/sarcastic_hand.gif"}, {img:"emots2/scare.gif"}, {img:"emots2/scratch_one-s_head.gif"}, {img:"emots2/secret.gif"}, {img:"emots2/sensored.gif"}, {img:"emots2/shake2.gif"}, {img:"emots2/shocked.png"}, {img:"emots2/shock.png"}, {img:"emots2/shok.gif"}, {img:"emots2/shout.gif"}, {img:"emots2/sick.png"}, {img:"emots2/sideways.png"}, 
  {img:"emots2/sleeping.gif"}, {img:"emots2/sleep.png"}, {img:"emots2/smile.png"}, {img:"emots2/smoke.gif"}, {img:"emots2/snog.gif"}, {img:"emots2/sorry2.gif"}, {img:"emots2/sorry.gif"}, {img:"emots2/spiteful.gif"}, {img:"emots2/stfu.png"}, {img:"emots2/stop.gif"}, {img:"emots2/stop.png"}, {img:"emots2/teeth.png"}, {img:"emots2/this.gif"}, {img:"emots2/thumbdown.png"}, {img:"emots2/thumbsup.png"}, {img:"emots2/tongue.gif"}, {img:"emots2/tongue.png"}, {img:"emots2/training1.gif"}, {img:"emots2/unsure.gif"}, 
  {img:"emots2/vava.gif"}, {img:"emots2/victory.gif"}, {img:"emots2/wacko.png"}, {img:"emots2/wait.gif"}, {img:"emots2/whip.gif"}, {img:"emots2/whistling.gif"}, {img:"emots2/wink.gif"}, {img:"emots2/wink.png"}, {img:"emots2/wizard.gif"}, {img:"emots2/wrong.png"}, {img:"emots2/yahoo.gif"}, {img:"emots2/yawn.png"}, {img:"emots2/yes.gif"}, {img:"emots2/zloy.gif"}, ]}};
}
function _RepConvForm() {
  this.button = function(f) {
    return $("<div/>").append($("<a/>", {"class":"button", href:"#", style:"display:inline-block; vertical-align: middle;"}).append($("<span/>", {"class":"left"}).append($("<span/>", {"class":"right"}).append($("<span/>", {"class":"middle"}).text(f))))).html();
  };
  this.checkbox = function(f) {
    var A = $("<div/>", {"class":"checkbox_new" + (f.checked ? " checked" : ""), style:"padding: 5px;" + (f.style || "")}).append($("<input/>", {type:"checkbox", name:f.name, id:f.name, checked:f.checked, style:"display: none;"})).append($("<div/>", {"class":"cbx_icon", rel:f.name})).append($("<div/>", {"class":"cbx_caption"}).text(RepConvTool.GetLabel(f.name))).bind("click", function() {
      $(this).toggleClass("checked");
      $(this).find($('input[type="checkbox"]')).attr("checked", $(this).hasClass("checked"));
    });
    void 0 != f.cb && $(A).append($("<br/>", {style:"clear:both"}));
    void 0 != f.sample && $(A).append($("<div/>", {style:"display:" + ("" != f.sample.org || "" != f.sample.grc ? "block" : "none")}).append(f.sample.org).append(f.sample.grc).append($("<br/>")).append($("<br/>", {style:"clear:both"})));
    return $(A);
  };
  this.input = function(f) {
    return $("<div/>", {"class":"textbox", style:f.style}).append($("<div/>", {"class":"left"})).append($("<div/>", {"class":"right"})).append($("<div/>", {"class":"middle"}).append($("<div/>", {"class":"ie7fix"}).append($("<input/>", {type:"text", tabindex:"1", id:f.name, value:f.value}).attr("size", f.size || 10))));
  };
  this.inputMinMax = function(f) {
    return $("<div/>", {"class":"textbox"}).append($("<span/>", {"class":"grcrt_spinner_btn grcrt_spinner_down", rel:f.name}).click(function() {
      var A = $(this).parent().find("#" + $(this).attr("rel"));
      parseInt($(A).attr("min")) < parseInt($(A).attr("value")) && $(A).attr("value", parseInt($(A).attr("value")) - 1);
    })).append($("<div/>", {"class":"textbox", style:f.style}).append($("<div/>", {"class":"left"})).append($("<div/>", {"class":"right"})).append($("<div/>", {"class":"middle"}).append($("<div/>", {"class":"ie7fix"}).append($("<input/>", {type:"text", tabindex:"1", id:f.name, value:f.value, min:f.min, max:f.max}).attr("size", f.size || 10).css("text-align", "right"))))).append($("<span/>", {"class":"grcrt_spinner_btn grcrt_spinner_up", rel:f.name}).click(function() {
      var A = $(this).parent().find("#" + $(this).attr("rel"));
      parseInt($(A).attr("max")) > parseInt($(A).attr("value")) && $(A).attr("value", parseInt($(A).attr("value")) + 1);
    }));
  };
  this.unitMinMax = function(f) {
    return $("<div/>", {"class":"grcrt_abh_unit_wrapper"}).append($("<div/>", {"class":"grcrt_abh_selected_unit unit_icon40x40 unit selected"}).append($("<span/>", {"class":"value grcrt_spiner", min:f.min, max:f.max, id:f.name}).html(f.value)).addClass(f.unit).attr("rel", null != RepConvABH.savedArr[f.tTown] ? RepConvABH.savedArr[f.tTown].unit : "").attr("wndId", f.wndId).mousePopup(new MousePopup(RepConvTool.GetLabel("ABH.RESWND.IMGTOOLTIP")))).append($("<div/>").append($("<span/>", {"class":"grcrt_target_btn grcrt_target_down", 
    rel:f.name}).click(function() {
      var A = $(this).parent().parent().find("#" + $(this).attr("rel") + ".value");
      parseInt($(A).attr("min")) < parseInt($(A).html()) && $(A).html(parseInt($(A).html()) - 1);
    })).append($("<span/>", {"class":"grcrt_target_btn grcrt_target_up", rel:f.name}).click(function() {
      var A = $(this).parent().parent().find("#" + $(this).attr("rel") + ".value");
      parseInt($(A).attr("max")) > parseInt($(A).html()) && $(A).html(parseInt($(A).html()) + 1);
    })));
  };
  this.soundSlider = function(f) {
    return $("<div/>", {id:"grcrt_" + f.name + "_config"}).append($("<div/>", {"class":"slider_container"}).append($("<div/>", {style:"float:left;width:120px;"}).html(RepConvTool.GetLabel("SOUNDVOLUME"))).append(RepConvForm.input({name:"grcrt_" + f.name + "_value", style:"float:left;width:33px;"}).hide()).append($("<div/>", {"class":"windowmgr_slider", style:"width: 200px;float: left;"}).append($("<div/>", {"class":"grepo_slider sound_volume"})))).append($("<script/>", {type:"text/javascript"}).text("RepConv.slider = $('#grcrt_" + 
    f.name + "_config .sound_volume').grepoSlider({\nmin: 0,\nmax: 100,\nstep: 5,\nvalue: " + f.volume + ",\ntemplate: 'tpl_grcrt_slider'\n}).on('sl:change:value', function (e, _sl, value) {\n$('#grcrt_" + f.name + "_value').attr('value',value);\nif (RepConv.audio.test != undefined){\nRepConv.audio.test.volume = value/100;\n}\nRepConvGRC.getGrcrtYTPlayerTest().setVolume(value)\n}),\n$('#grcrt_" + f.name + "_config .button_down').css('background-position','-144px 0px;'),\n$('#grcrt_" + f.name + "_config .button_up').css('background-position','-126px 0px;')\n"));
  };
  $("head").append($("<style/>").append('.grcrt_spinner_btn {background-image: url("' + RepConv.Const.uiImg + 'pm.png");height:20px;width:20px;margin-top: 1px;vertical-align: top;display:inline-block;cursor:pointer;background-position:0px 0px;}').append(".grcrt_spinner_down {background-position:-20px 0px;}").append(".grcrt_spinner_down:hover {background-position: -20px -21px;}").append(".grcrt_spinner_up:hover {background-position: 0 -21px;}")).append($("<script/>", {id:"tpl_grcrt_slider", type:"text/template"}).text('<div class="button_down left js-button-left" style="background-position: -144px 0px;"></div>\n<div class="bar js-slider js-slider-handle-container">\n<div class="border_l"></div>\n<div class="border_r"></div>\n<div class="slider_handle js-slider-handle"></div>\n</div>\n<div class="button_up right js-button-right" style="background-position: -126px 0px;"></div>\n'));
}
function _RepConvTool() {
  function f() {
    var c, h = {}, l = {};
    if ("object" != typeof RepConv) {
      setTimeout(function() {
        f();
      }, 1E4);
    } else {
      try {
        $.ajax({method:"get", url:"/data/players.txt"}).done(function(m) {
          try {
            $.each(m.split(/\r\n|\n/), function(C, J) {
              c = J.split(/,/);
              h[c[0]] = {id:c[0], name:decodeURIComponent(c[1] + "").replace(/\+/g, " "), alliance_id:c[2]};
            }), RepConv.cachePlayers = h;
          } catch (C) {
            C.silent = !0, grcrtErrReporter(C);
          }
        });
      } catch (m) {
        m.silent = !0, grcrtErrReporter(m);
      }
      try {
        $.ajax({method:"get", url:"/data/alliances.txt", }).done(function(m) {
          try {
            $.each(m.split(/\r\n|\n/), function(C, J) {
              c = J.split(/,/);
              l[c[0]] = {id:c[0], name:decodeURIComponent(c[1] + "").replace(/\+/g, " ")};
            }), RepConv.cacheAlliances = l;
          } catch (C) {
            C.silent = !0, grcrtErrReporter(C);
          }
        });
      } catch (m) {
        m.silent = !0, grcrtErrReporter(m);
      }
    }
  }
  var A = 0;
  this.checkSettings = function() {
    var c = {}, h = !0;
    c[RepConv.CookieCmdImg] = !0;
    c[RepConv.CookieStatsGRCL] = "potusek";
    c[RepConv.CookieSounds] = {mute:!1, volume:100, url:"", loop:!0};
    RepConv.settings = RepConv.settings || {};
    $.each(RepConv.sChbxs, function(l, m) {
      void 0 == RepConv.settings[l] && (RepConv.settings[l] = JSON.parse(RepConvTool.getSettings(l, m.default)), h = !1, RepConv.Debug && console.log(RepConv.CookieReportFormat));
    });
    void 0 == RepConv.settings[RepConv.CookieStatsGRCL] && (RepConv.settings[RepConv.CookieStatsGRCL] = RepConvTool.getSettings(RepConv.CookieStatsGRCL, c[RepConv.CookieStatsGRCL]), h = !1, RepConv.Debug && console.log(RepConv.CookieStatsGRCL));
    void 0 == RepConv.settings[RepConv.CookieUnitsABH] && (RepConv.settings[RepConv.CookieUnitsABH] = RepConvTool.getSettings(RepConv.CookieUnitsABH, "{}"), h = !1, RepConv.Debug && console.log(RepConv.CookieUnitsABH));
    void 0 == RepConv.settings[RepConv.Cookie + "radar_cs"] && (RepConv.settings[RepConv.Cookie + "radar_cs"] = RepConvTool.getSettings(RepConv.Cookie + "radar_cs", "06:00:00"), h = !1, RepConv.Debug && console.log(RepConv.Cookie + "radar_cs"));
    void 0 == RepConv.settings[RepConv.Cookie + "radar_points"] && (RepConv.settings[RepConv.Cookie + "radar_points"] = JSON.parse(RepConvTool.getSettings(RepConv.Cookie + "radar_points", "0")), h = !1, RepConv.Debug && console.log(RepConv.Cookie + "radar_points"));
    void 0 == RepConv.settings[RepConv.CookieWall] && (RepConv.settings[RepConv.CookieWall] = JSON.parse(RepConvTool.getItem(RepConv.CookieWall)) || [], h = !1, RepConv.Debug && console.log(RepConv.CookieWall));
    void 0 == RepConv.settings[RepConv.Cookie] && 0 < RepConv.settings[RepConv.CookieWall].length && (RepConv.settings[RepConv.Cookie] = JSON.parse(RepConvTool.getItem(RepConv.Cookie)) || null, h = !1, RepConv.Debug && console.log(RepConv.Cookie));
    void 0 == RepConv.settings[RepConv.CookieEmots] && (RepConv.settings[RepConv.CookieEmots] = RepConvTool.getItem(RepConv.CookieEmots) || "https://cdn.grcrt.net/emots2/237.gif\nhttps://cdn.grcrt.net/emots2/shake2.gif", h = !1, RepConv.Debug && console.log(RepConv.CookieEmots));
    void 0 == RepConv.settings[RepConv.CookieSounds] && (RepConv.settings[RepConv.CookieSounds] = JSON.parse(RepConvTool.getSettings(RepConv.CookieSounds, JSON.stringify(c[RepConv.CookieSounds]))), h = !1, RepConv.Debug && console.log(RepConv.CookieSounds));
    h ? (RepConv.active.power = RepConv.settings[RepConv.CookiePower], RepConv.active.ftabs = RepConv.settings[RepConv.CookieForumTabs], RepConv.active.statsGRCL = RepConv.settings[RepConv.CookieStatsGRCL], RepConv.active.unitsCost = RepConv.settings[RepConv.CookieUnitsCost], RepConv.active.reportFormat = RepConv.settings[RepConv.CookieReportFormat], RepConv.audioSupport && (RepConv.active.sounds = RepConv.settings[RepConv.CookieSounds]), this.useSettings()) : (RepConv.Debug && console.log(A), RepConvTool.saveRemote(), 
    10 > ++A ? setTimeout(function() {
      RepConvTool.readRemote();
    }, 1000) : (setTimeout(function() {
      A = 0;
    }, 6E4), setTimeout(function() {
      HumanMessage.error(RepConvTool.GetLabel("MSGHUMAN.ERROR"));
    }, 0)));
  };
  this.useSettings = function() {
    setTimeout(function() {
      RepConvAdds.emotsLists.usersaved = {img:"emots2/wizard.gif", detail:[]};
      void 0 != RepConvTool.getItem(RepConv.CookieEmots) && $.each(RepConvTool.getItem(RepConv.CookieEmots).split("\n"), function(h, l) {
        RepConvAdds.emotsLists.usersaved.detail.push({img:l});
      });
    }, 100);
    try {
      $("#grcrt_disable_quack").remove(), RepConv.settings[RepConv.Cookie + "_idle"] && $("head").append($("<style/>", {id:"grcrt_disable_quack"}).append("a.qt_activity {display: none !important;}"));
    } catch (h) {
    }
    $.Observer(GameEvents.grcrt.settings.load).publish();
    try {
      if (RepConv.settings[RepConv.Cookie + "_translate"] && "" != RepConv.settings[RepConv.Cookie + "_translate"]) {
        var c = Game.locale_lang.substring(0, 2);
        RepConvLangArray[c] = JSON.parse(RepConv.settings[RepConv.Cookie + "_translate"]);
        RepConv.Lang = RepConvLangArray[c];
        RepConv.LangEnv = c;
      }
    } catch (h) {
    }
    try {
      RepConv.settings[RepConv.Cookie + "_tacl"] ? ($("#toolbar_activity_commands_list").addClass("grcrt_tacl"), $("#grcrt_taclWrap").draggable().draggable("enable")) : ($("#toolbar_activity_commands_list").removeClass("grcrt_tacl"), $("#grcrt_taclWrap").draggable().draggable("disable").removeAttr("style"));
    } catch (h) {
    }
  };
  this.saveRemote = function() {
    RepConv.Debug && console.log("saveRemote");
    var c = $("<form/>", {action:RepConv.grcrt_domain + "savedata.php", method:"post", target:"GRCSender"}).append($("<textarea/>", {name:"dest"}).text(RepConv.hash)).append($("<textarea/>", {name:"param"}).text(btoa(JSON.stringify(RepConv.settings).replace(/[\u007f-\uffff]/g, function(h) {
      return "\\u" + ("0000" + h.charCodeAt(0).toString(16)).slice(-4);
    }))));
    $("#RepConvTMP").html(null);
    $("#RepConvTMP").append(c);
    c.submit();
    this.useSettings();
  };
  this.readRemote = function() {
    RepConv.Debug && console.log("readRemote");
    $.ajax({type:"POST", url:RepConv.grcrt_domain + "readdata.php", data:{dest:RepConv.hash}, dataType:"script", async:!1}).done(function() {
      RepConv.settingsReaded = !0;
      RepConvTool.checkSettings();
    });
  };
  this.setItem = function(c, h) {
    RepConv.Debug && console.log("setItem(" + c + ")");
    "object" == typeof RepConv.settings && (RepConv.settings[c] = h, RepConvTool.saveRemote());
  };
  this.getItem = function(c) {
    RepConv.Debug && console.log("getItem(" + c + ")");
    if ("object" == typeof RepConv.settings && "undefined" != typeof RepConv.settings[c]) {
      return RepConv.settings[c];
    }
    if ("function" == typeof GM_getValue) {
      return RepConv.Debug && console.log("... use GM"), "undefined" == GM_getValue(c) ? null : GM_getValue(c);
    }
    RepConv.Debug && console.log("... use LS");
    return "undefined" == localStorage.getItem(c) ? null : localStorage.getItem(c);
  };
  this.removeItem = function(c) {
    RepConv.Debug && console.log("removeItem(" + c + ")");
    "function" == typeof GM_deleteValue ? (RepConv.Debug && console.log("... use GM"), GM_deleteValue(c)) : (RepConv.Debug && console.log("... use LS"), localStorage.removeItem(c));
  };
  this.getSettings = function(c, h) {
    if (null != RepConvTool.getItem(c)) {
      return RepConvTool.getItem(c);
    }
    if (null != localStorage.getItem(c)) {
      return RepConvTool.setItem(c, localStorage.getItem(c)), RepConvTool.getItem(c);
    }
    RepConvTool.setItem(c, h);
    return RepConvTool.getItem(c);
  };
  this.GetLabel = function(c) {
    var h, l = c.split("."), m = RepConv.Lang;
    $.each(l, function(C, J) {
      C + 1 == l.length && void 0 != m[J] && (h = m[J]);
      m = m[J] || {};
    });
    return h || this.getLabelLangArray(c);
  };
  this.GetLabel4Lang = function(c, h) {
    var l, m = c.split("."), C = RepConvLangArray[h];
    $.each(m, function(J, I) {
      J + 1 == m.length && void 0 != C && void 0 != C[I] && (l = C[I]);
      C = void 0 != C && void 0 != C[I] ? C[I] : {};
    });
    return l || this.getLabelLangArray(c);
  };
  this.getLabelLangArray = function(c) {
    var h, l = c.split("."), m = RepConvLangArray.en;
    $.each(l, function(C, J) {
      C + 1 == l.length && void 0 != m[J] && (h = m[J]);
      m = m[J] || {};
    });
    return h || c;
  };
  this.getUnit = function(c, h, l) {
    for (var m = -1, C = 0; C < $(h).length; C++) {
      0 == C % l && (-1 < m && 0 < c[m].unit_list.length && (c[m].unit_img = RepConvTool.Adds(RepConv.Const.genImg.RCFormat(RepConvType.sign, c[m].unit_list), "img")), m++, c.Count = m);
      0 < c[m].unit_list.length && (c[m].unit_list += ".");
      var J = RepConvTool.getUnitName($(h)[C]);
      c[m].unit_list += RepConvTool.GetUnit(J);
      c[m].unit_img += RepConvTool.GetUnit(J);
      c[m].unit_send += RepConvTool.Unit($(h + " span.place_unit_black")[C].innerHTML, "000") + RepConvType.separator;
    }
    -1 < m && 0 < c[m].unit_list.length && (c[m].unit_img = RepConvTool.Adds(RepConv.Const.genImg.RCFormat(RepConvType.sign, c[m].unit_list), "img"));
    return c;
  };
  this.getUnitResource = function(c, h) {
    $.each($(h), function(l, m) {
      0 < c.unit_list.length && (c.unit_list += ".");
      0 < m.childElementCount && (l = RepConvTool.getUnitName(m.children[0]), l = RepConvTool.GetUnitCost(l), m = m.children[1].innerHTML.replace("-", ""), "?" != m && (c.w += l.w * parseInt(m), c.s += l.s * parseInt(m), c.i += l.i * parseInt(m), c.p += l.p * parseInt(m), c.f += l.f * parseInt(m)));
    });
    return c;
  };
  this.REPORTS = "report";
  this.WALL = "wall";
  this.AGORA = "agora";
  this.COMMANDLIST = "commandList";
  this.COMMAND = "command";
  this.CONQUER = "conquerold";
  this.groupsUnit = {defAtt:"div#building_wall li:nth-child(4) div.list_item_left div.wall_unit_container div.wall_report_unit", defDef:"div#building_wall li:nth-child(6) div.list_item_left div.wall_unit_container div.wall_report_unit", losAtt:"div#building_wall li:nth-child(4) div.list_item_right div.wall_unit_container div.wall_report_unit", losDef:"div#building_wall li:nth-child(6) div.list_item_right div.wall_unit_container div.wall_report_unit"};
  this.newVersion = function() {
    var c = "";
    null != RepConvTool.getItem(RepConv.CookieNew) && (c = RepConvTool.getItem(RepConv.CookieNew));
    c != RepConv.Scripts_version && GRCRT_Notifications.addNotification(NotificationType.GRCRTWHATSNEW);
  };
  this.Adds = function(c, h) {
    return void 0 != c && 0 < c.length ? "[" + h + "]" + c + "[/" + h + "]" : c;
  };
  this.AddSize = function(c, h) {
    return 0 < c.length && $("#BBCODEA").attr("checked") ? "[size=" + h + "]" + c + "[/size]" : c;
  };
  this.AddFont = function(c, h) {
    return 0 < c.length && "" != h ? "[font=" + h + "]" + c + "[/font]" : c;
  };
  this.White = function(c, h) {
    return RepConvType.blank.slice(1, h - c.length);
  };
  this.Color = function(c, h) {
    return "[color=#" + h + "]" + c + "[/color]";
  };
  this.Unit = function(c, h) {
    RepConv.Debug && console.log(c);
    return RepConvTool.White(c, RepConvType.unitDigits) + c;
  };
  this.Value = function(c, h) {
    return RepConvTool.White(String(c), h) + String(c);
  };
  this.getUnitName = function(c) {
    if (null != $(c).attr("style") && $(c).attr("style").replace(/.*\/([a-z_]*)_[0-9]*x[0-9]*\.png.*/, "$1") != $(c).attr("style")) {
      return $(c).attr("style").replace(/.*\/([a-z_]*)_[0-9]*x[0-9]*\.png.*/, "$1");
    }
    for (var h in GameData.units) {
      if ($(c).hasClass(h)) {
        return h.toString();
      }
    }
    for (h in GameData.heroes) {
      if ($(c).hasClass(h)) {
        return h.toString();
      }
    }
    for (h in GameData.buildings) {
      if ($(c).hasClass("building_" + h)) {
        return h.toString();
      }
    }
    for (h in RepConv.academyCode) {
      if ($(c).hasClass(h)) {
        return h.toString();
      }
    }
    return $(c).hasClass("unknown_naval") ? "unknown_naval" : "unknown";
  };
  this.getCommandIcon = function(c) {
    for (var h in RepConv.commandImage) {
      if ($(c).hasClass(RepConv.commandImage[h])) {
        return RepConvTool.Adds(RepConv.Const.uiImg + "c/" + RepConv.commandImage[h] + ".png", "img");
      }
    }
    return "";
  };
  this.getPowerIcon = function(c) {
    if (void 0 != $(c).attr("data-power-id")) {
      var h = "";
      void 0 != $(c).attr("data-power-configuration") && (h = 0 < $(c).attr("data-power-configuration").length ? "_l" + JSON.parse($(c).attr("data-power-configuration")).level : "");
      return RepConvTool.Adds(RepConv.Const.uiImg + "pm/" + $(c).attr("data-power-id") + h + ".png", "img");
    }
    for (h in RepConv.powerImage) {
      if ($(c).hasClass(RepConv.powerImage[h])) {
        return RepConvTool.Adds(RepConv.Const.uiImg + "pm/" + RepConv.powerImage[h] + ".png", "img");
      }
    }
    return "";
  };
  this.GetUnit = function(c) {
    return RepConv.unitsCode[c] || "XX";
  };
  this.GetUnitCost = function(c, h) {
    try {
      return _ratio = h || 1, {w:Math.round(GameData.units[c].resources.wood * _ratio), s:Math.round(GameData.units[c].resources.stone * _ratio), i:Math.round(GameData.units[c].resources.iron * _ratio), p:GameData.units[c].population, f:Math.round(GameData.units[c].favor * _ratio)};
    } catch (l) {
      return {w:0, s:0, i:0, p:0, f:0};
    }
  };
  this.GetBuild = function(c) {
    return RepConv.buildCode[c] || "XX";
  };
  this.GetImageCode = function(c) {
    return RepConv.buildCode[c] || RepConv.unitsCode[c] || RepConv.academyCode[c] || "XX";
  };
  this.AddBtn = function(c, h) {
    h = h || "";
    c = $("<div/>", {"class":"button_new", id:c + h, name:RepConvTool.GetLabel(c), style:"float: right; margin: 2px; ", rel:"#" + h}).button({caption:RepConvTool.GetLabel(c), template:RepConv.settings[RepConv.Cookie + "_imgBtn"] ? "tpl_grcrt_button" : "tpl_button"});
    RepConv.Debug && console.log(h);
    return c;
  };
  this.TownObj = "";
  this.Ramka = function(c, h, l) {
    l = l || 300;
    c = $("<div/>", {"class":"game_border"}).append($("<div/>", {"class":"game_border_top"})).append($("<div/>", {"class":"game_border_bottom"})).append($("<div/>", {"class":"game_border_left"})).append($("<div/>", {"class":"game_border_right"})).append($("<div/>", {"class":"game_border_corner corner1"})).append($("<div/>", {"class":"game_border_corner corner2"})).append($("<div/>", {"class":"game_border_corner corner3"})).append($("<div/>", {"class":"game_border_corner corner4"})).append($("<div/>", 
    {"class":"game_header bold", style:"height:18px;"}).append($("<div/>", {style:"float:left; padding-right:10px;"}).html(c)));
    l = l - 18 - 8 - 8;
    $(c).append($("<div/>", {"class":"grcrt_frame", style:"overflow-x: hidden; padding-left: 5px; position: relative;"}).html(h).height(l || 300));
    $(c).append($("<div/>", {"class":"game_list_footer", id:"RepConvBtns", style:"display: none;"}));
    return $("<div/>", {"class":"inner_box"}).append(c);
  };
  this.RamkaLight = function(c, h) {
    var l = $("<div/>");
    $(l).append($("<div/>", {"class":"box top left"}).append($("<div/>", {"class":"box top right"}).append($("<div/>", {"class":"box top center"})))).append($("<div/>", {"class":"box middle left"}).append($("<div/>", {"class":"box middle right"}).append($("<div/>", {"class":"box middle center"}).append($("<span/>", {"class":"town_name"}).html(c)).append($("<div/>", {"class":"box_content"}).html(h))))).append($("<div/>", {"class":"box bottom left"}).append($("<div/>", {"class":"box bottom right"}).append($("<div/>", 
    {"class":"box bottom center"}))));
    return l;
  };
  this.insertBBcode = function(c, h, l) {
    $(l).focus();
    if ("undefined" != typeof document.selection) {
      l = document.selection.createRange();
      var m = l.text;
      l.text = c + m + h;
      l = document.selection.createRange();
      0 == m.length ? l.move("character", -h.length) : l.moveStart("character", c.length + m.length + h.length);
      l.select();
    } else {
      if ("undefined" != typeof l.selectionStart) {
        l.focus();
        var C = l.selectionStart, J = l.selectionEnd, I = l.scrollTop, E = l.scrollHeight;
        m = l.value.substring(C, J);
        l.value = l.value.substr(0, C) + c + m + h + l.value.substr(J);
        c = 0 == m.length ? C + c.length : C + c.length + m.length + h.length;
        l.selectionStart = c;
        l.selectionEnd = c;
        l.scrollTop = I + l.scrollHeight - E;
      }
    }
  };
  this.addsEmots = function(c, h, l) {
    0 == c.getJQElement().find("#emots_popup_" + c.type).length && (c.getJQElement().find($(".bb_button_wrapper")).append($("<div/>", {id:"emots_popup_" + c.type, style:"display:none; z-index: 5000;"}).append($("<div/>", {"class":"bbcode_box middle_center"}).append($("<div/>", {"class":"bbcode_box top_left"})).append($("<div/>", {"class":"bbcode_box top_right"})).append($("<div/>", {"class":"bbcode_box top_center"})).append($("<div/>", {"class":"bbcode_box bottom_center"})).append($("<div/>", {"class":"bbcode_box bottom_right"})).append($("<div/>", 
    {"class":"bbcode_box bottom_left"})).append($("<div/>", {"class":"bbcode_box middle_left"})).append($("<div/>", {"class":"bbcode_box middle_right"})).append($("<div/>", {"class":"bbcode_box content clearfix", style:"overflow-y:auto !important; max-height: 185px;"}))).css({position:"absolute", top:"27px", left:"455px", width:"300px"})), $.each(RepConvAdds.emots, function(m, C) {
      c.getJQElement().find("#emots_popup_" + c.type + " .content").append($("<img/>", {src:C.img, title:C.title}).click(function() {
        RepConvTool.insertBBcode("[img]" + $(this).attr("src") + "[/img]", "", c.getJQElement().find(l)[0]);
        $("#emots_popup_" + c.type).toggle();
      }));
    }), c.getJQElement().find(h).append($("<img/>", {src:RepConv.Scripts_url + "emots/usmiech.gif", style:"cursor: pointer;"}).click(function() {
      $("#emots_popup_" + c.type).toggle();
    })), c.getJQElement().find(h).append($("<img/>", {src:RepConv.Const.uiImg + "paste_report.png", style:"cursor: pointer;"}).click(function() {
      void 0 != RepConv.ClipBoard && RepConvTool.insertBBcode(RepConv.ClipBoard, "", c.getJQElement().find(l)[0]);
    }).mousePopup(new MousePopup(RepConvTool.GetLabel("POPINSERTLASTREPORT")))));
  };
  this.loadPower = function() {
    RepConv.active.power && (RepConv.Debug && console.log("loadPower"), $.each($("div.gods_spells_menu .god_container div.new_ui_power_icon div[name=counter]"), function(c, h) {
      $(h).remove();
    }), $.each($("div.gods_spells_menu .god_container div.new_ui_power_icon.disabled"), function(c, h) {
      power = GameData.powers[$(h).attr("data-power_id")];
      god = MM.checkAndPublishRawModel("PlayerGods", {id:Game.player_id}).getCurrentProductionOverview()[power.god_id];
      _godCurr = MM.checkAndPublishRawModel("PlayerGods", {id:Game.player_id})[power.god_id + "_favor_delta_property"].calculateCurrentValue().unprocessedCurrentValue;
      marg = 27;
      0 < god.production && $(h).append($("<div/>", {style:"margin-top:" + marg + "px;color:white;text-shadow: 1px 1px 1px black;font-size:7px;z-index:3000;", name:"counter"}).countdown(Timestamp.server() + (power.favor - _godCurr) / god.production * 3600));
    }));
  };
  this.BBC2HTML = function(c) {
    function h(N, U) {
      for (var fa in U) {
        N = N.replace(new RegExp(fa, "g"), U[fa]);
      }
      return N;
    }
    function l(N) {
      N = N.replace('"', "").split(",");
      var U = "";
      $.each(N, function(fa, Z) {
        y = Z.split(":");
        U += " " + y[0] + '="' + y[1] + '"';
      });
      return U;
    }
    function m(N, U, fa, Z) {
      Z && -1 < Z.indexOf("[") && (Z = Z.replace(C, m));
      switch(U) {
        case "url":
        case "anchor":
        case "email":
          return "<a " + I[U] + (fa || Z) + '">' + Z + "</a>";
        case "img":
          return N = J.exec(fa), '<img src="' + Z + '"' + (N ? ' width="' + N[1] + '" height="' + N[2] + '"' : "") + ' alt="' + (N ? "" : fa) + '" />';
        case "flash":
        case "youtube":
          return N = J.exec(fa) || [0, 425, 366], '<object type="application/x-shockwave-flash" data="' + O[U] + Z + '" width="' + N[1] + '" height="' + N[2] + '"><param name="movie" value="' + O[U] + Z + '" /></object>';
        case "float":
          return '<span style="float: ' + fa + '">' + Z + "</span>";
        case "left":
        case "right":
        case "center":
        case "justify":
          return '<div style="text-align: ' + U + '">' + Z + "</div>";
        case "google":
        case "wikipedia":
          return '<a href="' + E[U] + Z + '">' + Z + "</a>";
        case "b":
        case "i":
        case "u":
        case "s":
        case "sup":
        case "sub":
        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "h6":
        case "table":
        case "tr":
        case "th":
        case "td":
          return N = "", void 0 != fa && (N = l(fa)), "<" + U + N + ">" + Z + "</" + U + ">";
        case "row":
        case "r":
        case "header":
        case "head":
        case "h":
        case "col":
        case "c":
          return "<" + n[U] + ">" + Z + "</" + n[U] + ">";
        case "acronym":
        case "abbr":
          return "<" + U + ' title="' + fa + '">' + Z + "</" + U + ">";
      }
      return "[" + U + (fa ? "=" + fa : "") + "]" + Z + "[/" + U + "]";
    }
    if (0 > c.indexOf("[")) {
      return c;
    }
    var C = /\[([a-z][a-z0-9]*)(?:=([^\]]+))?]((?:.|[\r\n])*?)\[\/\1]/g, J = RegExp("^(\\d+)x(\\d+)$", void 0), I = {url:'href="', anchor:'name="', email:'href="mailto: '}, E = {google:"http://www.google.com/search?q=", wikipedia:"http://www.wikipedia.org/wiki/"}, O = {youtube:"http://www.youtube.com/v/", flash:""}, n = {row:"tr", r:"tr", header:"th", head:"th", h:"th", col:"td", c:"td"}, t = {notag:[{"\\[":"&#91;", "]":"&#93;"}, "", ""], code:[{"<":"&lt;"}, "<code><pre>", "</pre></code>"]};
    t.php = [t.code[0], t.code[1] + "&lt;?php ", "?>" + t.code[2]];
    var q = {font:"font-family:$1", size:"font-size:$1px", color:"color:$1"}, x = {c:"circle", d:"disc", s:"square", 1:"decimal", a:"lower-alpha", A:"upper-alpha", i:"lower-roman", I:"upper-roman"}, z = {}, B = {}, Q;
    for (Q in t) {
      z["\\[(" + Q + ")]((?:.|[\r\n])*?)\\[/\\1]"] = function(N, U, fa) {
        return t[U][1] + h(fa, t[U][0]) + t[U][2];
      };
    }
    for (Q in q) {
      B["\\[" + Q + "=([^\\]]+)]"] = '<span style="' + q[Q] + '">', B["\\[/" + Q + "]"] = "</span>";
    }
    B["\\[list]"] = "<ul>";
    B["\\[list=(\\w)]"] = function(N, U) {
      return '<ul style="list-style-type: ' + (x[U] || "disc") + '">';
    };
    B["\\[/list]"] = "</ul>";
    B["\\[\\*]"] = "<li>";
    B["\\[quote(?:=([^\\]]+))?]"] = function(N, U) {
      return '<div class="bb-quote">' + (U ? U + " wrote" : "Quote") + ":<blockquote>";
    };
    B["\\[/quote]"] = "</blockquote></div>";
    B["\\[(hr|br)]"] = "<$1 />";
    B["\\[sp]"] = "&nbsp;";
    return h(h(c, z), B).replace(C, m);
  };
  this.addLine = function(c) {
    return "[img]" + RepConv.Const.unitImg + c + ".png[/img]";
  };
  this.Atob = function(c) {
    c = c.split(/#/);
    return atob(c[1] || c[0]);
  };
  this.getCaller = function(c) {
    c = c.substr(9);
    return c = c.substr(0, c.indexOf("("));
  };
  this.hexToRGB = function(c, h) {
    var l = parseInt(c.slice(1, 3), 16), m = parseInt(c.slice(3, 5), 16);
    c = parseInt(c.slice(5, 7), 16);
    return h ? "rgba(" + l + ", " + m + ", " + c + ", " + h + ")" : "rgb(" + l + ", " + m + ", " + c + ")";
  };
  this.getPlayerColor = function(c, h) {
    var l = MM.getOnlyCollectionByName("CustomColor"), m = require("helpers/default_colors"), C = require("enums/filters");
    c = JSON.parse(RepConvTool.Atob(c));
    var J = void 0;
    c.id == Game.player_id && (J = m.getDefaultColorForPlayer(Game.player_id));
    J || (J = l.getCustomColorByIdAndType(C.FILTER_TYPES.PLAYER, c.id) && l.getCustomColorByIdAndType(C.FILTER_TYPES.PLAYER, c.id).getColor());
    J || (J = RepConvTool.getPlayerData(c.id) && RepConvTool.getPlayerData(c.id).alliance_id ? RepConvTool.getPlayerData(c.id).alliance_id == Game.alliance_id ? l.getCustomColorByIdAndType(C.ALLIANCE_TYPES.OWN_ALLIANCE, RepConvTool.getPlayerData(c.id).alliance_id) && l.getCustomColorByIdAndType(C.ALLIANCE_TYPES.OWN_ALLIANCE, RepConvTool.getPlayerData(c.id).alliance_id).getColor() || m.getDefaultColorForAlliance(RepConvTool.getPlayerData(c.id).alliance_id) : h[RepConvTool.getPlayerData(c.id).alliance_id] && 
    (l.getCustomColorByIdAndType(C.FILTER_TYPES[h[RepConvTool.getPlayerData(c.id).alliance_id]], RepConvTool.getPlayerData(c.id).alliance_id) && l.getCustomColorByIdAndType(C.FILTER_TYPES[h[RepConvTool.getPlayerData(c.id).alliance_id]], RepConvTool.getPlayerData(c.id).alliance_id).getColor() || m.getDefaultColorForAlliance(RepConvTool.getPlayerData(c.id).alliance_id)) || RepConvTool.getPlayerData(c.id).alliance_id && (l.getCustomColorByIdAndType(C.FILTER_TYPES.ALLIANCE, RepConvTool.getPlayerData(c.id).alliance_id) && 
    l.getCustomColorByIdAndType(C.FILTER_TYPES.ALLIANCE, RepConvTool.getPlayerData(c.id).alliance_id).getColor() || m.getDefaultColorForAlliance(RepConvTool.getPlayerData(c.id).alliance_id)) : m.getDefaultColorForPlayer(c.id, Game.player_id));
    return J;
  };
  $("<iframe/>", {id:"GRCSender", name:"GRCSender", style:"display:none"}).appendTo($("body"));
  f();
  setInterval(function() {
    f();
  }, 6E5);
  this.getPlayerData = function(c) {
    try {
      return RepConv.cachePlayers[c];
    } catch (h) {
    }
    return null;
  };
  this.getAllianceData = function(c) {
    try {
      return RepConv.cacheAlliances[c];
    } catch (h) {
    }
    return null;
  };
  $("#tpl_grcrt_button").remove();
  $("head").append($("<script/>", {type:"text/template", id:"tpl_grcrt_button"}).text('<div class="left"></div><div class="right"></div><div class="caption js-caption"><% if (icon && icon_position === \'left\') { %><div class="icon"></div><% } %><img src="https://cdn.grcrt.net/img/octopus.png" style="width: 20px;float:left;margin: 0px 5px 0px -6px"><%= caption %><% if (icon && icon_position === \'right\') { %><div class="icon"></div><% } %><div class="effect js-effect"></div></div>'));
}
function _GRCRTConverterCtrl(f) {
  function A(d) {
    if ("undefined" == typeof d.getController) {
      return d.getType();
    }
    switch(d.getController()) {
      case "building_place":
        switch(d.getContext().sub) {
          case "building_place_index":
            return "agoraD";
          case "building_place_units_beyond":
            return "agoraS";
        }break;
      case "building_wall":
        return "wall";
      case "command_info":
        switch(d.getContext().sub) {
          case "command_info_colonization_info":
          case "command_info_info":
            return "command";
          case "command_info_conquest_info":
            return "conquerold";
          case "command_info_conquest_movements":
            return "conqueroldtroops";
        }break;
      case "report":
        switch(d.getContext().sub) {
          case "report_view":
            return d = m(v.find($("div#report_arrow img")).attr("src")), "attack" == d && 0 != v.find($("div.support_report_summary")).length && (d = "attackSupport"), d;
        }break;
      case "town_info":
        switch(d.getContext().sub) {
          case "town_info_support":
            return "ownTropsInTheCity";
        }break;
      case "town_overviews":
        return "commandList";
      case "conquest_info":
        return "conquest";
      case "island_info":
        switch(d.getContext().sub) {
          case "island_info_index":
            return "bbcode_island";
        }case "player":
        switch(d.getContext().sub) {
          case "player_get_profile_html":
            return "bbcode_player";
        }break;
      case "alliance":
        switch(d.getContext().sub) {
          case "alliance_profile":
            return "bbcode_alliance";
        }break;
      case "building_main":
        return "main";
    }
    return "";
  }
  function c(d, r, w) {
    return $("<div/>", {"class":"checkbox_new"}).checkbox({caption:RepConvTool.GetLabel(w || d), checked:r, cid:d}).on("cbx:check", function() {
      va();
    });
  }
  function h(d, r, w, H) {
    $.each(d, function(L, P) {
      l(P, r, w, H);
    });
  }
  function l(d, r, w, H) {
    if ("undefined" != typeof d.ua && 0 < d.ua.length) {
      r = r || GRCRTtpl.rct.genImgS;
      w = w || GRCRTtpl.rct.genImgM;
      H = H || GRCRTtpl.rct.genImgS / 50 * 11;
      var L = $.md5(C(d.ua, r, w, H));
      d.img_url = RepConvTool.Adds(J(L), "img");
      RepConv.Debug && console.log(L);
      $.ajax({type:"POST", url:RepConv.grcrt_domain + "imgdata.php", data:{param:btoa(C(d.ua, r, w, H)), dest:L}, dataType:"script", async:!1});
    }
  }
  function m(d) {
    RepConv.Debug && console.log("getType");
    var r = null;
    $.each("raise conquer illusion breach attack take_over conqueroldtroops commandList conquerold support attackSupport agoraD agoraS espionage powers wall found conquest academy main ownTropsInTheCity".split(" "), function(w, H) {
      -1 < d.indexOf(H) && (r = H);
    });
    return r;
  }
  function C(d, r, w, H) {
    return JSON.stringify({ua:d, s:r, m:w, fs:H || GRCRTtpl.rct.genImgS / 50 * 11});
  }
  function J(d) {
    return RepConv.grcrt_domain + "_img_cache_/" + d.substr(0, 2) + "/" + d + ".png";
  }
  function I(d) {
    function r(xa, ka) {
      for (var Ca in ka) {
        xa = xa.replace(new RegExp(Ca, "g"), ka[Ca]);
      }
      return xa;
    }
    function w(xa) {
      xa = xa.replace('"', "").split(",");
      var ka = "";
      $.each(xa, function(Ca, ra) {
        Ca = ra.split(":");
        ka += " " + Ca[0] + '="' + Ca[1] + '"';
      });
      return ka;
    }
    function H(xa, ka, Ca, ra) {
      ra && -1 < ra.indexOf("[") && (ra = ra.replace(L, H));
      switch(ka) {
        case "url":
        case "anchor":
        case "email":
          return "<a " + F[ka] + (Ca || ra) + '">' + ra + "</a>";
        case "img":
          return xa = P.exec(Ca), '<img src="' + ra + '"' + (xa ? ' width="' + xa[1] + '" height="' + xa[2] + '"' : "") + ' alt="' + (xa ? "" : Ca) + '" />';
        case "flash":
        case "youtube":
          return xa = P.exec(Ca) || [0, 425, 366], '<object type="application/x-shockwave-flash" data="' + S[ka] + ra + '" width="' + xa[1] + '" height="' + xa[2] + '"><param name="movie" value="' + S[ka] + ra + '" /></object>';
        case "float":
          return '<span style="float: ' + Ca + '">' + ra + "</span>";
        case "left":
        case "right":
        case "center":
        case "justify":
          return '<div style="text-align: ' + ka + '">' + ra + "</div>";
        case "google":
        case "wikipedia":
          return '<a href="' + ca[ka] + ra + '">' + ra + "</a>";
        case "b":
        case "i":
        case "u":
        case "s":
        case "sup":
        case "sub":
        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "h6":
        case "table":
        case "tr":
        case "th":
        case "td":
          return xa = "", void 0 != Ca && (xa = w(Ca)), "<" + ka + xa + ">" + ra + "</" + ka + ">";
        case "row":
        case "r":
        case "header":
        case "head":
        case "h":
        case "col":
        case "c":
          return "<" + Qa[ka] + ">" + ra + "</" + Qa[ka] + ">";
        case "acronym":
        case "abbr":
          return "<" + ka + ' title="' + Ca + '">' + ra + "</" + ka + ">";
      }
      return "[" + ka + (Ca ? "=" + Ca : "") + "]" + ra + "[/" + ka + "]";
    }
    if (0 > d.indexOf("[")) {
      return d;
    }
    var L = /\[([a-z][a-z0-9]*)(?:=([^\]]+))?]((?:.|[\r\n])*?)\[\/\1]/g, P = RegExp("^(\\d+)x(\\d+)$", void 0), F = {url:'href="', anchor:'name="', email:'href="mailto: '}, ca = {google:"http://www.google.com/search?q=", wikipedia:"http://www.wikipedia.org/wiki/"}, S = {youtube:"http://www.youtube.com/v/", flash:""}, Qa = {row:"tr", r:"tr", header:"th", head:"th", h:"th", col:"td", c:"td"}, Ga = {notag:[{"\\[":"&#91;", "]":"&#93;"}, "", ""], code:[{"<":"&lt;"}, "<code><pre>", "</pre></code>"]};
    Ga.php = [Ga.code[0], Ga.code[1] + "&lt;?php ", "?>" + Ga.code[2]];
    var Xa = {font:"font-family:$1", size:"font-size:$1px", color:"color:$1"}, ya = {c:"circle", d:"disc", s:"square", 1:"decimal", a:"lower-alpha", A:"upper-alpha", i:"lower-roman", I:"upper-roman"}, Da = {}, La = {}, sa;
    for (sa in Ga) {
      Da["\\[(" + sa + ")]((?:.|[\r\n])*?)\\[/\\1]"] = function(xa, ka, Ca) {
        return Ga[ka][1] + r(Ca, Ga[ka][0]) + Ga[ka][2];
      };
    }
    for (sa in Xa) {
      La["\\[" + sa + "=([^\\]]+)]"] = '<span style="' + Xa[sa] + '">', La["\\[/" + sa + "]"] = "</span>";
    }
    La["\\[list]"] = "<ul>";
    La["\\[list=(\\w)]"] = function(xa, ka) {
      return '<ul style="list-style-type: ' + (ya[ka] || "disc") + '">';
    };
    La["\\[/list]"] = "</ul>";
    La["\\[\\*]"] = "<li>";
    La["\\[quote(?:=([^\\]]+))?]"] = function(xa, ka) {
      return '<div class="bb-quote">' + (ka ? ka + " wrote" : "Quote") + ":<blockquote>";
    };
    La["\\[/quote]"] = "</blockquote></div>";
    La["\\[(hr|br)]"] = "<$1 />";
    La["\\[sp]"] = "&nbsp;";
    return r(r(d, Da), La).replace(L, H);
  }
  function E(d, r) {
    RepConv.Debug && console.log("bbcode2html");
    var w = {message:d};
    RepConv.Debug && console.log(d.length);
    gpAjax._ajax("message", "preview", w, !0, function(H) {
      RepConv.Debug && console.log(H.message);
      $(r).html(H.message);
    }, "post");
  }
  function O(d, r) {
    RepConv.Debug && console.log("bbcode2img");
    d = $.ajax({url:RepConv.grcrt_domain + "bbcode2html.php?ModPagespeed=off", method:"post", data:{html:RepConv.__repconvValueBBCode}, cache:!1, async:!1});
    return "[img]" + RepConv.grcrt_domain + "_rep_img_/" + d.responseJSON.filename.substr(0, 2) + "/" + d.responseJSON.filename + ".png[/img]\n\n";
  }
  function n(d) {
    1 == $("#repConvArea").length && $("#repConvArea").remove();
    1 == $("#RepConvDivPrev").length && $("#RepConvDivPrev").remove();
    var r = "BBCODEI" == g.getValue() ? O(d, H) : null, w = $("<textarea/>", {style:RepConv.Const.textareastyle, id:"repConvArea", readonly:"readonly", }).text("BBCODEI" == g.getValue() ? r : d).click(function() {
      this.select();
    }).height(p - 6).hide(), H = $("<span/>", {"class":"monospace", id:"RepConvSpanPrev"}), L = $("<div/>", {style:"background-color: #fff; height: 225px; width: 753px; overflow-y: scroll; font-size: 100%;", id:"RepConvDivPrev", "class":"quote_message small "}).width("BBCODEA" == g.getValue() ? 805 : 777).css("padding", "BBCODEA" == g.getValue() ? "0px" : "0 15px").height(p).append(H);
    "BBCODEH" == u.getValue() && "BBCODEE" == g.getValue() ? $(H).append(I(d)) : (E("BBCODEI" == g.getValue() ? r : d, H), "BBCODEI" == g.getValue() && (RepConv.__repconvValueArray = [r], RepConv.__repconvHtmlArray = null));
    $("#RepConvAreas div.box_content").append(w);
    $("#RepConvAreas div.box_content").append(L);
    "BBCODEE" != g.getValue() && (RepConv.ClipBoard = d, $("#RepConvBtns div.RepConvMsg").html(RepConvTool.GetLabel("MSGCOPYREPORT").replace("[paste_icon]", '<img src="' + RepConv.Const.uiImg + 'paste_report.png" style="vertical-align: text-top;"/>')).fadeOut(50).fadeIn(500));
  }
  function t(d, r) {
    "BBCODEH" == u.getValue() && "BBCODEE" == g.getValue() || "BBCODEI" == g.getValue() || (RepConv["__repconvHtmlArray" + r] = [], $.each(d, function(w, H) {
      $("<div/>");
      w = {message:H};
      RepConv.Debug && console.log(H.length);
      gpAjax._ajax("message", "preview", w, !0, function(L) {
        RepConv.Debug && console.log(L.message);
        RepConv["__repconvHtmlArray" + r].push(L.message);
      }, "post");
    }));
  }
  function q() {
    RepConv.Debug && console.log("__getReportTitle");
    a.title = v.find($("#report_report_header")).html().stripTags().replace("&nbsp;", " ").trim();
  }
  function x() {
    RepConv.Debug && console.log("__getReportTime");
    a.time = "(" + v.find($("#report_date")).html() + ") ";
  }
  function z() {
    RepConv.Debug && console.log("__getReportType");
    B();
  }
  function B() {
    RepConv.Debug && console.log("__getReportMorale");
    a.morale = 0 == v.find($("span.fight_bonus.morale")).length ? "" : GRCRTtpl.rct.morale + v.find($("span.fight_bonus.morale")).html().stripTags().trim();
  }
  function Q() {
    RepConv.Debug && console.log("__getReportLuck");
    a.luck = 0 == v.find($("span.fight_bonus.luck")).length ? "" : GRCRTtpl.rct.luck + v.find($("span.fight_bonus.luck")).html().stripTags().trim();
    -1 < a.luck.indexOf("-") && (a.luck = "[color=#b50307]" + a.luck + "[/color]");
  }
  function N() {
    RepConv.Debug && console.log("__getReportOldWall");
    a.oldwall = {};
    0 == v.find($("span.fight_bonus.oldwall")).length ? a.oldwall[0] = "" : $.each(v.find($("span.fight_bonus.oldwall")), function(d, r) {
      a.oldwall[d] = $(r).html().stripTags().trim();
    });
  }
  function U() {
    RepConv.Debug && console.log("__getReportNightBonus");
    a.nightbonus = 0 == v.find($("span.fight_bonus.nightbonus")).length ? "" : GRCRTtpl.rct.nightbonus + v.find($("span.fight_bonus.nightbonus")).html().stripTags().trim();
  }
  function fa() {
    RepConv.Debug && console.log("__getReportResources");
    var d = {};
    a.resources = X();
    a.resources.title = (0 == v.find($("div#resources h4")).length ? v.find($("div#resources p")).html() : v.find($("div#resources h4")).html()) || " ";
    $.each(v.find($("div#resources li.res_background div")), function(r, w) {
      switch(w.className) {
        case "wood_img":
          d = {i:"S1", b:$(w).nextAll().text()};
          a.resources.ua.push(d);
          a.resources.wood = $(w).nextAll().text();
          break;
        case "stone_img":
          d = {i:"S2", b:$(w).nextAll().text()};
          a.resources.ua.push(d);
          a.resources.stone = $(w).nextAll().text();
          break;
        case "iron_img":
          d = {i:"S3", b:$(w).nextAll().text()};
          a.resources.ua.push(d);
          a.resources.iron = $(w).nextAll().text();
          break;
        case "favor_img":
          d = {i:"S4", b:$(w).nextAll().text()}, a.resources.ua.push(d), a.resources.power = $(w).nextAll().text();
      }
    });
    l(a.resources, 30, GRCRTtpl.rct.genImgM + 5, 7.5);
  }
  function Z() {
    RepConv.Debug && console.log("__getReportResources2");
    var d = {};
    a.resources = X();
    a.resources.title = v.find($("#right_side>h4")).eq(1).html() || " ";
    $.each(v.find($("#right_side>div.spy_success_left_align")).eq(1).find($("li.res_background div")), function(r, w) {
      switch(w.className) {
        case "wood_img":
          d = {i:"S1", b:$(w).nextAll().text()};
          a.resources.ua.push(d);
          a.resources.wood = $(w).nextAll().text();
          break;
        case "stone_img":
          d = {i:"S2", b:$(w).nextAll().text()};
          a.resources.ua.push(d);
          a.resources.stone = $(w).nextAll().text();
          break;
        case "iron_img":
          d = {i:"S3", b:$(w).nextAll().text()};
          a.resources.ua.push(d);
          a.resources.iron = $(w).nextAll().text();
          break;
        case "favor_img":
          d = {i:"S4", b:$(w).nextAll().text()}, a.resources.ua.push(d), a.resources.power = $(w).nextAll().text();
      }
    });
    l(a.resources, 30, GRCRTtpl.rct.genImgM + 5, 7.5);
  }
  function Y() {
    RepConv.Debug && console.log("__getReportBunt");
    a.bunt = "";
    0 == v.find($("div#resources h4")).length && 1 == v.find($("div#resources>span")).length ? a.bunt = v.find($("div#resources>span")).html().stripTags() : 1 == v.find($("div#resources>h4")).length && 2 == v.find($("div#resources>span")).length ? a.bunt = v.find($("div#resources>span")).eq(1).html().stripTags() : 1 == v.find($("div#resources>h4")).length && 1 == v.find($("div#resources>span")).length && (a.bunt = v.find($("div#resources>span")).eq(0).html().stripTags());
  }
  function V(d, r) {
    var w = "CS_" + d + "_" + r.id;
    if (sessionStorage.getItem(w) && JSON.parse(sessionStorage.getItem(w)).timestamp + 600 > Timestamp.server()) {
      return JSON.parse(sessionStorage.getItem(w)).CsTime;
    }
    var H = {}, L = {player_id:d, town_id:Game.townId, nl_init:NotificationLoader.isGameInitialized()};
    d = $.ajax({url:"/game/player?action=get_profile_html&town_id=" + Game.townId + "&h=" + Game.csrfToken + "&json=" + JSON.stringify(L), async:!1});
    var P = null, F = Math.floor(Math.sqrt(Math.pow(100, 2) + Math.pow(100, 2)));
    d = $("<pre/>").append(JSON.parse(d.responseText).plain.html);
    $.each(d.find(".gp_town_link"), function(ca, S) {
      ca = JSON.parse(RepConvTool.Atob($(S).attr("href")));
      S = Math.floor(Math.sqrt(Math.pow(r.ix - ca.ix, 2) + Math.pow(r.iy - ca.iy, 2)));
      F = Math.min(F, S);
      void 0 == H[S] && (H[S] = {});
      void 0 == H[S][ca.id] && (H[S][ca.id] = {});
      H[S][ca.id].id = ca.id;
      H[S][ca.id].name = ca.name;
    });
    $.each(H[F], function(ca, S) {
      L = {id:ca, town_id:r.id, nl_init:NotificationLoader.isGameInitialized()};
      $.ajax({url:"/game/town_info?town_id=" + r.id + "&action=attack&h=" + Game.csrfToken + "&json=" + JSON.stringify(L), async:!1, complete:function(Qa) {
        Qa = JSON.parse(Qa.responseText).json.json.units.colonize_ship.duration_without_bonus;
        P = Math.min(P || Qa, Qa);
      }});
    });
    sessionStorage.setItem(w, JSON.stringify({timestamp:Timestamp.server() + 600, CsTime:P}));
    return P;
  }
  function T() {
    RepConv.Debug && console.log("__initUnit");
    return {unit_img:"", unit_send:"", unit_lost:"", unit_list:"", unit_diff:"", ua:[], img_url:RepConvTool.GetLabel("NOTUNIT")};
  }
  function R() {
    RepConv.Debug && console.log("__initUnitDetail");
    return {unit_img:"", unit_send:"", unit_lost:"", unit_list:"", unit_diff:"", w:0, s:0, i:0, p:0, f:0, ua:[]};
  }
  function X() {
    RepConv.Debug && console.log("__initResources");
    return {title:"", detail:"", image:"", count:"", wood:"0", stone:"0", iron:"0", power:"0", ua:[]};
  }
  function aa(d, r, w) {
    RepConv.Debug && console.log("__getUnitDetail2Way");
    var H = 0, L = 0;
    w = "undefined" !== typeof w ? w : 5;
    a[d].full = T();
    a[d].splits = {};
    a[d].splits[1] = T();
    $.each(v.find($(r)), function(P, F) {
      if (0 < F.childElementCount) {
        P = RepConvTool.getUnitName($(F).find(".report_unit"));
        var ca = RepConvTool.GetUnitCost(P), S = $(F).find(".report_losts").html().replace("-", "");
        "?" == S ? S = 0 : (a[d].w += ca.w * parseInt(S), a[d].s += ca.s * parseInt(S), a[d].i += ca.i * parseInt(S), a[d].p += ca.p * parseInt(S), a[d].f += ca.f * parseInt(S));
        0 == H % w && (H = 0, L++);
        void 0 == a[d].splits[L] && (a[d].splits[L] = T());
        F = {i:RepConvTool.GetUnit(P), b:$(F).find(".report_unit>span").html(), r:S};
        a[d].full.ua.push(F);
        a[d].splits[L].ua.push(F);
        H++;
      }
    });
    l(a[d].full);
    h(a[d].splits);
  }
  function ia(d, r, w) {
    RepConv.Debug && console.log("__getUnitDetail1Way");
    var H = 0, L = 0;
    w = "undefined" !== typeof w ? w : 5;
    a[d].full = T();
    a[d].splits = {};
    a[d].splits[1] = T();
    $.each(v.find($(r)), function(P, F) {
      P = RepConvTool.getUnitName($(F));
      RepConvTool.GetUnitCost(P);
      0 == H % w && (H = 0, L++);
      void 0 == a[d].splits[L] && (a[d].splits[L] = T());
      F = {i:RepConvTool.GetUnit(P), b:(0 < $(F).children("div.value").length ? $(F).children("div.value") : $(F).children("span")).html()};
      a[d].full.ua.push(F);
      a[d].splits[L].ua.push(F);
      H++;
    });
    l(a[d].full);
    h(a[d].splits);
  }
  function la(d, r, w) {
    RepConv.Debug && console.log("__getBuildDetail1Way");
    var H = 0, L = 0;
    w = "undefined" !== typeof w ? w : 5;
    a[d].full = T();
    a[d].splits = {};
    $.each(v.find($(r)), function(P, F) {
      P = RepConvTool.getUnitName($(F));
      RepConvTool.GetUnitCost(P);
      0 == H % w && (H = 0, L++);
      void 0 == a[d].splits[L] && (a[d].splits[L] = T());
      F = {i:RepConvTool.GetBuild(P), b:$(F).children("span").html()};
      a[d].full.ua.push(F);
      a[d].splits[L].ua.push(F);
      H++;
    });
    l(a[d].full);
    h(a[d].splits);
  }
  function da(d) {
    RepConv.Debug && console.log("getPlayerInfo");
    return {town:Ma(d), player:Na(d), ally:Ea(d), townName:qa(d), playerName:za(d)};
  }
  function W(d, r) {
    RepConv.Debug && console.log("getPlayerInfo2");
    void 0 == d && (d = {});
    d.town = Ma(r);
    d.town_type = Ka(r);
    d.player = "town" == d.town_type || "powers" == b ? Na(r) : "";
    var w = d;
    if ("town" == d.town_type || "powers" == b) {
      var H = Ea(r);
    } else {
      RepConv.Debug && console.log("_getAllyFromOwner"), H = 0 < $(r).find($("li.town_owner a")).length && $(r).find($("li.town_owner a")).attr("onclick") ? RepConvTool.Adds($(r).find($("li.town_owner a")).attr("onclick").replace(/.*'(.*)'.*/, "$1"), GRCRTtpl.rct.ally) : "";
    }
    w.ally = H;
    d.townName = qa(r);
    d.playerName = za(r);
    return d;
  }
  function qa(d) {
    RepConv.Debug && console.log("_getTownName");
    return 0 < $(d).find($("li.town_name a")).length ? $(d).find($("li.town_name a")).html().trim() : "";
  }
  function za(d) {
    RepConv.Debug && console.log("_getPlayerName");
    return 0 < $(d).find($("li.town_owner a")).length ? $(d).find($("li.town_owner a")).html().trim() : "";
  }
  function Ma(d) {
    RepConv.Debug && console.log("_getTown");
    return 0 < $(d).find($("li.town_name a,.gp_town_link")).length && "BBCODEI" != g.getValue() ? RepConvTool.Adds(JSON.parse(RepConvTool.Atob($(d).find($("li.town_name a,.gp_town_link")).attr("href")))[GRCRTtpl.rct.getTown] + "", GRCRTtpl.rct[Ka(d)]) : 0 < $(d).find($("li.town_name a,.gp_town_link")).length && "BBCODEI" == g.getValue() ? RepConvTool.Adds($(d).find($("li.town_name a,.gp_town_link")).text().trim(), GRCRTtpl.rct[Ka(d)]) : 0 < $(d).find($("li.town_name")).length ? RepConvTool.Adds($(d).find($("li.town_name")).html().trim(), 
    GRCRTtpl.rct.town) : 0 < $(d).find($("a.gp_island_link")).length && "BBCODEI" != g.getValue() ? RepConvTool.Adds(JSON.parse(RepConvTool.Atob($(d).find($("a.gp_island_link")).attr("href")))[GRCRTtpl.rct.getIsland] + "", GRCRTtpl.rct.island) : 0 < $(d).find($("a.gp_island_link")).length && "BBCODEI" == g.getValue() ? RepConvTool.Adds($(d).find($("a.gp_island_link")).text().trim(), GRCRTtpl.rct.island) : "";
  }
  function Ka(d) {
    RepConv.Debug && console.log("_getTownType");
    return 0 < $(d).find($("li.town_name a,.gp_town_link")).length ? JSON.parse(RepConvTool.Atob($(d).find($("li.town_name a,.gp_town_link")).attr("href"))).tp : 0 < $(d).find($("li.town_name a.gp_town_link")).length ? JSON.parse(RepConvTool.Atob($(d).find($("li.town_name a.gp_town_link")).attr("href"))).tp : 0 < $(d).find($("li.town_name")).length ? RepConvTool.Adds($(d).find($("li.town_name")).html().trim(), GRCRTtpl.rct.town) : "";
  }
  function Na(d) {
    RepConv.Debug && console.log("_getPlayer");
    return 0 < $(d).find($("li.town_owner a,.gp_player_link")).length ? RepConvTool.Adds($(d).find($("li.town_owner a,.gp_player_link")).html(), GRCRTtpl.rct.player) : RepConvTool.Adds(($(d).find($("li.town_owner")).html() || "").trim(), GRCRTtpl.rct.player);
  }
  function Ea(d) {
    RepConv.Debug && console.log("_getAlly");
    return 0 < $(d).find($("li.town_owner_ally a")).length ? RepConvTool.Adds($(d).find($("li.town_owner_ally a")).attr("onclick").replace(/.*'(.*)'.*/, "$1"), GRCRTtpl.rct.ally) : "";
  }
  function ma() {
    function d() {
      return ITowns.getCurrentTown().getBuildings().getBuildingLevel("academy");
    }
    function r() {
      return ITowns.getCurrentTown().getBuildings().getBuildingLevel("library");
    }
    function w() {
      var F = GameData.researches, ca = ITowns.getCurrentTown().getResearches(), S = f.data.collections.research_orders, Qa = 0, Ga;
      for (Ga in F) {
        if (F.hasOwnProperty(Ga)) {
          var Xa = F[Ga];
          if (ca.hasResearch(Ga) || S.isResearchInQueue(Ga)) {
            Qa += Xa.research_points;
          }
        }
      }
      return Qa;
    }
    var H = function() {
      var F = GameData.researches, ca = f.data.collections.research_orders, S = d(), Qa = d() * GameDataResearches.getResearchPointsPerAcademyLevel() + (1 === r() ? GameDataResearches.getResearchPointsPerLibraryLevel() : 0) - w(), Ga = ITowns.getCurrentTown().getResearches(), Xa = [], ya;
      for (ya in F) {
        if (F.hasOwnProperty(ya)) {
          var Da = F[ya], La = Da.building_dependencies, sa = Math.ceil(La.academy / 3), xa = Ga.hasResearch(ya), ka = ca.isResearchInQueue(ya), Ca = ca.isResearchQueueFull();
          a: {
            var ra = void 0;
            var ob = GameData.researches[ya].resources, vb = ITowns.getCurrentTown().resources();
            for (ra in ob) {
              if (ob.hasOwnProperty(ra) && ob[ra] > vb[ra]) {
                ra = !1;
                break a;
              }
            }
            ra = !0;
          }
          ob = S >= La.academy;
          Da = Qa >= Da.research_points;
          Xa[sa - 1] || (Xa[sa - 1] = []);
          Xa[sa - 1].push({research_id:ya, column_number:sa, is_researched:xa, in_progress:ka, can_be_bought:ob && !xa && !ka && !Ca && ra && Da, academy_lvl:La.academy});
        }
      }
      return Xa;
    }(), L = 0, P = d();
    $.each(H, function(F, ca) {
      L = Math.max(L, ca.length);
    });
    a.title = GameData.buildings.academy.name + " (" + RepConvTool.Adds(GRCRTtpl.rct.outside ? Game.townName : Game.townId.toString(), GRCRTtpl.rct.town) + ")";
    a.time = "";
    a.linia = {};
    $.each(H, function(F, ca) {
      for (F = 0; F < L; F++) {
        void 0 == a.linia[F] && (a.linia[F] = {unit_list:"", unit_name:""});
        var S = void 0 != ca[F] ? RepConvTool.GetImageCode(GameDataResearches.getResearchCssClass(ca[F].research_id)) : "";
        S = void 0 == ca[F] || ca[F].is_researched || ca[F].in_progress ? S : S.toLowerCase();
        a.linia[F].unit_list += 0 < a.linia[F].unit_list.length ? "." : "";
        a.linia[F].unit_list += S;
        a.linia[F].unit_list += void 0 != ca[F] && (ca[F].academy_lvl > P || S == S.toUpperCase()) ? "|-" : "|";
      }
    });
    a.points = DM.getl10n("academy", "research_points") + ": " + (d() * GameDataResearches.getResearchPointsPerAcademyLevel() + (1 === r() ? GameDataResearches.getResearchPointsPerLibraryLevel() : 0) - w()) + "/" + (GameDataBuildings.getBuildingMaxLevel("academy") * GameDataResearches.getResearchPointsPerAcademyLevel() + (1 === r() ? GameDataResearches.getResearchPointsPerLibraryLevel() : 0));
  }
  function Fa() {
    function d() {
      return ITowns.getCurrentTown().getBuildings();
    }
    a.title = GameData.buildings.main.name + " (" + RepConvTool.Adds(GRCRTtpl.rct.outside ? Game.townName : Game.townId.toString(), GRCRTtpl.rct.town) + ")";
    a.time = "";
    a.linia = {};
    $.each(tech_tree, function(r, w) {
      for (r = 0; r < max_row; r++) {
        void 0 == a.linia[r] && (a.linia[r] = {unit_list:"", unit_name:""});
        var H = void 0 != w[r] ? RepConvTool.GetImageCode(GameDataResearches.getResearchCssClass(w[r].research_id)) : "";
        H = void 0 == w[r] || w[r].is_researched || w[r].in_progress ? H : H.toLowerCase();
        a.linia[r].unit_list += 0 < a.linia[r].unit_list.length ? "." : "";
        a.linia[r].unit_list += H;
        a.linia[r].unit_list += void 0 != w[r] && (w[r].academy_lvl > academy_lvl || H == H.toUpperCase()) ? "|-" : "|";
      }
    });
    a.points = DM.getl10n("academy", "research_points") + ": " + (d().getBuildingLevel("academy") * GameDataResearches.getResearchPointsPerAcademyLevel() + (1 === d().getBuildingLevel("library") ? GameDataResearches.getResearchPointsPerLibraryLevel() : 0) - function() {
      var r = GameData.researches, w = ITowns.getCurrentTown().getResearches(), H = f.data.collections.research_orders, L = 0, P;
      for (P in r) {
        if (r.hasOwnProperty(P)) {
          var F = r[P];
          if (w.hasResearch(P) || H.isResearchInQueue(P)) {
            L += F.research_points;
          }
        }
      }
      return L;
    }()) + "/" + (GameDataBuildings.getBuildingMaxLevel("academy") * GameDataResearches.getResearchPointsPerAcademyLevel() + (1 === d().getBuildingLevel("library") ? GameDataResearches.getResearchPointsPerLibraryLevel() : 0));
  }
  function ea() {
    a.title = v.find($("div.game_header")).html().stripTags();
    a.time = "";
    a.linia = {};
    if (0 < v.find($("#tab_all ul#command_overview li")).length) {
      var d = -1;
      $.each(v.find($("#tab_all ul#command_overview li")), function(r, w) {
        if ("none" != $(w).css("display")) {
          if (d++, a.linia[d] = {title:"", img:null, townIdA:null, townIdB:null, islandB:null, inout:null, power:"", unit_img:"", unit_send:"", unit_list:"", spy:"", time:""}, 0 < $(w).find($("h4")).length) {
            a.linia[d].title = "[b]" + $(w).find($("h4")).html().stripTags() + "[/b]";
          } else {
            if (0 < $(w).find($("span.italic")).length) {
              a.linia[d].title = "[i]" + $(w).find($("span.italic")).html().stripTags() + "[/i]";
            } else {
              if ($(w).hasClass("place_command")) {
                a.linia[d].img = RepConvTool.getCommandIcon($(w).find("div.cmd_img"));
                a.linia[d].townIdB = "";
                a.linia[d].islandB = "";
                r = $(w).find($("span.cmd_span"));
                var H = $(r).find($("span.icon")), L = $(H).prevAll();
                H = $(H).nextAll();
                a.linia[d].inout = RepConvTool.Adds(RepConv.Const.staticImg + (0 == $(r).find(".overview_incoming").length ? "out" : "in") + ".png", "img");
                a.linia[d].townIdA = {};
                switch(L.length) {
                  case 2:
                  case 1:
                    $.each(L, function(P, F) {
                      "gp_town_link" == F.className ? "town" == JSON.parse(RepConvTool.Atob(F.hash)).tp ? (a.linia[d].townIdA.town = RepConvTool.Adds(JSON.parse(RepConvTool.Atob(F.hash))[GRCRTtpl.rct.getTown].toString(), GRCRTtpl.rct.town), a.linia[d].townIdA.townId = JSON.parse(RepConvTool.Atob(F.hash)).id, a.linia[d].townIdA.townJSON = JSON.parse(RepConvTool.Atob(F.hash)), a.linia[d].townIdA.townType = JSON.parse(RepConvTool.Atob(F.hash)).tp) : a.linia[d].townIdA.town = RepConvTool.Adds(F.text, 
                      GRCRTtpl.rct[JSON.parse(RepConvTool.Atob(F.hash)).tp]) : "gp_player_link" == F.className && (a.linia[d].townIdA.player = RepConvTool.Adds(F.text, GRCRTtpl.rct.player));
                    });
                    a.linia[d].townIdA.full = a.linia[d].townIdA.town;
                    void 0 != a.linia[d].townIdA.player && (a.linia[d].townIdA.full += " (" + a.linia[d].townIdA.player + ")");
                    break;
                  case 0:
                    a.linia[d].townIdA.full = "", $.each(r[0].firstChild.data.split("\n"), function(P, F) {
                      a.linia[d].townIdA.full += " " + F.trim();
                      a.linia[d].townIdA.full = a.linia[d].townIdA.full.trim();
                    });
                }
                a.linia[d].townIdB = {};
                a.linia[d].islandB = {};
                switch(H.length) {
                  case 2:
                  case 1:
                    a.linia[d].townIdB.town = "";
                    $.each(H, function(P, F) {
                      "gp_town_link" == F.className ? "town" == JSON.parse(RepConvTool.Atob(F.hash)).tp ? a.linia[d].townIdB.town = RepConvTool.Adds(JSON.parse(RepConvTool.Atob(F.hash))[GRCRTtpl.rct.getTown].toString(), GRCRTtpl.rct.town) : a.linia[d].townIdB.town = RepConvTool.Adds(F.text, GRCRTtpl.rct[JSON.parse(RepConvTool.Atob(F.hash)).tp]) : "gp_player_link" == F.className ? (a.linia[d].townIdB.player = RepConvTool.Adds(F.text, GRCRTtpl.rct.player), a.linia[d].townIdB.playerId = JSON.parse(RepConvTool.Atob(F.hash)).id) : 
                      "gp_island_link" == F.className && (a.linia[d].islandB.island = RepConvTool.Adds((JSON.parse(RepConvTool.Atob(F.hash))[GRCRTtpl.rct.getIsland] || F.text).toString(), GRCRTtpl.rct.island), a.linia[d].islandB.islandId = JSON.parse(RepConvTool.Atob(F.hash)).id);
                    });
                    void 0 != a.linia[d].townIdB.town && (a.linia[d].townIdB.full = a.linia[d].townIdB.town);
                    void 0 != a.linia[d].islandB.island && (a.linia[d].townIdB.full = a.linia[d].islandB.island);
                    void 0 != a.linia[d].townIdB.player && (a.linia[d].townIdB.full += " (" + a.linia[d].townIdB.player + ")");
                    break;
                  case 0:
                    a.linia[d].townIdB.full = "", $.each(r[0].lastChild.data.split("\n"), function(P, F) {
                      a.linia[d].townIdB.full += " " + F.trim();
                      a.linia[d].townIdB.full = a.linia[d].townIdB.full.trim();
                    });
                }
                a.linia[d].time = $(w).find(".troops_arrive_at").html();
                a.linia[d].power = RepConvTool.getPowerIcon($(w).find("div.casted_power"));
                if ("attack_spy" == $(w).attr("data-command_type")) {
                  Aa.isChecked() ? a.linia[d].img_url = RepConvTool.Adds(RepConv.Const.unitImg + "iron.png", "img") + "  " + $(w).find("span.resource_iron_icon").html() : a.linia[d].img_url = RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), "i");
                } else {
                  if ("revolt" == $(w).attr("id").replace(/.*_(revolt).*/, "$1") && void 0 != a.linia[d].townIdA.townId) {
                    if (Aa.isChecked() && (w = ITowns.getTown(a.linia[d].townIdA.townId), void 0 != w)) {
                      a.linia[d].unit_list = "A6";
                      a.linia[d].unit_list += "|" + w.buildings().getBuildingLevel("wall").toString();
                      a.linia[d].unit_list += (1 == w.buildings().getBuildingLevel("tower") ? ".B6" : ".b6") + "|-";
                      a.linia[d].unit_list += (w.researches().get("ram") ? ".C6" : ".c6") + "|-";
                      a.linia[d].unit_list += (w.researches().get("phalanx") ? ".D6" : ".d6") + "|-";
                      a.linia[d].unit_list += (MM.checkAndPublishRawModel("PremiumFeatures", {id:Game.player_id}).get("captain") > Timestamp.server() ? ".E6" : ".e6") + "|-";
                      a.linia[d].unit_list += (MM.checkAndPublishRawModel("PremiumFeatures", {id:Game.player_id}).get("commander") > Timestamp.server() ? ".F6" : ".f6") + "|-";
                      a.linia[d].unit_list += (MM.checkAndPublishRawModel("PremiumFeatures", {id:Game.player_id}).get("priest") > Timestamp.server() ? ".G6" : ".g6") + "|-";
                      0 < a.linia[d].unit_list.length && (a.linia[d].img_url = RepConvTool.Adds((RepConv.grcrt_domain + "static/{0}{1}_32_2.png").RCFormat(GRCRTtpl.rct.sign, a.linia[d].unit_list), "img"), a.linia[d].img_url += RepConvTool.Adds((RepConv.grcrt_cdn + "ui/3/{0}.png").RCFormat(w.god() || "nogod"), "img"), a.linia[d].rt = "x");
                      try {
                        a.linia[d].img_url += "\n" + RepConvTool.GetLabel("MSGRTCSTIME") + ": ~" + readableUnixTimestamp(parseInt(V(a.linia[d].townIdB.playerId, a.linia[d].townIdA.townJSON)), "no_offset");
                      } catch (P) {
                      }
                    }
                  } else {
                    Aa.isChecked() ? (a.linia[d].ua = [], $.each($(w).find("div.command_overview_units div.place_unit"), function(P, F) {
                      P = RepConvTool.getUnitName($(F));
                      F = {i:RepConvTool.GetUnit(P), b:$(F).find($("span.place_unit_black")).html()};
                      a.linia[d].ua.push(F);
                    })) : a.linia[d].img_url = RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), "i");
                  }
                }
              }
            }
          }
        }
      });
    }
    h(a.linia, 25, 2, 8);
  }
  function db() {
    a.title = v.parent().find($(".ui-dialog-title")).html();
    a.type = "";
    a.time = "";
    a.power = "";
    a.morale = "";
    a.luck = "";
    a.oldwall = {};
    a.nightbonus = "";
    a.attacker = {};
    a.defender = {};
    a.command = {};
    a.command.title = v.find($("div.tab_content>span")).clone();
    $(a.command.title).children().remove();
    a.command.title = $(a.command.title).html();
    0 == v.find($("ul#unit_movements")).length ? a.command.title = "\n[i]" + $_content.find($(".gpwindow_content>span")).html() + "[/i]" : (a.linia = {}, $.each(v.find($("ul#unit_movements>li")), function(d, r) {
      a.linia[d] = {};
      a.linia[d].inout = RepConvTool.Adds(RepConv.Const.staticImg + (0 == $(r).attr("class").replace(/.*(incoming).*/, "$1").length ? "out" : "in") + ".png", "img");
      a.linia[d].img = RepConvTool.Adds($(r).find($("img.command_type")).attr("src"), "img");
      var w = $(r).find("div>span.eta").html().split(":");
      w = 3600 * parseInt(w[0]) + 60 * parseInt(w[1]) + parseInt(w[2]);
      w = readableUnixTimestamp(Timestamp.server() + parseInt(w), "player_timezone", {with_seconds:!0, extended_date:!0});
      a.linia[d].time = w;
      a.linia[d].text = RepConvTool.Adds(JSON.parse(RepConvTool.Atob($(r).find($("a.gp_town_link")).attr("href")))[GRCRTtpl.rct.getTown].toString(), GRCRTtpl.rct[JSON.parse(RepConvTool.Atob($(r).find($("a.gp_town_link")).attr("href"))).tp]);
    }));
  }
  function eb() {
    a.title = v.closest($(".js-window-main-container")).find($(".ui-dialog-title")).html();
    a.type = "";
    var d = v.find($("div#conquest")).html().split(":");
    d = 3600 * parseInt(d[0]) + 60 * parseInt(d[1]) + parseInt(d[2]);
    d = readableUnixTimestamp(Timestamp.server() + parseInt(d), "player_timezone", {with_seconds:!0, extended_date:!0});
    a.time = d;
    a.power = "";
    a.morale = "";
    a.luck = "";
    a.oldwall = {};
    a.nightbonus = "";
    a.attacker = {};
    a.defender = {};
    a.command = {};
    a.attacker.title = $(v.find($("h4"))[0]).html();
    a.attacker.player = RepConvTool.Adds(v.find($("a.gp_player_link")).html(), GRCRTtpl.rct.player);
    a.defender.town = RepConvTool.Adds(JSON.parse(RepConvTool.Atob(v.find($("a.gp_town_link")).attr("href")))[GRCRTtpl.rct.getTown].toString(), GRCRTtpl.rct[JSON.parse(RepConvTool.Atob(v.find($("a.gp_town_link")).attr("href"))).tp]);
    ta.isChecked() && (a.defender.town = RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), GRCRTtpl.rct.town));
    a.attacker.units_title = v.find($("div.clearfix div.bold")).html();
    oa.isChecked() ? ia("attacker", "div.report_unit", 11) : a.attacker.full = {img_url:RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), "i")};
    a.command.title = $(v.find($("h4"))[1]).html();
    a.linia = {};
    0 == v.find($("ul#unit_movements")).length ? a.command.title = "\n[i]" + (v.find($(".conquest_info_wrapper>span")).html() || "") + "[/i]" : (a.linia = {}, $.each(v.find($("ul#unit_movements>li")), function(r, w) {
      a.linia[r] = {};
      a.linia[r].inout = RepConvTool.Adds(RepConv.Const.staticImg + (0 == $(w).attr("class").replace(/.*(incoming).*/, "$1").length ? "out" : "in") + ".png", "img");
      a.linia[r].img = RepConvTool.Adds($(w).find($("img.command_type")).attr("src"), "img");
      var H = $(w).find("div>span.eta").html().split(":");
      H = 3600 * parseInt(H[0]) + 60 * parseInt(H[1]) + parseInt(H[2]);
      H = readableUnixTimestamp(Timestamp.server() + parseInt(H), "player_timezone", {with_seconds:!0, extended_date:!0});
      a.linia[r].time = H;
      var L = RepConvTool.Adds(JSON.parse(RepConvTool.Atob($($($(w).find("div")[2]).html()).eq(3).attr("href")))[GRCRTtpl.rct.getTown].toString(), GRCRTtpl.rct.town), P = RepConvTool.Adds(JSON.parse(RepConvTool.Atob($($($(w).find("div")[2]).html()).eq(5).attr("href"))).name, GRCRTtpl.rct.player), F = "(" + RepConvTool.Adds($($($(w).find("div")[2]).html()).eq(7).html(), GRCRTtpl.rct.ally) + ")" || "";
      a.linia[r].text = "";
      $.each($($($(w).find("div")[2]).html().replace(/.*<span.*span>(.*)/, "$1")), function(ca, S) {
        $(S).hasClass("gp_town_link") ? a.linia[r].text += " " + L : $(S).hasClass("gp_player_link") ? a.linia[r].text += "\n" + P : void 0 != $(S).attr("onclick") ? a.linia[r].text += " " + F : 0 < $(S).text().replace(/(\(|\))/, "").trim().length && (a.linia[r].text += " " + $(S).text().trim());
      });
      r++;
    }));
  }
  function Va() {
    a.title = v.find($("#place_defense .game_header")).html().stripTags() + " " + RepConvTool.Adds(GRCRTtpl.rct.outside ? Game.townName : Game.townId.toString(), GRCRTtpl.rct.town);
    a.time = "";
    a.linia = {};
    $.each(v.find($("li.place_units")), function(d, r) {
      var w = "", H = "";
      0 < $(r).children("h4").children("a.gp_town_link").length && (w = RepConvTool.Adds(JSON.parse(RepConvTool.Atob($(r).children("h4").children("a.gp_town_link").attr("href")))[GRCRTtpl.rct.getTown].toString(), GRCRTtpl.rct[JSON.parse(RepConvTool.Atob($(r).children("h4").children("a.gp_town_link").attr("href"))).tp]));
      0 < $(r).children("h4").children("a.gp_player_link").length && (H = RepConvTool.Adds($(r).children("h4").children("a.gp_player_link").html(), GRCRTtpl.rct.player));
      if (ta.isChecked() || ha.isChecked()) {
        w = RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), GRCRTtpl.rct.town);
      }
      a.linia[d] = {};
      a.linia[d].titleOrg = $(r).children("h4").html();
      a.linia[d].title = "" != H ? $(r).children("h4").html().replace(/(.*)<a.*\/a>.*(<a.*\/a>).*/, "$1") + w + " (" + H + ")" : $(r).children("h4").html().replace(/(.*)<a.*\/a>/, "$1") + w;
      Ia.isChecked() || oa.isChecked() ? (a.linia[d].ua = [], $.each($(r).find($(".place_unit")), function(L, P) {
        L = RepConvTool.getUnitName($(P));
        P = {i:RepConvTool.GetUnit(L), b:$(P).find($("span")).html()};
        a.linia[d].ua.push(P);
      })) : a.linia[d].img_url = RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), "i");
    });
    (Ia.isChecked() || oa.isChecked()) && h(a.linia);
  }
  function Ya() {
    function d(w, H) {
      RepConv.Debug && console.log("getUnitWall");
      var L = -1, P = 0, F = [];
      $.each($(H).find($("div.wall_report_unit")), function(ca, S) {
        ca = RepConvTool.getUnitName($(S));
        switch(ba.getValue()) {
          case "MSGDIFF1":
            S = {i:RepConvTool.GetUnit(ca), b:$(S).find($("span.place_unit_black")).html()};
            F.push(S);
            break;
          case "MSGDIFF2":
            S = {i:RepConvTool.GetUnit(ca), b:$(S).find($("span.place_unit_black")).html(), g:$(S).parent().find($("div.grcrt_wall_diff")).html()};
            F.push(S);
            break;
          case "MSGDIFF3":
            "" != $(S).parent().find($("div.grcrt_wall_diff")).html() && (S = {i:RepConvTool.GetUnit(ca), g:$(S).parent().find($("div.grcrt_wall_diff")).html()}, F.push(S));
        }
      });
      $.each(F, function(ca, S) {
        0 == P % ("BBCODEP" == u.getValue() ? GRCRTtpl.rct.unitWall : GRCRTtpl.rct.unitWall2) && (L++, w[L] = {ua:[]});
        w[L].ua.push(S);
        P++;
      });
      h(w);
    }
    a.title = v.find($(".game_header")).html().stripTags();
    a.defeated = {};
    a.losses = {};
    a.defeated.title = "";
    a.defeated.titleAttacker = "";
    a.defeated.titleDefender = "";
    a.losses.title = "";
    a.losses.titleAttacker = "";
    a.losses.titleDefender = "";
    a.defeated.attacker = {};
    a.defeated.defender = {};
    a.losses.attacker = {};
    a.losses.defender = {};
    if (D.isChecked() || G.isChecked()) {
      a.defeated.title = v.find($("div.list_item_left h3")).html(), D.isChecked() && (a.defeated.titleAttacker = $(v.find($("div.list_item_left h4"))[0]).html().stripTags().trim(), d(a.defeated.attacker, v.find($("div.list_item_left .wall_unit_container"))[0])), G.isChecked() && (a.defeated.titleDefender = $(v.find($("div.list_item_left h4"))[1]).html().stripTags().trim(), d(a.defeated.defender, v.find($("div.list_item_left .wall_unit_container"))[1]));
    }
    if (M.isChecked() || K.isChecked()) {
      a.losses.title = v.find($("div.list_item_right h3")).html(), M.isChecked() && (a.losses.titleAttacker = $(v.find($("div.list_item_right h4"))[0]).html().stripTags().trim(), d(a.losses.attacker, v.find($("div.list_item_right .wall_unit_container"))[0])), K.isChecked() && (a.losses.titleDefender = $(v.find($("div.list_item_right h4"))[1]).html().stripTags().trim(), d(a.losses.defender, v.find($("div.list_item_right .wall_unit_container"))[1]));
    }
    var r = "emptyline_" + GRCRTtpl.rct.genImgS + "_" + GRCRTtpl.rct.genImgM;
    a.emptyline = RepConvTool.Adds(J(r), "img");
    $.ajax({type:"POST", url:RepConv.grcrt_domain + "imgdata.php", data:{param:btoa(C([{i:"null", b:""}], GRCRTtpl.rct.genImgS, GRCRTtpl.rct.genImgM)), dest:r}, dataType:"script", async:!1});
    RepConv.Debug && console.log(a);
  }
  function hb() {
    RepConv.Debug && console.log("_revolt");
    if (na.isChecked()) {
      if ("[town]" + Game.townId + "[/town]" == a.defender.town || Game.townName == a.defender.townName) {
        a.rtrevinfo = MM.getCollections().MovementsRevoltDefender[0];
        a.rtrevccount = a.rtrevinfo.length;
        a.rtrevolt = "";
        a.rtcstime = "~" + readableUnixTimestamp(parseInt(V(JSON.parse(RepConvTool.Atob(v.find($("#report_sending_town .gp_player_link")).attr("href"))).id, JSON.parse(RepConvTool.Atob(v.find($("#report_receiving_town .gp_town_link")).attr("href"))))), "no_offset");
        try {
          $.each(a.rtrevinfo.models, function(d, r) {
            Timestamp.server() < r.getFinishedAt() && (d = readableUnixTimestamp(r.getStartedAt(), "player_timezone", {extended_date:!0, with_seconds:!0}), a.rtrevolt > d || "" == a.rtrevolt) && (a.rtrevolt = readableUnixTimestamp(r.getStartedAt(), "player_timezone", {extended_date:!0, with_seconds:!0}));
          });
        } catch (d) {
          a.rtrevolt = "";
        }
      } else {
        na.check(!1), a.rtrevolt = "";
      }
    } else {
      a.rtrevolt = "";
    }
    a.rttownId = parseInt(Game.townId);
    ITowns.getTown(a.rttownId);
    a.rtwall = ITowns.getTown(a.rttownId).buildings().getBuildingLevel("wall");
    a.rtimg = "A6";
    a.rtimg += "|" + a.rtwall.toString();
    1 == ITowns.getTown(a.rttownId).buildings().getBuildingLevel("tower") ? (a.rttower = RepConvTool.GetLabel("MSGRTYES"), a.rtimg += ".B6", a.rtdetail += ".....\u2612.") : (a.rttower = RepConvTool.GetLabel("MSGRTNO"), a.rtimg += ".b6", a.rtdetail += ".....\u2610.");
    a.rtimg += "|-";
    a.rtgod = DM.getl10n("layout").powers_menu.gods[ITowns.getTown(a.rttownId).god()];
    a.rtgodid = ITowns.getTown(a.rttownId).god() || "nogod";
    a.rtonline = Ha.isChecked() ? RepConvTool.GetLabel("MSGRTYES") : RepConvTool.GetLabel("MSGRTNO");
    ITowns.getTown(a.rttownId).researches().get("ram") ? (a.rtram = RepConvTool.GetLabel("MSGRTYES"), a.rtimg += ".C6", a.rtdetail += ".....\u2612.") : (a.rtram = RepConvTool.GetLabel("MSGRTNO"), a.rtimg += ".c6", a.rtdetail += ".....\u2610.");
    a.rtimg += "|-";
    ITowns.getTown(a.rttownId).researches().get("phalanx") ? (a.rtphalanx = RepConvTool.GetLabel("MSGRTYES"), a.rtimg += ".D6", a.rtdetail += ".....\u2612.") : (a.rtphalanx = RepConvTool.GetLabel("MSGRTNO"), a.rtimg += ".d6", a.rtdetail += ".....\u2610.");
    a.rtimg += "|-";
    a.rtpremium = [];
    MM.checkAndPublishRawModel("PremiumFeatures", {id:Game.player_id}).get("captain") > Timestamp.server() ? (a.rtpremium.captain = RepConvTool.GetLabel("MSGRTYES"), a.rtimg += ".E6", a.rtdetail += ".....\u2612.") : (a.rtpremium.captain = RepConvTool.GetLabel("MSGRTNO"), a.rtimg += ".e6", a.rtdetail += ".....\u2610.");
    a.rtimg += "|-";
    MM.checkAndPublishRawModel("PremiumFeatures", {id:Game.player_id}).get("commander") > Timestamp.server() ? (a.rtpremium.commander = RepConvTool.GetLabel("MSGRTYES"), a.rtimg += ".F6", a.rtdetail += ".....\u2612.") : (a.rtpremium.commander = RepConvTool.GetLabel("MSGRTNO"), a.rtimg += ".f6", a.rtdetail += ".....\u2610.");
    a.rtimg += "|-";
    MM.checkAndPublishRawModel("PremiumFeatures", {id:Game.player_id}).get("priest") > Timestamp.server() ? (a.rtpremium.priest = RepConvTool.GetLabel("MSGRTYES"), a.rtimg += ".G6", a.rtdetail += ".....\u2612.") : (a.rtpremium.priest = RepConvTool.GetLabel("MSGRTNO"), a.rtimg += ".g6", a.rtdetail += ".....\u2610.");
    a.rtimg += "|-";
    a.rtlabels = [];
    a.rtlabels.wall = GameData.buildings.wall.name;
    a.rtlabels.tower = GameData.buildings.tower.name;
    a.rtlabels.god = RepConvTool.GetLabel("MSGRTGOD");
    a.rtlabels.cstime = RepConvTool.GetLabel("MSGRTCSTIME");
    a.rtlabels.online = RepConvTool.GetLabel("MSGRTONL");
    a.rtlabels.ram = GameData.researches.ram.name;
    a.rtlabels.phalanx = GameData.researches.phalanx.name;
    a.rtlabels.captain = Game.premium_data.captain.name;
    a.rtlabels.commander = Game.premium_data.commander.name;
    a.rtlabels.priest = Game.premium_data.priest.name;
    a.unit_movements = {support:0, attack:0};
    MM.getCollections().Support && MM.getCollections().Support[0] && MM.getCollections().Support[0].getIncomingSupportsForTown(Game.townId) && (a.unit_movements.support = MM.getCollections().Support[0].getIncomingSupportsForTown(Game.townId).getIncoming());
    MM.getCollections().Attack && MM.getCollections().Attack[0] && MM.getCollections().Attack[0].getIncomingAttacksForTown(Game.townId) && (a.unit_movements.attack = MM.getCollections().Attack[0].getIncomingAttacksForTown(Game.townId).getIncoming());
  }
  function Ra() {
    RepConv.Debug && console.log("_fight");
    q();
    z();
    x();
    B();
    Q();
    N();
    U();
    a.attacker = R();
    a.defender = R();
    a.attacker = W(a.attacker, v.find($("#report_sending_town")));
    a.defender = W(a.defender, v.find($("#report_receiving_town")));
    a.powerAtt = "";
    $.each(v.find($("div.report_side_attacker div.report_power,div.report_side_attacker div.report_alliance_power")), function(d, r) {
      a.powerAtt += RepConvTool.getPowerIcon($(r));
    });
    a.powerDef = "";
    $.each(v.find($("div.report_side_defender div.report_power,div.report_side_defender div.report_alliance_power")), function(d, r) {
      a.powerDef += RepConvTool.getPowerIcon($(r));
    });
    "attackSupport" == b ? Ia.isChecked() ? aa("defender", "div.report_side_attacker_unit") : (a.defender.full = {img_url:RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), "i")}, a.defender.splits = {1:{img_url:RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), "i")}}, a.powerDef = "") : (oa.isChecked() ? aa("attacker", "div.report_side_attacker_unit") : (a.attacker.full = {img_url:RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), "i")}, a.attacker.splits = {1:{img_url:RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), 
    "i")}}, a.powerAtt = ""), Ia.isChecked() ? aa("defender", "div.report_side_defender_unit") : (a.defender.full = {img_url:RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), "i")}, a.defender.splits = {1:{img_url:RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), "i")}}, a.powerDef = ""));
    fa();
    Y();
  }
  function Za() {
    RepConv.Debug && console.log("_raise");
    q();
    z();
    x();
    B();
    Q();
    N();
    U();
    a.attacker = R();
    a.defender = R();
    a.attacker = W(a.attacker, v.find($("#report_sending_town")));
    a.defender = W(a.defender, v.find($("#report_receiving_town")));
    a.powerAtt = "";
    $.each(v.find($("div.report_side_attacker div.report_power,div.report_side_attacker div.report_alliance_power")), function(d, r) {
      a.powerAtt += RepConvTool.getPowerIcon($(r));
    });
    a.powerDef = "";
    $.each(v.find($("div.report_side_defender div.report_power,div.report_side_defender div.report_alliance_power")), function(d, r) {
      a.powerDef += RepConvTool.getPowerIcon($(r));
    });
    oa.isChecked() ? aa("attacker", "#left_side div.report_side_attacker_unit") : (a.attacker.full = {img_url:RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), "i")}, a.attacker.splits = {1:{img_url:RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), "i")}}, a.powerAtt = "");
    Ia.isChecked() ? aa("defender", "#right_side div.report_side_attacker_unit") : (a.defender.full = {img_url:RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), "i")}, a.defender.splits = {1:{img_url:RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), "i")}}, a.powerDef = "");
    fa();
    Y();
  }
  function ib() {
    a.title = $a.parent().parent().find($("span.ui-dialog-title")).html();
    a.time = "";
    a.back = 1 == v.find($(".command_icon_wrapper img")).length;
    a.detail = {};
    a.attacker = R();
    a.defender = R();
    a.ret = 0 < v.find($("div.return")).length;
    a.farm = 1 < v.find($(".command_icon_wrapper img")).length && v.find($(".command_icon_wrapper img")).attr("src").match(/.*\/(farm).*/) || 1 == v.find($("div.report_town_bg_quest")).length ? !0 : !1;
    a.back || (a.attacker = W(a.attacker, v.find($("div.attacker"))));
    a.defender = W(a.defender, v.find($("div.defender")));
    a.detail.time_title = v.find($("fieldset.command_info_time legend")).html();
    a.detail.time_time = v.find($("fieldset.command_info_time .arrival_time")).html();
    a.attacker.units_title = 0 == v.find($(".grcrt_wisdom")).length ? v.find($("fieldset.command_info_units legend")).html() : v.find($("fieldset.command_info_units .grcrt_wisdom h4")).html();
    a.detail.power_title = v.find($("fieldset.command_info_casted_powers legend")).html();
    a.detail.power_img = "";
    oa.isChecked() ? (ia("attacker", 0 == v.find($(".grcrt_wisdom")).length ? "div.index_unit" : "div.report_unit", 5), $.each(v.find($("fieldset.command_info_casted_powers div.index_town_powers")), function(d, r) {
      a.detail.power_img += RepConvTool.getPowerIcon($(r));
    }), 0 != v.find($(".grcrt_wisdom")).length && (a.detail.power_img = RepConvTool.Adds(RepConv.Const.uiImg + "pm/wisdom.png", "img"))) : a.attacker.full = {img_url:RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), "i")};
    a.resources = X();
    a.resources.title = 0 == v.find($("fieldset.command_info_res legend")).length ? "" : v.find($("fieldset.command_info_res legend")).html();
    $.each(v.find($("div#command_booty li.res_background div")), function(d, r) {
      switch(r.className) {
        case "wood_img":
          d = {i:"S1", b:$(r).nextAll().text()};
          a.resources.ua.push(d);
          a.resources.wood = $(r).nextAll().text();
          break;
        case "stone_img":
          d = {i:"S2", b:$(r).nextAll().text()};
          a.resources.ua.push(d);
          a.resources.stone = $(r).nextAll().text();
          break;
        case "iron_img":
          d = {i:"S3", b:$(r).nextAll().text()};
          a.resources.ua.push(d);
          a.resources.iron = $(r).nextAll().text();
          break;
        case "favor_img":
          d = {i:"S4", b:$(r).nextAll().text()}, a.resources.ua.push(d), a.resources.power = $(r).nextAll().text();
      }
    });
    l(a.resources, 30, GRCRTtpl.rct.genImgM + 5, 10);
    a.bunt = "";
    try {
      a.reportImage = v.find($(".command_icon_wrapper img")).attr("src").replace(/.*\/([^\/]*)\.png/, "$1");
    } catch (d) {
    }
  }
  function lb() {
    var d = 0;
    a.title = f.getTitle() + " (" + (GRCRTtpl.rct.outside ? RepConvTool.Adds(f.getJQElement().find($(".island_info>h4")).html(), GRCRTtpl.rct.island) : RepConvTool.Adds(f.getHandler().island.id.toString(), GRCRTtpl.rct.island)) + ")";
    a.time = "";
    a.header = GRCRTtpl.rct.outside ? RepConvTool.Adds(f.getJQElement().find($(".island_info>h4")).html(), GRCRTtpl.rct.island) : RepConvTool.Adds(f.getHandler().island.id.toString(), GRCRTtpl.rct.island);
    a.header += "\n";
    a.header += f.getJQElement().find($(".islandinfo_coords")).justtext().trim() + "\n";
    a.header += f.getJQElement().find($(".islandinfo_free")).justtext().trim();
    a.linia = {};
    $.each(f.getJQElement().find($(".island_info_left .game_list:visible li")), function(r, w) {
      r = a.linia;
      var H = ++d;
      RepConv.Debug && console.log("_islandRow");
      var L = $(w).children();
      w = {col1:RepConvTool.Adds(JSON.parse(RepConvTool.Atob(L.eq(0).attr("href")))[GRCRTtpl.rct.getTown].toString(), GRCRTtpl.rct.town), col2:L.eq(1).html(), col3:0 < $(L).eq(2).children("a.gp_player_link").length ? RepConvTool.Adds(JSON.parse(RepConvTool.Atob($(L).eq(2).children("a.gp_player_link").attr("href"))).name, GRCRTtpl.rct.player) : $(L).eq(2).justtext()};
      0 < $(L).eq(2).children("a.gp_player_link").length && (L = JSON.parse(RepConvTool.Atob($(L).eq(2).children("a.gp_player_link").attr("href"))), RepConvTool.getPlayerData(L.id) && "" != RepConvTool.getPlayerData(L.id).alliance_id && (w.col4 = RepConvTool.Adds(RepConvTool.getAllianceData(RepConvTool.getPlayerData(L.id).alliance_id).name, GRCRTtpl.rct.ally)));
      r[H] = w;
    });
  }
  function Ta() {
    var d = 0;
    a.title = f.getTitle();
    a.time = "";
    a.header = RepConvTool.Adds(f.getJQElement().find($("#player_info h3")).justtext(), GRCRTtpl.rct.player);
    a.header += 0 < f.getJQElement().find($("#player_info>a")).length ? " (" + RepConvTool.Adds(f.getJQElement().find($("#player_info>a")).attr("onclick").replace(/.*\('(.*)'.*/, "$1"), GRCRTtpl.rct.ally) + ")" : "";
    a.linia = {};
    $.each(f.getJQElement().find($("#player_towns ul.game_list li")), function(r, w) {
      r = a.linia;
      var H = ++d;
      RepConv.Debug && console.log("_townsRow");
      w = $(w).children();
      w = {col1:RepConvTool.Adds(JSON.parse(RepConvTool.Atob(w.eq(1).attr("href")))[GRCRTtpl.rct.getTown].toString(), GRCRTtpl.rct.town), col2:w.eq(2).html().split("|")[0].trim(), col3:w.eq(2).html().split("|")[1].trim()};
      r[H] = w;
    });
  }
  function ab() {
    var d = 0;
    a.title = f.getTitle();
    a.time = "";
    a.header = RepConvTool.Adds(f.getTitle(), GRCRTtpl.rct.ally);
    a.linia = {};
    $.each(f.getJQElement().find($("#ally_towns ul.members_list>li:nth-child(2) ul li")), function(r, w) {
      r = a.linia;
      var H = ++d;
      RepConv.Debug && console.log("_playersRow");
      w = {col1:RepConvTool.Adds(JSON.parse(RepConvTool.Atob($(w).find("a.gp_player_link").attr("href"))).name, GRCRTtpl.rct.player), col2:$(w).find("div.small-descr").html().replace(/^\s*|\s(?=\s)|\t|\s*$/g, "").split(",")[0].trim(), col3:$(w).find("div.small-descr").html().replace(/^\s*|\s(?=\s)|\t|\s*$/g, "").split(",")[1].trim()};
      r[H] = w;
    });
  }
  function Wa() {
    var d = MM.getCollections().Temple[0].getTempleById(f.attributes.args.target_id);
    RepConv.TEMPL = MM.getCollections().Temple[0].getTempleById(f.attributes.args.target_id);
    a.title = f.getTitle();
    a.type = "";
    a.time = "";
    a.power = "";
    a.morale = "";
    a.luck = "";
    a.oldwall = {};
    a.nightbonus = "";
    a.attacker = {};
    a.defender = {};
    a.command = {};
    ia("defender", "div.troops_support>div.unit_slots>div.unit", 9);
    a.temple = {owner:d.getAllianceName() ? RepConvTool.Adds(sb.isChecked() ? d.getAllianceName() : RepConvTool.GetLabel("HIDDEN"), GRCRTtpl.rct.ally) : "", god:{img_url:RepConvTool.Adds((RepConv.grcrt_cdn + "ui/3/{0}.png").RCFormat(d.getGod() || "nogod"), "img"), name:DM.getl10n("layout").powers_menu.gods[d.getGod() || "nogod"]}, name:RepConvTool.Adds((GRCRTtpl.rct.outside || "BBCODEI" == g.getValue() ? d.getName() : d.getId()) + "", GRCRTtpl.rct.temple), buff:""};
    a.addInfo = v.find($("div.state_text")).text();
    a.movements_count = {attack:v.find($(".troops_movements_count>.incoming_attacks>.value")).html(), support:v.find($(".troops_movements_count>.incoming_support>.value")).html()};
    $.each(d.getBuff(), function(r, w) {
      r = GameDataPowers.getTooltipPowerData(GameData.powers[r], w, 0);
      a.temple.buff += ("" != a.temple.buff ? "\n" : "") + r.i_descr;
    });
    a.linia = {};
    d = MM.getModels().TempleInfo[f.attributes.args.target_id];
    0 == d.getMovements().length ? a.command.title = "\n[i]" + (v.find($(".troops_movements>.content>.centered_text")).html() || "") + "[/i]" : $.each(d.getMovements(), function(r, w) {
      a.linia[r] = {};
      a.linia[r].inout = RepConvTool.Adds(RepConv.Const.staticImg + "in.png", "img");
      a.linia[r].img = RepConvTool.Adds("https://cdn.grcrt.net/ui/c/" + w.type + ".png", "img");
      var H = readableUnixTimestamp(w.arrival_at, "player_timezone", {with_seconds:!0, extended_date:!0});
      a.linia[r].time = H;
      H = RepConvTool.Adds(w["origin_town_" + GRCRTtpl.rct.getTown].toString(), GRCRTtpl.rct.town);
      w = RepConvTool.Adds(w.sender_name, GRCRTtpl.rct.player);
      a.linia[r].text = "";
      a.linia[r].text += " " + H;
      a.linia[r].text += " (" + w + ")";
    });
  }
  function bb() {
    "BBCODEA" != g.getValue() && Ja.show();
    Sa.hide();
    $("#grcrt_pagination").show();
    $("#grcrt_pagination .pages").html(gb + 1 + "/" + (pb + 1));
    qb.disable(0 == gb);
    rb.disable(gb == pb);
    tb = mb.splits[gb];
    n(tb);
  }
  function fb() {
    function d(Xa, ya, Da) {
      $.each(Xa, function(La, sa) {
        switch(sa) {
          case "MSGATTUNIT":
            oa = c(sa, Da);
            ya.append(oa);
            break;
          case "MSGRESOURCE":
            nb = c(sa, Da);
            ya.append(nb);
            break;
          case "MSGHIDAT":
            ta = c(sa, Da);
            ya.append(ta);
            break;
          case "MSGHIDDE":
            ha = c(sa, Da);
            ya.append(ha);
            break;
          case "MSGDEFUNIT":
            Ia = c(sa, Da);
            ya.append(Ia);
            break;
          case "MSGRTSHOW":
            na = c(sa, Da);
            na.on("cbx:check", function() {
              na.isChecked() || Ha.check(!1);
            });
            ya.append(na);
            break;
          case "MSGRTONLINE":
            Ha = c(sa, Da);
            ya.append(Ha);
            break;
          case "MSGUNITS":
            Ba = c(sa, Da);
            ya.append(Ba);
            break;
          case "MSGBUILD":
            ja = c(sa, Da);
            ya.append(ja);
            break;
          case "MSGUSC":
            ua = c(sa, Da);
            ya.append(ua);
            break;
          case "MSGRAW":
            pa = c(sa, Da);
            ya.append(pa);
            break;
          case "MSGDETAIL":
            Aa = c(sa, Da);
            ya.append(Aa);
            break;
          case "MSGSHOWCOST":
            kb = c(sa, Da);
            ya.append(kb);
            break;
          default:
            RepConv.Debug && console.log(sa);
        }
      });
    }
    var r = $("<div/>", {id:"publish_report_options1"}), w = $("<div/>", {id:"publish_report_options2"});
    $("<div/>", {id:"publish_report_options3"});
    var H = $("<div/>", {id:"publish_report_options4"}), L = {}, P = {}, F = {}, ca = RepConvTool.RamkaLight(RepConvTool.GetLabel("MSGQUEST"), r), S = RepConvTool.RamkaLight(RepConvTool.GetLabel("MSGHIDAD"), w), Qa = RepConvTool.RamkaLight(RepConvTool.GetLabel("MSGRTLBL"), H);
    $(S).attr("style", "width: 50%; float:right;");
    $(Qa).attr("style", "clear: both; top: 10px");
    RepConv.Debug && console.log("_reportType=" + b);
    switch(b) {
      case "command":
        k = "attack";
        L = ["MSGATTUNIT", "MSGRESOURCE"];
        P = ["MSGHIDAT", "MSGHIDDE"];
        break;
      case "breach":
      case "attack":
        k = "attack";
        L = ["MSGATTUNIT", "MSGDEFUNIT", "MSGRESOURCE", "MSGSHOWCOST"];
        P = ["MSGHIDAT", "MSGHIDDE", ""];
        break;
      case "take_over":
        k = "attack";
        L = ["MSGATTUNIT", "MSGDEFUNIT", "MSGRESOURCE", "MSGSHOWCOST"];
        P = ["MSGHIDAT", "MSGHIDDE", ""];
        Y();
        da(v.find($("#report_receiving_town"))).playerName == Game.player_name && "" != a.bunt && (F = ["MSGRTSHOW", "MSGRTONLINE"]);
        break;
      case "espionage":
        k = "espionage";
        L = ["MSGUNITS", "MSGBUILD", "MSGUSC", "MSGRAW"];
        P = ["MSGHIDAT", "MSGHIDDE", "", ""];
        break;
      case "commandList":
        k = "attack";
        L = ["MSGDETAIL"];
        P = {};
        break;
      case "conquer":
      case "illusion":
        k = "attack";
        L = {};
        P = ["MSGHIDAT", "MSGHIDDE"];
        break;
      case "conquest":
      case "conquerold":
        k = "attack";
        L = ["MSGATTUNIT"];
        P = ["MSGHIDDE"];
        break;
      case "attackSupport":
        k = "attack";
        L = ["MSGDEFUNIT", "MSGSHOWCOST"];
        P = ["MSGHIDAT", "MSGHIDDE"];
        break;
      case "support":
        k = "support";
        L = ["MSGATTUNIT", ""];
        P = ["MSGHIDAT", "MSGHIDDE"];
        break;
      case "agoraD":
        k = "support";
        L = ["MSGDEFUNIT"];
        P = ["MSGHIDAT"];
        break;
      case "agoraS":
        k = "support";
        L = ["MSGATTUNIT"];
        P = ["MSGHIDDE"];
        break;
      case "powers":
        k = "attack";
        L = {};
        P = ["MSGHIDDE"];
        break;
      case "raise":
        k = "attack";
        L = ["MSGATTUNIT", "MSGDEFUNIT"];
        P = ["MSGHIDAT", "MSGHIDDE"];
        break;
      case "found":
        k = "attack";
        L = {};
        P = ["MSGHIDAT"];
        break;
      case "conqueroldtroops":
        k = "attack";
        L = {};
        P = {};
        break;
      default:
        k = "attack", L = {}, P = {};
    }
    switch(Math.max(L.length || 0, P.length || 0)) {
      case 0:
        p = 330;
        break;
      case 1:
        p = 269;
        break;
      case 2:
        p = 265;
        break;
      case 3:
        p = 250;
        break;
      case 4:
        p = 233;
    }
    p -= 0 < F.length ? 71 : 0;
    RepConv.Lang.ATTACKER = RepConvTool.GetLabel("LABELS." + k + ".ATTACKER");
    RepConv.Lang.DEFENDER = RepConvTool.GetLabel("LABELS." + k + ".DEFENDER");
    RepConv.Lang.MSGHIDAT = RepConvTool.GetLabel("LABELS." + k + ".MSGHIDAT");
    RepConv.Lang.MSGHIDDE = RepConvTool.GetLabel("LABELS." + k + ".MSGHIDDE");
    RepConv.Lang.MSGATTUNIT = RepConvTool.GetLabel("LABELS." + k + ".MSGATTUNIT");
    RepConv.Lang.MSGDEFUNIT = RepConvTool.GetLabel("LABELS." + k + ".MSGDEFUNIT");
    RepConv.Debug && console.log(RepConv.Lang.ATTACKER);
    RepConv.Debug && console.log(RepConv.Lang.LABELS[k].ATTACKER);
    RepConv.Debug && console.log(k);
    d(L, r, !0);
    d(P, w, !1);
    d(F, H, !0);
    try {
      var Ga = JSON.parse(RepConvTool.Atob(v.find($("#report_receiving_town .gp_town_link")).attr("href")));
      H.append($("<div/>", {id:"GRCRT_block", rel:Ga.id}).css("position", "absolute").css("top", "18px").css("background-color", "rgb(255, 0, 0)").css("width", "801px").css("height", "32px").css("color", "white").css("font-weight", "bold").css("padding", "2px").css("text-align", "center").css("display", Ga.id == Game.townId ? "none" : "block").html(RepConvTool.GetLabel("MSGRTERR") + Ga.name));
    } catch (Xa) {
    }
    0 < L.length && 0 < P.length ? ($(ca).attr("style", "width: 50%; float:left;"), $(S).attr("style", "width: 50%; float:left;")) : 0 < L.length ? ($(ca).attr("style", "clear: both; top: 10px;"), $(S).attr("style", "display: none")) : 0 < P.length ? ($(ca).attr("style", "display: none"), $(S).attr("style", "clear: both; top: 10px;")) : ($(ca).attr("style", "display: none"), $(S).attr("style", "display: none"));
    e.append(ca);
    e.append(S);
    0 < F.length && v.find($("#report_receiving_town .gp_player_link")).html() == Game.player_name && e.append(Qa);
  }
  function jb() {
    D = c("MSGASATTDEF", !0, "MSGASATT");
    G = c("MSGASDEFDEF", !0, "MSGASDEF");
    M = c("MSGASATTLOS", !0, "MSGASATT");
    K = c("MSGASDEFLOS", !0, "MSGASDEF");
    ba = $("<div/>", {"class":"radiobutton"}).radiobutton({value:"MSGDIFF2", template:"tpl_radiobutton", options:[{value:"MSGDIFF1", name:RepConvTool.GetLabel("MSGDIFF1")}, {value:"MSGDIFF2", name:RepConvTool.GetLabel("MSGDIFF2")}, {value:"MSGDIFF3", name:RepConvTool.GetLabel("MSGDIFF3")}]}).on("rb:change:value", function() {
      RepConv.Debug && console.log("rShowDiff=" + ba.getValue());
      va();
    });
    var d = $("<div/>").append($("<fieldset/>", {id:"publish_report_options_group_1L", style:"width:46%; float: left; border : 0px;"}).append($("<legend/>").html(RepConvTool.GetLabel("MSGDEFSITE"))).append(D).append(G)).append($("<fieldset/>", {id:"publish_report_options_group_1R", style:"width:46%; float: right; border : 0px;"}).append($("<legend/>").html(RepConvTool.GetLabel("MSGLOSSITE"))).append(M).append(K)).append($("<div/>", {style:"width: 100%; text-align: center; clear: both;"}).append(ba));
    0 == $a.find($("div.grcrt_wall_diff")).length && (ba.setValue("MSGDIFF1"), ba.disable());
    d = RepConvTool.RamkaLight(RepConvTool.GetLabel("MSGQUEST"), d, 125);
    e.append(d);
  }
  function wa() {
    var d = $("<div/>").append(sb).append(wb).append(xb).append(yb);
    d = RepConvTool.RamkaLight(RepConvTool.GetLabel("MSGQUEST"), d, 125);
    e.append(d);
  }
  function va() {
    try {
      1 == $("#repConvArea").length && $("#repConvArea").remove(), 1 == $("#RepConvDivPrev").length && $("#RepConvDivPrev").remove(), $("#RepConvBtns div.RepConvMsg").html(""), cb.show(), Sa.hide(), Ja.hide(), $("#grcrt_pagination").hide();
    } catch (d) {
      RepConv.Debug && console.log(d);
    }
  }
  function Oa() {
    var d = $("<div/>").append(g).append(u);
    d = RepConvTool.RamkaLight(RepConvTool.GetLabel("MSGFORUM"), d, 120);
    $(d).attr("style", "clear: both; top: 10px");
    e.append(d);
  }
  function Pa() {
    cb = RepConvTool.AddBtn("BTNGENER");
    Sa = RepConvTool.AddBtn("BTNVIEW");
    Ja = RepConvTool.AddBtn("BTNVIEWBB");
    qb = $("<div/>", {"class":"button_arrow left"}).button();
    rb = $("<div/>", {"class":"button_arrow right"}).button();
    $("<div/>", {id:"grcrt_pagination", "class":"slider grepo_slider"}).css({width:"70px", "float":"right", padding:"2px 5px", "text-align":"center", display:"inline-block"}).append(qb.css("float", "left").click(function() {
      0 < gb && (gb--, bb());
    })).append($("<div/>", {"class":"pages", style:"float: left; width: 40px; padding-top: 3px;"}).html("")).append(rb.css("float", "left").click(function() {
      gb < pb && (gb++, bb());
    })).hide().appendTo(window.RepConvOptionsWnd.getJQElement().find($("#RepConvBtns")));
    cb.click(function() {
      Ja.show();
      Sa.hide();
      RepConv.Debug && console.log("_generateReport");
      $("#RepConvBtns div.RepConvMsg").html("");
      "BBCODEE" == g.getValue() ? (GRCRTtpl.rct = GRCRTtpl.rcts.E, Ja.show()) : "BBCODEI" == g.getValue() ? (GRCRTtpl.rct = GRCRTtpl.rcts.I, Ja.show()) : (GRCRTtpl.rct = GRCRTtpl.rcts.A, Ja.hide());
      cb.hide();
      RepConv.Debug && console.log("btns");
      switch(b) {
        case "command":
          ib();
          break;
        case "breach":
        case "attack":
          Ra();
          break;
        case "take_over":
          Ra();
          a.showRT = na.isChecked();
          na.isChecked() && hb();
          break;
        case "attackSupport":
          RepConv.Debug && console.log("_attackSupport");
          q();
          z();
          x();
          B();
          Q();
          N();
          U();
          a.attacker = R();
          a.defender = R();
          a.attacker = W(a.attacker, v.find($("#report_sending_town")));
          a.defender = W(a.defender, v.find($("#report_receiving_town")));
          a.powerAtt = "";
          a.powerDef = "";
          Ia.isChecked() ? aa("defender", "div.support_report_summary div.report_units.report_side_defender div.report_side_defender_unit") : (a.defender.full = {img_url:RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), "i")}, a.defender.splits = {1:{img_url:RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), "i")}});
          a.bunt = "";
          break;
        case "espionage":
          var d = 0 != v.find("div#spy_buildings>div.spy_success_left_align").length;
          q();
          x();
          a.morale = "";
          a.luck = "";
          a.oldwall = {};
          a.nightbonus = "";
          a.attacker = R();
          a.defender = R();
          a.attacker = W(a.attacker, v.find($("#report_sending_town")));
          a.defender = W(a.defender, v.find($("#report_receiving_town")));
          a.defender.title = v.find($("div#left_side>h4")).html() || v.find($("div#left_side>p")).html();
          a.defender.success = 0 != v.find($("div#left_side>h4")).length;
          ia("defender", d ? "div#left_side>div.spy_success_left_align>div.report_unit" : "div#left_side>div.report_unit", 9);
          a.build = {};
          a.build.title = v.find($("div#spy_buildings>h4")).html();
          la("build", d ? "div#spy_buildings>div.spy_success_left_align>div.report_unit" : "div#spy_buildings>div.report_unit", 9);
          a.iron = {};
          0 < v.find($("div#right_side>h4")).length ? a.iron.title = v.find($("div#right_side>h4"))[0].innerHTML : 0 < v.find($("div#right_side>p")).length ? a.iron.title = v.find($("div#right_side>p"))[0].innerHTML.replace(/(.*:).*/, "$1") : a.iron.title = v.find($("div#report_game_body>div>p")).html().trim();
          a.iron.count = 0 < v.find($("div#right_side")).length ? v.find($("#payed_iron span")).html() || v.find($("div#right_side>.spy_success_left_align")) && v.find($("div#right_side>.spy_success_left_align")).eq(0).text().trim() || v.find($("div#right_side>p"))[0].innerHTML.replace(/.*:([0-9]*)/, "$1").trim() : "";
          d ? Z() : (fa(), a.resources.title = v.find($("#right_side>#resources")).prev().html());
          "" != a.iron.count && (a.iron.count = RepConvTool.AddSize(a.iron.count, 8));
          try {
            a.god = {title:d ? v.find($("#right_side>h4")).eq(2).html() : "", img_url:d ? RepConvTool.Adds((RepConv.grcrt_cdn + "ui/3/{0}.png").RCFormat(v.find($("div#right_side>.spy_success_left_align")).eq(2).find($(".god_display .god_mini")).attr("class").split(/\s+/)[1] || "nogod"), "img") : ""};
          } catch (w) {
            a.god = {title:"", img_url:""};
          }
          break;
        case "commandList":
          ea();
          break;
        case "conqueroldtroops":
          db();
          break;
        case "conquerold":
          RepConv.Debug && console.log("_conquerOld");
          a.title = v.find($("#conqueror_units_in_town>span")).html();
          a.time = v.find($("div.clearfix"))[0].innerHTML.stripTags().trim().replace(/\n/gi, "").replace(/.*(\(.*\)).*/, "$1");
          a.attacker = {};
          a.defender = {};
          a.defender.town = RepConvTool.Adds(JSON.parse(RepConvTool.Atob(v.find($("div.clearfix a.gp_town_link")).attr("href")))[GRCRTtpl.rct.getTown].toString(), GRCRTtpl.rct[JSON.parse(RepConvTool.Atob(v.find($("div.clearfix a.gp_town_link")).attr("href"))).tp]);
          a.defender.townName = v.find($("div.clearfix a.gp_town_link")).html();
          a.defender.player = RepConvTool.Adds(v.find($("div.clearfix a.gp_player_link")).html(), GRCRTtpl.rct.player);
          a.defender.playerName = v.find($("div.clearfix a.gp_player_link")).html();
          null == a.defender.player && (a.defender.player = "", a.defender.playerName = "");
          ta.isChecked() && (a.defender.town = RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), GRCRTtpl.rct.town));
          a.attacker.units_title = v.find($("div.clearfix div.bold")).html();
          oa.isChecked() ? ia("attacker", "div.index_unit", 11) : a.attacker.full = {img_url:RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), "i")};
          RepConv.Debug && console.log(a);
          break;
        case "support":
          q();
          z();
          x();
          B();
          Q();
          N();
          U();
          a.attacker = R();
          a.attacker = W(a.attacker, v.find($("#report_sending_town")));
          a.defender = W(a.defender, v.find($("#report_receiving_town")));
          a.power = 0 == v.find($("div.report_power")).length ? "" : RepConvTool.Adds(RepConv.Const.staticImg + v.find($("div.report_power")).attr("id") + "_30x30.png", "img");
          oa.isChecked() ? ia("attacker", "div.report_unit", 10) : a.attacker.full = {img_url:RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), "i")};
          break;
        case "agoraS":
        case "agoraD":
          Va();
          break;
        case "powers":
          q();
          x();
          a.attacker = W(a.attacker, v.find($("#report_sending_town")));
          a.defender = W(a.defender, v.find($("#report_receiving_town")));
          a.morale = "";
          a.luck = "";
          a.oldwall = {};
          a.nightbonus = "";
          a.efekt = {};
          a.type = -1;
          a.resources = {};
          a.power = RepConvTool.Adds(RepConv.Const.staticImg + v.find($("div#report_power_symbol")).attr("class").replace(/power_icon86x86 (.*)/, "$1") + "_30x30.png", "img");
          a.powerinfo = {};
          a.powerinfo.id = v.find($("div#report_power_symbol")).attr("class").replace(/power_icon86x86 (.*)/, "$1");
          switch(a.powerinfo.id) {
            case "happiness":
            case "fertility_improvement":
            case "bolt":
            case "earthquake":
            case "call_of_the_ocean":
            case "town_protection":
            case "cap_of_invisibility":
              a.type = 1;
              break;
            case "sea_storm":
            case "divine_sign":
            case "wisdom":
            case "transformation":
            case "patroness":
            case "resurrection":
            case "chain_lightning":
            case "demoralizing_plague":
            case "sudden_aid":
            case "demoralized_army":
              a.type = 2;
              break;
            case "kingly_gift":
            case "wedding":
            case "underworld_treasures":
            case "wedding_of_the_aristocrats":
            case "natures_gift":
              a.type = 3;
              break;
            case "fair_wind":
            case "strength_of_heroes":
            case "desire":
            case "pest":
            case "summoning_of_the_nereids":
            case "help_of_the_nereids":
              a.type = 4;
              break;
            case "cleanse":
              a.type = 5;
              break;
            case "olympus_mortal_curse":
              a.defender.player = Na(v.find($("#report_sending_town"))), a.defender.ally = Ea(v.find($("#report_sending_town"))), a.type = 2;
          }a.powerinfo.name = GameData.powers[a.powerinfo.id].name;
          a.powerinfo.description = v.find($("div#left_side>p")).html().stripTags();
          a.efekt.title = v.find($("div#left_side h4")).html();
          switch(a.type) {
            case 1:
              a.efekt.detail = v.find($("#right_side p")).html().stripTags().trim();
              break;
            case 2:
              a.efekt.detail = v.find($("#right_side h4")).html();
              a.resources = R();
              ia("resources", "#right_side div.report_unit", 5);
              break;
            case 3:
              a.efekt.detail = v.find($("#report_result")).html();
              fa();
              break;
            case 5:
              0 < v.find($(".power_icon")).length && (d = v.find($(".power_icon")).attr("name"), a.efekt.detail = GameData.powers[d].name, a.resources = R(), a.resources.img_url = RepConvTool.Adds(RepConv.Const.uiImg + "8/" + d + ".png", "img"));
          }break;
        case "raise":
          Za();
          break;
        case "wall":
          Ya();
          break;
        case "illusion":
        case "conquer":
        case "found":
          q();
          z();
          x();
          a.morale = "";
          a.luck = "";
          a.oldwall = {};
          a.nightbonus = "";
          a.attacker = W(a.attacker, v.find($("#report_sending_town")));
          a.defender = W(a.defender, v.find($("#report_receiving_town")));
          d = 0 == v.find($("#report_game_body p a.gp_town_link")).length ? "" : RepConvTool.Adds(JSON.parse(RepConvTool.Atob(v.find($("#report_game_body p a.gp_town_link")).attr("href")))[GRCRTtpl.rct.getTown].toString(), GRCRTtpl.rct[JSON.parse(RepConvTool.Atob(v.find($("#report_game_body p a.gp_town_link")).attr("href"))).tp]);
          var r = 0 == v.find($("#report_game_body p a.gp_player_link")).length ? "" : RepConvTool.Adds(v.find($("#report_game_body p a.gp_player_link")).html(), GRCRTtpl.rct.player);
          a.detail = v.find($("#report_game_body p")).html().trim().replace(/<a[^\/]*gp_player_link[^\/]*\/a>/, r).replace(/<a[^\/]*gp_town_link[^\/]*\/a>/, d);
          break;
        case "conquest":
          eb();
          break;
        case "academy":
          ma();
          break;
        case "ownTropsInTheCity":
          a.title = GRCRTtpl.rct.outside ? RepConvTool.Adds(v.closest($(".ui-dialog-title")).html(), GRCRTtpl.rct.town) : RepConvTool.Adds(f.getHandler().target_id.toString(), GRCRTtpl.rct.town);
          a.title += ": " + v.find($(".support_details_box .game_header")).html().stripTags();
          a.time = "";
          a.defender = {};
          a.defender.full = T();
          a.defender.full.img_url = v.find($(".no_results")).html();
          ia("defender", ".support_details_box .units_list .unit_icon25x25", 11);
          0 == a.defender.full.ua.length && (a.defender.full.img_url = v.find($(".no_results")).html());
          break;
        case "bbcode_island":
          lb();
          break;
        case "bbcode_player":
          Ta();
          break;
        case "bbcode_alliance":
          ab();
          break;
        case "main":
          Fa();
          break;
        case "olympus_temple_info":
          Wa();
      }
      RepConv.Debug && console.log(a);
      try {
        a.showCost = kb.isChecked() || !1;
      } catch (w) {
      }
      if (ta.isChecked()) {
        try {
          a.attacker.town = RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), GRCRTtpl.rct.town), a.title = a.title.replace(" (" + a.attacker.playerName + ")", ""), a.title = a.title.replace(a.attacker.townName, a.attacker.playerName);
        } catch (w) {
        }
      }
      if (ha.isChecked()) {
        try {
          a.defender.town = RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), GRCRTtpl.rct.town), a.title = a.title.replace(" (" + a.defender.playerName + ")", ""), a.title = a.title.replace(a.defender.townName, a.defender.playerName);
        } catch (w) {
        }
      }
      if (!nb.isChecked() && !pa.isChecked() && "powers" != b && "raise" != b) {
        try {
          a.resources.img_url = RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), "i");
        } catch (w) {
        }
      }
      if (!ua.isChecked()) {
        try {
          a.iron.count = RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), "i");
        } catch (w) {
        }
      }
      try {
        a.reportImage = m(v.find($("div#report_arrow img")).attr("src"));
      } catch (w) {
      }
      mb = GRCRTtpl.report("BBCODEP" == u.getValue() ? "txt" : "tbl", b, a);
      gb = 0;
      pb = Object.size(mb.splits) - 1;
      RepConv.__repconvValueArray = mb.splits;
      RepConv.__repconvValueBBCode = mb.single;
      t(mb.splits, "");
      $("#grcrt_pagination").show();
      bb();
      "BBCODEI" == g.getValue() && $("#grcrt_pagination").hide();
    }).appendTo(window.RepConvOptionsWnd.getJQElement().find($("#RepConvBtns")));
    Sa.hide().click(function() {
      0 < $("#repConvArea").length && ($("#repConvArea").slideToggle(), $("#RepConvDivPrev").slideToggle(), Ja.show(), Sa.hide());
    }).appendTo(window.RepConvOptionsWnd.getJQElement().find($("#RepConvBtns")));
    Ja.hide().click(function() {
      0 < $("#repConvArea").length && ($("#repConvArea").slideToggle(), $("#RepConvDivPrev").slideToggle(), Sa.show(), Ja.hide());
    }).appendTo(window.RepConvOptionsWnd.getJQElement().find($("#RepConvBtns")));
    $("<div/>", {"class":"RepConvMsg", style:"float: left; margin: 5px;"}).appendTo(window.RepConvOptionsWnd.getJQElement().find($("#RepConvBtns")));
    window.RepConvOptionsWnd.getJQElement().find($("#RepConvBtns")).css("display", "block");
  }
  if ("object" == typeof f) {
    RepConv.Debug && console.log("wnd.type=" + f.getType());
    var Ua = "undefined" == typeof f.getID, $a = Ua ? $("#window_" + f.getIdentifier()) : $("#gpwnd_" + f.getID()), v = Ua ? $a.find("div.window_content") : $a, b = A(f);
    $("<br/>", {style:"clear:both;"});
    var e = $("<div/>", {style:"margin-top: 3px"}), k = "attack", p = 225, a = {}, g = $("<div/>", {"class":"radiobutton"}).radiobutton({value:"BBCODEA", template:"tpl_radiobutton", options:[{value:"BBCODEA", name:RepConvTool.GetLabel("BBALLY")}, {value:"BBCODEE", name:RepConvTool.GetLabel("BBFORUM")}, {value:"BBCODEI", name:RepConvTool.GetLabel("BBIMG")}]}).on("rb:change:value", function() {
      RepConv.Debug && console.log("rBbcode=" + g.getValue());
      va();
    }), u = $("<div/>", {"class":"radiobutton"}).radiobutton({value:RepConv.active.reportFormat ? "BBCODEH" : "BBCODEP", template:"tpl_radiobutton", options:[{value:"BBCODEP", name:RepConvTool.GetLabel("BBTEXT")}, {value:"BBCODEH", name:RepConvTool.GetLabel("BBHTML")}]}).on("rb:change:value", function() {
      RepConv.Debug && console.log("rBbcodeType=" + u.getValue());
      va();
    }), D, G, M, K, ba, oa = c("MSGATTUNIT", !1), Ia = c("MSGDEFUNIT", !1), kb = c("MSGSHOWCOST", !1), nb = c("MSGRESOURCE", !1), ta = c("MSGHIDAT", !1), ha = c("MSGHIDDE", !1), Ba = c("MSGUNITS", !1), ja = c("MSGBUILD", !1), ua = c("MSGUSC", !1), pa = c("MSGRAW", !1), Aa = c("MSGDETAIL", !1), na = c("MSGRTSHOW", !1), Ha = c("MSGRTONLINE", !1), cb, Sa, Ja, qb, rb, tb, mb, gb = 0, pb = 0, sb = c("OLYMPOWNER", !0), xb = c("OLYMPTROOP", !0), yb = c("OLYMPACCOM", !0), wb = c("OLYMPDESC", !0);
    try {
      WM.getWindowByType("grcrt_convert")[0].close();
    } catch (d) {
    }
    window.RepConvOptionsWnd = WF.open("grcrt_convert");
    RepConv.Debug && console.log("Typ=" + b);
    switch(b) {
      case "command":
      case "breach":
      case "attack":
      case "attackSupport":
      case "raise":
      case "take_over":
      case "commandList":
      case "conquerold":
      case "conqueroldtroops":
      case "support":
      case "agoraD":
      case "agoraS":
      case "powers":
      case "espionage":
      case "conquer":
      case "found":
      case "illusion":
      case "conquest":
      case "academy":
      case "main":
      case "ownTropsInTheCity":
      case "bbcode_island":
      case "bbcode_player":
      case "bbcode_alliance":
        fb();
        break;
      case "wall":
        jb();
        p = 220;
        break;
      case "olympus_temple_info":
        wa(), p = 220;
    }
    Oa();
    var ub = RepConvTool.RamkaLight(RepConvTool.GetLabel("MSGBBCODE"), "");
    $(ub).attr("id", "RepConvAreas");
    $(e).append(ub);
    window.RepConvOptionsWnd.appendContent(RepConvTool.Ramka(RepConvTool.GetLabel("MSGTITLE"), e, 485));
    window.RepConvOptionsWnd.getJQElement().find($("#publish_report_options1,#publish_report_options2")).height(window.RepConvOptionsWnd.getJQElement().find($("#publish_report_options1,#publish_report_options2")).height());
    $("#RepConvAreas div.box_content").height(p);
    Pa();
    (Ua ? $a.find($(".btn_wnd.close")) : f.getJQCloseButton()).bind("click", function(d) {
      try {
        window.RepConvOptionsWnd.close();
      } catch (r) {
      }
      window.RepConvOptionsWnd = void 0;
    });
  }
}
function _GRCRTInnoFix() {
  $("head").append($("<style/>").append(".bbcodes.monospace img {\nmax-width: none;\n}"));
  $.Observer(GameEvents.window.reload).subscribe("grcrt_trade", function(f, A) {
    $.each($("div[class*=trade_tab_target]"), function(c, h) {
      c = $(h).find($("#way_duration")).addClass("way_duration").removeAttr("id").tooltip(DM.getl10n("farm_town").way_duration).text().replace("~", "").split(":");
      c = 3600 * parseInt(c[0]) + 60 * parseInt(c[1]) + parseInt(c[2]);
      $(h).find($("#arrival_time")).addClass("arrival_time").removeAttr("id").text(c).updateTime().tooltip(DM.getl10n("farm_town").arrival_time);
    });
  });
}
function _GRCRTMouseWheelZoom() {
  function f() {
    RepConv.settings[A] ? $("#main_area, .viewport.js-city-overview-viewport, .viewport.js-city-overview-buildings-container").bind("mousewheel", function(h, l) {
      h.stopPropagation();
      if (GRCRTMouseWheelZoom._whellWorkBullEye) {
        return !1;
      }
      GRCRTMouseWheelZoom._whellWorkBullEye = !0;
      h = $(".bull_eye_buttons .checked").get(0).getAttribute("name");
      $(".bull_eye_buttons ." + (0 > l ? c[h].next : c[h].prev)).click();
      setTimeout(function() {
        GRCRTMouseWheelZoom._whellWorkBullEye = !1;
      }, 250);
      return !1;
    }) : $("#main_area, .viewport.js-city-overview-viewport, .viewport.js-city-overview-buildings-container").unbind("mousewheel");
  }
  var A = RepConv._cookie + "_mouseWheelZoomBullEye";
  this._whellWorkBullEye = !1;
  var c = {strategic_map:{next:"island_view", prev:"city_overview"}, island_view:{next:"city_overview", prev:"strategic_map"}, city_overview:{next:"strategic_map", prev:"island_view"}};
  RepConv.sChbxs[A] = {label:"CHKMOUSEWHEELZOOMBULLEYE", default:!0};
  $.Observer(GameEvents.grcrt.settings.load).subscribe("GRCRTmouseWheelZoomBullEye_settings_load", function() {
    f();
  });
}
function _GRCRTMovedFrames() {
  function f() {
    if (0 == $("#toolbar_activity_commands_list").length) {
      setTimeout(function() {
        f();
      }, 500);
    } else {
      var A = document.querySelector("#toolbar_activity_commands_list");
      if (0 == $("#grcrt_taclWrap").length) {
        if ($("#toolbar_activity_commands_list").wrap($("<div/>", {"class":"grcrt_taclWrap", id:"grcrt_taclWrap"})), RepConv.settings[RepConv.Cookie + "_tacl"]) {
          $("#toolbar_activity_commands_list").addClass("grcrt_tacl");
          $("#grcrt_taclWrap").draggable().draggable("enable");
          var c = new MutationObserver(function(h) {
            h.forEach(function(l) {
              $(A).hasClass("grcrt_tacl") && $("#grcrt_taclWrap").attr("style") && "none" == $(A).css("display") && $(".activity.commands").trigger("mouseenter");
            });
          });
          0 == $("#toolbar_activity_commands_list>.js-dropdown-list>a.cancel").length && $("#toolbar_activity_commands_list>.js-dropdown-list").append($("<a/>", {href:"#n", "class":"cancel", style:"display:none;"}).click(function() {
            $("#grcrt_taclWrap").removeAttr("style");
          }));
          c.observe(A, {attributes:!0, childList:!1, characterData:!1});
        } else {
          $("#toolbar_activity_commands_list").removeClass("grcrt_tacl"), $("#grcrt_taclWrap").draggable().draggable("disable").removeAttr("style");
        }
      }
      $(A).hasClass("grcrt_tacl") && $("#grcrt_taclWrap").attr("style") && $(".activity.commands").trigger("mouseenter");
    }
  }
  $("head").append($("<style/>").append($("<style/>").append(".showImportant { bisplay: block !important}").append("#grcrt_taclWrap { left:312px; position: absolute; top: 29px;}").append("#grcrt_taclWrap>#toolbar_activity_commands_list { left: 0 !important; top: 0 !important;}").append(".grcrt_tacl { z-index:5000 !important;}").append(".grcrt_tacl>.js-dropdown-list>a.cancel { position: relative; float: right; margin-bottom: 11px;display:none; opacity: 0; visibility: hidden; transition: visibility 0s, opacity 0.5s linear;}").append(".grcrt_tacl>.js-dropdown-list:hover>a.cancel { display: block !important; visibility: visible; opacity: 0.5;}").append(".grcrt_tacl>.js-dropdown-list>a.cancel:hover { opacity: 1;}")));
  RepConv.sChbxs[RepConv.Cookie + "_tacl"] = {label:"CHKTACL", default:!0};
  $.Observer(GameEvents.grcrt.settings.load).subscribe("GRCRTMovedFrames_settings_load", function() {
    f();
  });
  $.Observer(GameEvents.command.send_unit).subscribe("GRCRTMovedFrames_command_send", function() {
    f();
  });
}
function _GRCRTOceanNumbers() {
  function f() {
    if (0 == $("#map_move_container").length) {
      setTimeout(function() {
        f();
      }, 100);
    } else {
      if (!RepConv.settings[A]) {
        $("div#grcrt_oceanNumbers").remove();
      } else {
        if (0 == $("div#grcrt_oceanNumbers").length) {
          $("#map_move_container").append($("<div/>", {id:"grcrt_oceanNumbers", style:"position:absolute; top:0; left:0;"}));
          (require("map/helpers") || MapTiles).map2Pixel(100, 100);
          for (var c = 0; 10 > c; c++) {
            for (var h = 0; 10 > h; h++) {
              var l = (require("map/helpers") || MapTiles).map2Pixel(100 * h, 100 * c);
              $("div#grcrt_oceanNumbers").append($("<div/>", {"class":"RepConvON", style:"left:" + l.x + "px; top: " + l.y + "px; background-image: url(" + RepConv.grcrt_cdn + "map/" + h + c + ".png);"}));
            }
          }
        }
      }
    }
  }
  var A = RepConv._cookie + "_oceanNumber";
  RepConv.sChbxs[A] = {label:"CHKOCEANNUMBER", default:!0};
  $.Observer(GameEvents.grcrt.settings.load).subscribe("GRCRTOceanNumbers_settings_load", function() {
    f();
  });
}
function _GRCRTTradeFarmOldVersion() {
  function f(c) {
    c.getName();
    $.each(c.getJQElement().find($(".fp_property>.popup_ratio")).parent(), function(h, l) {
      if (!$(l).hasClass("grcrt_trade")) {
        if (!$(l).children(0).eq(0).hasClass("you_pay")) {
          h = $(l).children(0).eq(0).attr("class");
          var m = $(l).children(0).eq(2).attr("class");
          $(l).children(0).eq(0).attr("class", m);
          $(l).children(0).eq(2).attr("class", h);
        }
        $(l).children(0).eq(1).html(GRCRTTradeFarmOldVersion.grcrtratio($(l).children(0).eq(1).html()));
        $(l).addClass("grcrt_trade");
      }
    });
  }
  function A(c) {
    c.getName();
    if (0 == c.getJQElement().find($(".grcrt_trin")).length) {
      var h = c.getJQElement().find($(".trade_slider_box>a.button")).attr("onclick").replace(/.*'([0-9]*)'.*/, "$1");
      h = WMap.mapData.getFarmTown(h);
      var l = Math.round(100 * h.ratio) / 100, m = !1;
      c.getJQElement().find($(".trade_slider_count>input.trade_slider_input")).before($("<div/>", {"class":"grcrt_trin spinner"}));
      c.getJQElement().find($(".trade_slider_count>input.trade_slider_output")).before($("<div/>", {"class":"grcrt_trout spinner"}));
      var C = c.getJQElement().find($(".grcrt_trin")).spinner({value:100, step:100, max:Math.min(ITowns.getTown(Game.townId).getAvailableTradeCapacity(), 2000), min:100}).on("sp:change:value", function() {
        m || (m = !0, c.getJQElement().find($(".trade_slider_count>input.trade_slider_input")).select().val(C.getValue()).blur(), J.setValue(l * C.getValue()), c.getJQElement().find($(".trade_slider_count>input.trade_slider_output")).select().val(J.getValue()).blur(), m = !1);
      });
      var J = c.getJQElement().find($(".grcrt_trout")).spinner({value:Math.round(100 * l), step:100, max:Math.round(l * Math.min(ITowns.getTown(Game.townId).getAvailableTradeCapacity(), 2000)), min:Math.round(100 * l)}).on("sp:change:value", function() {
        m || (m = !0, c.getJQElement().find($(".trade_slider_count>input.trade_slider_output")).select().val(J.getValue()).blur(), C.setValue(J.getValue() / l), c.getJQElement().find($(".trade_slider_count>input.trade_slider_input")).select().val(C.getValue()).blur(), m = !1);
      });
      C.setValue(Math.min(ITowns.getTown(Game.townId).getAvailableTradeCapacity(), C.getMax()));
      c.getJQElement().find($(".grcrt_trin")).css({top:110, left:96});
      c.getJQElement().find($(".grcrt_trout")).css({top:110, left:165});
      c.getJQElement().find($("input.trade_slider_input")).hide();
      c.getJQElement().find($("input.trade_slider_output")).hide();
      c.getJQElement().find($("div.left_container")).hide();
      c.getJQElement().find($("div.right_container")).hide();
      c.getJQElement().find($("div.trade_slider_slider")).hide();
      c.getJQElement().find($("form.trade_slider_count img.demand")).css({left:24});
      c.getJQElement().find($("form.trade_slider_count img.offer")).css({left:151});
      c.getJQElement().find($("form.trade_slider_count span.offer_header")).css({left:228, right:"auto"});
      c.getJQElement().find($("form.trade_slider_count span.demand_header")).css({left:"auto", right:228});
      c.getJQElement().find($(".trade_slider_box>a.button")).css({bottom:21});
      h = 1 <= l ? '<span style="color:rgb(0, 224, 28)">1:' + l + "</span>" : '<span style="color:rgb(247, 59, 34)">1:' + l + "</span>";
      c.getJQElement().find($(".trade_ratio:not(.trade_ratio_back)")).html(h);
      c.getJQElement().find($(".trade_ratio.trade_ratio_back")).html(h.stripTags());
    }
  }
  this.grcrtratio = function(c) {
    c = c.split(":");
    c = Math.round(c[0] / c[1] * 100) / 100;
    return 1 <= c ? '<span style="color:green; font-weight: bold">1:' + c + "</span>" : '<span style="color:red; font-weight: bold">1:' + c + "</span>";
  };
  this.init = function() {
    if ("undefined" == typeof GameData.FarmMouseOverTemplate) {
      setTimeout(function() {
        GRCRTTradeFarmOldVersion.init();
      }, 500);
    } else {
      if (-1 == GameData.FarmMouseOverTemplate.indexOf("you_pay")) {
        if ("undefined" == RepConv.settings[RepConv.Cookie + "_trade"] && RepConvTool.setItem(RepConv.Cookie + "_trade", !0), RepConv.settings[RepConv.Cookie + "_trade"]) {
          if ("undefined" == typeof GameData.FarmMouseOverTemplateGRCRT || GameData.FarmMouseOverTemplateOrg != GameData.FarmMouseOverTemplate) {
            GameData.FarmMouseOverTemplateOrg = GameData.FarmMouseOverTemplate, GameData.FarmMouseOverTemplateGRCRT = GameData.FarmMouseOverTemplate.replace(/offer/, "dem_and").replace(/demand/, "offer").replace(/dem_and/, "demand").replace(/ ratio /, "GRCRTTradeFarmOldVersion.grcrtratio(ratio)"), GameData.FarmMouseOverTemplate = GameData.FarmMouseOverTemplateGRCRT;
          }
        } else {
          "undefined" != typeof GameData.FarmMouseOverTemplateGRCRT && (GameData.FarmMouseOverTemplate = GameData.FarmMouseOverTemplateOrg);
        }
      } else {
        RepConv.settings[RepConv.Cookie + "_trade"] = !1;
      }
    }
  };
  $(document).ajaxComplete(function(c, h, l) {
    "undefined" != typeof l && (c = l.url.replace(/\/game\/(.*)\?.*/, "$1"), c = "frontend_bridge" != c ? c : -1 < l.url.indexOf("json") ? JSON.parse(unescape(l.url).split("&")[3].split("=")[1]).window_type : c, RepConv.requests[c] = {url:l.url, responseText:h.responseText}, $.each(Layout.wnd.getAllOpen(), function(m, C) {
      RepConv.Debug && console.log("Dodanie przycisku dla starego okna o ID = " + C.getID());
      m = Layout.wnd.GetByID(C.getID());
      RepConv.AQQ = m;
      if (RepConv.settings[RepConv.Cookie + "_trade"]) {
        switch(m.getController()) {
          case "farm_town_info":
            switch(m.getContext().sub) {
              case "farm_town_info_trading":
                A(m);
            }break;
          case "farm_town_overviews":
            switch(m.getContext().sub) {
              case "farm_town_overviews_index":
                f(m);
            }break;
          case "island_info":
            f(m);
        }
      }
    }));
  });
  RepConv.initArray.push("GRCRTTradeFarmOldVersion.init()");
  $.Observer(GameEvents.grcrt.settings.load).subscribe("GRCRToldTravel", function() {
    GRCRTTradeFarmOldVersion.init();
  });
}
function _GRCRT_AO() {
  function f() {
    O = 3;
    n = "grcrt_ao_scroll";
    t = 598;
    q = 600;
    x = $("<div/>").append($("<div/>", {"class":"grcrt_ao_bl"})).append($("<div/>", {"class":"grcrt_ao_green"})).append($("<div/>", {"class":"grcrt_ao_br"}));
    z = $("<div/>").append($("<div/>", {"class":"grcrt_ao_bl"})).append($("<div/>", {"class":"grcrt_ao_gray"})).append($("<div/>", {"class":"grcrt_ao_br"}));
    B = $("<div/>").append($("<div/>", {"class":"grcrt_ao_bl"})).append($("<div/>", {"class":"grcrt_ao_red"})).append($("<div/>", {"class":"grcrt_ao_br"}));
    Q = {};
    N = Object.size(GameData.researches) * (40 + 2 * O);
    U = MM.getCollections().Town[0];
    fa = !0;
    Z = {};
    var Y = $("<div/>", {"class":n}).width(N), V = $("<div/>").css({clear:"both", height:"40px", padding:"0", width:"100%", "border-bottom":"1px solid #000", background:"url(" + Game.img() + "/game/overviews/fixed_table_header_bg.jpg) repeat-x 0 0"}).append($("<div/>", {"class":"button_arrow left"}).css({position:"absolute", top:"10px", left:"170px"}).bind("click", function() {
      0 < $("." + n).position().left ? $("." + n).css({left:"0px"}) : 0 != $("." + n).position().left ? $("." + n).animate({left:"+=" + t + "px"}, 400) : $("." + n).animate({left:"-=" + Math.floor(N / q) * t + "px"}, 400);
    })).append($("<div/>").css({overflow:"hidden", position:"absolute", left:"190px", }).width(q).append(Y)).append($("<div/>", {"class":"button_arrow right"}).css({position:"absolute", top:"10px", right:"15px"}).click(function() {
      $("." + n).position().left < Math.floor(N / q) * t * -1 || 0 < $("." + n).position().left ? $("." + n).css({left:"0px"}) : Math.ceil(Math.abs($("." + n).position().left) / q) == Math.floor(N / q) ? $("." + n).animate({left:"+=" + Math.floor(N / q) * t + "px"}, 400) : $("." + n).animate({left:"-=" + t + "px"}, 400);
    }));
    $.each(GameData.researches, function(T, R) {
      Y.append($("<div/>", {"class":"grcrt_ao_unit unit research_icon research40x40 " + GameDataResearches.getResearchCssClass(T)}));
    });
    return V;
  }
  function A() {
    Z = {};
    0 < Object.size(MM.getModels().ResearchOrder) && $.each(MM.getModels().ResearchOrder, function(Y, V) {
      Z[V.getTownId()] = Z[V.getTownId()] || {};
      Z[V.getTownId()][V.getType()] = V;
    });
  }
  function c(Y) {
    fa = Y;
    var V = $("<ul/>").addClass("academy").addClass("js-scrollbar-content");
    Y = $("<div/>", {style:"position:relative; overflow-y:hidden; min-height:485px; max-height:485px;", "class":"js-scrollbar-viewport"}).append(V);
    var T = !1, R = [];
    $.each(MM.getCollections().TownGroupTown[0].getTowns(MM.getCollections().TownGroup[0].getActiveGroupId()), function(ia, la) {
      ia = MM.getModels().Town[la.getTownId()];
      R.push({id:ia.id, name:ia.getName()});
    });
    var X = !1;
    do {
      X = !1;
      for (var aa = 0; aa < R.length - 1; aa++) {
        R[aa].name > R[aa + 1].name && (X = R[aa], R[aa] = R[aa + 1], R[aa + 1] = X, X = !0);
      }
    } while (X);
    $.each(R, function(ia, la) {
      U.forEach(function(da) {
        if (la.id == da.id) {
          var W = $("<div/>", {"class":n}).css({display:"inline-block", position:"relative", left:"0px", }).width(Object.size(GameData.researches) * (40 + 2 * O)), qa = $("<li/>", {"class":T ? "odd" : "even", style:"position: relative; min-height: 29px;"});
          A();
          var za = GameData.researches, Ma = da.getBuildings().getBuildingLevel("academy"), Ka = h(da.id), Na = da.getResearches(), Ea = Z && Z[da.id] && Object.size(Z[da.id]) == GameDataConstructionQueue.getResearchOrdersQueueLength() || !1;
          qa.append($("<div/>", {"class":"grcrt_ao_ta grcrt_ao_town"}).append($("<a/>", {"class":"gp_town_link", href:da.getLinkFragment(), rel:da.id}).html(da.getName()))).append($("<div/>", {"class":"grcrt_ao_ta grcrt_ao_ap", id:"grcrt_ao_" + da.id}).html(Ka)).append($("<div/>").css({overflow:"hidden", position:"absolute", left:190 - 2 * O + "px", top:"3px", }).width(q).append(W));
          $.each(GameData.researches, function(ma, Fa) {
            Fa = za[ma];
            var ea = Na.hasResearch(ma), db = Z && Z[da.id] && Object.size(Z[da.id]) == GameDataConstructionQueue.getResearchOrdersQueueLength() || !1, eb = l(da.id, ma), Va = m(da.id, ma);
            W.append($("<div/>", {"class":"textbox tech_tree_box " + ma, id:"grcrt_ao_" + da.id + "_" + ma}).data("town", da.id).append(eb).append(Va).hover(function() {
              $(this).find($(".button_downgrade,.button_upgrade")).slideDown();
            }, function() {
              $(this).find($(".button_downgrade,.button_upgrade")).slideUp();
            }).tooltip(fa || !fa && !ea && !db ? GrcRTAcademyTooltipFactory.getResearchTooltip(Fa, Ma, Ka, ea, db, Ea, da.id) : AcademyTooltipFactory.getRevertTooltip(Fa, MM.checkAndPublishRawModel("Player", {id:Game.player_id}).getCulturalPoints())));
          });
          T = !T;
          V.append(qa);
        }
      });
    });
    return Y;
  }
  function h(Y) {
    var V = MM.getCollections().Town[0].get(Y), T = V.getBuildings().getBuildingLevel("academy") * GameDataResearches.getResearchPointsPerAcademyLevel() + V.getBuildings().getBuildingLevel("library") * GameDataResearches.getResearchPointsPerLibraryLevel();
    V.getResources();
    $.each(GameData.researches, function(R, X) {
      V.getResearches().get(R) && (T -= X.research_points);
    });
    A();
    0 < Object.size(Z) && Z[Y] && $.each(Z[Y], function(R, X) {
      T -= GameData.researches[R].research_points;
    });
    RepConv.Debug && console.log(T);
    return T;
  }
  function l(Y, V) {
    RepConv.Debug && console.log("wypelnienie dla town_id [" + Y + "] => " + V);
    var T = U.get(Y), R = T.getResearches().get(V);
    if (GameData.researches[V].building_dependencies.academy <= T.getBuildings().getBuildingLevel("academy")) {
      if (Z && Z[T.id] && Z[T.id][V]) {
        T = Z[T.id][V];
        if (T.getType() == V) {
          Q[Y + "_" + V] = $("<div/>", {"class":"single-progressbar instant_buy js-item-progressbar type_unit_queue"}).singleProgressbar({template:"tpl_pb_single_nomax", type:"time", reverse_progress:!0, liveprogress:!0, liveprogress_interval:1, value:T.getRealTimeLeft(), max:T.getDuration(), countdown:!0, }).on("pb:cd:finish", function() {
            $(this).parent().html(x.html());
            this.destroy();
          });
          var X = Q[Y + "_" + V];
        }
        return X || x.html();
      }
      return R ? x.html() : B.html();
    }
    return z.html();
  }
  function m(Y, V) {
    var T = U.get(Y), R = T.getResearches().get(V), X;
    if (GameData.researches[V].building_dependencies.academy <= T.getBuildings().getBuildingLevel("academy")) {
      if (Z && Z[T.id] && Z[T.id][V]) {
        return "";
      }
      !R && fa ? X = $("<div/>", {"class":"btn_upgrade button_upgrade"}).hide().data("town_id", Y).data("research", V).click(function() {
        var aa = $(this).data("town_id"), ia = $(this).data("research");
        RepConv.Debug && console.log(aa + " => " + ia);
        gpAjax.ajaxPost("frontend_bridge", "execute", {model_url:"ResearchOrder", action_name:"research", arguments:{id:ia}, town_id:aa}, !0, {success:function(la, da) {
          A();
          $("#grcrt_ao_" + aa + "_" + ia).html(l(aa, ia));
          $("#grcrt_ao_" + aa).html(h(aa));
        }, error:function(la, da) {
          RepConv.Debug && console.log(la);
          RepConv.Debug && console.log(da);
        }});
      }) : R && !fa && (X = $("<div/>", {"class":"btn_downgrade button_downgrade"}).hide().data("town_id", Y).data("research", V).click(function() {
        ConfirmationWindowFactory.openConfirmationResettingResearch(function(aa) {
          var ia = $(aa).data("town_id"), la = $(aa).data("research");
          RepConv.Debug && console.log("Potwierdzenie dla: " + ia + " => " + la);
          gpAjax.ajaxPost("frontend_bridge", "execute", {model_url:"ResearchOrder", action_name:"revert", arguments:{id:la}, town_id:ia}, !0, {success:function(da, W) {
            A();
            $("#grcrt_ao_" + ia + "_" + la).html(l(ia, la));
            $("#grcrt_ao_" + ia).html(h(ia));
          }, error:function(da, W) {
            RepConv.Debug && console.log(da);
            RepConv.Debug && console.log(W);
          }});
        }.bind(this, this));
      }));
    }
    return X;
  }
  function C() {
    var Y = "";
    MM.getCollections().TownGroup[0].forEach(function(V) {
      V.getId() == MM.getCollections().TownGroup[0].getActiveGroupId() && (Y = " (" + V.getName() + ")");
    });
    return Y;
  }
  function J() {
    require("game/windows/ids").GRCRT_AO = "grcrt_ao";
    (function() {
      var Y = window.GameControllers.TabController, V = $("<div/>", {id:"townsoverview"}), T = Y.extend({initialize:function(R) {
        RepConv.Debug && console.time("initialize");
        Y.prototype.initialize.apply(this, arguments);
        var X = this.getWindowModel();
        this.$el.html(V);
        X.hideLoading();
        X.getJQElement || (X.getJQElement = function() {
          return V;
        });
        X.appendContent || (X.appendContent = function(aa) {
          return V.append(aa);
        });
        X.setContent2 || (X.setContent2 = function(aa) {
          return V.html(aa);
        });
        this.bindEventListeners();
        RepConv.Debug && console.timeEnd("initialize");
      }, render:function() {
        this.reRender();
      }, reRender:function() {
        RepConv.Debug && console.time("reRender");
        var R = this.getWindowModel(), X = this.$el;
        this.getWindowModel().setTitle(RepConv.grcrt_window_icon + GameData.buildings.academy.name + C());
        MM.getCollections().TownGroup[0].getTownGroups();
        this.getWindowModel().showLoading();
        setTimeout(function() {
          RepConv.Debug && console.time("fill");
          R.setContent2(f());
          R.appendContent(c(0 == R.getActivePageNr()));
          R.hideLoading();
          RepConv.Debug && console.timeEnd("fill");
          X.find(".js-scrollbar-viewport").skinableScrollbar({orientation:"vertical", template:"tpl_skinable_scrollbar", skin:"narrow", disabled:!1, elements_to_scroll:X.find(".js-scrollbar-content"), element_viewport:X.find(".js-scrollbar-viewport"), scroll_position:0, min_slider_size:16});
        }, 100);
        RepConv.Debug && console.timeEnd("reRender");
      }, bindEventListeners:function() {
        this.$el.parents(".grcrt_ao").on("click", ".js-wnd-buttons .help", this._handleHelpButtonClickEvent.bind(this));
      }, _handleHelpButtonClickEvent:function() {
        var R = this.getWindowModel().getHelpButtonSettings();
        RepConvGRC.openGRCRT(R.action.tab, R.action.args);
      }});
      window.GameViews.GrcRTView_grcrt_ao = T;
    })();
    (function() {
      var Y = window.GameViews, V = window.WindowFactorySettings, T = require("game/windows/ids"), R = require("game/windows/tabs"), X = T.GRCRT_AO;
      V[X] = function(aa) {
        aa = aa || {};
        var ia = DM.getl10n(T.ACADEMY);
        return us.extend({window_type:X, minheight:570, maxheight:580, width:822, tabs:[{type:R.RESEARCH, title:ia.tabs[0], content_view_constructor:Y.GrcRTView_grcrt_ao, hidden:!1}, {type:R.RESET, title:ia.tabs[1], content_view_constructor:Y.GrcRTView_grcrt_ao, hidden:!1}], max_instances:1, activepagenr:0, title:RepConv.grcrt_window_icon + GameData.buildings.academy.name}, aa);
      };
    })();
  }
  function I() {
    var Y = DM.getl10n("tooltips", "academy");
    window.GrcRTAcademyTooltipFactory = {getResearchTooltip:function(V, T, R, X, aa, ia, la) {
      var da = "";
      if (da += '<div class="academy_popup">', da += "<h4>" + V.name + "</h4>", da += '<p style="width: 320px;">' + V.description + "</p>", X) {
        da += "<h5>" + Y.already_researched + "</h5>";
      } else {
        if (aa) {
          da += "<h5>" + Y.in_progress + "</h5>";
        } else {
          var W, qa, za = "";
          X = ITowns.getTown(la);
          aa = X.resources();
          var Ma = X.getProduction(), Ka = 0, Na = !0;
          X = !0;
          la = GrcRTGameDataResearches.getResearchCosts(V, la);
          var Ea = {wood:{amount:Math.floor(la.wood, 10)}, stone:{amount:Math.floor(la.stone, 10)}, iron:{amount:Math.floor(la.iron, 10)}, research_points:{amount:V.research_points}, time:{amount:GameDataResearches.getResearchTime(V, T)}};
          for (W in Ea) {
            if (Ea.hasOwnProperty(W)) {
              la = Ea[W];
              var ma = W;
              ma = '<img src="' + Game.img() + "/game/res/" + ("population" === ma ? "pop" : ma) + '.png" alt="' + Y[ma] + '" />';
              if (za += ma, "research_points" === W && la.amount > R) {
                Na = !1;
              }
              la.amount > aa[W] && "time" !== W && "research_points" !== W && (X = !1, 0 < Ma[W]) && (qa = parseInt(3600 * parseFloat((la.amount - aa[W]) / Ma[W]), 10), qa > Ka && 0 < qa) && (Ka = qa);
              "time" === W && (la.amount = DateHelper.readableSeconds(la.amount));
              za += "<span" + (la.amount > aa[W] || "research_points" === W && !1 === Na ? ' style="color:#B00"' : "") + ">" + la.amount + "</span>";
            }
          }
          R = Ka;
          da += za + "<br/>";
          V = V.building_dependencies;
          T < V.academy && (da += "<h5>" + Y.building_dependencies + "</h5>", da += '<span class="requirement">' + GameData.buildings.academy.name + " " + V.academy + "</span><br />");
          X || (da += '<span class="requirement">' + Y.not_enough_resources + '</span><br /><span class="requirement">' + s(Y.enough_resources_in, DateHelper.formatDateTimeNice(Timestamp.server() + R, !1)) + "</span><br />");
          ia && (da += '<span class="requirement">' + Y.full_queue + "</span><br />");
        }
      }
      return da + "</div>";
    }};
  }
  function E(Y) {
    var V = $.extend({}, GameDataResearches, {getResearchCostsById:function(T, R) {
      return this.getResearchCosts(GameData.researches[T], R);
    }, getResearchCosts:function(T, R) {
      MM.getCollections().PlayerHero[0] || MM.createBackboneObjects({PlayerHeroes:null}, window.GameCollections, {});
      var X, aa;
      return X = T.resources, aa = GeneralModifications.getResearchResourcesModification(R), {wood:Math.ceil(X.wood * aa), stone:Math.ceil(X.stone * aa), iron:Math.ceil(X.iron * aa)};
    }});
    Y.GrcRTGameDataResearches = V;
  }
  var O = 3, n = "grcrt_ao_scroll", t = 598, q = 600, x = $("<div/>").append($("<div/>", {"class":"grcrt_ao_bl"})).append($("<div/>", {"class":"grcrt_ao_green"})).append($("<div/>", {"class":"grcrt_ao_br"})), z = $("<div/>").append($("<div/>", {"class":"grcrt_ao_bl"})).append($("<div/>", {"class":"grcrt_ao_gray"})).append($("<div/>", {"class":"grcrt_ao_br"})), B = $("<div/>").append($("<div/>", {"class":"grcrt_ao_bl"})).append($("<div/>", {"class":"grcrt_ao_red"})).append($("<div/>", {"class":"grcrt_ao_br"})), 
  Q = {}, N = Object.size(GameData.researches) * (40 + 2 * O), U = null, fa = !0, Z = {};
  RepConv.menu[4] = {name:"AO.TITLE", action:"GRCRT_AO.windowOpen();", "class":"aom"};
  $("head").append($("<style/>").append(".grcrt.ao { background-position: -77px -80px; cursor: pointer;}").append(".grcrt_ao_unit { margin: 0 " + O + "px !important;}").append("." + n + " {display: inline-block; position: relative; left: 0px;}").append(".grcrt_ao_scroll .textbox {margin: 0px " + O + "px; width: 40px; float: left;}").append(".grcrt_ao_bl, .grcrt_ao_br, .grcrt_ao_green, .grcrt_ao_gray, .grcrt_ao_red {float: left; height: 24px; background: url(" + Game.img() + "/game/survey/survey_sprite.png) no-repeat scroll 0px -39px;}\n.grcrt_ao_bl, .grcrt_ao_br {width: 2px;}\n.grcrt_ao_green, .grcrt_ao_gray, .grcrt_ao_red {width: 36px;}\n.grcrt_ao_bl {background-position: 0px -39px;}\n.grcrt_ao_br {background-position: -360px -39px;}\n.grcrt_ao_green {background-position: -321px -39px;}\n.grcrt_ao_gray {background: gray;}\n.grcrt_ao_red {background-position: -2px -39px;}\n.grcrt_ao_ta {font-size: 10px; float:left; padding-top: 8px; }\n.grcrt_ao_town {width: 130px; max-width:130px; padding-left: 5px;}\n.grcrt_ao_ap {width: 40px; max-width:40px; text-align: right; background: url(" + 
  Game.img() + "/game/academy/points_25x25.png) no-repeat;}\n.grcrt_ao .single-progressbar .curr { font-size: 8px;}\n.grcrt_ao .button_upgrade, .grcrt_ao .button_downgrade {bottom: 1px !important; right: 1px !important;}\n.grcrt.aom {background: url(" + Game.img() + "/game/academy/points_25x25.png) no-repeat;top: 4px !important; left: 4px !important;}\n"));
  this.windowOpen = function() {
    try {
      WM.getWindowByType("grcrt_ao")[0].close();
    } catch (Y) {
    }
    WF.open("grcrt_ao");
  };
  RepConv.initArray.push("GRCRT_AO.init()");
  RepConv.wndArray.push("grcrt_ao");
  this.init = function() {
    U = MM.getCollections().Town[0];
    N = Object.size(GameData.researches) * (40 + 2 * O);
    new E(window);
    new I;
    new J;
  };
}
function _GRCRT_Notifications() {
  this.version = "2.0";
  NotificationType.GRCRT = "grcrt";
  NotificationType.GRCRTNEWVERSION = "grcrtnewversion";
  NotificationType.GRCRTWHATSNEW = "grcrtwhatsnew";
  NotificationType.GRCRTRELOAD = "grcrtreload";
  $("head").append($("<style/>").append("#notification_area ." + NotificationType.GRCRT + " .icon, #notification_area ." + NotificationType.GRCRTNEWVERSION + " .icon, #notification_area ." + NotificationType.GRCRTWHATSNEW + " .icon, #notification_area ." + NotificationType.GRCRTRELOAD + " .icon { background: url(" + RepConv.grcrt_cdn + "img/octopus.png) 4px 7px no-repeat !important; cursor: pointer;}"));
  $.Observer(GameEvents.notification.push).subscribe("GRCRT_Notif_notification_push", function() {
    GRCRT_Notifications.addOnClick();
  });
  $.Observer(GameEvents.notification.del_all).subscribe("GRCRT_Notif_notification_del_all", function() {
    GRCRT_Updater.checked = !1;
  });
  $.Observer(GameEvents.notification.del).subscribe("GRCRT_Notif_notification_del", function() {
    GRCRT_Notifications.addOnClick();
  });
  $.Observer(GameEvents.window.open).unsubscribe("GRCRT_Notif_window_open");
  $.Observer(GameEvents.window.open).subscribe("GRCRT_Notif_window_open", function() {
    if (1 == GPWindowMgr.getOpenedWindows().length && GPWindowMgr.getOpenedWindows()[0].getType() == GPWindowMgr.TYPE_CONFIRM_DIALOG && $(".ui-widget-overlay").prev().hasClass("ui-dialog")) {
      var f = $(".ui-widget-overlay").prev();
      $(".ui-widget-overlay").insertBefore(f);
    }
  });
  this.addOnClick = function() {
    $.each($("#notification_area>.notification." + NotificationType.GRCRTNEWVERSION), function(f, A) {
      $(A).unbind("click");
      $(A).bind("click", function() {
        $(this).find($("a.close")).click();
        Layout.showConfirmDialog("GRCRTools new version", '<div><img src="' + RepConv.grcrt_cdn + 'img/octopus.png" style="float:left;padding-right: 10px"/><p style="padding:5px">' + RepConvTool.GetLabel("NEWVERSION.AVAILABLE") + ": <b>" + RepConv.asv + "</b></p></div>", function() {
          if ("undefined" == typeof GRCRTExtension) {
            try {
              location.href = RepConv.Scripts_update_path + "GrepolisReportConverterV2.user.js";
            } catch (c) {
            }
            GRCRT_Updater.reload = !0;
            GRCRT_Notifications.addNotification(NotificationType.GRCRTRELOAD);
          } else {
            "undefined" != typeof GRCRTExtension ? GRCRTExtension.getJSFile() && (GRCRT_Updater.reload = !0, GRCRT_Notifications.addNotification(NotificationType.GRCRTRELOAD)) : grcrtBrowser.safari && (GRCRT_Updater.reload = !0, GRCRT_Notifications.addNotification(NotificationType.GRCRTRELOAD));
          }
        }, RepConvTool.GetLabel("NEWVERSION.INSTALL"), function() {
          GRCRT_Updater.checked = !1;
        }, RepConvTool.GetLabel("NEWVERSION.REMINDER"));
      });
    });
    $.each($("#notification_area>.notification." + NotificationType.GRCRTWHATSNEW), function(f, A) {
      $(A).unbind("click");
      $(A).bind("click", function() {
        $(this).find($("a.close")).click();
        RepConvGRC.openGRCRT("HELPTAB3");
      });
    });
    $.each($("#notification_area>.notification." + NotificationType.GRCRTRELOAD), function(f, A) {
      $(A).unbind("click");
      $(A).bind("click", function() {
        $(this).find($("a.close")).click();
        GRCRT_Updater.reload = !1;
        Layout.showConfirmDialog("GRCRTools new version", '<div><img src="' + RepConv.grcrt_cdn + 'img/octopus.png" style="float:left;padding-right: 10px"/><p style="padding:5px">' + RepConvTool.GetLabel("NEWVERSION.REQRELOAD") + "</b></p></div>", function() {
          location.reload();
        }, RepConvTool.GetLabel("NEWVERSION.RELOAD"), function() {
          GRCRT_Updater.reload = !0;
        }, RepConvTool.GetLabel("NEWVERSION.REMINDER"));
      });
    });
  };
  this.addNotification = function(f) {
    if (7 < $("#notification_area>.notification").length) {
      setTimeout(function() {
        GRCRT_Notifications.addNotification(f);
      }, 10000);
    } else {
      switch(f) {
        case NotificationType.GRCRTNEWVERSION:
          0 == $("#notification_area ." + f).length && (this.checked = !0, createNotification(f, RepConvTool.GetLabel("NEWVERSION.AVAILABLE")));
          break;
        case NotificationType.GRCRTWHATSNEW:
          0 == $("#notification_area ." + f).length && (createNotification(f, RepConvTool.GetLabel("HELPTAB3")), RepConvTool.setItem(RepConv.CookieNew, RepConv.Scripts_version));
          break;
        case NotificationType.GRCRTRELOAD:
          0 == $("#notification_area ." + f).length && createNotification(f, RepConvTool.GetLabel("NEWVERSION.REQRELOAD"));
      }
    }
  };
  createNotification = function(f, A) {
    ("undefined" == typeof Layout.notify ? new NotificationHandler : Layout).notify($("#notification_area>.notification").length + 1, f, "<span><b>" + RepConv.Scripts_name + "</b></span>" + A + "<span class='small notification_date'>" + RepConv.Scripts_nameS + " " + RepConv.Scripts_version + " [" + RepConv.LangEnv + "]</span>");
  };
}
function _GRCRT_Radar() {
  function f(a, g) {
    return $("<div/>", {"class":"checkbox_new"}).checkbox({caption:"", checked:g, cid:a}).on("cbx:check", function() {
      I();
    });
  }
  function A() {
    var a = [{info:DM.getl10n("place", "simulator").unassign, value:""}], g = [];
    $.each(require("enums/runtime_info"), function(u, D) {
      g.push(D);
    });
    GameData.heroes && $.each(GameData.heroes, function(u, D) {
      D = {value:u, level:D.name, hero_level:1};
      -1 < $.inArray(u, g, 0) && a.push(D);
    });
    return a;
  }
  function c(a) {
    return GameData.researches[a] ? "<b>" + GameData.researches[a].name + "</b><br/><br/>" + GameData.researches[a].description : GameData.buildings[a] ? "<b>" + GameData.buildings[a].name + "</b><br/><br/>" + GameData.buildings[a].description : us.template(DM.getTemplate("COMMON", "casted_power_tooltip"), $.extend({}, GameDataPowers.getTooltipPowerData(GameData.powers[a], {percent:30, lifetime:1800, level:1}, "1"), null));
  }
  function h() {
    null == hb && (hb = Math.ceil(12 * GameData.units.colonize_ship.speed / WMap.getChunkSize()));
    return hb;
  }
  function l() {
    null == k && (k = "meteorology lighthouse cartography unit_movement_boost" + (30 == GameData.buildings.academy.max_level ? "" : " set_sail"));
    return k;
  }
  function m() {
    null != ea ? va.setExclusions([""]) : Va && "RGHOST" == Va.getValue() || null != ma || null != Fa ? (va.setValue("all"), va.setExclusions(["player", "alliance", "allypacts", "pacts", "enemies"])) : va.setExclusions([""]);
  }
  function C() {
    ea = Fa = ma = null;
  }
  function J(a) {
    var g = 0;
    var u = 0 + (GameData.units[wa.getValue()].is_naval && MM.getModels().Town[a].getResearches().get("cartography") ? GameData.research_bonus.cartography_speed : 0);
    u += 30 < GameData.buildings.academy.max_level && "colonize_ship" == wa.getValue() && MM.getModels().Town[a].getResearches().get("set_sail") ? GameData.research_bonus.colony_ship_speed : 0;
    u += GameData.units[wa.getValue()].is_naval && 1 == MM.getModels().Town[a].getBuildings().get("lighthouse") ? GameData.additional_runtime_modifier.lighthouse_speed_bonus : 0;
    u += !GameData.units[wa.getValue()].is_naval && MM.getModels().Town[a].getResearches().get("meteorology") ? GameData.research_bonus.meteorology_speed : 0;
    g += $a.isChecked() && !$(".grcrt_modifiers .modifier_icon.unit_movement_boost").hasClass("inactive") ? 0.3 : 0;
    return GameData.units[wa.getValue()].speed * (1 + u) * (1 + e + g);
  }
  function I() {
    if (null != ea) {
      Ka = ea.ix;
      Na = ea.iy;
      Ea = WMap.toChunk(Ka, Na).chunk;
      Za[ea.id] = Za[ea.id] || {};
      var a = 0;
      var g = 0 + (GameData.units[wa.getValue()].is_naval && Pa.isChecked() && !$(".grcrt_modifiers .modifier_icon.cartography").hasClass("inactive") ? GameData.research_bonus.cartography_speed : 0);
      g += 30 < GameData.buildings.academy.max_level && "colonize_ship" == wa.getValue() && Ua.isChecked() && !$(".grcrt_modifiers .modifier_icon.set_sail").hasClass("inactive") ? GameData.research_bonus.colony_ship_speed : 0;
      g += GameData.units[wa.getValue()].is_naval && v.isChecked() && !$(".grcrt_modifiers .modifier_icon.lighthouse").hasClass("inactive") ? GameData.additional_runtime_modifier.lighthouse_speed_bonus : 0;
      g += GameData.units[wa.getValue()].is_naval || !Oa.isChecked() || $(".grcrt_modifiers .modifier_icon.meteorology").hasClass("inactive") ? 0 : GameData.research_bonus.meteorology_speed;
      a += $a.isChecked() && !$(".grcrt_modifiers .modifier_icon.unit_movement_boost").hasClass("inactive") ? 0.3 : 0;
      ib = GameData.units[wa.getValue()].speed * (1 + g) * (1 + e + a);
    } else {
      Ma = MM.getModels().Town[Game.townId], Ka = Ma.get("island_x"), Na = Ma.get("island_y"), Ea = WMap.toChunk(Ka, Na).chunk, Za[Game.townId] = Za[Game.townId] || {}, ib = J(Game.townId);
    }
    $(".grcrt_modifiers .modifier_icon").removeClass("inactive");
    Oa.enable();
    Pa.enable();
    Ua.enable();
    v.enable();
    GameData.units[wa.getValue()].is_naval ? ($(".grcrt_modifiers .modifier_icon.meteorology").addClass("inactive"), Oa.disable()) : ($(".grcrt_modifiers .modifier_icon.cartography").addClass("inactive"), $(".grcrt_modifiers .modifier_icon.set_sail").addClass("inactive"), $(".grcrt_modifiers .modifier_icon.lighthouse").addClass("inactive"), Pa.disable(), Ua.disable(), v.disable());
    g = 3600 * Math.floor(-1.875 / GameData.units.colonize_ship.speed * GameData.units[wa.getValue()].speed + 25.875);
    bb.setMax(DateHelper.readableSeconds(g));
    bb.getTimeValueAsSeconds() > g && bb.setValue(DateHelper.readableSeconds(g));
  }
  function E() {
    Ta = {all:{name:RepConvTool.GetLabel("COMMAND.ALL"), value:[]}, player:{name:DM.getl10n("custom_colors").your_cities, value:[Game.player_id]}, alliance:{name:DM.getl10n("custom_colors").your_alliance, value:[MM.checkAndPublishRawModel("Player", {id:Game.player_id}).getAllianceId()]}, allypacts:{name:DM.getl10n("custom_colors").your_alliance + " + " + DM.getl10n("custom_colors").pacts, value:[MM.checkAndPublishRawModel("Player", {id:Game.player_id}).getAllianceId()]}, pacts:{name:DM.getl10n("custom_colors").pacts, 
    value:[]}, enemies:{name:DM.getl10n("custom_colors").enemies, value:[]}, };
    if (null != MM.checkAndPublishRawModel("Player", {id:Game.player_id}).getAllianceId()) {
      Ta.alliance = {name:DM.getl10n("custom_colors").your_alliance, value:[MM.checkAndPublishRawModel("Player", {id:Game.player_id}).getAllianceId()]};
      var a;
      $.each(MM.getOnlyCollectionByName("AlliancePact").models, function(u, D) {
        if (!D.getInvitationPending()) {
          switch(D.getRelation()) {
            case "war":
              a = "enemies";
              break;
            case "peace":
              a = "pacts";
          }
          "pacts" == a && Ta.allypacts.value.push(D.getAlliance1Id() == Game.alliance_id ? D.getAlliance2Id() : D.getAlliance1Id());
          Ta[a].value.push(D.getAlliance1Id() == Game.alliance_id ? D.getAlliance2Id() : D.getAlliance1Id());
        }
      });
    }
    var g = [];
    $.each(Ta, function(u, D) {
      g.push({name:D.name, value:u});
    });
    return g;
  }
  function O() {
    W = [];
    qa = {};
    za = [];
    I();
    setTimeout(function() {
      t();
    }, 500);
  }
  function n(a, g) {
    a = a.replace("#", "");
    var u = parseInt(a.substring(0, 2), 16), D = parseInt(a.substring(2, 4), 16);
    a = parseInt(a.substring(4, 6), 16);
    return "rgba(" + u + "," + D + "," + a + "," + g / 100 + ")";
  }
  function t() {
    for (var a = [], g = !1, u = [], D = Ea.x - h(); D <= Ea.x + h(); D++) {
      for (var G = Ea.y - h(); G <= Ea.y + h(); G++) {
        try {
          RepConv.Debug && console.log("G:" + D + ":" + G + " - " + WMap.mapData.getChunk(D, G).chunk.timestamp), RepConv.Debug && console.log("D:" + D + ":" + G + " - " + Ya[D + "_" + G].timestamp), g = WMap.mapData.getChunk(D, G).chunk.timestamp > Ya[D + "_" + G].timestamp;
        } catch (M) {
          g = !0;
        }
        RepConv.Debug && console.log("wmapChanged:" + g);
        (!Ya[D + "_" + G] || Ya[D + "_" + G].timestamp + 6E4 < Timestamp.server() || g) && a.push({x:D, y:G, timestamp:0});
        10 < a.length && (u.push(a), a = []);
      }
    }
    0 < a.length && u.push(a);
    setTimeout(function() {
      q(u);
    }, 10);
  }
  function q(a) {
    WMap.ajaxloader.ajaxGet("map_data", "get_chunks", {chunks:a[0]}, !0, function(g, u) {
      $.each(g.data, function(D, G) {
        Ya[G.chunk.x + "_" + G.chunk.y] = {timestamp:G.chunk.timestamp, towns:G.towns};
      });
    });
    a.remove(0, 0);
    0 < a.length && setTimeout(function() {
      q(a);
    }, 300);
  }
  function x() {
    0 == Object.size(Za[z()]) && $.each(Ya, function(a, g) {
      $.each(g.towns, function(u, D) {
        "town" == Ra(D) && (Za[z()][D.id] = D);
      });
    });
    return Za[z()];
  }
  function z() {
    return null != ea ? ea.id : Game.townId;
  }
  function B() {
    var a;
    if (null == ea) {
      var g = MM.getModels().Town[Game.townId], u = WMap.toChunk(g.get("island_x"), g.get("island_y")).chunk;
      u = Ya[u.x + "_" + u.y];
      $.each(u.towns, function(D, G) {
        "town" == Ra(G) && G.id == g.id && (a = Q(G));
      });
    } else {
      u = WMap.toChunk(ea.ix, ea.iy).chunk, u = Ya[u.x + "_" + u.y], $.each(u.towns, function(D, G) {
        "town" == Ra(G) && G.id == ea.id && (a = Q(G));
      });
    }
    return a;
  }
  function Q(a) {
    if ("town" != Ra(a)) {
      return null;
    }
    var g = {id:a.id, ix:a.x, iy:a.y, name:a.name, player_id:a.player_id, player_name:a.player_name, alliance_id:a.alliance_id, alliance_name:a.alliance_name, points:a.points, reservation:a.reservation, href:"#" + btoa(JSON.stringify({id:parseInt(a.id), ix:a.x, iy:a.y, tp:null !== a.player_id ? "town" : "ghost_town", name:a.name}).replace(/[\u007f-\uffff]/g, function(D) {
      return "\\u" + ("0000" + D.charCodeAt(0).toString(16)).slice(-4);
    })), flag_type:a.flag_type, fc:a.fc};
    a.id += "";
    a.id = a.id.replace("=", "");
    var u = require("map/helpers").map2Pixel(a.x, a.y);
    g.abs_x = u.x + a.ox;
    g.abs_y = u.y + a.oy;
    return g;
  }
  function N() {
    null != ma ? U() : null != Fa ? fa() : null != ea ? Z() : "RGHOST" != Va.getValue() ? Y() : V();
    return !0;
  }
  function U() {
    W = [];
    $.each(x(), function(a, g) {
      a = Q(g);
      null != a && a.player_id == ma.id && W.push(a);
    });
  }
  function fa() {
    W = [];
    $.each(x(), function(a, g) {
      a = Q(g);
      null != a && a.alliance_id == Fa.id && W.push(a);
    });
  }
  function Z() {
    W = [];
    $.each(x(), function(a, g) {
      a = Q(g);
      null != a && a.id != ea.id && W.push(a);
    });
  }
  function Y() {
    W = [];
    $.each(x(), function(a, g) {
      a = Q(g);
      null != a && a.player_id != Game.player_id && W.push(a);
    });
  }
  function V() {
    W = [];
    $.each(x(), function(a, g) {
      a = Q(g);
      null != a && null == a.player_id && W.push(a);
    });
  }
  function T() {
    var a = 900 / Game.game_speed;
    z();
    var g = B(), u, D;
    qa = {};
    za = [];
    $.each(W, function(K, ba) {
      K = Math.floor($.toe.calc.getDistance({x:g.abs_x, y:g.abs_y}, {x:ba.abs_x, y:ba.abs_y}));
      if (g.ix == ba.ix && g.iy == ba.iy || GameData.units[wa.getValue()].flying || GameData.units[wa.getValue()].is_naval) {
        u = MM.getModels().Town[ba.id] ? J(ba.id) : ib, D = Math.floor(50 * K / u + a), void 0 == qa[D] && (qa[D] = {time:0, towns:[]}, za.push(D)), qa[D].towns.push(ba), qa[D].timeInSec = Math.floor(50 * K / u + a), qa[D].time = DateHelper.readableSeconds(qa[D].timeInSec);
      }
    });
    do {
      var G = !1;
      for (var M = 0; M < za.length - 1; M++) {
        za[M] > za[M + 1] && (G = za[M], za[M] = za[M + 1], za[M + 1] = G, G = !0);
      }
    } while (G);
    return !0;
  }
  function R() {
    DM.getl10n("map");
    p = $("<div/>", {"class":"grcrt_pagination"});
    $("#grcrt_radar_result").html("").append($("<div/>", {"class":"game_header bold", style:"height:18px;"}).append($("<div/>", {"class":"grcrt_rr_town", style:"float:left;"}).html(RepConvTool.GetLabel("RADAR.TOWNNAME"))).append($("<div/>", {"class":"grcrt_rr_cs_time", style:"float:left; text-align: center; width: 220px"}).html(RepConvTool.GetLabel("RADAR.UNITTIME"))).append($("<div/>", {"class":"grcrt_rr_player", style:"float:left;"}).html(RepConvTool.GetLabel("RADAR.TOWNOWNER"))).append($("<div/>", 
    {"class":"grcrt_rr_player", style:"float:left;"}).html(RepConvTool.GetLabel("RADAR.TOWNRESERVED")))).append($("<div/>", {style:"min-height: 350px; max-height: 350px; overflow-y: hidden; overflow-x: hidden; border: 1px solid grey; position: relative;", "class":"js-scrollbar-viewport"}).append($("<ul/>", {"class":"game_list js-scrollbar-content", style:"width: 100%;"}))).append(p);
    var a = 0, g = !0;
    Wa = 0;
    ab = {};
    $.each(za, function(u, D) {
      bb.getTimeValueAsSeconds() >= qa[D].timeInSec && $.each(qa[D].towns, function(G, M) {
        if (fb.getValue() <= M.points && (parseFloat(RepConvGRC.idle.JSON[M.player_id]) >= jb.getValue() && (null != ma || null != Fa || null != ea || "RGHOST" != Va.getValue()) || Va && "RGHOST" == Va.getValue())) {
          switch(va.getValue()) {
            case "player":
              g = M.player_id == Game.player_id;
              break;
            case "alliance":
              g = Ta[va.getValue()].value.contains(M.alliance_id || 0);
              break;
            case "allypacts":
              g = Ta[va.getValue()].value.contains(M.alliance_id || 0);
              break;
            case "pacts":
              g = Ta[va.getValue()].value.contains(M.alliance_id || 0);
              break;
            case "enemies":
              g = Ta[va.getValue()].value.contains(M.alliance_id || 0);
              break;
            default:
              g = !0;
          }
          g && (0 == a % 20 && (ab[(a / 20).toString()] = []), M.timeInSec = qa[D].timeInSec, M.time = qa[D].time, ab[Math.floor(a++ / 20).toString()].push(M));
        }
      });
    });
    $.Observer(GameEvents.grcrt.radar.display_towns).publish();
  }
  function X() {
    var a = Object.size(ab), g = !0;
    p.html("");
    $.each(ab, function(u, D) {
      1 == parseInt(u) + 1 || parseInt(u) + 1 == a || parseInt(u) == Wa - 1 || parseInt(u) == Wa || parseInt(u) == Wa + 1 ? (g = !0, Wa == parseInt(u) ? p.append($("<strong/>", {"class":"paginator_bg", id:"paginator_selected"}).html(parseInt(u) + 1)) : p.append($("<a/>", {"class":"paginator_bg", href:"#n"}).html(parseInt(u) + 1).click(function() {
        Wa = parseInt($(this).html()) - 1;
        $.Observer(GameEvents.grcrt.radar.display_towns).publish();
      }))) : g && (g = !1, p.append($("<strong/>", {"class":"paginator_bg", id:"paginator_inactive"}).html("...")));
    });
  }
  function aa() {
    function a(M) {
      if (!M.reservation) {
        return "";
      }
      if ("added" === M.reservation.state) {
        return "ally" === M.reservation.type ? g.can_reserve : g.reserved_by_alliance;
      }
      if ("reserved" === M.reservation.state) {
        var K = '<span class="reservation_tool icon small ' + M.reservation.state + " " + M.reservation.type + '"></span>';
        return "own" === M.reservation.type ? K + g.reserved_for_you : "ally" === M.reservation.type ? K + g.reserved_for(M.reservation.player_link) : K + g.reserved_for_alliance(M.reservation.player_link, M.reservation.alliance_link);
      }
    }
    if (!(Wa >= Object.size(ab))) {
      var g = DM.getl10n("map"), u = 0, D, G;
      $("#grcrt_radar_result ul").html("");
      $.each(ab[Wa.toString()], function(M, K) {
        D = null == K.player_id ? DM.getl10n("common", "ghost_town") : '<img src="' + Game.img() + '/game/icons/player.png" />' + hCommon.player(btoa(JSON.stringify({name:K.player_name, id:K.player_id}).replace(/[\u007f-\uffff]/g, function(ba) {
          return "\\u" + ("0000" + ba.charCodeAt(0).toString(16)).slice(-4);
        })), K.player_name, K.player_id);
        D += void 0 == K.alliance_id ? "" : '<br/><img src="' + Game.img() + '/game/icons/ally.png" />' + hCommon.alliance("n", K.alliance_name, K.alliance_id);
        G = "";
        MM.getModels().Town[K.id] && (G += GameData.units[wa.getValue()].is_naval && MM.getModels().Town[K.id].getResearches().get("cartography") ? '<div class="grcrt_bonuses grcrt_cartography"></div>' : "", G += "colonize_ship" == wa.getValue() && MM.getModels().Town[K.id].getResearches().get("set_sail") ? '<div class="grcrt_bonuses grcrt_set_sail"></div>' : "", G += GameData.units[wa.getValue()].is_naval && 1 == MM.getModels().Town[K.id].getBuildings().get("lighthouse") ? '<div class="grcrt_bonuses grcrt_lighthouse"></div>' : 
        "", G += !GameData.units[wa.getValue()].is_naval && MM.getModels().Town[K.id].getResearches().get("meteorology") ? '<div class="grcrt_bonuses grcrt_meteorology"></div>' : "");
        $("#grcrt_radar_result ul").append($("<li/>", {"class":++u % 2 ? "even" : "odd"}).append($("<div/>", {"class":"grcrt_rr_town"}).append($("<a/>", {"class":"gp_town_link", href:K.href}).html(K.name)).append($("<br/>")).append($("<span/>", {"class":""}).html('<img src="' + Game.img() + '/game/icons/points.png" /> ' + g.points(K.points))).append(G).css("border-left", "5px solid #" + (K.fc || "f00")).css("background-color", n(K.fc || "f00", 10))).append($("<div/>", {"class":"grcrt_rr_cs_time"}).append($("<span/>", 
        {"class":"way_duration"}).html("~" + K.time))).append($("<div/>", {"class":"grcrt_rr_cs_time"}).append($("<span/>", {"class":"arrival_time", "data-sec":K.timeInSec}))).append($("<div/>", {"class":"player_name grcrt_rr_player"}).html(D)).append($("<div/>", {"class":"player_name grcrt_rr_player"}).html(a(K))).append($("<br/>", {style:"clear:both"})));
      });
      $.each(l().split(" "), function(M, K) {
        $("#grcrt_radar_result ul .grcrt_" + K + ":not(.grcrt_done)").tooltip(c(K)).addClass("grcrt_done");
      });
      $.each($(".grcrt_rr_cs_time .arrival_time:not(.grcrt_done)"), function(M, K) {
        $(K).text($(K).data("sec") + "").updateTime().addClass("grcrt_done");
      });
      X();
    }
  }
  function ia() {
    return null != ma ? '<img src="' + Game.img() + '/game/icons/player.png" />' + hCommon.player(btoa(JSON.stringify({name:ma.name, id:ma.id}).replace(/[\u007f-\uffff]/g, function(a) {
      return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
    })), ma.name, ma.id) : null != Fa ? '<img src="' + Game.img() + '/game/icons/ally.png" />' + hCommon.alliance("n", Fa.name, Fa.id) : null != ea ? '<div style="float:right"><img src="' + Game.img() + '/game/icons/town.png" style="float:left"/><a class="gp_town_link" href="' + btoa(JSON.stringify({id:ea.id, ix:ea.ix, iy:ea.iy, tp:"town", name:ea.name})) + '">' + ea.name + "</a></div>" : Va = $("<div/>", {"class":"radiobutton", id:"grcrt_rghost"}).radiobutton({value:"RGHOST", template:"tpl_radiobutton", 
    options:[{value:"RGHOST", name:DM.getl10n("common", "ghost_town")}, {value:"RALL", name:RepConvTool.GetLabel("RADAR.ALL")}]}).on("rb:change:value", function(a, g, u) {
      m();
    });
  }
  function la() {
    Oa = f("grcrt_rr_meteorology", null == ea && MM.getModels().Town[Game.townId].getResearches().get("meteorology"));
    Pa = f("grcrt_rr_cartography", null == ea && MM.getModels().Town[Game.townId].getResearches().get("cartography"));
    Ua = f("grcrt_rr_set_sail", null == ea && MM.getModels().Town[Game.townId].getResearches().get("set_sail"));
    $a = f("grcrt_rr_unit_movement_boost", !1);
    v = f("grcrt_rr_lighthouse", null == ea && 1 == MM.getModels().Town[Game.townId].getBuildings().get("lighthouse"));
    b = GameDataHeroes.areHeroesEnabled() ? $("<div/>", {"class":"modifier hero_modifier", style:"margin-right: 0px; margin-top: 1px;"}).heroPicker({options:A(), should_have_remove_and_change_btn:!1, should_have_level_btn:!0, confirmation_window:null}).on("hd:change:value", function(a, g, u) {
      e = "" != g ? GameData.heroes[g].description_args[1].value : 0;
      I();
    }).on("sp:change:value", function(a, g, u) {
      e = GameData.heroes[b.getValue()].description_args[1].value + GameData.heroes[b.getValue()].description_args[1].level_mod * g;
      I();
    }) : null;
    return $("<div/>").append($("<div/>", {style:"float: left; padding: 3px 5px; margin: 2px;"}).append($("<span/>").html(RepConvTool.GetLabel("RADAR.FIND") + ": ")).append(ia())).append($("<div/>", {style:"float:right; margin: 5px 10px 0 0"}).append(RepConvTool.AddBtn("RADAR.BTNSAVEDEFAULT").click(function() {
      try {
        db = bb.getValue(), eb = fb.getValue(), RepConvTool.setItem(RepConv.Cookie + "radar_cs", db), RepConvTool.setItem(RepConv.Cookie + "radar_points", eb), setTimeout(function() {
          HumanMessage.success(RepConvTool.GetLabel("MSGHUMAN.OK"));
        }, 0);
      } catch (a) {
        setTimeout(function() {
          HumanMessage.error(RepConvTool.GetLabel("MSGHUMAN.ERROR"));
        }, 0);
      }
    })).append(lb.click(function() {
      $.Observer(GameEvents.grcrt.radar.find_btn).publish();
    }))).append($("<br/>", {style:"clear:both"})).append($("<div/>", {id:"grcrt_rr_unit", "class":"unit_icon50x50 colonize_ship", style:"margin:2px 5px 0 5px; cursor: pointer;"})).append($("<div/>", {style:"float:left"}).append($("<div/>", {style:"padding: 3px 5px; margin: 2px;"}).html(RepConvTool.GetLabel("RADAR.MAXUNITTIME"))).append($("<div/>", {id:"grcrt_cs_time", "class":"spinner", style:"width: 70px; float: right; margin: 2px;"}))).append($("<div/>", {style:"float:left"}).append($("<div/>", 
    {style:"padding: 3px 5px; margin: 2px;"}).html(RepConvTool.GetLabel("RADAR.TOWNPOINTS"))).append($("<div/>", {id:"grcrt_town_points", "class":"spinner", style:"width: 65px; float: right; margin: 2px;"}))).append($("<div/>", {style:"float:left"}).append($("<div/>", {style:"padding: 3px 5px; margin: 2px;"}).html(RepConvTool.GetLabel("STATS.INACTIVE"))).append($("<div/>", {id:"grcrt_player_idle", "class":"spinner", style:"width: 40px; float: right; margin: 2px;"}))).append($("<div/>", {style:"float:left"}).append($("<div/>", 
    {style:"padding: 3px 5px; margin: 2px;"}).html(RepConvTool.GetLabel("RADAR.SHOWCITIES"))).append($("<div/>", {id:"grcrt_town_lists", "class":"dropdown default", style:"width: 150px; float: right; margin: 2px 2px 0px 2px;"}))).append($("<div/>", {"class":"runtime_info grcrt_modifiers", style:"float: left;"}).append($("<div/>", {"class":"modifiers_container", style:"max-width: 340px;margin-top: 0px;margin-left: 0px;"}).append($("<div/>", {"class":"other_modifiers"}).append(b).append($("<div/>", 
    {"class":"modifier", style:"margin-right: 5px;"}).append($("<div/>", {"class":"modifier_icon research_icon research40x40 meteorology"})).append(Oa)).append($("<div/>", {"class":"modifier", style:"margin-right: 5px;"}).append($("<div/>", {"class":"modifier_icon research_icon research40x40 cartography"})).append(Pa)).append($("<div/>", {"class":"modifier", style:"margin-right: 5px;" + (30 == GameData.buildings.academy.max_level ? "display:none;" : "")}).append($("<div/>", {"class":"modifier_icon research_icon research40x40 set_sail"})).append(Ua)).append($("<div/>", 
    {"class":"modifier", style:"margin-right: 5px;"}).append($("<div/>", {"class":"modifier_icon power power_icon45x45 unit_movement_boost"})).append($a)).append($("<div/>", {"class":"modifier", style:"margin-right: 5px;"}).append($("<div/>", {"class":"modifier_icon building_icon40x40 lighthouse"})).append(v))))).append($("<br/>", {style:"clear: both"})).append($("<div/>", {id:"grcrt_radar_result", style:"overflow: hidden; margin-top: 10px;"}));
  }
  function da() {
    require("game/windows/ids").GRCRT_RADAR = "grcrt_radar";
    (function() {
      var a = window.GameControllers.TabController, g = a.extend({initialize:function() {
        RepConv.Debug && console.log("initialize");
        a.prototype.initialize.apply(this, arguments);
        db = RepConvTool.getSettings(RepConv.Cookie + "radar_cs", "06:00:00");
        eb = parseInt(RepConvTool.getSettings(RepConv.Cookie + "radar_points", 0));
        this._radarMode();
        this.registerListeners();
        this.render();
        this._setCurrentTown();
        this.registerViewComponents();
      }, unregisterListeners:function() {
        RepConv.Debug && console.log("initialize");
        $.Observer(GameEvents.town.town_switch).unsubscribe("GRCRT_Radar_town_town_switch");
        $.Observer(GameEvents.grcrt.radar.find_btn).unsubscribe("GRCRT_Radar_grcrt_radar_find_btn");
        $.Observer(GameEvents.grcrt.radar.display_towns).unsubscribe("GRCRT_Radar_grcrt_radar_display_towns");
      }, registerListeners:function() {
        RepConv.Debug && console.log("registerListeners");
        $.Observer(GameEvents.town.town_switch).subscribe("GRCRT_Radar_town_town_switch", this._setCurrentTown.bind(this));
        $.Observer(GameEvents.grcrt.radar.find_btn).subscribe("GRCRT_Radar_grcrt_radar_find_btn", this._findTowns.bind(this));
        $.Observer(GameEvents.grcrt.radar.display_towns).subscribe("GRCRT_Radar_grcrt_radar_display_towns", this._displayTowns.bind(this));
      }, render:function() {
        RepConv.Debug && console.log("render");
        var u = [];
        $.each(GameData.units, function(D, G) {
          0 < G.speed && u.push({value:D});
        });
        this.$el.html(la());
        wa = $("#grcrt_rr_unit").dropdown({list_pos:"center", type:"image", value:"colonize_ship", template:"tpl_grcrt_units_list", options:u}).on("dd:change:value", function(D, G, M, K, ba) {
          $("#grcrt_rr_unit").toggleClass(M);
          $("#grcrt_rr_unit").toggleClass(G);
          I();
        });
        $.each(l().split(" "), function(D, G) {
          $(".grcrt_modifiers .modifier_icon." + G).tooltip(c(G));
        });
        bb = $("#grcrt_cs_time").spinner({value:db, step:"00:30:00", max:"24:00:00", min:"00:00:00", type:"time"});
        fb = $("#grcrt_town_points").spinner({value:eb, step:500, max:18000, min:0});
        jb = $("#grcrt_player_idle").spinner({value:0, step:1, max:999, min:0});
        va = $("#grcrt_town_lists").dropdown({value:"all", options:E(), });
        m();
        return this;
      }, reRender:function() {
      }, registerViewComponents:function() {
        RepConv.Debug && console.log("registerViewComponents");
      }, unregisterViewComponents:function() {
        RepConv.Debug && console.log("unregisterViewComponents");
        this.unregisterComponent("grcrt_radar_scrollbar");
      }, destroy:function() {
        RepConv.Debug && console.log("destroy");
        this.unregisterViewComponents();
        this.unregisterListeners();
      }, _setCurrentTown:function() {
        var u = this.getWindowModel();
        this.getWindowModel().showLoading();
        setTimeout(function() {
          O();
          u.hideLoading();
        }, 10);
      }, _findTowns:function() {
        var u = this.getWindowModel();
        this.getWindowModel().showLoading();
        setTimeout(function() {
          $("#grcrt_radar_result").html("");
          N();
          T();
          R();
          u.hideLoading();
        }, 50);
      }, registerComponent:function(u, D, G) {
        G = {main:this.getWindowModel().getType(), sub:G || this.getWindowModel().getIdentifier()};
        return CM.register(G, u, D);
      }, unregisterComponent:function(u, D) {
        D = {main:this.getWindowModel().getType(), sub:D || this.getWindowModel().getIdentifier()};
        CM.unregister(D, u);
      }, _displayTowns:function() {
        this.getWindowModel().showLoading();
        this.unregisterComponent("grcrt_radar_scrollbar");
        aa();
        this.registerComponent("grcrt_radar_scrollbar", this.$el.find(".js-scrollbar-viewport").skinableScrollbar({orientation:"vertical", template:"tpl_skinable_scrollbar", skin:"narrow", disabled:!1, elements_to_scroll:this.$el.find(".js-scrollbar-content"), element_viewport:this.$el.find(".js-scrollbar-viewport"), scroll_position:0, min_slider_size:16}));
        this.getWindowModel().hideLoading();
      }, _radarMode:function() {
        try {
          var u = this.getWindowModel().getArguments();
          if (void 0 == u) {
            C();
          } else {
            if (void 0 != u.player) {
              ma = {id:u.player.id, name:u.player.name}, ea = Fa = null;
            } else {
              if (void 0 != u.alliance) {
                var D = u.alliance.id, G = u.alliance.name;
                ma = null;
                Fa = {id:D, name:G};
                ea = null;
              } else {
                if (void 0 != u.town) {
                  var M = u.town.id, K = u.town.name, ba = u.town.ix, oa = u.town.iy;
                  Fa = ma = null;
                  ea = {id:M, name:K, ix:ba, iy:oa};
                }
              }
            }
          }
        } catch (Ia) {
          C();
        }
      }});
      window.GameViews.GrcRTView_grcrt_radar = g;
    })();
    (function() {
      var a = window.GameViews, g = window.WindowFactorySettings, u = require("game/windows/ids"), D = require("game/windows/tabs"), G = u.GRCRT_RADAR;
      g[G] = function(M) {
        M = M || {};
        return us.extend({window_type:G, minheight:550, maxheight:570, width:975, tabs:[{type:D.INDEX, title:"none", content_view_constructor:a.GrcRTView_grcrt_radar, hidden:!0}], max_instances:1, activepagenr:0, minimizable:!0, resizable:!1, title:RepConv.grcrt_window_icon + RepConvTool.GetLabel("RADAR.TOWNFINDER")}, M);
      };
    })();
  }
  GameEvents.grcrt = GameEvents.grcrt || {};
  GameEvents.grcrt.radar = {find_btn:"grcrt:radar:find_btn", display_towns:"grcrt:radar:display_towns"};
  WMap.getChunkSize();
  var W, qa, za, Ma, Ka, Na, Ea, ma = null, Fa = null, ea = null, db, eb, Va, Ya = {}, hb = null, Ra = (require("map/helpers") || WMap).getTownType, Za = {}, ib, lb = RepConvTool.AddBtn("RADAR.BTNFIND"), Ta, ab, Wa, bb, fb, jb, wa, va, Oa, Pa, Ua, $a, v, b, e = 0, k = null, p;
  this.getThtmlPage = function() {
    return Wa;
  };
  this.getThtml = function() {
    return ab;
  };
  this.setPlayer = function(a, g) {
    ma = {id:a, name:g};
    ea = Fa = null;
  };
  this.setAlly = function(a, g) {
    ma = null;
    Fa = {id:a, name:g};
    ea = null;
  };
  this.setGhost = function() {
    C();
  };
  this.setCurrentTown = function() {
    O();
  };
  this.getFirstTown = function() {
    N();
    T();
    return qa[za[0]] || null;
  };
  this.getTownList = function() {
    return qa;
  };
  this.windowOpen = function(a) {
    try {
      WM.getWindowByType("grcrt_radar")[0].close();
    } catch (g) {
    }
    WF.open("grcrt_radar", {args:a});
  };
  RepConv.menu[1] = {name:"RADAR.TOWNFINDER", action:"GRCRT_Radar.windowOpen();", "class":"radar"};
  $("head").append($("<style/>").append(".grcrt.radar { background-position: -77px -80px; cursor: pointer;}"));
  $("head").append($("<style/>").append(".grcrt_rr_town, .grcrt_rr_player {float: left; width: 240px; max-width: 240px;}").append(".grcrt_rr_points {float: left; width: 40px; text-align: right;}").append(".grcrt_rr_cs_time {float: left; width: 105px; text-align: right; margin-right: 5px;}").append(".grcrt_rr_town img, .grcrt_rr_player img {float: left;}").append("#grcrt_rr_unit {position: relative; display: block; float: left; text-align: right; border: 1px solid #724B08;}").append(".option.unit_icon40x40 { float: left; position: relative; border: 1px solid #724B08; margin: 1px;}").append(".option.unit_icon40x40.selected {border: 2px solid red; margin: 0px;}").append(".grcrt_bonuses {background: url(https://www.grcrt.net/static/uX7%7C.S9%7C.I7%7C.S7%7C_20_0.png) 0px 0px;width: 20px; height: 20px; float: right; margin: 0 2px 2px 0;border: 1px solid #8c7878;cursor: pointer;}").append(".grcrt_meteorology {background-position: 0 0;}").append(".grcrt_lighthouse {background-position: -20px 0;}").append(".grcrt_cartography {background-position: -40px 0;}").append(".grcrt_set_sail {background-position: -60px 0;}").append("#grcrt_town_lists_list .option.disabled {color: gray !important;}").append(".grcrt_pagination {padding: 5px;height: 20px;}"));
  $("#tpl_grcrt_units_list").remove();
  $("<script/>", {type:"text/template", id:"tpl_grcrt_units_list"}).text('<div class="dropdown-list sandy-box js-dropdown-list" style="max-width: 240px !important;"><div class="corner_tl"></div><div class="corner_tr"></div><div class="corner_bl"></div><div class="corner_br"></div><div class="border_t"></div><div class="border_b"></div><div class="border_l"></div><div class="border_r"></div><div class="middle"></div><div class="content js-dropdown-item-list"><% var i, l = options.length, option;for (i = 0; i < l; i++) {option = options[i]; %><div class="option unit_icon40x40 <%= option.value %>" name="<%= option.value %>"></div><% } %></div></div>').appendTo($("head"));
  RepConv.initArray.push("GRCRT_Radar.init()");
  RepConv.wndArray.push("grcrt_radar");
  this.init = function() {
    new da;
  };
}
function _GRCRT_Recipes() {
  function f() {
    0 == $("#happening_large_icon.easter").length ? $("#grcrt_recipes").hide() : $("#grcrt_recipes").show();
    setTimeout(function() {
      f();
    }, 6E5);
  }
  function A() {
    require("game/windows/ids").GRCRT_RECIPES = "grcrt_recipes";
    (function() {
      var c = window.GameControllers.TabController.extend({render:function() {
        this.getWindowModel().showLoading();
        this.$el.html($("<div/>").append($("<iframe/>", {src:this.whatLoading(), style:"width: 965px; height: 530px; border: 0px; float: left;", }).bind("load", function() {
          WM.getWindowByType("grcrt_recipes")[0].hideLoading();
        })));
      }, whatLoading:function() {
        var h = this.getWindowModel().getArguments(), l = RepConv.getUrlForWebsite(this.getWindowModel().getActivePage().getType());
        try {
          l = h.url;
        } catch (m) {
        }
        return l;
      }});
      window.GameViews.GrcRTViewEx_grcrt_recipes = c;
    })();
    (function() {
      var c = window.GameControllers.TabController.extend({render:function() {
        this.$el.html(RepConvGRC.settings());
        this.getWindowModel().hideLoading();
      }});
      window.GameViews.GrcRTViewS_grcrt_recipes = c;
    })();
    (function() {
      var c = window.GameControllers.TabController.extend({render:function() {
        this.$el.html(RepConvTranslations.table());
        this.getWindowModel().hideLoading();
      }});
      window.GameViews.GrcRTViewT_grcrt_recipes = c;
    })();
    (function() {
      var c = window.GameViews, h = window.WindowFactorySettings, l = require("game/windows/ids");
      require("game/windows/tabs");
      var m = l.GRCRT_RECIPES;
      h[m] = function(C) {
        C = C || {};
        return us.extend({window_type:m, minheight:575, maxheight:585, width:980, tabs:[{type:"recipes", title:void 0, content_view_constructor:c.GrcRTViewEx_grcrt_recipes, hidden:!1}], max_instances:1, activepagenr:0, minimizable:!0, resizable:!1, title:RepConv.grcrt_window_icon + RepConv.Scripts_nameS + "  ver." + RepConv.Scripts_version}, C);
      };
    })();
  }
  $("head").append($("<style/>").append(".easter_recipes #BTNSENDeaster { position: absolute !important; top: 0px !important; margin-top: 0px !important}"));
  this.windowOpen = function() {
    try {
      WM.getWindowByType("grcrt_recipes")[0].close();
    } catch (c) {
    }
    WF.open("grcrt_recipes", {args:{title:void 0, url:"https://www.grcrt.net/" + Game.locale_lang + "/light/module/recipes" + ("zz" == Game.market_id ? "/beta" : "")}});
  };
  this.init = function() {
    new A;
    setTimeout(function() {
      f();
    }, 3E4);
  };
}
function _GRCRT_TSL() {
  function f() {
    require("game/windows/ids").GRCRT_TSL = "grcrt_tsl";
    (function() {
      var c = window.GameControllers.TabController, h = c.extend({listGroup:null, initialize:function(l) {
        c.prototype.initialize.apply(this, arguments);
        var m = this.getWindowModel(), C = $("<div/>").append($("<div/>", {style:"padding:5px"}).append($("<div/>", {id:"grcrtTslGroup", "class":"dropdown default"})).append($("<a/>", {id:"grcrtTslReload", href:"#n", "class":"grc_reload down_big reload", style:"float: right; height: 22px; margin: -1px 0 1px;"}))).append($("<div/>", {id:"grcrtTslTownsList"}));
        this.$el.html(C);
        m.hideLoading();
        m.getJQElement || (m.getJQElement = function() {
          return C;
        });
        m.appendContent || (m.appendContent = function(J) {
          return C.append(J);
        });
        m.setContent2 || (m.setContent2 = function(J) {
          return C.html(J);
        });
        this.initializeComponents();
        this.renderList();
      }, registerComponent:function(l, m, C) {
        return CM.register({main:this.cm_context.main, sub:C || this.cm_context.sub}, l, m);
      }, unregisterComponents:function(l) {
        l = {main:this.getMainContext(), sub:l || this.getSubContext()};
        CM.unregisterSubGroup(l);
      }, destroy:function() {
        this.unregisterComponents();
      }, close:function() {
        this.unregisterComponents();
      }, initializeComponents:function() {
        var l = this.$el, m = this;
        this.listGroup = this.registerComponent("grcrtTslGroup", l.find("#grcrtTslGroup").dropdown({value:MM.getCollections().TownGroup[0].getActiveGroupId(), options:MM.getCollections().TownGroup[0].getTownGroupsForDropdown(), disabled:!MM.getModels().PremiumFeatures[Game.player_id].isActivated("curator")}).on("dd:change:value", function(C, J, I) {
          m.townList();
        }));
        this.registerComponent("grcrtTslReload", l.find("#grcrtTslReload").button({}).on("btn:click", function() {
          m.renderList();
        }));
      }, render:function() {
      }, renderList:function() {
        var l = this.$el.find($("#grcrtTslTownsList"));
        l.html("");
        l.append($("<div/>", {id:"TSLhead"}).append($("<span/>", {"class":"TSLwrapper"}).append($("<span/>", {"class":"TSLicon"})).append($("<span/>", {"class":"TSLcityName", style:14 < Game.townName.length ? "font-size: 8px;" : "", townid:Game.townId}).append($("<a/>", {"class":"gp_town_link", style:"color: white", href:"#" + MM.getModels().Town[Game.townId].getLinkFragment()}).html(Game.townName))).append($("<span/>", {"class":"TSLicon"}))).append($("<div/>", {id:"TSLTownList"})));
        this.townList();
      }, townList:function() {
        var l = this.$el.find($("#grcrtTslTownsList")), m = {}, C = [], J = this, I = $("<div/>", {style:"height: 334px;overflow-y: hidden; overflow-x: hidden; position: relative;", "class":"js-scrollbar-viewport"}), E = $("<div/>", {"class":"js-scrollbar-content", style:"width: 100%;"});
        (function() {
          var O = GameData.units.attack_ship.speed, n = 900 / Game.game_speed, t = MM.getModels().Town[Game.townId], q;
          $.each(MM.getCollections().TownGroupTown[0].getTowns(parseInt(J.listGroup.getValue())), function(B, Q) {
            q = MM.getModels().Town[Q.getTownId()];
            t.getId() != q.getId() && (B = $.toe.calc.getDistance({x:t.get("abs_x"), y:t.get("abs_y")}, {x:q.get("abs_x"), y:q.get("abs_y")}), void 0 == m[B] && (m[B] = {time:0, towns:[]}, C.push(B)), m[B].towns.push({id:q.getId(), name:q.getName()}), m[B].timeInSec = Math.round(50 * B / O) + n, m[B].time = readableUnixTimestamp(m[B].timeInSec, "no_offset", {with_seconds:!0}));
          });
          do {
            var x = !1;
            for (var z = 0; z < C.length - 1; z++) {
              C[z] > C[z + 1] && (x = C[z], C[z] = C[z + 1], C[z + 1] = x, x = !0);
            }
          } while (x);
        })();
        this.$el.find($("#grcrtTslTownsList .js-scrollbar-viewport")).remove();
        l.append(I.append(E));
        $.each(C, function(O, n) {
          $.each(m[n].towns, function(t, q) {
            E.append($("<div/>", {"class":"TSLitem", townid:q.id}).text(q.name));
          });
        });
        I.skinableScrollbar({orientation:"vertical", template:"tpl_skinable_scrollbar", skin:"narrow", disabled:!1, elements_to_scroll:J.$el.find(".js-scrollbar-content"), element_viewport:J.$el.find(".js-scrollbar-viewport"), scroll_position:0, min_slider_size:16});
        $("#grcrtTslTownsList .js-scrollbar-content > div[townid]").click(function() {
          HelperTown.townSwitch($(this).attr("townid"));
          J.onClick(this);
        });
      }, onClick:function(l) {
        $(l).attr("townid");
        var m = GRCRTtslWnd.getJQElement().find($(".tsl_set"));
        $(m).toggleClass("tsl_set");
        $(l).addClass("tsl_set");
      }});
      window.GameViews.GrcRTView_grcrt_tsl = h;
    })();
    (function() {
      var c = window.GameViews, h = window.WindowFactorySettings, l = require("game/windows/ids"), m = require("game/windows/tabs"), C = l.GRCRT_TSL;
      h[C] = function(J) {
        J = J || {};
        return us.extend({window_type:C, minheight:440, maxheight:440, width:250, tabs:[{type:m.INDEX, title:"none", content_view_constructor:c.GrcRTView_grcrt_tsl, hidden:!0}], max_instances:1, activepagenr:0, minimizable:!0, resizable:!1, title:RepConv.grcrt_window_icon + window.ellipsis(RepConvTool.GetLabel("TSL.WND.WINDOWTITLE"), 18), special_buttons:{help:{action:{type:"external_link", url:RepConv.Scripts_url + "module/grchowto#tsl"}}}}, J);
      };
    })();
  }
  var A = RepConv.grcrt_cdn + "ui/tsl_sprite.png";
  this.createWindow = function() {
    try {
      WM.getWindowByType("grcrt_tsl")[0].close();
    } catch (c) {
    }
    window.GRCRTtslWnd = WF.open("grcrt_tsl");
  };
  RepConv.menu[3] = {name:"TSL.WND.WINDOWTITLE", action:"GRCRT_TSL.createWindow();", "class":"tsl"};
  $("head").append($("<style/>").append(".grcrt.tsl { background-position: -113px -80px; cursor: pointer;}"));
  $("head").append($("<style/>").append("#grcrtTslGroup {width: 190px;}").append("#townsSortedList {height: 100%;overflow-y: auto;font-size: 11px;font-family: Verdana;font-weight: 700;}").append("#TSLhead {height: 30px;width: 100%;position: relative;background: url(" + A + ") 0 0 repeat-x;}").append("#townsSortedListDetail {height: 365px;overflow-x: hidden;overflow-y: scroll;margin-left: 5px;}").append(".TSLwrapper {height: 16px;width: 160px;position: absolute;top: 0;right: 0;bottom: 0;left: 0;margin: auto;}").append(".TSLicon {width: 18px;height: 16px;background: url(" + 
  A + ") -44px -31px no-repeat;display: inline-block;}").append("#grcrtTslTownsList .js-scrollbar-content {padding-left: 5px;}").append(".TSLcityName {display: inline-block;vertical-align: top;color: #FFF;width: 124px;text-align: center;}").append(".TSLitem {cursor: pointer;color: #423515;line-height: 22px;position: relative;}").append(".TSLitem:hover {background-color: rgba(0, 0, 0, 0.1);}").append('.TSLitem:hover::before {content: "";display: inline-block;border: 4px solid transparent;border-left: 7px solid #423515;padding-right: 2px;}').append('.TSLitem:hover::after {content: "";display: inline-block;background: url(' + 
  A + ") -44px -68px no-repeat;width: 15px;height: 19px;padding-right: 10px;position: absolute;right: 20px;}").append('.tsl_set {content: "";display: inline-block;border: 4px solid transparent;border-left: 7px solid #423515;padding-right: 10px;background-color: rgba(0, 0, 0, 0.1);width: 213px;padding-left: 5px;}'));
  RepConv.initArray.push("GRCRT_TSL.init()");
  RepConv.wndArray.push("grcrt_tsl");
  this.init = function() {
    new f;
  };
}
function _GRCRT_Translations() {
  function f() {
    RepConvTool.setItem(RepConv.CookieTranslate, JSON.stringify(GRCRT_Translations.RepConvLangArrayNew));
    RepConvLangArray[Game.locale_lang.substring(0, 2)] = GRCRT_Translations.RepConvLangArrayNew;
    RepConv.Lang = GRCRT_Translations.RepConvLangArrayNew;
  }
  this.RepConvLangArrayNew = {};
  RepConv.CookieTranslate = RepConv.Cookie + "_translate";
  this.table = function() {
    var A = $("<div/>", {id:"grcrttranslate", style:"padding: 5px"}), c = RepConv.Scripts_update_path + "translation.php", h = $("<iframe/>", {id:"transSender", name:"transSender", style:"display:none"});
    $(A).append($("<h4/>", {style:"float:left;"}).html(RepConvTool.GetLabel("LANGS.LANG") + " " + Game.locale_lang.substring(0, 2))).append($("<form/>", {action:c, method:"post", target:"transSender", id:"transForm", style:"display:none"}).append($("<input/>", {name:"player"}).attr("value", Game.player_name)).append($("<input/>", {name:"lang"}).attr("value", Game.locale_lang.substring(0, 2))).append($("<textarea/>", {name:"translations", id:"trans2send"}).text(RepConvTool.getItem(RepConv.CookieTranslate)))).append($(h)).append(RepConvTool.AddBtn("LANGS.SEND").click(function() {
      try {
        GRCRT_Translations.sendTranslate(), HumanMessage.success(RepConvTool.GetLabel("MSGHUMAN.OK"));
      } catch (l) {
        HumanMessage.error(RepConvTool.GetLabel("MSGHUMAN.ERROR"));
      }
    })).append(RepConvTool.AddBtn("LANGS.SAVE").click(function() {
      try {
        f(), HumanMessage.success(RepConvTool.GetLabel("MSGHUMAN.OK"));
      } catch (l) {
        HumanMessage.error(RepConvTool.GetLabel("MSGHUMAN.ERROR"));
      }
    })).append(RepConvTool.AddBtn("LANGS.RESET").click(function() {
      Layout.showConfirmDialog("GRCRTools", '<div><img src="' + RepConv.grcrt_domain + 'img/octopus.png" style="float:left;padding-right: 10px"/><p style="padding:5px">' + RepConvTool.GetLabel("LANGS.REMOVE") + "</p></div>", function() {
        RepConvLangArray = new _GRCRTRepConvLangArray;
        void 0 == RepConvLangArray[Game.locale_lang.substring(0, 2)] ? RepConv.LangEnv = "en" : RepConv.LangEnv = Game.locale_lang.substring(0, 2);
        void 0 == RepConvLangArray[RepConv.LangEnv] && (RepConv.LangEnv = "en", RepConv.LangLoaded = !0);
        RepConv.Lang = RepConvLangArray[RepConv.LangEnv];
        RepConvTool.setItem(RepConv.CookieTranslate, "");
        GRCRT_Translations.changeLang(Game.locale_lang.substring(0, 2));
      }, RepConvTool.GetLabel("MSGRTYES"), null, RepConvTool.GetLabel("MSGRTNO"));
    })).append($("<br/>", {style:"clear:both"})).append($("<div/>", {style:"height: 32px;"}).html(RepConvTool.GetLabel4Lang("AUTHOR", Game.locale_lang.substring(0, 2)))).append(this.changeLang(Game.locale_lang.substring(0, 2)));
    return A;
  };
  this.sendTranslate = function() {
    f();
    $("#trans2send").text(RepConvTool.getItem(RepConv.CookieTranslate));
    $("#transForm").submit();
  };
  this.changeLang = function(A) {
    function c(m) {
      $(l).append($("<div/>", {"class":"grcrtLangRow"}).append($("<textarea/>", {"class":"grcrtLangEN", id:"en_" + m.replace(/\./g, "_"), readonly:"readonly"}).html(RepConvTool.GetLabel4Lang(m, "en"))).append($("<textarea/>", {"class":"grcrtLangTranslate", rel:m}).text(RepConvTool.GetLabel4Lang(m, A)).css("background-color", RepConvTool.GetLabel4Lang(m, "en") == RepConvTool.GetLabel4Lang(m, A) && "en" != A ? "lightcoral" : "white").change(function() {
        function C(J, I, E) {
          console.log(E);
          var O = I.split(".");
          I = I.split(".");
          1 == I.length ? J[I[0]] = E : (J[I[0]] = J[I[0]] || {}, O.remove(0), J[I[0]] = C(J[I[0]], O.join("."), E));
          return J;
        }
        console.log("aqq");
        GRCRT_Translations.RepConvLangArrayNew = C(GRCRT_Translations.RepConvLangArrayNew, $(this).attr("rel"), $(this).val());
      })).append($("<br/>", {style:"clear:both"})));
    }
    function h(m, C) {
      C += 0 == C.length ? "" : ".";
      $.each(m, function(J, I) {
        "object" == typeof I ? h(I, C + J) : 0 < I.length && "AUTHOR" != C + J && c(C + J);
      });
    }
    var l = $("<div/>", {id:"grcrttrrows"});
    RepConvLangArray[A] = RepConvLangArray[A] || RepConvLangArray.en;
    this.RepConvLangArrayNew = $.extend({}, RepConvLangArray[A]);
    h(RepConvLangArray.en, "");
    $("#grcrttrrows").remove();
    $("#grcrttranslate").append(l);
    return l;
  };
  $("head").append($("<style/>").append("#grcrttrrows {height: 360px;overflow: auto;}").append(".grcrtLangRow {border-top: solid 1px grey;}").append(".grcrtLangEN {float: left;width: 370px;margin-top: 2px;background-color: transparent;border: 0px;}").append(".grcrtLangTranslate {width: 400px;resize: vertical;height: 100%;margin-left: 5px;}"));
  null != RepConvTool.getItem(RepConv.CookieTranslate) && (RepConvLangArray[Game.locale_lang.substring(0, 2)] = JSON.parse(RepConvTool.getItem(RepConv.CookieTranslate)), RepConv.Lang = RepConvLangArray[Game.locale_lang.substring(0, 2)]);
}
function _GRCRT_Updater() {
  this.checkTime = 9E5;
  this.reload = this.checked = !1;
  this.checkUpdate = function() {
    this.checked ? this.reload && GRCRT_Notifications.addNotification(NotificationType.GRCRTRELOAD) : $.ajax({type:"GET", url:RepConv.Scripts_check_path + "checkVersion.php", dataType:"script", async:!0, complete:function() {
      (RepConv.asv || RepConv.Scripts_version) != RepConv.Scripts_version && ("undefined" == typeof GRCRTools && "undefined" == typeof GRCRTLoader ? GRCRT_Notifications.addNotification(NotificationType.GRCRTNEWVERSION) : (GRCRT_Updater.reload = !0, GRCRT_Notifications.addNotification(NotificationType.GRCRTRELOAD)));
    }});
  };
  void 0 == RepConv.updateInterval && (RepConv.updateInterval = setInterval(function() {
    GRCRT_Updater.checkUpdate();
  }, this.checkTime));
}
function _GRCRTmd5() {
  function f(n, t) {
    var q = (n & 65535) + (t & 65535);
    return (n >> 16) + (t >> 16) + (q >> 16) << 16 | q & 65535;
  }
  function A(n, t, q, x, z, B) {
    n = f(f(t, n), f(x, B));
    return f(n << z | n >>> 32 - z, q);
  }
  function c(n, t, q, x, z, B, Q) {
    return A(t & q | ~t & x, n, t, z, B, Q);
  }
  function h(n, t, q, x, z, B, Q) {
    return A(t & x | q & ~x, n, t, z, B, Q);
  }
  function l(n, t, q, x, z, B, Q) {
    return A(q ^ (t | ~x), n, t, z, B, Q);
  }
  function m(n, t) {
    n[t >> 5] |= 128 << t % 32;
    n[(t + 64 >>> 9 << 4) + 14] = t;
    var q = 1732584193, x = -271733879, z = -1732584194, B = 271733878;
    for (t = 0; t < n.length; t += 16) {
      var Q = q;
      var N = x;
      var U = z;
      var fa = B;
      q = c(q, x, z, B, n[t], 7, -680876936);
      B = c(B, q, x, z, n[t + 1], 12, -389564586);
      z = c(z, B, q, x, n[t + 2], 17, 606105819);
      x = c(x, z, B, q, n[t + 3], 22, -1044525330);
      q = c(q, x, z, B, n[t + 4], 7, -176418897);
      B = c(B, q, x, z, n[t + 5], 12, 1200080426);
      z = c(z, B, q, x, n[t + 6], 17, -1473231341);
      x = c(x, z, B, q, n[t + 7], 22, -45705983);
      q = c(q, x, z, B, n[t + 8], 7, 1770035416);
      B = c(B, q, x, z, n[t + 9], 12, -1958414417);
      z = c(z, B, q, x, n[t + 10], 17, -42063);
      x = c(x, z, B, q, n[t + 11], 22, -1990404162);
      q = c(q, x, z, B, n[t + 12], 7, 1804603682);
      B = c(B, q, x, z, n[t + 13], 12, -40341101);
      z = c(z, B, q, x, n[t + 14], 17, -1502002290);
      x = c(x, z, B, q, n[t + 15], 22, 1236535329);
      q = h(q, x, z, B, n[t + 1], 5, -165796510);
      B = h(B, q, x, z, n[t + 6], 9, -1069501632);
      z = h(z, B, q, x, n[t + 11], 14, 643717713);
      x = h(x, z, B, q, n[t], 20, -373897302);
      q = h(q, x, z, B, n[t + 5], 5, -701558691);
      B = h(B, q, x, z, n[t + 10], 9, 38016083);
      z = h(z, B, q, x, n[t + 15], 14, -660478335);
      x = h(x, z, B, q, n[t + 4], 20, -405537848);
      q = h(q, x, z, B, n[t + 9], 5, 568446438);
      B = h(B, q, x, z, n[t + 14], 9, -1019803690);
      z = h(z, B, q, x, n[t + 3], 14, -187363961);
      x = h(x, z, B, q, n[t + 8], 20, 1163531501);
      q = h(q, x, z, B, n[t + 13], 5, -1444681467);
      B = h(B, q, x, z, n[t + 2], 9, -51403784);
      z = h(z, B, q, x, n[t + 7], 14, 1735328473);
      x = h(x, z, B, q, n[t + 12], 20, -1926607734);
      q = A(x ^ z ^ B, q, x, n[t + 5], 4, -378558);
      B = A(q ^ x ^ z, B, q, n[t + 8], 11, -2022574463);
      z = A(B ^ q ^ x, z, B, n[t + 11], 16, 1839030562);
      x = A(z ^ B ^ q, x, z, n[t + 14], 23, -35309556);
      q = A(x ^ z ^ B, q, x, n[t + 1], 4, -1530992060);
      B = A(q ^ x ^ z, B, q, n[t + 4], 11, 1272893353);
      z = A(B ^ q ^ x, z, B, n[t + 7], 16, -155497632);
      x = A(z ^ B ^ q, x, z, n[t + 10], 23, -1094730640);
      q = A(x ^ z ^ B, q, x, n[t + 13], 4, 681279174);
      B = A(q ^ x ^ z, B, q, n[t], 11, -358537222);
      z = A(B ^ q ^ x, z, B, n[t + 3], 16, -722521979);
      x = A(z ^ B ^ q, x, z, n[t + 6], 23, 76029189);
      q = A(x ^ z ^ B, q, x, n[t + 9], 4, -640364487);
      B = A(q ^ x ^ z, B, q, n[t + 12], 11, -421815835);
      z = A(B ^ q ^ x, z, B, n[t + 15], 16, 530742520);
      x = A(z ^ B ^ q, x, z, n[t + 2], 23, -995338651);
      q = l(q, x, z, B, n[t], 6, -198630844);
      B = l(B, q, x, z, n[t + 7], 10, 1126891415);
      z = l(z, B, q, x, n[t + 14], 15, -1416354905);
      x = l(x, z, B, q, n[t + 5], 21, -57434055);
      q = l(q, x, z, B, n[t + 12], 6, 1700485571);
      B = l(B, q, x, z, n[t + 3], 10, -1894986606);
      z = l(z, B, q, x, n[t + 10], 15, -1051523);
      x = l(x, z, B, q, n[t + 1], 21, -2054922799);
      q = l(q, x, z, B, n[t + 8], 6, 1873313359);
      B = l(B, q, x, z, n[t + 15], 10, -30611744);
      z = l(z, B, q, x, n[t + 6], 15, -1560198380);
      x = l(x, z, B, q, n[t + 13], 21, 1309151649);
      q = l(q, x, z, B, n[t + 4], 6, -145523070);
      B = l(B, q, x, z, n[t + 11], 10, -1120210379);
      z = l(z, B, q, x, n[t + 2], 15, 718787259);
      x = l(x, z, B, q, n[t + 9], 21, -343485551);
      q = f(q, Q);
      x = f(x, N);
      z = f(z, U);
      B = f(B, fa);
    }
    return [q, x, z, B];
  }
  function C(n) {
    var t, q = "";
    for (t = 0; t < 32 * n.length; t += 8) {
      q += String.fromCharCode(n[t >> 5] >>> t % 32 & 255);
    }
    return q;
  }
  function J(n) {
    var t, q = [];
    q[(n.length >> 2) - 1] = void 0;
    for (t = 0; t < q.length; t += 1) {
      q[t] = 0;
    }
    for (t = 0; t < 8 * n.length; t += 8) {
      q[t >> 5] |= (n.charCodeAt(t / 8) & 255) << t % 32;
    }
    return q;
  }
  function I(n) {
    return C(m(J(n), 8 * n.length));
  }
  function E(n, t) {
    var q = J(n), x = [], z = [];
    x[15] = z[15] = void 0;
    16 < q.length && (q = m(q, 8 * n.length));
    for (n = 0; 16 > n; n += 1) {
      x[n] = q[n] ^ 909522486, z[n] = q[n] ^ 1549556828;
    }
    t = m(x.concat(J(t)), 512 + 8 * t.length);
    return C(m(z.concat(t), 640));
  }
  function O(n) {
    var t = "", q;
    for (q = 0; q < n.length; q += 1) {
      var x = n.charCodeAt(q);
      t += "0123456789abcdef".charAt(x >>> 4 & 15) + "0123456789abcdef".charAt(x & 15);
    }
    return t;
  }
  $.md5 = function(n, t, q) {
    t ? q ? n = E(unescape(encodeURIComponent(t)), unescape(encodeURIComponent(n))) : (n = E(unescape(encodeURIComponent(t)), unescape(encodeURIComponent(n))), n = O(n)) : n = q ? I(unescape(encodeURIComponent(n))) : O(I(unescape(encodeURIComponent(n))));
    return n;
  };
}
function _GRCRTtpl() {
  function f(c, h) {
    RepConv._tmpl = {str:c, data:h};
    var l = /((^|%>)[^\t]*)'/g;
    c = /\W/.test(c) ? new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('" + c.replace(/[\r\t\n]/g, " ").split("<%").join("\t").replace(l, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'") + "');}return p.join('');") : cache[c] = cache[c] || f(c);
    return h ? c(h) : c;
  }
  function A() {
    require("game/windows/ids").GRCRT_CONVERT = "grcrt_convert";
    (function() {
      var c = window.GameControllers.TabController.extend({render:function() {
        var h = this.getWindowModel(), l = $("<div/>").css({margin:"10px"});
        this.$el.html(l);
        h.hideLoading();
        h.getJQElement || (h.getJQElement = function() {
          return l;
        });
        h.appendContent || (h.appendContent = function(m) {
          return l.append(m);
        });
      }});
      window.GameViews.GrcRTView_grcrt_convert = c;
    })();
    (function() {
      var c = window.GameViews, h = window.WindowFactorySettings, l = require("game/windows/ids"), m = require("game/windows/tabs"), C = l.GRCRT_CONVERT;
      h[C] = function(J) {
        J = J || {};
        return us.extend({window_type:C, minheight:575, maxheight:595, width:870, tabs:[{type:m.INDEX, title:"none", content_view_constructor:c.GrcRTView_grcrt_convert, hidden:!0}], max_instances:1, activepagenr:0, minimizable:!1, resizable:!1, title:RepConv.grcrt_window_icon + RepConv.Scripts_name}, J);
      };
    })();
  }
  this.rct = {};
  this.rcts = {A:{outside:!1, town:"town", ghost_town:"town", player:"player", ally:"ally", island:"island", temple:"temple", tag:"quote", fonttag:"monospace", blank:"..........", separator:".", separator3:"...", unitDigits:7, sign:"u", textTown:"", textPlayer:"", textAlly:"", unitSize:"8", getTown:"id", getIsland:"id", morale:RepConvTool.Adds(RepConv.Const.staticImg + RepConv.Const.morale, "img") + " ", luck:RepConvTool.Adds(RepConv.Const.staticImg + RepConv.Const.luck, "img") + " ", nightbonus:RepConvTool.Adds(RepConv.Const.staticImg + 
  RepConv.Const.nightbonus, "img") + " ", oldwall:RepConvTool.Adds(RepConv.Const.staticImg + RepConv.Const.oldwall, "img") + " ", genImg:RepConv.grcrt_domain + "static/{0}{1}_37_5.png", genImgS:42, genImgM:5, nullImg:RepConv.grcrt_domain + "static/{0}_{1}_{2}.png", doubleline:"[color=#0000ff]======================================================================================================[/color]", singleline:"[color=#0000ff]------------------------------------------------------------------------------------------------------[/color]", 
  tplTableBegin:"[table]", tplTableEnd:"[/table]", tplRowBegin:"", tplRowEnd:"", tplColBegin:"[*]", tplColEnd:"[/*]", tplColSpan2:"[*]", tplColSpan3:"[*]", tplColSpan4:"[*]", tplColSep:"[|]", tplGenImg:RepConv.grcrt_domain + "static/{0}{1}_45_4.png", tplTableNBBegin:"", tplTableNBEnd:"", tplFontBegin:"[font=monospace]", tplFontEnd:"[/font]", tplSize9:"[size=9]", tplSizeEnd:"[/size]", unitWall:15, unitWall2:7, tplBlank:"\u00a0", charLimit:8000, tagLimit:500, spoiler:"spoiler"}, E:{outside:!0, town:"b", 
  ghost_town:"b", player:"b", ally:"b", island:"b", temple:"b", tag:"code", fonttag:"Courier New", blank:"          ", separator:" ", separator3:"   ", unitDigits:7, sign:"f", textTown:RepConvTool.GetLabel("TOWN"), textPlayer:RepConvTool.GetLabel("PLAYER"), textAlly:RepConvTool.GetLabel("ALLY"), unitSize:"8", getTown:"name", getIsland:"name", morale:"", luck:"", nightbonus:"", oldwall:"", genImg:RepConv.grcrt_domain + "static/{0}{1}_45_4.png", genImgS:45, genImgM:4, nullImg:RepConv.grcrt_domain + 
  "static/{0}_{1}_{2}.png", doubleline:"[color=#0000ff]=========================================================[/color]", singleline:"[color=#0000ff]---------------------------------------------------------[/color]", tplTableBegin:'[table="width: 710, class: outer_border"]', tplTableEnd:"[/table]", tplRowBegin:"[tr]", tplRowEnd:"[/tr]", tplColBegin:"[td]", tplColEnd:"[/td]", tplColSpan2:'[td="colspan: 2"]', tplColSpan3:'[td="colspan: 3"]', tplColSpan4:'[td="colspan: 4"]', tplColSep:"[/td][td]", 
  tplGenImg:RepConv.grcrt_domain + "static/{0}{1}_45_4.png", tplTableNBBegin:'[tr][td="colspan: 3"]', tplTableNBEnd:"[/td][/tr]", tplFontBegin:"[font=Courier New]", tplFontEnd:"[/font]", tplSize9:"", tplSizeEnd:"", unitWall:15, unitWall2:7, tplBlank:"\u00a0", charLimit:99999, tagLimit:99999, spoiler:"spr"}, I:{outside:!1, town:"town", ghost_town:"town", player:"player", ally:"ally", island:"island", temple:"temple", tag:"quote", fonttag:"monospace", blank:"..........", separator:".", separator3:"...", 
  unitDigits:7, sign:"u", textTown:"", textPlayer:"", textAlly:"", unitSize:"8", getTown:"name", getIsland:"name", morale:RepConvTool.Adds(RepConv.Const.staticImg + RepConv.Const.morale, "img") + " ", luck:RepConvTool.Adds(RepConv.Const.staticImg + RepConv.Const.luck, "img") + " ", nightbonus:RepConvTool.Adds(RepConv.Const.staticImg + RepConv.Const.nightbonus, "img") + " ", oldwall:RepConvTool.Adds(RepConv.Const.staticImg + RepConv.Const.oldwall, "img") + " ", genImg:RepConv.grcrt_domain + "static/{0}{1}_37_5.png", 
  genImgS:42, genImgM:5, nullImg:RepConv.grcrt_domain + "static/{0}_{1}_{2}.png", doubleline:"[color=#0000ff]======================================================================================================[/color]", singleline:"[color=#0000ff]------------------------------------------------------------------------------------------------------[/color]", tplTableBegin:"[table]", tplTableEnd:"[/table]", tplRowBegin:"", tplRowEnd:"", tplColBegin:"[*]", tplColEnd:"[/*]", tplColSpan2:"[*]", tplColSpan3:"[*]", 
  tplColSpan4:"[*]", tplColSep:"[|]", tplGenImg:RepConv.grcrt_domain + "static/{0}{1}_45_4.png", tplTableNBBegin:"", tplTableNBEnd:"", tplFontBegin:"[font=monospace]", tplFontEnd:"[/font]", tplSize9:"[size=9]", tplSizeEnd:"[/size]", unitWall:15, unitWall2:7, tplBlank:"\u00a0", charLimit:8000, tagLimit:500, spoiler:"spoiler"}, };
  this.reportText = function(c, h) {
    var l = !0;
    var m = "[b]<%=GRCRTtpl.AddSize(time+title,9)%> (##/##)[/b]\\n<%=GRCRTtpl.rct.doubleline%>\\n";
    switch(c) {
      case "command":
        m += "<%=attacker.town%> <%=attacker.player%>\\n<%=detail.time_title%> <%=detail.time_time%>\\n<%=attacker.units_title%>\\n<%  if (attacker.full.img_url != '') {%><%=attacker.full.img_url%> <%=detail.power_img%>\\n<%  }else{%><%=RepConvTool.GetLabel('NOTUNIT')%>\\n<%  }%><%=GRCRTtpl.rct.singleline%>\\n<%=defender.town%> <%=defender.player%>\\n<%  if(resources.title!=null){%><%=GRCRTtpl.rct.singleline%>\\n<%=GRCRTtpl.AddSize(resources.title,9)%>\\n<%=resources.img_url%>\\n<%  }%>";
        break;
      case "conquer":
      case "illusion":
        m += "[b]<%=GRCRTtpl.AddSize(RepConvTool.GetLabel('ATTACKER'),10)%>[/b]: <%=attacker.town%> <%=attacker.player%> <%=attacker.ally%> <%=GRCRTtpl.AddSize(morale+' '+luck,8)%>\\n<%=GRCRTtpl.rct.singleline%>\\n[b]<%=GRCRTtpl.AddSize(RepConvTool.GetLabel('DEFENDER'),10)%>[/b]: <%=defender.town%> <%=defender.player%> <%=defender.ally%> <%if(Object.size(oldwall)>0){%><%=GRCRTtpl.AddSize(oldwall[0]+' '+nightbonus,8)%><%}%>\\n<%=GRCRTtpl.rct.singleline%>\\n<%=detail%>\\n";
        break;
      case "raise":
      case "breach":
      case "attack":
      case "take_over":
        m += "[b]<%=GRCRTtpl.AddSize(RepConvTool.GetLabel('ATTACKER'),10)%>[/b]: <%=attacker.town%> <%=attacker.player%> <%=attacker.ally%> <%=GRCRTtpl.AddSize(morale+' '+luck,8)%>\\n<%=attacker.full.img_url%><%=powerAtt%>\\n<%=GRCRTtpl.rct.singleline%>\\n[b]<%=GRCRTtpl.AddSize(RepConvTool.GetLabel('DEFENDER'),10)%>[/b]: <%=defender.town%> <%=defender.player%> <%=defender.ally%> <%if(Object.size(oldwall)>0){%><%=GRCRTtpl.AddSize(oldwall[0]+' '+nightbonus,8)%><%}%>\\n<%=defender.full.img_url%><%=powerDef%>\\n<%=GRCRTtpl.rct.singleline%>\\n<%=GRCRTtpl.AddSize(resources.title,9)%>\\n<%=resources.img_url%>\\n" + 
        ("" != h.bunt ? '<%if ( bunt.length > 0){%><%=GRCRTtpl.rct.singleline%>\\n<%=RepConvTool.Adds(RepConv.Const.bunt,"img")%> <%=bunt%>\\n<%}%>' : "") + "<%=GRCRTtpl.rct.singleline%>\\n" + (h.showCost ? '<%=GRCRTtpl.rct.separator3%><%=RepConvTool.Adds(RepConv.Const.unitImg+GRCRTtpl.rct.sign+"Z1Z2Z3Z4Z5.png","img")%><%=GRCRTtpl.rct.separator3%>[b]<%=GRCRTtpl.AddSize(RepConvTool.GetLabel(\'LOSSES\'),9)%>[/b]\\n<%if ( attacker.w != undefined ){%><%=GRCRTtpl.AddSize(GRCRTtpl.Value(attacker.w,10)+GRCRTtpl.Value(attacker.s,10)+GRCRTtpl.Value(attacker.i,10)+GRCRTtpl.Value(attacker.p,10)+GRCRTtpl.Value(attacker.f,10)+" [b]"+RepConvTool.GetLabel(\'ATTACKER\')+"[/b]",8)%>\\n<%}%><%=GRCRTtpl.AddSize(GRCRTtpl.Value(defender.w,10)+GRCRTtpl.Value(defender.s,10)+GRCRTtpl.Value(defender.i,10)+GRCRTtpl.Value(defender.p,10)+GRCRTtpl.Value(defender.f,10)+" [b]"+RepConvTool.GetLabel(\'DEFENDER\')+"[/b]",8)%>\\n' : 
        "");
        break;
      case "conqueroldtroops":
        m = "[b]<%=GRCRTtpl.AddSize(command.title,9)%>[/b] (##/##)\\n" + (0 < Object.size(h.linia) ? "=#=#=<%for(ind in linia){%><%=GRCRTtpl.rct.singleline%>\\n<%=linia[ind].img%> <%=linia[ind].inout%> (<%=linia[ind].time%>) <%=linia[ind].text%>\\n=#=#=<%}%>" : "");
        break;
      case "commandList":
        m += "=#=#=<%for(ind in linia){%><%  if (ind > 0){%><%=GRCRTtpl.rct.singleline%>\\n<%  }%><%  if (linia[ind].title.length>0) {%><%=linia[ind].title%>\\n<%  } else {%><%=linia[ind].img%> <%=linia[ind].time%> <%=linia[ind].townIdA.full%> <%=linia[ind].inout%> <%=linia[ind].townIdB.full%>\\n<%=linia[ind].img_url%>  <%=linia[ind].power%>\\n<%  }%>=#=#=<%}%>";
        break;
      case "conquerold":
        m = "[b]<%=GRCRTtpl.AddSize(title+time,9)%>[/b]\\n<%=GRCRTtpl.rct.doubleline%>\\n<%=defender.town%> <%=defender.player%>\\n<%=GRCRTtpl.rct.singleline%>\\n<%=attacker.units_title%>\\n<%=attacker.full.img_url%>\\n";
        break;
      case "support":
        m += "[b]<%=GRCRTtpl.AddSize(RepConvTool.GetLabel('ATTACKER'),10)%>[/b]: <%=attacker.town%> <%=attacker.player%> <%=attacker.ally%> <%=GRCRTtpl.AddSize(morale+' '+luck,8)%>\\n[b]<%=GRCRTtpl.AddSize(RepConvTool.GetLabel('DEFENDER'),10)%>[/b]: <%=defender.town%> <%=defender.player%> <%=defender.ally%> <%if(Object.size(oldwall)>0){%><%=GRCRTtpl.AddSize(oldwall[0]+' '+nightbonus,8)%><%}%>\\n<%=GRCRTtpl.rct.singleline%>\\n<%=attacker.full.img_url%>\\n";
        break;
      case "attackSupport":
        m += "[b]<%=GRCRTtpl.AddSize(RepConvTool.GetLabel('ATTACKER'),10)%>[/b]: <%=attacker.town%> <%=attacker.player%> <%=attacker.ally%> <%=GRCRTtpl.AddSize(morale+' '+luck,8)%>\\n<%=GRCRTtpl.rct.singleline%>\\n[b]<%=GRCRTtpl.AddSize(RepConvTool.GetLabel('DEFENDER'),10)%>[/b]: <%=defender.town%> <%=defender.player%> <%=defender.ally%> <%if(Object.size(oldwall)>0){%><%=GRCRTtpl.AddSize(oldwall[0]+' '+nightbonus,8)%><%}%>\\n<%=defender.full.img_url%><%=powerDef%>\\n<%=GRCRTtpl.rct.singleline%>\\n" + 
        (h.showCost ? '<%=GRCRTtpl.rct.separator3%><%=RepConvTool.Adds(RepConv.Const.unitImg+GRCRTtpl.rct.sign+"Z1Z2Z3Z4Z5.png","img")%><%=GRCRTtpl.rct.separator3%>[b]<%=GRCRTtpl.AddSize(RepConvTool.GetLabel(\'LOSSES\'),9)%>[/b]\\n<%if ( attacker.w != undefined ){%><%=GRCRTtpl.AddSize(GRCRTtpl.Value(attacker.w,10)+GRCRTtpl.Value(attacker.s,10)+GRCRTtpl.Value(attacker.i,10)+GRCRTtpl.Value(attacker.p,10)+GRCRTtpl.Value(attacker.f,10)+" [b]"+RepConvTool.GetLabel(\'ATTACKER\')+"[/b]",8)%>\\n<%}%><%=GRCRTtpl.AddSize(GRCRTtpl.Value(defender.w,10)+GRCRTtpl.Value(defender.s,10)+GRCRTtpl.Value(defender.i,10)+GRCRTtpl.Value(defender.p,10)+GRCRTtpl.Value(defender.f,10)+" [b]"+RepConvTool.GetLabel(\'DEFENDER\')+"[/b]",8)%>\\n' : 
        "");
        break;
      case "agoraD":
      case "agoraS":
        m += "=#=#=<%for(ind in linia){%><%  if (ind > 0){%><%=GRCRTtpl.rct.singleline%>\\n<%  }%><%=linia[ind].title%>\\n<%=linia[ind].img_url%>\\n=#=#=<%}%>";
        break;
      case "espionage":
        m += '[b]<%=GRCRTtpl.AddSize(RepConvTool.GetLabel(\'ATTACKER\'),10)%>[/b]: <%=attacker.town%> <%=attacker.player%> <%=attacker.ally%> <%=GRCRTtpl.AddSize(morale+\' \'+luck,8)%>\\n<%=GRCRTtpl.rct.singleline%>\\n[b]<%=GRCRTtpl.AddSize(RepConvTool.GetLabel(\'DEFENDER\'),10)%>[/b]: <%=defender.town%> <%=defender.player%> <%=defender.ally%> <%if(Object.size(oldwall)>0){%><%=GRCRTtpl.AddSize(oldwall[0]+\' \'+nightbonus,8)%><%}%>\\n<%if (defender.title != null){%><%=defender.title%>\\n<%=defender.full.img_url%>\\n<%}%><%if (build.title != null){%><%=build.title%>\\n<%=build.full.img_url%>\\n<%}%><%=iron.title%>\\n<%if(iron.count!=""){%><%=RepConvTool.Adds(RepConv.Const.unitImg+"iron.png","img")%> <%=GRCRTtpl.AddSize(iron.count,8)%>\\n<%}%><%if (resources.title != ""){%><%=GRCRTtpl.AddSize(resources.title,8)%>\\n<%=resources.img_url%>\\n<%}%><%if (god.title != ""){%><%=GRCRTtpl.AddSize(god.title,8)%>\\n<%=god.img_url%>\\n<%}%>';
        break;
      case "powers":
        m += "[b]<%=GRCRTtpl.AddSize(RepConvTool.GetLabel('ATTACKER'),10)%>[/b]: <%=attacker.town%> <%=attacker.player%> <%=attacker.ally%> <%=GRCRTtpl.AddSize(morale+' '+luck,8)%>\\n<%=GRCRTtpl.rct.singleline%>\\n[b]<%=GRCRTtpl.AddSize(RepConvTool.GetLabel('DEFENDER'),10)%>[/b]: <%=defender.town%> <%=defender.player%> <%=defender.ally%> <%if(Object.size(oldwall)>0){%><%=GRCRTtpl.AddSize(oldwall[0]+' '+nightbonus,8)%><%}%>\\n<%=power%>\\n<%=efekt.title%>\\n<%if (efekt.detail != null){%><%=efekt.detail.wrapLine(25)%>\\n<%}%><%if (type == 1){%><%}else if (type == 2){%><%=resources.full.img_url%>\\n<%}else if (type == 3){%><%=resources.img_url%>\\n<%}else if (type == 4){%><%}else if (type == 5){%><%=resources.img_url%>\\n<%}%>";
        break;
      case "wall":
        m = '<%=title%>\\n<%=GRCRTtpl.rct.doubleline%>\\n<%if (defeated.title != ""){%><%=GRCRTtpl.AddSize(defeated.title,10)%>\\n<%  if(defeated.titleAttacker != ""){%><%=GRCRTtpl.AddSize(defeated.titleAttacker,8)%>\\n<%    for(ind in defeated.attacker){%><%=defeated.attacker[ind].img_url%>\\n<%    }%><%  }%><%  if(defeated.titleDefender != ""){%><%=GRCRTtpl.AddSize(defeated.titleDefender,8)%>\\n<%    for(ind in defeated.defender){%><%=defeated.defender[ind].img_url%>\\n<%    }%><%  }%><%}%><%if (losses.title != ""){%><%  if (defeated.title != ""){%><%=GRCRTtpl.rct.doubleline%>\\n<%  }%><%=GRCRTtpl.AddSize(losses.title,10)%>\\n<%  if(losses.titleAttacker != ""){%><%=GRCRTtpl.AddSize(losses.titleAttacker,8)%>\\n<%    for(ind in losses.attacker){%><%=losses.attacker[ind].img_url%>\\n<%    }%><%  }%><%  if(losses.titleDefender != ""){%><%=GRCRTtpl.AddSize(losses.titleDefender,8)%>\\n<%    for(ind in losses.defender){%><%=losses.defender[ind].img_url%>\\n<%    }%><%  }%><%}%>';
        break;
      case "found":
        m += "[b]<%=GRCRTtpl.AddSize(RepConvTool.GetLabel('ATTACKER'),10)%>[/b]: <%=attacker.town%> <%=attacker.player%> <%=attacker.ally%> <%=GRCRTtpl.AddSize(morale+' '+luck,8)%>\\n[b]<%=GRCRTtpl.AddSize(RepConvTool.GetLabel('DEFENDER'),10)%>[/b]: <%=defender.town%> <%=defender.player%> <%=defender.ally%> <%if(Object.size(oldwall)>0){%><%=GRCRTtpl.AddSize(oldwall[0]+' '+nightbonus,8)%><%}%>\\n<%=GRCRTtpl.rct.singleline%>\\n<%=detail%>\\n";
        break;
      case "conquest":
        m = "[b]<%=GRCRTtpl.AddSize(title,9)%>[/b]\\n<%=defender.town%> (<%=time%>)\\n<%=GRCRTtpl.rct.singleline%>\\n[b]<%=GRCRTtpl.AddSize(RepConvTool.GetLabel('ATTACKER'),10)%>[/b]: <%=attacker.town%> <%=attacker.player%> <%=attacker.ally%> <%=GRCRTtpl.AddSize(morale+' '+luck,8)%>\\n<%=GRCRTtpl.rct.singleline%>\\n<%=attacker.units_title%>\\n<%for(ind in attacker.splits){%><%=  attacker.splits[ind].img_url%>\\n<%}%><%=GRCRTtpl.rct.singleline%>\\n[b]<%=GRCRTtpl.AddSize(command.title,9)%>[/b] (##/##)\\n" + 
        (0 < Object.size(h.linia) ? "=#=#=<%for(ind in linia){%><%=GRCRTtpl.rct.singleline%>\\n<%=linia[ind].img%> <%=linia[ind].inout%> (<%=linia[ind].time%>) <%=linia[ind].text%>\\n=#=#=<%}%>" : "");
        break;
      case "academy":
        m += '<%for(ind in linia){%><%=RepConvTool.Adds((GRCRTtpl.rct.tplGenImg).RCFormat(GRCRTtpl.rct.sign, linia[ind].unit_list), "img")%>\\n\\n<%}%>[b]<%=GRCRTtpl.AddSize(points,9)%>[/b]\\n';
        break;
      case "ownTropsInTheCity":
        m += "<%=defender.full.img_url%>\\n";
        break;
      case "bbcode_island":
      case "bbcode_player":
      case "bbcode_alliance":
        m = "<%=GRCRTtpl.AddSize(header,9)%> (##/##)\\n=#=#=<%for(ind in linia){%><%=ind%> <%=linia[ind].col1%>. <%=linia[ind].col2%> <%=linia[ind].col3%> <%=linia[ind].col4%>\\n=#=#=<%}%>";
        l = !1;
        break;
      case "olympus_temple_info":
        m = '[b]<%=GRCRTtpl.AddSize(title,9)%>[/b]\\n<%=temple.god.img_url%> <%=temple.god.name%>\\n[i]<%=temple.buff%>[/i]\\n<%=GRCRTtpl.rct.singleline%>\\n<%=temple.name%> \\n<%  if (temple.owner!="") {%><%=temple.owner%> \\n<%}%>[img]https://cdn.grcrt.net/ui/attack.png[/img] <%=movements_count.attack%>     [img]https://cdn.grcrt.net/ui/support.png[/img] <%=movements_count.support%>\\n<%=GRCRTtpl.rct.singleline%>\\n<%=defender.full.img_url %>\\n<% if ( addInfo != "" ) { %><%=addInfo %>\\n<% } %>[b]<%=GRCRTtpl.AddSize(command.title,9)%>[/b] (##/##)\\n' + 
        (0 < Object.size(h.linia) ? "=#=#=<%for(ind in linia){%><%=GRCRTtpl.rct.singleline%>\\n<%=linia[ind].img%> <%=linia[ind].inout%> (<%=linia[ind].time%>) <%=linia[ind].text%>\\n=#=#=<%}%>" : "");
    }
    m = RepConvTool.Adds(RepConvTool.AddFont(m + (l ? "<%=GRCRTtpl.rct.doubleline%>\\n<%=RepConv.Const.footer%>" : ""), GRCRTtpl.rct.fonttag), GRCRTtpl.rct.tag);
    m = (h.showRT && "" != h.rtrevolt ? "[quote][table]\\n[*][|]<%=defender.town%>[/*]\\n[*]<%=RepConvTool.Adds(RepConv.Const.bunt2,\"img\")%>[||]<%=GRCRTtpl.AddSize(rtrevolt,11)%>[/*]\\n[/table]\\n[table]\\n[*]<%=GRCRTtpl.AddSize(rtlabels.wall,10)%>[||] <%=GRCRTtpl.AddSize(rtwall.toString(),11)%> [|]<%=GRCRTtpl.AddSize(rtlabels.ram,10)%>[||] <%=GRCRTtpl.AddSize(rtram,11)%> [/*]\\n[*]<%=GRCRTtpl.AddSize(rtlabels.tower,10)%>[||] <%=GRCRTtpl.AddSize(rttower,11)%> [|]<%=GRCRTtpl.AddSize(rtlabels.phalanx,10)%>[||] <%=GRCRTtpl.AddSize(rtphalanx,11)%> [/*]\\n[*]<%=GRCRTtpl.AddSize(rtlabels.god,10)%>[||] <%=GRCRTtpl.AddSize(rtgod||'',11)%> [|]<%=GRCRTtpl.AddSize(rtlabels.captain,10)%>[||] <%=GRCRTtpl.AddSize(rtpremium.captain,11)%> [/*]\\n[*]<%=GRCRTtpl.AddSize(rtlabels.cstime,10)%>[||] <%=GRCRTtpl.AddSize(rtcstime,11)%> [|]<%=GRCRTtpl.AddSize(rtlabels.commander,10)%>[||] <%=GRCRTtpl.AddSize(rtpremium.commander,11)%> [/*]\\n[*]<%=GRCRTtpl.AddSize(rtlabels.online,10)%>[||] <%=GRCRTtpl.AddSize(rtonline,11)%> [|]<%=GRCRTtpl.AddSize(rtlabels.priest,10)%>[||] <%=GRCRTtpl.AddSize(rtpremium.priest,11)%> [/*]\\n[/table][/quote]\\n\\n" : 
    "") + m;
    return f(m, h);
  };
  this.reportHtml = function(c, h) {
    var l = "[b]<%=GRCRTtpl.AddSize(time+title,9)%> (##/##)[/b]\\n";
    switch(c) {
      case "command":
        l += GRCRTtpl.rct.tplTableBegin + "<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.addLine(245)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(190)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(245)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%><%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(((attacker.town != undefined) ? attacker.town+'\\n' : '')+((attacker.player != undefined) ? attacker.player+'\\n' : '')+((attacker.ally != undefined) ? attacker.ally+'\\n' : ''),10), GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.AddFont('[img]'+RepConv.grcrt_cdn+'ui/ragB.png[/img][img]'+RepConv.grcrt_cdn+'ui/5/'+reportImage+'.png[/img][img]'+RepConv.grcrt_cdn+'ui/ragE.png[/img]', GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(((defender.town != undefined) ? defender.town+'\\n' : '')+((defender.player != undefined) ? defender.player+'\\n' : '')+((defender.ally != undefined) ? defender.ally+'\\n' : ''),10), GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>" + 
        (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplTableNBBegin : GRCRTtpl.rct.tplTableEnd) + "[center]<%=RepConv.Const.footer%>[/center]" + (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplTableNBEnd : GRCRTtpl.rct.tplTableBegin) + "<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColSpan3%><%=GRCRTtpl.rct.tplFontBegin+GRCRTtpl.rct.tplSize9%><%=detail.time_title%> <%=detail.time_time%>\\n<%=attacker.units_title%>\\n<%  if (attacker.full.img_url != '') {%><%=attacker.full.img_url%> <%=detail.power_img%>\\n<%  }else{%><%=RepConvTool.GetLabel('NOTUNIT')%>\\n<%  }%><%  if(resources.title!=null){%><%=GRCRTtpl.rct.tplFontBegin%>[b]<%=GRCRTtpl.AddSize(resources.title.wrapLine(25),10)%>[/b]<%    if ((resources.img_url||'').length > 0){%>\\n<%=resources.img_url %><%    }%><%=GRCRTtpl.rct.tplFontEnd%><%  }%><%=RepConvTool.addLine(698)%><%=GRCRTtpl.rct.tplSizeEnd+GRCRTtpl.rct.tplFontEnd%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd %>" + 
        GRCRTtpl.rct.tplTableEnd;
        break;
      case "take_over":
        l = (h.showRT && "" != h.rtrevolt ? "<%=GRCRTtpl.rct.tplTableBegin + GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.Adds(RepConv.Const.bunt2,\"img\")%><%=GRCRTtpl.rct.tplColSep%><%  if(GRCRTtpl.rct.outside){%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(defender.town,11)+'\\n'+GRCRTtpl.AddSize(rtrevolt,10)+'\\n', GRCRTtpl.rct.fonttag)%><%  }else{%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(defender.town,11)+'\\n'+GRCRTtpl.AddSize(rtrevolt,10)+'\\n'+RepConvTool.addLine(200), GRCRTtpl.rct.fonttag)%><%  }%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.Adds(RepConv.Const.unitImg+GRCRTtpl.rct.sign+\"G2_32_5.png\",\"img\")%><%=GRCRTtpl.rct.tplColSep%><%  if(GRCRTtpl.rct.outside){%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(rtlabels.cstime,10)+'\\n'+GRCRTtpl.AddSize(rtcstime,11)+'\\n', GRCRTtpl.rct.fonttag)%><%  }else{%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(rtlabels.cstime,10)+'\\n'+GRCRTtpl.AddSize(rtcstime,11)+'\\n'+RepConvTool.addLine(120), GRCRTtpl.rct.fonttag)%><%  }%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.Adds(RepConv.Const.uiImg + 'c/attack.png',\"img\")%><%=GRCRTtpl.rct.tplColSep%><%  if(GRCRTtpl.rct.outside){%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(GRCRTtpl.Unit(unit_movements.attack,4).replace(/\\./g,GRCRTtpl.rct.tplBlank),10)+'\\n', GRCRTtpl.rct.fonttag)%><%  }else{%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(GRCRTtpl.Unit(unit_movements.attack,4).replace(/\\./g,GRCRTtpl.rct.tplBlank),10)+'\\n'+RepConvTool.addLine(40), GRCRTtpl.rct.fonttag)%><%  }%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.Adds(RepConv.Const.uiImg + 'c/support.png',\"img\")%><%=GRCRTtpl.rct.tplColSep%><%  if(GRCRTtpl.rct.outside){%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(GRCRTtpl.Unit(unit_movements.support,4).replace(/\\./g,GRCRTtpl.rct.tplBlank),10)+'\\n', GRCRTtpl.rct.fonttag)%><%  }else{%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(GRCRTtpl.Unit(unit_movements.support,4).replace(/\\./g,GRCRTtpl.rct.tplBlank),10)+'\\n'+RepConvTool.addLine(40), GRCRTtpl.rct.fonttag)%><%  }%><%=GRCRTtpl.rct.tplColSep%><%  if(GRCRTtpl.rct.outside){%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(rtlabels.online,10)+'\\n[b]'+GRCRTtpl.AddSize(rtonline,11)+'[/b]'+'\\n', GRCRTtpl.rct.fonttag)%><%  }else{%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(rtlabels.online,10)+'\\n[b]'+GRCRTtpl.AddSize(rtonline,11)+'[/b]'+'\\n'+RepConvTool.addLine(98), GRCRTtpl.rct.fonttag)%><%  }%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd + GRCRTtpl.rct.tplTableEnd%><%=GRCRTtpl.rct.tplTableBegin + GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.AddFont(RepConvTool.Adds(RepConv.Const.unitImg+GRCRTtpl.rct.sign+rtimg+\"_45_7.png\",\"img\")+\" \"+RepConvTool.Adds(RepConv.Const.uiImg+\"5/\"+rtgodid+\".png\",\"img\")+GRCRTtpl.AddSize((rtgod||'').replace(/\\./g,GRCRTtpl.rct.tplBlank),15)+'\\n'+RepConvTool.addLine(698), GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd + GRCRTtpl.rct.tplTableEnd%>" : 
        "") + l;
      case "raise":
      case "breach":
      case "attack":
        l += GRCRTtpl.rct.tplTableBegin + "<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.addLine(245)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(190)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(245)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%><%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(((attacker.town != undefined) ? attacker.town+'\\n' : '')+((attacker.player != undefined) ? attacker.player+'\\n' : '')+((attacker.ally != undefined) ? attacker.ally+'\\n' : ''),10), GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.AddFont('[img]'+RepConv.grcrt_cdn+'ui/ragB.png[/img][img]'+RepConv.grcrt_cdn+'ui/5/'+reportImage+'.png[/img][img]'+RepConv.grcrt_cdn+'ui/ragE.png[/img]', GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(((defender.town != undefined) ? defender.town+'\\n' : '')+((defender.player != undefined) ? defender.player+'\\n' : '')+((defender.ally != undefined) ? defender.ally+'\\n' : ''),10), GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>" + 
        (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplTableNBBegin : GRCRTtpl.rct.tplTableEnd) + "[center]<%=RepConv.Const.footer%>[/center]" + (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplTableNBEnd : GRCRTtpl.rct.tplTableBegin) + GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin + "<%if(powerAtt.length>0){%><%=powerAtt%>\\n<%}%><%=GRCRTtpl.rct.tplFontBegin+GRCRTtpl.rct.tplSize9%>\\n<%=morale%>\\n<%=luck%>\\n<%=GRCRTtpl.rct.tplSizeEnd+GRCRTtpl.rct.tplFontEnd%><%=GRCRTtpl.rct.tplFontBegin+GRCRTtpl.rct.tplSize9%><%for(idx in attacker.splits){%><%=attacker.splits[idx].img_url %>\\n<%}%><%=GRCRTtpl.rct.tplSizeEnd+GRCRTtpl.rct.tplFontEnd%>" + 
        GRCRTtpl.rct.tplColSep + "[center]<%=GRCRTtpl.rct.tplFontBegin%>[b]<%=GRCRTtpl.AddSize(resources.title.wrapLine(25),10)%>[/b]\\n<%=resources.img_url %><%=GRCRTtpl.rct.tplFontEnd%>[/center]\\n" + ("" != h.bunt ? "[center]<%=GRCRTtpl.rct.tplFontBegin%>\\n[b]<%=GRCRTtpl.AddSize(bunt.wrapLine(25),10)%>[/b]\\n<%=GRCRTtpl.rct.tplFontEnd%>[/center]" : "") + (h.showCost ? "[center]<%=GRCRTtpl.rct.tplFontBegin%>\\n<%=GRCRTtpl.Value(attacker.w.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%>\u00a0[img]<%= RepConv.grcrt_cdn %>ui/wood.png[/img]\u00a0<%=GRCRTtpl.Value(defender.w.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%>\\n<%=GRCRTtpl.Value(attacker.s.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%>\u00a0[img]<%= RepConv.grcrt_cdn %>ui/stone.png[/img]\u00a0<%=GRCRTtpl.Value(defender.s.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%>\\n<%=GRCRTtpl.Value(attacker.i.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%>\u00a0[img]<%= RepConv.grcrt_cdn %>ui/iron.png[/img]\u00a0<%=GRCRTtpl.Value(defender.i.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%>\\n<%=GRCRTtpl.Value(attacker.f.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%>\u00a0[img]<%= RepConv.grcrt_cdn %>ui/power.png[/img]\u00a0<%=GRCRTtpl.Value(defender.f.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%>\\n<%=GRCRTtpl.Value(attacker.p.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%>\u00a0[img]<%= RepConv.grcrt_cdn %>ui/pop.png[/img]\u00a0<%=GRCRTtpl.Value(defender.p.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%><%=GRCRTtpl.rct.tplFontEnd%>[/center]\\n" : 
        "") + GRCRTtpl.rct.tplColSep + "<%if(powerDef.length>0){%><%=powerDef%>\\n<%}%><%=GRCRTtpl.rct.tplFontBegin+GRCRTtpl.rct.tplSize9%>\\n<%for(idx in oldwall){%><%=oldwall[idx]%> \\n<%}%><%=nightbonus%> \\n<%=GRCRTtpl.rct.tplSizeEnd+GRCRTtpl.rct.tplFontEnd%><%=GRCRTtpl.rct.tplFontBegin+GRCRTtpl.rct.tplSize9%><%for(idx in defender.splits){%><%=defender.splits[idx].img_url %>\\n<%}%><%=GRCRTtpl.rct.tplSizeEnd+GRCRTtpl.rct.tplFontEnd%>" + GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd + "<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.addLine(245)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(190)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(245)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>" + 
        GRCRTtpl.rct.tplTableEnd;
        break;
      case "conqueroldtroops":
        l = GRCRTtpl.rct.tplTableBegin + "<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.addLine(32)%><%=GRCRTtpl.rct.tplColSep%><%=GRCRTtpl.rct.tplFontBegin %>[b]<%=GRCRTtpl.AddSize(command.title,10)%>[/b] (##/##)\\n<%=RepConvTool.addLine(304)%><%=GRCRTtpl.rct.tplFontEnd %><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(32)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(304)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>" + (0 < Object.size(h.linia) ? "=#=#=<%for(xx = 0; xx < Object.size(linia); xx+=2){%><%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=linia[xx].img%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.AddFont(GRCRTtpl.AddSize('('+linia[xx].time+')\\n'+linia[xx].text,8), GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColSep%><%  if(Object.size(linia[xx+1])>0){%><%=linia[xx+1].img%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.AddFont(GRCRTtpl.AddSize('('+linia[xx+1].time+')\\n'+linia[xx+1].text,8), GRCRTtpl.rct.fonttag)%><%  } else {%><%=GRCRTtpl.rct.tplColSep%><%  }%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>=#=#=<%}%>" : 
        "") + GRCRTtpl.rct.tplTableEnd + "[center]<%=RepConv.Const.footer%>[/center]";
        break;
      case "commandList":
        l += GRCRTtpl.rct.tplTableBegin + "=#=#=<%for(ind in linia){%><%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%  if (linia[ind].title.length>0) {%><%=GRCRTtpl.rct.tplColSep%>[b]<%=GRCRTtpl.AddSize(linia[ind].title,10)%>[/b]<%=GRCRTtpl.rct.tplColSep%><%=GRCRTtpl.rct.tplColSep%><%  } else {%><%=linia[ind].img%><%=GRCRTtpl.rct.tplColSep%><%=GRCRTtpl.rct.tplFontBegin%><%=linia[ind].townIdA.full%> <%=linia[ind].inout%> <%=linia[ind].townIdB.full%>\\n<%=linia[ind].time%><%=GRCRTtpl.rct.tplFontEnd%><%=GRCRTtpl.rct.tplColSep%><%=linia[ind].power%><%=GRCRTtpl.rct.tplColSep%><%=linia[ind].img_url%>\\n<%  }%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>=#=#=<%}%><%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.addLine(35)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(380)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(25)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(265)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>" + 
        GRCRTtpl.rct.tplTableEnd + "[center]<%=RepConv.Const.footer%>[/center]";
        break;
      case "conquerold":
        l = GRCRTtpl.rct.tplTableBegin + "<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColSpan4%><%=GRCRTtpl.rct.tplFontBegin + GRCRTtpl.rct.tplSize9 %>[b]<%=title%>[/b]\\n<%=defender.town%> <%=time%>\\n<%=attacker.units_title%>\\n<%=attacker.full.img_url%>\\n<%=RepConvTool.addLine(698)%><%=GRCRTtpl.rct.tplSizeEnd + GRCRTtpl.rct.tplFontEnd%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>" + GRCRTtpl.rct.tplTableEnd + "[center]<%=RepConv.Const.footer%>[/center]";
        break;
      case "support":
        l += GRCRTtpl.rct.tplTableBegin + "<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.addLine(245)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(190)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(245)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%><%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(((attacker.town != undefined) ? attacker.town+'\\n' : '')+((attacker.player != undefined) ? attacker.player+'\\n' : '')+((attacker.ally != undefined) ? attacker.ally+'\\n' : ''),10), GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.AddFont('[img]'+RepConv.grcrt_cdn+'ui/ragB.png[/img][img]'+RepConv.grcrt_cdn+'ui/5/'+reportImage+'.png[/img][img]'+RepConv.grcrt_cdn+'ui/ragE.png[/img]', GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(((defender.town != undefined) ? defender.town+'\\n' : '')+((defender.player != undefined) ? defender.player+'\\n' : '')+((defender.ally != undefined) ? defender.ally+'\\n' : ''),10), GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>" + 
        (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplTableNBBegin : GRCRTtpl.rct.tplTableEnd) + "[center]<%=RepConv.Const.footer%>[/center]" + (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplTableNBEnd : GRCRTtpl.rct.tplTableBegin) + GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColSpan3 + "<%=GRCRTtpl.rct.tplFontBegin+GRCRTtpl.rct.tplSize9%><%for(idx in attacker.splits){%><%=attacker.splits[idx].img_url %>\\n<%}%><%=GRCRTtpl.rct.tplSizeEnd+GRCRTtpl.rct.tplFontEnd%>" + GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd + 
        "<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.addLine(245)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(190)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(245)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>" + GRCRTtpl.rct.tplTableEnd;
        break;
      case "attackSupport":
        l += GRCRTtpl.rct.tplTableBegin + "<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.addLine(245)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(190)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(245)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%><%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(((attacker.town != undefined) ? attacker.town+'\\n' : '')+((attacker.player != undefined) ? attacker.player+'\\n' : '')+((attacker.ally != undefined) ? attacker.ally+'\\n' : ''),10), GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.AddFont('[img]'+RepConv.grcrt_cdn+'ui/ragB.png[/img][img]'+RepConv.grcrt_cdn+'ui/5/'+reportImage+'.png[/img][img]'+RepConv.grcrt_cdn+'ui/ragE.png[/img]', GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(((defender.town != undefined) ? defender.town+'\\n' : '')+((defender.player != undefined) ? defender.player+'\\n' : '')+((defender.ally != undefined) ? defender.ally+'\\n' : ''),10), GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>" + 
        (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplTableNBBegin : GRCRTtpl.rct.tplTableEnd) + "[center]<%=RepConv.Const.footer%>[/center]" + (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplTableNBEnd : GRCRTtpl.rct.tplTableBegin) + GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin + GRCRTtpl.rct.tplColSep + (h.showCost ? "[center]<%=GRCRTtpl.rct.tplFontBegin%>\\n<%=GRCRTtpl.Value(attacker.w.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%>\u00a0[img]<%= RepConv.grcrt_cdn %>ui/wood.png[/img]\u00a0<%=GRCRTtpl.Value(defender.w.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%>\\n<%=GRCRTtpl.Value(attacker.s.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%>\u00a0[img]<%= RepConv.grcrt_cdn %>ui/stone.png[/img]\u00a0<%=GRCRTtpl.Value(defender.s.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%>\\n<%=GRCRTtpl.Value(attacker.i.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%>\u00a0[img]<%= RepConv.grcrt_cdn %>ui/iron.png[/img]\u00a0<%=GRCRTtpl.Value(defender.i.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%>\\n<%=GRCRTtpl.Value(attacker.f.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%>\u00a0[img]<%= RepConv.grcrt_cdn %>ui/power.png[/img]\u00a0<%=GRCRTtpl.Value(defender.f.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%>\\n<%=GRCRTtpl.Value(attacker.p.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%>\u00a0[img]<%= RepConv.grcrt_cdn %>ui/pop.png[/img]\u00a0<%=GRCRTtpl.Value(defender.p.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%><%=GRCRTtpl.rct.tplFontEnd%>[/center]\\n" : 
        "") + GRCRTtpl.rct.tplColSep + "<%=GRCRTtpl.rct.tplFontBegin+GRCRTtpl.rct.tplSize9%><%for(idx in defender.splits){%><%=defender.splits[idx].img_url %>\\n<%}%><%=GRCRTtpl.rct.tplSizeEnd+GRCRTtpl.rct.tplFontEnd%>" + GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd + "<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.addLine(245)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(190)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(245)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>" + 
        GRCRTtpl.rct.tplTableEnd;
        break;
      case "agoraD":
      case "agoraS":
        l += GRCRTtpl.rct.tplTableBegin + "=#=#=<%for(ind in linia){%><%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin + GRCRTtpl.rct.tplFontBegin + GRCRTtpl.rct.tplSize9%><%=linia[ind].title%>\\n<%=RepConvTool.addLine(698)%>\\n<%=linia[ind].img_url%><%=GRCRTtpl.rct.tplSizeEnd + GRCRTtpl.rct.tplFontEnd + GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>=#=#=<%}%>" + (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplTableNBBegin : GRCRTtpl.rct.tplTableEnd) + "[center]<%=RepConv.Const.footer%>[/center]" + 
        (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplTableNBEnd + GRCRTtpl.rct.tplTableEnd : "");
        break;
      case "espionage":
        l += GRCRTtpl.rct.tplTableBegin + "<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.addLine(245)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(190)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(245)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%><%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(((attacker.town != undefined) ? attacker.town+'\\n' : '')+((attacker.player != undefined) ? attacker.player+'\\n' : '')+((attacker.ally != undefined) ? attacker.ally+'\\n' : ''),10), GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.AddFont('[img]'+RepConv.grcrt_cdn+'ui/ragB.png[/img][img]'+RepConv.grcrt_cdn+'ui/5/'+reportImage+'.png[/img][img]'+RepConv.grcrt_cdn+'ui/ragE.png[/img]', GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(((defender.town != undefined) ? defender.town+'\\n' : '')+((defender.player != undefined) ? defender.player+'\\n' : '')+((defender.ally != undefined) ? defender.ally+'\\n' : ''),10), GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>" + 
        (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplTableNBBegin : GRCRTtpl.rct.tplTableEnd) + "[center]<%=RepConv.Const.footer%>[/center]" + (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplTableNBEnd : GRCRTtpl.rct.tplTableBegin) + GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColSpan2 + GRCRTtpl.rct.tplFontBegin + GRCRTtpl.rct.tplSize9 + "<%if (defender.title != null){%>[b]<%=defender.title%>[/b]\\n<%      for(idx in defender.splits){%><%=defender.splits[idx].img_url %>\\n<%      }%><%}%><%if (build.title != null){%>[b]<%=build.title%>[/b]\\n<%      for(idx in build.splits){%><%=build.splits[idx].img_url %>\\n<%      }%><%}%>" + 
        GRCRTtpl.rct.tplSizeEnd + GRCRTtpl.rct.tplFontEnd + GRCRTtpl.rct.tplColSep + GRCRTtpl.rct.tplFontBegin + GRCRTtpl.rct.tplSize9 + '[b]<%=iron.title%>[/b]\\n<%if(iron.count!=""){%><%=RepConvTool.Adds(RepConv.Const.uiImg + "5/coins.png", "img")%> [b]<%=GRCRTtpl.AddSize(iron.count,12)%>[/b]\\n<%}%><%if (resources.title != ""){%>\\n\\n[b]<%=resources.title%>[/b]\\n<%=resources.img_url%>\\n<%}%><%if (god.title != ""){%>\\n\\n[b]<%=god.title%>[/b]\\n<%=god.img_url%>\\n<%}%>' + GRCRTtpl.rct.tplSizeEnd + 
        GRCRTtpl.rct.tplFontEnd + GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd + "<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColSpan2%><%=RepConvTool.addLine(472)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(218)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>" + GRCRTtpl.rct.tplTableEnd;
        break;
      case "powers":
        l += GRCRTtpl.rct.tplTableBegin + "<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.addLine(245)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(190)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(245)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%><%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(((attacker.town != undefined) ? attacker.town+'\\n' : '')+((attacker.player != undefined) ? attacker.player+'\\n' : '')+((attacker.ally != undefined) ? attacker.ally+'\\n' : ''),10), GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.AddFont('[img]'+RepConv.grcrt_cdn+'ui/ragB.png[/img][img]'+RepConv.grcrt_cdn+'ui/5/'+reportImage+'.png[/img][img]'+RepConv.grcrt_cdn+'ui/ragE.png[/img]', GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(((defender.town != undefined) ? defender.town+'\\n' : '')+((defender.player != undefined) ? defender.player+'\\n' : '')+((defender.ally != undefined) ? defender.ally+'\\n' : ''),10), GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>" + 
        (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplTableNBBegin : GRCRTtpl.rct.tplTableEnd) + "[center]<%=RepConv.Const.footer%>[/center]" + (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplTableNBEnd : GRCRTtpl.rct.tplTableBegin) + "<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.AddFont(GRCRTtpl.AddSize('[b]'+powerinfo.name.wrapLine(26)+'[/b]\\n\\n'+powerinfo.description.wrapLine(31),11)+'\\n'+RepConvTool.addLine(245), GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColSep%><%=GRCRTtpl.rct.tplFontBegin%>[center]<%=RepConvTool.Adds(RepConv.Const.uiImg + '8/' + powerinfo.id + '.png',\"img\") %>[/center]\\n<%=RepConvTool.addLine(190)%><%=GRCRTtpl.rct.tplFontEnd%><%=GRCRTtpl.rct.tplColSep%><%=GRCRTtpl.rct.tplFontBegin+GRCRTtpl.rct.tplSize9%><%if (efekt.detail != null){%>[b]<%=efekt.detail.wrapLine(25)%>[/b]\\n<%}%><%if (type == 1){%><%}else if (type == 2){%><%  for(idx in resources.splits){%><%=resources.splits[idx].img_url %>\\n<%  }%><%}else if (type == 3){%><%=resources.img_url%>\\n<%}else if (type == 4){%><%}else if (type == 5){%><%=resources.img_url%>\\n<%}%><%=RepConvTool.addLine(245)%><%=GRCRTtpl.rct.tplSizeEnd+GRCRTtpl.rct.tplFontEnd%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd %>" + 
        GRCRTtpl.rct.tplTableEnd;
        break;
      case "wall":
        l = this.rct.tplTableBegin + '<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin %>[b]<%=GRCRTtpl.AddSize(title,12)%>[/b]\\n<%=RepConvTool.addLine(340)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(25)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(340)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%><%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=  GRCRTtpl.AddSize(defeated.title,12) + GRCRTtpl.rct.tplColSep + GRCRTtpl.rct.tplColSep + GRCRTtpl.AddSize(losses.title,12)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%><%  if(defeated.titleAttacker != "" || losses.titleAttacker != ""){%><%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=  GRCRTtpl.rct.tplFontBegin + GRCRTtpl.rct.tplSize9 %><%    if(defeated.titleAttacker != ""){%>[b]<%=defeated.titleAttacker%>[/b]\\n<%      for(ind = 0; ind < Math.max(Object.size(defeated.attacker), Object.size(losses.attacker)); ind++){%><%        if(defeated.attacker[ind] != undefined){%><%=  defeated.attacker[ind].img_url%>\\n<%        } else {%><%=  emptyline%><%        }%><%      }%><%    }%><%=GRCRTtpl.rct.tplSizeEnd + GRCRTtpl.rct.tplFontEnd%><%=GRCRTtpl.rct.tplColSep%><%=GRCRTtpl.rct.tplColSep%><%=GRCRTtpl.rct.tplFontBegin + GRCRTtpl.rct.tplSize9 %><%    if(losses.titleAttacker != ""){%>[b]<%=losses.titleAttacker%>[/b]\\n<%      for(ind = 0; ind < Math.max(Object.size(defeated.attacker), Object.size(losses.attacker)); ind++){%><%        if(losses.attacker[ind] != undefined){%><%=  losses.attacker[ind].img_url%>\\n<%        } else {%><%=  emptyline%><%        }%><%      }%><%    }%><%=GRCRTtpl.rct.tplSizeEnd + GRCRTtpl.rct.tplFontEnd%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%><%  }%><%  if(defeated.titleDefender != "" || losses.titleDefender != ""){%><%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=GRCRTtpl.rct.tplFontBegin + GRCRTtpl.rct.tplSize9 %><%    if(defeated.titleDefender != ""){%>[b]<%=defeated.titleDefender%>[/b]\\n<%      for(ind = 0; ind < Math.max(Object.size(defeated.defender), Object.size(losses.defender)); ind++){%><%        if(defeated.defender[ind] != undefined){%><%=  defeated.defender[ind].img_url%>\\n<%        } else {%><%=  emptyline%><%        }%><%      }%><%    }%><%=GRCRTtpl.rct.tplSizeEnd + GRCRTtpl.rct.tplFontEnd%><%=GRCRTtpl.rct.tplColSep%><%=GRCRTtpl.rct.tplColSep%><%=GRCRTtpl.rct.tplFontBegin + GRCRTtpl.rct.tplSize9 %><%    if(losses.titleDefender != ""){%>[b]<%=losses.titleDefender%>[/b]\\n<%      for(ind = 0; ind < Math.max(Object.size(defeated.defender), Object.size(losses.defender)); ind++){%><%        if(losses.defender[ind] != undefined){%><%=  losses.defender[ind].img_url%>\\n<%        } else {%><%=  emptyline%><%        }%><%      }%><%    }%><%=GRCRTtpl.rct.tplSizeEnd + GRCRTtpl.rct.tplFontEnd%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%><%  }%>' + 
        this.rct.tplTableEnd + "[center]<%=RepConv.Const.footer%>[/center]";
        break;
      case "conquer":
      case "illusion":
      case "found":
        l += GRCRTtpl.rct.tplTableBegin + "<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.addLine(245)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(190)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(245)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%><%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(((attacker.town != undefined) ? attacker.town+'\\n' : '')+((attacker.player != undefined) ? attacker.player+'\\n' : '')+((attacker.ally != undefined) ? attacker.ally+'\\n' : ''),10), GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.AddFont('[img]'+RepConv.grcrt_cdn+'ui/ragB.png[/img][img]'+RepConv.grcrt_cdn+'ui/5/'+reportImage+'.png[/img][img]'+RepConv.grcrt_cdn+'ui/ragE.png[/img]', GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(((defender.town != undefined) ? defender.town+'\\n' : '')+((defender.player != undefined) ? defender.player+'\\n' : '')+((defender.ally != undefined) ? defender.ally+'\\n' : ''),10), GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>" + 
        (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplTableNBBegin : GRCRTtpl.rct.tplTableEnd) + "[center]<%=RepConv.Const.footer%>[/center]" + (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplTableNBEnd : GRCRTtpl.rct.tplTableBegin) + "<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColSpan3%><%=detail%>\\n<%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd %><%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColSpan3%><%=RepConvTool.addLine(698)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd %>" + GRCRTtpl.rct.tplTableEnd;
        break;
      case "conquest":
        l = GRCRTtpl.rct.tplTableBegin + "<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColSpan4%><%=GRCRTtpl.rct.tplFontBegin %>[b]<%=title%>[/b]\\n<%=defender.town%> (<%=time%>)\\n[b]<%=RepConvTool.GetLabel('ATTACKER')%>[/b]: <%=attacker.player%> <%=GRCRTtpl.rct.tplFontEnd%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%><%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColSpan4%><%=GRCRTtpl.rct.tplFontBegin + GRCRTtpl.rct.tplSize9 %><%=attacker.title%>\\n<%for(ind in attacker.splits){%><%=  attacker.splits[ind].img_url%>\\n<%}%><%=RepConvTool.addLine(698)%><%=GRCRTtpl.rct.tplSizeEnd + GRCRTtpl.rct.tplFontEnd%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>" + 
        (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColSpan4 : GRCRTtpl.rct.tplTableEnd) + "[center]<%=RepConv.Const.footer%>[/center]" + (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplTableNBEnd : GRCRTtpl.rct.tplTableBegin) + "<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.addLine(32)%><%=GRCRTtpl.rct.tplColSep%><%=GRCRTtpl.rct.tplFontBegin %>[b]<%=GRCRTtpl.AddSize(command.title,10)%>[/b] (##/##)\\n<%=RepConvTool.addLine(304)%><%=GRCRTtpl.rct.tplFontEnd %><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(32)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(304)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>" + 
        (0 < Object.size(h.linia) ? "=#=#=<%for(xx = 0; xx < Object.size(linia); xx+=2){%><%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=linia[xx].img%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.AddFont(GRCRTtpl.AddSize('('+linia[xx].time+')\\n'+linia[xx].text,8), GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColSep%><%  if(Object.size(linia[xx+1])>0){%><%=linia[xx+1].img%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.AddFont(GRCRTtpl.AddSize('('+linia[xx+1].time+')\\n'+linia[xx+1].text,8), GRCRTtpl.rct.fonttag)%><%  } else {%><%=GRCRTtpl.rct.tplColSep%><%  }%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>=#=#=<%}%>" : 
        "") + GRCRTtpl.rct.tplTableEnd;
        break;
      case "academy":
        l += GRCRTtpl.rct.tplTableBegin + '<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin + GRCRTtpl.rct.tplFontBegin%><%for(ind in linia){%><%=RepConvTool.Adds((GRCRTtpl.rct.tplGenImg).RCFormat(GRCRTtpl.rct.sign, linia[ind].unit_list), "img")%>\\n<%}%><%=RepConvTool.addLine(698)%>\\n[b]<%=GRCRTtpl.AddSize(points,9)%>[/b]<%=GRCRTtpl.rct.tplFontEnd + GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>' + (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplTableNBBegin : GRCRTtpl.rct.tplTableEnd) + "[center]<%=RepConv.Const.footer%>[/center]" + 
        (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplTableNBEnd + GRCRTtpl.rct.tplTableEnd : "");
        break;
      case "ownTropsInTheCity":
        l += GRCRTtpl.rct.tplTableBegin + "<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin + GRCRTtpl.rct.tplFontBegin%><%=RepConvTool.addLine(698)%>\\n<%=defender.full.img_url %>\\n<%=GRCRTtpl.rct.tplFontEnd + GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>" + (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplTableNBBegin : GRCRTtpl.rct.tplTableEnd) + "[center]<%=RepConv.Const.footer%>[/center]" + (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplTableNBEnd + GRCRTtpl.rct.tplTableEnd : "");
        break;
      case "bbcode_island":
      case "bbcode_player":
      case "bbcode_alliance":
        l = "<%=GRCRTtpl.AddSize(header,9)%> (##/##)\\n<%=GRCRTtpl.rct.tplTableBegin%>=#=#=<%for(ind in linia){%><%=GRCRTtpl.rct.tplRowBegin%><%=GRCRTtpl.rct.tplColBegin%><%=ind%>.<%=GRCRTtpl.rct.tplColSep%><%=linia[ind].col1%><%=GRCRTtpl.rct.tplColSep%><%=linia[ind].col2%><%=GRCRTtpl.rct.tplColSep%><%=linia[ind].col3%><%=GRCRTtpl.rct.tplColSep%><%=linia[ind].col4%><%=GRCRTtpl.rct.tplColEnd%><%=GRCRTtpl.rct.tplRowEnd%>=#=#=<%}%><%=GRCRTtpl.rct.tplTableEnd%>";
        break;
      case "olympus_temple_info":
        l = GRCRTtpl.rct.tplTableBegin + '<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=GRCRTtpl.rct.tplFontBegin %>[b]<%=title%>[/b]\\n<%=temple.god.img_url%> <%=temple.god.name%>\\n[i]<%=temple.buff%>[/i]\\n<%=GRCRTtpl.rct.tplFontEnd%><%=GRCRTtpl.rct.tplColSep%><%=GRCRTtpl.rct.tplFontBegin %><%=temple.name%> \\n<%  if (temple.owner!="") {%><%=temple.owner%> \\n<%}%>[img]https://cdn.grcrt.net/ui/attack.png[/img] <%=movements_count.attack%>     [img]https://cdn.grcrt.net/ui/support.png[/img] <%=movements_count.support%>\\n<%=GRCRTtpl.rct.tplFontEnd%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%><%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=GRCRTtpl.rct.tplFontBegin + GRCRTtpl.rct.tplSize9 %><%=RepConvTool.addLine(345)%><%=GRCRTtpl.rct.tplSizeEnd + GRCRTtpl.rct.tplFontEnd%><%=GRCRTtpl.rct.tplColSep%><%=GRCRTtpl.rct.tplFontBegin + GRCRTtpl.rct.tplSize9 %><%=RepConvTool.addLine(345)%><%=GRCRTtpl.rct.tplSizeEnd + GRCRTtpl.rct.tplFontEnd%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>' + 
        (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplTableNBBegin : GRCRTtpl.rct.tplTableEnd) + "[center]<%=RepConv.Const.footer%>[/center]" + (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplTableNBEnd : GRCRTtpl.rct.tplTableBegin) + GRCRTtpl.rct.tplRowBegin + '<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColSpan2 + GRCRTtpl.rct.tplFontBegin%><%=RepConvTool.addLine(698)%>\\n<%=defender.full.img_url %>\\n<% if ( addInfo != "" ) { %><%=addInfo %>\\n<% } %>\\n<%=GRCRTtpl.rct.tplFontEnd + GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>' + 
        GRCRTtpl.rct.tplRowEnd + (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplTableNBBegin : GRCRTtpl.rct.tplTableEnd) + (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplTableNBEnd : GRCRTtpl.rct.tplTableBegin) + "<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.addLine(32)%><%=GRCRTtpl.rct.tplColSep%><%=GRCRTtpl.rct.tplFontBegin %>[b]<%=GRCRTtpl.AddSize(command.title,10)%>[/b] (##/##)\\n<%=RepConvTool.addLine(304)%><%=GRCRTtpl.rct.tplFontEnd %><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(32)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(304)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>" + 
        (0 < Object.size(h.linia) ? "=#=#=<%for(xx = 0; xx < Object.size(linia); xx+=2){%><%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=linia[xx].img%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.AddFont(GRCRTtpl.AddSize('('+linia[xx].time+')\\n'+linia[xx].text,8), GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColSep%><%  if(Object.size(linia[xx+1])>0){%><%=linia[xx+1].img%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.AddFont(GRCRTtpl.AddSize('('+linia[xx+1].time+')\\n'+linia[xx+1].text,8), GRCRTtpl.rct.fonttag)%><%  } else {%><%=GRCRTtpl.rct.tplColSep%><%  }%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>=#=#=<%}%>" : 
        "") + GRCRTtpl.rct.tplTableEnd;
    }
    return f(RepConvTool.Adds(l, GRCRTtpl.rct.tag), h);
  };
  this.report = function(c, h, l) {
    c = "txt" == c ? this.reportText(h, l) : this.reportHtml(h, l);
    RepConv.Debug && console.log(c);
    h = c.split("=#=#=");
    l = h[0];
    for (var m = h[h.length - 1], C = {splits:[], single:[]}, J = l, I = 1; I < h.length - 1; I++) {
      if (((J + h[I] + m).match(/\[/g) || []).length >= this.rct.tagLimit || (J + h[I] + m).length >= this.rct.charLimit) {
        C.splits.push(J + m), J = l;
      }
      J += h[I];
    }
    J != l && C.splits.push(J + m);
    1 == h.length && C.splits.push(c.replace(" (##/##)", ""));
    $.each(C.splits, function(E, O) {
      C.splits[E] = O.replace("##/##", E + 1 + "/" + Object.size(C.splits));
    });
    C.single = c.replace(" (##/##)", "").split("=#=#=").join("");
    RepConv.Debug && console.log(C);
    return C;
  };
  this.AddSize = function(c, h) {
    return c && 0 < c.length && this.rcts.A == this.rct ? "[size=" + h + "]" + c + "[/size]" : c;
  };
  this.White = function(c, h) {
    return this.rct.blank.slice(1, h - c.length);
  };
  this.Color = function(c, h) {
    return "[color=#" + h + "]" + c + "[/color]";
  };
  this.Unit = function(c, h) {
    RepConv.Debug && console.log(c);
    return this.White(c, this.rct.unitDigits) + c;
  };
  this.Value = function(c, h) {
    return this.White(String(c), h) + String(c);
  };
  this.tmpl = function(c, h) {
    return f(c, h);
  };
  $("head").append($("<style/>").append(".grcrt_frame .checkbox_new {display: block;}"));
  RepConv.initArray.push("GRCRTtpl.init()");
  RepConv.wndArray.push("grcrt_convert");
  this.init = function() {
    new A;
  };
}
function _RepConvABH() {
  function f() {
    var E = $("<div/>", {id:"GRCRT_wrpr", style:"margin:0 0 0 -7px;", "class":"tech_tree_box"}), O = $("<div/>", {id:"GRCRT_abh_settings"}).append($("<div/>", {"class":"GRCRT_abh_spacer"}).append($("<span/>", {"class":"GRCRT_abh_spcr_img"}))).append($("<div/>", {"class":"GRCRT_abh_pop"}).append($("<span/>").html(RepConvTool.GetLabel("ABH.WND.DESCRIPTION1").replace("[population]", '<span class="GRCRT_abh_pop_img"></span><span class="GRCRT_abh_pop_count"></span>'))).append($("<br/>")).append($("<span/>").html(RepConvTool.GetLabel("ABH.WND.DESCRIPTION2").replace("[max_units]", 
    '<span class="GRCRT_abh_unit_count"></span><span class="GRCRT_abh_unit_type"></span>'))).append($("<br/>")).append($("<span/>", {id:"GRCRT_abh_has_research"}).html(RepConvTool.GetLabel("ABH.WND.DESCRIPTION3").replace("[yesno]", '<span class="GRCRT_abh_has_research"></span>').replace("[research]", '<span class="GRCRT_abh_what_research"></span>'))).append($("<br/>")).append($("<span/>").html(RepConvTool.GetLabel("ABH.WND.DESCRIPTION4").replace("[max_queue]", '<span class="GRCRT_abh_max_to_build"></span>')))).append($("<div/>", 
    {"class":"GRCRT_abh_spacer"}).append($("<span/>", {"class":"GRCRT_abh_spcr_img"}))).append($("<div/>", {"class":"GRCRT_abh_target"}).append($("<span/>").html(RepConvTool.GetLabel("ABH.WND.TARGET") + ' <span class="GRCRT_abh_input"></span>'))).append($("<div/>", {"class":"GRCRT_abh_spacer"}).append($("<span/>", {"class":"GRCRT_abh_spcr_img"}))).append($("<div/>", {"class":"GRCRT_abh_pckg"}).append($("<span/>").html(RepConvTool.GetLabel("ABH.WND.PACKAGE") + ' <span class="GRCRT_abh_input"></span>'))).append($("<div/>", 
    {"class":"GRCRT_abh_spacer"}).append($("<span/>", {"class":"GRCRT_abh_spcr_img"}))).append($("<div/>", {"class":"GRCRT_abh_buttons"}).append($("<span/>"))), n = [];
    $.each(J, function(t, q) {
      var x = $("<div/>", {"class":"GRCRT_abh_column"}), z = 0;
      $.each(q, function(B, Q) {
        4 == z && ($(E).append(x), x = $("<div/>", {"class":"GRCRT_abh_column"}), z = 0);
        $(x).append($("<div/>", {"class":"research_box"}).append($("<span/>", {"class":"research_icon research inactive" + Q, name:Q}).addClass(Q).addClass(t)));
        z++;
      });
      0 < z && $(E).append(x);
    });
    n.push(RepConvTool.Ramka(RepConvTool.GetLabel("ABH.WND.UNITFRAME"), E, 318));
    n.push(O);
    return n;
  }
  function A(E) {
    RepConv.Debug && console.log(E);
    var O = ITowns.getTown(Game.townId), n = O.researches(), t = O.buildings(), q, x;
    $.each(J, function(Z, Y) {
      $.each(Y, function(V, T) {
        q = n.get(T) || "sword" == T && 0 < t.get("barracks") || "big_transporter" == T && 0 < t.get("docks");
        x = GRCRTabhWnd.getJQElement().find($('#GRCRT_wrpr span[name="' + T + '"]'));
        $(x).css("cursor", q ? "pointer" : "not-allowed").removeClass("not_available").removeClass("grcrt_set").removeClass("inactive").removeClass("is_researched").mousePopup(new MousePopup(RepConvTool.GetLabel(q ? "ABH.WND.TOOLTIPOK" : "ABH.WND.TOOLTIPNOTOK"))).addClass("inactive").addClass(q ? "" : "not_available").hover(function() {
          $(this).hasClass("grcrt_set") || $(this).hasClass("not_available") || $(this).toggleClass("inactive is_researched");
        }).click(function() {
          if (!$(this).hasClass("not_available")) {
            var R = $(this).attr("name");
            GRCRTabhWnd.getJQElement().find($("grcrt_set")).attr("name");
            $(".grcrt_set").toggleClass("inactive is_researched grcrt_set");
            $(this).addClass("grcrt_set");
            A(R);
          }
        });
        $(x).parent().css("opacity", q ? "" : ".3");
      });
    });
    GRCRTabhWnd.getJQElement().find($("grcrt_set")).toggleClass("inactive is_researched grcrt_set");
    O = GRCRTabhWnd.getJQElement().find($('#GRCRT_wrpr span[name="' + E + '"]'));
    $(O).addClass("grcrt_set").toggleClass("inactive is_researched");
    if ($(O).hasClass("land_unit") || $(O).hasClass("sea_unit")) {
      var z = $(O).hasClass("land_unit") ? GameData.researches.conscription : "";
      z = $(O).hasClass("sea_unit") ? GameData.researches.mathematics : "";
      GRCRTabhWnd.getJQElement().find($(".GRCRT_abh_what_research")).text(z.name);
    } else {
      z = "no_research";
    }
    "no_research" == z ? GRCRTabhWnd.getJQElement().find($(".GRCRT_abh_has_research")).text(RepConvTool.GetLabel("ABH.WND.NORESEARCH")) : ITowns.getTown(Game.townId).researches().get(z.id) ? GRCRTabhWnd.getJQElement().find($(".GRCRT_abh_has_research")).text(RepConvTool.GetLabel("ABH.WND.HASRESEARCH")) : GRCRTabhWnd.getJQElement().find($(".GRCRT_abh_has_research")).text(RepConvTool.GetLabel("ABH.WND.NORESEARCH"));
    null != E ? $("#GRCRT_abh_has_research").show() : $("#GRCRT_abh_has_research").hide();
    O = ITowns.getTown(parseInt(Game.townId)).getAvailablePopulation();
    z = null != E ? Math.floor(O / GameData.units[E].population) : 0;
    var B = null != E ? GameData.units[E].name : "???", Q = MM.checkAndPublishRawModel("Town", {id:Game.townId}).get("storage"), N = null != E ? RecruitUnits.getResearchModificationFactor(Game.townId, E) : 0, U = null != E ? RepConvTool.GetUnitCost(E, N) : {w:0, s:0, i:0};
    U = [U.w, U.s, U.i];
    Q = null != E ? Math.floor(Q / Math.max.apply(Math, U)) : 0;
    U = null != E ? 7 * Q > z ? "(" + (Q > z ? "" : Math.floor(z / Q) + "x" + Q + ", ") + "1x" + z % Q + ")" : "(7x" + Q + ")" : "";
    var fa = null != E ? 7 * Q > z ? z : 7 * Q : 0;
    GRCRTabhWnd.getJQElement().find($("#GRCRT_abh_settings .GRCRT_abh_buttons .button")).attr("unit", E);
    GRCRTabhWnd.getJQElement().find($("#GRCRT_abh_settings .GRCRT_abh_buttons .button")).attr("factor", N);
    GRCRTabhWnd.getJQElement().find($(".GRCRT_abh_pop_count")).text(O);
    GRCRTabhWnd.getJQElement().find($(".GRCRT_abh_unit_count")).text(z);
    GRCRTabhWnd.getJQElement().find($(".GRCRT_abh_unit_type")).text(B);
    GRCRTabhWnd.getJQElement().find($(".GRCRT_abh_max_to_build")).text(fa);
    GRCRTabhWnd.getJQElement().find($("#GRCRT_abh_target_input")).attr("max", fa).attr("value", fa);
    GRCRTabhWnd.getJQElement().find($(".GRCRT_abh_max_to_build_detail")).text(U);
    GRCRTabhWnd.getJQElement().find($("#GRCRT_abh_pckg_input")).attr("max", Math.floor(0.34 * Q)).attr("value", Math.floor(0.34 * Q));
  }
  function c(E) {
    E.getJQElement().find($(".grcrt_abh_unit_wrapper")).remove();
    E.getJQElement().find($("#trade_duration .grcrt_abh_res_left")).remove();
    null != I.selectedTo.id && (E.getJQElement().find($("#trade_options")).append(RepConvForm.unitMinMax({name:"unit_slider_" + E.getID(), wndId:E.getID(), min:"0", max:I.pckgSize, value:I.pckgSize, tTown:I.selectedTo.id, unit:null == I.selectedTo.id ? "x" : RepConvABH.savedArr[I.selectedTo.id].unit})), E.getJQElement().find($(".grcrt_abh_selected_unit")).click(function() {
      m($(this).attr("rel"), !0, $(this).attr("wndid"));
    }), E.getJQElement().find($("#trade_duration")).append($("<div/>", {"class":"grcrt_abh_res_left"}).append($("<div/>", {style:"display:inline-flex"}).append($("<div/>").append($("<div/>", {"class":"resource_wood_icon res_icon"})).append($("<div/>", {"class":"amount"}).text(Math.round(I.resPerUnit.w * RepConvABH.savedArr[I.selectedTo.id].target_left)))).append($("<div/>").append($("<div/>", {"class":"resource_stone_icon res_icon"})).append($("<div/>", {"class":"amount"}).text(Math.round(I.resPerUnit.s * 
    RepConvABH.savedArr[I.selectedTo.id].target_left)))).append($("<div/>").append($("<div/>", {"class":"resource_iron_icon res_icon"})).append($("<div/>", {"class":"amount"}).text(Math.round(I.resPerUnit.i * RepConvABH.savedArr[I.selectedTo.id].target_left)))).append($("<div/>", {"class":"grcrt_abh_caption"}).html('<span class="target_left">' + RepConvABH.savedArr[I.selectedTo.id].target_left + "</span>/" + RepConvABH.savedArr[I.selectedTo.id].target + " " + GameData.units[RepConvABH.savedArr[I.selectedTo.id].unit].name_plural)))));
  }
  function h(E, O) {
    return {w:parseInt($.trim(E ? $("#trade_selected_from .resource_wood_icon").text() : $("#ui_box .ui_resources_bar .wood .amount").text())), s:parseInt($.trim(E ? $("#trade_selected_from .resource_stone_icon").text() : $("#ui_box .ui_resources_bar .stone .amount").text())), i:parseInt($.trim(E ? $("#trade_selected_from .resource_iron_icon").text() : $("#ui_box .ui_resources_bar .iron .amount").text())), t:parseInt($.trim(E ? $("#trade_selected_from .trade_capacity").text() : O.getJQElement().find($("#big_progressbar .max")).text()))};
  }
  function l(E, O, n, t) {
    var q = void 0 === RepConvABH.savedArr[E] ? 1 : RepConvABH.savedArr[E].factor;
    O = h(O, t);
    q = RepConvTool.GetUnitCost(RepConvABH.savedArr[E].unit, q);
    t = q.w + q.s + q.i;
    n = MM.getModels().Town[n].getAvailableTradeCapacity();
    n = Math.floor(n / t);
    O = Math.min.apply(Math, [Math.floor(O.w / q.w), Math.floor(O.s / q.s), Math.floor(O.i / q.i)]);
    return Math.min.apply(Math, [O, n, RepConvABH.savedArr[E].package]);
  }
  function m(E, O, n) {
    n = Layout.wnd.GetByID(n);
    var t = n.getHandler().target_id;
    t = void 0 === RepConvABH.savedArr[t] ? 1 : RepConvABH.savedArr[t].factor;
    h(O, n);
    var q = O ? I.resPerUnit : RepConvTool.GetUnitCost(E, t), x = parseInt(n.getJQElement().find($(".grcrt_abh_selected_unit span.value")).html());
    E = x * q.w;
    t = x * q.s;
    q = x * q.i;
    O && (n.getJQElement().find($("#trade_overview_type_wood")).select().val(E).blur(), n.getJQElement().find($("#trade_overview_type_stone")).select().val(t).blur(), n.getJQElement().find($("#trade_overview_type_iron")).select().val(q).blur());
    O || (n.getJQElement().find($("#trade_type_wood input")).select().val(E).blur(), n.getJQElement().find($("#trade_type_stone input")).select().val(t).blur(), n.getJQElement().find($("#trade_type_iron input")).select().val(q).blur());
  }
  function C() {
    require("game/windows/ids").GRCRT_ABH = "grcrt_abh";
    (function() {
      var E = window.GameControllers.TabController, O = E.extend({initialize:function() {
        E.prototype.initialize.apply(this, arguments);
        var n = this.getWindowModel(), t = $("<div/>").css({margin:"10px"});
        this.$el.html(t);
        n.hideLoading();
        n.getJQElement || (n.getJQElement = function() {
          return t;
        });
        n.appendContent || (n.appendContent = function(q) {
          return t.append(q);
        });
        n.setContent2 || (n.setContent2 = function(q) {
          return t.html(q);
        });
      }, render:function() {
      }, });
      window.GameViews.GrcRTView_grcrt_abh = O;
    })();
    (function() {
      var E = window.GameViews, O = window.WindowFactorySettings, n = require("game/windows/ids"), t = require("game/windows/tabs"), q = n.GRCRT_ABH;
      O[q] = function(x) {
        x = x || {};
        return us.extend({window_type:q, minheight:380, maxheight:390, width:780, tabs:[{type:t.INDEX, title:"none", content_view_constructor:E.GrcRTView_grcrt_abh, hidden:!0}], max_instances:1, activepagenr:0, minimizable:!0, resizable:!1, title:RepConv.grcrt_window_icon + RepConvTool.GetLabel("ABH.WND.WINDOWTITLE"), special_buttons:{help:{action:{type:"external_link", url:RepConv.Scripts_url + "module/grchowto#2"}}}}, x);
      };
    })();
  }
  var J = {land_unit:"slinger hoplite rider catapult sword archer chariot".split(" "), sea_unit:"big_transporter small_transporter bireme attack_ship demolition_ship trireme colonize_ship".split(" ")}, I = {selectedFrom:{id:null}, selectedTo:{id:null}, resPerUnit:{}, targetTown:"", pckgSize:0};
  this.showView = function() {
    var E = null === RepConvABH.savedArr ? null : void 0 === RepConvABH.savedArr[Game.townId] ? null : RepConvABH.savedArr[Game.townId].unit;
    try {
      WM.getWindowByType("grcrt_abh")[0].close();
    } catch (O) {
    }
    window.GRCRTabhWnd = WF.open("grcrt_abh");
    GRCRTabhWnd.setContent2(f());
    GRCRTabhWnd.getJQElement().find($(".grcrt_frame")).css({position:"", "padding-left":"5px", overflow:"hidden"}).addClass("academy");
    GRCRTabhWnd.getJQElement().find($(".inner_box")).css({width:"322px", "float":"left", "margin-right":"20px"});
    $(RepConvForm.inputMinMax({name:"GRCRT_abh_target_input", value:"0", size:"2", min:"0", max:"0"})).appendTo(".GRCRT_abh_target .GRCRT_abh_input");
    $(RepConvForm.inputMinMax({name:"GRCRT_abh_pckg_input", value:"0", size:"1", min:"0", max:"0"})).appendTo(".GRCRT_abh_pckg .GRCRT_abh_input");
    $(RepConvForm.button(RepConvTool.GetLabel("ABH.WND.BTNSAVE"))).click(function() {
      var O = RepConvABH.savedArr || {};
      O[Game.townId] = {unit:$(this).attr("unit"), target:parseInt($("#GRCRT_abh_target_input").val()), target_left:parseInt($("#GRCRT_abh_target_input").val()), factor:parseFloat($(this).attr("factor")), "package":parseInt($("#GRCRT_abh_pckg_input").val()), };
      RepConvABH.savedArr = O;
      RepConvTool.setItem(RepConv.CookieUnitsABH, JSON.stringify(RepConvABH.savedArr));
      RepConv.Debug && console.log(JSON.stringify(O));
      setTimeout(function() {
        HumanMessage.success(RepConvTool.GetLabel("ABH.WND.SETTINGSAVED").replace("[city]", Game.townName));
      }, 0);
    }).appendTo("#GRCRT_abh_settings .GRCRT_abh_buttons").css("margin", "auto");
    A(E);
  };
  this.functCall = function(E, O) {
    if (0 == E.getJQElement().find($(".grcrt_abh_selected_unit")).length) {
      if (O) {
        $("#trade_selected_from").bind("DOMSubtreeModified", function() {
          0 == E.getJQElement().find($("#trade_selected_from .gp_town_link")).length ? (I.selectedFrom = {id:null}, I.pckgSize = "0", I.resPerUnit = RepConvTool.GetUnitCost("x")) : (I.selectedFrom = JSON.parse(RepConvTool.Atob(E.getJQElement().find($("#trade_selected_from .gp_town_link")).attr("href"))), void 0 !== RepConvABH.savedArr[I.selectedTo.id] && (I.pckgSize = l(I.selectedTo.id, !0, I.selectedFrom.id, E), I.resPerUnit = RepConvTool.GetUnitCost(RepConvABH.savedArr[I.selectedTo.id].unit, parseFloat(RepConvABH.savedArr[I.selectedTo.id].factor))));
          c(E);
        }), $("#trade_selected_to").bind("DOMSubtreeModified", function() {
          I.selectedTo = 0 == E.getJQElement().find($("#trade_selected_to .gp_town_link")).length ? {id:null} : JSON.parse(RepConvTool.Atob(E.getJQElement().find($("#trade_selected_to .gp_town_link")).attr("href")));
          void 0 === RepConvABH.savedArr[I.selectedTo.id] ? E.getJQElement().find($(".grcrt_abh_unit_wrapper")).remove() : (I.pckgSize = null == I.selectedFrom.id ? 0 : l(I.selectedTo.id, !0, I.selectedFrom.id, E), I.resPerUnit = null == I.selectedFrom.id ? RepConvTool.GetUnitCost("x") : RepConvTool.GetUnitCost(RepConvABH.savedArr[I.selectedTo.id].unit, parseFloat(RepConvABH.savedArr[I.selectedTo.id].factor)), c(E));
        }), $("#trade_buttons .confirm").click(function() {
          null != I.selectedFrom.id && null != I.selectedTo.id && (RepConvABH.savedArr[I.selectedTo.id].target_left = parseInt(RepConvABH.savedArr[I.selectedTo.id].target_left) - parseInt(E.getJQElement().find($(".grcrt_abh_selected_unit .value")).text()), _res = {wood:parseInt(E.getJQElement().find($(".grcrt_abh_res_left .wood .amount")).text()), stone:parseInt(E.getJQElement().find($(".grcrt_abh_res_left .stone .amount")).text()), iron:parseInt(E.getJQElement().find($(".grcrt_abh_res_left .iron .amount")).text())}, 
          E.getJQElement().find($(".grcrt_abh_res_left .wood .amount")).text(_res.wood - parseInt(E.getJQElement().find($("#trade_overview_type_wood")).val())), E.getJQElement().find($(".grcrt_abh_res_left .stone .amount")).text(_res.stone - parseInt(E.getJQElement().find($("#trade_overview_type_stone")).val())), E.getJQElement().find($(".grcrt_abh_res_left .iron .amount")).text(_res.iron - parseInt(E.getJQElement().find($("#trade_overview_type_iron")).val())), E.getJQElement().find($(".grcrt_abh_res_left .target_left")).text(RepConvABH.savedArr[I.selectedTo.id].target_left), 
          RepConvTool.setItem(RepConv.CookieUnitsABH, JSON.stringify(RepConvABH.savedArr)));
        });
      } else {
        var n = E.getHandler().target_id, t = RepConvTool.GetUnitCost(null == RepConvABH.savedArr || void 0 === RepConvABH.savedArr[n] ? "x" : RepConvABH.savedArr[n].unit);
        O = null == RepConvABH.savedArr || void 0 === RepConvABH.savedArr[n] ? "0" : l(n, O, Game.townId, E);
        null != RepConvABH.savedArr && void 0 != RepConvABH.savedArr[n] && (E.getJQElement().find($("#trade .content")).append(RepConvForm.unitMinMax({name:"unit_slider_" + E.getID(), wndId:E.getID(), min:"0", max:O, value:O, tTown:n, unit:RepConvABH.savedArr[n].unit})).append($("<div/>", {"class":"grcrt_abh_res_left"}).append($("<div/>", {style:"margin:auto;"}).append($("<div/>", {"class":"grcrt_abh_caption"}).html('<span class="target_left">' + RepConvABH.savedArr[n].target_left + "</span>/" + 
        RepConvABH.savedArr[n].target + " " + GameData.units[RepConvABH.savedArr[n].unit].name_plural))).append($("<div/>", {style:"display:inline-flex"}).append($("<div/>").append($("<div/>", {"class":"resource_wood_icon res_icon"})).append($("<div/>", {"class":"amount wood"}).text(Math.round(t.w * RepConvABH.savedArr[n].target_left)))).append($("<div/>").append($("<div/>", {"class":"resource_stone_icon res_icon"})).append($("<div/>", {"class":"amount stone"}).text(Math.round(t.s * RepConvABH.savedArr[n].target_left)))).append($("<div/>").append($("<div/>", 
        {"class":"resource_iron_icon res_icon"})).append($("<div/>", {"class":"amount iron"}).text(Math.round(t.i * RepConvABH.savedArr[n].target_left)))))), E.getJQElement().find($(".btn_trade_button")).bind("click", function() {
          RepConvABH.savedArr[n].target_left -= parseInt($(".grcrt_abh_selected_unit .value").text());
          var q = parseInt(E.getJQElement().find($(".grcrt_abh_res_left .wood.amount")).text()), x = parseInt(E.getJQElement().find($(".grcrt_abh_res_left .stone.amount")).text()), z = parseInt(E.getJQElement().find($(".grcrt_abh_res_left .iron.amount")).text());
          E.getJQElement().find($(".grcrt_abh_res_left .wood.amount")).text(q - parseInt(E.getJQElement().find($("#trade_type_wood input")).val()));
          E.getJQElement().find($(".grcrt_abh_res_left .stone.amount")).text(x - parseInt(E.getJQElement().find($("#trade_type_stone input")).val()));
          E.getJQElement().find($(".grcrt_abh_res_left .iron.amount")).text(z - parseInt(E.getJQElement().find($("#trade_type_iron input")).val()));
          E.getJQElement().find($(".grcrt_abh_res_left .target_left")).text(RepConvABH.savedArr[n].target_left);
          RepConvTool.setItem(RepConv.CookieUnitsABH, JSON.stringify(RepConvABH.savedArr));
        }), E.getJQElement().find($(".grcrt_abh_selected_unit")).click(function() {
          m($(this).attr("rel"), !1, $(this).attr("wndid"));
        }));
      }
    }
  };
  this.savedArr = {};
  $("head").append($("<style/>").append('.grcrt_target_btn {background-image: url("' + RepConv.Const.uiImg + 'pm.png");height:20px;width:20px;margin-top: 1px;vertical-align: top;display:inline-block;cursor:pointer;background-position:0px 0px;}').append(".grcrt_target_down {background-position:-20px 0px;}").append(".grcrt_target_down:hover {background-position: -20px -21px;}").append(".grcrt_target_up:hover {background-position: 0 -21px;}").append(".grcrt_abh_unit_wrapper {position: absolute;top: 135px;left: 120px;cursor:pointer;}").append("#trade_overview_wrapper .grcrt_abh_unit_wrapper {position: absolute;top: 5px;left: 10px;cursor:pointer;}").append(".grcrt_abh_unit_wrapper .grcrt_abh_selected_unit {margin: 0px;}").append("div#trade_tab div.grcrt_abh_res_left {position: absolute;left: 10px;bottom: 5px;width: 100%;font-size:0.7em}").append("div#trade_tab div.grcrt_abh_res_left div.amount {width: 40px;margin-right: 20px;text-align: right;float: left;}").append("div#trade_tab div.content {min-height: 340px;}").append("div#trade_duration div.grcrt_abh_res_left {position: absolute;left: 250px;bottom: 3px;width: 100%;}").append("div#trade_duration div.grcrt_abh_res_left div.amount {width: 40px;margin-right: 20px;text-align: right;float: left;}").append(".GRCRT_abh_pop_count, .GRCRT_abh_unit_count, .GRCRT_abh_unit_type, .GRCRT_abh_has_curator, .GRCRT_abh_has_research, .GRCRT_abh_what_research, .GRCRT_abh_max_to_build {font-weight: bold;margin:0 3px;}").append('.GRCRT_abh_pop_img {background:url("' + 
  RepConv.Const.uiImg + '3/pop.png") no-repeat scroll center top rgba(0, 0, 0, 0);width:30px;height:30px;display: inline-block;vertical-align: middle;}').append("#GRCRT_wrpr {float:left;}").append("#GRCRT_abh_settings {float:left;width: 400px;text-align: center;}").append(".GRCRT_abh_spacer {clear:both;}").append('.GRCRT_abh_spcr_img {background:url("' + RepConv.Const.uiImg + 'div_hor.png") no-repeat scroll center top rgba(0, 0, 0, 0);width:auto,;height:25px;display: block;margin-bottom: 10px;position:relative;top: 5px;background-size:90% ;}').append("#GRCRT_wrpr {height: 283px;}").append('.GRCRT_abh_column {border-left: 2px groove #D6B468;float: left;height: 100%;background:url("' + 
  Game.img(!0) + '/game/border/even.png") 0 0 repeat;width: 62px;padding: 7px 6px 5px 9px;}'));
  RepConv.menu[2] = {name:"ABH.WND.WINDOWTITLE", action:"RepConvABH.showView()", "class":"abh"};
  $("head").append($("<style/>").append(".grcrt.abh { background-position: -42px -80px;}"));
  $.Observer(GameEvents.town.town_switch).subscribe("GRCRT_ABH_town_town_switch", function(E, O) {
    E = null === RepConvABH.savedArr ? null : void 0 === RepConvABH.savedArr[Game.townId] ? null : RepConvABH.savedArr[Game.townId].unit;
    "undefined" != typeof GRCRTabhWnd && A(E);
  });
  $.Observer(GameEvents.grcrt.settings.load).subscribe("GRCRT_ABH_settings_load", function() {
    RepConvABH.savedArr = JSON.parse(RepConvTool.getSettings(RepConv.CookieUnitsABH, "{}"));
  });
  RepConv.initArray.push("RepConvABH.init()");
  RepConv.wndArray.push("grcrt_abh");
  this.init = function() {
    new C;
  };
}
function _RepConvGRC() {
  function f(b, e, k) {
    return $("<div/>", {"class":"checkbox_new", style:"margin-bottom: 10px; display: block;"}).checkbox({caption:RepConvTool.GetLabel(k || b), checked:e, cid:b});
  }
  function A(b) {
    b.getWindowVeryMainNode().find($("div.ui-dialog-titlebar.ui-widget-header a.grc_reload")).remove();
    switch(b.getController()) {
      case "building_barracks":
      case "building_docks":
        0 == b.getWindowVeryMainNode().find($("div.ui-dialog-titlebar.ui-widget-header a.grc_reload")).length && b.getWindowVeryMainNode().find($("div.ui-dialog-titlebar.ui-widget-header")).append($("<a/>", {href:"#n", "class":"grc_reload down_big reload", style:"float: right; height: 22px; margin: -1px 0 1px;", rel:b.getID()}).click(function() {
          switch(Layout.wnd.getWindowById($(this).attr("rel")).getController()) {
            case "building_barracks":
              BarracksWindowFactory.openBarracksWindow();
              break;
            case "building_docks":
              DocksWindowFactory.openDocksWindow();
          }
        }));
    }
  }
  function c(b) {
    var e = void 0, k = void 0;
    switch(b.getController()) {
      case "building_barracks":
        $.each(MM.checkAndPublishRawModel("PlayerGods", {id:Game.player_id}).getProductionOverview(), function(K, ba) {
          "hera" == K && (e = "fertility_improvement", k = "hera");
        });
        break;
      case "building_docks":
        $.each(MM.checkAndPublishRawModel("PlayerGods", {id:Game.player_id}).getProductionOverview(), function(K, ba) {
          "poseidon" == K && (e = "call_of_the_ocean", k = "poseidon");
        });
    }
    if (void 0 != e && 0 == $("#unit_order .grcrt_power").length) {
      var p = HelperPower.createCastedPowerModel(e, Game.townId), a = MM.checkAndPublishRawModel("PlayerGods", {id:Game.player_id}).get(k + "_favor") < GameData.powers[e].favor, g = a ? " disabled" : "", u = HelperPower.createCastedPowerModel(e, Game.townId);
      $.each(MM.checkAndPublishRawModel("Town", {id:Game.townId}).getCastedPowers(), function(K, ba) {
        ba.getPowerId() == e && (u = ba, g = " active_animation extendable");
      });
      b.getJQElement().find($(".game_inner_box")).append($("<div/>", {"class":"grcrt_power"}).append($("<div/>", {"class":"powers_container clearfix"}).append($("<div/>", {"class":"power_icon45x45 " + e + " new_ui_power_icon js-power-icon" + g, "data-power_id":e, rel:k}).append($("<div/>", {"class":"extend_spell"}).append($("<div/>", {"class":"gold"})).append($("<div/>", {"class":"amount"}))).append($("<div/>", {"class":"js-caption"})).on("mouseover", function(K) {
        var ba = {show_costs:!0};
        "undefined" != typeof u.getId && (ba.casted_power_end_at = u.getEndAt(), ba.extendable = u.isExtendable());
        $(this).tooltip(TooltipFactory.createPowerTooltip(p.getPowerId(), ba)).showTooltip(K);
      }).on("click", function(K) {
        CM.unregister({main:b.getContext().main, sub:"casted_powers"}, "grcrt_power_" + u.getId());
        K = CM.register({main:b.getContext().main, sub:"casted_powers"}, "grcrt_power_" + u.getId(), b.getJQElement().find($(".grcrt_power .new_ui_power_icon .gold")).button());
        var ba = HelperPower.createCastedPowerModel(e, Game.townId);
        void 0 == u.getId() ? ba.cast() : u.isExtendable() && (BuyForGoldWindowFactory.openExtendPowerForGoldWindow(K, u), $(this).addClass(g));
      }))));
      if (a && !u.isExtendable()) {
        a = GameData.powers[e];
        var D = MM.checkAndPublishRawModel("PlayerGods", {id:Game.player_id}).getCurrentProductionOverview()[k], G = MM.checkAndPublishRawModel("PlayerGods", {id:Game.player_id})[k + "_favor_delta_property"].calculateCurrentValue().unprocessedCurrentValue, M = $("<div/>", {style:"margin-top:42px;color:black;text-shadow: 2px 2px 2px gray;font-size:10px;z-index:3000;font-weight: bold;", name:"counter"});
        CM.unregister({main:b.getContext().main, sub:"casted_powers"}, "grcrt_countdown");
        CM.register({main:b.getContext().main, sub:"casted_powers"}, "grcrt_countdown", M.countdown2({value:(a.favor - G) / D.production * 3600, display:"readable_seconds_with_days"}).on("cd:finish", function() {
          $(this).parent().removeClass("disabled");
          $(this).remove();
        }));
        b.getJQElement().find($(".new_ui_power_icon")).append(M);
      }
    }
  }
  function h(b) {
    0 == b.getJQElement().find("#GRCRTSetupLink").length && b.getJQElement().find(".settings-menu ul").eq(2).append($("<li>", {"class":"with-icon"}).append($("<img/>", {"class":"support-menu-item-icon", src:RepConv.grcrt_cdn + "img/octopus.png", style:"width: 15px;"})).append($("<a/>", {id:"GRCRTSetupLink", href:"#"}).html(RepConv.Scripts_nameS).click(function() {
      RepConvGRC.openGRCRT("HELPTAB4");
    })));
  }
  function l(b) {
    RepConv.settings[RepConv.Cookie + "_bupo"] && ($.each(b.getJQElement().find($(".building>.image.bold")), function(e, k) {
      e = $(k).parent().parent().attr("id").replace(/building_main_(.*)/, "$1");
      e = BuildingMain.buildings[e];
      var p = Math.round(e.building.points * Math.pow(e.building.points_factor, e.next_level)) - Math.round(e.building.points * Math.pow(e.building.points_factor, e.level)), a = Math.round(e.building.points * Math.pow(e.building.points_factor, e.current_level)) - Math.round(e.building.points * Math.pow(e.building.points_factor, e.current_level - 1)) + (1 == e.current_level ? e.building.points : 0);
      $(k).find($("span.grcrtpoints")).remove();
      e.max_level || $(k).append($("<span>", {"class":"grcrtpoints grcrt_plus grcrt_special"}).html("+" + p + "p")).css("letter-spacing", "-1px");
      $(k).append($("<span>", {"class":"grcrtpoints grcrt_special grcrt_minus"}).html("-" + a + "p"));
    }), $.each(b.getJQElement().find($(".building_special>div.image")), function(e, k) {
      e = $(k).attr("id").replace(/special_building_(.*)/, "$1");
      e = BuildingMain.special_buildings_combined_group[e];
      var p = Math.round(e.building.points * Math.pow(e.building.points_factor, e.next_level));
      $(k).find($("div.grcrtpoints")).remove();
      $(k).hasClass("special_build") && (!e.max_level || e.can_upgrade) && $(k).append($("<div>", {"class":"grcrtpoints grcrt_special"}).html("+" + p + "p")).css("letter-spacing", "-1px");
    }), m(b));
  }
  function m(b) {
    if (RepConv.settings[RepConv.Cookie + "_bupo"]) {
      var e = $("div.ui_construction_queue .ui_various_orders.type_building_queue");
      "undefined" != typeof b && b.getJQElement() && (e = b.getJQElement());
      if (0 == e.length) {
        1 == $(".option.city_overview.circle_button.js-option.checked").length && Game.player_settings.build_from_town_index_enabled && setTimeout(function() {
          m(b);
        }, 100);
      } else {
        var k = {};
        $.each(GameData.buildings, function(p, a) {
          k[p] = MM.getModels().Town[Game.townId].buildings().getBuildingLevel(p);
        });
        MM.getModels().BuildingOrder && $.each(MM.getModels().BuildingOrder, function(p, a) {
          if (a.getTownId() == Game.townId) {
            var g = GameData.buildings[a.getType()];
            p = Math.round(g.points * Math.pow(g.points_factor, k[a.getType()] + 1)) - (g.special ? 0 : Math.round(g.points * Math.pow(g.points_factor, k[a.getType()])));
            g = Math.round(g.points * Math.pow(g.points_factor, k[a.getType()])) - Math.round(g.points * Math.pow(g.points_factor, k[a.getType()] - 1));
            var u = $(e).find($(".order_id_" + a.getId() + " .item_icon.building_icon40x40." + a.getType() + ".js-item-icon"));
            $(u).find($(".grcrtpoints")).remove();
            a.hasTearDown() ? 0 == $(u).find($(".grcrtpoints")).length && ($(u).append($("<div>", {"class":"grcrtpoints grcrt_order grcrt_minus"}).html("-" + ($(u).find($("span.construction_queue_sprite")).hasClass("arrow_green_ver") ? p : g) + "p")), k[a.getType()]--) : 0 == $(u).find($(".grcrtpoints")).length && ($(u).append($("<div>", {"class":"grcrtpoints grcrt_order"}).html("+" + ($(u).find($("span.construction_queue_sprite")).hasClass("arrow_green_ver") ? p : g) + "p")), k[a.getType()]++);
          }
        });
      }
    }
  }
  function C(b) {
    if (RepConv.active.ftabs) {
      var e = b.getWindowVeryMainNode().find($("div.menu_wrapper.minimize.menu_wrapper_scroll")), k = b.getWindowVeryMainNode().find($("div.menu_wrapper.minimize.menu_wrapper_scroll>ul"));
      b.getWindowVeryMainNode().find($(".gpwindow_content>.forum_content>.t0"));
      if (e.width() != k.width()) {
        e.width(e.width() + $(e).parent().find($("a.next")).width() + $(e).parent().find($("a.prev")).width());
        k.width(e.width());
        k.css("right", 0);
        $(e).find($("div.fade_left")).remove();
        $(e).find($("div.fade_right")).remove();
        $(e).parent().find($("a.next")).remove();
        $(e).parent().find($("a.prev")).remove();
        k = $($("ul.menu_inner li")[$("ul.menu_inner li").length - 1]).position().top / 22 + 1;
        var p = $("#gptop" + k).css("z-index");
        b.getJQElement().find($("div.gpwindow_content")).css("top", e.height() * (k + 1));
        e.height(e.height() * k);
        b.setHeight(b.getOptions().maxHeight + 22 * (k - 1));
        0 == b.getJQElement().find($("div.gpwindow_top#gptop1")).length && (b.getJQElement().find($("div.gpwindow_top")).attr("id", "gptop1"), b.getWindowVeryMainNode().find($("div#gptop1")).css({"z-index":"10", height:"30px"}));
        for (e = 1; e < k; e++) {
          b.getWindowVeryMainNode().find($("div#gptop" + (e + 1))).remove(), $("<div/>", {"class":"gpwindow_top", id:"gptop" + (e + 1), style:"top:" + 22 * e + "px; z-index:" + (10 - e)}).append($("<div/>", {"class":"gpwindow_left corner"})).append($("<div/>", {"class":"gpwindow_right corner"})).insertBefore(b.getJQElement().find($("div.gpwindow_content")));
        }
        for (e = k - 1; 0 < e; e--) {
          $("#gptop" + e).css("z-index", ++p).css("height", "30px"), $("#gptop" + e + " .corner").css("height", "30px");
        }
        b.getWindowVeryMainNode().find($("ul.menu_inner>li")).css("float", "left");
        var a = b.getWindowVeryMainNode().find($("ul.menu_inner>li")).length;
        $.each(b.getWindowVeryMainNode().find($("ul.menu_inner>li")), function(g, u) {
          $(u).attr("lp", --a);
        });
        a = b.getWindowVeryMainNode().find($("ul.menu_inner>li")).length;
        for (e = 1; e < a; e++) {
          b.getWindowVeryMainNode().find($("ul.menu_inner>li[lp=" + e + "]")).insertAfter(b.getWindowVeryMainNode().find($("ul.menu_inner>li[lp=" + (e - 1) + "]")));
        }
      }
    }
  }
  function J(b) {
    function e(g, u) {
      0 == g.getJQElement().find($("#" + u + " li span.player_name a.gp_player_link")).length && $.each(g.getJQElement().find($("#" + u + " li span.player_name")), function(D, G) {
        $.each(a, function(M, K) {
          K.player == $(G).html() && ($(G).html(hCommon.player(btoa(JSON.stringify({name:K.player, id:K.pid}).replace(/[\u007f-\uffff]/g, function(ba) {
            return "\\u" + ("0000" + ba.charCodeAt(0).toString(16)).slice(-4);
          })), K.player, K.pid)), null != K.player_alliance && $(G).parent().append($("<span/>", {"class":"small alliance_name grcrt_brackets"}).html(hCommon.alliance("n", RepConvTool.getAllianceData(RepConvTool.getPlayerData(K.pid).alliance_id).name, RepConvTool.getPlayerData(K.pid).alliance_id))));
        });
      });
    }
    var k = b.getName(), p = "#" + k;
    if (0 == b.getJQElement().find($(p + "RepConvTownButton")).length) {
      var a = JSON.parse(RepConv.requests[b.getController()].responseText).json.json.town_list;
      e(b, "island_info_towns_left_sorted_by_name");
      e(b, "island_info_towns_left_sorted_by_score");
      e(b, "island_info_towns_left_sorted_by_player");
      0 == b.getJQElement().find($("#BTNVIEWBB" + k)).length && RepConvTool.AddBtn("BTNVIEWBB", k).css("margin", "0").click(function() {
        window.GRCRTConvWnd = new _GRCRTConverterCtrl(b);
      }).insertBefore(p + " div.island_info_towns.island_info_left div.game_border_top");
      RepConv.settings[RepConv.Cookie + "_idle"] && 0 == b.getJQElement().find($(".grcrt_idle")).length && 0 != b.getJQElement().find($(".gp_player_link")).length && ($("<div/>", {"class":"grcrt_idle"}).insertBefore(b.getJQElement().find($("li:not(.reservation_tool)")).find($(".gp_player_link"))), Ea(b));
    }
  }
  function I(b) {
    var e = b.getName(), k = "#" + e;
    0 == b.getJQElement().find($("#BTNVIEWBB" + e)).length && RepConvTool.AddBtn("BTNVIEWBB", e).css("margin", "0").click(function() {
      window.GRCRTConvWnd = new _GRCRTConverterCtrl(b);
    }).insertBefore(k + " #player_towns div.game_border_top");
    if (0 == b.getJQElement().find($(k + "RepConvStatsPlayer")).length) {
      var p = ("player_get_profile_html" == b.getContext().sub ? btoa(JSON.stringify({id:b.getOptions().player_id})) : $(elem).nextAll(".gp_player_link").attr("href")).split(/#/), a = b.getType() == Layout.wnd.TYPE_PLAYER_PROFILE_EDIT ? Game.player_id : "player_get_profile_html" == b.getContext().sub ? JSON.parse(unescape(RepConv.requests.player.url).match(/({.*})/)[0]).player_id : JSON.parse(atob(p[1] || p[0])).id, g = b.getJQElement().find($('#write_message_form input[name="recipients"]')).val();
      p = $("<a/>", {href:"#n", id:e + "RepConvStatsPlayer", player_id:a, player_name:g}).html($("<img/>", {src:RepConv.Const.staticImg + "/stats.png"})).mousePopup(new MousePopup(RepConvTool.GetLabel("STATS.PLAYER")));
      "https:" == window.location.protocol && "potusek" != RepConv.active.statsGRCL ? $(p).attr({href:R("player", a, g), target:"_blank"}) : $(p).click(function() {
        T("player", $(this).attr("player_id"), $(this).attr("player_name"));
      });
      b.getJQElement().find($('#write_message_form input[name="recipients"]')).parent().parent().append(p);
    }
    0 == b.getJQElement().find($(k + "RepConvRadarPlayer")).length && (p = ("player_get_profile_html" == b.getContext().sub ? btoa(JSON.stringify({id:b.getOptions().player_id})) : $(elem).nextAll(".gp_player_link").attr("href")).split(/#/), a = b.getType() == Layout.wnd.TYPE_PLAYER_PROFILE_EDIT ? Game.player_id : "player_get_profile_html" == b.getContext().sub ? JSON.parse(unescape(RepConv.requests.player.url).match(/({.*})/)[0]).player_id : JSON.parse(atob(p[1] || p[0])).id, g = b.getJQElement().find($('#write_message_form input[name="recipients"]')).val(), 
    b.getJQElement().find($("#player_info>h3")).before($("<div/>", {id:e + "RepConvRadarPlayer", style:"width: 23px; height: 23px; float: left;", "class":"grcrt radar"}).mousePopup(new MousePopup(RepConvTool.GetLabel("RADAR.TOWNFINDER"))).click(function() {
      GRCRT_Radar.windowOpen({player:{id:a, name:g}});
    })));
    RepConv.settings[RepConv.Cookie + "_idle"] && 0 == b.getJQElement().find($(".grcrt_idle")).length && ($("<div/>", {"class":"grcrt_idle"}).insertAfter(b.getJQElement().find($("#player_info>h3")).next()), Ea(b));
  }
  function E(b) {
    var e = b.getName(), k = "#" + e;
    0 == b.getJQElement().find($("#BTNVIEWBB" + e)).length && (RepConvTool.AddBtn("BTNVIEWBB", e).css("margin", "0").click(function() {
      window.GRCRTConvWnd = new _GRCRTConverterCtrl(b);
    }).insertBefore(k + " #ally_towns div.game_border_top"), $("<a/>", {href:"#", style:"position:absolute; top:1px; right:90px;", rel:k + "RepConvTownArea", parent:k + " #player_towns"}).append($("<img/>", {id:"grcrt_ally_mass_mail", src:Game.img() + "/game/ally/mass_mail.png"})).click(function() {
      var u = "";
      $.each(b.getJQElement().find($("#ally_towns ul.members_list>li:nth-child(2) ul li")), function(D, G) {
        JSON.parse(RepConvTool.Atob($(G).find("a.gp_player_link").attr("href"))).name != Game.player_name && (u += JSON.parse(RepConvTool.Atob($(G).find("a.gp_player_link").attr("href"))).name + ";");
      });
      Layout.newMessage.open({recipients:u});
    }).insertBefore(k + " #ally_towns div.game_border_top"));
    if (0 == b.getJQElement().find($(k + "RepConvStatsAlly")).length) {
      var p = JSON.parse(unescape(RepConv.requests.alliance.url).match(/({.*})/)[0]).alliance_id, a = b.getOptions().title, g = $("<a/>", {href:"#n", id:e + "RepConvStatsAlly", ally_id:p, ally_name:a, "class":"button_new square", style:"width:26px; float: left;"}).data("ally_id", p).data("ally_name", a).html($("<img/>", {src:RepConv.Const.staticImg + "/stats.png"})).mousePopup(new MousePopup(RepConvTool.GetLabel("STATS.ALLY")));
      "https:" == window.location.protocol && "potusek" != RepConv.active.statsGRCL ? $(g).attr({href:R("alliance", p, a), target:"_blank"}) : $(g).click(function() {
        T("alliance", $(this).data("ally_id"), $(this).data("ally_name"));
      });
      b.getJQElement().find($("#alliance_points")).next().append(g);
    }
    0 == b.getJQElement().find($(k + "RepConvRadarAlliance")).length && (p = JSON.parse(unescape(RepConv.requests.alliance.url).match(/({.*})/)[0]).alliance_id, a = b.getOptions().title, b.getJQElement().find($("#player_info>h3")).before($("<div/>", {id:e + "RepConvRadarAlliance", style:"width: 23px; height: 23px; float: left;", "class":"grcrt radar"}).data("ally_id", p).data("ally_name", a).mousePopup(new MousePopup(RepConvTool.GetLabel("RADAR.TOWNFINDER"))).click(function() {
      GRCRT_Radar.windowOpen({alliance:{id:$(this).data("ally_id"), name:$(this).data("ally_name")}});
    })));
    RepConv.settings[RepConv.Cookie + "_idle"] && 0 == b.getJQElement().find($(".grcrt_idle")).length && ($("<div/>", {"class":"grcrt_idle"}).insertAfter(b.getJQElement().find($(".member_icon"))), Ea(b));
  }
  function O(b) {
    var e = b.getName();
    0 == b.getJQElement().find($("#BTNCONV" + e)).length && RepConvTool.AddBtn("BTNCONV", e).click(function() {
      window.GRCRTConvWnd = new _GRCRTConverterCtrl(b);
    }).insertAfter(b.getJQElement().find($("div.gpwindow_content a.gp_town_link")).eq(0));
  }
  function n(b) {
    var e = b.getName();
    if (0 < b.getJQElement().find($("#report_arrow")).length && 0 == b.getJQElement().find($("#BTNCONV" + e)).length && (b.getJQElement().find($("#report_report div.game_list_footer")).append(RepConvTool.AddBtn("BTNCONV", e).click(function() {
      window.GRCRTConvWnd = new _GRCRTConverterCtrl(b);
    })), RepConv.active.unitsCost)) {
      switch(e = b.getJQElement().find($("div#report_arrow img")).attr("src").replace(/.*\/([a-z_]*)\.png.*/, "$1"), "attack" == e && 0 != b.getJQElement().find($("div.support_report_summary")).length && (e = "attackSupport", b.setHeight(539)), e) {
        case "attack":
        case "take_over":
        case "breach":
        case "attackSupport":
          if (0 < b.getJQElement().find($("div.report_booty_bonus_fight")).length) {
            var k = {unit_img:"", unit_send:"", unit_lost:"", unit_list:"", w:0, s:0, i:0, p:0, f:0}, p = {unit_img:"", unit_send:"", unit_lost:"", unit_list:"", w:0, s:0, i:0, p:0, f:0};
            k = RepConvTool.getUnitResource(k, b.getJQElement().find($("div.report_side_attacker_unit")));
            p = RepConvTool.getUnitResource(p, b.getJQElement().find($(("attackSupport" == e ? ".support_report_summary " : "") + "div.report_side_defender_unit")));
            $(b.getJQElement().find($("div.report_booty_bonus_fight"))[0]).append($("<hr/>")).append($("<table/>", {style:"width:100%; text-align:center; font-size:12px", "class":"grcrt_lost_res"}).append($("<tr/>", {style:"height:16px; padding:0px;"}).append($("<td/>", {style:"width:45%;"}).html(k.w)).append($("<td/>", {style:"height: 15px", "class":"resource_wood_icon"})).append($("<td/>", {style:"width:45%;"}).html(p.w))).append($("<tr/>", {style:"height:16px; padding:0px;"}).append($("<td/>", 
            {style:"width:45%;"}).html(k.s)).append($("<td/>", {style:"height: 15px", "class":"resource_stone_icon"})).append($("<td/>", {style:"width:45%;"}).html(p.s))).append($("<tr/>", {style:"height:16px; padding:0px;"}).append($("<td/>", {style:"width:45%;"}).html(k.i)).append($("<td/>", {style:"height: 15px", "class":"resource_iron_icon"})).append($("<td/>", {style:"width:45%;"}).html(p.i))).append($("<tr/>", {style:"height:16px; padding:0px;"}).append($("<td/>", {style:"width:45%;"}).html(k.f)).append($("<td/>", 
            {style:"height: 14px", "class":"resource_favor_icon"})).append($("<td/>", {style:"width:45%;"}).html(p.f))).append($("<tr/>", {style:"height:16px; padding:0px;"}).append($("<td/>", {style:"width:45%;"}).html(k.p)).append($("<td/>", {style:"width:20px; margin: 0px;", "class":"town_population"})).append($("<td/>", {style:"width:45%;"}).html(p.p))));
          }
      }
    }
  }
  function t(b) {
    function e(ta) {
      var ha = {defAtt:{}, losAtt:{}, defDef:{}, losDef:{}, saved:ta || Timestamp.server()};
      $.each(b.getJQElement().find($("div#building_wall li.odd")), function(Ba, ja) {
        0 < Ba && (RepConv.Debug && console.log($(ja).find($(".list_item_left")).length), $.each($(ja).find($(".list_item_left")), function(ua, pa) {
          RepConv.Debug && console.log(M[Ba][ua]);
          RepConv.Debug && console.log(pa.getElementsByClassName("wall_report_unit").length);
          $.each($(pa).find($(".grcrt_wall_units")), function(Aa, na) {
            Aa = RepConvTool.getUnitName($(na).find($(".wall_report_unit")));
            na = $(na).find($(".place_unit_black")).html();
            ha[M[Ba][ua]][Aa] = na;
          });
        }), RepConv.Debug && console.log($(ja).find($(".list_item_right")).length), $.each($(ja).find($(".list_item_right")), function(ua, pa) {
          RepConv.Debug && console.log(M[Ba][ua]);
          RepConv.Debug && console.log(pa.getElementsByClassName("wall_report_unit").length);
          $.each($(pa).find($(".grcrt_wall_units")), function(Aa, na) {
            Aa = RepConvTool.getUnitName($(na).find($(".wall_report_unit")));
            na = $(na).find($(".place_unit_black")).html();
            ha[M[Ba][ua + 1]][Aa] = na;
          });
        }));
      });
      return ha;
    }
    function k() {
      try {
        RepConvTool.setItem(RepConv.Cookie, e(Timestamp.server()));
        var ta = RepConvTool.getItem(RepConv.CookieWall) || [];
        10 < ta.length && ta.remove(0, 0);
        ta.push(RepConvTool.getItem(RepConv.Cookie));
        RepConvTool.setItem(RepConv.CookieWall, ta);
        setTimeout(function() {
          HumanMessage.success(RepConvTool.GetLabel("MSGHUMAN.OK"));
        }, 0);
        1 == $("#" + RepConv.Const.IdWindowClone).length && $("#" + RepConv.Const.IdWindowClone).remove();
        g(0, !1);
        g(K, !0);
        b.reloadContent();
        p();
      } catch (ha) {
        RepConv.Debug && console.log(ha), setTimeout(function() {
          HumanMessage.error(RepConvTool.GetLabel("MSGHUMAN.ERROR"));
        }, 0);
      }
    }
    function p(ta) {
      RepConv.Debug && console.log("Load wall...");
      0 == b.getJQElement().find($("#RepConvSaved")).length && b.getJQElement().find($("#building_wall div.game_border")).append($("<div/>", {id:"RepConvSaved", style:"position: relative; float: left; margin: 5px; font-weight: bold;"}));
      b.getJQElement().find($(".wall_unit_container>.wall_report_unit")).wrap($("<div/>", {"class":"grcrt_wall_units"}));
      if (null != RepConvTool.getItem(RepConv.Cookie)) {
        var ha = RepConvTool.getItem(RepConv.Cookie), Ba = RepConvTool.getItem(RepConv.CookieWall) || [];
        void 0 != ta && $.each(Ba, function(ua, pa) {
          pa.saved == ta && (ha = pa);
        });
        b.getJQElement().find($("div.grcrt_wall_diff")).remove();
        b.getJQElement().find($("div.grcrt_wall_units")).append($("<div/>", {"class":"grcrt_wall_diff"}).html("-"));
        RepConv.Debug && console.log("Load wall...");
        var ja;
        $.each(b.getJQElement().find($("div#building_wall li.odd")), function(ua, pa) {
          0 < ua && (RepConv.Debug && console.log($(pa).find($(".list_item_left")).length), $.each($(pa).find($(".list_item_left")), function(Aa, na) {
            RepConv.Debug && console.log(M[ua][Aa]);
            RepConv.Debug && console.log(na.getElementsByClassName("wall_report_unit").length);
            $.each($(na).find($(".grcrt_wall_units")), function(Ha, cb) {
              Ha = RepConvTool.getUnitName($(cb).find($(".wall_report_unit")));
              var Sa = $(cb).find($(".place_unit_black")).html(), Ja = ha[M[ua][Aa]][Ha];
              RepConv.Debug && console.log(Ha + " " + Ja + "/" + Sa);
              ja = Sa;
              void 0 != Ja && (ja = Sa - Ja);
              RepConv.Debug && console.log("unitDiff = " + ja);
              $(cb).find($(".grcrt_wall_diff")).html(0 != ja ? ja : "");
            });
          }), RepConv.Debug && console.log($(pa).find($(".list_item_right")).length), $.each($(pa).find($(".list_item_right")), function(Aa, na) {
            RepConv.Debug && console.log(M[ua][Aa]);
            RepConv.Debug && console.log(na.getElementsByClassName("wall_report_unit").length);
            $.each($(na).find($(".grcrt_wall_units")), function(Ha, cb) {
              Ha = RepConvTool.getUnitName($(cb).find($(".wall_report_unit")));
              var Sa = $(cb).find($(".place_unit_black")).html(), Ja = ha[M[ua][Aa + 1]][Ha];
              RepConv.Debug && console.log(Ha + " " + Ja + "/" + Sa);
              ja = Sa;
              void 0 != Ja && (ja = Sa - Ja);
              RepConv.Debug && console.log("unitDiff = " + ja);
              $(cb).find($(".grcrt_wall_diff")).html(0 != ja ? ja : "");
            });
          }));
        });
        $("#RepConvSaved").html(RepConvTool.GetLabel("WALLSAVED") + (void 0 != ha.saved ? ": " + readableUnixTimestamp(ha.saved, "player_timezone", {with_seconds:!0, extended_date:!0}) : "")).css("color", "black");
      } else {
        $("#RepConvSaved").html(RepConvTool.GetLabel("WALLNOTSAVED")).css("color", "red");
      }
    }
    function a(ta) {
      RepConv.Debug && console.log("Load state wall...");
      var ha = RepConvTool.getItem(RepConv.Cookie), Ba = RepConvTool.getItem(RepConv.CookieWall) || [];
      ta == K ? ha = ba : $.each(Ba, function(ja, ua) {
        ua.saved == ta && (ha = ua);
      });
      nb.disable(ta != K);
      $.each(b.getJQElement().find($("div#building_wall li.odd")), function(ja, ua) {
        0 < ja && (RepConv.Debug && console.log($(ua).find($(".list_item_left")).length), $.each($(ua).find($(".list_item_left")), function(pa, Aa) {
          RepConv.Debug && console.log(M[ja][pa]);
          RepConv.Debug && console.log(Aa.getElementsByClassName("wall_report_unit").length);
          $.each($(Aa).find($(".grcrt_wall_units")), function(na, Ha) {
            na = RepConvTool.getUnitName($(Ha).find($(".wall_report_unit")));
            $(Ha).find($(".place_unit_black")).html(ha[M[ja][pa]][na]);
            $(Ha).find($(".place_unit_white")).html(ha[M[ja][pa]][na]);
          });
        }), RepConv.Debug && console.log($(ua).find($(".list_item_right")).length), $.each($(ua).find($(".list_item_right")), function(pa, Aa) {
          RepConv.Debug && console.log(M[ja][pa]);
          RepConv.Debug && console.log(Aa.getElementsByClassName("wall_report_unit").length);
          $.each($(Aa).find($(".grcrt_wall_units")), function(na, Ha) {
            na = RepConvTool.getUnitName($(Ha).find($(".wall_report_unit")));
            $(Ha).find($(".place_unit_black")).html(ha[M[ja][pa + 1]][na]);
            $(Ha).find($(".place_unit_white")).html(ha[M[ja][pa + 1]][na]);
          });
        }));
      });
      p(oa.getValue());
    }
    function g(ta, ha) {
      var Ba = [], ja = RepConvTool.getItem(RepConv.CookieWall) || [];
      $.each(ja, function(ua, pa) {
        pa.saved > ta && pa.saved < K && Ba.push({value:pa.saved, name:readableUnixTimestamp(pa.saved, "player_timezone", {with_seconds:!0, extended_date:!0})});
      });
      ha ? (Ba.push({value:K, name:readableUnixTimestamp(K, "player_timezone", {with_seconds:!0, extended_date:!0})}), Ia.setOptions(Ba), Ia.setValue(K)) : (oa.setOptions(Ba), oa.setValue(void 0 != RepConvTool.getItem(RepConv.Cookie) ? RepConvTool.getItem(RepConv.Cookie).saved : 0));
    }
    function u() {
      oa = B("grcrt_saved", $("<div/>", {id:"grcrtListSaved", "class":"dropdown default"}).dropdown({list_pos:"left", value:void 0 != RepConvTool.getItem(RepConv.Cookie) ? RepConvTool.getItem(RepConv.Cookie).saved : "", class_name:"grcrt_dd_list"}).on("dd:change:value", function(ta, ha, Ba, ja, ua) {
        g(ha, !0);
        p(ha);
      }).on("dd:list:show", function() {
        Ia.hide();
      }));
      Ia = B("grcrt_wall", $("<div/>", {id:"grcrtListWall", "class":"dropdown default"}).dropdown({list_pos:"left", value:void 0 != RepConvTool.getItem(RepConv.Cookie) ? RepConvTool.getItem(RepConv.Cookie).saved : "", class_name:"grcrt_dd_list"}).on("dd:change:value", function(ta, ha, Ba, ja, ua) {
        a(ha);
      }).on("dd:list:show", function() {
        oa.hide();
      }));
      kb = B("grcrt_delsaved", $("<a/>", {"class":"cancel", style:"float:right;"}).button({template:"empty"}).on("btn:click", function() {
        hOpenWindow.showConfirmDialog(RepConvTool.GetLabel("QUESTION"), RepConvTool.GetLabel("WALL.WANTDELETECURRENT"), function() {
          D();
        });
      }).mousePopup(new MousePopup(RepConvTool.GetLabel("WALL.DELETECURRENT"))));
      g(0, !1);
      g(K, !0);
      b.getJQElement().find($("div#building_wall li")).eq(0).append($("<hr/>")).append($("<div/>", {"class":"grcrt_wall_compare"}).append($("<div/>", {"class":"grcrt_wall_compare_dd", style:"width: 49%;"}).append(kb).append($("<label/>", {"for":"grcrtListSaved"}).text(RepConvTool.GetLabel("WALL.LISTSAVED"))).append(oa)).append($("<div/>", {"class":"grcrt_wall_compare_dd", style:"width: 49%;"}).append($("<label/>", {"for":"grcrtListWall"}).text(RepConvTool.GetLabel("WALL.LISTSTATE"))).append(Ia)).append($("<br/>", 
      {style:"clear:both"})));
    }
    function D() {
      try {
        var ta = CM.get({main:"GRCRT", sub:"grcrt_saved"}, "grcrt_saved").getValue(), ha = RepConvTool.getItem(RepConv.CookieWall) || [];
        $.each(ha, function(Ba, ja) {
          if (ja.saved == ta) {
            return ha.remove(Ba, 0), !1;
          }
        });
        RepConvTool.setItem(RepConv.CookieWall, ha);
        g(0, !1);
        g(K, !0);
        b.reloadContent();
        p();
        setTimeout(function() {
          HumanMessage.success(RepConvTool.GetLabel("MSGHUMAN.OK"));
        }, 0);
      } catch (Ba) {
        RepConv.Debug && console.log(Ba), setTimeout(function() {
          HumanMessage.error(RepConvTool.GetLabel("MSGHUMAN.ERROR"));
        }, 0);
      }
    }
    var G = b.getName(), M = {1:["defAtt", "losAtt"], 2:["defDef", "losDef"]}, K = Timestamp.server(), ba = e(K), oa, Ia, kb;
    0 == b.getJQElement().find($("#building_wall div.game_border #BTNCONV" + G)).length && (b.getJQElement().find("#building_wall ul.game_list").css("max-height", "455px"), RepConvTool.AddBtn("BTNCONV", G).click(function() {
      oa.hide();
      Ia.hide();
      window.GRCRTConvWnd = new _GRCRTConverterCtrl(b);
    }).appendTo(b.getJQElement().find($("#building_wall div.game_border"))));
    if (0 == b.getJQElement().find($("#building_wall div.game_border #BTNSAVE" + G)).length) {
      var nb = RepConvTool.AddBtn("BTNSAVE", G).on("btn:click", function() {
        k();
      });
      nb.appendTo(b.getJQElement().find($("#building_wall div.game_border")));
      $.each(b.getJQElement().find($("div#building_wall li.odd")), function(ta, ha) {
        0 < $(ha.previousElementSibling).find($(".wall_symbol")).length && $(ha.previousElementSibling).css("cursor", "pointer").click(function() {
          $(ha).slideToggle(200);
        });
      });
      p();
      u();
      ba = e(K);
      RepConv.wall = ba;
    }
  }
  function q(b) {
    function e() {
      var p = {}, a, g = {}, u = 0, D = "", G = 0, M, K;
      $.each(b.getJQElement().find($('.game_list li[id^="support_units_"] a.gp_player_link')), function(ba, oa) {
        a = $(oa).attr("href").split(/#/);
        M = JSON.parse(atob(a[1] || a[0]));
        Game.player_name != M.name && void 0 == p[M.id] && (p[M.id] = M);
      });
      $.each(p, function(ba, oa) {
        ba = {player_id:oa.id, town_id:Game.townId, nl_init:NotificationLoader.isGameInitialized()};
        ba = $.ajax({url:"/game/player?action=get_profile_html&town_id=" + Game.townId + "&h=" + Game.csrfToken + "&json=" + JSON.stringify(ba), async:!1});
        try {
          var Ia = JSON.parse(ba.responseText).plain.html;
        } catch (kb) {
          Ia = ba.responseText;
        }
        p[oa.id].alliance_name = ($(Ia).children("a").attr("onclick") || "").replace(/.*\('(.*)'.*/, "$1");
      });
      D = b.getJQElement().find($("#defense_header")).html().stripTags() + ":";
      D += "[town]" + Game.townId + "[/town]";
      D += "\n[table]\n";
      $.each(p, function(ba, oa) {
        K = "[*]" + ++G + ".[|]";
        K += "[player]" + oa.name + "[/player][|]";
        K += "[ally]" + oa.alliance_name + "[/ally]";
        K += "[/*]\n";
        3000 < (D + K).length && (g[u] = D + "[/table]", u++, D = b.getJQElement().find($("#defense_header")).html().stripTags() + ":", D += "[town]" + Game.townId + "[/town]", D += "\n[table]\n");
        D += K;
      });
      Layout.hideAjaxLoader();
      g[u] = D + "[/table]";
      if ("undefined" != typeof RepConvParamWnd) {
        try {
          RepConvParamWnd.close();
        } catch (ba) {
        }
        RepConvParamWnd = void 0;
      }
      window.RepConvParamWnd = Layout.dialogWindow.open("", RepConv.Scripts_name, 500, 580, null, !1);
      RepConvParamWnd.setHeight(480);
      RepConvParamWnd.setPosition(["center", "center"]);
      RepConvParamWnd.appendContent($("<div/>", {style:"width:100%"}).html(RepConvTool.GetLabel("BBCODELIMIT")));
      $.each(g, function(ba, oa) {
        RepConvParamWnd.appendContent($("<textarea/>", {"class":"message_post_content", style:"height: 160px; width: 98%; border: 1px solid #D1BF91", readonly:"readonly"}).text(oa).click(function() {
          this.select();
        }));
      });
    }
    var k = b.getName();
    0 == b.getJQElement().find($("#place_defense #BTNCONV" + k)).length && b.getJQElement().find($("#place_defense div.game_list_footer")).append(RepConvTool.AddBtn("BTNCONV", k).click(function() {
      window.GRCRTConvWnd = new _GRCRTConverterCtrl(b);
    }));
    0 < b.getJQElement().find($("#place_defense #defense_header")).length && 0 == b.getJQElement().find($("#place_defense #BTNSUPPLAYERS" + k)).length && b.getJQElement().find($("#place_defense div.game_list_footer")).append(RepConvTool.AddBtn("BTNSUPPLAYERS", k).click(function() {
      e();
    }));
  }
  function x(b) {
    var e = b.getName();
    if (0 < b.getJQElement().find($("#dd_commands_command_type")).length && 0 == b.getJQElement().find($("#BTNCONV" + e)).length) {
      b.getJQElement().find($("#game_list_footer")).append(RepConvTool.AddBtn("BTNCONV", e).click(function() {
        window.GRCRTConvWnd = new _GRCRTConverterCtrl(b);
      }));
      CM.get(b.getContext(), "dd_commands_command_type") && CM.get(b.getContext(), "dd_commands_command_type").bind("dd:change:value", function(a, g, u, D) {
        U(b, parseInt(N("grcrt_townsDD").getValue() || "0"), RepConvGRC.townsCommand);
      });
      JSON.parse(RepConv.requests.town_overviews.responseText);
      e = {name:RepConvTool.GetLabel("COMMAND.ALL"), value:0};
      var k = [{name:"enable", value:1}, {name:"disable", value:0}], p = [e];
      B("grcrt_townsDD", $("<div/>", {id:"grcrt_townsDD", "class":"dropdown default", style:"margin-left:5px;width: 120px;"}).dropdown({list_pos:"left", value:e.value, options:p}).on("dd:change:value", function(a, g, u, D, G) {
        U(b, g, RepConvGRC.townsCommand);
      }));
      B("grcrt_FI", $("<div/>", {id:"grcrt_FI", "class":"dropdown default", style:"margin-left:5px;width: 120px;"}).dropdown({list_pos:"left", value:1, options:k}).on("dd:change:value", function(a, g, u, D, G) {
        RepConv.Debug && console.log("grcrt_FI" + g);
        U(b, parseInt(N("grcrt_townsDD").getValue() || "0"), RepConvGRC.townsCommand);
      }));
      B("grcrt_FR", $("<div/>", {id:"grcrt_FR", "class":"dropdown default", style:"margin-left:5px;width: 120px;"}).dropdown({list_pos:"left", value:1, options:k}).on("dd:change:value", function(a, g, u, D, G) {
        RepConv.Debug && console.log("grcrt_FR" + g);
        U(b, parseInt(N("grcrt_townsDD").getValue() || "0"), RepConvGRC.townsCommand);
      }));
      B("grcrt_FO", $("<div/>", {id:"grcrt_FO", "class":"dropdown default", style:"margin-left:5px;width: 120px;"}).dropdown({list_pos:"left", value:1, options:k}).on("dd:change:value", function(a, g, u, D, G) {
        RepConv.Debug && console.log("grcrt_FO" + g);
        U(b, parseInt(N("grcrt_townsDD").getValue() || "0"), RepConvGRC.townsCommand);
      }));
      Q("grcrt_towns");
      e = B("grcrt_towns", $("<div/>", {id:"grcrt_towns", "class":"dropdown default", style:"margin-left:5px;width: 180px;"}).dropdown({list_pos:"left", value:N("grcrt_townsDD") ? N("grcrt_townsDD").getValue() : Options.value, options:N("grcrt_townsDD").getOptions()}).on("dd:change:value", function(a, g, u, D, G) {
        N("grcrt_townsDD").setValue(g);
        z(b);
        U(b, g, RepConvGRC.townsCommand);
      }));
      b.getJQElement().find($("#game_list_header")).append($("<div/>", {id:"grcrt_command_filter", style:"display: inline-block; float: right;"}).append($("<span/>", {"class":"grcrt_filter"}).html(b.getJQElement().find($("#command_filter>span")).html())).append($("<span/>", {"class":"overview_incoming icon grcrt_filter"}).mousePopup(new MousePopup(RepConvTool.GetLabel("COMMAND.INCOMING"))).addClass(0 == parseInt(N("grcrt_FI").getValue()) ? "grcrt_disabled" : "").click(function() {
        $(this).toggleClass("grcrt_disabled");
        N("grcrt_FI").setValue($(this).hasClass("grcrt_disabled") ? "0" : "1");
      })).append($("<span/>", {"class":"overview_outgoing icon grcrt_filter"}).mousePopup(new MousePopup(RepConvTool.GetLabel("COMMAND.OUTGOING"))).addClass(0 == parseInt(N("grcrt_FO").getValue()) ? "grcrt_disabled" : "").click(function() {
        $(this).toggleClass("grcrt_disabled");
        N("grcrt_FO").setValue($(this).hasClass("grcrt_disabled") ? "0" : "1");
      })).append($("<span/>", {"class":"grcrt_return grcrt_filter"}).mousePopup(new MousePopup(RepConvTool.GetLabel("COMMAND.RETURNING"))).addClass(0 == parseInt(N("grcrt_FR").getValue()) ? "grcrt_disabled" : "").click(function() {
        $(this).toggleClass("grcrt_disabled");
        N("grcrt_FR").setValue($(this).hasClass("grcrt_disabled") ? "0" : "1");
      })).append($("<label/>").text(RepConvTool.GetLabel("COMMAND.FORTOWN"))).append(e));
      0 == parseInt(N("grcrt_townsDD").getValue()) && b.getJQElement().find($("span.icon.grcrt_filter")).hide();
      z(b);
      U(b, parseInt(N("grcrt_townsDD").getValue() || "0"), RepConvGRC.townsCommand);
    }
  }
  function z(b) {
    var e = JSON.parse(RepConv.requests.town_overviews.responseText).json.data.commands, k = [{name:RepConvTool.GetLabel("COMMAND.ALL"), value:0}], p = {};
    RepConv.Debug && console.log("refreshTownList");
    RepConvGRC.townsCommand = {};
    b.getJQElement().find($("span.icon.grcrt_filter")).hide();
    0 != parseInt(N("grcrt_townsDD").getValue()) && (b.getJQElement().find($("span.icon.grcrt_filter")).show(), RepConv.Debug && console.log(N("grcrt_townsDD").getOption("value", parseInt(N("grcrt_townsDD").getValue()))), b = N("grcrt_townsDD").getOption("value", parseInt(N("grcrt_townsDD").getValue())), p[b.value] = b);
    $.each(e, function(a, g) {
      a = {name:g.origin_town_name, value:g.origin_town_id};
      var u = {name:g.destination_town_name, value:g.destination_town_id};
      void 0 == RepConvGRC.townsCommand[a.value] && (RepConvGRC.townsCommand[a.value] = []);
      void 0 == RepConvGRC.townsCommand[u.value] && (RepConvGRC.townsCommand[u.value] = []);
      p[u.value] = u;
      p[a.value] = a;
      RepConvGRC.townsCommand[a.value].push(g);
      RepConvGRC.townsCommand[u.value].push(g);
    });
    $.each(p, function(a, g) {
      k.push(g);
    });
    N("grcrt_townsDD") && (N("grcrt_townsDD").setOptions(k), N("grcrt_towns") && N("grcrt_towns").setOptions(N("grcrt_townsDD").getOptions()));
  }
  function B(b, e) {
    N(b) || (RepConv.Debug && console.log("register: " + b), CM.register({main:"GRCRT", sub:b}, b, e));
    return N(b);
  }
  function Q(b) {
    N(b) && (RepConv.Debug && console.log("unregister: " + b), CM.unregister({main:"GRCRT", sub:b}, b));
  }
  function N(b) {
    RepConv.Debug && console.log("get: " + b);
    return CM.get({main:"GRCRT", sub:b}, b);
  }
  function U(b, e, k) {
    if (0 == e) {
      b.getJQElement().find($(".place_command")).removeClass("grcrt_command"), 0 == parseInt(N("grcrt_FR").getValue()) && $.each(k, function(p, a) {
        $.each(a, function(g, u) {
          u.return && b.getJQElement().find($("#command_" + u.id)).addClass("grcrt_command");
        });
      });
    } else {
      try {
        b.getJQElement().find($(".place_command")).addClass("grcrt_command"), $.each(k[e], function(p, a) {
          b.getJQElement().find($("#command_" + a.id)).addClass("grcrt_command");
          1 != parseInt(N("grcrt_FI").getValue()) || a.destination_town_id != e || a.return || b.getJQElement().find($("#command_" + a.id)).removeClass("grcrt_command");
          1 == parseInt(N("grcrt_FR").getValue()) && a.destination_town_id == e && a.return && b.getJQElement().find($("#command_" + a.id)).removeClass("grcrt_command");
          1 == parseInt(N("grcrt_FR").getValue()) && a.origin_town_id == e && a.return && b.getJQElement().find($("#command_" + a.id)).removeClass("grcrt_command");
          1 != parseInt(N("grcrt_FO").getValue()) || a.origin_town_id != e || a.return || b.getJQElement().find($("#command_" + a.id)).removeClass("grcrt_command");
        });
      } catch (p) {
      }
    }
  }
  function fa(b) {
    var e = b.getName();
    0 == b.getJQElement().find($("div.command_info #BTNCONV" + e)).length && (RepConvTool.AddBtn("BTNCONV", e).css({position:"absolute", bottom:"0px", right:"0px"}).click(function() {
      window.GRCRTConvWnd = new _GRCRTConverterCtrl(b);
    }).appendTo(b.getJQElement().find($("div.command_info"))), 0 < b.getJQElement().find($("div.command_info a.button")).length && b.getJQElement().find($("div.command_info #BTNCONV" + e)).css("right", "125px"), $.each(b.getJQElement().find($("#casted_power_reports a")), function(k, p) {
      k = $(p).attr("onclick").replace(/.*\(([0-9]*)\).*/, "$1");
      gpAjax.ajaxPost("report", "view", {id:k}, !0, {success:function(a, g, u, D) {
        $("#RepConvTMP").html(g.html);
        1 == $("#RepConvTMP").find($("#report_power_symbol.wisdom")).length && (a = $("#RepConvTMP").find($("#right_side")), b.getJQElement().find($("fieldset.command_info_units .index_unit")).hide(), b.getJQElement().find($("fieldset.command_info_units")).append($("<div/>", {"class":"grcrt_wisdom"}).append($("<div/>", {"class":"power_icon60x60 wisdom", style:"float:left"})).append(a)));
        $("#RepConvTMP").html(null);
      }});
    }));
  }
  function Z(b) {
    var e = b.getName();
    0 < b.getJQElement().find($("#conqueror_units_in_town")).length && 0 == b.getJQElement().find($("#conqueror_units_in_town #BTNCONV" + e)).length && RepConvTool.AddBtn("BTNCONV", e).click(function() {
      window.GRCRTConvWnd = new _GRCRTConverterCtrl(b);
    }).attr("style", "position: absolute; right: 0px; top: 0px;").appendTo(b.getJQElement().find($("#conqueror_units_in_town")));
    0 < b.getJQElement().find($("#unit_movements")).length && 0 == b.getJQElement().find($("#unit_movements #BTNCONV" + e)).length && RepConvTool.AddBtn("BTNCONV", e).click(function() {
      window.GRCRTConvWnd = new _GRCRTConverterCtrl(b);
    }).attr("style", "position: absolute; right: 20px; top: 0px;").appendTo(b.getJQElement().find($("#unit_movements")));
  }
  function Y(b) {
    var e = b.getName();
    "town_info_support" == b.getContext().sub && 0 == b.getJQElement().find($("div.support_details_box .game_border #BTNCONV" + e)).length && b.getJQElement().find($("div.support_details_box .game_border")).append(RepConvTool.AddBtn("BTNCONV", e).click(function() {
      window.GRCRTConvWnd = new _GRCRTConverterCtrl(b);
    }).css({position:"absolute", top:"-2px", right:"-2px"}));
  }
  function V(b) {
    var e = b.getName(), k = "#" + e;
    if (0 == b.getJQElement().find($(k + "RepConvStatsPlayer")).length && void 0 != $(b.getJQElement().find($("a.gp_player_link"))[0]).attr("href")) {
      var p = $(b.getJQElement().find($("a.gp_player_link"))[0]).attr("href").split(/#/), a = JSON.parse(atob(p[1] || p[0])).id, g = encodeURIComponent($(b.getJQElement().find($("a.gp_player_link"))[0]).html());
      p = $("<a/>", {href:"#n", id:e + "RepConvStatsPlayer", player_id:a, player_name:g}).html($("<img/>", {src:RepConv.Const.staticImg + "/stats.png"})).mousePopup(new MousePopup(RepConvTool.GetLabel("STATS.PLAYER")));
      "https:" == window.location.protocol && "potusek" != RepConv.active.statsGRCL ? $(p).attr({href:R("player", a, g), target:"_blank"}) : $(p).click(function() {
        T("player", $(this).attr("player_id"), $(this).attr("player_name"));
      });
      b.getJQElement().find($("a.color_table.assign_color")).parent().css("min-width", "100px").append(p);
    }
    0 == b.getJQElement().find($(k + "RepConvStatsAlly")).length && void 0 != b.getJQElement().find($("a.color_table.assign_ally_color")).parent().parent().children().eq(1).attr("onclick") && (a = b.getJQElement().find($("a.color_table.assign_ally_color")).parent().parent().children().eq(1).attr("onclick").replace(/.*,([0-9]*)\)/, "$1"), g = b.getJQElement().find($("a.color_table.assign_ally_color")).parent().parent().children().eq(1).html(), p = $("<a/>", {href:"#n", id:e + "RepConvStatsAlly", ally_id:a, 
    ally_name:g}).html($("<img/>", {src:RepConv.Const.staticImg + "/stats.png"})).mousePopup(new MousePopup(RepConvTool.GetLabel("STATS.ALLY"))), "https:" == window.location.protocol && "potusek" != RepConv.active.statsGRCL ? $(p).attr({href:R("alliance", a, g), target:"_blank"}) : $(p).click(function() {
      T("alliance", $(this).attr("ally_id"), $(this).attr("ally_name"));
    }), b.getJQElement().find($("a.color_table.assign_ally_color")).parent().css("min-width", "100px").append(p));
    if (0 == b.getJQElement().find($(k + "RepConvStatsTown")).length && 0 < b.getJQElement().find($(".town_bbcode_id")).length) {
      var u = b.getJQElement().find($(".town_bbcode_id")).attr("value").replace(/.*\]([0-9]*)\[.*/, "$1");
      p = $("<a/>", {href:"#n", id:e + "RepConvStatsTown", town_id:u, town_name:b.getTitle(), style:"position: absolute; top: 1px; right: 2px;"}).html($("<img/>", {src:RepConv.Const.staticImg + "/stats.png"})).mousePopup(new MousePopup(RepConvTool.GetLabel("STATS.TOWN")));
      "https:" == window.location.protocol && "potusek" != RepConv.active.statsGRCL ? $(p).attr({href:R("town", u, null), target:"_blank"}) : $(p).click(function() {
        T("town", $(this).attr("town_id"), $(this).attr("town_name"));
      });
      b.getJQElement().find($("div.game_header.bold")).append(p);
    }
    if (0 == b.getJQElement().find($(k + "RepConvRadarPlayer")).length && 0 < b.getJQElement().find($(".town_bbcode_id")).length) {
      k = b.getJQElement().find($(".info_jump_to_town")).attr("onclick");
      p = /\w+:\d+/g;
      u = {};
      for (u.name = b.getTitle(); a = p.exec(k);) {
        u[a[0].split(":")[0]] = a[0].split(":")[1];
      }
      b.getJQElement().find($('[id*="RepConvStatsTown"]')).before($("<a/>", {href:"#n", id:e + "RepConvRadarPlayer", town_id:u.id, style:"position: absolute; top: 1px; right: 30px;"}).html($("<img/>", {class:"grcrt radar", src:RepConv.grcrt_domain + "/ui/layout_3.3.0.png", style:"object-position: -77px -80px; width: 30px;"})).mousePopup(new MousePopup(RepConvTool.GetLabel("RADAR.TOWNFINDER"))).click(function() {
        GRCRT_Radar.windowOpen({town:{id:u.id, name:u.name, ix:u.x, iy:u.y}});
      }));
    }
    RepConv.settings[RepConv.Cookie + "_idle"] && 0 == b.getJQElement().find($(".grcrt_idle")).length && 0 != b.getJQElement().find($(".gp_player_link")).length && ($("<div/>", {"class":"grcrt_idle"}).insertBefore(b.getJQElement().find($("li:not(.reservation_tool)")).find($(".gp_player_link"))), Ea(b));
  }
  function T(b, e, k) {
    $("<div/>", {id:"RepConvNode"});
    "potusek" == RepConv.active.statsGRCL && WF.open("grcrt_stats", {args:{what:b, id:e, name:k}});
  }
  function R(b, e, k) {
    "grepointel" == RepConv.active.statsGRCL ? ("player" == b ? b = "pn" : "alliance" == b && (b = "an"), b = "http://grepointel.com/track.php?server=" + Game.world_id + "&" + b + "=" + k + "&rt=overview") : b = RepConv.Scripts_url + Game.locale_lang + "/" + b + "/" + Game.world_id + "/" + e;
    return b;
  }
  function X(b) {
    "town_info_trading" != b.getContext().sub && "wonders_index" != b.getContext().sub || 0 != b.getJQElement().find($(".amounts .curr4")).length || b.getJQElement().find($(".amounts .curr3")).after($("<span/>", {"class":"curr4"})).bind("DOMSubtreeModified", function() {
      var e = $(this).parent();
      0 < $(e).find($(".curr3")).text().length || 0 < $(e).find($(".curr2")).text().length ? $(e).find($(".curr4")).html(" = " + eval($(e).find($(".curr")).text() + $(e).find($(".curr2")).text() + $(e).find($(".curr3")).text())) : $(e).find($(".curr4")).html("");
    });
    $.each(b.getJQElement().find($(".amounts .curr4")), function(e, k) {
      e = $(k).parent();
      0 < $(e).find($(".curr3")).text().length || 0 < $(e).find($(".curr2")).text().length ? $(e).find($(".curr4")).html(" = " + eval($(e).find($(".curr")).text() + $(e).find($(".curr2")).text() + $(e).find($(".curr3")).text())) : $(e).find($(".curr4")).html("");
    });
  }
  function aa(b) {
    if (RepConv.active.power) {
      switch(b.getContext().sub) {
        case "town_info_god":
        case "command_info_god":
          b.getJQElement().find($(".choose_power.disabled")).css("opacity", "0.4").attr("href", null).attr("onclick", null), RepConv.Debug && console.log("loadPower"), $.each(b.getJQElement().find($(".js-power-icon div[name=counter]")), function(e, k) {
            $(k).remove();
          }), $.each(b.getJQElement().find($(".js-power-icon.disabled")), function(e, k) {
            e = GameData.powers[$(k).attr("data-power_id")];
            var p = MM.checkAndPublishRawModel("PlayerGods", {id:Game.player_id}).getCurrentProductionOverview()[e.god_id];
            if (0 == b.getJQElement().find($(".js-god-box.disabled." + e.god_id)).length && 0 < p.production) {
              var a = MM.checkAndPublishRawModel("PlayerGods", {id:Game.player_id})[e.god_id + "_favor_delta_property"].calculateCurrentValue().unprocessedCurrentValue;
              $(k).append($("<div/>", {style:"margin-top:32px;color:white;text-shadow: 1px 1px 1px black;font-size:10px;z-index:3000;font-weight: bold;", name:"counter"}).countdown(Timestamp.server() + (e.favor - a) / p.production * 3600));
            }
          });
      }
    }
  }
  function ia(b) {
    var e = $("#window_" + b.getIdentifier()).find("div.window_content");
    0 == e.find($("#BTNCONV" + b.getIdentifier())).length && e.append(RepConvTool.AddBtn("BTNCONV", b.getIdentifier()).click(function() {
      RepConv.Debug && console.log(b.getType() + " [id:" + b.getIdentifier() + "]");
      window.GRCRTConvWnd = new _GRCRTConverterCtrl(b);
    }).css({position:"absolute", bottom:"15px", right:"15px"}));
  }
  function la() {
    if (RepConv.settings[RepConv.Cookie + "_town_popup"]) {
      var b = {}, e = MM.checkAndPublishRawModel("Player", {id:Game.player_id}).getAllianceName();
      $.each(ITowns.towns, function(k, p) {
        p.points = p.getPoints();
        p.player_name = Game.player_name;
        p.alliance_name = e;
        p.tooltip = new MousePopup(WMap.createTownTooltip("town", p));
        b[k] = p;
      });
      $.each($("#town_groups_list .item.town_group_town:not(.grcrtPopup)"), function(k, p) {
        k = b[$(p).data("townid")];
        $(p).find($(".town_name")).mousePopup(k.tooltip);
        $(p).addClass("grcrtPopup");
      });
    }
  }
  function da(b, e) {
    var k = $("<div/>", {"class":"gpwindow_content", style:"overflow-y:auto !important; max-height: 185px; min-height: 120px;"}), p = $("<ul/>", {"class":"menu_inner grcrt_menu_inner", style:"padding: 0px;left:0px;"}), a = $("<div/>", {id:"emots_popup_" + b, style:"display:none; z-index: 5000; min-height: 180px;max-height: 265px;", "class":"grcrtbb"}).append($("<div/>", {"class":"menu_wrapper", style:"left: -10px;"}).append(p)).append($("<div/>", {"class":"gpwindow_left"})).append($("<div/>", {"class":"gpwindow_right"})).append($("<div/>", 
    {"class":"gpwindow_bottom"}).append($("<div/>", {"class":"gpwindow_left corner"})).append($("<div/>", {"class":"gpwindow_right corner"}))).append($("<div/>", {"class":"gpwindow_top"}).append($("<div/>", {"class":"gpwindow_left corner"})).append($("<div/>", {"class":"gpwindow_right corner"}))).append(k).css({position:"absolute", top:"22px", left:"455px", width:"300px"}), g = $("<div/>"), u = !0;
    $.each(RepConvAdds.emotsLists, function(D, G) {
      p.append($("<li/>", {style:"float: left;padding: 0px;"}).append($("<a/>", {"class":"grcrt_emots submenu_link" + (u ? " active" : ""), href:"#n", "data-group":D}).append($("<span/>", {"class":"left"}).append($("<span/>", {"class":"right"}).append($("<span/>", {"class":"middle"}).html($("<img/>", {src:RepConv.grcrt_cdn + G.img}))))).click(function() {
        if (!$(this).hasClass("active")) {
          var K = $(this).data("group");
          $("#emots_popup_" + b + " a.submenu_link").removeClass("active");
          $("#emots_popup_" + b + " div.grcrt_emots_detail").hide();
          $(this).addClass("active");
          $("#emots_popup_" + b + " div.grcrt_emots_detail.e" + K).show();
        }
      })));
      var M = $("<div/>", {"class":"grcrt_emots_detail e" + D, style:"display:" + (u ? "block" : "none")});
      $.each(G.detail, function(K, ba) {
        M.append($("<img/>", {src:("usersaved" != D ? RepConv.grcrt_cdn : "") + ba.img, style:"cursor: pointer;"}).click(e));
      });
      g.append(M);
      u = !1;
    });
    k.append(g);
    return a;
  }
  function W(b, e, k) {
    0 == b.getJQElement().find("#emots_popup_" + b.type).length && (b.getJQElement().find($(".bb_button_wrapper")).append(da(b.type, function() {
      RepConvTool.insertBBcode("[img]" + $(this).attr("src") + "[/img]", "", b.getJQElement().find(k)[0]);
      b.getJQElement().find($("#emots_popup_" + b.type)).toggle();
    })), b.getJQElement().find($(".bb_button_wrapper")).append($("<div/>", {id:"reports_popup_" + b.getType(), "class":"grcrtbb_reports grcrtbb", style:"display:none; z-index: 5000;"}).append($("<div/>", {"class":"bbcode_box middle_center"}).append($("<div/>", {"class":"bbcode_box top_left"})).append($("<div/>", {"class":"bbcode_box top_right"})).append($("<div/>", {"class":"bbcode_box top_center"})).append($("<div/>", {"class":"bbcode_box bottom_center"})).append($("<div/>", {"class":"bbcode_box bottom_right"})).append($("<div/>", 
    {"class":"bbcode_box bottom_left"})).append($("<div/>", {"class":"bbcode_box middle_left"})).append($("<div/>", {"class":"bbcode_box middle_right"})).append($("<div/>", {"class":"bbcode_box content clearfix", style:"overflow-y:auto !important; max-height: 185px;"}).append($("<ul/>")))).css({position:"absolute", top:"27px", left:"525px", width:"120px"})), $.each(RepConv.__repconvValueArray, function(p, a) {
      b.getJQElement().find("#reports_popup_" + b.getType() + " .content ul").append($("<li/>").append($("<a/>", {href:"#n"}).html("\u00bb " + DM.getl10n("COMMON", "window_goto_page").page + " " + (p + 1) + "/" + Object.size(RepConv.__repconvValueArray)).click(function() {
        RepConvTool.insertBBcode(Ma(p) + RepConv.__repconvValueArray[p], "", b.getJQElement().find(k)[0]);
        b.getJQElement().find($(".grcrtbb")).hide();
      })));
    }), b.getJQElement().find(e).append($("<img/>", {src:RepConv.Scripts_url + "emots/usmiech.gif", style:"cursor: pointer;"}).click(function() {
      b.getJQElement().find($('.bb_button_wrapper>div[class^="bb"]')).remove();
      b.getJQElement().find($(".grcrtbb")).hide();
      b.getJQElement().find($("#emots_popup_" + b.type)).toggle();
    }).mousePopup(new MousePopup(RepConvTool.GetLabel("POPINSERTEMOT")))), b.getJQElement().find(e).append($("<img/>", {src:RepConv.Const.uiImg + "paste_report.png", style:"cursor: pointer;"}).click(function() {
      b.getJQElement().find($('.bb_button_wrapper>div[class^="bb"]')).remove();
      b.getJQElement().find($(".grcrtbb")).hide();
      switch(Object.size(RepConv.__repconvValueArray)) {
        case 0:
          break;
        case 1:
          RepConvTool.insertBBcode(Ma(0) + RepConv.__repconvValueArray[0], "", b.getJQElement().find($(k))[0]);
          break;
        default:
          b.getJQElement().find($("#reports_popup_" + b.getType())).toggle();
      }
    }).mousePopup(new MousePopup(RepConvTool.GetLabel("POPINSERTLASTREPORT")))));
  }
  function qa(b) {
    $("#window_" + b.getIdentifier()).unbind("DOMSubtreeModified").bind("DOMSubtreeModified", function() {
      var e = $("#window_" + b.getIdentifier()).find($("div.bb_button_wrapper")), k = $("#window_" + b.getIdentifier()).find($("div.notes_container"));
      0 < e.length && 0 == $("#window_" + b.getIdentifier()).find($("div.notes_container #emots_popup_" + b.getType())).length && ($("#window_" + b.getIdentifier()).unbind("DOMSubtreeModified"), $(e).find($(".bbcode_option")).bind("click", function() {
        $(e).find($("#emots_popup_" + b.getType())).hide();
        $(e).find($("#reports_popup_" + b.getType())).hide();
      }), $(e).append(da(b.getType(), function() {
        RepConvTool.insertBBcode("[img]" + $(this).attr("src") + "[/img]", "", $(k).find($("textarea"))[0]);
        $(k).find($("textarea")).keyup();
        $(e).find($("#emots_popup_" + b.getType())).toggle();
      })), $(e).append($("<div/>", {id:"reports_popup_" + b.getType(), "class":"grcrtbb_reports grcrtbb", style:"display:none; z-index: 5000;"}).append($("<div/>", {"class":"bbcode_box middle_center"}).append($("<div/>", {"class":"bbcode_box top_left"})).append($("<div/>", {"class":"bbcode_box top_right"})).append($("<div/>", {"class":"bbcode_box top_center"})).append($("<div/>", {"class":"bbcode_box bottom_center"})).append($("<div/>", {"class":"bbcode_box bottom_right"})).append($("<div/>", {"class":"bbcode_box bottom_left"})).append($("<div/>", 
      {"class":"bbcode_box middle_left"})).append($("<div/>", {"class":"bbcode_box middle_right"})).append($("<div/>", {"class":"bbcode_box content clearfix", style:"overflow-y:auto !important; max-height: 185px;"}).append($("<ul/>")))).css({position:"absolute", top:"27px", left:"525px", width:"120px"})), $.each(RepConv.__repconvValueArray, function(p, a) {
        $(e).find("#reports_popup_" + b.getType() + " .content ul").append($("<li/>").append($("<a/>", {href:"#n"}).html("\u00bb " + DM.getl10n("COMMON", "window_goto_page").page + " " + (p + 1) + "/" + Object.size(RepConv.__repconvValueArray)).click(function() {
          RepConvTool.insertBBcode(Ma(p) + RepConv.__repconvValueArray[p], "", $(k).find($("textarea"))[0]);
          $(k).find($("textarea")).keyup();
          $(e).find($(".grcrtbb_reports")).hide();
        })));
      }), $(e).append($("<img/>", {src:RepConv.Scripts_url + "emots/usmiech.gif", style:"cursor: pointer;"}).click(function() {
        $(e).find($('.bb_button_wrapper>div[class^="bb"]')).remove();
        $(e).find($(".grcrtbb_reports")).hide();
        $(e).find($("#emots_popup_" + b.getType())).toggle();
      })).append($("<img/>", {src:RepConv.Const.uiImg + "paste_report.png", style:"cursor: pointer;"}).click(function() {
        $(e).find($('.bb_button_wrapper>div[class^="bb"]')).remove();
        $(e).find($(".grcrtbb_emots")).hide();
        switch(Object.size(RepConv.__repconvValueArray)) {
          case 0:
            break;
          case 1:
            RepConvTool.insertBBcode(Ma(0) + RepConv.__repconvValueArray[0], "", $(k).find($("textarea"))[0]);
            $(k).find($("textarea")).keyup();
            break;
          default:
            $(e).find($("#reports_popup_" + b.getType())).toggle();
        }
      }).mousePopup(new MousePopup(RepConvTool.GetLabel("POPINSERTLASTREPORT")))), qa(b));
    });
  }
  function za(b) {
    $("#window_" + b.getIdentifier()).ready(function() {
      0 == $("#window_" + b.getIdentifier()).find($("#BTNCONV" + b.getIdentifier())).length && RepConvTool.AddBtn("BTNCONV", b.getIdentifier()).click(function() {
        window.GRCRTConvWnd = new _GRCRTConverterCtrl(b);
      }).css({top:"56px", right:"40px"}).insertBefore($("#window_" + b.getIdentifier()).find(".temple_image_wrapper"));
    });
  }
  function Ma(b) {
    return null != RepConv.__repconvHtmlArray && void 0 != RepConv.__repconvHtmlArray ? "[url=https://www.grcrt.net/repview.php?rep=" + $.ajax({url:"https://www.grcrt.net/repsave.php", method:"post", data:{html:RepConv.__repconvHtmlArray[b]}, cache:!1, async:!1}).responseJSON.filename + "]" + RepConvTool.GetLabel("MOBILEVERSION") + "[/url]\n\n" : "";
  }
  function Ka(b) {
    if (RepConv.active.power) {
      var e = GameData.powers[b];
      setTimeout(function() {
        try {
          var k = MM.checkAndPublishRawModel("PlayerGods", {id:Game.player_id}).getCurrentProductionOverview()[e.god_id], p = MM.checkAndPublishRawModel("PlayerGods", {id:Game.player_id})[e.god_id + "_favor_delta_property"].calculateCurrentValue().unprocessedCurrentValue, a = Timestamp.server() + (e.favor - p) / k.production * 3600;
          $("#popup_content div#grcrt_pop_ads").remove();
          0 < e.favor - k.current && 0 < k.production && $("#popup_content div.temple_power_popup").append($("<div/>", {name:"counter", id:"grcrt_pop_ads"}).css({margin:"70px 10px 0 0", "float":"right", "text-shadow":"2px 2px 2px white", color:"black", "font-weight":"bold", position:"absolute", top:"20px", right:"270px"}).countdown(a));
        } catch (g) {
        }
      }, 100);
    }
  }
  function Na() {
    if (RepConv.settings[RepConv.Cookie + "_idle"] && 10 > jb) {
      if (!RepConvGRC.idle || RepConvGRC.idle.time + 30 < Timestamp.server()) {
        RepConv.Debug && console.log("getIdleData - fetch"), $.ajax({url:"https://www.grcrt.net/json.php", method:"get", data:{method:"getIdleJSON", world:Game.world_id}, cache:!0}).done(function(b) {
          jb = 0;
          RepConvGRC.idle = b;
          RepConvGRC.idle.time = Timestamp.server();
        }).fail(function() {
          jb++;
        });
      }
      RepConv.Debug && console.log("getIdleData");
    }
  }
  function Ea(b) {
    $.each(b.getJQElement().find($(".grcrt_idle")), function(e, k) {
      e = ("player_get_profile_html" == b.getContext().sub ? btoa(JSON.stringify({id:b.getOptions().player_id})) : $(k).nextAll(".gp_player_link").attr("href")).split(/#/);
      e = b.getType() == Layout.wnd.TYPE_PLAYER_PROFILE_EDIT ? Game.player_id : "player_get_profile_html" == b.getContext().sub ? JSON.parse(unescape(RepConv.requests.player.url).match(/({.*})/)[0]).player_id : JSON.parse(atob(e[1] || e[0])).id;
      e = parseFloat(RepConvGRC.idle.JSON[e] || "-1");
      $(k).addClass("grcrt_idle_days");
      $(k).addClass("grcrt_idle_dg");
      $(k).html(0 > parseInt(e) ? "?" : parseInt(e));
      $(k).mousePopup(new MousePopup("<b>" + RepConvTool.GetLabel("STATS.INACTIVE") + ": </b>" + (0 > parseInt(e) ? "???" : hours_minutes_seconds(3600 * parseInt(24 * e)) || "0") + '<br/><div style="font-size:75%">' + RepConvTool.GetLabel("STATS.INACTIVEDESC") + "</div>"));
      7 <= e ? $(k).toggleClass("grcrt_idle_dg grcrt_idle_dr") : 2 <= e && $(k).toggleClass("grcrt_idle_dg grcrt_idle_dy");
    });
  }
  function ma(b) {
    var e = {}, k;
    RepConv.settings[RepConv.Cookie + "_mcol"] && (e[Game.alliance_id] = "OWN_ALLIANCE", $.each(MM.getOnlyCollectionByName("AlliancePact").models, function(p, a) {
      if (!a.getInvitationPending()) {
        switch(a.getRelation()) {
          case "war":
            k = "ENEMY";
            break;
          case "peace":
            k = "PACT";
        }
        e[a.getAlliance1Id() == Game.alliance_id ? a.getAlliance2Id() : a.getAlliance1Id()] = k;
      }
    }), $.each(b.getJQElement().find($("a.gp_player_link")), function(p, a) {
      if (p = $(a).attr("href")) {
        if (p = RepConvTool.getPlayerColor(p, e)) {
          p = ["background: " + RepConvTool.hexToRGB("#" + p, 0.4), "background: -webkit-linear-gradient(left," + RepConvTool.hexToRGB("#" + p, 0.1) + "," + RepConvTool.hexToRGB("#" + p, 0.5) + ")", "background: -o-linear-gradient(right," + RepConvTool.hexToRGB("#" + p, 0.1) + "," + RepConvTool.hexToRGB("#" + p, 0.5) + ")", "background: -moz-linear-gradient(right," + RepConvTool.hexToRGB("#" + p, 0.1) + "," + RepConvTool.hexToRGB("#" + p, 0.5) + ")", "background: linear-gradient(to right," + RepConvTool.hexToRGB("#" + 
          p, 0.1) + "," + RepConvTool.hexToRGB("#" + p, 0.5) + ")"].join(";"), $(a).closest("li.message_item").attr("style", p);
        }
      }
    }));
  }
  function Fa(b) {
    var e = {}, k;
    RepConv.settings[RepConv.Cookie + "_mcol"] && (e[Game.alliance_id] = "OWN_ALLIANCE", $.each(MM.getOnlyCollectionByName("AlliancePact").models, function(p, a) {
      if (!a.getInvitationPending()) {
        switch(a.getRelation()) {
          case "war":
            k = "ENEMY";
            break;
          case "peace":
            k = "PACT";
        }
        e[a.getAlliance1Id() == Game.alliance_id ? a.getAlliance2Id() : a.getAlliance1Id()] = k;
      }
    }), $.each(b.getJQElement().find($(".message_poster a.gp_player_link")), function(p, a) {
      if (p = $(a).attr("href")) {
        if (p = RepConvTool.getPlayerColor(p, e)) {
          p = ["background: " + RepConvTool.hexToRGB("#" + p, 0.4), "background: -webkit-linear-gradient(left," + RepConvTool.hexToRGB("#" + p, 0.1) + "," + RepConvTool.hexToRGB("#" + p, 0.5) + ")", "background: -o-linear-gradient(right," + RepConvTool.hexToRGB("#" + p, 0.1) + "," + RepConvTool.hexToRGB("#" + p, 0.5) + ")", "background: -moz-linear-gradient(right," + RepConvTool.hexToRGB("#" + p, 0.1) + "," + RepConvTool.hexToRGB("#" + p, 0.5) + ")", "background: linear-gradient(to right," + RepConvTool.hexToRGB("#" + 
          p, 0.1) + "," + RepConvTool.hexToRGB("#" + p, 0.5) + ")"].join(";"), $(a).closest(".message_poster").attr("style", p);
        }
      }
    }));
  }
  function ea(b) {
    b = b.split(/:/);
    return 3600 * Number(b[0]) + 60 * Number(b[1]) + Number(b[2]);
  }
  function db() {
    var b = null;
    $.each(decodeURIComponent(RepConv.requests.wonders.url).split(/&/), function(e, k) {
      -1 < k.indexOf("json=") && (b = JSON.parse(k.split("json=")[1]));
    });
    return b;
  }
  function eb() {
    var b = null, e = db(), k = JSON.parse(RepConv.requests.wonders.responseText).json.data;
    $.each(k.all_wonders, function(p, a) {
      if (a.island_x == e.island_x && a.island_y == e.island_y) {
        b = a;
        a = k.stage_started_at;
        var g = k.stage_started_at + ea(wa[b.expansion_stage].total);
        p = k.stage_completed_at;
        a = (g - a) / ea(wa[b.expansion_stage].reduc) / 2;
        g = (g - p) / ea(wa[b.expansion_stage].reduc);
        p = (p - k.today) / ea(wa[b.expansion_stage].reduc);
        b.shot_max = Math.min(Math.ceil(p), Math.floor(a - g));
      }
    });
    return b;
  }
  function Va(b) {
    try {
      if (0 < b.getJQElement().find($(".send_res>.single-progressbar.time-indicator")).length) {
        var e = eb(), k = 0;
        $.each(MM.checkAndPublishRawModel("PlayerGods", {id:Game.player_id}).getCurrentProductionOverview(), function(a, g) {
          k = Math.max(k, (400 - g.current) / g.production * 3600);
        });
        b.getJQElement().find($(".wonder_res_container>.trade>.send_res>.grcrt_shot")).remove();
        b.getJQElement().find($(".wonder_res_container>.trade>.send_res")).append($("<div/>", {"class":"grcrt_shot", style:"position: absolute; right: 110px; top: 165px;"}).append($("<div/>", {"class":"gods_favor_button_area", style:"left:0px; top:0px;"}).append($("<div/>", {"class":"gods_favor_amount ui-game-selectable"}).html(e.shot_max)).append($("<div/>", {"class":"btn_gods_spells circle_button spells", style:"top: 2px; left: 4px; position: absolute;"}).append($("<div/>", {"class":"icon js-caption"}))).mousePopup(new MousePopup(RepConvTool.GetLabel("POPWONDERSHOT")))));
        var p = b.getJQElement().find($(".wonder_res_container>.trade>.send_res .button.inactive .middle"));
        CM.unregister({main:b.getContext().main, sub:"casted_powers"}, "grcrt_countdown");
        0 < k && CM.register({main:b.getContext().main, sub:"casted_powers"}, "grcrt_countdown", p.countdown2({value:k, display:"readable_seconds_with_days"}).on("cd:finish", function() {
          setTimeout(function() {
            b.reloadContent();
          }, 100);
        }));
      }
    } catch (a) {
    }
  }
  function Ya(b) {
    0 == b.getJQElement().find($("#BTNCOMPARE")).length && b.getJQElement().find($(".game_inner_box .game_header")).append(RepConvTool.AddBtn("BTNCOMPARE").attr("id", "BTNCOMPARE").css({margin:"0px", position:"absolute", top:"0px", right:"1px"}).click(function() {
      var e = {leftAlly:[Game.alliance_id], rightAlly:[]}, k;
      $.each(MM.getOnlyCollectionByName("AlliancePact").models, function(p, a) {
        if (!a.getInvitationPending()) {
          switch(a.getRelation()) {
            case "war":
              k = "rightAlly";
              break;
            case "peace":
              k = "leftAlly";
          }
          e[k].push(a.getAlliance1Id() == Game.alliance_id ? a.getAlliance2Id() : a.getAlliance1Id());
        }
      });
      WF.open("grcrt_analysis", {args:{website:RepConv.grcrt_domain + "ajax.php?modul=analysis&action=ally-compare-game&world=" + Game.world_id + "&allyLeft=" + e.leftAlly.toString() + "&allyRight=" + e.rightAlly.toString(), title:"ALLYCOMPARETITLE"}});
    }));
  }
  function hb() {
    "object" != typeof YT || "function" != typeof YT.Player ? setTimeout(function() {
      hb();
    }, 100) : (Oa = new YT.Player("grcrtVideoContainer", {height:"39", width:"64"}), Ua = new YT.Player("grcrtVideoContainerTest", {height:"39", width:"64"}));
  }
  function Ra(b) {
    if (!RepConv.active.sounds.mute) {
      RepConv.Debug && console.log("attackIncoming _ai=" + b);
      if (b > RepConv.active.attack_count && "none" == $("#grcrtSound").css("display")) {
        RepConv.audio = {};
        var e = $("<audio/>", {preload:"auto"}), k = $("<audio/>", {preload:"auto"}).append($("<source/>", {src:RepConv.Const.defMuteM + ".mp3"})).append($("<source/>", {src:RepConv.Const.defMuteM + ".ogg"}));
        va = null;
        "" != RepConv.active.sounds.url ? (va = -1 < RepConv.active.sounds.url.indexOf("youtube") && RepConv.active.sounds.url.replace(/.*v=(.[^&]*)/, "$1") || -1 < RepConv.active.sounds.url.indexOf("youtu.be") && RepConv.active.sounds.url.replace(/.*youtu.be\/(.[^?]*)/, "$1"), $(e).append($("<source/>", {src:RepConv.active.sounds.url}))) : $(e).append($("<source/>", {src:RepConv.Const.defAlarmM + ".mp3"})).append($("<source/>", {src:RepConv.Const.defAlarmM + ".ogg"}));
        RepConv.audio.mute = k.get(0);
        null != va && va ? (RepConv.Debug && console.log("\u0142aduje " + va), Za()) : ($("#grcrtSound").show(), RepConv.audio.alarm = e.get(0), RepConv.audio.alarm.loop = RepConv.active.sounds.loop, RepConv.audio.alarm.volume = RepConv.active.sounds.volume / 100, RepConv.audio.alarm.addEventListener("ended", function() {
          $("#grcrtSound").hide();
        }), RepConv.audio.alarm.play());
        DM.getl10n("layout", "toolbar_activities");
        require("helpers/commands").getTotalCountOfIncomingAttacks();
      }
      0 == b && "none" != $("#grcrtSound").css("display") && -1 < RepConv.active.attack_count && (null != va && va ? Oa.stopVideo() : (RepConv.audio.alarm.pause(), RepConv.audio.alarm.currentTime = 0), $("#grcrtSound").hide());
      RepConv.active.attack_count = b;
    }
  }
  function Za() {
    "object" != typeof Oa || "function" != typeof Oa.loadVideoById ? setTimeout(function() {
      Za();
    }, 500) : ($("#grcrtSound").show(300), Oa.loadVideoById({videoId:va, loop:1, events:{onError:onGrcrtYTPlayerError, onStateChange:onGrcrtYTPlayerStateChange, onReady:onGrcrtYTPlayerReady}}).setVolume(RepConv.active.sounds.volume));
  }
  function ib() {
    if (uw.layout_main_controller && uw.layout_main_controller.sub_controllers) {
      GameEvents.grcrt = GameEvents.grcrt || {};
      GameEvents.grcrt.townGroupsList = "grcrt:townGroupsList";
      var b = DM.getTemplate("COMMON", "town_groups_list");
      v = {COMMON:{town_groups_list:b + '<script type="text/javascript">;\n$.Observer(GameEvents.grcrt.townGroupsList).publish({townId:1});\n\x3c/script>'}};
      DM.loadData({templates:v});
      $.Observer(GameEvents.grcrt.townGroupsList).subscribe("GameEvents.grcrt.townGroupsList", function(e, k) {
        la();
      });
      $.each(uw.layout_main_controller.sub_controllers, function(e, k) {
        "town_name_area" == k.name && (k.controller.templates.town_groups_list = DM.getTemplate("COMMON", "town_groups_list"));
      });
    } else {
      setTimeout(function() {
        ib();
      }, 500);
    }
  }
  function lb() {
    if (uw.layout_main_controller && uw.layout_main_controller.sub_controllers) {
      GameEvents.grcrt = GameEvents.grcrt || {};
      GameEvents.grcrt.construction_queue = "grcrt:construction_queue";
      var b = DM.getTemplate("COMMON", "construction_queue");
      b.queue_instant_buy += '<script type="text/javascript">;\n$.Observer(GameEvents.grcrt.construction_queue).publish();\n\x3c/script>';
      DM.loadData({templates:{COMMON:{construction_queue:b}}});
      $.Observer(GameEvents.grcrt.construction_queue).subscribe("GRCRT_GRC_grcrt_construction_queue", function(e, k) {
        m();
      });
      $.each(uw.layout_main_controller.sub_controllers, function(e, k) {
        "construction_queue_container" == k.name && (k.controller.templates.town_groups_list = DM.getTemplate("COMMON", "construction_queue"));
      });
      m();
    } else {
      setTimeout(function() {
        lb();
      }, 500);
    }
  }
  function Ta() {
    0 == $("div.activity.attack_indicator div.count").length ? (setTimeout(function() {
      Ta();
    }, 100), RepConv.Debug && console.log(".")) : (new window.MutationObserver(function(b) {
      b.forEach(function(e) {
        RepConv.Debug && console.log("MutationObserver");
        $("div.activity.attack_indicator").hasClass("active") ? Ra(parseInt($("div.activity.attack_indicator div.count").html())) : Ra(0);
      });
    })).observe(document.querySelector("div.activity.attack_indicator"), {attributes:!0, childList:!0, characterData:!0});
  }
  function ab() {
    require("game/windows/ids").GRCRT_STATS = "grcrt_stats";
    (function() {
      var b = window.GameControllers.TabController.extend({render:function() {
        var e = this.getWindowModel().getArguments(), k = RepConv.grcrt_domain + Game.locale_lang + "/light/" + e.what + "/" + Game.world_id + "/" + e.id, p = this.getWindowModel().getIdentifier();
        this.getWindowModel().showLoading();
        this.getWindowModel().setTitle(RepConv.grcrt_window_icon + RepConvTool.GetLabel("STATS." + ("ALLIANCE" == e.what.toUpperCase() ? "ALLY" : e.what.toUpperCase())) + " - " + e.name);
        this.$el.html($("<div/>").append($("<iframe/>", {src:k, style:"width: 995px; height: 625px; border: 0px", }).bind("load", function() {
          $.each(WM.getWindowByType("grcrt_stats"), function(a, g) {
            g.getIdentifier() == p && g.hideLoading();
          });
        })));
      }});
      window.GameViews.GrcRTView_grcrt_stats = b;
    })();
    (function() {
      var b = window.GameViews, e = window.WindowFactorySettings, k = require("game/windows/ids"), p = require("game/windows/tabs"), a = k.GRCRT_STATS;
      e[a] = function(g) {
        g = g || {};
        return us.extend({window_type:a, minheight:660, maxheight:680, width:1010, tabs:[{type:p.INDEX, title:RepConvTool.GetLabel("HELPTAB1"), content_view_constructor:b.GrcRTView_grcrt_stats, hidden:!0}], max_instances:5, activepagenr:0, minimizable:!0, resizable:!1, title:RepConv.grcrt_window_icon + RepConv.Scripts_nameS + "  ver." + RepConv.Scripts_version}, g);
      };
    })();
  }
  function Wa() {
    require("game/windows/ids").GRCRT_ANALYSIS = "grcrt_analysis";
    (function() {
      var b = window.GameControllers.TabController.extend({render:function() {
        var e = this.getWindowModel().getArguments(), k = e.website, p = this.getWindowModel().getIdentifier();
        this.getWindowModel().showLoading();
        this.getWindowModel().setTitle(RepConv.grcrt_window_icon + RepConvTool.GetLabel(e.title));
        this.$el.html($("<div/>").append($("<iframe/>", {src:k, style:"width: 995px; height: 625px; border: 0px", }).bind("load", function() {
          $.each(WM.getWindowByType("grcrt_analysis"), function(a, g) {
            g.getIdentifier() == p && g.hideLoading();
          });
        })));
      }});
      window.GameViews.GrcRTView_grcrt_analysis = b;
    })();
    (function() {
      var b = window.GameViews, e = window.WindowFactorySettings, k = require("game/windows/ids"), p = require("game/windows/tabs"), a = k.GRCRT_ANALYSIS;
      e[a] = function(g) {
        g = g || {};
        return us.extend({window_type:a, minheight:660, maxheight:680, width:1010, tabs:[{type:p.INDEX, title:RepConvTool.GetLabel("HELPTAB1"), content_view_constructor:b.GrcRTView_grcrt_analysis, hidden:!0}], max_instances:5, activepagenr:0, minimizable:!0, resizable:!1, title:RepConv.grcrt_window_icon + RepConv.Scripts_nameS + "  ver." + RepConv.Scripts_version}, g);
      };
    })();
  }
  function bb() {
    require("game/windows/ids").GRCRT = "grcrt";
    (function() {
      var b = window.GameControllers.TabController.extend({render:function() {
        this.getWindowModel().showLoading();
        this.$el.html($("<div/>").append($("<iframe/>", {src:this.whatLoading(), style:"width: 815px; height: 430px; border: 0px; float: left;", }).bind("load", function() {
          WM.getWindowByType("grcrt")[0].hideLoading();
        })));
      }, whatLoading:function() {
        var e = this.getWindowModel().getArguments(), k = RepConv.getUrlForWebsite(this.getWindowModel().getActivePage().getType());
        null != e && this.getWindowModel().getActivePage().getType() == e.page && (e = e.hash, this.getWindowModel().setArguments(null), k = RepConv.getUrlForWebsite(this.getWindowModel().getActivePage().getType(), e));
        return k;
      }});
      window.GameViews.GrcRTViewEx_grcrt = b;
    })();
    (function() {
      var b = window.GameControllers.TabController.extend({render:function() {
        this.$el.html(RepConvGRC.settings());
        this.getWindowModel().hideLoading();
        this.unregisterComponent("grcrt_settings_scrollbar");
        this.registerComponent("grcrt_settings_scrollbar", this.$el.find(".js-scrollbar-viewport").skinableScrollbar({orientation:"vertical", template:"tpl_skinable_scrollbar", skin:"narrow", disabled:!1, elements_to_scroll:this.$el.find(".js-scrollbar-content"), element_viewport:this.$el.find(".js-scrollbar-viewport"), scroll_position:0, min_slider_size:16}));
      }, registerViewComponents:function() {
        RepConv.Debug && console.log("registerViewComponents");
      }, unregisterViewComponents:function() {
        RepConv.Debug && console.log("unregisterViewComponents");
        this.unregisterComponent("grcrt_settings_scrollbar");
      }, destroy:function() {
        RepConv.Debug && console.log("destroy");
        this.unregisterViewComponents();
        this.unregisterListeners();
      }, registerComponent:function(e, k, p) {
        p = {main:this.getWindowModel().getType(), sub:p || this.getWindowModel().getIdentifier()};
        return CM.register(p, e, k);
      }, unregisterComponent:function(e, k) {
        k = {main:this.getWindowModel().getType(), sub:k || this.getWindowModel().getIdentifier()};
        CM.unregister(k, e);
      }});
      window.GameViews.GrcRTViewS_grcrt = b;
    })();
    (function() {
      var b = window.GameControllers.TabController.extend({render:function() {
        this.$el.html(GRCRT_Translations.table());
        this.getWindowModel().hideLoading();
      }});
      window.GameViews.GrcRTViewT_grcrt = b;
    })();
    (function() {
      var b = window.GameViews, e = window.WindowFactorySettings, k = require("game/windows/ids"), p = require("game/windows/tabs"), a = k.GRCRT;
      e[a] = function(g) {
        g = g || {};
        return us.extend({window_type:a, minheight:475, maxheight:630, width:830, tabs:[{type:"grcrt", title:RepConvTool.GetLabel("HELPTAB1"), content_view_constructor:b.GrcRTViewEx_grcrt, hidden:!1}, {type:"howtogrcrt", title:RepConvTool.GetLabel("HELPTAB2"), content_view_constructor:b.GrcRTViewEx_grcrt, hidden:!1}, {type:"changesgrcrt", title:RepConvTool.GetLabel("HELPTAB3"), content_view_constructor:b.GrcRTViewEx_grcrt, hidden:!1}, {type:p.INDEX, title:RepConvTool.GetLabel("HELPTAB4"), content_view_constructor:b.GrcRTViewS_grcrt, 
        hidden:!1}, {type:"module/donations", title:RepConvTool.GetLabel("HELPTAB6"), content_view_constructor:b.GrcRTViewEx_grcrt, hidden:!1}, {type:p.INDEX, title:RepConvTool.GetLabel("HELPTAB5"), content_view_constructor:b.GrcRTViewT_grcrt, hidden:!1}], max_instances:1, activepagenr:0, minimizable:!0, resizable:!1, title:RepConv.grcrt_window_icon + RepConv.Scripts_nameS + "  ver." + RepConv.Scripts_version}, g);
      };
    })();
  }
  var fb = require("game/windows/ids"), jb = 0;
  this.spellCountDownRefresh = function() {
    $.each(GPWindowMgr.getAllOpen(), function(b, e) {
      if (b = CM.get({main:e.getID(), sub:"casted_powers"}, "grcrt_countdown")) {
        e = $(b).parent();
        var k = $(e).attr("data-power_id");
        e = $(e).attr("rel");
        k = GameData.powers[k];
        var p = MM.checkAndPublishRawModel("PlayerGods", {id:Game.player_id}).getCurrentProductionOverview()[e];
        e = MM.checkAndPublishRawModel("PlayerGods", {id:Game.player_id})[e + "_favor_delta_property"].calculateCurrentValue().unprocessedCurrentValue;
        b.setValue((k.favor - e) / p.production * 3600);
      }
    });
  };
  this.settings = function() {
    var b = $("<div/>", {style:"padding: 5px"}), e = $("<div/>", {"class":"game_list js-scrollbar-content", style:"width: 365px;"}), k = $("<fieldset/>", {style:"float:left; width:375px; min-height: 250px; position: relative;"}).append($("<legend/>").html("GRCRTools " + RepConvTool.GetLabel("HELPTAB4"))).append($("<div/>", {style:"width:375px; min-height: 235px; position: relative; overflow: hidden;", "class":"js-scrollbar-viewport"}).append(e)), p = $("<fieldset/>", {style:"float:right; width:370px; min-height: 250px;"}), 
    a = {};
    $.each(RepConv.sChbxs, function(G, M) {
      a[G] = f(G, RepConv.settings[G], M.label);
    });
    var g = f("GRCRTsoundLoop", RepConv.active.sounds.loop, "CHKSOUNDLOOP"), u = f("GRCRTsoundMute", RepConv.active.sounds.mute, "POPSOUNDMUTE"), D = $("<div/>", {id:"statsGRC2Sel", "class":"dropdown default", style:"margin-left:5px;width: 150px;"}).dropdown({list_pos:"left", value:RepConv.active.statsGRCL, options:[{value:"potusek", name:"www.grcrt.net"}, {value:"grepointel", name:"grepointel.com"}]});
    $.each(a, function(G, M) {
      $(e).append(M);
    });
    $(e).append($("<div/>", {style:"padding: 5px"}).append($("<label/>", {"for":"statsGRCL"}).text(RepConvTool.GetLabel("STATSLINK"))).append(D));
    $(p).append($("<legend/>").html(RepConvTool.GetLabel("EMOTS.LABEL"))).append($("<div/>").html(RepConvTool.GetLabel("EMOTS.MESS"))).append($("<textarea/>", {id:"GRCRTEmots", style:"width: 360px; min-height: 200px;"}).val(RepConvTool.getItem(RepConv.CookieEmots)));
    $(b).append($(k));
    $(b).append($(p));
    $(b).append($("<br/>", {style:"clear: both;"}));
    RepConv.audioSupport && $(b).append($("<fieldset/>", {id:"GRCRT_Sounds"}).append($("<legend/>").html(RepConvTool.GetLabel("SOUNDSETTINGS"))).append(RepConvForm.soundSlider({name:"sound", volume:RepConv.active.sounds.volume})).append(g.css({"float":"left", padding:"6px"}).mousePopup(new MousePopup(RepConvTool.GetLabel("POPSOUNDLOOP")))).append(u.css({"float":"left", padding:"6px"}).mousePopup(new MousePopup(RepConvTool.GetLabel("POPSOUNDMUTE")))).append($("<img/>", {id:"grcrt_play", src:RepConv.grcrt_cdn + 
    "ui/button-play-4.png", style:"float:right;"}).click(function() {
      if (1 == $("#grcrt_stop:hidden").length) {
        Pa = null;
        $("#grcrt_play").toggle();
        $("#grcrt_stop").toggle();
        var G = $("<audio/>", {preload:"auto"});
        "" != $("#grcrt_sound_url").val() ? (Pa = -1 < $("#grcrt_sound_url").val().indexOf("youtube") && $("#grcrt_sound_url").val().replace(/.*v=(.[^&]*)/, "$1") || -1 < $("#grcrt_sound_url").val().indexOf("youtu.be") && $("#grcrt_sound_url").val().replace(/.*youtu.be\/(.[^?]*)/, "$1"), $(G).append($("<source/>", {src:$("#grcrt_sound_url").val()}))) : $(G).append($("<source/>", {src:RepConv.Const.defAlarmM + ".mp3"})).append($("<source/>", {src:RepConv.Const.defAlarmM + ".ogg"}));
        null != Pa && Pa ? (RepConv.Debug && console.log("\u0142aduje " + Pa), Ua.loadVideoById({videoId:Pa, events:{onError:onGrcrtYTPlayerErrorTest, onStateChange:onGrcrtYTPlayerStateChangeTest, onReady:onGrcrtYTPlayerReadyTest}}).setVolume(RepConv.slider.getValue())) : (RepConv.audio.test = G.get(0), RepConv.audio.test.addEventListener("ended", function() {
          $("#grcrt_play").toggle();
          $("#grcrt_stop").toggle();
        }), RepConv.audio.test.volume = RepConv.slider.getValue() / 100, RepConv.audio.test.loop = !1, RepConv.audio.test.play());
      }
    }).mousePopup(new MousePopup(RepConvTool.GetLabel("POPSOUNDPLAY")))).append($("<img/>", {id:"grcrt_stop", src:RepConv.grcrt_cdn + "ui/button-stop-4.png", style:"float:right;"}).hide().click(function() {
      null != Pa && Pa ? Ua.stopVideo() : (RepConv.audio.test.pause(), RepConv.audio.test.currentTime = 0);
      $("#grcrt_play").toggle();
      $("#grcrt_stop").toggle();
    }).mousePopup(new MousePopup(RepConvTool.GetLabel("POPSOUNDSTOP")))).append($("<br/>", {style:"clear:both"})).append($("<div/>", {style:"float:left;width:120px;"}).html(RepConvTool.GetLabel("SOUNDURL"))).append(RepConvForm.input({name:"grcrt_sound_url", style:"float:left;width:600px;", value:RepConv.active.sounds.url}).mousePopup(new MousePopup(RepConvTool.GetLabel("POPSOUNDURL")))).append($("<div/>", {style:"float:left;width:120px;"}).html("&nbsp;")).append($("<div/>", {style:"float:left;width: 635px;font-size: 11px;font-style: italic;max-height: 27px;"}).html(RepConvTool.GetLabel("POPSOUNDEG"))));
    $(b).append(RepConvTool.AddBtn("BTNSAVE").click(function() {
      try {
        $.each(a, function(M, K) {
          RepConv.settings[M] = K.isChecked() ? !0 : !1;
        });
        RepConv.settings[RepConv.CookieStatsGRCL] = D.getValue();
        RepConv.settings[RepConv.CookieEmots] = $("#GRCRTEmots").val();
        if (RepConv.audioSupport) {
          RepConv.settings[RepConv.CookieSounds] = {mute:u.isChecked() ? !0 : !1, loop:g.isChecked() ? !0 : !1, volume:RepConv.slider.getValue(), url:$("#grcrt_sound_url").val()};
          var G = $("<audio/>", {preload:"auto"});
          "" != RepConv.settings[RepConv.CookieSounds].url ? $(G).append($("<source/>", {src:RepConv.settings[RepConv.CookieSounds].url})) : $(G).append($("<source/>", {src:RepConv.Const.defAlarmM + ".mp3"})).append($("<source/>", {src:RepConv.Const.defAlarmM + ".ogg"}));
          RepConv.audio.alarm = G.get(0);
        }
        RepConv.active.power = RepConvTool.getSettings(RepConv.CookiePower);
        RepConv.active.ftabs = RepConvTool.getSettings(RepConv.CookieForumTabs);
        RepConv.active.statsGRCL = RepConvTool.getSettings(RepConv.CookieStatsGRCL);
        RepConv.active.unitsCost = RepConvTool.getSettings(RepConv.CookieUnitsCost);
        RepConv.active.oceanNumber = RepConvTool.getSettings(RepConv.CookieOceanNumber);
        RepConv.active.reportFormat = RepConvTool.getSettings(RepConv.CookieReportFormat);
        RepConv.active.sounds = RepConvTool.getSettings(RepConv.CookieSounds);
        RepConvTool.saveRemote();
        setTimeout(function() {
          HumanMessage.success(RepConvTool.GetLabel("MSGHUMAN.OK"));
        }, 0);
      } catch (M) {
        setTimeout(function() {
          HumanMessage.error(RepConvTool.GetLabel("MSGHUMAN.ERROR"));
        }, 0);
      }
    }));
    return b;
  };
  var wa = {0:{total:"01:57:00", reduc:"00:01:40"}, 1:{total:"03:57:00", reduc:"00:02:30"}, 2:{total:"07:37:00", reduc:"00:03:20"}, 3:{total:"13:07:00", reduc:"00:04:10"}, 4:{total:"20:33:00", reduc:"00:05:00"}, 5:{total:"30:00:00", reduc:"00:05:50"}, 6:{total:"41:34:00", reduc:"00:06:40"}, 7:{total:"55:17:00", reduc:"00:07:30"}, 8:{total:"71:13:00", reduc:"00:08:20"}, 9:{total:"89:26:00", reduc:"00:09:10"}};
  this.getGrcrtYTPlayer = function() {
    return Oa;
  };
  this.getGrcrtYTPlayerTest = function() {
    return Ua;
  };
  var va = null, Oa, Pa = null, Ua;
  window.onGrcrtYTPlayerError = function(b) {
    HumanMessage.error(RepConvTool.GetLabel("MSGHUMAN.YOUTUBEERROR"));
    RepConv.Debug && console.log("event eventuje [onGrcrtYTPlayerError]");
  };
  window.onGrcrtYTPlayerReady = function(b) {
    RepConv.Debug && console.log("event eventuje [onGrcrtYTPlayerReady]");
    b.target.playVideo();
  };
  window.onGrcrtYTPlayerStateChange = function(b) {
    RepConv.Debug && console.log("event eventuje [onGrcrtYTPlayerStateChange]");
    RepConv.Debug && console.log(b);
    0 == b.data && (RepConv.settings[RepConv.CookieSounds].loop ? Oa.playVideo() : $("#grcrtSound").hide());
  };
  window.onGrcrtYTPlayerErrorTest = function(b) {
    HumanMessage.error(RepConvTool.GetLabel("MSGHUMAN.YOUTUBEERROR"));
    RepConv.Debug && console.log("event eventuje [onGrcrtYTPlayerErrorTest]");
    b.target.stopVideo();
  };
  window.onGrcrtYTPlayerReadyTest = function(b) {
    RepConv.Debug && console.log("event eventuje [onGrcrtYTPlayerReadyTest]");
    b.target.playVideo();
  };
  window.onGrcrtYTPlayerStateChangeTest = function(b) {
    RepConv.Debug && console.log("event eventuje [onGrcrtYTPlayerStateChange]");
    RepConv.Debug && console.log(b);
    0 == b.data && ($("#grcrt_play").toggle(), $("#grcrt_stop").toggle());
  };
  this.testAI = function() {
    RepConv.active.attack_count = -1;
    Ra(1);
  };
  this.addBTN = function(b) {
    switch(b.getType()) {
      case fb.ACADEMY:
        ia(b);
        break;
      case fb.NOTES:
        qa(b);
        break;
      case fb.OLYMPUS_TEMPLE_INFO:
        za(b);
    }
  };
  this.openGRCRT = function(b, e) {
    if ("undefined" != typeof window.GRCRTWnd) {
      try {
        window.GRCRTWnd.close();
      } catch (k) {
      }
      window.GRCRTWnd = void 0;
    }
    window.GRCRTWnd = WF.open("grcrt", {args:e});
    switch(b) {
      case "HELPTAB1":
        window.GRCRTWnd.setActivePageNr(0);
        break;
      case "HELPTAB2":
        window.GRCRTWnd.setActivePageNr(1);
        break;
      case "HELPTAB3":
        window.GRCRTWnd.setActivePageNr(2);
        break;
      case "HELPTAB4":
        window.GRCRTWnd.setActivePageNr(3);
        break;
      case "HELPTAB5":
        window.GRCRTWnd.setActivePageNr(4);
    }
  };
  $(document).ajaxComplete(function(b, e, k) {
    if ("undefined" != typeof k) {
      b = k.url.replace(/\/game\/(.*)\?.*/, "$1");
      var p = "frontend_bridge" != b ? b : -1 < k.url.indexOf("json") ? JSON.parse(unescape(k.url).split("&")[3].split("=")[1]).window_type : b;
      RepConv.requests[p] = {url:k.url, responseText:e.responseText};
      if ("frontend_bridge" == b) {
        var a = WM.getWindowByType(p)[0];
        a ? (RepConv.WND = a, RepConv.Debug && console.log('dodanie przycisku dla "' + a.getType() + '"'), $("#window_" + a.getIdentifier()).ready(function() {
          RepConv.Debug && console.log('dodanie przycisku dla "' + a.getType() + '" [id:' + a.getIdentifier() + "]");
          RepConvGRC.addBTN(a);
        })) : RepConv.Debug && console.log("typ wnd nieznany");
      } else {
        -1 < k.url.indexOf("game/wonders") && (-1 < k.url.indexOf("send_resources") || -1 < k.url.indexOf("decrease_build_time_with_favor")) && JSON.parse(e.responseText).json.success && (e = JSON.parse(decodeURIComponent(k.data).split("=")[1]), RepConv.Debug && console.log(e), e.wood = -1 < k.url.indexOf("decrease_build_time_with_favor") ? 0 : e.wood, e.stone = -1 < k.url.indexOf("decrease_build_time_with_favor") ? 0 : e.stone, e.iron = -1 < k.url.indexOf("decrease_build_time_with_favor") ? 0 : 
        e.iron, e.power = -1 < k.url.indexOf("decrease_build_time_with_favor") ? 400 : 0, RepConv.Debug && console.log(e)), $.each(Layout.wnd.getAllOpen(), function(g, u) {
          RepConv.Debug && console.log("Dodanie przycisku dla starego okna o ID = " + u.getID());
          g = Layout.wnd.GetByID(u.getID());
          RepConv.AQQ = g;
          switch(g.getController()) {
            case "alliance":
              switch(g.getContext().sub) {
                case "alliance_profile":
                  E(g);
                  break;
                case "alliance_create_application":
                  W(g, ".bb_button_wrapper", "#application_edit_message");
                  break;
                case "alliance_alliance_pact":
                  Ya(g);
              }break;
            case "alliance_forum":
              W(g, ".bb_button_wrapper", "#forum_post_textarea");
              C(g);
              break;
            case "building_barracks":
            case "building_docks":
              c(g);
              A(g);
              break;
            case "building_main":
              switch(g.getContext().sub) {
                case "building_main_index":
                  l(g);
              }break;
            case "building_place":
              q(g);
              break;
            case "building_wall":
              t(g);
              break;
            case "command_info":
              switch(g.getContext().sub) {
                case "command_info_colonization_info":
                case "command_info_info":
                  fa(g);
                  aa(g);
                  break;
                case "command_info_conquest_info":
                  Z(g);
                  break;
                case "command_info_conquest_movements":
                  Z(g);
              }break;
            case "farm_town_overviews":
              g.getJQElement().find($("#fto_town_list li")).attr("style", "border-right:0px");
              g.getJQElement().find($("#fto_town_list li.town" + Game.townId)).attr("style", "border-right: 5px solid green");
              0 == g.getJQElement().find($("#fto_town_list li.town" + Game.townId + ".active")).length && RepConv.currTown != Game.townId && (RepConv.currTown = Game.townId, g.getJQElement().find($("#fto_town_list li.town" + Game.townId)).click());
              break;
            case "island_info":
              J(g);
              break;
            case "message":
              u = void 0;
              switch(g.getContext().sub) {
                case "message_new":
                  u = "#message_new_message";
                  break;
                case "message_view":
                  u = "#message_reply_message";
                  Fa(g);
                  break;
                case "message_forward":
                  u = "#message_message";
                  break;
                default:
                  ma(g);
              }u && W(g, ".bb_button_wrapper", u);
              break;
            case "player":
              switch(g.getContext().sub) {
                case "player_get_profile_html":
                  I(g);
                  break;
                case "player_index":
                  h(g);
              }break;
            case "report":
              switch(g.getContext().sub) {
                case "report_view":
                  n(g);
              }break;
            case "town_info":
              switch(g.getContext().sub) {
                case "town_info_info":
                  V(g);
                  break;
                case "town_info_support":
                  Y(g);
                  break;
                case "town_info_trading":
                  RepConvABH.functCall(g, !1);
                  X(g);
                  break;
                case "town_info_god":
                  aa(g);
              }break;
            case "wonders":
              X(g);
              u = MM.checkAndPublishRawModel("Town", {id:Game.townId}).getAvailableTradeCapacity();
              RepConv.Debug && console.log(u);
              try {
                RepConv.settings[RepConv.Cookie + "_wonder_trade"] && 0 < u && (WorldWonders.spinners.wood.setValue(0), WorldWonders.spinners.stone.setValue(u / 2), WorldWonders.spinners.iron.setValue(u / 2));
              } catch (D) {
              }
              Va(g);
              break;
            case "town_overviews":
              switch(g.getContext().sub) {
                case "town_overviews_trade_overview":
                  RepConvABH.functCall(g, !0);
                  break;
                case "town_overviews_command_overview":
                  x(g);
              }break;
            case "conquest_info":
              switch(g.getContext().sub) {
                case "conquest_info_getinfo":
                  O(g);
              }break;
            case "building_farm":
              0 == g.getJQElement().find($("#farm_militia .game_footer #grcrt_militia")).length && g.getJQElement().find($("#farm_militia .game_footer #request_militia_button")).is(":visible") && g.getJQElement().find($("#farm_militia .game_footer #request_militia_button")).before($("<div/>", {"class":"index_unit unit_icon40x40 militia", id:"grcrt_militia"}).append($("<div/>", {"class":"value"}).html(Math.min(MM.getCollections().Town[0].getCurrentTown().getBuildings().getBuildingLevel("farm"), 25) * 
              (MM.getCollections().Town[0].getCurrentTown().getResearches().get("town_guard") ? 15 : 10)).css({"text-align":"right", "font-family":"Verdana", "font-weight":"700", "font-size":"12px", margin:"1px", color:"#fff", "text-shadow":"1px 1px 0 #000", position:"absolute", bottom:"1px", right:"1px"}))) && g.getJQElement().find($("#farm_militia .game_footer")).height(44);
          }
        }), $.each(fb, function(g, u) {
          if (WM.isOpened(u)) {
            var D = WM.getWindowByType(u)[0];
            D ? (RepConv.WND = D, RepConv.Debug && console.log('dodanie przycisku dla "' + D.getType() + '"'), $("#window_" + D.getIdentifier()).ready(function() {
              RepConv.Debug && console.log('dodanie przycisku dla "' + D.getType() + '" [id:' + D.getIdentifier() + "]");
              RepConvGRC.addBTN(D);
            })) : RepConv.Debug && console.log("typ wnd nieznany");
          }
        });
      }
    }
    1 == $("#grcrt_pl").length && (RepConv.Debug && console.log("War=" + RepConv.models.PlayerLedger.getCoinsOfWar()), RepConv.Debug && console.log("Wisdom=" + RepConv.models.PlayerLedger.getCoinsOfWisdom()), $("#grcrt_pl_war").html(RepConv.models.PlayerLedger.getCoinsOfWar()), $("#grcrt_pl_wis").html(RepConv.models.PlayerLedger.getCoinsOfWisdom()));
  });
  $.Observer(GameEvents.window.open).subscribe("GRCRT_GRC_window_open", function(b, e) {
    try {
      RepConv.WND = e, RepConv.Debug && console.log('dodanie przycisku dla "' + e.getType() + '"'), $("#window_" + e.getIdentifier()).ready(function() {
        RepConv.Debug && console.log('dodanie przycisku dla "' + e.getType() + '" [id:' + e.getIdentifier() + "]");
        RepConvGRC.addBTN(e);
      });
    } catch (k) {
    }
  });
  $.Observer(GameEvents.window.close).subscribe("GRCRT_GRC_window_close", function(b, e, k) {
    switch(e.type) {
      case Layout.wnd.TYPE_TOWN_OVERVIEWS:
        Q("grcrt_townsDD");
        Q("grcrt_FI");
        Q("grcrt_FR");
        Q("grcrt_FO");
        Q("grcrt_towns");
        break;
      case Layout.wnd.TYPE_BUILDING:
        "building_wall_index" == e.window_obj.wnd.getContext().sub && (Q("grcrt_saved"), Q("grcrt_wall"), Q("grcrt_delsaved"));
    }
  });
  $.Observer(GameEvents.window.reload).subscribe("GRCRT_GRC_window_reload", function(b, e, k) {
    0 == $("#grcrtListSaved").length && (Q("grcrt_saved"), Q("grcrt_delsaved"));
    0 == $("#grcrtListWall").length && Q("grcrt_wall");
  });
  $.Observer(GameEvents.ui.layout_gods_spells.state_changed).subscribe("GRCRT_GRC_ui_layout_gods_spells_state_changed", function() {
    RepConvTool.loadPower();
  });
  $.Observer(GameEvents.ui.layout_gods_spells.rendered).subscribe("GRCRT_GRC_ui_layout_gods_spells_rendered", function() {
    RepConvTool.loadPower();
  });
  $.Observer(GameEvents.window.daily_bonus.accept).subscribe("GRCRT_GRC_window_daily_bonus_accept", function() {
    RepConvTool.loadPower();
  });
  $.Observer(GameEvents.bar.powers.render).subscribe("GRCRT_GRC_bar_powers_render", function() {
    RepConvTool.loadPower();
  });
  $.Observer(GameEvents.town.town_switch).subscribe("GRCRT_GRC_town_town_switch", function() {
    $("#GRCRT_block").show();
    $("#GRCRT_block[rel=" + Game.townId + "]").hide();
  });
  $.Observer(GameEvents.favor.change).subscribe("GRCRT_GRC_favor_change", function() {
    setTimeout(function() {
      RepConvTool.loadPower();
    }, 100);
  });
  GameEvents.grcrt = GameEvents.grcrt || {};
  GameEvents.grcrt.powertooltip = "grcrt:powertooltip";
  var $a = DM.getTemplate("COMMON", "casted_power_tooltip");
  var v = {COMMON:{casted_power_tooltip:$a + "<script type=\"text/javascript\">;\n$.Observer(GameEvents.grcrt.powertooltip).publish({power:'<%=power.id%>'});\n\x3c/script>"}};
  DM.loadData({templates:v});
  $.Observer(GameEvents.grcrt.powertooltip).subscribe("GRCRT_GRC_grcrt_powertooltip", function(b, e) {
    Ka(e.power);
  });
  $("head").append($("<style/>").append(".tripple-progress-progressbar .amounts {width: 300px; text-align: right;}.grcrt_menu_inner {position: absolute !important;}")).append($("<style/>").append(".grcrt_power {position: absolute; top: 35px; right: 85px; z-index: 5}\n.grcrt_power .new_ui_power_icon.active_animation .extend_spell {width: 56px; height: 56px; background-image: none;}\n.grcrt_command {display: none !important}\n.grcrt_return {width: 19px; height: 13px; display: inline-block; margin: 0 2px; vertical-align: middle; background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAaCAYAAACHD21cAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3ggYFSEA10+XNgAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAC+ElEQVQ4y42UUUhUaRiGnzPn6OjMhB0ZsliiacOIaI3YNiiwLtIkVt2rxbFGMXIuuig3sdBoRkejaS8yguhCiQRdzlwIlYtQM3ZRgQVRYATWtsvIbrFra55mG3OnOWf/vZjUzGP23X7fw/9+7/fyS1hUrK9RTOhJ3KqLUl+nZDVjs4J+vjnCng0pfomPs1gpVtDJSoFIv2FCNxcFbR9Dwe/z2PWjE2Gm+FQpH0JttYUUn/yLrGw7thwndx88INT4nZgZdqsuANavLUD68KUdwSR57i8QwFCwYIEN5tQLACL3DJQJPUnowCa2HnlEjmMZSpYdI52ipH2c/9LvePP65TyJdzuWMaGbKG7VRevlEe61yRSfTjOdfI1r+QquHoxjc6xCdu2chbYeuv1+dwVbqa9Tqti9mY5rguHTKzHe/cv0VAJhptkXGqbvxhP6bjyZczPHjVt1ZRaYgdt++p074TWk3v6DlOVg+9frqPl2C/t3r5kFM2dKzt2x1NcpxfoaRevlEW4FVpJ+9Qj4EpGe4pvD9+fA91KlxZLTvPMZV54X4yvbMNszEr/OuiotldXhh7/Nu+HMHRUr8JWyDV2eRNiW09r5mSHXNE0MDQ1RVFREPB5fOqsAkUhExGIxqqqqME0TXdeXBjVNE7FYjNraWs6eOoppmkuHPBKJiGg0it/vJ9TsZ2x6NdnZ2Ty+f52mpiaRn58/D/J4PEgz8mpqajj4Q4iNqzPuBYNBZFlGCIHdbp8HDgwMoOi6Tn19Pb5DJyjM+xvIgO3t7ZYSw+FwRqqqqnR1dXEhfJzzZ47xbNygsEChoaEBp9OJw+EAQJZlWlpa5szxer1SWVkZ/f39nOi4iCf3j0xKDINQs5/e3l4GBwetXfV6vVJJSQk9PT20nunm6Z8pcnNz+WrbXurq6qisrFz8s6qurpY0TRPd3d1cOhcgkUgghMAwDAKBwAJQskpONBqloqKC0dFRysvLkWV5gauWOdQ0TUxOTqKqKmNjYwv6Ho+H/wFcKEqd4DudIQAAAABJRU5ErkJggg==) no-repeat;}\n.grcrt_return.grcrt_disabled {background-position: 0 -13px !important;}\n.grcrt_filter {cursor: pointer;}\n.overview_outgoing.icon.grcrt_disabled {background-position: -12px -13px !important;}\n.overview_incoming.icon.grcrt_disabled {background-position: 0 -13px !important;}\n.grcrt_wall_units {width: 54px; height: 71px; float: left;}\n.grcrt_wall_diff {float: right; padding-right: 4px; font-weight: 700; letter-spacing: -1px; color: green;}\n.grcrt_wall_compare_dd {float: left; text-align: right;}\n.grcrt_dd_list {margin-left:5px; width: 125px !important;}\n").append(".grcrt_idle {min-width: 20px; min-height: 11px; background: url(" + 
  RepConv.grcrt_cdn + "ui/idle_loader2.gif) no-repeat; float: left; margin-right: 4px; margin-top: 3px;}\n.grcrt_idle_days { background: url(" + RepConv.grcrt_cdn + "ui/idle.png) 0 0 no-repeat; color: white; text-align: center; font-size: 8px; vertical-align: middle; text-shadow: 1px 1px black; min-width: 20px; min-height: 11px; padding-top: 1px; cursor: help;}\n.grcrt_idle_dg {background-position: 0px 0px;}\n.grcrt_idle_dy {background-position: 0px -12px;}\n.grcrt_idle_dr {background-position: 0px -24px;}\n").append(".grcrt_lost_res {visibility: visible !important;}\n").append(".grcrtpoints {font-size: 10px; padding: 2px; color: greenyellow; text-shadow: 2px 2px 1px black; font-weight: bold; letter-spacing: -0.5px;}\n.grcrtpoints.grcrt_minus {color: #ff766c;}\n.grcrtpoints.grcrt_special {padding: 0; float: left; background: rgba(0, 0, 0, 0.5); width: 40px; height: 14px; text-align: center;}\n.grcrtpoints.grcrt_order {padding: 0; float: left; background: rgba(0, 0, 0, 0.5); width: 40px; height: 14px; text-align: center;}\n.build_cost_reduction_enabled_disabled .grcrt_plus { display:none}\n.build_cost_reduction_enabled .grcrt_minus { display:none}\n").append('.grcrt_brackets:before { content: "("}\n.grcrt_brackets:after { content: ")"}'));
  $("#ui_box").append($("<img/>", {src:RepConv.grcrt_cdn + "img/mute.png", id:"grcrtSound", style:"position:absolute; bottom: 45px; left: 15px;z-index: 1002;"}).mousePopup(new MousePopup(RepConvTool.GetLabel("POPDISABLEALARM"))).click(function() {
    null != va && va ? Oa.stopVideo() : (RepConv.audio.alarm.pause(), RepConv.audio.alarm.currentTime = 0, RepConv.audio.mute.play());
    $("#grcrtSound").hide();
    $("div.activity.attack_indicator").hasClass("active") ? Ra(parseInt($("div.activity.attack_indicator div.count").html())) : Ra(0);
  }).hide());
  $("<div/>", {id:"grcrtVideoContainers", style:"width:1px !important; height:1px !important"}).append($("<div/>", {id:"grcrtVideoContainer"})).append($("<div/>", {id:"grcrtVideoContainerTest"})).appendTo($("body"));
  $.getScript("https://www.youtube.com/iframe_api").done(function(b, e) {
    setTimeout(function() {
      hb();
    }, 100);
  });
  RepConv.initArray.push("RepConvGRC.init()");
  RepConv.wndArray.push("grcrt");
  RepConv.wndArray.push("grcrt_stats");
  RepConv.wndArray.push("grcrt_analysis");
  this.init = function() {
    try {
      "undefined" != typeof $.fn.spinner && function(b) {
        RepConv.oldSpinner || (RepConv.oldSpinner = b.fn.spinner, b.fn.spinner = function() {
          var e = RepConv.oldSpinner.apply(this, arguments);
          e.on("keyup", "input", function(k) {
            38 == k.keyCode ? e.stepUp() : 40 == k.keyCode && e.stepDown();
          });
          return e;
        });
      }(jQuery);
    } catch (b) {
      console.err(b);
    }
    new bb;
    new ab;
    new Wa;
    $.Observer(require("data/events").attack.incoming).subscribe("GameEvents.grcrt.attackIncomming", function(b, e) {
      Ra(e.count);
    });
    0 < require("helpers/commands").getTotalCountOfIncomingAttacks() && Ra(require("helpers/commands").getTotalCountOfIncomingAttacks());
    void 0 == RepConv.idleInterval && (Na(), RepConv.idleInterval = setInterval(function() {
      Na();
    }, 9E5));
    void 0 == RepConv.idleAttackInterval && (RepConv.idleAttackInterval = setInterval(function() {
      void gpAjax.ajaxGet("notify", "fetch", {no_sysmsg:!1}, !1, function() {
      });
    }, 1E4));
    ib();
    lb();
    Ta();
  };
}
function _GRCRTMain() {
  this.Scripts_update_path = this.Scripts_check_path = "https://www.grcrt.net/scripts/";
  this.Scripts_name = "Grepolis Report Converter Revolution Tools";
  this.Scripts_nameS = "GRCRTools";
  this.Scripts_url = "https://www.grcrt.net/";
  this.Scripts_link = "[url=" + this.Scripts_url + "]" + this.Scripts_name + "[/url]";
  this.securityData = "";
  this.Scripts_version = "5.1.0";
  this.grcrt_window_icon = '<img src="https://cdn.grcrt.net/img/octopus.png" style="width: 20px;float:left;margin: -2px 5px 0px -5px;">';
  this.grcrt_domain = "https://www.grcrt.net/";
  this.grcrt_cdn = "https://cdn.grcrt.net/";
  this.Const = {IdWindowName:"repConvWindow", IdWindowHelp:"repConvWindowHelp", IdWindowView:"repConvWindowView", IdWindowClone:"repConvClone", IdParent:"#report_report", footer:this.Scripts_link + " - ver. " + this.Scripts_version + " created by Potusek & Anpu", staticImg:this.Scripts_url + "img/", morale:"morale.png", luck:"luck.png", oldwall:"oldwall.png", nightbonus:"nightbonus.png", unitImg:this.Scripts_url + "static/", uiImg:this.Scripts_url + "ui/", wood:this.grcrt_cdn + "ui/3/wood.png", stone:this.grcrt_cdn + 
  "ui/3/stone.png", iron:this.grcrt_cdn + "ui/3/iron.png", bunt:this.grcrt_cdn + "ui/c/revolt_arising.png", bunt2:this.grcrt_cdn + "ui/c/revolt_running.png", dataUrl:this.Scripts_url + "data/stats.php", dataDetailUrl:this.Scripts_url + "data/statsdetail.php", langUrl:this.Scripts_url + "scripts/", textareastyle:"width:805px; height:219px; font-size : 75%;", defAlarm:this.grcrt_cdn + "ui/s/alarm.mp3", defMute:this.grcrt_cdn + "ui/s/car_lock.mp3", defAlarmM:this.grcrt_cdn + "ui/s/alarm", defMuteM:this.grcrt_cdn + 
  "ui/s/car_lock"};
  this.LangLoaded = this.Debug = !1;
  this.StoreLoaded = !0;
  this.LangEnv = "en";
  this.LangAvailable = {pl:"PL", en:"EN", de:"DE", ro:"RO", fr:"FR", es:"ES", nl:"NL", it:"IT", cs:"CS", cz:"CS"};
  this.Lang = {};
  this.HelpTabs = {};
  this.RepType = "";
  this.menu = {99:{name:"HELPTAB1", action:"RepConvGRC.openGRCRT('HELPTAB1')"}};
  this.initArray = [];
  this.wndArray = [];
  "undefined" == typeof String.prototype.RCFormat && (String.prototype.RCFormat = function() {
    var f = arguments;
    return this.replace(/\{(\d+)\}/g, function(A, c) {
      return f[c];
    });
  });
  "undefined" == typeof String.prototype.stripTags && (String.prototype.stripTags = function() {
    tags = this;
    return stripped = tags.replace(/<\/?[^>]+>/gi, "");
  });
  "undefined" == typeof String.prototype.wrapLine && (String.prototype.wrapLine = function(f) {
    var A = "";
    for (_string = this.replace(/\n/g, " ").replace(/  /g, " "); 0 < _string.length;) {
      var c = _string.length > f ? _string.substring(0, f).lastIndexOf(" ") : -1;
      -1 == c && (c = 0 < _string.length && _string.length <= f ? _string.length : f);
      A += (0 < A.length ? "\n" : "") + _string.substring(0, c);
      _string = _string.substring(c + 1, _string.length);
    }
    return A;
  });
  "undefined" == typeof Array.prototype.kasuj && (Array.prototype.kasuj = function(f) {
    f = this.indexOf(f);
    -1 != f && this.splice(f, 1);
  });
  "undefined" == typeof Object.size && (Object.size = function(f) {
    var A = 0, c;
    for (c in f) {
      f.hasOwnProperty(c) && A++;
    }
    return A;
  });
  "undefined" == typeof Array.prototype.contains && (Array.prototype.contains = function(f) {
    for (var A = this.length; A--;) {
      if (this[A] == f) {
        return !0;
      }
    }
    return !1;
  });
  Array.prototype.searchFor || (Array.prototype.searchFor = function(f, A) {
    return this.filter(function(c, h, l) {
      return c[f] == A;
    });
  });
  Array.prototype.clone || (Array.prototype.clone = function() {
    return this.slice(0);
  });
  Array.prototype.remove || (Array.prototype.remove = function(f, A) {
    A = this.slice((A || f) + 1 || this.length);
    this.length = 0 > f ? this.length + f : f;
    return this.push.apply(this, A);
  });
  Function.prototype.inherits || (Function.prototype.inherits = function(f) {
    this.prototype = new f;
    this.prototype.constructor = this;
    this.prototype.parent = f.prototype;
  });
  "undefined" == typeof $.fn.justtext && ($.fn.justtext = function() {
    return $(this).clone().children().remove().end().text();
  });
  "undefined" == typeof $.md5 && new _GRCRTmd5;
  this.PublChanges = function(f) {
    return this.getInfoFromWebsite("changesgrc");
  };
  this.getUrlForWebsite = function(f, A) {
    return this.Scripts_url + Game.locale_lang + "/light/" + f + (A || "");
  };
  this.getInfoFromWebsite = function(f, A) {
    var c = $("<div/>");
    f = RepConv.getUrlForWebsite(f, A);
    c.append($("<iframe/>", {src:f, style:"width: 825px; height: 425px;", onload:"console.log(this)"}));
    return c.html();
  };
  this.AQQ = {};
  this.currTown = "";
  this.active = {sounds:{mute:!1, volume:100, url:"", loop:!0}, power:!0, ftabs:!0, fcmdimg:!0, statsGRC2:!1, statsGRCL:"potusek", unitsCost:!0, oceanNumber:!0, reportFormat:!0, attack_count:0};
  this.commandList = this._cookie + "_CmdList";
  this.command = this._cookie + "_Cmd_";
  this.addCmd = !1;
  this.unitsCode = {sword:"A1", slinger:"B1", archer:"C1", hoplite:"D1", rider:"E1", chariot:"F1", catapult:"G1", big_transporter:"A2", bireme:"B2", attack_ship:"C2", demolition_ship:"D2", small_transporter:"E2", trireme:"F2", colonize_ship:"G2", zyklop:"A3", sea_monster:"B3", harpy:"C3", medusa:"D3", minotaur:"E3", manticore:"F3", centaur:"G3", pegasus:"H3", cerberus:"I3", fury:"J3", calydonian_boar:"K3", griffin:"L3", godsent:"M3", militia:"A4", atalanta:"A5", cheiron:"B5", ferkyon:"C5", helen:"D5", 
  hercules:"E5", leonidas:"F5", orpheus:"G5", terylea:"H5", urephon:"I5", zuretha:"J5", andromeda:"K5", odysseus:"L5", iason:"M5", apheledes:"N5", democritus:"O5", hector:"P5", agamemnon:"Q5", aristotle:"R5", christopholus:"S5", deimos:"T5", ylestres:"U5", pariphaistes:"V5", pelops:"W5", rekonos:"X5", themistokles:"Y5", medea:"Z5", unknown_naval:"XY", unkown:"XX", unknown:"XX", };
  this.buildCode = {main:"A9", storage:"B9", hide:"C9", farm:"D9", place:"E9", lumber:"F9", stoner:"G9", ironer:"H9", market:"I9", docks:"J9", wall:"K9", academy:"L9", temple:"M9", barracks:"N9", theater:"O9", thermal:"P9", library:"R9", lighthouse:"S9", tower:"T9", statue:"U9", oracle:"V9", trade_office:"W9"};
  this.academyCode = {architecture:"A7", building_crane:"B7", cryptography:"C7", espionage:"D7", plow:"E7", stone_storm:"F7", temple_looting:"G7", berth:"H7", cartography:"I7", democracy:"J7", instructor:"K7", pottery:"L7", strong_wine:"M7", town_guard:"N7", booty:"O7", combat_experience:"P7", diplomacy:"Q7", mathematics:"R7", set_sail:"S7", take_over:"T7", breach:"U7", conscription:"V7", divine_selection:"W7", meteorology:"X7", shipwright:"Y7", take_over_old:"Z7", phalanx:"D6", ram:"C6", booty_bpv:"H6", 
  };
  this.commandImage = "abort attack_incoming attack_land attack_pillage attack_sea attack_spy attack_takeover attack breakthrough colonization_failed colonization conqueror farm_attack illusion revolt_arising revolt_running revolt siege spying support trade underattack_land underattack_sea foundation".split(" ");
  this.powerImage = "acumen attack_boost attack_penalty bolt building_order_boost call_of_the_ocean cap_of_invisibility cleanse defense_boost defense_penalty desire divine_sign earthquake effort_of_the_huntress fair_wind favor_boost favor_penalty fertility_improvement forced_loyalty happiness happy_folks hermes_boost illusion iron_production_penalty kingly_gift loyalty_loss myrmidion_attack natures_gift olympic_experience olympic_sword olympic_torch olympic_village patroness pest population_boost pumpkin resource_boost resurrection sea_storm starter_protection stone_production_penalty strength_of_heroes town_protection transformation trojan_defense underworld_treasures unit_movement_boost unit_order_boost unit_training_boost wedding wisdom wood_production_penalty small_temple_powers large_temple_powers".split(" ");
  this.models = {};
  this.requests = {};
  this.__repconvValueArray = {};
  this.settings = {};
  this.Tracker = function() {
    (function(f, A, c, h, l, m, C) {
      f.GoogleAnalyticsObject = l;
      f[l] = f[l] || function() {
        (f[l].q = f[l].q || []).push(arguments);
      };
      f[l].l = 1 * new Date;
      m = A.createElement(c);
      C = A.getElementsByTagName(c)[0];
      m.async = 1;
      m.src = h;
      C.parentNode.insertBefore(m, C);
    })(window, document, "script", "//www.google-analytics.com/analytics.js", "ga");
    ga("create", "UA-6635454-10", "auto");
    ga("send", "pageview");
  };
  this.sChbxs = {};
  this.init = function() {
    if ("object" != typeof Game && "function" != typeof MousePopup && "object" != typeof GameEvents) {
      setTimeout(function() {
        RepConv.init();
      }, 1000);
    } else {
      try {
        GameEvents.grcrt = GameEvents.grcrt || {};
        GameEvents.grcrt.settings = {load:"grcrt:settings:load", save:"grcrt:settings:save"};
        this.grcrtBrowser = grcrtBrowser;
        this.grcrt_domain = this.Scripts_url = "https://www.grcrt.net/";
        this.grcrt_cdn = "https://cdn.grcrt.net/";
        this.Scripts_link = "[url=" + this.grcrt_domain + "]" + this.Scripts_name + "[/url]";
        this.Const.footer = this.Scripts_link + " - ver. " + this.Scripts_version + " created by Potusek & Anpu";
        this.Const.staticImg = this.grcrt_cdn + "img/";
        this.Const.unitImg = this.grcrt_domain + "static/";
        this.Const.uiImg = this.grcrt_cdn + "ui/";
        this.Const.bunt = this.grcrt_cdn + "ui/c/revolt_arising.png";
        this.Const.bunt2 = this.grcrt_cdn + "ui/c/revolt_running.png";
        this.Const.langUrl = this.grcrt_cdn + "scripts/";
        this.Const.defAlarm = this.grcrt_cdn + "ui/s/alarm.mp3";
        this.Const.defMute = this.grcrt_cdn + "ui/s/car_lock.mp3";
        this.Cookie = this._cookie = Game.player_name + "_" + Game.world_id;
        this.CookieNew = this._cookie + "_new";
        this.CookiePower = this._cookie + "_power";
        this.CookieForumTabs = this._cookie + "_ftags";
        this.CookieCmdImg = this._cookie + "_cmdimg";
        this.CookieStatsGRC2 = this._cookie + "_statsGRC2";
        this.CookieStatsGRCL = this._cookie + "_statsGRCL";
        this.CookieUnitsCost = this._cookie + "_unitsCost";
        this.CookieReportFormat = this._cookie + "_repFormat";
        this.CookieUnitsRecr = this._cookie + "_unitsRecr";
        this.CookieUnitsABH = this._cookie + "_unitsRecrABH";
        this.CookieSounds = this._cookie + "_sounds";
        this.CookieEmots = this._cookie + "_emots";
        this.CookieWall = this._cookie + "_wall";
        this.CookieImgBtn = this._cookie + "_imgBtn";
        this.hash = $.md5(this._cookie);
        this.sChbxs[RepConv.CookiePower] = {label:"CHKPOWERNAME", default:!0};
        this.sChbxs[RepConv.CookieForumTabs] = {label:"CHKFORUMTABS", default:!0};
        this.sChbxs[RepConv.CookieUnitsCost] = {label:"CHKUNITSCOST", default:!0};
        this.sChbxs[RepConv.CookieReportFormat] = {label:"CHKREPORTFORMAT", default:!0};
        this.sChbxs[RepConv.Cookie + "_idle"] = {label:"STATS.CHKINACTIVE", default:!0};
        this.sChbxs[RepConv.Cookie + "_wonder_trade"] = {label:"CHKWONDERTRADE", default:!0};
        this.sChbxs[RepConv.Cookie + "_town_popup"] = {label:"CHKTOWNPOPUP", default:!0};
        this.sChbxs[RepConv.Cookie + "_mcol"] = {label:"CHKMCOL", default:!0};
        this.sChbxs[RepConv.Cookie + "_bupo"] = {label:"CHKBUPO", default:!0};
        this.sChbxs[RepConv.Cookie + "_imgBtn"] = {label:"CHKIMGBTN", default:!0};
        RepConvLangArray = new _GRCRTRepConvLangArray;
        void 0 == RepConvLangArray[Game.locale_lang.substring(0, 2)] ? this.LangEnv = "en" : this.LangEnv = Game.locale_lang.substring(0, 2);
        RepConvHelpTabs = {HELPTAB1:this.getInfoFromWebsite("grc"), HELPTAB2:this.getInfoFromWebsite("grchowto"), HELPTAB3:this.getInfoFromWebsite("changesgrc"), HELPTAB4:"", HELPTAB5:""};
        if ("en" == this.LangEnv || "zz" == this.LangEnv) {
          this.LangEnv = "en", this.LangLoaded = !0;
        }
        void 0 == RepConvLangArray[this.LangEnv] && (this.LangEnv = "en", this.LangLoaded = !0);
        this.Lang = RepConvLangArray[this.LangEnv];
        RepConvCommand = {};
        RepConvCommandList = [];
        if (grcrtBrowser.chrome) {
          try {
            RepConvAdds = new _RepConvAdds;
          } catch (f) {
            grcrtErrReporter(f);
          }
          try {
            RepConvForm = new _RepConvForm;
          } catch (f) {
            grcrtErrReporter(f);
          }
          try {
            RepConvTool = new _RepConvTool;
          } catch (f) {
            grcrtErrReporter(f);
          }
          try {
            GRCRTConverterCtrl = new _GRCRTConverterCtrl;
          } catch (f) {
            grcrtErrReporter(f);
          }
          try {
            GRCRTInnoFix = new _GRCRTInnoFix;
          } catch (f) {
            grcrtErrReporter(f);
          }
          try {
            GRCRTMouseWheelZoom = new _GRCRTMouseWheelZoom;
          } catch (f) {
            grcrtErrReporter(f);
          }
          try {
            GRCRTMovedFrames = new _GRCRTMovedFrames;
          } catch (f) {
            grcrtErrReporter(f);
          }
          try {
            GRCRTOceanNumbers = new _GRCRTOceanNumbers;
          } catch (f) {
            grcrtErrReporter(f);
          }
          try {
            GRCRTTradeFarmOldVersion = new _GRCRTTradeFarmOldVersion;
          } catch (f) {
            grcrtErrReporter(f);
          }
          try {
            GRCRT_AO = new _GRCRT_AO;
          } catch (f) {
            grcrtErrReporter(f);
          }
          try {
            GRCRT_Notifications = new _GRCRT_Notifications;
          } catch (f) {
            grcrtErrReporter(f);
          }
          try {
            GRCRT_Radar = new _GRCRT_Radar;
          } catch (f) {
            grcrtErrReporter(f);
          }
          try {
            GRCRT_Recipes = new _GRCRT_Recipes;
          } catch (f) {
            grcrtErrReporter(f);
          }
          try {
            GRCRT_TSL = new _GRCRT_TSL;
          } catch (f) {
            grcrtErrReporter(f);
          }
          try {
            GRCRT_Translations = new _GRCRT_Translations;
          } catch (f) {
            grcrtErrReporter(f);
          }
          try {
            GRCRT_Updater = new _GRCRT_Updater;
          } catch (f) {
            grcrtErrReporter(f);
          }
          try {
            GRCRTmd5 = new _GRCRTmd5;
          } catch (f) {
            grcrtErrReporter(f);
          }
          try {
            GRCRTtpl = new _GRCRTtpl;
          } catch (f) {
            grcrtErrReporter(f);
          }
          try {
            RepConvABH = new _RepConvABH;
          } catch (f) {
            grcrtErrReporter(f);
          }
          try {
            RepConvGRC = new _RepConvGRC;
          } catch (f) {
            grcrtErrReporter(f);
          }
        } else {
          try {
            uw.RepConvAdds = new _RepConvAdds;
          } catch (f) {
            grcrtErrReporter(f);
          }
          try {
            uw.RepConvForm = new _RepConvForm;
          } catch (f) {
            grcrtErrReporter(f);
          }
          try {
            uw.RepConvTool = new _RepConvTool;
          } catch (f) {
            grcrtErrReporter(f);
          }
          try {
            uw.GRCRTConverterCtrl = new _GRCRTConverterCtrl;
          } catch (f) {
            grcrtErrReporter(f);
          }
          try {
            uw.GRCRTInnoFix = new _GRCRTInnoFix;
          } catch (f) {
            grcrtErrReporter(f);
          }
          try {
            uw.GRCRTMouseWheelZoom = new _GRCRTMouseWheelZoom;
          } catch (f) {
            grcrtErrReporter(f);
          }
          try {
            uw.GRCRTMovedFrames = new _GRCRTMovedFrames;
          } catch (f) {
            grcrtErrReporter(f);
          }
          try {
            uw.GRCRTOceanNumbers = new _GRCRTOceanNumbers;
          } catch (f) {
            grcrtErrReporter(f);
          }
          try {
            uw.GRCRTTradeFarmOldVersion = new _GRCRTTradeFarmOldVersion;
          } catch (f) {
            grcrtErrReporter(f);
          }
          try {
            uw.GRCRT_AO = new _GRCRT_AO;
          } catch (f) {
            grcrtErrReporter(f);
          }
          try {
            uw.GRCRT_Notifications = new _GRCRT_Notifications;
          } catch (f) {
            grcrtErrReporter(f);
          }
          try {
            uw.GRCRT_Radar = new _GRCRT_Radar;
          } catch (f) {
            grcrtErrReporter(f);
          }
          try {
            uw.GRCRT_Recipes = new _GRCRT_Recipes;
          } catch (f) {
            grcrtErrReporter(f);
          }
          try {
            uw.GRCRT_TSL = new _GRCRT_TSL;
          } catch (f) {
            grcrtErrReporter(f);
          }
          try {
            uw.GRCRT_Translations = new _GRCRT_Translations;
          } catch (f) {
            grcrtErrReporter(f);
          }
          try {
            uw.GRCRT_Updater = new _GRCRT_Updater;
          } catch (f) {
            grcrtErrReporter(f);
          }
          try {
            uw.GRCRTmd5 = new _GRCRTmd5;
          } catch (f) {
            grcrtErrReporter(f);
          }
          try {
            uw.GRCRTtpl = new _GRCRTtpl;
          } catch (f) {
            grcrtErrReporter(f);
          }
          try {
            uw.RepConvABH = new _RepConvABH;
          } catch (f) {
            grcrtErrReporter(f);
          }
          try {
            uw.RepConvGRC = new _RepConvGRC;
          } catch (f) {
            grcrtErrReporter(f);
          }
        }
        this.GA = 0;
        RepConvTool.readRemote();
        RepConv.Debug && console.log("...start init");
        setTimeout(function() {
          RepConvAdds.init();
        }, 100);
        setTimeout(function() {
          RepConv.Tracker();
        }, 100);
      } catch (f) {
        grcrtErrReporter(f);
      }
    }
  };
}
function _grcrtAppendScript(f, A) {
  var c = document.createElement("script");
  c.type = "text/javascript";
  c.id = f;
  c.textContent = A;
  document.body.appendChild(c);
}
var matched, grcrtBrowser;
uaMatch = function(f) {
  f = f.toLowerCase();
  var A = /(opr)[\/]([\w.]+)/.exec(f) || /(chrome)[ \/]([\w.]+)/.exec(f) || /(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(f) || /(webkit)[ \/]([\w.]+)/.exec(f) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(f) || /(msie) ([\w.]+)/.exec(f) || 0 <= f.indexOf("trident") && /(rv)(?::| )([\w.]+)/.exec(f) || 0 > f.indexOf("compatible") && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(f) || [];
  f = /(ipad)/.exec(f) || /(iphone)/.exec(f) || /(android)/.exec(f) || /(windows phone)/.exec(f) || /(win)/.exec(f) || /(mac)/.exec(f) || /(linux)/.exec(f) || /(cros)/i.exec(f) || [];
  return {browser:A[3] || A[1] || "", version:A[2] || "0", platform:f[0] || ""};
};
matched = uaMatch(window.navigator.userAgent);
grcrtBrowser = {msie:!1, safari:!1};
matched.browser && (grcrtBrowser[matched.browser] = !0, grcrtBrowser.version = matched.version, grcrtBrowser.versionNumber = parseInt(matched.version));
matched.platform && (grcrtBrowser[matched.platform] = !0);
if (grcrtBrowser.android || grcrtBrowser.ipad || grcrtBrowser.iphone || grcrtBrowser["windows phone"]) {
  grcrtBrowser.mobile = !0;
}
if (grcrtBrowser.cros || grcrtBrowser.mac || grcrtBrowser.linux || grcrtBrowser.win) {
  grcrtBrowser.desktop = !0;
}
if (grcrtBrowser.chrome || grcrtBrowser.opr || grcrtBrowser.safari) {
  grcrtBrowser.webkit = !0;
}
if (grcrtBrowser.rv) {
  var ie = "msie";
  matched.browser = ie;
  grcrtBrowser[ie] = !0;
}
if (grcrtBrowser.opr) {
  var opera = "opera";
  matched.browser = opera;
  grcrtBrowser[opera] = !0;
}
if (grcrtBrowser.safari && grcrtBrowser.android) {
  var android = "android";
  matched.browser = android;
  grcrtBrowser[android] = !0;
}
grcrtBrowser.name = matched.browser;
grcrtBrowser.platform = matched.platform;
uw = window;
grcrtBrowser.mozilla || "object" == typeof GM ? (grcrtBrowser.mozilla = !0, _grcrtAppendScript("grcrtBrowser", "uw = (typeof unsafeWindow == 'undefined') ? window : unsafeWindow; grcrtBrowser = " + JSON.stringify(grcrtBrowser) + ";"), _grcrtAppendScript("grcrtErrReporter", grcrtErrReporter.toString()), _grcrtAppendScript("GRCRTRepConvLangArray", _GRCRTRepConvLangArray.toString()), _grcrtAppendScript("RepConvAdds", _RepConvAdds.toString()), _grcrtAppendScript("RepConvForm", _RepConvForm.toString()), 
_grcrtAppendScript("RepConvTool", _RepConvTool.toString()), _grcrtAppendScript("GRCRTConverterCtrl", _GRCRTConverterCtrl.toString()), _grcrtAppendScript("GRCRTInnoFix", _GRCRTInnoFix.toString()), _grcrtAppendScript("GRCRTMouseWheelZoom", _GRCRTMouseWheelZoom.toString()), _grcrtAppendScript("GRCRTMovedFrames", _GRCRTMovedFrames.toString()), _grcrtAppendScript("GRCRTOceanNumbers", _GRCRTOceanNumbers.toString()), _grcrtAppendScript("GRCRTTradeFarmOldVersion", _GRCRTTradeFarmOldVersion.toString()), _grcrtAppendScript("GRCRT_AO", 
_GRCRT_AO.toString()), _grcrtAppendScript("GRCRT_Notifications", _GRCRT_Notifications.toString()), _grcrtAppendScript("GRCRT_Radar", _GRCRT_Radar.toString()), _grcrtAppendScript("GRCRT_Recipes", _GRCRT_Recipes.toString()), _grcrtAppendScript("GRCRT_TSL", _GRCRT_TSL.toString()), _grcrtAppendScript("GRCRT_Translations", _GRCRT_Translations.toString()), _grcrtAppendScript("GRCRT_Updater", _GRCRT_Updater.toString()), _grcrtAppendScript("GRCRTmd5", _GRCRTmd5.toString()), _grcrtAppendScript("GRCRTtpl", 
_GRCRTtpl.toString()), _grcrtAppendScript("RepConvABH", _RepConvABH.toString()), _grcrtAppendScript("RepConvGRC", _RepConvGRC.toString()), _grcrtAppendScript("GRCRTMain", _GRCRTMain.toString()), _grcrtAppendScript("GRCRTrunner", "RepConv = new _GRCRTMain();RepConv.init();")) : $(document).ready(function() {
  if (!window.TempBarData) {
    $.Observer(GameEvents.game.start).subscribe("GRCRT_Main_game_start", function() {
      if ("undefined" == typeof RepConv || grcrtBrowser.safari && "undefined" == typeof RepConv.init) {
        grcrtBrowser.chrome ? RepConv = new _GRCRTMain : uw.RepConv = new _GRCRTMain, RepConv.init();
      }
    });
  } else {
    if ("undefined" == typeof RepConv || grcrtBrowser.safari && "undefined" == typeof RepConv.init) {
      grcrtBrowser.chrome ? RepConv = new _GRCRTMain : uw.RepConv = new _GRCRTMain, RepConv.init();
    }
  }
});


