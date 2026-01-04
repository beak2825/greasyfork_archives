// ==UserScript==
// @name         pmarket-no-conirm
// @namespace    pmarket-no-conirm
// @version      0.1
// @description  pmarket-no-conirms
// @author       nao
// @match        https://www.torn.com/pmarket.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510476/pmarket-no-conirm.user.js
// @updateURL https://update.greasyfork.org/scripts/510476/pmarket-no-conirm.meta.js
// ==/UserScript==

function getRFC(){
    var rfc = $.cookie('rfc_v');
    if (!rfc) {
        var cookies = document.cookie.split('; ');
        for (var i in cookies) {
            var cookie = cookies[i].split('=');
            if (cookie[0] == 'rfc_v') {
                return cookie[1];
            }
        }
    }
    return rfc;
}

function request(id, element){
    $.post(`https://www.torn.com/pmarket.php?rfcv=${getRFC()}`,
           {
        ajax_action: "buy1",
        ID: id
    }
           , function(response){
        response = JSON.parse(response);
        $(element).css("background-color", response.color);
        if (response.color == "green"){
            $(element).remove();
        }
        console.log(response);
    });


}


function rem(){
    $(".action").off("click");
    $(".action").on("click", function(e){
        e.preventDefault();
        e.stopImmediatePropagation();
        let parent = $(this).parent();
        let id = $(parent).attr("href");
        console.log(id);
        id = id.split("ID=")[1].split("&")[0];
        request(id, $(this).parents("li"));

        return false;

    });

}

setInterval(rem, 500);