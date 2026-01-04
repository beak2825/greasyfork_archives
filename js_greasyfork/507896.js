// ==UserScript==
// @name         豆瓣电影图书主页一键搜索
// @namespace    doubanBookSearchAndInfoExport
// @description  豆瓣电影、图书主页添加资源网站的搜索链接，图书主页添加复制信息按钮，一键复制作者/译者/出版社等信息，可直接粘贴到excel
// @author       ersan23
// @version      3.3
// @supportURL   https://greasyfork.org/zh-CN/scripts/507896
// @match        *://movie.douban.com/subject/*
// @match        *://book.douban.com/subject/*
// @downloadURL https://update.greasyfork.org/scripts/507896/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E5%9B%BE%E4%B9%A6%E4%B8%BB%E9%A1%B5%E4%B8%80%E9%94%AE%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/507896/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E5%9B%BE%E4%B9%A6%E4%B8%BB%E9%A1%B5%E4%B8%80%E9%94%AE%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

let fetch_anchor = function (anchor) {
    return anchor[0].nextSibling.nodeValue.trim();
};


function showLinks () {

    let title = document.title.replace(/\([^\)]*\)/g, '');

    let nameText = '';

    //这段是用Kimi.ai写的，改了三天，豆瓣的作者和译者信息实在太乱了啊啊啊啊啊啊，每个上传者都有自己的写法，烦死了。谢谢Kimi~ ❤️
    function extractNames(selector) {
        let namesSet = new Set(); // 使用Set来存储唯一的名字
        let accumulatedText = ''; // 用于累积每个<a>标签的文本内容
        $(selector).each(function() {
            // 获取当前<span>元素后的所有<a>元素
            $(this).nextAll('a').each(function(index) {
                // 获取每个<a>标签的文本内容
                let text = $(this).text().trim();
                // 如果不是第一个<a>标签，前面加上斜杠
                if (index > 0) {
                    accumulatedText += '/';
                }
                accumulatedText += text; // 将文本添加到累积字符串中
            });
        });
        //console.log("accumulatedText：" + accumulatedText);
        // 移除所有括号及括号内容，并按逗号（中英文）和斜杠分割名字
        let extractedNames = accumulatedText.replace(/[（）\(\)\【\】\[\]“”‘’“”‘’]+.*?[）\(\)\】\]””’””’]+/g, '').split(/[,\/]+/);
        //console.log("extractedNames：" + extractedNames);
        extractedNames.forEach(function(extractedName) {
            let cleanedName = extractedName.replace(/[（）\(\)\【\】\[\]“”‘’“”‘’]+.*?[）\(\)\】\]””’””’]+/g, '').trim();
            // 移除人名后面的空格和非人名内容
            cleanedName = cleanedName.replace(/(?:\s+[^ ]+)+$/, '').trim();
            // 将“•”替换为“·”
            cleanedName = cleanedName.replace(/•/g, '·');
            namesSet.add(cleanedName); // 将名字添加到Set中，自动去重
        });
        // 使用“ / ”连接所有唯一的名字
        return Array.from(namesSet).join(' / ');
    }

    // 使用extractNames函数
    let writerSelector = '#info span.pl:contains("作者")';
    let writer = extractNames(writerSelector);

    let translatorSelector = '#info span.pl:contains("译者")';
    let translator = extractNames(translatorSelector);



    let is_series = $('#info span.pl:contains("丛书")').length > 0;
    let series = is_series ? ' ' + $('#info span.pl:contains("丛书")')[0].nextSibling.nextSibling.textContent : '';
    series = series.replace(/•/g, '·').replace(/·/g, '·');

    let is_producer = $('#info span.pl:contains("出品方")').length > 0;
    let producer = is_producer ? ' ' + $('#info span.pl:contains("出品方")')[0].nextSibling.nextSibling.textContent: '';

    let is_publisher = $('#info span.pl:contains("出版社")').length > 0;
    let publisher = is_publisher ? ' ' + $('#info span.pl:contains("出版社")')[0].nextSibling.nextSibling.textContent: '';

    let is_publishYear = $('#info span.pl:contains("出版年")').length > 0;
    let publishYear = is_publishYear ? ' ' + $('#info span.pl:contains("出版年")')[0].nextSibling.textContent : '';

    let is_page = $('#info span.pl:contains("页数")').length > 0;
    let page = is_page ? ' ' + $('#info span.pl:contains("页数")')[0].nextSibling.textContent.match(/\d+/) : '';

    let is_price = $('#info span.pl:contains("定价")').length > 0;
    let price = is_price ? ' ' + $('#info span.pl:contains("定价")')[0].nextSibling.textContent.match(/[\d.]+/) : '';

    let isbn_anchor = $('#info span.pl:contains("ISBN")');
    let isbn = isbn_anchor[0] ? fetch_anchor(isbn_anchor) : '';


    let QMark = '"';


    //复制的信息顺序:书名｜作者｜译者｜丛书｜出品方｜出版社｜出版年｜页数｜定价
    //做这个功能是为了一键复制信息粘贴到excel，可以根据自己的excel修改顺序和信息
    var emptyWord;
    var info_list = [title, writer, translator, series, producer, publisher, publishYear, page, price].map(function(item) {
        return (item || '').toString().trim();
    });
    var info_export = info_list.join('\t');

    var Movie_links = [
        { html: "BiliBili", href: "https://search.bilibili.com/pgc?keyword=" + title },
        { html: "优酷", href: "https://so.youku.com/search_video/q_" + title + "?searchfrom=1" },
        { html: "爱奇艺", href: "https://www.iqiyi.com/search/" + title + ".html" },
        { html: "搜片(在线/网盘)", href: "http://202.95.13.126:8081/movie/" + title },
        { html: "555电影(在线)", href: "https://www.555dy9s.com/vodsearch/-------------.html?wd=" + title },

    ];
    var Book_read_links = [
        //{ html: "", href: "" + title + " " + writer },
        { html: "Anna", href: "https://annas-archive.li/search?q=" + title + writer + "&ext=pdf&ext=epub&ext=mobi" },
        { html: "Z-Lib", href: "https://z-lib.gs/s/" + title + writer + "?extensions[]=EPUB&extensions[]=MOBI&extensions[]=PDF"},
        //Kox.moe 漫画网站，主推中文漫画/绘本
        { html: "Kox.moe", href: "https://kox.moe/list.php?s=" + title },
        //OceanofPDF 外语pdf电子书网站
        { html: "OceanofPDF", href: "https://oceanofpdf.com/?s=" + title },
        //HathiTrust 外语电子书网站，资源较少
        { html: "HathiTrust", href: "https://catalog.hathitrust.org/Search/Home?lookfor=" + title + "&searchtype=title&ft=ft&setft=true"},
        //Gallica 法语电子书网站
        { html: "Gallica", href: "https://gallica.bnf.fr/services/engine/search/sru?operation=searchRetrieve&version=1.2&query=(gallica all " + QMark + title + "" + writer + QMark + ")"},

    ];
    var Book_buy_links = [
        { html: "京东", href: "https://search.jd.com/Search?keyword=" + title + publisher },
        { html: "淘宝", href: "https://s.taobao.com/search?page=1&sort=price-asc&q=图书 " + title + publisher },
        { html: "当当", href: "https://search.dangdang.com/?key=" + title + publisher + "&show=big" },
        { html: "闲鱼", href: "https://www.goofish.com/search?q=" + title + writer },
        { html: "孔夫子", href: "https://search.kongfz.com/product_result/?order=100&ajaxdata=4&quality=90h&quaselect=2&key=" + title + publisher},

    ];

    var copyButton = $('<button>点击复制</button>');
    //$('body').append(copyButton);


    var link = $("<div>").append(
        $("<span>").attr("class", "pl").html("下载链接：")
    );

    switch(location.host){
        case "book.douban.com":
            appendLinks(Book_read_links, link)
            link.append('<br>')
                .append('<span class="pl">买买买：</span>')
            appendLinks(Book_buy_links, link)
            link.append('<br>')
                .append('<span class="pl">复制信息：</span>')
                .append(copyButton)
            copyInfo(copyButton, info_export)

            break;
        case "movie.douban.com":
            appendLinks(Movie_links, link)
            break;
    }

    $('#info').append(link);

    function appendLinks(items, appendTo){
        items.forEach(function(item, i){
            $("<a>")
                .html(item.html)
                .attr({
                href: item.href,
                target: "_blank"
            })
                .appendTo(appendTo);

            if(i != items.length -1){
                appendTo.append(" ｜ ");
            }
        });
    }

    function addStyles() {
        var styleExists = document.querySelector('style.toast-style');
        if (!styleExists) {
            var style = document.createElement('style');
            style.className = 'toast-style'; // 给style标签添加一个类名以便识别
            style.type = 'text/css';
            style.innerHTML = `
            .toast {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background-color: #333;
                    color: #fff;
                    padding: 10px;
                    border-radius: 5px;
                    opacity: 0.9;
                    z-index: 1000; /* 确保提示显示在最上层 */
                    width: auto; /* 自动宽度 */
                    text-align: center; /* 文本居中 */
                    white-space: nowrap; /* 防止文本换行 */
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1); /* 添加阴影效果 */
                }
        `;
            document.head.appendChild(style);
        }
    }

    function copyInfo(nameButton, infoCont){
        addStyles(); // 确保样式被添加
        nameButton.click(function() {
            navigator.clipboard.writeText(infoCont).then(function() {
                // 创建提示元素
                var toast = document.createElement('div');
                toast.className = 'toast';
                toast.textContent = '文本已复制到剪贴板';
                document.body.appendChild(toast);

                // 设置定时器，自动移除提示
                setTimeout(function() {
                    toast.remove();
                }, 2000);

            }).catch(function(err) {
                console.error('无法复制', err);
            });
        });
    }
}

showLinks()