// ==UserScript==
// @name         JiangSu2YunNan-Script
// @namespace    http://tampermonkey.net/
// @version      v0.1.1
// @description  jiangsu2yunnan tools
// @author       Hunter
// @match        *://e.jssh.org.cn/*
// @match        *://ae.jssh.org.cn/*
// @match        *://test.qikangkang.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jssh.org.cn
// @license AGPL
// @downloadURL https://update.greasyfork.org/scripts/468752/JiangSu2YunNan-Script.user.js
// @updateURL https://update.greasyfork.org/scripts/468752/JiangSu2YunNan-Script.meta.js
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
        xhr.open("GET", 'https://e.jssh.org.cn/big-screen/geojson/530000.json', false);
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
        res = res.replace(/江苏/g, '云南')
        res = res.replace(/南京/g, '昆明')
        res = res.replace(/江苏省/g, '云南省')
        res = res.replace(/南京市/g, '昆明市').replace(/320100/g, '530100')
        res = res.replace(/苏州市/g, '曲靖市').replace(/320200/g, '530200')
        res = res.replace(/无锡市/g, '玉溪市').replace(/320300/g, '530300')
        res = res.replace(/常州市/g, '保山市').replace(/320400/g, '530400')
        res = res.replace(/徐州市/g, '昭通市').replace(/320500/g, '530500')
        res = res.replace(/南通市/g, '丽江市').replace(/320600/g, '530600')
        res = res.replace(/连云港市/g, '普洱市').replace(/320700/g, '530700')
        res = res.replace(/淮安市/g, '临沧市').replace(/320800/g, '530800')
        res = res.replace(/盐城市/g, '楚雄彝族自治州').replace(/320900/g, '530900')
        res = res.replace(/扬州市/g, '红河哈尼族彝族自治州').replace(/321000/g, '531000')
        res = res.replace(/镇江市/g, '文山壮族苗族自治州').replace(/321100/g, '531100')
        res = res.replace(/泰州市/g, '西双版纳傣族自治州').replace(/321200/g, '531200')
        res = res.replace(/宿迁市/g, '大理白族自治州').replace(/321300/g, '531300')
        res = res.replace(/镇江市/g, '德宏傣族景颇族自治州').replace(/321100/g, '531400')
        res = res.replace(/泰州市/g, '怒江傈僳族自治州').replace(/321200/g, '531500')
        res = res.replace(/宿迁市/g, '迪庆藏族自治州').replace(/321300/g, '531600')
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
                                    "title": "昆明高新技术产业开发区",
                                    "key": "1494598400367194113",
                                    "value": "1494598400367194113",
                                    "accountCount": 3
                                },
                                {
                                    "id": "1494598399939375106",
                                    "parentId": "1494598399654162433",
                                    "hasChildren": false,
                                    "title": "五华区",
                                    "key": "1494598399939375106",
                                    "value": "1494598399939375106",
                                    "accountCount": 3
                                },
                                {
                                    "id": "1494598399792574466",
                                    "parentId": "1494598399654162433",
                                    "hasChildren": false,
                                    "title": "寻甸回族彝族自治县",
                                    "key": "1494598399792574466",
                                    "value": "1494598399792574466",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598400144896002",
                                    "parentId": "1494598399654162433",
                                    "hasChildren": false,
                                    "title": "禄劝彝族苗族自治县",
                                    "key": "1494598400144896002",
                                    "value": "1494598400144896002",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598400316862466",
                                    "parentId": "1494598399654162433",
                                    "hasChildren": false,
                                    "title": "石林彝族自治县",
                                    "key": "1494598400316862466",
                                    "value": "1494598400316862466",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598400102952961",
                                    "parentId": "1494598399654162433",
                                    "hasChildren": false,
                                    "title": "嵩明县",
                                    "key": "1494598400102952961",
                                    "value": "1494598400102952961",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598400421720066",
                                    "parentId": "1494598399654162433",
                                    "hasChildren": false,
                                    "title": "宜良县",
                                    "key": "1494598400421720066",
                                    "value": "1494598400421720066",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598400274919426",
                                    "parentId": "1494598399654162433",
                                    "hasChildren": false,
                                    "title": "昆明经济技术开发区",
                                    "key": "1494598400274919426",
                                    "value": "1494598400274919426",
                                    "accountCount": 1
                                },
                                {
                                    "id": "1494598400232976385",
                                    "parentId": "1494598399654162433",
                                    "hasChildren": false,
                                    "title": "昆明滇池度假区",
                                    "key": "1494598400232976385",
                                    "value": "1494598400232976385",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598399993901058",
                                    "parentId": "1494598399654162433",
                                    "hasChildren": false,
                                    "title": "盘龙区",
                                    "key": "1494598399993901058",
                                    "value": "1494598399993901058",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598400056815617",
                                    "parentId": "1494598399654162433",
                                    "hasChildren": false,
                                    "title": "西山区",
                                    "key": "1494598400056815617",
                                    "value": "1494598400056815617",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598399859683329",
                                    "parentId": "1494598399654162433",
                                    "hasChildren": false,
                                    "title": "官渡区",
                                    "key": "1494598399859683329",
                                    "value": "1494598399859683329",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598399859683329",
                                    "parentId": "1494598399654162433",
                                    "hasChildren": false,
                                    "title": "安宁市",
                                    "key": "1494598399859683329",
                                    "value": "1494598399859683329",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598399859683329",
                                    "parentId": "1494598399654162433",
                                    "hasChildren": false,
                                    "title": "东川区",
                                    "key": "1494598399859683329",
                                    "value": "1494598399859683329",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598399859683329",
                                    "parentId": "1494598399654162433",
                                    "hasChildren": false,
                                    "title": "富民县",
                                    "key": "1494598399859683329",
                                    "value": "1494598399859683329",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598399859683329",
                                    "parentId": "1494598399654162433",
                                    "hasChildren": false,
                                    "title": "晋宁区",
                                    "key": "1494598399859683329",
                                    "value": "1494598399859683329",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598399859683329",
                                    "parentId": "1494598399654162433",
                                    "hasChildren": false,
                                    "title": "呈贡区",
                                    "key": "1494598399859683329",
                                    "value": "1494598399859683329",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598399859683329",
                                    "parentId": "1494598399654162433",
                                    "hasChildren": false,
                                    "title": "昆明阳宗海管委会",
                                    "key": "1494598399859683329",
                                    "value": "1494598399859683329",
                                    "accountCount": 2
                                }
                            ],
                            "hasChildren": true,
                            "title": "昆明市",
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
                                    "title": "麒麟区",
                                    "key": "1494598402892165121",
                                    "value": "1494598402892165121",
                                    "accountCount": 1
                                },
                                {
                                    "id": "1494598402661478402",
                                    "parentId": "1494598402460151809",
                                    "hasChildren": false,
                                    "title": "宣威市",
                                    "key": "1494598402661478402",
                                    "value": "1494598402661478402",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598402707615745",
                                    "parentId": "1494598402460151809",
                                    "hasChildren": false,
                                    "title": "陆良县",
                                    "key": "1494598402707615745",
                                    "value": "1494598402707615745",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598402837639170",
                                    "parentId": "1494598402460151809",
                                    "hasChildren": false,
                                    "title": "师宗县",
                                    "key": "1494598402837639170",
                                    "value": "1494598402837639170",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598402942496770",
                                    "parentId": "1494598402460151809",
                                    "hasChildren": false,
                                    "title": "罗平县",
                                    "key": "1494598402942496770",
                                    "value": "1494598402942496770",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598402577592321",
                                    "parentId": "1494598402460151809",
                                    "hasChildren": false,
                                    "title": "会泽县",
                                    "key": "1494598402577592321",
                                    "value": "1494598402577592321",
                                    "accountCount": 3
                                },
                                {
                                    "id": "1494598402783113218",
                                    "parentId": "1494598402460151809",
                                    "hasChildren": false,
                                    "title": "马龙区",
                                    "key": "1494598402783113218",
                                    "value": "1494598402783113218",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598402783113218",
                                    "parentId": "1494598402460151809",
                                    "hasChildren": false,
                                    "title": "富源县",
                                    "key": "1494598402783113218",
                                    "value": "1494598402783113218",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598402783113218",
                                    "parentId": "1494598402460151809",
                                    "hasChildren": false,
                                    "title": "沾益区",
                                    "key": "1494598402783113218",
                                    "value": "1494598402783113218",
                                    "accountCount": 2
                                }
                            ],
                            "hasChildren": true,
                            "title": "曲靖市",
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
                                    "title": "红塔区",
                                    "key": "1494598404335005697",
                                    "value": "1494598404335005697",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598404393725953",
                                    "parentId": "1494598404125290497",
                                    "hasChildren": false,
                                    "title": "江川区",
                                    "key": "1494598404393725953",
                                    "value": "1494598404393725953",
                                    "accountCount": 3
                                },
                                {
                                    "id": "1494598404435668993",
                                    "parentId": "1494598404125290497",
                                    "hasChildren": false,
                                    "title": "澄江县",
                                    "key": "1494598404435668993",
                                    "value": "1494598404435668993",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598404557303810",
                                    "parentId": "1494598404125290497",
                                    "hasChildren": false,
                                    "title": "通海县",
                                    "key": "1494598404557303810",
                                    "value": "1494598404557303810",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598404506972161",
                                    "parentId": "1494598404125290497",
                                    "hasChildren": false,
                                    "title": "华宁县",
                                    "key": "1494598404506972161",
                                    "value": "1494598404506972161",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598404284674049",
                                    "parentId": "1494598404125290497",
                                    "hasChildren": false,
                                    "title": "峨山彝族自治县",
                                    "key": "1494598404284674049",
                                    "value": "1494598404284674049",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598404687327233",
                                    "parentId": "1494598404125290497",
                                    "hasChildren": false,
                                    "title": "新平彝族傣族自治县",
                                    "key": "1494598404687327233",
                                    "value": "1494598404687327233",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598404641189890",
                                    "parentId": "1494598404125290497",
                                    "hasChildren": false,
                                    "title": "元江哈尼族彝族傣族自治县",
                                    "key": "1494598404641189890",
                                    "value": "1494598404641189890",
                                    "accountCount": 5
                                },
                                {
                                    "id": "1494598404599246849",
                                    "parentId": "1494598404125290497",
                                    "hasChildren": false,
                                    "title": "易门县",
                                    "key": "1494598404599246849",
                                    "value": "1494598404599246849",
                                    "accountCount": 2
                                }
                            ],
                            "hasChildren": true,
                            "title": "玉溪市",
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
                                    "title": "文山市",
                                    "key": "1494598406260191234",
                                    "value": "1494598406260191234",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406348271618",
                                    "parentId": "1494598406180499457",
                                    "hasChildren": false,
                                    "title": "砚山县",
                                    "key": "1494598406348271618",
                                    "value": "1494598406348271618",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406549598210",
                                    "parentId": "1494598406180499457",
                                    "hasChildren": false,
                                    "title": "丘北县",
                                    "key": "1494598406549598210",
                                    "value": "1494598406549598210",
                                    "accountCount": 12
                                },
                                {
                                    "id": "1494598406469906434",
                                    "parentId": "1494598406180499457",
                                    "hasChildren": false,
                                    "title": "西畴县",
                                    "key": "1494598406469906434",
                                    "value": "1494598406469906434",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406616707074",
                                    "parentId": "1494598406180499457",
                                    "hasChildren": false,
                                    "title": "马关县",
                                    "key": "1494598406616707074",
                                    "value": "1494598406616707074",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406423769089",
                                    "parentId": "1494598406180499457",
                                    "hasChildren": false,
                                    "title": "麻栗坡县",
                                    "key": "1494598406423769089",
                                    "value": "1494598406423769089",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406679621634",
                                    "parentId": "1494598406180499457",
                                    "hasChildren": false,
                                    "title": "广南县",
                                    "key": "1494598406679621634",
                                    "value": "1494598406679621634",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406679621634",
                                    "parentId": "1494598406180499457",
                                    "hasChildren": false,
                                    "title": "富宁县",
                                    "key": "1494598406679621634",
                                    "value": "1494598406679621634",
                                    "accountCount": 2
                                }
                            ],
                            "hasChildren": true,
                            "title": "文山壮族苗族自治州",
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
                                    "title": "西双版纳州旅游行业协会",
                                    "key": "1494598401554182146",
                                    "value": "1494598401554182146",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598401684205569",
                                    "parentId": "1494598401143140353",
                                    "hasChildren": false,
                                    "title": "勐腊县",
                                    "key": "1494598401684205569",
                                    "value": "1494598401684205569",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598401482878977",
                                    "parentId": "1494598401143140353",
                                    "hasChildren": false,
                                    "title": "勐海县",
                                    "key": "1494598401482878977",
                                    "value": "1494598401482878977",
                                    "accountCount": 11
                                },
                                {
                                    "id": "1494598401747120130",
                                    "parentId": "1494598401143140353",
                                    "hasChildren": false,
                                    "title": "景洪市",
                                    "key": "1494598401747120130",
                                    "value": "1494598401747120130",
                                    "accountCount": 2
                                }
                            ],
                            "hasChildren": true,
                            "title": "西双版纳傣族自治州",
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
                                    "title": "大理市",
                                    "key": "1494598402233659393",
                                    "value": "1494598402233659393",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598402124607490",
                                    "parentId": "1494598401843589122",
                                    "hasChildren": false,
                                    "title": "永平县",
                                    "key": "1494598402124607490",
                                    "value": "1494598402124607490",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598402409820162",
                                    "parentId": "1494598401843589122",
                                    "hasChildren": false,
                                    "title": "漾濞彝族自治县",
                                    "key": "1494598402409820162",
                                    "value": "1494598402409820162",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598402032332801",
                                    "parentId": "1494598401843589122",
                                    "hasChildren": false,
                                    "title": "祥云县",
                                    "key": "1494598402032332801",
                                    "value": "1494598402032332801",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598401982001153",
                                    "parentId": "1494598401843589122",
                                    "hasChildren": false,
                                    "title": "云龙县",
                                    "key": "1494598401982001153",
                                    "value": "1494598401982001153",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598402346905602",
                                    "parentId": "1494598401843589122",
                                    "hasChildren": false,
                                    "title": "剑川县",
                                    "key": "1494598402346905602",
                                    "value": "1494598402346905602",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598402283991042",
                                    "parentId": "1494598401843589122",
                                    "hasChildren": false,
                                    "title": "鹤庆县",
                                    "key": "1494598402283991042",
                                    "value": "1494598402283991042",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598402283991042",
                                    "parentId": "1494598401843589122",
                                    "hasChildren": false,
                                    "title": "洱源县",
                                    "key": "1494598402283991042",
                                    "value": "1494598402283991042",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598402283991042",
                                    "parentId": "1494598401843589122",
                                    "hasChildren": false,
                                    "title": "南涧彝族自治县",
                                    "key": "1494598402283991042",
                                    "value": "1494598402283991042",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598402283991042",
                                    "parentId": "1494598401843589122",
                                    "hasChildren": false,
                                    "title": "宾川县",
                                    "key": "1494598402283991042",
                                    "value": "1494598402283991042",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598402283991042",
                                    "parentId": "1494598401843589122",
                                    "hasChildren": false,
                                    "title": "巍山彝族回族自治县",
                                    "key": "1494598402283991042",
                                    "value": "1494598402283991042",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598402283991042",
                                    "parentId": "1494598401843589122",
                                    "hasChildren": false,
                                    "title": "弥渡县",
                                    "key": "1494598402283991042",
                                    "value": "1494598402283991042",
                                    "accountCount": 2
                                }
                            ],
                            "hasChildren": true,
                            "title": "大理白族自治州",
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
                                    "title": "陇川县",
                                    "key": "1494598400719515649",
                                    "value": "1494598400719515649",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598400769847297",
                                    "parentId": "1494598400551743490",
                                    "hasChildren": false,
                                    "title": "盈江县",
                                    "key": "1494598400769847297",
                                    "value": "1494598400769847297",
                                    "accountCount": 7
                                },
                                {
                                    "id": "1494598400874704898",
                                    "parentId": "1494598400551743490",
                                    "hasChildren": false,
                                    "title": "梁河县",
                                    "key": "1494598400874704898",
                                    "value": "1494598400874704898",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598400669184001",
                                    "parentId": "1494598400551743490",
                                    "hasChildren": false,
                                    "title": "芒市",
                                    "key": "1494598400669184001",
                                    "value": "1494598400669184001",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598401097003010",
                                    "parentId": "1494598400551743490",
                                    "hasChildren": false,
                                    "title": "瑞丽市",
                                    "key": "1494598401097003010",
                                    "value": "1494598401097003010",
                                    "accountCount": 2
                                }
                            ],
                            "hasChildren": true,
                            "title": "德宏傣族景颇族自治州",
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
                                    "title": "福贡县",
                                    "key": "1494598404049793025",
                                    "value": "1494598404049793025",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598403697471490",
                                    "parentId": "1494598403550670849",
                                    "hasChildren": false,
                                    "title": "泸水市",
                                    "key": "1494598403697471490",
                                    "value": "1494598403697471490",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598403747803137",
                                    "parentId": "1494598403550670849",
                                    "hasChildren": false,
                                    "title": "贡山独龙族怒族自治县",
                                    "key": "1494598403747803137",
                                    "value": "1494598403747803137",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598403882020866",
                                    "parentId": "1494598403550670849",
                                    "hasChildren": false,
                                    "title": "兰坪白族普米族自治县",
                                    "key": "1494598403882020866",
                                    "value": "1494598403882020866",
                                    "accountCount": 2
                                }
                            ],
                            "hasChildren": true,
                            "title": "怒江傈僳族自治州",
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
                                    "title": "香格里拉市",
                                    "key": "1494598405299695617",
                                    "value": "1494598405299695617",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598405412941825",
                                    "parentId": "1494598405236781058",
                                    "hasChildren": false,
                                    "title": "德钦县",
                                    "key": "1494598405412941825",
                                    "value": "1494598405412941825",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598405345832961",
                                    "parentId": "1494598405236781058",
                                    "hasChildren": false,
                                    "title": "维西傈僳族自治县",
                                    "key": "1494598405345832961",
                                    "value": "1494598405345832961",
                                    "accountCount": 2
                                }
                            ],
                            "hasChildren": true,
                            "title": "迪庆藏族自治州",
                            "key": "1494598405236781058",
                            "value": "1494598405236781058",
                            "accountCount": 3
                        },
                        {
                            "id": "1494598406746730497",
                            "parentId": "1494598399570276353",
                            "children": [
                                {
                                    "id": "1494598406960640002",
                                    "parentId": "1494598406746730497",
                                    "hasChildren": false,
                                    "title": "隆阳区",
                                    "key": "1494598406960640002",
                                    "value": "1494598406960640002",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598407073886209",
                                    "parentId": "1494598406746730497",
                                    "hasChildren": false,
                                    "title": "施甸县",
                                    "key": "1494598407073886209",
                                    "value": "1494598407073886209",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598407019360258",
                                    "parentId": "1494598406746730497",
                                    "hasChildren": false,
                                    "title": "腾冲市",
                                    "key": "1494598407019360258",
                                    "value": "1494598407019360258",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406897725441",
                                    "parentId": "1494598406746730497",
                                    "hasChildren": false,
                                    "title": "龙陵县",
                                    "key": "1494598406897725441",
                                    "value": "1494598406897725441",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406830616578",
                                    "parentId": "1494598406746730497",
                                    "hasChildren": false,
                                    "title": "昌宁县",
                                    "key": "1494598406830616578",
                                    "value": "1494598406830616578",
                                    "accountCount": 2
                                }
                            ],
                            "hasChildren": true,
                            "title": "保山市",
                            "key": "1494598406746730497",
                            "value": "1494598406746730497",
                            "accountCount": 3
                        },
                        {
                            "id": "1494598403001217025",
                            "parentId": "1494598399570276353",
                            "children": [
                                {
                                    "id": "1494598403106074626",
                                    "parentId": "1494598403001217025",
                                    "hasChildren": false,
                                    "title": "昭阳区",
                                    "key": "1494598403106074626",
                                    "value": "1494598403106074626",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598403244486657",
                                    "parentId": "1494598403001217025",
                                    "hasChildren": false,
                                    "title": "鲁甸县",
                                    "key": "1494598403244486657",
                                    "value": "1494598403244486657",
                                    "accountCount": 9
                                },
                                {
                                    "id": "1494598403164794881",
                                    "parentId": "1494598403001217025",
                                    "hasChildren": false,
                                    "title": "水富县",
                                    "key": "1494598403164794881",
                                    "value": "1494598403164794881",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598403424841729",
                                    "parentId": "1494598403001217025",
                                    "hasChildren": false,
                                    "title": "巧家县",
                                    "key": "1494598403424841729",
                                    "value": "1494598403424841729",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598403299012610",
                                    "parentId": "1494598403001217025",
                                    "hasChildren": false,
                                    "title": "镇雄县",
                                    "key": "1494598403299012610",
                                    "value": "1494598403299012610",
                                    "accountCount": 3
                                },
                                {
                                    "id": "1494598403353538561",
                                    "parentId": "1494598403001217025",
                                    "hasChildren": false,
                                    "title": "彝良县",
                                    "key": "1494598403353538561",
                                    "value": "1494598403353538561",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598403491950594",
                                    "parentId": "1494598403001217025",
                                    "hasChildren": false,
                                    "title": "威信县",
                                    "key": "1494598403491950594",
                                    "value": "1494598403491950594",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598403491850594",
                                    "parentId": "1494598403001217025",
                                    "hasChildren": false,
                                    "title": "大关县",
                                    "key": "1494598403491850594",
                                    "value": "1494598403491850594",
                                    "accountCount": 1
                                },
                                {
                                    "id": "1494598403491850594",
                                    "parentId": "1494598403001217025",
                                    "hasChildren": false,
                                    "title": "盐津县",
                                    "key": "1494598403491850594",
                                    "value": "1494598403491850594",
                                    "accountCount": 1
                                },
                                {
                                    "id": "1494598403491850594",
                                    "parentId": "1494598403001217025",
                                    "hasChildren": false,
                                    "title": "永善县",
                                    "key": "1494598403491850594",
                                    "value": "1494598403491850594",
                                    "accountCount": 1
                                },
                                {
                                    "id": "1494598403491850594",
                                    "parentId": "1494598403001217025",
                                    "hasChildren": false,
                                    "title": "绥江县",
                                    "key": "1494598403491850594",
                                    "value": "1494598403491850594",
                                    "accountCount": 1
                                }
                            ],
                            "hasChildren": true,
                            "title": "昭通市",
                            "key": "1494598403001217025",
                            "value": "1494598403001217025",
                            "accountCount": 27
                        },
                        {
                            "id": "1494598404808962049",
                            "parentId": "1494598399570276353",
                            "children": [
                                {
                                    "id": "1494598404989317122",
                                    "parentId": "1494598404808962049",
                                    "hasChildren": false,
                                    "title": "永胜县",
                                    "key": "1494598404989317122",
                                    "value": "1494598404989317122",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598405043843074",
                                    "parentId": "1494598404808962049",
                                    "hasChildren": false,
                                    "title": "玉龙纳西族自治县",
                                    "key": "1494598405043843074",
                                    "value": "1494598405043843074",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598404918013953",
                                    "parentId": "1494598404808962049",
                                    "hasChildren": false,
                                    "title": "华坪县",
                                    "key": "1494598404918013953",
                                    "value": "1494598404918013953",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598405182255105",
                                    "parentId": "1494598404808962049",
                                    "hasChildren": false,
                                    "title": "宁蒗彝族自治县",
                                    "key": "1494598405182255105",
                                    "value": "1494598405182255105",
                                    "accountCount": 3
                                },
                                {
                                    "id": "1494598405123534850",
                                    "parentId": "1494598404808962049",
                                    "hasChildren": false,
                                    "title": "古城区",
                                    "key": "1494598405123534850",
                                    "value": "1494598405123534850",
                                    "accountCount": 2
                                }
                            ],
                            "hasChildren": true,
                            "title": "丽江市",
                            "key": "1494598404808962049",
                            "value": "1494598404808962049",
                            "accountCount": 3
                        },
                        {
                            "id": "1494598405794623490",
                            "parentId": "1494598399570276353",
                            "children": [
                                {
                                    "id": "1494598406096613377",
                                    "parentId": "1494598405794623490",
                                    "hasChildren": false,
                                    "title": "澜沧拉祜族自治县",
                                    "key": "1494598406096613377",
                                    "value": "1494598406096613377",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598405853343745",
                                    "parentId": "1494598405794623490",
                                    "hasChildren": false,
                                    "title": "孟连傣族拉祜族佤族自治县",
                                    "key": "1494598405853343745",
                                    "value": "1494598405853343745",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598405928841217",
                                    "parentId": "1494598405794623490",
                                    "hasChildren": false,
                                    "title": "思茅区",
                                    "key": "1494598405928841217",
                                    "value": "1494598405928841217",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598405983367169",
                                    "parentId": "1494598405794623490",
                                    "hasChildren": false,
                                    "title": "宁洱哈尼族彝族自治县",
                                    "key": "1494598405983367169",
                                    "value": "1494598405983367169",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406037893122",
                                    "parentId": "1494598405794623490",
                                    "hasChildren": false,
                                    "title": "墨江哈尼族自治县",
                                    "key": "1494598406037893122",
                                    "value": "1494598406037893122",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406037893122",
                                    "parentId": "1494598405794623490",
                                    "hasChildren": false,
                                    "title": "景东彝族自治县",
                                    "key": "1494598406037893122",
                                    "value": "1494598406037893122",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406037893122",
                                    "parentId": "1494598405794623490",
                                    "hasChildren": false,
                                    "title": "景谷傣族彝族自治县",
                                    "key": "1494598406037893122",
                                    "value": "1494598406037893122",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406037893122",
                                    "parentId": "1494598405794623490",
                                    "hasChildren": false,
                                    "title": "镇沅彝族哈尼族拉祜族自治县",
                                    "key": "1494598406037893122",
                                    "value": "1494598406037893122",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406037893122",
                                    "parentId": "1494598405794623490",
                                    "hasChildren": false,
                                    "title": "江城哈尼族彝族自治县",
                                    "key": "1494598406037893122",
                                    "value": "1494598406037893122",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406037893122",
                                    "parentId": "1494598405794623490",
                                    "hasChildren": false,
                                    "title": "西盟佤族自治县",
                                    "key": "1494598406037893122",
                                    "value": "1494598406037893122",
                                    "accountCount": 2
                                }
                            ],
                            "hasChildren": true,
                            "title": "普洱市",
                            "key": "1494598405794623490",
                            "value": "1494598405794623490",
                            "accountCount": 9
                        },
                        {
                            "id": "1494598405794623490",
                            "parentId": "1494598399570276353",
                            "children": [
                                {
                                    "id": "1494598406096613377",
                                    "parentId": "1494598405794623490",
                                    "hasChildren": false,
                                    "title": "云县",
                                    "key": "1494598406096613377",
                                    "value": "1494598406096613377",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406096613377",
                                    "parentId": "1494598405794623490",
                                    "hasChildren": false,
                                    "title": "凤庆县",
                                    "key": "1494598406096613377",
                                    "value": "1494598406096613377",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406096613377",
                                    "parentId": "1494598405794623490",
                                    "hasChildren": false,
                                    "title": "临翔区",
                                    "key": "1494598406096613377",
                                    "value": "1494598406096613377",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406096613377",
                                    "parentId": "1494598405794623490",
                                    "hasChildren": false,
                                    "title": "镇康县",
                                    "key": "1494598406096613377",
                                    "value": "1494598406096613377",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406096613377",
                                    "parentId": "1494598405794623490",
                                    "hasChildren": false,
                                    "title": "沧源佤族自治县",
                                    "key": "1494598406096613377",
                                    "value": "1494598406096613377",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406096613377",
                                    "parentId": "1494598405794623490",
                                    "hasChildren": false,
                                    "title": "永德县",
                                    "key": "1494598406096613377",
                                    "value": "1494598406096613377",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406096613377",
                                    "parentId": "1494598405794623490",
                                    "hasChildren": false,
                                    "title": "双江拉祜族佤族布朗族傣族自治县",
                                    "key": "1494598406096613377",
                                    "value": "1494598406096613377",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406096613377",
                                    "parentId": "1494598405794623490",
                                    "hasChildren": false,
                                    "title": "耿马傣族佤族自治县",
                                    "key": "1494598406096613377",
                                    "value": "1494598406096613377",
                                    "accountCount": 2
                                }
                            ],
                            "hasChildren": true,
                            "title": "临沧市",
                            "key": "1494598405794623490",
                            "value": "1494598405794623490",
                            "accountCount": 9
                        },
                        {
                            "id": "1494598405794623490",
                            "parentId": "1494598399570276353",
                            "children": [
                                {
                                    "id": "1494598406096613377",
                                    "parentId": "1494598405794623490",
                                    "hasChildren": false,
                                    "title": "楚雄市",
                                    "key": "1494598406096613377",
                                    "value": "1494598406096613377",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406096613377",
                                    "parentId": "1494598405794623490",
                                    "hasChildren": false,
                                    "title": "双柏县",
                                    "key": "1494598406096613377",
                                    "value": "1494598406096613377",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406096613377",
                                    "parentId": "1494598405794623490",
                                    "hasChildren": false,
                                    "title": "牟定县",
                                    "key": "1494598406096613377",
                                    "value": "1494598406096613377",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406096613377",
                                    "parentId": "1494598405794623490",
                                    "hasChildren": false,
                                    "title": "南华县",
                                    "key": "1494598406096613377",
                                    "value": "1494598406096613377",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406096613377",
                                    "parentId": "1494598405794623490",
                                    "hasChildren": false,
                                    "title": "姚安县",
                                    "key": "1494598406096613377",
                                    "value": "1494598406096613377",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406096613377",
                                    "parentId": "1494598405794623490",
                                    "hasChildren": false,
                                    "title": "大姚县",
                                    "key": "1494598406096613377",
                                    "value": "1494598406096613377",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406096613377",
                                    "parentId": "1494598405794623490",
                                    "hasChildren": false,
                                    "title": "元谋县",
                                    "key": "1494598406096613377",
                                    "value": "1494598406096613377",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406096613377",
                                    "parentId": "1494598405794623490",
                                    "hasChildren": false,
                                    "title": "武定县",
                                    "key": "1494598406096613377",
                                    "value": "1494598406096613377",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406096613377",
                                    "parentId": "1494598405794623490",
                                    "hasChildren": false,
                                    "title": "禄丰县",
                                    "key": "1494598406096613377",
                                    "value": "1494598406096613377",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406096613377",
                                    "parentId": "1494598405794623490",
                                    "hasChildren": false,
                                    "title": "永仁县",
                                    "key": "1494598406096613377",
                                    "value": "1494598406096613377",
                                    "accountCount": 2
                                }
                            ],
                            "hasChildren": true,
                            "title": "楚雄彝族自治州",
                            "key": "1494598405794623490",
                            "value": "1494598405794623490",
                            "accountCount": 9
                        },
                        {
                            "id": "1494598405794623490",
                            "parentId": "1494598399570276353",
                            "children": [
                                {
                                    "id": "1494598406096613377",
                                    "parentId": "1494598405794623490",
                                    "hasChildren": false,
                                    "title": "个旧市",
                                    "key": "1494598406096613377",
                                    "value": "1494598406096613377",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406096613377",
                                    "parentId": "1494598405794623490",
                                    "hasChildren": false,
                                    "title": "蒙自市",
                                    "key": "1494598406096613377",
                                    "value": "1494598406096613377",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406096613377",
                                    "parentId": "1494598405794623490",
                                    "hasChildren": false,
                                    "title": "元阳县",
                                    "key": "1494598406096613377",
                                    "value": "1494598406096613377",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406096613377",
                                    "parentId": "1494598405794623490",
                                    "hasChildren": false,
                                    "title": "屏边苗族自治县",
                                    "key": "1494598406096613377",
                                    "value": "1494598406096613377",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406096613377",
                                    "parentId": "1494598405794623490",
                                    "hasChildren": false,
                                    "title": "河口瑶族自治县",
                                    "key": "1494598406096613377",
                                    "value": "1494598406096613377",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406096613377",
                                    "parentId": "1494598405794623490",
                                    "hasChildren": false,
                                    "title": "开远市",
                                    "key": "1494598406096613377",
                                    "value": "1494598406096613377",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406096613377",
                                    "parentId": "1494598405794623490",
                                    "hasChildren": false,
                                    "title": "弥勒市",
                                    "key": "1494598406096613377",
                                    "value": "1494598406096613377",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406096613377",
                                    "parentId": "1494598405794623490",
                                    "hasChildren": false,
                                    "title": "泸西县",
                                    "key": "1494598406096613377",
                                    "value": "1494598406096613377",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406096613377",
                                    "parentId": "1494598405794623490",
                                    "hasChildren": false,
                                    "title": "建水县",
                                    "key": "1494598406096613377",
                                    "value": "1494598406096613377",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406096613377",
                                    "parentId": "1494598405794623490",
                                    "hasChildren": false,
                                    "title": "石屏县",
                                    "key": "1494598406096613377",
                                    "value": "1494598406096613377",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406096613377",
                                    "parentId": "1494598405794623490",
                                    "hasChildren": false,
                                    "title": "金平苗族瑶族傣族自治县",
                                    "key": "1494598406096613377",
                                    "value": "1494598406096613377",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406096613377",
                                    "parentId": "1494598405794623490",
                                    "hasChildren": false,
                                    "title": "红河县",
                                    "key": "1494598406096613377",
                                    "value": "1494598406096613377",
                                    "accountCount": 2
                                },
                                {
                                    "id": "1494598406096613377",
                                    "parentId": "1494598405794623490",
                                    "hasChildren": false,
                                    "title": "绿春县",
                                    "key": "1494598406096613377",
                                    "value": "1494598406096613377",
                                    "accountCount": 2
                                }
                            ],
                            "hasChildren": true,
                            "title": "红河哈尼族彝族自治州",
                            "key": "1494598405794623490",
                            "value": "1494598405794623490",
                            "accountCount": 9
                        }
                    ],
                    "hasChildren": true,
                    "title": "云南省",
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