// ==UserScript==
// @name        website_zk8_audio
// @namespace   http://www.ibm.com/developerworks/cn/
// @description website_zk8_audio_by_laojiang
// @include     http://zk8.com.cn/modules.php?app=wiki_*       
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/11400/website_zk8_audio.user.js
// @updateURL https://update.greasyfork.org/scripts/11400/website_zk8_audio.meta.js
// ==/UserScript==


//  Main过程开始////////////////
var zk8_p = document.getElementsByTagName("p");
for (var i = 0 ; i < zk8_p.length ; i++) {
        console.warn("zk8_p["+String(i)+"]的内容为:",zk8_p[i].innerHTML);
        var zk8_aduio = zk8_p[i].getElementsByTagName("audio");	   
        //console.warn(zk8_aduio.length);
	        if (zk8_aduio.length != 0){
		        for(k = 0 ; k < zk8_aduio.length ; k++){
			         //在词义后边加上空格,以保证美观.
			         zk8_p[i].innerHTML = zk8_p[i].innerHTML+"&nbsp;&nbsp;";
		             zk8_p[i].appendChild(zk8_aduio[k]);
		        }

	        }
	        else{

	        }
	        
     
    }

//  Main过程结束////////////////