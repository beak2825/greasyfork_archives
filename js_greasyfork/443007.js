// ==UserScript==
// @name         进场和关注
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  记录直播间进场信息和直播间关注信息
// @author       太陽闇の力
// @include      /https?:\/\/live\.bilibili\.com\/(blanc\/)?\d+\??.*/
// @require      https://cdn.jsdelivr.net/gh/eric2788/bliveproxy@d66adfa34cbf41db3d313f49d0814e47cb3b6c4c/bliveproxy-unsafe.js
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443007/%E8%BF%9B%E5%9C%BA%E5%92%8C%E5%85%B3%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/443007/%E8%BF%9B%E5%9C%BA%E5%92%8C%E5%85%B3%E6%B3%A8.meta.js
// ==/UserScript==

(function() {
    //https?:\/\/live\.bilibili\.com\/(blanc\/)?23611306\??.*/
    //-----------UI区----------
    let isunfold = 0;
    let unfold = ["展开","收起"];
    // 总容器
    const container = window.document.createElement('div');
    container.style.cssText = 'width:600px;position:fixed;bottom:5px;left:5px;z-index:999;box-sizing:border-box;';

    // 工具名称
    const topTool = window.document.createElement('div');
    topTool.innerHTML = '进场&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;关注';
    topTool.style.cssText = 'text-align:center;line-height:20px;width:100%;color:rgb(210,143,166);font-size:14px;';

    // 最小化按钮
    const collapseButton = window.document.createElement('button');
    collapseButton.innerText = unfold[isunfold];
    collapseButton.style.cssText = 'float:right;width:40px;height:20px;border:none;cursor:pointer;background-color:#1890ff;border-radius:1px;color:#ffffff;';

    // 主窗口
    const mainWindow = window.document.createElement('div');
    mainWindow.style.cssText = 'display: flex;flex-wrap: wrap;justify-content:space-between;width:100%;background-color:rgba(220, 192, 221, .5);padding:10px;box-sizing:border-box;';
    if(isunfold==0){
        mainWindow.style.display = "none";
    }

    const today = new Date();
    const todaytring = String(today.getFullYear())+'-'+String(today.getMonth()+1)+'-'+String(today.getDate())+'\n'
    // 进场
    const textArea = window.document.createElement('textarea');
    textArea.value = todaytring;
    textArea.style.cssText = 'width:45%;height:180px;resize:none;outline:none;background-color:rgba(255,255,255,.5);border-radius:2px';
    // 关注
    const textArea2 = window.document.createElement('textarea');
    textArea2.value = todaytring;
    textArea2.style.cssText = 'width:45%;height:180px;resize:none;outline:none;background-color:rgba(255,255,255,.5);border-radius:2px';

    // 组装
    topTool.appendChild(collapseButton);
    container.appendChild(topTool);
    mainWindow.appendChild(textArea);
    mainWindow.appendChild(textArea2)
    container.appendChild(mainWindow);
    window.document.body.appendChild(container);
    // 显示逻辑控制
    collapseButton.addEventListener('click', () => {
        if (collapseButton.innerText === '收起') {
            mainWindow.style.display = 'none';
            collapseButton.innerText = '展开';
            return;
        }
        if (collapseButton.innerText === '展开') {
            mainWindow.style.display = 'flex';
            collapseButton.innerText = '收起';
            return;
        }
    }, false);
    function hdl(command){
        const data = command.data;
        const uid = data.uid;
        const uname = data.uname;
        const timestamp = data.timestamp*1000;
        const date = new Date(timestamp);
        const datestring = String(date.getHours())+":"+String(date.getMinutes());
        if(data.msg_type==1){
            textArea.value+=`【${uname}】${uid}|${datestring}\n`;

        }else if(data.msg_type==2){
            textArea2.value+=`【${uname}】${uid}|${datestring}\n`;
        }
    }
    bliveproxy.addCommandHandler('INTERACT_WORD', hdl);


})();