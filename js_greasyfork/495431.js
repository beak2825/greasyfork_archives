/*
 * ============================================================================== *
 ****************************** 神奇代码岛PRO-辅助瞄准 Lv3 ******************************
 ****************************** 2024.6.9 一起来玩吧12 *********************************
 
 温馨提示：可能会有bug，如果不显示可以重新进入游玩页面，还不显示请查看油猴情况，如发生问题可以评论区反馈吗，作者会及时回复
 * ============================================================================== *
*/

// ==UserScript==
// @name         神奇代码岛PRO-辅助瞄准系统
// @namespace    https://dao3.fun/profile/8021199
// @version      3
// @description  提供对神奇代码岛PRO的地图进行辅助瞄准（此系统进入神奇代码岛PRO端游玩地图后会自动开启辅助瞄准系统，左上角调节。注意：有时候可能会进入PRO游玩地图时左上角未出现，请重进！）   作者PRO版个人首页：https://dao3.fun/profile/8021199（给个关注吧！！！）,打赏账户-微信号：yiqilaiwanba12wx；微信群：加作者好友后作者索要即可。我们承诺此插件不是外挂，纯净版！
// @author       一起来玩吧12
// @match        https://dao3.fun/play/*
// @grant        none
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/495431/%E7%A5%9E%E5%A5%87%E4%BB%A3%E7%A0%81%E5%B2%9BPRO-%E8%BE%85%E5%8A%A9%E7%9E%84%E5%87%86%E7%B3%BB%E7%BB%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/495431/%E7%A5%9E%E5%A5%87%E4%BB%A3%E7%A0%81%E5%B2%9BPRO-%E8%BE%85%E5%8A%A9%E7%9E%84%E5%87%86%E7%B3%BB%E7%BB%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    try{
    console.log("神奇代码岛pro辅助瞄准系统运行成功");//播报开启成功
    var banben = "此版本号为:3";
    console.log(banben);//播报版本号
    //播报在页面F12（html）中显示，出现没有任何问题，未出现或运行失败播报可以直接重进地图！
    
    var aimAssistActive = false;
    function createMenu() {
        var menu = document.createElement('div');
        menu.id = 'customMenu';
        menu.style.position = 'fixed';
        menu.style.top = '50px';
        menu.style.left = '50px';
        menu.style.width = '200px';
        menu.style.padding = '10px';
        menu.style.backgroundColor = 'lightgray';
        menu.style.border = '1px solid black';
        menu.style.zIndex = '9999';
        menu.style.cursor = 'move';
        menu.draggable = true;

        var authorLink = document.createElement('a');
        authorLink.href = 'https://dao3.fun/profile/8021199';
        authorLink.textContent = '插件作者首页';
        authorLink.style.display = 'block';
        authorLink.style.marginBottom = '10px';
        authorLink.style.color = 'blue';
        menu.appendChild(authorLink);

        var aimAssistToggle = document.createElement('button');
        aimAssistToggle.textContent = '辅助瞄准-开启/关闭';
        aimAssistToggle.style.padding = '5px';
        aimAssistToggle.style.backgroundColor = 'lightblue';
        aimAssistToggle.addEventListener('click', toggleAimAssist);
        menu.appendChild(aimAssistToggle);

        document.body.appendChild(menu);

        makeDraggable(menu);
    }

    function makeDraggable(element) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        element.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    function toggleAimAssist() {
        var crosshair = document.getElementById('aimCrosshair');
        if (aimAssistActive) {
            aimAssistActive = false;
            if (crosshair) {
                crosshair.remove();
            }
            console.log("辅助瞄准关闭成功");
            alert('辅助瞄准关闭成功');
        } else {
            aimAssistActive = true;
            addCrosshair();
            console.log("辅助瞄准开启成功");
            alert('辅助瞄准开启成功');
        }
    }

    function addCrosshair() {
        var crosshair = document.createElement('div');
        crosshair.id = 'aimCrosshair';
        crosshair.style.position = 'fixed';
        crosshair.style.top = '50%';
        crosshair.style.left = '50%';
        crosshair.style.transform = 'translate(-50%, -50%)';
        crosshair.style.width = '20px';
        crosshair.style.height = '20px';
        crosshair.style.border = '2px solid red';
        crosshair.style.borderRadius = '50%';
        crosshair.style.zIndex = '9999';
        document.body.appendChild(crosshair);
    }

    createMenu();
    } catch (e) {
        alert('运行失败，错误为' + e + '情联系作者修复问题！');
    }
})();