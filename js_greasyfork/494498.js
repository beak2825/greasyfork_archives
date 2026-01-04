// ==UserScript==
// @name         杏坛豆瓣书籍自动检索工具工具V2.1
// @namespace    yideng
// @version      2.1
// @description  已有的书籍名称通过豆瓣API获取信息，然后填充至各个信息区
// @author       yideng@基于周半仙大佬脚本适配杏坛最新版本
// @match        https://xingtan.one/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xingtan.one
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/494498/%E6%9D%8F%E5%9D%9B%E8%B1%86%E7%93%A3%E4%B9%A6%E7%B1%8D%E8%87%AA%E5%8A%A8%E6%A3%80%E7%B4%A2%E5%B7%A5%E5%85%B7%E5%B7%A5%E5%85%B7V21.user.js
// @updateURL https://update.greasyfork.org/scripts/494498/%E6%9D%8F%E5%9D%9B%E8%B1%86%E7%93%A3%E4%B9%A6%E7%B1%8D%E8%87%AA%E5%8A%A8%E6%A3%80%E7%B4%A2%E5%B7%A5%E5%85%B7%E5%B7%A5%E5%85%B7V21.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 获取当前页面的链接
    var currentUrl = window.location.href;
    // 判断链接是否包含 "details.php"
    if (currentUrl.includes("details.php")) {
        // 匹配给定的 XPath 表达式
        var xpathExpression = '/html/body/table[2]/tbody/tr[2]/td/div/font/table[1]/tbody/tr[1]/td[2]/a[1]';
        var result = document.evaluate(xpathExpression, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

        // 获取匹配的元素
        var element = result.singleNodeValue;

        if (element) {
            // 获取元素的文本内容
            var text = element.textContent;

            // 提取倒数第二个 `.` 到倒数第三个 `.` 之间的内容
            var regex = /(?:\.[^.]+)(\.)([^.]+)(?:\.[^.]+)$/; // 正则表达式
            var match = regex.exec(text);

            if (match && match[2]) {
                var extractedText = match[2];
                // 匹配给定的 XPath 表达式
                //var xpathExpression = '/html/body/table[2]/tbody/tr[2]/td/div/font/table[1]/tbody/tr[4]/td[2]/a[2]';
                var xpathExpression = '/html/body/table[2]/tbody/tr[2]/td/div/form/font/table/tbody/tr[2]/td[2]';
                var result = document.evaluate(xpathExpression, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

                // 获取匹配的链接元素
                var linkElement = result.singleNodeValue;

                if (linkElement) {
                // 获取链接的 href 属性值
                var link = linkElement.getAttribute('href');

                // 在链接后面追加参数
                var updatedLink = link + '&type='+extractedText;

                // 更新链接的 href 属性
                linkElement.setAttribute('href', updatedLink);
                }
            }
        }
    }
    // 判断链接是否包含 "edit.php"，判断是否是编辑页面
    if (currentUrl.includes("edit.php")) {
        const xtXpath = "/html/body/table[2]/tbody/tr[2]/td/div/form/font/input";

        // 获取目标元素
        const targetElement = document.evaluate(xtXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        // 创建并插入<div>元素
        const divElement = document.createElement('div');
        targetElement.parentNode.insertBefore(divElement, targetElement.nextSibling);
        divElement.style = 'width:58%;background-color:#f1939c;font-size:15px'
        // 获取编辑页面标题的值
        const titleXpath = "/html/body/table[2]/tbody/tr[2]/td/div/form/font/table/tbody/tr[2]/td[2]/input";
        // 使用XPath获取元素
        const element = document.evaluate(titleXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        // 检查元素是否存在并输出值
        if (element) {
            if (document.querySelector('input[name="small_descr"]').value != '本资源由LM-AUTO-BOT机器人自动发布,请及时修改资料') {
                divElement.innerHTML += '当前种子已被编辑过，不再执行自动检索脚本....<br>';
                return 0
            }
            // console.log("获取到标题是: ", element.value);
            var searchTitle = element.value
            divElement.innerHTML += '开始搜索：' + '<br>';
            const url = `https://api.douban.com/v2/book/search?q=${encodeURIComponent(element.value)}&apikey=0ac44ae016490db2204ce0a042db2916`;
            var values = [];
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function (response) {
                    var data = JSON.parse(response.responseText); // 解析返回值为JSON格式
                    var books = data.books; // 获取books数据数组
                    localStorage.setItem('books', JSON.stringify(books));
                    // 循环遍历books数据,只显示前五条，然后自动匹配
                    for (var i = 0; i < books.length; i++) {
                        var book = books[i]; // 获取当前书籍数据
                        var author = ''; // 获取作者
                        for (var j = 0; j < book.author.length; j++) {
                            author += book.author[j] +'&';
                        }
                        author = author.slice(0, -1);
                        var pubdate = book.pubdate.split('-')[0]; // 获取出版年份
                        var publisher = book.publisher; // 获取出版社
                        // 构建textarea的值
                        var value = "图片地址：" + book.images.large + "(请手动下载图片，并上传至图床，图床地址：https://img.xingtan.one/)\n";
                        if (author) {
                            value += "作者: " + author + "\n";
                        }
                        if (publisher) {
                            value += "出版社: " + publisher + "\n";
                        }
                        if (book.subtitle) {
                            value += "副标题: " + book.subtitle + "\n";
                        }
                        if (pubdate) {
                            value += "出版年: " + pubdate + "\n";
                        }
                        if (book.pages) {
                            value += "页数: " + book.pages + "\n";
                        }
                        if (book.price) {
                            value += "定价: " + book.price + "\n";
                        }
                        if (book.binding) {
                            value += "装帧: " + book.binding + "\n";
                        }
                        if (book.isbn13) {
                            value += "ISBN: " + book.isbn13 + "\n\n";
                        }
                        if (book.summary) {
                            value += "内容简介: \n    " + book.summary + "\n\n";
                        }
                        if (book.author_intro) {
                            value += "作者简介: \n    " + book.author_intro + "\n";
                        }
                        values.push(value)
                        divElement.innerHTML += '<a style="color:yellow" onclick="insert(' + i +')">填充对应信息</a><a style="color:green" target="\_blank" href=' + "https://book.douban.com/subject/" + book.id + '>第' + (i + 1) + "条：" + book.title + '[查看对应书籍]</a><br>';
                    }
                    localStorage.setItem('values', JSON.stringify(values));
                    // 备用手动检索模式
                    // for (var i = 0; i < 5; i++) {
                    //     var book = books[i]; // 获取当前书籍数据
                    //     var author = book.author[0]; // 获取作者
                    //     var pubdate = book.pubdate.split('-')[0]; // 获取出版年份
                    //     var publisher = book.publisher; // 获取出版社
                    //     var result = "作者：" + author +"/" + publisher +"/" + pubdate +"【对应格式】";
                    //     console.log(book.title)
                    //     console.log(result); // 输出拼接后的结果
                    //     console.log("https://book.douban.com/subject/"+book.id) //输出豆瓣连接
                    // }
                },
                onerror: function (error) {

                }
            });
        } else {
            console.log("找不到元素");
        }
    }
    // 创建一个 <script> 元素
    var script = document.createElement('script');

    // 定义要插入的函数
    script.textContent = `
        function insert(id,value) {
            var urlString = window.location.href;
            // 创建 URL 对象
            var url = new URL(urlString);
            // 获取链接中的 type 参数的值
            var type = url.searchParams.get('type');
            book = JSON.parse(localStorage.getItem('books'))[id];
            var author = ''; // 获取作者
            for (var j = 0; j < book.author.length; j++) {
                author += book.author[j] +'&';
            }
            author = author.slice(0, -1);
            var pubdate = book.pubdate.split('-')[0]; // 获取出版年份
            var publisher = book.publisher; // 获取出版社
            var small_descr = "作者：" + author +"/" + publisher +"/" + pubdate +"【"+type+"】";
            document.querySelector('input[name="small_descr"]').value = small_descr;
            document.querySelector('input[name="pt_gen"]').value = "https://book.douban.com/subject/"+book.id;
            document.querySelector('textarea[name="descr"]').value = JSON.parse(localStorage.getItem('values'))[id];
        }
    `;

    // 将 <script> 元素插入到页面的 <head> 元素中
    document.head.appendChild(script);
})();