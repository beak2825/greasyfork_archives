// ==UserScript==
// @name          ЧАС-аккорд
// @namespace     http://www.example.com/gmscripts
// @description   Мелкие плюшки на сайтах с аккордами
// @match		*://*.muzland.ru/*
// @match		*://*.bards.ru/*
// @match		*://*.falshivim-vmeste.ru/*
// @match		*://polnolunie.baikal.ru/*
// @match		*://*.ngavan.ru/*
// @match		*://*.guitarmusic.ru/*
// @match		*://*.amdm.ru/*
// @match		*://*.pesni.ru/*
// @match		*://*.akkords.ru/*
// @match		*://*.russrock.ru/*
// @match		*://music.kulichki.net/*
// @match		*://akkordy.su/*
// @match		*://akkordbard.ru/*
// @match		*://mirpesen.com/*
// @match		*://vopesni.ru/*
// @match		*://catalogue.musicforums.ru/*
// @match		*://*.igitarist.ru/*
// @match		*://*.hm6.ru/*
// @version		0.2.0.6
// @license		GNU GPLv3
// @require		https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/13787/%D0%A7%D0%90%D0%A1-%D0%B0%D0%BA%D0%BA%D0%BE%D1%80%D0%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/13787/%D0%A7%D0%90%D0%A1-%D0%B0%D0%BA%D0%BA%D0%BE%D1%80%D0%B4.meta.js
// ==/UserScript==


var currentTargetElement=document.getElementsByTagName('pre')[0];
var currentAutoFunction=scaleTargetElement;
var columnCount=2;

function scaleTargetElement(){
	//Костыль =(
	currentTargetElement || ( currentTargetElement=document.getElementsByTagName('pre')[0] );

	currentTargetElement.style.zIndex=9999998;
	currentTargetElement.style.WebkitColumnCount=columnCount;
	var zoom=Math.min(
		document.documentElement.clientHeight/currentTargetElement.offsetHeight,
		document.documentElement.offsetWidth /currentTargetElement.offsetWidth ,
		1.46
	);
	currentTargetElement.style.zoom=zoom;
	document.getElementById('mashtab').value=Math.round(zoom*100 ) /100;
}

function forceColumns(columns){
	columnCount=columns;
	currentAutoFunction();
}

function agressiveNormalize(){
	scaleTargetElement();
	currentTargetElement.style.backgroundColor="white";
	currentTargetElement.style.color="black";
	currentTargetElement.style.position="fixed";
	currentTargetElement.style.left=0;
	currentTargetElement.style.top=0;
	currentTargetElement.style.zIndex=9999998;	
	currentTargetElement.style.padding="1em";
}

function createElementEx(tag,target,o){
	var el=document.createElement(tag);
	el.innerHTML=o.innerHTML;
	el.id=o.id;
	el.value=o.value;
	$(el).click(o.click);
	if(o.style){
		el.style.width=o.style.width;
	}
	target.appendChild(el);
}

function createPanel(){
	var panel=document.createElement('div');
	panel.id='panel';
	panel.style.position='fixed';
	panel.style.right=0;
	panel.style.bottom=0;
	panel.style.backgroundColor='pink';
	panel.style.zIndex=9999999;
	panel.style.fontSize='12px';

	createElementEx('button', panel, {innerHTML:'Подогнать!',click:currentAutoFunction});
	createElementEx('span'  , panel, {innerHTML:'Масштаб'   ,                         });
	createElementEx('button', panel, {innerHTML:'+'         ,click:mashtabPlus        ,style:{width:'1.5em'}});
	createElementEx('button', panel, {innerHTML:'-'         ,click:mashtabMinus       ,style:{width:'1.5em'}});
	createElementEx('input' , panel, {value    :'1'                                   ,style:{width:'3em'  },id:'mashtab'});
	createElementEx('button', panel, {innerHTML:'Вперёд!'   ,click:updateMashtab      });
	createElementEx('button', panel, {innerHTML:'2'         ,click:function(){forceColumns(2);} });
	createElementEx('button', panel, {innerHTML:'3'         ,click:function(){forceColumns(3);} });
	createElementEx('button', panel, {innerHTML:'4'         ,click:function(){forceColumns(4);} });
	createElementEx('button', panel, {innerHTML:'<>'        ,click:agressiveNormalize            });
	
	document.body.appendChild(panel);
}

function incMashtab(n){
	var el=document.getElementById('mashtab');
	el.value=(''+(n+1*el.value)).substr(0,4);
	updateMashtab();
}

function mashtabPlus(){
	incMashtab(0.03);
}

function mashtabMinus(){
	incMashtab(-0.03);
}

function updateMashtab(){
	currentTargetElement.style.zoom=document.getElementById('mashtab').value;
}

function muzland(){
	try{
		document.getElementsByTagName('center')[5].innerHTML='';
	}catch(e){};
	document.getElementsByClassName('index_width')[0].style.width="auto";
	document.getElementsByClassName('accords_left')[0].style.width=(document.body.offsetWidth-270)+'px';
	scaleTargetElement();
}

function hm6(){
	$('.b-main_aside')[0].style.float="none";
	$('.b-main_aside')[0].style.width="auto";
	scaleTargetElement();
}

function polnolunie(){
	$('#panel').remove();
	var text=document.body.innerHTML;
	textArray=text.split("<hr>");
	document.body.innerHTML='<style>.twocolumn{-webkit-column-count:'+columnCount+';}</style>'+
		'<div id="chas-akkord-wrap"><div class="twocolumn">'+
		textArray.join('</div><hr/><hr/><div class="twocolumn">')+'</div></div>';
	currentTargetElement=$('#chas-akkord-wrap')[0];
	createPanel();
}

function guitarmusic(){
	$('pre > img').remove();
	scaleTargetElement();
}

if(document.location.href.match(/muzland/)){
	currentAutoFunction=muzland;
}else if(document.location.href.match(/hm6/)){
	currentAutoFunction=hm6;
}else if(document.location.href.match(/bards/)){
	currentAutoFunction=scaleTargetElement;
}else if(document.location.href.match(/falshivim-vmeste/)){
	currentAutoFunction=scaleTargetElement;
}else if(document.location.href.match(/polnolunie/)){
	currentAutoFunction=polnolunie;
	currentTargetElement=document.body;
}else if(document.location.href.match(/guitarmusic/)){
	currentAutoFunction=guitarmusic;
}else if(document.location.href.match(/igitarist/)){
	currentTargetElement=$('blockquote')[0];
}else if(document.location.href.match(/pesni/)){
	currentTargetElement=$('ul#text-song > li')[1];
	currentAutoFunction=agressiveNormalize;
}else if(document.location.href.match(/akkordy[.]su/)){
	currentTargetElement=$('.cnl_page')[0];
	currentAutoFunction=agressiveNormalize;
	columnCount=3;
}else if(document.location.href.match(/mirpesen[.]com/)){
	currentTargetElement=$('p.lyrics')[0];
}else{
}
createPanel();

console.log("chas-akkord отработал");
