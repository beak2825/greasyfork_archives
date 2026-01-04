// ==UserScript==
// @name         MtoG
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  修正校园网流量显示错误的问题
// @author       xujingguo
// @include      http*://ipgw.neu.edu.cn/srun_portal_pc.php?url=&ac_id=1
// @include      http*://ipgw.neu.edu.cn/srun_portal_pc.php?ac_id=1&
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36575/MtoG.user.js
// @updateURL https://update.greasyfork.org/scripts/36575/MtoG.meta.js
// ==/UserScript==

(function() {
    	var t = setTimeout(function(){
		var flux = $("#sum_bytes").html();
		//var flux = " 22380.78M";
		var pat = /\*M/i;
		var newFlux = flux.slice(0,flux.length-1);
		newFlux = parseFloat(newFlux);
		if(pat.test(pat) && newFlux > 1024)
			newFlux = newFlux * 1000 * 1000;
			newFlux = newFlux/(1024 * 1024 * 1024);
			newFlux = newFlux.toFixed(3);
            newFlux = newFlux+"G";
            //$("#sum_bytes").html(newFlux);
            $("#sum_bytes").css("text-decoration","line-through","color","red");
            $("<span> "+newFlux+"</span>").insertAfter($("#sum_bytes"));
			//alert(newFlux);
	},3000);
})();