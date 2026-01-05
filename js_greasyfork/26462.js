// ==UserScript==
// @name         IP Hunter for ZTE-MF6m by unel
// @namespace    https://greasyfork.org/en/scripts/26461-ip-hunter-by-unel
// @version      1.0.2
// @description  This userscript automatically reconnects the mobile data for some ZTE MF6M modems until it connects to a matching IP address.
// @author       unel
// @match        http://192.168.1.1/index.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26462/IP%20Hunter%20for%20ZTE-MF6m%20by%20unel.user.js
// @updateURL https://update.greasyfork.org/scripts/26462/IP%20Hunter%20for%20ZTE-MF6m%20by%20unel.meta.js
// ==/UserScript==

/*
 * IP Hunter by unel
 *
 *
 * THIS WORK IS COPYRIGHT PROTECTED
 * http://www.copyrighted.com/copyrights/view/res6-lerh-sdlx-2lgh
 *
 * MODIFYING THE TOOL FOR YOUR PERSONAL USE IS PERMITTED
 * HOWEVER, RE-BRANDING OR REMOVING THIS COPYRIGHT NOTICE IS NOT ALLOWED.
 *
 * IF YOU HAVE ANY SUGGESTIONS TO IMPROVE THIS TOOL,
 * YOU CAN PM ME ON FACEBOOK.
 * https://www.facebook.com/lyoniel.farase
 */

(function() {
    'use strict';
    //if(document.location.hash !== "#login"){

        var zte_service = null;
        var zte_device_info = null;
        var zte_device_info_init = null;
        var valid_ip = "10.;100.12;100.13;100.14;100.15;100.16;100.17;100.18;100.19;100.2";
        var hunter_handler = null;
        var ppp_status = null; //connected: "ppp_connected", disconnected: "ppp_disconnected"
        var ppp_loading = null;

        // Your code here...
        $('<div id="frm-iphunt" class="form-body" style="display: none;">'+
          '<div class="form-title" >IP Hunter</div>'+
          '<div class="content">'+
          '<div class="row-fluid">'+
          '<label class="span4 side-right" for="txt_pattern">Pattern<i class="colorRed">&nbsp;*</i></label>'+
          '<div class="span8">'+
          '<textarea type="text" name="txt_pattern" id="txt_pattern" style="width: 369px;height: 80px;"></textarea>'+
          '<input type="button" class="span2 btn-1" id="btn_init" name="btn_init" value="Search" style="height: 80px;">'+
          '</div>'+
          '</div>'+
          '<div class="row-fluid">&nbsp;</div>'+
          '<div class="row-fluid">'+
          '<div class="span4"></div>'+
          '<div class="span6" style="line-height: normal;">'+
          '<div id="div_iphunt_logs" style="height:200px;overflow-y:auto; border:1px #000 solid;"></div>'+
          '</div>'+
          '</div>'+
          '</div>'+
          '</div>').appendTo('body');

        $("#txt_pattern").val(localStorage.zte_valid_ip || valid_ip);    
    
        $("#btn_init").click(function(){
            var valid_ip_val = $("#txt_pattern").val() || valid_ip;
            localStorage.zte_valid_ip = valid_ip_val;
            //zte_device_info_init = require.s.contexts._.defined['status\/device_info'];
            //zte_device_info_init.init();
            zte_service = require.s.contexts._.defined.service;
            zte_device_info = zte_service.getDeviceInfo();

            ppp_status = zte_device_info.connectStatus;

            if(this.value == "Search"){
                $("#div_iphunt_logs").empty();
                this.value = "Stop";
                hunter_handler = setInterval(function(){
                    if(ppp_loading) return;
                    zte_device_info = zte_service.getDeviceInfo();
                    var e = zte_device_info.wanIpAddress;
                    $("#div_iphunt_logs").append("<span>Current IP: <strong>"+ e + "</strong></span></br>");
                    var res_ip = false;
                    localStorage.zte_valid_ip.split(";").forEach(function(l,a){res_ip = res_ip || e.startsWith(l);});
                    if(!res_ip){
                        $("#div_iphunt_logs").append("<span>Reconnecting...</span><br/>");
                        if(ppp_status == "ppp_connected"){
                            ppp_loading = 1;
                            zte_service.disconnect({}, function(d){
                                zte_service.connect({}, function(d){
                                    ppp_status = d.status;
                                    ppp_loading = null;
                                });
                            });
                        }
                    }
                    else{
                        $("#div_iphunt_logs").append("<span>Success. Found IP: <strong>"+ e + "</strong></span><br/>");
                        $("#div_iphunt_logs").append("<span><strong>Stopped.</strong></span><br/>");
                        $("#btn_init").val("Search");
                        ppp_loading = null;
                        clearInterval(hunter_handler);
                    }
                    $("#div_iphunt_logs").scrollTop($("#div_iphunt_logs")[0].scrollHeight);

                }, 300);
            }
            else if(this.value == "Stop"){
                this.value = "Search";
                ppp_loading = null;
                clearInterval(hunter_handler);
            }

        });
    //}
    setInterval(function(){
        var $frm_iphunt = $("#frm-iphunt");
     if(document.location.hash !== "#login"){
         if($frm_iphunt.is(":visible")) return;
         $frm_iphunt.show();
     }
     else{
         if(!$frm_iphunt.is(":visible")) return;
         $frm_iphunt.hide();
     }
    }, 300);
})();