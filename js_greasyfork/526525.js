// ==UserScript==
// @name         測試選單
// @namespace    test-menu
// @version      1.0.0
// @description  測試選單介面
// @author       Test
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/526525/%E6%B8%AC%E8%A9%A6%E9%81%B8%E5%96%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/526525/%E6%B8%AC%E8%A9%A6%E9%81%B8%E5%96%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 語言包
    const lang = {
        set: '設置',
        iconPosition: '圖標位置',
        playVideo: '視頻解析',
        playMusic: '音樂下載',
        zhNice: '知乎增強',
        videoDownload: '視頻下載',
        iconHeight: '圖標高度',
        iconWidth: '圖標大小',
        iconLine: '水平位置',
        iconWaitTime: '等待時間',
        iconLeft: '靠左',
        iconRight: '靠右',
        tipIconHeight: '默認360,建議1~500',
        tipIconWidth: '默認40,建議20~50',
        tipIconOpacity: '請填寫0-100的整數',
        setPlayVideo: '解析設置',
        playVideoLineAdd: '站外解析',
        tipPlayVideoLineAdd: '請填入線路名稱和地址，中間用半角逗號隔開，每線路一行。',
        zhSet: '知乎設置',
        zhVideoClose: '屏蔽視頻',
        zhVideoDownload: '視頻下載',
        zhADClose: '屏蔽廣告',
        zhCloseLeft: '關閉側邊欄',
        zhChangeLink: '鏈接直接跳轉',
        specialColumn: '標記文章',
        videoTitle: '標記視頻',
        scriptsinstall: '腳本安裝',
        scriptsuse: '使用方法',
        question: '常見問題',
        tggroup: 'Telegram'
    };

    class TestMenu {
        constructor() {
            this.initMenu();
            this.iconVipTop = 360;
            this.iconVipPosition = 'left';
        }

        initMenu() {
            GM_registerMenuCommand(lang.set, () => this.menuSet());
            this.setStyle();
        }

        setStyle() {
            const domStyle = document.createElement('style');
            const domHead = document.getElementsByTagName('head')[0];

            let menuSetStyle = `
                .zhmMask{
                    z-index:999999999;
                    background-color:#000;
                    position: fixed;top: 0;right: 0;bottom: 0;left: 0;
                    opacity:0.8;
                }
                .zhm_wrap-box{
                    z-index:1000000000;
                    position:fixed;top: 50%;left: 50%;transform: translate(-50%, -200px);
                    width: 300px;
                    color: #555;
                    background-color: #fff;
                    border-radius: 5px;
                    overflow:hidden;
                    font:16px numFont,PingFangSC-Regular,Tahoma,Microsoft Yahei,sans-serif !important;
                    font-weight:400 !important;
                }
                .zhm_setWrapLi{
                    margin:0px;padding:0px;
                }
                .zhm_setWrapLi li{
                    background-color: #fff;
                    border-bottom:1px solid #eee;
                    margin:0px !important;
                    padding:12px 20px;
                    display: flex;
                    justify-content: space-between;align-items: center;
                    list-style: none;
                }
                .zhm_setWrapLiContent{
                    display: flex;justify-content: space-between;align-items: center;
                }
                .zhm_iconSetFoot{
                    position:absolute;bottom:0px;padding:10px 20px;width:100%;
                    z-index:1000000009;background:#fef9ef;
                }
                .zhm_iconSetFootLi{
                    margin:0px;padding:0px;
                }
                .zhm_iconSetFootLi li{
                    display: inline-flex;
                    padding:0px 2px;
                    justify-content: space-between;align-items: center;
                    font-size: 12px;
                }
                .zhm_iconSetFootLi li a{
                    color:#555;
                }
                .zhm_iconSetPage{
                    z-index:1000000001;
                    position:absolute;top:0px;left:300px;
                    background:#fff;
                    width:300px;
                    height:100%;
                    display:none;
                }
                .zhm_iconSetUlHead{
                    padding:0px;
                    margin:0px;
                }
                .zhm_iconSetPageHead{
                    border-bottom:1px solid #ccc;
                    height:40px;
                    line-height:40px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background-color:#fe6d73;
                    color:#fff;
                    font-size: 15px;
                }
                .zhm_iconSetPageLi{
                    margin:0px;padding:0px;
                }
                .zhm_iconSetPageLi li{
                    list-style: none;
                    padding:8px 20px;
                    border-bottom:1px solid #eee;
                }
                .zhm_back{
                    border: solid #FFF;
                    border-width: 0 3px 3px 0;
                    display: inline-block;
                    padding: 3px;
                    transform: rotate(135deg);
                    -webkit-transform: rotate(135deg);
                    margin-left:10px;
                    cursor:pointer;
                }
                .zhm_to-right{
                    margin-left:20px;
                    display: inline-block;
                    padding: 3px;
                    transform: rotate(-45deg);
                    -webkit-transform: rotate(-45deg);
                    cursor:pointer;
                    border: solid #CCC;
                    border-width: 0 3px 3px 0;
                }
                .zhm_to-right.disabled{
                    border-color: #EEE;
                    cursor: default;
                }
                .zhm_circular{
                    width: 40px;
                    height: 20px;
                    border-radius: 16px;
                    transition: .3s;
                    cursor: pointer;
                    box-shadow: 0 0 3px #999 inset;
                }
                .zhm_round-button{
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    box-shadow: 0 1px 5px rgba(0,0,0,.5);
                    transition: .3s;
                    position: relative;
                }
                .zhm_text-input {
                    font-size: 16px;
                    position: relative;
                    right:0px;
                    z-index: 0;
                }
                .zhm_text-input__body {
                    -webkit-appearance: none;
                    background-color: transparent;
                    border: 1px solid #c2c2c2;
                    border-radius: 3px;
                    height: 1.7em;
                    line-height: 1.7;
                    padding: 2px 1em;
                    width:55%;
                    font-size:14px;
                    box-sizing: initial;
                }
                .zhm_select-box {
                    box-sizing: inherit;
                    font-size: 16px;
                    position: relative;
                    width:90px;
                }
                .zhm_select-box__body {
                    -webkit-appearance: none;
                    background-color: transparent;
                    border: 1px solid #c2c2c2;
                    border-radius: 3px;
                    cursor: pointer;
                    height: 1.7em;
                    line-height: 1.7;
                    padding-left: 1em;
                    padding-right: calc(1em + 16px);
                    width: 140%;
                    font-size:14px;
                    padding-top:2px;
                    padding-bottom:2px;
                }
                .zhm_toLeftMove{
                    animation:moveToLeft 0.5s infinite;
                    -webkit-animation:moveToLeft 0.5s infinite;
                    animation-iteration-count:1;
                    animation-fill-mode: forwards;
                }
                @keyframes moveToLeft{
                    from {left:300px;}
                    to {left:0px;}
                }
                @-webkit-keyframes moveToLeft{
                    from {left:300px;}
                    to {left:0px;}
                }
                .zhm_toRightMove{
                    animation:moveToRight 0.5s infinite;
                    -webkit-animation:moveToRight 0.5s infinite;
                    animation-iteration-count:1;
                    animation-fill-mode: forwards;
                }
                @keyframes moveToRight{
                    from {left:0px;}
                    to {left:300px;}
                }
                @-webkit-keyframes moveToRight{
                    from {left:0px;}
                    to {left:300px;}
                }
            `;
            
            domStyle.appendChild(document.createTextNode(menuSetStyle));
            domHead.appendChild(domStyle);
        }

        menuSet() {
            // 選單設置數據
            const setListJson = [
                {listName:lang.iconPosition, setListID:'iconPositionSetPage', setPageID:'movieIconSetPage', takePlace:'0px'},
                {listName:lang.playVideo, setListID:'movieList', setPageID:'movieVideoSetPage', takePlace:'0px'},
                {listName:lang.playMusic, setListID:'musicList', setPageID:'', takePlace:''},
                {listName:lang.zhNice, setListID:'zhihuList', setPageID:'zhihuIconSetPage', takePlace:'220px'},
                {listName:lang.videoDownload, setListID:'videoDownloadList', setPageID:'videoDownloadSetPage', takePlace:'0px'},
                {listName:'夜間模式', setListID:'blackmodeList', setPageID:'', takePlace:''}
            ];

            // 創建主選單HTML
            let setHtml = '<div id="setMask" class="zhmMask"></div>';
            setHtml += '<div class="zhm_wrap-box" id="setWrap">';
            
            // 添加設置選單標題
            setHtml += `
            <ul class='zhm_iconSetUlHead'>
                <li class='zhm_iconSetPageHead'>
                    <span></span>
                    <span>${lang.set}</span>
                    <span class='zhm_iconSetSave'>×</span>
                </li>
            </ul>`;

            // 圖標位置設置頁面
            setHtml += `
            <div class='zhm_iconSetPage' id='movieIconSetPage'>
                <ul class='zhm_iconSetUlHead'>
                    <li class='zhm_iconSetPageHead'>
                        <span class='zhm_back'></span>
                        <span>${lang.iconPosition}</span>
                        <span class='zhm_iconSetSave'>×</span>
                    </li>
                </ul>
                <ul class='zhm_iconSetPageLi'>
                    <li>${lang.iconHeight}：
                        <span class='zhm_text-input'>
                            <input class='zhm_text-input__body' id='iconTop' value='${this.iconVipTop}' placeholder='${lang.tipIconHeight}'>
                        </span>
                    </li>
                    <li>${lang.iconLine}：
                        <div class='zhm_select-box'>
                            <select class='zhm_select-box__body' id='iconPosition'>
                                <option value='left' ${this.iconVipPosition=='left'?'selected':''}>${lang.iconLeft}</option>
                                <option value='right' ${this.iconVipPosition=='right'?'selected':''}>${lang.iconRight}</option>
                            </select>
                        </div>
                    </li>
                </ul>
            </div>`;

            // 視頻解析設置頁面
            setHtml += `
            <div class='zhm_iconSetPage' id='movieVideoSetPage'>
                <ul class='zhm_iconSetUlHead'>
                    <li class='zhm_iconSetPageHead'>
                        <span class='zhm_back'></span>
                        <span>${lang.setPlayVideo}</span>
                        <span class='zhm_iconSetSave'>×</span>
                    </li>
                </ul>
                <ul class='zhm_iconSetPageLi'>
                    <li>
                        <span>${lang.playVideoLineAdd}</span>
                        <div class='zhm_circular' id='videoPlayLineAdd' style='background-color:#FFE5E5'>
                            <div class='zhm_round-button' style='background:#fe6d73;left:22px'></div>
                        </div>
                    </li>
                    <li>
                        <textarea id='playVideoLineTextarea' placeholder='${lang.tipPlayVideoLineAdd}' style='width:100%;height:200px;'></textarea>
                    </li>
                </ul>
            </div>`;

            // 知乎增強設置頁面
            setHtml += `
            <div class='zhm_iconSetPage' id='zhihuIconSetPage'>
                <ul class='zhm_iconSetUlHead'>
                    <li class='zhm_iconSetPageHead'>
                        <span class='zhm_back'></span>
                        <span>${lang.zhSet}</span>
                        <span class='zhm_iconSetSave'>×</span>
                    </li>
                </ul>
                <ul class='zhm_iconSetPageLi'>
                    <li>
                        <span>${lang.zhVideoClose}</span>
                        <div class='zhm_circular' id='removeVideo' style='background-color:#FFF'>
                            <div class='zhm_round-button' style='background:#fff;left:0px'></div>
                        </div>
                    </li>
                    <li>
                        <span>${lang.zhVideoDownload}</span>
                        <div class='zhm_circular' id='downloadVideo' style='background-color:#FFE5E5'>
                            <div class='zhm_round-button' style='background:#fe6d73;left:22px'></div>
                        </div>
                    </li>
                </ul>
            </div>`;

            // 主選單列表
            setHtml += '<ul class="zhm_setWrapLi">';
            
            setListJson.forEach(item => {
                const listValue = GM_getValue(item.setListID, item.setListID=='blackmodeList'?'0':'22');
                const backColor = listValue != '22' ? '#fff' : '#fe6d73';
                const switchBackColor = listValue != '22' ? '#FFF' : '#FFE5E5';
                
                setHtml += `
                <li>
                    <span>${item.listName}</span>
                    <div class='zhm_setWrapLiContent'>
                        <div class='zhm_circular' style='background-color:${switchBackColor}' id='${item.setListID}'>
                            <div class='zhm_round-button' style='background:${backColor};left:${listValue}px'></div>
                        </div>
                        <span class='zhm_to-right ${!item.setPageID ? "disabled" : ""}' ${item.setPageID ? `data='${item.setPageID}' takePlace='${item.takePlace}'` : ""}></span>
                    </div>
                </li>`;
            });

            setHtml += '</ul>';
            
            // 底部
            setHtml += `
            <div class='zhm_iconSetFoot'>
                <ul class='zhm_iconSetFootLi'>
                    <li><a href='https://t.me/+sGo6ZZvy54wzYTll' target='_blank'>${lang.tggroup}</a></li>
                </ul>
            </div>`;

            setHtml += '</div>';

            // 添加到頁面
            const div = document.createElement('div');
            div.id = 'zhmMenu';
            div.innerHTML = setHtml;
            document.body.appendChild(div);

            // 綁定事件
            this.bindEvents();
        }

        bindEvents() {
            // 開關按鈕點擊
            document.querySelectorAll('.zhm_circular').forEach(item => {
                item.addEventListener('click', (e) => {
                    const button = e.currentTarget.querySelector('.zhm_round-button');
                    const currentLeft = parseInt(button.style.left);
                    const newLeft = currentLeft == 0 ? 22 : 0;
                    
                    button.style.left = newLeft + 'px';
                    button.style.background = newLeft == 22 ? '#fe6d73' : '#fff';
                    e.currentTarget.style.backgroundColor = newLeft == 22 ? '#FFE5E5' : '#fff';
                    
                    GM_setValue(e.currentTarget.id, newLeft);
                });
            });

            // 次級選單切換
            document.querySelectorAll('.zhm_to-right:not(.disabled)').forEach(item => {
                item.addEventListener('click', (e) => {
                    const pageId = e.currentTarget.getAttribute('data');
                    const page = document.getElementById(pageId);
                    page.style.display = 'block';
                    page.className = 'zhm_iconSetPage zhm_toLeftMove';
                });
            });

            // 返回按鈕
            document.querySelectorAll('.zhm_back').forEach(item => {
                item.addEventListener('click', (e) => {
                    const page = e.currentTarget.closest('.zhm_iconSetPage');
                    page.className = 'zhm_iconSetPage zhm_toRightMove';
                    setTimeout(() => {
                        page.style.display = 'none';
                    }, 500);
                });
            });

            // 關閉按鈕
            document.querySelectorAll('.zhm_iconSetSave').forEach(item => {
                item.addEventListener('click', () => {
                    document.getElementById('zhmMenu').remove();
                });
            });
        }
    }

    new TestMenu();
})();