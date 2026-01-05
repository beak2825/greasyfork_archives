// ==UserScript==
// @name         Anitube Scripts
// @namespace    Scripts
// @version      2.7 -- 26/01/2018
// @description  Adiciona o Tema red e melhoria para o player
// @author       Fukoji
// @match        http://anitubebr.biz/
// @match        http://anitubebr.biz/*
// @match        https://anitubebr.biz/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21775/Anitube%20Scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/21775/Anitube%20Scripts.meta.js
// ==/UserScript==
var jQueryIT = document.createElement('script');
jQueryIT.src = 'http://code.jquery.com/jquery-latest.min.js';
document.getElementsByTagName('head')[0].appendChild(jQueryIT);

function scripts(){
    
setInterval(function(){
    $('object[title="Adobe Flash Player"]').hide();
    $('div[role="navigation"]').show();
    //Nota: o site quebra muito fácil cuidado ao mexer aqui, algumas modificações para arrumar.
//    $('.container').show();
//    $('.col-md-8').css({"margin-top":"5px"});
 //   $('.well').css("margin-top","495px");
    $('.player1nn-dimensions, div[tabindex="9999"], .player2nn-dimensions, object[name="flow_api"], object[name="flip_api"]').css({"width":"1106px"});
     
}, 1000);
//recolocar propaganda    
var videoarea = window.location;
var videovv = /www\.anitube\.info\/video/g;
var testvideo = videovv.test(videoarea);

if (testvideo === true) {
	$('.col-md-4').css("margin-top","495px");
}  

$('.navbar-inverse .navbar-nav>li:nth-child(8)').after('<a href="#" name="theme" id="theme">Red</a>');
$('a[name="theme"]').css({"paddint-top":"15px","text-transform":"uppercase","font-family":"Oswald, Open sans","font-size":"14px","padding":"0 15px","line-height":"40px","color":"#fff","text-decoration":"none"});
    	
//Initial Check
$('body').ready(function(){
	if (localStorage.getItem('redx') == 'ativado') {
	  redx();
	}else {
		localStorage.setItem('redx','desativado');
	}});
								
$('a[name="theme"]').click(function(e){
e.preventDefault();	
	if(localStorage.getItem('redx') == 'ativado') {
    localStorage.setItem('redx', 'desativado');
		alert('Tema Red desativado porfavor atualize a página!');

	} else {
		localStorage.setItem('redx','ativado');
		redx();
		alert('Tema Red ativado!');

	};

});
													 
 //RED THEME ALPHA
function redx(){
		$('.navbar-inverse').css("background","#6f0110");
		//menu
		$('.navbar-inverse .navbar-nav>li>a').hover(function(){
			$(this).css('background','#9a0116');
		}, function(){$(this).css('background','#6f0110')});
    //Logo
		$('img[alt="AniTube! Animes Online"]').attr('src', "http://i.imgur.com/hCyULas.png");
		//player select
    $('li.idon').css({"background-color":"#6c0000"});
		$('a[data-toggle="tab"]').on('focus', function(){
			$(this).css('background','#9a0116');
		});

		//player interface
		$('.video-js .vjs-control').css("background","#8a0020");

		//view cont & dwn button
		$('.badge').css("background-color","#6f0110");
		$('.btn-down2').css({"background-color":"#9a0116","border":"none","color":"#fff"});

		//Videos relacionados
    $('li.active').css('background','#9a0116');
	  $('a[data-toggle="tab"]').css('background','#9a0116');

		//like button
		$('.btn-primary').css('background-color','#2ea25a');

		//hd icon
		$('.hd-text-icon').css({"background-color":"#8a0020","color":"#fff"});
	
	  //Search button
	  $('button[type="submit"]').css({"background":"#9a0116","border":"none"});
	
	  //Page commands
	  $('a[rel="next"], a[rel="prev"]').mouseover(function(){$(this).css("background-color","#9a0116")});
	  $('a[rel="next"], a[rel="prev"]').mouseout(function(){$(this).css("background-color","#222426")});

	}

}; scripts();