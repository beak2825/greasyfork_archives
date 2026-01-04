// ==UserScript==
// @name         БОТ ДЛЯ ГЕРОЕВ
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       ANDRU
// @match        *://*.meni.mobi/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404368/%D0%91%D0%9E%D0%A2%20%D0%94%D0%9B%D0%AF%20%D0%93%D0%95%D0%A0%D0%9E%D0%95%D0%92.user.js
// @updateURL https://update.greasyfork.org/scripts/404368/%D0%91%D0%9E%D0%A2%20%D0%94%D0%9B%D0%AF%20%D0%93%D0%95%D0%A0%D0%9E%D0%95%D0%92.meta.js
// ==/UserScript==

(function(window, undefined) {

    var w;
    if (typeof unsafeWindow != "undefined") {
        w = unsafeWindow
    } else {
        w = window;
    }
    if (w.self != w.top) {
        return;
    }

    if (/http(s)?:\/\/[a-z]?[a-z]?.meni.mobi/.test(w.location.href)) {
        var Username="";

        try{
            var obnovlenie=rNum(3000, 7000)
            var timeout = rNum(1000, 1500);

            var action=false;
            var Boss=false;
            var ARENA=false;
            var POHOD=false;
            var SHAHTA='';
            //0-Молотень, 1-Элевайз, 2-Здоровяк, 3-Щитовид, 4-Волшебное лезвие, 5-Копач, 6-Гломин, 7-Сервитус,
            //8-Метрин, 9-Копатель, 10-Инкус, 11-Скоротеч, 12-Фермулон, 13-Кристи, 14-Острозуб, 15-Бриарин,
            //16-Рейдер, 17-Дарума, 18-Водоход, 19-Cкороход, 20-Странник, 21-Уроборос, 22-Реген, 23-Глориан,
            //24-Брутто, 25-Оркин, 26-Кристина, 27-Хатред, 28-Крушиброс, 29-Квадрифол
            var kul_at1=1;
            var kul_at2=2;
            var kul_za1=2;
            var kul_za2=3;
            var odet="/game/inventories/use?back_path=%2Fgame%2Finventories%2Fuser&id=";
            var snyat="/game/inventories/disuse?back_path=%2Fgame%2Finventories%2Fuser&id=";

            var kulon=["molot_tora_user_amulet", "slon", "diablo_user_amulet", "antimag_user_amulet", "blink_blade_user_amulet", "dabych_user_amulet", "double_reputation_amulet", "double_scroll_amulet", "dungeon_money_user_amulet", "excavation_user_amulet", "farrier_price_user_amulet", "farrier_time_user_amulet", "fermsten_user_amulet", "hapach_amulet", "krit_stone_user_amulet", "miner_digger_user_amulet", "profession_user_amulet", "pups_user_amulet", "sailor_user_amulet", "skorohod_user_amulet", "travel_user_amulet", "uroboros_user_amulet", "regenec_user_amulet", "glorian_amulet", "dubus_user_amulet", "undead_user_amulet", "patrol_crystal_amulet", "hide_crystal_amulet", "double_attack_amulet", "klever"]

            var activ_link='';
            var attack='';
            var attack_gerod='';
            var attack_drakon='';
            var attack_vladika='';

            var battle='';

            var dobkrist='';

            var life=''
            var lvl='';

            var info='';
            var inven_user='/game/inventories/user/';
            var inven_pet='/game//inventories/pet/';
            var iskatmestoroj='';

            var obnovit='';
            var otklonit='';

            var pohod='';
            var proverit='';
            //var perehod='';

            var t1=0,t2=0;
            var timeoutId='';
            var title ='';
            var trayStatus='';


            var div = document.getElementsByTagName('div');
            var body = document.getElementsByTagName('body');
            var notifications = document.getElementById('notifications_block');
            var header = document.getElementById('header');
            var content = document.getElementById('content');
            var block = document.getElementsByClassName('block');
            var tile_images = document.getElementsByClassName('tile_images');
            var footer = document.getElementById('footer');
            var li = document.getElementsByTagName('li');
            var a = document.getElementsByTagName('a');
            var button_medium = document.getElementsByClassName("button_medium");
            var button_small = document.getElementsByClassName("button_small");
            var td = document.getElementsByTagName("td")
            var any_tag=document.getElementsByTagName('*');
            var rus=["а","А","с","С","е","Е","Т","Н","о","О","р","Р","к","К","х","Х","В","М","у","и","д","т","г"]
            var eng=["a","A","c","C","e","E","T","H","o","O","p","P","k","K","x","X","B","M","y","u","g","m","r"]

            if (sessionStorage.scrolls==undefined) sessionStorage.scrolls="0"
            if (sessionStorage.mark==undefined) sessionStorage.mark="";

            var Scrolls=sessionStorage.scrolls.split(",")
            var mark=sessionStorage.mark.split(",");


            var temp_date = new Date();
            var day = temp_date.getDate();
            var hours=temp_date.getHours();
            var minutes=temp_date.getMinutes();
            var seconds=temp_date.getSeconds();
            var comp_time=hours*3600+minutes*60+seconds;

            var newDay=false
            if (mark[1]!=day && mark[1]!=undefined) newDay=true
            mark[1]=day;

            for (var i=0;i<=13;i++)
            {
            	if (Scrolls[i]==undefined) Scrolls[i]=0
            	if (/\d+/.test(Scrolls[i])) {
            		var t=/\d+/.exec(Scrolls[i])
            		if (newDay) t=t-86400;
            		if (t<=comp_time) Scrolls[i]=0
            		else if (/нет/.test(Scrolls[i])) Scrolls[i]=t+"нет"
	            	else Scrolls[i]=t
	            }
            }
            if (sessionStorage.on_off=="on" && /meni|Герои/.test(location.host) ){

                zapolneniePeremennih();
                if (notifications!=null && /Ты сейчас в копальне|Ты ищешь месторождение/.test(notifications.textContent)) SHAHTA=true;
                if (!action && ARENA) arena_();
                else if (!action && SHAHTA) kopalnya_();
                else if (!action && !POHOD && pohod!='') pohod_();

                //

            }
            addInfo_();
        }catch(err) {setTimeout(function() {location.href="/game"}, rNum(10000, 30000));
            sessionStorage.errors=err;
        }

        function en_ru(str) {
            for (var i=0;i<=rus.length;i++) {str=str.split(eng[i]).join(rus[i]);}
            return str;
        }

        function replace_(data) {
            var str=data
            str=str.replace(/(\n(\r)?)/g, ' ')
            str=str.split(/&nbsp;/).join(" ");
            str=str.replace(/&nbsp;/g, ' ')
            str=str.replace(/ {1,}/g, ' ')
            return str
        }

        function zapolneniePeremennih() {

            for (var y=0;y<any_tag.length;y++) {
            }

            for (var i=a.length-1; i>=0; i--) {
                var atext=en_ru(replace_(a[i].text))
                //alert(en_ru(replace_(a[i].id)));
                if (/Добыть кристаллы/.test(atext)) dobkrist=a[i];
                if (/Искать месторождение/.test(atext)) iskatmestoroj=a[i];
                if (/Обновить/.test(atext)) var obnovit=a[i];
                if (/Закрыть/.test(atext)) var zakrit=a[i];
                if (/в Доме/.test(atext)) var vdome=a[i];
                if (/Копальня/.test(atext)) var kopalnya=a[i];
                if (/Зал Славы/.test(atext)) var zalslavi=a[i];
                if (/Проклятие/.test(atext)) var proklyatie=a[i];
                if (/Малый Геросил/.test(atext)) var maliigerosil=a[i];
                if (/Люцерн/.test(atext)) var lucern=a[i];
                if (/Реген/.test(atext)) var regen=a[i];
                if (/Драконов/.test(atext)) var drakonov=a[i];
                if (/Отставка/.test(atext)) var otstavka=a[i];
                if (/Основатель/.test(atext)) var osnovatel=a[i];
                if (/Участке/.test(atext)) var ychastke=a[i];
                if (/Кузнеца/.test(atext)) var kuzneca=a[i];
                if (/Дуэли/.test(atext)) var dyeli=a[i];
                if (/Поход/.test(atext)) pohod=a[i];
                if (/Зов/.test(atext)) var zov=a[i];
                if (/о Владыке/.test(atext)) var ovladike=a[i];
                if (/Ведьма/.test(atext)) var vedma=a[i];
                if (/с акулами/.test(atext)) var sakulami=a[i];
                if (/Дружина/.test(atext)) var dryjina=a[i];
                if (/Йоге/.test(atext)) var ioge=a[i];
                if (/Шкатулке/.test(atext)) var shkatulke=a[i];
                if (/Живица/.test(atext)) var jivica=a[i];
                if (/Ровне/.test(atext)) var rovne=a[i];
                if (/Золотом/.test(atext)) var zolotom=a[i];
                if (/Уйти/.test(atext)) var yiti=a[i];
                if (/Перекресток/.test(atext)) var perekrestok=a[i];
                if (/Плавание/.test(atext)) var plavanie=a[i];
                if (/Сражаться/.test(atext)) var srajatsay=a[i];
                if (/Отряд/.test(atext)) var otrayd=a[i];
                if (/Проверь/.test(atext)) var prover=a[i];
                if (/Проверить/.test(atext)) proverit=a[i];
            }
        }

        function click(link, timer, perehod) {
            if (link!='' && !action) {
                action=true;
                activ_link=link;
                trayStatus=timer
                t1 = +new Date();
            }
            if (perehod==1) sessionStorage.perehod=1; else if (perehod==0) sessionStorage.perehod=0;
            if (link!=undefined) link.style="border: 2px solid #dddddd";
            timeoutId = setInterval(function(){location.href=link;}, timer);
            return;
        }
        //if (notifications!=null) alert(inven_user);
        //alert(document.getElementById('equipped_items').innerHTML);

        //if (body[0].innerHTML.match("equip_"+kulon[1])) alert("equip_"+kulon[1]);

        function kopalnya_(){
            if (document.URL.indexOf('/inventories') > 0) {
                if (body[0].innerHTML.match("equip_"+kulon[5])) click((odet+kulon[5]), timeout);
                else if (body[0].innerHTML.match("equip_"+kulon[15])) click((odet+kulon[15]), timeout);
                else click('/game/miner', timeout);
            }else if (notifications!=null && notifications.textContent.match("Ты сейчас в копальне")) click(inven_user, timeout);

            if (document.URL.indexOf('/miner') > 0) {
                if (dobkrist!='') click(dobkrist, timeout);
                else if (iskatmestoroj!='') click(iskatmestoroj, timeout);
                else click('/game', 31000);
            }else if (SHAHTA) click('/game', timeout*10);

        }

        function arena_(){
            if (document.URL.indexOf('/battle/') > 0) {

            }else click("/game/battle/player/find?level=55", timeout);
        }

        function pohod_(){
            click(pohod, timeout);
        }

        function mpage(val) {
            var div_i=document.createElement("div")
            div_i.innerHTML+="<div class='small minor'>"+val+"</div>"
            header.appendChild(div_i)
        }

        function rNum(min, max) {
            if (max==undefined) return Math.floor(Math.random()*min )
            else return Math.floor(Math.random()*(max - min)+min);
        }

        function addInfo_() {
            info+='<div class="hr"></div>';
            var div_b='';

            if (sessionStorage.on_off=="on") info+='<div> <input id="button" type="submit" value=" STOP " >' +div_b+ '</input> </div>'
            else info+='<div> <input id="button" type="submit" value=" START ">' +div_b+ '</input> </div>'

            if (sessionStorage.on_off=="on")
            {
                info+='<div class="hr"></div>';
	            if (trayStatus!='') info+='<div> Ожидание : <span id="timer" style="color:#53da3f">'+(trayStatus/1000).toFixed(2)+'</span> сек.</div>'

	            //info+='<div> Промахи : '+sessionStorage.missed+'</div>'
            }
            mpage(info)
            var t = setInterval(MyTimer, 57);

            if (document.getElementById("button")!=undefined) {button.onclick= function() {
                if (sessionStorage.on_off=="on") {sessionStorage.on_off="off"; if (timeoutId!="") clearInterval(timeoutId); activ_link.style=""; button.value=" START "; }
                else {sessionStorage.on_off="on";sessionStorage.perehod=1; button.value=" STOP "; location.href=location.href;}}
            }
        }

        function MyTimer() {//clearTimeout
            if (document.getElementById("timer")!=undefined){
                t2 = +new Date(); var tmr=t1+Number(trayStatus)-t2;
                if(tmr<60) {document.getElementById("timer").innerHTML="0.00"; clearInterval(t)}
                else document.getElementById("timer").innerHTML=(tmr/1000).toFixed(2);}
        }

        function getCookie(name) {
            var matches = document.cookie.match(new RegExp(
                "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
            ))
            return matches ? decodeURIComponent(matches[1]) : undefined
        }


    }
})(window);