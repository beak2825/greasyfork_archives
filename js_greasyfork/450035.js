// ==UserScript==
// @name 抖音直播弹幕大字显示
// @description 抖音直播弹幕大字显示、直播优化，网页全屏，全黑，自动按浏览器窗口调整大小，弹幕独立显示，弹幕大屏显示
// @author 虫子%1000
// @license 虫子%1000
// @version 1.08
// @match https://www.douyin.com/recommend
// @match https://www.douyin.com/*
// @match https://www.douyin.com/?*
// @match https://www.douyin.com/follow
// @match https://live.douyin.com/*
// @require https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @run-at document-end
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_addValueChangeListener
// @noframes
// @namespace https://greasyfork.org/users/949830
// @downloadURL https://update.greasyfork.org/scripts/450035/%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E5%BC%B9%E5%B9%95%E5%A4%A7%E5%AD%97%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/450035/%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E5%BC%B9%E5%B9%95%E5%A4%A7%E5%AD%97%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

var lastindex=0;

function keydown(event) {
    //console.log(event.keyCode);
    if(event.keyCode == 109 || event.keyCode == 189){ // 按-或者小键盘-
        pagefullscreen();
    }
}
document.addEventListener('keydown', keydown, false);

var haspagefullscreen=0;
function pagefullscreen(){
    var is=0;
    //$(`#slidelist > div > div.swiper-wrapper > div.swiper-slide-active xg-icon.xgplayer-page-full-screen > div.xgplayer-icon`).click();
    $(`#slidelist > div > div.swiper-wrapper > div.swiper-slide-active xg-icon.xgplayer-page-full-screen > div.xgplayer-icon`).each(function(){
        haspagefullscreen=1;
        $(this).click();
        is=1;
    })
    if (is){return}
        console.log("非推荐");
    $(`xg-controls xg-icon>div > div:nth-child(2)`).each(function(){
        if ($(this).parent().text().indexOf("网页全屏")<0)return;
        console.log("判断：",$(this).text(),"  ",$(this)[0]);
        haspagefullscreen=1;
        $(this).click();
    })

}
var firstfullscreen=setInterval(function(){
    if (haspagefullscreen){
        clearInterval(firstfullscreen);
        return;
    }
    pagefullscreen();
},1000);


function addCSS(){
    let wdstyle = document.createElement('style');
    wdstyle.classList.add("optimize");
    wdstyle.innerHTML = `
div.gNyVUu_s{display:none!important}
.qdcce5kG .VFMR0HAe{background:#0000 !important}
.vLt8mbfQ .y8iJbHin .mMOxHVzv,.vLt8mbfQ .y8iJbHin .rrKCA47Q,div.webcast-chatroom{background:#000 !important}
.Npz7CPXj,div.webcast-chatroom .webcast-chatroom___input-container .webcast-chatroom___textarea{background:#111 !important}
div.JwGiJkkI,div.xgplayer-dynamic-bg,div.umOY7cDY,div.ruqvqPsH{display:none !important}
.pgQgzInF.hqONwptG .Jf1GlewW.Ox89VrU5,.ckEyweZa.AmXnh1GR .QICHGW7r.RosH2lNv,.SxCiQ8ip.V6Va18Np .EDvjMGPs.FKQqfehj{
    height: 100% !important;
}
.webcast-chatroom___content-with-emoji-emoji img,.rc30lnLh img,.FzpnR1C1 img{
height:100%;
width:100%;
}
.webcast-chatroom___content-with-emoji-emoji{
margin:0 10px;
}
.OAJeuZUg img{height:100%}
.IK03Li9C .OAJeuZUg .X3mYTmNP .I1YlCmYh, .HCajOVT6,.rc30lnLh,.NNKf0TrD{font-size:40px;}
.KE7O_8ZC .FzpnR1C1 .Ehh2NFQO .NNKf0TrD{font-size:30px;top:15px;position: relative;}
.IK03Li9C .OAJeuZUg .X3mYTmNP{height:40px}
`
    document.body.appendChild(wdstyle);
}
addCSS();

function editCSS(){
    let editstyle = document.createElement('style');
    editstyle.innerHTML = `
.mUQC4JAd,.JJvNvDHA,.Q7mln_nz,.n2HA7AMr,.JqBinbea,.LU6dHmmD,.r80Oclsr,.r80Oclsr .b76LkBHq{font-size:50px;line-height:55px;color:#EA445A}
.pgQgzInF.hqONwptG .Jf1GlewW.Ox89VrU5, .ckEyweZa.AmXnh1GR .QICHGW7r.RosH2lNv, .SxCiQ8ip.V6Va18Np .EDvjMGPs.FKQqfehj{width:500px}
.mUQC4JAd .JqBinbea{color:#EA445A}
.JJvNvDHA .fTLFnWPf{width:48px;height:48px;}
.zBToBU_j div font .Wk9PFFRZ .ns_9qfU4 .sz0V8anf{font-size:50px;}
.IK03Li9C.MlLdSIrE .OAJeuZUg .X3mYTmNP .I1YlCmYh{font-size:25px;line-height:25px}
`
    document.body.appendChild(editstyle);
}
editCSS();


(function( $ ) {
    var btn="<div style='width: 100px; height: 30px; position: fixed; top: 0; right: 0; z-index: 99999;overflow: visible;'><button id='qcsy' style='background-color: rgba(70, 196, 38, 0.6); width: 100px;height: 30px;color:red;'>去除直播画面</button></div>";
    $("body").prepend(btn);
    $("button#qcsy").click(function(){
        var tit=document.title;
        if (/(抖音)/.test(tit)) {
           $(".EDvjMGPs,.FKQqfehj").remove();
        }else if (/(公告)/.test(tit)) {
            $(".webcast-chatroom__room-message").remove();
        }
    });
})( jQuery );