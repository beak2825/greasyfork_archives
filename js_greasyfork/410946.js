// ==UserScript==
// @name         AVDAY+ 下載助手 v2.30
// @namespace    https://www.facebook.com/airlife917339
// @version      2.30
// @description  feel free to donate BTC: 1xb8F4x76ptN2H9MUAhZjvofKw2im1sdq
// @author       Kevin Chang
// @match        https://avday.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410946/AVDAY%2B%20%E4%B8%8B%E8%BC%89%E5%8A%A9%E6%89%8B%20v230.user.js
// @updateURL https://update.greasyfork.org/scripts/410946/AVDAY%2B%20%E4%B8%8B%E8%BC%89%E5%8A%A9%E6%89%8B%20v230.meta.js
// ==/UserScript==

// 版本: 2.30
// 最後更新: 2020-12-14
// 更新內容:
// 1. 修復下載連結失效。

// 版本: 2.20
// 最後更新: 2020-10-08
// 更新內容:
// 1. 按鈕更新成圖示。
// 2. 優化了按鈕區的程式碼。
// 3. 加入了收藏影片的功能。

// 版本: 2.05
// 最後更新: 2020-09-17
// 更新內容:
// 1. 修正移除VIP廣告後，影片區域大小的bug。
// 2. 修正短片區VIP廣告擋住影片的bug。
// 3. 修正短片區按鈕失效、無法抓出下載連結的bug。
// 4. 優化部分程式碼。

// 版本: 2.00
// 最後更新: 2020-09-15
// 更新內容: 破解影片下載VIP限制，移除VIP廣告，優化程式碼。

// 版本: 1.11
// 最後更新: 2020-09-08
// 更新內容: 封面連結會開啟新分頁，而不是原本的跳轉。

// 版本: 1.10
// 最後更新: 2020-09-07
// 更新內容: 加入了影片m3u8連結複製按鈕。

// 版本: 1.00
// 最後更新: 2020-09-07
// 更新內容: 將原本愛心數量的按鈕改為下載封面的連結按鈕。

// 如果存在才刪除
function if_exists_delete(css_selecter) {
    if(document.querySelector(css_selecter)) {
        document.querySelector(css_selecter).remove();
        return true;
    } else {
        return false;
    }
}

// 刪除VIP廣告、沒用的東西
function delete_vip_ads() {
    var vip_upgrade_bar = 'a.mr-3.text-focus';              // 把上方 "升級VIP" 的連結刪除
    var vip_plans = '#video-plan'                           // 把影片右側的VIP價目方案區塊刪除
    var unlock_msg = '#unlock-msg';
    var report_btn = 'div > section > article > div:nth-child(2) > div:nth-child(1) > ul > li:last-child'   // 刪除問題回報按鈕
    if_exists_delete(vip_upgrade_bar);
    if_exists_delete(vip_plans);
    if_exists_delete(unlock_msg);
    if_exists_delete(report_btn);
    document.querySelector('div.video-box > div.video-container > div.row.clearfix > div').className = 'col-12';   // 將影片寬度調整為正常
}

// 取得影片下載完整版的m3u8連結
function get_video_link() {
    var m3u8_link = '';
    if(document.querySelector('meta[itemprop="contentURL"]')) {
        m3u8_link = document.querySelector('meta[itemprop="contentURL"]').content;
        m3u8_link = m3u8_link.replace(/intro\//g, '');
    } else if(document.querySelector('.vjs-modal-dialog-content')) {
        m3u8_link = document.querySelector('.vjs-modal-dialog-content').innerText;
        m3u8_link = m3u8_link.replace('HLS playlist request error at URL: ','');
        m3u8_link = m3u8_link.replace('.m3u8.','.m3u8');
        m3u8_link = m3u8_link.replace(/intro\//g, '');
        document.querySelector('#video-player_html5_api > source').src = m3u8_link;             // 將連接取代上
    } else if(document.querySelector('#video-player_html5_api > source')) {
        m3u8_link = document.querySelector('#video-player_html5_api > source').src;  // 取得影片下載m3u8的連結
        m3u8_link = m3u8_link.replace(/intro\//g, '');                                   // 將試看影片轉為完整版的連結
        document.querySelector('#video-player_html5_api > source').src = m3u8_link;             // 將連接取代上
    } else {
        var poster_url = get_cover_photo_link();                                                // 取得預覽圖片網址
        var vid = /([^<>/\\\|:""\*\?]+)\.\w+$/.exec(poster_url)[0].replace('.jpg', '');         // 從網址正規化取得id
        m3u8_link = 'https://video.vvvcdn.live/tv_adult/' + vid + '/' + vid + '.m3u8';          // 創造取得m3u8連結
    }
    console.log(m3u8_link);
    return m3u8_link;
}

// 取得封面圖片的連結
function get_cover_photo_link() {
    var photo_link;
    if(document.querySelector('#video-player_html5_api > img')) {
        photo_link = document.querySelector('#video-player_html5_api > img').src;           // 取得封面圖片的連結
    } else if(document.querySelector('#video-player')) {
        photo_link = document.querySelector('#video-player').poster;
    } else {
        photo_link = false;
    }
    return photo_link;
}

// 影片收藏
function video_bookmark() {
    document.querySelector('#bookmark > i').className = 'fa fa-bookmark';
    bookmarked = true;
    var movie_title_selector = 'section > article > div:nth-child(2) > div:nth-child(3) > ul > li.video-info-name > h1';
    var movie_genre_selector = 'section > article > div:nth-child(2) > div:nth-child(3) > ul > li:nth-child(3) > div > h3';
    var movie_performers_selector = 'section > article > div:nth-child(2) > div:nth-child(3) > ul > li:nth-child(2) > h3';
    var movie_number_selector = 'section > article > div:nth-child(2) > div:nth-child(3) > ul > li:nth-child(4) > div > h2';
    var username_selector = 'section > article > div:nth-child(2) > div:nth-child(3) > ul > li:nth-child(5) > div.float-left > div';
    var movie_upload_date_selector = 'section > article > div:nth-child(2) > div:nth-child(3) > ul > li:nth-child(5) > div.float-right > div';
    var d = new Date();

    var movie_url = window.location.href;                                                       // 網址
    var movie_title = document.querySelector(movie_title_selector).innerText;                   // 片名
    var movie_genre = document.querySelector(movie_genre_selector).innerText.replace(/\s+/g, "");               // 影片標籤
    var movie_performers = document.querySelector(movie_performers_selector).innerText.replace(/\s+/g, "");    // 女優
    var movie_number = document.querySelector(movie_number_selector).innerText;                 // 番號
    var username = document.querySelector(username_selector).innerText;                         // 上傳者
    var movie_upload_date = document.querySelector(movie_upload_date_selector).innerText;       // 上傳日期
    var movie_bookmark_date = d.toLocaleDateString('zh-Hans-TW');                               // 收藏日期

    var excel_url = 'https://script.google.com/macros/s/AKfycbzfvuKN7OzSWri-j3QPEV2qC72mQgUFVKJp6C4F9T3rNhmI3so/exec';

    var xhr = new XMLHttpRequest();

    xhr.onload = function () {
    // Request finished. Do processing here.
    };

    xhr.open('POST', excel_url);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    var send_str = '';
    send_str+= 'movie_url=' + movie_url;
    send_str+= '&movie_title=' + movie_title;
    send_str+= '&movie_genre=' + movie_genre;
    send_str+= '&movie_performers=' + movie_performers;
    send_str+= '&movie_number=' + movie_number;
    send_str+= '&username=' + username;
    send_str+= '&movie_upload_date=' + movie_upload_date;
    send_str+= '&movie_bookmark_date=' + movie_bookmark_date;
    xhr.send(send_str);
    console.log('收藏成功!');
}

// 影片取消收藏
function video_unbookmark() {
    document.querySelector('#bookmark > i').className = 'fa fa-bookmark-o';
    bookmarked = false;
    console.log('取消收藏成功!');
}

delete_vip_ads();                               // 刪除廣告

// 按鈕icon
var bookmark_true_icon = '<i class="fa fa-bookmark"></i>';
var bookmark_false_icon = '<i class="fa fa-bookmark-o"></i>';
var download_icon = '<i class="fa fa-download"></i>';
var picture_icon = '<i class="fa fa-picture-o"></i>';

// 產生連結
var video_link = get_video_link();              // 取得影片下載m3u8的連結
var cover_photo_link = get_cover_photo_link()   // 取得封面圖片的連結

// 建立按鈕物件
var bookmarked = false;    // Has this page been bookmarked?
var bookmark_btn = '<span id="bookmark" type="button" class="user-border user-btn-num">' + bookmark_false_icon + '</span>';     // 建立收藏功能的物件
var video_link_btn = '<span id="video" type="button" class="user-border user-btn-num">' + download_icon + '</span>';            // 建立m3u8連結的物件
var cover_photo_a = '<a id="cover_photo" href="' + cover_photo_link + '" class="user-border user-btn-num" target="_blank">' + picture_icon + '</a>';    // 建立下載封面連結的物件

var btn_bar_selector = 'div > section > article > div:nth-child(2) > div:nth-child(1) > ul > li:nth-child(1)';  // 取得按鈕列的selector
var btn_bar = document.querySelector(btn_bar_selector);                 // 取得按鈕列
btn_bar.innerHTML = bookmark_btn + cover_photo_a + video_link_btn;      // 將m3u8連結、下載封面照 插入按鈕列

// 監聽按鈕點擊事件 - 影片收藏或取消
document.querySelector('#bookmark').addEventListener('click', function(e) {
    if(bookmarked == false) {
        setTimeout(video_bookmark, 300);
    } else if (bookmarked == true) {
        setTimeout(video_unbookmark, 300);
    } else {
        console.log('收藏錯誤!@#');
    }
})

// 監聽按鈕點擊事件 - 複製m3u8連結
document.querySelector('#video').addEventListener('click', function(e) {
    var temp = document.createElement('textarea');  // 建立一個暫時的存放物件
    temp.textContent = video_link;                  // 將連結存入
    document.body.appendChild(temp);                // 插入暫時的存放物件到body
    temp.select();                                  // 選擇字串
    document.execCommand('copy');                   // 將選擇的字串複製
    temp.remove();                                  // 移除物件
})