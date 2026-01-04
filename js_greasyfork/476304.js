// ==UserScript==
// @name        weibo_clean
// @name:zh-CN  清净微博
// @description  clean timeline of weibo
// @description:zh-cn  清净的微博首页
// @match        https://weibo.com/*
// @version     2
// @run-at       document-start
// @namespace   https://weibo.com/
// @icon         https://weibo.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/476304/weibo_clean.user.js
// @updateURL https://update.greasyfork.org/scripts/476304/weibo_clean.meta.js
// ==/UserScript==

(
  function (){
    var mainpage_by_time = true;
    var ban_hotsearch = true;
    var ban_interest = true;
    const api_name_unread = "/ajax/feed/unreadfriendstimeline";
    const api_name_friendtimeline = "/ajax/feed/friendstimeline";
    const api_name_log = "/ajax/log/";
    const api_cards = "https://weibo.com/ajax/side/cards";
    var _xmlhttprequest = window.XMLHttpRequest;
    class weibo_httprequest extends _xmlhttprequest{
      get responseText(){
        var x = super.responseText;
        if ((ban_hotsearch || ban_interest) && this.responseURL == api_cards){
          var obj = JSON.parse(x);
          if (obj.ok == 1){
              var data = obj.data, p;
              if (ban_hotsearch){
                p = data.findIndex((card) => card.cardid == "1001_hot_search");
                if (p > -1) data.splice(p, 1);
              }
              if (ban_interest){
                p = data.findIndex((card) => card.cardid == "1001_interested");
                if (p > -1) data.splice(p, 1);
              }
              x = JSON.stringify(obj);
          }
        }
        return x;
      }
      open(){
        var url = arguments[1];
        if (url.startsWith(api_name_unread)) {
          arguments[1] = url.replace(api_name_unread, api_name_friendtimeline);
        }
        if (url.startsWith(api_name_log)){
          //this.abort();
          return;
        }
        super.open(...arguments);
      }
    }

    window.XMLHttpRequest = weibo_httprequest;
  }
)();
