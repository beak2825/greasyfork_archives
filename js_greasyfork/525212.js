// ==UserScript==
// @name         FC2PPVDB 预览图
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  给FC2PPVDB作品详情页添加预览图
// @author       Duckee
// @match        *://fc2ppvdb.com/articles/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525212/FC2PPVDB%20%E9%A2%84%E8%A7%88%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/525212/FC2PPVDB%20%E9%A2%84%E8%A7%88%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const FC2Num = GetFC2Num();
    if(FC2Num == 0)
        return;

    const container = document.querySelector('.container');

    const sukebeiSearchURL = "https://sukebei.nyaa.si/?f=0&c=0_0&q=" + FC2Num;
    AddMagnetSearch();

    const previewUrlHost = "https://baihuse.com";
    const previewUrl_Page = previewUrlHost+ "/fc2daily/detail/FC2-PPV-" + FC2Num;


    GM_xmlhttpRequest({
        method: "GET",
        url: previewUrl_Page,
        onload: (response) =>
        {
            if(response.status === 200)
            {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, "text/html");
                const images= doc.querySelectorAll('img');
                const videos = doc.querySelectorAll('video');
                const isMultImg = images.length > 3;


                //NoData
                if(images.length < 2 && videos.length ==0)
                {
                    NoPreviewTip();
                    return;
                }

                //Image
                const imageContainer = document.createElement('div');
                imageContainer.style.display = 'grid';
                imageContainer.style.gridTemplateColumns = isMultImg ? '1fr 1fr 1fr' : '1fr';
                imageContainer.style.gap = '10px';
                imageContainer.style.marginTop = '10px';
                //remove 1st&last img
                for (var i = 1; i<images.length-1; i++)
                {
                    const path = new URL(images[i].src).pathname;
                    const imgSrc = previewUrlHost + path;

                    const imgEle = document.createElement('img');
                    imgEle.src = imgSrc;
                    imgEle.style.width = 'auto';
                    imgEle.style.height = 'auto';

                    if(isMultImg && imgSrc.includes("grid.jpg"))
                        imgEle.style.gridColumn = "span 3";

                    imageContainer.appendChild(imgEle);
                }
                container.appendChild(imageContainer);


                //Video
                const videoContainer = document.createElement('div');
                videoContainer.style.display = 'grid';
                videoContainer.style.gridTemplateColumns = '1fr 1fr 1fr';
                videoContainer.style.gap = '10px';
                videoContainer.style.marginTop = '10px';

                videos.forEach(v =>
                {
                    const path = new URL(v.src).pathname;
                    const videoSrc = previewUrlHost + path;

                    const video = document.createElement('video');
                    video.src = videoSrc;
                    video.autoplay = true;
                    video.loop = true;
                    video.muted = true;
                    videoContainer.appendChild(video);
                });
                container.appendChild(videoContainer);
            }
            else
            {
                NoPreviewTip();
            }
        }
    });


    function GetFC2Num()
    {
        const currentUrl = window.location.href;
        const result = currentUrl.match(/articles\/(\d+)/);
        if(result == null)
        {
            console.log("无效");
            return 0;
        }
        else
        {
            console.log("有效" + result[1]);
            return result[1];
        }
    }

    function NoPreviewTip()
    {
        const h1 = document.createElement('h1');
        h1.textContent = "暂无预览";
        h1.style.textAlign = 'center';
        h1.style.fontSize = '24px';
        h1.style.color = 'white';
        h1.style.marginTop = '10px';
        container.appendChild(h1);
    }

    function AddMagnetSearch()
    {
        const searchContainer = document.createElement('div');
        searchContainer.style.display = 'flex';
        searchContainer.style.justifyContent = 'center';
        searchContainer.style.marginTop = '10px';
        searchContainer.style.paddingBottom = '10px';
        searchContainer.style.borderBottom = '2px solid #1f2937';

        const search = document.createElement('a');
        search.innerHTML = "Sukebei搜索";
        search.href = sukebeiSearchURL;
        search.target = '_blank';
        search.style.textAlign = 'center';
        search.style.fontSize = '18px';
        search.style.color = "#3f83f8";
        search.style.margin = '0 10px';


        searchContainer.appendChild(search);
        container.appendChild(searchContainer);
    }

})();