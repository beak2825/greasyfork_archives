// ==UserScript==
// @name         IP Hunter for ZTE-MF63
// @namespace    Jhay-Ar
// @version      2.0.0
// @description  This userscript automatically reconnects the mobile data for some ZTE MF63 modems until it connects to a matching IP address.
// @author       Jhay-Ar
// @match       http://192.168.0.1/index.html
// @match       http://ufi.home/index.html
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/todc-bootstrap/3.3.6-3.3.6/js/bootstrap.min.js
// @resource    buttonCSS https://raw.githubusercontent.com/necolas/css3-github-buttons/master/gh-buttons.css
// @resource    btnCSS https://raw.githubusercontent.com/jrd2na/assets.github.io/master/bootstrap2.min.css
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getResourceURL
// @downloadURL https://update.greasyfork.org/scripts/26623/IP%20Hunter%20for%20ZTE-MF63.user.js
// @updateURL https://update.greasyfork.org/scripts/26623/IP%20Hunter%20for%20ZTE-MF63.meta.js
// ==/UserScript==
console.log("Start");

document.head.appendChild(cssElement(GM_getResourceURL ("githubButtonIconSet")));
document.head.appendChild(cssElement(GM_getResourceURL ("buttonCSS")));
document.head.appendChild(cssElement(GM_getResourceURL ("btnCSS")));


function cssElement(url) {
  var link = document.createElement("link");
  link.href = url;
  link.rel="stylesheet";
  link.type="text/css";
  return link;
}

function myFunc () {
    'use strict';
    var ButtonHtml = `
`;
    var modalHtml = `
<!-- Content -->
<div id="myContent" tabindex="-1">
  <div class="dialog">
    <div class="content" style="background-size:cover;background-image:url('')">
          <style>
          span{
          margin-left:5px;
          }
          </style>
          <div id="frm-iphunt" style="background-size:cover;background-image:url("www.media.istockphoto.com/photos/blue-gradient-blurred-abstract-background-picture-id523159398?k=6&m=523159398&s=170667a&w=0&h=QaH57rXTcu6XUsgfl7XGgmBaz2Vbz0AKaHgC2T50hsI=")" class="form-body" ">
          <div style="text-align:center;"><h2 style="font-family: cursive;color:black;text-shadow: 2px 2px #ff0000;" >IP Hunter</h2> <span style="font-size:12px;color:black;font-family: monospace;"> by Jhay-R </span></div>
          <hr>
          <div class="content">
          <div class="row-fluid">
          <label class="span4 side-right" for="txt_pattern"><i class="colorRed">&nbsp;</i></label>
          <div class="span8">
          <form method="post">
          <textarea type="text" required placeholder="IP (eg: 10.;100.35" name="txt_pattern" id="txt_pattern" style="margin-left:-70px;width: 369px;height: 50px;"></textarea>
          </div>
          </div>
          <div class="row-fluid">&nbsp;</div>
          <div class="row-fluid">
          <div class="span4"></div>
          <div class="span6" style="line-height: normal;">
          <div id="div_iphunt_logs" style="margin-left:-70px;padding: 10px;width:369px;height:200px;overflow-y:auto;background: #ff0030;
   color: #fff;
   line-height: 1.3em;
   border: 2px dashed #fff;
   border-radius: 10px;
   box-shadow: 0 0 0 4px #ff0030, 2px 1px 6px 4px rgba(10, 10, 0, 0.5);"></div>
          </div>
          </div>
          </div>
      </div>
      <div class="modal-footer">
        <input type="submit" id="btn_init" name="btn_init" value="Search" class="btn btn-primary" style="margin-left: 420px;margin-bottom:20px;"></input>
       </form>
      </div>
    </div>
  </div>
</div>
`;

    //--- Add nodes to page
    $("#footer").prepend(ButtonHtml);
    $("body").prepend(modalHtml);
    //--- Attach event to button
    // NOT NECESSARY, bootsrap creates event listeners automatically
    /*$(".button-group").find("button").click(function(evt){
        console.log("Click.", $('#myModal'));
        $('#myModal').modal("show");
    });   */
}
myFunc();

(function() {
    'use strict';
    //if(document.location.hash !== "#login"){

        var zte_service = null;
        var zte_device_info = null;
        var zte_device_info_init = null;
        var valid_ip = "";
        var hunter_handler = null;
        var ppp_status = null; //connected: "ppp_connected", disconnected: "ppp_disconnected"
        var ppp_loading = null;


        $("#txt_pattern").val(localStorage.zte_valid_ip || valid_ip);    
        $("#btn_init").click(function(){
            var valid_ip_val = $("#txt_pattern").val() || valid_ip;
             if(valid_ip_val !== ""){
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
                        $("#div_iphunt_logs").append("<span'>Reconnecting...</span><br/>");
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
                        $("#div_iphunt_logs").append("<span style='color: green;'>Success. Found IP: <strong>"+ e + "</strong></span><br/>");
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
                $("#div_iphunt_logs").append("<span><strong>Searching has stopped</strong></span><br/>");
                ppp_loading = null;
                clearInterval(hunter_handler);
            }
        }
        else{
          $("#div_iphunt_logs").empty();
          $("#div_iphunt_logs").append("<span style='color: red;'><strong>Invalid IP Patern</strong></span><br/>");
        }});
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