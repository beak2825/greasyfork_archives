// ==UserScript==
// @name         抖店-精选联盟
// @namespace    
// @version      0.1.1
// @description  抖店-精选联盟，批量发送私信
// @author       Gemor
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_getTabs
// @grant        GM_getTab
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @match        *://*.jinritemai.com/*
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_notification
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/474726/%E6%8A%96%E5%BA%97-%E7%B2%BE%E9%80%89%E8%81%94%E7%9B%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/474726/%E6%8A%96%E5%BA%97-%E7%B2%BE%E9%80%89%E8%81%94%E7%9B%9F.meta.js
// ==/UserScript==


(function() {
    'use strict';
    console.log("start");

    function hasClass( _class ){
        return $("body").hasClass(_class);
    }

    // 关闭当前窗口
    function tabClose(){
        setTimeout(function() { window.close();}, 2000);
    }

    // 截取字符串
    function truncateText(text, maxLength) {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + "...";
        } else {
            return text;
        }
    }

    const Config = {};
    Config.darenSquare = "darenSquare";
    Config.darenProfile = "darenProfile";
    Config.pigeonIm = "pigeonIm";

    // 达人状态
    Config.darenStatus_UnSend = "UnSend"; // 未发送
    Config.darenStatus_SendIng = "SendIng"; // 发送中
    Config.darenStatus_SendSuccess = "SendSuccess"; // 发送成功
    Config.darenStatus_SendError = "SendError"; // 发送失败

    // 达人
    var Daren = {
        // 达人列表
        darenList: [],
        currDaren: {},
        // 批量发送按钮
        sBtn: $("<button></button>"),
        // log 日志显示框
        sLog: $("<div id='list-container'><table><tbody id='list-body'></tbody></table></div>"),
        getDaren:function(){
            return GM_getValue("currDaren");
        },
        setDaren:function( name ){
            GM_setValue("currDaren", name);
        },
        // 监听更新状态
        update: function(){
            this.darenList = [];
            $(".auxo-sp-infinit-container").children().each(function(index,ele){
                var _darenUid = ele.dataset.itemUid;
                var _nickname = $(".list-table-info-right-name__nickname", ele).text();
                var _object = {uid: _darenUid, obj: ele, nickName: _nickname, status: Config.darenStatus_UnSend };

                console.log( _object );

                if (!Daren.darenList.includes(_object)) {
                    Daren.darenList.push(_object);
                }
            });

            // 只有数据变化的时候，在更新。防止死循环
            if ( GM_getValue("_saveTotal") != this.darenTotal() ){
                // this.sBtn.text("批量发送私信（ " + this.darenTotal()  + " 人 ）"); // 更新 按钮人数
                Daren.sLogUpdateDate(); // 更新 log 日志框

                GM_setValue("_saveTotal", this.darenTotal());
            }
        },
        // 达人总数
        darenTotal: function(){
            return this.darenList.length;
        },
        // 批量发送按钮创建
        sBtnCreate: function(){
            this.sBtn.text("批量发送私信（ " + this.darenTotal()  + " 人 ）");
            this.sBtn.css({position: "fixed",bottom: "50px",left: "50px",padding: "10px",backgroundColor: "blue",color: "white",cursor: "pointer"});
            $("body").append( this.sBtn );

            this.sBtn.click(function() {
                console.log("sBtnClick");
                Daren.run();
            });
        },
        // 达人列表，显示框创建
        sLogCreate: function(){
            this.sLog.css({
                position: "fixed",
                left: "50px",
                bottom:"100px",
                padding: "10px",
                color:"black",
                backgroundColor:"rgba(0,0,0,0.05)",
                borderRadius:"10px",
                overflow: "auto",
                width:"220px",
                height:"300px",
                cursor: "pointer"
            });
            $("body").append( this.sLog );
        },
        // 更新 达人列表
        sLogUpdateDate: function(){
            $("#list-body").empty();
            // 遍历数据并创建行
            $.each(this.darenList, function(index, item) {
                var row = $("<tr>");
                row.append($("<td>").text( truncateText( item.nickName, 10) ));
                //row.append($("<td>").html( "<label style='color:blue; font-size:12px;'>成功</label>" ));
                row.append($("<td>").html( "<label style='color: red; font-size:12px;'>失败</label>" ));

                $("#list-body").append(row);
            });
        },

        // 自动点击在线沟通按钮
        autoClickOnlineChat: function(){
            // 判断此达人页面 是否通过脚本自动打开的，如果不是，则退出
            var smitDaren = GM_getValue("currMaster");
            var currDaren = $(".daren-overview-base-nameblock__nickname").text();
            console.log("达人详情: smitDaren:", smitDaren, "currDaren:", currDaren);

            if ( currDaren != smitDaren ){
                return false;
            }

            $(".dp__action-contact-online").click();

            tabClose();
        },

        // 遍历 可以操作的 达人
        getMayDaren:function(){
            console.log("sBtnClick->run->getMayDaren");
            this.darenList.each(function( item ){
                if ( item.status == Config.darenStatus_UnSend ){
                    this.currDaren = item;
                }
            });
        },

        run:function(){
            console.log("sBtnClick->run");
            setInterval(function(){
                this.getMayDaren();
                this.currDaren.obj.click();
            },3000);
        },
    }

    function getAllMaster(){
        $(".auxo-sp-infinit-container").children().each(function(index,ele){
            if ( index == 2 ){
                var nickName = $(".list-table-info-right-name__nickname", ele).text();
                GM_setValue("currMaster", nickName );
                $(ele).click();
            }
        });
    }



    // 当前页面
    function isPage(){
        var currentUrl = window.location.pathname;
        if ( currentUrl == '/dashboard/servicehall/daren-square'){
            return Config.darenSquare;
        }

        if ( currentUrl == '/dashboard/servicehall/daren-profile'){
            return Config.darenProfile;
        }

        if (currentUrl == '/mpa/pigeonIM'){
            return Config.pigeonIm;
        }
    }

    function sendMsg(){
        var smitDaren = GM_getValue("currMaster");
        var str = "发送消息给用户" + GM_getValue("currMaster") + "，按Enter发送";
        var textareaElement = $('textarea[placeholder="' + str + '"]');

        if (textareaElement.length > 0) {
            textareaElement.val( "老板我们有两款产品可以合作，其中一款9月份会上东方甄选，可以合作一下" );

            var buttonText = "发送";
            var sendButton = $('button:contains("' + buttonText + '")');
            if (sendButton.length > 0) {
                sendButton.click();

                tabClose();
            } else{
                console.log("未找到");
            }
        }
    }

    function main(){

        // 达人列表
        if( isPage() == Config.darenSquare ){
            Daren.sBtnCreate();  // 创建 执行按钮
            Daren.sLogCreate();  // 创建 日志框
        }

        // 达人详情
        if ( isPage() == Config.darenProfile ){
            profileCanExecute();
        }

        // 发送消息
        if (isPage() == Config.pigeonIm ){
            setTimeout(function(){ sendMsg(); }, 3000 );
        }
    }

        // 监听变化
    var observer = new MutationObserver(function(mutationsList) {
        mutationsList.forEach(function(mutation) {
            Daren.update();
        });
    });
    observer.observe(document.querySelector("body"), { childList: true, subtree: true });

    $(document).ready(function () {
       setTimeout(function() {
           main();
       }, 6000);
    });

})();