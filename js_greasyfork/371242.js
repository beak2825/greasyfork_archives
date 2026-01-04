// ==UserScript==
// @name         斗鱼纯净模式（IG牛批！我们是冠军！）
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  原斗鱼（广告/活动/弹幕）屏蔽，提供超纯净模式
// @author       hulala
// @icon         https://www.douyu.com/favicon.ico
// @match        *://www.douyu.com/*
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @require      https://cdn.staticfile.org/moment.js/2.22.2/moment.min.js
// @require      https://cdn.staticfile.org/feather-icons/4.9.0/feather.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371242/%E6%96%97%E9%B1%BC%E7%BA%AF%E5%87%80%E6%A8%A1%E5%BC%8F%EF%BC%88IG%E7%89%9B%E6%89%B9%EF%BC%81%E6%88%91%E4%BB%AC%E6%98%AF%E5%86%A0%E5%86%9B%EF%BC%81%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/371242/%E6%96%97%E9%B1%BC%E7%BA%AF%E5%87%80%E6%A8%A1%E5%BC%8F%EF%BC%88IG%E7%89%9B%E6%89%B9%EF%BC%81%E6%88%91%E4%BB%AC%E6%98%AF%E5%86%A0%E5%86%9B%EF%BC%81%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.$$jq = jQuery.noConflict(true);
    var time = 0;
    var binded = false;
    var chatcache = {
      _count_: 0,
      _total_: 0
    };
    window.chats = chatcache;
    
    var HULALA_HIDE = new Array(
        ".room-ad-video-down",
        ".valentine1807",
        ".adsRoot_7c5z4",
        ".chat-ad",
        "#js-annual1809",
        ".Annual1809",
        ".room-ad-bottom",
        "#js-chat-notice",
        ".column.rec",
        "#js-recommand",
        ".recommendAD-824567",
        ".recommendApp-cbeff7",
        ".broadcastDiv-343e1a",
        ".PaladinPop",
        ".no-login",
        "#js-annual1809",
        ".Annual1809-gifttip",
        ".giftbatter-noble-enter",
        ".Bottom",
        ".vote-tips-pop",
        "[data-component-id=view]",
        "[data-component-id=ladderNav]"
    );
    
    var HULALA_DEL = new Array(
        "#js-annual1809",
        "#js-room-activity",
        ".ACT110913",
        ".giftbatter-box",
        ".Bottom",
        ".ToolbarActivityArea",
        ".Title-columnTag",
        ".PlayerToolbar-Task",
        "#js-background-holder",
        ".layout-TopButton--diy",
    );

    var removeAD = function(){
        var gifts = $$jq("#listId").parent().parent();
        var chat = $$jq(".PlayerCaseSub-Main.is-unlogin");

        for (var i = 0;i<HULALA_HIDE.length; i++){
            $$jq(HULALA_HIDE[i]).css("display", "none");
        }

        for (var i = 0;i<HULALA_DEL.length; i++) {
            $$jq(HULALA_DEL[i]).remove();
        }

        gifts.css("display","none");
        chat.css("top", "0px");
    }
    

    removeAD();

    var timer = window.setInterval(function() {
        removeAD();
        time++;
        if(time >= 15 && timer) {
            window.clearInterval(timer);
            timer = null;
        }
    }, 3000);
 
    var chatHandler = function(e){
        var node = e.target;
      
        if (node.tagName === 'LI') {
          var user = $$jq(node);
          
          user.find(".Barrage-icon,.Motor,.UserLevel").hide();
          user.find(".chat-icon-pad, .motorcade-icon").hide();
          
          if (user.hasClass("status-low-enter") || user.find(".Barrage-userEnter").length > 0) {
            user.hide();
          }
          
          var username = user.find(".Barrage-nickName").attr("title") || user.find(".js-nick").data("nn") || user.find(".js-nick").text().trim();
          var userid = user.find(".Barrage-nickName").data("uid") || user.find(".js-nick").attr("rel");
          var usersay = user.find(".Barrage-content").text().trim() || user.find("[chatid]").text().trim();
          var timestamp = new Date().getTime();
          
          
          if (!usersay) {
            user.hide();
          }
          if (node.innerText.indexOf('欢迎来到本直播间') !== -1) {

              if(!chatcache[userid]) {
                chatcache[userid] = {
                  name: String(username),
                  chats: [],
                  time: moment(timestamp).format("YYYY-MM-DD HH:mm:ss"),
                  timestamp: timestamp
                };
                chatcache._count_ ++;
              }

          }

          if(!chatcache[userid]) {
            chatcache[userid] = {
              name: String(username),
              chats: [],
              time: moment(timestamp).format("YYYY-MM-DD HH:mm:ss"),
              timestamp: timestamp
            };
            chatcache._count_ ++;
          }
          var tc = chatcache._count_;
          if(chatcache._count_ > 999) {
            tc = "999+";
          }
          $$jq("#chatman").text(tc).attr("title", `共${chatcache._count_}人`);
          
          if (usersay) {
            chatcache[userid].chats.push({
              say: usersay,
              time: moment(timestamp).format("YYYY-MM-DD HH:mm:ss"),
              timestamp: timestamp
            });
            chatcache._total_ ++;
            var tt = chatcache._total_;
            if(chatcache._total_ > 999) {
              tt = "999+";
            }
            $$jq("#chattotal").text(tt).attr("title", `共${chatcache._total_}条弹幕`);
          }
        }
    }
  
    var removeWelcome = function(){
        if(binded){
          return;
        }
        var chatlist = $$jq('.layout-Player-aside');
        chatlist.on("DOMNodeInserted", "#js-barrage-list",chatHandler);
        var spelist = $$jq(".PlayerCaseSub-Main");
        spelist.on("DOMNodeInserted",'[data-type="chat-list"]',chatHandler);
        binded = true;
    }
    
    var closeChat = function(){
      $$jq("[class^=comment]").css("visibility","hidden");
    }
    
    var rightChat = function(){
      $$jq("#js-player-barrage").css("top","0px");
      $$jq(".Barrage-toolbar").css("marginTop","0px");
      $$jq(".layout-Player-rankAll,.layout-Player-rank,#js-floatingbarrage-container").remove();
      if($$jq(".Barrage").find("#chattitle").length <= 0) {
          $$jq(".Barrage").prepend(
          `<div id="chattitle" style="
              position: absolute;
              width: 100%;
              z-index: 2;
              line-height: 40px;
              font-size: 16px;
              text-align: left;
              text-indent: 12px;
              background: #fff;
              color: #797f89;">聊天窗口
              <span style="font-size:12px;padding-left: 8px;">
              <b id="chatman">0</b>人/<b id="chattotal">0</b>条弹幕
              </span>
          </div>`
        );
      }
      $$jq("#js-barrage-list").parent().css("top","38px");
      $$jq(".Barrage-toolbar").css({
        "right": "-46px",
        "top": "10px",
        "left": "auto",
        "display": "block"
      });
      $$jq(".Barrage-toolbarLock,.Barrage-toolbarClear").css({
        "border": "0px",
        "padding": "0px 4px",
        "margin": "0px"
      });
      $$jq("#js-fans-rank").remove();
      $$jq("#js-chat-cont").css("top","0px");
    }
    
    
    var layoutMainMarginLeft = "0px";
    var roomBackground = "none";
    
    var createTool = function() {
      var body = $$jq("body");
      if($$jq("#js-hulala-tool").length > 0) {
        return ;
      }
      body.append(
        `<div id="js-hulala-tool" style="
            position: fixed;
            background: #000;
            color: #FFF;
            font-size: 14px;
            font-weight: bold;
            width: 150px;
            height: 50px;
            line-height: 50px;
            cursor: pointer;
            z-index: 10000;
            right: 48px;
            top: 0px;
            text-align: center;
        ">
          <span data-trigger="open">
            <i data-feather="zap" style="
              width: 18px;
              vertical-align: middle;
              padding-right: 4px;">
            </i>开启纯净模式
          </span>
          <span data-trigger="close" style="display:none;">
            <i data-feather="zap" style="
              width: 18px;
              vertical-align: middle;
              color: #000;
              padding-right: 4px;">
            </i>关闭纯净模式
          </span>
        </div>`
      );
      feather.replace();
      layoutMainMarginLeft = $$jq(".layout-Main").css("marginLeft");
      roomBackground = $$jq("[data-component-id=room]").css("background");
      $$jq("#js-hulala-tool").on("click", function(e){
        var node = $$jq(e.currentTarget);
        var status = node.data("status") || "false";
        node.data("status", status === "true" ? "false" : "true");
        status = node.data("status");
        if(status === "true") {
           node.find('[data-trigger="close"]').show();
           node.find('[data-trigger="open"]').hide();
           node.css({
             background: "#fff",
             color: "#000"
           });
           openMini();
        } else {
           node.find('[data-trigger="open"]').show();
           node.find('[data-trigger="close"]').hide();
            node.css({
             background: "#000",
             color: "#fff"
           });
           closeMini();
        }
      });
    }
    
    var miniMap = [
      "#js-player-title",
      "#js-player-toolbar",
      "#js-header",
      ".layout-Aside",
      "#js-stats-and-actions",
      "#anchor-info",
      ".lol-activity",
      "[data-component-id=header]"
    ];
    
    var openMini = function() {
      
      for(var i = 0; i < miniMap.length; i++) {
          $$jq(miniMap[i]).hide();
      }
      $$jq("body, html").css("background", "#000");
      $$jq(".layout-Main").css("margin", "0px auto");
      
      var video = $$jq("#js-room-video");
      if($$jq("#room-html5-player").length > 0) {
        video = $$jq("#room-html5-player");
      }
      var width = video.width();
      var height = video.height() - $$jq("[class^=controlbar]").height();
      
      $$jq("[id^=__video], [class^=screenshot]").css("width", width);
      $$jq("[id^=__video], [class^=screenshot]").css("height", height);
      $$jq("[class^=controlbar]").css("width",width);
      $$jq(".layout-Container").css("background","none");
      $$jq("[data-component-id=room]").css("background", "none");
      if($$jq("[data-component-id=room]").length > 0) {
        $$jq("[data-component-id=room]").css("marginTop", "100px");
      }
    }
    
    var closeMini = function() {
      for(var i = 0; i < miniMap.length; i++) {
          $$jq(miniMap[i]).show();
      }
      $$jq("body, html").css("background", "#fff");
      $$jq(".layout-Main").css("marginLeft",layoutMainMarginLeft);
      
      var video = $$jq("#js-room-video");
      if($$jq("#room-html5-player").length > 0) {
        video = $$jq("#room-html5-player");
      }
      var width = video.width();
      var height = video.height() - $$jq("[class^=controlbar]").height();
      
      $$jq("[id^=__video], [class^=screenshot]").css("width", width);
      $$jq("[id^=__video], [class^=screenshot]").css("height", height);
      $$jq("[class^=controlbar]").css("width",width);
      $$jq("[data-component-id=room]").css("background", roomBackground);
      $$jq("[data-component-id=room]").css("marginTop", "0px");
    }
   
    
    window.setInterval(function(){
      removeWelcome();
      //closeChat();
      rightChat();
      createTool();
    }, 1000);
})();