// ==UserScript==
// @name         Karachan Easy Use
// @version      0.1.3
// @namespace    karachan
// @description  Karachan easy use
// @author       Anon
// @include      http://karachan.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25284/Karachan%20Easy%20Use.user.js
// @updateURL https://update.greasyfork.org/scripts/25284/Karachan%20Easy%20Use.meta.js
// ==/UserScript==


/*
 *    RED BACKGROUND
 */

var styles = document.getElementsByTagName('style');

for(var i =0; i < styles.length; i++){
    remove(styles[i]);
}
setTimeout(cleanRed, 500);
setTimeout(cleanRed, 1000);
setTimeout(cleanRed, 2000);

/*
 * REMOVE SHAKER
 */

storage('xD', 'xD');

/*
 * ACCEPT REGULATIONS
 */

setCookie('regulamin', 'accepted', 365);


/*
 * REMOVE BLACK BACKGROUND
 */

remove(dom("#zjadam_srake"));
addStyle("#zjadam_srake", 'display', 'none');
remove(dom("#czaj"));
addStyle("#czaj", 'display', 'none');

/*
 * REMOVE
 */
addStyle("div.board", 'background-image', 'none');

/*
 * REMOVER YT VIDEO AND REGULATIONS
 */

removeRychu();

/*
 * SKIP WELCOME PAGE
 */

skip();


try{
    accept();
}
catch (e){}

//////////////////////////////////////////////
//////////////////////////////////////////////

function setCookie(c_name,value,exdays){
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
    document.cookie=c_name + "=" + c_value + "; path=/";
}

function remove(element) {
    if(element && element.parentNode){
        element.parentNode.removeChild(element);
    }
}

function dom(tselector, all) {
    all = all || false;
    var type = tselector.substring(0, 1);
    var selector = tselector.substring(1);
    var elements;
    if (type == "#") {
        return document.getElementById(selector);
    }
    else if (type == ".") {
        elements = document.getElementsByClassName(selector);
    }
    else{
        elements = document.querySelectorAll(tselector);
    }

    if (all) {
        return elements;
    }
    else {
        return elements.length ? elements[0] : null;
    }
}

function setStyle(elem, prop, val){
    if(elem){
        elem.style.removeProperty(prop);
        elem.style.setProperty(prop, val, 'important');
    }
}

function addStyle(elem, prop, val){
    var sheet = document.createElement('style');
    sheet.innerHTML = elem + "{" + prop + ":" + val + " !important;}";
    document.body.appendChild(sheet);
}


function storage(key, val){
    localStorage.setItem(key, val);
}


function cleanRed(){
    var styles = document.getElementsByTagName('style');
    for(var i =0; i < styles.length; i++){
        if(/red/.test(styles[i].innerText)){
            remove(styles[i]);
        }
    }
}

function removeRychu() {
    remove(dom('#regulamin'));
    remove(dom('#bip'));
    remove(dom('#bip2'));
}

function skip(){
    var link = document.getElementById("link");
    if(link && link.children.length){
        var a = link.children[0];
        a.click();
    }
}