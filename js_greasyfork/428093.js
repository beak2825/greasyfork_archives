// ==UserScript==
// @name         JAV快捷跳转
// @namespace    video_search_through_javlibrary
// @version      0.32
// @description  为部分JAV站点添加跳转功能，更方便地评分与搜索影片。
// @author       SUZEMEF
// @match        *://*.jav321.com/*
// @match        *://www.javbus.com/*
// @match        *://*.seedmm.cam/*
// @match        *://*.javbus.cam/*
// @match        *://*.busjav.cam/*
// @match        *://www.javlibrary.com/*/?v=*
// @match        *://javdb.com/*
// @match        *://javdb5.com/*
// @match        *://onejav.com/*
// @include      /[\w*:\/\/]*[w|\.]*\w\d{2}\w.com\/\w{2}/\?v=\w{2,}/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428093/JAV%E5%BF%AB%E6%8D%B7%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/428093/JAV%E5%BF%AB%E6%8D%B7%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

var sites = [
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

function createBtn(site = "", javID = "") {
    let btn = document.createElement('a');
  btn.target = "_blank"
    let text = site.name;
    btn.appendChild(document.createTextNode(text));
    if (text == 'OneJAV'){
        btn.href = site.url + javID.replace(/-/g,'').toLowerCase();
    }
    else{
        btn.href = site.url + javID.toLowerCase();
    }
    return btn;
}

function creatFormRequest(javID) {
    let form = document.createElement("form");
    form.role = "search";
    form.action = "https://www.jav321.com/search";
    form.method = "POST";
    let input = document.createElement("input");
    input.type = "text";
    input.name = "sn";
    input.value = javID;
    input.style = 'display:none';
    let btn = document.createElement("button");
    btn.type = "submit"
    btn.appendChild(document.createTextNode("JAV321"));
    btn.style = 'padding: 2px 5px 2px 5px;margin: 0px 2px 2px 2px;background: #F3F3F3;-moz-border-radius: 5px;-webkit-border-radius: 5px;-khtml-border-radius: 5px;border-radius: 5px; border: none; color:#140AEE;font: 14px Arial';
    form.appendChild(input);
    form.appendChild(btn);
    return form;
 }

(function(){
    let javID = getID();
    let site = window.location.host;
    if (/jav321/.test(site)){
        let i = 0;
        while (i < sites.length){
            let btn = createBtn(sites[i], javID);
            btn.style = 'color:#CC0000; margin-right: 5px';
            let tar = document.getElementsByClassName("col-md-9")[0];
            tar.appendChild(btn);
            i++;
        }
    }
    else if (site == "www.javlibrary.com" || /[w|\.]*\w\d{2}\w\.com/.test(site)){
        let div = document.createElement("div");
        div.setAttribute("class", "item");
        div.id = "jump";
        div.style = 'margin-top: 10px';
        document.getElementById("video_info").appendChild(div);
        let td = document.createElement("div");
        td.id = "td";
        td.style = 'width: 102px; height: 28px;display:inline-block; font-weight:bold; text-align: right';
        document.getElementById("jump").appendChild(td);
        let tr = document.createElement("div");
        tr.id = "tr";
        tr.style = 'width: 228px; height: 28px;display:inline-block;margin-left:5px';
        document.getElementById("jump").appendChild(tr);

        let i = 1;
        while (i < sites.length){

            let btn = createBtn(sites[i], javID);
            btn.style = 'padding: 2px 5px 2px 5px;margin: 0px 2px 2px 2px;background: #F3F3F3;-moz-border-radius: 5px;-webkit-border-radius: 5px;-khtml-border-radius: 5px;border-radius: 5px;';
            document.getElementById("tr").appendChild(btn);
            i++;
        }
        var head = document.getElementById("td");
        head.innerHTML="JumpTo:";

        let btn = creatFormRequest(javID);
        let div2 = document.createElement("div");
        div2.setAttribute("class", "item");
        div2.id = "jump2";
        div2.style = ' height: 28px;';
        document.getElementById("video_info").appendChild(div2);
        let td2 = document.createElement("div");
        td2.id = "td2";
        td2.style = 'width: 102px; height: 28px;display:inline-block;vertical-align:top';
        document.getElementById("jump2").appendChild(td2);
        let tr2 = document.createElement("div");
        tr2.id = "tr2";
        tr2.style = 'width: 282px; height: 28px;display:inline-block;margin-left:5px;vertical-align:top';
        document.getElementById("jump2").appendChild(tr2);
        document.getElementById("tr2").appendChild(btn);
    }
    else if (site == "www.javbus.com" || site == "www.seedmm.cam" || site == "www.javbus.cam" || site == "www.busjav.cam"){
        let tar = document.getElementsByClassName("col-md-3 info")[0];

        let btn = createBtn(sites[0], javID);
        btn.style = 'color:#CC0000;'
        tar.appendChild(btn);

        let btn1 = createBtn(sites[4], javID);
        btn1.style = 'margin: 0px 2px 2px;color:#CC0000;'
        tar.appendChild(btn1);

    }
    else if (site == "javdb.com" || site == "javdb5.com"){
        let tar = document.getElementsByClassName("panel movie-panel-info")[0];

        let btn = createBtn(sites[0], javID);
        btn.style = 'margin-left:15px;color:#CC0000;'
        tar.appendChild(btn);

        let btn1 = createBtn(sites[1], javID);
        btn1.style = 'margin: 0px 2px 2px;color:#CC0000;'
        tar.appendChild(btn1);
    }
   else if (site == "onejav.com"){
        let tar = document.getElementsByClassName("field is-grouped")[1];

        let btn = createBtn(sites[0], javID);
        btn.style = 'margin-left:15px;color:#CC0000;'
        tar.appendChild(btn);
        let btn1 = createBtn(sites[4], javID);
        btn1.style = 'margin: 0px 2px 2px;color:#CC0000;'
        tar.appendChild(btn1);
   }
})();