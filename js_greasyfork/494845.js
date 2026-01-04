// ==UserScript==
// @name         动漫花园优化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  动漫花园网站相关优化
// @author       JMRY
// @match        https://share.dmhy.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dmhy.org
// @grant        none
// @require      https://update.greasyfork.org/scripts/422934/1343270/JQuery%20DOM.js
// @downloadURL https://update.greasyfork.org/scripts/494845/%E5%8A%A8%E6%BC%AB%E8%8A%B1%E5%9B%AD%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/494845/%E5%8A%A8%E6%BC%AB%E8%8A%B1%E5%9B%AD%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

/*
1.0
- 实现基本功能。
*/

String.prototype.replaceAll = function(org,tgt){
    return this.split(org).join(tgt);
}
String.prototype.insert = function(start, newStr) {
    return this.slice(0, start) + newStr + this.slice(start);
};

function urlMatch(str){
    let url=window.location.href;
    return url.includes(str);
}

async function ajaxPromise(url,type=`GET`,data){
    return new Promise((resolve, reject)=>{
        $.ajax({
            url:url,
            type:type,
            data:data,
            success:function(r){
                resolve(r);
            },
            error:function(e){
                reject(e);
            }
        });
    });
}

function copyContent(content){
    console.log(content);
    let input=document.createElement(`input`);
    input.value=content;
    document.body.appendChild(input);
    input.select();
    document.execCommand(`copy`,true);
    document.body.removeChild(input);
}

async function getMagnetPage(url){
    try{
        let phtml=await ajaxPromise(url);
        let pEl=$(phtml);
        return pEl.find(`#magnet2`).attr(`href`);
    }catch(e){
        console.error(e);
        return ``;
    }
}
const defaultStorageData={
    magnetList:[],
}
let storageData={};
function loadStorage(){
    storageData=JSON.parse(localStorage.getItem(`storageData`));
    if(!storageData){
        storageData={
            ...defaultStorageData,
        };
        saveStorage();
    }
}
function saveStorage(){
    localStorage.setItem(`storageData`,JSON.stringify(storageData));
}

function magnetExist(name,url){
    for(let i=0; i<storageData.magnetList.length; i++){
        if(storageData.magnetList[i].name==name && storageData.magnetList[i].url==url){
            return true;
        }
    }
    return false;
}

function addMagnet(name,url){
    if(!magnetExist(name,url)){
        storageData.magnetList.push({name:name, url:url});
    }
    saveStorage();
}

function getMagnet(name){
    if(typeof name==`number`){
        return storageData.magnetList[name];
    }else{
        for(let i=0; i<storageData.magnetList.length; i++){
            if(storageData.magnetList[i].name==name){
                return storageData.magnetList[i];
            }
        }
        return null;
    }
}

function removeMagnet(name){
    if(typeof name==`number`){
        storageData.magnetList.splice(name, 1);
    }else{
        for(let i=0; i<storageData.magnetList.length; i++){
            if(storageData.magnetList[i].name==name){
                storageData.magnetList.splice(i, 1);
            }
        }
    }
    saveStorage();
}

function clearMagnet(){
    storageData.magnetList=[];
    saveStorage();
}

function insertCSS(){
    $(`head`).appendDOM(`style`,{html:`
    .previewWindow{
        position:fixed;
        top:20%;
        right:8px;
        bottom:20%;
        width:40%;
        background:#FFF;
        border-radius:5px;
        overflow:hidden;
        box-shadow:0px 0px 10px #000;
    }
    .previewClose{
        position:absolute;
        top:0px;
        right:0px;
        width:32px;
        height:32px;
        margin:0px;
    }
    .previewFrame{
        width:100%;
        height:calc(100% - 32px);
        border:none;
    }
    .previewToolBar{
        height:32px;
        width:100%;
    }
    .previewToolBar button{
        height:32px;
    }
    .previewToolBar span{
        line-height:32px;
        vertical-align:middle;
    }
    .success{
        color:#008000;
    }
    .storageForm{
        position:fixed;
        top:0px;
        left:0px;
        right:0px;
        bottom:0px;
        background:rgba(0,0,0,0.25);
        z-index:1000;
    }
    .storageWindow{
        position:absolute;
        top:20%;
        left:20%;
        right:20%;
        bottom:20%;
        background:#FFF;
        border-radius:5px;
        box-shadow:0px 0px 10px #000;
        overflow:hidden;
    }
    .storageTab{
        position:absolute;
        top:0px;
        left:0px;
        width:100%;
        height:32px;
        background:#CDF;
    }
    .storageTabBu{
        height:32px;
        margin:0px;
    }
    .formButton.selected{
        background:#247;
        color:#FFF;
    }
    .storagePage{
        position:absolute;
        top:32px;
        left:0px;
        right:0px;
        bottom:0px;
        overflow:auto;
    }
    .storageTable td.name, .storageTable td.url{
        /*text-align:left !important;*/
    }
    .storageTable td.header{
        color:#FFF;
    }
    td.option{
        width:128px;
        min-width:128px;
    }
    .storageTextarea{
        padding:8px;
        width:calc(100% - 8px * 2);
        height:calc(100% - 8px * 2);
        border:none;
        resize:none;
    }
    `});
}

function insertQuickLink(){
    if(!urlMatch(`topics`)){
        let animLinkEl=$(`.tablesorter`).find(`tr`).find(`.title`).children(`a`);
        for(let i=0; i<animLinkEl.length; i++){
            let curEl=animLinkEl.eq(i);
            let curName=curEl.html().trim();
            let curHref=curEl.attr(`href`);
            curEl.afterDOM([
                {tag:`button`,class:``,html:`预览`,title:`显示预览窗口`,bind:{click(){showPreview(curHref);$(this).addClass(`success`);return false;}}},
                {tag:`button`,class:`copyLink`,html:`复制`,title:`复制磁力链接`,bind:{click(){
                    $(`.copyLink`).attr(`disabled`,`disabled`);
                    getMagnetPage(curHref).then(h=>{
                        copyContent(h);
                        $(`.copyLink`).removeAttr(`disabled`);
                    });
                    return false;
                }}},
                {tag:`button`,class:`copyLink`,html:`添加`,title:`添加到存储`,bind:{click:{data:{name:curName},function(e){
                    $(`.copyLink`).attr(`disabled`,`disabled`);
                    getMagnetPage(curHref).then(h=>{
                        addMagnet(e.data.name,h);
                        $(`.copyLink`).removeAttr(`disabled`);
                    });
                    return false;
                }}}},
            ]);
        }
        $(`div.fr`).prependDOM([
            {tag:`span`,html:` | `},
            {tag:`a`,html:`显示存储`,bind:{click(){showStorage()}}},
        ]);
    }
}

function insertTopic(){
    if(urlMatch(`topics`)){
        let url=$(`#magnet2`).attr(`href`);
        let name=$(`h3`).html();
        $(`#magnet2`).afterDOM([
            {tag:`button`,class:`formButton copyLink`,html:`复制名称`,bind:{click(){
                copyContent(name);
                $(this).addClass(`success`);
            }}},
            {tag:`button`,class:`formButton copyLink`,html:`复制磁力`,bind:{click(){
                copyContent(url);
                $(this).addClass(`success`);
            }}},
            {tag:`button`,class:`formButton addMagnet`,html:`添加到存储`,bind:{click(){
                addMagnet(name,url);
            }}}
        ]);

        $(`.ui-tabs-nav.ui-helper-reset.ui-helper-clearfix.ui-widget-header.ui-corner-all`).appendDOM(`li`,{class:`ui-state-default ui-corner-top ui-tabs-selected ui-state-active`,html:`<a>显示存储</a>`,bind:{click(){showStorage();$(this).addClass(`success`)}}});
    }
}

function showPreview(url){
    console.log(url);
    $(`body`).appendDOM({tag:`div`,class:`previewWindow`,children:[
        {tag:`button`,class:`formButton previewClose`,html:`×`,bind:{click(){closePreview()}}},
        {tag:`div`,class:`previewToolBar`,children:[
            {tag:`button`,class:`formButton copyLink`,html:`复制磁力链接`,bind:{click(){
                copyContent($(`#magnetLink`).html());
                $(this).addClass(`success`);
            }}},
            {tag:`span`,id:`magnetLink`,class:`magnetLink`},
        ]},
        {tag:`iframe`,id:`previewFrame`,class:`previewFrame`,src:url},
    ]});
    getMagnetPage(url).then(u=>{
        $(`#magnetLink`).html(u);
    });
}

function closePreview(){
    $(`.previewWindow`).remove();
}

function showStorage(){
    console.log(storageData);
    $(`body`).appendDOM({tag:`div`,class:`storageForm`,children:[
        {tag:`div`,class:`storageWindow`,children:[
            {tag:`div`,class:`storageTab`,children:[
                {tag:`button`,id:`storageTabBu_1`,class:`formButton storageTabBu`,html:`预览`,bind:{click(){changeStorageTab(1)}}},
                {tag:`button`,id:`storageTabBu_2`,class:`formButton storageTabBu`,html:`磁力`,bind:{click(){changeStorageTab(2)}}},
                {tag:`span`,html:`&nbsp;&nbsp;`},
                {tag:`button`,id:`storageTabBu_3`,class:`formButton storageTabBu`,html:`清空`,bind:{click(){if(confirm(`是否清空所有链接？`)){clearMagnet();applyMagnetTable();}}}},
            ]},
            {tag:`button`,class:`formButton previewClose`,html:`×`,bind:{click(){closeStorage()}}},
            {tag:`div`,id:`storagePage_1`,class:`storagePage`,children:[
                {tag:`table`,id:`storageTable`,class:`storageTable tablesorter`,cellpadding:0,cellspacing:1,border:0,frame:`void`}
            ]},
            {tag:`div`,id:`storagePage_2`,class:`storagePage`,children:[
                {tag:`textarea`,id:`storageTextarea`,class:`storageTextarea`,readonly:true},
            ]},
        ]}
    ]});

    function changeStorageTab(i){
        $(`.storageTabBu`).removeClass(`selected`);
        $(`.storagePage`).css(`display`,`none`);
        $(`#storageTabBu_${i}`).addClass(`selected`);
        $(`#storagePage_${i}`).css(`display`,``);
    }
    changeStorageTab(1);

    function applyMagnetTable(){
        let tableTr=[
            `<tr class="header"><td class="header name">名称</td><td class="header url">磁力链接</td><td class="header option">操作</td></tr>`,
        ];
        let textList=[];
        for(let i=0; i<storageData.magnetList.length; i++){
            let cur=storageData.magnetList[i];
            let tdstyle=i%2==0?`even`:`odd`;
            tableTr.push(`<tr class="content ${tdstyle}"><td class="name">${cur.name}</td><td class="url"><a href="${cur.url}">${cur.url}</a></td><td><button class="copyBu" index="${i}">复制</button><button class="removeBu" index="${i}">删除</button></td></tr>`);
            textList.push(cur.url);
        }
        $(`#storageTable`).html(tableTr.join(``));
        $(`#storageTextarea`).val(textList.join(`\n`));

        $(`.copyBu`).bind(`click`,function(){
            let url=getMagnet(parseInt($(this).attr(`index`))).url;
            copyContent(url);
            $(this).addClass(`success`);
        });
        $(`.removeBu`).bind(`click`,function(){
            removeMagnet(parseInt($(this).attr(`index`)));
            applyMagnetTable();
        });
    }
    applyMagnetTable();
}

function closeStorage(){
    $(`.storageForm`).remove();
}

(function() {
    'use strict';
    loadStorage();
    insertCSS();
    insertQuickLink();
    insertTopic();
})();