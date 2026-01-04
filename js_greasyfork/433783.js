// ==UserScript==
// @name        西瓜Down - 西瓜视频下载工具
// @namespace   Violentmonkey Scripts
// @match       https://www.ixigua.com/*
// @grant       none
// @version     1.4
// @license     MIT 
// @author      Apollo Wang
// @description 2021/7/30 下午9:01:58
// @downloadURL https://update.greasyfork.org/scripts/433783/%E8%A5%BF%E7%93%9CDown%20-%20%E8%A5%BF%E7%93%9C%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/433783/%E8%A5%BF%E7%93%9CDown%20-%20%E8%A5%BF%E7%93%9C%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
function HTMLInit() {
    let head = document.querySelector("head")
    let newStyle = document.createElement("style")
    newStyle.innerHTML = "body{margin:0;}.left{position:fixed;width:200px;height:100%;left:-200px;background:whitesmoke;z-index:1000;box-shadow:5px 0px 10px rgba(0,0,0,.2);transition:all 0.3s;text-align:center;z-index:9998;}.left.left-open{left:0;margin:0;object-fit:fill;z-index:9998;}.mask{display:none;position:fixed;height:100%;width:100%;background:rgba(0,0,0,.5);z-index:9996;}#open{position:fixed;top:calc(50vh);background:transparent;z-index:9997;cursor:pointer;}.open-svg{height:50%;width:50%;margin-left:-20px;z-index:9997;}"
    head.appendChild(newStyle)

    let body = document.querySelector("body")
    let ext_btn = document.createElement('div')
    let first = document.body.firstChild;
    ext_btn.innerHTML = '<div id="open"><svg t="1646473061507" class="icon open-svg" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2443" width="128" height="128"><path d="M512.26 959.78A447.85 447.85 0 0 1 338 99.5a445 445 0 0 1 174.26-35.2 449.74 449.74 0 0 1 105.48 12.5 32 32 0 0 1-15 62.21 385.65 385.65 0 0 0-90.45-10.71A383.74 383.74 0 1 0 896 512a32 32 0 0 1 64 0 447.39 447.39 0 0 1-447.74 447.78z" fill="#229B00" p-id="2444"></path><path d="M889 336.84a412 412 0 0 1 23.27 62.25" fill="#FFFFFF" p-id="2445"></path><path d="M912.21 431.09a32 32 0 0 1-30.76-23.26A381.3 381.3 0 0 0 860 350.42a32 32 0 0 1 57.95-27.17A445.62 445.62 0 0 1 943 390.33a32 32 0 0 1-30.8 40.76z" fill="#229B00" p-id="2446"></path><path d="M714.6 150a416.51 416.51 0 0 1 92 69.55q14.46 14.48 27.47 30.34" fill="#FFFFFF" p-id="2447"></path><path d="M834.11 281.85a31.94 31.94 0 0 1-24.76-11.71c-8-9.71-16.49-19.13-25.37-28A384.31 384.31 0 0 0 699 177.92 32 32 0 1 1 730.17 122a448.32 448.32 0 0 1 99.09 74.9 455.344 455.344 0 0 1 29.58 32.67 32 32 0 0 1-24.73 52.29z" fill="#229B00" p-id="2448"></path><path d="M512 512m-320.22 0a320.22 320.22 0 1 0 640.44 0 320.22 320.22 0 1 0-640.44 0Z" fill="#F35336" p-id="2449"></path><path d="M647.92 327.66c-8 12.41-48 26.12-48 26.12a0.75 0.75 0 0 1-1-0.67S594.93 311 603 298.59a26.77 26.77 0 1 1 45 29.07zM724 425.93c-12.87 7.28-54.66 0.89-54.66 0.89a0.75 0.75 0 0 1-0.61-1.08s16-39.12 28.91-46.4A26.77 26.77 0 0 1 724 425.93zM734.56 546.34c-14.36-3.49-40.47-36.75-40.47-36.75a0.75 0.75 0 0 1 0.29-1.2s38.47-17.56 52.83-14.06a26.77 26.77 0 1 1-12.65 52zM691.35 650.92c-11.4-9.41-20.4-50.72-20.4-50.72a0.75 0.75 0 0 1 0.79-1s42.27 1 53.68 10.38a26.77 26.77 0 0 1-34.06 41.3zM599.91 721.92c-5.4-13.76 6.8-54.25 6.8-54.25a0.75 0.75 0 0 1 1.15-0.45s36.48 21.38 41.88 35.14a26.77 26.77 0 0 1-49.83 19.56zM374.64 327.66c8 12.41 48 26.12 48 26.12a0.75 0.75 0 0 0 1-0.67s3.91-42.1-4.11-54.52a26.77 26.77 0 0 0-45 29.07zM298.58 425.93c12.87 7.28 54.66 0.89 54.66 0.89a0.75 0.75 0 0 0 0.61-1.08s-16-39.12-28.91-46.4a26.77 26.77 0 1 0-26.36 46.59zM288 546.34c14.36-3.49 40.47-36.75 40.47-36.75a0.75 0.75 0 0 0-0.29-1.2s-38.47-17.56-52.83-14.06a26.77 26.77 0 1 0 12.65 52zM331.21 650.92c11.4-9.41 20.4-50.72 20.4-50.72a0.75 0.75 0 0 0-0.79-1s-42.27 1-53.68 10.38a26.77 26.77 0 1 0 34.06 41.3zM422.65 721.92c5.4-13.76-6.8-54.25-6.8-54.25a0.75 0.75 0 0 0-1.15-0.45s-36.48 21.38-41.88 35.14a26.77 26.77 0 0 0 49.83 19.56z" fill="" p-id="2450"></path></svg></div><div class="left"><p><b style="font-size:20px;margin-top:14px;">西瓜Down</b></p><hr style="FILTER: alpha(opacity=100,finishopacity=0,style=3)" color="gray" SIZE=3><insert-this></insert-this></div><div class="mask"></div>'
    body.insertBefore(ext_btn, first)

    let open = document.getElementById("open");
    let left = document.querySelector(".left");
    let mask = document.querySelector(".mask");
    open.onclick = function() {
        open.style.display = "none";
        left.className += " left-open";
        mask.style.display = "block";
    }
    mask.onclick = function() {
        left.className += "left";
        mask.style.display = "none";
        open.style.display = "block"
    }
}

function txt_generate(data, name) {
    const file = new Blob(data, { type: 'text/plain' });
    a.href = URL.createObjectURL(file);
    a.download = name;
}

if (document.location.toString() !== "https://www.ixigua.com/") {
    HTMLInit();
    const place = document.getElementsByClassName('left')[0];
    const map = new Map();

    function GetUrlRelativePath() {
        let url = document.location.toString();
        let arrUrl = url.split("//");
        let start = arrUrl[1].indexOf("/");
        let relUrl = arrUrl[1].substring(start); //stop省略，截取从start开始到结尾的所有字符
        if (relUrl.indexOf("?id") != -1) {
            relUrl = relUrl.split("?id")[1];
        } else if (relUrl.indexOf("?") != -1) {
            relUrl = relUrl.split("?")[0];
        }
        return relUrl;
    }

    let url = "https://www.ixigua.com/api/public/videov2/brief/details?group_id=" + GetUrlRelativePath().substr(1)
    const Http = new XMLHttpRequest()
    Http.open("GET", url)
    Http.send()

    Http.onreadystatechange = (e) => {
        if (Http.readyState === XMLHttpRequest.DONE && Http.status === 200) {
            let json = JSON.parse(Http.responseText)
            let videoUrls = json['data']['videoResource']['normal']['video_list']
            for (var p in videoUrls) { //遍历json对象的每个key/value对,p为key
                map.set(videoUrls[p]['definition'], atob(videoUrls[p]['main_url']));
                let pTag = document.createElement('p');
                let a = document.createElement('a');
                a.text = videoUrls[p]['definition'];
                a.href = atob(videoUrls[p]['main_url']);
                pTag.appendChild(a);
                pTag.style = "padding-top: 20px;"
                place.appendChild(pTag);
            }
        }
    }
}