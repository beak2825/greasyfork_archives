// ==UserScript==
// @name         Bank Requester
// @version      1.1
// @description  Helper to withdraw/deposit
// @author       A Meaty Alt
// @include      /fairview.deadfrontier.com/
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js
// ==/UserScript==

function withdraw(money, params){
    return new Promise(function(resolve){
    var sc = params.match(/sc=(.*?)&/)[1];
    var id = params.match(/userID=(.*?)&/)[1];
    var password = params.match(/password=(.*?)&/)[1];
    $.post("https://fairview.deadfrontier.com/onlinezombiemmo/bank.php",
           "withdraw="+money+"&templateID=undefined&sc=" + sc + "&userID="+id+"&password="+password,
               (response) => resolve(response)
              );
    });
}
function deposit(money, params){
    return new Promise(function(resolve){
        var sc = params.match(/sc=(.*?)&/)[1];
        var id = params.match(/userID=(.*?)&/)[1];
        var password = params.match(/password=(.*?)&/)[1];
        $.post("https://fairview.deadfrontier.com/onlinezombiemmo/bank.php",
               "deposit="+money+"&templateID=undefined&sc=" + sc + "&userID="+id+"&password="+password,
               (response) => resolve(response)
              );
    });
}