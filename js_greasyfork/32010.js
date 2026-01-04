// ==UserScript==
// @name     MirkoczatPremium
// @author   Nizax
// @include  http://*mirkoczat.pl*
// @include  https://*mirkoczat.pl*
// @version  1.2
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @namespace http://mirkoczat.pl
// @description Adds mirkoczat.pl integration
// @downloadURL https://update.greasyfork.org/scripts/32010/MirkoczatPremium.user.js
// @updateURL https://update.greasyfork.org/scripts/32010/MirkoczatPremium.meta.js
// ==/UserScript==

(function() {
    'use strict';
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};
if(window.location.pathname.slice(0,3)=="/i/"){
	var _iframe = document.getElementsByTagName( 'iframe' )[0].src;
	if((_iframe !== undefined || "" || null) && !(_iframe.includes("mirkoczat.pl"))){
		setCookie(window.location.pathname.slice(3, window.location.pathname.length), _iframe, 999);
	};
	window.location.href="http://mirkoczat.pl/embed_t/"+window.location.pathname.slice(3,window.location.pathname.length);
}
$(document).ready(function() {
if( window.location.protocol != "http:" ){
	window.location.href= "http://" + window.location.host + window.location.pathname;
}else if((window.location.pathname.slice(0,8) == "/embed_t" || window.location.pathname.slice(0,2) == "/t") && !(window.frameElement)){
var nizax_chat = document.getElementsByClassName( "chat" )[0];
var nizax_input = nizax_chat.getElementsByTagName( 'input' )[0];
var nizax_messages = nizax_chat.getElementsByTagName( 'div' )[6];
var chat_section = document.getElementsByClassName( "col-xs-12 mid" )[0];
var container = document.getElementById( 'content' );
if(window.location.pathname.slice(0,8) == "/embed_t"){
	container.style.margin = "0";
}

// dostosuj wygląd
function getCookie(cname) {
    var name = cname + "=";
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
    return "";
};

var nickName;
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

var _getChannelIDhandler;
function getChannelID(name){
	$.get( "https://www.googleapis.com/youtube/v3/channels?key=AIzaSyAdJzOTTumbq4oo4SmlL_N_OiDJjunxfHI&forUsername=" + name + "&part=id&items=id", function( data ) {
		setTimeout(function()
		{
			_getChannelIDhandler = data;
		}, 500);
	});
};

var iframe = document.createElement( 'iframe' );
var _channel = window.location.pathname.slice(9,window.location.pathname.length);
var _guziczek = document.createElement( 'button' );
var _okienko = document.createElement( 'div' );
var _rubryka = document.createElement( 'input' );
if(window.location.pathname.slice(0,8) == "/embed_t"){
	chat_section.style.position = "absolute"; chat_section.style.right = "0px"; chat_section.style.height = (window.innerHeight + 30) + "px"; chat_section.style.width = "30%";
	
	if(getCookie(_channel) != ""){
		var _ciastko = getCookie(_channel);
		if(_ciastko.includes("http:") || _ciastko.includes("https:") || _ciastko.includes("www.")){
			iframe.src = _ciastko;
		} else {
			iframe.src = "https://www.youtube.com/embed/live_stream?channel=" + _ciastko;
		};
	} else {
		_okienko.style.margin = "0"; _okienko.style.position = "absolute"; _okienko.style.top = "5%"; _okienko.style.width = "70%";
		
		_rubryka.style.position = "relative"; _rubryka.style.width = "100%"; _rubryka.style.height = "4%";
		_rubryka.type = "text"; _rubryka.placeholder = "podaj link do KANAŁU youtube np. https://www.youtube.com/channel/UCNArdo_iHMiRBbFvFk_e--w";
		_guziczek.style.width = "100%"; _guziczek.style.color = "black"; _guziczek.style.height = "2%";
		_guziczek.innerHTML = "gotowe";
		
		_okienko.appendChild( _rubryka );
		_okienko.appendChild( _guziczek );
		container.prepend( _okienko );
	};
	
	iframe.style.position = "absolute"; iframe.style.left = "0px"; iframe.style.height = (window.innerHeight + 30) + "px"; iframe.style.width = "70%"; iframe.frameBorder = "0";
	container.prepend( iframe );
};
_guziczek.onclick = function(){
	var _ytchannelID;
	var _type = _rubryka.value;
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
		var _userName = _rubryka.value.slice( _rubryka.value.lastIndexOf("/") + 1, _rubryka.value.length );
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
		throw new Error('[MirkoczatPremium] Podano zły format linku. Skrypt obsługuje tylko yt.com/channel (yt user) lub yt.com/user (google user)');
	} else {
		iframe.src = 'https://www.youtube.com/embed/' + _type;
	};
};

// guzik mirkoczat+
var input_box = nizax_chat.getElementsByTagName( 'div' )[2];
var MirkoczatPremium = document.createElement( 'button' );
MirkoczatPremium.style.color = "#fa8130"; MirkoczatPremium.style.backgroundColor = "#d3d3d3"; MirkoczatPremium.style.borderRadius = "30px"; MirkoczatPremium.style.height = "30px"; MirkoczatPremium.style.border = "2px solid #357ea9"; MirkoczatPremium.style.width = "35px"; MirkoczatPremium.style.position = "absolute"; MirkoczatPremium.style.right = "90px"; MirkoczatPremium.style.top = "3px"; MirkoczatPremium.style.margin = "auto"; MirkoczatPremium.innerHTML = "M+"; MirkoczatPremium.style.fontWeight = "bold";
input_box.style.marginRight = "130px"; MirkoczatPremium.onclick = "MirkoczatPremiumMenu()";
input_box.prepend( MirkoczatPremium );
	// menu mirkoczatu+
MirkoczatPremium.trigger = true;
var menuMirko = document.createElement( 'div' );
menuMirko.opcja = [];
menuMirko.style.backgroundColor = "rgba(128,128,128,0.9)";
menuMirko.style.position = "absolute"; menuMirko.style.width = "100%"; menuMirko.style.border = "2px solid gray"; menuMirko.style.visibility = "hidden"; menuMirko.style.color = "white"; menuMirko.style.marginRight = "-130px"; menuMirko.style.fontWeight = "bold";
input_box.style.pointerEvents = "none"; nizax_input.style.pointerEvents = "auto"; MirkoczatPremium.style.pointerEvents = "auto"; menuMirko.style.pointerEvents = "none"; menuMirko.style.zIndex = '99';
input_box.appendChild( menuMirko );

var options = [];
var iframeInput;
var ChatColors = ["#339933", "#ff5917", "#bb0000", "#ff0000", "#999999", "#ffffff", "#e5a3ad", "#ff3098", "#000045", "#40ff00", "#00d9f9", "#b3ccff", "#ffff00", "#aaf0d1", "#f5ff00", "#00abcf", "#6600a2", "#339933", "#6600ff", "#000000", "#e0e0ff", "#7100aa", "#b6e339", "#3f6fa0", "#ff3e96", "#00ff6b", "#c7c1a7", "#873aa4", "#00c9e9"];
var ChatColorsList = document.createElement( 'li' );
ChatColorsList.innerHTML = "Zmień kolor nicku na: ";
var _szerokoscListKolor = nizax_chat.clientWidth / ChatColors.length / 1.5;
ChatColorsList.style.position = "relative";
ChatColorsList.style.display = "inline-flex";
for(var i=0; i < ChatColors.length; i++){
	var _li = document.createElement( 'a' );
	_li.style.width = _szerokoscListKolor + "px";
	_li.style.height = _szerokoscListKolor + "px";
	_li.style.backgroundColor = ChatColors[i];
	_li.style.borderRadius = "7px";
	_li.title = i;
	_li.style.marginLeft = "1px";
	ChatColorsList.appendChild( _li );
};
var premium_info_box = document.createElement( 'center' );
premium_info_box.style.position = "relative";
premium_info_box.style.bottom = "0px";
premium_info_box.innerHTML = "<br />[><i>Schowaj okienko aby zatwierdzić zmiany</i><]";
if(window.location.pathname.slice(0,8) == "/embed_t"){
	menuMirko.innerHTML = '<li><input type="checkbox"> Losuj kolor nicku co każdy wpis</input></li><li><input type="checkbox"> Wiadomosci widzą tylko użytkownicy MirkoczatPremium</input></li><li><input type="checkbox"> Zwykłe emotki zamieniane na lenny face <a style="color:#404040" target="_blank" href="https://pastebin.com/raw/NRLw3YbZ">(jakie?)</a></input></li><li>[X] TTS Iwona /i [treść]</li><li><input type="button" value="Załóż PlusBank"></input></li><li>[X] Osadzony stream: <br /><textarea style="width:100%; color:black" rows="2"></textarea></li>';
	options = menuMirko.getElementsByTagName( 'input' );
	iframeInput = menuMirko.getElementsByTagName( 'textarea' )[0];
	iframeInput.placeholder = "podaj link do KANAŁU youtube np. \nhttps://www.youtube.com/channel/UCNArdo_iHMiRBbFvFk_e--w"
	iframeInput.innerHTML = iframe.src;
} else{
	menuMirko.innerHTML = '<li><input type="checkbox"> Losuj kolor nicku co każdy wpis</input></li><li><input type="checkbox"> Wiadomosci widzą tylko użytkownicy MirkoczatPremium</input></li><li><input type="checkbox"> Zwykłe emotki zamieniane na lenny face <a style="color:#404040" target="_blank" href="https://pastebin.com/raw/NRLw3YbZ">(jakie?)</a></input></li><li>[X] TTS Iwona /i [treść]</li><li><input type="button" value="Załóż PlusBank"></input></li>';
	options = menuMirko.getElementsByTagName( 'input' );
	iframeInput = {
		value: ""
	};
};
menuMirko.appendChild(ChatColorsList);

// zapisz zmiane koloru do var. Aby później zatwierdzić ją chowając okienko M+
var _colorChange = "";
ChatColorsList.onclick = function(e){	
	_colorChange = "/group " + e.path[0].title;
};
menuMirko.appendChild(premium_info_box);

function rgbToHex(color) {
    color = ""+ color;
    if (!color || color.indexOf("rgb") < 0) {
        return;
    }
    if (color.charAt(0) == "#") {
        return color;
    }
    var nums = /(.*?)rgb\((\d+),\s*(\d+),\s*(\d+)\)/i.exec(color),
        r = parseInt(nums[2], 10).toString(16),
        g = parseInt(nums[3], 10).toString(16),
        b = parseInt(nums[4], 10).toString(16);
    return "#"+ (
        (r.length == 1 ? "0"+ r : r) +
        (g.length == 1 ? "0"+ g : g) +
        (b.length == 1 ? "0"+ b : b)
    );
}

function mirkoTrigger(madeBy){
	if(MirkoczatPremium.trigger == true && madeBy == "button"){
		menuMirko.style.visibility = "visible";
		menuMirko.style.pointerEvents = "auto";
		MirkoczatPremium.trigger = false;
	} else {
		menuMirko.style.visibility = "hidden";
		menuMirko.style.pointerEvents = "none";
		MirkoczatPremium.trigger = true;
		if(iframeInput.value != iframe.src){
			var _link = iframeInput.value;
			var _ytchannelID;
			var _type = _link;
			_type = _type.split('/');
			_type = _type[_type.length - 2];
			if(_type == "user"){
				var _userName = _link.slice( _link.lastIndexOf("/") + 1, _link.length );
				getChannelID( _userName );
				setTimeout(function()
				{
					_ytchannelID = _getChannelIDhandler.items[0].id;
					iframe.src = "https://www.youtube.com/embed/live_stream?channel=" + _ytchannelID;
					setCookie(_channel, _ytchannelID, 999);
					iframeInput.value = "https://www.youtube.com/embed/live_stream?channel=" + _ytchannelID;
				}, 1000);
			} else if(_type == "channel"){
				_ytchannelID = _link.slice( _link.lastIndexOf("/") + 1, _link.length );
				iframe.src = "https://www.youtube.com/embed/live_stream?channel=" + _ytchannelID;
				setCookie(_channel, _ytchannelID, 999);
				iframeInput.value = "https://www.youtube.com/embed/live_stream?channel=" + _ytchannelID;
			} else if(!(iframeInput.value.value.trim() == '' || undefined) || !(iframeInput.value == iframe.src)){ 
				alert("Niepoprawny format linku. Musisz podać link do KANAŁU np.\nhttps://www.youtube.com/channel/UCNArdo_iHMiRBbFvFk_e--w \nEWENTUALNIE \nhttps://www.youtube.com/user/Owsiaknet");
				iframeInput.value = iframe.src;
				throw new Error('[MirkoczatPremium] Podano zły format linku. Skrypt obsługuje tylko yt.com/channel (yt user) lub yt.com/user (google user)');
			};
		};
		if(_colorChange !== ""){
			sudo(_colorChange);
			_colorChange = "";
		};
	};
};
MirkoczatPremium.onclick = function(){
	mirkoTrigger("button");
};
nizax_input.onclick = mirkoTrigger;
nizax_messages.onclick = mirkoTrigger;


// CZYTAJ ŚLEDZONYCH
var _sledzeni = getCookie('followed');
var _podswietlSledzonych = getCookie('podswietlsledzonych');
var _czytajSledzonych = getCookie('czytajsledzonych');
if(window.location.pathname.slice(0,2) == "/t"){
	var _save = document.querySelector('html #body #content div div.col-sm-2.col-md-2.right div div div button.btn.btn-primary');
	var followedBox = document.querySelector('html #body #content div div div div div div textarea#followed.form-control');
	if(getCookie('followed')===''){
		setCookie('followed', String(followedBox.value), 999);
	}

	var followedInputBox = document.createElement('div');
	followedInputBox.className = 'checkbox';
	var podswietlSledzonych = document.createElement( 'input' );
	var czytajSledzonych = document.createElement( 'input' );
	podswietlSledzonych.type = 'checkbox';
	czytajSledzonych.type = 'checkbox';

	followedInputBox.innerHTML = '<label class="podswietlSledzonych"> Podświetl śledzonych</label><br /><label class="czytajSledzonych"> Czytaj co piszą śledzeni</label>';
	if(getCookie('podswietlsledzonych')!==''){
		var _bool = (getCookie('podswietlsledzonych')==='true');
		podswietlSledzonych.checked = _bool;
	} else {
		podswietlSledzonych.checked = true;
		setCookie('podswietlsledzonych', 'true', 999);
	}
	if(getCookie('czytajsledzonych')!==''){
		var _bool = (getCookie('czytajsledzonych')==='true');
		czytajSledzonych.checked = _bool;
	} else {
		czytajSledzonych.checked = false;
		setCookie('czytajsledzonych', 'false', 999);
	}


	followedBox.parentElement.appendChild( followedInputBox );
	var labelPodswietl = followedBox.parentElement.querySelector('label.podswietlSledzonych');
	var labelCzytaj = followedBox.parentElement.querySelector('label.czytajSledzonych');
	labelPodswietl.prepend(podswietlSledzonych);
	labelCzytaj.prepend(czytajSledzonych);

	_save.onclick = function(){
		setCookie('followed', String(followedBox.value), 999);
		_sledzeni = String(followedBox.value);
		setCookie('podswietlsledzonych', String(podswietlSledzonych.checked), 999);
		_podswietlSledzonych = String(podswietlSledzonych.checked);
		setCookie('czytajsledzonych', String(czytajSledzonych.checked), 999);
		_czytajSledzonych = String(czytajSledzonych.checked);
	}
}


// LOSUJ GRUPE
var _lastdate = new Date();
var _lastmsg,_lastmsg2,_actualdate,_commandInfoToDelete;
var _delay = false;

// WYŚLIJ NA CZAT
function sudo(msg){
	//console.log('[!] SUDO: ' + msg);
	var _txt = { body: msg };
	mirkoczat.stream.doSendMessage(_txt);
};
function voiceRead(msg){
	var t=speechSynthesis.getVoices().filter(function(e){return"pl-PL"==e.lang})[0],n=new SpeechSynthesisUtterance(msg);n.voice=t,speechSynthesis.speak(n);
}

// Lista wszystkich userow do zawolania
var zawolajLobby = [];
function zawolajUpdate(){
	if(zawolajLobby.length > 0){
		sudo( zawolajLobby[0] );
		zawolajLobby.splice( 0, 1 );
		setTimeout(function(){
			zawolajUpdate();
		}, 2500);
	};
};

// SKRACAJ LINKI
function shortMyUrl(long_url, func){
    $.getJSON(
        "http://api.bit.ly/v3/shorten",
        {
            "format": "json",
            "apiKey": "R_82b68592e35143ce809b95ef0fc8d873",
            "login": "mirkowona",
            "longUrl": long_url
        },
        function(response)
        {
            func(response.data.url);
        }
    );
}
// SPRAWDZA CZY TO HTML ELEMENT
function isElement(o){
  return (
    typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
    o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
);
}

nizax_input.addEventListener( 'keypress', function(e){
	var key = e.which || e.keyCode;
	if(key === 13 && nizax_input.value.length > 0){
        var _input = nizax_input.value;
        if(_input.slice(0,3) === "/i " && _input.length > 3 && /\S/.test(_input.slice(3,_input.length))){
            var _msg = _input.slice(3,_input.length);
            _msg = _msg.replace(" ","%20");
            var long_url = "https://code.responsivevoice.org/getvoice.php?t=" + _msg + "&tl=pl-PL";
			nizax_input.value = '';
            shortMyUrl(long_url, function(short_url) {
                sudo('/me mówi: ' + short_url);
            });
		} else if(_input.includes("/ups") && !(_input.includes("-")) && !(isElement(nickName))){
			nizax_input.value = "";
			var _amountToDelete = parseInt(_input.slice(5,_input.length));
			var i = 0;
			var allMessages = nizax_messages.querySelectorAll( 'div div.avatar-plus' );
			for(var i=0;i<allMessages.length - 1;i++){
				if(((_amountToDelete>0) || isNaN(_amountToDelete)) && (allMessages[i].parentElement.getAttribute('premiummirko')==='true')){
					deleteMessage(allMessages[i].parentElement.parentElement.getAttribute('uid'));
				} else if(_amountToDelete===0){
					break;
				}
				if((allMessages[i].parentElement.querySelector('a').innerHTML===nickName) && (allMessages[i].parentElement.getAttribute('premiummirko')!=='true')){
					_amountToDelete--;
				}
			}
			setTimeout(function(){
				sudo(_input);
			}, 10);
		} else if(_input.includes('@everyone') || _input.includes('@wszyscy') || _input.includes('@all')){
			nizax_input.value = "";
			if(confirm("Czy oby na pewno chcesz zawołać wszystkich którzy są na tym czacie?") == true) {
				sudo(_input);
				var _nicki = nizax_chat.querySelector('div div input#message-input.form-control').getAttribute('data-mentions');
				_nicki = '@' + _nicki;
				_nicki = _nicki.replace(/ /g,' @');
				
				var _lastIndex = 0; var _parts = Math.ceil(_nicki.length / 950); var _onePartLength = Math.ceil(_nicki.length / _parts); var _nextIndex = _onePartLength;
				var i=0;
				while(i < _parts){
					var _txt = _nicki.slice(_lastIndex, _nextIndex);
					var _txt2 = _txt.slice(0, _txt.lastIndexOf(' '));
					var _txtToRead;
					if(_txt.lastIndexOf(' ')!==' '){
						_txtToRead = _txt;
					} else if((_txt[_txt.lastIndexOf(' ')]===' ') && _txt.lastIndexOf(' ') !== 0){
						_txtToRead = _txt.slice(0, _txt.lastIndexOf(' '));
					} else {
						_txtToRead = _txt;
					}
					if(_nicki.length > 950){
						var _diff = _txt.length - _txt2.length;
						_lastIndex += _onePartLength;
						_nextIndex += _onePartLength;
						if(_diff > 0){
							_lastIndex -= _diff;
							_nextIndex -= _diff;
						};
						if((_nextIndex - _onePartLength < _nicki.length) && (i+2 > _parts)){
							_parts++;
						};	
					}
					zawolajLobby.push(_txtToRead);
					i++;
				};
				zawolajUpdate();
			}
        } else if((options[0].checked || options[1].checked || options[2].checked) && !(nizax_input.value[0] === "/") && !(nizax_input.value.includes("[Tą wiadomość widzą użytkownicy MirkoczatPremium]"))){
			if(options[0].checked){
				_actualdate = new Date();
				if((_actualdate - _lastdate > 11000) && (_delay === false)){
					_delay = true;
					setTimeout(function(){
						_lastdate = new Date();
						setTimeout(function() {
							sudo("/group " + Math.floor((Math.random() * 28) + 1));
							_commandInfoToDelete = 'Możesz zmienić kolor raz na';
							_delay = false;
						}, 50);
					}, 10);
				} else if(_delay === false) {
					_delay = true;
					setTimeout(function(){
						_lastdate = new Date();
						setTimeout(function() {
							sudo("/group " + Math.floor((Math.random() * 28) + 1));
							_commandInfoToDelete = 'Możesz zmienić kolor raz na';
							_delay = false;
						}, 50);
					}, (_actualdate - _lastdate + 11000));
				};				
			};
			if(options[2].checked){
				var element = nizax_input;
				element.value = element.value.replace(/;\(/g,"(╯︵╰,)").replace(/;\)/g,"(͠°‿°)").replace(/:F/g,"щ（ﾟДﾟщ）").replace(/B\)/g,"(⌐͡■͜ʖ͡■)").replace(/:3/g,"(｡◕‿‿◕｡)").replace(/<3/g,"❤️").replace(/ ^^/g," (͡ᵔ͜ʖ͡ᵔ)").replace(/:c/g,"(͡°ʖ̯͡°)").replace(/:o/g,"(͡°.͡°)").replace(/ O\.O/g," (ʘ‿ʘ)").replace(/0\.0/g,"(ʘ‿ʘ)").replace(/o\.o/g,"ಠ_ಠ").replace(/o\.O/g,"(。ヘ°)").replace(/o\.0/g,"(。ヘ°)").replace(/O\.o/g,"(・へ・)").replace(/0\.o/g,"(・へ・)").replace(/;_:/g,"(ಥ﹏ಥ)").replace(/;_;/g,"(╥﹏╥)").replace(/\[HIT\]/g,"█▬█ █ ▀█▀");
			};
			if(options[1].checked){
                var _input = zakoduj(nizax_input.value);
				nizax_input.value = _input;
			};
		};
	};
});
/*
	> Podmiana emotek (v1.2)
		;(		(╯︵╰,)
		;)		( ͠°‿ °)
		:F		щ（ﾟДﾟщ）
		B)		(⌐ ͡■ ͜ʖ ͡■)
		:3		(｡◕‿‿◕｡)
		<3		❤️
		^^	( ͡ᵔ ͜ʖ ͡ᵔ )
		:c		( ͡° ʖ̯ ͡°)
		:o		( ͡°. ͡°)
		O.O	(ʘ‿ʘ)
		o.o	ಠ_ಠ
		o.O	(。ヘ°)	lub o.0
		O.o	(・へ・)	lub 0.o
		;_:	(ಥ﹏ಥ)
		;_;	(╥﹏╥)
		[HIT]	█▬█ █ ▀█▀
*/

// PLUSBANK

var plusBankMembers = [];
var plusBankMode = 'closed';
options[3].setAttribute('style', 'color: #665600; background-color: #e5c100; border-radius: ' + options[3].clientHeight + 'px;');
var _plusBankInfo = document.createElement('b');
options[3].parentElement.appendChild(_plusBankInfo);
options[3].onclick = function(){
	if(options[3].value==='Załóż PlusBank'){
		var code = String(alphabet[Math.floor((Math.random() * 82))] + alphabet[Math.floor((Math.random() * 82))] + alphabet[Math.floor((Math.random() * 82))] + alphabet[Math.floor((Math.random() * 82))] + alphabet[Math.floor((Math.random() * 82))] + alphabet[Math.floor((Math.random() * 82))] + alphabet[Math.floor((Math.random() * 82))] + alphabet[Math.floor((Math.random() * 82))]);
		options[3].value = 'Zamknij PlusBank';
		_plusBankInfo.innerHTML = ' Dołączyło: 0';
		sudo('[Tą wiadomość widzą użytkownicy MirkoczatPremium] ' + code + ' [999]');
		plusBankMode = 'open';
	} else if(options[3].value==='Zamknij PlusBank'){
		if(plusBankMembers.length > 0){
			for(var i=0;i<plusBankMembers.length;i++){
				sudo('/msg ' + plusBankMembers[i] + ' [PlusBank] To jusz jezt koniec.');
			}
			plusBankMembers = [];
		}
		_plusBankInfo.innerHTML = '';
		options[3].value = 'Załóż PlusBank';
		plusBankMode = 'closed';
	} else if(options[3].value==='Opuść PlusBank'){
		sudo('/msg ' + plusBankMode + ' [PlusBank] Wychodzę i nie wiem kiedy wrócę.');
		_plusBankInfo.innerHTML = '';
		options[3].value = 'Załóż PlusBank';
		plusBankMode = 'closed';
	}

}


mirkoczat.stream.onMessagePriv(function(e,s){
	// zbieranie informacji o priv
	var _nadawca = String(s.user).slice(0,String(s.user).length - 7);
	var _odbiorca = String(s.called);
	var _tresc = String(s.body).slice(6 + _odbiorca.length, String(s.body).length);
	
	// zbieranie informacji o wiadomosci 
	var msgHtmlElem = nizax_messages.querySelector('div.avatar-plus');
	var message = msgHtmlElem.parentElement;
	var uid = String(s.uid);
	message.setAttribute('msg', _tresc);
	message.setAttribute('uid', uid);


	// WIADOMOŚCI PRZYCHODZĄCE
	
	if(_nadawca !== nickName){
	/*	 //-=-=-=-=-=-=-=-=-= \\
		|| -=-= PLUS BANK =-=- ||
		 \\ -=-=-=-=-=-=-=-=-=//	*/
		 if(plusBankMode==='open'){
			 
			// JEŚLI OTRZYMAM REQUEST DO MOJEJ GRUPY
			if(_tresc==='[PlusBank] Dolaczam.'){
				plusBankMembers.push(_nadawca);
				sudo('/msg ' + _nadawca + ' [PlusBank] tej, dawajwaeqeqwedsAkmgklawrmweirhi812283y9 thnb2f7');
				_plusBankInfo.innerHTML = ' Dołączyło: ' + plusBankMembers.length;
				deleteMessage(uid);
			
			// JEŚLI OTRZYMAM WYPOWIEDZENIE Z MOJEJ GRUPY
			} else if(_tresc==='[PlusBank] Wychodzę i nie wiem kiedy wrócę.'){
				plusBankMembers.splice( plusBankMembers.indexOf(_nadawca),1 );
				_plusBankInfo.innerHTML = ' Dołączyło: ' + plusBankMembers.length;
				deleteMessage(uid);
			}
			
		} else if(plusBankMode==='closed'){
			// JEŚLI MÓJ REQUEST DO CZYJEJŚ GRUPY DOSTAŁ POTWIERDZENIE
			if(_tresc==='[PlusBank] tej, dawajwaeqeqwedsAkmgklawrmweirhi812283y9 thnb2f7'){
				plusBankMode = _nadawca;
				options[3].value = 'Opuść PlusBank';
				_plusBankInfo.innerHTML = 'Jesteś członkiem grupy należącej do: ' + _nadawca;
				deleteMessage(uid);
			}
			
		// GDY KTOŚ NALEŻY DO KOGOŚ
		} else {
			
			// JEŚLI ZAŁOŻYCIEL GRUPY ZAPLUSOWAŁ
			if(_tresc.includes('[PlusBank] [PLUS]') && (plusBankMode===_nadawca)){
				//console.log('wysyłamy plusa do: ' + _tresc.slice(18,_tresc.length));
				sendPlus(_tresc.slice(18,_tresc.length), true);
				deleteMessage(uid);
			
			// JEŚLI ZAŁOŻYCIEL ZAWIESZA GRUPĘ
			} else if(_tresc==='[PlusBank] To jusz jezt koniec.'){
				//console.log('to juz koniec');
				plusBankMode = 'closed';
				options[3].value = 'Załóż PlusBank';
				_plusBankInfo.innerHTML = '';
				var _specjalnaWiadomosc = {
					specjalnaWiadomosc: '[PlusBank] Zamykamy: ' + _nadawca
				}
				replaceMessage(uid,_specjalnaWiadomosc);
			}
		}
		
	// WIADOMOŚCI PRZYCHODZĄCE
	} else if(_odbiorca !== nickName){

	}
	if(_tresc.includes('[PlusBank] ')){
		deleteMessage(uid);
	}
});

mirkoczat.stream.onInfoLeave(function(e,s){
   if((plusBankMode==='open') && (plusBankMembers.includes(s.user))){
		plusBankMembers.splice( plusBankMembers.indexOf(s.user),1 );
		_plusBankInfo.innerHTML = ' Dołączyło: ' + plusBankMembers.length;
   } else if(plusBankMode===s.user){
		plusBankMode = 'closed';
		options[3].value = 'Załóż PlusBank';
		_plusBankInfo.innerHTML = '';
   }
});

// ---


function getMessageUid(msg){
	var _chatMsgs = nizax_messages.getElementsByClassName('avatar-plus');
	for(var i=0;i<_chatMsgs.length - 1;i++){
		if(_chatMsgs[i].parentElement.getAttribute('msg') === msg){
			return _chatMsgs[i].parentElement.getAttribute('uid');
			break;
		}
	}
}
function getMessageHtmlElement(uid){
	var _chatMsgs = nizax_messages.getElementsByClassName('avatar-plus');
	for(var i=0;i<_chatMsgs.length - 1;i++){
		if(_chatMsgs[i].parentElement.getAttribute('uid') === uid){
			if(_chatMsgs[i].parentElement.getAttribute('premiummirko')==='true'){
				return _chatMsgs[i].parentElement;
				break;
			} else if(_chatMsgs[i].parentElement.getAttribute('mirkopremiuminside')===null){
				return _chatMsgs[i].parentElement;
				break;
			} else if(_chatMsgs[i].parentElement.getAttribute('mirkopremiuminside')==='true'){
				return _chatMsgs[i].parentElement;
				break;
			}
		}
	}
}


// ONLY UID
function replaceMessage(uid,newMsg){
	var _chatMsgs = nizax_messages.getElementsByClassName('avatar-plus');
	var _loopLimit;
	if(_chatMsgs.length > 50){
		_loopLimit = 50;
	} else {
		_loopLimit = _chatMsgs.length - 1;
	};
	var _specjalnePolecenie = newMsg.specjalnaWiadomosc;
	for(var i=0;i<_loopLimit;i++){

		/*console.log(_chatMsgs[i].parentElement.getAttribute('msg'));
		console.log('Atrybut: ' + _chatMsgs[i].parentElement.getAttribute('uid'));
		console.log('Input: ' + _uid);*/
		// tutaj już wiadomo że wiadomość jest DIVem bo tylko one mogą mieć przypisane (patrz else if)
		if((_chatMsgs[i].parentElement.getAttribute('mirkopremiuminside') === 'true') && (_chatMsgs[i].parentElement.getAttribute('uid') === uid) && (_chatMsgs[i].parentElement.getAttribute('premiummirko') !== 'true')){
			var trueMsg = _chatMsgs[i].parentElement;
			var premiumMessage = trueMsg.querySelector('div');
			if(premiumMessage.getAttribute('premiummirko')==='true'){
				trueMsg.removeChild( premiumMessage );
				if(newMsg === 0){ // zero czyli zaaktualizuj wszystko oprócz wiadomości
					var _one = encodeToHtml(trueMsg.getAttribute('msg'));
					var _two = encodeToHtml(premiumMessage.getAttribute('msg') + "<p style='color:#808080;font-size:80%;line-height: 10px;'><i>(wiadomość widoczna dla użytkowników MirkoczatPremium)</i></p>");
					premiumMessage.innerHTML = trueMsg.innerHTML.replace(_one, _two);
				} else {
					var _one = encodeToHtml(trueMsg.getAttribute('msg'));
					var _two = encodeToHtml(newMsg + "<p style='color:#808080;font-size:80%;line-height: 10px;'><i>(wiadomość widoczna dla użytkowników MirkoczatPremium)</i></p>");
					premiumMessage.innerHTML = trueMsg.innerHTML.replace(_one, _two);
					premiumMessage.setAttribute('msg', newMsg);
				}
				var _newPlusBox = premiumMessage.querySelector('div');
				_newPlusBox.onclick = function(){ sendPlus(trueMsg.getAttribute('uid'), false); hidePlus(trueMsg.getAttribute('uid')) };
				_newPlusBox.onmouseenter = function(){ showPlus(trueMsg.getAttribute('uid')) };
				_newPlusBox.onmouseleave = function(){ hidePlus(trueMsg.getAttribute('uid')) };
				trueMsg.prepend( premiumMessage );
				break;	
			} else {
				throw new Error('[MirkoczatPremium] Coś poszło nie tak z wykrywaniem zaszyfrowanej wiadomości');
				break;
			}
			
		// sprawdza czy parent to DIV (oryginalna wiadomosc, podmienione - te zaszyfrowane są oznaczone atrybutem premiummirko = true) && sprawdza czy uid się zgadza
		} else if((_chatMsgs[i].parentElement.tagName === 'DIV') && (_chatMsgs[i].parentElement.getAttribute('uid') === uid) && (_chatMsgs[i].parentElement.getAttribute('premiummirko') !== 'true')){
			var message = _chatMsgs[i].parentElement;
			
			var premiumMessage = document.createElement( 'div' );
			premiumMessage.setAttribute('premiummirko','true');
			premiumMessage.style.width = '100%';
			premiumMessage.style.color = '#CACECF';
			message.style.visibility = 'hidden'; premiumMessage.style.visibility = 'visible';
			premiumMessage.style.position = 'absolute';
			if(newMsg === 0){	// zero czyli pozostaw bez zmian
				throw new Error('[MirkoczatPremium] Nie ma sensu aktualizować zawartości tego message na to samo xD');
				break;
			} else if(newMsg===999){ // załóż plusbank
				var _one = encodeToHtml(message.getAttribute('msg'));
				var _two = encodeToHtml('założył PlusBank. Kliknij na tą wiadomość aby podążać za jego plusami');
				premiumMessage.innerHTML = message.innerHTML.replace(_one, _two);
				premiumMessage.setAttribute('msg', newMsg);
				premiumMessage.setAttribute('style', 'color: ' + message.querySelector('a').style.color + '; background-color: #7f6b00; border: 2px #ccac00 solid; cursor: pointer; text-align: center;');
				premiumMessage.className = 'message';
				premiumMessage.style.visibility = 'visible';
				message.style.height = message.clientHeight + 'px';
				premiumMessage.style.height = message.clientHeight + 'px';
				message.setAttribute('mirkopremiuminside', 'true');
				premiumMessage.onclick = function(){
					//console.log((message.querySelector('a').innerHTML !== nickName) + ' to: ' + message.querySelector('a').innerHTML);
					//console.log('nickname: ' + nickName);
					if((premiumMessage.style.cursor==='pointer') && (message.querySelector('a').innerHTML !== nickName) && (plusBankMode==='closed')){
						premiumMessage.style.cursor = 'auto';
						sudo('/msg ' + message.querySelector('a').innerHTML + ' [PlusBank] Dolaczam.');
					} else {
						//console.log('nie spelnia waruknow');
						premiumMessage.style.cursor = 'auto';
						return false;
					}
					//console.log('zgas kolory');
					premiumMessage.style.backgroundColor = '#4c4000';
					premiumMessage.style.border = '2px #998100 solid';
				};
			} else if((_specjalnePolecenie!==undefined) && (_specjalnePolecenie.includes('[PlusBank] Zamykamy: '))){
				message.style.height = message.clientHeight + 'px';
				premiumMessage.style.height = message.clientHeight + 'px';
				var _nicknameA = _specjalnePolecenie.slice(21, _specjalnePolecenie.length);
				
				var _one = encodeToHtml('-> @' + nickName + ': ' + message.getAttribute('msg'));
				var _two = encodeToHtml('zamknął PlusBank.');
				premiumMessage.innerHTML = message.innerHTML.replace(_one, _two);
				var _nickInMessage = premiumMessage.querySelector('a');
				_nickInMessage.innerHTML = _nickInMessage.innerHTML.slice(0,_nickInMessage.innerHTML.length - 7)
				premiumMessage.setAttribute('msg', 'zamknął PlusBank.');
				premiumMessage.setAttribute('style', 'color: ' + message.querySelector('a').style.color + '; background-color: #4c4000; border: 2px #998100 solid; text-align: center;');
				premiumMessage.className = 'message';
				premiumMessage.style.visibility = 'visible';
				message.setAttribute('mirkopremiuminside', 'true');
			} else {
				message.style.height = (message.clientHeight + 10) + 'px';
				premiumMessage.style.height = message.clientHeight + 'px';
				
				var _one = encodeToHtml(message.getAttribute('msg'));
				var _two = encodeToHtml(newMsg + "<p style='color:#808080;font-size:80%;line-height: 10px;'><i>(wiadomość widoczna dla użytkowników MirkoczatPremium)</i></p>");
				premiumMessage.innerHTML = message.innerHTML.replace(_one, _two);
				premiumMessage.setAttribute('msg', newMsg);
				if((newMsg.includes('@' + nickName)) && ((newMsg[newMsg.indexOf('@' + nickName) + nickName.length + 1]===undefined) || newMsg[newMsg.indexOf('@' + nickName) + nickName.length + 1]===' ')){
					premiumMessage.className = 'message important';
				} else {
					premiumMessage.className = 'message';
				}
				message.setAttribute('mirkopremiuminside', 'true');
				var _newPlusBox = premiumMessage.querySelector('div');
				_newPlusBox.onclick = function(){ sendPlus(message.getAttribute('uid'), false); hidePlus(message.getAttribute('uid')) };
				_newPlusBox.onmouseenter = function(){ showPlus(message.getAttribute('uid')) };
				_newPlusBox.onmouseleave = function(){ hidePlus(message.getAttribute('uid')) };
			}
			message.prepend( premiumMessage );
			break;
		}
	}
};

// PĘTLA OPÓŹNIANA --- rozsyłanie msg do wielu na raz musi być w równym odstępie
var sudoCustomLoopIndex = 0;
function sudoCustomLoop(timeout, array, template){
	var _delay;
	if(timeout==='random'){
		_delay = Math.floor((Math.random() * 1000) + 1000);
	} else { _delay = timeout };
	
	setTimeout(function(){
		sudo(template.replace('[>INDEX<]', array[sudoCustomLoopIndex]));
		sudoCustomLoopIndex++;
		if(sudoCustomLoopIndex<array.length){
			sudoCustomLoop(timeout, array, template);
		} else {
			sudoCustomLoopIndex = 0;
		};
	}, _delay);
}

// po wejściu na czat wszystkie wcześniejsze(przed naszym przyjsciem) wiadomosci sa sprawdzane
var ChatReady = false; var _ostatniPlus = new Date();
mirkoczat.stream.onGetMessage(function(e,s){
	
	// zbieranie informacji o wiadomosci 
	var _avatar = nizax_messages.querySelector('div.avatar-plus');
	var message = _avatar.parentElement;
	var uid = _avatar.getAttribute('data-uid');
	var _msg = s.body;
	message.setAttribute('msg', _msg);
	message.setAttribute('uid', s.uid);
	
	// podmienianie zakodowanych wiadomosci
	if(_msg.includes("[Tą wiadomość widzą użytkownicy MirkoczatPremium]")){
		var _msgSafe = _msg;
		var urlRegex = /(https?:\/\/[^\s]+)/g;
		_msgSafe = _msgSafe.slice(50, _msgSafe.length);
		var odkodowane = odkoduj(_msgSafe);
		odkodowane = odkodowane.replace(urlRegex, function(url) {
			return '<a target="_blank" href="' + url + '">' + url + '</a>';
		});
		if(odkodowane==='założył plusbank.'){
			replaceMessage(String(s.uid), 999);
		} else if(odkodowane.length > 0){
			replaceMessage(String(s.uid),odkodowane);
		};
		
	// KIEDY DAJEMY PLUSA:
	} else {
		_avatar.onclick = function(){
			mirkoczat.stream.doLockChat(false);
			var _tenPlus = new Date();
			// jesli minęło 7 sekund
			//console.log('[!] PLUS:');
			//console.log('[' + (plusBankMode==='open') + ']' + plusBankMode + ' === open');
			if(((_tenPlus - _ostatniPlus) > 6000) && (plusBankMode==='open')){
				//console.log('step two:');
				//console.log(plusBankMembers.length + ' > 0');
				if(plusBankMembers.length > 0){
					sudoCustomLoop('random', plusBankMembers, '/msg [>INDEX<] [PlusBank] [PLUS] ' + String(s.uid));
				}
			}
			_ostatniPlus = _tenPlus;
		};
	};
	ChatReady = true;
	
	if((_sledzeni.includes(String(s.user))) && (((_sledzeni[_sledzeni.indexOf(String(s.user)) + String(s.user).length])===undefined) || (_sledzeni[_sledzeni.indexOf(String(s.user)) + String(s.user).length]===' '))){
		if(_podswietlSledzonych==='false'){
			var _msgHtmlObj = getMessageHtmlElement(String(s.uid));
			_msgHtmlObj.className = 'message';
		}
		if(_czytajSledzonych==='true'){
			var _toRead;
			if(_msg.includes('[Tą wiadomość widzą użytkownicy MirkoczatPremium]')){
				var _msgSafe = _msg;
				_msgSafe = _msgSafe.slice(50, _msgSafe.length);
				var odkodowane = odkoduj(_msgSafe);
				if(odkodowane.length > 0){
					_toRead = odkodowane;
				};
			} else {
				_toRead = s.body;	
			}
			var _iloscSledzonych = ' ' + _sledzeni;
			_iloscSledzonych = _iloscSledzonych.match(/([\s]+)/g).length;
			if(_iloscSledzonych > 1){
				voiceRead(String(s.user) + ' napisał. ' + _toRead);
			} else {
				voiceRead(_toRead);
			}
		}
	}
});
// gdy mirkoczat.stream zawiedzie, wtedy wkracza do akcji ten skaner
setTimeout(function() {
	if(ChatReady===false){
		ChatReady=true;
		
		var element,uid,user;
		var allMessages = nizax_messages.querySelectorAll( 'div.avatar-plus' );
		var i = 0;
		while((allMessages[i]!==undefined) && (i <= 50)){
			uid = allMessages[i].getAttribute('data-uid');
			user = allMessages[i].parentElement.querySelector('a').innerHTML;
			element = allMessages[i].parentElement;
			if(element !== undefined){
				_lastmsg = element.innerHTML;
				var msgRegex = /([0-9] -->)/g;
				var str = _lastmsg;
				var _lastIndex;
				while ((msgRegex.exec(str)) !== null) {
					_lastIndex = msgRegex.lastIndex;
				};
				var _msg = _lastmsg.slice(_lastIndex, _lastmsg.length - 20);

				element.setAttribute('msg', _msg);
				element.setAttribute('uid', uid);
				
				if(_msg.includes("[Tą wiadomość widzą użytkownicy MirkoczatPremium]")){
					var _msgSafe = _msg;
					var urlRegex = /(https?:\/\/[^\s]+)/g;
					_msgSafe = _msgSafe.slice(50, _msgSafe.length);
					var odkodowane = odkoduj(_msgSafe);
					odkodowane = odkodowane.replace(urlRegex, function(url) {
						return '<a target="_blank" href="' + url + '">' + url + '</a>';
					});
					if(odkodowane==='założył plusbank.'){
						replaceMessage(uid, 999);
					} else if(odkodowane.length > 0){
						replaceMessage(uid, odkodowane);
					};
					if((nickName !== undefined) && (odkodowane.includes("@" + nickName)) && ((odkodowane[odkodowane.indexOf('@' + nickName) + nickName.length + 1]===undefined) || (odkodowane[odkodowane.indexOf('@' + nickName) + nickName.length + 1]===' '))){
						element.className = "message important";
					};
				} else if((_msg.includes('@' + nickName)) && ((_msg[_msg.indexOf('@' + nickName) + nickName.length + 1]===undefined) || (_msg[_msg.indexOf('@' + nickName) + nickName.length + 1]===' '))){
					element.className = "message important";
				};
				
				if((_sledzeni.includes(user)) && (((_sledzeni[_sledzeni.indexOf(user) + user.length])===undefined) || (_sledzeni[_sledzeni.indexOf(user) + user.length]===' '))){
					if(_podswietlSledzonych==='false'){
						var _msgHtmlObj = getMessageHtmlElement(uid);
						_msgHtmlObj.className = 'message';
					}
					if(_czytajSledzonych==='true'){
						if(_msg.includes('[Tą wiadomość widzą użytkownicy MirkoczatPremium]')){
							var _msgSafe = _msg;
							_msgSafe = _msgSafe.slice(50, _msgSafe.length);
							var odkodowane = odkoduj(_msgSafe);
							if(odkodowane.length > 0){
								voiceRead(odkodowane);
							};
						} else {
							voiceRead(_msg);	
						}
					}
				}
				var _avatar = element.querySelector('div.avatar-plus');
				_avatar.onclick = function(){
					var _tenPlus = new Date();
					// jesli minęło 7 sekund
					//console.log('[!] PLUS:');
					if(((_tenPlus - _ostatniPlus) > 6000) && (plusBankMode==='open')){
						if(plusBankMembers.length > 0){
							for(var i=0;i<plusBankMembers.length;i++){
								sudoCustomLoop('random', plusBankMembers, '/msg [>INDEX<] [PlusBank] [PLUS] ' + String(uid));
							}
						}
					}
					_ostatniPlus = _tenPlus;
				};
			} else { break; };
			i++;
		};
	}
}, 500);

// ONLY UID
function deleteMessage(uid){
	setTimeout(function(){
	var _chatMsgs = nizax_messages.querySelectorAll('div.avatar-plus');
	var _loopLimit;
	if(_chatMsgs.length > 50){
		_loopLimit = 50;
	} else {
		// pierwsza wiadomość 'Połączono' nie moze byc otagowana przez skrypt (uid, msg atrybut)
		_loopLimit = _chatMsgs.length - 1;
	};
	for(var i=0;i<_loopLimit;i++){
		
		if((_chatMsgs[i].parentElement) && (_chatMsgs[i].parentElement.getAttribute('uid') === uid)){
			if(_chatMsgs[i].parentElement.getAttribute('premiummirko')==='true'){
				//console.log('USUWAMY PREMIUMMIRKO:');
				//console.log(_chatMsgs[i].parentElement);
				_chatMsgs[i].parentElement.className = 'message';
				_chatMsgs[i].parentElement.parentElement.style.visibility = 'visible';
				_chatMsgs[i].parentElement.parentElement.style.height = (_chatMsgs[i].parentElement.parentElement.clientHeight - 10) + 'px';
				_chatMsgs[i].parentElement.parentElement.removeChild(_chatMsgs[i].parentElement);
			} else {
				//console.log('USUWAMY ZWYKŁĄ WIADOMOŚĆ:');
				//console.log(_chatMsgs[i].parentElement);
				_chatMsgs[i].parentElement.className = 'message';
				_chatMsgs[i].parentElement.parentElement.removeChild(_chatMsgs[i].parentElement);
			};
			if(_chatMsgs[i].parentElement.getAttribute('mirkopremiuminside')!=='true'){
				//console.log('Pętla zniszczona po wykryciu mirkopremium');
				break;
			}
		}
	}
	}, 100);
};

mirkoczat.stream.onCommandInfo(function(e,s){
	
	// zbieranie informacji o wiadomosci 
	var uid = nizax_messages.querySelector('div.message div.avatar-plus');
	var message = uid.parentElement;
	uid = uid.getAttribute('data-uid');
	var _msg = s.body;
	message.setAttribute('msg', _msg);
	message.setAttribute('uid', s.key);
	
	// usuwanie komend które mogłyby być wywołane przez skrypt m.in. zmiana koloru /group
   if(_commandInfoToDelete !== undefined){
	   if(s.body.includes(_commandInfoToDelete)){
		   deleteMessage(String(s.key));
	   }
	   _commandInfoToDelete = undefined;
   }
});

mirkoczat.stream.onMessagePlus(function(e,s){
	
	var messages = nizax_messages.querySelectorAll('div.message');
	var messagesImportant = nizax_messages.querySelectorAll('div.message.important');
	for(var i=0;i<messages.length - 1;i++){
		if((messages[i].getAttribute('uid')===s.uid) && (messages[i].getAttribute('mirkopremiuminside')==='true')){
			replaceMessage(s.uid,0);
			break;
		}
	}
	for(var i=0;i<messagesImportant.length - 1;i++){
		if((messagesImportant[i].getAttribute('uid')===s.uid) && (messagesImportant[i].getAttribute('mirkopremiuminside')==='true')){
			replaceMessage(s.uid,0);
			break;
		}
	}
	if(PlusToColour.length>0){
		for(var i=0;i<PlusToColour.length;i++){
			var _element = PlusToColour[i].querySelector('span');
			_element.style.color = 'rgb(255,255,0)';
			PlusToColour.splice(i,1);
			setTimeout(function(){
				_element.style.color = 'rgb(51,153,51)';
			}, 3000);
		}
	}
});

var PlusToColour = [];
function sendPlus(uid, visible){
	var _send = { uid: uid };
	mirkoczat.stream.doSendPlus(_send);
	//console.log('[!] SEND PLUS : ' + visible);
	if(visible===true){
		var _chatMsgs = nizax_messages.querySelectorAll('div div.avatar-plus');
		//console.log('SEND PLUS cdn:');
		//console.log(_chatMsgs);
		for(var i=0;i<_chatMsgs.length - 1;i++){
			if((_chatMsgs[i].parentElement.getAttribute('uid') === uid) && ((_chatMsgs[i].parentElement.getAttribute('mirkopremiuminside')!=='true'))){
				PlusToColour.push(_chatMsgs[i].parentElement);
			};
		}
	}
	var _tenPlus = new Date();
	// jesli minęło 7 sekund
	//console.log('[!] PLUS:');
	//console.log('[' + (plusBankMode==='open') + ']' + plusBankMode + ' === open');
	if(((_tenPlus - _ostatniPlus) > 6000) && (plusBankMode==='open')){
		//console.log('step two:');
		//console.log(plusBankMembers.length + ' > 0');
		if(plusBankMembers.length > 0){
			sudoCustomLoop('random', plusBankMembers, '/msg [>INDEX<] [PlusBank] [PLUS] ' + String(uid));
		}
	}
	_ostatniPlus = _tenPlus;
}
var showPlusHtmlElement = document.createElement('div');
showPlusHtmlElement.setAttribute('style', 'position: absolute; width: 35px; height: 30px; display: inline; padding-left: 5px; padding-top: 5px; background-color: green; opacity: 0.8; text-align: center;');
showPlusHtmlElement.innerHTML = '<i class="fa fa-plus"></i>';
function showPlus(uid){
	var messages = nizax_messages.querySelectorAll('div div[premiummirko]');
	for(var i=0;i<messages.length;i++){
		if((messages[i].parentElement.getAttribute('uid')===uid) && (messages[i].getAttribute('premiummirko')==='true')){
			var _avatar = messages[i].querySelector('div.avatar-plus');
			_avatar.prepend(showPlusHtmlElement);
			messages[i].parentElement.setAttribute('showMePlusKurwa', 'true');
			mirkoczat.stream.doLockChat(true);
			break;
		}
	}
}
function hidePlus(uid){
	var messages = nizax_messages.querySelectorAll('div div[premiummirko]');
	for(var i=0;i<messages.length;i++){
		if((messages[i].parentElement.getAttribute('uid')===uid) && (messages[i].getAttribute('premiummirko')==='true')){
			var _avatar = messages[i].querySelector('div.avatar-plus');
			if(messages[i].parentElement.getAttribute('showMePlusKurwa')==='true'){
				_avatar.removeChild(showPlusHtmlElement);
				messages[i].parentElement.removeAttribute('showMePlusKurwa');
				mirkoczat.stream.doLockChat(false);
				break;
			}
		}
	}
}


//
//	WIADOMOŚCI MIRKOCZAT PREMIUM
//

var encodeHtmlObj = document.createElement('div');
function encodeToHtml(input){
	encodeHtmlObj.innerHTML = input;
	return encodeHtmlObj.innerHTML;
}

const alphabet = 'ĘgdqsećUG&0BnfąŁbK9FŃ/cNIÓC2śRęPvjiZE1Ź6OpHMłm5xtńoVyJ78aĄw3lLrQYź@Sh4ĆWóTDAXukŚz';

function getDifference(a, b)
{
    var i = 0;
    var j = 0;
    var result = "";

    while (j < b.length)
    {
        if (a[i] != b[j] || i == a.length)
            result += b[j];
        else
            result += b[j];
        j++;
    }
    return result;
}

function zakoduj(txt){
	var _msg = txt;
	// skanowanie znaków
	var chars = "";
	for(var i=0;i < _msg.length; i++){
		if(!chars.includes(_msg[i]) && alphabet.includes(_msg[i]) && (_msg[i] != "’")){
			chars += _msg[i];
		}
	};
	if(chars.length === 0){
		return _msg;
	};
	// ustalenie przesunięcia liter w alfabecie
	var _shift = Math.floor((Math.random() * 100) + 1) - 50;
	// zamiana znaków w msg na przesunięty odpowiednik i dopisanie wartości przesunięcia na końcu msg
	_msg = _msg.replace(/`/g, "");
	_msg = _msg.toString().match(/.{1}/g).join('`');
	_msg = "`" + _msg;
	_msg = _msg.replace(/ /g, "’");

	for(var i=0;i < chars.length; i++){
		var _index = alphabet.indexOf(chars[i]) + _shift;
		if(_index < 0){
			_index = _index + alphabet.length;
		} else if(_index >= alphabet.length){
			_index = _index - alphabet.length;
		};
		_msg =  getDifference(_msg, _msg.replace(new RegExp("`" + chars[i], "g"), alphabet[_index]));
	};
	_msg = _msg.replace(/`/g, "");
	_msg = _msg + " [" + _shift + "]";
	// return msg
	_msg = "[Tą wiadomość widzą użytkownicy MirkoczatPremium] " + _msg;
	return _msg;
}

function odkoduj(txt){
	var _msg = txt;
	// odczytaj przesuniecie
	var _shift = _msg.slice(_msg.lastIndexOf("[") + 1, _msg.length - 1);
	if(_shift==='999'){
		_msg = 'założył plusbank.';
	} else {
		_msg = _msg.slice(0, _msg.lastIndexOf("[") - 1);
		// skanowanie znaków
		_msg = _msg.replace(/`/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
		var chars = "";
		for(var i=0;i < _msg.length; i++){
			if(!chars.includes(_msg[i]) && alphabet.includes(_msg[i]) && (_msg[i] != "’" )){
				chars += _msg[i];
			}
		};
		// zmiana znaków w msg na przesunięty odpowiednik
		_msg = _msg.toString().match(/.{1}/g).join('`');
		_msg = "`" + _msg;
		
		for(var i=0;i < chars.length; i++){
			var _index = alphabet.indexOf(chars[i]) - _shift;
			if(_index < 0){
				_index = _index + alphabet.length;
			} else if(_index >= alphabet.length){
				_index = _index - alphabet.length;
			};
			_msg =  getDifference(_msg, _msg.replace(new RegExp( "`" + chars[i], "g"), alphabet[_index]));
		};
		_msg = _msg.replace(/`/g, "");
		_msg = _msg.replace(/’/g, " ");	
	}
	// return msg
	return _msg;
}
if(window.location.pathname.slice(0,8)=="/embed_t"){
	history.pushState({},null,"http://mirkoczat.pl/i/"+window.location.pathname.slice(9,window.location.pathname.length));
};
};
});
})();