// ==UserScript==
// @name         SINoALICE Emotions in NGA
// @namespace    https://greasyfork.org/zh-CN/scripts/30603-sinoalice-emotions-in-nga/code
// @version      1.1
// @icon         http://nga.178.com/favicon.ico
// @description  在NGA发帖框中增加SINoALICIE游戏内置表情，所有图片来自于Square Enix公司的SINoALICE游戏，图片版权属于Square Enix公司。
// @copyright    Lyragosa
// @require      http://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.2.1.js
// @include      /^http://(bbs\.ngacn\.cc|nga\.178\.com|bbs\.nga\.cn|bbs\.bigccq\.cn)/(read\.php|post\.php)/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30603/SINoALICE%20Emotions%20in%20NGA.user.js
// @updateURL https://update.greasyfork.org/scripts/30603/SINoALICE%20Emotions%20in%20NGA.meta.js
// ==/UserScript==


var alice = [
'./mon_201706/15/-3wczfQspzd-cum9K1kToS3k-3k.png',
'./mon_201706/15/-3wczfQab92-dok8K1jToS3k-3k.png',
'./mon_201706/15/-3wczfQab92-j56uK1kToS3k-3k.png',
'./mon_201706/15/-3wczfQab92-3c9lK1iToS3k-3k.png',
'./mon_201706/15/-3wczfQab92-90goK1iToS3k-3k.png',
'./mon_201706/15/-3wczfQab92-eh55K1iToS3k-3k.png',
'./mon_201706/15/-3wczfQab92-jwcoK1jToS3k-3k.png',
'./mon_201706/15/-3wczfQab92-3wkgK1iToS3k-3k.png',
'./mon_201706/15/-3wczfQab92-9ep1K1jToS3k-3k.png',
'./mon_201706/15/-3wczfQab92-eu3aK1hToS3k-3k.png',
'./mon_201706/15/-3wczfQab92-k97oK1jToS3k-3k.png',
'./mon_201706/15/-3wczfQab92-4hh8K1kToS3k-3k.png',
'./mon_201706/15/-3wczfQab92-aaxgK1kToS3k-3k.png',
'./mon_201706/15/-3wczfQab92-fpmeK1fToS3k-3k.png',
'./mon_201706/15/-3wczfQab92-l6bfK1kToS3k-3k.png',
'./mon_201706/15/-3wczfQsq2o-5ak7K1iToS3k-3k.png',
'./mon_201706/15/-3wczfQsq2o-ge09K1kToS3k-3k.png',
'./mon_201706/15/-3wczfQsq2p-dblK1kToS3k-3k.png',
'./mon_201706/15/-3wczfQsq2p-5sllK1kToS3k-3k.png',
'./mon_201706/15/-3wczfQsq2p-b7rxK1kToS3k-3k.png ',

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
   $("#xoxoxxxoxoxxoo").find("tr").eq(3).find("td.c2").append('&nbsp;<button title="SINoALICE" id="emotions_btn" type="button" style="">SINoALICE</button>'); 
}

function s() {

    //临时方案
    //因为post框延时拉入。
    setTimeout(function () {

           $("div.single_ttip2").eq(1).find("table.forumbox").find("tr").eq(2).find("td.c2").append('&nbsp;<button title="SINoALICE" id="emotions_btn" type="button" style="">SINoALICE</button>'); 
    },800);

}

m();

//console.log($("a[href^='http://bbs.ngacn.cc/post.php?action=quote&_newui']").length());

$("body").on("click","a[href^='/post.php?action=quote&_newui']",function(e) {
    console.log("quote click");
    s();
})

$("body").on("click","#emotions_btn",function(e) {
    	postfunc.dialog.createWindow('uiAddTag')
        postfunc.dialog.w.style.display='none'
        postfunc.dialog.w._.addContent(null)
        postfunc.dialog.w._.addTitle('SINoALICE Emotions')
        
        var tmp = ''
        tmp += "<div style='width:900px;height:380px'>" 
        for (var k in alice) {
            tmp += "<img src='http://img.ngacn.cc/attachments/"+alice[k]+"' onclick='postfunc.dialog.w._.hide();postfunc.addText(\"[img]"+alice[k]+"[/img]\")' />"
        }
        tmp += "</div>"
        postfunc.dialog.w._.addContent(tmp)
        postfunc.dialog.w._.show(e)
})