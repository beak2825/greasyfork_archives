// ==UserScript==
// @name         游戏更新辅助脚本
// @namespace    game_update_script
// @version      0.2
// @description  一键选中需要维护的服，一键pull+copy，一键reload，一键开服
// @author       lzhou926
// @match        http://xundao.xmw520.com/jenkins/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412948/%E6%B8%B8%E6%88%8F%E6%9B%B4%E6%96%B0%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/412948/%E6%B8%B8%E6%88%8F%E6%9B%B4%E6%96%B0%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (document.getElementById('projectstatus') === null) {
        return false;
    }
    // var checkedSvrText = document.querySelector('#projectstatus-tabBar .tabBar>.active>a').textContent;
    // var svrTxtArr = ['微信一区', '手趣', '游路', '漫布正式服', '生产服维护', '生产服解除维护', '石器ios正式服'];
    // if (svrTxtArr.indexOf(checkedSvrText) === -1) {
    //     return false;
    // }
    document.styleSheets[0].insertRule('.myTopBox {position:fixed;z-index:999999;background-color:#ccc;top:10px;left:30%;display:flex;justify-content:center;}')
    document.styleSheets[0].insertRule('.myButtonItem {border:1px solid #fff;font-size:14px;width:90px;height:40px;line-height:40px;background-color:#25AE84;cursor:pointer;text-align:center}')

    var topBox = document.createElement('div');
    topBox.className = 'myTopBox';
    // topBox.style.cssText = "position:fixed;z-index:999999;background-color:#ccc;top:10px;left:30%;display:flex;justify-content:center;";
    topBox.innerHTML = "<div id='myCheckAll' class='myButtonItem'>ALL</div>"+
        "<div id='myPullCopy' class='myButtonItem'>PULL+COPY</div>"+
        "<div id='myReload' class='myButtonItem'>RELOAD</div>"+
        "<div id='myBuild' class='myButtonItem'>BUILD</div>";
    document.body.appendChild(topBox);
    // document.getElementsByClassName('myButtonItem').style.cssText = "border:1px solid #fff;font-size:12px;width:90px;height:40px;color:#FFF;background-color:#25AE84;cursor:pointer;";

    var projectTable = document.querySelector('#projectstatus>tbody');
    var projectCnt = projectTable.childElementCount;
    for (var i = 0; i < projectCnt; i++) {
        if (i === 0) {
            var checkBoxNodeTh = document.createElement('th');
            projectTable.children[i].prepend(checkBoxNodeTh);
        } else {
            var _text = projectTable.children[i].children[2].textContent;
            var checkBoxNodeTd = document.createElement('td');
            if (_text.indexOf('评审服') === -1 && _text.indexOf('发行服') === -1) {
                checkBoxNodeTd.innerHTML = "<input type='checkbox' />";
            }
            projectTable.children[i].prepend(checkBoxNodeTd);
        }
    }

    document.getElementById('myCheckAll').addEventListener('click', function () {
        for (var i = 0; i < projectCnt; i++) {
            if (projectTable.children[i].querySelector("input[type='checkbox']") === null) {
                continue;
            }
            projectTable.children[i].querySelector("input[type='checkbox']").checked = true;
        }
    });
    document.getElementById('myPullCopy').addEventListener('click', function () {
        for (var i = 0; i < projectCnt; i++) {
            if (projectTable.children[i].querySelector("input[type='checkbox']") === null) {
                continue;
            }
            var _text = projectTable.children[i].children[3].textContent;
            if (_text.indexOf('pull+copy') !== -1) {
                projectTable.children[i].querySelector("input[type='checkbox']").checked = true;
            } else {
                projectTable.children[i].querySelector("input[type='checkbox']").checked = false;
            }
        }
    });
    document.getElementById('myReload').addEventListener('click', function () {
        for (var i = 0; i < projectCnt; i++) {
            if (projectTable.children[i].querySelector("input[type='checkbox']") === null) {
                continue;
            }
            var _text = projectTable.children[i].children[3].textContent;
            if (_text.indexOf('reload') !== -1) {
                projectTable.children[i].querySelector("input[type='checkbox']").checked = true;
            } else {
                projectTable.children[i].querySelector("input[type='checkbox']").checked = false;
            }
        }
    });
    document.getElementById('myBuild').addEventListener('click', function () {
        var checkedLen = projectTable.querySelectorAll("input[type='checkbox']:checked").length;
        if (!confirm('已选中 ' + checkedLen + ' 个，确定BUILD？')) {
            return false;
        }
        var successCnt = 0;
        for (var i = 0; i < projectCnt; i++) {
            var checkBox = projectTable.children[i].querySelector("input[type='checkbox']");
            if (checkBox === null || !checkBox.checked) {
                continue;
            }
            projectTable.children[i].children[7].querySelector('a>img').click();
            successCnt++;
        }
        alert('执行BUILD ' + successCnt + '个');
    });
})();