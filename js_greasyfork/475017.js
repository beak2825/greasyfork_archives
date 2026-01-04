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
// @downloadURL https://update.greasyfork.org/scripts/475017/%E6%8A%96%E5%BA%97-%E7%B2%BE%E9%80%89%E8%81%94%E7%9B%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/475017/%E6%8A%96%E5%BA%97-%E7%B2%BE%E9%80%89%E8%81%94%E7%9B%9F.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function hasClass( _class ){
        return $("body").hasClass(_class);
    }

    // 关闭当前窗口
    function tabDelayClose(){
        setTimeout(function() { window.close();}, getRandomInt(3000, 6000));
    }

    // 随机数
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
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
        currDarenIndex: 0,
        // 批量发送按钮
        sBtn: $("<button></button>"),
        // log 日志显示框
        sLog: $("<div id='list-container'><table><tbody id='list-body'></tbody></table></div>"),
        getDaren:function(){
            return GM_getValue("currDaren");
        },
        // 监听更新状态
        update: function(){
            this.darenList = [];
            $(".auxo-sp-infinit-container").children().each(function(index,ele){
                var _darenUid = ele.dataset.itemUid;
                var _nickname = $(".list-table-info-right-name__nickname", ele).text();
                var _object = {uid: _darenUid, obj: ele, nickName: _nickname, status: Config.darenStatus_UnSend };

                var isExis = Daren.darenList.some(function(obj) {
                    return obj.uid === _darenUid;
                });
                if ( !isExis ){
                    Daren.darenList.push(_object);
                }
                // if (!Daren.darenList.includes(_object)) {}
            });

            // 只有数据变化的时候，在更新。防止死循环
            if ( GM_getValue("_saveTotal") != this.darenTotal() ){
                // 更新 按钮人数
                this.sBtn.text("批量发送私信（ " + this.darenTotal()  + " 人 ）");
                // 更新 log 日志框
                Daren.sLogUpdateDate(); 

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
            this.sBtn.css({position: "fixed",bottom: "50px",left: "10px",padding: "10px",backgroundColor: "blue",color: "white",cursor: "pointer"});
            $("body").append( this.sBtn );

            this.sBtn.click(function() {
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
                row.append($("<td>").text( truncateText( item.nickName, 8) ));

                var _str = "";
                if ( item.status == Config.darenStatus_UnSend ){
                    _str = "<label style='color: gray; font-size:12px;'>未发送</label>";
                }
                if ( item.status == Config.darenStatus_SendIng ){
                    _str = "<label style='color: gold; font-size:12px;'>发送中</label>";
                }
                if ( item.status == Config.SendSuccess ){
                    _str = "<label style='color: green; font-size:12px;'>成功</label>";
                }
                if ( item.status == Config.SendError ){
                    _str = "<label style='color: red; font-size:12px;'>失败</label>";
                }
              
                row.append($("<td>").html( _str ));

                $("#list-body").append(row);
            });
        },

        run:function(){
            var self = this;
            setInterval(function(){
                // 如果当前进行中的超过 2 个，则不继续执行
                var count = 0;
                for ( let i = 0; i < self.darenList.length; i++ ){
                    if ( self.darenList[i].status == Config.darenStatus_SendIng ){
                        count++;
                    }
                }
                if ( count > 1 ) {
                    console.log("当前进行中达人超过 2 人，暂停中");
                    return ;
                }

                // 获取 当前 可以操作的 达人
                for (let i = 0; i < self.darenList.length; i++) {
                    const item = self.darenList[i];
                    if (item.status === Config.darenStatus_UnSend) {
                        self.darenList[i].status = Config.darenStatus_SendIng;

                        GM_setValue("DarenStatus_" + item.nickName,  Config.darenStatus_SendIng);
                        item.obj.click();

                        break; // 提前终止循环
                    }
                }

            },5000);
        },
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

    // 达人详情
    var DarenDetail = {
        detailAutoOnlineChat: function(){
            // 达人详情页面，自动点击在线沟通按钮
            console.log("detailAutoOnlineChat");
            var currDaren = $(".daren-overview-base-nameblock__nickname").text();
            var darenStatus = GM_getValue("DarenStatus_" + currDaren );
            console.log("达人详情:" , currDaren, darenStatus );

            if ( darenStatus != Config.darenStatus_SendIng ){
                return false;
            }

            $(".dp__action-contact-online").click();

            tabDelayClose();
        }
    };

    var DarenMessage = {
        send: function(){
            var currDaren = $("div[class^='index-module__baseinfo_name___']").text();
            var darenStatus = GM_getValue("DarenStatus_" + currDaren );
            console.log("达人消息:" , currDaren, darenStatus );

            if ( darenStatus != Config.darenStatus_SendIng ){
                return false;
            }

            var str = "发送消息给用户" + currDaren + "，按Enter发送";
            var textareaElement = $('textarea[placeholder="' + str + '"]');

            if (textareaElement.length > 0) {
                textareaElement.val( "老板，有两款产品，一款同仁堂产品，另一款健康饮食产品，店铺5分，本月预计上东方甄选，可以合作一下。" );
            }

            $('button:contains("发送")').click();
            console.log("已经点击发送");
            // tabDelayClose();
        }
    }

    function main(){

        // 达人列表
        if( isPage() == Config.darenSquare ){
            Daren.sBtnCreate();  // 创建 执行按钮
            Daren.sLogCreate();  // 创建 日志框
            Daren.sLogUpdateDate();  // 更新数据
        }

        // 达人详情
        if ( isPage() == Config.darenProfile ){
            DarenDetail.detailAutoOnlineChat();
        }

        // 发送消息
        if (isPage() == Config.pigeonIm ){
            setTimeout(function(){ DarenMessage.send(); }, 5000 );
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