// ==UserScript==
// @name         Nico manga download
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Just do it
// @author       Tinyblack / Youwang Translation Group
// @match        https://seiga.nicovideo.jp/watch/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421951/Nico%20manga%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/421951/Nico%20manga%20download.meta.js
// ==/UserScript==

(function() {
	//创建按钮对象
    var downloadicon = document.createElement("button");
    downloadicon.style.cssText = 'position:fixed; right:1% ; top:20%; width: 180px; height: 60px;font-size: 16px;cursor: pointer;font-weight: 400;border: 0 solid;background-color: white;outline: 1px solid;transition: box-shadow 0.5s, outline-offset 0.3s, outline 0.3s, border-color 0.3s;';
    downloadicon.innerHTML = "下载所有图片";
    //控制下载方法
    downloadicon.onclick = function downloadimg(){
        let file = 1;
        let tcanvaslist = document.getElementsByTagName("canvas");
        let canvaslist = [];
        let indexlist = [];
        let min = 0;
        for (let i = 0 ; i < tcanvaslist.length ;)  //按元素位于页面上下气泡排序
        {
            for(let j = 0 ; j < tcanvaslist.length ; j++)
            {
                if(tcanvaslist[j].getBoundingClientRect().y < tcanvaslist[min].getBoundingClientRect().y)
                {
                    if(indexlist.includes(j) != true)
                    {
                        min = j;
                    }
                }

            }
            canvaslist.push(tcanvaslist[min]);
            indexlist.push(min);
            i++;
            min = i;
        }
        console.log("canvaslist:"+canvaslist);
        console.log("indexlist:"+indexlist);
        for (let i = 0 ; i < canvaslist.length ; i++){      //下载
            if(canvaslist[i].className != "balloon canvas")
            {
                let link = document.createElement("a");
                link.href = canvaslist[i].toDataURL();
                let filetype = ".jpg";
                if(canvaslist[i].toDataURL().match("data:image/png;") != null)
                {
                    filetype = ".png";
                }
                if(canvaslist[i].toDataURL().match("data:image/jpg;") || canvaslist[i].toDataURL().match("data:image/jpeg;") != null)
                {
                    filetype = ".jpg";
                }
                link.download = file + filetype;
                link.click();
                file ++;
            }
        }
    };
    document.body.appendChild(downloadicon);        //添加下载按钮至网页
})();