// ==UserScript==
// @name        HL level calculator
// @namespace   HLN
// @include     http://www.harrylatino.org/user/*
// @version     10
// @description:en Permite visualizar información extendida en el perfíl sobre el nivel y los apartados que influyen en él.
// @grant       none
// @description Permite visualizar información extendida en el perfíl sobre el nivel y los apartados que influyen en él.
// @downloadURL https://update.greasyfork.org/scripts/23981/HL%20level%20calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/23981/HL%20level%20calculator.meta.js
// ==/UserScript==

var info = ["0","0","0","0","0","0","0","0","0"];
var mConocimientos = ["0","3","3","3","4","4","4","5","5","5","6","6","6","7","7","7","8","8","8","9","9","9","10","10","10","11","11","11","12","12","12","13","13","13","14","14","14","15","15","15","16","16","16","17","17","17","18","18","18","19","19"];
var w = document.getElementById("pane_core:info").getElementsByClassName("row_title");
var w2 = document.getElementById("pane_core:info").getElementsByClassName("row_data");
var x = document.getElementById("custom_fields_personaje").getElementsByClassName("row_title");
var y = document.getElementById("custom_fields_personaje").getElementsByClassName("row_data");
var posteos, galeones, objetos, criaturas, conocimientos, habilidades, poderes, medallas, total, nivel, restante, mh, mcr;
var navbar, newElement;

//Función necesaria para poder contar los conocimientos y habilidades,

function occurrences(string, subString, allowOverlapping) {

    string += "";
    subString += "";
    if (subString.length <= 0) return (string.length + 1);

    var n = 0,
        pos = 0,
        step = allowOverlapping ? 1 : subString.length;

    while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
}


//Recolección de la información del perfíl
//ToDo: Consultar sobre los libros de criaturas

var z = 0;

while(z<x.length){
    
    if(w[z].innerHTML == "Mensajes activos"){
        info[0] = w2[z].innerHTML;
        info[0] = info[0].replace('.','');
    }
    else if(w[z].innerHTML == "Active Posts"){
        info[0] = w2[z].innerHTML;
        info[0] = info[0].replace(',','');
    }
    
    if(x[z].innerHTML == "Galeones"){
        info[1] = y[z].innerHTML;
    }
    else if(x[z].innerHTML == "Puntos de Poder en Objetos"){
        info[2] = y[z].innerHTML;
    }
    else if(x[z].innerHTML == "Puntos de Poder en Criaturas"){
        info[3] = y[z].innerHTML;
    }
    else if(x[z].innerHTML == "Conocimientos"){
            if(y[z].innerHTML.indexOf("<br>") > -1){info[4] = (occurrences(y[z].innerHTML, "<br>")+1);}
            else{info[4] = "1";}
    }
    else if(x[z].innerHTML == "Habilidades Mágicas"){
        if(y[z].innerHTML.indexOf("<br>") > -1){info[5] = (occurrences(y[z].innerHTML, "<br>")+1);}
        else{info[5] = "1";}
    }
    else if(x[z].innerHTML == "Libros de Hechizos"){
        var ts = y[z].innerHTML;
        if(ts.indexOf("(N.") > -1)
            {
                var p = ts.indexOf("(N.");
                var f = ts.substring((p+3), ts.indexOf(')'));
                info[6] = f;
            }
    }
    else if(x[z].innerHTML == "Medallas"){
        info[7] = y[z].innerHTML;
    }
    else if(x[z].innerHTML == "Poderes de Criaturas"){
        var tString = y[z].innerHTML.replace(/\s+/g, '');
        info[8] = tString.substring(0,1);
    }

    z++;
}


//Cálculos arcaicos de la experiencia
//ToDo: Cambiar la fórmula de poderes a un array.

total = 0;
if(info[0]*5>50000){posteos = 50000;}else{posteos = info[0]*5;}
if(info[1]*0.2>50000){galeones = 50000;}else{galeones = info[1]*0.2;}
if(info[2]*25>75000){objetos = 75000;}else{objetos = info[2]*25;}
if(info[3]*25>75000){criaturas = 75000;}else{criaturas = info[3]*25;}
if(info[4]*4000>76000){conocimientos = 76000;}else{conocimientos = info[4]*4000;}
if(info[5]*12000>75000){habilidades = 84000;}else{habilidades = info[5]*12000;}
if(info[6] == "1"){poderes =1;}else if(info[6] == "5"){poderes=2;}else if(info[6] == "7"){poderes=3;}else if(info[6] == "10"){poderes=4;}else if(info[6] == "15"){poderes=5;}else if(info[6] == "20"){poderes=6;}else if(info[6] == "25"){poderes=7;}else if(info[6] == "30"){poderes=8;}else if(info[6] == "35"){poderes=9;}else if(info[6] == "40"){poderes=10;}else{poderes=0;}
if(info[8] == "2"){poderes = poderes+2;} else if (info[8] == "1"){poderes++;}
if(poderes*6000>72000){poderes = 72000;}else{poderes = poderes*6000;}
medallas = info[7]*1;
total = (posteos+galeones+objetos+criaturas+conocimientos+habilidades+poderes+medallas);
if(Math.round(total/10000)>0 && Math.round(total/10000)<51){nivel = Math.round(total/10000);}else if(Math.round(total/10000)>50){nivel = 50;} else{nivel = 1;}
if(nivel<50){restante = (((nivel+1)*10000)-5000)-total;}else{restante = 0;}


//Norma del nivel máximo de criaturas

if(nivel>4 && nivel<10){
    mcr = "XX";
}
else if(nivel>9 && nivel<20){
    mcr = "XXX";
}
else if(nivel>19 && nivel<40){
    mcr = "XXXX";
}
else if(nivel>39){
    mcr = "XXXXX";
}
else{
    mcr = "X";
}

//Norma del número máximo de habilidades

mh = 0;
if(nivel>14 && conocimientos>4){
    mh = "1";
}
if(nivel>19 && conocimientos>5){
    mh = "2";
}
if(nivel>24 && conocimientos>6){
    mh = "3";
}
if(nivel>29 && conocimientos>7){
    mh = "4";
}
if(nivel>34 && conocimientos>8){
    mh = "5";
}
if(nivel>39 && conocimientos>9){
    mh = "Libre";
}

//Impresión en el perfíl.
//ToDo: Mejorar el formato.

navbar = document.getElementById('custom_fields_personaje');
if (navbar) {
    newElement = document.createElement('div');
    newElement.innerHTML = '<div class="general_box clearfix"> ' +
    '<h3 class="bar">Información adicional</h3><br><ul class="ipsList_data clearfix"> ' +
    '<li class="clear clearfix"></li>'+
    '<li><span class="row_title">Nivel Mágico Actualizado</span><span class="row_data">'+nivel+'</span></li>'+
    '<li class="clear clearfix"></li>'+
    '<li><span class="row_title">Experiencia para siguiente nivel</span><span class="row_data">'+Math.round(restante,2)+'</span></li>'+
    '<li class="clear clearfix"></li>'+
    '<li><span class="row_title">Max. Conocimientos</span><span class="row_data">'+mConocimientos[nivel]+'</span></li>'+
    '<li class="clear clearfix"></li>'+
    '<li><span class="row_title">Max. Habilidades</span><span class="row_data">'+mh+'</span></li>'+
    '<li class="clear clearfix"></li>'+
    '<li><span class="row_title">Nivel max de criaturas</span><span class="row_data">'+mcr+'</span></li>'+
    '<li class="clear clearfix"></li>'+
    '<li><span class="row_title">Total experiencia</span><span class="row_data">'+total+'</span></li>'+
    '<li class="clear clearfix"></li>'+
    '<h3 class="bar">Puntos de experiencia acumulados</h3><br>'+
    '<li><span class="row_title">Posteos</span><span class="row_data">'+posteos+'/'+'50000.</span></li>'+
    '<li class="clear clearfix"></li>'+
    '<li><span class="row_title">Galeones</span><span class="row_data">'+Math.round(galeones,2)+'/'+'50000.</span></li>'+
    '<li class="clear clearfix"></li>'+
    '<li><span class="row_title">Objetos</span><span class="row_data">'+objetos+'/'+'75000.</span></li>'+
    '<li class="clear clearfix"></li>'+
    '<li><span class="row_title">Criaturas</span><span class="row_data">'+criaturas+'/'+'75000.</span></li>'+
    '<li class="clear clearfix"></li>'+
    '<li><span class="row_title">Conocimientos</span><span class="row_data">'+conocimientos+'/'+'76000.</span></li>'+
    '<li class="clear clearfix"></li>'+
    '<li><span class="row_title">Habilidades</span><span class="row_data">'+habilidades+'/'+'84000.</span></li>'+
    '<li class="clear clearfix"></li>'+
    '<li><span class="row_title">Poderes</span><span class="row_data">'+poderes+'/'+'72000.</span></li>'+
    '<li class="clear clearfix"></li>'+
    '<li><span class="row_title">Medallas</span><span class="row_data">'+medallas+'/'+'Ilimitado.</span></li>'+
    '</ul></div>';
    navbar.parentNode.insertBefore(newElement, navbar.nextSibling);
}

var oldTitle = document.title;
document.title = "[" + nivel + "] " + oldTitle;