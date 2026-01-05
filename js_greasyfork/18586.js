// ==UserScript==
// @name         Search by city - Interpals
// @namespace    
// @version      2.0
// @description  Tools to search by city on Interpals
// @author       El98
// @match        https://www.interpals.net/app/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18586/Search%20by%20city%20-%20Interpals.user.js
// @updateURL https://update.greasyfork.org/scripts/18586/Search%20by%20city%20-%20Interpals.meta.js
// ==/UserScript==
document.getElementsByName("keywords")[0].placeholder = "Keywords";
document.getElementsByName("username")[0].placeholder = "City";
document.getElementsByName("username")[0].title = "City";
document.getElementsByName("username")[0].value = "City";
document.getElementsByName("username")[0].name = "searchbycity";
var currentCity = "";
if(document.URL.indexOf("city=") != "-1")
    currentCity = document.URL.split("city=")[1];
if(currentCity.indexOf("&") != "-1")
    currentCity = currentCity.split("&")[0];
    
document.getElementById("sRes").innerHTML = document.getElementById("sRes").innerHTML.split("&amp;city=").join("");
document.getElementById("sRes").innerHTML = document.getElementById("sRes").innerHTML.split('" offset').join('&amp;city='+currentCity+'" offset');
document.getElementById("sCSubmit").getElementsByTagName("a")[0].href = "javascript:;";
document.getElementById("sCSubmit").getElementsByTagName("a")[0].onclick = function() { $.getJSON("https://e-lliot.net/?q="+document.getElementsByName("searchbycity")[0].value, function(data) { document.getElementById("sCForm").action = "/app/search?city="+data.geonames[0].geonameId; if(document.getElementsByName("searchbycity")[0].value.length<=1){document.getElementById("sCForm").action = "/app/search";} else{window.history.pushState('', '', '/app/search?city='+data.geonames[0].geonameId);} document.sCForm.submit();}); }