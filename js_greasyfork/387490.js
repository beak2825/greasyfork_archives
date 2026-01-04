// ==UserScript==
// @name        IKALORDS_REG
// @namespace   adblock-ikar
// @description allows you to create your personal key-hash for access to ikalords services
// @include     https://s*-ru.ikariam.gameforge.com/*
// @include     http://s*-ru.ikariam.gameforge.com/*
// @version     1.01
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/387490/IKALORDS_REG.user.js
// @updateURL https://update.greasyfork.org/scripts/387490/IKALORDS_REG.meta.js
// ==/UserScript==

var page   = document.location.host;
var id     = dataSetForView.avatarId;
var server = page.match(/\d+/)[0];
var lang   = page.match(/-\w+/).toString().substr(1);
var name = $('div#GF_toolbar .avatarName a:last-child').text();

var text = {
    ru: {
        ok: "Поздравляю, Ваш аккаунт успешно зарегистрирован в системе! Теперь отправляйтесь на сайт и зарегистрируйте в личном кабинете ключ доступа, который вы видите ниже. Затем удалите этот скрипт. Если у Вас несколько аккаунтов, зайдите на каждый и скопируйте ключ.",
        no: "Ваш аккаунт уже зарегистрирован в системе.",
        acc_key: "Ключ данного аккаунта: ",
        acc_expires: "Ключ будет доступен ещё ",
        sec: " сек."
    },
    en: {
        ok: "Success! You account has been created. Now delete this script and go back to ikalords.ru.",
        no: "Your account is already registered. ",
        acc_key: "Account key: ",
        acc_expires: "Key will be hide in ",
        sec: " s."
    }
};

$(document).ready(function(){
    $.ajax(
        {
            type: 'POST',
            url: 'https://ikalords.ru/app/ikalords/reg.php',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            data: {
                'id': id,
                'server': server,
                'lang': lang,
                'name': name
            },
            success: function (answer) {
                createAnswer(answer);
            },
            error: function (xhr, error) {
                alert("Ошибка скрипта!\n"+xhr+" \n"+error);
            }
        }
    );
});

function createAnswer(ans){
    if(ans['first_use']){
        $('body').append('<div style="display:block;width:380px;position:absolute;left:660px;z-index:9999;top:30px;background-color:#FFF;padding:4px;font-size:10px;">'+text[lang]['ok']+'<br>'+text[lang]['acc_key']+'<input type="text" style="text-align:center;border:0px;padding:10px 0px;width:100%;" value="'+ans['hash']+'"><br>'+text[lang]['acc_expires']+ans['expires']+text[lang]['sec']+'</div>');
    }else{
        alert(text[lang]['no']);
    }
}