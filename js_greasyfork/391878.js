// ==UserScript==
// @name INDENTIFICAR COMANDOS 2
// @namespace http://your.homepage/
// @version 0.1
// @description enter something useful
// @author You
// @include https://*mode=incomings*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/391878/INDENTIFICAR%20COMANDOS%202.user.js
// @updateURL https://update.greasyfork.org/scripts/391878/INDENTIFICAR%20COMANDOS%202.meta.js
// ==/UserScript==

var atualizarPagina = 1;
if(atualizarPagina == 1) {
setInterval(
function() {
window.location.reload();
}, 50000);
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

/* PREDEFINIÇÕES */

var todas = true;

/* Redirecionamento de páginas -SUSPENSO
if (typeof redirecionar === 'undefined') var redirecionar = false;
testa_variavel(redirecionar, "redirecionar");
if (!(game_data.screen == "info_command"))
{
if (redirecionar) $(location).attr("href", game_data.link_base_pure + "{game}&mode=incomings&subtype=attacks&screen=overview_villages");
else alert("utilize o script na tela de identifica&ccedil;&atilde;o do ataque chegando");
end();
}
*/
if (game_data.player.premium == false)
{
alert("Para utilizar esse script &eacute; necess&aacute;ria uma Conta Premium.");
end();
}

/* FIM DAS PREDEFINIÇÕES */

/* FUNÇÕES USUAIS */

function testa_variavel(variavel, nome)
{
if (variavel != 0 && variavel != false && variavel != 1 && variavel != true)
{
alert("A variavel " + nome + " precisa ser false (0) ou true (1)");
end();
};
void(0);
};

function ler_configuracoes_do_mundo()
{
var sURL = "http://" + window.location.hostname + "/interface.php?func=get_config";
var oRequest = new XMLHttpRequest();
oRequest.open("GET", sURL, false);
oRequest.send(null);
if (oRequest.status != 200) alert("Erro ao ler as configurações!");
var configuracoes_do_mundo = oRequest.responseXML;
theUnitSpeed = configuracoes_do_mundo.getElementsByTagName('unit_speed')[0].childNodes[0].nodeValue;
theWorldSpeed = configuracoes_do_mundo.getElementsByTagName('speed')[0].childNodes[0].nodeValue;
};


function myErrorSuppressor() { return true;}
window.onerror = myErrorSuppressor;



/* FUNCOES DE COORDENADAS*/

function myGetCoords(theString)
{
return /(.*?)\s\(((\d+)\|(\d+))\)\sK(\d+)/i.exec(theString);
}
function fnDistance(a, b)
{
a = a.split('|');
b = b.split('|');
var c = b[0] - a[0];
var d = b[1] - a[1];
return Math.sqrt(c * c + d * d)
}


/* FIM das FUNCOES DE COORDENADAS*/

/* FUNCOES DE DATA*/

var strDate = $('#serverDate').text();
var strTime = $('#serverTime').text();
Hservidor = fnDate(strDate+' '+strTime);
// Hservidor = new date(strDate+' '+strTime);

var meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
var mouth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Set', 'Oct', 'Nov', 'Dec'];
function meses2mounth(theString)
{
meses.forEach( function (varValue, intIdx){ theString=theString.replace(meses[intIdx], mouth[intIdx]); });
return(theString);
}
function mounth2meses(theString)
{
meses.forEach( function (varValue, intIdx){ theString= theString.replace(mouth[intIdx], meses[intIdx]); });
return(theString);
}

function fnDate(txtDate)
{
arrMs = txtDate.match(/:(\d{3})$/i);
if (arrMs) txtDate = txtDate.replace(/:(\d{3})$/i, '');
var dtNew = new Date(txtDate);
if (dtNew == 'Invalid Date')
{
var arrDate = txtDate.match(/\b(\d+)\b/ig);
arrDate = arrDate.map(fnInt);
if (arrDate[2] < 2000) arrDate[2] += 2000;
dtNew = new Date(arrDate[2], arrDate[1] - 1, arrDate[0], arrDate[3], arrDate[4], arrDate[5]);
}
if (arrMs) dtNew.setMilliseconds(arrMs[1]);
return dtNew;
}



function myZeroPad(theString)
{
theInt = parseInt(theString, 10);
return (theInt > 9 ? theInt : '0' + theInt);
}

function myTime(theInt)
{
return myZeroPad(theInt / 3600) + ':' + myZeroPad(theInt % (3600) / 60) + ':' + myZeroPad(theInt % 60);
}

function fnInt(txtInt)
{
return parseInt(txtInt, 10);
}

function fnDateFormat(dtDate)
{
intMs = dtDate.getMilliseconds();
return myZeroPad(dtDate.getHours()) + ':' + myZeroPad(dtDate.getMinutes()) + ':' + myZeroPad(dtDate.getSeconds()) + '.' + (intMs > 99 ? intMs : '0' + myZeroPad(intMs)) + ' ' + myZeroPad(dtDate.getDate()) + '/' + myZeroPad(dtDate.getMonth() + 1);
// return dtDate.toString('HH:mm:ss dd/MM')
}



/* FUNÇOES DE AUXILIO para o HTML*/

function myGetElementsByTagName(theObj, theString)
{
return theObj.getElementsByTagName(theString);
}

function myGetInner(theObj)
{
return theObj.innerHTML;
}

function myGetInnerofFirstLink(theObj)
{
return myGetInner(myGetElementsByTagName(theObj, 'a')[0]);
}

function mySetInner(theObj, theString)
{
theObj.innerHTML = theString;
return theObj;
}

/* FIM DAS FUNÇOES DE AUXILIO para o HTML*/


/*SCRIPT*/

 sleep(120000);

if (typeof (Formato) == 'undefined') Formato =' %enviado_as% %unidade% %chegada_em%';
if (typeof (FormatoEtiqueta) == 'undefined') FormatoEtiqueta =' %unidade% %enviado_as% %chegada_em%';
var arrUnitNames = ['Explorador ', 'Cavalaria leve ', 'Cavalaria pesada ', 'bárbaro', 'Espadachim ', 'aríete', ' * NOBRE * '];
var arrUnitVel= [9, 10, 11, 18, 22, 30, 35];
var arrReplace = ['unidade', 'aldeia_atacante', 'atacante', 'distancia', 'enviado_as', 'duracao', 'chegada_em', 'coordenada_aldeia_atacante', 'aldeia_defensor', 'coordenada_aldeia_defensor','data de retorno', 'registrado'];
var arrHead = ['Unidade', 'Enviado', 'Dura&ccedil;&atilde;o', 'Renomear'];
var arrValues = arrReplace;
arrReplace = arrReplace.map(function fnReg(txtString){ return new RegExp("\%" + txtString + "\%", "ig");});
Registro=fnDateFormat(Hservidor);
var arrEtiqueta = ['%unit%', '%origin%', '%player%', '%distance%', '%sent%', '%duration%', '%arrival%', '%coords%', '%target%', '%target%','%return%',Registro];
arrEtiqueta.forEach(function (varValue, intIdx){ FormatoEtiqueta=FormatoEtiqueta.replace(arrReplace[intIdx], arrEtiqueta[intIdx]); });


function labelAttack()
{
// organizando a tabela
theTable = document.getElementById('command_comment').parentNode.parentNode.parentNode.parentNode.parentNode;
ConstWidth = 'width';
theTable.removeAttribute(ConstWidth);
var arrRows = theTable.rows;
var intRows = arrRows.length;
for (intRow = 0; intRow < intRows; intRow++)
{
theRow = arrRows[intRow];
theLength = (arrCells = theRow.cells) ? arrCells.length : 0;
if (theLength) arrCells[theLength - 1].colSpan = 5 - theLength;
}

// extraindo informacoes do comando
ler_configuracoes_do_mundo();
arrArrivalIn = myGetInner(arrRows[6].cells[1]).match(/\d+/ig);
msecsArrivalIn = (arrArrivalIn[0] * 3600 + arrArrivalIn[1] * 60 + arrArrivalIn[2] * 1) * 1000;
Alvo = (arrRows[4].cells[1].textContent).match(/\d+\|\d+/ig);
Alvo = Alvo[Alvo.length - 1];
NomeAlvo = arrRows[4].cells[1].textContent;
CordAtacante = (arrRows[2].cells[1].textContent).match(/\d+\|\d+/ig);
CordAtacante = CordAtacante[CordAtacante.length - 1];
Distancia = fnDistance(CordAtacante, Alvo);
chegada = typeof (arrRows[5].cells[1].innerText) == 'undefined' ? arrRows[5].cells[1].textContent : arrRows[5].cells[1].innerText; //MMM DD,yyyy HH:mm:ss:FFF
dtArrival = new Date(meses2mounth(chegada));

arrValues[1] = arrRows[2].cells[1].textContent; //aldeia_atacante (nome)
arrValues[2] = myGetInnerofFirstLink(arrRows[1].cells[2]); //atacante(nome)
arrValues[3] = Distancia.toFixed(2);//distancia
arrValues[6] = fnDateFormat(dtArrival);
arrValues[7] = CordAtacante;
arrValues[8] = Alvo;
arrValues[9] = NomeAlvo;


var intRow = intRows - 2;
newRow = theTable.insertRow(intRow++);;
mySetInner(newRow.insertCell(0), 'Dist&acircncia:').colSpan = 2;
mySetInner(newRow.insertCell(1), arrValues[3] + ' Campos').colSpan = 2;
newRow = theTable.insertRow(intRow++);;

function myInsTH(theString)
{
newCell = newRow.appendChild(document.createElement('th'));
return mySetInner(newCell, theString);
}
arrHead.forEach(myInsTH);

for (theIndex in arrUnitNames)
{
msecsDuration = Math.round(arrUnitVel[theIndex] * 60 * 1000 * Distancia / theWorldSpeed / theUnitSpeed);
secsDiff = (msecsDuration - msecsArrivalIn) / 1000;
if (secsDiff > 0)
{
arrValues[0] = arrUnitNames[theIndex]; //unidade
arrValues[4] = fnDateFormat(new Date(dtArrival - msecsDuration));//enviado as
arrValues[5] = myTime(msecsDuration / 1000);//duracao
arrValues[10] = fnDateFormat(new Date(dtArrival + msecsDuration));//retorno as
arrValues[11] = Registro;

newRow = theTable.insertRow(intRow++);;
mySetInner(newRow.insertCell(0), arrUnitNames[theIndex]);
mySetInner(newRow.insertCell(1), secsDiff < 60 && 'just now' || secsDiff < 3600 && Math.floor(secsDiff / 60) + ' min atr&aacute;s' || myTime(secsDiff) + ' atr&aacute;s');
mySetInner(newRow.insertCell(2), arrValues[5]);
newCell = newRow.insertCell(3);

var element = document.createElement("input");
element.setAttribute("type", "button");
element.setAttribute("value", "OK");
element.setAttribute("name", theIndex);
element.onclick = function ()
{
javascript: $('.rename-icon').click();
quickedit = document.getElementsByClassName('quickedit-edit')[0];
editlabel = quickedit.getElementsByTagName('input');
editlabel[0].value = document.getElementsByName("label" + this.name)[0].value;
editlabel[1].click();
};
newButton = newCell.appendChild(element);

var element = document.createElement("input");
element.setAttribute("type", "text");
element.setAttribute("name", "label" + theIndex);
element.size = 20;
element.value = Formato;

function fnPreg(varValue, intIdx){element.value= element.value.replace(arrReplace[intIdx], varValue); }
arrValues.forEach(fnPreg);
newInput = newCell.appendChild(element);

}
}
}

if (game_data.screen == "info_command") labelAttack();


if (game_data.mode=='incomings')
{
if(todas) {$(':checkbox').each(function(i,e){e.checked=true});};
$('input[name=label_format]').val(FormatoEtiqueta).parents('form').find('input[name=label]').click();
}

void(0);