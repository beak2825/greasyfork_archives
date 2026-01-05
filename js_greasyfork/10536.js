// ==UserScript==
// @name         Agar.io Connector
// @namespace    http://your.homepage/
// @version      0.1
// @description  Working agar.io server connector (tested 20.06.2015)
// @author       shardragon
// @match        http://agar.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10536/Agario%20Connector.user.js
// @updateURL https://update.greasyfork.org/scripts/10536/Agario%20Connector.meta.js
// ==/UserScript==

var _XMLHttpRequest = window.XMLHttpRequest;
window.XMLHttpRequest = function(params)
{
    var request = new _XMLHttpRequest(params);
    request.open = function(method, url, async, user, password)
    {
        console.log(url);
        
        if(url === "http://m.agar.io/") {
            request.addEventListener("load", function()
            {
                document.getElementById("serverInput").value = request.responseText.split("\n")[0];
            });
        }
        
        return _XMLHttpRequest.prototype.open.call(this, method, url, async, password);
    }
    return request;
}


window._connectToRequest = null;
window.connectToTries   = 100;
window.connectToAddress = function(address, count)
{
    count = (typeof(count) === "number") ? count : 0;
    
    // Stop previous connection attempt
    if(window._connectToRequest) {
       window._connectToRequest.abort();
    }
    
    if(count > window.connectToTries) {
        $("#connectResponse").text("Exceeded number of tries to retrieve server token");
        return;
    } else {
        $("#connectResponse").text("Searching for server (try " + count + "/" + window.connectToTries + ")" + " ...");
    }
    
    var request = new _XMLHttpRequest();
    request.open("POST", "http://m.agar.io/", true);
    request.addEventListener("load", function()
    {
        window._connectToRequest = null;
        
        var response = request.responseText.split("\n");
        
        var response_address = response[0];
        var response_token   = response[1];
        
        if(response_address === address) {
            connect("ws://" + response_address, response_token);
            
            $("#connectResponse").text("Connection to server established");
        } else {
            connectToAddress(address, (count + 1));
        }
    });
    
    window._connectToRequest = request;
    
    request.send($("#region").val() + $("#gamemode").val());
}

$(document).ready(function() {
    var new_entry = $("#region");
    if (new_entry.length) {
        $("<div class=\"form-group\"><span id=\"connectResponse\"></span></div>").insertAfter("#helloDialog > form > div:nth-child(3)");
        $("<div class=\"form-group\"><input id=\"serverInput\" class=\"form-control\" placeholder=\"255.255.255.255:443\" maxlength=\"20\"></input></div>").insertAfter($("#connectResponse").parent());
        $("<div class=\"form-group\"><button disabled type=\"button\" id=\"connectBtn\" class=\"btn btn-warning btn-needs-server\" onclick=\"connectToAddress($('#serverInput').val());\" style=\"width: 100%\">Connect</button></div>").insertAfter($("#serverInput").parent());
    }
});