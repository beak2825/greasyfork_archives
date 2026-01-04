// ==UserScript==
// @name        動畫瘋下載器 macOS Enhanced ver.
// @namespace   https://github.com/jimmyorz
// @description 取得動畫的 m3u8 網址並使用 iTerm2 下載，也可使用 IINA 播放
// @version     1.7.1e
// @author      jimmorz
// @match       https://ani.gamer.com.tw/animeVideo.php?sn=*
// @icon        https://i2.bahamut.com.tw/anime/baha_s.png
// @connect     ani.gamer.com.tw
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/511582/%E5%8B%95%E7%95%AB%E7%98%8B%E4%B8%8B%E8%BC%89%E5%99%A8%20macOS%20Enhanced%20ver.user.js
// @updateURL https://update.greasyfork.org/scripts/511582/%E5%8B%95%E7%95%AB%E7%98%8B%E4%B8%8B%E8%BC%89%E5%99%A8%20macOS%20Enhanced%20ver.meta.js
// ==/UserScript==

/**
 * ---------------------------
 * 此增強版修改自：動畫瘋下載器@XPRAMT
 * 1. 使用前務必依照使用習慣修改腳本開頭的可選參數
 * 2. 預設使用 ffmpeg 當作下載器，也可改用輸出介面比較好看的 yt-dlp
 * 3. macOS 請預先安裝 iterm2 ，以及 Homebrew 安裝 yt-dlp 及 ffmpeg 套件
 * 4. IINA 設定 > 進階設定 > [打勾]啟用進階設定 > 下方[其它 mpv 選項] 點+ > 設定[選項]http-header-fields 和 [值]origin:https://ani.gamer.com.tw
 *
 * 為了維護方便，Windows 支援於 1.7.0e 起移除，若有需要請使用動畫瘋下載器
 * ---------------------------
 */


(function () {
    'use strict';
    //保存路徑選擇(0:Windows|1:macOS) Windows 支援已移除，請勿更動此項
    const path_mode = 1;
    //手動複製模式選擇(0:複製完整指令|1:複製URL+名稱，1.5.1 舊版使用)
    const mode = 0;
    //下載器選擇(0:ffmpeg|1:yt-dlp)
    const App_mode = 1;
    //下載模式選擇(0:手動複製|1:自動執行)
    const DL_mode = 1; // 自動執行僅支援 macOS，Windows 請填 0

    //保存路徑依選擇的作業系統切換
    let path;
    let path_platform;
    if (path_mode==0){
        path = '%USERPROFILE%/Downloads'
        path_platform = 'Windows'
    }else{
        path = '$HOME/Downloads'
        path_platform = 'macOS'
    }
    //下載器切換
    let DLAppURL;
    let DLAppURL2;
    let DLAppName;
    if (App_mode==0){
        DLAppURL = 'ffmpeg -headers "Origin: https://ani.gamer.com.tw" -i'
        DLAppURL2 = '-c copy'
        DLAppName = 'ffmpeg'
    }else{
        DLAppURL = 'yt-dlp --add-header "Origin: https://ani.gamer.com.tw"'
        DLAppURL2 = '-o'
        DLAppName = 'yt-dlp'
    }

    let m3u8_url = '';
    let Name = '';

     //注入樣式到頁面中
    function injectStyles(css) {
        const style = document.createElement('style'); // 創建 <style> 元素
        style.textContent = css; // 設置樣式內容
        document.head.appendChild(style); // 將 <style> 添加到 <head>
    }

     //解析 m3u8 播放列表，並在頁面上生成按鈕供使用者複製連結或使用外部播放器播放
    async function parsePlaylist() {
        const req = playlist.src; // 獲取播放列表的 URL
        const response = await fetch(req); // 請求播放列表
        const text = await response.text(); // 獲取回應的文字內容
        const urlPrefix = req.replace(/playlist.+/, ''); // 提取 URL 前綴
        const m3u8List = text.match(/=\d+x\d+\n.+/g); // 匹配所有清晰度的 m3u8 連結

        // 生成動畫名稱，作為文件名使用
        const fullwidthMap = {
            '<': '＜','>': '＞',':': '：','"': '＂','/': '／',
            '\\': '＼','|': '｜','?': '？','!': '！','*': '＊'
        };
        Name = document.title.replace(" 線上看 - 巴哈姆特動畫瘋", "");
        Name = Name.replace(/[\/\\<>:"*|?!]/g, char => {
            return fullwidthMap[char] || '_';
        });

        titleDisplay.textContent = '[macOS Enhanced ver.] 點擊複製/執行下載指令或使用外部播放器播放'

        let m3u8_url2
        // 遍歷每個 m3u8 連結，生成對應的按鈕
        for (const item of m3u8List) {
            let key = item.match(/=\d+x(\d+)/)[1]; // 提取清晰度（如 720）
            let m3u8_url = item.match(/.*chunklist.+/)[0]; // 提取 m3u8 文件的相對路徑
            m3u8_url = urlPrefix + m3u8_url; // 拼接成完整的 m3u8 URL
            m3u8_url2 = m3u8_url;

            // 創建 macOS 複製連結或直接下載的按鈕
            const HandleLink = document.createElement('a');
            HandleLink.classList.add('anig-tb');
            HandleLink.textContent = `${key}p`;
            HandleLink.title = '複製/執行 ' + DLAppName + ' 下載指令';
            HandleLink.addEventListener('click', function () {
                let DLUrl; // 以下開始創建新版或新版 URL，或創建直接下載的 iTerm2 URL
                if (mode==0 && DL_mode==0){
                    DLUrl = `${DLAppURL} "${m3u8_url}" ${DLAppURL2} "${path}/${Name}.mp4"`; // 構建 ffmpeg/yt-dlp 下載 URL
                }
                else if(mode==0 && DL_mode==1){
                    DLUrl = `iterm2:/command?c=${DLAppURL} "${m3u8_url}" ${DLAppURL2} "${path}/${Name}.mp4"`; // 構建 iTerm2+ffmpeg/yt-dlp 下載 URL
                }
                else{
                    DLUrl = `${m3u8_url}@${Name}`; // 構建 1.5.1 舊版本下載 URL
                }

                if (DL_mode==0){ // 處理複製或直接下載
                    navigator.clipboard.writeText(DLUrl); // 複製連結
                    titleDisplay.textContent = '複製成功！'; // 提示成功
                    setTimeout(() => {
                        titleDisplay.textContent = '[' + path_platform + '] 點擊複製/執行下載指令或使用外部播放器播放'; // 恢復提示文字
                    }, 500);
                }else{
                    window.open(DLUrl, '_self'); // 開啟 iTerm2
                }

            });
            m3u8Container.appendChild(HandleLink);
        }

        // 創建使用 IINA 播放的按鈕 For macOS
        const IINALink = document.createElement('a');
        IINALink.classList.add('anig-tb');
        IINALink.textContent = 'IINA';
        IINALink.title = '使用 IINA 播放';
        IINALink.addEventListener('click', function () {
            const IINAUrl = `iina://weblink?url=${m3u8_url2}`; // 構建 IINA URL Scheme
            window.open(IINAUrl, '_self'); // 開啟 IINA
            //navigator.clipboard.writeText(IINAUrl); // 複製連結 Debug 用
        });
            m3u8Container.appendChild(IINALink);

    }

    /**
     * 獲取播放列表，並等待廣告結束
     */
    async function getPlaylist() {
        const req = `https://ani.gamer.com.tw/ajax/m3u8.php?sn=${AniVideoSn}&device=${DeviceID}`; // 構建請求 URL
        titleDisplay.textContent = '等待廣告...'; // 提示使用者等待廣告

        let retries = 0; // 重試次數計數器
        const maxRetries = 20; // 最多嘗試次數，防止無限循環

        // 循環請求播放列表，直到獲取到有效的播放地址或達到最大重試次數
        while (retries < maxRetries) {
            const response = await fetch(req); // 發送請求
            playlist = await response.json(); // 解析 JSON 資料

            // 如果獲取到有效的播放地址（不包含廣告）
            if (playlist.src && playlist.src.includes('https')) {
                break; // 跳出循環
            }

            await new Promise(resolve => setTimeout(resolve, 3000)); // 等待 3 秒再重試
            retries++; // 增加重試次數
        }

        // 判斷是否成功獲取播放列表
        if (playlist.src && playlist.src.includes('https')) {
            await parsePlaylist(); // 解析播放列表並生成按鈕
        } else {
            titleDisplay.textContent = '獲取播放列表失敗'; // 提示使用者失敗
        }
    }

    /**
     * 獲取設備 ID，這是請求播放列表所需的參數
     */
    async function getDeviceId() {
        const req = 'https://ani.gamer.com.tw/ajax/getdeviceid.php'; // 請求設備 ID 的 URL
        const response = await fetch(req); // 發送請求
        const data = await response.json(); // 解析 JSON 資料
        DeviceID = data.deviceid; // 提取設備 ID
        await getPlaylist(); // 繼續獲取播放列表
    }

    // Main

    // 從 URL 中獲取動畫的編號（AniVideoSn）
    let AniVideoSn = new URLSearchParams(window.location.search).get('sn');
    // 定義全域變數
    let DeviceID; // 設備 ID
    let playlist; // 播放列表資料

    // 定義樣式
    const css =`
    .anig-ct {
        margin: 5px;
    }

    .anig-tb {
        display: inline-block;
        padding: 5px;
        background: #50b2d7;
        color: #FFF;
        margin-right: 5px;
        cursor: pointer;
    }`;

    // 創建顯示提示訊息的元素
    const titleDisplay = document.createElement('div');
    titleDisplay.classList.add('anig-tb');
    titleDisplay.textContent = '載入中...'; // 初始提示文字
    // 創建一個容器來包裹提示訊息
    const container = document.createElement('div');
    container.classList.add('anig-ct');
    container.appendChild(titleDisplay); // 將提示元素添加到容器中
    // 創建容器，用於放置清晰度按鈕和外部播放器按鈕
    const m3u8Container = document.createElement('div');
    m3u8Container.classList.add('anig-ct');
    // 創建最左邊的容器，用於提示自動執行及手動複製按鈕
    const ModeDisplay = document.createElement('a');
    if (DL_mode==0){ // 判斷輸出的提示文字
        ModeDisplay.textContent = '手動複製⮕';
    }else{
        ModeDisplay.textContent = '自動執行⮕';
    }
    ModeDisplay.classList.add('anig-tb');
    m3u8Container.insertBefore(ModeDisplay, m3u8Container.firstChild); // 將提示容器放置於最左邊
    // 將容器添加到頁面中的指定位置
    const animeName = document.querySelector('.anime_name');
    animeName.appendChild(container); // 添加提示容器
    animeName.appendChild(m3u8Container); // 添加按鈕容器

    /**
     * 為頁面中的集數連結添加點擊事件監聽
     * 當使用者點擊不同的集數時，更新 AniVideoSn 並重新獲取播放列表
     */
    document.querySelectorAll('a[data-ani-video-sn]').forEach(link => {
        link.addEventListener('click', function () {
            AniVideoSn = this.getAttribute('data-ani-video-sn'); // 更新 AniVideoSn
            m3u8Container.innerHTML = ''; // 清空按鈕容器
            titleDisplay.textContent = '載入中...'; // 更新提示文字
            m3u8Container.insertBefore(ModeDisplay, m3u8Container.firstChild); // 更新最左提示文字
            getDeviceId(); // 重新獲取設備 ID 並獲取播放列表
        });
    });

    /**
     * 新增檢查機制，監測 URL 和 AniVideoSn 是否發生變化
     * 如果發生變化，則重新獲取播放列表，確保資料的及時更新
     */
    let lastAniVideoSn = AniVideoSn; // 保存上一次的 AniVideoSn
    let lastUrl = window.location.href; // 保存上一次的 URL

    setInterval(() => {
        const currentUrl = window.location.href; // 獲取當前的 URL
        const currentAniVideoSn = new URLSearchParams(window.location.search).get('sn'); // 獲取當前的 AniVideoSn

        // 如果 URL 或 AniVideoSn 發生變化
        if (currentUrl !== lastUrl || currentAniVideoSn !== lastAniVideoSn) {
            lastUrl = currentUrl; // 更新 URL
            lastAniVideoSn = currentAniVideoSn; // 更新 AniVideoSn
            AniVideoSn = currentAniVideoSn; // 更新全域變數

            m3u8Container.innerHTML = ''; // 清空按鈕容器
            titleDisplay.textContent = '載入中...'; // 更新提示文字
            m3u8Container.insertBefore(ModeDisplay, m3u8Container.firstChild); // 更新最左提示文字
            getDeviceId(); // 重新獲取設備 ID 並獲取播放列表
        }
    }, 1000); // 每秒檢查一次

    // 開始執行程式
    getDeviceId(); // 獲取設備 ID 並開始流程
    injectStyles(css); // 注入自定義樣式到頁面

})();