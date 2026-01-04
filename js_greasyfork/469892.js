// ==UserScript==
// @name         VihuVVL
// @namespace    http://yxzl.top/
// @version      1.1.0
// @license MIT
// @description  自动显示知乎赞阅比
// @author       Iron_Grey_
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @match        *://www.zhihu.com/*
// @grant        none
// @run-at document-end
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/469892/VihuVVL.user.js
// @updateURL https://update.greasyfork.org/scripts/469892/VihuVVL.meta.js
// ==/UserScript==



(function() {
    let counts = (arr, value) => arr.reduce((a, v) => v === value ? a + 1 : a + 0, 0);
    function duplicates(arr) {
    var Arr = [];
    for(let i=0; i<arr.length; i++ ){
        for(let j=i+1; j<arr.length; j++){
            if(arr[i]===arr[j] && Arr.indexOf(arr[j])===-1){
                Arr.push(arr[i]);
            }
        }
    }
    return Arr;
    };
    function getspeed(){
        var al=new Array();
        var all=$(".ActivityItem-meta").find("span");
        for(let i=1;i<=all.length;i+=2){al.push($(all[i]).html())};
        var ni=duplicates(al);
        var bigst=0;
        var wh=0;
        for(let i=0;i<=ni.length;i++){if(counts(al,ni[i])>bigst){bigst=counts(al,ni[i]);wh=ni[i];};};
        $($("body").find(".css-348wka")[0]).html(bigst);
        $($("body").find(".css-lv2ren")[0]).html(wh);
    };
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    };
    function dlth(num){
        if(num&&num!='undefined'&&num!='null'){
            let numS = num;
            numS = numS.toString();
            numS = numS.replace(/,/gi, '');
            return numS;
        }else {
            return num;
        }
    };
    function vurunum(){try {

    var qviw = dlth($(".QuestionFollowStatus-counts").find(".NumberBoard-itemValue")[1].innerText);
    var qlks = $(".css-0").find(".List-item");
    for(let i=0;i<qlks.length;i++){
        var $wrap = $('<div>_ _ _</div><div style="color:grey" id="asdflkjhg">'+parseInt(qviw/$($(qlks[i]).find("meta[itemprop='upvoteCount']")[0]).attr("content"))+'</div>');
        if($(qlks[i]).find("#asdflkjhg").length<1){
        $($(qlks[i]).find("div.RichContent-inner")[0]).append($wrap);};
    };}catch(e){}};
    var Cts = window.location.href;
    if(Cts.indexOf("https://www.zhihu.com/people") >= 0 ) {
        $($("body").find(".css-348wka")[1]).html('<button id="next">下一页</button>');
        $($("body").find(".css-lv2ren")[1]).html('<button id="fdall">反对所有</button><button> | </button><button id="ztall">赞同所有</button>');
        $("#fdall").bind("click",function (){$(".VoteButton--down").click()});
        $("#ztall").bind("click",function (){$(".VoteButton--up").click()});
        $("#next").bind("click",function (){$(".PaginationButton-next").click()});
        window.addEventListener('scroll',(event) => {
            getspeed();
        });
    };
    if(Cts.indexOf("https://www.zhihu.com/question") >= 0 ) {
        $("body").bind("click",vurunum);
    }
    var val = "<style type='text/css'>.Button--red{color:#056de8 !important}</style>";
    $("body").append(val);
    vurunum();

})();