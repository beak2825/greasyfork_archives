// ==UserScript==
// @name                Pixiv Bookmark Batch-Delete
// @version             0.0.6
// @description   随手拼凑的代码，用来删一下自己不喜欢的收藏，通过读取文件夹的图片id再按ID删除收藏；在收藏页可以操作：在右下角先点bm按钮获取所有收藏的信息，再选择del，读取文件夹的图片id删除收藏。
// @author              None
// @match               *://www.pixiv.net/users/*
// @grant               none
// @compatible          Chrome
// @namespace https://greasyfork.org/users/732531
// @downloadURL https://update.greasyfork.org/scripts/420880/Pixiv%20Bookmark%20Batch-Delete.user.js
// @updateURL https://update.greasyfork.org/scripts/420880/Pixiv%20Bookmark%20Batch-Delete.meta.js
// ==/UserScript==
try {
    $();
} catch (e) {
    let script = document.createElement('script');
    script.src = 'https://code.jquery.com/jquery-2.2.4.min.js';
    document.head.appendChild(script);
}
let LogLevel = {
    None: 0,
    Error: 1,
    Warning: 2,
    Info: 3,
    Elements: 4,
};
function DoLog(level, msgOrElement) {
    if (level <= LogLevel.Elements) {
        let prefix = "%c";
        let param = "";

        if (level == LogLevel.Error) {
            prefix += "[Bookmark_Delete][Error]";
            param = "color:#ff0000";
        } else if (level == LogLevel.Warning) {
            prefix += "[Bookmark_Delete][Warning]";
            param = "color:#ffa500";
        } else if (level == LogLevel.Info) {
            prefix += "[Bookmark_Delete][Info]";
            param = "color:#000000";
        } else if (level == LogLevel.Elements) {
            prefix += "[Bookmark_Delete]Elements";
            param = "color:#000000";
        }

        if (level <= LogLevel.Elements) {
            console.log(prefix + msgOrElement, param);
        } else {
            console.log(msgOrElement);
        }
    }
}

let g_csrfToken = "";
let userId = "";
// bookmarks.works是图片ID与bookmarkID的映射
let bookmarks = {"works":{}, "total":0};
let WORKS = []
function getUserId() {
    let matched = window.location.href.match(/users\/([0-9]+)/);
    if (matched.length > 0) {
        userId = matched[1];
        DoLog(LogLevel.Info, "Got userId: " + userId);
    } else {
        DoLog(LogLevel.Error, "Can not get userId.");
    }
}
function getToken() {

    $.get(location.href, function (data) {
            let matched = data.match(/token\\":\\"([a-z0-9]{32})/);
            if (matched != null && matched.length > 0) {
                g_csrfToken = matched[1];
                DoLog(LogLevel.Info, 'Got g_csrfToken: ' + g_csrfToken);
            } else {
                DoLog(LogLevel.Error,'Can not get g_csrfToken, so you can not add works to bookmark when sorting has enabled.');
            }
        });

}
function processBookmarkData(data){

    bookmarks.total = data.body.total;
    // works是一个作品数组
    let works = data.body.works;
    // 将WORKS信息保存，方便本地处理图片
    WORKS.push(...works);
    for(let i=0 ;i<works.length; ++i){
        bookmarks.works[works[i].id] = works[i].bookmarkData.id;
    }
}
async function getBookmark(offset, limit) {
    // !!注意修改语言参数
    return fetch(`https://www.pixiv.net/ajax/user/${userId}/illusts/bookmarks?tag=&offset=${offset}&limit=${limit}&rest=show&lang=zh`,
                 {
        headers: {
            accept: "application/json",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-user-id": userId,
        },
        referrer: `https://www.pixiv.net/users/${userId}/bookmarks/artworks`,
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
        method: "GET",
        mode: "cors",
        credentials: "include",
    }
                )
        .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject({
                status: response.status,
                statusText: response.statusText,
            });
        }
    })
        .then((data) => {
        processBookmarkData(data);
    });
}
async function getAllBookmark(){
    bookmarks = {"works":{}, "total":0};
    let limit = 100;
    await getBookmark(0,10);
    let total = bookmarks.total;
    let p = []
    for(let i=0; i<total*2; i+=limit){
        p.push(getBookmark(i,limit));
    }
    return Promise.all(p);
}


function getFilesIds(files){
    let ids = new Set();
    for(let i=0;i < files.length; ++i){
        let m = files[i].name.match(/^[0-9]+/);
        if(m){
            ids.add(m[0]);
        }
    }
    DoLog(LogLevel.Info,`有--${files.length}--个文件提交，作品待删除数--${ids.size}--个`);
    return ids;
}

function deleteBookmarkBybookmarkId(bookmarkId){
    return fetch("https://www.pixiv.net/ajax/illusts/bookmarks/delete", {
        "headers": {
            "accept": "application/json",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "baggage": "sentry-environment=production,sentry-release=349507495a6f3888c093422dcc7ba3fe5f33a311,sentry-public_key=ef1dbbb613954e15a50df0190ec0f023,sentry-trace_id=09cd00490e2997c33df34a747ae77492,sentry-sampled=false",
            "content-type": "application/x-www-form-urlencoded; charset=utf-8",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Not;A=Brand\";v=\"99\", \"Microsoft Edge\";v=\"139\", \"Chromium\";v=\"139\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-csrf-token": g_csrfToken
        },
        "referrer": `https://www.pixiv.net/users/${userId}/bookmarks/artworks`,
        "body": `bookmark_id=${bookmarkId}`,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    }).then((response) =>{
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject({
                status: response.status,
                statusText: response.statusText,
            });
        }
    });
}
async function deleteBookmarkByIds(ids){
    let p = [];
    let bid = [];
    let works = bookmarks.works;
    for (let id of ids){
        let bid = works[id]
        if(bid){
            p.push(deleteBookmarkBybookmarkId(bid))
        }
    }
    DoLog(LogLevel.Info,`有--${ids.size}--个作品待删除，在书签中找到${p.length}个`);
    return Promise.all([p]);
}

function saveWORKS(o, file_name){
    const json = JSON.stringify(o);
    // 创建一个Blob对象，指定文件类型为json
    const blob = new Blob([json], {type: 'application/json'});
    // 创建一个可下载的文件链接
    const url = URL.createObjectURL(blob);
    // 创建一个隐藏的a标签，设置href属性为文件链接，download属性为文件名
    const a = document.createElement('a');
    a.href = url;
    a.download = file_name;
    a.style.display = 'none';
    // 将a标签添加到文档中
    document.body.appendChild(a);
    // 模拟点击a标签，开始下载文件
    a.click();
    // 移除a标签和释放URL对象
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}


function findToolbarCommon() {
    return $("#root>div>div>div>ul").get(0);
}
async function insertButton() {

    if ($("#pdelete-toolbar").length == 0) {
        $('body').append('<div id="pdelete-toolbar" style="position:fixed;left:28px;bottom:160px;"></div>');
    }

    // 插入获取书签按钮
    if($("#pb-get").length == 0 ){
       $("#pdelete-toolbar").append(
            '<div><button id="pb-get" style="background-color: rgb(0, 0, 0);margin-top: 5px;opacity: 0.8;cursor: pointer;border: none;padding: 12px;border-radius: 24px;width: 48px;height: 48px;color: white;">bm</button></div>');
        $("#pb-get").css("margin-top", "10px");
        $("#pb-get").css("opacity", "0.8");
        $("#pb-get").click(async function () {
            $("#pb-get").attr('disabled',true);
            await getAllBookmark();
            console.log("bookmarks",bookmarks);
            console.log("WORKS",WORKS);
            //#TODO 很奇怪的是bookmarks.works比bookmarks total多，被删除的作品还会在bookmarks.works中只是不可访问了
            DoLog(LogLevel.Info, `bookmarks total: ${bookmarks.total}个, 实际上bookmarks.works（包括失效作品）: ${Object.keys(bookmarks.works).length}个`);
            // 保存书签信息
            saveWORKS(WORKS,"works_info.json");
            alert(`bookmarks total: ${bookmarks.total}个, 实际上bookmarks.works（包括失效作品）: ${Object.keys(bookmarks.works).length}个`);
            $("#pb-get").attr('disabled',false);
            $("#pb-delete").css("display"," ");
        });
    }
    // 插入删除按钮
    if ($("#pb-delete").length == 0) {
        $("#pdelete-toolbar").append('<div><button id="pb-delete" style="background-color: rgb(0, 0, 0);margin-top: 5px;opacity: 0.8;cursor: pointer;border: none;padding: 12px;border-radius: 24px;width: 48px;height: 48px;color: white;"><input type="file" id="dir-input-delete" style="display: none" webkitdirectory directory />del</button></div>');
        $("#pb-delete").css("margin-top", "10px");
        $("#pb-delete").css("opacity", "0.8");
        // input是button的子元素。取消冒泡避免循环调用
        $("#dir-input-delete").click((e)=>{
            e.stopPropagation();
        });
        // 隐藏了input的样式由button触发input。
        $("#pb-delete").click(function(event){
            $("#dir-input-delete").click();
        });
        $("#dir-input-delete").change(async function(event){
            let fs = event.target.files;
            // fIds是一个记录了要删除的图片id对象
            let Ids = getFilesIds(fs);
            let originBookmarkTotal = bookmarks.total;
            await deleteBookmarkByIds(Ids);
            //加入延迟看看能不能解决这问题，可以，看来是访问太快服务器状态还没更新，不是同步问题
            await new Promise(resolve => setTimeout(resolve,500));
            //对比删除前后书签数
            await getBookmark(0,10)
            DoLog(LogLevel.Info,"删除前书签数： "+originBookmarkTotal+"; 删除后书签数： "+bookmarks.total);
            alert("删除前书签数： "+originBookmarkTotal+"; 删除后书签数： "+bookmarks.total);
        })
    }

    clearInterval(myloadInterval);
    //获取书签svg
    // <svg t="1611904366076" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2903" width="200" height="200"><path d="M512 74.666667C270.933333 74.666667 74.666667 270.933333 74.666667 512S270.933333 949.333333 512 949.333333 949.333333 753.066667 949.333333 512 753.066667 74.666667 512 74.666667z m0 810.666666c-204.8 0-373.333333-168.533333-373.333333-373.333333S307.2 138.666667 512 138.666667 885.333333 307.2 885.333333 512 716.8 885.333333 512 885.333333z" p-id="2904" fill="#ffffff"></path><path d="M695.466667 567.466667l-151.466667-70.4V277.333333c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v238.933334c0 12.8 6.4 23.466667 19.2 29.866666l170.666667 81.066667c4.266667 2.133333 8.533333 2.133333 12.8 2.133333 12.8 0 23.466667-6.4 29.866666-19.2 6.4-14.933333 0-34.133333-17.066666-42.666666z" p-id="2905" fill="#ffffff"></path></svg>
    //删除图标svg
    //'<svg t="1611836610996" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3167" width="200" height="200"><path d="M874.666667 202.666667H360.533333c-21.333333 0-40.533333 8.533333-55.466666 23.466666l-217.6 234.666667c-25.6 27.733333-25.6 72.533333 0 100.266667l217.6 234.666666c14.933333 14.933333 34.133333 23.466667 55.466666 23.466667H874.666667c40.533333 0 74.666667-34.133333 74.666666-74.666667V277.333333c0-40.533333-34.133333-74.666667-74.666666-74.666666z m10.666666 544c0 6.4-4.266667 10.666667-10.666666 10.666666H360.533333c-2.133333 0-6.4-2.133333-8.533333-4.266666l-217.6-234.666667c-4.266667-4.266667-4.266667-10.666667 0-14.933333l217.6-234.666667c2.133333-2.133333 4.266667-4.266667 8.533333-4.266667H874.666667c6.4 0 10.666667 4.266667 10.666666 10.666667V746.666667z" p-id="3168" fill="#ffffff"></path><path d="M684.8 403.2c-12.8-12.8-32-12.8-44.8 0l-64 64-61.866667-61.866667c-12.8-12.8-32-12.8-44.8 0-12.8 12.8-12.8 32 0 44.8l61.866667 61.866667-61.866667 61.866667c-12.8 12.8-12.8 32 0 44.8 6.4 6.4 14.933333 8.533333 23.466667 8.533333s17.066667-2.133333 23.466667-8.533333l61.866666-61.866667L640 618.666667c6.4 6.4 14.933333 8.533333 23.466667 8.533333s17.066667-2.133333 23.466666-8.533333c12.8-12.8 12.8-32 0-44.8L620.8 512l61.866667-61.866667c12.8-12.8 12.8-34.133333 2.133333-46.933333z" p-id="3169" fill="#ffffff"></path></svg>'
}

function Load() {
    /*let toolBar = findToolbarCommon();
    if (toolBar) {
        DoLog(LogLevel.Elements, toolBar);
        clearInterval(myloadInterval);
    } else {
        DoLog(LogLevel.Warning, "Get toolbar failed.");
        return;
    }*/
    getUserId();
    getToken();

    insertButton();
}

myloadInterval = setInterval(Load, 1000);
