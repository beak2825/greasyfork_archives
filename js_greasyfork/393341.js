// ==UserScript==
// @name         JR Panda Collect Off
// @namespace    https://greasyfork.org/en/users/197274-m-c-krish
// @version      1.6
// @description  Panda Auto Collect Off
// @author       RUTHUVAN | M C KRISH
// @match        https://worker.mturk.com/requesters/PandaCrazy/projects*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393341/JR%20Panda%20Collect%20Off.user.js
// @updateURL https://update.greasyfork.org/scripts/393341/JR%20Panda%20Collect%20Off.meta.js
// ==/UserScript==

(function() {
    'use strict';
$(document).ready(function(){
        window.onkeyup = function(e) {
        var key = e.keyCode ? e.keyCode : e.which;
        if (key == 189) {
            window.localStorage.removeItem("JRPOff_array");
        alert("JRPOff Removed Successfully");
        }
    };

});

setInterval(function(){
                    var curttime = new Date();
                    var curtimetemp = new Date(curttime);
                    
                JRPOff_array.forEach(function(JRPOff_array_single) {
                     var deletedtime=new Date(JRPOff_array_single.deletetime);
                    var delete_box =new Date(JRPOff_array_single.delete_box_time);
                    if(curttime > deletedtime)
                    {
                        var cellid = JRPOff_array_single.cellid;
                        if($('#JRCollectB_' + cellid).hasClass("JROnButton"))
                        {
                           $('#JRCollectB_' + cellid).click();
                        }
                        if ($('#JRCollectB_' + cellid).hasClass("JROffButton")) {
                      $('#JRCollectB_' + cellid).on("click", function(){
                          JRPOff_array_single.deletetime=new Date(curtimetemp.setMinutes(curttime.getMinutes() + 45));
                              var JSONJRPOff_array = JSON.stringify(JRPOff_array);
                            localStorage.setItem('JRPOff_array', JSONJRPOff_array);
                      });
                      
                }   
                        if(curttime > delete_box)
                        var hitindex = JRPOff_array.indexOf(JRPOff_array_single);
                        {
                           $('#JRDelB_' + cellid).click();
                           if($('.ui-button-text').val()=='Yes');
                            $('.ui-button-text').click();
                         if (hitindex > -1) {
                            JRPOff_array.splice(hitindex, 1);
                        }

                        }

                        }

                    });
}, 100000);
})();