// ==UserScript==
// @name		new_douban_marks_on_amazon
// @namespace		new_douban_marks_on_amazon
// @version		0.4
// @include		https://www.amazon.cn/*
// @connect             douban.com
// @grant               GM_xmlhttpRequest
// author		https://github.com/spin6lock
// @description         Display douban.com book rating on amazon.cn
// @description:zh-cn   在中国亚马逊图书页面显示豆瓣评分

// @downloadURL https://update.greasyfork.org/scripts/28378/new_douban_marks_on_amazon.user.js
// @updateURL https://update.greasyfork.org/scripts/28378/new_douban_marks_on_amazon.meta.js
// ==/UserScript==

var $ = function(selector){
    return document.querySelectorAll(selector);
};

var final_main = function(){
    //var nav = $('.nav-category-button a').text;
    //if(nav !== "图书") {
    //	return;
    //}

    var isbn = "";
    var olink = "";

    var infos = $("div.content b");
    //遍历目标节点获取isbn
    for (var i = 0; i <= 10; i++) {
        var info = infos[i];
        if (info.textContent == "ISBN:") {
            isbn = info.nextSibling.data;
            isbn = isbn.split(",")[0].substring(1);
            break;
        }
    }

    var xht2 = function(pnum){
        GM_xmlhttpRequest({
            method:	'GET',
            url:	'http://api.douban.com/book/subject/isbn/' + isbn + '?alt=json',
            onload:	function(res) {
                var rejson = JSON.parse(res.responseText);
                var numRaters = rejson['gd:rating']['@numRaters'];
                var average = rejson['gd:rating']['@average'];
                var link = rejson.link[1]['@href'];
                //var emp = $('.buying')[pnum];
                var emp = document.querySelector('.badge-wrapper');
                  var pos;
                if(average < 1) pos = -151;
                else if(average == 10) pos = -1;
                else pos = Math.round(average ) * 15 - 150 + 1;
                var htmlstr = document.createElement("span");
                htmlstr.innerHTML =  "&nbsp|&nbsp<span style='color:#0C7823; font-weight:700;'>豆瓣</span>评分:<span style='background-image:url(https://img3.doubanio.com/f/shire/680a4bc4c384199245b080c7104da5be8ed717d3/pics/rating_icons/ic_rating_m.png); background-repeat:no-repeat; background-position:0 " + pos + "px; width:75px;'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</span>";
                if(numRaters < 10) htmlstr.innerHTML += "<span>&nbsp少于10人评价&nbsp<a href='"+ link +"'>链接</a></span>";
                else htmlstr.innerHTML += "<span>"+ average +"&nbsp("+ numRaters +"人评价)&nbsp<a href='"+ link +"'>链接</a></span>";
                emp.appendChild(htmlstr);
            }
        });
    };
    //若找不到ISBN，初步认为此页是电子书页面
    if(isbn === '') {
        var olinks = $(".tmm_bookTitle a");
        for (var j = 0; j <= 2; j++) {
            olink = olinks[j];
            if(olink) {
                if(olink.textContent == "平装"){
                    olink = olink.href;
                    break;
                    //olink = olink.split("/")[5];
                    //olink = 'http://www.amazon.cn/dp/'+ olink;
                }
            }
        }

        GM_xmlhttpRequest({
            method: 'GET',
            url: 	olink,
            onload: function(res) {
                //ajax返回的HTML文档实为string类型
                var el = document.createElement('div');
                el.innerHTML = res.responseText;

                var isbns = el.querySelectorAll("div.content b");
                for (var i = 0; i <= 10; i++) {
                    var info = isbns[i];
                    if (info.textContent == "ISBN:") {
                        isbn = info.nextSibling.data;
                        isbn = isbn.split(",")[0].substring(1);
                        break;
                    }
                }

                xht2(3);//电子书
                return;
            }
        });
    }

    xht2(2);//纸书

};
final_main();
