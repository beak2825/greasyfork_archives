// ==UserScript==
// @name        eMOARicons for Habtium
// @namespace   https://habtium.es
// @description Agrega un panel extra de emoticonos en el formulario de respuesta o de nuevo tema en el foro de Habtium.
// @icon        https://greasyfork.org/system/screenshots/screenshots/000/003/503/original/moarlogo.png
// @include     https://*habtium.es/forum/reply/*
// @include     https://*habtium.es/forum/post/*
// @include     https://*habtium.es/forum/edit/*
// @include     https://*habtium.es/forum/topic/*
// @authors     Álex R. E. (habtium.es/AlexRE)
// @copyright   Copyleft(c) 2016, ARE
// @version     0.5.5
// @grant       none
// @license     GPL - http://www.gnu.org/licenses/gpl-3.0.en.html
// @credits     Emoticonos extraídos de Forocoches, resubidos a Imgur
// @downloadURL https://update.greasyfork.org/scripts/17855/eMOARicons%20for%20Habtium.user.js
// @updateURL https://update.greasyfork.org/scripts/17855/eMOARicons%20for%20Habtium.meta.js
// ==/UserScript==

/*-------------Definición de constantes y variables-------------*/

// Lista de todos los emoticonos disponibles y su número
// A partir del i14 de HabboS
const itemsPerGroup = 17;
const emots = ['zwPISF9.gif',
			'cimY9sd.gif',
			'Ihbk5Yp.gif',
			'6jlUscE.gif',
			'MY8GIXi.gif',
			'VcdtbTb.gif',
			'v6kG2hU.gif',
			'nvd3ctp.gif',
			'GS6c7ZA.gif',
			'cWw3yBz.gif',
			'M9kUhuf.gif',
			'fSVHnTp.gif',
			'Acg0LmY.gif',
			'cb7EhG1.gif',
			'ITNQ2Ax.gif',
			'IAbUGBm.gif',
			'RZJnz56.gif',
			'Tcqdp8r.gif',
			'JvoZTg7.gif',
			'MAR5t8y.gif',
			'4A9bT6j.gif',
			'9y5FwHu.gif',
			'6y6I5JI.gif',
			'O1KgE64.gif',
			'ukYFhqP.gif',
			'0QqNjoz.gif',
			'OVTgkx0.gif',
			'nPxPPrR.gif',
			'MSBjB2H.gif',
			'07L2Abs.gif',
			'NbNdwff.gif',
			's1WdD5l.gif',
			'QlwLZEa.gif',
			'OIvLtfL.gif',
			'KI7TQop.gif'];

const emotCads = [':elrisas:', ':facepalm:', ':gaydude:', ':dale2:', ':nusenuse:', ':qmeparto:', ':roto2:', ':roto2cafe:', ':roto2gay:', ':roto2gaydude:', ':roto2nuse:', ':roto2qtemeto:', ':sherlock:', ':sisi3:', ':wikii:', ':uhh:', ':%:', ':pzz:', ':pp:', ':pbla:', ':ojitos:', ':mmm:', ':lO:', ':lengua:', ':jumm:', ':jum:', ':juju:', ':enfin:', ':cz:', ':chicle:', ':cejas:', 'asdf', '8D ', '8)', ':-.-:'];
const emotCount = emots.length;
const emotHost = "https://i.imgur.com/";


/*-------------Comienzo del script-------------*/
// Comprueba si estamos en un post viejo para sustituir emoticonos o no
if(window.location.href.indexOf("topic") > -1)
{	
	
	var urlComp = '<img src=\"'
	var cadReg = new RegExp('','g');
	
	//Reemplaza otros emoticonos antiguos por emojis actuales
	document.body.innerHTML = document.body.innerHTML.replace(/:l:/g, '<span title=\"&amp;lt;3\" class=\"emoji emoji2764\"><\/span>');
	document.body.innerHTML = document.body.innerHTML.replace(/:arriquitaaun:/g, '<span title=\":dancer:\" class=\"emoji emoji1f483\"><\/span>');
	
	for(var x=0; x < emotCount; x++)
	{
		cadReg = RegExp(emotCads[x], 'g');
		urlComp = '<img src=\"' + emotHost + emots[x] + '\" \/>';
		
		document.body.innerHTML = document.body.innerHTML.replace(cadReg, urlComp);
	}
	
}
else
{
  // Crea un nuevo bloque para emoticonos animados y lo acopla
  // al formulario de nueva respuesta.
  var emotGroup=document.createElement("div");
  var emotSeparator=document.createElement("br");
  emotGroup.setAttribute('class', 'button-group bbcode');

  document.getElementById('content').getElementsByClassName('box box-biggest')[1].getElementsByClassName('body bbcode')[0].appendChild(emotSeparator);
  document.getElementById('content').getElementsByClassName('box box-biggest')[1].getElementsByClassName('body bbcode')[0].appendChild(emotGroup.cloneNode(true));
  document.getElementById('content').getElementsByClassName('box box-biggest')[1].getElementsByClassName('body bbcode')[0].appendChild(emotGroup.cloneNode(true));

  // Genera un nuevo botón de añadir emoticono
  var emotInput=document.createElement("button");
  emotInput.setAttribute('type','button');
  emotInput.setAttribute('class', 'button grey small');

  // Coloca tantos botones como emoticonos disponibles hay
  var j=0;
  
  for(var i=0;i < 2;i++)
  {
    k = i*emotCount;
    while(j-k < itemsPerGroup && j < emotCount)
    {
       emotInput.setAttribute('onclick', 'addSmiley(\'reply_body\',\'[img]' + emotHost + emots[j] + '[/img]\')');
       emotInput.innerHTML="<img height=\"20\" src=\"" + emotHost + emots[j] + "\" />";
       document.getElementById('content').getElementsByClassName('box box-biggest')[1].getElementsByClassName('body bbcode')[0].getElementsByClassName('button-group bbcode')[9+i].appendChild(emotInput.cloneNode(true));
       j++;
    }
  }
}
  
