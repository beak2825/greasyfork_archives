// ==UserScript==
// @name         BackOffice - Search
// @namespace    http://tampermonkey.net/
// @version      1.2.4
// @description  Gelişmiş Üye Arama
// @author       Menderes Acarsoy
// @match        https://bo.bo-2222eos-gbxc.com/player/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=837bahsine.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508805/BackOffice%20-%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/508805/BackOffice%20-%20Search.meta.js
// ==/UserScript==

var url = location.href;
var x = url.split('?')[1];
var urlParams = new URLSearchParams(x);

var year = new Date().getFullYear();
var month = new Date().getMonth()+1;
var day = new Date().getDate();
var yday = new Date().getDate()-1;
var paramFrom = "?from=" + year + "." + month + "." + day + ".00.00";
var paramFromYesterday = "?from=" + year + "." + month + "." + yday + ".00.00";
var paramTo= "&to=" + year + "." + month + "." + day + ".23.59";

var users = new Set();
users.add("(101726) elçin");
users.add("(51834) tany");
users.add("(98890) lili");
users.add("(24349) Rarslan");
users.add("(110700) iko35");
users.add("(114518) gece");
users.add("(65072) yigitt");
users.add("(83233) Erenimo");
users.add("(121198) Doga");
users.add("(81903) mamos");
users.add("(113621) Şuo");
users.add("(74286) tnr");
users.add("(120769) emirhan1");
users.add("(101411) Ovali");
users.add("(120771) Mekin");
users.add("(122629) Ruh");
users.add("(107560) oYb");
users.add("(122701) yusu");
users.add("(124114) Kurt0");
users.add("(109356) ars");
users.add("(83692) Soner19");
users.add("(126107) ekaya");
users.add("(89879) 123456Yy");
users.add("(126611) re123");
users.add("(126378) tsahin");
users.add("(125960) tyildiz");
users.add("(126357) Cetinkay");
users.add("(121288) korkmaz");
users.add("(56219) kenan19");
users.add("(123101) RTK");
users.add("(76559) alaattin");
users.add("(76913) Taco");
users.add("(125605) Leonardo");
users.add("(48037) Sulo");
users.add("(130851) Armak");
//users.add("");
//users.add("");
//users.add("");
//users.add("");
//users.add("");
//users.add("");
//users.add("");
//users.add("");
//users.add("");
//users.add("");
//users.add("");
//users.add("");
//users.add("");
//users.add("");
//users.add("");
//users.add("");
//users.add("");
//users.add("");
//users.add("");
//users.add("");
//users.add("");


function delay(sec) {
    return new Promise(resolve => setTimeout(resolve, sec * 1000));
}

function yazdir() {
    users.forEach(function(user) {
        console.log(user.replace(/\(\d+\)\s*/, ''));
    });
}

function kullaniciAdi(string) {
    return string.replace(/\(\d+\)\s*/, '');
}

function kullaniciNo(string) {
    return string.match(/\((\d+)\)/)[1];
}





document.querySelector("#player_search > div:nth-child(4)").style.display = "none";
document.querySelector("#export_players").style.display = "none";

if (document.querySelector("body > div.page-wrapper > div.page-container > div.page-content-wrapper > div > div.search > div.portlet.box.blue-dark.portlet-top-10px")) {
    document.querySelector("body > div.page-wrapper > div.page-container > div.page-content-wrapper > div > div.search > div.portlet.light.bordered").style.display = "none";
    var selectElement = document.querySelector('#DataTables_Table_0_length > label > select');
    selectElement.value = "200";
    var event = new Event('change', { bubbles: true });
    selectElement.dispatchEvent(event);
    return;
}





var usernameInputElement = document.querySelectorAll("input.tt-input")[0];
usernameInputElement.focus();

usernameInputElement.addEventListener('input', async function() {

    var search = usernameInputElement.value.trim();

    users.forEach(function(user) {
        //console.log(user);
        //console.log("Aranan: -" + search + "-\nListedeki: -" + kullaniciAdi(user) + "-");

        if (search.toLowerCase() === kullaniciAdi(user).toLowerCase()) {

            var hour = new Date().getHours();
            if (hour === 0 || hour === 1 || hour === 2 || hour === 3) {
                window.location.replace("https://bo.bo-2222eos-gbxc.com/player/financial/" + kullaniciNo(user) + paramFromYesterday + paramTo);
            } else {
                window.location.replace("https://bo.bo-2222eos-gbxc.com/player/financial/" + kullaniciNo(user) + paramFrom + paramTo);
            }

        }

    });



////////////// KULLANICI ADINI BOŞLUKLU YAZAN MALLAR //////////////////////////////

    usernameInputElement.value = usernameInputElement.value.replace("↗️", "")
        .replace("Zeynep İsmail 2018", "Zeynepismail2018")
        .replace("Zeynep ismail 2018", "Zeynepismail2018")
        .replace("Kasim 7676", "kasim7676")
        .replace("Kasım 7676", "kasim7676")
        .replace("omur6154", "ömür6154")
        .replace("Haydar 2475", "Haydar2475")
        .replace("Halit 1981", "Halit1981")
        .replace("Turgay 5555", "Turgay5555")
        .replace("Yusuf 6421", "Yusuf6421")
        .replace("Gol 47", "Gol47")
        .replace("Demir 09", "Demir09")
        .replace("Ersin Yılmaztürk", "Ersin Yılmazturk")
        .replace("Caner2134", "Caner2134.")
        .replace("GUNEY94", "GÜNEY94")
        .replace("mrcnnk1", "cnnk123")
        .replace("cumali 38", "cumali38")
        .replace("osman 5555", "osman5555")
        .replace("Osman 5555", "Osman5555")
        .replace("regav 2023", "regav2023")
        .replace("kartal 20", "kartal20")
        .replace("tarkan 34", "tarkan34")
        .replace("tehlike 76", "tehlike76")
        .replace("Eymen 2727", "Eymen2727")
        .replace("gogoç 123", "gogoç123")
        .replace("92 ferhat", "92ferhat")
        .replace("resul 0625", "resul0625")
        .replace("erkmen 06", "erkmen06")
        .replace("tlg71", "tlg71-")
        .replace("Poyraz12345", "Poyraz12345.")
        .replace("LEWANDOSKI 54", "LEWANDOSKI54")
        .replace("Erdoğan 3452", "Erdoğan3452")
        .replace("Abdullah 74", "Abdullah74")
        .replace("Hüseyin 42", "Hüseyin42")
        .replace("Aras 78", "Aras78")
        .replace("Muhtar 27", "Muhtar27")
        .replace("Taktik 3406", "Taktik3406")
//        .replace("", "");
//        .replace("", "");
//        .replace("", "");
//        .replace("", "");
//        .replace("", "");
//        .replace("", "");
//        .replace("", "");
//        .replace("", "");
//        .replace("", "");
//        .replace("", "");
//        .replace("", "");
//        .replace("", "");
//        .replace("", "");
//        .replace("", "");
//        .replace("", "");
//        .replace("", "");
//        .replace("", "");
//        .replace("", "");
//        .replace("", "");
//        .replace("", "");
        .replace("--", "-")
        .replace("..", ".");

usernameInputElement.dispatchEvent(new Event('input'));
/////////////////////////////////////////////////////////////////////////////////



    search = usernameInputElement.value.replace("İ", "i").trim();

    await delay(1);
    var usersList = document.querySelectorAll(".tt-suggestion");


    var elementCheck = setInterval(function() {
        var usersList = document.querySelectorAll(".tt-suggestion");

        if (usersList.length > 0) {
            clearInterval(elementCheck);

            usersList.forEach(function(usr) {
                if (!users.has(usr.innerText)) {
                    users.add(usr.innerText);
                }
            });

            users.forEach(function(user) {
                //console.log(user);
                //console.log("Aranan: -" + search + "-\nListedeki: -" + kullaniciAdi(user) + "-");

                if (search.toLowerCase() === kullaniciAdi(user).replace("İ", "i").toLowerCase()) {

                    var hour = new Date().getHours();
                    if (hour === 0 || hour === 1 || hour === 2 || hour === 3) {
                        window.location.replace("https://bo.bo-2222eos-gbxc.com/player/financial/" + kullaniciNo(user) + paramFromYesterday + paramTo);
                    } else {
                        window.location.replace("https://bo.bo-2222eos-gbxc.com/player/financial/" + kullaniciNo(user) + paramFrom + paramTo);
                    }

                }

            });

        } else {
            //usernameInputElement.dispatchEvent(new Event('input'));
        }

    }, 1000);

});





var ipInputElement = document.querySelector("#player_search > div:nth-child(3) > div > div > div.portlet-body.expand > div > div:nth-child(8) > div > input");
var searchButtonElement = document.querySelector("#player_search > div.form-actions.right > button");
var username = "";

urlParams.forEach(async function(value, key) {
    if (key === "id") {
        usernameInputElement.value = value;
        await delay(0.1);
        usernameInputElement.dispatchEvent(new Event('input'));

    } else if (key === "players") {
        username = value;

        if (/^\d+$/.test(username)) {
            await delay(1);
            usernameInputElement.value = value;
            await delay(0.1);
            usernameInputElement.dispatchEvent(new Event('input'));
        }

    } else if (key === "x") {
        username = value + username;
    } else if (key === "ip") {
        searchButtonElement.click();
    }
});






var userlistElement = document.querySelector("#player_search > div:nth-child(2) > div > div > div.portlet-body.expand > div:nth-child(2) > div:nth-child(1) > div");

var observerTransactions = new MutationObserver(function(mutationsList, observer) {
        var sonuclar = document.querySelectorAll("#player_search > div:nth-child(2) > div > div > div.portlet-body.expand > div:nth-child(2) > div:nth-child(1) > div > span");

        sonuclar.forEach(function(sonuc) {
            if (kullaniciAdi(sonuc.innerText).toLowerCase() === username.toLowerCase()) {
                var hour = new Date().getHours();
                if (hour === 0 || hour === 1 || hour === 2 || hour === 3) {
                    window.location.replace("https://bo.bo-2222eos-gbxc.com/player/financial/" + kullaniciNo(sonuc.innerText) + paramFromYesterday + paramTo);
                } else {
                    window.location.replace("https://bo.bo-2222eos-gbxc.com/player/financial/" + kullaniciNo(sonuc.innerText) + paramFrom + paramTo);
                }
            }
        });
});

var observerConfigTransactions = { childList: true, subtree: true };
observerTransactions.observe(userlistElement, observerConfigTransactions);