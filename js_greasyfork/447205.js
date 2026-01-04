// ==UserScript==
// @name         志愿辅助助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  广东省2022年高考志愿填报辅助系统助手
// @author       You
// @match        https://zyfz.eesc.com.cn/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=eesc.com.cn
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447205/%E5%BF%97%E6%84%BF%E8%BE%85%E5%8A%A9%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/447205/%E5%BF%97%E6%84%BF%E8%BE%85%E5%8A%A9%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("script started ...");

    // Your code here...

    const { fetch: originalFetch } = window;
    window.fetch = async (...args) => {
        console.log("new fetch");
        let [resource, config] = args;

        let response = await originalFetch(resource, config);

        // response interceptor
        const json = () =>
            response
            .clone()
            .json()
            .then((data) => ({ ...data, title: `Intercepted: hahaha` }));

        response.json = json;
        return response;
    };

    // Returns a Promise that resolves after "ms" Milliseconds
    const timer = ms => new Promise(res => setTimeout(res, ms))

    var createHelperButton = async () => {
        var header = document.querySelector('header.header');
        
        while(header == null) {
            console.log("header is null, wait a sec...");
            await timer(1000);
            header = document.querySelector('header.header');
        }
        let stor = await GM_getValue('pukKey');
        console.log("recomend=", stor);
        // “更多”按钮前插入一个按钮
        var button = document.createElement('button');
        button.innerHTML = "获取所有专业";
        button.setAttribute('id', "btn-get-all-majors");
        button.onclick = getAllMajors;
        header.append(button);

        var buttonGetHistory = document.createElement('button');
        buttonGetHistory.id = "btn-get-history";
        buttonGetHistory.innerHTML = "获取历年数据";
        // buttonGetHistory.style.display = "none";
        buttonGetHistory.onclick = getAllHistory;
        header.append(buttonGetHistory);

        var buttonStop = document.createElement('button');
        buttonStop.id = "btn-stop";
        buttonStop.innerHTML = "停止";
        // buttonStop.style.display = "none";
        buttonStop.onclick = stopAll;
        header.append(buttonStop);

        var buttonAutoAllPages = document.createElement('button');
        buttonAutoAllPages.id = "btn-auto-all-pages";
        buttonAutoAllPages.innerHTML = "添加表格到汇总结果";
        //buttonAutoAllPages.onclick = allNextPages;
        // header.append(buttonAutoAllPages);

        var buttonCopyResults = document.createElement('button');
        buttonCopyResults.id = "btn-copy-results";
        buttonCopyResults.innerHTML = "拷贝汇总结果";
        buttonCopyResults.onclick = showResults;
        header.append(buttonCopyResults);

        var buttonEnableSelect = document.createElement('button');
        buttonEnableSelect.id = "btn-enable-select";
        // buttonEnableSelect.setAttribute("style", "position: fixed; top: 10px; right: 10px; border: 1px solid #00b1f1; background-color: #aaaa; z-index: 9999; display: block; max-height: 400px; max-width:400px; overflow: scroll;");
        buttonEnableSelect.innerHTML = "启用选取";
        buttonEnableSelect.onclick = enableUserSelect;
        // header.append(buttonEnableSelect);

        var results = document.createElement('div');
        results.id = "my-results";
        results.setAttribute("style", "position: fixed; top: 10px; right: 10px; border: 1px solid #00b1f1; background-color: #aaaa; z-index: 9999; display: block; max-height: 400px; max-width:400px; overflow: scroll;");
        results.innerHTML = "<p>结果</p>"
        results.innerHTML = htmlToElement('<table id="my-result-table"><tbody></tbody></table>').outerHTML;
        document.querySelector('body').prepend(results);
    };

    var getLocal = async (key) => {
        //GM_setValue('foo', 'bar');
        // let val = await GM_getValue(key);
        let val = window.localStorage[key]
        // console.log("test local stor val=", val);
        return val;
    }

    /**
 * @param {String} HTML representing a single element
 * @return {Element}
 */
    function htmlToElement(html) {
        var template = document.createElement('template');
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }
    // var td = htmlToElement('<td>foo</td>'),
    //    div = htmlToElement('<div><span>nested</span> <span>stuff</span></div>');

    /**
 * @param {String} HTML representing any number of sibling elements
 * @return {NodeList}
 */
    function htmlToElements(html) {
        var template = document.createElement('template');
        template.innerHTML = html;
        return template.content.childNodes;
    }

    function enableUserSelect() {
        function keydown(e) {
            return 123 == e.keyCode && (e.returnValue = !1),
            !1
        }
        function copyrightDisable() {
            document.oncontextmenu = new Function("event.returnValue=false"),
            document.onselectstart = new Function("event.returnValue=false"),
            window.addEventListener("keydown", keydown)
        }
        function copyrightStart() {
            document.oncontextmenu = "",
            document.onselectstart = !0,
            window.removeEventListener("keydown", keydown)
        }
        copyrightStart();
    }

    async function getAllMajors() {
        console.log("haha getAllMajors");
        var btn = document.querySelector('#btn-get-all-majors');
        btn.innerHTML = `获取所有专业`;

        let yxids = getYuanxiaodaima();
        console.log("yxids = ", yxids);
        
        for (let i=0; i<yxids.length; i++) {
            btn.innerHTML = `获取所有专业...(${i+1}/${yxids.length})`;
            console.log("wait a bit")
            await timer(3000);
            getYxZhuanyezuJihua(yxids[i]);
        };
        // btn.innerHTML = `获取所有专业 (完成)`;
    }

    var zhuanyejihuaResults = [];
    var zhuanyeHistoryResults = [];
    var stop = false;

    function getYuanxiaodaima() { // 获取网页上的院校代码
        let tblRows = [...document.querySelectorAll('div.xzpc div.main table tbody tr')];
        let yxids = tblRows.map((row) => {
            console.log(row);
            // let td = row.querySelector('td.el-table_1_column_3');
            let td = row.querySelectorAll('td')[1];
            return td.textContent;
        });
        return yxids;
    }

    async function getYxZhuanyezuJihua(yxdm, pcMenuId=202221000) { // get校专业组计划
        console.log("getting 校专业组计划 yxdm=", yxdm)
        let authToken = await getLocal('tk');
        let satToken = await getLocal('pukKey');
        let url = `https://zyfz.eesc.com.cn/newgkrecommend/front/xgkzyjh/listXgkYxzyzjh?pcMenuId=${pcMenuId}&preferredSubjectCode=011&selectedSubjectCode=013,016&selectedSubjectRelation=&provinceCode=&jblxdm=&zglbdm=&yx=&zy=&yxzyz=&isYjsy=&isYldx=&isYlxk=&yylbdm=&yxdh=${yxdm}`
        GM_xmlhttpRequest ( {
            method:     "GET",
            url:        url,
            headers: {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,la;q=0.6,zh-TW;q=0.5",
                "authorization": authToken,
                "operfunction": "%E6%9F%A5%E8%AF%A2", // 查询
                "opermenuid": "a70b71511b3544e48846e49cdc659db7",
                "opermodule": "2022%E5%B9%B4%E9%AB%98%E8%80%83%E5%BF%97%E6%84%BF%E5%A1%AB%E6%8A%A5%E8%BE%85%E5%8A%A9%5C%E6%8B%9B%E7%94%9F%E8%AE%A1%E5%88%92%E6%9F%A5%E8%AF%A2", // 2022年高考志愿填报辅助\招生计划查询
                "sat": satToken,
            },
            onload:     async function(resp) {
                // console.log("got respone=", resp);
                let resJson = JSON.parse(resp.response);
                // console.log(resJson);
                if (resJson.code == 200) {
                    let lst = resJson.data.content;
                    for (let i=0; i<lst.length; i++) {
                        console.log(`校专业组计划 (${i+1}/${lst.length})专业`);
                        let yxzyzid = lst[i].yxzyzid;
                        await timer(3000);
                        await getZhuanyeJihua(yxzyzid);
                    }
                }
            },
            onerror:    function (e) { console.error ('**** error ', e); },
            onabort:    function (e) { console.error ('**** abort ', e); },
            ontimeout:  function (e) { console.error ('**** timeout ', e); }
        } );
    }

    // 显示组内专业计划 front/xgkzyjh/listXgkZyjh 专业计划
    async function getZhuanyeJihua(yxzyzid, pcMenuId=202221000) {
        console.log("getting 专业计划 yxzyzid=", yxzyzid)
        let authToken = await getLocal('tk');
        let satToken = await getLocal('pukKey');
        let url = `https://zyfz.eesc.com.cn/newgkrecommend/front/xgkzyjh/listXgkZyjh?pcMenuId=${pcMenuId}&preferredSubjectCode=011&selectedSubjectCode=013,016&selectedSubjectRelation=&provinceCode=&jblxdm=&zglbdm=&yx=&zy=&yxzyz=&isYjsy=&isYldx=&isYlxk=&yylbdm=&yxzyzid=${yxzyzid}`
        GM_xmlhttpRequest ( {
            method:     "GET",
            url:        url,
            headers: {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,la;q=0.6,zh-TW;q=0.5",
                "authorization": authToken,
                "operfunction": "%E6%9F%A5%E8%AF%A2",
                "opermenuid": "a70b71511b3544e48846e49cdc659db7",
                "opermodule": "2022%E5%B9%B4%E9%AB%98%E8%80%83%E5%BF%97%E6%84%BF%E5%A1%AB%E6%8A%A5%E8%BE%85%E5%8A%A9%5C%E6%8B%9B%E7%94%9F%E8%AE%A1%E5%88%92%E6%9F%A5%E8%AF%A2",
                "sat": satToken,
            },
            onload:     function(resp) {
                // console.log("got respone=", resp);
                let resJson = JSON.parse(resp.response);
                console.log("专业计划", resJson)
                zhuanyejihuaResults.push(resJson);
            },
            onerror:    function (e) { console.error ('**** error ', e); },
            onabort:    function (e) { console.error ('**** abort ', e); },
            ontimeout:  function (e) { console.error ('**** timeout ', e); }
        } );
    }

    // 获取专业历年数据
    async function getZhuanyeHistoryData(zydm, yxdm, pcdm, jhlbdm, jhxzFlag=0) {
        console.log("getting 专业历年数据 zydm=" + zydm + " yxdm=" + yxdm);
        let authToken = await getLocal('tk');
        let satToken = await getLocal('pukKey');
        let url = `https://zyfz.eesc.com.cn/newgkrecommend/front/zytjLqZy/xgkMajorsYearEnrollMark?pageIndex=1&pageSize=50&zydm=${zydm}&yxdm=${yxdm}&pcdm=${pcdm}&jhlbdm=${jhlbdm}&jhxzFlag=${jhxzFlag}`
        GM_xmlhttpRequest ( {
            method:     "GET",
            url:        url,
            headers: {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,la;q=0.6,zh-TW;q=0.5",
                "authorization": authToken,
                "sat": satToken,
            },
            onload:     function(resp) {
                // console.log("got respone=", resp);
                let resJson = JSON.parse(resp.response);
                console.log("历年数据", resJson)
                zhuanyeHistoryResults.push(resJson);
            },
            onerror:    function (e) { console.error ('**** error ', e); },
            onabort:    function (e) { console.error ('**** abort ', e); },
            ontimeout:  function (e) { console.error ('**** timeout ', e); }
        } );
    }

    async function getAllHistory() {
        var btn = document.querySelector('#btn-get-history');
        btn.innerHTML = `获取历年数据`;
        stop = false;
        let yxzyLst = [];
        zhuanyejihuaResults.forEach(yuanxiao => {
            yuanxiao.data.content.forEach(zhuanye => {
                yxzyLst.push(zhuanye);
            });
        })
        for (let i=0; i<yxzyLst.length; i++) {
            if (stop) {
                console.log("stopping")
                break;
            }
            console.log(`获取历年数据 (${i+1}/${yxzyLst.length})`);
            btn.innerHTML = `获取历年数据...(${i+1}/${yxzyLst.length})`;
            let { zydm, yxdm, pcdm, jhlbdm } = {...yxzyLst[i]}
            await timer(3000);
            await getZhuanyeHistoryData(zydm, yxdm, pcdm, jhlbdm);
        }
        btn.innerHTML = `获取历年数据 (完成)`;
    }

    async function stopAll() {
        stop = true;
    }

    function showResults() {
        console.log(zhuanyejihuaResults);
        console.log(zhuanyeHistoryResults);
        var dat = {zhuanyejihuaResults, zhuanyeHistoryResults};
        var a = document.createElement("a");
        a.href = "data:text," + JSON.stringify(dat);   //content
        a.download = "result.json";            //file name
        // a.click();

        let arrHistory = [];
        let header = zhuanyeHistoryResults[0].data.header.map(elm => elm.title);
        let keys = zhuanyeHistoryResults[0].data.header.map(elm => elm.key);
        arrHistory.push(header);
        zhuanyeHistoryResults.forEach(resp => {
            resp.data.content.map(row => {
                let newRow = keys.map(key => {
                    // console.log(row[key]);
                    return (typeof row[key] === 'string' && row[key].includes(',')) ? `"${row[key]}"` : row[key]
                });
                arrHistory.push(newRow);
            });
        });
        console.log(arrHistory);
        let csvContent = "data:text/csv;charset=utf-8," 
        + arrHistory.map(e => e.join(",")).join("\n");

        var encodedUri = encodeURI(csvContent);
        var a = document.createElement("a");
        a.href = encodedUri;
        a.download = "历年数据.csv";            //file name
        a.click();
    }

    // 页码加载完成后创建按钮
    if (location.hostname == 'zyfz.eesc.com.cn') {
        enableUserSelect();
        window.addEventListener('load', createHelperButton, false);
        window.addEventListener('popstate', createHelperButton, false);
        window.addEventListener('hashchange', createHelperButton, false);
    }

    
})();