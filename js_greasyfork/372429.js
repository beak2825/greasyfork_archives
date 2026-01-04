// ==UserScript==
// @name         Automated comment your JD orders
// @namespace    https://club.jd.com/myJdcomments/
// @version      0.12
// @description  Enable grease script plugins, and open the orders-to-comment list page, then it will automatic work.
// @author       Patrick Gu
// @match        https://club.jd.com/myJdcomments/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372429/Automated%20comment%20your%20JD%20orders.user.js
// @updateURL https://update.greasyfork.org/scripts/372429/Automated%20comment%20your%20JD%20orders.meta.js
// ==/UserScript==

(function() {
    if(window.location.href.indexOf("myJdcomment.action?sort=1")!=-1)
	{
		setTimeout(function(){
			$("a.btn-9").eq(0).click();
		},1000);
		setTimeout(function(){
			$(".img-lists").find("input[name=imgs1]").eq(0).val("http:"+$(".p-img").eq(0).find("img").attr("src"));
			$(".img-lists").find("input[name=imgs1]").eq(1).val("http:"+$(".p-img").eq(0).find("img").attr("src"));
		},1000);
	}
	else if(window.location.href.indexOf("myJdcomment.action")!=-1 && window.location.href.indexOf("myJdcomment.action?sort=1")==-1)
    {
        window.location.href = $("a.btn-def").eq(0).attr("href");
    }

    if(window.location.href.indexOf("orderVoucher.action")!=-1)
    {
        setTimeout(function(){
            $("span.star.star5").addClass("active");

            $("textarea").html($(".p-name>a").html() + new Date().getSeconds() + new Date().getMilliseconds());

            $(".tag-item").eq(1).addClass("tag-checked");
            $(".tag-item").eq(2).addClass("tag-checked");
            $(".btn-submit").click();
        },1000);
    }

    if(window.location.href.indexOf("saveCommentSuccess.action")!=-1)
    {
        window.location.href = "http://club.jd.com/myJdcomments/myJdcomment.action";
    }
    // Your code here...
})();