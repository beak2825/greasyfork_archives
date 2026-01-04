// ==UserScript==
// @author       nht.ctn
// @name         VPN'siz Vikipedi ve Imgur
// @name:eng     Wikipedia and Imgur Without VPN
// @version      1.4
// @name         VPN'siz Vikipedi ve Imgur
// @namespace    https://github.com/nhtctn
// @description  Wikipedia sayfaları için Wikiwand'a ve Imgur fotoğrafları için Imgurp'a yönlendirerek içeriğe erişebilmenizi sağlar. Bu hizmetin asıl sahibi olan sunucu sahiplerine teşekkürler.
// @description:eng  It helps you to access to Wikipedia content via redirecting to Wikiwand and Imgur Images via redirecting Imgurp. The real heroes are domain owners, thanks them.
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuOWwzfk4AAANASURBVGhD7ZntjeJAEEQhCtIgC1IgAzIgBSIgCCIgBEIgBaLAt887tWp6e77MD3tPWHo6H66Z6eruGVvaVel6Pp/DEkjhtF3RBEsihRlf0YAlksJ9vSLhkklhf1+R4C+Qwv8YmI0/Hbz4GJibj4G5+TGw2+2G7XY7wv1+v3/BPj8ej+OYVv3tdhsul0tWL21tXum4V9w/BliECRCs1+uQzWYznE6nUcuY6/U6HA6HF83XwTbCPc8IHO39fh/O5/MYhNfzG8/Q5OYFrS8d/Gqhx+MxGlEQdjDPvB4Ikud2DAtFWha3SSLwSAfMIR0mo/XDPYCQMmkw2LJFYBqdKqB28Ni50eSSAiQGHcmxWbdkNzFltFkla6XFaCub2VzF0PEMbS4oQXVYP1dNyBpgcfpQGQVMRVqhKoioPQiGubQ3crC+Nq32XETWANjeBiaLdEL9jTaqgrKf62cLyWKeXCuKogFlQQaglA3wVbDl18nSkn32CWZrVS8aANrABoShSCeoAgujxbCqgHF+qx0G0KOtGmBxtYWobT5/hlOV1oyCjs9apaBqANQWMlDLjKqAlnGqCMYivYWEoa/tN9FkwLaFYKFIKzApA8D4WuVALVt6wVmaDAABKRioZZNgpcUIBmqmQdlv0UKzAR2BCqolIG+6diTS85gtvbg8zQaAzBCIWqO2kN/MjC+1ESdca6VElwFOEAWDidJGsy1kyVWBCjNny0a3dBkA30a5zab2oS2kB7IcVUH6lo1u6TZAwGRKRC82vYiUTZ1IwO++9VQtdPb3FroNgKpAQNz7F47vZdtOjPF7QXulN/swyQAZVDbBZk4niW8ttYjQc0xitvaJkmOSAS1KoKoCbcMzAonOcbWVkEafDRrfyyQDwGmiKvAvgZBV/h99wxCsP1bRY6R0mtWYbIB+VQVUBbWCz76wxzCoipHhViYbIEjf11D62tQYazxqtx4mGwDf1y0vIf9e8Ju9l7cMkDlahkBoh5ZvfVs5xkw5Oi1vGQAdm7UPNYs2e8+YHG8bIIME0nMMUgXaberRaXnbwNx8Vf/zN7LZSOH/Bwa4IsGSSWG/XpFwiaRw4ysasCRSmG1XNMEcpHCCa7X6BxTCsFZwcxMpAAAAAElFTkSuQmCC

// @include      *

// @downloadURL https://update.greasyfork.org/scripts/375382/VPN%27siz%20Vikipedi%20ve%20Imgur.user.js
// @updateURL https://update.greasyfork.org/scripts/375382/VPN%27siz%20Vikipedi%20ve%20Imgur.meta.js
// ==/UserScript==

(function() {
    'use strict';

	changeLinks();
	
	function changeLinks() {
		wikiToWikiwand_href( document.querySelectorAll('[href*="wikipedia.org/wiki/"]') );
		imgur_src( document.querySelectorAll('[src*="i.imgur.com/"]'), "imgur" );

		setTimeout(function(){
			changeLinks();
		}, 3000);
	}


    function wikiToWikiwand_href( links ) {
        for ( var x = 0; x < links.length; x++ ) {
            var target = links[x].href;
            var newTarget = target.replace(/(https|http):\/\/(.+)\.wikipedia.org\/wiki\/(.+)/, "https://www.wikiwand.com/$2/$3");
            links[x].setAttribute("href", newTarget);
        }
    }

    function imgur_src( links, site ) {
        for (var x = 0; x < links.length; x++) {
            var target = links[x].src;
            var newTarget = target.replace(site, "imgurp");
            links[x].setAttribute("src", newTarget);
        }
    }

})();