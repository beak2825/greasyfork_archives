// ==UserScript==
// @name         UTT
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Unroll the twitter thread
// @author       fabsOU
// @match        *://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com/
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        window.onurlchange
// @downloadURL https://update.greasyfork.org/scripts/466955/UTT.user.js
// @updateURL https://update.greasyfork.org/scripts/466955/UTT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    var href = document.location.href;
        //alert('当前页面地址为：' + href);
    let url = href;
    let statusId = url.match(/status\/(\d+)/);
    if (statusId) {
                btn.style.display = 'block';
            }
    else{
                btn.style.display = 'none';
            }



    if (window.onurlchange === null) {
        // feature is supported
        window.addEventListener('urlchange', (info) => {
            console.log("urlchange:",info);
            //alert(info.url)
            url = info.url
            statusId = url.match(/status\/(\d+)/);
            console.log(statusId)
            if (statusId) {
                btn.style.display = 'block';
            }else{
                btn.style.display = 'none';
            }



        });
    }

    const btn = document.createElement('div');

    btn.innerHTML = `<?xml version="1.0" encoding="UTF-8"?>
                     <svg width="48" height="48" clip-rule="evenodd" fill-rule="evenodd" image-rendering="optimizeQuality" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" version="1.1" viewBox="0 0 9144 9144" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                       <style type="text/css">.fil1 {fill:white;fill-rule:nonzero} .fil0 {fill:url(#a)}</style>
                       <linearGradient id="a" x1="8595.4" x2="548.64" y1="8595.4" y2="548.63" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#48CFAE" offset="0"/>
                        <stop stop-color="#4FC0E8" offset="1"/>
                       </linearGradient>
                     </defs>
                     <polygon class="fil0" points="0 0 9144 0 9144 9144 0 9144"/>
                     <path class="fil1" d="m4523 3967h-456c-6 0-12 0-17-1-335-40-642-166-898-316-300-175-535-393-670-543-17 84-22 194-5 318 21 158 79 337 194 516 5 9 9 15 13 20 13 17 22 29 28 52 22 85-6 110-108 137l-4 1c-49 12-107 17-166 13h-7c32 106 83 214 151 319 98 151 231 296 391 424l2 2c5 3 10 7 14 10 25 18 41 29 50 66 21 87-11 103-99 125-59 14-117 21-170 21h-7c35 56 89 119 153 183 173 173 407 338 536 407l18 9c47 23 71 34 71 96v1c-1 51-20 65-60 94l-18 13c-211 157-454 239-684 281-79 15-156 24-229 31 223 97 448 166 671 208 566 105 1119 36 1602-187s897-599 1184-1107c166-294 290-633 361-1012 99-533 126-562 344-799l52-56h-143c-51 0-93-42-93-94 0-18 5-35 14-49l155-245c-133 20-238 28-324 27-137-1-226-24-292-59-7-4-13-9-19-14-192-143-388-211-570-217-170-6-329 42-462 130-133 89-240 218-306 376-75 180-96 397-42 631v4c2 7 6 19 8 29l1 4c13 49 19 75-17 116-33 38-59 37-111 35h-36zm-452-187h416c-51-259-24-500 61-703 80-193 211-351 375-460s361-168 571-161c218 7 451 86 675 254 42 21 103 35 201 36 113 1 271-17 497-61v1c22-5 46-1 67 12 44 28 57 85 29 129l-177 280h175c23-1 47 6 66 22 39 34 43 93 10 132-79 92-141 160-192 215-186 202-208 226-298 706-74 399-206 757-382 1069-307 544-750 947-1268 1185-517 239-1109 314-1714 201-347-65-698-192-1042-385-33-14-56-47-56-85 0-52 42-94 93-94 152 0 355-3 564-41 179-33 365-92 532-197-144-90-342-237-494-390-138-138-242-286-248-414-1-10 0-21 3-32 13-50 64-80 113-67 21 6 48 10 78 12-120-112-223-234-304-359-112-173-184-353-210-529-2-15-1-32 5-48 19-47 74-71 121-52 32 13 69 20 107 22 10 0 20 1 30 1-106-184-161-366-183-529-33-245 10-453 72-562 15-29 44-49 78-52 52-3 96 36 99 88 2 26 277 316 704 565 238 138 520 255 826 291z"/>
                    </svg>`;
    btn.style.position = 'fixed';
    btn.style.right = '650px';
    btn.style.top = '15px';

    btn.style.cursor = 'pointer';

    btn.style.display = 'none';



    document.body.appendChild(btn);



    btn.addEventListener('click', () => {
        //var href = document.location.href;
        //alert('当前页面地址为：' + href);
        //let url = href;
        // 使用正则表达式提取 status ID
        //let statusId = url.match(/status\/(\d+)/);
        // 生成 unroll page
        let unroll_url = "https://twitter-thread.com/api/unroll-thread?id=" + statusId[1];
        console.log(unroll_url);

        GM_xmlhttpRequest({
            responseType: 'json',
            url: unroll_url,
            onreadystatechange: (res) => {
                if (res.readyState === 4) {
                    console.log(res.response.statusCode)
                    if( 200 == res.response.statusCode){
                       let str = statusId[1];
                       console.log(`https://twitter-thread.com/api/unroll-thread/${str}`)
                       GM_openInTab(`https:twitter-thread.com/t/${str}`, { active: true });
                    }
                }
            },
        })


    });










})();