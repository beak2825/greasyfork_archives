// ==UserScript==
// @name         Steam Hide Blacklist Comments
// @namespace    
// @version      0.3.1
// @description  steam隐藏黑名单评测
// @license      MIT
// @author       lyzlyslyc
// @match        http*://store.steampowered.com/app/*
// @match        http*://steamcommunity.com/app/*
// @enable       true
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/437038/Steam%20Hide%20Blacklist%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/437038/Steam%20Hide%20Blacklist%20Comments.meta.js
// ==/UserScript==

//是否默认勾选隐藏评测
var checked = true;

//默认的关键字或正则表达式(正则表达式使用/包围，例如/abc/)
var default_blacklist=[
     "我是傻逼",
     "口了",
     "明逼",
     "⣿⣿⣿⣿⣿⣿⣹⡋⠘⠷⣦⣀⣠⡶⠁⠈⠁⠄⣿⣿⣿⣿⣿⣿⣿",
     "需要中文",
     "产品已退款",
     /伞兵/
];

var blacklist=[];

var blocked_comments_list = [];

var isStore = true;

var tMsg = 0;

var isSteamClient = navigator.userAgent.search(/Valve Steam Client/)!=-1;

(function(){
    'use strict';

    //获取关键字
    let str = GM_getValue("steam_blacklist",getBlacklistText(default_blacklist));
    blacklist = parseBlacklist(str);

    //steam客户端
    if(isSteamClient){
        window.addEventListener("message",(e)=>{
            try{
                let data = JSON.parse(e.data);
                if(data.steam_blacklist!=null){
                    GM_setValue("steam_blacklist",data.steam_blacklist);
                    console.log(data.steam_blacklist);
                    e.source.postMessage(JSON.stringify({"steam_blacklist_feedback":true}),e.origin);
                    alert("关键词同步成功");
                    window.close();
                }
                else if(data.steam_blacklist_feedback!=null){
                    clearInterval(tMsg);
                }
            }
            catch(ex){
                alert(ex);
                e.source.postMessage(JSON.stringify({"steam_blacklist_feedback":false}),e.origin);
                window.close();
                console.log(ex);
            }
        });
    }

    //设置对话框
    let dlg_settings = document.createElement("div");
    dlg_settings.className = "blacklist_hover";
    dlg_settings.style = "width: 400px; height: 500px; position: fixed; margin-left: auto; left: 0px; right: 0px; margin-right: auto; top: 25%; background: rgb(27, 40, 56); border-radius: 25px; z-index: 999; text-align: center;";
    dlg_settings.innerHTML=
        '<div style="position: relative;top: 2%;font-size: 18px;color: #4a86ad;">关键词列表（按行分隔）</div>'+
        '<textarea type="text" id="blacklist_text" style="width: 90%;height: 80%;position: absolute;left: 4%;top: 8%;resize: none;background: #316282;color: #fffff1;font-family: Arial, Helvetica, sans-serif;border-radius: 3px;padding: 3px;font-size: 16px;" draggable="false"></textarea>'+
        '<a class="btnv6_blue_hoverfade btn_medium" style="position: absolute;bottom: 1%;left: 8%;width: 24%;" id="save_blacklist"><span>保存</span></a>'+
        '<a class="btnv6_blue_hoverfade btn_medium" style="position: absolute;bottom: 1%;left: 38%;width: 24%;" id="reset_blacklist"><span>默认</span></a>'+
        '<a class="btnv6_blue_hoverfade btn_medium" style="position: absolute;bottom: 1%;right: 8%;width: 24%;" id="cancel_blacklist"><span>取消</span></a>';
    document.body.appendChild(dlg_settings);
    document.querySelector(".blacklist_hover").style.display="none";
    //取消按钮
    document.querySelector("#cancel_blacklist").addEventListener("click",()=>{
        document.querySelector(".blacklist_hover").style.display="none";
    });
    //保存按钮
    document.querySelector("#save_blacklist").addEventListener("click",()=>{
        try{
            //更新黑名单
            blacklist = parseBlacklist(document.getElementById("blacklist_text").value);
            //保存黑名单至本地
            GM_setValue("steam_blacklist",document.getElementById("blacklist_text").value);

            //steam客户端
            if(isSteamClient){
                let baseUrl = "";
                if(isStore)baseUrl = "https://steamcommunity.com";
                else baseUrl = "https://store.steampowered.com";
                baseUrl+=location.href.match(/\/app\/\d*/)[0];
                let win = window.open(baseUrl);
                tMsg = setInterval(()=>{
                    if(!win.closed)win.postMessage(JSON.stringify({"steam_blacklist":document.getElementById("blacklist_text").value}),baseUrl);
                    else clearInterval(tMsg);
                },1000);
            }

            //更新隐藏评论
            blocked_comments_list = [];
            if(isStore){
                let count = 0;
                document.querySelectorAll(".review_ctn .review_box").forEach((item)=>{
                    item.showComment();
                    if(checkForBlacklist(item,item))count++;
                });
                document.getElementById("blacklist_comments_count").innerText=`(共${count}条)`;
            }
            else {
                document.querySelectorAll(".apphub_UserReviewCardContent").forEach((item)=>{
                    let parent = item.parentNode;
                    parent.showComment();
                    checkForBlacklist(item,parent);
                });
            }
            hideComments();
            //关闭对话框
            document.querySelector(".blacklist_hover").style.display="none";
        }
        catch(ex){
            alert(ex);
        }
    });
    //重置按钮
    document.querySelector("#reset_blacklist").addEventListener("click",()=>{
        document.getElementById("blacklist_text").value = getBlacklistText(default_blacklist);
    });


    //分页面初始化
    if(location.href.search(/steampowered.com/)!=-1){
        isStore = true;
        let check = document.createElement("input");
        check.type="checkbox";
        check.id="check_hide";
        check.checked = checked;
        check.addEventListener("click", hideComments);

        let count = document.createElement("span");
        count.id="blacklist_comments_count";

        //打开设置对话框按钮
        let a = document.createElement("a");
        a.id="blacklist_settings";
        a.innerText="设置关键词";
        a.addEventListener("click", ()=>{
            //获取关键字
            let str = GM_getValue("steam_blacklist",getBlacklistText(default_blacklist));
            blacklist = parseBlacklist(str);
            //显示文本
            document.getElementById("blacklist_text").value=getBlacklistText(blacklist);
            document.querySelector(".blacklist_hover").style.display="block";
        });
        a.href = "javascript:void(0);";

        let span = document.createElement("span");
        span.className="hide_blacklist_comments";
        span.appendChild(check);
        span.append("隐藏黑名单评论");
        span.append(count);
        span.append(a);
        document.querySelector(".user_reviews_summary_bar").appendChild(span);
        initAppView();

        //监控是否更新评论列表
        var observer = new MutationObserver(function (mutations, observer) {
            mutations.forEach(function(mutation) {
                if(mutation.target.style.display!="none")return;
                initAppView();
            });
        });
        //开始监控
        observer.observe(document.querySelector("#Reviews_loading"),{"attributes":true});
    }
    else{
        isStore = false;

        let check = document.createElement("input");
        check.type="checkbox";
        check.id="check_hide";
        check.checked = checked;
        check.addEventListener("click", hideComments);
        check.style = "vertical-align: top;";

        //打开设置对话框按钮
        let a = document.createElement("a");
        a.id="blacklist_settings";
        a.innerText="设置关键词";
        a.addEventListener("click", ()=>{
            //获取关键字
            let str = GM_getValue("steam_blacklist",getBlacklistText(default_blacklist));
            blacklist = parseBlacklist(str);
            //显示文本
            document.getElementById("blacklist_text").value=getBlacklistText(blacklist);
            document.querySelector(".blacklist_hover").style.display="block";
        });
        a.href = "javascript:void(0);";
        a.style="color: #67c1f5;";

        let span = document.createElement("span");
        span.className="hide_blacklist_comments";
        span.style = "float: right;color: #ffffff;";
        span.appendChild(check);
        span.append("隐藏黑名单评论");
        span.append(a);

        document.querySelector(".apphub_sectionTabs > div").before(span);
        initCommunityView();
    }
})();

//商店页面
function initAppView(){
    if(document.querySelector("#Reviews_loading").style.display!='none'){
        setTimeout(initAppView,500);
        return;
    }

    //黑名单总数
    let count = 0;
    blocked_comments_list = [];
    document.querySelectorAll(".review_ctn .review_box").forEach((item)=>{
        //右侧小评测
        if(item.classList.contains('short')){
            //添加显示和隐藏函数
            item.hideComment = function(){
                this.querySelector(".shortcol").hidden = true;
                if(this.querySelector(".hide_comment")!=null)this.querySelector(".hide_comment").innerText = "展开评测";
            };
            item.showComment = function(){
                this.querySelector(".shortcol").hidden = false;
                if(this.querySelector(".hide_comment")!=null)this.querySelector(".hide_comment").innerText = "折叠评测";
            };
            item.hasHidden = function(){
                return item.querySelector(".shortcol").hidden;
            }
            //添加按钮
            addFoldButton(item.querySelector(".short_header"),item);
        }
        //左侧大评测
        else if(item.querySelector(".rightcol")!=null){
            //添加显示和隐藏函数
            item.hideComment = function(){
                this.querySelector(".rightcol").hidden = true;
                if(this.querySelector(".hide_comment")!=null)this.querySelector(".hide_comment").innerText = "展开评测";
            };
            item.showComment = function(){
                this.querySelector(".rightcol").hidden = false;
                if(this.querySelector(".hide_comment")!=null)this.querySelector(".hide_comment").innerText = "折叠评测";
            };
            item.hasHidden = function(){
                return item.querySelector(".rightcol").hidden;
            }
            //添加按钮
            addFoldButton(item.querySelector(".num_reviews"),item);
        }
        //检查是否加入黑名单
        if(checkForBlacklist(item,item))count++;
    });

    document.getElementById("blacklist_comments_count").innerText=`(共${count}条)`;
    hideComments();
}

function initCommunityView(){
    var observer = new MutationObserver(function (mutations, observer) {
        mutations.forEach(function(mutation) {
            if(mutation.type!="childList")return;
            mutation.addedNodes.forEach((node)=>{
                if(!(/page\d+/).test(node.id))return;
                if(node.id=="page1")return;
                checkNewPage(node);
                hideComments();
            })
        });
    });
    //开始监控
    observer.observe(document.querySelector("#AppHubCards"),{"childList":true});
    checkNewPage(document.getElementById("page1"));
    hideComments();
}

//点击隐藏按钮
function hideComments(){
    if(document.getElementById("check_hide").checked){
        blocked_comments_list.forEach((item)=>{
            item.hideComment();
        });
    }
    else{
         blocked_comments_list.forEach((item)=>{
            item.showComment();
        });
    }
}

//添加折叠按钮
function addFoldButton(neighborDiv, targetDiv){
    if(neighborDiv==null||targetDiv==null)return;
    if(targetDiv.querySelector(".hide_comment")!=null)return;
    let a = document.createElement("a");
    a.style = "float: right;color: #66c0f4;";
    a.href = "javascript:void(0);";
    a.className = "hide_comment";
    a.addEventListener("click",()=>{
        if(targetDiv.hasHidden()){
            targetDiv.showComment();
        }
        else{
            targetDiv.hideComment();
        }
    })
    if(targetDiv.hasHidden())a.innerText="展开评测";
    else a.innerText="折叠评测";
    neighborDiv.after(a);
    return a;
}

function checkNewPage(page){
    //新页面，寻找所有测评文字块
    if(page==null)return;
    page.querySelectorAll(".apphub_UserReviewCardContent").forEach((item)=>{
        let commentString = item.querySelector(".apphub_CardTextContent").innerHTML.replace(/\t/g,"").replace(/\n/g,"").replace(/(<div[^>]*>[^<>]*<\/div>)|(<[^<]*>)/g,"");
        commentString = commentString.replace(/[^\u4e00-\u9fa5_a-zA-Z0-9]*/g,"");
        item.commentLength = commentString.length;
        //测评父节点
        let parent = item.parentNode;
        //隐藏消息div
        if(parent.querySelector(".hidden_message")==null){
                let div = document.createElement("div");
            div.className = "hidden_message";
            div.style = "text-align: center;color: yellow;font-size: 20px;transform: translateY(-200%);";
            div.innerText = `测评已隐藏，共${item.commentLength}字`;
            div.hidden = true;
            parent.querySelector(".UserReviewCardContent_Footer").prepend(div);
        }
        parent.hideComment = function(){
            this.querySelector(".apphub_UserReviewCardContent").hidden = true;
            this.querySelector(".hidden_message").hidden = false;
        };
        parent.showComment = function(){
            this.querySelector(".apphub_UserReviewCardContent").hidden = false;
            this.querySelector(".hidden_message").hidden = true;
        }
        //检查是否加入黑名单
        checkForBlacklist(item,parent);
    });
}

//黑名单列表转换为字符串
function getBlacklistText(blacklist){
    let str="";
    blacklist.forEach((item)=>{str+=item.toString()+"\n";})
    return str;
}
//字符串转换为黑名单列表
function parseBlacklist(blacklistString){
    let str_list = blacklistString.split("\n");
    let obj_list = [];
    str_list.forEach((item)=>{
        item = item.trim();
        if(item=="")return;
        if(/^\/.*\/$/.test(item)){
            obj_list.push(new RegExp(item.replace(/^\/(.*)\/$/,"$1")));
        }
        else obj_list.push(item);
    });
    return obj_list;
}
//检查是否加入黑名单
function checkForBlacklist(checkItem,pushItem){
    for(let i=0;i<blacklist.length;i++){
        if(checkItem.innerHTML.search(blacklist[i])!=-1){
            blocked_comments_list.push(pushItem);
            return true;
        }
    }
    return false;
}