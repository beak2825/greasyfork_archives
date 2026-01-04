// ==UserScript==
// @name         Douban_Gzlib
// @name:zh-CN   豆瓣x广州图书馆
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  查询广州图书馆可借阅馆藏
// @author       https://honwhy.wang
// @license      GPLv3
// @match        https://book.douban.com/subject/*
// @grant        GM.xmlHttpRequest
// @connect      opac.gzlib.org.cn
// @downloadURL https://update.greasyfork.org/scripts/457387/Douban_Gzlib.user.js
// @updateURL https://update.greasyfork.org/scripts/457387/Douban_Gzlib.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    const info = document.querySelector("#info")
    var cts = info.textContent.split(/\n/).filter(item => item.replaceAll(/\s|\t| /g,'').length> 0)
    var isbn = cts[cts.length-1].match(/(\d+)/)[1]
    console.log(isbn)
    if(isbn) {
        console.log('begin to search')
        let bookHtml = await getBooks({isbn: isbn});
        var ms = bookHtml.match(/bookrecno=([0-9]+)/mg);
        if(ms) {
            var nos = ms.map(m => {
                return m.split('=')[1];
            });
            if(nos && nos.length > 0) {
                let nameToCount = await getBorrowable(nos.join(','));
                showResult(nameToCount, nos[0]);
            }
        } else {
            showResult({});
        }
    }

    async function getBooks(request) {
        let {isbn, title} = request;
        if (isbn == 0) {
            return {};
        }
        var url = '';
        if (title) {
            url = `https://opac.gzlib.org.cn/opac/search?&q=${title}&searchWay=title&sortWay=score&sortOrder=desc&scWay=dim&hasholding=1&curlibcode=TH&curlibcode=NS&curlibcode=BY&curlibcode=HP&curlibcode=PY&curlibcode=YT&curlibcode=LW&curlibcode=GT&curlibcode=HZQ&searchSource=reader`;
        } else {
            url = `https://opac.gzlib.org.cn/opac/search?searchWay0=isbn&q0=${isbn}&logical0=AND&searchWay1=&q1=&logical1=AND&searchWay2=&q2=&searchSource=reader&marcformat=&sortWay=score&sortOrder=desc&startPubdate=&endPubdate=&rows=10&hasholding=1&curlibcode=GT&curlibcode=YT&curlibcode=HZQ&curlibcode=LW&curlibcode=TH&curlibcode=BY&curlibcode=HP&curlibcode=PY&curlibcode=NS`;
        }
        return new Promise((resolve, reject) => {
            try {
                GM.xmlHttpRequest({
                    method: "POST",
                    url: url,
                    //data: "username=johndoe&password=xyz123",
                    //headers: {
                    //    "Content-Type": "application/x-www-form-urlencoded"
                    //},
                    onload: function(response) {
                        if(response.status == 200) {
                            var text = response.responseText;
                            return resolve(text);
                        }
                        return reject(Error("failed"))
                    }
                });
            } catch(e){
                return reject(Error("something bad happened"))
            }
        })

    }
    async function getBorrowable(item) {
        let url = `https://opac.gzlib.org.cn/opac/book/holdingPreviews?bookrecnos=${item}&curLibcodes=HZQ%2CGT%2CLW%2CYT%2CPY%2CHP%2CBY%2CNS%2CTH&return_fmt=json`;
        var text = '{}';
        return new Promise((resolve, reject) => {
            try {
                GM.xmlHttpRequest({
                    method: "POST",
                    url: url,
                    onload: function(response) {
                        if(response.status != 200) {
                            return reject(Error("failed"));
                        }
                        var text = response.responseText;
                        var json = JSON.parse(text);
                        let nameToCount = {};
                        var bookrecno = '';
                        if (json && json['previews']) {
                            Object.keys(json['previews']).forEach(key => {
                                // item => {bookrecno: 3005135912, callno: 'I247.57/10039', curlib: 'NS', curlibName: '南沙区图书馆', curlocal: 'NS-LHZTSS', …}
                                var a = json['previews'][key];
                                a.forEach(item => {
                                    if(item.loanableCount > 0) {
                                        if(nameToCount[item.curlibName]) {
                                            nameToCount[item.curlibName] += item.loanableCount;
                                        } else {
                                            nameToCount[item.curlibName] = item.loanableCount;
                                        }
                                    }
                                    bookrecno = item.bookrecno;
                                });
                            })

                        }
                        return resolve(nameToCount);
                    }
                })
            } catch(e) {
                return reject(Error("something bad happened"))
            }
        })
    }

    function showResult(nameToCount, bookrecno) {
        // set to html
        var aside = document.querySelector(".aside");

        var gray = document.createElement('div');
        gray.classList = 'gray_ad version_works';
        gray.style.display = 'block';
        var h2 = document.createElement('h2');
        h2.textContent = '广州图书馆可借馆藏（非官方）';
        gray.appendChild(h2);
        if(Object.keys(nameToCount).length == 0) {
            var ul = document.createElement("ul");
            ul.classList = "bs current-version-list";
            var wrapper = document.createElement("div");
            wrapper.classList = "cell price-btn-wrapper";
            ul.appendChild(wrapper);
            var buyInfo = document.createElement("div");
            buyInfo.classList = "cell impression_track_mod_buyinfo";
            wrapper.appendChild(buyInfo);
            var cell = document.createElement("div");
            cell.classList="cell";
            buyInfo.appendChild(cell);
            var a = document.createElement("a");
            a.classList="buy-book-btn e-book-btn";
            cell.appendChild(a);
            var span = document.createElement("span");
            span.textContent = "暂无查询结果";
            a.appendChild(span);

            gray.appendChild(ul);
        } else {
            var ul = document.createElement('ul');
            let url = `https://opac.gzlib.org.cn/opac/book/${bookrecno}`;
            Object.keys(nameToCount).forEach(key => {
                var cnt = nameToCount[key];
                var li = document.createElement('li');
                li.styleList = 'mb8 pl';
                var a = document.createElement('a');
                a.href = url;
                a.textContent = `${key} (${cnt})`;
                li.appendChild(a);

                ul.appendChild(li);
            })
            gray.appendChild(ul);
        }
        

        aside.prepend(gray);
    }
})();
