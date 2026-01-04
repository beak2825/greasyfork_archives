// ==UserScript==
// @name         common
// @namespace    http://tampermonkey.net/
// @version      1601487025905
// @@updateURL   http://daboss.f3322.net:44444/monkey/common
// @description  try to take over the world!
// @author       You
// @match        http*://*.win007.com/*
// @match        http*://*.win0168.com/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @run-at       document-start
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.0/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/eruda/2.3.3/eruda.min.js
// @downloadURL https://update.greasyfork.org/scripts/413109/common.user.js
// @updateURL https://update.greasyfork.org/scripts/413109/common.meta.js
// ==/UserScript==
(function () {
    //手机控制台
    if (navigator.userAgent.toLowerCase().includes("android")) {
        eruda.init();
    }
    let rootWindow = unsafeWindow;
    let addStyle = GM_addStyle;
    let ajax = GM_xmlhttpRequest;
    let notification = GM_notification;

    let timeVal = 1000;
    notState = ['推迟', '推遲', '中断', '中斷', '腰斩', '腰斬', '待定', '待定', '取消', '取消'];
    localPort = "192.168.1.";
    localDomain = "daboss.f3322.net";
    rootWindow.domain = 'win007';

    //直播页所有行颜色
    // language=CSS
    addStyle("tr[id^=tr1_]{background-color: #ffffff}");
    //
    // language=CSS
    addStyle(".tr2_separator{border: solid 1px grey;border-top-width: 3px;border-bottom-width: 3px;margin-right: 4px}");
    //所有input对齐
    // language=CSS
    addStyle("input{vertical-align: bottom}");
    //输入框CSS
    // language=CSS
    addStyle('input[type=text] {\n    width: 240px;\n    padding: 0;\n    height: 15px;\n    border: 0;\n    border-bottom-width: 1px;\n' +
        '    border-bottom-style: solid;\n    border-bottom-color: #333;\n    border-left-width: 2px;\n    border-left-style: outset;\n    border-left-color: #eee;\n    background-color: #ddd;\n    color: #00a000;\n    font-weight: 700;\n}');

    //提交按钮
    // language=CSS
    addStyle('input[type=submit] {\n    height: 16px;\n    padding: 0;\n    line-height: 14px;\n    border-width: 1px;\n    outline: none;\n}');
    //单选框、多选框。框隐藏
    // language=CSS
    addStyle('input[type=radio][data-id], input[type=checkbox][data-id] {\n    display: none\n}');
    //单选框、多选框。通用CSS
    // language=CSS
    addStyle('input[type=radio][data-id] + span, input[type=checkbox][data-id] + span {\n    width: 40px;\n    height: 14px;\n' +
        '    line-height: 14px;\n    border: 1px solid #999999;\n    font-weight: bold;\n    opacity: 0.2;\n    margin-right: 2px;\n' +
        '    display: inline-block;\n    text-align: center;\n    background-color: #ffffe8\n}');

    //鼠标移入
    // language=CSS
    addStyle('input[type=radio][data-id]:hover + span, input[type=checkbox][data-id]:hover + span {\n    opacity: 1;\n    border-color: #ebebd9;\n}');
    //选中。使用:checked 在历史页不能选中，而使用 [checked=checked] 在直播页点击单选、多选又不能选中
    // language=CSS
    addStyle('input[type="radio"][data-id]:checked + span, input[type="checkbox"][data-id]:checked + span {\n    background-color: #00a000;\n    opacity: 1\n}');

    //悬浮提示
    // language=CSS
    addStyle('[tooltip] {\n    position: relative\n}\n\n[tooltip]::before, [tooltip]::after {\n    text-transform: none;\n    font-size: .9em;\n    line-height: 0.8;\n    user-select: none;\n    pointer-events: none;\n    position: absolute;\n    display: none;\n    opacity: 0;\n}\n\n[tooltip]::before {\n    content: \'\';\n    border: 5px solid transparent;\n    z-index: 1001;\n}\n/**/\n[tooltip]::after {\n    content: attr(tooltip);\n    font-family: Helvetica, sans-serif;\n    text-align: center;\n    max-width: 21em;\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    padding: 1ch 1.5ch;\n    border-radius: .3ch;\n    box-shadow: 0 1em 2em -.5em rgba(0, 0, 0, 0.35);\n    background: #333;\n    color: #fff;\n    z-index: 1000;\n}\n\n[tooltip]:hover::before, [tooltip]:hover::after {\n    display: block;\n}\n\n[tooltip=\'\']::before, [tooltip=\'\']::after {\n    display: none !important;\n}\n\n[tooltip][flow^="up"]::before {\n    bottom: 100%;\n    border-bottom-width: 0;\n    border-top-color: #333;\n}\n\n[tooltip][flow^="up"]::after {\n    bottom: calc(100% + 5px);\n}\n\n[tooltip][flow^="up"]::before, [tooltip][flow^="up"]::after {\n    left: 50%;\n    transform: translate(-50%, -.5em);\n}\n\n[tooltip][flow^="up"]:hover::before, [tooltip][flow^="up"]:hover::after {\n    opacity: .9;\n    transform: translate(-50%, 0);\n}');

    //（live）直播首页跳转到Crown
    let href = window.location.href;
    if (href.endsWith("live.win007.com/")) {
        window.location.replace("http://live.win007.com/index2in1.aspx?id=35")
    }

    //行 index 获取 相关参数（live直播页）
    function getMapByTrIndex(trIndex) {
        let id = A[trIndex][0];
        return {
            id: id,
            urlStr: `?id=${id}`
        };
    }

    //只获取本身文本节点（不包含子节点）
    function getTextVal(ele) {
        return ele.contents().filter(function () {
            return this.nodeType === 3;
        }).text();
    }

    //异步。批量获取保存的结果数据
    async function getResultList(resultIds) {
        if (resultIds) {
            let formData = new FormData();
            formData.append("ids", resultIds);
            //请求数据
            ajax({
                method: "post", url: `${historyHost}gets`, responseType: "json", data: formData
                , onload: resp => {
                    if (resp.status !== 200) {
                        notification({text: "!= 200 get result list：" + resp, highlight: true, timeout: 3000});
                    } else {
                        initResult(resp);
                    }
                }
                , onerror: resp => {
                    notification({text: "error get result list：" + resp, highlight: true, timeout: 3000});
                }
            });
        }
    }

    //初始化已保存的结果 #00ff00
    function initResult(resp) {

        for (let ret of resp.response) {
            if (!ret) {
                continue;
            }
            let id = ret.id;
            //输入框
            if (ret.desc) {
                $(`#desc_${id}`).val(ret.desc);
            }
            //欧盘
            if (ret.ou || ret.ou === 0) {
                let dxRadio = $(`.ou_${id}`).filter(`[value=${ret.ou}]`);
                dxRadio.attr("checked", "checked");
                dxRadio.next("span").attr("tooltip", ret.ouDuration);
                dxRadio.next("label").css("opacity", 1);
            }
            //大小盘
            if (ret.dx || ret.dx === 0) {
                let dxRadio = $(`.dx_${id}`).filter(`[value=${ret.dx}]`);
                dxRadio.attr("checked", "checked");
                dxRadio.next("span").attr("tooltip", ret.dxDuration);
                dxRadio.next("label").css("opacity", 1);
            }
            //亚盘
            if (ret.ya || ret.ya === 0) {
                let yaRadio = $(`.ya_${id}`).filter(`[value=${ret.ya}]`);
                yaRadio.attr("checked", "checked");
                yaRadio.next("span").attr("tooltip", ret.yaDuration);
                yaRadio.next("label").css("opacity", 1);
            }
            //多选框
            if (ret.tags) {
                let tagCheckbox = $(`.tag_${id}`);
                for (let tag of ret.tags) {
                    let targetEle = tagCheckbox.filter(`[value=${tag.tag}]`);
                    targetEle.attr("checked", "checked");
                    targetEle.next("span").attr("tooltip", tag.duration);
                    targetEle.next("label").css("opacity", 1);
                }
            }
        }
    }

    //异步。获取全部已筛选结果
    async function fastFilterResult(haveTimeStatusMap) {
        //全部key
        let keys;
        try {
            keys = Object.keys(haveTimeStatusMap);
        } catch (e) {
            keys = 0;
        }
        console.log("total：" + keys.length);
        if (keys.length < 1) {
            return;
        } else {
            let formData = new FormData();
            formData.append("ids", keys);
            //获取全部筛选结果
            ajax({
                method: "post", url: `${historyHost}fast/filter/result`, responseType: "json", data: formData
                , onload: resp => {
                    //200
                    if (resp.status === 200) {
                        let response = resp.response;
                        let match = response.match;
                        let partMatch = response.partMatch;
                        let noMatch = response.noMatch;
                        let noCache = response.noCache;
                        console.log(`完全匹配: ${match.length}, 部分匹配: ${partMatch.length}, 不匹配: ${noMatch.length}, 未设置：${noCache.length}. 
                                            合计: ${match.length + partMatch.length + noMatch.length + noCache.length}`);
                        for (let item of match) {//完全匹配
                            fastFilterMark(item);
                        }
                        for (let item of partMatch) {//部分匹配
                            fastFilterMark(item);
                        }
                        //未设置的请求数据
                        let timeoutIds = [];//定时任务ID数组
                        let notSucCount = 0;//非200次数
                        for (let i = 0; i < noCache.length; i++) {//未缓存、未筛选、未发请求的
                            let item = noCache[i];
                            //回调控制连续不成功时，清除定时任务
                            let timeoutId = timingFastFilter(i, noCache.length, item, haveTimeStatusMap, function (num) {
                                notSucCount += num
                                if (notSucCount > 2) {
                                    for (let item of timeoutIds) {
                                        clearTimeout(item);
                                    }
                                    console.log(`累计${notSucCount}次请求不成功，结束后续任务。`);
                                }
                            });
                            timeoutIds.push(timeoutId);
                        }
                    } else {
                        console.log("!=200 list fast filter result", resp);
                    }
                }
                , onerror: resp => {
                    console.log("error list fast filter result", resp);
                }
            });
        }
    }

    /*定时请求快速筛选接口*/
    function timingFastFilter(i, len, item, haveTimeStatusMap, fastFilterHandleCallback) {
        let timeoutId = setTimeout(function () {
            fastFilter(i, len, item, haveTimeStatusMap, fastFilterHandleCallback)
        }, timeVal * (i + 1))
        return timeoutId;
    }

    /*
    * 快速筛选，请求
    * fastFilterHandleCallback 回调响应结果
    * */
    function fastFilter(i, len, noCacheMap, haveTimeStatusMap, fastFilterHandleCallback) {
        let formData = new FormData();
        formData.append("id", noCacheMap.id);
        formData.append("timeStatus", haveTimeStatusMap[noCacheMap.id].timeStatus);
        //请求数据
        ajax({
            method: "post", url: `${historyHost}fast/filter`, responseType: "json", data: formData
            , onload: resp => {
                if (resp.status === 200) {
                    fastFilterMark(resp.response, fastFilterHandleCallback);
                } else {
                    console.log('!=200 fast filter', resp);
                }
                if (i === len - 1) {
                    console.log("filter：complete")
                }
            }
            , onerror: resp => {
                console.log("error fast filter", resp);
            }
        });
    }

    /*
    * 快速筛选，标记
    * fastFilterHandleCallback 回调响应结果
    * */
    function fastFilterMark(map, fastFilterHandleCallback) {
        let jqObj = $(`tr[data-id=${map.id}]`).children("td:nth-of-type(3)");//历史页面会添加 data-id 属性
        let firstTd = jqObj.length ? jqObj : $(`#tr1_${map.id}`).children("td:nth-of-type(1)");//不是历史页面
        if (map.match === 3) {
            firstTd.css("background", "green");
        } else if (map.match === 2) {
            firstTd.css("background", "radial-gradient(circle,green,#00800036)");
        } else {
            console.log('mismatching -> ', map);
            if (map.match === 0) {
                fastFilterHandleCallback(1);
            }
        }
    }

    rootWindow.getMapByTrIndex = getMapByTrIndex;
    rootWindow.getTextVal = getTextVal;
    rootWindow.getResultList = getResultList;
    rootWindow.fastFilterResult = fastFilterResult;
    rootWindow.genCommResultTr = genCommResultTr;

    //生成通用 结果展示行 元素。live 和 history 一样
    function genCommResultTr(id) {
        return `<form onsubmit='return submitSave(this,${id})' autocomplete='off'>

            <label>
            <input type='radio' name='ou' value='-1' class='ou_${id}' data-id=${id}>
            <span flow='up'>主</span>
            </label>
            <label>
            <input type='radio' name='ou' value='0' class='ou_${id}' data-id=${id}>
            <span flow='up'>和</span>
            </label>
            <label>
            <input type='radio' name='ou' value='1' class='ou_${id}' data-id=${id}>
            <span flow='up'>客</span>
            </label>
            <span class='tr2_separator'></span>
            <label>
            <input type='radio' name='ya' value='1' class='ya_${id}' data-id=${id}>
            <span flow='up'>主</span>
            </label>
            <label>
            <input type='radio' name='ya' value='2' class='ya_${id}' data-id=${id}>
            <span flow='up'>客</span>
            </label>
            <span class='tr2_separator'></span>
            <label>
            <input type='checkbox' name='descCheckbox' value='6' class='tag_${id}' data-id=${id}>
            <span flow='up'>可撸</span>
            </label>
            <label>
            <input type='checkbox' name='descCheckbox' value='5' class='tag_${id}' data-id=${id}>
            <span flow='up'>反超</span>
            </label>
            <span class='tr2_separator'></span>
            <label>
            <input type='checkbox' name='descCheckbox' value='1' class='tag_${id}' data-id=${id}>
            <span flow='up'>分胜负</span>
            </label>
            <label>
            <input type='checkbox' name='descCheckbox' value='2' class='tag_${id}' data-id=${id}>
            <span flow='up'>有一</span>
            </label>
            <label>
            <input type='checkbox' name='descCheckbox' value='3' class='tag_${id}' data-id=${id}>
            <span flow='up'>至一</span>
            </label>
            <label>
            <input type='checkbox' name='descCheckbox' value='4' class='tag_${id}' data-id=${id}>
            <span flow='up'>不穿</span>
            </label>
            <span class='tr2_separator'></span>
            <label>
            <input type='checkbox' name='descCheckbox' value='7' class='tag_${id}' data-id=${id}>
            <span flow='up'>观察</span>
            </label>
            <span class='tr2_separator'></span>
             <input type='text' id='desc_${id}' onmouseover='this.title=this.value'/>
            </form>`;
    }
})();
