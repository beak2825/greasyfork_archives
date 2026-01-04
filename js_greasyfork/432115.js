// ==UserScript==
// @name         cloudraft云筏重新激活域名
// @namespace    https://www.liuquanhao.com/
// @version      0.1
// @description  cloudraft云筏重新激活域名，先删掉cf的域名，然后点重新激活就行了
// @author       liuxu
// @match        https://my.cloudraft.cn/user/Cfpro
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432115/cloudraft%E4%BA%91%E7%AD%8F%E9%87%8D%E6%96%B0%E6%BF%80%E6%B4%BB%E5%9F%9F%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/432115/cloudraft%E4%BA%91%E7%AD%8F%E9%87%8D%E6%96%B0%E6%BF%80%E6%B4%BB%E5%9F%9F%E5%90%8D.meta.js
// ==/UserScript==

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function appendClick() {
    await sleep(1000);
    var trList = document.getElementById("zone_info").getElementsByTagName("tr");
    for (var i = 0; i < trList.length; i++) {
        var id = trList[i].getElementsByTagName("td")[0].innerText;
        var domain = trList[i].getElementsByTagName("td")[1].innerText;
        var newTd = trList[i].insertCell();
        newTd.innerHTML = '<a href="https://my.cloudraft.cn/user/cfpro/activateZone?zone=' + domain + '&id=' + id + '">重新激活</a></td>';
    }
    var tr = document.getElementById("zone_info").parentNode.getElementsByTagName("thead")[0].getElementsByTagName("tr")[0];
    var th = document.createElement("th");
    var thText = document.createTextNode("重新激活");
    th.appendChild(thText);
    th.width = "10%";
    tr.appendChild(th);
}

function addXMLRequestCallback(callback){
    var oldSend, i;
    if( XMLHttpRequest.callbacks ) {
        // we've already overridden send() so just add the callback
        XMLHttpRequest.callbacks.push( callback );
    } else {
        // create a callback queue
        XMLHttpRequest.callbacks = [callback];
        // store the native send()
        oldSend = XMLHttpRequest.prototype.send;
        // override the native send()
        XMLHttpRequest.prototype.send = function(){
            // process the callback queue
            // the xhr instance is passed into each callback but seems pretty useless
            // you can't tell what its destination is or call abort() without an error
            // so only really good for logging that a request has happened
            // I could be wrong, I hope so...
            // EDIT: I suppose you could override the onreadystatechange handler though
            for( i = 0; i < XMLHttpRequest.callbacks.length; i++ ) {
                XMLHttpRequest.callbacks[i]( this );
            }
            // call the native send()
            oldSend.apply(this, arguments);
        }
    }
}

addXMLRequestCallback( function( xhr ) {
    xhr.addEventListener("load", function(){
        if ( xhr.readyState == 4 && xhr.status == 200 ) {
            if ( xhr.responseURL.includes("https://my.cloudraft.cn/user/cfpro/getUserZones") ) {
                appendClick();
            }
        }
    });
});