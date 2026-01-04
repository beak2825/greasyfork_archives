// ==UserScript==
// @name         nur stein - GRCR
// @author       Potusek & Anpu
// @description  Grepolis Report Converter Revolution Tools
// @include      http://*.grepolis.com/game/*
// @include      https://*.grepolis.com/game/*
// @exclude      view-source://*
// @exclude      https://classic.grepolis.com/game/*
// @icon         https://cdn.grcrt.net/img/octopus.png
// @iconURL      https://cdn.grcrt.net/img/octopus.png
// @version      5.0.9
// @grant        none
// @copyright    2011+
// @license      GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @namespace https://greasyfork.org/users/824736
// @downloadURL https://update.greasyfork.org/scripts/433827/nur%20stein%20-%20GRCR.user.js
// @updateURL https://update.greasyfork.org/scripts/433827/nur%20stein%20-%20GRCR.meta.js
// ==/UserScript==

function grcrtErrReporter(b) {
  function k() {
    var b = $("<form/>", {action:RepConv.grcrt_domain + "scripts/errorLog.php?_=" + Timestamp.server(), method:"post", target:"GRCRTErrorSender"}).append($("<textarea/>", {name:"_json"}).text(JSON.stringify(a)));
    $("#GRCRTErrorSenderTMP").html("").append(b);
    b.submit();
  }
  var a = {world:Game.world_id, time:(new Date).toISOString(), userId:Game.player_id, version:RepConv.Scripts_version, browser:navigator.userAgent, error:{message:b.message, stack:b.stack}};
  0 == $("#GRCRTErrorSender").length && ($("body").append($("<iframe/>", {id:"GRCRTErrorSender", name:"GRCRTErrorSender", style:"display:none"})), $("body").append($("<div/>", {id:"GRCRTErrorSenderTMP"}).hide()));
  b.silent ? k() : "object" == typeof Layout && "function" == typeof Layout.showConfirmDialog ? (console.log(a), Layout.showConfirmDialog("GRCRTools oops!", '<div><img src="' + RepConv.grcrt_cdn + 'img/octopus.png" style="float:left;padding-right: 10px"/><p style="padding:5px"><b>Found error</b><br/><pre>' + b + "</pre><br/>You want send?</p></div>", function() {
    k();
  })) : setTimeout(function() {
    grcrtErrReporter(b);
  }, 500);
}
function _GRCRTRepConvLangArray() {
  this.cs = {INFO:{0:"Potusek", 1:"grepolis@potusek.eu"}, WEBSITE:"Web", AUTHOR:"tomthas@seznam.cz, Thasoss, Apic", BTNCONV:"Konvertovat", BTNGENER:"Vytvo\u0159it", BTNSRC:"Zdroj", BTNVIEW:"N\u00e1hled", BTNSAVE:"Ulo\u017eit", BTNMARKS:"Ozna\u010dit jako p\u0159e\u010dten\u00e9", BTNMARKA:"Ozna\u010dit v\u0161e jako p\u0159e\u010dten\u00e9", MSGTITLE:"Konvertovat hl\u00e1\u0161en\u00ed", MSGQUEST:"Jak\u00e1 data maj\u00ed b\u00fdt zobrazena?", MSGALL:"V\u0161e", MSGBBCODE:"N\u00e1sleduj\u00edc\u00ed publikaci hl\u00e1\u0161en\u00ed m\u016f\u017eete za pomoci BB k\u00f3d\u016f vkl\u00e1dat do zpr\u00e1v \u010di f\u00f3ra.",
  MSGRESOURCE:"Ko\u0159ist", MSGUNITS:"Jednotky", MSGBUILD:"Budovy", MSGUSC:"Pou\u017eit\u00e9 st\u0159\u00edbrn\u00e9 mince", MSGRAW:"Suroviny", SUPPORT:"Podpora", SPY:"\u0160pehov\u00e1n\u00ed", CONQUER:"Dobyto", LOSSES:"Ztr\u00e1ty", HIDDEN:"Skryt\u00e9", NOTUNIT:"[i]\u017d\u00e1dn\u00fd[/i]", TOWN:"[i]M\u011bsto:[/i] ", PLAYER:"[i]Hr\u00e1\u010d:[/i] ", ALLY:"[i]Ali:[/i] ", CAST:"seslat:", ONTOWER:"Na m\u011bsto:", MSGHIDAD:"Skr\u00fdt m\u011bsta", MSGFORUM:"Hl\u00e1\u0161en\u00ed bude publikov\u00e1no",
  BBALLY:"alian\u010dn\u00ed f\u00f3ra / zpr\u00e1vy", BBFORUM:"extern\u00ed f\u00f3rum", ERRGETSRC:"Do\u0161lo k chyb\u011b! Pros\u00edm, ohlaste to na:  potusek@westtax.info", ICOCLOSE:"Zav\u0159\u00edt", ICOHELP:"O konvertoru", MSGPREVIEW:"<b>N\u00e1hled hl\u00e1\u0161en\u00ed</b>", HELPTAB1:"O...", HELPTAB2:"Jak to funguje", HELPTAB3:"Zm\u011bny", HELPTAB4:"Nastaven\u00ed", HLPVERSION:"Verze", HLPFIXED:"Fixed", HLPADDED:"P\u0159id\u00e1no", MSGHUMAN:{OK:"Informace ulo\u017eeny", ERROR:"P\u0159i zapisov\u00e1n\u00ed nastala chyba!",
  YOUTUBEERROR:"\u0160patn\u011b vlo\u017een\u00ed link nebo nen\u00ed povoleno p\u0159ehr\u00e1n\u00ed mimo Youtube"}, STATSPOINT:"Body", STATSRANK:"Um\u00edst\u011bn\u00ed", LABELS:{attack:{ATTACKER:"\u00dato\u010dn\u00edk", DEFENDER:"Obr\u00e1nce", MSGHIDAT:"\u00fato\u010dn\u00edk", MSGHIDDE:"obr\u00e1nce", MSGATTUNIT:"\u00dato\u010d\u00edc\u00ed vojsko", MSGDEFUNIT:"Br\u00e1n\u00edc\u00ed vojsko"}, support:{ATTACKER:"Podporuj\u00edc\u00ed", DEFENDER:"Podpo\u0159en\u00fd", MSGHIDAT:"podporuj\u00edc\u00ed",
  MSGHIDDE:"podpo\u0159en\u00fd", MSGATTUNIT:"Podporuj\u00edc\u00ed vojsko", MSGDEFUNIT:"Vojsko obr\u00e1nce"}, espionage:{ATTACKER:"\u0160peh", DEFENDER:"\u0160pehovan\u00fd", MSGHIDAT:"\u0161peh", MSGHIDDE:"\u0161pehovan\u00fd", MSGATTUNIT:"", MSGDEFUNIT:""}}, MSGDETAIL:"podrobnosti o p\u0159\u00edkazu", MSGRETURN:"(n\u00e1vrat)", MSGCLAIM:"Rezervace m\u011bsta", MSGCLAIMPPUP:"Vytvo\u0159it rezervaci", MSGGENBBCODE:"Vytvo\u0159it seznam v BB k\u00f3du", MSGDEFSITE:"Pora\u017een\u00fd...", MSGLOSSITE:"Ztr\u00e1ty...",
  MSGASATT:"...jako \u00fato\u010dn\u00edk", MSGASDEF:"...jako obr\u00e1nce", MSGDIFF1:"neuk\u00e1zat rozd\u00edly", MSGDIFF2:"uk\u00e1zat rozd\u00edly", MSGDIFF3:"uk\u00e1zat jen rozd\u00edly", BBCODELIMIT:"V p\u0159\u00edpad\u011b p\u0159ekro\u010den\u00ed po\u010dtu znak\u016f na jeden p\u0159\u00edsp\u011bvek jsou skupiny odd\u011bleny. Ka\u017ed\u00e1 skupina je odd\u011blena samostatn\u011b.", CHKPOWERNAME:"Zobrazit \u010das zb\u00fdvaj\u00edc\u00ed do mo\u017enosti seslat kouzlo", CHKNIGHTNAME:"Skr\u00fdt m\u011bsta v no\u010dn\u00edm bonusu",
  CHKFORUMTABS:"Nahrazen\u00ed posuvn\u00edku z\u00e1lo\u017eek na f\u00f3ru za v\u00edcero \u0159ad", BTNRESERVE:"Rezervace", LNKRESERVE:"Rezervace", LBLGETRESER:"Z\u00edsk\u00e1v\u00e1n\u00ed dat ...", BTNCHECK:"Kontrolov\u00e1n\u00ed rezervac\u00ed", CHKCMDIMG:"Vid\u011bt ikony p\u0159\u00edkaz\u016f u c\u00edlov\u00fdch m\u011bst", STATSLINK:"Statistiky zobrazovat z", BTNSUPPLAYERS:"Seznam hr\u00e1\u010d\u016f", CHKUNITSCOST:"Hl\u00e1\u0161en\u00ed ukazuje cenu padl\u00fdch jednotek", CHKOCEANNUMBER:"Zobrazit \u010d\u00edsla mo\u0159\u00ed",
  MSGRTLBL:"Informace o vzpou\u0159e", MSGRTSHOW:"P\u0159idat informace o vzpou\u0159e", MSGRTONLINE:"Bude\u0161 online b\u011bhem b\u011b\u017e\u00edc\u00ed vzpoury?", MSGRTYES:"Ano", MSGRTNO:"Ne", MSGRTGOD:"B\u016fh", MSGRTCSTIME:"\u010cas kol. lod\u011b", MSGRTONL:"Online?", MSGRTERR:"Jsi ve \u0161patn\u00e9m m\u011bst\u011b!<br/>Pro vytvo\u0159en\u00ed informac\u00ed o vzpou\u0159e p\u0159ejdi na spr\u00e1vn\u00e9 m\u011bsto: ", BBTEXT:"textov\u00e1 verze", BBHTML:"tabulkov\u00e1 verze", MSG413ERR:"<h3>Vytvo\u0159en\u00e9 hl\u00e1\u0161en\u00ed je p\u0159\u00edli\u0161 velk\u00e9.</h3><p>Vyu\u017eij dostupn\u00fdch mo\u017enost\u00ed pro bezprobl\u00e9mov\u00e9 zredukov\u00e1n\u00ed velikosti.</p>",
  CHKREPORTFORMAT:"Hl\u00e1\u0161en\u00ed v tabulk\u00e1ch", WALLNOTSAVED:"Hradby nejsou ulo\u017eeny", WALLSAVED:"Hradby jsou ulo\u017eeny", POPSELRECRUNIT:"klikni pro zvolen\u00ed v\u00fdchoz\u00ed produkovan\u00e9 jednotky", POPRECRUNITTRADE:"klikni pro dopln\u011bn\u00ed pot\u0159ebn\u00fdch surovin k rekrutaci zvolen\u00e9 jednotky", POPINSERTLASTREPORT:"Vlo\u017eit naposledy konvertov\u00e9 hl\u00e1\u0161en\u00ed", MSGCOPYREPORT:"Hl\u00e1\u0161en\u00ed ulo\u017eeno. Klikni, pros\u00edm na [paste_icon] v okn\u011b f\u00f3ra \u010di zpr\u00e1v pro vlo\u017een\u00ed.",
  POPDISABLEALARM:"Vypnout alarm", SOUNDSETTINGS:"Nastaven\u00ed zvuku", CHKSOUNDMUTE:"Ztlumit", SOUNDVOLUME:"Hlasitost", SOUNDURL:"URL souboru", CHKSOUNDLOOP:"Opakovan\u011b", POPSOUNDLOOP:"P\u0159ehr\u00e1vat opakovan\u011b", POPSOUNDMUTE:"Ztlumit zvuk", POPSOUNDPLAY:"Spustit se sou\u010dasn\u00fdm nastaven\u00edm", POPSOUNDSTOP:"Zastavit p\u0159ehr\u00e1v\u00e1n\u00ed", POPSOUNDURL:"URL cesta k souboru se zvukem", STATS:{PLAYER:"Stats hr\u00e1\u010de", ALLY:"Stats aliance", TOWN:"Stats m\u011bsta",
  INACTIVE:"Neaktivn\u00ed", CHKINACTIVE:"Uk\u00e1zat neaktivn\u00ed hr\u00e1\u010de", INACTIVEDESC:"Za tento \u010das nedo\u0161lo k n\u00e1r\u016fstu bitevn\u00edch ani stavebn\u00edch bod\u016f."}, ABH:{WND:{WINDOWTITLE:"Pomocn\u00edk s rekrutov\u00e1n\u00edm", UNITFRAME:"zvol jednotku", DESCRIPTION1:"V tomto m\u011bst\u011b m\u00e1\u0161 [population] voln\u00e9 populace", DESCRIPTION2:"Dostatek surovin pro stavbu [max_units]", DESCRIPTION3:"[yesno] m\u00e1\u0161 [research] vyzkoum\u00e1n.", DESCRIPTION4:"Do fronty lze za\u0159adit maxim\u00e1ln\u011b [max_queue] jednotek",
  TARGET:"Zvol c\u00edlov\u00fd po\u010det", PACKAGE:"Mno\u017estv\u00ed surovin na z\u00e1silku (jednotky)", BTNSAVE:"Ulo\u017eit nastaven\u00ed", TOOLTIPOK:"klikni pro zvolen\u00ed v\u00fdchoz\u00ed jednotky, na kterou budou pos\u00edl\u00e1ny suroviny", TOOLTIPNOTOK:"jednotka nebyla vyzkoum\u00e1na", HASRESEARCH:"ANO", NORESEARCH:"NE", SETTINGSAVED:"Nastaven\u00ed pro [city] bylo ulo\u017eeno"}, RESWND:{RESLEFT:"suroviny odesl\u00e1ny", IMGTOOLTIP:"klikni pro napln\u011bn\u00ed surovinami"}},
  NEWVERSION:{AVAILABLE:"K dispozici nov\u00e1 verze", REMINDER:"P\u0159ipomenout pozd\u011bji", REQRELOAD:"Po\u017eadov\u00e1no obnoven\u00ed str\u00e1nky", RELOAD:"Obnovit", INSTALL:"Instalovat"}, LANGS:{LANG:"P\u0159eklad pro jazyk:", SEND:"Poslat ke zve\u0159ejn\u011bn\u00ed", SAVE:"Ulo\u017eit & testovat", RESET:"Vr\u00e1tit k v\u00fdchoz\u00edmu jazyku", REMOVE:"Smazat V\u00e1\u0161 p\u0159eklad?"}, HELPTAB5:"P\u0159eklad", BTNSIMUL:"Simul\u00e1tor", EMOTS:{MESS:"Vlo\u017ete odkazy na emotikony, ka\u017ed\u00fd na novou \u0159\u00e1dku.",
  LABEL:"Chcete v\u00edce emotikon\u016f?"}, COMMAND:{ALL:"V\u0161e", FORTOWN:"M\u011bsto:", INCOMING:"P\u0159\u00edchoz\u00ed", OUTGOING:"Odchoz\u00ed", RETURNING:"Vracej\u00edc\u00ed se"}, RADAR:{TOWNFINDER:"Hledat m\u011bsta", FIND:"Hledat", MAXCSTIME:"Maxim\u00e1ln\u00ed dojezd kol. lod\u011b", BTNFIND:"Hledat", TOWNNAME:"M\u011bsto", CSTIME:"\u010cas kol. lod\u011b", TOWNOWNER:"Majitel", TOWNRESERVED:"Rezervace", TOWNPOINTS:"Minim\u00e1ln\u00ed po\u010det bod\u016f", BTNSAVEDEFAULT:"Ulo\u017eit hodnoty jako v\u00fdchoz\u00ed",
  ALL:"Jak\u00e9koliv m\u011bsto"}, LASTUPDATE:"1487459559463", BTNVIEWBB:"BB k\u00f3d", MSGSHOWCOST:"Cena padl\u00fdch jednotek", WALL:{LISTSAVED:"Ulo\u017eeno na hradb\u00e1ch dne", LISTSTATE:"Stav pro hradby z dne", DELETECURRENT:"Smazat sou\u010dasn\u00fd z\u00e1znam", WANTDELETECURRENT:"Chce\u0161 odstranit sou\u010dasn\u00fd z\u00e1znam hradeb?"}, QUESTION:"Dotaz", TSL:{WND:{WINDOWTITLE:"Seznam se\u0159azen\u00fdch m\u011bst", TOOLTIP:"uk\u00e1zat za\u0159azen\u00e9 m\u011bsto"}}, CHKOLDTRADE:"Pou\u017e\u00edt star\u00e9 rozvr\u017een\u00ed obchodu",
  AO:{TITLE:"P\u0159ehled akademie"}, BBIMG:"jeden obr\u00e1zek", POPSOUNDEG:"nap\u0159\u00edklad: https://www.youtube.com/watch?v=v2AC41dglnM, https://youtu.be/v2AC41dglnM, http://www.freesfx.co.uk/rx2/mp3s/10/11532_1406234695.mp3", MOBILEVERSION:"Mobiln\u00ed verze"};
  this.da = {AUTHOR:"pcgeni, Bologna, Hypatia, RAC2720, Beentherebefore, Jiluske, life2", BTNCONV:"Konventere", BTNGENER:"Generere", BTNVIEW:"Smugkig", BTNSAVE:"Gem", MSGTITLE:"Konvert\u00e9r report", MSGQUEST:"Hvilke data \u00f8nsker du at offentligg\u00f8re?", MSGBBCODE:"Ved offentligg\u00f8relse af rapporten, kan du s\u00e6tte bruge den i nyheder og forums ved at bruge BBCode.", MSGRESOURCE:"Plyndring", MSGUNITS:"Enheder", MSGBUILD:"Bygninger", MSGUSC:"Brugte s\u00f8lvm\u00f8nter", MSGRAW:"R\u00e5 materialer",
  SUPPORT:"Hj\u00e6lp", SPY:"Spionere", CONQUER:"Overvundet", LOSSES:"Tab", HIDDEN:"Skjulte", NOTUNIT:"[i]Ingen[/i]", TOWN:"[i]By:[/i] ", PLAYER:"[i]Spiller:[/i] ", ALLY:"[i]Alliance:[/i] ", CAST:"udgiver:", ONTOWER:"P\u00e5 byen:", MSGHIDAD:"Skjul byer", MSGFORUM:"Rapporten vil offentligg\u00f8res", BBALLY:"alliance forums / i beskeden", BBFORUM:"Eksternt forum", ICOCLOSE:"Luk", ICOHELP:"Om konverteren", MSGPREVIEW:"<b>Report overblik</b>", HELPTAB1:"Omkring", HELPTAB2:"Hvordan virker det", HELPTAB3:"\u00c6ndringer",
  HELPTAB4:"Indstillinger", MSGHUMAN:{OK:"Informationerne er gemt", ERROR:"En fejl opstod under skrivning"}, LABELS:{attack:{ATTACKER:"Angriber", DEFENDER:"Forsvarer", MSGHIDAT:"angriber", MSGHIDDE:"forsvarer", MSGATTUNIT:"Angribende h\u00e6r", MSGDEFUNIT:"Forsvarende h\u00e6r"}, support:{ATTACKER:"Hj\u00e6lper", DEFENDER:"Hjulpet", MSGHIDAT:"hj\u00e6lper", MSGHIDDE:"hjulpet", MSGATTUNIT:"St\u00f8tteh\u00e6r", MSGDEFUNIT:"Forsvarende h\u00e6r"}, espionage:{ATTACKER:"Spionere", DEFENDER:"Spioneret",
  MSGHIDAT:"spionere", MSGHIDDE:"udspioneret", MSGATTUNIT:"", MSGDEFUNIT:""}}, MSGDETAIL:"kommando detaljer", MSGRETURN:"(tilbage)", MSGGENBBCODE:"Generere en liste af BBCode", MSGDEFSITE:"Besejret...", MSGLOSSITE:"Tab...", MSGASATT:"...som angriber", MSGASDEF:"...som forsvarer", MSGDIFF1:"vis ikke forskelle", MSGDIFF2:"vis forskelle", MSGDIFF3:"vis kun forskellene", BBCODELIMIT:"Grundet den begr\u00e6nsede tekstm\u00e6ngde i en boks, og for at undg\u00e5 en lang liste, er datasne inddelt i hver deres boks.",
  CHKPOWERNAME:"Vis den tilbagev\u00e6rende tid indtil magien kan bruges", CHKFORUMTABS:"Overskriv scrolls fanerne p\u00e5 forummet for multi line", STATSLINK:"Statistikker fra fremviseren", BTNSUPPLAYERS:"Liste over spillere", CHKUNITSCOST:"Rapporten viser tabene af tabte enheder", CHKOCEANNUMBER:"Vis havnumre", MSGRTLBL:"Opr\u00f8r information", MSGRTSHOW:"tilf\u00f8j igangv\u00e6rende opr\u00f8r information", MSGRTONLINE:"Er du online n\u00e5r det r\u00f8de opr\u00f8r er i gang?", MSGRTYES:"Ja",
  MSGRTNO:"Nej", MSGRTGOD:"Gud", MSGRTCSTIME:"KS tid", MSGRTONL:"til stede?", MSGRTERR:"Du er i den forkerte by!<br/>For at lave den rigtige opr\u00f8rs information, g\u00e5 til byen: ", BBTEXT:"tekst version", BBHTML:"tabel version", MSG413ERR:"<h3>Den generede rapport er for stor.</h3><p>Brug andre muligeheder for at rapportere uden problemer</p>", CHKREPORTFORMAT:"Generer rapport ved brug af tabbeler", WALLNOTSAVED:"Muren er ikke gemt", WALLSAVED:"Muren er gemt", POPSELRECRUNIT:"klik, for at v\u00e6lge standard produktions enhed",
  POPRECRUNITTRADE:"klik, for at inds\u00e6tte de n\u00f8dvendige ressourcer for den valgte enhed", POPINSERTLASTREPORT:"Inds\u00e6t den senest konventerede rapport", MSGCOPYREPORT:"Rapporten er gemt. V\u00e6r s\u00f8d at klikke [paste_icon] p\u00e5 forummet eller under ny besked for at inds\u00e6tte den", POPDISABLEALARM:"Sl\u00e5 alarm fra", SOUNDSETTINGS:"Lyd indstillinger", CHKSOUNDMUTE:"Lydl\u00f8s", SOUNDVOLUME:"Lydstyke", SOUNDURL:"Lyd fil url", CHKSOUNDLOOP:"spring", POPSOUNDLOOP:"Spring i numrene",
  POPSOUNDMUTE:"Sl\u00e5 lyden fra", POPSOUNDPLAY:"Spil med nuv\u00e6rende indstillinger", POPSOUNDSTOP:"Stop afspilning", POPSOUNDURL:"Url sti til lydfilen", STATS:{PLAYER:"Spiller statistik", ALLY:"Alliance statistik", TOWN:"By statistik", CHKINACTIVE:"Vis inaktive spillere", INACTIVE:"Inaktive"}, ABH:{WND:{WINDOWTITLE:"GRCRTools H\u00e6r Bygnings Hj\u00e6lper", UNITFRAME:"v\u00e6lg din enhed", DESCRIPTION1:"I denne by, har du [population] fri befolkning", DESCRIPTION2:"Hvilket er nok til at rekruttere [max_units]",
  DESCRIPTION3:"Du [yesno] har udforsket  [research].", DESCRIPTION4:"Du kan maximalt s\u00e6tte [max_queue] enheder igang   ", TARGET:"v\u00e6lg dit byggem\u00e5l", PACKAGE:"ressourcer per bestilling (enhed)", BTNSAVE:"gem indstillingerne", TOOLTIPOK:"klik, for at v\u00e6lge enhed du vil sende resourser til", TOOLTIPNOTOK:"enheder er ikke udforsket", HASRESEARCH:"G\u00d8R", NORESEARCH:"G\u00d8R IKKE", SETTINGSAVED:"Ops\u00e6tningen for [by] er gemt"}, RESWND:{RESLEFT:"tilg\u00e6ngelige ressourcer",
  IMGTOOLTIP:"klik, for at inds\u00e6tte ressourcer"}}, NEWVERSION:{AVAILABLE:"Ny version tilg\u00e6ngelig", INSTALL:"Installer", REMINDER:"P\u00e5mind mig senere", REQRELOAD:"Kr\u00e6ver genindl\u00e6sning af siden", RELOAD:"Genindl\u00e6s"}, LANGS:{LANG:"Overs\u00e6ttelse for sprog:", SEND:"Send til publikatoren", SAVE:"Gem og test", RESET:"Gendan standard sproget", REMOVE:"Slet din overs\u00e6tning"}, HELPTAB5:"Overs\u00e6ttelse", ATTACKER:"Angribere", DEFENDER:"Forsvarer", MSGHIDAT:"angriber",
  MSGHIDDE:"forsvarer", MSGATTUNIT:"H\u00e6r angreb", MSGDEFUNIT:"H\u00e6r forsvarere", EMOTS:{LABEL:"Vil du have flere smilieys?", MESS:"Inds\u00e6t links til smilieys, hver p\u00e5 en ny linie"}, COMMAND:{ALL:"Alle", INCOMING:"indkommende", OUTGOING:"udg\u00e5ende", RETURNING:"retur", FORTOWN:"by:"}, BTNSIMUL:"Simulatoren", LASTUPDATE:"1488487738325", BTNVIEWBB:"BB-KODE", MSGSHOWCOST:"Omkostninger ved mistede enheder", BBIMG:"enkelt billede", POPSOUNDEG:"eksempel: https://www.youtube.com/watch?v=v2AC41dglnM, https://youtu.be/v2AC41dglnM, http://www.freesfx.co.uk/rx2/mp3s/10/11532_1406234695.mp3",
  RADAR:{TOWNFINDER:"S\u00f8g byer", FIND:"S\u00f8g", MAXCSTIME:"Maksimal tid", MAXUNITTIME:"Maksimal tid", BTNFIND:"S\u00f8g", TOWNNAME:"By", UNITTIME:"Time", TOWNOWNER:"Ejer", BTNSAVEDEFAULT:"Gem v\u00e6rdier som standard"}, QUESTION:"Sp\u00f8rgsm\u00e5l"};
  this.de = {INFO:{0:"Potusek", 1:"grepolis@potusek.eu"}, WEBSITE:"Strona domowa", AUTHOR:"Kartuga-Chipssi1@gmx.net, Lupo22, Jordan06, Gliese 558, Luccer", BTNCONV:"Konvertieren", BTNGENER:"Generieren", BTNSRC:"Quelle", BTNVIEW:"Vorschau", BTNSAVE:"Speichern", BTNMARKS:"Als gelesen markieren", BTNMARKA:"Markieren Sie alle als gelesen", MSGTITLE:"Konvertiere den Report", MSGQUEST:"Welche Daten willst du ver\u00f6ffentlichen?", MSGALL:"Alle", MSGBBCODE:"Nach der Ver\u00f6ffentlichung des Berichts kannst du die News in internen und externen Foren ver\u00f6ffentlichen.",
  MSGRESOURCE:"Beute", MSGUNITS:"Einheiten", MSGBUILD:"Geb\u00e4ude", MSGUSC:"Verwendete Silberm\u00fcnzen", MSGRAW:"Rohstoffe", SUPPORT:"Unterst\u00fctzung", SPY:"Spionage", CONQUER:"Erobert", LOSSES:"Verluste", HIDDEN:"Versteckt", NOTUNIT:"[i]Keine[/i]", TOWN:"[i]Stadt:[/i] ", PLAYER:"[i]Spieler:[/i] ", ALLY:"[i]Allianz:[/i] ", CAST:"Besetzung:", ONTOWER:"In der Stadt:", MSGHIDAD:"St\u00e4dte ausblenden", MSGFORUM:"Der Bericht wird ver\u00f6ffentlicht", BBALLY:"Allianz Forum / in Nachrichten",
  BBFORUM:"Externes Forum", ERRGETSRC:"Ist ein Fehler aufgetreten! Bitte, generiere mir die Quelle und senden Sie als Anhang an die Adresse potusek@westtax.info", ICOCLOSE:"Schlie\u00dfen", ICOHELP:"\u00dcber den Konverter", MSGPREVIEW:"<b>Bericht-Vorschau</b>", HELPTAB1:"\u00dcber", HELPTAB2:"Wie funktioniert es?", HELPTAB3:"\u00c4nderungen", HELPTAB4:"Einstellungen", HLPVERSION:"Version", HLPFIXED:"Fixed", HLPADDED:"Added", MSGHUMAN:{OK:"Die Informationen wurden gespeichert", ERROR:"Fehler beim Schreiben",
  YOUTUBEERROR:"Fehlerhafter Link oder nicht au\u00dferhalb von Youtube erlaubt abzuspielen"}, STATS:"Player stats", STATSPOINT:"Points", STATSRANK:"Rank", LABELS:{attack:{ATTACKER:"Angreifer", DEFENDER:"Verteidiger", MSGHIDAT:"Angreifer", MSGHIDDE:"Verteidiger", MSGATTUNIT:"Armee angreifer", MSGDEFUNIT:"Armee verteidiger"}, support:{ATTACKER:"Unterst\u00fctzung", DEFENDER:"Unterst\u00fctzte", MSGHIDAT:"tragende", MSGHIDDE:"unterst\u00fctzt", MSGATTUNIT:"Armee Unterst\u00fctzung", MSGDEFUNIT:"Armee Verteidigung"},
  espionage:{ATTACKER:"Spion", DEFENDER:"spioniert", MSGHIDAT:"spionieren", MSGHIDDE:"ausspionierte Stadt", MSGATTUNIT:"", MSGDEFUNIT:""}}, MSGDETAIL:"Befehl Details", MSGRETURN:"(r\u00fcckkehr)", MSGCLAIM:"Reservierte Stadt", MSGCLAIMPPUP:"Generieren Reservation", MSGDEFSITE:"Besiegt...", MSGLOSSITE:"Verluste...", MSGASATT:"...als Angreifer", MSGASDEF:"...als Verteidiger", MSGDIFF:"zeige unterschiede", MSGDIFF1:"zeige keine Unterschiede", MSGDIFF2:"Zeige Unterschiede", MSGDIFF3:"zeige nur die Unterschiede",
  BBCODELIMIT:"In Anbetracht der begrenzten Menge des Textes in einem Pfosten, im Falle einer langen Liste, wurden die Daten in Gruppen aufgeteilt. Jede Gruppe wird als separater Eintrag eingef\u00fcgt.", CHKPOWERNAME:"Zeigt die verbleibende Zeit auf die M\u00f6glichkeit der Verwendung des Zaubers", CHKFORUMTABS:"Ersetzt das bl\u00e4ttern Forum Reiter werden in 2 Reihen angezeigt", BTNRESERVE:"Booking", LNKRESERVE:"Reservierungen", LBLGETRESER:"Erste Daten ...", BTNCHECK:"\u00dcberpr\u00fcfen Vorbehalte",
  CHKCMDIMG:"View the icons for the destination city commands", STATSLINK:"Statistiken anzeigen \u00fcber", BTNSUPPLAYERS:"Liste der Spieler", CHKUNITSCOST:"Im Bericht werden die Kosten f\u00fcr verlorene Einheiten angezeigt", CHKOCEANNUMBER:"Display numbers seas", MSGRTYES:"Ja", MSGRTNO:"Nein", MSGGENBBCODE:"Erstelle die Liste als BBCode", BBTEXT:"Text-Version", BBHTML:"Tabellen-Version", WALLNOTSAVED:"Die Stadtmauer ist nicht gespeichert", WALLSAVED:"Die Stadtmauer ist gespeichert", POPINSERTLASTREPORT:"Einf\u00fcgen vom letzten erstellten Bericht",
  POPDISABLEALARM:"Alarm ausschalten", SOUNDSETTINGS:"Sound Einstellungen", ABH:{WND:{UNITFRAME:"Einheit w\u00e4hlen", DESCRIPTION1:"Du hast in dieser Stadt [population] freie Bev\u00f6lkerung", BTNSAVE:"Einstellungen speichern", SETTINGSAVED:"Einstellungen f\u00fcr [city] wurden gespeichert", DESCRIPTION2:"Das reicht f\u00fcr den Bau von [max_units]", DESCRIPTION3:"Die Forschung [research] [yesno] erforscht.", HASRESEARCH:"IST", NORESEARCH:"IST NICHT", DESCRIPTION4:"Es k\u00f6nnen [max_queue] Einheiten gebaut werden.",
  WINDOWTITLE:"Armee aufbauen", TARGET:"w\u00e4hle deine Bauziel", PACKAGE:"Rohstoff-Paket pro Sendung (Einheiten)", TOOLTIPOK:"Klicken, um die standardm\u00e4\u00dfige Einheit auszuw\u00e4hlen, f\u00fcr die du Rohstoffe sendest", TOOLTIPNOTOK:"Einheit nicht erforscht"}, RESWND:{IMGTOOLTIP:"Klicken, um Rohstoffe einzuf\u00fcgen", RESLEFT:"\u00dcbrige Rohstoff zum senden"}}, NEWVERSION:{REMINDER:"sp\u00e4ter erinnern", AVAILABLE:"Neue Version verf\u00fcgbar", INSTALL:"Installieren", REQRELOAD:"Aktualisierung erforderlich",
  RELOAD:"Aktualisierung "}, LANGS:{LANG:"\u00dcbersetzung in Sprache:", REMOVE:"Deine \u00dcbersetzung l\u00f6schen?", RESET:"Auf standardm\u00e4\u00dfige Sprache zur\u00fccksetzen", SAVE:"Speichern & Testen", SEND:"Senden zum Ver\u00f6ffentlichen"}, HELPTAB5:"\u00dcbersetzung", POPSOUNDURL:"Url Pfad zur Musik-Datei", SOUNDVOLUME:"Lautst\u00e4rke", MSGCOPYREPORT:"Der Bericht wurde gespeichert.Click [paste_icon] um den Bericht im Forum oder einer Nachricht einzuf\u00fcgen.", POPSOUNDSTOP:"Wiedergabe stoppen",
  MSGSHOWCOST:"Kosten f\u00fcr verlorene Einheiten", MSGRTLBL:"Revolte Informationen", MSGRTSHOW:"hinzuf\u00fcgen eingehende Revolte Informationen", MSGRTONLINE:"Werden Sie w\u00e4hrend der roten Revolte online sein?", MSGRTGOD:"Gott", MSGRTCSTIME:"CS Zeit", MSGRTONL:"Online?", MSGRTERR:"Sie befinden sich in der falschen Stadt!<br/>Um Informationen \u00fcber die Revolte zu erstellen, gehe bitte zur Stadt: ", MSG413ERR:"<h3>Der generierte Bericht ist zu gro\u00df.</h3><p>Verwende die verf\u00fcgbaren Optionen zum reduzieren und um ohne Probleme zu ver\u00f6ffentlichen.</p>",
  CHKREPORTFORMAT:"Erstellen Sie Berichte mit Hilfe von Tabellen", POPSELRECRUNIT:"Klicken, um Standard-Produktionseinheit zu w\u00e4hlen", CHKSOUNDMUTE:"Stumm", SOUNDURL:"Musik-Datei URL", CHKSOUNDLOOP:"Schleife", POPSOUNDLOOP:"Spiele in Schleife ab", POPSOUNDMUTE:"Schalte den Ton stumm", POPSOUNDPLAY:"Spiele mit den aktuellen Einstellungen", EMOTS:{LABEL:"Willst du mehr Emoticons?", MESS:"Link einf\u00fcgen zu Emoticon, jeden in einer neuen Zeile."}, COMMAND:{ALL:"Alles", INCOMING:"Eingehend",
  OUTGOING:"Ausgehend", RETURNING:"R\u00fcckkehr", FORTOWN:"Stadt:"}, RADAR:{TOWNFINDER:"Suche St\u00e4dte", FIND:"Suchen", MAXCSTIME:"Maximale Zeit Kolonieschiff", BTNFIND:"Suchen", TOWNNAME:"Stadt", CSTIME:"Zeit Kolonieschiff ", TOWNOWNER:"Besitzer", TOWNRESERVED:"Reservierung", TOWNPOINTS:"Minimale Stadtpunkte", BTNSAVEDEFAULT:"Werte als Standard speichern", ALL:"Jede Stadt"}, TSL:{WND:{TOOLTIP:"zeige Sortiert nach Ort", WINDOWTITLE:"St\u00e4dte Liste sortiert"}}, QUESTION:"Frage", WALL:{LISTSAVED:"Gespeichert auf der Mauer der Tag",
  LISTSTATE:"Beschaffenheit der Mauer an dem Tag", DELETECURRENT:"L\u00f6sche den aktuellen Datensatz", WANTDELETECURRENT:"M\u00f6chtest du den aktuellen Speicherstand der Mauer entfernen?"}, CHKWONDERTRADE:"Wenn Resourcen f\u00fcr Weltwunder gesendet werden, sende den maximal m\u00f6glichen Betrag", MOBILEVERSION:"Mobile Version", AO:{TITLE:"Akademie \u00dcberblick"}, CHKOLDTRADE:"Altes Layout verwenden", POPSOUNDEG:"Beispiel: https://www.youtube.com/watch?v=v2AC41dglnM, https://youtu.be/v2AC41dglnM, http://www.freesfx.co.uk/rx2/mp3s/10/11532_1406234695.mp3",
  POPRECRUNITTRADE:"Klicken, um fehlende Rohstoffe f\u00fcr die Rekrutierung der ausgew\u00e4hlten Einheit auszuf\u00fcllen", BBIMG:"Einzelnes Bild", LASTUPDATE:"1487463932539"};
  this.el = {AUTHOR:"moutza, stathisss21, Akis27274, george696969, StikElLoco, ironvaggosOFFICIAL", BTNCONV:"\u039c\u03b5\u03c4\u03b1\u03c4\u03c1\u03bf\u03c0\u03ae", BTNGENER:"\u0394\u03b7\u03bc\u03b9\u03bf\u03c5\u03c1\u03b3\u03af\u03b1", BTNVIEW:"\u03a0\u03c1\u03bf\u03b5\u03c0\u03b9\u03c3\u03ba\u03cc\u03c0\u03b7\u03c3\u03b7", BTNSAVE:"\u0391\u03c0\u03bf\u03b8\u03ae\u03ba\u03b5\u03c5\u03c3\u03b7", MSGTITLE:"\u039c\u03b5\u03c4\u03b1\u03c4\u03c1\u03bf\u03c0\u03ae \u03b1\u03bd\u03b1\u03c6\u03bf\u03c1\u03ac\u03c2",
  MSGQUEST:"\u03a0\u03bf\u03b9\u03b1 \u03b1\u03c0\u03cc \u03c4\u03b1 \u03b4\u03b5\u03b4\u03bf\u03bc\u03ad\u03bd\u03b1 \u03b8\u03b5\u03c2 \u03bd\u03b1 \u03b4\u03b7\u03bc\u03bf\u03c3\u03b9\u03b5\u03cd\u03c3\u03b5\u03b9\u03c2;", MSGBBCODE:"\u039c\u03b5\u03c4\u03ac \u03c4\u03b7 \u03b4\u03b7\u03bc\u03bf\u03c3\u03af\u03b5\u03c5\u03c3\u03b7 \u03c4\u03b7\u03c2 \u03b1\u03bd\u03b1\u03c6\u03bf\u03c1\u03ac\u03c2, \u03bc\u03c0\u03bf\u03c1\u03b5\u03af\u03c4\u03b5 \u03bd\u03b1 \u03c4\u03b7 \u03c3\u03c5\u03bd\u03b4\u03c5\u03ac\u03c3\u03b5\u03c4\u03b5 \u03bc\u03b5 \u03bd\u03ad\u03b1 \u03ba\u03b1\u03b9 \u03c6\u03cc\u03c1\u03bf\u03c5\u03bc\u03c2 \u03c7\u03c1\u03b7\u03c3\u03b9\u03bc\u03bf\u03c0\u03bf\u03b9\u03ce\u03bd\u03c4\u03b1\u03c2 \u03c4\u03bf BBCode.",
  MSGRESOURCE:"\u039b\u03ac\u03c6\u03c5\u03c1\u03b1", MSGUNITS:"\u039c\u03bf\u03bd\u03ac\u03b4\u03b5\u03c2", MSGBUILD:"\u039a\u03c4\u03af\u03c1\u03b9\u03b1", MSGUSC:"\u03a7\u03c1\u03b7\u03c3\u03b9\u03bc\u03bf\u03c0\u03bf\u03b9\u03b7\u03bc\u03ad\u03bd\u03b1 \u03b1\u03c3\u03b7\u03bc\u03ad\u03bd\u03b9\u03b1 \u03bd\u03bf\u03bc\u03af\u03c3\u03bc\u03b1\u03c4\u03b1", MSGRAW:"\u03a5\u03bb\u03b9\u03ba\u03ac \u03ba\u03b1\u03c4\u03b1\u03c3\u03ba\u03b5\u03c5\u03ae\u03c2", SUPPORT:"\u03a5\u03c0\u03bf\u03c3\u03c4\u03ae\u03c1\u03b9\u03be\u03b7",
  SPY:"\u039a\u03b1\u03c4\u03b1\u03c3\u03ba\u03bf\u03c0\u03af\u03b1", CONQUER:"\u039a\u03b1\u03c4\u03ac\u03ba\u03c4\u03b7\u03c3\u03b7", LOSSES:"\u0391\u03c0\u03ce\u03bb\u03b5\u03b9\u03b5\u03c2", HIDDEN:"\u039a\u03c1\u03c5\u03bc\u03bc\u03ad\u03bd\u03b1", NOTUNIT:"[i]\u039a\u03b1\u03bd\u03ad\u03bd\u03b1\u03c2[/i]", TOWN:"[i]\u03a0\u03cc\u03bb\u03b7:[/i] ", PLAYER:"[i]\u03a0\u03b1\u03af\u03c7\u03c4\u03b7\u03c2:[/i] ", ALLY:"[i]\u03a3\u03c5\u03bc\u03bc\u03b1\u03c7\u03af\u03b1:[/i] ", CAST:"\u03b5\u03be\u03b1\u03c0\u03cc\u03bb\u03c5\u03c3\u03b7:",
  ONTOWER:"\u039c\u03b5\u03c2 \u03c4\u03b7\u03bd \u03c0\u03cc\u03bb\u03b7:", MSGHIDAD:"\u039a\u03c1\u03cd\u03c8\u03b5 \u03c4\u03b9\u03c2 \u03c0\u03cc\u03bb\u03b5\u03b9\u03c2", MSGFORUM:"\u0397 \u03b1\u03bd\u03b1\u03c6\u03bf\u03c1\u03ac \u03b8\u03b1 \u03b4\u03b7\u03bc\u03bf\u03c3\u03b9\u03b5\u03c5\u03b8\u03b5\u03af", BBALLY:"\u03c3\u03c5\u03bc\u03bc\u03b1\u03c7\u03b9\u03ba\u03cc \u03c6\u03cc\u03c1\u03bf\u03c5\u03bc / \u03c3\u03b5 \u03bc\u03ae\u03bd\u03c5\u03bc\u03b1", BBFORUM:"\u03b5\u03be\u03c9\u03c4\u03b5\u03c1\u03b9\u03ba\u03cc \u03c6\u03cc\u03c1\u03bf\u03c5\u03bc",
  ICOCLOSE:"\u039a\u03bb\u03b5\u03b9\u03c3\u03c4\u03cc", ICOHELP:"\u03a3\u03c7\u03b5\u03c4\u03b9\u03ba\u03ac \u03bc\u03b5 \u03c4\u03bf\u03bd \u039c\u03b5\u03c4\u03b1\u03c4\u03c1\u03bf\u03c0\u03ad\u03b1", MSGPREVIEW:"<b>\u03a0\u03c1\u03bf\u03b5\u03c0\u03b9\u03c3\u03ba\u03cc\u03c0\u03b7\u03c3\u03b7 \u0391\u03bd\u03b1\u03c6\u03bf\u03c1\u03ac\u03c2</b>", HELPTAB1:"\u03a3\u03c7\u03b5\u03c4\u03b9\u03ba\u03ac \u03bc\u03b5", HELPTAB2:"\u03a0\u03c9\u03c2 \u03bb\u03b5\u03b9\u03c4\u03bf\u03c5\u03c1\u03b3\u03b5\u03af",
  HELPTAB3:"\u0391\u03bb\u03bb\u03b1\u03b3\u03ad\u03c2", HELPTAB4:"\u03a1\u03c5\u03b8\u03bc\u03af\u03c3\u03b5\u03b9\u03c2", MSGHUMAN:{OK:"\u039f\u03b9 \u03c0\u03bb\u03b7\u03c1\u03bf\u03c6\u03bf\u03c1\u03af\u03b5\u03c2 \u03ad\u03c7\u03bf\u03c5\u03bd \u03b1\u03c0\u03bf\u03b8\u03b7\u03ba\u03b5\u03c5\u03c4\u03b5\u03af", ERROR:"\u0388\u03bd\u03b1 \u03c3\u03c6\u03ac\u03bb\u03bc\u03b1 \u03c0\u03b1\u03c1\u03bf\u03c5\u03c3\u03b9\u03ac\u03c3\u03c4\u03b7\u03ba\u03b5 \u03ba\u03b1\u03b8\u03ce\u03c2 \u03b3\u03c1\u03ac\u03c6\u03b1\u03c4\u03b5",
  YOUTUBEERROR:"\u039b\u03ac\u03b8\u03bf\u03c2 \u03c3\u03cd\u03bd\u03b4\u03b5\u03c3\u03bc\u03bf\u03c2 \u03ae \u03b4\u03b5\u03bd \u03b5\u03c0\u03b9\u03c4\u03c1\u03ad\u03c0\u03b5\u03c4\u03b5 \u03b7 \u03b1\u03bd\u03b1\u03c0\u03b1\u03c1\u03b1\u03b3\u03c9\u03b3\u03ae \u03b5\u03ba\u03c4\u03cc\u03c2 \u03b1\u03c0\u03cc \u03c4\u03bf YouTube"}, LABELS:{attack:{ATTACKER:"\u0395\u03c0\u03b9\u03c4\u03b9\u03b8\u03ad\u03bc\u03b5\u03bd\u03bf\u03c2", DEFENDER:"\u0391\u03bc\u03c5\u03bd\u03cc\u03bc\u03b5\u03bd\u03bf\u03c2",
  MSGHIDAT:"\u03b5\u03c0\u03b9\u03c4\u03b9\u03b8\u03ad\u03bc\u03b5\u03bd\u03bf\u03c5", MSGHIDDE:"\u03b1\u03bc\u03c5\u03bd\u03cc\u03bc\u03b5\u03bd\u03bf\u03c5", MSGATTUNIT:"\u03a3\u03c4\u03c1\u03b1\u03c4\u03cc\u03c2 \u03c0\u03bf\u03c5 \u03b5\u03c0\u03b9\u03c4\u03b5\u03af\u03b8\u03b5\u03c4\u03b5", MSGDEFUNIT:"\u03a3\u03c4\u03c1\u03b1\u03c4\u03cc\u03c2 \u03c0\u03bf\u03c5 \u03b1\u03bc\u03cd\u03bd\u03b5\u03c4\u03b5"}, support:{ATTACKER:"\u03a5\u03c0\u03bf\u03c3\u03c4\u03b7\u03c1\u03af\u03b6\u03c9", DEFENDER:"\u03a5\u03c0\u03bf\u03c3\u03c4\u03b7\u03c1\u03af\u03b6\u03bf\u03bc\u03b1\u03b9",
  MSGHIDAT:"\u03c5\u03c0\u03bf\u03c3\u03c4\u03b7\u03c1\u03af\u03b6\u03c9", MSGHIDDE:"\u03c5\u03c0\u03bf\u03c3\u03c4\u03b7\u03c1\u03af\u03b6\u03bf\u03bc\u03b1\u03b9", MSGATTUNIT:"\u03a3\u03c4\u03c1\u03b1\u03c4\u03cc\u03c2 \u03c0\u03bf\u03c5 \u03c5\u03c0\u03bf\u03c3\u03c4\u03b7\u03c1\u03af\u03b6\u03b5\u03b9", MSGDEFUNIT:"\u03a3\u03c4\u03c1\u03b1\u03c4\u03cc\u03c2 \u03c0\u03bf\u03c5 \u03b1\u03bc\u03cd\u03bd\u03b5\u03c4\u03b5"}, espionage:{ATTACKER:"\u039a\u03b1\u03c4\u03b1\u03c3\u03ba\u03bf\u03c0\u03b5\u03cd\u03b5\u03b9",
  DEFENDER:"\u039a\u03b1\u03c4\u03b1\u03c3\u03ba\u03bf\u03c0\u03b5\u03cd\u03b5\u03c4\u03b5", MSGHIDAT:"\u03ba\u03b1\u03c4\u03b1\u03c3\u03ba\u03bf\u03c0\u03b5\u03cd\u03b5\u03b9", MSGHIDDE:"\u03ba\u03b1\u03c4\u03b1\u03c3\u03ba\u03bf\u03c0\u03b5\u03cd\u03b5\u03c4\u03b1\u03b9", MSGATTUNIT:"", MSGDEFUNIT:""}}, MSGDETAIL:"\u03bb\u03b5\u03c0\u03c4\u03bf\u03bc\u03ad\u03c1\u03b5\u03b9\u03b5\u03c2 \u03b5\u03bd\u03c4\u03bf\u03bb\u03ae\u03c2", MSGRETURN:"(\u03b5\u03c0\u03b9\u03c3\u03c4\u03c1\u03bf\u03c6\u03ae)",
  MSGGENBBCODE:"\u0394\u03b7\u03bc\u03b9\u03bf\u03c5\u03c1\u03b3\u03af\u03b1 \u03bb\u03af\u03c3\u03c4\u03b1\u03c2 \u03c4\u03c9\u03bd BBCode", MSGDEFSITE:"\u0397\u03c4\u03c4\u03ae\u03b8\u03b7\u03ba\u03b1\u03bd...", MSGLOSSITE:"\u0391\u03c0\u03ce\u03bb\u03b5\u03b9\u03b5\u03c2...", MSGASATT:"...\u03c9\u03c2 \u03b5\u03c0\u03b9\u03c4\u03b9\u03b8\u03ad\u03bc\u03b5\u03bd\u03bf\u03b9", MSGASDEF:"...\u03c9\u03c2 \u03b1\u03bc\u03c5\u03bd\u03cc\u03bc\u03b5\u03bd\u03bf\u03b9", MSGDIFF1:"\u03bc\u03b7\u03bd \u03b4\u03b5\u03af\u03c7\u03bd\u03b5\u03b9\u03c2 \u03c4\u03b9\u03c2 \u03b4\u03b9\u03b1\u03c6\u03bf\u03c1\u03ad\u03c2",
  MSGDIFF2:"\u03b4\u03b5\u03af\u03be\u03b5 \u03c4\u03b9\u03c2 \u03b4\u03b9\u03b1\u03c6\u03bf\u03c1\u03ad\u03c2", MSGDIFF3:"\u03b4\u03b5\u03af\u03be\u03b5 \u03bc\u03cc\u03bd\u03bf \u03c4\u03b9\u03c2 \u03b4\u03b9\u03b1\u03c6\u03bf\u03c1\u03ad\u03c2", BBCODELIMIT:"\u0395\u03bd\u03cc\u03c8\u03b5\u03b9 \u03c4\u03bf\u03c5 \u03c0\u03b5\u03c1\u03b9\u03bf\u03c1\u03b9\u03c3\u03bc\u03ad\u03bd\u03bf\u03c5 \u03c0\u03bf\u03c3\u03bf\u03cd \u03c4\u03c9\u03bd \u03ba\u03b5\u03b9\u03bc\u03ad\u03bd\u03c9\u03bd \u03c3\u03b5 \u03bc\u03af\u03b1 \u03b8\u03ad\u03c3\u03b7, \u03c3\u03c4\u03b7\u03bd \u03c0\u03b5\u03c1\u03af\u03c0\u03c4\u03c9\u03c3\u03b7 \u03b5\u03bd\u03cc\u03c2 \u03bc\u03b1\u03ba\u03c1\u03bf\u03cd \u03ba\u03b1\u03c4\u03b1\u03bb\u03cc\u03b3\u03bf\u03c5, \u03c4\u03b1 \u03b4\u03b5\u03b4\u03bf\u03bc\u03ad\u03bd\u03b1 \u03c7\u03c9\u03c1\u03af\u03b6\u03bf\u03bd\u03c4\u03b1\u03b9 \u03c3\u03b5 \u03bf\u03bc\u03ac\u03b4\u03b5\u03c2. \u039a\u03ac\u03b8\u03b5 \u03bf\u03bc\u03ac\u03b4\u03b1 \u03b5\u03c0\u03b9\u03ba\u03bf\u03bb\u03bb\u03ac\u03c4\u03b1\u03b9 \u03c9\u03c2 \u03be\u03b5\u03c7\u03c9\u03c1\u03b9\u03c3\u03c4\u03ae \u03b5\u03af\u03c3\u03bf\u03b4\u03bf.",
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
  INACTIVE:"\u0391\u03bd\u03b5\u03bd\u03b5\u03c1\u03b3\u03cc\u03c2", CHKINACTIVE:"\u03a0\u03c1\u03bf\u03b2\u03bf\u03bb\u03ae \u03b1\u03bd\u03b5\u03bd\u03b5\u03c1\u03b3\u03ce\u03bd \u03c0\u03b1\u03b9\u03c7\u03c4\u03ce\u03bd", INACTIVEDESC:"\u03a3\u03b5 \u03b1\u03c5\u03c4\u03cc \u03c4\u03bf \u03c7\u03c1\u03cc\u03bd\u03bf \u03b4\u03b5\u03bd \u03c5\u03c0\u03ae\u03c1\u03c7\u03b1\u03bd \u03c0\u03cc\u03bd\u03c4\u03bf\u03b9 \u03bc\u03ac\u03c7\u03b7\u03c2 \u03ba\u03b1\u03b9 \u03b5\u03c0\u03b5\u03ba\u03c4\u03ac\u03c3\u03b5\u03b9\u03c2"},
  ABH:{WND:{WINDOWTITLE:"\u03a7\u03c4\u03af\u03c3\u03c4\u03b7\u03c2 \u03c3\u03c4\u03c1\u03b1\u03c4\u03bf\u03cd", UNITFRAME:"\u03b4\u03b9\u03ac\u03bb\u03b5\u03be\u03b5 \u03c4\u03b7 \u03bc\u03bf\u03bd\u03ac\u03b4\u03b1 \u03c3\u03bf\u03c5", DESCRIPTION1:"\u03a3\u03b5 \u03b1\u03c5\u03c4\u03ae\u03bd \u03c4\u03b7\u03bd \u03c0\u03cc\u03bb\u03b7, \u03ad\u03c7\u03b5\u03b9\u03c2 [population] \u03b5\u03bb\u03b5\u03cd\u03b8\u03b5\u03c1\u03bf \u03c0\u03bb\u03b7\u03b8\u03c5\u03c3\u03bc\u03cc", DESCRIPTION2:"\u039f \u03bf\u03c0\u03bf\u03af\u03bf\u03c2 \u03b5\u03af\u03bd\u03b1\u03b9 \u03b1\u03c1\u03ba\u03b5\u03c4\u03cc\u03c2 \u03b3\u03b9\u03b1 \u03bd\u03b1 \u03c6\u03c4\u03ac\u03be\u03b5\u03b9\u03c2 [max_units]",
  DESCRIPTION3:"[yesno] \u03c4\u03b7\u03bd \u03ad\u03c1\u03b5\u03c5\u03bd\u03b1 [research] \u03b5\u03c1\u03b5\u03c5\u03bd\u03b7\u03bc\u03ad\u03bd\u03b7.", DESCRIPTION4:"\u039c\u03c0\u03bf\u03c1\u03b5\u03af\u03c2 \u03bd\u03b1 \u03b2\u03ac\u03bb\u03b5\u03b9\u03c2 \u03c3\u03b5 \u03bf\u03c5\u03c1\u03ac \u03c4\u03bf \u03bc\u03ad\u03b3\u03b9\u03c3\u03c4\u03bf \u03c4\u03c9\u03bd [max_queue] \u03bc\u03bf\u03bd\u03ac\u03b4\u03c9\u03bd", TARGET:"\u03b5\u03c0\u03b9\u03bb\u03ad\u03be\u03c4\u03b5 \u03c4\u03bf\u03bd \u03ba\u03b1\u03c4\u03b1\u03c3\u03ba\u03b5\u03c5\u03b1\u03c3\u03c4\u03b9\u03ba\u03cc \u03c3\u03b1\u03c2 \u03c3\u03c4\u03cc\u03c7\u03bf",
  PACKAGE:"\u03c0\u03b1\u03ba\u03ad\u03c4\u03bf \u03c4\u03c9\u03bd \u03c0\u03cc\u03c1\u03c9\u03bd \u03b1\u03bd\u03ac \u03b1\u03c0\u03bf\u03c3\u03c4\u03bf\u03bb\u03ae (\u03bc\u03bf\u03bd\u03ac\u03b4\u03b5\u03c2)", BTNSAVE:"\u03b1\u03c0\u03bf\u03b8\u03ae\u03ba\u03b5\u03c5\u03c3\u03b7 \u03c1\u03c5\u03b8\u03bc\u03af\u03c3\u03b5\u03c9\u03bd", TOOLTIPOK:"\u03ba\u03bb\u03b9\u03ba, \u03b3\u03b9\u03b1 \u03bd\u03b1 \u03b5\u03c0\u03b9\u03bb\u03ad\u03be\u03b5\u03c4\u03b5 \u03c4\u03b7\u03bd \u03c0\u03c1\u03bf\u03b5\u03c0\u03b9\u03bb\u03b5\u03b3\u03bc\u03ad\u03bd\u03b7 \u03bc\u03bf\u03bd\u03ac\u03b4\u03b1 \u03b3\u03b9\u03b1 \u03c4\u03b7\u03bd \u03bf\u03c0\u03bf\u03af\u03b1 \u03b8\u03b1 \u03c3\u03c4\u03b5\u03af\u03bb\u03b5\u03c4\u03b5 \u03c0\u03cc\u03c1\u03bf\u03c5\u03c2",
  TOOLTIPNOTOK:"\u03b7 \u03bc\u03bf\u03bd\u03ac\u03b4\u03b1 \u03b4\u03b5\u03bd \u03ad\u03c7\u03b5\u03b9 \u03b5\u03c1\u03b5\u03c5\u03bd\u03b7\u03b8\u03b5\u03af", HASRESEARCH:"\u0388\u03c7\u03b5\u03b9\u03c2", NORESEARCH:"\u0394\u0395\u039d \u03ad\u03c7\u03b5\u03b9\u03c2", SETTINGSAVED:"\u039f\u03b9 \u03c1\u03c5\u03b8\u03bc\u03af\u03c3\u03b5\u03b9\u03c2 \u03b3\u03b9\u03b1 \u03c4\u03b7\u03bd [\u03c0\u03cc\u03bb\u03b7] \u03ad\u03c7\u03bf\u03c5\u03bd \u03b1\u03c0\u03bf\u03b8\u03b7\u03ba\u03b5\u03c5\u03c4\u03b5\u03af"},
  RESWND:{RESLEFT:"\u03c0\u03cc\u03c1\u03bf\u03b9 \u03c0\u03bf\u03c5 \u03b1\u03c0\u03bf\u03bc\u03ad\u03bd\u03bf\u03c5\u03bd \u03bd\u03b1 \u03c3\u03c4\u03b5\u03af\u03bb\u03b5\u03c4\u03b1\u03b9", IMGTOOLTIP:"\u03ba\u03bb\u03b9\u03ba, \u03b3\u03b9\u03b1 \u03c3\u03c5\u03bc\u03c0\u03bb\u03ae\u03c1\u03c9\u03c3\u03b7 \u03c0\u03cc\u03c1\u03c9\u03bd"}}, NEWVERSION:{AVAILABLE:"\u039d\u03ad\u03b1 \u03ad\u03ba\u03b4\u03bf\u03c3\u03b7 \u03b4\u03b9\u03b1\u03b8\u03ad\u03c3\u03b9\u03bc\u03b7", INSTALL:"\u0395\u03b3\u03ba\u03b1\u03c4\u03ac\u03c3\u03c4\u03b1\u03c3\u03b7",
  REMINDER:"\u03a5\u03c0\u03b5\u03bd\u03b8\u03cd\u03bc\u03b9\u03c3\u03b7 \u03b1\u03c1\u03b3\u03cc\u03c4\u03b5\u03c1\u03b1", REQRELOAD:"\u0391\u03c0\u03b1\u03b9\u03c4\u03b5\u03af\u03c4\u03b1\u03b9 \u03b1\u03bd\u03b1\u03bd\u03ad\u03c9\u03c3\u03b7 \u03c4\u03b7\u03c2 \u03c3\u03b5\u03bb\u03af\u03b4\u03b1\u03c2", RELOAD:"\u0391\u03bd\u03b1\u03bd\u03ad\u03c9\u03c3\u03b7"}, LANGS:{LANG:"\u039c\u03b5\u03c4\u03ac\u03c6\u03c1\u03b1\u03c3\u03b7 \u03b3\u03b9\u03b1 \u03b3\u03bb\u03ce\u03c3\u03c3\u03b1:", SEND:"\u03a3\u03c4\u03b5\u03af\u03bb\u03b5 \u03b3\u03b9\u03b1 \u03b4\u03b7\u03bc\u03bf\u03c3\u03af\u03b5\u03c5\u03c3\u03b7",
  SAVE:"\u0391\u03c0\u03bf\u03b8\u03ae\u03ba\u03b5\u03c5\u03c3\u03b7 & \u03b4\u03bf\u03ba\u03b9\u03bc\u03ae", RESET:"\u0395\u03c0\u03b1\u03bd\u03ac\u03c6\u03bf\u03c1\u03ac \u03c3\u03c4\u03b7\u03bd \u03c0\u03c1\u03bf\u03b5\u03c0\u03b9\u03bb\u03b5\u03b3\u03bc\u03ad\u03bd\u03b7 \u03b3\u03bb\u03ce\u03c3\u03c3\u03b1", REMOVE:"\u0394\u03b9\u03b1\u03b3\u03c1\u03b1\u03c6\u03ae \u03c4\u03b7\u03c2 \u03bc\u03b5\u03c4\u03ac\u03c6\u03c1\u03b1\u03c3\u03ae\u03c2 \u03c3\u03bf\u03c5?"}, HELPTAB5:"\u039c\u03b5\u03c4\u03ac\u03c6\u03c1\u03b1\u03c3\u03b7",
  COMMAND:{FORTOWN:"\u03c0\u03cc\u03bb\u03b7:", RETURNING:"\u03b5\u03c0\u03b9\u03c3\u03c4\u03c1\u03ad\u03c6\u03bf\u03c5\u03bd", OUTGOING:"\u03b5\u03be\u03b5\u03c1\u03c7\u03cc\u03bc\u03b5\u03bd\u03b1", INCOMING:"\u03b5\u03b9\u03c3\u03b5\u03c1\u03c7\u03cc\u03bc\u03b5\u03bd\u03b1", ALL:"\u038c\u03bb\u03b1"}, EMOTS:{MESS:"\u0395\u03c0\u03b9\u03ba\u03bf\u03bb\u03ae\u03c3\u03c4\u03b5 \u03c3\u03c5\u03bd\u03b4\u03ad\u03c3\u03bc\u03bf\u03c5\u03c2 \u03c4\u03c9\u03bd emoticon, \u03ba\u03ac\u03b8\u03b5 \u03ad\u03bd\u03b1\u03bd \u03c3\u03b5 \u03bc\u03b9\u03b1 \u03bd\u03ad\u03b1 \u03b3\u03c1\u03b1\u03bc\u03bc\u03ae",
  LABEL:"\u0398\u03ad\u03bb\u03b5\u03c4\u03b5 \u03c0\u03b5\u03c1\u03b9\u03c3\u03c3\u03cc\u03c4\u03b5\u03c1\u03b1 emoticons?"}, BTNSIMUL:"\u03a0\u03c1\u03bf\u03c3\u03bf\u03bc\u03bf\u03b9\u03c9\u03c4\u03ae\u03c2", LASTUPDATE:"1487464394681", MSGSHOWCOST:"\u039a\u03cc\u03c3\u03c4\u03bf\u03c2 \u03c7\u03b1\u03bc\u03ad\u03bd\u03c9\u03bd \u03bc\u03bf\u03bd\u03ac\u03b4\u03c9\u03bd", BBIMG:"\u039c\u03af\u03b1 \u03b5\u03b9\u03ba\u03cc\u03bd\u03b1", POPSOUNDEG:"\u03c0\u03b1\u03c1\u03ac\u03b4\u03b5\u03b9\u03b3\u03bc\u03b1: https://www.youtube.com/watch?v=v2AC41dglnM, https://youtu.be/v2AC41dglnM, http://www.freesfx.co.uk/rx2/mp3s/10/11532_1406234695.mp3",
  RADAR:{TOWNFINDER:"\u03a8\u03ac\u03be\u03b5 \u03c0\u03cc\u03bb\u03b5\u03b9\u03c2", FIND:"\u03a8\u03ac\u03be\u03b5", MAXCSTIME:"\u039c\u03b5\u03b3\u03af\u03c3\u03c4\u03b7 \u03ce\u03c1\u03b1 \u03b1\u03c0\u03bf\u03b9\u03ba\u03b9\u03b1\u03ba\u03bf\u03cd \u03c0\u03bb\u03bf\u03af\u03bf\u03c5", BTNFIND:"\u03a8\u03ac\u03be\u03b5", TOWNNAME:"\u03a0\u03cc\u03bb\u03b7", TOWNOWNER:"\u0399\u03b4\u03b9\u03bf\u03ba\u03c4\u03ae\u03c4\u03b7\u03c2", TOWNRESERVED:"\u039a\u03c1\u03ac\u03c4\u03b7\u03c3\u03b7", TOWNPOINTS:"\u0395\u03bb\u03ac\u03c7\u03b9\u03c3\u03c4\u03bf\u03b9 \u03c0\u03cc\u03bd\u03c4\u03bf\u03b9 \u03c0\u03cc\u03bb\u03b7\u03c2",
  ALL:"\u039f\u03c0\u03bf\u03b9\u03b1\u03b4\u03ae\u03c0\u03bf\u03c4\u03b5 \u03c0\u03cc\u03bb\u03b7"}, QUESTION:"\u0395\u03c1\u03ce\u03c4\u03b7\u03c3\u03b7", CHKOLDTRADE:"\u03a7\u03c1\u03b7\u03c3\u03b9\u03bc\u03bf\u03c0\u03bf\u03af\u03b7\u03c3\u03b5 \u03c4\u03b7\u03bd \u03c0\u03b1\u03bb\u03b9\u03ac \u03b5\u03bc\u03c6\u03ac\u03bd\u03b9\u03c3\u03b7 \u03c4\u03bf\u03c5 \u03b5\u03bc\u03c0\u03cc\u03c1\u03bf\u03c5"};
  this.en = {AUTHOR:"Potusek, Anpu, BentleyJ, Lascaux", BTNCONV:"Convert", BTNGENER:"Generate", BTNVIEW:"Preview", BTNSAVE:"Save", BTNVIEWBB:"BBCode", MSGTITLE:"Convert report", MSGQUEST:"Which of the data do you want to publish?", MSGBBCODE:"Following the publication of the report, you can pair it with news and forums using the BBCode.", MSGRESOURCE:"Loot", MSGUNITS:"Units", MSGBUILD:"Buildings", MSGUSC:"Silver coins used", MSGRAW:"Raw materials", MSGSHOWCOST:"Costs of lost units", SUPPORT:"Support",
  SPY:"Spying", CONQUER:"Conquered", LOSSES:"Losses", HIDDEN:"Hidden", NOTUNIT:"[i]None[/i]", TOWN:"[i]Town:[/i] ", PLAYER:"[i]Player:[/i] ", ALLY:"[i]Ally:[/i] ", CAST:"cast:", ONTOWER:"On the town:", MSGHIDAD:"Hide cities", MSGFORUM:"The report will be published", BBALLY:"alliance forums / in the message", BBFORUM:"external forum", ICOCLOSE:"Close", ICOHELP:"About converter", MSGPREVIEW:"<b>Report preview</b>", HELPTAB1:"About", HELPTAB2:"How does it work", HELPTAB3:"Changes", HELPTAB4:"Settings",
  HELPTAB6:"Donations", MSGHUMAN:{OK:"The information has been saved", ERROR:"An error occurred while writing", YOUTUBEERROR:"Incorrect link or not allowed to play outside youtube"}, LABELS:{attack:{ATTACKER:"Attacker", DEFENDER:"Defender", MSGHIDAT:"attacker", MSGHIDDE:"defender", MSGATTUNIT:"Army attacking", MSGDEFUNIT:"Army defenders"}, support:{ATTACKER:"Supporting", DEFENDER:"Supported", MSGHIDAT:"supporting", MSGHIDDE:"supported", MSGATTUNIT:"Army supporting", MSGDEFUNIT:"Army defenders"},
  espionage:{ATTACKER:"Spy", DEFENDER:"Spied", MSGHIDAT:"spy", MSGHIDDE:"spied", MSGATTUNIT:"", MSGDEFUNIT:""}}, MSGDETAIL:"command details", MSGRETURN:"(return)", MSGGENBBCODE:"Generate a list of BBCode", MSGDEFSITE:"Defeated...", MSGLOSSITE:"Losses...", MSGASATT:"...as an attacker", MSGASDEF:"...as a defender", MSGDIFF1:"do not show differences", MSGDIFF2:"show differences", MSGDIFF3:"show only the differences", BBCODELIMIT:"In view of the limited amount of text in one post, in the case of a long list, the data were divided into groups. Each group paste as a separate entry.",
  CHKPOWERNAME:"Display time remaining to the possibility of using the spell", CHKFORUMTABS:"Replace scrolling tabs on the forum for multi line", STATSLINK:"View statistics from", BTNSUPPLAYERS:"List of players", CHKUNITSCOST:"The report showing the cost of lost units", CHKOCEANNUMBER:"Display ocean numbers", MSGRTLBL:"Revolt information", MSGRTSHOW:"Add ongoing revolt information", MSGRTONLINE:"Are you going to be online during red revolt?", MSGRTYES:"Yes", MSGRTNO:"No", MSGRTGOD:"God", MSGRTCSTIME:"CS time",
  MSGRTONL:"online?", MSGRTERR:"You are in a wrong city!<br/>To create revolt information, please go to city: ", BBTEXT:"text version", BBHTML:"table version", BBIMG:"single image", MSG413ERR:"<h3>The generated report is too large.</h3><p>Use the available options and reduce to publish without problems.</p>", CHKREPORTFORMAT:"Generate reports using tables", WALLNOTSAVED:"Wall is not saved", WALLSAVED:"Wall is saved", POPSELRECRUNIT:"click, to select default production unit", POPRECRUNITTRADE:"click, to fill in resources needed to recruit selected unit",
  POPINSERTLASTREPORT:"Paste the last converted report", MSGCOPYREPORT:"The report has been saved. Please click [paste_icon] on forums or new message window to paste it", POPDISABLEALARM:"Disable alarm", SOUNDSETTINGS:"Sound settings", CHKSOUNDMUTE:"Mute", SOUNDVOLUME:"Volume", SOUNDURL:"Sound file url", CHKSOUNDLOOP:"loop", POPSOUNDLOOP:"Play in the loop", POPSOUNDMUTE:"Mute the sound", POPSOUNDPLAY:"Play with current settings", POPSOUNDSTOP:"Stop playng", POPSOUNDURL:"Url path to the file with sound",
  POPSOUNDEG:"example: https://www.youtube.com/watch?v=v2AC41dglnM, https://youtu.be/v2AC41dglnM, http://www.freesfx.co.uk/rx2/mp3s/10/11532_1406234695.mp3", STATS:{PLAYER:"Player stats", ALLY:"Alliance stats", TOWN:"Town stats", INACTIVE:"Inactive", CHKINACTIVE:"Show inactive players", INACTIVEDESC:"At that time there was no point fighting and expansion"}, ABH:{WND:{WINDOWTITLE:"Army Builder Helper", UNITFRAME:"choose your unit", DESCRIPTION1:"In this city, you have [population] free population",
  DESCRIPTION2:"Which is enough to build [max_units]", DESCRIPTION3:"You [yesno] have a [research] researched.", DESCRIPTION4:"You can queue up maximum of [max_queue] units", TARGET:"choose your build target", PACKAGE:"resource package per shipment (units)", BTNSAVE:"save settings", TOOLTIPOK:"click, to select default unit for which you'll be sending resources", TOOLTIPNOTOK:"unit has not been researched", HASRESEARCH:"DO", NORESEARCH:"DO NOT", SETTINGSAVED:"Settings for [city] have been saved"},
  RESWND:{RESLEFT:"resources left to send", IMGTOOLTIP:"click, to fill in resources"}}, NEWVERSION:{AVAILABLE:"New version available", INSTALL:"Install", REMINDER:"Remind me later", REQRELOAD:"Refresh required", RELOAD:"Refresh"}, LANGS:{LANG:"Translation for language:", SEND:"Send to publication", SAVE:"Save & test", RESET:"Restore the default language", REMOVE:"Delete your translation?"}, HELPTAB5:"Translation", BTNSIMUL:"Simulator", EMOTS:{LABEL:"Do you want more emoticon?", MESS:"Paste links to emoticon, each on a new line"},
  COMMAND:{ALL:"All", INCOMING:"incoming", OUTGOING:"outgoing", RETURNING:"returning", FORTOWN:"town:"}, RADAR:{TOWNFINDER:"Search cities", FIND:"Search", MAXCSTIME:"Maximum time", MAXUNITTIME:"Maximum time", BTNFIND:"Search", TOWNNAME:"Town", CSTIME:"CS time", UNITTIME:"time", TOWNOWNER:"Owner", TOWNRESERVED:"Reservation", TOWNPOINTS:"Minimal town points", BTNSAVEDEFAULT:"Save values as default", ALL:"Any town", SHOWCITIES:"Show cities"}, WALL:{LISTSAVED:"Saved on the wall the day", LISTSTATE:"Condition of the wall on the day",
  DELETECURRENT:"Delete the current record", WANTDELETECURRENT:"Do you want to delete the current record of the wall?"}, QUESTION:"Question", TSL:{WND:{WINDOWTITLE:"Towns Sorted List", TOOLTIP:"show sorted town"}}, CHKOLDTRADE:"Use old trade layout", AO:{TITLE:"Academy Overview"}, MOBILEVERSION:"Mobile version", CHKWONDERTRADE:"When sending resources for world wonders, send maximum equal amounts", CHKTOWNPOPUP:"Display troop info tooltip when hovering over city name on drop-down city list", POPWONDERSHOT:"Amount of available construction accelerations",
  CHKTACL:"Enable commands list movement", BTNCOMPARE:"Pact vs Enemy", ALLYCOMPARETITLE:"Comparison of allied forces vs enemy alliances", CHKMCOL:"Color messages according to the pre-set color scheme", CHKBUPO:"Display build points"};
  this.es = {INFO:{0:"Potusek", 1:"grepolis@potusek.eu"}, WEBSITE:"Website", AUTHOR:"katralba@gmail.com, JONUSEJ, Shirowashi, fitidel, kaito edogawa", BTNCONV:"Convertir", BTNGENER:"Generar", BTNSRC:"Fuente", BTNVIEW:"Visualizar", BTNSAVE:"Guardar", BTNMARKS:"Marcarlo como le\u00eddo", BTNMARKA:"Marcar todo como le\u00eddo", MSGTITLE:"Convertir reporte", MSGQUEST:"\u00bfQu\u00e9 datos desea publicar?", MSGALL:"Todo", MSGBBCODE:"Una vez publicado el reporte, se puede anexar al foro utilizando c\u00f3digo BB.",
  MSGRESOURCE:"Saquear", MSGUNITS:"Unidades", MSGBUILD:"Edificios", MSGUSC:"Monedas utilizadas", MSGRAW:"Materias primas", SUPPORT:"Soporte", SPY:"Espionaje", CONQUER:"Conquistado", LOSSES:"P\u00e9rdidas", HIDDEN:"Escondido", NOTUNIT:"[i]Nada[/i]", TOWN:"[i]Ciudad:[/i] ", PLAYER:"[i]Jugador:[/i] ", ALLY:"[i]Alianza:[/i] ", CAST:"echar:", ONTOWER:"En la ciudad:", MSGHIDAD:"Esconder ciudades", MSGFORUM:"El reporte se publicar\u00e1", BBALLY:"foro de la alianza / en el mensaje", BBFORUM:"foro externo",
  ERRGETSRC:"\u00a1Ha habido un error! Por favor, generar el fuente y enviarlo como anexo a  potusek@westtax.info", ICOCLOSE:"Cerrar", ICOHELP:"Acerca del convertidor", MSGPREVIEW:"<b>Previsualizaci\u00f3n de informe</b>", HELPTAB1:"Acerca de", HELPTAB2:"C\u00f3mo funciona", HELPTAB3:"Cambios", HELPTAB4:"Configuraci\u00f3n", HLPVERSION:"Modificaci\u00f3n", HLPFIXED:"Corregido", HLPADDED:"A\u00f1adido", MSGHUMAN:{OK:"La informaci\u00f3n se ha guardado", ERROR:"Error al escribir", YOUTUBEERROR:"Link incorrecto o no autorizada la reproducci\u00f3n fuera de Youtube"},
  STATS:"Estad\u00edsticas del jugador", STATSPOINT:"Puntos", STATSRANK:"Rango", LABELS:{attack:{ATTACKER:"Atacante", DEFENDER:"Defensor", MSGHIDAT:"atacante", MSGHIDDE:"defensor", MSGATTUNIT:"Ej\u00e9rcito atacante", MSGDEFUNIT:"Ej\u00e9rcito defensor"}, support:{ATTACKER:"Apoyador", DEFENDER:"Apoyado", MSGHIDAT:"apoyador", MSGHIDDE:"apoyado", MSGATTUNIT:"Ej\u00e9rcito de apoyo", MSGDEFUNIT:"Ej\u00e9rcito apoyado"}, espionage:{ATTACKER:"Esp\u00eda", DEFENDER:"Espiado", MSGHIDAT:"esp\u00eda", MSGHIDDE:"espiado",
  MSGATTUNIT:"", MSGDEFUNIT:""}}, MSGDETAIL:"Detalles del comando", MSGRETURN:"(volver)", MSGCLAIM:"reservas de ciudades", MSGCLAIMPPUP:"Generar la reserva", MSGGENBBCODE:"Generar una lista de c\u00f3digo BBC", MSGDEFSITE:"Derrotado...", MSGLOSSITE:"P\u00e9rdidas...", MSGASATT:"...como atacante", MSGASDEF:"...como defensor", MSGDIFF1:"no mostrar las diferencias", MSGDIFF2:"mostrar las diferencias", MSGDIFF3:"mostrar s\u00f3lo las diferencias", BBCODELIMIT:"En vista de la cantidad limitada de texto en un mensaje, si hay una lista larga, se dividir\u00e1 en partes. Cada parte cuenta como una entidad separada.",
  CHKPOWERNAME:"Mostrar el tiempo restante hasta el pr\u00f3ximo hechizo", CHKNIGHTNAME:"Oscurece la ciudad en el bono nocturno", CHKFORUMTABS:"Reemplazar los desplazamientos de las pesta\u00f1as del foro por multi-l\u00ednea", BTNRESERVE:"Anotando", LNKRESERVE:"Reservas", LBLGETRESER:"Obteniendo los datos ...", BTNCHECK:"Verificando las  reservas", CHKCMDIMG:"View the icons for the destination city commands", STATSLINK:"Estad\u00edsticas en pantalla", BTNSUPPLAYERS:"Lista de jugadores", CHKUNITSCOST:"El informe muestra el coste de las unidades perdidas",
  CHKOCEANNUMBER:"Mostrar n\u00fameros de mares", MSGRTGOD:"Dios", MSGRTYES:"Si", MSGRTONLINE:"\u00bfEstar\u00e1s conectado durante el pu\u00f1o rojo?", MSGRTLBL:"Informaci\u00f3n de la revuelta", MSGRTERR:"\u00a1Est\u00e1s en una ciudad equivocada!<br/>Para crear informaci\u00f3n de la revuelta, por favor ve a la ciudad: ", BBTEXT:"versi\u00f3n texto", BBHTML:"versi\u00f3n tabla", MSG413ERR:"<h3>El informe generado es demasiado largo.</h3><p>Use las opciones disponibles y reduzcalo para publicar sin problemas.</p>",
  CHKREPORTFORMAT:"Generar informes usando tablas", WALLNOTSAVED:"La muralla no est\u00e1 guardada", WALLSAVED:"Muralla guardada", POPSELRECRUNIT:"click, para seleccionar la unidad de producci\u00f3n por defecto", POPRECRUNITTRADE:"click, para rellenar los recursos necesarios para reclutar la unidad seleccionada", POPINSERTLASTREPORT:"Pegar el \u00faltimo informe convertido", MSGCOPYREPORT:"El informe ha sido guardado. Por favor click [paste_icon] on el foro o la ventana de nuevo mensaje para pegarlo",
  POPDISABLEALARM:"Desconectar alarma", SOUNDSETTINGS:"Ajustes de sonido", CHKSOUNDMUTE:"Silenciar", SOUNDVOLUME:"Volumen", SOUNDURL:"URL fichero sonido", CHKSOUNDLOOP:"Repetir", POPSOUNDLOOP:"Reproducci\u00f3n continua", POPSOUNDMUTE:"Desactivar sonido", POPSOUNDPLAY:"Reproducir con los ajustes actuales", POPSOUNDSTOP:"Detener reproducci\u00f3n", POPSOUNDURL:"Ruta URL al fichero de sonido", ABH:{WND:{UNITFRAME:"elija su unidad", WINDOWTITLE:"Ayudante del constructor de ejercitos", DESCRIPTION1:"En esta ciudad, tienes [population] poblaci\u00f3n libre",
  DESCRIPTION2:"Que es suficiente para hacer [max_units]", DESCRIPTION3:"T\u00fa [yesno] tienes [research] investigado.", DESCRIPTION4:"Puedes agregar un m\u00e1ximo de [max_queue] unidades", TARGET:"elige tu edificio objetivo", PACKAGE:"paquete de recursos por env\u00edo (unidades)", BTNSAVE:"guardar ajustes", TOOLTIPOK:"click, para seleccionar la unidad por defecto para la que enviar\u00e1s recursos", TOOLTIPNOTOK:"unidad no investigada", HASRESEARCH:"HAZ", NORESEARCH:"NO HAGAS", SETTINGSAVED:"Los ajustes para [city] guardados"},
  RESWND:{RESLEFT:"recursos pendientes de env\u00edo", IMGTOOLTIP:"click, para rellenar recursos"}}, NEWVERSION:{AVAILABLE:"Disponible nueva versi\u00f3n", INSTALL:"Instalar", REMINDER:"Record\u00e1rmelo m\u00e1s tarde", REQRELOAD:"Se necesita cargar de nuevo el sitio", RELOAD:"Cargar de nuevo"}, LANGS:{LANG:"Traducci\u00f3n para idioma:", SEND:"Enviar a publicar", SAVE:"Guardar y probar", RESET:"Restablecer el idioma por defecto", REMOVE:"\u00bfBorrar tu traducci\u00f3n?"}, HELPTAB5:"Traducci\u00f3n",
  MSGRTSHOW:"Informaci\u00f3n de la revuelta en curso", MSGRTCSTIME:"Horario CS", MSGRTONL:"\u00bfconectado?", BTNSIMUL:"Simulador", EMOTS:{LABEL:"\u00bfQuieres m\u00e1s emoticonos?", MESS:"Pega enlaces de un emoticono, cada uno en una nueva l\u00ednea"}, COMMAND:{ALL:"Todo", INCOMING:"entrante", OUTGOING:"saliente", RETURNING:"retornando", FORTOWN:"ciudad:"}, LASTUPDATE:"1487465086352", CHKWONDERTRADE:"Al enviar recursos para las maravillas del mundo, enviar cantidades m\u00e1ximas iguales", MOBILEVERSION:"versi\u00f3n movil",
  AO:{TITLE:"Visi\u00f3n general de la Academia"}, CHKOLDTRADE:"Utilizar el dise\u00f1o del comercio antiguo", TSL:{WND:{TOOLTIP:"ver las ciudades clasificadas", WINDOWTITLE:"Lista de ciudades clasificadas"}}, QUESTION:"Pregunta", WALL:{WANTDELETECURRENT:"\u00bfQuiere borrar el estado actual de la muralla?", DELETECURRENT:"Borrar el siguiente dato", LISTSTATE:"Condici\u00f3n de la muralla el dia", LISTSAVED:"Muralla salvada el dia"}, RADAR:{ALL:"Cualquier ciudad", BTNSAVEDEFAULT:"Guardar valores como predeterminados",
  TOWNPOINTS:"Puntos m\u00ednimos de la ciudad", TOWNRESERVED:"Reserva", TOWNOWNER:"Propietario", CSTIME:"Tiempo CS", TOWNNAME:"Ciudad", BTNFIND:"Buscar", MAXCSTIME:"Tiempo m\u00e1ximo del colono", FIND:"Buscar", TOWNFINDER:"Buscar ciudades"}, POPSOUNDEG:"Ejemplo: https://www.youtube.com/watch?v=v2AC41dglnM, https://youtu.be/v2AC41dglnM, http://www.freesfx.co.uk/rx2/mp3s/10/11532_1406234695.mp3", MSGSHOWCOST:"Coste de unidades perdidas", BTNVIEWBB:"C\u00f3digo BB"};
  this.fr = {INFO:{0:"Potusek", 1:"grepolis@potusek.eu"}, WEBSITE:"Site web", AUTHOR:"group.xione@gmail.com, aezeluk, MilleBaffes, Steros, Nico-DiAngelo, Sky-Lop, ThunderLiight, Orience, galoup95, rapha1978", BTNCONV:"Convertir", BTNGENER:"G\u00e9n\u00e9rer", BTNSRC:"Source", BTNVIEW:"Aper\u00e7u", BTNSAVE:"Sauvegarder", BTNMARKS:"Marqu\u00e9 comme lu", BTNMARKA:"Marqu\u00e9 tout comme lu", MSGTITLE:"Convertir le rapport", MSGQUEST:"Que souhaitez vous publier?", MSGALL:"tout", MSGBBCODE:"Apr\u00e8s la publication du rapport, vous pouvez le placer dans les forums en utilisant le BBCode.",
  MSGRESOURCE:"piller", MSGUNITS:"Unit\u00e9s", MSGBUILD:"Batiments", MSGUSC:"Pi\u00e8ces d'argent utilis\u00e9es", MSGRAW:"Mati\u00e8res premi\u00e8re", SUPPORT:"soutien", SPY:"Espionnage", CONQUER:"Conquis", LOSSES:"pertes", HIDDEN:"cach\u00e9", NOTUNIT:"[i]Rien[/i]", TOWN:"[i]Ville:[/i] ", PLAYER:"[i]Joueur:[/i] ", ALLY:"[i]Alliance:[/i] ", CAST:"cast:", ONTOWER:"Dans la ville:", MSGHIDAD:"Villes masqu\u00e9es", MSGFORUM:"Le rapport sera publi\u00e9", BBALLY:"Forum d'alliance / dans le message",
  BBFORUM:"Forum externe", ERRGETSRC:"Une erreur s'est produite S'il vous pla\u00eet, g\u00e9n\u00e9rer la source et envoyer une pi\u00e8ce jointe \u00e0 potusek@westtax.info", ICOCLOSE:"Fermer", ICOHELP:"\u00c0 propos du convertisseur", MSGPREVIEW:"<b>Aper\u00e7u rapport</b>", HELPTAB1:"A propos", HELPTAB2:"Comment \u00e7a marche", HELPTAB3:"Changements", HELPTAB4:"Param\u00e8tres", HLPVERSION:"Version", HLPFIXED:"Corriger", HLPADDED:"Ajouter", MSGHUMAN:{OK:"L'information a \u00e9t\u00e9 sauvegard\u00e9e",
  ERREUR:"Une erreur s'est produite lors de l'\u00e9criture", ERROR:{}, YOUTUBEERROR:"Lien incorrecte ou non autoris\u00e9 \u00e0 jouer en dehors du Youtube"}, STATSPOINT:"Points", STATSRANK:"Rang", LABELS:{attack:{ATTACKER:"Attaquant", DEFENDER:"D\u00e9fenseur", MSGHIDAT:"attaquant", MSGHIDDE:"d\u00e9fenseur", MSGATTUNIT:"Arm\u00e9e attaquante", MSGDEFUNIT:"Arm\u00e9e d\u00e9fensive"}, support:{ATTACKER:"Soutenir", DEFENDER:"Soutenu", MSGHIDAT:"soutenir", MSGHIDDE:"soutenu", MSGATTUNIT:"Arm\u00e9e de support",
  MSGDEFUNIT:"Arm\u00e9e d\u00e9fensive"}, espionage:{ATTACKER:"Espion", DEFENDER:"Espionn\u00e9", MSGHIDAT:"espion", MSGHIDDE:"espionn\u00e9", MSGATTUNIT:"", MSGDEFUNIT:""}}, MSGDETAIL:"les d\u00e9tails des commandes", MSGRETURN:"(retour)", MSGCLAIM:"r\u00e9serve la ville", MSGCLAIMPPUP:"G\u00e9n\u00e9rer r\u00e9servation", MSGGENBBCODE:"G\u00e9n\u00e9rer la liste de BBCode", MSGDEFSITE:"Vaincu...", MSGLOSSITE:"Pertes...", MSGASATT:"... en tant qu'attaquant", MSGASDEF:"... en tant que d\u00e9fenseur",
  MSGDIFF1:"ne pas afficher les diff\u00e9rences", MSGDIFF2:"afficher les diff\u00e9rences", MSGDIFF3:"afficher seulement les diff\u00e9rences", BBCODELIMIT:"Compte tenu du montant limit\u00e9 de texte dans un poste, dans le cas d'une longue liste, les donn\u00e9es ont \u00e9t\u00e9 divis\u00e9 en groupes; Chaque groupe sera coll\u00e9 comme une entr\u00e9e s\u00e9par\u00e9e", CHKPOWERNAME:"Afficher le temps restant avant la possibilit\u00e9 d'utiliser le sort", CHKNIGHTNAME:"Assombrir la ville en bonus de nuit.",
  CHKFORUMTABS:"Remplacer les barres de d\u00e9filement sur le forum pour le multi ligne", BTNRESERVE:"R\u00e9servation", LNKRESERVE:"R\u00e9servations", LBLGETRESER:"Obtenir des donn\u00e9es ...", BTNCHECK:"V\u00e9rification des r\u00e9serves", CHKCMDIMG:"Afficher les icones de destinations des d\u00e9placements", STATSLINK:"Source des statistiques :", BTNSUPPLAYERS:"Liste des joueurs", CHKUNITSCOST:"Le rapport montre le co\u00fbt des unit\u00e9s perdues", CHKOCEANNUMBER:"Afficher le num\u00e9ro des mers",
  MSGRTLBL:"Information de r\u00e9volte", MSGRTSHOW:"Ajouter des informations sur la r\u00e9volte en cours", MSGRTONLINE:"Allez-vous \u00eatre en ligne lors de la r\u00e9volte rouge?", MSGRTYES:"Oui", MSGRTNO:"Non", MSGRTGOD:"Dieu", MSGRTCSTIME:"CS", MSGRTONL:"en ligne ?", MSGRTERR:"Vous \u00eates dans une mauvaise ville <br/> Pour cr\u00e9er des informations de r\u00e9volte, s'il vous pla\u00eet allez \u00e0 la ville en r\u00e9volte :", BBTEXT:"Version texte", BBHTML:"Version tableau", MSG413ERR:"<h3>Le rapport g\u00e9n\u00e9r\u00e9 est trop grand.</h3><p>Utilisez l'option disponible pour r\u00e9duire et publier le rapport sans probl\u00e8mes.</p>",
  CHKREPORTFORMAT:"G\u00e9n\u00e9rer les rapports \u00e0 l'aide de tableaux", WALLNOTSAVED:"Les remparts ne sont pas enregistr\u00e9s", WALLSAVED:"Les remparts sont enregistr\u00e9s", POPSELRECRUNIT:"cliquez, pour s\u00e9lectionner l'unit\u00e9 de production par d\u00e9faut", POPRECRUNITTRADE:"cliquez, pour remplir les ressources n\u00e9cessaires pour l'unit\u00e9 s\u00e9lectionn\u00e9e", POPINSERTLASTREPORT:"Collez le dernier rapport converti", MSGCOPYREPORT:"Le rapport a \u00e9t\u00e9 enregistr\u00e9. Cliquez sur [paste_icon] pour le coller",
  POPDISABLEALARM:"d\u00e9sactiver l'alarme", SOUNDSETTINGS:"R\u00e9glages son", CHKSOUNDMUTE:"Muet", SOUNDVOLUME:"Volume", SOUNDURL:"URL du fichier son", CHKSOUNDLOOP:"boucle", POPSOUNDLOOP:"lire en boucle", POPSOUNDMUTE:"Couper le son", POPSOUNDPLAY:"Lire avec les param\u00e8tres actuels", POPSOUNDSTOP:"Arreter la lecture", POPSOUNDURL:"Chemin (lien) vers le fichier audio", STATS:{PLAYER:"Statistiques joueur", ALLY:"Statistiques alliance", TOWN:"Statistiques ville", CHKINACTIVE:"Montrer les joueurs inactifs",
  INACTIVE:"Inactif", INACTIVEDESC:{}}, ABH:{WND:{WINDOWTITLE:"Aide construction d'arm\u00e9e", UNITFRAME:"Choisissez le type d'unit\u00e9", DESCRIPTION1:"Dans cette ville, vous avez [population] population libre", DESCRIPTION2:"Qui est suffisant pour construire [max_units]", DESCRIPTION3:"Vous [yesno] [research] recherch\u00e9.", DESCRIPTION4:"File d'attente maximale de [max_queue] unit\u00e9s", TARGET:"Choisissez le nombre d'unit\u00e9s \u00e0 produire", PACKAGE:"Nombre de ressources par envoi (en unit\u00e9s)",
  BTNSAVE:"Enregistrer les param\u00e8tres", TOOLTIPOK:"Cliquez pour s\u00e9lectionner l'unit\u00e9 par d\u00e9faut pour lequel vous enverrez des ressources", TOOLTIPNOTOK:"Le type d'unit\u00e9 n'a pas \u00e9t\u00e9 recherch\u00e9", HASRESEARCH:"avez", NORESEARCH:"n'avez pas", SETTINGSAVED:"Les r\u00e9glages pour [city] ont \u00e9t\u00e9 enregistr\u00e9s"}, RESWND:{RESLEFT:"Ressources restantes \u00e0 envoy\u00e9es", IMGTOOLTIP:"Cliquez, pour ajouter les ressources"}}, NEWVERSION:{AVAILABLE:"Nouvelle version disponible",
  INSTALL:"Installer", REMINDER:"Me rappeler plus tard", REQRELOAD:"N\u00e9cessite le raffra\u00eechissement du site", RELOAD:"Raffra\u00eechir"}, LANGS:{LANG:"Traduction de la langue", SEND:"Envoyer pour publication", SAVE:"Sauver et tester", RESET:"Restaurer le langage par d\u00e9faut", REMOVE:"Supprimer votre traduction?"}, HELPTAB5:"Traduction", BTNSIMUL:"Simulateur", EMOTS:{LABEL:"Do you want more emoticon?", MESS:"collez le lien vers les \u00e9moticons, chaque fois sur une nouvelle ligne"},
  COMMAND:{ALL:"tout", INCOMING:"entrant", OUTGOING:"sortant", FORTOWN:"ville:"}, MOBILEVERSION:"Version mobile", AO:{TITLE:"Aper\u00e7u acad\u00e9mie"}, CHKOLDTRADE:"Use old trade layout", TSL:{WND:{TOOLTIP:"Voir les villes tri\u00e9es", WINDOWTITLE:"Liste tri\u00e9es des villes"}}, WALL:{WANTDELETECURRENT:"Voulez vous effacer les donn\u00e9es actuelles des remparts?", DELETECURRENT:"Effacer les donn\u00e9es actuelles", LISTSAVED:"Sauvegarder sur le mur le jour"}, RADAR:{ALL:"Toutes les villes",
  BTNSAVEDEFAULT:"Sauvegarder les valeurs par d\u00e9faut", TOWNPOINTS:"Points minimum", TOWNRESERVED:"R\u00e9servation", TOWNOWNER:"Propri\u00e9taire", TOWNNAME:"Ville", BTNFIND:"Recherche", MAXCSTIME:"Temps maximum en BC", FIND:"Recherche", TOWNFINDER:"Rechercher villes"}, BBIMG:"image seule", MSGSHOWCOST:"Co\u00fbt des unit\u00e9s perdues", LASTUPDATE:"1488490547946", POPSOUNDEG:"exemple: https://www.youtube.com/watch?v=v2AC41dglnM, https://youtu.be/v2AC41dglnM, http://www.freesfx.co.uk/rx2/mp3s/10/11532_1406234695.mp3"};
  this.hu = {AUTHOR:"LegatuS, Phrometheus, Skyes, Vesztettem, alugev, Bud.Spencer, DOBss, Nagyh\u00fas", BTNCONV:"\u00c1talak\u00edt\u00e1s", BTNGENER:"Gener\u00e1l\u00e1s", BTNVIEW:"El\u0151ln\u00e9zet", BTNSAVE:"Ment\u00e9s", MSGTITLE:"Jelent\u00e9s \u00e1talak\u00edt\u00e1sa", MSGQUEST:"Melyik adatokat szeretn\u00e9 k\u00f6zz\u00e9tenni?", MSGBBCODE:"A jelent\u00e9s k\u00f6zz\u00e9t\u00e9tele ut\u00e1n BB-k\u00f3d seg\u00edts\u00e9g\u00e9vel beilleszthet\u0151 lesz a f\u00f3rumok \u00e9s \u00fczenetekben.",
  MSGRESOURCE:"Zs\u00e1km\u00e1ny", MSGUNITS:"Egys\u00e9gek", MSGBUILD:"\u00c9p\u00fcletek", MSGUSC:"Felhaszn\u00e1lt ez\u00fcstp\u00e9nzek", MSGRAW:"Nyersanyagok", SUPPORT:"T\u00e1mogat\u00e1s", SPY:"K\u00e9mked\u00e9s", CONQUER:"Megh\u00f3d\u00edtott", LOSSES:"Vesztes\u00e9gek", HIDDEN:"Nem l\u00e1that\u00f3.", NOTUNIT:"[i]Nincs[/i]", TOWN:"[i]V\u00e1ros:[/i] ", PLAYER:"[i]J\u00e1t\u00e9kos:[/i] ", ALLY:"[i]Sz\u00f6vets\u00e9g:[/i] ", CAST:"elfoglal\u00e1s:", ONTOWER:"V\u00e1roson:", MSGHIDAD:"V\u00e1rosok elrejt\u00e9se",
  MSGFORUM:"A jelent\u00e9s k\u00f6zz\u00e9t\u00e9telre\u00a0ker\u00fcl", BBALLY:"sz\u00f6vets\u00e9gi f\u00f3rumok / \u00fczenetben", BBFORUM:"k\u00fcls\u0151 f\u00f3rum", ICOCLOSE:"Bez\u00e1r", ICOHELP:"Az \u00e1talak\u00edt\u00f3r\u00f3l", MSGPREVIEW:"<b>Jelent\u00e9s el\u0151n\u00e9zete</b>", HELPTAB1:"A b\u0151v\u00edtm\u00e9nyr\u0151l", HELPTAB2:"Hogyan m\u0171k\u00f6dik", HELPTAB3:"V\u00e1ltoztat\u00e1si napl\u00f3", HELPTAB4:"Be\u00e1ll\u00edt\u00e1sok", MSGHUMAN:{OK:"Az adatok ment\u00e9se megt\u00f6rt\u00e9nt",
  ERROR:"Hiba t\u00f6rt\u00e9nt", YOUTUBEERROR:"Hib\u00e1s link vagy nem lej\u00e1tszhat\u00f3 youtube-on k\u00edv\u00fcl"}, LABELS:{attack:{ATTACKER:"T\u00e1mad\u00f3", DEFENDER:"V\u00e9d\u0151", MSGHIDAT:"t\u00e1mad\u00f3", MSGHIDDE:"v\u00e9d\u0151", MSGATTUNIT:"T\u00e1mad\u00f3 egys\u00e9gek", MSGDEFUNIT:"V\u00e9d\u0151 egys\u00e9gek"}, support:{ATTACKER:"T\u00e1mogat\u00f3", DEFENDER:"T\u00e1mogatott", MSGHIDAT:"t\u00e1mogat\u00f3", MSGHIDDE:"t\u00e1mogatott", MSGATTUNIT:"T\u00e1mogat\u00f3 egys\u00e9gek",
  MSGDEFUNIT:"V\u00e9d\u0151 egys\u00e9gek"}, espionage:{ATTACKER:"K\u00e9mked\u0151", DEFENDER:"K\u00e9mkedett", MSGHIDAT:"k\u00e9mded\u0151", MSGHIDDE:"k\u00e9mkedett", MSGATTUNIT:"", MSGDEFUNIT:""}}, MSGDETAIL:"parancsok r\u00e9szletei", MSGRETURN:"(visszat\u00e9r\u0151)", MSGGENBBCODE:"BB-k\u00f3d lista gener\u00e1l\u00e1sa", MSGDEFSITE:"Legy\u0151z\u00f6ttek...", MSGLOSSITE:"Vesztes\u00e9gek...", MSGASATT:"...t\u00e1mad\u00f3k\u00e9nt", MSGASDEF:"...v\u00e9d\u0151k\u00e9nt", MSGDIFF1:"k\u00fcl\u00f6nbs\u00e9gek elrejt\u00e9se ",
  MSGDIFF2:"k\u00fcl\u00f6nbs\u00e9gek mutat\u00e1sa", MSGDIFF3:"csak a k\u00fcl\u00f6nbs\u00e9gek mutat\u00e1sa", BBCODELIMIT:"Mivel a hozz\u00e1sz\u00f3l\u00e1sokban csak limit\u00e1lt sz\u00e1m\u00fa karaktert lehet haszn\u00e1lni, \u00edgy a hosszabb list\u00e1k csoportkra lettek osztva. Minden csoportot k\u00fcl\u00f6n hozz\u00e1sz\u00f3l\u00e1sban c\u00e9lszer\u0171 beilleszteni.", CHKPOWERNAME:"Az isteni er\u0151 \u00fajb\u00f3li haszn\u00e1lat\u00e1hoz h\u00e1tral\u00e9v\u0151 id\u0151 mutat\u00e1sa",
  CHKFORUMTABS:"A f\u00f3rumon t\u00f6bb sor megjeln\u00edt\u00e9se a v\u00edzszintes g\u00f6rget\u00e9s helyett", STATSLINK:"Statisztik\u00e1k forr\u00e1sa", BTNSUPPLAYERS:"J\u00e1t\u00e9kosok list\u00e1ja", CHKUNITSCOST:"Az elesett egys\u00e9gek \u00e1r\u00e1nak megjelen\u00edt\u00e9se", CHKOCEANNUMBER:"Tenger sz\u00e1m\u00e1nak megjelen\u00edt\u00e9se", MSGRTLBL:"L\u00e1zad\u00e1ssal kapcsolatos inform\u00e1ci\u00f3k", MSGRTSHOW:"L\u00e1zad\u00e1ssal kapcsolatos inform\u00e1ci\u00f3k megjelen\u00edt\u00e9se",
  MSGRTONLINE:"Akt\u00edv lesz a l\u00e1zad\u00e1s folyam\u00e1n?", MSGRTYES:"Igen", MSGRTNO:"Nem", MSGRTGOD:"Isten", MSGRTCSTIME:"GYH id\u0151", MSGRTONL:"akt\u00edv?", MSGRTERR:"Rossz v\u00e1rosban vagy!<br/>L\u00e1zad\u00e1si inform\u00e1ci\u00f3khoz menj ebbe a v\u00e1rosba ", BBTEXT:"sz\u00f6veges verzi\u00f3", BBHTML:"t\u00e1bl\u00e1zatos verzi\u00f3", MSG413ERR:"<h3>Az \u00e1talak\u00edtott jelent\u00e9s t\u00fal nagy.</h3><p>Haszn\u00e1lja a rendelkez\u00e9sre \u00e1ll\u00f3 opci\u00f3kat, hogy cs\u00f6kkentse a m\u00e9retet.</p>",
  CHKREPORTFORMAT:"Jelent\u00e9sek \u00e1talak\u00edt\u00e1sa t\u00e1bl\u00e1zatok haszn\u00e1lat\u00e1val", WALLNOTSAVED:"A fal nincs mentve", WALLSAVED:"A fal mentve", POPSELRECRUNIT:"kattints az alap\u00e9rtelmezett termel\u0151egys\u00e9g kiv\u00e1laszt\u00e1s\u00e1hoz", POPRECRUNITTRADE:"kattintson a sz\u00fcks\u00e9ges nyersanyag beilleszt\u00e9s\u00e9hez a kiv\u00e1lasztott egys\u00e9ghez", POPINSERTLASTREPORT:"Az utols\u00f3 \u00e1talak\u00edtott jelent\u00e9s beilleszt\u00e9se", MSGCOPYREPORT:"A jelent\u00e9s el lett mentve. K\u00e9rj\u00fck, a beilleszt\u00e9shez kattintson a [paste_icon] ikonra a f\u00f3rumokon vagy \u00fczenet \u00edr\u00e1s\u00e1n\u00e1l.",
  POPDISABLEALARM:"T\u00e1mad\u00e1sjelz\u0151 kikapcsol\u00e1sa", SOUNDSETTINGS:"Hang be\u00e1ll\u00edt\u00e1sok", CHKSOUNDMUTE:"N\u00e9m\u00edt\u00e1s", SOUNDVOLUME:"Hanger\u0151", SOUNDURL:"Hangf\u00e1jl url c\u00edme", CHKSOUNDLOOP:"ism\u00e9tl\u00e9s", POPSOUNDLOOP:"Lej\u00e1tsz\u00e1s ism\u00e9tl\u00e9ssel", POPSOUNDMUTE:"Hang n\u00e9m\u00edt\u00e1sa", POPSOUNDPLAY:"Lej\u00e1tsz\u00e1s jelenlegi be\u00e1ll\u00edt\u00e1sokkal", POPSOUNDSTOP:"Lej\u00e1tsz\u00e1s meg\u00e1ll\u00edt\u00e1sa", POPSOUNDURL:"A hangf\u00e1jlhoz vezet\u0151 url c\u00edm",
  STATS:{PLAYER:"J\u00e1t\u00e9kos statisztik\u00e1ja", ALLY:"Sz\u00f6vets\u00e9g statisztik\u00e1k", TOWN:"V\u00e1ros statisztik\u00e1k", INACTIVEDESC:"Ennyi idelye nem n\u00f6vekedett a j\u00e1t\u00e9kos pontsz\u00e1ma vagy nem szerzett harci pontot", CHKINACTIVE:"Inakt\u00edv j\u00e1t\u00e9kosok mutat\u00e1sa", INACTIVE:"Inakt\u00edv"}, ABH:{WND:{WINDOWTITLE:"Sereg \u00c9p\u00edt\u00e9s Seg\u00edt\u0151", UNITFRAME:"v\u00e1lassza ki az egys\u00e9get", DESCRIPTION1:"Ebben a v\u00e1rosba [population] szabad n\u00e9pess\u00e9ge van",
  DESCRIPTION2:"Amely el\u00e9g [max_units] egys\u00e9g k\u00e9sz\u00edt\u00e9s\u00e9re", DESCRIPTION3:"M\u00e1r kifejlesztetted a(z) [research] fejleszt\u00e9st: [yesno]", DESCRIPTION4:"A kik\u00e9pz\u00e9si sorrendbe maximum [max_queue] egys\u00e9g f\u00e9l el", TARGET:"v\u00e1lassza ki a k\u00edv\u00e1nt mennyis\u00e9get (egys\u00e9g)", PACKAGE:"nyersanyag/sz\u00e1ll\u00edtm\u00e1ny (egys\u00e9g)", BTNSAVE:"be\u00e1ll\u00edt\u00e1sok ment\u00e9se", TOOLTIPOK:"kattintson az egys\u00e9g kiv\u00e1laszt\u00e1s\u00e1hoz, amelyre majd szeretne nyersanyagokat k\u00fcldeni",
  TOOLTIPNOTOK:"az egys\u00e9g nincs kifejlesztve", HASRESEARCH:"TEDD", NORESEARCH:"NINCS", SETTINGSAVED:"A be\u00e1ll\u00edt\u00e1sok [city] v\u00e1ros\u00e1ra sikeresen mentve"}, RESWND:{RESLEFT:"sz\u00fcks\u00e9ges nyersanyagok", IMGTOOLTIP:"kattintson a sz\u00fcks\u00e9ges nyersanyag beilleszt\u00e9s\u00e9hez"}}, NEWVERSION:{AVAILABLE:"\u00daj verzi\u00f3 el\u00e9rhet\u0151", INSTALL:"Telep\u00edt\u00e9s", REMINDER:"Eml\u00e9keztess k\u00e9s\u0151bb", REQRELOAD:"Friss\u00edt\u00e9s sz\u00fcks\u00e9ges",
  RELOAD:"Friss\u00edt\u00e9s"}, LANGS:{LANG:"Ford\u00edt\u00e1s:", SEND:"Elk\u00fcld\u00e9s k\u00f6zz\u00e9t\u00e9tele", SAVE:"Ment\u00e9s", RESET:"Alap\u00e9rtelmezett nyelv vissza\u00e1ll\u00edt\u00e1sa", REMOVE:"T\u00f6r\u00f6lni szeretn\u00e9 a ford\u00edt\u00e1s?"}, HELPTAB5:"Ford\u00edt\u00e1s", BTNSIMUL:"Szimul\u00e1tor", EMOTS:{LABEL:"Szeretne t\u00f6bb hangulatjelet?", MESS:"Illessze be a linket a hangulatjelhez, mindegyiket k\u00fcl\u00f6n sorra"}, COMMAND:{ALL:"Mind", INCOMING:"bej\u00f6v\u0151",
  OUTGOING:"kimen\u0151", RETURNING:"visszat\u00e9r\u0151", FORTOWN:"v\u00e1ros:"}, BTNVIEWBB:"BB-k\u00f3d", MSGSHOWCOST:"Az elvesztett egys\u00e9gek \u00e1ra", CHKWONDERTRADE:"A vil\u00e1gcsod\u00e1kra maxim\u00e1lis nyersanyagok k\u00fcldend\u0151k", MOBILEVERSION:"Mobil verzi\u00f3", AO:{TITLE:"Akad\u00e9mia \u00e1ttekint\u0151"}, CHKOLDTRADE:"A r\u00e9gi kereskedelmi elrendez\u00e9s haszn\u00e1lata", TSL:{WND:{WINDOWTITLE:"K\u00f6zeli v\u00e1rosok", TOOLTIP:"k\u00f6zeli v\u00e1rosok mutat\u00e1sa"}},
  QUESTION:"K\u00e9rd\u00e9s", WALL:{WANTDELETECURRENT:"Biztosan t\u00f6r\u00f6lni szeretn\u00e9 a kiv\u00e1lasztott ment\u00e9st?", DELETECURRENT:"A kiv\u00e1lasztott ment\u00e9s t\u00f6rl\u00e9se", LISTSTATE:"V\u00e1rosfal \u00e1llapota ekkor", LISTSAVED:"V\u00e1rosfal ment\u00e9se ekkorr\u00f3l"}, RADAR:{ALL:"B\u00e1rmilyen v\u00e1ros", TOWNPOINTS:"Minim\u00e1lis pontsz\u00e1m", BTNSAVEDEFAULT:"\u00c9rt\u00e9kek ment\u00e9se alap\u00e9rtelmezettk\u00e9nt", TOWNRESERVED:"Fenntart\u00e1s", TOWNOWNER:"Tulajdonos",
  CSTIME:"GYH id\u0151", TOWNNAME:"V\u00e1ros", BTNFIND:"Keres\u00e9s", MAXCSTIME:"Maxim\u00e1lis gyarmatos\u00edt\u00f3haj\u00f3 id\u0151", FIND:"Keres\u00e9s", TOWNFINDER:"V\u00e1ros keres\u0151"}, POPSOUNDEG:"p\u00e9ld\u00e1ul: https://www.youtube.com/watch?v=v2AC41dglnM, https://youtu.be/v2AC41dglnM, http://www.freesfx.co.uk/rx2/mp3s/10/11532_1406234695.mp3", BBIMG:"egyetlen k\u00e9p", LASTUPDATE:"1487468651957"};
  this.it = {INFO:{0:"Potusek", 1:"grepolis@potusek.eu"}, WEBSITE:"Sito web", AUTHOR:"av250866@gmail.com, G.O.W., Marco305, Xyarghas, TeseoN86, ander26", BTNCONV:"Converti", BTNGENER:"Crea", BTNSRC:"Sorgente", BTNVIEW:"Anterprima", BTNSAVE:"Salva", BTNMARKS:"Segna come letto", BTNMARKA:"Segna tutto come letto", MSGTITLE:"Converti il report", MSGQUEST:"Quali informazioni vuoi pubblicare?", MSGALL:"Tutto", MSGBBCODE:"Una volta pubblicato il report, potrai inserirlo nelle news o nel forums tramite il BBCode.",
  MSGRESOURCE:"Bottino", MSGUNITS:"Unit\u00e0", MSGBUILD:"Edifici", MSGUSC:"Argento impiegato", MSGRAW:"Materiali", SUPPORT:"Supporti", SPY:"Spiando", CONQUER:"Conquistata", LOSSES:"Persa", HIDDEN:"Nascosto", NOTUNIT:"[i]Nessuna[/i]", TOWN:"[i]Citt\u00e0:[/i] ", PLAYER:"[i]Giocatore:[/i] ", ALLY:"[i]Alleanza:[/i] ", CAST:"lancia:", ONTOWER:"sulla citt\u00e0:", MSGHIDAD:"Nascondi citt\u00e0", MSGFORUM:"Il report sar\u00e0 pubblicato", BBALLY:"Forum alleanza / nel messaggio", BBFORUM:"forum esterno",
  ERRGETSRC:"Errore! Per favore, creare il sorgente ed inviarlo come allegato a potusek@westtax.info", ICOCLOSE:"Chiudi", ICOHELP:"Riguardo al converter", MSGPREVIEW:"<b>Anteprima report</b>", HELPTAB1:"Riguardo a", HELPTAB2:"Come funziona", HELPTAB3:"Cambiamenti", HELPTAB4:"Opzioni", HLPVERSION:"Versione", HLPFIXED:"Corretto", HLPADDED:"Aggiunto", MSGHUMAN:{OK:"La informazione \u00e8 stata salvata", ERROR:"\u00e8 avvenuto un errore in scrittura", YOUTUBEERROR:"collegamento errato o non ha permesso di giocare fuori youtube"},
  STATSPOINT:"Punti", STATSRANK:"classifica", LABELS:{attack:{ATTACKER:"Attaccante", DEFENDER:"Difensore", MSGHIDAT:"attaccante", MSGHIDDE:"difensore", MSGATTUNIT:"Esercito attaccante", MSGDEFUNIT:"Esercito difensore"}, support:{ATTACKER:"In supporto", DEFENDER:"Supportato", MSGHIDAT:"in supporto", MSGHIDDE:"supportato", MSGATTUNIT:"Esercito in supporto", MSGDEFUNIT:"Esercito difensore"}, espionage:{ATTACKER:"Spia", DEFENDER:"Spiato", MSGHIDAT:"spia", MSGHIDDE:"spiato", MSGATTUNIT:"", MSGDEFUNIT:""}},
  MSGDETAIL:"dettagli ordine", MSGRETURN:"(ritorno)", MSGCLAIM:"citt\u00e0 prenotata", MSGCLAIMPPUP:"Genera prenotazione", MSGGENBBCODE:"Genera una lista in BBCode", MSGDEFSITE:"Sconfitto...", MSGLOSSITE:"Perdite...", MSGASATT:"...come attaccante", MSGASDEF:"...come difensore", MSGDIFF1:"non mostrare le differenze", MSGDIFF2:"mostra le differenze", MSGDIFF3:"mostra solo le differenze", BBCODELIMIT:"A causa della quantit\u00e0 di testo limitata in un singolo post, in caso di liste molto lunghe i dati saranno divisi in gruppi. Copiare ciascun gruppo come post separato.",
  CHKPOWERNAME:"Mostra il tempo mancante all'utilizzo di un nuovo incantesimo", CHKNIGHTNAME:"Rende buie le citt\u00e0 in bonus notturno", CHKFORUMTABS:"Sostituisce le tabelle a scorrimento nel forum con multilinea", HELPTAB5:"Traduzione", CHKCMDIMG:"Visualizza la icona per la citta di destinazione dei comandi", STATSLINK:"Statistiche da display", BTNSUPPLAYERS:"Lista dei giocatori", CHKUNITSCOST:"Il report mostra il costo delle unit\u00e0 perse", CHKOCEANNUMBER:"Visualizza il numero dei mari", MSGRTLBL:"Informazioni rivolta",
  MSGRTSHOW:"Aggiungi informazioni rivolta in corso", MSGRTONLINE:"Sarai connesso durante la rivolta rossa?", MSGRTYES:"Si", MSGRTNO:"No", MSGRTGOD:"Dio", MSGRTCSTIME:"Tempo CS", MSGRTONL:"connesso?", MSGRTERR:"Sei nella citt\u00e0 sbagliata!<br/>Per creare un rapporto della rivolta, vai alla citt\u00e0: ", BBTEXT:"versione testo", BBHTML:"versione tabelle", MSG413ERR:"<h3>Il rapporto generato \u00e8 troppo grande.</h3><p>Usa le opzioni disponibili e riducilo per pubblicarlo senza problemi.</p>",
  CHKREPORTFORMAT:"Genera il rapporto usando le tabelle", WALLNOTSAVED:"Wall non \u00e8 stato salvato", WALLSAVED:"Wall \u00e8 stato salvato", POPSELRECRUNIT:"clicca, per selezionare le unit\u00e0 da produrre di default", POPRECRUNITTRADE:"clicca, per riempire con le risorse necessarie a reclutare le unit\u00e0 selezionate", POPINSERTLASTREPORT:"Incolla l ultimo rapporto creato", MSGCOPYREPORT:"Il rapporto \u00e8 stato salvato. Per favore clicca [paste_icon] nel forum o nel nuovo messaggio per incollarlo",
  POPDISABLEALARM:"Disabilita allarme", SOUNDSETTINGS:"Opzioni suono", CHKSOUNDMUTE:"Silenzioso", SOUNDVOLUME:"volume", SOUNDURL:"url del file sonoro", CHKSOUNDLOOP:"ripeti", POPSOUNDLOOP:"Suona a ripetizione", POPSOUNDMUTE:"Silenzia il suono", POPSOUNDPLAY:"Suona con le opzioni correnti", POPSOUNDSTOP:"Smetti di suonare", POPSOUNDURL:"Percorso al file sonoro", STATS:{PLAYER:"Statistiche giocatore", ALLY:"Statistiche alleanza", TOWN:"Statistiche citt\u00e0", INACTIVE:"Inattivo", CHKINACTIVE:"Mostra i giocatori inattivi"},
  ABH:{WND:{WINDOWTITLE:"Aiuto costruzione esercito", UNITFRAME:"scegli le tue unit\u00e0", DESCRIPTION1:"In questa citt\u00e0, la popolazione libera \u00e8: [population]", DESCRIPTION2:"Che \u00e8 sufficiente per creare [max_units] unit\u00e0", DESCRIPTION3:"Hai [yesno] una [research] ricercata.", DESCRIPTION4:"Puoi mettere in coda fino a [max_queue] unit\u00e0", TARGET:"Scegli le unit\u00e0 da costruire", PACKAGE:"Risorse sufficienti per creare(unit\u00e0)", BTNSAVE:"salva opzioni", TOOLTIPOK:"clicca, per selezionare la unit\u00e0 standard per la quale manderai risorse",
  TOOLTIPNOTOK:"questa unit\u00e0 non \u00e8 ancora stata ricercata", HASRESEARCH:"", NORESEARCH:"NON", SETTINGSAVED:"Le opzioni per la citt\u00e0 [city] sono state salvate"}, RESWND:{RESLEFT:"risorse rimaste da inviare", IMGTOOLTIP:"clicca, per caricare le risorse"}}, NEWVERSION:{AVAILABLE:"Nuova versione disponibile", INSTALL:"Installa", REMINDER:"Ricordamelo pi\u00f9 tardi", REQRELOAD:"E' necessario aggiornare la pagina", RELOAD:"Aggiorna"}, LANGS:{LANG:"Traduzione per la lingua: ", SEND:"Invia per la pubblicazione",
  SAVE:"Salva e prova", RESET:"Ripristina la lingua predefinita", REMOVE:"Cancellare la tua traduzione?"}, BTNSIMUL:"Simulatore", EMOTS:{LABEL:"Vuoi altre faccine?", MESS:"Copia i links alle faccinen, uno solo per riga"}, COMMAND:{ALL:"Tutto", INCOMING:"in arrivo", OUTGOING:"in partenza", RETURNING:"di ritorno", FORTOWN:"citt\u00e0:"}, MSGSHOWCOST:"costo delle unit\u00e0 perse", BBIMG:"immagine singola", RADAR:{FIND:"Cerca", MAXCSTIME:"Tempo massimo coloniale", TOWNFINDER:"Cerca citt\u00e0", BTNFIND:"Cerca",
  TOWNNAME:"Citt\u00e0", TOWNOWNER:"Proprio", TOWNRESERVED:"Prenotazione", TOWNPOINTS:"Punti minimi Citt\u00e0", BTNSAVEDEFAULT:"Salva come valore di default", ALL:"Tutte le citt\u00e0"}, LASTUPDATE:"1488490709268"};
  this.nl = {INFO:{0:"Potusek", 1:"grepolis@potusek.eu"}, WEBSITE:"Website", AUTHOR:"zippohontas@gmail.com, jestertje, Gotcha8, gwvelden, Frosty Jim", BTNCONV:"Converteer", BTNGENER:"Genereer", BTNSRC:"Bron", BTNVIEW:"Voorbeeld", BTNSAVE:"Opslaan", BTNMARKS:"Gemarkeerd als gelezen", BTNMARKA:"Markeer alle als gelezen", MSGTITLE:"Converteer rappport", MSGQUEST:"Welke data wil je publiceren?", MSGALL:"Alle", MSGBBCODE:"Volgens de publicatie van het rapport, kun je het combineren met nieuws en forums door gebruik te maken van de BBCode.",
  MSGRESOURCE:"Buit", MSGUNITS:"Eenheden", MSGBUILD:"Gebouwen", MSGUSC:"Gebruikt zilver", MSGRAW:"Grondstoffen", SUPPORT:"Ondersteuning", SPY:"Spionage", CONQUER:"Overwonnen", LOSSES:"Verliezen", HIDDEN:"Verborgen", NOTUNIT:"[i]Geen[/i]", TOWN:"[i]Stad:[/i] ", PLAYER:"[i]Speler:[/i] ", ALLY:"[i]Allie:[/i] ", CAST:"gunst:", ONTOWER:"Op de stad:", MSGHIDAD:"Verberg steden", MSGFORUM:"Het rapport wordt gepubliceerd", BBALLY:"alliantie forums / in het bericht", BBFORUM:"externe forum", ERRGETSRC:"Een fout is opgetreden! AUB, genereer de bron en verstuur als bijlage aan potusek@westtax.info",
  ICOCLOSE:"Sluiten", ICOHELP:"Over de converteerder", MSGPREVIEW:"<b>Rapport voorbeeld</b>", HELPTAB1:"Over", HELPTAB2:"Hoe werkt het", HELPTAB3:"Veranderingen", HELPTAB4:"Instellingen", HLPVERSION:"Versie", HLPFIXED:"Fixed", HLPADDED:"Toegevoegd", MSGHUMAN:{OK:"De informatie is opgeslagen", ERROR:"Er is een fout opgetreden tijdens het schrijven ", YOUTUBEERROR:"Verkeerde link of niet toegestaan af te spelen buiten YouTube"}, STATS:"Speler statistieken", STATSPOINT:"Punten", STATSRANK:"Rang", LABELS:{attack:{ATTACKER:"Aanvaller",
  DEFENDER:"Verdediger", MSGHIDAT:"aanvaller", MSGHIDDE:"verdediger", MSGATTUNIT:"Aanvallend Leger", MSGDEFUNIT:"Verdedigend Leger"}, support:{ATTACKER:"Ondersteunen", DEFENDER:"Ondersteunde", MSGHIDAT:"ondersteunen", MSGHIDDE:"ondersteunde", MSGATTUNIT:"Ondersteunend Leger", MSGDEFUNIT:"Verdedigend Leger"}, espionage:{ATTACKER:"Spion", DEFENDER:"Bespioneerde", MSGHIDAT:"spion", MSGHIDDE:"bespioneerde", MSGATTUNIT:"", MSGDEFUNIT:""}}, MSGDETAIL:"commando details", MSGRETURN:"(enter)", MSGCLAIM:"city ??claims",
  MSGCLAIMPPUP:"Genereer claim", MSGGENBBCODE:"Genereer een lijst in BBCode", MSGDEFSITE:"Verslagen...", MSGLOSSITE:"Verliezen...", MSGASATT:"...als aanvaller", MSGASDEF:"...als verdediger", MSGDIFF1:"laat niet de verschillen zien", MSGDIFF2:"laat verschillen zien", MSGDIFF3:"laat enkel de verschillen zien", BBCODELIMIT:"Vanwege gelimiteerde hoeveelheid tekst in een bericht, in het geval van een lange lijst, de data is onderverdeeld in groepen. Elke groep in een apart bericht plakken.", CHKPOWERNAME:"Toon de tijd tot mogelijk gebruik van de gunst",
  CHKNIGHTNAME:"Verduisterd de stad tijdens nacht bonus", CHKFORUMTABS:"Vervang scrollen van de forum tabs door meerdere regels", BTNRESERVE:"Claim", LNKRESERVE:"Claims", LBLGETRESER:"Data ophalen...", BTNCHECK:"Controle Claims", CHKCMDIMG:"View the icons for the destination city commands", STATSLINK:"Statistieken van deze pagina laden", BTNSUPPLAYERS:"Lijst met spelers", CHKUNITSCOST:"Het rapport de kosten van de verloren eenheden laten tonen", CHKOCEANNUMBER:"Oceaannummers laten zien", MSGRTLBL:"Opstandsinformatie",
  MSGRTSHOW:"Voeg bezigzijnde opstandsinformatie toe", MSGRTONLINE:"Ben je online tijdens fase rood?", MSGRTYES:"Ja", MSGRTNO:"Nee", MSGRTCSTIME:"Koloschip vaartijd", MSGRTERR:"Je kijkt naar de verkeerde stad!<br/> Ga naar de stad om de opstandsinformatie te maken: ", BBTEXT:"Tekst versie", BBHTML:"Tabel versie", MSG413ERR:"<h3>Het gegenereerde rapport is te groot</h3><p>Gebruik de aanwezige mogelijkheden en verklein het om publiceerproblemen te voorkomen</p>", CHKREPORTFORMAT:"Genereer rapporten door middel van tabellen",
  WALLNOTSAVED:"De muur is niet opgeslagen", WALLSAVED:"De muur is opgeslagen", POPSELRECRUNIT:"Klik, om de standaard productie-eenheid te selecteren", POPRECRUNITTRADE:"Klik, om de grondstoffen benodig voor de geselecteerde eenheid in te vullen", POPINSERTLASTREPORT:"Plak het laatst geconverteerde rapport", MSGCOPYREPORT:"Het rapport is  opgeslagen. Klik op[paste_icon]op de fora of op een nieuw berichtscherm, om het te posten", POPDISABLEALARM:"Schakel het alarm uit", SOUNDSETTINGS:"Geluid instellingen",
  CHKSOUNDMUTE:"Geluid uit", POPSOUNDLOOP:"In loop afspelen", POPSOUNDMUTE:"Het geluid uitzetten", POPSOUNDPLAY:"Speel af met deze instellingen", POPSOUNDSTOP:"Stop afspelen", POPSOUNDURL:"Url naar het bestand van het geluid", ABH:{WND:{WINDOWTITLE:"Legeraanbouw helper", UNITFRAME:"Kies je eenheid", DESCRIPTION1:"In deze stad heb je [population] vrije inwoners", DESCRIPTION2:"Wat genoeg is om  [max_units] te bouwen", DESCRIPTION3:"Je hebt [yesno] [research] onderzocht", DESCRIPTION4:"Je kan in de wachtrij[max_queue] eenheden zetten",
  TARGET:"Kies je bouwdoel", PACKAGE:"Grondstoffen per lading (units)", BTNSAVE:"Slaat instellingen op", TOOLTIPOK:"klik, om de standaard eenheid in te stellen waarvoor je grondstoffen zult zenden", TOOLTIPNOTOK:"Eenheid is nog niet onderzocht", SETTINGSAVED:"Instelling voor [city] zijn opgeslagen", HASRESEARCH:"DOE", NORESEARCH:"DOE NIET"}, RESWND:{RESLEFT:"Grondstoffen nog te sturen", IMGTOOLTIP:"klik, om de grondstoffen in te vullen"}}, NEWVERSION:{AVAILABLE:"Er is een nieuwe versie beschikbaar",
  INSTALL:"Installeer ", REMINDER:"Herinner mij later", REQRELOAD:"Het is nodig om de site opnieuw te laden", RELOAD:"Opnieuw laden"}, LANGS:{LANG:"Vertaling voor taal:", SEND:"Verzonden naar publicatie", SAVE:"Opslaan en testen", RESET:"Herstel de standaardtaal", REMOVE:"Verwijder je vertaling?"}, HELPTAB5:"Vertaling", COMMAND:{ALL:"Alle", INCOMING:"inkomend", OUTGOING:"uitgaand", RETURNING:"terugkomend", FORTOWN:"stad:"}, MSGSHOWCOST:"Kosten van verloren eenheden", BBIMG:"enkele afbeelding", LASTUPDATE:"1488490764765",
  SOUNDVOLUME:"Geluids Volume", SOUNDURL:"Geluidsbestand url", POPSOUNDEG:"voorbeeld: https://www.youtube.com/watch?v=v2AC41dglnM, https://youtu.be/v2AC41dglnM, http://www.freesfx.co.uk/rx2/mp3s/10/11532_1406234695.mp3", EMOTS:{LABEL:"Wil je meer emoticons?", MESS:"Plak links naar emoticons, elk op een nieuwe regel"}, RADAR:{TOWNFINDER:"Zoek steden", FIND:"Zoek", MAXCSTIME:"Maximale tijd kolonisatieschip", BTNFIND:"Zoek", TOWNNAME:"Stad", TOWNOWNER:"Eigenaar", TOWNRESERVED:"Reservering", TOWNPOINTS:"Minimale stadspunten",
  BTNSAVEDEFAULT:"Sla waarden op als standaard", ALL:"Elke Stad", UNITTIME:"tijd", MAXUNITTIME:"Maximale tijd"}, WALL:{LISTSAVED:"Opgeslagen muur op de dag", LISTSTATE:"Toestand van de muur op de dag", DELETECURRENT:"Verwijder het huidige bestand", WANTDELETECURRENT:"Wil je het huidige muur-bestand verwijderen?"}, QUESTION:"Vraag", TSL:{WND:{WINDOWTITLE:"Gesorteerde stedenlijst", TOOLTIP:"laat gesorteerde stad zien"}}, CHKOLDTRADE:"Gebruik oude handels layout", AO:{TITLE:"Academie overzicht"}, MOBILEVERSION:"Mobiele versie",
  CHKWONDERTRADE:"Wanneer men grondstoffen naar wereldwonderen stuurt, stuur maximale gelijke hoeveelheid"};
  this.pl = {AUTHOR:"Potusek", BTNCONV:"Konwertuj", BTNGENER:"Generuj", BTNSRC:"\u0179r\u00f3d\u0142o", BTNVIEW:"Podgl\u0105d", BTNSAVE:"Zapisz", BTNMARKS:"Oznacz jako przeczytane", BTNMARKA:"Oznacz wszystkie jako przeczytane", MSGTITLE:"Opcje konwersji", MSGQUEST:"Kt\u00f3re z danych chcesz opublikowa\u0107?", MSGALL:"Wszystkie", MSGBBCODE:"Po opublikowaniu raportu, mo\u017cesz powi\u0105za\u0107 go z wiadomo\u015bciami lub forum korzystaj\u0105c z BBCode.", MSGRESOURCE:"\u0141up", MSGUNITS:"Jednostki",
  MSGBUILD:"Budynki", MSGUSC:"Wykorzystane srebrne monety", MSGRAW:"Surowce", MSGSHOWCOST:"Koszty utraconych jednostek", SUPPORT:"Wspiera", SPY:"Szpieguje", CONQUER:"Podbi\u0142", LOSSES:"Straty", HIDDEN:"Ukryte", NOTUNIT:"[i]Brak[/i]", TOWN:"[i]Miasto:[/i] ", PLAYER:"[i]Gracz:[/i] ", ALLY:"[i]Sojusz:[/i] ", CAST:"rzuci\u0142:", ONTOWER:"Na miasto:", MSGHIDAD:"Ukrywanie miasta", MSGFORUM:"Raport b\u0119dzie publikowany", BBALLY:"forum sojuszu / w wiadomo\u015bci", BBFORUM:"forum zewn\u0119trzne",
  ERRGETSRC:"Wyst\u0105pi\u0142 b\u0142\u0105d! Prosz\u0119 wygenerowa\u0107 \u017ar\u00f3d\u0142o i wys\u0142a\u0107 jako za\u0142\u0105cznik na adres potusek@westtax.info", ICOCLOSE:"Zamknij", ICOHELP:"O konwerterze", MSGPREVIEW:"<b>Podgl\u0105d raportu</b>", HELPTAB1:"O konwerterze", HELPTAB2:"Jak to dzia\u0142a", HELPTAB3:"Zmiany", HELPTAB4:"Ustawienia", HLPVERSION:"Wersja", HLPFIXED:"Poprawiono", HLPADDED:"Dodano", MSGHUMAN:{OK:"Informacje zosta\u0142y zapisane", ERROR:"Wyst\u0105pi\u0142 b\u0142\u0105d podczas zapisu",
  YOUTUBEERROR:"Niepoprawny link lub niedozwolone odtwarzanie poza youtube"}, STATSPOINT:"Punkty", STATSRANK:"Ranking", LABELS:{attack:{ATTACKER:"Agresor", DEFENDER:"Obro\u0144ca", MSGHIDAT:"atakuj\u0105cego", MSGHIDDE:"obro\u0144cy", MSGATTUNIT:"Wojska atakuj\u0105cego", MSGDEFUNIT:"Wojska obro\u0144cy"}, support:{ATTACKER:"Wspieraj\u0105cy", DEFENDER:"Wspierany", MSGHIDAT:"wspieraj\u0105cego", MSGHIDDE:"wspieranego", MSGATTUNIT:"Wojska wspieraj\u0105cego", MSGDEFUNIT:"Wojska obro\u0144cy"}, espionage:{ATTACKER:"Szpieguj\u0105cy",
  DEFENDER:"Szpiegowany", MSGHIDAT:"szpieguj\u0105cego", MSGHIDDE:"szpiegowanego", MSGATTUNIT:"", MSGDEFUNIT:""}}, MSGDETAIL:"szczeg\u00f3\u0142y polecenia", MSGRETURN:"(powr\u00f3t)", MSGCLAIM:"rezerwuje miasto", MSGCLAIMPPUP:"Generuj rezerwacj\u0119", MSGGENBBCODE:"Generuj list\u0119 w BBCode", MSGDEFSITE:"Pokonane...", MSGLOSSITE:"Stracone...", MSGASATT:"...w roli atakuj\u0105cego", MSGASDEF:"...w roli obro\u0144cy", MSGDIFF1:"nie pokazuj r\u00f3\u017cnic", MSGDIFF2:"poka\u017c r\u00f3\u017cnice",
  MSGDIFF3:"poka\u017c tylko r\u00f3\u017cnice", BBCODELIMIT:"W zwi\u0105zku z ograniczeniem ilo\u015bci tekstu w jednym po\u015bcie, w przypadku d\u0142ugiej listy, dane zosta\u0142y podzielone na grupy. Ka\u017cd\u0105 grup\u0119 wklejaj jako osobny wpis.", CHKPOWERNAME:"Wy\u015bwietlaj czas, jaki pozosta\u0142 do mo\u017cliwo\u015bci u\u017cycia czaru", CHKNIGHTNAME:"Zaciemniaj polis w bonusie nocnym", CHKFORUMTABS:"Zamie\u0144 przewijane zak\u0142adki na forum, na wieloliniowe", BTNRESERVE:"Rezerwacja",
  LNKRESERVE:"Rezerwacje", LBLGETRESER:"Pobieranie danych ...", BTNCHECK:"Sprawdzenie rezerwacji", CHKCMDIMG:"Poka\u017c ikony rozkaz\u00f3w przy docelowym mie\u015bcie", STATSLINK:"Statystyki wy\u015bwietlaj ze strony", BTNSUPPLAYERS:"Lista graczy", CHKUNITSCOST:"Na raporcie pokazuj koszt straconych jednostek", CHKOCEANNUMBER:"Wy\u015bwietlaj numery m\u00f3rz", MSGRTLBL:"Informacja o buncie", MSGRTSHOW:"Do\u0142\u0105cz do raportu informacje o buncie", MSGRTONLINE:"Czy b\u0119dziesz online podczas buntu?",
  MSGRTYES:"Tak", MSGRTNO:"Nie", MSGRTGOD:"B\u00f3g", MSGRTCSTIME:"CK", MSGRTONL:"online?", MSGRTERR:"Znajdujesz si\u0119 w niew\u0142a\u015bciwym mie\u015bcie!<br/>Aby wygenerowa\u0107 informacje o buncie, przejd\u017a do miasta: ", BBTEXT:"wersja tekstowa", BBHTML:"wersja oparta na tabelach", BBIMG:"jako pojedynczy obraz", MSG413ERR:"<h3>Je\u017celi przez d\u0142u\u017csz\u0105 chwil\u0119 widzisz ten napis, w\u00f3wczas wygenerowany raport jest zbyt obszerny.</h3><p>U\u017cyj dost\u0119pnych opcji redukuj\u0105c ilo\u015b\u0107 publikowanych danych.</p>",
  CHKREPORTFORMAT:"Generowanie raport\u00f3w w oparciu o tabele", WALLNOTSAVED:"Mur nie zosta\u0142 zapisany", WALLSAVED:"Mur jest zapisany", POPSELRECRUNIT:"kliknij, aby wybra\u0107 domy\u015bln\u0105 jednostk\u0119 do produkcji", POPRECRUNITTRADE:"kliknij, \u017ceby zape\u0142ni\u0107 handlarza surowcami dla wybranej jednostki", POPINSERTLASTREPORT:"Wstaw ostatni wynik konwersji", MSGCOPYREPORT:"Wynik konwersji zosta\u0142 zapisany. Prosz\u0119 klikn\u0105\u0107 [paste_icon] na forum lub w wiadomo\u015bci, aby wstawi\u0107",
  POPDISABLEALARM:"Wy\u0142\u0105cz alarm", SOUNDSETTINGS:"Ustawienia d\u017awi\u0119ku", CHKSOUNDMUTE:"Wycisz", SOUNDVOLUME:"G\u0142o\u015bno\u015b\u0107", SOUNDURL:"\u015acie\u017cka do pliku", CHKSOUNDLOOP:"odtwarzaj w p\u0119tli", POPSOUNDLOOP:"odtwarzaj w p\u0119tli", POPSOUNDMUTE:"Wycisz d\u017awi\u0119k", POPSOUNDPLAY:"Odtw\u00f3rz z bie\u017c\u0105cymi ustawieniami", POPSOUNDSTOP:"Przerwij odtwarzanie", POPSOUNDURL:"\u015acie\u017cka do pliku z d\u017awi\u0119kiem", POPSOUNDEG:"np: https://www.youtube.com/watch?v=v2AC41dglnM, https://youtu.be/v2AC41dglnM, http://www.freesfx.co.uk/rx2/mp3s/10/11532_1406234695.mp3",
  STATS:{PLAYER:"Statystyki gracza", ALLY:"Statystyki sojuszu", TOWN:"Statystyki miasta", INACTIVE:"Nieaktywny", CHKINACTIVE:"Poka\u017c nieaktywno\u015b\u0107 graczy", INACTIVEDESC:"W tym czasie nie odnotowano punkt\u00f3w walki jak i rozbudowy"}, ABH:{WND:{WINDOWTITLE:"Pomocnik w budowaniu armii", UNITFRAME:"Wybierz domy\u015bln\u0105 jednostk\u0119", DESCRIPTION1:"W obecnym mie\u015bcie masz [population] wolnych mieszka\u0144c\u00f3w", DESCRIPTION2:"Co wystarczy do zbudowania: [max_units]", DESCRIPTION3:"[yesno] badanie [research]",
  DESCRIPTION4:"Mo\u017cesz zakolejkowa\u0107 max [max_queue] jednostek", TARGET:"wybierz ile zbudowa\u0107", PACKAGE:"na ile jednostek domy\u015blnie wysy\u0142a\u0107", BTNSAVE:"zapisz ustawienia", TOOLTIPOK:"kliknij, aby wybra\u0107 jednostk\u0119 dla kt\u00f3rej chcesz domy\u015blnie wysy\u0142a\u0107 surowce", TOOLTIPNOTOK:"jednostka nie zosta\u0142a zbadana", HASRESEARCH:"MASZ", NORESEARCH:"NIE MASZ", SETTINGSAVED:"Ustawienia dla miasta [city] zosta\u0142y zapisane"}, RESWND:{RESLEFT:"pozosta\u0142o do wys\u0142ania",
  IMGTOOLTIP:"kliknij, \u017ceby wype\u0142ni\u0107 pola surowc\u00f3w"}}, NEWVERSION:{AVAILABLE:"Dost\u0119pna nowa wersja", INSTALL:"Zainstaluj", REMINDER:"Przypomnij p\u00f3\u017aniej", REQRELOAD:"Wymagane od\u015bwie\u017cenie strony", RELOAD:"Od\u015bwie\u017c"}, HELPTAB5:"T\u0142umaczenie", LANGS:{REMOVE:"Skasowa\u0107 Twoje t\u0142umaczenie?", RESET:"Przywr\u00f3\u0107 domy\u015blny j\u0119zyk", SAVE:"Zapisz i testuj", SEND:"Wy\u015blij do publikacji", LANG:"T\u0142umaczenie dla j\u0119zyka:"},
  BTNSIMUL:"Symulator", EMOTS:{LABEL:"Chcesz wi\u0119cej emotek?", MESS:"Wklej linki do obrazk\u00f3w, ka\u017cdy w nowej linii"}, COMMAND:{ALL:"Wszystkie", INCOMING:"nadchodz\u0105ce", OUTGOING:"wychodz\u0105ce", RETURNING:"powracaj\u0105ce", FORTOWN:"miasto:"}, RADAR:{TOWNFINDER:"Wyszukiwanie miast", FIND:"Szukane", MAXCSTIME:"Maksymalny czas statku kolonizacyjnego", MAXUNITTIME:"Maksymalny czas", BTNFIND:"Szukaj", TOWNNAME:"Miasto", CSTIME:"Czas", UNITTIME:"Czas", TOWNOWNER:"W\u0142a\u015bciciel",
  TOWNRESERVED:"Rezerwacja", TOWNPOINTS:"Minimalne punkty miasta", BTNSAVEDEFAULT:"Zapisz warto\u015bci jako domy\u015blne", ALL:"Dowolne miasto", SHOWCITIES:"Poka\u017c miasta"}, WALL:{LISTSAVED:"Zapis muru na dzie\u0144", LISTSTATE:"Stan muru na dzie\u0144", DELETECURRENT:"Usu\u0144 bie\u017c\u0105cy zapis", WANTDELETECURRENT:"Czy chcesz usun\u0105\u0107 bie\u017c\u0105cy zapis muru?"}, QUESTION:"Pytanie", TSL:{WND:{WINDOWTITLE:"Lista posortowanych miast", TOOLTIP:"poka\u017c posortowane miasta"}},
  CHKOLDTRADE:"U\u017cywaj starego uk\u0142adu handlu", AO:{TITLE:"Przegl\u0105d Akademii"}, MOBILEVERSION:"Wersja mobilna", CHKWONDERTRADE:"Podczas wysy\u0142ania zasob\u00f3w do cud\u00f3w \u015bwiata, wy\u015blij maksymalne r\u00f3wne ilo\u015bci", CHKTOWNPOPUP:"Wy\u015bwietlaj dymek z informacj\u0105 o wojsku po najechaniu na nazw\u0119 miasta w rozwijanej li\u015bcie miast", POPWONDERSHOT:"Ilo\u015b\u0107 dost\u0119pnych przyspiesze\u0144 budowy", CHKTACL:"W\u0142\u0105cz przesuwanie listy ruchu wojsk",
  BTNCOMPARE:"Pakt vs Wr\u00f3g", ALLYCOMPARETITLE:"Por\u00f3wnanie sojuszy koalicji z wrogimi sojuszami", CHKMCOL:"Przypisz kolory wiadomo\u015bciom zgodnie z ustalonym schematem kolorowania", CHKBUPO:"Poka\u017c punkty rozbudowy"};
  this.pt = {AUTHOR:"100 no\u00e7\u00e3o, Cirrus Minor, AceCombat021, Dark Rebel, Difus, Eduslb98, Gwyneth Llewelyn, AceCombat021, Dark Rebel, Difus, Eduslb98, Gwyneth Llewelyn, zyka", BTNCONV:"Converter", BTNGENER:"Gerar", BTNVIEW:"Visualizar", BTNSAVE:"Salvar", MSGTITLE:"Converter Relat\u00f3rio", MSGQUEST:"Quais dados voc\u00ea deseja publicar ?", MSGBBCODE:"Uma vez o relat\u00f3rio publicado, pode partilh\u00e1-lo em not\u00edcias e f\u00f3runs usando BBCode.", MSGRESOURCE:"Saque", MSGUNITS:"Unidades",
  MSGBUILD:"Edif\u00edcios", MSGUSC:"Moedas de prata usadas", MSGRAW:"Recursos da Cidade", SUPPORT:"Suporte", SPY:"Espionagem", CONQUER:"Conquistas", LOSSES:"Perdas", HIDDEN:"Omitido", NOTUNIT:"[i]Nenhum[/i]", TOWN:"[i]Cidade:[/i] ", PLAYER:"[i]Jogador:[/i] ", ALLY:"[i]Alian\u00e7a:[/i] ", CAST:"Lan\u00e7ar:", ONTOWER:"Na Cidade:", MSGHIDAD:"Esconder cidades", MSGFORUM:"O relat\u00f3rio ser\u00e1 publicado", BBALLY:"F\u00f3runs da alian\u00e7a / na mensagem", BBFORUM:"F\u00f3rum Externo", ICOCLOSE:"Fechar",
  ICOHELP:"Sobre o conversor", MSGPREVIEW:"<b>Pr\u00e9 visualiza\u00e7\u00e3o do Relat\u00f3rio</b>", HELPTAB1:"Sobre", HELPTAB2:"Como funciona", HELPTAB3:"Mudan\u00e7as", HELPTAB4:"Configura\u00e7\u00f5es", MSGHUMAN:{OK:"Informa\u00e7\u00e3o salva com sucesso", ERROR:"Ocorreu um erro ao salvar", YOUTUBEERROR:"Link incorreto ou n\u00e3o dispon\u00edvel fora do youtube"}, LABELS:{attack:{ATTACKER:"Atacante", DEFENDER:"Defensor", MSGHIDAT:"Atacante", MSGHIDDE:"defensor", MSGATTUNIT:"Unidades de Ataque",
  MSGDEFUNIT:"Unidades de Defesa"}, support:{ATTACKER:"Apoiando", DEFENDER:"Apoiado", MSGHIDAT:"Apoiando", MSGHIDDE:"Apoiado", MSGATTUNIT:"Unidades apoiando", MSGDEFUNIT:"Unidades Defendendo"}, espionage:{ATTACKER:"Espi\u00e3o", DEFENDER:"Espiado", MSGHIDAT:"Espi\u00e3o", MSGHIDDE:"Espiado", MSGATTUNIT:"", MSGDEFUNIT:""}}, MSGDETAIL:"Detalhes do Comando", MSGRETURN:"(retornar)", MSGGENBBCODE:"Gerar lista de BBcode", MSGDEFSITE:"Derrotado...", MSGLOSSITE:"Perdas...", MSGASATT:"...Como atacante", MSGASDEF:"...Como defensor",
  MSGDIFF1:"N\u00e3o mostrar diferen\u00e7as", MSGDIFF2:"Mostrar diferen\u00e7as", MSGDIFF3:"Mostrar apenas as diferen\u00e7as", BBCODELIMIT:"Tendo em vista um n\u00famero limitado de caracteres em um post, no caso de uma lista longa, os dados ser\u00e3o divididos em grupos, cada grupo postado separadamente.", CHKPOWERNAME:"Tempo restante para poder usar o encantamento", CHKFORUMTABS:"Substituir guias de rolagem do f\u00f3rum para uma guia paralela", STATSLINK:"Estat\u00edsticas no visor", BTNSUPPLAYERS:"Lista de jogadores",
  CHKUNITSCOST:"O Relat\u00f3rio mostra o custo das unidades perdidas", CHKOCEANNUMBER:"Exibir n\u00famero do oceano", MSGRTLBL:"Informa\u00e7\u00f5es sobre a revolta", MSGRTSHOW:"Adicionar informa\u00e7\u00e3o de revolta em curso", MSGRTONLINE:"Voc\u00ea estar\u00e1 online durante a m\u00e3o de fogo ?", MSGRTYES:"Sim", MSGRTNO:"N\u00e3o", MSGRTGOD:"Deus", MSGRTCSTIME:"Tempo de NC", MSGRTONL:"Conectado ?", MSGRTERR:"Voc\u00ea est\u00e1 na cidade errada!<br/>Para criar a informa\u00e7\u00e3o de revolta, por favor v\u00e1 para a cidade:",
  BBTEXT:"Vers\u00e3o em Texto", BBHTML:"Vers\u00e3o em Tabela", MSG413ERR:"<h3>O relat\u00f3rio gerado \u00e9 muito grande.</h3><p>Use as op\u00e7\u00f5es dispon\u00edveis para reduzir e publicar sem problemas.</p>", CHKREPORTFORMAT:"Gerar relat\u00f3rios usando Tabela", WALLNOTSAVED:"Muralha n\u00e3o foi salva", WALLSAVED:"Muralha foi salva", POPSELRECRUNIT:"Clique, para selecionar a unidade de produ\u00e7\u00e3o padr\u00e3o", POPRECRUNITTRADE:"Clique, para preencher os recursos necess\u00e1rios para recrutar a unidade selecionada",
  POPINSERTLASTREPORT:"Colar o \u00faltimo relat\u00f3rio convertido", MSGCOPYREPORT:"O relat\u00f3rio foi salvo. Por favor, clique em [paste_icon] no f\u00f3rum ou em nova janela de mensagem para col\u00e1-lo", POPDISABLEALARM:"Desativar alarme", SOUNDSETTINGS:"Configura\u00e7\u00f5es de som", CHKSOUNDMUTE:"Mudo", SOUNDVOLUME:"Volume", SOUNDURL:"Link de som", CHKSOUNDLOOP:"ciclo", POPSOUNDLOOP:"percorrer ciclo", POPSOUNDMUTE:"Mutar o som", POPSOUNDPLAY:"Jogar com as configura\u00e7\u00f5es atuais",
  POPSOUNDSTOP:"Parar execu\u00e7\u00e3o", POPSOUNDURL:"Caminho de url para o arquivo com som", STATS:{PLAYER:"Status do Jogador", ALLY:"Status da Alian\u00e7a", TOWN:"Status da Cidade", INACTIVE:"Inativo", CHKINACTIVE:"Mostrar Jogadores Inativos", INACTIVEDESC:"Neste tempo n\u00e3o houve pontos ganhos atacando ou expandindo."}, ABH:{WND:{WINDOWTITLE:"Construtor de Ex\u00e9rcitos", UNITFRAME:"Selecione sua unidade", DESCRIPTION1:"Nessa cidade, voc\u00ea tem [population] popula\u00e7\u00e3o livre",
  DESCRIPTION2:"Qual \u00e9 o suficiente para construir [max_units]", DESCRIPTION3:"Voc\u00ea [yesno] Tem [research] Pesquisado.", DESCRIPTION4:"Voc\u00ea pode enfileirar um m\u00e1ximo de [max_queue] unidades", TARGET:"Selecione sua cidade alvo", PACKAGE:"Pacote de Recursos por vez (units)", BTNSAVE:"Salvar configura\u00e7\u00f5es", TOOLTIPOK:"Clique para selecionar a unidade padr\u00e3o a qual voc\u00ea estar\u00e1 enviando recursos", TOOLTIPNOTOK:"A unidade n\u00e3o foi pesquisada", HASRESEARCH:"Fazer",
  NORESEARCH:"N\u00e3o fazer", SETTINGSAVED:"Configura\u00e7\u00f5es de [city] Foram salvas"}, RESWND:{RESLEFT:"Recursos excedentes para envio", IMGTOOLTIP:"Clique, para preencher os recursos"}}, NEWVERSION:{AVAILABLE:"Nova vers\u00e3o dispon\u00edvel", INSTALL:"Instalar", REMINDER:"Lembrar mais tarde", REQRELOAD:"Atualiza\u00e7\u00e3o requerida", RELOAD:"Atualizar"}, LANGS:{LANG:"Traduzido para o idioma:", SEND:"Enviar para publica\u00e7\u00e3o", SAVE:"Salvar e testar", RESET:"Restaurar idioma padr\u00e3o",
  REMOVE:"Excluir sua tradu\u00e7\u00e3o ?"}, HELPTAB5:"Tradu\u00e7\u00e3o", BTNSIMUL:"Simulador", EMOTS:{LABEL:"Quer mais emoctions ?", MESS:"Cole links para emoction, cada um em uma nova linha"}, COMMAND:{ALL:"Todos", INCOMING:"A chegar", OUTGOING:"A partir", RETURNING:"A regressar", FORTOWN:"cidade:"}, MSGSHOWCOST:"Custo de unidades perdidas", BBIMG:"imagem \u00fanica ", POPSOUNDEG:"exemplo: https://www.youtube.com/watch?v=v2AC41dglnM, https://youtu.be/v2AC41dglnM, http://www.freesfx.co.uk/rx2/mp3s/10/11532_1406234695.mp3",
  RADAR:{FIND:"Procurar", TOWNFINDER:"Procurar Cidades", MAXCSTIME:"Tempo m\u00e1ximo para NC", TOWNPOINTS:"Pontos m\u00ednimos da cidade", TOWNRESERVED:"Reservas", TOWNOWNER:"Dono", BTNSAVEDEFAULT:"Salvar valores como padr\u00e3o", ALL:"Qualquer cidade", BTNFIND:"Procurar", TOWNNAME:"Cidade", CSTIME:"Tempo CS"}, WALL:{LISTSTATE:"Condi\u00e7\u00e3o da muralha no dia", DELETECURRENT:"Apagar o registo corrente", LISTSAVED:"Muralha salva no dia", WANTDELETECURRENT:"Quer apagar o registo corrente no cronograma?"},
  QUESTION:"Quest\u00e3o", CHKWONDERTRADE:"Ao enviar recursos para maravilhas do mundo, enviar quantidades m\u00e1ximas iguais", MOBILEVERSION:"Vers\u00e3o m\u00f3vel", AO:{TITLE:"Vis\u00e3o geral da academia"}, CHKOLDTRADE:"Usar anterior esquema de com\u00e9rcio", TSL:{WND:{TOOLTIP:"mostrar cidade ordenada", WINDOWTITLE:"Lista de cidades ordenada"}}, LASTUPDATE:"1487531813324"};
  this.ro = {INFO:{0:"Potusek", 1:"grepolis@potusek.eu"}, WEBSITE:"Website", AUTHOR:"Autor, Sir Prize, magicianul2006, EnsyFane, LLTCM", BTNCONV:"Converteste", BTNGENER:"Genereaza", BTNSRC:"Sursa", BTNVIEW:"Previzualizare", BTNSAVE:"Salveaza", BTNMARKS:"Marcheaza ca citit", BTNMARKA:"Marcheaza tot ca citit", MSGTITLE:"Converteste Raportul", MSGQUEST:"Ce informatii din data vrei sa publici?", MSGALL:"Tot", MSGBBCODE:"Urmarind publicarea raportului, puteti sa il asociati cu noutati si forumuri folosind BBCode.",
  MSGRESOURCE:"Prada", MSGUNITS:"Solda\u021bi", MSGBUILD:"Cladiri", MSGUSC:"Monede de argint utilizate", MSGRAW:"Materii prime", SUPPORT:"Sprijin", SPY:"Spionat", CONQUER:"Cucerit", LOSSES:"Pierderi", HIDDEN:"Ascunde", NOTUNIT:"[i]Nimic[/i]", TOWN:"[i]Ora\u0219:[/i] ", PLAYER:"[i]Juc\u0103tor:[/i] ", ALLY:"[i]Alian\u021b\u0103:[/i] ", CAST:"Folosire:", ONTOWER:"\u00cen ora\u0219:", MSGHIDAD:"Ascunde ora\u0219", MSGFORUM:"Raportul va fi publicat", BBALLY:"forumurile alian\u021bei / \u00een mesaje",
  BBFORUM:"forum extern", ERRGETSRC:"O eroare a avut loc! Va rugam, trimiteti sursa ca o atasare la potusek@westtax.info", ICOCLOSE:"\u00cenchide", ICOHELP:"Despre convertor", MSGPREVIEW:"<b>Previzualizare raport</b>", HELPTAB1:"Despre", HELPTAB2:"Cum func\u021bioneaz\u0103", HELPTAB3:"Schimb\u0103ri", HELPTAB4:"Set\u0103ri", HLPVERSION:"Versiune", HLPFIXED:"Fixat", HLPADDED:"Adaugat", MSGHUMAN:{OK:"Informatiile au fost salvate", ERROR:"O eroare a avut loc in timpul tiparirii", YOUTUBEERROR:"Link incorect sau nu este posibila redarea inafara youtube"},
  STATS:"Statisticile jucatorului", STATSPOINT:"Puncte", STATSRANK:"Rang", LABELS:{attack:{ATTACKER:"Atacator", DEFENDER:"Aparator", MSGHIDAT:"atacator", MSGHIDDE:"aparator", MSGATTUNIT:"Armata atacatoare", MSGDEFUNIT:"Armata defensiva"}, support:{ATTACKER:"Sprijin", DEFENDER:"Sprijinit", MSGHIDAT:"sprijin", MSGHIDDE:"sprijinit", MSGATTUNIT:"Armata sprijin", MSGDEFUNIT:"Armata aparatori"}, espionage:{ATTACKER:"Spion", DEFENDER:"Spionat", MSGHIDAT:"spion", MSGHIDDE:"spionat", MSGATTUNIT:"", MSGDEFUNIT:""}},
  MSGDETAIL:"deatalii comanda", MSGRETURN:"(inapoi)", MSGCLAIM:"oras \u200b\u200brezervare", MSGCLAIMPPUP:"Genereaza rezervare", MSGGENBBCODE:"Genereaz\u0103 o list\u0103 de BBCode", MSGDEFSITE:"Infrant...", MSGLOSSITE:"Pierderi...", MSGASATT:"...ca atacator", MSGASDEF:"...ca ap\u0103r\u0103tor", MSGDIFF1:"nu arat\u0103 diferen\u021bele", MSGDIFF2:"arat\u0103 diferen\u021bele", MSGDIFF3:"arat\u0103 doar diferen\u021bele", BBCODELIMIT:"Din cauza spa\u021biului limitat pentru text \u00eentr-o postare, \u00een cazul unei liste lungi, informa\u021bia a fost impar\u021bit\u0103 pe grupe. Fiecare grup\u0103 este separat\u0103.",
  CHKPOWERNAME:"Arat\u0103 timpul r\u0103mas p\u00e2n\u0103 la folosirea vr\u0103jii", CHKNIGHTNAME:"Ascunde orasul in bonusul de noapte", CHKFORUMTABS:"Aranjeaz\u0103 tab-urile de pe forum pe mai multe r\u00e2nduri", BTNRESERVE:"Booking", LNKRESERVE:"Reservations", LBLGETRESER:"No\u0163iuni de baz\u0103 de date ...", BTNCHECK:"Checking reservations", CHKCMDIMG:"View the icons for the destination city commands", STATSLINK:"Statistici de afi\u0219at", BTNSUPPLAYERS:"Lista juc\u0103torilor", CHKUNITSCOST:"Afi\u0219area costurilor unit\u0103\u021bilor pierdute \u00een raport",
  CHKOCEANNUMBER:"Arat\u0103 num\u0103rul m\u0103rii", MSGRTCSTIME:"Timp Nava Colonizare", MSGRTGOD:"Zeu", MSGRTNO:"Nu", MSGRTYES:"Da", MSGRTONLINE:"Vei fi online in timpul revoltei rosii? ", MSGRTSHOW:"Adauga informatii despre revolta in curs de desfasurare", MSGRTLBL:"Informa\u021bia despre revolt\u0103", MSGRTERR:"E\u0219ti \u00een orasul gre\u0219it!<br/>Pentru a crea informa\u021bia pentru revolt\u0103, mergi te rog la ora\u0219ul: ", BBHTML:"versiunea tabelat\u0103", BBTEXT:"versiunea text",
  MSG413ERR:"<h3>Raportul generat este prea mare.</h3><p>Folose\u0219te op\u021biunile valabile \u0219i reduse pentru a publica f\u0103r\u0103 probleme.</p>", CHKREPORTFORMAT:"Genereaz\u0103 rapoarte folosind tabele", WALLNOTSAVED:"Zidul nu a fost salvat", WALLSAVED:"Zidul a fost salvat", POPRECRUNITTRADE:"click, ca s\u0103 folose\u0219ti resursele necesare pentru recrutarea unit\u0103\u021bii selectate", ABH:{WND:{WINDOWTITLE:"GRCRTools Ajutor Creator Armata", UNITFRAME:"alege-ti unitatea", DESCRIPTION1:"In acest oras ai [population] populatie libera",
  DESCRIPTION2:"Care este suficienta pentru a construi [max_units]", DESCRIPTION3:"Tu [yesno] ai cercetat [research].", DESCRIPTION4:"Poti sa adaugi in coada [max_queue] unitati", TARGET:"alege constructia", PACKAGE:"pachet de resurse pe expediere", BTNSAVE:"salveaza setarile", TOOLTIPOK:"click pentru a seta o unitate prestabilita pentru care vei trimite resurse", TOOLTIPNOTOK:"unitatile nu au fost cercetate", HASRESEARCH:"Fa", NORESEARCH:"Nu face", SETTINGSAVED:"Setarile pentru [city] au fost salvate"},
  RESWND:{RESLEFT:"resurse ramase pentru trimitere", IMGTOOLTIP:"click pentru a completa cu resurse"}}, POPSOUNDURL:"Calea url a fi\u0219ierului cu sunet", POPSOUNDSTOP:"Nu asculta", POPSOUNDPLAY:"Ascult\u0103 cu set\u0103rile curente", POPSOUNDMUTE:"\u00cenchide sunetul", POPSOUNDLOOP:"Ascult\u0103 \u00een bucl\u0103", CHKSOUNDLOOP:"bucl\u0103", SOUNDVOLUME:"Volum", SOUNDURL:"Sunetul fi\u0219ierului url", CHKSOUNDMUTE:"Mut", SOUNDSETTINGS:"Set\u0103ri pentru sunet", POPDISABLEALARM:"Dezactiveaz\u0103 alarma",
  MSGCOPYREPORT:"Raportul a fost salvat. Te rog d\u0103 click [lipire_icon] pe forumuri sau pe noile mesaje din fereastra pentru lipire", POPINSERTLASTREPORT:"Lipe\u0219te ultimul raport convertit", NEWVERSION:{AVAILABLE:"O noua versiune este disponibila", INSTALL:"Instaleaza", REMINDER:"Adu-mi aminte mai tarziu", REQRELOAD:"Reimprospatare nececsara", RELOAD:"Reimprospateaza"}, LANGS:{LANG:"Traducere limba:", SEND:"Trimite catre editori", SAVE:"Salveaza si testeaza", RESET:"Seteaza limba prestabilita",
  REMOVE:"Sterge traducerea"}, HELPTAB5:"Traducere", EMOTS:{LABEL:"Doresti mai multe emoticonuri?", MESS:"Lipeste link-ul catre emoticon, fiecare pe o noua linie"}, COMMAND:{ALL:"toate", INCOMING:"vine", OUTGOING:"pleaca", RETURNING:"se intoarce", FORTOWN:"oras:"}, CHKWONDERTRADE:"Cand se trimit resurse pentru minunile lumii, se trimit cantitati maxime si egale de resurse", MOBILEVERSION:"Versiunea mobila", AO:{TITLE:"Prezentare general\u0103 a Academiilor"}, CHKOLDTRADE:"Foloseste configuratia veche pentru negot",
  TSL:{WND:{TOOLTIP:"arata orasele sortate", WINDOWTITLE:"Lista Sortata a Oraselor"}}, QUESTION:"Intrebare", WALL:{WANTDELETECURRENT:"Doresti sa stergi inregistrarile curente ale zidului?", DELETECURRENT:"Sterge inregistrarile curente", LISTSTATE:"Conditia zidului in ziua", LISTSAVED:"Salvat pe zid in ziu"}, RADAR:{ALL:"Orice oras", BTNSAVEDEFAULT:"Salveaza valorile ca implicite", TOWNPOINTS:"Puncte minime pe oras", TOWNRESERVED:"Rezervare", TOWNOWNER:"Detinator", CSTIME:"Timp Nava de Colonizare",
  BTNFIND:"Cauta", TOWNNAME:"Oras", MAXCSTIME:"Timp maxim nava de colonizare", FIND:"Cauta", TOWNFINDER:"Cauta orase"}, POPSOUNDEG:"exemplu: https://www.youtube.com/watch?v=v2AC41dglnM, https://youtu.be/v2AC41dglnM, http://www.freesfx.co.uk/rx2/mp3s/10/11532_1406234695.mp3", MSGSHOWCOST:"Costul unitatilor pierdute", LASTUPDATE:"1487507969523"};
  this.ru = {AUTHOR:"Goland70, CTPEC, Aitery, Sporeman4, wenavit, Vlad- K., \u0422\u0435\u0440\u0440\u043e", BTNCONV:"\u041a\u043e\u043d\u0432\u0435\u0440\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c", BTNGENER:"\u0413\u0435\u043d\u0435\u0440\u0438\u0440\u043e\u0432\u0430\u0442\u044c", BTNVIEW:"\u041f\u0440\u0435\u0434\u043e\u0441\u043c\u043e\u0442\u0440", BTNSAVE:"\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c", MSGTITLE:"\u041f\u0440\u0435\u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u044c \u043e\u0442\u0447\u0435\u0442",
  MSGQUEST:"\u041a\u0430\u043a\u0438\u0435 \u0438\u0437 \u0434\u0430\u043d\u043d\u044b\u0445 \u0432\u044b \u0445\u043e\u0442\u0438\u0442\u0435 \u043e\u043f\u0443\u0431\u043b\u0438\u043a\u043e\u0432\u0430\u0442\u044c?", MSGBBCODE:"\u041f\u043e\u0441\u043b\u0435 \u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u0438 \u0434\u043e\u043a\u043b\u0430\u0434\u0430, \u0432\u044b \u043c\u043e\u0436\u0435\u0442\u0435 \u0441\u0438\u043d\u0445\u0440\u043e\u043d\u0438\u0437\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0435\u0433\u043e \u0441 \u043d\u043e\u0432\u043e\u0441\u0442\u044f\u043c\u0438 \u0438 \u0444\u043e\u0440\u0443\u043c\u0430\u0445, \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u044f BB-\u043a\u043e\u0434\u044b.",
  MSGRESOURCE:"\u0414\u043e\u0431\u044b\u0447\u0430", MSGUNITS:"\u0411\u043e\u0435\u0432\u044b\u0435 \u0435\u0434\u0438\u043d\u0438\u0446\u044b", MSGBUILD:"\u0417\u0434\u0430\u043d\u0438\u044f", MSGUSC:"\u0418\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d\u043e \u0441\u0435\u0440\u0435\u0431\u0440\u044f\u043d\u044b\u0445 \u043c\u043e\u043d\u0435\u0442", MSGRAW:"\u0421\u044b\u0440\u044c\u0435", SUPPORT:"\u041f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0430", SPY:"\u0428\u043f\u0438\u043e\u043d\u0430\u0436",
  CONQUER:"\u0417\u0430\u0432\u043e\u0435\u0432\u0430\u043d\u043d\u044b\u0439", LOSSES:"\u041f\u043e\u0442\u0435\u0440\u0438", HIDDEN:"\u0421\u043a\u0440\u044b\u0442\u044b\u0439", NOTUNIT:"[i]\u041d\u0438 \u043e\u0434\u0438\u043d[/i]", TOWN:"[i]\u0413\u043e\u0440\u043e\u0434:[/i] ", PLAYER:"[i]\u0418\u0433\u0440\u043e\u043a:[/i] ", ALLY:"[i]\u0421\u043e\u044e\u0437\u043d\u0438\u043a:[/i] ", CAST:"\u0411\u0440\u043e\u0441\u043e\u043a:", ONTOWER:"\u0412 \u0433\u043e\u0440\u043e\u0434\u0435:", MSGHIDAD:"\u0421\u043a\u0440\u044b\u0442\u044c \u0433\u043e\u0440\u043e\u0434",
  MSGFORUM:"\u041e\u0442\u0447\u0451\u0442 \u0431\u0443\u0434\u0435\u0442 \u043e\u043f\u0443\u0431\u043b\u0438\u043a\u043e\u0432\u0430\u043d", BBALLY:"\u0424\u043e\u0440\u0443\u043c\u044b \u0430\u043b\u044c\u044f\u043d\u0441\u0430 / \u0432 \u0441\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0438", BBFORUM:"\u0432\u043d\u0435\u0448\u043d\u0438\u0439 \u0444\u043e\u0440\u0443\u043c", ICOCLOSE:"\u0417\u0430\u043a\u0440\u044b\u0442\u044c", ICOHELP:"\u041e \u043f\u0440\u0435\u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u0435",
  MSGPREVIEW:"<b>\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 \u043e\u0442\u0447\u0451\u0442\u0430</b>", HELPTAB1:"\u041e \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u0438", HELPTAB2:"\u041a\u0430\u043a \u044d\u0442\u043e \u0440\u0430\u0431\u043e\u0442\u0430\u0435\u0442", HELPTAB3:"\u0418\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u044f", HELPTAB4:"\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438", MSGHUMAN:{OK:"\u0418\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f \u0431\u044b\u043b\u0430 \u0441\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u0430",
  ERROR:"\u041f\u0440\u043e\u0438\u0437\u043e\u0448\u043b\u0430 \u043e\u0448\u0438\u0431\u043a\u0430 \u043f\u0440\u0438 \u0437\u0430\u043f\u0438\u0441\u0438", YOUTUBEERROR:"\u041d\u0435\u0432\u0435\u0440\u043d\u0430\u044f \u0441\u0441\u044b\u043b\u043a\u0430, \u0438\u043b\u0438 \u0432\u0438\u0434\u0435\u043e \u043d\u0435 \u0440\u0430\u0437\u0440\u0435\u0448\u0435\u043d\u043e \u043e\u0442\u043a\u0440\u044b\u0432\u0430\u0442\u044c \u0432\u043d\u0435 \u0441\u0430\u0439\u0442\u0430 YouTube.com"}, LABELS:{attack:{ATTACKER:"\u0410\u0442\u0430\u043a\u0430",
  DEFENDER:"\u041e\u0431\u043e\u0440\u043e\u043d\u0430", MSGHIDAT:"\u0430\u0442\u0430\u043a\u0430", MSGHIDDE:"\u043e\u0431\u043e\u0440\u043e\u043d\u0430", MSGATTUNIT:"\u0412\u043e\u0439\u0441\u043a\u0430 \u0430\u0442\u0430\u043a\u0430", MSGDEFUNIT:"\u0412\u043e\u0439\u0441\u043a\u0430 \u043e\u0431\u043e\u0440\u043e\u043d\u0430"}, support:{ATTACKER:"\u041f\u043e\u0434\u043a\u0440\u0435\u043f\u043b\u0435\u043d\u0438\u0435", DEFENDER:"\u041f\u043e\u0434\u0434\u0435\u0440\u0436\u0430\u043d\u043d\u044b\u0439",
  MSGHIDAT:"\u043f\u043e\u0434\u043a\u0440\u0435\u043f\u043b\u0435\u043d\u0438\u0435", MSGHIDDE:"\u043f\u043e\u0434\u0434\u0435\u0440\u0436\u0430\u043d\u043d\u044b\u0439", MSGATTUNIT:"\u0412\u043e\u0439\u0441\u043a\u0430 \u043f\u043e\u0434\u043a\u0435\u043f\u043b\u0435\u043d\u0438\u0435", MSGDEFUNIT:"\u0412\u043e\u0439\u0441\u043a\u0430 \u043e\u0431\u043e\u0440\u043e\u043d\u0430"}, espionage:{ATTACKER:"\u0428\u043f\u0438\u043e\u043d", DEFENDER:"\u0428\u043f\u0438\u043e\u043d\u044f\u0449\u0438\u0439",
  MSGHIDAT:"\u0448\u043f\u0438\u043e\u043d", MSGHIDDE:"\u0448\u043f\u0438\u043e\u043d\u044f\u0449\u0438\u0439", MSGATTUNIT:"", MSGDEFUNIT:""}}, MSGDETAIL:"\u043f\u043e\u0434\u0440\u043e\u0431\u043d\u0435\u0435 \u043e \u043a\u043e\u043c\u0430\u043d\u0434\u0435", MSGRETURN:"(\u041e\u0431\u0440\u0430\u0442\u043d\u043e)", MSGGENBBCODE:"\u041f\u0440\u0435\u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u044c \u0411\u0411-\u043a\u043e\u0434", MSGDEFSITE:"\u041f\u043e\u0432\u0435\u0440\u0436\u0435\u043d\u043e...",
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
  CHKINACTIVE:"\u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c \u043d\u0435\u0430\u043a\u0442\u0438\u0432\u043d\u044b\u0445 \u0438\u0433\u0440\u043e\u043a\u043e\u0432", INACTIVE:"\u041d\u0435\u0430\u043a\u0442\u0438\u0432\u0435\u043d"}, ABH:{WND:{WINDOWTITLE:"\u041f\u043e\u043c\u043e\u0448\u043d\u0438\u043a \u041d\u0430\u0439\u043c\u0430 \u0410\u0440\u043c\u0438\u0438", UNITFRAME:"\u0412\u044b\u0431\u0440\u0430\u0442\u044c \u0432\u0438\u0434 \u0432\u043e\u0439\u0441\u043a", DESCRIPTION1:"\u0412 \u044d\u0442\u043e\u043c \u0433\u043e\u0440\u043e\u0434\u0435, \u0443 \u0432\u0430\u0441 \u0435\u0441\u0442\u044c [population] \u0441\u0432\u043e\u0431\u043e\u0434\u043d\u043e\u0433\u043e \u043d\u0430\u0441\u0435\u043b\u0435\u043d\u0438\u044f.",
  DESCRIPTION2:"\u0414\u043e\u0441\u0442\u0430\u0442\u043e\u0447\u043d\u043e, \u0447\u0442\u043e\u0431\u044b \u043f\u043e\u0441\u0442\u0440\u043e\u0438\u0442\u044c [max_units]", DESCRIPTION3:"\u0423 \u0432\u0430\u0441 [yesno] \u0438\u0441\u0441\u043b\u0435\u0434\u043e\u0432\u0430\u043d\u043e [research].", DESCRIPTION4:"\u0412\u044b \u043c\u043e\u0436\u0435\u0442\u0435 \u043f\u043e\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u0432 \u043e\u0447\u0435\u0440\u0435\u0434\u044c [max_queue] \u0435\u0434\u0438\u043d\u0438\u0446(\u0443)",
  TARGET:"\u0412\u044b\u0431\u0440\u0430\u0442\u044c \u043c\u0430\u043a\u0441\u0438\u043c\u0430\u043b\u044c\u043d\u0443\u044e \u0446\u0435\u043b\u044c \u043d\u0430\u0439\u043c\u0430 (\u043a\u043e\u043b\u0438\u0447\u0435\u0441\u0442\u0432\u043e \u043d\u0435\u0431\u0445\u043e\u0434\u0438\u043c\u044b\u0445 \u0431\u043e\u0435\u0432\u044b\u0445 \u0435\u0434\u0438\u043d\u0438\u0446)", PACKAGE:"\u041e\u0442\u043f\u0440\u0430\u0432\u043a\u0430 \u0440\u0435\u0441\u0443\u0440\u0441\u043e\u0432 \u0434\u043b\u044f \u0441\u043e\u0437\u0434\u0430\u043d\u0438\u044f(\u0435\u0434.)",
  BTNSAVE:"\u0441\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u043d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438", TOOLTIPOK:"\u043d\u0430\u0436\u043c\u0438\u0442\u0435, \u0447\u0442\u043e\u0431\u044b \u0432\u044b\u0431\u0440\u0430\u0442\u044c \u0432\u0438\u0434 \u0432\u043e\u0439\u0441\u043a \u043f\u043e \u0443\u043c\u043e\u043b\u0447\u0430\u043d\u0438\u044e, \u0434\u043b\u044f \u043a\u043e\u0442\u043e\u0440\u043e\u0433\u043e \u0431\u0443\u0434\u0443\u0442 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d\u044b \u0440\u0435\u0441\u0443\u0440\u0441\u044b",
  TOOLTIPNOTOK:"\u041d\u0435 \u0438\u0441\u043b\u0435\u0434\u043e\u0432\u0430\u043d", HASRESEARCH:"\u0414\u0430", NORESEARCH:"\u041d\u0435 \u043d\u0430\u0434\u043e", SETTINGSAVED:"\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438 \u0434\u043b\u044f [city] \u0441\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u044b"}, RESWND:{RESLEFT:"\u0440\u0435\u0441\u0443\u0440\u0441\u043e\u0432 \u043e\u0441\u0442\u0430\u043b\u043e\u0441\u044c \u043e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c", IMGTOOLTIP:"\u043d\u0430\u0436\u043c\u0438\u0442\u0435, \u0447\u0442\u043e\u0431\u044b \u0437\u0430\u043f\u043e\u043b\u043d\u0438\u0442\u044c \u0440\u0435\u0441\u0443\u0440\u0441\u0430\u043c\u0438"}},
  NEWVERSION:{AVAILABLE:"\u0414\u043e\u0441\u0442\u0443\u043f\u043d\u0430 \u043d\u043e\u0432\u0430\u044f \u0432\u0435\u0440\u0441\u0438\u044f", INSTALL:"\u0423\u0441\u0442\u0430\u043d\u043e\u0432\u0438\u0442\u044c", REMINDER:"\u041d\u0430\u043f\u043e\u043c\u043d\u0438\u0442\u044c \u043f\u043e\u0437\u0436\u0435", REQRELOAD:"\u0422\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044f \u043e\u0431\u043d\u043e\u0432\u043b\u0435\u043d\u0438\u0435", RELOAD:"\u041e\u0431\u043d\u043e\u0432\u043b\u0435\u043d\u0438\u0435"},
  LANGS:{LANG:"\u041f\u0435\u0440\u0435\u0432\u043e\u0434 \u0434\u043b\u044f \u044f\u0437\u044b\u043a\u0430:", SEND:"\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c \u0434\u043b\u044f \u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u0438", SAVE:"\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u0438 \u043f\u0440\u043e\u0432\u0435\u0440\u0438\u0442\u044c", RESET:"\u0412\u0435\u0440\u043d\u0443\u0442\u044c \u044f\u0437\u044b\u043a \u043f\u043e \u0443\u043c\u043e\u043b\u0447\u0430\u043d\u0438\u044e",
  REMOVE:"\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0441\u0432\u043e\u0439 \u043f\u0435\u0440\u0435\u0432\u043e\u0434?"}, HELPTAB5:"\u041f\u0435\u0440\u0435\u0432\u043e\u0434", BTNSIMUL:"\u0421\u0438\u043c\u0443\u043b\u044f\u0442\u043e\u0440", EMOTS:{LABEL:"\u0412\u044b \u0445\u043e\u0442\u0438\u0442\u0435 \u0431\u043e\u043b\u044c\u0448\u0435 \u0441\u043c\u0430\u0439\u043b\u043e\u0432?", MESS:"\u0412\u0441\u0442\u0430\u0432\u044c\u0442\u0435 \u0441\u0441\u044b\u043b\u043a\u0438 \u043d\u0430 \u0441\u043c\u0430\u0439\u043b\u044b, \u043a\u0430\u0436\u0434\u0443\u044e \u0432 \u043d\u043e\u0432\u043e\u0439 \u0441\u0442\u0440\u043e\u043a\u0435"},
  COMMAND:{ALL:"\u0412\u0441\u0435", INCOMING:"\u043d\u0430 \u0432\u0430\u0441", OUTGOING:"\u043e\u0442 \u0432\u0430\u0441", RETURNING:"\u0432\u043e\u0437\u0432\u0440\u0430\u0449\u0430\u044e\u0449\u0438\u0435\u0441\u044f", FORTOWN:"\u0433\u043e\u0440\u043e\u0434:"}, CHKWONDERTRADE:"\u041a\u043e\u0433\u0434\u0430 \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u044f\u044e\u0442\u0441\u044f \u0440\u0435\u0441\u0443\u0440\u0441\u044b \u043d\u0430 \u0427\u0443\u0434\u0435\u0441\u0430 \u0421\u0432\u0435\u0442\u0430, \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u044f\u0442\u044c \u043c\u0430\u043a\u0441\u0438\u043c\u0430\u043b\u044c\u043d\u043e\u0435 \u043a\u043e\u043b\u0438\u0447\u0435\u0441\u0442\u0432\u043e \u0438\u0437 \u0432\u043e\u0437\u043c\u043e\u0436\u043d\u043e\u0433\u043e",
  MOBILEVERSION:"\u041c\u043e\u0431\u0438\u043b\u044c\u043d\u0430\u044f \u0432\u0435\u0440\u0441\u0438\u044f", AO:{TITLE:"\u041e\u0431\u0437\u043e\u0440 \u0410\u043a\u0430\u0434\u0435\u043c\u0438\u0438"}, CHKOLDTRADE:"\u0418\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u044c \u0441\u0442\u0430\u0440\u044b\u0435 \u043d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438", TSL:{WND:{TOOLTIP:"\u043f\u043e\u043a\u0430\u0437\u0430\u0442\u044c \u043e\u0442\u0441\u043e\u0440\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u044b\u0435 \u0433\u043e\u0440\u043e\u0434",
  WINDOWTITLE:"\u041e\u0442\u0441\u043e\u0440\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u044b\u0439 \u0441\u043f\u0438\u0441\u043e\u043a \u0433\u043e\u0440\u043e\u0434\u0430"}}, QUESTION:"\u0412\u043e\u043f\u0440\u043e\u0441", WALL:{WANTDELETECURRENT:"\u0412\u044b \u0445\u043e\u0442\u0438\u0442\u0435 \u0443\u0434\u0430\u043b\u0438\u0442\u044c \u0442\u0435\u043a\u0443\u0449\u0443\u044e \u0437\u0430\u043f\u0438\u0441\u044c \u0441\u043e \u0441\u0442\u0435\u043d\u044b?", DELETECURRENT:"\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0442\u0435\u043a\u0443\u0449\u0443\u044e \u0437\u0430\u043f\u0438\u0441\u044c",
  LISTSTATE:"\u0421\u043e\u0441\u0442\u043e\u044f\u043d\u0438\u0435 \u0441\u0442\u0435\u043d\u044b \u043d\u0430 \u0434\u0435\u043d\u044c", LISTSAVED:"\u0421\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u043d\u044b\u0439 \u043d\u0430 \u0441\u0442\u0435\u043d\u0435 \u0434\u0435\u043d\u044c"}, RADAR:{ALL:"\u041b\u044e\u0431\u043e\u0439 \u0433\u043e\u0440\u043e\u0434", BTNSAVEDEFAULT:"\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u0437\u043d\u0430\u0447\u0435\u043d\u0438\u044f \u043f\u043e \u0443\u043c\u043e\u043b\u0447\u0430\u043d\u0438\u044e",
  TOWNPOINTS:"\u041c\u0438\u043d\u0438\u043c\u0430\u043b\u044c\u043d\u044b\u0435 \u0442\u043e\u0447\u043a\u0438 \u0433\u043e\u0440\u043e\u0434", TOWNRESERVED:"\u0420\u0435\u0437\u0435\u0440\u0432\u0430\u0446\u0438\u044f", TOWNOWNER:"\u0412\u043b\u0430\u0434\u0435\u043b\u0435\u0446", CSTIME:"\u0412\u0440\u0435\u043c\u044f \u041a\u041a", TOWNNAME:"\u0413\u043e\u0440\u043e\u0434", BTNFIND:"\u041f\u043e\u0438\u0441\u043a", MAXCSTIME:"\u041c\u0430\u043a\u0441\u0438\u043c\u0430\u043b\u044c\u043d\u043e\u0435 \u0432\u0440\u0435\u043c\u044f \u041a\u041a",
  FIND:"\u041f\u043e\u0438\u0441\u043a", TOWNFINDER:"\u041f\u043e\u0438\u0441\u043a \u0433\u043e\u0440\u043e\u0434\u043e\u0432", UNITTIME:"\u0412\u0440\u0435\u043c\u044f"}, POPSOUNDEG:"\u043f\u0440\u0438\u043c\u0435\u0440: https://www.youtube.com/watch?v=v2AC41dglnM, https://youtu.be/v2AC41dglnM, http://www.freesfx.co.uk/rx2/mp3s/10/11532_1406234695.mp3", BBIMG:"\u0415\u0434\u0438\u043d\u0441\u0442\u0432\u0435\u043d\u043d\u044b\u0439 \u043e\u0431\u0440\u0430\u0437 (\u043a\u0430\u0440\u0442\u0438\u043d\u043a\u0430)",
  MSGSHOWCOST:"\u0417\u0430\u0442\u0440\u0430\u0442\u044b \u043d\u0430 \u043f\u043e\u0442\u0435\u0440\u044f\u043d\u043d\u044b\u0445 \u044e\u043d\u0438\u0442\u043e\u0432", BTNVIEWBB:"\u0411\u0411-\u043a\u043e\u0434\u044b", LASTUPDATE:"1488494068604"};
  this.sk = {AUTHOR:" , DragonKnight, jaro868, tekri, Aeris, ado329", BTNCONV:"Previes\u0165", BTNGENER:"Vytvori\u0165", BTNVIEW:"Uk\u00e1\u017eka", BTNSAVE:"Ulo\u017ei\u0165", MSGTITLE:"Previes\u0165 spr\u00e1vu", MSGQUEST:"Ktor\u00e9 z d\u00e1t chcete publikova\u0165?", MSGBBCODE:"Po zverejnen\u00ed spr\u00e1vy, m\u00f4\u017eete sp\u00e1rova\u0165 s novinkami a f\u00f3rom pomocou BBCode.", MSGRESOURCE:"Koris\u0165", MSGUNITS:"Jednotky", MSGBUILD:"Stavby", MSGUSC:"Pou\u017eit\u00fdch strieborn\u00fdch minc\u00ed",
  MSGRAW:"Suroviny", SUPPORT:"Podpora", SPY:"\u0160pehovanie", CONQUER:"Zv\u00ed\u0165azil", LOSSES:"Straty", HIDDEN:"Skryt\u00e9", NOTUNIT:"[i]\u017eiadny[/i]", TOWN:"[i]Mesto:[/i] ", PLAYER:"[i]Hr\u00e1\u010d:[/i] ", ALLY:"[i]Spojenectvo:[/i] ", CAST:"obsadenie:", ONTOWER:"V meste:", MSGHIDAD:"Skryt\u00e9 mest\u00e1", MSGFORUM:"T\u00e1to spr\u00e1va bude zverejnen\u00e1", BBALLY:"spojeneck\u00e9 f\u00f3rum / v spr\u00e1ve", BBFORUM:"extern\u00e9 f\u00f3rum", ICOCLOSE:"Zavrie\u0165", ICOHELP:"O prevodn\u00edku",
  MSGPREVIEW:"<b>Zobrazi\u0165 spr\u00e1vu</b>", HELPTAB1:"O ", HELPTAB2:"Ako to funguje", HELPTAB3:"Zmeny", HELPTAB4:"Nastavenia", MSGHUMAN:{OK:"Inform\u00e1cie boli ulo\u017een\u00e9", ERROR:"Vyskytla sa chyba pri p\u00edsan\u00fd", YOUTUBEERROR:"Nespr\u00e1vny link, alebo nieje povolen\u00e9 na prehr\u00e1vanie mimo youtube"}, LABELS:{attack:{ATTACKER:"Uto\u010dn\u00edk", DEFENDER:"Obranca", MSGHIDAT:"Uto\u010dn\u00edk", MSGHIDDE:"Obranca", MSGATTUNIT:"Uto\u010diaca arm\u00e1da", MSGDEFUNIT:"Obranuj\u00faca arm\u00e1da"},
  support:{ATTACKER:"Supporting", DEFENDER:"Supported", MSGHIDAT:"supporting", MSGHIDDE:"supported", MSGATTUNIT:"Army supporting", MSGDEFUNIT:"Army defenders"}, espionage:{ATTACKER:"\u0160pi\u00f3n", DEFENDER:"\u0160pehovan\u00fd", MSGHIDAT:"\u0160pi\u00f3n", MSGHIDDE:"\u0161pehovan\u00fd", MSGATTUNIT:"", MSGDEFUNIT:""}}, MSGDETAIL:"detaily pr\u00edkazu", MSGRETURN:"(sp\u00e4\u0165)", MSGGENBBCODE:"Vytvori\u0165 zoznam v BBCode", MSGDEFSITE:"Porazen\u00ed...", MSGLOSSITE:"Straty...", MSGASATT:"...ako \u00fato\u010dn\u00edk",
  MSGASDEF:"...ako obranca", MSGDIFF1:"nezobrazi\u0165 rozdiely", MSGDIFF2:"zobrazi\u0165 rozdiely", MSGDIFF3:"zobrazi\u0165 iba rozdiely", BBCODELIMIT:"Vzh\u013eadom k obmedzen\u00e9mu mno\u017estvu textu v jednej spr\u00e1ve, v pr\u00edpade dlh\u00e9ho zoznamu, boli d\u00e1ta rozdelen\u00e1 do skup\u00edn. Ka\u017ed\u00fa skupinu vlo\u017ei\u0165 ako samostatn\u00fd vstup.", CHKPOWERNAME:"Zobrazenie zost\u00e1vaj\u00faceho \u010dasu na mo\u017enos\u0165 pou\u017eitia k\u00fazla", CHKFORUMTABS:"Vymeni\u0165 rolovanie zar\u00e1\u017eky na f\u00f3re multi line",
  STATSLINK:"\u0160tatistiky z displeja", BTNSUPPLAYERS:"Zoznam hr\u00e1\u010dov", CHKUNITSCOST:"Spr\u00e1va zobrazuje n\u00e1klady straten\u00fdch jednotiek", CHKOCEANNUMBER:"Zobrazi\u0165 \u010d\u00edslo mora", MSGRTLBL:"Inform\u00e1cie o vzbure", MSGRTSHOW:"Prida\u0165 priebe\u017en\u00e9 inform\u00e1cie o odboji", MSGRTONLINE:"Chyst\u00e1\u0161 sa by\u0165 on-line v priebehu \u010dervenej vzbury?", MSGRTYES:"\u00c1no", MSGRTNO:"Nie", MSGRTGOD:"Boh", MSGRTCSTIME:"\u010cas OL", MSGRTONL:"on-line?",
  MSGRTERR:"Ste v zlom meste <br/> Ak chcete vytvori\u0165 inform\u00e1cie o vzbure cho\u010fte do mesta !:", BBTEXT:"verzia s textom", BBHTML:"verzia s tabu\u013ekou", MSG413ERR:"<H3> generovan\u00e1 spr\u00e1va je pr\u00edli\u0161 ve\u013ek\u00e1. </h3><p> Pou\u017eite dostupn\u00e9 mo\u017enosti a zredukujte publikovan\u00e9 bez probl\u00e9mov. </p>", CHKREPORTFORMAT:"Vytvori\u0165 report pomocou tabuliek", WALLNOTSAVED:"Hradby nie s\u00fa ulo\u017een\u00e9", WALLSAVED:"Hradby s\u00fa ulo\u017een\u00e9",
  POPSELRECRUNIT:"click, to select default production unit", POPRECRUNITTRADE:"click, to fill in resources needed to recruit selected unit", POPINSERTLASTREPORT:"Prilepi\u0165 posledne konvertovan\u00e9 hl\u00e1senie", MSGCOPYREPORT:"The report has been saved. Please click [paste_icon] on forums or new message window to paste it", POPDISABLEALARM:"Vypn\u00fa\u0165 alarm", SOUNDSETTINGS:"Nastavenia zvuku", CHKSOUNDMUTE:"Vypn\u00fa\u0165 zvuk", SOUNDVOLUME:"Hlasitos\u0165", SOUNDURL:"URL zvuku", CHKSOUNDLOOP:"slu\u010dka",
  POPSOUNDLOOP:"Prehra\u0165 v slu\u010dke", POPSOUNDMUTE:"Stlmi\u0165 zvuk", POPSOUNDPLAY:"Hra\u0165 s aktu\u00e1lnym nastaven\u00edm", POPSOUNDSTOP:"Presta\u0165 hra\u0165", POPSOUNDURL:"Url path to the file with sound", STATS:{PLAYER:"\u0160tatistiky hr\u00e1\u010da", ALLY:"\u0160tatistiky spojenectva", TOWN:"\u0160tatistiky mesta", INACTIVE:"Neakt\u00edvny", CHKINACTIVE:"Uk\u00e1za\u0165 neakt\u00edvnych hr\u00e1\u010dov", INACTIVEDESC:"\u010cas, kedy nebol zaznamenan\u00fd \u017eiaden bojov\u00fd bod a bod za stavbu"},
  ABH:{WND:{WINDOWTITLE:"Pomocn\u00edk na stavanie arm\u00e1dy", UNITFRAME:"vyber si svoje jednotky", DESCRIPTION1:"Vo\u013en\u00e1 popul\u00e1cia v tomto meste je [population] ", DESCRIPTION2:"\u010co je dos\u0165 na  [max_units]", DESCRIPTION3:"[yesno] vysk\u00faman\u00e9 [research]", DESCRIPTION4:"M\u00f4\u017ee\u0161 vytr\u00e9nova\u0165 maxim\u00e1lne [max_queue] jednotiek", TARGET:"vyber si po\u010det", PACKAGE:"resource package per shipment (units)", BTNSAVE:"ulo\u017ei\u0165 nastavenia",
  TOOLTIPOK:"click, to select default unit for which you'll be sending resources", TOOLTIPNOTOK:"jednotka e\u0161te nebola vysk\u00faman\u00e1", HASRESEARCH:"M\u00e1\u0161", NORESEARCH:"Nem\u00e1\u0161", SETTINGSAVED:"Nastavenie pre [city] bolo ulo\u017een\u00e9"}, RESWND:{RESLEFT:"resources left to send", IMGTOOLTIP:"kliknite, pre zaplnenie surov\u00edn"}}, NEWVERSION:{AVAILABLE:"Nov\u00e1 verzia dostupn\u00e1", INSTALL:"In\u0161talova\u0165", REMINDER:"Pripomen\u00fa\u0165 nesk\u00f4r", REQRELOAD:"Obnovenie je nevyhnutn\u00e9",
  RELOAD:"Obnovi\u0165"}, LANGS:{LANG:"Prelo\u017ei\u0165 do jazyka:", SEND:"Send to publication", SAVE:"Ulo\u017ei\u0165 a vysk\u00fa\u0161a\u0165", RESET:"Nastavi\u0165 p\u00f4vodn\u00fd jazyk", REMOVE:"Vymaza\u0165 tv\u00f4j preklad?"}, HELPTAB5:"Preklad", BTNSIMUL:"Simul\u00e1tor", EMOTS:{LABEL:"Chce\u0161 viac smajl\u00edkov?", MESS:"Prilep linky smajl\u00edkov, ka\u017ed\u00fd do novej karty"}, COMMAND:{ALL:"V\u0161etky", INCOMING:"Prich\u00e1dzaj\u00face", OUTGOING:"Odch\u00e1dzaj\u00face",
  RETURNING:"Vracaj\u00face sa", FORTOWN:"mesto:"}, BTNVIEWBB:"BBk\u00f3d", MSGSHOWCOST:"N\u00e1klady na straten\u00e9 jednotky", POPSOUNDEG:"pr\u00edklad: https://www.youtube.com/watch?v=v2AC41dglnM, https://youtu.be/v2AC41dglnM, http://www.freesfx.co.uk/rx2/mp3s/10/11532_1406234695.mp3", RADAR:{TOWNFINDER:"N\u00e1js\u0165 mest\u00e1", FIND:"H\u013eada\u0165", MAXCSTIME:"Maxim\u00e1lny \u010das koloniza\u010dnej lode", CSTIME:"\u010cas OL", TOWNNAME:"Mesto", BTNFIND:"H\u013eada\u0165", TOWNRESERVED:"Rezerv\u00e1cia",
  TOWNOWNER:"Vlastn\u00edk", TOWNPOINTS:"Minim\u00e1lny po\u010det bodov mesta", BTNSAVEDEFAULT:"Ulo\u017ei\u0165 hodnoty ako \u0161tandardn\u00e9", ALL:"Ak\u00e9ko\u013evek mesto"}, WALL:{LISTSAVED:"Hradby boli ulo\u017een\u00e9 d\u0148a", LISTSTATE:"Stav hradieb na de\u0148", DELETECURRENT:"Odstr\u00e1ni\u0165 s\u00fa\u010dasn\u00fd z\u00e1znam", WANTDELETECURRENT:"Ste si ist\u00fd, \u017ee chcete odstr\u00e1ni\u0165 s\u00fa\u010dasn\u00fd z\u00e1znam ?"}, QUESTION:"Ot\u00e1zka", MOBILEVERSION:"Mobiln\u00e1 verzia",
  AO:{TITLE:"Preh\u013ead akad\u00e9mie"}, LASTUPDATE:"1487502170884"};
  this.sv = {AUTHOR:" , Mr. Ferdinand, llavids, Madame GazCar, Rena Rama GazCar", BTNCONV:"Omvandla", BTNGENER:"Generera", BTNVIEW:"F\u00f6rhandsvisa", BTNSAVE:"Spara", MSGTITLE:"Omvandla rapport", MSGQUEST:"Vilken information vill du publicera?", MSGBBCODE:"Efter att ha publicerat din rapport s\u00e5 kan du dela den i forum mm med hj\u00e4lp utav BBkoden.", MSGRESOURCE:"Byte", MSGUNITS:"Enheter", MSGBUILD:"Byggnader", MSGUSC:"Silvermynt f\u00f6rbrukade", MSGRAW:"Resurser", SUPPORT:"St\u00f6djer",
  SPY:"Spionerar", CONQUER:"Er\u00f6vrade", LOSSES:"F\u00f6rluster", HIDDEN:"Dolda", NOTUNIT:"[i]Inga[/i]", TOWN:"[i]Stad:[/i] ", PLAYER:"[i]Spelare:[/i] ", ALLY:"[i]Allians:[/i] ", CAST:"kasta:", ONTOWER:"P\u00e5 staden:", MSGHIDAD:"D\u00f6lj st\u00e4der", MSGFORUM:"Rapporten kommer att delas", BBALLY:"alliansforum / meddelande", BBFORUM:"externa forum", ICOCLOSE:"St\u00e4ng", ICOHELP:"Om omvandlaren", MSGPREVIEW:"<b>F\u00f6rhandsvisa Rapport</b>", HELPTAB1:"Om", HELPTAB2:"Hur fungerar det", HELPTAB3:"\u00c4ndringar",
  HELPTAB4:"Inst\u00e4llningar", MSGHUMAN:{OK:"Informationen har sparats", ERROR:"Ett problem uppstod vid skrivandet", YOUTUBEERROR:"Inkorrekt l\u00e4nk eller ej till\u00e5ten att spela utanf\u00f6r youtube"}, LABELS:{attack:{ATTACKER:"Anfallare", DEFENDER:"F\u00f6rsvarare", MSGHIDAT:"anfallare", MSGHIDDE:"f\u00f6rsvarare", MSGATTUNIT:"Anfallande arm\u00e9", MSGDEFUNIT:"F\u00f6rsvarande arm\u00e9"}, support:{ATTACKER:"St\u00f6der", DEFENDER:"St\u00f6dde", MSGHIDAT:"F\u00f6rst\u00e4rkande stad", MSGHIDDE:"F\u00f6rst\u00e4rkt stad",
  MSGATTUNIT:"F\u00f6rst\u00e4rkande enheter", MSGDEFUNIT:"F\u00f6rsvarande enheter"}, espionage:{ATTACKER:"Spion", DEFENDER:"Spionerade", MSGHIDAT:"spion", MSGHIDDE:"spionerade", MSGATTUNIT:"", MSGDEFUNIT:""}}, MSGDETAIL:"kommando\u00f6versikt", MSGRETURN:"(\u00e5terv\u00e4nd)", MSGGENBBCODE:"Genererar en lista med BBkod", MSGDEFSITE:"Besegrade...", MSGLOSSITE:"F\u00f6rluster...", MSGASATT:"...som anfallare", MSGASDEF:"...som f\u00f6rsvarare", MSGDIFF1:"visa inte skillnader", MSGDIFF2:"visa skillnader",
  MSGDIFF3:"visa bara skillnaderna", BBCODELIMIT:"Med h\u00e4nsyn till m\u00e4ngden text som f\u00e5r finnas i ett inl\u00e4gg s\u00e5 delas informationen upp i grupper vid l\u00e4ngre listor. Varje grupp klistras in som ett enskilt inl\u00e4gg. ", CHKPOWERNAME:"Visa tiden som \u00e5terst\u00e5r innan du kan anv\u00e4nda kraften", CHKFORUMTABS:"Ers\u00e4tt skrollningslisten i forumet f\u00f6r flera rader", STATSLINK:"Statistik fr\u00e5n", BTNSUPPLAYERS:"Lista p\u00e5 spelare", CHKUNITSCOST:"Rapporten visar kostnaderna f\u00f6r f\u00f6rlorade enheter",
  CHKOCEANNUMBER:"Visa havets nummer", MSGRTLBL:"Information om revolt", MSGRTSHOW:"L\u00e4gg till information om p\u00e5g\u00e5ende revolt", MSGRTONLINE:"Kommer du vara inloggad under p\u00e5g\u00e5ende revolt?", MSGRTYES:"Ja", MSGRTNO:"Nej", MSGRTGOD:"Gud", MSGRTCSTIME:"KS tid", MSGRTONL:"inloggad?", MSGRTERR:"Du \u00e4r i fel stad!<br/>F\u00f6r att hitta information om revolten, g\u00e5 till stad: ", BBTEXT:"textversion", BBHTML:"tabbelversion", MSG413ERR:"<h3>Den genererade rapporten \u00e4r f\u00f6r stor.</h3><p>Filtrera bort vissa alternativ f\u00f6r att kunna publicera utan problem</p>",
  CHKREPORTFORMAT:"Generera rapport med hj\u00e4lp av tabeller", WALLNOTSAVED:"Muren \u00e4r inte sparad", WALLSAVED:"Muren \u00e4r sparad", POPSELRECRUNIT:"klicka, f\u00f6r att v\u00e4lja standardenhet f\u00f6r produktion", POPRECRUNITTRADE:"klicka, f\u00f6r att fylla i resurser som kr\u00e4vs f\u00f6r att rekrytera vald enhet", POPINSERTLASTREPORT:"Klistra in senast omvandlad rapport", MSGCOPYREPORT:"Rapporten har sparats. Klicka p\u00e5 [paste_icon] i forum eller ett nytt meddelande f\u00f6r att klistra in",
  POPDISABLEALARM:"St\u00e4ng av alarm", SOUNDSETTINGS:"Ljudinst\u00e4llningar", CHKSOUNDMUTE:"St\u00e4ng av ljudet", SOUNDVOLUME:"Volym", SOUNDURL:"Ljudfil url", CHKSOUNDLOOP:"repetera", POPSOUNDLOOP:"Spela upp ljudet i en slinga", POPSOUNDMUTE:"St\u00e4ng av ljudet", POPSOUNDPLAY:"Spela med aktuella inst\u00e4llningar", POPSOUNDSTOP:"Sluta spela", POPSOUNDURL:"URL l\u00e4nk till ljudfilen", STATS:{PLAYER:"Spelarstatistik", ALLY:"Alliansstatistik", TOWN:"Stadsstatistik", CHKINACTIVE:"Visa inaktiva spelare",
  INACTIVE:"Inaktiv", INACTIVEDESC:"Inga po\u00e4ng f\u00f6r strider eller tillv\u00e4xt under den tiden"}, ABH:{WND:{WINDOWTITLE:"Truppbyggarverktyg", UNITFRAME:"v\u00e4lj din enhet", DESCRIPTION1:"I den h\u00e4r staden har du [population] fria inv\u00e5nare", DESCRIPTION2:"Vilket r\u00e4cker f\u00f6r att bygga [max_units]", DESCRIPTION3:"Du [yesno] har en [research] framforskad.", DESCRIPTION4:"Du kan k\u00f6a upp till [max_queue] enheter", TARGET:"v\u00e4lj vad du vill bygga", PACKAGE:"resurser per f\u00f6rs\u00e4ndelse (units)",
  BTNSAVE:"spara inst\u00e4llningar", TOOLTIPOK:"klicka, f\u00f6r att v\u00e4lja fixerad m\u00e4ngd resurser att skicka", TOOLTIPNOTOK:"enheten har inte forskats fram", HASRESEARCH:"DU B\u00d6R", NORESEARCH:"DU B\u00d6R EJ", SETTINGSAVED:"Inst\u00e4llningarna f\u00f6r [city] har sparats"}, RESWND:{RESLEFT:"resurser kvar att skicka", IMGTOOLTIP:"klicka f\u00f6r att fylla i resurser"}}, NEWVERSION:{AVAILABLE:"Ny version tillg\u00e4nglig", INSTALL:"Installera", REMINDER:"P\u00e5minn mig senare", REQRELOAD:"Du beh\u00f6ver ladda om sidan",
  RELOAD:"Ladda om sidan"}, LANGS:{LANG:"\u00d6vers\u00e4ttning till spr\u00e5k:", SEND:"Skicka f\u00f6r publicering", SAVE:"Spara & testa", RESET:"\u00c5terst\u00e4ll ursprungligt spr\u00e5k", REMOVE:"Radera din \u00f6vers\u00e4ttning?"}, HELPTAB5:"\u00d6vers\u00e4ttning", BTNSIMUL:"Simulator", EMOTS:{LABEL:"Vill du ha fler emotikoner?", MESS:"Klistra in l\u00e4nk till emotikon, separera med ny rad"}, COMMAND:{ALL:"Alla", INCOMING:"inkommande", OUTGOING:"utg\u00e5ende", RETURNING:"\u00e5terv\u00e4ndande",
  FORTOWN:"stad:"}, BTNVIEWBB:"BBkod", MSGSHOWCOST:"Kostnad f\u00f6r f\u00f6rlorade enheter", BBIMG:"enskild bild", POPSOUNDEG:"Exempel: https://www.youtube.com/watch?v=v2AC41dglnM, https://youtu.be/v2AC41dglnM, http://www.freesfx.co.uk/rx2/mp3s/10/11532_1406234695.mp3", RADAR:{TOWNFINDER:"S\u00f6k st\u00e4der", FIND:"S\u00f6k", MAXCSTIME:"Maximal restid f\u00f6r koloniskepp", BTNFIND:"S\u00f6k", TOWNNAME:"Stad", CSTIME:"Ks tid", TOWNOWNER:"\u00c4gare", TOWNRESERVED:"Reservering", TOWNPOINTS:"Minsta stadspo\u00e4ng",
  BTNSAVEDEFAULT:"Spara v\u00e4rden som default", ALL:"Vilken stad som helst"}, WALL:{LISTSAVED:"Muren sparad p\u00e5 datum"}, QUESTION:"Fr\u00e5ga", TSL:{WND:{WINDOWTITLE:"Lista sorterad p\u00e5 stadsnamn"}}, CHKOLDTRADE:"Anv\u00e4nds gamla bytesutseende", AO:{TITLE:"Akademi \u00f6versikt"}, MOBILEVERSION:"Mobil version", LASTUPDATE:"1487501824228"};
  this.tr = {AUTHOR:"Lazmanya 61, zabidin, irfanirfan", BTNCONV:"D\u00f6n\u00fc\u015ft\u00fcr", BTNGENER:"Olu\u015ftur", BTNVIEW:"\u00d6nizle", BTNSAVE:"Kaydet", MSGTITLE:"Raporu d\u00f6n\u00fc\u015ft\u00fcr", MSGQUEST:"Hangi i\u00e7erikler g\u00f6sterilebilir?", MSGBBCODE:"Bu raporu yay\u0131nland\u0131ktan sonra BB kodunu kullanarak mesajlara ya da foruma dahil edebilirsin.", MSGRESOURCE:"Ganimet", MSGUNITS:"Birimler", MSGBUILD:"Binalar", MSGUSC:"Kullan\u0131lan g\u00fcm\u00fc\u015f paralar", MSGRAW:"Hammaddeler",
  SUPPORT:"Yard\u0131m", SPY:"Casusluk", CONQUER:"Fethetmek", LOSSES:"Kay\u0131plar", HIDDEN:"Gizlendi", NOTUNIT:"[i]Hi\u00e7biri[/i]", TOWN:"[i]\u015eehir:[/i] ", PLAYER:"[i]Oyuncu:[/i] ", ALLY:"[i]M\u00fcttefik:[/i] ", CAST:"Yap\u0131m:", ONTOWER:"\u015eehirde:", MSGHIDAD:"\u015fehirleri gizle", MSGFORUM:"Raporu yay\u0131nla", BBALLY:"ittifak forumda ve mesajlarda", BBFORUM:"di\u011fer forumlarda", ICOCLOSE:"Kapat", ICOHELP:"D\u00f6n\u00fc\u015ft\u00fcr\u00fcc\u00fc hakk\u0131nda", MSGPREVIEW:"<b>Raporu \u00f6nizleme</b>",
  HELPTAB1:"Hakk\u0131nda", HELPTAB2:"Nas\u0131l \u00c7al\u0131\u015f\u0131r", HELPTAB3:"De\u011fi\u015fiklikler", HELPTAB4:"Ayarlar", MSGHUMAN:{OK:"Kaydedildi", ERROR:"Yazarken bir hata olu\u015ftu", YOUTUBEERROR:"Ge\u00e7ersiz ba\u011flant\u0131 adresi veya youtube d\u0131\u015f\u0131nda oynat\u0131lamaz"}, LABELS:{attack:{ATTACKER:"Sald\u0131r\u0131", DEFENDER:"Destek", MSGHIDAT:"sald\u0131rgan", MSGHIDDE:"savunmac\u0131", MSGATTUNIT:"Sald\u0131rgan\u0131n birlikleri", MSGDEFUNIT:"Savunmac\u0131n\u0131n birlikleri"},
  support:{ATTACKER:"Destekleyen", DEFENDER:"Desteklenen", MSGHIDAT:"destekleyen", MSGHIDDE:"desteklenen", MSGATTUNIT:"destekleyen birim", MSGDEFUNIT:"Savunma birimleri"}, espionage:{ATTACKER:"Casus", DEFENDER:"Casusluk", MSGHIDAT:"casuslayan", MSGHIDDE:"casuslanan", MSGATTUNIT:"", MSGDEFUNIT:""}}, MSGDETAIL:"komut ayr\u0131nt\u0131lar\u0131", MSGRETURN:"(geri d\u00f6n)", MSGGENBBCODE:"BBKodu listesi olu\u015ftur", MSGDEFSITE:"\u00d6ld\u00fcrd\u00fc\u011f\u00fcn....", MSGLOSSITE:"Kay\u0131plar\u0131n...",
  MSGASATT:"...sald\u0131rgan olarak", MSGASDEF:"...savunmac\u0131 olarak", MSGDIFF1:"farkl\u0131l\u0131klar\u0131 g\u00f6sterme", MSGDIFF2:"farkl\u0131l\u0131klar\u0131 g\u00f6ster", MSGDIFF3:"sadece farkl\u0131l\u0131klar\u0131 g\u00f6ster", BBCODELIMIT:"Metin uzun bir liste ise, veri gruba ayr\u0131l\u0131r. Her grubu ayr\u0131 bir girdi olarak kopyalay\u0131p yap\u0131\u015ft\u0131r\u0131n.", CHKPOWERNAME:"B\u00fcy\u00fcler i\u00e7in gerekli tevecc\u00fchlerin y\u00fcklenme s\u00fcrelerini g\u00f6ster",
  CHKFORUMTABS:"Forum sekme pencerelerini s\u0131rala", STATSLINK:"\u0130statistikler i\u00e7in", BTNSUPPLAYERS:"Oyuncu listesi", CHKUNITSCOST:"Kaybedilen birimlerin maliyet raporu", CHKOCEANNUMBER:"Deniz numaralar\u0131n\u0131 g\u00f6ster", MSGRTLBL:"Ayaklanma Bilgisi", MSGRTSHOW:"Devem eden Ayaklanma Bilgisi ekle", MSGRTONLINE:"Ayaklanma ba\u015flad\u0131\u011f\u0131nda \u00e7evrimi\u00e7i olacak m\u0131s\u0131n?", MSGRTYES:"Evet", MSGRTNO:"Hay\u0131r", MSGRTGOD:"Tanr\u0131", MSGRTCSTIME:"Koloni zaman\u0131",
  MSGRTONL:"\u00e7evrimi\u00e7i?", MSGRTERR:"Yanl\u0131\u015f \u015eehirdesin!<br/>Bilgiyi olu\u015fturmak i\u00e7in \u015fu \u015fehire git: ", BBTEXT:"yaz\u0131 \u015fekinde", BBHTML:"tablo \u015feklinde", MSG413ERR:"<h3>Olu\u015fturulan rapor \u00e7ok b\u00fcy\u00fck.</h3><p>Se\u00e7enekler k\u0131sm\u0131ndan ayarlar\u0131 de\u011fi\u015ftirirseniz sorunu \u00e7\u00f6zebilirsiniz.</p>", CHKREPORTFORMAT:"Tablo kullanarak raporlar\u0131 olu\u015ftur", WALLNOTSAVED:"\u015eehir surlar\u0131 kaydedilmedi",
  WALLSAVED:"\u015eehir surlar\u0131 kaydedildi", POPSELRECRUNIT:"Varsay\u0131lan \u00fcretim birimi se\u00e7mek i\u00e7in t\u0131klay\u0131n", POPRECRUNITTRADE:"se\u00e7ili birimi olu\u015fturmak i\u00e7in hammadde doldurmak i\u00e7in t\u0131kla", POPINSERTLASTREPORT:"D\u00f6n\u00fc\u015ft\u00fcr\u00fclen son raporu yay\u0131nla", MSGCOPYREPORT:"Rapor kaydedildi. Bu raporu yay\u0131nlamak i\u00e7in forum yada yeni mesaj penceresinde bu [paste_icon] logoya t\u0131klay\u0131n.", POPDISABLEALARM:"Alarm\u0131 kapat",
  SOUNDSETTINGS:"Ses ayar\u0131", CHKSOUNDMUTE:"Sessiz", SOUNDVOLUME:"Ses", SOUNDURL:"Ses dosyas\u0131 adresi", CHKSOUNDLOOP:"Tekrar", POPSOUNDLOOP:"Tekrar oynat", POPSOUNDMUTE:"Sesi k\u0131s", POPSOUNDPLAY:"Oynat", POPSOUNDSTOP:"Durdur", POPSOUNDURL:"y\u00fcklenen ses dosyas\u0131n\u0131n adresi", STATS:{PLAYER:"Oyuncu istatisti\u011fi", ALLY:"\u0130ttifak istatisti\u011fi", TOWN:"\u015eehir istatisti\u011fi", INACTIVEDESC:"bu s\u00fcre i\u00e7inde sava\u015f puan\u0131 yapmad\u0131 ve \u015fehir b\u00fcy\u00fctmedi",
  CHKINACTIVE:"Pasif Oyuncular", INACTIVE:"Pasif"}, ABH:{WND:{WINDOWTITLE:"Birim Toplama Yard\u0131mc\u0131s\u0131", UNITFRAME:"biriminizi se\u00e7in", DESCRIPTION1:"Bu \u015fehide [population] \u00f6zg\u00fcr n\u00fcfus var", DESCRIPTION2:"in\u015faat yapmak i\u00e7in yeterli olan [max_units]", DESCRIPTION3:"Bu [yesno] ara\u015ft\u0131rmay\u0131 tamamlad\u0131n [research].", DESCRIPTION4:"En fazla [max_queue] kadar birim s\u0131raya koyabilirsin", TARGET:"in\u015faat yapmak istedi\u011fin hedefi se\u00e7",
  PACKAGE:"Ta\u015f\u0131ma ba\u015f\u0131na hammadde miktar\u0131(units)", BTNSAVE:"ayarlar\u0131 kaydet", TOOLTIPOK:"Hammadde g\u00f6ndercece\u011fin varsay\u0131lan birimi se\u00e7mek i\u00e7in t\u0131kla", TOOLTIPNOTOK:"teknoloji akademide ara\u015ft\u0131r\u0131lmam\u0131\u015f", HASRESEARCH:"YAP", NORESEARCH:"YAPMA", SETTINGSAVED:"[city] i\u00e7in ayarlar kaydedildi"}, RESWND:{RESLEFT:"yollayabilece\u011fin kalan hammadde", IMGTOOLTIP:"hammaddeyi doldurmak i\u00e7in t\u0131kla"}}, NEWVERSION:{AVAILABLE:"Yeni versiyon mevcut",
  INSTALL:"Y\u00fckle", REMINDER:"Daha sonra hat\u0131rlat", REQRELOAD:"Sitenin yenilenmesi gerekiyor.", RELOAD:"Yenile"}, LANGS:{LANG:"\u00c7evirilen dil:", SEND:"\u00c7eviriyi G\u00f6nder", SAVE:"Kaydet & Test Et", RESET:"Varsay\u0131lan dile s\u0131f\u0131rla", REMOVE:"\u00c7evirini silmek istedi\u011fine emin misin?"}, HELPTAB5:"\u00c7eviri", BTNSIMUL:"Sim\u00fclat\u00f6r", EMOTS:{LABEL:"Daha fazla ifade ister misin?", MESS:"Her yeni bir ifade i\u00e7in yeni bir sat\u0131ra ba\u011flant\u0131 yap\u0131\u015ft\u0131r\u0131n..."},
  COMMAND:{ALL:"Hepsi", INCOMING:"Gelen", OUTGOING:"Giden", RETURNING:"D\u00f6nen", FORTOWN:"\u015fehir:"}, MOBILEVERSION:"Mobil Versiyonu", AO:{TITLE:"Akademi Ara\u015ft\u0131rmalar\u0131"}, TSL:{WND:{TOOLTIP:"\u015eehirleri S\u0131rala", WINDOWTITLE:"\u015eehir Listesi"}}, CHKOLDTRADE:"Eski ticaret sistemini kullan", QUESTION:"Soru", WALL:{WANTDELETECURRENT:"Surlar\u0131n g\u00fcnl\u00fck kayd\u0131n\u0131 silmek istiyor musunuz?", DELETECURRENT:"Kayd\u0131 sil", LISTSTATE:"Kaydedilen Surlar\u0131n tarihi",
  LISTSAVED:"Surlar\u0131 g\u00fcnl\u00fck kaydet"}, RADAR:{ALL:"Herhangi bir \u015eehir", BTNSAVEDEFAULT:"Varsay\u0131lan olarak kaydet", TOWNPOINTS:"\u015eehir Puan\u0131", TOWNRESERVED:"Rezervasyon", TOWNOWNER:"Sahip", CSTIME:"Koloni Zaman\u0131", TOWNNAME:"\u015eehir", BTNFIND:"Ara", MAXCSTIME:"Koloni mesafe s\u00fcresi", FIND:"Ara", TOWNFINDER:"\u015eehir Arama"}, POPSOUNDEG:"\u00d6rnek: https://www.youtube.com/watch?v=v2AC41dglnM, https://youtu.be/v2AC41dglnM, http://www.freesfx.co.uk/rx2/mp3s/10/11532_1406234695.mp3",
  MSGSHOWCOST:"Kaybedilen birimlerin maliyeti", BTNVIEWBB:"BBKodu", LASTUPDATE:"1487501618596"};
}
function _RepConvAdds() {
  function b() {
    if (void 0 == require("game/windows/ids")) {
      setTimeout(function() {
        b();
      }, 100);
    } else {
      var a = require("game/windows/ids");
      $.each(RepConv.wndArray, function(b, e) {
        a[e.toUpperCase()] = e;
      });
      window.define("game/windows/ids", function() {
        return a;
      });
      $.each(RepConv.initArray, function(a, b) {
        try {
          setTimeout(b, 10);
        } catch (x) {
          grcrtErrReporter(x);
        }
      });
    }
  }
  function k() {
    if (0 == $(".btn_gods_spells>.icon.js-caption").length || 0 == $("#grcrt_mnu>div.btn_settings").length) {
      setTimeout(function() {
        k();
      }, 100);
    } else {
      $(".btn_gods_spells").on("click", function() {
        !$(".btn_gods_spells").hasClass("active") && $("#grcrt_mnu>div.btn_settings").hasClass("active") && $("#grcrt_mnu>div.btn_settings").click();
      });
    }
  }
  function a() {
    $("head").append($("<style/>").append(".grcrt {background: url(" + RepConv.grcrt_cdn + "ui/layout_3.3.0.png) -4px -80px no-repeat;}").append("#grcrt_mnu_list ul { height: auto !important;}").append("#grcrt_mnu_list li { width: 125px !important;}"));
    $.each(RepConv.menu, function(a, b) {
      $("#grcrt_mnu_list ul").append($("<li/>").append($("<span/>", {"class":"content_wrapper"}).append($("<span/>", {"class":"button_wrapper"}).append($("<span/>", {"class":"button"}).append($("<span/>", {"class":"icon grcrt" + (b.class ? " " + b.class : "")})).append($("<span/>", {"class":"indicator", style:"display: none;"}))).append($("<span/>", {"class":"name_wrapper", style:"width: 90px; height: 34px;"}).append($("<span/>", {"class":"name"}).html(RepConvTool.GetLabel(b.name)))))).click(function() {
        eval(b.action);
      }).attr("id", b.id));
    });
  }
  this.init = function() {
    if ("undefined" == typeof RepConv.settingsReaded || "undefined" == typeof Layout) {
      RepConv.Debug && console.log("czekam...."), setTimeout(function() {
        RepConvAdds.init();
      }, 100);
    } else {
      RepConv.Debug && console.log("init....");
      var e = (require("map/helpers") || MapTiles).map2Pixel(100, 100);
      $("head").append($("<style/>").append(".RepConvON {border: 1px solid #fff; position: absolute; display: block; z-index: 2; opacity: .1;width: " + e.x + "px; height: " + e.x + "px;}#RepConvSpanPrev .outer_border {border: 2px solid black; font-size: 95%;}").append("#ui_box.grcrt_ui_box .nui_units_box{ top:244px;}#ui_box.grcrt_ui_box .nui_right_box #grcrt_pl{  top:156px;  height: 30px; line-height: 24px; font-weight: 700; color: rgb(255, 204, 102); font-size: 11px; text-align: center;}#ui_box.grcrt_ui_box.city-overview-enabled .nui_units_box{ top:223px !important;}#ui_box.grcrt_ui_box.city-overview-enabled .nui_right_box #grcrt_pl{ top:135px;}").append("div.island_info_wrapper div.center1 {top: 0px;width: 435px;float: left;left: 270px;}div.island_info_towns {margin-top: 25px;}div.island_info_wrapper .island_info_left .game_list {height: 340px !important;}div.island_info_wrapper .island_info_right .game_list {height: 370px;}#farm_town_overview_btn {top: 75px !important}"));
      RepConv.audioSupport = "function" == typeof Audio;
      $("body").append($("<div/>", {id:"RepConvTMP"}).hide());
      try {
        RepConv.Debug && console.log(RepConv.settings), RepConvTool.checkSettings(), RepConv.active.fcmdimg = !1, RepConv.active.power = RepConvTool.getSettings(RepConv.CookiePower), RepConv.active.ftabs = RepConvTool.getSettings(RepConv.CookieForumTabs), RepConv.active.statsGRCL = RepConvTool.getSettings(RepConv.CookieStatsGRCL), RepConv.active.unitsCost = RepConvTool.getSettings(RepConv.CookieUnitsCost), RepConv.active.oceanNumber = RepConvTool.getSettings(RepConv.CookieOceanNumber), RepConv.active.reportFormat =
        RepConvTool.getSettings(RepConv.CookieReportFormat), RepConvTool.useSettings();
      } catch (u) {
        RepConv.Debug && console.log(u);
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
      }))), a(), $("#grcrt_mnu_list>.bottom").css({background:$(".gods_spells_menu>.bottom").css("background"), height:$(".gods_spells_menu>.bottom").css("height"), position:$(".gods_spells_menu>.bottom").css("position"), bottom:"-27px"}), k()), $("#ui_box").append($("<img/>", {src:RepConv.grcrt_cdn + "img/octopus.png", id:"grcgrc", style:"position:absolute;bottom:10px;left:10px;z-index:1000"})));
      if (RepConv.audioSupport) {
        RepConv.active.sounds = RepConvTool.getSettings(RepConv.CookieSounds);
        RepConv.audio = {};
        e = $("<audio/>", {preload:"auto"});
        var f = $("<audio/>", {preload:"auto"}).append($("<source/>", {src:RepConv.Const.defMuteM + ".mp3"})).append($("<source/>", {src:RepConv.Const.defMuteM + ".ogg"}));
        "" != RepConv.active.sounds.url ? $(e).append($("<source/>", {src:RepConv.active.sounds.url})) : $(e).append($("<source/>", {src:RepConv.Const.defAlarmM + ".mp3"})).append($("<source/>", {src:RepConv.Const.defAlarmM + ".ogg"}));
        RepConv.audio.alarm = e.get(0);
        RepConv.audio.mute = f.get(0);
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
      b();
      try {
        $("#dio_available_units_style_addition").text($("#dio_available_units_style_addition").text().replace(" .nui_main_menu", "#ui_box>.nui_main_menu"));
      } catch (u) {
      }
    }
  };
  this.emots = {};
  this.emotsDef = [{img:RepConv.grcrt_cdn + "emots/usmiech.gif", title:":)"}, {img:RepConv.grcrt_cdn + "emots/ostr.gif", title:":>"}, {img:RepConv.grcrt_cdn + "emots/kwadr.gif", title:":]"}, {img:RepConv.grcrt_cdn + "emots/smutny2.gif", title:":("}, {img:RepConv.grcrt_cdn + "emots/yyyy.gif", title:":|"}, {img:RepConv.grcrt_cdn + "emots/uoeee.gif", title:"<uoee>"}, {img:RepConv.grcrt_cdn + "emots/lol.gif", title:"<lol>"}, {img:RepConv.grcrt_cdn + "emots/rotfl.gif", title:"<rotfl>"}, {img:RepConv.grcrt_cdn +
  "emots/oczko.gif", title:";)"}, {img:RepConv.grcrt_cdn + "emots/jezyk.gif", title:":P"}, {img:RepConv.grcrt_cdn + "emots/jezyk_oko.gif", title:";P"}, {img:RepConv.grcrt_cdn + "emots/stres.gif", title:"<stres>"}, {img:RepConv.grcrt_cdn + "emots/nerwus.gif", title:"<nerwus>"}, {img:RepConv.grcrt_cdn + "emots/zly.gif", title:":["}, {img:RepConv.grcrt_cdn + "emots/w8.gif", title:"<w8>"}, {img:RepConv.grcrt_cdn + "emots/wesoly.gif", title:":))"}, {img:RepConv.grcrt_cdn + "emots/bezradny.gif", title:"<bezradny>"},
  {img:RepConv.grcrt_cdn + "emots/krzyk.gif", title:"<krzyk>"}, {img:RepConv.grcrt_cdn + "emots/szok.gif", title:""}, {img:RepConv.grcrt_cdn + "emots/hura.gif", title:""}, {img:RepConv.grcrt_cdn + "emots/boisie.gif", title:""}, {img:RepConv.grcrt_cdn + "emots/prosi.gif", title:""}, {img:RepConv.grcrt_cdn + "emots/nie.gif", title:""}, {img:RepConv.grcrt_cdn + "emots/hejka.gif", title:""}, {img:RepConv.grcrt_cdn + "emots/okok.gif", title:""}, {img:RepConv.grcrt_cdn + "emots/cwaniak.gif", title:""},
  {img:RepConv.grcrt_cdn + "emots/haha.gif", title:""}, {img:RepConv.grcrt_cdn + "emots/mysli.gif", title:""}, {img:RepConv.grcrt_cdn + "emots/pocieszacz.gif", title:""}, {img:RepConv.grcrt_cdn + "emots/foch.gif", title:""}, {img:RepConv.grcrt_cdn + "emots/zmeczony.gif", title:""}, {img:RepConv.grcrt_cdn + "emots/beczy.gif", title:""}, {img:RepConv.grcrt_cdn + "emots/wysmiewacz.gif", title:""}, {img:RepConv.grcrt_cdn + "emots/zalamka.gif", title:""}, {img:RepConv.grcrt_cdn + "emots/buziak.gif", title:""},
  {img:RepConv.grcrt_cdn + "emots/buzki.gif", title:""}, {img:RepConv.grcrt_cdn + "emots/dobani.gif", title:""}, {img:RepConv.grcrt_cdn + "emots/dokuczacz.gif", title:""}, {img:RepConv.grcrt_cdn + "emots/figielek.gif", title:""}, {img:RepConv.grcrt_cdn + "emots/klotnia.gif", title:""}, {img:RepConv.grcrt_cdn + "emots/paluszkiem.gif", title:""}, {img:RepConv.grcrt_cdn + "emots/wnerw.gif", title:""}, {img:RepConv.grcrt_cdn + "emots/zacieszacz.gif", title:""}];
  this.emotsLists = {grcrt:{img:"emots/usmiech.gif", detail:[{img:"emots/usmiech.gif"}, {img:"emots/ostr.gif"}, {img:"emots/kwadr.gif"}, {img:"emots/smutny2.gif"}, {img:"emots/yyyy.gif"}, {img:"emots/uoeee.gif"}, {img:"emots/lol.gif"}, {img:"emots/rotfl.gif"}, {img:"emots/oczko.gif"}, {img:"emots/jezyk.gif"}, {img:"emots/jezyk_oko.gif"}, {img:"emots/stres.gif"}, {img:"emots/nerwus.gif"}, {img:"emots/zly.gif"}, {img:"emots/w8.gif"}, {img:"emots/wesoly.gif"}, {img:"emots/bezradny.gif"}, {img:"emots/krzyk.gif"},
  {img:"emots/szok.gif"}, {img:"emots/hura.gif"}, {img:"emots/boisie.gif"}, {img:"emots/prosi.gif"}, {img:"emots/nie.gif"}, {img:"emots/hejka.gif"}, {img:"emots/okok.gif"}, {img:"emots/cwaniak.gif"}, {img:"emots/haha.gif"}, {img:"emots/mysli.gif"}, {img:"emots/pocieszacz.gif"}, {img:"emots/foch.gif"}, {img:"emots/zmeczony.gif"}, {img:"emots/beczy.gif"}, {img:"emots/wysmiewacz.gif"}, {img:"emots/zalamka.gif"}, {img:"emots/buziak.gif"}, {img:"emots/buzki.gif"}, {img:"emots/dobani.gif"}, {img:"emots/dokuczacz.gif"},
  {img:"emots/figielek.gif"}, {img:"emots/klotnia.gif"}, {img:"emots/paluszkiem.gif"}, {img:"emots/wnerw.gif"}, {img:"emots/zacieszacz.gif"}]}, girls:{img:"emots2/girl_yawn.gif", detail:[{img:"emots2/girl_angel.gif"}, {img:"emots2/girl_angry.gif"}, {img:"emots2/girl_baby.gif"}, {img:"emots2/girl_beat.gif"}, {img:"emots2/girl_beee.gif"}, {img:"emots2/girl_blush2.gif"}, {img:"emots2/girl_cavemanlarge.gif"}, {img:"emots2/girl_comp.gif"}, {img:"emots2/girl_cray2.gif"}, {img:"emots2/girl_crazy.gif"},
  {img:"emots2/girl_cry5.gif"}, {img:"emots2/girl_cute.gif"}, {img:"emots2/girl_drink1.gif"}, {img:"emots2/girl_drool.gif"}, {img:"emots2/girl_elbowyes.gif"}, {img:"emots2/girl_feminist.gif"}, {img:"emots2/girl_haha.gif"}, {img:"emots2/girl_hankycray.gif"}, {img:"emots2/girl_hospital.gif"}, {img:"emots2/girl_hysteric.gif"}, {img:"emots2/girl_impossible.gif"}, {img:"emots2/girl_in_love.gif"}, {img:"emots2/girl_kiss2.gif"}, {img:"emots2/girl_kiss3.gif"}, {img:"emots2/girl_kiss5.gif"}, {img:"emots2/girl_lol.gif"},
  {img:"emots2/girl_manicur.gif"}, {img:"emots2/girl_party2.gif"}, {img:"emots2/girl_peek-a-boo.gif"}, {img:"emots2/girl_pinkglassesf.gif"}, {img:"emots2/girl_shock3.gif"}, {img:"emots2/girl_sigh.gif"}, {img:"emots2/girl_spruce_up.gif"}, {img:"emots2/girl_tender.gif"}, {img:"emots2/girl_whistling.gif"}, {img:"emots2/girl_wink.gif"}, {img:"emots2/girl_witch.gif"}, {img:"emots2/girl_yawn.gif"}]}, anpu:{img:"emots2/amem.gif", detail:[{img:"emots2/acute.gif"}, {img:"emots2/aggressive.gif"}, {img:"emots2/air_kiss.gif"},
  {img:"emots2/amem.gif"}, {img:"emots2/angel.gif"}, {img:"emots2/angel.png"}, {img:"emots2/angry.png"}, {img:"emots2/bad.gif"}, {img:"emots2/bb.gif"}, {img:"emots2/beach.gif"}, {img:"emots2/beee.gif"}, {img:"emots2/beer.png"}, {img:"emots2/big_boss.gif"}, {img:"emots2/biggrin.gif"}, {img:"emots2/biggrin.png"}, {img:"emots2/blink.png"}, {img:"emots2/blum3.gif"}, {img:"emots2/blush.gif"}, {img:"emots2/blush.png"}, {img:"emots2/bomb.png"}, {img:"emots2/boredom.gif"}, {img:"emots2/bye2.gif"}, {img:"emots2/bye.gif"},
  {img:"emots2/Clap.gif"}, {img:"emots2/clapping.gif"}, {img:"emots2/cool.gif"}, {img:"emots2/cool.png"}, {img:"emots2/coool.gif"}, {img:"emots2/cray2.gif"}, {img:"emots2/cray.gif"}, {img:"emots2/crazy.gif"}, {img:"emots2/cry.png"}, {img:"emots2/cursing.gif"}, {img:"emots2/dance1.gif"}, {img:"emots2/dance2.gif"}, {img:"emots2/dance3.gif"}, {img:"emots2/dash.gif"}, {img:"emots2/devil.png"}, {img:"emots2/diablo.gif"}, {img:"emots2/dirol.gif"}, {img:"emots2/dj.gif"}, {img:"emots2/dontknow.gif"}, {img:"emots2/drinks.gif"},
  {img:"emots2/drool.png"}, {img:"emots2/elvis.gif"}, {img:"emots2/emoticon-0115-inlove.gif"}, {img:"emots2/facepalm.gif"}, {img:"emots2/friends.gif"}, {img:"emots2/gamer4.gif"}, {img:"emots2/getlost.png"}, {img:"emots2/giggle.gif"}, {img:"emots2/give_heart2.gif"}, {img:"emots2/give_rose.gif"}, {img:"emots2/good.gif"}, {img:"emots2/Grandpa_Angry.gif"}, {img:"emots2/greeting.gif"}, {img:"emots2/grin.png"}, {img:"emots2/hang2.gif"}, {img:"emots2/happy.png"}, {img:"emots2/help.gif"}, {img:"emots2/hot.gif"},
  {img:"emots2/hrhr.gif"}, {img:"emots2/hunter.gif"}, {img:"emots2/ilovethis.gif"}, {img:"emots2/inlove.png"}, {img:"emots2/ireful1.gif"}, {img:"emots2/king.gif"}, {img:"emots2/kissed.png"}, {img:"emots2/kissing.png"}, {img:"emots2/kiss.png"}, {img:"emots2/kolobok_superman.gif"}, {img:"emots2/laugh.gif"}, {img:"emots2/laughing.png"}, {img:"emots2/lazy.gif"}, {img:"emots2/lol27.gif"}, {img:"emots2/lol.gif"}, {img:"emots2/mail1.gif"}, {img:"emots2/mamba.gif"}, {img:"emots2/man_in_love.gif"}, {img:"emots2/moil.gif"},
  {img:"emots2/mosking.gif"}, {img:"emots2/music2.gif"}, {img:"emots2/music.png"}, {img:"emots2/nea.gif"}, {img:"emots2/new_russian.gif"}, {img:"emots2/offtopic.gif"}, {img:"emots2/oldman.gif"}, {img:"emots2/on_the_quiet.gif"}, {img:"emots2/paint2.gif"}, {img:"emots2/pardon.gif"}, {img:"emots2/pirate.gif"}, {img:"emots2/pleasantry.gif"}, {img:"emots2/poo.png"}, {img:"emots2/popcorm1.gif"}, {img:"emots2/pouty.png"}, {img:"emots2/prankster2.gif"}, {img:"emots2/preved.gif"}, {img:"emots2/punish.gif"},
  {img:"emots2/rofl.gif"}, {img:"emots2/rolleyes.gif"}, {img:"emots2/rolleyes.png"}, {img:"emots2/rose.png"}, {img:"emots2/sad.png"}, {img:"emots2/sarcastic.gif"}, {img:"emots2/sarcastic_hand.gif"}, {img:"emots2/scare.gif"}, {img:"emots2/scratch_one-s_head.gif"}, {img:"emots2/secret.gif"}, {img:"emots2/sensored.gif"}, {img:"emots2/shake2.gif"}, {img:"emots2/shocked.png"}, {img:"emots2/shock.png"}, {img:"emots2/shok.gif"}, {img:"emots2/shout.gif"}, {img:"emots2/sick.png"}, {img:"emots2/sideways.png"},
  {img:"emots2/sleeping.gif"}, {img:"emots2/sleep.png"}, {img:"emots2/smile.png"}, {img:"emots2/smoke.gif"}, {img:"emots2/snog.gif"}, {img:"emots2/sorry2.gif"}, {img:"emots2/sorry.gif"}, {img:"emots2/spiteful.gif"}, {img:"emots2/stfu.png"}, {img:"emots2/stop.gif"}, {img:"emots2/stop.png"}, {img:"emots2/teeth.png"}, {img:"emots2/this.gif"}, {img:"emots2/thumbdown.png"}, {img:"emots2/thumbsup.png"}, {img:"emots2/tongue.gif"}, {img:"emots2/tongue.png"}, {img:"emots2/training1.gif"}, {img:"emots2/unsure.gif"},
  {img:"emots2/vava.gif"}, {img:"emots2/victory.gif"}, {img:"emots2/wacko.png"}, {img:"emots2/wait.gif"}, {img:"emots2/whip.gif"}, {img:"emots2/whistling.gif"}, {img:"emots2/wink.gif"}, {img:"emots2/wink.png"}, {img:"emots2/wizard.gif"}, {img:"emots2/wrong.png"}, {img:"emots2/yahoo.gif"}, {img:"emots2/yawn.png"}, {img:"emots2/yes.gif"}, {img:"emots2/zloy.gif"}]}};
}
function _RepConvForm() {
  this.button = function(b) {
    return $("<div/>").append($("<a/>", {"class":"button", href:"#", style:"display:inline-block; vertical-align: middle;"}).append($("<span/>", {"class":"left"}).append($("<span/>", {"class":"right"}).append($("<span/>", {"class":"middle"}).text(b))))).html();
  };
  this.checkbox = function(b) {
    var k = $("<div/>", {"class":"checkbox_new" + (b.checked ? " checked" : ""), style:"padding: 5px;" + (b.style || "")}).append($("<input/>", {type:"checkbox", name:b.name, id:b.name, checked:b.checked, style:"display: none;"})).append($("<div/>", {"class":"cbx_icon", rel:b.name})).append($("<div/>", {"class":"cbx_caption"}).text(RepConvTool.GetLabel(b.name))).bind("click", function() {
      $(this).toggleClass("checked");
      $(this).find($('input[type="checkbox"]')).attr("checked", $(this).hasClass("checked"));
    });
    void 0 != b.cb && $(k).append($("<br/>", {style:"clear:both"}));
    void 0 != b.sample && $(k).append($("<div/>", {style:"display:" + ("" != b.sample.org || "" != b.sample.grc ? "block" : "none")}).append(b.sample.org).append(b.sample.grc).append($("<br/>")).append($("<br/>", {style:"clear:both"})));
    return $(k);
  };
  this.input = function(b) {
    return $("<div/>", {"class":"textbox", style:b.style}).append($("<div/>", {"class":"left"})).append($("<div/>", {"class":"right"})).append($("<div/>", {"class":"middle"}).append($("<div/>", {"class":"ie7fix"}).append($("<input/>", {type:"text", tabindex:"1", id:b.name, value:b.value}).attr("size", b.size || 10))));
  };
  this.inputMinMax = function(b) {
    return $("<div/>", {"class":"textbox"}).append($("<span/>", {"class":"grcrt_spinner_btn grcrt_spinner_down", rel:b.name}).click(function() {
      var b = $(this).parent().find("#" + $(this).attr("rel"));
      parseInt($(b).attr("min")) < parseInt($(b).attr("value")) && $(b).attr("value", parseInt($(b).attr("value")) - 1);
    })).append($("<div/>", {"class":"textbox", style:b.style}).append($("<div/>", {"class":"left"})).append($("<div/>", {"class":"right"})).append($("<div/>", {"class":"middle"}).append($("<div/>", {"class":"ie7fix"}).append($("<input/>", {type:"text", tabindex:"1", id:b.name, value:b.value, min:b.min, max:b.max}).attr("size", b.size || 10).css("text-align", "right"))))).append($("<span/>", {"class":"grcrt_spinner_btn grcrt_spinner_up", rel:b.name}).click(function() {
      var b = $(this).parent().find("#" + $(this).attr("rel"));
      parseInt($(b).attr("max")) > parseInt($(b).attr("value")) && $(b).attr("value", parseInt($(b).attr("value")) + 1);
    }));
  };
  this.unitMinMax = function(b) {
    return $("<div/>", {"class":"grcrt_abh_unit_wrapper"}).append($("<div/>", {"class":"grcrt_abh_selected_unit unit_icon40x40 unit selected"}).append($("<span/>", {"class":"value grcrt_spiner", min:b.min, max:b.max, id:b.name}).html(b.value)).addClass(b.unit).attr("rel", null != RepConvABH.savedArr[b.tTown] ? RepConvABH.savedArr[b.tTown].unit : "").attr("wndId", b.wndId).mousePopup(new MousePopup(RepConvTool.GetLabel("ABH.RESWND.IMGTOOLTIP")))).append($("<div/>").append($("<span/>", {"class":"grcrt_target_btn grcrt_target_down",
    rel:b.name}).click(function() {
      var b = $(this).parent().parent().find("#" + $(this).attr("rel") + ".value");
      parseInt($(b).attr("min")) < parseInt($(b).html()) && $(b).html(parseInt($(b).html()) - 1);
    })).append($("<span/>", {"class":"grcrt_target_btn grcrt_target_up", rel:b.name}).click(function() {
      var b = $(this).parent().parent().find("#" + $(this).attr("rel") + ".value");
      parseInt($(b).attr("max")) > parseInt($(b).html()) && $(b).html(parseInt($(b).html()) + 1);
    })));
  };
  this.soundSlider = function(b) {
    return $("<div/>", {id:"grcrt_" + b.name + "_config"}).append($("<div/>", {"class":"slider_container"}).append($("<div/>", {style:"float:left;width:120px;"}).html(RepConvTool.GetLabel("SOUNDVOLUME"))).append(RepConvForm.input({name:"grcrt_" + b.name + "_value", style:"float:left;width:33px;"}).hide()).append($("<div/>", {"class":"windowmgr_slider", style:"width: 200px;float: left;"}).append($("<div/>", {"class":"grepo_slider sound_volume"})))).append($("<script/>", {type:"text/javascript"}).text("RepConv.slider = $('#grcrt_" +
    b.name + "_config .sound_volume').grepoSlider({\nmin: 0,\nmax: 100,\nstep: 5,\nvalue: " + b.volume + ",\ntemplate: 'tpl_grcrt_slider'\n}).on('sl:change:value', function (e, _sl, value) {\n$('#grcrt_" + b.name + "_value').attr('value',value);\nif (RepConv.audio.test != undefined){\nRepConv.audio.test.volume = value/100;\n}\nRepConvGRC.getGrcrtYTPlayerTest().setVolume(value)\n}),\n$('#grcrt_" + b.name + "_config .button_down').css('background-position','-144px 0px;'),\n$('#grcrt_" + b.name + "_config .button_up').css('background-position','-126px 0px;')\n"));
  };
  $("head").append($("<style/>").append('.grcrt_spinner_btn {background-image: url("' + RepConv.Const.uiImg + 'pm.png");height:20px;width:20px;margin-top: 1px;vertical-align: top;display:inline-block;cursor:pointer;background-position:0px 0px;}').append(".grcrt_spinner_down {background-position:-20px 0px;}").append(".grcrt_spinner_down:hover {background-position: -20px -21px;}").append(".grcrt_spinner_up:hover {background-position: 0 -21px;}")).append($("<script/>", {id:"tpl_grcrt_slider", type:"text/template"}).text('<div class="button_down left js-button-left" style="background-position: -144px 0px;"></div>\n<div class="bar js-slider js-slider-handle-container">\n<div class="border_l"></div>\n<div class="border_r"></div>\n<div class="slider_handle js-slider-handle"></div>\n</div>\n<div class="button_up right js-button-right" style="background-position: -126px 0px;"></div>\n'));
}
function _RepConvTool() {
  function b() {
    var a, e = {}, f = {};
    if ("object" != typeof RepConv) {
      setTimeout(function() {
        b();
      }, 1E4);
    } else {
      try {
        $.ajax({method:"get", url:"/data/players.txt"}).done(function(b) {
          try {
            $.each(b.split(/\r\n|\n/), function(b, f) {
              a = f.split(/,/);
              e[a[0]] = {id:a[0], name:decodeURIComponent(a[1] + "").replace(/\+/g, " "), alliance_id:a[2]};
            }), RepConv.cachePlayers = e;
          } catch (x) {
            x.silent = !0, grcrtErrReporter(x);
          }
        });
      } catch (u) {
        u.silent = !0, grcrtErrReporter(u);
      }
      try {
        $.ajax({method:"get", url:"/data/alliances.txt"}).done(function(b) {
          try {
            $.each(b.split(/\r\n|\n/), function(b, e) {
              a = e.split(/,/);
              f[a[0]] = {id:a[0], name:decodeURIComponent(a[1] + "").replace(/\+/g, " ")};
            }), RepConv.cacheAlliances = f;
          } catch (x) {
            x.silent = !0, grcrtErrReporter(x);
          }
        });
      } catch (u) {
        u.silent = !0, grcrtErrReporter(u);
      }
      setTimeout(function() {
        b();
      }, 6E5);
    }
  }
  var k = 0;
  this.checkSettings = function() {
    var a = {}, b = !0;
    a[RepConv.CookieCmdImg] = !0;
    a[RepConv.CookieStatsGRCL] = "potusek";
    a[RepConv.CookieSounds] = {mute:!1, volume:100, url:"", loop:!0};
    RepConv.settings = RepConv.settings || {};
    $.each(RepConv.sChbxs, function(a, e) {
      void 0 == RepConv.settings[a] && (RepConv.settings[a] = JSON.parse(RepConvTool.getSettings(a, e.default)), b = !1, RepConv.Debug && console.log(RepConv.CookieReportFormat));
    });
    void 0 == RepConv.settings[RepConv.CookieStatsGRCL] && (RepConv.settings[RepConv.CookieStatsGRCL] = RepConvTool.getSettings(RepConv.CookieStatsGRCL, a[RepConv.CookieStatsGRCL]), b = !1, RepConv.Debug && console.log(RepConv.CookieStatsGRCL));
    void 0 == RepConv.settings[RepConv.CookieUnitsABH] && (RepConv.settings[RepConv.CookieUnitsABH] = RepConvTool.getSettings(RepConv.CookieUnitsABH, "{}"), b = !1, RepConv.Debug && console.log(RepConv.CookieUnitsABH));
    void 0 == RepConv.settings[RepConv.Cookie + "radar_cs"] && (RepConv.settings[RepConv.Cookie + "radar_cs"] = RepConvTool.getSettings(RepConv.Cookie + "radar_cs", "06:00:00"), b = !1, RepConv.Debug && console.log(RepConv.Cookie + "radar_cs"));
    void 0 == RepConv.settings[RepConv.Cookie + "radar_points"] && (RepConv.settings[RepConv.Cookie + "radar_points"] = JSON.parse(RepConvTool.getSettings(RepConv.Cookie + "radar_points", "0")), b = !1, RepConv.Debug && console.log(RepConv.Cookie + "radar_points"));
    void 0 == RepConv.settings[RepConv.CookieWall] && (RepConv.settings[RepConv.CookieWall] = JSON.parse(RepConvTool.getItem(RepConv.CookieWall)) || [], b = !1, RepConv.Debug && console.log(RepConv.CookieWall));
    void 0 == RepConv.settings[RepConv.Cookie] && 0 < RepConv.settings[RepConv.CookieWall].length && (RepConv.settings[RepConv.Cookie] = JSON.parse(RepConvTool.getItem(RepConv.Cookie)) || null, b = !1, RepConv.Debug && console.log(RepConv.Cookie));
    void 0 == RepConv.settings[RepConv.CookieEmots] && (RepConv.settings[RepConv.CookieEmots] = RepConvTool.getItem(RepConv.CookieEmots) || "https://cdn.grcrt.net/emots2/237.gif\nhttps://cdn.grcrt.net/emots2/shake2.gif", b = !1, RepConv.Debug && console.log(RepConv.CookieEmots));
    void 0 == RepConv.settings[RepConv.CookieSounds] && (RepConv.settings[RepConv.CookieSounds] = JSON.parse(RepConvTool.getSettings(RepConv.CookieSounds, JSON.stringify(a[RepConv.CookieSounds]))), b = !1, RepConv.Debug && console.log(RepConv.CookieSounds));
    b ? (RepConv.active.power = RepConv.settings[RepConv.CookiePower], RepConv.active.ftabs = RepConv.settings[RepConv.CookieForumTabs], RepConv.active.statsGRCL = RepConv.settings[RepConv.CookieStatsGRCL], RepConv.active.unitsCost = RepConv.settings[RepConv.CookieUnitsCost], RepConv.active.reportFormat = RepConv.settings[RepConv.CookieReportFormat], RepConv.audioSupport && (RepConv.active.sounds = RepConv.settings[RepConv.CookieSounds]), this.useSettings()) : (RepConv.Debug && console.log(k), RepConvTool.saveRemote(),
    10 > ++k ? setTimeout(function() {
      RepConvTool.readRemote();
    }, 1000) : (setTimeout(function() {
      k = 0;
    }, 6E4), setTimeout(function() {
      HumanMessage.error(RepConvTool.GetLabel("MSGHUMAN.ERROR"));
    }, 0)));
  };
  this.useSettings = function() {
    setTimeout(function() {
      RepConvAdds.emotsLists.usersaved = {img:"emots2/wizard.gif", detail:[]};
      void 0 != RepConvTool.getItem(RepConv.CookieEmots) && $.each(RepConvTool.getItem(RepConv.CookieEmots).split("\n"), function(a, b) {
        RepConvAdds.emotsLists.usersaved.detail.push({img:b});
      });
    }, 100);
    try {
      $("#grcrt_disable_quack").remove(), RepConv.settings[RepConv.Cookie + "_idle"] && $("head").append($("<style/>", {id:"grcrt_disable_quack"}).append("a.qt_activity {display: none !important;}"));
    } catch (e) {
    }
    $.Observer(GameEvents.grcrt.settings.load).publish();
    try {
      if (RepConv.settings[RepConv.Cookie + "_translate"] && "" != RepConv.settings[RepConv.Cookie + "_translate"]) {
        var a = Game.locale_lang.substring(0, 2);
        RepConvLangArray[a] = JSON.parse(RepConv.settings[RepConv.Cookie + "_translate"]);
        RepConv.Lang = RepConvLangArray[a];
        RepConv.LangEnv = a;
      }
    } catch (e) {
    }
    try {
      RepConv.settings[RepConv.Cookie + "_tacl"] ? ($("#toolbar_activity_commands_list").addClass("grcrt_tacl"), $("#grcrt_taclWrap").draggable().draggable("enable")) : ($("#toolbar_activity_commands_list").removeClass("grcrt_tacl"), $("#grcrt_taclWrap").draggable().draggable("disable").removeAttr("style"));
    } catch (e) {
    }
  };
  this.saveRemote = function() {
    RepConv.Debug && console.log("saveRemote");
    var a = $("<form/>", {action:RepConv.grcrt_domain + "savedata.php", method:"post", target:"GRCSender"}).append($("<textarea/>", {name:"dest"}).text(RepConv.hash)).append($("<textarea/>", {name:"param"}).text(btoa(JSON.stringify(RepConv.settings).replace(/[\u007f-\uffff]/g, function(a) {
      return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
    }))));
    $("#RepConvTMP").html(null);
    $("#RepConvTMP").append(a);
    a.submit();
    this.useSettings();
  };
  this.readRemote = function() {
    RepConv.Debug && console.log("readRemote");
    $.ajax({type:"POST", url:RepConv.grcrt_domain + "readdata.php", data:{dest:RepConv.hash}, dataType:"script", async:!1}).done(function() {
      RepConv.settingsReaded = !0;
      RepConvTool.checkSettings();
    });
  };
  this.setItem = function(a, b) {
    RepConv.Debug && console.log("setItem(" + a + ")");
    "object" == typeof RepConv.settings && (RepConv.settings[a] = b, RepConvTool.saveRemote());
  };
  this.getItem = function(a) {
    RepConv.Debug && console.log("getItem(" + a + ")");
    if ("object" == typeof RepConv.settings && "undefined" != typeof RepConv.settings[a]) {
      return RepConv.settings[a];
    }
    if ("function" == typeof GM_getValue) {
      return RepConv.Debug && console.log("... use GM"), "undefined" == GM_getValue(a) ? null : GM_getValue(a);
    }
    RepConv.Debug && console.log("... use LS");
    return "undefined" == localStorage.getItem(a) ? null : localStorage.getItem(a);
  };
  this.removeItem = function(a) {
    RepConv.Debug && console.log("removeItem(" + a + ")");
    "function" == typeof GM_deleteValue ? (RepConv.Debug && console.log("... use GM"), GM_deleteValue(a)) : (RepConv.Debug && console.log("... use LS"), localStorage.removeItem(a));
  };
  this.getSettings = function(a, b) {
    if (null != RepConvTool.getItem(a)) {
      return RepConvTool.getItem(a);
    }
    if (null != localStorage.getItem(a)) {
      return RepConvTool.setItem(a, localStorage.getItem(a)), RepConvTool.getItem(a);
    }
    RepConvTool.setItem(a, b);
    return RepConvTool.getItem(a);
  };
  this.GetLabel = function(a) {
    var b, f = a.split("."), u = RepConv.Lang;
    $.each(f, function(a, e) {
      a + 1 == f.length && void 0 != u[e] && (b = u[e]);
      u = u[e] || {};
    });
    return b || this.getLabelLangArray(a);
  };
  this.GetLabel4Lang = function(a, b) {
    var e, u = a.split("."), x = RepConvLangArray[b];
    $.each(u, function(a, b) {
      a + 1 == u.length && void 0 != x && void 0 != x[b] && (e = x[b]);
      x = void 0 != x && void 0 != x[b] ? x[b] : {};
    });
    return e || this.getLabelLangArray(a);
  };
  this.getLabelLangArray = function(a) {
    var b, f = a.split("."), u = RepConvLangArray.en;
    $.each(f, function(a, e) {
      a + 1 == f.length && void 0 != u[e] && (b = u[e]);
      u = u[e] || {};
    });
    return b || a;
  };
  this.getUnit = function(a, b, f) {
    for (var e = -1, x = 0; x < $(b).length; x++) {
      0 == x % f && (-1 < e && 0 < a[e].unit_list.length && (a[e].unit_img = RepConvTool.Adds(RepConv.Const.genImg.RCFormat(RepConvType.sign, a[e].unit_list), "img")), e++, a.Count = e);
      0 < a[e].unit_list.length && (a[e].unit_list += ".");
      var k = RepConvTool.getUnitName($(b)[x]);
      a[e].unit_list += RepConvTool.GetUnit(k);
      a[e].unit_img += RepConvTool.GetUnit(k);
      a[e].unit_send += RepConvTool.Unit($(b + " span.place_unit_black")[x].innerHTML, "000") + RepConvType.separator;
    }
    -1 < e && 0 < a[e].unit_list.length && (a[e].unit_img = RepConvTool.Adds(RepConv.Const.genImg.RCFormat(RepConvType.sign, a[e].unit_list), "img"));
    return a;
  };
  this.getUnitResource = function(a, b) {
    $.each($(b), function(b, e) {
      0 < a.unit_list.length && (a.unit_list += ".");
      0 < e.childElementCount && (b = RepConvTool.getUnitName(e.children[0]), b = RepConvTool.GetUnitCost(b), e = e.children[1].innerHTML.replace("-", ""), "?" != e && (a.w += b.w * parseInt(e), a.s += b.s * parseInt(e), a.i += b.i * parseInt(e), a.p += b.p * parseInt(e), a.f += b.f * parseInt(e)));
    });
    return a;
  };
  this.REPORTS = "report";
  this.WALL = "wall";
  this.AGORA = "agora";
  this.COMMANDLIST = "commandList";
  this.COMMAND = "command";
  this.CONQUER = "conquerold";
  this.groupsUnit = {defAtt:"div#building_wall li:nth-child(4) div.list_item_left div.wall_unit_container div.wall_report_unit", defDef:"div#building_wall li:nth-child(6) div.list_item_left div.wall_unit_container div.wall_report_unit", losAtt:"div#building_wall li:nth-child(4) div.list_item_right div.wall_unit_container div.wall_report_unit", losDef:"div#building_wall li:nth-child(6) div.list_item_right div.wall_unit_container div.wall_report_unit"};
  this.newVersion = function() {
    var a = "";
    null != RepConvTool.getItem(RepConv.CookieNew) && (a = RepConvTool.getItem(RepConv.CookieNew));
    a != RepConv.Scripts_version && GRCRT_Notifications.addNotification(NotificationType.GRCRTWHATSNEW);
  };
  this.Adds = function(a, b) {
    return void 0 != a && 0 < a.length ? "[" + b + "]" + a + "[/" + b + "]" : a;
  };
  this.AddSize = function(a, b) {
    return 0 < a.length && $("#BBCODEA").attr("checked") ? "[size=" + b + "]" + a + "[/size]" : a;
  };
  this.AddFont = function(a, b) {
    return 0 < a.length && "" != b ? "[font=" + b + "]" + a + "[/font]" : a;
  };
  this.White = function(a, b) {
    return RepConvType.blank.slice(1, b - a.length);
  };
  this.Color = function(a, b) {
    return "[color=#" + b + "]" + a + "[/color]";
  };
  this.Unit = function(a, b) {
    RepConv.Debug && console.log(a);
    return RepConvTool.White(a, RepConvType.unitDigits) + a;
  };
  this.Value = function(a, b) {
    return RepConvTool.White(String(a), b) + String(a);
  };
  this.getUnitName = function(a) {
    if (null != $(a).attr("style") && $(a).attr("style").replace(/.*\/([a-z_]*)_[0-9]*x[0-9]*\.png.*/, "$1") != $(a).attr("style")) {
      return $(a).attr("style").replace(/.*\/([a-z_]*)_[0-9]*x[0-9]*\.png.*/, "$1");
    }
    for (var b in GameData.units) {
      if ($(a).hasClass(b)) {
        return b.toString();
      }
    }
    for (b in GameData.heroes) {
      if ($(a).hasClass(b)) {
        return b.toString();
      }
    }
    for (b in GameData.buildings) {
      if ($(a).hasClass("building_" + b)) {
        return b.toString();
      }
    }
    for (b in RepConv.academyCode) {
      if ($(a).hasClass(b)) {
        return b.toString();
      }
    }
    return $(a).hasClass("unknown_naval") ? "unknown_naval" : "unknown";
  };
  this.getCommandIcon = function(a) {
    for (var b in RepConv.commandImage) {
      if ($(a).hasClass(RepConv.commandImage[b])) {
        return RepConvTool.Adds(RepConv.Const.uiImg + "c/" + RepConv.commandImage[b] + ".png", "img");
      }
    }
    return "";
  };
  this.getPowerIcon = function(a) {
    if (void 0 != $(a).attr("data-power-id")) {
      var b = "";
      void 0 != $(a).attr("data-power-configuration") && (b = 0 < $(a).attr("data-power-configuration").length ? "_l" + JSON.parse($(a).attr("data-power-configuration")).level : "");
      return RepConvTool.Adds(RepConv.Const.uiImg + "pm/" + $(a).attr("data-power-id") + b + ".png", "img");
    }
    for (b in RepConv.powerImage) {
      if ($(a).hasClass(RepConv.powerImage[b])) {
        return RepConvTool.Adds(RepConv.Const.uiImg + "pm/" + RepConv.powerImage[b] + ".png", "img");
      }
    }
    return "";
  };
  this.GetUnit = function(a) {
    return RepConv.unitsCode[a] || "XX";
  };
  this.GetUnitCost = function(a, b) {
    try {
      return _ratio = b || 1, {w:Math.round(GameData.units[a].resources.wood * _ratio), s:Math.round(GameData.units[a].resources.stone * _ratio), i:Math.round(GameData.units[a].resources.iron * _ratio), p:GameData.units[a].population, f:Math.round(GameData.units[a].favor * _ratio)};
    } catch (f) {
      return {w:0, s:0, i:0, p:0, f:0};
    }
  };
  this.GetBuild = function(a) {
    return RepConv.buildCode[a] || "XX";
  };
  this.GetImageCode = function(a) {
    return RepConv.buildCode[a] || RepConv.unitsCode[a] || RepConv.academyCode[a] || "XX";
  };
  this.AddBtn = function(a, b) {
    b = b || "";
    a = $("<div/>", {"class":"button_new", id:a + b, name:RepConvTool.GetLabel(a), style:"float: right; margin: 2px; ", rel:"#" + b}).button({caption:RepConvTool.GetLabel(a)});
    RepConv.Debug && console.log(b);
    return a;
  };
  this.TownObj = "";
  this.Ramka = function(a, b, f) {
    f = f || 300;
    a = $("<div/>", {"class":"game_border"}).append($("<div/>", {"class":"game_border_top"})).append($("<div/>", {"class":"game_border_bottom"})).append($("<div/>", {"class":"game_border_left"})).append($("<div/>", {"class":"game_border_right"})).append($("<div/>", {"class":"game_border_corner corner1"})).append($("<div/>", {"class":"game_border_corner corner2"})).append($("<div/>", {"class":"game_border_corner corner3"})).append($("<div/>", {"class":"game_border_corner corner4"})).append($("<div/>",
    {"class":"game_header bold", style:"height:18px;"}).append($("<div/>", {style:"float:left; padding-right:10px;"}).html(a)));
    f = f - 18 - 8 - 8;
    $(a).append($("<div/>", {"class":"grcrt_frame", style:"overflow-x: hidden; padding-left: 5px; position: relative;"}).html(b).height(f || 300));
    $(a).append($("<div/>", {"class":"game_list_footer", id:"RepConvBtns", style:"display: none;"}));
    return $("<div/>", {"class":"inner_box"}).append(a);
  };
  this.RamkaLight = function(a, b) {
    var e = $("<div/>");
    $(e).append($("<div/>", {"class":"box top left"}).append($("<div/>", {"class":"box top right"}).append($("<div/>", {"class":"box top center"})))).append($("<div/>", {"class":"box middle left"}).append($("<div/>", {"class":"box middle right"}).append($("<div/>", {"class":"box middle center"}).append($("<span/>", {"class":"town_name"}).html(a)).append($("<div/>", {"class":"box_content"}).html(b))))).append($("<div/>", {"class":"box bottom left"}).append($("<div/>", {"class":"box bottom right"}).append($("<div/>",
    {"class":"box bottom center"}))));
    return e;
  };
  this.insertBBcode = function(a, b, f) {
    $(f).focus();
    if ("undefined" != typeof document.selection) {
      f = document.selection.createRange();
      var e = f.text;
      f.text = a + e + b;
      f = document.selection.createRange();
      0 == e.length ? f.move("character", -b.length) : f.moveStart("character", a.length + e.length + b.length);
      f.select();
    } else {
      if ("undefined" != typeof f.selectionStart) {
        f.focus();
        var k = f.selectionStart, z = f.selectionEnd, t = f.scrollTop, A = f.scrollHeight;
        e = f.value.substring(k, z);
        f.value = f.value.substr(0, k) + a + e + b + f.value.substr(z);
        a = 0 == e.length ? k + a.length : k + a.length + e.length + b.length;
        f.selectionStart = a;
        f.selectionEnd = a;
        f.scrollTop = t + f.scrollHeight - A;
      }
    }
  };
  this.addsEmots = function(a, b, f) {
    0 == a.getJQElement().find("#emots_popup_" + a.type).length && (a.getJQElement().find($(".bb_button_wrapper")).append($("<div/>", {id:"emots_popup_" + a.type, style:"display:none; z-index: 5000;"}).append($("<div/>", {"class":"bbcode_box middle_center"}).append($("<div/>", {"class":"bbcode_box top_left"})).append($("<div/>", {"class":"bbcode_box top_right"})).append($("<div/>", {"class":"bbcode_box top_center"})).append($("<div/>", {"class":"bbcode_box bottom_center"})).append($("<div/>", {"class":"bbcode_box bottom_right"})).append($("<div/>",
    {"class":"bbcode_box bottom_left"})).append($("<div/>", {"class":"bbcode_box middle_left"})).append($("<div/>", {"class":"bbcode_box middle_right"})).append($("<div/>", {"class":"bbcode_box content clearfix", style:"overflow-y:auto !important; max-height: 185px;"}))).css({position:"absolute", top:"27px", left:"455px", width:"300px"})), $.each(RepConvAdds.emots, function(b, e) {
      a.getJQElement().find("#emots_popup_" + a.type + " .content").append($("<img/>", {src:e.img, title:e.title}).click(function() {
        RepConvTool.insertBBcode("[img]" + $(this).attr("src") + "[/img]", "", a.getJQElement().find(f)[0]);
        $("#emots_popup_" + a.type).toggle();
      }));
    }), a.getJQElement().find(b).append($("<img/>", {src:RepConv.Scripts_url + "emots/usmiech.gif", style:"cursor: pointer;"}).click(function() {
      $("#emots_popup_" + a.type).toggle();
    })), a.getJQElement().find(b).append($("<img/>", {src:RepConv.Const.uiImg + "paste_report.png", style:"cursor: pointer;"}).click(function() {
      void 0 != RepConv.ClipBoard && RepConvTool.insertBBcode(RepConv.ClipBoard, "", a.getJQElement().find(f)[0]);
    }).mousePopup(new MousePopup(RepConvTool.GetLabel("POPINSERTLASTREPORT")))));
  };
  this.loadPower = function() {
    RepConv.active.power && (RepConv.Debug && console.log("loadPower"), $.each($("div.gods_spells_menu .god_container div.new_ui_power_icon div[name=counter]"), function(a, b) {
      $(b).remove();
    }), $.each($("div.gods_spells_menu .god_container div.new_ui_power_icon.disabled"), function(a, b) {
      power = GameData.powers[$(b).attr("data-power_id")];
      god = MM.checkAndPublishRawModel("PlayerGods", {id:Game.player_id}).getCurrentProductionOverview()[power.god_id];
      _godCurr = MM.checkAndPublishRawModel("PlayerGods", {id:Game.player_id})[power.god_id + "_favor_delta_property"].calculateCurrentValue().unprocessedCurrentValue;
      marg = 27;
      0 < god.production && $(b).append($("<div/>", {style:"margin-top:" + marg + "px;color:white;text-shadow: 1px 1px 1px black;font-size:7px;z-index:3000;", name:"counter"}).countdown(Timestamp.server() + (power.favor - _godCurr) / god.production * 3600));
    }));
  };
  this.BBC2HTML = function(a) {
    function b(a, b) {
      for (var e in b) {
        a = a.replace(new RegExp(e, "g"), b[e]);
      }
      return a;
    }
    function f(a) {
      a = a.replace('"', "").split(",");
      var b = "";
      $.each(a, function(a, e) {
        y = e.split(":");
        b += " " + y[0] + '="' + y[1] + '"';
      });
      return b;
    }
    function u(a, b, e, g) {
      g && -1 < g.indexOf("[") && (g = g.replace(k, u));
      switch(b) {
        case "url":
        case "anchor":
        case "email":
          return "<a " + t[b] + (e || g) + '">' + g + "</a>";
        case "img":
          return a = z.exec(e), '<img src="' + g + '"' + (a ? ' width="' + a[1] + '" height="' + a[2] + '"' : "") + ' alt="' + (a ? "" : e) + '" />';
        case "flash":
        case "youtube":
          return a = z.exec(e) || [0, 425, 366], '<object type="application/x-shockwave-flash" data="' + G[b] + g + '" width="' + a[1] + '" height="' + a[2] + '"><param name="movie" value="' + G[b] + g + '" /></object>';
        case "float":
          return '<span style="float: ' + e + '">' + g + "</span>";
        case "left":
        case "right":
        case "center":
        case "justify":
          return '<div style="text-align: ' + b + '">' + g + "</div>";
        case "google":
        case "wikipedia":
          return '<a href="' + A[b] + g + '">' + g + "</a>";
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
          return a = "", void 0 != e && (a = f(e)), "<" + b + a + ">" + g + "</" + b + ">";
        case "row":
        case "r":
        case "header":
        case "head":
        case "h":
        case "col":
        case "c":
          return "<" + h[b] + ">" + g + "</" + h[b] + ">";
        case "acronym":
        case "abbr":
          return "<" + b + ' title="' + e + '">' + g + "</" + b + ">";
      }
      return "[" + b + (e ? "=" + e : "") + "]" + g + "[/" + b + "]";
    }
    if (0 > a.indexOf("[")) {
      return a;
    }
    var k = /\[([a-z][a-z0-9]*)(?:=([^\]]+))?]((?:.|[\r\n])*?)\[\/\1]/g, z = RegExp("^(\\d+)x(\\d+)$", void 0), t = {url:'href="', anchor:'name="', email:'href="mailto: '}, A = {google:"http://www.google.com/search?q=", wikipedia:"http://www.wikipedia.org/wiki/"}, G = {youtube:"http://www.youtube.com/v/", flash:""}, h = {row:"tr", r:"tr", header:"th", head:"th", h:"th", col:"td", c:"td"}, r = {notag:[{"\\[":"&#91;", "]":"&#93;"}, "", ""], code:[{"<":"&lt;"}, "<code><pre>", "</pre></code>"]};
    r.php = [r.code[0], r.code[1] + "&lt;?php ", "?>" + r.code[2]];
    var g = {font:"font-family:$1", size:"font-size:$1px", color:"color:$1"}, q = {c:"circle", d:"disc", s:"square", 1:"decimal", a:"lower-alpha", A:"upper-alpha", i:"lower-roman", I:"upper-roman"}, l = {}, m = {}, w;
    for (w in r) {
      l["\\[(" + w + ")]((?:.|[\r\n])*?)\\[/\\1]"] = function(a, e, g) {
        return r[e][1] + b(g, r[e][0]) + r[e][2];
      };
    }
    for (w in g) {
      m["\\[" + w + "=([^\\]]+)]"] = '<span style="' + g[w] + '">', m["\\[/" + w + "]"] = "</span>";
    }
    m["\\[list]"] = "<ul>";
    m["\\[list=(\\w)]"] = function(a, b) {
      return '<ul style="list-style-type: ' + (q[b] || "disc") + '">';
    };
    m["\\[/list]"] = "</ul>";
    m["\\[\\*]"] = "<li>";
    m["\\[quote(?:=([^\\]]+))?]"] = function(a, b) {
      return '<div class="bb-quote">' + (b ? b + " wrote" : "Quote") + ":<blockquote>";
    };
    m["\\[/quote]"] = "</blockquote></div>";
    m["\\[(hr|br)]"] = "<$1 />";
    m["\\[sp]"] = "&nbsp;";
    return b(b(a, l), m).replace(k, u);
  };
  this.addLine = function(a) {
    return "[img]" + RepConv.Const.unitImg + a + ".png[/img]";
  };
  this.Atob = function(a) {
    a = a.split(/#/);
    return atob(a[1] || a[0]);
  };
  this.getCaller = function(a) {
    a = a.substr(9);
    return a = a.substr(0, a.indexOf("("));
  };
  this.hexToRGB = function(a, b) {
    var e = parseInt(a.slice(1, 3), 16), u = parseInt(a.slice(3, 5), 16);
    a = parseInt(a.slice(5, 7), 16);
    return b ? "rgba(" + e + ", " + u + ", " + a + ", " + b + ")" : "rgb(" + e + ", " + u + ", " + a + ")";
  };
  this.getPlayerColor = function(a, b) {
    var e = MM.getOnlyCollectionByName("CustomColor"), u = require("helpers/default_colors"), k = require("enums/filters");
    a = JSON.parse(RepConvTool.Atob(a));
    var z = void 0;
    a.id == Game.player_id && (z = u.getDefaultColorForPlayer(Game.player_id));
    z || (z = e.getCustomColorByIdAndType(k.FILTER_TYPES.PLAYER, a.id) && e.getCustomColorByIdAndType(k.FILTER_TYPES.PLAYER, a.id).getColor());
    z || (z = RepConvTool.getPlayerData(a.id) && RepConvTool.getPlayerData(a.id).alliance_id ? RepConvTool.getPlayerData(a.id).alliance_id == Game.alliance_id ? e.getCustomColorByIdAndType(k.ALLIANCE_TYPES.OWN_ALLIANCE, RepConvTool.getPlayerData(a.id).alliance_id) && e.getCustomColorByIdAndType(k.ALLIANCE_TYPES.OWN_ALLIANCE, RepConvTool.getPlayerData(a.id).alliance_id).getColor() || u.getDefaultColorForAlliance(RepConvTool.getPlayerData(a.id).alliance_id) : b[RepConvTool.getPlayerData(a.id).alliance_id] &&
    (e.getCustomColorByIdAndType(k.FILTER_TYPES[b[RepConvTool.getPlayerData(a.id).alliance_id]], RepConvTool.getPlayerData(a.id).alliance_id) && e.getCustomColorByIdAndType(k.FILTER_TYPES[b[RepConvTool.getPlayerData(a.id).alliance_id]], RepConvTool.getPlayerData(a.id).alliance_id).getColor() || u.getDefaultColorForAlliance(RepConvTool.getPlayerData(a.id).alliance_id)) || RepConvTool.getPlayerData(a.id).alliance_id && (e.getCustomColorByIdAndType(k.FILTER_TYPES.ALLIANCE, RepConvTool.getPlayerData(a.id).alliance_id) &&
    e.getCustomColorByIdAndType(k.FILTER_TYPES.ALLIANCE, RepConvTool.getPlayerData(a.id).alliance_id).getColor() || u.getDefaultColorForAlliance(RepConvTool.getPlayerData(a.id).alliance_id)) : u.getDefaultColorForPlayer(a.id, Game.player_id));
    return z;
  };
  $("<iframe/>", {id:"GRCSender", name:"GRCSender", style:"display:none"}).appendTo($("body"));
  b();
  this.getPlayerData = function(a) {
    try {
      return RepConv.cachePlayers[a];
    } catch (e) {
    }
    return null;
  };
  this.getAllianceData = function(a) {
    try {
      return RepConv.cacheAlliances[a];
    } catch (e) {
    }
    return null;
  };
}
function _GRCRTConverterCtrl(b) {
  function k(c) {
    if ("undefined" == typeof c.getController) {
      return c.getType();
    }
    switch(c.getController()) {
      case "building_place":
        switch(c.getContext().sub) {
          case "building_place_index":
            return "agoraD";
          case "building_place_units_beyond":
            return "agoraS";
        }break;
      case "building_wall":
        return "wall";
      case "command_info":
        switch(c.getContext().sub) {
          case "command_info_colonization_info":
          case "command_info_info":
            return "command";
          case "command_info_conquest_info":
            return "conquerold";
          case "command_info_conquest_movements":
            return "conqueroldtroops";
        }break;
      case "report":
        switch(c.getContext().sub) {
          case "report_view":
            return c = u(n.find($("div#report_arrow img")).attr("src")), "attack" == c && 0 != n.find($("div.support_report_summary")).length && (c = "attackSupport"), c;
        }break;
      case "town_info":
        switch(c.getContext().sub) {
          case "town_info_support":
            return "ownTropsInTheCity";
        }break;
      case "town_overviews":
        return "commandList";
      case "conquest_info":
        return "conquest";
      case "island_info":
        switch(c.getContext().sub) {
          case "island_info_index":
            return "bbcode_island";
        }case "player":
        switch(c.getContext().sub) {
          case "player_get_profile_html":
            return "bbcode_player";
        }break;
      case "alliance":
        switch(c.getContext().sub) {
          case "alliance_profile":
            return "bbcode_alliance";
        }break;
      case "building_main":
        return "main";
    }
    return "";
  }
  function a(c, a, b) {
    return $("<div/>", {"class":"checkbox_new"}).checkbox({caption:RepConvTool.GetLabel(b || c), checked:a, cid:c}).on("cbx:check", function() {
      ba();
    });
  }
  function e(c, a, b, d) {
    $.each(c, function(c, p) {
      f(p, a, b, d);
    });
  }
  function f(c, a, b, d) {
    if ("undefined" != typeof c.ua && 0 < c.ua.length) {
      a = a || GRCRTtpl.rct.genImgS;
      b = b || GRCRTtpl.rct.genImgM;
      d = d || GRCRTtpl.rct.genImgS / 50 * 11;
      var p = $.md5(x(c.ua, a, b, d));
      c.img_url = RepConvTool.Adds(z(p), "img");
      RepConv.Debug && console.log(p);
      $.ajax({type:"POST", url:RepConv.grcrt_domain + "imgdata.php", data:{param:btoa(x(c.ua, a, b, d)), dest:p}, dataType:"script", async:!1});
    }
  }
  function u(c) {
    RepConv.Debug && console.log("getType");
    var a = null;
    $.each("raise conquer illusion breach attack take_over conqueroldtroops commandList conquerold support attackSupport agoraD agoraS espionage powers wall found conquest academy main ownTropsInTheCity".split(" "), function(b, d) {
      -1 < c.indexOf(d) && (a = d);
    });
    return a;
  }
  function x(c, a, b, d) {
    return JSON.stringify({ua:c, s:a, m:b, fs:d || GRCRTtpl.rct.genImgS / 50 * 11});
  }
  function z(c) {
    return RepConv.grcrt_domain + "_img_cache_/" + c.substr(0, 2) + "/" + c + ".png";
  }
  function t(c) {
    function a(c, a) {
      for (var b in a) {
        c = c.replace(new RegExp(b, "g"), a[b]);
      }
      return c;
    }
    function b(c) {
      c = c.replace('"', "").split(",");
      var a = "";
      $.each(c, function(c, b) {
        c = b.split(":");
        a += " " + c[0] + '="' + c[1] + '"';
      });
      return a;
    }
    function d(c, a, h, f) {
      f && -1 < f.indexOf("[") && (f = f.replace(p, d));
      switch(a) {
        case "url":
        case "anchor":
        case "email":
          return "<a " + Q[a] + (h || f) + '">' + f + "</a>";
        case "img":
          return c = v.exec(h), '<img src="' + f + '"' + (c ? ' width="' + c[1] + '" height="' + c[2] + '"' : "") + ' alt="' + (c ? "" : h) + '" />';
        case "flash":
        case "youtube":
          return c = v.exec(h) || [0, 425, 366], '<object type="application/x-shockwave-flash" data="' + g[a] + f + '" width="' + c[1] + '" height="' + c[2] + '"><param name="movie" value="' + g[a] + f + '" /></object>';
        case "float":
          return '<span style="float: ' + h + '">' + f + "</span>";
        case "left":
        case "right":
        case "center":
        case "justify":
          return '<div style="text-align: ' + a + '">' + f + "</div>";
        case "google":
        case "wikipedia":
          return '<a href="' + e[a] + f + '">' + f + "</a>";
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
          return c = "", void 0 != h && (c = b(h)), "<" + a + c + ">" + f + "</" + a + ">";
        case "row":
        case "r":
        case "header":
        case "head":
        case "h":
        case "col":
        case "c":
          return "<" + B[a] + ">" + f + "</" + B[a] + ">";
        case "acronym":
        case "abbr":
          return "<" + a + ' title="' + h + '">' + f + "</" + a + ">";
      }
      return "[" + a + (h ? "=" + h : "") + "]" + f + "[/" + a + "]";
    }
    if (0 > c.indexOf("[")) {
      return c;
    }
    var p = /\[([a-z][a-z0-9]*)(?:=([^\]]+))?]((?:.|[\r\n])*?)\[\/\1]/g, v = RegExp("^(\\d+)x(\\d+)$", void 0), Q = {url:'href="', anchor:'name="', email:'href="mailto: '}, e = {google:"http://www.google.com/search?q=", wikipedia:"http://www.wikipedia.org/wiki/"}, g = {youtube:"http://www.youtube.com/v/", flash:""}, B = {row:"tr", r:"tr", header:"th", head:"th", h:"th", col:"td", c:"td"}, h = {notag:[{"\\[":"&#91;", "]":"&#93;"}, "", ""], code:[{"<":"&lt;"}, "<code><pre>", "</pre></code>"]};
    h.php = [h.code[0], h.code[1] + "&lt;?php ", "?>" + h.code[2]];
    var f = {font:"font-family:$1", size:"font-size:$1px", color:"color:$1"}, S = {c:"circle", d:"disc", s:"square", 1:"decimal", a:"lower-alpha", A:"upper-alpha", i:"lower-roman", I:"upper-roman"}, r = {}, D = {}, l;
    for (l in h) {
      r["\\[(" + l + ")]((?:.|[\r\n])*?)\\[/\\1]"] = function(c, b, d) {
        return h[b][1] + a(d, h[b][0]) + h[b][2];
      };
    }
    for (l in f) {
      D["\\[" + l + "=([^\\]]+)]"] = '<span style="' + f[l] + '">', D["\\[/" + l + "]"] = "</span>";
    }
    D["\\[list]"] = "<ul>";
    D["\\[list=(\\w)]"] = function(c, a) {
      return '<ul style="list-style-type: ' + (S[a] || "disc") + '">';
    };
    D["\\[/list]"] = "</ul>";
    D["\\[\\*]"] = "<li>";
    D["\\[quote(?:=([^\\]]+))?]"] = function(c, a) {
      return '<div class="bb-quote">' + (a ? a + " wrote" : "Quote") + ":<blockquote>";
    };
    D["\\[/quote]"] = "</blockquote></div>";
    D["\\[(hr|br)]"] = "<$1 />";
    D["\\[sp]"] = "&nbsp;";
    return a(a(c, r), D).replace(p, d);
  }
  function A(c, a) {
    RepConv.Debug && console.log("bbcode2html");
    var b = {message:c};
    RepConv.Debug && console.log(c.length);
    gpAjax._ajax("message", "preview", b, !0, function(c) {
      RepConv.Debug && console.log(c.message);
      $(a).html(c.message);
    }, "post");
  }
  function G(c, a) {
    RepConv.Debug && console.log("bbcode2img");
    c = $.ajax({url:RepConv.grcrt_domain + "bbcode2html.php?ModPagespeed=off", method:"post", data:{html:RepConv.__repconvValueBBCode}, cache:!1, async:!1});
    return "[img]" + RepConv.grcrt_domain + "_rep_img_/" + c.responseJSON.filename.substr(0, 2) + "/" + c.responseJSON.filename + ".png[/img]\n\n";
  }
  function h(c) {
    1 == $("#repConvArea").length && $("#repConvArea").remove();
    1 == $("#RepConvDivPrev").length && $("#RepConvDivPrev").remove();
    var a = "BBCODEI" == B.getValue() ? G(c, d) : null, b = $("<textarea/>", {style:RepConv.Const.textareastyle, id:"repConvArea", readonly:"readonly"}).text("BBCODEI" == B.getValue() ? a : c).click(function() {
      this.select();
    }).height(p - 6).hide(), d = $("<span/>", {"class":"monospace", id:"RepConvSpanPrev"}), v = $("<div/>", {style:"background-color: #fff; height: 225px; width: 753px; overflow-y: scroll; font-size: 100%;", id:"RepConvDivPrev", "class":"quote_message small "}).width("BBCODEA" == B.getValue() ? 805 : 777).css("padding", "BBCODEA" == B.getValue() ? "0px" : "0 15px").height(p).append(d);
    "BBCODEH" == D.getValue() && "BBCODEE" == B.getValue() ? $(d).append(t(c)) : (A("BBCODEI" == B.getValue() ? a : c, d), "BBCODEI" == B.getValue() && (RepConv.__repconvValueArray = [a], RepConv.__repconvHtmlArray = null));
    $("#RepConvAreas div.box_content").append(b);
    $("#RepConvAreas div.box_content").append(v);
    "BBCODEE" != B.getValue() && (RepConv.ClipBoard = c, $("#RepConvBtns div.RepConvMsg").html(RepConvTool.GetLabel("MSGCOPYREPORT").replace("[paste_icon]", '<img src="' + RepConv.Const.uiImg + 'paste_report.png" style="vertical-align: text-top;"/>')).fadeOut(50).fadeIn(500));
  }
  function r(c, a) {
    "BBCODEH" == D.getValue() && "BBCODEE" == B.getValue() || "BBCODEI" == B.getValue() || (RepConv["__repconvHtmlArray" + a] = [], $.each(c, function(c, b) {
      $("<div/>");
      c = {message:b};
      RepConv.Debug && console.log(value.length);
      gpAjax._ajax("message", "preview", c, !0, function(c) {
        RepConv.Debug && console.log(c.message);
        RepConv["__repconvHtmlArray" + a].push(c.message);
      }, "post");
    }));
  }
  function g() {
    RepConv.Debug && console.log("__getReportTitle");
    c.title = n.find($("#report_report_header")).html().stripTags().replace("&nbsp;", " ").trim();
  }
  function q() {
    RepConv.Debug && console.log("__getReportTime");
    c.time = "(" + n.find($("#report_date")).html() + ") ";
  }
  function l() {
    RepConv.Debug && console.log("__getReportType");
    m();
  }
  function m() {
    RepConv.Debug && console.log("__getReportMorale");
    c.morale = 0 == n.find($("span.fight_bonus.morale")).length ? "" : GRCRTtpl.rct.morale + n.find($("span.fight_bonus.morale")).html().stripTags().trim();
  }
  function w() {
    RepConv.Debug && console.log("__getReportLuck");
    c.luck = 0 == n.find($("span.fight_bonus.luck")).length ? "" : GRCRTtpl.rct.luck + n.find($("span.fight_bonus.luck")).html().stripTags().trim();
    -1 < c.luck.indexOf("-") && (c.luck = "[color=#b50307]" + c.luck + "[/color]");
  }
  function J() {
    RepConv.Debug && console.log("__getReportOldWall");
    c.oldwall = {};
    0 == n.find($("span.fight_bonus.oldwall")).length ? c.oldwall[0] = "" : $.each(n.find($("span.fight_bonus.oldwall")), function(a, b) {
      c.oldwall[a] = $(b).html().stripTags().trim();
    });
  }
  function W() {
    RepConv.Debug && console.log("__getReportNightBonus");
    c.nightbonus = 0 == n.find($("span.fight_bonus.nightbonus")).length ? "" : GRCRTtpl.rct.nightbonus + n.find($("span.fight_bonus.nightbonus")).html().stripTags().trim();
  }
  function U() {
    RepConv.Debug && console.log("__getReportResources");
    var a = {};
    c.resources = ya();
    c.resources.title = (0 == n.find($("div#resources h4")).length ? n.find($("div#resources p")).html() : n.find($("div#resources h4")).html()) || " ";
    $.each(n.find($("div#resources li.res_background div")), function(b, d) {
      switch(d.className) {
        case "wood_img":
          a = {i:"S1", b:$(d).nextAll().text()};
          c.resources.ua.push(a);
          c.resources.wood = $(d).nextAll().text();
          break;
        case "stone_img":
          a = {i:"S2", b:$(d).nextAll().text()};
          c.resources.ua.push(a);
          c.resources.stone = $(d).nextAll().text();
          break;
        case "iron_img":
          a = {i:"S3", b:$(d).nextAll().text()};
          c.resources.ua.push(a);
          c.resources.iron = $(d).nextAll().text();
          break;
        case "favor_img":
          a = {i:"S4", b:$(d).nextAll().text()}, c.resources.ua.push(a), c.resources.power = $(d).nextAll().text();
      }
    });
    f(c.resources, 30, GRCRTtpl.rct.genImgM + 5, 7.5);
  }
  function H() {
    RepConv.Debug && console.log("__getReportBunt");
    c.bunt = "";
    0 == n.find($("div#resources h4")).length && 1 == n.find($("div#resources>span")).length ? c.bunt = n.find($("div#resources>span")).html().stripTags() : 1 == n.find($("div#resources>h4")).length && 2 == n.find($("div#resources>span")).length ? c.bunt = n.find($("div#resources>span")).eq(1).html().stripTags() : 1 == n.find($("div#resources>h4")).length && 1 == n.find($("div#resources>span")).length && (c.bunt = n.find($("div#resources>span")).eq(0).html().stripTags());
  }
  function za(c, a) {
    var b = "CS_" + c + "_" + a.id;
    if (sessionStorage.getItem(b) && JSON.parse(sessionStorage.getItem(b)).timestamp + 600 > Timestamp.server()) {
      return JSON.parse(sessionStorage.getItem(b)).CsTime;
    }
    var d = {}, p = {player_id:c, town_id:Game.townId, nl_init:NotificationLoader.isGameInitialized()};
    c = $.ajax({url:"/game/player?action=get_profile_html&town_id=" + Game.townId + "&h=" + Game.csrfToken + "&json=" + JSON.stringify(p), async:!1});
    var v = null, Q = Math.floor(Math.sqrt(Math.pow(100, 2) + Math.pow(100, 2)));
    c = $("<pre/>").append(JSON.parse(c.responseText).plain.html);
    $.each(c.find(".gp_town_link"), function(c, b) {
      c = JSON.parse(RepConvTool.Atob($(b).attr("href")));
      b = Math.floor(Math.sqrt(Math.pow(a.ix - c.ix, 2) + Math.pow(a.iy - c.iy, 2)));
      Q = Math.min(Q, b);
      void 0 == d[b] && (d[b] = {});
      void 0 == d[b][c.id] && (d[b][c.id] = {});
      d[b][c.id].id = c.id;
      d[b][c.id].name = c.name;
    });
    $.each(d[Q], function(c, b) {
      p = {id:c, town_id:a.id, nl_init:NotificationLoader.isGameInitialized()};
      $.ajax({url:"/game/town_info?town_id=" + a.id + "&action=attack&h=" + Game.csrfToken + "&json=" + JSON.stringify(p), async:!1, complete:function(c) {
        c = JSON.parse(c.responseText).json.json.units.colonize_ship.duration_without_bonus;
        v = Math.min(v || c, c);
      }});
    });
    sessionStorage.setItem(b, JSON.stringify({timestamp:Timestamp.server() + 600, CsTime:v}));
    return v;
  }
  function R() {
    RepConv.Debug && console.log("__initUnit");
    return {unit_img:"", unit_send:"", unit_lost:"", unit_list:"", unit_diff:"", ua:[], img_url:RepConvTool.GetLabel("NOTUNIT")};
  }
  function K() {
    RepConv.Debug && console.log("__initUnitDetail");
    return {unit_img:"", unit_send:"", unit_lost:"", unit_list:"", unit_diff:"", w:0, s:0, i:0, p:0, f:0, ua:[]};
  }
  function ya() {
    RepConv.Debug && console.log("__initResources");
    return {title:"", detail:"", image:"", count:"", wood:"0", stone:"0", iron:"0", power:"0", ua:[]};
  }
  function ha(a, b, d) {
    RepConv.Debug && console.log("__getUnitDetail2Way");
    var p = 0, v = 0;
    d = "undefined" !== typeof d ? d : 5;
    c[a].full = R();
    c[a].splits = {};
    c[a].splits[1] = R();
    $.each(n.find($(b)), function(b, e) {
      if (0 < e.childElementCount) {
        b = RepConvTool.getUnitName($(e).find(".report_unit"));
        var Q = RepConvTool.GetUnitCost(b), g = $(e).find(".report_losts").html().replace("-", "");
        "?" == g ? g = 0 : (c[a].w += Q.w * parseInt(g), c[a].s += Q.s * parseInt(g), c[a].i += Q.i * parseInt(g), c[a].p += Q.p * parseInt(g), c[a].f += Q.f * parseInt(g));
        0 == p % d && (p = 0, v++);
        void 0 == c[a].splits[v] && (c[a].splits[v] = R());
        e = {i:RepConvTool.GetUnit(b), b:$(e).find(".report_unit>span").html(), r:g};
        c[a].full.ua.push(e);
        c[a].splits[v].ua.push(e);
        p++;
      }
    });
    f(c[a].full);
    e(c[a].splits);
  }
  function ia(a, b, d) {
    RepConv.Debug && console.log("__getUnitDetail1Way");
    var p = 0, v = 0;
    d = "undefined" !== typeof d ? d : 5;
    c[a].full = R();
    c[a].splits = {};
    c[a].splits[1] = R();
    $.each(n.find($(b)), function(b, e) {
      b = RepConvTool.getUnitName($(e));
      RepConvTool.GetUnitCost(b);
      0 == p % d && (p = 0, v++);
      void 0 == c[a].splits[v] && (c[a].splits[v] = R());
      e = {i:RepConvTool.GetUnit(b), b:$(e).children("span").html()};
      c[a].full.ua.push(e);
      c[a].splits[v].ua.push(e);
      p++;
    });
    f(c[a].full);
    e(c[a].splits);
  }
  function Ga(a, b, d) {
    RepConv.Debug && console.log("__getBuildDetail1Way");
    var p = 0, v = 0;
    d = "undefined" !== typeof d ? d : 5;
    c[a].full = R();
    c[a].splits = {};
    $.each(n.find($(b)), function(b, e) {
      b = RepConvTool.getUnitName($(e));
      RepConvTool.GetUnitCost(b);
      0 == p % d && (p = 0, v++);
      void 0 == c[a].splits[v] && (c[a].splits[v] = R());
      e = {i:RepConvTool.GetBuild(b), b:$(e).children("span").html()};
      c[a].full.ua.push(e);
      c[a].splits[v].ua.push(e);
      p++;
    });
    f(c[a].full);
    e(c[a].splits);
  }
  function Ca(c) {
    RepConv.Debug && console.log("getPlayerInfo");
    return {town:sa(c), player:la(c), ally:ca(c), townName:L(c), playerName:M(c)};
  }
  function E(c, a) {
    RepConv.Debug && console.log("getPlayerInfo2");
    void 0 == c && (c = {});
    c.town = sa(a);
    var b = c;
    RepConv.Debug && console.log("_getTownType");
    var d = 0 < $(a).find($("li.town_name a,.gp_town_link")).length ? RepConvTool.Atob($(a).find($("li.town_name a,.gp_town_link")).attr("href")).tp : 0 < $(a).find($("li.town_name")).length ? RepConvTool.Adds($(a).find($("li.town_name")).html().trim(), GRCRTtpl.rct.town) : "";
    b.town_type = d;
    c.player = la(a);
    c.ally = ca(a);
    c.townName = L(a);
    c.playerName = M(a);
    return c;
  }
  function L(c) {
    RepConv.Debug && console.log("_getTownName");
    return 0 < $(c).find($("li.town_name a")).length ? $(c).find($("li.town_name a")).html().trim() : "";
  }
  function M(c) {
    RepConv.Debug && console.log("_getPlayerName");
    return 0 < $(c).find($("li.town_owner a")).length ? $(c).find($("li.town_owner a")).html().trim() : "";
  }
  function sa(c) {
    RepConv.Debug && console.log("_getTown");
    return 0 < $(c).find($("li.town_name a,.gp_town_link")).length && "BBCODEI" != B.getValue() ? RepConvTool.Adds(JSON.parse(RepConvTool.Atob($(c).find($("li.town_name a,.gp_town_link")).attr("href")))[GRCRTtpl.rct.getTown] + "", GRCRTtpl.rct.town) : 0 < $(c).find($("li.town_name a,.gp_town_link")).length && "BBCODEI" == B.getValue() ? RepConvTool.Adds($(c).find($("li.town_name a,.gp_town_link")).text().trim(), GRCRTtpl.rct.town) : 0 < $(c).find($("li.town_name")).length ? RepConvTool.Adds($(c).find($("li.town_name")).html().trim(),
    GRCRTtpl.rct.town) : 0 < $(c).find($("a.gp_island_link")).length && "BBCODEI" != B.getValue() ? RepConvTool.Adds(JSON.parse(RepConvTool.Atob($(c).find($("a.gp_island_link")).attr("href")))[GRCRTtpl.rct.getIsland] + "", GRCRTtpl.rct.island) : 0 < $(c).find($("a.gp_island_link")).length && "BBCODEI" == B.getValue() ? RepConvTool.Adds($(c).find($("a.gp_island_link")).text().trim(), GRCRTtpl.rct.island) : "";
  }
  function la(c) {
    RepConv.Debug && console.log("_getPlayer");
    return 0 < $(c).find($("li.town_owner a,.gp_player_link")).length ? RepConvTool.Adds($(c).find($("li.town_owner a,.gp_player_link")).html(), GRCRTtpl.rct.player) : RepConvTool.Adds(($(c).find($("li.town_owner")).html() || "").trim(), GRCRTtpl.rct.player);
  }
  function ca(c) {
    RepConv.Debug && console.log("_getAlly");
    return 0 < $(c).find($("li.town_owner_ally a")).length ? RepConvTool.Adds($(c).find($("li.town_owner_ally a")).attr("onclick").replace(/.*'(.*)'.*/, "$1"), GRCRTtpl.rct.ally) : "";
  }
  function ma() {
    function a() {
      return ITowns.getCurrentTown().getBuildings().getBuildingLevel("academy");
    }
    function d() {
      return ITowns.getCurrentTown().getBuildings().getBuildingLevel("library");
    }
    function p() {
      var c = GameData.researches, a = ITowns.getCurrentTown().getResearches(), d = b.data.collections.research_orders, p = 0, v;
      for (v in c) {
        if (c.hasOwnProperty(v)) {
          var e = c[v];
          if (a.hasResearch(v) || d.isResearchInQueue(v)) {
            p += e.research_points;
          }
        }
      }
      return p;
    }
    var v = function() {
      var c = GameData.researches, v = b.data.collections.research_orders, e = a(), g = a() * GameDataResearches.getResearchPointsPerAcademyLevel() + (1 === d() ? GameDataResearches.getResearchPointsPerLibraryLevel() : 0) - p(), f = ITowns.getCurrentTown().getResearches(), h = [], B;
      for (B in c) {
        if (c.hasOwnProperty(B)) {
          var S = c[B], r = S.building_dependencies, D = Math.ceil(r.academy / 3), Q = f.hasResearch(B), l = v.isResearchInQueue(B), n = v.isResearchQueueFull();
          a: {
            var q = void 0;
            var m = GameData.researches[B].resources, u = ITowns.getCurrentTown().resources();
            for (q in m) {
              if (m.hasOwnProperty(q) && m[q] > u[q]) {
                q = !1;
                break a;
              }
            }
            q = !0;
          }
          m = e >= r.academy;
          S = g >= S.research_points;
          h[D - 1] || (h[D - 1] = []);
          h[D - 1].push({research_id:B, column_number:D, is_researched:Q, in_progress:l, can_be_bought:m && !Q && !l && !n && q && S, academy_lvl:r.academy});
        }
      }
      return h;
    }(), e = 0, g = a();
    $.each(v, function(c, a) {
      e = Math.max(e, a.length);
    });
    c.title = GameData.buildings.academy.name + " (" + RepConvTool.Adds(GRCRTtpl.rct.outside ? Game.townName : Game.townId.toString(), GRCRTtpl.rct.town) + ")";
    c.time = "";
    c.linia = {};
    $.each(v, function(a, b) {
      for (a = 0; a < e; a++) {
        void 0 == c.linia[a] && (c.linia[a] = {unit_list:"", unit_name:""});
        var d = void 0 != b[a] ? RepConvTool.GetImageCode(GameDataResearches.getResearchCssClass(b[a].research_id)) : "";
        d = void 0 == b[a] || b[a].is_researched || b[a].in_progress ? d : d.toLowerCase();
        c.linia[a].unit_list += 0 < c.linia[a].unit_list.length ? "." : "";
        c.linia[a].unit_list += d;
        c.linia[a].unit_list += void 0 != b[a] && (b[a].academy_lvl > g || d == d.toUpperCase()) ? "|-" : "|";
      }
    });
    c.points = DM.getl10n("academy", "research_points") + ": " + (a() * GameDataResearches.getResearchPointsPerAcademyLevel() + (1 === d() ? GameDataResearches.getResearchPointsPerLibraryLevel() : 0) - p()) + "/" + (GameDataBuildings.getBuildingMaxLevel("academy") * GameDataResearches.getResearchPointsPerAcademyLevel() + (1 === d() ? GameDataResearches.getResearchPointsPerLibraryLevel() : 0));
  }
  function P() {
    function a() {
      return ITowns.getCurrentTown().getBuildings();
    }
    c.title = GameData.buildings.main.name + " (" + RepConvTool.Adds(GRCRTtpl.rct.outside ? Game.townName : Game.townId.toString(), GRCRTtpl.rct.town) + ")";
    c.time = "";
    c.linia = {};
    $.each(tech_tree, function(a, b) {
      for (a = 0; a < max_row; a++) {
        void 0 == c.linia[a] && (c.linia[a] = {unit_list:"", unit_name:""});
        var d = void 0 != b[a] ? RepConvTool.GetImageCode(GameDataResearches.getResearchCssClass(b[a].research_id)) : "";
        d = void 0 == b[a] || b[a].is_researched || b[a].in_progress ? d : d.toLowerCase();
        c.linia[a].unit_list += 0 < c.linia[a].unit_list.length ? "." : "";
        c.linia[a].unit_list += d;
        c.linia[a].unit_list += void 0 != b[a] && (b[a].academy_lvl > academy_lvl || d == d.toUpperCase()) ? "|-" : "|";
      }
    });
    c.points = DM.getl10n("academy", "research_points") + ": " + (a().getBuildingLevel("academy") * GameDataResearches.getResearchPointsPerAcademyLevel() + (1 === a().getBuildingLevel("library") ? GameDataResearches.getResearchPointsPerLibraryLevel() : 0) - function() {
      var c = GameData.researches, a = ITowns.getCurrentTown().getResearches(), d = b.data.collections.research_orders, p = 0, v;
      for (v in c) {
        if (c.hasOwnProperty(v)) {
          var e = c[v];
          if (a.hasResearch(v) || d.isResearchInQueue(v)) {
            p += e.research_points;
          }
        }
      }
      return p;
    }()) + "/" + (GameDataBuildings.getBuildingMaxLevel("academy") * GameDataResearches.getResearchPointsPerAcademyLevel() + (1 === a().getBuildingLevel("library") ? GameDataResearches.getResearchPointsPerLibraryLevel() : 0));
  }
  function N() {
    c.title = n.find($("div.game_header")).html().stripTags();
    c.time = "";
    c.linia = {};
    if (0 < n.find($("#tab_all ul#command_overview li")).length) {
      var a = -1;
      $.each(n.find($("#tab_all ul#command_overview li")), function(b, d) {
        if ("none" != $(d).css("display")) {
          if (a++, c.linia[a] = {title:"", img:null, townIdA:null, townIdB:null, islandB:null, inout:null, power:"", unit_img:"", unit_send:"", unit_list:"", spy:"", time:""}, 0 < $(d).find($("h4")).length) {
            c.linia[a].title = "[b]" + $(d).find($("h4")).html().stripTags() + "[/b]";
          } else {
            if (0 < $(d).find($("span.italic")).length) {
              c.linia[a].title = "[i]" + $(d).find($("span.italic")).html().stripTags() + "[/i]";
            } else {
              if ($(d).hasClass("place_command")) {
                c.linia[a].img = RepConvTool.getCommandIcon($(d).find("div.cmd_img"));
                c.linia[a].townIdB = "";
                c.linia[a].islandB = "";
                b = $(d).find($("span.cmd_span"));
                var p = $(b).find($("span.icon")), v = $(p).prevAll();
                p = $(p).nextAll();
                c.linia[a].inout = RepConvTool.Adds(RepConv.Const.staticImg + (0 == $(b).find(".overview_incoming").length ? "out" : "in") + ".png", "img");
                c.linia[a].townIdA = {};
                switch(v.length) {
                  case 2:
                  case 1:
                    $.each(v, function(d, b) {
                      "gp_town_link" == b.className ? "town" == JSON.parse(RepConvTool.Atob(b.hash)).tp ? (c.linia[a].townIdA.town = RepConvTool.Adds(JSON.parse(RepConvTool.Atob(b.hash))[GRCRTtpl.rct.getTown].toString(), GRCRTtpl.rct.town), c.linia[a].townIdA.townId = JSON.parse(RepConvTool.Atob(b.hash)).id, c.linia[a].townIdA.townJSON = JSON.parse(RepConvTool.Atob(b.hash))) : c.linia[a].townIdA.town = RepConvTool.Adds(b.text, GRCRTtpl.rct.town) : "gp_player_link" == b.className && (c.linia[a].townIdA.player =
                      RepConvTool.Adds(b.text, GRCRTtpl.rct.player));
                    });
                    c.linia[a].townIdA.full = c.linia[a].townIdA.town;
                    void 0 != c.linia[a].townIdA.player && (c.linia[a].townIdA.full += " (" + c.linia[a].townIdA.player + ")");
                    break;
                  case 0:
                    c.linia[a].townIdA.full = "", $.each(b[0].firstChild.data.split("\n"), function(d, b) {
                      c.linia[a].townIdA.full += " " + b.trim();
                      c.linia[a].townIdA.full = c.linia[a].townIdA.full.trim();
                    });
                }
                c.linia[a].townIdB = {};
                c.linia[a].islandB = {};
                switch(p.length) {
                  case 2:
                  case 1:
                    c.linia[a].townIdB.town = "";
                    $.each(p, function(b, d) {
                      "gp_town_link" == d.className ? "town" == JSON.parse(RepConvTool.Atob(d.hash)).tp ? c.linia[a].townIdB.town = RepConvTool.Adds(JSON.parse(RepConvTool.Atob(d.hash))[GRCRTtpl.rct.getTown].toString(), GRCRTtpl.rct.town) : c.linia[a].townIdB.town = RepConvTool.Adds(d.text, GRCRTtpl.rct.town) : "gp_player_link" == d.className ? (c.linia[a].townIdB.player = RepConvTool.Adds(d.text, GRCRTtpl.rct.player), c.linia[a].townIdB.playerId = JSON.parse(RepConvTool.Atob(d.hash)).id) : "gp_island_link" ==
                      d.className && (c.linia[a].islandB.island = RepConvTool.Adds((JSON.parse(RepConvTool.Atob(d.hash))[GRCRTtpl.rct.getIsland] || d.text).toString(), GRCRTtpl.rct.island), c.linia[a].islandB.islandId = JSON.parse(RepConvTool.Atob(d.hash)).id);
                    });
                    void 0 != c.linia[a].townIdB.town && (c.linia[a].townIdB.full = c.linia[a].townIdB.town);
                    void 0 != c.linia[a].islandB.island && (c.linia[a].townIdB.full = c.linia[a].islandB.island);
                    void 0 != c.linia[a].townIdB.player && (c.linia[a].townIdB.full += " (" + c.linia[a].townIdB.player + ")");
                    break;
                  case 0:
                    c.linia[a].townIdB.full = "", $.each(b[0].lastChild.data.split("\n"), function(d, b) {
                      c.linia[a].townIdB.full += " " + b.trim();
                      c.linia[a].townIdB.full = c.linia[a].townIdB.full.trim();
                    });
                }
                c.linia[a].time = $(d).find(".troops_arrive_at").html();
                c.linia[a].power = RepConvTool.getPowerIcon($(d).find("div.casted_power"));
                if ("attack_spy" == $(d).attr("data-command_type")) {
                  Ha.isChecked() ? c.linia[a].img_url = RepConvTool.Adds(RepConv.Const.unitImg + "iron.png", "img") + "  " + $(d).find("span.resource_iron_icon").html() : c.linia[a].img_url = RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), "i");
                } else {
                  if ("revolt" == $(d).attr("id").replace(/.*_(revolt).*/, "$1") && void 0 != c.linia[a].townIdA.townId) {
                    if (Ha.isChecked() && (d = ITowns.getTown(c.linia[a].townIdA.townId), void 0 != d)) {
                      c.linia[a].unit_list = "A6";
                      c.linia[a].unit_list += "|" + d.buildings().getBuildingLevel("wall").toString();
                      c.linia[a].unit_list += (1 == d.buildings().getBuildingLevel("tower") ? ".B6" : ".b6") + "|-";
                      c.linia[a].unit_list += (d.researches().get("ram") ? ".C6" : ".c6") + "|-";
                      c.linia[a].unit_list += (d.researches().get("phalanx") ? ".D6" : ".d6") + "|-";
                      c.linia[a].unit_list += (MM.checkAndPublishRawModel("PremiumFeatures", {id:Game.player_id}).get("captain") > Timestamp.server() ? ".E6" : ".e6") + "|-";
                      c.linia[a].unit_list += (MM.checkAndPublishRawModel("PremiumFeatures", {id:Game.player_id}).get("commander") > Timestamp.server() ? ".F6" : ".f6") + "|-";
                      c.linia[a].unit_list += (MM.checkAndPublishRawModel("PremiumFeatures", {id:Game.player_id}).get("priest") > Timestamp.server() ? ".G6" : ".g6") + "|-";
                      0 < c.linia[a].unit_list.length && (c.linia[a].img_url = RepConvTool.Adds((RepConv.grcrt_domain + "static/{0}{1}_32_2.png").RCFormat(GRCRTtpl.rct.sign, c.linia[a].unit_list), "img"), c.linia[a].img_url += RepConvTool.Adds((RepConv.grcrt_cdn + "ui/3/{0}.png").RCFormat(d.god() || "nogod"), "img"), c.linia[a].rt = "x");
                      try {
                        c.linia[a].img_url += "\n" + RepConvTool.GetLabel("MSGRTCSTIME") + ": ~" + readableUnixTimestamp(parseInt(za(c.linia[a].townIdB.playerId, c.linia[a].townIdA.townJSON)), "no_offset");
                      } catch (Za) {
                      }
                    }
                  } else {
                    Ha.isChecked() ? (c.linia[a].ua = [], $.each($(d).find("div.command_overview_units div.place_unit"), function(d, b) {
                      d = RepConvTool.getUnitName($(b));
                      b = {i:RepConvTool.GetUnit(d), b:$(b).find($("span.place_unit_black")).html()};
                      c.linia[a].ua.push(b);
                    })) : c.linia[a].img_url = RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), "i");
                  }
                }
              }
            }
          }
        }
      });
    }
    e(c.linia, 25, 2, 8);
  }
  function C() {
    c.title = n.parent().find($(".ui-dialog-title")).html();
    c.type = "";
    c.time = "";
    c.power = "";
    c.morale = "";
    c.luck = "";
    c.oldwall = {};
    c.nightbonus = "";
    c.attacker = {};
    c.defender = {};
    c.command = {};
    c.command.title = n.find($("div.tab_content>span")).clone();
    $(c.command.title).children().remove();
    c.command.title = $(c.command.title).html();
    0 == n.find($("ul#unit_movements")).length ? c.command.title = "\n[i]" + $_content.find($(".gpwindow_content>span")).html() + "[/i]" : (c.linia = {}, $.each(n.find($("ul#unit_movements>li")), function(a, d) {
      c.linia[a] = {};
      c.linia[a].inout = RepConvTool.Adds(RepConv.Const.staticImg + (0 == $(d).attr("class").replace(/.*(incoming).*/, "$1").length ? "out" : "in") + ".png", "img");
      c.linia[a].img = RepConvTool.Adds($(d).find($("img.command_type")).attr("src"), "img");
      var b = $(d).find("div>span.eta").html().split(":");
      b = 3600 * parseInt(b[0]) + 60 * parseInt(b[1]) + parseInt(b[2]);
      b = readableUnixTimestamp(Timestamp.server() + parseInt(b), "player_timezone", {with_seconds:!0, extended_date:!0});
      c.linia[a].time = b;
      c.linia[a].text = RepConvTool.Adds(JSON.parse(RepConvTool.Atob($(d).find($("a.gp_town_link")).attr("href")))[GRCRTtpl.rct.getTown].toString(), GRCRTtpl.rct.town);
    }));
  }
  function ta() {
    c.title = n.closest($(".js-window-main-container")).find($(".ui-dialog-title")).html();
    c.type = "";
    var a = n.find($("div#conquest")).html().split(":");
    a = 3600 * parseInt(a[0]) + 60 * parseInt(a[1]) + parseInt(a[2]);
    a = readableUnixTimestamp(Timestamp.server() + parseInt(a), "player_timezone", {with_seconds:!0, extended_date:!0});
    c.time = a;
    c.power = "";
    c.morale = "";
    c.luck = "";
    c.oldwall = {};
    c.nightbonus = "";
    c.attacker = {};
    c.defender = {};
    c.command = {};
    c.attacker.title = $(n.find($("h4"))[0]).html();
    c.attacker.player = RepConvTool.Adds(n.find($("a.gp_player_link")).html(), GRCRTtpl.rct.player);
    c.defender.town = RepConvTool.Adds(JSON.parse(RepConvTool.Atob(n.find($("a.gp_town_link")).attr("href")))[GRCRTtpl.rct.getTown].toString(), GRCRTtpl.rct.town);
    ua.isChecked() && (c.defender.town = RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), GRCRTtpl.rct.town));
    c.attacker.units_title = n.find($("div.clearfix div.bold")).html();
    ja.isChecked() ? ia("attacker", "div.report_unit", 11) : c.attacker.full = {img_url:RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), "i")};
    c.command.title = $(n.find($("h4"))[1]).html();
    c.linia = {};
    0 == n.find($("ul#unit_movements")).length ? c.command.title = "\n[i]" + (n.find($(".conquest_info_wrapper>span")).html() || "") + "[/i]" : (c.linia = {}, $.each(n.find($("ul#unit_movements>li")), function(a, d) {
      c.linia[a] = {};
      c.linia[a].inout = RepConvTool.Adds(RepConv.Const.staticImg + (0 == $(d).attr("class").replace(/.*(incoming).*/, "$1").length ? "out" : "in") + ".png", "img");
      c.linia[a].img = RepConvTool.Adds($(d).find($("img.command_type")).attr("src"), "img");
      var b = $(d).find("div>span.eta").html().split(":");
      b = 3600 * parseInt(b[0]) + 60 * parseInt(b[1]) + parseInt(b[2]);
      b = readableUnixTimestamp(Timestamp.server() + parseInt(b), "player_timezone", {with_seconds:!0, extended_date:!0});
      c.linia[a].time = b;
      var p = RepConvTool.Adds(JSON.parse(RepConvTool.Atob($($($(d).find("div")[2]).html()).eq(3).attr("href")))[GRCRTtpl.rct.getTown].toString(), GRCRTtpl.rct.town), v = RepConvTool.Adds(JSON.parse(RepConvTool.Atob($($($(d).find("div")[2]).html()).eq(5).attr("href"))).name, GRCRTtpl.rct.player), e = "(" + RepConvTool.Adds($($($(d).find("div")[2]).html()).eq(7).html(), GRCRTtpl.rct.ally) + ")" || "";
      c.linia[a].text = "";
      $.each($($($(d).find("div")[2]).html().replace(/.*<span.*span>(.*)/, "$1")), function(d, b) {
        $(b).hasClass("gp_town_link") ? c.linia[a].text += " " + p : $(b).hasClass("gp_player_link") ? c.linia[a].text += "\n" + v : void 0 != $(b).attr("onclick") ? c.linia[a].text += " " + e : 0 < $(b).text().replace(/(\(|\))/, "").trim().length && (c.linia[a].text += " " + $(b).text().trim());
      });
      a++;
    }));
  }
  function va() {
    c.title = n.find($("#place_defense .game_header")).html().stripTags() + " " + RepConvTool.Adds(GRCRTtpl.rct.outside ? Game.townName : Game.townId.toString(), GRCRTtpl.rct.town);
    c.time = "";
    c.linia = {};
    $.each(n.find($("li.place_units")), function(a, b) {
      var d = "", p = "";
      0 < $(b).children("h4").children("a.gp_town_link").length && (d = RepConvTool.Adds(JSON.parse(RepConvTool.Atob($(b).children("h4").children("a.gp_town_link").attr("href")))[GRCRTtpl.rct.getTown].toString(), GRCRTtpl.rct.town));
      0 < $(b).children("h4").children("a.gp_player_link").length && (p = RepConvTool.Adds($(b).children("h4").children("a.gp_player_link").html(), GRCRTtpl.rct.player));
      if (ua.isChecked() || Ka.isChecked()) {
        d = RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), GRCRTtpl.rct.town);
      }
      c.linia[a] = {};
      c.linia[a].titleOrg = $(b).children("h4").html();
      c.linia[a].title = "" != p ? $(b).children("h4").html().replace(/(.*)<a.*\/a>.*(<a.*\/a>).*/, "$1") + d + " (" + p + ")" : $(b).children("h4").html().replace(/(.*)<a.*\/a>/, "$1") + d;
      oa.isChecked() || ja.isChecked() ? (c.linia[a].ua = [], $.each($(b).find($(".place_unit")), function(b, d) {
        b = RepConvTool.getUnitName($(d));
        d = {i:RepConvTool.GetUnit(b), b:$(d).find($("span")).html()};
        c.linia[a].ua.push(d);
      })) : c.linia[a].img_url = RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), "i");
    });
    (oa.isChecked() || ja.isChecked()) && e(c.linia);
  }
  function ka() {
    function a(c, a) {
      RepConv.Debug && console.log("getUnitWall");
      var b = -1, d = 0, p = [];
      $.each($(a).find($("div.wall_report_unit")), function(c, a) {
        c = RepConvTool.getUnitName($(a));
        switch(Aa.getValue()) {
          case "MSGDIFF1":
            a = {i:RepConvTool.GetUnit(c), b:$(a).find($("span.place_unit_black")).html()};
            p.push(a);
            break;
          case "MSGDIFF2":
            a = {i:RepConvTool.GetUnit(c), b:$(a).find($("span.place_unit_black")).html(), g:$(a).parent().find($("div.grcrt_wall_diff")).html()};
            p.push(a);
            break;
          case "MSGDIFF3":
            "" != $(a).parent().find($("div.grcrt_wall_diff")).html() && (a = {i:RepConvTool.GetUnit(c), g:$(a).parent().find($("div.grcrt_wall_diff")).html()}, p.push(a));
        }
      });
      $.each(p, function(a, p) {
        0 == d % ("BBCODEP" == D.getValue() ? GRCRTtpl.rct.unitWall : GRCRTtpl.rct.unitWall2) && (b++, c[b] = {ua:[]});
        c[b].ua.push(p);
        d++;
      });
      e(c);
    }
    c.title = n.find($(".game_header")).html().stripTags();
    c.defeated = {};
    c.losses = {};
    c.defeated.title = "";
    c.defeated.titleAttacker = "";
    c.defeated.titleDefender = "";
    c.losses.title = "";
    c.losses.titleAttacker = "";
    c.losses.titleDefender = "";
    c.defeated.attacker = {};
    c.defeated.defender = {};
    c.losses.attacker = {};
    c.losses.defender = {};
    if (v.isChecked() || S.isChecked()) {
      c.defeated.title = n.find($("div.list_item_left h3")).html(), v.isChecked() && (c.defeated.titleAttacker = $(n.find($("div.list_item_left h4"))[0]).html().stripTags().trim(), a(c.defeated.attacker, n.find($("div.list_item_left .wall_unit_container"))[0])), S.isChecked() && (c.defeated.titleDefender = $(n.find($("div.list_item_left h4"))[1]).html().stripTags().trim(), a(c.defeated.defender, n.find($("div.list_item_left .wall_unit_container"))[1]));
    }
    if (Ia.isChecked() || La.isChecked()) {
      c.losses.title = n.find($("div.list_item_right h3")).html(), Ia.isChecked() && (c.losses.titleAttacker = $(n.find($("div.list_item_right h4"))[0]).html().stripTags().trim(), a(c.losses.attacker, n.find($("div.list_item_right .wall_unit_container"))[0])), La.isChecked() && (c.losses.titleDefender = $(n.find($("div.list_item_right h4"))[1]).html().stripTags().trim(), a(c.losses.defender, n.find($("div.list_item_right .wall_unit_container"))[1]));
    }
    var b = "emptyline_" + GRCRTtpl.rct.genImgS + "_" + GRCRTtpl.rct.genImgM;
    c.emptyline = RepConvTool.Adds(z(b), "img");
    $.ajax({type:"POST", url:RepConv.grcrt_domain + "imgdata.php", data:{param:btoa(x([{i:"null", b:""}], GRCRTtpl.rct.genImgS, GRCRTtpl.rct.genImgM)), dest:b}, dataType:"script", async:!1});
    RepConv.Debug && console.log(c);
  }
  function X() {
    RepConv.Debug && console.log("_revolt");
    if (wa.isChecked()) {
      if ("[town]" + Game.townId + "[/town]" == c.defender.town || Game.townName == c.defender.townName) {
        c.rtrevinfo = MM.getCollections().MovementsRevoltDefender[0];
        c.rtrevccount = c.rtrevinfo.length;
        c.rtcstime = "~" + readableUnixTimestamp(parseInt(za(JSON.parse(RepConvTool.Atob(n.find($("#report_sending_town .gp_player_link")).attr("href"))).id, JSON.parse(RepConvTool.Atob(n.find($("#report_receiving_town .gp_town_link")).attr("href"))))), "no_offset");
        c.rtrevolt = "";
        try {
          $.each(c.rtrevinfo.models, function(a, b) {
            a = readableUnixTimestamp(b.getFinishedAt(), "player_timezone", {extended_date:!1, with_seconds:!1});
            -1 < c.time.indexOf(a) && (c.rtrevolt = readableUnixTimestamp(b.getStartedAt(), "player_timezone", {extended_date:!0, with_seconds:!0}));
          });
        } catch (Ya) {
          c.rtrevolt = "";
        }
      } else {
        wa.check(!1), c.rtrevolt = "";
      }
    } else {
      c.rtrevolt = "";
    }
    c.rttownId = parseInt(Game.townId);
    var a = ITowns.getTown(c.rttownId);
    c.rtwall = a.buildings().getBuildingLevel("wall");
    c.rtimg = "A6";
    c.rtimg += "|" + c.rtwall.toString();
    1 == ITowns.getTown(c.rttownId).buildings().getBuildingLevel("tower") ? (c.rttower = RepConvTool.GetLabel("MSGRTYES"), c.rtimg += ".B6", c.rtdetail += ".....\u2612.") : (c.rttower = RepConvTool.GetLabel("MSGRTNO"), c.rtimg += ".b6", c.rtdetail += ".....\u2610.");
    c.rtimg += "|-";
    c.rtgod = DM.getl10n("layout").powers_menu.gods[ITowns.getTown(c.rttownId).god()];
    c.rtgodid = ITowns.getTown(c.rttownId).god() || "nogod";
    c.rtonline = Ma.isChecked() ? RepConvTool.GetLabel("MSGRTYES") : RepConvTool.GetLabel("MSGRTNO");
    ITowns.getTown(c.rttownId).researches().get("ram") ? (c.rtram = RepConvTool.GetLabel("MSGRTYES"), c.rtimg += ".C6", c.rtdetail += ".....\u2612.") : (c.rtram = RepConvTool.GetLabel("MSGRTNO"), c.rtimg += ".c6", c.rtdetail += ".....\u2610.");
    c.rtimg += "|-";
    ITowns.getTown(c.rttownId).researches().get("phalanx") ? (c.rtphalanx = RepConvTool.GetLabel("MSGRTYES"), c.rtimg += ".D6", c.rtdetail += ".....\u2612.") : (c.rtphalanx = RepConvTool.GetLabel("MSGRTNO"), c.rtimg += ".d6", c.rtdetail += ".....\u2610.");
    c.rtimg += "|-";
    c.rtpremium = [];
    MM.checkAndPublishRawModel("PremiumFeatures", {id:Game.player_id}).get("captain") > Timestamp.server() ? (c.rtpremium.captain = RepConvTool.GetLabel("MSGRTYES"), c.rtimg += ".E6", c.rtdetail += ".....\u2612.") : (c.rtpremium.captain = RepConvTool.GetLabel("MSGRTNO"), c.rtimg += ".e6", c.rtdetail += ".....\u2610.");
    c.rtimg += "|-";
    MM.checkAndPublishRawModel("PremiumFeatures", {id:Game.player_id}).get("commander") > Timestamp.server() ? (c.rtpremium.commander = RepConvTool.GetLabel("MSGRTYES"), c.rtimg += ".F6", c.rtdetail += ".....\u2612.") : (c.rtpremium.commander = RepConvTool.GetLabel("MSGRTNO"), c.rtimg += ".f6", c.rtdetail += ".....\u2610.");
    c.rtimg += "|-";
    MM.checkAndPublishRawModel("PremiumFeatures", {id:Game.player_id}).get("priest") > Timestamp.server() ? (c.rtpremium.priest = RepConvTool.GetLabel("MSGRTYES"), c.rtimg += ".G6", c.rtdetail += ".....\u2612.") : (c.rtpremium.priest = RepConvTool.GetLabel("MSGRTNO"), c.rtimg += ".g6", c.rtdetail += ".....\u2610.");
    c.rtimg += "|-";
    c.rtlabels = [];
    c.rtlabels.wall = GameData.buildings.wall.name;
    c.rtlabels.tower = GameData.buildings.tower.name;
    c.rtlabels.god = RepConvTool.GetLabel("MSGRTGOD");
    c.rtlabels.cstime = RepConvTool.GetLabel("MSGRTCSTIME");
    c.rtlabels.online = RepConvTool.GetLabel("MSGRTONL");
    c.rtlabels.ram = GameData.researches.ram.name;
    c.rtlabels.phalanx = GameData.researches.phalanx.name;
    c.rtlabels.captain = Game.premium_data.captain.name;
    c.rtlabels.commander = Game.premium_data.commander.name;
    c.rtlabels.priest = Game.premium_data.priest.name;
    c.unit_movements = {support:0, attack:0};
    MM.getCollections().Support && MM.getCollections().Support[0] && MM.getCollections().Support[0].getIncomingSupportsForTown(Game.townId) && $.each(MM.getCollections().Support[0].getIncomingSupportsForTown(Game.townId), function(a, b) {
      c.unit_movements.support += 1 == b.get("incoming") ? 1 : 0;
    });
    MM.getCollections().Attack && MM.getCollections().Attack[0] && MM.getCollections().Attack[0].getIncomingAttacksForTown(Game.townId) && $.each(MM.getCollections().Attack[0].getIncomingAttacksForTown(Game.townId), function(a, b) {
      c.unit_movements.attack += 1 == b.get("incoming") ? 1 : 0;
    });
  }
  function da() {
    RepConv.Debug && console.log("_fight");
    g();
    l();
    q();
    m();
    w();
    J();
    W();
    c.attacker = K();
    c.defender = K();
    c.attacker = E(c.attacker, n.find($("#report_sending_town")));
    c.defender = E(c.defender, n.find($("#report_receiving_town")));
    c.powerAtt = "";
    $.each(n.find($("div.report_side_attacker div.report_power")), function(a, b) {
      c.powerAtt += RepConvTool.getPowerIcon($(b));
    });
    c.powerDef = "";
    $.each(n.find($("div.report_side_defender div.report_power")), function(a, b) {
      c.powerDef += RepConvTool.getPowerIcon($(b));
    });
    "attackSupport" == T ? oa.isChecked() ? ha("defender", "div.report_side_attacker_unit") : (c.defender.full = {img_url:RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), "i")}, c.defender.splits = {1:{img_url:RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), "i")}}, c.powerDef = "") : (ja.isChecked() ? ha("attacker", "div.report_side_attacker_unit") : (c.attacker.full = {img_url:RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), "i")}, c.attacker.splits = {1:{img_url:RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"),
    "i")}}, c.powerAtt = ""), oa.isChecked() ? ha("defender", "div.report_side_defender_unit") : (c.defender.full = {img_url:RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), "i")}, c.defender.splits = {1:{img_url:RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), "i")}}, c.powerDef = ""));
    U();
    H();
  }
  function pa() {
    RepConv.Debug && console.log("_raise");
    g();
    l();
    q();
    m();
    w();
    J();
    W();
    c.attacker = K();
    c.defender = K();
    c.attacker = E(c.attacker, n.find($("#report_sending_town")));
    c.defender = E(c.defender, n.find($("#report_receiving_town")));
    c.powerAtt = "";
    $.each(n.find($("div.report_side_attacker div.report_power")), function(a, b) {
      c.powerAtt += RepConvTool.getPowerIcon($(b));
    });
    c.powerDef = "";
    $.each(n.find($("div.report_side_defender div.report_power")), function(a, b) {
      c.powerDef += RepConvTool.getPowerIcon($(b));
    });
    ja.isChecked() ? ha("attacker", "#left_side div.report_side_attacker_unit") : (c.attacker.full = {img_url:RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), "i")}, c.attacker.splits = {1:{img_url:RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), "i")}}, c.powerAtt = "");
    oa.isChecked() ? ha("defender", "#right_side div.report_side_attacker_unit") : (c.defender.full = {img_url:RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), "i")}, c.defender.splits = {1:{img_url:RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), "i")}}, c.powerDef = "");
    U();
    H();
  }
  function ea() {
    c.title = O.parent().parent().find($("span.ui-dialog-title")).html();
    c.time = "";
    c.back = 1 == n.find($(".command_icon_wrapper img")).length;
    c.detail = {};
    c.attacker = K();
    c.defender = K();
    c.ret = 0 < n.find($("div.return")).length;
    c.farm = 1 < n.find($(".command_icon_wrapper img")).length && n.find($(".command_icon_wrapper img")).attr("src").match(/.*\/(farm).*/) || 1 == n.find($("div.report_town_bg_quest")).length ? !0 : !1;
    c.back || (c.attacker = E(c.attacker, n.find($("div.attacker"))));
    c.defender = E(c.defender, n.find($("div.defender")));
    c.detail.time_title = n.find($("fieldset.command_info_time legend")).html();
    c.detail.time_time = n.find($("fieldset.command_info_time .arrival_time")).html();
    c.attacker.units_title = 0 == n.find($(".grcrt_wisdom")).length ? n.find($("fieldset.command_info_units legend")).html() : n.find($("fieldset.command_info_units .grcrt_wisdom h4")).html();
    c.detail.power_title = n.find($("fieldset.command_info_casted_powers legend")).html();
    c.detail.power_img = "";
    ja.isChecked() ? (ia("attacker", 0 == n.find($(".grcrt_wisdom")).length ? "div.index_unit" : "div.report_unit", 5), $.each(n.find($("fieldset.command_info_casted_powers div.index_town_powers")), function(a, b) {
      c.detail.power_img += RepConvTool.getPowerIcon($(b));
    }), 0 != n.find($(".grcrt_wisdom")).length && (c.detail.power_img = RepConvTool.Adds(RepConv.Const.uiImg + "pm/wisdom.png", "img"))) : c.attacker.full = {img_url:RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), "i")};
    c.resources = ya();
    c.resources.title = 0 == n.find($("fieldset.command_info_res legend")).length ? "" : n.find($("fieldset.command_info_res legend")).html();
    $.each(n.find($("div#command_booty li.res_background div")), function(a, b) {
      switch(b.className) {
        case "wood_img":
          a = {i:"S1", b:$(b).nextAll().text()};
          c.resources.ua.push(a);
          c.resources.wood = $(b).nextAll().text();
          break;
        case "stone_img":
          a = {i:"S2", b:$(b).nextAll().text()};
          c.resources.ua.push(a);
          c.resources.stone = $(b).nextAll().text();
          break;
        case "iron_img":
          a = {i:"S3", b:$(b).nextAll().text()};
          c.resources.ua.push(a);
          c.resources.iron = $(b).nextAll().text();
          break;
        case "favor_img":
          a = {i:"S4", b:$(b).nextAll().text()}, c.resources.ua.push(a), c.resources.power = $(b).nextAll().text();
      }
    });
    f(c.resources, 30, GRCRTtpl.rct.genImgM + 5, 10);
    c.bunt = "";
    try {
      c.reportImage = n.find($(".command_icon_wrapper img")).attr("src").replace(/.*\/([^\/]*)\.png/, "$1");
    } catch (Q) {
    }
  }
  function xa() {
    var a = 0;
    c.title = b.getTitle() + " (" + (GRCRTtpl.rct.outside ? RepConvTool.Adds(b.getJQElement().find($(".island_info>h4")).html(), GRCRTtpl.rct.island) : RepConvTool.Adds(b.getHandler().island.id.toString(), GRCRTtpl.rct.island)) + ")";
    c.time = "";
    c.header = GRCRTtpl.rct.outside ? RepConvTool.Adds(b.getJQElement().find($(".island_info>h4")).html(), GRCRTtpl.rct.island) : RepConvTool.Adds(b.getHandler().island.id.toString(), GRCRTtpl.rct.island);
    c.header += "\n";
    c.header += b.getJQElement().find($(".islandinfo_coords")).justtext().trim() + "\n";
    c.header += b.getJQElement().find($(".islandinfo_free")).justtext().trim();
    c.linia = {};
    $.each(b.getJQElement().find($(".island_info_left .game_list:visible li")), function(b, d) {
      b = c.linia;
      var p = ++a;
      RepConv.Debug && console.log("_islandRow");
      var v = $(d).children();
      d = {col1:RepConvTool.Adds(JSON.parse(RepConvTool.Atob(v.eq(0).attr("href")))[GRCRTtpl.rct.getTown].toString(), GRCRTtpl.rct.town), col2:v.eq(1).html(), col3:0 < $(v).eq(2).children("a.gp_player_link").length ? RepConvTool.Adds(JSON.parse(RepConvTool.Atob($(v).eq(2).children("a.gp_player_link").attr("href"))).name, GRCRTtpl.rct.player) : $(v).eq(2).justtext()};
      0 < $(v).eq(2).children("a.gp_player_link").length && (v = JSON.parse(RepConvTool.Atob($(v).eq(2).children("a.gp_player_link").attr("href"))), RepConvTool.getPlayerData(v.id) && "" != RepConvTool.getPlayerData(v.id).alliance_id && (d.col4 = RepConvTool.Adds(RepConvTool.getAllianceData(RepConvTool.getPlayerData(v.id).alliance_id).name, GRCRTtpl.rct.ally)));
      b[p] = d;
    });
  }
  function Da() {
    var a = 0;
    c.title = b.getTitle();
    c.time = "";
    c.header = RepConvTool.Adds(b.getJQElement().find($("#player_info h3")).justtext(), GRCRTtpl.rct.player);
    c.header += 0 < b.getJQElement().find($("#player_info>a")).length ? " (" + RepConvTool.Adds(b.getJQElement().find($("#player_info>a")).attr("onclick").replace(/.*\('(.*)'.*/, "$1"), GRCRTtpl.rct.ally) + ")" : "";
    c.linia = {};
    $.each(b.getJQElement().find($("#player_towns ul.game_list li")), function(b, d) {
      b = c.linia;
      var p = ++a;
      RepConv.Debug && console.log("_townsRow");
      d = $(d).children();
      d = {col1:RepConvTool.Adds(JSON.parse(RepConvTool.Atob(d.eq(1).attr("href")))[GRCRTtpl.rct.getTown].toString(), GRCRTtpl.rct.town), col2:d.eq(2).html().split("|")[0].trim(), col3:d.eq(2).html().split("|")[1].trim()};
      b[p] = d;
    });
  }
  function Z() {
    var a = 0;
    c.title = b.getTitle();
    c.time = "";
    c.header = RepConvTool.Adds(b.getTitle(), GRCRTtpl.rct.ally);
    c.linia = {};
    $.each(b.getJQElement().find($("#ally_towns ul.members_list>li:nth-child(2) ul li")), function(b, d) {
      b = c.linia;
      var p = ++a;
      RepConv.Debug && console.log("_playersRow");
      d = {col1:RepConvTool.Adds(JSON.parse(RepConvTool.Atob($(d).find("a.gp_player_link").attr("href"))).name, GRCRTtpl.rct.player), col2:$(d).find("div.small-descr").html().replace(/^\s*|\s(?=\s)|\t|\s*$/g, "").split(",")[0].trim(), col3:$(d).find("div.small-descr").html().replace(/^\s*|\s(?=\s)|\t|\s*$/g, "").split(",")[1].trim()};
      b[p] = d;
    });
  }
  function Y() {
    "BBCODEA" != B.getValue() && na.show();
    Ba.hide();
    $("#grcrt_pagination").show();
    $("#grcrt_pagination .pages").html(qa + 1 + "/" + (Na + 1));
    Qa.disable(0 == qa);
    Ra.disable(qa == Na);
    Va = Ea.splits[qa];
    h(Va);
  }
  function aa() {
    function b(c, b, d) {
      $.each(c, function(c, p) {
        switch(p) {
          case "MSGATTUNIT":
            ja = a(p, d);
            b.append(ja);
            break;
          case "MSGRESOURCE":
            Sa = a(p, d);
            b.append(Sa);
            break;
          case "MSGHIDAT":
            ua = a(p, d);
            b.append(ua);
            break;
          case "MSGHIDDE":
            Ka = a(p, d);
            b.append(Ka);
            break;
          case "MSGDEFUNIT":
            oa = a(p, d);
            b.append(oa);
            break;
          case "MSGRTSHOW":
            wa = a(p, d);
            wa.on("cbx:check", function() {
              wa.isChecked() || Ma.check(!1);
            });
            b.append(wa);
            break;
          case "MSGRTONLINE":
            Ma = a(p, d);
            b.append(Ma);
            break;
          case "MSGUNITS":
            Wa = a(p, d);
            b.append(Wa);
            break;
          case "MSGBUILD":
            Oa = a(p, d);
            b.append(Oa);
            break;
          case "MSGUSC":
            Ja = a(p, d);
            b.append(Ja);
            break;
          case "MSGRAW":
            Ta = a(p, d);
            b.append(Ta);
            break;
          case "MSGDETAIL":
            Ha = a(p, d);
            b.append(Ha);
            break;
          case "MSGSHOWCOST":
            Ua = a(p, d);
            b.append(Ua);
            break;
          default:
            RepConv.Debug && console.log(p);
        }
      });
    }
    var v = $("<div/>", {id:"publish_report_options1"}), e = $("<div/>", {id:"publish_report_options2"});
    $("<div/>", {id:"publish_report_options3"});
    var g = $("<div/>", {id:"publish_report_options4"}), h = {}, f = {}, B = {}, S = RepConvTool.RamkaLight(RepConvTool.GetLabel("MSGQUEST"), v), r = RepConvTool.RamkaLight(RepConvTool.GetLabel("MSGHIDAD"), e), D = RepConvTool.RamkaLight(RepConvTool.GetLabel("MSGRTLBL"), g);
    $(r).attr("style", "width: 50%; float:right;");
    $(D).attr("style", "clear: both; top: 10px");
    RepConv.Debug && console.log("_reportType=" + T);
    switch(T) {
      case "command":
        d = "attack";
        h = ["MSGATTUNIT", "MSGRESOURCE"];
        f = ["MSGHIDAT", "MSGHIDDE"];
        break;
      case "breach":
      case "attack":
        d = "attack";
        h = ["MSGATTUNIT", "MSGDEFUNIT", "MSGRESOURCE", "MSGSHOWCOST"];
        f = ["MSGHIDAT", "MSGHIDDE", ""];
        break;
      case "take_over":
        d = "attack";
        h = ["MSGATTUNIT", "MSGDEFUNIT", "MSGRESOURCE", "MSGSHOWCOST"];
        f = ["MSGHIDAT", "MSGHIDDE", ""];
        H();
        Ca(n.find($("#report_receiving_town"))).playerName == Game.player_name && "" != c.bunt && (B = ["MSGRTSHOW", "MSGRTONLINE"]);
        break;
      case "espionage":
        d = "espionage";
        h = ["MSGUNITS", "MSGBUILD", "MSGUSC", "MSGRAW"];
        f = ["MSGHIDAT", "MSGHIDDE", "", ""];
        break;
      case "commandList":
        d = "attack";
        h = ["MSGDETAIL"];
        f = {};
        break;
      case "conquer":
      case "illusion":
        d = "attack";
        h = {};
        f = ["MSGHIDAT", "MSGHIDDE"];
        break;
      case "conquest":
      case "conquerold":
        d = "attack";
        h = ["MSGATTUNIT"];
        f = ["MSGHIDDE"];
        break;
      case "attackSupport":
        d = "attack";
        h = ["MSGDEFUNIT", "MSGSHOWCOST"];
        f = ["MSGHIDAT", "MSGHIDDE"];
        break;
      case "support":
        d = "support";
        h = ["MSGATTUNIT", ""];
        f = ["MSGHIDAT", "MSGHIDDE"];
        break;
      case "agoraD":
        d = "support";
        h = ["MSGDEFUNIT"];
        f = ["MSGHIDAT"];
        break;
      case "agoraS":
        d = "support";
        h = ["MSGATTUNIT"];
        f = ["MSGHIDDE"];
        break;
      case "powers":
        d = "attack";
        h = {};
        f = ["MSGHIDDE"];
        break;
      case "raise":
        d = "attack";
        h = ["MSGATTUNIT", "MSGDEFUNIT"];
        f = ["MSGHIDAT", "MSGHIDDE"];
        break;
      case "found":
        d = "attack";
        h = {};
        f = ["MSGHIDAT"];
        break;
      case "conqueroldtroops":
        d = "attack";
        h = {};
        f = {};
        break;
      default:
        d = "attack", h = {}, f = {};
    }
    switch(Math.max(h.length || 0, f.length || 0)) {
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
    p -= 0 < B.length ? 71 : 0;
    RepConv.Lang.ATTACKER = RepConvTool.GetLabel("LABELS." + d + ".ATTACKER");
    RepConv.Lang.DEFENDER = RepConvTool.GetLabel("LABELS." + d + ".DEFENDER");
    RepConv.Lang.MSGHIDAT = RepConvTool.GetLabel("LABELS." + d + ".MSGHIDAT");
    RepConv.Lang.MSGHIDDE = RepConvTool.GetLabel("LABELS." + d + ".MSGHIDDE");
    RepConv.Lang.MSGATTUNIT = RepConvTool.GetLabel("LABELS." + d + ".MSGATTUNIT");
    RepConv.Lang.MSGDEFUNIT = RepConvTool.GetLabel("LABELS." + d + ".MSGDEFUNIT");
    RepConv.Debug && console.log(RepConv.Lang.ATTACKER);
    RepConv.Debug && console.log(RepConv.Lang.LABELS[d].ATTACKER);
    RepConv.Debug && console.log(d);
    b(h, v, !0);
    b(f, e, !1);
    b(B, g, !0);
    try {
      var l = JSON.parse(RepConvTool.Atob(n.find($("#report_receiving_town .gp_town_link")).attr("href")));
      g.append($("<div/>", {id:"GRCRT_block", rel:l.id}).css("position", "absolute").css("top", "18px").css("background-color", "rgb(255, 0, 0)").css("width", "801px").css("height", "32px").css("color", "white").css("font-weight", "bold").css("padding", "2px").css("text-align", "center").css("display", l.id == Game.townId ? "none" : "block").html(RepConvTool.GetLabel("MSGRTERR") + l.name));
    } catch ($a) {
    }
    0 < h.length && 0 < f.length ? ($(S).attr("style", "width: 50%; float:left;"), $(r).attr("style", "width: 50%; float:left;")) : 0 < h.length ? ($(S).attr("style", "clear: both; top: 10px;"), $(r).attr("style", "display: none")) : 0 < f.length ? ($(S).attr("style", "display: none"), $(r).attr("style", "clear: both; top: 10px;")) : ($(S).attr("style", "display: none"), $(r).attr("style", "display: none"));
    V.append(S);
    V.append(r);
    0 < B.length && n.find($("#report_receiving_town .gp_player_link")).html() == Game.player_name && V.append(D);
  }
  function fa() {
    v = a("MSGASATTDEF", !0, "MSGASATT");
    S = a("MSGASDEFDEF", !0, "MSGASDEF");
    Ia = a("MSGASATTLOS", !0, "MSGASATT");
    La = a("MSGASDEFLOS", !0, "MSGASDEF");
    Aa = $("<div/>", {"class":"radiobutton"}).radiobutton({value:"MSGDIFF2", template:"tpl_radiobutton", options:[{value:"MSGDIFF1", name:RepConvTool.GetLabel("MSGDIFF1")}, {value:"MSGDIFF2", name:RepConvTool.GetLabel("MSGDIFF2")}, {value:"MSGDIFF3", name:RepConvTool.GetLabel("MSGDIFF3")}]}).on("rb:change:value", function() {
      RepConv.Debug && console.log("rShowDiff=" + Aa.getValue());
      ba();
    });
    var c = $("<div/>").append($("<fieldset/>", {id:"publish_report_options_group_1L", style:"width:46%; float: left; border : 0px;"}).append($("<legend/>").html(RepConvTool.GetLabel("MSGDEFSITE"))).append(v).append(S)).append($("<fieldset/>", {id:"publish_report_options_group_1R", style:"width:46%; float: right; border : 0px;"}).append($("<legend/>").html(RepConvTool.GetLabel("MSGLOSSITE"))).append(Ia).append(La)).append($("<div/>", {style:"width: 100%; text-align: center; clear: both;"}).append(Aa));
    0 == O.find($("div.grcrt_wall_diff")).length && (Aa.setValue("MSGDIFF1"), Aa.disable());
    c = RepConvTool.RamkaLight(RepConvTool.GetLabel("MSGQUEST"), c, 125);
    V.append(c);
  }
  function ba() {
    try {
      1 == $("#repConvArea").length && $("#repConvArea").remove(), 1 == $("#RepConvDivPrev").length && $("#RepConvDivPrev").remove(), $("#RepConvBtns div.RepConvMsg").html(""), Pa.show(), Ba.hide(), na.hide(), $("#grcrt_pagination").hide();
    } catch (Q) {
      RepConv.Debug && console.log(Q);
    }
  }
  function ra() {
    var c = $("<div/>").append(B).append(D);
    c = RepConvTool.RamkaLight(RepConvTool.GetLabel("MSGFORUM"), c, 120);
    $(c).attr("style", "clear: both; top: 10px");
    V.append(c);
  }
  function F() {
    Pa = RepConvTool.AddBtn("BTNGENER");
    Ba = RepConvTool.AddBtn("BTNVIEW");
    na = RepConvTool.AddBtn("BTNVIEWBB");
    Qa = $("<div/>", {"class":"button_arrow left"}).button();
    Ra = $("<div/>", {"class":"button_arrow right"}).button();
    $("<div/>", {id:"grcrt_pagination", "class":"slider grepo_slider"}).css({width:"70px", "float":"right", padding:"2px 5px", "text-align":"center", display:"inline-block"}).append(Qa.css("float", "left").click(function() {
      0 < qa && (qa--, Y());
    })).append($("<div/>", {"class":"pages", style:"float: left; width: 40px; padding-top: 3px;"}).html("")).append(Ra.css("float", "left").click(function() {
      qa < Na && (qa++, Y());
    })).hide().appendTo(window.RepConvOptionsWnd.getJQElement().find($("#RepConvBtns")));
    Pa.click(function() {
      na.show();
      Ba.hide();
      RepConv.Debug && console.log("_generateReport");
      $("#RepConvBtns div.RepConvMsg").html("");
      "BBCODEE" == B.getValue() ? (GRCRTtpl.rct = GRCRTtpl.rcts.E, na.show()) : "BBCODEI" == B.getValue() ? (GRCRTtpl.rct = GRCRTtpl.rcts.I, na.show()) : (GRCRTtpl.rct = GRCRTtpl.rcts.A, na.hide());
      Pa.hide();
      RepConv.Debug && console.log("btns");
      switch(T) {
        case "command":
          ea();
          break;
        case "breach":
        case "attack":
          da();
          break;
        case "take_over":
          da();
          c.showRT = wa.isChecked();
          wa.isChecked() && X();
          break;
        case "attackSupport":
          RepConv.Debug && console.log("_attackSupport");
          g();
          l();
          q();
          m();
          w();
          J();
          W();
          c.attacker = K();
          c.defender = K();
          c.attacker = E(c.attacker, n.find($("#report_sending_town")));
          c.defender = E(c.defender, n.find($("#report_receiving_town")));
          c.powerAtt = "";
          c.powerDef = "";
          oa.isChecked() ? ha("defender", "div.support_report_summary div.report_units.report_side_defender div.report_side_defender_unit") : (c.defender.full = {img_url:RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), "i")}, c.defender.splits = {1:{img_url:RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), "i")}});
          c.bunt = "";
          break;
        case "espionage":
          g();
          q();
          c.morale = "";
          c.luck = "";
          c.oldwall = {};
          c.nightbonus = "";
          c.attacker = K();
          c.defender = K();
          c.attacker = E(c.attacker, n.find($("#report_sending_town")));
          c.defender = E(c.defender, n.find($("#report_receiving_town")));
          c.defender.title = n.find($("div#left_side>h4")).html() || n.find($("div#left_side>p")).html();
          c.defender.success = 0 != n.find($("div#left_side>h4")).length;
          ia("defender", "div#left_side>div.report_unit", 9);
          c.build = {};
          c.build.title = n.find($("div#spy_buildings>h4")).html();
          Ga("build", "div#spy_buildings>div.report_unit", 9);
          c.iron = {};
          0 < n.find($("div#right_side>h4")).length ? c.iron.title = n.find($("div#right_side>h4"))[0].innerHTML : 0 < n.find($("div#right_side>p")).length ? c.iron.title = n.find($("div#right_side>p"))[0].innerHTML.replace(/(.*:).*/, "$1") : c.iron.title = n.find($("div#report_game_body>div>p")).html().trim();
          c.iron.count = 0 < n.find($("div#right_side")).length ? n.find($("#payed_iron span")).html() || n.find($("div#right_side>p"))[0].innerHTML.replace(/.*:([0-9]*)/, "$1").trim() : "";
          U();
          c.resources.title = n.find($("#right_side>#resources")).prev().html();
          "" != c.iron.count && (c.iron.count = RepConvTool.AddSize(c.iron.count, 8));
          break;
        case "commandList":
          N();
          break;
        case "conqueroldtroops":
          C();
          break;
        case "conquerold":
          RepConv.Debug && console.log("_conquerOld");
          c.title = n.find($("#conqueror_units_in_town>span")).html();
          c.time = n.find($("div.clearfix"))[0].innerHTML.stripTags().trim().replace(/\n/gi, "").replace(/.*(\(.*\)).*/, "$1");
          c.attacker = {};
          c.defender = {};
          c.defender.town = RepConvTool.Adds(JSON.parse(RepConvTool.Atob(n.find($("div.clearfix a.gp_town_link")).attr("href")))[GRCRTtpl.rct.getTown].toString(), GRCRTtpl.rct.town);
          c.defender.townName = n.find($("div.clearfix a.gp_town_link")).html();
          c.defender.player = RepConvTool.Adds(n.find($("div.clearfix a.gp_player_link")).html(), GRCRTtpl.rct.player);
          c.defender.playerName = n.find($("div.clearfix a.gp_player_link")).html();
          null == c.defender.player && (c.defender.player = "", c.defender.playerName = "");
          ua.isChecked() && (c.defender.town = RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), GRCRTtpl.rct.town));
          c.attacker.units_title = n.find($("div.clearfix div.bold")).html();
          ja.isChecked() ? ia("attacker", "div.index_unit", 11) : c.attacker.full = {img_url:RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), "i")};
          RepConv.Debug && console.log(c);
          break;
        case "support":
          g();
          l();
          q();
          m();
          w();
          J();
          W();
          c.attacker = K();
          c.attacker = E(c.attacker, n.find($("#report_sending_town")));
          c.defender = E(c.defender, n.find($("#report_receiving_town")));
          c.power = 0 == n.find($("div.report_power")).length ? "" : RepConvTool.Adds(RepConv.Const.staticImg + n.find($("div.report_power")).attr("id") + "_30x30.png", "img");
          ja.isChecked() ? ia("attacker", "div.report_unit", 10) : c.attacker.full = {img_url:RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), "i")};
          break;
        case "agoraS":
        case "agoraD":
          va();
          break;
        case "powers":
          g();
          q();
          c.attacker = E(c.attacker, n.find($("#report_sending_town")));
          c.defender = E(c.defender, n.find($("#report_receiving_town")));
          c.morale = "";
          c.luck = "";
          c.oldwall = {};
          c.nightbonus = "";
          c.efekt = {};
          c.type = -1;
          c.resources = {};
          c.power = RepConvTool.Adds(RepConv.Const.staticImg + n.find($("div#report_power_symbol")).attr("class").replace(/power_icon86x86 (.*)/, "$1") + "_30x30.png", "img");
          c.powerinfo = {};
          c.powerinfo.id = n.find($("div#report_power_symbol")).attr("class").replace(/power_icon86x86 (.*)/, "$1");
          switch(c.powerinfo.id) {
            case "happiness":
            case "fertility_improvement":
            case "bolt":
            case "earthquake":
            case "call_of_the_ocean":
            case "town_protection":
            case "cap_of_invisibility":
              c.type = 1;
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
              c.type = 2;
              break;
            case "kingly_gift":
            case "wedding":
            case "underworld_treasures":
            case "wedding_of_the_aristocrats":
            case "natures_gift":
              c.type = 3;
              break;
            case "fair_wind":
            case "strength_of_heroes":
            case "desire":
            case "pest":
            case "summoning_of_the_nereids":
            case "help_of_the_nereids":
              c.type = 4;
              break;
            case "cleanse":
              c.type = 5;
          }c.powerinfo.name = GameData.powers[c.powerinfo.id].name;
          c.powerinfo.description = n.find($("div#left_side>p")).html();
          c.efekt.title = n.find($("div#left_side h4")).html();
          switch(c.type) {
            case 1:
              c.efekt.detail = n.find($("#right_side p")).html().stripTags().trim();
              break;
            case 2:
              c.efekt.detail = n.find($("#right_side h4")).html();
              c.resources = K();
              ia("resources", "#right_side div.report_unit", 5);
              break;
            case 3:
              c.efekt.detail = n.find($("#report_result")).html();
              U();
              break;
            case 5:
              if (0 < n.find($(".power_icon")).length) {
                var a = n.find($(".power_icon")).attr("name");
                c.efekt.detail = GameData.powers[a].name;
                c.resources = K();
                c.resources.img_url = RepConvTool.Adds(RepConv.Const.uiImg + "8/" + a + ".png", "img");
              }
          }break;
        case "raise":
          pa();
          break;
        case "wall":
          ka();
          break;
        case "illusion":
        case "conquer":
        case "found":
          g();
          l();
          q();
          c.morale = "";
          c.luck = "";
          c.oldwall = {};
          c.nightbonus = "";
          c.attacker = E(c.attacker, n.find($("#report_sending_town")));
          c.defender = E(c.defender, n.find($("#report_receiving_town")));
          a = 0 == n.find($("#report_game_body p a.gp_town_link")).length ? "" : RepConvTool.Adds(JSON.parse(RepConvTool.Atob(n.find($("#report_game_body p a.gp_town_link")).attr("href")))[GRCRTtpl.rct.getTown].toString(), GRCRTtpl.rct.town);
          var d = 0 == n.find($("#report_game_body p a.gp_player_link")).length ? "" : RepConvTool.Adds(n.find($("#report_game_body p a.gp_player_link")).html(), GRCRTtpl.rct.player);
          c.detail = n.find($("#report_game_body p")).html().trim().replace(/<a[^\/]*gp_player_link[^\/]*\/a>/, d).replace(/<a[^\/]*gp_town_link[^\/]*\/a>/, a);
          break;
        case "conquest":
          ta();
          break;
        case "academy":
          ma();
          break;
        case "ownTropsInTheCity":
          c.title = GRCRTtpl.rct.outside ? RepConvTool.Adds(n.closest($(".ui-dialog-title")).html(), GRCRTtpl.rct.town) : RepConvTool.Adds(b.getHandler().target_id.toString(), GRCRTtpl.rct.town);
          c.title += ": " + n.find($(".support_details_box .game_header")).html().stripTags();
          c.time = "";
          c.defender = {};
          c.defender.full = R();
          c.defender.full.img_url = n.find($(".no_results")).html();
          ia("defender", ".support_details_box .units_list .unit_icon25x25", 11);
          0 == c.defender.full.ua.length && (c.defender.full.img_url = n.find($(".no_results")).html());
          break;
        case "bbcode_island":
          xa();
          break;
        case "bbcode_player":
          Da();
          break;
        case "bbcode_alliance":
          Z();
          break;
        case "main":
          P();
      }
      RepConv.Debug && console.log(c);
      try {
        c.showCost = Ua.isChecked() || !1;
      } catch (Fa) {
      }
      if (ua.isChecked()) {
        try {
          c.attacker.town = RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), GRCRTtpl.rct.town), c.title = c.title.replace(" (" + c.attacker.playerName + ")", ""), c.title = c.title.replace(c.attacker.townName, c.attacker.playerName);
        } catch (Fa) {
        }
      }
      if (Ka.isChecked()) {
        try {
          c.defender.town = RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), GRCRTtpl.rct.town), c.title = c.title.replace(" (" + c.defender.playerName + ")", ""), c.title = c.title.replace(c.defender.townName, c.defender.playerName);
        } catch (Fa) {
        }
      }
      if (!Sa.isChecked() && !Ta.isChecked() && "powers" != T && "raise" != T) {
        try {
          c.resources.img_url = RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), "i");
        } catch (Fa) {
        }
      }
      if (!Ja.isChecked()) {
        try {
          c.iron.count = RepConvTool.Adds(RepConvTool.GetLabel("HIDDEN"), "i");
        } catch (Fa) {
        }
      }
      try {
        c.reportImage = u(n.find($("div#report_arrow img")).attr("src"));
      } catch (Fa) {
      }
      Ea = GRCRTtpl.report("BBCODEP" == D.getValue() ? "txt" : "tbl", T, c);
      qa = 0;
      Na = Object.size(Ea.splits) - 1;
      RepConv.__repconvValueArray = Ea.splits;
      RepConv.__repconvValueBBCode = Ea.single;
      r(Ea.splits, "");
      $("#grcrt_pagination").show();
      Y();
      "BBCODEI" == B.getValue() && $("#grcrt_pagination").hide();
    }).appendTo(window.RepConvOptionsWnd.getJQElement().find($("#RepConvBtns")));
    Ba.hide().click(function() {
      0 < $("#repConvArea").length && ($("#repConvArea").slideToggle(), $("#RepConvDivPrev").slideToggle(), na.show(), Ba.hide());
    }).appendTo(window.RepConvOptionsWnd.getJQElement().find($("#RepConvBtns")));
    na.hide().click(function() {
      0 < $("#repConvArea").length && ($("#repConvArea").slideToggle(), $("#RepConvDivPrev").slideToggle(), Ba.show(), na.hide());
    }).appendTo(window.RepConvOptionsWnd.getJQElement().find($("#RepConvBtns")));
    $("<div/>", {"class":"RepConvMsg", style:"float: left; margin: 5px;"}).appendTo(window.RepConvOptionsWnd.getJQElement().find($("#RepConvBtns")));
    window.RepConvOptionsWnd.getJQElement().find($("#RepConvBtns")).css("display", "block");
  }
  if ("object" == typeof b) {
    RepConv.Debug && console.log("wnd.type=" + b.getType());
    var I = "undefined" == typeof b.getID, O = I ? $("#window_" + b.getIdentifier()) : $("#gpwnd_" + b.getID()), n = I ? O.find("div.window_content") : O, T = k(b);
    $("<br/>", {style:"clear:both;"});
    var V = $("<div/>", {style:"margin-top: 3px"}), d = "attack", p = 225, c = {}, B = $("<div/>", {"class":"radiobutton"}).radiobutton({value:"BBCODEA", template:"tpl_radiobutton", options:[{value:"BBCODEA", name:RepConvTool.GetLabel("BBALLY")}, {value:"BBCODEE", name:RepConvTool.GetLabel("BBFORUM")}, {value:"BBCODEI", name:RepConvTool.GetLabel("BBIMG")}]}).on("rb:change:value", function() {
      RepConv.Debug && console.log("rBbcode=" + B.getValue());
      ba();
    }), D = $("<div/>", {"class":"radiobutton"}).radiobutton({value:RepConv.active.reportFormat ? "BBCODEH" : "BBCODEP", template:"tpl_radiobutton", options:[{value:"BBCODEP", name:RepConvTool.GetLabel("BBTEXT")}, {value:"BBCODEH", name:RepConvTool.GetLabel("BBHTML")}]}).on("rb:change:value", function() {
      RepConv.Debug && console.log("rBbcodeType=" + D.getValue());
      ba();
    }), v, S, Ia, La, Aa, ja = a("MSGATTUNIT", !1), oa = a("MSGDEFUNIT", !1), Ua = a("MSGSHOWCOST", !1), Sa = a("MSGRESOURCE", !1), ua = a("MSGHIDAT", !1), Ka = a("MSGHIDDE", !1), Wa = a("MSGUNITS", !1), Oa = a("MSGBUILD", !1), Ja = a("MSGUSC", !1), Ta = a("MSGRAW", !1), Ha = a("MSGDETAIL", !1), wa = a("MSGRTSHOW", !1), Ma = a("MSGRTONLINE", !1), Pa, Ba, na, Qa, Ra, Va, Ea, qa = 0, Na = 0;
    try {
      WM.getWindowByType("grcrt_convert")[0].close();
    } catch (Q) {
    }
    window.RepConvOptionsWnd = WF.open("grcrt_convert");
    RepConv.Debug && console.log("Typ=" + T);
    switch(T) {
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
        aa();
        break;
      case "wall":
        fa(), p = 220;
    }
    ra();
    var Xa = RepConvTool.RamkaLight(RepConvTool.GetLabel("MSGBBCODE"), "");
    $(Xa).attr("id", "RepConvAreas");
    $(V).append(Xa);
    window.RepConvOptionsWnd.appendContent(RepConvTool.Ramka(RepConvTool.GetLabel("MSGTITLE"), V, 485));
    window.RepConvOptionsWnd.getJQElement().find($("#publish_report_options1,#publish_report_options2")).height(window.RepConvOptionsWnd.getJQElement().find($("#publish_report_options1,#publish_report_options2")).height());
    $("#RepConvAreas div.box_content").height(p);
    F();
    (I ? O.find($(".btn_wnd.close")) : b.getJQCloseButton()).bind("click", function(c) {
      try {
        window.RepConvOptionsWnd.close();
      } catch (Ya) {
      }
      window.RepConvOptionsWnd = void 0;
    });
  }
}
function _GRCRTInnoFix() {
  $("head").append($("<style/>").append(".bbcodes.monospace img {\nmax-width: none;\n}"));
  $.Observer(GameEvents.window.reload).subscribe("grcrt_trade", function(b, k) {
    $.each($("div[class*=trade_tab_target]"), function(a, b) {
      a = $(b).find($("#way_duration")).addClass("way_duration").removeAttr("id").tooltip(DM.getl10n("farm_town").way_duration).text().replace("~", "").split(":");
      a = 3600 * parseInt(a[0]) + 60 * parseInt(a[1]) + parseInt(a[2]);
      $(b).find($("#arrival_time")).addClass("arrival_time").removeAttr("id").text(a).updateTime().tooltip(DM.getl10n("farm_town").arrival_time);
    });
  });
}
function _GRCRTMovedFrames() {
  function b() {
    if (0 == $("#toolbar_activity_commands_list").length) {
      setTimeout(function() {
        b();
      }, 500);
    } else {
      var k = document.querySelector("#toolbar_activity_commands_list");
      if (0 == $("#grcrt_taclWrap").length) {
        if ($("#toolbar_activity_commands_list").wrap($("<div/>", {"class":"grcrt_taclWrap", id:"grcrt_taclWrap"})), RepConv.settings[RepConv.Cookie + "_tacl"]) {
          $("#toolbar_activity_commands_list").addClass("grcrt_tacl");
          $("#grcrt_taclWrap").draggable().draggable("enable");
          var a = new MutationObserver(function(a) {
            a.forEach(function(a) {
              $(k).hasClass("grcrt_tacl") && $("#grcrt_taclWrap").attr("style") && "none" == $(k).css("display") && $(".activity.commands").trigger("mouseenter");
            });
          });
          0 == $("#toolbar_activity_commands_list>.js-dropdown-list>a.cancel").length && $("#toolbar_activity_commands_list>.js-dropdown-list").append($("<a/>", {href:"#n", "class":"cancel", style:"display:none;"}).click(function() {
            $("#grcrt_taclWrap").removeAttr("style");
          }));
          a.observe(k, {attributes:!0, childList:!1, characterData:!1});
        } else {
          $("#toolbar_activity_commands_list").removeClass("grcrt_tacl"), $("#grcrt_taclWrap").draggable().draggable("disable").removeAttr("style");
        }
      }
      $(k).hasClass("grcrt_tacl") && $("#grcrt_taclWrap").attr("style") && $(".activity.commands").trigger("mouseenter");
    }
  }
  $("head").append($("<style/>").append($("<style/>").append(".showImportant { bisplay: block !important}").append("#grcrt_taclWrap { left:312px; position: absolute; top: 29px;}").append("#grcrt_taclWrap>#toolbar_activity_commands_list { left: 0 !important; top: 0 !important;}").append(".grcrt_tacl { z-index:5000 !important;}").append(".grcrt_tacl>.js-dropdown-list>a.cancel { position: relative; float: right; margin-bottom: 11px;display:none; opacity: 0; visibility: hidden; transition: visibility 0s, opacity 0.5s linear;}").append(".grcrt_tacl>.js-dropdown-list:hover>a.cancel { display: block !important; visibility: visible; opacity: 0.5;}").append(".grcrt_tacl>.js-dropdown-list>a.cancel:hover { opacity: 1;}")));
  RepConv.sChbxs[RepConv.Cookie + "_tacl"] = {label:"CHKTACL", default:!0};
  $.Observer(GameEvents.grcrt.settings.load).subscribe("GRCRTMovedFrames_settings_load", function() {
    b();
  });
  $.Observer(GameEvents.command.send_unit).subscribe("GRCRTMovedFrames_command_send", function() {
    b();
  });
}
function _GRCRTOceanNumbers() {
  function b() {
    if (0 == $("#map_move_container").length) {
      setTimeout(function() {
        b();
      }, 100);
    } else {
      if (!RepConv.settings[k]) {
        $("div#grcrt_oceanNumbers").remove();
      } else {
        if (0 == $("div#grcrt_oceanNumbers").length) {
          $("#map_move_container").append($("<div/>", {id:"grcrt_oceanNumbers", style:"position:absolute; top:0; left:0;"}));
          (require("map/helpers") || MapTiles).map2Pixel(100, 100);
          for (var a = 0; 10 > a; a++) {
            for (var e = 0; 10 > e; e++) {
              var f = (require("map/helpers") || MapTiles).map2Pixel(100 * e, 100 * a);
              $("div#grcrt_oceanNumbers").append($("<div/>", {"class":"RepConvON", style:"left:" + f.x + "px; top: " + f.y + "px; background-image: url(" + RepConv.grcrt_cdn + "map/" + e + a + ".png);"}));
            }
          }
        }
      }
    }
  }
  var k = RepConv._cookie + "_oceanNumber";
  RepConv.sChbxs[k] = {label:"CHKOCEANNUMBER", default:!0};
  $.Observer(GameEvents.grcrt.settings.load).subscribe("GRCRTOceanNumbers_settings_load", function() {
    b();
  });
}
function _GRCRTTradeFarmOldVersion() {
  function b(a) {
    a.getName();
    $.each(a.getJQElement().find($(".fp_property>.popup_ratio")).parent(), function(a, b) {
      if (!$(b).hasClass("grcrt_trade")) {
        if (!$(b).children(0).eq(0).hasClass("you_pay")) {
          a = $(b).children(0).eq(0).attr("class");
          var e = $(b).children(0).eq(2).attr("class");
          $(b).children(0).eq(0).attr("class", e);
          $(b).children(0).eq(2).attr("class", a);
        }
        $(b).children(0).eq(1).html(GRCRTTradeFarmOldVersion.grcrtratio($(b).children(0).eq(1).html()));
        $(b).addClass("grcrt_trade");
      }
    });
  }
  function k(a) {
    a.getName();
    if (0 == a.getJQElement().find($(".grcrt_trin")).length) {
      var b = a.getJQElement().find($(".trade_slider_box>a.button")).attr("onclick").replace(/.*'([0-9]*)'.*/, "$1");
      b = WMap.mapData.getFarmTown(b);
      var f = Math.round(100 * b.ratio) / 100, u = !1;
      a.getJQElement().find($(".trade_slider_count>input.trade_slider_input")).before($("<div/>", {"class":"grcrt_trin spinner"}));
      a.getJQElement().find($(".trade_slider_count>input.trade_slider_output")).before($("<div/>", {"class":"grcrt_trout spinner"}));
      var k = a.getJQElement().find($(".grcrt_trin")).spinner({value:100, step:100, max:Math.min(ITowns.getTown(Game.townId).getAvailableTradeCapacity(), 2000), min:100}).on("sp:change:value", function() {
        u || (u = !0, a.getJQElement().find($(".trade_slider_count>input.trade_slider_input")).select().val(k.getValue()).blur(), z.setValue(f * k.getValue()), a.getJQElement().find($(".trade_slider_count>input.trade_slider_output")).select().val(z.getValue()).blur(), u = !1);
      });
      var z = a.getJQElement().find($(".grcrt_trout")).spinner({value:Math.round(100 * f), step:100, max:Math.round(f * Math.min(ITowns.getTown(Game.townId).getAvailableTradeCapacity(), 2000)), min:Math.round(100 * f)}).on("sp:change:value", function() {
        u || (u = !0, a.getJQElement().find($(".trade_slider_count>input.trade_slider_output")).select().val(z.getValue()).blur(), k.setValue(z.getValue() / f), a.getJQElement().find($(".trade_slider_count>input.trade_slider_input")).select().val(k.getValue()).blur(), u = !1);
      });
      k.setValue(Math.min(ITowns.getTown(Game.townId).getAvailableTradeCapacity(), k.getMax()));
      a.getJQElement().find($(".grcrt_trin")).css({top:110, left:96});
      a.getJQElement().find($(".grcrt_trout")).css({top:110, left:165});
      a.getJQElement().find($("input.trade_slider_input")).hide();
      a.getJQElement().find($("input.trade_slider_output")).hide();
      a.getJQElement().find($("div.left_container")).hide();
      a.getJQElement().find($("div.right_container")).hide();
      a.getJQElement().find($("div.trade_slider_slider")).hide();
      a.getJQElement().find($("form.trade_slider_count img.demand")).css({left:24});
      a.getJQElement().find($("form.trade_slider_count img.offer")).css({left:151});
      a.getJQElement().find($("form.trade_slider_count span.offer_header")).css({left:228, right:"auto"});
      a.getJQElement().find($("form.trade_slider_count span.demand_header")).css({left:"auto", right:228});
      a.getJQElement().find($(".trade_slider_box>a.button")).css({bottom:21});
      b = 1 <= f ? '<span style="color:rgb(0, 224, 28)">1:' + f + "</span>" : '<span style="color:rgb(247, 59, 34)">1:' + f + "</span>";
      a.getJQElement().find($(".trade_ratio:not(.trade_ratio_back)")).html(b);
      a.getJQElement().find($(".trade_ratio.trade_ratio_back")).html(b.stripTags());
    }
  }
  this.grcrtratio = function(a) {
    a = a.split(":");
    a = Math.round(a[0] / a[1] * 100) / 100;
    return 1 <= a ? '<span style="color:green; font-weight: bold">1:' + a + "</span>" : '<span style="color:red; font-weight: bold">1:' + a + "</span>";
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
  $(document).ajaxComplete(function(a, e, f) {
    "undefined" != typeof f && (a = f.url.replace(/\/game\/(.*)\?.*/, "$1"), a = "frontend_bridge" != a ? a : -1 < f.url.indexOf("json") ? JSON.parse(unescape(f.url).split("&")[3].split("=")[1]).window_type : a, RepConv.requests[a] = {url:f.url, responseText:e.responseText}, $.each(Layout.wnd.getAllOpen(), function(a, e) {
      RepConv.Debug && console.log("Dodanie przycisku dla starego okna o ID = " + e.getID());
      a = Layout.wnd.GetByID(e.getID());
      RepConv.AQQ = a;
      if (RepConv.settings[RepConv.Cookie + "_trade"]) {
        switch(a.getController()) {
          case "farm_town_info":
            switch(a.getContext().sub) {
              case "farm_town_info_trading":
                k(a);
            }break;
          case "farm_town_overviews":
            switch(a.getContext().sub) {
              case "farm_town_overviews_index":
                b(a);
            }break;
          case "island_info":
            b(a);
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
  function b() {
    G = 3;
    h = "grcrt_ao_scroll";
    r = 598;
    g = 600;
    q = $("<div/>").append($("<div/>", {"class":"grcrt_ao_bl"})).append($("<div/>", {"class":"grcrt_ao_green"})).append($("<div/>", {"class":"grcrt_ao_br"}));
    l = $("<div/>").append($("<div/>", {"class":"grcrt_ao_bl"})).append($("<div/>", {"class":"grcrt_ao_gray"})).append($("<div/>", {"class":"grcrt_ao_br"}));
    m = $("<div/>").append($("<div/>", {"class":"grcrt_ao_bl"})).append($("<div/>", {"class":"grcrt_ao_red"})).append($("<div/>", {"class":"grcrt_ao_br"}));
    w = {};
    J = Object.size(GameData.researches) * (40 + 2 * G);
    W = MM.getCollections().Town[0];
    U = !0;
    H = {};
    var a = $("<div/>", {"class":h}).width(J), b = $("<div/>").css({clear:"both", height:"40px", padding:"0", width:"100%", "border-bottom":"1px solid #000", background:"url(" + Game.img() + "/game/overviews/fixed_table_header_bg.jpg) repeat-x 0 0"}).append($("<div/>", {"class":"button_arrow left"}).css({position:"absolute", top:"10px", left:"170px"}).bind("click", function() {
      0 < $("." + h).position().left ? $("." + h).css({left:"0px"}) : 0 != $("." + h).position().left ? $("." + h).animate({left:"+=" + r + "px"}, 400) : $("." + h).animate({left:"-=" + Math.floor(J / g) * r + "px"}, 400);
    })).append($("<div/>").css({overflow:"hidden", position:"absolute", left:"190px"}).width(g).append(a)).append($("<div/>", {"class":"button_arrow right"}).css({position:"absolute", top:"10px", right:"15px"}).click(function() {
      $("." + h).position().left < Math.floor(J / g) * r * -1 || 0 < $("." + h).position().left ? $("." + h).css({left:"0px"}) : Math.ceil(Math.abs($("." + h).position().left) / g) == Math.floor(J / g) ? $("." + h).animate({left:"+=" + Math.floor(J / g) * r + "px"}, 400) : $("." + h).animate({left:"-=" + r + "px"}, 400);
    }));
    $.each(GameData.researches, function(b, e) {
      a.append($("<div/>", {"class":"grcrt_ao_unit unit research_icon research40x40 " + GameDataResearches.getResearchCssClass(b)}));
    });
    return b;
  }
  function k() {
    H = {};
    0 < Object.size(MM.getModels().ResearchOrder) && $.each(MM.getModels().ResearchOrder, function(a, b) {
      H[b.getTownId()] = H[b.getTownId()] || {};
      H[b.getTownId()][b.getType()] = b;
    });
  }
  function a(a) {
    U = a;
    var b = $("<ul/>").addClass("academy").addClass("js-scrollbar-content");
    a = $("<div/>", {style:"position:relative; overflow-y:hidden; min-height:485px; max-height:485px;", "class":"js-scrollbar-viewport"}).append(b);
    var r = !1, l = [];
    $.each(MM.getCollections().TownGroupTown[0].getTowns(MM.getCollections().TownGroup[0].getActiveGroupId()), function(a, b) {
      a = MM.getModels().Town[b.getTownId()];
      l.push({id:a.id, name:a.getName()});
    });
    var q = !1;
    do {
      q = !1;
      for (var m = 0; m < l.length - 1; m++) {
        l[m].name > l[m + 1].name && (q = l[m], l[m] = l[m + 1], l[m + 1] = q, q = !0);
      }
    } while (q);
    $.each(l, function(a, l) {
      W.forEach(function(a) {
        if (l.id == a.id) {
          var m = $("<div/>", {"class":h}).css({display:"inline-block", position:"relative", left:"0px"}).width(Object.size(GameData.researches) * (40 + 2 * G)), q = $("<li/>", {"class":r ? "odd" : "even", style:"position: relative; min-height: 29px;"});
          k();
          var A = GameData.researches, x = a.getBuildings().getBuildingLevel("academy"), t = e(a.id), w = a.getResearches(), z = H && H[a.id] && Object.size(H[a.id]) == GameDataConstructionQueue.getResearchOrdersQueueLength() || !1;
          q.append($("<div/>", {"class":"grcrt_ao_ta grcrt_ao_town"}).append($("<a/>", {"class":"gp_town_link", href:a.getLinkFragment(), rel:a.id}).html(a.getName()))).append($("<div/>", {"class":"grcrt_ao_ta grcrt_ao_ap", id:"grcrt_ao_" + a.id}).html(t)).append($("<div/>").css({overflow:"hidden", position:"absolute", left:190 - 2 * G + "px", top:"3px"}).width(g).append(m));
          $.each(GameData.researches, function(b, e) {
            e = A[b];
            var h = w.hasResearch(b), g = H && H[a.id] && Object.size(H[a.id]) == GameDataConstructionQueue.getResearchOrdersQueueLength() || !1, r = f(a.id, b), l = u(a.id, b);
            m.append($("<div/>", {"class":"textbox tech_tree_box " + b, id:"grcrt_ao_" + a.id + "_" + b}).data("town", a.id).append(r).append(l).hover(function() {
              $(this).find($(".button_downgrade,.button_upgrade")).slideDown();
            }, function() {
              $(this).find($(".button_downgrade,.button_upgrade")).slideUp();
            }).tooltip(U || !U && !h && !g ? GrcRTAcademyTooltipFactory.getResearchTooltip(e, x, t, h, g, z, a.id) : AcademyTooltipFactory.getRevertTooltip(e, MM.checkAndPublishRawModel("Player", {id:Game.player_id}).getCulturalPoints())));
          });
          r = !r;
          b.append(q);
        }
      });
    });
    return a;
  }
  function e(a) {
    var b = MM.getCollections().Town[0].get(a), e = b.getBuildings().getBuildingLevel("academy") * GameDataResearches.getResearchPointsPerAcademyLevel() + b.getBuildings().getBuildingLevel("library") * GameDataResearches.getResearchPointsPerLibraryLevel();
    b.getResources();
    $.each(GameData.researches, function(a, h) {
      b.getResearches().get(a) && (e -= h.research_points);
    });
    k();
    0 < Object.size(H) && H[a] && $.each(H[a], function(a, b) {
      e -= GameData.researches[a].research_points;
    });
    RepConv.Debug && console.log(e);
    return e;
  }
  function f(a, b) {
    RepConv.Debug && console.log("wypelnienie dla town_id [" + a + "] => " + b);
    var e = W.get(a), h = e.getResearches().get(b);
    if (GameData.researches[b].building_dependencies.academy <= e.getBuildings().getBuildingLevel("academy")) {
      if (H && H[e.id] && H[e.id][b]) {
        e = H[e.id][b];
        if (e.getType() == b) {
          w[a + "_" + b] = $("<div/>", {"class":"single-progressbar instant_buy js-item-progressbar type_unit_queue"}).singleProgressbar({template:"tpl_pb_single_nomax", type:"time", reverse_progress:!0, liveprogress:!0, liveprogress_interval:1, value:e.getRealTimeLeft(), max:e.getDuration(), countdown:!0}).on("pb:cd:finish", function() {
            $(this).parent().html(q.html());
            this.destroy();
          });
          var g = w[a + "_" + b];
        }
        return g || q.html();
      }
      return h ? q.html() : m.html();
    }
    return l.html();
  }
  function u(a, b) {
    var h = W.get(a), g = h.getResearches().get(b), r;
    if (GameData.researches[b].building_dependencies.academy <= h.getBuildings().getBuildingLevel("academy")) {
      if (H && H[h.id] && H[h.id][b]) {
        return "";
      }
      !g && U ? r = $("<div/>", {"class":"btn_upgrade button_upgrade"}).hide().data("town_id", a).data("research", b).click(function() {
        var a = $(this).data("town_id"), b = $(this).data("research");
        RepConv.Debug && console.log(a + " => " + b);
        gpAjax.ajaxPost("frontend_bridge", "execute", {model_url:"ResearchOrder", action_name:"research", arguments:{id:b}, town_id:a}, !0, {success:function(h, g) {
          k();
          $("#grcrt_ao_" + a + "_" + b).html(f(a, b));
          $("#grcrt_ao_" + a).html(e(a));
        }, error:function(a, b) {
          RepConv.Debug && console.log(a);
          RepConv.Debug && console.log(b);
        }});
      }) : g && !U && (r = $("<div/>", {"class":"btn_downgrade button_downgrade"}).hide().data("town_id", a).data("research", b).click(function() {
        ConfirmationWindowFactory.openConfirmationResettingResearch(function(a) {
          var b = $(a).data("town_id"), h = $(a).data("research");
          RepConv.Debug && console.log("Potwierdzenie dla: " + b + " => " + h);
          gpAjax.ajaxPost("frontend_bridge", "execute", {model_url:"ResearchOrder", action_name:"revert", arguments:{id:h}, town_id:b}, !0, {success:function(a, g) {
            k();
            $("#grcrt_ao_" + b + "_" + h).html(f(b, h));
            $("#grcrt_ao_" + b).html(e(b));
          }, error:function(a, b) {
            RepConv.Debug && console.log(a);
            RepConv.Debug && console.log(b);
          }});
        }.bind(this, this));
      }));
    }
    return r;
  }
  function x() {
    var a = "";
    MM.getCollections().TownGroup[0].forEach(function(b) {
      b.getId() == MM.getCollections().TownGroup[0].getActiveGroupId() && (a = " (" + b.getName() + ")");
    });
    return a;
  }
  function z() {
    require("game/windows/ids").GRCRT_AO = "grcrt_ao";
    (function() {
      var e = window.GameControllers.TabController, h = $("<div/>", {id:"townsoverview"}), g = e.extend({initialize:function(a) {
        RepConv.Debug && console.time("initialize");
        e.prototype.initialize.apply(this, arguments);
        var b = this.getWindowModel();
        this.$el.html(h);
        b.hideLoading();
        b.getJQElement || (b.getJQElement = function() {
          return h;
        });
        b.appendContent || (b.appendContent = function(a) {
          return h.append(a);
        });
        b.setContent2 || (b.setContent2 = function(a) {
          return h.html(a);
        });
        this.bindEventListeners();
        RepConv.Debug && console.timeEnd("initialize");
      }, render:function() {
        this.reRender();
      }, reRender:function() {
        RepConv.Debug && console.time("reRender");
        var e = this.getWindowModel(), h = this.$el;
        this.getWindowModel().setTitle(RepConv.grcrt_window_icon + GameData.buildings.academy.name + x());
        MM.getCollections().TownGroup[0].getTownGroups();
        this.getWindowModel().showLoading();
        setTimeout(function() {
          RepConv.Debug && console.time("fill");
          e.setContent2(b());
          e.appendContent(a(0 == e.getActivePageNr()));
          e.hideLoading();
          RepConv.Debug && console.timeEnd("fill");
          h.find(".js-scrollbar-viewport").skinableScrollbar({orientation:"vertical", template:"tpl_skinable_scrollbar", skin:"narrow", disabled:!1, elements_to_scroll:h.find(".js-scrollbar-content"), element_viewport:h.find(".js-scrollbar-viewport"), scroll_position:0, min_slider_size:16});
        }, 100);
        RepConv.Debug && console.timeEnd("reRender");
      }, bindEventListeners:function() {
        this.$el.parents(".grcrt_ao").on("click", ".js-wnd-buttons .help", this._handleHelpButtonClickEvent.bind(this));
      }, _handleHelpButtonClickEvent:function() {
        var a = this.getWindowModel().getHelpButtonSettings();
        RepConvGRC.openGRCRT(a.action.tab, a.action.args);
      }});
      window.GameViews.GrcRTView_grcrt_ao = g;
    })();
    (function() {
      var a = window.GameViews, b = window.WindowFactorySettings, e = require("game/windows/ids"), h = require("game/windows/tabs"), g = e.GRCRT_AO;
      b[g] = function(b) {
        b = b || {};
        var f = DM.getl10n(e.ACADEMY);
        return us.extend({window_type:g, minheight:570, maxheight:580, width:822, tabs:[{type:h.RESEARCH, title:f.tabs[0], content_view_constructor:a.GrcRTView_grcrt_ao, hidden:!1}, {type:h.RESET, title:f.tabs[1], content_view_constructor:a.GrcRTView_grcrt_ao, hidden:!1}], max_instances:1, activepagenr:0, title:RepConv.grcrt_window_icon + GameData.buildings.academy.name}, b);
      };
    })();
  }
  function t() {
    var a = DM.getl10n("tooltips", "academy");
    window.GrcRTAcademyTooltipFactory = {getResearchTooltip:function(b, e, h, g, f, r, l) {
      var m = "";
      if (m += '<div class="academy_popup">', m += "<h4>" + b.name + "</h4>", m += '<p style="width: 320px;">' + b.description + "</p>", g) {
        m += "<h5>" + a.already_researched + "</h5>";
      } else {
        if (f) {
          m += "<h5>" + a.in_progress + "</h5>";
        } else {
          var q, k, u = "";
          g = ITowns.getTown(l);
          f = g.resources();
          var A = g.getProduction(), x = 0, t = !0;
          g = !0;
          l = GrcRTGameDataResearches.getResearchCosts(b, l);
          var w = {wood:{amount:Math.floor(l.wood, 10)}, stone:{amount:Math.floor(l.stone, 10)}, iron:{amount:Math.floor(l.iron, 10)}, research_points:{amount:b.research_points}, time:{amount:GameDataResearches.getResearchTime(b, e)}};
          for (q in w) {
            if (w.hasOwnProperty(q)) {
              l = w[q];
              var G = q;
              G = '<img src="' + Game.img() + "/game/res/" + ("population" === G ? "pop" : G) + '.png" alt="' + a[G] + '" />';
              if (u += G, "research_points" === q && l.amount > h) {
                t = !1;
              }
              l.amount > f[q] && "time" !== q && "research_points" !== q && (g = !1, 0 < A[q]) && (k = parseInt(3600 * parseFloat((l.amount - f[q]) / A[q]), 10), k > x && 0 < k) && (x = k);
              "time" === q && (l.amount = DateHelper.readableSeconds(l.amount));
              u += "<span" + (l.amount > f[q] || "research_points" === q && !1 === t ? ' style="color:#B00"' : "") + ">" + l.amount + "</span>";
            }
          }
          h = x;
          m += u + "<br/>";
          b = b.building_dependencies;
          e < b.academy && (m += "<h5>" + a.building_dependencies + "</h5>", m += '<span class="requirement">' + GameData.buildings.academy.name + " " + b.academy + "</span><br />");
          g || (m += '<span class="requirement">' + a.not_enough_resources + '</span><br /><span class="requirement">' + s(a.enough_resources_in, DateHelper.formatDateTimeNice(Timestamp.server() + h, !1)) + "</span><br />");
          r && (m += '<span class="requirement">' + a.full_queue + "</span><br />");
        }
      }
      return m + "</div>";
    }};
  }
  function A(a) {
    var b = $.extend({}, GameDataResearches, {getResearchCostsById:function(a, b) {
      return this.getResearchCosts(GameData.researches[a], b);
    }, getResearchCosts:function(a, b) {
      MM.getCollections().PlayerHero[0] || MM.createBackboneObjects({PlayerHeroes:null}, window.GameCollections, {});
      var e, h;
      return e = a.resources, h = GeneralModifications.getResearchResourcesModification(b), {wood:Math.ceil(e.wood * h), stone:Math.ceil(e.stone * h), iron:Math.ceil(e.iron * h)};
    }});
    a.GrcRTGameDataResearches = b;
  }
  var G = 3, h = "grcrt_ao_scroll", r = 598, g = 600, q = $("<div/>").append($("<div/>", {"class":"grcrt_ao_bl"})).append($("<div/>", {"class":"grcrt_ao_green"})).append($("<div/>", {"class":"grcrt_ao_br"})), l = $("<div/>").append($("<div/>", {"class":"grcrt_ao_bl"})).append($("<div/>", {"class":"grcrt_ao_gray"})).append($("<div/>", {"class":"grcrt_ao_br"})), m = $("<div/>").append($("<div/>", {"class":"grcrt_ao_bl"})).append($("<div/>", {"class":"grcrt_ao_red"})).append($("<div/>", {"class":"grcrt_ao_br"})),
  w = {}, J = Object.size(GameData.researches) * (40 + 2 * G), W = null, U = !0, H = {};
  RepConv.menu[4] = {name:"AO.TITLE", action:"GRCRT_AO.windowOpen();", "class":"aom"};
  $("head").append($("<style/>").append(".grcrt.ao { background-position: -77px -80px; cursor: pointer;}").append(".grcrt_ao_unit { margin: 0 " + G + "px !important;}").append("." + h + " {display: inline-block; position: relative; left: 0px;}").append(".grcrt_ao_scroll .textbox {margin: 0px " + G + "px; width: 40px; float: left;}").append(".grcrt_ao_bl, .grcrt_ao_br, .grcrt_ao_green, .grcrt_ao_gray, .grcrt_ao_red {float: left; height: 24px; background: url(" + Game.img() + "/game/survey/survey_sprite.png) no-repeat scroll 0px -39px;}\n.grcrt_ao_bl, .grcrt_ao_br {width: 2px;}\n.grcrt_ao_green, .grcrt_ao_gray, .grcrt_ao_red {width: 36px;}\n.grcrt_ao_bl {background-position: 0px -39px;}\n.grcrt_ao_br {background-position: -360px -39px;}\n.grcrt_ao_green {background-position: -321px -39px;}\n.grcrt_ao_gray {background: gray;}\n.grcrt_ao_red {background-position: -2px -39px;}\n.grcrt_ao_ta {font-size: 10px; float:left; padding-top: 8px; }\n.grcrt_ao_town {width: 130px; max-width:130px; padding-left: 5px;}\n.grcrt_ao_ap {width: 40px; max-width:40px; text-align: right; background: url(" +
  Game.img() + "/game/academy/points_25x25.png) no-repeat;}\n.grcrt_ao .single-progressbar .curr { font-size: 8px;}\n.grcrt_ao .button_upgrade, .grcrt_ao .button_downgrade {bottom: 1px !important; right: 1px !important;}\n.grcrt.aom {background: url(" + Game.img() + "/game/academy/points_25x25.png) no-repeat;top: 4px !important; left: 4px !important;}\n"));
  this.windowOpen = function() {
    try {
      WM.getWindowByType("grcrt_ao")[0].close();
    } catch (za) {
    }
    WF.open("grcrt_ao");
  };
  RepConv.initArray.push("GRCRT_AO.init()");
  RepConv.wndArray.push("grcrt_ao");
  this.init = function() {
    W = MM.getCollections().Town[0];
    J = Object.size(GameData.researches) * (40 + 2 * G);
    new A(window);
    new t;
    new z;
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
      var b = $(".ui-widget-overlay").prev();
      $(".ui-widget-overlay").insertBefore(b);
    }
  });
  this.addOnClick = function() {
    $.each($("#notification_area>.notification." + NotificationType.GRCRTNEWVERSION), function(b, k) {
      $(k).unbind("click");
      $(k).bind("click", function() {
        $(this).find($("a.close")).click();
        Layout.showConfirmDialog("GRCRTools new version", '<div><img src="' + RepConv.grcrt_cdn + 'img/octopus.png" style="float:left;padding-right: 10px"/><p style="padding:5px">' + RepConvTool.GetLabel("NEWVERSION.AVAILABLE") + ": <b>" + RepConv.asv + "</b></p></div>", function() {
          if ("undefined" == typeof GRCRTExtension) {
            try {
              location.href = RepConv.Scripts_update_path + "GrepolisReportConverterV2.user.js";
            } catch (a) {
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
    $.each($("#notification_area>.notification." + NotificationType.GRCRTWHATSNEW), function(b, k) {
      $(k).unbind("click");
      $(k).bind("click", function() {
        $(this).find($("a.close")).click();
        RepConvGRC.openGRCRT("HELPTAB3");
      });
    });
    $.each($("#notification_area>.notification." + NotificationType.GRCRTRELOAD), function(b, k) {
      $(k).unbind("click");
      $(k).bind("click", function() {
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
  this.addNotification = function(b) {
    if (7 < $("#notification_area>.notification").length) {
      setTimeout(function() {
        GRCRT_Notifications.addNotification(b);
      }, 10000);
    } else {
      switch(b) {
        case NotificationType.GRCRTNEWVERSION:
          0 == $("#notification_area ." + b).length && (this.checked = !0, createNotification(b, RepConvTool.GetLabel("NEWVERSION.AVAILABLE")));
          break;
        case NotificationType.GRCRTWHATSNEW:
          0 == $("#notification_area ." + b).length && (createNotification(b, RepConvTool.GetLabel("HELPTAB3")), RepConvTool.setItem(RepConv.CookieNew, RepConv.Scripts_version));
          break;
        case NotificationType.GRCRTRELOAD:
          0 == $("#notification_area ." + b).length && createNotification(b, RepConvTool.GetLabel("NEWVERSION.REQRELOAD"));
      }
    }
  };
  createNotification = function(b, k) {
    ("undefined" == typeof Layout.notify ? new NotificationHandler : Layout).notify($("#notification_area>.notification").length + 1, b, "<span><b>" + RepConv.Scripts_name + "</b></span>" + k + "<span class='small notification_date'>" + RepConv.Scripts_nameS + " " + RepConv.Scripts_version + " [" + RepConv.LangEnv + "]</span>");
  };
}
function _GRCRT_Radar() {
  function b(c, a) {
    return $("<div/>", {"class":"checkbox_new"}).checkbox({caption:"", checked:a, cid:c}).on("cbx:check", function() {
      t();
    });
  }
  function k() {
    var c = [{info:DM.getl10n("place", "simulator").unassign, value:""}], a = [];
    $.each(require("enums/runtime_info"), function(c, b) {
      a.push(b);
    });
    GameData.heroes && $.each(GameData.heroes, function(b, d) {
      d = {value:b, level:d.name, hero_level:1};
      -1 < $.inArray(b, a, 0) && c.push(d);
    });
    return c;
  }
  function a(c) {
    return GameData.researches[c] ? "<b>" + GameData.researches[c].name + "</b><br/><br/>" + GameData.researches[c].description : GameData.buildings[c] ? "<b>" + GameData.buildings[c].name + "</b><br/><br/>" + GameData.buildings[c].description : us.template(DM.getTemplate("COMMON", "casted_power_tooltip"), $.extend({}, GameDataPowers.getTooltipPowerData(GameData.powers[c], {percent:30, lifetime:1800, level:1}, "1"), null));
  }
  function e() {
    null == da && (da = Math.ceil(12 * GameData.units.colonize_ship.speed / WMap.getChunkSize()));
    return da;
  }
  function f() {
    null == B && (B = "meteorology lighthouse cartography unit_movement_boost" + (30 == GameData.buildings.academy.max_level ? "" : " set_sail"));
    return B;
  }
  function u() {
    null != C ? I.setExclusions([""]) : ka && "RGHOST" == ka.getValue() || null != P || null != N ? (I.setValue("all"), I.setExclusions(["player", "alliance", "allypacts", "pacts", "enemies"])) : I.setExclusions([""]);
  }
  function x() {
    C = N = P = null;
  }
  function z(a) {
    var b = 0;
    var d = 0 + (GameData.units[F.getValue()].is_naval && MM.getModels().Town[a].getResearches().get("cartography") ? GameData.research_bonus.cartography_speed : 0);
    d += 30 < GameData.buildings.academy.max_level && "colonize_ship" == F.getValue() && MM.getModels().Town[a].getResearches().get("set_sail") ? GameData.research_bonus.colony_ship_speed : 0;
    d += GameData.units[F.getValue()].is_naval && 1 == MM.getModels().Town[a].getBuildings().get("lighthouse") ? GameData.additional_runtime_modifier.lighthouse_speed_bonus : 0;
    d += !GameData.units[F.getValue()].is_naval && MM.getModels().Town[a].getResearches().get("meteorology") ? GameData.research_bonus.meteorology_speed : 0;
    b += V.isChecked() && !$(".grcrt_modifiers .modifier_icon.unit_movement_boost").hasClass("inactive") ? 0.3 : 0;
    return GameData.units[F.getValue()].speed * (1 + d) * (1 + c + b);
  }
  function t() {
    if (null != C) {
      la = C.ix;
      ca = C.iy;
      ma = WMap.toChunk(la, ca).chunk;
      ea[C.id] = ea[C.id] || {};
      var a = 0;
      var b = 0 + (GameData.units[F.getValue()].is_naval && n.isChecked() && !$(".grcrt_modifiers .modifier_icon.cartography").hasClass("inactive") ? GameData.research_bonus.cartography_speed : 0);
      b += 30 < GameData.buildings.academy.max_level && "colonize_ship" == F.getValue() && T.isChecked() && !$(".grcrt_modifiers .modifier_icon.set_sail").hasClass("inactive") ? GameData.research_bonus.colony_ship_speed : 0;
      b += GameData.units[F.getValue()].is_naval && d.isChecked() && !$(".grcrt_modifiers .modifier_icon.lighthouse").hasClass("inactive") ? GameData.additional_runtime_modifier.lighthouse_speed_bonus : 0;
      b += GameData.units[F.getValue()].is_naval || !O.isChecked() || $(".grcrt_modifiers .modifier_icon.meteorology").hasClass("inactive") ? 0 : GameData.research_bonus.meteorology_speed;
      a += V.isChecked() && !$(".grcrt_modifiers .modifier_icon.unit_movement_boost").hasClass("inactive") ? 0.3 : 0;
      xa = GameData.units[F.getValue()].speed * (1 + b) * (1 + c + a);
    } else {
      sa = MM.getModels().Town[Game.townId], la = sa.get("island_x"), ca = sa.get("island_y"), ma = WMap.toChunk(la, ca).chunk, ea[Game.townId] = ea[Game.townId] || {}, xa = z(Game.townId);
    }
    $(".grcrt_modifiers .modifier_icon").removeClass("inactive");
    O.enable();
    n.enable();
    T.enable();
    d.enable();
    GameData.units[F.getValue()].is_naval ? ($(".grcrt_modifiers .modifier_icon.meteorology").addClass("inactive"), O.disable()) : ($(".grcrt_modifiers .modifier_icon.cartography").addClass("inactive"), $(".grcrt_modifiers .modifier_icon.set_sail").addClass("inactive"), $(".grcrt_modifiers .modifier_icon.lighthouse").addClass("inactive"), n.disable(), T.disable(), d.disable());
    b = 3600 * Math.floor(-1.875 / GameData.units.colonize_ship.speed * GameData.units[F.getValue()].speed + 25.875);
    fa.setMax(DateHelper.readableSeconds(b));
    fa.getTimeValueAsSeconds() > b && fa.setValue(DateHelper.readableSeconds(b));
  }
  function A() {
    Z = {all:{name:RepConvTool.GetLabel("COMMAND.ALL"), value:[]}, player:{name:DM.getl10n("custom_colors").your_cities, value:[Game.player_id]}, alliance:{name:DM.getl10n("custom_colors").your_alliance, value:[MM.checkAndPublishRawModel("Player", {id:Game.player_id}).getAllianceId()]}, allypacts:{name:DM.getl10n("custom_colors").your_alliance + " + " + DM.getl10n("custom_colors").pacts, value:[MM.checkAndPublishRawModel("Player", {id:Game.player_id}).getAllianceId()]}, pacts:{name:DM.getl10n("custom_colors").pacts,
    value:[]}, enemies:{name:DM.getl10n("custom_colors").enemies, value:[]}};
    if (null != MM.checkAndPublishRawModel("Player", {id:Game.player_id}).getAllianceId()) {
      Z.alliance = {name:DM.getl10n("custom_colors").your_alliance, value:[MM.checkAndPublishRawModel("Player", {id:Game.player_id}).getAllianceId()]};
      var c;
      $.each(MM.getOnlyCollectionByName("AlliancePact").models, function(a, b) {
        if (!b.getInvitationPending()) {
          switch(b.getRelation()) {
            case "war":
              c = "enemies";
              break;
            case "peace":
              c = "pacts";
          }
          "pacts" == c && Z.allypacts.value.push(b.getAlliance1Id() == Game.alliance_id ? b.getAlliance2Id() : b.getAlliance1Id());
          Z[c].value.push(b.getAlliance1Id() == Game.alliance_id ? b.getAlliance2Id() : b.getAlliance1Id());
        }
      });
    }
    var a = [];
    $.each(Z, function(c, b) {
      a.push({name:b.name, value:c});
    });
    return a;
  }
  function G() {
    E = [];
    L = {};
    M = [];
    t();
    setTimeout(function() {
      r();
    }, 500);
  }
  function h(c, a) {
    c = c.replace("#", "");
    var b = parseInt(c.substring(0, 2), 16), d = parseInt(c.substring(2, 4), 16);
    c = parseInt(c.substring(4, 6), 16);
    return "rgba(" + b + "," + d + "," + c + "," + a / 100 + ")";
  }
  function r() {
    for (var c = [], a = !1, b = ma.x - e(); b <= ma.x + e(); b++) {
      for (var d = ma.y - e(); d <= ma.y + e(); d++) {
        try {
          RepConv.Debug && console.log("G:" + b + ":" + d + " - " + WMap.mapData.getChunk(b, d).chunk.timestamp), RepConv.Debug && console.log("D:" + b + ":" + d + " - " + X[b + "_" + d].timestamp), a = WMap.mapData.getChunk(b, d).chunk.timestamp > X[b + "_" + d].timestamp;
        } catch (Aa) {
          a = !0;
        }
        RepConv.Debug && console.log("wmapChanged:" + a);
        (!X[b + "_" + d] || X[b + "_" + d].timestamp + 6E4 < Timestamp.server() || a) && c.push({x:b, y:d, timestamp:0});
        10 < c.length && (c = {chunks:c}, WMap.ajaxloader.ajaxGet("map_data", "get_chunks", c, !0, function(c, a) {
          $.each(c.data, function(c, a) {
            X[a.chunk.x + "_" + a.chunk.y] = {timestamp:a.chunk.timestamp, towns:a.towns};
          });
        }), c = []);
      }
    }
    0 < c.length && (c = {chunks:c}, WMap.ajaxloader.ajaxGet("map_data", "get_chunks", c, !0, function(c, a) {
      $.each(c.data, function(c, a) {
        X[a.chunk.x + "_" + a.chunk.y] = {timestamp:a.chunk.timestamp, towns:a.towns};
      });
    }));
  }
  function g() {
    0 == Object.size(ea[q()]) && $.each(X, function(c, a) {
      $.each(a.towns, function(c, a) {
        "town" == pa(a) && (ea[q()][a.id] = a);
      });
    });
    return ea[q()];
  }
  function q() {
    return null != C ? C.id : Game.townId;
  }
  function l() {
    var c;
    if (null == C) {
      var a = MM.getModels().Town[Game.townId], b = WMap.toChunk(a.get("island_x"), a.get("island_y")).chunk;
      b = X[b.x + "_" + b.y];
      $.each(b.towns, function(b, d) {
        "town" == pa(d) && d.id == a.id && (c = m(d));
      });
    } else {
      b = WMap.toChunk(C.ix, C.iy).chunk, b = X[b.x + "_" + b.y], $.each(b.towns, function(a, b) {
        "town" == pa(b) && b.id == C.id && (c = m(b));
      });
    }
    return c;
  }
  function m(c) {
    if ("town" != pa(c)) {
      return null;
    }
    var a = {id:c.id, ix:c.x, iy:c.y, name:c.name, player_id:c.player_id, player_name:c.player_name, alliance_id:c.alliance_id, alliance_name:c.alliance_name, points:c.points, reservation:c.reservation, href:"#" + btoa(JSON.stringify({id:parseInt(c.id), ix:c.x, iy:c.y, tp:null !== c.player_id ? "town" : "ghost_town", name:c.name}).replace(/[\u007f-\uffff]/g, function(c) {
      return "\\u" + ("0000" + c.charCodeAt(0).toString(16)).slice(-4);
    })), flag_type:c.flag_type, fc:c.fc};
    c.id += "";
    c.id = c.id.replace("=", "");
    var b = require("map/helpers").map2Pixel(c.x, c.y);
    a.abs_x = b.x + c.ox;
    a.abs_y = b.y + c.oy;
    return a;
  }
  function w() {
    null != P ? J() : null != N ? W() : null != C ? U() : "RGHOST" != ka.getValue() ? H() : za();
    return !0;
  }
  function J() {
    E = [];
    $.each(g(), function(c, a) {
      c = m(a);
      null != c && c.player_id == P.id && E.push(c);
    });
  }
  function W() {
    E = [];
    $.each(g(), function(c, a) {
      c = m(a);
      null != c && c.alliance_id == N.id && E.push(c);
    });
  }
  function U() {
    E = [];
    $.each(g(), function(c, a) {
      c = m(a);
      null != c && c.id != C.id && E.push(c);
    });
  }
  function H() {
    E = [];
    $.each(g(), function(c, a) {
      c = m(a);
      null != c && c.player_id != Game.player_id && E.push(c);
    });
  }
  function za() {
    E = [];
    $.each(g(), function(c, a) {
      c = m(a);
      null != c && null == c.player_id && E.push(c);
    });
  }
  function R() {
    var c = 900 / Game.game_speed;
    q();
    var a = l(), b, d;
    L = {};
    M = [];
    $.each(E, function(p, e) {
      p = Math.floor($.toe.calc.getDistance({x:a.abs_x, y:a.abs_y}, {x:e.abs_x, y:e.abs_y}));
      if (a.ix == e.ix && a.iy == e.iy || GameData.units[F.getValue()].flying || GameData.units[F.getValue()].is_naval) {
        b = MM.getModels().Town[e.id] ? z(e.id) : xa, d = Math.floor(50 * p / b + c), void 0 == L[d] && (L[d] = {time:0, towns:[]}, M.push(d)), L[d].towns.push(e), L[d].timeInSec = Math.floor(50 * p / b + c), L[d].time = DateHelper.readableSeconds(L[d].timeInSec);
      }
    });
    do {
      var p = !1;
      for (var e = 0; e < M.length - 1; e++) {
        M[e] > M[e + 1] && (p = M[e], M[e] = M[e + 1], M[e + 1] = p, p = !0);
      }
    } while (p);
    return !0;
  }
  function K() {
    DM.getl10n("map");
    D = $("<div/>", {"class":"grcrt_pagination"});
    $("#grcrt_radar_result").html("").append($("<div/>", {"class":"game_header bold", style:"height:18px;"}).append($("<div/>", {"class":"grcrt_rr_town", style:"float:left;"}).html(RepConvTool.GetLabel("RADAR.TOWNNAME"))).append($("<div/>", {"class":"grcrt_rr_cs_time", style:"float:left; text-align: center; width: 220px"}).html(RepConvTool.GetLabel("RADAR.UNITTIME"))).append($("<div/>", {"class":"grcrt_rr_player", style:"float:left;"}).html(RepConvTool.GetLabel("RADAR.TOWNOWNER"))).append($("<div/>",
    {"class":"grcrt_rr_player", style:"float:left;"}).html(RepConvTool.GetLabel("RADAR.TOWNRESERVED")))).append($("<div/>", {style:"min-height: 350px; max-height: 350px; overflow-y: hidden; overflow-x: hidden; border: 1px solid grey; position: relative;", "class":"js-scrollbar-viewport"}).append($("<ul/>", {"class":"game_list js-scrollbar-content", style:"width: 100%;"}))).append(D);
    var c = 0, a = !0;
    aa = 0;
    Y = {};
    $.each(M, function(b, d) {
      fa.getTimeValueAsSeconds() >= L[d].timeInSec && $.each(L[d].towns, function(b, p) {
        if (ba.getValue() <= p.points && (parseFloat(RepConvGRC.idle.JSON[p.player_id]) >= ra.getValue() && (null != P || null != N || null != C || "RGHOST" != ka.getValue()) || ka && "RGHOST" == ka.getValue())) {
          switch(I.getValue()) {
            case "player":
              a = p.player_id == Game.player_id;
              break;
            case "alliance":
              a = Z[I.getValue()].value.contains(p.alliance_id || 0);
              break;
            case "allypacts":
              a = Z[I.getValue()].value.contains(p.alliance_id || 0);
              break;
            case "pacts":
              a = Z[I.getValue()].value.contains(p.alliance_id || 0);
              break;
            case "enemies":
              a = Z[I.getValue()].value.contains(p.alliance_id || 0);
              break;
            default:
              a = !0;
          }
          a && (0 == c % 20 && (Y[(c / 20).toString()] = []), p.timeInSec = L[d].timeInSec, p.time = L[d].time, Y[Math.floor(c++ / 20).toString()].push(p));
        }
      });
    });
    $.Observer(GameEvents.grcrt.radar.display_towns).publish();
  }
  function ya() {
    var c = Object.size(Y), a = !0;
    D.html("");
    $.each(Y, function(b, d) {
      1 == parseInt(b) + 1 || parseInt(b) + 1 == c || parseInt(b) == aa - 1 || parseInt(b) == aa || parseInt(b) == aa + 1 ? (a = !0, aa == parseInt(b) ? D.append($("<strong/>", {"class":"paginator_bg", id:"paginator_selected"}).html(parseInt(b) + 1)) : D.append($("<a/>", {"class":"paginator_bg", href:"#n"}).html(parseInt(b) + 1).click(function() {
        aa = parseInt($(this).html()) - 1;
        $.Observer(GameEvents.grcrt.radar.display_towns).publish();
      }))) : a && (a = !1, D.append($("<strong/>", {"class":"paginator_bg", id:"paginator_inactive"}).html("...")));
    });
  }
  function ha() {
    function c(c) {
      if (!c.reservation) {
        return "";
      }
      if ("added" === c.reservation.state) {
        return "ally" === c.reservation.type ? b.can_reserve : b.reserved_by_alliance;
      }
      if ("reserved" === c.reservation.state) {
        var a = '<span class="reservation_tool icon small ' + c.reservation.state + " " + c.reservation.type + '"></span>';
        return "own" === c.reservation.type ? a + b.reserved_for_you : "ally" === c.reservation.type ? a + b.reserved_for(c.reservation.player_link) : a + b.reserved_for_alliance(c.reservation.player_link, c.reservation.alliance_link);
      }
    }
    if (!(aa >= Object.size(Y))) {
      var b = DM.getl10n("map"), d = 0, p, e;
      $("#grcrt_radar_result ul").html("");
      $.each(Y[aa.toString()], function(a, g) {
        p = null == g.player_id ? DM.getl10n("common", "ghost_town") : '<img src="' + Game.img() + '/game/icons/player.png" />' + hCommon.player(btoa(JSON.stringify({name:g.player_name, id:g.player_id}).replace(/[\u007f-\uffff]/g, function(c) {
          return "\\u" + ("0000" + c.charCodeAt(0).toString(16)).slice(-4);
        })), g.player_name, g.player_id);
        p += void 0 == g.alliance_id ? "" : '<br/><img src="' + Game.img() + '/game/icons/ally.png" />' + hCommon.alliance("n", g.alliance_name, g.alliance_id);
        e = "";
        MM.getModels().Town[g.id] && (e += GameData.units[F.getValue()].is_naval && MM.getModels().Town[g.id].getResearches().get("cartography") ? '<div class="grcrt_bonuses grcrt_cartography"></div>' : "", e += "colonize_ship" == F.getValue() && MM.getModels().Town[g.id].getResearches().get("set_sail") ? '<div class="grcrt_bonuses grcrt_set_sail"></div>' : "", e += GameData.units[F.getValue()].is_naval && 1 == MM.getModels().Town[g.id].getBuildings().get("lighthouse") ? '<div class="grcrt_bonuses grcrt_lighthouse"></div>' :
        "", e += !GameData.units[F.getValue()].is_naval && MM.getModels().Town[g.id].getResearches().get("meteorology") ? '<div class="grcrt_bonuses grcrt_meteorology"></div>' : "");
        $("#grcrt_radar_result ul").append($("<li/>", {"class":++d % 2 ? "even" : "odd"}).append($("<div/>", {"class":"grcrt_rr_town"}).append($("<a/>", {"class":"gp_town_link", href:g.href}).html(g.name)).append($("<br/>")).append($("<span/>", {"class":""}).html('<img src="' + Game.img() + '/game/icons/points.png" /> ' + b.points(g.points))).append(e).css("border-left", "5px solid #" + (g.fc || "f00")).css("background-color", h(g.fc || "f00", 10))).append($("<div/>", {"class":"grcrt_rr_cs_time"}).append($("<span/>",
        {"class":"way_duration"}).html("~" + g.time))).append($("<div/>", {"class":"grcrt_rr_cs_time"}).append($("<span/>", {"class":"arrival_time", "data-sec":g.timeInSec}))).append($("<div/>", {"class":"player_name grcrt_rr_player"}).html(p)).append($("<div/>", {"class":"player_name grcrt_rr_player"}).html(c(g))).append($("<br/>", {style:"clear:both"})));
      });
      $.each(f().split(" "), function(c, b) {
        $("#grcrt_radar_result ul .grcrt_" + b + ":not(.grcrt_done)").tooltip(a(b)).addClass("grcrt_done");
      });
      $.each($(".grcrt_rr_cs_time .arrival_time:not(.grcrt_done)"), function(c, a) {
        $(a).text($(a).data("sec") + "").updateTime().addClass("grcrt_done");
      });
      ya();
    }
  }
  function ia() {
    return null != P ? '<img src="' + Game.img() + '/game/icons/player.png" />' + hCommon.player(btoa(JSON.stringify({name:P.name, id:P.id}).replace(/[\u007f-\uffff]/g, function(c) {
      return "\\u" + ("0000" + c.charCodeAt(0).toString(16)).slice(-4);
    })), P.name, P.id) : null != N ? '<img src="' + Game.img() + '/game/icons/ally.png" />' + hCommon.alliance("n", N.name, N.id) : null != C ? '<div style="float:right"><img src="' + Game.img() + '/game/icons/town.png" style="float:left"/><a class="gp_town_link" href="' + btoa(JSON.stringify({id:C.id, ix:C.ix, iy:C.iy, tp:"town", name:C.name})) + '">' + C.name + "</a></div>" : ka = $("<div/>", {"class":"radiobutton", id:"grcrt_rghost"}).radiobutton({value:"RGHOST", template:"tpl_radiobutton", options:[{value:"RGHOST",
    name:DM.getl10n("common", "ghost_town")}, {value:"RALL", name:RepConvTool.GetLabel("RADAR.ALL")}]}).on("rb:change:value", function(c, a, b) {
      u();
    });
  }
  function Ga() {
    O = b("grcrt_rr_meteorology", null == C && MM.getModels().Town[Game.townId].getResearches().get("meteorology"));
    n = b("grcrt_rr_cartography", null == C && MM.getModels().Town[Game.townId].getResearches().get("cartography"));
    T = b("grcrt_rr_set_sail", null == C && MM.getModels().Town[Game.townId].getResearches().get("set_sail"));
    V = b("grcrt_rr_unit_movement_boost", !1);
    d = b("grcrt_rr_lighthouse", null == C && 1 == MM.getModels().Town[Game.townId].getBuildings().get("lighthouse"));
    p = GameDataHeroes.areHeroesEnabled() ? $("<div/>", {"class":"modifier hero_modifier", style:"margin-right: 0px; margin-top: 1px;"}).heroPicker({options:k(), should_have_remove_and_change_btn:!1, should_have_level_btn:!0, confirmation_window:null}).on("hd:change:value", function(a, b, d) {
      c = "" != b ? GameData.heroes[b].description_args[1].value : 0;
      t();
    }).on("sp:change:value", function(a, b, d) {
      c = GameData.heroes[p.getValue()].description_args[1].value + GameData.heroes[p.getValue()].description_args[1].level_mod * b;
      t();
    }) : null;
    return $("<div/>").append($("<div/>", {style:"float: left; padding: 3px 5px; margin: 2px;"}).append($("<span/>").html(RepConvTool.GetLabel("RADAR.FIND") + ": ")).append(ia())).append($("<div/>", {style:"float:right; margin: 5px 10px 0 0"}).append(RepConvTool.AddBtn("RADAR.BTNSAVEDEFAULT").click(function() {
      try {
        ta = fa.getValue(), va = ba.getValue(), RepConvTool.setItem(RepConv.Cookie + "radar_cs", ta), RepConvTool.setItem(RepConv.Cookie + "radar_points", va), setTimeout(function() {
          HumanMessage.success(RepConvTool.GetLabel("MSGHUMAN.OK"));
        }, 0);
      } catch (v) {
        setTimeout(function() {
          HumanMessage.error(RepConvTool.GetLabel("MSGHUMAN.ERROR"));
        }, 0);
      }
    })).append(Da.click(function() {
      $.Observer(GameEvents.grcrt.radar.find_btn).publish();
    }))).append($("<br/>", {style:"clear:both"})).append($("<div/>", {id:"grcrt_rr_unit", "class":"unit_icon50x50 colonize_ship", style:"margin:2px 5px 0 5px; cursor: pointer;"})).append($("<div/>", {style:"float:left"}).append($("<div/>", {style:"padding: 3px 5px; margin: 2px;"}).html(RepConvTool.GetLabel("RADAR.MAXUNITTIME"))).append($("<div/>", {id:"grcrt_cs_time", "class":"spinner", style:"width: 70px; float: right; margin: 2px;"}))).append($("<div/>", {style:"float:left"}).append($("<div/>",
    {style:"padding: 3px 5px; margin: 2px;"}).html(RepConvTool.GetLabel("RADAR.TOWNPOINTS"))).append($("<div/>", {id:"grcrt_town_points", "class":"spinner", style:"width: 65px; float: right; margin: 2px;"}))).append($("<div/>", {style:"float:left"}).append($("<div/>", {style:"padding: 3px 5px; margin: 2px;"}).html(RepConvTool.GetLabel("STATS.INACTIVE"))).append($("<div/>", {id:"grcrt_player_idle", "class":"spinner", style:"width: 40px; float: right; margin: 2px;"}))).append($("<div/>", {style:"float:left"}).append($("<div/>",
    {style:"padding: 3px 5px; margin: 2px;"}).html(RepConvTool.GetLabel("RADAR.SHOWCITIES"))).append($("<div/>", {id:"grcrt_town_lists", "class":"dropdown default", style:"width: 150px; float: right; margin: 2px 2px 0px 2px;"}))).append($("<div/>", {"class":"runtime_info grcrt_modifiers", style:"float: left;"}).append($("<div/>", {"class":"modifiers_container", style:"max-width: 340px;margin-top: 0px;margin-left: 0px;"}).append($("<div/>", {"class":"other_modifiers"}).append(p).append($("<div/>",
    {"class":"modifier", style:"margin-right: 5px;"}).append($("<div/>", {"class":"modifier_icon research_icon research40x40 meteorology"})).append(O)).append($("<div/>", {"class":"modifier", style:"margin-right: 5px;"}).append($("<div/>", {"class":"modifier_icon research_icon research40x40 cartography"})).append(n)).append($("<div/>", {"class":"modifier", style:"margin-right: 5px;" + (30 == GameData.buildings.academy.max_level ? "display:none;" : "")}).append($("<div/>", {"class":"modifier_icon research_icon research40x40 set_sail"})).append(T)).append($("<div/>",
    {"class":"modifier", style:"margin-right: 5px;"}).append($("<div/>", {"class":"modifier_icon power power_icon45x45 unit_movement_boost"})).append(V)).append($("<div/>", {"class":"modifier", style:"margin-right: 5px;"}).append($("<div/>", {"class":"modifier_icon building_icon40x40 lighthouse"})).append(d))))).append($("<br/>", {style:"clear: both"})).append($("<div/>", {id:"grcrt_radar_result", style:"overflow: hidden; margin-top: 10px;"}));
  }
  function Ca() {
    require("game/windows/ids").GRCRT_RADAR = "grcrt_radar";
    (function() {
      var c = window.GameControllers.TabController, b = c.extend({initialize:function() {
        RepConv.Debug && console.log("initialize");
        c.prototype.initialize.apply(this, arguments);
        ta = RepConvTool.getSettings(RepConv.Cookie + "radar_cs", "06:00:00");
        va = parseInt(RepConvTool.getSettings(RepConv.Cookie + "radar_points", 0));
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
        var c = [];
        $.each(GameData.units, function(a, b) {
          0 < b.speed && c.push({value:a});
        });
        this.$el.html(Ga());
        F = $("#grcrt_rr_unit").dropdown({list_pos:"center", type:"image", value:"colonize_ship", template:"tpl_grcrt_units_list", options:c}).on("dd:change:value", function(c, a, b, d, p) {
          $("#grcrt_rr_unit").toggleClass(b);
          $("#grcrt_rr_unit").toggleClass(a);
          t();
        });
        $.each(f().split(" "), function(c, b) {
          $(".grcrt_modifiers .modifier_icon." + b).tooltip(a(b));
        });
        fa = $("#grcrt_cs_time").spinner({value:ta, step:"00:30:00", max:"24:00:00", min:"00:00:00", type:"time"});
        ba = $("#grcrt_town_points").spinner({value:va, step:500, max:18000, min:0});
        ra = $("#grcrt_player_idle").spinner({value:0, step:1, max:999, min:0});
        I = $("#grcrt_town_lists").dropdown({value:"all", options:A()});
        u();
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
        var c = this.getWindowModel();
        this.getWindowModel().showLoading();
        setTimeout(function() {
          G();
          c.hideLoading();
        }, 10);
      }, _findTowns:function() {
        var c = this.getWindowModel();
        this.getWindowModel().showLoading();
        setTimeout(function() {
          $("#grcrt_radar_result").html("");
          w();
          R();
          K();
          c.hideLoading();
        }, 50);
      }, registerComponent:function(c, a, b) {
        b = {main:this.getWindowModel().getType(), sub:b || this.getWindowModel().getIdentifier()};
        return CM.register(b, c, a);
      }, unregisterComponent:function(c, a) {
        a = {main:this.getWindowModel().getType(), sub:a || this.getWindowModel().getIdentifier()};
        CM.unregister(a, c);
      }, _displayTowns:function() {
        this.getWindowModel().showLoading();
        this.unregisterComponent("grcrt_radar_scrollbar");
        ha();
        this.registerComponent("grcrt_radar_scrollbar", this.$el.find(".js-scrollbar-viewport").skinableScrollbar({orientation:"vertical", template:"tpl_skinable_scrollbar", skin:"narrow", disabled:!1, elements_to_scroll:this.$el.find(".js-scrollbar-content"), element_viewport:this.$el.find(".js-scrollbar-viewport"), scroll_position:0, min_slider_size:16}));
        this.getWindowModel().hideLoading();
      }, _radarMode:function() {
        try {
          var c = this.getWindowModel().getArguments();
          if (void 0 == c) {
            x();
          } else {
            if (void 0 != c.player) {
              P = {id:c.player.id, name:c.player.name}, C = N = null;
            } else {
              if (void 0 != c.alliance) {
                var a = c.alliance.id, b = c.alliance.name;
                P = null;
                N = {id:a, name:b};
                C = null;
              } else {
                if (void 0 != c.town) {
                  var d = c.town.id, p = c.town.name, e = c.town.ix, h = c.town.iy;
                  N = P = null;
                  C = {id:d, name:p, ix:e, iy:h};
                }
              }
            }
          }
        } catch (ua) {
          x();
        }
      }});
      window.GameViews.GrcRTView_grcrt_radar = b;
    })();
    (function() {
      var c = window.GameViews, a = window.WindowFactorySettings, b = require("game/windows/ids"), d = require("game/windows/tabs"), p = b.GRCRT_RADAR;
      a[p] = function(a) {
        a = a || {};
        return us.extend({window_type:p, minheight:550, maxheight:570, width:975, tabs:[{type:d.INDEX, title:"none", content_view_constructor:c.GrcRTView_grcrt_radar, hidden:!0}], max_instances:1, activepagenr:0, minimizable:!0, resizable:!1, title:RepConv.grcrt_window_icon + RepConvTool.GetLabel("RADAR.TOWNFINDER")}, a);
      };
    })();
  }
  GameEvents.grcrt = GameEvents.grcrt || {};
  GameEvents.grcrt.radar = {find_btn:"grcrt:radar:find_btn", display_towns:"grcrt:radar:display_towns"};
  WMap.getChunkSize();
  var E, L, M, sa, la, ca, ma, P = null, N = null, C = null, ta, va, ka, X = {}, da = null, pa = (require("map/helpers") || WMap).getTownType, ea = {}, xa, Da = RepConvTool.AddBtn("RADAR.BTNFIND"), Z, Y, aa, fa, ba, ra, F, I, O, n, T, V, d, p, c = 0, B = null, D;
  this.getThtmlPage = function() {
    return aa;
  };
  this.getThtml = function() {
    return Y;
  };
  this.setPlayer = function(c, a) {
    P = {id:c, name:a};
    C = N = null;
  };
  this.setAlly = function(c, a) {
    P = null;
    N = {id:c, name:a};
    C = null;
  };
  this.setGhost = function() {
    x();
  };
  this.setCurrentTown = function() {
    G();
  };
  this.getFirstTown = function() {
    w();
    R();
    return L[M[0]] || null;
  };
  this.getTownList = function() {
    return L;
  };
  this.windowOpen = function(c) {
    try {
      WM.getWindowByType("grcrt_radar")[0].close();
    } catch (S) {
    }
    WF.open("grcrt_radar", {args:c});
  };
  RepConv.menu[1] = {name:"RADAR.TOWNFINDER", action:"GRCRT_Radar.windowOpen();", "class":"radar"};
  $("head").append($("<style/>").append(".grcrt.radar { background-position: -77px -80px; cursor: pointer;}"));
  $("head").append($("<style/>").append(".grcrt_rr_town, .grcrt_rr_player {float: left; width: 240px; max-width: 240px;}").append(".grcrt_rr_points {float: left; width: 40px; text-align: right;}").append(".grcrt_rr_cs_time {float: left; width: 105px; text-align: right; margin-right: 5px;}").append(".grcrt_rr_town img, .grcrt_rr_player img {float: left;}").append("#grcrt_rr_unit {position: relative; display: block; float: left; text-align: right; border: 1px solid #724B08;}").append(".option.unit_icon40x40 { float: left; position: relative; border: 1px solid #724B08; margin: 1px;}").append(".option.unit_icon40x40.selected {border: 2px solid red; margin: 0px;}").append(".grcrt_bonuses {background: url(https://www.grcrt.net/static/uX7%7C.S9%7C.I7%7C.S7%7C_20_0.png) 0px 0px;width: 20px; height: 20px; float: right; margin: 0 2px 2px 0;border: 1px solid #8c7878;cursor: pointer;}").append(".grcrt_meteorology {background-position: 0 0;}").append(".grcrt_lighthouse {background-position: -20px 0;}").append(".grcrt_cartography {background-position: -40px 0;}").append(".grcrt_set_sail {background-position: -60px 0;}").append("#grcrt_town_lists_list .option.disabled {color: gray !important;}").append(".grcrt_pagination {padding: 5px;height: 20px;}"));
  $("#tpl_grcrt_units_list").remove();
  $("<script/>", {type:"text/template", id:"tpl_grcrt_units_list"}).text('<div class="dropdown-list sandy-box js-dropdown-list" style="max-width: 240px !important;"><div class="corner_tl"></div><div class="corner_tr"></div><div class="corner_bl"></div><div class="corner_br"></div><div class="border_t"></div><div class="border_b"></div><div class="border_l"></div><div class="border_r"></div><div class="middle"></div><div class="content js-dropdown-item-list"><% var i, l = options.length, option;for (i = 0; i < l; i++) {option = options[i]; %><div class="option unit_icon40x40 <%= option.value %>" name="<%= option.value %>"></div><% } %></div></div>').appendTo($("head"));
  RepConv.initArray.push("GRCRT_Radar.init()");
  RepConv.wndArray.push("grcrt_radar");
  this.init = function() {
    new Ca;
  };
}
function _GRCRT_Recipes() {
  function b() {
    0 == $("#happening_large_icon.easter").length ? $("#grcrt_recipes").hide() : $("#grcrt_recipes").show();
    setTimeout(function() {
      b();
    }, 6E5);
  }
  function k() {
    require("game/windows/ids").GRCRT_RECIPES = "grcrt_recipes";
    (function() {
      var a = window.GameControllers.TabController.extend({render:function() {
        this.getWindowModel().showLoading();
        this.$el.html($("<div/>").append($("<iframe/>", {src:this.whatLoading(), style:"width: 965px; height: 530px; border: 0px; float: left;"}).bind("load", function() {
          WM.getWindowByType("grcrt_recipes")[0].hideLoading();
        })));
      }, whatLoading:function() {
        var a = this.getWindowModel().getArguments(), b = RepConv.getUrlForWebsite(this.getWindowModel().getActivePage().getType());
        try {
          b = a.url;
        } catch (u) {
        }
        return b;
      }});
      window.GameViews.GrcRTViewEx_grcrt_recipes = a;
    })();
    (function() {
      var a = window.GameControllers.TabController.extend({render:function() {
        this.$el.html(RepConvGRC.settings());
        this.getWindowModel().hideLoading();
      }});
      window.GameViews.GrcRTViewS_grcrt_recipes = a;
    })();
    (function() {
      var a = window.GameControllers.TabController.extend({render:function() {
        this.$el.html(RepConvTranslations.table());
        this.getWindowModel().hideLoading();
      }});
      window.GameViews.GrcRTViewT_grcrt_recipes = a;
    })();
    (function() {
      var a = window.GameViews, b = window.WindowFactorySettings, f = require("game/windows/ids");
      require("game/windows/tabs");
      var k = f.GRCRT_RECIPES;
      b[k] = function(b) {
        b = b || {};
        return us.extend({window_type:k, minheight:575, maxheight:585, width:980, tabs:[{type:"recipes", title:void 0, content_view_constructor:a.GrcRTViewEx_grcrt_recipes, hidden:!1}], max_instances:1, activepagenr:0, minimizable:!0, resizable:!1, title:RepConv.grcrt_window_icon + RepConv.Scripts_nameS + "  ver." + RepConv.Scripts_version}, b);
      };
    })();
  }
  $("head").append($("<style/>").append(".easter_recipes #BTNSENDeaster { position: absolute !important; top: 0px !important; margin-top: 0px !important}"));
  this.windowOpen = function() {
    try {
      WM.getWindowByType("grcrt_recipes")[0].close();
    } catch (a) {
    }
    WF.open("grcrt_recipes", {args:{title:void 0, url:"https://www.grcrt.net/" + Game.locale_lang + "/light/module/recipes" + ("zz" == Game.market_id ? "/beta" : "")}});
  };
  this.init = function() {
    new k;
    setTimeout(function() {
      b();
    }, 3E4);
  };
}
function _GRCRT_TSL() {
  function b() {
    require("game/windows/ids").GRCRT_TSL = "grcrt_tsl";
    (function() {
      var a = window.GameControllers.TabController, b = a.extend({listGroup:null, initialize:function(b) {
        a.prototype.initialize.apply(this, arguments);
        var e = this.getWindowModel(), f = $("<div/>").append($("<div/>", {style:"padding:5px"}).append($("<div/>", {id:"grcrtTslGroup", "class":"dropdown default"})).append($("<a/>", {id:"grcrtTslReload", href:"#n", "class":"grc_reload down_big reload", style:"float: right; height: 22px; margin: -1px 0 1px;"}))).append($("<div/>", {id:"grcrtTslTownsList"}));
        this.$el.html(f);
        e.hideLoading();
        e.getJQElement || (e.getJQElement = function() {
          return f;
        });
        e.appendContent || (e.appendContent = function(a) {
          return f.append(a);
        });
        e.setContent2 || (e.setContent2 = function(a) {
          return f.html(a);
        });
        this.initializeComponents();
        this.renderList();
      }, registerComponent:function(a, b, e) {
        return CM.register({main:this.cm_context.main, sub:e || this.cm_context.sub}, a, b);
      }, unregisterComponents:function(a) {
        a = {main:this.getMainContext(), sub:a || this.getSubContext()};
        CM.unregisterSubGroup(a);
      }, destroy:function() {
        this.unregisterComponents();
      }, close:function() {
        this.unregisterComponents();
      }, initializeComponents:function() {
        var a = this.$el, b = this;
        this.listGroup = this.registerComponent("grcrtTslGroup", a.find("#grcrtTslGroup").dropdown({value:MM.getCollections().TownGroup[0].getActiveGroupId(), options:MM.getCollections().TownGroup[0].getTownGroupsForDropdown(), disabled:!MM.getModels().PremiumFeatures[Game.player_id].isActivated("curator")}).on("dd:change:value", function(a, e, f) {
          b.townList();
        }));
        this.registerComponent("grcrtTslReload", a.find("#grcrtTslReload").button({}).on("btn:click", function() {
          b.renderList();
        }));
      }, render:function() {
      }, renderList:function() {
        var a = this.$el.find($("#grcrtTslTownsList"));
        a.html("");
        a.append($("<div/>", {id:"TSLhead"}).append($("<span/>", {"class":"TSLwrapper"}).append($("<span/>", {"class":"TSLicon"})).append($("<span/>", {"class":"TSLcityName", style:14 < Game.townName.length ? "font-size: 8px;" : "", townid:Game.townId}).append($("<a/>", {"class":"gp_town_link", style:"color: white", href:"#" + MM.getModels().Town[Game.townId].getLinkFragment()}).html(Game.townName))).append($("<span/>", {"class":"TSLicon"}))).append($("<div/>", {id:"TSLTownList"})));
        this.townList();
      }, townList:function() {
        var a = this.$el.find($("#grcrtTslTownsList")), b = {}, e = [], k = this, t = $("<div/>", {style:"height: 334px;overflow-y: hidden; overflow-x: hidden; position: relative;", "class":"js-scrollbar-viewport"}), A = $("<div/>", {"class":"js-scrollbar-content", style:"width: 100%;"});
        (function() {
          var a = GameData.units.attack_ship.speed, h = 900 / Game.game_speed, f = MM.getModels().Town[Game.townId], g;
          $.each(MM.getCollections().TownGroupTown[0].getTowns(parseInt(k.listGroup.getValue())), function(l, r) {
            g = MM.getModels().Town[r.getTownId()];
            f.getId() != g.getId() && (l = $.toe.calc.getDistance({x:f.get("abs_x"), y:f.get("abs_y")}, {x:g.get("abs_x"), y:g.get("abs_y")}), void 0 == b[l] && (b[l] = {time:0, towns:[]}, e.push(l)), b[l].towns.push({id:g.getId(), name:g.getName()}), b[l].timeInSec = Math.round(50 * l / a) + h, b[l].time = readableUnixTimestamp(b[l].timeInSec, "no_offset", {with_seconds:!0}));
          });
          do {
            var q = !1;
            for (var l = 0; l < e.length - 1; l++) {
              e[l] > e[l + 1] && (q = e[l], e[l] = e[l + 1], e[l + 1] = q, q = !0);
            }
          } while (q);
        })();
        this.$el.find($("#grcrtTslTownsList .js-scrollbar-viewport")).remove();
        a.append(t.append(A));
        $.each(e, function(a, e) {
          $.each(b[e].towns, function(a, b) {
            A.append($("<div/>", {"class":"TSLitem", townid:b.id}).text(b.name));
          });
        });
        t.skinableScrollbar({orientation:"vertical", template:"tpl_skinable_scrollbar", skin:"narrow", disabled:!1, elements_to_scroll:k.$el.find(".js-scrollbar-content"), element_viewport:k.$el.find(".js-scrollbar-viewport"), scroll_position:0, min_slider_size:16});
        $("#grcrtTslTownsList .js-scrollbar-content > div[townid]").click(function() {
          HelperTown.townSwitch($(this).attr("townid"));
          k.onClick(this);
        });
      }, onClick:function(a) {
        $(a).attr("townid");
        var b = GRCRTtslWnd.getJQElement().find($(".tsl_set"));
        $(b).toggleClass("tsl_set");
        $(a).addClass("tsl_set");
      }});
      window.GameViews.GrcRTView_grcrt_tsl = b;
    })();
    (function() {
      var a = window.GameViews, b = window.WindowFactorySettings, f = require("game/windows/ids"), k = require("game/windows/tabs"), x = f.GRCRT_TSL;
      b[x] = function(b) {
        b = b || {};
        return us.extend({window_type:x, minheight:440, maxheight:440, width:250, tabs:[{type:k.INDEX, title:"none", content_view_constructor:a.GrcRTView_grcrt_tsl, hidden:!0}], max_instances:1, activepagenr:0, minimizable:!0, resizable:!1, title:RepConv.grcrt_window_icon + window.ellipsis(RepConvTool.GetLabel("TSL.WND.WINDOWTITLE"), 18), special_buttons:{help:{action:{type:"external_link", url:RepConv.Scripts_url + "module/grchowto#tsl"}}}}, b);
      };
    })();
  }
  var k = RepConv.grcrt_cdn + "ui/tsl_sprite.png";
  this.createWindow = function() {
    try {
      WM.getWindowByType("grcrt_tsl")[0].close();
    } catch (a) {
    }
    window.GRCRTtslWnd = WF.open("grcrt_tsl");
  };
  RepConv.menu[3] = {name:"TSL.WND.WINDOWTITLE", action:"GRCRT_TSL.createWindow();", "class":"tsl"};
  $("head").append($("<style/>").append(".grcrt.tsl { background-position: -113px -80px; cursor: pointer;}"));
  $("head").append($("<style/>").append("#grcrtTslGroup {width: 190px;}").append("#townsSortedList {height: 100%;overflow-y: auto;font-size: 11px;font-family: Verdana;font-weight: 700;}").append("#TSLhead {height: 30px;width: 100%;position: relative;background: url(" + k + ") 0 0 repeat-x;}").append("#townsSortedListDetail {height: 365px;overflow-x: hidden;overflow-y: scroll;margin-left: 5px;}").append(".TSLwrapper {height: 16px;width: 160px;position: absolute;top: 0;right: 0;bottom: 0;left: 0;margin: auto;}").append(".TSLicon {width: 18px;height: 16px;background: url(" +
  k + ") -44px -31px no-repeat;display: inline-block;}").append("#grcrtTslTownsList .js-scrollbar-content {padding-left: 5px;}").append(".TSLcityName {display: inline-block;vertical-align: top;color: #FFF;width: 124px;text-align: center;}").append(".TSLitem {cursor: pointer;color: #423515;line-height: 22px;position: relative;}").append(".TSLitem:hover {background-color: rgba(0, 0, 0, 0.1);}").append('.TSLitem:hover::before {content: "";display: inline-block;border: 4px solid transparent;border-left: 7px solid #423515;padding-right: 2px;}').append('.TSLitem:hover::after {content: "";display: inline-block;background: url(' +
  k + ") -44px -68px no-repeat;width: 15px;height: 19px;padding-right: 10px;position: absolute;right: 20px;}").append('.tsl_set {content: "";display: inline-block;border: 4px solid transparent;border-left: 7px solid #423515;padding-right: 10px;background-color: rgba(0, 0, 0, 0.1);width: 213px;padding-left: 5px;}'));
  RepConv.initArray.push("GRCRT_TSL.init()");
  RepConv.wndArray.push("grcrt_tsl");
  this.init = function() {
    new b;
  };
}
function _GRCRT_Translations() {
  function b() {
    RepConvTool.setItem(RepConv.CookieTranslate, JSON.stringify(GRCRT_Translations.RepConvLangArrayNew));
    RepConvLangArray[Game.locale_lang.substring(0, 2)] = GRCRT_Translations.RepConvLangArrayNew;
    RepConv.Lang = GRCRT_Translations.RepConvLangArrayNew;
  }
  this.RepConvLangArrayNew = {};
  RepConv.CookieTranslate = RepConv.Cookie + "_translate";
  this.table = function() {
    var k = $("<div/>", {id:"grcrttranslate", style:"padding: 5px"}), a = RepConv.Scripts_update_path + "translation.php", e = $("<iframe/>", {id:"transSender", name:"transSender", style:"display:none"});
    $(k).append($("<h4/>", {style:"float:left;"}).html(RepConvTool.GetLabel("LANGS.LANG") + " " + Game.locale_lang.substring(0, 2))).append($("<form/>", {action:a, method:"post", target:"transSender", id:"transForm", style:"display:none"}).append($("<input/>", {name:"player"}).attr("value", Game.player_name)).append($("<input/>", {name:"lang"}).attr("value", Game.locale_lang.substring(0, 2))).append($("<textarea/>", {name:"translations", id:"trans2send"}).text(RepConvTool.getItem(RepConv.CookieTranslate)))).append($(e)).append(RepConvTool.AddBtn("LANGS.SEND").click(function() {
      try {
        GRCRT_Translations.sendTranslate(), HumanMessage.success(RepConvTool.GetLabel("MSGHUMAN.OK"));
      } catch (f) {
        HumanMessage.error(RepConvTool.GetLabel("MSGHUMAN.ERROR"));
      }
    })).append(RepConvTool.AddBtn("LANGS.SAVE").click(function() {
      try {
        b(), HumanMessage.success(RepConvTool.GetLabel("MSGHUMAN.OK"));
      } catch (f) {
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
    return k;
  };
  this.sendTranslate = function() {
    b();
    $("#trans2send").text(RepConvTool.getItem(RepConv.CookieTranslate));
    $("#transForm").submit();
  };
  this.changeLang = function(b) {
    function a(a) {
      $(f).append($("<div/>", {"class":"grcrtLangRow"}).append($("<textarea/>", {"class":"grcrtLangEN", id:"en_" + a.replace(/\./g, "_"), readonly:"readonly"}).html(RepConvTool.GetLabel4Lang(a, "en"))).append($("<textarea/>", {"class":"grcrtLangTranslate", rel:a}).text(RepConvTool.GetLabel4Lang(a, b)).css("background-color", RepConvTool.GetLabel4Lang(a, "en") == RepConvTool.GetLabel4Lang(a, b) && "en" != b ? "lightcoral" : "white").change(function() {
        function a(b, e, f) {
          console.log(f);
          var k = e.split(".");
          e = e.split(".");
          1 == e.length ? b[e[0]] = f : (b[e[0]] = b[e[0]] || {}, k.remove(0), b[e[0]] = a(b[e[0]], k.join("."), f));
          return b;
        }
        console.log("aqq");
        GRCRT_Translations.RepConvLangArrayNew = a(GRCRT_Translations.RepConvLangArrayNew, $(this).attr("rel"), $(this).val());
      })).append($("<br/>", {style:"clear:both"})));
    }
    function e(b, f) {
      f += 0 == f.length ? "" : ".";
      $.each(b, function(b, k) {
        "object" == typeof k ? e(k, f + b) : 0 < k.length && "AUTHOR" != f + b && a(f + b);
      });
    }
    var f = $("<div/>", {id:"grcrttrrows"});
    RepConvLangArray[b] = RepConvLangArray[b] || RepConvLangArray.en;
    this.RepConvLangArrayNew = $.extend({}, RepConvLangArray[b]);
    e(RepConvLangArray.en, "");
    $("#grcrttrrows").remove();
    $("#grcrttranslate").append(f);
    return f;
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
  function b(a, b) {
    var e = (a & 65535) + (b & 65535);
    return (a >> 16) + (b >> 16) + (e >> 16) << 16 | e & 65535;
  }
  function k(a, e, g, f, l, m) {
    a = b(b(e, a), b(f, m));
    return b(a << l | a >>> 32 - l, g);
  }
  function a(a, b, e, f, l, m, A) {
    return k(b & e | ~b & f, a, b, l, m, A);
  }
  function e(a, b, e, f, l, m, A) {
    return k(b & f | e & ~f, a, b, l, m, A);
  }
  function f(a, b, e, f, l, m, A) {
    return k(e ^ (b | ~f), a, b, l, m, A);
  }
  function u(h, r) {
    h[r >> 5] |= 128 << r % 32;
    h[(r + 64 >>> 9 << 4) + 14] = r;
    var g = 1732584193, q = -271733879, l = -1732584194, m = 271733878;
    for (r = 0; r < h.length; r += 16) {
      var A = g;
      var u = q;
      var t = l;
      var G = m;
      g = a(g, q, l, m, h[r], 7, -680876936);
      m = a(m, g, q, l, h[r + 1], 12, -389564586);
      l = a(l, m, g, q, h[r + 2], 17, 606105819);
      q = a(q, l, m, g, h[r + 3], 22, -1044525330);
      g = a(g, q, l, m, h[r + 4], 7, -176418897);
      m = a(m, g, q, l, h[r + 5], 12, 1200080426);
      l = a(l, m, g, q, h[r + 6], 17, -1473231341);
      q = a(q, l, m, g, h[r + 7], 22, -45705983);
      g = a(g, q, l, m, h[r + 8], 7, 1770035416);
      m = a(m, g, q, l, h[r + 9], 12, -1958414417);
      l = a(l, m, g, q, h[r + 10], 17, -42063);
      q = a(q, l, m, g, h[r + 11], 22, -1990404162);
      g = a(g, q, l, m, h[r + 12], 7, 1804603682);
      m = a(m, g, q, l, h[r + 13], 12, -40341101);
      l = a(l, m, g, q, h[r + 14], 17, -1502002290);
      q = a(q, l, m, g, h[r + 15], 22, 1236535329);
      g = e(g, q, l, m, h[r + 1], 5, -165796510);
      m = e(m, g, q, l, h[r + 6], 9, -1069501632);
      l = e(l, m, g, q, h[r + 11], 14, 643717713);
      q = e(q, l, m, g, h[r], 20, -373897302);
      g = e(g, q, l, m, h[r + 5], 5, -701558691);
      m = e(m, g, q, l, h[r + 10], 9, 38016083);
      l = e(l, m, g, q, h[r + 15], 14, -660478335);
      q = e(q, l, m, g, h[r + 4], 20, -405537848);
      g = e(g, q, l, m, h[r + 9], 5, 568446438);
      m = e(m, g, q, l, h[r + 14], 9, -1019803690);
      l = e(l, m, g, q, h[r + 3], 14, -187363961);
      q = e(q, l, m, g, h[r + 8], 20, 1163531501);
      g = e(g, q, l, m, h[r + 13], 5, -1444681467);
      m = e(m, g, q, l, h[r + 2], 9, -51403784);
      l = e(l, m, g, q, h[r + 7], 14, 1735328473);
      q = e(q, l, m, g, h[r + 12], 20, -1926607734);
      g = k(q ^ l ^ m, g, q, h[r + 5], 4, -378558);
      m = k(g ^ q ^ l, m, g, h[r + 8], 11, -2022574463);
      l = k(m ^ g ^ q, l, m, h[r + 11], 16, 1839030562);
      q = k(l ^ m ^ g, q, l, h[r + 14], 23, -35309556);
      g = k(q ^ l ^ m, g, q, h[r + 1], 4, -1530992060);
      m = k(g ^ q ^ l, m, g, h[r + 4], 11, 1272893353);
      l = k(m ^ g ^ q, l, m, h[r + 7], 16, -155497632);
      q = k(l ^ m ^ g, q, l, h[r + 10], 23, -1094730640);
      g = k(q ^ l ^ m, g, q, h[r + 13], 4, 681279174);
      m = k(g ^ q ^ l, m, g, h[r], 11, -358537222);
      l = k(m ^ g ^ q, l, m, h[r + 3], 16, -722521979);
      q = k(l ^ m ^ g, q, l, h[r + 6], 23, 76029189);
      g = k(q ^ l ^ m, g, q, h[r + 9], 4, -640364487);
      m = k(g ^ q ^ l, m, g, h[r + 12], 11, -421815835);
      l = k(m ^ g ^ q, l, m, h[r + 15], 16, 530742520);
      q = k(l ^ m ^ g, q, l, h[r + 2], 23, -995338651);
      g = f(g, q, l, m, h[r], 6, -198630844);
      m = f(m, g, q, l, h[r + 7], 10, 1126891415);
      l = f(l, m, g, q, h[r + 14], 15, -1416354905);
      q = f(q, l, m, g, h[r + 5], 21, -57434055);
      g = f(g, q, l, m, h[r + 12], 6, 1700485571);
      m = f(m, g, q, l, h[r + 3], 10, -1894986606);
      l = f(l, m, g, q, h[r + 10], 15, -1051523);
      q = f(q, l, m, g, h[r + 1], 21, -2054922799);
      g = f(g, q, l, m, h[r + 8], 6, 1873313359);
      m = f(m, g, q, l, h[r + 15], 10, -30611744);
      l = f(l, m, g, q, h[r + 6], 15, -1560198380);
      q = f(q, l, m, g, h[r + 13], 21, 1309151649);
      g = f(g, q, l, m, h[r + 4], 6, -145523070);
      m = f(m, g, q, l, h[r + 11], 10, -1120210379);
      l = f(l, m, g, q, h[r + 2], 15, 718787259);
      q = f(q, l, m, g, h[r + 9], 21, -343485551);
      g = b(g, A);
      q = b(q, u);
      l = b(l, t);
      m = b(m, G);
    }
    return [g, q, l, m];
  }
  function x(a) {
    var b, e = "";
    for (b = 0; b < 32 * a.length; b += 8) {
      e += String.fromCharCode(a[b >> 5] >>> b % 32 & 255);
    }
    return e;
  }
  function z(a) {
    var b, e = [];
    e[(a.length >> 2) - 1] = void 0;
    for (b = 0; b < e.length; b += 1) {
      e[b] = 0;
    }
    for (b = 0; b < 8 * a.length; b += 8) {
      e[b >> 5] |= (a.charCodeAt(b / 8) & 255) << b % 32;
    }
    return e;
  }
  function t(a) {
    return x(u(z(a), 8 * a.length));
  }
  function A(a, b) {
    var e = z(a), h = [], f = [];
    h[15] = f[15] = void 0;
    16 < e.length && (e = u(e, 8 * a.length));
    for (a = 0; 16 > a; a += 1) {
      h[a] = e[a] ^ 909522486, f[a] = e[a] ^ 1549556828;
    }
    b = u(h.concat(z(b)), 512 + 8 * b.length);
    return x(u(f.concat(b), 640));
  }
  function G(a) {
    var b = "", e;
    for (e = 0; e < a.length; e += 1) {
      var f = a.charCodeAt(e);
      b += "0123456789abcdef".charAt(f >>> 4 & 15) + "0123456789abcdef".charAt(f & 15);
    }
    return b;
  }
  $.md5 = function(a, b, e) {
    b ? e ? a = A(unescape(encodeURIComponent(b)), unescape(encodeURIComponent(a))) : (a = A(unescape(encodeURIComponent(b)), unescape(encodeURIComponent(a))), a = G(a)) : a = e ? t(unescape(encodeURIComponent(a))) : G(t(unescape(encodeURIComponent(a))));
    return a;
  };
}
function _GRCRTtpl() {
  function b(a, e) {
    RepConv._tmpl = {str:a, data:e};
    var f = /((^|%>)[^\t]*)'/g;
    a = /\W/.test(a) ? new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('" + a.replace(/[\r\t\n]/g, " ").split("<%").join("\t").replace(f, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'") + "');}return p.join('');") : cache[a] = cache[a] || b(a);
    return e ? a(e) : a;
  }
  function k() {
    require("game/windows/ids").GRCRT_CONVERT = "grcrt_convert";
    (function() {
      var a = window.GameControllers.TabController.extend({render:function() {
        var a = this.getWindowModel(), b = $("<div/>").css({margin:"10px"});
        this.$el.html(b);
        a.hideLoading();
        a.getJQElement || (a.getJQElement = function() {
          return b;
        });
        a.appendContent || (a.appendContent = function(a) {
          return b.append(a);
        });
      }});
      window.GameViews.GrcRTView_grcrt_convert = a;
    })();
    (function() {
      var a = window.GameViews, b = window.WindowFactorySettings, f = require("game/windows/ids"), k = require("game/windows/tabs"), x = f.GRCRT_CONVERT;
      b[x] = function(b) {
        b = b || {};
        return us.extend({window_type:x, minheight:575, maxheight:595, width:870, tabs:[{type:k.INDEX, title:"none", content_view_constructor:a.GrcRTView_grcrt_convert, hidden:!0}], max_instances:1, activepagenr:0, minimizable:!1, resizable:!1, title:RepConv.grcrt_window_icon + RepConv.Scripts_name}, b);
      };
    })();
  }
  this.rct = {};
  this.rcts = {A:{outside:!1, town:"town", player:"player", ally:"ally", island:"island", tag:"quote", fonttag:"monospace", blank:"..........", separator:".", separator3:"...", unitDigits:7, sign:"u", textTown:"", textPlayer:"", textAlly:"", unitSize:"8", getTown:"id", getIsland:"id", morale:RepConvTool.Adds(RepConv.Const.staticImg + RepConv.Const.morale, "img") + " ", luck:RepConvTool.Adds(RepConv.Const.staticImg + RepConv.Const.luck, "img") + " ", nightbonus:RepConvTool.Adds(RepConv.Const.staticImg +
  RepConv.Const.nightbonus, "img") + " ", oldwall:RepConvTool.Adds(RepConv.Const.staticImg + RepConv.Const.oldwall, "img") + " ", genImg:RepConv.grcrt_domain + "static/{0}{1}_37_5.png", genImgS:42, genImgM:5, nullImg:RepConv.grcrt_domain + "static/{0}_{1}_{2}.png", doubleline:"[color=#0000ff]======================================================================================================[/color]", singleline:"[color=#0000ff]------------------------------------------------------------------------------------------------------[/color]",
  tplTableBegin:"[table]", tplTableEnd:"[/table]", tplRowBegin:"", tplRowEnd:"", tplColBegin:"[*]", tplColEnd:"[/*]", tplColSpan2:"[*]", tplColSpan3:"[*]", tplColSpan4:"[*]", tplColSep:"[|]", tplGenImg:RepConv.grcrt_domain + "static/{0}{1}_45_4.png", tplTableNBBegin:"", tplTableNBEnd:"", tplFontBegin:"[font=monospace]", tplFontEnd:"[/font]", tplSize9:"[size=9]", tplSizeEnd:"[/size]", unitWall:15, unitWall2:7, tplBlank:"\u00a0", charLimit:8000, tagLimit:500, spoiler:"spoiler"}, E:{outside:!0, town:"b",
  player:"b", ally:"b", island:"b", tag:"code", fonttag:"Courier New", blank:"          ", separator:" ", separator3:"   ", unitDigits:7, sign:"f", textTown:RepConvTool.GetLabel("TOWN"), textPlayer:RepConvTool.GetLabel("PLAYER"), textAlly:RepConvTool.GetLabel("ALLY"), unitSize:"8", getTown:"name", getIsland:"name", morale:"", luck:"", nightbonus:"", oldwall:"", genImg:RepConv.grcrt_domain + "static/{0}{1}_45_4.png", genImgS:45, genImgM:4, nullImg:RepConv.grcrt_domain + "static/{0}_{1}_{2}.png", doubleline:"[color=#0000ff]=========================================================[/color]",
  singleline:"[color=#0000ff]---------------------------------------------------------[/color]", tplTableBegin:'[table="width: 710, class: outer_border"]', tplTableEnd:"[/table]", tplRowBegin:"[tr]", tplRowEnd:"[/tr]", tplColBegin:"[td]", tplColEnd:"[/td]", tplColSpan2:'[td="colspan: 2"]', tplColSpan3:'[td="colspan: 3"]', tplColSpan4:'[td="colspan: 4"]', tplColSep:"[/td][td]", tplGenImg:RepConv.grcrt_domain + "static/{0}{1}_45_4.png", tplTableNBBegin:'[tr][td="colspan: 3"]', tplTableNBEnd:"[/td][/tr]",
  tplFontBegin:"[font=Courier New]", tplFontEnd:"[/font]", tplSize9:"", tplSizeEnd:"", unitWall:15, unitWall2:7, tplBlank:"\u00a0", charLimit:99999, tagLimit:99999, spoiler:"spr"}, I:{outside:!1, town:"town", player:"player", ally:"ally", island:"island", tag:"quote", fonttag:"monospace", blank:"..........", separator:".", separator3:"...", unitDigits:7, sign:"u", textTown:"", textPlayer:"", textAlly:"", unitSize:"8", getTown:"name", getIsland:"name", morale:RepConvTool.Adds(RepConv.Const.staticImg +
  RepConv.Const.morale, "img") + " ", luck:RepConvTool.Adds(RepConv.Const.staticImg + RepConv.Const.luck, "img") + " ", nightbonus:RepConvTool.Adds(RepConv.Const.staticImg + RepConv.Const.nightbonus, "img") + " ", oldwall:RepConvTool.Adds(RepConv.Const.staticImg + RepConv.Const.oldwall, "img") + " ", genImg:RepConv.grcrt_domain + "static/{0}{1}_37_5.png", genImgS:42, genImgM:5, nullImg:RepConv.grcrt_domain + "static/{0}_{1}_{2}.png", doubleline:"[color=#0000ff]======================================================================================================[/color]",
  singleline:"[color=#0000ff]------------------------------------------------------------------------------------------------------[/color]", tplTableBegin:"[table]", tplTableEnd:"[/table]", tplRowBegin:"", tplRowEnd:"", tplColBegin:"[*]", tplColEnd:"[/*]", tplColSpan2:"[*]", tplColSpan3:"[*]", tplColSpan4:"[*]", tplColSep:"[|]", tplGenImg:RepConv.grcrt_domain + "static/{0}{1}_45_4.png", tplTableNBBegin:"", tplTableNBEnd:"", tplFontBegin:"[font=monospace]", tplFontEnd:"[/font]", tplSize9:"[size=9]",
  tplSizeEnd:"[/size]", unitWall:15, unitWall2:7, tplBlank:"\u00a0", charLimit:8000, tagLimit:500, spoiler:"spoiler"}};
  this.reportText = function(a, e) {
    var f = !0;
    var k = "[b]<%=GRCRTtpl.AddSize(time+title,9)%> (##/##)[/b]\\n<%=GRCRTtpl.rct.doubleline%>\\n";
    switch(a) {
      case "command":
        k += "<%=attacker.town%> <%=attacker.player%>\\n<%=detail.time_title%> <%=detail.time_time%>\\n<%=attacker.units_title%>\\n<%  if (attacker.full.img_url != '') {%><%=attacker.full.img_url%> <%=detail.power_img%>\\n<%  }else{%><%=RepConvTool.GetLabel('NOTUNIT')%>\\n<%  }%><%=GRCRTtpl.rct.singleline%>\\n<%=defender.town%> <%=defender.player%>\\n<%  if(resources.title!=null){%><%=GRCRTtpl.rct.singleline%>\\n<%=GRCRTtpl.AddSize(resources.title,9)%>\\n<%=resources.img_url%>\\n<%  }%>";
        break;
      case "conquer":
      case "illusion":
        k += "[b]<%=GRCRTtpl.AddSize(RepConvTool.GetLabel('ATTACKER'),10)%>[/b]: <%=attacker.town%> <%=attacker.player%> <%=attacker.ally%> <%=GRCRTtpl.AddSize(morale+' '+luck,8)%>\\n<%=GRCRTtpl.rct.singleline%>\\n[b]<%=GRCRTtpl.AddSize(RepConvTool.GetLabel('DEFENDER'),10)%>[/b]: <%=defender.town%> <%=defender.player%> <%=defender.ally%> <%if(Object.size(oldwall)>0){%><%=GRCRTtpl.AddSize(oldwall[0]+' '+nightbonus,8)%><%}%>\\n<%=GRCRTtpl.rct.singleline%>\\n<%=detail%>\\n";
        break;
      case "raise":
      case "breach":
      case "attack":
      case "take_over":
        k += "[b]<%=GRCRTtpl.AddSize(RepConvTool.GetLabel('ATTACKER'),10)%>[/b]: <%=attacker.town%> <%=attacker.player%> <%=attacker.ally%> <%=GRCRTtpl.AddSize(morale+' '+luck,8)%>\\n<%=attacker.full.img_url%><%=powerAtt%>\\n<%=GRCRTtpl.rct.singleline%>\\n[b]<%=GRCRTtpl.AddSize(RepConvTool.GetLabel('DEFENDER'),10)%>[/b]: <%=defender.town%> <%=defender.player%> <%=defender.ally%> <%if(Object.size(oldwall)>0){%><%=GRCRTtpl.AddSize(oldwall[0]+' '+nightbonus,8)%><%}%>\\n<%=defender.full.img_url%><%=powerDef%>\\n<%=GRCRTtpl.rct.singleline%>\\n<%=GRCRTtpl.AddSize(resources.title,9)%>\\n<%=resources.img_url%>\\n" +
        ("" != e.bunt ? '<%if ( bunt.length > 0){%><%=GRCRTtpl.rct.singleline%>\\n<%=RepConvTool.Adds(RepConv.Const.bunt,"img")%> <%=bunt%>\\n<%}%>' : "") + "<%=GRCRTtpl.rct.singleline%>\\n" + (e.showCost ? '<%=GRCRTtpl.rct.separator3%><%=RepConvTool.Adds(RepConv.Const.unitImg+GRCRTtpl.rct.sign+"Z1Z2Z3Z4Z5.png","img")%><%=GRCRTtpl.rct.separator3%>[b]<%=GRCRTtpl.AddSize(RepConvTool.GetLabel(\'LOSSES\'),9)%>[/b]\\n<%if ( attacker.w != undefined ){%><%=GRCRTtpl.AddSize(GRCRTtpl.Value(attacker.w,10)+GRCRTtpl.Value(attacker.s,10)+GRCRTtpl.Value(attacker.i,10)+GRCRTtpl.Value(attacker.p,10)+GRCRTtpl.Value(attacker.f,10)+" [b]"+RepConvTool.GetLabel(\'ATTACKER\')+"[/b]",8)%>\\n<%}%><%=GRCRTtpl.AddSize(GRCRTtpl.Value(defender.w,10)+GRCRTtpl.Value(defender.s,10)+GRCRTtpl.Value(defender.i,10)+GRCRTtpl.Value(defender.p,10)+GRCRTtpl.Value(defender.f,10)+" [b]"+RepConvTool.GetLabel(\'DEFENDER\')+"[/b]",8)%>\\n' :
        "");
        break;
      case "conqueroldtroops":
        k = "[b]<%=GRCRTtpl.AddSize(command.title,9)%>[/b] (##/##)\\n" + (0 < Object.size(e.linia) ? "=#=#=<%for(ind in linia){%><%=GRCRTtpl.rct.singleline%>\\n<%=linia[ind].img%> <%=linia[ind].inout%> (<%=linia[ind].time%>) <%=linia[ind].text%>\\n=#=#=<%}%>" : "");
        break;
      case "commandList":
        k += "=#=#=<%for(ind in linia){%><%  if (ind > 0){%><%=GRCRTtpl.rct.singleline%>\\n<%  }%><%  if (linia[ind].title.length>0) {%><%=linia[ind].title%>\\n<%  } else {%><%=linia[ind].img%> <%=linia[ind].time%> <%=linia[ind].townIdA.full%> <%=linia[ind].inout%> <%=linia[ind].townIdB.full%>\\n<%=linia[ind].img_url%>  <%=linia[ind].power%>\\n<%  }%>=#=#=<%}%>";
        break;
      case "conquerold":
        k = "[b]<%=GRCRTtpl.AddSize(title+time,9)%>[/b]\\n<%=GRCRTtpl.rct.doubleline%>\\n<%=defender.town%> <%=defender.player%>\\n<%=GRCRTtpl.rct.singleline%>\\n<%=attacker.units_title%>\\n<%=attacker.full.img_url%>\\n";
        break;
      case "support":
        k += "[b]<%=GRCRTtpl.AddSize(RepConvTool.GetLabel('ATTACKER'),10)%>[/b]: <%=attacker.town%> <%=attacker.player%> <%=attacker.ally%> <%=GRCRTtpl.AddSize(morale+' '+luck,8)%>\\n[b]<%=GRCRTtpl.AddSize(RepConvTool.GetLabel('DEFENDER'),10)%>[/b]: <%=defender.town%> <%=defender.player%> <%=defender.ally%> <%if(Object.size(oldwall)>0){%><%=GRCRTtpl.AddSize(oldwall[0]+' '+nightbonus,8)%><%}%>\\n<%=GRCRTtpl.rct.singleline%>\\n<%=attacker.full.img_url%>\\n";
        break;
      case "attackSupport":
        k += "[b]<%=GRCRTtpl.AddSize(RepConvTool.GetLabel('ATTACKER'),10)%>[/b]: <%=attacker.town%> <%=attacker.player%> <%=attacker.ally%> <%=GRCRTtpl.AddSize(morale+' '+luck,8)%>\\n<%=GRCRTtpl.rct.singleline%>\\n[b]<%=GRCRTtpl.AddSize(RepConvTool.GetLabel('DEFENDER'),10)%>[/b]: <%=defender.town%> <%=defender.player%> <%=defender.ally%> <%if(Object.size(oldwall)>0){%><%=GRCRTtpl.AddSize(oldwall[0]+' '+nightbonus,8)%><%}%>\\n<%=defender.full.img_url%><%=powerDef%>\\n<%=GRCRTtpl.rct.singleline%>\\n" +
        (e.showCost ? '<%=GRCRTtpl.rct.separator3%><%=RepConvTool.Adds(RepConv.Const.unitImg+GRCRTtpl.rct.sign+"Z1Z2Z3Z4Z5.png","img")%><%=GRCRTtpl.rct.separator3%>[b]<%=GRCRTtpl.AddSize(RepConvTool.GetLabel(\'LOSSES\'),9)%>[/b]\\n<%if ( attacker.w != undefined ){%><%=GRCRTtpl.AddSize(GRCRTtpl.Value(attacker.w,10)+GRCRTtpl.Value(attacker.s,10)+GRCRTtpl.Value(attacker.i,10)+GRCRTtpl.Value(attacker.p,10)+GRCRTtpl.Value(attacker.f,10)+" [b]"+RepConvTool.GetLabel(\'ATTACKER\')+"[/b]",8)%>\\n<%}%><%=GRCRTtpl.AddSize(GRCRTtpl.Value(defender.w,10)+GRCRTtpl.Value(defender.s,10)+GRCRTtpl.Value(defender.i,10)+GRCRTtpl.Value(defender.p,10)+GRCRTtpl.Value(defender.f,10)+" [b]"+RepConvTool.GetLabel(\'DEFENDER\')+"[/b]",8)%>\\n' :
        "");
        break;
      case "agoraD":
      case "agoraS":
        k += "=#=#=<%for(ind in linia){%><%  if (ind > 0){%><%=GRCRTtpl.rct.singleline%>\\n<%  }%><%=linia[ind].title%>\\n<%=linia[ind].img_url%>\\n=#=#=<%}%>";
        break;
      case "espionage":
        k += "[b]<%=GRCRTtpl.AddSize(RepConvTool.GetLabel('ATTACKER'),10)%>[/b]: <%=attacker.town%> <%=attacker.player%> <%=attacker.ally%> <%=GRCRTtpl.AddSize(morale+' '+luck,8)%>\\n<%=GRCRTtpl.rct.singleline%>\\n[b]<%=GRCRTtpl.AddSize(RepConvTool.GetLabel('DEFENDER'),10)%>[/b]: <%=defender.town%> <%=defender.player%> <%=defender.ally%> <%if(Object.size(oldwall)>0){%><%=GRCRTtpl.AddSize(oldwall[0]+' '+nightbonus,8)%><%}%>\\n<%if (defender.title != null){%><%=defender.title%>\\n<%=defender.full.img_url%>\\n<%}%><%if (build.title != null){%><%=build.title%>\\n<%=build.full.img_url%>\\n<%}%><%=iron.title%>\\n<%if(iron.count!=\"\"){%><%=RepConvTool.Adds(RepConv.Const.unitImg+\"iron.png\",\"img\")%> <%=GRCRTtpl.AddSize(iron.count,8)%>\\n<%}%><%if (resources.title != \"\"){%><%=GRCRTtpl.AddSize(resources.title,8)%>\\n<%=resources.img_url%>\\n<%}%>";
        break;
      case "powers":
        k += "[b]<%=GRCRTtpl.AddSize(RepConvTool.GetLabel('ATTACKER'),10)%>[/b]: <%=attacker.town%> <%=attacker.player%> <%=attacker.ally%> <%=GRCRTtpl.AddSize(morale+' '+luck,8)%>\\n<%=GRCRTtpl.rct.singleline%>\\n[b]<%=GRCRTtpl.AddSize(RepConvTool.GetLabel('DEFENDER'),10)%>[/b]: <%=defender.town%> <%=defender.player%> <%=defender.ally%> <%if(Object.size(oldwall)>0){%><%=GRCRTtpl.AddSize(oldwall[0]+' '+nightbonus,8)%><%}%>\\n<%=power%>\\n<%=efekt.title%>\\n<%if (efekt.detail != null){%><%=efekt.detail.wrapLine(25)%>\\n<%}%><%if (type == 1){%><%}else if (type == 2){%><%=resources.full.img_url%>\\n<%}else if (type == 3){%><%=resources.img_url%>\\n<%}else if (type == 4){%><%}else if (type == 5){%><%=resources.img_url%>\\n<%}%>";
        break;
      case "wall":
        k = '<%=title%>\\n<%=GRCRTtpl.rct.doubleline%>\\n<%if (defeated.title != ""){%><%=GRCRTtpl.AddSize(defeated.title,10)%>\\n<%  if(defeated.titleAttacker != ""){%><%=GRCRTtpl.AddSize(defeated.titleAttacker,8)%>\\n<%    for(ind in defeated.attacker){%><%=defeated.attacker[ind].img_url%>\\n<%    }%><%  }%><%  if(defeated.titleDefender != ""){%><%=GRCRTtpl.AddSize(defeated.titleDefender,8)%>\\n<%    for(ind in defeated.defender){%><%=defeated.defender[ind].img_url%>\\n<%    }%><%  }%><%}%><%if (losses.title != ""){%><%  if (defeated.title != ""){%><%=GRCRTtpl.rct.doubleline%>\\n<%  }%><%=GRCRTtpl.AddSize(losses.title,10)%>\\n<%  if(losses.titleAttacker != ""){%><%=GRCRTtpl.AddSize(losses.titleAttacker,8)%>\\n<%    for(ind in losses.attacker){%><%=losses.attacker[ind].img_url%>\\n<%    }%><%  }%><%  if(losses.titleDefender != ""){%><%=GRCRTtpl.AddSize(losses.titleDefender,8)%>\\n<%    for(ind in losses.defender){%><%=losses.defender[ind].img_url%>\\n<%    }%><%  }%><%}%>';
        break;
      case "found":
        k += "[b]<%=GRCRTtpl.AddSize(RepConvTool.GetLabel('ATTACKER'),10)%>[/b]: <%=attacker.town%> <%=attacker.player%> <%=attacker.ally%> <%=GRCRTtpl.AddSize(morale+' '+luck,8)%>\\n[b]<%=GRCRTtpl.AddSize(RepConvTool.GetLabel('DEFENDER'),10)%>[/b]: <%=defender.town%> <%=defender.player%> <%=defender.ally%> <%if(Object.size(oldwall)>0){%><%=GRCRTtpl.AddSize(oldwall[0]+' '+nightbonus,8)%><%}%>\\n<%=GRCRTtpl.rct.singleline%>\\n<%=detail%>\\n";
        break;
      case "conquest":
        k = "[b]<%=GRCRTtpl.AddSize(title,9)%>[/b]\\n<%=defender.town%> (<%=time%>)\\n<%=GRCRTtpl.rct.singleline%>\\n[b]<%=GRCRTtpl.AddSize(RepConvTool.GetLabel('ATTACKER'),10)%>[/b]: <%=attacker.town%> <%=attacker.player%> <%=attacker.ally%> <%=GRCRTtpl.AddSize(morale+' '+luck,8)%>\\n<%=GRCRTtpl.rct.singleline%>\\n<%=attacker.units_title%>\\n<%for(ind in attacker.splits){%><%=  attacker.splits[ind].img_url%>\\n<%}%><%=GRCRTtpl.rct.singleline%>\\n[b]<%=GRCRTtpl.AddSize(command.title,9)%>[/b] (##/##)\\n" +
        (0 < Object.size(e.linia) ? "=#=#=<%for(ind in linia){%><%=GRCRTtpl.rct.singleline%>\\n<%=linia[ind].img%> <%=linia[ind].inout%> (<%=linia[ind].time%>) <%=linia[ind].text%>\\n=#=#=<%}%>" : "");
        break;
      case "academy":
        k += '<%for(ind in linia){%><%=RepConvTool.Adds((GRCRTtpl.rct.tplGenImg).RCFormat(GRCRTtpl.rct.sign, linia[ind].unit_list), "img")%>\\n\\n<%}%>[b]<%=GRCRTtpl.AddSize(points,9)%>[/b]\\n';
        break;
      case "ownTropsInTheCity":
        k += "<%=defender.full.img_url%>\\n";
        break;
      case "bbcode_island":
      case "bbcode_player":
      case "bbcode_alliance":
        k = "<%=GRCRTtpl.AddSize(header,9)%> (##/##)\\n=#=#=<%for(ind in linia){%><%=ind%> <%=linia[ind].col1%>. <%=linia[ind].col2%> <%=linia[ind].col3%> <%=linia[ind].col4%>\\n=#=#=<%}%>", f = !1;
    }
    k = RepConvTool.Adds(RepConvTool.AddFont(k + (f ? "<%=GRCRTtpl.rct.doubleline%>\\n<%=RepConv.Const.footer%>" : ""), GRCRTtpl.rct.fonttag), GRCRTtpl.rct.tag);
    k = (e.showRT && "" != e.rtrevolt ? "[quote][table]\\n[*][|]<%=defender.town%>[/*]\\n[*]<%=RepConvTool.Adds(RepConv.Const.bunt2,\"img\")%>[||]<%=GRCRTtpl.AddSize(rtrevolt,11)%>[/*]\\n[/table]\\n[table]\\n[*]<%=GRCRTtpl.AddSize(rtlabels.wall,10)%>[||] <%=GRCRTtpl.AddSize(rtwall.toString(),11)%> [|]<%=GRCRTtpl.AddSize(rtlabels.ram,10)%>[||] <%=GRCRTtpl.AddSize(rtram,11)%> [/*]\\n[*]<%=GRCRTtpl.AddSize(rtlabels.tower,10)%>[||] <%=GRCRTtpl.AddSize(rttower,11)%> [|]<%=GRCRTtpl.AddSize(rtlabels.phalanx,10)%>[||] <%=GRCRTtpl.AddSize(rtphalanx,11)%> [/*]\\n[*]<%=GRCRTtpl.AddSize(rtlabels.god,10)%>[||] <%=GRCRTtpl.AddSize(rtgod||'',11)%> [|]<%=GRCRTtpl.AddSize(rtlabels.captain,10)%>[||] <%=GRCRTtpl.AddSize(rtpremium.captain,11)%> [/*]\\n[*]<%=GRCRTtpl.AddSize(rtlabels.cstime,10)%>[||] <%=GRCRTtpl.AddSize(rtcstime,11)%> [|]<%=GRCRTtpl.AddSize(rtlabels.commander,10)%>[||] <%=GRCRTtpl.AddSize(rtpremium.commander,11)%> [/*]\\n[*]<%=GRCRTtpl.AddSize(rtlabels.online,10)%>[||] <%=GRCRTtpl.AddSize(rtonline,11)%> [|]<%=GRCRTtpl.AddSize(rtlabels.priest,10)%>[||] <%=GRCRTtpl.AddSize(rtpremium.priest,11)%> [/*]\\n[/table][/quote]\\n\\n" :
    "") + k;
    return b(k, e);
  };
  this.reportHtml = function(a, e) {
    var f = "[b]<%=GRCRTtpl.AddSize(time+title,9)%> (##/##)[/b]\\n";
    switch(a) {
      case "command":
        f += GRCRTtpl.rct.tplTableBegin + "<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.addLine(245)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(190)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(245)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%><%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(((attacker.town != undefined) ? attacker.town+'\\n' : '')+((attacker.player != undefined) ? attacker.player+'\\n' : '')+((attacker.ally != undefined) ? attacker.ally+'\\n' : ''),10), GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.AddFont('[img]'+RepConv.grcrt_cdn+'ui/ragB.png[/img][img]'+RepConv.grcrt_cdn+'ui/5/'+reportImage+'.png[/img][img]'+RepConv.grcrt_cdn+'ui/ragE.png[/img]', GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(((defender.town != undefined) ? defender.town+'\\n' : '')+((defender.player != undefined) ? defender.player+'\\n' : '')+((defender.ally != undefined) ? defender.ally+'\\n' : ''),10), GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>" +
        (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplTableNBBegin : GRCRTtpl.rct.tplTableEnd) + "[center]<%=RepConv.Const.footer%>[/center]" + (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplTableNBEnd : GRCRTtpl.rct.tplTableBegin) + "<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColSpan3%><%=GRCRTtpl.rct.tplFontBegin+GRCRTtpl.rct.tplSize9%><%=detail.time_title%> <%=detail.time_time%>\\n<%=attacker.units_title%>\\n<%  if (attacker.full.img_url != '') {%><%=attacker.full.img_url%> <%=detail.power_img%>\\n<%  }else{%><%=RepConvTool.GetLabel('NOTUNIT')%>\\n<%  }%><%  if(resources.title!=null){%><%=GRCRTtpl.rct.tplFontBegin%>[b]<%=GRCRTtpl.AddSize(resources.title.wrapLine(25),10)%>[/b]<%    if ((resources.img_url||'').length > 0){%>\\n<%=resources.img_url %><%    }%><%=GRCRTtpl.rct.tplFontEnd%><%  }%><%=RepConvTool.addLine(698)%><%=GRCRTtpl.rct.tplSizeEnd+GRCRTtpl.rct.tplFontEnd%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd %>" +
        GRCRTtpl.rct.tplTableEnd;
        break;
      case "take_over":
        f = (e.showRT && "" != e.rtrevolt ? "<%=GRCRTtpl.rct.tplTableBegin + GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.Adds(RepConv.Const.bunt2,\"img\")%><%=GRCRTtpl.rct.tplColSep%><%  if(GRCRTtpl.rct.outside){%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(defender.town,11)+'\\n'+GRCRTtpl.AddSize(rtrevolt,10)+'\\n', GRCRTtpl.rct.fonttag)%><%  }else{%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(defender.town,11)+'\\n'+GRCRTtpl.AddSize(rtrevolt,10)+'\\n'+RepConvTool.addLine(200), GRCRTtpl.rct.fonttag)%><%  }%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.Adds(RepConv.Const.unitImg+GRCRTtpl.rct.sign+\"G2_32_5.png\",\"img\")%><%=GRCRTtpl.rct.tplColSep%><%  if(GRCRTtpl.rct.outside){%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(rtlabels.cstime,10)+'\\n'+GRCRTtpl.AddSize(rtcstime,11)+'\\n', GRCRTtpl.rct.fonttag)%><%  }else{%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(rtlabels.cstime,10)+'\\n'+GRCRTtpl.AddSize(rtcstime,11)+'\\n'+RepConvTool.addLine(120), GRCRTtpl.rct.fonttag)%><%  }%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.Adds(RepConv.Const.uiImg + 'c/attack.png',\"img\")%><%=GRCRTtpl.rct.tplColSep%><%  if(GRCRTtpl.rct.outside){%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(GRCRTtpl.Unit(unit_movements.attack,4).replace(/\\./g,GRCRTtpl.rct.tplBlank),10)+'\\n', GRCRTtpl.rct.fonttag)%><%  }else{%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(GRCRTtpl.Unit(unit_movements.attack,4).replace(/\\./g,GRCRTtpl.rct.tplBlank),10)+'\\n'+RepConvTool.addLine(40), GRCRTtpl.rct.fonttag)%><%  }%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.Adds(RepConv.Const.uiImg + 'c/support.png',\"img\")%><%=GRCRTtpl.rct.tplColSep%><%  if(GRCRTtpl.rct.outside){%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(GRCRTtpl.Unit(unit_movements.support,4).replace(/\\./g,GRCRTtpl.rct.tplBlank),10)+'\\n', GRCRTtpl.rct.fonttag)%><%  }else{%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(GRCRTtpl.Unit(unit_movements.support,4).replace(/\\./g,GRCRTtpl.rct.tplBlank),10)+'\\n'+RepConvTool.addLine(40), GRCRTtpl.rct.fonttag)%><%  }%><%=GRCRTtpl.rct.tplColSep%><%  if(GRCRTtpl.rct.outside){%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(rtlabels.online,10)+'\\n[b]'+GRCRTtpl.AddSize(rtonline,11)+'[/b]'+'\\n', GRCRTtpl.rct.fonttag)%><%  }else{%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(rtlabels.online,10)+'\\n[b]'+GRCRTtpl.AddSize(rtonline,11)+'[/b]'+'\\n'+RepConvTool.addLine(98), GRCRTtpl.rct.fonttag)%><%  }%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd + GRCRTtpl.rct.tplTableEnd%><%=GRCRTtpl.rct.tplTableBegin + GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.AddFont(RepConvTool.Adds(RepConv.Const.unitImg+GRCRTtpl.rct.sign+rtimg+\"_45_7.png\",\"img\")+\" \"+RepConvTool.Adds(RepConv.Const.uiImg+\"5/\"+rtgodid+\".png\",\"img\")+GRCRTtpl.AddSize((rtgod||'').replace(/\\./g,GRCRTtpl.rct.tplBlank),15)+'\\n'+RepConvTool.addLine(698), GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd + GRCRTtpl.rct.tplTableEnd%>" :
        "") + f;
      case "raise":
      case "breach":
      case "attack":
        f += GRCRTtpl.rct.tplTableBegin + "<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.addLine(245)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(190)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(245)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%><%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(((attacker.town != undefined) ? attacker.town+'\\n' : '')+((attacker.player != undefined) ? attacker.player+'\\n' : '')+((attacker.ally != undefined) ? attacker.ally+'\\n' : ''),10), GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.AddFont('[img]'+RepConv.grcrt_cdn+'ui/ragB.png[/img][img]'+RepConv.grcrt_cdn+'ui/5/'+reportImage+'.png[/img][img]'+RepConv.grcrt_cdn+'ui/ragE.png[/img]', GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(((defender.town != undefined) ? defender.town+'\\n' : '')+((defender.player != undefined) ? defender.player+'\\n' : '')+((defender.ally != undefined) ? defender.ally+'\\n' : ''),10), GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>" +
        (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplTableNBBegin : GRCRTtpl.rct.tplTableEnd) + "[center]<%=RepConv.Const.footer%>[/center]" + (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplTableNBEnd : GRCRTtpl.rct.tplTableBegin) + GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin + "<%if(powerAtt.length>0){%><%=powerAtt%>\\n<%}%><%=GRCRTtpl.rct.tplFontBegin+GRCRTtpl.rct.tplSize9%>\\n<%=morale%>\\n<%=luck%>\\n<%=GRCRTtpl.rct.tplSizeEnd+GRCRTtpl.rct.tplFontEnd%><%=GRCRTtpl.rct.tplFontBegin+GRCRTtpl.rct.tplSize9%><%for(idx in attacker.splits){%><%=attacker.splits[idx].img_url %>\\n<%}%><%=GRCRTtpl.rct.tplSizeEnd+GRCRTtpl.rct.tplFontEnd%>" +
        GRCRTtpl.rct.tplColSep + "[center]<%=GRCRTtpl.rct.tplFontBegin%>[b]<%=GRCRTtpl.AddSize(resources.title.wrapLine(25),10)%>[/b]\\n<%=resources.img_url %><%=GRCRTtpl.rct.tplFontEnd%>[/center]\\n" + ("" != e.bunt ? "[center]<%=GRCRTtpl.rct.tplFontBegin%>\\n[b]<%=GRCRTtpl.AddSize(bunt.wrapLine(25),10)%>[/b]\\n<%=GRCRTtpl.rct.tplFontEnd%>[/center]" : "") + (e.showCost ? "[center]<%=GRCRTtpl.rct.tplFontBegin%>\\n<%=GRCRTtpl.Value(attacker.w.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%>\u00a0[img]<%= RepConv.grcrt_cdn %>ui/wood.png[/img]\u00a0<%=GRCRTtpl.Value(defender.w.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%>\\n<%=GRCRTtpl.Value(attacker.s.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%>\u00a0[img]<%= RepConv.grcrt_cdn %>ui/stone.png[/img]\u00a0<%=GRCRTtpl.Value(defender.s.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%>\\n<%=GRCRTtpl.Value(attacker.i.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%>\u00a0[img]<%= RepConv.grcrt_cdn %>ui/iron.png[/img]\u00a0<%=GRCRTtpl.Value(defender.i.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%>\\n<%=GRCRTtpl.Value(attacker.f.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%>\u00a0[img]<%= RepConv.grcrt_cdn %>ui/power.png[/img]\u00a0<%=GRCRTtpl.Value(defender.f.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%>\\n<%=GRCRTtpl.Value(attacker.p.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%>\u00a0[img]<%= RepConv.grcrt_cdn %>ui/pop.png[/img]\u00a0<%=GRCRTtpl.Value(defender.p.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%><%=GRCRTtpl.rct.tplFontEnd%>[/center]\\n" :
        "") + GRCRTtpl.rct.tplColSep + "<%if(powerDef.length>0){%><%=powerDef%>\\n<%}%><%=GRCRTtpl.rct.tplFontBegin+GRCRTtpl.rct.tplSize9%>\\n<%for(idx in oldwall){%><%=oldwall[idx]%> \\n<%}%><%=nightbonus%> \\n<%=GRCRTtpl.rct.tplSizeEnd+GRCRTtpl.rct.tplFontEnd%><%=GRCRTtpl.rct.tplFontBegin+GRCRTtpl.rct.tplSize9%><%for(idx in defender.splits){%><%=defender.splits[idx].img_url %>\\n<%}%><%=GRCRTtpl.rct.tplSizeEnd+GRCRTtpl.rct.tplFontEnd%>" + GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd + "<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.addLine(245)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(190)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(245)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>" +
        GRCRTtpl.rct.tplTableEnd;
        break;
      case "conqueroldtroops":
        f = GRCRTtpl.rct.tplTableBegin + "<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.addLine(32)%><%=GRCRTtpl.rct.tplColSep%><%=GRCRTtpl.rct.tplFontBegin %>[b]<%=GRCRTtpl.AddSize(command.title,10)%>[/b] (##/##)\\n<%=RepConvTool.addLine(302)%><%=GRCRTtpl.rct.tplFontEnd %><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(32)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(302)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>" + (0 < Object.size(e.linia) ? "=#=#=<%for(xx = 0; xx < Object.size(linia); xx+=2){%><%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=linia[xx].img%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.AddFont(GRCRTtpl.AddSize('('+linia[xx].time+')\\n'+linia[xx].text,8), GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColSep%><%  if(Object.size(linia[xx+1])>0){%><%=linia[xx+1].img%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.AddFont(GRCRTtpl.AddSize('('+linia[xx+1].time+')\\n'+linia[xx+1].text,8), GRCRTtpl.rct.fonttag)%><%  } else {%><%=GRCRTtpl.rct.tplColSep%><%  }%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>=#=#=<%}%>" :
        "") + GRCRTtpl.rct.tplTableEnd + "[center]<%=RepConv.Const.footer%>[/center]";
        break;
      case "commandList":
        f += GRCRTtpl.rct.tplTableBegin + "=#=#=<%for(ind in linia){%><%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%  if (linia[ind].title.length>0) {%><%=GRCRTtpl.rct.tplColSep%>[b]<%=GRCRTtpl.AddSize(linia[ind].title,10)%>[/b]<%=GRCRTtpl.rct.tplColSep%><%=GRCRTtpl.rct.tplColSep%><%  } else {%><%=linia[ind].img%><%=GRCRTtpl.rct.tplColSep%><%=GRCRTtpl.rct.tplFontBegin%><%=linia[ind].townIdA.full%> <%=linia[ind].inout%> <%=linia[ind].townIdB.full%>\\n<%=linia[ind].time%><%=GRCRTtpl.rct.tplFontEnd%><%=GRCRTtpl.rct.tplColSep%><%=linia[ind].power%><%=GRCRTtpl.rct.tplColSep%><%=linia[ind].img_url%>\\n<%  }%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>=#=#=<%}%><%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.addLine(35)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(380)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(25)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(265)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>" +
        GRCRTtpl.rct.tplTableEnd + "[center]<%=RepConv.Const.footer%>[/center]";
        break;
      case "conquerold":
        f = GRCRTtpl.rct.tplTableBegin + "<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColSpan4%><%=GRCRTtpl.rct.tplFontBegin + GRCRTtpl.rct.tplSize9 %>[b]<%=title%>[/b]\\n<%=defender.town%> <%=time%>\\n<%=attacker.units_title%>\\n<%=attacker.full.img_url%>\\n<%=RepConvTool.addLine(698)%><%=GRCRTtpl.rct.tplSizeEnd + GRCRTtpl.rct.tplFontEnd%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>" + GRCRTtpl.rct.tplTableEnd + "[center]<%=RepConv.Const.footer%>[/center]";
        break;
      case "support":
        f += GRCRTtpl.rct.tplTableBegin + "<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.addLine(245)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(190)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(245)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%><%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(((attacker.town != undefined) ? attacker.town+'\\n' : '')+((attacker.player != undefined) ? attacker.player+'\\n' : '')+((attacker.ally != undefined) ? attacker.ally+'\\n' : ''),10), GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.AddFont('[img]'+RepConv.grcrt_cdn+'ui/ragB.png[/img][img]'+RepConv.grcrt_cdn+'ui/5/'+reportImage+'.png[/img][img]'+RepConv.grcrt_cdn+'ui/ragE.png[/img]', GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(((defender.town != undefined) ? defender.town+'\\n' : '')+((defender.player != undefined) ? defender.player+'\\n' : '')+((defender.ally != undefined) ? defender.ally+'\\n' : ''),10), GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>" +
        (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplTableNBBegin : GRCRTtpl.rct.tplTableEnd) + "[center]<%=RepConv.Const.footer%>[/center]" + (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplTableNBEnd : GRCRTtpl.rct.tplTableBegin) + GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColSpan3 + "<%=GRCRTtpl.rct.tplFontBegin+GRCRTtpl.rct.tplSize9%><%for(idx in attacker.splits){%><%=attacker.splits[idx].img_url %>\\n<%}%><%=GRCRTtpl.rct.tplSizeEnd+GRCRTtpl.rct.tplFontEnd%>" + GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd +
        "<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.addLine(245)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(190)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(245)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>" + GRCRTtpl.rct.tplTableEnd;
        break;
      case "attackSupport":
        f += GRCRTtpl.rct.tplTableBegin + "<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.addLine(245)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(190)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(245)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%><%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(((attacker.town != undefined) ? attacker.town+'\\n' : '')+((attacker.player != undefined) ? attacker.player+'\\n' : '')+((attacker.ally != undefined) ? attacker.ally+'\\n' : ''),10), GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.AddFont('[img]'+RepConv.grcrt_cdn+'ui/ragB.png[/img][img]'+RepConv.grcrt_cdn+'ui/5/'+reportImage+'.png[/img][img]'+RepConv.grcrt_cdn+'ui/ragE.png[/img]', GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(((defender.town != undefined) ? defender.town+'\\n' : '')+((defender.player != undefined) ? defender.player+'\\n' : '')+((defender.ally != undefined) ? defender.ally+'\\n' : ''),10), GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>" +
        (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplTableNBBegin : GRCRTtpl.rct.tplTableEnd) + "[center]<%=RepConv.Const.footer%>[/center]" + (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplTableNBEnd : GRCRTtpl.rct.tplTableBegin) + GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin + GRCRTtpl.rct.tplColSep + (e.showCost ? "[center]<%=GRCRTtpl.rct.tplFontBegin%>\\n<%=GRCRTtpl.Value(attacker.w.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%>\u00a0[img]<%= RepConv.grcrt_cdn %>ui/wood.png[/img]\u00a0<%=GRCRTtpl.Value(defender.w.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%>\\n<%=GRCRTtpl.Value(attacker.s.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%>\u00a0[img]<%= RepConv.grcrt_cdn %>ui/stone.png[/img]\u00a0<%=GRCRTtpl.Value(defender.s.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%>\\n<%=GRCRTtpl.Value(attacker.i.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%>\u00a0[img]<%= RepConv.grcrt_cdn %>ui/iron.png[/img]\u00a0<%=GRCRTtpl.Value(defender.i.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%>\\n<%=GRCRTtpl.Value(attacker.f.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%>\u00a0[img]<%= RepConv.grcrt_cdn %>ui/power.png[/img]\u00a0<%=GRCRTtpl.Value(defender.f.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%>\\n<%=GRCRTtpl.Value(attacker.p.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%>\u00a0[img]<%= RepConv.grcrt_cdn %>ui/pop.png[/img]\u00a0<%=GRCRTtpl.Value(defender.p.toString(),7).replace(/\\./g,GRCRTtpl.rct.tplBlank)%><%=GRCRTtpl.rct.tplFontEnd%>[/center]\\n" :
        "") + GRCRTtpl.rct.tplColSep + "<%=GRCRTtpl.rct.tplFontBegin+GRCRTtpl.rct.tplSize9%><%for(idx in defender.splits){%><%=defender.splits[idx].img_url %>\\n<%}%><%=GRCRTtpl.rct.tplSizeEnd+GRCRTtpl.rct.tplFontEnd%>" + GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd + "<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.addLine(245)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(190)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(245)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>" +
        GRCRTtpl.rct.tplTableEnd;
        break;
      case "agoraD":
      case "agoraS":
        f += GRCRTtpl.rct.tplTableBegin + "=#=#=<%for(ind in linia){%><%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin + GRCRTtpl.rct.tplFontBegin + GRCRTtpl.rct.tplSize9%><%=linia[ind].title%>\\n<%=RepConvTool.addLine(698)%>\\n<%=linia[ind].img_url%><%=GRCRTtpl.rct.tplSizeEnd + GRCRTtpl.rct.tplFontEnd + GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>=#=#=<%}%>" + (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplTableNBBegin : GRCRTtpl.rct.tplTableEnd) + "[center]<%=RepConv.Const.footer%>[/center]" +
        (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplTableNBEnd + GRCRTtpl.rct.tplTableEnd : "");
        break;
      case "espionage":
        f += GRCRTtpl.rct.tplTableBegin + "<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.addLine(245)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(190)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(245)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%><%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(((attacker.town != undefined) ? attacker.town+'\\n' : '')+((attacker.player != undefined) ? attacker.player+'\\n' : '')+((attacker.ally != undefined) ? attacker.ally+'\\n' : ''),10), GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.AddFont('[img]'+RepConv.grcrt_cdn+'ui/ragB.png[/img][img]'+RepConv.grcrt_cdn+'ui/5/'+reportImage+'.png[/img][img]'+RepConv.grcrt_cdn+'ui/ragE.png[/img]', GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(((defender.town != undefined) ? defender.town+'\\n' : '')+((defender.player != undefined) ? defender.player+'\\n' : '')+((defender.ally != undefined) ? defender.ally+'\\n' : ''),10), GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>" +
        (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplTableNBBegin : GRCRTtpl.rct.tplTableEnd) + "[center]<%=RepConv.Const.footer%>[/center]" + (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplTableNBEnd : GRCRTtpl.rct.tplTableBegin) + GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColSpan2 + GRCRTtpl.rct.tplFontBegin + GRCRTtpl.rct.tplSize9 + "<%if (defender.title != null){%>[b]<%=defender.title%>[/b]\\n<%      for(idx in defender.splits){%><%=defender.splits[idx].img_url %>\\n<%      }%><%}%><%if (build.title != null){%>[b]<%=build.title%>[/b]\\n<%      for(idx in build.splits){%><%=build.splits[idx].img_url %>\\n<%      }%><%}%>" +
        GRCRTtpl.rct.tplSizeEnd + GRCRTtpl.rct.tplFontEnd + GRCRTtpl.rct.tplColSep + GRCRTtpl.rct.tplFontBegin + GRCRTtpl.rct.tplSize9 + '[b]<%=iron.title%>[/b]\\n<%if(iron.count!=""){%><%=RepConvTool.Adds(RepConv.Const.uiImg + "5/coins.png", "img")%> [b]<%=GRCRTtpl.AddSize(iron.count,12)%>[/b]\\n<%}%><%if (resources.title != ""){%>\\n\\n[b]<%=resources.title%>[/b]\\n<%=resources.img_url%>\\n<%}%>' + GRCRTtpl.rct.tplSizeEnd + GRCRTtpl.rct.tplFontEnd + GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd +
        "<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColSpan2%><%=RepConvTool.addLine(472)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(218)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>" + GRCRTtpl.rct.tplTableEnd;
        break;
      case "powers":
        f += GRCRTtpl.rct.tplTableBegin + "<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.addLine(245)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(190)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(245)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%><%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(((attacker.town != undefined) ? attacker.town+'\\n' : '')+((attacker.player != undefined) ? attacker.player+'\\n' : '')+((attacker.ally != undefined) ? attacker.ally+'\\n' : ''),10), GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.AddFont('[img]'+RepConv.grcrt_cdn+'ui/ragB.png[/img][img]'+RepConv.grcrt_cdn+'ui/5/'+reportImage+'.png[/img][img]'+RepConv.grcrt_cdn+'ui/ragE.png[/img]', GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(((defender.town != undefined) ? defender.town+'\\n' : '')+((defender.player != undefined) ? defender.player+'\\n' : '')+((defender.ally != undefined) ? defender.ally+'\\n' : ''),10), GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>" +
        (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplTableNBBegin : GRCRTtpl.rct.tplTableEnd) + "[center]<%=RepConv.Const.footer%>[/center]" + (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplTableNBEnd : GRCRTtpl.rct.tplTableBegin) + "<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.AddFont(GRCRTtpl.AddSize('[b]'+powerinfo.name.wrapLine(26)+'[/b]\\n\\n'+powerinfo.description.wrapLine(31),11)+'\\n'+RepConvTool.addLine(245), GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColSep%><%=GRCRTtpl.rct.tplFontBegin%>[center]<%=RepConvTool.Adds(RepConv.Const.uiImg + '8/' + powerinfo.id + '.png',\"img\") %>[/center]\\n<%=RepConvTool.addLine(190)%><%=GRCRTtpl.rct.tplFontEnd%><%=GRCRTtpl.rct.tplColSep%><%=GRCRTtpl.rct.tplFontBegin+GRCRTtpl.rct.tplSize9%><%if (efekt.detail != null){%>[b]<%=efekt.detail.wrapLine(25)%>[/b]\\n<%}%><%if (type == 1){%><%}else if (type == 2){%><%  for(idx in resources.splits){%><%=resources.splits[idx].img_url %>\\n<%  }%><%}else if (type == 3){%><%=resources.img_url%>\\n<%}else if (type == 4){%><%}else if (type == 5){%><%=resources.img_url%>\\n<%}%><%=RepConvTool.addLine(245)%><%=GRCRTtpl.rct.tplSizeEnd+GRCRTtpl.rct.tplFontEnd%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd %>" +
        GRCRTtpl.rct.tplTableEnd;
        break;
      case "wall":
        f = this.rct.tplTableBegin + '<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin %>[b]<%=GRCRTtpl.AddSize(title,12)%>[/b]\\n<%=RepConvTool.addLine(340)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(25)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(340)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%><%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=  GRCRTtpl.AddSize(defeated.title,12) + GRCRTtpl.rct.tplColSep + GRCRTtpl.rct.tplColSep + GRCRTtpl.AddSize(losses.title,12)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%><%  if(defeated.titleAttacker != "" || losses.titleAttacker != ""){%><%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=  GRCRTtpl.rct.tplFontBegin + GRCRTtpl.rct.tplSize9 %><%    if(defeated.titleAttacker != ""){%>[b]<%=defeated.titleAttacker%>[/b]\\n<%      for(ind = 0; ind < Math.max(Object.size(defeated.attacker), Object.size(losses.attacker)); ind++){%><%        if(defeated.attacker[ind] != undefined){%><%=  defeated.attacker[ind].img_url%>\\n<%        } else {%><%=  emptyline%><%        }%><%      }%><%    }%><%=GRCRTtpl.rct.tplSizeEnd + GRCRTtpl.rct.tplFontEnd%><%=GRCRTtpl.rct.tplColSep%><%=GRCRTtpl.rct.tplColSep%><%=GRCRTtpl.rct.tplFontBegin + GRCRTtpl.rct.tplSize9 %><%    if(losses.titleAttacker != ""){%>[b]<%=losses.titleAttacker%>[/b]\\n<%      for(ind = 0; ind < Math.max(Object.size(defeated.attacker), Object.size(losses.attacker)); ind++){%><%        if(losses.attacker[ind] != undefined){%><%=  losses.attacker[ind].img_url%>\\n<%        } else {%><%=  emptyline%><%        }%><%      }%><%    }%><%=GRCRTtpl.rct.tplSizeEnd + GRCRTtpl.rct.tplFontEnd%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%><%  }%><%  if(defeated.titleDefender != "" || losses.titleDefender != ""){%><%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=GRCRTtpl.rct.tplFontBegin + GRCRTtpl.rct.tplSize9 %><%    if(defeated.titleDefender != ""){%>[b]<%=defeated.titleDefender%>[/b]\\n<%      for(ind = 0; ind < Math.max(Object.size(defeated.defender), Object.size(losses.defender)); ind++){%><%        if(defeated.defender[ind] != undefined){%><%=  defeated.defender[ind].img_url%>\\n<%        } else {%><%=  emptyline%><%        }%><%      }%><%    }%><%=GRCRTtpl.rct.tplSizeEnd + GRCRTtpl.rct.tplFontEnd%><%=GRCRTtpl.rct.tplColSep%><%=GRCRTtpl.rct.tplColSep%><%=GRCRTtpl.rct.tplFontBegin + GRCRTtpl.rct.tplSize9 %><%    if(losses.titleDefender != ""){%>[b]<%=losses.titleDefender%>[/b]\\n<%      for(ind = 0; ind < Math.max(Object.size(defeated.defender), Object.size(losses.defender)); ind++){%><%        if(losses.defender[ind] != undefined){%><%=  losses.defender[ind].img_url%>\\n<%        } else {%><%=  emptyline%><%        }%><%      }%><%    }%><%=GRCRTtpl.rct.tplSizeEnd + GRCRTtpl.rct.tplFontEnd%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%><%  }%>' +
        this.rct.tplTableEnd + "[center]<%=RepConv.Const.footer%>[/center]";
        break;
      case "conquer":
      case "illusion":
      case "found":
        f += GRCRTtpl.rct.tplTableBegin + "<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.addLine(245)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(190)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(245)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%><%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(((attacker.town != undefined) ? attacker.town+'\\n' : '')+((attacker.player != undefined) ? attacker.player+'\\n' : '')+((attacker.ally != undefined) ? attacker.ally+'\\n' : ''),10), GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.AddFont('[img]'+RepConv.grcrt_cdn+'ui/ragB.png[/img][img]'+RepConv.grcrt_cdn+'ui/5/'+reportImage+'.png[/img][img]'+RepConv.grcrt_cdn+'ui/ragE.png[/img]', GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.AddFont(GRCRTtpl.AddSize(((defender.town != undefined) ? defender.town+'\\n' : '')+((defender.player != undefined) ? defender.player+'\\n' : '')+((defender.ally != undefined) ? defender.ally+'\\n' : ''),10), GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>" +
        (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplTableNBBegin : GRCRTtpl.rct.tplTableEnd) + "[center]<%=RepConv.Const.footer%>[/center]" + (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplTableNBEnd : GRCRTtpl.rct.tplTableBegin) + "<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColSpan3%><%=detail%>\\n<%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd %><%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColSpan3%><%=RepConvTool.addLine(698)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd %>" + GRCRTtpl.rct.tplTableEnd;
        break;
      case "conquest":
        f = GRCRTtpl.rct.tplTableBegin + "<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColSpan4%><%=GRCRTtpl.rct.tplFontBegin %>[b]<%=title%>[/b]\\n<%=defender.town%> (<%=time%>)\\n[b]<%=RepConvTool.GetLabel('ATTACKER')%>[/b]: <%=attacker.player%> <%=GRCRTtpl.rct.tplFontEnd%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%><%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColSpan4%><%=GRCRTtpl.rct.tplFontBegin + GRCRTtpl.rct.tplSize9 %><%=attacker.title%>\\n<%for(ind in attacker.splits){%><%=  attacker.splits[ind].img_url%>\\n<%}%><%=RepConvTool.addLine(698)%><%=GRCRTtpl.rct.tplSizeEnd + GRCRTtpl.rct.tplFontEnd%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>" +
        (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColSpan4 : GRCRTtpl.rct.tplTableEnd) + "[center]<%=RepConv.Const.footer%>[/center]" + (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplTableNBEnd : GRCRTtpl.rct.tplTableBegin) + "<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=RepConvTool.addLine(32)%><%=GRCRTtpl.rct.tplColSep%><%=GRCRTtpl.rct.tplFontBegin %>[b]<%=GRCRTtpl.AddSize(command.title,10)%>[/b] (##/##)\\n<%=RepConvTool.addLine(302)%><%=GRCRTtpl.rct.tplFontEnd %><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(32)%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.addLine(302)%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>" +
        (0 < Object.size(e.linia) ? "=#=#=<%for(xx = 0; xx < Object.size(linia); xx+=2){%><%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin%><%=linia[xx].img%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.AddFont(GRCRTtpl.AddSize('('+linia[xx].time+')\\n'+linia[xx].text,8), GRCRTtpl.rct.fonttag)%><%=GRCRTtpl.rct.tplColSep%><%  if(Object.size(linia[xx+1])>0){%><%=linia[xx+1].img%><%=GRCRTtpl.rct.tplColSep%><%=RepConvTool.AddFont(GRCRTtpl.AddSize('('+linia[xx+1].time+')\\n'+linia[xx+1].text,8), GRCRTtpl.rct.fonttag)%><%  } else {%><%=GRCRTtpl.rct.tplColSep%><%  }%><%=GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>=#=#=<%}%>" :
        "") + GRCRTtpl.rct.tplTableEnd;
        break;
      case "academy":
        f += GRCRTtpl.rct.tplTableBegin + '<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin + GRCRTtpl.rct.tplFontBegin%><%for(ind in linia){%><%=RepConvTool.Adds((GRCRTtpl.rct.tplGenImg).RCFormat(GRCRTtpl.rct.sign, linia[ind].unit_list), "img")%>\\n<%}%><%=RepConvTool.addLine(698)%>\\n[b]<%=GRCRTtpl.AddSize(points,9)%>[/b]<%=GRCRTtpl.rct.tplFontEnd + GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>' + (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplTableNBBegin : GRCRTtpl.rct.tplTableEnd) + "[center]<%=RepConv.Const.footer%>[/center]" +
        (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplTableNBEnd + GRCRTtpl.rct.tplTableEnd : "");
        break;
      case "ownTropsInTheCity":
        f += GRCRTtpl.rct.tplTableBegin + "<%=GRCRTtpl.rct.tplRowBegin + GRCRTtpl.rct.tplColBegin + GRCRTtpl.rct.tplFontBegin%><%=RepConvTool.addLine(698)%>\\n<%=defender.full.img_url %>\\n<%=GRCRTtpl.rct.tplFontEnd + GRCRTtpl.rct.tplColEnd + GRCRTtpl.rct.tplRowEnd%>" + (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplTableNBBegin : GRCRTtpl.rct.tplTableEnd) + "[center]<%=RepConv.Const.footer%>[/center]" + (GRCRTtpl.rct.outside ? GRCRTtpl.rct.tplTableNBEnd + GRCRTtpl.rct.tplTableEnd : "");
        break;
      case "bbcode_island":
      case "bbcode_player":
      case "bbcode_alliance":
        f = "<%=GRCRTtpl.AddSize(header,9)%> (##/##)\\n<%=GRCRTtpl.rct.tplTableBegin%>=#=#=<%for(ind in linia){%><%=GRCRTtpl.rct.tplRowBegin%><%=GRCRTtpl.rct.tplColBegin%><%=ind%>.<%=GRCRTtpl.rct.tplColSep%><%=linia[ind].col1%><%=GRCRTtpl.rct.tplColSep%><%=linia[ind].col2%><%=GRCRTtpl.rct.tplColSep%><%=linia[ind].col3%><%=GRCRTtpl.rct.tplColSep%><%=linia[ind].col4%><%=GRCRTtpl.rct.tplColEnd%><%=GRCRTtpl.rct.tplRowEnd%>=#=#=<%}%><%=GRCRTtpl.rct.tplTableEnd%>";
    }
    return b(RepConvTool.Adds(f, GRCRTtpl.rct.tag), e);
  };
  this.report = function(a, b, f) {
    a = "txt" == a ? this.reportText(b, f) : this.reportHtml(b, f);
    RepConv.Debug && console.log(a);
    b = a.split("=#=#=");
    f = b[0];
    for (var e = b[b.length - 1], k = {splits:[], single:[]}, z = f, t = 1; t < b.length - 1; t++) {
      if (((z + b[t] + e).match(/\[/g) || []).length >= this.rct.tagLimit || (z + b[t] + e).length >= this.rct.charLimit) {
        k.splits.push(z + e), z = f;
      }
      z += b[t];
    }
    z != f && k.splits.push(z + e);
    1 == b.length && k.splits.push(a.replace(" (##/##)", ""));
    $.each(k.splits, function(a, b) {
      k.splits[a] = b.replace("##/##", a + 1 + "/" + Object.size(k.splits));
    });
    k.single = a.replace(" (##/##)", "").split("=#=#=").join("");
    RepConv.Debug && console.log(k);
    return k;
  };
  this.AddSize = function(a, b) {
    return 0 < a.length && this.rcts.A == this.rct ? "[size=" + b + "]" + a + "[/size]" : a;
  };
  this.White = function(a, b) {
    return this.rct.blank.slice(1, b - a.length);
  };
  this.Color = function(a, b) {
    return "[color=#" + b + "]" + a + "[/color]";
  };
  this.Unit = function(a, b) {
    RepConv.Debug && console.log(a);
    return this.White(a, this.rct.unitDigits) + a;
  };
  this.Value = function(a, b) {
    return this.White(String(a), b) + String(a);
  };
  this.tmpl = function(a, e) {
    return b(a, e);
  };
  $("head").append($("<style/>").append(".grcrt_frame .checkbox_new {display: block;}"));
  RepConv.initArray.push("GRCRTtpl.init()");
  RepConv.wndArray.push("grcrt_convert");
  this.init = function() {
    new k;
  };
}
function _RepConvABH() {
  function b() {
    var a = $("<div/>", {id:"GRCRT_wrpr", style:"margin:0 0 0 -7px;", "class":"tech_tree_box"}), b = $("<div/>", {id:"GRCRT_abh_settings"}).append($("<div/>", {"class":"GRCRT_abh_spacer"}).append($("<span/>", {"class":"GRCRT_abh_spcr_img"}))).append($("<div/>", {"class":"GRCRT_abh_pop"}).append($("<span/>").html(RepConvTool.GetLabel("ABH.WND.DESCRIPTION1").replace("[population]", '<span class="GRCRT_abh_pop_img"></span><span class="GRCRT_abh_pop_count"></span>'))).append($("<br/>")).append($("<span/>").html(RepConvTool.GetLabel("ABH.WND.DESCRIPTION2").replace("[max_units]",
    '<span class="GRCRT_abh_unit_count"></span><span class="GRCRT_abh_unit_type"></span>'))).append($("<br/>")).append($("<span/>", {id:"GRCRT_abh_has_research"}).html(RepConvTool.GetLabel("ABH.WND.DESCRIPTION3").replace("[yesno]", '<span class="GRCRT_abh_has_research"></span>').replace("[research]", '<span class="GRCRT_abh_what_research"></span>'))).append($("<br/>")).append($("<span/>").html(RepConvTool.GetLabel("ABH.WND.DESCRIPTION4").replace("[max_queue]", '<span class="GRCRT_abh_max_to_build"></span>')))).append($("<div/>",
    {"class":"GRCRT_abh_spacer"}).append($("<span/>", {"class":"GRCRT_abh_spcr_img"}))).append($("<div/>", {"class":"GRCRT_abh_target"}).append($("<span/>").html(RepConvTool.GetLabel("ABH.WND.TARGET") + ' <span class="GRCRT_abh_input"></span>'))).append($("<div/>", {"class":"GRCRT_abh_spacer"}).append($("<span/>", {"class":"GRCRT_abh_spcr_img"}))).append($("<div/>", {"class":"GRCRT_abh_pckg"}).append($("<span/>").html(RepConvTool.GetLabel("ABH.WND.PACKAGE") + ' <span class="GRCRT_abh_input"></span>'))).append($("<div/>",
    {"class":"GRCRT_abh_spacer"}).append($("<span/>", {"class":"GRCRT_abh_spcr_img"}))).append($("<div/>", {"class":"GRCRT_abh_buttons"}).append($("<span/>"))), e = [];
    $.each(z, function(b, e) {
      var f = $("<div/>", {"class":"GRCRT_abh_column"}), g = 0;
      $.each(e, function(e, h) {
        4 == g && ($(a).append(f), f = $("<div/>", {"class":"GRCRT_abh_column"}), g = 0);
        $(f).append($("<div/>", {"class":"research_box"}).append($("<span/>", {"class":"research_icon research inactive" + h, name:h}).addClass(h).addClass(b)));
        g++;
      });
      0 < g && $(a).append(f);
    });
    e.push(RepConvTool.Ramka(RepConvTool.GetLabel("ABH.WND.UNITFRAME"), a, 318));
    e.push(b);
    return e;
  }
  function k(a) {
    RepConv.Debug && console.log(a);
    var b = ITowns.getTown(Game.townId), e = b.researches(), f = b.buildings(), g, q;
    $.each(z, function(a, b) {
      $.each(b, function(a, b) {
        g = e.get(b) || "sword" == b && 0 < f.get("barracks") || "big_transporter" == b && 0 < f.get("docks");
        q = GRCRTabhWnd.getJQElement().find($('#GRCRT_wrpr span[name="' + b + '"]'));
        $(q).css("cursor", g ? "pointer" : "not-allowed").removeClass("not_available").removeClass("grcrt_set").removeClass("inactive").removeClass("is_researched").mousePopup(new MousePopup(RepConvTool.GetLabel(g ? "ABH.WND.TOOLTIPOK" : "ABH.WND.TOOLTIPNOTOK"))).addClass("inactive").addClass(g ? "" : "not_available").hover(function() {
          $(this).hasClass("grcrt_set") || $(this).hasClass("not_available") || $(this).toggleClass("inactive is_researched");
        }).click(function() {
          if (!$(this).hasClass("not_available")) {
            var a = $(this).attr("name");
            GRCRTabhWnd.getJQElement().find($("grcrt_set")).attr("name");
            $(".grcrt_set").toggleClass("inactive is_researched grcrt_set");
            $(this).addClass("grcrt_set");
            k(a);
          }
        });
        $(q).parent().css("opacity", g ? "" : ".3");
      });
    });
    GRCRTabhWnd.getJQElement().find($("grcrt_set")).toggleClass("inactive is_researched grcrt_set");
    b = GRCRTabhWnd.getJQElement().find($('#GRCRT_wrpr span[name="' + a + '"]'));
    $(b).addClass("grcrt_set").toggleClass("inactive is_researched");
    if ($(b).hasClass("land_unit") || $(b).hasClass("sea_unit")) {
      var l = $(b).hasClass("land_unit") ? GameData.researches.conscription : "";
      l = $(b).hasClass("sea_unit") ? GameData.researches.mathematics : "";
      GRCRTabhWnd.getJQElement().find($(".GRCRT_abh_what_research")).text(l.name);
    } else {
      l = "no_research";
    }
    "no_research" == l ? GRCRTabhWnd.getJQElement().find($(".GRCRT_abh_has_research")).text(RepConvTool.GetLabel("ABH.WND.NORESEARCH")) : ITowns.getTown(Game.townId).researches().get(l.id) ? GRCRTabhWnd.getJQElement().find($(".GRCRT_abh_has_research")).text(RepConvTool.GetLabel("ABH.WND.HASRESEARCH")) : GRCRTabhWnd.getJQElement().find($(".GRCRT_abh_has_research")).text(RepConvTool.GetLabel("ABH.WND.NORESEARCH"));
    null != a ? $("#GRCRT_abh_has_research").show() : $("#GRCRT_abh_has_research").hide();
    b = ITowns.getTown(parseInt(Game.townId)).getAvailablePopulation();
    l = null != a ? Math.floor(b / GameData.units[a].population) : 0;
    var m = null != a ? GameData.units[a].name : "???", A = MM.checkAndPublishRawModel("Town", {id:Game.townId}).get("storage"), t = null != a ? RecruitUnits.getResearchModificationFactor(Game.townId, a) : 0, u = null != a ? RepConvTool.GetUnitCost(a, t) : {w:0, s:0, i:0};
    u = [u.w, u.s, u.i];
    A = null != a ? Math.floor(A / Math.max.apply(Math, u)) : 0;
    u = null != a ? 7 * A > l ? "(" + (A > l ? "" : Math.floor(l / A) + "x" + A + ", ") + "1x" + l % A + ")" : "(7x" + A + ")" : "";
    var x = null != a ? 7 * A > l ? l : 7 * A : 0;
    GRCRTabhWnd.getJQElement().find($("#GRCRT_abh_settings .GRCRT_abh_buttons .button")).attr("unit", a);
    GRCRTabhWnd.getJQElement().find($("#GRCRT_abh_settings .GRCRT_abh_buttons .button")).attr("factor", t);
    GRCRTabhWnd.getJQElement().find($(".GRCRT_abh_pop_count")).text(b);
    GRCRTabhWnd.getJQElement().find($(".GRCRT_abh_unit_count")).text(l);
    GRCRTabhWnd.getJQElement().find($(".GRCRT_abh_unit_type")).text(m);
    GRCRTabhWnd.getJQElement().find($(".GRCRT_abh_max_to_build")).text(x);
    GRCRTabhWnd.getJQElement().find($("#GRCRT_abh_target_input")).attr("max", x).attr("value", x);
    GRCRTabhWnd.getJQElement().find($(".GRCRT_abh_max_to_build_detail")).text(u);
    GRCRTabhWnd.getJQElement().find($("#GRCRT_abh_pckg_input")).attr("max", Math.floor(0.34 * A)).attr("value", Math.floor(0.34 * A));
  }
  function a(a) {
    a.getJQElement().find($(".grcrt_abh_unit_wrapper")).remove();
    a.getJQElement().find($("#trade_duration .grcrt_abh_res_left")).remove();
    null != t.selectedTo.id && (a.getJQElement().find($("#trade_options")).append(RepConvForm.unitMinMax({name:"unit_slider_" + a.getID(), wndId:a.getID(), min:"0", max:t.pckgSize, value:t.pckgSize, tTown:t.selectedTo.id, unit:null == t.selectedTo.id ? "x" : RepConvABH.savedArr[t.selectedTo.id].unit})), a.getJQElement().find($(".grcrt_abh_selected_unit")).click(function() {
      u($(this).attr("rel"), !0, $(this).attr("wndid"));
    }), a.getJQElement().find($("#trade_duration")).append($("<div/>", {"class":"grcrt_abh_res_left"}).append($("<div/>", {style:"display:inline-flex"}).append($("<div/>").append($("<div/>", {"class":"resource_wood_icon res_icon"})).append($("<div/>", {"class":"amount"}).text(Math.round(t.resPerUnit.w * RepConvABH.savedArr[t.selectedTo.id].target_left)))).append($("<div/>").append($("<div/>", {"class":"resource_stone_icon res_icon"})).append($("<div/>", {"class":"amount"}).text(Math.round(t.resPerUnit.s *
    RepConvABH.savedArr[t.selectedTo.id].target_left)))).append($("<div/>").append($("<div/>", {"class":"resource_iron_icon res_icon"})).append($("<div/>", {"class":"amount"}).text(Math.round(t.resPerUnit.i * RepConvABH.savedArr[t.selectedTo.id].target_left)))).append($("<div/>", {"class":"grcrt_abh_caption"}).html('<span class="target_left">' + RepConvABH.savedArr[t.selectedTo.id].target_left + "</span>/" + RepConvABH.savedArr[t.selectedTo.id].target + " " + GameData.units[RepConvABH.savedArr[t.selectedTo.id].unit].name_plural)))));
  }
  function e(a, b) {
    return {w:parseInt($.trim(a ? $("#trade_selected_from .resource_wood_icon").text() : $("#ui_box .ui_resources_bar .wood .amount").text())), s:parseInt($.trim(a ? $("#trade_selected_from .resource_stone_icon").text() : $("#ui_box .ui_resources_bar .stone .amount").text())), i:parseInt($.trim(a ? $("#trade_selected_from .resource_iron_icon").text() : $("#ui_box .ui_resources_bar .iron .amount").text())), t:parseInt($.trim(a ? $("#trade_selected_from .trade_capacity").text() : b.getJQElement().find($("#big_progressbar .max")).text()))};
  }
  function f(a, b, f, k) {
    var g = void 0 === RepConvABH.savedArr[a] ? 1 : RepConvABH.savedArr[a].factor;
    b = e(b, k);
    g = RepConvTool.GetUnitCost(RepConvABH.savedArr[a].unit, g);
    k = g.w + g.s + g.i;
    f = MM.getModels().Town[f].getAvailableTradeCapacity();
    f = Math.floor(f / k);
    b = Math.min.apply(Math, [Math.floor(b.w / g.w), Math.floor(b.s / g.s), Math.floor(b.i / g.i)]);
    return Math.min.apply(Math, [b, f, RepConvABH.savedArr[a].package]);
  }
  function u(a, b, f) {
    f = Layout.wnd.GetByID(f);
    var h = f.getHandler().target_id;
    h = void 0 === RepConvABH.savedArr[h] ? 1 : RepConvABH.savedArr[h].factor;
    e(b, f);
    var g = b ? t.resPerUnit : RepConvTool.GetUnitCost(a, h), k = parseInt(f.getJQElement().find($(".grcrt_abh_selected_unit span.value")).html());
    a = k * g.w;
    h = k * g.s;
    g = k * g.i;
    b && (f.getJQElement().find($("#trade_overview_type_wood")).select().val(a).blur(), f.getJQElement().find($("#trade_overview_type_stone")).select().val(h).blur(), f.getJQElement().find($("#trade_overview_type_iron")).select().val(g).blur());
    b || (f.getJQElement().find($("#trade_type_wood input")).select().val(a).blur(), f.getJQElement().find($("#trade_type_stone input")).select().val(h).blur(), f.getJQElement().find($("#trade_type_iron input")).select().val(g).blur());
  }
  function x() {
    require("game/windows/ids").GRCRT_ABH = "grcrt_abh";
    (function() {
      var a = window.GameControllers.TabController, b = a.extend({initialize:function() {
        a.prototype.initialize.apply(this, arguments);
        var b = this.getWindowModel(), e = $("<div/>").css({margin:"10px"});
        this.$el.html(e);
        b.hideLoading();
        b.getJQElement || (b.getJQElement = function() {
          return e;
        });
        b.appendContent || (b.appendContent = function(a) {
          return e.append(a);
        });
        b.setContent2 || (b.setContent2 = function(a) {
          return e.html(a);
        });
      }, render:function() {
      }});
      window.GameViews.GrcRTView_grcrt_abh = b;
    })();
    (function() {
      var a = window.GameViews, b = window.WindowFactorySettings, e = require("game/windows/ids"), f = require("game/windows/tabs"), g = e.GRCRT_ABH;
      b[g] = function(b) {
        b = b || {};
        return us.extend({window_type:g, minheight:380, maxheight:390, width:780, tabs:[{type:f.INDEX, title:"none", content_view_constructor:a.GrcRTView_grcrt_abh, hidden:!0}], max_instances:1, activepagenr:0, minimizable:!0, resizable:!1, title:RepConv.grcrt_window_icon + RepConvTool.GetLabel("ABH.WND.WINDOWTITLE"), special_buttons:{help:{action:{type:"external_link", url:RepConv.Scripts_url + "module/grchowto#2"}}}}, b);
      };
    })();
  }
  var z = {land_unit:"slinger hoplite rider catapult sword archer chariot".split(" "), sea_unit:"big_transporter small_transporter bireme attack_ship demolition_ship trireme colonize_ship".split(" ")}, t = {selectedFrom:{id:null}, selectedTo:{id:null}, resPerUnit:{}, targetTown:"", pckgSize:0};
  this.showView = function() {
    var a = null === RepConvABH.savedArr ? null : void 0 === RepConvABH.savedArr[Game.townId] ? null : RepConvABH.savedArr[Game.townId].unit;
    try {
      WM.getWindowByType("grcrt_abh")[0].close();
    } catch (G) {
    }
    window.GRCRTabhWnd = WF.open("grcrt_abh");
    GRCRTabhWnd.setContent2(b());
    GRCRTabhWnd.getJQElement().find($(".grcrt_frame")).css({position:"", "padding-left":"5px", overflow:"hidden"}).addClass("academy");
    GRCRTabhWnd.getJQElement().find($(".inner_box")).css({width:"322px", "float":"left", "margin-right":"20px"});
    $(RepConvForm.inputMinMax({name:"GRCRT_abh_target_input", value:"0", size:"2", min:"0", max:"0"})).appendTo(".GRCRT_abh_target .GRCRT_abh_input");
    $(RepConvForm.inputMinMax({name:"GRCRT_abh_pckg_input", value:"0", size:"1", min:"0", max:"0"})).appendTo(".GRCRT_abh_pckg .GRCRT_abh_input");
    $(RepConvForm.button(RepConvTool.GetLabel("ABH.WND.BTNSAVE"))).click(function() {
      var a = RepConvABH.savedArr || {};
      a[Game.townId] = {unit:$(this).attr("unit"), target:parseInt($("#GRCRT_abh_target_input").val()), target_left:parseInt($("#GRCRT_abh_target_input").val()), factor:parseFloat($(this).attr("factor")), "package":parseInt($("#GRCRT_abh_pckg_input").val())};
      RepConvABH.savedArr = a;
      RepConvTool.setItem(RepConv.CookieUnitsABH, JSON.stringify(RepConvABH.savedArr));
      RepConv.Debug && console.log(JSON.stringify(a));
      setTimeout(function() {
        HumanMessage.success(RepConvTool.GetLabel("ABH.WND.SETTINGSAVED").replace("[city]", Game.townName));
      }, 0);
    }).appendTo("#GRCRT_abh_settings .GRCRT_abh_buttons").css("margin", "auto");
    k(a);
  };
  this.functCall = function(b, e) {
    if (0 == b.getJQElement().find($(".grcrt_abh_selected_unit")).length) {
      if (e) {
        $("#trade_selected_from").bind("DOMSubtreeModified", function() {
          0 == b.getJQElement().find($("#trade_selected_from .gp_town_link")).length ? (t.selectedFrom = {id:null}, t.pckgSize = "0", t.resPerUnit = RepConvTool.GetUnitCost("x")) : (t.selectedFrom = JSON.parse(RepConvTool.Atob(b.getJQElement().find($("#trade_selected_from .gp_town_link")).attr("href"))), void 0 !== RepConvABH.savedArr[t.selectedTo.id] && (t.pckgSize = f(t.selectedTo.id, !0, t.selectedFrom.id, b), t.resPerUnit = RepConvTool.GetUnitCost(RepConvABH.savedArr[t.selectedTo.id].unit, parseFloat(RepConvABH.savedArr[t.selectedTo.id].factor))));
          a(b);
        }), $("#trade_selected_to").bind("DOMSubtreeModified", function() {
          t.selectedTo = 0 == b.getJQElement().find($("#trade_selected_to .gp_town_link")).length ? {id:null} : JSON.parse(RepConvTool.Atob(b.getJQElement().find($("#trade_selected_to .gp_town_link")).attr("href")));
          void 0 === RepConvABH.savedArr[t.selectedTo.id] ? b.getJQElement().find($(".grcrt_abh_unit_wrapper")).remove() : (t.pckgSize = null == t.selectedFrom.id ? 0 : f(t.selectedTo.id, !0, t.selectedFrom.id, b), t.resPerUnit = null == t.selectedFrom.id ? RepConvTool.GetUnitCost("x") : RepConvTool.GetUnitCost(RepConvABH.savedArr[t.selectedTo.id].unit, parseFloat(RepConvABH.savedArr[t.selectedTo.id].factor)), a(b));
        }), $("#trade_buttons .confirm").click(function() {
          null != t.selectedFrom.id && null != t.selectedTo.id && (RepConvABH.savedArr[t.selectedTo.id].target_left = parseInt(RepConvABH.savedArr[t.selectedTo.id].target_left) - parseInt(b.getJQElement().find($(".grcrt_abh_selected_unit .value")).text()), _res = {wood:parseInt(b.getJQElement().find($(".grcrt_abh_res_left .wood .amount")).text()), stone:parseInt(b.getJQElement().find($(".grcrt_abh_res_left .stone .amount")).text()), iron:parseInt(b.getJQElement().find($(".grcrt_abh_res_left .iron .amount")).text())},
          b.getJQElement().find($(".grcrt_abh_res_left .wood .amount")).text(_res.wood - parseInt(b.getJQElement().find($("#trade_overview_type_wood")).val())), b.getJQElement().find($(".grcrt_abh_res_left .stone .amount")).text(_res.stone - parseInt(b.getJQElement().find($("#trade_overview_type_stone")).val())), b.getJQElement().find($(".grcrt_abh_res_left .iron .amount")).text(_res.iron - parseInt(b.getJQElement().find($("#trade_overview_type_iron")).val())), b.getJQElement().find($(".grcrt_abh_res_left .target_left")).text(RepConvABH.savedArr[t.selectedTo.id].target_left),
          RepConvTool.setItem(RepConv.CookieUnitsABH, JSON.stringify(RepConvABH.savedArr)));
        });
      } else {
        var h = b.getHandler().target_id, k = RepConvTool.GetUnitCost(null == RepConvABH.savedArr || void 0 === RepConvABH.savedArr[h] ? "x" : RepConvABH.savedArr[h].unit);
        e = null == RepConvABH.savedArr || void 0 === RepConvABH.savedArr[h] ? "0" : f(h, e, Game.townId, b);
        null != RepConvABH.savedArr && void 0 != RepConvABH.savedArr[h] && (b.getJQElement().find($("#trade .content")).append(RepConvForm.unitMinMax({name:"unit_slider_" + b.getID(), wndId:b.getID(), min:"0", max:e, value:e, tTown:h, unit:RepConvABH.savedArr[h].unit})).append($("<div/>", {"class":"grcrt_abh_res_left"}).append($("<div/>", {style:"margin:auto;"}).append($("<div/>", {"class":"grcrt_abh_caption"}).html('<span class="target_left">' + RepConvABH.savedArr[h].target_left + "</span>/" +
        RepConvABH.savedArr[h].target + " " + GameData.units[RepConvABH.savedArr[h].unit].name_plural))).append($("<div/>", {style:"display:inline-flex"}).append($("<div/>").append($("<div/>", {"class":"resource_wood_icon res_icon"})).append($("<div/>", {"class":"amount wood"}).text(Math.round(k.w * RepConvABH.savedArr[h].target_left)))).append($("<div/>").append($("<div/>", {"class":"resource_stone_icon res_icon"})).append($("<div/>", {"class":"amount stone"}).text(Math.round(k.s * RepConvABH.savedArr[h].target_left)))).append($("<div/>").append($("<div/>",
        {"class":"resource_iron_icon res_icon"})).append($("<div/>", {"class":"amount iron"}).text(Math.round(k.i * RepConvABH.savedArr[h].target_left)))))), b.getJQElement().find($(".btn_trade_button")).bind("click", function() {
          RepConvABH.savedArr[h].target_left -= parseInt($(".grcrt_abh_selected_unit .value").text());
          var a = parseInt(b.getJQElement().find($(".grcrt_abh_res_left .wood.amount")).text()), e = parseInt(b.getJQElement().find($(".grcrt_abh_res_left .stone.amount")).text()), f = parseInt(b.getJQElement().find($(".grcrt_abh_res_left .iron.amount")).text());
          b.getJQElement().find($(".grcrt_abh_res_left .wood.amount")).text(a - parseInt(b.getJQElement().find($("#trade_type_wood input")).val()));
          b.getJQElement().find($(".grcrt_abh_res_left .stone.amount")).text(e - parseInt(b.getJQElement().find($("#trade_type_stone input")).val()));
          b.getJQElement().find($(".grcrt_abh_res_left .iron.amount")).text(f - parseInt(b.getJQElement().find($("#trade_type_iron input")).val()));
          b.getJQElement().find($(".grcrt_abh_res_left .target_left")).text(RepConvABH.savedArr[h].target_left);
          RepConvTool.setItem(RepConv.CookieUnitsABH, JSON.stringify(RepConvABH.savedArr));
        }), b.getJQElement().find($(".grcrt_abh_selected_unit")).click(function() {
          u($(this).attr("rel"), !1, $(this).attr("wndid"));
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
  $.Observer(GameEvents.town.town_switch).subscribe("GRCRT_ABH_town_town_switch", function(a, b) {
    a = null === RepConvABH.savedArr ? null : void 0 === RepConvABH.savedArr[Game.townId] ? null : RepConvABH.savedArr[Game.townId].unit;
    "undefined" != typeof GRCRTabhWnd && k(a);
  });
  $.Observer(GameEvents.grcrt.settings.load).subscribe("GRCRT_ABH_settings_load", function() {
    RepConvABH.savedArr = JSON.parse(RepConvTool.getSettings(RepConv.CookieUnitsABH, "{}"));
  });
  RepConv.initArray.push("RepConvABH.init()");
  RepConv.wndArray.push("grcrt_abh");
  this.init = function() {
    new x;
  };
}
function _RepConvGRC() {
  function b(a) {
    a.getWindowVeryMainNode().find($("div.ui-dialog-titlebar.ui-widget-header a.grc_reload")).remove();
    switch(a.getController()) {
      case "building_barracks":
      case "building_docks":
        0 == a.getWindowVeryMainNode().find($("div.ui-dialog-titlebar.ui-widget-header a.grc_reload")).length && a.getWindowVeryMainNode().find($("div.ui-dialog-titlebar.ui-widget-header")).append($("<a/>", {href:"#n", "class":"grc_reload down_big reload", style:"float: right; height: 22px; margin: -1px 0 1px;", rel:a.getID()}).click(function() {
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
  function k(a) {
    var b = void 0, c = void 0;
    switch(a.getController()) {
      case "building_barracks":
        $.each(MM.checkAndPublishRawModel("PlayerGods", {id:Game.player_id}).getProductionOverview(), function(a, d) {
          "hera" == a && (b = "fertility_improvement", c = "hera");
        });
        break;
      case "building_docks":
        $.each(MM.checkAndPublishRawModel("PlayerGods", {id:Game.player_id}).getProductionOverview(), function(a, d) {
          "poseidon" == a && (b = "call_of_the_ocean", c = "poseidon");
        });
    }
    if (void 0 != b && 0 == $("#unit_order .grcrt_power").length) {
      var d = HelperPower.createCastedPowerModel(b, Game.townId), e = MM.checkAndPublishRawModel("PlayerGods", {id:Game.player_id}).get(c + "_favor") < GameData.powers[b].favor, f = e ? " disabled" : "", g = HelperPower.createCastedPowerModel(b, Game.townId);
      $.each(MM.checkAndPublishRawModel("Town", {id:Game.townId}).getCastedPowers(), function(a, c) {
        c.getPowerId() == b && (g = c, f = " active_animation extendable");
      });
      a.getJQElement().find($(".game_inner_box")).append($("<div/>", {"class":"grcrt_power"}).append($("<div/>", {"class":"powers_container clearfix"}).append($("<div/>", {"class":"power_icon45x45 " + b + " new_ui_power_icon js-power-icon" + f, "data-power_id":b, rel:c}).append($("<div/>", {"class":"extend_spell"}).append($("<div/>", {"class":"gold"})).append($("<div/>", {"class":"amount"}))).append($("<div/>", {"class":"js-caption"})).on("mouseover", function(a) {
        var c = {show_costs:!0};
        "undefined" != typeof g.getId && (c.casted_power_end_at = g.getEndAt(), c.extendable = g.isExtendable());
        $(this).tooltip(TooltipFactory.createPowerTooltip(d.getPowerId(), c)).showTooltip(a);
      }).on("click", function(c) {
        CM.unregister({main:a.getContext().main, sub:"casted_powers"}, "grcrt_power_" + g.getId());
        c = CM.register({main:a.getContext().main, sub:"casted_powers"}, "grcrt_power_" + g.getId(), a.getJQElement().find($(".grcrt_power .new_ui_power_icon .gold")).button());
        var d = HelperPower.createCastedPowerModel(b, Game.townId);
        void 0 == g.getId() ? d.cast() : g.isExtendable() && (BuyForGoldWindowFactory.openExtendPowerForGoldWindow(c, g), $(this).addClass(f));
      }))));
      if (e && !g.isExtendable()) {
        e = GameData.powers[b];
        var h = MM.checkAndPublishRawModel("PlayerGods", {id:Game.player_id}).getCurrentProductionOverview()[c], k = MM.checkAndPublishRawModel("PlayerGods", {id:Game.player_id})[c + "_favor_delta_property"].calculateCurrentValue().unprocessedCurrentValue, l = $("<div/>", {style:"margin-top:42px;color:black;text-shadow: 2px 2px 2px gray;font-size:10px;z-index:3000;font-weight: bold;", name:"counter"});
        CM.unregister({main:a.getContext().main, sub:"casted_powers"}, "grcrt_countdown");
        CM.register({main:a.getContext().main, sub:"casted_powers"}, "grcrt_countdown", l.countdown2({value:(e.favor - k) / h.production * 3600, display:"readable_seconds_with_days"}).on("cd:finish", function() {
          $(this).parent().removeClass("disabled");
          $(this).remove();
        }));
        a.getJQElement().find($(".new_ui_power_icon")).append(l);
      }
    }
  }
  function a(a) {
    0 == a.getJQElement().find("#GRCRTSetupLink").length && a.getJQElement().find(".settings-menu ul").eq(2).append($("<li>", {"class":"with-icon"}).append($("<img/>", {"class":"support-menu-item-icon", src:RepConv.grcrt_cdn + "img/octopus.png", style:"width: 15px;"})).append($("<a/>", {id:"GRCRTSetupLink", href:"#"}).html(RepConv.Scripts_nameS).click(function() {
      RepConvGRC.openGRCRT("HELPTAB4");
    })));
  }
  function e(a) {
    RepConv.settings[RepConv.Cookie + "_bupo"] && ($.each(a.getJQElement().find($(".building>.image.bold")), function(a, c) {
      a = $(c).parent().parent().attr("id").replace(/building_main_(.*)/, "$1");
      a = BuildingMain.buildings[a];
      var b = Math.round(a.building.points * Math.pow(a.building.points_factor, a.next_level)) - Math.round(a.building.points * Math.pow(a.building.points_factor, a.level)), d = Math.round(a.building.points * Math.pow(a.building.points_factor, a.current_level)) - Math.round(a.building.points * Math.pow(a.building.points_factor, a.current_level - 1)) + (1 == a.current_level ? a.building.points : 0);
      $(c).find($("span.grcrtpoints")).remove();
      a.max_level || $(c).append($("<span>", {"class":"grcrtpoints grcrt_plus grcrt_special"}).html("+" + b + "p")).css("letter-spacing", "-1px");
      $(c).append($("<span>", {"class":"grcrtpoints grcrt_special grcrt_minus"}).html("-" + d + "p"));
    }), $.each(a.getJQElement().find($(".building_special>div.image")), function(a, c) {
      a = $(c).attr("id").replace(/special_building_(.*)/, "$1");
      a = BuildingMain.special_buildings_combined_group[a];
      var b = Math.round(a.building.points * Math.pow(a.building.points_factor, a.next_level));
      $(c).find($("div.grcrtpoints")).remove();
      $(c).hasClass("special_build") && (!a.max_level || a.can_upgrade) && $(c).append($("<div>", {"class":"grcrtpoints grcrt_special"}).html("+" + b + "p")).css("letter-spacing", "-1px");
    }), f(a));
  }
  function f(a) {
    if (RepConv.settings[RepConv.Cookie + "_bupo"]) {
      var b = $("div.ui_construction_queue .ui_various_orders.type_building_queue");
      "undefined" != typeof a && a.getJQElement() && (b = a.getJQElement());
      if (0 == b.length) {
        1 == $(".option.city_overview.circle_button.js-option.checked").length && Game.player_settings.build_from_town_index_enabled && setTimeout(function() {
          f(a);
        }, 100);
      } else {
        var c = {};
        $.each(GameData.buildings, function(a, b) {
          c[a] = MM.getModels().Town[Game.townId].buildings().getBuildingLevel(a);
        });
        MM.getModels().BuildingOrder && $.each(MM.getModels().BuildingOrder, function(a, d) {
          if (d.getTownId() == Game.townId) {
            var p = GameData.buildings[d.getType()];
            a = Math.round(p.points * Math.pow(p.points_factor, c[d.getType()] + 1)) - (p.special ? 0 : Math.round(p.points * Math.pow(p.points_factor, c[d.getType()])));
            p = Math.round(p.points * Math.pow(p.points_factor, c[d.getType()])) - Math.round(p.points * Math.pow(p.points_factor, c[d.getType()] - 1));
            var e = $(b).find($(".order_id_" + d.getId() + " .item_icon.building_icon40x40." + d.getType() + ".js-item-icon"));
            $(e).find($(".grcrtpoints")).remove();
            d.hasTearDown() ? 0 == $(e).find($(".grcrtpoints")).length && ($(e).append($("<div>", {"class":"grcrtpoints grcrt_order grcrt_minus"}).html("-" + ($(e).find($("span.construction_queue_sprite")).hasClass("arrow_green_ver") ? a : p) + "p")), c[d.getType()]--) : 0 == $(e).find($(".grcrtpoints")).length && ($(e).append($("<div>", {"class":"grcrtpoints grcrt_order"}).html("+" + ($(e).find($("span.construction_queue_sprite")).hasClass("arrow_green_ver") ? a : p) + "p")), c[d.getType()]++);
          }
        });
      }
    }
  }
  function u(a) {
    if (RepConv.active.ftabs) {
      var b = a.getWindowVeryMainNode().find($("div.menu_wrapper.minimize.menu_wrapper_scroll")), c = a.getWindowVeryMainNode().find($("div.menu_wrapper.minimize.menu_wrapper_scroll>ul"));
      a.getWindowVeryMainNode().find($(".gpwindow_content>.forum_content>.t0"));
      if (b.width() != c.width()) {
        b.width(b.width() + $(b).parent().find($("a.next")).width() + $(b).parent().find($("a.prev")).width());
        c.width(b.width());
        c.css("right", 0);
        $(b).find($("div.fade_left")).remove();
        $(b).find($("div.fade_right")).remove();
        $(b).parent().find($("a.next")).remove();
        $(b).parent().find($("a.prev")).remove();
        c = $($("ul.menu_inner li")[$("ul.menu_inner li").length - 1]).position().top / 22 + 1;
        var d = $("#gptop" + c).css("z-index");
        a.getJQElement().find($("div.gpwindow_content")).css("top", b.height() * (c + 1));
        b.height(b.height() * c);
        a.setHeight(a.getOptions().maxHeight + 22 * (c - 1));
        0 == a.getJQElement().find($("div.gpwindow_top#gptop1")).length && (a.getJQElement().find($("div.gpwindow_top")).attr("id", "gptop1"), a.getWindowVeryMainNode().find($("div#gptop1")).css({"z-index":"10", height:"30px"}));
        for (b = 1; b < c; b++) {
          a.getWindowVeryMainNode().find($("div#gptop" + (b + 1))).remove(), $("<div/>", {"class":"gpwindow_top", id:"gptop" + (b + 1), style:"top:" + 22 * b + "px; z-index:" + (10 - b)}).append($("<div/>", {"class":"gpwindow_left corner"})).append($("<div/>", {"class":"gpwindow_right corner"})).insertBefore(a.getJQElement().find($("div.gpwindow_content")));
        }
        for (b = c - 1; 0 < b; b--) {
          $("#gptop" + b).css("z-index", ++d).css("height", "30px"), $("#gptop" + b + " .corner").css("height", "30px");
        }
        a.getWindowVeryMainNode().find($("ul.menu_inner>li")).css("float", "left");
        var e = a.getWindowVeryMainNode().find($("ul.menu_inner>li")).length;
        $.each(a.getWindowVeryMainNode().find($("ul.menu_inner>li")), function(a, c) {
          $(c).attr("lp", --e);
        });
        e = a.getWindowVeryMainNode().find($("ul.menu_inner>li")).length;
        for (b = 1; b < e; b++) {
          a.getWindowVeryMainNode().find($("ul.menu_inner>li[lp=" + b + "]")).insertAfter(a.getWindowVeryMainNode().find($("ul.menu_inner>li[lp=" + (b - 1) + "]")));
        }
      }
    }
  }
  function x(a) {
    function b(a, c) {
      0 == a.getJQElement().find($("#" + c + " li span.player_name a.gp_player_link")).length && $.each(a.getJQElement().find($("#" + c + " li span.player_name")), function(a, c) {
        $.each(e, function(a, b) {
          b.player == $(c).html() && ($(c).html(hCommon.player(btoa(JSON.stringify({name:b.player, id:b.pid}).replace(/[\u007f-\uffff]/g, function(a) {
            return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
          })), b.player, b.pid)), null != b.player_alliance && $(c).parent().append($("<span/>", {"class":"small alliance_name grcrt_brackets"}).html(hCommon.alliance("n", RepConvTool.getAllianceData(RepConvTool.getPlayerData(b.pid).alliance_id).name, RepConvTool.getPlayerData(b.pid).alliance_id))));
        });
      });
    }
    var c = a.getName(), d = "#" + c;
    if (0 == a.getJQElement().find($(d + "RepConvTownButton")).length) {
      var e = JSON.parse(RepConv.requests[a.getController()].responseText).json.json.town_list;
      b(a, "island_info_towns_left_sorted_by_name");
      b(a, "island_info_towns_left_sorted_by_score");
      b(a, "island_info_towns_left_sorted_by_player");
      0 == a.getJQElement().find($("#BTNVIEWBB" + c)).length && RepConvTool.AddBtn("BTNVIEWBB", c).css("margin", "0").click(function() {
        window.GRCRTConvWnd = new _GRCRTConverterCtrl(a);
      }).insertBefore(d + " div.island_info_towns.island_info_left div.game_border_top");
      RepConv.settings[RepConv.Cookie + "_idle"] && 0 == a.getJQElement().find($(".grcrt_idle")).length && 0 != a.getJQElement().find($(".gp_player_link")).length && ($("<div/>", {"class":"grcrt_idle"}).insertBefore(a.getJQElement().find($("li:not(.reservation_tool)")).find($(".gp_player_link"))), ca(a));
    }
  }
  function z(a) {
    var b = a.getName(), c = "#" + b;
    0 == a.getJQElement().find($("#BTNVIEWBB" + b)).length && RepConvTool.AddBtn("BTNVIEWBB", b).css("margin", "0").click(function() {
      window.GRCRTConvWnd = new _GRCRTConverterCtrl(a);
    }).insertBefore(c + " #player_towns div.game_border_top");
    if (0 == a.getJQElement().find($(c + "RepConvStatsPlayer")).length) {
      var d = ("player_get_profile_html" == a.getContext().sub ? btoa(JSON.stringify({id:a.getOptions().player_id})) : $(elem).nextAll(".gp_player_link").attr("href")).split(/#/), e = a.getType() == Layout.wnd.TYPE_PLAYER_PROFILE_EDIT ? Game.player_id : "player_get_profile_html" == a.getContext().sub ? JSON.parse(unescape(RepConv.requests.player.url).match(/({.*})/)[0]).player_id : JSON.parse(atob(d[1] || d[0])).id, f = a.getJQElement().find($('#write_message_form input[name="recipients"]')).val();
      d = $("<a/>", {href:"#n", id:b + "RepConvStatsPlayer", player_id:e, player_name:f}).html($("<img/>", {src:RepConv.Const.staticImg + "/stats.png"})).mousePopup(new MousePopup(RepConvTool.GetLabel("STATS.PLAYER")));
      "https:" == window.location.protocol && "potusek" != RepConv.active.statsGRCL ? $(d).attr({href:K("player", e, f), target:"_blank"}) : $(d).click(function() {
        R("player", $(this).attr("player_id"), $(this).attr("player_name"));
      });
      a.getJQElement().find($('#write_message_form input[name="recipients"]')).parent().parent().append(d);
    }
    0 == a.getJQElement().find($(c + "RepConvRadarPlayer")).length && (d = ("player_get_profile_html" == a.getContext().sub ? btoa(JSON.stringify({id:a.getOptions().player_id})) : $(elem).nextAll(".gp_player_link").attr("href")).split(/#/), e = a.getType() == Layout.wnd.TYPE_PLAYER_PROFILE_EDIT ? Game.player_id : "player_get_profile_html" == a.getContext().sub ? JSON.parse(unescape(RepConv.requests.player.url).match(/({.*})/)[0]).player_id : JSON.parse(atob(d[1] || d[0])).id, f = a.getJQElement().find($('#write_message_form input[name="recipients"]')).val(),
    a.getJQElement().find($("#player_info>h3")).before($("<div/>", {id:b + "RepConvRadarPlayer", style:"width: 23px; height: 23px; float: left;", "class":"grcrt radar"}).mousePopup(new MousePopup(RepConvTool.GetLabel("RADAR.TOWNFINDER"))).click(function() {
      GRCRT_Radar.windowOpen({player:{id:e, name:f}});
    })));
    RepConv.settings[RepConv.Cookie + "_idle"] && 0 == a.getJQElement().find($(".grcrt_idle")).length && ($("<div/>", {"class":"grcrt_idle"}).insertAfter(a.getJQElement().find($("#player_info>h3")).next()), ca(a));
  }
  function t(a) {
    var b = a.getName(), c = "#" + b;
    0 == a.getJQElement().find($("#BTNVIEWBB" + b)).length && (RepConvTool.AddBtn("BTNVIEWBB", b).css("margin", "0").click(function() {
      window.GRCRTConvWnd = new _GRCRTConverterCtrl(a);
    }).insertBefore(c + " #ally_towns div.game_border_top"), $("<a/>", {href:"#", style:"position:absolute; top:1px; right:90px;", rel:c + "RepConvTownArea", parent:c + " #player_towns"}).append($("<img/>", {id:"grcrt_ally_mass_mail", src:Game.img() + "/game/ally/mass_mail.png"})).click(function() {
      var c = "";
      $.each(a.getJQElement().find($("#ally_towns ul.members_list>li:nth-child(2) ul li")), function(a, b) {
        JSON.parse(RepConvTool.Atob($(b).find("a.gp_player_link").attr("href"))).name != Game.player_name && (c += JSON.parse(RepConvTool.Atob($(b).find("a.gp_player_link").attr("href"))).name + ";");
      });
      Layout.newMessage.open({recipients:c});
    }).insertBefore(c + " #ally_towns div.game_border_top"));
    if (0 == a.getJQElement().find($(c + "RepConvStatsAlly")).length) {
      var d = JSON.parse(unescape(RepConv.requests.alliance.url).match(/({.*})/)[0]).alliance_id, e = a.getOptions().title, f = $("<a/>", {href:"#n", id:b + "RepConvStatsAlly", ally_id:d, ally_name:e, "class":"button_new square", style:"width:26px; float: left;"}).data("ally_id", d).data("ally_name", e).html($("<img/>", {src:RepConv.Const.staticImg + "/stats.png"})).mousePopup(new MousePopup(RepConvTool.GetLabel("STATS.ALLY")));
      "https:" == window.location.protocol && "potusek" != RepConv.active.statsGRCL ? $(f).attr({href:K("alliance", d, e), target:"_blank"}) : $(f).click(function() {
        R("alliance", $(this).data("ally_id"), $(this).data("ally_name"));
      });
      a.getJQElement().find($("#alliance_points")).next().append(f);
    }
    0 == a.getJQElement().find($(c + "RepConvRadarAlliance")).length && (d = JSON.parse(unescape(RepConv.requests.alliance.url).match(/({.*})/)[0]).alliance_id, e = a.getOptions().title, a.getJQElement().find($("#player_info>h3")).before($("<div/>", {id:b + "RepConvRadarAlliance", style:"width: 23px; height: 23px; float: left;", "class":"grcrt radar"}).data("ally_id", d).data("ally_name", e).mousePopup(new MousePopup(RepConvTool.GetLabel("RADAR.TOWNFINDER"))).click(function() {
      GRCRT_Radar.windowOpen({alliance:{id:$(this).data("ally_id"), name:$(this).data("ally_name")}});
    })));
    RepConv.settings[RepConv.Cookie + "_idle"] && 0 == a.getJQElement().find($(".grcrt_idle")).length && ($("<div/>", {"class":"grcrt_idle"}).insertAfter(a.getJQElement().find($(".member_icon"))), ca(a));
  }
  function A(a) {
    var b = a.getName();
    0 == a.getJQElement().find($("#BTNCONV" + b)).length && RepConvTool.AddBtn("BTNCONV", b).click(function() {
      window.GRCRTConvWnd = new _GRCRTConverterCtrl(a);
    }).insertAfter(a.getJQElement().find($("div.gpwindow_content a.gp_town_link")).eq(0));
  }
  function G(a) {
    var b = a.getName();
    if (0 < a.getJQElement().find($("#report_arrow")).length && 0 == a.getJQElement().find($("#BTNCONV" + b)).length && (a.getJQElement().find($("#report_report div.game_list_footer")).append(RepConvTool.AddBtn("BTNCONV", b).click(function() {
      window.GRCRTConvWnd = new _GRCRTConverterCtrl(a);
    })), RepConv.active.unitsCost)) {
      switch(b = a.getJQElement().find($("div#report_arrow img")).attr("src").replace(/.*\/([a-z_]*)\.png.*/, "$1"), "attack" == b && 0 != a.getJQElement().find($("div.support_report_summary")).length && (b = "attackSupport", a.setHeight(539)), b) {
        case "attack":
        case "take_over":
        case "breach":
        case "attackSupport":
          if (0 < a.getJQElement().find($("div.report_booty_bonus_fight")).length) {
            var c = {unit_img:"", unit_send:"", unit_lost:"", unit_list:"", w:0, s:0, i:0, p:0, f:0}, d = {unit_img:"", unit_send:"", unit_lost:"", unit_list:"", w:0, s:0, i:0, p:0, f:0};
            c = RepConvTool.getUnitResource(c, a.getJQElement().find($("div.report_side_attacker_unit")));
            d = RepConvTool.getUnitResource(d, a.getJQElement().find($(("attackSupport" == b ? ".support_report_summary " : "") + "div.report_side_defender_unit")));
            $(a.getJQElement().find($("div.report_booty_bonus_fight"))[0]).append($("<hr/>")).append($("<table/>", {style:"width:100%; text-align:center; font-size:12px", "class":"grcrt_lost_res"}).append($("<tr/>", {style:"height:16px; padding:0px;"}).append($("<td/>", {style:"width:45%;"}).html(c.w)).append($("<td/>", {style:"height: 15px", "class":"resource_wood_icon"})).append($("<td/>", {style:"width:45%;"}).html(d.w))).append($("<tr/>", {style:"height:16px; padding:0px;"}).append($("<td/>",
            {style:"width:45%;"}).html(c.s)).append($("<td/>", {style:"height: 15px", "class":"resource_stone_icon"})).append($("<td/>", {style:"width:45%;"}).html(d.s))).append($("<tr/>", {style:"height:16px; padding:0px;"}).append($("<td/>", {style:"width:45%;"}).html(c.i)).append($("<td/>", {style:"height: 15px", "class":"resource_iron_icon"})).append($("<td/>", {style:"width:45%;"}).html(d.i))).append($("<tr/>", {style:"height:16px; padding:0px;"}).append($("<td/>", {style:"width:45%;"}).html(c.f)).append($("<td/>",
            {style:"height: 14px", "class":"resource_favor_icon"})).append($("<td/>", {style:"width:45%;"}).html(d.f))).append($("<tr/>", {style:"height:16px; padding:0px;"}).append($("<td/>", {style:"width:45%;"}).html(c.p)).append($("<td/>", {style:"width:20px; margin: 0px;", "class":"town_population"})).append($("<td/>", {style:"width:45%;"}).html(d.p))));
          }
      }
    }
  }
  function h(a) {
    function b(b) {
      var c = {defAtt:{}, losAtt:{}, defDef:{}, losDef:{}, saved:b || Timestamp.server()};
      $.each(a.getJQElement().find($("div#building_wall li.odd")), function(a, b) {
        0 < a && (RepConv.Debug && console.log($(b).find($(".list_item_left")).length), $.each($(b).find($(".list_item_left")), function(b, d) {
          RepConv.Debug && console.log(m[a][b]);
          RepConv.Debug && console.log(d.getElementsByClassName("wall_report_unit").length);
          $.each($(d).find($(".grcrt_wall_units")), function(d, e) {
            d = RepConvTool.getUnitName($(e).find($(".wall_report_unit")));
            e = $(e).find($(".place_unit_black")).html();
            c[m[a][b]][d] = e;
          });
        }), RepConv.Debug && console.log($(b).find($(".list_item_right")).length), $.each($(b).find($(".list_item_right")), function(b, d) {
          RepConv.Debug && console.log(m[a][b]);
          RepConv.Debug && console.log(d.getElementsByClassName("wall_report_unit").length);
          $.each($(d).find($(".grcrt_wall_units")), function(d, e) {
            d = RepConvTool.getUnitName($(e).find($(".wall_report_unit")));
            e = $(e).find($(".place_unit_black")).html();
            c[m[a][b + 1]][d] = e;
          });
        }));
      });
      return c;
    }
    function c() {
      try {
        RepConvTool.setItem(RepConv.Cookie, b(Timestamp.server()));
        var c = RepConvTool.getItem(RepConv.CookieWall) || [];
        10 < c.length && c.remove(0, 0);
        c.push(RepConvTool.getItem(RepConv.Cookie));
        RepConvTool.setItem(RepConv.CookieWall, c);
        setTimeout(function() {
          HumanMessage.success(RepConvTool.GetLabel("MSGHUMAN.OK"));
        }, 0);
        1 == $("#" + RepConv.Const.IdWindowClone).length && $("#" + RepConv.Const.IdWindowClone).remove();
        f(0, !1);
        f(n, !0);
        a.reloadContent();
        d();
      } catch (Oa) {
        RepConv.Debug && console.log(Oa), setTimeout(function() {
          HumanMessage.error(RepConvTool.GetLabel("MSGHUMAN.ERROR"));
        }, 0);
      }
    }
    function d(b) {
      RepConv.Debug && console.log("Load wall...");
      0 == a.getJQElement().find($("#RepConvSaved")).length && a.getJQElement().find($("#building_wall div.game_border")).append($("<div/>", {id:"RepConvSaved", style:"position: relative; float: left; margin: 5px; font-weight: bold;"}));
      a.getJQElement().find($(".wall_unit_container>.wall_report_unit")).wrap($("<div/>", {"class":"grcrt_wall_units"}));
      if (null != RepConvTool.getItem(RepConv.Cookie)) {
        var c = RepConvTool.getItem(RepConv.Cookie), d = RepConvTool.getItem(RepConv.CookieWall) || [];
        void 0 != b && $.each(d, function(a, d) {
          d.saved == b && (c = d);
        });
        a.getJQElement().find($("div.grcrt_wall_diff")).remove();
        a.getJQElement().find($("div.grcrt_wall_units")).append($("<div/>", {"class":"grcrt_wall_diff"}).html("-"));
        RepConv.Debug && console.log("Load wall...");
        var e;
        $.each(a.getJQElement().find($("div#building_wall li.odd")), function(a, b) {
          0 < a && (RepConv.Debug && console.log($(b).find($(".list_item_left")).length), $.each($(b).find($(".list_item_left")), function(b, d) {
            RepConv.Debug && console.log(m[a][b]);
            RepConv.Debug && console.log(d.getElementsByClassName("wall_report_unit").length);
            $.each($(d).find($(".grcrt_wall_units")), function(d, p) {
              d = RepConvTool.getUnitName($(p).find($(".wall_report_unit")));
              var f = $(p).find($(".place_unit_black")).html(), g = c[m[a][b]][d];
              RepConv.Debug && console.log(d + " " + g + "/" + f);
              e = f;
              void 0 != g && (e = f - g);
              RepConv.Debug && console.log("unitDiff = " + e);
              $(p).find($(".grcrt_wall_diff")).html(0 != e ? e : "");
            });
          }), RepConv.Debug && console.log($(b).find($(".list_item_right")).length), $.each($(b).find($(".list_item_right")), function(b, d) {
            RepConv.Debug && console.log(m[a][b]);
            RepConv.Debug && console.log(d.getElementsByClassName("wall_report_unit").length);
            $.each($(d).find($(".grcrt_wall_units")), function(d, p) {
              d = RepConvTool.getUnitName($(p).find($(".wall_report_unit")));
              var f = $(p).find($(".place_unit_black")).html(), g = c[m[a][b + 1]][d];
              RepConv.Debug && console.log(d + " " + g + "/" + f);
              e = f;
              void 0 != g && (e = f - g);
              RepConv.Debug && console.log("unitDiff = " + e);
              $(p).find($(".grcrt_wall_diff")).html(0 != e ? e : "");
            });
          }));
        });
        $("#RepConvSaved").html(RepConvTool.GetLabel("WALLSAVED") + (void 0 != c.saved ? ": " + readableUnixTimestamp(c.saved, "player_timezone", {with_seconds:!0, extended_date:!0}) : "")).css("color", "black");
      } else {
        $("#RepConvSaved").html(RepConvTool.GetLabel("WALLNOTSAVED")).css("color", "red");
      }
    }
    function e(b) {
      RepConv.Debug && console.log("Load state wall...");
      var c = RepConvTool.getItem(RepConv.Cookie), e = RepConvTool.getItem(RepConv.CookieWall) || [];
      b == n ? c = q : $.each(e, function(a, d) {
        d.saved == b && (c = d);
      });
      w.disable(b != n);
      $.each(a.getJQElement().find($("div#building_wall li.odd")), function(a, b) {
        0 < a && (RepConv.Debug && console.log($(b).find($(".list_item_left")).length), $.each($(b).find($(".list_item_left")), function(b, d) {
          RepConv.Debug && console.log(m[a][b]);
          RepConv.Debug && console.log(d.getElementsByClassName("wall_report_unit").length);
          $.each($(d).find($(".grcrt_wall_units")), function(d, e) {
            d = RepConvTool.getUnitName($(e).find($(".wall_report_unit")));
            $(e).find($(".place_unit_black")).html(c[m[a][b]][d]);
            $(e).find($(".place_unit_white")).html(c[m[a][b]][d]);
          });
        }), RepConv.Debug && console.log($(b).find($(".list_item_right")).length), $.each($(b).find($(".list_item_right")), function(b, d) {
          RepConv.Debug && console.log(m[a][b]);
          RepConv.Debug && console.log(d.getElementsByClassName("wall_report_unit").length);
          $.each($(d).find($(".grcrt_wall_units")), function(d, e) {
            d = RepConvTool.getUnitName($(e).find($(".wall_report_unit")));
            $(e).find($(".place_unit_black")).html(c[m[a][b + 1]][d]);
            $(e).find($(".place_unit_white")).html(c[m[a][b + 1]][d]);
          });
        }));
      });
      d(r.getValue());
    }
    function f(a, b) {
      var c = [], d = RepConvTool.getItem(RepConv.CookieWall) || [];
      $.each(d, function(b, d) {
        d.saved > a && d.saved < n && c.push({value:d.saved, name:readableUnixTimestamp(d.saved, "player_timezone", {with_seconds:!0, extended_date:!0})});
      });
      b ? (c.push({value:n, name:readableUnixTimestamp(n, "player_timezone", {with_seconds:!0, extended_date:!0})}), t.setOptions(c), t.setValue(n)) : (r.setOptions(c), r.setValue(void 0 != RepConvTool.getItem(RepConv.Cookie) ? RepConvTool.getItem(RepConv.Cookie).saved : 0));
    }
    function g() {
      r = l("grcrt_saved", $("<div/>", {id:"grcrtListSaved", "class":"dropdown default"}).dropdown({list_pos:"left", value:void 0 != RepConvTool.getItem(RepConv.Cookie) ? RepConvTool.getItem(RepConv.Cookie).saved : "", class_name:"grcrt_dd_list"}).on("dd:change:value", function(a, b, c, e, p) {
        f(b, !0);
        d(b);
      }).on("dd:list:show", function() {
        t.hide();
      }));
      t = l("grcrt_wall", $("<div/>", {id:"grcrtListWall", "class":"dropdown default"}).dropdown({list_pos:"left", value:void 0 != RepConvTool.getItem(RepConv.Cookie) ? RepConvTool.getItem(RepConv.Cookie).saved : "", class_name:"grcrt_dd_list"}).on("dd:change:value", function(a, b, c, d, p) {
        e(b);
      }).on("dd:list:show", function() {
        r.hide();
      }));
      u = l("grcrt_delsaved", $("<a/>", {"class":"cancel", style:"float:right;"}).button({template:"empty"}).on("btn:click", function() {
        hOpenWindow.showConfirmDialog(RepConvTool.GetLabel("QUESTION"), RepConvTool.GetLabel("WALL.WANTDELETECURRENT"), function() {
          h();
        });
      }).mousePopup(new MousePopup(RepConvTool.GetLabel("WALL.DELETECURRENT"))));
      f(0, !1);
      f(n, !0);
      a.getJQElement().find($("div#building_wall li")).eq(0).append($("<hr/>")).append($("<div/>", {"class":"grcrt_wall_compare"}).append($("<div/>", {"class":"grcrt_wall_compare_dd", style:"width: 49%;"}).append(u).append($("<label/>", {"for":"grcrtListSaved"}).text(RepConvTool.GetLabel("WALL.LISTSAVED"))).append(r)).append($("<div/>", {"class":"grcrt_wall_compare_dd", style:"width: 49%;"}).append($("<label/>", {"for":"grcrtListWall"}).text(RepConvTool.GetLabel("WALL.LISTSTATE"))).append(t)).append($("<br/>",
      {style:"clear:both"})));
    }
    function h() {
      try {
        var b = CM.get({main:"GRCRT", sub:"grcrt_saved"}, "grcrt_saved").getValue(), c = RepConvTool.getItem(RepConv.CookieWall) || [];
        $.each(c, function(a, d) {
          if (d.saved == b) {
            return c.remove(a, 0), !1;
          }
        });
        RepConvTool.setItem(RepConv.CookieWall, c);
        f(0, !1);
        f(n, !0);
        a.reloadContent();
        d();
        setTimeout(function() {
          HumanMessage.success(RepConvTool.GetLabel("MSGHUMAN.OK"));
        }, 0);
      } catch (Ja) {
        RepConv.Debug && console.log(Ja), setTimeout(function() {
          HumanMessage.error(RepConvTool.GetLabel("MSGHUMAN.ERROR"));
        }, 0);
      }
    }
    var k = a.getName(), m = {1:["defAtt", "losAtt"], 2:["defDef", "losDef"]}, n = Timestamp.server(), q = b(n), r, t, u;
    0 == a.getJQElement().find($("#building_wall div.game_border #BTNCONV" + k)).length && (a.getJQElement().find("#building_wall ul.game_list").css("max-height", "455px"), RepConvTool.AddBtn("BTNCONV", k).click(function() {
      r.hide();
      t.hide();
      window.GRCRTConvWnd = new _GRCRTConverterCtrl(a);
    }).appendTo(a.getJQElement().find($("#building_wall div.game_border"))));
    if (0 == a.getJQElement().find($("#building_wall div.game_border #BTNSAVE" + k)).length) {
      var w = RepConvTool.AddBtn("BTNSAVE", k).on("btn:click", function() {
        c();
      });
      w.appendTo(a.getJQElement().find($("#building_wall div.game_border")));
      $.each(a.getJQElement().find($("div#building_wall li.odd")), function(a, b) {
        0 < $(b.previousElementSibling).find($(".wall_symbol")).length && $(b.previousElementSibling).css("cursor", "pointer").click(function() {
          $(b).slideToggle(200);
        });
      });
      d();
      g();
      q = b(n);
      RepConv.wall = q;
    }
  }
  function r(a) {
    function b() {
      var b = {}, c, d = {}, e = 0, p = "", f = 0, g, h;
      $.each(a.getJQElement().find($('.game_list li[id^="support_units_"] a.gp_player_link')), function(a, d) {
        c = $(d).attr("href").split(/#/);
        g = JSON.parse(atob(c[1] || c[0]));
        Game.player_name != g.name && void 0 == b[g.id] && (b[g.id] = g);
      });
      $.each(b, function(a, c) {
        a = {player_id:c.id, town_id:Game.townId, nl_init:NotificationLoader.isGameInitialized()};
        a = $.ajax({url:"/game/player?action=get_profile_html&town_id=" + Game.townId + "&h=" + Game.csrfToken + "&json=" + JSON.stringify(a), async:!1});
        try {
          var d = JSON.parse(a.responseText).plain.html;
        } catch (ua) {
          d = a.responseText;
        }
        b[c.id].alliance_name = ($(d).children("a").attr("onclick") || "").replace(/.*\('(.*)'.*/, "$1");
      });
      p = a.getJQElement().find($("#defense_header")).html().stripTags() + ":";
      p += "[town]" + Game.townId + "[/town]";
      p += "\n[table]\n";
      $.each(b, function(b, c) {
        h = "[*]" + ++f + ".[|]";
        h += "[player]" + c.name + "[/player][|]";
        h += "[ally]" + c.alliance_name + "[/ally]";
        h += "[/*]\n";
        3000 < (p + h).length && (d[e] = p + "[/table]", e++, p = a.getJQElement().find($("#defense_header")).html().stripTags() + ":", p += "[town]" + Game.townId + "[/town]", p += "\n[table]\n");
        p += h;
      });
      Layout.hideAjaxLoader();
      d[e] = p + "[/table]";
      if ("undefined" != typeof RepConvParamWnd) {
        try {
          RepConvParamWnd.close();
        } catch (oa) {
        }
        RepConvParamWnd = void 0;
      }
      window.RepConvParamWnd = Layout.dialogWindow.open("", RepConv.Scripts_name, 500, 580, null, !1);
      RepConvParamWnd.setHeight(480);
      RepConvParamWnd.setPosition(["center", "center"]);
      RepConvParamWnd.appendContent($("<div/>", {style:"width:100%"}).html(RepConvTool.GetLabel("BBCODELIMIT")));
      $.each(d, function(a, b) {
        RepConvParamWnd.appendContent($("<textarea/>", {"class":"message_post_content", style:"height: 160px; width: 98%; border: 1px solid #D1BF91", readonly:"readonly"}).text(b).click(function() {
          this.select();
        }));
      });
    }
    var c = a.getName();
    0 == a.getJQElement().find($("#place_defense #BTNCONV" + c)).length && a.getJQElement().find($("#place_defense div.game_list_footer")).append(RepConvTool.AddBtn("BTNCONV", c).click(function() {
      window.GRCRTConvWnd = new _GRCRTConverterCtrl(a);
    }));
    0 < a.getJQElement().find($("#place_defense #defense_header")).length && 0 == a.getJQElement().find($("#place_defense #BTNSUPPLAYERS" + c)).length && a.getJQElement().find($("#place_defense div.game_list_footer")).append(RepConvTool.AddBtn("BTNSUPPLAYERS", c).click(function() {
      b();
    }));
  }
  function g(a) {
    var b = a.getName();
    if (0 < a.getJQElement().find($("#dd_commands_command_type")).length && 0 == a.getJQElement().find($("#BTNCONV" + b)).length) {
      a.getJQElement().find($("#game_list_footer")).append(RepConvTool.AddBtn("BTNCONV", b).click(function() {
        window.GRCRTConvWnd = new _GRCRTConverterCtrl(a);
      }));
      CM.get(a.getContext(), "dd_commands_command_type") && CM.get(a.getContext(), "dd_commands_command_type").bind("dd:change:value", function(b, c, d, e) {
        J(a, parseInt(w("grcrt_townsDD").getValue() || "0"), RepConvGRC.townsCommand);
      });
      JSON.parse(RepConv.requests.town_overviews.responseText);
      b = {name:RepConvTool.GetLabel("COMMAND.ALL"), value:0};
      var c = [{name:"enable", value:1}, {name:"disable", value:0}], d = [b];
      l("grcrt_townsDD", $("<div/>", {id:"grcrt_townsDD", "class":"dropdown default", style:"margin-left:5px;width: 120px;"}).dropdown({list_pos:"left", value:b.value, options:d}).on("dd:change:value", function(b, c, d, e, p) {
        J(a, c, RepConvGRC.townsCommand);
      }));
      l("grcrt_FI", $("<div/>", {id:"grcrt_FI", "class":"dropdown default", style:"margin-left:5px;width: 120px;"}).dropdown({list_pos:"left", value:1, options:c}).on("dd:change:value", function(b, c, d, e, p) {
        RepConv.Debug && console.log("grcrt_FI" + c);
        J(a, parseInt(w("grcrt_townsDD").getValue() || "0"), RepConvGRC.townsCommand);
      }));
      l("grcrt_FR", $("<div/>", {id:"grcrt_FR", "class":"dropdown default", style:"margin-left:5px;width: 120px;"}).dropdown({list_pos:"left", value:1, options:c}).on("dd:change:value", function(b, c, d, e, p) {
        RepConv.Debug && console.log("grcrt_FR" + c);
        J(a, parseInt(w("grcrt_townsDD").getValue() || "0"), RepConvGRC.townsCommand);
      }));
      l("grcrt_FO", $("<div/>", {id:"grcrt_FO", "class":"dropdown default", style:"margin-left:5px;width: 120px;"}).dropdown({list_pos:"left", value:1, options:c}).on("dd:change:value", function(b, c, d, e, p) {
        RepConv.Debug && console.log("grcrt_FO" + c);
        J(a, parseInt(w("grcrt_townsDD").getValue() || "0"), RepConvGRC.townsCommand);
      }));
      m("grcrt_towns");
      b = l("grcrt_towns", $("<div/>", {id:"grcrt_towns", "class":"dropdown default", style:"margin-left:5px;width: 180px;"}).dropdown({list_pos:"left", value:w("grcrt_townsDD") ? w("grcrt_townsDD").getValue() : Options.value, options:w("grcrt_townsDD").getOptions()}).on("dd:change:value", function(b, c, d, e, p) {
        w("grcrt_townsDD").setValue(c);
        q(a);
        J(a, c, RepConvGRC.townsCommand);
      }));
      a.getJQElement().find($("#game_list_header")).append($("<div/>", {id:"grcrt_command_filter", style:"display: inline-block; float: right;"}).append($("<span/>", {"class":"grcrt_filter"}).html(a.getJQElement().find($("#command_filter>span")).html())).append($("<span/>", {"class":"overview_incoming icon grcrt_filter"}).mousePopup(new MousePopup(RepConvTool.GetLabel("COMMAND.INCOMING"))).addClass(0 == parseInt(w("grcrt_FI").getValue()) ? "grcrt_disabled" : "").click(function() {
        $(this).toggleClass("grcrt_disabled");
        w("grcrt_FI").setValue($(this).hasClass("grcrt_disabled") ? "0" : "1");
      })).append($("<span/>", {"class":"overview_outgoing icon grcrt_filter"}).mousePopup(new MousePopup(RepConvTool.GetLabel("COMMAND.OUTGOING"))).addClass(0 == parseInt(w("grcrt_FO").getValue()) ? "grcrt_disabled" : "").click(function() {
        $(this).toggleClass("grcrt_disabled");
        w("grcrt_FO").setValue($(this).hasClass("grcrt_disabled") ? "0" : "1");
      })).append($("<span/>", {"class":"grcrt_return grcrt_filter"}).mousePopup(new MousePopup(RepConvTool.GetLabel("COMMAND.RETURNING"))).addClass(0 == parseInt(w("grcrt_FR").getValue()) ? "grcrt_disabled" : "").click(function() {
        $(this).toggleClass("grcrt_disabled");
        w("grcrt_FR").setValue($(this).hasClass("grcrt_disabled") ? "0" : "1");
      })).append($("<label/>").text(RepConvTool.GetLabel("COMMAND.FORTOWN"))).append(b));
      0 == parseInt(w("grcrt_townsDD").getValue()) && a.getJQElement().find($("span.icon.grcrt_filter")).hide();
      q(a);
      J(a, parseInt(w("grcrt_townsDD").getValue() || "0"), RepConvGRC.townsCommand);
    }
  }
  function q(a) {
    var b = JSON.parse(RepConv.requests.town_overviews.responseText).json.data.commands, c = [{name:RepConvTool.GetLabel("COMMAND.ALL"), value:0}], d = {};
    RepConv.Debug && console.log("refreshTownList");
    RepConvGRC.townsCommand = {};
    a.getJQElement().find($("span.icon.grcrt_filter")).hide();
    0 != parseInt(w("grcrt_townsDD").getValue()) && (a.getJQElement().find($("span.icon.grcrt_filter")).show(), RepConv.Debug && console.log(w("grcrt_townsDD").getOption("value", parseInt(w("grcrt_townsDD").getValue()))), a = w("grcrt_townsDD").getOption("value", parseInt(w("grcrt_townsDD").getValue())), d[a.value] = a);
    $.each(b, function(a, b) {
      a = {name:b.origin_town_name, value:b.origin_town_id};
      var c = {name:b.destination_town_name, value:b.destination_town_id};
      void 0 == RepConvGRC.townsCommand[a.value] && (RepConvGRC.townsCommand[a.value] = []);
      void 0 == RepConvGRC.townsCommand[c.value] && (RepConvGRC.townsCommand[c.value] = []);
      d[c.value] = c;
      d[a.value] = a;
      RepConvGRC.townsCommand[a.value].push(b);
      RepConvGRC.townsCommand[c.value].push(b);
    });
    $.each(d, function(a, b) {
      c.push(b);
    });
    w("grcrt_townsDD") && (w("grcrt_townsDD").setOptions(c), w("grcrt_towns") && w("grcrt_towns").setOptions(w("grcrt_townsDD").getOptions()));
  }
  function l(a, b) {
    w(a) || (RepConv.Debug && console.log("register: " + a), CM.register({main:"GRCRT", sub:a}, a, b));
    return w(a);
  }
  function m(a) {
    w(a) && (RepConv.Debug && console.log("unregister: " + a), CM.unregister({main:"GRCRT", sub:a}, a));
  }
  function w(a) {
    RepConv.Debug && console.log("get: " + a);
    return CM.get({main:"GRCRT", sub:a}, a);
  }
  function J(a, b, c) {
    if (0 == b) {
      a.getJQElement().find($(".place_command")).removeClass("grcrt_command"), 0 == parseInt(w("grcrt_FR").getValue()) && $.each(c, function(b, c) {
        $.each(c, function(b, c) {
          c.return && a.getJQElement().find($("#command_" + c.id)).addClass("grcrt_command");
        });
      });
    } else {
      try {
        a.getJQElement().find($(".place_command")).addClass("grcrt_command"), $.each(c[b], function(c, d) {
          a.getJQElement().find($("#command_" + d.id)).addClass("grcrt_command");
          1 != parseInt(w("grcrt_FI").getValue()) || d.destination_town_id != b || d.return || a.getJQElement().find($("#command_" + d.id)).removeClass("grcrt_command");
          1 == parseInt(w("grcrt_FR").getValue()) && d.destination_town_id == b && d.return && a.getJQElement().find($("#command_" + d.id)).removeClass("grcrt_command");
          1 == parseInt(w("grcrt_FR").getValue()) && d.origin_town_id == b && d.return && a.getJQElement().find($("#command_" + d.id)).removeClass("grcrt_command");
          1 != parseInt(w("grcrt_FO").getValue()) || d.origin_town_id != b || d.return || a.getJQElement().find($("#command_" + d.id)).removeClass("grcrt_command");
        });
      } catch (B) {
      }
    }
  }
  function W(a) {
    var b = a.getName();
    0 == a.getJQElement().find($("div.command_info #BTNCONV" + b)).length && (RepConvTool.AddBtn("BTNCONV", b).css({position:"absolute", bottom:"0px", right:"0px"}).click(function() {
      window.GRCRTConvWnd = new _GRCRTConverterCtrl(a);
    }).appendTo(a.getJQElement().find($("div.command_info"))), 0 < a.getJQElement().find($("div.command_info a.button")).length && a.getJQElement().find($("div.command_info #BTNCONV" + b)).css("right", "125px"), $.each(a.getJQElement().find($("#casted_power_reports a")), function(b, d) {
      b = $(d).attr("onclick").replace(/.*\(([0-9]*)\).*/, "$1");
      gpAjax.ajaxPost("report", "view", {id:b}, !0, {success:function(b, c, d, e) {
        $("#RepConvTMP").html(c.html);
        1 == $("#RepConvTMP").find($("#report_power_symbol.wisdom")).length && (b = $("#RepConvTMP").find($("#right_side")), a.getJQElement().find($("fieldset.command_info_units .index_unit")).hide(), a.getJQElement().find($("fieldset.command_info_units")).append($("<div/>", {"class":"grcrt_wisdom"}).append($("<div/>", {"class":"power_icon60x60 wisdom", style:"float:left"})).append(b)));
        $("#RepConvTMP").html(null);
      }});
    }));
  }
  function U(a) {
    var b = a.getName();
    0 < a.getJQElement().find($("#conqueror_units_in_town")).length && 0 == a.getJQElement().find($("#conqueror_units_in_town #BTNCONV" + b)).length && RepConvTool.AddBtn("BTNCONV", b).click(function() {
      window.GRCRTConvWnd = new _GRCRTConverterCtrl(a);
    }).attr("style", "position: absolute; right: 0px; top: 0px;").appendTo(a.getJQElement().find($("#conqueror_units_in_town")));
    0 < a.getJQElement().find($("#unit_movements")).length && 0 == a.getJQElement().find($("#unit_movements #BTNCONV" + b)).length && RepConvTool.AddBtn("BTNCONV", b).click(function() {
      window.GRCRTConvWnd = new _GRCRTConverterCtrl(a);
    }).attr("style", "position: absolute; right: 20px; top: 0px;").appendTo(a.getJQElement().find($("#unit_movements")));
  }
  function H(a) {
    var b = a.getName();
    "town_info_support" == a.getContext().sub && 0 == a.getJQElement().find($("div.support_details_box .game_border #BTNCONV" + b)).length && a.getJQElement().find($("div.support_details_box .game_border")).append(RepConvTool.AddBtn("BTNCONV", b).click(function() {
      window.GRCRTConvWnd = new _GRCRTConverterCtrl(a);
    }).css({position:"absolute", top:"-2px", right:"-2px"}));
  }
  function za(a) {
    var b = a.getName(), c = "#" + b;
    if (0 == a.getJQElement().find($(c + "RepConvStatsPlayer")).length && void 0 != $(a.getJQElement().find($("a.gp_player_link"))[0]).attr("href")) {
      var d = $(a.getJQElement().find($("a.gp_player_link"))[0]).attr("href").split(/#/), e = JSON.parse(atob(d[1] || d[0])).id, f = encodeURIComponent($(a.getJQElement().find($("a.gp_player_link"))[0]).html());
      d = $("<a/>", {href:"#n", id:b + "RepConvStatsPlayer", player_id:e, player_name:f}).html($("<img/>", {src:RepConv.Const.staticImg + "/stats.png"})).mousePopup(new MousePopup(RepConvTool.GetLabel("STATS.PLAYER")));
      "https:" == window.location.protocol && "potusek" != RepConv.active.statsGRCL ? $(d).attr({href:K("player", e, f), target:"_blank"}) : $(d).click(function() {
        R("player", $(this).attr("player_id"), $(this).attr("player_name"));
      });
      a.getJQElement().find($("a.color_table.assign_color")).parent().css("min-width", "100px").append(d);
    }
    0 == a.getJQElement().find($(c + "RepConvStatsAlly")).length && void 0 != a.getJQElement().find($("a.color_table.assign_ally_color")).parent().parent().children().eq(1).attr("onclick") && (e = a.getJQElement().find($("a.color_table.assign_ally_color")).parent().parent().children().eq(1).attr("onclick").replace(/.*,([0-9]*)\)/, "$1"), f = a.getJQElement().find($("a.color_table.assign_ally_color")).parent().parent().children().eq(1).html(), d = $("<a/>", {href:"#n", id:b + "RepConvStatsAlly", ally_id:e,
    ally_name:f}).html($("<img/>", {src:RepConv.Const.staticImg + "/stats.png"})).mousePopup(new MousePopup(RepConvTool.GetLabel("STATS.ALLY"))), "https:" == window.location.protocol && "potusek" != RepConv.active.statsGRCL ? $(d).attr({href:K("alliance", e, f), target:"_blank"}) : $(d).click(function() {
      R("alliance", $(this).attr("ally_id"), $(this).attr("ally_name"));
    }), a.getJQElement().find($("a.color_table.assign_ally_color")).parent().css("min-width", "100px").append(d));
    if (0 == a.getJQElement().find($(c + "RepConvStatsTown")).length && 0 < a.getJQElement().find($(".town_bbcode_id")).length) {
      var g = a.getJQElement().find($(".town_bbcode_id")).attr("value").replace(/.*\]([0-9]*)\[.*/, "$1");
      d = $("<a/>", {href:"#n", id:b + "RepConvStatsTown", town_id:g, town_name:a.getTitle(), style:"position: absolute; top: 1px; right: 2px;"}).html($("<img/>", {src:RepConv.Const.staticImg + "/stats.png"})).mousePopup(new MousePopup(RepConvTool.GetLabel("STATS.TOWN")));
      "https:" == window.location.protocol && "potusek" != RepConv.active.statsGRCL ? $(d).attr({href:K("town", g, null), target:"_blank"}) : $(d).click(function() {
        R("town", $(this).attr("town_id"), $(this).attr("town_name"));
      });
      a.getJQElement().find($("div.game_header.bold")).append(d);
    }
    if (0 == a.getJQElement().find($(c + "RepConvRadarPlayer")).length && 0 < a.getJQElement().find($(".town_bbcode_id")).length) {
      c = a.getJQElement().find($(".info_jump_to_town")).attr("onclick");
      d = /\w+:\d+/g;
      g = {};
      for (g.name = a.getTitle(); e = d.exec(c);) {
        g[e[0].split(":")[0]] = e[0].split(":")[1];
      }
      a.getJQElement().find($('[id*="RepConvStatsTown"]')).before($("<a/>", {href:"#n", id:b + "RepConvRadarPlayer", town_id:g.id, style:"position: absolute; top: 1px; right: 30px;"}).html($("<img/>", {class:"grcrt radar", src:RepConv.grcrt_domain + "/ui/layout_3.3.0.png", style:"object-position: -77px -80px; width: 30px;"})).mousePopup(new MousePopup(RepConvTool.GetLabel("RADAR.TOWNFINDER"))).click(function() {
        GRCRT_Radar.windowOpen({town:{id:g.id, name:g.name, ix:g.x, iy:g.y}});
      }));
    }
    RepConv.settings[RepConv.Cookie + "_idle"] && 0 == a.getJQElement().find($(".grcrt_idle")).length && 0 != a.getJQElement().find($(".gp_player_link")).length && ($("<div/>", {"class":"grcrt_idle"}).insertBefore(a.getJQElement().find($("li:not(.reservation_tool)")).find($(".gp_player_link"))), ca(a));
  }
  function R(a, b, c) {
    $("<div/>", {id:"RepConvNode"});
    "potusek" == RepConv.active.statsGRCL && WF.open("grcrt_stats", {args:{what:a, id:b, name:c}});
  }
  function K(a, b, c) {
    "grepointel" == RepConv.active.statsGRCL ? ("player" == a ? a = "pn" : "alliance" == a && (a = "an"), a = "http://grepointel.com/track.php?server=" + Game.world_id + "&" + a + "=" + c + "&rt=overview") : a = RepConv.Scripts_url + Game.locale_lang + "/" + a + "/" + Game.world_id + "/" + b;
    return a;
  }
  function ya(a) {
    "town_info_trading" != a.getContext().sub && "wonders_index" != a.getContext().sub || 0 != a.getJQElement().find($(".amounts .curr4")).length || a.getJQElement().find($(".amounts .curr3")).after($("<span/>", {"class":"curr4"})).bind("DOMSubtreeModified", function() {
      var a = $(this).parent();
      0 < $(a).find($(".curr3")).text().length || 0 < $(a).find($(".curr2")).text().length ? $(a).find($(".curr4")).html(" = " + eval($(a).find($(".curr")).text() + $(a).find($(".curr2")).text() + $(a).find($(".curr3")).text())) : $(a).find($(".curr4")).html("");
    });
    $.each(a.getJQElement().find($(".amounts .curr4")), function(a, b) {
      a = $(b).parent();
      0 < $(a).find($(".curr3")).text().length || 0 < $(a).find($(".curr2")).text().length ? $(a).find($(".curr4")).html(" = " + eval($(a).find($(".curr")).text() + $(a).find($(".curr2")).text() + $(a).find($(".curr3")).text())) : $(a).find($(".curr4")).html("");
    });
  }
  function ha(a) {
    if (RepConv.active.power) {
      switch(a.getContext().sub) {
        case "town_info_god":
        case "command_info_god":
          a.getJQElement().find($(".choose_power.disabled")).css("opacity", "0.4").attr("href", null).attr("onclick", null), RepConv.Debug && console.log("loadPower"), $.each(a.getJQElement().find($(".js-power-icon div[name=counter]")), function(a, b) {
            $(b).remove();
          }), $.each(a.getJQElement().find($(".js-power-icon.disabled")), function(b, c) {
            b = GameData.powers[$(c).attr("data-power_id")];
            var d = MM.checkAndPublishRawModel("PlayerGods", {id:Game.player_id}).getCurrentProductionOverview()[b.god_id];
            if (0 == a.getJQElement().find($(".js-god-box.disabled." + b.god_id)).length && 0 < d.production) {
              var e = MM.checkAndPublishRawModel("PlayerGods", {id:Game.player_id})[b.god_id + "_favor_delta_property"].calculateCurrentValue().unprocessedCurrentValue;
              $(c).append($("<div/>", {style:"margin-top:32px;color:white;text-shadow: 1px 1px 1px black;font-size:10px;z-index:3000;font-weight: bold;", name:"counter"}).countdown(Timestamp.server() + (b.favor - e) / d.production * 3600));
            }
          });
      }
    }
  }
  function ia(a) {
    var b = $("#window_" + a.getIdentifier()).find("div.window_content");
    0 == b.find($("#BTNCONV" + a.getIdentifier())).length && b.append(RepConvTool.AddBtn("BTNCONV", a.getIdentifier()).click(function() {
      RepConv.Debug && console.log(a.getType() + " [id:" + a.getIdentifier() + "]");
      window.GRCRTConvWnd = new _GRCRTConverterCtrl(a);
    }).css({position:"absolute", bottom:"15px", right:"15px"}));
  }
  function Ga() {
    if (RepConv.settings[RepConv.Cookie + "_town_popup"]) {
      var a = {}, b = MM.checkAndPublishRawModel("Player", {id:Game.player_id}).getAllianceName();
      $.each(ITowns.towns, function(c, d) {
        d.points = d.getPoints();
        d.player_name = Game.player_name;
        d.alliance_name = b;
        d.tooltip = new MousePopup(WMap.createTownTooltip("town", d));
        a[c] = d;
      });
      $.each($("#town_groups_list .item.town_group_town:not(.grcrtPopup)"), function(b, d) {
        b = a[$(d).data("townid")];
        $(d).find($(".town_name")).mousePopup(b.tooltip);
        $(d).addClass("grcrtPopup");
      });
    }
  }
  function Ca(a, b) {
    var c = $("<div/>", {"class":"gpwindow_content", style:"overflow-y:auto !important; max-height: 185px; min-height: 120px;"}), d = $("<ul/>", {"class":"menu_inner grcrt_menu_inner", style:"padding: 0px;left:0px;"}), e = $("<div/>", {id:"emots_popup_" + a, style:"display:none; z-index: 5000; min-height: 180px;max-height: 265px;"}).append($("<div/>", {"class":"menu_wrapper", style:"left: -10px;"}).append(d)).append($("<div/>", {"class":"gpwindow_left"})).append($("<div/>", {"class":"gpwindow_right"})).append($("<div/>",
    {"class":"gpwindow_bottom"}).append($("<div/>", {"class":"gpwindow_left corner"})).append($("<div/>", {"class":"gpwindow_right corner"}))).append($("<div/>", {"class":"gpwindow_top"}).append($("<div/>", {"class":"gpwindow_left corner"})).append($("<div/>", {"class":"gpwindow_right corner"}))).append(c).css({position:"absolute", top:"22px", left:"455px", width:"300px"}), f = $("<div/>"), p = !0;
    $.each(RepConvAdds.emotsLists, function(c, e) {
      d.append($("<li/>", {style:"float: left;padding: 0px;"}).append($("<a/>", {"class":"grcrt_emots submenu_link" + (p ? " active" : ""), href:"#n", "data-group":c}).append($("<span/>", {"class":"left"}).append($("<span/>", {"class":"right"}).append($("<span/>", {"class":"middle"}).html($("<img/>", {src:RepConv.grcrt_cdn + e.img}))))).click(function() {
        if (!$(this).hasClass("active")) {
          var b = $(this).data("group");
          $("#emots_popup_" + a + " a.submenu_link").removeClass("active");
          $("#emots_popup_" + a + " div.grcrt_emots_detail").hide();
          $(this).addClass("active");
          $("#emots_popup_" + a + " div.grcrt_emots_detail.e" + b).show();
        }
      })));
      var g = $("<div/>", {"class":"grcrt_emots_detail e" + c, style:"display:" + (p ? "block" : "none")});
      $.each(e.detail, function(a, d) {
        g.append($("<img/>", {src:("usersaved" != c ? RepConv.grcrt_cdn : "") + d.img, style:"cursor: pointer;"}).click(b));
      });
      f.append(g);
      p = !1;
    });
    c.append(f);
    return e;
  }
  function E(a, b, c) {
    0 == a.getJQElement().find("#emots_popup_" + a.type).length && (a.getJQElement().find($(".bb_button_wrapper")).append(Ca(a.type, function() {
      RepConvTool.insertBBcode("[img]" + $(this).attr("src") + "[/img]", "", a.getJQElement().find(c)[0]);
      a.getJQElement().find($("#emots_popup_" + a.type)).toggle();
    })), a.getJQElement().find($(".bb_button_wrapper")).append($("<div/>", {id:"reports_popup_" + a.getType(), "class":"grcrtbb_reports", style:"display:none; z-index: 5000;"}).append($("<div/>", {"class":"bbcode_box middle_center"}).append($("<div/>", {"class":"bbcode_box top_left"})).append($("<div/>", {"class":"bbcode_box top_right"})).append($("<div/>", {"class":"bbcode_box top_center"})).append($("<div/>", {"class":"bbcode_box bottom_center"})).append($("<div/>", {"class":"bbcode_box bottom_right"})).append($("<div/>",
    {"class":"bbcode_box bottom_left"})).append($("<div/>", {"class":"bbcode_box middle_left"})).append($("<div/>", {"class":"bbcode_box middle_right"})).append($("<div/>", {"class":"bbcode_box content clearfix", style:"overflow-y:auto !important; max-height: 185px;"}).append($("<ul/>")))).css({position:"absolute", top:"27px", left:"525px", width:"120px"})), $.each(RepConv.__repconvValueArray, function(b, d) {
      a.getJQElement().find("#reports_popup_" + a.getType() + " .content ul").append($("<li/>").append($("<a/>", {href:"#n"}).html("\u00bb " + DM.getl10n("COMMON", "window_goto_page").page + " " + (b + 1) + "/" + Object.size(RepConv.__repconvValueArray)).click(function() {
        RepConvTool.insertBBcode(M(b) + RepConv.__repconvValueArray[b], "", a.getJQElement().find(c)[0]);
        a.getJQElement().find($(".grcrtbb_reports")).hide();
      })));
    }), a.getJQElement().find(b).append($("<img/>", {src:RepConv.Scripts_url + "emots/usmiech.gif", style:"cursor: pointer;"}).click(function() {
      a.getJQElement().find($('.bb_button_wrapper>div[class^="bb"]')).remove();
      a.getJQElement().find($(".grcrtbb_reports")).hide();
      a.getJQElement().find($("#emots_popup_" + a.type)).toggle();
    })), a.getJQElement().find(b).append($("<img/>", {src:RepConv.Const.uiImg + "paste_report.png", style:"cursor: pointer;"}).click(function() {
      a.getJQElement().find($('.bb_button_wrapper>div[class^="bb"]')).remove();
      a.getJQElement().find($(".grcrtbb_emots")).hide();
      switch(Object.size(RepConv.__repconvValueArray)) {
        case 0:
          break;
        case 1:
          RepConvTool.insertBBcode(M(0) + RepConv.__repconvValueArray[0], "", a.getJQElement().find($(c))[0]);
          break;
        default:
          a.getJQElement().find($("#reports_popup_" + a.getType())).toggle();
      }
    }).mousePopup(new MousePopup(RepConvTool.GetLabel("POPINSERTLASTREPORT")))));
  }
  function L(a) {
    $("#window_" + a.getIdentifier()).unbind("DOMSubtreeModified").bind("DOMSubtreeModified", function() {
      var b = $("#window_" + a.getIdentifier()).find($("div.bb_button_wrapper")), c = $("#window_" + a.getIdentifier()).find($("div.notes_container"));
      0 < b.length && 0 == $("#window_" + a.getIdentifier()).find($("div.notes_container #emots_popup_" + a.getType())).length && ($("#window_" + a.getIdentifier()).unbind("DOMSubtreeModified"), $(b).find($(".bbcode_option")).bind("click", function() {
        $(b).find($("#emots_popup_" + a.getType())).hide();
        $(b).find($("#reports_popup_" + a.getType())).hide();
      }), $(b).append(Ca(a.getType(), function() {
        RepConvTool.insertBBcode("[img]" + $(this).attr("src") + "[/img]", "", $(c).find($("textarea"))[0]);
        $(c).find($("textarea")).keyup();
        $(b).find($("#emots_popup_" + a.getType())).toggle();
      })), $(b).append($("<div/>", {id:"reports_popup_" + a.getType(), "class":"grcrtbb_reports", style:"display:none; z-index: 5000;"}).append($("<div/>", {"class":"bbcode_box middle_center"}).append($("<div/>", {"class":"bbcode_box top_left"})).append($("<div/>", {"class":"bbcode_box top_right"})).append($("<div/>", {"class":"bbcode_box top_center"})).append($("<div/>", {"class":"bbcode_box bottom_center"})).append($("<div/>", {"class":"bbcode_box bottom_right"})).append($("<div/>", {"class":"bbcode_box bottom_left"})).append($("<div/>",
      {"class":"bbcode_box middle_left"})).append($("<div/>", {"class":"bbcode_box middle_right"})).append($("<div/>", {"class":"bbcode_box content clearfix", style:"overflow-y:auto !important; max-height: 185px;"}).append($("<ul/>")))).css({position:"absolute", top:"27px", left:"525px", width:"120px"})), $.each(RepConv.__repconvValueArray, function(d, e) {
        $(b).find("#reports_popup_" + a.getType() + " .content ul").append($("<li/>").append($("<a/>", {href:"#n"}).html("\u00bb " + DM.getl10n("COMMON", "window_goto_page").page + " " + (d + 1) + "/" + Object.size(RepConv.__repconvValueArray)).click(function() {
          RepConvTool.insertBBcode(M(d) + RepConv.__repconvValueArray[d], "", $(c).find($("textarea"))[0]);
          $(c).find($("textarea")).keyup();
          $(b).find($(".grcrtbb_reports")).hide();
        })));
      }), $(b).append($("<img/>", {src:RepConv.Scripts_url + "emots/usmiech.gif", style:"cursor: pointer;"}).click(function() {
        $(b).find($('.bb_button_wrapper>div[class^="bb"]')).remove();
        $(b).find($(".grcrtbb_reports")).hide();
        $(b).find($("#emots_popup_" + a.getType())).toggle();
      })).append($("<img/>", {src:RepConv.Const.uiImg + "paste_report.png", style:"cursor: pointer;"}).click(function() {
        $(b).find($('.bb_button_wrapper>div[class^="bb"]')).remove();
        $(b).find($(".grcrtbb_emots")).hide();
        switch(Object.size(RepConv.__repconvValueArray)) {
          case 0:
            break;
          case 1:
            RepConvTool.insertBBcode(M(0) + RepConv.__repconvValueArray[0], "", $(c).find($("textarea"))[0]);
            $(c).find($("textarea")).keyup();
            break;
          default:
            $(b).find($("#reports_popup_" + a.getType())).toggle();
        }
      }).mousePopup(new MousePopup(RepConvTool.GetLabel("POPINSERTLASTREPORT")))), L(a));
    });
  }
  function M(a) {
    return null != RepConv.__repconvHtmlArray && void 0 != RepConv.__repconvHtmlArray ? "[url=http://www.grcrt.net/repview.php?rep=" + $.ajax({url:"https://www.grcrt.net/repsave.php", method:"post", data:{html:RepConv.__repconvHtmlArray[a]}, cache:!1, async:!1}).responseJSON.filename + "]" + RepConvTool.GetLabel("MOBILEVERSION") + "[/url]\n\n" : "";
  }
  function sa(a) {
    if (RepConv.active.power) {
      var b = GameData.powers[a];
      setTimeout(function() {
        try {
          var a = MM.checkAndPublishRawModel("PlayerGods", {id:Game.player_id}).getCurrentProductionOverview()[b.god_id], d = MM.checkAndPublishRawModel("PlayerGods", {id:Game.player_id})[b.god_id + "_favor_delta_property"].calculateCurrentValue().unprocessedCurrentValue, e = Timestamp.server() + (b.favor - d) / a.production * 3600;
          $("#popup_content div#grcrt_pop_ads").remove();
          0 < b.favor - a.current && 0 < a.production && $("#popup_content div.temple_power_popup").append($("<div/>", {name:"counter", id:"grcrt_pop_ads"}).css({margin:"70px 10px 0 0", "float":"right", "text-shadow":"2px 2px 2px white", color:"black", "font-weight":"bold", position:"absolute", top:"20px", right:"270px"}).countdown(e));
        } catch (v) {
        }
      }, 100);
    }
  }
  function la() {
    if (RepConv.settings[RepConv.Cookie + "_idle"] && 10 > ba) {
      if (!RepConvGRC.idle || RepConvGRC.idle.time + 30 < Timestamp.server()) {
        RepConv.Debug && console.log("getIdleData - fetch"), $.ajax({url:"https://www.grcrt.net/json.php", method:"get", data:{method:"getIdleJSON", world:Game.world_id}, cache:!0}).done(function(a) {
          ba = 0;
          RepConvGRC.idle = a;
          RepConvGRC.idle.time = Timestamp.server();
        }).fail(function() {
          ba++;
        });
      }
      RepConv.Debug && console.log("getIdleData");
    }
  }
  function ca(a) {
    $.each(a.getJQElement().find($(".grcrt_idle")), function(b, c) {
      b = ("player_get_profile_html" == a.getContext().sub ? btoa(JSON.stringify({id:a.getOptions().player_id})) : $(c).nextAll(".gp_player_link").attr("href")).split(/#/);
      b = a.getType() == Layout.wnd.TYPE_PLAYER_PROFILE_EDIT ? Game.player_id : "player_get_profile_html" == a.getContext().sub ? JSON.parse(unescape(RepConv.requests.player.url).match(/({.*})/)[0]).player_id : JSON.parse(atob(b[1] || b[0])).id;
      b = parseFloat(RepConvGRC.idle.JSON[b] || "0");
      $(c).addClass("grcrt_idle_days");
      $(c).addClass("grcrt_idle_dg");
      $(c).html(parseInt(b));
      $(c).mousePopup(new MousePopup("<b>" + RepConvTool.GetLabel("STATS.INACTIVE") + ": </b>" + (hours_minutes_seconds(3600 * parseInt(24 * b)) || "0") + '<br/><div style="font-size:75%">' + RepConvTool.GetLabel("STATS.INACTIVEDESC") + "</div>"));
      7 <= b ? $(c).toggleClass("grcrt_idle_dg grcrt_idle_dr") : 2 <= b && $(c).toggleClass("grcrt_idle_dg grcrt_idle_dy");
    });
  }
  function ma(a) {
    var b = {}, c;
    RepConv.settings[RepConv.Cookie + "_mcol"] && (b[Game.alliance_id] = "OWN_ALLIANCE", $.each(MM.getOnlyCollectionByName("AlliancePact").models, function(a, d) {
      if (!d.getInvitationPending()) {
        switch(d.getRelation()) {
          case "war":
            c = "ENEMY";
            break;
          case "peace":
            c = "PACT";
        }
        b[d.getAlliance1Id() == Game.alliance_id ? d.getAlliance2Id() : d.getAlliance1Id()] = c;
      }
    }), $.each(a.getJQElement().find($("a.gp_player_link")), function(a, c) {
      if (a = $(c).attr("href")) {
        if (a = RepConvTool.getPlayerColor(a, b)) {
          a = ["background: " + RepConvTool.hexToRGB("#" + a, 0.4), "background: -webkit-linear-gradient(left," + RepConvTool.hexToRGB("#" + a, 0.1) + "," + RepConvTool.hexToRGB("#" + a, 0.5) + ")", "background: -o-linear-gradient(right," + RepConvTool.hexToRGB("#" + a, 0.1) + "," + RepConvTool.hexToRGB("#" + a, 0.5) + ")", "background: -moz-linear-gradient(right," + RepConvTool.hexToRGB("#" + a, 0.1) + "," + RepConvTool.hexToRGB("#" + a, 0.5) + ")", "background: linear-gradient(to right," + RepConvTool.hexToRGB("#" +
          a, 0.1) + "," + RepConvTool.hexToRGB("#" + a, 0.5) + ")"].join(";"), $(c).closest("li.message_item").attr("style", a);
        }
      }
    }));
  }
  function P(a) {
    var b = {}, c;
    RepConv.settings[RepConv.Cookie + "_mcol"] && (b[Game.alliance_id] = "OWN_ALLIANCE", $.each(MM.getOnlyCollectionByName("AlliancePact").models, function(a, d) {
      if (!d.getInvitationPending()) {
        switch(d.getRelation()) {
          case "war":
            c = "ENEMY";
            break;
          case "peace":
            c = "PACT";
        }
        b[d.getAlliance1Id() == Game.alliance_id ? d.getAlliance2Id() : d.getAlliance1Id()] = c;
      }
    }), $.each(a.getJQElement().find($(".message_poster a.gp_player_link")), function(a, c) {
      if (a = $(c).attr("href")) {
        if (a = RepConvTool.getPlayerColor(a, b)) {
          a = ["background: " + RepConvTool.hexToRGB("#" + a, 0.4), "background: -webkit-linear-gradient(left," + RepConvTool.hexToRGB("#" + a, 0.1) + "," + RepConvTool.hexToRGB("#" + a, 0.5) + ")", "background: -o-linear-gradient(right," + RepConvTool.hexToRGB("#" + a, 0.1) + "," + RepConvTool.hexToRGB("#" + a, 0.5) + ")", "background: -moz-linear-gradient(right," + RepConvTool.hexToRGB("#" + a, 0.1) + "," + RepConvTool.hexToRGB("#" + a, 0.5) + ")", "background: linear-gradient(to right," + RepConvTool.hexToRGB("#" +
          a, 0.1) + "," + RepConvTool.hexToRGB("#" + a, 0.5) + ")"].join(";"), $(c).closest(".message_poster").attr("style", a);
        }
      }
    }));
  }
  function N(a) {
    a = a.split(/:/);
    return 3600 * Number(a[0]) + 60 * Number(a[1]) + Number(a[2]);
  }
  function C() {
    var a = null;
    $.each(decodeURIComponent(RepConv.requests.wonders.url).split(/&/), function(b, c) {
      -1 < c.indexOf("json=") && (a = JSON.parse(c.split("json=")[1]));
    });
    return a;
  }
  function ta() {
    var a = null, b = C(), c = JSON.parse(RepConv.requests.wonders.responseText).json.data;
    $.each(c.all_wonders, function(d, e) {
      if (e.island_x == b.island_x && e.island_y == b.island_y) {
        a = e;
        e = c.stage_started_at;
        var f = c.stage_started_at + N(ra[a.expansion_stage].total);
        d = c.stage_completed_at;
        e = (f - e) / N(ra[a.expansion_stage].reduc) / 2;
        f = (f - d) / N(ra[a.expansion_stage].reduc);
        d = (d - c.today) / N(ra[a.expansion_stage].reduc);
        a.shot_max = Math.min(Math.ceil(d), Math.floor(e - f));
      }
    });
    return a;
  }
  function va(a) {
    try {
      if (0 < a.getJQElement().find($(".send_res>.single-progressbar.time-indicator")).length) {
        var b = ta(), c = 0;
        $.each(MM.checkAndPublishRawModel("PlayerGods", {id:Game.player_id}).getCurrentProductionOverview(), function(a, b) {
          c = Math.max(c, (400 - b.current) / b.production * 3600);
        });
        a.getJQElement().find($(".wonder_res_container>.trade>.send_res>.grcrt_shot")).remove();
        a.getJQElement().find($(".wonder_res_container>.trade>.send_res")).append($("<div/>", {"class":"grcrt_shot", style:"position: absolute; right: 110px; top: 165px;"}).append($("<div/>", {"class":"gods_favor_button_area", style:"left:0px; top:0px;"}).append($("<div/>", {"class":"gods_favor_amount ui-game-selectable"}).html(b.shot_max)).append($("<div/>", {"class":"btn_gods_spells circle_button spells", style:"top: 2px; left: 4px; position: absolute;"}).append($("<div/>", {"class":"icon js-caption"}))).mousePopup(new MousePopup(RepConvTool.GetLabel("POPWONDERSHOT")))));
        var d = a.getJQElement().find($(".wonder_res_container>.trade>.send_res .button.inactive .middle"));
        CM.unregister({main:a.getContext().main, sub:"casted_powers"}, "grcrt_countdown");
        CM.register({main:a.getContext().main, sub:"casted_powers"}, "grcrt_countdown", d.countdown2({value:c, display:"readable_seconds_with_days"}).on("cd:finish", function() {
          setTimeout(function() {
            a.reloadContent();
          }, 100);
        }));
      }
    } catch (D) {
    }
  }
  function ka(a) {
    0 == a.getJQElement().find($("#BTNCOMPARE")).length && a.getJQElement().find($(".game_inner_box .game_header")).append(RepConvTool.AddBtn("BTNCOMPARE").attr("id", "BTNCOMPARE").css({margin:"0px", position:"absolute", top:"0px", right:"1px"}).click(function() {
      var a = {leftAlly:[Game.alliance_id], rightAlly:[]}, b;
      $.each(MM.getOnlyCollectionByName("AlliancePact").models, function(c, d) {
        if (!d.getInvitationPending()) {
          switch(d.getRelation()) {
            case "war":
              b = "rightAlly";
              break;
            case "peace":
              b = "leftAlly";
          }
          a[b].push(d.getAlliance1Id() == Game.alliance_id ? d.getAlliance2Id() : d.getAlliance1Id());
        }
      });
      WF.open("grcrt_analysis", {args:{website:RepConv.grcrt_domain + "ajax.php?modul=analysis&action=ally-compare-game&world=" + Game.world_id + "&allyLeft=" + a.leftAlly.toString() + "&allyRight=" + a.rightAlly.toString(), title:"ALLYCOMPARETITLE"}});
    }));
  }
  function X() {
    "object" != typeof YT || "function" != typeof YT.Player ? setTimeout(function() {
      X();
    }, 100) : (I = new YT.Player("grcrtVideoContainer", {height:"39", width:"64"}), n = new YT.Player("grcrtVideoContainerTest", {height:"39", width:"64"}));
  }
  function da(a) {
    if (!RepConv.active.sounds.mute) {
      if (a > RepConv.active.attack_count && "none" == $("#grcrtSound").css("display")) {
        RepConv.audio = {};
        var b = $("<audio/>", {preload:"auto"}), c = $("<audio/>", {preload:"auto"}).append($("<source/>", {src:RepConv.Const.defMuteM + ".mp3"})).append($("<source/>", {src:RepConv.Const.defMuteM + ".ogg"}));
        F = null;
        "" != RepConv.active.sounds.url ? (F = -1 < RepConv.active.sounds.url.indexOf("youtube") && RepConv.active.sounds.url.replace(/.*v=(.[^&]*)/, "$1") || -1 < RepConv.active.sounds.url.indexOf("youtu.be") && RepConv.active.sounds.url.replace(/.*youtu.be\/(.[^?]*)/, "$1"), $(b).append($("<source/>", {src:RepConv.active.sounds.url}))) : $(b).append($("<source/>", {src:RepConv.Const.defAlarmM + ".mp3"})).append($("<source/>", {src:RepConv.Const.defAlarmM + ".ogg"}));
        RepConv.audio.mute = c.get(0);
        null != F && F ? (RepConv.Debug && console.log("\u0142aduje " + F), pa()) : ($("#grcrtSound").show(), RepConv.audio.alarm = b.get(0), RepConv.audio.alarm.loop = RepConv.active.sounds.loop, RepConv.audio.alarm.volume = RepConv.active.sounds.volume / 100, RepConv.audio.alarm.addEventListener("ended", function() {
          $("#grcrtSound").hide();
        }), RepConv.audio.alarm.play());
        DM.getl10n("layout", "toolbar_activities");
        require("helpers/commands").getTotalCountOfIncomingAttacks();
      }
      0 == a && "none" != $("#grcrtSound").css("display") && -1 < RepConv.active.attack_count && (null != F && F ? I.stopVideo() : (RepConv.audio.alarm.pause(), RepConv.audio.alarm.currentTime = 0), $("#grcrtSound").hide());
      RepConv.active.attack_count = a;
    }
  }
  function pa() {
    "object" != typeof I || "function" != typeof I.loadVideoById ? setTimeout(function() {
      pa();
    }, 500) : ($("#grcrtSound").show(300), I.loadVideoById({videoId:F, loop:1, events:{onError:onGrcrtYTPlayerError, onStateChange:onGrcrtYTPlayerStateChange, onReady:onGrcrtYTPlayerReady}}).setVolume(RepConv.active.sounds.volume));
  }
  function ea() {
    if (uw.layout_main_controller && uw.layout_main_controller.sub_controllers) {
      GameEvents.grcrt = GameEvents.grcrt || {};
      GameEvents.grcrt.townGroupsList = "grcrt:townGroupsList";
      var a = DM.getTemplate("COMMON", "town_groups_list");
      V = {COMMON:{town_groups_list:a + '<script type="text/javascript">;\n$.Observer(GameEvents.grcrt.townGroupsList).publish({townId:1});\n\x3c/script>'}};
      DM.loadData({templates:V});
      $.Observer(GameEvents.grcrt.townGroupsList).subscribe("GameEvents.grcrt.townGroupsList", function(a, b) {
        Ga();
      });
      $.each(uw.layout_main_controller.sub_controllers, function(a, b) {
        "town_name_area" == b.name && (b.controller.templates.town_groups_list = DM.getTemplate("COMMON", "town_groups_list"));
      });
    } else {
      setTimeout(function() {
        ea();
      }, 500);
    }
  }
  function xa() {
    if (uw.layout_main_controller && uw.layout_main_controller.sub_controllers) {
      GameEvents.grcrt = GameEvents.grcrt || {};
      GameEvents.grcrt.construction_queue = "grcrt:construction_queue";
      var a = DM.getTemplate("COMMON", "construction_queue");
      a.queue_instant_buy += '<script type="text/javascript">;\n$.Observer(GameEvents.grcrt.construction_queue).publish();\n\x3c/script>';
      DM.loadData({templates:{COMMON:{construction_queue:a}}});
      $.Observer(GameEvents.grcrt.construction_queue).subscribe("GRCRT_GRC_grcrt_construction_queue", function(a, b) {
        f();
      });
      $.each(uw.layout_main_controller.sub_controllers, function(a, b) {
        "construction_queue_container" == b.name && (b.controller.templates.town_groups_list = DM.getTemplate("COMMON", "construction_queue"));
      });
      f();
    } else {
      setTimeout(function() {
        xa();
      }, 500);
    }
  }
  function Da() {
    0 == $("div.activity.attack_indicator").length ? setTimeout(function() {
      Da();
    }, 100) : (new (window.MutationObserver || window.WebKitMutationObserver)(function(a) {
      a.forEach(function(a) {
        $("div.activity.attack_indicator").hasClass("active") ? da(parseInt($("div.activity.attack_indicator div.count").html())) : da(0);
      });
    })).observe(document.querySelector("div.activity.attack_indicator div.count"), {attributes:!0, childList:!0, characterData:!0});
  }
  function Z() {
    require("game/windows/ids").GRCRT_STATS = "grcrt_stats";
    (function() {
      var a = window.GameControllers.TabController.extend({render:function() {
        var a = this.getWindowModel().getArguments(), b = RepConv.grcrt_domain + Game.locale_lang + "/light/" + a.what + "/" + Game.world_id + "/" + a.id, d = this.getWindowModel().getIdentifier();
        this.getWindowModel().showLoading();
        this.getWindowModel().setTitle(RepConv.grcrt_window_icon + RepConvTool.GetLabel("STATS." + ("ALLIANCE" == a.what.toUpperCase() ? "ALLY" : a.what.toUpperCase())) + " - " + a.name);
        this.$el.html($("<div/>").append($("<iframe/>", {src:b, style:"width: 995px; height: 625px; border: 0px"}).bind("load", function() {
          $.each(WM.getWindowByType("grcrt_stats"), function(a, b) {
            b.getIdentifier() == d && b.hideLoading();
          });
        })));
      }});
      window.GameViews.GrcRTView_grcrt_stats = a;
    })();
    (function() {
      var a = window.GameViews, b = window.WindowFactorySettings, c = require("game/windows/ids"), e = require("game/windows/tabs"), f = c.GRCRT_STATS;
      b[f] = function(b) {
        b = b || {};
        return us.extend({window_type:f, minheight:660, maxheight:680, width:1010, tabs:[{type:e.INDEX, title:RepConvTool.GetLabel("HELPTAB1"), content_view_constructor:a.GrcRTView_grcrt_stats, hidden:!0}], max_instances:5, activepagenr:0, minimizable:!0, resizable:!1, title:RepConv.grcrt_window_icon + RepConv.Scripts_nameS + "  ver." + RepConv.Scripts_version}, b);
      };
    })();
  }
  function Y() {
    require("game/windows/ids").GRCRT_ANALYSIS = "grcrt_analysis";
    (function() {
      var a = window.GameControllers.TabController.extend({render:function() {
        var a = this.getWindowModel().getArguments(), b = a.website, d = this.getWindowModel().getIdentifier();
        this.getWindowModel().showLoading();
        this.getWindowModel().setTitle(RepConv.grcrt_window_icon + RepConvTool.GetLabel(a.title));
        this.$el.html($("<div/>").append($("<iframe/>", {src:b, style:"width: 995px; height: 625px; border: 0px"}).bind("load", function() {
          $.each(WM.getWindowByType("grcrt_analysis"), function(a, b) {
            b.getIdentifier() == d && b.hideLoading();
          });
        })));
      }});
      window.GameViews.GrcRTView_grcrt_analysis = a;
    })();
    (function() {
      var a = window.GameViews, b = window.WindowFactorySettings, c = require("game/windows/ids"), e = require("game/windows/tabs"), f = c.GRCRT_ANALYSIS;
      b[f] = function(b) {
        b = b || {};
        return us.extend({window_type:f, minheight:660, maxheight:680, width:1010, tabs:[{type:e.INDEX, title:RepConvTool.GetLabel("HELPTAB1"), content_view_constructor:a.GrcRTView_grcrt_analysis, hidden:!0}], max_instances:5, activepagenr:0, minimizable:!0, resizable:!1, title:RepConv.grcrt_window_icon + RepConv.Scripts_nameS + "  ver." + RepConv.Scripts_version}, b);
      };
    })();
  }
  function aa() {
    require("game/windows/ids").GRCRT = "grcrt";
    (function() {
      var a = window.GameControllers.TabController.extend({render:function() {
        this.getWindowModel().showLoading();
        this.$el.html($("<div/>").append($("<iframe/>", {src:this.whatLoading(), style:"width: 815px; height: 430px; border: 0px; float: left;"}).bind("load", function() {
          WM.getWindowByType("grcrt")[0].hideLoading();
        })));
      }, whatLoading:function() {
        var a = this.getWindowModel().getArguments(), b = RepConv.getUrlForWebsite(this.getWindowModel().getActivePage().getType());
        null != a && this.getWindowModel().getActivePage().getType() == a.page && (a = a.hash, this.getWindowModel().setArguments(null), b = RepConv.getUrlForWebsite(this.getWindowModel().getActivePage().getType(), a));
        return b;
      }});
      window.GameViews.GrcRTViewEx_grcrt = a;
    })();
    (function() {
      var a = window.GameControllers.TabController.extend({render:function() {
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
      }, registerComponent:function(a, b, d) {
        d = {main:this.getWindowModel().getType(), sub:d || this.getWindowModel().getIdentifier()};
        return CM.register(d, a, b);
      }, unregisterComponent:function(a, b) {
        b = {main:this.getWindowModel().getType(), sub:b || this.getWindowModel().getIdentifier()};
        CM.unregister(b, a);
      }});
      window.GameViews.GrcRTViewS_grcrt = a;
    })();
    (function() {
      var a = window.GameControllers.TabController.extend({render:function() {
        this.$el.html(GRCRT_Translations.table());
        this.getWindowModel().hideLoading();
      }});
      window.GameViews.GrcRTViewT_grcrt = a;
    })();
    (function() {
      var a = window.GameViews, b = window.WindowFactorySettings, c = require("game/windows/ids"), e = require("game/windows/tabs"), f = c.GRCRT;
      b[f] = function(b) {
        b = b || {};
        return us.extend({window_type:f, minheight:475, maxheight:630, width:830, tabs:[{type:"grcrt", title:RepConvTool.GetLabel("HELPTAB1"), content_view_constructor:a.GrcRTViewEx_grcrt, hidden:!1}, {type:"howtogrcrt", title:RepConvTool.GetLabel("HELPTAB2"), content_view_constructor:a.GrcRTViewEx_grcrt, hidden:!1}, {type:"changesgrcrt", title:RepConvTool.GetLabel("HELPTAB3"), content_view_constructor:a.GrcRTViewEx_grcrt, hidden:!1}, {type:e.INDEX, title:RepConvTool.GetLabel("HELPTAB4"), content_view_constructor:a.GrcRTViewS_grcrt,
        hidden:!1}, {type:"module/donations", title:RepConvTool.GetLabel("HELPTAB6"), content_view_constructor:a.GrcRTViewEx_grcrt, hidden:!1}, {type:e.INDEX, title:RepConvTool.GetLabel("HELPTAB5"), content_view_constructor:a.GrcRTViewT_grcrt, hidden:!1}], max_instances:1, activepagenr:0, minimizable:!0, resizable:!1, title:RepConv.grcrt_window_icon + RepConv.Scripts_nameS + "  ver." + RepConv.Scripts_version}, b);
      };
    })();
  }
  var fa = require("game/windows/ids"), ba = 0;
  this.spellCountDownRefresh = function() {
    $.each(GPWindowMgr.getAllOpen(), function(a, b) {
      if (a = CM.get({main:b.getID(), sub:"casted_powers"}, "grcrt_countdown")) {
        b = $(a).parent();
        var c = $(b).attr("data-power_id");
        b = $(b).attr("rel");
        c = GameData.powers[c];
        var d = MM.checkAndPublishRawModel("PlayerGods", {id:Game.player_id}).getCurrentProductionOverview()[b];
        b = MM.checkAndPublishRawModel("PlayerGods", {id:Game.player_id})[b + "_favor_delta_property"].calculateCurrentValue().unprocessedCurrentValue;
        a.setValue((c.favor - b) / d.production * 3600);
      }
    });
  };
  this.settings = function() {
    function a(a, b, c) {
      return $("<div/>", {"class":"checkbox_new", style:"margin-bottom: 10px; display: block;"}).checkbox({caption:RepConvTool.GetLabel(c || a), checked:b, cid:a});
    }
    var b = $("<div/>", {style:"padding: 5px"}), c = $("<div/>", {"class":"game_list js-scrollbar-content", style:"width: 365px;"}), e = $("<fieldset/>", {style:"float:left; width:375px; min-height: 250px; position: relative;"}).append($("<legend/>").html("GRCRTools " + RepConvTool.GetLabel("HELPTAB4"))).append($("<div/>", {style:"width:375px; min-height: 235px; position: relative; overflow: hidden;", "class":"js-scrollbar-viewport"}).append(c)), f = $("<fieldset/>", {style:"float:right; width:370px; min-height: 250px;"}),
    g = {};
    $.each(RepConv.sChbxs, function(b, c) {
      g[b] = a(b, RepConv.settings[b], c.label);
    });
    var h = a("GRCRTsoundLoop", RepConv.active.sounds.loop, "CHKSOUNDLOOP"), k = a("GRCRTsoundMute", RepConv.active.sounds.mute, "POPSOUNDMUTE"), l = $("<div/>", {id:"statsGRC2Sel", "class":"dropdown default", style:"margin-left:5px;width: 150px;"}).dropdown({list_pos:"left", value:RepConv.active.statsGRCL, options:[{value:"potusek", name:"www.grcrt.net"}, {value:"grepointel", name:"grepointel.com"}]});
    $.each(g, function(a, b) {
      $(c).append(b);
    });
    $(c).append($("<div/>", {style:"padding: 5px"}).append($("<label/>", {"for":"statsGRCL"}).text(RepConvTool.GetLabel("STATSLINK"))).append(l));
    $(f).append($("<legend/>").html(RepConvTool.GetLabel("EMOTS.LABEL"))).append($("<div/>").html(RepConvTool.GetLabel("EMOTS.MESS"))).append($("<textarea/>", {id:"GRCRTEmots", style:"width: 360px; min-height: 200px;"}).val(RepConvTool.getItem(RepConv.CookieEmots)));
    $(b).append($(e));
    $(b).append($(f));
    $(b).append($("<br/>", {style:"clear: both;"}));
    RepConv.audioSupport && $(b).append($("<fieldset/>", {id:"GRCRT_Sounds"}).append($("<legend/>").html(RepConvTool.GetLabel("SOUNDSETTINGS"))).append(RepConvForm.soundSlider({name:"sound", volume:RepConv.active.sounds.volume})).append(h.css({"float":"left", padding:"6px"}).mousePopup(new MousePopup(RepConvTool.GetLabel("POPSOUNDLOOP")))).append(k.css({"float":"left", padding:"6px"}).mousePopup(new MousePopup(RepConvTool.GetLabel("POPSOUNDMUTE")))).append($("<img/>", {id:"grcrt_play", src:RepConv.grcrt_cdn +
    "ui/button-play-4.png", style:"float:right;"}).click(function() {
      if (1 == $("#grcrt_stop:hidden").length) {
        O = null;
        $("#grcrt_play").toggle();
        $("#grcrt_stop").toggle();
        var a = $("<audio/>", {preload:"auto"});
        "" != $("#grcrt_sound_url").val() ? (O = -1 < $("#grcrt_sound_url").val().indexOf("youtube") && $("#grcrt_sound_url").val().replace(/.*v=(.[^&]*)/, "$1") || -1 < $("#grcrt_sound_url").val().indexOf("youtu.be") && $("#grcrt_sound_url").val().replace(/.*youtu.be\/(.[^?]*)/, "$1"), $(a).append($("<source/>", {src:$("#grcrt_sound_url").val()}))) : $(a).append($("<source/>", {src:RepConv.Const.defAlarmM + ".mp3"})).append($("<source/>", {src:RepConv.Const.defAlarmM + ".ogg"}));
        null != O && O ? (RepConv.Debug && console.log("\u0142aduje " + O), n.loadVideoById({videoId:O, events:{onError:onGrcrtYTPlayerErrorTest, onStateChange:onGrcrtYTPlayerStateChangeTest, onReady:onGrcrtYTPlayerReadyTest}}).setVolume(RepConv.slider.getValue())) : (RepConv.audio.test = a.get(0), RepConv.audio.test.addEventListener("ended", function() {
          $("#grcrt_play").toggle();
          $("#grcrt_stop").toggle();
        }), RepConv.audio.test.volume = RepConv.slider.getValue() / 100, RepConv.audio.test.loop = !1, RepConv.audio.test.play());
      }
    }).mousePopup(new MousePopup(RepConvTool.GetLabel("POPSOUNDPLAY")))).append($("<img/>", {id:"grcrt_stop", src:RepConv.grcrt_cdn + "ui/button-stop-4.png", style:"float:right;"}).hide().click(function() {
      null != O && O ? n.stopVideo() : (RepConv.audio.test.pause(), RepConv.audio.test.currentTime = 0);
      $("#grcrt_play").toggle();
      $("#grcrt_stop").toggle();
    }).mousePopup(new MousePopup(RepConvTool.GetLabel("POPSOUNDSTOP")))).append($("<br/>", {style:"clear:both"})).append($("<div/>", {style:"float:left;width:120px;"}).html(RepConvTool.GetLabel("SOUNDURL"))).append(RepConvForm.input({name:"grcrt_sound_url", style:"float:left;width:600px;", value:RepConv.active.sounds.url}).mousePopup(new MousePopup(RepConvTool.GetLabel("POPSOUNDURL")))).append($("<div/>", {style:"float:left;width:120px;"}).html("&nbsp;")).append($("<div/>", {style:"float:left;width: 635px;font-size: 11px;font-style: italic;max-height: 27px;"}).html(RepConvTool.GetLabel("POPSOUNDEG"))));
    $(b).append(RepConvTool.AddBtn("BTNSAVE").click(function() {
      try {
        $.each(g, function(a, b) {
          RepConv.settings[a] = b.isChecked() ? !0 : !1;
        });
        RepConv.settings[RepConv.CookieStatsGRCL] = l.getValue();
        RepConv.settings[RepConv.CookieEmots] = $("#GRCRTEmots").val();
        if (RepConv.audioSupport) {
          RepConv.settings[RepConv.CookieSounds] = {mute:k.isChecked() ? !0 : !1, loop:h.isChecked() ? !0 : !1, volume:RepConv.slider.getValue(), url:$("#grcrt_sound_url").val()};
          var a = $("<audio/>", {preload:"auto"});
          "" != RepConv.settings[RepConv.CookieSounds].url ? $(a).append($("<source/>", {src:RepConv.settings[RepConv.CookieSounds].url})) : $(a).append($("<source/>", {src:RepConv.Const.defAlarmM + ".mp3"})).append($("<source/>", {src:RepConv.Const.defAlarmM + ".ogg"}));
          RepConv.audio.alarm = a.get(0);
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
      } catch (ja) {
        setTimeout(function() {
          HumanMessage.error(RepConvTool.GetLabel("MSGHUMAN.ERROR"));
        }, 0);
      }
    }));
    return b;
  };
  var ra = {0:{total:"01:57:00", reduc:"00:01:40"}, 1:{total:"03:57:00", reduc:"00:02:30"}, 2:{total:"07:37:00", reduc:"00:03:20"}, 3:{total:"13:07:00", reduc:"00:04:10"}, 4:{total:"20:33:00", reduc:"00:05:00"}, 5:{total:"30:00:00", reduc:"00:05:50"}, 6:{total:"41:34:00", reduc:"00:06:40"}, 7:{total:"55:17:00", reduc:"00:07:30"}, 8:{total:"71:13:00", reduc:"00:08:20"}, 9:{total:"89:26:00", reduc:"00:09:10"}};
  this.getGrcrtYTPlayer = function() {
    return I;
  };
  this.getGrcrtYTPlayerTest = function() {
    return n;
  };
  var F = null, I, O = null, n;
  window.onGrcrtYTPlayerError = function(a) {
    HumanMessage.error(RepConvTool.GetLabel("MSGHUMAN.YOUTUBEERROR"));
    RepConv.Debug && console.log("event eventuje [onGrcrtYTPlayerError]");
  };
  window.onGrcrtYTPlayerReady = function(a) {
    RepConv.Debug && console.log("event eventuje [onGrcrtYTPlayerReady]");
    a.target.playVideo();
  };
  window.onGrcrtYTPlayerStateChange = function(a) {
    RepConv.Debug && console.log("event eventuje [onGrcrtYTPlayerStateChange]");
    RepConv.Debug && console.log(a);
    0 == a.data && (RepConv.settings[RepConv.CookieSounds].loop ? I.playVideo() : $("#grcrtSound").hide());
  };
  window.onGrcrtYTPlayerErrorTest = function(a) {
    HumanMessage.error(RepConvTool.GetLabel("MSGHUMAN.YOUTUBEERROR"));
    RepConv.Debug && console.log("event eventuje [onGrcrtYTPlayerErrorTest]");
    a.target.stopVideo();
  };
  window.onGrcrtYTPlayerReadyTest = function(a) {
    RepConv.Debug && console.log("event eventuje [onGrcrtYTPlayerReadyTest]");
    a.target.playVideo();
  };
  window.onGrcrtYTPlayerStateChangeTest = function(a) {
    RepConv.Debug && console.log("event eventuje [onGrcrtYTPlayerStateChange]");
    RepConv.Debug && console.log(a);
    0 == a.data && ($("#grcrt_play").toggle(), $("#grcrt_stop").toggle());
  };
  this.testAI = function() {
    RepConv.active.attack_count = -1;
    da(1);
  };
  this.addBTN = function(a) {
    switch(a.getType()) {
      case fa.ACADEMY:
        ia(a);
        break;
      case fa.NOTES:
        L(a);
    }
  };
  this.openGRCRT = function(a, b) {
    if ("undefined" != typeof window.GRCRTWnd) {
      try {
        window.GRCRTWnd.close();
      } catch (c) {
      }
      window.GRCRTWnd = void 0;
    }
    window.GRCRTWnd = WF.open("grcrt", {args:b});
    switch(a) {
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
  $(document).ajaxComplete(function(d, f, c) {
    if ("undefined" != typeof c) {
      d = c.url.replace(/\/game\/(.*)\?.*/, "$1");
      var l = "frontend_bridge" != d ? d : -1 < c.url.indexOf("json") ? JSON.parse(unescape(c.url).split("&")[3].split("=")[1]).window_type : d;
      RepConv.requests[l] = {url:c.url, responseText:f.responseText};
      if ("frontend_bridge" == d) {
        var m = WM.getWindowByType(l)[0];
        m ? (RepConv.WND = m, RepConv.Debug && console.log('dodanie przycisku dla "' + m.getType() + '"'), $("#window_" + m.getIdentifier()).ready(function() {
          RepConv.Debug && console.log('dodanie przycisku dla "' + m.getType() + '" [id:' + m.getIdentifier() + "]");
          RepConvGRC.addBTN(m);
        })) : RepConv.Debug && console.log("typ wnd nieznany");
      } else {
        -1 < c.url.indexOf("game/wonders") && (-1 < c.url.indexOf("send_resources") || -1 < c.url.indexOf("decrease_build_time_with_favor")) && JSON.parse(f.responseText).json.success && (f = JSON.parse(decodeURIComponent(c.data).split("=")[1]), RepConv.Debug && console.log(f), f.wood = -1 < c.url.indexOf("decrease_build_time_with_favor") ? 0 : f.wood, f.stone = -1 < c.url.indexOf("decrease_build_time_with_favor") ? 0 : f.stone, f.iron = -1 < c.url.indexOf("decrease_build_time_with_favor") ? 0 :
        f.iron, f.power = -1 < c.url.indexOf("decrease_build_time_with_favor") ? 400 : 0, RepConv.Debug && console.log(f)), $.each(Layout.wnd.getAllOpen(), function(c, d) {
          RepConv.Debug && console.log("Dodanie przycisku dla starego okna o ID = " + d.getID());
          c = Layout.wnd.GetByID(d.getID());
          RepConv.AQQ = c;
          switch(c.getController()) {
            case "alliance":
              switch(c.getContext().sub) {
                case "alliance_profile":
                  t(c);
                  break;
                case "alliance_create_application":
                  E(c, ".bb_button_wrapper", "#application_edit_message");
                  break;
                case "alliance_alliance_pact":
                  ka(c);
              }break;
            case "alliance_forum":
              E(c, ".bb_button_wrapper", "#forum_post_textarea");
              u(c);
              break;
            case "building_barracks":
            case "building_docks":
              k(c);
              b(c);
              break;
            case "building_main":
              switch(c.getContext().sub) {
                case "building_main_index":
                  e(c);
              }break;
            case "building_place":
              r(c);
              break;
            case "building_wall":
              h(c);
              break;
            case "command_info":
              switch(c.getContext().sub) {
                case "command_info_colonization_info":
                case "command_info_info":
                  W(c);
                  ha(c);
                  break;
                case "command_info_conquest_info":
                  U(c);
                  break;
                case "command_info_conquest_movements":
                  U(c);
              }break;
            case "farm_town_overviews":
              c.getJQElement().find($("#fto_town_list li")).attr("style", "border-right:0px");
              c.getJQElement().find($("#fto_town_list li.town" + Game.townId)).attr("style", "border-right: 5px solid green");
              0 == c.getJQElement().find($("#fto_town_list li.town" + Game.townId + ".active")).length && RepConv.currTown != Game.townId && (RepConv.currTown = Game.townId, c.getJQElement().find($("#fto_town_list li.town" + Game.townId)).click());
              break;
            case "island_info":
              x(c);
              break;
            case "message":
              d = void 0;
              switch(c.getContext().sub) {
                case "message_new":
                  d = "#message_new_message";
                  break;
                case "message_view":
                  d = "#message_reply_message";
                  P(c);
                  break;
                case "message_forward":
                  d = "#message_message";
                  break;
                default:
                  ma(c);
              }d && E(c, ".bb_button_wrapper", d);
              break;
            case "player":
              switch(c.getContext().sub) {
                case "player_get_profile_html":
                  z(c);
                  break;
                case "player_index":
                  a(c);
              }break;
            case "report":
              switch(c.getContext().sub) {
                case "report_view":
                  G(c);
              }break;
            case "town_info":
              switch(c.getContext().sub) {
                case "town_info_info":
                  za(c);
                  break;
                case "town_info_support":
                  H(c);
                  break;
                case "town_info_trading":
                  RepConvABH.functCall(c, !1);
                  ya(c);
                  break;
                case "town_info_god":
                  ha(c);
              }break;
            case "wonders":
              ya(c);
              d = MM.checkAndPublishRawModel("Town", {id:Game.townId}).getAvailableTradeCapacity();
              RepConv.Debug && console.log(d);
              try {
RepConv.settings[RepConv.Cookie + "_wonder_trade"] && 0 < d && (WorldWonders.spinners.stone.setValue(d / 1));
              } catch (Ia) {
              }
              va(c);
              break;
            case "town_overviews":
              switch(c.getContext().sub) {
                case "town_overviews_trade_overview":
                  RepConvABH.functCall(c, !0);
                  break;
                case "town_overviews_command_overview":
                  g(c);
              }break;
            case "conquest_info":
              switch(c.getContext().sub) {
                case "conquest_info_getinfo":
                  A(c);
              }break;
            case "building_farm":
              0 == c.getJQElement().find($("#farm_militia .game_footer #grcrt_militia")).length && c.getJQElement().find($("#farm_militia .game_footer #request_militia_button")).is(":visible") && c.getJQElement().find($("#farm_militia .game_footer #request_militia_button")).before($("<div/>", {"class":"index_unit unit_icon40x40 militia", id:"grcrt_militia"}).append($("<div/>", {"class":"value"}).html(Math.min(MM.getCollections().Town[0].getCurrentTown().getBuildings().getBuildingLevel("farm"), 25) *
              (MM.getCollections().Town[0].getCurrentTown().getResearches().get("town_guard") ? 15 : 10)).css({"text-align":"right", "font-family":"Verdana", "font-weight":"700", "font-size":"12px", margin:"1px", color:"#fff", "text-shadow":"1px 1px 0 #000", position:"absolute", bottom:"1px", right:"1px"}))) && c.getJQElement().find($("#farm_militia .game_footer")).height(44);
          }
        }), $.each(fa, function(a, b) {
          if (WM.isOpened(b)) {
            var c = WM.getWindowByType(b)[0];
            c ? (RepConv.WND = c, RepConv.Debug && console.log('dodanie przycisku dla "' + c.getType() + '"'), $("#window_" + c.getIdentifier()).ready(function() {
              RepConv.Debug && console.log('dodanie przycisku dla "' + c.getType() + '" [id:' + c.getIdentifier() + "]");
              RepConvGRC.addBTN(c);
            })) : RepConv.Debug && console.log("typ wnd nieznany");
          }
        });
      }
    }
    1 == $("#grcrt_pl").length && (RepConv.Debug && console.log("War=" + RepConv.models.PlayerLedger.getCoinsOfWar()), RepConv.Debug && console.log("Wisdom=" + RepConv.models.PlayerLedger.getCoinsOfWisdom()), $("#grcrt_pl_war").html(RepConv.models.PlayerLedger.getCoinsOfWar()), $("#grcrt_pl_wis").html(RepConv.models.PlayerLedger.getCoinsOfWisdom()));
  });
  $.Observer(GameEvents.window.open).subscribe("GRCRT_GRC_window_open", function(a, b) {
    try {
      RepConv.WND = b, RepConv.Debug && console.log('dodanie przycisku dla "' + b.getType() + '"'), $("#window_" + b.getIdentifier()).ready(function() {
        RepConv.Debug && console.log('dodanie przycisku dla "' + b.getType() + '" [id:' + b.getIdentifier() + "]");
        RepConvGRC.addBTN(b);
      });
    } catch (c) {
    }
  });
  $.Observer(GameEvents.window.close).subscribe("GRCRT_GRC_window_close", function(a, b, c) {
    switch(b.type) {
      case Layout.wnd.TYPE_TOWN_OVERVIEWS:
        m("grcrt_townsDD");
        m("grcrt_FI");
        m("grcrt_FR");
        m("grcrt_FO");
        m("grcrt_towns");
        break;
      case Layout.wnd.TYPE_BUILDING:
        "building_wall_index" == b.window_obj.wnd.getContext().sub && (m("grcrt_saved"), m("grcrt_wall"), m("grcrt_delsaved"));
    }
  });
  $.Observer(GameEvents.window.reload).subscribe("GRCRT_GRC_window_reload", function(a, b, c) {
    0 == $("#grcrtListSaved").length && (m("grcrt_saved"), m("grcrt_delsaved"));
    0 == $("#grcrtListWall").length && m("grcrt_wall");
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
  var T = DM.getTemplate("COMMON", "casted_power_tooltip");
  var V = {COMMON:{casted_power_tooltip:T + "<script type=\"text/javascript\">;\n$.Observer(GameEvents.grcrt.powertooltip).publish({power:'<%=power.id%>'});\n\x3c/script>"}};
  DM.loadData({templates:V});
  $.Observer(GameEvents.grcrt.powertooltip).subscribe("GRCRT_GRC_grcrt_powertooltip", function(a, b) {
    sa(b.power);
  });
  $("head").append($("<style/>").append(".tripple-progress-progressbar .amounts {width: 300px; text-align: right;}.grcrt_menu_inner {position: absolute !important;}")).append($("<style/>").append(".grcrt_power {position: absolute; top: 35px; right: 85px; z-index: 5}\n.grcrt_power .new_ui_power_icon.active_animation .extend_spell {width: 56px; height: 56px; background-image: none;}\n.grcrt_command {display: none !important}\n.grcrt_return {width: 19px; height: 13px; display: inline-block; margin: 0 2px; vertical-align: middle; background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAaCAYAAACHD21cAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3ggYFSEA10+XNgAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAC+ElEQVQ4y42UUUhUaRiGnzPn6OjMhB0ZsliiacOIaI3YNiiwLtIkVt2rxbFGMXIuuig3sdBoRkejaS8yguhCiQRdzlwIlYtQM3ZRgQVRYATWtsvIbrFra55mG3OnOWf/vZjUzGP23X7fw/9+7/fyS1hUrK9RTOhJ3KqLUl+nZDVjs4J+vjnCng0pfomPs1gpVtDJSoFIv2FCNxcFbR9Dwe/z2PWjE2Gm+FQpH0JttYUUn/yLrGw7thwndx88INT4nZgZdqsuANavLUD68KUdwSR57i8QwFCwYIEN5tQLACL3DJQJPUnowCa2HnlEjmMZSpYdI52ipH2c/9LvePP65TyJdzuWMaGbKG7VRevlEe61yRSfTjOdfI1r+QquHoxjc6xCdu2chbYeuv1+dwVbqa9Tqti9mY5rguHTKzHe/cv0VAJhptkXGqbvxhP6bjyZczPHjVt1ZRaYgdt++p074TWk3v6DlOVg+9frqPl2C/t3r5kFM2dKzt2x1NcpxfoaRevlEW4FVpJ+9Qj4EpGe4pvD9+fA91KlxZLTvPMZV54X4yvbMNszEr/OuiotldXhh7/Nu+HMHRUr8JWyDV2eRNiW09r5mSHXNE0MDQ1RVFREPB5fOqsAkUhExGIxqqqqME0TXdeXBjVNE7FYjNraWs6eOoppmkuHPBKJiGg0it/vJ9TsZ2x6NdnZ2Ty+f52mpiaRn58/D/J4PEgz8mpqajj4Q4iNqzPuBYNBZFlGCIHdbp8HDgwMoOi6Tn19Pb5DJyjM+xvIgO3t7ZYSw+FwRqqqqnR1dXEhfJzzZ47xbNygsEChoaEBp9OJw+EAQJZlWlpa5szxer1SWVkZ/f39nOi4iCf3j0xKDINQs5/e3l4GBwetXfV6vVJJSQk9PT20nunm6Z8pcnNz+WrbXurq6qisrFz8s6qurpY0TRPd3d1cOhcgkUgghMAwDAKBwAJQskpONBqloqKC0dFRysvLkWV5gauWOdQ0TUxOTqKqKmNjYwv6Ho+H/wFcKEqd4DudIQAAAABJRU5ErkJggg==) no-repeat;}\n.grcrt_return.grcrt_disabled {background-position: 0 -13px !important;}\n.grcrt_filter {cursor: pointer;}\n.overview_outgoing.icon.grcrt_disabled {background-position: -12px -13px !important;}\n.overview_incoming.icon.grcrt_disabled {background-position: 0 -13px !important;}\n.grcrt_wall_units {width: 54px; height: 71px; float: left;}\n.grcrt_wall_diff {float: right; padding-right: 4px; font-weight: 700; letter-spacing: -1px; color: green;}\n.grcrt_wall_compare_dd {float: left; text-align: right;}\n.grcrt_dd_list {margin-left:5px; width: 125px !important;}\n").append(".grcrt_idle {min-width: 20px; min-height: 11px; background: url(" +
  RepConv.grcrt_cdn + "ui/idle_loader2.gif) no-repeat; float: left; margin-right: 4px; margin-top: 3px;}\n.grcrt_idle_days { background: url(" + RepConv.grcrt_cdn + "ui/idle.png) 0 0 no-repeat; color: white; text-align: center; font-size: 8px; vertical-align: middle; text-shadow: 1px 1px black; min-width: 20px; min-height: 11px; padding-top: 1px; cursor: help;}\n.grcrt_idle_dg {background-position: 0px 0px;}\n.grcrt_idle_dy {background-position: 0px -12px;}\n.grcrt_idle_dr {background-position: 0px -24px;}\n").append(".grcrt_lost_res {visibility: visible !important;}\n").append(".grcrtpoints {font-size: 10px; padding: 2px; color: greenyellow; text-shadow: 2px 2px 1px black; font-weight: bold; letter-spacing: -0.5px;}\n.grcrtpoints.grcrt_minus {color: #ff766c;}\n.grcrtpoints.grcrt_special {padding: 0; float: left; background: rgba(0, 0, 0, 0.5); width: 40px; height: 14px; text-align: center;}\n.grcrtpoints.grcrt_order {padding: 0; float: left; background: rgba(0, 0, 0, 0.5); width: 40px; height: 14px; text-align: center;}\n.build_cost_reduction_enabled_disabled .grcrt_plus { display:none}\n.build_cost_reduction_enabled .grcrt_minus { display:none}\n").append('.grcrt_brackets:before { content: "("}\n.grcrt_brackets:after { content: ")"}'));
  $("#ui_box").append($("<img/>", {src:RepConv.grcrt_cdn + "img/mute.png", id:"grcrtSound", style:"position:absolute; bottom: 45px; left: 15px;z-index: 1002;"}).mousePopup(new MousePopup(RepConvTool.GetLabel("POPDISABLEALARM"))).click(function() {
    null != F && F ? I.stopVideo() : (RepConv.audio.alarm.pause(), RepConv.audio.alarm.currentTime = 0, RepConv.audio.mute.play());
    $("#grcrtSound").hide();
  }).hide());
  $("<div/>", {id:"grcrtVideoContainers", style:"width:1px !important; height:1px !important"}).append($("<div/>", {id:"grcrtVideoContainer"})).append($("<div/>", {id:"grcrtVideoContainerTest"})).appendTo($("body"));
  $.getScript("https://www.youtube.com/iframe_api").done(function(a, b) {
    setTimeout(function() {
      X();
    }, 100);
  });
  RepConv.initArray.push("RepConvGRC.init()");
  RepConv.wndArray.push("grcrt");
  RepConv.wndArray.push("grcrt_stats");
  RepConv.wndArray.push("grcrt_analysis");
  this.init = function() {
    try {
      "undefined" != typeof $.fn.spinner && function(a) {
        RepConv.oldSpinner || (RepConv.oldSpinner = a.fn.spinner, a.fn.spinner = function() {
          var a = RepConv.oldSpinner.apply(this, arguments);
          a.on("keyup", "input", function(b) {
            38 == b.keyCode ? a.stepUp() : 40 == b.keyCode && a.stepDown();
          });
          return a;
        });
      }(jQuery);
    } catch (d) {
      console.err(d);
    }
    new aa;
    new Z;
    new Y;
    $.Observer(require("data/events").attack.incoming).subscribe("GameEvents.grcrt.attackIncomming", function(a, b) {
      da(b.count);
    });
    0 < require("helpers/commands").getTotalCountOfIncomingAttacks() && da(require("helpers/commands").getTotalCountOfIncomingAttacks());
    void 0 == RepConv.idleInterval && (la(), RepConv.idleInterval = setInterval(function() {
      la();
    }, 9E5));
    void 0 == RepConv.idleAttackInterval && (RepConv.idleAttackInterval = setInterval(function() {
      void gpAjax.ajaxGet("notify", "fetch", {no_sysmsg:!1}, !1, function() {
      });
    }, 5E3));
    ea();
    xa();
    Da();
  };
}
function _GRCRTMain() {
  this.Scripts_update_path = this.Scripts_check_path = "https://www.grcrt.net/scripts/";
  this.Scripts_name = "Grepolis Report Converter Revolution Tools";
  this.Scripts_nameS = "GRCRTools";
  this.Scripts_url = "https://www.grcrt.net/";
  this.Scripts_link = "[url=" + this.Scripts_url + "]" + this.Scripts_name + "[/url]";
  this.securityData = "";
  this.Scripts_version = "5.0.9";
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
    var b = arguments;
    return this.replace(/\{(\d+)\}/g, function(k, a) {
      return b[a];
    });
  });
  "undefined" == typeof String.prototype.stripTags && (String.prototype.stripTags = function() {
    tags = this;
    return stripped = tags.replace(/<\/?[^>]+>/gi, "");
  });
  "undefined" == typeof String.prototype.wrapLine && (String.prototype.wrapLine = function(b) {
    var k = "";
    for (_string = this.replace(/\n/g, " ").replace(/  /g, " "); 0 < _string.length;) {
      var a = _string.length > b ? _string.substring(0, b).lastIndexOf(" ") : -1;
      -1 == a && (a = 0 < _string.length && _string.length <= b ? _string.length : b);
      k += (0 < k.length ? "\n" : "") + _string.substring(0, a);
      _string = _string.substring(a + 1, _string.length);
    }
    return k;
  });
  "undefined" == typeof Array.prototype.kasuj && (Array.prototype.kasuj = function(b) {
    b = this.indexOf(b);
    -1 != b && this.splice(b, 1);
  });
  "undefined" == typeof Object.size && (Object.size = function(b) {
    var k = 0, a;
    for (a in b) {
      b.hasOwnProperty(a) && k++;
    }
    return k;
  });
  "undefined" == typeof Array.prototype.contains && (Array.prototype.contains = function(b) {
    for (var k = this.length; k--;) {
      if (this[k] == b) {
        return !0;
      }
    }
    return !1;
  });
  Array.prototype.searchFor || (Array.prototype.searchFor = function(b, k) {
    return this.filter(function(a, e, f) {
      return a[b] == k;
    });
  });
  Array.prototype.clone || (Array.prototype.clone = function() {
    return this.slice(0);
  });
  Array.prototype.remove || (Array.prototype.remove = function(b, k) {
    k = this.slice((k || b) + 1 || this.length);
    this.length = 0 > b ? this.length + b : b;
    return this.push.apply(this, k);
  });
  Function.prototype.inherits || (Function.prototype.inherits = function(b) {
    this.prototype = new b;
    this.prototype.constructor = this;
    this.prototype.parent = b.prototype;
  });
  "undefined" == typeof $.fn.justtext && ($.fn.justtext = function() {
    return $(this).clone().children().remove().end().text();
  });
  "undefined" == typeof $.md5 && new _GRCRTmd5;
  this.PublChanges = function(b) {
    return this.getInfoFromWebsite("changesgrc");
  };
  this.getUrlForWebsite = function(b, k) {
    return this.Scripts_url + Game.locale_lang + "/light/" + b + (k || "");
  };
  this.getInfoFromWebsite = function(b, k) {
    var a = $("<div/>");
    b = RepConv.getUrlForWebsite(b, k);
    a.append($("<iframe/>", {src:b, style:"width: 825px; height: 425px;", onload:"console.log(this)"}));
    return a.html();
  };
  this.AQQ = {};
  this.currTown = "";
  this.active = {sounds:{mute:!1, volume:100, url:"", loop:!0}, power:!0, ftabs:!0, fcmdimg:!0, statsGRC2:!1, statsGRCL:"potusek", unitsCost:!0, oceanNumber:!0, reportFormat:!0, attack_count:0};
  this.commandList = this._cookie + "_CmdList";
  this.command = this._cookie + "_Cmd_";
  this.addCmd = !1;
  this.unitsCode = {sword:"A1", slinger:"B1", archer:"C1", hoplite:"D1", rider:"E1", chariot:"F1", catapult:"G1", big_transporter:"A2", bireme:"B2", attack_ship:"C2", demolition_ship:"D2", small_transporter:"E2", trireme:"F2", colonize_ship:"G2", zyklop:"A3", sea_monster:"B3", harpy:"C3", medusa:"D3", minotaur:"E3", manticore:"F3", centaur:"G3", pegasus:"H3", cerberus:"I3", fury:"J3", calydonian_boar:"K3", griffin:"L3", godsent:"M3", militia:"A4", atalanta:"A5", cheiron:"B5", ferkyon:"C5", helen:"D5",
  hercules:"E5", leonidas:"F5", orpheus:"G5", terylea:"H5", urephon:"I5", zuretha:"J5", andromeda:"K5", odysseus:"L5", iason:"M5", apheledes:"N5", democritus:"O5", hector:"P5", agamemnon:"Q5", aristotle:"R5", christopholus:"S5", deimos:"T5", ylestres:"U5", pariphaistes:"V5", pelops:"W5", rekonos:"X5", themistokles:"Y5", medea:"Z5", unknown_naval:"XY", unkown:"XX", unknown:"XX"};
  this.buildCode = {main:"A9", storage:"B9", hide:"C9", farm:"D9", place:"E9", lumber:"F9", stoner:"G9", ironer:"H9", market:"I9", docks:"J9", wall:"K9", academy:"L9", temple:"M9", barracks:"N9", theater:"O9", thermal:"P9", library:"R9", lighthouse:"S9", tower:"T9", statue:"U9", oracle:"V9", trade_office:"W9"};
  this.academyCode = {architecture:"A7", building_crane:"B7", cryptography:"C7", espionage:"D7", plow:"E7", stone_storm:"F7", temple_looting:"G7", berth:"H7", cartography:"I7", democracy:"J7", instructor:"K7", pottery:"L7", strong_wine:"M7", town_guard:"N7", booty:"O7", combat_experience:"P7", diplomacy:"Q7", mathematics:"R7", set_sail:"S7", take_over:"T7", breach:"U7", conscription:"V7", divine_selection:"W7", meteorology:"X7", shipwright:"Y7", take_over_old:"Z7", phalanx:"D6", ram:"C6", booty_bpv:"H6"};
  this.commandImage = "abort attack_incoming attack_land attack_pillage attack_sea attack_spy attack_takeover attack breakthrough colonization_failed colonization conqueror farm_attack illusion revolt_arising revolt_running revolt siege spying support trade underattack_land underattack_sea foundation".split(" ");
  this.powerImage = "acumen attack_boost attack_penalty bolt building_order_boost call_of_the_ocean cap_of_invisibility cleanse defense_boost defense_penalty desire divine_sign earthquake effort_of_the_huntress fair_wind favor_boost favor_penalty fertility_improvement forced_loyalty happiness happy_folks hermes_boost illusion iron_production_penalty kingly_gift loyalty_loss myrmidion_attack natures_gift olympic_experience olympic_sword olympic_torch olympic_village patroness pest population_boost pumpkin resource_boost resurrection sea_storm starter_protection stone_production_penalty strength_of_heroes town_protection transformation trojan_defense underworld_treasures unit_movement_boost unit_order_boost unit_training_boost wedding wisdom wood_production_penalty".split(" ");
  this.models = {};
  this.requests = {};
  this.__repconvValueArray = {};
  this.settings = {};
  this.Tracker = function() {
    (function(b, k, a, e, f, u, x) {
      b.GoogleAnalyticsObject = f;
      b[f] = b[f] || function() {
        (b[f].q = b[f].q || []).push(arguments);
      };
      b[f].l = 1 * new Date;
      u = k.createElement(a);
      x = k.getElementsByTagName(a)[0];
      u.async = 1;
      u.src = e;
      x.parentNode.insertBefore(u, x);
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
          } catch (b) {
            grcrtErrReporter(b);
          }
          try {
            RepConvForm = new _RepConvForm;
          } catch (b) {
            grcrtErrReporter(b);
          }
          try {
            RepConvTool = new _RepConvTool;
          } catch (b) {
            grcrtErrReporter(b);
          }
          try {
            GRCRTConverterCtrl = new _GRCRTConverterCtrl;
          } catch (b) {
            grcrtErrReporter(b);
          }
          try {
            GRCRTInnoFix = new _GRCRTInnoFix;
          } catch (b) {
            grcrtErrReporter(b);
          }
          try {
            GRCRTMovedFrames = new _GRCRTMovedFrames;
          } catch (b) {
            grcrtErrReporter(b);
          }
          try {
            GRCRTOceanNumbers = new _GRCRTOceanNumbers;
          } catch (b) {
            grcrtErrReporter(b);
          }
          try {
            GRCRTTradeFarmOldVersion = new _GRCRTTradeFarmOldVersion;
          } catch (b) {
            grcrtErrReporter(b);
          }
          try {
            GRCRT_AO = new _GRCRT_AO;
          } catch (b) {
            grcrtErrReporter(b);
          }
          try {
            GRCRT_Notifications = new _GRCRT_Notifications;
          } catch (b) {
            grcrtErrReporter(b);
          }
          try {
            GRCRT_Radar = new _GRCRT_Radar;
          } catch (b) {
            grcrtErrReporter(b);
          }
          try {
            GRCRT_Recipes = new _GRCRT_Recipes;
          } catch (b) {
            grcrtErrReporter(b);
          }
          try {
            GRCRT_TSL = new _GRCRT_TSL;
          } catch (b) {
            grcrtErrReporter(b);
          }
          try {
            GRCRT_Translations = new _GRCRT_Translations;
          } catch (b) {
            grcrtErrReporter(b);
          }
          try {
            GRCRT_Updater = new _GRCRT_Updater;
          } catch (b) {
            grcrtErrReporter(b);
          }
          try {
            GRCRTmd5 = new _GRCRTmd5;
          } catch (b) {
            grcrtErrReporter(b);
          }
          try {
            GRCRTtpl = new _GRCRTtpl;
          } catch (b) {
            grcrtErrReporter(b);
          }
          try {
            RepConvABH = new _RepConvABH;
          } catch (b) {
            grcrtErrReporter(b);
          }
          try {
            RepConvGRC = new _RepConvGRC;
          } catch (b) {
            grcrtErrReporter(b);
          }
        } else {
          try {
            uw.RepConvAdds = new _RepConvAdds;
          } catch (b) {
            grcrtErrReporter(b);
          }
          try {
            uw.RepConvForm = new _RepConvForm;
          } catch (b) {
            grcrtErrReporter(b);
          }
          try {
            uw.RepConvTool = new _RepConvTool;
          } catch (b) {
            grcrtErrReporter(b);
          }
          try {
            uw.GRCRTConverterCtrl = new _GRCRTConverterCtrl;
          } catch (b) {
            grcrtErrReporter(b);
          }
          try {
            uw.GRCRTInnoFix = new _GRCRTInnoFix;
          } catch (b) {
            grcrtErrReporter(b);
          }
          try {
            uw.GRCRTMovedFrames = new _GRCRTMovedFrames;
          } catch (b) {
            grcrtErrReporter(b);
          }
          try {
            uw.GRCRTOceanNumbers = new _GRCRTOceanNumbers;
          } catch (b) {
            grcrtErrReporter(b);
          }
          try {
            uw.GRCRTTradeFarmOldVersion = new _GRCRTTradeFarmOldVersion;
          } catch (b) {
            grcrtErrReporter(b);
          }
          try {
            uw.GRCRT_AO = new _GRCRT_AO;
          } catch (b) {
            grcrtErrReporter(b);
          }
          try {
            uw.GRCRT_Notifications = new _GRCRT_Notifications;
          } catch (b) {
            grcrtErrReporter(b);
          }
          try {
            uw.GRCRT_Radar = new _GRCRT_Radar;
          } catch (b) {
            grcrtErrReporter(b);
          }
          try {
            uw.GRCRT_Recipes = new _GRCRT_Recipes;
          } catch (b) {
            grcrtErrReporter(b);
          }
          try {
            uw.GRCRT_TSL = new _GRCRT_TSL;
          } catch (b) {
            grcrtErrReporter(b);
          }
          try {
            uw.GRCRT_Translations = new _GRCRT_Translations;
          } catch (b) {
            grcrtErrReporter(b);
          }
          try {
            uw.GRCRT_Updater = new _GRCRT_Updater;
          } catch (b) {
            grcrtErrReporter(b);
          }
          try {
            uw.GRCRTmd5 = new _GRCRTmd5;
          } catch (b) {
            grcrtErrReporter(b);
          }
          try {
            uw.GRCRTtpl = new _GRCRTtpl;
          } catch (b) {
            grcrtErrReporter(b);
          }
          try {
            uw.RepConvABH = new _RepConvABH;
          } catch (b) {
            grcrtErrReporter(b);
          }
          try {
            uw.RepConvGRC = new _RepConvGRC;
          } catch (b) {
            grcrtErrReporter(b);
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
      } catch (b) {
        grcrtErrReporter(b);
      }
    }
  };
}
function _grcrtAppendScript(b, k) {
  var a = document.createElement("script");
  a.type = "text/javascript";
  a.id = b;
  a.textContent = k;
  document.body.appendChild(a);
}
var matched, grcrtBrowser;
uaMatch = function(b) {
  b = b.toLowerCase();
  var k = /(opr)[\/]([\w.]+)/.exec(b) || /(chrome)[ \/]([\w.]+)/.exec(b) || /(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(b) || /(webkit)[ \/]([\w.]+)/.exec(b) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(b) || /(msie) ([\w.]+)/.exec(b) || 0 <= b.indexOf("trident") && /(rv)(?::| )([\w.]+)/.exec(b) || 0 > b.indexOf("compatible") && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(b) || [];
  b = /(ipad)/.exec(b) || /(iphone)/.exec(b) || /(android)/.exec(b) || /(windows phone)/.exec(b) || /(win)/.exec(b) || /(mac)/.exec(b) || /(linux)/.exec(b) || /(cros)/i.exec(b) || [];
  return {browser:k[3] || k[1] || "", version:k[2] || "0", platform:b[0] || ""};
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
_grcrtAppendScript("RepConvTool", _RepConvTool.toString()), _grcrtAppendScript("GRCRTConverterCtrl", _GRCRTConverterCtrl.toString()), _grcrtAppendScript("GRCRTInnoFix", _GRCRTInnoFix.toString()), _grcrtAppendScript("GRCRTMovedFrames", _GRCRTMovedFrames.toString()), _grcrtAppendScript("GRCRTOceanNumbers", _GRCRTOceanNumbers.toString()), _grcrtAppendScript("GRCRTTradeFarmOldVersion", _GRCRTTradeFarmOldVersion.toString()), _grcrtAppendScript("GRCRT_AO", _GRCRT_AO.toString()), _grcrtAppendScript("GRCRT_Notifications",
_GRCRT_Notifications.toString()), _grcrtAppendScript("GRCRT_Radar", _GRCRT_Radar.toString()), _grcrtAppendScript("GRCRT_Recipes", _GRCRT_Recipes.toString()), _grcrtAppendScript("GRCRT_TSL", _GRCRT_TSL.toString()), _grcrtAppendScript("GRCRT_Translations", _GRCRT_Translations.toString()), _grcrtAppendScript("GRCRT_Updater", _GRCRT_Updater.toString()), _grcrtAppendScript("GRCRTmd5", _GRCRTmd5.toString()), _grcrtAppendScript("GRCRTtpl", _GRCRTtpl.toString()), _grcrtAppendScript("RepConvABH", _RepConvABH.toString()),
_grcrtAppendScript("RepConvGRC", _RepConvGRC.toString()), _grcrtAppendScript("GRCRTMain", _GRCRTMain.toString()), _grcrtAppendScript("GRCRTrunner", "RepConv = new _GRCRTMain();RepConv.init();")) : $(document).ready(function() {
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


