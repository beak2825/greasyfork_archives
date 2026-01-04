// ==UserScript==
// @name           Pokec.sk - Sifrovanie NEW
// @description    Vyvoleni vedia medzi sebou komunikovat sifrovane prostrednictvom servera
// @namespace      Pokec.sk
// @include        http://pokec-sklo.azet.sk/miestnost/*
// @date           2017-07-16
// @author         Pulo15, MerlinSVK
// @icon           http://s.aimg.sk/pokec_base/css/favicon.ico
// @require        https://cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.0/spectrum.min.js
// @resource       specCSS https://cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.0/spectrum.min.css
// @version        3.8
// @license        MIT
// @grant          GM_addStyle
// @grant          GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/31258/Pokecsk%20-%20Sifrovanie%20NEW.user.js
// @updateURL https://update.greasyfork.org/scripts/31258/Pokecsk%20-%20Sifrovanie%20NEW.meta.js
// ==/UserScript==

// #version 3.0 - token nahradeny nahodnymi slovami
// #version 3.1 - rozsirena zasoba slov + pridany ukoncovatel vety
// #version 3.2 - opravy preklepov v slovnej zasobe + rozsirenie slovnej zasoby
// #version 3.3 - pridane upozornenie pri pisani sifrovanej spravy na sklo odosielatelovi
// #version 3.4 - vylepsene upozornenie pri pisani sifrovanej spravy na sklo odosielatelovi
// #version 3.5 - bug fixes and improvements
// #version 3.6 - aktualizovany color picker, novy blinker, upravene nastavenia, slovna zasoba
// #version 3.7 - pridana moznost posielat v sifrach obrazky, potvrdzovanie odosielania sprav
//              - bug fixy
// #version 3.8 - zafixovany bug s prebliknutim skla pri zapinani a vypinani sifrovania 

var encTag = "^^^", form = $("#odosielac"), LS = localStorage, AZevent = form.data("events").submit[0].handler, elm_messageText = $("#messageText");

var specCSS = GM_getResourceText("specCSS");
var specCSS_custom =
    ".sp-dd{display:none}"+
    ".sp-preview,.sp-replacer{border:0; border-radius:3px}"+
    ".sp-preview{width:28px; height:16px}"+
    ".sp-preview-inner{border:1px solid #ccc; border-radius:3px}"+
    ".sp-replacer{background:0 0; margin:0}";

var settings_css =
    "#blTimer,div.c_jadro p input {height:16px; font-size:11px; border-radius:3px; border-color:#ccc}"+
    "div.c_jadro p input {color:#006; margin-left: 10px; width:225px; padding:0 2px}"+
    "div.c_jadro table {border:1px solid #ccc; border-collapse:collapse; width:100%; height:45px; margin-bottom:10px}"+
    "div.c_jadro table th>span {color:#3e7e17; font-size:11px; font-weight:400}"+
    "#blTimer, div.c_jadro table td {text-align:center}"+
    ".right_border {border-right:1px solid #ccc}"+
    "#blTimer {width:20px; padding:2px 0 0 2px}"+
    "#blTimer~span {font-size:11px; padding-left:2px}"+
    "#settings, #picbox {cursor:pointer; color:#262830; width:10px; height:10px}";


var blinking_css =    ".blinking_bg {animation:blinking_bg _blink_time_s; -moz-animation:blinking_bg _blink_time_s infinite; -webkit-animation:blinking_bg _blink_time_s infinite;}"+
    "@keyframes         blinking_bg {0% {background:_blink_from_} 25% {background:_blink_to_} 50% {background:_blink_to_} 100% {background:_blink_from_}}"+
    "@-moz-keyframes    blinking_bg {0% {background:_blink_from_} 25% {background:_blink_to_} 50% {background:_blink_to_} 100% {background:_blink_from_}}"+
    "@-webkit-keyframes blinking_bg {0% {background:_blink_from_} 25% {background:_blink_to_} 50% {background:_blink_to_} 100% {background:_blink_from_}}";
var blinking_css_copy;

var kto = ["tuli","dedo","baba","otec","mama","sestra","brat","teta","ujo","svagor","svagrina","bratranec","sesternica","stryko","nevesta","synovec","neter","sused","suseda","kamarat","kamaratka","kolega","kolegyna","manzelka","frajerka","fero","milan","jany","pista","laco","jozo","sergej","duro","cyril","rolo","imrich","robo","mirec","peto","dusan","adam","stano","gejza","henrich","adolf","drahus","damian","vojtech","metod","alfred","vasil","tono","vlasto","jozefina","anezka","ursula","frederika","frantiska","mariena","kamila","henrieta","zuza","barbara","milena","galina","beata","marcela","hedviga","iveta","dajana","danica","tamara","tereza","angelika","justina","klara","zaneta","jolana","anca","margareta","sona","regina","dora","laura","marta","antonia","dora","elena","ivana","eleonora","alzbeta","amalia","fiona","gertuda","olga","magda"];
var ako = ["rychlo","tvrdo","smiesne","nudne","nevedome","tajne","pomaly","tazko","lahko","nacierno","hladko","hlasno","potichu","trapne","sifrovane","hanblivo","zaujimavo","kruto","zamietavo","stastne","nahnevane","rozculene","krivo","ostro","choro","tazkopadne","zurivo","nehanebne","drazdivo","nemilosrdne","bezradne","beznadejne","blazene","uspokojivo","elegantne","vynimocne","casto","nasilu","nechutne","znechutene","neodolatelne","cudne","inteligentne","poucne","premilene","paralizovane","unavene","pracovne","sluzobne","rekreacne","namahavo","jednoducho","primerane","namakane","bezhlavo","tvrdohlavo","nebojacne","odhodlane","vytrvalo","namyslene","zhulene","opovazlivo","obetavo","drzo","nenapadne","retardovane","povysenecky","marnotratne","sebavedome","umyselne","nedbanlivo","neovladatelne","nekompromisne","vznesene"];
var corobi = ["vari","upratuje","spi","obeduje","veceria","ranajkuje","pozera","pocuva","maluje","cita","pise","ohovara","nakupuje","skusa","spehuje","napodobnuje","riskuje","tlaci","fuka","obtazuje","rozmysla","upozornuje","striela","soferuje","provokuje","vykrikuje","buzeruje","lesti","umyva","fetuje","drazdi","nafukuje","rozobera","otaca","rozbija","provokuje","napomina","cisti","posuva","sifruje","zdviha","lame","zhadzuje","nahana","picha","opluva","prekopava","betonuje","stavia","menezuje","reze","opeka","griluje","mixuje","nastavuje","pripevnuje","prilakava","odpudzuje","sekiruje","vyhladzuje","trha","uraza","nahovara","prehovara","obvinuje","hladi","vonia","kritizuje","napada","bije","nici","kazi","facka","kope","lize"];
var skym = ["s bicyklom","s lopatou","s pilkou","s kolobezkou","s tankom","s vankusom","s autobusom","s nozikom","s pocitacom","s mikrofonom","s televizorom","s ponozkami","s kazetami","s okuliarmi","s tlacenkou","s drevom","s jogurtom","s pivom","s poldecakom","so sekerou","s katanou","s petardou","s cesnakom","s kladivom", "s plastelinou","s paradajkami","s potkanom","s mraznickou","s gramofonom","s petrolejom","s benzinom","s kartonom","s popolom","s ladom","s hrebenom","s detonatorom","s brokovnicou","s mecom","s chrumkami","s haluskami","s blatom","s uhorkou","s miesackou","s petrzlenom","s tuniakom","s balonom","s varechou","s priborom","s obuvakom","s palicou","s kamenom","s roxorom","s furikom","s puskou"];
var co = ["komin","monitor","dataprojektor","mobil","radio","knihu","odpad","zumpu","pracku","gitaru","penazenku","tortu","zemlovku","budovu","opasok","utierky","zachod","cukriky","zmrzlinu","fujaru","kolajnice","osusku","byka","muchotravku","dazdnik","sporak","pivo","kotol","kefu","lavor","batoh","hodinky","koberec","misku","zaclonu","zapalovac","hadicu","vedro","lavicku","samolepky","klinec","zosit","klavesnicu","syfon","zapalky","sviecku","kompot","banan","pneumatiku","kvetinac","predlzovacku","podlahu","savo","krekry","kavovar","digestor","satnik","ovladac","sluchadla","pero","hrable","megafon","vrtak","karfiol","zvoncek","klavir","puding","odstavovac","buldozer","ventilator","zosilnovac","jukebox","loptu"];
var predlozky = ["pred","pod","za","nad"];
var cim = ["budovou","papucou","schodami","strechou","oknami","stromom","elektrickou","polystyrenom","perinou","nohami","lampu","svetlom","cestou","tatrami","smetiskom","lesom","odpadom","sprchou","stodolou","mesiacom","dazdom","alkoholom","mrakom","studnou","branou","dverami","zemou","kopcom","dedinou","vodou","pustou","jazerom","plynomerom","elektromerom","benzinkou","pobrezim","vratnicou","cintorinom","nemocnicou","kinom","heliportom","pivnicou","poschodim","vytahom","kanalom","fontanou","parkom","podiom","vezou","kamionom","traktorom","bagrom","bazenom","vysielacom","namestim","ambulanciou","postarkou","susedmi","balkonom","lavinou","ohniskom","restauraciou","krcmou","drogeriou","policiou","vojakmi"];
var pokrac = ["a","ale","no","tak","ba aj","lenze","aj","ked","kym","preto","zato","medzi tym","tak naco","takze","cize","taktiez"];
var koniec = [".","?","!","..."];

function antiRefresh()
{
    if (document.getElementById("antiRefreshMod") === null) {
        var antiRefreshMod = '$(window).off("popstate")';
        var script = document.createElement("script");
        script.id = "antiRefreshMod";
        script.appendChild(document.createTextNode(antiRefreshMod));
        (document.body || document.head || document.documentElement).appendChild(script);
    }
}

function switchEvent(status)
{
    if (status == "on"){
        form.off("submit").on("submit",sendServer.check);
    }
    else {
        form.off("submit").on("submit",function(e){
            $.proxy(AZevent,form)(e);
            return false;
        });
    }
}

function insertModFunc()
{
    if (document.getElementById("msgBoxMod") === null) {
        var msgBoxMod = 'function azetMsgBox_escKey(a){"27"==a.keyCode&&$(".azmsgbox p.css_xkruh > a").click(),a.stopPropagation()}';
        var script = document.createElement("script");
        script.id = "msgBoxMod";
        script.appendChild(document.createTextNode(msgBoxMod));
        (document.body || document.head || document.documentElement).appendChild(script);
    }
}

function removeModFunc()
{
    $("#msgBoxMod").remove();
}

function closeAZboxes(){
    if ($("div.azmsgbox").length > 0){
        $("div.azmsgbox").remove();
    }
}

function validateKey(key)
{
    var numbers = key.match(/\d+/g);
    var letters = key.match(/[a-zA-Z]+/g);

    if (key === "" || key == "undefined"){
        sendMessage.showError("Nemáš nastavené heslo!");
        return false;
    }
    else {
        if (numbers !== null && letters === null){
            sendMessage.showError("Heslo musí obsahovať aj písmená!");
            return false;
        }
        else return true;
    }
}

var sendServer = {
    "sendMsg":function(){
        var input = elm_messageText.val();
        input = input.replace(/<{1}[^<>]{1,}>{1}/g,"");
        if (input === ""){
            sendMessage.showError("Šifra musí obsahovať text!");
            return false;
        }
        var key = LS.getItem("pass");
        var validkey = validateKey(key);
        if (!validkey) return false;
        var identifikator = kto[Math.floor(Math.random()*kto.length)]+" "+ako[Math.floor(Math.random()*ako.length)]+" "+corobi[Math.floor(Math.random()*corobi.length)]+" "+skym[Math.floor(Math.random()*skym.length)]+" "+co[Math.floor(Math.random()*co.length)]+" "+predlozky[Math.floor(Math.random()*predlozky.length)]+" "+cim[Math.floor(Math.random()*cim.length)]+" "+pokrac[Math.floor(Math.random()*pokrac.length)]+" "+kto[Math.floor(Math.random()*kto.length)]+" "+ako[Math.floor(Math.random()*ako.length)]+" "+corobi[Math.floor(Math.random()*corobi.length)]+" "+skym[Math.floor(Math.random()*skym.length)]+" "+co[Math.floor(Math.random()*co.length)]+" "+predlozky[Math.floor(Math.random()*predlozky.length)]+" "+cim[Math.floor(Math.random()*cim.length)]+koniec[Math.floor(Math.random()*koniec.length)];

        $.ajax({
            type:"POST",
            url:LS.getItem("server") + "index.php",
            timeout: 8000,
            data:{ident:identifikator,pass:key,msg:input,akcia:"vloz"},
            success: function(data){
                elm_messageText.val(encTag + " " + identifikator);
                switchEvent("off");
                $("#odosielac").submit();
                switchEvent("on");
            },
            error: function(error){
                insertModFunc();
                closeAZboxes();
                azetMsgBox('alert',{title:'Odoslanie šifrovanej správy',text:"<p><span style='color:#CC0033'>Unable to send message to server!</span>"+'</p><br>',okButton:"Zavrieť"});
                removeModFunc();
                return false;
            }
        });
        return false;
    },
    "check":function(){
        if (LS.getItem("confirm_send") == "true"){
            insertModFunc();
            closeAZboxes();
            azetMsgBox('confirm',{title:'Upozornenie',text:'<p><b>Naozaj chceš odoslať túto šifrovanú správu?</b></p><br>',yesButton:'Áno',noButton:'Nie'},function(callback){
                if (callback){
                    sendServer.sendMsg();
                }
                else { }
            });
            removeModFunc();
            return false;
        }
        else {
            sendServer.sendMsg();
            return false;
        }
    }
};

function openIdent()
{
    var msgs = $(".prispevok > span:contains('"+encTag+"')");
    var key = LS.getItem("pass");
    var encMsgs = msgs.contents().filter(function(){
        return this.nodeType == Node.TEXT_NODE;
    });
    encMsgs.closest(".dd").css({
        "color":LS.getItem("fgcolor"),
        "background":LS.getItem("bgcolor"),
    }).attr("data-enctag",encTag);

    for (i = 0; i < msgs.length; i++){
        $(".prispevok > span:contains('"+encTag+"')").attr({"id":$(encMsgs[i]).text().replace(encTag,"").replace(" ",""),"title":"Klikni pre zobrazenie dešifrovanej správy."});
        $(".prispevok > span:contains('"+encTag+"')").css({"cursor":"pointer"});
        $(".prispevok > span:contains('"+encTag+"')").on("click",function(){

            sendMessage.showError("Načítava sa požiadavka...");

            var msg = "";
            $.ajax({
                type:"POST",
                dataType: "json",
                url:LS.getItem("server") + "index.php",
                data:{ident:this.id,pass:key,akcia:"nacitaj"},
                timeout: 8000,
                success: function(response){
                    msg = JSON.stringify(response).replace('"',"").replace('"',"");
                    insertModFunc();
                    closeAZboxes();
                    azetMsgBox('alert',{title:'Dešifrovaná správa',text:msg+'</p><br>',okButton:"Zavrieť"});
                    removeModFunc();
                },
                error: function(error){
                    insertModFunc();
                    closeAZboxes();
                    azetMsgBox('alert',{title:'Dešifrovaná správa',text:"<p><span style='color:#CC0033'>Unable to connect to server!</span>"+'</p><br>',okButton:"Zavrieť"});
                    removeModFunc();
                },
            });
        });
        encMsgs[i].nodeValue = $(encMsgs[i]).text().replace(encTag,"").replace(" ","");
    }
}

function createPickers(){
    $("#fgColor").spectrum({
        preferredFormat:"hex3",
        showInput:true,
        showAlpha:true,
        cancelText:"Zrušiť",
        chooseText:"Uložiť",
        change:function(color){
            LS.setItem("fgcolor",color);
            $('div[data-enctag="'+encTag+'"]').css("color",color);
            sendMessage.showError("Farba textu bola uložená.");
            return false;
        }
    })
        .spectrum("set",LS.getItem("fgcolor"));
    $(".sp-replacer")[0].setAttribute("title","Farba textu");

    $("#bgColor").spectrum({
        preferredFormat:"hex3",
        showInput:true,
        showAlpha:true,
        cancelText:"Zrušiť",
        chooseText:"Uložiť",
        change:function(color){
            LS.setItem("bgcolor",color);
            $('div[data-enctag="'+encTag+'"]').css("background",color);
            sendMessage.showError("Farba pozadia bola uložená.");
            return false;
        }
    })
        .spectrum("set",LS.getItem("bgcolor"));
    $(".sp-replacer")[1].setAttribute("title","Farba pozadia");

    $("#blColor1").spectrum({
        preferredFormat:"hex3",
        showInput:true,
        showAlpha:true,
        cancelText:"Zrušiť",
        chooseText:"Uložiť",
        change:function(color){
            LS.setItem("bl_color1",color);
            blinker.reload();
            sendMessage.showError("Farba blinkeru č. 1 bola uložená.");
            return false;
        }
    })
        .spectrum("set",LS.getItem("bl_color1"));
    $(".sp-replacer")[2].setAttribute("title","1. farba blinkeru");

    $("#blColor2").spectrum({
        preferredFormat:"hex3",
        showInput:true,
        showAlpha:true,
        cancelText:"Zrušiť",
        chooseText:"Uložiť",
        change:function(color){
            LS.setItem("bl_color2",color);
            blinker.reload();
            sendMessage.showError("Farba blinkeru č. 2 bola uložená.");
            return false;
        }
    })
        .spectrum("set",LS.getItem("bl_color2"));
    $(".sp-replacer")[3].setAttribute("title","2. farba blinkeru");

    $("#blTimer").val(LS.getItem("bl_timer"));
}

var blinker = {
    'on':function(){
        blinker.loadParams();
        if ($("#blinking_css").length === 0)
            $("<style>"+blinking_css_copy+"</style>").attr("id","blinking_css").appendTo(document.head);
        blinker.toggle();
    },
    'off':function(){
        blinker.toggle();
        $("#blinking_css").remove();
    },
    'toggle':function(){
        elm_messageText.toggleClass("blinking_bg");
    },
    'loadParams':function(){
        var color_from    = LS.getItem("bl_color1");
        var color_to      = LS.getItem("bl_color2");
        var timer         = LS.getItem("bl_timer");
        blinking_css_copy = blinking_css.replace(/_blink_time_/g,timer).replace(/_blink_from_/g,color_from).replace(/_blink_to_/g,color_to);
    },
    'reload':function(){
        if ($("#blinking_css").length){
            blinker.off();
            blinker.loadParams();
            blinker.on();
        }
    }
};

function validImage(url,imagev){
    var img = new Image();
    img.onload = function() { imagev(true); };
    img.onerror = function() { imagev(false); };
    img.src = url;
}

function addGUI()
{
    var cryptButton = '<a id="sifrovanie" href="#" title="Zapnúť / Vypnúť" class="piskotka">Šifrovanie</a>';
    //var settingsButton = '<span class="pi-setup" id="settings" title="Nastavenie šifrovania"></span>';

    var settingsButton = '&nbsp;<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAt0lEQVR42o3RtV0DURwH8C9VmOJ18Q0yAtKHFfK57kaCQY7MQYVLdRUuP9whT/5uAiwDit3c4rPU2KYJ6NrP7YJJpGPo2HJvx9RM4yq3CTWN5D6aDkvWhXHuNvD53oaLk/VowYr2RXGc+2zYRgqgEqEztUFuHSrGKqDomYtADaAWB3M9hV37rsIeGwAYhLt3Fc3uAgZFV/NXCpj9XuQCbb4O6uLnQb2PekNl+/uoPy+r931Z/677AdE4fhquEE5vAAAAAElFTkSuQmCC" id="settings" title="Nastavenia šifrovania">';
    var picButton = '&nbsp;&nbsp;&nbsp;<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAQAAAC8EZeQAAABDUlEQVR42oXRA4zXcQBA8U/WzKZs27bt5i3PbL4h2zWvWWnMtm3b9eMUb7j7+72vDZ4JRCUMvOCn27baltettthqqxsCQlsUoor6amOdiNBWhZjvqV3qlBpY3QF/vNfImsyBVTVUVWWmOKNMjewV57pnpkzqqkrmwJk+CX0wCcAgS9Ulc+A0Xxwy2EkfjAX9PPbHqsq33mKSz45rjBYueGuE3h65Y7fEcjWsFfHdLe+d1ATQxmXvPHdbd7WtkyqzTcg3f5zSDADtXfXHElDXRpF3fvDTNS1k0tENj/UH9Wz2249CX9jJLQ/1AXXtFfLTTRtszHKdY/54ZLMN1rsq4KVYKskyFQlE0vJy7PVfCx2S+40iOq0AAAAASUVORK5CYII=" id="picbox" title="Vložiť obrázok">';
    var checkbox = '<a id="confirmCheck" href="#" title="Zapína a vypína potvrdzovanie odosielania správ" class="piskotka vsetko">Potvrdzovanie</a>';

    if (LS.getItem("fgcolor") === null) { LS.setItem("fgcolor","#FFF"); }
    if (LS.getItem("bgcolor") === null) { LS.setItem("bgcolor","#CC0000"); }
    if (LS.getItem("bl_color1") === null) { LS.setItem("bl_color1","#FFF"); }
    if (LS.getItem("bl_color2") === null) { LS.setItem("bl_color2","#F00"); }
    if (LS.getItem("bl_timer") === null) { LS.setItem("bl_timer","3"); }
    if (LS.getItem("confirm_send") === null) { LS.setItem("confirm_send","false"); }

    GM_addStyle(specCSS);
    GM_addStyle(specCSS_custom);
    GM_addStyle(settings_css);

    var htmlString = cryptButton + '&nbsp; <span id="encControls" style="display:none">'+ settingsButton + picButton + checkbox +'</span>';
    document.getElementById("skloNapoveda").insertAdjacentHTML("afterend",htmlString);

    $("#sifrovanie").on("click",function(){
        $(this).toggleClass("aktivna");
        if ($(this).hasClass("aktivna")){
            switchEvent("on");
            $("#encControls").fadeIn(250,"swing");
            blinker.on();
            $("#messageText").attr("maxlength","500");
            sendMessage.showError("Správa sa odošle šifrovane.");
        } else {
            switchEvent("off");
            $("#encControls").fadeOut(250,"swing");
            blinker.off();
            $("#messageText").attr("maxlength","250");
        }
    });

    if (LS.getItem("confirm_send") == "true")
        $("#confirmCheck").toggleClass("aktivna");
    $("#confirmCheck").on("click",function(){
        $(this).toggleClass("aktivna");
        if ($(this).hasClass("aktivna")){
            sendMessage.showError("Potvrdzovanie správ zapnuté.");
            LS.setItem("confirm_send","true");
        }
        else {
            sendMessage.showError("Potvrdzovanie správ vypnuté.");
            LS.setItem("confirm_send","false");
        }
    });

    $("#settings").on("click",function(){
        insertModFunc();
        closeAZboxes();
        azetMsgBox('confirm',{
            title:'Nastavenie Šifrovania',
            text:'<p><input type="text" placeholder="URL šifrovacieho servera" id="serverurl" value="'+ LS.getItem("server") +'" autocomplete="off" maxlength="150"></p>'+
            '<br>'+
            '<p><input type="password" placeholder="šifrovacie heslo" id="heslo" value="'+ LS.getItem("pass") +'" autocomplete="off" maxlength="150"></p>'+
            '<br>'+
            '<center><a href="'+ LS.getItem("server") +'web/" target="_blank"><button type="button">WEBOVÉ ROZHRANIE</button></a></center>'+
            '<br>'+
            '<table>'+
            '<tr><th colspan="2" class="right_border"><span>Farby šifrovaných správ</span></th><th colspan="3"><span>Farby blinkeru</span></th></tr>'+
            '<tr>'+
            '<td><input id="fgColor" type="color"/></td><td class="right_border"><input id="bgColor" type="color"/></td>'+
            '<td><input id="blColor1" type="color"/></td><td ><input id="blColor2" type="color"/></td><td><input id="blTimer" title="Trvanie blikania (v sekundách)" maxlength="2" type="text"/><span>s</span></td>'+
            '</tr>'+
            '</table>',
            yesButton:'Uložiť',
            noButton:'Zrušiť'
        },function(callback){
            if (callback) {
                LS.setItem("server",$("#serverurl").val());
                LS.setItem("pass",$("#heslo").val());
                LS.setItem("bl_timer",$("#blTimer").val());
                blinker.reload();
            }else{ }
        });
        createPickers();
        removeModFunc();
    });

    $("#picbox").on("click", function(){
        insertModFunc();
        closeAZboxes();
        azetMsgBox('confirm',{
            title:'Odoslať obrázok v šifre',
            text:'<br><p><input type="text" placeholder="URL obrázku" id="imgurl" autocomplete="off" maxlength="500"></p><br>',
            yesButton:'Odoslať',
            noButton:'Zrušiť'
        },function(callback){
            if (callback) {
                validImage($("#imgurl").val(), function(exists) {
                    if(!exists) { alert("Nesprávna URL!");
                                 return false; }

                    var key = LS.getItem("pass");
                    var identifikator = kto[Math.floor(Math.random()*kto.length)]+" "+ako[Math.floor(Math.random()*ako.length)]+" "+corobi[Math.floor(Math.random()*corobi.length)]+" "+skym[Math.floor(Math.random()*skym.length)]+" "+co[Math.floor(Math.random()*co.length)]+" "+predlozky[Math.floor(Math.random()*predlozky.length)]+" "+cim[Math.floor(Math.random()*cim.length)]+" "+pokrac[Math.floor(Math.random()*pokrac.length)]+" "+kto[Math.floor(Math.random()*kto.length)]+" "+ako[Math.floor(Math.random()*ako.length)]+" "+corobi[Math.floor(Math.random()*corobi.length)]+" "+skym[Math.floor(Math.random()*skym.length)]+" "+co[Math.floor(Math.random()*co.length)]+" "+predlozky[Math.floor(Math.random()*predlozky.length)]+" "+cim[Math.floor(Math.random()*cim.length)]+koniec[Math.floor(Math.random()*koniec.length)];
                    var input = "<center><hr><br><img src='"+ $("#imgurl").val() +"' style='width:200px;height:150px;cursor:pointer' onclick='window.open(this.src)' target='_blank'></center>";
                    elm_messageText.val(encTag + " " + identifikator);

                    $.ajax({
                        type:"POST",
                        url:LS.getItem("server") + "index.php",
                        timeout: 8000,
                        data:{ident:identifikator,pass:key,msg:input,akcia:"vloz"},
                        success: function(data){
                            elm_messageText.val(encTag + " " + identifikator);
                            switchEvent("off");
                            $("#odosielac").submit();
                            switchEvent("on");
                        },
                        error: function(error){
                            insertModFunc();
                            closeAZboxes();
                            azetMsgBox('alert',{title:'Odoslanie šifrovaného obrázka',text:"<p><span style='color:#CC0033'>Unable to send picture to server!</span>"+'</p><br>',okButton:"Zavrieť"});
                            removeModFunc();
                            return false;
                        }
                    });
                    return false;
                });
            }else{ }
        });
        removeModFunc();
    });
}

antiRefresh();
$(document).ready(addGUI);
$("#sklo").on("DOMNodeInserted",function(e){if($(e.target).hasClass("sprava")){openIdent();}});
$("#sklo").on("DOMNodeRemoved",function(e){if($(e.target).hasClass("sprava")){openIdent();}});