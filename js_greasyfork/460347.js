// ==UserScript==
// @name         绯月黑名单
// @namespace    https://greasyfork.org/zh-CN/users/453092
// @version      1.0.1
// @description  眼不见为净
// @author       ikarosf
// @require      https://unpkg.com/dexie@latest/dist/dexie.js
// @require      https://unpkg.com/dexie-export-import@latest/dist/dexie-export-import.js
// @match        https://bbs.fygal.com/*
// @match        https://bbs.bakabbs.com/*
// @match        https://bbs.365gal.com/*
// @match        https://bbs.365galgame.com/*
// @match        https://bbs.kfmax.com/*
// @match        https://bbs.9shenmi.com/*
// @match        https://bbs.kfpromax.com/*
// @match        https://kf.miaola.work/*
// @match        https://m.miaola.work/*
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/460347/%E7%BB%AF%E6%9C%88%E9%BB%91%E5%90%8D%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/460347/%E7%BB%AF%E6%9C%88%E9%BB%91%E5%90%8D%E5%8D%95.meta.js
// ==/UserScript==
async function kf_index_check(){
    var main_post_list_parentdiv = $("#alldiv>div:eq(2)>div:eq(1)>div:eq(0)")
    main_post_list_parentdiv.children().each(async function () {
        var thispost = $(this).find("a:first")
        var name = thispost.attr("uname")
        var itemobj = getQueryString(thispost.attr("href"))
        var tid = itemobj["tid"]
        //console.log(tid + " " + name)
        if(black_set.has(name)){
            $(this).hide();
            console.log("hide " + name)
        }
        await db_add_postdata(tid,name)
    });
}

async function kf_left_check(){
    $(".rightboxa>a").each(async function () {
        var url = $(this).attr("href")
        var itemobj = getQueryString(url)
        var tid = itemobj["tid"]
        var name = await db_get_poster(tid)
        if(name == ""){
            var newname = await html_get_poster(url)
            if(newname){
                if(black_set.has(newname)){
                    $(this).hide();
                    $(this).next().hide();
                    console.log("hide " + newname)
                }
                await db_add_postdata(tid,newname)
            }
        }else{
            if(black_set.has(name)){
                $(this).hide();
                $(this).next().hide();
                console.log("hide " + name)
            }
        }
    })
}

async function kf_thread_check(){
    //$(".thread1>tbody>tr").find("td:eq(3)>a")
    $("a.bl").each(function(){
        var name = $(this).text()
        if(black_set.has(name)){
            $(this).closest("tr").hide()
            console.log("hide " + name)
        }
    })
}

async function kf_post_check(){
    $(".readtext").each(function(){
        var name = $(this).find(".readidmsbottom:first>a").text()
        if(black_set.has(name)){
            $(this).hide()
            console.log("hide " + name)
        }
    })
}

function init_ui(){
    var menubutton= document.createElement('li')
    menubutton.innerHTML = '<a id="kfblacklistmenubutton" href="#">黑名单</a>'
    document.getElementsByClassName("topmenuo7")[0].children[0].append(menubutton)

    $("<style></style>").html(dialog_css).appendTo($("head"));
    $(`<div class="pd_cfg_box" id="fBlockUserDialog" style="display: none; top: 326px; left: 759.5px;">
  <h1>屏蔽用户 设完请刷新</h1>
<div class="pd_cfg_main" style="max-height: 867px;">
  <ul id="fBlockUserList" style="margin-top: 5px; min-width: 362px; line-height: 24px;"></ul>
  <div style="margin-top: 5px;" >
    <input id="fAddBlockUser" style="width: 200px;" type="text">
    <a class="pd_btn_link" id="fAddBlockUserButton" href="#">添加</a>
  </div>
</div>
<div class="pd_cfg_btns">
  <button id="fBlockUserDialogClose">关闭</button>
</div>
</div>`).appendTo($("body"));

    function addtolist(name){
        $(`<li>
  <input name="username" type="text" style="width: 150px; margin-left: 5px;" maxlength="15" readonly value="`+ name +`">
  <a class="pd_btn_link pd_delete" class="deleteBlockUser" href="#">删除</a>
</li>`).appendTo($("#fBlockUserList"));
        $(".pd_delete").on("click",async function (e) {
            e.preventDefault();
            var name = $(this).prev().val()
            await db.blacklist.where({name:name}).delete()
            black_set.delete(name)
            $(this).parent().remove()
        })
    }

    for (let name of black_set) {
        addtolist(name)
    }

    $("#fBlockUserDialogClose").on("click",function (e) {
        $("#fBlockUserDialog").fadeOut(200)
    })

    $("#fAddBlockUserButton").on("click",async function (e) {
        e.preventDefault();
        var name = $("#fAddBlockUser").val()
        if(!name || black_set.has(name)) return
        await db.blacklist.add({name:name})
        black_set.add(name)
        addtolist(name)
        $("#fAddBlockUser").val("")
    })

    $(menubutton).on("click",function (e) {
        e.preventDefault();
        $("#fBlockUserDialog").toggle()
    })

}

function miaola_get_tid(url){
    var reg = /[0-9]+/g
    var numberlist = url.match(reg)
    return numberlist[0]
}

async function miaola_index_check(){
    async function miaola_index_do(){
        var thispost = $(this).children("a:first")
        var name = thispost.attr("data-author")
        var tid = miaola_get_tid(thispost.attr("href"))
        //console.log(tid + " " + name)
        if(black_set.has(name)){
            $(this).hide();
            console.log("hide " + name)
        }
        await db_add_postdata(tid,name)
    }

    var panel1 = $("#newReplyPanel1")
    var panel2 = $("#newReplyPanel2")
    var panel3 = $("#newReplyPanel3")
    panel1.children().each(miaola_index_do)
    panel2.children().each(miaola_index_do)
    panel3.children().each(miaola_index_do)
}

async function miaola_bottom_check(){
    async function miaola_bottom_do() {
        var thispost = $(this).children("a:first")
        var url = thispost.attr("href")
        var tid = miaola_get_tid(url)
        var name = await db_get_poster(tid)
        if(name == ""){
            var newname = await miaola_get_poster(url)
            if(newname){
                if(black_set.has(newname)){
                    $(this).hide();
                    console.log("hide " + newname)
                }
                await db_add_postdata(tid,newname)
            }
        }else{
            if(black_set.has(name)){
                $(this).hide();
                console.log("hide " + name)
            }
        }
    }

    $("#newExtraPanel1").children().each(miaola_bottom_do)
    $("#newExtraPanel2").children().each(miaola_bottom_do)
}

function miaola_post_check(){
    $(".read-floor").each(function(){
        var name = $(this).find(".floor-user").text().trim();
        if(black_set.has(name)){
            $(this).hide()
            console.log("hide " + name)
        }
    })
}

function miaola_thread_check(){
    $(".thread-list-item").each(function(){
        var name = $(this).find(".fa-user").parent().text().trim()
        if(black_set.has(name)){
            $(this).hide()
            console.log("hide " + name)
        }
    })
}

function init_ui_miaola(){
    $(miaola_dialoghtml).appendTo($("body"))

    $(`<li class="nav-item">
          <a class="nav-link" id="openBlackDialog" href="#" role="button">
            <i class="fa fa-cog fa-fw" aria-hidden="true"></i> 黑名单
          </a>
        </li>`).appendTo($("body ul:first"))

    $("#openBlackDialog").on("click",async function (e) {
        e.preventDefault();
        $('#mainMenuTogglerBtn').click();
        $("#fblockUserDialog").toggle()
    })

    $("#fCloseBlockUserDialog").on("click",async function (e) {
        e.preventDefault();
        $("#fblockUserDialog").fadeOut(200)
    })

    function addtolist(name){
        $(miaola_linehtml.format(name)).appendTo($("#fblockUserList"));
        $(".pd_delete").on("click",async function (e) {
            e.preventDefault();
            var name = $(this).prev().find("input").val()
            await db.blacklist.where({name:name}).delete()
            black_set.delete(name)
            $(this).parent().remove()
        })
    }

    for (let name of black_set) {
        addtolist(name)
    }

    $("#fAddBlockUserButton").on("click",async function (e) {
        e.preventDefault();
        var name = $("#fAddBlockUser").val()
        if(!name || black_set.has(name)) return
        await db.blacklist.add({name:name})
        black_set.add(name)
        addtolist(name)
        $("#fAddBlockUser").val("")
    })
}

async function init_db(){
    db.version(1).stores({
        blacklist: "++id,&name",
        postdata:"++id,&tid,time"
    });

    await db.blacklist
        .each(async blackline => {
        black_set.add(blackline.name)
    });
}

async function db_add_postdata(tid,name){
    var now = getLocDate();
    try {
        await db.postdata.add({tid:tid, name:name, time:now});
    }catch(err) {

    }
}

async function db_get_poster(tid){
    var data = await db.postdata.where({tid:tid}).first()
    if(data){
        return data["name"]
    }
    return ""
}

async function db_clear(dayss){
    console.log(dayss)
    var during_s = dayss * 24 * 60 * 60 * 1000
    var now = getLocDate()
    var old = new Date(now - during_s)
    await db.postdata.where("time").belowOrEqual(old).delete()
}

async function html_get_poster(url){
    return new Promise((resolve, reject)=>{
        console.log("getnewpost:" + url)
        setTimeout(resolve, 10*1000)
        GM_xmlhttpRequest({
            method: "get",
            url:   unsafeWindow.location.origin + "/" + url,
            headers:  {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            onload: function(res){
                if(res.status === 200){
                    let info = res.responseText;
                    //console.log(info)
                    var name = $(info).find(".readtext a:first").text()
                    resolve(name)
                }else{
                    console.log(res)
                }
                resolve()
            },
            onerror : function(err){
                console.log(err)
                resolve()
            },
            ontimeout : function(){
                resolve()
            }
        });
    }) //Promise end
}

async function miaola_get_poster(url){
    return new Promise((resolve, reject)=>{
        console.log("getnewpost:" + url)
        setTimeout(resolve, 10*1000)
        GM_xmlhttpRequest({
            method: "get",
            url:   unsafeWindow.location.origin + url,
            headers:  {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            onload: function(res){
                if(res.status === 200){
                    let info = res.responseText;
                    //console.log(info)
                    var name = $(info).find(".read-floor .floor-user:first").text().trim();
                    resolve(name)
                }else{
                    console.log(res)
                }
                resolve()
            },
            onerror : function(err){
                console.log(err)
                resolve()
            },
            ontimeout : function(){
                resolve()
            }
        });
    }) //Promise end
}

function init_string(){
    dialog_css = `
  /* 公共 */
  .pd_highlight { color: #f00 !important; }
  .pd_notice, .pd_msg .pd_notice { font-style: italic; color: #666; }
  .pd_input, .pd_cfg_main input, .pd_cfg_main select {
    vertical-align: middle; height: auto; margin-right: 0; line-height: 22px; font-size: 12px;
  }
  .pd_input[type="text"], .pd_input[type="number"], .pd_cfg_main input[type="text"], .pd_cfg_main input[type="number"] {
    height: 22px; line-height: 22px;
  }
  .pd_input:focus, .pd_cfg_main input[type="text"]:focus, .pd_cfg_main input[type="number"]:focus, .pd_cfg_main textarea:focus,
      .pd_textarea:focus { border-color: #7eb4ea; }
  .pd_textarea, .pd_cfg_main textarea { border: 1px solid #ccc; font-size: 12px; }
  .pd_btn_link { margin-left: 4px; margin-right: 4px; }

  /* 设置对话框 */
  .pd_cfg_ml { margin-left: 10px; }
  .pd_cfg_box {
    position: fixed; border: 1px solid #9191ff; display: none; z-index: 1002;
    -webkit-box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5); -moz-box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5); box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5);
  }
  .pd_cfg_box h1 {
    text-align: center; font-size: 14px; background-color: #9191ff; color: #fff; line-height: 2em; margin: 0; padding-left: 20px;
  }
  .pd_cfg_box h1 span { float: right; cursor: pointer; padding: 0 10px; }
  .pd_cfg_nav { text-align: right; margin-top: 5px; margin-bottom: -5px; }
  .pd_cfg_main { background-color: #fcfcfc; padding: 0 10px; font-size: 12px; line-height: 24px; min-height: 50px; overflow: auto; }
  .pd_cfg_main fieldset { border: 1px solid #ccccff; padding: 0 6px 6px; }
  .pd_cfg_main legend { font-weight: bold; }
  .pd_cfg_main input[type="color"] { height: 18px; width: 30px; padding: 0; }
  .pd_cfg_tips { color: #51d; text-decoration: none; cursor: help; }
  .pd_cfg_tips:hover { color: #ff0000; }
  #pdConfigDialog .pd_cfg_main { overflow-x: hidden; white-space: nowrap; }
  .pd_cfg_panel { display: inline-block; width: 400px; vertical-align: top; }
  .pd_cfg_panel + .pd_cfg_panel { margin-left: 5px; }
  .pd_cfg_btns { background-color: #fcfcfc; text-align: right; padding: 5px; }
  .pd_cfg_btns input, .pd_cfg_btns button { vertical-align: middle; }
  .pd_cfg_btns button { min-width: 80px; }
  .pd_cfg_about { float: left; line-height: 24px; margin-left: 5px; }
  .pd_custom_script_header { margin: 7px 0; padding: 5px; background-color: #e8e8e8; border-radius: 5px; }
  .pd_custom_script_content { display: none; width: 750px; height: 350px; white-space: pre; }

`;
    miaola_dialoghtml = `<form>
<div class="dialog" id="fblockUserDialog" tabindex="-1" role="dialog" aria-hidden="true" aria-labelledby="blockUserDialogTitle" style="display: none;">
  <div class="container dialog-content" role="document">
    <div class="dialog-header">
      <h5 class="dialog-title" id="fblockUserDialogTitle">黑名单 设完请刷新</h5>
    </div>
    <div class="dialog-body" style="max-height: 726.25px;">

<ul class="list-unstyled" id="fblockUserList">

</ul>

<div class="input-group mb-3">
  <input class="form-control" data-toggle="tooltip" type="text" title="" aria-label="添加屏蔽用户" id="fAddBlockUser">
  <div class="input-group-append">
    <button class="btn btn-success" type="button" id="fAddBlockUserButton">添加</button>
  </div>
</div></div>
    <div class="dialog-footer">
<button class="btn btn-primary" id="fCloseBlockUserDialog">关闭</button>
  </div>
</div>
</form>`;

    miaola_linehtml = `<li class="form-group row no-gutters mb-2">
  <div class="col-7 input-group input-group-sm">
    <input class="form-control" type="text" value="{0}" maxlength="12" readonly>
  </div>
      <button class="btn btn-danger pd_delete" type="button" aria-label="删除屏蔽用户">
        <i class="fa fa-trash" aria-hidden="true"></i>
      </button>
  </li>`;
}

// 获取链接参数
function getQueryString(url) {
    let ItemArr = [];
    let ItemObj = {};
    url
        .substring(url.lastIndexOf("?") + 1, url.length)
        .split("&")
        .map((item) => {
        ItemArr.push(item.split("="));
    });
    ItemArr.map((item) => {
        ItemObj[item[0]] = item[1];
    });
    return ItemObj;
}

function getLocDate(aparam){//不传参，返回当前时间的Date变量;该方法用来代替new Date
    var thisDate;
    if (typeof(aparam) == "undefined") {
        thisDate = new Date();
    }else{
        thisDate = new Date(aparam)
    }
    //本地时间 + 本地时间与格林威治时间的时间差 + GMT+8与格林威治的时间差
    return new Date(thisDate.getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000)
}

function getLocDay(){//返回当前日期的Date变量
    var daystr = getDateString(getLocDate())
    return new Date(new Date(daystr).getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000)
}

function getDateString(thisDate){//将传入的时间戳转换为年月日字符串
    return thisDate.getFullYear() + "/" + (thisDate.getMonth()+1) + "/" + thisDate.getDate()
}

function getNowtime(){
    var date=getLocDate();
    var datetext = date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
    return datetext;
}

String.prototype['format'] = function () {
    const e = arguments;
    return !!this && this.replace(/\{(\d+)\}/g, function (t, r) {
        return e[r] ? e[r] : t;
    });
};

//---------------------main------------------------
const db = new Dexie("kffblack");
var dialog_css,miaola_dialoghtml,miaola_linehtml;
const black_set = new Set();

(async function() {
    await init_db()
    init_string()
    var hostname = unsafeWindow.location.hostname
    var pathname = unsafeWindow.location.pathname
    if(hostname.indexOf("m.miaola") != -1){
        if(pathname == "/" || pathname == "/index.php"){
            await miaola_index_check()
            await miaola_bottom_check()
        }else if(pathname.indexOf("/read/") != -1){
            await miaola_post_check()
        }else{
            await miaola_thread_check()
        }
        init_ui_miaola()
    }else{
        if(pathname == "/" || pathname == "/index.php"){
            await kf_index_check()
            await kf_left_check()
        }else if(pathname.indexOf("/read.php") != -1){
            await kf_post_check()
        }else{
            await kf_thread_check()
            await kf_left_check()
        }
        init_ui()
    }

    setTimeout(db_clear, 10*1000, 7)
})();

