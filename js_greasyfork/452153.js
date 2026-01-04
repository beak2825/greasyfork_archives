// ==UserScript==
// @name         Youtube导出Channel列表
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Channel
// @author       You
// @match        https://www.youtube.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452153/Youtube%E5%AF%BC%E5%87%BAChannel%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/452153/Youtube%E5%AF%BC%E5%87%BAChannel%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let getChannel = (url) => fetch(url).then(res => res.url).then(res => fetch(res)).then(res => res.text()).then(res => {
      //const channelId = res.match(/https:\/\/www.youtube.com\/channel\/([a-zA-Z\-_]+)/)?.[1];
      //if(channelId) {return channelId}
      const channelLink = res.match(/@id":.*?"(.+?)",/)?.[1].replace(/\\\//g,'/');
      return channelLink && fetch(channelLink.replace('http:', 'https:')).then(res => res.text()).then(res => res.match(/"https:\/\/www.youtube.com\/channel\/(.+?)"/)?.[1])
    });
    const downloadCsv = (content, name) => {
        let csvContent = "data:text/csv;charset=utf-8," + content;
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", name || "my_data.csv");
        document.body.appendChild(link); // Required for FF
        link.click(); // This will download the data file named "my_data.csv".
    }

    // Your code here...
    const init = () => {
        const concur = 6;
        const content = document.body;
//        const content = document.querySelector('#home-page-skeleton');
        content.innerHTML = `<div>
        <textarea id="videos" name="textarea" style="width:800px;min-height: 300px;" placeholder="视频链接，每行一个"></textarea>
        <button id="export">导出channel列表</button>
        </div>`
        const handleClick = async () => {
            const ids = document.querySelector('#videos').value.split('\n').filter(id => id && id.match(/youtube\.com\/video\/.+/));
            const btn = document.querySelector('#export');
            if(ids.some(e => !e.match(/youtube\.com/))) {
                alert('链接不正确')
            }
            btn.innerText = "loading";
            const channelList = []
            const id_and_channel = [];
            for(let i = 0; i < ids.length / concur; i++ ){
                const partids = ids.slice(i*concur,(i+1)*concur).map(e => `https://www.${e}`);
                let channels = []
                try{
                    channels = await Promise.all(partids.map(getChannel));
                } catch(err ) {
                    console.error(err);
                    channels = await Promise.all(partids.map(getChannel));
                }
                btn.innerText = `进度：${(i+1)*concur}/${ids.length}`;
                channelList.push(...channels.filter(Boolean))
                id_and_channel.push(...partids.map((id, i) => [id, channels[i],`https://www.youtube.com/channel/${channels[i]}`].join(',')))
            }
            btn.innerText = "导出channel列表";
            console.log(channelList, id_and_channel)
            const stamp = Date.now();
            downloadCsv(id_and_channel.join('\n'), `链接与对应渠道_${stamp}.csv`)
            downloadCsv([...new Set(channelList)].map(ch => [ch, `https://www.youtube.com/channel/${ch}`].join(',')).join('\n'), `去重渠道_${stamp}.csv`)
        }
        document.querySelector('#export').addEventListener('click', handleClick)
    }
    window.onload=()=>{
        setTimeout(init, 1000);
    }
})();