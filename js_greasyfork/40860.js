// ==UserScript==
// @name            赚吧精简
// @description     赚吧精简1.0.0
// @include         *://*.zuanke8.com/*
// @version         1.0.1
// @namespace       zuanke8
// @run-at          document-start
// @require         http://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/40860/%E8%B5%9A%E5%90%A7%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/40860/%E8%B5%9A%E5%90%A7%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==
var style = `
<style>
.hdc{
    display:none;
},
.tl th, .tl td{
   padding:2px
}
#um{
   padding-top:0px
}
.pls .tns {
    padding: 0 5px 5px 50px;
}
.pls .tns+p{
    padding-left:50px
}
.pls .avatar{
    position:absolute;
    margin:0px
}
.pls .avatar img {
    padding: 5px 5px 8px;
    background: #FFF url(../../static/image/common/midavt_shadow.gif) 0 100% repeat-x;
    width: 40px;
}
#xad_mu{
    display:none
}
.t_fsz{
   min-height:50px
}
#scbar{
    display:none
}
.bm_h{
    display:none
}
.pil{
    display:none;
}
.pi{
   padding:5px;
}
.adsbygoogle{
    display:none !important
}
.authi{
    display:none
}
</style>
`;
$(function() {
    $(".pcb").siblings().remove();
    $(".plm").remove();
    $("head").append(style);


    var totalHeight = 200; //定义一个总高度变量
    function ata(){ //loa动态加载数据
        totalHeight =  parseFloat( $(window).height() ) +  parseFloat( $(window).scrollTop() ); //浏览器的高度加上滚动条的高度
        if ( $(document).height() <= totalHeight ) { //当文档的高度小于或者等于总的高度时，开始动态加载数据
           $("#autopbn").click();
        }
    }
    $(window).scroll(function(){
        ata();
    });
});