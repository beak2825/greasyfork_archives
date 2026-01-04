// ==UserScript==
// @name         BW item list
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  take your item list for view
// @author       Artemis
// @include     http://r*.bloodwars.interia.pl/*
// @include     http://r*.bloodwars.net/*
// @include 		http://r*.bloodwars.pl/*
// @include     https://r*.bloodwars.interia.pl/*
// @include     https://r*.bloodwars.net/*
// @include 		https://r*.bloodwars.pl/*
// @include     http://beta.bloodwars.net/*
// @include     https://beta.bloodwars.net/*
// @downloadURL https://update.greasyfork.org/scripts/376336/BW%20item%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/376336/BW%20item%20list.meta.js
// ==/UserScript==
Object.defineProperty(document, "hidden", { value : false});
(function kosmiczni () {
    var tabAfter = document.getElementsByClassName("menu-content")[0].getElementsByClassName("menu")[0].getElementsByClassName("menu")[12];
    var itemTab = document.createElement("li");
    itemTab.setAttribute("class","menu");
    itemTab.appendChild(document.createTextNode("CreateItemList"));
    tabAfter.parentNode.insertBefore(itemTab, tabAfter);
    itemTab.addEventListener("click", generateItemList);





    async function generateItemList(){
        var helmy="";
        var zbroje="";
        var spodnie="";
        var pierscienie="";
        var amulety="";
        var biale1h="";
        var biale2h="";
        var palna1h="";
        var palna2h="";
        var dystans="";
        var item=document.getElementsByClassName("item-link");
        for(var i=0;i<item.length;i++){
            if(item[i].innerHTML.includes("Bandana")||item[i].innerHTML.includes("Czapka")||item[i].innerHTML.includes("Hełm")||item[i].innerHTML.includes("Kapelusz")||item[i].innerHTML.includes("Kask")||item[i].innerHTML.includes("Kominiarka")||item[i].innerHTML.includes("Korona")||item[i].innerHTML.includes("Maska")||item[i].innerHTML.includes("Obręcz")||item[i].innerHTML.includes("Opaska")){
                helmy+=item[i].innerHTML+"\n";
            }
            if(item[i].innerHTML.includes("Gorset")||item[i].innerHTML.includes("Kamizelka")||item[i].innerHTML.includes("Kolczuga")||item[i].innerHTML.includes("Koszulka")||item[i].innerHTML.includes("Kurtka")||item[i].innerHTML.includes("Marynarka")||item[i].innerHTML.includes("Peleryna")||item[i].innerHTML.includes("Pełna zbroja")||item[i].innerHTML.includes("Smoking")||item[i].innerHTML.includes("Zbroja warstwowa")){
                zbroje+=item[i].innerHTML+"\n";
            }
            if(item[i].innerHTML.includes("Kilt")||item[i].innerHTML.includes("Spodnie")||item[i].innerHTML.includes("Spódnica")||item[i].innerHTML.includes("Szorty")){
                spodnie+=item[i].innerHTML+"\n";
            }
            if(item[i].innerHTML.includes("Bransoleta")||item[i].innerHTML.includes("Pierścień")||item[i].innerHTML.includes("Sygnet")){
                pierscienie+=item[i].innerHTML+"\n";
            }
            if(item[i].innerHTML.includes("Amulet")||item[i].innerHTML.includes("Apaszka")||item[i].innerHTML.includes("Krawat")||item[i].innerHTML.includes("Łańcuch")||item[i].innerHTML.includes("Naszyjnik")){
                amulety+=item[i].innerHTML+"\n";
            }
            if(item[i].innerHTML.includes("Kama")||item[i].innerHTML.includes("Kastet")||item[i].innerHTML.includes("Miecz")||item[i].innerHTML.includes("Nóż")||item[i].innerHTML.includes("Pałka")||item[i].innerHTML.includes("Pięść Niebios")||item[i].innerHTML.includes("Rapier")||item[i].innerHTML.includes("Sztylet")||item[i].innerHTML.includes("Topór")||item[i].innerHTML.includes("Wakizashi")){
                biale1h+=item[i].innerHTML+"\n";
            }
            if(item[i].innerHTML.includes("Halabarda")||item[i].innerHTML.includes("Katana")||item[i].innerHTML.includes("Korbacz")||item[i].innerHTML.includes("Kosa")||item[i].innerHTML.includes("Łom")||item[i].innerHTML.includes("Maczuga")||item[i].innerHTML.includes("Miecz dwuręczny")||item[i].innerHTML.includes("Pika")||item[i].innerHTML.includes("Piła łańcuchowa")||item[i].innerHTML.includes("Topór dwuręczny")){
                biale2h+=item[i].innerHTML+"\n";
            }
            if(item[i].innerHTML.includes("Beretta")||item[i].innerHTML.includes("Desert Eagle")||item[i].innerHTML.includes("Glock")||item[i].innerHTML.includes("Magnum")||item[i].innerHTML.includes("Mp5k")||item[i].innerHTML.includes("Skorpion")||item[i].innerHTML.includes("Uzi")){
                palna1h+=item[i].innerHTML+"\n";
            }
            if(item[i].innerHTML.includes("AK-47")||item[i].innerHTML.includes("Fn-Fal")||item[i].innerHTML.includes("Karabin myśliwski")||item[i].innerHTML.includes("Karabin snajperski")||item[i].innerHTML.includes("Miotacz płomieni")||item[i].innerHTML.includes("Półautomat snajperski")||item[i].innerHTML.includes("Strzelba")){
                palna2h+=item[i].innerHTML+"\n";
            }
            if(item[i].innerHTML.includes("Ciężka kusza")||item[i].innerHTML.includes("Długi łuk")||item[i].innerHTML.includes("Krótki łuk")||item[i].innerHTML.includes("Kusza")||item[i].innerHTML.includes("Łuk")||item[i].innerHTML.includes("Łuk refleksyjny")||item[i].innerHTML.includes("Nóż do rzucania")||item[i].innerHTML.includes("Oszczep")||item[i].innerHTML.includes("Pilum")||item[i].innerHTML.includes("Shuriken")||item[i].innerHTML.includes("Toporek do rzucania")){
                dystans+=item[i].innerHTML+"\n";
            }
        }
        console.log("Helmy:\n"+helmy+"Zbroje:\n"+zbroje+"Spodnie:\n"+spodnie+"Pierscienie:\n"+pierscienie+"Amulety:\n"+amulety+"Broń biała 1h:\n"+biale1h+"Broń biała 2h:\n"+biale2h+"Broń palna 1h:\n"+palna1h+"Broń palna 2h:\n"+palna2h+"Broń dystansowa:\n"+dystans);

    }

})();