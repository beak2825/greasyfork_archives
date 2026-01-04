// ==UserScript==
// @name        baita ano
// @namespace   yadaa
// @description Conta quantas espécies de aves da lista do usuário tiveram seu registro em determinado local
// @include     https://www.wikiaves.com/especies.php?*&o=3&ef=
// @include     https://www.wikiaves.com.br/especies.php?*&o=3&ef=
// @version     1.7
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/35952/baita%20ano.user.js
// @updateURL https://update.greasyfork.org/scripts/35952/baita%20ano.meta.js
// ==/UserScript==

var extrato,seletor,seletorb,seletorc,quiqui,queque,tt,pen,tem,extcid,cc,dd,temest,itera;
var barrawidth=0;
var pe = "&p=";
var emno = " com registros fotográficos em ";
var lifers = []; //todo: novo
var especies;

if(!('contains' in String.prototype)){String.prototype.contains = function(str, startIndex){return -1 !== String.prototype.indexOf.call(this, str, startIndex);};}

function comeca() {
  var lugar = '.ttPage';
  $(lugar).append($('\
	<form action = >\
	<fieldset>\
	<span>... no Baita Ano RS de:</span>\
	<select id = "selLocal">\
	<option>2018</option>\
	<option>2017</option>\
	<option>2016</option>\
	<option>2015</option>\
	<option>2014</option>\
	<option>2013</option>\
	<option>2012</option>\
	<option>2011</option>\
	<option>2010</option>\
	<option>2009</option>\
	<option>2008</option>\
 </select>\
  <input type = "button"\
    value = "filtrar"\
    id = "botaum"\
  </fieldset>\
 </form>\
'));
  $("#botaum").click (analisa);
}

function analisa() {
	itera = /RS.*\/2018/ // Regular Expression p pegar registro
	//TODO: mudar pagina antes da analize para &o=3
	var lugarbarra = '.ttPage > form:nth-child(1) > fieldset:nth-child(1)';
	$(lugarbarra).append($('\
		<style>\
	#myProgress {\
  position: relative;\
  width: 100%;\
  height: 30px;\
  background-color: #ddd;\
	}\
	#myBar {\
  position: absolute;\
  width: 0%;\
  height: 100%;\
  background-color: #4CAF50;\
	}\
	#label {\
  text-align: center;\
  line-height: 30px;\
  color: white;\
	}\
	</style>\
		<div id="myProgress">\
  <div id="myBar">\
    <div id="label">0%</div>\
  </div>\
	</div>\
	'));		
		
		
  var tabela = document.getElementsByClassName('especies') [0];
  var local = document.getElementById("selLocal");
  var localb = "/"+local.options[local.selectedIndex].text;
	var localc = "/RS";
	document.getElementById("selLocal").disabled = true;
	document.getElementById("botaum").disabled = true;
	$(".textpadding > div:nth-child(6) > b:nth-child(1) > a:nth-child(1)").text("");
	$(".textpadding > div:nth-child(6) > b:nth-child(2) > a:nth-child(1)").text("");
	$(".textpadding > div:nth-child(6) > b:nth-child(3) > a:nth-child(1)").text("");
	$(".titulo > td:nth-child(1) > a:nth-child(1)").removeAttr("href");
	$(".titulo > td:nth-child(2) > a:nth-child(1)").removeAttr("href");
	$(".titulo > td:nth-child(3) > a:nth-child(1)").removeAttr("href");
	$(".titulo > td:nth-child(4) > a:nth-child(1)").removeAttr("href");
	$(".titulo > td:nth-child(5) > a:nth-child(1)").removeAttr("href");
	
	
	//emno=" ";
  extcid = conecta("especies.php?&t=e&e=20");
	
  for (var i = 2, row; i<=tabela.rows.length; i++) {
    row = tabela.rows[i];
		pen = Math.ceil(parseFloat($("tr.especie:nth-child("+i+") > td:nth-child(5) > a:nth-child(1)").text())/10);
		seletorc =  'tr.especie:nth-child(' + i + ') > td:nth-child(3) > a:nth-child(1)';
		quuquu = $(seletorc).text();
		
		if (!extcid.contains(quuquu)){
			var cuia = 'tr.especie:nth-child(' + i + ')';
			$(cuia).hide();
		}
		
		else{
		
    seletor = 'tr.especie:nth-child(' + i + ') > td:nth-child(5) > a:nth-child(1)';
    seletorb = 'tr.especie:nth-child(' + i + ') > td:nth-child(4) > a:nth-child(1)';
    quiqui = $(seletor).attr('href'); //registros foto
    queque = $(seletorb).attr('href'); //registros sons
		
    
	if (quiqui === undefined) { //SOH SOM
    	
        var cuia = 'tr.especie:nth-child(' + i + ')';
        $(cuia).hide();
    }
			
			
    else { // imagem E som ou soh imagem
	
	
				for (var k=1;k<=pen;k++){
					cc=(conecta(quiqui+pe+k));
					
					cc=cc.replace("./2018","YADA");
					cc=cc.replace("2018/2018","YADA");
					cc=cc.replace("href=\"/2018","YADA");
					cc=cc.replace(/\r?\n|\r/g, " "); //LIMPA paragrafos
					cc=cc.replace(/<\/?[^>]+(>|$)/g, ""); //LIMPA TAGs
					
				 	if (localb==="fora do Estado"){
					 for (var g=0;g<estados.length;g++){
				 			if (cc.contains(estados[g])){temest=true;dd=null;
						 break;
								 }
						}
     			} 
     			else{dd = converte(localb);} 
						if (itera.test(cc)&&cc.contains(dd) == true&&cc.contains(localc))
						{tem=true;break;
						}//else {tem=false;break;}
				
				}
		 				if (tem==true) {tem=false;temest=false;}
		 				else{
          		var cuia = 'tr.especie:nth-child(' + i + ')';
          		$(cuia).hide();
							}
				 
    }
		}
		
		////AQYU
		var elem = document.getElementById("myBar");
		barrawidth+= (100/(tabela.rows.length));
		elem.style.width = barrawidth + '%';
		document.getElementById("label").innerHTML = (barrawidth.toFixed(2)) * 1  + '%';  
	}
  
  
	$(".total > b:nth-child(2)").text(contar(tabela));
	$(".total").append(emno + localb.substring(1)+" no RS.");
	$(".total").get(0).scrollIntoView();
	elem.style.width = "100%";
	document.getElementById("label").innerHTML = "100%";
	console.log(converte(localb));
	postarGoogle();
}
	
function contar(atabela) {
	tt = 0;
	var y;//todo: novidade
	for (var i = 2, row; i<=atabela.rows.length; i++) {
		row = atabela.rows[i];
		var cuia = 'tr.especie:nth-child(' + i + ')';
		if ($(cuia).is(':visible')){
			tt++; //$(cuia).css("background-color","red");
			y=$("tr.especie:nth-child("+i+") > td:nth-child(3) > a:nth-child(1)").text();//todo: novidade
			lifers.push(y); //todo: novidade
			}
			}
	especies = lifers.join();
	return (tt);
			}
				
function conecta(x){
	var xhr;
	xhr = new XMLHttpRequest();
	xhr.open('GET', x, false);
	xhr.send();
	extrato = xhr.response;
	return (extrato);
	  
}

function converte(cidade){ //cidade
    valorcidade = cidade;
	return valorcidade;
}

function postarGoogle(){
  var usuarionome = $(".textpadding > a:nth-child(4)").text();
	var lifers = $(".total > b:nth-child(2)").text();
	var data = new Date(Date.now()).toLocaleString();
  $.ajax({					 
                url: "https://docs.google.com/forms/d/e/1FAIpQLSc_pL1htbmjGjQxP95zhMzsavJOdJBIwWwvX82DA5Vv3Lt88w/formResponse",
                data: { "entry.101800956" : usuarionome, "entry.1450640523" : lifers, "entry.412480081" : data, "entry.164661916" : especies },
                type: "POST",
                dataType: "xml",
                statusCode: {
                    0: function (){ 
                      usuarionome;
                      lifers;
                      data;
											especies;
                    },
                    200: function (){
                                         usuarionome;
                      lifers;
                      data;
											especies;
                                  }
                }
  });
}

function waitForKeyElements(
selectorTxt, /* Required: The jQuery selector string that
specifies the desired element(s).
*/
actionFunction, /* Required: The code to run when elements are
found. It is passed a jNode to the matched
element.
*/
bWaitOnce, /* Optional: If false, will continue to scan for
new elements even after the first match is
found.
*/
iframeSelector /* Optional: If set, identifies the iframe to
search.
*/
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes = $(selectorTxt);
    else
        targetNodes = $(iframeSelector).contents()
        .find(selectorTxt);

    if (targetNodes && targetNodes.length > 0) {
        btargetsFound = true;
        /*--- Found target node(s). Go through each and act if they
        are new.
        */
        targetNodes.each(function () {
            var jThis = $(this);
            var alreadyFound = jThis.data('alreadyFound') || false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound = actionFunction(jThis);
                if (cancelFound)
                    btargetsFound = false;
                else
                    jThis.data('alreadyFound', true);
            }
        });
    }
    else {
        btargetsFound = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj = waitForKeyElements.controlObj || {};
    var controlKey = selectorTxt.replace(/[^\w]/g, "_");
    var timeControl = controlObj[controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound && bWaitOnce && timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval(timeControl);
        delete controlObj[controlKey];
    }
    else {
        //--- Set a timer, if needed.
        if (!timeControl) {
            timeControl = setInterval(function () {
                waitForKeyElements(selectorTxt,
                actionFunction,
                bWaitOnce,
                iframeSelector
                );
            },
            300
            );
            controlObj[controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj = controlObj;
}


waitForKeyElements('.ttPage', comeca);
