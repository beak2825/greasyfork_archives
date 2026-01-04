// ==UserScript==
// @name         紧凑的优雷卡时钟界面(eureka.ffxivsc.cn)
// @description  紧凑的时钟界面
// @version      0.2
// @author       金光闪闪大萌德
// @namespace    https://github.com/Elypha
// @match        https://eureka.ffxivsc.cn/fire*
// @match        https://eureka.ffxivsc.cn/p*
// @match        https://eureka.ffxivsc.cn/a*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381097/%E7%B4%A7%E5%87%91%E7%9A%84%E4%BC%98%E9%9B%B7%E5%8D%A1%E6%97%B6%E9%92%9F%E7%95%8C%E9%9D%A2%28eurekaffxivsccn%29.user.js
// @updateURL https://update.greasyfork.org/scripts/381097/%E7%B4%A7%E5%87%91%E7%9A%84%E4%BC%98%E9%9B%B7%E5%8D%A1%E6%97%B6%E9%92%9F%E7%95%8C%E9%9D%A2%28eurekaffxivsccn%29.meta.js
// ==/UserScript==

(function() {

    // 若需要替换地图，请自行在代码中删除23行和31行的注释标记"/*", "*/"，按Ctrl+S保存。


    var url = window.location.href;
    var url_pyros = url.search(/\/fire\/\?k=/);
    var url_pagos = url.search(/\/p\/\?k=/);
    var url_anemos = url.search(/\/a\/\?k=/);

/*
    if (url_pyros) {
        document.getElementsByClassName("mdui-img-fluid")[0].setAttribute("src", "https://ffxiv-eureka.com/assets/images/maps/pyros-all-9011b434e692f81b87b02be0a4fe7cbe.jpg")
    } else if (url_pagos) {
        document.getElementsByClassName("mdui-img-fluid")[0].setAttribute("src", "https://ffxiv-eureka.com/assets/images/maps/pagos-all-ddcec54a20fc1d8297aa56568a7d6f73.jpg")
    } else if (url_anemos) {
        document.getElementsByClassName("mdui-img-fluid")[0].setAttribute("src", "https://ffxiv-eureka.com/assets/images/maps/anemos-all-c095a507c2c07da77a9a033438f068c8.jpg")
    }
*/

    var style = document.createElement("style")
    style.type = "text/css"
    style.innerHTML=".eureka-list-item{height:37px;min-height:unset;}.mdui-typo-subheading,.mdui-typo-subheading-opacity{font-size:14px;}.mdui-list>.mdui-divider{margin-top:0px;margin-bottom:0px;}"+
        ".eureka-list{padding-top:0px;padding-bottom:0px;}.eureka-list{background:#eff3f5;}.mdui-list-item-avatar{min-width:24px;max-width:24px;height:24px;line-height:24px;}"+
        ".eureka-list-item-level{font-size:14px!important;}.mdui-ripple{height:22px;line-height:unset;}@media(min-width:1024px){body{font-size:12px;}}.mdui-col>.mdui-typo-title{margin-top:16px!important;margin-bottom:0px!important;}"+
        ".mdui-theme-accent-light-blue>.mdui-radio{width:70px;}.mdui-m-t-1>.mdui-radio{width:148px;}.mdui-radio{height:28px;}.mdui-theme-accent-light-blue>.mdui-m-t-2{margin-top:8px!important;}"+
        ".mdui-checkbox{margin-left:8px;}p{margin-top:2px;margin-bottom:2px;font-size:13px!important;}.eureka-print-content{width:100%;height:70px;}.mdui-m-b-2{margin-bottom:8px!important;}"+
        ".mdui-table th{line-height:28px;}.mdui-table td{line-height:unset;}.mdui-table td,.mdui-table th{padding:3px 28px;}.weather{position:absolute;right:290px;}";
    document.getElementsByTagName("HEAD").item(0).appendChild(style)

    var content = document.getElementsByClassName("mdui-list-item-content")
/*
    var night = document.createElementNS("http://www.w3.org/2000/svg", 'svg')
    night.setAttributeNS(null,"class","icon-night")
    night.setAttributeNS(null,"width","12")
    night.setAttributeNS(null,"height","12")
    night.setAttributeNS(null,"viewBox","0 0 512 512")
    night.setAttributeNS(null,"height","12")
    var night_path = document.createElementNS('http://www.w3.org/2000/svg',"path")
    night_path.setAttributeNS(null, "d", "M283.211 512c78.962 0 151.079-35.925 198.857-94.792 7.068-8.708-.639-21.43-11.562-19.35-124.203 23.654-238.262-71.576-238.262-196.954 0-72.222 38.662-138.635 101.498-174.394 9.686-5.512 7.25-20.197-3.756-22.23A258.156 258.156 0 0 0 283.211 0c-141.309 0-256 114.511-256 256 0 141.309 114.511 256 256 256z");
*/
    setTimeout(function() {
        if (url_pyros) {
            content[0].outerHTML = '<div class="mdui-list-item-content mdui-typo-subheading-opacity eureka-list-item-title">琉科西亚</div><svg width="12" height="12" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" class="weather" style="vertical-align: middle;margin-right:2px;"><path d="M283.211 512c78.962 0 151.079-35.925 198.857-94.792 7.068-8.708-.639-21.43-11.562-19.35-124.203 23.654-238.262-71.576-238.262-196.954 0-72.222 38.662-138.635 101.498-174.394 9.686-5.512 7.25-20.197-3.756-22.23A258.156 258.156 0 0 0 283.211 0c-141.309 0-256 114.511-256 256 0 141.309 114.511 256 256 256z"></path></svg>'
            content[1].outerHTML = '<div class="mdui-list-item-content mdui-typo-subheading-opacity eureka-list-item-title">佛劳洛斯</div><img src="https://cdn.ffxivsc.cn/icon_thunder.png" class="weather" alt="打雷" title="打雷" height="18" width="18" style="vertical-align: middle;">'
            content[4].outerHTML = '<div class="mdui-list-item-content mdui-typo-subheading-opacity eureka-list-item-title">阿斯卡拉福斯</div><img src="https://cdn.ffxivsc.cn/icon_UmbralWind.png" class="weather" alt="灵风" title="灵风" height="18" width="18" style="vertical-align: middle;">'
            content[5].outerHTML = '<div class="mdui-list-item-content mdui-typo-subheading-opacity eureka-list-item-title">巴钦大公爵</div><svg width="12" height="12" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" class="weather" style="vertical-align: middle;margin-right:2px;"><path d="M283.211 512c78.962 0 151.079-35.925 198.857-94.792 7.068-8.708-.639-21.43-11.562-19.35-124.203 23.654-238.262-71.576-238.262-196.954 0-72.222 38.662-138.635 101.498-174.394 9.686-5.512 7.25-20.197-3.756-22.23A258.156 258.156 0 0 0 283.211 0c-141.309 0-256 114.511-256 256 0 141.309 114.511 256 256 256z"></path></svg>'
            content[11].outerHTML = '<div class="mdui-list-item-content mdui-typo-subheading-opacity eureka-list-item-title">闪电督军</div><img src="https://cdn.ffxivsc.cn/icon_thunder.png" class="weather" alt="打雷" title="打雷" height="18" width="18" style="vertical-align: middle;">'
            content[15].outerHTML = '<div class="mdui-list-item-content mdui-typo-subheading-opacity eureka-list-item-title">斯库尔</div><img src="https://cdn.ffxivsc.cn/icon_blizzardy.png" class="weather" alt="暴雪" title="暴雪" height="18" width="18" style="vertical-align: middle;">'
            content[16].outerHTML = '<div class="mdui-list-item-content mdui-typo-subheading-opacity eureka-list-item-title">彭忒西勒亚</div><img src="https://cdn.ffxivsc.cn/icon_blistering.png" class="weather" alt="热浪" title="热浪" height="18" width="18" style="vertical-align: middle;">'
        } else if (url_pagos) {

        } else if (url_anemos) {

        }

    }, 3000)

})();