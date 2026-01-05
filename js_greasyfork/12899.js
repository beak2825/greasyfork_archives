// ==UserScript==
// @name         A9AV XXed
// @namespace    https://greasyfork.org/zh-CN/scripts/12899-a9av-xxed
// @version      2015.10.19
// @description  Replace the player and crack the hidden video
// @author       love336
// @match        http://www.hongfange.me/forum.php?mod=viewthread&tid=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12899/A9AV%20XXed.user.js
// @updateURL https://update.greasyfork.org/scripts/12899/A9AV%20XXed.meta.js
// ==/UserScript==

var embed = document.getElementsByTagName('embed');     //检查播放器是否存在
if (embed.length) {     //存在
    var url = embed[0].getAttribute("flashvars").match(/.+(?=&v=100)/);   //获取flashvars属性内容
    insertCode(embed[0], 'flashvars="' + url + '"');
    embed[1].parentNode.removeChild(embed[1]);    //在原embed之前插入了新embed，所以原embed变为第二个，删除
}
else {    //不存在
    var id = document.getElementsByTagName("strong")[0].innerHTML.match(/.+(?=\.jpg)/);    //从预览图片名获取视频文件名
    insertCode(document.querySelector(".locked"), 'flashvars="f=http://awsdfe34fg214fdg324g1.zicdn.com/videowm/' + id + '.flv"');
}

function insertCode(target, flashvars) {
    var code = document.createElement("div");     //创建插入的容器
    code.innerHTML = '<embed src="http://ad-ckplayer.webatu.com/ckplayer/ckplayer.swf" ' +     //插入代码
        flashvars +
        ' quality="high" width="800" height="500" align="middle" allowScriptAccess="always" allowFullscreen="true" ' +
        'type="application/x-shockwave-flash">';
    target.parentNode.insertBefore(code, target);     //插入code的代码到target之前
}
