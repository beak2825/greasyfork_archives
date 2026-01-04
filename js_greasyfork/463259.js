// ==UserScript==
// @name         小雅课程资源下载助手
// @name:zh-CN   小雅课程资源下载助手
// @name:zh-TW   小雅課程資源下載助手
// @name:en      Xiaoya Course Resource Downloader
// @namespace    https://github.com/afeng616/PublicScripts
// @supportURL   https://greasyfork.org/scripts/463259/feedback
// @version      0.2.2
// @description  一键下载小雅课程资源附件
// @description:zh-TW 一鍵下載小雅課程資源附件
// @description:en One-click download Xiaoya course resource attachments
// @author       afeng
// @license      GPL-3.0 License
// @match        https://ccnu.ai-augmented.com/app/jx-web/mycourse/*/resource*
// @icon         data:image/png;base64,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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463259/%E5%B0%8F%E9%9B%85%E8%AF%BE%E7%A8%8B%E8%B5%84%E6%BA%90%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/463259/%E5%B0%8F%E9%9B%85%E8%AF%BE%E7%A8%8B%E8%B5%84%E6%BA%90%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

'use strict';

let course_resources;

// 附件下载实现细节
function parseContent(){
    console.oldLog("::parseContent");
    var download_url = 'https://ccnu.ai-augmented.com/api/jx-oresource/cloud/file_url/';
    var download_list = document.getElementById("download_list");
    download_list.innerHTML = '<h3 style="color:#fcbb34">课程附件清单</h3>';
    for (let i in course_resources) {
        let file_name = course_resources[i].name;
        if (course_resources[i].mimetype) {
            fetch(download_url + course_resources[i].quote_id).then(function(response) {
                return response.json();
            }).then(function(data) {
                if (data.success){
                let file_url = data.data.url;
                var file_info = document.createElement('a');
                file_info.innerHTML = file_name;
                file_info.href = file_url;
                file_info.target = "_blank";
                file_info.addEventListener('mouseover',()=>{
                    file_info.style.color = '#000';
                });
                file_info.addEventListener('mouseout', function() {
                    file_info.style.color = '';
                  });
                console.oldLog('::parse', file_name, file_url);
                download_list.append(file_info);
                }
            }).catch(function(e) {
                console.oldLog('!!error', e);
            });
        }
    }
}

window.showList = function(){
    var download_list = document.getElementById("download_list");
    if(download_list.style.display == "none"){
        download_list.style.display = "flex";
    }else{
        download_list.style.display = "none";
    }
}


// 添加下载按钮
function add_download_button() {
    var down_button = '<div style="z-index:999;position:fixed; left:80px; bottom:50px;display: flex; "><svg onclick="showList()" t="1680053155014" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8308" width="60px" height="60px"><path d="M389.842311 369.275391c0 0-54.207599-52.138474-127.760802-9.55461-65.813938 40.649815-54.193273 115.050316-54.193273 115.050316S61.690526 503.173984 61.690526 652.223648c3.281743 148.84091 158.777213 150.336984 158.777213 150.336984l309.799812-0.467651L386.531915 672.168909l79.646991 0.864694 0.013303-157.420309 102.108562-0.694825 0.732687 157.684322 77.813227 1.106194L530.266527 802.560632l262.197654 0c0 0 144.715963 0.148379 165.04087-141.442406 9.680477-154.855904-139.875724-185.378058-139.875724-185.378058s17.017582-229.233891-193.000666-255.367085C444.611705 201.987341 389.842311 369.275391 389.842311 369.275391z" fill="#fcbb34" p-id="8309"></path></svg><div  id="download_list" style="z-index:999;backdrop-filter: blur(10px);border: 2px solid #fcbb34;border-radius: 5px;display: none;padding: 20px;flex-direction: column;align-items: flex-start;"><h3 style="color:#fcbb34">课程附件清单</h3></div></div>';

    var body = document.getElementById('root');
    var down_div = document.createElement('div');
    down_div.style = "-webkit-user-select: none; /* Safari */-moz-user-select: none; /* Firefox */-ms-user-select: none; /* IE10+/Edge */user-select: none; /* Standard */";

    down_div.innerHTML = down_button;
    body.appendChild(down_div);
}

window.onload = ()=> {
    console.oldLog = console.log;
    console.log = (...data) =>{
        if (data[0] == 'nodesToData')
        {
            course_resources = data[1];
            console.oldLog('::', course_resources);
            parseContent();
        }
    };

    add_download_button();
};


