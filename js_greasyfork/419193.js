// ==UserScript==
// @name         V2ex User Experience Enhance
// @namespace    http://tampermonkey.net/
// @version      0.53
// @description  v2ex体验增强2020版
// @author       xingis
// @match        https://www.v2ex.com/*
// @include        http*://*.v2ex.com/*
// @include        http*://v2ex.com/*
// @grant        none
// @locale       zh-CN
// @downloadURL https://update.greasyfork.org/scripts/419193/V2ex%20User%20Experience%20Enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/419193/V2ex%20User%20Experience%20Enhance.meta.js
// ==/UserScript==


(function() {
//<editor-fold desc="增加bing, baidu搜索">
// from xingis@v2ex
var box = "<div id='search-result_diy' class='box' style='position: absolute;background-color: var(--box-background-color);top: 36px;left:105%;width: 100%;z-index:99'></div>";
$("#search").after(box);
$("#search").on("input propertychange",function(){
    console.log($(this).val().length);
    if($(this).val().length > 0) {
        var $keyword = "<div class='search-item-group cell active'><a class='search-item active' href='https://www4.bing.com/search?q=site%3Av2ex.com+" + $(this).val() + "' target='_blank'>Bing " + $(this).val() + "</a></div>";
        $keyword += "<div class='search-item-group cell active'><a class='search-item active' href='https://www.baidu.com/s?wd=site%3Av2ex.com+" + $(this).val() + "' target='_blank'>Baidu " + $(this).val() + "</a></div>";
        $("#search-result_diy").show().html($keyword);
    } else {
        $("#search-result_diy").hide();
    }
});
//</editor-fold>

//以下代码来自zjsxwc
//<editor-fold desc="尝试滚到回复，但由于感谢等也算回复，可能不会起效">
var isFromHomepage = (document.referrer == "https://www.v2ex.com/")||(document.referrer == "https://v2ex.com/");
(!isFromHomepage) && (function(){
    var replyNo = null;
    var replyMatches = window.location.hash.match(/#reply(\d+)/);
    if (replyMatches) {
        replyNo = replyMatches[1];
    }
    if (replyNo) {
        var targetReplyEle = null;
        $(".no").each(function(_,e){
            var eHtml = $(e).html();
            if (eHtml != replyNo) {
                return;
            }
            targetReplyEle = e;
        });
        $('html, body').animate({
            scrollTop: $(targetReplyEle).offset().top
        }, 666);
    }
}());
//</editor-fold>

//<editor-fold desc="每日签到">
function in_array(search,array){
    for(var i in array){
        if(array[i]==search){
            return true;
        }
    }
    return false;
}
var currentPathName = window.location.pathname;
var ignorePathNameList = [
    "/signin", "/forgot", "/signup"
];
if (!in_array(currentPathName, ignorePathNameList)) {
    $.get("/mission/daily",function(r){
        var m = r.match(/mission\/daily\/redeem\?once=(\w{5})/);
        if (!m) {
            return;
        }
        var code = m[1];
        var url = "/mission/daily/redeem?once="+code;
        $.get(url);
    });
}
//</editor-fold>


//<editor-fold desc="查看被at人的帖子">
var isInThread = !!window.location.href.match(/\/t\/\d+/);
if (isInThread) {
    var $goBottomBtn = $('<a href="#;" class="tb" onclick="$(\'html, body\').animate({scrollTop: 100000}, 1000);">到底部</a>');
    $('.topic_buttons').append($goBottomBtn);

    var getReplyContentByNickname = function(nickname) {
        var replyContents = [];
        $("strong a").each(function(i,e){
            var $el = $(e);
            var text =$el.text();
            if (text.lastIndexOf(nickname) == 0) {
                var $parent = $el.closest("td");
                var $content = $parent.find(".reply_content");
                var $no = $parent.find(".no");
                replyContents.push({
                    no: $no.text(),
                    content: $content.text()
                });
            }
        });
        return replyContents;
    };
    $(".reply_content a").each(function(_,e){
        var $mayAtMan = $(e);
        var $parent = $mayAtMan.parent();
        var parentText = $parent.text();
        var mayNickname = $mayAtMan.text();
        var mayAtManText = "@"+mayNickname;
        if (parentText.lastIndexOf(mayAtManText) !== -1) {
            $mayAtMan.mouseover(function(){
                var replyContents = getReplyContentByNickname(mayNickname);
                var $allAtManReply = $("body").find(".js-at-man-reply");
                if ($allAtManReply) {
                    $allAtManReply.remove();
                }
                var html = "";
                $.each(replyContents,function(_,replyContent){
                    html += "<p>"+"#"+replyContent.no+" "+replyContent.content+"</p><br>";
                });
                html = "<div class='js-at-man-reply'><h2>"+mayNickname+":</h2><br>"+html+"</div>";
                $mayAtMan.parent().append($(html));
            });
        }
    });
}
//</editor-fold>



//标记楼主  代码来自ejin
uid=document.getElementById("Rightbar").getElementsByTagName("a")[0].href.split("/member/")[1];//自己用户名
if (location.href.indexOf(".com/t/") != -1) {
    var lzname=document.getElementById("Main").getElementsByClassName("avatar")[0].parentNode.href.split("/member/")[1];
    allname='@'+lzname+' ';
    all_elem = document.getElementsByClassName("dark");
    for(var i=0; i<all_elem.length; i++) {
        if (all_elem[i].innerHTML == lzname){
            all_elem[i].innerHTML += " <font color=green>[楼主]</font>";
        }
        //为回复所有人做准备
        if ( uid != all_elem[i].innerHTML && all_elem[i].href.indexOf("/member/") != -1 && all_elem[i].innerText == all_elem[i].innerHTML && allname.indexOf('@'+all_elem[i].innerHTML+' ') == -1 ) {
            allname+='@'+ all_elem[i].innerHTML+' ';
        }
    }
}

// @所有人 与 @管理员  代码来自ejin
if ( document.getElementById("reply_content") ) {
    document.getElementById("reply_content").parentNode.innerHTML+="&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:;' onclick='if ( document.getElementById(\"reply_content\").value.indexOf(\""+allname+"\") == -1 ) {document.getElementById(\"reply_content\").value+=\"\\r\\n"+allname+"\"}'>@所有人</a>";
    if ( document.body.style.WebkitBoxShadow !== undefined ) {
        //允许调整回复框高度
        document.getElementById("reply_content").style.resize="vertical";
    }
    document.getElementById("reply_content").style.overflow="auto";
    var magagers="@Livid @Kai @Olivia @GordianZ @sparanoid";
    document.getElementById("reply_content").parentNode.innerHTML+="&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:;' onclick='if ( document.getElementById(\"reply_content\").value.indexOf(\""+magagers+"\") == -1 ) {document.getElementById(\"reply_content\").value+=\"\\r\\n"+magagers+"\"}'>@管理员</a>";
}


// 图片链接自动转换成图片 代码来自caoyue@v2ex
function linksToImgs() {
    var links = document.links;
    for (x in links){
        var link = links[x];
        if (/^http.*\.(?:jpg|jpeg|jpe|bmp|png|gif)/i.test(link.href)
            && !/<img\s/i.test(link.innerHTML)){
            link.innerHTML = "<img title='" + link.href + "' src='" + link.href + "' />";
        }
    }
}
linksToImgs();
})();