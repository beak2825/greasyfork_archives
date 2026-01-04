// ==UserScript==
// @name        pixiv下载标签图片数据
// @namespace   蒋晓楠
// @version     20240106
// @description 下载pixiv指定标签的图片数据
// @author      蒋晓楠
// @license     MIT
// @match       https://www.pixiv.net/tags/*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_notification
// @grant       GM_addStyle
// @grant       GM_addElement
// @grant       GM_registerMenuCommand
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/485057/pixiv%E4%B8%8B%E8%BD%BD%E6%A0%87%E7%AD%BE%E5%9B%BE%E7%89%87%E6%95%B0%E6%8D%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/485057/pixiv%E4%B8%8B%E8%BD%BD%E6%A0%87%E7%AD%BE%E5%9B%BE%E7%89%87%E6%95%B0%E6%8D%AE.meta.js
// ==/UserScript==
//获取标签列表数据
function GetTagListData(Tag, Version, PageNumber) {
    console.log(`获取第${PageNumber}页`);
    GM_xmlhttpRequest({
        url: `https://www.pixiv.net/ajax/search/artworks/${Tag}?word=${Tag}&order=date_d&mode=all&p=${PageNumber}&csw=0&s_mode=s_tag_full&type=all&lang=zh&version=${Version}`,
        onload: (Response) => {
            let Data = JSON.parse(Response.response).body.illustManga,
                OldData = GM_getValue("TagListData").concat(Data.data);
            GM_setValue("TagListData", OldData);
            //下一页
            if (PageNumber < Data.lastPage) {
                PageNumber++;
                GetTagListData(Tag, Version, PageNumber);
            } else {
                console.log("获取完成");
                let ExportJson = document.createElement("a");
                ExportJson.download = "列表数据.json";
                ExportJson.href = URL.createObjectURL(new Blob([JSON.stringify(OldData)]));
                ExportJson.click();
            }
        }
    });
}

//运行
function Run() {
    GM_registerMenuCommand("获取标签列表数据", () => {
        let Tag = prompt("标签名称");
        if (Tag !== null) {
            GM_setValue("TagListData", []);
            GetTagListData(Tag, "a48f2f681629909b885608393916b81989accf5b", 1);
        }
    });
}

Run();