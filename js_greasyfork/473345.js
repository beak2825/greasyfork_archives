// ==UserScript==
// @name         天翼云盘批量转存
// @namespace    蒋晓楠
// @version      20230818
// @description  只支持纯文件,转存的时候切换页面会导致列表加载不全
// @author       蒋晓楠
// @license MIT
// @match        https://cloud.189.cn/web/share?code=*
// @icon         https://www.google.com/s2/favicons?domain=189.cn
// @grant GM_addStyle
// @grant GM_addElement
// @downloadURL https://update.greasyfork.org/scripts/473345/%E5%A4%A9%E7%BF%BC%E4%BA%91%E7%9B%98%E6%89%B9%E9%87%8F%E8%BD%AC%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/473345/%E5%A4%A9%E7%BF%BC%E4%BA%91%E7%9B%98%E6%89%B9%E9%87%8F%E8%BD%AC%E5%AD%98.meta.js
// ==/UserScript==
//动作间隔,单位毫秒,根据自己的网速和电脑性能调节
let ActionInterval=1000;
//一次保存数量,普通用户最多1000,设太大容易卡住
let SaveNumber=100;
//保存文件夹名
let SaveDirectoryName="天翼云盘批量转存";
//加载数量倍率,当剩余文件数量小于保存数量乘这个倍率时才进行再次加载
let LoadNumberRate=1.5;
//以下变量不要修改
//文件列表,它自己的分页都有问题,出现重复文件,会导致保存失败
let NowFileList=[];
//加载是否完成
let LoadFinish=false;
function ScrollFileList() {
    let FileHolder=document.querySelector(".file-list-ul");
    let LastName="";
    //根据列表数量延长加载时间
    let Interval=setInterval(function () {
        if (document.querySelector(".file-list-load")===null){
            let NowLength=FileHolder.querySelectorAll("li").length;
            if (NowLength<SaveNumber*LoadNumberRate){
                console.log("当前加载完成,数量"+NowLength);
                let CheckLastName=FileHolder.querySelector(".selDiv").previousSibling.querySelector(".file-item-name-fileName-span").textContent.trim();
                if(CheckLastName===LastName){
                    console.log("全部加载完成");
                    LoadFinish=true;
                    clearInterval(Interval);
                }
                else{
                    LastName=CheckLastName;
                    FileHolder.scrollTo(0,FileHolder.scrollHeight);
                }
            }
            else{
                console.log("当前剩余文件数量过多");
            }
        }
        else {
            console.log("正在加载");
        }
    },ActionInterval);
}

function RemoveRepeatItem() {
    document.querySelectorAll(".file-list-ul>li").forEach(function (Item) {
        if (NowFileList.indexOf(Item.querySelector(".file-item-name-fileName-span").textContent.trim())>-1){
            Item.remove();
        }
    });
}

function SelectListFile() {
    let Items=document.querySelectorAll(".file-list-ul>li");
    for (let i = 0; i <Items.length; i++) {
        if (i<SaveNumber){
            let Name=Items[i].querySelector(".file-item-name-fileName-span").textContent.trim();
            NowFileList.push(Name);
            Items[i].querySelector(".file-item-check").click();
        }
        else
        {
            break;
        }
    }
    console.log("完成文件选择",NowFileList);
}

async function ClickNewSaveButton() {
    return new Promise(resolve => {
        let Interval=setInterval(function () {
            //点击转存
            let SaveButton = document.querySelector("[class^=FileListHead_file-list-li-head-select]").nextSibling.firstChild;
            if(SaveButton!==null){
                clearInterval(Interval);
                SaveButton.click();
                return resolve();
            }
        },0);
    });
}

async function SelectSaveDirectory() {
    return new Promise(resolve => {
        let Check=setInterval(function () {
            let AllDirectory=document.querySelectorAll("[class^=DirectoryTree_directory-li] [class^=DirectoryTree_c-directory-tree]>div");
            for (let i = 0; i < AllDirectory.length; i++) {
                let Name=AllDirectory[i].querySelector(".directory-name").textContent;
                if (Name===SaveDirectoryName){
                    clearInterval(Check)
                    AllDirectory[i].childNodes[0].childNodes[1].dispatchEvent(new MouseEvent("mousedown"));
                    break;
                }
            }
            return resolve();
        },ActionInterval);
    });
}

function ClickYesButton() {
    let YesButton=document.querySelector("[class^=Directory_directory-button-confirm]");
    YesButton.click();
}

async function SaveIsDone() {
    let LoadingBlock=document.querySelector("[class^=loading_c-loading]");
    return new Promise(resolve => {
        let Loading=setInterval(function () {
            if (LoadingBlock.style.display==="none"){
                clearInterval(Loading);
                return resolve();
            }
        },ActionInterval);
    });
}

function RemoveSelectItem() {
    let List=document.querySelectorAll(".file-list-ul .selected");
    for (let i = 0; i < List.length; i++) {
        List[i].querySelector("input").click();
        List[i].remove();
    }
}

async function StartSave() {
    console.log("开始保存");
    //删除重复项目
    RemoveRepeatItem();
    //选择列表文件
    SelectListFile();
    //点击转存
    await ClickNewSaveButton();
    //选择保存文件夹
    await SelectSaveDirectory()
    //点击确定
    ClickYesButton();
    //等待转存完成
    await SaveIsDone();
    //移除选择项
    RemoveSelectItem();
    console.log("当前保存完成");
    if (LoadFinish&&document.querySelectorAll(".file-list-ul>li").length===0){
        alert("全部保存完成");
    }
    else{
        StartSave();
    }
}

function InitHtml() {
    let Holder=document.querySelector(".file-operate");
    let SaveAllButton=GM_addElement(Holder,"button",{textContent:"全部保存",class:"JXNButton"});
    //绑定事件
    SaveAllButton.onclick=function () {
        //隐藏保存按钮
        SaveAllButton.style.display="none";
        ScrollFileList();
        StartSave();
    }
}

function InitCss() {
    GM_addStyle(`.JXNButton {
    position: absolute;
    left: 0;
    padding: 5px 10px;
    background-color: dodgerblue;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 5px;
}`);
}

async function WaitUI() {
    return new Promise(resolve => {
        let CheckHtml=setInterval(function () {
            if (document.querySelector(".file-list-ul")!==null){
                console.log("列表加载完成");
                clearInterval(CheckHtml);
                resolve();
            }
        },ActionInterval);
    });
}

function Run() {
    //等待界面加载完成
    WaitUI().then(()=>{
        InitCss();
        InitHtml();
    });
}
Run();