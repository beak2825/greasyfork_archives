// ==UserScript==
// @name         epoint-老旧系统chrome兼容
// @namespace    com.epoint
// @version      0.2
// @description  针对新点老旧系统的chrome兼容问题处理
// @author       lidm
// @match        https://tampermonkey.net/index.php?version=4.9.5914&ext=gcal&updated=true
// @grant        none
// @include      https://oa.epoint.com.cn/*
// @downloadURL https://update.greasyfork.org/scripts/424960/epoint-%E8%80%81%E6%97%A7%E7%B3%BB%E7%BB%9Fchrome%E5%85%BC%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/424960/epoint-%E8%80%81%E6%97%A7%E7%B3%BB%E7%BB%9Fchrome%E5%85%BC%E5%AE%B9.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var $ = window.$,
        document = window.document,
        JSON = window.JSON,
        window_url = window.location.href,
        website_host = window.location.host;

    // 模态窗口支持
    if (!window.showModalDialog) {
        window.showModalDialog = function (url, arg, feature) {
            var opFeature = feature.split(";");
            var featuresArray = new Array();
            var i, f;
            if (document.all) {
                for (i = 0; i < opFeature.length - 1; i++) {
                    f = opFeature[i].split("=");
                    featuresArray[f[0]] = f[1];
                }
            }
            else {
                for (i = 0; i < opFeature.length - 1; i++) {
                    f = opFeature[i].split(":");
                    featuresArray[f[0].toString().trim().toLowerCase()] = f[1] ? f[1].toString().trim() : '';
                }
            }

            var h = "200px", w = "400px", l = "100px", t = "100px", r = "yes", c = "yes", s = "no";
            if (featuresArray["dialogheight"]) h = featuresArray["dialogheight"];
            if (featuresArray["dialogwidth"]) w = featuresArray["dialogwidth"];
            if (featuresArray["dialogleft"]) l = featuresArray["dialogleft"];
            if (featuresArray["dialogtop"]) t = featuresArray["dialogtop"];
            if (featuresArray["resizable"]) r = featuresArray["resizable"];
            if (featuresArray["center"]) c = featuresArray["center"];
            if (featuresArray["status"]) s = featuresArray["status"];
            var modelFeature = "height = " + h + ",width = " + w + ",left=" + l + ",top=" + t + ",model=yes,alwaysRaised=yes" + ",resizable= " + r + ",celter=" + c + ",status=" + s;

            var model = window.open(url, "", modelFeature);

            model.dialogArguments = arg;

            return '';

        };
    }


    // 新增需求-需求目录选择回调
    if (window_url.indexOf("https://oa.epoint.com.cn/ProjectManage/ProjectStory/Nstory/NStory_Add.aspx") != -1) {
        window.afterOpenWinUrl = function (returnValue) {
            $("[id$='txtModuleGuid']").val(returnValue);
            HidBtnClick();
        };
    }

    // 新增需求-需求目录选择方法修改
    if (window_url.indexOf("https://oa.epoint.com.cn/ProjectManage/ProjectStory/Nstory/NStory_ModelChange.aspx") != -1) {
        window.UpdateStory = function () {
            var moduleGuid = $("[id$='txtModuleGuid']").val();
            if (moduleGuid == '' || moduleGuid == null) {
                alert('请选择需求目录！');
                return;
            }
            opener.afterOpenWinUrl(moduleGuid);
            window.close();
        }
    }

    // 出差申请-项目选择回调
    if (window_url.indexOf("https://oa.epoint.com.cn/ProjectManage/BusinessTrip/Record_Workflow.aspx") != -1) {
        window.afterSelectXM = function (rtnValue) {
            if (rtnValue != null) {
                var ss = rtnValue.split("/");
                $("[id$=ProjectGuid_100563]").val(ss[1]);
                $("[id$=ProjectName_100563]").val(ss[0]);
                $("[id$=btnUpdateProject]").click();
            }
        }
    }

    // 出差申请-项目选择方法修改
    if (window_url.indexOf("https://oa.epoint.com.cn/ProjectManage/ProjectInfo/ProjectSelect.aspx") != -1) {
        window.retrunValue = function (ProjectName, ProjectGuid, KeHuDW, DiQu, DiQuValue) {
            ProjectName = ProjectName.replace(new RegExp('&apos;', "gm"), '\'');
            opener.afterSelectXM(ProjectName + "/" + ProjectGuid + "/" + KeHuDW + "/" + DiQu + "/" + DiQuValue);
            window.close();
        }
    }

    // 预算分配-小组选择回调
    if (window_url.indexOf("https://oa.epoint.com.cn/ProjectManage/FenPeiBZ/FenPeiXM_Edit.aspx") != -1) {
        window.SelectRcpt = function (type) {
            window.teamType = type;
            var ProjectGuid = $("[id$='lblProjectGuid']").text();
            var IsSoftWare = $("[id$='txtIsSoftWare']").val();
            var BudgetGuid = $("[id$='lblBudgetGuid']").text();
            var txtName = null;
            var txtGuid = null;
            var btnID = null;
            switch (type) {
                case '01':
                    txtName = $("[id$='txtKFGroups']");
                    txtGuid = $("[id$='txtKFGroupsGuid']");
                    btnID = $("[id$='btnRefreshKF']")
                    break;
                case '02':
                    txtName = $("[id$='txtSSGroups']");
                    txtGuid = $("[id$='txtSSGroupsGuid']");
                    btnID = $("[id$='btnRefreshSS']")
                    break
                case '03':
                    txtName = $("[id$='txtCSGroups']");
                    txtGuid = $("[id$='txtCSGroupsGuid']");
                    btnID = $("[id$='btnRefreshCS']")
                    break
                case '05':
                    txtName = $("[id$='txtMJCSGroups']");
                    txtGuid = $("[id$='txtMJCSGroupsGuid']");
                    btnID = $("[id$='btnRefreshMJCS']")
                    break
                default:
                    break;
            }

            var url = "../Pages/GroupUser/ProjectGroup_Frame.aspx?ProjectGuid=" + ProjectGuid + "&FromType=" + type + "&IsSoftWare=" + IsSoftWare + "&BudgetGuid=" + BudgetGuid;
            var arReturn = new Array();
            arReturn[0] = txtGuid.val();
            arReturn[1] = txtName.val();
            OpenDialogArgs(url, arReturn, '600', '500');
        }

        window.afterSelectRcpt = function (arReturn) {
            var txtName = null;
            var txtGuid = null;
            var btnID = null;
            switch (window.teamType) {
                case '01':
                    txtName = $("[id$='txtKFGroups']");
                    txtGuid = $("[id$='txtKFGroupsGuid']");
                    btnID = $("[id$='btnRefreshKF']")
                    break;
                case '02':
                    txtName = $("[id$='txtSSGroups']");
                    txtGuid = $("[id$='txtSSGroupsGuid']");
                    btnID = $("[id$='btnRefreshSS']")
                    break
                case '03':
                    txtName = $("[id$='txtCSGroups']");
                    txtGuid = $("[id$='txtCSGroupsGuid']");
                    btnID = $("[id$='btnRefreshCS']")
                    break
                case '05':
                    txtName = $("[id$='txtMJCSGroups']");
                    txtGuid = $("[id$='txtMJCSGroupsGuid']");
                    btnID = $("[id$='btnRefreshMJCS']")
                    break
                default:
                    break;
            }
            if (arReturn != null && arReturn.length != 0) {
                if (arReturn[1] != "" && arReturn[1] != null) {
                    txtName.val(arReturn[1]);
                    txtGuid.val(arReturn[0]);
                }
                else {
                    txtName.val("");
                    txtGuid.val("");
                }
            }
            btnID.click();
        }
    }

    // 预算分配-小组选择方法修改
    if (window_url.indexOf("https://oa.epoint.com.cn/ProjectManage/Pages/GroupUser/ProjectGroup_Frame.aspx") != -1) {
        window.rtnSelValue = function () {
            var rtnValue = new Array();
            var options = document.all("ListReceiverName").options;
            var userGuidLst = "";
            var userNameLst = "";
            for (var i = 0; i < options.length; i++) {
                userGuidLst += options[i].value + ";";
                userNameLst += options[i].text + ";";
            }
            rtnValue[0] = userGuidLst;
            rtnValue[1] = userNameLst;
            opener.afterSelectRcpt(rtnValue);
            window.close();
        }
    }

    // 新增需求-人员选择回调
    if (
        window_url.indexOf("https://oa.epoint.com.cn/ProjectManage/ProjectStory/Nstory/NStory_Edit.aspx") != -1
        || window_url.indexOf("https://oa.epoint.com.cn/ProjectManage/ProjectStory/Nstory/NStory_Add.aspx") != -1
    ) {
        window.afterSelUser = function (rtnValue) {
            if (rtnValue != null) {
                $("[id$='txtFinishPersonGuid']").val(rtnValue[0]);
                $("[id$='txtFinishPerson']").val(rtnValue[1]);
            }
        }
    }

    // 新增需求-人员选择方法修改
    if (window_url.indexOf("https://oa.epoint.com.cn/ProjectManage/pages/UserManage/SelectProjectUsersV2.aspx") != -1) {
        window.AutoSetPValue = function (check, userGuid, userName) {
            var UserArray = new Array(4);
            UserArray[0] = userGuid;
            UserArray[1] = userName;
            opener.afterSelUser(UserArray);
            window.close();
        }
    }

    // 代码评审-需求选择回调
    if (window_url.indexOf("https://oa.epoint.com.cn/Epoint_JiXiaoKaoHe/JX_KaoHe_System/CodeJudge/ProjectCodeJudge_") != -1) {
        window.afterSelectStory = function (rtnValue) {
            if (rtnValue != null) {
                var ss = rtnValue.split("●");
                document.getElementById("ctl00_cphContent_StoryGuids_850").value += ss[1] + ';';
                document.getElementById("ctl00_cphContent_StoryName_850").value += ss[0] + ';';
            }
        }
    }

    // 代码评审-需求选择方法修改
    if (window_url.indexOf("https://oa.epoint.com.cn/Epoint_JiXiaoKaoHe/JX_KaoHe_System/ProjectInfo/NStory_Select.aspx") != -1) {
        window.UpdateStory = function () {
            var StoryGuids = "";
            StoryGuids = GetDPSStory();
            opener.afterSelectStory(StoryGuids);
            window.close();
        }
    }

    // CRM预算下拨-人员选择方法修改
    if (window_url.indexOf("https://oa.epoint.com.cn/EpointCBM/Pages/NDlgUser/NUserTree_Group.aspx") != -1) {
        window.SetPValue = function (check, userGuid, userName, groupGuid, groupName, ouGuid, ouName) {
            var UserArray = new Array();
            UserArray[0] = userGuid;
            UserArray[1] = userName;
            UserArray[2] = groupGuid;
            UserArray[3] = groupName;
            UserArray[4] = ouGuid;
            UserArray[5] = ouName;

            opener.afterSelectFinishPerson(UserArray);
            window.close();
        }
    }

    // CRM预算下拨-人员选择回调
    if (window_url.indexOf("https://oa.epoint.com.cn/EpointCBM/Pages/Split.aspx") != -1 || window_url.indexOf("https://oa.epoint.com.cn/EpointCBM/Pages/BudgetInfo/NBudget_SplitEdit.aspx") != -1) {
        window.afterSelectFinishPerson = function (rtnValue) {
            document.getElementById("ctl00_ContentPlaceHolder1_txtRecipientGuid").value = rtnValue[0];
            document.getElementById("ctl00_ContentPlaceHolder1_txtRecipientName").value = rtnValue[1];
            document.getElementById("ctl00_ContentPlaceHolder1_txtRcptGroupGuid").value = rtnValue[2];
            document.getElementById("ctl00_ContentPlaceHolder1_txtRcptGroupName").value = rtnValue[3];
            document.getElementById("ctl00_ContentPlaceHolder1_txtRcptDeptGuid").value = rtnValue[4];
            document.getElementById("ctl00_ContentPlaceHolder1_txtRcptDeptName").value = rtnValue[5];
            if (rtnValue[0] == '' || rtnValue[0] == null) {
                document.getElementById("ctl00_ContentPlaceHolder1_txtRecipient").value = rtnValue[3];
            }
            else {
                document.getElementById("ctl00_ContentPlaceHolder1_txtRecipient").value = rtnValue[1];
                $("[id$='huminfo']").css("display", "block");
                BindStuffInfo(rtnValue[0]);
            }

        }

        window.SelectFinishPerson = function () {
            var rtnValue;
            var url;
            url = "/EpointCBM/Pages/NDlgUser/NUserTree_Group.aspx";
            rtnValue = OpenDialogArgs(url, '', '260', '400');
        }

        window.SelectBudgetInfo = function () {

            var rtnValue;
            var url;
            var ParentOUGuid;
            var UserArray = new Array(2);
            url = "/EpointCBM/Pages/BudgetInfo/NBudgetSelect/BudgetSelect_List.aspx";
            rtnValue = OpenDialogArgs(url, '', '1000', '600');
        }

        window.afterSelectBudgetInfo = function (rtnValue) {
            var json = $.parseJSON(rtnValue);
            var yue = json.RemainMoney;
            $("[id$='txtBudgetName']").val(json.BudgetName);
            $("[id$='txtBudgetTotal']").text(json.Total);
            $("[id$='txtBudgetGuid']").val(json.BudgetGuid);
            $("[id$='txtIsTopBudget']").val(json.PBudgetGuid);
            $("[id$='txtBudgetForm']").val(json.BudgetForm);
            //            $("[id$='txtGrantType']").val(json.GrantType);
            //            $("[id$='txtBudgetType']").val(json.BudgetType);
            //            $("[id$='txtBusinessProjectGuid']").val(json.BusinessProjectGuid);
            $("[id$='txtProjectGuid']").val(json.ProjectGuid);
            $("[id$='txtProjectName']").val(json.ProjectName);
            $("[id$='lblShowDetail']").html("<a href='BudgetInfo/Record_Detail.aspx?RowGuid=" + json.BudgetGuid + "' target='_blank'>" + "[总:" + json.Total + ",余:" + json.RemainMoney + "]</a>");
            $("[id$='lblProjectName']").html("<a href='https://oa.epoint.com.cn/ProjectManage/Default.aspx?ProjectGuid=" + json.ProjectGuid + "' target='_blank'>" + json.ProjectName + "</a>");
            if (parseFloat(yue) < 0) {
                $("[id$='txtRemainMoney']").text(0);
                $("[id$='txtSplit']").val(0);
                $("[id$='lblSplitUse']").text(0);
            }
            else {
                $("[id$='txtRemainMoney']").text(json.RemainMoney);
                $("[id$='txtSplit']").val(0);
                $("[id$='lblSplitUse']").text(0);
            }
            $("[id$='btnRefresh']").click();
        }
    }

    // CRM预算下拨-预算选择方法修改
    if (window_url.indexOf("https://oa.epoint.com.cn/EpointCBM/Pages/BudgetInfo/NBudgetSelect/BudgetSelect_List.aspx") != -1) {
        window.retrunValue = function (BudgetGuid, BudgetName, BudgetForm, Total, TotalA, TotalD,
            RemainMoney, FreezeMoney, PBudgetGuid,
            GrantType, ProjectGuid, ProjectName, BudgetType, BusinessProjectGuid) {
            var json = {
                'BudgetGuid': BudgetGuid, 'BudgetName': BudgetName, 'BudgetForm': BudgetForm,
                'Total': Total, 'TotalA': TotalA, 'TotalD': TotalD,
                'RemainMoney': RemainMoney, 'FreezeMoney': FreezeMoney,
                'PBudgetGuid': PBudgetGuid, 'GrantType': GrantType,
                "ProjectGuid": ProjectGuid, "ProjectName": ProjectName,
                "BudgetType": BudgetType, "BusinessProjectGuid": BusinessProjectGuid
            };
            opener.afterSelectBudgetInfo(JSON.stringify(json));
            window.close();
        }
    }

    // CRM发送任务-弹窗修改
    if (window_url.indexOf("https://oa.epoint.com.cn/ProjectManage/NMissionManage/Record_Add.aspx") != -1) {
        //选择预算
        window.SelectBudgetInfo = function () {
            var rtnValue;
            var Person = $("[id$='FinishPersonGuid_61']").val();
            if (Person != "")//已选择接收人
            {
                if (!confirm("重新选择预算将删除已选择的预算接收人，确认删除？")) {
                    return false;
                }
                else {
                    $("[id$='dvWarning']").html("");
                    $("[id$='txtSplit']").val("");
                    $("[id$='txtBudgetName']").val("");
                    $("[id$='txtBudgetGuid']").val("");
                    $("[id$='FinishPersonGuid_61']").val("");
                    $("[id$='FinishPersonName_61']").val("");
                    $("[id$='btnAddBudgetTD']").click();
                }
            }
            //var url = '../Pages/BudgetInfo/BudgetSelect/BudgetSelect_List.aspx';
            var url = 'https://oa.epoint.com.cn/EpointCBM' + '/Pages/BudgetInfo/NBudgetSelect/BudgetSelect_List.aspx';
            rtnValue = OpenDialogArgs(url, '', '1000', '500');
        }

        window.afterSelectBudgetInfo = function (rtnValue) {
            if (rtnValue != null) {
                var json = eval('(' + rtnValue + ')');
                //$("[id$='txtContactName']").val(json.BudgetName);
                $("[id$='txtBudgetName']").val(json.BudgetName);
                $("[id$='txtCostName']").val(json.BudgetName);
                $("[id$='txtBudgetForm']").val(json.BudgetForm);
                $("[id$='txtBudgetGuid']").val(json.BudgetGuid);
                $("[id$='txtBudgetTotal']").text(json.Total);
                $("[id$='txtFreezeMoney']").text(json.FreezeMoney);
                $("[id$='txtBusinessProjectGuid']").val(json.BusinessProjectGuid);
                $("[id$='txtPBudgetGuid']").val(json.PBudgetGuid);
                $("[id$='txtProjectGuid']").val(json.ProjectGuid);
                $("[id$='txtProjectName']").val(json.ProjectName);
                $("[id$='txtGrantType']").val(json.GrantType);
                var yue = json.RemainMoney;
                if (parseFloat(yue) < 0) {
                    $("[id$='txtRemainMoney']").text(0);
                }
                else {
                    $("[id$='txtRemainMoney']").text(json.RemainMoney);
                }
                $("[id$='btnAddBudgetTD']").click();
            }
        }

        window.BindTable = function () {
            var IsMonth = $("[id$='IsByMonth_61']").attr("checked");
            var BudgetGuid = $("[id$='txtBudgetGuid']").val();
            if (IsMonth != "checked" && (BudgetGuid == null || BudgetGuid == "")) {
                alert("请先选择预算");
                return false;
            }
            var url = 'https://oa.epoint.com.cn/ProjectManage/pages/NDlgUser/UserSelect_Frame.aspx';
            var arReturn = new Array();
            var oldUserNames = $("[id$='FinishPersonName_61']").val();
            var oldUserGuids = $("[id$='FinishPersonGuid_61']").val();
            arReturn[0] = oldUserGuids;
            arReturn[1] = oldUserNames;
            arReturn = OpenDialogArgs(url, arReturn, '620', '660');
        }

        window.afterRtnSelValue = function (arReturn) {
            var oldUserGuids = $("[id$='FinishPersonGuid_61']").val();
            if (arReturn != null) {
                var UserGuids = arReturn[0];
                $("[id$='FinishPersonGuid_61']").val(arReturn[0]);
                $("[id$='FinishPersonName_61']").val(arReturn[1]);
                BindRec(arReturn[0], arReturn[1], oldUserGuids);
            }
            else {
                $("[id$='FinishPersonGuid_61']").val("");
                $("[id$='FinishPersonName_61']").val("");
            }

        }
    }

    // CRM发送任务-人员选择方法修改
    if (window_url.indexOf("https://oa.epoint.com.cn/ProjectManage/pages/NDlgUser/UserSelect_Frame.aspx") != -1) {
        window.rtnSelValue = function () {
            var rtnValue = new Array();
            var options = document.all("ListReceiverName").options;
            var userGuidLst = "";
            var userNameLst = "";
            for (var i = 0; i < options.length; i++) {
                userGuidLst += options[i].value + ";";
                userNameLst += options[i].text + ";";
            }
            rtnValue[0] = userGuidLst;
            rtnValue[1] = userNameLst;
            opener.afterRtnSelValue(rtnValue);
            window.close();
        }
    }

    // 采购管理-菜单
    if (window_url.indexOf("https://oa.epoint.com.cn/AssetManage/Default.aspx") != -1) {
        $(document).ready(function () {
            //布局初始化
            //layout
            layout = $("#mainbody").ligerLayout({ height: '100%', heightDiff: -1, leftWidth: 180, onHeightChanged: f_heightChanged, minLeftWidth: 120 });
            var bodyHeight = $(".l-layout-center:first").height();
            //Tab
            tab = $("#framecenter").ligerTab({ height: bodyHeight, contextmenu: true });

            var mainmenu = $("#mainmenu");
            var UserGuid = $("[id$='txtHUserGuid']").val();
            var OuGuid = $("[id$='txtHOuGuid']").val();
            var arrparentCode = new Array(); //menu数组
            $.ajax({
                type: 'get',
                url: "getmodule.ashx?view=MyMenus&puserguid=" + UserGuid + "&pouguid=" + OuGuid,
                contentType: 'application/json',
                success: function (menus) {
                    menus = menus.replace(/{\"id\":/g, "{\"id\":\"").replace(/,\"ModuleCode\"/g, "\",\"ModuleCode\"");
                    console.log(menus);
                    $($.parseJSON(menus)).each(function (i, menu) {
                        var item = $('<div title="' + menu.MenuName + '"><ul id="tree' + menu.ModuleCode + '" style="margin-top:3px;"></ul></div>');
                        arrparentCode.push(menu.ModuleCode); //插入数组
                        mainmenu.append(item);
                    });
                    //Accordion
                    accordion = $("#mainmenu").ligerAccordion({ height: bodyHeight - 24, speed: null });
                    //生成树
                    for (var j = 0; j < arrparentCode.length; j++) {
                        $("#tree" + arrparentCode[j]).ligerTree({
                            url: "getModule.ashx?" + $.param({ ParentModuleCode: arrparentCode[j], puserguid: UserGuid, pouguid: OuGuid, view: "leftTree" }),
                            checkbox: false,
                            onClick: function (node) {
                                //                            if (!node.data.url) return;
                                //                            var tabid = $(node.target).attr("tabid");
                                //                            if (!tabid) {
                                //                                tabid = new Date().getTime();
                                //                                $(node.target).attr("tabid", tabid)
                                //                            }
                                var tabid = $(node.target).attr("tabid");
                                if (!tabid) {
                                    tabid = new Date().getTime();
                                    $(node.target).attr("tabid", tabid);
                                }
                                tab.reload(tabid);
                                f_addTab(tabid, node.data.text, node.data.url);
                            }
                        });
                    }

                    $("#pageloading").hide();
                }
            });
            $.getJSON("getmodule.ashx?view=MyMenus&puserguid=" + UserGuid + "&pouguid=" + OuGuid, function (menus) {

            });

        });
    }

    // 采购管理-datagrid高度异常
    if (window_url.indexOf("https://oa.epoint.com.cn/AssetManage/") != -1 || window_url.indexOf("https://oa.epoint.com.cn/EpointCRM/") != -1) {
        var style = document.createElement("style");
        style.type = "text/css";
        var text = document.createTextNode(".tbgrid{height: 100%!important;");
        style.appendChild(text);
        var head = document.getElementsByTagName("head")[0];
        head.appendChild(style);
    }

    // 采购管理-采购单类型选择bug修复
    if (window_url.indexOf("https://oa.epoint.com.cn/AssetManage//PurchasingManage/MaterialApply2/SelectType.aspx") != -1) {
        window.CloseParentDialogBox2 = function (ret, id) {
            if (!id)
                id = GetCurrentDialogBoxID();
            var DialogDiv = parent.$("#_DialogDiv_" + id);
            if (DialogDiv.length == 0)
                return;
            var diag = DialogDiv[0].dialogInstance;
            if (ret) {
                try { diag.CallBack(ret); } catch (ex) { }
            }
            diag.close();
        }
    }

    // 采购管理-普通采购-弹窗问题修复
    if (window_url.indexOf("https://oa.epoint.com.cn/AssetManage/PurchasingManage/MaterialApply2/Record_Workflow2") != -1) {
        window.selectBudgetInfo = function () {
            var rtnValue;
            var ProjectGuid = $("[id$='ProjectGuid_201']").val();
            var BType = '-1';
            if (BType != '50' && BType != '60') {
                ProjectGuid = '';
            }
            //var url = '/EpointCBM/Pages/BudgetInfo/BudgetSelect/BudgetSelectDetail_List.aspx?Type=1&ProjectGuid=' + ProjectGuid;
            var url = 'https://oa.epoint.com.cn/EpointCBM/Pages/BudgetInfo/NBudgetSelect/BudgetSelectDetail_List.aspx?FromType=CG&Type=1&ProjectGuid=' + ProjectGuid;
            if (BType == '10')//简单销售
            {
                url = 'https://oa.epoint.com.cn/EpointCBM/Pages/BudgetInfo/NBudgetSelect/BudgetSelectDetail_List.aspx?FromType=CG&Type=1&BudgetForm=9&ProjectGuid=' + ProjectGuid;
            }
            rtnValue = OpenDialogArgs(url, '', '1000', '500');
            if (rtnValue != null) {
                $("[id$='txtStrJson']").val(rtnValue);
            }
            GetBudgetInfo();
        }

        window.afterSelectBudgetInfo = function (rtnValue) {
            if (rtnValue != null) {
                $("[id$='txtStrJson']").val(rtnValue);
            }
            GetBudgetInfo();
        }
    }

    // 采购管理-项目采购-弹窗问题修复
    if (window_url.indexOf("https://oa.epoint.com.cn/AssetManage/PurchasingManage/MaterialApply2/Record_Workflow_v1") != -1) {
        window.selectBudgetInfo = function () {
            var rtnValue;
            var BType = '50';

            if (BType != '50' && BType != '60') {
                ProjectGuid = '';
            }
            var ProjectGuid = $("[id$='ProjectGuid_201']").val();
            var ContractGuid = $("[id$='ContractGuid_201']").val();

            if (BType == '10')//简单销售
            {
                url = 'https://oa.epoint.com.cn/EpointCBM/Pages/BudgetInfo/NBudgetSelect/BudgetSelectDetail_List.aspx?FromType=CG&Type=1&BudgetForm=9&ProjectGuid=' + ProjectGuid;
            }
            else {
                var url = 'https://oa.epoint.com.cn/EpointCBM/Pages/BudgetInfo/NBudgetSelect/BudgetSelectDetail_List.aspx?FromType=CG&Type=1&ProjectGuid=' + ProjectGuid + '&ContractGuid=' + ContractGuid;
            }
            rtnValue = OpenDialogArgs(url, '', '1000', '500');

        }

        window.afterSelectBudgetInfo = function (rtnValue) {
            if (rtnValue != null) {
                $("[id$='txtStrJson']").val(rtnValue);
            }
            GetBudgetInfo();
        }

        window.selectProject = function () {
            var rtnValue;
            var url;
            var ParentOUGuid;
            url = "../ProjectInfo/ProjectSelect.aspx?Flag=1";
            OpenDialogArgs(url, '', '1000', '500');
        }

        window.afterSelectProject = function (rtnValue) {
            if (rtnValue != null) {
                var ss = rtnValue.split("/");
                document.getElementById('ctl00_ContentPlaceHolder1_ProjectName_201').value = ss[0];
                document.getElementById('ctl00_ContentPlaceHolder1_ProjectGuid_201').value = ss[1];
                document.getElementById('ctl00_ContentPlaceHolder1_txtHetongBH').value = "";
                document.getElementById('ctl00_ContentPlaceHolder1_ContractGuid_201').value = "";

                $("[id$='BudgetNameInfo_201']").val("");
                $("[id$='BudgetDetailGuid_201']").val("");
                $("[id$='BudgetForm_201']").val("");
                $("[id$='BudgetGuid_201']").val("");
                $("[id$='MaxUse_201']").val("");
                $("[id$='RemainMoney_201']").val("");
            }
        }

        window.selectHetong = function () {
            if (document.getElementById('ctl00_ContentPlaceHolder1_ProjectGuid_201').value == "") {
                alert("请选择项目！");
                return;
            }
            var rtnValue;
            var url;
            var ParentOUGuid;
            url = "../Contract/Contract.aspx?ProjectGuid=" + document.getElementById('ctl00_ContentPlaceHolder1_ProjectGuid_201').value;
            OpenDialogArgs(url, '', '1000', '500');
        }

        window.afterSelectHetong = function (rtnValue) {
            if (rtnValue != null) {
                var ss = rtnValue.split("/");
                document.getElementById('ctl00_ContentPlaceHolder1_txtHetongBH').value = ss[0];
                document.getElementById('ctl00_ContentPlaceHolder1_ContractGuid_201').value = ss[1];

                $("[id$='BudgetNameInfo_201']").val("");
                $("[id$='BudgetDetailGuid_201']").val("");
                $("[id$='BudgetForm_201']").val("");
                $("[id$='BudgetGuid_201']").val("");
                $("[id$='MaxUse_201']").val("");
                $("[id$='RemainMoney_201']").val("");
            }
        }
    }

    // macos下，邮件@问题修复
    if (window_url.indexOf("https://oa.epoint.com.cn:8080/OA9/oa9/mail/mailreceivedetail") != -1 || window_url.indexOf("https://oa.epoint.com.cn:8080/OA9/oa9/mail/mailsenddetail") != -1) {
        addStyle(`
        #at-view-64 {
            position: fixed !important;
        }
    ` )

        function addStyle(cssStr) {
            var D = document;
            var newNode = D.createElement('style');
            newNode.textContent = cssStr;

            var targ = D.getElementsByTagName('head')[0] || D.body || D.documentElement;
            targ.appendChild(newNode);
        }
    }

    // 培训管理-菜单加载问题修复
    if (window_url.indexOf("https://oa.epoint.com.cn/EpointTrainingManage/BackStage/BackStageManage/TrainManagement.aspx") != -1) {
        var layout = window.layout,
            tab = window.tab,
            accordion = window.accordion;
        $(document).ready(function () {
            //debugger;
            //布局初始化
            //layout
            layout = $("#mainbody").ligerLayout({ height: '100%', heightDiff: -1, leftWidth: 180, onHeightChanged: f_heightChanged, minLeftWidth: 120 });
            var bodyHeight = $(".l-layout-center:first").height();
            //Tab
            tab = $("#framecenter").ligerTab({ height: bodyHeight, contextmenu: true, dblClickToClose: true });

            var mainmenu = $("#mainmenu");
            var UserGuid = $("[id$='txtHUserGuid']").val();
            var OuGuid = $("[id$='txtHOuGuid']").val();
            var arrparentCode = new Array(); //menu数组
            $.get("/EpointTrainingManage/getModule.ashx?view=MyMenus&puserguid=" + UserGuid + "&pouguid=" + OuGuid + "&ParentModuleCode=0004", null, function (menus) {
                console.log(menus);
                menus = eval('(' + menus + ')');
                $(menus).each(function (i, menu) {

                    var item = $('<div title="' + menu.MenuName + '"><ul id="tree' + menu.ModuleCode + '" style="width: 134px;margin-top:3px;"></ul></div>');
                    arrparentCode.push(menu.ModuleCode); //插入数组
                    mainmenu.append(item);
                });
                //Accordion
                accordion = $("#mainmenu").ligerAccordion({ height: bodyHeight - 24, speed: null });
                //生成树
                for (var j = 0; j < arrparentCode.length; j++) {
                    $("#tree" + arrparentCode[j]).ligerTree({
                        url: "/EpointTrainingManage/getModule.ashx?" + $.param({ ParentModuleCode: arrparentCode[j], puserguid: UserGuid, pouguid: OuGuid, view: "leftTree" }),
                        checkbox: false,
                        onClick: function (node) {
                            if (typeof (node.data.children) != "undefined" && node.data.children.length > 0) {
                                return;
                            }
                            var tabid = $(node.target).attr("tabid");
                            if (!tabid) {
                                tabid = new Date().getTime();
                                $(node.target).attr("tabid", tabid);
                            }
                            tab.reload(tabid);
                            f_addTab(tabid, node.data.text, node.data.url);
                        }
                    });
                }

                $("#pageloading").hide();
            });

        });
    }



})();