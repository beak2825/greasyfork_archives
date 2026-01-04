// ==UserScript==
// @name         专业化团队-知识库维护工具
// @namespace    http://218.4.136.126:8881/epoint-jxgl-web
// @version      5.0
// @description  知识库维护工具
// @author       wl
// @match        https://fdoc.epoint.com.cn/onlinedoc/kfzknowledge/kfzknowledge/handlequestionworkflow?*
// // @require      https://unpkg.com/element-ui@2.15.1/lib/index.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457305/%E4%B8%93%E4%B8%9A%E5%8C%96%E5%9B%A2%E9%98%9F-%E7%9F%A5%E8%AF%86%E5%BA%93%E7%BB%B4%E6%8A%A4%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/457305/%E4%B8%93%E4%B8%9A%E5%8C%96%E5%9B%A2%E9%98%9F-%E7%9F%A5%E8%AF%86%E5%BA%93%E7%BB%B4%E6%8A%A4%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //#region 基础方法
    var mini = window.mini,
        $ = window.$,
        epoint = window.epoint,
        SrcBoot = window.SrcBoot,
        document = window.document,
        Util = window.Util,
        s_Html = window.s_Html,
        JSON = window.JSON,
        window_url = window.location.href,
        website_host = window.location.host;

    // var link = document.createElement("link");
    // link.rel = "stylesheet";
    // link.type = "text/css";
    // link.href = "https://unpkg.com/element-ui/lib/theme-chalk/index.css";
    // var head = document.getElementsByTagName("head")[0];
    // head.appendChild(link);

    // var script = document.createElement("script");
    // link.src = "https://unpkg.com/element-ui/lib/index.js";
    // var body = document.getElementsByTagName("body")[0];
    // script.appendChild(link);


    // var proxyUrl = "https://bird.ioliu.cn/v2";
    const SERVER_URL = "https://levideo.epoint.com.cn:1235/ga-se";

    const ISSUE_LIST_OF_DEMAND = "/demand/issue/list-of-demand";
    const ISSUE_FIX = "/demand/issue/fix";
    const ISSUE_DELETE = "/demand/issue/delete";

    const request = {
        post: function (path, data, success, sync) {
            let settings = {
                "async": sync ? false : true,
                "url": SERVER_URL + '/rest' + path,
                // "url": 'http://192.168.161.12:8092/ga-se/rest' + path,
                "method": "POST",
                "headers": {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": "Bearer " + getCookie("access_token")
                },
                "data": data,
                dataType: "json"
            }

            $.ajax(settings).done(success);
        }
    }
    var grids = {}, demandGuid;
    //#endregion 基础方法

    //#region 需求流程处理页面
    if (window_url.indexOf("handlequestionworkflow?") != -1 ) {
        // 需求信息
        const DEMAND_INFO = '/demand/info';
        // 签收
        const DEMAND_DESIGN_INFO = '/demand/design/sign';

        // 获取需求信息
        var demandInfo = {};

        var domToRender = $('#fkxx').find(".btn-group")[0];
        var domToolBar = $('.fui-toolbar').children().get(0);

        // 渲染流程处理页面按钮
        //createFeedbackBtn('设计复审', 'sjfs').render(domToRender);
        //createFeedbackBtn('代码评审', 'dmps').render(domToRender);
        //createFeedbackBtn('架构评审', 'jgps').render(domToRender);
         //createFeedbackBtn('符合度评审', 'fhdps').render(domToRender);
        //createFeedbackBtn('PM-功能评审', 'gnps').render(domToRender);
        loadBtn();

        var signBtn, planBtn;

        function afterDemandGuidLoad(f) {
            if (!window.rowguid) {
                setTimeout(function () {
                    afterDemandGuidLoad(f);
                }, 100);
                return;
            }
            demandGuid = window.rowguid;
            f();
        }

        function loadBtn() {
                    signBtn = createBtn("录入", function () {
                                loadDemandInfo();
                                var itemdate = "";
                                $.each(itemdate, function(index, node) {
				                var json = {};
				                json.projectname =mini.get('projectname').el.innerText.replace("&","111");
				                json.username = $('.form-control.span2[label="提交人"]').children().html();
                                json.demandname = mini.get('title').el.innerText.replace("&","111");
                                json.hopefinishdate = $('.form-control.span2[label="应完成时间"]').children().html();
                                json.youxian = mini.get('youxian').el.innerText;
                                json.note = mini.get('youxianreason').el.innerText;
                                json.windowurl =window_url.replace(/&/g,"替换符号");
                                    //218.4.136.126:8881
                                      window.open("http://192.168.207.136:8881/epoint-rwgl-web/jxgl/performancerequire/performancerequestionadd?data="+epoint.encodeUtf8(JSON.stringify(json)),
					                    "_blank");
			                    });
                            });
                            signBtn.render(domToolBar);
        }

        function loadDemandIssueList() {
            let container = $('#xqsjps').find('.fui-form')[0],
                issueType = 'demand';
            console.log(container);

            request.post(ISSUE_LIST_OF_DEMAND, {
                demandGuid: demandGuid,
                issueType: issueType,
                // auditType: auditType
            }, function (resp) {
                if (resp.success) {
                    var issueList = resp.custom;
                    var grid = getIssueGrid(issueList);
                    var addBtn = getIssueAddBtn(issueType);
                    var viewBtn = getIssueViewBtn(issueType);
                    var viewAllBtn = getIssueViewAllBtn(issueType);
                    var unfixedViewBtn = getUnfixedIssueViewBtn(issueType);
                    var downloadBtn = getIssueDownloadBtn(issueType);
                    addBtn.render(container);
                    viewBtn.render(container);
                    viewAllBtn.render(container);
                    unfixedViewBtn.render(container);
                    downloadBtn.render(container);
                    grid.render(container);
                    grids[issueType] = grid;
                }
            });
        }

        function createBtn(name, f) {
            var btn = new mini.Button();
            btn.addCls('mini-btn-primary');
            btn.set({
                disableMultiClick: false,
                text: name
            });
            btn.on('click', f);
            return btn;
        }

        /**
         * 创建个性化反馈的按钮
         * @param {*} name
         * @param {*} key
         * @returns
         */
        function createFeedbackBtn(name, key) {
            let btn = createBtn(name, function () {
                loadDemandInfo();

                request.post('/demand/report', {
                    "demandDTO": JSON.stringify(demandInfo)
                }, openFeedback);
                // openFeedback(key);
            });

            function openFeedback(param) {
                let isproductdemandval = window.isproductdemand.getValue();
                let innerprojectguid = mini.get('innerprojectguid').getValue();
                epoint.openDialog('添加反馈', 'cpzt/demandmanage/demandfeedbackadd?' + key + '=1&Demandguid=' + demandGuid + '&stepguid=' + window.stepguid + '&isproductdemand=' + isproductdemandval + '&innerprojectguid=' + innerprojectguid + '&projectguid=' + window.projectguid.getValue(), function (ret) {
                    epoint.refresh(['datagrid_feedback']);
                }, {
                    width: 1200,
                    height: 900
                });
            }


            return btn;
        }


        /**
         * 读取需求的基本信息
         */
        function loadDemandInfo() {
            var $output = $('.mini-outputtext');
            $output.each(function () {
                var id = $(this).attr('id');
                if (id) {
                    var miniOutputText = new mini.get(id);

                    demandInfo[correctId(id)] = miniOutputText.getValue();
                }
            });
            var $buttonedit = $('.mini-buttonedit');
            $buttonedit.each(function () {
                var id = $(this).attr('id');
                if (id) {
                    var miniButtonEdit = new mini.get(id);
                    demandInfo[correctId(id + "text")] = miniButtonEdit.getText();
                }
            });

            function correctId(id) {
                if (id.endsWith('guidtext')) {
                    return correctId(id.substr(0, id.length - 8) + "name")
                }
                if (id.endsWith('text')) {
                    return correctId(id.substr(0, id.length - 4));
                }
                if (id.endsWith('read')) {
                    return correctId(id.substr(0, id.length - 4));
                }
                if (id.endsWith('write')) {
                    return correctId(id.substr(0, id.length - 5));
                }
                return id;
            }

            demandInfo.rowguid = demandGuid;
            console.log(demandInfo);
        }
    }
    // #endregion 需求流程处理页面

    //#region 反馈页面
    if (window_url.indexOf("https://oa.epoint.com.cn/productrelease/cpzt/demandmanage/demandfeedbackadd") != -1) {
        demandGuid = Util.getUrlParams('Demandguid');
        var miniDemandName = window.parent.mini.get('demandname');
        var demandname = miniDemandName ? miniDemandName.getValue() : '';
        var auditType = "";
        // 接口路径
        const BODY_STRUCTURE_PATH = '/form/body-structure';
        let formInner = $("#fui-form>.form-inner")[0];
        let renderInfos = [];
        // SE-开发复审
        if (window_url.indexOf("https://oa.epoint.com.cn/productrelease/cpzt/demandmanage/demandfeedbackadd?fhdps=1") != -1) {
            $('#feedbackcontent').parents('.form-row').hide();
            demandFormInit('/demand/dev/audit', function () {
                let miniContent = mini.get('feedbackcontent');
                let render = renderInfos[0].render;
                let miniDes = render.findControlByKey('summary'); // 概述
                let miniFixDate = render.findControlByKey('planFixDate'); // 修复时间
                let miniPassed = render.findControlByKey('passed');
                miniContent.setValue(
                    miniDes.getValue() + "<br/>"
                    + "-------------------开发复审情况-------------------" + "<br/>"
                    + "复审结果：" + (miniPassed.getValue() == '是' ? "通过" : "未通过")
                    // + (miniPassed.getValue() == 'true' ? "" : ("<br/>" + "开发修复时间：" + miniFixDate.getText()))
                );
            });
            auditType = 'dev_audit';
            loadIssues('dev', formInner);
            loadIssues('design', formInner);
        }

        // PM-功能评审
        if (window_url.indexOf("https://oa.epoint.com.cn/productrelease/cpzt/demandmanage/demandfeedbackadd?gnps=1") != -1) {
            $('#feedbackcontent').parents('.form-row').hide();
            demandFormInit('/demand/dev/pm-audit', function () {
                let miniContent = mini.get('feedbackcontent');
                let render = renderInfos[0].render;
                let miniDes = render.findControlByKey('summary'); // 概述
                let miniFixDate = render.findControlByKey('planFixDate'); // 修复时间
                let miniPassed = render.findControlByKey('passed');
                miniContent.setValue(
                    miniDes.getValue() + "<br/>"
                    + "-------------------功能情况-------------------" + "<br/>"
                    + "复审结果：" + (miniPassed.getValue() == '是' ? "通过" : "未通过")
                    // + (miniPassed.getValue() == 'true' ? "" : ("<br/>" + "开发修复时间：" + miniFixDate.getText()))
                );
            });
            auditType = 'dev_audit_pm';
            loadIssues('dev', formInner);
            loadIssues('demand', formInner);
            loadIssues('design', formInner);
        }
      // 代码评审
        if (window_url.indexOf("https://oa.epoint.com.cn/productrelease/cpzt/demandmanage/demandfeedbackadd?dmps=1") != -1) {
            $('#feedbackcontent').parents('.form-row').hide();
            demandFormInit('/demand/dev/dm-audit', function () {
                let miniContent = mini.get('feedbackcontent');
                let render = renderInfos[0].render;
                let miniDes = render.findControlByKey('summary'); // 概述
                let miniFixDate = render.findControlByKey('planFixDate'); // 修复时间
                let miniPassed = render.findControlByKey('passed');
                miniContent.setValue(
                    miniDes.getValue() + "<br/>"
                    + "-------------------代码情况-------------------" + "<br/>"
                    + "复审结果：" + (miniPassed.getValue() == '是' ? "通过" : "未通过")
                    // + (miniPassed.getValue() == 'true' ? "" : ("<br/>" + "开发修复时间：" + miniFixDate.getText()))
                );
            });
            auditType = 'dev_audit_dm';
            loadIssues('dev', formInner);

        }
  // 架构评审
        if (window_url.indexOf("https://oa.epoint.com.cn/productrelease/cpzt/demandmanage/demandfeedbackadd?jgps=1") != -1) {
            $('#feedbackcontent').parents('.form-row').hide();
            demandFormInit('/demand/dev/dmcc-audit', function () {
                let miniContent = mini.get('feedbackcontent');
                let render = renderInfos[0].render;
                let miniDes = render.findControlByKey('summary'); // 概述
                let miniFixDate = render.findControlByKey('planFixDate'); // 修复时间
                let miniPassed = render.findControlByKey('passed');
                miniContent.setValue(
                    miniDes.getValue() + "<br/>"
                    + "-------------------代码情况-------------------" + "<br/>"
                    + "复审结果：" + (miniPassed.getValue() == '是' ? "通过" : "未通过")
                    // + (miniPassed.getValue() == 'true' ? "" : ("<br/>" + "开发修复时间：" + miniFixDate.getText()))
                );
            });
            auditType = 'dev_audit_dm_cc';
            loadIssues('dev', formInner);

        }
        // SE-设计安排
        if (window_url.indexOf("https://oa.epoint.com.cn/productrelease/cpzt/demandmanage/demandfeedbackadd?sjap=1") != -1) {
            $('#feedbackcontent').parents('.form-row').hide();
            demandFormInit('/demand/design/plan', function () {
                let miniContent = mini.get('feedbackcontent');
                let render = renderInfos[0].render;
                let miniDes = render.findControlByKey('adjustRecord');
                let miniFinishDate = render.findControlByKey('planDate');
                let miniHandler = render.findControlByKey('seHandlerGuid');
                miniContent.setValue(
                    miniDes.getValue() + "<br/>"
                    + "-------------------计划安排-------------------" + "<br/>"
                    + "设计责任人：" + miniHandler.getText() + "<br/>"
                    + "计划完成时间：" + miniFinishDate.getText()
                );
            });

        }

        // SE-工作结算
        if (window_url.indexOf("https://oa.epoint.com.cn/productrelease/cpzt/demandmanage/demandfeedbackadd?gzjs=1") != -1) {
            $('#feedbackcontent').parents('.form-row').hide();
            demandFormInit('/demand/design/balance', function () {
                let miniContent = mini.get('feedbackcontent');
                let render = renderInfos[0].render;
                let miniDes = render.findControlByKey('adjustRecord');
                let miniFinishDate = render.findControlByKey('planDate');
                let miniHandler = render.findControlByKey('seHandlerGuid');
                miniContent.setValue(
                    miniDes.getValue() + "<br/>"
                    + "-------------------计划安排-------------------" + "<br/>"
                    + "设计责任人：" + miniHandler.getText() + "<br/>"
                    + "计划完成时间：" + miniFinishDate.getText()
                );
            });

        }

        // SE-设计复审
        if (window_url.indexOf("https://oa.epoint.com.cn/productrelease/cpzt/demandmanage/demandfeedbackadd?sjfs=1") != -1) {
            $('#feedbackcontent').parents('.form-row').hide();
            demandFormInit('/demand/design/audit', function () {
                let miniContent = mini.get('feedbackcontent');
                let render = renderInfos[0].render;
                let miniDes = render.findControlByKey('summary');
                miniContent.setValue(
                    miniDes.getValue()
                );
            });
            // 加载设计问题登记
            auditType = 'design_audit';
            loadIssues('design', formInner);

        }

        /**
         * 初始化需要提交的表单信息
         * @param {*} methodPath 表单提交的接口地址
         */
        function demandFormInit(methodPath, beforeSave) {
            request.post(BODY_STRUCTURE_PATH, {path: methodPath}, function (body) {
                if (body.success) {
                    let vos = body.custom;
                    for (let i = 0; i < vos.length; i++) {
                        let vo = vos[i];
                        let render = new VORender(vo.structure, formInner);
                        renderInfos.push({
                            name: vo.name,
                            render: render
                        });
                    }


                    let miniAdd = mini.get('addClose');
                    miniAdd.un('click');
                    miniAdd.on('click', function () {
                        if (!epoint.validate('')) {
                            return;
                        }

                        if (beforeSave) {
                            beforeSave();
                        }

                        let data = {};

                        for (var i = 0; i < renderInfos.length; i++) {
                            let renderInfo = renderInfos[i]
                            var itemData = renderInfo.render.getData();
                            if (i == 0) {
                                itemData.demandname = demandname;
                                itemData.demandguid = demandGuid;
                            }
                            data[renderInfo.name] = JSON.stringify(itemData);
                        }

                        console.log(data);
                        request.post(methodPath, data, function (body) {
                            if (body.success) {
                                window.saveAndClose();
                            } else {
                                epoint.alert(body.status.text);
                            }
                        });

                    });
                }
            }, true)
        }

        /**
         * 加载问题清单
         * @param {*} issueType 问题类型,demand、design、dev
         * @param {*} auditType 评审类型,design_audit,dev_audit
         */
        function loadIssues(issueType, container) {

            request.post(ISSUE_LIST_OF_DEMAND, {
                demandGuid: demandGuid,
                issueType: issueType,
                auditType: auditType
            }, function (resp) {
                if (resp.success) {
                    var issueList = resp.custom;
                    var grid = getIssueGrid(issueList);
                    var addBtn = getIssueAddBtn(issueType);
                    var viewBtn = getIssueViewBtn(issueType);
                    var viewAllBtn = getIssueViewAllBtn(issueType);
                    var unfixedViewBtn = getUnfixedIssueViewBtn(issueType);
                    var downloadBtn = getIssueDownloadBtn(issueType);
                    addBtn.render(container);
                    viewBtn.render(container);
                    viewAllBtn.render(container);
                    unfixedViewBtn.render(container);
                    downloadBtn.render(container);
                    grid.render(container);
                    grids[issueType] = grid;
                }
            }, true);

        }
    }
    // #endregion 反馈页面

    //#region 去掉需求评审统计导出时间限制
    if (window_url.indexOf("https://oa.epoint.com.cn/productrelease/cpzt/demandtongji/demanddesigntongjilist") != -1) {
        window.expExcel = function () {

            var demandfrom = encodeURI(mini.get('demandfrom').getValue());
            var demandrange = encodeURI(mini.get('demandrange').getValue());
            var demandtype = encodeURI(mini.get('demandtype').getValue());
            var operateStart = encodeURI(mini.get('operateStart').getText());
            var operateEnd = encodeURI(mini.get('operateEnd').getText());
            var demandStyle = encodeURI(mini.get('demandstyle').getValue());
            //add by zy 20201028
            var kffinishStart = encodeURI(mini.get('kffinishStart').getText());
            var kffinishEnd = encodeURI(mini.get('kffinishEnd').getText());
            var leftTreeNodeGuid = encodeURI(mini.get('leftTreeNodeGuid').getValue());
            // add by zy 20201111
            var demandName = encodeURI(mini.get('demandName').getText());
            var projectName = encodeURI(mini.get('projectName').getText());
            window.open("demanddesigntongjilistaction.action?cmd=expExcel&demandfrom=" + demandfrom + "&demandrange=" + demandrange + "&demandtype=" + demandtype + "&operateStart=" + operateStart
                + "&operateEnd=" + operateEnd + "&demandStyle=" + demandStyle + "&kffinishStart=" + kffinishStart + "&kffinishEnd=" + kffinishEnd + "&demandName=" + demandName + "&projectName="
                + projectName + "&nodeInfo=" + leftTreeNodeGuid);
        }
    }

    // #endregion 去掉需求评审统计导出时间限制
  console.log( window.location);
    //#region 修改关闭方法，支持跨域回调父页面
    if (window_url.indexOf("https://levideo.epoint.com.cn:1235/ga-se/se/demandissue/demandissueadd") != -1) {
        window.closeCallback = function () {
            // 解决子页面跨域调用问题
            window.opener.postMessage({
                operateType: "refresh_grid",
                param: Util.getUrlParams('type')
            }, 'https://oa.epoint.com.cn');
            window.close();
        }
    }

    // #endregion 修改关闭方法，支持跨域回调父页面

    //#region 获取问题列表

    function getIssueAddBtn(issueType) {
        var btnName = "新增" + (issueType == "demand" ? "需求" : (issueType == "design" ? "设计" : "开发")) + "问题";
        var btn = new mini.Button();
        btn.set({
            disableMultiClick: false,
            text: btnName,
            onclick: function () {
                window.open(SERVER_URL + '/se/demandissue/demandissueadd?demandguid=' + demandGuid + '&type=' + issueType + '&auditType=' + (auditType ? auditType : ''));
            }
        });
        return btn;
    }

    function getIssueViewBtn(issueType) {
        var btnName = "预览";
        var btn = new mini.Button();
        btn.set({
            disableMultiClick: false,
            text: btnName,
            onclick: function () {
                window.open(SERVER_URL + '/se/demandissue/demandissueview?demandguid=' + demandGuid + '&issuetype=' + issueType + '&audittype=' + (auditType ? auditType : ''));
            }
        });
        return btn;
    }

    function getIssueViewAllBtn(issueType) {
        var btnName = "预览所有";
        var btn = new mini.Button();
        btn.set({
            disableMultiClick: false,
            text: btnName,
            onclick: function () {
                window.open(SERVER_URL + '/se/demandissue/demandissueview?demandguid=' + demandGuid + '&issuetype=' + issueType + '&audittype=');
            }
        });
        return btn;
    }

    function getUnfixedIssueViewBtn(issueType) {
        var btnName = "未修复预览";
        var btn = new mini.Button();
        btn.set({
            disableMultiClick: false,
            text: btnName,
            onclick: function () {
                window.open(SERVER_URL + '/se/demandissue/demandissueview?demandguid=' + demandGuid + '&issuetype=' + issueType + '&audittype=' + (auditType ? auditType : '') + '&isfixed=0');
            }
        });
        return btn;
    }

    function getIssueDownloadBtn(issueType) {
        var btnName = "下载";
        var btn = new mini.Button();
        btn.set({
            disableMultiClick: false,
            text: btnName,
            onclick: function () {
                window.open(SERVER_URL + '/rest/demand/issue/download?demandGuid=' + demandGuid + '&issueType=' + issueType + '&auditType=' + (auditType ? auditType : ''));
            }
        });
        return btn;
    }

    function getIssueGrid(issueList) {
        var grid = new mini.DataGrid();
        grid.set({
            id: 'rowguid',
            showPager: false,
            multiSelect: true,
            idField: "rowguid",
            columns: [{
                width: "50px",
                type: "checkcolumn",
                cellCls: "mini-checkcolumn",
                headerCls: "mini-checkcolumn",
                hideable: true
            }, {
                header: "序",
                width: "50px",
                type: "indexcolumn",
                headerAlign: "center"
            }, {
                header: "问题概述",
                field: "summary",
                width: "100%",
                headerAlign: "left"
            }, {
                header: "标签",
                field: "tag",
                width: "300px",
                headerAlign: "left"
            }, {
                header: "添加时间",
                field: "operatedate",
                width: "160px",
                headerAlign: "center"
            }, {
                header: "修复状态 ",
                width: "80px",
                align: "center",
                renderer: onIsFixedRenderer
            }, {
                header: "提交状态",
                width: "80px",
                align: "center",
                renderer: onIsSubmitRenderer
            }, {
                header: "查看",
                renderer: onViewRenderer,
                width: "60px",
                headerAlign: "center",
                align: "center"
            }, {
                header: "修改",
                renderer: onEditRenderer,
                width: "60px",
                headerAlign: "center",
                align: "center"
            }, {
                header: "修复",
                renderer: onFixRenderer,
                width: "60px",
                headerAlign: "center",
                align: "center"
            }, {
                header: "删除",
                renderer: onDeleteRenderer,
                width: "60px",
                headerAlign: "center",
                align: "center"
            }]
        });

        grid.setData(issueList);
        return grid;
    }

    // 修复状态数据
    var fixStatus = {
        1: {
            cls: 'dot-success',
            text: '已修复'
        },
        0: {
            cls: 'dot-error',
            text: '未修复'
        },
        2: {
            cls: 'dot-error',
            text: '无需修复'
        }
    };

    // 修复状态
    function onIsFixedRenderer(e) {
        var status = fixStatus[e.row.isfixed];
        return '<i class="' + status.cls + '"></i>' + status.text;
    }

    // 修复状态数据
    var submitStatus = {
        1: {
            cls: 'dot-success',
            text: '已提交'
        },
        0: {
            cls: 'dot-warn',
            text: '未提交'
        }
    };

    // 提交状态
    function onIsSubmitRenderer(e) {
        var status = submitStatus[e.row.issubmit];
        return '<i class="' + status.cls + '"></i>' + status.text;
    }

    // 修复
    function onFixRenderer(e) {
        if (e.row.issubmit == '0' || e.row.isfixed == "1") {
            return;
        }
        return epoint.renderCell(e, "action-icon icon-fix", "fixIssue", "epoint_total");
    }

    // 删除
    function onDeleteRenderer(e) {
        if (e.row.classification != 'demand' && e.row.issubmit == '1') {
            return;
        }
        return epoint.renderCell(e, "action-icon icon-remove", "deleteIssue", "epoint_total");
    }
      // 修改
    function onEditRenderer(e) {
        if ( e.row.isfixed == "1") {
            return;
        }
        return epoint.renderCell(e, "action-icon icon-edit", "editIssue", "epoint_total");
    }

    // 删除
    function onViewRenderer(e) {
        return epoint.renderCell(e, "action-icon icon-search", "viewIssue", "epoint_total");
    }

    window.fixIssue = function (e) {
        console.log(e);
        epoint.confirm("确认已经修复该问题？", "操作确认", function () {
            request.post(
                ISSUE_FIX,
                {guid: e.rowguid},
                function (resp) {
                    if (resp.success) {
                        epoint.showTips('操作成功');
                        refreshIssueGrid(e.classification);
                    }
                }
            )
        });
    }


    window.deleteIssue = function (e) {
        console.log(e);
        epoint.confirm("确认删除？", "操作确认", function () {
            request.post(
                ISSUE_DELETE,
                {guid: e.rowguid},
                function (resp) {
                    if (resp.success) {
                        epoint.showTips('操作成功');
                        refreshIssueGrid(e.classification);
                    }
                }
            )
        });
    }

    window.viewIssue = function (e) {
        top.epoint.openDialog(
            "问题查看",
            // 'https://baidu.com',
            SERVER_URL + '/se/demandissue/demandissuedetail?guid=' + e.rowguid
        );
    }
   window.editIssue = function (e) {
        top.epoint.openDialog(
            "问题查看",
            // 'https://baidu.com',
            SERVER_URL + '/se/demandissue/demandissueedit?guid=' + e.rowguid
        );
    }
    window.refreshIssueGrid = function (issueType) {
        request.post(ISSUE_LIST_OF_DEMAND, {
            demandGuid: demandGuid,
            issueType: issueType,
            auditType: auditType
        }, function (resp) {
            if (resp.success) {
                var issueList = resp.custom;
                grids[issueType].setData(issueList);
            }
        });
    }

    // 解决子页面跨域调用问题
    window.addEventListener('message', function (e) {
        console.log(e.data);
        if (e.data.operateType == "refresh_grid") {
            refreshIssueGrid(e.data.param);
        }
    }, false);

    // #endregion 获取问题列表

    /**
     * 渲染表单控件
     * @param {*} vo
     * @param {*} container
     */
    function VORender(vo, container) {
        const MAX_COLUMNS = 2;

        let rows = [],
            currentRow = {
                column: 0,
                rowDom: createRow()
            },
            controls = [];


        for (let i = 0; i < vo.length; i++) {
            let controlInfo = vo[i];
            if (!controlInfo.colspan) {
                controlInfo.colspan = 1;
            }
            if (controlInfo.colspan + currentRow.column > MAX_COLUMNS) {
                rows.push(currentRow);
                currentRow = {
                    column: 0,
                    rowDom: createRow()
                };
            }

            let control = createMini(controlInfo);
            control.key = controlInfo.key;
            controls.push(control);

            fillRow({
                mini: control.mini,
                name: controlInfo.name,
                size: controlInfo.colspan
            }, currentRow.rowDom);

            currentRow.column += controlInfo.colspan;

        }
        if (currentRow.column > 0) {
            rows.push(currentRow);
        }

        for (let i = 0; i < rows.length; i++) {
            container.append(rows[i].rowDom);
        }

        this.getData = function () {
            let data = {};
            for (let i = 0; i < controls.length; i++) {
                let control = controls[i];
                if (control.miniInfo.miniType == 'CheckBox') {
                    data[control.key] = control.mini.getValue() == 'true';
                } else {
                    data[control.key] = control.mini.getValue();
                    if (control.miniInfo.miniType == 'ButtonEdit') {
                        if (control.miniInfo.relatedTextFieldName) {
                            data[control.miniInfo.relatedTextFieldName] = control.mini.getText();
                        }
                    }
                }
            }
            return data;
        }

        this.getControlInfos = function () {
            return controls;
        }

        this.findControlByKey = function (key) {
            for (var i = 0; i < controls.length; i++) {
                if (key == controls[i].key) {
                    return controls[i].mini;
                }
            }
        }

        function createRow() {
            let row = document.createElement('div');
            row.className = 'form-row';
            return row;
        }

        /**
         * 创建miniui控件对象
         * @param {*} controlInfo
         * @returns
         */
        function createMini(controlInfo) {
            let miniInfo = {};
            let miniControl;
            let items = [];
            switch (controlInfo.type) {
                case "checkbox":
                    miniControl = new mini.CheckBox();
                    miniInfo.miniType = "CheckBox";
                    miniControl.set({});
                    break;
                case "dateInput":
                    miniControl = new mini.DatePicker();
                    miniInfo.miniType = "DatePicker";
                    miniControl.set({
                        required: controlInfo.isRequired,
                        width: '250px'
                    });
                    break;
                case "singleSelect":
                    miniControl = new mini.RadioButtonList();
                    miniInfo.miniType = "RadioButtonList";
                    for (let i = 0; i < controlInfo.items.length; i++) {
                        items.push({
                            'value': controlInfo.items[i],
                            'text': controlInfo.items[i]
                        })
                    }
                    miniControl.set({
                        required: controlInfo.isRequired,
                        textField: 'text',
                        valueField: 'value',
                        data: items
                    });
                    break;
                case "multiSelect":
                    miniControl = new mini.CheckBoxList();
                    miniInfo.miniType = "CheckBoxList";
                    for (let i = 0; i < controlInfo.items.length; i++) {
                        items.push({
                            'value': controlInfo.items[i],
                            'text': controlInfo.items[i]
                        })
                    }
                    miniControl.set({
                        required: controlInfo.isRequired,
                        textField: 'text',
                        valueField: 'value',
                        data: items
                    });
                    break;
                case "numberInput":
                    miniControl = new mini.TextBox();
                    miniInfo.miniType = "TextBox";
                    miniControl.set({
                        required: controlInfo.isRequired,
                        vtype: 'int'
                    });
                    break;
                case "textInput":
                    if (controlInfo.textType || controlInfo.textType == "single") {
                        miniControl = new mini.TextArea();
                        miniInfo.miniType = "TextArea";
                        var defaultValue="";
                        if(controlInfo.key=="appraise"){
                         defaultValue="完成程度：（优、良、及格、差），设计理解：（优、良、及格、差），自检效果：（优、良、及格、差）\r\n 个人评价：";
                        }
                        miniControl.set({
                            required: controlInfo.isRequired,
                            value:defaultValue
                        });
                    } else {
                        miniControl = new mini.TextBox();
                        miniInfo.miniType = "TextBox";
                        miniControl.set({
                            required: controlInfo.isRequired
                        });
                    }
                    break;
                case "dialogSelect":
                    miniControl = new mini.ButtonEdit();
                    miniInfo.miniType = "ButtonEdit";
                    miniInfo.relatedTextFieldName = controlInfo.relatedTextFieldName;
                    miniControl.set({
                        required: controlInfo.isRequired
                    })
                    miniControl.on("buttonclick", function () {
                        var controlValue = miniControl.getValue();
                        var param = {};
                        param[controlInfo.dialogParamName] = controlValue;
                        epoint.openTopDialog('选择' + controlInfo.name, controlInfo.dialogUrl, function (rtnValue) {
                            if (rtnValue && rtnValue != 'close') {
                                var s = rtnValue.split("_SPLIT_");
                                miniControl.setValue(s[0]);
                                miniControl.setText(s[1]);
                            }
                        }, {
                            'width': controlInfo.width,
                            'height': controlInfo.height,
                            param: param
                        });
                    });
                    break;
                case "treeSelect":
                    miniControl = new mini.TreeSelect();
                    miniInfo.miniType = "TreeSelect";
                    for (let i = 0; i < controlInfo.items.length; i++) {
                        items.push({
                            'value': controlInfo.items[i],
                            'text': controlInfo.items[i]
                        })
                    }
                    miniControl.set({
                        required: controlInfo.isRequired,
                        textField: 'text',
                        valueField: 'value',
                        data: items
                    });
                    break;
            }

            return {
                miniInfo: miniInfo,
                mini: miniControl
            }
        }

        /**
         * 将miniui控件填充到行中
         * @param {*} data
         * @param {*} row
         * @returns
         */
        function fillRow(data, row) {
            var mini = data.mini,
                name = data.name,
                size = data.size;
            var label = document.createElement('label');
            console.log();
            label.className = 'form-label' + (mini.required ? ' required' : '');
            label.innerText = name + '：';
            row.append(label);
            var div = document.createElement('div');
            if (size == 2) {
                div.className = 'form-control span5';
            } else {
                div.className = 'form-control span2';
            }
            row.append(div);
            mini.render(div);

            return row;
        }
    }

    function getCookie(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    }

})();