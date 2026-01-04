// ==UserScript==
// @name         Akuvox ChanDao-Project
// @namespace    http://www.akuvox.com/
// @version      2.0
// @description  内部使用，外部无效，方便快捷创建项目
// @author       phoenixylf
// @match        http://zentao.akuvox.local/zentao/project-create.html
// @match        http://zentao.akuvox.local/zentao/testtask-create*.html
// @match        http://192.168.10.17/zentao/project-create.html
// @match        http://192.168.10.17/zentao/testtask-create*.html
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454452/Akuvox%20ChanDao-Project.user.js
// @updateURL https://update.greasyfork.org/scripts/454452/Akuvox%20ChanDao-Project.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var TSMaster = "叶林凤";
    var embMember = new Array("巫有福","蔡在添","吕传芳","唐春林","严松松","汤培毅","蓝淋辉","钟文瑞","柳兵锋","柳文艺","许跃辉","王博奕","王辉龙","李兴武","郑龙斌","叶林凤") //,"叶林凤"
    var androidMember = new Array("陈敏杰","林国勇","周明辉","王伟建","江昊","吴铠嘉","杨乃容","杨智贤","黄世泽","熊凯","陈浩楠","陈鸿儒") //,"叶林凤"
    var mobileAndroidMember = new Array("游炳坤","杨伊莎","戴佳伟","林函","罗兴富")//,"叶林凤"
    var mobileIosMember = new Array("游炳坤","许志明","温仲斌","曾华央")//,"叶林凤"

    var TYPE_EMB=0;
    var TYPE_Android=1;
    var TYPE_MOBILE_ANDROID=2;
    var TYPE_MOBILE_IOS=3;
    var TYPE_None=4;

    var embTitle = "EMB"
    var androidTitle = "Android"
    var mobileAndroidTitle = "MOBILE-ANDROID"
    var mobileIosTitle = "MOBILE-IOS"

    function getCurrentType(userName){
        if(embMember.indexOf(userName) != -1){
            return TYPE_EMB
        }

        if(androidMember.indexOf(userName) != -1){
            return TYPE_Android
        }

        if(mobileAndroidMember.indexOf(userName) != -1){
            return TYPE_MOBILE_ANDROID
        }

        if(mobileIosMember.indexOf(userName) != -1){
            return TYPE_MOBILE_IOS
        }

        //如果不在任何一个列表中，弹出提示即可
        return TYPE_None;

    }

    function getTitleString(currenType){
        if(currenType == TYPE_EMB){
            return embTitle
        }else if(currenType == TYPE_Android){
            return androidTitle
        }else if(currenType == TYPE_MOBILE_ANDROID){
            return mobileAndroidTitle
        }else if(currenType == TYPE_MOBILE_IOS){
            return mobileIosTitle
        }
        return "none"
    }


    /*库方法*/
    HTMLElement.prototype.appendHTML = function(html) {
        var divTemp = document.createElement("div"), nodes = null
            , fragment = document.createDocumentFragment();
        divTemp.innerHTML = html;
        nodes = divTemp.childNodes;
        for (var i=0, length=nodes.length; i<length; i+=1) {
            fragment.appendChild(nodes[i].cloneNode(true));
        }
        this.appendChild(fragment);
        nodes = null;
        fragment = null;
    };

    //半年 delta186 ;三个月 delta93; 两个月 delta62;一个月 delta31 ;两个礼拜 delta14

    //新硬件平台项目
    function newChipProjectFunction(currenType){
        var nameInput = document.getElementById("name")
        if(nameInput !== ""){
            nameInput.value = "TS-"+getTitleString(currenType)+"-新硬件平台项目-XXX项目"
            var endTimeHalfYearSelect = document.getElementById("delta186")
            if(endTimeHalfYearSelect !== null){
                endTimeHalfYearSelect.click()
            }

            // 自动选择“软件主管”
            autoSelectOptionByUserName(TSMaster, "softwareLeader", "softwareMaster_chosen");

            // 获取当前用户名
            var currentUser = document.getElementById("userMenu").childNodes[0].innerText.trim();
            // 自动选择“项目负责人”、“软件负责人”
            autoSelectOptionByUserName(currentUser, "softwareLeader", "softwareLeader_chosen", "projectLeader_chosen");
        }
    }

    //衍生品项目
    function derivativesProjectFunction(currenType){
        var nameInput = document.getElementById("name")
        if(nameInput !== ""){
            nameInput.value = "TS-"+getTitleString(currenType)+"-衍生品项目-XXX项目"
            var endTimeHalfYearSelect = document.getElementById("delta93")
            if(endTimeHalfYearSelect !== null){
                endTimeHalfYearSelect.click()
            }
        }

        // 自动选择“软件主管”
        autoSelectOptionByUserName(TSMaster, "softwareLeader", "softwareMaster_chosen");

        // 获取当前用户名
        var currentUser = document.getElementById("userMenu").childNodes[0].innerText.trim();
        // 自动选择“项目负责人”、“软件负责人”
        autoSelectOptionByUserName(currentUser, "softwareLeader", "softwareLeader_chosen", "projectLeader_chosen");
    }

    //大版本项目
    function bigProjectFunction(currenType){
        var nameInput = document.getElementById("name")
        if(nameInput !== ""){
            nameInput.value = "TS-"+getTitleString(currenType)+"-大版本项目-XXX项目"
            var endTimeHalfYearSelect = document.getElementById("delta93")
            if(endTimeHalfYearSelect !== null){
                endTimeHalfYearSelect.click()
            }
        }

        // 自动选择“软件主管”
        autoSelectOptionByUserName(TSMaster, "softwareLeader", "softwareMaster_chosen");

        // 获取当前用户名
        var currentUser = document.getElementById("userMenu").childNodes[0].innerText.trim();
        // 自动选择“项目负责人”、“软件负责人”
        autoSelectOptionByUserName(currentUser, "softwareLeader", "softwareLeader_chosen", "projectLeader_chosen");
    }


    //常规项目- PDM
    function normalProject_PDM_Function(currenType){
        var nameInput = document.getElementById("name")
        if(nameInput !== ""){
            nameInput.value = "TS-"+getTitleString(currenType)+"-常规任务项目-XXX(机型)-YYY(技术确认单号)-PDM项目"
            var endTimeHalfYearSelect = document.getElementById("delta14")
            if(endTimeHalfYearSelect !== null){
                endTimeHalfYearSelect.click()
            }

            // 自动选择“软件主管”
            autoSelectOptionByUserName(TSMaster, "softwareLeader", "softwareMaster_chosen");

            // 获取当前用户名
            var currentUser = document.getElementById("userMenu").childNodes[0].innerText.trim();
            // 自动选择“项目负责人”、“软件负责人”
            autoSelectOptionByUserName(currentUser, "softwareLeader", "softwareLeader_chosen", "projectLeader_chosen");
        }
    }

    //常规项目- Story
    function normalProject_Story_Function(currenType){
        var nameInput = document.getElementById("name")
        if(nameInput !== ""){
            nameInput.value = "TS-"+getTitleString(currenType)+"-常规任务项目-Story-XXX-需求项目"
            var endTimeHalfYearSelect = document.getElementById("delta14")
            if(endTimeHalfYearSelect !== null){
                endTimeHalfYearSelect.click()
            }

            // 自动选择“软件主管”
            autoSelectOptionByUserName(TSMaster, "softwareLeader", "softwareMaster_chosen");

            // 获取当前用户名
            var currentUser = document.getElementById("userMenu").childNodes[0].innerText.trim();
            // 自动选择“项目负责人”、“软件负责人”
            autoSelectOptionByUserName(currentUser, "softwareLeader", "softwareLeader_chosen", "projectLeader_chosen");
        }
    }

    /**
    * 自动匹配并设置下拉框选项（支持 Chosen 插件 UI 更新）
    * @param {string} expectedUserName  期望匹配的用户名
    * @param {string} selectElementId 原始 select 元素的 id
    * @param {...string} chosenContainerIds 对应的 chosen 容器的 id（支持一个或多个）
    */
    function autoSelectOptionByUserName(expectedUserName, selectElementId, ...chosenContainerIds) {
        if (!expectedUserName || !selectElementId) {
            console.warn("参数无效：expectedUserName 或 selectElementId 缺失");
            return;
        }

        // 获取 Select 元素和所有 chosen 容器
        const selectElement = document.getElementById(selectElementId);
        const chosenContainers = chosenContainerIds.map(id => document.getElementById(id));
        if (!selectElement) {
            console.warn(`未找到 ID 为 "${selectElementId}" 的 select 元素`);
            return;
        }

        const options = selectElement.getElementsByTagName("option");
        const normalizedUser = expectedUserName.trim().toLowerCase();
        let bestMatchOption = null;

        // 遍历所有选项，找到最接近当前用户名的选项
        for (let option of options) {
            const optionText = option.innerText.replace(/\s+/g, ' ').trim().toLowerCase();
            // 忽略大小写的完全匹配（只关心第一个匹配项）
            if (optionText.includes(normalizedUser)) {
                bestMatchOption = option;
                break;
            }
        }

        // 如果找到了最佳匹配项，选中该项
        if (bestMatchOption) {
            // 设置 select 的值
            selectElement.value = bestMatchOption.value;

            // 更新所有传入的 chosen 容器的 UI
            chosenContainers.forEach(chosen => {
                const span = chosen.querySelector(".chosen-single span");
                if (span) {
                    span.innerText = bestMatchOption.innerText;
                }
            });

            // 触发 change 事件以通知相关监听器，更新 UI
            const event = new Event('change', { bubbles: true });
            selectElement.dispatchEvent(event);

            console.log(`下拉框 ID: ${selectElementId} 已选中：${bestMatchOption.innerText}`);
        } else {
            console.warn(`下拉框 ID: ${selectElementId} 未找到匹配项：${normalizedUser}`);
        }
    }

    function initFunction(){

        var currentUser = document.getElementById("userMenu").childNodes[0].innerText
        if(currentUser !== ""){
            var currenType = getCurrentType(currentUser.trim())
            if(currenType == TYPE_None){
                alert("当前用户不支持该油猴脚本，请联系终端负责人进行添加")
                return
            }
        }


        var titleBar = document.getElementById("titlebar")
        if(titleBar !== null){

            //移动端的暂时不需要新硬件平台项目和衍生品项目
            if(currenType !== TYPE_MOBILE_ANDROID && currenType !== TYPE_MOBILE_IOS){
                var newChipProjectButton="<button id=\"newChipProjectBtn\">新硬件平台项目</button>"
                titleBar.childNodes[1].appendHTML(newChipProjectButton)
                document.getElementById('newChipProjectBtn').addEventListener('click', function (ev) {
                    newChipProjectFunction(currenType)
                })


                var derivativesProjectButton="<button id=\"derivativesProjectBtn\">衍生品项目</button>"
                titleBar.childNodes[1].appendHTML(derivativesProjectButton)
                document.getElementById('derivativesProjectBtn').addEventListener('click', function (ev) {
                    derivativesProjectFunction(currenType)
                })
            }


            var bigProjectButton="<button id=\"bigProjectBtn\">大版本项目</button>"
            titleBar.childNodes[1].appendHTML(bigProjectButton)
            document.getElementById('bigProjectBtn').addEventListener('click', function (ev) {
                bigProjectFunction(currenType)
            })

            //移动端的暂时不需要PDM相关项目
            if(currenType !== TYPE_MOBILE_ANDROID && currenType !== TYPE_MOBILE_IOS){
                var normalProject_PDM_Button="<button id=\"normalProject_PDM_Btn\">常规任务-PDM项目</button>"
                titleBar.childNodes[1].appendHTML(normalProject_PDM_Button)
                document.getElementById('normalProject_PDM_Btn').addEventListener('click', function (ev) {
                    normalProject_PDM_Function(currenType)
                })
            }


            var normalProject_Story_Button="<button id=\"normalProject_Story_Btn\">常规任务-需求项目</button>"
            titleBar.childNodes[1].appendHTML(normalProject_Story_Button)
            document.getElementById('normalProject_Story_Btn').addEventListener('click', function (ev) {
                normalProject_Story_Function(currenType)
            })


            var createProjectButton="<button id=\"createProjectBtn\" class='btn btn-primary'>创建</button>"
            titleBar.childNodes[1].appendHTML(createProjectButton)
            document.getElementById('createProjectBtn').addEventListener('click', function (ev) {
                var submitButton = document.getElementById("submit")
                if(submitButton !== null){
                    submitButton.click()
                }
            })

        }

    }


    function add_mailto_list() {
        var currentProduct = document.getElementById("product_chosen").childNodes[0].innerText
        var currentUser = document.getElementById("userMenu").childNodes[0].innerText
        if(currentUser !== ""){
            var currentType = getCurrentType(currentUser.trim())
            if(currentType == TYPE_None){
                alert("当前用户不支持该油猴脚本，请联系终端负责人进行添加")
                return
            }
        }

        var mailtoChose = document.getElementById("mailto")
        var TYPE_JIAJU = 0; // 用于判断对讲/家居
        var type_number = -1; // 用于判断抄送名单
        if(mailtoChose !== null){
            if(currentProduct.trim() == "家居云&APP"){
                TYPE_JIAJU = 1;
            }

            if(currentType == TYPE_EMB){
                type_number = 1;
            }else if(currentType == TYPE_Android){
                type_number = 2;
            }else if((currentType == TYPE_MOBILE_ANDROID | currentType == TYPE_MOBILE_IOS)&& TYPE_JIAJU == 0){
                type_number = 3;
            }else if((currentType == TYPE_MOBILE_ANDROID | currentType == TYPE_MOBILE_IOS)&& TYPE_JIAJU == 1){
                type_number = 4;
            }


            var selectedValues = [];

            switch (type_number) {
            // tpye_number=1:linfeng.ye,vicky,ella
            // emb设备端组：研发组长-叶林凤、测试组长-黄婉容、产品-孔梦如
            // tpye_number=2:minjie.chen,vicky,ella
            // Android设备端组：研发组长-陈敏杰、测试组长-黄婉容、产品-孔梦如
            // tpye_number=3:bingkun.you,comiy.chen,bella
            // 对讲app组：研发组长-游炳坤、对讲测试组长-陈莹；产品-洪雪婷
            // tpye_number=4:bingkun.you,vivian.zhang,Twist
            // 家居app组：研发组长-游炳坤、家居测试组长-张焕男；产品-庄煌焕
                case 1:
                    selectedValues = ['linfeng.ye', 'vicky', 'ella'];
                    break;
                case 2:
                    selectedValues = ['linfeng.ye','minjie.chen', 'vicky', 'ella'];
                    break;
                case 3:
                    selectedValues = ['linfeng.ye','bingkun.you', 'comiy.chen', 'bella'];
                    break;
                case 4:
                    selectedValues = ['linfeng.ye','bingkun.you', 'vivian.zhang', 'Twist'];
                    break;
                default:
                    selectedValues = [];
                    break;
            }

            var leadMenber = new Array("叶林凤","游炳坤","陈敏杰")
            if(leadMenber.indexOf(currentUser.trim()) != -1){
                selectedValues.shift();
            }

            // console.log(selectedValues);
            var options = mailtoChose.options;


            for (var j = 0; j < options.length; j++) {
            options[j].selected = false;
            }

            for (var i = 0; i < options.length; i++) {
                if (selectedValues.includes(options[i].value)) {
                     options[i].selected = true;
                }
            }


            $(mailtoChose).trigger('chosen:updated');



        }
    }


    function chose_Function_BeseOn_URL(){
        const currentUrl = window.location.href;
        if (currentUrl.includes('project-create')) {
            initFunction();
        } else if (currentUrl.includes('testtask-create')) {
            add_mailto_list();
        }

    }


    chose_Function_BeseOn_URL()

})();