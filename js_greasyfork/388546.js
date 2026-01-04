// ==UserScript==
// @name         dev tool
// @namespace    http://tampermonkey.net/
// @version      0.1.9
// @description  solar dev tool.
// @author       qyj
// @match        http://localhost:8080/*
// @match        http://10.8.3.94:8080/*
// @match        http://erp.tw-solar.com/*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @grant unsafeWindow
// @grant window.close
// @grant window.focus
// @require      https://cdn.jsdelivr.net/npm/vue
// @resource icon1 http://www.tampermonkey.net/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/388546/dev%20tool.user.js
// @updateURL https://update.greasyfork.org/scripts/388546/dev%20tool.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let userName = 'qyj';

    let funcIdObj = {// 功能的id
        codeBuildRule: '1326',// 单据编号规则
        sysFunction: '453',// 功能管理
        gridDesign: 'D027AA81BB5B4144931C4CAFA58FD082',// 查询类表单
        formDesign: '352044F5764B46AD94FD9A2B4FD7CF52',// 编辑类表单
        role: '454',// 角色管理
        procDefinition: '513179',// 流程管理
        dictionary: '1366',// 流程管理
    };
    // ---------------------------------入口------------------------------------------
    let pathname = window.location.pathname;
    if (pathname.startsWith(web_app.name + '/index.do')
        || pathname === web_app.name + '/'
        || pathname === web_app.name) {
        $('body').append(`
<style type="text/css">
  .dropdown-submenu {
   position: relative;
  }
  .dropdown-submenu > .dropdown-menu {
   top: 0;
   left: 100%;
   margin-top: -6px;
   margin-left: -1px;
   -webkit-border-radius: 0 6px 6px 6px;
   -moz-border-radius: 0 6px 6px;
   border-radius: 0 6px 6px 6px;
  }
  .dropdown-submenu:hover > .dropdown-menu {
   display: block;
  }
  .dropdown-submenu > a:after {
   display: block;
   content: " ";
   float: right;
   width: 0;
   height: 0;
   border-color: transparent;
   border-style: solid;
   border-width: 5px 0 5px 5px;
   border-left-color: #ccc;
   margin-top: 5px;
   margin-right: -10px;
  }
  .dropdown-submenu:hover > a:after {
   border-left-color: #fff;
  }
  .dropdown-submenu.pull-left {
   float: none;
  }
  .dropdown-submenu.pull-left > .dropdown-menu {
   left: -100%;
   margin-left: 10px;
   -webkit-border-radius: 6px 0 6px 6px;
   -moz-border-radius: 6px 0 6px 6px;
   border-radius: 6px 0 6px 6px;
  }
</style>
`);
        $('#page-wrapper > div.row.border-bottom > div > div.navbar-header').remove();
        var div = $(`
<nav id="myapp3" class="navbar navbar-inverse">
    <div class="container-fluid">
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul class="nav navbar-nav">
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true"
                       aria-expanded="false">
                        常用<span class="caret"></span>
                    </a>
                    <ul class="dropdown-menu" style="color: black">
                        <li><a href="#" v-on:click="openCodeBuildRule">单据编号规则</a></li>
                        <li><a href="#" v-on:click="openSysFunction">功能管理</a></li>
                        <li><a href="#" v-on:click="openRole">角色管理</a></li>
                        <li><a href="#" v-on:click="openProcDefinition">流程管理</a></li>
                        <li><a href="#" v-on:click="openFormDesign">编辑类表单</a></li>
                        <li><a href="#" v-on:click="openGridDesign">查询类表单</a></li>
                        <li><a href="#" v-on:click="openDictionary">系统字典</a></li>
                        <li><a href="#" v-on:click="doSync">同步表单</a></li>
                    </ul>
                </li>
            </ul>
            <ul class="nav navbar-nav">
                <li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button"
                                        aria-haspopup="true"
                                        aria-expanded="false">我开发的<span class="caret"></span></a>
                    <ul class="dropdown-menu" style="color: black">
                        <li class="dropdown-submenu" v-for="(item, i) in toolbarObj"><a href="#">{{item.name}}</a>
                            <ul class="dropdown-menu">
                                <li v-if="!!item.add"><a href="#" v-on:click="openAddFunc(i)" v-on:contextmenu.prevent="openEditFormDesign(i)">新增</a></li>
                                <li v-if="!!item.query"><a href="#" v-on:click="openQueryFunc(i)" v-on:contextmenu.prevent="openQueryFormDesign(i)">查询</a></li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>
            <span class="navbar-form navbar-left">
                <div class="form-group">
                    <input v-model="search_code" type="text" class="form-control" placeholder="code">
                    <input v-model="search_tablename" type="text" class="form-control" placeholder="表名">
                    <input v-model="search_name" type="text" class="form-control" placeholder="表单名称">
                </div>
                <button class="btn btn-default" v-on:click="searchQueryFormDesign">搜查询表单</button>
                <button class="btn btn-primary" v-on:click="searchEditFormDesign">搜编辑表单</button>
            </span>
        </div>
    </div>
</nav>
`);

        $('#page-wrapper > div.row.border-bottom > div').append(div);
        let app = new Vue({
            el: '#myapp3',
            mounted: function () {
                this.toolbarObj = this.toolbarSource[userName];
            },
            data: {
                search_code: '',
                search_tablename: '',
                search_name: '',
                toolbarSource: {
                    'qyj': [// qyj
                        {
                            name: '外协加工退料申请',
                            add: {
                                code: 'outsourceProcessReturnApply',
                                name: '外协加工退料申请'
                            },
                            query: {
                                code: 'outsourceProcessReturnApplyQuery',
                                name: '外协加工退料申请查询'
                            }
                        },
                        {
                            name: '外协加工发料',
                            add: {
                                code: 'outsourceProcessOutPrevQuery',
                                name: '外协加工发料',
                                type: 'grid'
                            },
                            query: {
                                code: 'outsourceProcessOutQuery',
                                name: '外协加工出库查询'
                            }
                        },
                        {
                            name: '外协加工退料入库',
                            add: {
                                code: 'outProcessReturnPrevQuery',
                                name: '外协加工退料入库',
                                type: 'grid'
                            },
                            query: {
                                code: 'outProcessReturnQuery',
                                name: '外协加工退料入库查询'
                            }
                        },
                        {
                            name: '紧急放行',
                            add: {
                                code: 'materielEmergencyRelease',
                                name: '紧急放行申请',
                            },
                            query: {
                                code: 'materielEmergencyReleaseQuery',
                                name: '紧急放行申请查询'
                            }
                        },
                        {
                            name: '原料在库检验',
                            add: {
                                code: 'materielInStorageInspection',
                                name: '原料在库检验申请',
                            },
                            query: {
                                code: 'materielInStorageInspectionQuery',
                                name: '原料在库检验查询'
                            }
                        },
                        {
                            name: '原材料索赔申请',
                            query: {
                                code: 'qaMateClaimApplyQuery',
                                name: '原材料索赔申请查询'
                            }
                        },
                        {
                            name: '快递登记',
                            add: {
                                code: 'expressApply',
                                name: '快递登记申请',
                            },
                            query: {
                                code: 'expressApplyQuery',
                                name: '快递登记查询'
                            }
                        },
                        {
                            name: '物流托运',
                            add: {
                                code: 'waybill',
                                name: '物流托运申请',
                            },
                            query: {
                                code: 'wayBillQuery',
                                name: '物流托运查询'
                            }
                        },
                        {
                            name: '产品送样(电池)',
                            add: {
                                code: 'cellSampleDeliveryApply',
                                name: '电池产品送样申请',
                            },
                            query: {
                                code: 'cellSampleDeliveryQuery',
                                name: '电池产品送样查询'
                            }
                        },
                        {
                            name: '客户投诉与索赔(电池)',
                            add: {
                                code: 'cellCustomerClaim',
                                name: '客户投诉与索赔申请',
                            },
                            query: {
                                code: 'cellCustomerClaimQuery',
                                name: '客户投诉与索赔查询'
                            }
                        },
                        {
                            name: '客户投诉销售退换货(电池)',
                            add: {
                                code: 'cellSaleReturnExchangeApply',
                                name: '客户投诉销售退换货申请',
                            },
                            query: {
                                code: 'cellSaleReturnExchangeApplyQuery',
                                name: '客户销售退换货查询'
                            }
                        },
                        {
                            name: '电池产品入库查询',
                            query: {
                                code: 'productInQueryQuery',
                                name: '电池产品入库查询'
                            }
                        },
                        {
                            name: '电池采购入库查询',
                            query: {
                                code: 'cellPurchaseIn',
                                name: '电池采购入库查询'
                            }
                        },
                        {
                            name: '组件销售出库查询',
                            add: {
                                code: 'moduleSaleOutQuery',
                                name: '组件销售出库查询',
                                type: 'grid'
                            },
                            query: {
                                code: 'moduleSaleOutDtlQuery',
                                name: '组件销售出库明细查询'
                            }
                        },
                        {
                            name: '电池销售发货通知单创建托送运单',
                            add: {
                                code: 'cellDeliveryNoticeGenTran',
                                name: '电池销售发货通知单创建托送运单',
                                type: 'grid'
                            },
                        },
                        {
                            name: '组件销售发货通知单创建托送运单',
                            add: {
                                code: 'moduleDeliveryNoticeGenTran',
                                name: '组件销售发货通知单创建托送运单',
                                type: 'grid'
                            },
                        },
                        {
                            name: '原料销售出库生成物流托运单',
                            add: {
                                code: 'mateSalOutGenTran',
                                name: '原料销售出库生成物流托运单',
                                type: 'grid'
                            },
                        },
                        {
                            name: '物流清单查询',
                            query: {
                                code: 'freightList',
                                name: '物流清单查询'
                            }
                        },
                        {
                            name: '国内物流费用查询',
                            query: {
                                code: 'domesticWaybillExpenses',
                                name: '国内物流费用查询'
                            }
                        },
                        {
                            name: '产品销售运费统计查询',
                            query: {
                                code: 'productSalFreightList',
                                name: '产品销售运费统计查询'
                            }
                        },
                    ],
                    'xxx': [
                        {
                            name: '劳保领用申请',
                            add: {
                                code: 'labourUse',
                                name: '劳保领用申请'
                            },
                            query: {
                                code: 'labourApplyQuery',
                                name: '劳保领用查询'
                            }
                        },
                        {
                            name: '劳保提前领用申请',
                            add: {
                                code: 'consumeAdvanceApply',
                                name: '劳保提前领用申请',
                            },
                            query: {
                                code: 'consumeAdvanceQuery',
                                name: '劳保提前领用查询'
                            }
                        },

                        {
                            name: '劳保换料',
                            add: {
                                code: 'laborExchangeApply',
                                name: '劳保换料申请',
                            },
                            query: {
                                code: 'laborExchangeApplyQuery',
                                name: '劳保换料查询'
                            }
                        },
                        {
                            name: '劳保退料',
                            add: {
                                code: 'returnApply',
                                name: '劳保退料申请',
                            },
                            query: {
                                code: 'returnApplyQuery',
                                name: '劳保退料申请查询'
                            }
                        },

                        {
                            name: '劳保出库',
                            add: {
                                code: 'laborOutPreQuery',
                                name: '劳保出库',
                                type : 'grid'
                            },
                            query: {
                                code: 'labourOutQuery',
                                name: '劳保出库查询'
                            }
                        },

                        {
                            name: '劳保正装发放登记',
                            add: {
                                code: 'laborFormal',
                                name: '劳保正装发放登记',
                            },
                            query: {
                                code: 'laborFormalQuery',
                                name: '劳保正装发放登记查询'
                            }
                        },

                        {
                            name: '劳保台账',
                            query: {
                                code: 'labourLedger',
                                name: '劳保台账'
                            }
                        },
                        {
                            name: '劳保基础信息设置',
                            query: {
                                code: 'labourBasic',
                                name: '劳保基础信息设置'
                            }
                        },
                        {
                            name: '劳保扣款单',
                            query: {
                                code: 'laborDeduction',
                                name: '劳保扣款单'
                            }
                        }


                    ]
                },
                toolbarObj: []
            },
            methods: {
                openQueryFormDesign: function (i,confobj) {
                    let obj;
                    if (!confobj) {
                        obj = this.toolbarObj[i].query;
                    } else {
                        obj = confobj;
                    }
                    Public.ajax(web_app.name + '/gridDesign/slicedQueryBillquery.ajax', {
                        code: obj.code,
                        name: '',
                        tableName: '',
                        canEdit: '',
                        canEdit_text: '',
                        showALL: 0,
                        page: 1,
                        pagesize: 20,
                        sortname: 'sequence',
                        sortorder: 'asc',
                        sortfields: []
                    }, function (data) {
                        let id = data.Rows[0].id;

                        var url = DataUtil.composeURLByParam(web_app.name + '/gridDesign/forwardBillqueryFields.do', {id: id});
                        UICtrl.addTabItem({
                            tabid: 'formDesign' + id,
                            text: obj.name + '字段设置',
                            url: url
                        });
                    });
                },
                openEditFormDesign: function (i) {
                    let obj = this.toolbarObj[i].add;
                    if (obj.type === 'grid') {
                        this.openQueryFormDesign(i, obj);
                        return;
                    }
                    Public.ajax(web_app.name + '/formDesign/slicedQueryBilldsi.ajax', {
                        code: obj.code,
                        showALL: 0,
                        page: 1,
                        pagesize: 20,
                        sortname: 'sequence',
                        sortorder: 'asc',
                        sortfields: [],
                        name: '',
                        tableName: ''
                    }, function (data) {
                        let id = data.Rows[0].id;
                        var url = DataUtil.composeURLByParam(web_app.name + '/formDesign/forwardBilldsiFields.do', {id: id});

                        UICtrl.addTabItem({
                            tabid: 'formDesign' + id,
                            text: obj.name + '字段设置',
                            url: url
                        });
                    });
                },
                doSync: function () {
                    // /gridDesign/slicedQueryBillquery.ajax
                    // /gridDesign/doSync.ajax
                    $.dialog({
                        title: '请输入',
                        width: '800px',
                        height: '400px',
                        content: '编辑表单：<input id="__editDesign" style="width: 720px;"/><br/>查询表单：<input id="__queryDesign" style="width: 720px;"/>',
                        ok: function () {
                            var input = $('#__editDesign').val();
                            input = input.trim();
                            if ('' !== input) {
                                var arr = input.split(',');
                                $.each(arr, function (i, v) {
                                    Public.ajax(web_app.name + '/formDesign/slicedQueryBilldsi.ajax', {
                                        code: v,
                                        showALL: 0,
                                        page: 1,
                                        pagesize: 20,
                                        sortname: 'sequence',
                                        sortorder: 'asc',
                                        sortfields: [],
                                        name: '',
                                        tableName: ''
                                    }, function (data) {
                                        let id = data.Rows[0].id;
                                        Public.ajax(web_app.name + '/formDesign/doSync.ajax', {id}, function () {
                                            console.log('编辑表单同步成功: ' + id);
                                        });
                                    });
                                });
                            }



                            input = $('#__queryDesign').val();
                            input = input.trim();
                            if ('' !== input) {
                                var arr = input.split(',');
                                $.each(arr, function (i, v) {
                                    Public.ajax(web_app.name + '/gridDesign/slicedQueryBillquery.ajax', {
                                        code: v,
                                        name: '',
                                        tableName: '',
                                        canEdit: '',
                                        canEdit_text: '',
                                        showALL: 0,
                                        page: 1,
                                        pagesize: 20,
                                        sortname: 'sequence',
                                        sortorder: 'asc',
                                        sortfields: []
                                    }, function (data) {
                                        let id = data.Rows[0].id;
                                        Public.ajax(web_app.name + '/gridDesign/doSync.ajax', {id}, function () {
                                            console.log('查询表单同步成功: ' + id);
                                        });
                                    });
                                });
                            }

                            this.time(0.1);
                            return false;
                        },
                        cancelVal: '关闭',
                        cancel: true
                    });
                },
                searchEditFormDesign: function () {
                    let param = {
                        id: funcIdObj.gridDesign
                    };
                    if (this.search_code) param.code = this.search_code;
                    if (this.search_name) param.name = this.search_name;
                    if (this.search_tablename) param.tableName = this.search_tablename;
                    if (param.code || param.name || param.tableName) {
                        closeTabItem('formDesign');
                        let url = DataUtil.composeURLByParam(web_app.name + '/formDesign/forwardListBilldsi.do', param);
                        UICtrl.addTabItem({
                            tabid: 'formDesign',
                            text: '编辑类表单',
                            url
                        });

                        this.search_tablename = '';
                        this.search_name = '';
                        this.search_code = '';
                    }
                },
                searchQueryFormDesign: function () {
                    let param = {
                        id: funcIdObj.gridDesign
                    };
                    if (this.search_code) param.code = this.search_code;
                    if (this.search_name) param.name = this.search_name;
                    if (this.search_tablename) param.tableName = this.search_tablename;
                    if (param.code || param.name || param.tableName) {
                        closeTabItem('GridDesign');
                        let url = DataUtil.composeURLByParam(web_app.name + '/gridDesign/forwardListBillquery.do', param);
                        UICtrl.addTabItem({
                            tabid: 'GridDesign',
                            text: '查询类表单',
                            url
                        });
                        this.search_tablename = '';
                        this.search_name = '';
                        this.search_code = '';
                    }
                },
                openAddFunc: function (i) {
                    let obj = this.toolbarObj[i].add;
                    let option = $.extend({type: 'job'}, obj);
                    let url;
                    if (option.type === 'job') {
                        url = DataUtil.composeURLByParam(web_app.name + '/formUsage/job/' + obj.code + '/add.job');
                    } else if (option.type === 'form') {
                        url = DataUtil.composeURLByParam(web_app.name + '/formUsage/form/' + obj.code + '/add.do');
                    } else if (option.type === 'grid') {
                        url = DataUtil.composeURLByParam(web_app.name + '/formUsage/' + obj.code + '/grid.do');
                    } else {
                        return;
                    }
                    UICtrl.addTabItem({
                        tabid: obj.code,
                        text: obj.name,
                        url
                    });
                },
                openQueryFunc: function (i) {
                    let obj = this.toolbarObj[i].query;
                    let url = DataUtil.composeURLByParam(web_app.name + '/formUsage/' + obj.code + '/grid.do');
                    UICtrl.addTabItem({
                        tabid: obj.code,
                        text: obj.name,
                        url: url
                    });
                },
                openCodeBuildRule: function () {
                    var url = DataUtil.composeURLByParam(web_app.name + '/codeBuildRule/forward.do', {id: funcIdObj.codeBuildRule});
                    UICtrl.addTabItem({
                        tabid: 'CodeBuildRule',
                        text: '单据编号规则',
                        url
                    });
                },
                openSysFunction: function () {
                    var url = DataUtil.composeURLByParam(web_app.name + '/sysFunction/forwardFunction.do', {id: funcIdObj.sysFunction});
                    UICtrl.addTabItem({
                        tabid: 'Func',
                        text: '功能管理',
                        url
                    });
                },
                openRole: function () {
                    var url = DataUtil.composeURLByParam(web_app.name + '/access/forwardRole.do', {id: funcIdObj.role});
                    UICtrl.addTabItem({
                        tabid: 'Role',
                        text: '角色管理',
                        url
                    });
                },
                openProcDefinition: function () {
                    var url = DataUtil.composeURLByParam(web_app.name + '/procDefinition/forwardList.do', {id: funcIdObj.procDefinition});
                    UICtrl.addTabItem({
                        tabid: 'ProcDefinition',
                        text: '流程管理',
                        url
                    });
                },
                openFormDesign: function () {
                    var url = DataUtil.composeURLByParam(web_app.name + '/formDesign/forwardListBilldsi.do', {id: funcIdObj.formDesign});
                    UICtrl.addTabItem({
                        tabid: 'formDesign',
                        text: '编辑类表单',
                        url
                    });
                },
                openGridDesign: function () {
                    var url = DataUtil.composeURLByParam(web_app.name + '/gridDesign/forwardListBillquery.do', {id: funcIdObj.gridDesign});
                    UICtrl.addTabItem({
                        tabid: 'GridDesign',
                        text: '查询类表单',
                        url
                    });
                },
                openDictionary: function () {
                    var url = DataUtil.composeURLByParam(web_app.name + '/dictionary/forward.do', {id: funcIdObj.dictionary});
                    UICtrl.addTabItem({
                        tabid: 'SysDictionary',
                        text: '系统字典',
                        url
                    });
                }
            }
        });
    } else {
        enterPage();
    }

    if (pathname === web_app.name + '/gridDesign/forwardBillqueryFields.do') {
        console.log('进入查询类表单页面。');
        enterQueryFormDesignPage();
    } else if (pathname === web_app.name + '/gridDesign/forwardListBillquery.do') {
        console.log('进入查询类表单列表页面。');
        enterQueryFormDesignListPage();
    } else if (/^\/formUsage\/job\/(\w+)\/add.job$/.test(pathname.replace(web_app.name, ''))) {
        console.log('进入编辑表单流程新增页面。');
        enterAddFormProcPage();
    } else if (pathname === web_app.name + '/formDesign/forwardListBilldsi.do') {
        console.log('进入编辑类表单列表页面。');
        enterEditFormDesignListPage();
    } else if (pathname === web_app.name + '/formDesign/forwardBilldsiFields.do') {
        console.log('进入编辑类表单页面。');
        enterEditFormDesignPage();
    } else if (/^\/formUsage\/(\w+)\/grid.do/.test(pathname.replace(web_app.name, ''))) {
        console.log('进入查询页面。');
        enterQueryPage();
    } else if (/^\/formUsage\/job\/(\w+)\/view.job/.test(pathname.replace(web_app.name, ''))) {
        console.log('进入流程查看页面。');
        enterAddFormProcPage();
    } else if (/^\/formUsage\/form\/(\w+)\/view.do/.test(pathname.replace(web_app.name, ''))) {
        console.log('进入非流程查看页面。');
        enterAddFormProcPage(true);
    } else if (/^\/formUsage\/form\/(\w+)\/add.do/.test(pathname.replace(web_app.name, ''))) {
        console.log('进入非流程新增页面。');
        enterAddFormProcPage(true);
    }


    // ---------------------------------入口------------------------------------------

    // 复制的方法
    function copyText(text) { // text: 要复制的内容， callback: 回调
        return new Promise(resolve => {
            var tag = document.createElement('input');
            tag.setAttribute('id', 'cp_hgz_input');
            tag.value = text;
            document.getElementsByTagName('body')[0].appendChild(tag);
            document.getElementById('cp_hgz_input').select();
            document.execCommand('copy');
            document.getElementById('cp_hgz_input').remove();
            resolve();
        });
    }

    function toHump(name) {
        name = name.toLowerCase();
        return name.replace(/\_(\w)/g, function (all, letter) {
            return letter.toUpperCase();
        });
    }

    function ajaxSaveConditionField(option) {
        return new Promise(resolve => {
            var defaultOption = {
                id: '',
                conditionKind: 'query',
                fieldType: 'string',
                fieldType_text: '',
                fieldName: '',
                paramName: '',
                displayName: '',
                labelSpan: '1',
                colSpan: '2',
                isRequired: '0',
                isRequired_text: '否',
                fieldMaskChoose: '',
                fieldMaskChoose_text: '',
                fieldMask: '',
                visible: '1',
                visible_text: '是',
                readOnly: '0',
                readOnly_text: '否',
                canMobile: '1',
                canMobile_text: '是',
                formDefaultExpr: '',
                formDefaultExpr_text: '',
                defaultExpr: '',
                parentParamName: '',
                tableAlias: 't',
                columnSymbol: '',
                columnSymbol_text: '',
                append: '1',
                append_text: '是',
                controlType: 'input',
                controlType_text: '文本',
                dataSourceKind: '',
                dataSourceKind_text: '',
                newLine: '0',
                newLine_text: '否',
                dataSource: ''
            };
            option = $.extend({}, defaultOption, option);
            Public.ajax(web_app.name + '/gridDesign/saveBillqueryCondition.ajax', option, function (data) {
                resolve(data);
            });
        });
    }

    function ajaxSaveQueryField(option) {
        return new Promise(resolve => {
            var defaultOption = {
                id: '',
                fieldType: '',
                fieldType_text: '',
                fieldName: '',
                paramName: '',
                displayName: '',
                visible: '1',
                visible_text: '是',
                colWidth: '120',
                fieldAlign: '',
                fieldAlign_text: '',
                canMobile: '1',
                canSum: '0',
                canOrder: '1',
                canFrozen: '0',
                canExport: '1',
                canResize: '1',
                isEditable: '0',
                isEditable_text: '否',
                fieldMaskChoose: '',
                fieldMaskChoose_text: '',
                fieldMask: '',
                auditVisible: '1',// 审核显示
                auditVisible_text: '是',
                //无效 begin
                fieldLength: '683',
                isRequired: '0',
                isRequired_text: '否',
                processBizParam: '0',
                processBizParam_text: '否',
                canInsert: '1',
                canInsert_text: '是',
                canUpdate: '1',
                canUpdate_text: '是',
                //无效 end
                auditEditable: '0',// 审核可修改
                auditEditable_text: '否',
                auditRequired: '0',// 审核必输入
                auditRequired_text: '否',
                auditEditableCode: '',// 环节code
                controlType: '',
                controlType_text: '',
                dataSourceKind: '',
                dataSourceKind_text: '',
                dataSource: ''
            };
            option = $.extend({}, defaultOption, option);
            Public.ajax(web_app.name + '/gridDesign/saveBillqueryField.ajax', option, function (data) {
                resolve(data);
            });
        });

    }

    function ajaxSaveEditFormField(option) {
        return new Promise(resolve => {
            var defaultOption = {
                id: '',
                displayKind: 'field',
                groupId: '',
                fieldType: 'string',
                fieldType_text: '文本',
                fieldName: '',
                paramName: '',
                displayName: '',
                labelSpan: '1',
                colSpan: '2',
                fieldLength: '43',
                isRequired: '0',
                isRequired_text: '否',
                visible: '1',
                visible_text: '是',
                fieldMaskChoose: '',
                fieldMaskChoose_text: '',
                fieldMask: '',
                fieldMatch: '',
                fieldMatch_text: '',
                readOnly: '0',
                readOnly_text: '否',
                formDefaultExpr: '',
                formDefaultExpr_text: '',
                defaultExpr: '',
                canInsert: '1',
                canInsert_text: '是',
                canUpdate: '1',
                canUpdate_text: '是',
                canMobile: '1',
                canMobile_text: '是',
                auditEditable: '0',
                auditEditable_text: '否',
                auditRequired: '0',
                auditRequired_text: '否',
                auditEditableCode: '',
                processBizParam: '0',
                processBizParam_text: '否',
                rowSpan: '3',
                parentParamName: '',
                controlType: 'input',
                controlType_text: '文本',
                dataSourceKind: '',
                dataSourceKind_text: '',
                newLine: '0',
                newLine_text: '否',
                dataSource: '',
                billdsiId: '',
            };
            option = $.extend({}, defaultOption, option);
            Public.ajax(web_app.name + '/formDesign/saveBilldsiField.ajax', option, function (data) {
                resolve(data);
            });
        });
    }

    // enterPage
    function enterPage() {
        $('body').prepend('<div id="__div" style="position: fixed; left: 110px; z-index: 20"></div>');
        var div = $(`
<span id="myapp1" style="z-index:10;margin-right: 10px">
    <button v-on:click="reload">重新加载</button>
</span>
`);
        $('#__div').append(div);
        var app = new Vue({
            el: '#myapp1',
            mounted: function () {

            },
            data: {},
            methods: {
                reload: function () {
                    window.location.reload();
                },
            }
        });

        $('body').on('click', 'input.ui-disabled[readonly]', function (event) {
            let $input = $(event.target);
            let result = prompt('输入修改值', $input.val());
            if (result) $input.val(result);
        });
    }

    // 进入查询页面
    function enterQueryPage() {
        var div = $(`
<span id="myapp" style="z-index:10;">
    <button v-on:click="openQueryDesignPage">打开查询表单页面</button>
</span>
`);
        $('#__div').append(div);
        var app = new Vue({
            el: '#myapp',
            mounted: function () {
                this.id = $('.grid-design').attr('data-id');
                this.code = $('.grid-design').attr('data-code');
            },
            data: {},
            methods: {
                openQueryDesignPage: function () {
                    var id = this.id;
                    var code = this.code;
                    var url = DataUtil.composeURLByParam(web_app.name + '/gridDesign/forwardBillqueryFields.do', {id: id});
                    UICtrl.addTabItem({
                        tabid: 'formDesign' + id,
                        text: code + '字段设置',
                        url: url
                    });
                }
            }
        });
    }

    // 进入编辑表单流程新增页面
    function enterAddFormProcPage(flag) {
        $('#jobPageLayout > div.ui-layout-center.col-xs-12.col-sm-12').css({position: 'unset'})
        var div = $('<div></div>');
        var bigTitle = $('#billTitle>:first-child').text();
        var btn1 = $('<button>打开表单设计</button>');
        btn1.on('click', function () {
            var selector = flag ? '#formDesignSubmitForm>:first-child' : '#submitForm>:first-child';
            var formCode = $(selector).attr('data-code');
            var id = $(selector).attr('data-id');
            var url = DataUtil.composeURLByParam(web_app.name + '/formDesign/forwardBilldsiFields.do', {id: id});

            UICtrl.addTabItem({
                tabid: 'formDesign' + id,
                text: bigTitle + '字段设置',
                url: url
            });
        });

        div.append(btn1);
        if (flag) {
            $('body').prepend(div);
        } else {
            $('#jobBizBillBody').prepend(div);
        }
        // 查看页面是否有明细
        var dtlEle = $('div[class*=form-detail-grid]');
        if (dtlEle.length > 0) {

            $.each($('div[class*=form-detail-grid]'), function (i, v) {
                var id = $(v).attr('data-id');
                $(v).prepend($('<button>打开明细表单设计</button>').on('click', function () {
                    var url = DataUtil.composeURLByParam(web_app.name + '/gridDesign/forwardBillqueryFields.do', {id: id});

                    UICtrl.addTabItem({
                        tabid: 'formDesign' + id,
                        text: bigTitle + '明细字段设置',
                        url: url
                    });

                }));
            });

        }
    }

    // 进入编辑类表单列表页面
    function enterEditFormDesignListPage() {
        let tableName = Public.getQueryStringByName("tableName");
        let name = Public.getQueryStringByName("name");
        let code = Public.getQueryStringByName("code");
        if (tableName || code || name) {
            setTimeout(function () {
                UICtrl.gridSearch(gridManager, {
                    code,
                    name,
                    tableName,
                    showALL: 0,
                    page: 1,
                    pagesize: 20,
                    sortname: 'sequence',
                    sortorder: 'asc',
                    sortfields: []
                });
            }, 800);
        }
    }

    // 进入查询类表单设计页面
    function enterQueryFormDesignPage() {
        $('#layout > div.ui-layout-center.col-xs-12.col-sm-7').css({position: 'unset'});
        var div = $(`
<span id="myapp" style="z-index:10;">
    <span v-if="mode === 'dev'">
        <button v-on:click="autoAddQueryFields">添加显示字段</button>
        <button v-on:click="doAutoAddCommonConditionFields">添加流程公共查询字段</button>
        <button v-on:click="doAddMainTableRelation">添加主表关联</button>
    </span>
    <button v-on:click="doShowBillJsPathList">资源文件</button>
    <button v-on:click="doShowAddFunction">生成功能</button>
    <button v-on:click="openQueryPage">打开查询页面</button>
    <button v-on:click="doSearchEditForm">搜索编辑表单</button>
    <button v-on:click="doOpenDef">打开定义</button>
    <div id="__copy" class="btn-group" v-on:mouseenter="$('#__copy').addClass('open')" >
      <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        复制信息 <span class="caret"></span>
      </button>
      <ul class="dropdown-menu">
        <li><a v-on:click="copyInfo('tableName')">表名</a></li>
        <li><a v-on:click="copyInfo('billqueryCode')">表单编码</a></li>
        <li><a v-on:click="copyInfo('billqueryName')">复制表单名称</a></li>
      </ul>
    </div>
</span>
`);

        $('#__div').append(div);
        var app = new Vue({
            el: '#myapp',
            mounted: function () {
                if ('10.8.3.94' === window.location.hostname) {
                    this.mode = 'test';// 测试环境
                } else if ('localhost' === window.location.hostname || '127.0.0.1' === window.location.hostname) {
                    this.mode = 'dev';// 开发环境
                }
                this.billqueryId = $('#mainBillqueryId').val();
                this.billqueryCode = $('#mainBillqueryCode').val();
                this.billqueryName = $('#mainBillqueryName').val();
                this.conditionManager = UICtrl.getGridManager('#conditiongrid');
                this.mainManager = UICtrl.getGridManager('#maingrid');
                $('body').append('<script src="' + web_app.name + '/system/form/resource/billJsPathList.js"></script>');
                $('body').append('<script src="' + web_app.name + '/system/form/resource/billBusinessEvent.js"></script>');
                $('body').append(`<script src="${web_app.name}/system/opm/permission/FunctionUtil.js"></script>`);
                var thisObj = this;
                $.ajax({
                    method: 'post',
                    data: 'id=' + thisObj.billqueryId,
                    url: web_app.name + '/gridDesign/showLoadBillquery.load',
                    dataType: 'html',
                    success: function (data) {
                        thisObj.tableName = $(data).find('#tableName').val();
                    }
                });
            },
            data: {
                mode: 'dev',
                billqueryId: '',
                billqueryCode: '',
                billqueryName: '',
                conditionManager: {},
                mainManager: {},
                commonConditionFieldArr: [
                    {
                        fieldType: 'string',
                        fieldType_text: '文本',
                        paramName: 'organName',
                        displayName: '归属组织',
                        visible: '1',
                        visible_text: '是',
                        columnSymbol: 'equal',
                        columnSymbol_text: '相等',
                        append: '0',
                        append_text: '否',
                        controlType: 'tree',
                        controlType_text: '快捷树',
                        dataSourceKind: 'json',
                        dataSourceKind_text: 'JSON',
                        dataSource: '{"type":"sys","name":"org","param":{"orgKindId":"ogn,dpt","orgRoot":"1005"},"back":{"fullId":"fullId","pathName":"organName","orgId":"organId"}}'
                    },
                    {
                        fieldType: 'string',
                        fieldType_text: '文本',
                        paramName: 'organId',
                        displayName: '组织id',
                        visible: '0',
                        visible_text: '否',
                        columnSymbol: 'equal',
                        columnSymbol_text: '相等',
                        append: '0',
                        append_text: '否',
                        controlType: 'input',
                        controlType_text: '文本'
                    },
                    {
                        fieldType: 'string',
                        fieldType_text: '文本',
                        fieldName: 'FULL_ID',
                        paramName: 'fullId',
                        displayName: 'FULL_ID',
                        visible: '0',
                        visible_text: '否',
                        columnSymbol: 'startwith',
                        columnSymbol_text: '以..开始',
                        append: '1',
                        append_text: '是',
                        controlType: 'input',
                        controlType_text: '文本'
                    },
                    {
                        fieldType: 'string',
                        fieldType_text: '文本',
                        fieldName: 'BILL_CODE',
                        paramName: 'billCode',
                        displayName: '单据编号',
                        visible: '1',
                        visible_text: '是',
                        columnSymbol: 'like',
                        columnSymbol_text: '相似',
                        append: '1',
                        append_text: '是',
                        controlType: 'input',
                        controlType_text: '文本'
                    },
                    {
                        fieldType: 'date',
                        fieldType_text: '日期',
                        fieldName: 'FILLIN_DATE',
                        paramName: 'fillinDateBegin',
                        displayName: '单据日期（起)',
                        visible: '1',
                        visible_text: '是',
                        columnSymbol: 'greaterorequal',
                        columnSymbol_text: '大于或等于',
                        append: '1',
                        append_text: '是',
                        controlType: 'date',
                        controlType_text: '日期'
                    },
                    {
                        fieldType: 'date',
                        fieldType_text: '日期',
                        fieldName: 'FILLIN_DATE',
                        paramName: 'fillinDateEnd',
                        displayName: '单据日期(止)',
                        visible: '1',
                        visible_text: '是',
                        columnSymbol: 'lessorequal',
                        columnSymbol_text: '小于或等于',
                        append: '1',
                        append_text: '是',
                        controlType: 'date',
                        controlType_text: '日期'
                    },
                    {
                        fieldType: 'string',
                        fieldType_text: '文本',
                        fieldName: 'PERSON_MEMBER_NAME',
                        paramName: 'personMemberName',
                        displayName: '制单人',
                        visible: '1',
                        visible_text: '是',
                        columnSymbol: 'like',
                        columnSymbol_text: '相似',
                        append: '1',
                        append_text: '是',
                        controlType: 'input',
                        controlType_text: '文本'
                    }
                ],
            },
            methods: {
                doOpenDef: function () {
                    let id = this.billqueryId;
                    UICtrl.showAjaxDialog({
                        url: web_app.name + '/gridDesign/showLoadBillquery.load',
                        title: '编辑',
                        init: function (div) {
                            $('#datamanagebusinessName', div).treebox({
                                name: 'dataManageBusinessTreeView',
                                searchName: 'dataManageBusiness',
                                searchType: 'sys',
                                hasSearch: true,
                                minWidth: 250,
                                onChange: function (node, data) {
                                    $('#datamanagebusinessName').val(data.fullName);
                                    $('#datamanagebusinessId').val(data.id);
                                }
                            });
                            //主键字段选择
                            $.formDesign.initTableColumnChoose({
                                table: $('#tableName', div),
                                column: $('#columnName', div),
                                isPk: true
                            });
                            $.formDesign.initTableColumnChoose({
                                table: $('#tableName', div),
                                column: $('#statusFieldName', div),
                                dataType: 'NUMBER,VARCHAR2'
                            });
                            $.formDesign.initTableColumnChoose({
                                table: $('#tableName', div),
                                column: $('#sequenceFiledName', div),
                                dataType: 'NUMBER'
                            });
                        },
                        param: {id: id},
                        width: 800,
                        ok: function () {
                            var _self = this, param = {};
                            var url = '/gridDesign/saveBillquery.ajax';
                            $('#submitForm').ajaxSubmit({
                                url: web_app.name + url,
                                param: param,
                                success: function () {
                                    _self.close();
                                    reloadGrid();
                                }
                            });
                        }
                    });
                },
                copyInfo: function (field) {
                    copyText(this[field]).then(() => {
                        console.log('复制:' + this[field] + '');
                    });
                },
                doShowAddFunction: function () {
                    let code = this.billqueryCode;
                    let id = this.billqueryId;
                    let name = this.billqueryName;
                    FunctionUtil.showChooseDialog({
                        initDialog: function (div) {
                            $('#code', div).val(code);
                            UICtrl.disable($('#code', div));
                            $('#name', div).val('查询');
                            $('#description', div).val(name);
                            $('#nodeKindId', div).combox('setValue', 'fun');
                            UICtrl.disable($('#nodeKindId', div));
                            $('#url', div).val('formUsage/' + code + '/grid.job');
                        }
                    });
                },
                doShowBillJsPathList: function () {
                    showBillJsPathList(this.billqueryId);
                },
                doShowLoadBillBusinessEvents: function () {
                    showLoadBillBusinessEvents(this.billqueryId);
                },
                openEditDesignPage: function () {// 打开编辑表单页面
                    var editDesign = this.list[this.editDesignIndex]
                    var url = DataUtil.composeURLByParam(web_app.name + '/formDesign/forwardBilldsiFields.do', {id: editDesign.ID});
                    UICtrl.addTabItem({
                        tabid: 'formDesign' + editDesign.ID,
                        text: editDesign.NAME + '字段设置',
                        url: url
                    });
                },
                doSeq: function (arr) {
                    if (arr.length > 0) {
                        let v = arr.shift();
                        let billqueryId = this.billqueryId;
                        let lineArr = v.split('\t');
                        let fieldName, fieldType, fieldNote;
                        if (lineArr.length === 7) {
                            fieldName = lineArr[0].toUpperCase();
                            fieldType = lineArr[2].toUpperCase();
                            fieldNote = lineArr[6].toUpperCase();
                        } else if (lineArr.length === 5) {
                            fieldName = lineArr[0].toUpperCase();
                            fieldType = lineArr[1].toUpperCase();
                            fieldNote = lineArr[4].toUpperCase();
                        } else {
                            this.doSeq(arr);
                            return;
                        }
                        var option;
                        if (fieldType.startsWith('VARCHAR2')) {// 文本
                            option = {
                                fieldType: 'string',
                                fieldType_text: '文本',
                                fieldName: fieldName,
                                paramName: toHump(fieldName),
                                displayName: fieldNote ? fieldNote : '未命名' + i,
                                controlType: 'input',
                                controlType_text: '文本',

                            };
                        } else if (fieldType.startsWith('NUMBER') || fieldType === 'INTEGER') {
                            option = {
                                fieldType: 'number',
                                fieldType_text: '数值',
                                fieldName: fieldName,
                                paramName: toHump(fieldName),
                                displayName: fieldNote ? fieldNote : '未命名' + i,
                                fieldMaskChoose: 'nnnnnnnnn.nn',
                                fieldMaskChoose_text: '数字',
                                fieldMask: 'nnnnnnnnn.nnnn',
                                controlType: 'input',
                                controlType_text: '文本'
                            };
                        } else {
                            option = {
                                fieldType: 'date',
                                fieldType_text: '日期',
                                fieldName: fieldName,
                                paramName: toHump(fieldName),
                                displayName: fieldNote ? fieldNote : '未命名' + i,
                                controlType: 'date',
                                controlType_text: '日期'
                            };
                        }
                        if (option.fieldType === 'string') {
                            option.fieldAlign = 'left';
                            option.fieldAlign_text = '左对齐';
                        } else if (option.fieldType === 'number') {
                            option.fieldAlign = 'right';
                            option.fieldAlign_text = '右对齐';
                        } else {
                            option.fieldAlign = 'center';
                            option.fieldAlign_text = '居中对齐';
                        }
                        option.billqueryId = billqueryId;
                        ajaxSaveQueryField(option).then((data) => {
                            console.log(fieldName + ' - 操作成功');
                            this.doSeq(arr);
                        });
                    } else {
                        this.mainManager.loadData();
                    }
                },
                autoAddQueryFields: function () {
                    let thisObj = this;
                    $.dialog({
                        title: '请输入',
                        width: '800px',
                        height: '400px',
                        content: '<textarea id="__inputFields" style="width: 750px;height: 350px"></textarea>',
                        ok: function () {
                            var input = $('#__inputFields').val();
                            input = input.trim();
                            if ('' === input) return;
                            var arr = input.split('\n');
                            thisObj.doSeq(arr);
                            this.time(0.1);
                            return false;
                        },
                        cancelVal: '关闭',
                        cancel: true
                    });
                },
                doAutoAddCommonConditionFields: function () {
                    new Promise(resolve => {
                        var accNum = 0;
                        $.each(this.commonConditionFieldArr, (i, v) => {
                            v.billqueryId = this.billqueryId;
                            ajaxSaveConditionField(v).then((data) => {
                                accNum++;
                                if (accNum === this.commonConditionFieldArr.length) {
                                    resolve();
                                }
                            });
                        });
                    }).then(() => {
                        this.conditionManager.loadData();
                        var thisObj = this;
                        setTimeout(() => {
                            var allDetailData = DataUtil.getGridData({
                                gridManager: thisObj.conditionManager,
                                isAllData: true
                            });
                            var detailData = [];
                            $.each(allDetailData, (i, v) => {
                                var index = $.inArray(v.paramName, ['organId', 'fullId', 'organName', 'billCode', 'fillinDateBegin', 'fillinDateEnd', 'personMemberName']);
                                if ((typeof index === 'number') && index > -1) {
                                    v.sequence = index + 1;
                                    this.conditionManager.updateCell('sequence', index + 1, v);
                                    detailData.push(v);
                                }
                            });
                            Public.ajax(web_app.name + '/gridDesign/updateBillqueryConditions.ajax', {detailData: Public.encodeJSONURI(detailData)}, () => {
                                this.conditionManager.loadData();
                            });
                        }, 800);
                    });
                },
                openQueryPage: function () {
                    var thisObj = this;
                    var url = DataUtil.composeURLByParam(web_app.name + '/formUsage/' + thisObj.billqueryCode + '/grid.do');
                    UICtrl.addTabItem({
                        tabid: thisObj.billqueryCode,
                        text: thisObj.billqueryName,
                        url: url
                    });
                },
                doSearchEditForm: function () {
                    parent.closeTabItem('formDesign');
                    let tableName = this.tableName;
                    var url = DataUtil.composeURLByParam(web_app.name + '/formDesign/forwardListBilldsi.do', {
                        tableName,
                        id: funcIdObj.formDesign
                    });
                    UICtrl.addTabItem({
                        tabid: 'formDesign',
                        text: '编辑类表单',
                        url
                    });
                },
                doAddMainTableRelation: function () {
                    let billqueryId = this.billqueryId;
                    ajaxSaveConditionField({
                        id: '',
                        conditionKind: 'correlation',
                        labelSpan: 1,
                        colSpan: 2,
                        isRequired: 0,
                        visible: 0,
                        columnSymbol: 'equal',
                        fieldType: 'string',
                        fieldType_text: '文本',
                        fieldName: 'MAIN_ID',
                        tableAlias: 't',
                        paramName: 'mainId',
                        append: 1,
                        append_text: '是',
                        displayName: '主表关联',
                        billqueryId,
                    }).then(() => {
                        console.log('操作成功。');
                        this.conditionManager.loadData();
                    })
                }
            }
        });
    }

    // 进入查询类表单列表页面。
    function enterQueryFormDesignListPage() {
        let tableName = Public.getQueryStringByName("tableName");
        let name = Public.getQueryStringByName("name");
        let code = Public.getQueryStringByName("code");
        if (tableName || name || code) {
            setTimeout(function () {
                UICtrl.gridSearch(gridManager, {
                    code,
                    name,
                    tableName,
                    canEdit: '',
                    canEdit_text: '',
                    showALL: 0,
                    page: 1,
                    pagesize: 20,
                    sortname: 'sequence',
                    sortorder: 'asc',
                    sortfields: []
                });
            }, 800);
        }
    }

    // 进入编辑类表单设计页面
    function enterEditFormDesignPage() {// 进入编辑表单页面
        let div = $(`
<span id="myapp" style="z-index:10;">
    <button v-on:click="doOpenAddPage">打开新增页面</button>
    <button v-on:click="doShowPrintConfig">打印配置</button>
    <button v-on:click="doShowJsPathConfig">资源文件</button>
    <button v-on:click="doShowBusinessEventConfig">表单事件</button>
    <button v-on:click="doShowAddFunction">生成功能</button>
    <button v-on:click="doSearchQueryForm">搜索查询表单</button>
    <button v-on:click="autoAddFields">初始化字段</button>
    <button v-on:click="doOpenDef">打开定义</button>
    <div id="__copy" class="btn-group" v-on:mouseenter="$('#__copy').addClass('open')" >
      <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        复制信息 <span class="caret"></span>
      </button>
      <ul class="dropdown-menu">
        <li><a v-on:click="copyInfo('tableName')">表名</a></li>
        <li><a v-on:click="copyInfo('billdsiCode')">表单编码</a></li>
        <li><a v-on:click="copyInfo('billdsiName')">复制表单名称</a></li>
      </ul>
    </div>
</span>
`);
        $('#__div').append(div);

        var app = new Vue({
            el: '#myapp',
            mounted: function () {
                this.billdsiCode = $('#mainBilldsiCode').val();
                this.billdsiId = $('#mainBilldsiId').val();
                this.billdsiName = $('#mainBilldsiName').val();
                this.mainManager = UICtrl.getGridManager('#maingrid');
                $('body').append(`<script src="${web_app.name}/system/form/resource/billJsPathList.js"></script>`);
                $('body').append(`<script src="${web_app.name}/system/form/resource/billPrintConfigureList.js"></script>`);
                $('body').append(`<script src="${web_app.name}/system/form/resource/billBusinessEvent.js"></script>`);
                $('body').append(`<script src="${web_app.name}/system/opm/permission/FunctionUtil.js"></script>`);
                let id = this.billdsiId;
                let thisObj = this;
                $.ajax({
                    method: 'post',
                    data: 'id=' + id,
                    url: web_app.name + '/formDesign/showLoadBilldsi.load',
                    dataType: 'html',
                    success: function (data) {
                        let processDefinitionKey = $(data).find('#processDefinitionKey').val();
                        thisObj.hasProc = !!processDefinitionKey;
                        thisObj.tableName = $(data).find('#tableName').val();
                    }
                });
            },
            data: function () {
                return {
                    hasProc: true,
                }
            },
            methods: {
                doOpenDef: function () {
                    let id = this.billdsiId;
                    UICtrl.showAjaxDialog({
                        url: web_app.name + '/formDesign/showLoadBilldsi.load',
                        title: '编辑',
                        init: function (div) {
                            //流程树选择
                            $('#processDefinitionKey', div).treebox({
                                name: 'procTreeView', width: 270,
                                param: {nodeKindId: "folder,proc"},
                                beforeChange: function (data) {
                                    return data.nodeKindId == 'proc';
                                },
                                onChange: function (value, data) {
                                    $('#processDefinitionKey').val(data.procId);
                                }
                            });
                            //数据管理权限模型选择
                            $('#datamanagebusinessName', div).treebox({
                                name: 'dataManageBusinessTreeView',
                                searchName: 'dataManageBusiness',
                                searchType: 'sys',
                                hasSearch: true,
                                minWidth: 250,
                                onChange: function (node, data) {
                                    $('#datamanagebusinessName').val(data.fullName);
                                    $('#datamanagebusinessId').val(data.id);
                                }
                            });
                            //主键字段选择
                            $.formDesign.initTableColumnChoose({
                                table: $('#tableName', div),
                                column: $('#columnName', div),
                                isPk: true
                            });
                            $.formDesign.initTableColumnChoose({
                                table: $('#tableName', div),
                                column: $('#flowPersonFieldName', div),
                                dataType: 'VARCHAR2'
                            });
                        },
                        param: {id: id},
                        width: 700,
                        ok: function () {
                            var _self = this, param = {};
                            var url = '/formDesign/updateBilldsi.ajax';
                            if ($('#detailBilldsiId').val() == '') {
                                url = '/formDesign/insertBilldsi.ajax';
                            }
                            $('#submitForm').ajaxSubmit({
                                url: web_app.name + url,
                                param: param,
                                success: function () {
                                    _self.close();
                                    reloadGrid();
                                }
                            });
                        }
                    });
                },
                doSeq: function (arr) {
                    if (arr.length > 0) {
                        let v = arr.shift();
                        let billdsiId = this.billdsiId;
                        let groupId = this.groupId;
                        let lineArr = v.split('\t');
                        let fieldName, fieldType, fieldNote;
                        if (lineArr.length === 7) {
                            fieldName = lineArr[0].toUpperCase();
                            fieldType = lineArr[2].toUpperCase();
                            fieldNote = lineArr[6].toUpperCase();
                        } else if (lineArr.length === 5) {
                            fieldName = lineArr[0].toUpperCase();
                            fieldType = lineArr[1].toUpperCase();
                            fieldNote = lineArr[4].toUpperCase();
                        } else {
                            this.doSeq(arr);
                            return;
                        }

                        var option;
                        if (fieldType.startsWith('VARCHAR2')) {// 文本
                            option = {
                                fieldType: 'string',
                                fieldType_text: '文本',
                                fieldName: fieldName,
                                paramName: toHump(fieldName),
                                displayName: fieldNote ? fieldNote : '未命名' + i,
                                controlType: 'input',
                                controlType_text: '文本',

                            };
                        } else if (fieldType.startsWith('NUMBER') || fieldType === 'INTEGER') {
                            option = {
                                fieldType: 'number',
                                fieldType_text: '数值',
                                fieldName: fieldName,
                                paramName: toHump(fieldName),
                                displayName: fieldNote ? fieldNote : '未命名' + i,
                                fieldMaskChoose: 'nnnnnnnnn.nn',
                                fieldMaskChoose_text: '数字',
                                fieldMask: 'nnnnnnnnn.nnnn',
                                controlType: 'input',
                                controlType_text: '文本'
                            };
                        } else {
                            option = {
                                fieldType: 'date',
                                fieldType_text: '日期',
                                fieldName: fieldName,
                                paramName: toHump(fieldName),
                                displayName: fieldNote ? fieldNote : '未命名' + i,
                                controlType: 'date',
                                controlType_text: '日期'
                            };
                        }
                        option.billdsiId = billdsiId;
                        option.groupId = groupId;
                        ajaxSaveEditFormField(option).then((data) => {
                            console.log(fieldName + ' - 操作成功');
                            this.doSeq(arr);
                        });
                    } else {
                        this.mainManager.loadData();
                    }
                },
                autoAddFields: function () {
                    if (!this.groupId) {
                        this.groupId = $('#maintree>:first-child').attr('id');
                    }
                    let thisObj = this;
                    $.dialog({
                        title: '请输入',
                        width: '800px',
                        height: '400px',
                        content: '<textarea id="__inputFields" style="width: 750px;height: 350px"></textarea>',
                        ok: function () {
                            var input = $('#__inputFields').val();
                            input = input.trim();
                            if ('' === input) return;

                            var arr = input.split('\n');
                            thisObj.doSeq(arr);
                            this.time(0.1);
                            return false;
                        },
                        cancelVal: '关闭',
                        cancel: true
                    });
                },
                copyInfo: function (field) {
                    copyText(this[field]).then(() => {
                        console.log('复制:' + this[field] + '');
                    });
                },
                doOpenAddPage: function () {
                    let formCode = this.billdsiCode;
                    let billdsiName = this.billdsiName;
                    let action = this.hasProc ? 'addFormJob' : 'addForm';
                    let url = DataUtil.composeURLByParam($.formParsing.parseAction(action, formCode));
                    UICtrl.addTabItem({
                        tabid: formCode,
                        text: billdsiName,
                        url,
                    });
                },
                doShowPrintConfig: function () {
                    showBillPrintConfigur(this.billdsiId);
                },
                doShowJsPathConfig: function () {
                    showBillJsPathList(this.billdsiId);
                },
                doShowBusinessEventConfig: function () {
                    showLoadBillBusinessEvents(this.billdsiId);
                },
                doShowAddFunction: function () {
                    let code = this.billdsiCode;
                    let id = this.billdsiId;
                    let name = this.billdsiName;
                    FunctionUtil.showChooseDialog({
                        initDialog: function (div) {
                            $('#code', div).val(code);
                            UICtrl.disable($('#code', div));
                            $('#name', div).val('新增');
                            $('#description', div).val(name);
                            $('#nodeKindId', div).combox('setValue', 'fun');
                            UICtrl.disable($('#nodeKindId', div));
                            $('#url', div).val('formUsage/job/' + code + '/add.job');
                        }
                    });
                },
                doSearchQueryForm: function () {
                    parent.closeTabItem('GridDesign');
                    let tableName = this.tableName;
                    var url = DataUtil.composeURLByParam(web_app.name + '/gridDesign/forwardListBillquery.do', {
                        tableName,
                        id: funcIdObj.gridDesign
                    });

                    UICtrl.addTabItem({
                        tabid: 'GridDesign',
                        text: '查询类表单',
                        url
                    });
                }
            }
        });
    }

})();


/*function cusAjax(url, option) {
    return new Promise(resolve => {
        Public.ajax(web_app.name + url, option, function (data) {
            resolve(data);
        });
    });
}

function commonTreeFindParent(parentId) {
    return new Promise(resolve => {
        $.ajax({
            url: web_app.name + '/commonTree/loadCommonTree.load',
            data: {id: parentId, dataType: 'text/html'},
            success: function (data) {
                let $data = $(data);
                let name = $data.find('#name').val();
                let parentId = $data.find('#parentId').val();
                resolve({name, parentId});
            }
        })
    });
}*/

/*function composeCommonTreeParentArr(parentId, util, callback) {
    if (!window.__arr) window.__arr = [];
    commonTreeFindParent(parentId).then(data => {
        if (data.parentId !== util) {
            window.__arr.unshift(data);
            composeCommonTreeParentArr(data.parentId, util, callback);
        } else {
            callback(window.__arr);
            delete(window.__arr);
        }
    });
}*/

/*var code = 'outsourceProcessOut';
var settingsObj = {};
cusAjax('/codeBuildRule/slicedQueryCodeBuildRules.ajax', {
    code: code,
    name: '',
    folderId: '',
    page: 1,
    pagesize: 20,
    sortname: 'code',
    sortorder: 'asc',
    sortfields: []
}).then(data => {
    return new Promise(resolve => {
        if (data.Total !== 1) {
            Public.tip('code有多个对应的单据单号请检查。');
            resolve(undefined);
        }
        let codeBuildRule = data.Rows[0];
        composeCommonTreeParentArr(codeBuildRule.folderId, '0', (arr) => {
            settingsObj.codeBuildRule = {
                path: arr,
                codeBuildRule,
            };
            resolve();
        });
    });
}).then(() => {
    console.log(settingsObj);
});*/



























