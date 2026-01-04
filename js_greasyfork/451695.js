// ==UserScript==
// @name        動畫瘋下載器
// @namespace
// @description 取得動畫的 m3u8 網址，並可使用 PotPlayer、MPV 播放，ffmpeg下載
// @version     1.7.5
// @author      XPRAMT
// @match       https://ani.gamer.com.tw/animeVideo.php?sn=*
// @connect     ani.gamer.com.tw
// @grant       none
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/451695/%E5%8B%95%E7%95%AB%E7%98%8B%E4%B8%8B%E8%BC%89%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/451695/%E5%8B%95%E7%95%AB%E7%98%8B%E4%B8%8B%E8%BC%89%E5%99%A8.meta.js
// ==/UserScript==
(function () {
    'use strict';
    ///////////全域變數///////////
    const mode = 0; //複製模式(0:複製完整指令|1:複製URL+名稱)
    const timeOut = 600;
    let m3u8_url = '';
    let Name = '';
    // 讀取已儲存的路徑，若無則使用預設
    let downloadPath = localStorage.getItem('anig_download_path') || '%USERPROFILE%/Downloads';
    // 從 URL 中獲取動畫的編號（AniVideoSn）
    let AniVideoSn = new URLSearchParams(window.location.search).get('sn');
    ////////////////////////////
    // 注入樣式到頁面中
    function injectStyles() {
        // 定義樣式
        const css =`
			.anig-ct {
				margin:5px;
				margin-left:17px;
    			font-size: 14px;
			}
			.anig-tb {
				display: inline-block;
				padding: 5px;
				background: #50b2d7;
				color: #FFF;
				margin-right: 5px;
				cursor: pointer;
    			border-radius: 2px;
		    }`;
        const style = document.createElement('style'); // 創建 <style> 元素
       style.textContent = css; // 設置樣式內容
        document.head.appendChild(style); // 將 <style> 添加到 <head>
    }
    //初始化InfoContainer
    function initInfoContainer() {
        //資訊顯示框
        infoDisplay.classList.add('anig-tb');
        infoDisplay.title = '打開Greasy Fork頁面'
        infoDisplay.addEventListener('click', function () {
            window.open('https://greasyfork.org/zh-TW/scripts/451695-動畫瘋下載器', '_blank');
        })
        infoContainer.appendChild(infoDisplay);
        // 輸入框
        const input = document.createElement('input');
        input.type = 'text';
        input.value = downloadPath;
        input.placeholder = '下載路徑';
        input.style.cssText = `
            margin-right: 5px;
            padding: 3px;
            background-color: #000;  /* 黑底 */
            color: #fff;             /* 白字 */
            border: None;
            display: none;           /* 預設隱藏 */
        `;
        // 儲存按鈕
        const path_btn = document.createElement('buttonSave');
        let def_text = '下載路徑'
        path_btn.textContent = def_text; // 初始文字
        path_btn.title = '修改下載路徑'
        path_btn.classList.add('anig-tb');
        let inputVisible = false; // 狀態旗標
        path_btn.addEventListener('click', () => {
            if (!inputVisible) {
                // 顯示輸入框，按鈕顯示 "儲存"
                input.size = input.value.length || 10;
                input.style.display = 'inline';
                path_btn.textContent = '儲存';
                input.focus();
                inputVisible = true;
            } else {
                // 儲存資料，隱藏輸入框，按鈕顯示 "修改路徑"
                downloadPath = input.value.trim() || downloadPath;
                localStorage.setItem('anig_download_path', downloadPath);
                input.style.display = 'none';
                path_btn.textContent = def_text;
                inputVisible = false;
            }
        });
        infoContainer.appendChild(path_btn);
        infoContainer.appendChild(input);
    }
    // 獲取設備 ID，這是請求播放列表所需的參數
    async function getDeviceId() {
        // 清空容器
        m3u8Container.innerHTML = '';
        playContainer.innerHTML = '';
        infoDisplay.textContent = '載入中...';
        const req = 'https://ani.gamer.com.tw/ajax/getdeviceid.php'; // 請求設備 ID 的 URL
        const response = await fetch(req); // 發送請求
        const data = await response.json(); // 解析 JSON 資料
        let DeviceID = data.deviceid; // 提取設備 ID
        getPlaylist(DeviceID); // 繼續獲取播放列表
    }
    // 獲取播放列表，並等待廣告結束
    async function getPlaylist(DeviceID) {
        const req = `https://ani.gamer.com.tw/ajax/m3u8.php?sn=${AniVideoSn}&device=${DeviceID}`; // 構建請求 URL
        infoDisplay.textContent = '等待廣告...'; // 提示使用者等待廣告
        let retries = 0; // 重試次數計數器
        let playlist;
        const maxRetries = 20; // 最多嘗試次數，防止無限循環
        // 循環請求播放列表，直到獲取到有效的播放地址或達到最大重試次數

        while (retries < maxRetries) {
            console.log(`[動畫瘋下載器] 第${retries + 1}次嘗試獲取 playlist\n${req}`);
            const response = await fetch(req);
            let playlist = await response.json();

            if (playlist.src && playlist.src.includes('https')) {
                await parsePlaylist(playlist);
                break;
            } else if (playlist.error && playlist.error.code === 1007) {
                infoDisplay.textContent = '裝置驗證異常！A';
                break;
            } else if (playlist.error) {
                infoDisplay.textContent = playlist.error?.message || `錯誤代碼：${playlist.error.code}`;
                break;
            } else {
                // 尚未取得，繼續嘗試
                await new Promise(resolve => setTimeout(resolve, 3000));
                retries++;
            }
        }

        if (retries === maxRetries) {
            infoDisplay.textContent = '取得播放地址失敗，請稍後再試。';
        }
    }

    // 解析 m3u8 播放列表，並在頁面上生成按鈕供使用者複製鏈接或使用 PotPlayer 播放
    async function parsePlaylist(playlist) {
        const req = playlist.src; // 獲取播放列表的 URL
        const response = await fetch(req); // 請求播放列表
        const text = await response.text(); // 獲取回應的文字內容
        const urlPrefix = req.replace(/playlist.+/, ''); // 提取 URL 前綴
        const m3u8List = text.match(/=\d+x\d+\n.+/g); // 匹配所有清晰度的 m3u8 連結
        console.log(`[動畫瘋下載器]\n${text}`)
        // 生成動畫名稱，作為文件名使用
        const fullwidthMap = {
            '<': '＜','>': '＞',':': '：','"': '＂','/': '／',
            '\\': '＼','|': '｜','?': '？','!': '！','*': '＊'
        };
        Name = document.title.replace(" 線上看 - 巴哈姆特動畫瘋", "");
        Name = Name.replace(/[\/\\<>:"*|?!]/g, char => {
            return fullwidthMap[char] || '_';
        });
        // 遍歷每個 m3u8 連結，生成對應的按鈕
        for (const item of m3u8List) {
            let key = item.match(/=\d+x(\d+)/)[1]; // 提取清晰度（如 720）
            let url = item.match(/.*chunklist.+/)[0]; // 提取 m3u8 文件的相對路徑
            url = urlPrefix + url; // 拼接成完整的 m3u8 URL
            // 創建複製鏈接的按鈕
            const copyLink = document.createElement('a');
            copyLink.classList.add('anig-tb');
            copyLink.textContent = `${key}p`;
            copyLink.title = `切換解析度為${key}p`;
            // 被點擊時
            copyLink.addEventListener('click', function () {
                m3u8_url = url; // 更新URL
                m3u8Container.querySelectorAll('a.anig-tb').forEach(el => {
                    el.textContent = el.textContent.replace(/✅\s*$/, '');
                });
                copyLink.textContent = `${key}p✅`;
            });
            m3u8Container.appendChild(copyLink);
        }
        // 主動點擊最後一個項目
        const allBtns = m3u8Container.querySelectorAll('a.anig-tb');
        if (allBtns.length > 0) {
            allBtns[allBtns.length - 1].click();
        }
        infoDisplay.textContent = '使用說明'; //${Name}
        initPlayContainer()
    }
    //初始化playContainer
    function initPlayContainer() {
        // 創建使用 MPV 播放的按鈕
        const MPVLink = document.createElement('a');
        MPVLink.classList.add('anig-tb');
        MPVLink.textContent = 'MPV';
        MPVLink.title = `使用MPV播放: ${Name}`;
        MPVLink.addEventListener('click', function () {
            const MPVUrl = `${m3u8_url} --http-header-fields="origin: https://ani.gamer.com.tw" --force-media-title="${Name}"`; // 構建 MPV 協議的 URL
            navigator.clipboard.writeText(MPVUrl);
            window.open('mpv:', '_self'); // 開啟 PotPlayer
        });
        playContainer.appendChild(MPVLink);
        // 創建使用 PotPlayer 播放的按鈕
        const potplayerLink = document.createElement('a');
        potplayerLink.classList.add('anig-tb');
        potplayerLink.textContent = 'PotPlayer';
        potplayerLink.title = `使用PotPlayer播放: ${Name}`;
        potplayerLink.addEventListener('click', function () {
            const potplayerUrl = `${m3u8_url} /sub="" /headers="origin: https://ani.gamer.com.tw" /current /title="${Name}"`; // 構建 PotPlayer 協議的 URL
            navigator.clipboard.writeText(potplayerUrl);
            window.open('potplayer:', '_self'); // 開啟 PotPlayer
        });
        playContainer.appendChild(potplayerLink);
        // 創建使用 ffmpeg 下載的按鈕
        const ffmpegLink = document.createElement('a');
        ffmpegLink.classList.add('anig-tb');
        ffmpegLink.textContent = 'ffmpeg';
        ffmpegLink.title = `使用ffmpeg下載: ${Name}`;
        ffmpegLink.addEventListener('click', function () {
            let PSdownloadPath = downloadPath.replace(/%([^%]+)%/g, '$Env:$1');
            const ffmpegDlUrl = `& ffmpeg -headers "Origin: https://ani.gamer.com.tw" -i "${m3u8_url}" -c copy "${PSdownloadPath}/${Name}.mkv";`; // 構建 PotPlayer 協議的 URL
            navigator.clipboard.writeText(ffmpegDlUrl);
            window.open('ffmpeg:', '_self'); // 開啟 ffmpeg
        });
        playContainer.appendChild(ffmpegLink);
        // 創建複製 ffmpeg 指令的按鈕
        const CopyffmpegLink = document.createElement('a');
        CopyffmpegLink.classList.add('anig-tb');
        let def_Copy_text = 'ffmpeg 🗍'
        CopyffmpegLink.textContent = def_Copy_text;
        CopyffmpegLink.title = `複製ffmpeg指令: ${Name}`;
        CopyffmpegLink.addEventListener('click', function () {
            let ffmpegUrl
            if (mode==0){
                ffmpegUrl = `ffmpeg -headers "Origin: https://ani.gamer.com.tw" -i "${m3u8_url}" -c copy "${downloadPath}/${Name}.mkv" && exit`; // 構建 PotPlayer 協議的 URL
            }else{
                ffmpegUrl = `${m3u8_url}@${Name}.mkv"`; // 構建 PotPlayer 協議的 URL
            }
            navigator.clipboard.writeText(ffmpegUrl);
            CopyffmpegLink.textContent = 'ffmpeg ✅';
            setTimeout(() => {
                CopyffmpegLink.textContent = def_Copy_text; // 恢復提示文字
            }, timeOut);
        });
        playContainer.appendChild(CopyffmpegLink);
    }
    ////////////Main////////////
    // 注入自定義樣式到頁面
    injectStyles();
    // 將自訂容器添加到頁面中的指定位置
    const Downloader = document.createElement('div');
    document.querySelector('.videoname').appendChild(Downloader);
    // 創建顯示提示信息的元素
    const infoDisplay = document.createElement('div');
    const infoContainer = document.createElement('div');
    infoContainer.classList.add('anig-ct');
    initInfoContainer();
    Downloader.appendChild(infoContainer);
    // 創建容器，用於放置清晰度
    const m3u8Container = document.createElement('div');
    m3u8Container.classList.add('anig-ct');
    Downloader.appendChild(m3u8Container);
    // 創建容器，用於放置播放下載按鈕
    const playContainer = document.createElement('div');
    playContainer.classList.add('anig-ct');
    Downloader.appendChild(playContainer);
    // 為頁面中的集數連結添加點擊事件監聽
    // 當使用者點擊不同的集數時，更新 AniVideoSn 並重新獲取播放列表
    let lastAniVideoSn = AniVideoSn; // 保存上一次的 AniVideoSn
    document.querySelectorAll('a[data-ani-video-sn]').forEach(link => {
        link.addEventListener('click', function () {
            let it = setInterval(() => {
                AniVideoSn = new URLSearchParams(window.location.search).get('sn'); // 獲取當前的 AniVideoSn
                // 如果 URL 或 AniVideoSn 發生變化
                if (AniVideoSn != lastAniVideoSn) {
                    lastAniVideoSn = AniVideoSn; // 更新 AniVideoSn
                    getDeviceId(); // 重新獲取設備 ID 並獲取播放列表
                    clearInterval(it);
                }
            }, 100);
        });
    });
    // 開始執行程式
    setTimeout(() => {
        getDeviceId(); // 獲取設備 ID 並開始流程
    }, 500);
})();