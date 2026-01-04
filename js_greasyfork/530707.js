// ==UserScript==
// @name        样式调整粉笔
// @namespace   Violentmonkey Scripts
// @match       https://spa.fenbi.com/ti/exam/solution/1_3e_201smaa*
// @grant       none
// @version     1.0.0.4
// @match        *://spa.fenbi.com/ti/exam/solution*
// @author      lhy
// @description 2025/3/13 09:35:25
// @downloadURL https://update.greasyfork.org/scripts/530707/%E6%A0%B7%E5%BC%8F%E8%B0%83%E6%95%B4%E7%B2%89%E7%AC%94.user.js
// @updateURL https://update.greasyfork.org/scripts/530707/%E6%A0%B7%E5%BC%8F%E8%B0%83%E6%95%B4%E7%B2%89%E7%AC%94.meta.js
// ==/UserScript==

// 通过创建 <style> 标签添加 CSS
// ==UserScript==
// @name        New script textdb.online
// @namespace   Violentmonkey Scripts
// @match        *://www.fenbi.com/*
// @match        *://spa.fenbi.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 2025/3/24 14:48:29
// ==/UserScript==


// 通过创建 <style> 标签添加 CSS
const style = document.createElement('style');
style.textContent = `
  @import url('https://unpkg.com/antd@4.24.11/dist/antd.min.css');
`;
document.head.appendChild(style);

// 加载 Babel
const babelScript = document.createElement('script');
babelScript.src = 'https://unpkg.com/@babel/standalone/babel.min.js';
document.head.appendChild(babelScript);

// 加载 React 和 ReactDOM
const reactScript = document.createElement('script');
reactScript.src = 'https://unpkg.com/react@17.0.2/umd/react.production.min.js';
document.head.appendChild(reactScript);

const reactDOMScript = document.createElement('script');
reactDOMScript.src = 'https://unpkg.com/react-dom@17.0.2/umd/react-dom.production.min.js';
document.head.appendChild(reactDOMScript);

// 加载 Ant Design
const antdScript = document.createElement('script');
antdScript.src = 'https://unpkg.com/antd@4.24.11/dist/antd.min.js';
document.head.appendChild(antdScript);

// 等待所有脚本加载完成
const waitForScripts = () => {
    return new Promise((resolve) => {
        const check = () => {
            if (window.React && window.ReactDOM && window.antd && window.Babel) {
                resolve();
            } else {
                setTimeout(check, 300);
            }
        };
        check();
    });
};

waitForScripts().then(() => {
    setTimeout(() => {
        main()
    }, 5000)
});

function main() {
    const { React, ReactDOM } = window;
    const { Drawer, Modal ,Input,message,Space,Button,notification} = window.antd;
    const { useState, useEffect } = React;
    const Babel = window.Babel;

    // 创建一个简单的 React 应用
    const appCode = `
        const App = () => {

            const [modalVisible, setModalVisible] = useState(true);

            const next = () => {
                handle();
                message.success('执行成功！');
                setModalVisible(false);
                notification.open({
                message: '样式调整完毕！',
                description:
                    '删除vip视频区域，调整资料分析布局自上而下全展开，全展开所有解析',
                onClick: () => {
                    console.log('Notification Clicked!');
                },
                });
                        }

                        async function handle() {
            await delVIPGuanggao();
            await openAnswer();
            await delNote();
            await ziliaofenxiDivOpen();
            await delPadding()
            console.log("执行完毕");
            }

            // 封装删除元素的函数
            function removeElements(selector) {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element) => {
                if (element.parentNode) {
                element.parentNode.removeChild(element);
                }
            });
            }

            // 封装移除样式属性的函数
            function removeStyleProperties(selector, properties) {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element) => {
                properties.forEach((property) => {
                element.style.removeProperty(property);
                });
            });
            }

            // 封装设置样式属性的函数
            function setStyleProperties(selector, property, value) {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element) => {
                element.style[property] = value;
            });
            }

            function delVIPGuanggao() {
            removeElements('.solution-video-container, .solution-title-container');
            }

            function openAnswer() {
            removeStyleProperties('.result-common-container', ['height']);
            }

            function delNote() {
            removeElements('[id^="section-note-"]');
            }

            function ziliaofenxiDivOpen() {
            removeStyleProperties('.resizable-container', ['height']);
            setStyleProperties('.resizable-container', 'flexDirection', 'column');
            removeStyleProperties('.nz-resizable.left', ['width', 'height']);
            removeElements('.questions-anchors');
            }

            function delPadding(){
            const solutionMainElements = document.querySelectorAll('.solution-main');
                    solutionMainElements.forEach((element) => {
                        element.style.padding = '0';
                        element.style.maxWidth = 'none';
                    });
            }



            return (

                    <Modal title="请输唯一标识" open={modalVisible} onOk={next} onCancel={() => setModalVisible(false)}>
                        <div>是否执行脚本</div>
                    </Modal>
            );
        };

        let footerElement = document.getElementById('main');
        if (!footerElement) {
            footerElement = document.createElement('div');
            footerElement.id = 'main';
            document.body.appendChild(footerElement);
        }

        // 渲染 React 应用
        ReactDOM.render(<App />, footerElement);
    `;

    try {
        const compiledCode = Babel.transform(appCode, { presets: ['react'] }).code;
        new Function('React', 'ReactDOM', 'Drawer', 'Modal','Input','message', 'useState', 'useEffect','Space','Button','notification', compiledCode)(
            React,
            ReactDOM,
            Drawer,
            Modal,
            Input,
          message,
            useState,
            useEffect,
          Space,
          Button,
          notification,
        );
    } catch (error) {
        console.error('Babel 编译出错:', error);
    }
}



