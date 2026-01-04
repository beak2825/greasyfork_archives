// ==UserScript==
// @name         云南大学校园网美化
// @namespace    https://greasyfork.org/zh-CN/scripts/476284-云南大学校园网美化
// @homepageURL  https://github.com/Steven-Zhl/4BetterBrowser/Scripts#云南大学校园网美化
// @version      1.2.1
// @license      GPL-3.0
// @description  云南大学自助服务平台(校园网)美化脚本
// @author       Steven-Zhl
// @icon         https://selfsrv.ynu.edu.cn/favicon.ico
// @match        https://selfsrv.ynu.edu.cn/*
// @exclude      https://selfsrv.ynu.edu.cn/login
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476284/%E4%BA%91%E5%8D%97%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/476284/%E4%BA%91%E5%8D%97%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

/**
 * 根据16进制颜色值和倍率计算新的颜色值
 * @param {string} hexColor - 16进制表示的颜色
 * @param {number[]} multipliers - R,G,B的倍率，在[0,1]之间
 * @returns {string} - 返回新的16进制颜色值，格式为#{RRGGBB}
 */
function MultiplyHexColor(hexColor, multipliers) {
    // 首先将16进制颜色值转换为RGB色值
    const originR = parseInt(hexColor.slice(1, 3), 16);
    const originG = parseInt(hexColor.slice(3, 5), 16);
    const originB = parseInt(hexColor.slice(5, 7), 16);
    // 分别将RGB色值与倍率相乘，并确保结果在0到255之间
    const R = Math.min(255, Math.max(0, Math.round(originR * multipliers[0])));
    const G = Math.min(255, Math.max(0, Math.round(originG * multipliers[1])));
    const B = Math.min(255, Math.max(0, Math.round(originB * multipliers[2])));
    // 将新的RGB值转换为16进制颜色值并返回
    const resultColor = `#${(R < 16 ? '0' : '') + R.toString(16)}${(G < 16 ? '0' : '') + G.toString(16)}${(B < 16 ? '0' : '') + B.toString(16)}`;
    return resultColor;
}

/**
 * 构建一个图片选择对话框
 * @param {string} titleInfo - 对话框标题
 * @param {string} localVariableName - localStorage中存储图片的变量名
 */
function QueryImage(titleInfo, localVariableName) {
    var dialog = document.createElement('dialog'); dialog.style.cssText = "border-radius: 10px; padding: 10px; text-align: center;";
    var title = document.createElement('h3'); title.innerText = titleInfo; title.style.cssText = "text-align: center; margin: 3px";
    var typeContainer = document.createElement('div'); typeContainer.style.margin = "3px";
    var buttonContainer = document.createElement('div'); buttonContainer.style.cssText = "height: 30px; margin: 3px; text-align: center";
    var tip = document.createElement('p'); tip.innerText = "图片类型: "; tip.style.cssText = "display: inline-block; vertical-align: middle; margin: 3px";
    var select = document.createElement('select'); select.title = "选择图片"; select.style.cssText = "display: inline-block; vertical-align: middle; margin: 3px";
    select.innerHTML = '<option value="local">本地图片</option><option value="online">在线图片</option>';
    var localInput = document.createElement('input'); localInput.type = 'file'; localInput.accept = "image/png, image/jpg, image/jpeg"; localInput.style.margin = "3px";
    var onlineInput = document.createElement('input'); onlineInput.type = 'hidden'; onlineInput.placeholder = "请粘贴图片链接"; onlineInput.style.margin = "3px";
    var yesButton = document.createElement('button'); yesButton.innerText = '确定'; yesButton.style.cssText = "display: inline-block; margin: 3px";
    var clearButton = document.createElement('button'); clearButton.innerText = '恢复默认'; yesButton.style.cssText = "display: inline-block; margin: 3px";
    var cancelButton = document.createElement('button'); cancelButton.innerText = '取消'; cancelButton.style.cssText = "display: inline-block; margin: 3px";
    dialog.className = 'dialog';
    dialog.appendChild(title);
    dialog.appendChild(typeContainer);
    dialog.appendChild(localInput);
    dialog.appendChild(onlineInput);
    dialog.appendChild(buttonContainer);
    typeContainer.appendChild(tip);
    typeContainer.appendChild(select);
    buttonContainer.appendChild(yesButton);
    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(clearButton);
    // 添加事件监听器
    select.addEventListener('change', function () {
        if (select.value === 'local') {
            localInput.type = 'file';
            onlineInput.type = 'hidden';
        }
        else if (select.value === 'online') {
            localInput.type = 'hidden';
            onlineInput.type = 'text';
        }
    });
    yesButton.addEventListener('click', function () {
        if (select.value === 'local' && localInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function () {
                const img = new Image(); // 创建一个新的Image对象
                img.src = reader.result; // 设置Image对象的src为用户输入的文件链接
                try {
                    localStorage.setItem(localVariableName, reader.result);
                } catch (e) {
                    alert('图片文件过大，无法加载');
                    dialog.close();
                }
            };
            reader.readAsDataURL(localInput.files[0]);
            window.location.reload();
        } else if (select.value === 'online') {
            localStorage.setItem(localVariableName, onlineInput.value);
        }

    });
    clearButton.addEventListener('click', function () {
        localStorage.removeItem(localVariableName);
        alert('已恢复默认');
        window.location.reload();
    });
    cancelButton.addEventListener('click', function () { dialog.close(); });
    document.body.appendChild(dialog);
    dialog.showModal();
}

/**
 * 构建一个颜色选择对话框
 * @param {string} titleInfo - 对话框标题
 * @param {string} localVariableName - localStorage中存储颜色的变量名
 */
function QueryColor(titleInfo, localVariableName) {
    var dialog = document.createElement('dialog'); dialog.style.cssText = "border-radius: 10px; padding: 10px; text-align: center;";
    var title = document.createElement('h3'); title.innerText = titleInfo; title.style.cssText = "text-align: center; margin: 3px";
    var buttonContainer = document.createElement('div'); buttonContainer.style.cssText = "height: 30px; margin: 3px; text-align: center";
    var input = document.createElement('input'); input.type = 'color'; input.style.margin = "3px";
    var yesButton = document.createElement('button'); yesButton.innerText = '确定'; yesButton.style.cssText = "display: inline-block; margin: 3px";
    var clearButton = document.createElement('button'); clearButton.innerText = '恢复默认'; yesButton.style.cssText = "display: inline-block; margin: 3px";
    var cancelButton = document.createElement('button'); cancelButton.innerText = '取消'; cancelButton.style.cssText = "display: inline-block; margin: 3px";
    dialog.className = 'dialog';
    dialog.appendChild(title);
    dialog.appendChild(input);
    dialog.appendChild(buttonContainer);
    buttonContainer.appendChild(yesButton);
    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(clearButton);
    yesButton.addEventListener('click', function () {
        localStorage.setItem(localVariableName, input.value);
        window.location.reload();
    });
    clearButton.addEventListener('click', function () {
        localStorage.removeItem(localVariableName);
        alert('已恢复默认');
        window.location.reload();
    });
    cancelButton.addEventListener('click', function () { dialog.close(); });
    document.body.appendChild(dialog);
    dialog.showModal();
}

/**
 * 加载自定义主题色
 * @param {string} themeColor - 16进制表示的主题色
 */
function LoadThemeColor(themeColor) { // 将颜色替换为自定义主题色
    var headerColor = MultiplyHexColor(themeColor, [115 / 60, 202 / 141, 226 / 188]);
    var logoColor = MultiplyHexColor(themeColor, [54 / 60, 127 / 141, 169 / 188]);
    var header = document.getElementsByClassName("navbar navbar-static-top")[0];
    var sidebar = document.getElementsByClassName('sidebar-menu')[0];
    header.style.backgroundColor = themeColor;
    header.style.backgroundImage = 'linear-gradient(to right, ' + themeColor + ', ' + headerColor + ')';
    sidebar.getElementsByClassName('active')[0].firstChild.style.borderLeftColor = themeColor; // 修改sidebar的active元素的左边框颜色
    document.getElementsByClassName('logo')[0].style.backgroundColor = logoColor; // 修改logo的背景颜色
    document.getElementsByClassName('sidebar-toggle')[0].style.backgroundColor = themeColor; // 修改sidebar-toggle的背景颜色
    document.getElementsByClassName('user-header')[0].style.backgroundColor = themeColor; // 修改user-header的背景颜色
    document.getElementsByClassName('main-footer')[0].style.backgroundColor = themeColor; // 修改main-footer的背景颜色
}

/**
 * 加载自定义侧边栏颜色
 * @param {string} sidebarColor - 16进制表示的侧边栏颜色  
 */
function LoadSidebarColor(sidebarColor) {
    var sidebar = document.getElementsByClassName('sidebar-menu')[0];
    document.getElementsByClassName('main-sidebar')[0].style.backgroundColor = sidebarColor;
    document.querySelectorAll('.treeview-menu').forEach(function (treeviewMenu) {
        treeviewMenu.style.backgroundColor = sidebarColor;
    }); // 修改treeview-menu的背景颜色
    sidebar.style.color = sidebarColor;
    sidebar.querySelectorAll('li').forEach(function (li) {
        li.style.backgroundColor = sidebarColor;
        li.style.color = sidebarColor;
        if (li.firstChild.firstChild) li.firstChild.style.backgroundColor = sidebarColor;
    });
}

/**
 * 加载自定义头像
 * @param {string} avaterLink - 头像链接
 */
function LoadAvatar(avaterLink) { // 将图片链接替换为自定义头像
    if (!avaterLink) { return; }
    var avatar = document.getElementsByClassName('img-circle');
    for (let i = 0; i < avatar.length; i++)  avatar[i].src = avaterLink;
    document.getElementsByClassName('user-image')[0].src = avaterLink;
}

/**
 * 加载自定义背景图片
 * @param {string} backgroundLink - 背景图片链接
*/
function LoadBackground(backgroundLink) {
    if (!backgroundLink) { return; }
    var backgroundElement = document.getElementsByClassName('content-wrapper')[0];
    backgroundElement.style.background = 'url(' + backgroundLink + ')';
    backgroundElement.style.backgroundSize = 'cover';
    // 为了更好显示背景图片，需要让页面中的panel和panel-heading元素半透明
    document.querySelectorAll('.panel').forEach(function (panel) { panel.style.opacity = '0.75'; });
    document.querySelectorAll('.panel-heading').forEach(function (panel) { panel.style.opacity = '0.75'; });
}

/**
 * 加载原神主题(预设)
 */
function GenshinTheme() {
    LoadBackground('https://ys.mihoyo.com/main/_nuxt/img/poster.47f71d4.jpg');
    LoadAvatar('https://uploadstatic.mihoyo.com/contentweb/20210105/2021010518424084444.png');
    LoadThemeColor("#404040a0");
    LoadSidebarColor("#404040");
    var badge = document.createElement('img');
    badge.src = 'data:image/png;base64,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';
    badge.style.cssText = "position: fixed; bottom: 80px; right: 20px; width: 60px; height: auto;"
    document.body.appendChild(badge);
    document.getElementsByClassName('logo-lg')[0].firstChild.innerText = "云·原神";
    document.getElementsByClassName('logo-mini')[0].innerHTML = '<img src="https://webstatic.mihoyo.com/bh3/upload/officialsites/201908/ys_1565764084_7084.png" width="40px">';
    var icon = document.createElement('link'); icon.rel = 'icon'; icon.type = 'image/ico'; icon.href = 'https://ys.mihoyo.com/main/favicon.ico';
    document.head.appendChild(icon);
    document.getElementsByClassName('text-success')[0].parentElement.innerHTML = '<i class="fa fa-circle text-success"></i>提瓦特大陆';
}

/**
 * 为指定元素添加点击复制功能
 */
function ClickCopy(element) {
    element.addEventListener('click', function () {
        navigator.clipboard.writeText(element.innerText);
        alert('已复制到剪贴板');
    });
}

(function () {
    // 1. 在首页和/在线信息和日志/上网明细中，同步来自无感知认证的备注，并且为表格内容增添点击复制功能
    if (window.location.href == 'https://selfsrv.ynu.edu.cn/home' || window.location.href.match('https:\/\/selfsrv\.ynu\.edu\.cn\/log\/detail.*')) {
        fetch('https://selfsrv.ynu.edu.cn/user/mac-auth')
            .then(response => {
                if (!response.ok) { throw new Error('网络请求失败'); }
                return response.text();
            })
            .then(html => {
                const temp_div = document.createElement('div');// 创建一个临时div元素来解析HTML
                temp_div.innerHTML = html;
                const mac_list = temp_div.querySelector('.kv-grid-table.table.table-hover.table-bordered').querySelectorAll('tr');
                if (mac_list) {// 获取 mac地址-备注 的字典
                    var macDict = {};
                    var macElements = Array.from(mac_list).slice(1); // 跳过第一个元素
                    macElements.forEach(function (macElement) {
                        macDict[macElement.querySelectorAll('td')[1].innerText] =
                            macElement.querySelectorAll('td')[2].querySelector('.kv-editable-link').innerText;
                    });
                    if (window.location.href == 'https://selfsrv.ynu.edu.cn/home') {
                        // 将其添加到首页的在线信息中
                        var onlineTable = document.getElementsByClassName('kv-grid-table table table-bordered table-striped')[0];
                        var onlineTableHeader = document.getElementsByClassName('kv-table-header w1')[0];
                        onlineTableHeader.getElementsByTagName('tr')[0].innerHTML =
                            '<th>设备备注</th>' + onlineTableHeader.getElementsByTagName('tr')[0].innerHTML;
                        var onlineList = onlineTable.getElementsByTagName('tbody')[0];
                        for (let i = 0; i < onlineList.getElementsByTagName('tr').length; i++) {
                            var macAddr = onlineList.getElementsByTagName('tr')[i].getElementsByTagName('td')[5].innerText;
                            if (macAddr in macDict) {
                                onlineList.getElementsByTagName('tr')[i].innerHTML =
                                    '<td>' + macDict[macAddr] + '</td>' + onlineList.getElementsByTagName('tr')[i].innerHTML;
                            }
                            else {
                                onlineList.getElementsByTagName('tr')[i].innerHTML =
                                    '<td></td>' + onlineList.getElementsByTagName('tr')[i].innerHTML;
                            }
                        }
                        // 为每个<td>添加点击复制功能
                        onlineList.querySelectorAll('td').forEach(function (td) { ClickCopy(td); });
                    } else if (window.location.href.match('https:\/\/selfsrv\.ynu\.edu\.cn\/log\/detail.*')) {
                        // 将其添加到日志/上网明细中
                        var logTable = document.getElementsByClassName('kv-grid-table table table-hover table-bordered')[0];
                        var logTableHeader = document.getElementsByClassName('kv-table-header w0')[0];
                        logTableHeader.getElementsByTagName('tr')[0].innerHTML = '<th>设备备注</th>' + logTableHeader.getElementsByTagName('tr')[0].innerHTML;
                        var logList = logTable.getElementsByTagName('tbody')[0];
                        for (let i = 0; i < logList.getElementsByTagName('tr').length; i++) {
                            var macAddr = logList.getElementsByTagName('tr')[i].getElementsByTagName('td')[3].innerText;
                            if (macAddr in macDict) {
                                logList.getElementsByTagName('tr')[i].innerHTML =
                                    '<td>' + macDict[macAddr] + '</td>' + logList.getElementsByTagName('tr')[i].innerHTML;
                            } else {
                                logList.getElementsByTagName('tr')[i].innerHTML =
                                    '<td></td>' + logList.getElementsByTagName('tr')[i].innerHTML;
                            }
                        }
                        // 为每个<td>添加点击复制功能
                        logList.querySelectorAll('td').forEach(function (td) { ClickCopy(td); });
                    }
                } else { console.error('未找到目标元素'); }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    var sidebar = document.getElementsByClassName('sidebar-menu')[0];
    // 2. 自定义主题色
    var localThemeColor = localStorage.getItem('YNU-selfsrv-enhance-theme-color') ? localStorage.getItem('YNU-selfsrv-enhance-theme-color') : "#3c8dbc"; // 获取先前已设置的主题色
    var themeColorButton = document.createElement('li');// “自定义主题色”按钮
    themeColorButton.className = 'treeview';
    themeColorButton.innerHTML = '<a href="#" title="自定义主题色" ><i class="glyphicon glyphicon-heart"></i><span>自定义主题色</span></a>';
    themeColorButton.addEventListener('click', function () { QueryColor("请选择主题色", 'YNU-selfsrv-enhance-theme-color'); });
    sidebar.appendChild(themeColorButton);
    LoadThemeColor(localThemeColor);
    // 3. 自定义侧边栏颜色
    var local_siderbarColor = localStorage.getItem('YNU-selfsrv-enhance-sidebar-color') ? localStorage.getItem('YNU-selfsrv-enhance-sidebar-color') : "#222d32"; // 获取先前已设置的侧边栏颜色
    var sidebarColorButton = document.createElement('li');
    sidebarColorButton.className = 'treeview';
    sidebarColorButton.innerHTML = '<a href="#" title="自定义侧边栏颜色" ><i class="glyphicon glyphicon-tag"></i><span>自定义侧边栏颜色</span></a>';
    sidebarColorButton.addEventListener('click', function () { QueryColor("请选择侧边栏颜色", 'YNU-selfsrv-enhance-sidebar-color'); });
    sidebar.appendChild(sidebarColorButton);
    LoadSidebarColor(local_siderbarColor);
    // 4. 自定义头像
    var localAvaterLink = localStorage.getItem('YNU-selfsrv-enhance-avatar-link'); // 获取先前已设置的头像链接
    var avatarButton = document.createElement('li');// “更换头像”按钮
    avatarButton.className = 'treeview';
    avatarButton.innerHTML = '<a href="#" title="更换头像" ><i class="glyphicon glyphicon-user"></i><span>更换头像</span></a>';
    avatarButton.style.backgroundColor = local_siderbarColor;
    avatarButton.style.color = local_siderbarColor;
    avatarButton.firstChild.style.backgroundColor = local_siderbarColor;
    avatarButton.addEventListener('click', function () { QueryImage("选择头像图片", "YNU-selfsrv-enhance-avatar-link"); });
    sidebar.appendChild(avatarButton);
    if (localAvaterLink) { LoadAvatar(localAvaterLink); }
    // 5. 自定义背景图片
    var localBackgroundLink = localStorage.getItem('YNU-selfsrv-enhance-background-link'); // 获取先前已设置的背景图片链接
    var backgroundButton = document.createElement('li');// “更换背景图片”按钮
    backgroundButton.className = 'treeview';
    backgroundButton.innerHTML = '<a href="#" title="更换背景图片" ><i class="glyphicon glyphicon-picture"></i><span>更换背景图片</span></a>';
    backgroundButton.style.backgroundColor = local_siderbarColor;
    backgroundButton.style.color = local_siderbarColor;
    backgroundButton.firstChild.style.backgroundColor = local_siderbarColor;
    backgroundButton.addEventListener('click', function () { QueryImage("选择背景图片", "YNU-selfsrv-enhance-background-link"); });
    sidebar.appendChild(backgroundButton);
    if (localBackgroundLink) { LoadBackground(localBackgroundLink); }
    // 6. 原神，启动！
    var genshinButton = document.createElement('li');
    genshinButton.className = 'treeview';
    genshinButton.innerHTML = '<a href="#" title="原神，启动！" ><i class="glyphicon glyphicon-fire"></i><span>原神，启动！</span></a>';
    genshinButton.style.backgroundColor = local_siderbarColor;
    genshinButton.style.color = local_siderbarColor;
    genshinButton.firstChild.style.backgroundColor = local_siderbarColor;
    genshinButton.addEventListener('click', function () {
        if (!localStorage.getItem('YNU-selfsrv-enhance-genshin-mode')) {
            localStorage.setItem('YNU-selfsrv-enhance-genshin-mode', 'true');
            alert('原神，启动！');
        } else {
            localStorage.removeItem('YNU-selfsrv-enhance-genshin-mode');
            alert('原神，关闭！');
        }
        window.location.reload();
    });
    sidebar.appendChild(genshinButton);
    if (localStorage.getItem('YNU-selfsrv-enhance-genshin-mode')) { GenshinTheme(); }
})();