// ==UserScript==
// @name         天翼云盘cloud.189.cn批量转存
// @namespace    StartMenu
// @version      1.1
// @description  当天翼云文件夹超过1000时使用最合适，低于1000文件请用天翼云自带功能！
// @author       StartMenu
// @license MIT
// @match        https://cloud.189.cn/web/share?code=*
// @icon         https://www.google.com/s2/favicons?domain=189.cn
// @grant GM_addStyle
// @grant GM_addElement

// @ 测试用： https://cloud.189.cn/web/share?code=iqQjMn3e6Nfu
// @ 测试用2 : https://cloud.189.cn/web/share?code=reIJv2rE7Fni

// @downloadURL https://update.greasyfork.org/scripts/499813/%E5%A4%A9%E7%BF%BC%E4%BA%91%E7%9B%98cloud189cn%E6%89%B9%E9%87%8F%E8%BD%AC%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/499813/%E5%A4%A9%E7%BF%BC%E4%BA%91%E7%9B%98cloud189cn%E6%89%B9%E9%87%8F%E8%BD%AC%E5%AD%98.meta.js
// ==/UserScript==
//动作间隔,单位毫秒,根据自己的网速和电脑性能调节
let ActionInterval=1000;
//一次保存数量,普通用户最多1000,设太大容易卡住
let SaveNumber=200;
//保存文件夹名
let SaveDirectoryName="批量转存-";

//以下变量不要修改
//文件列表,它自己的分页都有问题,出现重复文件,会导致保存失败
let NowFileList=[];
//加载是否完成
let LoadFinish=false;
let MYloadingText;

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
        if (i<=SaveNumber){
            let Name=Items[i].querySelector(".file-item-name-fileName-span").textContent.trim();
            NowFileList.push(Name);
            Items[i].querySelector(".file-item-check").click();
        }
        else
        {
            break;
        }
    }
    //console.log("完成文件选择",NowFileList);
    console.log("完成文件选择:"+NowFileList.length);
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

// document.querySelector("[class^=Directory_directory-button]")
// 生成需要的文件夹
async function makeDir(){
    return new Promise(resolve => {
        let makeDirCheck=setInterval(function () {
            //let makeDirectory=document.querySelector("[class^=Directory_directory-button]").firstChild;
            //makeDirectory.click();

           // console.log('查找新建按钮');
           // console.log(makeDirectory);
            let url = 'https://cloud.189.cn/api/open/file/createFolder.action?noCache=0.'+Date.now();
            // document.querySelectorAll(".info-detail-name span")[0].textContent.trim()
            let data = {
                parentFolderId: "-11",
                folderName: SaveDirectoryName+document.querySelector("[class^=FileListHead_file-list-nav]").lastChild.textContent.trim()
            };

            // 将数据转换为x-www-form-urlencoded格式
            let params = Object.keys(data).map(function(key) {
              return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
            }).join('&');

            fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: params,
            })
            .then(function(){
                clearInterval(makeDirCheck);
            })
            .catch((error) => {
            });

            return resolve();
        },ActionInterval);
    });
}

/**
保存时覆盖已有的文件
*/
function autoRewrite(){
    let myAutoRewrite=setInterval(function () {
        if(document.querySelector("[class^=HandleConflict_conflict-choose] input[type='checkbox']:not(:checked)")){
            document.querySelector("[class^=HandleConflict_conflict-choose] input[type='checkbox']:not(:checked)").click();
        }
        if(document.querySelector("[class^=HandleConflict_conflict-bottom-button-replace]")){
            document.querySelector("[class^=HandleConflict_conflict-bottom-button-replace]").click();
        }
    },ActionInterval);
}


async function SelectSaveDirectory() {
    let selectedDir = false;
    return new Promise(resolve => {

        let Check=setInterval(function () {
            let AllDirectory=document.querySelectorAll("[class^=DirectoryTree_directory-li] [class^=DirectoryTree_c-directory-tree]>div");
            for (let i = 0; i < AllDirectory.length; i++) {
                let Name=AllDirectory[i].querySelector(".directory-name").textContent.trim();
                if (Name===SaveDirectoryName+document.querySelector("[class^=FileListHead_file-list-nav]").lastChild.textContent.trim()){
                    clearInterval(Check)
                    AllDirectory[i].childNodes[0].childNodes[1].dispatchEvent(new MouseEvent("mousedown"));
                    selectedDir = true;
                    break;
                }
            }
            //目录加载完了还是没看到文件夹，刷新一下
            if(AllDirectory.length > 0 && !selectedDir){
                document.querySelector("[class^=Directory_directory-button]").nextElementSibling.click();
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
    // 页面切到后台会导致此方法失效，不管用下面哪种方式。 都无法检测当转存的项已经完成！
    /*
    return new Promise(resolve => {
        let Loading=setInterval(function () {
            let LoadingBlock=document.querySelector("[class^=loading_c-loading]");
            if (LoadingBlock.style.display==="none"){
                clearInterval(Loading);
                return resolve();
            }
        },ActionInterval);
    });
    */
    return new Promise(resolve => {
        let Loading=setInterval(function () {
            let LoadingBlock=document.querySelector(".ant-message .ant-message-notice");
            if (LoadingBlock){
                console.log("消息完成！");
                clearInterval(Loading);
                return resolve();
            }
        },100);
    });

}

function RemoveSelectItem() {
    let List=document.querySelectorAll(".file-list-ul .selected");
    for (let i = 0; i < List.length; i++) {
        List[i].querySelector("input").click();
        List[i].remove();
    }
}


let nowsaveIndex = 0; //当前保存到第几个文件了

async function StartSave() {

    console.log("开始保存");
    MYloadingText.textContent="正在保存选中的文件(页面不要切到后台)";
    //删除重复项目
    RemoveRepeatItem();
    //选择列表文件
    SelectListFile();
    //点击转存
    await ClickNewSaveButton();
    //选择保存文件夹
    await SelectSaveDirectory();

    //点击确定
    ClickYesButton();
    //等待转存完成
    await SaveIsDone();
    //移除选择项
    RemoveSelectItem();
    console.log("当前保存完成");
    if (LoadFinish&&document.querySelectorAll(".file-list-ul>li").length===0){
        //alert("全部保存完成");
        MYloadingText.textContent="全部保存完成";
    }
    else{
        StartSave();
    }
}

function InitHtml() {
    //
//document.querySelector(".info-detail")
    let Holder=document.querySelector(".info-detail h2");
    let SaveAllButton=GM_addElement(Holder,"button",{textContent:"全部保存",class:"JXNButton"});

    //绑定事件
    SaveAllButton.onclick=function () {
        //隐藏保存按钮
        SaveAllButton.style.display="none";
        MYloadingText=GM_addElement(Holder,"button",{textContent:"正在加载(页面不要切到后台)",class:"JXNButton"});
        //先强制排一下序
        document.querySelector('.file-list-ul').previousElementSibling.childNodes[1].childNodes[1].click();
        //生成目录
        makeDir();
        //设置全局显示
        ScrollFileList2();
    }
}

let trytimes = 0; //加载时尝试次数
function ScrollFileList2() {
    let LastName=""; // 最后一个元素
    MYloadingText.textContent="正在加载所有文件(页面不要切到后台)";
    let ScrollFileList2xx=setInterval(function () {
        if (document.querySelector(".file-list-load")===null){
            //多等5秒再执行
            if(trytimes < 5){
                trytimes++;
            }
            else{
                //取当前最后一个文件名 .querySelector(".file-list-ul")
                let CheckLastName=document.querySelector(".selDiv").previousSibling.querySelector(".file-item-name-fileName-span").textContent.trim();
                console.log(CheckLastName);
                if(CheckLastName===LastName){
                    console.log("列表全部加载完成");
                    LoadFinish=true;
                    MYloadingText.textContent="完成加载所有文件(页面不要切到后台)";
                    let NowLength=document.querySelector(".file-list-ul").querySelectorAll("li").length;
                    console.log("当前加载完成,数量"+NowLength);
                    clearInterval(ScrollFileList2xx);
                    StartSave();
                }
                else{
                    LastName=CheckLastName;
                    document.querySelector(".file-list-ul").scrollTo(0,document.querySelector(".file-list-ul").scrollHeight);
                }
            }
        }
        else {
            console.log("正在加载");
        }
    },ActionInterval);
}


function InitCss() {
    GM_addStyle(`.JXNButton {
    left: 0;
    padding: 5px 10px;
    background-color: #ff1eee;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 5px;
}`);
}

/**
调用自己，直到file-list-ul出现，再返回执行下面的操作
*/
async function WaitUI() {
    return new Promise(resolve => {
        let CheckHtml=setInterval(function () {
            if (document.querySelector(".file-list-ul")!==null){
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
