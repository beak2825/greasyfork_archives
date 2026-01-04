// ==UserScript==
// @name         Navegar por el tid sin estar logueado IES 21
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Script para no tener que loguearse siempre en el tid
// @author       Falaz
// @match        http://tid.ies21.edu.ar/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/34648/Navegar%20por%20el%20tid%20sin%20estar%20logueado%20IES%2021.user.js
// @updateURL https://update.greasyfork.org/scripts/34648/Navegar%20por%20el%20tid%20sin%20estar%20logueado%20IES%2021.meta.js
// ==/UserScript==

    console.log("Si capitán estamos listos :D");
    var rango = document.getElementsByTagName('script');
    for(i=0;i<rango.length;i++){
        if(rango[i].src.includes('javas.js')){
            rango[i].src = "https://www.youtube.com/watch?v=u5W3UzU--DY";
        }
    }
    checkAlumno = function(){console.log("By passed by falaz ;D desde el inicio");};

document.onreadystatechange = (function(){
    //console.log("ready");
    var rango = document.getElementsByTagName('script');
    for(i=0;i<rango.length;i++){
        if(rango[i].src.includes('javas.js')){
            rango[i].src = "https://www.youtube.com/watch?v=u5W3UzU--DY";
        }
    }
    checkAlumno = function(){console.log("By passed by falaz ;D");};
});
window.onbeforeunload = (function(){
    var rango = document.getElementsByTagName('script');
    for(i=0;i<rango.length;i++){
        if(rango[i].src.includes('javas.js')){
            rango[i].src = "https://www.youtube.com/watch?v=u5W3UzU--DY";
        }
    }
    checkAlumno = function(){console.log("By passed by falaz ;D con carga");};
});
window.onload = function(){
    var rango = document.getElementsByTagName('script');
    for(i=0;i<rango.length;i++){
        if(rango[i].src.includes('javas.js')){
            rango[i].src = "https://www.youtube.com/watch?v=u5W3UzU--DY";
        }
    }
    checkAlumno = function(){console.log("By passed by falaz ;D con powa");};
};