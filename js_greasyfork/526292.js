// ==UserScript==
// @name         「百炼英雄」键盘辅助
// @namespace    http://tampermonkey.net/
// @version      2025-08-17
// @description  百炼英雄键盘辅助：方向键/WASD移动，ESC关闭弹窗或返回上一级，B背包，M地图，E邮件
// @author       zzliux
// @match        https://mprogram.boomegg.cn/box/game/wx77200645d1c7f35f/h5?appid=wx77200645d1c7f35f&game_platform=h5
// @icon         https://www.google.com/s2/favicons?sz=64&domain=boomegg.cn
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/526292/%E3%80%8C%E7%99%BE%E7%82%BC%E8%8B%B1%E9%9B%84%E3%80%8D%E9%94%AE%E7%9B%98%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/526292/%E3%80%8C%E7%99%BE%E7%82%BC%E8%8B%B1%E9%9B%84%E3%80%8D%E9%94%AE%E7%9B%98%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    (async () => {
        const delay = async (timeout) => {
            await new Promise(resolve => {
                setTimeout(() => {
                    resolve();
                }, timeout);
            })
        }
        const waitForDom = async (selector, timeout) => {
            const t1 = Date.now();
            for (;;) {
                if (t1 + timeout <= Date.now()) return null;
                await delay(50);
                const res = document.querySelector(selector);
                console.log(res);
                if (res) {
                    return res;
                }
            }
        }

        async function waitForNodeActive(path, scaleFlag, timeout) {
            scaleFlag = scaleFlag || false;
            timeout = timeout || 30000;
            const t1 = Date.now();
            do {
                const node = ccFind1(path);
                if (node) {
                    if (node.active && node.activeInHierarchy) {
                        if (scaleFlag) {
                            if (node.scale.x === 1 && node.scale.y === 1) {
                                return node;
                            }
                        } else {
                            return node;
                        }
                    }
                }
                await delay(20);
            } while (Date.now() < t1 + timeout);
            throw new Error(`find path: [${path}] timeout in ${timeout}ms`);
        }

        function ccFind1(path, node) {
            if (!node) node = unsafeWindow.cc.director.getScene(); // 默认从场景根节点开始

            // 分割路径
            const parts = path.split('/');
            let currentNode = node;

            // 遍历路径的每一部分
            for (const part of parts) {
                if (!currentNode) break; // 中途找不到节点直接返回

                // 解析节点名称和索引（例如 HeroListItem[2]）
                const match = part.match(/(.+?)(?:\[(\d+)\])?$/);
                if (!match) continue;

                const nodeName = match[1];
                const index = match[2] ? parseInt(match[2], 10) : -1;

                // 查找直接子节点
                const children = currentNode.children;
                let targetNode = null;

                // 如果指定了索引
                if (index >= 0) {
                    // 过滤同名节点并按索引获取
                    const sameNameNodes = children.filter(child => child.name === nodeName);
                    if (index < sameNameNodes.length) {
                        targetNode = sameNameNodes[index];
                    } else {
                        console.error(`[findWithIndex] 索引超出范围：${nodeName}[${index}]`);
                        return null;
                    }
                } else {
                    // 未指定索引，直接通过 cc.find 查找
                    targetNode = currentNode.getChildByName(nodeName);
                }

                // 更新当前节点
                currentNode = targetNode;
            }
            return currentNode;
        }
        unsafeWindow.ccFind1 = ccFind1;

        function findNodesWithEvent(root, eventType, result) {
            if (!result) result = [];
            // 检查当前节点是否有该事件监听
            if (root.hasEventListener(eventType)) {
                result.push(root);
            }

            // 递归检查所有子节点
            const children = root.children;
            for (let i = 0; i < children.length; i++) {
                findNodesWithEvent(children[i], eventType, result);
            }

            return result;
        }

        function getNodePath(node) {
            let path = node.name;
            let parent = node.parent;
            while (parent) {
                path = `${parent.name}/${path}`;
                parent = parent.parent;
            }
            return path;
        }

        function getAllHasTouchEventNode() {
            const nodesWithTouchEnd = findNodesWithEvent(unsafeWindow.cc.director.getScene(), unsafeWindow.cc.Node.EventType.TOUCH_END);
            return nodesWithTouchEnd;
        }

        async function nodeEventPress(node, timeout) {
            timeout = timeout || 50;
            node.emit(unsafeWindow.cc.Node.EventType.TOUCH_START);
            await delay(timeout);
            node.emit(unsafeWindow.cc.Node.EventType.TOUCH_END);
            await delay(timeout);
        }

        const canvasDom = await waitForDom('#GameCanvas', 30 * 1000);
        let width = canvasDom.clientWidth;
        let height = canvasDom.clientHeight;

        // 键盘状态跟踪
        const keysPressed = {
            left: false,
            right: false,
            up: false,
            down: false
        };

        // 确保canvas可以获得焦点
        canvasDom.tabIndex = 0;
        canvasDom.focus();

        // 事件监听
        canvasDom.addEventListener('keydown', handleKeyDown);
        canvasDom.addEventListener('keyup', handleKeyUp);

        function handleKeyDown(e) {
            e.preventDefault();

            switch (e.code) {
                case 'ArrowLeft':
                case 'KeyA': keysPressed.left = true; break;
                case 'ArrowRight':
                case 'KeyD': keysPressed.right = true; break;
                case 'ArrowUp':
                case 'KeyW': keysPressed.up = true; break;
                case 'ArrowDown':
                case 'KeyS': keysPressed.down = true; break
                case 'Escape': back(); break;
                case 'KeyM': map(); break;
                case 'KeyB': bag(); break;
                case 'KeyE': email(); break;
                default: return;
            }

            // 更新摇杆位置
            updateJoystickPosition();
        }

        // 打开邮件
        async function email() {
            const arr = [
                'Root/UIScene/UICanvas/Menu/MenuView/SaveArea/UpRight/MoreMenuIconView',
                'Root/UIScene/UICanvas/Popup/MoreMenuIconPanelView/Content/EmailMenuIconView',
            ];
            for (let i = 0; i < arr.length; i++) {
                const node = await waitForNodeActive(arr[i], true, 1000);
                if (node) await nodeEventPress(node);
            }
            return;
        }

        // 打开背包
        async function bag() {
            const arr = [
                'Root/UIScene/UICanvas/Menu/MenuView/SaveArea/UpRight/MoreMenuIconView',
                'Root/UIScene/UICanvas/Popup/MoreMenuIconPanelView/Content/BagMenuIconView',
            ];
            for (let i = 0; i < arr.length; i++) {
                const node = await waitForNodeActive(arr[i], true, 1000);
                if (node) await nodeEventPress(node);
            }
            return;
        }

        // 打开地图
        async function map() {
            const arr = [
                'Root/UIScene/UICanvas/Menu/MenuView/SaveArea/UpRight/MoreMenuIconView',
                'Root/UIScene/UICanvas/Popup/MoreMenuIconPanelView/Content/MiniMapMenuIconView',
            ];
            for (let i = 0; i < arr.length; i++) {
                const node = await waitForNodeActive(arr[i], true, 1000);
                if (node) await nodeEventPress(node);
            }
            return;
        }

        // 返回上一级
        function back() {
            const nodes = getAllHasTouchEventNode();
            const arr = nodes.reverse().map(node => getNodePath(node).replace(/^Start\//, '')).filter(str => {
                if (/^Root\/UIScene\/UICanvas\/(Popup|Content)\/Modal_[a-zA-Z]+?View/.test(str)) {
                    return true;
                }
                if (/^Root\/UIScene\/UICanvas\/(Popup|Content)\/.*?([Cc]lose_?[bB]tn|[bB]tn_?[cC]lose|[Bb]ack_?[bB]tn|[Bb]tn_?[Bb]ack)/.test(str)) {
                    return true;
                }
                return false;
            });

            for (let i = 0; i < arr.length; i++) {
                const node = ccFind1(arr[i]);
                if (node && node.active && node.activeInHierarchy) {
                    nodeEventPress(node);
                    return;
                }
            }
        };

        function handleKeyUp(e) {
            switch (e.code) {
                case 'ArrowLeft':
                case 'KeyA': keysPressed.left = false; break;
                case 'ArrowRight':
                case 'KeyD': keysPressed.right = false; break;
                case 'ArrowUp':
                case 'KeyW': keysPressed.up = false; break;
                case 'ArrowDown':
                case 'KeyS': keysPressed.down = false; break;
                default: return;
            }

            // 更新摇杆位置
            updateJoystickPosition();
        }

        let touchDowned = false;
        function updateJoystickPosition() {
            if (!touchDowned) {
                width = canvasDom.clientWidth;
                height = canvasDom.clientHeight;
            }

            // 计算偏移量
            let offsetX = 0, offsetY = 0;
            let centerX = width / 2, centerY = height * 3 / 4;
            let moved = false;
            if (keysPressed.left) { offsetX -= 100; moved = true; }
            if (keysPressed.right) { offsetX += 100; moved = true; }
            if (keysPressed.up) { offsetY -= 100; moved = true; }
            if (keysPressed.down) { offsetY += 100; moved = true; }

            // 更新摇杆坐标
            let currentX = centerX + offsetX;
            let currentY = centerY + offsetY;

            // 触发摇杆移动事件
            // 触发鼠标按下事件
            if (moved) {
                if (!touchDowned) {
                    const eventDown = new MouseEvent('mousedown', {
                        clientX: centerX,
                        clientY: centerY,
                    });
                    canvasDom.dispatchEvent(eventDown);
                    touchDowned = true;
                    setTimeout(() => {
                        const eventMove = new MouseEvent('mousemove', {
                            clientX: currentX,
                            clientY: currentY,
                        });
                        canvasDom.dispatchEvent(eventMove);
                    }, 10);
                } else {
                    const eventMove = new MouseEvent('mousemove', {
                        clientX: currentX,
                        clientY: currentY,
                    });
                    canvasDom.dispatchEvent(eventMove);
                }
            } else {
                const eventUp = new MouseEvent('mouseup', {
                    clientX: currentX,
                    clientY: currentY,
                });
                canvasDom.dispatchEvent(eventUp);
                touchDowned = false;
            }
        }
    })();
})();