// ==UserScript==
// @name		Script_for_tiwar_arena_by_nexus
// @namespace	Arena BT
// @include		http://*
// @version		1.3.4
// @description 1
// @downloadURL https://update.greasyfork.org/scripts/37170/Script_for_tiwar_arena_by_nexus.user.js
// @updateURL https://update.greasyfork.org/scripts/37170/Script_for_tiwar_arena_by_nexus.meta.js
// ==/UserScript==
/*
	Author: Nexus;
	http://tiwar.info/
	16.05.2015
*/
var all_meta=document.getElementsByTagName('meta'),
	ths_ver="1.3.4",
	this_tiwar=false;
for(var i=0;i<all_meta.length;i++){if(all_meta[i].name=='keywords'){if(all_meta[i].content=='битва титанов, титаны, онлайн игра, тивар, tiwar, MMORPG'){this_tiwar=true;};};};
var this_arena=false;
var nexus=document.createElement('script');
if(window.location.href.toString().indexOf('arena')!=-1){this_arena=true;};
if(this_tiwar && this_arena){
	if(localStorage.getItem("show_update_link")){
		document.getElementsByClassName('main')[0].innerHTML+='<div class="mini-line"></div><a href="http://tiwar.info/publ/13-1-0-95" target="_blank" style="text-align:center;display:block;padding:5px;">Доступна новая версия скрипта</a>';
	};
	var health_num=document.getElementsByClassName('head')[0].getElementsByTagName("span")[1].innerHTML.replace(/<[\d\D]+?>/g,"").match(/[\d]+/g),
		mana_num=parseInt(health_num[1]);
        health_num=parseInt(health_num[0]);
		title=document.getElementsByTagName('title')[0].innerHTML,
		loc=localStorage,
		no_attack_=false,
		atak=1,
		event_code=document.getElementsByClassName("btn"),
		attack_timestamp=0,
		wait=400;
	event_code=event_code.length>0?event_code[0].getAttribute("href").split("?")[0].split("/"):0;
	event_code=event_code.length>0?event_code[event_code.length-2]:0;
	if(loc.getItem('atak')){atak=loc.getItem('atak');}else{loc.setItem('atak','1');};
	if(loc.getItem('wait')){wait=loc.getItem('wait');}else{loc.setItem('wait','400');};
	if(wait<30){wait=30;loc.setItem('wait','30');};
	var wait_try=wait
	wait=parseInt(wait)+Math.floor(Math.random()*(30+1));
	atak=parseInt(atak);
	document.getElementsByClassName('main')[0].innerHTML+='<div class="line"></div><a href="javascript://" style="display:block;padding:3px 5px;background:rgba(255,255,255,0.1);" id="script_setting">Настройки<span style="float:right;">Открыть</span></a><div style="background:rgba(255,255,255,0.1);padding:2px 4px;display:none;" id="nexus_script_footer_setting"></div>';
	document.getElementById('script_setting').addEventListener('click',function(){
		if(document.getElementById('nexus_script_footer_setting').style.display=='none'){
			this.getElementsByTagName('span')[0].innerHTML='Закрыть';
			this.style.borderBottom='solid 1px #666';
			document.getElementById('nexus_script_footer_setting').style.display=''
		}else{
			this.getElementsByTagName('span')[0].innerHTML='Открыть';
			this.style.borderBottom='none';
			document.getElementById('nexus_script_footer_setting').style.display='none'
		};
		},false);
	document.getElementById('nexus_script_footer_setting').innerHTML='<div style="padding:2px 0px;">Арена. Атаковать №:<span style="float:right;" id="arena_atk"><a href="javascript://" style="padding:0px 2px;">1</a> <a href="javascript://" style="padding:0px 2px;">2</a></span></div>';
	document.getElementById('nexus_script_footer_setting').innerHTML+='<div style="padding:2px 0px;">Арена. Без маны ждать:<span style="float:right;" id="arena_wait"><input type="text" value="'+wait_try+'" maxlength="5" size="5" style="background:none;outline:none;border:none;color:#595;font-weight:bold;"/> <a href="javascript://">Сохранить</a></span></div>';
	document.getElementById('arena_atk').getElementsByTagName('a')[(atak-1)].style.color='#5F5';
	nexus.type='text/javascript';
	document.getElementById('arena_atk').getElementsByTagName('a')[0].addEventListener('click',function(){
		loc.setItem('atak','1');
		this.style.color='#5F5';
		document.getElementById('arena_atk').getElementsByTagName('a')[1].style.color='rgb(244,208,110)';
	},false);
	document.getElementById('arena_atk').getElementsByTagName('a')[1].addEventListener('click',function(){
		loc.setItem('atak','2');
		this.style.color='#5F5';
		document.getElementById('arena_atk').getElementsByTagName('a')[0].style.color='rgb(244,208,110)';
	},false);
	document.getElementById('arena_wait').getElementsByTagName('a')[0].addEventListener('click',function(){
		loc.setItem('wait',this.parentNode.getElementsByTagName('input')[0].value);
		this.parentNode.getElementsByTagName('input')[0].setAttribute('maxlength','9');
		this.parentNode.getElementsByTagName('input')[0].size='9';
		this.parentNode.getElementsByTagName('input')[0].value='Сохранено';
		setTimeout(function(){
			document.getElementById('arena_wait').getElementsByTagName('input')[0].size='5';
			document.getElementById('arena_wait').getElementsByTagName('input')[0].setAttribute('maxlength','5');
			document.getElementById('arena_wait').getElementsByTagName('input')[0].value=loc.getItem('wait');
		},3000);
	},false);
	nexus.src='http://tiwar.info/js/js.js?'+Math.random().toString().split(".")[1];
	if(document.getElementsByClassName('main')[0].innerHTML.replace(/<[\d\D]+?>/g,"").match("Для нападения надо минимум  10% жизни и  50 энергии")!==null || mana_num<50 || no_attack_){
		var _nex_bar=document.createElement("div");
			_nex_bar.innerHTML='<div class="exp_bar"><div class="progress" style="'+document.getElementsByClassName('exp_bar')[0].getElementsByClassName('progress')[0].getAttribute("style")+'"></div></div><div style="text-align:center;margin:3px 0;font-size:90%;">Страница будет обновлена через <span id="timer">'+wait+'</span></div>';
		document.getElementsByClassName('exp_bar')[0].getElementsByClassName('progress')[0].setAttribute("id","nexus_exp_bar");
		document.getElementsByClassName('exp_bar')[0].getElementsByClassName('progress')[0].style.backgroundColor='#C66';
		document.getElementsByClassName('main')[0].insertBefore(_nex_bar,document.getElementsByClassName('exp_bar')[0]);
		delete _nex_bar;
		document.body.appendChild(nexus);
		function timer(num){
			if(!num){var num=document.getElementById('timer').innerHTML;};
			if(!attack_timestamp){
				attack_timestamp=parseInt(new Date().getTime())+wait*1000;
			}else if(attack_timestamp<=new Date().getTime()){
				window.location.href='/arena/attack/'+atak+'/'+event_code;
			}else if((attack_timestamp-new Date().getTime())!=num){
				num=(attack_timestamp-new Date().getTime())/1000;
			};
			if(num>0){
				var sec=num;
				var min=sec/60;
				min=''+min+'';
				min=min.split('.')[0];
				sec=sec/60;
				sec=sec.toFixed(2);
				sec=sec.split('.')[1];
				sec=60/100*sec;
				sec=sec.toFixed();
				if(parseInt(sec)<10){sec='0'+sec;};
				if(parseInt(min)<10){min='0'+min;};
				num=num-1;
				setTimeout(function (){timer(num)}, 1000);
				document.getElementById('timer').innerHTML=min+'<i>мин</i> '+sec+'<i>сек</i>';
				document.getElementsByTagName('title')[0].innerHTML=min+':'+sec+'сек. | '+title;
				document.getElementById('nexus_exp_bar').style.width=(num/(wait/100)).toFixed()+'%';
			}else{
				document.getElementById('nexus_exp_bar').style.width='0%';
				window.location.href='/arena/attack/'+atak+'/'+event_code;
			};
		};
		setTimeout(timer,1);
	}else{window.location.href='/arena/attack/'+atak+'/'+event_code;};
	var script_version_check=setInterval(function(){
		if(ths_ver!=document.nexus_script_version){
			loc.setItem("show_update_link",document.nexus_script_version);
		}else{
			loc.removeItem("show_update_link");
		};
		if(document.nexus_script_version!=undefined) clearInterval(script_version_check);
	},1000);
};