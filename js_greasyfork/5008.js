// ==UserScript==
// @name      wish.com Tweaks
// @namespace  obscenelysad@gmail.com
// @version    1.3
// @description  Filtering by max price, autoload items
// @match      https://www.wish.com/*
// @copyright  obscenelysad@gmail.com
// @downloadURL https://update.greasyfork.org/scripts/5008/wishcom%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/5008/wishcom%20Tweaks.meta.js
// ==/UserScript==




$(document).ready(function() {   
    
    if ($("#nav-search").length > 0){
        
        $("#header-left").after('<div id="wish_tweaks_config" style="float: left; margin-top: 18px;"><p style="color: black;float: left;"> Autolad Products:</p><input type="checkbox" id="wtc_autoload_items" name="autoload_items" value="value" style="float: left;"><p style="color: black;float: left;">Max Price: </p><input id="wtc_max_price" type="text" maxlength="4" style="width: 30px;width: 2;margin-left: 5px;margin-top: 0px;"></div>');
        
        $("#wtc_max_price").keydown(function (e) {
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                (e.keyCode == 65 && e.ctrlKey === true) || 
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                return;
            }
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });
        
        setInterval(function(){
            
            if($("#wtc_max_price").val() == ''){                
            }else{
                
                window.max_price = parseInt($("#wtc_max_price").val());
                                
                var items = $(".actual-price");
                
                $.each( items, function() {    
                    
                    if($(this).text().replace(/\D/g,'') > window.max_price){                                       
                        $(this).parent().parent().parent().parent().remove();                                       
                    }
                    
                });    
                
            }
            
            if($("#wtc_autoload_items").is(':checked')){
                $("#feed-more-btn").click();        
            }
            
        }, 500);
        
    }    
    
});    