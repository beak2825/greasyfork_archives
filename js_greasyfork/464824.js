// ==UserScript==
// @name        CNKI 中英 RIS Helper
// @namespace   Violentmonkey Scripts
// @match       https://kns.cnki.net/kcms2/*
// @grant       none
// @version     1.4.1
// @author      笔墨纸砚
// @require     https://cdn.jsdelivr.net/npm/pinyin4js@1.3.18/dist/pinyin4js.min.js
// @description 2023/4/25 08:12:48
// @grant        GM_downlaod
// @license      MIT
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/464824/CNKI%20%E4%B8%AD%E8%8B%B1%20RIS%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/464824/CNKI%20%E4%B8%AD%E8%8B%B1%20RIS%20Helper.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 获取文件ID和数据库名称
    const fileId = document.getElementById('paramfilename').value;
    const dbCode = document.getElementById('paramdbcode').value;
    const dbName = document.getElementById('paramdbname').value;
    const title = document.getElementsByClassName('wx-tit')[0].children[0].text;
    const dfilename = document.querySelector("body > div.wrapper > div.main > div.container > div > div > input.infocheckbox").value.replace(/\n/g, "");
    const dcookie = document.cookie;
    const dReferer = window.location.href;
    // 下载RIS文件的函数
    function downloadRis(lang) {
        var name=document.querySelector("body > div.wrapper > div.main > div.container > div > div > div.brief > div > h1").text;
        downloadByFilename(fileId, dbName, name, dbCode, 'EndNote', lang,dfilename,dReferer,dcookie);
    }

    // 创建下载按钮
    function createExportButton(lang) {
        var exportButton  = document.createElement('li');
        exportButton.setAttribute('class', 'btn-html');
        exportButton.innerText = 'Export RIS';
        exportButton.innerHTML = '<a><i></i>RIS-'+lang+'</a>';
        exportButton.firstElementChild.style.backgroundColor = '#4CAF50';
        exportButton.onclick = function() {
              downloadRis(lang);

        };
        var buttonBox = document.getElementsByClassName('operate-btn');
        buttonBox[0].appendChild(exportButton);

    }


    // 判断当前页面是否为文章详情页
    var isArticlePage = document.querySelector('#kns8Sug') === null;

    if (isArticlePage) {
        // 添加下载按钮
        createExportButton('en');
        createExportButton('cn');
    }

    // type can be EndNote or Refworks
function downloadByFilename(fileId, dbName, name, dbCode,type = 'EndNote',lang,dfilename,dReferer,dcookie) {
    GM_xmlhttpRequest({
        method: "POST",
        url: "https://kns.cnki.net/dm/API/GetExport?uniplatform=NZKPT",
        data: 'filename='+dfilename+'&displaymode=EndNote',
        headers: {
            'Host': 'kns.cnki.net',
            'Origin': 'https://kns.cnki.net',
            'Referer': dReferer,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': dcookie
        },
        onload: function (res) {
            if (res.status == 200) {
                var text = JSON.parse(res.responseText).data[0].value[0];
                text= JSON.stringify(text);
                text = text.replaceAll('<br>', '\r\n').replace(/^\"|\"$/g, '');
                text = text.replace(/<[^>\u4e00-\u9fa5]+>/g, "");
                text = text.replace(/%A/g, "\n%A").replace('\n\n','\n');
                // 获取当前年份
                var currentYear = new Date().getFullYear();
                var month  = new Date().getMonth()+1;
                var strDate   = new Date().getDate();
                // 检查文本中是否包含 %D
                if (!text.includes('%D')) {
                  // 在文本中添加 %D 当前年份\n
                  text += "%D " + currentYear+'-'+month+'-'+ strDate + "\n";
                }
                if (text.includes('%I')) {
                  // 在文本中添加 %D 当前年份\n
                  text += "%C " + document.querySelector("#func608 > div > span:nth-child(2)").text.replace(/市|省/g,'') + "\n";
                }
                text += "%L "+ document.querySelector('#pdfDown').href+ "\n";
                // 判断一下语言，减少对api调用
                if (lang === 'cn') {
                  var a = document.createElement('a');
                  a.href = 'data:application/x-EndNote-tagged; charset=utf-8,' + encodeURIComponent(text);
                  //supported by chrome 14+ and firefox 20+
                  a.download = name.replace('null','') + '_cn.enw';
                  //needed for firefox
                  document.getElementsByTagName('body')[0].appendChild(a);
                  //supported by chrome 20+ and firefox 5+
                  a.click();
                  console.log(text);
                }else {
                  var titleUrl ='https://vercel-proxy-cnki.vercel.app/kcms/detail/detail.aspx?dbcode='+dbCode+'&filename=' + fileId+ "&displaymode=" + type + "&orderparam=0&ordertype=desc&selectfield=&dbname=" + dbName + "&random=" + Math.random();
                  console.log(titleUrl)
                  GM_xmlhttpRequest({
                      method: "GET",
                      url: titleUrl,
                      onload: function (res1) {
                          if (res1.status == 200) {
                            var parser = new DOMParser();
                            var htmlDoc = parser.parseFromString(res1.responseText, "text/html");
                            var title = htmlDoc.querySelector('body > div.wrapper > div.main > div.container > div > div > div.brief > div > h1 ').innerText.replace(/(Chinese Full Text|English Full Text \(MT\))/g, '');
                            var text1 = text.replace(/(%T\s)[^%\n]*(?=\n)/, '$1' + title);
                            var summary = htmlDoc.querySelector("#ChDivSummary").text;
                            var text1 = text1.replace(/(%X\s)[^%\n]*(?=\n)/, '$1' + summary);
                            if (text1.includes('%J')){
                                var journal = htmlDoc.querySelector("body > div.wrapper > div.main > div.container > div > div > div.top-first > div.top-tip > span > a").text;
                                journal= journal.replace(/\n/g, '').replace(/\./g, '').trim();
                            }
                            // 获取原始 RIS 文本中的所有 %A 开头的行
                            var text1 = text1.replace(/%A\s([\u4e00-\u9fa5]+)/g, function(match, chineseName) {
                            var swappedName = chineseName.substr(1) + chineseName[0];
                            var pinyinName = PinyinHelper.convertToPinyinString(swappedName, " ", PinyinFormat.WITHOUT_TONE).toUpperCase();
                            return '%A ' + pinyinName + "\n";
                            });
                            var text1 = text1.replace(/(%J\s)[^%\n]*(?=\n)/, '$1' + journal);
                            text1 += "%N  (in Chinese)\n";
                            var a = document.createElement('a');
                            a.href = 'data:application/x-EndNote-tagged; charset=utf-8,' + encodeURIComponent(text1);
                            //supported by chrome 14+ and firefox 20+
                            a.download = name.replace('null','') + '_en.enw';
                            //needed for firefox
                            document.getElementsByTagName('body')[0].appendChild(a);
                            //supported by chrome 20+ and firefox 5+
                            a.click();
                            confirm("下载需要等待5-6s，请耐心等待！")
                            console.log(text1);
                          }
                      }
                  });

                }
            }
        }
    });
}

})();
