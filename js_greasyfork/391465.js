// ==UserScript==
// @name         teambition加强版
// @namespace    http://tampermonkey.net/
// @version      0.3.3
// @description  try to take over the world!
// @author       You
// @match        https://www.teambition.com/*
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @require      https://unpkg.com/ajax-hook/dist/ajaxhook.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391465/teambition%E5%8A%A0%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/391465/teambition%E5%8A%A0%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //配置各个项目的导出字段
    var exprotConfigureMap =
        {
             //敏捷开发2020
            '5c2c5911ce85ea0018ee2b8b':[{"id":"content","isDefault":true,"name":"标题"},{"id":"id","isDefault":false,"name":"任务ID"},{"id":"project","isDefault":true,"name":"项目"},{"id":"list","isDefault":false,"name":"分组"},{"id":"stage","isDefault":false,"name":"列表"},{"id":"5c2c5aff4bf3920001abfed7","name":"开发人员","description":"2019敏捷开发，请勿多选，如有多人拆分子任务","type":"lookup","subtype":null,"isDefault":false},{"id":"5a94c4a7bdc300085f451e6a","name":"开发工时","description":"计划该任务投入开发的时间","type":"number","subtype":null,"isDefault":false},{"id":"5a94c3f1310fc42809888ef2","name":"开发交付时间","description":"计划开发可交付至给测试时间","type":"date","subtype":null,"isDefault":false},{"id":"5c2c5b1b4bf3920001ac0025","name":"测试人员","description":"2019敏捷开发项目测试人员","type":"lookup","subtype":null,"isDefault":false},{"id":"5a94c47409d5910a024c51dc","name":"测试工时","description":"计划投入该任务的测试时间","type":"number","subtype":null,"isDefault":false},{"id":"5a94c416611d9e01c41b4831","name":"测试交付时间","description":"计划的测试完成待上线的时间点","type":"date","subtype":null,"isDefault":false},{"id":"5af16313bf7ef90018fb5d1c","name":"任务级别","description":"","type":"dropDown","subtype":null,"isDefault":false},{"id":"5a9cdeb528e8bf03e3ff3d62","name":"投产注意","description":"投产注意事项","type":"text","subtype":null,"isDefault":false},{"id":"5a97e6c84d14801681c76b19","name":"服务端应用","description":"涉及到的服务端应用","type":"multipleChoice","subtype":null,"isDefault":false},{"id":"note","isDefault":false,"name":"备注"},{"id":"tag","isDefault":false,"name":"标签"},{"id":"startDate","isDefault":true,"name":"开始时间"},{"id":"dueDate","isDefault":true,"name":"截止时间"},{"id":"created","isDefault":true,"name":"创建时间"},{"id":"updated","isDefault":true,"name":"更新时间"},{"id":"accomplished","isDefault":true,"name":"完成时间"},{"id":"isDone","isDefault":true,"name":"是否完成"},{"id":"executor","isDefault":false,"name":"执行者"},{"id":"creator","isDefault":false,"name":"创建者"},{"id":"isArchived","isDefault":false,"name":"是否在回收站中"},{"id":"isSubtask","isDefault":false,"name":"是否是子任务"}],
            //产品排期
            '5963799a7f5e620197877f56':[{"id":"content","isDefault":true,"name":"标题"},{"id":"id","isDefault":false,"name":"任务ID"},{"id":"startDate","isDefault":true,"name":"开始时间"},{"id":"dueDate","isDefault":true,"name":"截止时间"},{"id":"created","isDefault":true,"name":"创建时间"},{"id":"updated","isDefault":true,"name":"更新时间"},{"id":"accomplished","isDefault":true,"name":"完成时间"},{"id":"isDone","isDefault":true,"name":"是否完成"},{"id":"list","isDefault":false,"name":"分组"},{"id":"stage","isDefault":false,"name":"列表"},{"id":"59fa8b3e687d282134e1a987","name":"系统","description":"","type":"multipleChoice","subtype":null,"isDefault":false},{"id":"5c46d9d2a4b8ac0001bae821","name":"端口","description":"","type":"multipleChoice","subtype":null,"isDefault":false},{"id":"priority","isDefault":false,"name":"优先级"},{"id":"note","isDefault":false,"name":"备注"},{"id":"isArchived","isDefault":false,"name":"是否在回收站中"},{"id":"isSubtask","isDefault":false,"name":"是否是子任务"},{"id":"tag","isDefault":false,"name":"标签"},{"id":"596739f15897a576683e4025","name":"系统","description":"产品排期任务归属系统","type":"multipleChoice","subtype":null,"isDefault":false},{"id":"59673a0556ac75768e33f1d7","name":"终端","description":"产品排期任务归属终端","type":"multipleChoice","subtype":null,"isDefault":false},{"id":"5af16313bf7ef90018fb5d1c","name":"任务级别","description":"","type":"dropDown","subtype":null,"isDefault":false},{"id":"5bdd653c423bde000143201b","name":"技术执行人","description":"产品排期任务技术执行人","type":"lookup","subtype":null,"isDefault":false},{"id":"5cb579d9ab018c0001fa5357","name":"开发进度","description":"产品排期任务开发进度","type":"dropDown","subtype":null,"isDefault":false},{"id":"5bdfb1803b995900015148eb","name":"产品设计负责人","description":"产品排期任务设计负责人","type":"lookup","subtype":null,"isDefault":false},{"id":"5cc02fbee14aa000012e33d2","name":"产品排期时间","description":"","type":"dropDown","subtype":null,"isDefault":false},{"id":"5bdfb1b1423bde000143e112","name":"运营客服负责人","description":"","type":"lookup","subtype":null,"isDefault":false},{"id":"5c1358775cba1c0001f59810","name":"运营推广时间","description":"","type":"date","subtype":null,"isDefault":false},{"id":"5cb97d1f2a416c0001a8850e","name":"产品培训会","description":"","type":"text","subtype":null,"isDefault":false},{"id":"5cb97d98e14aa0000105c06e","name":"帮助文档","description":"","type":"dropDown","subtype":null,"isDefault":false},{"id":"5cb97e88e817400001a50241","name":"终端上线情况","description":"","type":"text","subtype":null,"isDefault":false},{"id":"5cbf22ce2a416c0001c93ffb","name":"进展说明","description":"","type":"text","subtype":null,"isDefault":false}],
            //历史归档-敏捷开发2019
            '5c35d7120f9929001858c600':[{"id":"content","isDefault":true,"name":"标题"},{"id":"id","isDefault":false,"name":"任务ID"},{"id":"project","isDefault":true,"name":"项目"},{"id":"list","isDefault":false,"name":"分组"},{"id":"stage","isDefault":false,"name":"列表"},{"id":"5c2c5aff4bf3920001abfed7","name":"开发人员","description":"2019敏捷开发，请勿多选，如有多人拆分子任务","type":"lookup","subtype":null,"isDefault":false},{"id":"5a94c4a7bdc300085f451e6a","name":"开发工时","description":"计划该任务投入开发的时间","type":"number","subtype":null,"isDefault":false},{"id":"5a94c3f1310fc42809888ef2","name":"开发交付时间","description":"计划开发可交付至给测试时间","type":"date","subtype":null,"isDefault":false},{"id":"5c2c5b1b4bf3920001ac0025","name":"测试人员","description":"2019敏捷开发项目测试人员","type":"lookup","subtype":null,"isDefault":false},{"id":"5a94c47409d5910a024c51dc","name":"测试工时","description":"计划投入该任务的测试时间","type":"number","subtype":null,"isDefault":false},{"id":"5a94c416611d9e01c41b4831","name":"测试交付时间","description":"计划的测试完成待上线的时间点","type":"date","subtype":null,"isDefault":false},{"id":"5af16313bf7ef90018fb5d1c","name":"任务级别","description":"","type":"dropDown","subtype":null,"isDefault":false},{"id":"5a9cdeb528e8bf03e3ff3d62","name":"投产注意","description":"投产注意事项","type":"text","subtype":null,"isDefault":false},{"id":"5a97e6c84d14801681c76b19","name":"服务端应用","description":"涉及到的服务端应用","type":"multipleChoice","subtype":null,"isDefault":false},{"id":"note","isDefault":false,"name":"备注"},{"id":"tag","isDefault":false,"name":"标签"},{"id":"startDate","isDefault":true,"name":"开始时间"},{"id":"dueDate","isDefault":true,"name":"截止时间"},{"id":"created","isDefault":true,"name":"创建时间"},{"id":"updated","isDefault":true,"name":"更新时间"},{"id":"accomplished","isDefault":true,"name":"完成时间"},{"id":"isDone","isDefault":true,"name":"是否完成"},{"id":"executor","isDefault":false,"name":"执行者"},{"id":"creator","isDefault":false,"name":"创建者"},{"id":"isArchived","isDefault":false,"name":"是否在回收站中"},{"id":"isSubtask","isDefault":false,"name":"是否是子任务"}],
            //用户反馈
            '59eaba4cffa62d48481b4f5b':[{"id":"content","isDefault":true,"name":"标题"},{"id":"id","isDefault":false,"name":"任务ID"},{"id":"project","isDefault":true,"name":"项目"},{"id":"startDate","isDefault":true,"name":"开始时间"},{"id":"dueDate","isDefault":true,"name":"截止时间"},{"id":"created","isDefault":true,"name":"创建时间"},{"id":"updated","isDefault":true,"name":"更新时间"},{"id":"accomplished","isDefault":true,"name":"完成时间"},{"id":"isDone","isDefault":true,"name":"是否完成"},{"id":"list","isDefault":false,"name":"分组"},{"id":"stage","isDefault":false,"name":"列表"},{"id":"59fa8b3e687d282134e1a987","name":"系统","description":"","type":"multipleChoice","subtype":null,"isDefault":false},{"id":"5c46d9d2a4b8ac0001bae821","name":"端口","description":"","type":"multipleChoice","subtype":null,"isDefault":false},{"id":"priority","isDefault":false,"name":"优先级"},{"id":"note","isDefault":false,"name":"备注"},{"id":"5b0ba9b7820fa80018da3a59","name":"BUG开发责任人","description":"对于严重BUG由哪次版本及开发人员导致","type":"text","subtype":null,"isDefault":false},{"id":"5b0baa43c55b140019c1e8d9","name":"负责开发人员","description":"","type":"text","subtype":null,"isDefault":false},{"id":"5b0ba798ac2e2200192a4651","name":"BUG级别","description":"","type":"dropDown","subtype":null,"isDefault":false},{"id":"5c9b15c1159487000196a2d7","name":"用户微信/QQ","description":"","type":"text","subtype":null,"isDefault":false},{"id":"59eabaeebe2a77099d6d8303","name":"联系手机号（微信）","description":"","type":"text","subtype":null,"isDefault":false},{"id":"59eabab6fd91cc5a155e7ce8","name":"注册手机号","description":"如果无，则写【无】","type":"text","subtype":null,"isDefault":false},{"id":"59eabbcb73959d15884bb70f","name":"负责客服名称","description":"写联系渠道，比如写丝妹微信，不要写黄美眉","type":"text","subtype":null,"isDefault":false},{"id":"5a9403f001727d1fecb28664","name":"风险提醒","description":"风险提醒事项","type":"text","subtype":null,"isDefault":false},{"id":"5bc6d63a917b8900011f5fe6","name":"归类","description":"","type":"text","subtype":null,"isDefault":false},{"id":"5cbdac3cab018c00012f2b35","name":"处理结果备注","description":"","type":"text","subtype":null,"isDefault":false},{"id":"5cd3f0b9cefa9000018bf77e","name":"是否总结","description":"","type":"dropDown","subtype":null,"isDefault":false},{"id":"isInArchivedProject","isDefault":false,"name":"是否在回收站项目中"},{"id":"executor","isDefault":false,"name":"执行者"},{"id":"isArchived","isDefault":false,"name":"是否在回收站中"},{"id":"isSubtask","isDefault":false,"name":"是否是子任务"}],
            //历史归档-敏捷开发2020
            '5e1c0a899bf177002128d975':[{"id":"content","isDefault":true,"name":"标题"},{"id":"id","isDefault":false,"name":"任务ID"},{"id":"project","isDefault":true,"name":"项目"},{"id":"list","isDefault":false,"name":"分组"},{"id":"stage","isDefault":false,"name":"列表"},{"id":"5c2c5aff4bf3920001abfed7","name":"开发人员","description":"2019敏捷开发，请勿多选，如有多人拆分子任务","type":"lookup","subtype":null,"isDefault":false},{"id":"5a94c4a7bdc300085f451e6a","name":"开发工时","description":"计划该任务投入开发的时间","type":"number","subtype":null,"isDefault":false},{"id":"5a94c3f1310fc42809888ef2","name":"开发交付时间","description":"计划开发可交付至给测试时间","type":"date","subtype":null,"isDefault":false},{"id":"5c2c5b1b4bf3920001ac0025","name":"测试人员","description":"2019敏捷开发项目测试人员","type":"lookup","subtype":null,"isDefault":false},{"id":"5a94c47409d5910a024c51dc","name":"测试工时","description":"计划投入该任务的测试时间","type":"number","subtype":null,"isDefault":false},{"id":"5a94c416611d9e01c41b4831","name":"测试交付时间","description":"计划的测试完成待上线的时间点","type":"date","subtype":null,"isDefault":false},{"id":"5af16313bf7ef90018fb5d1c","name":"任务级别","description":"","type":"dropDown","subtype":null,"isDefault":false},{"id":"5a9cdeb528e8bf03e3ff3d62","name":"投产注意","description":"投产注意事项","type":"text","subtype":null,"isDefault":false},{"id":"5a97e6c84d14801681c76b19","name":"服务端应用","description":"涉及到的服务端应用","type":"multipleChoice","subtype":null,"isDefault":false},{"id":"note","isDefault":false,"name":"备注"},{"id":"tag","isDefault":false,"name":"标签"},{"id":"startDate","isDefault":true,"name":"开始时间"},{"id":"dueDate","isDefault":true,"name":"截止时间"},{"id":"created","isDefault":true,"name":"创建时间"},{"id":"updated","isDefault":true,"name":"更新时间"},{"id":"accomplished","isDefault":true,"name":"完成时间"},{"id":"isDone","isDefault":true,"name":"是否完成"},{"id":"executor","isDefault":false,"name":"执行者"},{"id":"creator","isDefault":false,"name":"创建者"},{"id":"isArchived","isDefault":false,"name":"是否在回收站中"},{"id":"isSubtask","isDefault":false,"name":"是否是子任务"}]

        };
    var projectId = '';
    if(location.href.indexOf('/project/5c2c5911ce85ea0018ee2b8b') != -1){
        projectId = '5c2c5911ce85ea0018ee2b8b';
    }else if(location.href.indexOf('/project/5963799a7f5e620197877f56') != -1){
        projectId = '5963799a7f5e620197877f56';
    }else if(location.href.indexOf('/project/5c35d7120f9929001858c600') != -1){
        projectId = '5c35d7120f9929001858c600';
    }else if(location.href.indexOf('/project/59eaba4cffa62d48481b4f5b') != -1){
        projectId = '59eaba4cffa62d48481b4f5b';
    }else if(location.href.indexOf('/project/5e1c0a899bf177002128d975') != -1){
        projectId = '5e1c0a899bf177002128d975';
    }

    var newButton = document.createElement("input");
    newButton.value=" 导出 ";
    newButton.className="btn btn-primary btn-block ";
    newButton.type='button';
    newButton.style='padding: 0 12px 0 12px;margin: 12px 0 12px 0;';
    newButton.onclick=function (){
        new Promise(function(resolve) {
            $('body > div.dropdown__u1N0.slide-enter-done > div > ul > li:nth-child(2)').click();
            resolve()
        }).then(function(resolve) {
            setTimeout(function() {
                $('body > div:nth-child(43) > div > div.modal__3Uhp-wrap > div > div.modal__3Uhp-content > div.modal__3Uhp-body > div > div > div.radio-group__3wAi.export-radio-group__2Pgy > div:nth-child(2)').click();
            }, 200)
        }).then(function(resolve) {
            setTimeout(function() {
                $('body > div:nth-child(44) > div > div.modal__3Uhp-wrap > div > div.modal__3Uhp-content > div.modal__3Uhp-body > div > div > div.tab-confirm-wrap > button').click();
            }, 200)
        });

    };
	
    function appendExportBtn() {
        setTimeout(function(){
            if ($('#tb-navigation-customEntrance').length > 0) {
                $('#tb-navigation-customEntrance').append(newButton);
            } else {
                appendExportBtn();
            }
        },1000);
    }
    //添加导出快捷按钮
    //appendExportBtn();


		//设置各个项目的导出字段
		function setExportColumns(){
		    if(location.href.indexOf('/project/5c2c5911ce85ea0018ee2b8b') != -1){
            projectId = '5c2c5911ce85ea0018ee2b8b';
        }else if(location.href.indexOf('/project/5963799a7f5e620197877f56') != -1){
            projectId = '5963799a7f5e620197877f56';
        }else if(location.href.indexOf('/project/5c35d7120f9929001858c600') != -1){
            projectId = '5c35d7120f9929001858c600';
        }else if(location.href.indexOf('/project/59eaba4cffa62d48481b4f5b') != -1){
            projectId = '59eaba4cffa62d48481b4f5b';
        }
        for (var k in localStorage) { if (k.indexOf('export') != -1 && k.indexOf(projectId) != -1 ) { localStorage.setItem(k, JSON.stringify(exprotConfigureMap[projectId])); } }
     }
     
     setExportColumns();    


    //升级为企业专业版
    function tryParseJson2(v,xhr){
        if(xhr.responseURL.indexOf('/api/v2/organizations') != -1 || xhr.responseURL.indexOf('/api/projects') != -1){
            if(typeof(v) == 'string'){
            v = v.replace(RegExp('"payType":"org"', "g"),'"payType":"org:2"');
            v = v.replace(RegExp('"payType":"org:1"', "g"),'"payType":"org:2"');
            v = v.replace(RegExp('"trialType":"org"', "g"),'"trialType":"org:2"');
            v = v.replace(RegExp('"trialType":"org:1"', "g"),'"trialType":"org:2"');
            // console.log(v);
          }

        }
        return v;
    }
    hookAjax({
        //因为无法确定上层使用的是responseText还是respons属性，为了保险起见，两个属性都拦截一下
        responseText: {
            getter: tryParseJson2
        },
        response: {
            getter:tryParseJson2
        }}
            );
})();