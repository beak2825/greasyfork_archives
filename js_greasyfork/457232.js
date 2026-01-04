// ==UserScript==
// @name         Bank Requester 2
// @version      1.2
// @description  Helper to withdraw/deposit
// @author       puddle
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