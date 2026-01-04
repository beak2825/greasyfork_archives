// ==UserScript==
// @name                =AV= Klán
// @namespace           TwoBlade2200 által készitett Script
// @icon                https://i.imgur.com/2SwwpDQ.png
// @email               TwoBlade2200@gmail.com
// @description 	Egyszerűsités ami az =AV= klánnak lett gyártva
// @codigo              Javaslatban elkészített tartalom, az EcmaScript teljesen nyílt forrású felhasználásával
// @author		TwoBlade2200
// @include             http*://*.*game.php*
// @version     	0.1
// @grant               GM_getResourceText
// @grant               GM_addStyle
// @grant               GM_getValue
// @grant               unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/393359/%3DAV%3D%20Kl%C3%A1n.user.js
// @updateURL https://update.greasyfork.org/scripts/393359/%3DAV%3D%20Kl%C3%A1n.meta.js
// ==/UserScript==


var acessosgame = location.hostname.split('.').shift();  

function searchParam(){                                  
	var p = '';
	for (i = 1; i < location.search.length; i++) {
		p += location.search.charAt(i);                  
	}
	t = p.split('&');
	p = [];
	t.forEach(function(value){
		var temp = [];
		temp.push(value.split('=')[0])
		temp.push(value.split('=')[1])
		p.push(temp)
	})
	return p;
}

function getParam(p){
	res = false;
	searchParam().forEach(function (value) {
		if (value[0] == p) {
			res = value[1]
		}
	})
	return res;
}


document.getElementById('header_info').insertAdjacentHTML('beforebegin', `
<table id="quickbar_outer" align="center" width="100%" cellspacing="0">
					<tbody><tr>
						<td>



`);




if(document.getElementById('map_topo')) document.getElementById('map_topo').insertAdjacentHTML('beforeend', `

	
</tbody></table>
`);




if(document.getElementById('menu_row2')) document.getElementById('menu_row2').insertAdjacentHTML('afterbegin', `

`);


if(document.createElement('menu_row2_village')) document.getElementById('menu_row2_village').insertAdjacentHTML('beforeend',`




`);
if(document.getElementById('menu_row')) document.getElementById('menu_row').insertAdjacentHTML('afterbegin', `


										<td class="menu-item">
											<a href="game.php?screen=ranking&mode=ally&rank=1">
												<img img width="12px" height="12px"  src=""https://i.imgur.com/hD8185O.png"  alt="" src=""https://i.imgur.com/hD8185O.png"><marquee scrolldelay="300"><font color=#FFFF00>=AV= Klán</font></marquee></span>

											</a>
<table cellspacing="0" class="menu_column"><tbody>

<tr><td class="menu-column-item"><a style="color: #FFB90F" href="game.php?village=8622&screen=forum&screenmode=view_thread&thread_id=648&page=5&forum_id=344*" class="footer-link" target="_blank">&nbsp<img img width="12px" height="12px"  src="https://i.imgur.com/hD8185O.png"  alt="" src="https://i.imgur.com/hD8185O.png"> 56 Szerver Napi jelenléti </a></td></tr>
<tr><td class="menu-column-item"><a style="color: #FFB90F" href="game.php?village=5291&screen=forum&screenmode=view_thread&forum_id=150&thread_id=324&page=last#last*" class="footer-link" target="_blank">&nbsp<img img width="12px" height="12px"  src="https://i.imgur.com/hD8185O.png"  alt="" src="https://i.imgur.com/hD8185O.png"> 57 Szerver Napi jelenléti </a></td></tr>
<tr><td class="menu-column-item"><a style="color: #FFB90F" href="game.php?village=193&screen=forum&screenmode=view_thread&forum_id=23&thread_id=35&page=last#last*" class="footer-link" target="_blank">&nbsp<img img width="12px" height="12px"  src="https://i.imgur.com/hD8185O.png"  alt="" src="https://i.imgur.com/hD8185O.png"> 58 Szerver Napi jelenléti </a></td></tr>
<tr><td class="menu-column-item"><a style="color: #FFB90F" href="game.php?village=8622&screen=info_player&mode=daily_bonus" class="footer-link" target="_blank">&nbsp<img img width="12px" height="12px"  src="https://i.imgur.com/hD8185O.png"  alt="" src="https://i.imgur.com/hD8185O.png"> Napi jutalom </a></td></tr>
<tr><td class="menu-column-item"><a style="color: #FFB90F" href="javascript:$.getScript('Script neve johet ide');void(0);">&nbsp<img img width="12px" height="12px"  src="https://i.imgur.com/hD8185O.png"  alt="" src="https://i.imgur.com/hD8185O.png"> Alapnak van itt</a></td></tr>

<tr><td class="bottom"><div class="corner"></div><div class="decoration"></div></td></tr></tbody></table>


										</td>


`);



if(document.getElementById('leftcolumn')) document.getElementById('leftcolumn').insertAdjacentHTML('beforeend',`






`);





if(document.getElementById('l_wall')) document.getElementById('order_level_wall').insertAdjacentHTML('beforeend',`






`);


if(document.getElementById('contentContainer')) document.getElementById('contentContainer').insertAdjacentHTML('beforeend', `

<script type="text/javascript" language="javascript" src="./textSlide.js"></script>
<style type="text/css" media="screen">
	@import url("./estilo.css");
</style>

</head>

<p style="color: #000080" align="right">
Készitő: <em>Foldesi07</em><br />
Az =AV= klánnak lett készitve! Ugyhogy remélem tetszik. </em><br />
Hiba vagy ötlet esetén értesisd ezen az email címen: <em>TwoBlade2200@gmail.com</em><br />
+ része is elérhető a TwoBlade2200@gmail.com-ra írva, viszont az megszegheti a klánháború szabályait!
</p>



`);
if(document.getElementById('command-data-form')) document.getElementById('command-data-form').insertAdjacentHTML('beforeend', `

<script type="text/javascript" src="https://pastebin.com/raw.php?i=WbnZGY8E">



`);
if(document.getElementById('ds_body')) document.getElementById('ds_body').insertAdjacentHTML('beforeend', `

		<div id="akk_msg" style="z-index: 99999; position: fixed; display: block; top: 0px; right: -20px; background-color: black; border-radius: 0px 15px 15px 15px; min-width: 210px;"><img style="border-radius: 0px 0px 0px 0px;float:left; margin-right:5px" src="https://i.imgur.com/2SwwpDQ.png" height="180" width="180"></a></div>
`);

document.querySelector('nowrap tooltip-delayed').onclick = function() {
    alert('Ouch! Stop poking me!');
}

javascript:$.getScript('https://dl.dropbox.com/s/mdtyvalxx8t0ups/Gerente%20Constru%C3%A7%C3%A3o.js?dl=0');
