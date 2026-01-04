// ==UserScript==
// @name         gartic.io mod menu
// @namespace    http://tampermonkey.net/
// @version      0.6
// @homepageURL  https://github.com/anonimbiri/gartic.io-hack
// @supportURL   https://github.com/anonimbiri/gartic.io-hack/issues
// @description  drawing assistant, answer assistant and many more features
// @author       Anonim Biri
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/howler/1.1.29/howler.min.js
// @icon         https://gartic.io/static/download/character.png
// @match        https://gartic.io/*
// @grant    GM_setValue
// @grant    GM_getValue
// @grant    GM_deleteValue
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545755/garticio%20mod%20menu.user.js
// @updateURL https://update.greasyfork.org/scripts/545755/garticio%20mod%20menu.meta.js
// ==/UserScript==



var lang = 2;
setTimeout(function() {
    var afkk = false;
    var reportt = false;
    var otokickk = false;
    var skipp = false;
    var renklicizim = false;
    var renklicizimms = 1000;
    var autoanswer = false;
    var autoanswerms = 1000;
    this.GM_getValue=function (key,def) {
        return localStorage[key] || def;
    };
    this.GM_deleteValue=function (key) {
        return delete localStorage[key];
    };
   // $('#gartic-io_160x600').html('<button id="close" class="closing" ><img src="https://i.imgur.com/laWPceN.png" /></button>');
   // $('#gartic-io_160x600').on('click', '.close', function() { sendmesaj(); });
    loop();
    menuns();
     console.log("ooooooooooooooooooolcclloooooooooooooooooooooolcc::::clooooooooooooooooooolc:::::ccloooooooooooooooo\nooooooooooooooooolllooooooooodoooooooooooooolc:::ccclooooooooooooooooooooc:::::ccloooooooooooooooool\nooooooooooooooooooooooooooooooooooooooooolcc::ccloooooooooooooooooooooolc::::cloooooooooooooooooolc:\nloooooooooooooooooodooooooooooooooooooolc:::cllooodoooooooooooooooooolc:::cclooodoooooooooooooolc:::\noooooooooooooooooooooooooooooooooooollc::cclooooooooooooooooooooooolc:::clooooooooooooooooooolc:::::\noooooooooooooooooooooooooooooooooolcc:ccloooooodddddddddddddddddolc::cclooooooooooooooooooolcc::::::\noooooooooooooooooooooooooooooooolc:ccloddxkO00KKXXXXXNNNNNXXXXXK0OOkkkxxddooooooooooooooolcc::::::::\nooooooooooooooooooooooooooooollcccloxO0XNWWMMMWNNNXXXXKKKXXXXNNWWWMMMWWNXK0kxdoodoooooolcc::::::::::\nooooooooooooooooooooooooooolcccldk0XNWMWX0kdol:;;,,'''''''',;;:cclodxk0XWMMWNKOxdooooocc:::::::::cll\nooooooooooodooooooooooooolllldOKNWMWXOd:,.............................,:oxkKWMWN0kdlcc::::::::cclooo\nooooooooooooooooodooooolllokKNWMN0xl;............'',;;;::::::;,'........';:ldkXMMN0oc::::::ccloooooo\nooooollloooooooooooooooodOXWMN0xl:'.......',:lodxkOOOOO0000OOOOkkxdol:,'...,:clkNMWKdc:::clloooooooo\nollccloooooooooodooooodOXWMNOoc;'.....';cdkO00KK000000000000000000O00OOkoc'..'cclKMMXxcclooooooooooo\nc:cloooooooooooooooodkKWMNOol:,....':okO0KKKKKK0000000000000000000000O000Okl'..cclKMMKxooooooooooooo\nclooooooooooooooooodONMW0ool;....,lx0KKKKKK00O00000000000000000000000000000Oo'.,l:xWMWOdoooooooooooo\noooooooooooooooooox0WMNkodc....,lk00000000000O0000O00O0000000000000O00000000k;.'ocdWMWOdoooooooooooo\noooooooooooooooooxKWMXdod;....ckOO0000000OO0000OOkxxxxxxdxxxkO000000000O00O0O:.'cl0MMNkooooooooooooo\nooooooooooooooooxKWMXddd,...,oO00O000000000Okxxxdddollc;;;;;;;;;:cldkO00000Oo'.'ckWMW0dooooooooooool\noooooooooooooood0WMXddx,...;x000000000000OOkxoc:;::ccllooolcc:,'.....,:cllc;...c0WMW0xoooodoooooolcc\noooooooooooooookNMNxdk;...;k000000000KKK0Odc,';lkKXNWMMMMMMMWWNK0xo:'......';lkNMMNOddooooooooolcc::\noooooooooooolloKMMOdOl...,x000000KKKKKOko;..;xXWMMMMMMWNXKK0000KKXNXX0OkkO0XNWMWN0kdooooooooolc:::cc\noooooooollccclkNMNxkx'..'dO00KKKKK00Oxo;...oXMMMNKOkoc:,'.......'',:codkKNXKNMMW0xooooooooolc::ccloo\nooooolccccclod0WM0xOl...cO00KK00000Okc'...dNMWKd:......,;;::::;;;,,,....':lox0WMWKxoooooolcccclooooo\nollcc::clloooxXMWkxO;..'d00000K0000Ol....oNMWk;..';;coxkOOOOOOOkkxxdoc:,...,cokNMWXxdoolcclloooooooo\nc::::clooooookXMWkxx...;kKKKKK00000d'...:KMWk'..'cldO00000000000000OOkxdc'...;cxNMWKxllllooooooooooo\n:::clooooooookNMWkxo...c0KK00000000o....dWMNl...;dxO00000000000O0000000Okd:...':xWMWOooooooooooooooo\ncclooooooodooxXMWkxl...;k000000000Ol....xWMXc...;lldO0O0000000000O0000OO00kc'...:0MMNkoooooooooooooo\nlooooooooooooxKMMOdc...,x0O00000000d'...cXMWk,...,;:ldkOOO0OOOOkkOO00000000Oo....dWMW0dooooooooooooo\noooooooooooood0WMKd:....lO000000OO0k:....oXMW0c.......,;::::;;,''ck000000000O:...cXMMKdooooooooooooo\nooooooooooooodkNMNx:....,x0O0000O000x;....:ONMW0dc:;.............cOK00000000O:...cXMMKdooooooooooooo\nooooooooooooooxKMM0o,....:k00000KK000kc'....:xKNMWWNKOkdool:....:kK000000O00k;...lNMW0dooooooooooool\nooooooooooodoookNMNkc,....:x0KKKK00000Oxl;.....;lxkkO0OOOxl,..'ck00000000O00d'..'kWMNOdooodoooooolcc\noooooooooooollod0WMXkl;....;x00000O000000Oxoc;,'........'',;cokO00000000000x;...cXMMKxooooooooolcc::\noooooooollclooooxKWMXOxl'....cxO0O0000O0OO000OOkxdddooodxkkO0000000000O000k:...;0MMNkdooooooolc:::::\nooooolcccloooooooxXWWX0Od;....'lxO000000O00000000000000000O00000O000O000Od;...:0WMNOdoooooolcc::::cc\noolcccclooooooooookKWMNXKOc.....':dkO000O000O00O0000000000000000000OO00xc'...lKWMNOdodooolc:::cclloo\ncc:cclooooooooooooox0NMWWWXx;......,cdkO00000O0000O0000000000000000K0kl'...:OWMWXkdoooolcccccloooooo\n:clooooooooooooooooodkKWWMMWKxc'......,:oxOO000000000000OO0000000Oxl;....:kNMWN0xoooolcccllooooooooo\nlooooooooooooooooooooodkO0KNWMN0xl;.......';:codkkkkO00Okxxdolc:;'....'lONMWN0xdoooolllooooooooooooo\nooooooooooooooooooodoooooodxk0XWMWN0kdc;'..........'',,''..........,cxKWMWX0xdoooooooooooooooooooooo\nooooooooooooooooooooooooolcc:cok0KNWMMNKOkxoc;,...............';cdOXWMWNKOxooooooooooooooooooooooooo\nooooooooooooooooooooollcc:::cloooddkKNWMMWWNNXK0kxddoooooddxO0XNWMMWXKOxdooooooooooooooooooooooooooo\nooooooooodooooooollcc::::ccloooooooodxkO0KKXNNWWWMMMMMMMMMMWWWNXK0Okddoodooooooooooooooooooooooooooo\noooooooooooooolcc::::::clloodooooooooooooddddxxkkOOOkkkkkOOkkxxddooooooooooooooooooooooooooooooooooo\noooooooooollcc:::::::cloooooooooooooooooooooooooolccc:cloooooooooooooooooooooooooooooooooooooooooooo\noooooollcc::::::::cclooooooooooooooooooooooooolcc:::cloooooooooooooooooooooooooooooooooooooooooooooo\noollcc::::::::::clooooooooooooooooooooooooolcc:::ccloooooooooooooooooooooooooooooooooooooooooooooolc\ncc::::::::::::cloooooooooooooooooooooooolcc::::clooooooooooooooooooooooooooooooooooooooooooooooolc::\n:::::::::::cclooooooooooooooooooooooolcc:::::cloooooooooooooooooooooooooooollccloooooooooooooolc::::\n::::::::::clooooooooooooooooooooooolc:::::::clodooooooooooooooooooooooooolcc::looooooooodooooc::::::");
     console.log('%cdeveloper: %cAnonim Biri', 'font-size: 20px;', "color: yellow; font-size: 30px;");
    (async () => {
  let yenileme = await GM_getValue('yenile');
if(yenileme === "true"){
    setTimeout(function() {
$(".btYellowBig.ic-playHome").click();
GM_deleteValue("yenile");
    }, 1000);
}
})();
function lnkfunc(value) {

}

 document.addEventListener("keydown", e => {
if (!document.querySelector("#popUp #modmenupopUp")){
  if (e.key === "m" && e.ctrlKey) {
    menu();
  }else if (e.key === "M" && e.ctrlKey){
   menu();
  }}else{
 if (e.key === "m" && e.ctrlKey) {
    closemenu();
  }else if (e.key === "M" && e.ctrlKey){
   closemenu();
  }
  }
});
  this.lang = {
     Cheat_İnjected: "Cheat İnjected :)",
     Anti_AFK: "Anti AFK",
     Auto_Report: "Auto Report",
     Auto_Skip: "Auto Skip",
	 Auto_kick: "Auto Kick",
     Auto_Answer: "Auto Answer",
	 Rainbow_Drawing: "Rainbow Drawing",
     Disabled: "Disabled",
     Enabled: "Enabled",
     Github_source_code: "Github source code",
};
function menuns() {
     setTimeout(function() {
        javascript:(function loops(){
             menuns();
             if (!document.querySelector("#afk")){
//degisenkisimlar

//$('#modmenupopUp .content').append('<div style="'+this.st.formstyle+'"><div id="option1"></div></div>');
//$('.advantagesLogin').html('<div style="'+this.st.formstyle+'"><div class="option1"></div></div>');
//$('.mobileHide').html('<div class="list1"></div>');

    //general
$('#modmenupopUp .content .contentPopup.info').append('<label class="select lang"><select name="language"><optgroup label="Languages"><option value="23">Azərbaycanca</option><option value="2">English</option><option value="8">Türkçe</option></optgroup></select></label>');
$('.select.lang').on('change', 'select[name="language"]', function() { lang =document.querySelector('.select.lang select').value;});
$('#modmenupopUp .content .contentPopup.info').append('<div class="fieldset visibleRoom" style="width: 100%; height: 40px;"><img src="https://i.imgur.com/iBPf50O.png" style="position:relative;top:7px;right:5px;height:25px;"><span class="legend">'+this.lang.Anti_AFK+': </span><div class="switchFieldCheck" style="float:right;"><input type="checkbox" name="visible" id="afk"><label for="afk"></label></div></div>');
$('.switchFieldCheck').on('change', '#afk', function() { if(afkk==false) { afkk=true; $('.scrollElements:eq(1)').append('<div class="msg system">Anti AFK: <strong>Enabled</strong></div>'); }else{afkk=false; $('.scrollElements:eq(1)').append('<div class="msg system">Anti AFK: <strong>Disabled</strong></div>');} antiafk(); });
$('#modmenupopUp .content .contentPopup.info').append('<div class="fieldset visibleRoom" style="width: 100%; height: 40px;"><img src="https://i.imgur.com/HfLAgAS.png" style="position:relative;top:7px;right:5px;height:25px;"><span class="legend">'+this.lang.Auto_kick+': </span><div class="switchFieldCheck" style="float:right;"><input type="checkbox" name="visible" id="otokick"><label for="otokick"></label></div></div>');
$('.switchFieldCheck').on('change', '#otokick', function() { if(otokickk==false) { otokickk=true; $('.scrollElements:eq(1)').append('<div class="msg system">Auto kick: <strong>Enabled</strong></div>');}else{otokickk=false; $('.scrollElements:eq(1)').append('<div class="msg system">Auto kick: <strong>Disabled</strong></div>');} kicks(); });
$('#modmenupopUp .content .contentPopup.info').append('<div class="fieldset visibleRoom" style="width: 100%; height: 40px;"><img src="https://i.imgur.com/it44rZS.png" style="position:relative;top:7px;right:5px;height:25px;"><span class="legend">'+this.lang.Auto_Skip+': </span><div class="switchFieldCheck" style="float:right;"><input type="checkbox" name="visible" id="otoskip"><label for="otoskip"></label></div></div>');
$('.switchFieldCheck').on('change', '#otoskip', function() { if(skipp==false) { skipp=true;$('.scrollElements:eq(1)').append('<div class="msg system">Auto skip: <strong>Enabled</strong></div>');}else{skipp=false;$('.scrollElements:eq(1)').append('<div class="msg system">Auto skip: <strong>Disabled</strong></div>');} skip(); });
$('#modmenupopUp .content .contentPopup.info').append('<div class="fieldset visibleRoom" style="width: 100%; height: 40px;"><img src="https://i.imgur.com/VkvLxc0.png" style="position:relative;top:7px;right:5px;height:25px;"><span class="legend">'+this.lang.Auto_Report+': </span><div class="switchFieldCheck" style="float:right;"><input type="checkbox" name="visible" id="otoreport"><label for="otoreport"></label></div></div>');
$('.switchFieldCheck').on('change', '#otoreport', function() { if(reportt==false) { reportt=true; $('.scrollElements:eq(1)').append('<div class="msg system">Auto report: <strong>Enabled</strong></div>');}else{reportt=false; $('.scrollElements:eq(1)').append('<div class="msg system">Auto report: <strong>Disabled</strong></div>');} report(); });
$('#modmenupopUp .content .contentPopup.info').append('<div class="Rainbow Drawing" style="width: 100%; height: 40px;"><img src="https://i.imgur.com/MH34Z4h.png" style="position:relative;top:7px;right:5px;height:25px;"><span class="legend">'+this.lang.Rainbow_Drawing+': </span><div class="switchFieldCheck" style="float:right;"><input type="checkbox" name="visible" id="renklicizimm"><label for="renklicizimm"></label></div><input name="renklicizimmms" id="renklicizimmms" type="number" style="position:relative;top:8px;float:right;right:5px; width: 20%;" max="100000" step="1" value="1000" class="renklicizimmms" oninput="amount.value=renklicizimmms.value;"></div>');
$('.switchFieldCheck').on('change', '#renklicizimm', function() { if(renklicizim==false) { renklicizim=true; $('.scrollElements:eq(1)').append('<div class="msg system">Rainbow Drawing: <strong>Enabled</strong></div>'); }else{renklicizim=false; $('.scrollElements:eq(1)').append('<div class="msg system">Rainbow Drawing: <strong>Disabled</strong></div>');} rengareknkizim(); });
$('.Rainbow.Drawing').on('change', '.renklicizimmms', function() { renklicizimms = document.querySelector('.renklicizimmms').value;});

$('#modmenupopUp .content .contentPopup.info').append('<div class="Auto Answer" style="width: 100%; height: 40px;"><img src="https://i.imgur.com/ejCouCQ.png" style="position:relative;top:7px;right:5px;height:25px;"><span class="legend">'+this.lang.Auto_Answer+': </span><div class="switchFieldCheck" style="float:right;"><input type="checkbox" name="visible" id="autoanswerr"><label for="autoanswerr"></label></div><input name="renklicizimmms" id="renklicizimmms" type="number" style="position:relative;top:8px;float:right;right:5px; width: 20%;" max="100000" step="1" value="1000" class="autoanswerms" oninput="amount.value=autoanswerms.value;"></div>');
$('.switchFieldCheck').on('change', '#autoanswerr', function() { if(autoanswer==false) { autoanswer=true; $('.scrollElements:eq(1)').append('<div class="msg system">Auto answer: <strong>Enabled</strong></div>'); }else{autoanswer=false; $('.scrollElements:eq(1)').append('<div class="msg system">Auto answer: <strong>Disabled</strong></div>');} autoanswerloop(); });
$('.Auto.Answer').on('change', '.autoanswerms', function() { autoanswerms = document.querySelector('.autoanswerms').value;});


//$('#option1').html('<a style="'+this.st.os+' target="blank">'+this.st.f1+'</a> <label style="'+this.st.bp+'" class=\'switch\'><input type=\'checkbox\' class="afk" ></label><div class="option2"></div>');
//$('#option1').on('change', '.afk', function() { if(afkk==false) { afkk=true; $('.scrollElements:eq(1)').append('<div class="msg system">Anti AFK: <strong>Enabled</strong></div>'); }else{afkk=false; $('.scrollElements:eq(1)').append('<div class="msg system">Anti AFK: <strong>Disabled</strong></div>');} antiafk(); });
//$('.option2').html('<a style="'+this.st.os+' target="blank">'+this.st.f5+'</a> <label style="'+this.st.bp+'" class=\'switch\'><input type=\'checkbox\' class="otoreport" ></label><div class="option3"></div>');
//$('.option2').on('change', '.otoreport', function() { if(reportt==false) { reportt=true; $('.scrollElements:eq(1)').append('<div class="msg system">Oto report: <strong>Enabled</strong></div>');}else{reportt=false; $('.scrollElements:eq(1)').append('<div class="msg system">Oto report: <strong>Disabled</strong></div>');} report(); });
//$('.option3').html('<a style="'+this.st.os+' target="blank">'+this.st.f7+'</a> <label style="'+this.st.bp+'" class=\'switch\'><input type=\'checkbox\' class="otokick" ></label><div class="option4"></div>');
//$('.option3').on('change', '.otokick', function() { if(otokickk==false) { otokickk=true; $('.scrollElements:eq(1)').append('<div class="msg system">Oto kick: <strong>Enabled</strong></div>');}else{otokickk=false; $('.scrollElements:eq(1)').append('<div class="msg system">Oto kick: <strong>Disabled</strong></div>');} kicks(); });
//$('.option4').html('<a style="'+this.st.os+' target="blank">'+this.st.f6+'</a> <label style="'+this.st.bp+'" class=\'switch\'><input type=\'checkbox\' class="otoskip" ></label><div class="option5"></div>');
//$('.option4').on('change', '.otoskip', function() { if(skipp==false) { skipp=true;}else{skipp=false;} skip(); });
//$('.option5').html('<a style="'+this.st.os+' target="blank">'+this.st.f10+'</a> <label style="'+this.st.bp+'" class=\'switch\'><input type=\'checkbox\' class="renklicizimm" ></label><a style="'+this.st.os+' target="blank">  '+this.st.f9+'</a> <input name="renklicizimmms" id="renklicizimmms" type="number" style="width: 4em" min="70" max="150" step="1" value="1000" class="renklicizimmms" oninput="amount.value=renklicizimmms.value;"> <a style="'+this.st.os2+' target="blank">MS</a><div class="option8"></div>');
//$('.option5').on('change', '.renklicizimm', function() { if(renklicizim==false) { renklicizim=true; $('.scrollElements:eq(1)').append('<div class="msg system">Rainbow Drawing: <strong>Enabled</strong></div>'); }else{renklicizim=false; $('.scrollElements:eq(1)').append('<div class="msg system">Rainbow Drawing: <strong>Disabled</strong></div>');} rengareknkizim(); });
//$('.option5').on('change', '.renklicizimmms', function() { renklicizimms = document.querySelector('.renklicizimmms').value;});
//$('.option8').html('<a style="'+this.st.os+' target="blank">'+this.st.f2+'</a> <input name="zoom" id="zoom" type="number" style="width: 4em" min="70" max="150" step="1" value="100" class="zoom" oninput="amount.value=zoom.value;"> <a style="'+this.st.os2+' target="blank">(Min:70-Max:150)</a>');
//$('.option8').on('input', '.zoom', function(e) { sendmesaj(); });
//$('.list1').html('<div style="'+this.st.liststyler+'">'+text+'</div>');



if (lang==8){
this.lang.Cheat_İnjected = "Hile Enjekte Edildi :)";
this.lang.Github_source_code = "Github kaynak kodu";
this.lang.Anti_AFK = "AFK Engelleyici";
this.lang.Auto_Report = "Otomatik Şikayet";
this.lang.Auto_Skip = "Otomatik Geç";
this.lang.Auto_kick = "Otomatik Oy At";
this.lang.Auto_Answer = "Otomatik Bil";
this.lang.Rainbow_Drawing = "Renkli Çizim";
this.lang.Disabled = "Devre Dışı";
this.lang.Enabled = "Etkin";

}else if (lang==23){ //not: azerice çevirisi yapıp github adresime atabilir. google çeviriden çevrildi.... ve ek olarak en aşağıda bulunan azerice kelime listesi az olsa da eklenmeye çalışıldı eklemek isteyen varsa bana ulaşabilir.
this.lang.Cheat_İnjected = "Hiylə enjekte edildi :)";
this.lang.Github_source_code = "Github mənbə kodu";
this.lang.Anti_AFK = "AFK bloker";
this.lang.Auto_Report = "Avtomatik Şikayət";
this.lang.Auto_Skip = "Avtomatik Atlama";
this.lang.Auto_kick = "Avtomatik Səs";
this.lang.Auto_Answer = "Avtomatik Bilmək";
this.lang.Rainbow_Drawing = "Rəng Çəkmə";
this.lang.Disabled = "Sifarişdən kənarda";
this.lang.Enabled = "Effektiv";

}
else{
this.lang.Cheat_İnjected = "Cheat İnjected :)";
this.lang.Github_source_code = "Github source code";
this.lang.Anti_AFK = "Anti AFK";
this.lang.Auto_Report = "Auto Report";
this.lang.Auto_Skip = "Auto Skip";
this.lang.Auto_kick = "Auto Kick";
this.lang.Auto_Answer = "Auto Answer";
this.lang.Rainbow_Drawing = "Rainbow Drawing";
this.lang.Disabled = "Disabled";
this.lang.Enabled = "Enabled";

}





                 if(document.querySelector('#afk'))
                 {
                     //document.querySelector('.afk').checked = afkk;
                     document.querySelector('#afk').checked = afkk;
                 }
                 if(document.querySelector('#otoreport'))
                 {
                     document.querySelector('#otoreport').checked = reportt;
                 }
                 if(document.querySelector('#otokick'))
                 {
                     document.querySelector('#otokick').checked = otokickk;
                 }
                  if(document.querySelector('#renklicizimm'))
                 {
                     document.querySelector('#renklicizimm').checked = renklicizim;
                 }
                 if(document.querySelector('.renklicizimmms'))
                 {
                     document.querySelector('.renklicizimmms').value = renklicizimms;
                 }
                 if(document.querySelector('#otoskip'))
                 {
                     document.querySelector('#otoskip').checked = skipp;
                 }
                 if(document.querySelector('.contentPopup.info .select.lang select[name="language"]'))
                 {
                     document.querySelector('select[name="language"]').value = lang;
                 }
                 if(document.querySelector('#modmenupopUp .content div #option1'))
                 {

                 }
                  if(document.querySelector('#autoanswerr'))
                 {
                     document.querySelector('#autoanswerr').checked = autoanswer;
                 }
                 if(document.querySelector('.autoanswerms'))
                 {
                     document.querySelector('.autoanswerms').value = autoanswerms;
                 }
             }
             if (!document.getElementById("author")){
           $('#screens header div .logo').append('<div style="border:1px solid black;border-radius:20px;padding:3px;width:200px;height:20px;font-size: 17px;text-align:center;background-color: 0, 106, 208;color:white;" id="author"></label>'+ this.lang.Cheat_İnjected +'<a style="font-weight:bold;color:black;font-size:14px;text-decoration:none;" class="author"></div>');
            }
              })()
            }, 0);
}

    function report() {

        setTimeout(function() {
        javascript:(function loops(){
            if(reportt==true) {
     report();

     let reportbutton = document.querySelector('.denounce');
                if(reportbutton == null){
                }else{
        reportbutton.click();
                }
            let aceeptbutton = document.querySelector('.btYellowBig.smallButton.ic-yes');
                 if(aceeptbutton == null){
                }else{
        aceeptbutton.click();
                }
                }
            })()
            }, 0);
    }
 let blacklist = "";
 function kicks() {
        setTimeout(function() {
        javascript:(function loops(){
             if(otokickk==true) {
     kicks();

                if(document.querySelector('#chat .history .scroll .scrollElements .msg.alert')){
            let KickaAtanText =  $('#chat .history .scroll .scrollElements .msg.alert:last strong:eq(0)').text();
            let KickaAtılanText =  $('#chat .history .scroll .scrollElements .msg.alert:last strong:eq(1)').text();
             let seninnickin =  $('.user.you .infosPlayer .nick').text();
            //blacklist.push(seninnickin);
            if(KickaAtılanText === seninnickin){
                 let seninnickin =  $('.user.you .infosPlayer .nick').text();
               if(KickaAtanText === blacklist){
               }else{
                 blacklist = KickaAtanText;
                    document.getElementsByClassName("mousetrap")[0].value=blacklist + KickaAtanText;
                $('#chat .history .scroll .scrollElements .msg.alert:last strong:eq(0)').click()
                $('.buttons .btYellowBig.ic-votekick').click()
               }
            }
          }

             }
            })()
            }, 0);
    }
let colorindex = 0
    function rengareknkizim() {
                setTimeout(function() {
        javascript:(function loops(){
            if(renklicizim==true) {
                rengareknkizim();
if (document.querySelector("#hint button")){

            //renkli çizim

    if(colorindex < 18){
            colorindex += 1;
            $('#tools div .colors .color:eq('+ colorindex +')').click() //18
     }else{
     colorindex = 0;
     }
}
            }
             })()
            }, renklicizimms);
}
    function antiafk() {
        setTimeout(function() {
        javascript:(function loops(){
             if(afkk==true) {
     antiafk();
            let yesbutton = document.querySelector('.btYellowBig.ic-yes');
                   if(yesbutton == null){
                }else{
        yesbutton.click();
                }
             }
             if (document.querySelector("#modmenupopUp")){
             $('#popUp').css({"display": "block"});}
            })()
            }, 0);
    }

    function skip() {
        setTimeout(function() {
        javascript:(function loops(){
             if(skipp==true) {
     skip();
            let skipbutton = document.querySelector('.btYellowBig.ic-drawG'); //hint div button
                   if(skipbutton == null){
                }else{
                    skipbutton.click();
                }
                 if (document.querySelector("#hint button")){
                 $('#hint div button:eq(1)').click(); //btYellowBig smallButton ic-yes
                 $('.buttons .btYellowBig.smallButton.ic-yes').click();
                 }
             }
            })()
            }, 0);
    }
function autoanswerloop() {
    setTimeout(function() {
        javascript:(function loops(){
            autoanswerloop();
if (document.getElementById("hint")){
          let woldcolor =  $('#kemlimelistesi button:eq(0)').css("background-color");
            if(woldcolor== "rgb(0, 128, 0)") {}else{
             if(autoanswer==true) {
                   let wold =  $('#kemlimelistesi button:eq(0)').text();
                 sendmesaj(wold);
             }
            }
}
           })()
            }, autoanswerms);
    }

}, 0);

//let blacklist = "";
let blacklist2 = "";
let öncekiyazı = "";
 function loop() {
             setTimeout(function() {
        javascript:(function loops(){
     loop();

            if (document.getElementById("hint")){
                //var hintword = document.getElementById("word").classList
                //var spanClass = $('.word').find('span').attr('class');
               // let InputText = $('.word span').text();
                let kelime1 = $('.word:eq(0) span:parent').text();
                let kelime2 = $('.word:eq(1) span:parent').text();
                let kelime3 = $('.word:eq(2) span:parent').text();
                let kelime4 = $('.word:eq(3) span:parent').text();
                let InputText = kelime1.toLowerCase() + " " + kelime2.toLowerCase() + " " + kelime3.toLowerCase() + " " + kelime4.toLowerCase();
                if (document.querySelector("#hint button")){
                if (document.getElementById("ara")){

                }else{
 $('#hint').append('<div class="trbuttontr"></div>');
                $('.trbuttontr').html('<div id="ara"><body><button type="button" onclick="parent.open(\'https://www.google.com/search?tbm=isch&tbs=itp:lineart&q=' + InputText + '\');">Search</button></body></div>');
                }
            }else{
                $('#trbuttontr').removeClass();
            }
            }
//  if (!document.querySelector("#content")[1]){
//     $('#content:eq(1)').remove();
//  }

            //document.getElementById("info").className = '<button id="info"><span class="tooltip">Bilgi</span></button> <button id="close" class="closing" ><img src="https://i.imgur.com/laWPceN.png" /></button>';
     //$('#info').html('<button id="info"><span class="tooltip">Bilgi</span></button> <button id="close" class="closing" ><img src="https://i.imgur.com/laWPceN.png" /></button>');
     //$('#hint').html('<body><button type="button" onclick="alert("deneme")">Click Me!</button></body>');
            //document.getElementById("hint").classList.add('<button type="button" onclick="">Click Me!</button>');
           // document.getElementById("ara").addEventListener("click", myFunction);
            //if (!document.getElementsByClassName('trbuttontr2')) {
            if (document.querySelector("#kemlimelistesi #screens")){
                if (!document.querySelector("#__next .contribute .center")){
              $('#__next').prepend('<div class="contribute"><div><div class="center"><span><h3>Gartic.io hack!</h3><p>İf the page does not open, refresh 1 how many times</p></span><a href="https://github.com/anonimbiri/gartic.io-hack" target="_blank">Github source code</a></div></div><div>');
            }}
            if (document.querySelector(".contentPopup .avatar")){
                var bg = $(".contentPopup .avatar").css("background-image")
                 if (bg === "none"){}else{
                bg = bg.replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*/, '')//.replace("type=large","type=square").replace("v2.6/","")
                $(".contentPopup .avatar").attr({"onclick": "parent.open(\'" + bg +"\')",});
            }}
            if (!document.getElementById("tamekran")){
               $('.game div:eq(2) div:eq(1)').prepend('<div id="trbuttontr3"></div>');
              $('#trbuttontr3').prepend('<button id="tamekran" class="closing" ><img src="https://i.imgur.com/wm4kFLf.png" style="width:25px;height:25px;" /><span class="tooltip">Full Screen</span></button>');
               $('#trbuttontr3').on('click', '#tamekran', function() { showfullscreen(); });
                }
            if (!document.getElementById("modmenu")){
               $('.game div:eq(2) div:eq(1)').prepend('<div id="trbuttontr4"></div>');
              $('#trbuttontr4').prepend('<button id="modmenu" class="closing" ><img src="https://i.imgur.com/4Dk6c7r.png" style="width:25px;height:25px;" /><span class="tooltip">Mod Menu (Ctrl + M)</span></button>');
               $('#trbuttontr4').on('click', '#modmenu', function() { menu(); });
                }
             $('.content').on('click', '.close', function() { closemenu(); });
            if (!document.getElementById("uplatimage")){
               $('.game div:eq(2) div:eq(0)').append('<div id="4trbuttontr"></div>');
              $('#4trbuttontr').append('<button id="uplatimage" class="closing" ><img src="https://i.imgur.com/CU5Gjga.png" style="width:25px;height:25px;" /><span class="tooltip">Upload İmage From Clipboard</span></button>');
               $('#4trbuttontr').on('click', '#uplatimage', function() { arakaplanyap(); });
                }
            if (!document.getElementById("odadegis")){
               $('.game div:eq(2) div:eq(0)').append('<div id="5trbuttontr"></div>');
              $('#5trbuttontr').append('<button id="odadegis" class="closing" ><img src="https://i.imgur.com/HZsuXxP.png" style="width:25px;height:25px;" /><span class="tooltip">Change Room</span></button>');
               $('#5trbuttontr').on('click', '#odadegis', function() { changeroom(); });
                }
//mobile menu open
if (!document.querySelector(".Mobile.Mod.Menu")){
              $('.actionsMobile').prepend('<button class="Mobile Mod Menu"><img src="https://i.imgur.com/JodxI35.png" style="width:25px;height:25px;" /></button>');
               $('.actionsMobile').on('click', '.Mobile.Mod.Menu', function() { menu(); });
                }
if (!document.querySelector("#popUp .loading #loadingimage")){
 $('#popUp .loading').append('<div id="loadingimage"></div><img src="https://i.imgur.com/oXqL49V.gif" style="position:relative;left:11px;top:-100px;width:80px;height:80px;">');
}

if (!document.getElementById("sensinbu")){
             $('.user.you').append('<div id="sensinbu"></div>');
             $('#sensinbu').html('<img src="https://i.imgur.com/tZ5QPu8.png" style="position:relative;left:-20px;width:30px;height:30px;">')
             }

            if (!document.getElementById("trbuttontr2")){
             //copyToClipboard('#nick');
             $('.content.profile .buttons').append('<div id="trbuttontr2"></div>');
            $('#trbuttontr2').html('<button class="btYellowBig ic-copylink" ><strong>COPY NİCKNAME</strong></button>')
            }
            $('#trbuttontr2').on('click', '.btYellowBig.ic-copylink', function() { copynickname(); });

    //  if(document.querySelector('#chat .history .scroll .scrollElements .msg.alert')){
    //        let KickaAtanText =  $('#chat .history .scroll .scrollElements .msg.alert:last strong:eq(0)').text();
    //        let KickaAtılanText =  $('#chat .history .scroll .scrollElements .msg.alert:last strong:eq(1)').text();
   //          let seninnickin =  $('.user.you .infosPlayer .nick').text();
  //          //blacklist.push(seninnickin);
  //          if(KickaAtılanText === seninnickin){
 //                let seninnickin =  $('.user.you .infosPlayer .nick').text();
 //              if(KickaAtanText === blacklist){
 //             }else{
 //                blacklist = KickaAtanText;
 //                   document.getElementsByClassName("mousetrap")[0].value=blacklist + KickaAtanText;
//                $('#chat .history .scroll .scrollElements .msg.alert:last strong:eq(0)').click()
//                $('.buttons .btYellowBig.ic-votekick').click()
//               }
//            }
//          }
 if (!document.getElementById("sürüklebırak")){
             //copyToClipboard('#nick');
             $(".content").attr({"ondragover": "document.getElementById('sürüklebırak').style.display = \'block\'", "ondragleave": "document.getElementById('sürüklebırak').style.display = \'none\'", "ondragexit":"document.getElementById('sürüklebırak').style.display = \'none\'"});//ondragover dragleave
             $('#events').append('<div id="sürüklebırak" style="display: none; height: 100%; width:100%; background-repeat: no-repeat; background-size: auto; text-align: center;color: white;border:1px solid rgba(93,136,153,255);border-radius:10px;background-color:black; opacity: 50%"><h4 style="margin: auto;text-align: center;padding: 250px;font-size:30px">Coming Soon</h4></div>');
 }
            if(document.querySelector('#answer .history .scroll .scrollElements .msg strong')){
            let yazılanmesaj =  $('#answer .history .scroll .scrollElements .msg:last').text();
            let yazankişi =  $('#answer .history .scroll .scrollElements .msg:last strong').text();
             let seninnickin =  $('.user.you .infosPlayer .nick').text();
            //blacklist.push(seninnickin);
            if(yazankişi === seninnickin){
                 //let seninnickin =  $('.user.you .infosPlayer .nick').text();
               if(yazılanmesaj === blacklist2){
               }else{
                 blacklist2 = yazılanmesaj;
                   // document.getElementsByClassName("mousetrap")[1].value=blacklist2 + yazılanmesaj;
                 //  console.log(yazılanmesaj.replace(seninnickin,"").replace(" ",""));
                  $('#kemlimelistesi button:contains(\''+yazılanmesaj.replace(seninnickin,"").replace(" ","")+'\')').css({"backgroundColor": "green","color": "white" });
                   $('#kemlimelistesi button:contains(\''+yazılanmesaj.replace(seninnickin,"").replace(" ","")+'\')').detach().appendTo("#kemlimelistesi");
                  // console.log(testi);

               }
                
            }

          }


             if(document.querySelector('.fieldset.lang .select select[name="language"]'))
                 {
                   lang =  document.querySelector('.fieldset.lang .select select[name="language"]').value;
                 }


       if (!document.getElementById("kemlimelistesi")){
            if (document.querySelector(".logo")){
           $('.banner').remove();
                 if (document.getElementById("hint")){
           $('.nextCenter').append('<div id="kemlimelistesi" style="margin-left: auto;margin-right: auto; height: 600px; overflow: scroll; width: 200px;border:1px solid rgba(93,136,153,255);border-radius:10px;padding:20px;background-color: rgba(159,189,201,255);"></div>');
       //    $('#kemlimelistesi').append( '<input type="button" id="ReloadWold" value="Reload">');
            }
            }//  $('#gartic-io_160x600').append('<div style="border:1px solid rgba(93,136,153,255);border-radius:20px;20px;padding:5px;background-color: rgba(159,189,201,255);"><div class="option1"></div></div>');
       //  $('#ReloadWold').on('click', 'button', function() { processCurrentWord(); });
         $('#kemlimelistesi').on('click', 'button', function() { var fired_button = $(this).text(); sendmesaj(fired_button); });
        // $("#kemlimelistesi button").click(function () { var fired_button = $(this).text(); sendmesaj(fired_button); });
         }

          //  setTimeout(function() {
          //   }, 1000);
    //var InputText = $('.word').html().replace("<span></span>", "<span>_</span>");
 if (document.getElementById("hint")){
     if (!document.querySelector("#hint button")){
     //document.getElementsByName("fname")
  // var InputText =  document.querySelector('.word').html();
       // let InputText = $('.word span:eq(0)').text().replace("", "_");
              var len = $('input[name="answer"]').val().length;
              var InputText2 = $('.line').html()
              var InputText =  InputText2.replace(/<span><\/span>/gi, " _ ").replace(/<span>/gi, "").replace(/<\/span>/gi, "").replace(/<div class="word">/gi, "").replace(/<\/div>/gi, " ㅤ "); ///<span></span>/g
              var InputText3 =  InputText2.replace(/<span><\/span>/gi, "_").replace(/<span>/gi, "").replace(/<\/span>/gi, "").replace(/<div class="word">/gi, "").replace(/<\/div>/gi, ""); ///<span></span>/g
              var hitlen = InputText3.length;
              hitlen -= 1;
              hitlen += document.getElementsByClassName("word").length;
                //  let kelime1 = $('.word:eq(0) span').text();
                //  let kelime2 = $('.word:eq(1) span').text();
                //  let kelime3 = $('.word:eq(2) span').text();
                //  let kelime4 = $('.word:eq(3) span').text();
                //  let textsa = kelime1.toLowerCase() + " " + kelime2.toLowerCase() + " " + kelime3.toLowerCase() + " " + kelime4.toLowerCase();
              var charCount = len + "/" + hitlen;

         if(len==hitlen)
                { $("#yazım").css({"color": "#2baa2b",});}
                else
                {$("#yazım").css({"color": "#ff5d64",});
            }

         if(öncekiyazı == InputText3){}else{
             öncekiyazı = InputText3;
         processCurrentWord();
         $('#kemlimelistesi').css({"display": "block"});
         }
 if (!document.getElementById("cavapyardımcısı")){
 $('#answer form').append('<div id="cavapyardımcısı"></div>');
 $('#cavapyardımcısı').append('<a id="yazım" style="position:relative;left:10;top:5px;width:30px;height:30px;font-weight:bold;color:black;font-size:20px;text-decoration:none; target=" blank"="">' + InputText + charCount + '</a>')
 }else{
 $("#yazım").text(InputText + charCount);
 }
 }
 }else{
$('#cavapyardımcısı').remove();
$('#kemlimelistesi').css({"display": "none"});
    // clearWord();
 }

             })()
            }, 100);
 }

 function copynickname() {
  let nick = document.querySelector('.content.profile .contentPopup .nick');
  navigator.clipboard.writeText(nick.innerHTML)
 $(".close").click();
 }
 function menu() {
 $('#popUp').css({"display": "block"});
 $('#popUp').append('<div id="modmenupopUp"></div>');
 $('#modmenupopUp').append('<div class="content" style="position: absolute;"><button class="close"></button><div class="title"><h3>Mod Menu</h3></div><div class="contentPopup info"></div></div>');
     $('#modmenupopUp .content').append('<a onclick="parent.open(\'https://github.com/anonimbiri/gartic.io-hack\');" style="cursor: pointer;position:relative;top:70px;width:290px;background-color: rgba(64, 120, 192);" class="loginGoogle"><img src="https://i.imgur.com/HVXUQfZ.png" style="position:relative;left:15px;width:25px;height:25px;"><span>'+ this.lang.Github_source_code +'</span></a>');
         setTimeout(function() {
         if(!document.querySelector('#modmenupopUp .content div #afk'))
                 {
 $('#modmenupopUp .content').append('<a style="font-weight:bold;color:red;font-size:20px;text-decoration:none; target=" blank"="">menu failed to load please refresh the page and wait a moment</a>');
                 }
 }, 1000);
}
function closemenu() {
 $('#popUp').css({"display": "none"});
 $('#modmenupopUp').remove(); }

var backgroundimage = false;
 function arakaplanyap() {
     if(backgroundimage === false){
         backgroundimage = true;
        // const clipboardItem = navigator.clipboard.read()
 $("#uplatimage img").attr({"src" : "https://i.imgur.com/StaXwxO.png"});
 $("#uplatimage .tooltip").text("Remove Background");
  navigator.clipboard.readText().then(clipText =>
   // $('#drawing').append('<img src="'+ clipText +'" style="position:relative;left:15px;width:25px;height:25px;">'));

 $('#drawing canvas:eq(0)').css({"background-image": "url('" + clipText + "')", "background-repeat":"no-repeat", "background-position":"center", "background-size":"contain"}));
     }else{
         backgroundimage = false;
 $("#uplatimage img").attr({"src" : "https://i.imgur.com/CU5Gjga.png"});
 $("#uplatimage .tooltip").text("Upload İmage From Clipboard");
 $('#drawing canvas:eq(0)').css({"background-image": "", });
     }
}
 function changeroom() {
 $("#exit").click();
 $(".btYellowBig.smallButton.ic-yes").click();
      this.GM_setValue=function (key,value) {
        return localStorage[key]=value;
    };
GM_setValue("yenile", "true");
     setTimeout(function() {
 location.reload().then(() => {
  $(".btYellowBig.ic-playHome").click();
  }, error => {
    console.error('onRejected function called: ' + error.message);
  });

     }, 1000);
}
 function sendmesaj(word) {
     if(word){
let input = document.querySelector('input[name="answer"]');
     if(input){
let isinput = document.querySelector('input[name="answer"]').disabled;
     if(isinput==false){
let lastValue = input.value;
input.value = word;
let event = new Event('input', { bubbles: true });
var event2 = new Event("submit", { bubbles: true });
// hack React15
event.simulated = true;
event2.simulated = true;
// hack React16 内部定义了descriptor拦截value，此处重置状态
let tracker = input._valueTracker;
if (tracker) {
  tracker.setValue(lastValue);
}
input.dispatchEvent(event);
input.form.dispatchEvent(event2);
     }
     }
 }
 }
//const currentWord = document.querySelector("#currentWord")
//const observer = new MutationObserver(processCurrentWord)
//observer.observe(currentWord, {childList: true})
const wordListen = ["ABBA","Abraham Lincoln","abstract","abyss","AC/DC","accident","accordion","ace","acid","acne","acorn","action","actor","addiction","addition","Adidas","adorable","adult","advertisement","Africa","afro","afterlife","air conditioner","airbag","aircraft","airplane","airport","Aladdin","alarm","albatross","alcohol","alien","allergy","alley","alligator","almond","alpaca","ambulance","America","Amsterdam","anaconda","anchor","Android","angel","Angelina Jolie","anglerfish","angry","Angry Birds","animation","anime","ant","Antarctica","anteater","antelope","antenna","anthill","antivirus","Anubis","anvil","apartment","apocalypse","applause","Apple","apple","apple pie","apple seed","apricot","aquarium","arch","archaeologist","archer","architect","Argentina","aristocrat","arm","armadillo","armor","armpit","arrow","ash","Asia","assassin","assault","Asterix","asteroid","astronaut","asymmetry","athlete","Atlantis","atom","attic","Audi","audience","Australia","autograph","avocado","axe","baboon","baby","back pain","backbone","backflip","backpack","bacon","bad","badger","bag","bagel","bagpipes","baguette","bait","bakery","baklava","balance","balcony","bald","ball","ballerina","ballet","balloon","Bambi","bamboo","banana","Band-Aid","bandage","bandana","banjo","bank","banker","bar","Barack Obama","barbarian","barbecue","barbed wire","barber","barcode","bark","barn","barrel","Bart Simpson","bartender","base","basement","basket","basketball","bat","bathroom","bathtub","Batman","battery","battle","battleship","bayonet","bazooka","beach","beak","bean","bean bag","beanie","beanstalk","bear","bear trap","beatbox","beaver","bed","bed bug","bed sheet","bedtime","bee","beef","beer","beet","Beethoven","beetle","bell","bell pepper","bellow","belly","belly button","below","belt","bench","betray","Bible","bicycle","Big Ben","bill","Bill Gates","billiards","bingo","binoculars","biology","birch","bird","bird bath","birthday","biscuit","Bitcoin","bite","black","Black Friday","black hole","blackberry","blacksmith","blanket","bleach","blender","blimp","blind","blindfold","blizzard","blood","blowfish","blue","blueberry","blush","BMW","BMX","boar","board","boat","bobsled","bodyguard","boil","bomb","Bomberman","booger","book","bookmark","bookshelf","boomerang","boots","border","bottle","bottle flip","bounce","bouncer","bow","bowl","bowling","box","boy","bracelet","braces","brain","brainwash","branch","brand","Brazil","bread","breakfast","breath","brick","bricklayer","bride","bridge","broadcast","broccoli","broken heart","bronze","broom","broomstick","brownie","Bruce Lee","bruise","brunette","brush","bubble","bubble gum","bucket","Bugs Bunny","building","bulge","bull","bulldozer","bullet","bumper","bungee jumping","bunk bed","bunny","burglar","burp","burrito","bus","bus driver","bus stop","butcher","butler","butt cheeks","butter","butterfly","button","cab driver","cabin","cabinet","cactus","cage","cake","calendar","camel","camera","campfire","camping","can","can opener","Canada","canary","candle","canister","cannon","canyon","cap","cape","cappuccino","Capricorn","captain","Captain America","car wash","cardboard","carnival","carnivore","carpenter","carpet","carrot","cartoon","cash","casino","cast","cat","Cat Woman","catalog","catapult","caterpillar","catfish","cathedral","cauldron","cauliflower","cave","caveman","caviar","ceiling","ceiling fan","celebrate","celebrity","cell","cell phone","cello","cement","centaur","centipede","Cerberus","chain","chainsaw","chair","chalk","chameleon","champagne","champion","chandelier","charger","Charlie Chaplin","cheek","cheeks","cheerleader","cheese","cheeseburger","cheesecake","cheetah","chef","chemical","cherry","cherry blossom","chess","chest","chest hair","chestnut","chestplate","chew","Chewbacca","chicken","chihuahua","child","chime","chimney","chimpanzee","chin","China","Chinatown","chinchilla","chocolate","chopsticks","Christmas","Chrome","Chuck Norris","church","cicada","cigarette","cinema","circle","circus","clap","clarinet","classroom","claw","clay","clean","clickbait","cliff","climb","cloak","clock","cloth","clothes hanger","cloud","clover","clown","clownfish","coach","coal","coast","coast guard","coaster","coat","cobra","cockroach","cocktail","coconut","cocoon","coffee","coffee shop","coffin","coin","cola","cold","collapse","collar","color-blind","Colosseum","comb","comedian","comedy","comet","comfortable","comic book","commander","commercial","communism","community","compass","complete","computer","concert","condiment","cone","confused","console","continent","controller","conversation","cookie","cookie jar","Cookie Monster","copper","copy","coral","coral reef","cord","cork","corkscrew","corn","corn dog","corner","cornfield","corpse","cotton","cotton candy","country","cousin","cow","cowbell","cowboy","coyote","crab","crack","Crash Bandicoot","crate","crawl space","crayon","cream","credit","credit card","Creeper","cricket","cringe","Croatia","crocodile","croissant","crossbow","crow","crowbar","crucible","cruise","crust","crystal","Cuba","cube","cuckoo","cucumber","cup","cupboard","cupcake","Cupid","curry","curtain","cushion","customer","cut","cute","cyborg","cylinder","cymbal","Daffy Duck","dagger","daisy","dalmatian","dance","dandelion","dandruff","darts","Darwin","Darwin Watterson","dashboard","daughter","day","dead","Deadpool","deaf","deep","deer","defense","delivery","demon","demonstration","dent","dentist","deodorant","depressed","derp","desert","desk","desperate","dessert","detective","detonate","dew","Dexter","diagonal","diagram","diamond","diaper","dice","dictionary","die","diet","dig","dinner","dinosaur","diploma","dirty","disaster","Discord","disease","dishrag","dispenser","display","diss track","distance","diva","divorce","dizzy","DNA","dock","doctor","dog","doghouse","doll","dollar","dollhouse","dolphin","dome","dominoes","Donald Duck","Donald Trump","donkey","door","doorknob","Dora","Doritos","dots","double","dough","download","Dracula","dragon","dragonfly","drain","drama","drawer","dream","dress","drink","drip","drive","driver","drool","droplet","drought","drum","drum kit","duck","duct tape","duel","Dumbo","dwarf","dynamite","eagle","ear","earbuds","Earth","earthquake","earwax","east","Easter","Easter Bunny","eat","echo","eclipse","eel","egg","eggplant","Egypt","Eiffel tower","Einstein","elbow","elder","election","electric car","electric guitar","electrician","electricity","elephant","elevator","Elmo","Elon Musk","Elsa","embers","emerald","Eminem","emoji","employer","emu","end","engine","engineer","England","equator","eraser","error","eskimo","espresso","Europe","evaporate","evening","evolution","exam","Excalibur","excavator","exercise","explosion","eye","eyebrow","eyelash","eyeshadow","fabric","fabulous","facade","face","face paint","Facebook","factory","failure","fairy","fake teeth","fall","family","Family Guy","Fanta","farm","farmer","fashion designer","fast","fast food","fast forward","father","faucet","feather","fence","fencing","fern","Ferrari","festival","fidget spinner","field","figurine","filmmaker","filter","finger","fingernail","fingertip","Finn","Finn and Jake","fire alarm","fire hydrant","fire truck","fireball","firecracker","firefighter","firefly","firehouse","fireman","fireplace","fireproof","fireside","firework","fish","fish bowl","fisherman","fist fight","fitness trainer","fizz","flag","flagpole","flamethrower","flamingo","Flash","flashlight","flask","flea","flight attendant","flock","floodlight","floppy disk","Florida","florist","flower","flu","fluid","flush","flute","fly","fly swatter","flying pig","fog","foil","folder","food","forehead","forest","forest fire","fork","fort","fortress","fortune","fossil","fountain","fox","frame","France","Frankenstein","freckles","Fred Flintstone","freezer","fridge","fries","frog","frostbite","frosting","frown","fruit","full","full moon","funeral","funny","fur","furniture","galaxy","Gandalf","Gandhi","gang","gangster","garage","garbage","garden","gardener","Garfield","garlic","gas","gas mask","gasoline","gasp","gate","gem","gender","generator","genie","gentle","gentleman","geography","germ","Germany","geyser","ghost","giant","gift","giraffe","girl","gladiator","glass","glasses","glitter","globe","gloss","glove","glow","glowstick","glue","glue stick","gnome","goal","goat","goatee","goblin","God","godfather","gold","gold chain","golden apple","golden egg","goldfish","golf","golf cart","good","Goofy","Google","goose","gorilla","graduation","graffiti","grandmother","grapefruit","grapes","graph","grass","grasshopper","grave","gravedigger","gravel","graveyard","gravity","Great Wall","Greece","greed","Green Lantern","grenade","grid","grill","grin","Grinch","groom","Gru","grumpy","guillotine","guinea pig","guitar","Gumball","gumball","gummy","gummy bear","gummy worm","hacker","hair","hair roller","hairbrush","haircut","hairspray","hairy","half","halo","ham","hamburger","hammer","hammock","hamster","hand","handicap","handle","handshake","hanger","happy","Happy Meal","harbor","hard","hard hat","harmonica","harp","harpoon","Harry Potter","hashtag","hat","Hawaii","hazard","hazelnut","head","headache","headband","headboard","heading","headphones","health","heart","heat","hedgehog","heel","heist","helicopter","hell","Hello Kitty","helmet","hen","Hercules","hermit","hero","hexagon","hibernate","hieroglyph","high five","high heels","high score","highway","hilarious","hill","hip hop","hippie","hippo","hitchhiker","hive","hobbit","hockey","holiday","Hollywood","Home Alone","homeless","Homer Simpson","honey","honeycomb","hoof","hook","hop","hopscotch","horizon","horn","horse","horsewhip","hose","hospital","hot","hot chocolate","hot dog","hot sauce","hotel","hourglass","house","hovercraft","hug","Hula Hoop","Hulk","hummingbird","hunger","hunter","hurdle","hurt","husband","hut","hyena","hypnotize","ice","ice cream","ice cream truck","iceberg","icicle","idea","Ikea","imagination","impact","incognito","India","industry","infinite","injection","insect","inside","insomnia","Intel","internet","intersection","interview","invasion","invention","invisible","iPad","iPhone","Ireland","iron","Iron Giant","Iron Man","island","Israel","Italy","ivy","Jack-o-lantern","jacket","jackhammer","Jackie Chan","jaguar","jail","jalapeno","James Bond","janitor","Japan","jaw","JayZ","jazz","jeans","jeep","jello","jelly","jellyfish","Jenga","jester","Jesus Christ","jet ski","Jimmy Neutron","John Cena","Johnny Bravo","joker","journalist","journey","judge","juggle","juice","jump rope","jungle","junk food","kangaroo","karaoke","karate","katana","Katy Perry","kazoo","kebab","keg","kendama","Kermit","ketchup","kettle","key","keyboard","KFC","kidney","Kim Jong-un","kindergarten","king","King Kong","Kirby","kiss","kitchen","kite","kitten","kiwi","knee","kneel","knife","knight","knot","knuckle","koala","kraken","Kung Fu","label","laboratory","ladder","lady","Lady Gaga","ladybug","lake","lamb","lamp","landlord","landscape","lane","language","lantern","lap","laptop","Las Vegas","Lasagna","laser","lasso","laundry","lava","lava lamp","lawn mower","lawyer","leader","leaf","leak","leash","leather","leave","leech","Lego","legs","lemon","lemonade","lemur","lens","Leonardo da Vinci","Leonardo DiCaprio","leprechaun","lettuce","levitate","librarian","library","licorice","lid","lightbulb","lighter","lighthouse","lightning","lightsaber","lily","lilypad","limbo","lime","limousine","line","link","lion","Lion King","lips","lipstick","litter box","lizard","llama","loading","loaf","lobster","lock","log","logo","lollipop","London","London Eye","loot","loser","lotion","lottery","lounge","love","low","luck","luggage","Luigi","lumberjack","lung","lynx","lyrics","macaroni","machine","macho","Madagascar","mafia","magazine","magic","magic trick","magic wand","magician","magma","magnet","magnifier","maid","mailbox","mailman","makeup","mall","mammoth","manatee","manhole","manicure","mannequin","mansion","mantis","map","maracas","marathon","marble","margarine","marigold","Mario","Mark Zuckerberg","market","marmalade","marmot","Mars","marshmallow","mascot","mask","massage","match","matchbox","mattress","mayonnaise","mayor","maze","McDonalds","meal","meat","meatball","meatloaf","mechanic","Medusa","meerkat","megaphone","melon","melt","meme","Mercedes","Mercury","mermaid","message","messy","metal","meteorite","Mexico","Michael Jackson","Mickey Mouse","microphone","microscope","Microsoft","microwave","midnight","military","milk","milkman","milkshake","Milky Way","mime","Minecraft","miner","Miniclip","minigolf","Minion","minivan","Minotaur","mint","minute","mirror","missile","model","mohawk","mold","mole","Mona Lisa","Monday","money","monk","monkey","monster","Monster","Mont Blanc","moon","moose","mop","Morgan Freeman","morning","Morse code","Morty","mosquito","moss","moth","mothball","mother","motherboard","motorbike","motorcycle","Mount Everest","Mount Rushmore","mountain","mouse","mousetrap","mouth","movie","Mozart","Mr Bean","Mr Meeseeks","Mr. Bean","Mr. Meeseeks","MTV","mud","muffin","mug","Mummy","murderer","muscle","museum","mushroom","musket","mustache","mustard","nachos","nail","nail file","nail polish","napkin","narwhal","Nasa","NASCAR","nature","navy","neck","needle","neighbor","neighborhood","Nemo","Neptune","nerd","nest","Netherlands","network","New Zealand","newspaper","nickel","night","nightclub","nightmare","Nike","ninja","Nintendo Switch","noob","noodle","north","North Korea","Northern Lights","Norway","nose","nose hair","nose ring","nosebleed","nostrils","Notch","notebook","notepad","nothing","notification","novel","nugget","nuke","nun","nurse","nut","nutcracker","Nutella","nutmeg","nutshell","oar","Obelix","observatory","ocean","octagon","octopus","office","oil","Olaf","old","omelet","onion","open","opera","orange","orangutan","orbit","orca","orchestra","orchid","Oreo","organ","origami","ostrich","otter","outside","oval","overweight","owl","oxygen","oyster","Pac-Man","paddle","page","pain","paint","paintball","pajamas","palace","palette","palm","palm tree","pan","pancake","panda","panpipes","panther","pants","papaya","paper","paper bag","parachute","parade","parakeet","parents","Paris","park","parking","parrot","party","password","pasta","pastry","path","patient","patio","Patrick","patriot","pause","pavement","paw","Paypal","peace","peach","peacock","peanut","pear","peas","peasant","pedal","pelican","pencil","pencil case","pencil sharpener","pendulum","penguin","peninsula","penny","pensioner","Peppa Pig","pepper","pepperoni","Pepsi","perfume","periscope","person","pet food","pet shop","petal","pharmacist","Phineas and Ferb","photo frame","photograph","photographer","Photoshop","piano","Picasso","pickaxe","pickle","picnic","pie","pig","pigeon","piggy bank","pigsty","Pikachu","pike","pill","pillar","pillow","pillow fight","pilot","pimple","pin","pinball","pine","pine cone","pineapple","pink","Pink Panther","pinky","Pinocchio","pinwheel","pipe","pirate","pirate ship","pistachio","pistol","pitchfork","pizza","plague","planet","plank","plate","platypus","player","playground","Playstation","plow","plug","plumber","plunger","Pluto","pocket","pogo stick","point","poison","poisonous","poke","Pokemon","polar bear","policeman","pollution","polo","pond","pony","ponytail","poodle","poop","poor","popcorn","pope","Popeye","poppy","Popsicle","popular","porch","porcupine","Porky Pig","portal","portrait","Portugal","Poseidon","positive","postcard","poster","pot","pot of gold","potato","potion","pound","powder","prawn","pray","preach","pregnant","present","president","pretzel","price tag","priest","prince","princess","Pringles","printer","prism","prison","pro","procrastination","professor","programmer","promotion","protest","provoke","prune","pub","pudding","puddle","puffin","puma","Pumba","pumpkin","punishment","punk","puppet","purity","purse","puzzle","pyramid","quarter","queen","queue","quicksand","quill","quilt","quokka","raccoon","race","racecar","radar","radiation","radio","radish","raft","rail","rain","rainbow","raincoat","raindrop","rainforest","raisin","rake","ram","ramp","rapper","raspberry","rat","ravioli","razor","razorblade","read","reality","reception","receptionist","record","rectangle","recycling","red","red carpet","Reddit","reeds","referee","reflection","reindeer","relationship","religion","remote","repeat","reptile","rest","restaurant","retail","revolver","rewind","rhinoceros","rib","ribbon","rice","Rick","ring","ringtone","risk","river","roadblock","robber","Robbie Rotten","robin","Robin Hood","robot","rock","rocket","rockstar","roll","Romania","Rome","roof","room","rooster","root","rose","royal","rubber","ruby","rug","ruler","run","rune","Russia","sad","saddle","safari","safe","sailboat","salad","sale","saliva","salmon","salt","saltwater","Samsung","sand","sand castle","sandbox","sandstorm","sandwich","Santa","satellite","Saturn","sauce","sauna","sausage","saxophone","scar","scarecrow","scarf","scary","scent","school","science","scientist","scissors","Scooby Doo","scoop","score","Scotland","scream","screen","screw","scribble","scuba","sculpture","scythe","sea","sea lion","seafood","seagull","seahorse","seal","search","seashell","seasick","season","seat belt","seaweed","second","security","seed","seesaw","Segway","semicircle","sensei","server","sew","sewing machine","shadow","shake","shallow","shampoo","shape","shark","shaving cream","sheep","shelf","shell","Sherlock Holmes","shipwreck","shirt","shock","shoe","shoebox","shoelace","shop","shopping","shopping cart","short","shotgun","shoulder","shout","shovel","shower","Shrek","shrew","shrub","shy","sick","signature","silence","silo","silver","silverware","sing","Singapore","sink","sit","six pack","skateboard","skateboarder","skates","skeleton","ski","ski jump","skin","skinny","Skittles","skribbl.io","Skrillex","skull","skunk","sky","skydiving","skyline","Skype","skyscraper","slam","sledge","sledgehammer","sleep","sleeve","slide","slime","slingshot","Slinky","slippery","slope","sloth","slow","slump","smell","smile","smoke","snail","snake","sneeze","sniper","snow","snowball","snowball fight","snowboard","snowflake","snowman","soap","soccer","social media","socket","socks","soda","soil","Solar System","soldier","sombrero","son","Sonic","sound","soup","south","space","space suit","spaceship","spade","spaghetti","Spain","spark","sparkles","Spartacus","spatula","speaker","spear","spelunker","sphinx","spider","Spiderman","spin","spinach","spine","spiral","spit","spoiler","sponge","SpongeBob","spool","spoon","spore","sports","spray paint","spring","sprinkler","spy","square","squid","Squidward","squirrel","stab","stadium","stage","stamp","stand","stapler","star","Star Wars","starfish","starfruit","statue","Statue of Liberty","Steam","steam","Stegosaurus","step","stereo","Steve Jobs","sting","stingray","stomach","stone","Stone Age","stoned","stop sign","stork","storm","stove","straw","strawberry","streamer","street","stress","strong","student","studio","study","stylus","submarine","subway","Sudoku","Suez Canal","sugar","suitcase","summer","sun","sunburn","sunflower","sunglasses","sunrise","sunshade","Superman","supermarket","superpower","surface","surfboard","surgeon","survivor","Susan Wojcicki","sushi","swag","swamp","swan","swarm","sweat","sweater","swimming pool","swimsuit","swing","switch","sword","swordfish","Sydney Opera House","symphony","T-rex","table","table tennis","tablecloth","tablet","tabletop","taco","tadpole","tail","tailor","Tails","take off","talent show","tampon","tangerine","tank","tape","tarantula","target","Tarzan","taser","tattoo","taxi","taxi driver","tea","teacher","teapot","tear","teaspoon","teddy bear","telephone","telescope","Teletubby","television","temperature","tennis","tennis racket","tent","tentacle","Terminator","Tetris","text","The Beatles","thermometer","thief","thin","think","thirst","Thor","throat","throne","thug","thumb","thunder","thunderstorm","ticket","tickle","tie","tiger","time machine","timpani","tiny","tip","tiramisu","tire","tired","tissue","tissue box","Titanic","toad","toast","toaster","toe","toenail","toilet","tomato","tomb","tombstone","tongue","toolbox","tooth","Tooth Fairy","toothbrush","toothpaste","toothpick","top hat","torch","tornado","torpedo","tortoise","totem","toucan","touch","tourist","tow truck","towel","tower","Tower Bridge","Tower of Pisa","toy","tractor","traffic","traffic light","trailer","train","translate","trap","trapdoor","trash can","traveler","treadmill","treasure","tree","treehouse","trend","triangle","trick shot","tricycle","trigger","triplets","tripod","trombone","trophy","tropical","truck","truck driver","trumpet","tuba","tug","tumor","tuna","tunnel","turd","turkey","turnip","turtle","tuxedo","Tweety","twig","Twitter","type","udder","UFO","ukulele","umbrella","uncle","underground","underweight","undo","unibrow","unicorn","unicycle","uniform","universe","upgrade","Uranus","Usain Bolt","USB","vacation","vaccine","vacuum","valley","vampire","vanilla","vanish","Vatican","vault","Vault boy","vegetable","vegetarian","vein","Velociraptor","vent","Venus","vertical","veterinarian","victim","victory","video","video game","village","villain","Vin Diesel","vine","vinegar","viola","violence","violin","virtual reality","virus","vise","vision","vitamin","vlogger","vodka","volcano","volleyball","volume","vomit","voodoo","vortex","vote","vulture","vuvuzela","W-LAN","waffle","waist","waiter","wake up","walk","wall","Wall-e","wallpaper","walnut","walrus","warehouse","warm","wart","wasp","watch","water","water cycle","water gun","waterfall","wave","wax","weak","wealth","weapon","weasel","weather","web","website","wedding","welder","well","werewolf","west","western","whale","WhatsApp","wheel","wheelbarrow","whisk","whisper","whistle","white","wife","wig","wiggle","William Shakespeare","William Wallace","willow","wind","windmill","window","windshield","wine","wine glass","wing","wingnut","winner","Winnie the Pooh","winter","wire","wireless","witch","witness","wizard","wolf","Wolverine","Wonder Woman","wonderland","woodpecker","wool","work","workplace","world","worm","wound","wrapping","wreath","wrench","wrestler","wrestling","wrinkle","wrist","writer","x-ray","Xbox","Xerox","xylophone","yacht","yardstick","yawn","yearbook","yellow","yeti","Yin and Yang","yo-yo","Yoda","yogurt","yolk","Yoshi","young","Youtube","youtuber","zebra","Zelda","zeppelin","Zeus","zigzag","zipline","zipper","zombie","zoo","zoom","Zorro","Zuma"]
const wordListtr =   ["elma","armut","sünger","köfte","el feneri","iğne","daire","kumpir","direk","panda","kuyumcu","çekirge","kadeh","bilek","yemek yapmak","üşümek","üçgen","kök","cacık","taramak","bebek bezi","kaplumbağa","diyetisyen","çit","dinazor","kılıç balığı","havalimanı","huni","duymak","kokoreç","deniz","pirzola","böcek","ağ","kasiyer","kirpik","dökmek","aşure","timsah","kablo","tabut","porsuk","vazo","pervane","köstebek","turşu","kral","hamak","savaşmak","yatak","gece lambası","çizme","kaşık","yağmur","kanat","oda","dadı","savcı","ketçap","satranç","paket","dikmek","elek","puding","batmak","nar","böğürtlen","sıkmak","fotoğraf çekmek","yemek","pamuk şeker","bitki","tembel hayvan","prens","yorgan","gün","vurmak","sıcak","pencere","trafik","yalamak","japon balığı","pipo","yardım etmek","şamdan","yelpaze","sokak","baykuş","taşımak","pelerin","horlamak","karpuz","kahvaltı","oyuncak","kol saati","börek","alkışlamak","geçit","çiftçi","beyin","okul","bulmak","tırpan","saray","bok böceği","dinlenmek","kitap","tren","duvar","atlet","sucuk","marangoz","uçak","asfalt","çadır","veteriner","ceviz","bayılmak","gümüş","deniz anası","yanak","lavabo","bakmak","salyangoz","peçete","toka","dambıl","ay","yaprak","kuzu","buz","etek","hasta","marul","çaydanlık","şuşi","kurt","sarışın","otobüs","sinek","hurma","ayva","kaburga","alçı","yüzme","ataç","emzik","çimen","nane","robot","kilise","saksafon","güneş gözlüğü","papağan","şahin","kapatmak","masa tenisi","akciğer","dinamit","şifonyer","aşçı","tekne","pil","derin","hindistan cevizi","akbaba","uzun boylu","cumhurbaşkanı","kol","termos","kedi","ayçiçeği","küvet","rende","balta","kamera","diken","midilli","kereviz","ren geyiği","hediye","kasa","testere","altın","yönetmen","market","asansör","jaguar","baklava","kayak","pırasa","tırmanmak","erik","içli köfte","krep","ekran","casus","dondurma","hoparlör","üzgün","laptop","standyum","öğrenmek","kutu","çiftlik","tost","hançer","bez","su","külot","vatoz","kumanda","öpmek","meyve suyu","kütüphane","sörf","bulut","defter","gölet","düşünmek","şalgam","ananas","bale","polis","köprü","geyik","hardal","tavus kuşu","hap","zıplamak","ahtapot","çirkin","evlenmek","değiştirmek","akvaryum","toz","lolipop","el arabası","fıstık","kahraman","oğul","karnıbahar","pantolon","ayı","kek","el","inek","külübe","gaga","su böreği","kalp","tank","jant","parti","kel","heykel","araba","minder","yokuş","mısır","piramit","cep","karaciğer","hamam böceği","badem","önlük","sarımsak","kasap","panter","boz ayı","sonbahar","balık","patlamak","dolap","tüfek","dövme","öğrenci","sandalye","kürdan","barokoli","asklılık","gazoz","tavşan","ağaçkakan","sucuklu yumurta","telefon","bahar","ateş","adana kebap","erkek arı","ayakkabı","şapka","sürahi","salça","makas","güneşlenmek","ağaç","papatya","astronot","battaniye","dövüşmek","çekirdek","yakmak","büyücü","tohum","duş","tabanca","kamp","aile","şampanya","karınca","sakal","sabun","tepsi","karıncayiyen","elmas","tamirci","saat","nal","köpek","ayran","güçlü","delik","hortum","bere","tablo","ağlamak","kitaplık","koşmak","kahve","çay","bit","hamster","tebeşir","trafik ışığı","diş fırçası","atmak","kolye","şerit","yastık","halı","tencere","kunduz","oje","çorap","tiyatro","beyzbol","basketbol","futbolcu","futbol","kar","postacı","tuz","yonca","garaj","klavye","mantar","boyacı","şeftali","fil","sprey","abla","zarf","gül","kürek","leopar","komutan","buzdolabı","tatlı","şırınga","ada","pençe","piyano","kusmak","şişe","tarak","musluk","balon","klasör","vantilatör","zürafa","kapak","kulak","bilim adamı","cadde","tel","sihirbaz","ıspanak","tavuk","fırça","yıldız","pipet","kırık","çan","pizza","çamaşır makinesi","kale","köpek balığı","yunus","göz yaşı","açmak","göz","yazar","düşmek","tutkal","şemsiye","okyanus","patlıcan","bal kabağı","arı kovanı","çatı","uydu","para","palyaço","pide","kilit","böbrek","simit","baston","fırın","sülük","gazeteci","anten","oyun oynamak","tıklamak","golf","kaleci","düdük","temizlikçi","örümcek","rüzgar","flüt","tutmak","harita","zebra","kaz","bluz","izlemek","leğen","taksici","deve","girmek","kaza","muhabbet kuşu","mercimek çorbası","kimyager","karides","tırnak","süt","parfüm","aşık olmak","kibrit kutusu","çığ","baca","otel","ağ","sandal","yeşil elma", "çam ağacı","kaptan","fön makinesi","ocak","kızak","füze","kanca","basamak","gözlükçü","suşi","döner","kavun","yelek","yüzme havuzu","banyo","kova","muz","sosisli","atlamak","youtuber","pire","peruk","posta kutusu","ilaç","kağıt","kavanoz","ahır","şarkıcı","anne","büyüteç","donmak","martı","stadyum","tutulma","havuç","güvercin","demlik","kiremit","bölmek","aramak","deli","göstermek","dövmek","kukla","koala","kasırga","çamaşır makinasi","brokoli","beyaz çikolata","mürekkep balığı","doktor", "fasulye", "gökkuşağı", "mayonez", "güneş", "portakal", "tabela", "flamingo", "bilye", "tramvay", "mikroskop", "lastik", "gergedan", "limon", "madeni para", "tavla", "kap","dergi", "kelepçe", "çekiç", "arı", "katır", "koltuk", "asker", "nehir", "tornavida", "çöp", "domates", "hırka", "eğilmek", "kurye", "kaplan", "zemin", "top", "sürünmek", "deniz yıldızı", "sigara böreği", "müzisyen", "tuvalet kağıdı", "sırt çantası", "prenses", "kolsuz", "boru", "kardan adam", "bant", "baharat", "şömine", "nohut", "bulgur pilavı", "kestane", "soğuk", "mektup", "pati", "kazak", "korsan", "örümcek ağı", "sel", "krampon", "boya fırçası", "puro", "mendil", "kumbara","örtü","melek","modem", "kazanmak", "uçurtma", "tilki", "kerpeten", "peynir", "erkek kardeş", "eczane", "kapı kolu", "mercek", "çalı", "yatmak", "voleybolcu", "oklava", "kıvırcık", "enginar", "dalmak", "cerrah", "akrep", "çilek", "pasta", "benzin", "monitör", "bakıcı", "yumurta", "satır", "denizaltı", "kravat", "korna", "dart", "sandık", "ranza", "bağırsak", "priz", "çek", "çekmece", "kaydırak", "bıçak", "kepçe", "arkadaş", "pazarcı", "ekmek", "küpe", "hazine","silgi", "mutfak", "yaban arısı", "cadı", "zombi", "kahverengi", "kum", "pastacı", "gazete", "oy sandığı","salam", "sineklik", "patlamış mısır","oturmak", "abajur", "dudak", "kuyruk", "civciv", "manken", "ördek", "tuğla", "konuşmak","gökküşağı","at","uçmak", "raf", "küp", "külah", "dirsek", "leylek", "yılanbalığı", "oyuncak ayı", "uzaylı", "komidin", "gözlük", "fakir", "yol", "bacak", "yüzük", "ağustos böceği", "volkan", "sivrisinek", "almak", "bilgisayar mühendisi", "zırh", "hücre", "bisiklet", "çanta", "sarma", "koç", "poşet", "kalkmak", "kan", "spor", "şato", "buğday", "gezegen", "tesisatçı", "teleskop", "lamba", "gözyaşı", "basketbolcu", "sulamak", "kuğu", "koklamak", "soğan", "kutup ayısı", "fermuar", "bina", "göbek", "salon","ütü", "yat", "vampir", "saç", "mangal", "tuvalet", "balina", "jilet", "kule", "kış", "ikizler", "noel", "yağ", "fabrika", "kupa", "çikolata", "çerçeve", "taze fasulye", "kase", "itmek", "eşek", "kemik", "kalorifer", "merdiven", "kiraz", "karıştırmak", "sekreter", "prizma", "ergen", "boks","horoz", "kirpi", "rakun", "kafa", "şarkı söylemek", "büyümek", "tarla", "aslan", "taç", "şelale", "patlama", "kapı", "zincir", "bavul", "ambulans", "korkuluk", "çapa", "fotoğraf makinesi", "labirent", "bisküvi", "uğur böceği", "öksürmek", "kask", "cam", "mağara", "iskelet", "kuaför", "mühendis", "piyanist", "cips", "otopark", "goril", "tırmık", "dilim", "çiçekçi", "ayna", "spagetti", "saman", "et", "sütyen", "penguen", "sıcak çikolata", "kılıç", "çiğ köfte", "fotoğrafçı", "içmek", "omuz", "şempanze", "tava", "kıta", "viski","patates kızartması","ampul","tünel", "lama", "mezar", "kömür", "dağ", "yosun", "fare", "turp", "kafes", "zengin", "bulaşık makinesi", "orman", "terlemek", "reçel", "kirli", "topuklu ayakkabı", "gökyüzü", "helikopter", "kolluk", "çamur", "bebek arabası", "cep telefonu", "makarna", "tavuk döner", "çizgi", "öğretmen", "biftek", "kavurma", "sakız", "midye", "salata", "ağız","raket", "rimel", "kuru fasulye", "baba", "ekler", "jet", "ceket", "şimşek", "uyumak", "kumsal", "topuklu ayakkabı", "beşik", "sevmek", "masa", "keçi", "fener", "göl", "meteor", "kart", "dansçı", "maydanoz", "itfaiyeci"]//ekleme yapılacak
const wordListaz =   ["salat", "corab","cırcırama", "hörümçək", "ördək", "lampa", "əqrəb", "kitab", "şir", "yumurta", "meymun", "mətbəx", "bozbaş", "su", "fil", "kirpi", "sasiska", "bayraq", "plov", "gül", "feyxoa", "yemiş", "fındıq", "begamot", "soyuducu", "duz","inək", "dəniz atı", "telefon", "lupa", "timsah", "tovuzquşu", "kabab", "banan", "ayaqqabı", "gitara", "limon", "at", "maral", "əjdaha", "bayquş", "siçan" ,"roket", "ayran", "gilas"]
let regex = /^$/
let possibleWords = []
/* let clearWordStop = false
function clearWord() {
   // if(autoanswer==true){
    if(clearWordStop==true){
        clearWordStop = false
            let isinput = document.querySelector('input[name="answer"]').disabled;
     if(isinput==true){
         clearWordStop = true
     clearWord();
     }
    $('#kemlimelistesi button').remove();
    const container = document.querySelector("#kemlimelistesi")
    if(lang == "8"){
  possibleWords = wordListtr
}else if(lang == "23"){
      possibleWords = wordListaz
    }else{
    possibleWords = wordListen
    }
    for (let i = 0; i < possibleWords.length; i++) {
    const button = document.createElement("button")
    button.innerHTML = possibleWords[i];
    button.setAttribute("onclick","navigator.clipboard.writeText('" + possibleWords[i] + "'); this.style.backgroundColor = 'red'; this.style.color = 'white';");
    button.setAttribute("style", "margin-top:10px;font-size:100%;text-align:center;background-color:Grey;border-radius:8px;  min-width: 15ch;min-height: 20px;box-shadow:03px 5px rgba(0, 0, 0, 0.18);display:flex;");
  //  button.addEventListener("click", selectWord)
    container.appendChild(button)
    }
  }
  //  }
}*/
function processCurrentWord() {
   // clearWordStop = true
    $('#kemlimelistesi button').remove();
    var InputText1 = $('.word:eq(0)').html()
    var InputText2 = $('.word:eq(1)').html() || ""
    var InputText3 = $('.word:eq(2)').html() || ""
    var InputText4 = $('.word:eq(3)').html() || ""
    if(!InputText2 == ""){
    InputText1 += " ";
    }else if(!InputText3 == ""){
     InputText2 += " ";
    }else if(!InputText4 == ""){
     InputText3 += " ";
    }
    var text = InputText1 + InputText2 + InputText3 + InputText4;
    var currWord = text.replace(/<span><\/span>/gi, "_").replace(/<span>/gi, "").replace(/<\/span>/gi, "").replace(/<div class="word">/gi, "").replace(/<\/div>/gi, "");//.replace("undefined","");
//console.log("currWord: " + currWord);
    //const currWord = currentWord.innerHTML
const container = document.querySelector("#kemlimelistesi")
  let regexStr = "^"

  for (let i = 0; i < currWord.length; i++) {
    const char = currWord[i]

    if (char === "_")
      regexStr += "\\w"
    else if (char === "." || char === "/")
      regexStr += "\\" + char
    else
      regexStr += char
  }

  regexStr += "$"

  regex = new RegExp(regexStr, "i")
if(lang == "8"){
  possibleWords = wordListtr.filter(word => regex.test(word))
}else if(lang == "23"){
      possibleWords = wordListaz.filter(word => regex.test(word))
    }else{
    possibleWords = wordListen.filter(word => regex.test(word))
    }
  //possibleWords = wordList.filter(word => regex.test(word))
   // console.log(possibleWords);
    for (let i = 0; i < possibleWords.length; i++) {
    const button = document.createElement("button")
    button.innerHTML = possibleWords[i];
    button.setAttribute("onclick","navigator.clipboard.writeText('" + possibleWords[i] + "'); this.style.backgroundColor = 'red'; this.style.color = 'white';");
    button.setAttribute("style", "margin-top:10px;font-size:100%;text-align:center;background-color:Grey;border-radius:8px;  min-width: 15ch;min-height: 20px;box-shadow:03px 5px rgba(0, 0, 0, 0.18);display:flex;");
  //  button.addEventListener("click", selectWord)
    container.appendChild(button)
  }
    // $('#kemlimelistesi button').attr("style", "margin-top:10px;font-size:100%;text-align:center;background-color:Grey;border-radius:8px;  min-width: 15ch;min-height: 20px;box-shadow:03px 5px rgba(0, 0, 0, 0.18);display:flex;"); //
   // $('#kemlimelistesi').append('<button type="button" onclick="alert(\'Hello world!\')">' + possibleWords.push() + '</button>');
  //chrome.runtime.sendMessage({type: "updatePossibleWords", words: possibleWords})
}

function showfullscreen() {
//Full screen
document.fullscreenEnabled =
	document.fullscreenEnabled ||
	document.mozFullScreenEnabled ||
	document.documentElement.webkitRequestFullScreen;

function requestFullscreen(element) {
	if (element.requestFullscreen) {
		element.requestFullscreen();
	} else if (element.mozRequestFullScreen) {
		element.mozRequestFullScreen();
	} else if (element.webkitRequestFullScreen) {
		element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
	}
}

if (document.fullscreenEnabled) {
	requestFullscreen(document.documentElement);
}
      if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
    function read(url) {
    return new Promise(resolve => {
        fetch(url).then(res => res.text()).then(res => {
            return resolve(res);
        });
    });
};
//end
}