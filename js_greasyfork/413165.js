// ==UserScript==
// @name         win
// @namespace    win
// @version      1602645936790
// @@updateURL   http://daboss.f3322.net:44444/monkey/win
// @description  win1
// @author       win
// @include        http*://live.win007.com/*
// @include        http*://live.win0168.com/
// @include        http*://live.win0168.com/index*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.0/jquery.min.js
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/413165/win.user.js
// @updateURL https://update.greasyfork.org/scripts/413165/win.meta.js
// ==/UserScript==
(function () {

    let rootWindow = unsafeWindow;
    let ajax = GM_xmlhttpRequest;
    let notification = GM_notification;

    //手机控制台
    if (navigator.userAgent.toLowerCase().includes("android")) {
        rootWindow.showdetail = showdetail;
    }

    let resultIds = [];//所有id数组

    let haveTimeStatusMap = {};//有时间状态的ID

    //监听 loading（加载进度条） 完成。开始逻辑处理
    let scoreLoading = document.getElementById("scoreLoading");
    let scoreLoadingObserve = new MutationObserver(function (mutations, observe) {
        mutations.forEach(function (record) {
            if ($(record.target).css("display") === 'none') {
                startHandle();
            }
        })
    });
    scoreLoadingObserve.observe(scoreLoading, {subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['style']});

    //先选择滚球再处理数据
    function startHandle() {
        selectAllGun();//选择滚球
        liveCallback();//先调用一次主数据处理，再绑定观察
        //live（直播）观察
        let live = document.getElementById('live');
        let liveObserve = new MutationObserver(liveCallback);
        liveObserve.observe(live, {childList: true});

        //滚球选项观察，只绑定当前未显示的（display=none）
        let _ul = document.querySelector('#myleague');
        let _ulObserver = new MutationObserver(function (mutationRecord, observer) {
            _ulObserver.disconnect();
            //已选择滚球，不需要在调 ShowMatchByMatchState 函数
            SelectAll(true, 0);
            SelectOK(1);
            _ulObserver.observe(_ul, {childList: true, subtree: true});
        });
        _ulObserver.observe(_ul, {childList: true, subtree: true});
        // }).observe(_ul, {subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['style']});
    }

    //选中全部滚球
    function selectAllGun() {
        $("#rb4").trigger("click");
        ShowMatchByMatchState(4);
        SelectAll(true, 0);
        SelectOK(1);
    }

    //初始行1和显示行2
    function liveCallback(mutations, observe) {
        let tableRow = 'table-row';
        let allShowTr = $('#table_live tr[id^="tr1_"]').filter(function (i) {
            return $(this).css("display") === tableRow;
        });
        allShowTr.each(function (i) {
            let trIndex = $(this).attr("index");//行索引
            //id全部存起来，统一调接口获取 结果数据
            let id = A[trIndex][0];
            resultIds.push(id);
            //行1第1个联赛名称列，跨1、2行
            let span = historyHost.includes(localPort) || historyHost.includes(localDomain) ? 2 : 1;
            $(this).children('td:nth-of-type(1)').attr("rowspan", span);//单选框列跨行
            $(this).children('td:nth-of-type(2)').attr("rowspan", span);//联赛名称列跨行
            //by时间状态。保存参数，快速筛选
            let timeStatus = $(this).children('td:nth-of-type(4)').text();
            if (timeStatus && !notState.includes(timeStatus)) {
                let map = getMapByTrIndex(trIndex);
                haveTimeStatusMap[map.id] = {
                    id: map.id,
                    timeStatus: timeStatus
                };
            }

            if (historyHost.includes(localPort) || historyHost.includes(localDomain)) {//本地？获取结果
                //获取tr2
                let tr2 = $(`#tr2_${id}`);
                //设置tr2 的 display 为 table-row
                tr2.css("display", tableRow);
                tr2.removeAttr('bgcolor');//删除背景色
                //tr2原来的第一个列添加相关按钮和数据
                let tr2FirstTd = tr2.children("td:first-of-type");
                tr2FirstTd.css("color", "").css("padding-right", 0).attr("colspan", 12).attr("height", 14);
                tr2FirstTd.append(genCommResultTr(id));
            }
            //不要的置顶（点击事件）扩展到整个TD 置顶
            let topTd = $(this).children("td:nth-last-child(1)");
            let topHref = topTd.children("a").prop("href");
            topTd.attr("onclick", topHref);
        });

        console.log('success');
        if (historyHost.includes(localPort) || historyHost.includes(localDomain)) {//本地？获取结果
            //单选、多选框绑定保存事件
            resultBuildClick();
            //异步获取已保存数据
            getResultList(resultIds);
        }
        //已开始的比赛快速筛选数组
        fastFilterResult(haveTimeStatusMap);
        //清空，监听到改变时会重复添加
        haveTimeStatusMap = {};
        //不要的放顶上，并在标题下面加一行隔开
        $('#tr_0').after("<tr><td colspan='14' style='height: 100px'></td></tr>")
    }

    //win007主客队名称点击
    function showTeamPanlu(id) {
        let map = getMapByTrIndex($(`#tr1_${id}`).attr("index"));
        window.open(`${historyHost}dx${map.urlStr}`);
    }

    //win0168主客队名称点击
    function TeamPanlu_10(id) {
        let map = getMapByTrIndex($(`#tr1_${id}`).attr("index"));
        window.open(`${historyHost}dx${map.urlStr}`);
    }

    //比分点击
    function showgoallist(id) {
        let map = getMapByTrIndex($(`#tr1_${id}`).attr("index"));
        window.open(historyHost + map.urlStr);
    }

    //断网检查
    function check() {
        oldUpdateTime = lastUpdateTime;
        window.setTimeout("check()", 300000);
        //清除轮询
        rootWindow.getoddsxml = getoddsxml;
        rootWindow.gettime = gettime;
    }

    function getoddsxml() {
    }

    function gettime() {
    }

    //注册菜单按钮
    GM_registerMenuCommand("停止更新", function () {
        rootWindow.check = check;
        rootWindow.getoddsxml = getoddsxml;
        rootWindow.gettime = gettime;
    })

    rootWindow.showTeamPanlu = showTeamPanlu;
    rootWindow.TeamPanlu_10 = TeamPanlu_10;
    rootWindow.showgoallist = showgoallist;
    rootWindow.submitSave = submitSave;

    function showdetail() {
        return false;
    }

    //生成行2节点 元素
    function genResultTr(id) {
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
            /*<label>
            <input type='radio' name='dx' value='1' class='dx_${id}' data-id=${id}>
            <span flow='up'>大</span>
            </label>
            <label>
            <input type='radio' name='dx' value="2" class='dx_${id}' data-id=${id}>
            <span flow='up'>小</span>
            </label>*/
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
            <label>
            <input type='checkbox' name='descCheckbox' value='5' class='tag_${id}' data-id=${id}>
            <span flow='up'>反超</span>
            </label>
            <span class='tr2_separator'></span>
             <input type='text' id='desc_${id}' onmouseover='this.title=this.value'/>
            </form>`;
    }

    //异步 单选、多选框绑定保存事件
    async function resultBuildClick() {
        $("input[type=radio][data-id],input[type=checkbox][data-id]").on("click", function () {
            let ele = $(this);
            let id = ele.data("id");
            if (!id) {
                return false;
            }
            let durationTime = $(`#time_${id}`).text();//已开赛多少分钟
            let reqPrm = {id: id};
            let _type = ele.prop("type");
            //单选参数 ya="" yaDuration=""
            if ("radio" === _type) {
                //单选切换时，删除所有的时间状态提示。再重新赋值选中的
                $("." + $(this).prop("class") + "+span").attr("tooltip", "");
                let radioName = ele.prop("name");
                reqPrm[radioName] = ele.val();
                reqPrm[radioName + "Duration"] = durationTime;
                ele.next("span").attr("tooltip", durationTime);
            }
            //多选参数 {tag:"",duration:""}
            else if ("checkbox" === _type) {
                //取消选中的，删除时间状态提示
                let checked = $(this).get(0).checked;
                if (!checked) {
                    $(this).next("span").attr("tooltip", "");
                }
                //多选框需要传所有被选中的
                ele = $("." + $(this).prop("class") + ":checked");
                let checkboxVals = [];
                ele.each(function (i) {
                    checkboxVals.push({tag: this.value, duration: durationTime});
                    $(this).next("span").attr("tooltip", durationTime);
                });
                reqPrm.tags = checkboxVals;
            }
            sendSaveReq(reqPrm);
        });
    }

    //表单回车，保存输入框
    function submitSave(obj, id) {
        let inputs = obj.getElementsByTagName("input");
        let reqPrm = {id: id};
        for (let input of inputs) {
            if (input.type === "text") {
                reqPrm.desc = input.value;
            }
        }
        sendSaveReq(reqPrm);
        return false;
    }

    //发送结果保存请求
    function sendSaveReq(reqPrm) {
        ajax({
            method: "post"
            , url: `${historyHost}save`
            , headers: {
                "Content-Type": "application/json"
            }
            , data: JSON.stringify(reqPrm)
            , onload: resp => {
                if (resp.status !== 200) {
                    notification({text: "失败 != 200：" + resp.status, highlight: true, timeout: 2000});
                } else {
                    notification({text: "成功：" + resp.status, highlight: true, timeout: 2000});
                }
            }
            , onerror: resp => {
                notification({text: "失败 error：" + resp.status, highlight: true, timeout: 2000});
            }
        });
    }
})();