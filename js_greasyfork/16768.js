// ==UserScript==
// @name         MLP Emotions in NGA
// @namespace    https://greasyfork.org/zh-CN/scripts/16768-mlp-emotions-in-nga
// @version      1.08.2
// @description  在NGA发帖框中增加MLP系列表情，所有图片来自于Reddit.com的 /r/mylittlepony/ 版面的签名，图片版权属于美国孩之宝公司
// @author       Lyragosa
// @require      http://cdn.bootcss.com/jquery/1.10.2/jquery.min.js
// @include      /^http://(bbs\.ngacn\.cc|nga\.178\.com|bbs\.nga\.cn|bbs\.bigccq\.cn)/(read\.php|post\.php)/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16768/MLP%20Emotions%20in%20NGA.user.js
// @updateURL https://update.greasyfork.org/scripts/16768/MLP%20Emotions%20in%20NGA.meta.js
// ==/UserScript==
/* jshint -W097 */


var mlp_e = [
    //======apple jack
'./mon_201602/02/-654138_56b047fd9ef10.png',
'./mon_201602/02/-654138_56b047ee6a73a.png',
'./mon_201602/02/-654138_56b047efdb41e.png',
'./mon_201602/02/-654138_56b047f101b76.png',
'./mon_201602/02/-654138_56b047f1591ff.png',
'./mon_201602/02/-654138_56b0480b53c21.png',
'./mon_201602/02/-654138_56b048326032a.png',
'./mon_201602/02/-654138_56b048310e68e.png',
'./mon_201602/02/-654138_56b0481035f60.png',
'./mon_201602/02/-654138_56b04837beb0d.png',
'./mon_201602/02/-654138_56b0481988faf.png',
'./mon_201602/02/-654138_56b047f630d8a.png',
'./mon_201602/02/-654138_56b0481719e64.png',
'./mon_201602/02/-654138_56b04811e7f4e.png',
'./mon_201602/02/-654138_56b0481e39a28.png',
'./mon_201605/19/-654138_573d2be642693.png',
    //======fluttershy
'./mon_201602/02/-654138_56b0480fce166.png',
'./mon_201602/02/-654138_56b047ef22acb.png',
'./mon_201602/02/-654138_56b047e93e0b0.png',
'./mon_201602/02/-654138_56b047f6908e1.png',
'./mon_201602/02/-654138_56b048079cc21.png',
'./mon_201602/02/-654138_56b048227aced.png',
'./mon_201602/02/-654138_56b0480c0b3e9.png',
'./mon_201602/02/-654138_56b04804ee49b.png',
'./mon_201602/02/-654138_56b0480a3dfff.png',
'./mon_201602/02/-654138_56b0482212cd1.png',
'./mon_201602/02/-654138_56b04808e502e.png',
'./mon_201602/02/-654138_56b0481468fb5.png',
'./mon_201602/02/-654138_56b0481aa31a8.png',
'./mon_201602/02/-654138_56b048140bbc7.png',
'./mon_201602/02/-654138_56b048375c0ed.png',
'./mon_201602/02/-654138_56b0482c4e25f.png',
    //======pinkie pie
'./mon_201602/02/-654138_56b047f445d94.png',
'./mon_201602/02/-654138_56b047ef7d3b7.png',
'./mon_201602/02/-654138_56b047f8db7d3.png',
'./mon_201602/02/-654138_56b04826a0e50.png',
'./mon_201602/02/-654138_56b047e8d3ec9.png',
'./mon_201602/02/-654138_56b047fa6f147.png',
'./mon_201602/02/-654138_56b047eebfe65.png',
'./mon_201602/02/-654138_56b047feb1021.png',
'./mon_201602/02/-654138_56b048003c90e.png',
'./mon_201602/02/-654138_56b04825af0df.png',
'./mon_201602/02/-654138_56b04803d9900.png',
'./mon_201602/02/-654138_56b048093f026.png',
'./mon_201602/02/-654138_56b04805edd1a.png',
'./mon_201602/02/-654138_56b048139f6de.png',
'./mon_201602/02/-654138_56b0481ea2dca.png',
'./mon_201602/02/-654138_56b04812975ff.png',
'./mon_201602/02/-654138_56b0480e5c890.png',
    //======rainbow dash
'./mon_201602/02/-654138_56b047ea4a003.png',
'./mon_201602/02/-654138_56b047f2ca684.png',
'./mon_201602/02/-654138_56b047f566132.png',
'./mon_201602/02/-654138_56b047fb831c1.png',
'./mon_201602/02/-654138_56b04806a50bc.png',
'./mon_201602/02/-654138_56b04814cf12d.png',
'./mon_201602/02/-654138_56b04815975e2.png',
'./mon_201602/02/-654138_56b0481a528ed.png',
'./mon_201602/02/-654138_56b047fc3c51c.png',
'./mon_201602/02/-654138_56b0481192bc2.png',
'./mon_201602/02/-654138_56b0482e8be91.png',
'./mon_201602/02/-654138_56b04831e734c.png',
'./mon_201602/02/-654138_56b0482196643.png',
'./mon_201602/02/-654138_56b0482a7e76f.png',
'./mon_201602/02/-654138_56b0481905241.png',
'./mon_201602/02/-654138_56b0481c704fe.png',
    //======rarity
'./mon_201602/02/-654138_56b04803766a2.png',
'./mon_201602/02/-654138_56b047f38593f.png',
'./mon_201602/02/-654138_56b0482b73020.png',
'./mon_201602/02/-654138_56b04822f3a95.png',
'./mon_201602/02/-654138_56b0480d19e75.png',
'./mon_201602/02/-654138_56b0480443a25.png',
'./mon_201602/02/-654138_56b0480992c3d.png',
'./mon_201602/02/-654138_56b047ed87be3.png',
'./mon_201602/02/-654138_56b0480ca8382.png',
'./mon_201602/02/-654138_56b0480499d4e.png',
'./mon_201602/02/-654138_56b048059febc.png',
'./mon_201602/02/-654138_56b048054e21a.png',
'./mon_201602/02/-654138_56b04800952d9.png',
'./mon_201602/02/-654138_56b04827e5451.png',
'./mon_201602/02/-654138_56b048359d034.png',
'./mon_201602/02/-654138_56b0482f1e88f.png',
'./mon_201602/02/-654138_56b0480dc8750.png',
'./mon_201602/02/-654138_56b0480f25602.png',
'./mon_201605/19/-654138_573d2be575ed1.png',
    //======twilight sparkle
'./mon_201602/02/-654138_56b0481890cc9.png',
'./mon_201602/02/-654138_56b048064d6aa.png',
'./mon_201602/02/-654138_56b04828bf2f3.png',
'./mon_201602/02/-654138_56b0482934fc0.png',
'./mon_201602/02/-654138_56b0482e2461d.png',
'./mon_201602/02/-654138_56b0480a96680.png',
'./mon_201602/02/-654138_56b048084458d.png',
'./mon_201602/02/-654138_56b0483349c0b.png',
'./mon_201602/02/-654138_56b0482f87bf7.png',
'./mon_201602/02/-654138_56b0482ae4c51.png',
'./mon_201602/02/-654138_56b048027dfba.png',
'./mon_201602/02/-654138_56b048209c447.png',
'./mon_201602/02/-654138_56b0481f324ed.png',
'./mon_201602/02/-654138_56b047f331cf4.png',
'./mon_201602/02/-654138_56b0482a1e8a4.png',
'./mon_201605/19/-654138_573d2be6a2d91.png',
    //======royal mare
'./mon_201602/02/-654138_56b047f0a1a3a.png',
'./mon_201602/02/-654138_56b047ec4883e.png',
'./mon_201602/02/-654138_56b0480d7281c.png',
'./mon_201602/02/-654138_56b0481cc0253.png',
'./mon_201602/02/-654138_56b04816635f5.png',
'./mon_201602/02/-654138_56b048308ce2c.png',
'./mon_201602/02/-654138_56b047eca3d77.png',
'./mon_201602/02/-654138_56b0481fa1284.png',
'./mon_201602/02/-654138_56b0482028cab.png',
'./mon_201602/02/-654138_56b0480194362.png',
'./mon_201602/02/-654138_56b04825426c6.png',
    //======cutie mark crusaders
'./mon_201602/02/-654138_56b047eab8d77.png',
'./mon_201602/02/-654138_56b04810918e3.png',
'./mon_201602/02/-654138_56b04829ac59f.png',
'./mon_201602/02/-654138_56b048021e86b.png',
'./mon_201602/02/-654138_56b047e87b0cf.png',
'./mon_201602/02/-654138_56b04834382ee.png',
'./mon_201602/02/-654138_56b0481246d26.png',
'./mon_201602/02/-654138_56b047f9a5c9f.png',
'./mon_201602/02/-654138_56b047f6f0044.png',
'./mon_201602/02/-654138_56b047fbdac18.png',
'./mon_201602/02/-654138_56b047f801f78.png',
'./mon_201602/02/-654138_56b047e990c7d.png',
'./mon_201602/02/-654138_56b047fb22acd.png',
'./mon_201602/02/-654138_56b0480f7998e.png',
'./mon_201602/02/-654138_56b047fca0a6a.png',
'./mon_201602/02/-654138_56b04807eb20b.png',
'./mon_201602/02/-654138_56b04800e6baf.png',
'./mon_201602/02/-654138_56b047f50a879.png',
'./mon_201602/02/-654138_56b04824562fc.png',
'./mon_201602/02/-654138_56b0481537736.png',
'./mon_201602/02/-654138_56b047fe5eba1.png',
    //======villains
'./mon_201602/02/-654138_56b047fd01f83.png',
'./mon_201602/02/-654138_56b04803278ea.png',
'./mon_201602/02/-654138_56b047ed2139b.png',
'./mon_201602/02/-654138_56b047f1f3e76.png',
'./mon_201602/02/-654138_56b047e9e5417.png',
'./mon_201602/02/-654138_56b0481602b7a.png',
'./mon_201602/02/-654138_56b0482d9a52b.png',
'./mon_201605/19/-654138_573d2be5bd375.png',
'./mon_201602/02/-654138_56b047eb232ea.png',
'./mon_201602/02/-654138_56b047f87343f.png',
'./mon_201602/02/-654138_56b0480894713.png',
'./mon_201602/02/-654138_56b04802cc16d.png',
    //======spike
'./mon_201602/02/-654138_56b0480ba2576.png',
'./mon_201602/02/-654138_56b0482d34872.png',
'./mon_201602/02/-654138_56b0480c599b5.png',
'./mon_201602/02/-654138_56b0483003abf.png',
'./mon_201602/02/-654138_56b0480ebc7b8.png',
'./mon_201602/02/-654138_56b047f939e11.png',
'./mon_201602/02/-654138_56b048112fa14.png',
'./mon_201602/02/-654138_56b04834b88ee.png',
'./mon_201602/02/-654138_56b047f5d13cc.png',
'./mon_201602/02/-654138_56b047fdefc36.png',
'./mon_201602/02/-654138_56b047eb831d5.png',
'./mon_201602/02/-654138_56b048352e638.png',
    //======other ponies
'./mon_201602/02/-654138_56b047f7543bd.png',
'./mon_201602/02/-654138_56b047f27b8aa.png',
'./mon_201602/02/-654138_56b048134f9d6.png',
'./mon_201602/02/-654138_56b048271b9ab.png',
'./mon_201602/02/-654138_56b04832cd549.png',
'./mon_201602/02/-654138_56b0481c15fb4.png',
'./mon_201602/02/-654138_56b04817cf4ae.png',
'./mon_201602/02/-654138_56b04827860a0.png',
'./mon_201602/02/-654138_56b048176d22f.png',
'./mon_201602/02/-654138_56b04836a9f0e.png',
'./mon_201602/02/-654138_56b047ffcdd14.png',
'./mon_201602/02/-654138_56b047f4a2dac.png',
'./mon_201602/02/-654138_56b0481db75ec.png',
'./mon_201602/02/-654138_56b0481b59d9c.png',
'./mon_201602/02/-654138_56b0482bdcb8d.png',
'./mon_201602/02/-654138_56b04816b79d2.png',
'./mon_201602/02/-654138_56b047ee0794b.png',
'./mon_201602/02/-654138_56b047ebddf1b.png',
'./mon_201602/02/-654138_56b047ff12138.png',
'./mon_201602/02/-654138_56b048262de2f.png',
'./mon_201602/02/-654138_56b048317e3e7.png',
'./mon_201602/02/-654138_56b047f046188.png',
'./mon_201602/02/-654138_56b047f3df6bb.png',
'./mon_201602/02/-654138_56b0480145dc2.png',
'./mon_201602/02/-654138_56b0481b0272f.png',
'./mon_201602/02/-654138_56b047fac0680.png',
'./mon_201602/02/-654138_56b047ff74f2d.png',
'./mon_201602/02/-654138_56b04806f2eb8.png',
'./mon_201602/02/-654138_56b04823d32fd.png',
'./mon_201602/02/-654138_56b0482cbfa6f.png',
'./mon_201602/02/-654138_56b048074ea26.png',
'./mon_201602/02/-654138_56b048284ab7b.png',
'./mon_201602/02/-654138_56b04812efc07.png',
'./mon_201602/02/-654138_56b0481d3ffcd.png',
'./mon_201602/02/-654138_56b04833d3738.png',
'./mon_201602/02/-654138_56b0481bb278f.png',
'./mon_201602/02/-654138_56b04821259a8.png',
'./mon_201602/02/-654138_56b048361211b.png',
'./mon_201602/02/-654138_56b04824cc1e2.png',
'./mon_201602/02/-654138_56b0482367857.png',
'./mon_201605/19/-654138_573d2be6eb5ec.png',
'./mon_201605/19/-654138_573d2be738673.png',
    //======others
'./mon_201602/02/-654138_56b04819dac19.png',
'./mon_201602/02/-654138_56b047fa163b6.png',
'./mon_201602/02/-654138_56b0480b04e3f.png',
'./mon_201602/02/-654138_56b04809e34d0.png',
'./mon_201605/19/-654138_573d2be531cff.png',
];

/*
// CSS3 动画过滤器
// 好麻烦以后再弄……
var stylesheet = document.createElement('style');
stylesheet.innerHTML = '\
	@-webkit-keyframes poptip {} \
	@-moz-keyframes poptip {} \
	@keyframes poptip {} \
	div.single_ttip2 { \
		-webkit-animation: poptip; \
		-moz-animation: poptip; \
		animation: poptip; \
	} \
';
document.head.appendChild(stylesheet);

function removedis (event) {
	if (event.animationName === 'removedis' && event.target.classList.contains('single_ttip2')) {
      event.target.innerHTML;  
    }
}
*/

function m() {
   $("#xoxoxxxoxoxxoo").find("tr").eq(3).find("td.c2").append('&nbsp;<button title="MLP Emotions" id="mlp_emotions_btn" type="button" style="">MLP Emotions</button>'); 
}

function s() {

    //临时方案
    //因为post框延时拉入。
    setTimeout(function () {

           $("div.single_ttip2").eq(1).find("table.forumbox").find("tr").eq(2).find("td.c2").append('&nbsp;<button title="MLP Emotions" id="mlp_emotions_btn" type="button" style="">MLP Emotions</button>'); 
    },800);

}

m();

//console.log($("a[href^='http://bbs.ngacn.cc/post.php?action=quote&_newui']").length());

$("body").on("click","a[href^='/post.php?action=quote&_newui']",function(e) {
    console.log("quote click");
    s();
})

$("body").on("click","#mlp_emotions_btn",function(e) {
    	postfunc.dialog.createWindow('uiAddTag')
        postfunc.dialog.w.style.display='none'
        postfunc.dialog.w._.addContent(null)
        postfunc.dialog.w._.addTitle('MLP Emotions')
        
        var tmp = ''
        tmp += "<div style='width:1000px;height:1060px'>" 
        for (var k in mlp_e) {
            tmp += "<img src='http://img.ngacn.cc/attachments/"+mlp_e[k]+"' onclick='postfunc.dialog.w._.hide();postfunc.addText(\"[img]"+mlp_e[k]+"[/img]\")' />"
        }
        tmp += "</div>"
        postfunc.dialog.w._.addContent(tmp)
        postfunc.dialog.w._.show(e)
})

