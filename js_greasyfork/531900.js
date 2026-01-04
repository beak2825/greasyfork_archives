// ==UserScript==
// @name         爬取javdb詳細頁面的數據 V2
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description 爬取javdb詳細頁面的數據 保存在剪貼簿
// @author       You
// @match        https://javdb.com/v/*
// @match        https://javdb.com/actors/*
// @match       https://javdb.com/tags*
// @match       https://javdb.com/rankings/movies*
// @match        https://javdb.com/video_codes*
// @match    https://javdb.com/series/*
// @match     https://javdb.com/makers/*
// @match     https://javdb.com/*

// @icon         https://www.google.com/s2/favicons?sz=64&domain=javdb.com
// @grant GM_notification
// @grant GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/531900/%E7%88%AC%E5%8F%96javdb%E8%A9%B3%E7%B4%B0%E9%A0%81%E9%9D%A2%E7%9A%84%E6%95%B8%E6%93%9A%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/531900/%E7%88%AC%E5%8F%96javdb%E8%A9%B3%E7%B4%B0%E9%A0%81%E9%9D%A2%E7%9A%84%E6%95%B8%E6%93%9A%20V2.meta.js
// ==/UserScript==
let SERVER_IP = "10.0.0.3:8080"

    // 获取用户设置或使用默认值
SERVER_IP = GM_getValue('serverIp', "10.0.0.3:8080");

const movieBean = {
    movie: {},
    tags: [],
    actors: []
}

const webXPath = {
    title: {
        //document.getElementsByClassName('title is-4')
        classAndIndex: {className:'title is-4', index:0} ,
        originalValue: null,
        value: null,
        handleValue: (originalValue) => {
            // 处理值的逻辑
            /*
               let s1 = "\n    DOM-029 \n    任意妄為 15 \n      顯示原標題\n      やりたい放題 15\n  "
               let s2 = "\n    PRED-483 \n    美脚CA 粘着オヤジに堕とされて…肉便器への調教フライト 白峰ミウ \n  "
                 console.log(s1.split("\n").length)
                console.log(s2.split("\n").length)
                */
            let titleArray = originalValue.split("\n")

            movieBean.movie['website'] = window.location.href;
            if (titleArray.length > 5) {
                //番號 (含有中文標題)
                movieBean.movie['title'] = titleArray[4].trim()
                movieBean.movie['original_title'] = titleArray[4].trim()
                movieBean.movie['sort_title'] = titleArray[4].trim()
                movieBean.movie['outline'] = titleArray[2].trim()
            } else if (titleArray.length > 3) {
                movieBean.movie['title'] = titleArray[2].trim()
                movieBean.movie['original_title'] = titleArray[2].trim()
                movieBean.movie['sort_title'] = titleArray[2].trim()
                movieBean.movie['outline'] = titleArray[2].trim()

            }
        }
    },
    num: {
        classAndIndex: {className:'panel-block first-block', index:0} ,
        originalValue: null,
        value: null,
        handleValue: (originalValue) => {
            // 处理值的逻辑 番號:\n
            originalValue = originalValue.replace("番號:\n", "")
            movieBean.movie['num'] = originalValue.trim()
            //     movieBean.movie['']
            //  movieBean.movie['']
        }
    },
    //發布時間
    date: {
        classAndIndex: {className:'panel-block', index:1} ,
        originalValue: null,
        value: null,
        handleValue: (originalValue) => {
            originalValue = originalValue.replace("日期:\n", "")
            const dateString = originalValue.trim()
            const year = new Date(dateString).getFullYear();
            // 处理值的逻辑
            movieBean.movie['year'] = year.toString()
            movieBean.movie['premiered'] = dateString
            movieBean.movie['releaseDate'] = dateString
            movieBean.movie['release'] = dateString
        }
    },
    //時長
    runtime: {
        classAndIndex: {className:'panel-block', index:2} ,
        originalValue: null,
        value: null,
        handleValue: (originalValue) => {
            // 处理值的逻辑
            //console.log(originalValue)
            let runtimeArray = originalValue.split(" ");
            if (runtimeArray.length > 0)
                movieBean.movie['runtime'] = runtimeArray[0].trim() + " minutes"
        }
    },

    studio: {
        classAndIndex: {className:'panel-block', index:3} ,
        originalValue: null,
        value: null,
        handleValue: (originalValue) => {
            let result = {}
            const elements = document.getElementsByClassName('panel-block')

            for (let i = 4; i < 20; i++) {
                try{
                    let text = elements[i].textContent


                    let textArray = text.split("\n")
                    //console.log(text)

                    //去除空格元素  去除元素前後空格跟冒號
                    textArray = textArray.filter(item => item.trim() !== '').map(item => { return item.trim().replace(":", ""); });
                    let rowName = textArray[0]
                    result[rowName] = textArray
                    if (text.indexOf("演員") > -1) break
                }catch(e){}
            }

            //console.log(result)
            /*
            Object { "導演": (2) […], "片商": (2) […], "系列": (2) […], "評分": (2) […], "類別": (2) […], "演員": (4) […] }
            ​
            "導演": Array [ "導演", "きとるね川口" ]
            ​
            "演員": Array(4) [ "演員", "白峰ミウ♀", "中田一平♂", … ]
            ​
            "片商": Array [ "片商", "プレミアム" ]
            ​
            "系列": Array [ "系列", "美脚CA 粘着オヤジに堕とされて…" ]
            ​
            "評分": Array [ "評分", "4.73分, 由849人評價" ]
            ​
            "類別": Array [ "類別", "凌辱, 連褲襪, 單體作品, 中出, 多P" ]
            ​

            */

            //導演
            if (result.hasOwnProperty('導演'))
                movieBean.movie['director'] = result['導演'][1]
            if (result.hasOwnProperty('片商'))
                movieBean.movie['studio'] = result['片商'][1]
            if (result.hasOwnProperty('系列'))
                movieBean.movie['series'] = result['系列'][1]
            if (result.hasOwnProperty('片商'))
                movieBean.movie['maker'] = result['片商'][1]


            if (result.hasOwnProperty('演員')) {

                result['演員'].filter(item => item.includes('♀') || item.includes('N/A')).forEach(item => {
                    if (item.includes('N/A')) {
                        // 如果 item 含有 "N/A"，则添加 "素人" 对象
                        movieBean.actors.push({ name: '素人' });
                    } else {
                        // 否则正常处理
                        movieBean.actors.push({ name: item.replace('♀', '') });
                    }
                });
            }
            if (result.hasOwnProperty('類別'))
                result['類別'][1].split(/，|,/).map(item => item.trim()).forEach(item => {
                    movieBean.tags.push({ name: item })
                });
        }
    }


};

function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
        //console.log('已成功复制文本到剪贴板');
        GM_notification({
            title: movieBean.movie.num,
            text: text,
            timeout: 5000, // 显示时间，单位为毫秒
        });
    })
        .catch((error) => {
        GM_notification({
            title: '复制文本到剪贴板失败',
            text: '复制文本到剪贴板失败',
            timeout: 3000, // 显示时间，单位为毫秒
        });

    });
}

function title(text){
    // 创建一个固定元素
    var fixedElement = document.createElement('div');
    fixedElement.id = 'fixedElement';

    // 设置固定元素的样式
    fixedElement.style.position = 'fixed';
    fixedElement.style.top = '0';
    fixedElement.style.left = '0';
    fixedElement.style.width = '100%';
    fixedElement.style.height = '40px';
    fixedElement.style.zIndex = '9999';
    //fixedElement.style.backgroundColor = '#aaaaFF';
    fixedElement.style.padding = '10px';
    fixedElement.style.fontSize = '30px';
    fixedElement.style.color = '#0F0';

    //fixedElement.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
    //fixedElement.style.display = 'none'; // 初始时隐藏
    // 显示固定元素
    fixedElement.style.display = 'block';
    // 将固定元素插入到 body 中
    document.body.appendChild(fixedElement);

    // 设置固定元素的内容
    fixedElement.innerHTML = text//'This is a fixed element.';


    // 在 15 秒后删除固定元素
    setTimeout(function() {
        document.body.removeChild(fixedElement);
    }, 5000);

}
function getXPathValues(className, index) {
    const elements =document.getElementsByClassName(className)[index]
    let result = elements.textContent;
    return result
}

function addVideoHashPath(movieBean, videoHashPath) {
    Object.keys(movieBean).forEach(key => {
        if (Array.isArray(movieBean[key])) {
            movieBean[key].forEach(item => {
                item.videoHashPath = videoHashPath;
            });
        } else {
            movieBean[key].videoHashPath = videoHashPath;
        }
    });
}

function setData(jsonObject){
    let copyMovieBean = JSON.parse(JSON.stringify(movieBean));
    copyMovieBean.movie.video_hash_path = jsonObject.hashPath
    copyMovieBean.tags.forEach((item, index) => {
        item.video_hash_path = jsonObject.hashPath
    });
    copyMovieBean.actors.forEach((item, index) => {
        item.video_hash_path = jsonObject.hashPath
    });
    console.log(copyMovieBean)
    // 要訪問的 URL 和參數
    var url = 'http://${SERVER_IP}/movieInfos/set';
    // 發送 GET 請求
    GM_xmlhttpRequest({
        method: 'POST',
        url: url,
        data:JSON.stringify(copyMovieBean),
        headers: {
            "Content-Type": "application/json"
        },
        onload: function(response) {
            console.log(response.responseText)
            title(response.responseText)

        },
        onerror: function(error) {
            // 請求失敗時的處理邏輯
            console.error('Error:', error);
        }
    });
}
function autoSendData(jsonObject){
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('elephant') === '1') {
        // 執行 sentData 方法
        setData(jsonObject);

        // 15 秒後關閉分頁
        setTimeout(function() {
            window.close();
            // 如果無法直接關閉，重定向到空白頁面
            if (!window.closed) {
                window.location.href = 'about:blank';
            }
        }, 15000);
    }
}
function gmRequest(url){
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                resolve(response);
            },
            onerror: function(error) {
                reject(error);
            }
        });
    })
}
async function searchByNumber(number ){
    // 要訪問的 URL 和參數
    var url = 'http://${SERVER_IP}/drama/searchByNumber';
    var params = `number=${number}`;

    // 組合 URL
    var fullUrl = url + '?' + params;

    // 發送 GET 請求
    try {
        // 發送請求並等待響應
        const response = await gmRequest(fullUrl);
        // 將 JSON 字符串轉換為 JavaScript 對象
        const jsonObject = JSON.parse(response.responseText);

        console.log(jsonObject);
        if (jsonObject.error) return;

        // 創建一個超連結元素
        const link = document.createElement('a');
        // 設定超連結的屬性
        link.href = `http://${SERVER_IP}/player/index.html?hashPath=${jsonObject.hashPath}`;
        link.textContent = '觀看影片';
        // 設定 target 屬性為 "_blank"
        link.target = '_blank';
        // 設定超連接的樣式，包括 margin
        link.style.margin = "10px";

        // 定位元素
        const targetElement = document.getElementsByClassName('panel-block first-block')[0];
        targetElement.appendChild(link, targetElement.nextSibling);
        // 添加傳送按鍵
        // 創建按鈕元素
        const button = document.createElement("button");
        button.innerHTML = "傳送到伺服器";
        button.title = `filename:\t${jsonObject.fileName} \n hashPath:\t${jsonObject.hashPath}`;
        // 插入按鈕元素
        targetElement.appendChild(button, targetElement.nextSibling);

        // 監聽按鈕點擊事件
        button.addEventListener("click", function () {
            setData(jsonObject);
        });
        autoSendData(jsonObject)
    } catch (error) {
        // 請求失敗時的處理邏輯
        console.error('Error:', error);
    }
}
function searchAllVideoByNumber(numbers){
    var data = JSON.stringify(numbers);

    // 要訪問的 URL 和參數
    var url = `http://${SERVER_IP}/drama/searchByNumber`;

    // 發送 GET 請求
    GM_xmlhttpRequest({
        method: 'POST',
        url: url,
        headers: {
            "Content-Type": "application/json"
        },
        data: data,
        onload: function(response) {
            // 將 JSON 字符串轉換為 JavaScript 對象
            var jsonArray = JSON.parse(response.responseText);

            console.log(jsonArray)
            // if(jsonObject.error) return;

            // 定位元素
            let elements = document.querySelectorAll('div.tags.has-addons');
            for(let i = 0; i < elements.length; i++){
                let json = jsonArray[i]
                if(!json) continue;
                let el = elements[i]
                // 創建一個超連結元素
                var link = document.createElement('a');
                // 設定超連結的屬性

                link.href = `http://127.0.0.1:5574/mainV4.html?hashPath=${json.hashPath}`;
                link.href = `http://${SERVER_IP}/player/index.html?hashPath=${json.hashPath}`
                link.textContent = '觀看影片';
                link.style.color = `rgba(232, 230, 227, 0.7)`
                 link.style.marginLeft= '0.5rem';
                link.style.marginBottom = '0.5rem';
                link.style.backgroundColor = 'yellow'; // 改变背景颜色
                // 設定 target 屬性為 "_blank"
                link.target = '_blank';
                // 設定超連接的樣式，包括 margin

                link.style.padding = '0 .7em';
                // 将新标签添加到元素中
                el.appendChild(link);
            }
         
        },
        onerror: function(error) {
            // 請求失敗時的處理邏輯
            console.error('Error:', error);
        }
    });
}
function searchAllVideoItems(){
        // 用于存储文本内容的数组
    let strList = [];

    // 定位到所有匹配的元素
    //let elements = document.querySelectorAll('html.has-navbar-fixed-top.has-navbar-fixed-bottom body section.section div.container div.movie-list.h.cols-4.vcols-8 div.item a.box div.video-title strong');
    let elements = document.querySelectorAll('a.box div.video-title strong');
    // 遍历元素并将文本内容添加到数组
    elements.forEach(function(el) {
        strList.push(el.textContent.trim().
                     replace("FC2-","").
                     replace(" hhd800.com@","")
                    );

    });
    // 在控制台打印结果
    console.log(strList);
    searchAllVideoByNumber(strList)
}
(async function () {
    'use strict';
    // 註冊菜單命令：用於讓用戶輸入新的 IP 地址
    GM_registerMenuCommand('設置伺服器 IP', async () => {

        const newIp = prompt('請輸入伺服器 IP 地址 ex:10.1.1.0:8080：', SERVER_IP);

        if (newIp) {
            //title("ip更新成功")
            // 保存用戶輸入的 IP 地址
            // 示例：向伺服器發送請求

            GM_xmlhttpRequest({
                method: 'GET',
                url: `http://${newIp}/actors/get`,
                onload(response) {
                    if (response.status === 200) {
                        // 保存新的 IP 地址
                        GM_setValue('serverIp', newIp);
                        title("成功連線到伺服器")
                        // 成功通知

                    } else {
                        // 伺服器返回錯誤
                        title("連線到伺服器 失敗!!")
                    }
                },
                onerror() {
                    // 請求失敗
  title("連線到伺服器 失敗!!")
                },
            });
        }
    });
 searchAllVideoItems()
    // 在整个文档上添加按键事件监听器
    document.addEventListener('keydown', function (event) {
        if (!(event.ctrlKey && (event.key === 'z' || event.key === 'Z'))) return;
        // 在这里编写您的逻辑代码
        // 按下按键时触发的处理函数
        // 在这里编写您的逻辑代码
        //  addVideoHashPath(movieBean, "aaaaaaaa")
        const jsonString = JSON.stringify(movieBean, null, 2);

        //console.log(jsonString)
        copyToClipboard(jsonString)
    });
     try{
    Object.entries(webXPath).map(([key, item]) => {

        let result = getXPathValues(item.classAndIndex.className, item.classAndIndex.index)
        item.handleValue(result)
    });
    //在番號旁邊插入按鈕
    // 定位元素
    var targetElement = document.getElementsByClassName('panel-block first-block')[0]
    // 創建按鈕元素
    var button = document.createElement("button");
    button.innerHTML = "複製json";
    // 插入按鈕元素
    //targetElement.parentNode.insertBefore(button, targetElement.nextSibling);
    targetElement.appendChild(button, targetElement.nextSibling);
    // 監聽按鈕點擊件事
    button.addEventListener("click", function () {
        // 在这里编写您的逻辑代码
        // 按下按键时触发的处理函数
        // 在这里编写您的逻辑代码
        const jsonString = JSON.stringify(movieBean, null, 2);
        //console.log(jsonString)
        copyToClipboard(jsonString)
    });

    let num = movieBean.movie.num.replace("FC2-", "").replace("FC2", "")
    await searchByNumber(num )

   searchAllVideoItems();
     }catch(e){}
})();