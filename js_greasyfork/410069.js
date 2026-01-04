// ==UserScript==
// @name         Fking IFCN IFPRC IFCPC
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  remove map-flight ads
// @author       IFCN like shit
// @match        https://www.map-flight.com/
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410069/Fking%20IFCN%20IFPRC%20IFCPC.user.js
// @updateURL https://update.greasyfork.org/scripts/410069/Fking%20IFCN%20IFPRC%20IFCPC.meta.js
// ==/UserScript==
(function() {
    'use strict';
    $(document).ready(function() {
        $('.sidebar-btn').remove()
        localStorage.setItem('server', 'Expert Server')
        $("input").focus()
        $('#ads').remove()
        $('input').val('FGS')
        /*
        setInterval(function(){
            $.ajax({
                url:'https://api2-cn.map-flight.com/getFlightPlans?server=Expert+Server',
                method:'GET'
            })
        },1)*/
        $('#still-there-shade').remove()
        $('#news').remove()
        $('#buy-premium-card').remove()
    })

    document.addEventListener("keypress", function(){
        $("input").focus();
        if (event.keyCode === 13){
            $('input').val('FGS-')
        }
    })
})();