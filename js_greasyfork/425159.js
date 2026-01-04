// ==UserScript==
// @name         取消收藏已下架的创意工坊物品
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  进入steam主页，点击创意工坊物品->已订阅物品，程序将会删除已经下架了的创意工坊物品
// @author       渡鸦2345
// @match        https://steamcommunity.com/*/myworkshopfiles/?browsesort=mysubscriptions&browsefilter=mysubscriptions&p=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425159/%E5%8F%96%E6%B6%88%E6%94%B6%E8%97%8F%E5%B7%B2%E4%B8%8B%E6%9E%B6%E7%9A%84%E5%88%9B%E6%84%8F%E5%B7%A5%E5%9D%8A%E7%89%A9%E5%93%81.user.js
// @updateURL https://update.greasyfork.org/scripts/425159/%E5%8F%96%E6%B6%88%E6%94%B6%E8%97%8F%E5%B7%B2%E4%B8%8B%E6%9E%B6%E7%9A%84%E5%88%9B%E6%84%8F%E5%B7%A5%E5%9D%8A%E7%89%A9%E5%93%81.meta.js
// ==/UserScript==

(function() {
    var amount_num = parseInt(document.getElementsByClassName("workshopBrowsePagingInfo")[0].innerText.match(/\d+/g)[2]);//获取总收藏数量
    var main_url = window.location.href.match(/.*?&p=/)[0];//获取创意工坊主地址（截止到p=）
    for(let i = parseInt(amount_num/10)+1; i > 0; i--){
        let url = main_url + i.toString();
        search_offShelf(url);
    }
})();

async function search_offShelf(url){
    let xhr_res = await xhr("GET", url);
    let sub_id = Array.from(xhr_res.getElementsByClassName("general_btn subscribe  panelSwitch toggled")).map(a => a.id.match(/\d+/)[0]);//获取所有订阅id
    let sub_appid = Array.from(xhr_res.getElementsByClassName("general_btn subscribe  panelSwitch toggled")).map(a => a.outerHTML.match(/\d+/g)[1]);//获取所有appid
    for(let i = 0; i < sub_id.length; i++){
        let sub_url = "https://steamcommunity.com/sharedfiles/filedetails/?id=" + sub_id[i];
        let xhr_res = await xhr("GET", sub_url);
        if(xhr_res.getElementsByClassName("sectionText").length != 0){//若为0，即没有下架
            unsubscribe(sub_id[i], sub_appid[i]);
        }
    }
}

//取消订阅
function unsubscribe(id, appid){
    var formData = new FormData()
    formData.append("id", id);
    formData.append("appid", appid);
    formData.append("sessionid", get_sessionid());
    xhr("POST", "https://steamcommunity.com/sharedfiles/unsubscribe", formData);
}

//读取seesionid
function get_sessionid(){
    let sessionid = 0;
    let steam_cookie = document.cookie.split("; ").map(a => a.split("="))
    steam_cookie.forEach(element => {
        if(element[0] == "sessionid"){
            sessionid = element[1];
        }
    });
    return sessionid;
}

function xhr(method, url, formData = null){
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.onload = () => resolve(string2XML(xhr.responseText));
        xhr.send(formData);
    });
}

//将字符串转换成xml对象
function string2XML(xmlString) {
    var parser = new DOMParser();
    var xmlObject = parser.parseFromString(xmlString, "text/html");
    return xmlObject;
}