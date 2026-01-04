// ==UserScript==
// @name         flash-malurl
// @namespace    http://tampermonkey.net/
// @version      0.17
// @description  URL Project
// @author       XGL
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/379882/flash-malurl.user.js
// @updateURL https://update.greasyfork.org/scripts/379882/flash-malurl.meta.js
// ==/UserScript==

//
var script=document.createElement("script");
script.type="text/javascript";
script.src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js";
document.getElementsByTagName('head')[0].appendChild(script);

function doPost(target_url, data)
{
    var val1 = data;
    var val2 = "test1-fin";
$.ajax({
            url: target_url,
            type: "POST",
            crossDomain: true,
            data:{'convurl_ident':val1, 'key2':val2},
            //dataType: "json",
            /*
            success: function (response) {
                //var resp = JSON.parse(response)
                alert(response);
                console.log("succ=", response);

            },
            error: function (xhr, status) {
                if(xhr.readyState == 4){
                    if(xhr.status == 200){
                        //actually we got them but in error
                        console.log("---actual-success:", xhr.responseText);
                    }
                        
                }
                alert("error\n" + xhr + '\n' + status);
                console.log("err-xhr=", xhr, "\n", "status=", status);
            }*/
            complete: function (xhr, status) {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var rslt = xhr.responseText;
                    console.log("succ=", rslt);
                }
                else {
                    console.log("ERR=", xhr);
                    console.log("stat=", status)
                
                //...
                }
}
        });
}

$(document).ready(function(){
		var v1 = window.location.href;
		var srv = "https://192.168.193.170:19420";
		doPost(srv, v1);
		//alert('posted url='+v1);
		console.log('posted url='+v1);

});
