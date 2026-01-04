// ==UserScript==
// @name pom1role
// @description Проставление ролей
// @author KVS
// @namespace forPOM1
// @version 1.0
// @include http://test.xrm.ru:8999/users.iface
// @downloadURL https://update.greasyfork.org/scripts/375510/pom1role.user.js
// @updateURL https://update.greasyfork.org/scripts/375510/pom1role.meta.js
// ==/UserScript==

// !!!!!!!!!!!!!!! В директиве @include подставить нужный URL 

(function () {
    'use strict';
    let necessaryRoles = "Администратор; Отправка/получение почты; Организации-доставщики; "; // переменная для примера работы

    // Для будущего добавление переменных с ролями.
    //
    //
    let roleArray = necessaryRoles.split("; "); // сюда присвоить переменную с ролями


    let roleSheet = document.querySelectorAll(".iceSelMnyCb table tbody tr");

    let checkNecessaryRoles = (roleArray) => {
        for( let i = 0; i < roleSheet.length; i++ ){
            for ( let j = 0; j < roleArray.length; j++){
                if( compareRole(roleArray[j], roleSheet[i].firstChild.lastChild.textContent)){
                    roleSheet[i].firstChild.firstChild.checked = true;
                    break;
                };
            };
        };
    };

    let compareRole = (mainRole, verifableRole) => {
        if ( mainRole == verifableRole ){
            return true;
        } return false;
    };

    checkNecessaryRoles(roleArray);

})();