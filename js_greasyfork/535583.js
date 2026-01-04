// ==UserScript==
// @name         百度网盘体验优化
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  百度网盘体验优化，支持密码链接自动跳转、一键转存、批量重命名功能。
// @author       JMRY
// @match        https://pan.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535583/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/535583/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

/*
1.2.2 20250705
- 去除一键转存功能（官方已支持）。

1.2.1 20250511
- 修复自动重命名超过32个时报错的bug（现在支持500个）。

1.2 20250511
- 加入自动重命名功能。

1.1 20250416
- 优化一键保存的判断逻辑。
- 修复一键保存时会打开压缩包预览的bug。

1.0 20250324
- 加入分享页带密码时自动跳转功能。
- 加入转存后“去查看”直接跳转功能。
*/

String.prototype.replaceAll=function(org,tgt){
    return this.split(org).join(tgt);
}
String.prototype.insert = function(start, newStr) {
    return this.slice(0, start) + newStr + this.slice(start);
};

const params = new URLSearchParams(window.location.href);

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

let elExistInv, elExistCount;
function elWait(jqel, timeout=0){
    return new Promise((resolve, reject)=>{
        elExistCount=0;
        clearInterval(elExistInv);
        elExistInv=setInterval(()=>{
            if($(jqel).length>0){
                resolve();
            }else{
                elExistCount++;
                if(timeout>0 && elExistCount>timeout){
                    reject();
                }
            }
        },100);
    });
}

let waitTimeout;
function wait(n){
    return new Promise(resolve=>{
        clearTimeout(waitTimeout);
        setTimeout(()=>{
            resolve();
        },n);
    });
}

// 自定义样式
function applyCustomStyle(){
    let style=`
    .autoRenameForm{
        position:fixed;
        top:0px;
        left:0px;
        right:0px;
        bottom:0px;
        background:rgba(0,0,0,0.75);
        z-index:10000;
    }
    .autoRenameDiv{
        position:absolute;
        top:0px;
        left:0px;
        right:0px;
        bottom:0px;
        width:75%;
        height:75%;
        margin:auto;
        background:#FFF;
        border-radius:10px;
        z-index:10001;
        overflow:hidden;
    }
    .closeBu{
        position:absolute;
        top:0px;
        right:0px;
        width:32px;
        height:32px;
        font-size:24px;
        line-height:0px;
        background:rgba(240,96,96,1);
        color:#FFF;
        padding:0px;
        border-bottom-left-radius:10px;
        transition:all 0.25s ease;
    }
    .closeBu:hover{
        background:rgba(240,128,128,1);
    }
    .inputZone, .previewZone, .ruleZone, .controlZone{
        position:absolute;
        top:0px;
        left:0px;
        bottom:48px;
        width:50%;
        padding:16px;
    }
    .previewZone{
        right:0px;
        left:auto;
    }

    .ruleZone, .controlZone{
        top:auto;
        left:0px;
        bottom:0px;
        height:64px;
    }
    .controlZone{
        left:auto;
        right:0px;
    }

    .renameInput, .previewInput{
        display:block;
        width:100%;
        border:1px solid rgba(6,167,255,.23);
        border-radius:5px;
        padding:8px;
        margin-top:8px;
        height:calc(100% - 16px - 8px);
        resize:none;
        white-space: pre;
        transition:all ease 0.25s;
    }
    .renameInput:disabled, .previewInput:disabled{
        border-color:#CCC;
    }

    .ruleBu, .runBu{
        height:32px;
        min-width:48px;
        padding:8px;
        padding-left:16px;
        padding-right:16px;
        line-height:0px;
        border-radius:32px;
        background:#f0faff;
        color:#06a7ff;
        transition:all ease 0.25s;
    }
    .ruleBu:hover, .runBu:hover{
        background:e6f6ff;
    }
    .ruleBu:active, .runBu:active{
        background:e6f6ff;
        color:#0596e6;
    }

    .ruleBu.selected, .runBu.main{
        background:#06a7ff;
        color:#FFF;
    }
    .ruleBu.selected:hover, .runBu.main:hover{
        background:#38b9ff;
    }
    .ruleBu.selected:active, .runBu.main:active{
        background:#0596e6;
    }
    .ruleBu:disabled, .runBu:disabled{
        background:#CCC;
        color:#999;
    }
    .ruleBu.selected:disabled, .runBu.main:disabled{
        background:#999;
        color:#FFF;
    }
    `;
    $(`head`).append(`<style id="customStyle">${style}</style>`);
}

// 分享页带密码时自动跳转
function applyShareJump(){
    if(urlMatch(`share/init`)){
        let parms=window.location.search;
        let inv;
        if(parms.includes(`pwd=`)){
            let submitBtn=$(`#submitBtn`);
            inv=setInterval(()=>{
                console.log(`Checked pwd! Auto jump enabled!`);
                if(!submitBtn.hasClass(`g-disabled`)){
                    submitBtn.click();
                }
            },100);
        }
    }
}

// 转存后去查看直接跳转页面
function applyGotoFolder(){
    if(urlMatch(`/s/`)){
        let gotoBu=$(`.fx-info-section-more`);
        let targetPath=gotoBu.attr(`target-path`);
        let folder=`/disk/main?from=homeSave#/index?fromSource=share&category=all&path=${targetPath}`;
        gotoBu.unbind(`click`);
        gotoBu.bind(`click`,function(){
            window.location.href=folder;
        });
    }
}

function oneKeySave(){
    if(urlMatch(`/s/`)){
        let saveBu=$(`a.g-button.tools-share-save-hb.tools-share-V20-btn.save_btn`).eq(0);
        saveBu.after(`<a class="g-button tools-share-save-hb1 tools-share-V20-btn save_btn onekey_save_btn" data-button-id="b5" data-button-index="8" href="javascript:;" title="一键保存" node-type="shareSave"><span class="g-button-right"><em class="icon noicon-zhuancun_bai" title="一键保存"></em><span class="text" style="width: auto;">一键保存</span></span></a>`);
        $(`.onekey_save_btn`).bind(`click`,async function(){
            saveBu.click();
            try{
                await elWait(`.save-path-item`,50);
                if($(`.save-path-item`).length<1){
                    return;
                }
                $(`.save-path-item`).eq(0).click();
                await wait(250);
                $(`.g-button.g-button-blue-large[title=确定]`).eq(0).click();
            }catch(e){
                console.error(e);
            }
        });
    }
}

function getReplaceNames(rule, files, text, isObj){
    let nameList=text.trim().split(`\n`);
    let replaceList=[];
    let replaceListObj=[];
    for(let i=0; i<nameList.length; i++){
        let cur=nameList[i];
        let file=files[i];
        let id=file.fs_id;
        let originName=file.server_filename;
        switch(rule){
            case `add`: default:{
                let originNameSplit=originName.split(`.`);
                originNameSplit[0]+=` ${cur}`;
                replaceList.push(originNameSplit.join(`.`));
                replaceListObj.push({id:id, origin:originName, name:originNameSplit.join(`.`)});
            }
            break;
            case `replace`:{
                let originNameSplit=originName.split(`.`);
                originNameSplit[0]=`${cur}`;
                replaceList.push(originNameSplit.join(`.`));
                replaceListObj.push({id:id, origin:originName, name:originNameSplit.join(`.`)});
            }
            break;
        }
    }
    $(`#renameCount`).html(nameList.length);
    $(`#previewCount`).html(replaceList.length);
    if(isObj){
        return replaceListObj;
    }
    return replaceList;
}

async function applyRename(url, path, list){
    $(`#runBu`).attr(`disabled`,true);
    let filelist=[];
    for(let l of list){
        filelist.push({id:l.id, path:`${path}/${l.origin}`, newname:l.name});
    }
    filelist.reverse(); // 为了确保时间顺序正确，因此将其反向
    console.log(url);
    console.log(filelist);
    let rs=await ajaxPromise(url, `POST`, {filelist:JSON.stringify(filelist)});
    console.log(rs);
    if(rs.errno==0){
        alert(`${filelist.length}个文件重命名成功！`);
        window.location.reload();
    }else{
        alert(`${filelist.length}个文件重命名失败！错误${rs.errno}！`);
    }
}

async function autoRename(){
    if(urlMatch(`/disk/main`)){
        await elWait(`.wp-s-agile-tool-bar__h-group`);
        $(`.wp-s-agile-tool-bar__h-group`).eq(1).before(`<div class="wp-s-agile-tool-bar__h-group u-button-group wp-s-agile-tool-bar__h-button-group is-main" style="margin-right:16px;"><button id="onekey_rename" class="u-button nd-file-list-toolbar-action-item u-button--primary u-button--small is-round is-has-icon">批量重命名</button></div>`);
        $(`#onekey_rename`).bind(`click`,async function(){
            let vue=document.querySelector(".nd-main-list, .nd-new-main-list").__vue__;
            let yunData=vue.yunData;
            let bdstoken=yunData.bdstoken;
            let app_id=250528;
            let path=decodeURIComponent(params.get(`path`));
            let url=`/api/filemanager?async=2&onnest=fail&opera=rename&bdstoken=${bdstoken}&clienttype=0&app_id=${app_id}&web=1&dp-logid=34624700584065350084`;
            let rule=`add`;
            $(`body`).append(`
            <div class="autoRenameForm">
                <div class="autoRenameDiv">
                    <div class="inputZone">批量重命名 (<span id="renameCount">0</span>)<textarea id="rename" class="renameInput"></textarea></div>
                    <div class="previewZone">重命名预览 (<span id="previewCount">0</span>)<textarea id="preview" class="previewInput" readonly></textarea></div>
                    <div class="ruleZone">
                        <button class="ruleBu selected" rule="add">添加</button>
                        <button class="ruleBu" rule="replace">替换</button>
                    </div>
                    <div class="controlZone">
                        <button id="reverseBu" class="runBu">翻转顺序</button>
                        <button id="runBu" class="runBu main">开始重命名</button>
                    </div>
                    <button id="closeBu" class="closeBu">×</button>
                </div>
            </div>
            `);

            $(`.autoRenameDiv button, .renameInput`).attr(`disabled`,true);
            let listUrl=`/api/list?clienttype=0&app_id=${app_id}&web=1&dp-logid=17222300759885380084&order=time&desc=1&dir=${path}&num=500&page=1`;
            let filesData=await ajaxPromise(listUrl);
            let files=filesData.list;
            console.log(url, path, files);
            $(`.autoRenameDiv button, .renameInput`).removeAttr(`disabled`);

            $(`#closeBu`).bind(`click`,()=>{
                $(`.autoRenameForm, .autoRenameDiv`).remove();
            });
            $(`.ruleBu`).bind(`click`,function(){
                $(`.ruleBu`).removeClass(`selected`);
                $(this).addClass(`selected`);
                rule=$(this).attr(`rule`);
                $(`#rename`).trigger(`input`);
            });

            $(`#rename`).bind(`input`,function(){
                $(`#preview`).val(getReplaceNames(rule, files, $(`#rename`).val()).join(`\n`));
            });

            $(`#reverseBu`).bind(`click`,function(){
                let nameList=$(`#rename`).val().split(`\n`);
                nameList.reverse();
                $(`#rename`).val(nameList.join(`\n`));
                $(`#rename`).trigger(`input`);
            });

            $(`#runBu`).bind(`click`,function(){
                if(confirm(`是否开始重命名？共${$(`#previewCount`).html()}个文件，请检查顺序和规则是否正确！`)){
                    let nameList=getReplaceNames(rule, files, $(`#rename`).val(), true);
                    applyRename(url, path, nameList);
                }
            });
        });
        /*
        获取基础信息：
        document.querySelector(".nd-main-list, .nd-new-main-list").__vue__.yunData
        window.locals
        获取文件ID：
        当前文件tr的data-id属性：data-id="651439473653843"
        获取文件名：a的title属性
        POST格式：
        filelist: [{"id":130403586100625,"path":"/我的资源/新资源.Bondage.皇冠/【待下载】/YSSA471.mp4.TAR.7z","newname":"YSSA471 一绳所爱 小0 挣扎的束缚女王 中编 www.osm7.com.mp4.TAR.7z"}]
        */
    }
}

let observer;
// 监控页面元素变化
function watchDomChange(){
    const config = {
        childList: true, // 监听子节点的增删
        attributes: true, // 监听属性变化
        subtree: true, // 监听整个子树
        characterData: true // 监听节点内容或文本的变化
    };
    observer = new MutationObserver((mutationsList, observer) => {
        console.log(`Watched dom changed.`);
        applyGotoFolder();
    });
    const targetNode = document.querySelector(`body`);
    observer.observe(targetNode, config);
}

(function() {
    applyCustomStyle();
    applyShareJump();
    applyGotoFolder();
    //oneKeySave();
    autoRename();
    watchDomChange();
})();