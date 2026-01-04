// ==UserScript==
// @name         JAV快捷跳转
// @namespace    video_search_through_javlibrary
// @version      0.40
// @description  为部分JAV站点添加跳转功能，更方便地评分与搜索影片。
// @author       SUZEMEF
// @match        *://www.javlibrary.com/*/?v=*
// @match        *://javdb.com/*
// @match        *://javdb5.com/*
// @match        *://*.jav321.com/*
// @match        *://*.javbus.com/*
// @match        *://*.cdnbus.bar/*
// @match        *://*.seedmm.bar/*
// @match        *://*.busdmm.xyz/*
// @match        *://*.onejav.com/*
// @include      /[\w*:\/\/]*[w|\.]*\w\d{2}\w.com\/\w{2}/\?v=\w{2,}/
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/377603/JAV%E5%BF%AB%E6%8D%B7%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/377603/JAV%E5%BF%AB%E6%8D%B7%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

var domains = [
    {name: "JavLibrary",
     url: "http://www.javlibrary.com/cn/vl_searchbyid.php?keyword="
    },
    {name: "JavBus",
     url: "https://www.javbus.com/"
    },
    {name: "Sukubei",
     url: "https://sukebei.nyaa.si/?f=0&c=2_2&q="
    },
	{name: "ThisAV",
     url: "https://www.thisav.com/channel/"
    },
    {name: "JavDB",
     url: "https://javdb.com/search?q="
    },
    {name: "OneJAV",
     url: "https://onejav.com/torrent/"
    }
];

function getID(){
    let javID;
    let loc = window.location.href;
    if (/\w+-\d+/.test(loc) && !/jav321/.test(loc) && !/javlibrary/.test(loc)){
        let arr = loc.match(/\w+-\d+/);
        javID = arr[0];
    }
    else{
        let meta;
        if (/jav321/.test(loc)){
            meta = document.getElementsByTagName('small')[0];
            let arr = meta.textContent.split(" ");
            javID = arr[0];
        }
        else if (/javlibrary/.test(loc)){
            meta = document.getElementsByTagName('meta').keywords.content;
            let arr = meta.split(",");
            javID = arr[0];
        }
        else if (/javdb/.test(loc)){
            meta = window.parent.document.getElementsByTagName("title");
            let arr = meta[0].innerText.split(" ");
            javID = arr[1];
        }
        else if (/onejav/.test(loc)){
            meta = document.getElementsByTagName('meta')[2].content;

            javID = meta;
        }

    }
    return javID;
}

(function(){
    let javID = getID();
    let site = window.location.host;

    function addBtn(iter, element, style) {
        if ($('#jumpto').length == 0) {
            $(element).append('<div id="jumpto'+ style + 'JumpTo: </div>')
        }
        for (let i of iter) {
            let domain = domains[i].name
            let url = ""
            if (domain == 'OneJAV'){
                url = domains[i].url + javID.replace(/-/g,'').toLowerCase()
            }
            else{
                url = domains[i].url + javID.toLowerCase()
            }
            $(element).append('<a href="' + url + style + domain + '<\a>')
        }
    }
    if (/jav321/.test(site)){
        let iter = [0, 1, 2, 3, 4]
        addBtn(iter, '.col-md-9', '" style="display:inline-block; color:#CC0000; margin:0px 5px 0px 0px">')
    }
    else if (site == "www.javlibrary.com" || /[w|\.]*\w\d{2}\w\.com/.test(site)){
        $('#video_info').append('<div id="jumpto" class="item" style="margin-top: 10px"></div>')
        $('#jumpto').append('<div id="td" style="width: 102px; height: 28px;display:inline-block; font-weight:bold; text-align: right">JumpTo:</div>').append('<div id="tr" style="width: 451px; height: 28px;display:inline-block;margin-left:5px"></div>')
        let iter = [1, 2, 3, 4]
        addBtn(iter, '#tr', '" style="padding: 2px 5px 2px 5px;margin: 0px 2px 2px 2px;background: #F3F3F3;-moz-border-radius: 5px;-webkit-border-radius: 5px;-khtml-border-radius: 5px;border-radius: 5px;">')
        $('#tr').append('<form id="form" role="search" action = "https://www.jav321.com/search" method = "POST" style="width:45px; height: 28px; display:inline-block;"></form>')
        $('#form').append('<input id="input" type="text" name="sn" value="' + javID + '"style="display:none"></input>')
        $('#form').append('<button type="submit" style="padding: 2px 5px 2px 5px;margin: 0px 2px 2px 2px;background: #F3F3F3;-moz-border-radius: 5px;-webkit-border-radius: 5px;-khtml-border-radius: 5px;border-radius: 5px; border: none; color:#140AEE;font: 14px Arial">JAV321</button>')
    }
    else if (site == "www.javbus.com" || site == "www.busdmm.bar" || site == "www.busjav.bar" || site == "www.seedmm.bar"){
        let iter = [0,4]
        addBtn(iter, '.col-md-3.info', '" style="display:inline-block; margin-right: 5px; color:#CC0000;">')
    }
    else if (site == "javdb.com" || site == "javdb5.com"){
        let iter = [0,1]
        addBtn(iter, '.panel.movie-panel-info', '" style="display:inline-block; height: 24px; padding: 8px 12px 8px 12px;color:#CC0000;">')
    }
    else if (site == "onejav.com"){
        let iter = [0,4]
        addBtn(iter, '.panel', '" style="display:inline-block; height: 24px; padding: 8px 12px 8px 12px;color:#CC0000;">')
    }
})();