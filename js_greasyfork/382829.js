// ==UserScript==
// @name         Mafiaenshevn.com Script
// @namespace    https://www.fiverr.com/jorgequintt
// @version      1.2
// @description  Script for Mafiaenshevn.com
// @author       Jorge Quintero
// @match        https://www.mafiaenshevn.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/382829/Mafiaenshevncom%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/382829/Mafiaenshevncom%20Script.meta.js
// ==/UserScript==

(function() {
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// EDITABLE VARIABLES /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    var percentage = 12.31;
      
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// CODE ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    var init_interval = setInterval(start_script, 300);
    
    function start_script(){
        var jmoney_element = ".menubox #jmoney";
        if( $(jmoney_element).length ){
            var percentage_element = '<dt>Penge <span style="color:red;">'+percentage+'%</span> </dt> <dd id="jpercentagemoney"></dd>';

            $(percentage_element).insertAfter(jmoney_element);

            var jmoney_value = $(jmoney_element).text();
            jmoney_value = parseInt(jmoney_value.replace(/\s/g, '').replace(/kr/g, ''));

            var percentage_jmoney_value = Math.floor((parseFloat(percentage)/100) * parseFloat(jmoney_value) );

            $(".menubox #jpercentagemoney").html( percentage_jmoney_value.toLocaleString() +" kr");
            clearInterval(init_interval);
        }
    }

    
    
    
    
    
    
})();