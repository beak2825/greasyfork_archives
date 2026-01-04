// ==UserScript==
// @name         Inventory requester
// @description  Inventory framework
// @author       A Meaty Alt
// @grant        none
// ==/UserScript==

function getPlayerValues(){
    return new Promise(function(resolve){
        $.post("https://fairview.deadfrontier.com/onlinezombiemmo/get_values.php",
               jQuery.param(buildSecureBody()),
               function(response){
            resolve(response);
        });
    });
}
function getItemCode(i, playerValues){
    var patternType = new RegExp("df_inv"+i+"_type=(.*?)\&");
    return playerValues.match(patternType)[1];
}
function getStorageSize(playerValues){
    return playerValues.match(/df_storage_slots=(.*?)&/)[1];
}

function getPlayerOutpostId(){
    return new Promise((resolve) => {
        getPlayerValues()
        .then((values) => {
            var tradezoneId = values.match(/tradezone=(.*?)&/)[1];
            resolve(tradezoneId);
        });
    });
}