// ==UserScript==
// @name         Here
// @version      1.3
// @description  types username
// @author       Mitsakoolt
// @match        https://my.livechatinc.com/*
// @icon         https://www.google.com/s2/favicons?domain=mozilla.org
// @grant        none
// @namespace https://greasyfork.org/users/944127
// @downloadURL https://update.greasyfork.org/scripts/463147/Here.user.js
// @updateURL https://update.greasyfork.org/scripts/463147/Here.meta.js
// ==/UserScript==
// поправил ввод имени - первую букву в капиталайз, остальный нижним
//08.05.2022 (2.0.2): теперь работает и в режиме супервайзера
//15.08.2022 (2.0.3): обновлена ссылка на апи
//29.11.2022 (2.0.4): обновлен код лайвчата
(async function() {
    'use strict';

    async function checkNameDB(name){
        let response = await fetch(`https://us.cc.local/api/nametyper.php?action=getCleanName&typedName=${name}`);
        let text = await response.json();
        if(text[0]){
            return text[0];
        }
        else{
            return 0;
        }
    }

    async function onKeydown(evt) {
        // Use https://keycode.info/ to get keys
        if (evt.altKey && evt.keyCode == 65) {

            let nameSelector = ".css-l4pdco";
            let nameElem = document.querySelector(nameSelector);

            //let strippedString = nameElem.innerHTML.replace(/(<([^>]+)>)/gi, "");
            //strippedString = strippedString.split("and");
            let strippedString = nameElem.innerHTML.split(" ");
            let checkDB = await checkNameDB(strippedString[0]);
            if(checkDB != 0){
                if(!document.querySelectorAll('[placeholder="Type a message..."]')[0]){
                    document.querySelectorAll('[placeholder="Private messages will be visible to agents only…"]')[0].value += checkDB.cleanName+", вы еще в чате?";
                }
                else{
                    document.querySelectorAll('[placeholder="Type a message..."]')[0].value += checkDB.cleanName+", вы еще в чате?";
                }

                return;
            }
            else{
                if(strippedString[1]){
                    var isKyr = function (str) {
                        return /[а-я]/i.test(str);
                    }
                    if(isKyr(strippedString[0].trim()))
                    {
                        // console.log(strippedString[0]);
                        //alert(strippedString[0].trim()+"test");
                        let nameToType = strippedString[0].trim();
                        nameToType = nameToType.charAt(0).toUpperCase() + nameToType.slice(1).toLowerCase();
                        if(!document.querySelectorAll('[placeholder="Type a message..."]')[0]){
                            document.querySelectorAll('[placeholder="Private messages will be visible to agents only…"]')[0].value += nameToType+", вы еще в чате?";
                        }
                        else{
                            document.querySelectorAll('[placeholder="Type a message..."]')[0].value += nameToType+", вы еще в чате?";
                        }
                    }
                    else
                    {
                        //Если с английского на русский, то передаём вторым параметром true.
                        let transliterate = (
                            function() {
                                var
                                rus = "щ  ш  ч  ц  ю  я  ё  ж  ъ  ы  э  а б в г д е з и й к л м н о п р с т у ф х ь".split(/ +/g),
                                    eng = "shh sh ch cz yu ya yo zh `` y' e` a b v g d e z i j k l m n o p r s t u f x `".split(/ +/g)
                                ;
                                return function(text, engToRus) {
                                    var x;
                                    for(x = 0; x < rus.length; x++) {
                                        text = text.split(engToRus ? eng[x] : rus[x]).join(engToRus ? rus[x] : eng[x]);
                                        text = text.split(engToRus ? eng[x].toUpperCase() : rus[x].toUpperCase()).join(engToRus ? rus[x].toUpperCase() : eng[x].toUpperCase());
                                    }
                                    return text;
                                }
                            }
                        )();
                        let nameToType = transliterate(strippedString[0].trim(),true);
                        nameToType = nameToType.charAt(0).toUpperCase() + nameToType.slice(1).toLowerCase();
                        document.querySelectorAll('[placeholder="Type a message..."]')[0].value += nameToType+", вы еще в чате?";
                        // console.log(strippedString[0]);
                    }
                }
                //alert(!isKyr(strippedString[0].trim()));
                //console.log(strippedString[0]);
            }
        }
    }
    document.addEventListener('keydown', onKeydown, true);
})();// ==UserScript==
// @name        New script
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      -
// @description 03.04.2023, 10:08:27
// ==/UserScript==