// ==UserScript==
// @name         ocultar usuarios
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       ratred
// @description ocultar posts de usuarios en 3djuegos
// @match        http://www.3djuegos.com/foro-de/*
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/36954/ocultar%20usuarios.user.js
// @updateURL https://update.greasyfork.org/scripts/36954/ocultar%20usuarios.meta.js
// ==/UserScript==

(function() {

    'use strict';
    if(GM_getValue('usuarios')==null ){
        GM_setValue('usuarios',JSON.stringify(''));
        var usuarioscen=[];
    }else{
        var usuarioscen=JSON.parse(GM_getValue('usuarios'));
        if( usuarioscen==''){
            usuarioscen=[];
        }
    }
    function receiveMessage(event)
    {

        var seleccion=event.data[1];
        var us=event.data[0].toLowerCase();
        if(seleccion===0){
            for(var bor=0;bor<usuarioscen.length;bor++){
                if(usuarioscen[bor]==us){
                    usuarioscen.splice(bor, 1);
                }
            }
        }
        if(seleccion===1){
            usuarioscen.push(us);
        }
        GM_setValue('usuarios',JSON.stringify(usuarioscen));

    }

    var zona=document.getElementById('boton__100');
    zona=zona.parentNode;
    var botonnuev=document.createElement("BUTTON");
    botonnuev.innerHTML="ocultar usuarios";
    botonnuev.className="xXx boton b_s14 fl d_fl";
    botonnuev.onclick=function(){
        var cuadro=window.open("", "_blank", "scrollbars=yes,resizable=0,menubar=0,top=300,left=500,width=250,height=300");
        cuadro.document.write('<script>');
        cuadro.document.write('function quitar(cuadro){var lista=cuadro.parentNode.parentNode.parentNode; var usuario=lista.getElementsByTagName("center")[0].innerHTML; borrar(usuario); lista.parentNode.removeChild(lista);}');
        cuadro.document.write("function borrar(usuario){  window.opener.postMessage([usuario,0],'*')}");
        cuadro.document.write("function aniadir(){var usuar=document.getElementById('agregado').value; usuar=usuar.replace(/ /g,'') ;if(usuar.length>0){tablamas(usuar); window.opener.postMessage([usuar,1],'*')}}");
        cuadro.document.write("function tablamas(usuar){var tabl=document.getElementById('tablita'); var elemento=document.createElement('tr'); elemento.innerHTML='<td><center>'+usuar+'</center></td><td><center><button onclick=\"quitar(this)\">X</button></center></td>';tabl.appendChild(elemento);  }");
        cuadro.document.write('</script>');
        cuadro.document.write('usuario a ocultar</br>');
        cuadro.document.write('<input id="agregado" type="text"/><button onclick="aniadir()">a&ntilde;adir</button>');
        cuadro.document.write('<table id="tablita"  style="width:100%">');
        cuadro.document.write('<tr><th >usuario</th><th>borrar</th></tr>');
        for(var b=0;b<usuarioscen.length;b++){
            cuadro.document.write('<tr><td><center>'+usuarioscen[b].toLowerCase()+'</center></td><td><center><button onclick="quitar(this)">X</button></center></td></tr>');
        }
        cuadro.document.write('</table>');
        window.addEventListener("message", receiveMessage, false);

    };
    zona.appendChild(botonnuev);
    var comentarios=document.getElementsByClassName('autor');
    for(var i=0;i<comentarios.length;i++){
        var ventana=comentarios[i].getElementsByTagName('span');
        var conf=ventana[0].innerHTML;
        for(var xd=0;xd<usuarioscen.length;xd++){
            if(conf.toLowerCase()==usuarioscen[xd].toLowerCase()){
                var contenedor=comentarios[i].parentNode;
                contenedor.parentNode.removeChild(contenedor);
                i--;
            }
        }
    }
})();