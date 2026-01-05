// ==UserScript==
// @name         Recos
// @namespace    http://taringa.net/_SeRiAlKiLLeR_
// @version      0.4
// @description  creador de recos predeterminado para Taringa! // 
// @match        *://www.taringa.net/mi
//@icon          http://k33.kn3.net/taringa/1/2/3/2/9/6/48/_serialkiller_/58E.gif
// @copyright    2016, _SeRiAlKiLLeR_
// @downloadURL https://update.greasyfork.org/scripts/17909/Recos.user.js
// @updateURL https://update.greasyfork.org/scripts/17909/Recos.meta.js
// ==/UserScript==

(function() {
    var urlyboton = $('<div class="box"><div class="title clearfix"><a href="#" id="panelx"><h2>Creador de Recos</h2></a></div><div id="coindesk-widget" data-size="mpu"></div><div id="ocultarx" class="list reco"><textarea id="ID1" class="user-text" tabindex="700" placeholder="Nick del user (sin @)" autocomplete="on" style="width:260px; height: 15px; background: rgb(255, 255, 255);resize: none; "></textarea>  <input type="button" id="recos" value="Recomendar" style="height: 35px; background:white; color: #4cadfc; "/> | <input type="button" id="limpiar" value="Limpiar" style="height: 35px; background:white; color: #4cadfc; "/><br></br></div></div>');
    $('#sidebar').prepend(urlyboton);
    
    function limpiarnick() {
        var ext0 =$('#ID1');
        var lol0 ='';
        ext0.val(lol0).click().focus();
        } limpiar.onclick=limpiarnick;
    function reload() {
        var ext = $('#ID1').val ();
        var otr = ["Buen post! by ",
                   ":buenpost: por ",
                   "Excelente post! by ",
                   "",
                   "buen aporte!! ",
                   ];
        var des = [" :+1:",
                   " :v:",
                   " :D ",
                   "",
                   " :) ",
                   ];
        
var tiempo = new Date();
var ramd = Math.floor(Math.random(tiempo.getTime()) * (5 - 0)) + 0;
        var com = $('#my-shout-body-mi');
        com.val("").click().focus();
        var lol = '';
        if(com.val() != ''){
            lol += "";
        }
        lol += otr[ramd] + '@' +  ext + des[ramd] +  '\n';
        lol += '\n';
        if (ramd == 0) lol += '[[' + ext + ']]' + ' '+ '[[[' + ext + ']]]'+ ' '+ '[[' + ext + ']]'+ ' '+ '[[[' + ext + ']]]'+ ' '+'[[' + ext + ']]'+' ';
        if (ramd == 1) lol += '[[[[' + ext + ']]]]'+' ';
        if (ramd == 2) lol += '[[[[[' + ext + ']]]]]' + ' ';
        if (ramd == 3) lol += '[' + ext + ']' + ' '+ '[[' + ext + ']]'+ ' '+ '[[[' + ext + ']]]'+ ' '+ '[[[[' + ext + ']]]]'+ ' '+'[[[[[' + ext + ']]]]]'+' ';
        if (ramd == 4) lol += '[[[' + ext + ']]]' + ' '+ '[[' + ext + ']]'+ ' '+ '[' + ext + ']'+ ' '+ '[[' + ext + ']]'+ ' '+'[[[' + ext + ']]]'+' ';

        com.val(lol).click().focus();
        } recos.onclick=reload;
    
        $('#panelx').toggle(
        function(y){ 
            $('#ocultarx').slideUp();
            $('#panelx h2').html('Creador de Recos ↓');
            e.preventDefault();
        },
        function(y){ 
            $('#ocultarx').slideDown();
            $('#panelx h2').html('Creador de Recos');
            e.preventDefault();
        }
 
    );

})();