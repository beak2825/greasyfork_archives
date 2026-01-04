// ==UserScript==
// @name         叮当公共库收录情况（测试）
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  在steam网页中浏览游戏页面时，在标题后追加显示其在叮当公共库的收录情况。
// @author       Julius
// @match        https://store.steampowered.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atomicobject.com
// @grant        GM_xmlhttpRequest
// @connect      ruku.ga
// @downloadURL https://update.greasyfork.org/scripts/444797/%E5%8F%AE%E5%BD%93%E5%85%AC%E5%85%B1%E5%BA%93%E6%94%B6%E5%BD%95%E6%83%85%E5%86%B5%EF%BC%88%E6%B5%8B%E8%AF%95%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/444797/%E5%8F%AE%E5%BD%93%E5%85%AC%E5%85%B1%E5%BA%93%E6%94%B6%E5%BD%95%E6%83%85%E5%86%B5%EF%BC%88%E6%B5%8B%E8%AF%95%EF%BC%89.meta.js
// ==/UserScript==

'use strict';
window.addEventListener("load",function(){
    if(window.location=='https://store.steampowered.com/'){
        let tab_newreleases_content = document.querySelector('#tab_newreleases_content');//the box for searching result. each child in it is an <a>.
        let children = tab_newreleases_content.children;
        for(let i=1; i<children.length; i++){
            let child = children[i];
            if(child.href.split('/')[3]=='app'){

                let data = {Id: child.href.split('/')[4]};
                let title = child.children[2].children[0];
                if(!title.getAttribute("dinged")){
                    title.setAttribute("dinged","dinged");
                    GM_xmlhttpRequest ( {
                        method:     "POST",
                        url:        "https://ruku.ga/CheckId",
                        data:       JSON.stringify(data),
                        timeout:    20000,
                        responseType:"json",
                        ontimeout:  function (){
                            console.log ("post request time out");
                        },
                        onload:     function (response) {
                            console.log ("got response");
                            if (response.response.Data.Id == "0"){
                                title.innerHTML = "<span style='color:red;'>（未收录）</span>"+title.innerHTML;
                            }
                            else{
                                title.innerHTML = "<span style='color:green;'>（已收录）</span>"+title.innerHTML;
                            }
                        }
                    } );
                }
            }
        }
    }

    else if(window.location.pathname.split('/')[1]=='app'){
        let data = {Id: window.location.pathname.split('/')[2]};
        let title = document.getElementById("appHubAppName");
        if(!title.getAttribute("dinged")){
            title.setAttribute("dinged","dinged");
            GM_xmlhttpRequest ( {
                method:     "POST",
                url:        "https://ruku.ga/CheckId",
                data:       JSON.stringify(data),
                timeout:    20000,
                responseType:"json",
                ontimeout:  function (){
                    console.log ("post request time out");
                },
                onload:     function (response) {
                    console.log ("got response");
                    if (response.response.Data.Id == "0"){
                        title.innerHTML += " ----- 公共库未收录"
                    }
                    else{
                        title.innerHTML += " <br> 已收录，提交者："+response.response.Data.NickName+"，入库时间："+response.response.Data.Date;
                    }
                }
            } );
        }
    }

    else if(window.location.pathname.split('/')[1]=='search'){
        let tmp_script = document.querySelector('#responsive_page_template_content').children[0].innerHTML;
        let position = tmp_script.search(/"infiniscroll"/);
        let infiniscroll = tmp_script[position+15];//为0时没有无限下滚，为1时有。这个决定了整个页面变化的div如何定位。经过实测，如果无限下滚，则不需要onload的时候触发一次。
        if(infiniscroll==0){
            let searching_result = document.querySelector('#search_resultsRows');//the box for searching result. each child in it is an <a>.
            let children = searching_result.children;
            for(let i=0; i<children.length; i++){
                let child = children[i];
                if(child.href.split('/')[3]=='app'){

                    let data = {Id: child.href.split('/')[4]};
                    let title = child.children[1].children[0].children[0];
                    if(!title.getAttribute("dinged")){
                        title.setAttribute("dinged","dinged");
                        GM_xmlhttpRequest ( {
                            method:     "POST",
                            url:        "https://ruku.ga/CheckId",
                            data:       JSON.stringify(data),
                            timeout:    20000,
                            responseType:"json",
                            ontimeout:  function (){
                                console.log ("post request time out");
                            },
                            onload:     function (response) {
                                console.log ("got response");
                                if (response.response.Data.Id == "0"){
                                    title.innerHTML = "<span style='color:red;'>（未收录）</span>"+title.innerHTML;
                                }
                                else{
                                    title.innerHTML = "<span style='color:green;'>（已收录）</span>"+title.innerHTML;
                                }
                            }
                        } );
                    }
                }
                else if(child.href.split('/')[3]=='bundle'){
                    let title = child.children[1].children[0].children[0];
                    if(!title.getAttribute("dinged")){
                        title.setAttribute("dinged","dinged");
                        title.innerHTML = "<span style='color:orange;'>（合集）</span>" +title.innerHTML;
                    }
                }
            }
        }
    }
})

//mutation检测是否在搜索结果内部分有变化。若有，触发脚本

//主页. xxx0是服务于global_hover_content的，xxx1是服务于类搜索结果的部分的
if(window.location=='https://store.steampowered.com/'){
    let targetNode0 = document.querySelector('body');
    let targetNode1 = document.querySelector('#last_tab');
    let config = {
        subtree: true,
        attributes: true,
        childList: true,
        characterData: true
    };
    let callback0 = mutations => {
        mutations.forEach(mutation => {
            try{
                let global_hover_content = document.getElementById('global_hover_content');
                let children = global_hover_content.children;
                for(let i=0; i<children.length;i++){
                    let child = children[i];
                    let data = {Id: child.id.slice(10)};
                    if(!child.getAttribute("dinged")){
                        child.setAttribute("dinged","dinged");
                        GM_xmlhttpRequest ( {
                            method:     "POST",
                            url:        "https://ruku.ga/CheckId",
                            data:       JSON.stringify(data),
                            timeout:    20000,
                            responseType:"json",
                            ontimeout:  function (){
                                console.log ("post request time out");
                            },
                            onload:     function (response) {
                                console.log ("got response");
                                if (response.response.Data.Id == "0"){
                                    child.children[1].innerHTML = "<span style='color:red;'>（未收录）</span>"+child.children[1].innerHTML;
                                }
                                else{
                                    child.children[1].innerHTML = "<span style='color:green;'>（已收录）</span>"+child.children[1].innerHTML;
                                }
                            }
                        } );
                    }
                }
            }
            catch(e){
                //exception handle;
            }
        })
    }

    let callback1 = mutations => {
        let tags= targetNode1.getAttribute("value");
        let display = document.querySelector('#'+tags);//the box for searching result. each child in it is an <a>.
        let children = display.children;
        for(let i=1; i<children.length; i++){
            let child = children[i];
            if(child.href.split('/')[3]=='app'){
                let data = {Id: child.href.split('/')[4]};
                let title = child.children[2].children[0];
                if(!title.getAttribute("dinged")){
                    title.setAttribute("dinged","dinged");
                    GM_xmlhttpRequest ( {
                        method:     "POST",
                        url:        "https://ruku.ga/CheckId",
                        data:       JSON.stringify(data),
                        timeout:    20000,
                        responseType:"json",
                        ontimeout:  function (){
                            console.log ("post request time out");
                        },
                        onload:     function (response) {
                            console.log ("got response");
                            if (response.response.Data.Id == "0"){
                                title.innerHTML = "<span style='color:red;'>（未收录）</span>"+title.innerHTML;
                            }
                            else{
                                title.innerHTML = "<span style='color:green;'>（已收录）</span>"+title.innerHTML;
                            }
                        }
                    } );
                }
            }
            else if(child.href.split('/')[3]=='bundle'){
                let title = child.children[2].children[0];
                console.log(title);
                if(!title.getAttribute("dinged")){
                    title.setAttribute("dinged","dinged");
                    title.innerHTML = "<span style='color:orange;'>（合集）</span>" +title.innerHTML;
                }
            }
        }
    }

    const observer0 = new MutationObserver(callback0);
    const observer1 = new MutationObserver(callback1);
    observer0.observe(targetNode0, config);
    observer1.observe(targetNode1, config);
}

//搜索页面
else if(window.location.pathname.split('/')[1]=='search'){
    let targetNode = document.querySelector('#search_results');
    let config = {
        subtree: true,
        attributes: true,
        childList: true,
        characterData: true
    };

    let callback = mutations => {
        mutations.forEach(mutation => {
            let searching_result = document.querySelector('#search_resultsRows');//the box for searching result. each child in it is an <a>.
            let children = searching_result.children;
            for(let i=0; i<children.length; i++){
                let child = children[i];
                if(child.href.split('/')[3]=='app'){

                    let data = {Id: child.href.split('/')[4]};
                    let title = child.children[1].children[0].children[0];
                    if(!title.getAttribute("dinged")){
                        title.setAttribute("dinged","dinged");
                        GM_xmlhttpRequest ( {
                            method:     "POST",
                            url:        "https://ruku.ga/CheckId",
                            data:       JSON.stringify(data),
                            timeout:    20000,
                            responseType:"json",
                            ontimeout:  function (){
                                console.log ("post request time out");
                            },
                            onload:     function (response) {
                                console.log ("got response");
                                if (response.response.Data.Id == "0"){
                                    title.innerHTML = "<span style='color:red;'>（未收录）</span>"+title.innerHTML;
                                }
                                else{
                                    title.innerHTML = "<span style='color:green;'>（已收录）</span>"+title.innerHTML;
                                }
                            }
                        } );
                    }
                }
                else if(child.href.split('/')[3]=='bundle'){
                    let title = child.children[1].children[0].children[0];
                    if(!title.getAttribute("dinged")){
                        title.setAttribute("dinged","dinged");
                        title.innerHTML = "<span style='color:orange;'>（合集）</span>" +title.innerHTML;
                    }
                }
            }
        });
    }

    const observer = new MutationObserver(callback);

    observer.observe(targetNode, config);
}