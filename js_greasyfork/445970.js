// ==UserScript==
// @name         Redactle custom article
// @namespace    https://redactle.com/
// @version      2.2.3
// @description  Use a custom Wikipedia article on redactle.com!
// @author       absolutevalue
// @homepageURL  https://greasyfork.org/en/scripts/445970-redactle-custom-article
// @match        *://*.redactle.com/*
// @icon         https://www.redactle.com/favicon-32x32.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445970/Redactle%20custom%20article.user.js
// @updateURL https://update.greasyfork.org/scripts/445970/Redactle%20custom%20article.meta.js
// ==/UserScript==
var names = ["North_America","Brazil","French_language","Canada","United_States","Mexico","Guatemala","Napoleon","Honduras","Nicaragua","Poland","Switzerland","El_Salvador","Belize","Costa_Rica","Panama","Cuba",
"The_Bahamas","Barbados","Dominica","Dominican_Republic","Grenada","Haiti","Jamaica","Saint_Kitts_and_Nevis","Saint_Lucia","Saint_Vincent_and_the_Grenadines","Trinidad_and_Tobago","Argentina","Bolivia","Chile","Uruguay",
"Paraguay","Ecuador","Venezuela","Colombia","Peru","Guyana","Suriname","South_America","Asia","Africa","Antarctica","Europe","Oceania","United_Kingdom","Republic_of_Ireland","France","Iceland","Spain",
"Portugal","Andorra","Belgium","Luxembourg","Netherlands","Germany","Italy","Monaco","San_Marino","Vatican_City","Liechtenstein","Austria","Hungary","Malta","Slovenia","Czechia","Slovakia","Croatia","Bosnia_and_Herzegovina",
"Serbia","Montenegro","Albania","Greece","Kosovo","North_Macedonia","Bulgaria","Romania","Moldova","Ukraine","Russia","Belarus","Denmark","Norway","Sweden","Finland","Estonia","Latvia","Lithuania","State_of_Palestine",
"Israel","Cyprus","Iran","Iraq","Lebanon","Syria","Jordan","Georgia_(country)","Azerbaijan","Armenia","Kuwait","Bahrain","Saudi_Arabia","Qatar","UAE","Oman","Yemen","Pakistan","India","Kazakhstan","Uzbekistan","Kyrgyzstan",
"Turkmenistan","Tajikistan","Afghanistan","Mongolia","China","Bhutan","Nepal","Bangladesh","Myanmar","Maldives","Laos",
"Sri_Lanka","North_Korea","South_Korea","Japan","Taiwan","Vietnam","Thailand","Cambodia","Philippines","Brunei","Singapore","Malaysia","Indonesia","East_Timor","Morocco","Algeria","Libya","Tunisia","Egypt","Angola","Benin",
"Botswana","Burkina_Faso","Burundi","Cameroon","Cape_Verde","Central_African_Republic","Chad",
"Comoros","DRC","Republic_of_the_Congo","Djibouti","Equatorial_Guinea","Eritrea","Eswatini","Ethiopia","Gabon","The_Gambia","Ghana","Guinea","Guinea-Bissau","Ivory_Coast","Kenya","Lesotho","Liberia","Libya","Madagascar",
"Malawi","Mali","Mauritania","Mauritius","Mozambique"];

var article = prompt('What is the article name? \nType "random" for a random article. \nType "cl" to clear guesses and reset the page.', "random");

setTimeout(start,3000);

function start(){
if (article == "random"){
    var n = Math.floor(Math.random() * names.length);
    article = names[n];
    //Uncomment one of the lines below to show what article was chosen (spoilers!)
    //console.log(n + "\n" + article);
    //alert(n + "\n" + article);
    start();
}else if(article == "cl" || article == "CL" || article == "Cl" || article == "cL"){
    localStorage.clear();
    alert("Guesses cleared!");
    window.location.reload(true);
}else if(article != null){
    fetchData(true, article);
}}