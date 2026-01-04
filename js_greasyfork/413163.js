// ==UserScript==
// @name         history
// @namespace    history
// @version      1602645928197
// @@updateURL   http://daboss.f3322.net:44444/monkey/history
// @description  history1
// @author       history
// @include        http*://bf.win007.com/*
// @include        http*://*.win0168.com/football/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @run-at       document-idle
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.0/jquery.min.js
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/413163/history.user.js
// @updateURL https://update.greasyfork.org/scripts/413163/history.meta.js
// ==/UserScript==
(function () {

    let resultIds = [];//所有id数组

    let haveTimeStatusMaps = [];//已开始的比赛请求参数数组

    let rootWindow = unsafeWindow;
    let addStyle = GM_addStyle;
    let ajax = GM_xmlhttpRequest;
    let notification = GM_notification;

    //选中。使用:checked 在历史页不能选中
    // language=CSS
    // addStyle('input[type="radio"][data-id][checked=checked] + span, input[type="checkbox"][data-id][checked=checked] + span {\n    background-color: #00a000;\n    opacity: 1\n}');

    //主table宽度两边清空
    let centerEle = $("#table_live").parent();
    centerEle.prev().html("").width(0);
    centerEle.next().html("").width(0);
    //主table宽度
    $("body > div.resultBox > div.content").css("width", "940");

    //获取 url
    function getQueryString(id, tr) {
        let timeStatus = getTextVal(tr.children("td:nth-of-type(3)"));
        return encodeURI(`?id=${id}&timeStatus=${timeStatus}`);
    }

    //比分单击事件
    function showgoallist(id) {
        let biFenTd = $(`td[onclick='showgoallist(${id})']`);
        let tr = biFenTd.parent('tr');
        let urlStr = getQueryString(id, tr);
        // window.open(historyHost + 'm/oay' + urlStr);
        window.open(historyHost + urlStr);
    }

    rootWindow.getQueryString = getQueryString;
    rootWindow.showgoallist = showgoallist;
    rootWindow.submitSave = submitSave;

    //通过亚盘或大小盘口获取所有行
    let showTd = $("td[id^='hdp_']");
    if (showTd) {
        showTd.each(function (i) {
            let tr = $(`#tr1_${i + 1}`);
            //过滤没开盘的，并影藏行
            if (!$(this).attr("val")) {
                tr.css("display", "none");
                $(`#tr2_${i + 1}`).css("display", "none");
                return true;
            } else {
                tr.css("display", "")
            }
            tr.height(35);//高度
            //比分列获取id
            let scoreTd = tr.children("td:nth-of-type(5)");
            let clickAttr = scoreTd.attr("onclick");
            if (!clickAttr) {
                return true;
            }
            scoreTd.css("opacity", "0");//隐藏比分复盘
            //点击时间显示比分
            bindShowScoreEvent(tr.children("td:nth-of-type(2)"));
            //点击时间状态显示比分
            bindShowScoreEvent(tr.children("td:nth-of-type(3)"));
            //点击半场比分显示比分
            hideThisTr($(this).prev());
            //点击盘口显示比分
            hideThisTr($(this));
            //点击大小删除当前行
            hideThisTr($(this).next());
            let id = clickAttr.substring(clickAttr.indexOf("(") + 1, clickAttr.lastIndexOf(")"));
            //保存ID，获取 result
            resultIds.push(id);
            //by时间状态。保存参数，快速筛选
            let timeStatus = getTextVal(tr.children("td:nth-of-type(3)"));
            if (timeStatus && !notState.includes(timeStatus)) {
                haveTimeStatusMaps[id] = {
                    id: id,
                    timeStatus: timeStatus
                };
            }
            //添加data参数。否则在直播中缓存了的，在历史页中获取不到节点
            tr.attr("data-id", id);
            if (historyHost.includes(localPort) || historyHost.includes(localDomain)) {//本地？获取结果
                tr.children("td:nth-of-type(1)").attr("rowspan", 2);//联赛名称列跨行
                //当前行之后追加行2，显示结果
                let newTr = $("<tr></tr>").prop("align", "center");
                newTr.append("<td colspan='9' height='14' style='padding: 0'>" + genCommResultTr(id) + "</td>");
                tr.after(newTr);
            }
            //名字上绑定事件
            tr.children("td:nth-of-type(4),td:nth-of-type(6)").on("click", function () {
                // goto(getQueryString(id, tr));
                $(this).parent().children("td:nth-of-type(5)").css("opacity", "1");
            });
        });
        console.log('success');
        if (historyHost.includes(localPort) || historyHost.includes(localDomain)) {//本地？获取结果
            //单选、多选框绑定保存事件
            resultBuildClick();
            //异步获取已保存数据
            getResultList(resultIds);
        }
        //已开始的比赛快速筛选数组
        fastFilterResult(haveTimeStatusMaps);
    }

    //绑定显示比分事件
    function bindShowScoreEvent(obj) {
        obj.on("click", function () {
            $(this).parent().children("td:nth-of-type(5)").css("opacity", "1");
        });
    }    //绑定删除当前行事件
    function hideThisTr(obj) {
        obj.on("click", function () {
            $(this).parent().css("display", "none");
            $(this).parent().next().css("display", "none");
        });
    }

    //生成 结果展示行 元素
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
