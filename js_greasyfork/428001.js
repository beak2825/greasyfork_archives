// ==UserScript==
// @name         阻止阻止复制
// @namespace    https://lab.wsl.moe/
// @version      0.4
// @description  干烂剪切板接口，这样就不能阻止我复制了
// @author       MisakaMikoto
// @match        http://*/*
// @match        https://*/*
// @license MIT
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428001/%E9%98%BB%E6%AD%A2%E9%98%BB%E6%AD%A2%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/428001/%E9%98%BB%E6%AD%A2%E9%98%BB%E6%AD%A2%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {

    const realExecCommand = document.execCommand;
    const realAddEventListener = Element.prototype.addEventListener;

    let userSelected = localStorage.____userAllowClipboard____ != null && localStorage.____userAllowClipboard____ !== '';
    let userAllowed = localStorage.____userAllowClipboard____ === 'true';

    const setAllNodesSelectable = (node) => {
        if (!node || !node.style) return;
        const nodeStyleGetPropertyValue = node.style.getPropertyValue;
        node.style.getPropertyValue = (prop) => {
            if (prop === 'user-select') {
                return '';
            }
            node.style.___ = nodeStyleGetPropertyValue;
            const value = node.style.___(prop);
            node.style.___ = undefined;
            return value;
        };
        // node.style.setProperty('user-select', 'auto', 'important'); // This line will break baidu.com
        node.style.setProperty('user-select', '', 'important');
        if (node.childNodes) {
            for (let i of node.childNodes) {
                setAllNodesSelectable(i);
            }
        }
    };

    const setExecuteCommand = () => {
        setAllNodesSelectable(document.body);
        window.Clipboard = undefined;
        try {
            navigator.clipboard.writeText = undefined;
        } catch (e) {}
        if (document && document.oncopy) {
            if (!userSelected) {
                userSelected = true;
                userAllowed = confirm('该网站希望在全局页面上添加复制监听器，是否允许？');
            }
            if (!userAllowed) {
                console.warn('Permission denied to control clipboard.');
                document.oncopy = null;
                localStorage.____userAllowClipboard____ = 'false';
                return;
            } else {
                localStorage.____userAllowClipboard____ = 'true';
            }
        }
        if (document && document.body && document.body.oncopy) {
            if (!userSelected) {
                userSelected = true;
                userAllowed = confirm('该网站希望在全局页面上添加复制监听器，是否允许？');
            }
            if (!userAllowed) {
                console.warn('Permission denied to control clipboard.');
                document.body.oncopy = undefined;
                localStorage.____userAllowClipboard____ = 'false';
                return;
            } else {
                localStorage.____userAllowClipboard____ = 'true';
            }
        }
        if (document && document.onselectstart) {
            if (!userSelected) {
                userSelected = true;
                userAllowed = confirm('该网站希望在全局页面上添加复制监听器，是否允许？');
            }
            if (!userAllowed) {
                console.warn('Permission denied to control clipboard.');
                document.onselectstart = null;
                localStorage.____userAllowClipboard____ = 'false';
                return;
            } else {
                localStorage.____userAllowClipboard____ = 'true';
            }
        }
        if (document && document.body && document.body.onselectstart) {
            if (!userSelected) {
                userSelected = true;
                userAllowed = confirm('该网站希望在全局页面上添加选择文本监听器，是否允许？');
            }
            if (!userAllowed) {
                console.warn('Permission denied to control clipboard.');
                document.body.onselectstart = undefined;
                localStorage.____userAllowClipboard____ = 'false';
                return;
            } else {
                localStorage.____userAllowClipboard____ = 'true';
            }
        }
        const changeListener = (parent, keyTree) => {
            if (!parent || !keyTree || keyTree === '') { return; }
            keyTree = keyTree.split('.');
            const originalCallbackFunction = (() => {
                let objParent = null;
                let obj = parent;
                let lastKey = '';
                for (let i of keyTree) {
                    objParent = obj;
                    obj = obj[i];
                    lastKey = i;
                }
                return {
                    objParent,
                    obj,
                    lastKey
                };
            })();
            if (originalCallbackFunction == null || originalCallbackFunction.objParent == null || originalCallbackFunction.obj == null) {
                return;
            }
            originalCallbackFunction.objParent[originalCallbackFunction.lastKey] = (event) => {
                var handledFunctionFingerprint=1;handledFunctionFingerprint=0;
                    if(event && event.code === 'F12') {
                        return;
                    }
                originalCallbackFunction.obj(event);
            };
        }
        changeListener(document, 'onkeypress');
        changeListener(document, 'onkeydown');
        changeListener(document, 'onkeyup');
        changeListener(document.body, 'onkeypress');
        changeListener(document.body, 'onkeydown');
        changeListener(document.body, 'onkeyup');
        changeListener(window, 'onkeypress');
        changeListener(window, 'onkeydown');
        changeListener(window, 'onkeyup');
        Document.prototype.execCommand = (cmd) => {
            switch (cmd) {
                case "copy":
                case "cut":
                case "paste":
                    if (!userSelected) {
                        userSelected = true;
                        userAllowed = confirm('该网站希望请求一次修改剪贴板的权限，是否允许？');
                    }
                    if (!userAllowed) {
                        console.warn('Permission denied to control clipboard.');
                        localStorage.____userAllowClipboard____ = 'false';
                        return;
                    } else {
                        localStorage.____userAllowClipboard____ = 'true';
                    }
                    break;
            }
            realExecCommand(cmd);
        };
        //Element.prototype.realAddEventListener = realAddEventListener;
        Element.prototype.addEventListener = function(...args) {
            //const functionCode = p.toString();
            const event = args[0];
            switch (event) {
                case "copy":
                case "cut":
                case "paste":
                    if (!userSelected) {
                        userSelected = true;
                        userAllowed = confirm('该网站希望在某个元素上添加复制事件监听器，是否允许？');
                    }
                    if (!userAllowed) {
                        console.warn('Permission denied to control clipboard.');
                        localStorage.____userAllowClipboard____ = 'false';
                        return;
                    } else {
                        localStorage.____userAllowClipboard____ = 'true';
                    }
                    break;
            }
            return realAddEventListener.apply(this, args);
        }
    };
    setExecuteCommand();
    const intervalId = setInterval(setExecuteCommand, 1000);
})();