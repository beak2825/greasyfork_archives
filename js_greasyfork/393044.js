// ==UserScript==
// @name         Side Scripts
// @namespace    JotaSideScripts
// @version      1.02
// @description  Poupa Trabalho no melhor site do mundo!
// @author       João Rodrigues
// @match        */side.utad.pt/*
// @match        side.utad.pt/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/393044/Side%20Scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/393044/Side%20Scripts.meta.js
// ==/UserScript==


/*TODO:
-Logout é "logoutform.submit()" - Duvido que va usar, mas...
*/


(function() {
    'use strict';
    if(GM_getValue("RecentLoginFlag")==null){
        GM_setValue("RecentLoginFlag", "0");
    }
console.log(GM_getValue("RecentLoginFlag"));

    //preencher as variaveis de verificação
    if(document.getElementsByClassName("logintext2").length > 0){
        if(document.getElementsByClassName("logintext2")[0].children[2] != null){
            var TextBoxLogin1 = document.getElementsByClassName("logintext2")[0].children[2].value;
        }
    }
    if(document.getElementsByClassName("login")[0]){
        var TextBoxLogin2 = document.getElementsByClassName("login")[0].value;
    }

    //Login:
    if( TextBoxLogin1 == "Login..." || TextBoxLogin2 == "Login..." ){

        //Na pag. inicial do side
        if(document.getElementsByClassName("login").length != 0){
            GM_setValue("RecentLoginFlag", "1");
            document.login.submit();

        //Fazer nas outras paginas
        }else if(document.getElementById("loginform")!=null){
            GM_setValue("RecentLoginFlag", "1");
            document.loginform.submit();
        }
    }
    //Fim de Login

    //pos login

    if(GM_getValue("RecentLoginFlag") == "1"){
    //clicar no nome do curso para entrar na pag. principal do curso
        if(document.getElementsByClassName("titgraduation")!= null){
            document.getElementsByClassName("titgraduation")[2].lastElementChild.click();
        }
        console.log(GM_getValue("RecentLoginFlag"));
        GM_setValue("RecentLoginFlag", "0");
        console.log(GM_getValue("RecentLoginFlag"));
    }


    //Para desativar a caixa de dialogo a dizer para adicionar foto e mail. chatos do crlh!!
    if(document.getElementById("okdiv")!=null){
        document.querySelector("#okdiv > table > tbody > tr > td:nth-child(3) > a").click();
    }


    //Se for pdf não faz reload, faz reload de 19 em 19 min. para nao deixar a pagina fazer auto logout
    if(document.URL.split('.').pop()!="pdf"){
        setTimeout(function(){location.reload()},1138000);
    }
})();