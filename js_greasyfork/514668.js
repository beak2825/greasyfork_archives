// ==UserScript==
// @name         JiangSu2FuJian-Script
// @namespace    http://tampermonkey.net/
// @version      v0.0.1
// @description  jiangsu2fujian tools
// @author       Hunter
// @match        *://e.jssh.org.cn/*
// @match        *://ae.jssh.org.cn/*
// @match        *://test.qikangkang.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jssh.org.cn
// @license AGPL
// @downloadURL https://update.greasyfork.org/scripts/514668/JiangSu2FuJian-Script.user.js
// @updateURL https://update.greasyfork.org/scripts/514668/JiangSu2FuJian-Script.meta.js
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
    }, 50);
    // start
    window.onload=function(){
        document.title = document.title.replace(/苏商E家/g, '数字工商联')
        init2YunNan()
    }
    const originOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (_, url) {
        if (url.includes("big-screen/geojson/320000.json")) {
            this.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    // 当前 xhr 对象上定义 responseText
                    Object.defineProperty(this, "responseText", {
                        writable: true,
                    });
                    let res = useFetchData();
                    //console.log(res)
                    this.responseText = res;
                }
            });
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

        originOpen.apply(this, arguments);
    };
    function useFetchData() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", 'https://e.jssh.org.cn/big-screen/geojson/350000.json', false);
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
        res = res.replace(/江苏/g, '福建')
        res = res.replace(/南京/g, '福州')
        res = res.replace(/江苏省/g, '福建省')
        res = res.replace(/南京市/g, '福州市').replace(/320100/g, '350100')
        res = res.replace(/苏州市/g, '厦门市').replace(/320200/g, '350200')
        res = res.replace(/无锡市/g, '莆田市').replace(/320300/g, '350300')
        res = res.replace(/常州市/g, '三明市').replace(/320400/g, '350400')
        res = res.replace(/徐州市/g, '泉州市').replace(/320500/g, '350500')
        res = res.replace(/南通市/g, '漳州市').replace(/320600/g, '350600')
        res = res.replace(/连云港市/g, '南平市').replace(/320700/g, '350700')
        res = res.replace(/淮安市/g, '龙岩市').replace(/320800/g, '350800')
        res = res.replace(/盐城市/g, '宁德市').replace(/320900/g, '350900')

        // res = res.replace(/扬州市/g, '三明市').replace(/321000/g, '351000')
        // res = res.replace(/镇江市/g, '泉州市').replace(/321100/g, '351100')
        // res = res.replace(/泰州市/g, '南平市').replace(/321200/g, '351200')
        // res = res.replace(/宿迁市/g, '宁德市').replace(/321300/g, '351300')
        res = res.replace(/扬州市/g, '').replace(/321000/g, '')
        res = res.replace(/镇江市/g, '').replace(/321100/g, '')
        res = res.replace(/泰州市/g, '').replace(/321200/g, '')
        res = res.replace(/宿迁市/g, '').replace(/321300/g, '')
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
                                    "title": "鼓楼区",
                                    "key": "1494598400367194113",
                                    "value": "1494598400367194113",
                                    "accountCount": 3
                                },
                                {
                                    "id": "1494598399939375106",
                                    "parentId": "1494598399654162433",
                                    "hasChildren": false,
                                    "title": "台江区",
                                    "key": "1494598399939375106",
                                    "value": "1494598399939375106",
                                    "accountCount": 3
                                },
                                {
                                    "id": "1494598399792574466",
                                    "parentId": "1494598399654162433",
                                    "hasChildren": false,
                                    "title": "仓山区",
                                    "key": "1494598399792574466",
                                    "value": "1494598399792574466",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598400144896002",
                                    "parentId": "1494598399654162433",
                                    "hasChildren": false,
                                    "title": "马尾区",
                                    "key": "1494598400144896002",
                                    "value": "1494598400144896002",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598400316862466",
                                    "parentId": "1494598399654162433",
                                    "hasChildren": false,
                                    "title": "晋安区",
                                    "key": "1494598400316862466",
                                    "value": "1494598400316862466",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598400102952961",
                                    "parentId": "1494598399654162433",
                                    "hasChildren": false,
                                    "title": "长乐区",
                                    "key": "1494598400102952961",
                                    "value": "1494598400102952961",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598400421720066",
                                    "parentId": "1494598399654162433",
                                    "hasChildren": false,
                                    "title": "闽侯县",
                                    "key": "1494598400421720066",
                                    "value": "1494598400421720066",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598400274919426",
                                    "parentId": "1494598399654162433",
                                    "hasChildren": false,
                                    "title": "连江县",
                                    "key": "1494598400274919426",
                                    "value": "1494598400274919426",
                                    "accountCount": 1
                                },
                                {
                                    "id": "1494598400232976385",
                                    "parentId": "1494598399654162433",
                                    "hasChildren": false,
                                    "title": "罗源县",
                                    "key": "1494598400232976385",
                                    "value": "1494598400232976385",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598399993901058",
                                    "parentId": "1494598399654162433",
                                    "hasChildren": false,
                                    "title": "闽清县",
                                    "key": "1494598399993901058",
                                    "value": "1494598399993901058",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598400056815617",
                                    "parentId": "1494598399654162433",
                                    "hasChildren": false,
                                    "title": "永泰县",
                                    "key": "1494598400056815617",
                                    "value": "1494598400056815617",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598399859683329",
                                    "parentId": "1494598399654162433",
                                    "hasChildren": false,
                                    "title": "平潭县",
                                    "key": "1494598399859683329",
                                    "value": "1494598399859683329",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598399859683329",
                                    "parentId": "1494598399654162433",
                                    "hasChildren": false,
                                    "title": "福清市",
                                    "key": "1494598399859683329",
                                    "value": "1494598399859683329",
                                    "accountCount": 2
                                }
                            ],
                            "hasChildren": true,
                            "title": "福州市",
                            "key": "1494598399654162433",
                            "value": "1494598399654162433",
                            "accountCount": 40
                        },
                        {
                            "id": "1494598402460151809",
                            "parentId": "1494598399570276353",
                            "children": [
                                {
                                    "id": "1494598402892165121",
                                    "parentId": "1494598402460151809",
                                    "hasChildren": false,
                                    "title": "思明区",
                                    "key": "1494598402892165121",
                                    "value": "1494598402892165121",
                                    "accountCount": 1
                                },
                                {
                                    "id": "1494598402661478402",
                                    "parentId": "1494598402460151809",
                                    "hasChildren": false,
                                    "title": "海沧区",
                                    "key": "1494598402661478402",
                                    "value": "1494598402661478402",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598402707615745",
                                    "parentId": "1494598402460151809",
                                    "hasChildren": false,
                                    "title": "湖里区",
                                    "key": "1494598402707615745",
                                    "value": "1494598402707615745",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598402837639170",
                                    "parentId": "1494598402460151809",
                                    "hasChildren": false,
                                    "title": "集美区",
                                    "key": "1494598402837639170",
                                    "value": "1494598402837639170",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598402942496770",
                                    "parentId": "1494598402460151809",
                                    "hasChildren": false,
                                    "title": "同安区",
                                    "key": "1494598402942496770",
                                    "value": "1494598402942496770",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598402577592321",
                                    "parentId": "1494598402460151809",
                                    "hasChildren": false,
                                    "title": "翔安区",
                                    "key": "1494598402577592321",
                                    "value": "1494598402577592321",
                                    "accountCount": 3
                                }
                            ],
                            "hasChildren": true,
                            "title": "厦门市",
                            "key": "1494598402460151809",
                            "value": "1494598402460151809",
                            "accountCount": 4
                        },
                        {
                            "id": "1494598404125290497",
                            "parentId": "1494598399570276353",
                            "children": [
                                {
                                    "id": "1494598404335005697",
                                    "parentId": "1494598404125290497",
                                    "hasChildren": false,
                                    "title": "城厢区",
                                    "key": "1494598404335005697",
                                    "value": "1494598404335005697",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598404393725953",
                                    "parentId": "1494598404125290497",
                                    "hasChildren": false,
                                    "title": "涵江区",
                                    "key": "1494598404393725953",
                                    "value": "1494598404393725953",
                                    "accountCount": 3
                                },
                                {
                                    "id": "1494598404435668993",
                                    "parentId": "1494598404125290497",
                                    "hasChildren": false,
                                    "title": "荔城区",
                                    "key": "1494598404435668993",
                                    "value": "1494598404435668993",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598404557303810",
                                    "parentId": "1494598404125290497",
                                    "hasChildren": false,
                                    "title": "秀屿区",
                                    "key": "1494598404557303810",
                                    "value": "1494598404557303810",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598404506972161",
                                    "parentId": "1494598404125290497",
                                    "hasChildren": false,
                                    "title": "仙游县",
                                    "key": "1494598404506972161",
                                    "value": "1494598404506972161",
                                    "accountCount": 2
                                }
                            ],
                            "hasChildren": true,
                            "title": "莆田市",
                            "key": "1494598404125290497",
                            "value": "1494598404125290497",
                            "accountCount": 27
                        },
                        {
                            "id": "1494598406180499457",
                            "parentId": "1494598399570276353",
                            "children": [
                                {
                                    "id": "1494598406260191234",
                                    "parentId": "1494598406180499457",
                                    "hasChildren": false,
                                    "title": "梅列区",
                                    "key": "1494598406260191234",
                                    "value": "1494598406260191234",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406348271618",
                                    "parentId": "1494598406180499457",
                                    "hasChildren": false,
                                    "title": "三元区",
                                    "key": "1494598406348271618",
                                    "value": "1494598406348271618",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406549598210",
                                    "parentId": "1494598406180499457",
                                    "hasChildren": false,
                                    "title": "明溪县",
                                    "key": "1494598406549598210",
                                    "value": "1494598406549598210",
                                    "accountCount": 12
                                },
                                {
                                    "id": "1494598406469906434",
                                    "parentId": "1494598406180499457",
                                    "hasChildren": false,
                                    "title": "清流县",
                                    "key": "1494598406469906434",
                                    "value": "1494598406469906434",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406616707074",
                                    "parentId": "1494598406180499457",
                                    "hasChildren": false,
                                    "title": "宁化县",
                                    "key": "1494598406616707074",
                                    "value": "1494598406616707074",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406423769089",
                                    "parentId": "1494598406180499457",
                                    "hasChildren": false,
                                    "title": "大田县",
                                    "key": "1494598406423769089",
                                    "value": "1494598406423769089",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406679621634",
                                    "parentId": "1494598406180499457",
                                    "hasChildren": false,
                                    "title": "尤溪县",
                                    "key": "1494598406679621634",
                                    "value": "1494598406679621634",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406679621634",
                                    "parentId": "1494598406180499457",
                                    "hasChildren": false,
                                    "title": "沙县",
                                    "key": "1494598406679621634",
                                    "value": "1494598406679621634",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406679621634",
                                    "parentId": "1494598406180499457",
                                    "hasChildren": false,
                                    "title": "将乐县",
                                    "key": "1494598406679621634",
                                    "value": "1494598406679621634",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406679621634",
                                    "parentId": "1494598406180499457",
                                    "hasChildren": false,
                                    "title": "泰宁县",
                                    "key": "1494598406679621634",
                                    "value": "1494598406679621634",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406679621634",
                                    "parentId": "1494598406180499457",
                                    "hasChildren": false,
                                    "title": "建宁县",
                                    "key": "1494598406679621634",
                                    "value": "1494598406679621634",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406679621634",
                                    "parentId": "1494598406180499457",
                                    "hasChildren": false,
                                    "title": "永安市",
                                    "key": "1494598406679621634",
                                    "value": "1494598406679621634",
                                    "accountCount": 2
                                }
                            ],
                            "hasChildren": true,
                            "title": "三明市",
                            "key": "1494598406180499457",
                            "value": "1494598406180499457",
                            "accountCount": 13
                        },
                        {
                            "id": "1494598401143140353",
                            "parentId": "1494598399570276353",
                            "children": [
                                {
                                    "id": "1494598401554182146",
                                    "parentId": "1494598401143140353",
                                    "hasChildren": false,
                                    "title": "鲤城区",
                                    "key": "1494598401554182146",
                                    "value": "1494598401554182146",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598401684205569",
                                    "parentId": "1494598401143140353",
                                    "hasChildren": false,
                                    "title": "丰泽区",
                                    "key": "1494598401684205569",
                                    "value": "1494598401684205569",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598401482878977",
                                    "parentId": "1494598401143140353",
                                    "hasChildren": false,
                                    "title": "洛江区",
                                    "key": "1494598401482878977",
                                    "value": "1494598401482878977",
                                    "accountCount": 11
                                },
                                {
                                    "id": "1494598401747120130",
                                    "parentId": "1494598401143140353",
                                    "hasChildren": false,
                                    "title": "泉港区",
                                    "key": "1494598401747120130",
                                    "value": "1494598401747120130",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598401747120130",
                                    "parentId": "1494598401143140353",
                                    "hasChildren": false,
                                    "title": "惠安县",
                                    "key": "1494598401747120130",
                                    "value": "1494598401747120130",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598401747120130",
                                    "parentId": "1494598401143140353",
                                    "hasChildren": false,
                                    "title": "安溪县",
                                    "key": "1494598401747120130",
                                    "value": "1494598401747120130",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598401747120130",
                                    "parentId": "1494598401143140353",
                                    "hasChildren": false,
                                    "title": "永春县",
                                    "key": "1494598401747120130",
                                    "value": "1494598401747120130",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598401747120130",
                                    "parentId": "1494598401143140353",
                                    "hasChildren": false,
                                    "title": "德化县",
                                    "key": "1494598401747120130",
                                    "value": "1494598401747120130",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598401747120130",
                                    "parentId": "1494598401143140353",
                                    "hasChildren": false,
                                    "title": "金门县",
                                    "key": "1494598401747120130",
                                    "value": "1494598401747120130",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598401747120130",
                                    "parentId": "1494598401143140353",
                                    "hasChildren": false,
                                    "title": "石狮市",
                                    "key": "1494598401747120130",
                                    "value": "1494598401747120130",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598401747120130",
                                    "parentId": "1494598401143140353",
                                    "hasChildren": false,
                                    "title": "晋江市",
                                    "key": "1494598401747120130",
                                    "value": "1494598401747120130",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598401747120130",
                                    "parentId": "1494598401143140353",
                                    "hasChildren": false,
                                    "title": "南安市",
                                    "key": "1494598401747120130",
                                    "value": "1494598401747120130",
                                    "accountCount": 2
                                }
                            ],
                            "hasChildren": true,
                            "title": "泉州市",
                            "key": "1494598401143140353",
                            "value": "1494598401143140353",
                            "accountCount": 22
                        },
                        {
                            "id": "1494598401843589122",
                            "parentId": "1494598399570276353",
                            "children": [
                                {
                                    "id": "1494598402233659393",
                                    "parentId": "1494598401843589122",
                                    "hasChildren": false,
                                    "title": "芗城区",
                                    "key": "1494598402233659393",
                                    "value": "1494598402233659393",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598402124607490",
                                    "parentId": "1494598401843589122",
                                    "hasChildren": false,
                                    "title": "龙文区",
                                    "key": "1494598402124607490",
                                    "value": "1494598402124607490",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598402409820162",
                                    "parentId": "1494598401843589122",
                                    "hasChildren": false,
                                    "title": "云霄县",
                                    "key": "1494598402409820162",
                                    "value": "1494598402409820162",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598402032332801",
                                    "parentId": "1494598401843589122",
                                    "hasChildren": false,
                                    "title": "漳浦县",
                                    "key": "1494598402032332801",
                                    "value": "1494598402032332801",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598401982001153",
                                    "parentId": "1494598401843589122",
                                    "hasChildren": false,
                                    "title": "诏安县",
                                    "key": "1494598401982001153",
                                    "value": "1494598401982001153",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598402346905602",
                                    "parentId": "1494598401843589122",
                                    "hasChildren": false,
                                    "title": "长泰县",
                                    "key": "1494598402346905602",
                                    "value": "1494598402346905602",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598402283991042",
                                    "parentId": "1494598401843589122",
                                    "hasChildren": false,
                                    "title": "东山县",
                                    "key": "1494598402283991042",
                                    "value": "1494598402283991042",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598402283991042",
                                    "parentId": "1494598401843589122",
                                    "hasChildren": false,
                                    "title": "南靖县",
                                    "key": "1494598402283991042",
                                    "value": "1494598402283991042",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598402283991042",
                                    "parentId": "1494598401843589122",
                                    "hasChildren": false,
                                    "title": "平和县",
                                    "key": "1494598402283991042",
                                    "value": "1494598402283991042",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598402283991042",
                                    "parentId": "1494598401843589122",
                                    "hasChildren": false,
                                    "title": "华安县",
                                    "key": "1494598402283991042",
                                    "value": "1494598402283991042",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598402283991042",
                                    "parentId": "1494598401843589122",
                                    "hasChildren": false,
                                    "title": "龙海市",
                                    "key": "1494598402283991042",
                                    "value": "1494598402283991042",
                                    "accountCount": 2
                                }
                            ],
                            "hasChildren": true,
                            "title": "漳州市",
                            "key": "1494598401843589122",
                            "value": "1494598401843589122",
                            "accountCount": 33
                        },
                        {
                            "id": "1494598400551743490",
                            "parentId": "1494598399570276353",
                            "children": [
                                {
                                    "id": "1494598400719515649",
                                    "parentId": "1494598400551743490",
                                    "hasChildren": false,
                                    "title": "延平区",
                                    "key": "1494598400719515649",
                                    "value": "1494598400719515649",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598400769847297",
                                    "parentId": "1494598400551743490",
                                    "hasChildren": false,
                                    "title": "建阳区",
                                    "key": "1494598400769847297",
                                    "value": "1494598400769847297",
                                    "accountCount": 7
                                },
                                {
                                    "id": "1494598400874704898",
                                    "parentId": "1494598400551743490",
                                    "hasChildren": false,
                                    "title": "顺昌县",
                                    "key": "1494598400874704898",
                                    "value": "1494598400874704898",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598400669184001",
                                    "parentId": "1494598400551743490",
                                    "hasChildren": false,
                                    "title": "浦城县",
                                    "key": "1494598400669184001",
                                    "value": "1494598400669184001",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598401097003010",
                                    "parentId": "1494598400551743490",
                                    "hasChildren": false,
                                    "title": "光泽县",
                                    "key": "1494598401097003010",
                                    "value": "1494598401097003010",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598401097003010",
                                    "parentId": "1494598400551743490",
                                    "hasChildren": false,
                                    "title": "松溪县",
                                    "key": "1494598401097003010",
                                    "value": "1494598401097003010",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598401097003010",
                                    "parentId": "1494598400551743490",
                                    "hasChildren": false,
                                    "title": "政和县",
                                    "key": "1494598401097003010",
                                    "value": "1494598401097003010",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598401097003010",
                                    "parentId": "1494598400551743490",
                                    "hasChildren": false,
                                    "title": "邵武市",
                                    "key": "1494598401097003010",
                                    "value": "1494598401097003010",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598401097003010",
                                    "parentId": "1494598400551743490",
                                    "hasChildren": false,
                                    "title": "武夷山市",
                                    "key": "1494598401097003010",
                                    "value": "1494598401097003010",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598401097003010",
                                    "parentId": "1494598400551743490",
                                    "hasChildren": false,
                                    "title": "建瓯市",
                                    "key": "1494598401097003010",
                                    "value": "1494598401097003010",
                                    "accountCount": 2
                                }
                            ],
                            "hasChildren": true,
                            "title": "南平市",
                            "key": "1494598400551743490",
                            "value": "1494598400551743490",
                            "accountCount": 24
                        },
                        {
                            "id": "1494598403550670849",
                            "parentId": "1494598399570276353",
                            "children": [
                                {
                                    "id": "1494598404049793025",
                                    "parentId": "1494598403550670849",
                                    "hasChildren": false,
                                    "title": "新罗区",
                                    "key": "1494598404049793025",
                                    "value": "1494598404049793025",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598403697471490",
                                    "parentId": "1494598403550670849",
                                    "hasChildren": false,
                                    "title": "永定区",
                                    "key": "1494598403697471490",
                                    "value": "1494598403697471490",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598403747803137",
                                    "parentId": "1494598403550670849",
                                    "hasChildren": false,
                                    "title": "长汀县",
                                    "key": "1494598403747803137",
                                    "value": "1494598403747803137",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598403882020866",
                                    "parentId": "1494598403550670849",
                                    "hasChildren": false,
                                    "title": "上杭县",
                                    "key": "1494598403882020866",
                                    "value": "1494598403882020866",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598403882020866",
                                    "parentId": "1494598403550670849",
                                    "hasChildren": false,
                                    "title": "武平县",
                                    "key": "1494598403882020866",
                                    "value": "1494598403882020866",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598403882020866",
                                    "parentId": "1494598403550670849",
                                    "hasChildren": false,
                                    "title": "连城县",
                                    "key": "1494598403882020866",
                                    "value": "1494598403882020866",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598403882020866",
                                    "parentId": "1494598403550670849",
                                    "hasChildren": false,
                                    "title": "漳平市",
                                    "key": "1494598403882020866",
                                    "value": "1494598403882020866",
                                    "accountCount": 2
                                }
                            ],
                            "hasChildren": true,
                            "title": "龙岩市",
                            "key": "1494598403550670849",
                            "value": "1494598403550670849",
                            "accountCount": 10
                        },
                        {
                            "id": "1494598405236781058",
                            "parentId": "1494598399570276353",
                            "children": [
                                {
                                    "id": "1494598405299695617",
                                    "parentId": "1494598405236781058",
                                    "hasChildren": false,
                                    "title": "蕉城区",
                                    "key": "1494598405299695617",
                                    "value": "1494598405299695617",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598405412941825",
                                    "parentId": "1494598405236781058",
                                    "hasChildren": false,
                                    "title": "霞浦县",
                                    "key": "1494598405412941825",
                                    "value": "1494598405412941825",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598405345832961",
                                    "parentId": "1494598405236781058",
                                    "hasChildren": false,
                                    "title": "古田县",
                                    "key": "1494598405345832961",
                                    "value": "1494598405345832961",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598405345832961",
                                    "parentId": "1494598405236781058",
                                    "hasChildren": false,
                                    "title": "屏南县",
                                    "key": "1494598405345832961",
                                    "value": "1494598405345832961",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598405345832961",
                                    "parentId": "1494598405236781058",
                                    "hasChildren": false,
                                    "title": "寿宁县",
                                    "key": "1494598405345832961",
                                    "value": "1494598405345832961",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598405345832961",
                                    "parentId": "1494598405236781058",
                                    "hasChildren": false,
                                    "title": "周宁县",
                                    "key": "1494598405345832961",
                                    "value": "1494598405345832961",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598405345832961",
                                    "parentId": "1494598405236781058",
                                    "hasChildren": false,
                                    "title": "柘荣县",
                                    "key": "1494598405345832961",
                                    "value": "1494598405345832961",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598405345832961",
                                    "parentId": "1494598405236781058",
                                    "hasChildren": false,
                                    "title": "福安市",
                                    "key": "1494598405345832961",
                                    "value": "1494598405345832961",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598405345832961",
                                    "parentId": "1494598405236781058",
                                    "hasChildren": false,
                                    "title": "福鼎市",
                                    "key": "1494598405345832961",
                                    "value": "1494598405345832961",
                                    "accountCount": 2
                                }
                            ],
                            "hasChildren": true,
                            "title": "宁德市",
                            "key": "1494598405236781058",
                            "value": "1494598405236781058",
                            "accountCount": 3
                        }
                    ],
                    "hasChildren": true,
                    "title": "福建省",
                    "key": "1494598399570276353",
                    "value": "1494598399570276353",
                    "accountCount": 77
                }
            ],
            "type": "session",
            "datetime": 1705474834606
        };
    }

})();