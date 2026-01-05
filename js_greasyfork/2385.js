// ==UserScript==
// @name			Remove Gdajie 14 Secs Waiting Time 
// @author			哆啦B梦的弟弟
// @namespace        https://greasyfork.org/users/543
// @description		去除逛电驴14秒等待时间
// @version			2014.6.9
// @include			http://*verycd.gdajie.com/*
// @grant			none
// @downloadURL https://update.greasyfork.org/scripts/2385/Remove%20Gdajie%2014%20Secs%20Waiting%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/2385/Remove%20Gdajie%2014%20Secs%20Waiting%20Time.meta.js
// ==/UserScript==
function down(){
	var ed2k_links = 'ed2k://*';
	try {	
    	var ax = new ActiveXObject("IE2EM.IE2EMUrlTaker");
    	var emule_version = ax.GetEmuleVersion();
    	if ('e' != emule_version.substr(0, 1)) {
    		throw { errorCode: 'eMule not Installed.' };
    	}
    	
        ax.SendUrl(ed2k_links, 'dd', document.location);
        delete ax;
        return;
    } catch (e) {}

    //使用最旧的方法来批量新增下载
    if (!window.continueDown) {
    	window.location.href = ed2k_links ;
    } else {
    	alert("浏览器不兼容，请自行复制下载链接，并将链接粘贴到下载工具中进行下载！") ;
    }
}
document.getElementById('detail').style.display = 'none' ;
document.getElementById('predetail').style.display = 'block' ;
setTimeout("down();",0000);
setTimeout("document.getElementById('predetail').style.display = 'none' ;",0000);
setTimeout("document.getElementById('detail').style.display = 'block' ;",000);

