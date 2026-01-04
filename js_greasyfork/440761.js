// ==UserScript==
// @name         效能工具
// @namespace    com.epoint.zw.efficiency
// @version      0.3
// @description  新点软件政务效能团队内部工具
// @author       deming
// @match        https://oa.epoint.com.cn/productrelease/cpzt/demandtongji/demanddesigntongjilist
// @match        https://oa.epoint.com.cn/productrelease/cpzt/demandtongji/demanddesigntongjinewlist
// @match        https://oa.epoint.com.cn/productrelease/cpzt/demandtongji/demandreviewcontrol_list
// @match        https://oa.epoint.com.cn/productrelease/cpzt/demandtongji/demandrattongjilist
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440761/%E6%95%88%E8%83%BD%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/440761/%E6%95%88%E8%83%BD%E5%B7%A5%E5%85%B7.meta.js
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

    //#endregion 基础方法


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

    if(window_url.indexOf("https://oa.epoint.com.cn/productrelease/cpzt/demandtongji/demanddesigntongjinewlist") != -1){
        window.expExcel = function () {
            window.expExcelData();
        }
    }

    if(window_url.indexOf("https://oa.epoint.com.cn/productrelease/cpzt/demandtongji/demandreviewcontrol_list") != -1){
        window.expExcel = function(){
            var demandStatus = encodeURI(mini.get('rblAuditstatus').getValue());
            var developStatus = encodeURI(mini.get('searchDevelopstatus').getValue());
            var demandName = encodeURI(mini.get('search_demandname').getValue());
            var operateStart = encodeURI(mini.get('gxh_operatedate_moreq').getText());
            var operateEnd = encodeURI(mini.get('gxh_operatedate_lessq').getText());

            var projectName = encodeURI(mini.get('searchprojectname').getValue());
            var projectGuid = encodeURI(mini.get('searchprojectguid').getValue());

            var demandFrom = encodeURI(mini.get('search_demandfrom').getValue());
            var demandTag = encodeURI(mini.get('search_demandtag').getValue());
            var demandType = encodeURI(mini.get('demandtype').getValue());
            var demandStyle = encodeURI(mini.get('demandstyle').getValue());
            var leftTreeNodeGuid = encodeURI(mini.get('leftTreeNodeGuid').getValue());
            var shrDateStart = encodeURI(mini.get('gxh_shrdate_moreq').getText());
            var shrDateEnd = encodeURI(mini.get('gxh_shrdate_lessq').getText());
            //
            var labelGuid = encodeURI(mini.get("labelguid").getValue());
            var funcLabelGuid = encodeURI(mini.get("funclabelguid").getValue());

            window.open("demandreviewcontrollistaction.action?cmd=expExcel&demandStatus=" + demandStatus + "&developStatus=" + developStatus + "&demandName=" + demandName + "&operateStart="
                        + operateStart + "&operateEnd=" + operateEnd + "&projectName=" + projectName + "&projectGuid=" + projectGuid + "&demandFrom=" + demandFrom + "&demandTag=" + demandTag
                        + "&demandType=" + demandType + "&nodeInfo=" + leftTreeNodeGuid + "&demandStyle=" + demandStyle + "&shrDateStart=" + shrDateStart + "&shrDateEnd=" + shrDateEnd + "&labelGuid="
                        + labelGuid + "&funcLabelGuid=" + funcLabelGuid);
        }
    }

    if(window_url.indexOf("https://oa.epoint.com.cn/productrelease/cpzt/demandtongji/demandrattongjilist") != -1){
        //导出excel
        window.expExcel = function() {
            epoint.refresh('fui-right', function(data) {
                var expNum = data.expNum;
                var message = "";
                if (parseInt(expNum) >= parseInt(demandexportnum)) {
                    message = "请将导出结果控制" + demandexportnum + "条以内";
                    epoint.alert(message);
                } else {
                    expExcelData();
                }
            }, true);
        }
    }

    // #endregion 去掉需求评审统计导出时间限制


})();