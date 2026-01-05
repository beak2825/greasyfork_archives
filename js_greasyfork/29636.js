// ==UserScript==
// @name         Jenkins_Stable_Release2
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       m.semerikov@ispsystem.com
// @match        http://ci.ispsystem.net:8080/jenkins/view/Testers/job/Merge/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29636/Jenkins_Stable_Release2.user.js
// @updateURL https://update.greasyfork.org/scripts/29636/Jenkins_Stable_Release2.meta.js
// ==/UserScript==

window.onload = function(){
    'use strict';
var month_next = new Date();
var now = new Date();
var stop_merge = new Date(), start_merge = new Date(), stop_merge_next = new Date();
var name = document.getElementById('yui-gen1-button');
var len = name.length;
var i, j = 0, k = 1;
var release_day, release_day_next;

while (k <= 14 && j < 2){ // Ищу второй вторник в текущем месяце
    release_day = new Date(now.getFullYear(), now.getMonth(), k);
    if ( release_day.getDay() == 2 ){
        j++;
    }
    k++;
}

j = 0; k = 1;
month_next.setMonth(now.getMonth() + 1);

while (k <= 14 && j < 2){ // Ищу второй вторник в следующем месяце
    release_day_next = new Date(month_next.getFullYear(), month_next.getMonth(), k);
    if ( release_day_next.getDay() == 2 ){
        j++;
    }
    k++;
}

//now.setDate(now.getDate() + 18);
stop_merge_next = release_day_next;
stop_merge_next.setDate(stop_merge_next.getDate() - 12); // С какого числа нельзя мержить фичи для релиза в след. месяце

//alert (now);
//alert (stop_merge_next);

if ( now >= stop_merge_next ){
    name.style.backgroundColor = "red";
    name.innerHTML = "Merge (Никаких, блять, новых фич!!!)";
}

stop_merge.setDate(release_day.getDate() - 12); // С какого числа нельзя мержить фичи для релиза в этом месяце
start_merge.setDate(release_day.getDate() - 5); // До какого числа нельзя мержить фичи для релиза в этом месяце

if ( (now >= stop_merge) && (now <= start_merge) ){
    name.style.backgroundColor = "red";
    name.innerHTML = "Merge (Никаких, блять, новых фич!!!)";
}
}();