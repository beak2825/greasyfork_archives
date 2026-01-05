// ==UserScript==
// @name         Easier Kohls Truck Manager
// @namespace    https://greasyfork.org/users/4756
// @author       saibotshamtul (Michael Cimino)
// @version      0.3
// @description  prevents logoff timeout, highlights new loads in yellow, highlights updated loads in pink
// @match        https://tms.transplace.com/smp/search.jsf*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13943/Easier%20Kohls%20Truck%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/13943/Easier%20Kohls%20Truck%20Manager.meta.js
// ==/UserScript==
/*
function keepalive(){
    setTimeout(window.keepalive,1000*60*15);
    $.get(window.location.href);
    console.log(new Date());
};
*/
//http://www.w3schools.com/ajax/
function keepalive() {
    setTimeout(window.keepalive,1000*60*15);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        //if (xhttp.readyState == 4 && xhttp.status == 200) {
        // document.getElementById("demo").innerHTML = xhttp.responseText;
        //}
        return;
    };
    xhttp.open("GET", window.location.href, true);
    xhttp.send();
    console.log('KeepAlive:'+(new Date()).toString());
}
window.keepalive = keepalive;
window.keepalive();

// http://www.w3schools.com/js/js_cookies.asp
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
    }
    return "";
}

function checkLoad(){
    r = document.getElementById("results:resultsTable:tb");
    for (i=0;i<r.children.length;i++){
        row = r.children[i];
        load = row.children[0].children[0].children[0].children[0].children[0];
        load_id = "_"+load.textContent+"_";
        load_wgt = row.children[17].textContent;
        //if (document.cookie.search(load_id)===-1){
        if (getCookie(load_id)===''){
            load.style.background = '#ff0';
            setCookie(load_id, load_wgt, 30);
        } else {
            if (getCookie(load_id)!=load_wgt){
                load.style.background = '#f88';
                setCookie(load_id, load_wgt, 30);
            } else {
                load.style.background ='';
            }
        }
    }
}


cl = document.createElement("span");
//window.unwrappedJSObject.rd = rd;
cl.innerHTML="&nbsp;(L)&nbsp;";
cl.onclick = checkLoad;
moduleName.appendChild(cl);

