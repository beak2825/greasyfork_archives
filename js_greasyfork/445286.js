// ==UserScript==
// @name         GetAdsysMaterialInfo
// @namespace    http://tampermonkey.net/
// @version      0.9.9
// @description  直接从链接获取素材库信息！
// @author       You
// @match        *://quantum.63yx.com/index.php?c=adsys-AdsysMaterial*
// @match        *://quantum.63yx.com//index.php?c=adsys-AdsysMaterial*
// @match        *://quantum.37wan.com//index.php?c=adsys-AdsysMaterial*
// @match        *://quantum.37wan.com/index.php?c=adsys-AdsysMaterial*
// @icon         https://s2.loli.net/2022/05/27/pP4fL8l3ik7G6zK.png
// @grant        GM_xmlhttpRequest
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/445286/GetAdsysMaterialInfo.user.js
// @updateURL https://update.greasyfork.org/scripts/445286/GetAdsysMaterialInfo.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    var title = document.title;
    if (title == "量子系统"){
        return}
    var open = false;
    var video = document.getElementsByClassName("virwsr");
    if (video.length >= 1){
        video = video[0];
        video.setAttribute("controlslist", "download");
        video.style.position = 'absolute'
        video.style.zIndex = '0'
    }

    var button = document.createElement("button"); //创建一个按钮
    button.textContent = ""; //按钮内容
    button.style.width = "10px"; //按钮宽度
    button.style.height = "10px"; //按钮高度
    button.style.align = "center"; //文本居中
    button.style.color = "white"; //按钮文字颜色
    button.style.background = "#272727"; //按钮底色
    button.style.border = "0px solid #272727"; //边框属性
    button.style.borderRadius = "0px"; //按钮四个角弧度
    button.style.position = "relative";
    button.style.zIndex = '999'
    button.addEventListener("click", clickBotton) //监听按钮点击事件
    document.body.prepend(button);

    var currentUrl = location.href;
    console.log(currentUrl);

    console.log(title);
    title = title.split('(')[0];
    if ((title.split('_')).length-1 > 1)
    {
        title = title.split('_').slice(0,2);
        title = title.join('_');
    }
    else
    {
        title = title;
    }
    title = title.replace('_提示', '').replace('-提示', '').replace('-快手', '').replace('_快手', '');
    console.log(title);
    var titleStr = title
    title = encodeURIComponent(title)

    var rawData = ""
    if (currentUrl.includes("&path=")) {
        var title_sp = currentUrl.split('&path=');
        console.log(title_sp.length);
        var _title = title_sp[title_sp.length - 1];
        console.log(_title)
        var _link = atob(_title);
        console.log(_link)
        var _link_sp = _link.split('/');
        title = _link_sp[4];
    }
    else if (currentUrl.includes("package_id=")) {
        var title_sp = currentUrl.split('package_id=');
        console.log(title_sp.length);
        title = title_sp[title_sp.length - 1];
    }
    else if (title == "") {
        rawData = "嗯哼"
    }

    var titleStr = title;
    titleStr  = decodeURIComponent(titleStr );
    console.log(titleStr);

    const base = "http://quantum.37wan.com/index.php?c=adsys-AdsysMaterial&a=";
    const end = "&status=&page=1&page_size=20&start_time=&end_time=&material_types=&promotion_type=2&is_sensitive=0&is_privacy=&privacy_department_ids=&privacy_group_ids=&m_group_ids=&p_game_ids=&labels=&formats=&sizes=&w_h_rates=&design_category_ids=&consume_types=&source=&creator_id=&provider_id=&suffix_id=&add_suffix_id=&idea_group=";
    const Url = base + "list&order_way=&desc=1&search_name=" + title + end;
    const auditUrl = base + "auditlist&order_way=&desc=1&search_name=" + title + end;
    const myUrl = base + "mylist&order_way=&desc=1&search_name=" + title + end;

    async function getData(data) {
        return new Promise((resolve, reject) => {
            var reData = {}
            if (data.list.pager.count > 0)
            {
                var index = 0
                for (let i = 0; i < Object.keys(data.list.data).length; i++) {
                    if (titleStr == data.list.data[i].NAME){
                        console.log('a')
                        index = i
                    }
                }
                var mateName = data.list.data[index].NAME;
                var mateCreator = data.list.data[index].CREATOR;
                var mateSource = data.list.data[index].GAME_NAMES;
                var mateProvider = data.list.data[index].MAIN_PROVIDER_NAME;
                var cost7 = data.list.data[index].COST_MONEY_SEVEN_DAYS;
                var cost30 = data.list.data[index].COST_MONEY_THIRTY_DAYS;
                var cost90 = data.list.data[index].COST_MONEY_90;
                var sourceH = '';
                var sourceV = '';
                for (var x in data.list.data[index].MATERIAL_SOURCE.video){
                    var size = data.list.data[index].MATERIAL_SOURCE.video[x].SIZE;
                    var sizeSplit = size.split("X");
                    if (parseInt(sizeSplit[0]) >= parseInt(sizeSplit[1])){
                        if (data.list.data[index].MATERIAL_SOURCE.video[x].URL.indexOf("http://") != -1){
                            sourceH = data.list.data[index].MATERIAL_SOURCE.video[x].URL;
                        }else{
                            sourceH = "https://quantum.63yx.com/index.php?c=api-AdsysMaterial&a=transfer&sec=" + data.list.data[index].MATERIAL_SOURCE.video[x].ID;
                        }
                    }else{
                        if (data.list.data[index].MATERIAL_SOURCE.video[x].URL.indexOf("http://") != -1){
                            sourceV = data.list.data[index].MATERIAL_SOURCE.video[x].URL;
                        }else{
                            sourceV = "https://quantum.63yx.com/index.php?c=api-AdsysMaterial&a=transfer&sec=" + data.list.data[index].MATERIAL_SOURCE.video[x].ID;
                        }
                    }

                    if (sourceH != '' && sourceV != ''){
                        break;
                    }
                };
                reData.creator = mateCreator
                reData.name = mateName
                reData.source = mateSource
                reData.provider = mateProvider
                reData.cost7 = cost7
                reData.cost30 = cost30
                reData.cost90 = cost90
                reData.hUrl = sourceH
                reData.vUrl = sourceV
            }
            resolve(reData);
        })
    };

    async function getEditor(name) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: Url,
                onload: async function(response) {
                    var data = JSON.parse(response.responseText);
                    var reData = await getData(data);
                    if (JSON.stringify(reData) != "{}"){
                        console.log(Url);
                        resolve(reData);
                    }
                    else
                    {
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: auditUrl,
                            onload: async function(response) {
                                var data = JSON.parse(response.responseText);
                                var reData = await getData(data);
                                if (JSON.stringify(reData) != "{}"){
                                    console.log(auditUrl);
                                    resolve(reData);
                                }
                                else
                                {
                                    GM_xmlhttpRequest({
                                        method: "GET",
                                        url: myUrl,
                                        onload: async function(response) {
                                            var data = JSON.parse(response.responseText);
                                            var reData = await getData(data);
                                            if (JSON.stringify(reData) != "{}"){
                                                console.log(myUrl);
                                                resolve(reData);
                                            }
                                            else
                                            {
                                                resolve("数据为空!");
                                            }
                                        },
                                        onerror: function(error) {
                                            reject(error);
                                        }
                                    });
                                }
                            },
                            onerror: function(error) {
                                reject(error);
                            }
                        });
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    if (rawData === "") {
        rawData = await getEditor(title);
        console.log(rawData)
    }
    var div = document.createElement("div");
    var text = ''
    if (typeof(rawData) == 'string'){
        text = "不支持该地址的视频噢~\n目前适配: 包预览、列表预览\n请从预览按钮打开该视频...";
    }else{
        text ="作品名：" + rawData.name + "\n" + "创作者：" + rawData.creator + "\n" + "创意者：" + rawData.provider + "\n" + "主游戏：" + rawData.source + "\n" + "七日消耗：" + rawData.cost7+ "\n" + "三十日消耗：" + rawData.cost30+ "\n" + "九十日消耗：" + rawData.cost90 + "\n";
    }
    div.innerText = text;
    div.style.color='grey';
    div.style.backgroundColor='black';
    div.style.width="200px";
    div.style.height="300px";
    div.style.position = "relative";
    div.style.zIndex=99999;
    if (typeof(rawData) != 'string'){
        const linkH = document.createElement("a");
        linkH.setAttribute('href', rawData.hUrl);
        linkH.textContent = '横板';
        var br = document.createElement("br");
        const linkV = document.createElement("a");
        linkV.setAttribute('href', rawData.vUrl);
        linkV.textContent = '竖板';
        div.append(linkH);
        div.append(br);
        div.append(linkV);
    }
    document.body.appendChild(div);
    div.style.display= "none";

    function clickBotton(){

        if (open == false){
            document.body.onselectstart = function() {return true;}
            document.onselectstart = function() {return true;}
            div.style.display= "block";
            open = true;
        }
        else{
            open = false;
            div.style.display= "none";}
    };
})();