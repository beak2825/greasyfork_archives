// ==UserScript==
// @name         禅道 项目 分组
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  为项目设置分组
// @author       tindoc
// @license      MIT
// @match        http://*/zentao/*.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436725/%E7%A6%85%E9%81%93%20%E9%A1%B9%E7%9B%AE%20%E5%88%86%E7%BB%84.user.js
// @updateURL https://update.greasyfork.org/scripts/436725/%E7%A6%85%E9%81%93%20%E9%A1%B9%E7%9B%AE%20%E5%88%86%E7%BB%84.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const firstLevelNavTab = '项目';
    const groupInfo = {
        "defaultGroupName": "默认",
        "groups":[
            {
                "groupName": "分组1",
                "projNameList": ["产品1", "产品2"]
            },
            {
                "groupName": "分组2",
                "projNameList": ["产品3", "产品4"]
            }
        ]
    }

    // 点击下拉框才会加载所有菜单项
    document.querySelector('#currentItem').click();
    document.querySelector('#currentItem').click();

    let fun = () => {
        const menuList = document.querySelectorAll('#defaultMenu li');

        const defaultGroupLiElemList = []; // 默认分组的 li 元素

        // 分组
        menuList.forEach(function(currentValue, currentIndex, listObj) {
            // 隐藏默认的分组标签
            if (currentValue.getAttribute("class") === 'heading') {
                currentValue.style.display = 'none';
            }

            const projName = currentValue.querySelector('a')? currentValue.querySelector('a').text.replace (/\s+/g, ''): '';
            let isGroup = false;
            groupInfo.groups.forEach(function(item, index, array) {
                if (item.projNameList.includes(projName)) {
                    isGroup = true;
                    if (item.elemList === undefined) {
                        item.elemList = []
                    }
                    item.elemList.push(currentValue);
                }
            })

            if (!isGroup) {
                defaultGroupLiElemList.push(currentValue);
            }
        })

        // 重排
        let newLiList = [];
        groupInfo.groups.forEach(function(item, index, array) {
            // 添加组标签
            newLiList.push(genGroupTabElem(item.groupName))
            // 添加项目组下的项目
            newLiList = [...newLiList, ...item.elemList]
        })
        newLiList.push(genGroupTabElem(groupInfo.defaultGroupName))
        newLiList = [...newLiList, ...defaultGroupLiElemList];

        // 写入
        const ulElem = document.querySelector('#defaultMenu > ul');
        for (const index in newLiList) {
            ulElem.appendChild(newLiList[index]);
        }
    }

    const currentFirstLevelNavTabName = document.querySelector('#mainmenu > ul .active a').innerText
    if (firstLevelNavTab.includes(currentFirstLevelNavTabName)) {
        sleep(fun, 500); // 无定时可能取不到所有目录
    }
})();

function sleep(fun,time){
    setTimeout(
        ()=>{ fun(); },
        time
    );
}

function genGroupTabElem(tabName) {
    const groupTabElem = document.createElement('li');
    groupTabElem.setAttribute('class', 'heading');
    groupTabElem.innerText = tabName;

    return groupTabElem;
}