// ==UserScript==
// @name         GalaxyTool B.O.R.G.S spica
// @namespace    https://greasyfork.org/es/users/385465-nagasis
// @version      1.5
// @description  WebSQL script Para escanear la galaxia completa en 8 min
// @author       NaGaSiS
// @match        https://spica.ogame.fun/game.php?page=galaxy*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392557/GalaxyTool%20BORGS%20spica.user.js
// @updateURL https://update.greasyfork.org/scripts/392557/GalaxyTool%20BORGS%20spica.meta.js
// ==/UserScript==


(function() {

    var galaxia = Number($("[name='galaxy']")[0].value);
    var sistema = Number($("[name='system']")[0].value);
    var posicion;
    var nombre;
    var codigo;
    var codigom;
    var planetaimg;
    var alianza;
    var estado;
    var array="";

    console.log ("Principio");
    var db = openDatabase("BGspica", "1", "BORGS spica: Jugadores", 5*1024*1024);


                   if(galaxia == "1" && sistema == "1"){
                       if (confirm('!!!ALERTA VAS A GENERAR UNA NUEVA BASE DE DATOS!!!, este proceso tarda aproximadamente 15min, podras utilizar el juego en una nueva pestaña menos la vision de galaxia mientras este funcionando.')) {

                           // BORRAMOS LOS DATOS PREVIOS Y CONSTRUIMOS LA NUEVA BASE DE DATOS!!
                           db.transaction(function(tx) {
                               tx.executeSql("DROP TABLE players;",[],function(tx,result){
                                   console.log("Tabla BORRADA con Exito!!!!");
                                   //alert("Tabla BORRADA con Exito!!!!");
                               },function(tx,error){
                                   console.log("Hubo un error: " + error.message);
                               });
                           });
                           db.transaction(function(tx) {
                               tx.executeSql("CREATE TABLE players (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, galaxy INTEGER, system INTEGER, planet INTEGER, name TEXT, codigo TEXT, codigom TEXT, planetimg TEXT, alianza TEXT, estado TEXT);",[],function(tx,result){
                                   console.log("Tabla Creada con Exito!!!!");
                                   //alert("Tabla Creada con Exito!!!!");
                               },function(tx,error){
                                   console.log("Hubo un error: " + error.message);
                               });
                           });


                       } else {
                           alert('Proceso Cancelado, vuelve pronto!!');
                       }
                   }else{
                      // alert("Primero debes situarte en la galaxia 1 y el sistema 1");

                   }




  db.transaction(function(tx) {
    for (var i = 1; i < 16; i++)
	{
        posicion = document.querySelector(`#galaxytableHead > tbody > tr:nth-child(${i}) > td.position`).innerText;
        nombre = document.querySelector(`#galaxytableHead > tbody > tr:nth-child(${i})`).children[6].innerText;
        codigom = document.querySelector(`#galaxytableHead > tbody > tr:nth-child(${i})`).children[3].childElementCount;
        //Gestión de estado del jugador
        if(nombre.indexOf("(V)") != -1){
            estado = ("Vacaciones")
        }else{
            if(nombre.indexOf("(i)") != -1){ estado = ("Inactivo")
             }else{
                 if(nombre.indexOf("(i I)") != -1){ estado = ("Inactivo")
                  }else{
                      if(nombre.indexOf("(B)") != -1){ estado = ("Baneado")
                       }else{
                            estado = "Activo";
                       }}}}


        //Tiene luna?
        if (codigom =="0"){
            codigom = "vacio";
        }else{
            codigom = document.querySelector(`#galaxytableHead > tbody > tr:nth-child(${i})`).children[3].innerHTML;
            codigom = codigom.substring(codigom.indexOf("javascript:doit"), codigom.indexOf(";"));
        }

        //Inyectamos en la base de datos si el registro no!!! esta vacio
        if (nombre == ""){

        }else{
              alianza = document.querySelector(`#galaxytableHead > tbody > tr:nth-child(${i})`).children[8].innerText;
            //Tiene alianza?
            if (alianza ==""){
                alianza = "vacio";
            }else{
                alianza = document.querySelector(`#galaxytableHead > tbody > tr:nth-child(${i})`).children[8].innerText;
            }

              codigo= document.querySelector(`#galaxytableHead > tbody > tr:nth-child(${i}) > td.action`).innerHTML
              codigo= codigo.substring(codigo.indexOf("javascript:doit"), codigo.indexOf("{"));
              codigo= codigo + ")";
              planetaimg = document.querySelector(`#galaxytableHead > tbody > tr:nth-child(${i}) > td.microplanet1 > a`).innerHTML;
              planetaimg = planetaimg.substring(planetaimg.indexOf("./styles/"), planetaimg.indexOf(".gif"));
              planetaimg = planetaimg + ".gif";

            array= (galaxia+':'+sistema+':'+posicion+' --> '+nombre) + '\n';
            tx.executeSql("INSERT INTO players (galaxy, system, planet, name, codigo, codigom, planetimg, alianza, estado) VALUES (?,?,?,?,?,?,?,?,?);",[galaxia,sistema,posicion,nombre,codigo,codigom,planetaimg,alianza,estado],function(tx,result){
                console.log("insertamos registro con exito!");
            },function(tx,error){
                console.log("Hubo un error: " + error.message);
            });

        }

    }
 });
//alert(array);
/*
        db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM players",[],function(tx,result){
               console.log(result);
           },function(tx,error){
               console.log("Hubo un error: " + error.message);
           });
       });
var msg;

         db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM players', [], function (tx, results) {
               var len = results.rows.length, i;
               msg = "<p>Base de datos: " + len + "</p>";
               document.querySelector("#fleetstatusrow > td").innerHTML += msg;

               for (i = 0; i < len; i++) {
                  msg = "<p><b>" + results.rows.item(i).log + "</b></b>";
                  document.querySelector("#fleetstatusrow > td").innerHTML += msg;
               }
            }, null);
         });
*/
//$('#fleetstatusrow > td').append( $('<ul />', {text : 'Lista UL'}) ).attr('id', 'lista-bd');
//$("#galaxyheadbg2").remove();
//$("#galaxytableHead tbody > tr").remove();
//$("#galaxytableHead > tfoot > tr:nth-child(1) > td").remove();

    function submit(){
    if (($("[name~='system']")[0].value != 399 || $("[name~='galaxy']")[0].value != 6)) {
        if ($("[name~='system']")[0].value != 399){
                       galaxy_submit('systemRight');
        }
        else {
            $("[name~='system']")[0].value = 1;
                       galaxy_submit('galaxyRight');
        }}else{
             alert("Proceso finalizado, verifica que la vision de galaxia se encuentra en Galaxia 6 y Sistema 399");
        }

    }
        var s = 1* 150;
        setTimeout(submit,s);
    })();