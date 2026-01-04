// ==UserScript==
// @name         yapiTots
// @namespace    yapiTots
// @version      0.0.6
// @description  yapi to ts
// @license      MIT
// @author       hjl
// @match        http://192.168.140.245:3000/*
// @match        http://192.168.140.152:3000/*
// @icon         https://img2.baidu.com/it/u=3318407772,3634490264&fm=253&fmt=auto?w=1200&h=767
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509940/yapiTots.user.js
// @updateURL https://update.greasyfork.org/scripts/509940/yapiTots.meta.js
// ==/UserScript==

window.whiteList = ['http://192.168.140.245:3000',"http://192.168.140.152:3000"]

if(!window.whiteList.includes(window.location.origin)){
    return
}


const vueUrl ='https://6465-develop-0ggt1xa152c00a65-1323643080.tcb.qcloud.la/yapi-ts/vue.js'
const axiosUrl = 'https://6465-develop-0ggt1xa152c00a65-1323643080.tcb.qcloud.la/yapi-ts/axios.js'



const elementCss='https://6465-develop-0ggt1xa152c00a65-1323643080.tcb.qcloud.la/yapi-ts/element-ui.css'
const elementJs ='https://6465-develop-0ggt1xa152c00a65-1323643080.tcb.qcloud.la/yapi-ts/element-ui.js'

function loadFiles(fileArray, callback) {
    let loadedCount = 0;

    function loadFile(file, type) {
        return new Promise((resolve, reject) => {
            if (type === 'js') {
                const script = document.createElement('script');
                script.src = file;
                script.onload = () => {
                    loadedCount++;
                    resolve();
                };
                script.onerror = () => {
                    reject(new Error(`Failed to load script: ${file}`));
                };
                document.head.appendChild(script);
            } else if (type === 'css') {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = file;
                link.onload = () => {
                    loadedCount++;
                    resolve();
                };
                link.onerror = () => {
                    reject(new Error(`Failed to load stylesheet: ${file}`));
                };
                document.head.appendChild(link);
            }
        });
    }

    function checkAllLoaded() {
        if (loadedCount === fileArray.length) {
            callback();
        }
    }

    fileArray.forEach(file => {
        const fileParts = file.split('.');
        const fileType = fileParts[fileParts.length - 1];
        loadFile(file, fileType).then(checkAllLoaded).catch(error => {
            console.error(error);
            checkAllLoaded();
        });
    });
}



function createScript (url,onLoad){
    var script = document.createElement('script');
    script.src = url;
    if(onLoad){
        script.onload=onLoad
    }
    return script
}


function createLink (url,onLoad){
    var link = document.createElement('link');
    link.href = url;
    link.setAttribute('rel','stylesheet');

    link.setAttribute('type','text/css');
    if(onLoad){
        link.onload=onLoad
    }
    return link
}

const app = document.createElement('div');

app.id='app'
document.body.appendChild(app);

        // 使用示例
loadFiles([ vueUrl, axiosUrl,elementCss,elementJs], () => {
    document.body.appendChild(createScript(`https://xyfali.postar.cn/risk-message/createTs.js?time=${new Date().getTime()}`))
});


