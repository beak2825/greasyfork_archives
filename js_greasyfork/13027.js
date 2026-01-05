// ==UserScript==
// @name         twitchplaysdark
// @namespace    https://greasyfork.org/en/scripts/13027-twitchplaysdark
// @version      0.50
// @description  twitchplaysdark controller
// @author       You
// @match        http://www.twitch.tv/twitchplaysdark
// @match        https://www.twitch.tv/twitchplaysdark
// @grant    GM_getValue
// @grant    GM_setValue
// @grant    GM_addStyle
// @require    http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @require     http://code.jquery.com/ui/1.9.2/jquery-ui.js
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/13027/twitchplaysdark.user.js
// @updateURL https://update.greasyfork.org/scripts/13027/twitchplaysdark.meta.js
// ==/UserScript==

GM_addStyle ( "\
.tpdb {\
  cursor:pointer;\
  position:absolute;\
  background: #999999;\
  background-image: -webkit-linear-gradient(top, #999999, #404040);\
  background-image: -moz-linear-gradient(top, #999999, #404040);\
  background-image: -ms-linear-gradient(top, #999999, #404040);\
  background-image: -o-linear-gradient(top, #999999, #404040);\
  background-image: linear-gradient(to bottom, #999999, #404040);\
  -webkit-border-radius: 10;\
  -moz-border-radius: 10;\
  border-radius: 10px;\
  font-family: Arial;\
  color: #ffffff;\
  font-size: 20px;\
  padding: 4px 2px 2px 2px;\
  text-decoration: none;\
  text-align:center;\
  height:30px;\
  width:30px;\
}\
.tpdb_v {\
-webkit-transform: rotate(-90deg);\
-moz-transform: rotate(-90deg);\
-ms-transform: rotate(-90deg);\
-o-transform: rotate(-90deg);\
filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=3);\
}\
.tpdb_u {\
-webkit-transform: rotate(-180deg);\
-moz-transform: rotate(-180deg);\
-ms-transform: rotate(-180deg);\
-o-transform: rotate(-180deg);\
filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=2);\
}\
\
.tpdb:hover {\
  background: #bfbfbf;\
  background-image: -webkit-linear-gradient(top, #bfbfbf, #969696);\
  background-image: -moz-linear-gradient(top, #bfbfbf, #969696);\
  background-image: -ms-linear-gradient(top, #bfbfbf, #969696);\
  background-image: -o-linear-gradient(top, #bfbfbf, #969696);\
  background-image: linear-gradient(to bottom, #bfbfbf, #969696);\
  text-decoration: none;\
}\
#TPD {\
   -moz-user-select: -moz-none;\
   -khtml-user-select: none;\
   -webkit-user-select: none;\
   -ms-user-select: none;\
   user-select: none;\
  position:absolute;\
  z-index:1000;\
  background:black;\
  border:1px solid #333;\
  -webkit-border-radius: 10;\
  -moz-border-radius: 10;\
  border-radius: 10px;\
  height:260px;\
  width:400px;\
  color:white;\
}\
.tpd_option{\
  cursor:pointer;\
}\
  #selectable .ui-selecting { background: #FECA40; }\
  #selectable .ui-selected { background: #F39814; color: white; }\
  #selectable { list-style-type: none; margin: 0; padding: 0;width: 40px;}\
#selectable li { height: 20px; width:20px; cursor:pointer; \
  padding: 0px 2px 2px 2px;\
  text-decoration: none;\
  text-align:center;\
-webkit-border-radius: 10;\
-moz-border-radius: 10;\
border-radius: 10px;\
border:1px solid #FFF;\
float: left;\
margin: 2px;\
}\
#tpd_multi{\
position:absolute;\
right:10px;\
top:55px;\
  -webkit-border-radius: 10;\
  -moz-border-radius: 10;\
  border-radius: 10px;\
}\
" );
window.setTimeout(jqueryLoaded, 10000);


function jqueryLoaded() {
    TPDNS = {
        sendCommand: function(cmd) {
            document.getElementsByClassName("chat_text_input")[0].focus();
            var val = $( cmd ).attr('id').replace('c_','');
            if(!$( "#tpd_target" ).prop('readonly'))
                if($( "#tpd_target" ).attr('checked'))
                    val = 't' + val;
                else
                    val = 'n' + val;

            var multi = $( '.ui-selected' ).first().attr('id');
            if(multi != 'x1')
                val = val + multi;

            console.log("cmd:" + val);
            $( '.chat_text_input' ).val($( '.chat_text_input' ).val()+val);
            if($( "#tpd_two" ).attr('checked')){
                if(this.first){
                    this.first = false;
                    $( '.chat_text_input' ).val($( '.chat_text_input' ).val()+'+');
                    return;
                }else
                    this.first = true;
            }
            try{
                document.getElementsByClassName("chat_text_input")[0].focus();
                TPDNS.eventFire(document.getElementsByClassName("chat_text_input")[0],'change');
                TPDNS.eventFire(document.getElementsByClassName("send-chat-button")[0],'click');
                //this.eventFire(a,'click');

            }catch(err){console.log(err);}
        },
        ts: function (cb) {
            if (cb.readOnly) cb.checked=cb.readOnly=false;
            else if (!cb.checked) cb.readOnly=cb.indeterminate=true;
        },
        first:true,
        val:'',
        eventFire :function(el, etype){
            if (el.fireEvent) {
                el.fireEvent('on' + etype);
            } else {
                var evObj = document.createEvent('Events');
                evObj.initEvent(etype, true, false);
                el.dispatchEvent(evObj);
            }
        }
    }
    unsafeWindow.TPDNS = cloneInto(TPDNS, unsafeWindow,{cloneFunctions: true});

    $('body').append('<div id="TPD"></div>');
    $( "#TPD" ).css("top",GM_getValue("top",0));
    $( "#TPD" ).css("left",GM_getValue("left",0));
    $( "#TPD" ).draggable();
    $( "#TPD" ).draggable('disable');
    $( '#TPD' ).mouseup(function() {
        var divOffset = $("#TPD").offset();
        GM_setValue("left", divOffset.left);
        GM_setValue("top", divOffset.top);
        console.log(divOffset.top + " , " + divOffset.left);
    });
    
    //checkboxes
    $( '#TPD' ).append('<div class=tpd_option style="position:absolute;top:10px;right:10px;"><input alt="Move this window" id=tpd_drag class=tpd_option type="checkbox" value="0"><label for=tpd_drag class=tpd_option>✣</label></div>');
    $( '#tpd_drag' ).click(function() {
        if($( "#tpd_drag" ).attr('checked'))
            $( "#TPD" ).draggable('enable');
        else
            $( "#TPD" ).draggable('disable');
           });
    $( '#TPD' ).append('<div class=tpd_option style="position:absolute;top:10px;right:27px;"><input alt="Target (n,t or none)" id=tpd_target class=tpd_option type="checkbox" value="0" onclick="window.TPDNS.ts(this)" readonly><label for=tpd_target class=tpd_option>⊚</label></div>');
    $( '#tpd_target' ).prop("indeterminate", true);
    
    $( '#TPD' ).append('<div class=tpd_option style="position:absolute;top:10px;right:44px;"><input alt="2 commands" id=tpd_two class=tpd_option type="checkbox" value="0"><label for=tpd_two class=tpd_option>2</label></div>');
    
    //directions
    $( '#TPD' ).append('<div id=c_f class=tpdb style="top:10px;left:50px;" onclick="window.TPDNS.sendCommand(this);">↑</div>');
    $( '#TPD' ).append('<div id=c_b class=tpdb style="top:90px;left:50px;" onclick="window.TPDNS.sendCommand(this);">↓</div>');
    $( '#TPD' ).append('<div id=c_l class=tpdb style="top:50px;left:10px;" onclick="window.TPDNS.sendCommand(this);">←</div>');
    $( '#TPD' ).append('<div id=c_r class=tpdb style="top:50px;left:90px;" onclick="window.TPDNS.sendCommand(this);">→</div>');
    $( '#TPD' ).append('<div id=c_fr class=tpdb style="top:10px;left:90px;" onclick="window.TPDNS.sendCommand(this);">↗</div>');
    $( '#TPD' ).append('<div id=c_fl class=tpdb style="top:10px;left:10px;" onclick="window.TPDNS.sendCommand(this);">↖</div>');
    $( '#TPD' ).append('<div id=c_br class=tpdb style="top:90px;left:90px;" onclick="window.TPDNS.sendCommand(this);">↘</div>');
    $( '#TPD' ).append('<div id=c_bl class=tpdb style="top:90px;left:10px;" onclick="window.TPDNS.sendCommand(this);">↙</div>');
    //flong
    $( '#TPD' ).append('<div id=c_flong class=tpdb style="top:50px;left:50px;" onclick="window.TPDNS.sendCommand(this);">↟</div>');
    
    //attacks
    $( '#TPD' ).append('<div id=c_l1 class=tpdb style="top:10px;left:140px;" onclick="window.TPDNS.sendCommand(this);">ᗢ</div>');
    $( '#TPD' ).append('<div id=c_l2 class=tpdb style="top:50px;left:140px;" onclick="window.TPDNS.sendCommand(this);">☇</div>');
    $( '#TPD' ).append('<div id=c_g class=tpdb style="top:50px;left:180px;" onclick="window.TPDNS.sendCommand(this);">✌</div>');
    $( '#TPD' ).append('<div id=c_u class=tpdb style="top:90px;left:140px;" onclick="window.TPDNS.sendCommand(this);">⚕</div>');
    $( '#TPD' ).append('<div id=c_r1 class=tpdb style="top:10px;left:180px;" onclick="window.TPDNS.sendCommand(this);">⚔</div>');
    $( '#TPD' ).append('<div id=c_r2 class=tpdb style="top:10px;left:220px;" onclick="window.TPDNS.sendCommand(this);">⚒</div>');
    $( '#TPD' ).append('<div id=c_ja class=tpdb style="top:50px;left:220px;" onclick="window.TPDNS.sendCommand(this);">☭</div>');
    
    //waiting
    $( '#TPD' ).append('<div id=c_hold class=tpdb style="top:10px;left:270px;" onclick="window.TPDNS.sendCommand(this);">⌛</div>');
    $( '#TPD' ).append('<div id=c_linger class=tpdb style="top:50px;left:270px;" onclick="window.TPDNS.sendCommand(this);">☕</div>');
    
    //rolls
    $( '#TPD' ).append('<div id=c_rf class=tpdb style="top:140px;left:50px;" onclick="window.TPDNS.sendCommand(this);"><div class=tpdb_v>↬</div></div>');
    $( '#TPD' ).append('<div id=c_rb class=tpdb style="top:220px;left:50px;" onclick="window.TPDNS.sendCommand(this);"><div class=tpdb_v>↫</div></div>');
    $( '#TPD' ).append('<div id=c_rl class=tpdb style="top:180px;left:10px;" onclick="window.TPDNS.sendCommand(this);">↫</div>');
    $( '#TPD' ).append('<div id=c_rr class=tpdb style="top:180px;left:90px;" onclick="window.TPDNS.sendCommand(this);">↬</div>');
    $( '#TPD' ).append('<div id=c_d class=tpdb style="top:180px;left:50px;" onclick="window.TPDNS.sendCommand(this);">↭</div>');
    
    $( '#TPD' ).append('<div id=c_rfl class=tpdb style="top:140px;left:10px;" onclick="window.TPDNS.sendCommand(this);"><div class=tpdb_v>↬</div></div>');
    $( '#TPD' ).append('<div id=c_rbl class=tpdb style="top:220px;left:10px;" onclick="window.TPDNS.sendCommand(this);"><div class=tpdb_v>↫</div></div>');
    $( '#TPD' ).append('<div id=c_rfr class=tpdb style="top:140px;left:90px;" onclick="window.TPDNS.sendCommand(this);"><div class=tpdb_v>↬</div></div>');
    $( '#TPD' ).append('<div id=c_rbr class=tpdb style="top:220px;left:90px;" onclick="window.TPDNS.sendCommand(this);"><div class=tpdb_v>↫</div></div>');
    
    //camera
    $( '#TPD' ).append('<div id=c_cu class=tpdb style="top:140px;left:180px;" onclick="window.TPDNS.sendCommand(this);"><div class=tpdb_v>↷</div></div>');
    $( '#TPD' ).append('<div id=c_cd class=tpdb style="top:220px;left:180px;" onclick="window.TPDNS.sendCommand(this);"><div class=tpdb_v>↶</div></div>');
    $( '#TPD' ).append('<div id=c_cl class=tpdb style="top:180px;left:140px;" onclick="window.TPDNS.sendCommand(this);"><div class=tpdb_u>↷</div></div>');
    $( '#TPD' ).append('<div id=c_cr class=tpdb style="top:180px;left:220px;" onclick="window.TPDNS.sendCommand(this);"><div class=tpdb_u>↶</div></div>');
    
    $( '#TPD' ).append('<div id=c_cul class=tpdb style="top:140px;left:140px;" onclick="window.TPDNS.sendCommand(this);">↖</div>');
    $( '#TPD' ).append('<div id=c_cur class=tpdb style="top:140px;left:220px;" onclick="window.TPDNS.sendCommand(this);">↗</div>');
    $( '#TPD' ).append('<div id=c_cdl class=tpdb style="top:220px;left:140px;" onclick="window.TPDNS.sendCommand(this);">↙</div>');
    $( '#TPD' ).append('<div id=c_clr class=tpdb style="top:220px;left:220px;" onclick="window.TPDNS.sendCommand(this);">↘</div>');
    
    //arrows
    $( '#TPD' ).append('<div id=c_aru class=tpdb style="top:180px;left:310px;" onclick="window.TPDNS.sendCommand(this);">▲</div>');
    $( '#TPD' ).append('<div id=c_ard class=tpdb style="top:220px;left:310px;" onclick="window.TPDNS.sendCommand(this);">▼</div>');
    $( '#TPD' ).append('<div id=c_arl class=tpdb style="top:220px;left:270px;" onclick="window.TPDNS.sendCommand(this);">◀</div>');
    $( '#TPD' ).append('<div id=c_arr class=tpdb style="top:220px;left:350px;" onclick="window.TPDNS.sendCommand(this);">▶</div>');
    
    $( '#TPD' ).append('<div id=c_e class=tpdb style="top:180px;left:350px;" onclick="window.TPDNS.sendCommand(this);">☑</div>');
    $( '#TPD' ).append('<div id=c_bs class=tpdb style="top:180px;left:270px;" onclick="window.TPDNS.sendCommand(this);">☒</div>');
    
    $( '#TPD' ).append('\
    <div id=tpd_multi><ol id="selectable">\
    <li id=x1 class="ui-widget-content ui-selected">x1</li>\
    <li id=x2 class="ui-widget-content">x2</li>\
    <li id=x3 class="ui-widget-content">x3</li>\
    <li id=x4 class="ui-widget-content">x4</li>\
    <li id=x5 class="ui-widget-content">x5</li>\
    </ol></div>');
    $( "#selectable" ).selectable();
    
    $( "#TPD" ).children("div").each(function() {
        if($(this).attr("id"))
        $( this ).attr( "title", $(this).attr("id").replace('c_','')) ;
    });
    $( "#TPD" ).tooltip();
}