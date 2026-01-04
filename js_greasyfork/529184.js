// ==UserScript==
// @name         JiangSu2HuNan-Script
// @namespace    http://tampermonkey.net/
// @version      v0.0.1
// @description  jiangsu2hunan tools
// @author       Hunter
// @match        *://e.jssh.org.cn/*
// @match        *://m.e.jssh.org.cn/*
// @match        *://ae.jssh.org.cn/*
// @match        *://test.qikangkang.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jssh.org.cn
// @license AGPL
// @downloadURL https://update.greasyfork.org/scripts/529184/JiangSu2HuNan-Script.user.js
// @updateURL https://update.greasyfork.org/scripts/529184/JiangSu2HuNan-Script.meta.js
// ==/UserScript==
// @run-at       document-start
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @grant        unsafeWindow

(function() {
    'use strict';

    // 请再次粘贴顶部背景图片地址
    // 例子: var indexBackgroundImageUrl = "https://e.jssh.org.cn/sgslxxhgc/upload/20230821/943947e410419414dc29e0a6bf14433e.jpg"
    var indexBackgroundImageUrl = ""

    setInterval(() => {
        document.title = document.title.replace(/苏商E家/g, '数字工商联')
        if (window.location.href.includes("portal/database?id=2")) {
            replaceDom();
        }
        if (window.location.href.includes("portal/myApp?id=1")) {
            const observer = new MutationObserver(() => {
                document.querySelectorAll('p[data-v-feedbd7c]').forEach(item => {
                    if (item.textContent === "舆情分析研判") {
                        item.textContent = "风险预警服务"
                        observer.disconnect();
                    }
                })
            });
            observer.observe(document.body, { childList: true, subtree: true, characterData: true });
        }
        if (window.location.href.includes("m.e.jssh.org.cn/pop")) {
            const observer = new MutationObserver(() => {
                document.getElementsByClassName('logo-title')[0].textContent = "风险预警服务";
                document.title = document.title.replace(/舆情分析研判/g, '风险预警服务')
                document.querySelectorAll('.el-menu-item').forEach(item => {
                    if (item.textContent.includes("监测任务")) {
                        item.textContent = "舆情监测与分析"
                    }
                    if (item.textContent.includes("监测推送")) {
                        item.textContent = "预警通知渠道"
                        observer.disconnect();
                    }
                })
                observer.disconnect();
            });
            observer.observe(document.body, { childList: true, subtree: true, characterData: true });
        }
        document.querySelectorAll('.menu-normal, .menu-active').forEach(item => {
            if (item.textContent.includes("领导驾驶舱")) {
                item.textContent = item.textContent.replace("领导驾驶舱", "大数据服务");
            }
        })
    }, 50);
    // start
    window.onload=function(){
        document.title = document.title.replace(/苏商E家/g, '数字工商联')
        init2YunNan()
    }
    const originOpen = XMLHttpRequest.prototype.open;
    //XMLHttpRequest.prototype.open = function (_, url) {
    XMLHttpRequest.prototype.open = function (method, url, async, user, pass) {
        if (url.includes("big-screen")) {
            url = url.replace('year=2024', 'year=2023')
        }
        console.log("----> "+url)
        if (url.includes("big-screen/geojson/320000.json")) {
            url = url.replace('320000', '430000')
        } else {
            // if (url.includes("jssh-service/big-screen"))
            this.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    let res = this.responseText;
                    console.log(url)
                    //console.log(res)
                    // 当前 xhr 对象上定义 responseText
                    Object.defineProperty(this, "responseText", {
                        writable: true,
                    });
                    this.responseText = replaceGeo(res);
                }
            });
        }

        originOpen.call(this, method, url, async || true, user, pass);
        //originOpen.apply(this, arguments);
    };

    function replaceDom() {
        console.log("进入 portal/database?id=2 替换字符😉");

        // 优化DOM操作性能‌:ml-citation{ref="1,2" data="citationList"}
        const observer = new MutationObserver(() => {
            var claW = document.getElementsByClassName('w')[0];
            var claC = document.getElementsByClassName('c')[0];
            var claB = document.getElementsByClassName('b')[0];
            if (claW.innerText !== "民营企业基本数据库") {
                claW.innerText = "民营企业基本数据库";
                claW.style.display = 'inline-table';
                claC.innerText = "商会基础数据库";
                claC.style.display = 'inline-table';
                claB.innerText = "各级工商联组织结构数据库";
                claB.style.display = 'inline-table';
                observer.disconnect(); // 替换完成后停止监听‌:ml-citation{ref="4" data="citationList"}
            }
        });

        // 监听DOM变化避免内容加载延迟‌:ml-citation{ref="4" data="citationList"}
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    function useFetchData() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", 'https://e.jssh.org.cn/big-screen/geojson/430000.json', false);
        xhr.send();
        return xhr.responseText
    }
    // url变化监听器
    setInterval(function() {
        init2YunNan()
    }, 100)
    function init2YunNan() {
        var textNodes = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);

        // 遍历文本节点并替换文本
        while (textNodes.nextNode()) {
            var node = textNodes.currentNode;
            node.nodeValue = replaceGeo(node.nodeValue);
        }

        // 替换工商联组织树
        window.sessionStorage.setItem('saber_jssh-deptTree', JSON.stringify(getDeptTree()));

        // 设置背景图像
        if (indexBackgroundImageUrl) {
            // 获取具有 id 为 "portal-header" 的元素
            var header = document.getElementById('portal-header');
            header.style.backgroundImage = 'url("'+ indexBackgroundImageUrl +'")';
        }
    }

    function replaceGeo(res) {
        res = res.replace(/江苏/g, '湖南')
        res = res.replace(/南京/g, '长沙')
        res = res.replace(/江苏省/g, '湖南省')
        res = res.replace(/南京市/g, '长沙市').replace(/320100/g, '118005')
        res = res.replace(/苏州市/g, '株洲市').replace(/320200/g, '118002')
        res = res.replace(/无锡市/g, '永州市').replace(/320300/g, '118011')
        res = res.replace(/常州市/g, '怀化市').replace(/320400/g, '118012')
        res = res.replace(/徐州市/g, '湘潭市').replace(/320500/g, '118003')
        res = res.replace(/南通市/g, '娄底市').replace(/320600/g, '118013')
        res = res.replace(/连云港市/g, '郴州市').replace(/320700/g, '118010')
        res = res.replace(/淮安市/g, '益阳市').replace(/320800/g, '118009')
        res = res.replace(/盐城市/g, '邵阳市').replace(/320900/g, '118001')
        res = res.replace(/扬州市/g, '湘西土家族苗族自治州').replace(/321000/g, '118014')
        res = res.replace(/镇江市/g, '衡阳市').replace(/321100/g, '118004')
        res = res.replace(/泰州市/g, '常德市').replace(/321200/g, '118007')
        res = res.replace(/宿迁市/g, '岳阳市').replace(/321300/g, '118006')
        return res
    }
    function getDeptTree() {
        return {
    "dataType": "object",
    "content": [
        {
            "id": "1494598399570276353",
            "parentId": "1494598356398305282",
            "children": [
                {
                    "id": "1494598399654162433",
                    "parentId": "1494598399570276353",
                    "children": [
                        {
                            "id": "1494598400367194113",
                            "parentId": "1494598399654162433",
                            "hasChildren": false,
                            "title": "岳麓区",
                            "key": "1494598400367194113",
                            "value": "1494598400367194113",
                            "accountCount": 5
                        },
                        {
                            "id": "1494598399939375106",
                            "parentId": "1494598399654162433",
                            "hasChildren": false,
                            "title": "芙蓉区",
                            "key": "1494598399939375106",
                            "value": "1494598399939375106",
                            "accountCount": 10
                        },
                        {
                            "id": "1494598399792574466",
                            "parentId": "1494598399654162433",
                            "hasChildren": false,
                            "title": "天心区",
                            "key": "1494598399792574466",
                            "value": "1494598399792574466",
                            "accountCount": 3
                        },
                        {
                            "id": "1494598400144896002",
                            "parentId": "1494598399654162433",
                            "hasChildren": false,
                            "title": "开福区",
                            "key": "1494598400144896002",
                            "value": "1494598400144896002",
                            "accountCount": 6
                        },
                        {
                            "id": "1494598400316862466",
                            "parentId": "1494598399654162433",
                            "hasChildren": false,
                            "title": "雨花区",
                            "key": "1494598400316862466",
                            "value": "1494598400316862466",
                            "accountCount": 5
                        },
                        {
                            "id": "1494598400102952961",
                            "parentId": "1494598399654162433",
                            "hasChildren": false,
                            "title": "望城区",
                            "key": "1494598400102952961",
                            "value": "1494598400102952961",
                            "accountCount": 5
                        },
                        {
                            "id": "1494598400421720066",
                            "parentId": "1494598399654162433",
                            "hasChildren": false,
                            "title": "长沙县",
                            "key": "1494598400421720066",
                            "value": "1494598400421720066",
                            "accountCount": 3
                        },
                        {
                            "id": "1494598400274919426",
                            "parentId": "1494598399654162433",
                            "hasChildren": false,
                            "title": "宁乡市",
                            "key": "1494598400274919426",
                            "value": "1494598400274919426",
                            "accountCount": 6
                        },
                        {
                            "id": "1494598400232976385",
                            "parentId": "1494598399654162433",
                            "hasChildren": false,
                            "title": "浏阳市",
                            "key": "1494598400232976385",
                            "value": "1494598400232976385",
                            "accountCount": 5
                        }
                    ],
                    "hasChildren": true,
                    "title": "长沙市",
                    "key": "1494598399654162433",
                    "value": "1494598399654162433",
                    "accountCount": 45
                },
                {
                    "id": "1494598402460151809",
                    "parentId": "1494598399570276353",
                    "children": [
                        {
                            "id": "1494598402892165121",
                            "parentId": "1494598402460151809",
                            "hasChildren": false,
                            "title": "荷塘区",
                            "key": "1494598402892165121",
                            "value": "1494598402892165121",
                            "accountCount": 8
                        },
                        {
                            "id": "1494598402661478402",
                            "parentId": "1494598402460151809",
                            "hasChildren": false,
                            "title": "芦淞区",
                            "key": "1494598402661478402",
                            "value": "1494598402661478402",
                            "accountCount": 9
                        },
                        {
                            "id": "1494598402707615745",
                            "parentId": "1494598402460151809",
                            "hasChildren": false,
                            "title": "石峰区",
                            "key": "1494598402707615745",
                            "value": "1494598402707615745",
                            "accountCount": 6
                        },
                        {
                            "id": "1494598402837639170",
                            "parentId": "1494598402460151809",
                            "hasChildren": false,
                            "title": "天元区",
                            "key": "1494598402837639170",
                            "value": "1494598402837639170",
                            "accountCount": 6
                        },
                        {
                            "id": "1494598402942496770",
                            "parentId": "1494598402460151809",
                            "hasChildren": false,
                            "title": "渌口区",
                            "key": "1494598402942496770",
                            "value": "1494598402942496770",
                            "accountCount": 6
                        },
                        {
                            "id": "1494598402577592321",
                            "parentId": "1494598402460151809",
                            "hasChildren": false,
                            "title": "醴陵市",
                            "key": "1494598402577592321",
                            "value": "1494598402577592321",
                            "accountCount": 9
                        }
                    ],
                    "hasChildren": true,
                    "title": "株洲市",
                    "key": "1494598402460151809",
                    "value": "1494598402460151809",
                    "accountCount": 24
                },
                {
                    "id": "1494598404125290497",
                    "parentId": "1494598399570276353",
                    "children": [
                        {
                            "id": "1494598404335005697",
                            "parentId": "1494598404125290497",
                            "hasChildren": false,
                            "title": "雨湖区",
                            "key": "1494598404335005697",
                            "value": "1494598404335005697",
                            "accountCount": 9
                        },
                        {
                            "id": "1494598404393725953",
                            "parentId": "1494598404125290497",
                            "hasChildren": false,
                            "title": "岳塘区",
                            "key": "1494598404393725953",
                            "value": "1494598404393725953",
                            "accountCount": 3
                        },
                        {
                            "id": "1494598404435668993",
                            "parentId": "1494598404125290497",
                            "hasChildren": false,
                            "title": "湘乡市",
                            "key": "1494598404435668993",
                            "value": "1494598404435668993",
                            "accountCount": 8
                        },
                        {
                            "id": "1494598404557303810",
                            "parentId": "1494598404125290497",
                            "hasChildren": false,
                            "title": "韶山市",
                            "key": "1494598404557303810",
                            "value": "1494598404557303810",
                            "accountCount": 6
                        }
                    ],
                    "hasChildren": true,
                    "title": "湘潭市",
                    "key": "1494598404125290497",
                    "value": "1494598404125290497",
                    "accountCount": 29
                },

                {
                    "id": "1494598406180499457",
                    "parentId": "1494598399570276353",
                    "children": [
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "绥宁县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "邵东县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "新邵县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "双清区", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "北塔区", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "大祥区", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "隆回县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "邵阳县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "新宁县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "洞口县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "城步苗族自治县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "武冈市", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                    ],
                    "hasChildren": true,
                    "title": "邵阳市",
                    "key": "1494598406180499457",
                    "value": "1494598406180499457",
                    "accountCount": 13
                },
                {
                    "id": "1494598401143140353",
                    "parentId": "1494598399570276353",
                    "children": [
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "东安县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "新田县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "江华瑶族自治县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "江永县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "宁远县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "蓝山县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "祁阳县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "零陵区", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "冷水滩区", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "双牌县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "道县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },

                    ],
                    "hasChildren": true,
                    "title": "永州市",
                    "key": "1494598401143140353",
                    "value": "1494598401143140353",
                    "accountCount": 37
                },

                {
                    "id": "1494598401843589122",
                    "parentId": "1494598399570276353",
                    "children": [
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "溆浦县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "会同县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "洪江市", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "靖州苗族侗族自治县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "芷江侗族自治县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "通道侗族自治县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "中方县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "鹤城区", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "洪江区", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "沅陵县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "辰溪县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "麻阳苗族自治县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "新晃侗族自治县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },

                    ],
                    "hasChildren": true,
                    "title": "怀化市",
                    "key": "1494598401843589122",
                    "value": "1494598401843589122",
                    "accountCount": 34
                },
                {
                    "id": "1494598400551743490",
                    "parentId": "1494598399570276353",
                    "children": [
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "新化县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "冷水江市", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "娄星区", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "双峰县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "涟源市", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },

                    ],
                    "hasChildren": true,
                    "title": "娄底市",
                    "key": "1494598400551743490",
                    "value": "1494598400551743490",
                    "accountCount": 26
                },

                {
                    "id": "1494598403550670849",
                    "parentId": "1494598399570276353",
                    "children": [
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "永兴县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "嘉禾县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "北湖区", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "苏仙区", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "临武县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "汝城县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "桂阳县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "桂东县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "安仁县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "宜章县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "资兴市", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },

                    ],
                    "hasChildren": true,
                    "title": "郴州市",
                    "key": "1494598403550670849",
                    "value": "1494598403550670849",
                    "accountCount": 21
                },
                {
                    "id": "1494598405236781058",
                    "parentId": "1494598399570276353",
                    "children": [
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "沅江市", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "资阳区", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "安化县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "赫山区", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "南县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "桃江县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },

                    ],
                    "hasChildren": true,
                    "title": "益阳市",
                    "key": "1494598405236781058",
                    "value": "1494598405236781058",
                    "accountCount": 14
                },

                {
                    "id": "1494598406746730497",
                    "parentId": "1494598399570276353",
                    "children": [
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "吉首市", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "龙山县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "泸溪县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "凤凰县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "古丈县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "花垣县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "保靖县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "永顺县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },

                    ],
                    "hasChildren": true,
                    "title": "湘西土家族苗族自治州",
                    "key": "1494598406746730497",
                    "value": "1494598406746730497",
                    "accountCount": 23
                },
                {
                    "id": "1494598403001217025",
                    "parentId": "1494598399570276353",
                    "children": [
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "衡山县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "衡东县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "祁东县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "珠晖区", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "雁峰区", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "石鼓区", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "蒸湘区", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "耒阳市", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "常宁市", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "南岳区", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "衡阳县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "衡南县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },

                    ],
                    "hasChildren": true,
                    "title": "衡阳市",
                    "key": "1494598403001217025",
                    "value": "1494598403001217025",
                    "accountCount": 27
                },

                {
                    "id": "1494598404808962049",
                    "parentId": "1494598399570276353",
                    "children": [
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "鼎城区", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "安乡县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "汉寿县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "澧县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "武陵区", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "石门县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "津市市", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "临澧县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "桃源县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },

                    ],
                    "hasChildren": true,
                    "title": "常德市",
                    "key": "1494598404808962049",
                    "value": "1494598404808962049",
                    "accountCount": 2
                },
                {
                    "id": "1494598405794623490",
                    "parentId": "1494598399570276353",
                    "children": [
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "岳阳县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "华容县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "湘阴县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "平江县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "岳阳楼区", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "君山区", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "屈原区", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "云溪区", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "南湖新区", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "经济开发区", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "汨罗市", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "临湘市", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "临港新区", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },

                    ],
                    "hasChildren": true,
                    "title": "岳阳市",
                    "key": "1494598405794623490",
                    "value": "1494598405794623490",
                    "accountCount": 17
                },
                {
                    "id": "1494598405794623490",
                    "parentId": "1494598399570276353",
                    "children": [
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "武陵源区", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "慈利县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "桑植县", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },
                        { "id": "1494598406260191234", "parentId": "1494598406180499457", "hasChildren": false, "title": "永定区", "key": "1494598406260191234", "value": "1494598406260191234", "accountCount": 11 },

                    ],
                    "hasChildren": true,
                    "title": "张家界市",
                    "key": "1494598405794623490",
                    "value": "1494598405794623490",
                    "accountCount": 17
                }
            ],
            "hasChildren": true,
            "title": "湖南省",
            "key": "1494598399570276353",
            "value": "1494598399570276353",
            "accountCount": 79
        }
    ],
    "type": "session",
    "datetime": 1741424000934
};
    }

})();