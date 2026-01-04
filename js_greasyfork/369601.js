// ==UserScript==
// @name         Behrooz Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      *://*.travian.*/position_details.*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369601/Behrooz%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/369601/Behrooz%20Script.meta.js
// ==/UserScript==



(function() {
    'use strict';

    var dataCheio = document.getElementsByClassName("reportInfoIcon reportInfo carry full")
    var dataMeio = document.getElementsByClassName("reportInfoIcon reportInfo carry half")
    var dataVazio = document.getElementsByClassName("reportInfoIcon reportInfo carry empty")

    var i, j = 0;
    var info = new Array(5);
    for(i = 0 ; i < dataCheio.length ; i++){
        info[j] = dataCheio[i].alt;
        j++;
    }
    for(i = 0 ; i < dataMeio.length ; i++){
        info[j] = dataMeio[i].alt;
        j++;
    }
    for(i = 0 ; i < dataVazio.length ; i++){
        info[j] = dataVazio[i].alt;
        j++;
    }


    var novos = new Array(5);
    for(i = 0; i < 5; i++){
        novos[i] = info[i].split("/");
    }

    var numeros = new Array(10);
    var media = 0;
    var max = 0;
    var min = 1000000;
    var percentagem = new Array(5);
    for(i = 0; i < 5; i++){
        numeros[i*2] = Number(novos[i][0]);
        numeros[1+(i*2)] = Number(novos[i][1]);
        if(max <= numeros[i*2]){
            max = numeros[i*2]
        }
        if(min >= numeros[i*2]){
            min = numeros[i*2];
        }

        media = media + numeros[i*2];
        percentagem[i] = numeros[i*2] / numeros[1+(i*2)] * 100;
        percentagem[i] = percentagem[i].toFixed(2);
    }

    media = media / percentagem.length;

    console.log(numeros);
    console.log(percentagem);

    var mediaMediaMax = (Math.ceil(media) + max) / 2;
    var numOtimoArqueiros = Math.ceil(mediaMediaMax / 30) ;
    var numOtimoSaqueadores = Math.ceil(mediaMediaMax / 80);

    alert("Media: " + media + "\nMax: " + max + "\nMin: " + min + "\nArqueiros: " + numOtimoArqueiros + "\nSaqueadores: " + numOtimoSaqueadores);
    //alert(numeros);
    //alert(coco);

})();