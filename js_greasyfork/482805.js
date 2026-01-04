// ==UserScript==
// @name       				拳打李未，脚踢冰寒
// @version    				4.7.1
// @author                  Le_le
// @description              拳打李未，脚踢冰寒ƪ(˘⌣˘)ʃ
// @license    				MIT
// @match      				*://*.zhihuishu.com/*
// @match      				*://*.chaoxing.com/*
// @match      				*://*.edu.cn/*
// @match      				*://*.org.cn/*
// @match      				*://*.xueyinonline.com/*
// @match      				*://*.hnsyu.net/*
// @match      				*://*.qutjxjy.cn/*
// @match      				*://*.ynny.cn/*
// @match      				*://*.icve.com.cn/*
// @match      				*://*.course.icve.com.cn/*
// @match      				*://*.courshare.cn/*
// @match      				*://*.zjy2.icve.com.cn/*
// @match      				*://*.zyk.icve.com.cn/*
// @match      				*://*.icourse163.org/*
// @grant      				GM_info
// @grant                   GM_registerMenuCommand
// @run-at     				document-end
// @namespace  				https://enncy.cn
// @homepage   				https://docs.ocsjs.com
// @source     				https://github.com/ocsjs/ocsjs
// @icon       				https://cdn.ocsjs.com/logo.png
// @downloadURL https://update.greasyfork.org/scripts/482805/%E6%8B%B3%E6%89%93%E6%9D%8E%E6%9C%AA%EF%BC%8C%E8%84%9A%E8%B8%A2%E5%86%B0%E5%AF%92.user.js
// @updateURL https://update.greasyfork.org/scripts/482805/%E6%8B%B3%E6%89%93%E6%9D%8E%E6%9C%AA%EF%BC%8C%E8%84%9A%E8%B8%A2%E5%86%B0%E5%AF%92.meta.js
// ==/UserScript==
(function () {
    GM_registerMenuCommand('翻转视频',rotatevideo)
})();
function rotatevideo(){
    var video = document.getElementsByTagName('iframe')[0];
    console.log(video);
    if(video.style.transform=='rotate(180deg)'){
        video.style.transform='rotate(0deg)';
    }
    else{
        video.style.transform='rotate(180deg)';
    }
    video.style.transition = 'all 1s';
}