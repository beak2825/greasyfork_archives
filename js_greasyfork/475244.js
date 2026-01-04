console.log.apply(void 0, [
    '%c[@inject] %coverride http://oa.mengtiandairy.com:7070/seeyon/apps_res/collaboration/js/listPending.js',
    'color: green',
    'color: gray'
])

//批处理
function batchDeal() {
    var rows = grid.grid.getSelectRows();
    if (rows.length == 0) {
        $.alert($.i18n('collaboration.listPending.selectBatchData')); //请选择要删除的记录
        return;
    }
    var sendDevelop = $.ctp.trigger('beforeBatchDealColl');
    if (!sendDevelop) {
        return;
    }
    var process = new BatchProcess();
    for (var i = 0; i < rows.length; i++) {
        var affairId = rows[i].affairId;
        var subject = rows[i].subject;
        var category = rows[i].category || "1";
        var summaryId = rows[i].summaryId;
        if (process.batchOpinion == "0" || process.batchOpinion == null) {
            process.batchOpinion = rows[i].disAgreeOpinionPolicy == null ? "0" : rows[i].disAgreeOpinionPolicy == "1" ? "3" : "0";//意见是否必填，3,不同意时，意见必填
        }
        process.addData(affairId, summaryId, category, subject);
    }

    if (!process.isEmpty()) {
        var r = process.doBatch();
    }
    //try{window.location.reload();}catch(e){}
}


//取消加粗
function cancelBold(rowIndex) {
    var obj = $("tr:eq(" + rowIndex + ")").find(".font_bold");
    if (obj != null && typeof (obj) != 'undefined') obj.removeClass("font_bold");
}
function rend(txt, data, r, c, col) {
    //未读  11  加粗显示
    var subState = data.subState;
    var readState = data.readState;
    if (readState == 0 || subState == 11) {
        txt = "<span class='font_bold'>" + (txt == undefined ? '' : txt) + "</span>"
    }

    if (col.name == "subject") {
        //标题列加深
        txt = "<span class='grid_black titleText'>" + txt + "</span>";
        //如果是代理 ，颜色变成蓝色
        if (data.proxy) {
            txt = "<span class='color_blue'>" + txt + "</span>";
        }
        //加图标
        //重要程度
        if (data.importantLevel != "" && data.importantLevel != 1) {
            txt = "<span style='float: left;' class='ico16 important" + data.importantLevel + "_16 '></span>" + txt;
        }
        //附件
        if (data.hasAttsFlag == true) {
            txt = txt + "<span class='ico16 affix_16'></span>";
        }
        //协同类型
        if (data.bodyType != "" && data.bodyType != null && data.bodyType != "10" && data.bodyType != "30" && data.bodyType !== "90") {
            txt = txt + "<span class='ico16 office" + data.bodyType + "_16'></span>";
        }
        //流程状态
        if (data.state != null && data.state != "" && data.state != "0" && data.state != "2") {
            txt = "<span style='float: left;' class='ico16  flow" + data.state + "_16 '></span>" + txt;
        }
        //如果设置了处理期限(节点期限),添加超期图标
        if (data.nodeDeadLineName != $.i18n('common.default')) {
            if (data.isCoverTime) {
                //超期图标
                txt = txt + "<span class='ico16 extended_red_16'></span>";
            } else {
                //未超期图标
                txt = txt + "<span class='ico16 extended_blue_16'></span>";
            }
        }
    } else if (col.name === "nodeDeadLineName") {
        if (data.isCoverTime) {
            //超期图标
            txt = "<span class='color_red'>" + txt + "</span>";
        }
    } else if (col.name === "subState") {
        var titleTip = subState;
        if (subState == 16 || subState == 17 || subState == 18) {
            titleTip = 16;
        };
        var toolTip = $.i18n('collaboration.toolTip.label' + subState);
        var backFromId = data.backFromId;
        var isBackfrom = false;
        if (backFromId != null || (data.subState == "7" || data.subState == "16")) {
            isBackfrom = true;
        }
        //被回退，处理提交后取回，不显示回退图标
        if (isBackfrom && subState != 13 && subState != 15 && subState != 17 && subState != 6) {//被回退并且暂存待办后不显示。被回退图标
            toolTip = $.i18n('collaboration.toolTip.label' + 16);
            return "&nbsp;<span class='ico16 be_rolledback_16' title='" + toolTip + "'></span>&nbsp;";
        } else if (subState == 12) {
            return "&nbsp;<span class='ico16 viewed_16' title='" + toolTip + "'></span>&nbsp;";
        } else if (subState == 6) {
            toolTip = $.i18n("common.toolbar.takeBack.label");
            return "&nbsp;<span class='ico16 retrieve_16' title='" + toolTip + "'></span>&nbsp;";
        } else {
            if (subState == 15 || subState == 17) {
                toolTip = $.i18n("common.workflow.specialback.label");
                if (subState == 17) {
                    //指定回退中间节点的时候按照指定回退发起方显示图标
                    subState = 15;
                }
            }
            return "&nbsp;<span class='ico16 pending" + subState + "_16' title='" + toolTip + "'></span>&nbsp;";
        }
    } else if (col.name === "processId") {
        return "&nbsp;<a class='ico16 view_log_16 noClick' href='javascript:void(0)' onclick='showDetailLogDialog(\"" + data.summaryId + "\",\"" + data.processId + "\",2)'></a>&nbsp;";
    } else if (col.name === "nodeName") {
        return null == data.affairNodeName ? txt : data.affairNodeName + "(" + txt + ")";
    } else if (col.name == "hasPrint") {//是否打印
        if (data.print > 0) {
            txt = "<span class='font_bold'>" + $.i18n('common.yes') + "</span>";
        } else {
            txt = "<span class='font_bold'>" + $.i18n('common.no') + "</span>";
        }

    }
    return txt;
}

//点击事件
function dbclickRow(data, rowIndex, colIndex) {
    //取消加粗
    //cancelBold(rowIndex);
    $("#listPending tr").eq(rowIndex).find("span").removeClass("font_bold");

    if (!isAffairValid(data.affairId)) {
        $("#listPending").ajaxgridLoad();
        return;
    }
    var url = _ctxPath + "/collaboration/collaboration.do?method=summary&openFrom=listPending&affairId=" + data.affairId + (window.CsrfGuard ? CsrfGuard.getUrlSurffix() : "");
    var title = data.subject;
    doubleClick(url, escapeStringToHTML(title));
    grid.grid.resizeGridUpDown('down');
    //页面底部说明加载
    $('#summary').attr("src", _ctxPath + "/collaboration/listDesc.do?method=listDesc&type=listPending&size=" + grid.p.total + "&r=" + Math.random() + CsrfGuard.getUrlSurffix());
}
//删除
function deleteCol() {
    deleteItems('pending', grid, 'listPending', paramMethod);
}

function transmitCol() {
    transmitColFromGrid(grid);
}

var grid;
var searchobj;
var isSearch = false;
var layoutObj = null;


$(document).ready(function () {
    var bpmMenuType = $("#bpmMenuType").val();
    var tppHeight = 102;
    if (!bpmMenuType || bpmMenuType === "false") {
        tppHeight = 112;
    }
    if (isShowStatisticalToolBar == "0") {
        tppHeight = 40;
    }
    layoutObj = new MxtLayout({
        'id': 'layout',
        'northArea': {
            'id': 'north',
            'height': tppHeight,
            'sprit': false,
            'border': false
        },
        'centerArea': {
            'id': 'center',
            'border': false,
            'minHeight': 20
        }
    });
    var submenu = new Array();
    //判断是否有新建协同的资源权限，如果没有则屏蔽转发协同
    if ($.ctx.resources.contains('F01_newColl')) {
        //协同
        submenu.push({ name: $.i18n('common.toolbar.transmit.col.label'), click: transmitCol });
    };
    //判断是否有转发邮件的资源权限，如果没有则屏蔽转发协同
    if ($.ctx.resources.contains('F12_mailcreate')) {
        //邮件
        if (emailShow) {
            submenu.push({ name: $.i18n('common.toolbar.transmit.mail.label'), click: transmitMail });
        }
    };
    var toolbarArray = new Array();
    //转发
    toolbarArray.push({ id: "transmit", name: $.i18n('common.toolbar.transmit.label'), className: "ico16 forwarding_16", subMenu: submenu });
    //归档
    if (isPigeonholeBtn() && hasDoc == "true") {
        toolbarArray.push({ id: "pigeonhole", name: $.i18n('common.toolbar.pigeonhole.label'), className: "ico16 filing_16", click: function () { doPigeonhole("pending", grid, "listPending"); } });
    }
    //删除
    if (canDel == "true") {
        toolbarArray.push({ id: "delete", name: $.i18n('common.toolbar.delete.label'), className: "ico16 del_16", click: deleteCol });
    }
    //批处理
    toolbarArray.push({ id: "batchDeal", name: $.i18n('common.batch.handle.label'), className: "ico16 batch_16", click: batchDeal });
    //toolbar扩展
    for (var i = 0; i < addinMenus.length; i++) {
        toolbarArray.push(addinMenus[i]);
    }
    //批量打印
    //toolbarArray.push({id: "batchPrint", name: $.i18n('common.toolbar.batch.print.label'), className:"ico16 print_16", click:batchPrint});
    //智能排序开关
    if (hasAIPlugin == "true") {
        var checkValue = false;
        if (aiSortValueTemp == "true") {
            checkValue = true;
        }
        toolbarArray.push({ id: "aiSortBtn", type: "checkbox", checked: checkValue, text: $.i18n('ai.sort.labe'), value: "1", click: aiSortClick });
    }


    //工具栏
    $("#toolbars").toolbar({
        toolbar: toolbarArray
    });


    //查询条件
    var condition = new Array();
    //标题
    condition.push({ id: 'title', name: 'title', type: 'input', text: $.i18n("common.subject.label"), value: 'subject', maxLength: 100 });
    //模板名称
    condition.push({ id: 'templateNameSearch', name: 'templateName', type: 'input', text: $.i18n("common.template.label"), value: 'templateName' });
    //重要程度
    condition.push({
        id: 'importent', name: 'importent', type: 'select', text: $.i18n("common.importance.label"), value: 'importantLevel',
        items: [{
            text: $.i18n("common.importance.putong"),//普通
            value: '1'
        }, {
            text: $.i18n("common.importance.zhongyao"),//重要
            value: '2'
        }, {
            text: $.i18n("common.importance.feichangzhongyao"),//非常重要
            value: '3'
        }]
    });
    //发起人
    condition.push({ id: 'spender', name: 'spender', type: 'input', text: $.i18n("common.sender.label"), value: 'startMemberName' });
    //addby libing 上一处理人
    condition.push({ id: 'preApproverNameSearch', name: 'preApproverName', type: 'input', text: $.i18n("cannel.display.column.preApprover.label"), value: 'preApproverName' });
    //发起时间
    condition.push({ id: 'datetime', name: 'datetime', type: 'datemulti', text: $.i18n("common.date.sendtime.label"), value: 'createDate', ifFormat: '%Y-%m-%d', dateTime: false });
    //接受时间
    condition.push({ id: 'receivetime', name: 'receivetime', type: 'datemulti', text: $.i18n("cannel.display.column.receiveTime.label"), value: 'receiveDate', ifFormat: '%Y-%m-%d', dateTime: false });
    condition.push({ id: 'nodeDeadLine', name: 'nodeDeadLine', type: 'datemulti', text: $.i18n("common.workflow.deadline.date"), value: 'expectprocesstime', ifFormat: '%Y-%m-%d', dateTime: false });
    condition.push({
        id: 'subStateSearch', name: 'subState', type: 'select', text: $.i18n("common.deal.state"), value: 'subState', ifFormat: '%Y-%m-%d', dateTime: false,
        items: [{
            text: $.i18n("collaboration.toolTip.label11"),//未读
            value: '11'
        }, {
            text: $.i18n("collaboration.toolTip.label12"),//已读
            value: '12'
        }, {
            text: $.i18n("common.save.and.pause.flow"),//暂存待办
            value: '13'
        }, {
            text: $.i18n("collaboration.toolTip.label16"),//被回退
            value: '7'
        }, {
            text: $.i18n("common.toolbar.takeBack.label"),//取回
            value: '6'
        }]
    });
    //是否超期:节点超期查询出来。
    condition.push({
        id: 'isOverdueSearch',
        name: 'isOverdue',
        type: 'select',
        text: $.i18n('collaboration.condition.affairOverdue'), //节点超期
        value: 'isOverdue',
        items: [{
            text: $.i18n('common.yes'),
            value: '1'
        }, {
            text: $.i18n('common.no'),
            value: '0'
        }]
    });

    var bpmMenuType = $("#bpmMenuType").val();
    var queryTppHeight = 72;
    if (!bpmMenuType || bpmMenuType === "false") {
        queryTppHeight = 82;
    }
    if (isShowStatisticalToolBar == "0") {
        queryTppHeight = 5;
    }

    var right = 85;
    //国际化下 查询区域的位置需要进行动态设置
    if (typeof (__getCurSysLang) !== "undefined") {
        var lang = __getCurSysLang();
        if (lang !== "zh_CN" && lang != "zh_TW") {
            right = 110;
        }
    }
    searchobj = $.searchCondition({
        right: right,
        top: queryTppHeight,
        searchHandler: function () {//chenxd 

            var val = searchobj.g.getReturnValue();

            if (val != null) {
                $("#listPending").ajaxgridLoad(getSearchValueObj());
                isSearch = true;
                var _summarySrc = $('#summary').attr("src");
                if (_summarySrc.indexOf("listDesc") != -1) {
                    setTimeout(function () {
                        $('#summary').attr("src", "listDesc.do?method=listDesc&type=listPending&size=" + grid.p.total + "&r=" + Math.random() + CsrfGuard.getUrlSurffix());
                    }, 1000);
                }
            }
        },
        conditions: condition
    });
    var _colModel = [{
        display: 'id',
        name: 'affairId',
        width: 'smallest',
        type: 'checkbox',
        isToggleHideShow: false,
        align: 'center'
    }, {
        display: $.i18n("common.subject.label"),//标题
        name: 'subject',
        sortable: true,
        width: 'big'
    }, {
        display: $.i18n("common.sender.label"),//发起人
        name: 'startMemberName',
        sortable: true,
        width: 'small'
    }, {
        display: $.i18n("cannel.display.column.preApprover.label"),//上一处理人
        name: 'preApproverName',
        sortable: true,
        width: 'small'
    }, {
        display: $.i18n("common.date.sendtime.label"),//发起时间
        name: 'startDate',
        sortable: true,
        width: 'medium'
    }, {
        display: $.i18n("cannel.display.column.receiveTime.label"),//接收时间
        name: 'receiveTime',
        sortable: true,
        width: 'medium'
    }, {
        display: $.i18n("common.workflow.deadline.date"),//处理期限（节点期限）
        name: 'nodeDeadLineName',
        sortable: true,
        width: 'medium'
    },/*{
        display: $.i18n("cannel.display.column.print.label"),//是否打印
        name: 'hasPrint',
        sortable : true,
        width: 'medium'
    },*/ {
        display: $.i18n("collaboration.col.hasten.number.label"),//催办次数
        name: 'hastenTimes',
        sortable: true,
        width: 'small'
    }, {
        display: $.i18n("common.deal.state"),//处理状态
        name: 'subState',
        width: 'small'
    }, {
        display: $.i18n("common.workflow.log.label"),//流程日志
        name: 'processId',
        width: 'small'
    }, {
        display: $.i18n("collaboration.current.Node.label"),//当前节点
        name: 'nodeName',
        sortable: true,
        width: 'small'
    }]
    // @inject-start: 添加列
    _colModel.splice(2, 0, ...window.colappend)
    // @inject-end
    //表格加载
    grid = $('#listPending').ajaxgrid({
        colModel: _colModel,
        click: dbclickRow,
        render: rend,
        height: 200,
        noTotal: isShowTotal == "0" ? true : false,
        onChangeSort: disableAISort,
        showTableToggleBtn: true,
        gridType: 'autoGrid',
        parentId: $('.layout_center').eq(0).attr('id'),
        vChange: true,
        vChangeParam: {
            overflow: "hidden",
            autoResize: false //表格下方是否自动显示
        },
        isHaveIframe: true,
        slideToggleBtn: true,
        callBackTotle: function (data) {
            /*if(!isSearch){
                $(".query_menu_bar .active_item .item_number").text(data);
            } else {
                isSearch = false;
            }*/
            // OA-178592
            $(".query_menu_bar .active_item .item_number").text(data);
        },
        managerName: "colManager",
        managerMethod: "getPendingList"
    });
    //页面底部说明加载
    $('#summary').attr("src", _ctxPath + "/collaboration/listDesc.do?method=listDesc&type=listPending&size=" + grid.p.total + "&r=" + Math.random() + CsrfGuard.getUrlSurffix());
    var params = {
        userId: _wfcurrentUserId,
        templeteIds: ""
    };
    if (isShowStatisticalToolBar == "1") {
        $('#statisticalToolBar').show();
        if (isShowTotal == "1") {
            callBackendMethod("colManager", "getOverdueOrSevenDayOverdueMap", _wfcurrentUserId, _paramTemplateIds, {
                success: function (data) {
                    $("#allPendingNum").text(grid.p.total);
                    $("#overTimeNum").text(data.overdue);
                    $("#sevenOverTimeNum").text(data.sevenDayOverdue);
                    $("#fromleaderNum").text(data.fromleader);
                    $("#myDepartmentNum").text(data.mydept);
                }
            });
        }
    }
    if (isShowTotal == "0") {
        $("#allPendingNum").hide();
        $("#overTimeNum").hide();
        $("#sevenOverTimeNum").hide();
        $("#fromleaderNum").hide();
        $("#myDepartmentNum").hide();
    }
});

function aiSortClick() {
    //智能排序清空右侧查询条件
    searchobj.g.clearCondition();
    //隐藏高级查询
    if ($(".more_query_area").css("display") !== "none" && $("#aiSortBtn").is(":checked")) {
        openQueryViews("listPending");
    }

    //智能查询参数
    var aiSortCondition = new Object();
    var toTab = $(".active_item").attr("id");
    if (toTab == 'overTime') {
        aiSortCondition.coverTime = "1";
    } else if (toTab == 'sevenOverTime') {
        aiSortCondition.sevenDayOverdue = "sevenDayOverdue";
    } else if (toTab == 'myDepartment') {
        aiSortCondition.myDept = "myDept";
    } else if (toTab == 'fromleader') {
        aiSortCondition.myLeader = "myLeader";
    }
    aiSortCondition.aiSort = ("checked" == $("#aiSortBtn").attr("checked")) + '';
    aiSortCondition.templeteIds = _paramTemplateIds;
    $("#listPending").ajaxgridLoad(aiSortCondition);
    //更新智能排序开关状态
    var params = new Object();
    params["aiSortValue"] = aiSortCondition.aiSort;
    params["openFrom"] = "listPending";
    params["source"] = "listPending";
    callBackendMethod("pendingManager", "updateAISortValue", params, {
        success: function (data) {
        }
    });
}

//关闭智能排序开关
function disableAISort() {
    //取消勾选
    $("#aiSortBtn").removeAttr("checked");
    //发送请求，更新ai排序状态
    var params = new Object();
    params["aiSortValue"] = "false";
    params["openFrom"] = "listPending";
    params["source"] = "listPending";
    callBackendMethod("pendingManager", "updateAISortValue", params, {
        success: function (data) {
        }
    });
}
function loadPendingGrid() {
    $("#listPending").ajaxgridLoad();
}

//判断当前窗口是否打开了
function exitWinOpen(affairId) {
    var _wmp = getCtpTop()._windowsMap;
    if (_wmp) {
        //参考common-debug.js修改
        try {
            var _wmpKeys = _wmp.keys();
        } catch (e) {//兼容处理，为了解决bug：OA-80754公司协同：连续打开2个新闻、2个公告，页签不关闭，这时，首页待办栏目中的标题点不动，栏目空间都可以刷新。
            getCtpTop()._windowsMap = new Properties();
            _wmp = getCtpTop()._windowsMap;
        }

        //不存在的情况删除之前打开的信息
        for (var p = 0; p < _wmp.keys().size(); p++) {
            var _kkk = _wmp.keys().get(p);
            try {
                var _fff = _wmp.get(_kkk);
                var _dd = _fff.document;
                if (_dd) {
                    var _p = parseInt(_dd.body.clientHeight);
                    if (_p == 0) {
                        _wmp.remove(_kkk);
                        p--;
                    }
                } else {
                    _wmp.remove(_kkk);
                    p--;
                }
            } catch (e) {
                _wmp.remove(_kkk);
                p--;
            }
        }
        var exitWin = _wmp.get(affairId);
        if (exitWin) {
            try {
                alert($.i18n("window.already.exit.js"));
                exitWin.focus();
                return false;
            } catch (e) {
            }
        }
    }

    return true;
}

function colseQuery() {
    try {
        var dialogTemp = window.parentDialogObj['queryDialog'];
        dialogTemp.close();
    } catch (e) {
    }
}

//二维码传参chenxd
function precodeCallback() {
    var obj = getSearchValueObj();
    obj.openFrom = "listPending";
    return obj;
}

function getSearchValueObj() {
    o = new Object();
    var templeteIds = $.trim(_paramTemplateIds);
    if (templeteIds != "") {
        o.templeteIds = templeteIds;
    }
    var choose = $('#' + searchobj.p.id).find("option:selected").val();
    if (choose == 'subject') {
        o.subject = $('#title').val();
    } else if (choose == 'templateName') {
        o.templateName = $('#templateNameSearch').val();
    } else if (choose == 'importantLevel') {
        o.importantLevel = $('#importent').val();
    } else if (choose == 'startMemberName') {
        o.startMemberName = $('#spender').val();
    } else if (choose == 'preApproverName') {
        o.preApproverName = $("#preApproverNameSearch").val();
    } else if (choose == 'createDate') {
        var fromDate = $('#from_datetime').val();
        var toDate = $('#to_datetime').val();
        if (fromDate != "" && toDate != "" && fromDate > toDate) {
            $.alert($.i18n('collaboration.rule.date'));//开始时间不能早于结束时间
            return;
        }
        var date = fromDate + '#' + toDate;
        o.createDate = date;
    } else if (choose == 'receiveDate') {
        var fromDate = $('#from_receivetime').val();
        var toDate = $('#to_receivetime').val();
        if (fromDate != "" && toDate != "" && fromDate > toDate) {
            $.alert($.i18n('collaboration.rule.date'));//开始时间不能早于结束时间
            return;
        }
        var date = fromDate + '#' + toDate;
        o.receiveDate = date;
    } else if (choose == 'expectprocesstime') {
        var fromDate = $('#from_nodeDeadLine').val();
        var toDate = $('#to_nodeDeadLine').val();
        if (fromDate != "" && toDate != "" && fromDate > toDate) {
            $.alert($.i18n('collaboration.rule.date'));//开始时间不能早于结束时间
            return;
        }
        var date = fromDate + '#' + toDate;
        o.expectprocesstime = date;
    } else if (choose == 'subState') {
        o.subState = $('#subStateSearch').val();
    } else if (choose == 'isOverdue') {
        o.isOverdue = $("#isOverdueSearch").val();
    }
    if (window.location.href.indexOf("condition=templeteAll&textfield=all") != -1) {
        o.templeteAll = "all";
    }
    //增加智能排序条件
    if (hasAIPlugin == "true") {
        var chk = $("#aiSortBtn").attr("checked");
        //刷新列表，并保存开关状态
        if (chk && chk == "checked") {
            o.aiSort = "true";
        } else {
            o.aiSort = "false";
        }
    }
    var toTab = $(".active_item").attr("id");
    if (toTab == 'overTime') {
        o.coverTime = "1";
    } else if (toTab == 'sevenOverTime') {
        o.sevenDayOverdue = "sevenDayOverdue";
    } else if (toTab == 'myDepartment') {
        o.myDept = "myDept";
    } else if (toTab == 'fromleader') {
        o.myLeader = "myLeader";
    }
    return o;
}

function tabSwitch(toTab) {
    tabActive(toTab);
    tabSwitchLoadData(toTab);
}

function tabActive(toTab) {
    if (toTab == 'allPending') {
        $("#allPending").addClass("active_item");
        $("#overTime").removeClass("active_item");
        $("#sevenOverTime").removeClass("active_item");
        $("#myDepartment").removeClass("active_item");
        $("#fromleader").removeClass("active_item");
    } else if (toTab == 'overTime') {
        $("#allPending").removeClass("active_item");
        $("#overTime").addClass("active_item");
        $("#sevenOverTime").removeClass("active_item");
        $("#myDepartment").removeClass("active_item");
        $("#fromleader").removeClass("active_item");
    } else if (toTab == 'sevenOverTime') {
        $("#allPending").removeClass("active_item");
        $("#overTime").removeClass("active_item");
        $("#sevenOverTime").addClass("active_item");
        $("#myDepartment").removeClass("active_item");
        $("#fromleader").removeClass("active_item");
    } else if (toTab == 'myDepartment') {
        $("#allPending").removeClass("active_item");
        $("#overTime").removeClass("active_item");
        $("#sevenOverTime").removeClass("active_item");
        $("#myDepartment").addClass("active_item");
        $("#fromleader").removeClass("active_item");
    } else if (toTab == 'fromleader') {
        $("#allPending").removeClass("active_item");
        $("#overTime").removeClass("active_item");
        $("#sevenOverTime").removeClass("active_item");
        $("#myDepartment").removeClass("active_item");
        $("#fromleader").addClass("active_item");
    }
}

function tabSwitchLoadData(toTab) {
    var param = new Object();
    if (toTab == 'overTime') {
        param.coverTime = "1";
    } else if (toTab == 'sevenOverTime') {
        param.sevenDayOverdue = "sevenDayOverdue";
    } else if (toTab == 'myDepartment') {
        param.myDept = "myDept";
    } else if (toTab == 'fromleader') {
        param.myLeader = "myLeader";
    }
    param.templeteIds = _paramTemplateIds;

    //切换页签的时候将查询条件带入
    var obj = getSearchValueObj();
    param = $.extend(obj, param);

    $("#listPending").ajaxgridLoad(param);
    // var params = {templeteIds:,
    //     userId:};
    //现取count从GRID中获取，无需切换页签请求后台
    //	callBackendMethod("colManager","getOverdueOrSevenDayOverdueMap",_wfcurrentUserId,_paramTemplateIds,{
    //        success : function (data) {
    //        	$("#allPendingNum").text(data.allpending);
    //			$("#overTimeNum").text(data.overdue); 
    //			$("#sevenOverTimeNum").text(data.sevenDayOverdue);
    //			$("#fromleaderNum").text(data.fromleader); 
    //			$("#myDepartmentNum").text(data.mydept); 
    //		}
    //    });
}

function showAdvanceSearch() {
    openQueryViews('listPending', !advanceSearchFlag);
}