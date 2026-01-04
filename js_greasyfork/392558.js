// ==UserScript==
// @name           OGame Fun: Utilidades B.O.R.G spica
// @namespace      https://greasyfork.org/es/users/385465-nagasis
// @version        1.8.4
// @description    Busca en la base de datos de la galaxia jugadores
// @author         NaGaSiS
// @match          https://spica.ogame.fun/game.php?page=galaxy*
// @include        https://spica.ogame.fun/game.php?page=*
// @grant GM_xmlhttpRequest
// @grant GM_log
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/392558/OGame%20Fun%3A%20Utilidades%20BORG%20spica.user.js
// @updateURL https://update.greasyfork.org/scripts/392558/OGame%20Fun%3A%20Utilidades%20BORG%20spica.meta.js
// ==/UserScript==
//https://i.ibb.co/k6NSG4H/ON.png
(function ()
 {

var db = openDatabase("BGspica", "1", "BORGS spica: Jugadores", 5*1024*1024);

//Aparece siempre el boton de atacar, incluso con sondas xD
    /*
    if (location.href.indexOf('/game.php?page=fleetStep2') != -1 ) {
        var nuevomenu;
               nuevomenu=`<tr style="height:20px;"><td class="transparent left"><input id="radio_6" type="radio" name="mission" value="6"><label for="radio_6"><span></span>Espiar</label><br></td></tr>`;
               nuevomenu+=`<tr style="height:20px;"><td class="transparent left"><input id="radio_5" type="radio" name="mission" value="5"><label for="radio_5"><span></span>Mantener posición</label><br></td></tr>`;
               nuevomenu+=`<tr style="height:20px;"><td class="transparent left"><input id="radio_9" type="radio" name="mission" value="9" checked="checked"><label for="radio_9"><span></span>Destruir</label><br></td></tr>`;
               nuevomenu+=`<tr style="height:20px;"><td class="transparent left"><input id="radio_1" type="radio" name="mission" value="1"><label for="radio_1"><span></span>Atacar</label><br></td></tr>`;
               nuevomenu+=`<td class="transparent left"><input id="radio_3" type="radio" name="mission" value="3"><label for="radio_3"><span></span>Transportar</label><br></td>`;
               document.querySelector("#inhalt > form > div > table > tbody > tr:nth-child(2) > td.left.top > table > tbody").innerHTML = nuevomenu;

    }*/

//incluimos la función doit en todas las paginas de ogame
var sc = document.createElement("script");
sc.setAttribute("src", "./scripts/game/galaxy.js?v=2676");
sc.setAttribute("type", "text/javascript");
document.head.appendChild(sc);

        // ==============================================================================================
       //  FUNCION DOIT para acceso a misiones
      //   ==============================================================================================

 function doit(missionID, planetID) {
                         $.getJSON("game.php?page=fleetAjax&ajax=1&mission="+missionID+"&planetID="+planetID, function(data)
                                   {
                             serverTime 	= data.serverTime;
                             serverTime 	= new Date(serverTime[0], serverTime[1] - 1, serverTime[2], serverTime[3], serverTime[4], serverTime[5]);
                             startTime	= serverTime.getTime();
                             $('#slotUsed').text(data.slots);
                             if(typeof data.ships !== "undefined")
                             {
                                 $.each(data.ships, function(elementID, value) {
                                     $('#elementID'+elementID).text(number_format(value));
                                 });
                             }
                             var key = null, first = null;

                             $('.allFleetsEvent').html('');
                             var e = $($("#table-row").html());
                             var fleet_span = e.find('.fleets');
                             var a = 0;
                             $.each(data.table, function (index, item){
                                 fleet_span.attr('id', 'fleettime_' + index);
                                 fleet_span.attr('data-fleet-end-time', item.returntime);
                                 fleet_span.attr('data-fleet-time', item.resttime);
                                 fleet_span.html(GetRestTimeFormat(item.resttime));

                                 if(a == 0){
                                     e.find('.heightCol').addClass('__remove-when-first');

                                 }else{
                                     e.find('.heightCol').removeClass('__remove-when-first');
                                     $("#OvfleetContent").show();
                                 }

                                 a++;


                                 e.find('.__text').html(item.text);
                                 $('.allFleetsEvent').append(e.clone());
                             })

                             $('.allFleetsEvent > #OvfleetEvents > span:eq(1)').attr('data-hide','true');
                             $('.allFleetsEvent > #OvfleetEvents > span:eq(1) > span').first().hide();
                             $('span[data-hide="true"]').prev().hide();
                             var hareketSay=$(".__remove-when-first").eq(0);
                             $(hareketSay).css("display","none");

                             var statustable	= $('#fleetstatusrow');
                             var messages	= statustable.find("~tr");
                             if(messages.length == MaxFleetSetting) {
                                 messages.filter(':last').remove();
                             }
                             var element		= $('<td />').attr('colspan', 8).attr('class', data.code == 600 ? "success" : "error").text(data.mess).wrap('<tr />').parent();
                             statustable.removeAttr('style').after(element);
                             if(data.code == 600){
                                 $('.__first-fleet-event').html('');
                                 for(var key in data.table){
                                     first = data.table[key];
                                     fleet_span.attr('id', 'fleettime_' + key);
                                     fleet_span.attr('data-fleet-end-time', first.returntime);
                                     fleet_span.attr('data-fleet-time', first.resttime);
                                     fleet_span.html(GetRestTimeFormat(first.resttime));
                                     e.find('.__text').html(first.text);
                                     $('.__first-fleet-event').append(e.clone());
                                     if(typeof(first) !== 'function'){
                                         break;
                                     }
                                 }
                             }
                             $('.allFleetsEvent').hide();
                         });

                  }
        // ==============================================================================================
       //  UTILIDADES VISION GALAXIA
      //   ==============================================================================================

         if (location.href.indexOf('/game.php?page=galaxy') != -1 ) {
                 var espia = '<p align="center"><br><table class="" width="100%">';
                 espia += '<td width="25%" style="background-color:transparent;border:0px;text-align:left"><p style="color: #FFFFFF; font-size: 12pt" id="text">Espia código</p></td>';
                 espia += '<td width="15%" style="background-color:transparent;border:0px;text-align:left"><p style="color: #FFFFFF; font-size: 10pt" id="coordenadas"><input id="espia" type="text" name="espia" style="height:12px;width:45px;"></p></td>';
                 espia += '<td width="7%" style="background-color:transparent;border:0px;text-align:left"><p style="color: #FFFFFF; font-size: 10pt" id=""><input type="image" id="btn_espia" src="./styles/theme/gow/img/e.gif" onsubmit="submit();" /></p></td>';
               // espia += '<td width="15%" style="background-color:transparent;border:0px;text-align:left"><p style="color: #FFFFFF; font-size: 12pt" id="gt">Espia Sistema: </p></a></td>';
               // espia += '<td width="8%" style="background-color:transparent;border:0px;text-align:left"><p style="color: #FFFFFF; font-size: 10pt"><input type="image" id="btn_gt" src="https://i.ibb.co/HGt9dgw/OFF.png""></p></a></td>';
               // espia += '<td width="8%" style="background-color:transparent;border:0px;text-align:left"><p style="color: #FFFFFF; font-size: 12pt" id="text">Velocidad</p></a></td>';
               // espia += '<td width="8%" style="background-color:transparent;border:0px;text-align:left"><p style="color: #FFFFFF; font-size: 10pt" id="coordenadas"><input id="velocidad" type="text" name="velocidad" style="height:12px;width:20px;"></p></a></td>';
               // espia += '<td width="50%" style="background-color:transparent;border:0px;text-align:left"><p style="color: #FFFFFF; font-size: 10pt" id=""></p></a></td>';
                 espia += '<td width="55%" style="background-color:transparent;border:0px;text-align:left"><p style="color: #FFFFFF; font-size: 10pt" id=""></p></a></td>';
                 espia += '</tr></table></p>';
                 document.querySelector("#fleetstatusrow > td").innerHTML = espia;
                 var elem = document.querySelector('#fleetstatusrow > td > p:nth-child(1)');
                 elem.parentNode.removeChild(elem);

                 addEvent(document.getElementById("btn_espia"), "click", function(){spy($('#espia').val())});
                 //addEvent(document.getElementById("btn_gt"), "click", function(){gt()});

             // Botón Espiar Luna
                 var nombre;
                 var spymoon;
                 var planeta;

                 for (var i = 1; i < 16; i++)
                     {
                         nombre = document.querySelector(`#galaxytableHead > tbody > tr:nth-child(${i})`).children[6].innerText;
                         spymoon = document.querySelector(`#galaxytableHead > tbody > tr:nth-child(${i})`).children[3].childElementCount;
                         var modo = nombre.substring(nombre.indexOf("(V)"), nombre.indexOf(")"));
                         modo = modo.replace("(","");

                         //var nombre; nombre=document.querySelector(`#galaxytableHead > tbody > tr:nth-child(6)`).children[6].innerText.substring(document.querySelector(`#galaxytableHead > tbody > tr:nth-child(6)`).children[6].innerText.indexOf(" "), document.querySelector(`#galaxytableHead > tbody > tr:nth-child(6)`).children[6].innerText.indexOf(""));

                         if (nombre == "" || spymoon =="0"){
                             nombre = "vacio";
                         }else{

                             spymoon = document.querySelector(`#galaxytableHead > tbody > tr:nth-child(${i})`).children[3].innerHTML;
                             spymoon = spymoon.substring(spymoon.indexOf("javascript:doit"), spymoon.indexOf(";"));
                             planeta = document.querySelector(`#galaxytableHead > tbody > tr:nth-child(${i}) > td.action`).innerHTML
                             planeta = planeta.substring(planeta.indexOf("javascript:doit"), planeta.indexOf("{"));
                             planeta = planeta + ")";

                             spymoon = `<a href="${spymoon}"><img width="17" src="https://i.ibb.co/M1tgKLH/e.gif" class="tooltip" data-tooltip-content="Espiar" alt=""></a>`
                             planeta = `<a href="${planeta}"><img width="17" src="./styles/theme/gow/img/e.gif" class="tooltip" data-tooltip-content="Espiar" alt=""></a>`;
                             //document.querySelector("#galaxytableHead > tbody > tr:nth-child(9) > td.action")
                             document.querySelector(`#galaxytableHead > tbody > tr:nth-child(${i}) > td.action`).innerHTML = planeta+spymoon;


                         }

                              if(modo =="V"){$(`#galaxytableHead > tbody > tr:nth-child(${i}) > td.action`).remove();}


                     }

         }

                 function spy(espiar) {
                        var href = $("#btn_espia").attr('<a href="javascript:doit(6,8336)');
                        //window.location.href = href;
                     var missionID = "6";

                 //<a href="javascript:doit(6,8336,{&quot;210&quot;:&quot;40&quot;})"></a>

                     //FUNCION DOIT PARA ATACAR TRANSPORTAR ESPIAR RECICLAR

            doit(missionID, espiar);

         }


     // ==============================================================================================
     // UTILIDADES MENSAJES CARGAS NECESARIAS Y FILTRADO DE FLOTAS
     // =============================================================================================
    if (location.href.indexOf('/game.php?page=messages') != -1 ) {

        $("#content > table:nth-child(1) > tbody > tr:nth-child(3) > td:nth-child(4) > a").click();
        var s = 2 * 150;
        setTimeout(submit,s);

        function submit(){
             for (var j = 1; j < document.querySelector("#messagestable > tbody").childElementCount; j++)
             {
                 var count = document.querySelector("#messagestable > tbody").children[j].childElementCount;
                 if (document.querySelector("#messagestable > tbody").children[j].childElementCount == "4"){
                         var espionaje = document.querySelector("#messagestable > tbody").children[j].innerText.indexOf("Departamento de espionaje");

                     if (espionaje!= "-1"){
                              j= j+1;
                              var informe = document.querySelector("#messagestable > tbody").children[j].innerText;
                              var metal = informe.substring(informe.indexOf("Metal"),informe.indexOf("Cristal"));
                              metal = metal.replace("Metal", "");
                              metal = metal.replace(/[^\d\,]/g, '')
                              metal = parseInt(metal);
                              metal = metal/2;
                              var cristal = informe.substring(informe.indexOf("Cristal"),informe.indexOf("Deutério"));
                              cristal = cristal.replace("Cristal", "");
                              cristal = cristal.replace(/[^\d\,]/g, '')
                              cristal = parseInt(cristal);
                              cristal = cristal/2;

                              var existe = informe.indexOf("Energía");
                         if(existe != "-1"){
                              var duty = informe.substring(informe.indexOf("Deutério"),informe.indexOf("Energía"));
                              duty = duty.replace("Deutério", "");
                              duty = duty.replace(/[^\d\,]/g, '')
                              duty = parseInt(duty);
                              duty = duty/2;
                         }else{
                              var duty = informe.substring(informe.indexOf("Deutério"),informe.indexOf("Naves"));
                              duty = duty.replace("Deutério", "");
                              duty = duty.replace(/[^\d\,]/g, '')
                              duty = parseInt(duty);
                              duty = duty/2;
                             //Pinto edificios solo en lunas
                           //  document.querySelector("#messagestable > tbody").children[j].childNodes[1].children[0].children[1].children[5].children[0].innerHTML = `<div class="class="spyRaportContainerHead spyRaportContainerHeadClass300"><p style="color: #0CFF00; font-size: 8pt">Edificios Luna</p></div>`

                         }

                              var total = duty + cristal + metal;
                              var cargap = parseInt(total/200000);
                              var cargag = parseInt(total/1000000);
                              var formatNumber = {
                                  separador: ".", // separador para los miles
                                  sepDecimal: ',', // separador para los decimales

                                  formatear:function (num){
                                      num +='';
                                      var splitStr = num.split('.');
                                      var splitLeft = splitStr[0];
                                      var splitRight = splitStr.length > 1 ? this.sepDecimal + splitStr[1] : '';
                                      var regx = /(\d+)(\d{3})/;
                                      while (regx.test(splitLeft)) {
                                          splitLeft = splitLeft.replace(regx, '$1' + this.separador + '$2');
                                      }
                                      return this.simbol + splitLeft +splitRight;
                                  },
                                  new:function(num, simbol){
                                      this.simbol = simbol ||'';
                                      return this.formatear(num);
                                  }
                              }

                              cargap = formatNumber.new(cargap);
                              cargag = formatNumber.new(cargag);

                        // document.querySelector("#messagestable > tbody > tr:nth-child(6) > td > div:nth-child(2) > div.spyRaportHead")
                        // document.querySelector("#messagestable > tbody > tr:nth-child(6) > td > div:nth-child(2) > div:nth-child(2)")
                         //document.querySelector("#messagestable > tbody").children[j].remove();


                         //ANALISIS DE FLOTAS VS DEFENSA
                         //CAMBIO DE BOTONES ATACAR Y SIMULAR
                              espionaje = document.querySelector("#messagestable > tbody").children[j].childNodes[1].innerHTML;

                           //   var cabezera = document.querySelector("#messagestable > tbody").children[j].childNodes[1].children[0].children[0].innerHTML;
                                  //cabezera += `<div class="spyRaportContainer">`;
                             //     cabezera += `<div class="spyRaportContainerHead spyRaportContainerHeadClass900 "><p style="color: #0CFF00; font-size: 8pt">Recursos</p></div>`;
                                 // cabezera += document.querySelector("#messagestable > tbody").children[j].childNodes[1].children[0].children[1].children[1].innerHTML;
                               //   cabezera += document.querySelector("#messagestable > tbody").children[j].childNodes[1].children[0].children[1].children[2].innerHTML;


                             //document.querySelector("#messagestable > tbody").children[j].childNodes[1].children[0].remove();
                             //espionaje.substring(espionaje.indexOf(`<div class="spyRaport"><div class="spyRaportHead">`),espionaje.indexOf(`</div>`));

                             // var simular= document.querySelector("#messagestable > tbody").children[j].childNodes[1].children[1].children[1].children[6].children[11].children[3].attributes[0].value;
                              //var atacar= document.querySelector("#messagestable > tbody").children[j].childNodes[1].children[0].children[1].children[6].children[11].children[0].attributes[0].value;

                              espionaje =  `<div class="spyRaport"><p style="color: #00E0FF; font-size: 8pt">NAVES DE CARGA NECESARIAS: Cargas Pequeñas: ${cargap} Cargas Grandes: ${cargag} </p></div>`+espionaje
                              document.querySelector("#messagestable > tbody").children[j].childNodes[1].innerHTML = espionaje;

                             //Recursos
                           //   document.querySelector("#messagestable > tbody").children[j].childNodes[1].children[1].children[1].children[0].innerHTML = `<div class="class="spyRaportContainerHead spyRaportContainerHeadClass900"><p style="color: #0CFF00; font-size: 8pt">Recursos</p></div>`
                             //Naves
                            //  document.querySelector("#messagestable > tbody").children[j].childNodes[1].children[1].children[1].children[3].children[0].innerHTML = `<div class="class="spyRaportContainerHead spyRaportContainerHeadClass200"><p style="color: #0CFF00; font-size: 8pt">Naves</p></div>`
                             //Sistema de Defensa
                            //  document.querySelector("#messagestable > tbody").children[j].childNodes[1].children[1].children[1].children[4].children[0].innerHTML = `<div class="class="spyRaportContainerHead spyRaportContainerHeadClass400"><p style="color: #0CFF00; font-size: 8pt">Defensa</p></div>`
                             //Tecnos
                             // document.querySelector("#messagestable > tbody").children[j].childNodes[1].children[1].children[1].children[6].children[0].innerHTML = `<div class="class="spyRaportContainerHead spyRaportContainerHeadClass100"><p style="color: #0CFF00; font-size: 8pt">Tecnos</p></div>`
                             // document.querySelector("#messagestable > tbody").children[j].childNodes[1].children[1].children[1].children[6].children[2].remove();
                             // document.querySelector("#messagestable > tbody").children[j].childNodes[1].children[1].children[1].children[6].children[3].remove();
                             // document.querySelector("#messagestable > tbody").children[j].childNodes[1].children[1].children[1].children[6].children[4].remove();
                             // document.querySelector("#messagestable > tbody").children[j].childNodes[1].children[1].children[1].children[6].children[5].remove();
                             // document.querySelector("#messagestable > tbody").children[j].childNodes[1].children[1].children[1].children[6].children[6].remove();
                            //  document.querySelector("#messagestable > tbody").children[j].childNodes[1].children[1].children[1].children[6].children[7].remove();
                            //  document.querySelector("#messagestable > tbody").children[j].childNodes[1].children[1].children[1].children[6].children[8].remove();
                           //   document.querySelector("#messagestable > tbody").children[j].childNodes[1].children[1].children[1].children[6].children[9].remove();
                           //   document.querySelector("#messagestable > tbody").children[j].childNodes[1].children[1].children[1].children[6].children[10].remove();

                        /*      var militar = simular.substring(simular.indexOf("[109]="),simular.indexOf("&im[110]"));
                              militar = militar.replace("[109]=","");
                              var defensa = simular.substring(simular.indexOf("[110]="),simular.indexOf("&im[111]"));
                              defensa = defensa.replace("[110]=","");
                              var blindaje = simular.substring(simular.indexOf("[111]="),simular.indexOf("&im[113]"));
                              blindaje = blindaje.replace("[111]=","");
                              var tecnos = `<div class="spyRaportContainerRow clearfix"> Militar: ${militar} Defensa: ${defensa} Blindaje: ${blindaje} </div>`;
                            //  document.querySelector("#messagestable > tbody").children[j].childNodes[1].children[1].children[1].children[6].children[1].innerHTML = tecnos;

                              // Botones Nuevos en una linea
                          //    var botonsmiu= `<a href=${simular} class="small green button" style="color: #FFFFFF">Simular</a>`;
                           //   var botonataca= `<a href=${atacar} class="small red button" style="color: #FFFFFF">Atacar</a>`;
                             // document.querySelector("#messagestable > tbody").children[j].childNodes[1].children[1].children[1].children[6].children[11].innerHTML = botonataca+botonsmiu;
*/


                     }
                 }
              }

         }
    }
    // ==============================================================================================
     // FUNCIONES BOTON GALAXY TOOL MENU WEB
     // ==============================================================================================

     function gethttprequest(dirurl) {
         var respuesta;
         GM_xmlhttpRequest({
             method: "GET",
             url: dirurl,
             onload: function(response) {
                 var resphttprequest = document.createElement('div');
                 resphttprequest.id = "resphttprequest";
                 resphttprequest.innerHTML = response.responseText;
                 resphttprequest.style.display = "none";
                 resphttprequest.tag = dirurl;
                 document.body.appendChild(resphttprequest);
             }
         });
     }

     function MenuLib() {

         // crea un boton en el menu izquierdo dentro del juego
         this.menuButton_create = function() {
             var MenuTableTools = document.getElementById('menuTable');
             var Data = document.getElementById('trusrenocomp');
             if (! Data) {
                 var ListElement = document.createElement('li');
                 ListElement.innerHTML = '<div id="trusrenocomp" style="display: none;"></div>'
                 + '<a id="btn_menu_trusrenocomp" href="javascript:void(0)" class="menubutton"><span class="textlabel"><p style="color:#F59754">Buscador Galaxia</p></span></a>';
                 if (MenuTableTools.childNodes.length) {
                     MenuTableTools.insertBefore( ListElement, MenuTableTools.childNodes[25]);
                 }
                 else {
                     MenuTableTools.appendChild(ListElement);
                 }
                 Data = document.getElementById('trusrenocomp');
                 Data.parentNode.addEventListener('click', this.menuButton_click, false);
             }
         };

         // acciones a realizar al pulsar sobre el boton del menu
         this.menuButton_click = function() {

            //    alert("CLICK");
             //document.location ="https://europa.ogame.fun/game.php?page=galaxy";
               //do something special
             //var myURL = document.location;

             var ContentWrapper = document.getElementById('inhalt');
             if (ContentWrapper) {
                 var content = '',
                     Inhalt = document.getElementById('inhalt'),
                     Container = document.getElementById('trusrenocomp_div_container');
                 if (Inhalt) { Inhalt.style.display = (Container) ? 'block' : 'hidden'; }
             }
             if (Container) {
                 ContentWrapper.removeChild( Container );
             }
             else {
                 Container = document.createElement('div');
                 Container.id = 'trusrenocomp_div_container';
                 if (ContentWrapper.childNodes.length) {
                     ContentWrapper.insertBefore( Container, ContentWrapper.childNodes[0] );
                 }
                 else {
                     ContentWrapper.appendChild( Container );
                 }
                 // seccion menu  background="https://silverspock.files.wordpress.com/2011/08/star-trek-borg-cube.jpg" https://cdn6.aptoide.com/imgs/6/5/e/65eed801befec5d5b08e09cb26cf4fd4_icon.png
                 content += '<p align="center"><br><br><table border="0" background="https://silverspock.files.wordpress.com/2011/08/star-trek-borg-cube.jpg" class="" width="100%">';
                 content += '<tr><td colspan="4" style="background-color:transparent; font-size: 15pt">'
                 content += '<center><b><p style="color:#FFFF00";>Buscador BORG Ogame.fun </p></b></center>';
                 content += '</td></tr>';
                 content += '<tr>';
                 content += '</tr></table></p>';
                 content += '<div id="div_buscador" style="background-color:transparent"><br>';
                 content += '!!!! IMPORTANTE !!!!Para que funcione correctamente antes se tiene que haber cargado la base de datos completamente, si no, los resultados serán incompletos, para eso hay que ejecutar primero el script que carga la base de datos';
                 content += '<br>';
                 content += '<center><form action="" method="post"><span style="test-align:left">Nombre de usuario:</span><input id="jugador" type="text" name="user"><input class="btn_blue" type="button" id="btn_buscar" value="Buscar"></form></center>';
                 content += '<br>';
                 content += '<center><span style="test-align:left"><p style="color: #FFFF00; font-size: 10pt">Busqueda Avanzada:</p></span></center>';
                 content += '<center><select name="galaxia"><option value="1">Galaxia 1</option><option value="2">Galaxia 2</option><option value="3">Galaxia 3</option><option value="4">Galaxia 4</option><option value="5">Galaxia 5</option><option value="6">Galaxia 6</option></select><input  id="sistemaiq" type="text" name="sistemaiq" style="height:12px;width:45px;"><input  id="sistemadch" type="text" name="sistemadch" style="height:12px;width:45px;"><button id ="btn_avanzado" class="small blue button">Avanzado</button></center>';
                 content += '<center><span style="test-align:left">Inactivos:<select name="inactivos"><option value="no">No</option><option value="si">Si</option></select>Vacaciones:<select name="vacaciones"><option value="no">No</option><option value="si">Si</option></select></span></center>';
                 content += '<br>';
                 content += '<center><span style="test-align:left" style="color: #FFFF00; font-size: 10pt">Buscador Alianza:</span><input  id="alianza" type="text" name="alianza" style="height:12px;width:45px;"><button id ="btn_alianza" class="small green button">Alianza</button></center>';
                 content += '<p align="center"><br><table class="" width="100%">';
                 content += '<tr width="100%" style="text-align:left;" bgcolor="#240B3B"><p style="color: #FFFFFF; font-size: 10pt" id="tplanetas"></p></a></tr>';
                 //content += '<br>';
                 content += '<td width="15%" style="text-align:center;" bgcolor="#240B3B"><p style="color: #FFFFFF; font-size: 10pt" id="coordenadas">Coord</p></a></td>';
                 content += '<td width="15%" style="text-align:center;" bgcolor="#240B3B"><p style="color: #FFFFFF; font-size: 10pt" id="jugador">Jugador</p></a></td>';
                 content += '<td width="15%" style="text-align:center;" bgcolor="#240B3B"><p style="color: #FFFFFF; font-size: 10pt" id="jugador">Estado</p></a></td>';
                 content += '<td width="15%" style="text-align:center;" bgcolor="#240B3B"><p style="color: #FFFFFF; font-size: 10pt" id="jugador">Alianza</p></a></td>';
                 content += '<td width="15%" style="text-align:center;" bgcolor="#240B3B"><p style="color: #FFFFFF; font-size: 10pt" id="codigo">C.Planeta</p></a></td>';
                 content += '<td width="15%" style="text-align:center;" bgcolor="#240B3B"><p style="color: #FFFFFF; font-size: 10pt" id="codigo">C.Luna</p></a></td>';
                 content += '<td width="15%" style="text-align:center;" bgcolor="#240B3B"><p style="color: #FFFFFF; font-size: 10pt" id="codigo">Espiar</p></a></td>';
                 content += '</tr></table></p>';
                 content += '<p align="center"><br><table id="lista-planetas" width="100%">';
                 content += '</tr></table></p>';
                 content += '<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>'
                 content += '</div>';

                 document.getElementById('trusrenocomp_div_container').innerHTML = content;
                 addEvent(document.getElementById("btn_buscar"), "click", function(){buscar($('#jugador').val())});
                 addEvent(document.getElementById("btn_avanzado"), "click", function(){buscaravanzado($('#sistemaiq').val(),$('#sistemadch').val())});
                 addEvent(document.getElementById("btn_alianza"), "click", function(){buscaralianza($('#alianza').val())});

             }

         } //Fin función click


     }

     // ==============================================================================================
     // FUNCIONES BUSCADOR AVANZADO EN LA BD Y PINTAR RESULTADOS
     // ==============================================================================================

function buscaravanzado(sistemaiq,sistemadch) {
    if(sistemaiq=="" || sistemadch==""){
         alert("Tienes que rellenar el campo del sistema al sistema para realizar busquedas avanzadas!!!!!!!!!");
   }else{
        var msg="";
        var contador = 0;
        var estado="";
        var galaxia = $("#div_buscador > center:nth-child(6) > select").val();
        var inactivos = $("#div_buscador > center:nth-child(7) > span > select:nth-child(1)").val();
       // console.log("Valor Inactivos: "+inactivos);
        var vacaciones = $("#div_buscador > center:nth-child(7) > span > select:nth-child(2)").val();
       // console.log("Valor Vacaciones: "+vacaciones);
        var soloinactivos = $("#div_buscador > center:nth-child(7) > span > select:nth-child(3)").val();
       // console.log("Valor Solo Inactivos: "+soloinactivos);
        $("#lista-planetas").empty()
        $("#tplanetas").empty();
        var busqueda = "vacio";
//javascript:doit(6,7648,)

//SELECT * from Product_sales where(From_date BETWEEN '2013-01-03'AND '2013-01-09')

        if(inactivos=="si"){estado = "Inactivo";}
        if(vacaciones == "si"){ estado = "Vacaciones";}
        if(inactivos=="no" && vacaciones == "no") { estado = "Activo";}

        //console.log(estado);

//            ResultSet rs = stat.executeQuery("select * from people WHERE strftime('%Y-%m-%d', DateSort) BETWEEN '2015-01-01' AND '2015-12-31';"); Activo

         db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM players WHERE galaxy=? AND system BETWEEN ? AND ? ", [galaxia,sistemaiq,sistemadch], function (tx, result) {
               console.log(result);

               var len = result.rows.length, i;

               for (i = 0; i < len; i++) {
                  var coordenada = result.rows.item(i).galaxy + ":" + result.rows.item(i).system + ":" +result.rows.item(i).planet;
                  if( result.rows.item(i).codigo!="vacio") {
                      var codigoplaneta = result.rows.item(i).codigo.substring(result.rows.item(i).codigo.indexOf(","), result.rows.item(i).codigo.indexOf(",)"));
                      codigoplaneta = codigoplaneta.replace(",", "");
                  }else{
                      var codigoplaneta = "vacio";
                  }

                  var prueba="";
                  prueba=result.rows.item(i).name.substring(result.rows.item(i).name.indexOf("("), result.rows.item(i).name.indexOf(")"));
                  prueba = prueba.replace("(","");
                  //console.log(result.rows.item(i).name +"Estado:"+ prueba);

                  if (prueba =="i"){ prueba="Inactivo";}

                  if (prueba.length == "0"){
                      prueba="Activo";
                   }
                  if (prueba.length == "1"){
                      prueba="Vacaciones";
                  }
                  if (prueba.length == "3" || prueba=="i"){
                          prueba="Inactivo";
                   }


                   if (prueba == estado){
                       //Variable de resultados
                       contador = contador + 1;

                      if(result.rows.item(i).codigom!="vacio") {
                          var codigoluna = result.rows.item(i).codigom.substring(result.rows.item(i).codigom.indexOf(","), result.rows.item(i).codigom.indexOf(")"));
                          codigoluna = codigoluna.replace(",", "");
                          msg = `<td width="15%" style="text-align:center;" bgcolor="#240B3B"><a style="color: #FFFFFF; font-size: 10pt" id="mostrar_sec4" href="https://spica.ogame.fun/game.php?page=galaxy&galaxy=${result.rows.item(i).galaxy}&system=${result.rows.item(i).system}">${coordenada}</a></td>` + `<td width="15%" style="text-align:center;" bgcolor="#240B3B">`+ result.rows.item(i).name + `</td>`+  `<td width="15%" style="text-align:center;" bgcolor="#240B3B">`+ prueba + `</td>`+ `<td width="15%" style="text-align:center;" bgcolor="#240B3B">`+ result.rows.item(i).alianza + `</td>`+`<td width="15%" style="text-align:center;" bgcolor="#240B3B">`+ codigoplaneta + `</td>`+ `</td>`+ `<td width="15%" style="text-align:center;" bgcolor="#240B3B">`+ codigoluna + `</td>` + `<td width="15%" style="text-align:left;" bgcolor="#240B3B"><a href="javascript:doit(6,${codigoplaneta})"><img width="24" src="${result.rows.item(i).planetimg}" class="tooltip" data-tooltip-content="Espiar" alt=""></a><a href="javascript:doit(6,${codigoluna})"><img width="16" src="./styles/theme/gow/planeten/small/s_mond.png" class="tooltip" data-tooltip-content="Espiar" alt=""></a></td>`;
                      }else{
                          var codigoluna = "vacio";
                          msg = `<td width="15%" style="text-align:center;" bgcolor="#240B3B"><a style="color: #FFFFFF; font-size: 10pt" id="mostrar_sec4" href="https://spica.ogame.fun/game.php?page=galaxy&galaxy=${result.rows.item(i).galaxy}&system=${result.rows.item(i).system}">${coordenada}</a></td>` + `<td width="15%" style="text-align:center;" bgcolor="#240B3B">`+ result.rows.item(i).name + `</td>`+  `<td width="15%" style="text-align:center;" bgcolor="#240B3B">`+ prueba + `</td>`+ `<td width="15%" style="text-align:center;" bgcolor="#240B3B">`+ result.rows.item(i).alianza + `</td>`+`<td width="15%" style="text-align:center;" bgcolor="#240B3B">`+ codigoplaneta + `</td>`+ `</td>`+ `<td width="15%" style="text-align:center;" bgcolor="#240B3B">`+ codigoluna + `</td>` + `<td width="15%" style="text-align:left;" bgcolor="#240B3B"><a href="javascript:doit(6,${codigoplaneta})"><img width="24" src="${result.rows.item(i).planetimg}" class="tooltip" data-tooltip-content="Espiar" alt=""></a></td>`;
                      }
                      // <a href="javascript:doit(6,${codigoluna})"><img width="16" src="./styles/theme/gow/img/e.gif" class="tooltip" data-tooltip-content="Espiar" alt=""></a>

                      document.querySelector("#lista-planetas").innerHTML += msg + `<table id="galaxytableHead" style="width:654px;padding:0px;margin:0px;" cellspacing="0" cellpadding="0" border="0"><tfoot><tr id="fleetstatusrow" class="info"></tr></table></tr></tfoot></table>`;
                  } //Cierro IF pintar
               }//Cierro estado FOR
                 document.querySelector("#tplanetas").innerHTML += "<p> ---> Planetas encontrados: " + contador;
            }, null);
         });


     }//Cierro el else de control

 }
     // ==============================================================================================
     // FUNCIONES BUSCAR JUGADORES DE UNA MISMA ALIANZA Y PINTAR RESULTADOS
     // ==============================================================================================

    function buscaralianza(alianza) {
             var msg="";
             //doit("6", "5804");
             $("#lista-planetas").empty()
             $("#tplanetas").empty();
//SELECT * FROM contacts WHERE cname LIKE ?%   (cname LIKE ?)'  '%'+cname+'%'
         db.transaction(function (tx) {
            tx.executeSql("SELECT DISTINCT name FROM players WHERE (alianza LIKE ?) ", [alianza], function (tx, result) {
               console.log(result);
               var len = result.rows.length, i;
                  msg += "<p>  Jugadores encontrados: " + result.rows.length + "</p>";
                  document.querySelector("#tplanetas").innerHTML += msg;
//javascript:doit(6,7648,)

//                if(result.rows.item(i).name.indexOf("(V)") != -1){ alert("Jugador en Vacaciones")} else { alert ("Activo")};
//                console.log(result.rows.item(i).name);

               for (i = 0; i < len; i++) {

                      msg = `<td width="15%" style="text-align:center;" bgcolor="#240B3B">---></a></td>` + `<td width="15%" style="text-align:center;" bgcolor="#240B3B">`+ result.rows.item(i).name + `</td>`+  `<td width="15%" style="text-align:center;" bgcolor="#240B3B">`+` <---</td>`+ `<td width="15%" style="text-align:center;" bgcolor="#240B3B">`+ `</td>`+`<td width="15%" style="text-align:center;" bgcolor="#240B3B">` + `</td>`+ `</td>`+ `<td width="15%" style="text-align:center;" bgcolor="#240B3B">` + `</td>` + `<td width="15%" style="text-align:left;" bgcolor="#240B3B"></td>`;

                  // <a href="javascript:doit(6,${codigoluna})"><img width="16" src="./styles/theme/gow/img/e.gif" class="tooltip" data-tooltip-content="Espiar" alt=""></a>

                   document.querySelector("#lista-planetas").innerHTML += msg + `<table id="galaxytableHead" style="width:654px;padding:0px;margin:0px;" cellspacing="0" cellpadding="0" border="0"><tfoot><tr id="fleetstatusrow" class="info"></tr></table></tr></tfoot></table>`;
               }//./styles/theme/gow/planeten/small/s_mond.png  result.rows.item(i).planetimg//document.querySelector("#fleetstatusrow")
            }, null);
         });
     }
     // ==============================================================================================
     // FUNCIONES BUSCAR JUGADOR Y PINTAR RESULTADOS
     // ==============================================================================================

    function buscar(jugador) {
             var msg="";
             //doit("6", "5804");
             $("#lista-planetas").empty()
             $("#tplanetas").empty();
//SELECT * FROM contacts WHERE cname LIKE ?%   (cname LIKE ?)'  '%'+cname+'%'
         db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM players WHERE (name LIKE ?) ", ['%'+jugador+'%'], function (tx, result) {
               console.log(result);
               var len = result.rows.length, i;
                  msg += "<p>  Planetas encontrados: " + result.rows.length + "</p>";
                  document.querySelector("#tplanetas").innerHTML += msg;
//javascript:doit(6,7648,)

//                if(result.rows.item(i).name.indexOf("(V)") != -1){ alert("Jugador en Vacaciones")} else { alert ("Activo")};
//                console.log(result.rows.item(i).name);

               for (i = 0; i < len; i++) {
                  var coordenada = result.rows.item(i).galaxy + ":" + result.rows.item(i).system + ":" +result.rows.item(i).planet;
                  if( result.rows.item(i).codigo!="vacio") {
                      var codigoplaneta = result.rows.item(i).codigo.substring(result.rows.item(i).codigo.indexOf(","), result.rows.item(i).codigo.indexOf(",)"));
                      codigoplaneta = codigoplaneta.replace(",", "");
                  }else{
                      var codigoplaneta = "vacio";
                  }
                  if(result.rows.item(i).codigom!="vacio") {
                      var codigoluna = result.rows.item(i).codigom.substring(result.rows.item(i).codigom.indexOf(","), result.rows.item(i).codigom.indexOf(")"));
                      codigoluna = codigoluna.replace(",", "");
                      msg = `<td width="15%" style="text-align:center;" bgcolor="#240B3B"><a style="color: #FFFFFF; font-size: 10pt" id="mostrar_sec4" href="https://spica.ogame.fun/game.php?page=galaxy&galaxy=${result.rows.item(i).galaxy}&system=${result.rows.item(i).system}">${coordenada}</a></td>` + `<td width="15%" style="text-align:center;" bgcolor="#240B3B">`+ result.rows.item(i).name + `</td>`+  `<td width="15%" style="text-align:center;" bgcolor="#240B3B">`+ result.rows.item(i).estado + `</td>`+ `<td width="15%" style="text-align:center;" bgcolor="#240B3B">`+ result.rows.item(i).alianza + `</td>`+`<td width="15%" style="text-align:center;" bgcolor="#240B3B">`+ codigoplaneta + `</td>`+ `</td>`+ `<td width="15%" style="text-align:center;" bgcolor="#240B3B">`+ codigoluna + `</td>` + `<td width="15%" style="text-align:left;" bgcolor="#240B3B"><a href="javascript:doit(6,${codigoplaneta})"><img width="24" src="${result.rows.item(i).planetimg}" class="tooltip" data-tooltip-content="Espiar" alt=""></a><a href="javascript:doit(6,${codigoluna})"><img width="16" src="./styles/theme/gow/planeten/small/s_mond.png" class="tooltip" data-tooltip-content="Espiar" alt=""></a></td>`;
                  }else{
                      var codigoluna = "vacio";
                      msg = `<td width="15%" style="text-align:center;" bgcolor="#240B3B"><a style="color: #FFFFFF; font-size: 10pt" id="mostrar_sec4" href="https://spica.ogame.fun/game.php?page=galaxy&galaxy=${result.rows.item(i).galaxy}&system=${result.rows.item(i).system}">${coordenada}</a></td>` + `<td width="15%" style="text-align:center;" bgcolor="#240B3B">`+ result.rows.item(i).name + `</td>`+  `<td width="15%" style="text-align:center;" bgcolor="#240B3B">`+ result.rows.item(i).estado + `</td>`+ `<td width="15%" style="text-align:center;" bgcolor="#240B3B">`+ result.rows.item(i).alianza + `</td>`+`<td width="15%" style="text-align:center;" bgcolor="#240B3B">`+ codigoplaneta + `</td>`+ `</td>`+ `<td width="15%" style="text-align:center;" bgcolor="#240B3B">`+ codigoluna + `</td>` + `<td width="15%" style="text-align:left;" bgcolor="#240B3B"><a href="javascript:doit(6,${codigoplaneta})"><img width="24" src="${result.rows.item(i).planetimg}" class="tooltip" data-tooltip-content="Espiar" alt=""></a></td>`;
                  }
                  // <a href="javascript:doit(6,${codigoluna})"><img width="16" src="./styles/theme/gow/img/e.gif" class="tooltip" data-tooltip-content="Espiar" alt=""></a>

                   document.querySelector("#lista-planetas").innerHTML += msg + `<table id="galaxytableHead" style="width:654px;padding:0px;margin:0px;" cellspacing="0" cellpadding="0" border="0"><tfoot><tr id="fleetstatusrow" class="info"></tr></table></tr></tfoot></table>`;
               }//./styles/theme/gow/planeten/small/s_mond.png  result.rows.item(i).planetimg//document.querySelector("#fleetstatusrow")
            }, null);
         });
     }


     // ==============================================================================================
     // FUNCION PARA LOS EVENTOS
     // ==============================================================================================

    function addEvent (el, evt, fxn)
     {
         if (el.addEventListener)
             el.addEventListener (evt, fxn, false);
         else if (el.attachEvent)
             el.attachEvent ("on" + evt, fxn);
             else
             el ['on' + evt] = fxn;
     }

     // ==============================================================================================
    // http://www.mojavelinux.com/articles/javascript_hashes.html

     function HashTable(obj)
     {
         this.length = 0;
         this.items = {};
         for (var p in obj) {
             if (obj.hasOwnProperty(p)) {
                 this.items[p] = obj[p];
                 this.length++;
             }
         }

         this.setItem = function(key, value)
         {
             if (this.hasItem(key)) {
                 this.items[key] = parseInt(this.items[key]) + parseInt(value);
             }
             else {
                 this.length++;
                 this.items[key] = parseInt(value);
             }
         }

         this.getItem = function(key) {
             return this.hasItem(key) ? this.items[key] : undefined;
         }

         this.hasItem = function(key)
         {
             return this.items.hasOwnProperty(key);
         }

         this.removeItem = function(key)
         {
             if (this.hasItem(key)) {
                 previous = this.items[key];
                 this.length--;
                 delete this.items[key];
                 return previous;
             }
             else {
                 return undefined;
             }
         }

         this.keys = function()
         {
             var keys = [];
             for (var k in this.items) {
                 if (this.hasItem(k)) {
                     keys.push(k);
                 }
             }
             return keys;
         }

         this.values = function()
         {
             var values = [];
             for (var k in this.items) {
                 if (this.hasItem(k)) {
                     values.push(this.items[k]);
                 }
             }
             return values;
         }

         this.each = function(fn) {
             for (var k in this.items) {
                 if (this.hasItem(k)) {
                     fn(k, this.items[k]);
                 }
             }
         }

         this.clear = function()
         {
             this.items = {}
             this.length = 0;
         }

         this.getString = function()
         {
             var str = "";
             for (var k in this.items) {
                 if (this.hasItem(k)) {
                     str += k + "=" + this.items[k] + "#";
                 }
             }
             return str;
         }

         this.purgue = function()
         {
             var nlength = 0;
             var nitems = {};
             for (var k in this.items) {
                 if (this.hasItem(k)) {
                     if(parseInt((new Date()).getTime() - parseInt(this.items[k])) < 777600000) { // 9 dias
                         nlength++;
                         nitems[k] = parseInt(this.items[k]);
                     }
                 }
             }
             this.length = nlength;
             this.items = nitems;
         }

         this.parse = function(str) {
             this.items = {};
             this.length = 0;
             var pairs = str.split("#");
             for (var i = 0, len = pairs.length, keyVal; i < len; ++i) {
                 keyVal = pairs[i].split("=");
                 if (keyVal[0]) {
                     this.items[keyVal[0]] = keyVal[1];
                     this.length++;
                 }
             }
         }
     }

     // ==============================================================================================
     // ------------
         var ogMenu = new MenuLib();
         ogMenu.menuButton_create();



 }) ();