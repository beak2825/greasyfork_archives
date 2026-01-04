// ==UserScript==
// @name     MirkoGrief
// @author   Nizax
// @include  http://*mirkoczat.pl*
// @include  https://*mirkoczat.pl*
// @version  0.1
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @namespace http://mirkoczat.pl
// @description Adds mirkoczat.pl integration
// @downloadURL https://update.greasyfork.org/scripts/39496/MirkoGrief.user.js
// @updateURL https://update.greasyfork.org/scripts/39496/MirkoGrief.meta.js
// ==/UserScript==

(function() {
    'use strict';
let chat = document.getElementsByClassName( 'chat' )[0];
let chat_section = document.getElementsByClassName( 'col-xs-12 mid' )[0];
let chat_input = chat.getElementsByClassName('form-control');
let chat_monitor = chat.getElementsByTagName('div')[6];
let container = document.getElementById( 'content' );
let inputMenu = [];
let nickName;
if(window.location.pathname.slice(0,8) == '/embed_t'){
	container.style.margin = '0';
}

/*
	TODO:
		- ukośne szlaczki
*/


if(window.location.pathname.slice(0,3)=='/i/'){
	let _iframe = document.getElementsByTagName( 'iframe' )[0].src;
	if((_iframe !== undefined || '' || null) && !(_iframe.includes('mirkoczat.pl'))){
		setCookie(window.location.pathname.slice(3, window.location.pathname.length), _iframe, 999);
	};
	window.location.href='http://mirkoczat.pl/embed_t/'+window.location.pathname.slice(3,window.location.pathname.length);
}
if( window.location.protocol != 'http:' ){
	window.location.href= 'http://' + window.location.host + window.location.pathname;
}else if((window.location.pathname.slice(0,8) == '/embed_t' || window.location.pathname.slice(0,2) == '/t') && !(window.frameElement)){
	
	$(document).ready(function() { 
	//
	// PREPARACJA SKRYPTU ABY DZIAŁAŁ NA /t/ i /i/
	//
	let iframe = document.createElement( 'iframe' );
	let _channel = window.location.pathname.slice(9,window.location.pathname.length);
	let _guziczek = document.createElement( 'button' );
	let _okienko = document.createElement( 'div' );
	let _rubryka = document.createElement( 'input' );
	if(window.location.pathname.slice(0,8) == '/embed_t'){
		chat_section.style.position = 'absolute'; chat_section.style.right = '0px'; chat_section.style.height = (window.innerHeight + 30) + 'px'; chat_section.style.width = '30%';
		
		if(getCookie(_channel) != ''){
			let _ciastko = getCookie(_channel);
			if(_ciastko.includes('http:') || _ciastko.includes('https:') || _ciastko.includes('www.')){
				iframe.src = _ciastko;
			} else {
				iframe.src = 'https://www.youtube.com/embed/live_stream?channel=' + _ciastko;
			};
		} else {
			_okienko.style.margin = '0'; _okienko.style.position = 'absolute'; _okienko.style.top = '5%'; _okienko.style.width = '70%';
			
			_rubryka.style.position = 'relative'; _rubryka.style.width = '100%'; _rubryka.style.height = '4%';
			_rubryka.type = 'text'; _rubryka.placeholder = 'podaj link do KANAŁU youtube np. https://www.youtube.com/channel/UCNArdo_iHMiRBbFvFk_e--w';
			_guziczek.style.width = '100%'; _guziczek.style.color = 'black'; _guziczek.style.height = '2%';
			_guziczek.innerHTML = 'gotowe';
			
			_okienko.appendChild( _rubryka );
			_okienko.appendChild( _guziczek );
			container.prepend( _okienko );
		};
		
		iframe.style.position = 'absolute'; iframe.style.left = '0px'; iframe.style.height = (window.innerHeight + 30) + 'px'; iframe.style.width = '70%'; iframe.frameBorder = '0';
		container.prepend( iframe );
	}
	_guziczek.onclick = function(){
		let _ytchannelID;
		let _type = _rubryka.value;
		_type = _type.split('/');
		if(_type[_type.length - 1].slice(0,8) === 'watch?v='){
			_type = _type[_type.length - 1];
			_type = _type.slice(8,_type.length);
		} else if(_type[_type.length - 2] === 'youtu.be'){
			_type = _type[_type.length - 1];
		} else {
			_type = _type[_type.length - 2];
		};
		if(_type === "user"){
			let _userName = _rubryka.value.slice( _rubryka.value.lastIndexOf("/") + 1, _rubryka.value.length );
			getChannelID( _userName );
			setTimeout(function()
			{
				_ytchannelID = _getChannelIDhandler.items[0].id;
				iframe.src = "https://www.youtube.com/embed/live_stream?channel=" + _ytchannelID;
				setCookie(_channel, _ytchannelID, 999);
				_okienko.removeChild( _rubryka );
				_okienko.removeChild( _guziczek );
				container.removeChild( _okienko );
			}, 1000);
		} else if(_type === "channel"){
			_ytchannelID = _rubryka.value.slice( _rubryka.value.lastIndexOf("/") + 1, _rubryka.value.length );
			iframe.src = "https://www.youtube.com/embed/live_stream?channel=" + _ytchannelID;
			setCookie(_channel, _ytchannelID, 999);
			_okienko.removeChild( _rubryka );
			_okienko.removeChild( _guziczek );
			container.removeChild( _okienko );
		} else if(_type === undefined){ 
			alert("Niepoprawny format linku. Musisz podać link do KANAŁU np.\nhttps://www.youtube.com/channel/UCNArdo_iHMiRBbFvFk_e--w \nEWENTUALNIE \nhttps://www.youtube.com/user/Owsiaknet");
			throw new Error('[MirkoGrief] Podano zły format linku. Skrypt obsługuje tylko yt.com/channel (yt user) lub yt.com/user (google user)');
		} else {
			iframe.src = 'https://www.youtube.com/embed/' + _type;
		};
	}
	
	
	//
	// GUZIK MirkoGrief
	//
	let input_box = chat.getElementsByTagName( 'div' )[2];
	let MirkoGrief = document.createElement( 'button' );
	MirkoGrief.style.color = "#00FF00"; MirkoGrief.style.backgroundColor = "black"; MirkoGrief.style.borderRadius = "5px"; MirkoGrief.style.height = "30px"; MirkoGrief.style.border = "2px solid #d3d3d3"; MirkoGrief.style.width = "37px"; MirkoGrief.style.position = "absolute"; MirkoGrief.style.top = "3px"; MirkoGrief.style.margin = "auto"; MirkoGrief.innerHTML = "MG"; MirkoGrief.style.fontWeight = "bold"; MirkoGrief.style.fontFamily = 'Lucida Console, Monaco, monospace'; MirkoGrief.style.fontSize = '15px';
	let mirko_buttons = input_box.getElementsByTagName('button');
	input_box.style.marginRight = parseInt(input_box.style.marginRight.slice(0,input_box.style.marginRight.length-2)) + (40*mirko_buttons.length) + 'px';
	for(var i=0;i<mirko_buttons.length;i++){
		if(mirko_buttons[i].innerHTML == 'M+')
		mirko_buttons=false;
	}
	if(!mirko_buttons){
		MirkoGrief.style.right = '130px';
	} else {
		MirkoGrief.style.right = '85px';
	}
	input_box.prepend( MirkoGrief );
	let MirkoGriefTrigger = false;
	
	let menuMirko = document.createElement( 'div' );
	menuMirko.style.backgroundColor = "rgba(0,0,0,0.95)";
	menuMirko.style.position = "absolute"; menuMirko.style.width = "100%"; menuMirko.style.border = "2px solid #d3d3d3";
	menuMirko.style.color = "#00cc00"; menuMirko.style.marginRight = "-130px";
	chat.style.pointerEvents = "auto"; MirkoGrief.style.pointerEvents = "auto"; 
	menuMirko.style.pointerEvents = "none";
	input_box.style.pointerEvents = "none";
	menuMirko.style.zIndex = '99';
	menuMirko.style.visibility = 'hidden';
	input_box.append( menuMirko );
	
	menuMirko.style.fontSize = '11px';
	menuMirko.innerHTML = '<ul style="padding:0;margin:0px;list-style:none;-ms-box-orient:horizontal"><li><p>FLOOD</p><hr><selector></selector></li><li><p>ZALGO/GLITCH TEXT</p><hr><selector></selector></li><li><p>DODATKOWE BAJERY</p><hr><selector></selector><br /><div style="font-size:10px;color:gray;text-align:right;width:100%;">'+String.fromCharCode(32,78,105,122,97,120)+'</div></li></ul>';
	menuMirko.getElementsByTagName('ul')[0].style.display = '-webkit-box';
	menuMirko.getElementsByTagName('ul')[0].style.display = '-moz-box';
	menuMirko.getElementsByTagName('ul')[0].style.display = '-ms-flexbox';
	menuMirko.getElementsByTagName('ul')[0].style.display = '-moz-flex';
	menuMirko.getElementsByTagName('ul')[0].style.display = '-webkit-flex';
	menuMirko.getElementsByTagName('ul')[0].style.display = 'flex';
	let menuMirkoList = menuMirko.getElementsByTagName('li');
	for(var i=0;i<menuMirkoList.length;i++){
		menuMirkoList[i].style.flex = '4 1 auto';
		menuMirkoList[i].style.flexBasis = '25%';
		menuMirkoList[i].style.border = '1px solid #d3d3d3';
	}
	let menuMirkoHead = menuMirko.getElementsByTagName('p');
	for(var i=0;i<menuMirkoHead.length;i++){
		menuMirkoHead[i].style.fontWeight = 'bold';
		menuMirkoHead[i].style.width = '100%';
		menuMirkoHead[i].style.color = 'gold';
		menuMirkoHead[i].style.textAlign = 'center';
		menuMirkoHead[i].style.marginTop = '3px';
		menuMirkoHead[i].style.marginBottom = '2px';
	}
	let menuMirkoHr = menuMirko.getElementsByTagName('hr');
	for(var i=0;i<menuMirkoHr.length;i++){
		menuMirkoHr[i].style.marginTop = '1px';
		menuMirkoHr[i].style.marginBottom = '1px';
	}
	

	let menuMirkoInput = menuMirko.getElementsByTagName('selector');
	menuMirkoInput[0].innerHTML = 'Wysylaj:<br /><div><input type="text" style="width:50px;" value="1"> wiadomości</div><div>co <input type="text" style="width:50px;" value="1"> sekund</div><div>na <select><option value="czat">czat</option><option value="PW">PW</option></select></div>Nie wysyłaj do: <div><input type="text" style="width:99%" placeholder="nicki oddzielaj spacja"></div>Wysyłaj tylko do: <div><input type="text" style="width:99%" placeholder="jesli puste - wszyscy"></div>';
	let floodButton = document.createElement('button');
	floodButton.innerHTML = 'nieaktywne';floodButton.style = 'width:100%;color:gold;background-color:black;border-radius:20px;border:2px solid gray;margin:auto;';
	floodButton.onclick = function(){
		if(floodButton.innerHTML=='nieaktywne'){
			floodButton.innerHTML='aktywne';
			floodButton.style.backgroundColor='#0000d3';
			floodButton.setAttribute('bool','true');
		} else {
			floodButton.innerHTML='nieaktywne';
			floodButton.style.backgroundColor='black';
			floodButton.setAttribute('bool','false');
		}
	}
	menuMirkoInput[0].append(floodButton);
	
	
	menuMirkoInput[1].innerHTML = '<br /><br /><br />Szlaczki:<br /><div>kierunek <select><option value="losowy">losowy</option><option value="góra">góra</option><option value="dół">dół</option><option>góra i dół</option><option>środek</option></select></div><div>limit długości <input type="text" style="width:50px" value="999"></div>';
	menuMirkoInput[1].style.lineHeight = "200%";
	let zalgoButton = document.createElement('button');
	zalgoButton.innerHTML = 'nieaktywne';zalgoButton.style = 'width:100%;color:gold;background-color:black;border-radius:20px;border:2px solid gray;margin:auto;';
	zalgoButton.onclick = function(){
		if(zalgoButton.innerHTML=='nieaktywne'){
			zalgoButton.innerHTML='aktywne';
			zalgoButton.style.backgroundColor='#0000d3';
			zalgoButton.setAttribute('bool','true');
		} else {
			zalgoButton.innerHTML='nieaktywne';
			zalgoButton.style.backgroundColor='black';
			zalgoButton.setAttribute('bool','false');
		}
	}
	menuMirkoInput[1].append(zalgoButton);
	
	
	menuMirkoInput[2].innerHTML = 'Tekst:<br /><div><input type="checkbox"> do góry nogami</input></div><div><input type="checkbox"> od tyłu</input></div><div><input type="checkbox"> w bąbelkach</input></div><div><input type="checkbox"> w stylu pisma</input></div><div><input type="checkbox"> max szerokość</input></div><div><input type="checkbox"> długi tekst na raty</div>';
	let showUpMutedContainer = document.createElement('div');
	let showUpMuted = document.createElement('button');
	showUpMuted.innerHTML = 'pokaż uciszone';showUpMuted.style = 'width:80%;color:#00cc00;background-color:#d5d5d5;border-radius:3px;border:2px solid gray;margin:auto;';
	showUpMuted.onclick = function(){
		if(parseFloat(input_box.style.marginRight.slice(0,input_box.style.marginRight.length-2))<170){
			alert('Ta opcja wymaga rozszerzenia MirkoczatPremium. Znajdziesz je na wykop pod tagiem #mirkoczatpremium - to nie są żarty xD');
		} else {
			var element,uid,user;
			var found = 0;
			var allMessages = chat_monitor.querySelectorAll( 'div.avatar-plus' );
			var i = 0;
			while((allMessages[i]!==undefined) && (i <= 50) && (allMessages.length>i)){
				user = allMessages[i].parentElement.querySelector('a').innerHTML;
				element = allMessages[i].parentElement;
				if(element !== undefined){
					var _lastmsg = element.innerHTML;
					var msgRegex = /([0-9] -->)/g;
					var str = _lastmsg;
					var _lastIndex;
					while ((msgRegex.exec(str)) !== null) {
						_lastIndex = msgRegex.lastIndex;
					}
					var _msg = _lastmsg.slice(_lastIndex, _lastmsg.length - 20);

					var _lastMsg = element.getAttribute('msg');
					var _uid = element.getAttribute('uid');	
					
					if(_msg=='*uciszone*'){
						found++;
						element.innerHTML = element.innerHTML.replace('*uciszone*',_lastMsg);
					}
				} else {
					break;
				}
				i++
			}
			if(found==0) {
				alert('Nie odnaleziono uciszonych wiadomości w pamięci');
			} else {
				inputMenu[13].innerHTML = 'odkryto ' + found + ' wiadomości';
				setInterval(function(){
					inputMenu[13].innerHTML = 'pokaż uciszone';
				}, 3000);
			}
		}
	}
	menuMirkoInput[2].append(showUpMutedContainer);
	showUpMutedContainer.append(showUpMuted);
	for(var i=0;i<menuMirkoInput.length;i++){//-1 zeby nie dodawalo guzika showUpMuted przedwcześnie, bo jest w divie
		menuMirkoInput[i].style.padding = '5px';
		menuMirkoInput[i].style.fontFamily = 'Lucida Console, Monaco, monospace';
		let _inputs = menuMirkoInput[i].getElementsByTagName('div');
		for(var j=0;j<_inputs.length;j++){
			_inputs[j].style.margin = '0px 0px 0px 20px';
			if(_inputs[j].getElementsByTagName('input')[0]){
				_inputs[j].getElementsByTagName('input')[0].setAttribute('bool','false');
				_inputs[j].getElementsByTagName('input')[0].style.backgroundColor = '#d5d5d5';
			}
			inputMenu.push(_inputs[j].lastElementChild);
		}
	}
	inputMenu.push(floodButton);
	inputMenu.push(zalgoButton);
	
	inputMenu[7].onclick = function(e){ turn(inputMenu[7],[9,10,11]) };
	inputMenu[8].onclick = function(e){ turn(inputMenu[8],[]) };
	inputMenu[9].onclick = function(e){ turn(inputMenu[9],[7,10,11]) };
	inputMenu[10].onclick = function(e){ turn(inputMenu[10],[7,9,11]) };
	inputMenu[11].onclick = function(e){ turn(inputMenu[11],[7,9,10]) };
	inputMenu[12].onclick = function(e){ turn(inputMenu[12],[]) };
	inputMenu[2].value = 'czat';
	
	/* ID dla inputMenu
		- zalgo
		5	> kierunek: gora/dol/losowo
		6	> limit dlugosci - domyslnie '999'
initPush15	> guzik ON/OFF
				if ON:
					dlugosc w pionie - jesli wieksza niz (1000 - inputText.length) to (1000 - inputText.length)/inputText.length to ilosc znakow na 1 znak
		- inne bajery do tekstu:
		7	pisanie do gory nogami
		8	pisanie od tylu
		9	w babelkach
		10	pismo
		11	fullwidth
		12	długi tekst na raty
initPush13	odkryj uciszone [tylko dla mirkoczat premium]
		- flood
			if zalgo:
				odczytaj msg z variable
		0	> X wiadomosci
		1	> co ile sekund wysylac wiadomosc
initPush14	> guzik ON/OFF - gdy enable to od momentu wyslania wiadomosci bedzie sie ona powtarzac
		2	> chat/PW
				if PW:
					zabroń wpisywania komend czyli pierwszy znak nie moze byc slashem /
		3		> czarna lista do ktorej nie mozna pisac PW
		4		> biala lista do ktorej TYLKO pisac PW
*/
		
	
	
	MirkoGrief.onclick = function(){
		if(MirkoGriefTrigger){
			menuMirko.style.visibility = 'hidden';
			menuMirko.style.pointerEvents = "none";
			MirkoGriefTrigger = false;
			setCookie('MirkoGrief_blacklist',inputMenu[3].value,999);
			setCookie('MirkoGrief_whitelist',inputMenu[4].value,999);
			setCookie('MirkoGrief_chatOrPriv',inputMenu[2].value,999);
		} else {
			menuMirko.style.visibility = 'visible';
			menuMirko.style.pointerEvents = "auto";
			MirkoGriefTrigger = true;
			if(getCookie('MirkoGrief_blacklist')!==undefined){
				inputMenu[3].value = getCookie('MirkoGrief_blacklist');
			}
			if(getCookie('MirkoGrief_whitelist')!==undefined){
				inputMenu[4].value = getCookie('MirkoGrief_whitelist');
			}
			if(getCookie('MirkoGrief_chatOrPriv')!==undefined){
				inputMenu[2].value = getCookie('MirkoGrief_chatOrPriv');
			}
		}
	}
	chat_input[0].onclick = function(){
		menuMirko.style.visibility = 'hidden';
		menuMirko.style.pointerEvents = "none";
		MirkoGriefTrigger = false;
		setCookie('MirkoGrief_blacklist',inputMenu[3].value,999);
		setCookie('MirkoGrief_whitelist',inputMenu[4].value,999);
		setCookie('MirkoGrief_chatOrPriv',inputMenu[2].value,999);
	}
	chat_monitor.onclick = function(){
		menuMirko.style.visibility = 'hidden';
		menuMirko.style.pointerEvents = "none";
		MirkoGriefTrigger = false;
		setCookie('MirkoGrief_blacklist',inputMenu[3].value,999);
		setCookie('MirkoGrief_whitelist',inputMenu[4].value,999);
		setCookie('MirkoGrief_chatOrPriv',inputMenu[2].value,999);
	}
	setInterval(function(){
		if(getCookie('user')!==undefined){
			nickName = getCookie('user');
		}
		function getNickName(){
			setTimeout(function(){
				if(document.querySelector('html body#body div#content div.row div.col-sm-2.col-md-2.right div div div span')===null){
					getNickName();
				} else {
					nickName = String(document.querySelector('html body#body div#content div.row div.col-sm-2.col-md-2.right div div div span').innerHTML);
					setCookie('user',nickName,999);
				}
			}, 1000);
		}
		getNickName();
	},1000);
	});
}

function exec(msg){
	var _txt = { body: msg };
	mirkoczat.stream.doSendMessage(_txt);
}
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = 'expires='+d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}
function getCookie(cname) {
    var name = cname + '=';
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
}
var _getChannelIDhandler;
function getChannelID(name){
	$.get( "https://www.googleapis.com/youtube/v3/channels?key=AIzaSyAdJzOTTumbq4oo4SmlL_N_OiDJjunxfHI&forUsername=" + name + "&part=id&items=id", function( data ) {
		setTimeout(function()
		{
			_getChannelIDhandler = data;
		}, 500);
	});
}
function turn(e,toDisable){
	if(e.getAttribute('bool')=='true'){
		e.setAttribute('bool','false');
		if(toDisable){
			for(var i=0;i<toDisable.length;i++){
				inputMenu[parseInt(toDisable[i])].removeAttribute('disabled');
		}	}
	} else {
		e.setAttribute('bool','true');
		if(toDisable){
			for(var i=0;i<toDisable.length;i++){
				inputMenu[parseInt(toDisable[i])].setAttribute('disabled','');
	}	}	}
}


function textZalgo(input){
	let amountOfLetters = input.replace(/ /g,'').length;
	let zalgo = [ '\u030d','\u030e','\u0304','\u0305','\u033f','\u0311','\u0306','\u0310','\u0352','\u0357','\u0351','\u0307','\u0308','\u030a','\u0342','\u0343','\u0344','\u034a','\u034b','\u034c','\u0303','\u0302','\u030c','\u0350','\u0300','\u0301','\u030b','\u030f','\u0312','\u0313','\u0314','\u033d','\u0309','\u0363','\u0364','\u0365','\u0366','\u0367','\u0368','\u0369','\u036a','\u036b','\u036c','\u036d','\u036e','\u036f','\u033e','\u035b','\u0346','\u031a','\u0316','\u0317','\u0318','\u0319','\u031c','\u031d','\u031e','\u031f','\u0320','\u0324','\u0325','\u0326','\u0329','\u032a','\u032b','\u032c','\u032d','\u032e','\u032f','\u0330','\u0331','\u0332','\u0333','\u0339','\u033a','\u033b','\u033c','\u0345','\u0347','\u0348','\u0349','\u034d','\u034e','\u0353','\u0354','\u0355','\u0356','\u0359','\u035a','\u0323',
	//ukośne:
		'\u0315','\u031b','\u0340','\u0341','\u0358','\u035d','\u035e','\u0360','\u0361','\u0489', //up -10
		'\u0321','\u0322','\u0327','\u0328', '\u035c','\u035f','\u0362','\u0337','\u0489',//down -9
		'\u0334','\u0335','\u0336','\u034f','\u0338','\u0489']; // mid -6
		//0-49 up; 50-89 down; 90-99 midUP; midDOWN 100-109, midMID 110-115
         
	let zakresDown = 0;
	let zakresUp = 89;
	if(inputMenu[5].value=='góra')
		zakresUp=49;
	if(inputMenu[5].value=='dół')
		zakresDown=50;
	if(inputMenu[5].value=='góra i doł')
		zakresUp=89;
	let limitPerChar;
	if(((parseInt(inputMenu[6].value)*amountOfLetters)<=(500-amountOfLetters))||((inputMenu[11].innerHTML=='aktywne')&&(inputMenu[1].value=='PW'))){
		limitPerChar = parseInt(inputMenu[6].value);
	} else {
		limitPerChar = parseInt((500 - amountOfLetters)/amountOfLetters);
	}
	let output = '';
	for(var i=0;i<input.length;i++){
		if(input[i]==' '){
			output += input[i];
		} else {
			let glitch = '';
			if(inputMenu[5].value=='środek'){
				for(var j=0;j<limitPerChar/2;j++){
					glitch += zalgo[Math.floor((Math.random() * 89) + 0)];
					glitch += zalgo[Math.floor((Math.random() * (115-90)) + 90)];
				}
			} else {
				for(var j=0;j<limitPerChar;j++){
					glitch += zalgo[Math.floor((Math.random() * (zakresUp-zakresDown)) + zakresDown)];
				}
			}
			output += input[i] + glitch;
		}
	}
	console.log(output);
	return output;
}
function textUpSideDown(input){
	let alphabet = 'qwertyuiopasdfghjklzxcvbnm0123456789QWERTYUIOPASDFGHJKLZXCVBNM!?&()[]{}.,\'';
	let modified = 'bʍǝɹʇʎnᴉodɐspɟƃɥɾʞlzxɔʌquɯ0ƖᄅƐㄣϛ9ㄥ86QMƎɹ┴⅄∩IOԀ∀SpℲפHſʞ˥ZXƆΛqNW¡¿⅋)(][}{˙\',';
	let output = '';
	for(var i=input.length-1;i>=0;i--){
		if(modified[alphabet.indexOf(input[i])]!=undefined){
			output += modified[alphabet.indexOf(input[i])];
		} else {
			output += input[i];
		}
	}
	return output.replace('"',',,');
}
function textBackwards(input){
	let output = '';
	for(var i=input.length-1;i>=0;i--){
		output += input[i];
	}
	return output;
}
function textBubble(input){
	let alphabet = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
	let modified = 'ⓠⓦⓔⓡⓣⓨⓤⓘⓞⓟⓐⓢⓓⓕⓖⓗⓙⓚⓛⓩⓧⓒⓥⓑⓝⓜⓆⓌⒺⓇⓉⓎⓊⒾⓄⓅⒶⓈⒹⒻⒼⒽⒿⓀⓁⓏⓍⒸⓋⒷⓃⓂ';
	let output = '';
	for(var i=0;i<input.length;i++){
		if(modified[alphabet.indexOf(input[i])]!=undefined){
			output += modified[alphabet.indexOf(input[i])];
		} else {
			output += input[i];
		}
	}
	return output;
}
function textHand(input){
	let alphabet = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBN ';
	let modified = '???????????????????????????????????????????????????  ';
	let output = '';
	for(var i=0;i<input.length;i++){
		if(modified[alphabet.indexOf(input[i])]!=undefined){
			output += modified[alphabet.indexOf(input[i])*2] + modified[(alphabet.indexOf(input[i])*2)+1];
		} else {
			output += input[i];
		}
	}
	return output;
}
function textFullWidth(input){	
	let alphabet = 'qwertyuiopasdfghjklzxcvbnm0123456789QWERTYUIOPASDFGHJKLZXCVBNM!?&().,\' ';
	let modified = 'ｑｗｅｒｔｙｕｉｏｐａｓｄｆｇｈｊｋｌｚｘｃｖｂｎｍ０１２３４５６７８９ＱＷＥＲＴＹＵＩＯＰＡＳＤＦＧＨＪＫＬＺＸＣＶＢＮＭ！？＆（）．，＇ ';
	let output = '';
	for(var i=0;i<input.length;i++){
		if(modified[alphabet.indexOf(input[i])]!=undefined){
			output += modified[alphabet.indexOf(input[i])];
		} else {
			output += input[i];
		}
	}
	return output;
}


chat_input[0].addEventListener( 'keypress', function(e){
	let key = e.which || e.keyCode;
	if(key === 13 && chat_input[0].value.length > 0){
        let _input = chat_input[0].value;
		
		if(inputMenu[7].checked)
			_input = textUpSideDown(_input);
		if(inputMenu[8].checked)
			_input = textBackwards(_input);
		if(inputMenu[9].checked)
			_input = textBubble(_input);
		if(inputMenu[10].checked)
			_input = textHand(_input);
		if(inputMenu[11].checked)
			_input = textFullWidth(_input);
		if(inputMenu[15].innerHTML=='aktywne')
			_input = textZalgo(_input);
		
		if(inputMenu[12].checked){
			let amount = parseInt(inputMenu[0].value);
			let rate = inputMenu[1].value * 1000;
			let executeLobby = [];
			
			function update(){
				if(executeLobby.length > 0){
					exec( executeLobby[0] );
					executeLobby.splice( 0, 1 );
					setTimeout(function(){
						update();
					}, rate);
				}
			}
			let _lastIndex = 0; let _parts = Math.ceil(_input.length / 900); let _onePartLength = Math.ceil(_input.length / _parts); let _nextIndex = _onePartLength;
			let i=0;
			while(i < _parts){
				var _txt = _input.slice(_lastIndex, _nextIndex);
				var _txt2 = _txt.slice(0, _txt.lastIndexOf(' '));
				var _txtToRead;
				if(_txt.length<800){
					_txtToRead = _txt.slice(0, _txt.length);
				} else {
					_txtToRead = _txt.slice(0, _txt.lastIndexOf(' '));
				};
				var _diff = _txt.length - _txt2.length;
				if(_diff > 0){
					_lastIndex += _onePartLength;
					_nextIndex += _onePartLength;
					_lastIndex -= _diff;
					_nextIndex -= _diff;
				} else {
					_lastIndex += _onePartLength;
					_nextIndex += _onePartLength;
				}
				if((_nextIndex - _onePartLength < _input.length) && ((i+2) < _parts)){
					_parts++;
				};
				executeLobby.push(_txtToRead);
				i++;
			}
			update();
		} else if(inputMenu[14].innerHTML=='aktywne'){
			let amount = parseInt(inputMenu[0].value);
			let rate = inputMenu[1].value * 1000;
			let blacklist = inputMenu[3].value.split(' ');
			let whitelist = inputMenu[4].value.split(' ');
			if(inputMenu[2].value=='PW'){
				if(_input[0]=='/')
					alert('Nie używaj komend dla flood PW, bo i tak nie zadziałają !!!');
				if(whitelist[0]!=''){
					let iteration = 0;
					let intervalID = setInterval(function(){
						if(inputMenu[14].innerHTML=='nieaktywne')
							clearInterval( intervalID );
						for(var i=0;i<amount;i++){
							if(whitelist[iteration]=='')
								iteration++;
							if(iteration>whitelist.length-1)
								iteration=0;
							if(whitelist[iteration].length<1)
								iteration++;
							exec('/msg ' + whitelist[iteration] + ' ' + _input);
							iteration++;
						}
					}, rate);
				} else {
					let users = chat_input[0].getAttribute('data-mentions');
					for(var i=0;i<blacklist.length;i++){
						users = users.replace(blacklist[i],'').replace('  ',' ');
					}
					users = users.replace(nickName,'').replace('  ',' ');
					users = users.split(' ');
					let iteration = 0; let lastUser = '';
					let intervalID = setInterval(function(){
						
						users = chat_input[0].getAttribute('data-mentions');
						for(var i=0;i<blacklist.length;i++){
							users = users.replace(blacklist[i],'').replace('  ',' ');
						}
						users = users.replace(nickName,'').replace('  ',' ');
						users = users.split(' ');
						if(users.indexOf(lastUser)!=-1)
							iteration = users.indexOf(lastUser)+1;
						
						if(inputMenu[14].innerHTML=='nieaktywne')
							clearInterval( intervalID );
						for(var i=0;i<amount;i++){
							if(users[iteration]=='')
								iteration++;
							if(iteration>users.length-1)
								iteration=0;
							if(users[iteration].length<1)
								iteration++;
							exec('/msg ' + users[iteration] + ' ' + _input);
							lastUser = users[iteration];
							iteration++;
						}
					}, rate);
				}
			} else {
				let intervalID = setInterval(function(){
					if(inputMenu[14].innerHTML=='nieaktywne')
						clearInterval( intervalID );
					for(var i=0;i<amount;i++){
						exec(_input);
					}
				}, rate);
			}
		} else {
			exec(_input);
		}
	chat_input[0].value = '';
	}
});
})();