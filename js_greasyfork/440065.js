// ==UserScript==
// @name         zx-picking
// @namespace    zhixiang
// @version      0.2.0
// @description  get pickingMList
// @author       taochangyi
// @license MIT
// @match        https://jwms.jclps.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @require      https://cdn.staticfile.org/jquery-cookie/1.4.1/jquery.cookie.min.js
// @grant        unsafeWindow
// @grant       GM_xmlhttpRequest
// @connect     *
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/440065/zx-picking.user.js
// @updateURL https://update.greasyfork.org/scripts/440065/zx-picking.meta.js
// ==/UserScript==


(function() {
    'use strict';
    const baseUrl = "https://zs-picking-1615478-1309242695.ap-shanghai.run.tcloudbase.com/";
    const pin = $.cookie('pin')
    //waitForKeyElements ("div.big-table-wrap.secTable", addButton, true)
    //waitForKeyElements (".act-col:first", queryPickingState, false)
    //waitForKeyElements ("#tab-03-07-00-00", addButton, false)
    var tbodyEle = null
    var timeId = 0
    waitForKeyElements ("#pickingMTable", init, false)
    // 添加按钮
    function init (jNode){
        console.log("======run picking init=======")
        if(!timeId){
            clearInterval(timeId)
        }
        jNode.find("th:eq(6)").text("小程序")
        tbodyEle = jNode.children('tbody')
        // 查询父组件
        let nodePrint = jNode.prevAll(".dropdown")
        nodePrint.wrap("<div id='picking-input-line' style='display:flex;'></div>")
        //nodePrint.after("<div style='font-size:14px;margin-left:16px;line-height:30px'>今日已录单：<span id='today_num' style='color:#0099CC'>0</span>，本页未录单：<span id='page-not-num' style='color:#CC3333'>0</span></div>")
        //nodePrint.after('<button style="margin-left:16px;" id="btn_add" data-v-2fbc34b3="" type="button" class="el-button el-button--medium is-plain"><!----><!----><span><span data-v-2fbc34b3="" class="btn-name" id="btn-name">小程序录单</span><span data-v-2fbc34b3="" class="kong"></span><!----></span></button>')
        nodePrint.after("<div style='font-size:14px;margin-left:16px;line-height:30px'>本页录单：<span id='page-picking-num' style='color:#0099CC'>0/0</span></div>")
        nodePrint.after('<div class="btn-wrapper" style="margin-left:16px"><a id="btn_add" href="javascript:;" class="btn-line">小程序录单</a></div>')
        $("#btn_add").bind("click", btnAddClick)
        // 添加按钮禁用css
        var styleSheet = document.createElement( 'STYLE' )
        styleSheet.innerHTML += 'a.is-disabled{pointer-events: none;filter: alpha(opacity=50);-moz-opacity: 0.5;opacity: 0.5;cursor: not-allowed;}'
        document.body.appendChild( styleSheet )
        // 监控表格变化
        timeId = setInterval(watchTable, 200)
    }
    var lastTrEle = null
    // 监控表格变化
    function watchTable(){
        let trs = tbodyEle.children('tr')
        if(trs.length > 0 && trs[0] !== lastTrEle){
            lastTrEle = trs[0]
            handleData(trs)
        }
    }
    // 处理数据
    function handleData(trArray){
        let pickingNoArr = []
        trArray.each(function(){
            let noEle = $(this).children('td:eq(2)')
            if(noEle && noEle.text()){
                pickingNoArr.push(noEle.text())
            }
        })
        console.log('table change', pickingNoArr)
        if(pickingNoArr.length == 0){
            $('#page-picking-num').text('0/0')
            return
        }
        setButtonState(true, "查询中...")
        GM_xmlhttpRequest({
            method: "GET",
            url: `${baseUrl}api/queryPickingMList?no=${pickingNoArr.join()}&pin=${pin}`,
            onload: function (res) {
                let data = JSON.parse(res.response).data
                let list = data.list;
                trArray.each(function(index){
                    let picking = list.find(item => item.no == pickingNoArr[index])
                    if(picking){
                        $(this).children("td:eq(6)").text(`${picking.stateText}`)
                    }
                    else{
                        $(this).children("td:eq(6)").html(`<span style="color:#E6A23C">未录单<span>`)
                    }
                })
                $('#page-picking-num').text(`${list.length}/${trArray.length}`)
                setButtonState(false)
            }
        });


    }
    // 录单按钮被点击
    function btnAddClick(){
        console.log("btn_add_click")
        let pickingMList = []
        let selectedPickingMList = []
        tbodyEle.children("tr").each(function(index,ele){
            let picking = {}
            picking.no = $(ele).children("td:eq(2)").text()
            picking.orderCount = parseInt($(ele).children("td:eq(7)").text())
            picking.goodsCount = parseInt($(ele).children("td:eq(9)").text())
            picking.createTime = $(ele).children("td:eq(14)").text() + ' GMT+0800'
            pickingMList.push(picking)
            if($(ele).css('background-color') == 'rgb(253, 251, 204)'){
                selectedPickingMList.push(picking)
            }
        })
        console.log('已选择拣货单', selectedPickingMList)
        if(selectedPickingMList.length > 0){
            setButtonState(true, "录单中")
            GM_xmlhttpRequest({
                method: "POST",
                url: baseUrl + "api/addPickingMList",
                dataType: "json",
                data:JSON.stringify({pin:pin, list:selectedPickingMList}),
                headers: { 'Content-Type': 'application/json' },
                onload: function (res) {
                    let result = JSON.parse(res.response)
                    if(result.code == 200){
                        let list = result.data.list;
                        console.log(list)
                        tbodyEle.children("tr").each(function(index){
                            let picking = list.find(item => item.no == pickingMList[index].no)
                            if (picking != undefined){
                                $(this).children("td:eq(6)").text(picking.stateText)
                            }
                        })
                        // 更新本页录单数
                        let sArr = $('#page-picking-num').text().split('/')
                        let num1 = parseInt(sArr[0]) + result.data.newCount
                        $('#page-picking-num').text(`${num1}/${sArr[1]}`)

                        setButtonState(false)
                    }
                    else{
                        showButtonMessage(result.message)
                    }
                }
            });
        }
        else{
            showButtonMessage("请选择单号")
        }
    }
    //设置按钮状态
    function setButtonState(isDisable,tips){
        let ele = $("#btn_add")
        if(isDisable){
            ele.addClass("is-disabled")
            ele.text(tips)
        }else{
            ele.removeClass("is-disabled")
            ele.text(tips || "小程序录单")
        }
    }
    //提示错误信息
    function showButtonMessage(message){
        setButtonState(true, message)
        setTimeout(()=>{
            setButtonState(false)
        }, 1500)
    }


    //waitForKeyElements
    function waitForKeyElements (
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
                                           .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                },
                100
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}
})();