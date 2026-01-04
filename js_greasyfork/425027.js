// ==UserScript==
// @name         gitMind-ext
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  gitMind扩展插件
// @feature      gitMind扩展插件，支持左/右移节点，自定义快捷键，markdown渲染
// @note         2021.04.28 去除流程图的自动保存功能
// @note         2021.04.28 流程图自动保存功能使用开关形式
// @note         2021.04.28 脑图增加快捷键折叠/收缩(alt+Z)
// @note         2021.04.28 修复keyCode超过100时出现的快捷键误判
// @note         2021.09.17 删除自动保存开关功能
// @note         2021.09.17 取消插入备注，插入链接，折叠/收缩快捷键（官方已实现）
// @note         2021.09.17 新标签页渲染markdown（Alt M）
// @note         2021.09.18 增加左移节点(Alt Left)，右移节点(Alt Right)
// @note         2021.09.18 重构逻辑
// @note         2021.09.18 增加自定义快捷键功能
// @note         2021.12.01 适配官方新增的设备按钮
// @note         2021.12.01 增加转置节点(Alt Shift T)
// @note         2021.12.01 增加插件测试(Ctrl Alt Shift G)
// @author       ZhenhuiSu
// @match        https://gitmind.cn/app/doc/*
// @run-at       document-end
// @grant        none
// @license MIT
// @require https://cdn.jsdelivr.net/npm/jquery@1.5.1/dist/node-jquery.min.js
// @require https://cdn.jsdelivr.net/npm/jquery.cookie@1.4.1/jquery.cookie.min.js
// @require https://cdn.jsdelivr.net/npm/keycode@2.2.0/index.min.js
// @require https://cdn.jsdelivr.net/npm/marked@4.0.5/marked.min.js
// @downloadURL https://update.greasyfork.org/scripts/425027/gitMind-ext.user.js
// @updateURL https://update.greasyfork.org/scripts/425027/gitMind-ext.meta.js
// ==/UserScript==
(function () {
    'use strict';
    $('head').append($(`
<!-- CSS部分 -->
<style>
    .shortcut-list ul li ul li input {
        margin: 0;
        padding: 1px 2px;
        border-width: 2px;
        border-style: inset;
        border-image: initial;
        width: 80px;
    }

    .shortcut-list ul li ul li button {
        box-sizing: border-box;
        margin: 0;
        padding: 1px 6px;
        border-width: 2px;
        border-style: outset;
        border-image: initial;
    }
</style>`));
    var gmExt = {};
    init();

    /**
     * 初始化方法
     */
    function init() {
        // 初始化常量
        gmExt.openExtHelp = false;
        gmExt.cookie = {};
        gmExt.globalTimeout = 300;
        gmExt.keyCodeToChar = {8:"Backspace",9:"Tab",13:"Enter",16:"Shift",17:"Ctrl",18:"Alt",19:"Pause/Break",20:"Caps Lock",27:"Esc",32:"Space",33:"Page Up",34:"Page Down",35:"End",36:"Home",37:"Left",38:"Up",39:"Right",40:"Down",45:"Insert",46:"Delete",48:"0",49:"1",50:"2",51:"3",52:"4",53:"5",54:"6",55:"7",56:"8",57:"9",65:"A",66:"B",67:"C",68:"D",69:"E",70:"F",71:"G",72:"H",73:"I",74:"J",75:"K",76:"L",77:"M",78:"N",79:"O",80:"P",81:"Q",82:"R",83:"S",84:"T",85:"U",86:"V",87:"W",88:"X",89:"Y",90:"Z",91:"Windows",93:"Right Click",96:"Numpad 0",97:"Numpad 1",98:"Numpad 2",99:"Numpad 3",100:"Numpad 4",101:"Numpad 5",102:"Numpad 6",103:"Numpad 7",104:"Numpad 8",105:"Numpad 9",106:"Numpad *",107:"Numpad +",109:"Numpad -",110:"Numpad .",111:"Numpad /",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"Num Lock",145:"Scroll Lock",182:"My Computer",183:"My Calculator",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"};
        gmExt.keyCharToCode = {"Backspace":8,"Tab":9,"Enter":13,"Shift":16,"Ctrl":17,"Alt":18,"Pause/Break":19,"Caps Lock":20,"Esc":27,"Space":32,"Page Up":33,"Page Down":34,"End":35,"Home":36,"Left":37,"Up":38,"Right":39,"Down":40,"Insert":45,"Delete":46,"0":48,"1":49,"2":50,"3":51,"4":52,"5":53,"6":54,"7":55,"8":56,"9":57,"A":65,"B":66,"C":67,"D":68,"E":69,"F":70,"G":71,"H":72,"I":73,"J":74,"K":75,"L":76,"M":77,"N":78,"O":79,"P":80,"Q":81,"R":82,"S":83,"T":84,"U":85,"V":86,"W":87,"X":88,"Y":89,"Z":90,"Windows":91,"Right Click":93,"Numpad 0":96,"Numpad 1":97,"Numpad 2":98,"Numpad 3":99,"Numpad 4":100,"Numpad 5":101,"Numpad 6":102,"Numpad 7":103,"Numpad 8":104,"Numpad 9":105,"Numpad *":106,"Numpad +":107,"Numpad -":109,"Numpad .":110,"Numpad /":111,"F1":112,"F2":113,"F3":114,"F4":115,"F5":116,"F6":117,"F7":118,"F8":119,"F9":120,"F10":121,"F11":122,"F12":123,"Num Lock":144,"Scroll Lock":145,"My Computer":182,"My Calculator":183,";":186,"=":187,",":188,"-":189,".":190,"/":191,"`":192,"[":219,"\\":220,"]":221,"'":222};
        gmExt.featureCodeNameMap = {
            "appendChildNode": "添加下级节点",
            "appendSiblingNode": "添加同级节点",
            "appendParentNode": "添加上级节点",
            "deleteSubTree": "删除选中节点",
            "deleteSingleNode": "删除节点",
            "nodeArrangeUp": "上移节点",
            "nodeArrangeDown": "下移节点",
            "clearStyle": "清除样式",
            "insertLink": "插入链接",
            "insertNote": "插入备注",
            "addGeneralize": "插入概括",
            "insertPhoto": "插入图片",
            "nodeAppenDrelLine": "插入关系线",
            "zoomReset": "重置缩放",
            "resetLayout": "整理布局"
        };
        gmExt.bindMap = {
            "closeRightPop": {code: 27, fun: closeRightPop},
            "nodeMoveLeft": {code: 1037, fun: nodeMoveLeft},
            "nodeMoveRight": {code: 1039, fun: nodeMoveRight},
            "renderMarkdown": {code: 1077, fun: renderMarkdown},
            "transposeNode": {code: 11084, fun: transposeNode},
            "testExt": {code: 111071, fun: testExt},
            "appendChildNode": {code: 0, fun: appendChildNode},
            "appendSiblingNode": {code: 0, fun: appendSiblingNode},
            "appendParentNode": {code: 0, fun: appendParentNode},
            "deleteSubTree": {code: 0, fun: deleteSubTree},
            "deleteSingleNode": {code: 0, fun: deleteSingleNode},
            "nodeArrangeUp": {code: 0, fun: nodeArrangeUp},
            "nodeArrangeDown": {code: 0, fun: nodeArrangeDown},
            "clearStyle": {code: 0, fun: clearStyle},
            "insertLink": {code: 0, fun: insertLink},
            "insertNote": {code: 0, fun: insertNote},
            "addGeneralize": {code: 0, fun: addGeneralize},
            "insertPhoto": {code: 0, fun: insertPhoto},
            "nodeAppenDrelLine": {code: 0, fun: nodeAppenDrelLine},
            "zoomReset": {code: 0, fun: zoomReset},
            "resetLayout": {code: 0, fun: resetLayout}
        };

        // 从cookie加载数据
        loadDataFromCookie();
        // 初始化空的自定义快捷键并保存到cookie
        let customShortcuts = gmExt.cookie.customShortcuts;
        if (!gmExt.cookie.customShortcuts) {
            let customShortcuts = {};
            for (let key in gmExt.featureCodeNameMap) {
                customShortcuts[key] = 0;
            }
            gmExt.cookie.customShortcuts = customShortcuts;
            storeDataToCookie();
        }
        // 绑定所有自定义快捷键
        bindAllShortcut();
        setTimeout(() => {
            document.addEventListener('keydown',(event) => {
                let fun = choiceFun(event);
                if (fun) {
                    fun.apply();
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    event.stopPropagation();
                    return false;
                }
            }, true);
        }, gmExt.globalTimeout)

        // 绑定帮助按钮点击事件
        bindSupportClick();
    }

    /**
     * 帮助按钮绑定点击事件
     * 用于添加GM-ext插件说明
     */
    function bindSupportClick() {
        setTimeout(() => {
            $('div.support-btn>.icon-help').mouseenter(() => {
                setTimeout(() => {
                    if($('div.support-list>ul>li.gm-ext')[0]) {
                        return;
                    }
                    let shortcutLi = $('div.support-list>ul>li:first');
                    // 增加GM-ext插件按钮
                    let extHelpLi = shortcutLi.clone();
                    extHelpLi.html('GM-ext插件');
                    extHelpLi.addClass('gm-ext');
                    extHelpLi.click(() => {
                        gmExt.openExtHelp = true;
                        shortcutLi.click();
                    });
                    shortcutLi.after(extHelpLi);

                    shortcutLi.click(helpShortcutClick);
                }, gmExt.globalTimeout);
            });
        }, gmExt.globalTimeout * 10);
    }

    /**
     * 帮助-快捷键按钮点击事件
     * 用于打开GM-ext插件说明及添加自定义快捷键输入框与按钮元素
     */
    function helpShortcutClick() {
        setTimeout(() => {
            if (openedExtHelp()) {
                return;
            }
            let shortcutGroupListEl = $('div.shortcut>div.shortcut-list>ul');
            let shortcutGroupEl = shortcutGroupListEl.children('li:last-child');

            shortcutGroupListEl.find('li>ul>li>span:first-child').each((idx, ele) => {
                ele = $(ele);
                // 功能名称
                let featureCode = featureName2featureCode(ele.html());
                // 创建input并设值
                let customShortcutCode = getShortcutCode4featureCode(featureCode);
                if (customShortcutCode !== null) {
                    let customShortcutInputEl = $('<input id="' + featureCode + '-input">');
                    let btnRecovery = $('<button id="' + featureCode + '-recovery">复原</button>');
                    let btnSave = $('<button id="' + featureCode + '-save">保存</button>');
                    btnRecovery.click(shortcutRecoveryClick(featureCode));
                    btnSave.click(shortcutSaveClick(featureCode));
                    customShortcutInputEl.val(code2shortcut(customShortcutCode));
                    ele.after(customShortcutInputEl);
                    customShortcutInputEl.after(btnRecovery);
                    btnRecovery.after(btnSave);
                }
            });
        }, gmExt.globalTimeout);
    }

    /**
     * 打开GM-ext扩展插件说明
     * 使用快捷键窗口，自行渲染内容
     *
     * @returns {boolean}
     */
    function openedExtHelp() {
        let openedExtHelp = gmExt.openExtHelp;
        gmExt.openExtHelp = false;
        if (openedExtHelp) {
            let extHelp = $('div.shortcut');
            // 修改标题
            extHelp.find('header.shortcut-title>b').html('gitMind扩展插件帮助文档');
            let extHelpContent = extHelp.children('div.shortcut-list');
            extHelpContent.html(markedContent(getExtHelpReadMe()));
            return true;
        }
        return false;
    }

    /**
     * 自定义快捷键复原按钮点击事件
     *
     * @param featureCode 功能名称
     * @returns {(function(): void)|*}
     */
    function shortcutRecoveryClick(featureCode) {
        return () => {
            $('#' + featureCode + '-input').val(code2shortcut(getShortcutCode4featureCode(featureCode)));
        };
    }

    /**
     * 自定义快捷键保存按钮点击事件
     *
     * @param featureCode 功能名称
     * @returns {(function(): void)|*}
     */
    function shortcutSaveClick(featureCode) {
        return () => {
            storeCustomShortcut(featureCode, $('#' + featureCode + '-input').val());
        }
    }

    //----------------------------extend shortcut----------------------------//

    /**
     * esc
     */
    function closeRightPop() {
        // gitMind内置快捷键绑定的窗口，退出弹出窗后需要使该组件获取焦点，否则内置快捷键将不可用
        let qlEditor = $('.ql-editor');
        let pops = [$('.ne-title'), $('.shortcut-title'), $('#ext-help-title')];
        for (let i = 0; i < pops.length; i++) {
            if (pops[i] && pops[i].children('.icon-guanbi')) {
                pops[i].children('.icon-guanbi').click();
            }
        }

        if (qlEditor) {
            qlEditor.focus();
        }
    }

    /**
     * 移动节点成为父节点的后置节点
     *
     * alt left
     * movetoparent(selectedNodes, parentNode)
     * arrange(order)
     */
    function nodeMoveLeft() {
        let selectedNode = getSelectedNode();
        if (!selectedNode
            // 父节点不为空
            || !selectedNode.parent
            // 父节点的父节点也不能为空
            || !selectedNode.parent.parent) {
            return;
        }
        let parentNode = selectedNode.parent;
        let grandParentNode = parentNode.parent;
        let parentOrder = getOriOrder(parentNode);

        // 移动节点成为grandParentNode的子节点
        executeCommand("movetoparent", [selectedNode], grandParentNode);
        // 移动到原父节点的下一个节点
        executeCommand("arrange", parentOrder + 1);
        getMinder().layout();
    }

    /**
     * 移动节点成为相邻节点的子节点，默认是前置节点，无前置节点时，成为后置节点的子节点
     *
     * alt right
     * movetoparent(selectedNodes, parentNode)
     */
    function nodeMoveRight() {
        let selectedNode = getSelectedNode();
        if (!selectedNode
            // 父节点不为空
            || !selectedNode.parent) {
            return;
        }
        let parentNode = selectedNode.parent;
        let nodes = parentNode.children;
        if (nodes.length === 1) {
            // 只有一个节点，无法移动
            return;
        }
        let oriOrder = getOriOrder(selectedNode);
        // 当前节点为第一个节点时，移动成为第2个节点的子节点，否则移动成为前置节点的子节点
        executeCommand("movetoparent", [selectedNode], oriOrder === 0 ? nodes[oriOrder + 1] : nodes[oriOrder - 1]);
        getMinder().layout();
    }

    /**
     * 以markdown渲染指定节点的备注
     *
     * alt M
     */
    function renderMarkdown() {
        let selectedNode = getSelectedNode();
        if (!selectedNode) {
            return;
        }
        let note = selectedNode.data.note;
        if (!note || !note.startsWith("[markdown]\n")) {
            return;
        }
        let markdownStr = note.substr(11);

        let newWin = window.open('');
        newWin.document.write("<div id='markdown'></div>>");
        let markdownWin = newWin.document.getElementById('markdown');

        markdownWin.innerHTML = markedContent(markdownStr);
        newWin.focus();
        newWin.document.title = "markdown";
    }

    /**
     * 转置节点
     *
     * Ctrl Shift T
     */
    function transposeNode() {
        let selectedNodes = getSelectedNodes();
        if (!selectedNodes) {
            return;
        }
        for (let i = 0; i < selectedNodes.length; i++) {
            if (!selectedNodes[i].data) {
                continue;
            }
            let val = selectedNodes[i].data.text;
            let isHorizontal = true;
            for (let idx in val) {
                if ("\n" === val[idx]) {
                    isHorizontal = false;
                    break;
                }
            }
            let text = "";
            let html = "";
            if (isHorizontal) {
                for (let idx in val) {
                    if ("\n" === val[idx]) {
                        continue;
                    }
                    text += val[idx] + "\n";

                    html += "<p>" + val[idx] + "</p>";
                }
            } else {
                for (let idx in val) {
                    if ("\n" === val[idx]) {
                        continue;
                    }
                    text += val[idx];
                }
                html = "<p>" + text + "</p>";
            }
            selectedNodes[i].data.text = text;
            selectedNodes[i].data.html = html;
        }
        getMinder().renderNodeBatch(selectedNodes);
        getMinder().layout();
        if (!gmExt.container) {
            let container = searchVueByDomClassName(window.app, 'editor-container');
            if (container) {
                gmExt.container = container;
            }
        }
        if (gmExt.container) {
            gmExt.container.saveFile();
        }
    }

    /**
     * 测试插件可用
     *
     * Ctrl Shift Alt G
     */
    function testExt() {
        alert('欢迎使用Gitmind-Ext');
    }

    //----------------------------original shortcut----------------------------//

    /**
     * 添加下级节点
     * tab
     * appendchildnode()
     */
    function appendChildNode() {
        executeCommand("appendchildnode");
    }

    /**
     * 添加同级节点
     * enter
     * appendsiblingnode()
     */
    function appendSiblingNode() {
        executeCommand("appendsiblingnode");
    }

    /**
     * 添加上级节点
     * shift tab
     * appendparentnode()
     */
    function appendParentNode() {
        executeCommand("appendparentnode");
    }

    /**
     * 删除选中节点
     * delete
     * remotesubtree()
     */
    function deleteSubTree() {
        executeCommand("remotesubtree");
    }

    /**
     * 删除节点
     * shift delete
     * remotesinglenode()
     * movetoparent(childrenNode, parentNode, oriOrder)
     */
    function deleteSingleNode() {
        let needDeleteNode = getSelectedNode();
        let oriOrder = getOriOrder(needDeleteNode);
        let parentNode = needDeleteNode.parent;
        let children = needDeleteNode.children;
        executeCommand("removesinglenode");
        if (oriOrder !== -1) {
            executeCommand("movetoparent", children, parentNode, oriOrder);
        }
    }

    /**
     * 上移节点
     * Alt Up
     * arrangeup()
     */
    function nodeArrangeUp() {
        executeCommand("arrangeup");
        getMinder().layout();
    }

    /**
     * 下移节点
     * Alt Down
     * arrangedown()
     */
    function nodeArrangeDown() {
        executeCommand("arrangedown");
        getMinder().layout();
    }

    /**
     * 清除样式
     * Alt D
     * clearstyle()
     */
    function clearStyle() {
        executeCommand("clearstyle");
    }

    /**
     * 插入链接
     * Ctrl Alt K
     */
    function insertLink() {
        let linkEl = $('.icon-link');
        if (linkEl.length) {
            linkEl.click();
        }
    }

    /**
     * 插入备注
     * Ctrl Alt M
     */
    function insertNote() {
        let noteEl = $('.icon-beizhu');
        if (noteEl.length) {
            noteEl.click();
        }
    }

    /**
     * 插入概括
     * Ctrl Alt T
     * addgeneralize()
     */
    function addGeneralize() {
        let selectedNodes = getSelectedNodes();
        if (selectedNodes.length < 2) {
            return;
        }
        executeCommand("addgeneralize");
    }

    /**
     * 插入图片
     * Alt P
     */
    function insertPhoto() {
        let photoEl = $('.icon-tupian');
        if (photoEl.length) {
            photoEl.click();
        }
    }

    /**
     * 插入关系线
     * F4
     * appendrelline()
     */
    function nodeAppenDrelLine() {
        executeCommand("appendrelline");
    }

    /**
     * 重置缩放
     * Ctrl 0
     * zoom()
     */
    function zoomReset() {
        executeCommand("zoom");
    }

    /**
     * 整理布局
     * Ctrl Shift L
     * resetlayout()
     */
    function resetLayout() {
        executeCommand("resetlayout");
    }

    //----------------------------bind custom shortcut----------------------------//

    /**
     * 为功能保存自定义快捷键
     * @param featureCode 功能名称
     * @param shortcut 自定义快捷键
     */
    function storeCustomShortcut(featureCode, shortcut) {
        let shortcutCode = shortcut2code(shortcut);
        // 绑定快捷键
        bindShortcut(featureCode, shortcutCode);
        // 保存快捷键
        gmExt.cookie.customShortcuts[featureCode] = shortcutCode;
        storeDataToCookie();
    }

    /**
     * 绑定所有快捷键
     */
    function bindAllShortcut() {
        Object.keys(gmExt.cookie.customShortcuts).forEach((key) => {
            gmExt.bindMap[key].code = gmExt.cookie.customShortcuts[key];
        })
    }

    /**
     * 绑定单个快捷键
     */
    function bindShortcut(featureCode, shortcutCode) {
        gmExt.bindMap[featureCode].code = shortcutCode;
    }

    /**
     * 功能名称转功能代码
     *
     * @param featureName 功能名称
     * @returns {*|{insertLink: string, resetLayout: string, appendSiblingNode: string, nodeArrangeDown: string, appendParentNode: string, appendChildNode: string, addGeneralize: string, clearStyle: string, nodeArrangeUp: string, nodeAppenDrelLine: string, deleteSubTree: string, insertNote: string, insertPhoto: string, zoomReset: string, deleteSingleNode: string}|null}
     */
    function featureName2featureCode(featureName) {
        let map = gmExt.featureCodeNameMap;
        if (!featureName) {
            return map;
        }
        for (let key in map) {
            if (featureName.trim() === map[key]) {
                return key;
            }
        }
        return null;
    }

    /**
     * 根据功能代码获取cookie中保存的自定义快捷键
     *
     * @param featureCode 功能代码
     * @returns {*}
     */
    function getShortcutCode4featureCode(featureCode) {
        if (featureCode === null) {
            return null;
        }
        return gmExt.cookie.customShortcuts[featureCode];
    }

    /**
     * 快捷键码转快捷键描述符
     * example:111068 => Ctrl Shift Alt D
     *
     * @param code 快捷键码
     * @returns {string}
     */
    function code2shortcut(code) {
        if (!code) {
            return '';
        }
        let shortcut = '';
        if (parseInt(code / 100000) === 1) {
            code %= 100000;
            shortcut += 'Ctrl ';
        }
        if (parseInt(code / 10000) === 1) {
            code %= 10000;
            shortcut += 'Shift ';
        }
        if (parseInt(code / 1000) === 1) {
            code %= 1000;
            shortcut += 'Alt ';
        }
        return shortcut + gmExt.keyCodeToChar[code];
    }

    /**
     * 快捷键描述符转快捷键码
     * example:Ctrl Shift Alt D => 111068
     *
     * @param shortcut 快捷键描述符
     * @returns {number}
     */
    function shortcut2code(shortcut) {
        if (!shortcut || !shortcut.trim().length) {
            return 0;
        }
        shortcut = shortcut.trim();
        let key = shortcut.split(' ');
        let code = 0;
        let isCtrl, isShift, isAlt;
        for (let i = 0; i < key.length; i++) {
            let tmp = key[i].trim().toLowerCase();
            if (tmp === 'ctrl') {
                isCtrl = true;
            } else if (tmp === 'shift') {
                isShift = true;
            } else if (tmp === 'alt') {
                isAlt = true;
            } else {
                for (let keyChar in gmExt.keyCharToCode) {
                    if (keyChar.toLowerCase() === tmp) {
                        code = gmExt.keyCharToCode[keyChar];
                        break;
                    }
                }
            }
        }
        if (!code) {
            return 0;
        }
        if (isCtrl) {
            code += 100000;
        }
        if (isShift) {
            code += 10000;
        }
        if (isAlt) {
            code += 1000;
        }
        return code;
    }

    //----------------------------base func----------------------------//

    /**
     * 获取选定节点，选定多个时，返回最后一个
     *
     * @returns {*}
     */
    function getSelectedNodes() {
        return getMinder().getSelectedNodes();
    }

    /**
     * 获取选定节点列表
     *
     * @returns {*}
     */
    function getSelectedNode() {
        return getMinder().getSelectedNode();
    }

    /**
     * 执行gitmind内置的js命令
     *
     * @returns {boolean}
     */
    function executeCommand() {
        return getMinder().execCommand(...arguments);
    }

    /**
     * 获取minder对象
     *
     * @returns {*}
     */
    function getMinder() {
        return window.minder;
    }

    /**
     * 获取节点当前顺序
     *
     * @param selectedNode 节点
     * @returns {number} 顺序
     */
    function getOriOrder(selectedNode) {
        let parentNode = selectedNode.parent;
        if (parentNode) {
            let brother = parentNode.children;
            for (let i = 0; i < brother.length; i++) {
                if (selectedNode.data.id === brother[i].data.id) {
                    return i;
                }
            }
        }
        return -1;
    }

    /**
     * 从cookie中加载数据
     */
    function loadDataFromCookie() {
        $.cookie.json = true;
        let cookie = $.cookie('gitmind-ext');
        if (!cookie) {
            cookie = {};
        }
        gmExt.cookie = cookie;
    }

    /**
     * 保存数据到cookie中
     */
    function storeDataToCookie() {
        $.cookie.json = true;
        $.cookie('gitmind-ext', gmExt.cookie, {expires: 365 * 10});
    }

    /**
     * 获取快捷键绑定的功能
     *
     * @param e 快捷键事件
     * @returns {null|*}
     */
    function choiceFun(e) {
        let shortcutCode = 0;
        shortcutCode = shortcutCode + e.ctrlKey;
        shortcutCode = (shortcutCode * 10) + e.shiftKey;
        shortcutCode = (shortcutCode * 10) + e.altKey;
        shortcutCode = (shortcutCode * 1000) + e.keyCode;
        let binMap = gmExt.bindMap;
        for (let key in binMap) {
            if (shortcutCode === binMap[key].code) {
                return binMap[key].fun;
            }
        }
        return null;
    }

    /**
     * 渲染markdown
     *
     * @param content 待渲染内容
     * @returns {*}
     */
    function markedContent(content) {
        marked.setOptions({
            gfm: true,
            tables: true,
            breaks: true,
            pedantic: false,
            sanitize: false,
            smartLists: true,
            smartypants: true
        });
        return marked.parse(content);
    }

    /**
     * readMe
     *
     * @returns {string}
     */
    function getExtHelpReadMe() {
        return '### gitMind-ext（GM扩展插件）\n' +
            '##### 功能：\n' +
            '- **左移节点（Alt+Left）**\n' +
            '- **右移节点（Alt+Right）**\n' +
            '- **渲染markdown（Alt+M）**\n' +
            '在新标签页渲染备注以[markdown]/n(回车)开头的内容\n' +
            '- **转置节点（Alt+Shift+T）**\n' +
            '- **自定义原生快捷键**\n' +
            '点击快捷键按钮，在具体功能输入自定义快捷键，保存即可。恢复原生快捷键时清空输入框并保存即可。\n' +
            '\n' +
            '本人非专业前端开发，美观方面无能为力了\\~.\\~。\n' +
            '扩展插件作为官方尚未实现功能的部分补充，用于提升使用的舒适感。\n' +
            'github：[https://github.com/ZhenhuiSu/gitMind-ext](https://github.com/ZhenhuiSu/gitMind-ext "gitMind-ext")\n' +
            '欢迎PR，感谢star。';
    }

    /**
     * 搜索vue对象
     *
     * @param root 搜索节点
     * @param className vue对象名
     * @returns {null|{$el}|{_isVue}|*}
     */
    function searchVueByDomClassName(root, className) {
        let isVue = root && root._isVue;
        if (!isVue) return null;
        if (root.$el && root.$el.className === className) return root;
        let children = root.$children;
        let result;
        if (children) {
            for (let i = 0; i < children.length; i++) {
                result = searchVueByDomClassName(children[i], className);
                if (result) {
                    return result;
                }
            }
        }
        return null;
    }
})();
