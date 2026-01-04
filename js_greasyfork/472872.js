// ==UserScript==
// @name         Akuvox ChanDao-Project Bink-Test
// @namespace    http://www.akuvox.com/
// @version      0.2
// @description  内部使用，外部无效，方便快捷创建项目
// @author       Bink
// @match        http://192.168.10.27:81/zentao/project-create.html
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472872/Akuvox%20ChanDao-Project%20Bink-Test.user.js
// @updateURL https://update.greasyfork.org/scripts/472872/Akuvox%20ChanDao-Project%20Bink-Test.meta.js
// ==/UserScript==
 
 
(function() {
    'use strict';
 
    var embMember = new Array("张明发","巫有福","蔡在添","吕传芳","唐春林","严松松","汤培毅") //,"叶林凤"
    var androidMember = new Array("陈敏杰","乐忠豪","林国勇","周明辉","王伟建","江昊","吴铠嘉","杨乃容") //,"叶林凤"
    var mobileAndroidMember = new Array("游炳坤","杨伊莎","戴佳伟","叶林凤")
    var mobileIosMember = new Array("游炳坤","许志明","温仲斌","曾华央","叶林凤")
 
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
 
    initFunction()
 
})();