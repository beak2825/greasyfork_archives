// ==UserScript==
// @name         GitLab设置自动化操作
// @namespace    http://tampermonkey.net/
// @version      2024-09-24
// @description  支持自动操作分支保护功能
// @author       Chens
// @match        http://*/*-/settings/repository*
// @icon         http://*/assets/favicon-7901bd695fb93edb07975966062049829afb56cf11511236e61bcf425070e36e.png
// @grant        none
// @license      private
// @downloadURL https://update.greasyfork.org/scripts/488516/GitLab%E8%AE%BE%E7%BD%AE%E8%87%AA%E5%8A%A8%E5%8C%96%E6%93%8D%E4%BD%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/488516/GitLab%E8%AE%BE%E7%BD%AE%E8%87%AA%E5%8A%A8%E5%8C%96%E6%93%8D%E4%BD%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 模拟操作参考 https://www.cnblogs.com/sq800/p/17316806.html

    // 模拟输入事件
    let inputEvent = new Event('input', { bubbles: true });

    // 模拟点击事件
    const clickEvent = new Event('click', { bubbles: true });

    // 设置Id
    const settingsId_ProtectedBranches = 'js-protected-branches-settings';

    // 展开某一个设置节点
    function expandSettings(settingsId){
        let settingsSection= document.getElementById(settingsId);
        if(!settingsSection.classList.contains('expanded')){
            // console.log('未展开设置节点');
            settingsSection.firstElementChild.children.forEach(item=>{
                if(item.type=='button'){
                    // console.log("找到按钮",item);
                    item.click();// 触发点击事件
                }
            });
        }
    }

    function sleep(delay) {
        var start = (new Date()).getTime();
        while ((new Date()).getTime() - start < delay) {
            continue;
        }
    }

    /**
    * 临时屏蔽confirm提示
    * @param branchName 保护的分支名称
    */
    function shieldConfirm(func,returnValue){
        returnValue = returnValue || false;

        if(func && typeof func === 'function'){

            var oldConfirm=window.confirm;

            window.confirm = function(msg){
                console.log("临时屏蔽window.confirm 提示，直接返回"+returnValue);
                console.log("临时屏蔽confirm提示内容："+msg);
                return true;
            };

            // 执行外部方法
            func();

            window.confirm = oldConfirm;
        }
    }

    /**
    * 移除分支保护
    * @param branchName 保护的分支名称
    */
    function removeProtectedBranches(branchName){
        // 切换到保护分支设置
        expandSettings(settingsId_ProtectedBranches);

        // 判断是否设置了分支保护
        let protectedNodes = document.querySelectorAll("#js-protected-branches-settings > div.settings-content > div > table > tbody > tr > td:nth-child(1) > span");

        shieldConfirm(()=>{
            for(let i = 0 ;i<protectedNodes.length;i++){
                if(protectedNodes[i].innerText == branchName){

                    protectedNodes[i].parentNode.parentNode.parentNode.querySelector('tr:nth-child(4) > td:nth-child(4) > a').dispatchEvent(clickEvent);

                    console.log("当前分支【",branchName,"】保护设置已移除");
                    return;
                }
            }
        },true);

    }

    /**
    * 判定是否存在分支保护
    * @param branchName 保护的分支名称
    * @return 存在则返回查到的节点，不存在则返回false
    */
    function existsProtectedBranches(branchName){
        // 切换到保护分支设置
        expandSettings(settingsId_ProtectedBranches);

        // 判断是否设置了分支保护
        let protectedNodes = document.querySelectorAll("#js-protected-branches-settings > div.settings-content > div > table > tbody > tr > td:nth-child(1) > span");

        for(let i = 0 ;i < protectedNodes.length;i++){
            if(protectedNodes[i].innerText == branchName){
                console.log("当前分支【",branchName,"】已保护");
                return protectedNodes[i].parentNode.parentNode;
            }
        }
        return false;
    }

    /**
    * 添加保护分支信息
    * @param branchName 保护的分支名称
    * @param permissions1 合并权限,默认值为No one
    *        Maintainers
    *        Developers + Maintainers
    *        No one
    * @param permissions2 推送权限,默认值为No one
    *        Maintainers
    *        Developers + Maintainers
    *        No one
    */
    function addProtectedBranches(branchName,permissions1,permissions2){
        permissions1 = permissions1 || 'No one';
        permissions2 = permissions2 || 'No one';

        // 保护分支设置
        expandSettings(settingsId_ProtectedBranches);

        // 判定是已经设置了分支保护
        let existsNode=existsProtectedBranches(branchName);
        if(existsNode){
            // TODO 这里的操作现目前是使用先移除，再添加，建议调整为直接修改
            // 修改保护权限
            console.log("修改保护权限");

            // 合并权限
            let value1=existsNode.querySelector('td:nth-child(2) > input').value;
            // 推送权限
            let value2=existsNode.querySelector('td:nth-child(3) > input').value;

            // 判定权限是否一致
            if((value1=='40' && permissions1 =='Maintainers'
               || value1=='30' && permissions1 =='Developers + Maintainers'
               || value1=='0' && permissions1 =='No one')
              && (
                value2=='40' && permissions2 =='Maintainers'
               || value2=='30' && permissions2 =='Developers + Maintainers'
               || value2=='0' && permissions2 =='No one'
              )){
                // 匹配
                console.log("保护权限已被设置，不需要再次设置");
                return ;
            }else{
                // 移除分支保护
                shieldConfirm(()=>{
                    existsNode.parentNode.querySelector('tr:nth-child(4) > td:nth-child(4) > a').dispatchEvent(clickEvent);
                },true);

                return;
            }
        }

        // 点击分支
        document.querySelector("#new_protected_branch > div > div.card-body > div:nth-child(1) > div.col-md-10 > div.dropdown > button > span").dispatchEvent(clickEvent);

        // 输入分支名称
        let input = document.querySelector("#new_protected_branch > div > div.card-body > div:nth-child(1) > div.col-md-10 > div.dropdown.show > div > div.dropdown-input > input");
        input.value=branchName;
        input.dispatchEvent(inputEvent);

        // 选中
        let bottun = document.querySelector("#new_protected_branch > div > div.card-body > div:nth-child(1) > div.col-md-10 > div.dropdown.show > div > div.dropdown-footer > ul > li > button");
        bottun.dispatchEvent(clickEvent);

        // 设置合并权限
        // 触发权限下拉框
        document.querySelector("#new_protected_branch > div > div.card-body > div:nth-child(2) > div > div > div > button").dispatchEvent(clickEvent);
        if(permissions1=='Maintainers'){
            // 选中合并权限 Maintainers
            document.querySelector("#new_protected_branch > div > div.card-body > div:nth-child(2) > div > div > div > div > div.dropdown-content > ul > li:nth-child(2) > a").dispatchEvent(clickEvent);
        }else if (permissions1=='Developers + Maintainers'){
            // 选中合并权限 Developers + Maintainers
            document.querySelector("#new_protected_branch > div > div.card-body > div:nth-child(2) > div > div > div > div > div.dropdown-content > ul > li:nth-child(3) > a").dispatchEvent(clickEvent);
        }else{
            // 选中合并权限 No one
            document.querySelector("#new_protected_branch > div > div.card-body > div:nth-child(2) > div > div > div > div > div.dropdown-content > ul > li:nth-child(4) > a").dispatchEvent(clickEvent);
        }

        // 设置推送权限
        // 触发权限下拉框
        document.querySelector("#new_protected_branch > div > div.card-body > div:nth-child(3) > div > div > div > button").dispatchEvent(clickEvent);
        if(permissions2=='Maintainers'){
            // 选中合并权限 Maintainers
            document.querySelector("#new_protected_branch > div > div.card-body > div:nth-child(3) > div > div > div > div > div.dropdown-content > ul > li:nth-child(2) > a").dispatchEvent(clickEvent);
        }else if (permissions2=='Developers + Maintainers'){
            // 选中合并权限 Developers + Maintainers
            document.querySelector("#new_protected_branch > div > div.card-body > div:nth-child(3) > div > div > div > div > div.dropdown-content > ul > li:nth-child(3) > a").dispatchEvent(clickEvent);
        }else{
            // 选中合并权限 No one
            document.querySelector("#new_protected_branch > div > div.card-body > div:nth-child(3) > div > div > div > div > div.dropdown-content > ul > li:nth-child(4) > a").dispatchEvent(clickEvent);
        }

        // 提交保护配置（这个根据情况，看是不是自动触发提交）
        document.querySelector("#new_protected_branch").submit();
    }

    window.onload=()=>{
        console.log('执行保护分支设置-开始');

        // 1.添加分支权限
        // Maintainers
        // Developers + Maintainers
        // No one
        //addProtectedBranches('v2.2.0','Maintainers','Developers + Maintainers');

        // 2.移除分支权限
        removeProtectedBranches('v2.2.0');

        console.log('执行保护分支设置-结束');
    };

})();