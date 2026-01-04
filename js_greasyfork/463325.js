// ==UserScript==
// @name         政数5部-项目维护工具
// @namespace    com.epoint.zsyf.5b
// @version      1.6.8
// @description  项目维护工具
// @author       zyq
// @match        https://oa.epoint.com.cn/productrelease/cpzt/*/demandbasicinfo_detail?*
// @match        https://oa.epoint.com.cn/productrelease/cpzt/*/demandchangeinfo_detail?*
// @match        https://oa.epoint.com.cn/productrelease/cpzt/*/demandbasicinfonew_detail?*
// @match        https://oa.epoint.com.cn/productrelease/cpzt/demandmanage/demandfeedbackadd*
// @match        https://oa.epoint.com.cn/productrelease/cpzt/demandtongji/demanddesigntongjilist*
// @match        https://levideo.epoint.com.cn:1235/ga-se/se/demandissue/demandissueadd*
// @match        https://fdoc.epoint.com.cn/onlinedoc/kfzknowledge/kfzknowledge/handlequestionworkflow?*
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463325/%E6%94%BF%E6%95%B05%E9%83%A8-%E9%A1%B9%E7%9B%AE%E7%BB%B4%E6%8A%A4%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/463325/%E6%94%BF%E6%95%B05%E9%83%A8-%E9%A1%B9%E7%9B%AE%E7%BB%B4%E6%8A%A4%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

	/* globals jQuery, $, waitForKeyElements */

    //#region 基础方法
    var mini = unsafeWindow.mini,
        $ = unsafeWindow.$,
        epoint = unsafeWindow.epoint,
        SrcBoot = unsafeWindow.SrcBoot,
        document = unsafeWindow.document,
        Util = unsafeWindow.Util,
        s_Html = unsafeWindow.s_Html,
        JSON = unsafeWindow.JSON,
        window_url = unsafeWindow.location.href,
		window_pathname = unsafeWindow.location.pathname,
        website_host = unsafeWindow.location.host;

    const SERVER_URL = "https://levideo.epoint.com.cn:1235/ga-se";

    const ISSUE_LIST_OF_DEMAND = "/demand/issue/list-of-demand";
    const ISSUE_FIX = "/demand/issue/fix";
    const ISSUE_DELETE = "/demand/issue/delete";

    const FS_accessToken_Url = "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal";
	const FS_APP_appid = "cli_a4a160b34b7dd00e";//飞书应用appid
	const FS_APP_appsecret = "7iucDUSnQD5MdJesOvzIEdTia1FKg7kO";//飞书应用appsecret
	const FS_Table_app_token = "Btg5bV0UMaQ9rOszjracmxJnnkf";//飞书多维表apptoken
	const FS_Table_tableid = "tblWlKBj8ENgXEEV";//飞书多维表tableid

	var FS_insertUrl = "https://open.feishu.cn/open-apis/bitable/v1/apps/"+FS_Table_app_token+"/tables/"+FS_Table_tableid+"/records";
	var FS_findUrl = "https://open.feishu.cn/open-apis/bitable/v1/apps/"+FS_Table_app_token+"/tables/"+FS_Table_tableid+"/records?filter=";

    var demandType;//1bug修复；2需求开发；3知识库
    var isShowBtn = "0";

	//开发小组信息
    var grids = {};
	var demandGuid;
    //#endregion 基础方法

    if (window_url.indexOf("demandbasicinfo_detail?") != -1 || window_url.indexOf("demandbasicinfonew_detail?") != -1 || window_url.indexOf("demandchangeinfo_detail?") != -1) {
        demandType = "2";
    }else if(window_url.indexOf("handlequestionworkflow?") != -1 ){
        demandType = "3";
    }

    //#region 需求流程处理页面
    if (!!demandType) {
        // 获取需求信息
        var demandInfo = {};
        //左上角按钮列
        var domToolBar;
        if(demandType == "2"){
            domToolBar = $('.fui-toolbar').children().get(0);
        }else if(demandType == "3"){
            domToolBar = $('.fui-toolbar').children().children().get(3);
        }
		//获取飞书token
		var fs_token;
		FS_getToken();

        afterDemandGuidLoad(function () {
			//渲染签收按钮
            if(isShowBtn == "1"){

            }else{
                loadBtn();
                isShowBtn = "1";
            }
        });

        var signBtn;
        var specialteamCom;
        var usernameCom;

        function afterDemandGuidLoad(f) {
            if(demandType == "2"){
                if (!unsafeWindow.rowguid) {
                    setTimeout(function () {
                        //afterDemandGuidLoad(f);
                    }, 1000);
                    return;
                }
                demandGuid = unsafeWindow.rowguid;
            }else if(demandType == "3"){
                if (!new mini.get("rowGuid").getValue()) {
                    setTimeout(function () {
                        //afterDemandGuidLoad(f);
                    }, 1000);
                    return;
                }
                demandGuid = new mini.get("rowGuid").getValue();
            }
            f();
        }

        function loadBtn() {
             signBtn = createBtn("开发代表签收", function () {
                epoint.showLoading();
                if(demandType == "2"){
                    //读取需求的基本信息
                    loadDemandInfo();
                }else if(demandType == "3"){
                    loadKnowledgeInfo();
                }
                //需求状态
                demandInfo.demandstatus = "设计阶段";
                //优先级
                var priority = "低";
                if(demandInfo.isurgent == "是"){
                    priority = "高";
                }
                demandInfo.priority = priority;

                //需求分类
                var demandTypeText;
                if(demandType == "2"){
                    demandTypeText = "需求开发";
                }else if(demandType == "3"){
                    demandTypeText = "知识库";
                }
                demandInfo.demandTypeText = demandTypeText;

                //开发代表
                demandInfo.usernameComid = mini.get("usernameComid").getValue();
                if(demandInfo.usernameComid){
                    demandInfo.username = demandInfo.usernameComid;
                }else{
                    epoint.alert("请选择开发代表！");
                    return;
                }
                //开发小组
                demandInfo.groupname = personJson[demandInfo.username];
                if(!demandInfo.groupname){
                    demandInfo.groupname = "";
                }
                //特殊处理开发代表
                if(demandInfo.username == "李鑫(政数研发5部)"){
                    demandInfo.username = "李鑫";
                }else if(demandInfo.username == "杨梦(政数研发5部)"){
                    demandInfo.username = "杨梦";
                }

                //专业化团队
                demandInfo.specialteamComid = mini.get("specialteamComid").getValue();
                if(demandInfo.specialteamComid){
                    demandInfo.specialteam = demandInfo.specialteamComid.split(",");
                }else{
                    demandInfo.specialteam = [];
                }

				var params = {
					"fields": {
						"需求描述":{
							"text":demandInfo.demandname,
							"link":demandInfo.demandurl
						},
						"项目名称":demandInfo.projectname,
						"开发代表":demandInfo.username,
                        "开发小组":demandInfo.groupname,
                        "需求分类":demandInfo.demandTypeText,
                        "优先级":demandInfo.priority,
                        "需求状态":demandInfo.demandstatus,
                        "专业化团队":demandInfo.specialteam,
						"需求提出日期":stringToDate(demandInfo.djdate,'-').getTime(),
						"预期交付时间":stringToDate(demandInfo.hopefinishdate,'-').getTime(),
                        "交付人员":demandInfo.jfry
					}
				};

                //处理数据
                findFsRecord(params);
			});
			signBtn.render(domToolBar);

            usernameCom = createUsernameCombobox();
            usernameCom.render(domToolBar);

            specialteamCom = createSpecialteamCombobox();
            specialteamCom.render(domToolBar);

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

        //专业化团队下拉选
        function createSpecialteamCombobox() {
            var combobox = new mini.ComboBox();
            combobox.addCls('mini-combobox');
            combobox.set({
                id:"specialteamComid",
                multiSelect: true,
                emptyText: "请选择专业化团队"
            });
            combobox.setData(specialteamData);
            return combobox;
        }

        //开发代表下拉选
        function createUsernameCombobox() {
            var combobox = new mini.ComboBox();
            combobox.addCls('mini-combobox');
            combobox.set({
                id:"usernameComid",
                multiSelect: false,
                emptyText: "请选择开发代表"
            });
            combobox.setData(usernameData);
            return combobox;
        }

        var specialteamData = [
                                {
                                "id": "自行负责",
                                "text": "自行负责"
                            }, {
                                "id": "许烨斌团队",
                                "text": "许烨斌团队"
                            }, {
                                "id": "王圣涛团队",
                                "text": "王圣涛团队"
                            }, {
                                "id": "王华兵团队",
                                "text": "王华兵团队"
                            }, {
                                "id": "高登科团队",
                                "text": "高登科团队"
                            }, {
                                "id": "陈天扬团队",
                                "text": "陈天扬团队"
                            }, {
                                "id": "公共研发",
                                "text": "公共研发"
                            }
                        ];

        var usernameData = [
            { "id": "程晓东", "text": "程晓东"},
            { "id": "储振浩", "text": "储振浩"},
            { "id": "冯苏洲", "text": "冯苏洲"},
            { "id": "刘程", "text": "刘程"},
            { "id": "单杰", "text": "单杰"},
            { "id": "孙国庆", "text": "孙国庆"},
            { "id": "张敬洋", "text": "张敬洋"},
            { "id": "张燕青", "text": "张燕青"},
            { "id": "张耀", "text": "张耀"},
            { "id": "张腾", "text": "张腾"},
            { "id": "强继伟", "text": "强继伟"},
            { "id": "徐炜", "text": "徐炜"},
            { "id": "时彬", "text": "时彬"},
            { "id": "李鑫(政数研发5部)", "text": "李鑫(政数研发5部)"},
            { "id": "杜兴凯", "text": "杜兴凯"},
            { "id": "杨梦(政数研发5部)", "text": "杨梦(政数研发5部)"},
            { "id": "杨飞", "text": "杨飞"},
            { "id": "漆楚东", "text": "漆楚东"},
            { "id": "王逸凡", "text": "王逸凡"},
            { "id": "秦志刚", "text": "秦志刚"},
            { "id": "肖瑞", "text": "肖瑞"},
            { "id": "苗鹏", "text": "苗鹏"},
            { "id": "许林辉", "text": "许林辉"},
            { "id": "陈金昊", "text": "陈金昊"},
            { "id": "马松豪", "text": "马松豪"},
            { "id": "黎力铭", "text": "黎力铭"},
            { "id": "张成明", "text": "张成明"},
            { "id": "饶少亮", "text": "饶少亮"},
            { "id": "潘顺兴", "text": "潘顺兴"}
                                    ];

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
			demandInfo.demandurl= "https://oa.epoint.com.cn" + window_pathname + "?RowGuid=" + demandGuid;
			demandInfo.djdate=$('.form-control.span1[label="登记日期"]').children().html();
            demandInfo.jfry=$('.form-control.span1[label="登记人员"]').children().html();
        }

        /**
         * 读取知识库的基本信息
         */
        function loadKnowledgeInfo() {
            var workflowhistory_datagrid = mini.get('workflowhistory_datagrid');
            workflowhistory_datagrid.findRow(function(row){
                if(personStr.indexOf(row.username)>-1) {
                    if(!!demandInfo.username){
                    }else{
                        demandInfo.username = row.username;
                    }
                    return true;
                }
            });

            var firstRow = workflowhistory_datagrid.getRow(0);
            var createdate = firstRow.createdate;
            demandInfo.djdate = dateFormat('YYYY-MM-dd',new Date(createdate));
            demandInfo.demandurl = window_url;
            demandInfo.demandname = $("#title")[0].innerText;
            if($("#projectname1").length > 0){
                demandInfo.projectname = $("#projectname1")[0].innerText;
            }
            if($("#projectname").length > 0){
                demandInfo.projectname = $("#projectname")[0].innerText;
            }
            demandInfo.hopefinishdate = $("div[label='应完成时间']")[0].innerText;
            demandInfo.rowguid = demandGuid;
            demandInfo.jfry= $("div[label='提交人']")[0].innerText;
        }
    }
    // #endregion 需求流程处理页面

	//获取飞书token
	function FS_getToken(){
		var getTokenParams = {
			"app_id":FS_APP_appid,
			"app_secret":FS_APP_appsecret
		}
		GM_xmlhttpRequest({
			method: "post",
			url: FS_accessToken_Url,
			dataType : 'json',
			data: JSON.stringify(getTokenParams),
			headers: { "Content-Type": "application/json;charset=UTF-8" },
			onload: function(rdata) {
				var returnJson = JSON.parse(rdata.response);
				fs_token = returnJson.tenant_access_token;
			}
		});
	}
	//插入飞书
	function insertFsRecord(params){
		GM_xmlhttpRequest({
			method: "post",
			url: FS_insertUrl,
			dataType : 'json',
			data: JSON.stringify(params),
			headers: { "Authorization":"Bearer " + fs_token, "Content-Type": "application/json;charset=UTF-8" },
			onload: function(rdata) {
				var returnJson = JSON.parse(rdata.response);
				if(returnJson.code === 0){
					epoint.alert("签收成功！");
				}else{
					epoint.alert("签收失败！");
				}
			}
		});
	}
    //根据需求信息查询
    function findFsRecord(params){
        var demandname = params.fields.需求描述.text;
        var projectname = params.fields.项目名称;
        var djdate = params.fields.需求提出日期;
        var findurl = FS_findUrl+'CurrentValue.[需求描述]="'+demandname+'"'+'&&CurrentValue.[项目名称]="'+projectname+'"'+'&&CurrentValue.[需求提出日期]="'+djdate+'"';
        GM_xmlhttpRequest({
			method: "get",
			url: findurl,
			headers: { "Authorization":"Bearer " + fs_token },
			onload: function(rdata) {
                epoint.hideLoading();
                var returnJson = JSON.parse(rdata.response);
                if(returnJson.code === 0 && returnJson.data && returnJson.data.total>0){
                    //如果存在则给出判断是否要插入
                    epoint.confirm("存在同名需求，是否再次同步？", "同步确认", function() {
                        insertFsRecord(params);
                    }, function() {
                    })
                }else{
                    //如果不存在则直接插入
                    insertFsRecord(params);
                }
			}
		});
    }

    function getCookie(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)){
            return unescape(arr[2]);
        }else{
            return null;
        }
    }

	/*字符串转时间的函数*/
	function stringToDate(dateStr,separator){
		if(!separator){
			separator="-";
		}
		var dateArr = dateStr.split(separator);
		var year = parseInt(dateArr[0]);
		var month;
		if(dateArr[1].indexOf("0") == 0){
			month = parseInt(dateArr[1].substring(1));
		}else{
			month = parseInt(dateArr[1]);
		}
		var day = parseInt(dateArr[2]);
		var date = new Date(year,month -1,day);
		return date;
	}

    function dateFormat(fmt, date) {
        let ret;
        const opt = {
            "Y+" : date.getFullYear().toString(), // 年
            "M+" : (date.getMonth() + 1).toString(), // 月
            "d+" : date.getDate().toString(), // 日
            "H+" : date.getHours().toString(), // 时
            "m+" : date.getMinutes().toString(), // 分
            "s+" : date.getSeconds().toString()
        // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
        };
        for ( let k in opt) {
            ret = new RegExp("(" + k + ")").exec(fmt);
            if (ret) {
                fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
            }
            ;
        }
        ;
        return fmt;
    }

    var personJson = {
        '程晓东':'开发8组-程晓东',
        '储振浩':'开发7组-苗鹏',
        '冯苏洲':'开发3组-张燕青',
        '刘程':'开发6组-刘程',
        '单杰':'开发5组-张腾',
        '孙国庆':'开发6组-刘程',
        '张敬洋':'开发5组-张腾',
        '张燕青':'开发3组-张燕青',
        '张耀':'开发4组-肖瑞',
        '张腾':'开发5组-张腾',
        '强继伟':'开发3组-张燕青',
        '徐炜':'开发2组-时彬',
        '时彬':'开发2组-时彬',
        '李鑫(政数研发5部)':'开发1组-杨梦',
        '杜兴凯':'开发7组-苗鹏',
        '杨梦(政数研发5部)':'开发1组-杨梦',
        '杨飞':'开发3组-张燕青',
        '漆楚东':'开发1组-杨梦',
        '王逸凡':'开发2组-时彬',
        '秦志刚':'开发4组-肖瑞',
        '肖瑞':'开发4组-肖瑞',
        '苗鹏':'开发7组-苗鹏',
        '许林辉':'开发5组-张腾',
        '陈金昊':'开发3组-张燕青',
        '马松豪':'开发1组-杨梦',
        '黎力铭':'开发2组-时彬',
        '张成明':'开发4组-肖瑞',
        '饶少亮':'开发3组-张燕青',
        '潘顺兴':'开发8组-程晓东'
    }

    var personStr = "程晓东,储振浩,冯苏洲,刘程,单杰,孙国庆,张敬洋,张燕青,张耀,张腾,强继伟,徐炜,时彬,李鑫(政数研发5部),杜兴凯,杨梦(政数研发5部),杨飞,漆楚东,王逸凡,秦志刚,肖瑞,苗鹏,许林辉,陈金昊,马松豪,黎力铭,张成明,饶少亮,潘顺兴";

})();