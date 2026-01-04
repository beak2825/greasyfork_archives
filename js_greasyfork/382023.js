// ==UserScript==
// @name         ctnma 档案维护 新窗口打开 打印
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  新窗口打开档案表单方便打印
// @author       skipto
// @match        http://www.ctnma.cn/ioop-bcs-web/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382023/ctnma%20%E6%A1%A3%E6%A1%88%E7%BB%B4%E6%8A%A4%20%E6%96%B0%E7%AA%97%E5%8F%A3%E6%89%93%E5%BC%80%20%E6%89%93%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/382023/ctnma%20%E6%A1%A3%E6%A1%88%E7%BB%B4%E6%8A%A4%20%E6%96%B0%E7%AA%97%E5%8F%A3%E6%89%93%E5%BC%80%20%E6%89%93%E5%8D%B0.meta.js
// ==/UserScript==

function createprintform(flagId){
    var f = document.createElement("form");
    f.setAttribute('method',"post");
    f.setAttribute('action',"archives/archives-info!view.do");
    f.setAttribute('target', '_blank');
    f.style.display = "none";

    var i1 = document.createElement("input");
    i1.setAttribute('type',"text");
    i1.setAttribute('name',"flagId");
    i1.value = flagId

    var i2 = document.createElement("input");
    i2.setAttribute('type',"text");
    i2.setAttribute('name',"parId");
    i2.value = "docinarchive";

    var i3 = document.createElement("input");
    i3.setAttribute('type',"text");
    i3.setAttribute('name',"kind");
    i3.value = "00B";

    var i4 = document.createElement("input");
    i4.setAttribute('type',"text");
    i4.setAttribute('name',"readRight");
    i4.value = "";

    var s = document.createElement("input"); //input element, Submit button
    s.setAttribute('type',"submit");
    s.setAttribute('value',"Submit");

    f.appendChild(i1);
    f.appendChild(i2);
    f.appendChild(i3);
    f.appendChild(i4);
    f.appendChild(s);

    return f
}

// var reg = /.+\('(.+)'\);/;
// add th
function addforms(){
    var table = document.querySelector("#maintendance_table");
    var tr = table.querySelector("tr");
    var th = document.createElement("th");
    th.textContent = "打印";
    th.width = "30";
    tr.append(th);
    // add tr
    var rows = table.querySelectorAll(".list-row")
    rows.forEach(function(row){
        var input1 = row.querySelector("td>input");
        var flagid = input1.id;
        var form = createprintform(flagid);
        var td = document.createElement("td");
        td.textContent = "打开";
        td.style.cursor = "pointer";
        td.onclick = function(e){
            input1.click();
            form.submit();
        };
        td.append(form);
        row.append(td);
    });
}

// https://stackoverflow.com/questions/5202296/add-a-hook-to-all-ajax-requests-on-a-page
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
// http://www.ctnma.cn/ioop-bcs-web/archives/archives-info!maintenanceList.do
addXMLRequestCallback( function( xhr ) {
    xhr.addEventListener("load", function(){
        if ( xhr.readyState == 4 && xhr.status == 200 ) {
            // console.log( xhr.responseURL );
            //if ( xhr.responseURL.includes("archives/archives-info!view.do?") ) {
            //    console.log("UI!",xhr);
            //    UI();
            //};
            if ( xhr.responseURL.includes("archives/archives-info!maintenanceList.do") ) {
                console.log("addforms!",xhr);
                addforms();
            }
        }
    });
});