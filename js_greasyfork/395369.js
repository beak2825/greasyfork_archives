// ==UserScript==
// @name JS爬虫实例
// @description 用JS编写的一个爬虫实例。
// @match *
// @version 0.0.1.20200330111914
// @namespace https://greasyfork.org/users/420865
// @downloadURL https://update.greasyfork.org/scripts/395369/JS%E7%88%AC%E8%99%AB%E5%AE%9E%E4%BE%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/395369/JS%E7%88%AC%E8%99%AB%E5%AE%9E%E4%BE%8B.meta.js
// ==/UserScript==

//  向当前页面导入jQuery、JsonExportExcel，立即执行
(function install_jQuery_JsonExportExcel() {
    //	判断页面是否引入"jquery"、"JsonExportExcel"，如果已经引入，则直接执行主程序，否则执行引入程序
    var srcArr = ["https://code.jquery.com/jquery-3.4.1.min.js", "https://cuikangjie.github.io/JsonExportExcel/dist/JsonExportExcel.min.js"];
    var srcName = ['jQuery', 'JsonExportExcel'];
    if (document.head.innerHTML.indexOf("jquery") != -1 && document.head.innerHTML.indexOf("JsonExportExcel") != -1) {
        return;
    } else {
        for (var i = 0; i < srcArr.length; i++) {
            install(srcArr[i], i);
        }
        return;
    }
    function install(srcStr, index) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = srcStr;
        document.getElementsByTagName('head')[0].appendChild(script);
        script.onload = (function() {
            //	js加载完成执行方法，必须写成立即执行的格式。否则，后面的语句都执行完了才开始执行这句。这是因为连接外部链接默认为异步执行。
            console.log(srcName[index] + ' 加载完成');
        }())
    }
}())

//	JS爬虫实例
//	入口链接
var root_url = 'https://baike.baidu.com/item/%E8%B6%85%E7%BA%A7%E8%AE%A1%E7%AE%97%E6%9C%BA/5373711?fr=aladdin';

//	调度器
var spider_main = {
    craw: function(urlStr) {
        let currentCount = 1;
        let new_url, html_cont, new_urls = [], new_data = {};
        url_manager.add_new_url(urlStr);
        while (url_manager.has_new_url()) {
            try {
                new_url = url_manager.get_new_url();
                console.log('抓取第 ' + currentCount + ' 个页面：' + new_url);
                html_cont = html_downloader.download(new_url);
                new_urls = html_parser.parseUrls(html_cont);
                new_data = html_parser.parseData(new_url, html_cont);
                url_manager.add_new_urls(new_urls);
                html_outputer.collect_data(new_data);
                if (currentCount > 100) {
                    break;
                }
                currentCount++;
            } catch (err) {
                console.log('抓取第 ' + currentCount + ' 个页面失败：' + new_url);
            }
        }
        downloadFile('百度百科爬取结果.html', html_outputer.output_html());
    }
}

//	url管理器
var url_manager = {
    new_urls: [],
    old_urls: [],
    add_new_url: function(urlStr) {
        if (typeof urlStr == "undefined" || urlStr === null || urlStr === "") {
            return;
        } else if (!(this.new_urls.includes(urlStr)) && !(this.old_urls.includes(urlStr))) {
            this.new_urls.push(urlStr);
        }
    },
    add_new_urls: function(urlStrs) {
        //	push可以用一个元素作为参数，也可以用一个数组作为参数
        if (typeof urlStrs == "undefined" || urlStrs === null || urlStrs === "") {
            return;
        } else {
            urlStrs.forEach(function(oneUrl) {
                // 注意这里的this会不会指向forEach内的这个函数？
                // 查看this是不是指向的url_manager。实际上指向了window，估计是forEach的影响，因为上面add_new_url中的this是正常的。
                url_manager.add_new_url(oneUrl);
            });
        }
    },
    has_new_url: function() {
        return this.new_urls.length !== 0;
    },
    get_new_url: function() {
        let new_url;
        new_url = this.new_urls.pop();
        this.old_urls.push(new_url);
        return new_url;
    }
}

//	页面下载器
var html_downloader = {
    download: function(urlStr) {
        let tempResult;
        if (typeof urlStr == "undefined" || urlStr === null || urlStr === "") {
            return;
        } else {
            /*	
					特别注意，ajax默认异步执行，在抓取到数据之前就执行下一步动作了。
					所以ajax中要设置一个选项 async: false ，同步执行。
					仅仅如此还不够，要将ajax纳入到一个“立即执行函数”中去。
					正确写法：(function($.ajax({async: false,});){}())
				*/
            (function() {
                $.ajax({
                    type: 'GET',
                    url: urlStr,
                    async: false,
                    success: function(result) {
                        tempResult = result;
                    },
                    error: function(message) {
                        console.log('抓取页面失败！');
                        console.log(message.statusText);
                        return;
                    }
                });
            }())

            return tempResult;
        }
    }
}

//	页面解析器
var html_parser = {
    parseUrls: function(html_cont) {
        if (typeof html_cont == "undefined" || html_cont === null || html_cont === "") {
            return;
        } else {
            try {
                let parser = new DOMParser();
                htmlDoc = parser.parseFromString(html_cont, "text/html");
                let links = htmlDoc.querySelectorAll('a[href*="/item/"]');
                let new_url, new_urls = [];
                for (let link of links) {
                    new_url = link.href;
                    new_urls.push(new_url);
                }
                console.log(new_urls.length);
                return new_urls;
            } catch (e) {
                console.log('解析页面内链接出现错误\t' + e.name + ": " + e.message);
            }
        }
    },
    parseData: function(pageUrl, html_cont) {
        if (typeof html_cont == "undefined" || html_cont === null || html_cont === "") {
            return;
        } else {
            try {
                let parser = new DOMParser();
                let res_data = {}, title_node, summary_node;
                htmlDoc = parser.parseFromString(html_cont, "text/html");
                title_node = htmlDoc.querySelector('dd[class="lemmaWgt-lemmaTitle-title"]').querySelector('h1');
                res_data.title = title_node.innerText;

                summary_node = htmlDoc.querySelector('div[class="lemma-summary"]');
                res_data.summary = summary_node.innerText;

                res_data.url = pageUrl;

                return res_data;
            } catch (e) {
                console.log('解析页面内数据出现错误\t' + e.name + ": " + e.message);
            }
        }
    }
}

//	结果展示
var html_outputer = {
    datas: [],
    isEmptyObject: function(obj) {
        let name;
        for (name in obj) {
            return false;
        }
        return true;
    },
    collect_data: function(data) {
        if (this.isEmptyObject(data)) {
            return;
        } else {
            this.datas.push(data);
        }
    },
    output_html: function() {
        let fout = '';
        fout = fout + '<html>';
        fout = fout + '<body>';
        fout = fout + '<table>';
        for (item of this.datas) {
            fout = fout + '<tr>';
            fout = fout + '<td>' + item.url + '</td>';
            fout = fout + '<td>' + item.title + '</td>';
            fout = fout + '<td>' + item.summary + '</td>';
            fout = fout + '</tr>';
        }
        fout = fout + '</table>';
        fout = fout + '</body>';
        fout = fout + '</html>';
        return fout;
    }
}

//	导出html
function downloadFile(filename, arr) {
    // 创建隐藏的可下载链接			
    var blob = new Blob([JSON.stringify(arr)]);
    var eleLink = document.createElement('a');
    eleLink.download = filename;
    eleLink.style.display = 'none';
    eleLink.href = URL.createObjectURL(blob);
    // 触发点击
    document.body.appendChild(eleLink);
    eleLink.click();
    // 然后移除
    document.body.removeChild(eleLink);
}

//	启动程序
spider_main.craw(root_url);
