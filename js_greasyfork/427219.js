// ==UserScript==
// @name Mover Army Minas Ggg
// @namespace kowsky.org
// @version 0.1
// @description Imperiaonline movearmy for v5, v6
// @match http://*/imperia/game_v5/game/villagejs.php
// @match https://*/imperia/game_v5/game/villagejs.php
// @match http://*/imperia/game_v5/game/village.php
// @match https://*/imperia/game_v5/game/village.php

// @match http://*/imperiaonline/game_v5/game/villagejs.php
// @match https://*/imperiaonline/game_v5/game/villagejs.php
// @match http://*/imperiaonline/game_v5/game/village.php
// @match https://*/imperiaonline/game_v5/game/village.php

// @match http://*/imperiaonline.org/game_v5/game/villagejs.php
// @match https://*/imperiaonline.org/game_v5/game/villagejs.php
// @match http://*/imperiaonline.org/game_v5/game/village.php
// @match https://*/imperiaonline.org/game_v5/game/village.php

// @match http://*/imperiaonline.org/imperia/game_v5/game/villagejs.php
// @match https://*/imperiaonline.org/imperia/game_v5/game/villagejs.php
// @match http://*/imperiaonline.org/imperia/game_v5/game/villagejs.php
// @match https://*/imperiaonline.org/imperia/game_v5/game/villagejs.php

// @match https://www127.imperiaonline.org/imperia/game_v5/game/villagejs.php
// @match http://www127.imperiaonline.org/imperia/game_v5/game/villagejs.php
// @copyright 2012+, You
// @downloadURL https://update.greasyfork.org/scripts/427219/Mover%20Army%20Minas%20Ggg.user.js
// @updateURL https://update.greasyfork.org/scripts/427219/Mover%20Army%20Minas%20Ggg.meta.js
// ==/UserScript==

function addJQuery(callback) {
var script = document.createElement("script");
script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
script.addEventListener('load', function() {
var script = document.createElement("script");
script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
document.body.appendChild(script);
}, false);
}

$(document).ready(function(){

    var mina1 = 63202539;
    var mina2 = 63203129;
    var mina3 = 63202875;

    if (typeof(Storage) !== "undefined") {
    }
    else {
        alert("Desculpe! web storage não suportado, esse script não vai funcionar neste browser, aconselho a utilizar Mozilla Firefox ou Google Chrome");
    }

    // Reduzir 10 minutos
    xajax_listResearches('1', '1', '', -1, 0, 0, 'NULL', 2);

    setTimeout(function(){
        if($('#missions .outgoing.province').html() == null){
            // Store
            if(localStorage.getItem("localizacao_inimigo") == null || localStorage.getItem("localizacao_inimigo") == ""){
                localStorage.setItem("localizacao_inimigo", mina1);
            }
            else
            {
                if(localStorage.getItem("localizacao_inimigo") == mina1){
                    localStorage.setItem("localizacao_inimigo", mina3);
                }
                else if(localStorage.getItem("localizacao_inimigo") == mina2){
                    localStorage.setItem("localizacao_inimigo", mina1);
                }
                else if(localStorage.getItem("localizacao_inimigo") == mina3){
                    localStorage.setItem("localizacao_inimigo", mina2);
                }
            }

            // Inimigo
            var localizacao_Do_Inimigo = localStorage.getItem("localizacao_inimigo");
            autoSave(localizacao_Do_Inimigo);
        }


        // Validando ataques
        if($('#missions').html() != null && $('#missions .incoming.province').html() != null){
            $('body').css('background',"red");
           // window.open("https://mp3.fastupload.co/data/1615671550/07-Break-Me-Out.mp3");
        }else{
            $('body').css('background',"green");
        }

        // Verificação do ouro
        if($("#resources-list #gold a").text().trim() < "0")
        {
           // window.open("https://mp3.fastupload.co/data/1615671550/07-Break-Me-Out.mp3");
        }
	},2000);
});

setInterval(
function checker(){
    window.location.href= $(location).attr('href');
},20000);//20s

function autoSave(localizacao_Do_Inimigo){
    console.log(localizacao_Do_Inimigo);
	xajax_viewOperationCenter(containersStuff.findContaner());
	xajax_viewOperationCenter(1,{'tab':2});

	setTimeout(function(){
		$("#sendAttackForm table.table-v3").find("tr").slice(1).first().find('a').each(function(e){$(this).click()});
	},2000);


	setTimeout(function(){
	 	$('.button-v3').click()
	},6000);

	 setTimeout(function(){
	 	 xajax_doAttack(999,xajax.getFormValues('sendAttackForm'),localizacao_Do_Inimigo,666);
	},2000);

   setTimeout(function(){
	 	 $('#nomer').val(1);

	},8500);

	 setTimeout(function(){
         // Cerco a fortaleza
	 	xajax_doAttack(999,xajax.getFormValues('sendAttackForm'),document.getElementById('checkMe').value,1);SetFocusTop();

         // Batalha Campal
        //xajax_doAttack(999,xajax.getFormValues('sendAttackForm'),document.getElementById('checkMe').value,2);SetFocusTop();

	},10000);
}