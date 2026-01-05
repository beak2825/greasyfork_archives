// ==UserScript==
// @name           BT天堂 豆瓣电影下载搜索工具
// @namespace      http://www.bttiantang.com/
// @description    增加豆瓣电影的下载搜索链接
// @author         BT天堂
// @version        1.0
// @include        http://movie.douban.com/subject/*
// @grunt          none
// @downloadURL https://update.greasyfork.org/scripts/11079/BT%E5%A4%A9%E5%A0%82%20%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E4%B8%8B%E8%BD%BD%E6%90%9C%E7%B4%A2%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/11079/BT%E5%A4%A9%E5%A0%82%20%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E4%B8%8B%E8%BD%BD%E6%90%9C%E7%B4%A2%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

function run () {
    var title = $('html head title').text();
    title = title.replace( '(豆瓣)', '' ).trim();
    title = encodeURIComponent(title);

    var Movie_links = [
        {html: "BT天堂", href: "http://www.bttiantang.com/s.php?q=" + title},
    ];

    var link = $("<div>").attr("class", "gray_ad");
    link.append('<h2>下载链接:</h2>');
    
    appendLinks(Movie_links, link);

    $('.aside').prepend(link);
    
    function appendLinks(items, appendTo) {
        items.forEach(function(item, i) {
            $("<a>")
            .html(item.html)
            .attr({
                href: item.href,
		target: "_blank"
	    })
	    .appendTo(appendTo);

	    if (i != items.length - 1) {
	        appendTo.append("<br />");
	    }
	});
    }
}

run()