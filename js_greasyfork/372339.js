// ==UserScript==
// @name         梅林快捷助手
// @namespace    http://yonsm.net/
// @version      1.0.2
// @description  在梅林固件中调整菜单项，以及为无线用户排序
// @author       Yonsm
// @include      https://r*/*.asp
// @run-at       document-end.
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372339/%E6%A2%85%E6%9E%97%E5%BF%AB%E6%8D%B7%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/372339/%E6%A2%85%E6%9E%97%E5%BF%AB%E6%8D%B7%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


(function() {
    //'use strict';

setTimeout(function() {

    var mainMenu = document.getElementById('mainMenu');
    if (mainMenu == null) {
        console.log('未找到梅林菜单');
        return;
    }

    var container = mainMenu.lastChild;
    var menus = container.children;
    var count = menus.length;
    var j = 0;
    while (j < count && menus[++j].id != 'index_menu');

    // 无线用户
    var div = document.createElement('div');
    div.innerHTML = '<div class="menu" onclick="goToPage(24, 0, this);" title="Main_WStatus_Content.asp" id="Main_WStatus_Content_menu"><table><tbody><tr><td><div class="menu_Icon menu_Wireless"></div></td><td class="menu_Desc">无线用户</td></tr></tbody></table></div>';
    container.insertBefore(div.firstChild, menus[++j]);
    count++;

    // 往前移动
    var favorites = ['Advanced_Wireless_Content_menu', 'Advanced_WAN_Content_menu', 'Advanced_LAN_Content_menu', 'Advanced_OperationMode_Content_menu'];
    for (var i = ++j; i < count; i++) {
        var menu = menus[j];
        if (menu.className == 'menu_Split') {
            break;
        }
        menu.remove();
        container.insertBefore(menu, menus[count - 3]);
    }
    for (i = j + 1; i < count; i++) {
        menu = menus[i];
        if (menu.className == 'menu_Split') {
            break;
        }
        if (favorites.indexOf(menu.id) != -1) {
            menu.remove();
            if (menu.id == 'Advanced_OperationMode_Content_menu') {
                menu.title = 'Advanced_System_Content.asp';
            }
            container.insertBefore(menu, menus[j++]);
        }
    }
    console.log('Done');

    // 科学上网
    var subMenu = document.getElementById('subMenu');
    if (subMenu) {
       subMenu.innerHTML = '<div class="menu" onclick="goToPage(23, 0, this);" title="Main_Ss_Content.asp" id="Main_Ss_Content_menu"><table><tbody><tr><td><div class="menu_Icon menu_VPN"></div></td><td class="menu_Desc">科学上网</td></tr></tbody></table></div>';
    }

    // 无线用户排序
    if (location.pathname == '/Main_WStatus_Content.asp') {
        var blockNames = ['wifi24block', 'wifi5block', 'wifi52block'];
        for (i in blockNames) {
            var blockName = blockNames[i];
            var block = document.getElementById(blockName);
            if (block && block.childElementCount) {
                var cells = block.lastChild.rows[0].cells;
                cells[0].innerHTML = '<a href="#" onclick="reorder(\'' + blockName + '\',0,1); return false"><center>设备（' + (block.lastChild.rows.length-1) + '）</center></a>';
                cells[1].innerHTML = '<a href="#" onclick="reorder(\'' + blockName + '\',1,0); return false"><center>地址</center></a>';
                cells[2].innerHTML = '<a href="#" onclick="reorder(\'' + blockName + '\',2,1); return false"><center>信号</center></a>';
                cells[3].innerHTML = '<a href="#" onclick="reorder(\'' + blockName + '\',3,0); return false"><center>时长</center></a>';
                cells[4].innerHTML = '<a href="#" onclick="reorder(\'' + blockName + '\',4,0); return false"><center>标记</center></a>';
            }
        }

        var script = document.createElement('script');
        script.innerHTML = 'function reorder(block, col, line) {\n\
            var rows = document.getElementById(block).lastChild.rows;\n\
            var items = [];\n\
            for (i = 1; i < rows.length; i++) {\n\
                var cells = rows[i].cells;\n\
                var sort = cells[col].innerText.split("\\n")[line];\n\
                items.push([cells[0].innerHTML, cells[1].innerHTML, cells[2].innerHTML, cells[3].innerHTML, cells[4].innerHTML, sort]);\n\
            }\n\
            items.sort(function(a, b) {return reverse ? a[5].localeCompare(b[5]) : b[5].localeCompare(a[5])});\n\
            reverse = !reverse;\n\
            for (i = 1; i < rows.length; i++) {\n\
                for (var k = 0; k < 5; k++) {\n\
                    rows[i].cells[k].innerHTML = items[i-1][k];\n\
                }\n\
            }\n\
        }\nvar reverse = false;';
        document.body.appendChild(script);

    }
}, 1000);
})();
