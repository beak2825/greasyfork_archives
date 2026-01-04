// ==UserScript==
// @name            百欧工具箱1.0.1
// @namespace       https://github.com/sdokio
// @version         1.1.1
// @author          SoyaDokio
// @description     工具箱
// @homepage        https://github.com/sdokio/UserScript
// @icon            data:image/ico;base64,AAABAAEAEBAAAAEACABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAAAAAABILAAASCwAAAAEAAAAAAAAwWxYAMFwYADVfHAA3YR8AOGEgADpkIwBAaCkARGsuAEpwNABQdTsAYIFOAGmIVwBqiVgAbItbAHOQYgB4lGgAhJ51AIafeACHoHgAiKF5AI6mgACSqYUAlKuIAJqvjQChtZgApLeZAKa5mwCnup0Aq7yiALLCqQC5x7EAucixALzKtAC+zLcAwM66AMPQvgDI1MIAytXEANDaygDU3c8A1d7QANjg1ADc49gA4ObcAOLo3wDn7OUA6u7nAPT28wD5+vgA/P38AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGBgYHCIaGhoYGhocJzExMQQDAAATKwoAAwEBAQEJKDEEAgACEikvCgABAQEBAQYuBAAAABUiMTAEAQEBAQECEwQBAAETHjExDwYWIiYgJgYEAwAABy4iMRcqHR4nLQ4EBAIAAgAUIhUVFC0xMSEBAwQAAAgVHQ0ABB0xMRsDAQMEAw8vMTEVBAYQCwQAAAAEBAoxMTEdJQ0iGSQDAwAABAQrKSQkJA8SMS0jCwAAAQQKEAwOCwQBCjExHxQBAAIEGAAAAQEBAQEnMSQUAQEBAzEGAwEBAQEBBiwtEQEBAQMxJA4EAgABAQEFGhYBAQEDMTExLSkoJycnJycpJygnKAAAPUMAAFByAAByYQAARmkAAHMAAABNbwAAbGUAAHRoAAA6XAAATkQAAFNcAABzdAAAMzIAAGluAAB3cwAAd2U=
// @supportURL      https://github.com/sdokio/UserScript/issues/new/choose
// @license         MIT
 
// @match           *://*.xinshangmeng.com/eciop/orderForCC/cgtListForCC.htm*
// @match           *://*.xinshangmeng.com/eciop/orderForCC/cgtCartForCC.htm*
// @match        http://ah.xinshangmeng.com:8081/eciop/orderForCC/cgtListForCC.htm?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xinshangmeng.com
// @run-at          document-idle
// @require      https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @grant           GM_addStyle
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_xmlhttpRequest
 
// @note            2023.3.27初版发布
// @downloadURL https://update.greasyfork.org/scripts/462691/%E7%99%BE%E6%AC%A7%E5%B7%A5%E5%85%B7%E7%AE%B1101.user.js
// @updateURL https://update.greasyfork.org/scripts/462691/%E7%99%BE%E6%AC%A7%E5%B7%A5%E5%85%B7%E7%AE%B1101.meta.js
// ==/UserScript==

(function() {
    'use strict';
       // Your code here...

        $("#qd-banner").append('<input type="button" id="btu" value="批量++加加" height="50px" style="display: inline-block;height:30px;width: 90px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="button" id="ccc" value="批量--减减" style="display: inline-block;height:30px;width: 90px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="button" id="yijiancaozuo" value="一键操作" disabled="disabled" style="display: inline-block;height:30px;width: 90px;">');
        $("#btu").click(abc);
        $("#ccc").click(cba);
        $("#yijiancaozuo").click(yijiancaozuo);
        function abc(){
        $(".adda").mouseover();
        $(".adda").click();

        $(".adda").mouseout();
        }
        function cba(){
        $(".suba").click()
        }
    //-----------------------------------------------------------------------------------
function yijiancaozuo(){


$(".adda[bs!=1]").each(function(i,m,t){
    t = $(this).attr('bs','1');
    m = t.closest('li');
    //--------------------
$(this).mouseover();
$(this).click();
$(this).mouseout();
    let p=parseFloat(m.find('.cgt-col-qtl-lmt').text());
   //---------------------

    //-------------------------------------
    m.find(".xsm-order-list-shuru-input").focus()
    m.find(".xsm-order-list-shuru-input").val(p);
    m.find(".xsm-order-list-shuru-input").blur();

    //-------------------------------------
//m.find('.xsm-order-list-shuru-input').val(p);

});

$("#smt").click();
}
//-----------------------------------------------------------------------------------------
})();