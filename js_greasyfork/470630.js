// ==UserScript==
// @name         Territory
// @namespace    zero.quickterritory.torn
// @version      0.5
// @description  Quick Territory claim
// @author       -zero [2669774]
// @match        https://www.torn.com/city.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470630/Territory.user.js
// @updateURL https://update.greasyfork.org/scripts/470630/Territory.meta.js
// ==/UserScript==

function insert(){
    var box = `<input type="text" id="territoryID"><button type="submit" id="assaultTerritory" class="torn-btn territoryDirect">Assault</button> <button type="submit" id="leaveTerritory" class="torn-btn territoryDirect">Leave</button> <button type="submit" id="claimTerritory" class="torn-btn territoryDirect">Claim</button></br><span id="terrResult"></span>`;

    if ($(".content-title").length > 0){
        $('.content-title').append(box);
        $('#assaultTerritory').on("click", function(){
            send("take");
    
        });
        $('#claimTerritory').on("click", function(){
            send("claim");
    
        });
        $('#leaveTerritory').on("click", function(){
            send("abandon");
    
        });
        setInterval(check,300);
    }
    else{
        setTimeout(insert,300);
    }

    
}

function getRFC() {
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

function send(v){
    var i = $('#territoryID').attr("value");
    var data = {
        type:v,
        id:i,
        exist:"",
        exist_data:"",
        is_old_collection:"",
        step:"action"

    };

    $.post("https://www.torn.com/city.php?rfcv="+getRFC(),data,function(res){
        console.log(res);
        var resp = JSON.parse(res);
        console.log(resp);
        console.log(resp.success);
        if (resp.success){
            $("#terrResult").html(String(resp.success));
        }
        else{
            $("#terrResult").html(String(resp.error));
        }
        


    });

}



function check(){
  
      
        $('path').off('click');
        $('path').on('click', function(){
            var id=$(this).attr('db_id');
            $("#territoryID").attr("value", id);
            console.log(id);
        });

   
    
}

insert();
