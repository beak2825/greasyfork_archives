// ==UserScript==
// @name          saye2!
// @description          Greets the world...or no
// @version        0.2
// @grant       none
// @include       http://game.league17.ru/*
// @namespace https://greasyfork.org/users/170929
// @downloadURL https://update.greasyfork.org/scripts/38494/saye2%21.user.js
// @updateURL https://update.greasyfork.org/scripts/38494/saye2%21.meta.js
// ==/UserScript==

(function (window, undefined) {

var myBox = document.createElement('div');
myBox.id = 'myBox';
	
var myBox1 = document.createElement('div');
	myBox1.id = 'myBox1';

var myInfo = document.createElement('div');
myInfo.id = 'myInfoBox';

	document.body.appendChild(myBox1);
	myBox1.appendChild(myBox);


var AF = 0;
var NeedToClose = 0;
var dragging=0;
var num_cycle=0;
var SoundOn = 0; //capcha
var SoundOn1 = 0; //noAttack
var SoundOn2 = 0; //special
var SoundWeather = 0; //погода не ок
var AllSoundOn = 0;
var AllLokesPokes = [];
var baseHPfs = 0;
var capcha = 0;
var AllBaseHPpoks = [0,78,60,80,39,58,78,44,59,79,45,50,60,40,45,65,40,63,83,30,55,40,65,35,60,35,60,50,75,55,70,90,46,61,81,70,95,38,73,115,140,40,75,45,60,75,35,60,60,70,10,35,40,65,50,80,40,65,55,90,40,65,90,25,40,55,70,80,90,50,65,80,40,80,40,55,80,50,65,90,95,25,50,52,35,60,65,90,80,105,30,50,30,45,60,35,60,85,30,55,40,60,60,95,50,60,50,50,90,40,65,80,105,250,65,105,30,55,45,80,30,60,40,70,65,65,65,65,75,20,95,130,48,55,130,65,65,65,35,70,30,60,80,160,90,90,90,41,61,91,106,100,45,60,80,39,58,78,50,65,85,35,85,60,100,40,55,40,70,85,75,125,20,50,90,35,55,40,65,55,70,90,75,70,100,70,90,35,55,75,55,30,75,65,55,95,65,95,60,95,60,48,190,70,50,75,100,65,75,60,90,65,70,20,80,55,60,90,40,50,50,100,55,35,75,45,65,65,45,75,75,90,90,85,73,55,35,50,45,45,45,95,255,90,115,100,50,70,100,106,106,100,40,50,70,45,60,80,50,70,100,35,70,38,78,45,50,60,50,60,40,60,80,40,70,90,40,60,40,60,28,38,68,40,70,60,60,60,80,150,31,61,1,64,84,104,72,144,50,30,50,70,50,50,50,60,70,30,60,40,70,60,60,65,65,50,70,100,45,70,130,170,60,70,70,60,80,60,45,50,80,50,70,45,75,73,73,70,70,50,110,43,63,40,60,66,86,45,75,20,95,70,60,44,64,20,40,99,65,65,95,50,80,70,90,110,35,55,55,100,43,45,65,95,40,60,80,80,80,80,80,80,100,100,105,100,50,55,75,95,44,64,76,53,64,84,40,55,85,59,79,37,77,45,60,80,40,60,97,97,30,60,40,60,70,30,70,60,55,85,45,70,76,111,75,90,150,55,65,60,100,49,71,45,63,103,57,67,50,20,100,76,50,58,68,108,135,40,70,68,108,40,70,48,83,74,49,69,45,60,90,70,70,110,115,100,75,75,85,86,65,65,75,110,85,68,60,45,70,50,75,80,75,100,90,91,110,150,120,80,100,70,100,120,100,45,60,75,65,90,110,55,75,95,45,60,45,65,85,41,64,50,75,50,75,50,75,76,116,50,62,80,45,75,55,70,85,55,67,60,110,103,75,85,105,50,75,105,120,75,45,55,75,30,40,60,40,60,45,70,70,50,60,95,70,105,75,50,70,50,65,72,38,58,54,74,55,75,50,80,40,60,55,75,45,60,70,45,65,110,62,75,36,51,71,60,80,55,50,70,69,114,55,100,165,50,70,44,74,40,60,60,35,65,85,55,75,50,60,60,46,66,76,55,95,70,50,80,109,45,65,77,59,89,45,65,95,70,100,70,110,85,58,52,72,92,55,85,91,91,91,79,79,100,100,89,125,91,100,71,56,61,88,40,59,75,41,54,72,38,85,45,62,78,38,45,80,62,86,44,54,78,66,123,67,95,75,62,74,45,59,60,78,101,62,82,53,86,42,72,50,65,50,71,44,62,58,82,77,123,95,78,67,50,45,68,90,57,43,85,49,65,55,95,40,85,126,126,108,50,80,80];
	
var numerPok = 0;
var numerOldPok = 0;

function SwitchAF()
{
	if(AF==0){ AF=1; num_cycle=0;}
	if(AF==1)AF=0;
}
	
	
function CountWildIVhp(statHP,lvl,baseHP)
{
	var maxivHP = Math.floor(100*(statHP-9.5-lvl)/lvl-(baseHP*2)-0.0001);
	var minivHP = Math.ceil(100*(statHP-10.5-lvl)/lvl-(baseHP*2));
	var res = [];
	res[0] = minivHP;  res[1] = maxivHP;
	return (res);
}
	
/* //эти функции были нужны исключительно для парсинга базовых ХП покемонов, ибо вручную все вписывать - это с ума сойти


var parseran = 0;
var tim2;
var number=0;
	
function CutBaseHP(last)
{
	if(number==last) clearInterval(tim2);
	var divDex = document.getElementById('divPokedex');	
		//baseHPfs = CountWildIVhp(170,55,baseHPfs)[0];
	var inpSrch = divDex.getElementsByClassName('searchfield')[0].getElementsByTagName('input')[0];
	var btnGo = divDex.getElementsByClassName('searchfield')[0].getElementsByClassName('btnGo')[0];
	var HPBase = divDex.getElementsByClassName('stats')[0].getElementsByClassName('statuscontainer')[0];
		baseHPfs = HPBase.textContent;
		AllBaseHPpoks[number] = baseHPfs;
	number ++;
	inpSrch.value = number;
	btnGo.click();
	numerPok = number;
}
	
function ParseHPBases(sets)
{
	if(sets==1 && parseran!=1)
	{
		parseran=1;
		
		number=1;
		tim2 = setInterval(function(){CutBaseHP(721)},2000);
	}
	else if (sets==0 && parseran==1) {	if(document.getElementById('dexpars').checked)document.getElementById('dexpars').click();
			clearInterval(tim2); parseran=0; 
		var ast = document.getElementById('divChatAreas').getElementsByClassName('divChatArea')[0];
		ast.innerHTML = AllBaseHPpoks;
		
									 
	};
	
}
*/
function ShowSettingBox()
{	
	myBox.innerHTML += '<div class=\'myBoxElem\'><input type=\'checkbox\' class=\'inps\' id=\'af_cb\'> Auto Fight &nbsp</div> ';
	myBox.innerHTML	+= '<div class=\'myBoxElem\'><input type=\'checkbox\' class=\'inps\' id=\'sh_iv\'> Show IV HP </div> <br> '
	var sd1 = document.createElement('div');
		sd1.className = 'subdiv';
	sd1.innerHTML += '<div class=\'myBoxElem\' > <input type=\'checkbox\' class=\'inps\' id=\'at1\'> attack 1 &nbsp</div> &nbsp&nbsp&nbsp';
	sd1.innerHTML += '<div class=\'myBoxElem\' > <input type=\'checkbox\' class=\'inps\' id=\'at2\'> attack 2 &nbsp</div><br>';
	sd1.innerHTML += '<div class=\'myBoxElem\' > <input type=\'checkbox\' class=\'inps\' id=\'at3\'> attack 3 &nbsp</div> &nbsp&nbsp&nbsp';
	sd1.innerHTML += '<div class=\'myBoxElem\' > <input type=\'checkbox\' class=\'inps\' id=\'at4\'> attack 4 &nbsp</div>';
	document.getElementById('myBox').appendChild(sd1);
	myBox.innerHTML += 'Who mustn\'t be killed: <input type=\'text\' value=\'145; 214; 251; 333; 412; 417; 531; 616; 627; 632; 114; 109;\' id=\'dontkick\'><br> <input type=\'checkbox\' id=\'signalon\' checked> ';
	//myBox.innerHTML += '<audio id=\'ring\' controls><source src="file:///D:/ring.ogg">HTML5 audio not supported</audio><br>';
	//myBox.innerHTML += '<input type=\'checkbox\' id=\'dexpars\'>';  //для парса
	

	scr1 = document.createElement('script');
	scr1.text = '(' + 
		(function(){
			var myAudio = document.createElement('audio');
			myAudio.id = 'ring';
			//myAudio.controls = 'true';
			var mAs = document.createElement('source');
			//mAs.src = 'file:///D:/ring.ogg';
			mAs.src = 'http://vignette1.wikia.nocookie.net/arezista/images/7/72/T1_signal.ogg/revision/latest?cb=20140608100327&path-prefix=ru';
			document.getElementById('myBox').appendChild(myAudio);
			myAudio.appendChild(mAs);
		
			var btnSiren = document.createElement('button'); 
			btnSiren.innerHTML = 'stop'; 
			btnSiren.onclick = function(){ /*document.getElementById('ring').pause();*/ ParseHPBases(); }; 
			document.getElementById('myBox').appendChild(btnSiren);	
		
			var myHd = 0;
			var dragdiv = document.createElement('div'); 
			dragdiv.id = 'dragdiv';
			dragdiv.innerHTML = ''; 
			dragdiv.onmousedown = function(){ myHd = 1; };
			dragdiv.onmouseup = function(){ myHd = 0;   };
			var f1 = function(){ if(myHd==1){ document.getElementById('myBox1').style.top = event.pageY -17 +'px'; 
											  document.getElementById('myBox1').style.left = event.pageX -100 +'px'; 
												if (window.getSelection) { window.getSelection().removeAllRanges();}	
											}; }
								
			dragdiv.onmousemove = f1;		
			document.body.onmousemove = f1;
		
			var btn1 = document.createElement('div');
			btn1.id = 'myButn1';
			btn1.style.display = 'none';
			btn1.innerHTML = 'overHR';
			
			var f2 = function InitShowTip (event) {
                if (event.initMouseEvent) {     // all browsers except IE before version 9
                    var mouseEvent = document.createEvent ("MouseEvent");
                    mouseEvent.initMouseEvent ("mouseover", true, true, window, 0, 
                                                event.screenX, event.screenY, event.clientX, event.clientY, 
                                                event.ctrlKey, event.altKey, event.shiftKey, event.metaKey, 
                                                0, null);					
					var dfi = document.getElementById('divFightH')
					if ( dfi != undefined )
					{                    	
						var dfi2 = dfi.getElementsByClassName('barHP')[0];						
						if(dfi2 != undefined)
						{							
							dfi2.dispatchEvent (mouseEvent);							
						}
					}
                }
			}
			btn1.onclick = f2;
			document.getElementById('myBox1').appendChild(btn1);
		
			var sp2 = document.getElementById('myBox');
			document.getElementById('myBox1').insertBefore(dragdiv,sp2);
			//document.getElementById('myBox1').appendChild(dragdiv);
		
			var css = document.createElement("style");
			css.type = "text/css";
			css.innerHTML = "#myBox { width:200px; height:200px; background:#e5eef8;  overflow-y:scroll; border-radius:0 0 15px 0; margin:0px; padding:0; border:1px solid #f0f6fc;} ";
			css.innerHTML += ".inps { margin:0 0 0 0; padding:0;} ";
			css.innerHTML += " #dragdiv { width:200px; height:30px; background:#d1d9e6; border:1px solid #afb8c5; border-radius:15px 15px 0 0; text-align:center; margin:0px; padding:0; cursor:move;}";
			css.innerHTML += " #myBox1 { width:200px;  background:#FFFFFF;  right:500px; top:245px; position:absolute; border-radius:15px;   }";
			css.innerHTML += " #dontkick {height:10px;}  #signalon {height:10px;}";
			css.innerHTML += " .myBoxElem { background:#e0eee7; border-radius:10px; display:inline-block; font-size:10px; padding:2px;}";
			css.innerHTML += " .subdiv { background:#e0e7ee; border-radius:10px; padding:5px; font-size:10px; }";
			document.body.appendChild(css);
			
			}).toString() + ')()';
	document.body.appendChild(scr1); 
	myBox.appendChild(myInfo);	
}

ShowSettingBox();

var attacks = [];
var numpoksdontkick = [];
var countofdkick = 0;
var banattack = 0;
var isShine = 0;
var isCaptcha = 0;
var noAttack = 0;
var AttacksRefreshed = 0;
var EnemyIs = 0;
var AllEnemies = 0;




function TestCaptcha()
{
	tm = document.getElementById('divFightCaptcha');
	i1 = tm.getElementsByTagName('img');
			
	if ( i1[0].src != undefined && tm.style.display != 'none' )
	{
		myInfo.innerHTML += 'capcha YES: <a href=\'' + i1[0].src + '\'>CAPCHA</a>';
		isCaptcha = 1;
		if ( SoundOn == 0 )
		{
			SoundOn = 1;
			return 1;
		}
	}
	else
	{
		isCaptcha = 0;
		SoundOn = 0;
		return 0;
	}
}
	
function TestPokemon()
{
	
}
	
function SoundSignal()
{
	if ( (SoundOn == 1 || SoundOn1 == 1 || SoundOn2 == 1 || SoundWeather==1) && (AllSoundOn == 1) )
	{
		document.getElementById('ring').play();
	}
	else
	{
		document.getElementById('ring').pause();
		document.getElementById('ring').currentTime = 0;
	}
}
	
//var btr=[];

function showIVhp()
{
	var hp = document.getElementById('myButn1');
		hp.click();
	var tip = document.body.getElementsByClassName('tip')[0];
	//CountWildIVhp(statHP,lvl,baseHP)
	hp = tip.innerHTML;
	hp = hp.substring(hp.indexOf('/')+2,hp.indexOf('/')+6);
	
	var lvl = document.getElementById('divFightH');
	
	var ivDiv = document.getElementById('ivhpDiv');
	if(ivDiv==undefined)
	{
		ivDiv = document.createElement('span');
		ivDiv.id = 'ivhpDiv';
		lvl.getElementsByClassName('name')[0].appendChild(ivDiv);
	}
	
	lvl = lvl.getElementsByClassName('lvl')[0];	
	lvl = lvl.innerHTML;
	
	var IVhp = CountWildIVhp(hp,lvl,AllBaseHPpoks[numerPok*1]);
	//myInfo.innerHTML += 'IV:' + IVhp + '<br>';
	//myInfo.innerHTML += 'hp:' + hp + ' lvl:' + lvl + 'base: ' + AllBaseHPpoks[numerPok*1] + '<br>';
	
	ivDiv.innerHTML = ' (IVhp: ' + IVhp[0] + '-' + IVhp[1] + ')';
	
}
	
function TestSettings()
{
	myInfo.innerHTML = '';
	
	/*
	dp = document.getElementById('dexpars');
	if( dp.checked ) { ParseHPBases(1); }
	else {ParseHPBases(0);}; */
	
	AFcb = document.getElementById('af_cb');
	if( AFcb.checked ) AF = 1;
	else AF = 0;

	at1 = document.getElementById('at1');
	if( at1.checked ) attacks[0] = 1;
	else attacks[0] = 0;
	
	at2 = document.getElementById('at2');
	if( at2.checked ) attacks[1] = 1;
	else attacks[1] = 0;
	
	at3 = document.getElementById('at3');
	if( at3.checked ) attacks[2] = 1;
	else attacks[2] = 0;

	at4 = document.getElementById('at4');
	if( at4.checked ) attacks[3] = 1;
	else attacks[3] = 0;
	
	so = document.getElementById('signalon');
	if( so.checked ) AllSoundOn = 1;
	else  AllSoundOn = 0;
	
	pl1 = document.getElementById('ring');
	if ( pl1.ended ) { document.getElementById('ring').currentTime = 0; document.getElementById('ring').play(); }

	dk = document.getElementById('dontkick');
	pdk = dk.value;
	temp_pdk = pdk;
	i=0;
	while ( temp_pdk.indexOf(';') != -1 )
	{
		numpoksdontkick[i] = 1*temp_pdk.substring( temp_pdk.indexOf(';')-3, temp_pdk.indexOf(';') );
		temp_pdk = temp_pdk.substring( temp_pdk.indexOf(';')+1, temp_pdk.length );
		i++;
	}
	countofdkick = i;

	myInfo.innerHTML += 'all dont kick:' + countofdkick + '<br>';
	//myInfo.innerHTML += 'Sound: (' + AllSoundOn + ') <br>';
	
	var tips = document.getElementById('divAlerten');
	if (tips.getElementsByClassName('alerten')[0] != undefined)
	{
		//btr[0] = i + ' [' + tips.innerHTML + ']<br>';
		//btr[3] = tips.getElementsByClassName('divContainer')[0];
		//btr[1] = '(' + btr[3].innerHTML + ')<br>';
	}
	//myInfo.innerHTML += btr[1]; 
	
	//<div id="divFightWeather"><div class="iconweather w4"></div></div>   - weather
	//w3 - град, w4 - песчаная буря
	//SoundWeather

	TestCaptcha();
	SoundSignal();
}


function WhoIsYourEnemy()
{	
	var fightIs = document.getElementById('divVisioFight');
	if (fightIs.style.display != 'none')
	{
		var divW = document.getElementById('divFightWeather');
		if( divW.getElementsByClassName('w3')[0] != undefined )
		{
			SoundWeather = 1;
		}
		else if( divW.getElementsByClassName('w4')[0] != undefined )
		{
			SoundWeather = 1;
		}
		else SoundWeather = 0;		
		
		var enemyDiv = document.getElementById('divFightH');
		var enemyNum = enemyDiv.getElementsByClassName('image');
		if ( enemyNum[0] != undefined )
		{
			enemyNum = enemyNum[0].getElementsByTagName('img');
			if (enemyNum[0] != undefined)
			{
				enemyNum = enemyNum[0].src;

				var startPos = enemyNum.indexOf('.gif');
				numerPok = enemyNum.substring( startPos-3, startPos );
				EnemyIs = 1;

				if ( enemyNum.indexOf('norm') != -1  && enemyNum.indexOf('shine') == -1 ) 
				{
					myInfo.innerHTML += ' NORM <br>';
					isShine = 0;
				}
				else if ( enemyNum.indexOf('norm') == -1  && enemyNum.indexOf('shine') != -1 ) 
				{
					myInfo.innerHTML += ' SHINE <br>';
					isShine = 1;
				}
			}
			else
			{
				if(numerPok!=0)
				numerOldPok = numerPok;
				numerPok = 0;
			}
		}
		else
		{
			//myInfo.innerHTML += 'Enemy Num is Zero';
			if(numerPok!=0)
			numerOldPok = numerPok;
			numerPok = 0;
		}


		var noone = document.getElementById('divFightAction').innerHTML;
		if ( noone.indexOf('\u043D\u0438\u0447') != -1  || noone.indexOf('\u043E\u0431\u0435\u0434') != -1  )
			{
				if(numerPok!=0)
				numerOldPok = numerPok;
				numerPok = 0;
			}
		// http://img.league17.ru/pub/pkmn/shine/full/077.jpg
		// http://img.league17.ru/pub/pkmn/norm/full/077.jpg
		
		shiv = document.getElementById('sh_iv');
		if( shiv.checked ) { showIVhp(); }
	}

	myInfo.innerHTML += 'Pokemon #' + numerPok + ' (was ' + numerOldPok + ') <br>';
	myInfo.innerHTML += 'AllEnemies:' + AllEnemies + '<br>';

	banattack = 0;
	for (i=0;i<countofdkick;i++)
	{
		if ( numerPok == numpoksdontkick[i] ) banattack =1;
	}
	
	if( isShine == 1 ) banattack = 1;	
}
	


	



function FindMoves()
{
	
	if(AF==0) return 1;
	if(banattack==1)
	{
		myInfo.innerHTML += '\u041D\u0435\u043B\u044C\u0437\u044F   nel\'za bit\'<br>';
		SoundOn2 = 1;
		return 13;
	}
	else {SoundOn2=0;}
	if(isCaptcha ==1 )
	{
		myInfo.innerHTML += 'captcha';
		return 6;
	}
	
	fm = document.getElementById('divFightI');	
	all_m = fm.getElementsByClassName('moves');
	if (all_m[0] != undefined)
	{
	
		moves = fm.getElementsByClassName('moveBox');
		fbuttons = document.getElementById('divFightButtons');
		allfb = fbuttons.getElementsByClassName('button');

		pp1 = [];

		for (i=0;i<4;i++)
		{
			pp1[i] = moves[i].getElementsByClassName('divMoveParams');
			pp1[i] = pp1[i][0].innerHTML; 
			pp1[i] = pp1[i].substring(pp1[i].indexOf(':')+1,pp1[i].indexOf('/'));
			pp1[i] = pp1[i]*1; //сколько осталось ышо ПП у атаки текущего цикла
		}

		curAt = -1;
		num_cycle = Math.round(Math.random()*3);
		switch(num_cycle)
		{
			case 0:
			{
				if (attacks[0] == 1)
				{
					curAt = 0;
				}
				else 
				{
					num_cycle = 1;
				}
			} break;
			case 1:
			{
				if (attacks[1] == 1)
				{
					curAt = 1;
				}
				else
				{
					num_cycle = 2;
				}
			} break;
			case 2:
			{
				if (attacks[2] == 1)
				{
					curAt = 2;
				}
				else 
				{
					num_cycle = 3;
				}
			} break;
			case 3:
			{
				if (attacks[3] == 1)
				{
					curAt = 3;
				}
				else
				{
					num_cycle = 0;
				}
			} break;
			default: num_cycle = 0;
		}

		if (curAt != -1) {

		dm = moves[curAt].getElementsByClassName('divMoveInfo');	

			if(AF==1 && all_m[0].style.display != 'none' && pp1[curAt] != 0 && noAttack!=1)
			{		
				dm[0].click();
				NeedToClose = 1;	
				AttacksRefreshed = 1;
				
			}
			else
			{
				if (noAttack==1 && AttacksRefreshed ==1)
				{
						var wild = document.getElementById('divInputButtons');
						wild = wild.getElementsByClassName('btnSwitchWilds');
						wild = wild[0];
						dm[0].click();
						AttacksRefreshed = 0;
				}
			}
		}
	}
	
	var enemyDiv = document.getElementById('divFightH');
	var canClose = 0;
	enemyDiv = enemyDiv.getElementsByClassName('barHP');
	if(enemyDiv[0] == undefined)
	{
		canClose = 1;
	}
	
	if( EnemyIs==1 && all_m[0].style.display == 'none' && AF==1 /*&& canClose==1*/)
		{
			
			AllEnemies ++;
			allfb[4].click();
			NeedToClose = 0;
			myInfo.innerHTML += '!';
			if(numerPok!=0)
			numerOldPok = numerPok;
			numerPok = 0;
			EnemyIs = 0;
		}
	
	
	//проверка, можно ли атаковать чем-то
	noAttack = 1;
	for (i=0;i<4;i++)
	{
		if ( attacks[i] == 1 && pp1[i] != 0 ) noAttack = 0;
	}
	
	if( noAttack == 1 && all_m[0].style.display != 'none' ) {SoundOn1 = 1;}
	else SoundOn1 = 0;
	
	//myInfo.innerHTML += 'nc:' + num_cycle + ' curat: ' + curAt + '<br>';
	myInfo.innerHTML += 'at: ' + attacks[0] + '/' + attacks[1] + '/' + attacks[2] + '/' + attacks[3] + '<br>';
	
}


t1 = setInterval(function(){TestSettings(); WhoIsYourEnemy(); FindMoves(); },1000);



})(window);


